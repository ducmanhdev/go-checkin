<template>
  <section class="card md:flex !p-4 sm:!p-6">
    <div class="md:w-[calc(100%-240px)] md:pr-6 xl:pr-[50px] mb-4 md:mb-0">
      <h3 class="heading-3 mb-1">Customer chart</h3>
      <p class="text-C84 mb-4">Overview of Customer</p>
      <Bar
        :data="data"
        :options="options as any"
      />
    </div>
    <div class="md:w-[240px]">
      <p class="text-C84 mb-2">Filter</p>
      <component
        :is="pickerComponent"
        class="!w-full date-range-picker-custom"
        :value="filterDate as any"
        :allow-clear="false"
        :picker="pickerConverted"
        :disabled-date="disabledDate"
        :format="FORMAT[picker]"
        :disabled="disabledFields"
        @change="handleFilterDateChange"
      />
      <div class="flex gap-2 mt-4">
        <button
          type="button"
          v-for="item in listPicker"
          :key="item"
          class="text-center border py-1 px-2 rounded-base text-[13px] flex-auto capitalize outline-none appearance-none"
          :class="{
            'text-white bg-primary border-primary font-medium ': picker === item,
            'text-C99 border-C99': picker !== item
          }"
          @click="handleSelectPicker(item)"
        >
          {{ item }}
        </button>
      </div>
      <div class="mt-7">
        <p class="heading-3 mb-0">Total Customer</p>
        <count-up class="font-semibold text-[32px] mb-0" :end-val="totalCustomer"/>
      </div>
      <ol class="mt-7 text-xs text-C84 space-y-2">
        <li>*Note</li>
        <li
          class="grid items-center grid-cols-[auto_1fr] gap-2"
          v-for="item in data.datasets"
          :key="item.label"
        >
          <span class="w-3 h-3 rounded-full border-2" :style="{borderColor: item.backgroundColor}"></span>
          <span>{{ item.label }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {Bar} from 'vue-chartjs';
import dayjs from "dayjs";
import type {Dayjs} from "dayjs";
import type {GetDashboardReportChartResponse} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";
import {DatePicker, RangePicker} from "ant-design-vue";

type Props = {
  totalCustomer: number;
}
const props = defineProps<Props>();

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FORMAT = {
  date: 'MM/DD/YYYY',
  week: 'MM/DD/YYYY',
  month: 'YYYY',
  year: 'YYYY',
} as const;
const VALUE_FORMAT = {
  date: 'YYYY-MM-DD',
  week: 'YYYY-MM-DD',
  month: 'YYYY',
  year: 'YYYY',
} as const;
const DAY_DIFFERENCE = 11;

const listPicker = ['date', 'week', 'month', 'year'] as const;
const picker = ref<typeof listPicker[number]>('date');
const pickerConverted = computed(() => {
  const list = {
    date: 'date',
    week: 'month',
    month: 'year',
    year: 'year',
  } as const;
  return list[picker.value]
});
const resetFilterDate = () => {
  filterDate.value = picker.value === 'date' ? [dayjs().subtract(11, 'day'), dayjs()] : dayjs();
}
const handleSelectPicker = (value: typeof listPicker[number]) => {
  picker.value = value;
  resetFilterDate();
}

const disabledDate = (current: Dayjs) => {
  if (picker.value === 'date') {
    return current && current > dayjs().subtract(11, 'day').endOf('day');
  }
  return current && current > dayjs().endOf('day');
};
const disabledFields = computed<boolean | [boolean, boolean]>(() => picker.value === 'date' ? [false, true] : false);
const filterDate = ref<Dayjs | [Dayjs, Dayjs]>([dayjs().subtract(DAY_DIFFERENCE, 'day'), dayjs()]);

interface IHandleFilterDateChange {
  (value: Dayjs): void,

  (value: [Dayjs, Dayjs] | [string, string], dateString: [string, string]): void,
}

const handleFilterDateChange: IHandleFilterDateChange = (value) => {
  if (Array.isArray(value)) {
    filterDate.value = [value[0], dayjs(value[0]).add(DAY_DIFFERENCE, 'day')] as [Dayjs, Dayjs];
    return;
  }
  filterDate.value = value;
}

const isGetDashboardReportChartLoading = ref(false);
const dashboardReportChart = ref<GetDashboardReportChartResponse | null>(null);
const handleGetDashboardReportChart = async () => {
  try {
    const format = VALUE_FORMAT[picker.value];
    const type = picker.value === 'date' ? 'day' : picker.value;
    const start = picker.value === 'date' ? ((filterDate.value as any)[0] as Dayjs).format(format) : (filterDate.value as Dayjs).format(format);
    isGetDashboardReportChartLoading.value = true;
    dashboardReportChart.value = await goCheckInSdk.dashboard.getDashboardReportChart({
      type,
      start,
    });
  } catch (error) {
    handleError({error});
  } finally {
    isGetDashboardReportChartLoading.value = false;
  }
}

const pickerComponent = computed(() => picker.value === 'date' ? RangePicker : DatePicker);
watch(() => filterDate.value, handleGetDashboardReportChart, {
  immediate: true,
});

const data = computed(() => {
  const values = dashboardReportChart.value || [];
  const labels = values.map(item => item?.category!);
  const checkedIn = values.map(item => Number(item?.checkin));
  const newClient = values.map(item => -Number(item?.new_sign_up));
  return {
    labels: labels,
    datasets: [
      {
        label: 'Checked In',
        backgroundColor: '#6F95FF',
        data: checkedIn
      },
      {
        label: 'New Client',
        backgroundColor: '#65C8FF',
        data: newClient
      }
    ]
  }
});
const options = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#848A9C',
      },
      grid: {
        display: false,
      }
    },
    y: {
      stacked: true,
      ticks: {
        color: '#848A9C',
        callback: function (value: number) {
          return value < 0 ? -value : value;
        },
      },
      border: {
        dash: [4, 4],
        dashOffset: 2,
      },
      grid: {
        color: '#C5C5C5',
        drawTicks: true,
      }
    }
  },
  barThickness: 14,
  borderRadius: 50,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y < 0 ? -context.parsed.y : context.parsed.y;
          }
          return label;
        }
      }
    },
  },
}
</script>

<style scoped>

</style>
