<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>
    <div class="main-section">
      <div>
        <!-- Header -->
        <div class="d-flex justify-space-between align-center">
          <page-title
            class="col-md-3"
            heading="Review PAF's"
            :google_icon="google_icon"
          ></page-title>

          <div class="add_new_button">
            <span class="mx-2 selected-row-text" v-if="selectedRows.length > 0"
              >Selected: {{ selectedRows.length }}</span
            >
            <v-btn
              v-if="user.rolename != 'PCG Admin'"
              size="small"
              class="back-btn mr-2"
              color="cancel"
              @click="goBack()"
            >
              Back
            </v-btn>
            <v-btn
              v-if="action_permissions.includes('ADD NEW PAF')"
              size="small"
              class="mb-2 create-btn mt-2"
              @click="goToCreatePAF"
            >
              {{ $t("add_new") }}
            </v-btn>
            <v-btn
              v-if="action_permissions.includes('REVIEW PAF')"
              size="small"
              color="primary"
              class="ml-2"
              :disabled="!(selectedRows.length > 1)"
              @click="reviewPafs"
            >
              Review PAF's
            </v-btn>
          </div>
        </div>
        <stats-page :stats="stats" v-if="user.rolename === 'PCG Admin'" />
        <!-- Search -->

        <div class="d-flex" style="width: 900px; margin: 0px auto">
          <div class="mr-3 mt-2">Filter By:</div>
          <!-- Reviewed Filter -->
          <v-select
            v-model="reviewFilter"
            :items="reviewOptions"
            label="Reviewed"
            density="compact"
            variant="outlined"
            clearable
            :hide-details="true"
            style="max-width: 220px"
            class="mr-3"
          />

          <!-- Indication Filter -->
          <v-select
            v-model="indicationFilter"
            :items="indicationOptions"
            label="Indication"
            density="compact"
            variant="outlined"
            clearable
            style="max-width: 220px"
            :hide-details="true"
            class="mr-3"
          />

          <!-- Status Filter -->
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            label="Status"
            density="compact"
            variant="outlined"
            clearable
            style="max-width: 220px"
            :hide-details="true"
            class="mr-3"
          />
          <!-- Compliance Filter -->
          <v-select
            v-model="complianceFilter"
            :items="complianceOptions"
            label="Compliance"
            density="compact"
            variant="outlined"
            clearable
            style="max-width: 220px"
            :hide-details="true"
            class="mr-3"
          />
        </div>
        <div class="search-wrapper">
          <v-text-field
            flat
            density="comfortable"
            variant="solo"
            v-model="search"
            append-inner-icon="mdi-magnify"
            placeholder="Search Paf, patient id or patient category..."
            hide-details
            class="search-field"
          ></v-text-field>
        </div>

        <!-- Table -->

        <!-- Since new API returns PAF DETAILS as parent rows,
