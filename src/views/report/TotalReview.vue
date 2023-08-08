<template>
  <div class="card">
    <p class="heading-3 mb-2">Total Review</p>
    <div class="sm:flex">
      <div class="sm:w-[110px] mb-4 sm:mb-0">
        <count-up class="text-[32px] font-semibold" :end-val="totalReviewCount"/>
      </div>
      <div class="sm:w-[calc(100%-110px)] sm:pl-3">
        <Line :data="data" :options="options" ref="lineChartRef"/>
      </div>
    </div>
    <div class="text-C84 mt-2">
      <p class="mb-2">*Note</p>
      <ol class="space-y-2 max-w-[290px]">
        <li
          class="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-3"
          v-for="item in totalReviewData"
          :key="item.label"
        >
          <img class="w-5 block shrink-0" :src="getImageUrl(item.icon)" alt="">
          <div class="grid grid-cols-[auto_1fr] items-center gap-1">
            <span class="w-3 h-3 rounded-full border-2 shrink-0" :style="{borderColor: item.backgroundColor}"></span>
            <span>{{ item.label }}</span>
          </div>
          <div class="grid grid-cols-[1fr_3fr] items-center gap-1">
            <span class="text-base font-semibold text-black">{{ item.data }}</span>
            <span>Reviews</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="4" fill="#DEFFE3"/>
            <path d="M10.6667 5.33331H5.33341V10.6666" stroke="#56D66B" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"/>
            <path d="M14.6667 14.6666L5.33342 5.33331" stroke="#56D66B" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"/>
          </svg>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {Line} from 'vue-chartjs';
import {computed, ref} from "vue";
import type {GetReviewReportResponse} from "gap-nodejs-sdk";
import {getImageUrl} from "@/utils/url";

type Props = {
  reviewReport: Nullable<GetReviewReportResponse>
}
const props = defineProps<Props>();

const totalReviewData = computed(() => [
  {
    icon: 'icon-gocheckin.svg',
    label: 'Go Checkin',
    backgroundColor: 'rgba(4, 191, 218, 1)',
    data: props.reviewReport?.total_gocheckin_review ?? 0,
  },
  {
    icon: 'icon-google.svg',
    label: 'Google',
    backgroundColor: 'rgba(202, 212, 219, 1)',
    data: props.reviewReport?.total_google_review ?? 0,
  },
]);

const totalReviewCount = computed(() => Number(props.reviewReport?.total_gocheckin_review ?? 0) + Number(props.reviewReport?.total_google_review ?? 0))

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const lineChartRef = ref<any>(null);
const data = computed(() => {
  return {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        data: [15, 30, 15, 15, 20, 16],
        borderColor: 'rgba(4, 191, 218, 0.5)',
        fill: {
          target: 'origin',
          above: 'rgba(4, 191, 218, 0.05)',
          below: 'rgba(4, 191, 218, 0)',
        }
      },
      {
        data: [8, 19, 3, 5, 2, 3],
        borderColor: 'rgba(132, 138, 156, 0.5)',
        fill: {
          target: 'origin',
          above: 'rgba(132, 138, 156, 0.05)',
          below: 'rgba(132, 138, 156, 0)'
        }
      }
    ]
  }
});

const options = {
  responsive: true,
  tension: 0.4,
  borderWidth: 2,
  showLine: true,
  elements: {
    point: {
      radius: 0
    }
  },
  scales: {
    y: {
      display: false,
    },
    x: {
      display: false,
    }
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script>

<style scoped>

</style>
