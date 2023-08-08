<template>
  <div class="card !p-5 space-y-3" @click="handleClick">
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">STATUS</div>
      <div>
        <check-outlined class="text-lg !text-primary" v-if="data.is_active === 1"/>
        <close-circle-outlined class="text-lg !text-error" v-if="data.is_active === 0"/>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">REWARD CONTENT</div>
      <div>
        {{ data.content }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">POINT</div>
      <div class="">
        {{ data.point }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">DISCOUNT VALUE</div>
      <div class="">
        {{ data.logic_value }}{{ data.logic_type === 'usd' ? '$' : '%' }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">ACTION</div>
      <div>
        <delete-outlined class="text-lg !text-error" @click.stop="handleDelete"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {GetListRewardResponse} from "gap-nodejs-sdk";
import {CheckOutlined, CloseCircleOutlined, DeleteOutlined} from "@ant-design/icons-vue";

type Props = {
  data: GetListRewardResponse[number]
}
const props = defineProps<Props>();

type Emit = {
  (e: 'edit', data: GetListRewardResponse[number]): void;
  (e: 'delete', id: number): void;
}
const emit = defineEmits<Emit>();
const handleClick = () => {
  emit('edit', props.data);
}
const handleDelete = () => {
  emit('delete', props.data.id!);
}
</script>

<style lang="scss">
</style>
