<template>
  <div class="mx-2 mt-3 p-0">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('update_profile')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <div class="row">
            <div class="col-md-10 pl-6">
              <v-row class="mt-1 px-4">
                <v-col md="2" sm="2" lg="2">
                  <v-tooltip :text="this.$t('salutation')" location="bottom">
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

                <v-col md="6" lg="6" sm="6">
                  <v-tooltip :text="this.$t('firstname')" location="bottom">
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
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>

                <v-col lg="4" sm="4" md="4">
                  <v-tooltip :text="this.$t('lastname')" location="bottom">
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
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row class="mt-1 px-4">
                <v-col md="2" sm="2" lg="2">
                  <v-tooltip :text="this.$t('gender')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('gender')"
                        index="id"
                        item-key="longname"
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
                <v-col md="3" sm="3" lg="3">
                  <DatePicker
                    :label="$t('dob')"
                    :stored_date="profile_details.dob"
                    @formatted_date="formatted_from_date"
                    dense
                    v-model="profile_details.dob"
                  />
                </v-col>
                <v-col md="3" lg="3" sm="3">
                  <v-tooltip
                    :text="this.$t('marital_status')"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('marital_status')"
                        index="id"
                        item-key="id"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        item-title="longname"
                        v-model="profile_details.maritalstatus_id"
                        :items="marital_status_array"
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("marital_status") }}</span>
                  </v-tooltip>
                </v-col>
                <v-col md="4" lg="4" sm="4">
                  <v-tooltip :text="this.$t('role')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('role')"
                        index="id"
                        item-key="id"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        item-title="rolename"
                        item-value="id"
                        v-model="profile_details.role_id"
                        :rules="fieldRules"
                        :items="role_array"
                        class="required_field mt_30"
                      ></v-autocomplete>
                    </template>
                    <span>{{ $t("marital_status") }}</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row class="mt-1 px-4">
                <v-col md="5" sm="5" lg="5">
                  <v-tooltip :text="this.$t('email')" location="bottom">
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
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col md="3" lg="3" sm="3" px-2>
                  <v-tooltip :text="this.$t('postcode')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind:label="$t('postcode')"
                        :rules="postcodeRules"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        maxlength="12"
                        v-model="profile_details.postcode"
                        required
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col md="4" lg="4" sm="4" px-2>
                  <v-tooltip :text="this.$t('phone_number')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-text-field
                        v-bind:label="$t('phone_number')"
                        :rules="phoneRules"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        maxlength="12"
                        v-model="profile_details.phone"
                        required
                      ></v-text-field>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>

              <v-row class="mt-1 px-4">
                <v-col md="4" sm="4" lg="4">
                  <v-tooltip :text="this.$t('country')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('country')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        index="id"
                        item-key="shortname"
                        item-title="longname"
                        v-model="profile_details.country"
                        :items="country_array"
                      ></v-autocomplete>
                    </template>
                  </v-tooltip>
                </v-col>

                <v-col md="4" sm="4" lg="4">
                  <v-tooltip :text="this.$t('state')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('state')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        index="id"
                        item-key="shortname"
                        item-title="longname"
                        v-model="profile_details.state"
                        :items="state_array"
                      ></v-autocomplete>
                    </template>
                  </v-tooltip>
                </v-col>
                <v-col md="4" sm="4" lg="4">
                  <v-tooltip :text="this.$t('city')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-autocomplete
                        v-bind:label="$t('city')"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        index="id"
                        item-key="shortname"
                        item-title="longname"
                        v-model="profile_details.city"
                        :items="city_array"
                      ></v-autocomplete>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>

              <v-row class="mt-1 px-4">
                <v-col md="8" sm="8" lg="8">
                  <v-tooltip :text="this.$t('address')" location="bottom">
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
                <v-col md="4" sm="4" lg="4">
                  <v-tooltip :text="this.$t('description')" location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-textarea
                        rows="3"
                        v-bind="props"
                        variant="outlined"
                        density="compact"
                        counter="true"
                        maxlength="250"
                        v-model="profile_details.description"
                        v-bind:label="$t('description')"
                        required
                      ></v-textarea>
                    </template>
                  </v-tooltip>
                </v-col>
              </v-row>
            </div>

            <div class="col-md-2 text-center align-self-center pb-8 pr-8">
              <center>
                <!-- <v-avatar size="100" class="text-center mtb-20">
                  <div class="camera-icon">
                    <v-tooltip v-model="show" top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                          <v-icon @click="upload_Image" color="grey lighten-1">
                            mdi-camera
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("upload_profile_pic") }}</span>
                    </v-tooltip>
                  </div>
                </v-avatar> -->
                <br />
                <p>coming soon</p>
              </center>
            </div>
          </div>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 text-right">
        <v-tooltip :text="this.$t('cancel')" location="bottom">
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
import DatePicker from "../../CustomComponents/DatePicker.vue";
export default {
  components: { PageTitle, DatePicker },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
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
    profile_details: {
      id: 0,
      salutation: null,
      name: "",
      middlename: "",
      lastname: "",
      gender: null,
      email: "",
      profile_pic: null,
      postcode: "",
      dob: "",
      maritalstatus_id: null,
      country: null,
      state: null,
      city: null,
      address: "",
      description: "",
      role_id: null,
      phone: "",
    },
    marital_status_array: [],
    role_array: [],
    salutation_array: [],
    gender_array: [],
    country_array: [],
    state_array: [],
    city_array: [],
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
      return [
        (v) => (v >= 0 && v <= 999999999999) || this.$t("number_required"),
      ];
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
    this.fetchRoles();
  },
  watch: {
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
  },
  methods: {
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
            lookup_type: "MARITAL_STATUS",
          },
        })
        .then((response) => {
          this.marital_status_array = response.data.lookup_details;
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
          this.role_array = response.data.roles;
          this.role_array = this.role_array.filter((ele) => {
            return ele.rolename == "Admin";
          });
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
              this.$toast.success(res.data.message);
              this.$router.push({
                name: "view-my-profile",
                query: {
                  slug: this.profile_details.slug,
                },
              });
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
  },
};
</script>
  