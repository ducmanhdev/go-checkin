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
        @click="data?.id ? handleUpdate() : handleCreate()"
        :loading="isUpdateLoading || isCreateLoading"
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
d
<script setup lang="ts">
import {computed, ref} from 'vue';
import {posSdk} from "@/sdk";
import handleError from "@/utils/error";
import {useRootStore} from "@/stores/root";
import {notification} from "ant-design-vue";
import {CheckOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import type {GetListAnswerResponse} from "gap-nodejs-sdk";

type Props = {
  data?: NonNullable<GetListAnswerResponse[number]["answer"]>[number];
  type?: string;
}

const props = defineProps<Props>();

type Emits = {
  (e: 'refresh'): void
}

const emit = defineEmits<Emits>();
const rootStore = useRootStore();

const isShowAddButton = ref(false);
const content = ref('');
const defaultContent = computed(() => props?.data?.content || '');
const handleInputChange = (e: Event) => {
  content.value = (e.target as HTMLParagraphElement)?.textContent || '';
  isShowAddButton.value = content.value !== defaultContent.value
};

const isCreateLoading = ref(false);
const handleCreate = async () => {
  try {
    isCreateLoading.value = true;
    await posSdk.setting.createAnswer({
      type: props?.type || props?.data?.type,
      system: 'rating',
      content: content.value,
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
    await posSdk.setting.updateAnswer({
      id: props?.data?.id,
      type: props?.type || props?.data?.type,
      system: 'rating',
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
    if (!props.data?.id) {
      return emit('refresh');
    }
    await rootStore.confirm({
      headerTitle: 'Delete Answer',
      bodyTitle: 'Do you want to delete this answer?',
    });
    isDeleteLoading.value = true;
    await posSdk.setting.changeAnswerStatus({
      id: props.data?.id,
      status: 0
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
