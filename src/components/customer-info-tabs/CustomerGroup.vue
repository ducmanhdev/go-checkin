<template>
  <a-table
    class="custom-table font-medium -mt-4"
    :columns="columns"
    :data-source="customerGroup?.data"
    :show-header="false"
    :row-selection="rowSelection"
    :loading="isGetCustomerGroupLoading || isGetCustomerInfoLoading || isUpdateListGroup"
    row-key="id"
    :pagination="{
       position: ['bottomCenter'],
       current: customerGroup?._meta?.currentPage,
       total: customerGroup?._meta?.totalCount,
       pageSize: customerGroup?._meta?.perPage,
       showSizeChanger: false,
    }"
    @change="handleTablePaginationChange"
  />
</template>

<script setup lang="ts">
import {computed, ref, unref, watch} from 'vue';
import {notification, Table} from 'ant-design-vue';
import type {TableProps} from 'ant-design-vue';
import type {
  DataWithMetaResponse, GetCustomerResponse,
  GetListGroupResponse
} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";

type Props = {
  customerId: number;
}

const props = defineProps<Props>();

const columns = [
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    align: 'left'
  },
  Table.SELECTION_COLUMN
];

const selectedRowKeys = ref<number[]>([]);
const handleSelectRow = (keys: number[]) => {
  handleUpdateListGroup(keys);
}
const rowSelection = computed(() => ({
  selectedRowKeys: unref(selectedRowKeys),
  onChange: handleSelectRow,
}));

const customerGroup = ref<DataWithMetaResponse<GetListGroupResponse> | null>(null);
const isGetCustomerGroupLoading = ref(false);

const isGetCustomerInfoLoading = ref(false);
const handleGetCustomerInfo = async () => {
  try {
    if (!props.customerId && props.customerId !== 0) return;
    isGetCustomerInfoLoading.value = true;
    const res: GetCustomerResponse = await goCheckInSdk.customer.getCustomer({
      id: props.customerId,
    });
    selectedRowKeys.value = (res?.groups || []).map((group) => group.group_id);
  } catch (error) {
    handleError({error});
  } finally {
    isGetCustomerInfoLoading.value = false;
  }
};
const handleGetCustomerGroup = async (page = 1, perPage = 10) => {
  try {
    if (!props.customerId) return;
    isGetCustomerGroupLoading.value = true;
    customerGroup.value = await goCheckInSdk.group.getListGroup({
      id: props.customerId,
      page: page,
      'per-page': perPage,
    });
  } catch (error) {
    handleError({error});
  } finally {
    isGetCustomerGroupLoading.value = false;
  }
};

watch(() => props.customerId, () => {
  handleGetCustomerInfo();
  handleGetCustomerGroup();
}, {
  immediate: true,
});
const handleTablePaginationChange: TableProps["onChange"] = (pagination, filters, sorter) => {
  handleGetCustomerGroup(pagination.current)
};

const isUpdateListGroup = ref(false);
const handleUpdateListGroup = async (keys: number[]) => {
  try {
    if (!props.customerId && props.customerId !== 0) return;
    isUpdateListGroup.value = true;
    await goCheckInSdk.customer.updateListGroup({
      customer_id: props.customerId,
      group_ids: keys.join(','),
    });
    handleGetCustomerInfo();
    notification.success({
      message: 'Update success'
    });
  } catch (error) {
    handleError({error});
  } finally {
    isUpdateListGroup.value = false;
  }
};
</script>

<style scoped>

</style>
