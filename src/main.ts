import {createApp, markRaw} from 'vue'
import {createPinia} from 'pinia'
import {vMaska} from "maska";
import Antd from 'ant-design-vue';
// @ts-ignores
import CountUp from "vue-countup-v3";

import './styles/tailwind.scss';
import './styles/index.scss';

import App from './App.vue';
import router from './router';
import {inputNumber} from "@/directives";

const app = createApp(App);

const pinia = createPinia();
pinia.use(({store}) => {
  store.router = markRaw(router)
});
app.component('countUp', CountUp);
app.use(pinia);
app.use(router);
app.use(Antd);

app.directive('inputNumber', inputNumber);
app.directive("maska", vMaska);

app.mount('#app')
