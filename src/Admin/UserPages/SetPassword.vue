<template>
  <v-app>
    <content-loader v-if="loader"></content-loader>
    <div>
      <transition name="fade" mode="out-in" appear>
        <div class="background">
          <div class="login-box-custom">
            <div
              style="
                display: flex;
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div class="w-100 d-flex" style="flex-direction: column">
                <h4 class="mb-0"></h4>
                <div class="font-login">
                  <div v-if="app_image_url">
                    <span>
                      <img v-bind:src="app_image_url" style="width: 130px" />
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
                <span class="font-sign-in-msg">{{ $t("confirm_email") }}</span>
              </div>
            </div>

            <v-divider></v-divider>
            <div>
              <v-form ref="form" v-model="valid" class="w-100">
                <v-container>
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-tooltip :text="this.$t('email')" location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-text-field
                            v-model="userdata.email"
                            v-bind="props"
                            v-bind:class="[this.sel_lang == 'ar' ? 'rtl' : '']"
                            :rules="[...fieldRules, ...emailRules]"
                            v-bind:label="$t('email')"
                            @keyup.enter="requestResetPassword"
                            required
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                      class="error_message pt-0"
                      v-if="error_message && show_error"
                      ><v-icon style="font-size: 18px" class="mr-1"
                        >mdi mdi-close-circle-outline</v-icon
                      >{{ error_message }}</v-col
                    >
                  </v-row>
                  <div class="divider" />
                  <div class="d-flex align-items-center mt-2">
                    <div class="ml-auto w-100">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <div v-on="on" class="d-inline-block w-100">
                            <v-btn
                              :disabled="
                                btnloading || valid == false || !userdata.email
                              "
                              class="btn-theme-blue w-100"
                              small
                              @click="requestResetPassword"
                              >{{ $t("send_otp") }}
                            </v-btn>
                          </div>
                        </template>
                        <span>{{ $t("send_otp") }}</span>
                      </v-tooltip>
                    </div>
                  </div>
                </v-container>
                <!-- <div class="row text-center">
                  <div :disabled="isDisabled" class="col-md-12">
                    <div class="f-13 mr-4 text-end">
                      <router-link to="/" class="a-underline">
                        <v-icon style="font-size: 18px" color="#0d6efd"
                          >mdi mdi-keyboard-return</v-icon
                        >
                        {{ $t("sign_in") }}
                      </router-link>
                    </div>
                  </div>
                  
                </div> -->
              </v-form>
            </div>
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
        (v) => !!v || this.$t("email_required"),
        (v) => /.+@.+/.test(v) || this.$t("email_valid"),
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
</style>
