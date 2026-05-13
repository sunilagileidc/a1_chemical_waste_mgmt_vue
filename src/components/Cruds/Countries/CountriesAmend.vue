<template>
  <div class="mx-2 mt-3 p-0">
    <div class="main-card mb-3 card">
      <div class="container my-3 p-0">
        <page-title
          class="col-md-4 ml-2"
          :heading="$t('create_country')"
          :google_icon="google_icon"
        ></page-title>
      </div>
      <div class="card-body">
        <content-loader v-if="loader"></content-loader>
        <v-form ref="form" v-model="valid">
          <v-row class="mx-auto" max-width="344">
            <v-col md="4">
              <v-tooltip :text="$t('name')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-on="on"
                    v-model="country.name"
                    :rules="fieldRules"
                    v-bind:label="$t('name')"
                    required
                    v-bind="props"
                    class="required_field"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col md="4">
              <v-tooltip :text="$t('mobile_code')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-on="on"
                    v-model="country.mobile_code"
                    :rules="fieldRules"
                    v-bind:label="$t('mobile_code')"
                    required
                    v-bind="props"
                    class="required_field"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col md="4">
              <v-tooltip :text="$t('country_code')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-on="on"
                    v-model="country.country_code"
                    :rules="countryCodeRules"
                    v-bind:label="$t('country_code')"
                    required
                    v-bind="props"
                    class="required_field"
                    variant="outlined"
                    density="compact"
                    @input="
                      country.country_code = country.country_code.toUpperCase()
                    "
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-form>
      </div>

      <div class="d-block mr-4 mt-3 pb-3 text-right">
        <v-tooltip :text="$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="$router.go(-1)"
                :disabled="loading"
                class="ma-1"
                color="cancel"
                >{{ $t("cancel") }}</v-btn
              >
            </div>
          </template>
        </v-tooltip>
        <v-tooltip :text="$t('submit')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block">
              <v-btn
                :disabled="isBtnLoading"
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
export default {
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: true,
    loader: false,
    isBtnLoading: false,
    isDisabled: false,
    country: {
      id: 0,
      name: "",
      country_code: "",
      mobile_code: "",
    },
    countryCodeRules: [
      (v) => !!v || "Country code is required",
      (v) => /^[A-Za-z]+$/.test(v) || "Only letters allowed",
      (v) => v.length === 2 || "Must be exactly 2 characters",
    ],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
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
            .get("edit_countries/" + this.$route.query.slug)
            .then((res) => {
              console.log("CALLED IN ROUTE");
              console.log(res);
              this.country = res.data.countries;
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post("save_countries", this.country)
          .then((res) => {
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
                name: "countries",
              });
            } else if (res.data.status == "E") {
              this.$toast.error(this.array_data);
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
input.larger {
  width: 20px;
  height: 20px;
}
.upload_doc {
  margin-top: -14px;
}
.upload_image {
  margin-bottom: 3px;
}
.download_btn_color {
  color: blue;
}
.image-width {
  border: 2px solid black;
  padding: 1px;
}
</style>
