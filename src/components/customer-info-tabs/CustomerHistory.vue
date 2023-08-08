<template>
  <div>
    <!-- DESKTOP -->
    <a-table
      v-if="largerThanMd"
      class="custom-table font-medium -mt-4"
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
        <template v-if="column.dataIndex === 'checkin_at'">
          <p class="mb-0">{{ dayjs(record.checked_in_at).format(DATE_FORMAT) }}</p>
          <p class="mb-0">{{ dayjs(record.checked_in_at).format(TIME_12_FORMAT) }}</p>
        </template>
        <template v-if="column.dataIndex === 'checkout_at'">
          <p class="mb-0">{{ dayjs(record.checked_out_at).format(DATE_FORMAT) }}</p>
          <p class="mb-0">{{ dayjs(record.checked_out_at).format(TIME_12_FORMAT) }}</p>
        </template>
        <template v-if="column.dataIndex === 'point'">
          {{ record.point_added }}
        </template>
        <template v-if="column.dataIndex === 'checkout_by'">
          {{ record.checked_out_by?.name ? record.checked_out_by.name : 'N/A' }}
        </template>
        <template v-if="column.dataIndex === 'staffs'">
          <div v-if="record.checkout_staffs?.length" class="flex justify-center flex-wrap gap-2">
            <tag
              flat
              color="#28C76F"
              v-for="staff in record.checkout_staffs"
              :key="staff?.name"
            >
              {{ staff.name }}
            </tag>
          </div>
          <template v-else>N/A</template>
        </template>
        <template v-if="column.dataIndex === 'checkin_staffs'">
          <div v-if="record.staffs?.length" class="flex justify-center flex-wrap gap-2">
            <tag
              flat
              color="#FF9F43"
              v-for="staff in record.staffs"
              :key="staff?.name"
            >
              {{ staff.name }}
            </tag>
          </div>
          <template v-else>N/A</template>
        </template>
        <template v-if="column.dataIndex === 'services'">
          <div v-if="record.services?.length" class="flex justify-center flex-wrap gap-2">
            <tag
              flat
              color="#FF9F43"
              v-for="service in record.services"
              :key="service?.name"
            >
              {{ service.name }}
            </tag>
          </div>
          <template v-else>N/A</template>
        </template>
      </template>
    </a-table>
    <!-- MOBILE -->
    <template v-else>
      <base-loading-skeleton class="card" v-if="isGetDataLoading"/>
      <p class="text-C84 text-center py-4 mb-0" v-else-if="!data?.data?.length">No history data available</p>
      <div class="space-y-4" v-else>
        <div class="card-sm space-y-3" v-for="(record, index) in data?.data" :key="index">
          <div class="grid grid-cols-2 gap-3" v-for="(column) in columns" :key="column.key">
            <div class="text-C84 font-semibold">{{ column.title }}</div>
            <div>
              <template v-if="column.dataIndex === 'order'">
                {{ index + 1 }}
              </template>
              <template v-if="column.dataIndex === 'checkin_at'">
                <p class="flex items-center mb-0 gap-2">
                  <calendar-outlined class="!text-C84"/>
                  {{ useDateFormat(record?.checked_in_at!) }}
                </p>
              </template>
              <template v-if="column.dataIndex === 'checkout_at'">
                <p class="flex items-center mb-0 gap-2">
                  <calendar-outlined class="!text-C84"/>
                  {{ useDateFormat(record?.checked_out_at!) }}
                </p>
              </template>
              <template v-if="column.dataIndex === 'point'">
                {{ record?.point_added + 'pts' }}
              </template>
              <template v-if="column.dataIndex === 'checkout_by'">
                {{ record.checked_out_by?.name ? record.checked_out_by?.name : 'N/A' }}
              </template>
              <template v-if="column.dataIndex === 'staffs'">
                <div v-if="record.checkout_staffs?.length" class="flex flex-wrap gap-2">
                  <tag
                    flat
                    color="#28C76F"
                    v-for="staff in record.checkout_staffs"
                    :key="staff?.name!"
                  >
                    {{ staff.name }}
                  </tag>
                </div>
                <template v-else>N/A</template>
              </template>
              <template v-if="column.dataIndex === 'checkin_staffs'">
                <div v-if="record.staffs?.length" class="flex flex-wrap gap-2">
                  <tag
                    flat
                    color="#FF9F43"
                    v-for="staff in record.staffs"
                    :key="staff?.name!"
                  >
                    {{ staff.name }}
                  </tag>
                </div>
                <template v-else>N/A</template>
              </template>
              <template v-if="column.dataIndex === 'services'">
                <div v-if="record.services?.length" class="flex flex-wrap gap-2">
                  <tag
                    flat
                    color="#FF9F43"
                    v-for="service in record.services"
                    :key="service?.name!"
                  >
                    {{ service.name }}
                  </tag>
                </div>
                <template v-else>N/A</template>
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
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import dayjs from "dayjs";
import {DATE_FORMAT, TIME_12_FORMAT} from "@/constant";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";
import type {DataWithMetaResponse, GetCustomerHistoryCheckinResponse} from "gap-nodejs-sdk";
import type {TableProps, PaginationProps} from "ant-design-vue";
import Tag from '@/components/Tag.vue';
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";
import {CalendarOutlined} from "@ant-design/icons-vue";
import {useDateFormat} from "@/utils/date";

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');

type Props = {
  customerId: number;
}

const props = defineProps<Props>();

const columns = [
  {
    title: '#',
    dataIndex: 'order',
    key: 'order',
    align: 'center'
  },
  {
    title: 'CHECKIN AT',
    dataIndex: 'checkin_at',
    key: 'checkin_at',
    align: 'center'
  },
  {
    title: 'CHECK OUT AT',
    dataIndex: 'checkout_at',
    key: 'checkout_at',
    align: 'center'
  },
  {
    title: 'POINT',
    dataIndex: 'point',
    key: 'point',
    align: 'center'
  },
  {
    title: 'CHECK OUT BY',
    dataIndex: 'checkout_by',
    key: 'checkout_by',
    align: 'center'
  },
  {
    title: 'STAFFS',
    dataIndex: 'staffs',
    key: 'staffs',
    align: 'center'
  },
  {
    title: 'CHECKIN STAFFS',
    dataIndex: 'checkin_staffs',
    key: 'checkin_staffs',
    align: 'center'
  },
  {
    title: 'SERVICES',
    dataIndex: 'services',
    key: 'services',
    align: 'center'
  },
];

const data = ref<DataWithMetaResponse<Array<GetCustomerHistoryCheckinResponse>> | null>(null);
const isGetDataLoading = ref(false);
const handleGetData = async (page = 1, pageSize = 10) => {
  try {
    if (!props.customerId) return;
    isGetDataLoading.value = true;
    data.value = await goCheckInSdk.customer.getCustomerHistory({
      id: props.customerId,
      page: page,
      'per-page': pageSize,
    });
  } catch (error) {
    handleError({error});
  } finally {
    isGetDataLoading.value = false;
  }
};
watch(() => props.customerId, () => {
  handleGetData();
}, {
  immediate: true,
});
const handleTablePaginationChange: TableProps["onChange"] = (pagination, filters, sorter) => {
  handleGetData(pagination.current)
};
const handlePaginationChange: PaginationProps["onChange"] = (page, pageSize) => {
  handleGetData(page)
};
</script>

<style scoped>

</style>
