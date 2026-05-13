<template>
  <div class="gradient-custom ma-0">
    <transition name="fade" mode="out-in" appear>
      <div class="background form_alignment">
        <b-row>
          <b-col
            lg="8"
            md="12"
            class="h-120 d-flex bg-transparent justify-content-center align-items-center"
          >
            <v-card class="card-wrapper">
              <b-col lg="9" md="10" sm="12" class="mx-3 p-3 v-card">
                <div class="card-header-section">
                  <div class="brand-area">
                    <div class="font-login">
                      <div v-if="app_image_url">
                        <span>
                          <img
                            v-bind:src="app_image_url"
                            style="width: 130px"
                          />
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
                    </div>
                    <div class="page-title-row">
                      <div class="title-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <span class="font-sign-in-msg">{{ $t("reset_password") }}</span>
                    </div>
                  </div>
                </div>

                <div class="divider-line"></div>

                <div class="card-body">
                  <transition name="slide-fade">
                    <div class="alert-error" v-if="status == 'E'">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {{ message }}
                    </div>
                  </transition>
                  <transition name="slide-fade">
                    <div class="alert-success" v-if="status == 'S'">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {{ message }}
                    </div>
                  </transition>
                </div>

                <v-form autocomplete="off" ref="form" v-model="valid">
                  <div class="email-display-row mb-5">
                    <div class="email-label">{{ $t("email") }}</div>
                    <div class="email-value">{{ email }}</div>
                  </div>

                  <div class="form-group otp-section">
                    <div class="section-label">Verification Code</div>
                    <div class="position-relative" style="max-width: 440px">
                      <div class="otp-row">
                        <v-otp-input
                          ref="otpInput"
                          v-model:value="verification_code"
                          input-classes="otp-input"
                          separator=" "
                          :num-inputs="6"
                          :should-auto-focus="true"
                          input-type="letter-numeric"
                          @on-change="handleOnChange"
                          @on-complete="handleOnComplete"
                        />
                      </div>
                      <v-overlay absolute :value="loading">
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-overlay>
                    </div>
                  </div>

                  <div class="form-group resend-section">
                    <span v-show="textvisible" class="countdown-row">
                      <span class="countdown-dot"></span>
                      <span class="time_data">
                        {{ $t("resend_code_format") }} <strong>{{ timecount }}</strong> {{ $t("seconds") }}
                      </span>
                    </span>

                    <div class="Resendbtn mt-3">
                      <v-tooltip
                        :text="this.$t('resend_code')"
                        location="bottom"
                      >
                        <template v-slot:activator="{ props }">
                          <div class="d-inline-block">
                            <v-chip
                              small
                              label
                              color="primary"
                              size="x-small"
                              @click="requestpassword"
                              v-bind="props"
                              :disabled="isdisabled"
                              :loading="isbtnLoading"
                              v-show="btnvisible"
                              class="resend-btn"
                              ><v-icon icon="mdi-email-sync-outline" start></v-icon>{{ $t("resend_code") }}
                            </v-chip>
                          </div>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>

                  <div class="row password-fields">
                    <div class="col-md-12 mt-5 pb-2">
                      <v-tooltip :text="this.$t('password')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            class="required_field show_icon styled-input"
                            :append-inner-icon="
                              show2 ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="show2 ? 'text' : 'password'"
                            @click:append-inner="show2 = !show2"
                            v-model="new_password"
                            :rules="[...passwordRules, ...fieldRules]"
                            v-bind:label="$t('password')"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            required
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </div>
                    <div class="col-md-12 pb-2">
                      <v-tooltip :text="this.$t('lastname')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-bind="props"
                            class="required_field show_icon styled-input"
                            :append-inner-icon="
                              show1 ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="show1 ? 'text' : 'password'"
                            @click:append-inner="show1 = !show1"
                            v-model="password_confirmation"
                            :rules="[
                              !!password_confirmation || $t('password_confirm'),
                              new_password === password_confirmation ||
                                $t('confirm_password_match'),
                            ]"
                            v-bind:label="$t('confirm_password')"
                            required
                            hide-details="auto"
                            @keyup.enter="resetPassword"
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </div>
                  </div>
                </v-form>

                <div class="action-row">
                  <v-tooltip :text="this.$t('cancel')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <div class="d-inline-block">
                        <v-btn
                          size="small"
                          class="ma-1 font-weight-bold cancel-btn"
                          color="cancel"
                          plain
                          small
                          :disabled="isBtnLoading"
                          v-bind="props"
                          @click="$router.go(-1)"
                        >
                          {{ $t("cancel") }}
                        </v-btn>
                      </div>
                    </template>
                  </v-tooltip>
                  <v-tooltip :text="this.$t('resend_code')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <div class="d-inline-block">
                        <v-btn
                          :disabled="isDisabled"
                          :loading="isBtnLoading"
                          @click="resetPassword"
                          size="small"
                          color="green"
                          v-bind="props"
                          class="submit-btn"
                          >{{ $t("submit") }}
                        </v-btn>
                      </div>
                    </template>
                  </v-tooltip>
                </div>
              </b-col>
            </v-card>
          </b-col>
        </b-row>
      </div>
    </transition>
  </div>
