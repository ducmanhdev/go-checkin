<template>
  <section>
    <div class="mb-4 flex items-center justify-between gap-3">
      <h2 class="heading-1">Review</h2>
      <div class="flex gap-4">
        <input-search v-model="search" @input-debounce="handleSearch" class="!w-[400px] hidden md:block"/>
        <base-dropdown
          v-model="sort"
          :options="sortDropdown"
          @change="handleSort"
          placeholder="Sort by"
        />
      </div>
    </div>
    <input-search v-model="search" @input-debounce="handleSearch" class="mb-4 w-full md:hidden"/>
    <base-tab-nav
      :list="listTab"
      v-model="sourceType"
      @change="handleChangeTab"
      class="mb-4 max-md:block max-md:space-y-3 max-md:child:min-h-[50px]"
    />
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-[4fr_5fr_6fr] gap-4 mb-4" v-if="isGetReviewReportLoading">
        <div class="card">
          <a-skeleton active/>
        </div>
        <div class="card">
          <a-skeleton active/>
        </div>
        <div class="card">
          <a-skeleton active/>
        </div>
      </div>
      <div class="card mb-4" v-else-if="!reviewReport">
        <a-empty description="No data Available"/>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-[4fr_5fr_6fr] gap-4 mb-4" v-else>
        <total-survey :data="reviewReport"/>
        <total-review :data="reviewReport" :first-review="listReview?.data[0]!"/>
        <total-rating :data="reviewReport" @select="handleSelectRating" v-if="sourceType !== 'google'"/>
        <google-review-rating :data="reviewReport" v-else/>
      </div>
      <div class="space-y-4">
        <template v-if="isGetListReviewLoading">
          <div class="card" v-for="item in 2" :key="item">
            <a-skeleton avatar active/>
          </div>
        </template>
        <a-empty v-else-if="!listReview?.data?.length" description="There are no reviews yet"/>
        <template v-else>
          <review-item
            v-for="item in listReview?.data"
            :key="item?.id!"
            :data="item"
            @reply="handleReply"
            @view-customer-info="handleViewCustomerInfo"
          />
          <div class="flex justify-center">
            <a-pagination
              :current="listReview?._meta?.currentPage"
              :total="listReview?._meta?.totalCount"
              :page-size="listReview?._meta?.perPage"
              :show-size-changer="false"
              show-less-items
              @change="handlePaginationChange"
            />
          </div>
        </template>
      </div>
    </div>
    <modal-reply ref="modalReplyRef"/>
    <drawer-customer-info ref="drawerCustomerInfoRef"/>
  </section>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import InputSearch from "@/components/InputSearch.vue";
import BaseTabNav from "@/components/base/BaseTabNav.vue";
import BaseDropdown from "@/components/base/BaseDropdown.vue";
import ModalReply from './ModalReply.vue';
import DrawerCustomerInfo from "./DrawerCustomerInfo.vue";
import TotalReview from "./TotalReview.vue";
import TotalRating from "./TotalRating.vue";
import ReviewItem from "./ReviewItem.vue";
import TotalSurvey from "./TotalSurvey.vue";
import type {
  DataWithMetaResponse,
  GetListReviewResponse,
  GetListReviewRequest,
  GetReviewReportResponse
} from "gap-nodejs-sdk";
import {goCheckInSdk} from "@/sdk";
import handleError from "@/utils/error";
import GoogleReviewRating from "./GoogleReviewRating.vue";

const listTab = [
  {
    label: 'All',
    value: undefined,
  },
  {
    label: 'Go Checkin',
    icon: 'icon-logo.png',
    value: 'gocheckin',
  },
  {
    label: 'Google',
    icon: 'icon-google.svg',
    value: 'google',
  },
];
const handleChangeTab = () => {
  handleGetListReview();
}

const reviewReport = ref<GetReviewReportResponse | null>(null);
const isGetReviewReportLoading = ref(false);
const handleGetReviewReport = async () => {
  try {
    isGetReviewReportLoading.value = true;
    reviewReport.value = await goCheckInSdk.review.getReviewReport();
    reviewReport.value!.google_review_rating = {
      "five_star": "450",
      "four_star": "42",
      "three_star": "18",
      "two_star": "29",
      "one_star": "65"
    }
  } catch (error) {
    handleError({error});
  } finally {
    isGetReviewReportLoading.value = false;
  }
}
handleGetReviewReport();

const search = ref('');
const sortDropdown = [
  {
    label: "Latest",
    value: "-time_create",
  },
  {
    label: "Oldest",
    value: "time_create",
  },
  {
    label: "Highest Rated",
    value: "-rating",
  },
  {
    label: "Lowest Rated",
    value: "rating",
  },
];
const sort = ref(undefined);
const sourceType = ref(undefined);

const listReview = ref<DataWithMetaResponse<GetListReviewResponse> | null>(null);
const isGetListReviewLoading = ref(false);
const handleGetListReview = async (page = 1, perPage = 10, rating?: number) => {
  try {
    isGetListReviewLoading.value = true;
    listReview.value = await goCheckInSdk.review.getListReview({
      page: page,
      'per-page': perPage,
      user_name: search.value,
      rating: rating,
      sort: sort.value,
      type: sourceType.value
    } as GetListReviewRequest);
  } catch (error) {
    handleError({error});
  } finally {
    isGetListReviewLoading.value = false;
  }
}
handleGetListReview();

const handlePaginationChange = (page: number, pageSize: number) => {
  handleGetListReview(page, pageSize);
};
const handleSearch = () => {
  handleGetListReview();
};
const handleSort = () => {
  handleGetListReview();
};
const handleSelectRating = (rating: number) => {
  handleGetListReview(undefined, undefined, rating);
};

const drawerCustomerInfoRef = ref<InstanceType<typeof DrawerCustomerInfo> | null>(null);
const handleViewCustomerInfo = (customerId: number) => {
  drawerCustomerInfoRef?.value?.show(customerId);
}

const modalReplyRef = ref<InstanceType<typeof ModalReply> | null>(null);
const handleReply = (review: GetListReviewResponse[number]) => {
  modalReplyRef.value?.show(review);
}
</script>
<style lang='scss' scoped>
.custom_bullet {
  position: relative;
  margin: 0;

  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: -20px;
    border: 2px solid #04BFDA;
    width: 12px;
    height: 12px;
    border-radius: 50px;
  }
}

.status_normal {
  color: var(--color-C55);
  background-color: var(--color-CEE);
}

.status_regular {
  color: var(--color-C27);
  background-color: var(--color-CD3);
}

</style>
