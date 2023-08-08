<template>
  <section class="md:grid md:grid-cols-[276px_1fr] xl:grid-cols-[332px_1fr] md:gap-3.5 xl:gap-7 min-h-full">
    <aside
      class="shadow rounded-base bg-white text-black px-3 divide-y grid grid-rows-[auto_auto_1fr] child:py-2 child:md:py-3 mb-3 md:mb-0">
      <div class="md:min-h-[60px] xl:min-h-[66px] flex justify-between items-center gap-3">
        <p class="heading-4 mb-0">Categories</p>
        <plus-square-filled
          class="cursor-pointer text-3xl !text-[color:var(--color-C128)]"
          @click="handleOpenCreateCategory"
        />
      </div>
      <div class="grid grid-cols-2 gap-3 md:gap-4">
        <a-button
          v-for="item in categoryStatusList"
          :key="item.value"
          @click="categoryStatusSelected = item.value"
          :type="categoryStatusSelected === item.value ? 'primary' : ''"
          size="small"
          class="!min-w-0 !h-[38px]"
        >
          {{ item.label }}
        </a-button>
      </div>
      <div class="">
        <div
          class="relative sm:h-full"
          :class="{'c-loading': isSortListCategoryLoading}"
        >
          <a-skeleton
            active
            :loading="isGetListCategoryLoading"
            :paragraph="{rows: 10}"
          >
            <draggable
              v-if="listCategory?.length"
              v-model="listCategory"
              @end="handleSortCategoryList"
              handle=".drag-button"
              item-key="id"
              class="space-y-2 md:space-y-3 sm:absolute sm:inset-0 sm:overflow-auto"
            >
              <transition-group name="list">
                <category-item
                  v-for="element in listCategory"
                  :key="element?.id!"
                  :item="element"
                  :is-active="categorySelected?.id === element?.id!"
                  @click="handleSelectCategory(element)"
                  @update="handleOpenUpdateCategory(element)"
                  @delete="handleDeleteCategory(element!)"
                />
              </transition-group>
            </draggable>
            <div class="text-center italic" v-else>Empty category</div>
          </a-skeleton>
        </div>
      </div>
    </aside>
    <div>
      <template v-if="categorySelected">
        <service
          v-if="categorySelected.type === 'service' || categorySelected.type === null"
          :category-id="categorySelected.id"
          :category-name="categorySelected.name"
          :category-color="categorySelected?.color_detail?.color_code"
        />
        <product
          v-if="categorySelected.type === 'product'"
          :category-id="categorySelected.id"
          :category-name="categorySelected.name"
        />
        <combo
          v-if="categorySelected.type === 'combo'"
          :category-id="categorySelected.id"
          :category-name="categorySelected.name"
        />
      </template>
      <a-empty description="No category selected" v-else/>
    </div>

    <create-category ref="createCategoryRef" @get-list-category="handleGetListCategory"/>
  </section>
</template>

<script setup lang="ts">
import {defineAsyncComponent, ref, watch} from "vue";
import CategoryItem from "./category/CategoryItem.vue";
import CreateCategory from "./category/CreateCategory.vue"
import {useServiceStore} from "@/stores/service";
import {notification} from "ant-design-vue";
import type {GetCheckInListCategoryResponse} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import {VueDraggableNext as draggable} from 'vue-draggable-next';
import {PlusSquareFilled} from "@ant-design/icons-vue";
import {useRootStore} from "@/stores/root";

const Service = defineAsyncComponent(() => import('./service/Service.vue'));
const Product = defineAsyncComponent(() => import('./product/Product.vue'));
const Combo = defineAsyncComponent(() => import('./combo/Combo.vue'));

const rootStore = useRootStore();
const serviceStore = useServiceStore();
const listCategory = ref<GetCheckInListCategoryResponse>([]);

const {
  getListCategory,
  deleteCategory,
  sortCategory
} = serviceStore;
const isGetListCategoryLoading = ref(false);
const categoryStatusList = ref([
  {
    label: 'Show',
    value: '2',
  },
  {
    label: 'Hide',
    value: '1',
  }
]);
const categoryStatusSelected = ref('2');

const categorySelected = ref<GetCheckInListCategoryResponse[number] | null>(null);
const handleSelectCategory = (category: GetCheckInListCategoryResponse[number]) => {
  categorySelected.value = category;
}
const handleGetListCategory = async () => {
  try {
    isGetListCategoryLoading.value = true;
    await getListCategory({
      status: categoryStatusSelected.value
    });
    listCategory.value = serviceStore.listCategory.filter((item: any) => item.name !== 'Customize' && item.name !== 'Gift Card');
    handleSelectCategory(listCategory.value[0]);
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListCategoryLoading.value = false;
  }
};
watch(categoryStatusSelected, handleGetListCategory, {immediate: true, deep: true});

const createCategoryRef = ref<InstanceType<typeof CreateCategory> | null>(null);
const handleOpenCreateCategory = () => {
  createCategoryRef.value?.show();
}
const handleOpenUpdateCategory = (data: GetCheckInListCategoryResponse[number]) => {
  createCategoryRef.value?.show(data);
}
const handleDeleteCategory = async (item: NonNullable<GetCheckInListCategoryResponse[number]>) => {
  try {
    await rootStore.confirm({
      headerTitle: 'Delete staff',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this category?',
    })
    await deleteCategory({
      id: item.id,
      type: item.type,
      statusFilter: item.status,
    });
    await handleGetListCategory();
    notification.success({
      message: 'Delete category success',
    });
  } catch (error) {
    if (!error) return;
    handleError({
      error: error
    })
  }
}

const isSortListCategoryLoading = ref(false);
const handleSortCategoryList = async () => {
  isSortListCategoryLoading.value = true;
  try {
    await sortCategory({
      categories: (listCategory.value || []).map(item => item?.id).toString(),
    })
    notification.success({
      message: 'Sort category success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSortListCategoryLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>

</style>
