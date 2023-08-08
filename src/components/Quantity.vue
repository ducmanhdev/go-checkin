<template>
  <div class="grid grid-cols-[auto_1fr_auto] w-full">
    <button
      type="button"
      class="shadow rounded w-9 h-9 flex justify-center items-center bg-white text-black font-medium text-lg hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-70"
      @click="handleDecrement"
      :disabled="counter <= min"
    >
      -
    </button>
    <input
      type="text"
      v-model="counter"
      class="w-full bg-transparent font-semibold text-center text-lg px-2"
      :max="max"
      v-input-number
    >
    <button
      type="button"
      class="shadow rounded w-9 h-9 flex justify-center items-center bg-white text-black font-medium text-lg hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-70"
      @click="handleIncrement"
      :disabled="Boolean(max && counter >= max)"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
import {computed, watch} from "vue";

const emit = defineEmits(['update:modelValue']);

interface Props {
  modelValue?: number | '',
  placeholder?: string,
  min?: number,
  max?: number,
}

const props = withDefaults(
  defineProps<Props>(),
  {
    modelValue: 0,
    placeholder: 'Search...',
    min: 1,
  }
)

watch(() => props.max, (newMaxValue) => {
  if (newMaxValue && counter.value > newMaxValue) {
    counter.value = newMaxValue;
  }
})

const counter = computed({
  get() {
    return Number(props.modelValue || 0);
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  }
});

const handleIncrement = () => {
  counter.value = Number(counter.value) + 1;
}
const handleDecrement = () => {
  counter.value = Number(counter.value) - 1;
}
</script>

<style scoped>

</style>
