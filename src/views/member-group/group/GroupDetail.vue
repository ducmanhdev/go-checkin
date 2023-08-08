<template>
  <div>
    <div class="mb-4 sm:flex items-center justify-between gap-3">
      <h2 class="heading-1 flex items-center gap-2 mb-3 sm:mb-0">
        <router-link :to="{name: 'group'}" class="inline-block md:hidden">
          <img src="@/assets/images/icon-arrow-left.svg" alt="">
        </router-link>
        Details
      </h2>
      <div class="flex gap-3">
        <a-button
          v-if="selectedRowKeys?.length"
          type="primary"
          danger
          :loading="isRemoveCustomersLoading"
          @click="handleRemoveCustomers"
          class="flex-1 sm:flex-initial"
        >
          Delete
        </a-button>
        <a-button
          type="primary"
          @click="handleShowAddNewCustomers"
          class="flex-1 sm:flex-initial"
        >
          <plus-circle-outlined/>
          Add new
        </a-button>
      </div>
    </div>

    <!-- DESKTOP -->
    <a-table
      v-if="largerThanMd"
      class="custom-table header-transparent !-mt-4"
      :columns="columns"
      :data-source="data?.data"
      :loading="isGetDataLoading"
      :row-key="((record: any) => record.customer.id)"
      :pagination="{
           position: ['bottomCenter'],
           current: data?._meta?.currentPage,
           total: data?._meta?.totalCount,
           pageSize: data?._meta?.perPage,
           showSizeChanger: false,
        }"
      :row-selection="rowSelection"
      @change="handleTablePaginationChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <div class="flex items-center gap-3 ">
            <div
              class="shrink-0 w-9 h-9 rounded-full flex justify-center items-center p-1 bg-C9 text-white text-base font-semibold capitalize">
              <template v-if="record?.customer?.full_name">
                {{ record?.customer?.full_name?.charAt(0) }}
              </template>
              <user-outlined v-else/>
            </div>
            <div class="grow text-left">
              <p class="font-semibold mb-0.5 line-clamp-2">{{ record?.customer?.full_name || 'N/A' }}</p>
              <p class="flex items-center gap-1 mb-0">
                <phone-outlined :rotate="90"/>
                {{ usePhoneFormat(record?.customer?.phone) }}
              </p>
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'current_point'">
          {{ record?.customer?.current_point }}
        </template>
        <template v-if="column.dataIndex === 'lifetime_point'">
          {{ record?.customer?.lifetime_point }}
        </template>
      </template>
    </a-table>
    <!-- MOBILE -->
    <template v-else>
      <base-loading-skeleton class="card" v-if="isGetDataLoading"/>
      <p class="text-C84 text-center py-4 mb-0" v-else-if="!data?.data?.length">No data available</p>
      <div class="space-y-4" v-else>
        <div class="card-sm space-y-3" v-for="(record, index) in data?.data" :key="index">
          <div class="grid grid-cols-2 gap-3">
            <div class="">
              <a-checkbox
                :checked="selectedRowKeys.includes(record.customer.id)"
                @change="handleSelectRowMobile(record.customer.id)"
              />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3" v-for="(column) in columns" :key="column.key">
            <div class="text-C84 font-semibold">{{ column.title }}</div>
            <div>
              <template v-if="column.dataIndex === 'name'">
                <div
                  class="shrink-0 w-9 h-9 rounded-full flex justify-center items-center p-1 bg-C9 text-white text-base font-semibold capitalize mb-1">
                  <template v-if="record?.customer?.full_name">
                    {{ record?.customer?.full_name?.charAt(0) }}
                  </template>
                  <user-outlined v-else/>
                </div>
                <div class="grow text-left">
                  <p class="font-semibold mb-0.5 line-clamp-2">{{ record?.customer?.full_name || 'N/A' }}</p>
                  <p class="flex items-center gap-1 mb-0">
                    <phone-outlined :rotate="90"/>
                    {{ usePhoneFormat(record?.customer?.phone) }}
                  </p>
                </div>
              </template>
              <template v-if="column.dataIndex === 'current_point'">
                {{ record?.customer?.current_point }}
              </template>
              <template v-if="column.dataIndex === 'lifetime_point'">
                {{ record?.customer?.lifetime_point }}
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <a-pagination
          :current="data?._meta?.currentPage"
          :total="data?._meta?.totalCount"
          :page-size="data?._meta?.perPage"
          :show-size-changer="false"
          @change="handlePaginationChange"
        />
      </div>
    </template>

    <drawer-add-customer
      :group-id="currentGroupId"
      ref="drawerAddCustomerRef"
      @success="handleGetData"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, ref, unref, watch} from 'vue';
