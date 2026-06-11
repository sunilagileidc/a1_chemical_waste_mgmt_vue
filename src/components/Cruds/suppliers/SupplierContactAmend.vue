<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="mx-2 mt-3 p-0 main-section">
      <div class="my-3 d-flex align-center justify-space-between">
        <page-title
          class="ml-2"
          :heading="$t('Supplier Contact')"
          :google_icon="google_icon"
        ></page-title>
      </div>

      <content-loader v-if="loader"></content-loader>

      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">
            <v-row class="px-4">
              <!-- Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  v-model="profile_details.name"
                  :rules="fieldRules"
                  label="Name"
                  class="required_field"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <!-- Email -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="profile_details.email"
                  :rules="emailRules"
                  variant="outlined"
                  density="compact"
                  label="Email"
                  class="required_field"
                  hide-details="auto"
                  maxlength="150"
                ></v-text-field>
              </v-col>

              <!-- Telephone -->
              <v-col cols="12" md="4">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  v-model="profile_details.telephone"
                  label="Telephone"
                  :rules="phoneRules"
                  hide-details="auto"
                  maxlength="15"
                ></v-text-field>
              </v-col>

              <!-- Position -->
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  v-model="profile_details.position"
                  hide-details="auto"
                  label="Position"
                ></v-text-field>
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="2">
                <v-switch
                  v-model="profile_details.active"
                  label="Status"
                  :true-value="1"
                  :false-value="0"
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
            @click="cancel"
            class="btn-cancel mr-2"
            color="cancel"
          >
            {{ $t("cancel") }}
          </v-btn>

          <v-btn
            :disabled="isDisabled"
            @click="submit"
            size="small"
            class="status-approved"
            color="success"
          >
            {{ $t("submit") }}

            <v-progress-circular
              v-if="isDisabled"
              indeterminate
              width="1"
              color="cancel"
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

  data() {
    return {
      valid: false,
      loader: false,
      isDisabled: false,

      google_icon: {
        icon_name: "person_add",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      profile_details: {
        id: 0,
        supplier_id: null,
        name: "",
        telephone: "",
        email: "",
        position: "",
        active: 1,
      },
    };
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    emailRules() {
      return [
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },

    phoneRules() {
      return [(v) => !v || /^[0-9]+$/.test(v) || "Only numbers are allowed"];
    },
  },

  mounted() {
    console.log("Route Query:", this.$route.query);
    if (this.$route.query.supplier_id) {
      this.profile_details.supplier_id = this.$route.query.supplier_id;
    }

    if (this.$route.query.id) {
      this.fetchContact();
    }
  },

  methods: {
    fetchContact() {
      this.loader = true;

      this.$axios
        .get("supplierindividual/" + this.$route.query.id)
        .then((res) => {
          if (res.data.status == "S") {
            this.profile_details = res.data.supplier_individual;
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.loader = false;
        });
    },

    submit() {
      console.log("Submitting Data:", this.profile_details);
      if (this.$refs.form.validate() && this.valid) {
        this.isDisabled = true;

        this.$axios
          .post("savesuppliercontact", this.profile_details)
          .then((res) => {
            if (res.data.status == "S") {
              this.$toast.success(res.data.message);

              this.$router.push({
                name: "suppliers",
              });
            } else {
              this.$toast.error(res.data.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$toast.error(this.$t("something_went_wrong"));
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