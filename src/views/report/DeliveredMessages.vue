<template>
  <section class="card">
    <h3 class="heading-3 mb-4">Delivered Messages</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
      <div class="">
        <div class="max-w-[200px] md:max-w-[130px] mx-auto md:mx-0">
          <div class="relative aspect-square">
            <div class="absolute inset-0 flex flex-col place-content-center text-center p-6 pointer-events-none">
              <p class="text-C84 mb-0">Total</p>
              <count-up class="text-[32px] leading-none font-semibold" :end-val="dashboardReport?.totalDelivery ?? 0"/>
            </div>
            <Doughnut
              :data="chartData"
              :options="chartOptions"
              class="relative z-[2]"
            />
          </div>
          <ol class="mt-4 flex flex-wrap justify-center gap-3 text-xs text-C84">
            <li
              class="grid items-center grid-cols-[auto_1fr] gap-1"
              v-for="item in totalMemberChartData.filter(item => item.label !== 'Total')"
              :key="item.label"
            >
              <span class="w-3 h-3 rounded-full border-2" :style="{borderColor: item.backgroundColor}"></span>
              <span>{{ item.label }}</span>
            </li>
          </ol>
        </div>
      </div>
      <div class="text-C84">
        <p class="mb-2">*Note</p>
        <ol class="space-y-2">
          <li
            class="grid items-center grid-cols-[auto_1fr_1fr] gap-3"
            v-for="item in totalMemberChartData"
            :key="item.label"
          >
            <span class="w-3 h-3 rounded-full border-2 shrink-0" :style="{borderColor: item.backgroundColor}"></span>
            <span>{{ item.label }}</span>
            <span class="text-base font-semibold text-black">{{ item.data }}</span>
          </li>
          <li><span class="text-black">Redemption</span> - {{ dashboardReport?.totalRedemption ?? 0 }} times</li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {Doughnut} from 'vue-chartjs';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {computed} from "vue";
import type {GetDashboardReportResponse} from "gap-nodejs-sdk";

type Props = {
  dashboardReport: Nullable<GetDashboardReportResponse>
}

const props = defineProps<Props>();

ChartJS.register(ArcElement, Tooltip, Legend);

const totalMemberChartData = computed(() => [
  {
    label: 'SMS',
    backgroundColor: '#04BFDA',
    data: props.dashboardReport?.totalCampaignSmsSent ?? 0,
  },
  {
    label: 'Email',
    backgroundColor: '#9B88ED',
    data: props.dashboardReport?.totalCampaignEmailSent ?? 0,
  },
  {
    label: 'Total',
    backgroundColor: '#558BE3',
    data: props.dashboardReport?.totalDelivery,
  },
]);

const chartData = computed(() => ({
  labels: totalMemberChartData.value.map(item => item.label),
  datasets: [
    {
      backgroundColor: totalMemberChartData.value.map(item => item.backgroundColor),
      data: totalMemberChartData.value.map(item => Number(item.data)),
    }
  ],
}));

const chartOptions = {
  responsive: true,
  cutout: '75%',
  plugins: {
    legend: {
      display: false,
    },
  },
};
</script>

<style scoped>

</style>
