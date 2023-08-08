<template>
  <a-drawer
    v-model:open="isVisible"
    :title="title"
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
        name="content"
        v-bind="validateInfos.content"
        label="Reward name"
      >
        <a-input v-model:value="formModel.content"/>
      </a-form-item>
      <a-form-item
        name="logic_value"
        v-bind="validateInfos.logic_value"
        label="What is the value of offer?"
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
        name="point"
        v-bind="validateInfos.point"
        label="Point"
      >
        <a-input v-model:value="formModel.point"/>
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
import {computed, ref} from "vue";
import type {Rule} from 'ant-design-vue/es/form';
import Quantity from "@/components/Quantity.vue";
import {Form, notification} from 'ant-design-vue';
import handleError from "@/utils/error";
import type {GetListRewardResponse} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";

type Emits = {
  (e: 'refresh'): void
}
const emit = defineEmits<Emits>();

const isVisible = ref(false);
const isEdit = computed(() => !!formModel.value.id);
const title = computed(() => isEdit.value ? 'Update Reward' : 'Create Reward');

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

const useForm = Form.useForm;
type FormState = {
  id: number | undefined,
  content: string,
  logic_value: number,
  logic_type: string,
  point: number,
  is_active: number,
}

const formModel = ref<FormState>({
  id: undefined,
  content: '',
  logic_value: 0,
  logic_type: 'percent',
  point: 0,
  is_active: 1,
});

const formRules = ref<Record<string, Rule[]>>({
  content: [{required: true, message: 'Name is required'}],
  point: [{required: true, message: 'Point is required'}],
});
const {resetFields, validate, validateInfos, clearValidate} = useForm(formModel, formRules);


const isSubmitLoading = ref(false);
const handleSubmit = async () => {
  try {
    isSubmitLoading.value = true;
    await validate();
    if (isEdit.value) {
      await goCheckInSdk.reward.updateReward({
        ...formModel.value
      });
      notification.success({
        message: 'Update success',
      });
    } else {
      await goCheckInSdk.reward.createReward({
        ...formModel.value
      });
      notification.success({
        message: 'Create success',
      });
    }
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
const show = (data?: GetListRewardResponse[number]) => {
  if (data && !(data instanceof PointerEvent)) {
    formModel.value.id = data.id!;
    formModel.value.content = data.content!;
    formModel.value.logic_value = +data.logic_value!;
    formModel.value.logic_type = data.logic_type!;
    formModel.value.point = data.point!;
    formModel.value.is_active = data.is_active!;
    clearValidate();
  }
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
