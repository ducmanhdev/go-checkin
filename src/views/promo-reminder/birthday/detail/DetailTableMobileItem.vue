<template>
  <div class="card space-y-1">
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">#</div>
      <div>: {{ index }}</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">Name</div>
      <div>: {{ data?.customer?.full_name }}</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">Phone</div>
      <div>: {{ data?.customer?.phone }}</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">Visit</div>
      <div>: {{ data?.customer?.visit_count }}</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">Income</div>
      <div>: {{ 0 }}</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">Created at</div>
      <div>: {{ dayjs(data?.created_at).format(DATE_FORMAT) }}</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">Used total</div>
      <div>: {{ data?.total_used }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {GetCampaignPromotionHistoryResponse} from "gap-nodejs-sdk";
import dayjs from "dayjs";
import {DATE_FORMAT} from "@/constant";

type Props = {
  data: GetCampaignPromotionHistoryResponse[number],
  index: string | number
}
const props = defineProps<Props>();
</script>

<style lang="scss">
</style>
