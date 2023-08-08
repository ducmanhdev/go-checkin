<template>
  <section>
    <h2 class="heading-1 mb-4 md:mb-5">Review setting</h2>
    <base-tab-nav
      :list="listTab"
      v-model="tabActive"
      class="mb-7 max-md:block max-md:space-y-3 max-md:child:min-h-[50px]"
    />
    <div>
      <go-checkin-message-setting v-if="tabActive === 'go_checkin_message_setting'"/>
      <google-reply-review-setting v-if="tabActive === 'google_reply_review_setting'"/>
      <staff-rating v-if="tabActive === 'staff_rating'"/>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {defineAsyncComponent, ref} from "vue";
import BaseTabNav from "@/components/base/BaseTabNav.vue";
import GoCheckinMessageSetting from "./GoCheckinMessageSetting.vue";

const GoogleReplyReviewSetting = defineAsyncComponent(() => import("./GoogleReplyReviewSetting.vue"));
const StaffRating = defineAsyncComponent(() => import("./StaffRating.vue"));

const listTab = [
  {
    label: 'Go checkin message setting',
    value: 'go_checkin_message_setting',
  },
  {
    label: 'Google reply review setting',
    value: 'google_reply_review_setting',
  },
  {
    label: 'Staff rating',
    value: 'staff_rating',
  },
];
const tabActive = ref(listTab[0].value);
</script>
