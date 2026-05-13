<script setup>
import { navigation } from "./store/navigation.js";
import { apptheme } from "./store/apptheme.js";
</script>

<template>
  <v-app>
    <content-loader v-if="c_loader"></content-loader>

    <div id="app" :class="apptheme.theme_type" class="layout-wrapper">
      <v-card class="app-container">
        <!-- DEFAULT ADMIN LAYOUT -->
        <NavigationDrawer
          :key="componentKey"
          v-if="isReady && layout === 'default-layout'"
          :sel_lang="sel_lang"
        />

        <v-app-bar
          v-if="isReady && layout === 'default-layout'"
          color="white"
          elevation="3"
          style="border-radius: 0px"
          :style="sel_lang == 'ar' ? 'direction:rtl' : ''"
        >
          <template v-slot:prepend>
            <v-app-bar-nav-icon
              v-show="navigation.drawer === false"
              @click="navigation.setDrawer(!navigation.drawer)"
            />

            <div v-show="navigation.drawer === false">
              <div class="font-login text-center">
                <div v-if="app_image_url">
                  <img :src="app_image_url" style="width: 150px" />
                </div>

                <div v-else>
                  <span class="font-base-app text-center">
                    {{ application_name }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <v-spacer></v-spacer>
          <ProfileView @getuserdetails="fetchUserdetails" />
        </v-app-bar>

        <!-- USERPAGES HEADER -->
        <header-page v-if="$route.meta.layout === 'userpages'" />

        <!-- MAIN CONTENT (SCROLLABLE AREA) -->
        <v-main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </v-main>

        <!-- USERPAGES FOOTER -->
        <footer-page v-if="$route.meta.layout === 'userpages'" />
      </v-card>
    </div>

    <LogoutTimer />
  </v-app>
</template>

<script>
import localStorageWrapper from "./localStorageWrapper.js";
const default_layout = "default";

import NavigationDrawer from "./Layout/NavigationDrawer.vue";
import ProfileView from "./Layout/ProfileView.vue";
import LogoutTimer from "./components/CustomComponents/LogoutTimer.vue";

export default {
  components: { NavigationDrawer, ProfileView, LogoutTimer },

  data() {
    return {
      notificationmenu: false,
      componentKey: 0,
      app_image_url: "",
      application_name: "EPAF",
      app_name: "",
      showtradienotification: false,
      notification_count: 0,
      user: [],
      user_id: "",
      notification_array: [],
      currentTheme: localStorage.getItem("theme-type"),
      envImagePath: import.meta.env.VITE_IMAGE_PATH,
      displayedItems: [],
      loader: false,
      currentIndex: 0,
      itemsPerPage: 5,
      sel_lang: "",
      c_loader: false,
      isReady: false,
    };
  },

  computed: {
    layout() {
      return (this.$route.meta.layout || default_layout) + "-layout";
    },
  },

  created() {
    this.$router.isReady().then(() => {
      this.isReady = true;
    });

    this.emitter.on("app_image_update", () => {
      this.getAppImage();
    });

    this.getAppImage();
  },

  watch: {
    "$route.params.lang"(newLang) {
      if (newLang == "en" || newLang == "ar") {
        this.$i18n.locale = newLang;

        if (newLang) {
          localStorage.setItem("pref_lang", newLang);
          this.sel_lang = newLang;
        } else {
          localStorage.setItem("pref_lang", "en");
          this.sel_lang = "en";
        }
      } else {
        localStorage.setItem("pref_lang", "en");
        this.sel_lang = "en";
      }
    },
  },

  methods: {
    fetchUserdetails(getuserdetails) {
      this.user = getuserdetails;
      this.user_id = getuserdetails.id;
    },

    getAppImage() {
      if (localStorageWrapper.getItem("App_Image_Url") != null) {
        this.app_image_url = localStorageWrapper.getItem("App_Image_Url");
        this.app_name = localStorageWrapper.getItem("App_Name");
      } else {
        this.app_image_url = "";
      }

      if (localStorageWrapper.getItem("App_Name")) {
        this.application_name = localStorageWrapper.getItem("App_Name");
      } else {
        this.application_name = "";
      }
    },

    switchTheme() {
      const storedTheme = localStorage.getItem("theme-type");

      if (storedTheme === "theme-dark") {
        localStorage.setItem("theme-type", "theme-light");
        this.currentTheme = localStorage.getItem("theme-type");
      } else {
        localStorage.setItem("theme-type", "theme-dark");
        this.currentTheme = localStorage.getItem("theme-type");
      }
    },
  },
};
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-content {
  flex: 1;
}

/* existing styles untouched */

nav {
  padding: 30px;
}

body::-webkit-scrollbar {
  display: none;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.v-toolbar__content {
  height: 57px !important;
}

.v-toolbar-title__placeholder {
  font-size: 23px;
  font-weight: 500;
  color: #000000bd;
  padding-left: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
