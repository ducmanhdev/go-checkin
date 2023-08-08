<template>
  <section class="min-h-full flex flex-col">
    <div class="mb-4 md:flex md:items-center md:justify-between gap-3 shrink-0">
      <h2 class="heading-1 mb-0 flex items-center md:block">
        <img
          class="w-6 h-auto mr-1 md:hidden"
          @click="$router.push({name: 'promotion'})"
          src="@/assets/images/icon-back.svg"
          alt=""
        >
        Promotion Detail
      </h2>
      <div class="flex gap-3 md:gap-4 mt-4 md:mt-0">
        <input-search
          class="md:!w-[400px]"
          v-model="search"
          placeholder="Search name, phone ..."
        />
        <a-button
          danger
          ghost
          @click="$router.push({name: 'promotion'})"
          class="max-md:!min-w-[84px]"
        >
          Close
        </a-button>
      </div>
    </div>
    <div class="space-y-4 md:space-y-0 md:grid md:grid-cols-[320px_1fr] md:gap-5 grow">
      <div
        class="shadow bg-white text-black rounded-base p-5 divide-y child:p-4 first:child:pt-0 first:child:px-0 last:child:pb-0">
        <base-loading-skeleton v-if="isGetDataLoading"/>
        <a-empty v-else-if="!data"/>
        <template v-else>
          <div>
            <p class="font-semibold text-primary mb-2">
              {{ groupName }}
            </p>
            <p class="mb-0">
              {{ data.name }}
            </p>
            <p> {{ data.business_name + ': ' }} {{ data.promotion_campaign?.content }} </p>
          </div>
          <div>
            <p class="text-lg font-semibold mb-2">DISCOUNT</p>
            <p class="text-2xl font-semibold">
              {{ data.logic_value || 'N/A' }}{{ data.logic_type === 'percent' ? '%' : '$' }}
            </p>
            <div class="flex items-center mt-2">
              <calendar-outlined class="!text-[color:var(--color-C84)] mr-2"/>
              {{ dayjs(data.start_date).format(DATE_FORMAT) }}
              to
              {{ dayjs(data.start_date).format(DATE_FORMAT) }}
            </div>
          </div>
          <div>
            <p class="font-medium mb-1">TOTAL DELIVERED</p>
            <p class="text-2xl font-semibold">{{ data.campaign_report?.total_receive_message }}</p>
            <div class="grid grid-cols-2 text-C84 mt-2">
              <div class="flex items-center">
                <mobile-outlined class="!text-[color:var(--color-C84)] mr-2"/>
                SMS: {{ data.campaign_report?.total_sms_sent }}
              </div>
              <div class="flex items-center">
                <mail-outlined class="!text-[color:var(--color-C84)] mr-2"/>
                Email: {{ data.campaign_report?.total_email_sent }}
              </div>
            </div>
          </div>
          <div>
            <p class="font-medium mb-1">REDEMPTION</p>
            <p class="text-2xl font-semibold">{{ data?.campaign_report?.total_redemption }}</p>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <p class="font-medium mb-1">INCOME</p>
              <p class="text-2xl font-semibold">{{ currencyFormat(Number(data?.campaign_report?.total_income)) }}</p>
            </div>
            <div>
              <p class="font-medium mb-1">EXPENSE</p>
              <p class="text-2xl font-semibold">{{ currencyFormat(Number(data?.campaign_report?.total_expense)) }}</p>
            </div>
          </div>
        </template>
      </div>
      <detail-table :search="search"/>
    </div>
  </section>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import InputSearch from "@/components/InputSearch.vue";
import {MobileOutlined, CalendarOutlined, MailOutlined} from "@ant-design/icons-vue";
import handleError from "@/utils/error";
import {useRoute} from 'vue-router';
import type {
  GetCampaignPromotionDetailResponse,
} from "gap-nodejs-sdk";
import dayjs from "dayjs";
import {DATE_FORMAT} from "@/constant";
import {currencyFormat} from "@/utils/formatter";
import DetailTable from "./DetailTable.vue";
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import {goCheckInSdk} from "@/sdk";
import type {GetCampaignPromotionGroupResponse} from "gap-nodejs-sdk";

const route = useRoute();

const search = ref('');

const data = ref<GetCampaignPromotionDetailResponse | null>(null);
const isGetDataLoading = ref(false);
const handleGetData = async () => {
  try {
    isGetDataLoading.value = true;
    data.value = await goCheckInSdk.campaign.getCampaignPromotionDetail({
      id: Number(route.params.id),
    });
  } catch (error) {
    handleError({error});
  } finally {
    isGetDataLoading.value = false;
  }
};
handleGetData();

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
const groupName = computed(() => groupIdsToName(data.value?.groups!));
</script>

<style scoped>

</style>
