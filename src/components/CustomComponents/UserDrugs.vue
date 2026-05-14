<template>
  <div>
    <content-loader v-if="loader"></content-loader>
    <!-- {{ user_slug }} -->
    <!-- ================= DRUG REGISTRATION DETAILS ================= -->
    <div class="section-title mt-2">Drug registration details</div>
    <v-row class="mt-2 align-start" v-for="(drug, index) in drugs" :key="index">
      <v-col cols="12" md="3">
        <v-autocomplete
          label="Drug name"
          :readonly="isViewMode"
          v-model="drug.drug_id"
          variant="outlined"
          density="compact"
          item-value="drug_id"
          item-title="drug_name"
          :items="drug_list"
        />
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field
          :readonly="isViewMode"
          label="Registration start date"
          v-model="drug.start_date"
          type="date"
          variant="outlined"
          rounded="lg"
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          :readonly="isViewMode"
          label="Registration end date"
          v-model="drug.end_date"
          type="date"
          variant="outlined"
          rounded="lg"
          density="compact"
        />
      </v-col>

      <v-col cols="12" md="3" class="d-flex align-center">
        <v-chip
          :color="getStatusColor(drug)"
          variant="flat"
          class="status-chip w-100 text-center"
        >
          {{ getStatusLabel(drug) }}
        </v-chip>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["user_slug"],
  data: () => ({
    envImagePath: import.meta.env.VITE_IMAGE_PATH,
    loader: false,
    loading: false,
    uploadfile: false,
    google_icon: {
      icon_name: "account_circle",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    drugs: [],
    drug_list: [],
    showAlert: false,
    alertMessage: "",
    confirmText: "",
    confirmType: "",
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  computed: {},
  mounted() {
    this.fetchLov();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("fetchuserdatabyslug/" + this.$route.query.slug)
            .then((res) => {
              if (res.data.status == "S") {
                const user = res.data.user;
                this.profile_details = user;

                //  ROLE BASED DATA ASSIGNMENT
                if (user.role?.rolename === "Prescriber") {
                  this.drugs = user.prescriber_medications || [];
                } else if (user.role?.rolename === "Pharmacist") {
                  this.drugs = user.pharmacist_medications || [];
                } else {
                  this.drugs = [];
                }
                // Select first hospital if exists
                this.loader = false;
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
                this.loader = false;
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
    getStatusColor(drug) {
      const today = new Date();
      const expiry = new Date(drug.end_date);
      const diff = (expiry - today) / (1000 * 60 * 60 * 24);

      if (diff < 0) return "red";
      if (diff <= 60) return "orange";
      return "green";
    },
    async fetchLov() {
      this.$axios
        .get("fetch_active_drugs")
        .then((res) => {
          this.drug_list = res.data.drugs;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });

      try {
        const res = await this.$axios.get("fetchactiveinstitutions");

        if (res.data.status === "S") {
          this.hospital_list = res.data.institutions;
        }
      } catch (error) {
        this.hospital_list = [];
      }
    },
    getStatusLabel(drug) {
      const today = new Date();
      const expiry = new Date(drug.validUntil);
      const diff = (expiry - today) / (1000 * 60 * 60 * 24);

      if (diff < 0) return "Invalid - Renew required";
      if (diff <= 60) return "Valid - Renew required soon";
      return "Valid";
    },

    saveProfile() {
      console.log("Drugs:", this.drugs);
    },

    // submit() {
    //   // Hospital validation
    //   const hasEmptyHospital = this.hospitals.some(
    //     (h) => !h.institution_id || h.institution_id === null
    //   );

    //   if (hasEmptyHospital) {
    //     this.alertMessage =
    //       "Please fill all required fields before proceeding.";
    //     this.confirmText = "OK";
    //     this.confirmType = "warning";
    //     this.showAlert = true;
    //     return;
    //   }
    //   this.isDisabled = true;
    //   this.$axios
    //     .post("updateprofile", {
    //       profile_details: this.profile_details,
    //       hospitals: this.hospitals,
    //       drugs: this.drugs,
    //     })
    //     .then((res) => {
    //       if (res.data.status == "S") {
    //         this.user.image_url = this.profile_details.image_url;
    //         const userdetails = JSON.stringify(this.user);
    //         localStorage.setItem("user_data", userdetails);
    //         this.$toast.success(res.data.message);
    //         this.isDisabled = false;
    //         this.isViewMode = true;
    //       } else if (res.data.status == "E") {
    //         this.$toast.error(res.data.message);
    //         this.isDisabled = false;
    //       } else {
    //         this.$toast.error(this.$t("something_went_wrong"));
    //         this.isDisabled = false;
    //       }
    //     })
    //     .catch((err) => {
    //       this.isDisabled = false;
    //       this.$toast.error(this.$t("something_went_wrong"));
    //       this.isDisabled = false;
    //       console.log("error", err);
    //     });
    // },
  },
};
</script>
<style scoped>
.status-chip {
  width: 100%;
  justify-content: center;
  /* center text horizontally */
  font-weight: 600;
  padding: 20px 0;
  font-size: 14px;
}
</style>
