<template>
  <div class="card space-y-6">
    <div class="grid grid-cols-2 gap-3">
      <div>{{ data.name }}</div>
      <div class="text-primary font-semibold">{{ groupName }}</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">CUSTOMER <br>& PROMOTION</div>
      <div class="space-y-1">
        <p class="mb-0">
          <span class="text-C84 mr-2">Discount:</span>
          <span class="text-base font-semibold">
            {{ data.logic_value + (data.logic_type === 'percent' ? '%' : '$') }}
          </span>
        </p>
        <p class="flex items-center gap-2 mb-0">
          <calendar-outlined class="!text-[color:var(--color-C84)]"/>
          <span>
          {{ dayjs(data.start_date).format(DATE_FORMAT) }}
          to
          {{ dayjs(data.expired_date).format(DATE_FORMAT) }}
        </span>
        </p>
      </div>
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
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">DATE SENT</div>
      <div class="space-y-2">
        <p class="flex items-center gap-2 mb-0">
          <calendar-outlined class="!text-[color:var(--color-C84)]"/>
          <span>{{ dayjs(data.sent_at || data.created_at).format(DATE_FORMAT) }}</span>
        </p>
        <p class="flex items-center gap-2 mb-0">
          <clock-circle-outlined class="!text-[color:var(--color-C84)]"/>
          <span>{{ dayjs(data.sent_at || data.created_at).format(TIME_12_FORMAT) }}</span>
        </p>
      </div>
    </div>
    <a-button
      type="primary"
      block
      @click="$router.push({
        name: 'promotion-detail',
        params: {id: data.id}
      })"
    >
      See detail
    </a-button>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import type {GetCampaignPromotionListResponse} from "gap-nodejs-sdk";
import dayjs from "dayjs";
import {DATE_FORMAT, TIME_12_FORMAT} from "@/constant";
import {CalendarOutlined, ClockCircleOutlined} from "@ant-design/icons-vue";
import {currencyFormat} from "@/utils/formatter";
import type {GetCampaignPromotionGroupResponse} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";

type Props = {
  data: GetCampaignPromotionListResponse[number]
}
const props = defineProps<Props>();

const campaignPromotionGroup = ref<GetCampaignPromotionGroupResponse | null>(null);
const isGetCampaignPromotionGroup = ref(false);
const getCampaignPromotionGroup = async () => {
  try {
    isGetCampaignPromotionGroup.value = true;
    campaignPromotionGroup.value = await goCheckInSdk.campaign.getCampaignPromotionGroup();
  } catch (error) {
    handleError({error});
  } finally {
    isGetCampaignPromotionGroup.value = false;
  }
};
getCampaignPromotionGroup();
const groupIdsToName = (str: string) => {
  if (!str) return '';

  const idArr = str.split(',');
  if (!idArr || !idArr?.length || !campaignPromotionGroup.value?.length) return '';

  return [...campaignPromotionGroup.value]
    .filter((group: any) => group && idArr.includes(`${group.id}`))
    .map((group: any) => group.name)
    .join(', ');
};
const groupName = computed(() => groupIdsToName(props?.data?.groups!));
</script>

<style lang="scss">
</style>
