<template>
  <div fluid class="page-wrapper background-inner">
    <div class="main-section">
      <div class="my-3 p-0">
        <page-title
          class="col-md-12 ml-2"
          heading="Create/Amend Non Conformance Rules"
          :google_icon="google_icon"
        ></page-title>
      </div>
      <content-loader v-if="loader"></content-loader>

      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">
            <v-row class="px-6">
              <!-- Action Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="nonconformancerules.conformance_type"
                  label="Conformance Type"
                  :rules="conformanceTypeRules"
                  required
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  class="field-required"
                />
              </v-col>

              <!-- Category -->
              <v-col cols="12" md="2">
                <v-switch
                  v-model="nonconformancerules.status"
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

            <!-- Description -->
            <v-row class="px-6">
              <v-col cols="12">
                <v-textarea
                  v-model="nonconformancerules.description"
                  label="Description"
                  rows="2"
                  maxlength="500"
                  counter
                  variant="outlined"
                  hide-details="auto"
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
    nonconformancerules: {
      id: 0,
      conformance_type: "",
      description: "",
      status: 1,
    },
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
    conformanceTypeRules() {
      return [
        (v) => !!v || "Conformance Type is required",
        (v) => (v && v.length >= 3) || "Minimum 3 characters required",
        (v) => (v && v.length <= 100) || "Maximum 100 characters allowed",
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
  mounted() {},
  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("edit_non_conformance_rules/" + this.$route.query.slug)
            .then((res) => {
              if (res.data.status == "S") {
                console.log("res.data.nonconformacerules");
                console.log(res.data.nonconformancerules);
                this.nonconformancerules = res.data.nonconformancerules;
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
        name: "non-conformace-rules",
      });
    },

    submit() {
      if (this.$refs.form.validate() && this.valid) {
        this.isDisabled = true;
        this.$axios
          .post("create_nonconfrules", this.nonconformancerules)
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
                name: "non-conformace-rules",
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
