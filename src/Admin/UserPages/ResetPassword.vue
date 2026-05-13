<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('reset_password')"
        :google_icon="google_icon"
      ></page-title>
    </div>

    <!-- Card -->
    <v-card class="reset-card" elevation="1">
      <div class="card-inner pt-0">
        <v-form autocomplete="off" ref="form" v-model="valid">
          <!-- Email display -->
          <div class="email-row">
            <span class="material-symbols-outlined email-icon">mail</span>
            <div>
              <span class="email-label">{{ $t("email") }}</span>
              <span class="email-value">{{ userprofile.email }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Fields -->
          <div class="fields-stack">
            <v-row>
              <v-col cols="12" md="4">
                <div class="field-group">
                  <label class="field-label">{{
                    $t("current_password")
                  }}</label>
                  <v-tooltip
                    :text="this.$t('current_password')"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="fieldItem.currentpassword"
                        v-bind:label="$t('current_password')"
                        required
                        v-bind="props"
                        :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        :rules="fieldRules"
                        class="required_field styled-field"
                        variant="outlined"
                        density="compact"
                        @click:append-inner="show1 = !show1"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-group">
                  <label class="field-label">{{ $t("new_password") }}</label>
                  <v-tooltip :text="this.$t('new_password')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="fieldItem.newpassword"
                        v-bind:label="$t('new_password')"
                        :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show2 ? 'text' : 'password'"
                        v-bind="props"
                        required
                        :rules="passwordRules"
                        class="required_field styled-field"
                        variant="outlined"
                        density="compact"
                        @click:append-inner="show2 = !show2"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </div>
              </v-col>
              <v-col cols="12" md="4">
                <div class="field-group">
                  <label class="field-label">{{
                    $t("confirm_password")
                  }}</label>
                  <v-tooltip
                    :text="this.$t('confirm_password')"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-model="fieldItem.confirmpassword"
                        v-bind:label="$t('confirm_password')"
                        :append-inner-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show3 ? 'text' : 'password'"
                        v-bind="props"
                        required
                        :rules="[
                          ...passwordRules,
                          (v) =>
                            !!fieldItem.confirmpassword ||
                            $t('password_confirm'),
                          (v) =>
                            fieldItem.newpassword ===
                              fieldItem.confirmpassword ||
                            $t('confirm_password_match'),
                        ]"
                        class="required_field styled-field"
                        variant="outlined"
                        density="compact"
                        @click:append-inner="show3 = !show3"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- Password requirements hint -->
          <div class="password-hints">
            <span class="hint-chip">12+ characters</span>
            <span class="hint-chip">Uppercase</span>
            <span class="hint-chip">Number</span>
            <span class="hint-chip">Alphanumeric</span>
          </div>

          <!-- Actions -->
          <div class="action-row">
            <v-tooltip :text="this.$t('cancel')" location="bottom">
              <template v-slot:activator="{ props }">
                <div v-bind="props" class="d-inline-block">
                  <v-btn
                    v-bind="props"
                    size="small"
                    @click="cancel"
                    :disabled="isBtnLoading"
                    class="btn-cancel"
                    color="cancel"
                    >{{ $t("cancel") }}</v-btn
                  >
                </div>
              </template>
            </v-tooltip>

            <v-tooltip :text="this.$t('submit')" location="bottom">
              <template v-slot:activator="{ props }">
                <div v-bind="props" class="d-inline-block">
                  <v-btn
                    :disabled="isDisabled"
                    @click="submit"
                    size="small"
                    class="btn-submit"
                    color="success"
                  >
                    {{ $t("submit") }}
                    <v-progress-circular
                      v-if="isBtnLoading"
                      indeterminate
                      width="1"
                      color="cancel"
                      size="x-small"
                      class="ml-2"
                    ></v-progress-circular>
                  </v-btn>
                </div>
              </template>
            </v-tooltip>
          </div>
        </v-form>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    google_icon: {
      icon_name: "lock_reset",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    message: "",
    userprofile: "",
    isDisabled: false,
    isBtnLoading: false,
    show1: false,
    show2: false,
    show3: false,
    fieldItem: {
      currentpassword: "",
      newpassword: "",
      confirmpassword: "",
      claim_profile: "N",
      email: "",
    },
    currentpasswordtoggle: String,
    newpasswordtoggle: String,
    confirmpwdtoggle: String,
    newpasswordshow: false,
    confirmpasswordshow: false,
  }),
  computed: {
    minlength() {
      return [
        (v) => v.length > 7 || this.$t("password_length"),
        (v) => !!v || this.$t("field_required"),
      ];
    },
    fieldRules() {
      return [(v) => (!!v && !!v.trim()) || this.$t("field_required")];
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
  created() {},
  watch: {},
  mounted() {
    this.userprofile = JSON.parse(localStorage.getItem("user_data"));
  },
  methods: {
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        if (this.fieldItem.newpassword != this.fieldItem.confirmpassword) {
          this.message = "Confirm password is not matching with new password";
          this.$toast.error(this.message);
        } else {
          this.isDisabled = true;
          this.isBtnLoading = true;
          this.fieldItem.email = this.userprofile.email;
          this.fieldItem.user_id = this.userprofile.id;
          this.$axios
            .post("resetuserpassword", this.fieldItem)
            .then(
              (res) => {
                if (Array.isArray(res.data.message)) {
                  this.array_data = res.data.message.toString();
                } else {
                  this.array_data = res.data.message;
                }
                if (res.data.status == "E") {
                  (this.message = this.array_data), (this.isDisabled = false);
                  this.isBtnLoading = false;
                  this.$toast.error(this.message);
                  this.valid_success = false;
                } else {
                  this.$toast.success(this.array_data);
                  this.valid_success = true;
                  this.$router.push({ name: "dashboard" });
                  this.isDisabled = false;
                  this.isBtnLoading = false;
                }
              },
              (error) => {
                console.log(error);
                (this.message = this.$t("too_many_request")),
                  (this.isDisabled = true),
                  (this.isBtnLoading = false);
                this.$toast.error(this.message);
                setTimeout(() => (this.isDisabled = false), 120000);
                setTimeout(() => (this.message = "Now try again"), 120000);
              }
            )
            .catch((err) => {
              console.log("error data", err);
              this.valid_success = false;
              this.message = this.$t("password_error");
              this.$toast.error(this.message);
            });
        }
      } else {
        this.message = this.$t("invalid_form");
        this.$toast.error(this.message);
      }
    },
    cancel() {
      this.$router.push({ name: "dashboard" });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@400;600;700&display=swap");

/* ── Card ── */
.reset-card {
  border-radius: 16px !important;
}

.card-inner {
  padding: 24px 28px 20px;
}

/* ── Email Row ── */
.email-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f4f6fb;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 20px;
}

.email-icon {
  font-size: 18px;
  color: #5c6bc0;
}

.email-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9da3b0;
  line-height: 1;
  margin-bottom: 2px;
}

