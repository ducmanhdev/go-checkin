<template>
  <aside class="md:shadow-[0_4px_4px_rgba(0,9,54,0.15)] bg-white text-black p-4 xl:p-7 space-y-4">
    <h2 class="heading-1 mb-0 md:hidden">Customer</h2>
    <div class="flex gap-4 md:!mt-0">
      <router-link
        v-for="name in ['customer', 'group']"
        :key="name"
        :to="{name: name}"
        custom
        v-slot="{ isActive, navigate }"
      >
        <div
          @click="navigate"
          class="cursor-pointer capitalize rounded-base p-4 text-base font-medium flex-1 bg-primary-lighter text-primary text-center min-h-[60px] flex items-center justify-center"
          :class="{
              '!bg-primary !text-white': isActive
           }"
        >
          {{ name }}
        </div>
      </router-link>
    </div>
    <div class="shrink-0 flex gap-3">
      <a-date-picker
        v-model:value="lastVisitedDate"
        :value-format="DATE_FORMAT"
        class="grow ant-picker-primary"
        placeholder="Last visited date"
        @change="handleChangeDate"
      />
      <base-dropdown
        v-model="bookingType"
        :options="BOOKING_TYPE_OPTIONS"
        placement="bottomRight"
        @change="handleChangeType"
      >
        <template #button>
          <a-button type="primary" class="!min-w-0 w-[46px]">
            <filter-outlined/>
          </a-button>
        </template>
      </base-dropdown>
    </div>
    <input-search v-model="search" @input-debounce="handleSearch"/>
    <base-loading-skeleton v-if="isGetListCustomerLoading"/>
    <a-empty v-else-if="!listCustomer?.data?.length"/>
    <template v-else>
      <div class="space-y-4">
        <customer-item
          v-for="customer in listCustomer.data"
          :key="customer.id!"
          :name="customer.full_name!"
          :phone="customer.phone!"
          :type="customer.type!"
          :point="customer.current_point!"
          @click="handleSelectCustomer(customer.id!)"
          :class="{
            'active': currentCustomerId === customer.id!
          }"
        />
      </div>
      <div class="flex justify-center mt-4">
        <a-pagination
          :current="listCustomer?._meta?.currentPage"
          :total="listCustomer?._meta?.totalCount"
          :page-size="listCustomer?._meta?.perPage"
          :show-size-changer="false"
          show-less-items
          @change="handlePaginationChange"
        />
      </div>
    </template>
  </aside>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import InputSearch from "@/components/InputSearch.vue";
import {FilterOutlined} from "@ant-design/icons-vue";
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import {BOOKING_TYPE_OPTIONS, DATE_FORMAT} from '@/constant'
import CustomerItem from "./CustomerItem.vue";
import handleError from "@/utils/error";
import {goCheckInSdk} from "@/sdk";
import type {DataWithMetaResponse, GetListCustomerResponse} from "gap-nodejs-sdk";
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import {useRoute, useRouter} from "vue-router";
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";
import type {PaginationProps} from "ant-design-vue";

const router = useRouter();
const route = useRoute();

const currentCustomerId = computed(() => Number(route.params.id))

const search = ref('');
const lastVisitedDate = ref('');
const bookingType = ref(BOOKING_TYPE_OPTIONS[0].value);

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');

const handleSelectCustomer = (newCustomerId: number) => {
  router.push({
    name: 'customer-detail',
    params: {
      id: newCustomerId,
    }
  })
}
const handleSelectFirstCustomer = () => {
  const firstCustomer = listCustomer.value?.data[0];
  if (firstCustomer) handleSelectCustomer(firstCustomer?.id!);
}

const listCustomer = ref<DataWithMetaResponse<GetListCustomerResponse> | null>(null);
const isGetListCustomerLoading = ref(false);
const handleGetListCustomer = async (page: number = 1, perPage = 10) => {
  try {
    isGetListCustomerLoading.value = true;
    listCustomer.value = await goCheckInSdk.customer.getListCustomer({
      page: page,
      'per-page': perPage,
      keyword: search.value,
      type: bookingType.value,
      date: lastVisitedDate.value
    });
    if (largerThanMd.value) handleSelectFirstCustomer();
  } catch (error) {
    handleError({error})
  } finally {
    isGetListCustomerLoading.value = false;
  }
}
handleGetListCustomer();

const handleSearch = () => {
  handleGetListCustomer();
};
const handleChangeDate = () => {
  handleGetListCustomer();
};
const handleChangeType = () => {
  handleGetListCustomer();
};
const handlePaginationChange: PaginationProps["onChange"] = (page) => {
  handleGetListCustomer(page)
};

watch([() => route, largerThanMd], ([newRoute, isLargerThanMd]) => {
  if (newRoute.name === 'customer' && isLargerThanMd) handleSelectFirstCustomer();
});
</script>

