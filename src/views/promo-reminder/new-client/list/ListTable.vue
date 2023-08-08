<template>
  <a-table
    v-if="largerThanMd"
    class="custom-table header-transparent"
    :columns="columns"
    :data-source="data"
    :loading="isGetDataLoading"
    :custom-row="handleCustomRow"
    row-class-name="cursor-pointer"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'campaign'">
        <p class="mb-0">{{ record.name }}</p>
        <p class="mb-0">Promotion to be received upon your First Signed In.</p>
      </template>
      <template v-if="column.dataIndex === 'discount'">
        <p class="mb-0 text-lg">{{ record.logic_value }}{{ record.logic_type === 'usd' ? '$' : '%' }}</p>
      </template>
      <template v-if="column.dataIndex === 'active'">
        <check-outlined class="text-lg !text-primary" v-if="record.is_active === 1"/>
        <close-circle-outlined class="text-lg !text-error" v-if="record.is_active === 0"/>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <a-button
          type="primary"
          @click.stop="handleShowDrawer(record)"
          class="p-0 !w-9 !h-9 !min-w-0"
        >
          <form-outlined/>
        </a-button>
      </template>
    </template>
  </a-table>
  <div v-else>
    <base-loading-skeleton class="card" v-if="isGetDataLoading"/>
    <a-empty v-else-if="!data?.length"/>
    <div class="space-y-4" v-else>
      <list-table-mobile-item
        v-for="item in data"
        :key="item.id!"
        :data="item"
        @edit="handleShowDrawer"
      />
    </div>
  </div>

  <drawer
    ref="drawerRef"
    @refresh="handleGetData"
  />
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import type {TableProps, PaginationProps} from 'ant-design-vue';
import {CloseCircleOutlined, CheckOutlined, FormOutlined} from "@ant-design/icons-vue";
import handleError from "@/utils/error";
import type {
  GetCampaignFirstSignUpResponse,
} from "gap-nodejs-sdk";
import {useDebounce} from "@/utils/debounce";
import ListTableMobileItem from "./ListTableMobileItem.vue";
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import Drawer from "./Drawer.vue";
import {goCheckInSdk} from "@/sdk";
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";

type Props = {
  search: string,
}
const props = defineProps<Props>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');

const data = ref<
  Array<GetCampaignFirstSignUpResponse> |
  null
>(null);

const isGetDataLoading = ref(false);
const handleGetData = async (page = 1, pageSize = 10) => {
  try {
    isGetDataLoading.value = true;
    const res = await goCheckInSdk.campaign.getCampaignFirstSignUp({
      page: page,
      'per-page': pageSize,
      keyword: props.search
    });
    data.value = [res];
  } catch (error) {
    handleError({error})
  } finally {
    isGetDataLoading.value = false;
  }
};
handleGetData();
watch(
  () => props.search,
  useDebounce(() => handleGetData()),
);

const handleTablePaginationChange: TableProps["onChange"] = (pagination, filters, sorter) => {
  handleGetData(pagination.current)
};
const handlePaginationChange: PaginationProps["onChange"] = (page, pageSize) => {
  handleGetData(page, pageSize)
};
const columns = [
  {
    title: 'CAMPAIGN',
    dataIndex: 'campaign',
    key: 'campaign',
  },
  {
    title: 'DISCOUNT',
    dataIndex: 'discount',
    key: 'discount',
    align: 'center',
  },
  {
    title: 'ACTIVE',
    dataIndex: 'active',
    key: 'active',
    align: 'center',
  },
  {
    title: 'ACTION',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
  },
];
const handleCustomRow = (record: GetCampaignFirstSignUpResponse) => {
  return {
    onClick: () => handleShowDrawer(record),
  }
};

const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const isShowDrawerLoading = ref(false);
const handleShowDrawer = (data: GetCampaignFirstSignUpResponse) => {
  drawerRef.value?.show(data);
};
</script>

<style lang="scss" scoped>
.custom-table {
  --col-y-padding: 40px;
  --col-x-padding: 40px;
}

//$breakpoint: 1600px;
//.custom-table {
//  th, td {
//    @media screen and (min-width: ($breakpoint + 1)) {
//      &:nth-child(2) {
//        display: none;
//      }
//    }
//    @media screen and (max-width: $breakpoint) {
//      &:nth-child(3),
//      &:nth-child(4),
//      &:nth-child(5),
//      &:nth-child(6) {
//        display: none;
//      }
//    }
//  }
//}
</style>
