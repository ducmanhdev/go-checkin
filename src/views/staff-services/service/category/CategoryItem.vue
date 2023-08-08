<template>
  <div
    class="border rounded p-2 md:py-3 md:px-3.5 flex justify-between items-center space-x-2 sm:space-x-3 cursor-pointer"
    :class="[isActive ? 'bg-primary text-white' : 'bg-white text-black']"
    :style="{'--icon-color': isActive ? 'currentColor' : 'var(--color-C90)'}"
  >
    <div class="flex items-center space-x-2">
      <svg :class="{'opacity-0 pointer-event-none': !isShowDragButton}" class="shrink-0 drag-button" width="20" height="20"
           viewBox="0 0 20 20"
           fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.18182 7.27273H11.8182V4.54545H14.5455L10 0L5.45455 4.54545H8.18182V7.27273ZM7.27273 8.18182H4.54545V5.45455L0 10L4.54545 14.5455V11.8182H7.27273V8.18182ZM20 10L15.4545 5.45455V8.18182H12.7273V11.8182H15.4545V14.5455L20 10ZM11.8182 12.7273H8.18182V15.4545H5.45455L10 20L14.5455 15.4545H11.8182V12.7273Z"
          fill="var(--icon-color)"/>
      </svg>
      <div :style="{'background-color': item?.color_detail?.color_code || '#2DC069'}"
           class="w-[14px] h-[14px] rounded-[2px] shrink-0"></div>
      <span>{{ item?.name }}</span>
    </div>
    <div class="grid grid-cols-[18px_18px] gap-2 sm:gap-3 items-center shrink-0 child:cursor-pointer">
      <edit-outlined @click.stop="handleUpdate" v-if="isShowEditButton" class="cursor-pointer text-lg !text-[var(--icon-color)]"/>
      <delete-outlined @click.stop="handleDelete" v-if="isShowDeleteButton" class="cursor-pointer text-lg !text-[var(--icon-color)]"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import type {GetCheckInListCategoryResponse} from "gap-nodejs-sdk";

interface Props {
  item: GetCheckInListCategoryResponse[number]
  isActive: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false
});
const isShowDeleteButton = computed(() => props.item?.type === 'service');
const isShowEditButton = computed(() => props.item?.name !== 'Other')
const isShowDragButton = computed(() => props.item?.name !== 'Other');
const emits = defineEmits(['update', 'delete']);
const handleUpdate = () => emits('update');
const handleDelete = () => emits('delete');
</script>

<style scoped>

</style>
