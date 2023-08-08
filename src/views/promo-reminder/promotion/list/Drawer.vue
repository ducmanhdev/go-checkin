<template>
  <a-drawer
    v-model:open="isVisible"
    title="Add New Promotion"
    placement="right"
    :width="560"
    @close="handleResetState"
    :mask-closable="!isSubmitLoading"
    :closable="!isSubmitLoading"
  >
    <a-form
      autocomplete="off"
      layout="vertical"
      hide-required-mark
    >
      <a-form-item
        name="name"
        v-bind="validateInfos.name"
        label="What to offer?"
      >
        <p>To be Redeemed at Check Out!</p>
        <a-input
          v-model:value="formModel.name"
        />
      </a-form-item>
      <a-form-item
        name="logic_value"
        v-bind="validateInfos.logic_value"
        label="How much to offer?"
      >
        <div class="grid grid-cols-2 items-center gap-3">
          <div class="flex justify-center">
            <quantity
              v-model="formModel.logic_value"
              :max="formModel.logic_type === 'percent' ? 100 : undefined"
              class="!w-[160px]"
            />
          </div>
          <div class="flex justify-center">
            <a-radio-group
              v-model:value="formModel.logic_type"
              name="valueType"
              class="!flex flex-wrap gap-x-4 md:gap-x-7 gap-y-4"
              :options="listLogicType"
            />
          </div>
        </div>
      </a-form-item>
      <a-form-item
        name="groups"
        v-bind="validateInfos.groups"
        label="Who to offer?"
      >
        <a-checkbox-group
          class="!grid grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-4"
          v-model:value="formModel.groups"
          :options="campaignPromotionGroup"
        />
      </a-form-item>
      <a-form-item
        name="email_subject"
        v-bind="validateInfos.email_subject"
        label="What is your Email title?"
      >
        <p>This will be seen by your customers on their email!</p>
        <a-input
          v-model:value="formModel.email_subject"
        />
      </a-form-item>
      <a-form-item
        name="business_name"
        v-bind="validateInfos.business_name"
        label="Business Name"
        class="!mb-1"
      >
        <a-input
          v-model:value="formModel.business_name"
          @change="handleInputBusinessName"
        />
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-model:checked="isSaveBusinessName"
        >
          Save this business name for next time
        </a-checkbox>
      </a-form-item>
      <a-form-item
        name="content"
        v-bind="validateInfos.content"
        label="Message to show to customer"
        class="!mb-1"
      >
        <p>Don't forget to input your phone number in the message.</p>
        <a-textarea
          class="!h-[100px]"
          :value="formModel.content"
          @change="handleInputContent"
          show-count
          minlength="10"
          :maxlength="contentMaxLength"
        />
      </a-form-item>
      <a-form-item
        name="is_sent_opt_out"
        v-bind="validateInfos.is_sent_opt_out"
        :extra="
        isRequireOptOut
         ? 'You have removed this message for 3 continuous promotion campaign, so it\'s required this time in order to avoid any issues of spam and unsolicited messages. You may remove this next time\''
         : ''"
        class="!mb-0"
      >
        <a-checkbox
          :checked="formModel.is_sent_opt_out === 1"
          @change="handleChangeOpt"
          :disabled="isRequireOptOut"
        >
          Reply STOP to opt out
        </a-checkbox>
      </a-form-item>
      <a-form-item
        name="is_show_exp"
        v-bind="validateInfos.is_show_exp"
      >
        <a-checkbox
          :checked="formModel.is_show_exp === 1"
          @change="handleChangeExp"
        >
          Exp: xx/xx/xx
        </a-checkbox>
      </a-form-item>
      <a-form-item
        v-if="(checkOutConfig as any)?.email_attach === 1"
        label="Your Email attached file?"
      >
        <a-input
          type="file"
          size="10"
          @change="handleUploadEmailAttachFile"
        />
      </a-form-item>
      <a-form-item
        label="How long to offer?"
      >
        <div class="grid grid-cols-[50px_1fr] gap-4 items-center mb-3">
          <div>From</div>
          <a-form-item
            name="start_date"
            v-bind="validateInfos.start_date"
            class="!mb-0"
          >
            <a-date-picker
              v-model:value="formModel.start_date"
              :value-format="DATE_TIME_ZERO_FORMAT"
              :format="DATE_FORMAT"
              :allow-clear="false"
              class="w-full"
            />
          </a-form-item>
        </div>
        <div class="grid grid-cols-[50px_1fr] gap-4 items-center">
          <div>To</div>
          <a-form-item
            name="expired_date"
            v-bind="validateInfos.expired_date"
            class="!mb-0"
          >
            <a-date-picker
              v-model:value="formModel.expired_date"
              :value-format="DATE_TIME_ZERO_FORMAT"
              :format="DATE_FORMAT"
              :allow-clear="false"
              class="w-full"
            />
          </a-form-item>
        </div>
      </a-form-item>
      <a-form-item
        label="Would you like to test first? (strongly recommended)"
      >
        <p>Enter phone number to receive a test</p>
        <div class="grid grid-cols-[1fr_auto] gap-4">
          <a-input v-model="emailTest"/>
          <a-button type="primary" size="small" @click="handleSendTest('sms')">Test now</a-button>
        </div>
      </a-form-item>
      <a-form-item>
        <p>Enter email to receive a test</p>
        <div class="grid grid-cols-[1fr_auto] gap-4">
          <a-input v-model="smsTest"/>
          <a-button type="primary" size="small" @click="handleSendTest('email')">Test now</a-button>
        </div>
      </a-form-item>
      <a-form-item
        name="has_promotion"
        v-bind="validateInfos.has_promotion"
        label="One time use only"
      >
        <a-checkbox
          :checked="formModel.has_promotion === 1"
          @change="(e: any) => formModel.has_promotion = e.target.checked ? 1 : 0"
        >
          Promotion for one time use only
        </a-checkbox>
      </a-form-item>
      <a-form-item
        name="type_submit"
        v-bind="validateInfos.type_submit"
        label="When to send offer?"
      >
        <a-radio-group
          class="!grid gap-3"
          v-model:value="formModel.type_submit"
        >
          <div>
            <a-radio :value="2">Scheduled by</a-radio>
            <a-form-item class="!mt-2 !mb-0" v-if="formModel.type_submit === 2">
              <a-date-picker
                v-model:value="formModel.scheduler_date"
                :value-format="DATE_FORMAT"
                :format="DATE_FORMAT"
                :allow-clear="false"
              />
            </a-form-item>
          </div>
          <div>
            <a-radio :value="1">Immediately</a-radio>
          </div>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button
        type="primary"
        @click="handleSubmit"
        :loading="isSubmitLoading"
      >
        Submit
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
import {ref} from "vue";
import type {Rule} from 'ant-design-vue/es/form';
import Quantity from "@/components/Quantity.vue";
import {Form, notification} from 'ant-design-vue';
import handleError from "@/utils/error";
import dayjs from "dayjs";
import {useBusinessStore} from "@/stores/business";
import {goCheckInSdk} from "@/sdk";
import type {GetCampaignPromotionGroupResponse, GetCheckOutConfigResponse} from "gap-nodejs-sdk";

