<script setup>
import { navigation } from "../store/navigation.js";
</script>

<template>
  <div>
    <content-loader v-if="loader"></content-loader>

    <v-navigation-drawer
      v-model="navigation.drawer"
      class="pa-0 modern-drawer system-bg"
      elevation="6"
    >
      <div
        class="d-flex align-items-center justify-space-between px-4 navigation-title system-bg"
        style="height: 60px"
      >
        <div class="app-header__logo fade-in">
          <div v-if="app_image_url">
            <img
              :src="app_image_url"
              class="app-logo"
              @click="goToDashboard"
              style="cursor: pointer"
            />
          </div>
          <div v-else>
            <span
              class="font-base-app text-center app-name"
              @click="goToDashboard"
              style="cursor: pointer"
            >
              {{ application_name }}
            </span>
          </div>
        </div>

        <v-btn
          variant="text"
          icon="mdi-close"
          class="close-btn"
          @click.stop="navigation.setDrawer(false)"
        />
      </div>

      <v-list
        nav
        density="compact"
        v-model:opened="openedGroups"
        class="modern-list"
      >
        <template v-for="(item, i) in menuitems" :key="i">
          <!-- NO CHILD -->
          <v-list-item
            v-if="!item.child || item.child.length === 0"
            :prepend-icon="item.icon"
            :active="activeParent === item.title"
            class="parent-item modern-item"
            @click="handleSingleItem(item)"
          >
            <span class="menu-text">{{ item.title }}</span>
          </v-list-item>

          <!-- HAS CHILD -->
          <v-list-group v-else :value="item.title" class="modern-group">
            <template #activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :active="activeParent === item.title"
                class="parent-item modern-item"
              >
                <span class="menu-text">{{ item.title }}</span>
              </v-list-item>
            </template>

            <v-slide-y-transition group>
              <v-list-item
                v-for="(child, ci) in item.child"
                :key="ci"
                :title="child.title"
                :active="activeChild === child.href"
                class="child-item modern-child"
                @click="handleChildClick(item.title, child)"
              />
            </v-slide-y-transition>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import localStorageWrapper from "../localStorageWrapper.js";
import { helpers } from "../utils/helpers.js";

export default {
  props: ["sel_lang"],

  data() {
    return {
      loader: false,
      user: [],
      menuitems: [],
      role_id: "",
      app_image_url: "",
      application_name: "",
      activeParent: "",
      activeChild: "",
      openedGroups: [],
    };
  },

  created() {
    this.emitter.on("fetchAssignedMenus", () => {
      this.fetchMenuTree();
    });

    this.emitter.on("app_image_update", () => {
      this.appImageUpdate();
    });

    this.appImageUpdate();
  },

  mounted() {
    this.activeParent = localStorage.getItem("active_parent") || "";
    this.activeChild = localStorage.getItem("active_child") || "";

    if (JSON.parse(localStorage.getItem("user_data"))) {
      this.user = JSON.parse(localStorage.getItem("user_data"));
      this.role_id = this.user.role_id;
    }
  },

  watch: {
    role_id: {
      immediate: true,
      handler() {
        if (this.role_id > 0) {
          this.fetchMenuTree();
        }
      },
    },
    "$route.params.lang"() {
      if (this.role_id > 0) {
        this.fetchMenuTree();
      }
    },
  },

  methods: {
    appImageUpdate() {
      if (localStorageWrapper.getItem("App_Image_Url") != null) {
        this.app_image_url = localStorageWrapper.getItem("App_Image_Url");
      } else {
        this.app_image_url = "";
      }

      if (localStorageWrapper.getItem("App_Name")) {
        this.application_name = localStorageWrapper.getItem("App_Name");
      } else {
        this.application_name = "";
      }
    },

    handleSingleItem(item) {
      this.activeParent = item.title;
      this.activeChild = "";
      this.openedGroups = [];

      localStorage.setItem("active_parent", item.title);
      localStorage.removeItem("active_child");

      this.navigate(item.href);
    },

    handleChildClick(parentTitle, child) {
      this.activeParent = parentTitle;
      this.activeChild = child.href;
      this.openedGroups = [parentTitle];

      localStorage.setItem("active_parent", parentTitle);
      localStorage.setItem("active_child", child.href);

      this.navigate(child.href);
    },

    navigate(route) {
      if (this.$router.hasRoute(route)) {
        this.$router.push({ name: route });
      } else {
        this.$router.push({ name: "not-found" });
      }
    },

    fetchMenuTree() {
      this.loader = true;
      const lang = localStorage.getItem("pref_lang") || "en";

      this.$axios
        .post("menutree", {
          role: this.role_id,
          lang: lang,
        })
        .then((response) => {
          this.loader = false;

          if (response.data.status == "S") {
            this.menuitems = response.data.menu;

            this.$nextTick(() => {
              this.restoreOpenedGroup();
            });
          }
        })
        .catch(() => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
        });
    },

    restoreOpenedGroup() {
      if (!this.activeChild) return;

      for (const parent of this.menuitems) {
        if (parent.child && parent.child.length) {
          const found = parent.child.find((c) => c.href === this.activeChild);

          if (found) {
            this.activeParent = parent.title;
            this.openedGroups = [parent.title];
            break;
          }
        }
      }
    },
    goToDashboard() {
      var userdata = JSON.parse(localStorage.getItem("user_data"));
      helpers.handleUserRouting(userdata, this.$router, this.loadPermissions);
    },
  },
};
</script>

<style scoped>
.navigation-title {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(6px);
}

/* Drawer */
.modern-drawer {
  backdrop-filter: blur(10px);
}

/* Logo */
.app-logo {
  width: 100%;
  max-height: 65px;
  object-fit: contain;
}

.app-name {
  font-size: 14px;
  font-weight: 600;
}

/* Menu text reduced */
.menu-text {
  font-size: 13px;
  font-weight: 500;
}

/* Parent Items */
.parent-item {
  border-radius: 8px;
  margin: 4px 10px;
  min-height: 36px;
  transition: all 0.2s ease;
}

.parent-item:hover {
  background: rgba(var(--v-theme-primary), 0.06);
  transform: translateX(4px);
}

.parent-item.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.12);
  font-weight: 600;
}

/* Child Items */
.child-item {
  padding-left: 42px !important;
  border-radius: 6px;
  margin: 2px 14px;
  font-size: 12.5px;
  min-height: 32px;
  transition: all 0.2s ease;
}

.child-item:hover {
  background: rgba(var(--v-theme-primary), 0.06);
  transform: translateX(6px);
}

.child-item.v-list-item--active {
  background: rgba(var(--v-theme-primary), 0.12);
  font-weight: 500;
}

/* Close button */
.close-btn {
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: rotate(90deg);
}
</style>
