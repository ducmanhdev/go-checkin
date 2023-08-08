<template>
  <section class="card !p-4 sm:!p-6">
    <div class="flex items-center justify-between space-x-2">
      <h3 class="heading-3 mb-0">Last Review</h3>
      <button type="button" class="text-primary font-medium flex items-center">
        See more
        <double-right-outlined class="ml-1.5"/>
      </button>
    </div>
    <div class="mt-4 space-y-2">
      <div class="grid grid-cols-2 items-center gap-2" v-for="item in 2" :key="item">
        <div class="grid grid-cols-[auto_1fr] items-center gap-2">
          <div class="w-5 h-5 flex items-center justify-center">
            <img src="@/assets/images/icon-facebook.svg" alt="">
          </div>
          <span>Facebook</span>
        </div>
        <div class="grid grid-cols-[1fr_3fr_1fr] gap-2 items-center">
          <span class="text-base font-semibold">4.6</span>
          <a-rate :value="5" disabled class="!text-sm whitespace-nowrap"/>
          <span class="font-medium text-right">40</span>
        </div>
      </div>
    </div>
    <div class="border-t my-4"></div>
    <div class="grid grid-cols-[auto_1fr] gap-3">
      <div
        class="w-7 h-7 rounded-full flex justify-center items-center p-2 text-base font-bold bg-[#EBF2FF] text-[#558BE3] capitalize">
        {{ dashboardReport?.review?.lastGoCheckinReview?.user_name?.charAt(0) }}
      </div>
      <div>
        <p class="font-semibold capitalize">{{ dashboardReport?.review?.lastGoCheckinReview?.user_name ?? 'N/A' }}</p>
        <p class="mt-1">{{ dashboardReport?.review?.lastGoCheckinReview?.content }}</p>
        <a-rate :value="dashboardReport?.review?.lastGoCheckinReview?.rating ?? 0" disabled class="mt-1 !text-sm"/>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {DoubleRightOutlined} from "@ant-design/icons-vue";
import type {GetDashboardReportResponse} from "gap-nodejs-sdk";

type Props = {
  dashboardReport: Nullable<GetDashboardReportResponse>
}
const props = defineProps<Props>();
</script>

<style scoped>

</style>
