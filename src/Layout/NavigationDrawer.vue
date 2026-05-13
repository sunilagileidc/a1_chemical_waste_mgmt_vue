<script setup>
import { navigation } from "../store/navigation.js";
</script>
<template>
  <div>
    <content-loader v-if="loader"></content-loader>

    <v-navigation-drawer v-model="navigation.drawer" class="pa-0">
      <div
        class="d-flex align-items-center justify-space-between pa-5 navigation-title"
        elevation="3"
        style="height: 64px; border-radius: 0px"
      >
        <div class="app-header__logo">
          <div v-if="app_image_url">
            <span>
              <img v-bind:src="app_image_url" style="width: 100%" />
            </span>
          </div>
          <div v-else-if="app_image_url == ''">
            <span class="font-base-app text-center">
              {{ application_name }}
            </span>
          </div>
          <div v-else>
            <span class="font-base-app text-center">
              {{ application_name }}
            </span>
          </div>
          <!-- <div>
            <span class="font-base-app text-center">
              <img
                src="../assets/images/logo.png"
                class="logo"
                style="width: 168px; margin-right: 16px"
              />
            </span>
          </div> -->
        </div>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click.stop="navigation.setDrawer(false)"
        ></v-btn>
      </div>
      <v-list>
        <v-list-group v-for="(item, i) in menuitems" :key="i">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind:class="[item.child == null ? 'sibebarvlistmenu' : '']"
              class="v_list_menu_title"
              :prepend-icon="item.icon"
              v-bind="props"
              :active="item.classactive"
              color="blue"
              @click="redirectTo(item.href, 'parent', item.child, i)"
            >
              <span class="text-left"> {{ item.title }}</span>
            </v-list-item>
          </template>

          <v-list-item
            v-for="(child, i) in item.child"
            :key="i"
            @click="redirectTo(child.href, 'child', null, i)"
            :title="child.title"
            :value="child.title"
            class="v_child_list_title"
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import localStorageWrapper from "../localStorageWrapper.js";

export default {
  props: ["sel_lang"],
  data() {
    return {
      drawer: true,
      loader: false,
      user: [],
      active_menu: "",
      menuitems: [],
      role_id: "",
      app_image_url: "",
      application_name: "",
      app_name: "",
      admins: [
        ["Management", "mdi-account-multiple-outline"],
        ["Settings", "mdi-cog-outline"],
      ],
      lang: "",
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
    this.active_menu = localStorage.getItem("active_menu");
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
    redirectTo(route, classvalue, childvalue, index) {
      if (classvalue != "child") {
        for (var i = 0; i < this.menuitems.length; i++) {
          this.menuitems[i].classactive = false;
        }
      }
      if (classvalue == "parent") {
        this.menuitems[index].classactive = true;
        localStorage.setItem("active_menu", this.menuitems[index].title);
      }
      if (classvalue == "parent" && childvalue != null) {
        return;
      } else {
        if (this.$router.hasRoute(route)) {
          this.$router.push({ name: route });
        } else {
          this.$router.push({ name: "not-found" });
        }
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
            const indexofActive = this.menuitems.findIndex(
              (item) => item.title === this.active_menu
            );
            if (indexofActive !== -1) {
              this.menuitems[indexofActive].classactive = true;
            }
          }
        })
        .catch((err) => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
  },
};
</script>

<style scoped>
.navigation-title {
  position: sticky;
  top: 0px;
  z-index: 10;
}
</style>
