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
            heading="PAF Report"
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
              v-if="action_permissions.includes('MERGE PAF')"
              size="small"
              color="primary"
              class="ml-2"
              :disabled="!(selectedRows.length > 1)"
              @click="mergePatients"
            >
              Merge Patients
            </v-btn>
          </div>
        </div>
        <stats-page :stats="stats" v-if="user.rolename === 'PCG Admin'" />
        <!-- Search -->
        <div class="search-wrapper">
          <v-text-field
            flat
            density="comfortable"
            variant="solo"
            v-model="search"
            append-inner-icon="mdi-magnify"
            placeholder="Search patient, prescriber or drug..."
            hide-details
            class="search-field"
          ></v-text-field>
        </div>
        <!-- ---{{ selectedRows }} -->
        <!-- Table -->
        <v-card class="table-card pa-4">
          <v-data-table
            v-model="selectedRows"
            :headers="headers"
            :items="allPAFs"
            :search="search"
            :loading="loader"
            :show-select="action_permissions.includes('MERGE PAF')"
            item-value="patient_id"
            :no-data-text="$t('no_data_available')"
            :items-per-page-text="$t('rows_per_page')"
          >
            <!-- Patient ID -->
            <template #item.patient_id="{ item }">
              <span
                v-if="item.patient_id"
                class="patient_click"
                @click="viewPAF(item.slug)"
              >
                {{ item.patient_id }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>

            <!-- Initials -->
            <template #item.patient_initials="{ item }">
              <span v-if="item.patient_initials">
                {{ item.patient_initials }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>

            <!-- Gender -->
            <template #item.patient_category="{ item }">
              <span v-if="item.patient_category">
                {{ item.patient_category }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>

            <!-- DOB -->
            <template #item.dob_display="{ item }">
              <span v-if="item.dob">
                {{ formatDate(item.dob) }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>

            <!-- Prescriber -->
            <template #item.prescriber="{ item }">
              <span v-if="item.prescriber">
                {{ item.prescriber }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>

            <!-- Indication -->
            <!-- <template #item.indication="{ item }">
              <span v-if="item.indication">
                {{ item.indication }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template> -->

            <!-- Drug -->
            <template #item.drug_name="{ item }">
              <span v-if="item.drug_name">
                {{ item.drug_name }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>

            <!-- Status -->
            <template #item.status="{ item }">
              <v-chip
                v-if="item.paf_details_list?.length"
                size="x-small"
                :color="
                  $helpers.getStatusColor(item.paf_details_list[0].status)
                "
              >
                {{ item.paf_details_list[0].status }}
              </v-chip>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>

            <template #item.is_retrospective="{ item }">
              <v-chip
                v-if="item.paf_details_list?.length"
                size="x-small"
                :color="$helpers.getRetrospectiveColor(item.is_retrospective)"
              >
                {{ item.is_retrospective == 1 ? "Yes" : "No" }}
              </v-chip>
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

            <!-- Total PAF -->
            <template #item.paf_details_count="{ item }">
              <v-tooltip
                location="top"
                open-on-hover
                open-on-click
                content-class="paf-tooltip"
              >
                <template #activator="{ props }">
                  <v-chip
                    v-bind="props"
                    color="primary"
                    size="small"
                    style="cursor: pointer"
                  >
                    {{ item.paf_details_count }}
                  </v-chip>
                </template>

                <div style="min-width: 250px">
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th class="text-left">PAF No</th>
                        <th v-if="user.rolename === 'PCG Admin'">
                          Institution
                        </th>
                        <th class="text-left">Created By</th>
                        <th class="text-left">Created On</th>
                        <th class="text-left">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="paf in item.paf_details_list"
                        :key="paf.paf_no"
                      >
                        <td>{{ paf.paf_no }}</td>

                        <td v-if="user.rolename === 'PCG Admin'">
                          {{ item.institution_data.name }}
                        </td>

                        <td>{{ paf.declaration_name }}</td>

                        <td>{{ formatDate(paf.declaration_date) }}</td>

                        <td>
                          <v-chip
                            :color="$helpers.getStatusColor(paf.status)"
                            size="x-small"
                          >
                            {{ paf.status }}
                          </v-chip>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
    <v-dialog v-model="mergeDialog" max-width="700">
      <v-card class="pa-6 text-center">
        <div class="mb-4">
          <v-icon size="60" color="primary">mdi-file-search-outline</v-icon>
        </div>

        <div class="text-body-1 mb-4">
          You have indicated that this patient is a duplicate record. To be
          considered a potential patient duplicate record, they must have the
          same initials, Date of Birth and Patient Category.
        </div>

        <div class="mb-2 font-weight-medium">
          These patient IDs will be merged:
        </div>

        <div class="d-flex flex-wrap justify-center">
          <v-chip class="ma-1" v-for="pid in selectedRows" :key="pid">
            {{ pid }}
          </v-chip>
        </div>

        <div class="mt-6">
          <v-btn class="btn-cancel" size="small" @click="mergeDialog = false">
            Cancel
          </v-btn>

          <v-btn
            size="small"
            class="btn-approved mx-3"
            color="primary"
            @click="CheckUserAuthorization"
          >
            Confirm Merge
          </v-btn>
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
              mergeStatus === 'S' ? 'success-lighten-4' : 'error-lighten-4'
            "
          >
            <v-icon
              size="42"
              :color="mergeStatus === 'S' ? 'success' : 'error'"
            >
              {{
                mergeStatus === "S" ? "mdi-check-circle" : "mdi-alert-circle"
              }}
            </v-icon>
          </v-avatar>
        </div>

        <!-- Title -->
        <div
          class="text-h6 font-weight-medium mb-2"
          :class="mergeStatus === 'S' ? 'text-success' : 'text-error'"
        >
          {{ mergeStatus === "S" ? "Success" : "Action Required" }}
        </div>

        <!-- Message -->
        <div class="text-body-2 text-grey-darken-1 mb-6">
          {{ mergeMessage }}
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
    <!-- User Authentication Component Start -->
    <user-authentication
      :showauthentication="authflag"
      @update:showauthentication="authflag = $event"
      @confirmed="handleLeadConfirmed"
      @cancelled="handleLeadCancelled"
      dialogTitle="User Authentication"
      dialogDesc="Please Enter your Password to Confirm"
    />
    <!-- User Authentication Component Start -->
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialogMessage: "",
    dialogTitle: "",
    loader: false,
    search: "",
    nonConfDialog: false,
    selectedPaf: null,
    google_icon: {
      icon_name: "description",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },

    allPAFs: [],
    sel_institution: "",
    action_permissions: [],
    stats: [
      { label: "Total PAFs", value: 0 },
      { label: "Total patients", value: 0 },
      { label: "Overdue PAF (Action Required)", value: 0 },
      { label: "Rejected PAF", value: 0 },
    ],
    selectedRows: [],
    mergeDialog: false,
    mergePatientIds: [],

    resultDialog: false,
    mergeStatus: "",
    mergeMessage: "",
    authflag: false,
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
    this.getPafStats();
  },

  computed: {
    headers() {
      let baseHeaders = [
        { title: "Patient ID", key: "patient_id", sortable: true },
        { title: "Category", key: "patient_category", sortable: true },
        { title: "Initials", key: "patient_initials", sortable: true },
        { title: "DOB", key: "dob_display", sortable: true },
        { title: "Prescriber", key: "prescriber", sortable: true },
        { title: "Drug Name", key: "drug_name", sortable: true },
        {
          title: "Retrospective",
          key: "is_retrospective",
          sortable: true,
          align: "center",
        },
        { title: this.$t("status"), key: "status", sortable: true },
        {
          title: "Total PAF",
          key: "paf_details_count",
          sortable: true,
          align: "center",
        },
      ];
      // Add condition here
      if (
        this.user?.rolename === "PCG Admin" ||
        this.user?.rolename === "SuperUser"
      ) {
        baseHeaders.push({
          title: "Non-compliance",
          key: "non_conformance",
          sortable: true,
        });
      }

      return baseHeaders;
    },
  },

  methods: {
    closeResultDialog() {
      this.resultDialog = false;
      this.mergeDialog = false;
      this.fetchPAFs();
    },
    mergePatients() {
      if (!this.selectedRows.length) {
        this.$toast.error("Please select patients");
        return;
      }

      // collect patient ids
      this.mergePatientIds = this.selectedRows.map((row) => row.patient_id);

      // open dialog
      this.mergeDialog = true;
    },
    async CheckUserAuthorization() {
      try {
        this.loader = true;
        this.authflag = true;
      } catch (error) {
        console.error(error);
      } finally {
        this.loader = false;
      }
    },
    handleLeadCancelled() {},

    // Called when password verified successfully
    handleLeadConfirmed() {
      this.$toast.success("User verified successfully.");
      this.confirmMerge();
      this.authflag = false;
    },
    confirmMerge() {
      this.loader = true;

      this.$axios
        .post("merge_paf", {
          patient_ids: this.selectedRows,
        })
        .then((res) => {
          this.mergeStatus = res.data.status;
          this.mergeMessage =
            res.data.status === "S"
              ? "PAF merged successfully"
              : res.data.message;

          this.resultDialog = true;

          if (res.data.status === "S") {
            this.fetchPAFs(); // refresh table
            this.selectedRows = [];
          }
        })
        .catch(() => {
          this.mergeStatus = "E";
          this.mergeMessage = this.$t("something_went_wrong");
          this.resultDialog = true;
        })
        .finally(() => {
          this.loader = false;
          this.mergeDialog = false;
        });
    },
    getPafStats() {
      this.loader = true;
      // decide URL based on role

      this.$axios
        .get("get_all_paf_stats", {
          params: {
            institution_id: this.sel_institution?.institution_id,
          },
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.stats = res.data.stats;
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
    viewPAF(slug) {
      this.$router.push({
        name: "paf_view",
        query: { slug: slug },
      });
    },
    goBack() {
      this.$router.push({ name: "paf" });
    },
    nonConformanceData(data) {
      this.nonConfDialog = true;
      this.selectedPaf = data;
    },
    /* =========================
           FETCH LIST
    ========================== */
    fetchPAFs() {
      this.loader = true;

      // decide URL based on role
      let url = null;
      if (this.user.rolename === "Prescriber") {
        url = "get_prescriber_paf";
      } else if (this.user.rolename === "Pharmacist") {
        url = "get_pharmacist_paf";
      } else {
        url = "get_all_pafs";
      }

      this.$axios
        .get(url, {
          params: {
            institution_id: this.sel_institution?.institution_id,
          },
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.allPAFs = (res.data.data || []).map((item) => {
              const firstPaf = item.paf_details_list?.[0] || {};

              return {
                ...item,

                // DOB
                dob: item.dob,
                dob_display: item.dob ? this.formatDate(item.dob) : "",

                // STATUS (important for sorting)
                status: firstPaf.status || "",

                // CREATED DATE (optional if you want sort later)
                declaration_date: firstPaf.declaration_date || "",

                // COUNT ensure number
                paf_details_count: Number(item.paf_details_count || 0),
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
