<template>
  <div class="shadow rounded-base bg-white text-black md:p-0 md:shadow-none md:rounded-none">
    <div
      class="md:min-h-[60px] xl:min-h-[66px] md:py-2 border-b md:flex md:items-center md:justify-between md:space-x-3 child:p-3 child:md:p-0">
      <p class="heading-4 mb-0 border-b md:border-b-0">Service</p>
      <div class="flex items-start gap-2 sm:gap-3">
        <base-dropdown v-model="detailFilterSelected" :options="detailFilterList" class="grow md:grow-0"/>
        <a-button type="primary" class="self-stretch" @click="handleOpenCreateService">
          <plus-circle-outlined/>
          Add Service
        </a-button>
      </div>
    </div>
    <div class="p-3 md:p-0">
      <div
        class="font-medium hidden md:grid grid-cols-[1fr_6fr_3fr_3fr_4fr_4fr_1fr] items-center text-center px-2 py-3 gap-3">
        <div></div>
        <div v-for="item in serviceListHeader" :key="item.name">{{ item.name }}</div>
      </div>
      <a-skeleton
        :paragraph="{rows: 10}"
        active
        :loading="isGetListServiceLoading"
        :title="false"
      >
        <draggable
          v-if="listService?.length"
          :class="{'c-loading': isSortLoading}"
          v-model="listService"
          @end="handleSort"
          handle=".drag-button"
          item-key="id"
          class="space-y-3"
        >
          <transition-group name="list">
            <div
              v-for="service in listService"
              :key="service?.id!"
            >
              <!-- FOR DESKTOP -->
              <div
                class="shadow-sm bg-white text-black hidden md:grid cursor-pointer grid-cols-[1fr_6fr_3fr_3fr_4fr_4fr_1fr] px-2 py-3 gap-3 items-center text-center rounded"
                @click="handleOpenUpdateService(service)"
              >
                <div>
                  <img class="inline-block cursor-pointer drag-button" src="@/assets/images/icon-drag.svg" alt="">
                </div>
                <div>{{ service?.name }}</div>
                <div>{{ service?.price ? currencyFormat(service?.price!) : 'N/A' }}</div>
                <div>{{ service?.duration || 'N/A' }}</div>
                <div>
                  <a-checkbox :checked="service?.show_on_checkin === 1"/>
                </div>
                <div>
                  <a-checkbox :checked="service?.show_on_pos === 1"/>
                </div>
                <div class="flex justify-center gap-3">
                  <delete-outlined
                    @click.stop="handleRemoveService(service)"
                    class="cursor-pointer text-lg !text-C82"
                  />
                </div>
              </div>
              <!-- FOR MOBILE -->
              <div
                class="shadow rounded-base bg-white text-black divide-y md:hidden"
                @click="handleOpenUpdateService(service)"
              >
                <div class="p-4 rounded-t-base">
                  <img class="drag-button" src="@/assets/images/icon-drag.svg" alt="">
                </div>
                <div class="p-4 space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">SERVICE NAME</div>
                    <div>{{ service?.name }}</div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">PRICE</div>
                    <div>{{ service?.price ? currencyFormat(service?.price!) : 'N/A' }}</div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">DURATION</div>
                    <div>{{ service?.duration || 'N/A' }}</div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">SHOWN ON GO CHECKIN</div>
                    <div>
                      <a-checkbox :checked="service?.show_on_checkin === 1"/>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">SHOWN ON POS</div>
                    <div>
                      <a-checkbox :checked="service?.show_on_pos === 1"/>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">ACTION</div>
                    <div class="flex gap-3">
                      <delete-outlined
                        @click.stop="handleRemoveService(service)"
                        class="cursor-pointer text-lg !text-C82"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </draggable>
        <a-empty v-else class="!mt-4"/>
      </a-skeleton>
    </div>
  </div>
  <create-service ref="createServiceRef" @get-list-service="handleGetListService"/>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {notification} from "ant-design-vue";
import CreateService from "./CreateService.vue";
import {useServiceStore} from "@/stores/service";
import type {GetCheckInListServiceResponse} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import {VueDraggableNext as draggable} from 'vue-draggable-next';
import {currencyFormat} from "@/utils/formatter";
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import {DeleteOutlined, PlusCircleOutlined} from "@ant-design/icons-vue";
import {useRootStore} from "@/stores/root";

const rootStore = useRootStore();
const serviceStore = useServiceStore();
const {getListService, deleteService, sortService} = serviceStore;

interface Props {
  categoryId: number,
  categoryName: string,
  categoryColor: string,
}

const props = defineProps<Props>();

const detailFilterList = ref([
  {
    label: 'All',
    value: null
  },
  {
    label: 'Active',
    value: '1',
  },
  {
    label: 'Inactive',
    value: '0'
  }
]);
const detailFilterSelected = ref(detailFilterList.value[1].value);

const listService = ref<GetCheckInListServiceResponse | null>(null);
const isGetListServiceLoading = ref(false);
const handleGetListService = async () => {
  try {
    isGetListServiceLoading.value = true;
    await getListService({
      category_id: props.categoryId,
      status: detailFilterSelected.value as any
    });
    listService.value = serviceStore.listService;
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListServiceLoading.value = false;
  }
};
const createServiceRef = ref<InstanceType<typeof CreateService> | null>(null);
const handleOpenCreateService = () => {
  createServiceRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName,
    category_color: props.categoryColor,
  });
}
const handleOpenUpdateService = (data: any) => {
  createServiceRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName,
    category_color: props.categoryColor,
    ...data,
  });
}
const handleRemoveService = async (item: any) => {
  try {
    await rootStore.confirm({
      bodyImage: 'delete-staff.svg',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this item?'
    })
    await deleteService({
      id: item.id,
      category_id: item.category_id,
      statusFilter: item.statusFilter
    });
    notification.success({
      message: 'Delete service success',
    });
    await handleGetListService();
  } catch (error) {
    if (!error) return;
    handleError({
      error: error
    })
  }
}
const isSortLoading = ref(false);
const handleSort = async () => {
  isSortLoading.value = true;
  try {
    await sortService({
      services: (listService?.value || []).map((item: any) => item?.id).toString(),
      cate_id: props.categoryId,
    })
    notification.success({
      message: 'Sort service success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSortLoading.value = false;
  }
}
const serviceListHeader = ref([
  {
    name: 'Service name',
  },
  {
    name: 'Price'
  },
  {
    name: 'Duration'
  },
  {
    name: 'Shown on Go Checkin',
  },
  {
    name: 'Shown on POS'
  },
  {
    name: 'Action'
  },
]);
watch([() => props.categoryId, detailFilterSelected], handleGetListService, {immediate: true});
</script>

<style lang="scss" scoped>
</style>
