<template>
  <div fluid class="page-wrapper background-inner">
    <div class="main-section">
      <div class="my-3 p-0">
        <!-- v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']" -->
        <page-title
          class="col-md-4 ml-2"
          heading="Create/Amend Wholesaler"
          :google_icon="google_icon"
        ></page-title>
      </div>
      <content-loader v-if="loader"></content-loader>
      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-select
                  hide-details="auto"
                  v-model="wholesaler.institution_id"
                  :items="institutions"
                  item-title="name"
                  item-value="id"
                  :rules="requiredRule"
                  :loading="institutionsLoading"
                  density="compact"
                  variant="outlined"
                  label="Select Institution"
                  class="custom-field field-required"
                />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12" md="12">
                <!-- Wholesaler -->
                <h6 class="section-title mt-4 mb-1">
                  <div>
                    <span class="section-text theme-subheader mb-2">
                      Wholesaler Details
                    </span>
                    <!-- <v-divider class="ml-4"></v-divider> -->
                  </div>
                </h6>
              </v-col>
              <v-col cols="12" md="6">
                <v-row>
                  <v-col
                    v-for="wh in wholesalers"
                    :key="wh.id"
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="wholesaler.wholesaler_accounts[wh.id]"
                      :label="wh.name + ' Account Number'"
                      variant="outlined"
                      density="compact"
                      class="custom-field"
                      hide-details
                    />
                  </v-col>
                </v-row>
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
                  class="status-approved mr-2"
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
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: { PageTitle },
  data: () => ({
    google_icon: {
      icon_name: "local_hospital",
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
    wholesaler: {
      pharmacist_id: 0,
      wholesaler_accounts: {},
    },
    wholesalers: [],
    institutionsLoading: false,
    institutions: [],
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
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },
  mounted() {},
  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.fetchInstitutionList();
    this.initialize();
  },
  watch: {
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        ("");
        this.sel_lang = "en";
      }
    },
    "wholesaler.institution_id"(newVal) {
      if (newVal) {
        this.fetchWholesalerAccounts(newVal);
      }
    },
  },
  methods: {
    initialize() {
      this.$axios
        .get("fetch_active_wholesalers")
        .then((res) => {
          this.wholesalers = res.data.wholesalers;
          // Initialize empty account numbers dynamically
          this.wholesalers.forEach((wh) => {
            if (!(wh.id in this.wholesaler.wholesaler_accounts)) {
              this.wholesaler.wholesaler_accounts[wh.id] = "";
            }
          });
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
    fetchInstitutionList() {
      this.institutionsLoading = true;
      this.institutions = [];
      this.wholesaler.institution_id = null;

      this.$axios
        .get(`fetch_institutions_by_user/${this.user.id}`)

        .then((response) => {
          if (response.data.status === "S") {
            this.institutions = response.data.institutions || [];

            // auto-select first institution (optional UX improvement)
            if (this.institutions.length) {
              this.wholesaler.institution_id = this.institutions[0].id;
            }
          } else {
            this.$toast.error(
              response.data.message || "Failed to load institutions"
            );
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.error(err);
        })
        .finally(() => {
          this.institutionsLoading = false; // ❌ no need for setTimeout
        });
    },
    fetchWholesalerAccounts(institutionId) {
      this.loader = true;

      this.$axios
        .get(`get_wholesaler_accounts`, {
          params: {
            user_id: this.user.id,
            institution_id: institutionId,
          },
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.wholesaler.wholesaler_accounts = {};

            res.data.wholesalers.forEach((wh) => {
              this.wholesaler.wholesaler_accounts[wh.id] = wh.acc_no ?? "";
            });

            console.log(this.wholesaler.wholesaler_accounts);
          }
        })
        .finally(() => {
          this.loader = false;
        });
    },
    submit() {
      this.isDisabled = true;

      const payload = {
        pharmacist_id: this.user.pharmacist?.id, // adjust if needed
        institution_id: this.wholesaler.institution_id, // adjust if needed
        user_id: this.user.id,
        wholesaler_accounts: this.wholesaler.wholesaler_accounts,
      };

      this.$axios
        .post("save_wholesaler_accounts", payload)
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success("Saved successfully");
            this.fetchWholesalerAccounts(this.wholesaler.institution_id);
          } else {
            this.$toast.error(res.data.message || "Failed");
          }
        })
        .catch((err) => {
          console.error(err);
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.isDisabled = false;
        });
    },
    cancel() {
      this.$router.push({
        name: "institution_selection",
      });
    },
  },
};
</script>
