<template>
  <div fluid class="page-wrapper background-inner">
    <div class="main-section">
      <div class="my-3 p-0">
        <page-title
          class="col-md-12 ml-2"
          heading="Create/Amend Confirmation Text"
          :google_icon="google_icon"
        ></page-title>
      </div>
      <content-loader v-if="loader"></content-loader>
      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">
            <v-row class="px-6">
              <!-- Action Name -->
              <!-- :rules="conformanceTypeRules" -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="confirmation_text.type"
                  label="Confirmation Type"
                  required
                  :rules="confirmationType"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="field-required"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  v-model="confirmation_text.drug_id"
                  :items="ref_value_array"
                  item-title="drug_name"
                  item-value="id"
                  :label="'Drugs'"
                  :loading="refListLoader"
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  variant="outlined"
                  density="compact"
                  v-model="confirmation_text.patient_category"
                  :items="patientCategories"
                  item-title="label"
                  item-value="value"
                  :label="'Patient Category'"
                  :loading="refListLoader"
                  hide-details="auto"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" md="2">
                <v-switch
                  v-model="confirmation_text.status"
                  :label="$t('status')"
                  :true-value="1"
                  :false-value="0"
                  color="success"
                  hide-details
                  density="compact"
                  inset
                  small
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="confirmation_text.note"
                  label="Note"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="field-required"
                  :rules="note"
                />
              </v-col>
              
              <!-- Category -->
            </v-row>

            <!-- Description -->
            <v-row class="px-6"> </v-row>
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
  </div>
</template>

<script>
export default {
  data: () => ({
    google_icon: {
      icon_name: "check_circle",
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
    confirmation_text: {
      id: 0,
      type: "",
      drug_id: null,
      patient_category: "",
      note: "",
      status: 1,
    },

    ref_value_array: [],
    refListLoader: false,
    patientCategories: [
      {
        label: "Male",
        value: "M",
      },
      {
        label: "Woman of Childbearing Potential",
        value: "WCBP",
      },
      {
        label: "Woman of Non-Childbearing Potential",
        value: "WNCBP",
      },
    ],
    requiredArrayRule(fieldName = "field") {
      return (v) =>
        (Array.isArray(v) && v.length > 0) ||
        `Please select at least one ${fieldName}`;
    },
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    confirmationType() {
      return [
        (v) => !!v || "Type is required",
        (v) => (v && v.length >= 3) || "Minimum 3 characters required",
        (v) => (v && v.length <= 100) || "Maximum 100 characters allowed",
      ];
    },
    note() {
      return [
        (v) => !!v || "Note is required",
        (v) => (v && v.length >= 6) || "Minimum 6 characters required",
        (v) => (v && v.length <= 500) || "Maximum 500 characters allowed",
      ];
    },

    numberRules() {
      return [
        (v) => !!v || this.$t("field_required"),
        (v) => /^\d+$/.test(v) || "Only numbers allowed",
        (v) => String(v).length <= 5 || "Maximum 5 digits allowed",
      ];
    },
  },
  mounted() {
    this.fetchDrugList();
  },
  created() {},
  watch: {
    "$route.query.id": {
      immediate: true,
      handler() {
        if (this.$route.query.id) {
          this.loader = true;
          this.$axios
            .get("edit_confirmation_text/" + this.$route.query.id)
            .then((res) => {
              if (res.data.status == "S") {
                this.confirmation_text = res.data.confirmation_text;
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
    cancel() {
      this.$router.push({
        name: "confirmation-text",
      });
    },
    fetchDrugList(type) {
      this.refListLoader = true;
      this.$axios
        .get("fetch_active_drugs")
        .then((res) => {
          this.ref_value_array = res.data.drugs;
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.refListLoader = false;
        });
    },

    submit() {
      if (this.$refs.form.validate() && this.valid) {
        this.isDisabled = true;
        this.$axios
          .post("create_confirmation_text", this.confirmation_text)
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
                name: "confirmation-text",
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
