<template>
  <section>
    <base-tab-nav
      v-model="currentTab"
      :list="listTab"
      class="mb-4 xl:mb-7"
    />
    <div v-if="customerId">
      <customer-info :customer-id="customerId" v-if="currentTab === 'profile'" />
      <customer-history :customer-id="customerId" v-if="currentTab === 'history'" />
      <customer-group :customer-id="customerId" v-if="currentTab === 'group'" />
    </div>
    <a-empty v-else description="No customer selected"/>
  </section>
</template>

<script setup lang="ts">
import {defineAsyncComponent, ref} from "vue";
import BaseTabNav from "@/components/base/BaseTabNav.vue";
import CustomerInfo from "./CustomerInfo.vue";

const CustomerHistory = defineAsyncComponent(() => import("./CustomerHistory.vue"));
const CustomerGroup = defineAsyncComponent(() => import("./CustomerGroup.vue"));

type Props = {
  customerId: number | null;
}
const props = defineProps<Props>();
const listTab = [
  {
    label: 'Profile',
    value: 'profile',
  },
  {
    label: 'History',
    value: 'history',
  },
  {
    label: 'Group',
    value: 'group',
  }
];
const currentTab = ref(listTab[0].value);
</script>

<style scoped>

</style>
