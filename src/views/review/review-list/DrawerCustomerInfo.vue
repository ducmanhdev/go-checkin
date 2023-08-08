<template>
  <a-drawer
    v-model:open="isVisible"
    title="View details"
    placement="right"
    :content-wrapper-style="{
      width: '1050px',
      maxWidth: 'calc(100% - 35px)'
    }"
  >
    <customer-info-tabs :customer-id="customerId" />
  </a-drawer>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import CustomerInfoTabs from "@/components/customer-info-tabs/CustomerInfoTabs.vue";

const isVisible = ref<boolean>(false);

const show = (newCustomerId: number) => {
  customerId.value = newCustomerId;
  isVisible.value = true;
};

const customerId = ref<number | null>(null);
defineExpose({show});
</script>
<style lang="scss">
</style>
