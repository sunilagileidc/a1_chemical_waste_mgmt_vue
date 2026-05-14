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
        <div class="d-flex justify-space-between align-center">
          <page-title
            class="col-md-3"
            heading="Registered Users"
            :google_icon="google_icon"
          ></page-title>
        </div>
        <!-- Stats section -->
        <!-- <stats-page :stats="stats" /> -->
        <!-- Stats section -->
        <!-- Search Bar -->
        <div class="search-wrapper">
          <v-text-field
            v-model="search"
            placeholder="Search Name, Email, Reg No..."
            append-inner-icon="mdi-magnify"
            variant="solo"
            flat
            hide-details
            density="comfortable"
            class="search-field"
          />
        </div>
        <!-- Data Table Card -->
        <!-- {{ filteredItems[0].rolename }} -->
        <v-card class="table-card pa-4">
          <v-data-table
            :headers="headers"
            :items="filteredItems"
            item-key="id"
            :loading="initval"
            loading-text="Loading data..."
            class="custom-table mt-3"
          >
            <template #item="{ item }">
              <tr>
                <!-- <td>
                  {{ item.id }}
                </td> -->

                <td>
                  <span v-if="item.salutation">{{ item.salutation }}.</span
                  ><b>{{ item.full_name }}</b>
                </td>
                <td>
                  <span v-if="item.email">{{ item.email }}</span>
                </td>

                <td>
                  {{ item.reg_no_display }}
                </td>
                <td>
                  <div class="d-flex align-center">
                    <!-- Institution Type -->
                    <span>
                      {{ item.institution_type_display }}
                    </span>

                    <!-- Info Icon (ONLY for Pharmacist) -->
                    <v-tooltip
                      v-if="
                        item.rolename === 'Pharmacist' ||
                        item.rolename === 'Prescriber'
                      "
                      location="top"
                      :open-on-hover="true"
                      content-class="paf-tooltip"
                    >
                      <!-- Activator -->
                      <template #activator="{ props }">
                        <v-icon
                          v-bind="props"
                          color="primary"
                          size="16"
                          class="ml-2"
                          style="cursor: pointer"
                        >
                          mdi-information-outline
                        </v-icon>
                      </template>

                      <!-- Tooltip Content -->
                      <div style="min-width: 300px">
                        <v-table density="compact">
                          <thead>
                            <tr>
                              <!-- <th class="text-left">Reg No</th> -->
                              <th class="text-left">Institution Name</th>
                              <th
                                class="text-left"
                                v-if="item.rolename === 'Pharmacist'"
                              >
                                Phone
                              </th>
                              <th class="text-left">Reg Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr
                              v-for="person in item.rolename === 'Pharmacist'
                                ? item.pharmacist_details
                                : item.prescriber_details"
                              :key="person.id"
                            >
                              <!-- <td>{{ person.reg_no }}</td> -->
                              <td>
                                {{
                                  person.institution_data?.name ||
                                  (item.rolename === "Prescriber"
                                    ? "Hospital"
                                    : "-")
                                }}
                              </td>
                              <td v-if="item.rolename === 'Pharmacist'">
                                {{ person.phone_no || "-" }}
                              </td>
                              <td
                                v-if="
                                  item.rolename === 'Pharmacist' ||
                                  item.rolename === 'Prescriber'
                                "
                              >
                                {{ person.reg_status || "-" }}
                              </td>
                            </tr>

                            <!-- Empty fallback -->

                            <tr
                              v-if="
                                !(item.rolename === 'Pharmacist'
                                  ? item.pharmacist_details?.length
                                  : item.prescriber_details?.length)
                              "
                            >
                              <td colspan="3">No data available</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                    </v-tooltip>
                  </div>
                </td>
                <!-- <td>
                  <span v-if="item.gender">{{ item.gender }}</span
                  ><span v-else>-</span>
                </td>
                <td>{{ formatDate(item.dob) }}</td> -->
                <td>
                  {{
                    item.rolename === "Pharmacist"
                      ? item.pharmacist_role
                      : item.rolename
                  }}
                </td>
                <!-- <td>{{ item.description }}</td> -->

                <td>
                  <v-chip
                    class="status-chip"
                    size="small"
                    :disabled="
                      user.rolename != 'SuperUser' &&
                      user.rolename != 'PCG Admin'
                    "
                    :color="
                      $helpers.getStatusColor(item.status)
                    "
                  >
                    {{ item.status == 1 ? "Active" : "Inactive" }}
                  </v-chip>
                </td>
                <!-- <td>
                  <div class="d-flex justify-space-around">
                    
                    <v-chip
                      v-if="
                        item.reg_status == 'Awaiting Approval' &&
                        action_permissions.includes('APPROVE REG USER')
                      "
                      class="status-approved"
                      size="small"
                      @click="updateStatus(item, 'Approved', 1)"
                    >
                      Approve
                    </v-chip>
                    <v-chip
                      v-if="
                        action_permissions.includes('REJECT REG USER') &&
                        item.reg_status == 'Awaiting Approval'
                      "
                      class="status-rejected"
                      size="small"
                      @click="openRejectDialog(item)"
                    >
                      Reject
                    </v-chip>
                    <div v-else>
                      <v-chip
                        size="small"
                        :color="$helpers.getStatusColor(item.reg_status)"
                      >
                        {{ item.reg_status }}
                      </v-chip>
                    </div>

                  
                  </div>
                </td> -->

                <!-- <td>
                  <v-btn icon size="x-small" class="pdf-btn">
                    <v-icon size="18">mdi-arrow-down</v-icon>
                  </v-btn>
                </td> -->
                <td class="d-flex align-center">
                  <!-- <router-link
                    :to="{
                      name: 'user_creation',
                      query: { slug: item.slug },
                    }"
                  >
                    <v-tooltip :text="this.$t('edit')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          dense
                          class="mr-2 edit_btn icon_size"
                          >mdi-pencil-outline</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </router-link> -->
                  <div @click="redirectView(item.slug)">
                    <v-tooltip :text="this.$t('edit')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          dense
                          class="mr-2 edit_btn icon_size"
                          :color="isAwaitingApproval(item) ? 'red' : ''"
                          >mdi-pencil-outline</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </div>
                  <!-- <div @click="redirectViewEye(item.slug)">
                    <v-tooltip :text="this.$t('view')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          dense
                          class="mr-2 edit_btn icon_size"
                          :color="isAwaitingApproval(item) ? 'red' : ''"
                          >mdi-eye</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </div> -->
                </td>
              </tr>
            </template>
          </v-data-table>
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
              class="btn-approved mr-3"
              size="small"
              :disabled="!rejectReason"
              @click="confirmReject"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- :color="isAwaitingApproval(item) ? 'red' : ''" -->
      <!-- <div v-else>
        <RegistrationDetails :selectedId="selectedId" @back="handleBackClick" />
      </div> -->
    </div>
  </v-container>
