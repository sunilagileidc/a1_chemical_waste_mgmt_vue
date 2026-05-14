<template>
  <div class="top-bar-wrapper">
    <div class="top-bar-container">
      <!-- LEFT: LOGO -->
      <div class="logo" @click="$router.push('/')">
        <!-- <img src="@/assets/images/headericon.png" alt="ePAF Logo" /> -->
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
      </div>
      <!-- RIGHT: BUTTONS -->
      <div class="auth-buttons" v-if="$route.name != 'not-found'">
        <v-btn
          variant="outlined"
          class="register-btn"
          size="small"
          @click="$router.push({ name: 'register_user' })"
        >
          Register →
        </v-btn>

        <v-btn
          variant="filled"
          class="btn-filled"
          size="small"
          @click="$router.push({ name: 'login' })"
        >
          Login →
        </v-btn>
      </div>
    </div>
  </div>
</template>
<script>
import localStorageWrapper from "../../../src/localStorageWrapper.js";

export default {
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

      lang: "",
    };
  },
  created() {
    this.appImageUpdate();
  },
  mounted() {},
  watch: {},
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
  },
};
</script>
<style scoped>
/* OUTER WRAPPER */
.top-bar-wrapper {
  width: 100%;
  background: #f4f6fb; /* page light background */
}

/* ROUNDED BAR */
.top-bar-container {
  margin: 0 auto;
  background: #e9ecf3; /* light grey container */
  border-radius: 20px;
  padding: 10px 30px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* LOGO */
.logo img {
  height: 65px;
  cursor: pointer;
  object-fit: contain;
}

/* BUTTON WRAPPER */
.auth-buttons {
  display: flex;
  gap: 16px;
}

/* OUTLINE BUTTON (Register) */

.btn-outline:hover {
  background: #6c63ff;
  color: white;
}

/* FILLED BUTTON (Login) */

.btn-filled:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(108, 99, 255, 0.3);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .top-bar-container {
    padding: 15px 20px;
  }

  .logo img {
    height: 65px;
  }

  .btn-outline,
  .btn-filled {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
