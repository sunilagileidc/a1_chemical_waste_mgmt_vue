<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="mx-2 mt-3 p-0 main-section">
      <!-- Header -->
      <div class="my-3 d-flex align-center justify-space-between">
        <page-title
          class="ml-2"
          heading="Policy Question Amend"
          :google_icon="google_icon"
        ></page-title>
      </div>

      <content-loader v-if="loader"></content-loader>

      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">
            <v-row class="px-4">
              <!-- Title -->
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  v-model="policy_details.title"
                  :rules="fieldRules"
                  :label="$t('title')"
                  class="field-required"
                  maxlength="50"
                  counter
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  variant="outlined"
                  density="compact"
                  v-model="policy_details.linked_to"
                  :items="linked_to_array"
                  item-title="longname"
                  item-value="shortname"
                  :rules="fieldRules"
                  label="Linked To"
                  class="field-required"
                ></v-select>
              </v-col>
              <v-col cols="12" md="2">
                <v-number-input
                  variant="outlined"
                  density="compact"
                  v-model="policy_details.sequence"
                  :rules="numberRules"
                  :label="$t('sequence')"
                  class="field-required"
                  :min="1"
                  control-variant="default"
                ></v-number-input>
              </v-col>
            </v-row>

            <v-row class="px-4">
              <!-- Ref Type -->
              <v-col cols="12" md="6">
                <v-select
                  variant="outlined"
                  density="compact"
                  v-model="policy_details.ref_type"
                  :items="ref_type_array"
                  item-title="longname"
                  item-value="shortname"
                  :rules="fieldRules"
                  label="Category"
                  class="field-required"
                  @update:modelValue="fetchReferenceList"
                ></v-select>
              </v-col>
              <!-- Ref Value -->
              <v-col cols="12" md="6">
                <v-select
                  :disabled="!policy_details.ref_type"
                  variant="outlined"
                  density="compact"
                  v-model="policy_details.ref_value"
                  :items="ref_value_array"
                  item-title="drug_name"
                  item-value="id"
                  :rules="fieldRules"
                  :label="
                    !policy_details.ref_type
                      ? 'Category Value'
                      : 'Category - Drugs'
                  "
                  :loading="refListLoader"
                  class="field-required"
                ></v-select>
              </v-col>
            </v-row>

            <v-row class="px-4">
              <!-- Description -->
              <v-col cols="12">
                <v-textarea
                  rows="4"
                  variant="outlined"
                  density="compact"
                  maxlength="2000"
                  counter
                  v-model="policy_details.description"
                  :label="$t('description')"
                  :rows="1"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </div>

        <!-- Buttons -->
        <div class="d-block mr-4 mt-3 text-right">
          <v-tooltip :text="$t('cancel')" location="bottom">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="d-inline-block mr-2">
                <v-btn
                  size="small"
                  @click="cancel"
                  class="btn-cancel ma-1"
                  color="cancel"
                >
                  {{ $t("cancel") }}
                </v-btn>
              </div>
            </template>
          </v-tooltip>

          <v-tooltip :text="$t('submit')" location="bottom">
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
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      google_icon: {
        icon_name: "policy",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      valid: false,
      loader: false,
      isDisabled: false,
      refListLoader: false,

      policy_details: {
        id: 0,
        title: "",
        description: "",
        ref_type: null,
        ref_value: null,
        sequence: 1,
        status: 1,
      },

      ref_type_array: [],
      ref_value_array: [],
      linked_to_array: [
        {
          shortname: "Pharmacist",
          longname: "Pharmacist",
        },
        {
          shortname: "Prescriber",
          longname: "Prescriber",
        },
      ],
    };
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    numberRules() {
      return [
        (v) => !!v || this.$t("field_required"),
        (v) => v > 0 || this.$t("entered_value"),
      ];
    },
  },

  mounted() {
    this.fetchLovList();
  },

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;

          this.$axios
            .get("policy_questions/" + this.$route.query.slug)
            .then((res) => {
              if (res.data.status === "S") {
                this.policy_details = res.data.data;

                // CALL THIS AFTER DATA SET
                if (this.policy_details.ref_type) {
                  this.fetchReferenceList(this.policy_details.ref_type);
                }
                if (
                  !isNaN(this.policy_details.ref_value) &&
                  this.policy_details.ref_value !== null
                ) {
                  this.policy_details.ref_value = parseInt(
                    this.policy_details.ref_value,
                    10
                  );
                }
              }
            })
            .catch(() => {
              this.$toast.error(this.$t("something_went_wrong"));
            })
            .finally(() => {
              this.loader = false;
            });
        }
      },
    },
  },

  methods: {
    fetchLovList() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "POLICY_QUESTIONS_CATEGORY",
          },
        })
        .then((response) => {
          this.ref_type_array = response.data.lookup_details;
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        });
    },

    fetchReferenceList(type) {
      this.refListLoader = true;
      this.ref_value_array = [];
      // this.policy_details.ref_value = null;

      if (type === "Drugs") {
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
      } else {
        this.refListLoader = false;
      }
    },

    submit() {
      if (this.$refs.form.validate() && this.valid) {
        this.isDisabled = true;

        // CREATE
        if (!this.policy_details.id) {
          this.$axios
            .post("policy_questions", this.policy_details)
            .then((res) => {
              if (res.data.status === "E") {
                this.$toast.error(res.data.message);
              } else {
                this.$toast.success(res.data.message);
                this.$router.push({ name: "policies_questions_setup" });
              }
            })
            .catch((err) => {
              this.$toast.error(
                err.response?.data?.message || this.$t("something_went_wrong")
              );
            })
            .finally(() => {
              this.isDisabled = false;
            });
        }

        // UPDATE
        else {
          this.$axios
            .put(
              "policy_questions/" + this.policy_details.id,
              this.policy_details
            )
            .then((res) => {
              if (res.data.status === "E") {
                this.$toast.error(res.data.message);
              } else {
                this.$toast.success(res.data.message);
                this.$router.push({ name: "policies_questions_setup" });
              }
            })
            .catch((err) => {
              this.$toast.error(
                err.response?.data?.message || this.$t("something_went_wrong")
              );
            })
            .finally(() => {
              this.isDisabled = false;
            });
        }
      }
    },

    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>
<style scoped>
.image-container {
  max-width: 110px;
  border: 1px double black;
  border-radius: 3px;
}

.camera-icon {
  position: absolute;
  bottom: 40px;
  left: 40px;
  animation: fadeInUp 0.5s forwards;
}

.delete_icon {
  position: relative;
  left: 70px;
  bottom: 120px;
}

.download_btn_color {
  color: blue;
}

.pointer {
  cursor: pointer;
}

.download_icon {
  position: relative;
  left: 103px;
  bottom: 70px;
}

.dimension_text {
  text-align-last: center;
}
</style>
