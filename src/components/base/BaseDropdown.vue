<template>
  <a-dropdown
    :trigger="['click']"
    :disabled="disabled || loading"
  >
    <slot name="button">
      <a-button
        type="primary"
        ghost
        class="!justify-between"
        :loading="loading"
      >
        <slot v-if="currentSelectedOption" :label="currentSelectedOption?.label">
          {{ currentSelectedOption?.label }}
        </slot>
        <template v-else-if="placeholder">
          {{ placeholder }}
        </template>
        <down-outlined/>
      </a-button>
    </slot>
    <template #overlay>
      <a-menu
        :selected-keys="selectedKeys"
        @click="handleClick"
        class="!min-w-[200px]"
      >
        <a-menu-item v-for="option in options" :key="option?.value">
          {{ option?.label }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {DownOutlined} from "@ant-design/icons-vue";
import type {Options} from '@/types';

type Props = {
  modelValue: any;
  options: Options | Readonly<Options>;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(
  defineProps<Props>(),
  {
    disabled: false,
    loading: false,
  });

type Emit = {
  (e: 'update:modelValue', newValue: string): void;
  (e: 'change', newValue: string): void;
}
const emit = defineEmits<Emit>();
const currentSelectedOption = computed(() => (props.options || [])
  .map(item => 'children' in item ? item.children : item)
  .flat()
  .find(option => option?.value === props?.modelValue));

const selectedKeys = computed(() => [currentSelectedOption.value?.value]);
const handleClick = (item: any) => {
  emit('update:modelValue', item.key);
  emit('change', item.key);
};
</script>

<style scoped>

</style>
