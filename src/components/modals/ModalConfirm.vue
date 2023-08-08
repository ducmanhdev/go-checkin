<template>
  <a-modal
    v-model:open="isVisible"
    :width="552"
    class="logout-modal"
    :title="confirmPayload?.headerTitle"
    :cancel-button-props="{
        danger: true,
      }"
    @cancel="handleCancel"
    @ok="handleOk"
    centered>
    <div class="text-center">
      <img :src="getImageUrl(confirmPayload?.bodyImage || 'delete-staff.svg')" alt="" class="w-[186px] mx-auto mb-3">
      <p class="text-xl font-semibold mb-1">{{ confirmPayload?.bodyTitle || 'Oh no!' }}</p>
      <p class="mb-0">{{ confirmPayload?.bodyMessage }}</p>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {ref, computed, watch} from "vue";
import {getImageUrl} from "@/utils/url";
import {useRootStore} from "@/stores/root";

const rootStore = useRootStore();

const confirmPayload = computed(() => rootStore.confirmPayload);
const isVisible = ref(false);
watch(confirmPayload, (newValue) => {
  isVisible.value = Boolean(newValue && Object.keys(newValue).length > 0);
}, {
  deep: true,
})
const handleOk = () => {
  confirmPayload.value?.resolve('ok');
  rootStore.resetConfirm();
}
const handleCancel = () => {
  confirmPayload.value!.reject();
  rootStore.resetConfirm();
}
const hide = () => {
  confirmPayload.value!.reject();
  rootStore.resetConfirm();
}
defineExpose({
  hide
});
</script>

<style lang="scss">
</style>
