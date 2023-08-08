<template>
  <a-table
    v-if="largerThanMd"
    class="custom-table header-transparent"
    :columns="columns"
    :data-source="data?.data"
    :loading="isGetDataLoading"
    :pagination="{
           position: ['bottomCenter'],
           current: data?._meta?.currentPage,
           total: data?._meta?.totalCount,
           pageSize: data?._meta?.perPage,
           showSizeChanger: false,
        }"
    @change="handleTablePaginationChange"
    :custom-row="handleCustomRow"
    row-class-name="cursor-pointer"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'active'">
        <check-outlined class="text-lg !text-primary" v-if="record.is_active === 1"/>
        <close-circle-outlined class="text-lg !text-error" v-if="record.is_active === 0"/>
      </template>
      <template v-if="column.dataIndex === 'promotion'">
        <div class="space-y-1">
          <p class="text-primary font-semibold mb-0">Everyone</p>
          <p class="mb-0">{{ record.name }}</p>
          <p class="inline-flex items-center gap-2 mb-0">
            <calendar-outlined/>
            <span>Send {{ record?.birthday_campaign?.before_date }} days in advance</span>
          </p>
        </div>
      </template>
      <template v-if="column.dataIndex === 'group'">
        <p class="text-primary font-semibold mb-0">Everyone</p>
      </template>
      <template v-if="column.dataIndex === 'name'">
        {{ record.name }}
      </template>
      <template v-if="column.dataIndex === 'discount'">
        <p class="mb-0">
          <span class="text-C84 mr-2">Discount:</span>
          <span class="text-base font-semibold">
            {{ record.logic_value + (record.logic_type === 'percent' ? '%' : '$') }}
          </span>
        </p>
      </template>
      <template v-if="column.dataIndex === 'condition'">
        <p class="inline-flex items-center gap-2 mb-0">
          <calendar-outlined/>
          <span>Send {{ record?.birthday_campaign?.before_date }} days in advance</span>
        </p>
      </template>
      <template v-if="column.dataIndex === 'expired_day_in'">
        {{ record.expired_day_in }} days
      </template>
      <template v-if="column.dataIndex === 'total_delivered'">
        {{ record?.campaign_report?.total_receive_message }}
      </template>
      <template v-if="column.dataIndex === 'redemption'">
        {{ record?.campaign_report?.total_redemption }}
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="text-right">
          <a-button
            type="primary"
            @click.stop="$router.push({name: 'birthday-detail', params: {id: record.id}})"
            class="!min-w-[110px]"
          >
            See detail
          </a-button>
        </div>
      </template>
    </template>
  </a-table>
  <div v-else>
    <base-loading-skeleton class="card" v-if="isGetDataLoading"/>
    <a-empty v-else-if="!data?.data?.length"/>
    <div class="space-y-4" v-else>
      <list-table-mobile-item
        v-for="item in data?.data"
        :key="item.id!"
        :data="item"
        @edit="handleShowDrawer"
      />
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
  </div>

  <drawer
    ref="drawerRef"
    @refresh="handleGetData"
  />
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import type {PaginationProps, TableProps} from "ant-design-vue";
import {CalendarOutlined, CloseCircleOutlined, CheckOutlined} from "@ant-design/icons-vue";
import handleError from "@/utils/error";
import type {
  DataWithMetaResponse,
  GetCampaignBirthdayListResponse,
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
  DataWithMetaResponse<GetCampaignBirthdayListResponse> |
  null
>(null);

const isGetDataLoading = ref(false);
const handleGetData = async (page = 1, pageSize = 5) => {
  try {
    isGetDataLoading.value = true;
    data.value = await goCheckInSdk.campaign.getCampaignBirthdayList({
      page: page,
      'per-page': pageSize,
      keyword: props.search
    });
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
    title: 'ACTIVE',
    dataIndex: 'active',
    key: 'active',
    align: 'center',
  },
  {
    title: 'PROMOTION',
    dataIndex: 'promotion',
    key: 'promotion',
  },
  {
    title: 'GROUP',
    dataIndex: 'group',
    key: 'group',
    align: 'center',
  },
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'DISCOUNT',
    dataIndex: 'discount',
    key: 'discount',
    align: 'center',
  },
  {
    title: 'CONDITION',
    dataIndex: 'condition',
    key: 'condition',
    align: 'center',
  },
  {
    title: 'EXPIRED DAY IN',
    dataIndex: 'expired_day_in',
    key: 'expired_day_in',
    align: 'center',
  },
  {
    title: 'TOTAL DELIVERED',
    dataIndex: 'total_delivered',
    key: 'total_delivered',
    align: 'center'
  },
  {
    title: 'REDEMPTION',
    dataIndex: 'redemption',
    key: 'redemption',
    align: 'center'
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
  },
];
const handleCustomRow = (record: GetCampaignBirthdayListResponse[number]) => {
  return {
    onClick: () => handleShowDrawer(record),
  }
};

const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);
const isShowDrawerLoading = ref(false);
const handleShowDrawer = (data: GetCampaignBirthdayListResponse[number]) => {
  drawerRef.value?.show(data);
};
</script>

<style lang="scss" scoped>
$breakpoint: 1600px;
.custom-table {
  :deep {
    th, td {
      @media screen and (min-width: ($breakpoint + 1)) {
        &:nth-child(2) {
          display: none;
        }
      }
      @media screen and (max-width: $breakpoint) {
        &:nth-child(3),
        &:nth-child(4),
        &:nth-child(5),
        &:nth-child(6) {
          display: none;
        }
      }
    }
  }
}
</style>
