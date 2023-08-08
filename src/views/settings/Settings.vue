<template>
  <section>
    <h2 class="heading-1 mb-3 md:mb-5 xl:mb-7">Settings</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 xl:gap-y-7 xl:gap-x-8">
      <div
        v-for="setting in listSettings"
        :key="setting.title"
        class="shadow bg-white text-black rounded-base md:rounded-[20px] p-4 md:px-8 md:py-7 flex items-center gap-3 group cursor-pointer"
        @click="$router.push(setting.route)"
      >
        <div
          class="w-[60px] h-[60px] md:w-[64px] md:h-[64px] rounded-base bg-primary-lighter p-2 flex items-center justify-center shrink-0"
        >
          <img
            :src="getImageUrl(setting.icon)"
            alt=""
            class="block max-w-full max-h-full"
          >
        </div>
        <div>
          <h3 class="mb-0 md:text-base font-semibold group-hover:text-primary">{{ setting.title }}</h3>
          <p class="mb-0">{{ setting.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {getImageUrl} from "@/utils/url";

const listSettings = ref([
  {
    icon: 'icon-ticket-setting.svg',
    title: 'Ticket Setting',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    route: {
      name: 'ticket-setting'
    }
  },
  {
    icon: 'icon-checkin-setting.svg',
    title: 'Checkin setting',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    route: {
      name: 'checkin-setting'
    }
  },
  {
    icon: 'icon-checkin-setting.svg',
    title: 'Checkout setting',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    route: {
      name: 'checkout-setting'
    }
  },
  {
    icon: 'icon-store-rating.svg',
    title: 'Store Rating on GCI app',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit',
    route: {
      name: 'store-rating-setting'
    }
  }
]);
</script>

<style lang="scss">
</style>
