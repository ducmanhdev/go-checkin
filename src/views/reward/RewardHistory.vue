<template>
  <section>
    <div class="mb-3 md:flex items-center justify-between gap-3">
      <h2 class="heading-1 mb-0 flex items-center gap-2">
        <router-link :to="{name: 'reward'}" class="inline-block md:hidden">
          <img src="@/assets/images/icon-arrow-left.svg" alt="">
        </router-link>
        Reward history
      </h2>
      <div class="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-[400px_auto_auto] mt-3 md:mt-0">
        <input-search v-model="search" @input-debounce="handleSearch" class="col-span-full md:col-span-1"/>
        <a-date-picker
          v-model:value="date"
          :value-format="SEND_DATE_FORMAT"
          class="ant-picker-primary"
          @change="handleChangeDate"
        />
        <a-button
          type="primary"
          :loading="isExportLoading"
          @click="handleExport"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"
               xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect width="26" height="26" fill="url(#pattern0)"/>
            <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlink:href="#image0_93_9784" transform="scale(0.0104167)"/>
              </pattern>
              <image id="image0_93_9784" width="96" height="96"
                     xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADqUlEQVR4nO2dSWsWQRCG24WgxojrRSMeRCJ4UNxQMAfBgwG9eRFRxCh4UXEBDwrGH+DyBwIuNxMFFUSR4MGbCJ70pIiCS9xwQ1zQRwYHDLHrm0l6OjWm64FcMl3V9dY7/TFfzwyfc4ZhGIZhGIZhGIZhGIZRQ4DZwEagC7gKPNeuKalm40G7zqSa7UO79qSa7UNbT1LN9qGtMalm+3ApotVsH260U6dm+3CjHWqOq1/9H4FLQJsZ4FRPoLdAq60AXS6YAbp8MAOUMQOUMQOUMQOUSd6AIkIbaAYEYgYEYgYo42wFmAExT5AyeymvgJXAMs9fO/C1IP4n0CHEnyia3FbAH7Y1MPB8QQ97hLgJwFMzoByPgSahkasLYlcJcQfLTGwr4C+dDVbBXaF/N4Xxk4H+KgxAmdATZCgCnjRYBZ1CzDph/PGqBJKQARm7hRwT8xsUA7kHjPGMnZlt41YlkMQMeJY1W8gz+IpmkzDuVJUCScyAjD1Cnvn5JWfGQ2CcZ8wc4EuVAknQgBfAJCHX9XzMTuF4d9UCSdCAjANCri35Gd7sOdYG/KhaIIka8Bpo8eSaBlwU5umJIZBEDcg4LOT753kZYCnwS0NgaP46G/AGmFJyjhvDnSS2vtjxwQUWcLRE/vaQCWLrix0fXGAB74CpBflvh0wQW1/s+OACC+gv+hgCzoZMEFtf7PjgAgvYVSL/vBL3DKIJDM1fZwMeAONLznF6uJPE1hc7PrjABnR4ck0HFnn+Pyt/rHvIxNYXOz64QIE+Iddm4JBw7NhwJopUf2VoGJBtuC0Wcl0G7gjHWsrehBmKQBI0oFvIs3DAbuhaYczeqgWSmAHZRttcIc+ZAeOuCWOagEdVCiQxA7qEHK3At0Fjlwhjt1YpkIQM6PftgDa4zDwnjB2b366sRCAJGeD90pVfen7yjP+efQkTYjZUJZBEDBC/dOXvF0ucbDDvrSoEokxo/8sKWC/ENuc3ZyQ+AzOE2DUjITA0fx0M6GsQu79E/JEG8VdiCwzNXwcDdggP1i4v82wn8BJYIeTYHltgaP7Y9al/hhYRW1/s+OACtXGR9cWODy5QGxdZX+z44AK1cZH1xY4PLlAbF1lf7PjgArVxNa/fDFDGDFDGDFDGDNDlvRmgS68ZoEf2TtwCM2DkyV4w7K2k+QNeqsj25vdltxGB+9QIlyJ1MsUZuqY4Q3elOEP348sZuqY4Q9cUZ4wc2M9YGYZhGIZhGIZhGIZhGO7/5Td9AK/y4TcjAgAAAABJRU5ErkJggg=="/>
            </defs>
          </svg>
          Export
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
          <template v-if="column.dataIndex === 'customer_name'">
            {{ record?.customer_name || 'N/A' }}
          </template>
          <template v-if="column.dataIndex === 'customer_phone'">
            {{ usePhoneFormat(record?.customer_phone) }}
          </template>
          <template v-if="column.dataIndex === 'reward_content'">
            {{ record?.redeem_content }}
          </template>
          <template v-if="column.dataIndex === 'staff'">
            {{ record?.staff_name }}
          </template>
          <template v-if="column.dataIndex === 'total_price'">
            {{ record?.total_price }}
          </template>
          <template v-if="column.dataIndex === 'discount'">
            {{ record?.discount }}
          </template>
          <template v-if="column.dataIndex === 'point'">
            {{ record?.lasted_point }}
          </template>
          <template v-if="column.dataIndex === 'date'">
            <p class="mb-0">{{ useDateFormat(record?.created_at) }}</p>
            <p class="mb-0">{{ dayjs(record?.created_at).format(TIME_12_FORMAT) }}</p>
          </template>
        </template>
        <template #summary>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="font-bold text-center !py-5">TOTAL</td>
            <td class="text-center !py-5">{{ totalPrice }}</td>
            <td class="text-center !py-5">{{ totalDiscount }}</td>
            <td class="text-center !py-5">{{ totalPoint }}</td>
            <td></td>
          </tr>
        </template>
      </a-table>
      <div v-else>
        <base-loading-skeleton class="card" v-if="isGetDataLoading"/>
        <a-empty v-else-if="!data?.data?.length"/>
        <div class="space-y-4" v-else>
          <reward-history-table-mobile-item
            v-for="(history, index) in data?.data"
            :key="history.id!"
            :index="index"
            :data="history"
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
  </section>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import InputSearch from '@/components/InputSearch.vue';
