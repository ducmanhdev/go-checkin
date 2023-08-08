<template>
  <a-layout class="!h-screen !bg-white">
    <layout-aside ref="layoutAsideRef"/>
    <a-layout class="!bg-white !text-black">
      <a-layout-header
        class="!bg-white !text-black !h-[var(--header-height)] !leading-normal sticky top-0 shadow-[0_0_4px_rgba(0,9,54,0.15)] !px-[var(--layout-padding)] !md:px-7 py-2 z-[50]"
      >
        <div class="h-full flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button type="button" @click="handleToggleCollapse">
              <svg class="hidden md:block" width="20" height="20" viewBox="0 0 20 20" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H10M10 2.5H4.16667C3.72464 2.5 3.30072 2.67559 2.98816 2.98816C2.67559 3.30072 2.5 3.72464 2.5 4.16667V15.8333C2.5 16.2754 2.67559 16.6993 2.98816 17.0118C3.30072 17.3244 3.72464 17.5 4.16667 17.5H10M10 2.5V17.5"
                  stroke="#1685FC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg class="md:hidden" width="18" height="18" viewBox="0 0 18 18" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 9H2.25" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.75 4.5H2.25" stroke="black" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path d="M15.75 13.5H2.25" stroke="black" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </button>
            <img
              src="@/assets/images/logo.png"
              class="block max-w-[120px] min-[321px]:max-w-[140px] h-auto md:hidden"
              alt=""
            >
          </div>
          <div class="flex items-center gap-4 md:gap-7">
            <div class="hidden md:block">
              <p class="mb-0 font-medium">Balance</p>
              <p class="mb-0 text-C82">{{ smsRemain?.remain_balance?.sms || 0 }} SMS</p>
            </div>
            <a-badge
              :count="unreadNotifyAppointmentCount"
              :number-style="{
                fontSize: '10px',
                height: '14px',
                minWidth: '14px',
                lineHeight: '14px',
                padding: '0 4px',
              }"
              class="cursor-pointer"
              @click="handleShowDrawerNotification"
            >
              <bell-outlined class="text-2xl leading-[0]"/>
            </a-badge>
            <a-dropdown
              placement="bottomRight"
              :trigger="['click']"
              overlay-class-name="!min-w-0"
            >
              <div class="flex items-center cursor-pointer">
                <div class="text-right mr-2 hidden md:block">
                  <p class="font-medium mb-0">{{ businessSiteInfo?.name }}</p>
                  <p class="text-C82 mb-0">{{ usePhoneFormat(businessSiteInfo?.phone) }}</p>
                </div>
                <a-avatar
                  :src="businessSiteInfo?.logo_image"
                  :size="30"
                  class="!grid place-items-center"
                >
                  <template #icon>
                    <user-outlined/>
                  </template>
                </a-avatar>
              </div>
              <template #overlay>
                <a-menu style="min-width: 138px;">
                  <a-menu-item @click="handleLogout">Logout</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            <button type="button" class="md:hidden">
              <close-circle-outlined class="!text-error text-2xl" @click="handleLogout"/>
            </button>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="overflow-y-auto">
        <div class="parent p-[var(--layout-padding)]">
          <frame/>
        </div>
      </a-layout-content>
    </a-layout>
    <drawer-notification ref="drawerNotificationRef"/>
  </a-layout>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import Frame from '../Frame.vue';
import {useRootStore} from "@/stores/root";
import {BellOutlined, UserOutlined, CloseCircleOutlined} from "@ant-design/icons-vue";
import {usePhoneFormat} from "@/utils/formatter";
import {useBusinessStore} from "@/stores/business";
import {useNotificationStore} from "@/stores/notification";
import {useAuthStore} from "@/stores/auth";
import handleError from "@/utils/error";
import type {GetSMSRemainResponse} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";
import DrawerNotification from "./DrawerNotification.vue";
import LayoutAside from "./LayoutAside.vue";

const rootStore = useRootStore();

const layoutAsideRef = ref<InstanceType<typeof LayoutAside> | null>(null);
const handleToggleCollapse = () => {
  layoutAsideRef.value?.toggleCollapse();
}
const businessStore = useBusinessStore();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const businessSiteInfo = computed(() => businessStore.businessSiteInfo);
const unreadNotifyAppointmentCount = computed(() => notificationStore.unreadNotifyAppointmentCount);
const handleLogout = async () => {
  try {
    await rootStore.confirm({
      bodyTitle: 'Oh no!',
      bodyMessage: 'You are leaving now? Are you sure?'
    });
    await authStore.logout();
  } catch (error) {
    if (!error) return;
    handleError({
      error: error
    })
  }
};

const smsRemain = ref<GetSMSRemainResponse | null>(null);
const isGetSmsRemainLoading = ref(false);
const handleGetSmsRemain = async () => {
  try {
    isGetSmsRemainLoading.value = true;
    smsRemain.value = await goCheckInSdk.sms.getSMSRemain();
  } catch (error) {
    handleError({error});
  } finally {
    isGetSmsRemainLoading.value = false;
  }
};
handleGetSmsRemain();

const drawerNotificationRef = ref<InstanceType<typeof DrawerNotification> | null>(null);
const handleShowDrawerNotification = () => {
  drawerNotificationRef.value?.show();
};
</script>

<style lang="scss">
.parent {
  --min-h-full: calc(100vh - var(--header-height) - (var(--layout-padding) * 2));

  > .min-h-full {
    min-height: var(--min-h-full);
  }

  &:has(.parent-no-padding) {
    --layout-padding: 0;
    --min-h-full: calc(100vh - var(--header-height));
  }
}
</style>
