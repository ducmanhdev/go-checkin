<template>
  <div>
    <div class="md:flex md:items-center md:justify-between mb-5">
      <p class="text-base font-medium mb-3 md:mb-0">{{ title }}</p>
      <a-button
        type="primary"
        v-if="isShowCreateAnswerButton"
        @click="handeShowCreateAnswer"
        class="w-full md:w-auto"
      >
        <plus-circle-outlined/>
        Add new
      </a-button>
    </div>
    <div class="space-y-4">
      <answer-item
        v-for="answer in listAnswer"
        :key="answer?.id!"
        :data="answer"
        :type="data?.type!"
        @refresh="handeRefresh"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {PlusCircleOutlined} from "@ant-design/icons-vue";
import {useRootStore} from "@/stores/root";
import AnswerItem from "./AnswerItem.vue";
import type {GetListAnswerResponse} from 'gap-nodejs-sdk';

type Props = {
  data: GetListAnswerResponse[number];
}
const props = defineProps<Props>();

type emit = {
  (e: 'refresh'): void
}
const emit = defineEmits<emit>();

const listAnswer = ref<GetListAnswerResponse[number]['answer']>([]);
watch(() => props.data.answer, (newValue) => {
  listAnswer.value = (newValue || []).filter(answer => answer?.status !== 0);
}, {
  immediate: true,
});

const TITLE = {
  store: 'Option for store and overall',
  service: 'Options for staff'
}
const title = computed(() => TITLE[props?.data?.type as keyof typeof TITLE]);

const rootStore = useRootStore();
const isShowCreateAnswerButton = ref(true);
const handeShowCreateAnswer = () => {
  isShowCreateAnswerButton.value = false;
  listAnswer.value?.push({
    content: '',
    type: props.data?.type
  } as any);
};
const handeRefresh = () => {
  isShowCreateAnswerButton.value = true;
  emit('refresh');
}
</script>
