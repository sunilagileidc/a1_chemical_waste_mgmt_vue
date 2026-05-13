<script setup>
import { apptheme } from "../store/apptheme.js";
</script>
<template>
  <div class="d-flex">
    <v-menu v-model="menu" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar
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
            </v-avatar>
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
          <p class="profile-menu-label">Signed in as</p>

          <div class="profile-menu-user">
            <v-avatar
              size="36"
              :image="
                user.image_url ? envImagePath + user.image_url : default_src
              "
            />
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
          >
            <span class="accent blue"></span>
            <v-icon size="20" color="primary">mdi-account</v-icon>
            <span class="text">My Profile</span>
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
  }),
  mounted() {
    if (JSON.parse(localStorage.getItem("user_data"))) {
      this.user = JSON.parse(localStorage.getItem("user_data"));
      this.role_id = this.user.role_id;
    }
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
  },
  methods: {
    resetPasswordRedirect() {
      this.$router.push({
        name: "reset_password",
      });
    },
    fetchUserData() {
      this.user = JSON.parse(localStorage.getItem("user_data"));
    },
    ...mapActions("auth", ["logoutUser"]),
    logoutUser() {
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
  background: linear-gradient(135deg, #1e40af, #2563eb);
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
</style>
