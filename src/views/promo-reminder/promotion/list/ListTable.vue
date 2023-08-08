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
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if="column.dataIndex === 'number'">
        <p class="font-medium block mb-0">{{ index + 1 }}</p>
      </template>
      <template v-if="column.dataIndex === 'customer'">
        <p class="text-primary font-semibold mb-0">
          {{ groupIdsToName(record.groups) }}
        </p>
      </template>
      <template v-if="column.dataIndex === 'customer_promotion'">
        <div class="space-y-1">
          <p class="text-primary font-semibold mb-0">
            {{ groupIdsToName(record.groups) }}
          </p>
          <p class="mb-0">
            {{ record.name }}
          </p>
          <p class="mb-0">
            <span class="text-C84 mr-2">Discount:</span>
            <span class="text-base font-semibold">
              {{ record.logic_value + (record.logic_type === 'percent' ? '%' : '$') }}
            </span>
          </p>
          <p class="flex items-center gap-2 mb-0">
            <calendar-outlined class="!text-[color:var(--color-C84)]"/>
            <span>
            {{ dayjs(record.start_date).format(DATE_FORMAT) }}
            to
            {{ dayjs(record.expired_date).format(DATE_FORMAT) }}
          </span>
          </p>
        </div>
      </template>
      <template v-if="column.dataIndex === 'promotion'">
        <p class="mb-0">
          <span class="text-C84 mr-2">Discount:</span>
          <span class="text-base font-semibold">
            {{ record.logic_value + (record.logic_type === 'percent' ? '%' : '$') }}
          </span>
        </p>
      </template>
      <template v-if="column.dataIndex === 'duration'">
        <p class="flex items-center gap-2 mb-0">
          <calendar-outlined class="!text-[color:var(--color-C84)]"/>
          <span>
            {{ dayjs(record.start_date).format(DATE_FORMAT) }}
            to
            {{ dayjs(record.expired_date).format(DATE_FORMAT) }}
          </span>
        </p>
      </template>
      <template v-if="column.dataIndex === 'delivered_redeem'">
        <div class="space-y-2">
          <div>
            <p class="text-C84 mb-0">Total Delivered</p>
            <p class="font-medium mb-0">{{ record.campaign_report.total_receive_message }}</p>
          </div>
          <div>
            <p class="text-C84 mb-0">Redemption</p>
            <p class="font-medium mb-0">{{ record.campaign_report.total_redemption }}</p>
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'income_expense'">
        <div class="space-y-2">
          <div>
            <p class="text-C84 mb-0">Income</p>
            <p class="font-medium mb-0">{{ currencyFormat(record.campaign_report.total_income) }}</p>
          </div>
          <div>
            <p class="text-C84 mb-0">Expense</p>
            <p class="font-medium mb-0">{{ currencyFormat(record.campaign_report.total_expense) }}</p>
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'date_sent'">
        <div class="space-y-2">
          <p class="flex items-center gap-2 mb-0">
            <calendar-outlined class="!text-[color:var(--color-C84)]"/>
            <span>{{ dayjs(record.sent_at || record.created_at).format(DATE_FORMAT) }}</span>
          </p>
          <p class="flex items-center gap-2 mb-0">
            <clock-circle-outlined class="!text-[color:var(--color-C84)]"/>
            <span>{{ dayjs(record.sent_at || record.created_at).format(TIME_12_FORMAT) }}</span>
          </p>
        </div>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="text-right">
          <a-button
            type="primary"
            @click.stop="$router.push({name: 'promotion-detail', params: {id: record.id}})"
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
      />
      <div class="flex justify-center">
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
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import type {PaginationProps, TableProps} from "ant-design-vue";
import {ClockCircleOutlined, CalendarOutlined} from "@ant-design/icons-vue";
import handleError from "@/utils/error";
import type {
  DataWithMetaResponse,
  GetCampaignPromotionListResponse,
  GetCampaignPromotionListExpiredResponse,
  GetCampaignPromotionGroupResponse,
} from "gap-nodejs-sdk";
import {DATE_FORMAT, TIME_12_FORMAT} from "@/constant";
import dayjs from "dayjs";
import {currencyFormat} from "@/utils/formatter";
import {useDebounce} from "@/utils/debounce";
import ListTableMobileItem from "./ListTableMobileItem.vue";
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import {goCheckInSdk} from "@/sdk";
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";

type Props = {
  search: string,
  type?: 'normal' | 'expired',
}
const props = withDefaults(
  defineProps<Props>(),
  {
    type: 'normal'
  }
)

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');

const data = ref<
  DataWithMetaResponse<GetCampaignPromotionListResponse> |
  DataWithMetaResponse<GetCampaignPromotionListExpiredResponse> |
  null
>(null);

const isGetDataLoading = ref(false);
const handleGetData = async (page = 1, pageSize = 5) => {
  try {
    isGetDataLoading.value = true;
    const funcName = props.type === 'normal'
      ? 'getCampaignPromotionList'
      : 'getCampaignPromotionListExpired';
    data.value = await goCheckInSdk.campaign[funcName]({
      page: page,
      'per-page': pageSize,
      keyword: props.search
    } as any);
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

const campaignPromotionGroup = ref<GetCampaignPromotionGroupResponse | null>(null);
const isGetCampaignPromotionGroup = ref(false);
const getCampaignPromotionGroup = async () => {
  try {
    isGetCampaignPromotionGroup.value = true;
    campaignPromotionGroup.value = await goCheckInSdk.campaign.getCampaignPromotionGroup();
  } catch (error) {
    handleError({error});
  } finally {
    isGetCampaignPromotionGroup.value = false;
  }
};
getCampaignPromotionGroup();
const groupIdsToName = (str: string) => {
  if (!str) return '';
  const idArr = str.split(',');
  if (!idArr || !idArr?.length || !campaignPromotionGroup.value?.length) return '';
  return [...campaignPromotionGroup.value]
    .filter((group: any) => group && idArr.includes(`${group.id}`))
    .map((group: any) => group.name)
    .join(', ');
};

const columns = [
  {
    title: 'NUMBER',
    dataIndex: 'number',
    key: 'number',
    align: 'center',
  },
  {
    title: 'CUSTOMER',
    dataIndex: 'customer',
    key: 'customer',
    align: 'center',
  },
  {
    title: 'CUSTOMER & PROMOTION',
    dataIndex: 'customer_promotion',
    key: 'customer_promotion',
  },
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'PROMOTION',
    dataIndex: 'promotion',
    key: 'promotion',
    align: 'center',
  },
  {
    title: 'DURATION',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: 'DELIVERED & REDEEM',
    dataIndex: 'delivered_redeem',
    key: 'delivered_redeem',
  },
  {
    title: 'INCOME & EXPENSE',
    dataIndex: 'income_expense',
    key: 'income_expense',
  },
  {
    title: 'DATE SENT',
    dataIndex: 'date_sent',
    key: 'date_sent',
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
  },
];
</script>

<style lang="scss" scoped>
$breakpoint: 1600px;
.custom-table {
  :deep {
    th, td {
      @media screen and (min-width: ($breakpoint + 1)) {
        &:nth-child(3) {
          display: none;
        }
      }
      @media screen and (max-width: $breakpoint) {
        &:nth-child(2),
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
