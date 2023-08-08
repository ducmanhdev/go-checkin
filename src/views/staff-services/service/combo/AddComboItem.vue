<template>
  <a-modal
    v-model:open="isVisible"
    title="Choose item:"
    :width="900"
    centered
  >
    <base-loading v-if="isGetListByCategoryLoading"></base-loading>
    <div v-else-if="listByCategory && listByCategory.length">
      <div class="mb-4 last:mb-0" v-for="item in listByCategory" :key="item.id">
        <a-checkbox v-if="item.services" class="!flex items-center !p-2 bg-CF2 !text-lg font-semibold"
                    :checked="item.services.every((sv: any) => sv.isSelected)"
                    @change="toggleItemServices(item.id)">
          {{ item.name }}
        </a-checkbox>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <a-button
            type="primary"
            :ghost="!service.isSelected"
            v-for="service in item.services"
            :key="service.id"
            @click="service.isSelected = !service.isSelected"
            class="!h-auto !whitespace-normal leading-normal"
          >
            {{ service.name }}
          </a-button>
        </div>
      </div>
    </div>
    <a-empty v-else></a-empty>
    <template #footer>
      <div class="grid grid-cols-2 gap-3 child:!ml-0 child:!min-w-0">
        <a-button type="primary" @click="handleConfirm">Confirm</a-button>
        <a-button danger @click.prevent="hide">Cancel</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useServiceStore} from "@/stores/service";
import BaseLoading from "@/components/base/BaseLoading.vue";
import handleError from "@/utils/error";

const emits = defineEmits<{
  (e: 'confirm', items: any): void
}>();

interface Props {
  comboItemSelected?: number[],
}

const props = withDefaults(defineProps<Props>(), {
  comboItemSelected: [] as any
});
const serviceStore = useServiceStore();
const listByCategory = ref<any[]>([]);
const {getListByCategory} = serviceStore;
const isGetListByCategoryLoading = ref(false);
const handleGetListByCategory = async () => {
  try {
    isGetListByCategoryLoading.value = true;
    await getListByCategory();
    listByCategory.value = serviceStore.listByCategory.data
      .filter((item: any) => item.services?.length)
      .map((item: any) => ({
        ...item,
        services: item.services.map((sv: any) => ({
          ...sv,
          isSelected: false,
        })),
      }))
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListByCategoryLoading.value = false
  }
}

const isVisible = ref(false);
const show = async (comboIdSelected: number[]) => {
  await handleGetListByCategory();
  listByCategory.value = listByCategory.value.map((item: any) => ({
    ...item,
    services: item.services.map((sv: any) => ({
      ...sv,
      isSelected: comboIdSelected.includes(sv.id),
    })),
  }))
  isVisible.value = true;
};
const hide = () => {
  isVisible.value = false;
};

const toggleItemServices = (id: number) => {
  const index = listByCategory.value.findIndex(item => item.id === id);
  listByCategory.value[index].services = listByCategory.value[index].services.map((item: any) => ({
    ...item,
    isSelected: !item.isSelected
  }))
}

const handleConfirm = () => {
  const items = listByCategory.value
    .filter(item => item.services.some((sv: any) => sv.isSelected))
    .map(item => item.services
      .filter((sv: any) => sv.isSelected)
      .map((sv: any) => ({
        ...sv,
        type: item.type,
      }))
    ).flat();
  emits('confirm', [...items]);
  hide();
}
defineExpose({
  show,
  hide
});
</script>

<style lang="scss">
</style>
