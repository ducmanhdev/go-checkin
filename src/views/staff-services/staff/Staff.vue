<template>
  <section class="grid grid-cols-1 md:grid-cols-[276px_1fr] xl:grid-cols-[332px_1fr] gap-4 xl:gap-7 min-h-full">
    <aside class="shadow rounded-base bg-white text-black pb-5 md:grid md:grid-rows-[auto_1fr]">
      <div class="md:px-4">
        <div class="md:min-h-[66px] py-2 border-b flex justify-between items-center gap-3 px-3 md:px-0">
          <p class="max-md:text-lg heading-1 mb-0">Staff</p>
          <plus-square-filled
            class="cursor-pointer text-3xl !text-[color:var(--color-C128)]"
            @click="handleOpenCreateStaff"
          />
        </div>
        <div class="p-3 md:px-0">
          <div class="relative">
            <a-dropdown placement="bottomRight" :trigger="['click']" overlay-class-name="!min-w-0">
              <div class="relative">
                <input
                  v-model="searchStaffKeyWords"
                  @click.stop
                  type="text"
                  class="appearance-none rounded-3xl border border-transparent text-A4 w-full h-[34px] text-sm outline-none pl-[34px] pr-4 transition bg-[url('@/assets/images/icon-search.svg')] bg-no-repeat bg-[left_10px_center] shadow-[0_0_4px_0_rgba(0,0,0,0.15)] focus:border-primary focus:shadow-none"
                  placeholder="Search ...">
                <div
                  class="cursor-pointer w-5 h-5 flex items-center justify-center absolute top-1/2 right-4 -translate-y-1/2 text-primary"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3337 2.5H1.66699L8.33366 10.3833V15.8333L11.667 17.5V10.3833L18.3337 2.5Z"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
              <template #overlay>
                <a-menu v-model:selected-keys="filterSelected" @click="handleSelectFilter">
                  <a-menu-item v-for="item in filterList" :key="item.key">{{ item.text }}</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </div>
      <div
        class="relative min-h-[250px]"
        :class="{
        'c-loading': isSortListStaffLoading,
        'px-4': isGetListStaffLoading
      }"
      >
        <a-skeleton
          active
          :loading="isGetListStaffLoading"
          :paragraph="{rows: 10}"
        >
          <draggable
            v-if="listStaff?.length"
            v-model="listStaff"
            @end="handleSortListStaff"
            handle=".drag-button"
            item-key="user_id"
            class="sm:absolute sm:inset-0 sm:overflow-auto"
          >
            <transition-group name="list">
              <staff-item
                v-for="staff in listStaff"
                :key="staff?.user_id"
                :name="staff?.name"
                :color-code="staff?.color_code"
                :image-url="staff?.image_url"
                :status="staff?.status"
                :is-active="staffSelected.user_id === staff?.user_id"
                @click="staffSelected = staff"
              />
            </transition-group>
          </draggable>
          <div class="text-center italic" v-else>Empty staff</div>
        </a-skeleton>
      </div>
    </aside>
    <div
      class="shadow md:shadow-none rounded-base md:rounded-none bg-white md:bg-transparent text-black md:text-inherit grid-cols-1 grid grid-rows-[auto_1fr]">
      <div
        class="md:min-h-[66px] py-2 border-b flex items-center justify-between gap-3 px-3 md:px-0">
        <p class="max-md:text-lg heading-1 mb-0">{{ isEdit ? 'Configuration' : 'Staff information' }}</p>
        <a-button
          type="primary"
          danger
          v-if="!isEdit && staffSelected"
          @click="handleDeleteStaff"
          :loading="isDeleteStaffLoading"
          class="sm-mobile"
        >
          Delete staff
        </a-button>
      </div>
      <div class="p-3 md:px-0">
        <template v-if="staffSelected">
          <a-tabs v-if="isEdit" v-model:activeKey="activeEditTab" class="custom-tabs">
            <a-tab-pane key="Commission" tab="Commission">
              <edit-commission
                :loading="isGetListCommissionByStaffLoading"
                :staff-id="staffSelected?.user_id"
                @back="handleHideEdit"
                @reload-commission="handleReloadEditCommission('commission')"
              >
              </edit-commission>
            </a-tab-pane>
            <a-tab-pane key="Salary + Commission" tab="Salary + Commission">
              <edit-salary-commission
                :loading="isGetListCommissionByStaffLoading"
                :staff-id="staffSelected?.user_id"
                @back="handleHideEdit"
                @reload-commission="handleReloadEditCommission('salary_commission')"
              >
              </edit-salary-commission>
            </a-tab-pane>
            <a-tab-pane key="Salary" tab="Salary">
              <edit-salary
                :loading="isGetListCommissionByStaffLoading"
                :staff-id="staffSelected?.user_id"
                @back="handleHideEdit"
                @reload-commission="handleReloadEditCommission('salary')"
              >
              </edit-salary>
            </a-tab-pane>
          </a-tabs>
          <a-tabs v-else v-model:activeKey="activeInfoTab" class="custom-tabs h-full grid grid-rows-[auto_1fr]">
            <a-tab-pane key="Information" tab="Information">
              <information
                :staff-info="staffSelected"
                :is-get-list-commission-by-staff-loading="isGetListCommissionByStaffLoading"
                @update-staff="handleOpenUpdateStaff(staffSelected)"
                @update-commission="handleShowEdit"
                @reload-role-appointment="handleReloadRoleAppointment"
                @reload-commission-type="handleReloadCommissionType"
              >
              </information>
            </a-tab-pane>
            <a-tab-pane key="Services" tab="Services" class="h-full">
              <services :staff-id="staffSelected?.user_id"></services>
            </a-tab-pane>
            <a-tab-pane key="Working hours" tab="Working hours">
              <working-hours :staff-id="staffSelected?.user_id"></working-hours>
            </a-tab-pane>
          </a-tabs>
        </template>
        <a-empty v-else/>
      </div>
    </div>
    <create-staff ref="createStaffRef" @get-list-staff="handleGetListStaff"/>
  </section>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import StaffItem from "@/views/staff-services/staff/StaffItem.vue";
