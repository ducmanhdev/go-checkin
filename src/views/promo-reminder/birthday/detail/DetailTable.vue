<template>
  <div>
    <a-table
      v-if="largerThanMd"
      class="custom-table !-mt-4"
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
        <template v-if="column.dataIndex === 'order'">
          {{ index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'name'">
          {{ record?.customer?.full_name }}
        </template>
        <template v-if="column.dataIndex === 'phone'">
          {{ usePhoneFormat(record?.customer?.phone) }}
        </template>
        <template v-if="column.dataIndex === 'visit'">
          {{ record?.customer?.visit_count }}
        </template>
        <template v-if="column.dataIndex === 'income'">
          {{ 0 }}
        </template>
        <template v-if="column.dataIndex === 'created_at'">
          {{ dayjs(record?.created_at).format(DATE_FORMAT) }}
        </template>
      </template>
    </a-table>
    <template v-else>
      <base-loading-skeleton class="card" v-if="isGetDataLoading"/>
      <p class="text-C84 text-center py-4 mb-0" v-else-if="!data?.data?.length">No history data available</p>
      <div class="space-y-4" v-else>
        <detail-table-mobile-item
          v-for="(item, index) in data?.data"
          :key="item?.code"
          :index="index"
          :data="item"
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
    </template>
  </div>
</template>

<script setup lang="ts">
import {watch, ref} from "vue";
import {usePhoneFormat} from "@/utils/formatter";
import dayjs from "dayjs";
import {DATE_FORMAT} from "@/constant";
import DetailTableMobileItem from "./DetailTableMobileItem.vue";
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import type {DataWithMetaResponse, GetCampaignPromotionHistoryResponse} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import {useRoute} from "vue-router";
import {useDebounce} from "@/utils/debounce";
import {goCheckInSdk} from "@/sdk";
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";
import type {PaginationProps, TableProps} from "ant-design-vue";

type Props = {
  search: string;
}
const props = defineProps<Props>();

const route = useRoute();

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');

const columns = [
  {
    title: '#',
    dataIndex: 'order',
    key: 'order',
    align: 'center',
  },
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: 'PHONE',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center',
  },
  {
    title: 'VISIT',
    dataIndex: 'visit',
    key: 'visit',
    align: 'center',
  },
  {
    title: 'INCOME',
    dataIndex: 'income',
    key: 'income',
    align: 'center',
  },
  {
    title: 'CREATED AT',
    dataIndex: 'created_at',
    key: 'created_at',
    align: 'center',
  },
  {
    title: 'USED TOTAL',
    dataIndex: 'total_used',
    key: 'total_used',
    align: 'center',
  },
];
const data = ref<DataWithMetaResponse<GetCampaignPromotionHistoryResponse> | null>(null);
const isGetDataLoading = ref(false);
const handleGetData = async (page = 1, pageSize = 5) => {
  try {
    isGetDataLoading.value = true;
    data.value = await goCheckInSdk.campaign.getCampaignPromotionHistory({
      id: Number(route.params.id),
      page: page,
      'per-page': pageSize,
      keyword: props.search
    } as any);
  } catch (error) {
    handleError({error});
  } finally {
    isGetDataLoading.value = false;
  }
}
handleGetData();
watch(
  () => props.search,
  useDebounce(() => handleGetData()),
);

const handleTablePaginationChange: TableProps["onChange"] = (pagination, filters, sorter) => {
  handleGetData(pagination.current, pagination.pageSize);
};
const handlePaginationChange: PaginationProps["onChange"] = (page, pageSize) => {
  handleGetData(page)
};
</script>

<style scoped>

</style>
