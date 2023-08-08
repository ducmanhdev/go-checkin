<template>
  <section class="card">
    <h3 class="heading-3 mb-1">Total survey send out</h3>
    <count-up class="font-semibold text-[32px] mb-2" :end-val="data?.total_survey" />
    <div class="sm:flex items-end justify-between gap-4">
      <circle-progress-bar
        :value="Number(data?.customer_write_review_into_system || 0)"
        :max="Number(data?.total_survey || 1)"
        strokeWidth="16"
        :rounded="true"
        :percentage="true"
        :radius="70"
        colorUnfilled="#04BFDA"
        class="mb-4 md:mb-0"
      />
      <div class="text-C84">
        <p>*Note</p>
        <div class="flex items-start">
          <p class="w-3 h-3 rounded-full border-2 border-[#04BFDA] mt-[5px] mr-3 flex-shrink-0"></p>
          <span>Number of Customers writing reviews into Go Check in System</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CircleProgressBar from "@/components/CircleProgressBarCustom.vue";
import type {GetReviewReportResponse} from "gap-nodejs-sdk";

type Props = {
  data: GetReviewReportResponse
}
const props = defineProps<Props>();
</script>

<style scoped>

</style>
