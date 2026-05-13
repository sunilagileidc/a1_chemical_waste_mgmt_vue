import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/global.css";

import { createI18n } from "vue-i18n";
import { languages, defaultLocale } from "./assets/i18n/index.js";

import AxiosPlugin from "./plugins/axios-plugin.js";

import moment from "moment";

import { dateMixin } from "./plugins/dateMixin.js";
import mitt from "mitt";

import Toaster from "@meforma/vue-toaster";

// ---------------- VUETIFY ----------------
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";
import { aliases, mdi } from "vuetify/iconsets/mdi";

// ---------------- GLOBAL COMPONENTS ----------------
import GlobalComponents from "./global-components";

// ---------------- EVENT BUS ----------------
const emitter = mitt();

// ---------------- I18N ----------------
const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  messages: { ...languages },
});

document.documentElement.lang = defaultLocale;

// ---------------- VUETIFY SETUP ----------------
const vuetify = createVuetify({
  components: { ...components, ...labsComponents },
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
});

// ---------------- APP INIT ----------------
const app = createApp(App);

app.use(store);
app.use(router);
app.use(vuetify);
app.use(i18n);
app.use(AxiosPlugin);
app.use(Toaster);

// Register all global components from plugin
app.use(GlobalComponents);

// ---------------- GLOBAL PROPERTIES ----------------
app.config.globalProperties.$moment = moment;
app.config.globalProperties.emitter = emitter;

// ---------------- GLOBAL MIXINS ----------------
app.mixin(dateMixin);

// ---------------- MOUNT ----------------
app.mount("#app");
