<template>
  <a-config-provider
    :theme="{
        token: {
          colorLink: '#4C70F0',
          colorPrimary: '#4C70F0',
          colorError: '#EB5757',
          colorSuccess: '#27AE60',
          colorText: '#3A3A3A',
          colorBorder: '#D1D1D1',
          fontFamily: 'inherit',
          borderRadius: 4,
          controlHeight: 38,
        },
      }"
  >
    <a-style-provider
      hash-priority="hight"
    >
      <main v-if="isRouterReady && !isLoading">
        <component :is="layout"></component>
      </main>
      <main class="h-screen flex justify-center items-center" v-else>
        <base-loading/>
      </main>

      <modal-confirm />
      <reload-prompt />
    </a-style-provider>
  </a-config-provider>
</template>

<script setup lang="ts">
import {ref, watch, onMounted, onUnmounted, computed} from 'vue';
import {sdkInit} from '@/sdk';
import {useAuthStore} from "@/stores/auth";
import {useBusinessStore} from "@/stores/business";
import {useRoute, useRouter} from 'vue-router';
import BaseLoading from "@/components/base/BaseLoading.vue";
import ModalConfirm from "@/components/modals/ModalConfirm.vue";
import {useNotificationStore} from "@/stores/notification";
import LayoutDefault from '@/layouts/default/Index.vue';
import LayoutBlank from '@/layouts/blank/Index.vue';
import ReloadPrompt from "@/components/ReloadPrompt.vue";

const router = useRouter();
const route = useRoute();
const layout = computed(() => {
  switch (route?.meta?.layout) {
    case 'blank': {
      return LayoutBlank;
    }
    default: {
      return LayoutDefault
    }
  }
});
const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const businessStore = useBusinessStore();
const isLoading = ref(false);
const handleInit = async () => {
  try {
    isLoading.value = true;
    await sdkInit();
    await authStore.getUserInfo();
    await Promise.allSettled([
      businessStore.getBusinessSiteInfo(),
      notificationStore.getNotify(),
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

watch(
  () => authStore.reloadSdkCount,
  handleInit,
  {
    immediate: true
  }
);

const isRouterReady = ref(false);
const customViewportCorrectionVariable = 'vh';
const setViewportProperty = () => {
  let prevClientHeight: number;
  const customVar = '--' + (customViewportCorrectionVariable || 'vh');
  const doc = document.documentElement;

  function handleResize() {
    let clientHeight = doc.clientHeight;
    if (clientHeight === prevClientHeight) return;
    requestAnimationFrame(function updateViewportHeight() {
      doc.style.setProperty(customVar, (clientHeight * 0.01) + 'px');
      prevClientHeight = clientHeight;
    });
  }

  handleResize();
  return handleResize;
};

onMounted(async () => {
  await router.isReady();
  isRouterReady.value = true;
  window.addEventListener('resize', setViewportProperty());
});
onUnmounted(() => {
  window.removeEventListener('resize', setViewportProperty());
});
</script>

<style lang="scss" scoped>

</style>
