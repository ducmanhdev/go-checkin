<template>
  <section>
    <div class="mb-3 md:flex items-center justify-between gap-3">
      <h2 class="heading-1 mb-0">Reward</h2>
      <div class="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-[250px_auto_auto] xl:grid-cols-[400px_auto_auto] mt-3 md:mt-0">
        <input-search v-model="search" @input-debounce="handleSearch" class="col-span-full md:col-span-1"/>
        <a-button
          type="primary"
          ghost
          @click="$router.push({name: 'reward-history'})"
        >
          Reward History
        </a-button>
        <a-button
          type="primary"
          @click="handleShowDrawer"
        >
          <plus-circle-outlined/>
          Add new
        </a-button>
      </div>
    </div>
    <div class="mt-4">
      <a-table
        v-if="largerThanMd"
        class="custom-table header-transparent"
        :columns="columns"
        :data-source="data?.data"
        :loading="isGetDataLoading"
        :custom-row="handleCustomRow"
        row-class-name="cursor-pointer"
        :pagination="{
       position: ['bottomCenter'],
       current: data?._meta?.currentPage,
       total: data?._meta?.totalCount,
       pageSize: data?._meta?.perPage,
       showSizeChanger: false,
    }"
        @change="handleTablePaginationChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <check-outlined class="text-lg !text-primary" v-if="record.is_active === 1"/>
            <close-circle-outlined class="text-lg !text-error" v-if="record.is_active === 0"/>
          </template>
          <template v-if="column.dataIndex === 'discount'">
            {{ record?.logic_value }}{{ record?.logic_type === 'usd' ? '$' : '%' }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button
              type="text"
              @click.stop="handleDelete(record.id)"
              class="text-C82"
            >
              <delete-outlined />
            </a-button>
          </template>
        </template>
      </a-table>
      <div v-else>
        <base-loading-skeleton class="card" v-if="isGetDataLoading"/>
        <a-empty v-else-if="!data?.data?.length"/>
        <div class="space-y-4" v-else>
          <reward-table-mobile-item
            v-for="reward in data?.data"
            :key="reward.id!"
            :data="reward"
            @delete="handleDelete"
            @edit="handleEdit"
          />
          <div class="flex justify-center mt-4">
            <a-pagination
              :current="data?._meta?.currentPage"
              :total="data?._meta?.totalCount"
              :page-size="data?._meta?.perPage"
              :show-size-changer="false"
              @change="handlePaginationChange"
            />
          </div>
        </div>
      </div>
    </div>

    <drawer
      ref="drawerRef"
      @refresh="handleGetData"
    />
  </section>
</template>

<script setup lang="ts">
import {ref} from "vue";
import InputSearch from '@/components/InputSearch.vue';
import {CheckOutlined, CloseCircleOutlined, DeleteOutlined, PlusCircleOutlined} from "@ant-design/icons-vue";
import Drawer from './RewardDrawer.vue';
import type {DataWithMetaResponse, GetListRewardResponse} from "gap-nodejs-sdk";
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import RewardTableMobileItem from "@/views/reward/RewardTableMobileItem.vue";
import {useRootStore} from "@/stores/root";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";
import {notification} from "ant-design-vue";
import type {TableProps} from "ant-design-vue";
import {breakpointsTailwind, useBreakpoints} from '@vueuse/core';

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');
const search = ref('');

const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const handleShowDrawer = (record: GetListRewardResponse[number]) => {
  drawerRef.value?.show(record);
}

const rootStore = useRootStore();
const columns = [
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: 'REWARD CONTENT',
    dataIndex: 'content',
    key: 'content',
    align: 'center',
  },
  {
    title: 'POINT',
    dataIndex: 'point',
    key: 'point',
    align: 'center',
  },
  {
    title: 'DISCOUNT VALUE',
    dataIndex: 'discount',
    key: 'discount',
    align: 'center',
  },
  {
    title: 'ACTION',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
  },
];
const handleCustomRow = (record: GetListRewardResponse[number]) => {
  return {
    onClick: () => handleEdit(record),
  }
};

const data = ref<
  DataWithMetaResponse<GetListRewardResponse> |
  null
>(null);

const isGetDataLoading = ref(false);
const handleGetData = async (page: number = 1, perPage = 10) => {
  try {
    isGetDataLoading.value = true;
    data.value = await goCheckInSdk.reward.getListReward({
      page: page,
      'per-page': perPage,
      content: search.value,
    });
  } catch (error) {
    handleError({error})
  } finally {
    isGetDataLoading.value = false;
  }
};
handleGetData();
const handleSearch = () => {
  handleGetData();
}
const handleDelete = async (id: number) => {
  try {
    await rootStore.confirm({
      headerTitle: 'Delete reward',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete item?',
    });
    await goCheckInSdk.reward.deleteReward({id});
    handleGetData();
    notification.success({
      message: 'Delete reward success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  }
};
const handleEdit = handleShowDrawer;
const handleTablePaginationChange: TableProps["onChange"] = (pagination, filters, sorter) => {
  handleGetData(pagination.current)
};
const handlePaginationChange = (page: number, pageSize: number) => {
  handleGetData(page, pageSize)
};
</script>

<style lang="scss">
</style>
