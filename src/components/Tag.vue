<template>
  <div :class="{flat: flat}">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {BOOKING_TYPE_COLORS} from "@/constant";

type Props = {
  color?: string;
  type?: string;
  flat?: boolean,
}

const props = withDefaults(
  defineProps<Props>(),
  {
    flat: false,
  }
);
const getColor = computed(() => BOOKING_TYPE_COLORS[((props?.type) || '').toLowerCase() as keyof typeof BOOKING_TYPE_COLORS] || props.color || 'var(--color-primary)');
</script>

<style lang="scss" scoped>
div {
  $color: v-bind(getColor);
  display: inline-block;
  position: relative;
  color: $color;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: currentColor;
    opacity: 0.15;
    pointer-events: none;
    border-radius: 4px;
  }

  span {
    display: inline-block;
    padding: 4px 10px;
    font-weight: 500;
    border-radius: 4px;
    text-transform: capitalize;
  }

  &.flat {
    span {
      background-color: $color;
      color: #fff;
    }
  }
}
</style>
