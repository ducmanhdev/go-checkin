<template>
  <section class="min-h-full">
    <div class="leading-relaxed mb-7">
      <h2 class="heading-1 mb-1">{{ dashboardReport?.business_name }}</h2>
      <p class="mb-0" v-if="checkoutConfig?.settings?.host_package !== 'full'">
        You are using GCI LITE, to know about GCI Pro please contact us at: 832-968-6668.
      </p>
      <p class="mb-0">
        <span class="mr-4">ID: {{ dashboardReport?.id }}</span>
        <span>
          Member since {{ dayjs(dashboardReport?.member_since).fromNow() }} |
          <router-link :to="{name: 'profile'}" class="font-semibold text-primary">View profile</router-link>
        </span>
      </p>
    </div>
    <div class="max-w-[1200px] mx-auto space-y-4 xl:space-y-8">
      <div class="grid gap-4 2xl:gap-6 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] child:min-h-[145px]">
        <div class="rounded-[20px] p-6 text-center"
             :style="{
               backgroundColor: item.background,
               color: item.color
             }"
             v-for="item in listTotal"
             :key="item.title"
        >
          <img class="block mx-auto mb-2" :src="getImageUrl(item.icon)" alt="">
          <count-up class="text-2xl font-semibold mb-0" :end-val="item.count"/>
          <p class="mb-0">{{ item.title }}</p>
        </div>
        <div class="rounded-[20px] p-6 text-[#1288A4] bg-[#E7FAFF] grid content-center gap-1">
          <div class="grid grid-cols-[1fr_50px] gap-1 items-center">
            <img src="@/assets/images/total-go-checkin.svg" alt="">
            <count-up
              class="text-center text-2xl font-semibold mb-0"
              :end-val="dashboardReport?.review?.totalGoCheckinReview ?? 0"
            />
          </div>
          <div class="grid grid-cols-[1fr_50px] gap-1 items-center">
            <img src="@/assets/images/total-google.svg" alt="">
            <count-up
              class="text-center text-2xl font-semibold mb-0"
              :end-val="dashboardReport?.review?.totalGoogleReview ?? 0"
            />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[3fr_2fr] gap-4 xl:gap-6">
        <total-member :members="dashboardReport?.customer!"/>
        <survey/>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <delivered-messages :dashboard-report="dashboardReport"/>
        <total-review :review-report="reviewReport"/>
        <last-review :dashboard-report="dashboardReport"/>
      </div>
      <customer-chart :total-customer="dashboardReport?.customer?.all ?? 0"/>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {getImageUrl} from "@/utils/url";
import TotalMember from "@/views/report/TotalMember.vue";
import Survey from "@/views/report/Survey.vue";
import DeliveredMessages from "@/views/report/DeliveredMessages.vue";
import TotalReview from "@/views/report/TotalReview.vue";
import LastReview from "@/views/report/LastReview.vue";
import CustomerChart from "@/views/report/CustomerChart.vue";
import handleError from "@/utils/error";
import {goCheckInSdk, settingsSdk} from "@/sdk";
import type {GetCheckoutConfigResponse, GetDashboardReportResponse, GetReviewReportResponse} from "gap-nodejs-sdk";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const checkoutConfig = ref<GetCheckoutConfigResponse | null>(null);
const isGetCheckoutConfigLoading = ref(false);
const handleGetCheckoutConfig = async () => {
  try {
    isGetCheckoutConfigLoading.value = true;
    checkoutConfig.value = await settingsSdk.checkout.getCheckoutConfig();
  } catch (error) {
    handleError({error});
  } finally {
    isGetCheckoutConfigLoading.value = false;
  }
}
handleGetCheckoutConfig();

const dashboardReport = ref<GetDashboardReportResponse | null>(null);
const isGetDashboardLoading = ref(false);
const handleGetDashboardReport = async () => {
  try {
    isGetDashboardLoading.value = true;
    dashboardReport.value = await goCheckInSdk.dashboard.getDashboardReport();
  } catch (error) {
    handleError({error});
  } finally {
    isGetDashboardLoading.value = false;
  }
}
handleGetDashboardReport();

const reviewReport = ref<GetReviewReportResponse | null>(null);
const isGetReviewReportLoading = ref(false);
const handleGetReviewReport = async () => {
  try {
    isGetReviewReportLoading.value = true;
    reviewReport.value = await goCheckInSdk.review.getReviewReport();
  } catch (error) {
    handleError({error});
  } finally {
    isGetReviewReportLoading.value = false;
  }
}
handleGetReviewReport();

const listTotal = computed(() => {
  return [
    {
      icon: 'icon-total-member.svg',
      count: dashboardReport.value?.customer?.all ?? 0,
      title: 'Total member',
      color: '#457BD3',
      background: '#EBF3FF'
    },
    {
      icon: 'icon-delivered-messages.svg',
      count: dashboardReport.value?.totalDelivery ?? 0,
      title: 'Delivered messages',
      color: '#668A21',
      background: '#F2FFDA'
    },
    {
      icon: 'icon-total-survey.svg',
      count: reviewReport.value?.total_survey ?? 0,
      title: 'Total Survey',
      color: '#D96425',
      background: '#FFEEE4'
    },
    {
      icon: 'icon-total-reviews.svg',
      count: dashboardReport.value?.review?.totalReview ?? 0,
      title: 'Total Reviews',
      color: '#6E209D',
      background: '#F5EBFF'
    }
  ]
});
</script>

<style scoped>

</style>
