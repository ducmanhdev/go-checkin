<template>
  <div class="md:grid lg:grid-cols-[6fr_5fr] xl:grid-cols-[7fr_3fr] gap-4 md:gap-5 xl:gap-[38px]">
    <section class="mb-8 lg:mb-0">
      <div class="lg:min-h-[46px] mb-2 lg:mb-6 flex items-center">
        <h2 class="heading-1 mb-0">Ticket Template</h2>
      </div>
      <div>
        <p class="font-medium text-C62 mb-4">Ticket Template</p>
        <a-skeleton
          active
          :title="false"
          :paragraph="{rows: 20}"
          :loading="!ticketInfo && isGetTicketInfoLoading"
        >
          <transition-group
            tag="ul"
            name="list"
            class="space-y-3 sm:space-y-4 mb-0 relative child:min-h-[38px] child:md:min-h-[46px]"
            v-if="ticketInfo?.items?.length"
            :class="{
              'c-loading': isGetTicketInfoLoading || isMoveLoading
            }"
          >
            <li
              v-for="(template, index) in ticketInfo?.items"
              :key="template.id!"
              class="box grid grid-cols-[7fr_3fr] items-center gap-3">
              <div class="line-clamp-3">{{ index + 1 }}. {{ template.name }}</div>
              <div class="flex items-center justify-end space-x-2 text-secondary">
                <arrow-up-outlined class="hover:!text-primary" @click="handleMove(template.id!, 'up')"/>
                <arrow-down-outlined class="hover:!text-primary" @click="handleMove(template.id!, 'down')"/>
                <delete-outlined class="hover:!text-primary" @click="handleDelete(template.id!)"/>
              </div>
            </li>
            <li
              :key="-1"
              class="box text-lg md:text-2xl text-primary flex items-center justify-center cursor-pointer transition hover:bg-primary hover:text-white"
              @click="handleOpenAddTicket">
              <plus-outlined/>
            </li>
          </transition-group>
          <a-empty v-else/>
        </a-skeleton>
      </div>
    </section>
    <aside class="flex flex-col">
      <div
        class="lg:min-h-[46px] flex flex-wrap items-center justify-between gap-2 mb-4 lg:mb-[60px]">
        <h3 class="heading-1">Ticket Review</h3>
        <a-button
          class="secondary sm-mobile"
          type="primary"
          :disabled="isRestoreDefaultTemplateLoading"
          @click="handleRestoreDefaultTemplate"
        >
          {{ isRestoreDefaultTemplateLoading ? 'Restoring...' : 'Restore default' }}
        </a-button>
      </div>
      <div class="bg-white text-black p-4 md:p-5 rounded-base border grow">
        <a-skeleton active :loading="isGetTicketInfoLoading" :paragraph="{ rows: 10 }">
          <div v-html="ticketInfo?.template_text"></div>
        </a-skeleton>
      </div>
    </aside>

    <add-ticket-modal
      ref="addTicketModalRef"
      :ticket-list-block-name="ticketListBlockName"
      @add-ticket-success="handleGetTicketInfo"
    />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import AddTicketModal from "./AddTicketModal.vue";
import {useRootStore} from "@/stores/root";
import {notification} from 'ant-design-vue';
import handleError from "@/utils/error";
import {DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, PlusOutlined} from "@ant-design/icons-vue";
import type {GetCheckInTicketInfoResponse, GetCheckInTicketListBlockNameResponse} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";

const rootStore = useRootStore();
const addTicketModalRef = ref<InstanceType<typeof AddTicketModal> | null>(null);

const ticketInfo = ref<GetCheckInTicketInfoResponse | null>(null);
const isGetTicketInfoLoading = ref(false);
const handleGetTicketInfo = async () => {
  try {
    isGetTicketInfoLoading.value = true;
    ticketInfo.value = await goCheckInSdk.ticket.getCheckInTicketInfo();
  } catch (error) {
    handleError({error})
  } finally {
    isGetTicketInfoLoading.value = false;
  }
}
handleGetTicketInfo();

const ticketListBlockName = ref<GetCheckInTicketListBlockNameResponse | null>(null);
const isGetTicketBlockNameLoading = ref(false);
const handleGetTicketListBlockName = async () => {
  try {
    isGetTicketBlockNameLoading.value = true;
    ticketListBlockName.value = await goCheckInSdk.ticket.getCheckInTicketListBlockName();
  } catch (error) {
    handleError({error});
  } finally {
    isGetTicketBlockNameLoading.value = false;
  }
};
handleGetTicketListBlockName();

const handleOpenAddTicket = () => {
  addTicketModalRef.value?.show()
};

const isRestoreDefaultTemplateLoading = ref(false);
const handleRestoreDefaultTemplate = async () => {
  try {
    isRestoreDefaultTemplateLoading.value = true;
    await rootStore.confirm({
      headerTitle: 'Restore Default Template',
      bodyTitle: 'Oh no!',
      bodyMessage: 'Do you want to restore default for this template?'
    })
    await goCheckInSdk.ticket.setCheckInDefaultTicketTemplate();
    handleGetTicketInfo();
    notification.success({
      message: 'Success',
      description: 'Restore default ticket template success',
    });
  } catch (error) {
    handleError({error})
  } finally {
    isRestoreDefaultTemplateLoading.value = false;
  }
};

const isMoveLoading = ref(false);
const handleMove = async (id: number, action: 'up' | 'down') => {
  try {
    isMoveLoading.value = true;
    await goCheckInSdk.ticket.moveCheckInSubject({
      id: id,
      action: action,
    });
    handleGetTicketInfo();
  } catch (error) {
    handleError({error});
  } finally {
    isMoveLoading.value = false;
  }
}
const handleDelete = async (id: number) => {
  try {
    await rootStore.confirm({
      headerTitle: 'Delete Template',
      bodyTitle: 'Do you want to restore default for this template?',
    });
    await goCheckInSdk.ticket.deleteCheckInTicketTemplate({id});
    handleGetTicketInfo();
    notification.success({
      message: 'Delete ticket template success',
    });
  } catch (error) {
    handleError({error})
  }
}
</script>

<style lang="scss" scoped>
</style>