update table bindings like below -->

        <v-card class="table-card pa-4">
          <v-data-table
            v-model="selectedRows"
            :headers="headers"
            :items="filteredPAFs"
            :search="search"
            :loading="loader"
            item-value="detail_id"
            :show-select="action_permissions.includes('REVIEW PAF')"
            :no-data-text="$t('no_data_available')"
            :items-per-page-text="$t('rows_per_page')"
            :item-selectable="canSelect"
          >
            <!-- Paf No -->
            <!-- class="patient_click" @click="viewPAF(item.slug)" -->
            <template #item.paf_no="{ item }">
              <span v-if="item.paf_no">
                {{ item.paf_no }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>
            <!-- Patient ID -->
            <template #item.patient_id="{ item }">
              <span v-if="item.patient_id">
                {{ item.patient_id }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>
            <!-- Non Conformance -->
            <template #item.non_conformance="{ item }">
              <v-tooltip
                v-if="item?.non_conformance?.length"
                text="View Non-compliance"
                location="top"
              >
                <template #activator="{ props }">
                  <v-avatar
                    size="28"
                    class="mx-2 cursor-pointer"
                    :color="'var(--status-non-conformance)'"
                    v-bind="props"
                    @click="nonConformanceData(item)"
                  >
                    <span class="white--text text-caption font-weight-bold">
                      {{ item.non_conformance.length }}
                    </span>
                  </v-avatar>
                </template>
              </v-tooltip>

              <span v-else>{{ $t("not_applicable") }}</span>
            </template>
            <!-- Patient ID -->
            <template #item.status="{ item }">
              <v-chip
                v-if="item.status"
                size="x-small"
                :color="$helpers.getStatusColor(item.status)"
              >
                {{ item.status }}
              </v-chip>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
    <v-dialog v-model="reviewDialog" max-width="500" persistent>
      <v-card class="text-center pa-6">
        <!-- CLOSE -->
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="closeReviewDialog">
            mdi-close
          </v-icon>
        </div>

        <!-- ICON -->
        <div class="mx-auto mb-4 renew-icon">
          <v-icon size="36" color="primary">mdi-eye</v-icon>
        </div>
        <div class="text-body-1 mb-2">
          You are reviewing multiple PAF records in bulk.Below paf No's will be
          reviewd:
        </div>

        <div class="d-flex flex-wrap justify-center">
          <v-chip
            class="ma-1"
            size="x-small"
            v-for="pid in reviewPafIds"
            :key="pid"
          >
            {{ pid }}
          </v-chip>
        </div>
        <!-- TITLE -->
        <h2 class="renew-title mt-2">Review Notes</h2>

        <!-- MESSAGE -->
        <v-textarea
          v-model="customReviewReason"
          label="Please specify reason"
          density="compact"
          variant="outlined"
          class="mt-1"
          rows="2"
        ></v-textarea>

        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-6">
          <v-btn size="small" class="btn-cancel" @click="closeReviewDialog()">
            Cancel
          </v-btn>

          <v-btn
            size="small"
            class="btn-approved mx-3"
            color="primary"
            @click="confirmReview"
          >
            Submit
          </v-btn>

          <!-- :disabled="!customReviewReason || !customReviewReason.trim()" -->
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="resultDialog" max-width="420" persistent>
      <v-card class="pa-6 text-center rounded-lg">
        <!-- Icon -->
        <div class="mb-4">
          <v-avatar
            size="70"
            :color="
              reviewStatus === 'S' ? 'success-lighten-4' : 'error-lighten-4'
            "
          >
            <v-icon
              size="42"
              :color="reviewStatus === 'S' ? 'success' : 'error'"
            >
              {{
                reviewStatus === "S" ? "mdi-check-circle" : "mdi-alert-circle"
              }}
            </v-icon>
          </v-avatar>
        </div>

        <!-- Title -->
        <div
          class="text-h6 font-weight-medium mb-2"
          :class="reviewStatus === 'S' ? 'text-success' : 'text-error'"
        >
          {{ reviewStatus === "S" ? "Success" : "Action Required" }}
        </div>

        <!-- Message -->
        <div class="text-body-2 text-grey-darken-1 mb-6">
          {{ reviewMessage }}
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-center">
          <v-btn
            size="small"
            variant="outlined"
            class="btn-outline"
            @click="closeResultDialog"
          >
            Close
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="nonConfDialog" max-width="650" persistent>
      <v-card class="nonconf-dialog pa-6">
        <!-- HEADER -->
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="d-flex align-center">
            <v-icon size="28" class="non-conf-icon mr-2">
              mdi-alert-circle-outline
            </v-icon>

            <h2 class="theme-subheader">Non-compliance Details</h2>
          </div>

          <v-icon class="close-icon" @click="nonConfDialog = false">
            mdi-close
          </v-icon>
        </div>

        <v-divider class="mb-4"></v-divider>

        <!-- LIST -->
        <div
          v-for="(n, index) in selectedPaf.non_conformance"
          :key="n.id"
          class="nonconf-item"
        >
          <div class="nonconf-index">
            {{ index + 1 }}
          </div>

          <div class="nonconf-text">
            {{ n.note }}
          </div>
        </div>

        <!-- FOOTER -->
        <div class="text-right mt-6">
          <v-btn
            size="small"
            variant="outlined"
            class="btn-outline"
            @click="nonConfDialog = false"
          >
            Close
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialogMessage: "",
    dialogTitle: "",
    loader: false,
    search: "",

    google_icon: {
      icon_name: "description",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    nonConfDialog: false,
    selectedPaf: null,
    sel_institution: "",
    action_permissions: [],

    selectedRows: [],
    reviewDialog: false,
    reviewPafIds: [],

    resultDialog: false,
    reviewStatus: "",
    reviewMessage: "",
    allPAFs: [],
    reviewFilter: null,
    indicationFilter: null,
    statusFilter: null,
    complianceFilter: null,
    customReviewReason: "",
  }),

  mounted() {
    this.sel_institution = JSON.parse(localStorage.getItem("sel_inst"));
    this.fetchPAFs();
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.action_permissions = JSON.parse(
      localStorage.getItem("action_permissions")
    );
  },

  computed: {
    headers() {
      let baseHeaders = [
        { title: "Paf No", key: "paf_no", sortable: true },
        { title: "Patient ID", key: "patient_id", sortable: true },
        { title: "Initials", key: "patient_initials", sortable: true },
        { title: "Category", key: "patient_category", sortable: true },
        { title: "DOB", key: "dob_display", sortable: true },
        { title: "Prescriber", key: "prescriber", sortable: true },
        { title: "Indication", key: "indication", sortable: true },
        { title: "Drug", key: "drug_name", sortable: true },
        { title: this.$t("status"), key: "status", sortable: true },
      ];

      //Add condition here
      if (
        this.user?.rolename === "PCG Admin" ||
        this.user?.rolename === "SuperUser"
      ) {
        baseHeaders.push({
          title: "Non-compliance",
          key: "non_conformance",
          sortable: true,
          align: "center",
        });
      }

      return baseHeaders;
    },
    /* Reviewed dropdown */
    reviewOptions() {
      return [
        { title: "Reviewed", value: 1 },
        { title: "Not Reviewed", value: 0 },
      ];
    },

    /* Indication dropdown */
    indicationOptions() {
      return [
        ...new Set(this.allPAFs.map((item) => item.indication).filter(Boolean)),
      ];
    },

    /* Status dropdown */
    statusOptions() {
      return [
        ...new Set(this.allPAFs.map((item) => item.status).filter(Boolean)),
      ];
    },
    complianceOptions() {
      return [
        { title: "Compliance", value: "yes" },
        { title: "Non-compliance", value: "no" },
      ];
    },

    /* Main Filter */
    filteredPAFs() {
      return this.allPAFs.filter((item) => {
        const text = this.search?.toLowerCase() || "";

        /* Search */
        const matchSearch =
          !text ||
          item.paf_no?.toLowerCase().includes(text) ||
          item.patient_id?.toLowerCase().includes(text) ||
          item.patient_initials?.toLowerCase().includes(text) ||
          item.prescriber?.toLowerCase().includes(text) ||
          item.drug_name?.toLowerCase().includes(text) ||
          item.indication?.toLowerCase().includes(text);

        /* Reviewed / Not Reviewed */
        const matchReview =
          this.reviewFilter === null ||
          Number(item.is_reviewed || 0) === this.reviewFilter;

        /* Indication */
        const matchIndication =
          !this.indicationFilter || item.indication === this.indicationFilter;

        /* Status */
        const matchStatus =
          !this.statusFilter || item.status === this.statusFilter;

        /* Non Compliance */
        const hasNonCompliance =
          item.non_conformance && item.non_conformance.length > 0;

        const matchCompliance =
          this.complianceFilter === null ||
          (this.complianceFilter === "yes" && !hasNonCompliance) ||
          (this.complianceFilter === "no" && hasNonCompliance);

        return (
          matchSearch &&
          matchReview &&
          matchIndication &&
          matchStatus &&
          matchCompliance
        );
      });
    },
  },
  watch: {
    search() {
      this.selectedRows = [];
    },

    reviewFilter() {
      this.selectedRows = [];
    },

    indicationFilter() {
      this.selectedRows = [];
    },

    statusFilter() {
      this.selectedRows = [];
    },
  },

  methods: {
    canSelect(item) {
      return Number(item.is_reviewed || 0) === 0;
    },
    closeReviewDialog() {
      (this.customReviewReason = ""), (this.reviewDialog = false);
    },
    closeResultDialog() {
      this.resultDialog = false;
      this.reviewDialog = false;
      this.fetchPAFs();
    },
    reviewPafs() {
      if (!this.selectedRows.length) {
        this.$toast.error("Please select pafs");
        return;
      }

      // collect patient ids
      // this.reviewPafIds = this.selectedRows.map((row) => row.paf_no);
      this.reviewPafIds = this.allPAFs
        .filter((row) => this.selectedRows.includes(row.detail_id))
        .map((row) => row.paf_no);

      // open dialog
      this.reviewDialog = true;
    },
    nonConformanceData(data) {
      this.nonConfDialog = true;
      this.selectedPaf = data;
    },
    confirmReview() {
      this.loader = true;

      const isBulk = this.selectedPafs?.length > 0;

      const payload = {
        paf_ids: this.selectedRows, // fallback to single
        is_reviewed: 1,
        admin_notes: this.customReviewReason,
      };

      this.$axios.post("bulk_review_paf", payload).then((res) => {
        if (res.data.status === "S") {
          this.reviewDialog = false;
          this.customReviewReason = "";
          this.$toast.success(res.data.message);
          this.loader = false;

          // reset selection after bulk
          this.selectedRows = [];
          // this.selectAll = false;

          this.fetchPAFs();
        } else {
          this.$toast.error(res.data.message);
          this.loader = false;
        }
      });
    },

    viewPAF(slug) {
      this.$router.push({
        name: "paf_view",
        query: { slug: slug },
      });
    },
    goBack() {
      this.$router.push({ name: "paf" });
    },
    /* =========================
           FETCH LIST
    ========================== */
    fetchPAFs() {
      this.loader = true;
      // decide URL based on role
      let url = null;
      url = "get_all_paf_report";
      this.$axios
        .get(url)
        .then((res) => {
          if (res.data.status === "S") {
            this.allPAFs = (res.data.data || []).map((item) => {
              const firstPaf = item.paf_details_list?.[0] || {};

              return {
                ...item,

                // DOB
                dob: item.dob,
                dob_display: item.dob ? this.formatDate(item.dob) : "",

                // STATUS
                status: item.status || firstPaf.status || "",

                // CREATED DATE
                declaration_date:
                  item.declaration_date || firstPaf.declaration_date || "",

                // COUNT
                // paf_details_count: Number(item.paf_details_count || 0),
              };
            });
          }
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.loader = false;
        });
    },

    /* =========================
           ROUTING
        ========================== */

    goToCreatePAF() {
      this.$router.push({
        name: "paf_create",
      });
    },

    goToEditPAF(id) {
      this.$router.push({
        name: "paf_create",
        query: { id: id },
      });
    },

    /* =========================
           CONFIRMATION
        ========================== */

    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;

      return this.$refs.confirmationDialog.open();
    },

    /* =========================
           DELETE
        ========================== */

    async deletePAF(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this record?"
      );

      if (!result) return;

      this.loader = true;

      this.$axios
        .delete("paf/" + id)
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchPAFs();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.loader = false;
        });
    },
  },
};
</script>

<style scoped>
.param-value {
  max-width: 250px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.delete_icon_size {
  font-size: 20px !important;
  cursor: pointer;
}
.patient_click {
  color: var(--theme-color);
  cursor: pointer;
}
.patient_click:hover {
  color: black;
  font-weight: 400;
}

:deep(.paf-tooltip) {
  background: white !important;
  color: #374151 !important;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
.selected-row-text {
  color: green;
  font-size: 14px;
  font-weight: bold;
}
.non-conf-icon {
  color: var(--status-non-conformance);
}
.nonconf-dialog {
  border-radius: 16px;
  background: #f9fafb;
}

.nonconf-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: white;
  margin-bottom: 10px;
  border-left: 4px solid var(--status-non-conformance);
}

.nonconf-index {
  background: var(--status-non-conformance);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nonconf-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}
.white--text {
  color: #ffffff;
}

.text-caption {
  font-size: 12px;
  line-height: 1;
}

.font-weight-bold {
  font-weight: 600;
}
</style>
