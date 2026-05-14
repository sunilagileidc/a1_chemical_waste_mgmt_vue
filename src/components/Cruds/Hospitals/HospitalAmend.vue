<template>
  <div>
    <v-container fluid class="page-wrapper background-inner">
      <content-loader v-if="loader"></content-loader>
      <confirmation-dialog
        ref="confirmationDialog"
        :title="dialogTitle"
        :message="dialogMessage"
      ></confirmation-dialog>
      <div class="main-section">
        <div>
          <div class="d-flex justify-space-between align-center">
            <page-title
              class="col-md-4 ml-2"
              heading="Create/Amend Hospital"
              :google_icon="google_icon"
            ></page-title>
          </div>
          <!-- Data Table Card -->

          <div class="mb-3 mx-auto">
            <div class="card-body">
              <content-loader v-if="loader"></content-loader>
              <v-form ref="form" v-model="valid">
                <v-row class="px-6">
                  <v-col cols="12" sm="6" md="6" class="pb-0">
                    <v-text-field
                      v-bind="props"
                      v-model="hospital.name"
                      :rules="fieldRules"
                      label="Name"
                      variant="outlined"
                      density="compact"
                      required
                      counter="100"
                      counter-value="100"
                      class="required_field"
                      maxlength="100"
                      v-bind:class="[fieldRules ? 'form-group--error' : '']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6" class="pb-0">
                    <v-autocomplete
                      label="Type"
                      item-value="shortname"
                      item-title="shortname"
                      v-model="hospital.institution_type"
                      :items="inst_types"
                      :value-comparator="(a, b) => a === b"
                      density="compact"
                      variant="outlined"
                      disabled
                      :rules="fieldRules"
                      class="required_field"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-bind="props"
                      v-model="hospital.address"
                      :rules="fieldRules"
                      label="Hospital Address"
                      variant="outlined"
                      density="compact"
                      required
                      counter="100"
                      counter-value="100"
                      class="required_field"
                      maxlength="100"
                      v-bind:class="[fieldRules ? 'form-group--error' : '']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" class="pb-0">
                    <v-autocomplete
                      label="Pharmacy List"
                      item-value="id"
                      item-title="name"
                      density="compact"
                      variant="outlined"
                      v-bind="props"
                      index="id"
                      v-model="hospital.pharmacy_id"
                      :rules="fieldRules"
                      :items="pharmacy_types"
                      class="required_field"
                      outlined
                      required
                      dense
                    ></v-autocomplete>
                  </v-col>

                  <!-- <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-bind="props"
                      v-model="hospital.post_code"
                      :rules="fieldRules"
                      label="Postcode"
                      variant="outlined"
                      density="compact"
                      required
                      counter="100"
                      counter-value="100"
                      class="required_field"
                      maxlength="100"
                      v-bind:class="[fieldRules ? 'form-group--error' : '']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-bind="props"
                      v-model="hospital.ordering_address"
                      :rules="fieldRules"
                      label="Ordering Address"
                      variant="outlined"
                      density="compact"
                      required
                      counter="100"
                      counter-value="100"
                      class="required_field"
                      maxlength="100"
                      v-bind:class="[fieldRules ? 'form-group--error' : '']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-bind="props"
                      v-model="hospital.delivery_address"
                      :rules="fieldRules"
                      label="Delivery Address"
                      variant="outlined"
                      density="compact"
                      required
                      counter="100"
                      counter-value="100"
                      class="required_field"
                      maxlength="100"
                      v-bind:class="[fieldRules ? 'form-group--error' : '']"
                    ></v-text-field>
                  </v-col> -->
                  <v-col cols="4" md="4">
                    <v-switch
                      v-model="hospital.status"
                      :label="$t('status')"
                      :true-value="1"
                      :false-value="0"
                      color="success"
                      hide-details
                      inset
                      small
                    />
                  </v-col>
                </v-row>
              </v-form>
            </div>
            <div class="d-block mr-4 mt-3 text-right pb-3">
              <v-tooltip :text="this.$t('cancel')" location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" class="d-inline-block mr-2">
                    <v-btn
                      v-bind="props"
                      size="small"
                      @click="cancel()"
                      :disabled="loading"
                      class="btn-cancel ma-1"
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
                      :disabled="isDisabled && valid"
                      @click="submit"
                      size="small"
                      class="status-approved mr-2"
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
                </template>
              </v-tooltip>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: { PageTitle },
  data: () => ({
    google_icon: {
      icon_name: "domain_add",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: false,
    valid_error: false,
    message: "",
    loader: false,
    disabled: false,
    loading: false,
    isDisabled: false,
    hospital: {
      id: 0,
      name: "",
      institution_type: "",
      pharmacy_id: null,
      address: "",
      post_code: "",
      ordering_address: "",
      delivery_address: "",
      status: 1,
      form: "Hospital",
    },
    items: [],
    inst_types: [],
    pharmacy_types: [],
    empty_item: {
      id: 0,
      title: "None",
    },
  }),

  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },

  created() {
    this.fetchLookup();
    this.fetchPharmacies();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("institution/" + this.$route.query.slug + "/edit")
            .then((res) => {
              if (res.data.status == "S") {
                this.loader = false;
                this.hospital = res.data.institution;
              }
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              this.loader = false;
              console.log("error", err);
            });
        }
      },
    },
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        ("");
        this.sel_lang = "en";
      }
    },
  },
  methods: {
    async fetchPharmacies() {
      try {
        const res = await this.$axios.get("fetchactivepharmacies");

        if (res.data.status === "S") {
          // this.pharmacy_types = res.data.pharmacies;
          //filter to get only In Patient pharmacies
          this.pharmacy_types = res.data.pharmacies.filter((item) =>
            ["Inpatient Pharmacy"].includes(item.institution_type)
          );
        }
      } catch (error) {
        this.pharmacy_types = [];
      }
    },
    cancel() {
      this.$router.push({
        name: "hospitals",
      });
    },
    fetchLookup() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "INSTITUTION_TYPE",
          },
        })
        .then((response) => {
          // console.log(response);
          this.inst_types = response.data.lookup_details.filter((item) =>
            ["Hospital"].includes(item.shortname)
          );
          this.hospital.institution_type = this.inst_types[0].shortname;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
    submit() {
      if (this.$refs.form.validate() && this.valid) {
        if (this.hospital.id == 0) {
          this.isDisabled = true;
          this.$axios
            .post("institution", this.hospital)
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.$toast.success(this.array_data);
                this.message = res.data.message;
                this.$router.push({
                  name: "hospitals",
                });
              } else if (res.data.status == "E") {
                this.$toast.error(this.array_data);
                this.isDisabled = false;
              } else {
                this.$toast.error(this.array_data);
                this.isDisabled = false;
              }
            })
            .catch((err) => {
              this.isDisabled = false;
              this.$toast.error(this.$t("something_went_wrong"));
              this.isDisabled = false;
              console.log("error", err);
            });
        } else {
          this.isDisabled = true;
          this.$axios
            .patch("institution/" + this.hospital.id, this.hospital)
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.$toast.success(this.array_data);
                this.message = res.data.message;
                this.$router.push({
                  name: "hospitals",
                });
              } else if (res.data.status == "E") {
                this.isDisabled = false;
                this.$toast.error(this.array_data);
              } else {
                this.$toast.error(this.array_data);
              }
            })
            .catch((err) => {
              this.isDisabled = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log("error", err);
            });
        }
      }
    },
  },
};
</script>
