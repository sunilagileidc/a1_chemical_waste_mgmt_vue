<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <!-- v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']" -->
      <page-title
        class="col-md-4 ml-2"
        heading="Create Institution"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6">
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Institution Name" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="institution.name"
                    :rules="fieldRules"
                    label="Institution Name"
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
            <v-col cols="12" sm="6" md="6" class="pb-0">
              <v-tooltip text="Institution Type" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="institution.type"
                    :rules="fieldRules"
                    label="Institution Type"
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
            <v-col cols="12" sm="12" md="12">
              <v-tooltip text="Institution Address" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="institution.address"
                    :rules="fieldRules"
                    label="Institution Address"
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
    institution: {
      id: 0,
      name: "",
      type: "",
      address: "",
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

  created() {},
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
                this.institution = res.data.institution;
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
    cancel() {
      this.$router.push({
        name: "institutions",
      });
    },
    submit() {
      if (this.$refs.form.validate() && this.valid) {
        if (this.institution.id == 0) {
          this.isDisabled = true;
          this.$axios
            .post("institution",
              this.institution
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
                  name: "institutions",
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
            .patch(
                "institution/" +
                this.institution.id,
              this.institution
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
                  name: "institutions",
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
