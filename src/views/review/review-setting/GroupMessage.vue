<template>
  <div>
    <p class="flex items-center space-x-3 mb-7">
      <a-switch
        :checked="data?.active"
        :checked-value="1"
        :un-checked-value="0"
        :loading="isToggleMessageLoading"
        @change="handleToggleMessage"
      />
      <span> {{ title }} </span>
    </p>
    <div
      v-if="data?.active"
      class="space-y-4"
    >
      <template v-if="listContent?.length">
        <edit-field
          v-for="item in listContent"
          :key="item?.id"
          :item="item"
          :system="system"
          :type="shortType"
          @refresh="handleRefresh"
        />
      </template>
      <a-button
        v-if="listContent && listContent?.length < 10 && isShowCreateMessageButton"
        type="primary"
        @click="handeShowCreateMessage"
      >
        <plus-circle-outlined/>
        Add
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import handleError from "@/utils/error";
import {PlusCircleOutlined} from "@ant-design/icons-vue";
import EditField from "./EditField.vue";
import {goCheckInSdk} from "@/sdk";
import {notification} from "ant-design-vue";
import type {GetCheckinReviewListResponse, GetGoogleReviewListResponse} from 'gap-nodejs-sdk';

type Value = NonNullable<GetGoogleReviewListResponse[keyof GetGoogleReviewListResponse | keyof GetCheckinReviewListResponse]>;
type Props = {
  system: 'gocheckin' | 'google';
  type: keyof GetGoogleReviewListResponse | keyof GetCheckinReviewListResponse;
  data: Value;
}
const props = defineProps<Props>();

const listContent = ref<Value["content"] | null>(null);
watch(() => props.data?.content, (newValue) => {
  listContent.value = newValue;
}, {
  immediate: true,
})

type emit = {
  (e: 'refresh'): void
}
// eslint-disable-next-line no-redeclare
const emit = defineEmits<emit>();

const TITLE = {
  good_review: 'Active auto reply for good review.',
  bad_review: 'Active auto reply for bad review.',
}

const shortType = computed(() => props.type === 'good_review' ? 'good' : 'bad');
const title = computed(() => TITLE[props.type]);

const isToggleMessageLoading = ref(false);

type FunctionName = {
  [K1 in Props['system']]: {
    [K2 in Value['active']]: string;
  }
}

const FUNCTION_NAME: FunctionName = {
  gocheckin: {
    0: 'activeCheckinReview',
    1: 'inactiveCheckinReview',
  },
  google: {
    0: 'activeGoogleReview',
    1: 'inactiveGoogleReview',
  }
}

const handleToggleMessage = async () => {
  try {
    const fnName = FUNCTION_NAME[props.system][props.data.active];
    isToggleMessageLoading.value = true;
    await goCheckInSdk.review[fnName]({
      type: shortType.value
    });
    notification.success({
      message: 'Update success'
    });
    emit('refresh');
  } catch (error) {
    handleError({error})
  } finally {
    isToggleMessageLoading.value = false;
  }
};

const isShowCreateMessageButton = ref(true);
const handeShowCreateMessage = () => {
  isShowCreateMessageButton.value = false;
  listContent.value?.push({
    content: '',
  } as any)
}

const handleRefresh = () => {
  isShowCreateMessageButton.value = true;
  emit('refresh')
}
</script>
