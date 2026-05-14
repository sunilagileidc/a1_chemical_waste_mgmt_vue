<template>
  <div>
    <v-container fluid class="page-wrapper background-inner">
      <content-loader v-if="loader"></content-loader>
      <confirmation-dialog
        ref="confirmationDialog"
        :title="dialogTitle"
        :message="dialogMessage"
      ></confirmation-dialog>

      <!-- {{ user.pharmacist[0].institution_id }} -->
      <div class="main-section">
        <div>
          <div class="d-flex justify-space-between align-center">
            <page-title
              class="col-md-5 ml-2"
              heading="Outpatient Pharmacy Connection Form"
              :google_icon="google_icon"
            ></page-title>
          </div>
          <!-- Data Table Card -->
          <div class="mb-3 mx-auto">
            <div class="card-body">
              <content-loader v-if="loader"></content-loader>
              <v-form ref="form" v-model="valid">
                <v-row class="px-6">
                  <v-col cols="12" sm="6" md="6">
                    <v-autocomplete
                      v-model="outpatient_pharmacy.connected_pharmacy_id"
                      :items="pharmacies"
                      item-title="name"
                      item-value="id"
                      :rules="requiredRule"
                      density="compact"
                      variant="outlined"
                      label="Outpatient Pharmacy Name"
                      class="styled-field field-required"
                      @update:modelValue="populateAddress"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Postcode</label>
                      <div class="plain-value">
                        {{ outpatient_pharmacy.post_code }}
                      </div>
                    </div>
                    <!-- <v-text-field
                      readonly
                      v-bind="props"
                      v-model="outpatient_pharmacy.post_code"
                      :rules="fieldRules"
                      label="Postcode"
                      variant="outlined"
                      density="compact"
                      required
                      counter="100"
                      counter-value="100"
                      class="styled-field required_field"
                      maxlength="100"
                      hide-details="auto"
                      v-bind:class="[fieldRules ? 'form-group--error' : '']"
                    ></v-text-field> -->
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Outpatient Address</label>
                      <div class="plain-value">
                        {{ outpatient_pharmacy.address }}
                      </div>
                    </div>
                    <!-- <v-text-field
                      readonly
                      v-bind="props"
                      v-model="outpatient_pharmacy.address"
                      :rules="fieldRules"
                      label="Outpatient Address"
                      variant="outlined"
                      density="compact"
                      required
                      counter="100"
                      counter-value="100"
                      class="required_field"
                      maxlength="100"
                      v-bind:class="[fieldRules ? 'form-group--error' : '']"
                    ></v-text-field> -->
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
                      :disabled="isDisabled"
                      @click="submit"
                      size="small"
                      class="btn-approved mr-2"
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
      icon_name: "group",
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
    outpatient_pharmacy: {
      id: 0,
      connected_pharmacy_id: "",
      user_id: "",
      institution_id: "",
      post_code: "",
      address: "",
    },
    items: [],
    empty_item: {
      id: 0,
      title: "None",
    },
    pharmacies: [],
    selectedTab: "",
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.outpatient_pharmacy.user_id = this.user.id;
    this.outpatient_pharmacy.institution_id =
      this.user.pharmacist.institution_id;
    this.selectedTab = this.$route.query.tabname;
    this.fetchPharmacies();
  },

  created() {
    this.$axios
      .get("parentmenus")
      .then((res) => {
        this.items = res.data;
        this.items.parentmenu = [
          { id: 0, title: "None" },
          ...this.items.parentmenu,
        ];
      })
      .catch((err) => {
        this.$toast.error(this.$t("something_went_wrong"));
        console.log("error", err);
      });
  },
  watch: {},
  methods: {
    async fetchPharmacies() {
      try {
        const res = await this.$axios.get("fetchactivepharmacies");

        if (res.data.status === "S") {
          this.pharmacies = res.data.pharmacies.filter((item) =>
            ["Outpatient Pharmacy"].includes(item.institution_type),
          );
        }
      } catch (error) {
        this.pharmacies = [];
      }
    },
    populateAddress(id) {
      const pharmacy = this.pharmacies.find((h) => h.id === id);
      this.outpatient_pharmacy.address = pharmacy ? pharmacy.address : "";
      this.outpatient_pharmacy.post_code = pharmacy ? pharmacy.post_code : "";
    },
    cancel() {
      if (this.from_page == "") {
        this.$router.push({
          name: "connected-pharmacy",
        });
      } else {
        this.$router.push({
          name: "view-my-profile",
          query: {
            slug: this.user.slug,
            from: this.$route.query.from,
          },
        });
      }
    },
    NumbersOnly(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    submit() {
      if (this.$refs.form.validate() && this.valid) {
        if (this.outpatient_pharmacy.id == 0) {
          this.isDisabled = true;
          this.$axios
            .post("connected_pharmacy", this.outpatient_pharmacy)
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.$toast.success(this.array_data);
                this.message = res.data.message;
                if (this.from_page == "") {
                  this.$router.push({
                    name: "connected-pharmacy",
                  });
                } else {
                  this.$router.push({
                    name: "view-my-profile",
                    query: {
                      slug: this.user.slug,
                      from: this.$route.query.from,
                    },
                  });
                }
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
            .patch(
              "connected_pharmacy/" + this.outpatient_pharmacy.id,
              this.outpatient_pharmacy,
            )
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
                  name: "connected-pharmacy",
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
