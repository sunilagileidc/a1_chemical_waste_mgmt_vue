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
              heading="Create/Amend Pharmacies"
              :google_icon="google_icon"
            ></page-title>
          </div>
          <!-- Data Table Card -->
          <div class="mb-3 mx-auto">
            <div class="card-body">
              <content-loader v-if="loader"></content-loader>
              <v-form ref="form" v-model="valid">
                <v-row class="px-6">
                  <v-col cols="12" sm="8" md="8" class="pb-0">
                    <v-text-field
                      v-bind="props"
                      v-model="pharmacy.name"
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
                  <v-col cols="12" sm="4" md="4" class="pb-0">
                    <v-autocomplete
                      label="Type"
                      item-value="shortname"
                      item-title="shortname"
                      density="compact"
                      variant="outlined"
                      v-bind="props"
                      index="id"
                      v-model="pharmacy.institution_type"
                      :rules="fieldRules"
                      :items="inst_types"
                      class="required_field"
                      outlined
                      required
                      dense
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="12" sm="8" md="8">
                    <v-text-field
                      v-bind="props"
                      v-model="pharmacy.address"
                      :rules="fieldRules"
                      label="Address"
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
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-bind="props"
                      v-model="pharmacy.post_code"
                      :rules="fieldRules"
                      label="Postcode"
                      variant="outlined"
                      density="compact"
                      required
                      counter="7"
                      counter-value="7"
                      class="required_field"
                      maxlength="7"
                      v-bind:class="[fieldRules ? 'form-group--error' : '']"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="8">
                    <v-text-field
                      v-bind="props"
                      v-model="pharmacy.ordering_address"
                      label="Ordering Address"
                      variant="outlined"
                      density="compact"
                      hide-details="true"
                      required
                      counter="100"
                      counter-value="100"
                      maxlength="100"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-bind="props"
                      v-model="pharmacy.ordering_post_code"
                      label="Ordering Postcode"
                      variant="outlined"
                      density="compact"
                      required
                      counter="7"
                      counter-value="7"
                      maxlength="7"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="8" md="8">
                    <v-text-field
                      v-bind="props"
                      v-model="pharmacy.delivery_address"
                      label="Delivery Address"
                      variant="outlined"
                      density="compact"
                      counter="100"
                      counter-value="100"
                      hide-details="true"
                      maxlength="100"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" md="4">
                    <v-text-field
                      v-bind="props"
                      v-model="pharmacy.delivery_post_code"
                      label="Delivery Postcode"
                      variant="outlined"
                      density="compact"
                      counter="7"
                      counter-value="7"
                      maxlength="7"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="8" md="8">
                    <v-autocomplete
                      v-model="pharmacy.selected"
                      :items="inst_contacts"
                      item-title="name"
                      item-value="id"
                      return-object
                      chips
                      closable-chips
                      multiple
                      hide-details="true"
                      label="Contacts"
                      variant="outlined"
                      density="compact"
                      :disabled="inst_contacts.length === 0"
                    >
                      <template #chip="{ props, item }">
                        <v-chip v-bind="props" label>
                          {{ item.raw.name }}
                          <template #close>
                            <v-icon size="14">mdi-close</v-icon>
                          </template>
                        </v-chip>
                      </template>
                    </v-autocomplete>
                    <small
                      class="status-text-rejected"
                      v-if="inst_contacts.length === 0"
                      >No users available to display. You may proceed without
                      selecting, or register as a pharmacist or prescriber to
                      add users</small
                    >
                  </v-col>
                  <v-col cols="4" md="4">
                    <v-switch
                      v-model="pharmacy.status"
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
                      class="btn-canceld ma-1"
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
    pharmacy: {
      id: 0,
      user_id: 0,
      name: "",
      institution_type: "",
      address: "",
      post_code: "",
      ordering_address: "",
      ordering_post_code: "",
      delivery_address: "",
      delivery_post_code: "",
      status: 1,
      form: "Pharmacy",
      selected: [],
    },
    items: [],
    inst_types: [],
    empty_item: {
      id: 0,
      title: "None",
    },
    inst_contacts: [],
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
    contactRules() {
      return [(v) => (v && v.length > 0) || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },

  created() {
    this.fetchLookup();
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.pharmacy.user_id = this.user.id;
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
                this.pharmacy = res.data.institution;
                this.pharmacy.user_id = this.user.id;
                // Load selected contacts AFTER pharmacy loads
                this.fetchInstitutionContacts(this.pharmacy.id);
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log(err);
            });
        }
      },
    },
  },
  methods: {
    cancel() {
      this.$router.push({
        name: "pharmacies",
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
          this.inst_types = response.data.lookup_details;
          this.inst_types = response.data.lookup_details.filter((item) =>
            ["Inpatient Pharmacy", "Outpatient Pharmacy", "Homecare"].includes(
              item.shortname
            )
          );
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
      //Fetch all pharmacist list
      this.$axios
        .get("fetch_pharmacist_list")
        .then((res) => {
          this.inst_contacts = res.data.pharmacist_list;
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.adminLoading = false;
        });
    },

    fetchInstitutionContacts(id) {
      this.$axios
        .get("fetch_inst_contacts", {
          params: {
            institution_id: id,
          },
        })
        .then((response) => {
          this.pharmacy.selected = response.data.inst_contacts;
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        });
    },
    submit() {
      if (this.$refs.form.validate() && this.valid) {
        if (this.pharmacy.id == 0) {
          this.isDisabled = true;
          this.$axios
            .post("institution", this.pharmacy)
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
                  name: "pharmacies",
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
            .patch("institution/" + this.pharmacy.id, this.pharmacy)
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
                  name: "pharmacies",
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
