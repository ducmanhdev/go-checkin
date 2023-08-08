<template>
  <div class="card-sm space-y-3">
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">#</div>
      <div>{{ index }}</div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">CUSTOMER NAME</div>
      <div>
        {{ data?.customer_name }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">CUSTOMER PHONE</div>
      <div class="">
        {{ data?.customer_phone }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">REWARD CONTENT</div>
      <div class="">
        {{ data?.redeem_content }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">STAFF</div>
      <div class="">
        {{ data?.staff_name }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">TOTAL PRICE</div>
      <div class="">
        {{ data?.total_price }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">DISCOUNT</div>
      <div class="">
        {{ data?.discount }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">POINT</div>
      <div class="">
        {{ data?.lasted_point }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="text-C84 font-semibold">DATE</div>
      <div class="">
        <p class="mb-0">{{ useDateFormat(data?.created_at!) }}</p>
        <p class="mb-0">{{ dayjs(data?.created_at).format(TIME_12_FORMAT) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {GetRewardHistoryResponse} from "gap-nodejs-sdk";
import {useDateFormat} from '@/utils/date';
import dayjs from "dayjs";
import {TIME_12_FORMAT} from '@/constant';

type Props = {
  index: number;
  data: GetRewardHistoryResponse[number];
}
const props = defineProps<Props>();
</script>

<style lang="scss">
</style>
