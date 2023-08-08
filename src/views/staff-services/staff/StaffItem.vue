<template>
  <div
    class="border-l-4 cursor-pointer"
    :style="{'border-color': colorCode}"
    :class="{'bg-primary text-white': isActive}">
    <div class="flex items-center p-2 pr-4">
      <svg v-if="!hideDragIcon" :class="[isActive ? 'text-white' : 'text-C92']" class="drag-button mr-2" width="20"
           height="20"
           viewBox="0 0 20 20" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.18182 7.27273H11.8182V4.54545H14.5455L10 0L5.45455 4.54545H8.18182V7.27273ZM7.27273 8.18182H4.54545V5.45455L0 10L4.54545 14.5455V11.8182H7.27273V8.18182ZM20 10L15.4545 5.45455V8.18182H12.7273V11.8182H15.4545V14.5455L20 10ZM11.8182 12.7273H8.18182V15.4545H5.45455L10 20L14.5455 15.4545H11.8182V12.7273Z"
          fill="currentColor"/>
      </svg>
      <div class="flex items-center mr-auto">
        <div
          :style="{'background-color': colorCode, 'color': '#FFF'}"
          class="w-[34px] h-[34px] rounded-full overflow-hidden mr-2 shrink-0 text-tiny font-semibold text-[#D96425] flex justify-center items-center"
          :class="{'p-1': !imageUrl}"
        >
          <img :src="imageUrl" alt="" v-if="imageUrl" class="w-full h-full object-cover">
          <template v-else>
            {{ shortName }}
          </template>
        </div>
        <span>{{ name }}</span>
      </div>
      <check-outlined v-if="status === 1" :class="[isActive ? '!text-white' : '!text-primary']"/>
      <close-outlined v-if="status === 0" class="!text-error"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons-vue";
interface Props {
  name: string | undefined,
  colorCode: string | undefined,
  imageUrl: string | null | undefined,
  status: number | undefined,
  isActive: boolean,
  hideDragIcon?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  hideDragIcon: false,
});
const shortName = computed(() => (props?.name || '').split(' ').map(item => item.charAt(0).toUpperCase()).join('').slice(0, 3))
</script>

<style scoped>

</style>
