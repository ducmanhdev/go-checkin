<template>
  <a-drawer
    v-model:open="isVisible"
    placement="right"
    :width="560"
    :title="title"
    @after-open-change="handleAfterVisibleChange"
  >
    <a-form
      layout="vertical"
      class="child:!mb-0 grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      <a-form-item
        class="sm:col-span-2"
        label="Instruction"
      >
        <div class="notice-box">
          This is where you can assign a staff code to your employee so she/he will be able to check out their
          customers
        </div>
      </a-form-item>
      <a-form-item class="sm:col-span-2" label="Profile picture" v-bind="validateInfos.image_url">
        <upload-avatar
          v-model="formModel.image_url"
          :name="formModel.staff_name"
          :color="formModel.color_code"
          ref="uploadAvatarRef"
        />
      </a-form-item>
      <a-form-item label="Name" name="staff_name" v-bind="validateInfos.staff_name">
        <a-input v-model:value="formModel.staff_name"/>
      </a-form-item>
      <a-form-item label="Code" name="staff_code" v-bind="validateInfos.staff_code">
        <a-input-number
          v-input-number
          :controls="false"
          v-model:value="formModel.staff_code"
          string-mode
          :maxlength="6"
          class="!w-full"
        />
      </a-form-item>
      <a-form-item class="sm:col-span-2" label="Nick name" name="nick_name" v-bind="validateInfos.nick_name">
        <a-input v-model:value="formModel.nick_name"/>
      </a-form-item>
      <a-form-item class="sm:col-span-2" label="Cell" name="phone" v-bind="validateInfos.phone">
        <a-input-number
          v-input-number
          :controls="false"
          v-model:value="formModel.phone"
          class="!w-full"
          string-mode
          :formatter="usePhoneFormat"
          :parser="usePhoneParser"
        />
      </a-form-item>
      <a-form-item class="sm:col-span-2" label="Email" name="email" v-bind="validateInfos.email">
        <a-input v-model:value="formModel.email"/>
      </a-form-item>
      <a-form-item class="sm:col-span-2" label="Address" name="address" v-bind="validateInfos.address">
        <a-input v-model:value="formModel.address"/>
      </a-form-item>
      <a-form-item class="sm:col-span-2" label="Permission" name="permission" v-bind="validateInfos.permission">
        <ul class="grid gap-3 font-medium text-secondary" v-if="formModel.permission?.length">
          <li
            class="flex items-center space-x-2"
            v-for="permission in formModel.permission"
            :key="permission.id"
          >
            <a-switch v-model:checked="permission.status" :checked-value="1" :un-checked-value="0"/>
            <span>{{ permission.name }}</span>
          </li>
        </ul>
      </a-form-item>
      <a-form-item class="sm:col-span-2 color-form-item" label="Color" name="color" v-bind="validateInfos.color">
        <ul class="flex flex-wrap gap-3 mb-0">
          <li class="w-[30px] cursor-pointer aspect-square rounded" v-for="color in colorList" :key="color"
              :style="{backgroundColor: color}"
              @click="formModel.color_code = color">
            <div class="flex justify-center items-center h-full  text-white" v-if="formModel.color_code === color">
              <check-outlined/>
            </div>
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
import {computed, ref} from "vue";
import {usePhoneFormat, usePhoneParser} from "@/utils/formatter";
import {useStaffStore} from "@/stores/staff";
import {notification} from "ant-design-vue";
import type {Rule} from "ant-design-vue/es/form";
import handleError from "@/utils/error";
import UploadAvatar from "@/components/UploadAvatar.vue";
import {Form} from 'ant-design-vue';
import {CheckOutlined} from "@ant-design/icons-vue";

const staffStore = useStaffStore();
const {createStaff, updateStaff, getListPermission} = staffStore;

interface FormModel {
  id: number | undefined,
  staff_name: string,
  staff_code: string,
  nick_name: string,
  phone: string,
  email: string,
  address: string,
  permission: any[],
  color_code: string,
  status: number,
  image_url: string,
}

