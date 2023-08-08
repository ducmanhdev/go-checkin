<template>
  <ul class="flex gap-2">
    <li
      v-for="item in list"
      :key="item.value" @click="handleChangeTab(item)"
      class="group rounded-base p-2 text-center text-lg flex-1 cursor-pointer flex items-center justify-center min-h-[46px]"
      :class="{
        'bg-primary-lighter text-primary font-medium': tabActive !== item.value,
        'bg-primary text-white font-semibold': tabActive === item.value,
      }"
    >
      <img
        v-if="item.icon"
        :src="getImageUrl(item.icon)"
        alt=""
        class="block shrink-0 mr-2 group-[.bg-primary]:brightness-0 group-[.bg-primary]:invert"
      >
      <span>{{ item.label }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {getImageUrl} from "@/utils/url";
import {computed} from "vue";

interface Tab {
  label: string,
  icon?: any,
  value: any,
}

interface Props {
  list: Tab[],
  modelValue: any,
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void,
  (e: 'change', value: string): void,
}>();
const tabActive = computed({
  get() {
    return props.modelValue;
  },
  set(newKey) {
    emits('update:modelValue', newKey)
  }
});
const handleChangeTab = (item: any) => {
  tabActive.value = item.value;
  emits('change', item.value);
}
</script>

<style lang="scss" scoped>
</style>