import Information from "./Information.vue";
import EditSalary from "./EditSalary.vue";
import EditCommission from "./EditCommission.vue";
import EditSalaryCommission from "./EditSalaryCommission.vue";
import CreateStaff from "./CreateStaff.vue";
import Services from "./Services.vue";
import WorkingHours from "./WorkingHours.vue";
import {useRootStore} from "@/stores/root";
import {useStaffStore} from "@/stores/staff";
import {notification} from "ant-design-vue";
import type {GetListStaffResponse} from "gap-nodejs-sdk";
import handleError from "@/utils/error";
import {VueDraggableNext as draggable} from 'vue-draggable-next';
import {PlusSquareFilled} from "@ant-design/icons-vue";

const rootStore = useRootStore();
const staffStore = useStaffStore();
const {getListStaff, sortStaff, deleteStaff, updateStaffCommission, getListCommissionByStaff} = staffStore;

const filterList = ref([
  {
    text: 'All',
    key: null
  },
  {
    text: 'Active',
    key: 1
  },
  {
    text: 'Inactive',
    key: 0
  }
]);
const filterSelected = ref<any[]>([filterList.value[0].key]);
const handleSelectFilter = ({key}: { key: null }) => {
  filterSelected.value = [key];
}

const listStaff = ref<GetListStaffResponse>([]);
const staffSelected = ref<any>(null);
const isGetListStaffLoading = ref(false);
const handleGetListStaff = async () => {
  try {
    isGetListStaffLoading.value = true;
    await getListStaff({
      page: 1,
      'per-page': 100,
      sort: 'user_id',
      status: filterSelected.value[0]
    });
    listStaff.value = staffStore.listStaff?.data || [];
    const listStaffContainsStaffSelected = listStaff.value.find((staff: any) => staff?.user_id === staffSelected.value?.user_id);
    if (!listStaffContainsStaffSelected) staffSelected.value = listStaff.value[0];
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListStaffLoading.value = false;
  }
};
watch(filterSelected, handleGetListStaff, {immediate: true});

