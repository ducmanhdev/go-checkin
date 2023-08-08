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
      <a-form-item label="Combo name" name="name" v-bind="validateInfos.name">
        <a-input v-model:value="formModel.name"/>
      </a-form-item>
      <a-form-item label="Combo description" name="description" v-bind="validateInfos.description">
        <a-textarea class="resize-none !min-h-[150px]" v-model:value="formModel.description"></a-textarea>
      </a-form-item>
      <a-form-item label="Add item" name="item">
        <a-button
          type="primary"
          size="small"
          class="secondary"
          @click="handleOpenAddComboItem"
        >
          + Add item
        </a-button>
      </a-form-item>
      <ul
        v-if="comboItem && comboItem.length"
        class="child:grid child:grid-cols-[1fr_50px_150px_18px] child:items-center child:gap-3 space-y-2 mb-5"
      >
        <li v-for="item in comboItem" :key="item.id">
          <span>{{ item.name }}</span>
          <span>{{ typeof item?.price === 'number' ? currencyFormat(item?.price) : 'N/A' }}</span>
          <a-input-number
            class="!w-full"
            prefix="$"
            :value="item.price"
            @change="(newValue: any) => newValue ? item.price = newValue : '0'"
            :disabled="typeof item.price !== 'number'"
          >
          </a-input-number>
          <svg @click="handleRemoveComboItem(item.id)" class="cursor-pointer" width="18" height="18"
               viewBox="0 0 18 18" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M2.25 4.5H3.75H15.75" stroke="#909090" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round"></path>
            <path
              d="M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5"
              stroke="#909090" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </li>
        <li class="font-semibold">
          <span>Combo price</span>
          <span>${{ currencyFormat(totalComboPrice) }}</span>
        </li>
      </ul>
      <a-form-item label="Category name" name="category_name" v-bind="validateInfos.category_name">
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
      <template #footer>
        <a-button type="primary" @click="handleSubmit" :loading="isSubmitLoading">Submit</a-button>
        <a-button ghost danger @click="hide">Cancel</a-button>
      </template>
    </a-form>
  </a-drawer>
  <add-combo-item
    ref="addComboItemRef"
    @confirm="handleAddComboItemConfirm">
  </add-combo-item>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {Form, notification} from "ant-design-vue";
import AddComboItem from "./AddComboItem.vue";
import {useServiceStore} from "@/stores/service";
import type {
  CreateComboRequest, UpdateComboRequest,
} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import {currencyFormat} from "../../../../utils/formatter";

const emits = defineEmits(['getListCombo']);
const serviceStore = useServiceStore();
const addComboItemRef = ref<InstanceType<typeof AddComboItem> | null>(null);
const handleOpenAddComboItem = () => {
  const comboIdSelected = comboItem.value.map(item => item.item_detail.id);
  addComboItemRef.value?.show(comboIdSelected);
}
const isVisible = ref(false);
const isEdit = computed(() => Boolean(formModel.value.id));
const title = computed(() => isEdit.value ? 'Update Product' : 'Add Product');

interface Props {
  categoryId: number,
  categoryName: string,
}

const props = defineProps<Props>()

interface FormModel {
  id?: number,
  name: string,
  description: string,
  status: 0 | 1,
  statusFilter: 0 | 1,
}

const initFormModel: FormModel = {
  id: undefined,
  name: '',
  description: '',
  status: 1,
  statusFilter: 1
}
const formModel = ref<FormModel>(initFormModel);
const formRules = ref({
  name: [
    {
      required: true,
      message: 'The combo name field is required'
    }
  ]
});

const useForm = Form.useForm;
const {resetFields, validate, validateInfos} = useForm(formModel, formRules);

const comboItem = ref<any[]>([]);
const show = (data?: any) => {
  formModel.value = Object.entries(initFormModel).reduce((result: any, [key, value]) => {
    result[key] = data[key] ?? value;
    return result;
  }, {});
  comboItem.value = (data.combo_item || []).map((item: any) => ({
    ...item,
    id: item.item_detail.id,
    duration: item.item_detail.duration,
    name: item.item_detail.name,
  }));
  isVisible.value = true;
};
const hide = () => {
  isVisible.value = false;
};

const {createCombo, updateCombo} = serviceStore;
const isSubmitLoading = ref(false);
const handleCreate = async () => {
  try {
    isSubmitLoading.value = true;
    const duration = comboItem.value.reduce((total: number, current: any) => {
      total += current.duration;
      return total;
    }, 0);
    const combo_items = comboItem.value.map((sv: any) => ({
      item_price: sv.item_price,
      item_id: sv.id,
      item_type: sv.type,
      priority: sv.priority,
      item_data: [],
      status: sv.status
    }));
    const data: CreateComboRequest = {
      category_id: props.categoryId,
      name: formModel.value.name,
      description: formModel.value.description,
      price: totalComboPrice.value,
      duration: duration,
      status: formModel.value.status,
      statusFilter: formModel.value.statusFilter,
      combo_items: combo_items
    }
    await createCombo(data);
    hide();
    emits('getListCombo');
    notification.success({
      message: 'Create combo success',
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
    const duration = comboItem.value.reduce((total: number, current: any) => {
      total += current.duration;
      return total;
    }, 0);
    const combo_items = comboItem.value.map((sv: any) => ({
      item_price: sv.price,
      item_id: sv.id,
      item_type: sv.item_type,
      priority: sv.priority,
      item_data: [],
      status: sv.status,
    }));
    const data: UpdateComboRequest = {
      id: formModel.value.id!,
      category_id: props.categoryId,
      name: formModel.value.name,
      description: formModel.value.description,
      price: totalComboPrice.value,
      duration: duration,
      status: formModel.value.status,
      statusFilter: formModel.value.statusFilter,
      combo_items: combo_items
    }
    await updateCombo(data);
    hide();
    emits('getListCombo');
    notification.success({
      message: 'Update combo success',
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
      : handleCreate()
  } catch (error) {
    console.log(error)
  }
};

const totalComboPrice = computed(() => {
  let price = 0;
  if (comboItem.value.length) {
    price = comboItem.value.reduce((total: number, current: any) => {
      if (typeof current.price === 'number') {
        total += current.price;
      }
      return total;
    }, 0);
  }
  return price;
});
const handleAddComboItemConfirm = (newComboItem: any) => {
  comboItem.value = newComboItem;
}
const handleRemoveComboItem = (id: number) => {
  comboItem.value = comboItem.value.filter(item => item.id !== id)
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
.create-combo {
  .ant-drawer-header {
    display: none;
  }

  .ant-drawer-body {
    padding: 0 1rem;
  }

  .ant-form-item-label {
    > label {
      color: var(--color-C62)
    }
  }

  .ant-form-vertical .ant-form-item {
    @media (max-width: 640px) {
      flex-direction: row;
    }
  }
}
</style>
