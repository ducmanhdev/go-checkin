<template>
  <div class="card !p-5 space-y-5" @click="handleClick">
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">STATUS</div>
      <div>
        <check-outlined class="text-lg !text-primary" v-if="data.is_active === 1"/>
        <close-circle-outlined class="text-lg !text-error" v-if="data.is_active === 0"/>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">PROMOTION</div>
      <div class="space-y-1">
        <p class="text-primary font-semibold mb-0">Everyone</p>
        <p class="mb-0">{{ data.name }}</p>
        <p class="inline-flex items-center gap-2 mb-0">
          <calendar-outlined/>
          <span>Send {{ data?.birthday_campaign?.before_date }} days in advance</span>
        </p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">EXPIRED DAY IN</div>
      <div>{{ data.expired_day_in }} days</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">TOTAL DELIVERED</div>
      <div>{{ data?.campaign_report?.total_receive_message }}</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">REDEMPTION</div>
      <div>{{ data?.campaign_report?.total_redemption }}</div>
    </div>
    <a-button
      type="primary"
      block
      @click.stop="$router.push({
        name: 'birthday-detail',
        params: {id: data.id}
      })"
    >
      See detail
    </a-button>
  </div>
</template>

<script setup lang="ts">
import type {GetCampaignBirthdayListResponse} from "gap-nodejs-sdk";
import {CalendarOutlined, CheckOutlined, CloseCircleOutlined} from "@ant-design/icons-vue";

type Props = {
  data: GetCampaignBirthdayListResponse[number]
}
const props = defineProps<Props>();

type Emit = {
  (e: 'edit', data: GetCampaignBirthdayListResponse[number]): void
}
const emit = defineEmits<Emit>();
const handleClick = () => {
  emit('edit', props.data);
}
</script>

<style lang="scss">
</style>
