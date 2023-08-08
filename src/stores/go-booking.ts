import {defineStore} from 'pinia';
import type {
    GetBusinessWorkHourRequest,
    GetBusinessWorkHourResponse,
    GetSMSContentResponse,
    UpdateBusinessWorkHourRequest,
    GetSMSContentRequest,
    UpdateSMSContentRequest,
    GetListBusinessTimeOffRequest,
    AddBusinessTimeOffRequest, UpdateBusinessTimeOffRequest, DeleteBusinessTimeOffRequest, GetListStaffRequest
} from "gap-nodejs-sdk";
import {goCheckInSdk, appointmentSdk} from "@/sdk";

export const useGoBookingStore = defineStore('goBookingStore', {
    state: () => ({
        businessWorkHour: {} as GetBusinessWorkHourResponse,
        smsContent: {} as GetSMSContentResponse,
        listBusinessTimeOff: [] as any,
        listStaff: [] as any,
    }),
    actions: {
        getBusinessWorkHour(params?: GetBusinessWorkHourRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.businessWorkHour = await goCheckInSdk.settings.getBusinessWorkHour(params);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        updateBusinessWorkHour(data?: UpdateBusinessWorkHourRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await goCheckInSdk.settings.updateBusinessWorkHour(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        getSMSContent(data?: GetSMSContentRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    this.smsContent = await appointmentSdk.settings.getSMSContent(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        updateSMSContent(data?: UpdateSMSContentRequest): Promise<void> {
            return new Promise(async (resolve, reject) => {
                try {
                    await appointmentSdk.settings.updateSMSContent(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        },
        getListBusinessTimeOff({page = 1, 'per-page': perPage = 5}: GetListBusinessTimeOffRequest) {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await appointmentSdk?.appointment?.getListBusinessTimeOff({
                        filterType: 1,
                        'per-page': perPage,
                        page,
                    })
                    this.listBusinessTimeOff = response;
                    resolve(response);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            })
        },
        addBusinessTimeOff(data: AddBusinessTimeOffRequest) {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await appointmentSdk?.appointment?.addBusinessTimeOff(data)
                    resolve(response)
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            })
        },
        updateBusinessTimeOff(data: UpdateBusinessTimeOffRequest) {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await appointmentSdk?.appointment?.updateBusinessTimeOff(data);
                    resolve(response)
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            })
        },
        deleteBusinessTimeOff(data: DeleteBusinessTimeOffRequest) {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await appointmentSdk?.appointment?.deleteBusinessTimeOff(data);
                    resolve(response)
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            })
        },
        getListStaff(params?: GetListStaffRequest) {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await goCheckInSdk.staff.getListStaff(params);
                    this.listStaff = response;
                    resolve(response)
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            })
        },
    },
})
