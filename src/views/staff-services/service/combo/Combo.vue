<template>
  <div class="shadow rounded-base bg-white text-black md:p-0 md:shadow-none md:rounded-none">
    <div
      class="md:min-h-[60px] xl:min-h-[66px] md:py-2 border-b md:flex md:items-center md:justify-between md:space-x-3 child:p-3 child:md:p-0">
      <p class="heading-4 mb-0 border-b md:border-b-0">Combo</p>
      <div class="flex items-start gap-2 sm:gap-3">
        <base-dropdown v-model="detailFilterSelected" :options="detailFilterList" class="grow md:grow-0"/>
        <a-button type="primary" class="self-stretch" @click="handleOpenCreateCombo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_90_9799)">
              <path
                d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 6V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round"/>
              <path d="M6 9H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_90_9799">
                <rect width="18" height="18" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          Add Combo
        </a-button>
      </div>
    </div>
    <div class="p-3 md:p-0">
      <div class="font-medium hidden md:grid grid-cols-[1fr_6fr_3fr_3fr_4fr] items-center text-center px-2 py-3 gap-3">
        <div></div>
        <div v-for="item in comboListHeader" :key="item.name">{{ item.name }}</div>
      </div>
      <a-skeleton
        :paragraph="{rows: 10}"
        active
        :loading="isGetListComboLoading"
        :title="false"
      >
        <draggable
          v-if="listCombo?.length"
          :class="{'c-loading': isSortLoading}"
          v-model="listCombo"
          @end="handleSort"
          handle=".drag-button"
          item-key="id"
          class="space-y-3"
        >
          <transition-group name="list">
            <div
              v-for="combo in listCombo"
              :key="combo?.id!"
            >
              <!-- FOR DESKTOP -->
              <div class="shadow-sm bg-white text-black hidden md:block">
                <div
                  class="cursor-pointer grid grid-cols-[1fr_6fr_3fr_3fr_4fr] px-2 py-3 gap-3 items-center text-center rounded"
                  @click="combo.isShowDetail = !combo.isShowDetail"
                >
                  <div>
                    <img class="inline-block cursor-pointer drag-button" src="@/assets/images/icon-drag.svg" alt="">
                  </div>
                  <div>{{ combo?.name }}</div>
                  <div>{{ combo?.price ? currencyFormat(combo.price) : 'N/A' }}</div>
                  <div>
                    <a-checkbox :checked="combo?.status === 1"/>
                  </div>
                  <div class="flex justify-center gap-3">
                    <edit-outlined
                      @click.stop="handleOpenUpdateCombo(combo)"
                      class="cursor-pointer text-lg !text-C82"
                    />
                    <delete-outlined
                      @click.stop="handleDeleteCombo(combo)"
                      class="cursor-pointer text-lg !text-C82"
                    />
                  </div>
                </div>
                <Transition name="slide-fade">
                  <div v-if="combo?.isShowDetail" class="border-t">
                    <div
                      class="grid grid-cols-[1fr_6fr_3fr_3fr_4fr] px-2 py-2.5 gap-3 items-center text-center"
                      v-for="item in combo.combo_item"
                      :key="item.id!"
                    >
                      <div></div>
                      <div>{{ item.item_detail?.name }}</div>
                      <div>{{ item.item_detail?.price ? currencyFormat(item.item_detail?.price!) : 'N/A' }}</div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- FOR MOBILE -->
              <div class="shadow rounded-base bg-white text-black divide-y md:hidden">
                <div class="p-4 rounded-t-base">
                  <img class="drag-button" src="@/assets/images/icon-drag.svg" alt="">
                </div>
                <div
                  class="p-4 space-y-3"
                  @click="combo.isShowDetail = !combo.isShowDetail"
                >
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">COMBO NAME</div>
                    <div>{{ combo.name }}</div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">PRICE</div>
                    <div>{{ combo?.price ? currencyFormat(combo.price) : 'N/A' }}</div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">ACTIVE</div>
                    <div>
                      <a-checkbox :checked="combo?.status === 1"/>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">ACTION</div>
                    <div>
                      <div class="flex gap-3">
                        <edit-outlined
                          @click.stop="handleOpenUpdateCombo(combo)"
                          class="cursor-pointer text-lg !text-C82"
                        />
                        <delete-outlined
                          @click.stop="handleDeleteCombo(combo)"
                          class="cursor-pointer text-lg !text-C82"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Transition name="slide-fade">
                  <div v-if="combo.isShowDetail" class="p-4 rounded-b-base space-y-3">
                    <div class="grid grid-cols-2 gap-3 mb-3">
                      <div class="text-C84 font-semibold">NAME</div>
                      <div class="text-C84 font-semibold">PRICE</div>
                    </div>
                    <div
                      class="grid grid-cols-2 gap-3 mb-3 last:mb-0"
                      v-for="item in combo.combo_item"
                      :key="item.id!"
                    >
                      <div>{{ item?.item_detail?.name }}</div>
                      <div>{{ `$${item?.item_detail?.price || 0}` }}</div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </transition-group>
        </draggable>
        <a-empty v-else class="!mt-4"/>
      </a-skeleton>
    </div>
  </div>
  <create-combo
    ref="createComboRef"
    :category-name="categoryName"
    :category-id="categoryId"
    @get-list-combo="handleGetComboSiteList"
    :key="comboComponentKey"
  />
