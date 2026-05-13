<template>
  <div class="mx-2 mt-3 p-0">
    <div class="mt-8 p-0">
      <page-title
        class="col-md-4"
        :heading="$t('create_lookup')"
        :google_icon="google_icon"
      ></page-title>
    </div>

    <div class="card-body">
      <content-loader v-if="loader"></content-loader>
      <v-form ref="form" v-model="valid">
        <v-row class="mx-auto mt-2" max-width="344">
          <v-col md="6">
            <v-tooltip :text="$t('shortname')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-on="on"
                  v-model="lookup.shortname"
                  v-bind="props"
                  :rules="fieldRules"
                  v-bind:label="$t('shortname')"
                  required
                  class="required_field"
                  variant="outlined"
                  density="compact"
                  maxlength="100"
                ></v-text-field>
              </template>
            </v-tooltip>
          </v-col>
          <v-col md="6">
            <v-tooltip :text="$t('longname')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-on="on"
                  v-model="lookup.longname"
                  v-bind="props"
                  :rules="fieldRules"
                  v-bind:label="$t('longname')"
                  required
                  class="required_field"
                  variant="outlined"
                  density="compact"
                  maxlength="500"
                ></v-text-field>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-layout>
          <v-row class="mx-auto mt-2" max-width="344">
            <v-col md="12">
              <v-tooltip :text="$t('description')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-textarea
                    v-on="on"
                    rows="2"
                    v-model="lookup.description"
                    v-bind="props"
                    v-bind:label="$t('description')"
                    variant="outlined"
                    maxlength="100"
                    counter="true"
                  ></v-textarea>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-layout>
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
</template>

<script>
export default {
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envPath: import.meta.env.VUE_APP_IMAGE_DOWNLOAD_URL,
    valid: false,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    lookup: {
      id: 0,
      shortname: "",
      longname: "",
      description: "",
      parentslug: "",
    },
    noimagepreview: "",
    items: [],
    parentlookup: [],
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
            .get(
              
                "lookups/" +
                this.$route.query.slug +
                "/edit"
            )
            .then((res) => {
              this.lookup = res.data.lookup;
              // this.lookup.parentslug = this.lookup.parentlookup.slug;
              this.parentlookup = this.lookup.parentlookup;
              this.loader = false;
            });
        }
      },
    },
    "$route.query.parentslug": {
      immediate: true,
      handler() {
        if (this.$route.query.parentslug) {
          this.lookup.parentslug = this.$route.query.parentslug;
          this.fetchparentlookup();
        }
      },
    },
  },
  methods: {
    onFileChanged(e) {
      this.selectedFile = e.target.files[0];

      // Do whatever you need with the file, liek reading it with FileReader
    },
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post("save_child_lookups", this.lookup)
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
              this.lookup.slug = res.data.lookups.slug;
              this.$router.push({
                name: "child_lookup",
                query: {
                  slug: this.parentlookup.slug,
                  parentname: this.parentlookup.shortname,
                },
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
            this.$toast.error(err.response.data.errordata || this.$t("something_went_wrong"));
          })
          .finally(() => {
            this.isBtnLoading = false;
            this.isDisabled = false;
          });
      } else {
        //alert("Form is Invalid");
      }
    },
    fetchparentlookup() {
      this.$axios
        .post("fetch_parent_lookup", {
          slug: this.lookup.parentslug,
        })
        .then((res) => {
          this.parentlookup = res.data.lookups;
          this.loader = false;
        });
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
