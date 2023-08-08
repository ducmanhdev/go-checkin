<template>
  <base-loading v-if="loading"></base-loading>
  <div v-else class="space-y-7">
    <div>
      <p class="font-medium text-base">Salary by period</p>
      <a-input-number v-model:value="formModel.salary_by_period" class="!w-full"/>
    </div>
    <div class="">
      <p class="font-medium text-base">Choose Employee - Owner Commission</p>
      <div class="space-y-4">
        <div v-for="tipKey in Object.keys(tipList)" :key="tipKey">
          <p class="text-secondary">{{ tipList[tipKey as keyof typeof tipList] }}</p>
          <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
            <a-button
              type="primary"
              size="small"
              v-for="item in choiceList"
              :key="item.value"
              :ghost="formModel[tipKey as keyof typeof tipList] !== item.value"
              @click="formModel[tipKey as keyof typeof tipList] = item.value"
              class="!min-w-0"
            >
              {{ item.label }}
            </a-button>
            <a-button
              type="primary"
              size="small"
              :ghost="!isOtherValue(formModel[tipKey as keyof typeof tipList])"
              @click="handleCustomizeEmployee(tipKey)"
              class="!min-w-0"
            >
              {{
                isOtherValue(formModel[tipKey as keyof typeof tipList]) ? useNumberToPercentageFormat(formModel[tipKey as keyof typeof tipList], 1) : 'Other'
              }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <p class="text-secondary">Card Charge(%)</p>
      <a-input v-input-number v-model:value="cardCharge" class="!w-full"/>
    </div>
    <div>
      <p class="text-secondary">Do you want your employees to share credit card fees with you by withdrawing a
        percentage from the commission?</p>
      <div class="flex items-center space-x-2">
        <a-switch v-model:checked="formModel.is_tip_to_check" :checked-value="1" :un-checked-value="0"/>
        <span>Credit card tips added to check</span>
      </div>
    </div>
    <div>
      <p class="font-medium text-base">Percentage charge(%)</p>
      <a-input v-input-number v-model:value="tipToCheckPercentage" class="!w-full"/>
    </div>
    <div class="flex items-center space-x-2">
      <a-switch v-model:checked="formModel.count_day_off_state" :checked-value="1" :un-checked-value="0"/>
      <span>Count days off</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-[3fr_7fr] gap-3 md:gap-50px ">
      <div>
        <p class="font-medium text-base">Maximum days allowed to be off</p>
        <a-input-number v-model:value="formModel.count_day_off_value" class="!w-full"
                        :disabled="formModel.count_day_off_state === 0"/>
      </div>
      <div>
        <p class="font-medium text-base">Days not allowed to be off</p>
        <ul class="grid grid-cols-7 mb-0"
            :class="{'opacity-50 pointer-events-none': formModel.count_day_off_state === 0}">
          <li
            class="first:rounded-l first:border-l last:rounded-r border-l-0 cursor-pointer border border-primary text-primary text-center px-1 py-2.5 text-tiny sm:text-xs"
            v-for="item in weekDate"
            :key="item.shortName"
            :class="{'bg-primary text-white': item.isSelected}"
            @click="item.isSelected = !item.isSelected"
          >
            {{ item.shortName }}
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-wrap gap-3 child:w-full md:child:w-auto child:!min-w-[160px] md:child:!min-w-[190px]">
      <a-button danger @click="back">Back</a-button>
      <a-button type="primary" @click.prevent="handleSubmit">Done</a-button>
    </div>
  </div>
  <customize-employee-modal ref="CustomizeEmployeeModalRef"></customize-employee-modal>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {notification} from "ant-design-vue";
import {useStaffStore} from "@/stores/staff";
import {useNumberToPercentageFormat} from "@/utils/formatter";
import CustomizeEmployeeModal from "./CustomizeEmployeeModal.vue"
import type {GetListCommissionByStaffResponse} from "gap-nodejs-sdk";
import BaseLoading from "@/components/base/BaseLoading.vue";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import handleError from "@/utils/error";

dayjs.extend(weekday);

interface Props {
  loading: boolean,
  staffId: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});
