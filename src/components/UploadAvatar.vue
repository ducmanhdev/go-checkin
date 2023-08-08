<template>
  <div>
    <div
      class="cursor-pointer mx-auto relative w-[94px] h-[94px] rounded-full bg-CE1 flex justify-center items-center text-white text-lg"
      @click="handleShowCropper"
      :style="{backgroundColor: !isValidUrl && color ? color : ''}"
    >
      <div v-if="!isValidUrl && name">{{ shortName }}</div>
      <user-outlined v-if="!isValidUrl && !name" class="text-4xl"/>
      <img v-if="isValidUrl" :src="url" alt="" class="w-full h-full rounded-full object-cover">
      <camera-outlined class="absolute bottom-0 right-0 text-2xl !text-primary"/>
    </div>
    <div class="mt-4 text-center">
      <div v-if="isUploadLoading" class="">Loading...</div>
      <div v-if="uploadMessage" :class="{'text-success': isUploadSuccess, 'text-error': isUploadError}">
        {{ uploadMessage }}
      </div>
    </div>
    <div class="flex space-x-3 justify-center mt-4">
      <a-button
        type="primary"
        ghost
        size="small"
        v-if="!isValidUrl"
        :disabled="isUploadLoading"
        @click="handleShowCropper"
      >
        Add picture
      </a-button>
      <a-button
        type="primary"
        ghost
        size="small"
        v-if="isValidUrl"
        :disabled="isUploadLoading"
        @click.prevent="handleShowCropper"
      >
        Change picture
      </a-button>
      <a-button
        type="primary"
        ghost
        size="small"
        danger
        v-if="isValidUrl"
        :disabled="isUploadLoading"
        @click.prevent="handleRemove"
      >
        Delete picture
      </a-button>
    </div>
    <avatar-cropper v-model="isShowCropper" @uploading="handleUploading" upload-url="/"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {UserOutlined, CameraOutlined} from "@ant-design/icons-vue";
// @ts-ignore
import AvatarCropper from "vue-avatar-cropper";
import {useBusinessStore} from "@/stores/business";
import {isValidUrl as utilIsValidURl} from "@/utils/url";

const businessStore = useBusinessStore();
const props = defineProps<{
  modelValue: string,
  name?: string,
  color?: string | null,
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: any): void,
}>();
const isUploadLoading = ref(false);
const isUploadError = ref(false);
const isUploadSuccess = ref(false);
const uploadMessage = ref('');
const deleteUrl = ref('');
const url = computed(({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emits('update:modelValue', newValue)
  }
}));
const isValidUrl = computed(() => utilIsValidURl(url.value));
const shortName = computed(() =>
  (props?.name || '')
    .split(' ')
    .map((char: string) => char[0]?.toUpperCase())
    .join('')
    .slice(0, 3)
);
const defaultAvatarSvgStroke = computed(() => props.color ? '#fff' : '#848484');
const handleRemove = () => {
  deleteUrl.value = '';
  url.value = '';
  isUploadSuccess.value = false;
  isUploadError.value = false;
  uploadMessage.value = '';
};
const handleUpload = async (formData: any) => {
  try {
    isUploadLoading.value = true;
    isUploadError.value = false;
    isUploadSuccess.value = false;
    uploadMessage.value = '';
    deleteUrl.value = '';
    url.value = '';
    const res: any = await businessStore.upload(formData);
    isUploadSuccess.value = true;
    uploadMessage.value = 'Upload success';
    deleteUrl.value = res[0]?.delete_url;
    url.value = res[0]?.url;
  } catch (error: any) {
    isUploadError.value = true;
    uploadMessage.value = error.message;
  } finally {
    isUploadLoading.value = false;
  }
};
const handleUploading = async ({form, request, response}: any) => {
  handleUpload(form);
};
const isShowCropper = ref(false);
const handleShowCropper = () => isShowCropper.value = true;
const reset = handleRemove;
defineExpose({
  reset,
})
</script>

<style lang="scss" scoped>
:deep {
  .avatar-cropper .avatar-cropper-img-input {
    display: none !important;
  }
}
</style>