</template>

<script>
import localStorageWrapper from "../../localStorageWrapper.js";

export default {
  name: "LoginPage",
  data: () => ({
    token: null,
    emaildata: null,
    new_password: "",
    password_confirmation: "",
    verification_code: "",
    has_error: false,
    status: "",
    message: "",
    data: "",
    user: "",
    valid: true,
    isDisabled: false,
    isBtnLoading: false,
    isdisabled: false,
    isbtnLoading: false,
    confirmpasswordtoggle: String,
    newpasswordtoggle: String,
    loading: false,
    snackbar: false,
    snackbarColor: "default",
    show1: false,
    show2: false,
    otp: "",
    text: "",
    expectedOtp: "",
    length: 7,
    btnvisible: false,
    timecount: 60,
    textvisible: true,
    app_image_url: "",
    application_name: "",
    app_name: "",
    loader: false,
  }),
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    passwordRules() {
      return [
        (v) => !!v || "Password required",
        (v) => v.length >= 12 || "Minimum 12 characters required",
        (v) => /[A-Z]/.test(v) || "At least 1 uppercase letter required",
        (v) =>
          /[a-zA-Z0-9]/.test(v) || "At least 1 alphanumeric character required",
        (v) => /\d/.test(v) || "At least 1 number required",
      ];
    },

    emailRules() {
      return [
        (v) => !!v || "Email is required",
        (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address",
      ];
    },
  },

  mounted() {
    this.emaildata = localStorage.getItem("verifyemail");
    setTimeout(() => (this.btnvisible = true), 60000);
    setTimeout(() => (this.textvisible = false), 60000);
  },
  watch: {
    timecount: {
      handler(value) {
        if (value > 0) {
          setTimeout(() => {
            this.timecount--;
          }, 1000);
        }
      },
      immediate: true,
    },
    "$route.params.email": {
      immediate: true,
      handler() {
        if (this.$route.params.email) {
          this.email = this.$route.params.email;
          this.emaildata = this.$route.params.email;
        }
      },
    },
  },
  created() {
    this.getAppImage();
  },

  methods: {
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
    requestpassword() {
      this.timecount = 60;
      this.textvisible = true;
      setTimeout(() => (this.textvisible = false), 60000);
      this.btnvisible = false;
      setTimeout(() => (this.btnvisible = true), 60000);
      this.isdisabled = true;
      this.isbtnLoading = true;
      this.$axios
        .post("resend_otp_validate?email=" + this.email)
        .then((response) => {
          this.response = response.data;
          this.message = response.data.message;
          this.status = response.data.status;

          this.isdisabled = false;
          this.isbtnLoading = false;
        })
        .catch((err) => {
          this.isdisabled = false;
          this.isbtnLoading = false;
          console.log(err);
        });
    },
    resetPassword() {
      if (this.$refs.form.validate()) {
        if (this.new_password != this.password_confirmation) {
          this.status = "E";
          this.message = this.$t("password_not_match");
          this.isDisabled = false;
          this.isBtnLoading = false;
        } else {
          this.isDisabled = true;
          this.isBtnLoading = true;
          this.$axios
            .post("resetpassword", {
              otp: this.verification_code,
              email: this.email,
              password: this.new_password,
              password_confirmation: this.password_confirmation,
            })
            .then(
              (response) => {
                if (Array.isArray(response.data.message)) {
                  this.array_data = response.data.message.toString();
                } else {
                  this.array_data = response.data.message;
                }
                this.message = response.data.message;
                this.status = response.data.status;
                if (response.data.status == "S") {
                  setTimeout(() => this.$router.push({ name: "login" }), 1000);
                  localStorage.removeItem("verifyemail");
                } else if (response.data.status == "E") {
                  this.message = response.data.message;
                  this.isDisabled = false;
                  this.isBtnLoading = false;
                }
              },
              (error) => {
                console.log(error);
                this.message = this.$t("too_many_request");
              }
            )
            .catch((err) => {
              console.log("error data", err);
            });
        }
      }
    },
    // handleOnChange(resp) {

    // },
    handleOnComplete(resp) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.snackbarColor = resp === this.expectedOtp ? "success" : "warning";
        this.text = `Processed OTP with "${resp}" (${this.snackbarColor})`;
        this.snackbar = true;
      }, 3500);
    },
    requestResetPassword() {
      if (this.$refs.form.validate()) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.loader = true;
        this.$axios
          .post("reset_password?email=" + this.email + "&role=User")
          .then((response) => {
            console.log(response);
            this.response = response.data;
            this.message = response.data.message;
            this.status = response.data.status;
            if (this.status == "S") {
              this.$toast.success(this.message);
              setTimeout(
                () =>
                  this.$router.push({
                    name: "forgot_password",
                    params: { email: this.email },
                  }),
                1000
              );
            } else if (this.status == "E") {
              this.$toast.error(this.message);
            }
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.loader = false;
          })
          .catch((err) => {
            this.isDisabled = false;
            this.isBtnLoading = false;
            this.loader = false;
            console.log(err);
          });
      }
    },
  },
};
</script>

