<template>
  <a-drawer
    v-model:open="isVisible"
    placement="right"
    :width="560"
    :title="title"
    @after-open-change="handleAfterVisibleChange"
    :mask-closable="!isSubmitLoading"
    :closable="!isSubmitLoading"
  >
    <a-form layout="vertical">
      <a-form-item label="Product name" name="name" v-bind="validateInfos.name">
        <a-input v-model:value="formModel.name"/>
      </a-form-item>
      <a-form-item label="Product description" name="description" v-bind="validateInfos.description">
        <a-textarea class="resize-none !min-h-[150px]" v-model:value="formModel.description"></a-textarea>
      </a-form-item>
      <a-form-item label="Product price" name="price" v-bind="validateInfos.price">
        <a-input v-model:value="formModel.price" :disabled="isLeaveProductPriceBlank">
          <template #prefix>$</template>
        </a-input>
        <p class="mb-0 mt-2">
          <a-checkbox v-model:checked="isLeaveProductPriceBlank">Leave blank</a-checkbox>
        </p>
      </a-form-item>
      <a-form-item label="Category name" name="category_name" v-bind="validateInfos.categoryName">
        <a-select :value="props.categoryName" disabled></a-select>
      </a-form-item>
      <a-form-item label="Visibility">
        <ul class="grid grid-cols-2 gap-x-3 gap-y-4 mb-0">
          <li class="flex items-center space-x-3">
            <a-switch v-model:checked="formModel.status" :checked-value="1" :un-checked-value="0"/>
            <span>Active</span>
          </li>
        </ul>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" @click="handleSubmit" :loading="isSubmitLoading">Submit</a-button>
      <a-button ghost danger @click="hide">Cancel</a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {Form, notification} from "ant-design-vue";
import {useServiceStore} from "@/stores/service";
import type {CreatePosProductRequest} from "gap-nodejs-sdk";
import handleError from "@/utils/error";

const emits = defineEmits(['getListProduct']);
const serviceStore = useServiceStore();

const isVisible = ref(false);
const isEdit = computed(() => Boolean(formModel.value.id));
const title = computed(() => isEdit.value ? 'Update Product' : 'Add Product');

const isLeaveProductPriceBlank = ref(true);

interface Props {
  categoryId: number,
  categoryName: string,
}

const props = defineProps<Props>();

interface FormModel {
  id?: number,
  name: string,
  price: number,
  description: string,
  group_id: string,
  status: 0 | 1,
}

const initFormModel: FormModel = {
  id: undefined,
  name: '',
  price: 0,
  description: '',
  group_id: 'both',
  status: 1,
}
const formModel = ref<FormModel>(initFormModel);
const formRules = ref({
  name: [
    {
      required: true,
      message: 'The service name field is required'
    }
  ]
});

const useForm = Form.useForm;
const {resetFields, validate, validateInfos} = useForm(formModel, formRules);

const show = (data?: any) => {
  formModel.value = Object.entries(initFormModel).reduce((result: any, [key, value]) => {
    result[key] = data[key] ?? value;
    return result;
  }, {});
  isLeaveProductPriceBlank.value = formModel.value.price === 0;
  isVisible.value = true;
};
const hide = () => {
  isVisible.value = false;
};

const {createProduct, updateProduct} = serviceStore;

const isSubmitLoading = ref(false);
const handleCreate = async () => {
  try {
    isSubmitLoading.value = true;
    const data: CreatePosProductRequest = {
      ...formModel.value,
      category_id: props.categoryId,
    } as any;
    await createProduct(data);
    hide();
    emits('getListProduct');
    notification.success({
      message: 'Create product success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSubmitLoading.value = false;
  }
};
const handleUpdate = async () => {
  try {
    isSubmitLoading.value = true;
    await updateProduct({
      ...formModel.value,
      id: formModel.value.id!,
      category_id: props.categoryId,
    });
    hide();
    emits('getListProduct');
    notification.success({
      message: 'Update product success',
    });
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSubmitLoading.value = false;
  }
};
const handleSubmit = async () => {
  try {
    await validate();
    isEdit.value
      ? handleUpdate()
      : handleCreate();
  } catch (error) {
    console.log(error)
  }
};

const handleAfterVisibleChange = (isVisible: boolean) => {
  if (isVisible) return;
  resetFields();
}
defineExpose({
  show,
  hide
})
</script>

<style lang="scss">
</style>
