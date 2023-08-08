<template>
  <div class="flex md:items-center gap-3 md:gap-x-7">
    <p
      contenteditable
      class="grow box min-h-[46px] rounded-base mb-0 outline-none border border-transparent focus:border-primary transition"
      @input="handleInputChange"
    >
      {{ defaultContent }}
    </p>
    <transition name="slide-fade">
      <a-button
        v-if="isShowAddButton"
        type="primary"
        class="shrink-0 !min-w-fit !w-[34px] !h-[34px] !p-1 !rounded"
        @click="item?.id ? handleUpdate() : handleCreate()"
        :loading="isUpdateLoading || isCreateLoading"
        :disabled="!content?.length"
      >
        <check-outlined/>
      </a-button>
    </transition>
    <a-button
      type="primary"
      danger
      class="shrink-0 !min-w-fit !w-[34px] !h-[34px] !p-1 !rounded"
      @click="handleDelete"
      :loading="isDeleteLoading"
    >
      <delete-outlined/>
    </a-button>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";
import {useRootStore} from "@/stores/root";
import {notification} from "ant-design-vue";
import {CheckOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import type {GetCheckinReviewListResponse, GetGoogleReviewListResponse} from "gap-nodejs-sdk";

type Item = NonNullable<GetGoogleReviewListResponse[keyof GetGoogleReviewListResponse | keyof GetCheckinReviewListResponse]>['content'][number];

type Props = {
  item?: Item;
  type: 'good' | 'bad';
  system: 'gocheckin' | 'google';
}
const props = defineProps<Props>();

type Emits = {
  (e: 'refresh'): void
}

const emit = defineEmits<Emits>();
const rootStore = useRootStore();

const isShowAddButton = ref(false);
const content = ref('');
const defaultContent = computed(() => props.item?.content || '');
const handleInputChange = (e: Event) => {
  content.value = (e.target as HTMLParagraphElement)?.textContent || '';
  isShowAddButton.value = content.value !== defaultContent.value;
};

const FUNCTION_NAME = {
  gocheckin: {
    'create': 'createCheckinReviewContent',
    'update': 'updateCheckinReviewContent',
    'delete': 'deleteCheckinReviewContent',
  },
  google: {
    'create': 'createGoogleReviewContent',
    'update': 'updateGoogleReviewContent',
    'delete': 'deleteGoogleReviewContent',
  }
};

type FunctionName = keyof typeof FUNCTION_NAME;

const isCreateLoading = ref(false);
const handleCreate = async () => {
  try {
    isCreateLoading.value = true;
    await goCheckInSdk.review[FUNCTION_NAME[props.system as FunctionName]['create']]({
      system: props.system,
      type: props.type,
      content: content.value
    });
    notification.success({
      message: 'Create success'
    });
    emit('refresh');
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isCreateLoading.value = false;
  }
};

const isUpdateLoading = ref(false);
const handleUpdate = async () => {
  try {
    isUpdateLoading.value = true;
    await goCheckInSdk.review[FUNCTION_NAME[props.system as FunctionName]['update']]({
      id: props.item?.id!,
      system: props.system,
      type: props.type,
      content: content.value,
    });
    notification.success({
      message: 'Update success'
    });
    isShowAddButton.value = false;
    emit('refresh');
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isUpdateLoading.value = false;
  }
};

const isDeleteLoading = ref(false);
const handleDelete = async () => {
  try {
    if (!props.item?.id) {
      return emit('refresh');
    }
    await rootStore.confirm({
      headerTitle: 'Delete review',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this review?',
    });
    isDeleteLoading.value = true;
    await goCheckInSdk.review[FUNCTION_NAME[props.system as FunctionName]['delete']]({
      id: props.item?.id,
    });
    notification.success({
      message: 'Delete success'
    });
    emit('refresh');
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isDeleteLoading.value = false;
  }
};
</script>

<style scoped>

</style>
