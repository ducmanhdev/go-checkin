<template>
  <section>
    <h2 class="heading-1 mb-4 xl:mb-7">Store Rating On GCI App</h2>
    <a-form
      :model="formModel"
    >
      <a-form-item>
        <div class="flex space-x-2.5">
          <a-switch
            v-model:checked="formModel.is_visible"
            :checked-value="'1'"
            :un-checked-value="'0'"
            @change="handleUpdate"
            :loading="isLoading"
            class="shrink-0"
          />
          <span>Display store rating on GCI app</span>
        </div>
      </a-form-item>
    </a-form>
  </section>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {notification} from "ant-design-vue";
import handleError from "@/utils/error";
import {goCheckInSdk} from "@/sdk";

const formModel = ref({
  is_visible: '0',
});
const isLoading = ref(false);
const handleGet = async () => {
  try {
    isLoading.value = true;
    const res = await goCheckInSdk.settings.getStoreRatingDisplay();
    formModel.value.is_visible = res.is_visible || '0';
  } catch (error) {
    handleError({
      error
    })
  } finally {
    isLoading.value = false;
  }
};
handleGet();

const handleUpdate = async (newValue: any) => {
  try {
    isLoading.value = true;
    const formData = new FormData() as any;
    formData.append('status', newValue)
    await goCheckInSdk.settings.updateStoreRatingDisplay(formData);
    notification.success({
      message: 'Update store rating display success',
    });
  } catch (error) {
    handleError({
      error
    })
  } finally {
    isLoading.value = false
  }
};
</script>

<style scoped>
</style>
