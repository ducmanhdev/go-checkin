<template>
  <div
    class="relative w-[126px] aspect-square shadow rounded-base overflow-hidden cursor-pointer"
    :class="{'pointer-events-none': isUploadLoading}"
    @click="handleShowCropper"
  >
    <div class="absolute top-2 right-2 cursor-pointer">
      <svg v-if="!url" width="20" height="21" viewBox="0 0 20 21" fill="none"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.99996 18.6867C14.6023 18.6867 18.3333 14.9558 18.3333 10.3534C18.3333 5.75104 14.6023 2.02008 9.99996 2.02008C5.39759 2.02008 1.66663 5.75104 1.66663 10.3534C1.66663 14.9558 5.39759 18.6867 9.99996 18.6867Z"
          stroke="#4C70F0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 7.02008V13.6867" stroke="#4C70F0" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M6.66663 10.3534H13.3333" stroke="#4C70F0" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round"/>
      </svg>
      <svg v-else
           width="21" height="21"
           viewBox="0 0 21 21"
           fill="none"
           xmlns="http://www.w3.org/2000/svg"
           @click.stop="handleRemove"
      >
        <path
          d="M10.4659 19.0648C15.0683 19.0648 18.7992 15.3338 18.7992 10.7315C18.7992 6.12909 15.0683 2.39813 10.4659 2.39813C5.86353 2.39813 2.13257 6.12909 2.13257 10.7315C2.13257 15.3338 5.86353 19.0648 10.4659 19.0648Z"
          stroke="#EB5757" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12.9658 8.23145L7.96582 13.2314" stroke="#EB5757" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.96582 8.23145L12.9658 13.2314" stroke="#EB5757" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div v-if="isUploadLoading" class="w-full h-full flex items-center text-center justify-center p-2">
      Uploading...
    </div>
    <img v-else-if="!url" :src="getImageUrl('upload-image-default.jpg')" alt=""
         class="w-full h-full object-cover rounded-lg">
    <img v-else-if="url" :src="url" alt="" class="w-full h-full object-cover rounded-lg">
    <p class="mt-1" v-if="uploadMessage" :class="{'text-success': isUploadSuccess, 'text-error': isUploadError}">
      {{ uploadMessage }}
    </p>
    <avatar-cropper v-model="isShowCropper" @uploading="handleUploading" upload-url="/"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {getImageUrl} from "@/utils/url";
// @ts-ignore
import AvatarCropper from "vue-avatar-cropper";
import {goCheckInSdk} from "@/sdk";

const props = defineProps<{
  modelValue: string | null,
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
const handleRemove = () => {
  deleteUrl.value = '';
  url.value = '';
};
const handleUpload = async (formData: any) => {
  try {
    isUploadLoading.value = true;
    isUploadError.value = false;
    isUploadSuccess.value = false;
    uploadMessage.value = '';
    deleteUrl.value = '';
    url.value = '';
    const res: any = await goCheckInSdk.business.upload(formData);
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
const handleUploading = async ({form}: any) => {
  handleUpload(form);
};
const isShowCropper = ref(false);
const handleShowCropper = () => isShowCropper.value = true;
</script>

<style lang="scss" scoped>
:deep {
  .avatar-cropper .avatar-cropper-img-input {
    display: none !important;
  }
}
</style>
