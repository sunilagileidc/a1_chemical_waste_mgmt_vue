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
              :heading="$t('create_ammend_indication')"
              :google_icon="google_icon"
            ></page-title>
          </div>
          <!-- Data Table Card -->
          <div class="mb-3 mx-auto">
            <div class="card-body">
              <content-loader v-if="loader"></content-loader>
              <v-form ref="form" v-model="valid">
                <v-row class="px-6">
                  <v-col xs="12" md="7" lg="7">
                    <v-tooltip :text="this.$t('name')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="fieldItem.name"
                          :rules="nameRules"
                          v-bind:label="$t('name')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                    <v-number-input
                      variant="outlined"
                      density="compact"
                      v-model="fieldItem.sequence"
                      :rules="numberRules"
                      label="Sequence"
                      class="field-required"
                      :min="1"
                      hide-details="auto"
                    >
                    </v-number-input>
                  </v-col>
                  <v-col sm="2" md="2">
                    <v-switch
                      v-model="fieldItem.status"
                      :label="$t('status')"
                      :true-value="1"
                      :false-value="0"
                      color="success"
                      inset
                      small
                    />
                  </v-col>
                  <v-col xs="12" md="12" lg="12">
                    <v-tooltip :text="this.$t('description')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-text-field
                          v-bind="props"
                          v-model="fieldItem.description"
                          :rules="descriptionRules"
                          v-bind:label="$t('description')"
                          variant="outlined"
                          density="compact"
                          class="required_field"
                          required
                        ></v-text-field>
                      </template>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-form>
            </div>
            <div class="d-block mr-4 mt-3 text-right">
              <v-tooltip :text="this.$t('cancel')" location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" class="d-inline-block mr-2">
                    <v-btn
                      v-bind="props"
                      size="small"
                      @click="cancel"
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
                        v-if="isBtnLoading"
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
export default {
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: true,
    successmessage: "",
    message: "",
    sel_lang: "",
    file: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    fieldItem: {
      id: 0,
      name: "",
      sequence: 1,
      status: 1,
      description: "",
    },
    dialogMessage: "",
    dialogTitle: "",
  }),

  computed: {
    nameRules() {
      return [(v) => !!v || this.$t("name_required")];
    },
    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
    },
  },

  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("edit_indications/" + this.$route.query.slug)
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.fieldItem = res.data.indications;
                this.loader = false;
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
                this.loader = false;
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
        name: "indications",
      });
    },
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.$axios
          .post("indication", this.fieldItem)
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
                name: "indications",
              });
            } else {
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            this.$toast.error(this.$t("something_went_wrong"));
            console.log("error", err);
          })
          .finally(() => {
            this.isDisabled = false;
            this.isBtnLoading = false;
          });
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped></style>
