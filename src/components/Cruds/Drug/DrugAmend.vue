<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        heading="Create/Amend Drug"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6">
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Drug Name" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="drug.drug_name"
                    :rules="fieldRules"
                    label="Drug Name"
                    variant="outlined"
                    density="compact"
                    required
                    counter="100"
                    counter-value="100"
                    class="required_field"
                    maxlength="100"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="2" md="2" class="pb-0">
              <v-tooltip text="Validity" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="drug.validity"
                    :rules="numberRules"
                    label="Validity (in months)"
                    variant="outlined"
                    density="compact"
                    required
                    counter="5"
                    class="required_field"
                    type="text"
                    inputmode="numeric"
                    pattern="[0-9]*"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="4" md="4" class="pb-0">
              <v-tooltip text="Strengths" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    label="Strengths"
                    item-value="shortname"
                    item-title="longname"
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    index="id"
                    v-model="drug.drug_strength"
                    :rules="[requiredArrayRule('Strength')]"
                    :items="strengths"
                    class="required_field small-autocomplete"
                    outlined
                    required
                    dense
                    multiple
                    chips
                    clearable
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Indications" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    label="Indications"
                    item-value="id"
                    item-title="name"
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    index="id"
                    v-model="drug.indications"
                    :rules="[requiredArrayRule('Indications')]"
                    :items="indications"
                    class="required_field small-autocomplete"
                    outlined
                    required
                    dense
                    multiple
                    chips
                    clearable
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Marketing Holders" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    label="Marketing Holders"
                    item-value="id"
                    item-title="contact_name"
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    index="id"
                    v-model="drug.marketing_holders"
                    :rules="[requiredArrayRule('Marketing Holders')]"
                    :items="marketing_holders"
                    class="required_field small-autocomplete"
                    outlined
                    required
                    dense
                    multiple
                    chips
                    clearable
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Capsules" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    label="Capsules"
                    item-value="shortname"
                    item-title="shortname"
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    index="id"
                    v-model="drug.capsules"
                    :rules="[requiredArrayRule('Capsule')]"
                    :items="capsules_data"
                    class="required_field small-autocomplete"
                    outlined
                    required
                    dense
                    multiple
                    chips
                    clearable
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Cycles" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    label="Cycles"
                    item-value="shortname"
                    item-title="shortname"
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    index="id"
                    v-model="drug.cycles"
                    :rules="[requiredArrayRule('Cycle')]"
                    :items="cycles_data"
                    class="required_field small-autocomplete"
                    outlined
                    required
                    dense
                    multiple
                    chips
                    clearable
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6">
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Pharmacist Confirmation Text" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-textarea
                    v-bind="props"
                    rows="1"
                    v-model="drug.pharmacist_confirmation_text"
                    label="Pharmacist Confirmation Text"
                    variant="outlined"
                    density="compact"
                    counter="500"
                    counter-value="500"
                    maxlength="500"
                    class="required_field"
                    :rules="fieldRules"
                  ></v-textarea>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Prescriber Confirmation Text" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-textarea
                    v-bind="props"
                    rows="1"
                    v-model="drug.prescriber_confirmation_text"
                    label="Prescriber Confirmation Text"
                    variant="outlined"
                    density="compact"
                    counter="500"
                    counter-value="500"
                    maxlength="500"
                    class="required_field"
                    :rules="fieldRules"
                  ></v-textarea>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="3" md="3" class="pb-0">
              <v-tooltip text="Capsules" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    label="Drug Form"
                    item-value="shortname"
                    item-title="shortname"
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    index="id"
                    v-model="drug.drug_form"
                    :rules="fieldRules"
                    :items="drug_form_types"
                    class="required_field"
                    outlined
                    required
                    dense
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
            <!-- Sequence -->
            <v-col cols="12" md="3" sm="3">
              <v-number-input
                variant="outlined"
                density="compact"
                v-model="drug.sequence"
                :rules="numberRules"
                label="Sequence"
                class="field-required"
                :min="1"
                hide-details="auto"
              >
              </v-number-input>
            </v-col>
          </v-row>
          <!-- <v-col cols="12" sm="3" md="3">
            <v-switch
              v-model="drug.status"
              :label="$t('status')"
              :true-value="1"
              :false-value="0"
              color="success"
              hide-details
              inset
              small
            />
          </v-col>s -->
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
</template>

<script>
export default {
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
    drug: {
      id: 0,
      drug_name: "",
      prescriber_confirmation_text: "",
      pharmacist_confirmation_text: "",
      validity: null,
      status: 1,
      sequence: 1,
      drug_strength: [],
      indications: [],
      marketing_holders: [],
      cycles: [],
      capsules: [],
    },
    capsules: [],
    strengthSelection: {}, // 👈 boolean map
    strengths: [],
    cycles_data: [],
    capsules_data: [],
    drug_form_types: [],
    marketing_holders: [],
    indications: [],
  requiredArrayRule(fieldName = 'field') {
    return v =>
      (Array.isArray(v) && v.length > 0) ||
      `Please select at least one ${fieldName}`
  }
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [
        (v) => !!v || this.$t("field_required"),
        (v) => /^\d+$/.test(v) || "Only numbers allowed",
        (v) => String(v).length <= 5 || "Maximum 5 digits allowed",
      ];
    },
  },
  mounted() {},
  created() {
    this.fetchLookup();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("edit_drug/" + this.$route.query.slug)
            .then((res) => {
              if (res.data.status == "S") {
                this.drug = res.data.drug;
                this.loader = false;
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
  },
  methods: {
    handleValidityInput(drug) {
      // Remove non-numeric characters
      drug.validity = drug.validity.replace(/\D/g, "").slice(0, 5);
    },
    cancel() {
      this.$router.push({
        name: "drug",
      });
    },
    fetchLookup() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "CYCLES",
          },
        })
        .then((response) => {
          this.cycles_data = response.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "CAPSULES",
          },
        })
        .then((response) => {
          this.capsules_data = response.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "DRUG_FORM_TYPES",
          },
        })
        .then((response) => {
          this.drug_form_types = response.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "DRUG_STRENGTH",
          },
        })
        .then((response) => {
          // console.log(response);
          this.strengths = response.data.lookup_details;
          // initialize checkbox states
          // this.strengths.forEach((s) => {
          //   this.strengthSelection[s.shortname] = false;
          // });
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });

      // Fetching Marketing holders
      this.$axios
        .get("fetch_marketing_holders")
        .then((res) => {
          if (res.data.status == "S") {
            this.marketing_holders = res.data.marketing_holders;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });

      // Fetching indications
      this.$axios
        .get("fetch_indications")
        .then((res) => {
          if (res.data.status == "S") {
            this.indications = res.data.indications;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },

    submit() {
      if (this.$refs.form.validate() && this.valid) {
        this.isDisabled = true;
        this.$axios
          .post("create_drug", this.drug)
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
                name: "drug",
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
      }
    },
  },
};
</script>
<style scoped></style>
