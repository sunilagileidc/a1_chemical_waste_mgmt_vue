<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader || patientLoading"></content-loader>

    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>

    <alert-popup
      v-model="showAlert"
      :message="alertMessage"
      :confirmText="confirmText"
      :type="confirmType"
    />

    <div class="main-section">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center">
        <page-title
          :heading="
            paf.renewal == 1 ? `Renew PAF - ${paf.paf_no}` : 'Create PAF'
          "
          :google_icon="google_icon"
        ></page-title>
        <!-- <div class="add_new_button">
          <v-btn
            size="small"
            class="btn-cancel mr-2"
            color="cancel"
            @click="goBack()"
          >
            Cancel
          </v-btn>
        </div> -->
      </div>
      <!-- Card -->
      <v-card class="table-card">
        <v-stepper v-model="step" elevation="0">
          <!-- STEP HEADER -->
          <v-stepper-header>
            <v-stepper-item
              value="1"
              title="Confirm Identity"
              :complete="step > 1"
            ></v-stepper-item>

            <v-divider></v-divider>

            <v-stepper-item
              value="2"
              title="Drug Details/Patient Category"
              :complete="step > 2"
            ></v-stepper-item>

            <v-divider></v-divider>

            <v-stepper-item value="3" :complete="step > 3">
              <template #title>
                <div class="d-flex flex-column">
                  <span
                    style="font-size: 12px"
                    v-if="
                      selectedDrug &&
                      paf.patient_category &&
                      prescriber_drugs.find((d) => d.drug.id == selectedDrug) &&
                      patientCategories.find(
                        (c) => c.value == paf.patient_category
                      )
                    "
                  >
                    {{
                      prescriber_drugs.find((d) => d.drug.id == selectedDrug)
                        ?.drug.drug_name +
                      " - " +
                      patientCategories.find(
                        (c) => c.value == paf.patient_category
                      )?.label
                    }}
                  </span>
                  <span>Patient Risk Awareness Form</span>
                </div>
              </template></v-stepper-item
            >

            <v-divider></v-divider>

            <!-- <v-stepper-item value="4" title="Patient Category"></v-stepper-item>

            <v-divider></v-divider> -->

            <v-stepper-item
              value="4"
              title="Prescription Authorisation Form"
              :complete="step > 4"
            ></v-stepper-item>

            <v-divider></v-divider>

            <v-stepper-item value="5" title="Review"></v-stepper-item>
          </v-stepper-header>

          <!-- STEP CONTENT -->
          <v-stepper-window>
            <!-- STEP 1 -->
            <v-stepper-window-item class="stepper-box" value="1">
              <v-card elevation="0">
                <h2 class="theme-header">Please confirm your identity</h2>

                <v-divider class="my-4"></v-divider>

                <p class="step-description">
                  Please ensure that the following details are correct before
                  proceeding. If any details are incorrect, please navigate to
                  your profile before clicking Begin.
                </p>

                <h3 class="theme-subheader mt-5">Personal Details</h3>
                <v-row class="mt-4" v-if="prescriber.name">
                  <v-col cols="12" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Prescriber First Name</label>
                      <div class="plain-value">
                        {{ prescriber.name }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Prescriber Last Name</label>
                      <div class="plain-value">
                        {{ prescriber.lastname }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Registration Number</label>
                      <div class="plain-value">
                        {{ prescriber.prescriber_data?.reg_no }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Job Title</label>
                      <div class="plain-value">
                        {{ prescriber.prescriber_data?.job_title }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Hospital Name</label>
                      <div class="plain-value">
                        {{ paf.hospital }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Address</label>
                      <div class="plain-value">
                        {{ paf.hospital_address }}
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Email</label>
                      <div class="plain-value">
                        {{ prescriber.email }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <div v-else>
                  <no-data-found text="Prescriber details not found." />
                </div>

                <div class="step-footer my-1">
                  <v-btn
                    size="small"
                    class="btn-cancel"
                    color="cancel"
                    @click="goBack()"
                  >
                    Cancel PAF
                  </v-btn>
                  <v-btn @click="goToProfile()" class="create-btn" size="small">
                    Go to Profile
                  </v-btn>

                  <v-btn class="create-btn" @click="nextStep" size="small">
                    Begin
                  </v-btn>
                </div>
              </v-card>
            </v-stepper-window-item>

            <!-- STEP 2 -->
            <v-stepper-window-item value="2">
              <v-form ref="drugForm" v-model="drugFormValid">
                <v-row>
                  <v-col cols="12" md="6">
                    <div>
                      <h3 class="theme-header" style="width: 500px">
                        Select the drug to prescribe
                      </h3>
                    </div>

                    <v-divider class="my-4"></v-divider>
                    <div class="mt-6">
                      <div class="chip-list">
                        <v-chip
                          v-for="drug in prescriber_drugs"
                          :key="drug.id"
                          size="large"
                          class="drug-chip mb-4"
                          :class="{
                            'chip-selected': selectedDrug === drug.drug.id,
                            'chip-disabled': paf.renewal == 1,
                          }"
                          @click="storeDrugData(drug)"
                        >
                          {{ drug.drug.drug_name }}
                        </v-chip>
                      </div>
                      <small
                        style="
                          cursor: pointer;
                          text-wrap: inherit;
                          color: var(--theme-color);
                        "
                        @click="goToMyprofile()"
                      >
                        Don't see the drug you are prescribing? Click here to
                        review your registration details
                      </small>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <h3 class="theme-header">Select the Patient PAF</h3>

                    <v-divider class="my-4"></v-divider>
                    <div class="mt-6">
                      <div class="chip-list">
                        <v-chip
                          v-for="item in patientCategories"
                          :key="item.value"
                          size="large"
                          class="category-chip mb-4"
                          :class="{
                            'chip-selected':
                              paf.patient_category === item.value,
                            'chip-disabled': paf.renewal == 1,
                          }"
                          @click="paf.patient_category = item.value"
                          :disabled="selectedDrug ? false : true"
                        >
                          {{ item.label }}
                        </v-chip>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-form>

              <div class="step-footer">
                <v-btn
                  size="small"
                  class="btn-cancel"
                  color="cancel"
                  @click="goBack()"
                >
                  Cancel PAF
                </v-btn>

                <v-btn class="create-btn" @click="prevStep()" size="small">
                  << Previous
                </v-btn>

                <v-btn
                  :disabled="!selectedDrug || !paf.patient_category"
                  class="create-btn"
                  @click="
                    validateDrugStep();
                    fetchDrugDetails();
                    fetchConfirmations();
                  "
                  size="small"
                >
                  Next >>
                </v-btn>
              </div>
            </v-stepper-window-item>

            <!-- STEP 3 -->
            <v-stepper-window-item value="3">
              <v-form ref="rafForm" v-model="rafFormValid">
                <h3 class="theme-header d-flex justify-space-between">
                  <span> Please select the RAF for patient category </span>
                  <div class="sel_option">
                    <v-chip class="mx-1" size="x-small">
                      {{
                        prescriber_drugs.find((d) => d.drug.id == selectedDrug)
                          ?.drug.drug_name
                      }}
                    </v-chip>
                    <v-chip class="mx-1" size="x-small">{{
                      patientCategories.find(
                        (c) => c.value == paf.patient_category
                      )?.label
                    }}</v-chip>
                  </div>
                </h3>

                <v-divider class="my-4"></v-divider>

                <!-- Instructions -->
                <ol class="raf-instructions">
                  <li>
                    Select the Risk Awareness Form that you would like to
                    complete.
                  </li>
                  <li>
                    Print the selected form and input all required information
                    before confirming that the RAF has been completed.
                  </li>
                  <li>
                    After clicking "Next", you can generate a Prescription
                    Authorisation Form. The PAF will be sent to the pharmacy
                    nominated by the patient.
                  </li>
                </ol>

                <!-- RAF CARDS -->
                <v-row class="mt-6 d-flex justify-content-center">
                  <div v-if="rafOptions.length == 0">
                    <no-data-found text="No risk awareness forms found" />
                  </div>
                  <v-col
                    v-else
                    cols="12"
                    md="4"
                    v-for="raf in rafOptions"
                    :key="raf.id"
                  >
                    <v-card class="raf-cool-card">
                      <!-- Top Right Wave -->
                      <div class="raf-wave-top">
                        <svg viewBox="0 0 200 120" preserveAspectRatio="none">
                          <path d="M0,0 C80,60 120,0 200,40 L200,0 Z"></path>
                        </svg>
                      </div>

                      <v-card-text class="raf-content">
                        <div class="raf-icon">
                          <v-icon size="34">mdi-file-document-outline</v-icon>
                        </div>

                        <div class="raf-title">
                          {{ raf.title }}
                        </div>

                        <div class="raf-subtitle">Risk Awareness Form</div>

                        <v-btn
                          size="small"
                          variant="tonal"
                          color="primary"
                          class="mt-4"
                          :href="baseUrl + raf.file_path"
                          target="_blank"
                          prepend-icon="mdi-download"
                        >
                          Download
                        </v-btn>
                      </v-card-text>

                      <!-- Bottom Curve Accent -->
                      <div class="raf-bottom-accent">
                        <svg viewBox="0 0 400 60" preserveAspectRatio="none">
                          <path
                            d="M0,40 C120,10 280,70 400,30 L400,60 L0,60 Z"
                          ></path>
                        </svg>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Confirmation checkbox -->
                <v-checkbox
                  :disabled="rafOptions.length == 0"
                  class="pt-3 check"
                  color="primary"
                  v-model="rafConfirmed"
                  :rules="[rules.confirmRequired]"
                  label="I confirm that the risk awareness form has been completed and signed for this patient."
                ></v-checkbox>
              </v-form>

              <!-- Footer -->
              <div class="step-footer">
                <v-btn
                  size="small"
                  class="btn-cancel"
                  color="cancel"
                  @click="goBack()"
                >
                  Cancel PAF
                </v-btn>
                <v-btn class="create-btn" @click="prevStep" size="small">
                  << Previous
                </v-btn>

                <v-btn
                  :disabled="!rafConfirmed"
                  class="create-btn"
                  @click="validateRAFStep"
                  size="small"
                >
                  Next >>
                </v-btn>
              </div>
            </v-stepper-window-item>

            <!-- STEP 4 -->
            <v-stepper-window-item value="4">
              <v-form ref="pafForm" v-model="pafFormValid">
                <h3 class="theme-header">
                  Prescription Authorisation Form
                  <!-- - {{ paf.patient_category }} -->
                  <v-chip v-if="paf.patient_id" size="small" class="ma-2" label>
                    {{ paf.patient_id }}
                  </v-chip>
                </h3>

                <v-divider class="my-4"></v-divider>

                <!-- Instructions -->
                <ol class="paf-instructions">
                  <li>
                    Enter the full hospital name and address where the patient
                    is treated.
                  </li>
                  <li>Enter the indication and drug name.</li>
                  <li>
                    Select strength and quantity required for prescription.
                  </li>
                </ol>

                <!-- ================= PATIENT DETAILS ================= -->

                <h4 class="theme-subheader mt-6">Patient Details</h4>

                <v-row>
                  <v-col cols="12" :md="paf.patient_category == 'WCBP' ? 6 : 4">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Patient Category</label>
                      <div class="plain-value">
                        {{
                          patientCategories.find(
                            (c) => c.value == paf.patient_category
                          )?.label
                        }}
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" :md="paf.patient_category == 'WCBP' ? 6 : 4">
                    <v-text-field
                      v-if="paf.renewal == 0"
                      density="compact"
                      hide-details="auto"
                      variant="outlined"
                      maxlength="3"
                      label="Patient Initials"
                      class="field-required"
                      v-model="paf.patient_initials"
                      :rules="[rules.required, rules.initialsLength]"
                      @update:modelValue="onInitialsInput"
                      @click:clear="onInitialsInput"
                      :loading="patientLoading"
                      clearable
                    ></v-text-field>
                    <div v-else class="custom-field plain-wrapper">
                      <label class="plain-label">Patient Initials</label>
                      <div class="plain-value">
                        {{ paf.patient_initials }}
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" :md="paf.patient_category == 'WCBP' ? 6 : 4">
                    <date-picker
                      v-if="paf.renewal == 0"
                      v-model="paf.dob"
                      label="Patient Date of Birth"
                      :max="
                        paf.neg_preg_date ||
                        new Date().toISOString().slice(0, 10)
                      "
                      :class_required="true"
                      :rules="[(v) => !!v || 'Date required']"
                      @update:modelValue="onInitialsInput"
                      @click:clear="onInitialsInput"
                      :loading="patientLoading"
                    />
                    <div v-else class="custom-field plain-wrapper">
                      <label class="plain-label">Patient Date of Birth</label>
                      <div class="plain-value">
                        {{ formatDate(paf.dob) }}
                      </div>
                    </div>
                  </v-col>
                  <v-col
                    v-if="paf.patient_category == 'WCBP'"
                    cols="12"
                    :md="paf.patient_category == 'WCBP' ? 6 : 4"
                  >
                    <date-picker
                      v-model="paf.neg_preg_date"
                      label="Date of Last Negative Pregnancy Test"
                      :min="paf.dob"
                      :max="maxPregDate"
                      :class_required="true"
                      :rules="[(v) => !!v || 'Date required']"
                    />
                  </v-col>
                </v-row>

                <!-- ================= PRESCRIPTION DETAILS ================= -->

                <h4 class="theme-subheader mt-6">Prescription Details</h4>

                <v-row>
                  <v-col cols="12">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label"
                        >Name and Address of treating Hospital</label
                      >
                      <div class="plain-value">
                        {{ paf.hospital }} - {{ paf.hospital_address }}
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Drug</label>
                      <div class="plain-value">
                        {{
                          prescriber_drugs.find(
                            (d) => d.drug.id == selectedDrug
                          )?.drug.drug_name
                        }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" :md="paf.indication === 0 ? 3 : 6">
                    <v-select
                      density="compact"
                      hide-details="auto"
                      variant="outlined"
                      label="Indication"
                      :items="indicationOptions"
                      item-title="indication_name"
                      item-value="indication_id"
                      v-model="paf.indication"
                      @update:modelValue="resetOtherIndication"
                      clearable
                    ></v-select>
                  </v-col>
                  <!--  Show only when "Others" selected -->
                  <v-col cols="12" md="3" v-if="paf.indication === 0">
                    <v-text-field
                      v-model="paf.other_indication"
                      label="Specify Indication"
                      variant="outlined"
                      density="compact"
                      class="field-required title-case-input"
                      :rules="[otherIndicationRule]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <h4 class="theme-subheader mt-6 pb-2">Dosage Strength</h4>
                <v-row>
                  <!-- LEFT SIDE : DRUG STRENGTH TABLE -->
                  <v-col cols="12" md="6">
                    <v-row
                      v-for="(dose, index) in dosageRows"
                      :key="index"
                      class="align-center"
                    >
                      <v-col :cols="dosageRows.length > 1 ? 5 : 6">
                        <v-select
                          label="Drug Strength"
                          :items="drugStrengthOptions"
                          item-title="capsule_strength"
                          item-value="capsule_strength"
                          v-model="dose.strength"
                          density="compact"
                          variant="outlined"
                          hide-details="auto"
                          class="field-required"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>

                      <v-col :cols="getCapsuleCols(dose)">
                        <v-select
                          :label="`${selectedDrugDataForm}s per Cycle`"
                          :items="capsuleOptionsWithOthers"
                          item-title="no_of_capsules"
                          item-value="no_of_capsules"
                          v-model="dose.capsules"
                          density="compact"
                          variant="outlined"
                          hide-details="auto"
                          class="field-required"
                          :rules="[rules.required]"
                          @update:modelValue="resetOtherCapsules(dose, $event)"
                        ></v-select>
                      </v-col>

                      <!-- Others Text Field -->
                      <v-col v-if="dose.capsules === 'Others'" :cols="2">
                        <v-text-field
                          v-model="dose.other_capsules"
                          :label="`${selectedDrugDataForm}s`"
                          variant="outlined"
                          density="compact"
                          class="field-required"
                          hide-details="auto"
                          :rules="[rules.required]"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          label="Supply Weeks per Cycle"
                          :items="supplyWeeksOptions"
                          item-title="no_of_cycle_weeks"
                          item-value="no_of_cycle_weeks"
                          v-model="paf.supply_weeks"
                          density="compact"
                          variant="outlined"
                          class="mb-4 field-required pr-1"
                          @update:modelValue="calculateTotal"
                          hide-details="auto"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          label="Number of Cycles"
                          :items="cycleOptions"
                          v-model="paf.cycles"
                          density="compact"
                          variant="outlined"
                          class="mb-4 field-required pr-1"
                          @update:modelValue="calculateTotal"
                          hide-details="auto"
                          :rules="[rules.required]"
                        ></v-select>
                      </v-col>
                      <v-col cols="2" class="text-center delete-box">
                        <v-btn
                          icon="mdi-delete"
                          variant="text"
                          color="red"
                          v-if="dosageRows.length > 1 && index > 0"
                          @click="removeDose(index)"
                        />
                      </v-col>
                    </v-row>

                    <v-btn
                      color="primary"
                      variant="outlined"
                      class="mt-2"
                      size="small"
                      @click="addDoseRow"
                      :disabled="!canAddDose"
                      v-if="
                        action_permissions.includes('ADD DRUG STRENGTH') &&
                        ![
                          '50mg - Thalidomide',
                          '100mg - Thalidomide Tablet',
                        ].includes(selectedDrugName)
                      "
                    >
                      Add Row
                      <v-icon class="ml-1">mdi-plus</v-icon>
                    </v-btn>
                  </v-col>

                  <!-- RIGHT SIDE : SUPPLY DETAILS -->
                  <v-col cols="12" md="6">
                    <v-row>
                      <v-col cols="12" md="6">
                        <!-- <v-text-field
                          label="Total Supply Prescribed"
                          v-model="totalSupply"
                          density="compact"
                          variant="outlined"
                          readonly
                          hide-details="auto"
                          class="field-required pr-1"
                        ></v-text-field> -->
                        <div class="custom-field plain-wrapper">
                          <label class="plain-label"
                            >Total Supply Prescribed</label
                          >
                          <div class="plain-value">
                            {{ totalSupply }}
                          </div>
                        </div>
                      </v-col>
                      <v-col
                        cols="12"
                        md="3"
                        class="ml-3"
                        v-if="dosageRows.length > 0"
                      >
                        <div class="capsule-circle" style="margin-top: -51px">
                          <div
                            class="circle-content"
                            v-for="(dose, index) in dosageRows"
                            :key="index"
                          >
                            <div class="mg-text">{{ dose.strength }}</div>
                            <div
                              class="capsule-text"
                              v-if="dose.capsules == 'Others'"
                            >
                              {{ dose.other_capsules }}
                            </div>
                            <div class="capsule-text" v-else>
                              {{ dose.capsules }} {{ selectedDrugDataForm }}s
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
                <!-- ================= CINICAL TRAIL CONFIRMATION ================= -->
                <v-row>
                  <v-col cols="3" md="3" class="pt-0 pb-0">
                    <v-checkbox
                      v-model="paf.is_clinical_trial"
                      class="mt-1 check"
                      color="primary"
                      label="Is clinical trial?"
                      hide-details="auto"
                    ></v-checkbox>
                  </v-col>
                  <v-col
                    cols="7"
                    md="7"
                    v-if="paf.is_clinical_trial"
                    class="pt-0 pb-0"
                  >
                    <v-text-field
                      density="compact"
                      hide-details="auto"
                      variant="outlined"
                      label="Enter Test note here.."
                      v-model="paf.clinical_test_note"
                      clearable
                      style="width: 668px"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- =================CINICAL TRAIL CONFIRMATION ================= -->
                <!-- ================= RISK CONFIRMATION ================= -->
                <v-checkbox
                  v-if="counsel_data?.note"
                  class="mt-1 check"
                  color="primary"
                  v-model="paf.risk_confirmed"
                  :label="counsel_data.note"
                  hide-details
                ></v-checkbox>
                <!-- ================= PRESCRIBER DECLARATION ================= -->
                <h4 class="theme-subheader mt-1">Prescriber Declaration</h4>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="custom-field plain-wrapper">
                      <label class="plain-label">Prescriber Name</label>
                      <div class="plain-value">
                        {{ prescriber.full_name }}
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div
                      class="custom-field plain-wrapper"
                      v-if="!isDOPEditable"
                    >
                      <label class="plain-label">Date of PAF</label>
                      <div class="plain-value dateeditbox" v-if="paf.date">
                        <span>
                          {{ formatDate(paf.date) }}
                        </span>
                        <v-chip
                          class="px-2 ml-1"
                          variant="tonal"
                          size="x-small"
                          color="primary"
                          @click="isDOPEditable = true"
                        >
                          Edit
                          <v-icon
                            size="x-small"
                            icon="mdi-pencil-outline"
                            end
                          ></v-icon>
                        </v-chip>
                      </div>
                    </div>
                    <div v-if="isDOPEditable">
                      <date-picker
                        v-model="paf.date"
                        label="Date of PAF"
                        :max="new Date().toISOString().slice(0, 10)"
                        :class_required="true"
                        :rules="[(v) => !!v || 'Date required']"
                        :clearable="false"
                      />
                    </div>
                  </v-col>
                </v-row>

                <v-checkbox
                  v-model="paf.declaration_confirmed"
                  :rules="[rules.checkRequired]"
                  class="mt-3 check"
                  color="primary"
                  hide-details="auto"
                  :label="confirm_text_obj?.paf_declaration"
                ></v-checkbox>
                <v-checkbox
                  v-if="showOffLabelCheckbox"
                  v-model="paf.ind_declaration_confirmed"
                  :rules="[rules.checkRequired]"
                  class="mt-3 check"
                  color="primary"
                  :label="offLabelText"
                  hide-details="auto"
                ></v-checkbox>
                <v-checkbox
                  v-if="showUnder18Checkbox"
                  v-model="paf.und18_declaration_confirmed"
                  :rules="[rules.checkRequired]"
                  class="mt-3 check"
                  color="primary"
                  :label="confirm_text_obj?.paf_under_18"
                  hide-details="auto"
                ></v-checkbox>
              </v-form>

              <!-- FOOTER -->

              <div class="step-footer">
                <mandatory-text />
                <v-btn
                  size="small"
                  class="btn-cancel"
                  color="cancel"
                  @click="goBack()"
                >
                  Cancel PAF
                </v-btn>
                <v-btn class="create-btn" @click="prevStep" size="small">
                  << Previous
                </v-btn>

                <v-btn class="create-btn" @click="goToReview" size="small">
                  Next >>
                </v-btn>
              </div>
            </v-stepper-window-item>

            <!-- STEP 5 -->
            <v-stepper-window-item value="5">
              <div class="paf-review">
                <!-- HEADER -->
                <div class="paf-header">
                  <v-row>
                    <v-col cols="12" md="2">
                      <div class="label">Patient ID</div>
                      <div class="value">
                        {{ paf.patient_id || "Awaiting Completion" }}
                      </div>
                    </v-col>

                    <v-col cols="12" md="2">
                      <div class="label">Patient Initials</div>
                      <div class="value">{{ paf.patient_initials }}</div>
                    </v-col>

                    <!-- <v-col cols="12" md="2">
                      <div class="label">Gender</div>
                      <div class="value">
                        {{ paf.patient_category == "M" ? "Male" : "Female" }}
                      </div>
                    </v-col> -->

                    <v-col cols="12" md="2">
                      <div class="label">Date of Birth</div>
                      <div class="value">{{ formatDate(paf.dob) }}</div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="label">Treating Hospital</div>
                      <div class="value">{{ paf.hospital }}</div>
                    </v-col>
                  </v-row>
                </div>

                <!-- PATIENT DETAILS -->
                <div class="section">
                  <h3>Patient Details</h3>

                  <v-row>
                    <v-col cols="12" md="3">
                      <div class="label">Patient Category</div>
                      <div class="value">
                        {{
                          patientCategories.find(
                            (c) => c.value == paf.patient_category
                          )?.label
                        }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="label">Indication</div>
                      <div class="value text-title-case">
                        <span v-if="paf.indication || paf.indication == 0">
                          {{
                            indicationOptions.find(
                              (i) => i.indication_id == paf.indication
                            )?.indication_name
                          }}<span v-if="paf.other_indication">
                            - {{ paf.other_indication }}</span
                          >
                        </span>
                        <span v-else>-</span>
                      </div>
                    </v-col>

                    <v-col
                      cols="12"
                      :md="paf.patient_category == 'WCBP' ? 2 : 3"
                    >
                      <div class="label">Drug</div>
                      <div class="value">
                        {{
                          prescriber_drugs.find(
                            (d) => d.drug.id == selectedDrug
                          )?.drug.drug_name
                        }}
                      </div>
                    </v-col>

                    <v-col
                      cols="12"
                      :md="paf.patient_category == 'WCBP' ? 2 : 3"
                    >
                      <div class="label">Date of PAF</div>
                      <div class="value">{{ formatDate(paf.date) }}</div>
                    </v-col>

                    <v-col
                      v-if="paf.patient_category == 'WCBP'"
                      cols="12"
                      md="2"
                    >
                      <div class="label">
                        Date of Last Negative Pregnancy Test
                      </div>
                      <div class="value">
                        {{ formatDate(paf.neg_preg_date) }}
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <!-- CONSENT -->
                <div
                  v-if="counsel_data?.note"
                  class="section consent-box mt-1 p-1"
                >
                  <v-checkbox
                    v-model="paf.risk_confirmed"
                    readonly
                    hide-details
                    class="check"
                    :label="counsel_data.note"
                  >
                  </v-checkbox>
                </div>

                <!-- PRESCRIPTION DETAILS -->
                <div class="section">
                  <v-row>
                    <v-col cols="8">
                      <v-row>
                        <v-col cols="12" md="6">
                          <div class="label">Dosage Strength</div>
                          <div class="value d-flex">
                            <div v-for="(dose, i) in dosageRows" :key="i">
                              {{ dose.strength
                              }}<span v-if="i < dosageRows.length - 1"
                                >,&nbsp;</span
                              >
                            </div>
                          </div>
                        </v-col>

                        <v-col cols="12" md="6">
                          <div class="label">Supply weeks per cycle</div>
                          <div class="value">{{ paf.supply_weeks }}</div>
                        </v-col>

                        <v-col cols="12" md="6">
                          <div class="label">Number of Cycles</div>
                          <div class="value">{{ paf.cycles }}</div>
                        </v-col>

                        <v-col cols="12" md="6">
                          <div class="label">Total Supply Prescribed</div>
                          <div class="value">{{ totalSupply }}</div>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="4">
                      <v-row class="pr-4 pt-2">
                        <v-table
                          density="compact"
                          class="summary-table"
                          v-if="dosageRows.length > 1"
                        >
                          <thead>
                            <tr>
                              <th>Dosage Strength</th>
                              <th>
                                Total {{ selectedDrugDataForm }}s Supplied
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr v-for="(dose, i) in dosageRows" :key="i">
                              <td>{{ dose.strength }}</td>
                              <td v-if="dose.capsules == 'Others'">
                                {{ dose.other_capsules }}
                              </td>
                              <td v-else>{{ dose.capsules }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                        <div class="capsule-circle" v-else>
                          <div
                            class="circle-content"
                            v-for="(dose, i) in dosageRows"
                            :key="i"
                          >
                            <div class="mg-text">{{ dose.strength }}</div>
                            <div
                              class="capsule-text"
                              v-if="dose.capsules == 'Others'"
                            >
                              {{ dose.other_capsules }}
                            </div>
                            <div class="capsule-text" v-else>
                              {{ dose.capsules }} {{ selectedDrugDataForm }}s
                            </div>
                          </div>
                        </div>
                      </v-row>
                    </v-col>
                  </v-row>
                </div>

                <!-- CAPSULE SUMMARY -->

                <!-- PRESCRIBER -->
                <div class="section">
                  <v-row>
                    <v-col cols="12" md="4">
                      <div class="label">Prescriber</div>
                      <div class="value">{{ prescriber.full_name }}</div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="label">Hospital Address</div>
                      <div class="value">{{ paf.hospital_address }}</div>
                    </v-col>
                  </v-row>
                </div>

                <!-- APPROVAL -->
                <!-- <div class="section">
                  <v-row>
                    <v-col cols="12" md="6">
                      <div class="label">Approved By</div>
                      <div class="value">
                        {{ paf.approved_by || "Awaiting approval" }}
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="label">Pharmacy Address</div>
                      <div class="value">{{ paf.hospital_address }}</div>
                    </v-col>
                  </v-row>
                </div> -->
                <div class="py-2">
                  <v-alert
                    v-if="nonConformances.length"
                    type="warning"
                    variant="tonal"
                    class="mb-4"
                  >
                    <strong>Non-compliance Detected</strong>

                    <ul class="mt-2">
                      <li
                        style="color: black"
                        v-for="(nc, i) in nonConformances"
                        :key="i"
                      >
                        {{ nc }}
                      </li>
                    </ul>
                  </v-alert>
                </div>

                <!-- FOOTER -->

                <div class="step-footer mt-2">
                  <v-btn
                    size="small"
                    class="btn-cancel"
                    color="cancel"
                    @click="goBack()"
                  >
                    Cancel PAF
                  </v-btn>
                  <v-btn
                    class="create-btn"
                    @click="
                      prevStep();
                      resetFlow();
                    "
                    size="small"
                  >
                    << Previous
                  </v-btn>
                  <!-- @click="successDialog = true" -->
                  <v-btn
                    color="success"
                    @click="CheckUserAuthorization()"
                    size="small"
                    :disabled="loader"
                    :loading="loader"
                  >
                    Submit
                  </v-btn>
                </div>
              </div>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-card>
      <v-dialog v-model="successDialog" width="520" persistent>
        <v-card class="success-dialog text-center pa-6">
          <!-- Success Icon -->
          <div class="success-icon-wrapper">
            <v-icon size="48" color="success">
              mdi-check-circle-outline
            </v-icon>
          </div>

          <!-- Title -->
          <v-card-title class="text-h6 font-weight-bold success-title">
            Prescription Authorisation Form
          </v-card-title>

          <!-- Description -->
          <v-card-text class="success-text">
            A copy of the prescription authorisation form will be available to
            the hospital inpatient pharmacy.
          </v-card-text>

          <!-- Divider -->
          <v-divider class="my-4"></v-divider>

          <!-- Actions -->
          <v-card-actions class="justify-center dialog-actions">
            <v-btn
              size="small"
              color="white"
              class="btn-cancel ma-1"
              @click="successDialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              class="status-approved mr-2"
              size="small"
              @click="completePAF"
              :disabled="loader"
              :loading="loader"
            >
              Complete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent v-model="patientDialog" max-width="750">
        <v-card elevation="3">
          <!-- Header + Search -->
          <v-card-title class="d-flex align-center gap-4">
            <span class="text-h6 font-medium">Select Existing Patient</span>

            <v-spacer></v-spacer>

            <v-text-field
              v-model="patientSearch"
              placeholder="Search here"
              density="compact"
              dense
              variant="outlined"
              clearable
              prepend-inner-icon="mdi-magnify"
              hide-details
              style="max-width: 240px"
            ></v-text-field>

            <v-btn icon variant="text" @click="patientDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-divider class="my-1"></v-divider>

          <!-- Patient Cards -->
          <v-card-text
            style="max-height: 450px; overflow-y: auto; padding: 16px"
          >
            <v-row dense>
              <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="patient in filteredPatients"
                :key="patient.id"
              >
                <v-card class="patient-card" @click="selectPatient(patient)">
                  <v-card-text class="py-3 px-4">
                    <!-- First row: Initials + DOB -->
                    <div class="d-flex justify-space-between align-center mb-1">
                      <div class="text-subtitle-2 font-semibold">
                        {{ patient.patient_initials }}
                      </div>

                      <div class="text-caption text-grey">
                        DOB: {{ formatDate(patient.patient_dob) }}
                      </div>
                    </div>

                    <!-- Second row: Patient number -->
                    <div class="text-body-2 font-medium">
                      <b>{{ patient.patient_no }}</b>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <div
                v-if="filteredPatients.length == 0"
                class="d-flex justify-center w-100"
              >
                <no-data-found text="No patients found" />
              </div>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="indicationWarningDialog" max-width="500" persistent>
        <v-card class="text-center pa-6">
          <div class="d-flex justify-end">
            <v-icon class="close-icon" @click="indicationWarningDialog = false">
              mdi-close
            </v-icon>
          </div>

          <div class="mx-auto mb-4">
            <v-icon size="40" color="warning">mdi-alert</v-icon>
          </div>

          <h3 class="mb-3">Indication Not Provided</h3>

          <p class="text-grey">
            You have not entered an indication for this prescription. Are you
            sure you want to continue?
          </p>

          <div class="d-flex justify-center mt-6">
            <v-btn
              size="small"
              class="btn-cancel"
              @click="closeIndicationWarning"
            >
              Cancel
            </v-btn>

            <v-btn
              size="small"
              color="warning"
              class="mx-3"
              @click="proceedWithoutIndication"
            >
              Continue
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <v-dialog v-model="nonConformancePopup" max-width="520" persistent>
        <v-card class="text-center pa-6">
          <!-- Close -->
          <!-- <div class="d-flex justify-end">
      <v-icon class="close-icon" @click="nonConformancePopup = false">
        mdi-close
      </v-icon>
    </div> -->

          <!-- Icon -->
          <div class="mx-auto mb-4">
            <v-icon size="40" color="warning"> mdi-alert </v-icon>
          </div>

          <!-- Title -->
          <h3 class="mb-3">Non-compliance Detected</h3>

          <!-- Description -->
          <p class="text-grey">
            This Prescription Authorisation Form contains one or more
            Non-compliances. The prescription may require additional review
            before approval.
          </p>

          <!-- Optional list -->
          <!-- <ul
      v-if="nonConformances.length"
      class="text-left mt-4 text-grey"
      style="max-width:420px;margin:auto;"
    >
      <li v-for="(nc,i) in nonConformances" :key="i">
        {{ nc }}
      </li>
    </ul> -->

          <!-- Divider -->
          <v-divider class="my-4"></v-divider>

          <!-- Actions -->

          <div class="d-flex justify-center mt-6">
            <v-btn
              size="small"
              class="btn-cancel"
              @click="
                prevStep();
                resetFlow();
              "
            >
              Cancel
            </v-btn>

            <v-btn
              size="small"
              color="warning"
              class="mx-3"
              @click="nonConformancePopup = false"
            >
              Continue
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
      <!-- Retrospective Entry Authentication Component Start -->
      <user-authentication
        :showauthentication="retrospectiveDialog"
        @update:showauthentication="retrospectiveDialog = $event"
        @cancelled="cancelRetrospective"
        dialogTitle="Retrospective Entry"
        dialogDesc="You selected a past date. Please enter your password to confirm."
      />
      <!-- Retrospective Entry Authentication Component end -->

      <v-dialog v-model="riskConfirmDialog" max-width="500" persistent>
        <v-card class="text-center pa-6">
          <div class="d-flex justify-end">
            <v-icon class="close-icon" @click="closeRiskConfirm">
              mdi-close
            </v-icon>
          </div>

          <div class="mx-auto mb-4">
            <v-icon size="40" color="warning">mdi-alert</v-icon>
          </div>

          <h3 class="mb-3">Risk Confirmation Required</h3>

          <p class="text-grey">
            You have not confirmed the risk acknowledgement for this patient.
            Are you sure you want to continue?
          </p>

          <div class="d-flex justify-center mt-6">
            <v-btn size="small" class="btn-cancel" @click="closeRiskConfirm">
              Cancel
            </v-btn>

            <v-btn
              size="small"
              color="warning"
              class="mx-3"
              @click="proceedWithoutRiskConfirm"
            >
              Continue
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="offLabelDialog" max-width="500" persistent>
        <v-card class="text-center pa-6">
          <!-- Close -->
          <div class="d-flex justify-end">
            <v-icon class="close-icon" @click="offLabelDialog = false">
              mdi-close
            </v-icon>
          </div>

          <!-- Icon -->
          <div class="mx-auto mb-4">
            <v-icon size="40" color="warning">mdi-alert</v-icon>
          </div>

          <!-- Title -->
          <h3 class="mb-3">Off-label Use Detected</h3>

          <!-- Description -->
          <p class="text-grey">
            This prescription is considered off-label for the following
            reason(s):
          </p>

          <!-- Reasons list -->
          <ul
            v-if="offLabelReasons.length"
            class="text-left mt-4 text-grey"
            style="max-width: 420px; margin: auto"
          >
            <li v-for="(r, i) in offLabelReasons" :key="i">
              {{ r.message }}
            </li>
          </ul>

          <!-- Actions -->
          <div class="d-flex justify-center mt-6">
            <v-btn
              size="small"
              class="btn-cancel"
              @click="offLabelDialog = false"
            >
              Cancel
            </v-btn>

            <v-btn
              size="small"
              color="warning"
              class="mx-3"
              @click="proceedAfterOffLabel"
            >
              Continue
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
        dialogTitle="Non-Compliance Authorization"
        dialogDesc="Please Enter your Password to Confirm"
      />
      <!-- User Authentication Component Start -->
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      selectedDrugDataForm: "",
      successDialog: false,
      baseUrl: import.meta.env.VITE_IMAGE_PATH + "/storage/",
      user: {},
      today: new Date().toISOString().slice(0, 10),

      loader: false,
      dialogTitle: "",
      dialogMessage: "",

      step: "1",

      google_icon: {
        icon_name: "description",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      prescriber: {},

      prescriber_drugs: [],
      selectedDrug: null,
      drugFormValid: false,

      rafOptions: [],

      selectedRAF: null,
      rafConfirmed: false,
      rafFormValid: false,

      pafFormValid: false,

      paf: {
        patient_id: null,
        patient_category: "",
        dob: null,
        patient_initials: "",
        hospital: "",
        hospital_address: "",
        indication: null,
        other_indication: "",
        institution_id: null,
        drug_id: null,
        supply_weeks: null,
        cycles: null,
        risk_confirmed: false,
        declaration_confirmed: false,
        ind_declaration_confirmed: false,
        und18_declaration_confirmed: false,
        date: null,
        neg_preg_date: null,
        renewal: 0,
        renewal_paf_parent_id: null,
        paf_no: null,
        is_retrospective: 0,
        is_clinical_trial: false,
        clinical_test_note: "",
      },

      indicationOptions: [],

      supplyWeeksOptions: [],

      cycleOptions: ["1 Cycle", "2 Cycles", "3 Cycles", "4 Cycles"],

      capsuleOptions: [],

      drugStrengthOptions: [],

      dosageRows: [
        {
          strength: null,
          other_capsules: null,
          capsules: null,
        },
      ],

      totalSupply: "-",

      patientCategories: [
        {
          label: "Male",
          value: "M",
        },
        {
          label: "Woman of Childbearing Potential",
          value: "WCBP",
        },
        {
          label: "Woman of Non-Childbearing Potential",
          value: "WNCBP",
        },
      ],

      patientList: [],
      patientDialog: false,
      patientLoading: false,
      debounceTimer: null,
      patientSearch: "",

      indicationWarningDialog: false,
      is_other_indc: 0,

      nonConformances: [],
      nonConformancePopup: false,

      showAlert: false,
      alertMessage: "",
      confirmText: "",
      confirmType: "",
      isDOPEditable: false,

      retrospectiveDialog: false,
      showPassword: false,
      counsel_data: {},
      riskConfirmDialog: false,
      action_permissions: [],
      offLabelDialog: false,
      offLabelReasons: [],
      flowState: {
        riskHandled: false,
        indicationHandled: false,
        offLabelHandled: false,
      },
      authflag: false,
      confirm_text_obj: {
        paf_declaration: null,
        paf_under_18: null,
        paf_off_label_use: null,
      },
    };
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(query) {
        if (query.renew == 1 && query.paf_id && query.paf_no) {
          this.paf.paf_no = query.paf_no;
          this.handleRenew(query.paf_id);
        }
        if (query.step_value) {
          this.step = "2";
        }
      },
    },

    "paf.date"(newDate, oldDate) {
      if (!newDate || newDate === oldDate) return;

      if (newDate === this.today) {
        this.paf.is_retrospective = 0;
        return;
      }
      this.retrospectiveDialog = true;
    },
  },

  mounted() {
    if (JSON.parse(localStorage.getItem("user_data"))) {
      this.user = JSON.parse(localStorage.getItem("user_data"));
    }
    this.action_permissions = JSON.parse(
      localStorage.getItem("action_permissions")
    );
    this.sel_institution = JSON.parse(localStorage.getItem("sel_inst"));
    this.fetchPrescriberData();
    this.fetchPrescriberDrugs();

    this.paf.date = this.today;
    this.fetchConfirmationArray();
  },

  computed: {
    confirmationTypes() {
      const types = [];
      if (this.paf.declaration_confirmed) {
        types.push("PAF_DECLARATION");
      }

      if (this.showOffLabelCheckbox && this.paf.ind_declaration_confirmed) {
        types.push("PAF_OFF_LABEL_USE");
      }

      if (this.showUnder18Checkbox && this.paf.und18_declaration_confirmed) {
        types.push("PAF_UNDER_18");
      }

      return types;
    },
    maxPregDate() {
      if (this.paf.date) {
        return this.formatDate(this.paf.date);
      }
      return this.formatDate(new Date());
    },
    capsuleOptionsWithOthers() {
      return [...this.capsuleOptions, { no_of_capsules: "Others" }];
    },
    selectedDrugName() {
      return (
        this.prescriber_drugs.find((d) => d.drug.id === this.selectedDrug)?.drug
          .drug_name || ""
      );
    },
    patientAge() {
      if (!this.paf.dob) return null;

      const dob = new Date(this.paf.dob);
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      return age;
    },
    showOffLabelCheckbox() {
      return this.paf.indication === 0;
    },

    showUnder18Checkbox() {
      return this.patientAge !== null && this.patientAge < 18;
    },

    offLabelText() {
      const drugName =
        this.prescriber_drugs.find((d) => d.drug.id === this.selectedDrug)?.drug
          .drug_name || "this product";

      const indication = this.paf.other_indication || "";

      const template = this.confirm_text_obj?.paf_off_label_use || "";

      return template
        .replace("${drugName}", drugName)
        .replace("${indication}", indication);
    },
    filteredPatients() {
      if (!this.patientSearch) return this.patientList;

      const search = this.patientSearch.toLowerCase();

      return this.patientList.filter(
        (p) =>
          p.patient_initials.toLowerCase().includes(search) ||
          (p.patient_no && p.patient_no.toLowerCase().includes(search))
      );
    },
    rules() {
      return {
        required: (v) =>
          (v !== null && v !== undefined && v !== "") || "Required",
        initialsLength: (v) =>
          (v && v.length >= 2 && v.length <= 3) ||
          "Initials must be 2 to 3 characters",
        date: (v) => /^\d{2}-\d{2}-\d{4}$/.test(v) || "Date must be DD-MM-YYYY",
        doseRequired: (v) => !!v || "Required",
        confirmRequired: (v) => !!v || "You must confirm the RAF completion",
        checkRequired: (v) => !!v || "You must agree before proceeding.",
      };
    },

    canAddDose() {
      const lastRow = this.dosageRows[this.dosageRows.length - 1];
      return lastRow?.strength && lastRow?.capsules;
    },
    otherIndicationRule() {
      return (v) => {
        // Only validate when "Others" selected
        if (this.paf.indication === 0) {
          return !!v || "Please specify indication";
        }
        return true;
      };
    },
  },

  methods: {
    fetchConfirmationArray() {
      this.loader = true;

      this.$axios
        .get("fetch_confirmation_text_by_type", {
          params: {
            types: ["PAF_DECLARATION", "PAF_UNDER_18", "PAF_OFF_LABEL_USE"],
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.confirm_text_obj = {
              paf_declaration: res.data.confirm_text_obj?.paf_declaration,
              paf_under_18: res.data.confirm_text_obj?.paf_under_18,
              paf_off_label_use: res.data.confirm_text_obj?.paf_off_label_use,
            };
          }

          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },
    goToMyprofile() {
      this.$router.push({
        name: "view-my-profile",
        query: {
          slug: this.user.slug,
          inst_id: this.sel_institution.id,
          from: "paf",
        },
      });
    },
    getCapsuleCols(dose) {
      const base = this.dosageRows.length > 1 ? 5 : 6;
      return dose.capsules === "Others" ? base - 2 : base;
    },
    cancelRetrospective() {
      this.retrospectiveDialog = false;

      this.paf.date = this.today;
      this.paf.is_retrospective = 0;
    },
    closeIndicationWarning() {
      this.indicationWarningDialog = false;
      this.loader = false;
    },
    async checkExistingActivePaf() {
      try {
        this.loader = true;
        const res = await this.$axios.post("check_existing_active_paf", {
          patient_initials: this.paf.patient_initials,
          dob: this.paf.dob,
          patient_category: this.paf.patient_category,
          institution_id: this.paf.institution_id,
        });

        if (res.data.exists) {
          this.alertMessage = res.data.message;
          this.confirmText = "OK";
          this.confirmType = "warning";
          this.showAlert = true;
          this.loader = false;
          return true;
        }

        return false;
      } catch (e) {
        console.error(e);
        this.$toast.error("Failed to verify existing prescriptions");
        return true;
      }
    },
    resetOtherIndication(val) {
      if (val == 0) {
        this.is_other_indc = 1;
      } else {
        this.is_other_indc = 0;
      }

      this.paf.other_indication = null;
    },

    proceedWithoutIndication() {
      this.indicationWarningDialog = false;

      this.flowState.indicationHandled = true;

      this.handleReviewFlow();
    },

    async CheckUserAuthorization() {
      try {
        this.loader = true;

        // Open auth popup only when more than 1 non-conformance exists
        if (this.nonConformances.length >= 1) {
          this.authflag = true;
        } else {
          this.successDialog = true;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loader = false;
      }
    },
    handleLeadCancelled() {
      this.successDialog = false;
    },

    // Called when password verified successfully
    handleLeadConfirmed() {
      this.$toast.success("User verified successfully.");
      this.successDialog = true;
      this.authflag = false;
    },

    submitApproveForm() {
      if (!this.paf.indication) {
        this.indicationWarningDialog = true;
        return;
      }

      this.finishConfirmationDialog = true;
    },

    async handleRenew(paf_id) {
      this.loader = true;

      try {
        const res = await this.$axios.get("get_paf_by_details_id", {
          params: { paf_id },
        });

        const data = res.data.paf_details;

        if (!data) {
          this.$toast.error("Invalid PAF data");
          return;
        }

        // BASIC DETAILS
        this.selectedDrug = data.drug?.id;

        this.paf = {
          ...this.paf,
          patient_id: data.header?.patient_no,
          patient_category: data.patient_category,
          dob: data.patient_dob,
          patient_initials: data.patient_initials,
          hospital: data.header?.hospital,
          hospital_address: data.header?.address,
          indication: data.indication?.id,
          other_indication: data.other_indication,
          supply_weeks: data.supply_weeks,
          cycles: data.cycles,
          neg_preg_date: data.neg_preg_date,
          renewal: 1,
          renewal_paf_parent_id: paf_id,
        };

        // DOSAGE
        this.dosageRows = data.drug_cycles?.length
          ? data.drug_cycles.map((d) => ({
              strength: d.drug_strength,
              capsules: d.cap_per_cycle,
            }))
          : [{ strength: null, capsules: null }];

        // SUPPLY + CYCLES
        if (data.drug_cycles?.length) {
          const first = data.drug_cycles[0];

          this.paf.supply_weeks = first.supply_weeks;
          this.paf.cycles = first.no_of_cycles;
        }

        await this.fetchDrugDetails();

        this.calculateTotal();
      } catch (e) {
        console.error(e);
        this.$toast.error("Failed to load renewal data");
      }

      this.loader = false;
    },

    onInitialsInput() {
      this.patientLoading = true;
      this.paf.patient_id = null;

      const value = this.paf.patient_initials;
      const formatted = this.formatInitials(value);

      if (formatted !== value) {
        this.paf.patient_initials = formatted;
      }

      clearTimeout(this.debounceTimer);

      if (!formatted || formatted.length < 2) {
        this.patientDialog = false;
        this.patientLoading = false;
        return;
      }

      this.debounceTimer = setTimeout(() => {
        this.fetchPatients(formatted);
      }, 500);
      this.patientLoading = false;
    },

    formatInitials(value) {
      if (!value) return "";

      return value
        .replace(/[^A-Za-z]/g, "")
        .toUpperCase()
        .slice(0, 3);
    },

    async fetchPatients(initials) {
      if (!this.paf.patient_category) return;

      this.patientLoading = true;

      try {
        const res = await this.$axios.get("fetch_patient_initials", {
          params: {
            patient_category: this.paf.patient_category,
            initials: initials,
            hospital_id: this.paf.institution_id,
            patient_dob: this.paf.dob,
          },
        });

        this.patientList = res.data.data || [];

        if (this.patientList.length > 0) {
          this.patientDialog = true;
        }
      } catch (e) {
        console.error(e);
      }

      this.patientLoading = false;
    },

    selectPatient(patient) {
      this.paf.patient_initials = patient.patient_initials;
      this.paf.dob = patient.patient_dob;
      this.paf.patient_id = patient.patient_no;

      this.patientDialog = false;
    },

    goBack() {
      this.$router.push({ name: "paf_report" });
    },
    completePAF() {
      const payload = {
        ...this.paf,
        confirmation_types: this.confirmationTypes,
        drug_id: this.selectedDrug,
        dosage: this.dosageRows.map((d) => ({
          ...d,
          capsules: d.capsules === "Others" ? d.other_capsules : d.capsules,
        })),
        total_supply: this.totalSupply,
        gender: this.paf.patient_category == "M" ? "Male" : "Female",
        is_other_indc: this.is_other_indc,
      };

      this.loader = true;

      this.$axios
        .post("create_paf", payload)
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success("PAF created successfully");
            this.$router.push({ name: "paf_report" });
          } else {
            this.$toast.error(res.data.message);
          }
          this.loader = false;
        })
        .catch(() => {
          this.loader = false;
          this.$toast.error("Something went wrong");
        });
    },
    async handleReviewFlow() {
      // 1. Validate form
      const { valid } = await this.$refs.pafForm.validate();
      if (!valid) {
        this.$toast.error("Please fill all mandatory fields");
        return;
      }

      // 2. Existing PAF (always first)
      const exists = await this.checkExistingActivePaf();
      if (exists) return;

      // 3. Risk Confirmation (BLOCK until handled)
      if (
        this.counsel_data?.note &&
        !this.paf.risk_confirmed &&
        !this.flowState.riskHandled
      ) {
        this.riskConfirmDialog = true;
        return;
      }

      // 4. Indication (STRICT – no bypass)
      if (!this.paf.indication && !this.flowState.indicationHandled) {
        this.indicationWarningDialog = true;
        return;
      }

      // 5. Off-label check (only once)
      if (!this.flowState.offLabelHandled) {
        await this.checkOffLabelBeforeProceed();
        return;
      }

      // 6. Final step
      this.validateConformance();
    },
    async goToReview() {
      this.handleReviewFlow();
    },

    proceedAfterOffLabel() {
      this.offLabelDialog = false;

      this.flowState.offLabelHandled = true;

      this.handleReviewFlow();
    },

    resetFlow() {
      this.flowState = {
        riskHandled: false,
        indicationHandled: false,
        offLabelHandled: false,
      };
    },

    async checkOffLabelBeforeProceed() {
      const payload = {
        ...this.paf,
        drug_id: this.selectedDrug,
        dosage: this.dosageRows.map((d) => ({
          ...d,
          capsules: d.capsules === "Others" ? d.other_capsules : d.capsules,
        })),
        total_supply: this.totalSupply,
        gender: this.paf.patient_category == "M" ? "Male" : "Female",
        is_other_indc: this.is_other_indc,
      };

      this.loader = true;

      try {
        const res = await this.$axios.post("check_off_label_reasons", payload);

        this.loader = false;
        this.offLabelReasons = [];
        if (res.data.reasons && res.data.reasons.length > 0) {
          this.offLabelReasons = res.data.reasons;
          this.offLabelDialog = true;
        } else {
          this.validateConformance();
        }
      } catch (e) {
        this.loader = false;
        this.$toast.error("Failed to check off-label rules");
      }
    },

    async validateConformance() {
      const payload = {
        ...this.paf,
        drug_id: this.selectedDrug,
        dosage: this.dosageRows.map((d) => ({
          ...d,
          capsules: d.capsules === "Others" ? d.other_capsules : d.capsules,
        })),
        total_supply: this.totalSupply,
        gender: this.paf.patient_category == "M" ? "Male" : "Female",
        is_other_indc: this.is_other_indc,
      };

      this.loader = true;

      const res = await this.$axios.post("validate_paf_conformance", payload);

      this.loader = false;

      if (res.data.has_nc) {
        this.nonConformances = res.data.non_conformances;
        this.nonConformancePopup = true;
      } else {
        this.nonConformances = [];
      }

      this.step = "5";
    },
    fetchDrugDetails() {
      this.loader = true;
      this.$axios
        .get("fetch_drug_details", {
          params: {
            drug_id: this.selectedDrug,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.indicationOptions = res.data.drug_indications;
            // added "Others" object by raghavendra
            this.indicationOptions.push({
              id: 0,
              indication_id: 0,
              indication_name: "Other",
            });
            // added "Others" object by raghavendra
            this.drugStrengthOptions = res.data.drug_strength;
            this.supplyWeeksOptions = res.data.drug_cycles;
            this.capsuleOptions = res.data.drug_capsules;
          } else {
            this.$toast.error(res.data.message);
          }
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    fetchConfirmations() {
      this.loader = true;
      this.$axios
        .get("get_confirmation_text", {
          params: {
            drug_id: this.selectedDrug,
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
    addDoseRow() {
      this.dosageRows.push({
        strength: null,
        capsules: null,
        other_capsules: null,
      });
    },

    removeDose(index) {
      this.dosageRows.splice(index, 1);
      this.calculateTotal();
    },

    calculateTotal() {
      const cycles = parseInt(this.paf.cycles) || 0;
      const supplyWeeks = parseInt(this.paf.supply_weeks) || 0;

      const totalWeeks = cycles * supplyWeeks;

      // Correct singular/plural
      this.totalSupply = `${totalWeeks} week${totalWeeks === 1 ? "" : "s"}`;
    },

    async fetchPrescriberDrugs() {
      try {
        const res = await this.$axios.get("get_prescriber_drugs", {
          params: {
            user_id: this.user.id,
            institution_id: this.sel_institution.institution_id,
          },
        });

        this.prescriber_drugs = res.data.prescriber_drugs || [];
      } catch (error) {
        console.error("Failed to load drugs", error);

        // Fallback: still update with empty strings if error occurs
        // this.paf.hospital = "";
        // this.paf.hospital_address = "";
      }
    },
    goToProfile() {
      this.$router.push({
        name: "view-my-profile",
        query: {
          slug: this.user.slug,
          from: "paf",
        },
      });
    },
    fetchPrescriberData() {
      this.loader = true;
      this.$axios
        .get("fetch_prescriber_data", {
          params: {
            user_id: this.user.id,
          },
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.prescriber = res.data.prescriber;
            this.prescriber = res.data.prescriber;
            this.paf.institution_id = this.sel_institution.institution_id;
            this.paf.hospital = this.sel_institution.institution_data.name;
            this.paf.hospital_address =
              this.sel_institution.institution_data.address;
            // Commented this by raghavendra to pass the selected institution values
            // this.paf.institution_id =
            //   res.data?.prescriber?.prescriber_data?.institution_data?.id ?? "";
            // this.paf.hospital =
            //   res.data?.prescriber?.prescriber_data?.institution_data?.name ??
            //   "";
            // this.paf.hospital_address =
            //   res.data?.prescriber?.prescriber_data?.institution_data
            //     ?.address ?? "";

            // Commented this by raghavendra to pass the selected institution values
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },

    validatePAFStep() {
      const valid = this.$refs.pafForm.validate();

      if (valid) {
        this.nextStep();
      }
    },

    validateRAFStep() {
      const valid = this.$refs.rafForm.validate();

      if (valid) {
        this.nextStep();
      }
    },

    validateDrugStep() {
      const valid = this.$refs.drugForm.validate();

      if (valid) {
        this.nextStep();
      }
      this.fetchRAFDocs();
    },

    nextStep() {
      const next = parseInt(this.step) + 1;
      if (next <= 5) this.step = next.toString();
    },

    prevStep() {
      const prev = parseInt(this.step) - 1;
      if (prev >= 1) this.step = prev.toString();
      this.nonConformancePopup = false;
    },
    fetchRAFDocs() {
      this.rafOptions = [];
      this.loader = true;
      this.$axios
        .get("fetch_raf_documents", {
          params: {
            drug_id: this.selectedDrug,
            patient_category: this.paf.patient_category,
          },
        })
        .then((res) => {
          if (res.data.documents) {
            this.rafOptions = res.data.documents;
          }
          this.loader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.loader = false;
        });
    },

    proceedWithoutRiskConfirm() {
      this.riskConfirmDialog = false;

      this.flowState.riskHandled = true;

      this.handleReviewFlow();
    },
    closeRiskConfirm() {
      this.riskConfirmDialog = false;
      this.loader = false;
    },
    resetOtherCapsules(dose, val) {
      if (val === "Others") {
        dose.other_capsules = null;
      } else {
        dose.other_capsules = null;
      }

      this.calculateTotal();
    },
    storeDrugData(drug) {
      this.selectedDrug = drug.drug.id;
      this.selectedDrugDataForm = drug.drug.drug_form;
    },
  },
};
</script>

<style scoped>
.step-title {
  font-size: 22px;
  font-weight: 600;
}

.step-description {
  font-size: 14px;
  color: #6b7280;
  max-width: 900px;
}

.section-title {
  margin-top: 25px;
}

.info-label {
  font-size: 12px;
  color: #0b7285;
  font-weight: 600;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
}

.step-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin: 5px;
}

.begin-btn {
  padding-left: 28px;
  padding-right: 28px;
}

.raf-instructions {
  color: #6b7280;
  font-size: 14px;
  padding-left: 18px;
}

.raf-card {
  /* cursor: pointer; */
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  min-height: 100px;
}

/* .raf-card:hover {
  border-color: #0b7285;
} */

.raf-selected {
  border: 2px solid #0b7285;
}

.raf-title {
  font-weight: 600;
  font-size: 15px;
}

.raf-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.category-radio {
  background: #a8c2d8;
  border-radius: 25px;
  padding: 14px 20px;
  margin-bottom: 14px;
}

.category-radio :deep(.v-label) {
  font-weight: 500;
}

.custom-field {
  margin-top: -2px;
}
.custom-field :deep(.v-field) {
  border-radius: 2px !important;
  background: white;
}

.custom-field :deep(.v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.plain-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2px 12px;
  background: #f4f4f4 !important;
  border-radius: 12px;
}

.plain-label {
  font-size: 12px;
  padding: 2px 0px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.plain-value {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
}
/* .v-card{
  padding: 0px !important;
}
.v-sheet .v-window{
  background: #f4f4f4 !important;
} */

.paf-review {
  background: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* HEADER BAR */

.paf-header {
  background: #f3f4f6;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
}

/* SECTIONS */

.section {
  margin-top: 20px;
}

.section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

/* LABEL + VALUE */

.label {
  font-size: 12px;
  color: #6b7280;
}

.value {
  font-size: 14px;
  font-weight: 500;
  margin-top: 3px;
}

/* CONSENT */

.consent-box {
  border: 1px solid #e5e7eb;
  padding: 12px;
  border-radius: 6px;
  background: #fafafa;
  pointer-events: none;
}

/* SUMMARY TABLE */

.summary-table {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.summary-table td {
  padding: 10px;
}

/* FOOTER */

.review-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.drug-chip,
.category-chip {
  padding: 18px 28px;
  font-size: 14px;
  border-radius: 28px;
  background-color: #fff0;
  cursor: pointer;
  color: #0b7285;
  transition: all 0.25s ease;
  border: 1px solid #e5e7eb;
}

.chip-selected {
  background: #0b7285 !important;
  color: #fff !important;
  border-color: #0b7285;
}
.chip-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.drug-chip,
.category-chip {
  width: 100%;
  justify-content: center;
  padding: 20px;
  font-size: 15px;
  border-radius: 30px;
  background-color: #fff0;
  border: 1px solid #0b7285;
  cursor: pointer;
  transition: all 0.25s ease;
}

.drug-chip:hover,
.category-chip:hover {
  border-color: #0b7285;
  color: #ffffff;
  background: #0b7285 !important;
}
:deep(.v-chip--variant-tonal .v-chip__underlay) {
  background-color: #fff !important;
}

.chip-selected {
  background: #0b7285;
  color: white;
  border-color: #0b7285;
}

/* RAF CARD */

.raf-card {
  position: relative;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  transition: all 0.25s ease;
  overflow: hidden;
  height: 200px;
}

.raf-card:hover {
  transform: translateY(-4px);
  border-color: #0b7285;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

/* CARD CONTENT */

.raf-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 26px 20px;
}

/* TITLE */

.raf-title {
  font-weight: 600;
  font-size: 15px;
  color: #1f2937;
  margin-bottom: 4px;
}

.raf-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* DOWNLOAD BUTTON */

.raf-download-btn {
  border-radius: 20px;
  font-size: 13px;
}

/* RIBBON */

.raf-ribbon {
  position: absolute;
  top: 12px;
  left: -36px;
  background: #0b7285;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 40px;
  transform: rotate(-45deg);
  letter-spacing: 0.5px;
}

/* Dialog Card */

.success-dialog {
  border-radius: 14px;
  max-width: 540px;
}

/* Icon Wrapper */

.success-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.success-icon-wrapper .mdi-check-circle-outline {
  font-size: 60px !important;
}

/* Title */

.success-title {
  color: #0b7285;
  text-align: center;
}

/* Text */

.success-text {
  font-size: 14px;
  color: #6b7280;
  max-width: 380px;
  margin: 0 auto;
}

/* Actions */

.dialog-actions {
  gap: 10px;
}
.raf-cool-card {
  position: relative;
  height: 220px;
  border-radius: 18px;
  overflow: hidden;
  background: #f8fbfb;
  border: 1px solid #e5e7eb;
  transition: all 0.25s ease;
}

/* CONTENT */

.raf-content {
  text-align: center;
  padding-top: 30px;
  position: relative;
  z-index: 2;
}

/* ICON */

.raf-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0b7285, #7dc5c0);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 10px;
}

/* TITLE */

.raf-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.raf-subtitle {
  font-size: 13px;
  color: #6b7280;
}

/* TOP RIGHT WAVE */

.raf-wave-top {
  position: absolute;
  top: 0;
  right: 0;
  width: 160px;
  height: 90px;
}

.raf-wave-top path {
  fill: #d6f0ef;
}

/* BOTTOM ACCENT WAVE */

.raf-bottom-accent {
  position: absolute;
  bottom: -8px;
  width: 100%;
  height: 60px;
}

.raf-bottom-accent path {
  fill: #e6f7f6;
}

.patient-card {
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.patient-card:hover {
  background: #f0f4f8;
  border-color: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
}

.chip-disabled {
  pointer-events: none;
  opacity: 0.6;
  cursor: not-allowed;
}
/* If using scoped style */
::v-deep(.title-case-input input) {
  text-transform: capitalize;
}

.dateeditbox {
  display: flex;
  justify-content: space-between;
}

.delete-box {
  display: flex;
  justify-content: start;
  padding: 0px 0px;
}

.sel_option {
  font-size: 14px;
  color: gray;
}
.check :deep(.v-label.v-label--clickable) {
  pointer-events: none !important;
}
.previous-btn {
  background-color: #0b7285;
}
.capsule-circle {
  width: 160px;
  height: 160px;
  border: 18px solid #49a88a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.circle-content {
  text-align: center;
  color: #49a88a;
}

.circle-content h2 {
  margin: 0;
  font-size: 42px;
  font-weight: 700;
  line-height: 1;
}

.circle-content p {
  margin: 8px 0 0;
  font-size: 20px;
  font-weight: 600;
}
</style>
