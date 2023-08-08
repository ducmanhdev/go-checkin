<template>
  <section class="card">
    <div class="flex items-center justify-between space-x-2">
      <h3 class="font-semibold text-lg mb-0">Review</h3>
      <p class="font-semibold text-lg mb-0">
        {{
          (Number(data?.google_review_current?.total_reviews) + Number(data?.google_review_current?.total_reviews)) || 0
        }}
        <span class="text-C82 text-xs font-normal">review</span>
      </p>
    </div>
    <div class="mt-3 space-y-3 sm:space-y-2">
      <div
        class="grid grid-cols-2 sm:flex items-center sm:justify-between gap-2"
        v-for="(value, key) in REVIEW_FROM_LIST"
        :key="key"
      >
        <div class="block sm:grid sm:grid-cols-[auto_1fr] items-center gap-2">
          <div class="w-5 h-5 flex items-center justify-center mb-1 sm:mb-0">
            <img :src="getImageUrl(value.icon)" alt="">
          </div>
          <span class="font-medium">{{ value.title }}</span>
        </div>
        <div class="flex flex-col sm:grid sm:grid-cols-[30px_86px_74px] sm:gap-2 items-end sm:items-center shrink-0">
          <span class="text-base font-semibold">{{ data[key]?.average_rating || 0 }}</span>
          <a-rate :value="data[key]?.average_rating || 0" disabled class="!text-sm"/>
          <span class="font-medium text-right">
            {{ data[key]?.total_reviews || 0 }}
            <span class="text-C82 text-xs font-normal">review</span>
          </span>
        </div>
      </div>
    </div>
    <div class="border-t border-CED my-4"></div>
    <div class="grid grid-cols-[auto_1fr] gap-3" v-if="firstReview">
      <a-avatar :size="28" class="!text-base font-bold !bg-primary-lighter !text-primary" :src="firstReview?.avatar">
        {{ firstReview?.customer?.full_name?.slice(0, 1).toUpperCase() }}
      </a-avatar>
      <div>
        <p class="mb-1">
          <span class="font-semibold mr-3">{{ firstReview?.customer?.full_name || 'N/A' }}</span>
          <span class="text-C84 text-xs">{{ firstReview?.customer?.email || 'N/A' }}</span>
        </p>
        <p class="mb-1 line-clamp-4 italic">{{ firstReview?.content || 'No content' }}</p>
        <a-rate :value="firstReview?.rating" disabled class="mt-1 !text-sm"/>
      </div>
    </div>
    <div v-else class="italic text-secondary">
      There are no reviews yet
    </div>
  </section>
</template>

<script setup lang="ts">
import type {GetListReviewResponse, GetReviewReportResponse} from "gap-nodejs-sdk";
import {getImageUrl} from "@/utils/url";

type Props = {
  data: GetReviewReportResponse,
  firstReview: GetListReviewResponse[number]
}
const props = defineProps<Props>();

const REVIEW_FROM_LIST = {
  google_review_at_sign_up: {
    title: 'Google Review At Signed Up',
    icon: 'icon-google.svg',
  },
  google_review_current: {
    title: 'Current Google Review',
    icon: 'icon-google.svg',
  }
};
</script>

<style scoped>

</style>
