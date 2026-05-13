<template>
  <v-app>
    <content-loader v-if="loader"></content-loader>
    <div>
      <transition name="fade" mode="out-in" appear>
        <div class="background">
          <div class="login-box-custom pa-6">
            <!-- ================= LOGO ================= -->
            <div class="text-center mb-4">
              <img v-if="app_image_url" :src="app_image_url" width="130" />
              <h3 v-else>{{ application_name }}</h3>
            </div>

            <v-divider class="mb-4" />

            <!-- ================= TITLE ================= -->
            <div class="section-label text-center mb-3">
              {{ $t("forgot_password") }}
            </div>

            <!-- ================= FORM ================= -->
            <v-form ref="form" v-model="valid">
              <!-- EMAIL -->
              <div class="form-label">
                {{ $t("email") }}
              </div>

              <v-text-field
                v-model="userdata.email"
                :rules="[...fieldRules, ...emailRules]"
                :class="[
                  sel_lang == 'ar' ? 'rtl styled-field' : 'styled-field',
                ]"
                density="compact"
                variant="outlined"
                hide-details="auto"
                prepend-inner-icon="mdi-email-outline"
                :placeholder="$t('email')"
                @keyup.enter="requestResetPassword"
              />

              <!-- ERROR MESSAGE -->
              <div
                v-if="error_message && show_error"
                class="error_message mt-2"
              >
                <v-icon size="16" class="mr-1">
                  mdi-close-circle-outline
                </v-icon>
                {{ error_message }}
              </div>

              <!-- SUBMIT BUTTON -->
              <v-btn
                block
                class="mt-4 sign-in-btn"
                :loading="btnloading"
                :disabled="btnloading || valid == false || !userdata.email"
                height="44"
                @click="requestResetPassword"
              >
                <span class="btn-text">
                  {{ $t("submit") }}
                </span>
                <v-icon class="ml-2" size="18"> mdi-arrow-right </v-icon>
              </v-btn>

              <!-- BACK TO LOGIN -->
              <div class="text-center mt-4">
                <router-link to="/" class="forgot-link">
                  <v-icon size="16" class="mr-1"> mdi-keyboard-return </v-icon>
                  {{ $t("sign_in") }}
                </router-link>
              </div>
            </v-form>
          </div>
        </div>
      </transition>
    </div>
  </v-app>
</template>

<script>
import localStorageWrapper from "../../localStorageWrapper.js";

export default {
  name: "LoginPage",
  data: () => ({
    valid: false,
    userdata: {
      email: "",
      password: "",
    },
    show1: false,
    isDisabled: false,
    user: "",
    btnloading: false,
    userprofile: "",
    loader: false,
    app_image_url: "",
    application_name: "EPAF",
    app_name: "",
    error_message: "",
    show_error: false,
    sel_lang: "en",
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    emailRules() {
      return [
        (v) => !!v || "Email is required",
        (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address",
      ];
    },

    // ...mapGetters(["errors"]),
  },

  mounted() {
    this.valid = false;
    this.selectedLang();
  },

  created() {
    this.getAppImage();
  },

  methods: {
    selectedLang() {
      if (localStorage.getItem("pref_lang")) {
        this.sel_lang = localStorage.getItem("pref_lang");
      } else {
        this.sel_lang = "en";
      }
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
    requestResetPassword() {
      if (this.$refs.form.validate()) {
        this.btnloading = true;
        this.loader = true;
        this.$axios
          .post("reset_password?email=" + this.userdata.email + "&role=User")
          .then((response) => {
            this.response = response.data;
            this.message = response.data.message;
            this.status = response.data.status;
            if (this.status == "S") {
              this.btnloading = true;
              this.$toast.success(this.message);
              setTimeout(() => {
                this.$router.push({
                  name: "reset_password_form",
                  params: {
                    email: this.userdata.email,
                  },
                });
                this.btnloading = false;
                this.loader = false;
              }, 500);
            } else if (this.status == "E") {
              this.$toast.error(this.message);
              this.btnloading = false;
              this.loader = false;
            }
          })
          .catch((err) => {
            this.btnloading = false;
            this.loader = false;
            this.error_message = err.response.data.message;
            this.show_error = true;
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped>
.v-messages__message,
.v-text-field--is-booted .error--text {
  color: red;
}
.font-login {
  font-size: 35px;
  color: black;
}

.d-flex {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: #fff;
}
.h-120 {
  height: 120%;
}
.font-sign-in-msg {
  font-size: 1.175rem;
  font-weight: normal;
}
.error_message {
  color: red;
  font-style: italic;
}
/* ===== CARD STYLE (applied inside login-box-custom) ===== */

.login-box-custom {
  width: 410px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
}

/* ===== LABEL SYSTEM ===== */

.form-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 6px;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

/* ===== INPUT STYLE ===== */

.styled-field :deep(.v-field) {
  border-radius: 10px;
  background: #f9fafb;
  transition: box-shadow 0.2s ease, background 0.2s ease;
}

.styled-field :deep(.v-field--focused) {
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.styled-field :deep(.v-field__outline) {
  color: #e5e7eb;
}

.styled-field :deep(.v-field--focused .v-field__outline) {
  color: #3b82f6;
}

.styled-field :deep(.v-field__prepend-inner .v-icon) {
  color: #9ca3af;
  font-size: 18px;
}

.styled-field :deep(.v-field--focused .v-field__prepend-inner .v-icon) {
  color: #3b82f6;
}

.styled-field :deep(input::placeholder) {
  color: #d1d5db;
  font-size: 14px;
}

/* ===== BUTTON ===== */

.sign-in-btn {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%) !important;
  color: #ffffff !important;
  border-radius: 10px !important;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: none;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}

.sign-in-btn:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
}

.sign-in-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.sign-in-btn:disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%) !important;
  box-shadow: none !important;
  color: #ffffff !important;
}

.btn-text {
  font-size: 14px;
}

/* ===== LINK ===== */

.forgot-link {
  font-size: 12.5px;
  font-weight: 500;
  color: #3b82f6;
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: color 0.15s;
}

.forgot-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* ===== ERROR ===== */

.error_message {
  color: #dc2626;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
}

</style>