</template>

<script setup lang="ts">
import {nextTick, ref, watch} from "vue";
import {notification} from "ant-design-vue";
import CreateCombo from "./CreateCombo.vue";
import {useServiceStore} from "@/stores/service";
import {useRootStore} from "@/stores/root";
import handleError from "@/utils/error";
import {VueDraggableNext as draggable} from 'vue-draggable-next';
import {currencyFormat} from "@/utils/formatter";
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import {
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons-vue";
import type {GetComboSiteListResponse} from "gap-nodejs-sdk";

const rootStore = useRootStore();
const serviceStore = useServiceStore();
const {getComboSiteList, deleteCombo, sortCombo} = serviceStore;

interface Props {
  categoryId: number,
  categoryName: string,
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

const listCombo = ref<Array<GetComboSiteListResponse & { isShowDetail: boolean }> | null>(null);
const isGetListComboLoading = ref(false);
const handleGetComboSiteList = async () => {
  try {
    isGetListComboLoading.value = true;
    await getComboSiteList({
      category_id: props.categoryId,
      status: detailFilterSelected.value as any
    });
    listCombo.value = (serviceStore?.listCombo?.data || []).map((item: any) => ({
      ...item,
      isShowDetail: false,
    }));
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListComboLoading.value = false;
  }
};
const createComboRef = ref<InstanceType<typeof CreateCombo> | null>(null);
const comboComponentKey = ref(1);
const handleOpenCreateCombo = async () => {
  comboComponentKey.value += 1;
  await nextTick();
  createComboRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName
  });
}
const handleOpenUpdateCombo = async (data: any) => {
  comboComponentKey.value += 1;
  await nextTick();
  createComboRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName,
    ...data,
  });
}
const handleDeleteCombo = async (item: any) => {
  try {
    await rootStore.confirm({
      headerTitle: 'Delete combo',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this item?'
    })
    await deleteCombo({
      id: item.id,
      status: 'delete'
    });
    notification.success({
      message: 'Delete combo success',
    });
    await handleGetComboSiteList();
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
    await sortCombo({
      items: (listCombo.value || []).map(item => item?.id).toString() || '',
    });
    notification.success({
      message: 'Sort combo success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSortLoading.value = false;
  }
};
const comboListHeader = ref([
  {
    name: 'Combo name',
  },
  {
    name: 'Price'
  },
  {
    name: 'Active'
  },
  {
    name: 'Action'
  },
]);

watch([() => props.categoryId, detailFilterSelected], handleGetComboSiteList, {immediate: true});
</script>

<style lang="scss" scoped>

</style>
