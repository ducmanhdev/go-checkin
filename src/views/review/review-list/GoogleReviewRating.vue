<template>
  <section class="card">
    <h3 class="heading-3 mb-4">Google review rating</h3>
    <ul class="space-y-2">
      <li
        v-for="(value, key) in RATING_REPORT_SKELETON"
        :key="key" class="flex items-center gap-3"
      >
        <a-rate
          :value="value.rate"
          disabled
          class="!text-sm"
        />
        <span>
          {{ data?.google_review_rating ? data?.google_review_rating[key] : 0 }}
          Reviews
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type {GetReviewReportResponse} from "gap-nodejs-sdk";
import {RATING_REPORT_SKELETON} from "@/constant";

type Props = {
  data: GetReviewReportResponse
}
const props = defineProps<Props>();
</script>

<style scoped>

</style>
