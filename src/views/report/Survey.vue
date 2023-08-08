<template>
  <section class="card">
    <h3 class="heading-3 mb-4">Survey</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[5fr_4fr] items-start gap-4">
      <div>
        <div class="relative mx-auto md:mx-0 aspect-square max-w-[200px]">
          <div class="absolute inset-0 flex flex-col place-content-center text-center p-8 pointer-events-none">
            <p class="text-C84 mb-0">Total</p>
            <count-up class="text-[32px] leading-snug font-semibold mb-0" :end-val="200"/>
          </div>
          <Doughnut
            :data="chartData"
            :options="chartOptions"
            class="relative z-[2]"
          />
        </div>
      </div>
      <div class="text-C84">
        <p class="mb-2">*Note</p>
        <ol class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-x-3 gap-y-1 md:gap-y-2">
          <li
            class="grid items-center grid-cols-[auto_3fr_1fr] gap-2"
            v-for="item in totalMemberChartData"
            :key="item.label"
          >
            <img class="w-4.5 block shrink-0" :src="getImageUrl(item.icon)" alt="">
            <span>{{ item.label }}</span>
            <span class="text-base font-semibold text-black">{{ item.data }}</span>
          </li>
        </ol>
      </div>
    </div>
    <ol class="mt-4 lg:mt-10 flex flex-wrap gap-3 text-xs text-C84">
      <li
        class="grid items-center grid-cols-[auto_1fr] gap-1"
        v-for="item in totalMemberChartData"
        :key="item.label"
      >
        <span class="w-3 h-3 rounded-full border-2" :style="{borderColor: item.backgroundColor}"></span>
        <span>{{ item.label }}</span>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import {Doughnut} from 'vue-chartjs';
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {ref} from "vue";
import {getImageUrl} from "@/utils/url";

ChartJS.register(ArcElement, Tooltip, Legend);

const totalMemberChartData = [
  {
    icon: 'icon-google.svg',
    label: 'Google',
    backgroundColor: '#00BAD4',
    data: 90,
  },
  {
    icon: 'icon-facebook.svg',
    label: 'Facebook',
    backgroundColor: '#88E7ED',
    data: 90,
  },
  {
    icon: 'icon-website.svg',
    label: 'Website',
    backgroundColor: '#67ADFF',
    data: 10,
  },
  {
    icon: 'icon-instagram.svg',
    label: 'Instagram',
    backgroundColor: '#FFCC4A',
    data: 10,
  },
  {
    icon: 'icon-other.svg',
    label: 'Other',
    backgroundColor: '#C7C7C7',
    data: 0,
  },
];
const chartData = ref({
  labels: totalMemberChartData.map(item => item.label),
  datasets: [
    {
      backgroundColor: totalMemberChartData.map(item => item.backgroundColor),
      data: totalMemberChartData.map(item => item.data),
    }
  ],
});
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
