<script setup>
import { apptheme } from "../store/apptheme.js";
</script>
<template>
  <div class="d-flex align-center">
    <v-tooltip
      text="Switch Institution"
      location="bottom"
      v-if="
        (user.rolename == 'Pharmacist' ||
          user.rolename == 'Prescriber' ||
          user.rolename == 'Nurse') &&
        show_switch != 0
      "
    >
      <template v-slot:activator="{ props }">
        <router-link
          :to="{
            name: 'institution_selection',
          }"
          style="color: white"
        >
          <v-icon v-bind="props" size="28" class="down-arrow-icon mr-2">
            mdi mdi-swap-horizontal
          </v-icon>
        </router-link>
      </template>
    </v-tooltip>

    <span class="mr-2 d-flex flex-column">
      <small>
        {{ sel_institution?.institution_data?.name }}
      </small>

      <small v-if="sel_institution?.institution_data?.institution_type"
        >({{
          sel_institution?.institution_data?.institution_type || ""
        }})</small
      >
    </span>
    <v-menu v-model="menu" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-list-item>
          <template v-slot:prepend>
            <!-- <v-avatar
              v-if="user.image_url != null"
              v-bind="props"
              class="profile-card"
              color="grey-darken-3"
              :image="envImagePath + user.image_url"
            ></v-avatar>
            <v-avatar
              v-else
              v-bind="props"
              color="grey-darken-3"
              class="defalut_src"
              :image="default_src"
            >
            </v-avatar> -->

            <v-icon v-bind="props" size="28" class="down-arrow-icon">
              mdi mdi-account-circle
            </v-icon>
          </template>
          <v-list-item-title
            style="font-weight: bold; font-size: 14px"
            class="user_name"
          >
            <span
              v-if="user"
              v-bind:class="
                apptheme.theme_type == 'theme-dark' ? 'text-white' : ''
              "
              >{{ user.salutation }} {{ user.name }} {{ user.lastname }}</span
            >
          </v-list-item-title>
          <!-- <v-list-item-subtitle style="font-size: 12px"
            >coming soon</v-list-item-subtitle
          > -->
        </v-list-item>
      </template>
      <v-card
        min-width="320"
        class="profile-menu-card"
        :class="apptheme.theme_type === 'theme-dark' ? 'dark' : ''"
      >
        <!-- HEADER -->
        <div class="profile-menu-header">
          <p class="profile-menu-label">Signed in as - {{ user.rolename }}</p>
          <!-- <small v-if="user.pharmacist">
              ({{ user.pharmacist.institution_type }})</small
            > -->

          <!-- {{ user }} -->
          <div class="profile-menu-user">
            <!-- <v-avatar
              size="36"
              :image="
                user.image_url ? envImagePath + user.image_url : default_src
              "
            /> -->
            <span class="profile-menu-email">
              {{ user.email }}
            </span>
          </div>
        </div>
        <!-- MENU ITEMS -->
        <v-list class="profile-menu-list">
          <!-- Profile -->
          <router-link
            :to="{
              name: 'view-my-profile',
              query: { slug: user.slug, from: 'amend' },
            }"
            class="profile-menu-item"
            @click="menu = false"
          >
            <span class="accent blue"></span>
            <v-icon size="20" color="primary">mdi-account</v-icon>
            <span class="text">My Profile</span>
            <v-icon size="16">mdi-chevron-right</v-icon>
          </router-link>
          <!-- v-if="user.pharmacist.institution_type == 'Inpatient Pharmacy'" -->

          <router-link
            v-if="
              action_permissions.includes('CONNECTED USERS') &&
              user.pharmacist &&
              user.pharmacist.institution_type == 'Inpatient Pharmacy'
            "
            :to="{
              name: 'connected-pharmacy',
            }"
            class="profile-menu-item"
            @click="menu = false"
          >
            <span class="accent blue"></span>
            <v-icon size="20" color="primary">mdi mdi-account-switch</v-icon>
            <span class="text">Connected Users</span>
            <v-icon size="16">mdi-chevron-right</v-icon>
          </router-link>

          <!-- Nurse cration -->
          <router-link
            v-if="action_permissions.includes('CONNECTED NURSES')"
            :to="{
              name: 'connected_nurses',
            }"
            class="profile-menu-item"
            @click="menu = false"
          >
            <span class="accent blue"></span>
            <v-icon size="20" color="primary"
              >mdi-account-multiple-check</v-icon
            >
            <span class="text">Connected Nurses</span>
            <v-icon size="16">mdi-chevron-right</v-icon>
          </router-link>

          <router-link
            v-if="
              action_permissions.includes('TRAINING DOCUMENTS') ||
              (user.pharmacist &&
                user.pharmacist.institution_type == 'Inpatient Pharmacy')
            "
            :to="{
              name: 'training_documents',
            }"
            class="profile-menu-item"
            @click="menu = false"
          >
            <span class="accent blue"></span>
            <v-icon size="20" color="primary"
              >mdi mdi-file-document-multiple</v-icon
            >
            <span class="text">Training Documents</span>
            <v-icon size="16">mdi-chevron-right</v-icon>
          </router-link>

          <!-- action_permissions.includes('CREATE WHOLESALERS') && -->
          <router-link
            v-if="user.pharmacist"
            :to="{
              name: 'add-wholesaler',
            }"
            class="profile-menu-item"
            @click="menu = false"
          >
            <span class="accent blue"></span>
            <v-icon size="20" color="primary">mdi mdi-account-switch</v-icon>
            <span class="text">Wholesalers</span>
            <v-icon size="16">mdi-chevron-right</v-icon>
          </router-link>

          <!-- Reset Password -->
          <div class="profile-menu-item" @click="resetPasswordRedirect">
            <span class="accent blue"></span>
            <v-icon size="20" color="primary">mdi-lock-reset</v-icon>
            <span class="text">Reset Password</span>
            <v-icon size="16">mdi-chevron-right</v-icon>
          </div>

          <!-- Logout -->
          <div class="profile-menu-item logout" @click="logoutUser">
            <span class="accent red"></span>
            <v-icon size="20" color="error">mdi-logout</v-icon>
            <span class="text">Logout</span>
            <v-icon size="16">mdi-chevron-right</v-icon>
          </div>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import defaultAvatar from "@/assets/images/avatars/default.png";
