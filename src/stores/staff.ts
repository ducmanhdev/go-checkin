import {defineStore} from 'pinia';
import {goCheckInSdk, posSdk} from "@/sdk";

import type {
  GetListStaffResponse,
  GetStaffWorkHourResponse,
  GetListPermissionResponse,
  GetListCommissionByStaffResponse,
  GetListServiceByStaffResponse,
  DataWithMetaResponse,
  GetListStaffRequest,
  CreateStaffRequest,
  UpdateStaffRequest,
  DeleteStaffRequest,
  SortStaffRequest,
  GetStaffWorkHourRequest,
  UpdateStaffWorkHourRequest,
  GetListServiceByStaffRequest,
  AddListServiceByStaffRequest,
  DeleteListServiceByStaffRequest,
  GetListPermissionRequest,
  GetListCommissionByStaffRequest,
  SaveCommissionRequest,
  UpdateStaffCommissionRequest,
  UpdateRoleAppointmentRequest,
  GetCheckInListCategoryResponse,
  GetCheckInListByCategoryResponse,
  CreateCheckInCategoryRequest,
  GetCheckInListCategoryRequest,
  ShortCheckInCategoryRequest,
  UpdateCheckInCategoryRequest,
  DeleteCheckInCategoryRequest, GetCheckInListByCategoryRequest
} from "gap-nodejs-sdk";

export const useStaffStore = defineStore('staffStore', {
  state: () => ({
    listCategory: [] as GetCheckInListCategoryResponse,
    listByCategory: {} as DataWithMetaResponse<GetCheckInListByCategoryResponse>,
    listStaff: {} as DataWithMetaResponse<GetListStaffResponse>,
    staffWorkHour: {} as GetStaffWorkHourResponse,
    listPermission: [] as GetListPermissionResponse,
    listCommission: {} as GetListCommissionByStaffResponse,
    listServiceByStaff: [] as GetListServiceByStaffResponse
  }),
  actions: {
    getListCategory(data?: GetCheckInListCategoryRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.listCategory = await goCheckInSdk.category.getCheckInListCategory(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    sortCategory(data?: ShortCheckInCategoryRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.category.sortCheckInCategory(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    createCategory(data?: CreateCheckInCategoryRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.category.createCheckInCategory(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateCategory(data?: UpdateCheckInCategoryRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.category.updateCheckInCategory(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    deleteCategory(data?: DeleteCheckInCategoryRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.category.deleteCheckInCategory(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    getListByCategory(data?: GetCheckInListByCategoryRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.listByCategory = await goCheckInSdk.service.getCheckInListByCategory(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    getListStaff(data?: GetListStaffRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.listStaff = await goCheckInSdk.staff.getListStaff(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    createStaff(data?: CreateStaffRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.createStaff(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateStaff(data?: UpdateStaffRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.updateStaff(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    deleteStaff(data?: DeleteStaffRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.deleteStaff(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    sortStaff(data?: SortStaffRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.sortStaff(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    getStaffWorkHour(data?: GetStaffWorkHourRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.staffWorkHour = await goCheckInSdk.staff.getStaffWorkHour(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateStaffWorkHour(data?: UpdateStaffWorkHourRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.updateStaffWorkHour(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    getListServiceByStaff(data?: GetListServiceByStaffRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.listServiceByStaff = await goCheckInSdk.staff.getListServiceByStaff(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    addListServiceByStaff(data?: AddListServiceByStaffRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.addListServiceByStaff(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    deleteListServiceByStaff(data?: DeleteListServiceByStaffRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.deleteListServiceByStaff(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    getListPermission(data?: GetListPermissionRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.listPermission = await goCheckInSdk.staff.getListPermission(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    getListCommissionByStaff(data?: GetListCommissionByStaffRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.listCommission = await posSdk.commission.getListCommissionByStaff(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    saveCommission(data?: SaveCommissionRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.saveCommission(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateStaffCommission(data?: UpdateStaffCommissionRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.updateStaffCommission(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateRoleAppointment(data?: UpdateRoleAppointmentRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.staff.updateRoleAppointment(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
  }
});
