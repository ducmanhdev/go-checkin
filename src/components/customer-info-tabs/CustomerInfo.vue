<template>
  <div>
    <base-loading-skeleton v-if="isGetCustomerInfoLoading"/>
    <a-empty v-else-if="!customerInfo"/>
    <div v-else>
      <div class="sm:flex sm:items-center gap-3 mb-7">
        <div class="flex items-center gap-3 mb-3 sm:mb-0">
          <div
            class="shrink-0 w-[40px] h-[40px] rounded-full flex justify-center items-center p-1 bg-C9 text-white text-base font-semibold uppercase">
            <template v-if="customerInfo?.full_name">
              {{ customerInfo?.full_name?.charAt(0) }}
            </template>
            <user-outlined v-else/>
          </div>
          <div class="grow">
            <p class="text-base font-semibold mb-0 line-clamp-2 break-all">{{ customerInfo?.full_name || 'N/A' }}</p>
            <p class="font-medium mb-0">Since {{ dayjs(customerInfo?.create_at).format(FULL_DATE_FORMAT) }}</p>
          </div>
        </div>
        <div class="self-end">
          <p class="font-medium mb-0">Current point: <span
            class="font-semibold text-primary">{{ customerInfo?.current_point }}pts</span></p>
        </div>
      </div>
      <a-form
        autocomplete="off"
        layout="vertical"
        class="sm:grid sm:grid-cols-2 gap-4 child:sm:!mb-0"
      >
        <a-form-item
          class="col-span-2"
          name="point_changed"
          v-bind="validateInfos.point_changed"
        >
          <div class="sm:flex sm:items-center gap-5">
            <p class="mb-2 sm:mb-0">Add/ remove from current pts:</p>
            <quantity
              :min="-(customerInfo?.current_point!) || 0"
              v-model="formModel.point_changed" class="!w-[160px]"
            />
          </div>
        </a-form-item>
        <a-form-item class="col-span-2">
          <ul class="flex flex-wrap gap-y-2 gap-x-[70px]">
            <li>Total visit: <span class="font-semibold">{{ customerInfo?.visit_count }}</span></li>
            <li>Lifetime point <span class="font-semibold">{{ customerInfo?.lifetime_point }}</span></li>
            <li>Source: Google <span class="font-semibold">{{ customerInfo?.source }}</span></li>
          </ul>
        </a-form-item>
        <a-form-item
          name="full_name"
          v-bind="validateInfos.full_name"
          label="Full name"
          class="col-span-2"
        >
          <a-input
            v-model:value="formModel.full_name"
          />
        </a-form-item>
        <a-form-item
          name="phone"
          v-bind="validateInfos.phone"
          label="Phone"
          class="col-span-2"
        >
          <a-input
            v-maska
            :data-maska="PHONE_MASK"
            v-model:value="formModel.phone"
            disabled
          />
        </a-form-item>
        <a-form-item
          name="email"
          v-bind="validateInfos.email"
          label="Email"
        >
          <a-input
            v-model:value="formModel.email"
          />
        </a-form-item>
        <a-form-item
          name="birthday"
          v-bind="validateInfos.birthday"
          label="Birth day"
        >
          <a-date-picker v-model:value="formModel.birthday" :value-format="SEND_DATE_FORMAT" class="w-full"/>
        </a-form-item>
        <a-form-item
          name="note"
          v-bind="validateInfos.note"
          label="Note"
          class="col-span-2"
        >
          <a-textarea v-model:value="formModel.note" :rows="10"/>
        </a-form-item>
        <a-form-item
          name="is_send_sms"
          v-bind="validateInfos.is_send_sms"
          class="col-span-2"
        >
          <a-checkbox v-model:checked="formModel.is_send_sms">Is send sms</a-checkbox>
        </a-form-item>
        <a-form-item
          name="is_blocked_from_booking"
          v-bind="validateInfos.is_blocked_from_booking"
          class="!mb-0 col-span-2"
        >
          <a-checkbox v-model:checked="formModel.is_blocked_from_booking">Block from booking online</a-checkbox>
        </a-form-item>
      </a-form>
      <a-divider/>
      <div class="text-center">
        <a-button
          type="primary"
          @click="handleSubmit"
          :loading="isSubmitLoading"
          class="w-full sm:w-auto"
        >
          Submit
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {nextTick, ref, watch} from 'vue';
import Quantity from "@/components/Quantity.vue";
import type {Rule} from "ant-design-vue/es/form";
import {Form, notification} from 'ant-design-vue';
import {FULL_DATE_FORMAT, PHONE_MASK, SEND_DATE_FORMAT} from "@/constant";
import type {GetCustomerResponse} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";
import {UserOutlined} from "@ant-design/icons-vue";
import dayjs from 'dayjs';
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";

type Props = {
  customerId: number;
}

const props = defineProps<Props>();

const customerInfo = ref<GetCustomerResponse | null>(null);
const isGetCustomerInfoLoading = ref(false);
const handleGetCustomerInfo = async () => {
  try {
    if (!props.customerId) return;
    isGetCustomerInfoLoading.value = true;
    customerInfo.value = await goCheckInSdk.customer.getCustomer({
      id: props.customerId,
    });
    formModel.value.id = customerInfo.value?.id!;
    formModel.value.point_changed = 0;
    formModel.value.full_name = customerInfo.value?.full_name || '';
    formModel.value.phone = customerInfo.value?.phone || '';
    formModel.value.email = customerInfo.value?.email || '';
    formModel.value.birthday = customerInfo.value?.birthday as any || '';
    formModel.value.note = customerInfo.value?.note || '';
    formModel.value.is_send_sms = Boolean(customerInfo.value?.is_send_sms);
    formModel.value.is_blocked_from_booking = Boolean(customerInfo.value?.is_blocked_from_booking);
    await nextTick();
    clearValidate();
  } catch (error) {
    handleError({error});
  } finally {
    isGetCustomerInfoLoading.value = false;
  }
};
watch(() => props.customerId, () => {
  handleGetCustomerInfo();
}, {immediate: true});

interface FormState {
  id: number,
  point_changed: number
  full_name: string
  phone: string
  email: string
  birthday: string
  note: string
  is_send_sms: boolean
  is_blocked_from_booking: boolean
}

const formModel = ref<FormState>({
  id: 0,
  point_changed: 0,
  full_name: '',
  phone: '',
  email: '',
  birthday: '',
  note: '',
  is_send_sms: false,
  is_blocked_from_booking: false
});
const formRules = ref<Record<string, Rule[]>>({
  full_name: [{required: true, message: 'Name is required'}],
});
const useForm = Form.useForm;
const {validate, validateInfos, clearValidate} = useForm(formModel, formRules);

const isSubmitLoading = ref(false);
const handleSubmit = async () => {
  try {
    isSubmitLoading.value = true;
    await validate();
    const data = {
      ...formModel.value,
      is_send_sms: formModel.value.is_send_sms ? 1 : 0,
      is_blocked_from_booking: formModel.value.is_blocked_from_booking ? 1 : 0,
    }
    await goCheckInSdk.customer.updateCustomer(data);
    handleGetCustomerInfo();
    notification.success({
      message: 'Update success',
    });
  } catch (error) {
    handleError({error});
  } finally {
    isSubmitLoading.value = false;
  }
};
</script>

<style scoped>

</style>
