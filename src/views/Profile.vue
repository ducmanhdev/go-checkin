<template>
  <div>
    <a-form
      layout="vertical"
      :model="formModel"
      @finish="handleUpdate"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        <div class="">
          <h2 class="heading-1 mb-4">Basic Information</h2>
          <a-form-item label="Name">
            <a-input :value="businessStore.businessSiteInfo?.name" disabled/>
          </a-form-item>
          <a-form-item label="Short Name">
            <a-input :value="businessStore.businessSiteInfo?.short_name" disabled/>
          </a-form-item>
          <a-form-item label="Phone">
            <a-input :value="businessStore.businessSiteInfo?.phone" disabled/>
          </a-form-item>
          <a-form-item label="Address">
            <a-input :value="businessStore.businessSiteInfo?.address" disabled/>
          </a-form-item>
          <a-form-item label="City">
            <a-input v-model:value="formModel.city"/>
          </a-form-item>
          <a-form-item label="Country Code">
            <a-input v-model:value="formModel.country_code"/>
          </a-form-item>
          <div class="grid grid-cols-1 xs:grid-cols-2 gap-x-3">
            <a-form-item label="State Code">
              <a-input v-model:value="formModel.state_code"/>
            </a-form-item>
            <a-form-item label="Postal Code">
              <a-input v-model:value="formModel.postal_code"/>
            </a-form-item>
          </div>
          <a-form-item label="Logo Image">
            <upload-preview v-model="formModel.logo_image"/>
          </a-form-item>
        </div>
        <div class="">
          <h2 class="heading-1 mb-4">Business Details</h2>
          <a-form-item label="Open Time">
            <a-textarea v-model:value="formModel.open_time" :rows="9"/>
          </a-form-item>
          <a-form-item label="Industry ID">
            <a-input v-model:value="formModel.industry_id"/>
          </a-form-item>
          <a-form-item label="Description">
            <a-textarea v-model:value="formModel.description" :rows="9"/>
          </a-form-item>
          <a-form-item label="Cover Image">
            <upload-preview v-model="formModel.cover_image"/>
          </a-form-item>
        </div>
        <div class="md:col-span-2 text-center">
          <a-button
            html-type="submit"
            type="primary"
            :disabled="isUpdateLoading"
            class="w-full md:w-auto"
          >
            {{ isUpdateLoading ? 'Saving...' : 'Save' }}
          </a-button>
        </div>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import UploadPreview from "@/components/UploadPreview.vue";
import {useBusinessStore} from "@/stores/business";
import handleError from "@/utils/error";
import {notification} from "ant-design-vue";
import type {GetBusinessSiteInfoResponse} from "gap-nodejs-sdk";
import {removeNullableInObj} from "@/utils/transform";

type FormModel = Pick<GetBusinessSiteInfoResponse, 'city' | 'postal_code' | 'state_code' | 'industry_id' | 'logo_image' | 'cover_image' | 'description' | 'country_code' | 'open_time'>
const formModel = ref<FormModel>({
  city: '',
  postal_code: '',
  state_code: '',
  industry_id: null,
  logo_image: '',
  cover_image: '',
  description: '',
  country_code: '',
  open_time: '',
});

const businessStore = useBusinessStore();

const assignData = () => {
  const businessSiteInfo = businessStore.businessSiteInfo;
  if (!businessSiteInfo) return;
  Object.keys(formModel.value).forEach(key => {
    formModel.value[key as keyof FormModel] = businessSiteInfo[key as keyof FormModel];
  })
}
assignData();

const isGetDataLoading = ref(false);
const handleGetData = async () => {
  try {
    isGetDataLoading.value = true;
    await businessStore.getBusinessSiteInfo();
    assignData();
  } catch (error) {
    handleError({error});
  } finally {
    isGetDataLoading.value = false;
  }
};

const isUpdateLoading = ref(false);
const handleUpdate = async () => {
  try {
    isUpdateLoading.value = true;
    const payload = {
      id: businessStore.businessSiteInfo?.id,
      ...formModel.value
    }
    removeNullableInObj(payload);
    await businessStore.updateBusinessSiteInfo(payload as any);
    handleGetData();
    notification.success({
      message: 'Update success',
    });
  } catch (error) {
    handleError({error})
  } finally {
    isUpdateLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
</style>
