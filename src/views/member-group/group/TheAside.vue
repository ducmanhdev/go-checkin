<template>
  <aside class="md:shadow-[0_4px_4px_rgba(0,9,54,0.15)] bg-white text-black p-4 xl:p-7 space-y-4">
    <h2 class="heading-1 mb-0 md:hidden">Group</h2>
    <div class="flex gap-4">
      <router-link
        v-for="name in ['customer', 'group']"
        :key="name"
        :to="{name: name}"
        custom
        v-slot="{ isActive, navigate }"
      >
        <div
          @click="navigate"
          class="cursor-pointer capitalize rounded-base p-4 text-base font-medium flex-1 bg-primary-lighter text-primary text-center min-h-[60px] flex items-center justify-center"
          :class="{
              '!bg-primary !text-white': isActive
           }"
        >
          {{ name }}
        </div>
      </router-link>
    </div>
    <input-search v-model="search" @input-debounce="handleSearch"/>
    <a-button type="primary" ghost class="w-full min-h-[60px]" @click="handleAddGroup">
      <plus-circle-outlined/>
      Add new
    </a-button>
    <base-loading-skeleton v-if="isGetListGroupLoading"/>
    <a-empty v-else-if="!listGroup?.data?.length"/>
    <template v-else>
      <div class="space-y-4">
        <group-item
          v-for="(group, index) in listGroup?.data"
          :key="group?.id!"
          :name="`${index + 1}. ${group?.name!}`"
          @click="handleSelectGroup(group?.id!)"
          @edit="handleEditGroup(group)"
          @delete="handleDeleteGroup(group?.id!)"
          :class="{
            'active': currentGroupId === group?.id!
          }"
        />
      </div>
      <div class="flex justify-center mt-4">
        <a-pagination
          :current="listGroup?._meta?.currentPage"
          :total="listGroup?._meta?.totalCount"
          :page-size="listGroup?._meta?.perPage"
          :show-size-changer="false"
          show-less-items
          @change="handlePaginationChange"
        />
      </div>
    </template>

    <modal-edit-group
      ref="modalEditGroupRef"
      @success="handleGetListGroup"
    />
  </aside>
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue';
import InputSearch from "@/components/InputSearch.vue";
import {PlusCircleOutlined} from "@ant-design/icons-vue";
import GroupItem from './GroupItem.vue';
import ModalEditGroup from "./ModalEditGroup.vue";
import {useRootStore} from "@/stores/root";
import type {DataWithMetaResponse, GetListGroupResponse} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";
import BaseLoadingSkeleton from "@/components/base/BaseLoadingSkeleton.vue";
import {notification} from "ant-design-vue";
import {breakpointsTailwind, useBreakpoints} from "@vueuse/core";
import {useRouter, useRoute} from 'vue-router';

const router = useRouter();
const route = useRoute();

const currentGroupId = computed(() => Number(route.params.id));

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanMd = breakpoints.greater('md');

const rootStore = useRootStore();
const search = ref('');

const handleSelectGroup = (groupId: number) => {
  router.push({
    name: 'group-detail',
    params: {
      id: groupId,
    }
  })
}
const handleSelectFirstGroup = () => {
  const firstGroup = listGroup.value?.data[0];
  if (firstGroup) handleSelectGroup(firstGroup?.id!);
}

const listGroup = ref<DataWithMetaResponse<GetListGroupResponse> | null>(null);
const isGetListGroupLoading = ref(false);

const handleGetListGroup = async (page: number = 1, perPage = 10) => {
  try {
    isGetListGroupLoading.value = true;
    listGroup.value = await goCheckInSdk.group.getListGroup({
      page: page,
      'per-page': perPage,
      name: search.value,
    });
    if (largerThanMd.value) handleSelectFirstGroup();
  } catch (error) {
    handleError({error})
  } finally {
    isGetListGroupLoading.value = false;
  }
}
handleGetListGroup();

const handlePaginationChange = (page: number) => {
  handleGetListGroup(page)
};
const handleSearch = () => {
  handleGetListGroup()
};

const modalEditGroupRef = ref<InstanceType<typeof ModalEditGroup> | null>(null);
const handleAddGroup = async () => {
  modalEditGroupRef.value?.show();
}
const handleEditGroup = (group: GetListGroupResponse[number]) => {
  modalEditGroupRef.value?.show(group);
};
const handleDeleteGroup = async (groupId: number) => {
  try {
    await rootStore.confirm({
      headerTitle: 'Delete Customer from Group',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete these group?'
    });
    await goCheckInSdk.group.deleteGroup({id: groupId});
    handleGetListGroup();
    notification.success({
      message: 'Delete success'
    })
  } catch (error) {
    handleError({error})
  }
};

watch([() => route, largerThanMd], ([newRoute, isLargerThanMd]) => {
  if (newRoute.name === 'group' && isLargerThanMd) handleSelectFirstGroup();
});
</script>