type Emits = {
  (e: 'refresh'): void
}
const emit = defineEmits<Emits>();

const businessStore = useBusinessStore();

const checkOutConfig = ref<GetCheckOutConfigResponse | null>(null);
const isGetCheckOutConfigLoading = ref(false);
const handleGetCheckOutConfig = async () => {
  try {
    isGetCheckOutConfigLoading.value = true;
    checkOutConfig.value = await goCheckInSdk.settings.getCheckOutConfig();
  } catch (error) {
    handleError({error})
  } finally {
    isGetCheckOutConfigLoading.value = false;
  }
};
handleGetCheckOutConfig();

const useForm = Form.useForm;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_TIME_ZERO_FORMAT = 'YYYY-MM-DD 00:00:00';
const isVisible = ref(false);

const campaignPromotionGroup = ref<GetCampaignPromotionGroupResponse | null>(null);
const isGetCampaignPromotionGroup = ref(false);
const getCampaignPromotionGroup = async () => {
  try {
    isGetCampaignPromotionGroup.value = true;
    const res = await goCheckInSdk.campaign.getCampaignPromotionGroup();
    campaignPromotionGroup.value = res.map((group: any) => ({
      label: group.name,
      value: group.id,
    }));
  } catch (error) {
    handleError({error});
  } finally {
    isGetCampaignPromotionGroup.value = false;
  }
};
getCampaignPromotionGroup();

// const listTypeSubmit = ref([
//   {label: 'Scheduled by', value: 2},
//   {label: 'Immediately', value: 1},
// ]);
const listLogicType = ref([
  {
    label: '%',
    value: 'percent'
  },
  {
    label: '$',
    value: 'usd'
  }
]);
const isRequireOptOut = ref(false);
const isSaveBusinessName = ref(false);
const emailTest = ref('');
const smsTest = ref('');
const handleInputBusinessName = () => {
  let temp = 0;
  if (formModel.value.is_show_exp === 1) temp -= 14;
  if (formModel.value.is_sent_opt_out === 1) temp -= 22;
  contentMaxLength.value = 135 - formModel.value.business_name.length + temp;
  if (formModel.value.content.length > contentMaxLength.value) {
    let cut = contentMaxLength.value - formModel.value.content.length;
    formModel.value.content = formModel.value.content.slice(0, cut);
  }
};
const handleInputContent = (e: any) => {
  if ('value' in e.target) {
    // eslint-disable-next-line no-control-regex
    formModel.value.content = e.target.value.replace(/[^\x00-\x7F]/g, "");
  }
};
const handleChangeExp = (e: any) => {
  if ('checked' in e.target) {
    formModel.value.is_show_exp = e.target.checked ? 1 : 0;
    if (formModel.value.is_show_exp === 1) {
      contentMaxLength.value = contentMaxLength.value - 14;
    } else {
      contentMaxLength.value = contentMaxLength.value + 14;
    }
    if (formModel.value.content.length > contentMaxLength.value) {
      let cut = contentMaxLength.value - formModel.value.content.length;
      formModel.value.content = formModel.value.content.slice(0, cut);
    }
  }
};
const handleChangeOpt = (e: any) => {
  if ('checked' in e.target) {
    formModel.value.is_sent_opt_out = e.target.checked ? 1 : 0;
    if (formModel.value.is_sent_opt_out === 1) {
      contentMaxLength.value = contentMaxLength.value - 22;
    } else {
      contentMaxLength.value = contentMaxLength.value + 22;
    }
    if (formModel.value.content.length > contentMaxLength.value) {
      let cut = contentMaxLength.value - formModel.value.content.length;
      formModel.value.content = formModel.value.content.slice(0, cut);
    }
  }
};
const handleUploadEmailAttachFile = (e: any) => {
  if ('files' in e.target) {
    formModel.value.file = e.target.files[0];
  }
};

