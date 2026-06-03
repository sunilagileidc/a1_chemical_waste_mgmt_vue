<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="mx-2 mt-3 p-0 main-section">
      <!-- Header -->
      <div class="my-3 d-flex align-center justify-space-between">
        <page-title
          class="ml-2"
          :heading="$t('Waste Stream')"
          :google_icon="google_icon"
        ></page-title>
      </div>

      <content-loader v-if="loader"></content-loader>

      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">
            <v-row class="px-4">
              <!-- Waste Code -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  v-model="profile_details.waste_code"
                  :rules="fieldRules"
                  label="Waste Code"
                  class="required_field"
                  hide-details="auto"
                />
              </v-col>
              <!-- Hazard -->
              <v-col cols="12" md="3">
                <v-select
                  variant="outlined"
                  density="compact"
                  label="Hazard"
                  :items="[
                    {
                      title: 'Yes',
                      value: 'Y',
                    },

                    {
                      title: 'No',
                      value: 'N',
                    },
                  ]"
                  v-model="profile_details.is_hazard"
                  hide-details="auto"
                />
              </v-col>
              <!-- Components -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Waste Components"
                  v-model="profile_details.waste_components"
                  hide-details="auto"
                />
              </v-col>
              <!-- Color -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Waste Color"
                  v-model="profile_details.waste_color"
                  hide-details="auto"
                />
              </v-col>
              <!-- Description -->
              <v-col cols="12" md="6">
                <v-textarea
                  variant="outlined"
                  density="compact"
                  v-model="profile_details.waste_description"
                  label="Waste Description"
                  hide-details="auto"
                  rows="1"
                />
              </v-col>

              <!-- EWC -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="EWC / LOW"
                  v-model="profile_details.waste_ewc"
                  hide-details="auto"
                />
              </v-col>

              <!-- Physical Form -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Physical Form"
                  v-model="profile_details.waste_physical_form"
                  hide-details="auto"
                />
              </v-col>

              <!-- Hazard Code -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Hazard Code"
                  v-model="profile_details.waste_haz_code"
                  hide-details="auto"
                />
              </v-col>

              <!-- Risk Phrase -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Risk Phrase"
                  v-model="profile_details.waste_risk_pharse"
                  hide-details="auto"
                />
              </v-col>

              <!-- UN No -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="UN Number"
                  v-model="profile_details.waste_un_no"
                  hide-details="auto"
                />
              </v-col>

              <!-- Package Group -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Package Group"
                  v-model="profile_details.waste_pkg_grp"
                  hide-details="auto"
                />
              </v-col>

              <!-- UN Class -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="UN Class"
                  v-model="profile_details.waste_un_cls"
                  hide-details="auto"
                />
              </v-col>

              <!-- Shipping -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Shipping Name"
                  v-model="profile_details.waste_ship_name"
                  hide-details="auto"
                />
              </v-col>

              <!-- Assessment -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Assessment"
                  v-model="profile_details.waste_ass_raj"
                  hide-details="auto"
                />
              </v-col>

              <!-- RD Color -->
              <v-col cols="12" md="3">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="RD Color"
                  v-model="profile_details.waste_rd_color"
                  hide-details="auto"
                />
              </v-col>
            </v-row>
          </v-form>
        </div>

        <!-- Buttons -->

        <div class="d-block mr-4 mt-3 text-right">
          <v-btn
            size="small"
            @click="cancel"
            class="btn-cancel mr-2"
            color="cancel"
          >
            {{ $t("cancel") }}
          </v-btn>

          <v-btn
            :disabled="isDisabled"
            @click="submit"
            size="small"
            class="status-approved"
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
            />
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>



<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";

export default {
  components: {
    PageTitle,
  },

  data() {
    return {
      valid: false,

      loader: false,

      isDisabled: false,

      google_icon: {
        icon_name: "delete_sweep",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      profile_details: {
        id: 0,

        waste_code: "",

        waste_description: "",

        is_hazard: "N",

        waste_components: "",

        waste_ewc: "",

        waste_color: "",

        waste_physical_form: "",

        waste_haz_code: "",

        waste_risk_pharse: "",

        waste_un_no: "",

        waste_pkg_grp: "",

        waste_un_cls: "",

        waste_ship_name: "",

        waste_ass_raj: "",

        waste_rd_color: "",
      },
    };
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || "Required"];
    },
  },

  mounted() {
    if (this.$route.query.slug) {
      this.fetchWasteStream();
    }
  },

  methods: {
    fetchWasteStream() {
      this.$axios

        .get("wastestreambyslug/" + this.$route.query.slug)

        .then((res) => {
          this.profile_details = res.data.waste_stream;
        });
    },

    submit() {
      this.$axios

        .post("savewastestream", this.profile_details)

        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);

            this.$router.push({
              name: "waste_streams",
            });
          }
        });
    },

    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>