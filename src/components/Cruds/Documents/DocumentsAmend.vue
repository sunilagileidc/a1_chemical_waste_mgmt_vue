<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        heading="Create/Amend Document"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6">
            <v-col cols="12" sm="4" md="4" class="pb-0">
              <v-tooltip text="Title" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="documents.title"
                    :rules="fieldRules"
                    label="Title"
                    variant="outlined"
                    density="compact"
                    required
                    counter="100"
                    counter-value="100"
                    class="required_field"
                    maxlength="100"
                    v-bind:class="[fieldRules ? 'form-group--error' : '']"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-select
                variant="outlined"
                density="compact"
                outlined
                required
                dense
                v-model="documents.category"
                :items="ref_type_array"
                item-title="longname"
                item-value="shortname"
                :rules="fieldRules"
                label="Category"
                class="field-required"
              ></v-select>

              <!-- Ref Value -->
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-tooltip text="Group" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    v-bind:label="$t('group')"
                    item-value="shortname"
                    item-title="longname"
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    index="id"
                    v-model="documents.group"
                    :class="{
                      'field-required': documents.category === 'Drugs',
                    }"
                    :rules="documents.category === 'Drugs' ? fieldRules : []"
                    :items="groupItems"
                    required
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-tooltip text="Drug" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    variant="outlined"
                    density="compact"
                    v-model="documents.drug_id"
                    :items="ref_value_array"
                    item-title="drug_name"
                    item-value="id"
                    :rules="documents.category === 'Drugs' ? fieldRules : []"
                    :label="'Drugs'"
                    :loading="refListLoader"
                    :class="{
                      'field-required': documents.category === 'Drugs',
                    }"
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>

            <!-- Sequence -->
            <v-col cols="12" sm="4" md="4">
              <v-number-input
                variant="outlined"
                density="compact"
                v-model="documents.sequence"
                :rules="numberRules"
                label="Sequence"
                class="field-required"
                :min="1"
                hide-details="auto"
              >
              </v-number-input>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <v-tooltip text="description" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-textarea
                    v-bind="props"
                    rows="1"
                    v-model="documents.description"
                    label="Description"
                    variant="outlined"
                    density="compact"
                    counter="500"
                    counter-value="500"
                    maxlength="500"
                    v-bind:class="[fieldRules ? 'form-group--error' : '']"
                  ></v-textarea>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="4" md="4">
              <document-upload
                v-model="documents.file"
                required
                folder="Documents"
                label="Document"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                v-if="!isViewMode"
                v-model="documents.is_re_registration"
                :label="$t('is_re_registration')"
                :true-value="1"
                :false-value="0"
                color="success"
                inset
                small
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                v-if="!isViewMode"
                v-model="documents.is_training_document"
                :label="$t('is_training_document')"
                :true-value="1"
                :false-value="0"
                color="success"
                inset
                small
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                v-if="!isViewMode"
                v-model="documents.download_alert"
                :label="$t('download_alert')"
                :true-value="1"
                :false-value="0"
                color="success"
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
                :disabled="isDisabled"
                @click="submit"
                size="small"
                class="mr-2"
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
    doc_category: [],
    doc_group: [],
    general_group: [],
    documents: {
      id: 0,
      title: "",
      category: "",
      group: "",
      drug_id: "",
      sequence: 1,
      description: "",
      is_re_registration: 0,
      is_training_document: 0,
      download_alert: 0,
      file: {},
    },
    items: [],
    empty_item: {
      id: 0,
      title: "None",
    },
    ref_type_array: ["Drugs", "General"],
    ref_value_array: [],
    refListLoader: false,
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
    groupItems() {
      if (this.documents.category === "Drugs") {
        return this.doc_group;
      }
      return this.general_group;
    },
  },
  mounted() {
    this.fetchLookup();
    this.fetchDrugList("Drugs");
  },
  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;

          this.$axios
            .get("documents/" + this.$route.query.slug)
            .then((res) => {
              if (res.data.status === "S") {
                const d = res.data.documents;

                this.documents = {
                  id: d.id,
                  title: d.title,
                  category: d.category,
                  drug_id: d.drug_id,
                  group: d.group,
                  description: d.description,
                  is_re_registration: d.is_re_registration,
                  is_training_document: d.is_training_document,
                  download_alert: d.download_alert,
                  sequence: d.sequence,
                  file: d.file_path
                    ? {
                        file_name: d.file_name,
                        file_path: d.file_path,
                        file_type: d.file_type,
                        file_size: d.file_size,
                        mime: d.mime,
                      }
                    : {},
                };
              }
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              console.log(err);
            })
            .finally(() => {
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
    fetchLookup() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "DOCUMENT_CATEGORY",
          },
        })
        .then((response) => {
          this.doc_category = response.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "DOCUMENT_GROUP",
          },
        })
        .then((response) => {
          this.doc_group = (response.data.lookup_details || []).filter(
            (item) => item.shortname !== "RAF"
          );
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "GENERAL_GROUP",
          },
        })
        .then((response) => {
          this.general_group = response.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
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
    cancel() {
      this.$router.push({
        name: "documents",
      });
    },
    submit() {
      if (this.$refs.form.validate() && this.valid) {
        if (this.documents.id == 0) {
          this.isDisabled = true;
          this.$axios
            .post("create_document", this.documents)
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
                  name: "documents",
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
            .patch("documents/" + this.documents.id, this.documents)
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
                  name: "documents",
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
