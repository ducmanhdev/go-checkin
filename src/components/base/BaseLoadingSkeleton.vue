<template>
  <div class="space-y-4">
    <a-skeleton active v-for="item in quantity" :key="item"/>
  </div>
</template>

<script setup lang="ts">
type Props = {
  quantity?: number;
}
const props = withDefaults(
  defineProps<Props>(),
  {
    quantity: 3
  }
)
</script>

<style lang="scss" scoped>
</style>
