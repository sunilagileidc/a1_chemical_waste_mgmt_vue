<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        heading="Create Document"
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
            <v-col cols="12" sm="4" md="4" class="pb-0">
              <v-tooltip text="Category" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    v-bind:label="$t('category')"
                    item-value="shortname"
                    item-title="longname"
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    index="id"
                    v-model="documents.category"
                    class="required_field"
                    :rules="fieldRules"
                    :items="doc_category"
                    outlined
                    required
                    dense
                  ></v-autocomplete>
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
            <v-col cols="12" sm="12" md="12">
              <v-tooltip text="description" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-textarea
                    v-bind="props"
                    rows="3"
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
                class="ma-1"
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
    documents: {
      id: 0,
      title: "",
      category: "",
      description: "",
      file: {},
    },
    items: [],
    empty_item: {
      id: 0,
      title: "None",
    },
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
    this.fetchLookup();
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
              if (res.data.status == "S") {
                const d = res.data.documents;

                this.documents = {
                  id: d.id,
                  title: d.title,
                  category: d.category,
                  description: d.description,

                  // VERY IMPORTANT — normalize file
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

                this.loader = false;
              }
            })
            .catch((err) => {
              this.loader = false;
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
