<template>
  <div
    class="space-y-7"
    :class="{
      'c-loading': isGetDataLoading
    }"
  >
    <a-empty v-if="!data || !Object.keys(data)?.length"/>
    <group-message
      v-else
      v-for="(value, key) in data"
      :key="key"
      system="gocheckin"
      :type="key"
      :data="value!"
      @refresh="handleGetData"
    />
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import handleError from "@/utils/error";
import {goCheckInSdk} from "@/sdk";
import type {GetCheckinReviewListResponse} from "gap-nodejs-sdk";
import GroupMessage from "./GroupMessage.vue";

const data = ref<GetCheckinReviewListResponse | null>(null);
const isGetDataLoading = ref(false);
const handleGetData = async () => {
  try {
    isGetDataLoading.value = true;
    data.value = await goCheckInSdk.review.getCheckinReviewList();
  } catch (error) {
    handleError({error});
  } finally {
    isGetDataLoading.value = false;
  }
}
handleGetData();
</script>
