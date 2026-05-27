<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="mx-2 mt-3 p-0 main-section">
      <div class="my-3 d-flex align-center justify-space-between">
        <page-title
          class="ml-2"
          :heading="
            profile_details.id > 0
              ? 'Edit Haulier'
              : 'Create Haulier'
          "
          :google_icon="google_icon"
        ></page-title>
      </div>

      <content-loader v-if="loader"></content-loader>

      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">

            <v-row class="px-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile_details.haulier_name"
                  label="Name"
                  variant="outlined"
                  density="compact"
                  :rules="fieldRules"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile_details.haulier_email"
                  label="Email"
                  variant="outlined"
                  density="compact"
                  :rules="emailRules"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="px-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile_details.haulier_telephone"
                  label="Phone"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile_details.haulier_postcode"
                  label="Postcode"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row class="px-4">
              <v-col cols="12">
                <v-textarea
                  v-model="profile_details.haulier_address"
                  label="Address"
                  variant="outlined"
                  density="compact"
                  rows="2"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row class="px-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile_details.haulier_license"
                  label="Carrier License"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-switch
                  v-model="profile_details.active"
                  :true-value="1"
                  :false-value="0"
                  label="Active"
                  color="success"
                  inset
                ></v-switch>
              </v-col>
            </v-row>

          </v-form>
        </div>

        <div class="d-block mr-4 mt-3 text-right">
          <v-btn
            size="small"
            color="cancel"
            class="btn-cancel ma-1"
            @click="cancel"
          >
            Cancel
          </v-btn>

          <v-btn
            size="small"
            color="success"
            class="status-approved mr-2"
            :disabled="isDisabled"
            @click="submit"
          >
            Submit

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
    valid: false,
    loader: false,
    isDisabled: false,

    google_icon: {
      icon_name: "local_shipping",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },

    profile_details: {
      id: 0,
      haulier_name: "",
      haulier_address: "",
      haulier_postcode: "",
      haulier_telephone: "",
      haulier_email: "",
      haulier_license: "",
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
      this.fetchHaulier();
    }
  },

  methods: {
    fetchHaulier() {
      this.loader = true;

      this.$axios
        .get("fetchhaulierbyslug/" + this.$route.query.slug)
        .then((res) => {
          if (res.data.status == "S") {
            this.profile_details = res.data.haulier;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loader = false;
        });
    },

    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;

        this.$axios
          .post("savehaulier", this.profile_details)
          .then((res) => {
            if (res.data.status == "S") {
              this.$toast.success(res.data.message);

              this.$router.push({
                name: "hauliers",
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