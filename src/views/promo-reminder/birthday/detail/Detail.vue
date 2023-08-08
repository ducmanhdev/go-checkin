<template>
  <section class="min-h-full flex flex-col">
    <div class="mb-4 md:flex md:items-center md:justify-between gap-3 shrink-0">
      <h2 class="heading-1 mb-0 flex items-center md:block">
        <img
          class="w-6 h-auto mr-1 md:hidden"
          @click="$router.push({name: 'birthday'})"
          src="@/assets/images/icon-back.svg"
          alt=""
        >
        Remind Offer Detail
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
          @click="$router.push({name: 'birthday'})"
          class="max-md:!min-w-[84px]"
        >
          Close
        </a-button>
      </div>
    </div>
    <div class="space-y-4 md:space-y-0 md:grid md:grid-cols-[320px_1fr] md:gap-5 grow">
      <div
        class="h-full shadow bg-white text-black rounded-base p-5 divide-y child:p-4 first:child:pt-0 first:child:px-0 last:child:pb-0"
      >
        <base-loading-skeleton v-if="isGetDataLoading"/>
        <a-empty v-else-if="!data"/>
        <template v-else>
          <div>
            <p class="font-semibold text-primary mb-2">Everyone</p>
            <p class="flex gap-2">
              {{ data.name }}
              <a-tooltip placement="right">
                <template #title>
                  {{ data?.birthday_campaign?.content }}
                </template>
                <info-circle-outlined class="mt-1 !text-primary shrink-0"/>
              </a-tooltip>
            </p>
          </div>
          <div>
            <p class="text-lg font-semibold mb-2">DISCOUNT</p>
            <p class="text-2xl font-semibold">
              {{ data.logic_value || 'N/A' }}{{ data.logic_type === 'percent' ? '%' : '$' }}
            </p>
            <div class="inline-flex items-center mt-2">
              <calendar-outlined class="!text-[color:var(--color-C84)] mr-2"/>
              <span>Send {{ data?.birthday_campaign?.before_date }} days in advance</span>
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
            <p class="text-2xl font-semibold">{{ data.campaign_report?.total_redemption }}</p>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <p class="font-medium mb-1">INCOME</p>
              <p class="text-2xl font-semibold">{{ currencyFormat(Number(data.campaign_report?.total_income)) }}</p>
            </div>
            <div>
              <p class="font-medium mb-1">EXPENSE</p>
              <p class="text-2xl font-semibold">{{ currencyFormat(Number(data.campaign_report?.total_expense)) }}</p>
            </div>
          </div>
        </template>
      </div>
      <detail-table :search="search"/>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import InputSearch from "@/components/InputSearch.vue";
import {MobileOutlined, CalendarOutlined, MailOutlined, InfoCircleOutlined} from "@ant-design/icons-vue";
import handleError from "@/utils/error";
import {useRoute} from 'vue-router';
import type {
  GetCampaignBirthdayDetailResponse,
} from "gap-nodejs-sdk";
import {currencyFormat} from "@/utils/formatter";
import {useRootStore} from "@/stores/root";
import DetailTable from "./DetailTable.vue";
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import {goCheckInSdk} from "@/sdk";

const rootStore = useRootStore();
const route = useRoute();

const search = ref('');

const data = ref<GetCampaignBirthdayDetailResponse | null>(null);
const isGetDataLoading = ref(false);
const handleGetData = async () => {
  try {
    isGetDataLoading.value = true;
    data.value = await goCheckInSdk.campaign.getCampaignBirthdayDetail({
      id: Number(route.params.id),
    });
  } catch (error) {
    handleError({error});
  } finally {
    isGetDataLoading.value = false;
  }
};
handleGetData();
</script>

<style scoped>

</style>