export default {
  data: () => ({
    envImagePath: import.meta.env.VITE_IMAGE_PATH,
    fav: true,
    user: [],
    menu: false,
    message: false,
    hints: true,
    default_src: defaultAvatar,
    show_switch: 0,
    sel_institution: "",
    action_permissions: [],
    permissions: [],
  }),
  mounted() {
    if (JSON.parse(localStorage.getItem("user_data"))) {
      this.user = JSON.parse(localStorage.getItem("user_data"));

      this.role_id = this.user.role_id;
    }
    const inst = JSON.parse(localStorage.getItem("sel_inst"));
    if (inst) {
      this.sel_institution = inst;
    }

    this.show_switch = localStorage.getItem("inst_length");
    this.loadPermissions(this.role_id);
  },

  watch: {
    user: {
      immediate: true,
      handler() {
        if (this.user.id > 0) {
          this.$emit("getuserdetails", this.user);
        }
      },
    },
  },
  created() {
    this.emitter.on("updateProfileImage", () => {
      this.fetchUserData();
    });

    this.emitter.on("institutionChanged", (inst) => {
      this.sel_institution = inst;
    });
  },
  methods: {
    async loadPermissions(role_id) {
      try {
        const res = await this.$axios.get("check_action_permission", {
          params: {
            role_id: role_id,
          },
        });
        if (res.data.status === "S") {
          this.permissions = res.data.permissions;
          localStorage.setItem(
            "action_permissions",
            JSON.stringify(this.permissions)
          );
          this.action_permissions = JSON.parse(
            localStorage.getItem("action_permissions") || "[]"
          );
        }
      } catch (error) {
        this.permissions = [];
      }
    },
    resetPasswordRedirect() {
      this.menu = false;
      this.$router.push({
        name: "reset_password",
      });
    },
    fetchUserData() {
      this.user = JSON.parse(localStorage.getItem("user_data"));
    },
    ...mapActions("auth", ["logoutUser"]),
    logoutUser() {
      this.menu = false;
      this.$store
        .dispatch("auth/logoutUser")
        .then(() => {
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Logout failed", error);
        });
    },
    // async login() {
    //   await this.loginRequest(this.userdata).then(() => {
    //     // console.log("userdata are", this.userdata);
    //     this.btnloading = true;
    //     this.$router.push({
    //       name: "dashboard",
    //     });
    //   });
    // },
  },
};
</script>

<style scoped>
.profile-menu-card {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08),
    0 15px 15px -6px rgba(0, 0, 0, 0.06);
}

/* HEADER */
.profile-menu-header {
  padding: 16px;
  background: linear-gradient(135deg, #05668d, #034a66);
  color: white;
}

.profile-menu-label {
  font-size: 11px;
  text-transform: uppercase;
  opacity: 0.8;
}

.profile-menu-user {
  display: flex;
  align-items: center;
  margin-top: 6px;
  gap: 10px;
}

.profile-menu-email {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* LIST */
.profile-menu-list {
  padding: 6px 0;
}

/* ITEM */
.profile-menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.profile-menu-item:hover {
  background: rgba(37, 99, 235, 0.08);
}

.profile-menu-item.logout:hover {
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
}

/* TEXT */
.profile-menu-item .text {
  flex: 1;
  font-weight: 500;
  font-size: 14px;
}

/* ACCENT BAR */
.profile-menu-item .accent {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  border-radius: 0 4px 4px 0;
}

.profile-menu-item:hover .accent {
  opacity: 1;
}

.accent.blue {
  background: #2563eb;
}

.accent.red {
  background: #dc2626;
}

/* DARK MODE */
.profile-menu-card.dark {
  background: #1f1f1f;
  color: white;
}
.v-list-item:deep(.v-list-item__prepend) {
  display: block;
}
.down-arrow-icon {
  color: #05668d !important;
  opacity: 10 !important;
}
</style>
