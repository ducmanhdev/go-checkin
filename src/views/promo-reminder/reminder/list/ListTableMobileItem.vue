<template>
  <div class="card space-y-6" @click="handleClick">
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">STATUS</div>
      <div>
        <check-outlined class="text-lg !text-primary" v-if="data.is_active === 1"/>
        <close-circle-outlined class="text-lg !text-error" v-if="data.is_active === 0"/>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">REMINDER <br>& DISCOUNT</div>
      <div class="space-y-1">
        <p class="text-primary font-semibold mb-0">Everyone</p>
        <p class="mb-0">{{ data.name }}</p>
        <p class="mb-0">
          <span class="text-C84 mr-2">Discount:</span>
          <span class="text-base font-semibold">
            {{ data.logic_value + (data.logic_type === 'percent' ? '%' : '$') }}
          </span>
        </p>
        <p class="inline-flex items-center gap-2 mb-0">
          <calendar-outlined/>
          <span>No visit after {{ data?.remind_campaign?.after_date }} days</span>
        </p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">EXPIRED DAY IN</div>
      <div>{{ data.expired_day_in }} days</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">DELIVERED <br>& REDEEM</div>
      <div class="space-y-2">
        <div>
          <p class="text-C84 mb-0">Total Delivered</p>
          <p class="font-medium mb-0">{{ data?.campaign_report?.total_receive_message }}</p>
        </div>
        <div>
          <p class="text-C84 mb-0">Redemption</p>
          <p class="font-medium mb-0">{{ data?.campaign_report?.total_redemption }}</p>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">INCOME <br>& EXPENSE</div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <p class="text-C84 mb-0">Income</p>
          <p class="font-medium mb-0">{{ currencyFormat(data?.campaign_report?.total_income!) }}</p>
        </div>
        <div>
          <p class="text-C84 mb-0">Expense</p>
          <p class="font-medium mb-0">{{ currencyFormat(data?.campaign_report?.total_expense!) }}</p>
        </div>
      </div>
    </div>
    <a-button
      type="primary"
      block
      @click.stop="$router.push({
        name: 'reminder-detail',
        params: {id: data.id}
      })"
    >
      See detail
    </a-button>
  </div>
</template>

<script setup lang="ts">
import type {GetCampaignReminderListResponse} from "gap-nodejs-sdk";
import {CalendarOutlined, CheckOutlined, CloseCircleOutlined} from "@ant-design/icons-vue";
import {currencyFormat} from "@/utils/formatter";

type Props = {
  data: GetCampaignReminderListResponse[number]
}
const props = defineProps<Props>();

type Emit = {
  (e: 'edit', data: GetCampaignReminderListResponse[number]): void
}
const emit = defineEmits<Emit>();
const handleClick = () => {
  emit('edit', props.data);
}
</script>

<style lang="scss">
</style>
