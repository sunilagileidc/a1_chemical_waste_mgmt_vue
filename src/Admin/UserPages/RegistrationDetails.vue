<template>
  <v-container fluid class="page-wrapper background">
    <content-loader v-if="loader" />

    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    />
    <!-- {{ institutionTypes }} -->
    <div class="main-section">
      <v-btn variant="outlined" class="register-btn" @click="goBackToDetails">
        Back
      </v-btn>

      <v-card class="details-card pa-6 mt-4" elevation="0">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-4">
          <h2 class="heading">Registration Details</h2>

          <v-chip
            size="small"
            class="text-white"
            :class="getStatusClass(reg_deatils.reg_status)"
          >
            {{ formatStatus(reg_deatils.reg_status) }}
          </v-chip>
        </div>

        <v-divider class="mb-6" />

        <!-- Basic Info -->
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="reg_deatils.name"
              label="First Name"
              variant="outlined"
              density="compact"
              readonly
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="reg_deatils.lastname"
              label="Last Name"
              variant="outlined"
              density="compact"
              readonly
            />
          </v-col>
        </v-row>

        <!-- ================= PHARMACIST ================= -->
        <template
          v-if="
            reg_deatils.role?.rolename === 'Pharmacist' &&
            reg_deatils.pharmacist
          "
        >
          <h4 class="mt-6 mb-4">Pharmacist Details</h4>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="reg_deatils.pharmacist.reg_no"
                label="GPhC / PSNI Registration Number"
                variant="outlined"
                density="compact"
                readonly
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="reg_deatils.pharmacist.phone_no"
                label="Phone Number"
                variant="outlined"
                density="compact"
                readonly
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="reg_deatils.pharmacist.institution_type"
                :items="institutionTypes"
                item-title="longname"
                item-value="shortname"
                label="Institution Type"
                variant="outlined"
                density="compact"
                readonly
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="reg_deatils.pharmacist.institution_id"
                :items="institutions"
                item-title="name"
                item-value="id"
                label="Institution"
                variant="outlined"
                density="compact"
                readonly
              />
            </v-col>
          </v-row>

          <!-- Addresses -->
          <div class="custom-field plain-wrapper mt-4">
            <label class="plain-label">Dispensing Address</label>
            <div class="plain-value">
              {{ reg_deatils.pharmacist.dispensing_address }}
            </div>
          </div>

          <v-text-field
            v-model="reg_deatils.pharmacist.delivery_address"
            label="Delivery Address"
            variant="outlined"
            density="compact"
            readonly
            class="mt-4"
          />

          <v-text-field
            v-model="reg_deatils.pharmacist.ordering_address"
            label="Ordering Address"
            variant="outlined"
            density="compact"
            readonly
          />
        </template>

        <!-- ================= PRESCRIBER ================= -->
        <template
          v-if="
            reg_deatils.role?.rolename === 'Prescriber' &&
            reg_deatils.prescriber
          "
        >
          <h4 class="heading">Prescriber Details</h4>
          <v-divider class="mb-6" />
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="reg_deatils.prescriber.reg_no"
                label="Registration Number"
                variant="outlined"
                density="compact"
                readonly
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="reg_deatils.prescriber.job_title"
                label="Job Title"
                variant="outlined"
                density="compact"
                readonly
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="reg_deatils.prescriber.institution_id"
                :items="institutions"
                item-title="name"
                item-value="id"
                label="Institution"
                variant="outlined"
                density="compact"
                readonly
              />
            </v-col>
          </v-row>
        </template>

        <v-divider class="my-6" />

        <!-- Action Buttons -->
        <div
          class="d-flex justify-end"
          v-if="
            reg_deatils.reg_status !== 'Approved' &&
            reg_deatils.reg_status !== 'Rejected'
          "
        >
          <v-btn
            class="status-approved mr-3"
            size="small"
            @click="updateStatus(reg_deatils, 'Approved', 1)"
          >
            Approve
          </v-btn>

          <v-btn
            color="red"
            size="small"
            @click="openRejectDialog(reg_deatils)"
          >
            Reject
          </v-btn>
        </div>
      </v-card>
    </div>

    <!-- Reject Dialog -->
    <v-dialog v-model="rejectDialog" max-width="500">
      <v-card>
        <v-card-title>Rejection Reason</v-card-title>
        <v-card-text>
          <!-- <v-textarea
            v-model="rejectReason"
            label="Enter reason"
            auto-grow
            required
          /> -->
          <v-autocomplete
            v-bind:label="$t('rejected_reason')"
            item-value="shortname"
            item-title="longname"
            density="compact"
            variant="outlined"
            v-bind="props"
            index="id"
            v-model="rejectReason"
            class="required_field"
            :rules="fieldRules"
            :items="rejected_reasons"
            outlined
            required
            dense
          ></v-autocomplete>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            class="btn-cancel"
            color="white"
            size="small"
            @click="closeRejectDialog"
            >Cancel</v-btn
          >
          <v-btn
            class="status-approved mr-3"
            size="small"
            :disabled="!rejectReason"
            @click="confirmReject"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      rejected_reasons: [],
      reg_deatils: {
        id: 0,
        name: "",
        lastname: " ",
        email: "",
        email_verified_at: null,
        token_id: null,
        role_id: 3,
        salutation: null,
        gender: null,
        dob: null,
        address: null,
        postcode: null,
        description: null,
        image_url: null,
        country: null,
        state: null,
        city: null,
        mobile: null,
        mobile_code: null,
        otp: null,
        otp_valid_until: null,
        is_otp_validated: 1,
        status: 0,
        reg_status: "Awaiting Approval",
        rejection_reason: null,
        slug: "",
        expired: 0,
        signature_date: "2026-02-20 00:00:00",
        signature: "",
        created_by: null,
        updated_by: null,
        created_at: "",
        updated_at: "",
        rolename: "",
        full_name: "",
        role: {
          id: 0,
          rolename: "",
          role_display_name: "",
          roledescription: "",
          status: 1,
          slug: "",
          created_by: null,
          updated_by: null,
          created_at: null,
          updated_at: null,
        },
        pharmacist: {
          id: 0,
          user_id: 0,
          reg_no: "",
          phone_no: "",
          dispensing_address: "",
          delivery_address: "",
          ordering_address: "",
          institution_type: "",
          institution_id: 1,
          slug: "",
          role: "",
          created_by: 5,
          updated_by: null,
          created_at: "2026-02-20T09:29:26.000000Z",
          updated_at: "2026-02-20T09:29:26.000000Z",
        },
        prescriber: {
          id: 0,
          user_id: 0,
          reg_no: "",
          phone_no: "",
          dispensing_address: "",
          delivery_address: "",
          ordering_address: "",
          institution_type: "",
          institution_id: 1,
          slug: "",
          role: "",
          created_by: 5,
          updated_by: null,
          created_at: "2026-02-20T09:29:26.000000Z",
          updated_at: "2026-02-20T09:29:26.000000Z",
        },
      },

      dialogTitle: "",
      dialogMessage: "",
      loader: false,
      institutionTypes: [],
      institutions: [],
      rejectDialog: false,
      rejectReason: "",
      rejectObj: null,
    };
  },
  created() {
    this.fetchLookup();
  },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.getRegDetails();
        }
      },
    },
  },
  computed: {
    requiredRule() {
      return [(v) => !!v || "This field is required"];
    },

    phoneRules() {
      return [
        (v) => !!v || "Phone number is required",
        (v) => /^[0-9+\s()-]*$/.test(v) || "Only numbers and + - allowed",
        (v) => v.replace(/\D/g, "").length >= 8 || "Enter a valid phone number",
      ];
    },
  },

  methods: {
    formatStatus(status) {
      if (status === "Approved" || status === 1) return "Approved";
      if (status === "Rejected" || status === 0) return "Rejected";
      return "Awaiting Approval";
    },

    getStatusClass(status) {
      if (status === "Approved" || status === 1) return "status-approved";
      if (status === "Rejected" || status === 0) return "status-rejected";
      return "status-warning";
    },

    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    getRegDetails() {
      this.loader = true;

      this.$axios
        .get("fetch_regdetails_by_slug/" + this.$route.query.slug)
        .then((res) => {
          this.reg_deatils = res.data.reg_deatils;

          const roleName = this.reg_deatils?.role?.rolename;

          // Normalize data (important)
          if (roleName === "Pharmacist") {
            this.reg_deatils.pharmacist =
              this.reg_deatils.pharmacist ||
              this.reg_deatils.pharmacist_details?.[0] ||
              null;

            if (this.reg_deatils.pharmacist) {
              this.fetchInstitutionList(
                this.reg_deatils.pharmacist.institution_type
              );
            }
          }

          if (roleName === "Prescriber") {
            this.reg_deatils.prescriber =
              this.reg_deatils.prescriber ||
              this.reg_deatils.prescriber_details?.[0] ||
              null;

            if (this.reg_deatils.prescriber) {
              this.fetchInstitutions();
            }
          }
        })
        .finally(() => {
          this.loader = false;
        });
    },

    goBackToDetails() {
      this.$router.push({ name: "registration_list" });
    },

    async updateStatus(regObj, reg_status, status) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update the status?"
      );
      if (!result) return;

      this.loader = true;
      this.$axios
        .post("updateRegStatus", {
          slug: regObj.slug,
          name: regObj.name,
          email: regObj.email,
          reg_status: reg_status,
          status: 1,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.getRegDetails();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
        });
    },

    openRejectDialog(regObj) {
      this.rejectObj = regObj;
      this.rejectReason = "";
      this.rejectDialog = true;
    },

    closeRejectDialog() {
      this.rejectDialog = false;
      this.rejectReason = "";
    },
    fetchInstitutionList(type) {
      this.institutions = [];
      // this.reg_deatils.pharmacist.institution_id = null;
      this.$axios
        .get("fetch_institution_by_type", {
          params: {
            type: type,
          },
        })
        .then((response) => {
          this.institutions = response.data.institutions;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
    async fetchInstitutions() {
      try {
        const res = await this.$axios.get("fetchactiveinstitutions");

        if (res.data.status === "S") {
          this.institutions = res.data.institutions;
        }
      } catch (error) {
        this.hospitals = [];
      }
    },
    fetchLov() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "INSTITUTION_TYPE",
          },
        })
        .then((res) => {
          this.institutionTypes = res.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });

      // this.$axios
      //   .get("fetch_active_drugs")
      //   .then((res) => {
      //     this.medications = res.data.drugs;

      //     // Build terms structure dynamically (temporary hardcoded example)
      //     this.medicationTerms = this.medications.map((drug) => ({
      //       id: drug.id,
      //       name: drug.drug_name,
      //       terms: this.getDefaultTerms(drug.id),
      //     }));
      //   })
      //   .catch((err) => {
      //     this.$toast.error(this.$t("something_went_wrong"));
      //     console.log(err);
      //   });

      // this.$axios
      //   .get("fetch_active_wholesalers")
      //   .then((res) => {
      //     this.wholesalers = res.data.wholesalers;

      //     // Initialize empty account numbers dynamically
      //     this.wholesalers.forEach((wh) => {
      //       this.form.wholesaler_accounts[wh.id] = "";
      //     });
      //   })
      //   .catch((err) => {
      //     this.$toast.error(this.$t("something_went_wrong"));
      //     console.log(err);
      //   });
    },

    async confirmReject() {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to reject this registration?"
      );
      if (!result) return;

      this.rejectDialog = false;
      this.loader = true;

      this.$axios
        .post("updateRegStatus", {
          slug: this.rejectObj.slug,
          reg_status: "Rejected",
          name: this.rejectObj.name,
          email: this.rejectObj.email,
          reject_reason: this.rejectReason,
          status: 0,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.getRegDetails();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
        });
    },
    fetchLookup() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "REJECTED_REASONS",
          },
        })
        .then((response) => {
          this.rejected_reasons = response.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
/* Page Background */
.page-wrapper {
  padding: 40px;
}

/* Search */
.search-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  width: 562px;
  position: relative;
  top: 34px;
  z-index: 20000;
  left: 29%;
}

.search-wrapper :deep(.v-field) {
  border-radius: 30px;
}

.search-field {
  width: 500px;
  border-radius: 999px;
}

/* Table Card */
.table-card {
  border-radius: 7px;
  background: #e9edf7;
  backdrop-filter: blur(12px);
}

/* Remove default header background */
.custom-table :deep(.v-data-table-header) {
  background: transparent;
}

/* Header text styling */
.custom-table :deep(th) {
  color: #6c4df6;
  font-weight: 600;
  font-size: 14px;
}

/* Row styling */
.custom-table :deep(td) {
  padding-top: 4px !important;
  padding-bottom: 6px !important;
  font-size: 12px;
  color: #444;
}

/* Row divider */
.custom-table :deep(tbody tr) {
  border-bottom: 1px solid #eaeaf5;
}

/* Status styling */
.status-text {
  font-weight: 600;
}

.status-submitted {
  color: #6c6c6c;
}

.status-rejected {
  color: #ff2d55;
}

/* PDF button */
.pdf-btn {
  background: #6c4df6;
  color: white;
  border-radius: 50%;
}

.pdf-btn:hover {
  background: #5b3de6;
}
.v-table {
  background: #e9edf7 !important;
}
.details-card {
  border-radius: 5px;
  background: #e9edf7;
}

.detail-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.detail-label {
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}
</style>
