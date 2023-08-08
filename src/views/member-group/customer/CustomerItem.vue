<template>
  <div
    class="cursor-pointer flex gap-3 rounded-base border-2 border-transparent shadow bg-white text-black py-3 px-4 min-h-[80px] [&.active]:border-CD9">
    <div
      class="shrink-0 w-9 h-9 rounded-full flex justify-center items-center p-1 bg-C9 text-white text-base font-semibold uppercase">
      <template v-if="name">
        {{ name?.charAt(0) }}
      </template>
      <user-outlined v-else/>
    </div>
    <div class="grow xl:flex gap-3">
      <div class="grow">
        <p class="font-semibold mb-0.5 line-clamp-2 break-all">{{ name || 'N/A' }}</p>
        <p class="flex items-center gap-1 mb-0">
          <phone-outlined class="text-lg" :rotate="90"/>
          {{ usePhoneFormat(phone) }}
        </p>
      </div>
      <div
        class="shrink-0 text-right flex xl:flex-col items-center xl:items-end justify-between xl:justify-end gap-1 mt-2 xl:mt-0">
        <tag :type="type" class="mb-0">{{ type }}</tag>
        <p class="mb-0">{{ point }}pts</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {PhoneOutlined, UserOutlined} from "@ant-design/icons-vue";
import {usePhoneFormat} from "@/utils/formatter";
import Tag from '@/components/Tag.vue';

type Props = {
  avatar?: string,
  name?: string,
  phone: string,
  type: string,
  point: number,
}
const props = defineProps<Props>();
</script>
