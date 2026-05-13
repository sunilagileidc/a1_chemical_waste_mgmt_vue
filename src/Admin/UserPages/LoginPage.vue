<template>
  <v-app>
    <content-loader v-if="loader" />

    <div class="background d-flex justify-center align-center">
      <v-card class="pa-6 login-card" elevation="4">
        <!-- ================= LOGO ================= -->
        <!-- ---{{app_image_url}} -->
        <div class="text-center mb-4">
          <img v-if="app_image_url" :src="app_image_url" width="130" />
          <h3 v-else>{{ application_name }}</h3>
        </div>

        <v-divider class="mb-4" />

        <!-- ================= LOGIN FORM ==================== -->
        <v-form v-if="step === 'login'" ref="form" v-model="valid">
          <div class="form-label">Email Address</div>
          <v-text-field
            v-model="userdata.email"
            :rules="emailRules"
            placeholder="you@example.com"
            density="compact"
            variant="outlined"
            @keyup.enter="sendLoginOtp"
            hide-details="auto"
            class="styled-field"
            prepend-inner-icon="mdi-email-outline"
          />

          <div class="form-label mt-4">Password</div>
          <v-text-field
            v-model="userdata.password"
            :type="showPass ? 'text' : 'password'"
            :append-inner-icon="
              showPass ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
            "
            @click:append-inner="showPass = !showPass"
            placeholder="••••••••••••"
            density="compact"
            variant="outlined"
            hide-details="auto"
            :rules="passwordRules"
            @keyup.enter="sendLoginOtp"
            class="styled-field"
            prepend-inner-icon="mdi-lock-outline"
          />

          <div class="d-flex justify-end mt-1 mb-1">
            <router-link :to="{ name: 'forgot_password' }" class="forgot-link">
              {{ $t("recoverpassword") }}
            </router-link>
          </div>

          <v-btn
            block
            class="mt-3 sign-in-btn"
            :loading="btnloading"
            :disabled="!valid"
            @click="sendLoginOtp"
            height="44"
          >
            <span class="btn-text">Sign In</span>
            <v-icon class="ml-2" size="18">mdi-arrow-right</v-icon>
          </v-btn>
        </v-form>

        <!-- ================= OTP SECTION =================== -->
        <div v-if="step === 'otp'" class="otp-wrapper">
          <div class="otp-header text-center">
            <div class="section-label">Verification Code</div>
            <div class="otp-subtext">
              OTP sent to <strong>{{ userdata.email }}</strong>
            </div>
          </div>

          <div class="otp-input-row">
            <v-otp-input
              v-model:value="verification_code"
              :num-inputs="6"
              separator=" "
              input-classes="otp-input"
              :should-auto-focus="true"
            />
          </div>

          <!-- TIMER -->
          <div class="resend-section">
            <div v-if="timecount > 0" class="countdown-row">
              <span class="countdown-dot"></span>
              <span class="time_data">
                Resend in <strong>{{ timecount }}</strong
                >s
              </span>
            </div>

            <div v-else class="resend-btn-wrapper">
              <v-btn
                variant="text"
                size="small"
                class="resend-btn"
                @click="resendLoginOtp"
              >
                Resend OTP
              </v-btn>
            </div>
          </div>

          <div class="action-row">
            <v-btn
              size="small"
              class="cancel-btn"
              variant="outlined"
              @click="step = 'login'"
            >
              Back
            </v-btn>

            <v-spacer />

            <v-btn
              class="submit-btn"
              color="green"
              :loading="isBtnLoading"
              :disabled="verification_code.length !== 6"
              @click="verifyotp"
            >
              Submit
            </v-btn>
          </div>
        </div>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import localStorageWrapper from "../../localStorageWrapper.js";
