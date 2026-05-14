<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader || reg_status_loader"></content-loader>
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>
    <div class="main-section">
      <!-- HEADER -->
      <div class="d-flex justify-space-between align-center">
        <page-title
          class="col-md-6"
          heading="Prescription Authorisation Form"
          :google_icon="google_icon"
        ></page-title>

        <v-btn
          size="small"
          class="back-btn mr-2"
          color="cancel"
          @click="goBack()"
        >
          Back
        </v-btn>
      </div>

      <div v-if="!paf">
        <no-data-found text="No data found" />
      </div>
      <div v-if="paf" class="paf-review pa-4">
        <!-- ================= PATIENT HEADER ================= -->
        <v-card elevation="0" class="stepper-box">
          <h2 class="theme-header">Patient Information</h2>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="12" md="3">
              <div class="info-label">Patient ID</div>
              <div class="info-value">{{ paf.patient_id }}</div>
            </v-col>

            <v-col cols="12" md="3">
              <div class="info-label">Initials</div>
              <div class="info-value">{{ paf.initials }}</div>
            </v-col>

            <v-col cols="12" md="3">
              <div class="info-label">Category</div>
              <div class="info-value">{{ paf.patient_category }}</div>
            </v-col>

            <v-col cols="12" md="3">
              <div class="info-label">Date of Birth</div>
              <div class="info-value">{{ formatDate(paf.dob) }}</div>
            </v-col>
          </v-row>
        </v-card>

        <div
          class="my-1"
          v-if="
            ['Submitted', 'Approved', 'Reverted'].includes(
              selectedPaf.status
            ) && user.rolename == 'Pharmacist'
          "
        >
          <div class="nhs-note note-font" v-if="drug_reg == 0 || drug_exp == 1">
            <v-icon class="note-icon note-font px-1" size="20"
              >mdi-alert-circle-outline</v-icon
            >
            <span v-if="drug_reg == 0">
              Approval process is blocked. Please register for
              {{ paf.drug }} to proceed with approval.
            </span>
            <span v-if="drug_exp == 1">
              Approval process is blocked. Your registration for
              {{ paf.drug }}
              has expired. Please renew to continue.
            </span>
            <v-chip
              x-small
              pill
              label
              class="ml-1 click-chip px-1"
              color="primary"
              text-color="white"
              style="height: 18px; font-size: 10px"
              @click="goToMyprofile()"
            >
              <v-icon left size="10">mdi-arrow-right</v-icon>
              Click to Register
            </v-chip>
          </div>
          <div class="nhs-note note-font" v-if="has_lead_pharmacist == 0">
            <v-icon class="note-icon note-font px-1" size="20"
              >mdi-alert-circle-outline</v-icon
            >
            <span>
              Approval process is blocked. Please assign a Lead Pharmacist to
              proceed with approval.
            </span>
          </div>
        </div>

        <!-- ================= MASTER DETAIL ================= -->
        <v-row class="mt-1">
          <!-- LEFT LIST -->
          <v-col cols="12" md="4" class="pt-0">
            <div class="list-container">
              <!-- HEADER + SEARCH -->
              <div class="list-header">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-tooltip
                      location="top"
                      v-if="
                        filteredPafList.length > 1 &&
                        action_permissions.includes('REVIEW PAF') &&
                        !selectedPaf.is_reviewed
                      "
                    >
                      <template #activator="{ props }">
                        <v-checkbox
                          v-bind="props"
                          v-model="selectAll"
                          density="dense"
                          hide-details
                          color="primary"
                          class="pa-0 ma-0 custom-checkbox"
                        />
                      </template>

                      <span>Bulk Review PAF</span>
                    </v-tooltip>
                    <span class="theme-sub-header pl-2 pr-2">PAF Records</span>
                  </div>
                  <div
                    v-if="
                      action_permissions.includes('REVIEW PAF') &&
                      !selectedPaf.is_reviewed
                    "
                  >
                    <v-btn
                      :disabled="!selectedPafs.length >= 1"
                      size="small"
                      color="secondary"
                      @click="openReviewDialog"
                    >
                      Review
                      <v-icon class="ml-1">mdi-eye</v-icon>
                    </v-btn>
                    <!-- {{ selectedPafs.length > 1 ? "Bulk Review" : "Review" }} -->
                  </div>

                  <v-text-field
                    v-model="search"
                    label="Search"
                    density="compact"
                    variant="outlined"
                    class="sm-search-field"
                    hide-details
                    clearable
                    style="max-width: 140px"
                  />
                </div>
              </div>
              <!-- LIST -->
              <div
                v-for="(item, index) in filteredPafList"
                :key="item.id"
                class="list-item"
                :class="{
                  active: selectedPaf?.id === item.id,
                }"
                @click="selectPaf(item, index)"
              >
                <div class="top d-flex justify-space-between align-center">
                  <span
                    class="paf-no d-flex align-center"
                    :class="{
                      'text-orange':
                        item.is_overdue &&
                        action_permissions.includes('REVIEW PAF'),
                    }"
                  >
                    <!-- Row Checkbox -->
                    <v-tooltip
                      location="top"
                      v-if="
                        action_permissions.includes('REVIEW PAF') &&
                        !selectedPaf.is_reviewed
                      "
                    >
                      <template #activator="{ props }">
                        <v-checkbox
                          v-bind="props"
                          v-model="selectedPafs"
                          :value="item.id"
                          @click.stop
                          density="dense"
                          hide-details="true"
                          color="primary"
                          class="pa-0 ma-0 custom-checkbox"
                        />
                      </template>

                      <span>Select to review PAF</span>
                    </v-tooltip>
                    <span class="pl-2"> PAF - {{ item.paf_no }}</span>
                  </span>

                  <v-chip
                    size="x-small"
                    :color="$helpers.getStatusColor(item.status)"
                  >
                    {{ item.status }}
                  </v-chip>
                </div>
                <small
                  v-if="
                    item.is_overdue &&
                    action_permissions?.includes('REVIEW PAF')
                  "
                  :class="{
                    'text-orange':
                      item.is_overdue &&
                      action_permissions.includes('REVIEW PAF'),
                  }"
                  >{{ item.overdue_text }}</small
                >

                <div class="sub d-flex justify-space-between">
                  <span>
                    {{ item.drug?.drug_name }} •
                    {{ item.drug_cycles?.[0]?.drug_strength }}
                    × {{ item.drug_cycles?.[0]?.no_of_cycles }}
                  </span>
                  <span>
                    <div class="date">
                      {{ formatDate(item.declaration_date) }}
                    </div>
                  </span>
                </div>

                <div class="hospital">
                  {{ item.institutions?.name || "-" }}
                </div>

                <!-- UNC Ribbon -->
                <div
                  v-if="item.non_conformance?.length"
                  class="unc-ribbon"
                  :class="{
                    'unc-ribbon-shift':
                      item.is_overdue &&
                      action_permissions?.includes('REVIEW PAF'),
                  }"
                >
                  UNC
                </div>
              </div>

              <!-- EMPTY STATE -->
              <div
                v-if="!filteredPafList.length"
                class="text-center pa-4 text-grey"
              >
                No matching records found
              </div>
            </div>
          </v-col>
          <!-- RIGHT DETAILS -->
          <v-col cols="12" md="8" class="pt-0">
            <v-card v-if="selectedPaf" elevation="0" class="stepper-box">
              <div class="d-flex justify-space-between">
                <h2 class="theme-header d-flex align-center">
                  <span class="mr-2">PAF Details</span>

                  <!-- NON CONFORMANCE ICON -->
                  <v-tooltip
                    v-if="selectedPaf?.non_conformance?.length"
                    text="View Noncompliance"
                    location="top"
                  >
                    <template #activator="{ props }">
                      <v-badge
                        bordered
                        location="top right"
                        color="var(--status-non-conformance)"
                        :content="selectedPaf?.non_conformance?.length"
                      >
                        <v-btn
                          icon
                          size="x-small"
                          class="mx-1 paf-act-btn"
                          color="var(--status-non-conformance)"
                          v-bind="props"
                          @click="nonConfDialog = true"
                        >
                          <v-icon color="#fff">mdi-alert-circle-outline</v-icon>
                        </v-btn>
                      </v-badge>
                    </template>
                  </v-tooltip>
                  <v-tooltip
                    v-if="action_permissions.includes('DOWNLOAD PAF')"
                    text="Download PDF"
                    location="top"
                  >
                    <template #activator="{ props }">
                      <v-btn
                        icon
                        size="x-small"
                        color="var(--theme-color)"
                        v-bind="props"
                        class="ml-2 paf-act-btn"
                        @click="downloadPDF"
                      >
                        <v-icon color="#fff">mdi-download</v-icon>
                      </v-btn>
                    </template>
                  </v-tooltip>
                  <!-- view History -->
                  <div
                    class="text-right ml-3"
                    v-if="selectedPaf.status != 'Submitted'"
                  >
                    <v-tooltip text="View PAF History" location="top">
                      <template #activator="{ props }">
                        <v-btn
                          icon
                          class="paf-act-btn"
                          size="x-small"
                          color="grey"
                          text-color="white"
                          v-bind="props"
                          @click="historyDialog = true"
                        >
                          <v-icon size="small" color="white">
                            mdi-clipboard-text-clock
                          </v-icon>
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </div>
                  <!-- view History -->
                </h2>
                <div class="d-flex">
                  <div
                    v-if="
                      action_permissions.includes('RENEW PAF') &&
                      selectedPaf.renewal == 0 &&
                      (selectedPaf.status == 'Dispensed' ||
                        selectedPaf.status == 'Rejected')
                    "
                  >
                    <v-btn
                      size="small"
                      class="ma-1"
                      color="primary"
                      @click="openRenewDialog"
                      >Renew
                      <v-icon class="ml-1 mt-1">mdi-restart</v-icon></v-btn
                    >
                  </div>

                  <div
                    v-if="
                      ['Submitted', 'Reverted', 'Action Required'].includes(
                        selectedPaf.status
                      ) && !reg_status_loader
                    "
                  >
                    <v-btn
                      v-if="action_permissions.includes('APPROVE PAF')"
                      :disabled="
                        !isCapsuleValid ||
                        drug_reg == 0 ||
                        drug_exp == 1 ||
                        has_lead_pharmacist == 0
                      "
                      size="small"
                      class="ma-1"
                      color="success"
                      @click="handleApprove"
                      >Approve
                      <v-icon class="ml-1"
                        >mdi-check-circle-outline</v-icon
                      ></v-btn
                    >
                    <v-btn
                      v-if="action_permissions.includes('APPROVE DISPENSE PAF')"
                      :disabled="
                        !isCapsuleValid ||
                        drug_reg == 0 ||
                        drug_exp == 1 ||
                        has_lead_pharmacist == 0
                      "
                      @click="handleApproveDispense"
                      size="small"
                      class="ma-1"
                      color="primary"
                      >Approve & Dispense
                      <v-icon class="ml-1"
                        >mdi-check-circle-outline</v-icon
                      ></v-btn
                    >

                    <v-btn
                      v-if="action_permissions.includes('REJECT PAF')"
                      :disabled="
                        drug_reg == 0 ||
                        drug_exp == 1 ||
                        has_lead_pharmacist == 0
                      "
                      style="color: white"
                      size="small"
                      class="ma-1"
                      color="danger"
                      @click="openRejectDialog"
                      >Reject
                      <v-icon class="ml-1"
                        >mdi-close-circle-outline</v-icon
                      ></v-btn
                    >
                  </div>

                  <div
                    v-if="
                      selectedPaf.status === 'Approved' &&
                      ['Outpatient Pharmacy', 'Homecare'].includes(inst_type) &&
                      !reg_status_loader
                    "
                  >
                    <v-btn
                      v-if="action_permissions.includes('REVERT PAF')"
                      size="small"
                      class="ma-1 btn-revert"
                      @click="openRevertDialog"
                      >Revert To Approver
                      <v-icon class="flip-x">mdi-share</v-icon></v-btn
                    >
                    <!-- <v-btn
                      v-if="
                        action_permissions.includes('DISPENSE OUTPATIENT PAF')
                      "
                      :disabled="
                        drug_reg == 0 ||
                        drug_exp == 1 ||
                        has_lead_pharmacist == 0
                      "
                      size="small"
                      class="ma-1"
                      color="success"
                      @click="handleOPDispense"
                      >Dispense
                      <v-icon class="ml-1"
                        >mdi-check-circle-outline</v-icon
                      ></v-btn
                    > -->
                    <v-btn
                      v-if="
                        action_permissions.includes('DISPENSE OUTPATIENT PAF')
                      "
                      :disabled="
                        drug_reg == 0 ||
                        drug_exp == 1 ||
                        has_lead_pharmacist == 0
                      "
                      size="small"
                      class="ma-1"
                      color="success"
                      @click="handleApproveDispense"
                      >Dispense
                      <v-icon class="ml-1"
                        >mdi-check-circle-outline</v-icon
                      ></v-btn
                    >
                  </div>

                  <div v-if="action_permissions.includes('REQUEST PAF')">
                    <v-btn
                      size="small"
                      class="ma-1"
                      color="primary"
                      @click="openRequestDialog"
                      >Request
                      <v-icon class="ml-1"
                        >mdi-frequently-asked-questions</v-icon
                      ></v-btn
                    >
                  </div>

                  <div
                    v-if="action_permissions.includes('MARK NONCONFORMANCE')"
                  >
                    <v-btn
                      size="small"
                      class="ma-1 status-non-conformance text-white"
                      @click="markNonConformance"
                      >Mark as Non-compliance
                      <v-icon class="ml-1">mdi-marker</v-icon></v-btn
                    >
                  </div>
                </div>
              </div>

              <v-divider class="my-2"></v-divider>

              <!-- ================= PATIENT DETAILS ================= -->
              <div class="d-flex justify-space-between">
                <h3 class="theme-subheader mt-5">
                  Patient Details - {{ patientCategoryLabel }}
                </h3>
                <div class="d-flex align-center">
                  <v-chip
                    v-if="selectedPaf.is_retrospective == 1"
                    class="mx-1"
                    size="small"
                    :color="
                      $helpers.getRetrospectiveColor(
                        selectedPaf.is_retrospective
                      )
                    "
                  >
                    Retrospective
                  </v-chip>
                  <v-chip
                    class="mx-1"
                    v-if="selectedPaf.risk_level"
                    size="small"
                    :color="$helpers.getRiskLevelColor(selectedPaf.risk_level)"
                    variant="outlined"
                  >
                    {{ selectedPaf.risk_level }}
                  </v-chip>
                  <v-chip
                    class="mx-1"
                    size="small"
                    :color="$helpers.getStatusColor(selectedPaf.status)"
                  >
                    {{ selectedPaf.status }}
                  </v-chip>

                  <!-- Info Icon (only if rejected) -->
                  <v-tooltip
                    v-if="selectedPaf.status === 'Rejected'"
                    location="bottom"
                    :open-on-hover="false"
                    :open-on-click="true"
                    content-class="reject-tooltip"
                  >
                    <template #activator="{ props }">
                      <v-icon
                        v-bind="props"
                        size="18"
                        class="ml-2 cursor-pointer"
                        color="danger"
                      >
                        mdi-information-outline
                      </v-icon>
                    </template>

                    <span>
                      {{ selectedPaf.rejection_reason || "No reason provided" }}
                    </span>
                  </v-tooltip>
                  <v-tooltip
                    v-if="selectedPaf.status === 'Reverted'"
                    location="bottom"
                    :open-on-hover="false"
                    :open-on-click="true"
                    content-class="revert-tooltip"
                  >
                    <template #activator="{ props }">
                      <v-icon
                        v-bind="props"
                        size="18"
                        class="ml-2 cursor-pointer theme-revert"
                      >
                        mdi-information-outline
                      </v-icon>
                    </template>

                    <span>
                      {{ selectedPaf.revert_reason || "No reason provided" }}
                    </span>
                  </v-tooltip>
                </div>
              </div>

              <v-row>
                <v-col cols="12" md="3">
                  <div class="info-label">Indication</div>
                  <div class="info-value">
                    {{ paf.indication ? paf.indication : "-" }}
                  </div>
                </v-col>

                <v-col cols="12" md="3">
                  <div class="info-label">Drug</div>
                  <div class="info-value">{{ paf.drug }}</div>
                </v-col>

                <v-col cols="12" md="3">
                  <div class="info-label">Date of PAF</div>
                  <div class="info-value">
                    {{ formatDate(selectedPaf.declaration_date) }}
                  </div>
                </v-col>
                <v-col cols="12" md="3">
                  <div class="info-label">Is clinical Trial?</div>
                  <div class="info-value">
                    <b
                      :class="
                        selectedPaf.is_clinical_trial == 1
                          ? 'status-text-approved'
                          : 'status-text-warning'
                      "
                    >
                      {{ selectedPaf.is_clinical_trial == 1 ? "Yes" : "No" }}
                    </b>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  v-if="selectedPaf.is_clinical_trial == 1"
                >
                  <div class="info-label">Clinical test note</div>
                  <div class="info-value">
                    {{ selectedPaf.clinical_test_note }}
                  </div>
                </v-col>
                <v-col cols="12" md="4" v-if="paf.patient_category == 'WCBP'">
                  <div class="info-label">
                    Date of Last Negative Pregnancy Test
                  </div>
                  <div class="info-value">
                    <div v-if="!preg_date_edit">
                      {{ formatDate(paf.last_negative_preg_date) }}
                      <v-chip
                        v-if="
                          ['Submitted', 'Reverted', 'Action Required'].includes(
                            selectedPaf.status
                          ) &&
                          action_permissions.includes('EDIT PAF DRUG CYCLE')
                        "
                        class="px-2 ml-1"
                        variant="tonal"
                        size="x-small"
                        color="primary"
                        @click="preg_date_edit = true"
                      >
                        Edit
                        <v-icon
                          size="x-small"
                          icon="mdi-pencil-outline"
                          end
                        ></v-icon>
                      </v-chip>
                    </div>
                    <div v-else class="sm-field">
                      <date-picker
                        v-model="paf.last_negative_preg_date"
                        :max="maxPregDate"
                        :hide_details="true"
                      />
                    </div>
                  </div>
                </v-col>
              </v-row>

              <v-row v-if="selectedPaf.status === 'Rejected'">
                <v-col cols="12" md="12">
                  <div class="info-label">Rejection Reason</div>
                  <div
                    class="info-value text-error"
                    style="font-weight: 400; font-size: 12px"
                  >
                    {{ selectedPaf.rejection_reason }}
                  </div>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="3" md="3" v-if="selectedPaf.status === 'Reverted'">
                  <div class="info-label">Revert Reason</div>
                  <div
                    class="info-value theme-revert"
                    style="font-weight: 400; font-size: 12px"
                  >
                    {{ selectedPaf.revert_reason }}
                  </div>
                </v-col>
                <v-col cols="6" md="6" v-if="selectedPaf.is_reviewed === 1">
                  <div class="info-label">Review Reason</div>
                  <div
                    class="info-value theme-revert"
                    style="font-weight: 400; font-size: 12px"
                  >
                    {{ selectedPaf.admin_notes || "Not Mentioned" }}
                  </div>
                </v-col>
              </v-row>
              <!-- CONSENT -->
              <div v-if="counsel_data?.note" class="section consent-box d-flex">
                <v-checkbox
                  :disabled="
                    !['Submitted', 'Reverted'].includes(selectedPaf.status) ||
                    !action_permissions.includes('EDIT PAF DRUG CYCLE')
                  "
                  class="pt-3 check"
                  v-model="risk_confirmed"
                  hide-details
                  :label="counsel_data.note"
                >
                </v-checkbox>
                <span
                  class="risk-confirm-text"
                  v-bind:style="risk_confirmed ? 'color: green' : 'color: red'"
                >
                  {{
                    risk_confirmed ? " (Confirmed)" : " (Not Confirmed)"
                  }}</span
                >
              </div>
              <v-divider></v-divider>

              <!-- ================= PRESCRIPTION ================= -->
              <h3 class="theme-subheader mt-5">
                Prescription
                <v-chip
                  v-if="
                    ['Submitted', 'Reverted'].includes(selectedPaf.status) &&
                    action_permissions.includes('EDIT PAF DRUG CYCLE') &&
                    (!cap_strength_edit || !cap_cycle_edit || !num_cycle_edit)
                  "
                  class="px-2 ml-1"
                  variant="tonal"
                  size="x-small"
                  color="primary"
                  @click="enableDrugCycleEdit()"
                >
                  Edit
                  <v-icon size="x-small" icon="mdi-pencil-outline" end></v-icon>
                </v-chip>
              </h3>
              <v-row class="mb-2">
                <v-col cols="6">
                  <v-row v-for="(row, index) in dosageRows" :key="index">
                    <!-- Capsule Strength -->
                    <v-col
                      class="pb-0"
                      cols="12"
                      :md="dosageRows.length > 1 ? 4 : 6"
                    >
                      <div class="info-label">
                        {{ selectedPaf.drug.drug_form }} Strength
                      </div>
                      <div class="info-value">
                        <div v-if="!cap_strength_edit">
                          {{ row.drug_strength }}
                        </div>

                        <v-select
                          v-else
                          :items="drugStrengthOptions"
                          item-title="capsule_strength"
                          item-value="capsule_strength"
                          v-model="row.drug_strength"
                          density="compact"
                          variant="outlined"
                          hide-details
                          class="sm-field"
                          @update:modelValue="() => validateCapsuleLimit()"
                        />
                      </div>
                    </v-col>

                    <!-- Capsules per Cycle -->
                    <v-col
                      class="pb-0"
                      cols="12"
                      :md="
                        row.cap_per_cycle === 'Others' || row.isOthersActive
                          ? (dosageRows.length > 1 ? 5 : 6) - 1
                          : 6
                      "
                    >
                      <div class="info-label">
                        {{ selectedPaf.drug.drug_form }}s per Cycle
                      </div>

                      <div class="info-value">
                        <!-- View Mode -->
                        <div v-if="!cap_cycle_edit">
                          {{
                            row.cap_per_cycle === "Others"
                              ? row.other_capsules
                              : row.cap_per_cycle
                          }}
                        </div>

                        <!-- Edit Mode -->
                        <v-select
                          v-else
                          :items="capsuleOptionsWithOthers"
                          item-title="no_of_capsules"
                          item-value="no_of_capsules"
                          v-model="row.cap_per_cycle"
                          density="compact"
                          variant="outlined"
                          hide-details
                          class="sm-field"
                          @update:modelValue="resetOtherCapsules(row, $event)"
                        />
                      </div>
                    </v-col>

                    <!-- Others Input -->
                    <v-col
                      v-if="
                        cap_cycle_edit &&
                        (row.cap_per_cycle === 'Others' || row.other_capsules)
                      "
                      cols="12"
                      :md="3"
                      class="pb-0"
                    >
                      <div class="info-label">
                        {{ selectedPaf.drug.drug_form }}s
                      </div>

                      <v-text-field
                        v-model="row.other_capsules"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="sm-field"
                        @input="onCapsuleInput(row)"
                      />
                    </v-col>

                    <!-- Remove button -->
                    <v-col
                      cols="12"
                      md="1"
                      class="mt-4 pb-0"
                      v-if="cap_strength_edit && index > 0"
                    >
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        color="red"
                        size="small"
                        @click="removeRow(index)"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6">
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0">
                      <div class="info-label">Number of Cycles</div>
                      <div class="info-value">
                        <div v-if="!num_cycle_edit">
                          {{ paf.cycles }}
                        </div>

                        <v-select
                          v-else
                          :items="cycleOptions"
                          v-model="paf.cycles"
                          density="compact"
                          variant="outlined"
                          hide-details
                          class="sm-field"
                          @update:modelValue="calculateTotal"
                        />
                      </div>
                    </v-col>

                    <!-- Total Supply -->
                    <v-col cols="12" md="6" class="pb-0">
                      <div class="info-label">Total Supply</div>
                      <div class="info-value">
                        {{ paf.total_supply }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <!-- ADD ROW BUTTON -->
              <v-row
                v-if="
                  cap_strength_edit &&
                  action_permissions.includes('ADD DRUG STRENGTH') &&
                  ![
                    '50mg - Thalidomide',
                    '100mg - Thalidomide Tablet',
                  ].includes(paf.drug)
                "
                class="mt-0"
              >
                <v-col cols="12" class="pt-0 pl-3">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    @click="addRow"
                    size="x-small"
                  >
                    Add Row +
                  </v-btn>
                </v-col>
              </v-row>
              <div v-if="!isCapsuleValid">
                <div class="text-error mt-2">
                  {{ capsuleErrorMsg }}
                </div>
                <div class="text-caption text-grey">
                  Total prescribed quantity:
                  {{ org_total_qty }}
                </div>
              </div>

              <!-- TABLE -->
              <!-- <div class="mt-5">
                <v-table density="compact" class="summary-table">
                  <thead>
                    <tr>
                      <th>Strength</th>
                      <th>Capsules</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ paf.drug_strength }}</td>
                      <td>{{ paf.cap_per_cycle }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div> -->

              <!-- <v-divider></v-divider> -->

              <!-- ================= PRESCRIBER ================= -->
              <h3 class="theme-subheader mt-5">Prescriber</h3>
              <v-row>
                <v-col cols="12" md="3">
                  <div class="info-label">Name</div>
                  <div class="info-value">{{ prescriber.full_name }}</div>
                </v-col>

                <v-col cols="12" md="3">
                  <div class="info-label">Treating Hospital</div>
                  <div class="info-value">
                    {{ selectedPaf.institutions?.name }}
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div class="info-label">Address</div>
                  <div class="info-value">
                    {{ selectedPaf.institutions?.address }}
                  </div>
                </v-col>
              </v-row>

              <!-- ================= Dispensing Details ================= -->
              <div v-if="selectedPaf.dispensing_loc">
                <v-divider></v-divider>
                <h3 class="theme-subheader mt-5">Dispensing Details</h3>

                <v-row>
                  <v-col cols="12" md="3">
                    <div class="info-label">Dispensing Point</div>
                    <div class="info-value">
                      {{ selectedPaf.dispensing_point }}
                    </div>
                  </v-col>

                  <v-col cols="12" md="3">
                    <div class="info-label">Dispensing Location</div>
                    <div class="info-value">
                      {{ selectedPaf.dispensing_loc?.name }}
                    </div>
                  </v-col>

                  <v-col cols="12" md="3">
                    <div class="info-label">Approver Signature</div>
                    <div class="info-value">
                      {{ selectedPaf.dispensing_sig }}
                    </div>
                  </v-col>

                  <v-col cols="12" md="3">
                    <div class="info-label">Approval Date</div>
                    <div class="info-value">
                      {{ formatDate(selectedPaf.dispensing_date) }}
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- ================= Approval Details ================= -->
              <div v-if="selectedPaf.mah_data">
                <v-divider></v-divider>
                <h3 class="theme-subheader mt-5">Approval Details</h3>

                <v-row>
                  <v-col cols="12" md="3">
                    <div class="info-label">MAH</div>
                    <div>
                      <!-- Logo -->
                      <v-img
                        v-if="selectedPaf.mah_data?.logo"
                        :src="envImagePath + selectedPaf.mah_data?.logo"
                        width="100"
                        contain
                      ></v-img>

                      <!-- Name -->
                      <div v-else class="mah-name text-center">
                        {{ selectedPaf.mah_data?.contact_name }}
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="3">
                    <div class="info-label">Approver Signature</div>
                    <div class="info-value">
                      {{ selectedPaf.dispensing_sig }}
                    </div>
                  </v-col>

                  <v-col cols="12" md="3">
                    <div class="info-label">Approval Date</div>
                    <div class="info-value">
                      {{ formatDate(selectedPaf.dispensing_date) }}
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- ================= Off Label Confirmations ================= -->
              <!-- Off-label Confirmations -->
              <div
                v-if="
                  offlabel_confirmations && offlabel_confirmations.length > 0
                "
              >
                <v-divider class="my-4"></v-divider>

                <h3 class="theme-subheader mb-3">Off-Label Confirmations</h3>

                <v-row>
                  <v-col
                    cols="12"
                    v-for="confirmation in offlabel_confirmations"
                    :key="confirmation.id"
                  >
                    <v-checkbox
                      :model-value="true"
                      :label="confirmation.confirmation"
                      hide-details
                      style="pointer-events: none"
                      density="compact"
                      readonly
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <!-- style="position: absolute; left: -9999px; top: 0" -->
        <!-- Paf Download Component -->
        <div id="pdf-content" style="position: absolute; left: -9999px; top: 0">
          <paf-download
            ref="pdfComponent"
            :paf="paf"
            :selectedPaf="selectedPaf"
            :prescriber="prescriber"
            :app_logo="app_image_url"
            :dosageRows="dosageRows"
            :offlabel_confirmations="offlabel_confirmations"
          />
        </div>
        <!-- Paf Download Component -->
      </div>
    </div>
    <v-dialog v-model="rejectDialog" max-width="520" persistent>
      <v-card class="reject-dialog text-center pa-6">
        <!-- CLOSE ICON -->
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="rejectDialog = false">
            mdi-close
          </v-icon>
        </div>

        <!-- ICON -->
        <div class="reject-icon mx-auto mb-4">
          <v-icon size="36" color="error">mdi-close</v-icon>
        </div>

        <!-- TITLE -->
        <h2 class="reject-title">State the Reason for Rejection</h2>

        <!-- DROPDOWN -->
        <v-select
          v-model="selectedRejectReason"
          :items="rejectReasons"
          item-title="longname"
          item-value="shortname"
          label="Reason for rejection"
          density="compact"
          variant="outlined"
          class="field-required"
          hide-details
          @update:modelValue="onRejectReasonChange"
        ></v-select>

        <v-textarea
          v-if="selectedRejectReason === 'OTHER'"
          v-model="customRejectReason"
          label="Please specify reason"
          density="compact"
          variant="outlined"
          class="mt-3 field-required"
          rows="2"
        ></v-textarea>

        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-8">
          <v-btn class="btn-cancel" size="small" @click="rejectDialog = false"
            >Cancel</v-btn
          >
          <v-btn size="small" class="btn-reject mx-3" @click="submitReject">
            Reject
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="amendDialog" max-width="600" persistent>
      <v-card class="text-center pa-8 amend-dialog">
        <!-- CLOSE -->
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="amendDialog = false">
            mdi-close
          </v-icon>
        </div>

        <!-- ICON -->
        <div class="amend-icon mx-auto mb-4">
          <v-icon size="36" color="error">mdi-alert</v-icon>
        </div>

        <!-- TITLE -->
        <h2 class="amend-title">
          {{ amendTitle }}
        </h2>

        <!-- DESCRIPTION -->
        <div class="amend-desc mt-3 text-left">
          <p>The following changes were made:</p>

          <ul>
            <li v-for="(item, index) in amendChanges" :key="index">
              {{ item }}
            </li>
          </ul>

          <p class="mt-3">
            I acknowledge that the above information was updated and confirm it
            has been verified with the prescriber/patient.
          </p>
        </div>

        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-8">
          <v-btn class="btn-cancel" size="small" @click="amendDialog = false">
            Cancel
          </v-btn>

          <v-btn
            size="small"
            class="btn-approved mx-3"
            color="primary"
            @click="
              amendDialog = false;
              approvalConfirmDialog = true;
            "
          >
            Continue
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="approvalConfirmDialog" max-width="700" persistent>
      <v-card class="text-center pa-8 approval-dialog">
        <!-- CLOSE -->
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="approvalConfirmDialog = false">
            mdi-close
          </v-icon>
        </div>

        <!-- TITLE -->
        <h2 class="approval-title">Please confirm your approval</h2>

        <!-- CONTENT -->
        <div class="approval-content mt-4">
          <p class="text-justify">
            The Prescription Authorisation Form (PAF) has been reviewed and
            approved. All required checks are complete, and the form is ready
            for the next step.
          </p>
        </div>

        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-8">
          <v-btn
            class="btn-cancel"
            size="small"
            @click="approvalConfirmDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            size="small"
            class="btn-approved mx-3"
            @click="handleApprovalConfirm"
          >
            Approve
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="mahDialog" max-width="900" persistent>
      <v-card class="pa-6 mah-dialog">
        <v-form ref="mahForm" v-model="mahFormValid">
          <!-- HEADER -->
          <div class="d-flex justify-space-between align-center">
            <div class="mt-4 theme-header">MAH Selection</div>
            <v-icon class="close-icon" @click="mahDialog = false">
              mdi-close
            </v-icon>
          </div>

          <!-- TITLE -->

          <div class="text-grey text-caption">
            Please Select the Designated MAH in Which You Are Dispensing
            Medication From:
          </div>

          <!-- OPTIONS -->
          <div class="mah-options mt-4">
            <v-row dense>
              <v-col
                v-for="item in marketing_holders"
                :key="item.id"
                cols="12"
                sm="6"
                md="2"
              >
                <v-card
                  class="mah-card"
                  :class="{ active: selectedMah === item.id }"
                  elevation="2"
                  @click="
                    selectedMah = item.id;
                    mahError = false;
                  "
                >
                  <!-- Selected Tick -->
                  <div class="tick" v-if="selectedMah === item.id">
                    <v-icon size="18">mdi-check-circle</v-icon>
                  </div>

                  <!-- Logo -->
                  <v-img
                    v-if="item.logo"
                    :src="envImagePath + item.logo"
                    width="100"
                    contain
                  ></v-img>

                  <!-- Name -->
                  <div v-else class="mah-name text-center">
                    {{ item.contact_name }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <div v-if="mahError" class="text-error mt-2">Please select a MAH</div>

          <!-- CHECKBOXES -->
          <v-checkbox
            color="primary"
            v-model="mahConfirmed1"
            :rules="[rules.confirmCheck]"
            class="mt-6 check"
            hide-details="auto"
          >
            <template #label>
              I confirm that I am ordering on behalf of a registered pharmacy
              and that Lenalidomide will be dispensed in accordance with the
              risk minimisation procedures.
            </template>
          </v-checkbox>

          <v-checkbox
            color="primary"
            class="check mb-3"
            :rules="[rules.confirmCheck]"
            v-model="mahConfirmed2"
            hide-details="auto"
          >
            <template #label>
              I confirm that treatment lengths will be limited as per programme
              requirements.
            </template>
          </v-checkbox>

          <v-row dense>
            <v-col cols="12" md="6">
              <div class="custom-field plain-wrapper">
                <label class="plain-label">Pharmacist Name</label>
                <div class="plain-value">{{ user_signature }}</div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="custom-field plain-wrapper">
                <label class="plain-label">Date</label>
                <div class="plain-value" v-if="dispense_date">
                  {{ formatDate(dispense_date) }}
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- FOOTER -->
          <div class="d-flex justify-end mt-2">
            <mandatory-text />
            <v-btn
              class="btn-cancel ml-3"
              size="small"
              @click="mahDialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              class="ml-3"
              @click="finalSubmit"
              color="success"
              size="small"
            >
              Complete
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="finishConfirmationDialog" max-width="700" persistent>
      <v-card class="text-center pa-8 approval-dialog">
        <!-- CLOSE -->
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="finishConfirmationDialog = false">
            mdi-close
          </v-icon>
        </div>

        <!-- TITLE -->
        <h2 class="approval-title">
          Prescription Authorisation Form Completed
        </h2>

        <!-- CONTENT -->
        <div class="approval-content mt-4">
          <p>The PAF has been completed and can be dispensed.</p>
        </div>

        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-8">
          <v-btn
            class="btn-cancel"
            size="small"
            @click="finishConfirmationDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn size="small" class="btn-approved mx-3" @click="finishApproval">
            Finish
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="approveDialog" max-width="700" persistent>
      <v-card class="pa-6">
        <v-form ref="approveForm" v-model="approveFormValid">
          <!-- HEADER -->
          <div class="d-flex justify-space-between align-center">
            <div class="theme-header">PAF to Nominated Dispenser</div>
            <v-icon class="close-icon" @click="approveDialog = false">
              mdi-close
            </v-icon>
          </div>

          <div class="text-grey text-caption mt-1">
            Please Select the Nominated Dispenser:
          </div>

          <v-row>
            <v-col cols="12" md="6">
              <!-- DISPENSER -->
              <v-select
                v-model="dispenserPoint"
                :items="dispenserOptions"
                label="Dispenser Point"
                density="compact"
                variant="outlined"
                class="mt-4 field-required"
                :rules="[(v) => !!v || 'Required']"
                @update:modelValue="onDispenserChange"
                hide-details="auto"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <!-- LOCATION -->
              <v-select
                v-model="dispensingLocation"
                :items="dispensingLocationOptions"
                item-title="name"
                item-value="id"
                label="Dispensing Location"
                density="compact"
                variant="outlined"
                class="mt-4 field-required"
                :rules="[(v) => !!v || 'Required']"
                hide-details="auto"
                :loading="dispensing_loc_loader"
                :disabled="!dispenserPoint"
              ></v-select>
            </v-col>
          </v-row>

          <!-- CHECKBOX -->
          <v-checkbox
            class="mt-4 check"
            color="primary"
            v-model="mahConfirmed2"
            :rules="[rules.confirmCheck]"
          >
            <template #label>
              I confirm that treatment lengths will be limited as per programme
              requirements.
            </template>
          </v-checkbox>

          <!-- READ ONLY -->
          <v-row class="mt-1">
            <v-col cols="12" md="6">
              <div class="custom-field plain-wrapper">
                <label class="plain-label">Pharmacist Name</label>
                <div class="plain-value">{{ user_signature }}</div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div class="custom-field plain-wrapper">
                <label class="plain-label">Date</label>
                <div class="plain-value" v-if="dispense_date">
                  {{ formatDate(dispense_date) }}
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- ACTION -->
          <div class="d-flex justify-end mt-6">
            <mandatory-text />
            <v-btn
              class="btn-cancel ml-3"
              size="small"
              @click="approveDialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              class="btn-approved ml-3"
              size="small"
              color="success"
              @click="submitApproveForm"
            >
              Complete
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="renewDialog" max-width="500" persistent>
      <v-card class="text-center pa-6">
        <!-- CLOSE -->
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="renewDialog = false">
            mdi-close
          </v-icon>
        </div>

        <!-- ICON -->
        <div class="mx-auto mb-4 renew-icon">
          <v-icon size="36" color="primary">mdi-restart</v-icon>
        </div>

        <!-- TITLE -->
        <h2 class="renew-title">Renew Prescription</h2>

        <!-- MESSAGE -->
        <p class="renew-desc mt-3">
          Are you sure you want to renew this Prescription Authorisation Form?
        </p>

        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-6">
          <v-btn size="small" class="btn-cancel" @click="renewDialog = false">
            Cancel
          </v-btn>

          <v-btn
            size="small"
            class="btn-approved mx-3"
            color="primary"
            @click="confirmRenew"
          >
            Continue
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- PAF History Dialog-->
    <v-dialog v-model="historyDialog" max-width="820" persistent>
      <v-card class="reject-dialog text-center pa-6">
        <!-- CLOSE ICON -->

        <!-- ICON -->
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex">
            <div class="mb-2">
              <v-icon size="36" color="gray"
                >mdi mdi-clipboard-text-clock-outline</v-icon
              >
            </div>
            <!-- TITLE -->
            <h2 class="theme-subheader text-center ml-2 mt-2">PAF History</h2>
          </div>
          <v-icon class="close-icon" @click="historyDialog = false">
            mdi-close
          </v-icon>
        </div>

        <!-- DESCRIPTION -->
        <p class="amend-desc mt-3">
          <paf-history
            :sel_paf_id="selectedPaf.id"
            :paf_header="paf"
            :drug_form="selectedPaf.drug.drug_form"
          ></paf-history>
        </p>
        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-8">
          <!-- <v-btn class="btn-cancel" size="small" @click="rejectDialog = false"
            >Cancel</v-btn
          >
          <v-btn size="small" class="btn-reject mx-3" @click="submitReject">
            Reject
          </v-btn> -->
        </div>
      </v-card>
    </v-dialog>
    <!-- PAF History Dialog-->

    <v-dialog v-model="revertDialog" max-width="520" persistent>
      <v-card class="reject-dialog text-center pa-6">
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="revertDialog = false">
            mdi-close
          </v-icon>
        </div>

        <div class="revert-icon mx-auto mb-4">
          <v-icon size="36" class="theme-revert">mdi-undo</v-icon>
        </div>

        <h2 class="reject-title theme-revert">Revert to Approver</h2>

        <v-select
          v-model="selectedRevertReason"
          :items="revertReasons"
          item-title="longname"
          item-value="shortname"
          label="Reason for reverting"
          density="compact"
          variant="outlined"
          class="field-required"
          hide-details
          @update:modelValue="onRevertReasonChange"
        ></v-select>

        <!-- Custom Reason -->
        <v-textarea
          v-if="selectedRevertReason === 'Other (please state)'"
          v-model="customRevertReason"
          label="Please specify reason"
          density="compact"
          variant="outlined"
          class="mt-3 field-required"
          rows="2"
        ></v-textarea>

        <div class="d-flex justify-center align-center mt-8">
          <v-btn class="btn-cancel" size="small" @click="revertDialog = false">
            Cancel
          </v-btn>

          <v-btn
            size="small"
            class="btn-approved mx-3"
            color="primary"
            :loading="loader"
            @click="submitRevert"
          >
            Continue
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

            <h2 class="theme-subheader">Noncompliance Details</h2>
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
    <v-dialog v-model="uncWarningDialog" max-width="650" persistent>
      <v-card class="unc-warning-dialog pa-6 text-center">
        <!-- ICON -->
        <div class="unc-warning-icon mx-auto mb-4">
          <v-icon size="36" color="orange"> mdi-alert </v-icon>
        </div>

        <!-- TITLE -->
        <h2 class="unc-warning-title">Non-compliance Detected</h2>

        <!-- MESSAGE -->
        <p class="unc-warning-desc mt-3">
          This Prescription Authorisation Form contains one or more
          <strong>Non-compliance</strong> items. Please review them carefully
          before proceeding.
        </p>

        <!-- UNC LIST -->
        <div
          v-for="(n, index) in selectedPaf.non_conformance"
          :key="n.id"
          class="unc-warning-item"
        >
          <span class="unc-index">{{ index + 1 }}</span>
          {{ n.note }}
        </div>

        <!-- ACTIONS -->
        <div class="d-flex justify-center mt-6">
          <v-btn
            size="small"
            class="btn-cancel"
            @click="uncWarningDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="warning"
            size="small"
            class="btn-approved mx-3"
            @click="continueApprovalAfterUNC"
          >
            Continue Anyway
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- Review Dialog -->
    <v-dialog v-model="reviewDialog" max-width="500" persistent>
      <v-card class="text-center pa-6">
        <!-- CLOSE -->
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="reviewDialog = false">
            mdi-close
          </v-icon>
        </div>

        <!-- ICON -->
        <div class="mx-auto mb-4 renew-icon">
          <v-icon size="36" color="primary">mdi-eye</v-icon>
        </div>

        <!-- TITLE -->
        <h2 class="renew-title">Review Notes</h2>

        <!-- MESSAGE -->
        <v-textarea
          v-model="customReviewReason"
          label="Please specify reason"
          density="compact"
          variant="outlined"
          class="mt-3"
          rows="2"
        ></v-textarea>

        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-6">
          <v-btn size="small" class="btn-cancel" @click="reviewDialog = false">
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
    <!-- Review Dialog -->
    <!-- Request Dialog -->
    <v-dialog v-model="requestDialog" max-width="900" persistent>
      <v-card class="text-center pa-6">
        <!-- CLOSE -->
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="requestDialog = false">
            mdi-close
          </v-icon>
        </div>

        <!-- ICON -->
        <div class="mx-auto mb-4 renew-icon">
          <v-icon size="36" color="primary">
            mdi-frequently-asked-questions
          </v-icon>
        </div>

        <!-- TITLE -->
        <h2 class="renew-title">Request Notes</h2>

        <!-- SELECT USERS -->
        <div class="mt-3 text-left">
          <label class="mb-1 d-block font-weight-medium">Select Users</label>

          <v-chip-group v-model="selectedUsers" multiple column>
            <v-chip
              v-for="user in requestUsers"
              :key="user.id"
              :value="user.id"
              class="ma-1 d-flex align-center"
              color="primary"
              variant="outlined"
            >
              <!-- Checkbox indicator -->
              <v-icon
                size="16"
                class="mr-2"
                :color="selectedUsers.includes(user.id) ? 'primary' : 'grey'"
              >
                {{
                  selectedUsers.includes(user.id)
                    ? "mdi-checkbox-marked"
                    : "mdi-checkbox-blank-outline"
                }}
              </v-icon>

              <!-- User text -->
              {{ user.name }} ({{ user.role }})
            </v-chip>
          </v-chip-group>
        </div>

        <!-- MESSAGE -->
        <v-textarea
          v-model="adminRequestNote"
          label="Enter the request note"
          density="compact"
          variant="outlined"
          class="mt-3 field-required"
          rows="2"
        ></v-textarea>
        <v-alert
          v-if="request_message"
          variant="tonal"
          density="compact"
          class="mt-3 text-left d-flex align-center"
        >
          {{ request_message }}

          <!-- HOVER ICON -->
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon
                v-bind="props"
                size="18"
                class="ml-2 cursor-pointer"
                color="primary"
              >
                mdi-information-outline
              </v-icon>
            </template>

            <!-- TOOLTIP CONTENT -->
            <div style="min-width: 400px">
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-left">Date</th>
                    <th class="text-left">Note</th>
                    <!-- <th class="text-left">Reminders</th> -->
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in request_history" :key="item.id">
                    <td>{{ item.created_at }}</td>
                    <td>{{ item.note }}</td>
                    <!-- <td>{{ item.reminders }}</td> -->
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-tooltip>
        </v-alert>

        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-6">
          <v-btn size="small" class="btn-cancel" @click="requestDialog = false">
            Cancel
          </v-btn>

          <v-btn
            size="small"
            class="btn-approved mx-3"
            color="primary"
            @click="confirmRequest"
            :disabled="!adminRequestNote?.trim() || selectedUsers.length === 0"
          >
            Submit
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
    <!-- Request Dialog -->

    <v-dialog v-model="nonConfInputDialog" max-width="600" persistent>
      <v-card class="text-center pa-6">
        <!-- CLOSE -->
        <div class="d-flex justify-end">
          <v-icon class="close-icon" @click="nonConfInputDialog = false">
            mdi-close
          </v-icon>
        </div>

        <!-- ICON -->
        <div class="mx-auto mb-4 renew-icon">
          <v-icon size="36" color="warning"> mdi-alert-circle-outline </v-icon>
        </div>

        <!-- TITLE -->
        <h2 class="renew-title">Non-compliance Notes</h2>

        <!-- DESCRIPTION (optional but nice UX) -->
        <p class="renew-desc mt-2">
          Please enter details for the Non-compliance identified in this PAF.
        </p>

        <!-- INPUT -->
        <v-textarea
          v-model="nonConfText"
          label="Enter non-compliance details"
          density="compact"
          variant="outlined"
          class="mt-3 field-required"
          rows="3"
          maxlength="250"
          counter="250"
          auto-grow
        ></v-textarea>

        <!-- ACTIONS -->
        <div class="d-flex justify-center align-center mt-6">
          <v-btn
            size="small"
            class="btn-cancel"
            @click="nonConfInputDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            size="small"
            class="btn-approved mx-3"
            color="warning"
            :loading="nonConfLoading"
            :disabled="!nonConfText || !nonConfText.trim()"
            @click="submitNonConformance"
          >
            Submit
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import html2pdf from "html2pdf.js";
export default {
  data() {
    return {
      dispense_date: new Date().toISOString().slice(0, 10),
      paf: null,
      pafList: [],
      selectedPaf: null,
      dosageRows: [
        {
          drug_strength: null,
          other_capsules: null,
          cap_per_cycle: null,
          isOthersActive: false,
        },
      ],
      prescriber: {},
      loader: false,
      search: "",
      risk_confirmed: false,
      cap_strength_edit: false,
      cap_cycle_edit: false,
      num_cycle_edit: false,
      preg_date_edit: false,
      google_icon: {
        icon_name: "description",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },
      user: {},
      inst_type: null,
      user_signature: "",
      rejectDialog: false,
      selectedRejectReason: null,
      customRejectReason: "",
      rejectReasons: [],
      capsuleOptions: [],
      supplyWeeksOptions: [],
      drugStrengthOptions: [],
      indicationOptions: [],
      cycleOptions: ["1 Cycle", "2 Cycles", "3 Cycles", "4 Cycles"],
      originalValues: {
        drug_strength: null,
        cap_per_cycle: null,
        cycles: null,
        last_negative_preg_date: null,
        risk_confirmed: null,
      },

      amendDialog: false,
      approvalConfirmDialog: false,

      mahDialog: false,
      selectedMah: null,
      mahConfirmed1: false,
      mahConfirmed2: false,

      marketing_holders: [],
      envImagePath: import.meta.env.VITE_IMAGE_PATH,
      finishConfirmationDialog: false,
      mahFormValid: false,
      mahError: false,

      approvalType: null,

      approveDialog: false,
      approveFormValid: false,

      dispenserPoint: null,
      dispensingLocation: null,

      dispenserOptions: ["Outpatient Pharmacy", "Homecare"],
      dispensingLocationOptions: [],
      dispensing_loc_loader: false,
      action_permissions: [],
      renewDialog: false,

      isCapsuleValid: true,
      capsuleErrorMsg: "",
      historyDialog: false,
      org_total_qty: null,
      sel_paf_index: 0,

      drug_exp: null,
      drug_reg: null,
      has_lead_pharmacist: null,

      revertDialog: false,
      selectedRevertReason: null,
      revertReasons: [],
      customRevertReason: "",
      reg_status_loader: true,
      app_image_url: "",
      application_name: "",
      nonConfDialog: false,
      uncWarningDialog: false,
      sel_institution: null,
      reviewDialog: false,
      customReviewReason: "",
      is_other_rejection: 0,
      is_other_revert: 0,
      dialogMessage: "",
      dialogTitle: "",
      adminRequestNote: "",
      request_message: "",
      requestDialog: false,
      request_history: [],
      selectedUsers: [],
      requestUsers: [],
      selectedPafs: [],
      selectAll: false,

      nonConfInputDialog: false,
      nonConfText: "",
      nonConfLoading: false,
      counsel_data: {},
      offlabel_confirmations: [],
    };
  },

  async mounted() {
    // this.app_image_url = localStorage.getItem("App_Image_Url");
    const url = localStorage.getItem("App_Image_Url");

    if (url) {
      this.app_image_url = await this.convertToBase64(url);
    }

    this.fetchPaf();
    this.fetchLov();
  },

  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.sel_institution = JSON.parse(localStorage.getItem("sel_inst"));
    this.action_permissions = JSON.parse(
      localStorage.getItem("action_permissions")
    );
    this.user_signature = this.user.signature;
    this.inst_type = this.user?.pharmacist?.institution_type ?? null;
  },

  computed: {
    amendChanges() {
      const changes = [];

      // Normalize function
      const normalize = (rows) =>
        (rows || []).map((r) => ({
          drug_strength: Number(r.drug_strength) || 0,
          cap_per_cycle:
            r.cap_per_cycle === "Others"
              ? Number(r.other_capsules) || 0
              : Number(r.cap_per_cycle) || 0,
        }));

      const original = JSON.stringify(
        normalize(this.originalValues.dosageRows)
      );
      const current = JSON.stringify(normalize(this.dosageRows));

      // ✅ Capsule change
      if (original !== current) {
        changes.push("Capsule strength / dosage details were modified");
      }

      // ✅ Pregnancy date change (normalize format)
      const originalDate = this.originalValues.last_negative_preg_date
        ? this.originalValues.last_negative_preg_date.split("T")[0]
        : null;

      const currentDate = this.paf?.last_negative_preg_date
        ? this.paf.last_negative_preg_date.split("T")[0]
        : null;

      if (originalDate !== currentDate) {
        changes.push("Last negative pregnancy test date was modified");
      }

      // ✅ Risk confirmation change
      if (
        Number(this.risk_confirmed) !==
        Number(this.originalValues.risk_confirmed)
      ) {
        changes.push("Risk confirmation status was modified");
      }

      return changes;
    },

    amendTitle() {
      if (this.amendChanges.length === 1) {
        return "Amendment Detected";
      }
      return "Multiple Amendments Detected";
    },

    maxPregDate() {
      if (this.selectedPaf.declaration_date) {
        return this.formatDate(this.selectedPaf.declaration_date);
      }
      return this.formatDate(new Date());
    },
    capsuleOptionsWithOthers() {
      return [...this.capsuleOptions, { no_of_capsules: "Others" }];
    },
    selectAll: {
      get() {
        return (
          this.filteredPafList.length > 0 &&
          this.selectedPafs.length === this.filteredPafList.length
        );
      },
      set(value) {
        if (value) {
          this.selectedPafs = this.filteredPafList.map((item) => item.id);
        } else {
          this.selectedPafs = [];
        }
      },
    },
    rules() {
      return {
        requiredMah: (v) => !!v || "Please select a MAH",
        confirmCheck: (v) => v === true || "You must confirm this",
      };
    },
    patientCategoryLabel() {
      if (this.paf.patient_category == "M") return "Male";
      if (this.paf.patient_category == "WCBP")
        return "Women of Childbearing Potential";
      if (this.paf.patient_category == "WNCBP")
        return "Woman of Non-Childbearing Potential";
      return "-";
    },

    filteredPafList() {
      if (!this.search) return this.pafList;

      const s = this.search.toLowerCase();

      return this.pafList.filter((item) => {
        return (
          item.paf_no?.toLowerCase().includes(s) ||
          item.status?.toLowerCase().includes(s) ||
          item.drug?.drug_name?.toLowerCase().includes(s) ||
          item.prescriber?.prescriber_data?.institution_data?.name
            ?.toLowerCase()
            .includes(s)
        );
      });
    },
  },

  methods: {
    goToMyprofile() {
      this.$router.push({
        name: "view-my-profile",
        query: {
          slug: this.user.slug,
          inst_id: this.sel_institution.id,
          from: "pafview",
        },
      });
    },
    async validateBeforeApproval() {
      this.loader = true;

      const nonConformances = await this.revalidateNonConformance();

      this.loader = false;

      if (nonConformances.length) {
        this.selectedPaf.non_conformance = nonConformances;
        this.uncWarningDialog = true;
        return false;
      }

      return true;
    },

    async revalidateNonConformance() {
      try {
        const drug_cycles = this.dosageRows.map((row) => ({
          drug_strength: row.drug_strength,
          cap_per_cycle: row.cap_per_cycle,
          cap_per_cycle:
            row.cap_per_cycle === "Others"
              ? parseInt(row.other_capsules) || 0
              : parseInt(row.cap_per_cycle) || 0,
        }));

        const payload = {
          paf_details_id: this.selectedPaf?.id,

          //UPDATED → send ARRAY instead of single values
          drug_cycles: drug_cycles,

          // keep these SINGLE
          cycles: this.paf.cycles,
          total_supply: this.paf.total_supply,
          last_negative_preg_date: this.paf.last_negative_preg_date,
          risk_confirmed: this.risk_confirmed,
        };
        const res = await this.$axios.post(
          "revalidate_non_conformance",
          payload
        );

        if (res.data.status === "S") {
          return res.data.violations || [];
        }

        this.$toast.error(res.data.message || "Validation failed");
        return [];
      } catch (e) {
        console.error(e);
        this.$toast.error("Something went wrong during validation");
        return [];
      }
    },
    fetchConfirmations() {
      this.loader = true;
      this.$axios
        .get("get_confirmation_text", {
          params: {
            drug_id: this.selectedPaf.drug_id,
            patient_category: this.paf.patient_category,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.counsel_data = res.data.confirmation;
          } else {
            this.counsel_data = "";
          }
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    markNonConformance() {
      this.nonConfText = "";
      this.nonConfInputDialog = true;
    },

    async submitNonConformance() {
      if (!this.nonConfText || !this.nonConfText.trim()) {
        this.$toast.error("Please enter non-compliance details");
        return;
      }

      const payload = {
        paf_details_id: this.selectedPaf?.id,
        note: this.nonConfText.trim(),
      };

      this.nonConfLoading = true;

      try {
        const res = await this.$axios.post("mark_non_conformance", payload);

        if (res.data.status === "S") {
          this.$toast.success(res.data.message || "Marked successfully");

          this.nonConfInputDialog = false;
          this.nonConfText = "";

          this.fetchPaf();
        } else {
          this.$toast.error(res.data.message);
        }
      } catch (e) {
        this.$toast.error("Something went wrong");
      } finally {
        this.nonConfLoading = false;
      }
    },

    // toggleSelectAll() {
    //   if (this.selectAll) {
    //     this.selectedPafs = this.filteredPafList.map((item) => item.id);
    //   } else {
    //     this.selectedPafs = [];
    //   }
    // },
    async bulkReview() {
      try {
        await axios.post("/api/paf/bulk-review", {
          paf_ids: this.selectedPafs,
        });

        this.$toast.success("Bulk review completed");

        this.selectedPafs = [];
        this.selectAll = false;

        this.fetchPafs(); // reload list
      } catch (e) {
        this.$toast.error("Bulk review failed");
      }
    },
    // async handleOPDispense() {
    //   const result = await this.showConfirmation(
    //     "Confirm",
    //     "Are you sure you want to Dispense this PAF?",
    //   );

    //   if (!result) return;

    //   this.loader = true;
    //   const payload = {
    //     paf_details_id: this.selectedPaf?.id,
    //   };

    //   this.$axios
    //     .post("paf_op_dispense", payload)
    //     .then((res) => {
    //       if (res.data.status === "S") {
    //         this.$toast.success(
    //           res.data.message || "PAF Reverted Successfully",
    //         );
    //         this.$router.push({ name: "paf_report" });
    //       } else {
    //         this.$toast.error(res.data.message);
    //       }
    //     })
    //     .catch(() => {
    //       this.$toast.error("Something went wrong");
    //     })
    //     .finally(() => {
    //       this.loader = false;
    //     });
    // },

    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    onRevertReasonChange(val) {
      if (val === "Other (please state)") {
        this.is_other_revert = 1;
      } else {
        this.is_other_revert = 0;
      }
    },
    continueApprovalAfterUNC() {
      this.uncWarningDialog = false;

      if (this.hasPrescriptionChanged()) {
        this.amendDialog = true;
      } else {
        this.approvalConfirmDialog = true;
      }
    },
    async convertToBase64(url) {
      try {
        const response = await fetch(url);

        const blob = await response.blob();

        return await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Image convert failed", err);
        return "";
      }
    },

    async downloadPDF() {
      // this.loader = true;
      const element = this.$refs.pdfComponent.$el;

      await this.$nextTick();

      // CONVERT LOGO TO BASE64 (IMPORTANT)
      if (this.app_image_url && !this.app_image_url.startsWith("data:")) {
        this.app_image_url = await this.convertToBase64(this.app_image_url);
      }

      // WAIT FOR IMAGES
      const images = element.querySelectorAll("img");

      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete && img.naturalHeight !== 0) {
            return Promise.resolve();
          }

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // SMALL DELAY (VERY IMPORTANT)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // GENERATE PDF
      html2pdf()
        .set({
          margin: 0.3,
          filename: `PAF_${this.selectedPaf?.paf_no}.pdf`,
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
          },
          jsPDF: {
            unit: "in",
            format: "a4",
          },
        })
        .from(element)
        .save();
      // this.loader = false;
    },
    submitRevert() {
      if (!this.selectedRevertReason) {
        this.$toast.error("Please select a reason for reverting");
        return;
      }

      if (
        this.selectedRevertReason === "Other (please state)" &&
        !this.customRevertReason
      ) {
        this.$toast.error("Please enter the revert reason");
        return;
      }

      const reason =
        this.selectedRevertReason === "Other (please state)"
          ? this.customRevertReason
          : this.selectedRevertReason;

      const payload = {
        paf_details_id: this.selectedPaf?.id,
        reason: reason,
        is_other_revert: this.is_other_revert,
      };

      this.loader = true;

      this.$axios
        .post("paf_revert", payload)
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(
              res.data.message || "PAF Reverted Successfully"
            );
            this.revertDialog = false;
            this.$router.push({ name: "paf_report" });
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch(() => {
          this.$toast.error("Something went wrong");
        })
        .finally(() => {
          this.loader = false;
        });
    },
    openRevertDialog() {
      this.selectedRevertReason = null;
      this.customRevertReason = "";
      this.revertDialog = true;
    },
    enableDrugCycleEdit() {
      this.num_cycle_edit = true;
      this.cap_cycle_edit = true;
      this.cap_strength_edit = true;
    },
    validateCapsuleLimit() {
      this.org_total_qty = null;

      let hasEmptyRow = false;

      // ✅ ORIGINAL TOTAL
      let originalTotal = 0;

      (this.originalValues.dosageRows || []).forEach((row) => {
        const strength = parseInt(row.drug_strength) || 0;
        const caps = parseInt(row.cap_per_cycle) || 0;

        originalTotal += strength * caps;
      });

      this.org_total_qty = originalTotal + "mg";

      // ✅ NEW TOTAL
      let newTotal = 0;

      this.dosageRows.forEach((row) => {
        const strength = parseInt(row.drug_strength);
        const caps =
          row.cap_per_cycle === "Others"
            ? parseInt(row.other_capsules) || 0
            : parseInt(row.cap_per_cycle) || 0;

        // ✅ Check empty values
        if (!strength || !caps) {
          hasEmptyRow = true;
        }

        newTotal += (strength || 0) * (caps || 0);
      });

      // ❗ Priority 1: Empty row check
      if (hasEmptyRow) {
        this.isCapsuleValid = false;
        this.capsuleErrorMsg =
          "Please fill all Capsule Strength and Capsules per Cycle values.";
        return;
      }

      // ❗ Priority 2: Total validation
      if (newTotal !== originalTotal) {
        this.isCapsuleValid = false;

        if (newTotal > originalTotal) {
          this.capsuleErrorMsg = `Current selection (${newTotal}mg) exceeds the prescribed total (${originalTotal}mg).`;
        } else {
          this.capsuleErrorMsg = `Current selection (${newTotal}mg) is less than the prescribed total (${originalTotal}mg).`;
        }
      } else {
        this.isCapsuleValid = true;
        this.capsuleErrorMsg = "";
      }
    },

    confirmRenew() {
      this.renewDialog = false;

      this.$router.push({
        name: "paf_create",
        query: {
          renew: 1,
          paf_id: this.selectedPaf?.id,
          patient_id: this.paf?.patient_id,
          paf_no: this.selectedPaf.paf_no,
        },
      });
    },
    confirmReview() {
      this.loader = true;

      const isBulk = this.selectedPafs?.length > 0;

      const payload = {
        paf_ids: isBulk ? this.selectedPafs : [this.selectedPaf?.id], // fallback to single
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
          this.selectedPafs = [];
          this.selectAll = false;

          this.fetchPaf();
        } else {
          this.$toast.error(res.data.message);
          this.loader = false;
        }
      });

      // 👉 Only redirect for SINGLE review
      if (!isBulk) {
        this.$router.push({
          name: "bulk_review_paf",
          query: {
            review: 1,
            paf_id: this.selectedPaf?.id,
            patient_id: this.paf?.patient_id,
            paf_no: this.selectedPaf.paf_no,
          },
        });
      }
    },

    openRenewDialog() {
      this.renewDialog = true;
    },
    openReviewDialog() {
      this.reviewDialog = true;
    },
    handleApprovalConfirm() {
      this.approvalConfirmDialog = false;

      if (this.approvalType === "dispense") {
        this.mahDialog = true;
      } else if (this.approvalType === "approve") {
        this.openApproveDialog();
      }
    },

    async handleApproveDispense() {
      this.resetMahDialog();
      this.mahConfirmed1 = false;
      this.mahConfirmed2 = false;

      this.approvalType = "dispense";

      const isValid = await this.validateBeforeApproval();
      if (!isValid) return;

      if (this.hasPrescriptionChanged()) {
        this.amendDialog = true;
      } else {
        this.approvalConfirmDialog = true;
      }
    },

    async handleApprove() {
      this.resetApproveForm();
      this.mahConfirmed1 = false;
      this.mahConfirmed2 = false;

      this.approvalType = "approve";

      const isValid = await this.validateBeforeApproval();
      if (!isValid) return;

      if (this.hasPrescriptionChanged()) {
        this.amendDialog = true;
      } else {
        this.approvalConfirmDialog = true;
      }
    },

    resetMahDialog() {
      this.selectedMah = null;
      this.mahConfirmed1 = false;
      this.mahConfirmed2 = false;
      this.mahError = false;

      // reset form validation
      if (this.$refs.mahForm) {
        this.$refs.mahForm.reset();
        this.$refs.mahForm.resetValidation();
      }
    },

    finishApproval() {
      this.finishConfirmationDialog = false;

      //Block if invalid OR incomplete rows
      if (!this.isCapsuleValid || this.isApproveDisabled) {
        this.$toast.error(
          this.capsuleErrorMsg || "Please complete dosage details correctly"
        );
        return;
      }

      if (this.approvalType === "dispense") {
        this.proceedApproveDispense();
      } else {
        //Prepare drug_cycles array
        const drug_cycles = this.dosageRows.map((row) => ({
          drug_strength: row.drug_strength,
          cap_per_cycle: row.cap_per_cycle,
          cap_per_cycle:
            row.cap_per_cycle === "Others"
              ? parseInt(row.other_capsules) || 0
              : parseInt(row.cap_per_cycle) || 0,
        }));

        const payload = {
          paf_details_id: this.selectedPaf?.id,

          //UPDATED → send ARRAY instead of single values
          drug_cycles: drug_cycles,

          // keep these SINGLE
          cycles: this.paf.cycles,
          total_supply: this.paf.total_supply,
          last_negative_preg_date: this.paf.last_negative_preg_date,
          risk_confirmed: this.risk_confirmed,

          dispenser_point: this.dispenserPoint,
          dispensing_location: this.dispensingLocation,
          dispensing_name: this.user_signature,
          dispensing_date: this.dispense_date,
        };

        this.loader = true;

        this.$axios
          .post("paf_approve", payload)
          .then((res) => {
            if (res.data.status === "S") {
              this.$toast.success(res.data.message || "Approved successfully");
              this.fetchPaf();
            } else {
              this.$toast.error(res.data.message);
            }
          })
          .catch(() => {
            this.$toast.error("Something went wrong");
          })
          .finally(() => {
            this.loader = false;
          });
      }
    },
    finalSubmit() {
      this.mahError = !this.selectedMah;

      const isValid = this.$refs.mahForm.validate();

      if (!this.mahConfirmed1 || !this.mahConfirmed2) {
        return;
      }

      if (!isValid || this.mahError) {
        return;
      }

      this.finishConfirmationDialog = true;
    },

    openApproveDialog() {
      this.resetApproveForm();
      this.approveDialog = true;

      this.$nextTick(() => {
        this.$refs.approveForm?.resetValidation();
      });
    },

    resetApproveForm() {
      this.dispenserPoint = null;
      this.dispensingLocation = null;
      this.dispensingLocationOptions = [];

      if (this.$refs.approveForm) {
        this.$refs.approveForm.resetValidation();
      }
    },

    onDispenserChange() {
      this.dispensing_loc_loader = true;
      this.dispensingLocation = null;
      this.dispensingLocationOptions = [];

      this.$axios
        .get("fetch_institutions_by_type", {
          params: {
            institution_type: this.dispenserPoint,
          },
        })
        .then((res) => {
          this.dispensingLocationOptions = res.data.institutions;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        })
        .finally(() => {
          this.dispensing_loc_loader = false;
        });
    },

    submitApproveForm() {
      if (!this.$refs.approveForm) return;
      const isValid = this.$refs.approveForm.validate();

      if (
        !this.dispenserPoint ||
        !this.dispensingLocation ||
        !this.mahConfirmed2
      ) {
        this.$toast.error("Please complete all mandatory fields");
        return;
      }

      if (!isValid) return;

      this.approveDialog = false;
      this.finishConfirmationDialog = true;
    },

    calculateTotal() {
      const cycles = parseInt(this.paf.cycles) || 0;
      const supplyWeeks = parseInt(this.paf.supply_weeks) || 0;

      const totalWeeks = cycles * supplyWeeks;

      let totalCapsules = 0;

      this.dosageRows.forEach((row) => {
        const caps =
          row.cap_per_cycle === "Others"
            ? parseInt(row.other_capsules) || 0
            : parseInt(row.cap_per_cycle) || 0;

        totalCapsules += caps;
      });

      this.paf.total_supply = `${totalWeeks} week${
        totalWeeks === 1 ? "" : "s"
      }`;

      console.log("Total Supply:", totalCapsules);
    },

    fetchDrugDetails() {
      this.loader = true;
      this.$axios
        .get("fetch_drug_details", {
          params: {
            drug_id: this.selectedPaf.drug_id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.indicationOptions = res.data.drug_indications || [];
            this.drugStrengthOptions = res.data.drug_strength || [];
            this.supplyWeeksOptions = res.data.drug_cycles || [];
            this.capsuleOptions = res.data.drug_capsules || [];
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        })
        .finally(() => {
          this.loader = false;
        });
    },
    fetchMarketHolders() {
      this.loader = true;
      this.$axios
        .get("fetch_marketing_holders_by_drug", {
          params: {
            drug_id: this.selectedPaf.drug_id || [],
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.marketing_holders = res.data.marketing_holders;
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        })
        .finally(() => {
          this.loader = false;
        });
    },
    fetchLov() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "PAF_REJECTION_REASON",
          },
        })
        .then((res) => {
          const reasons = res.data.lookup_details || [];

          // Append "Other"
          reasons.push({
            shortname: "OTHER",
            longname: "Other (please state)",
          });

          this.rejectReasons = reasons;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });

      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "PAF_REVERT_REASON",
          },
        })
        .then((res) => {
          this.revertReasons = res.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    goBack() {
      const allowedRoles = ["Nurse", "PCG Admin", "SuperUser"];

      if (allowedRoles.includes(this.user.rolename)) {
        this.$router.push({ name: "paf_report" });
      } else {
        this.$router.push({ name: "paf_report" });
      }
      // if (
      //   this.user.rolename == "Prescriber" ||
      //   this.user.rolename == "PCG Admin" ||
      //   this.user.rolename == "Pharmacist" ||
      //   this.user.rolename == "SuperUser"
      // ) {
      // } else if (this.user.rolename === "Nurse") {
      //   this.$router.go(-1);
      // }
    },

    fetchPaf() {
      const slug = this.$route.query.slug;
      this.loader = true;
      let url = "paf_details";

      if (
        this.user.rolename === "PCG Admin" ||
        this.user.rolename === "SuperUser"
      ) {
        url = "get_all_paf_details";
      }
      this.$axios
        .get(url, {
          params: {
            slug: slug,
            institution_id: this.sel_institution?.institution_id,
          },
        })
        .then((res) => {
          const paf = res.data?.paf;

          this.paf = {
            patient_id: paf.patient_no,
            gender: paf.gender,
          };

          this.pafList = paf.paf_details || [];

          if (this.pafList.length) {
            this.selectPaf(
              this.pafList[this.sel_paf_index],
              this.sel_paf_index
            );
          }
        })
        .finally(() => (this.loader = false));
    },

    hasPrescriptionChanged() {
      const normalize = (rows) =>
        (rows || []).map((r) => ({
          drug_strength: String(r.drug_strength || ""),
          cap_per_cycle: String(r.cap_per_cycle || ""),
        }));

      const original = JSON.stringify(
        normalize(this.originalValues.dosageRows)
      );
      const current = JSON.stringify(normalize(this.dosageRows));

      return (
        original !== current ||
        this.paf.cycles !== this.originalValues.cycles ||
        this.paf.last_negative_preg_date !==
          this.originalValues.last_negative_preg_date ||
        Number(this.risk_confirmed) !==
          Number(this.originalValues.risk_confirmed)
      );
    },

    proceedApproveDispense() {
      // BLOCK if invalid OR incomplete rows
      if (!this.isCapsuleValid || this.isApproveDisabled) {
        this.$toast.error(
          this.capsuleErrorMsg || "Please complete dosage details correctly"
        );
        return;
      }

      // Prepare ARRAY
      const drug_cycles = this.dosageRows.map((row) => ({
        drug_strength: row.drug_strength,
        cap_per_cycle:
          row.cap_per_cycle === "Others"
            ? parseInt(row.other_capsules) || 0
            : parseInt(row.cap_per_cycle) || 0,
      }));

      const payload = {
        paf_details_id: this.selectedPaf?.id,

        // NEW (ARRAY instead of single values)
        drug_cycles: drug_cycles,

        // SINGLE VALUES
        cycles: this.paf.cycles,
        total_supply: this.paf.total_supply,
        last_negative_preg_date: this.paf.last_negative_preg_date,
        risk_confirmed: this.risk_confirmed,

        // MAH
        mah_id: this.selectedMah,

        // User info
        dispensing_name: this.user_signature,
        dispensing_date: this.dispense_date,
        is_inpatient: this.inst_type == "Inpatient Pharmacy" ? 1 : 0,
      };

      this.loader = true;

      this.$axios
        .post("paf_approve_and_dispense", payload)
        .then((res) => {
          const response = res.data;

          if (response.status === "E") {
            this.$toast.error(response.message || "Something went wrong");
            return;
          }

          if (response.status === "S") {
            this.$toast.success(
              response.message || "Approved & Dispensed successfully"
            );

            // Reset dialogs
            this.mahDialog = false;
            this.finishConfirmationDialog = false;

            if (
              this.inst_type == "Outpatient Pharmacy" ||
              this.inst_type == "Homecare"
            ) {
              this.$router.push({ name: "paf_report" });
            }

            // Refresh data
            this.fetchPaf();
          }
        })
        .catch((err) => {
          const message =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Server error. Please try again.";

          this.$toast.error(message);
        })
        .finally(() => {
          this.loader = false;
        });
    },

    selectPaf(detail, index) {
      // Reset edit states
      this.cap_strength_edit = false;
      this.cap_cycle_edit = false;
      this.num_cycle_edit = false;
      this.preg_date_edit = false;

      this.selectedPaf = detail;
      this.sel_paf_index = index;
      this.risk_confirmed = detail.is_risk_confirmed == 1 ? true : false;

      this.requestUsers = detail.request_users || [];
      this.request_message = detail.request_message || "";
      this.request_history = detail.request_history || [];
      this.selectedUsers = [];

      const cycle = detail.drug_cycles?.[0] || {};
      const prescriberDetails = detail.prescriber?.prescriber_data || {};

      // Store ORIGINAL VALUES as ARRAY (important)
      this.originalValues = {
        dosageRows: JSON.parse(
          JSON.stringify(
            detail.drug_cycles?.map((c) => ({
              drug_strength: c.drug_strength,
              cap_per_cycle: c.cap_per_cycle,
            })) || []
          )
        ),

        cycles: cycle.no_of_cycles,
        last_negative_preg_date: detail.last_negative_preg_date,
        risk_confirmed: detail.is_risk_confirmed == 1 ? 1 : 0,
      };

      // PAF single values remain SAME
      this.paf = {
        ...this.paf,
        initials: detail.patient_initials,
        patient_category: detail.patient_category,
        dob: detail.patient_dob,
        last_negative_preg_date: detail.last_negative_preg_date,
        hospital: prescriberDetails?.institution_data?.name || "-",
        hospital_address: prescriberDetails?.institution_data?.address || "-",
        indication: detail.indication?.name,
        drug: detail?.drug?.drug_name,
        date: detail.created_at,

        // single values
        supply_weeks: cycle.supply_weeks,
        cycles: cycle.no_of_cycles,
        total_supply: cycle.total_supply,
      };

      // Set editable rows separately
      this.dosageRows = detail.drug_cycles?.map((c) => ({
        drug_strength: c.drug_strength,
        cap_per_cycle: c.cap_per_cycle,
      })) || [
        {
          drug_strength: null,
          cap_per_cycle: null,
        },
      ];

      this.prescriber = {
        full_name: detail.prescriber?.full_name,
      };

      this.offlabel_confirmations = detail.offlabel_confirmations || [];

      // API calls
      this.fetchDrugDetails();
      this.fetchMarketHolders();
      this.getRegDrugStatus();
      this.fetchConfirmations();

      // Ensure validation runs AFTER render
      this.$nextTick(() => {
        this.validateCapsuleLimit();
      });
    },

    getRegDrugStatus() {
      this.reg_status_loader = true;
      this.drug_reg = null;
      this.drug_exp = null;
      this.$axios
        .get("get_reg_drug_status", {
          params: {
            drug_id: this.selectedPaf.drug_id,
            user_id: this.user.id,
            inst_id: this.sel_institution?.institution_id,
          },
        })
        .then((res) => {
          this.drug_reg = res.data.is_registered;
          this.drug_exp = res.data.is_expired;
          this.has_lead_pharmacist = res.data.has_lead_pharmacist;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        })
        .finally(() => {
          this.reg_status_loader = false;
        });
    },

    openRejectDialog() {
      this.selectedRejectReason = null;
      this.customRejectReason = "";
      this.rejectDialog = true;
    },

    onRejectReasonChange(val) {
      if (val === "OTHER") {
        this.is_other_rejection = 1;
      } else {
        this.is_other_rejection = 0;
      }
    },

    submitReject() {
      if (!this.selectedRejectReason) {
        this.$toast.error("Please select a reason");
        return;
      }

      if (this.selectedRejectReason === "OTHER" && !this.customRejectReason) {
        this.$toast.error("Please enter the rejection reason");
        return;
      }

      const reason =
        this.selectedRejectReason === "OTHER"
          ? this.customRejectReason
          : this.selectedRejectReason;

      const payload = {
        id: this.selectedPaf?.id,
        reason: reason,
        is_other_rejection: this.is_other_rejection,
      };

      this.loader = true;

      this.$axios
        .post("reject_paf", payload)
        .then((res) => {
          const response = res.data;

          if (response.status === "E") {
            this.$toast?.error?.(response.message || "Something went wrong");
            return;
          }

          if (response.status === "S") {
            this.$toast?.success?.(response.message);

            this.rejectDialog = false;
            this.fetchPaf();
          }
        })
        .catch((err) => {
          console.error(err);
          const message =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Server error. Please try again.";

          this.$toast?.error?.(message);
        })
        .finally(() => {
          this.loader = false;
        });
    },
    openRequestDialog() {
      this.requestDialog = true;
    },
    confirmRequest() {
      this.loader = true;
      this.$axios
        .post("send_paf_request_info", {
          paf_detail_id: this.selectedPaf?.id,
          patient_id: this.paf?.patient_id,
          paf_no: this.selectedPaf.paf_no,
          user_ids: this.selectedUsers,
          request_note: this.adminRequestNote,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.adminRequestNote = "";
            this.selectedUsers = [];
            this.fetchPaf();
          }
        })
        .finally(() => ((this.loader = false), (this.requestDialog = false)));
    },
    addRow() {
      this.dosageRows.push({
        drug_strength: null,
        cap_per_cycle: null,
        other_capsules: null,
        isOthersActive: false,
      });

      // Revalidate after DOM update
      this.$nextTick(() => {
        this.validateCapsuleLimit();
      });
    },

    removeRow(index) {
      this.dosageRows.splice(index, 1);

      // If no rows left, keep one empty row (prevents UI break)
      if (this.dosageRows.length === 0) {
        this.dosageRows.push({
          drug_strength: null,
          cap_per_cycle: null,
        });
      }

      // Revalidate after DOM update
      this.$nextTick(() => {
        this.validateCapsuleLimit();
      });
    },
    resetOtherCapsules(row, val) {
      if (val === "Others") {
        row.other_capsules = "";
        row.isOthersActive = true; // ✅ keep visible
      } else {
        row.other_capsules = null;
        row.isOthersActive = false; // ✅ hide only when changed
      }

      this.calculateTotal();
      this.validateCapsuleLimit();
    },
    onCapsuleInput(row) {
      this.calculateTotal();
      this.validateCapsuleLimit();
    },
  },
};
</script>

