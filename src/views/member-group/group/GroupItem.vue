<template>
  <div
    class="group text-base cursor-pointer flex items-center justify-between gap-3 rounded-base shadow border-2 border-transparent bg-white text-black py-3 px-4 min-h-[60px] [&.active]:bg-C128 [&.active]:text-white [&.active]:border-transparent">
    <p class="mb-0 ">{{ name }}</p>
    <div class="flex items-center gap-3 text-C82 shrink-0 group-[.active]:text-inherit">
      <span @click.stop="handleEdit"><edit-outlined/></span>
      <span @click.stop="handleDelete"><delete-outlined/></span>
      <span><setting-outlined /></span>
    </div>
  </div>
</template>
<script setup lang="ts">
import {EditOutlined, DeleteOutlined, SettingOutlined} from "@ant-design/icons-vue";

const props = defineProps<{
  name: string,
}>();
const emit = defineEmits<{
  (e: 'edit'): void;
  (e: 'delete'): void;
}>()

const handleEdit = () => {
  emit('edit');
}
const handleDelete = () => {
  emit('delete');
}
</script>
