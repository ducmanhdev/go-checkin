<template>
  <a-modal
    v-model:open="isVisible"
    :title="title"
    :footer="false"
    centered
    :width="800"
    :closable="!isSendMessageLoading"
    :mask-closable="!isSendMessageLoading"
  >
    <div class="h-full flex flex-col">
      <div class="mb-6 bg-primary-lighter text-black p-4 rounded overflow-auto grow">
        <ul class="space-y-4" v-if="isGetSystemMessageLoading">
          <li
            v-for="index in 3"
            :key="index"
            class="flex"
            :class="{ 'justify-end text-right': index % 2 === 0 }"
          >
            <div class="w-3/4">
              <a-skeleton
                active
                :title="false"
                :paragraph="{
                  rows: 3,
                  width: ['20%', '100%']
                }"
              />
            </div>
          </li>
        </ul>
        <a-empty v-else-if="!systemMessage?.length"/>
        <ul class="space-y-4" v-else>
          <li
            v-for="message in systemMessage"
            :key="message?.id!"
            class="flex"
            :class="{ 'justify-end text-right': message?.is_sent === 1 }"
          >
            <a-skeleton active :loading="false">
              <div class="w-3/4">
                <p class="text-xs">{{ useDateFormat(message?.sent_at) }}</p>
                <p class="rounded-base bg-primary text-white shadow p-2 mb-0">{{ message?.content }}</p>
              </div>
            </a-skeleton>
          </li>
        </ul>
      </div>
      <a-form
        autocomplete="off"
        layout="vertical"
        hide-required-mark
        :rules="formRules"
        :model="formRules"
        @finish="handleSendMessage"
        class="child:!mb-0 grid grid-cols-[1fr_auto] gap-3 shrink-0"
      >
        <a-form-item name="message">
          <a-input v-model:value="formModel.message" placeholder="Enter your message"/>
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" type="primary" size="small" class="!h-[38px]" :loading="isSendMessageLoading">
            Send
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
import {ref, computed, watch} from 'vue';
import type {GetListReviewResponse, GetSystemMessageResponse} from "gap-nodejs-sdk";
import {usePhoneFormat} from "@/utils/formatter";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";
import {useDateFormat} from "@/utils/date";

const isVisible = ref<boolean>(false);
const title = computed(() => currentReview.value?.customer?.full_name + ' - ' + usePhoneFormat(currentReview.value?.customer?.phone))

const currentReview = ref<GetListReviewResponse[number] | null>(null);
const systemMessage = ref<GetSystemMessageResponse | null>(null);
const isGetSystemMessageLoading = ref(false);
const handleGetSystemMessage = async () => {
  try {
    if (!currentReview.value?.customer?.id) return;
    isGetSystemMessageLoading.value = true;
    systemMessage.value = await goCheckInSdk.review.getSystemMessage({
      customer_id: currentReview.value?.customer?.id,
    });
  } catch (error) {
    handleError({error});
  } finally {
    isGetSystemMessageLoading.value = false;
  }
};
watch(
  () => currentReview.value?.customer?.id,
  handleGetSystemMessage,
  {
    immediate: true,
  });

const show = (review: GetListReviewResponse[number]) => {
  currentReview.value = review;
  isVisible.value = true;
};
const hide = () => {
  isVisible.value = false;
};

const formModel = ref({
  message: '',
});
const formRules = ref({
  message: [{required: true, message: 'Please input message!'}],
});

const isSendMessageLoading = ref(false);
const handleSendMessage = async () => {
  try {
    isSendMessageLoading.value = true;
    await goCheckInSdk.review.replyGoCheckin({
      customer_id: currentReview.value?.customer?.id,
      content: formModel.value.message,
    });
    handleGetSystemMessage();
  } catch (error) {
    handleError({error})
  } finally {
    isSendMessageLoading.value = false;
  }
}

defineExpose({show, hide});
</script>
<style lang="scss">
</style>
