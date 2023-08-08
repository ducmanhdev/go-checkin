<template>
  <a-modal
    :title="modalTitle"
    ref="modalEditGroupRef"
    v-model:open="isVisible"
    :cancel-button-props="{
      danger: true,
      disabled: isSubmitLoading,
    }"
    @cancel="hide"
    :ok-button-props="{
      loading: isSubmitLoading
    }"
    @ok="handleSubmit"
    :after-close="handleAfterClose"
    :closable="!isSubmitLoading"
    :mask-closable="!isSubmitLoading"
  >
    <a-form
      autocomplete="off"
      layout="vertical"
      hide-required-mark
    >
      <a-form-item
        name="name"
        v-bind="validateInfos.name"
        label="Name"
      >
        <a-input
          v-model:value="formModel.name"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import type {Rule} from "ant-design-vue/es/form";
import {Form, notification} from 'ant-design-vue';
import type {GetListGroupResponse} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";

const isVisible = ref(false);
const isEdit = computed(() => Boolean(formModel.value.id));
const modalTitle = computed(() => isEdit.value ? 'Update group' : 'Create group');
const show = async (group?: GetListGroupResponse[number]) => {
  formModel.value.id = undefined;
  formModel.value.name = '';
  if (group?.id && group?.name) {
    formModel.value.id = group.id;
    formModel.value.name = group.name;
  }
  isVisible.value = true;
}
const hide = () => {
  isVisible.value = false;
}

type FormState = {
  id: number | undefined,
  name: string
}

const formModel = ref<FormState>({
  id: undefined,
  name: '',
});

type Emit = {
  (e: 'success'): void
}

const emit = defineEmits<Emit>();

const formRules = ref<Record<string, Rule[]>>({
  name: [{required: true, message: 'Name is required'}],
});

const useForm = Form.useForm;
const {resetFields, validate, validateInfos} = useForm(formModel, formRules);

const isSubmitLoading = ref(false);
const handleSubmit = async () => {
  try {
    isSubmitLoading.value = true;
    await validate();
    if (isEdit.value) {
      await goCheckInSdk.group.updateGroup({
        id: formModel?.value.id,
        name: formModel?.value.name,
      });
      notification.success({
        message: 'Update group success',
      });
    } else {
      await goCheckInSdk.group.createGroup({
        name: formModel?.value.name,
      });
      notification.success({
        message: 'Add group success',
      });
    }
    emit('success');
    hide();
  } catch (error) {
    handleError({error})
  } finally {
    isSubmitLoading.value = false;
  }
}
const handleAfterClose = () => {
  resetFields();
}
defineExpose({
  show,
  hide
})
</script>

<style scoped>

</style>