.email-value {
  display: block;
  font-size: 13.5px;
  font-weight: 500;
  color: #2d3142;
}

/* ── Divider ── */
.divider {
  height: 1px;
  background: linear-gradient(to right, #e8eaed, transparent);
  margin-bottom: 20px;
}

/* ── Fields ── */
.fields-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 5px;
}

/* Override Vuetify field styling */
.styled-field :deep(.v-field) {
  border-radius: 10px !important;
  background: #f9fafb !important;
}

.styled-field :deep(.v-field--focused) {
  background: #ffffff !important;
}

.styled-field :deep(.v-field__outline) {
  color: #e2e5ec !important;
}

.styled-field :deep(.v-field--focused .v-field__outline) {
  color: #5c6bc0 !important;
}

/* ── Password hints ── */
.password-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  margin-bottom: 4px;
}

.hint-chip {
  font-size: 10.5px;
  font-weight: 500;
  color: #7986cb;
  background: #eef0fc;
  border-radius: 20px;
  padding: 3px 10px;
  border: 1px solid #d5d9f5;
  letter-spacing: 0.01em;
}

/* ── Actions ── */
.action-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #f0f2f5;
}

.btn-cancel {
  border-radius: 8px !important;
  font-family: "DM Sans", sans-serif !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  letter-spacing: 0.01em !important;
  text-transform: none !important;
}

.btn-submit {
  border-radius: 8px !important;
  font-family: "DM Sans", sans-serif !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  letter-spacing: 0.01em !important;
  text-transform: none !important;
  min-width: 90px !important;
}
</style>