<template>
  <div class="mx-2 mt-3 p-0">
    <div class="p-0" v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_ammend_roles')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <content-loader v-if="loader"></content-loader>
        <v-form ref="form" v-model="valid">
          <v-row class="px-6">
            <v-col xs="12" md="6" lg="6">
              <v-tooltip :text="this.$t('name')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="fieldItem.rolename"
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
            <v-col xs="12" md="6" lg="6">
              <v-tooltip :text="this.$t('description')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="fieldItem.roledescription"
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
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
  },
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
    },
  }),

  computed: {
    nameRules() {
      return [(v) => !!v || this.$t("name_required")];
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
            .get("roles/" + this.$route.query.slug + "/edit")
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.fieldItem = res.data.role;
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
        name: "roles",
      });
    },
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;

        // Form is valid, process
        if (this.fieldItem.id == 0) {
          this.$axios
            .post("roles", this.fieldItem)
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
                  name: "roles",
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
        } else {
          this.$axios
            .patch("roles/" + this.fieldItem.id, this.fieldItem)
            .then((res) => {
              this.valid_error = false;
              this.btnloading = false;
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.$toast.success(this.array_data);
                this.message = res.data.message;
                this.$router.push({
                  name: "roles",
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
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped></style>
