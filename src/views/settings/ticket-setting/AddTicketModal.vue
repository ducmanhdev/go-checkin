<template>
  <a-modal
    v-model:open="isVisible"
    title="Create new block"
    :cancel-button-props="{
      danger: true,
      disabled: isSubmitLoading
    }"
    @cancel="hide"
    :ok-button-props="{
      loading: isSubmitLoading
    }"
    @ok="handleSubmit"
    ok-text="Add selected"
    :after-close="handleAfterClose"
    :closable="!isSubmitLoading"
    :mask-closable="!isSubmitLoading"
    :width="552"
  >
    <a-form
      layout="vertical"
    >
      <a-form-item
        label="Block Name"
        name="subject"
        v-bind="validateInfos.subject"
      >
        <a-select
          v-model:value="formModel.subject"
          :options="listBlockName"
        >
        </a-select>
      </a-form-item>
      <a-form-item
        label="Param (Optional)"
        name="content"
        v-bind="validateInfos.content"
      >
        <a-input v-model:value="formModel.content"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import type {CreatePosTicketTemplateRequest} from "gap-nodejs-sdk";
import {Form, notification} from "ant-design-vue";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";

const props = defineProps<{
  ticketListBlockName: any,
}>();

const emits = defineEmits<{
  (e: 'addTicket'): void,
}>();
const formModel = ref<CreatePosTicketTemplateRequest>({
  subject: '',
  content: '',
  type: '',
});
const formRules = ref({
  subject: [{required: true, message: 'Please input template subject!', trigger: 'change'}],
});
const useForm = Form.useForm;
const {resetFields, validate, validateInfos} = useForm(formModel, formRules);

const listBlockName = computed(() => props.ticketListBlockName.map((item: any) => ({
  label: item.name,
  value: item.subject
})));

const isSubmitLoading = ref(false);
const handleSubmit = async () => {
  try {
    isSubmitLoading.value = true;
    await validate();
    await goCheckInSdk.ticket.createCheckInTicketTemplate(formModel.value)
    emits('addTicket');
    notification.success({
      message: 'Create ticket template success',
    });
    hide();
  } catch (error) {
    handleError({error});
  } finally {
    isSubmitLoading.value = false;
  }
};
const handleAfterClose = () => {
  resetFields();
}
const isVisible = ref(false);
const show = (type?: string) => {
  formModel.value = {
    subject: '',
    content: '',
    type: type,
  }
  isVisible.value = true;
}
const hide = () => {
  isVisible.value = false;
}

defineExpose({
  show,
  hide
});
</script>

<style scoped>

</style>