import {PhoneOutlined, UserOutlined, PlusCircleOutlined} from "@ant-design/icons-vue";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";
import type {DataWithMetaResponse, GetGroupResponse} from "gap-nodejs-sdk";
import {usePhoneFormat} from "@/utils/formatter";
import {notification} from "ant-design-vue";
import type {TableProps, PaginationProps} from "ant-design-vue";
import DrawerAddCustomer from "./DrawerAddCustomer.vue";
import {useRoute} from 'vue-router';
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');

const route = useRoute();
const drawerAddCustomerRef = ref<InstanceType<typeof DrawerAddCustomer> | null>(null);
const handleShowAddNewCustomers = () => {
  drawerAddCustomerRef?.value?.show();
}

const selectedRowKeys = ref<number[]>([]);

const currentGroupId = computed(() => Number(route.params.id));
const data = ref<DataWithMetaResponse<GetGroupResponse> | null>(null);
const isGetDataLoading = ref(false);
const handleGetData = async (page = 1, pageSize = 10) => {
  if (!currentGroupId.value) return;
  try {
    isGetDataLoading.value = true;
    selectedRowKeys.value = [];
    data.value = await goCheckInSdk.group.getGroup({
      id: currentGroupId.value,
      page: page,
      'per-page': pageSize,
      // keyword: search.value,
    });
  } catch (error) {
    handleError({error});
  } finally {
    isGetDataLoading.value = false;
  }
}

watch(currentGroupId, () => {
  handleGetData();
}, {
  immediate: true,
});

const handleTablePaginationChange: TableProps["onChange"] = (pagination, filters, sorter) => {
  handleGetData(pagination.current)
};
const columns = [
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'POINT',
    dataIndex: 'current_point',
    key: 'current_point',
    align: 'center'
  },
  {
    title: 'LIFE TIME POINT',
    dataIndex: 'lifetime_point',
    key: 'lifetime_point',
    align: 'center'
  },
];
const handleSelectRow = (keys: number[]) => {
  selectedRowKeys.value = keys;
};
const handleSelectRowMobile = (key: number) => {
  if (selectedRowKeys.value.includes(key)) {
    return selectedRowKeys.value = selectedRowKeys.value.filter((_key: number) => _key !== key);
  }
  selectedRowKeys.value.push(key);
}
const rowSelection = computed(() => ({
  selectedRowKeys: unref(selectedRowKeys),
  onChange: handleSelectRow,
}));
const isRemoveCustomersLoading = ref(false);
const handleRemoveCustomers = async () => {
  try {
    isRemoveCustomersLoading.value = true;
    await goCheckInSdk.group.removeCustomers({
      id: currentGroupId.value,
      customer_ids: selectedRowKeys.value.join(','),
    });
    handleGetData();
    notification.success({
      message: 'Remove customers success',
    });
  } catch (error) {
    handleError({error})
  } finally {
    isRemoveCustomersLoading.value = false;
  }
};

const handlePaginationChange: PaginationProps["onChange"] = (page, pageSize) => {
  handleGetData(page, pageSize)
};
</script>

<style scoped>

</style>
