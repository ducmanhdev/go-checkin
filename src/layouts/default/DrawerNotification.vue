<template>
  <a-drawer v-model:open="isVisible" title="Notification" :body-style="{padding: 0}">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="appointment" tab="Appointment">
        <ul class="divide-y" v-if="listNotifyAppointment?.length">
          <li
            v-for="item in listNotifyAppointment"
            :key="item?.id!"
            class="cursor-pointer px-4 py-3 text-xs"
            :class="{'bg-[aliceblue]': item?.is_read === 0}"
            @click="handleMaskAsRead(item?.id!, 'appointment')"
          >
            <div class="flex justify-between items-center space-x-2">
              <a-tag :color="TAG_COLORS.get(item?.type!)" class="capitalize">{{ item?.type }}</a-tag>
              <div>{{ dayjs(item?.created_at).fromNow() }}</div>
            </div>
            <div class="mt-1 line-clamp-2">{{ item?.content }}</div>
          </li>
        </ul>
        <a-empty v-else class="py-10"/>
      </a-tab-pane>
      <a-tab-pane key="system" tab="System">
        <ul class="divide-y" v-if="listNotifySystem?.length">
          <li
            v-for="item in listNotifySystem"
            :key="item?.id!"
            class="cursor-pointer px-4 py-3 text-xs"
            :class="{'bg-[aliceblue]': item?.is_read === 0}"
            @click="handleMaskAsRead(item?.id!, 'normal')"
          >
            <div class="flex justify-between items-center space-x-2">
              <div class="font-semibold text-primary text-sm">{{ item?.title }}</div>
              <div>{{ dayjs(item?.created_at).fromNow() }}</div>
            </div>
            <div class="mt-1 line-clamp-2">{{ item?.description }}</div>
          </li>
        </ul>
        <a-empty v-else class="py-10"/>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import handleError from "@/utils/error";
import {goCheckInSdk} from "@/sdk";
import {useNotificationStore} from "@/stores/notification";

dayjs.extend(relativeTime);

const notificationStore = useNotificationStore();
const isVisible = ref(false);

const listNotifyAppointment = computed(() => notificationStore?.listNotifyAppointment);
const listNotifySystem = computed(() => notificationStore?.listNotifySystem);

const isGetNotifyLoading = ref(false);
const handleGetNotify = async () => {
  try {
    if (!listNotifyAppointment.value || !listNotifySystem.value) isGetNotifyLoading.value = true;
    await notificationStore.getNotify();
  } catch (error: any) {
    handleError({error})
  } finally {
    isGetNotifyLoading.value = false;
  }
};

const isMaskAsReadLoading = ref(false);
const handleMaskAsRead = async (id: number, notifyType: 'appointment' | 'normal') => {
  try {
    isMaskAsReadLoading.value = true;
    await goCheckInSdk.notification.maskAsRead({id, type: notifyType});
    handleGetNotify();
  } catch (error) {
    handleError({error});
  } finally {
    isMaskAsReadLoading.value = false;
  }
};

const activeKey = ref('appointment');
const TAG_COLORS = new Map([
  ['done', ''],
  ['confirmed', '#558BE3'],
  ['scheduled', '#34C672'],
  ['cancelled', 'var(--color-error)'],
]);

const show = () => {
  isVisible.value = true;
};
const hide = () => {
  isVisible.value = false;
};
defineExpose({show, hide});
</script>

<style lang="scss" scoped>
.ant-tabs {
  overflow: visible !important;
}

:deep {
  .ant-tabs-nav-list {
    width: 100%;
  }

  .ant-tabs-nav {
    position: sticky !important;
    top: 0 !important;
    margin-bottom: 0 !important;
    background-color: var(--color-white);
  }

  .ant-tabs-tab {
    width: 50%;
    justify-content: center;
    padding: 0.75rem 1rem;
    font-weight: 500;
  }

  .ant-tabs-tab + .ant-tabs-tab {
    margin: 0;
  }
}
</style>
