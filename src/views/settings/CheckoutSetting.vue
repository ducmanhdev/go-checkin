<template>
  <section class="">
    <h2 class="heading-1 mb-4 xl:mb-7">Checkout Setting</h2>
    <a-form
      layout="vertical"
      hide-required-mark
      :model="formModel"
      :rules="formRules"
      @finish="handleUpdateCheckOutConfig"
      class="child:!mb-0 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <a-form-item
        name="type"
        label="Checkout Type"
        class="!block"
        :class="{'sm:col-span-2': formModel.type === 'manual'}"
      >
        <a-select
          v-model:value="formModel.type"
          :disabled="isLoading"
          :options="checkOutTypeOptions"
        />
      </a-form-item>
      <a-form-item
        class="!block"
        name="point_bonus"
        label="Point Bonus"
        v-if="formModel.type !== 'manual'"
      >
        <a-input
          v-model:value="formModel.point_bonus"
          :disabled="isLoading"
        ></a-input>
      </a-form-item>
      <a-form-item class="text-center sm:col-span-2 ">
        <a-button
          type="primary"
          html-type="submit"
          :disabled="isLoading"
          class="w-full sm:w-auto"
        >
          Save
        </a-button>
      </a-form-item>
    </a-form>
  </section>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {notification} from "ant-design-vue";
import type {UpdateCheckOutConfigRequest} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import {goCheckInSdk} from "@/sdk";

const checkOutTypeOptions = ref([
  {
    label: 'Manual Checkout',
    value: 'manual',
  },
  {
    label: 'Auto Checkout',
    value: 'auto',
  },
  {
    label: 'Hybrid Checkout',
    value: 'hybrid',
  }
]);

const formModel = ref<UpdateCheckOutConfigRequest>({
  point_bonus: 0,
  type: 'manual'
});

const formRules = ref({
  point_bonus: [
    {
      required: true,
      message: 'Please enter point bonus!'
    }
  ],
  type: [
    {
      required: true,
      message: 'Please select type!'
    }
  ]
});

const isLoading = ref(false);

const handleGetCheckOutConfig = async () => {
  try {
    isLoading.value = true;
    formModel.value = await goCheckInSdk.settings.getCheckOutConfig();
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isLoading.value = false;
  }
};
handleGetCheckOutConfig();

const handleUpdateCheckOutConfig = async () => {
  try {
    isLoading.value = true;
    await goCheckInSdk.settings.updateCheckOutConfig(formModel.value);
    notification.success({
      message: 'Update checkout config success',
    });
  } catch (error) {
    handleError({
      error
    })
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
</style>