<style scoped>
.paf-review {
  background: #fff;
  border-radius: 12px;
}

/* LEFT LIST */
.list-container {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  max-height: 550px;
  overflow-y: auto;
  background: #fff;
}

.list-header {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
}

.list-item {
  padding: 14px 9px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.list-item:hover {
  background: #f9fafb;
}

.list-item.active {
  background: #eef6ff;
  border-left: 4px solid #1976d2;
}

.paf-no {
  font-weight: 600;
  font-size: 13px;
}

.sub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 3px;
}

.hospital {
  font-size: 12px;
  color: #374151;
  margin-top: 4px;
  font-weight: 500;
}

.date {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 3px;
}

/* RIGHT PANEL */
.stepper-box {
  padding: 18px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #f1f5f9;
}

.step-description {
  font-size: 13px;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  padding-bottom: 6px;
  border-bottom: none !important;
  color: #374151;
}

.reject-dialog {
  border-radius: 16px;
  background: #f9fafb;
  position: relative;
}

/* CLOSE BUTTON */
.close-icon {
  cursor: pointer;
  color: #6b7280;
}

/* TOP ICON */
.reject-icon {
  width: 70px;
  height: 70px;
  border: 2px solid #dc2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* TITLE */
.reject-title {
  color: #c2410c;
  font-weight: 600;
  font-size: 20px;
}

/* CANCEL TEXT */
.cancel-text {
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
}

/* REJECT BUTTON */
.reject-btn {
  background: #d84315;
  color: white;
  border-radius: 25px;
  padding: 0 24px;
  height: 36px;
  text-transform: none;
}

.reject-btn:hover {
  background: #bf360c;
}
.amend-dialog {
  border-radius: 20px;
  background: #f9fafb;
}

.amend-icon {
  width: 70px;
  height: 70px;
  border: 2px solid #dc2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.amend-title {
  color: #b91c1c;
  font-weight: 600;
  font-size: 20px;
}

.amend-desc {
  color: #6b7280;
  font-size: 14px;
  margin: 0 auto;
}
.approval-dialog {
  border-radius: 20px;
  background: #f9fafb;
}

.approval-title {
  color: #15803d;
  font-weight: 600;
  font-size: 22px;
}

.approval-content {
  color: #6b7280;
  font-size: 14px;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
}

.btn-approve {
  background: #2e7d32;
  color: white;
  border-radius: 25px;
  padding: 0 24px;
  height: 36px;
  text-transform: none;
}

.btn-approve:hover {
  background: #1b5e20;
}
.mah-dialog {
  border-radius: 16px;
}

.mah-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.mah-item {
  border: 1px solid #e5e7eb;
  border-radius: 30px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  min-width: 160px;
  transition: 0.2s;
}

.mah-item:hover {
  background: #f9fafb;
}

.mah-item.active {
  border-color: #1976d2;
  background: #eef6ff;
}

.mah-card {
  position: relative;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  text-align: center;
  transition: all 0.25s ease;
  border: 1px solid #e5e7eb;
  background: #fff;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: unset;
}

/* Hover */
.mah-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* Active (Selected) */
.mah-card.active {
  border: 2px solid var(--theme-green);
  background: #eef6ff;
}

/* Tick Icon */
.tick {
  position: absolute;
  top: 38px;
  right: -6px;
  color: var(--theme-green);
}

/* Name */
.mah-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}
.sm-search-field {
  transform: scale(0.8);
  position: relative;
  right: -12px;
}