import {goCheckInSdk} from "@/sdk";
import {useDateFormat} from "@/utils/date";
import FileDownload from "js-file-download";
import handleError from "@/utils/error";
import type {DataWithMetaResponse, GetRewardHistoryResponse} from "gap-nodejs-sdk";
import {SEND_DATE_FORMAT, TIME_12_FORMAT} from "@/constant";
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import RewardHistoryTableMobileItem from "@/views/reward/RewardHistoryTableMobileItem.vue";
import type {PaginationProps, TableProps} from "ant-design-vue";
import {usePhoneFormat} from "@/utils/formatter";
import dayjs from 'dayjs';
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";

const search = ref('');
const date = ref('');

const columns = [
  {
    title: '#',
    dataIndex: 'order',
    key: 'order',
    align: 'center',
  },
  {
    title: 'CUSTOMER NAME',
    dataIndex: 'customer_name',
    key: 'customer_name',
    align: 'center',
  },
  {
    title: 'CUSTOMER PHONE',
    dataIndex: 'customer_phone',
    key: 'customer_phone',
    align: 'center',
  },
  {
    title: 'REWARD CONTENT',
    dataIndex: 'reward_content',
    key: 'REWARD CONTENT',
    align: 'center',
  },
  {
    title: 'STAFF',
    dataIndex: 'staff',
    key: 'staff',
    align: 'center',
  },
  {
    title: 'TOTAL PRICE (USD)',
    dataIndex: 'total_price',
    key: 'total_price',
    align: 'center',
  },
  {
    title: 'DISCOUNT (USD)',
    dataIndex: 'discount',
    key: 'discount',
    align: 'center',
  },
  {
    title: 'POINT',
    dataIndex: 'point',
    key: 'point',
    align: 'center',
  },
  {
    title: 'DATE',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
  },
];

const data = ref<
  DataWithMetaResponse<GetRewardHistoryResponse> |
  null
>(null);

const isGetDataLoading = ref(false);
const handleGetData = async (page: number = 1, perPage = 10) => {
  try {
    isGetDataLoading.value = true;
    data.value = await goCheckInSdk.reward.getRewardHistory({
      page: page,
      'per-page': perPage,
      customer_phone: search.value,
      filter_date: date.value,
    });
  } catch (error) {
    handleError({error})
  } finally {
    isGetDataLoading.value = false;
  }
};
handleGetData();
const handleSearch = () => {
  handleGetData()
};
const handleChangeDate = () => {
  handleGetData();
};
const handleTablePaginationChange: TableProps["onChange"] = (pagination, filters, sorter) => {
  handleGetData(pagination.current)
};
const handlePaginationChange: PaginationProps["onChange"] = (page, pageSize) => {
  handleGetData(page, pageSize)
};

const totalPrice = computed(() => {
  if (!data?.value?.data) return 'No data';
  return data?.value?.data.reduce((total: number, current: GetRewardHistoryResponse[number]) => {
    total += current?.total_price ? Number(current?.total_price) : 0;
    return total;
  }, 0);
})
const totalDiscount = computed(() => {
  if (!data?.value?.data) return 'No data';
  return data?.value?.data.reduce((total: number, current: GetRewardHistoryResponse[number]) => {
    total += current?.discount ? Number(current?.discount) : 0;
    return total;
  }, 0);
});
const totalPoint = computed(() => {
  if (!data?.value?.data) return 'No data';
  return data?.value?.data.reduce((total: number, current: GetRewardHistoryResponse[number]) => {
    total += current?.lasted_point ? Number(current?.lasted_point) : 0;
    return total;
  }, 0);
});

const isExportLoading = ref(false);
const handleExport = async () => {
  try {
    isExportLoading.value = true;
    const res = await goCheckInSdk.reward.exportRewardHistory();
    FileDownload(res, `#${localStorage.getItem("id")}-member-${useDateFormat()}.xls`);
  } catch (error) {
    handleError({error});
  } finally {
    isExportLoading.value = false;
  }
};

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');
</script>

<style lang="scss">
</style>
