<template>
  <a-modal
      v-model:open="isVisible"
      :footer="false"
      :width="552"
      :body-style="{padding: '1.875rem'}"
      title="Customize Employee - Owner Percentage"
      centered
  >
    <a-form
        layout="vertical"
        :model="formModel"
        :rules="formRules"
        @finish="handleSubmit"
    >
      <a-form-item label="Percent for Employee" name="forEmployee">
        <a-input-number v-model:value="formModel.forEmployee" :max="100" placeholder="" class="!w-full"/>
      </a-form-item>
      <a-form-item label="Percent for Owner" name="forOwner">
        <a-input-number :value="formModel.forOwner" placeholder="" disabled class="!w-full"/>
      </a-form-item>
      <a-form-item>
        <div class="grid grid-cols-2 gap-3 mt-2">
          <a-button danger @click.prevent="hide">Cancel</a-button>
          <a-button type="primary" html-type="submit">Accept</a-button>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

const isVisible = ref(false);
const handleResolve = ref<any>(null);
const handleReject = ref<any>(null);

interface FormModel {
  forEmployee: number,
  forOwner: number,
}

const formModel = ref<FormModel>({
  forEmployee: 0,
  forOwner: 0,
});

const formRules = ref({
  forEmployee: [
    {
      required: true,
      message: 'Please input percent for employee'
    }
  ],
});

interface ShowInterface {
  value: any,
  onResolve: any;
  onReject: any;
}

const show = ({value, onResolve, onReject}: ShowInterface) => {
  formModel.value.forEmployee = 0;
  if (!value && value !== 0) {
    formModel.value.forEmployee = value;
  }
  handleResolve.value = onResolve;
  handleReject.value = onReject;
  isVisible.value = true;
}

watch(() => formModel.value.forEmployee, (newValue: number) => {
  formModel.value.forOwner = 100 - newValue
}, {immediate: true});

const handleSubmit = async () => {
  handleResolve.value(formModel.value.forEmployee / 100);
  isVisible.value = false;
}

const hide = () => {
  handleReject.value();
  isVisible.value = false;
}

defineExpose({
  show, hide
})
</script>

<style lang="scss">
</style>
