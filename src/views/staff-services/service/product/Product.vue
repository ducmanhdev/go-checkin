<template>
  <div class="shadow rounded-base bg-white text-black md:p-0 md:shadow-none md:rounded-none">
    <div
      class="md:min-h-[60px] xl:min-h-[66px] md:py-2 border-b md:flex md:items-center md:justify-between md:space-x-3 child:p-3 child:md:p-0">
      <p class="heading-4 mb-0 border-b md:border-b-0">Product</p>
      <div class="flex items-start gap-2 sm:gap-3">
        <base-dropdown v-model="detailFilterSelected" :options="detailFilterList" class="grow md:grow-0"/>
        <a-button type="primary" class="self-stretch" @click="handleOpenCreateProduct">
          <plus-circle-outlined/>
          Add Product
        </a-button>
      </div>
    </div>
    <div class="p-3 md:p-0">
      <div class="font-medium hidden md:grid grid-cols-[1fr_6fr_3fr_3fr_4fr] items-center text-center px-2 py-3 gap-3">
        <div></div>
        <div v-for="item in productListHeader" :key="item.name">{{ item.name }}</div>
      </div>
      <a-skeleton
        :paragraph="{rows: 10}"
        active
        :loading="isGetListProductLoading"
        :title="false"
      >
        <draggable
          v-if="listProduct?.length"
          :class="{'c-loading': isSortLoading}"
          v-model="listProduct"
          @end="handleSort"
          handle=".drag-button"
          item-key="id"
          class="space-y-3"
        >
          <transition-group name="list">
            <div
              v-for="product in listProduct"
              :key="product?.id!"
            >
              <!-- FOR DESKTOP -->
              <div
                class="shadow-sm bg-white text-black hidden md:grid cursor-pointer grid-cols-[1fr_6fr_3fr_3fr_4fr] px-2 py-3 gap-3 items-center text-center rounded"
                @click="handleOpenUpdateProduct(product)"
              >
                <div>
                  <img class="inline-block cursor-pointer drag-button" src="@/assets/images/icon-drag.svg" alt="">
                </div>
                <div>{{ product?.name }}</div>
                <div>{{ currencyFormat(product?.price!) || 'N/A' }}</div>
                <div>
                  <a-checkbox :checked="product?.status === 1"></a-checkbox>
                </div>
                <div class="flex justify-center gap-3">
                  <delete-outlined
                    @click.stop="handleRemoveProduct(product)"
                    class="cursor-pointer text-lg !text-C82"
                  />
                </div>
              </div>
              <!-- FOR MOBILE -->
              <div
                class="shadow rounded-base bg-white text-black divide-y md:hidden"
                @click="handleOpenUpdateProduct(product)"
              >
                <div class="p-4 rounded-t-base">
                  <img class="drag-button" src="@/assets/images/icon-drag.svg" alt="">
                </div>
                <div class="p-4 space-y-3">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">COMBO NAME</div>
                    <div>{{ product?.name }}</div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">PRICE</div>
                    <div>{{ product?.price ? currencyFormat(product?.price!) : 'N/A' }}</div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">ACTIVE</div>
                    <div>
                      <a-checkbox :checked="product?.status === 1"></a-checkbox>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="text-C84 font-semibold">ACTION</div>
                    <div>
                      <div class="flex gap-3">
                        <delete-outlined
                          @click.stop="handleRemoveProduct(product)"
                          class="cursor-pointer text-lg !text-C82"
                        />
                      </div>
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
  <create-product
    ref="createProductRef"
    :category-name="categoryName"
    :category-id="categoryId"
    @get-list-product="handleGetListProduct"
  />
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {notification} from "ant-design-vue";
import CreateProduct from "./CreateProduct.vue";
import {useRootStore} from "@/stores/root";
import {useServiceStore} from "@/stores/service";
import type {GetPosListProductResponse} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import {VueDraggableNext as draggable} from 'vue-draggable-next';
import {currencyFormat} from "@/utils/formatter";
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import {DeleteOutlined, PlusCircleOutlined} from "@ant-design/icons-vue";

const rootStore = useRootStore();
const serviceStore = useServiceStore();
const {getListProduct, deleteProduct, sortProduct} = serviceStore;

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

const listProduct = ref<GetPosListProductResponse>([]);
const isGetListProductLoading = ref(false);
const handleGetListProduct = async () => {
  try {
    isGetListProductLoading.value = true;
    listProduct.value = [];
    await getListProduct({
      category_id: props.categoryId,
      status: detailFilterSelected.value as any
    });
    listProduct.value = serviceStore.listProduct;
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListProductLoading.value = false;
  }
};
const createProductRef = ref<InstanceType<typeof CreateProduct> | null>(null);
const handleOpenCreateProduct = () => {
  createProductRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName
  });
}
const handleOpenUpdateProduct = (data: any) => {
  createProductRef.value?.show({
    category_id: props.categoryId,
    cate_name: props.categoryName,
    ...data,
  });
}
const handleRemoveProduct = async (item: any) => {
  try {
    await rootStore.confirm({
      headerTitle: 'Delete product',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this item?'
    })
    await deleteProduct({
      id: item.id,
      category_id: item.category_id,
      statusFilter: item.statusFilter
    });
    notification.success({
      message: 'Delete product success',
    });
    await handleGetListProduct();
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
    await sortProduct({
      items: listProduct.value.map((item: any) => item.id).join(','),
    })
    notification.success({
      message: 'Sort product success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSortLoading.value = false;
  }
}
const productListHeader = ref([
  {
    name: 'Product name',
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
watch([() => props.categoryId, detailFilterSelected], handleGetListProduct, {immediate: true});
</script>

<style lang="scss" scoped>
</style>
