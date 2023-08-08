import {defineStore} from 'pinia';
import {goCheckInSdk, posSdk} from "@/sdk";

import type {
  CreateCheckInCategoryRequest,
  CreateCheckInServiceRequest,
  CreateComboRequest,
  CreatePosProductRequest,
  DataWithMetaResponse,
  DeleteCheckInCategoryRequest,
  DeleteCheckInServiceRequest,
  DeleteComboRequest,
  DeletePosProductRequest,
  GetCheckInListByCategoryRequest,
  GetCheckInListByCategoryResponse,
  GetCheckInListCategoryRequest,
  GetCheckInListCategoryResponse,
  GetCheckInListServiceRequest,
  GetCheckInListServiceResponse,
  GetComboSiteListRequest,
  GetComboSiteListResponse,
  GetPosListProductRequest,
  GetPosListProductResponse,
  ShortCheckInCategoryRequest,
  ShortCheckInServiceRequest,
  SortComboRequest,
  SortPostListProductRequest,
  UpdateCheckInCategoryRequest,
  UpdateCheckInServiceRequest,
  UpdateComboRequest,
  UpdatePosProductRequest,
  UploadFileRequest

} from "gap-nodejs-sdk";

export const useServiceStore = defineStore('serviceStore', {
  state: () => ({
    listCategory: [] as GetCheckInListCategoryResponse,
    listByCategory: {} as DataWithMetaResponse<GetCheckInListByCategoryResponse>,
    listService: [] as GetCheckInListServiceResponse,
    listProduct: [] as GetPosListProductResponse,
    listCombo: {} as DataWithMetaResponse<Array<GetComboSiteListResponse>>,
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
    getListService(data?: GetCheckInListServiceRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.listService = await goCheckInSdk.service.getCheckInListService(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    sortService(data?: ShortCheckInServiceRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.service.sortCheckInService(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    createService(data?: CreateCheckInServiceRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.service.createCheckInService(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateService(data?: UpdateCheckInServiceRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.service.updateCheckInService(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    deleteService(data?: DeleteCheckInServiceRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await goCheckInSdk.service.deleteCheckInService(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    uploadFile(data?: UploadFileRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          const response = await posSdk.service.uploadFile(data);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    },
    getListProduct(data?: GetPosListProductRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.listProduct = await posSdk.product.getPosListProduct(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    createProduct(data?: CreatePosProductRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await posSdk.product.createPosProduct(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateProduct(data?: UpdatePosProductRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await posSdk.product.updatePosProduct(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    deleteProduct(data?: DeletePosProductRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await posSdk.product.deletePosProduct(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    sortProduct(data?: SortPostListProductRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await posSdk.product.sortPostListProduct(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    getComboSiteList(data?: GetComboSiteListRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          this.listCombo = await posSdk.combo.getComboSiteList(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    createCombo(data?: CreateComboRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await posSdk.combo.createCombo(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    updateCombo(data?: UpdateComboRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await posSdk.combo.updateCombo(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    deleteCombo(data?: DeleteComboRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await posSdk.combo.deleteCombo(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    sortCombo(data?: SortComboRequest): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          await posSdk.combo.sortCombo(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
  }
});