const emits = defineEmits(['back', 'reloadCommission']);
const choiceList = ref([
  {
    label: '70-30',
    value: 0.7
  },
  {
    label: '60-40',
    value: 0.6
  },
  {
    label: '50-50',
    value: 0.5
  },
  {
    label: '40-60',
    value: 0.4
  },
  {
    label: '100-0',
    value: 1
  },
]);

const tipList = {
  service_rate: 'For Service',
  product_rate: 'For Product',
  gift_card_rate: 'For Giftcard',
  cash_check_percentage: 'Choose Cash - Check Percentage',
}

const commissionKey = 'salary_commission';

interface Model {
  salary_by_period: number,
  service_rate: number,
  product_rate: number,
  gift_card_rate: number,
  cash_check_percentage: number,
  card_charge: number,
  is_tip_to_check: number,
  tip_to_check_percentage: number,
  count_day_off_state: number,
  count_day_off_value: number,
}

const createWeekDate = () => {
  return Array.from(Array(7)).map((item, index) => ({
    shortName: dayjs().weekday(index).format('ddd'),
    longName: dayjs().weekday(index).format('dddd'),
    isSelected: false,
  }))
}
const weekDate = ref(createWeekDate());

const CustomizeEmployeeModalRef = ref<InstanceType<typeof CustomizeEmployeeModal> | null>(null);

const initModel: Model = {
  salary_by_period: 0,
  service_rate: 0.7,
  product_rate: 0.7,
  gift_card_rate: 0.7,
  cash_check_percentage: 0.7,
  card_charge: 0,
  is_tip_to_check: 0,
  tip_to_check_percentage: 0,
  count_day_off_state: 0,
  count_day_off_value: 0,
}
const formModel = ref<Model>(initModel);

const cardCharge = computed({
  get() {
    return Number(((formModel.value.card_charge * 100).toFixed(2)));
  },
  set(newValue) {
    formModel.value.card_charge = newValue / 100
  }
});

const tipToCheckPercentage = computed({
  get() {
    return Number(((formModel.value.tip_to_check_percentage * 100).toFixed(2)));
  },
  set(newValue) {
    formModel.value.tip_to_check_percentage = newValue / 100
  }
});

const handleCustomizeEmployee = async (key: string) => {
  try {
    const tipValue = (formModel.value as any)[key];
    const newValue = await new Promise((resolve, reject) => {
      return CustomizeEmployeeModalRef.value?.show({
        value: tipValue,
        onResolve: resolve,
        onReject: reject,
      })
    })
    if (!newValue && newValue !== 0) return;
    (formModel.value as any)[key] = newValue;
  } catch (error) {
    console.error(error);
  }
}

const back = () => {
  emits('back');
}

const isOtherValue = (value: number): boolean => {
  const choiceValueList = choiceList.value.map(item => item.value);
  return !choiceValueList.includes(value) && value !== 0;
}

const staffStore = useStaffStore();
watch(() => staffStore.listCommission, (newValue: GetListCommissionByStaffResponse) => {
  let dateRes: any[] = [];
  if (JSON.parse((newValue[commissionKey] as any)['day_can_not_off'])) {
    dateRes = JSON.parse((newValue[commissionKey] as any)['day_can_not_off']) || []
  }
  weekDate.value.forEach((date: any) => {
    date.isSelected = dateRes.includes(date.longName)
  })
  Object.keys(formModel.value).forEach((key: string) => {
    const tKey = key as keyof Model;
    (formModel.value as Model)[tKey] = (newValue[commissionKey] as Model)[tKey] ?? (initModel as Model)[tKey];
  })
}, {immediate: true});

const {saveCommission} = staffStore;
const isSubmitLoading = ref(false);
const handleSubmit = async () => {
  try {
    isSubmitLoading.value = true;
    await saveCommission({
      type: commissionKey,
      staff_id: props.staffId,
      day_can_not_off: weekDate.value.filter(item => item.isSelected).map(item => item.longName),
      ...formModel.value
    });
    notification.success({
      message: 'Update success',
    });
    emits('reloadCommission');
    back();
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSubmitLoading.value = false;
  }
};
</script>

<style scoped>

</style>
