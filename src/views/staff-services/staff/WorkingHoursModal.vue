<template>
  <a-modal
    v-model:open="isVisible"
    title="Edit Working Hour"
    :width="900"
    centered
    :cancel-button-props="{
      danger: true,
    }"
    @cancel="hide"
    :ok-button-props="{
      loading: isUpdateStaffWorkHourLoading
    }"
    @ok="handleUpdateStaffWorkHour"
    :closable="!isUpdateStaffWorkHourLoading"
    :mask-closable="!isUpdateStaffWorkHourLoading"
  >
    <div class="flex justify-end mb-3">
      <a-button
        type="primary"
        class="secondary"
        @click.prevent="handleSetDefaultStaffWorkHour"
        :loading="isSetDefaultStaffWorkHourLoading"
        size="small"
      >
        Set working hours default
      </a-button>
    </div>
    <a-table
      v-if="largerThanMd"
      :columns="columns"
      :data-source="workHours"
      :pagination="false"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'day'">
          {{ record.weekDay }}
        </template>
        <template v-if="column.dataIndex === 'inTime'">
          <a-time-picker
            v-model:value="record.inTime"
            use12-hours
            :format="TIME_12_FORMAT"
            :value-format="TIME_12_FORMAT"
            :show-now="false"
            class="text-center font-semibold w-[146px]"
            :disabled="!record.isActive"
          >
            <template #suffixIcon></template>
            <template #clearIcon></template>
          </a-time-picker>
        </template>
        <template v-if="column.dataIndex === 'outTime'">
          <a-time-picker
            v-model:value="record.outTime"
            use12-hours
            :format="TIME_12_FORMAT"
            :value-format="TIME_12_FORMAT"
            :show-now="false"
            class="text-center font-semibold w-[146px]"
            :disabled="!record.isActive"
          >
            <template #suffixIcon></template>
            <template #clearIcon></template>
          </a-time-picker>
        </template>
        <template v-if="column.dataIndex === 'active'">
          <a-switch v-model:checked="record.isActive"/>
        </template>
      </template>
    </a-table>
    <div v-else class="space-y-4">
      <div
        class="card space-y-3"
        v-for="record in workHours"
        :key="record.weekDay"
      >
        <div class="grid grid-cols-2 gap-3">
          <div class="text-C84 font-semibold">DAY</div>
          <div class="text-primary font-semibold">
            {{ record.weekDay }}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="text-C84 font-semibold">IN TIME</div>
          <div>
            <a-time-picker
              v-model:value="record.inTime"
              use12-hours
              :format="TIME_12_FORMAT"
              :value-format="TIME_12_FORMAT"
              :show-now="false"
              class="text-center font-semibold"
              :disabled="!record.isActive"
            >
              <template #suffixIcon></template>
              <template #clearIcon></template>
            </a-time-picker>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="text-C84 font-semibold">OUT TIME</div>
          <div>
            <a-time-picker
              v-model:value="record.outTime"
              use12-hours
              :format="TIME_12_FORMAT"
              :value-format="TIME_12_FORMAT"
              :show-now="false"
              class="text-center font-semibold"
              :disabled="!record.isActive"
            >
              <template #suffixIcon></template>
              <template #clearIcon></template>
            </a-time-picker>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="text-C84 font-semibold">ACTIVE</div>
          <div>
            <a-switch v-model:checked="record.isActive"/>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {notification} from "ant-design-vue";
import {useStaffStore} from "@/stores/staff";
import {useGoBookingStore} from "@/stores/go-booking";
import dayjs from "dayjs";
import type {GetBusinessWorkHourResponse} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import {TIME_12_FORMAT} from "@/constant";
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');

const staffStore = useStaffStore();
const {updateStaffWorkHour} = staffStore;

const emits = defineEmits(['getStaffWorkHour']);

interface WorkHour {
  day: number,
  weekDay: string,
  inTime: string,
  outTime: string,
  isActive: boolean,
}

const isVisible = ref(false);

const workHours = ref<WorkHour[]>([]);
const staffId = ref<null | number>(null);

interface ShowData {
  workHours: WorkHour[],
  staffId: number,
}

const show = (data: ShowData) => {
  workHours.value = data.workHours;
  staffId.value = data.staffId;
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
};

const isUpdateStaffWorkHourLoading = ref(false);
const handleUpdateStaffWorkHour = async () => {
  try {
    isUpdateStaffWorkHourLoading.value = true;
    const spreadData = workHours.value.reduce((result: any, current: WorkHour) => {
      const key = dayjs().day(current.day).format('dd').toLowerCase();
      const inTime = dayjs(current.inTime, 'hh:mm A').hour() * 60 + dayjs(current.inTime, 'hh:mm A').minute();
      const outTime = dayjs(current.outTime, 'hh:mm A').hour() * 60 + dayjs(current.outTime, 'hh:mm A').minute();
      result[key] = `${inTime}, ${outTime}`;
      return result;
    }, {});

    const workingDay = workHours.value
      .filter((item: WorkHour) => item.isActive)
      .map((item: WorkHour) => item.day)
      .join(',');

    const data = {
      id: staffId.value,
      working_day: workingDay,
      ...spreadData,
    }
    await updateStaffWorkHour(data);
    notification.success({
      message: 'Update staff work hour success',
    });
    hide();
    emits('getStaffWorkHour');
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isUpdateStaffWorkHourLoading.value = false;
  }
};

const goBookingStore = useGoBookingStore();
const {getBusinessWorkHour} = goBookingStore;

const timeConvert = (min: number | string) => {
  min = Number(min)
  const hours = (min / 60);
  const formatHours = Math.floor(hours);
  const minutes = (hours - formatHours) * 60;
  const formatMinutes = Math.round(minutes);
  return dayjs(`${formatHours}:${formatMinutes}`, 'H:m').format('hh:mm A');
}

const transformBusinessWorkHour = (data: GetBusinessWorkHourResponse): WorkHour[] => {
  const staffWorkHour = data;
  return Array.from(Array(7)).map((item: any, index: number) => {
    const weekDay = dayjs().day(index).format('dddd');
    const weekDayShortLowercase = dayjs().day(index).format('dd').toLowerCase() as 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa';
    const timeOfDay = staffWorkHour[weekDayShortLowercase] as string;
    return {
      weekDay: weekDay,
      inTime: timeConvert(timeOfDay.split(', ')[0]),
      outTime: timeConvert(timeOfDay.split(', ')[1]),
      day: index,
      isActive: (staffWorkHour.working_day as string).includes(index as unknown as string) as boolean
    }
  })
}

const isSetDefaultStaffWorkHourLoading = ref(false);
const handleSetDefaultStaffWorkHour = async () => {
  try {
    isSetDefaultStaffWorkHourLoading.value = true;
    await getBusinessWorkHour({
      type: 'booking'
    })
    workHours.value = transformBusinessWorkHour(goBookingStore.businessWorkHour);
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSetDefaultStaffWorkHourLoading.value = false;
  }
}

const columns = [
  {
    title: 'DAY',
    dataIndex: 'day',
    key: 'day',
    align: 'left',
  },
  {
    title: 'IN TIME',
    dataIndex: 'inTime',
    key: 'inTime',
    align: 'center',
  },
  {
    title: 'OUT TIME',
    dataIndex: 'outTime',
    key: 'outTime',
    align: 'center',
  },
  {
    title: 'ACTIVE',
    dataIndex: 'active',
    key: 'active',
    align: 'right',
  },
];
defineExpose({
  show,
  hide
})
</script>

<style scoped>

</style>
