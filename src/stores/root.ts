import {defineStore} from 'pinia';
import type {ConfirmPayload} from "@/types";

export const useRootStore = defineStore('rootStore', {
  state: () => ({
    confirmPayload: null as null | ConfirmPayload & {
      resolve: Resolve,
      reject: Reject,
    },
  }),
  actions: {
    confirm(payload: ConfirmPayload) {
      return new Promise((resolve, reject) => {
        this.confirmPayload = {
          ...payload,
          resolve,
          reject,
        }
      })
    },
    resetConfirm() {
      this.confirmPayload = null;
    },
  }
});