const colorList = [
  "#C2F8CA",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000"
];

const uploadAvatarRef = ref<InstanceType<typeof UploadAvatar> | null>(null);
const handleResetUploadAvatar = () => {
  uploadAvatarRef.value?.reset();
}

const initModel: FormModel = {
  id: undefined,
  staff_name: '',
  staff_code: '',
  nick_name: '',
  phone: '',
  email: '',
  address: '',
  permission: [],
  color_code: colorList[0],
  status: 1,
  image_url: '',
}
const formModel = ref<FormModel>({...initModel});

const staffCodeValidator = (_rule: Rule, value: string | null) => {
  if (value === '' || value === null) {
    return Promise.reject('Staff code field is required');
  }
  if (value.length < 3) {
    return Promise.reject('Staff code must contain at least 3 digits');
  }
  return Promise.resolve();
}
const formRules = ref({
  staff_name: [
    {required: true, message: 'Staff name field is required'}
  ],
  staff_code: [
    {validator: staffCodeValidator},
  ]
});

const useForm = Form.useForm;
const {resetFields, validate, validateInfos} = useForm(formModel, formRules);

const emits = defineEmits(['getListStaff'])

const isGetListPermission = ref(false);
const handleGetListPermission = async () => {
  try {
    isGetListPermission.value = true;
    await getListPermission();
    initModel.permission = staffStore.listPermission;
    formModel.value.permission = staffStore.listPermission;
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListPermission.value = false;
  }
}
handleGetListPermission();

const isVisible = ref(false);
const isEdit = computed(() => Boolean(formModel.value.id));
const title = computed(() => isEdit.value ? 'Edit Staff information' : 'Create New Staff');

const show = (data?: any) => {
  formModel.value = {
    id: data?.user_id,
    staff_name: data?.name ?? initModel.staff_name,
    staff_code: data?.code ?? initModel.staff_code,
    nick_name: data?.nickname ?? initModel.nick_name,
    phone: data?.phone ?? initModel.phone,
    email: data?.email ?? initModel.email,
    address: data?.address ?? initModel.address,
    permission: data?.permission ?? initModel.permission,
    color_code: data?.color_code ?? initModel.color_code,
    status: data?.status ?? initModel.status,
    image_url: data?.image_url ?? initModel.image_url,
  }
  isVisible.value = true;
};

const hide = () => {
  isVisible.value = false;
};


const isSubmitLoading = ref(false);
const handleCreateStaff = async () => {
  try {
    isSubmitLoading.value = true;
    await createStaff({
      ...formModel.value,
      list_permission: formModel.value.permission.map((permission: any) => ({
        id: permission.id,
        status: permission.status,
      }))
    });
    notification.success({
      message: 'Create staff success',
    })
    emits('getListStaff');
    hide();
  } catch (error: any) {
    handleError({
      error: error
    })
  } finally {
    isSubmitLoading.value = false;
  }
}
const handleUpdateStaff = async () => {
  try {
    isSubmitLoading.value = true;
    const data = {
      ...formModel.value,
      id: formModel.value.id!,
      is_active: formModel.value.status,
      list_permission: formModel.value.permission.map((permission: any) => ({
        id: permission.id,
        status: permission.status,
      }))
    } as any;
    delete data.permission;
    delete data.status;
    await updateStaff(data);
    notification.success({
      message: 'Update staff success',
    });
    emits('getListStaff');
    hide();
  } catch (error: any) {
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
      handleUpdateStaff() :
      handleCreateStaff();
  } catch (error) {
    handleError({error})
  }
}

const handleAfterVisibleChange = (isVisible: boolean) => {
  if (isVisible) return;
  handleResetUploadAvatar();
  resetFields();
}
defineExpose({
  show,
  hide
})
</script>

<style lang="scss" scoped>
</style>
