<template>
  <div class="card !p-5 space-y-5" @click="handleClick">
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">CAMPAIGN</div>
      <div>
        <p class="mb-0">{{ data.name }}</p>
        <p class="mb-0">Promotion to be received upon your First Signed In.</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">DISCOUNT</div>
      <div class="space-y-1">
        <p class="mb-0 text-lg">{{ data.logic_value }}{{ data.logic_type === 'usd' ? '$' : '%' }}</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">ACTIVE</div>
      <div>
        <check-outlined class="text-lg !text-primary" v-if="data.is_active === 1"/>
        <close-circle-outlined class="text-lg !text-error" v-if="data.is_active === 0"/>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">ACTION</div>
      <div>
        <a-button
          type="primary"
          @click.stop="handleClick"
          class="p-0 !w-9 !h-9 !min-w-0"
        >
          <form-outlined/>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {GetCampaignFirstSignUpResponse} from "gap-nodejs-sdk";
import {CheckOutlined, CloseCircleOutlined, FormOutlined} from "@ant-design/icons-vue";

type Props = {
  data: GetCampaignFirstSignUpResponse
}
const props = defineProps<Props>();

type Emit = {
  (e: 'edit', data: GetCampaignFirstSignUpResponse): void
}
const emit = defineEmits<Emit>();
const handleClick = () => {
  emit('edit', props.data);
}
</script>

<style lang="scss">
</style>
