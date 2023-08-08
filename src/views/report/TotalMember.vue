<template>
  <section class="card">
    <h3 class="heading-3 mb-4">Total Member</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 items-start gap-4">
      <div>
        <div class="relative mx-auto md:mx-0 aspect-square max-w-[200px]">
          <div class="absolute inset-0 flex flex-col place-content-center text-center p-8 pointer-events-none">
            <p class="text-C84 mb-0">Total member</p>
            <count-up class="text-[32px] leading-snug font-semibold mb-0" :end-val="members?.all || 0"/>
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
            class="grid items-center grid-cols-[auto_3fr_2fr] xl:grid-cols-[auto_3fr_1fr_2fr] gap-3"
            v-for="item in totalMemberChartData"
            :key="item.label"
          >
            <span class="w-3 h-3 rounded-full border-2 shrink-0" :style="{borderColor: item.backgroundColor}"></span>
            <span>{{ item.label }}</span>
            <span class="text-base font-semibold text-black">{{ item.data }}</span>
            <span class="hidden xl:block">members</span>
          </li>
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
  members: GetDashboardReportResponse["customer"];
}
const props = defineProps<Props>();

ChartJS.register(ArcElement, Tooltip, Legend);

const totalMemberChartData = computed(() => {
  return [
    {
      label: 'VIP',
      backgroundColor: '#04BFDA',
      data: props.members?.vip,
    },
    {
      label: 'New',
      backgroundColor: '#9B88ED',
      data: props.members?.new,
    },
    {
      label: 'Regular',
      backgroundColor: '#FB67CA',
      data: props.members?.regular,
    },
    {
      label: 'At Risk',
      backgroundColor: '#FFA84A',
      data: props.members?.atrisk,
    },
    {
      label: 'Normal',
      backgroundColor: '#83D811',
      data: props.members?.normal,
    },
    {
      label: 'Booking',
      backgroundColor: '#C7EF29',
      data: props.members?.booking,
    },
  ]
});

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
    // htmlLegend: {
    //   containerID: 'legend-container',
    // },
  },
};

// const getOrCreateLegendList = (chart: any, id: string) => {
//   const legendContainer = document.getElementById(id)!;
//   let listContainer = legendContainer?.querySelector('ul');
//   if (!listContainer) {
//     listContainer = document.createElement('ul');
//     legendContainer?.appendChild(listContainer);
//   }
//   listContainer.classList.add('space-y-2');
//   return listContainer;
// };
// const htmlLegendPlugin = {
//   id: 'htmlLegend',
//   afterUpdate(chart: any, args: any, options: any) {
//     const ul = getOrCreateLegendList(chart, options.containerID) as HTMLUListElement;
//     while (ul?.firstChild) {
//       ul?.firstChild.remove();
//     }
//     // Reuse the built-in legendItems generator
//     const labels = chart.options.plugins.legend.labels.generateLabels(chart);
//     console.log(chart.data.datasets[0])
//     labels.forEach((label: any, index: number) => {
//       let li = new DOMParser().parseFromString(`
//         <li class="grid items-center grid-cols-[auto_3fr_2fr] lg:grid-cols-[auto_3fr_1fr_2fr] gap-3 cursor-pointer ${label.hidden ? 'line-through' : ''}">
//           <span class="w-3 h-3 rounded-full border-2 shrink-0" style="border-color: ${label.fillStyle}"></span>
//           <span>${label.text}</span>
//           <span class="text-base font-semibold text-black">${chart.data.datasets[0].data[index]}</span>
//           <span class="hidden lg:block">members</span>
//         </li>
//       `, 'text/html').body.firstChild as HTMLLIElement;
//       li.onclick = () => {
//         const {type} = chart.config;
//         if (type === 'pie' || type === 'doughnut') {
//           // Pie and doughnut charts only have a single dataset and visibility is per item
//           chart.toggleDataVisibility(label.index);
//         } else {
//           chart.setDatasetVisibility(label.datasetIndex, !chart.isDatasetVisible(label.datasetIndex));
//         }
//         chart.update();
//       };
//       ul.appendChild(li);
//     });
//   }
// };
// const plugins = [htmlLegendPlugin];
</script>

<style scoped>

</style>
