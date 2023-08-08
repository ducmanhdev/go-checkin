<template>
  <div>
    <div class="mb-4 flex items-center justify-between gap-3">
      <h2 class="heading-1 mb-0 flex items-center gap-2">
        <router-link :to="{name: 'customer'}" class="inline-block md:hidden">
          <img src="@/assets/images/icon-arrow-left.svg" alt="">
        </router-link>
        Details
      </h2>
      <div class="flex gap-4">
        <a-button
          type="primary"
          :loading="isExportLoading"
          @click="handleExport"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"
               xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect width="26" height="26" fill="url(#pattern0)"/>
            <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlink:href="#image0_93_9784" transform="scale(0.0104167)"/>
              </pattern>
              <image id="image0_93_9784" width="96" height="96"
                     xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADqUlEQVR4nO2dSWsWQRCG24WgxojrRSMeRCJ4UNxQMAfBgwG9eRFRxCh4UXEBDwrGH+DyBwIuNxMFFUSR4MGbCJ70pIiCS9xwQ1zQRwYHDLHrm0l6OjWm64FcMl3V9dY7/TFfzwyfc4ZhGIZhGIZhGIZhGIZRQ4DZwEagC7gKPNeuKalm40G7zqSa7UO79qSa7UNbT1LN9qGtMalm+3ApotVsH260U6dm+3CjHWqOq1/9H4FLQJsZ4FRPoLdAq60AXS6YAbp8MAOUMQOUMQOUMQOUSd6AIkIbaAYEYgYEYgYo42wFmAExT5AyeymvgJXAMs9fO/C1IP4n0CHEnyia3FbAH7Y1MPB8QQ97hLgJwFMzoByPgSahkasLYlcJcQfLTGwr4C+dDVbBXaF/N4Xxk4H+KgxAmdATZCgCnjRYBZ1CzDph/PGqBJKQARm7hRwT8xsUA7kHjPGMnZlt41YlkMQMeJY1W8gz+IpmkzDuVJUCScyAjD1Cnvn5JWfGQ2CcZ8wc4EuVAknQgBfAJCHX9XzMTuF4d9UCSdCAjANCri35Gd7sOdYG/KhaIIka8Bpo8eSaBlwU5umJIZBEDcg4LOT753kZYCnwS0NgaP46G/AGmFJyjhvDnSS2vtjxwQUWcLRE/vaQCWLrix0fXGAB74CpBflvh0wQW1/s+OACC+gv+hgCzoZMEFtf7PjgAgvYVSL/vBL3DKIJDM1fZwMeAONLznF6uJPE1hc7PrjABnR4ck0HFnn+Pyt/rHvIxNYXOz64QIE+Iddm4JBw7NhwJopUf2VoGJBtuC0Wcl0G7gjHWsrehBmKQBI0oFvIs3DAbuhaYczeqgWSmAHZRttcIc+ZAeOuCWOagEdVCiQxA7qEHK3At0Fjlwhjt1YpkIQM6PftgDa4zDwnjB2b366sRCAJGeD90pVfen7yjP+efQkTYjZUJZBEDBC/dOXvF0ucbDDvrSoEokxo/8sKWC/ENuc3ZyQ+AzOE2DUjITA0fx0M6GsQu79E/JEG8VdiCwzNXwcDdggP1i4v82wn8BJYIeTYHltgaP7Y9al/hhYRW1/s+OACtXGR9cWODy5QGxdZX+z44AK1cZH1xY4PLlAbF1lf7PjgArVxNa/fDFDGDFDGDFDGDNDlvRmgS68ZoEf2TtwCM2DkyV4w7K2k+QNeqsj25vdltxGB+9QIlyJ1MsUZuqY4Q3elOEP348sZuqY4Q9cUZ4wc2M9YGYZhGIZhGIZhGIZhGO7/5Td9AK/y4TcjAgAAAABJRU5ErkJggg=="/>
            </defs>
          </svg>
          Export
        </a-button>
      </div>
    </div>
    <customer-info-tabs :customer-id="currentCustomerId" />
  </div>
</template>

<script lang="ts" setup>
import {useRoute} from 'vue-router';
import {computed, ref} from "vue";
import {goCheckInSdk} from "@/sdk";
import FileDownload from "js-file-download";
import {useDateFormat} from "@/utils/date";
import handleError from "@/utils/error";
import CustomerInfoTabs from "@/components/customer-info-tabs/CustomerInfoTabs.vue";

const isExportLoading = ref(false);
const handleExport = async () => {
  try {
    isExportLoading.value = true;
    const res = await goCheckInSdk.customer.exportMember();
    FileDownload(res, `#${localStorage.getItem("id")}-member-${useDateFormat()}.xls`);
  } catch (error) {
    handleError({error});
  } finally {
    isExportLoading.value = false;
  }
};
const route = useRoute();
const currentCustomerId = computed(() => Number(route.params.id));
</script>

<style lang="scss" scoped>
</style>
