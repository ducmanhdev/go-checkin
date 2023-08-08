<template>
  <div class="">
    <div class="sm:text-right">
      <a-button
        type="primary"
        @click.prevent="handleOpenUpdateStaffWorkHour"
        size="small"
      >
        Edit
      </a-button>
    </div>
    <div class="mt-2">
      <div class="grid grid-cols-[1rem_1fr_1fr_1fr] items-center gap-3 font-semibold p-2">
        <div></div>
        <div></div>
        <div>IN</div>
        <div>OUT</div>
      </div>
      <div class="space-y-3 mt-1 text-xs sm:text-sm">
        <base-loading v-if="isGetStaffWorkHourLoading"></base-loading>
        <template v-else-if="workHours?.length" v-for="item in workHours" :key="item">
          <div
            :class="{
              'text-C82': !item.isActive,
              'text-black': item.isActive,
            }"
            class="transition grid grid-cols-[1rem_1fr_1fr_1fr] items-center min-h-[38px] gap-3 p-2 bg-white rounded shadow-sm">
            <div>
              <check-outlined v-if="item.isActive" class="!block !text-success"/>
              <close-circle-outlined v-else class="!block !text-error"/>
            </div>
            <div>
              <span class="hidden sm:block">{{ item.weekDay }}</span>
              <span class="sm:hidden">{{ (item.weekDay || '').slice(0, 3) }}</span>
            </div>
            <div>{{ item.inTime }}</div>
            <div>{{ item.outTime }}</div>
          </div>
        </template>
        <a-empty v-else></a-empty>
      </div>
    </div>
  </div>
  <working-hours-modal
    ref="workHoursModalRef"
    @get-staff-work-hour="handleGetStaffWorkHour"
  />
</template>

<script setup lang="ts">
import {useStaffStore} from "@/stores/staff";
import {ref, watch} from "vue";
import dayjs from "dayjs";
import WorkingHoursModal from "./WorkingHoursModal.vue"
import BaseLoading from "@/components/base/BaseLoading.vue"
import handleError from "@/utils/error";
import {CloseCircleOutlined, CheckOutlined} from "@ant-design/icons-vue";

const staffStore = useStaffStore();
const {getStaffWorkHour} = staffStore;

interface Props {
  staffId: number,
}

const props = defineProps<Props>();

const timeConvert = (min: number | string) => {
  min = Number(min)
  const hours = (min / 60);
  const formatHours = Math.floor(hours);
  const minutes = (hours - formatHours) * 60;
  const formatMinutes = Math.round(minutes);
  return dayjs(`${formatHours}:${formatMinutes}`, 'H:m').format('hh:mm A');
}

interface WorkHour {
  day: number,
  weekDay: string,
  inTime: string,
  outTime: string,
  isActive: boolean,
}

const transformBusinessWorkHour = (): WorkHour[] => {
  const staffWorkHour = staffStore.staffWorkHour;
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
const workHours = ref<WorkHour[]>([]);
const isGetStaffWorkHourLoading = ref(false);
const handleGetStaffWorkHour = async () => {
  try {
    isGetStaffWorkHourLoading.value = true;
    await getStaffWorkHour({
      id: props.staffId
    });
    workHours.value = transformBusinessWorkHour();
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetStaffWorkHourLoading.value = false;
  }
};
watch(() => props.staffId, handleGetStaffWorkHour, {immediate: true});

const workHoursModalRef = ref<InstanceType<typeof WorkingHoursModal> | null>(null);
const handleOpenUpdateStaffWorkHour = () => {
  workHoursModalRef.value?.show({
    workHours: workHours.value,
    staffId: props.staffId
  });
}
</script>

<style scoped>

</style>
