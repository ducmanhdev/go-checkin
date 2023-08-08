<template>
  <a-drawer
    v-model:open="isVisible"
    placement="right"
    :width="560"
    :title="isEdit ? 'Update Category' : 'Create Category'"
    @after-open-change="handleAfterVisibleChange"
  >
    <a-form layout="vertical">
      <a-form-item label="Category name" name="name" v-bind="validateInfos.name">
        <a-input v-model:value="formModel.name"/>
      </a-form-item>
      <a-form-item label="Category color" v-bind="validateInfos.color_code" class="color-form-item">
        <ul class="flex flex-wrap gap-3 mb-0">
          <li
            class="w-[30px] cursor-pointer opacity-70 aspect-square rounded"
            v-for="color in colorList"
            :key="color"
            :style="{backgroundColor: color}"
            @click="formModel.color_code = color">
            <div
              class="flex justify-center items-center text-white h-full"
              v-if="formModel.color_code === color">
              <check-outlined/>
            </div>
          </li>
        </ul>
      </a-form-item>
      <a-form-item label="Status" v-bind="validateInfos.status">
        <div class="flex items-center gap-3">
          <a-switch v-model:checked="isActive"/>
          Active
        </div>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button type="primary" :loading="isSubmitLoading" @click="handleSubmit">Submit</a-button>
      <a-button ghost danger @click="hide">Cancel</a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {useServiceStore} from "@/stores/service";
import {notification} from "ant-design-vue";
import type {CreateCheckInCategoryRequest, UpdateCheckInCategoryRequest} from 'gap-nodejs-sdk';
import handleError from "@/utils/error";
import {Form} from 'ant-design-vue';
import {CheckOutlined} from "@ant-design/icons-vue";

const serviceStore = useServiceStore();
const {createCategory, updateCategory} = serviceStore;
const isVisible = ref(false);

const emits = defineEmits(['getListCategory']);

const colorList = [
  "#EA5C2B",
  "#2DC069",
  "#4659BD",
  "#C85CE0",
  "#74B42B",
  "#F38702",
  "#596FF6",
  "#F655BD",
  "#07B4A4",
  "#B55812",
  "#217AA3",
  "#FF8E77",
  "#9D67D0",
  "#4BAF28",
  "#CC9F02",
  "#035397",
  "#FF7175",
  "#6E3CBC",
  "#00A3FF",
  "#F1A815",
  "#DCC0E0",
  "#FCB88D",
  "#82CCB5",
  "#71ABDD",
  "#8F9BCE",
  "#C5A896",
  "#F79D8B",
  "#FDCD79",
  "#81D2A2",
  "#6BCADE",
  "#A19CCB",
  "#CCA7AA",
  "#DF93A8",
  "#F4B97C",
  "#B6D884",
  "#8BD4D2",
  "#C083A9",
  "#E6C3A8",
  "#E89B68",
  "#FFA468",
  "#C4C487",
  "#83B5B9",
  "#CCA7CD",
  "#BBB4AC",
  "#942CA6",
  "#D9A429",
  "#A2AE66",
  "#66A7AC",
  "#88729D",
  "#B38888",
  "#BC5ECC",
  "#DC8EEA"
];

interface FormModel {
  id: number | undefined,
  name: string,
  type: string,
  color_code: string,
  status: string
}

const formModel = ref<FormModel>({
  id: undefined,
  name: "",
  type: "",
  status: "2",
  color_code: colorList[0]
});
const isEdit = computed(() => formModel.value.id !== undefined);
const formRules = ref({
  name: [
    {
      required: true,
      message: 'The category name field is required\n'
    }
  ]
});
const useForm = Form.useForm;
const {resetFields, validate, validateInfos} = useForm(formModel, formRules);

const isActive = computed({
  get() {
    return formModel.value.status === "2";
  },
  set(newValue) {
    formModel.value.status = newValue ? "2" : "1";
  }
});

const show = (data?: any) => {
  formModel.value = {
    id: data?.id ?? undefined,
    name: data?.name ?? "",
    type: data?.type ?? "",
    status: data?.status ?? "2",
    color_code: data?.color_detail?.color_code ?? colorList[0]
  }
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
}

const isSubmitLoading = ref(false);
const handleCreateCategory = async () => {
  isSubmitLoading.value = true;
  try {
    const data: CreateCheckInCategoryRequest = {
      name: formModel.value.name,
      type: formModel.value.type,
      color_code: formModel.value.color_code,
      status: formModel.value.status
    }
    await createCategory(data);
    notification.success({
      message: 'Create category success',
    });
    hide();
    emits('getListCategory');
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSubmitLoading.value = false;
  }
}
const handleUpdateCategory = async () => {
  isSubmitLoading.value = true;
  try {
    const data: UpdateCheckInCategoryRequest = {
      id: formModel.value.id!,
      data: {
        id: formModel.value.id!,
        name: formModel.value.name,
        type: formModel.value.type,
        color_code: formModel.value.color_code,
        status: formModel.value.status,
      }
    }
    await updateCategory(data);
    notification.success({
      message: 'Update category success',
    });
    hide();
    emits('getListCategory');
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSubmitLoading.value = false;
  }
}
const handleSubmit = async () => {
  try {
    await validate();
    isEdit.value ?
      handleUpdateCategory() :
      handleCreateCategory();
  } catch (error) {
    console.error(error)
  }

}

const handleAfterVisibleChange = (isVisible: boolean) => {
  if (isVisible) return;
  resetFields();
}
defineExpose({
  show,
  hide
});
</script>

<style lang="scss" scoped>
</style>
