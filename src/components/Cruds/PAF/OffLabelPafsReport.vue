<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>
    <confirmation-dialog ref="confirmationDialog" :title="dialogTitle" :message="dialogMessage"></confirmation-dialog>
    <div class="main-section">
      <div>
        <!-- Header -->
        <div class="d-flex justify-space-between align-center">
          <page-title class="col-md-3" heading="Off-Label PAFs Report" :google_icon="google_icon"></page-title>
        </div>
        <!-- Search -->
        <div class="search-wrapper">
          <v-text-field flat density="comfortable" variant="solo" v-model="search" append-inner-icon="mdi-magnify"
            placeholder="Search patient, prescriber or drug..." hide-details class="search-field"></v-text-field>
        </div>
        <!-- Table -->
        <v-card class="table-card pa-4">
          <v-data-table v-model="selectedRows" :headers="headers" :items="allPAFs" :search="search" :loading="loader"
            :show-select="action_permissions.includes('MERGE PAF')" item-value="patient_id"
            :no-data-text="$t('no_data_available')" :items-per-page-text="$t('rows_per_page')">
            <!-- Patient ID -->
            <template #item.patient_id="{ item }">
              <span v-if="item.patient_id" class="patient_click" @click="viewPAF(item.slug)">
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
            <template #item.gender="{ item }">
              <span v-if="item.gender">
                {{ item.gender }}
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
            <template #item.indication="{ item }">
              <span v-if="item.indication">
                {{ item.indication }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>

            <!-- Drug -->
            <template #item.drug_name="{ item }">
              <span v-if="item.drug_name">
                {{ item.drug_name }}
              </span>
              <span v-else>{{ $t("not_applicable") }}</span>
            </template>

            <!-- Status -->
            <template #item.status="{ item }">
              <v-chip v-if="item.paf_details_list?.length" size="x-small" :color="$helpers.getStatusColor(item.paf_details_list[0].status)
                ">
                {{ item.paf_details_list[0].status }}
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
              <v-tooltip location="top" open-on-hover open-on-click content-class="paf-tooltip">
                <template #activator="{ props }">
                  <v-chip v-bind="props" color="primary" size="small" style="cursor: pointer">
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
                      <tr v-for="paf in item.paf_details_list" :key="paf.paf_no">
                        <td>{{ paf.paf_no }}</td>

                        <td v-if="user.rolename === 'PCG Admin'">
                          {{ item.institution_data.name }}
                        </td>

                        <td>{{ paf.declaration_name }}</td>

                        <td>{{ formatDate(paf.declaration_date) }}</td>

                        <td>
                          <v-chip :color="$helpers.getStatusColor(paf.status)" size="x-small">
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

  }),

  mounted() {
    this.sel_institution = JSON.parse(localStorage.getItem("sel_inst"));
    this.fetchPAFs();
  },
  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.action_permissions = JSON.parse(
      localStorage.getItem("action_permissions"),
    );
  },

  computed: {
    headers() {
      let baseHeaders = [
        { title: "Patient ID", key: "patient_id", sortable: true },
        { title: "Initials", key: "patient_initials", sortable: true },
        { title: "Gender", key: "gender", sortable: true },
        { title: "DOB", key: "dob_display", sortable: true },
        { title: "Prescriber", key: "prescriber", sortable: true },
        { title: "Indication", key: "indication", sortable: true },
        { title: "Drug Name", key: "drug_name", sortable: true },
        { title: this.$t("status"), key: "status", sortable: true },
        { title: "Total PAF", key: "paf_details_count", sortable: true, align: "center" },
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
    }
  },

  methods: {
    viewPAF(slug) {
      this.$router.push({
        name: "paf_view",
        query: { slug: slug },
      });
    },
    fetchPAFs() {
      this.loader = true;

      // decide URL based on role
      let url = "get_off_lable_pafs";

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
    nonConformanceData(data) {
       this.nonConfDialog = true;
       this.selectedPaf = data;
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
