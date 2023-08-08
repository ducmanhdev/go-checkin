<template>
  <section>
    <div class="mb-3 flex items-center justify-between gap-3">
      <h2 class="heading-1 mb-0">Promotion</h2>
      <div class="flex gap-4">
        <input-search class="!w-[400px] hidden md:block" v-model="search"/>
        <a-button
          type="primary"
          @click="handleShowDrawer"
          :loading="isShowDrawerLoading"
        >
          <plus-circle-outlined/>
          Add new
        </a-button>
      </div>
    </div>
    <input-search v-model="search" class="md:hidden mt-3"/>
    <div class="mt-4">
      <base-tab-nav
        :list="listTab"
        v-model="tabActive"
        @change="resetSearch"
        class="mb-4"
      />
      <list-table
        :search="search"
        v-if="tabActive === 'promotion_lists'"
        :key="refreshKey"
      />
      <list-table
        :search="search"
        v-if="tabActive === 'expired_promotion_list'"
        type="expired"
        :key="refreshKey"
      />
    </div>
    <drawer
      ref="drawerRef"
      @refresh="handleRefresh"
    />
  </section>
</template>

<script setup lang="ts">
import {ref} from "vue";
import BaseTabNav from "@/components/base/BaseTabNav.vue";
import InputSearch from "@/components/InputSearch.vue";
import Drawer from "./Drawer.vue";
import ListTable from './ListTable.vue';
import {PlusCircleOutlined} from "@ant-design/icons-vue";
import handleError from "@/utils/error";
import {goCheckInSdk} from "@/sdk";

const search = ref('');
const resetSearch = () => {
  search.value = '';
};
const listTab = [
  {
    label: 'Promotion Lists',
    value: 'promotion_lists',
  },
  {
    label: 'Expired promotion list',
    value: 'expired_promotion_list',
  },
];
const tabActive = ref(listTab[0].value);
const drawerRef = ref<InstanceType<typeof Drawer> | null>(null);

const isShowDrawerLoading = ref(false);
const handleShowDrawer = async () => {
  try {
    isShowDrawerLoading.value = true;
    await goCheckInSdk.campaign.checkCampaignPromotionLimit();
    let isRequireOptOut;
    try {
      await goCheckInSdk.campaign.checkCampaignPromotionOptOut();
      isRequireOptOut = false;
    } catch (error) {
      isRequireOptOut = true;
    }
    drawerRef.value?.show(isRequireOptOut);
  } catch (error) {
    handleError({error});
  } finally {
    isShowDrawerLoading.value = false;
  }
};
const refreshKey = ref(1);
const handleRefresh = () => {
  refreshKey.value += 1;
}
</script>

<style lang="scss">
</style>
