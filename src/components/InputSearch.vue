<template>
  <input
    type="text"
    class="appearance-none block rounded-3xl border border-transparent w-full h-[46px] text-A4 pl-[42px] pr-4 transition bg-[url('@/assets/images/icon-search.svg')] bg-[length:20px] bg-no-repeat bg-[left_16px_center] shadow-[1px_1px_6px_rgba(0,56,117,0.25)] focus:border-primary"
    :placeholder="placeholder"
    :value="modelValue"
    @input="onInput"
  >
</template>

<script setup lang="ts">
import {useDebounce} from "@/utils/debounce";

type Props = {
  modelValue: string,
  placeholder?: string
}

const props = withDefaults(
  defineProps<Props>(),
  {
    placeholder: 'Search...'
  }
)

type Emit = {
  (e: 'update:modelValue', newValue: string): void,
  (e: 'input', newValue: string): void,
  (e: 'inputDebounce', newValue: string): void,
}

const handleInputDebounce = useDebounce((newValue: string) => {
  emit('inputDebounce', newValue);
});

const emit = defineEmits<Emit>();
const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  emit('input', value);
  handleInputDebounce(value);
}
</script>

<style scoped>

</style>