interface FormState {
  name: string,
  logic_value: number,
  logic_type: 'percent' | 'usd',
  start_date: string, // YYYY-MM-DD 00:00:00
  expired_date: string, // YYYY-MM-DD 00:00:00
  business_name: string,
  is_show_exp: 0 | 1,
  is_sent_opt_out: 0 | 1,
  email_subject: string,
  content: string,
  groups: number[],
  type_submit: 1 | 2,
  has_promotion: 0 | 1,
  scheduler_date: string, // YYYY-MM-DD 00:00:00,
  file: File | null,
}

const formModel = ref<FormState>({
  name: '',
  logic_value: 0,
  logic_type: 'percent',
  start_date: '',
  expired_date: '',
  business_name: localStorage.getItem('businessName') || businessStore.businessSiteInfo?.name as string,
  is_show_exp: 1,
  is_sent_opt_out: 1,
  email_subject: '',
  content: 'We\'re offering you a 10% off everything. See you soon! Call us: 888-888-8888.',
  groups: [],
  type_submit: 1,
  has_promotion: 0,
  scheduler_date: dayjs().format(DATE_FORMAT),
  file: null,
});

const defaultMaxLength = 135 - 14 - 22 - (formModel.value.business_name?.length || 0);
const contentMaxLength = ref(defaultMaxLength);
const expiredDateValidator = async (_rule: Rule, value: number) => {
  if (!value) {
    return Promise.reject('Expired date is required');
  }
  if (dayjs(value).isBefore(formModel.value.start_date, 'day')) {
    return Promise.reject('Expired date must be after start date');
  }
  return Promise.resolve();
};
const formRules = ref<Record<string, Rule[]>>({
  name: [{required: true, message: 'Name is required'}],
  start_date: [{required: true, message: 'Start date is required'}],
  expired_date: [{validator: expiredDateValidator}],
});
const {resetFields, validate, validateInfos} = useForm(formModel, formRules,);

const isSubmitLoading = ref(false);
const handleSubmit = async () => {
  try {
    isSubmitLoading.value = true;
    await validate();
    if (isSaveBusinessName.value) {
      localStorage.setItem('businessName', formModel.value.business_name);
    } else {
      localStorage.removeItem('businessName');
    }
    const data = {
      ...formModel.value,
      groups: String(formModel.value.groups),
    };
    await goCheckInSdk.campaign.createCampaignPromotion(data);
    notification.success({
      message: 'Create promotion success',
    });
    hide();
    emit('refresh');
  } catch (error) {
    handleError({error})
  } finally {
    isSubmitLoading.value = false;
  }
};
const handleResetState = () => {
  resetFields();
  isSaveBusinessName.value = false;
  emailTest.value = '';
  smsTest.value = '';
  contentMaxLength.value = defaultMaxLength;
};
const handleSendTest = async (type: 'email' | 'sms') => {
  try {
    const data = {
      email_test: emailTest.value,
      phone_test: smsTest.value,
      content: formModel.value.content,
      exp_date: formModel.value.start_date,
      date_start: formModel.value.expired_date,
      email_subject: formModel.value.email_subject,
      business_name: formModel.value.business_name,
      is_show_exp: formModel.value.is_show_exp,
      is_sent_opt_out: formModel.value.is_sent_opt_out,
      type: type,
      campaign_name: formModel.value.name,
    }
    await goCheckInSdk.campaign.sendCampaignPromotionTest(data);
    notification.success({
      message: `Send test ${type.toUpperCase()} success!`,
    });
  } catch (error) {
    handleError({error});
  }
};
const show = (isRequireOptOutParam = false) => {
  isRequireOptOut.value = isRequireOptOutParam;
  isVisible.value = true;
};
const hide = () => {
  isVisible.value = false;
  resetFields();
};
defineExpose({
  show,
  hide
})
</script>

<style lang="scss" scoped>

</style>
