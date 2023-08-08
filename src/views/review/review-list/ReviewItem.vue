<template>
  <div class="card md:flex gap-5 xl:gap-x-7 space-y-7 md:space-y-0">
    <div class="flex gap-7 flex-1">
      <a-avatar :size="60" class="!text-[32px] font-bold !bg-primary-lighter !text-primary shrink-0" :src="data?.avatar">
        {{ data?.customer?.full_name?.slice(0, 1).toUpperCase() }}
      </a-avatar>
      <div>
        <p class="flex items-center gap-x-3">
          <span class="text-base font-semibold">{{ data?.customer?.full_name || 'N/A' }}</span>
          <img
            class="block w-7 aspect-square object-contain"
            :src="getImageUrl(REVIEW_FROM_LIST[data?.type as keyof typeof REVIEW_FROM_LIST]?.icon)"
            alt=""
          >
        </p>
        <tag v-if="data?.customer?.type" :type="data?.customer?.type!" class="mb-4">{{ data?.customer?.type }}</tag>
        <div class="space-y-1 ms:space-y-2">
          <p class="grid grid-cols-[16px_1fr] items-center gap-x-3">
            <img src="@/assets/images/icon-phone.svg" alt="">
            <span>{{ data?.customer?.phone || 'N/A' }}</span>
          </p>
          <p class="grid grid-cols-[16px_1fr] items-center gap-x-3 break-all">
            <img src="@/assets/images/icon-mail.svg" alt="">
            <span>{{ data?.customer?.email || 'N/A' }}</span>
          </p>
          <p class="grid grid-cols-[16px_1fr] items-center gap-x-3">
            <img src="@/assets/images/icon-calendar-1.svg" alt="">
            <span>Last visit: {{ useDateFormat(data?.customer?.last_visited!) }} | Visit {{
                data?.customer?.visit_count
              }} times</span>
          </p>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <p class="flex items-center gap-x-2">
        <img
          class="block w-7 aspect-square object-contain"
          :src="getImageUrl(REVIEW_FROM_LIST[data?.type as keyof typeof REVIEW_FROM_LIST]?.icon)"
          alt=""
        >
        <span class="font-medium">{{ REVIEW_FROM_LIST[data?.type as keyof typeof REVIEW_FROM_LIST]?.title }}</span>
      </p>
      <p class="flex items-center gap-x-2">
        <img :src="getImageUrl(ratingObj?.img!)" alt="">
        <span>{{ ratingObj?.label }} | {{ useDateFormat(data?.time_create) }}</span>
      </p>
      <p>
        <a-rate :value="data?.rating || 0" disabled class="!text-sm"></a-rate>
      </p>
      <p class="italic">{{ data?.content || 'No content' }}</p>
      <div class="flex items-start gap-x-2 mb-4" v-if="data?.type === LIST_REVIEW_TYPE.GOOGLE_GMB && data?.review_reply_comment">
        <div class="flex items-center">
          <message-outlined class="text-lg shrink-0 mr-2"/>
          <p class="grow m-0">
            <span class="text-C84 font-medium">Response from the owner: </span>
            <span>{{ JSON.stringify(data?.review_reply_comment) }}</span>
          </p>
        </div>
        <!--        <div class="text-primary text-lg flex items-center space-x-2">-->
        <!--          <edit-outlined class="cursor-pointer" @click="handleReply"/>-->
        <!--          <delete-outlined class="cursor-pointer" @click="handleDelete"/>-->
        <!--        </div>-->
      </div>
      <a-button
        v-if="data?.type === LIST_REVIEW_TYPE.GOCHECKIN"
        type="primary"
        class="secondary mt-auto"
        size="small"
        @click="handleReply"
      >
        Reply
      </a-button>
    </div>
    <a-button
      type="primary"
      @click="handleViewCustomerInfo"
      class="shrink-0"
      v-if="data?.type === 'gocheckin'"
    >
      View detail
    </a-button>
  </div>
</template>

<script setup lang="ts">
import {getImageUrl} from "@/utils/url";
import handleError from "@/utils/error";
import {useRootStore} from "@/stores/root";
import {EditOutlined, DeleteOutlined, MessageOutlined} from "@ant-design/icons-vue";
import type {GetListReviewResponse} from "gap-nodejs-sdk";
import Tag from '@/components/Tag.vue';
import {useDateFormat} from "@/utils/date";
import {LIST_REVIEW_TYPE, RATING_REPORT_SKELETON} from '@/constant';
import {computed} from "vue";

const rootStore = useRootStore();

interface Props {
  data: GetListReviewResponse[number];
}

const props = defineProps<Props>();

type Emit = {
  (e: 'edit', reviewId: number): void;
  (e: 'reply', reviewId: GetListReviewResponse[number]): void;
  (e: 'viewCustomerInfo', reviewId: number): void;
}
const emit = defineEmits<Emit>();

const ratingObj = computed(() => Object.values(RATING_REPORT_SKELETON).find(item => item.rate === props.data?.rating))

const handleReply = () => {
  emit('reply', props.data)
};
const handleViewCustomerInfo = () => {
  emit('viewCustomerInfo', props.data?.customer?.id!)
};
const handleDelete = async () => {
  try {
    await rootStore.confirm({
      headerTitle: 'Delete your google reply',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete it?'
    });
  } catch (error) {
    if (!error) return;
    handleError({
      error: error
    })
  }
};
const REVIEW_FROM_LIST = {
  [LIST_REVIEW_TYPE.GOOGLE_GMB]: {
    title: 'Google',
    icon: 'icon-google.svg',
  },
  [LIST_REVIEW_TYPE.GOOGLE]: {
    title: 'Google',
    icon: 'icon-google.svg',
  },
  [LIST_REVIEW_TYPE.GOCHECKIN]: {
    title: 'Go Checkin review',
    icon: 'icon-logo.svg',
  }
} as const;
</script>

<style scoped>

</style>
