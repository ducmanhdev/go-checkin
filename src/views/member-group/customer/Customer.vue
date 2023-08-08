<template>
  <section class="md:grid md:grid-cols-[290px_1fr] xl:grid-cols-[380px_1fr] parent-no-padding min-h-full">
    <the-aside/>
    <div class="p-4 xl:p-7 hidden md:block">
      <a-empty v-if="!$route.params.id" description="No customer selected"/>
      <router-view v-else/>
    </div>
  </section>
</template>

<script setup lang="ts">
import TheAside from './TheAside.vue';
</script>

<style scoped>

</style>