export default {
  data() {
    return {
      step: "login",

      userdata: {
        email: "",
        password: "",
      },
      verification_code: "",
      valid: false,
      loader: false,
      btnloading: false,
      isBtnLoading: false,
      showPass: false,
      app_image_url: "",
      application_name: "",
      timecount: 60,
      timer: null,
      login_otp_enabled: 0,
    };
  },

  computed: {
    emailRules() {
      return [
        (v) => !!v || "Email is required",
        (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address",
      ];
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
  },

  mounted() {
    this.fetchAppImage();
  },

  methods: {
    startTimer() {
      clearInterval(this.timer); // stop old timer if exists

      this.timer = setInterval(() => {
        if (this.timecount > 0) {
          this.timecount--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },

    /* ================= FETCH APP LOGO ================= */
    fetchAppImage() {
      this.$axios.get("fetch_image_url").then((res) => {
        this.application_name = res.data.application_name;
        this.login_otp_enabled = res.data.login_otp_enabled.status;
        if (res.data.parameter_image) {
          this.app_image_url = res.data.parameter_image.image_full_url;
        }

        localStorageWrapper.setItem("App_Image_Url", this.app_image_url);
        localStorageWrapper.setItem("App_Name", this.application_name);
      });
    },

    /* ================= SEND OTP ================= */
    async sendLoginOtp() {
      if (!this.$refs.form.validate()) return;

      this.loader = true;
      this.btnloading = true;

      try {
        // ================= OTP FLOW =================
        const otpEnabled = Number(this.login_otp_enabled) === 1;
        if (otpEnabled) {
          const res = await this.$axios.post(
            `send_login_otp?email=${this.userdata.email}&password=${this.userdata.password}&role=User`
          );

          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.step = "otp";
            this.timecount = 60;
            this.startTimer();
          } else {
            this.$toast.error(res.data.message);
          }
        } else {
          await this.$store.dispatch("auth/loginRequest", this.userdata);
          localStorage.setItem("active_menu", "Dashboard");
          this.$router.push({ name: "dashboard" });
        }
      } catch (err) {
        // ================= COMMON ERROR HANDLING =================
        if (err.response) {
          if (err.response.status === 429) {
            this.$toast.error(
              "Too many attempts. Please try again after 2 minutes."
            );
          } else {
            this.$toast.error(
              err.response.data.message || "Something went wrong"
            );
          }
        } else {
          this.$toast.error("Network error");
        }
      } finally {
        // ================= COMMON LOADER STOP =================
        this.loader = false;
        this.btnloading = false;
      }
    },
    /* ================= VERIFY OTP ================= */
    verifyotp() {
      this.loader = true;
      this.isBtnLoading = true;

      this.$axios
        .post("login_otp_validate", {
          otp: this.verification_code,
          email: this.userdata.email,
        })
        .then(async (res) => {
          if (res.data.status === "S") {
            await this.$store.dispatch("auth/loginRequest", this.userdata);
            this.$router.push({ name: "dashboard" });
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
          this.isBtnLoading = false;
        });
    },

    /* ================= RESEND OTP ================= */
    resendLoginOtp() {
      this.timecount = 60;
      this.startTimer();
      this.$axios.post(`resend_otp_validate?email=${this.userdata.email}`);
      this.$toast.success("OTP resent");
    },
  },
};
</script>

<style scoped>
.login-card {
  width: 410px;
  border-radius: 12px;
}

.otp-input {
  width: 45px !important;
  height: 45px;
  font-size: 18px;
}

/* ===== NEW FORM STYLES (v-form only) ===== */

.form-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 6px;
}

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
/* ── OTP WRAPPER ── */
.otp-wrapper {
  margin-top: 12px;
}

.otp-header {
  margin-bottom: 16px;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 6px;
}

.otp-subtext {
  font-size: 0.9rem;
  color: #374151;
}

/* ── OTP INPUT STYLE (Premium Style) ── */
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

.otp-input-row {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

/* ── Countdown ── */
.resend-section {
  margin-bottom: 18px;
}

.countdown-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.countdown-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4f6ef7;
  animation: pulse 1.4s ease-in-out infinite;
}

.time_data {
  font-size: 0.82rem;
  color: #6b7280;
}

.time_data strong {
  color: #4f6ef7;
  font-weight: 700;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.75); }
}

/* ── Resend Button ── */
.resend-btn-wrapper {
  display: flex;
  justify-content: center;
}

.resend-btn {
  font-size: 0.82rem !important;
  text-transform: none !important;
  letter-spacing: 0 !important;
  font-weight: 500 !important;
  color: #4f6ef7 !important;
}

/* ── Action Row ── */
.action-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f8;
}

.cancel-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
}

.submit-btn {
  border-radius: 8px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 20px !important;
}

</style>