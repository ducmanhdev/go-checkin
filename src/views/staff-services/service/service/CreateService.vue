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
      <a-form-item label="Service image" name="image_path" v-bind="validateInfos.image_path">
        <upload-avatar
          v-model="formModel.image_path"
          :name="formModel.name"
          :color="categoryColor"
        />
      </a-form-item>
      <a-form-item label="Service name" name="name" v-bind="validateInfos.name">
        <a-input v-model:value="formModel.name"/>
      </a-form-item>
      <a-form-item label="Service description" name="description" v-bind="validateInfos.note">
        <a-textarea class="resize-none !min-h-[150px]" v-model:value="formModel.note"></a-textarea>
      </a-form-item>
      <a-form-item label="Service duration" name="duration" v-bind="validateInfos.duration">
        <div class="grid grid-cols-2 gap-3">
          <a-select :options="durationHoursOptions" v-model:value="durationHours"></a-select>
          <a-select :options="durationMinutesOptions" v-model:value="durationMinutes"></a-select>
        </div>
      </a-form-item>
      <a-form-item label="Product price" name="price" v-bind="validateInfos.price">
        <a-input v-model:value="formModel.price" :disabled="isLeaveProductPriceBlank">
          <template #prefix>$</template>
        </a-input>
        <p class="mb-0 mt-2">
          <a-checkbox v-model:checked="isLeaveProductPriceBlank">Leave blank</a-checkbox>
        </p>
      </a-form-item>
      <a-form-item label="Supply share" name="supply_share" v-bind="validateInfos.supply_share">
        <a-input v-model:value="formModel.supply_share"/>
      </a-form-item>
      <a-form-item label="Category name" name="category_id" v-bind="validateInfos.category_id">
        <a-select v-model:value="formModel.category_id" disabled>
          <a-select-option :value="formModel.category_id">{{ formModel.cate_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="Visibility">
        <div class="mb-3">
          <a-checkbox v-model:checked="isServiceVisible">Service visible to client during online
            booking.
          </a-checkbox>
        </div>
        <p class="text-C90 mb-4">When enabled, this service will appear in your Booking Site and
          Embedded Widgets.
          This will not affect your ability to choose it when you create an appointment.</p>
        <ul class="grid grid-cols-2 gap-x-3 gap-y-4 mb-0">
          <li class="flex items-center space-x-3">
            <a-switch v-model:checked="formModel.show_on_checkin" :checked-value="1"
                      :un-checked-value="0"/>
            <span>Shown on Go Check In</span>
          </li>
          <li class="flex items-center space-x-3">
            <a-switch v-model:checked="formModel.show_on_pos" :checked-value="1"
                      :un-checked-value="0"/>
            <span>Shown on Go POS</span>
          </li>
          <li class="flex items-center space-x-3">
            <a-switch v-model:checked="formModel.status" :checked-value="1"
                      :un-checked-value="0"/>
            <span>Active</span>
          </li>
        </ul>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button
        type="primary"
        @click="handleSubmit"
        :loading="isSubmitLoading">
        Submit
      </a-button>
      <a-button
        danger
        ghost
        @click="hide">
        Cancel
      </a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {Form, notification} from "ant-design-vue";
import {useServiceStore} from "@/stores/service";
import handleError from "@/utils/error";
import UploadAvatar from "@/components/UploadAvatar.vue";
import {createUrl, isValidUrl} from '@/utils/url';

const emits = defineEmits(['getListService']);
const serviceStore = useServiceStore();

const isVisible = ref(false);
const isEdit = computed(() => Boolean(formModel.value.id));
const title = computed(() => isEdit.value ? 'Update Service' : 'Add Service');

const durationHoursOptions = Array.from(Array(15)).map((item, index) => ({
  label: `${index} hrs`,
  value: index
}));
const durationMinutesOptions = Array.from(Array(12)).map((item, index) => ({
  label: `${index * 5} mins`,
  value: index * 5
}));
const durationHours = ref(0);
const durationMinutes = ref(0);
const categoryColor = ref(null);
const isServiceVisible = computed({
  get() {
    return formModel.value.web_booking_visible === '1'
  },
  set(newValue) {
    return formModel.value.web_booking_visible = newValue ? '1' : '0';
  }
});
const isLeaveProductPriceBlank = ref(true);

interface FormModel {
  id?: number,
  name: string,
  category_id: number,
  cate_name: string,
  price: number,
  web_booking_visible: '0' | '1',
  note: string,
  duration: number,
  group_id: number,
  status: 0 | 1,
  supply_share: number,
  show_on_checkin: 0 | 1,
  show_on_booking: 0 | 1,
  show_on_pos: 0 | 1,
  image_path: string,
}

const initFormModel: FormModel = {
  id: undefined,
  name: '',
  category_id: 0,
  cate_name: '',
  price: 0,
  web_booking_visible: '1',
  note: '',
  duration: 60,
  group_id: 0,
  status: 1,
  supply_share: 0,
  show_on_checkin: 1,
  show_on_booking: 1,
  show_on_pos: 1,
  image_path: '',
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
    if (key === 'image_path') {
      result['image_path'] = createUrl(data['image_path'], data['image_base_url']);
    } else {
      result[key] = data[key] ?? value;
    }
    return result;
  }, {});
  durationHours.value = Math.floor(formModel.value.duration / 60);
  durationMinutes.value = formModel.value.duration % 60;
  categoryColor.value = data?.category_color;
  isLeaveProductPriceBlank.value = !formModel.value.price;
  isVisible.value = true;
};
const hide = () => {
  isVisible.value = false;
};

const {createService, updateService} = serviceStore;
const isSubmitLoading = ref(false);

const handleCreate = async () => {
  try {
    isSubmitLoading.value = true;
    const data: any = {
      ...formModel.value,
      duration: durationHours.value * 60 + durationMinutes.value,
    }
    if (isValidUrl(data.image_path)) {
      const url = new URL(data.image_path);
      data.image_path = url.pathname;
      data.image_base_url = url.origin;
    }
    await createService(data);
    hide();
    emits('getListService');
    notification.success({
      message: 'Create service success',
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
    const data: any = {
      id: formModel.value.id!,
      data: {
        ...formModel.value,
        id: formModel.value.id!,
        duration: durationHours.value * 60 + durationMinutes.value
      },
    }
    if (isValidUrl(data.data.image_path)) {
      const url = new URL(data.data.image_path);
      data.data.image_path = url.pathname;
      data.data.image_base_url = url.origin;
    }
    await updateService(data);
    hide();
    emits('getListService');
    notification.success({
      message: 'Update service success',
    });
  } catch (error) {
    console.error(error)
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
    console.log(error);
  }
}

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
