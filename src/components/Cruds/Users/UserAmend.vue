<template>
  <div class="mx-2 mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_user')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <div class="row">
            <div class="col-md-10 pl-6">
              <v-row cols="12" class="px-4">
                <v-col md="2" cols="12">
                  <v-tooltip :text="$t('salutation')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('salutation')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        index="id"
                        item-key="shortname"
                        item-title="longname"
                        v-model="profile_details.salutation"
                        :rules="fieldRules"
                        :items="salutation_array"
                        class="required_field"
                      ></v-autocomplete>
                    </template>
                  </v-tooltip>
                </v-col>

                <v-col cols="12" md="6" lg="6" sm="6" px="2">
                  <v-tooltip :text="$t('firstname')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        v-model="profile_details.name"
                        :rules="fieldRules"
                        v-bind:label="$t('firstname')"
                        class="required_field"
                        required
                        maxlength="100"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>

                <v-col cols="12" lg="4" sm="6" md="4">
                  <v-tooltip :text="$t('lastname')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        v-model="profile_details.lastname"
                        :rules="fieldRules"
                        v-bind:label="$t('lastname')"
                        class="required_field"
                        required
                        maxlength="100"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row class="mt-1 px-4">
                <v-col cols="12" md="2" sm="2" lg="2">
                  <v-tooltip :text="$t('gender')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('gender')"
                        index="id"
                        item-key="shortname"
                        item-title="longname"
                        v-model="profile_details.gender"
                        :rules="fieldRules"
                        class="required_field"
                        :items="gender_array"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("gender") }}</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" md="3" sm="3" lg="3">
                  <DatePicker
                    :label="$t('dob')"
                    :max="new Date().toISOString().substr(0, 10)"
                    :stored_date="profile_details.dob"
                    @formatted_date="formatted_from_date"
                    dense
                    v-model="profile_details.dob"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="4"
                  lg="4"
                  sm="4"
                  v-if="from_page == 'view_profile'"
                >
                </v-col>
                <v-col cols="12" md="3" lg="3" sm="3" v-else>
                  <v-tooltip :text="$t('role')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('role')"
                        index="id"
                        item-key="id"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        :disabled="profile_details.id > 0"
                        item-title="role_display_name"
                        item-value="id"
                        v-model="profile_details.role_id"
                        :rules="fieldRules"
                        :items="role_array_view_profile"
                        class="required_field mt_30"
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("role") }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row class="mt-1 px-4">
                <v-col cols="12" md="5" sm="5" lg="5">
                  <v-tooltip :text="$t('email')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        v-model="profile_details.email"
                        :rules="emailRules"
                        class="required_field mt_30"
                        v-bind:label="$t('email')"
                        required
                        maxlength="100"
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" md="3" sm="3" lg="3">
                  <v-tooltip :text="$t('mobile_code')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('mobile_code')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        index="id"
                        item-value="id"
                        item-title="mobile_code"
                        v-model="profile_details.mobile_code"
                        @update:model-value="
                          changeCountry(profile_details.mobile_code)
                        "
                        :items="country_array"
                      ></v-autocomplete>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" md="4" lg="4" sm="4" px-2>
                  <v-tooltip :text="$t('mobile')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind:label="$t('mobile')"
                        :rules="phoneRules"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        :maxlength="phonelength"
                        v-model="profile_details.mobile"
                        @keypress="isNumber($event)"
                        required
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row class="mt-1 px-4">
                <v-col cols="12" md="3" sm="3" lg="3">
                  <v-tooltip :text="$t('country')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('country')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        index="id"
                        item-value="id"
                        item-title="name"
                        v-model="profile_details.country"
                        @update:model-value="
                          fetchStates(profile_details.country)
                        "
                        :items="country_array"
                      ></v-autocomplete>
                    </template>
                  </v-tooltip>
                </v-col>

                <v-col cols="12" md="3" sm="3" lg="3">
                  <v-tooltip :text="$t('state')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('state')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        index="id"
                        item-value="id"
                        item-title="name"
                        v-model="profile_details.state"
                        @update:model-value="
                          fetch_cities(profile_details.state)
                        "
                        :items="state_array"
                      ></v-autocomplete>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" md="3" sm="3" lg="3">
                  <v-tooltip :text="$t('city')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('city')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        index="id"
                        item-value="id"
                        item-title="name"
                        v-model="profile_details.city"
                        :items="city_array"
                      ></v-autocomplete>
                    </template>
                  </v-tooltip>
                </v-col>

                <v-col cols="12" md="3" lg="3" sm="3" px-2>
                  <v-tooltip :text="$t('postcode')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind:label="$t('postcode')"
                        :rules="postcodeRules"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        maxlength="12"
                        @keypress="isNumber($event)"
                        v-model="profile_details.postcode"
                        required
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>

              <v-row class="mt-1 px-4">
                <v-col cols="12" md="4" sm="4" lg="4">
                  <v-tooltip :text="$t('address')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-textarea
                        rows="3"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        maxlength="250"
                        counter="true"
                        v-model="profile_details.address"
                        v-bind:label="$t('address')"
                        required
                      ></v-textarea>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col cols="12" md="8" sm="8" lg="8">
                  <v-tooltip :text="$t('description')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-textarea
                        rows="3"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        maxlength="2000"
                        counter="true"
                        v-model="profile_details.description"
                        v-bind:label="$t('description')"
                        required
                      ></v-textarea>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
            </div>
            <div class="col-md-2 pb-8 pr-8">
              <center>
                <div>
                  <div class="image-container">
                    <v-hover v-slot="{ isHovering, props }">
                      <div style="position: relative" v-bind="props">
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-if="
                            profile_details.image_url == '' ||
                            profile_details.image_url == null
                          "
                          src="@/assets/images/upload_image_default.png"
                          width="100"
                        />
                        <img
                          v-bind:style="
                            isHovering == true ? 'filter: blur(1px);' : ''
                          "
                          v-else
                          :src="envImagePath + profile_details.image_url"
                          width="100"
                          height="85"
                          alt
                        />
                        <div v-show="isHovering" class="camera-icon">
                          <v-icon @click="uploadFile">mdi-camera</v-icon>
                        </div>
                      </div>
                    </v-hover>
                  </div>
                  <v-tooltip :text="this.$t('download')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <a class="text-center pointer download_icon">
                        <span
                          ><v-icon
                            v-if="profile_details.image_url"
                            v-bind="props"
                            class="mr-2"
                            @click="downloadImage(profile_details.image_url)"
                            >mdi mdi-download</v-icon
                          ></span
                        >
                      </a>
                    </template>
                  </v-tooltip>
                  <v-tooltip :text="this.$t('delete')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <span
                        v-bind="props"
                        v-if="
                          profile_details.image_url == '' ||
                          profile_details.image_url == null
                        "
                      >
                      </span>
                      <span v-else>
                        <v-icon
                          v-bind="props"
                          small
                          class="mr-2 edit_btn icon_size delete_icon"
                          @click="removeImage"
                          >mdi mdi-trash-can-outline</v-icon
                        >
                      </span>
                    </template>
                  </v-tooltip>
                </div>
                <br />
                <Imageupload
                  :folder="'user_profile'"
                  :resizewidth="200"
                  :resizeheight="200"
                  @uploaded_image="uploaded_image"
                  :upload_profile="uploadfile"
                />
                <div class="dimension_text">200 : 200</div>
              </center>
            </div>
          </div>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 text-right">
        <v-tooltip :text="$t('cancel')" location="bottom">
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
import DatePicker from "../../CustomComponents/DatePicker.vue";
import Imageupload from "../../CustomComponents/ImageUpload.vue";
export default {
  components: { PageTitle, DatePicker, Imageupload },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envImagePath: import.meta.env.VITE_IMAGE_PATH,
    valid: false,
    valid_error: false,
    message: "",
    loader: false,
    disabled: false,
    loading: false,
    isDisabled: false,
    from_page: "",
    profile_details: {
      id: 0,
      salutation: null,
      name: "",
      middlename: "",
      lastname: "",
      gender: null,
      email: "",
      image_url: "",
      postcode: "",
      dob: "",
      profession: "",
      maritalstatus_id: null,
      country: null,
      state: null,
      city: null,
      address: "",
      description: "",
      role_id: null,
      mobile: "",
      mobile_code: null,
      store_id: null,
    },
    user: "",
    role_array_view_profile: [],
    uploadfile: false,
    phonelength: "10",
    role_array: [],
    salutation_array: [],
    gender_array: [],
    country_array: [],
    state_array: [],
    city_array: [],
    sel_lang: "en",
  }),

  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    phoneRules() {
      return [(v) => !v || v.length >= 10 || this.$t("valid_number_required")];
    },
    numberRules() {
      return [(v) => (v >= 0 && v <= 999999999999) || this.$t("entered_value")];
    },

    postcodeRules() {
      return [(v) => (v >= 0 && v <= 999999) || this.$t("postcode_valid")];
    },

    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() {
    this.fetchlookup();
    this.get_countries();
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  mounted() {
    this.sel_lang = this.$i18n.locale;
    this.fetchRoles();
  },
  watch: {
    "$i18n.locale"(newVal) {
      this.sel_lang = newVal;
    },
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("fetchuserbyslug/" + this.$route.query.slug)
            .then((res) => {
              this.loader = false;
              if (res.data.status == "S") {
                this.profile_details = res.data.user;
                this.fetchStates(this.profile_details.country);
                this.fetch_cities(this.profile_details.state);
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log("this error" + err);
            });
        }
      },
    },
    "$route.query.from": {
      immediate: true,
      handler() {
        if (this.$route.query.from) {
          this.from_page = this.$route.query.from;
        }
      },
    },
  },
  methods: {
    changeCountry(id) {
      this.profile_details.country = id;
      this.fetchStates(this.profile_details.country);
      this.profile_details.state = null;
      this.profile_details.city = null;
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },
    uploadFile() {
      if (this.uploadfile == false) {
        this.uploadfile = true;
      } else {
        this.uploadfile = false;
      }
    },
    get_countries() {
      this.initval = true;
      this.$axios
        .get("fetch_countries")
        .then((response) => {
          console.log(response);
          this.country_array = response.data.countries;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchStates(country_id) {
      this.profile_details.mobile_code = country_id;
      this.initval = true;
      this.$axios
        .get("fetch_states_name/" + country_id)
        .then((response) => {
          this.state_array = response.data.states;
          this.initval = false;
          this.city_array = [];
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetch_cities(city_id) {
      this.initval = true;
      this.$axios
        .get("fetch_cities_name/" + city_id)
        .then((response) => {
          console.log(response);
          this.city_array = response.data.cities;
          this.initval = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploaded_image(img_src) {
      this.profile_details.image_url = img_src;
    },
    formatted_from_date(formatted_date) {
      this.profile_details.dob = formatted_date;
    },
    fetchlookup() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "SALUTATION",
          },
        })
        .then((response) => {
          this.salutation_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });

      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "GENDER",
          },
        })
        .then((response) => {
          this.gender_array = response.data.lookup_details;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    fetchRoles() {
      this.$axios
        .get("fetchrole")
        .then((response) => {
          this.role_array_view_profile = response.data.roles;
          this.role_array = response.data.roles;
          if (
            this.user.rolename == "SuperUser" &&
            this.profile_details.id == 0
          ) {
            this.role_array_view_profile = this.role_array.filter((ele) => {
              return ele.rolename != "SuperUser";
            });
          }
          if (this.user.rolename == "MallAdmin") {
            this.role_array_view_profile = this.role_array.filter((ele) => {
              return ele.rolename != "SuperUser" && ele.rolename != "MallAdmin";
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.$axios
          .post("saveuser", this.profile_details)
          .then((res) => {
            if (res.data.status == "S") {
              this.user.image_url = this.profile_details.image_url;
              const userdetails = JSON.stringify(this.user);
              localStorage.setItem("user_data", userdetails);
              this.emitter.emit("updateProfileImage");
              this.$toast.success(res.data.message);
              if (this.from_page == "") {
                this.$router.push({
                  name: "users",
                });
              } else {
                this.$router.push({
                  name: "view-my-profile",
                  query: {
                    slug: this.profile_details.slug,
                    from: this.$route.query.from,
                  },
                });
              }
            } else if (res.data.status == "E") {
              this.$toast.error(res.data.message);
              this.isDisabled = false;
            } else {
              this.$toast.error(this.$t("something_went_wrong"));
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
    cancel() {
      this.$router.push({
        name: "users",
      });
    },
    removeImage() {
      this.profile_details.image_url = null;
    },

    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
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
