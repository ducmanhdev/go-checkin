<template>
  <div>
    <p class="heading-2 mb-4">Go POS Staff Rating</p>
    <p class="text-base font-medium mb-1">Device to display staff rating:</p>
    <p
      class="text-base font-medium text-primary cursor-pointer mb-2"
      @click="handleShowListDevice"
    >
      See available device
    </p>
    <div class="mb-5 md:flex md:items-center md:justify-between gap-4">
      <p class="flex items-center space-x-3 mb-4 md:mb-0">
        <a-switch
          :checked="isEnableStaffRating"
          :checked-value="1"
          :un-checked-value="0"
          @change="handleUpdateConfigEnableStaffRating"
          :loading="isGetConfigEnableStaffRating || isUpdateConfigEnableStaffRating"
        />
        <span>Enable rating for staff on Go Checkin app</span>
      </p>
      <base-dropdown
        :options="listDevice"
        v-model="deviceSelected"
        @change="handleUpdateStaffRatingDevice"
        :loading="isUpdateStaffRatingDeviceLoading"
        class="w-full md:w-auto"
      />
    </div>
    <div
      class="space-y-10"
      :class="{
      'c-loading': isGetDataLoading
    }"
    >
      <a-empty v-if="!data?.length"/>
      <group-answer
        v-else
        v-for="answer in data"
        :key="answer?.type!"
        :data="answer!"
        @refresh="handleGetData"
      />
    </div>
  </div>

  <a-modal
    v-model:open="isShowListDevice"
    title="Device Options"
    :footer="false"
    :width="800"
    centered
  >
    <a-table
      :columns="columns"
      :data-source="listDeviceOrigin?.data"
      :loading="isGetListPosDeviceLoading"
      :pagination="false"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'last_login_at'">
          {{ record.last_login_at || 'N/A' }}
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-button
            type="primary"
            danger
            class="shrink-0 !min-w-fit !w-[34px] !h-[34px] !p-1 !rounded"
            @click="handleDeleteDevice(record.id)"
            :loading="deleteDeviceLoadingId === record.id"
          >
            <delete-outlined/>
          </a-button>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script setup lang="ts">
import {ref} from "vue";
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import {DeleteOutlined} from "@ant-design/icons-vue";
import {posSdk, settingsSdk} from "@/sdk";
import handleError from "@/utils/error";
import {notification} from "ant-design-vue";
import type {DataWithMetaResponse, GetListAnswerResponse, GetListPosDeviceResponse} from "gap-nodejs-sdk";
import {useRootStore} from "@/stores/root";
import GroupAnswer from "./GroupAnswer.vue";

const isShowListDevice = ref(false);
const handleShowListDevice = () => {
  isShowListDevice.value = true;
}
const columns = [
  {
    title: 'UUID',
    dataIndex: 'device_id',
    key: 'device_id',
    align: 'center',
    width: '30%'
  },
  {
    title: 'NAME',
    dataIndex: 'device_name',
    key: 'device_name',
    align: 'center',
    width: '20%'
  },
  {
    title: 'VERSION',
    dataIndex: 'device_app_version',
    key: 'device_app_version',
    align: 'center',
    width: '20%'
  },
  {
    title: 'LAST LOGIN',
    dataIndex: 'last_login_at',
    key: 'last_login_at',
    align: 'center',
    width: '20%'
  },
  {
    title: 'ACTION',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    width: '10%'
  },
];

const isEnableStaffRating = ref(0);
const isGetConfigEnableStaffRating = ref(false);
const handleGetConfigEnableStaffRating = async () => {
  try {
    isGetConfigEnableStaffRating.value = true;
    const res = await settingsSdk.keyStorage.getKeyStorage({
      key: "config.pos.enable_staff_rating",
    });
    isEnableStaffRating.value = res.value * 1;
  } catch (error) {
    handleError({error});
  } finally {
    isGetConfigEnableStaffRating.value = false;
  }
};
handleGetConfigEnableStaffRating();

const isUpdateConfigEnableStaffRating = ref(false);
const handleUpdateConfigEnableStaffRating = async (checkedValue: 0 | 1) => {
  try {
    isUpdateConfigEnableStaffRating.value = true;
    await settingsSdk.keyStorage.updateListKeyStorage({
      data: [
        {
          comment: '',
          key: "config.pos.enable_staff_rating",
          value: checkedValue,
        },
        {
          comment: '',
          key: "mercure_active",
          value: checkedValue,
        }
      ]
    });
    notification.success({
      message: 'Update success'
    });
    isUpdateConfigEnableStaffRating.value = false;
    handleGetConfigEnableStaffRating();
  } catch (error) {
    handleError({error});
  } finally {
    isUpdateConfigEnableStaffRating.value = false;
  }
};

const deviceSelected = ref<number | undefined>(undefined);
const listDeviceOrigin = ref<DataWithMetaResponse<GetListPosDeviceResponse> | null>(null);
const listDevice = ref<any[]>([]);
const isGetListPosDeviceLoading = ref(false);
const handleGetListPosDevice = async () => {
  try {
    isGetListPosDeviceLoading.value = true;
    const res = await posSdk.device.getListPosDevice();
    listDeviceOrigin.value = res;
    listDevice.value = res.data.map((device: GetListPosDeviceResponse[number]) => ({
      label: device?.device_name || 'N/A',
      value: device?.id,
    }));
    const currentStaffRatingDevice = res.data.find((device: GetListPosDeviceResponse[number]) => device?.is_show_staff_rating === 1);
    if (currentStaffRatingDevice) {
      deviceSelected.value = currentStaffRatingDevice.id;
    } else {
      handleUpdateConfigEnableStaffRating(0);
    }
  } catch (error) {
    handleError({error});
  } finally {
    isGetListPosDeviceLoading.value = false;
  }
}
handleGetListPosDevice();

const isUpdateStaffRatingDeviceLoading = ref(false);
const handleUpdateStaffRatingDevice = async (deviceId: string | number) => {
  try {
    isUpdateStaffRatingDeviceLoading.value = true;
    await posSdk.device.updateStaffRatingDevice({
      id: deviceId,
      is_show_staff_rating: 1,
    });
    notification.success({
      message: 'Update success'
    })
  } catch (error) {
    handleError({error})
  } finally {
    isUpdateStaffRatingDeviceLoading.value = false;
  }
};

const rootStore = useRootStore();
const deleteDeviceLoadingId = ref<number | null>(null);
const handleDeleteDevice = async (deviceId: number) => {
  try {
    await rootStore.confirm({
      headerTitle: 'Delete device',
      bodyTitle: 'Do you want to delete this device?',
    });
    deleteDeviceLoadingId.value = deviceId;
    await posSdk.device.deletePosDevice({
      id: deviceId,
    });
    notification.success({
      message: 'Delete device success'
    });
    handleGetListPosDevice()
  } catch (error) {
    handleError({error});
  } finally {
    deleteDeviceLoadingId.value = null;
  }
};

const data = ref<GetListAnswerResponse | null>(null);
const isGetDataLoading = ref(false);
const handleGetData = async () => {
  try {
    isGetDataLoading.value = true;
    data.value = await posSdk.setting.getListAnswer();
  } catch (error) {
    handleError({error});
  } finally {
    isGetDataLoading.value = false;
  }
}
handleGetData();
</script>

<style scoped>

</style>
