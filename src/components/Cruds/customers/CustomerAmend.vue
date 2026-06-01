<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="mx-2 mt-3 p-0 main-section">
      <div class="my-3 d-flex align-center justify-space-between">
        <page-title
          class="ml-2"
          :heading="
            profile_details.id > 0
              ? $t('Edit Customer')
              : $t('Create Customer')
          "
          :google_icon="google_icon"
        ></page-title>
      </div>

      <content-loader v-if="loader"></content-loader>

      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">
            <div class="row">
              <div class="col-md-12 pl-6">

                <!-- ROW 1 -->
                <v-row class="px-4">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profile_details.company_name"
                      :rules="fieldRules"
                      variant="outlined"
                      density="compact"
                      label="Name"
                      class="required_field"
                      maxlength="150"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profile_details.company_email"
                      :rules="emailRules"
                      variant="outlined"
                      density="compact"
                      label="Email"
                      class="required_field"
                      maxlength="150"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- ROW 2 -->
                <v-row class="px-4">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profile_details.company_telephone"
                      variant="outlined"
                      density="compact"
                      label="Phone"
                      maxlength="20"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="profile_details.company_postcode"
                      variant="outlined"
                      density="compact"
                      label="Post Code"
                      maxlength="20"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- ROW 3 -->
                <v-row class="px-4">
                  <v-col cols="12">
                    <v-textarea
                      v-model="profile_details.company_address"
                      variant="outlined"
                      density="compact"
                      label="Address"
                      rows="2"
                      maxlength="500"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <!-- ROW 4 -->
                <v-row class="px-4">
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="profile_details.hwr_code"
                      variant="outlined"
                      density="compact"
                      label="HWR Code"
                      maxlength="100"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="profile_details.hwr_expiry_date"
                      variant="outlined"
                      density="compact"
                      label="HWR Expiry Date"
                      type="date"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="profile_details.sic_code"
                      variant="outlined"
                      density="compact"
                      label="SIC Code"
                      maxlength="100"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- ROW 5 -->
                <v-row class="px-4">
                  <v-col cols="12" md="10">
                    <v-textarea
                      v-model="profile_details.sic_desc"
                      variant="outlined"
                      density="compact"
                      label="SIC Description"
                      rows="2"
                      maxlength="1000"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-switch
                      v-model="profile_details.active"
                      :true-value="1"
                      :false-value="0"
                      color="success"
                      label="Active"
                      inset
                    ></v-switch>
                  </v-col>
                </v-row>

              </div>
            </div>
          </v-form>
        </div>

        <!-- BUTTONS -->
        <div class="d-block mr-4 mt-3 text-right">
          <v-btn
            size="small"
            class="btn-cancel ma-1"
            color="cancel"
            @click="cancel"
          >
            {{ $t("cancel") }}
          </v-btn>

          <v-btn
            size="small"
            color="success"
            class="status-approved mr-2"
            :disabled="isDisabled"
            @click="submit"
          >
            {{ $t("submit") }}

            <v-progress-circular
              v-if="isDisabled"
              indeterminate
              width="1"
              size="x-small"
              class="ml-2"
            ></v-progress-circular>
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";

export default {
  components: {
    PageTitle,
  },

  data: () => ({
    google_icon: {
      icon_name: "groups",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },

    valid: false,
    loader: false,
    isDisabled: false,

    profile_details: {
      id: 0,
      company_name: "",
      company_address: "",
      company_postcode: "",
      company_telephone: "",
      company_email: "",
      hwr_code: "",
      hwr_expiry_date: "",
      sic_code: "",
      sic_desc: "",
      active: 1,
    },
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || "This field is required"];
    },

    emailRules() {
      return [
        (v) => !!v || "Email is required",
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Enter valid email",
      ];
    },
  },

  mounted() {
    if (this.$route.query.slug) {
      this.fetchCustomer();
    }
  },

  methods: {
    fetchCustomer() {
      this.loader = true;

      this.$axios
        .get("customerbyslug/" + this.$route.query.slug)
        .then((res) => {
          if (res.data.status == "S") {
            this.profile_details = res.data.customer;
          } else {
            this.$toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error("Something went wrong");
        })
        .finally(() => {
          this.loader = false;
        });
    },

    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;

        this.$axios
          .post("savecustomer", this.profile_details)
          .then((res) => {
            if (res.data.status == "S") {
              this.$toast.success(res.data.message);

              this.$router.push({
                name: "customers",
              });
            } else {
              this.$toast.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$toast.error("Something went wrong");
          })
          .finally(() => {
            this.isDisabled = false;
          });
      }
    },

    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.required_field {
  margin-top: 10px;
}
</style>