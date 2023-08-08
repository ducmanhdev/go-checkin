import {defineStore} from 'pinia';
import {goCheckInSdk} from '@/sdk';
import type {
  GetNotifyAppointmentRequest,
  GetNotifyAppointmentResponse,
  GetNotifySystemRequest,
  GetNotifySystemResponse,
  MaskAsReadRequest
} from "gap-nodejs-sdk";

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    listNotifyAppointment: null as GetNotifyAppointmentResponse | null,
    listNotifySystem: null as GetNotifySystemResponse | null,
  }),
  getters: {
    unreadNotifyAppointmentCount: state => state.listNotifyAppointment?.filter(notify => notify?.is_read === 0)?.length || 0,
  },
  actions: {
    getNotifyAppointment(query: GetNotifyAppointmentRequest) {
      return new Promise<null>(async (resolve, reject) => {
        try {
          this.listNotifyAppointment = await goCheckInSdk.notification.getNotifyAppointment(query);
          resolve(null);
        } catch (error) {
          reject();
        }
      })
    },
    getNotifySystem(query: GetNotifySystemRequest) {
      return new Promise<null>(async (resolve, reject) => {
        try {
          this.listNotifySystem = await goCheckInSdk.notification.getNotifyAppointment(query);
          resolve(null);
        } catch (error) {
          reject();
        }
      })
    },
    getNotify(query= {page: 1, 'per-page': 20}) {
      return new Promise<null>(async (resolve, reject) => {
        try {
          const [getNotifyAppointmentRes, getNotifySystemRes] = await Promise.allSettled([
            goCheckInSdk.notification.getNotifyAppointment(query),
            goCheckInSdk.notification.getNotifySystem(query),
          ]);
          if(getNotifyAppointmentRes.status === 'fulfilled') this.listNotifyAppointment = getNotifyAppointmentRes.value.data;
          if(getNotifySystemRes.status === 'fulfilled') this.listNotifySystem = getNotifySystemRes.value.data;
          resolve(null);
        } catch (error) {
          reject(error);
        }
      })
    },
    maskAsRead(data: MaskAsReadRequest) {
      return new Promise<null>(async (resolve, reject) => {
        try {
          await goCheckInSdk.notification.maskAsRead(data);
          resolve(null);
        } catch (error) {
          reject();
        }
      })
    },
  }
});
