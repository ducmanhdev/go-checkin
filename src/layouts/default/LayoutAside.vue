<template>
  <!-- FOR DESKTOP-->
  <a-layout-sider
    :width="264"
    collapsible
    v-model:collapsed="isCollapsed"
    :default-collapsed="defaultCollapsed"
    :collapsed-width="60"
    :trigger="null"
    breakpoint="xl"
    theme="light"
    class="bg-white text-black h-screen overflow-y-auto overflow-x-hidden shadow-[0_4px_4px_rgba(0,9,54,0.15)] z-[51]"
    v-if="largerThanMd"
  >
    <div class="h-[var(--header-height)] flex justify-center items-center p-2">
      <img src="@/assets/images/icon-logo.svg" alt="" class="block max-w-full max-h-full" v-if="isCollapsed">
      <img src="@/assets/images/logo.png" alt="" class="block max-w-full max-h-full" v-else>
    </div>
    <layout-menu :is-collapsed="isCollapsed"/>
  </a-layout-sider>

  <!--  FOR MOBILE-->
  <a-drawer
    v-model:open="isVisible"
    :closable="false"
    placement="left"
    :width="264"
    class="shadow-[0_4px_4px_rgba(0,9,54,0.15)] z-[51]"
    :body-style="{
      padding: 0
    }"
    v-else
  >
    <div class="h-[var(--header-height)] flex justify-center items-center p-2">
      <img src="@/assets/images/logo.png" alt="" class="block max-w-full max-h-full">
    </div>
    <layout-menu/>
  </a-drawer>
</template>

<script setup lang="ts">
import {breakpointsTailwind, useBreakpoints} from '@vueuse/core';
import {computed, ref} from "vue";
import LayoutMenu from './LayoutMenu.vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const isCollapsed = ref(false);
const isVisible = ref(false);

const showCollapse = () => {
  isCollapsed.value = false;
  isVisible.value = true;
}
const hideCollapse = () => {
  isCollapsed.value = true;
  isVisible.value = false;
}
const toggleCollapse = () => {
  isCollapsed.value ? showCollapse() : hideCollapse();
};

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanLg = breakpoints.greater('lg');
const largerThanMd = breakpoints.greater('md');
const defaultCollapsed = computed(() => !largerThanLg.value);

router.beforeEach(() => {
  if (largerThanMd.value) return;
  if (isVisible.value) hideCollapse();
})

defineExpose({
  toggleCollapse,
})
</script>

<style lang="scss" scoped>

</style>
