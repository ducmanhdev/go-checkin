<template>
  <p class="heading-2 mb-5">Google reply review setting</p>
  <div class="md:flex md:items-center md:gap-4 mb-7 md:mb-10">
    <p class="mb-0 shrink-0 text-base font-medium">Reply from:</p>
    <div class="grow flex items-center gap-4 mt-3 md:mt-0">
      <a-date-picker
        v-model:value="replyFrom"
        value-format="YYYY/MM/DD"
        @change="handleShowUpdateReplyFromButton"
        :disabled="isGetReplyFromLoading || isUpdateReplyFromLoading"
        :allow-clear="false"
        class="grow"
      />
      <transition name="slide-fade">
        <a-button
          v-if="isShowUpdateReplyFromButton"
          type="primary"
          class="shrink-0 !min-w-fit !w-[34px] !h-[34px] !p-1 !rounded"
          :loading="isUpdateReplyFromLoading"
          @click="handleUpdateReplyFrom"
        >
          <check-outlined/>
        </a-button>
      </transition>
    </div>
  </div>
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
      system="google"
      :type="key"
      :data="value!"
      @refresh="handleGetData"
    />
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import handleError from "@/utils/error";
import type {GetCheckinReviewListResponse} from "gap-nodejs-sdk";
import {goCheckInSdk, settingsSdk} from "@/sdk";
import GroupMessage from "@/views/review/review-setting/GroupMessage.vue";
import {CheckOutlined} from "@ant-design/icons-vue";
import {notification} from "ant-design-vue";

const replyFrom = ref('');
const isShowUpdateReplyFromButton = ref(false);
const handleShowUpdateReplyFromButton = () => {
  isShowUpdateReplyFromButton.value = true;
};

const isGetReplyFromLoading = ref(false);
const handleGetReplyFrom = async () => {
  try {
    isGetReplyFromLoading.value = true;
    const res = await settingsSdk.keyStorage.getKeyStorage({
      key: "config.google_auto_reply.reply_from",
    });
    replyFrom.value = res.value;
  } catch (error) {
    handleError({error});
  } finally {
    isGetReplyFromLoading.value = false;
  }
};
handleGetReplyFrom();

const isUpdateReplyFromLoading = ref(false);
const handleUpdateReplyFrom = async () => {
  try {
    isUpdateReplyFromLoading.value = true;
    await settingsSdk.keyStorage.updateKeyStorage({
      key: "config.google_auto_reply.reply_from",
      value: replyFrom.value,
    });
    notification.success({
      message: 'Update success'
    });
    isShowUpdateReplyFromButton.value = false;
    handleGetReplyFrom();
  } catch (error) {
    handleError({error});
  } finally {
    isUpdateReplyFromLoading.value = false;
  }
};

const data = ref<GetCheckinReviewListResponse | null>(null);
const isGetDataLoading = ref(false);
const handleGetData = async () => {
  try {
    isGetDataLoading.value = true;
    data.value = await goCheckInSdk.review.getGoogleReviewList({});
  } catch (error) {
    handleError({error});
  } finally {
    isGetDataLoading.value = false;
  }
}
handleGetData();
</script>
