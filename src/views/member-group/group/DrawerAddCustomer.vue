<template>
  <a-drawer
    v-model:open="isVisible"
    title="Add new Customer to Group"
    placement="right"
    :width="560"
    :mask-closable="!isSubmitLoading"
    :closable="!isSubmitLoading"
  >
    <div class="max-h-full flex flex-col">
      <input-search v-model="search" @input-debounce="handleSearch" class="shrink-0 mt-1 mb-4"/>
      <div class="overflow-y-auto grow-1">
        <a-table
          class="custom-table row-transparent sticky-pagination"
          :columns="columns"
          :data-source="listCustomer?.data"
          row-key="id"
          :loading="isGetListCustomerLoading"
          sticky
          :pagination="{
           position: ['bottomCenter'],
           current: listCustomer?._meta?.currentPage,
           total: listCustomer?._meta?.totalCount,
           pageSize: listCustomer?._meta?.perPage,
           showSizeChanger: false,
        }"
          :row-selection="rowSelection"
          @change="handleTablePaginationChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'full_name'">
              {{ record?.full_name || 'N/A' }}
            </template>
            <template v-if="column.dataIndex === 'phone'">
              {{ usePhoneFormat(record?.phone) }}
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <template #footer>
      <a-button
        type="primary"
        @click="handleSubmit"
        :loading="isSubmitLoading"
        :disabled="!selectedRowKeys?.length"
      >
        Add selected
      </a-button>
      <a-button
        danger
        ghost
        @click="hide"
        :disabled="isSubmitLoading"
      >
        Cancel
      </a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
import {computed, ref, unref} from 'vue';
import InputSearch from "@/components/InputSearch.vue";
import handleError from "@/utils/error";
import {goCheckInSdk} from "@/sdk";
import type {DataWithMetaResponse, GetListCustomerToAddGroupResponse} from "gap-nodejs-sdk";
import {usePhoneFormat} from "@/utils/formatter";
import type {TableProps} from "ant-design-vue";
import {notification} from "ant-design-vue";

const isVisible = ref(false);

type Props = {
  groupId: null | number
}
const props = defineProps<Props>()

type Emit = {
  (e: 'success'): void
}
const emit = defineEmits<Emit>();
const show = () => {
  handleGetListCustomer();
  isVisible.value = true;
}
const hide = () => {
  isVisible.value = false;
}

const search = ref('');
const columns = [
  {
    title: 'CUSTOMER NAME',
    dataIndex: 'full_name',
    key: 'full_name',
  },
  {
    title: 'PHONE',
    dataIndex: 'phone',
    key: 'phone',
  },
];

const listCustomer = ref<DataWithMetaResponse<GetListCustomerToAddGroupResponse> | null>(null);
const isGetListCustomerLoading = ref(false);
const handleGetListCustomer = async (page = 1, perPage = 20) => {
  try {
    isGetListCustomerLoading.value = true;
    selectedRowKeys.value = [];
    listCustomer.value = await goCheckInSdk.group.getListCustomerToAddGroup({
      id: props.groupId,
      page: page,
      'per-page': perPage,
      keyword: search.value
    });
  } catch (error) {
    handleError({error})
  } finally {
    isGetListCustomerLoading.value = false;
  }
};
const handleSearch = () => {
  handleGetListCustomer();
};
const handleTablePaginationChange: TableProps["onChange"] = (pagination, filters, sorter) => {
  handleGetListCustomer(pagination.current)
};

const selectedRowKeys = ref<number[]>([]);
const handleSelectRow = (keys: number[]) => {
  selectedRowKeys.value = keys;
}
const rowSelection = computed(() => ({
  selectedRowKeys: unref(selectedRowKeys),
  onChange: handleSelectRow,
}));

const isSubmitLoading = ref(false);
const handleSubmit = async () => {
  try {
    isSubmitLoading.value = true;
    await goCheckInSdk.group.updateGroup({
      id: props.groupId,
      customer_ids: selectedRowKeys.value.join(','),
    });
    emit('success');
    hide();
    notification.success({
      message: 'Add customers success'
    });
  } catch (error) {
    handleError({error})
  } finally {
    isSubmitLoading.value = false;
  }
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>

</style>
