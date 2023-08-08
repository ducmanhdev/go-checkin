<template>
  <section>
    <div class="mb-3 flex items-center justify-between gap-3">
      <h2 class="heading-1 mb-0">Reminder</h2>
      <div class="flex gap-4">
        <input-search class="!w-[400px] hidden md:block" v-model="search"/>
      </div>
    </div>
    <input-search v-model="search" class="md:hidden mt-3"/>
    <div class="mt-4">
      <list-table :search="search" />
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref} from "vue";
import InputSearch from "@/components/InputSearch.vue";
import ListTable from './ListTable.vue';
const search = ref('');
</script>

<style lang="scss">
</style>
