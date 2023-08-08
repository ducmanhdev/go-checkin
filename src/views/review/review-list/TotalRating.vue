<template>
  <section class="card col-span-1 md:col-span-2 2xl:col-span-1">
    <h3 class="heading-3 mb-4">Customer gave ratings into Go Checkin System</h3>
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="max-w-[184px] relative">
        <div class="absolute inset-0 flex flex-col place-content-center text-center p-6 pointer-events-none">
          <p class="text-C84 mb-0">Total</p>
          <count-up class="text-[32px] leading-none font-semibold mb-0" :end-val="ratingTotalCount" />
        </div>
        <doughnut
          :data="chartData"
          :options="chartOptions"
          class="relative z-2"
        />
      </div>
      <div class="">
        <ol class="space-y-4">
          <li
            v-for="(value, key) in data?.customer_give_rating_into_system"
            :key="key"
            class="grid grid-cols-2 gap-x-5 cursor-pointer"
            @click="emit('select', RATING_REPORT_SKELETON[key].rate)"
          >
            <div class="grid items-center grid-cols-[auto_1fr] gap-3">
              <img :src="getImageUrl(RATING_REPORT_SKELETON[key].img)" alt="" class="flex-shrink-0">
              <span class="">{{ RATING_REPORT_SKELETON[key].label }}</span>
            </div>
            <div class="grid items-center grid-cols-[auto_1fr] gap-3">
              <span class="w-3 h-3 rounded-full border-2 shrink-0"
                    :style="{borderColor: RATING_REPORT_SKELETON[key].backgroundColor}"></span>
              <p class="m-0">
                <span class="font-semibold">{{ value }}</span>
                <span class="ml-1">Clicks</span>
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {getImageUrl} from "@/utils/url";
import {Doughnut} from "vue-chartjs";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import type {GetReviewReportResponse} from "gap-nodejs-sdk";
import {RATING_REPORT_SKELETON} from "@/constant";

ChartJS.register(ArcElement, Tooltip, Legend)

type Props = {
  data: GetReviewReportResponse
}
const props = defineProps<Props>();

type Emit = {
  (e: 'select', rate: number): void
}
const emit = defineEmits<Emit>()

const ratingTotalCount = computed(() => {
  if (!props?.data?.customer_give_rating_into_system) return 0;
  return Object.values(props?.data?.customer_give_rating_into_system).reduce((sum, current) => {
    sum += Number(current);
    return sum;
  }, 0);
});

const chartData = computed(() => ({
  labels: Object.values(RATING_REPORT_SKELETON).map(item => item.label),
  datasets: [
    {
      backgroundColor: Object.values(RATING_REPORT_SKELETON).map(item => item.backgroundColor),
      data: Object.values(props?.data?.customer_give_rating_into_system!).map(value => Number(value)),
    }
  ],
}));
const chartOptions = {
  responsive: true,
  cutout: '65%',
  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<style scoped>

</style>