</template>
<script>
import RegistrationDetails from "./RegistrationDetails.vue";
export default {
  components: { RegistrationDetails },
  name: "PatientsTable",
  data() {
    return {
      dialogMessage: "",
      dialogTitle: "",
      selectedId: "",
      stats: [
        { label: "Total PAFs", value: 58 },
        { label: "Total patients", value: 9 },
        { label: "Overdue PAF (Action Required)", value: 7 },
        { label: "Rejected PAF", value: 0 },
      ],
      search: "",
      showDetails: false,
      reg_list: [],
      loader: false,
      initval: false,
      headers: [
        { title: "Name", key: "name" },
        { title: "Email", key: "email" },
        { title: "Reg no", key: "reg_no_display" }, //FIXED
        { title: "Institution Type", key: "institution_type_display" }, //already fixed
        { title: "Role", key: "rolename" },
        { title: "Status", key: "status" },
        // { title: "Reg Status", key: "reg_status" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      google_icon: {
        icon_name: "group",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },
      action_permissions: [],
      rejectDialog: false,
      rejectReason: "",
      rejectObj: null,
      rejected_reasons: [],
    };
  },

  computed: {
    filteredItems() {
      if (!this.search) return this.reg_list;

      const searchLower = this.search.toLowerCase();

      return this.reg_list.filter((item) => {
        return [
          item.full_name,
          item.email,
          item.rolename,
          item.institution_type_display,
          item.pharmacist_details?.[0]?.reg_no,
          item.prescriber_details?.[0]?.reg_no,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchLower);
      });
    },
  },

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.fetchLookup();
  },

  created() {
    this.initialize();
    this.action_permissions = JSON.parse(
      localStorage.getItem("action_permissions") || "[]"
    );
  },
  methods: {
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
    isAwaitingApproval(item) {
      // console.log("item");
      // console.log(item);
      let details = [];
      if (item.rolename === "Prescriber") {
        details = item.prescriber_details || [];
      } else if (item.rolename === "Pharmacist") {
        details = item.pharmacist_details || [];
      }
      return details.some((d) => d.reg_status === "Awaiting Approval");
    },
    getStatusClass(status) {
      if (status === "Awaiting Approval") {
        return "status-text-warning";
      } else if (status === "Approved") {
        return "status-text-approved";
      } else if (status === "Rejected") {
        return "status-text-rejected";
      }
      return "";
    },
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },
    initialize() {
      this.initval = true;
      this.$axios
        .get("fetch_reg_list")
        .then((res) => {
          this.reg_list = res.data.reg_list.map((item) => {
            const institutionType =
              item.rolename === "Prescriber"
                ? "Hospital"
                : item.pharmacist_details?.[0]?.institution_type || "-";

            const regNo =
              item.pharmacist_details?.[0]?.reg_no ||
              item.prescriber_details?.[0]?.reg_no ||
              "-";

            return {
              ...item,
              institution_type_display: institutionType,
              reg_no_display: regNo,
            };
          });

          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.initval = false;
        });
    },
    goToDetailsPage(item) {
      // console.log("item");
      // console.log(item.slug);
      this.$router.push({
        name: "registration_details",
        query: { slug: item.slug },
      });
      // this.showDetails = true;
      // this.selectedId = id;
    },
    async changeStatus(item) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to change the status of this user ?"
      );

      if (!result) return;
      this.loader = true;
      this.$axios
        .post("updateuserstatus", {
          id: item.id,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.initval = true;
            this.initialize();
            this.loader = false;
          } else if (res.data.status == "E") {
            this.loader = false;
            this.$toast.error(this.$t("something_went_wrong"));
          } else {
            this.$toast.error(this.array_data);
            this.loader = false;
            this.initval = true;
            this.initialize();
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    redirectView(slug) {
      this.$router.push({
        name: "view-my-profile",
        query: {
          slug: slug,
          from: "view",
          icon: "edit",
        },
      });
    },
    redirectViewEye(slug) {
      this.$router.push({
        name: "view-my-profile",
        query: {
          slug: slug,
          from: "view",
          icon: "eye",
        },
      });
    },
    handleBackClick(value) {
      this.showDetails = value;
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
          user_id: regObj.id,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.initialize();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
        });
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
          user_id: this.rejectObj.id,
          slug: this.rejectObj.slug,
          reg_status: "Rejected",
          name: this.rejectObj.name,
          email: this.rejectObj.email,
          reject_reason: this.rejectReason,
          status: 0,
          user_id: this.rejectObj.id,
          rolename: this.rejectObj.rolename,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.initialize();
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
  },
};
</script>

<style scoped>
/* Page Background */

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

.v-table {
  background: #e9edf7 !important;
}

:deep(.paf-tooltip) {
  background: white !important;
  color: #374151 !important;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
.status-chip {
  min-width: 70px;   /* same width for both */
  justify-content: center;
  text-align: center;
}
</style>