<style scoped>
/* ── Page Background ── */
.gradient-custom {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8edf8 40%, #dde4f0 100%);
  position: relative;
}

.gradient-custom::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 15% 20%, rgba(99, 130, 220, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 50% 60% at 85% 80%, rgba(130, 99, 180, 0.10) 0%, transparent 60%);
  pointer-events: none;
}

.form_alignment {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 32px 16px;
}

.h-120 {
  height: auto;
  min-height: 100vh;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

/* ── Card ── */
.card-wrapper {
  border-radius: 20px !important;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.07),
    0 20px 60px -10px rgba(80, 100, 180, 0.18) !important;
  overflow: hidden;
  background: #ffffff !important;
  border: 1px solid rgba(200, 210, 240, 0.6) !important;
  transition: box-shadow 0.3s ease;
}

.card-wrapper:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 28px 70px -12px rgba(80, 100, 180, 0.24) !important;
}

.v-card {
  padding: 10px;
  background: #ffffff;
}

/* ── Header ── */
.card-header-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 4px;
}

.brand-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.font-login {
  font-size: 35px;
  color: #1a1f36;
  display: flex;
  justify-content: center;
}

.font-base-app {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #1a1f36;
  font-family: 'Georgia', serif;
}

.page-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4f6ef7, #7c3aed);
  border-radius: 8px;
  color: #ffffff;
  flex-shrink: 0;
}

.font-sign-in-msg {
  font-size: 1.05rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: -0.2px;
}

/* ── Divider ── */
.divider-line {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(79, 110, 247, 0.25), transparent);
  margin: 20px 0 8px;
}

/* ── Alert Banners ── */
.alert-error,
.alert-success {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.alert-error {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.alert-success {
  background: rgba(34, 197, 94, 0.08);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

/* ── Email Display ── */
.email-display-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8faff;
  border: 1px solid #e2e8f7;
  border-radius: 10px;
  padding: 10px 16px;
}

.email-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  white-space: nowrap;
}

.email-value {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

/* ── OTP Section ── */
.otp-section {
  margin-top: 4px;
}

.section-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 10px;
}

.otp-row {
  display: flex;
  flex-direction: row;
}

:deep(.otp-input) {
  width: 44px !important;
  height: 48px !important;
  border: 2px solid #d1d9f0 !important;
  border-radius: 10px !important;
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #1a1f36 !important;
  background: #f8faff !important;
  text-align: center !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
  outline: none !important;
}

:deep(.otp-input:focus) {
  border-color: #4f6ef7 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.12) !important;
}

/* ── Resend Section ── */
.resend-section {
  margin-top: 5px;
}

.countdown-row {
  display: flex;
  align-items: center;
  gap: 7px;
}

.countdown-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4f6ef7;
  animation: pulse 1.4s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.75); }
}

.time_data {
  font-size: 0.82rem;
  color: #6b7280;
}

.time_data strong {
  color: #4f6ef7;
  font-weight: 700;
}

.Resendbtn {
  display: flex;
  justify-content: flex-end;
}

.resend-btn {
  font-size: 0.8rem !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
}

/* ── Password Fields ── */
.password-fields .col-md-12 {
  padding-left: 0;
  padding-right: 0;
}

.show_icon :deep(i) {
  z-index: 1000;
}

:deep(.v-text-field.styled-input .v-field) {
  border-radius: 10px;
}

:deep(.v-text-field.styled-input .v-field--focused .v-field__outline) {
  color: #4f6ef7;
}

:deep(.v-messages__message) {
  color: #dc2626;
  font-size: 0.78rem;
}

/* ── Action Row ── */
.action-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f8;
}

.cancel-btn {
  color: #6b7280 !important;
  background: #f3f4f8 !important;
  border-radius: 8px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-weight: 500 !important;
  box-shadow: none !important;
  border: 1px solid #e2e4ed !important;
  transition: background 0.2s ease, color 0.2s ease !important;
}

.cancel-btn:hover:not(:disabled) {
  background: #e8eaf0 !important;
  color: #374151 !important;
}

.submit-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-weight: 600 !important;
  padding: 0 20px !important;
}

/* ── d-flex override ── */
.d-flex {
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: transparent;
}

/* ── Transitions ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>