.renew-icon {
  width: 70px;
  height: 70px;
  border: 2px solid #1976d2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.renew-title {
  color: #1976d2;
  font-weight: 600;
  font-size: 20px;
}

.renew-desc {
  color: #6b7280;
  font-size: 14px;
}

.note-font {
  font-size: 14px !important;
  justify-content: end !important;
}

.flip-x {
  transform: scaleX(-1);
  padding: 0px 12px;
}

.theme-revert {
  color: var(--theme-revert);
}

.revert-icon {
  width: 70px;
  height: 70px;
  border: 2px solid var(--theme-revert);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.non-conf-icon {
  color: var(--status-non-conformance);
}

.non-conf-tooltip {
  max-width: 260px;
  font-size: 12px;
  line-height: 1.4;
}

.tooltip-row {
  padding: 3px 0;
  font-weight: 500;
}

.list-item {
  position: relative;
}

/* UNC ribbon */
.unc-ribbon {
  position: absolute;
  bottom: 73px;
  right: -23px;
  background: var(--status-non-conformance);
  color: #fff;
  font-size: 7px;
  font-weight: 600;
  padding: 3px 26px;
  transform: rotate(35deg);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  overflow: hidden;
}

/* Tooltip text */
.non-conf-tooltip {
  max-width: 240px;
  font-size: 12px;
  line-height: 1.4;
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

.unc-warning-dialog {
  border-radius: 16px;
  /* background: #fff7ed; */
}

.unc-warning-icon {
  width: 70px;
  height: 70px;
  border: 2px solid #f97316;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unc-warning-title {
  color: #c2410c;
  font-weight: 600;
  font-size: 20px;
}

.unc-warning-desc {
  color: #6b7280;
  font-size: 14px;
}

.unc-warning-item {
  background: white;
  border-left: 4px solid var(--status-non-conformance);
  padding: 8px 10px;
  margin-top: 8px;
  text-align: left;
  border-radius: 6px;
  font-size: 13px;
}

.unc-index {
  font-weight: 600;
  margin-right: 6px;
  color: var(--status-non-conformance);
}

.text-orange {
  color: rgb(188, 8, 2) !important;
}
.unc-ribbon-shift {
  bottom: 101px !important;
}
.v-table td {
  max-width: 150px;
  white-space: normal;
}
.unc-ribbon-normal {
  bottom: 94px !important;
}
.paf-act-btn {
  border-radius: 2px !important;
}
.risk-confirm-text {
  font-size: 12px !important;
  padding: 20px 10px;
  font-weight: 500;
}
.click-chip {
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease;
}

.click-chip:hover {
  transform: scale(1.05);
}
</style>
