<template>
  <section class="h-screen bg-CF5 overflow-auto">
    <div
      class="w-full min-h-full lg:max-w-[756px] bg-white text-black ml-auto flex flex-col justify-center items-center p-8">
      <div class="w-full max-w-[310px]">
        <div class="mb-10 lg:text-left text-center">
          <img src="@/assets/images/icon-logo.svg" alt="" class="mb-4 block lg:mx-0 mx-auto">
          <p class="text-xl font-semibold mb-0">Welcome to</p>
          <h2 class="text-[32px] font-bold mb-1">Go Checkin</h2>
          <p class="mb-0">Login your account</p>
        </div>
        <a-form
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          layout="vertical"
          @finish="handleLogin"
          autocapitalize="none"
        >
          <a-form-item label="ID" name="id">
            <a-input
              v-model:value="formModel.id"
              placeholder="Enter your ID"
            />
          </a-form-item>
          <a-form-item label="Username / Email" name="username">
            <a-input
              v-model:value="formModel.username"
              placeholder="Enter your user/ email"
            />
          </a-form-item>
          <a-form-item label="Password" name="password">
            <a-input-password
              v-model:value="formModel.password"
              placeholder="Enter your password"
            />
          </a-form-item>
          <a-form-item name="remember_me">
            <div class="flex items-center">
              <a-checkbox v-model:checked="formModel.remember_me" class="!mr-1.5"/>
              Remember me
            </div>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="isLoginLoading"
              block
            >
              Log in
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import {ref} from "vue";
import type {FormInstance} from "ant-design-vue";
import type {Rule} from "ant-design-vue/es/form";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import handleError from "@/utils/error";

const router = useRouter();
const authStore = useAuthStore();
const {login, getDnsInfo} = authStore;

interface FormModel {
  id: string,
  username: string;
  password: string;
  remember_me: boolean,
}

const formRef = ref<FormInstance>();
const formModel = ref<FormModel>({
  id: "",
  username: "",
  password: "",
  remember_me: true,
});

const formRules: Record<string, Rule[]> = {
  id: [{required: true, message: 'ID is required'}],
  username: [{required: true, message: 'Username is required'}],
  password: [{required: true, message: 'Password is required'}],
};

const isLoginLoading = ref(false);
const handleLogin = async () => {
  try {
    isLoginLoading.value = true;
    const dnsInfoResponse = await getDnsInfo({
      id: formModel.value.id,
      type: 'new',
      remember_me: formModel.value.remember_me,
    });
    await login({
      username: formModel.value.username,
      password: formModel.value.password,
      g_client_id: formModel.value.id,
      domain: dnsInfoResponse.domain!,
      remember_me: formModel.value.remember_me,
    });
    await router.push({name: 'home'});
  } catch (error: any) {
    handleError({
      error: error
    })
  } finally {
    isLoginLoading.value = false;
  }
}
</script>
<style lang="scss" scoped>
</style>
