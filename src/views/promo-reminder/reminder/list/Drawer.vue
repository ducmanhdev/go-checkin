<template>
  <a-drawer
    v-model:open="isVisible"
    title="Edit Reminder Campaign Info"
    placement="right"
    :width="560"
    @close="handleResetState"
    :mask-closable="!isSubmitLoading"
    :closable="!isSubmitLoading"
  >
    <a-form
      autocomplete="off"
      layout="vertical"
      hide-required-mark
    >
      <a-form-item
        name="name"
        v-bind="validateInfos.name"
        label="What is your offer name?"
      >
        <a-input v-model:value="formModel.name"/>
      </a-form-item>
      <a-form-item
        name="logic_value"
        v-bind="validateInfos.logic_value"
        label="What is the value of promotion?"
      >
        <div class="grid grid-cols-2 items-center gap-3">
          <div class="flex justify-center">
            <quantity
              v-model="formModel.logic_value"
              :max="formModel.logic_type === 'percent' ? 100 : undefined"
              class="!w-[160px]"
            />
          </div>
          <div class="flex justify-center">
            <a-radio-group
              v-model:value="formModel.logic_type"
              name="valueType"
              class="!flex flex-wrap gap-x-4 md:gap-x-7 gap-y-4"
              :options="listLogicType"
            />
          </div>
        </div>
      </a-form-item>
      <a-form-item
        name="expired_day_in"
        v-bind="validateInfos.expired_day_in"
        label="How long do you want to maintain this reminder?"
      >
        <a-select v-model:value="formModel.expired_day_in" :options="expiredDayInOptions"/>
      </a-form-item>

      <a-form-item
        name="content"
        v-bind="validateInfos.content"
        label="Message to show to customer"
      >
        <a-textarea
          class="!h-[100px]"
          :value="formModel.content"
          show-count
          :maxlength="DEFAULT_MESSAGE_MAX_LENGTH"
        />
      </a-form-item>
      <a-form-item
        name="is_active"
        v-bind="validateInfos.is_active"
        label="Change status"
      >
        <a-switch
          v-model:checked="formModel.is_active"
          :checked-value="1"
          :un-checked-value="0"
        />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button
        type="primary"
        @click="handleSubmit"
        :loading="isSubmitLoading"
      >
        Submit
      </a-button>
      <a-button
        danger
        ghost
        @click="hide"
        :disabled="isSubmitLoading"
      >
        Cancel
      </a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import {ref} from "vue";
import type {Rule} from 'ant-design-vue/es/form';
import Quantity from "@/components/Quantity.vue";
import {Form, notification} from 'ant-design-vue';
import handleError from "@/utils/error";
import {DEFAULT_MESSAGE_MAX_LENGTH} from "@/constant";
import type {GetCampaignReminderListResponse} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";

type Emits = {
  (e: 'refresh'): void
}
const emit = defineEmits<Emits>();

const useForm = Form.useForm;
const isVisible = ref(false);

const expiredDayInOptions = [
  {label: '3 days', value: 3},
  {label: '7 days', value: 7},
  {label: '14 days', value: 14},
  {label: '30 days', value: 30}
];
const listLogicType = [
  {
    label: '%',
    value: 'percent'
  },
  {
    label: '$',
    value: 'usd'
  }
];

type FormState = {
  id: number,
  name: string,
  logic_value: number,
  logic_type: string,
  expired_day_in: number,
  content: string,
  is_active: number,
  after_date: number,
}

const formModel = ref<FormState>({
  id: 0,
  name: '',
  logic_value: 0,
  logic_type: 'percent',
  expired_day_in: 30,
  content: '',
  is_active: 1,
  after_date: 90,
});

const formRules = ref<Record<string, Rule[]>>({
  name: [{required: true, message: 'Name is required'}],
  expired_day_in: [{required: true, message: 'Expired day in is required'}],
});
const {resetFields, validate, validateInfos} = useForm(formModel, formRules);

const isSubmitLoading = ref(false);
const handleSubmit = async () => {
  try {
    isSubmitLoading.value = true;
    await validate();
    const data = {
      ...formModel.value,
    };
    await goCheckInSdk.campaign.updateCampaignReminder(data);
    notification.success({
      message: 'Update success',
    });
    hide();
    emit('refresh');
  } catch (error) {
    handleError({error})
  } finally {
    isSubmitLoading.value = false;
  }
};
const handleResetState = () => {
  resetFields();
};
const show = (data: GetCampaignReminderListResponse[number]) => {
  formModel.value.id = data.id!;
  formModel.value.name = data.name!;
  formModel.value.logic_value = +data.logic_value!;
  formModel.value.logic_type = data.logic_type!;
  formModel.value.expired_day_in = data.expired_day_in!;
  formModel.value.content = data.remind_campaign?.content!;
  formModel.value.is_active = data.is_active!;
  formModel.value.after_date = data.remind_campaign?.after_date!;
  isVisible.value = true;
};
const hide = () => {
  isVisible.value = false;
  resetFields();
};
defineExpose({
  show,
  hide
})
</script>

<style lang="scss" scoped>

</style>
