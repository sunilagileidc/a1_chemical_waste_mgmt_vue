<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="mx-2 mt-3 p-0 main-section">
      <!-- Header -->
      <div class="my-3 d-flex align-center justify-space-between">
        <page-title
          class="ml-2"
          heading="Assigned Question Amend"
          :google_icon="google_icon"
        >
        </page-title>
      </div>

      <content-loader v-if="loader"></content-loader>

      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">
            <v-row class="px-4">
              <!-- Question Type -->
              <v-col cols="12" md="6">
                <v-select
                  variant="outlined"
                  density="compact"
                  v-model="assigned_details.q_type"
                  :items="questionTypes"
                  :rules="fieldRules"
                  label="Question Type"
                  class="field-required"
                  hide-details="auto"
                >
                </v-select>
              </v-col>

              <!-- Sequence -->
              <v-col cols="12" md="3">
                <v-number-input
                  variant="outlined"
                  density="compact"
                  v-model="assigned_details.sequence"
                  :rules="numberRules"
                  label="Sequence"
                  class="field-required"
                  :min="1"
                  hide-details="auto"
                >
                </v-number-input>
              </v-col>

              <v-col cols="12" md="3">
                <v-switch
                  v-model="assigned_details.attach_doc"
                  label="Attach Document"
                  inset
                  :true-value="1"
                  :false-value="0"
                  color="success"
                  density="compact"
                  hide-details="auto"
                >
                </v-switch>
              </v-col>
            </v-row>

            <!-- Document Fields -->
            <v-row class="px-4" v-if="assigned_details.attach_doc">
              <v-col cols="12" md="6">
                <v-tooltip text="Document Title" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      v-model="assigned_details.doc_title"
                      :rules="docRules"
                      label="Document Title"
                      class="field-required"
                      maxlength="100"
                      counter
                    >
                    </v-text-field>
                  </template>
                </v-tooltip>
              </v-col>

              <v-col cols="12" md="6">
                <v-tooltip text="Document Link" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      variant="outlined"
                      density="compact"
                      v-model="assigned_details.doc_link"
                      :rules="docRules"
                      label="Document Link"
                      class="field-required"
                    >
                    </v-text-field>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>

            <!-- Question (Quill Editor) -->
            <v-row class="px-6 pt-0">
              <v-col cols="12" md="12" lg="12" sm="12" class="py-0 px-1">
                <span class="theme-subheader">
                  <span class="required-text">*</span> Question
                </span>

                <v-tooltip text="Question" location="top">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props">
                      <QuillEditor
                        theme="snow"
                        contentType="html"
                        v-model:content="assigned_details.question"
                        class="hide_quill_input required_field"
                        :id="quillError ? 'quill_item' : 'quill_item_border'"
                        @blur="onEditorBlur"
                        @focus="onEditorFocus"
                        @ready="onEditorReady"
                        @change="onEditorChange"
                      />
                      <small
                        v-if="quillError"
                        class="text-danger ml-5 required_item shake"
                      >
                        Field Required
                      </small>
                    </div>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>

            <!-- Description -->
            <!-- <v-row class="px-4">
                            <v-col cols="12">
                                <v-tooltip text="Description" location="bottom">
                                    <template v-slot:activator="{ props }">
                                        <v-textarea v-bind="props" variant="outlined" density="compact"
                                            v-model="assigned_details.description" label="Description" rows="3"
                                            maxlength="2000" counter>
                                        </v-textarea>
                                    </template>
                                </v-tooltip>
                            </v-col>
                        </v-row> -->
          </v-form>
        </div>

        <!-- Buttons -->
        <div class="d-block mr-4 mt-7 text-right">
          <v-tooltip text="Cancel" location="bottom">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="d-inline-block mr-2">
                <v-btn
                  size="small"
                  @click="cancel"
                  class="btn-cancel ma-1"
                  color="cancel"
                >
                  Cancel
                </v-btn>
              </div>
            </template>
          </v-tooltip>

          <v-tooltip text="Submit" location="bottom">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="d-inline-block">
                <v-btn
                  :disabled="isDisabled"
                  @click="submit"
                  size="small"
                  class="status-approved mr-2"
                  color="success"
                >
                  Submit
                  <v-progress-circular
                    v-if="isDisabled"
                    indeterminate
                    width="1"
                    size="x-small"
                    class="ml-2"
                  >
                  </v-progress-circular>
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
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
export default {
  components: {
    QuillEditor,
  },
  data() {
    return {
      google_icon: {
        icon_name: "assignment",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      valid: false,
      loader: false,
      isDisabled: false,

      questionTypes: ["Plain Text", "Checkbox"],

      assigned_details: {
        id: 0,
        parent_slug: null,
        q_type: null,
        sequence: 1,
        question: "",
        description: "",
        attach_doc: false,
        doc_title: "",
        doc_link: "",
        status: 1,
      },
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
    docRules() {
      if (!this.assigned_details.attach_doc) return [];
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;

          this.$axios
            .get("assign_policy_questions/" + this.$route.query.slug)
            .then((res) => {
              if (res.data.status === "S") {
                this.assigned_details = res.data.data;
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

    "$route.query.parent_slug": {
      immediate: true,
      handler() {
        if (this.$route.query.parent_slug) {
          this.assigned_details.parent_slug = this.$route.query.parent_slug;
        }
      },
    },
  },

  mounted() {},

  methods: {
    onEditorChange(event) {
      if (event.text.length == 1) {
        this.quill_item = true;
      } else {
        this.quill_item = false;
      }
    },
    submit() {
      if (!this.assigned_details.question) {
        this.$toast.error("Question is required");
        return;
      }

      if (this.$refs.form.validate() && this.valid) {
        this.isDisabled = true;

        const request = this.assigned_details.id
          ? this.$axios.put(
              "assign_policy_questions/" + this.$route.query.slug,
              this.assigned_details
            )
          : this.$axios.post("assign_policy_questions/", this.assigned_details);

        request
          .then((res) => {
            if (res.data.status === "E") {
              this.$toast.error(res.data.message);
            } else {
              this.$toast.success(res.data.message);
              this.$router.go(-1);
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
    },

    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>
<style scoped>
#quill_item {
  border: 1px solid #b00020;
}

#quill_item_border {
  border: 1px solid #d1d5db;
}

#quill_item1 {
  border: 1px solid #b00020;
}

#quill_item_border1 {
  border: 1px solid #d1d5db;
}

.ql-tooltip {
  display: none !important;
}

.hide_quill_input :deep(input) {
  display: none !important;
}
</style>
