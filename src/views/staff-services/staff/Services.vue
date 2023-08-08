<template>
  <base-loading v-if="isGetListServiceByStaffLoading"/>
  <div
    class="space-y-5 md:space-y-7"
    v-else-if="listByCategory?.length"
    :class="{
        'c-loading': isToggleServicesLoading
      }"
  >
    <div
      class="space-y-3 md:space-y-4"
      v-for="item in listByCategory"
      :key="item"
    >
      <a-checkbox
        v-if="item.services"
        :checked="item.services.every((sv: any) => sv.isSelected)"
        @change="toggleItemServices(item.id)"
        class="block w-full !px-3 !py-1.5 md:!p-3 rounded bg-primary-lighter text-black">
        {{ item.name }}
      </a-checkbox>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
        <a-button
          type="primary"
          size="small"
          v-for="service in item.services"
          :key="service?.id"
          @click="toggleItemService([service.id])"
          :ghost="!service.isSelected"
          class="secondary !whitespace-normal"
        >
          {{ service.name }}
        </a-button>
      </div>
    </div>
  </div>
  <a-empty v-else/>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {useStaffStore} from "@/stores/staff";
import BaseLoading from "@/components/base/BaseLoading.vue";
import handleError from "@/utils/error";

interface Props {
  staffId: number,
}

const props = defineProps<Props>()

const staffStore = useStaffStore();
const listByCategory = ref<any[]>([]);
const {getListByCategory, addListServiceByStaff, deleteListServiceByStaff, getListServiceByStaff} = staffStore;
const handleGetListByCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (listByCategory.value?.length) {
        return resolve(null);
      }
      await getListByCategory();
      listByCategory.value = staffStore.listByCategory.data
        .filter((item: any) => item.services?.length)
        .map((item: any) => ({
          ...item,
          services: item.services
            .filter((sv: any) => sv.status === 1)
            .map((sv: any) => ({
              ...sv,
              isSelected: false,
            })),
        }));
      resolve(null);
    } catch (error) {
      reject();
    }
  })
}

const isToggleServicesLoading = ref(false);
const handleAddListServices = async (idArr: number[]) => {
  try {
    isToggleServicesLoading.value = true;
    await addListServiceByStaff({
      staff_id: props.staffId,
      services: idArr.join(','),
    })
    listByCategory.value = listByCategory.value.map(item => ({
      ...item,
      services: item.services.map((sv: any) => ({
        ...sv,
        isSelected: idArr.includes(sv.id) ? true : sv.isSelected,
      })),
    }))
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isToggleServicesLoading.value = false;
  }
}
const handleDeleteListServices = async (idArr: number[]) => {
  try {
    isToggleServicesLoading.value = true;
    await deleteListServiceByStaff({
      staff_id: props.staffId,
      services: idArr.join(','),
    });
    listByCategory.value = listByCategory.value.map(item => ({
      ...item,
      services: item.services.map((sv: any) => ({
        ...sv,
        isSelected: idArr.includes(sv.id) ? false : sv.isSelected,
      })),
    }))
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isToggleServicesLoading.value = false;
  }
}
const toggleItemService = async (idArr: number[]) => {
  const serviceList = listByCategory.value.map((item: any) => item.services).flat();
  const serviceItem = serviceList.find((service: any) => service.id === idArr[0]);
  if (!serviceItem) return;
  if (serviceItem.isSelected) {
    return handleDeleteListServices(idArr)
  }
  handleAddListServices(idArr)
}
const toggleItemServices = async (id: number) => {
  const index = listByCategory.value.findIndex(item => item.id === id);
  const servicesIdArr = listByCategory.value[index].services.map((sv: any) => sv.id);
  const isAllServicesChecked = listByCategory.value[index].services.every((sv: any) => sv.isSelected);
  if (isAllServicesChecked) {
    return handleDeleteListServices(servicesIdArr);
  }
  handleAddListServices(servicesIdArr)
}

const isGetListServiceByStaffLoading = ref(false);
const handleGetListServiceByStaff = async () => {
  try {
    isGetListServiceByStaffLoading.value = true;
    await handleGetListByCategory();
    await getListServiceByStaff({id: props.staffId});
    listByCategory.value = listByCategory.value.map((item: any) => ({
      ...item,
      services: item.services.map((sv: any) => ({
        ...sv,
        isSelected: staffStore.listServiceByStaff.some((item: any) => item.service.id === sv.id),
      })),
    }));
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListServiceByStaffLoading.value = false;
  }
}
watch(() => props.staffId, handleGetListServiceByStaff, {immediate: true})
</script>

<style lang="scss" scoped>

</style>