const isSortListStaffLoading = ref(false);
const handleSortListStaff = async () => {
  try {
    isSortListStaffLoading.value = true;
    await sortStaff({
      employees: listStaff.value.map((item: any) => item?.user_id).join(','),
    });
    notification.success({
      message: 'Sort list staff success!',
    })
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isSortListStaffLoading.value = false;
  }
}

const searchStaffKeyWords = ref('');
watch(searchStaffKeyWords, (newKeywords: string) => {
  if (newKeywords === '') {
    listStaff.value = staffStore.listStaff?.data || [];
  } else {
    listStaff.value = (staffStore.listStaff?.data || []).filter((item: any) => item.name.toLowerCase().includes(newKeywords.toLowerCase()))
    staffSelected.value = listStaff.value[0]
  }
});

const activeInfoTab = ref('Information');
const activeEditTab = ref('Commission');
const isEdit = ref(false);
const handleShowEdit = () => {
  isEdit.value = true;
};
const handleHideEdit = () => {
  isEdit.value = false;
};

const createStaffRef = ref<InstanceType<typeof CreateStaff> | null>(null);
const handleOpenCreateStaff = () => {
  createStaffRef.value?.show();
}
const handleOpenUpdateStaff = (staffData: GetListStaffResponse[number]) => {
  createStaffRef.value?.show(staffData);
}
const isDeleteStaffLoading = ref(false);
const handleDeleteStaff = async () => {
  try {
    await rootStore.confirm({
      headerTitle: 'Delete Staff',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to delete this staff?'
    });
    isDeleteStaffLoading.value = true;
    await deleteStaff({
      id: staffSelected.value?.user_id,
    });
    notification.success({
      message: 'Delete staff success!',
    })
    handleGetListStaff();
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isDeleteStaffLoading.value = false;
  }
}

const isGetListCommissionByStaffLoading = ref(false);
const handleGetListCommissionByStaff = async () => {
  try {
    if (!staffSelected.value?.user_id) return;
    isGetListCommissionByStaffLoading.value = true;
    await getListCommissionByStaff({staff_id: staffSelected.value.user_id});
  } catch (error) {
    handleError({
      error: error
    })
  } finally {
    isGetListCommissionByStaffLoading.value = false;
  }
};

type CommissionType = 'commission' | 'salary_commission' | 'salary';
const handleReloadCommissionType = async (_commissionType: CommissionType) => {
  try {
    await updateStaffCommission({
      id: staffSelected.value?.user_id,
      staff_code: staffSelected.value.code,
      commission_type: _commissionType,
    } as any);
    const staffSelectedIndex = listStaff.value.findIndex((item: any) => item.user_id === staffSelected.value.user_id);
    if (staffSelectedIndex !== -1) {
      (listStaff.value[staffSelectedIndex] as any).commission_type = _commissionType;
    }
  } catch (error) {
    handleError({
      error: error
    })
  }
};
const handleReloadEditCommission = (_commissionType: CommissionType) => {
  handleGetListCommissionByStaff();
  handleReloadCommissionType(_commissionType)
};
const handleReloadRoleAppointment = async (newRoleAppointment: number) => {
  const staffSelectedIndex = listStaff.value.findIndex((item: any) => item.user_id === staffSelected.value.user_id);
  if (staffSelectedIndex !== -1) {
    (listStaff.value[staffSelectedIndex] as any).booking_active = newRoleAppointment;
  }
};
watch(staffSelected, () => {
  isEdit.value = false;
  activeInfoTab.value = 'Information';
  activeEditTab.value = 'Commission';
  handleGetListCommissionByStaff();
}, {immediate: true, deep: true});
</script>

<style lang="scss" scoped>
:deep {
  @media (max-width: 768px) {
    .custom-tabs {
      .ant-tabs-nav-list {
        flex-wrap: wrap;
        gap: 4px;

        .ant-tabs-tab {
          flex: 0 0 auto;
          font-size: 14px;
          font-weight: 500;
          padding: 6px 16px;
          border-radius: 4px;

          &:not(.ant-tabs-tab-active) {
            background-color: #929292;
            color: #fff;
          }
        }

        //.ant-tabs-tab-btn{
        //  font-size: 0.75rem;
        //}
      }
    }
  }
}
</style>
