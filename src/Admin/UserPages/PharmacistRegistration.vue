<template>
  <div class="register-page pa-0">
    <!-- --{{ wholesalers }} -->
    <content-loader v-if="loading"></content-loader>
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    />
    <!-- Progress Header -->
    <div class="progress-wrapper">
      <div class="progress-content">
        <span>Progress</span>
        <v-progress-linear
          :model-value="progress"
          height="6"
          stream
          class="progress"
        ></v-progress-linear>
        <span>Complete</span>
      </div>
    </div>

    <div>
      <div class="content-wrapper">
        <v-card class="form-card" elevation="0">
          <v-form ref="formRef" v-model="isFormValid">
            <!-- HEADER -->
            <div class="form-header">
              <span class="theme-header"
                >Pharmacist/Pharmacy Technician Registration Form</span
              >

              <div class="header-actions">
                <v-btn
                  v-if="step == 1 && !fromPage"
                  size="small"
                  variant="outlined"
                  class="btn-outline"
                  @click="returnToSelection()"
                >
                  ← Return to selection
                </v-btn>
                <v-btn
                  v-if="step == 1 && fromPage"
                  size="small"
                  variant="outlined"
                  class="btn-outline"
                  @click="returnToMyProfile()"
                >
                  ← Return to My Profile
                </v-btn>

                <!-- <v-btn size="small" class="btn-filled theme-bg">
                  Pharmacist
                </v-btn> -->
              </div>
            </div>

            <!-- ================= STEP 1 ================= -->
            <div v-if="step === 1">
              <!-- Pharmacist Details -->
              <h6 class="section-title mt-5 mb-6">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader mb-2">
                    Pharmacist/Pharmacy Technician Details
                  </span>
                </div>
              </h6>

              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    hide-details="auto"
                    v-model="form.name"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Pharmacist (or appointed deputy) First Name"
                    class="custom-field field-required"
                    maxlength="30"
                    :disabled="fromPage"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    hide-details="auto"
                    v-model="form.lastname"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Pharmacist (or appointed deputy) Last Name"
                    class="custom-field field-required"
                    maxlength="30"
                    counter
                    :disabled="fromPage"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    hide-details="auto"
                    v-model="form.reg_no"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="GPhC / PSNI Registration Number"
                    class="custom-field field-required"
                    hint="This should be your professional body registration number"
                    persistent-hint="true"
                    maxlength="30"
                    counter
                    :disabled="fromPage"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    hide-details="auto"
                    v-model="form.institution_type"
                    :items="filteredInstitutionTypes"
                    item-title="longname"
                    item-value="shortname"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Institution Type"
                    class="custom-field field-required"
                    @update:modelValue="fetchInstitutionList"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    hide-details="auto"
                    v-model="form.phone_no"
                    :rules="phoneRules"
                    density="compact"
                    variant="outlined"
                    label="Phone Number"
                    class="custom-field"
                    type="tel"
                    inputmode="numeric"
                    maxlength="11"
                    counter
                    @input="formatPhone"
                    :disabled="fromPage"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-autocomplete
                    hide-details="auto"
                    :disabled="!form.institution_type"
                    v-model="form.institution_id"
                    :loading="institutionsLoading"
                    :items="institutions"
                    item-title="name"
                    item-value="id"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Institution Name"
                    class="custom-field field-required"
                    @update:modelValue="populateAddress"
                  />
                </v-col>
              </v-row>

              <!-- Role -->
              <v-row dense class="mb-3">
                <v-col cols="12" md="6">
                  <!-- <p class="mb-2">
                    Are you a Lead Pharmacist?
                  </p> -->
                  <v-row dense>
                    <!-- <v-checkbox
                      v-model="form.role"
                      label="Lead Pharmacist"
                      value="Lead Pharmacist"
                      hide-details
                      class="pr-3 check"
                      color="#05668d"
                      @update:model-value="roleError = false"
                    />
                    <v-checkbox
                      v-model="form.role"
                      label="Pharmacist"
                      value="Pharmacist"
                      hide-details
                      color="#05668d"
                      class="check"
                      @update:model-value="roleError = false"
                    /> -->
                    <v-checkbox
                      v-model="isLeadPharmacist"
                      label="If you are the nominated responsible pharmacist/Pharmacy Technician for this location, please confirm by checking this box?"
                      hide-details
                      class="pr-3 check"
                      color="#05668d"
                      :disabled="!form.institution_id"
                      @update:model-value="updateRole"
                    />
                  </v-row>

                  <div v-if="roleError" class="required-text">
                    At least one role type is required
                  </div>
                </v-col>

                <v-col cols="12" md="6">
                  <div>
                    <strong>Note:</strong>
                    If the institution you require does not appear in the drop
                    down menu, please contact
                    <a href="mailto:support@gmail.com"> support@gmail.com </a>
                  </div>
                </v-col>
              </v-row>

              <!-- Addresses -->

              <!-- <v-col cols="12" md="6" v-if="form.institution_id"> -->
              <div class="custom-field plain-wrapper mb-4">
                <label class="plain-label">Dispensing Pharmacy Address</label>
                <div class="plain-value">
                  {{ form.dispensing_address }}
                </div>
              </div>
              <!-- </v-col> -->
              <!-- <v-text-field
                v-model="form.dispensing_address"
                :rules="requiredRule"
                density="compact"
                variant="outlined"
                label="Dispensing Pharmacy Address"
                class="custom-field field-required mt-6"
              /> -->

              <v-text-field
                v-model="form.delivery_address"
                density="compact"
                variant="outlined"
                label="Delivery Address (if different)"
                class="custom-field"
                maxlength="80"
                counter
              />

              <v-text-field
                v-model="form.ordering_address"
                density="compact"
                variant="outlined"
                label="Ordering Address (if different to delivery address)"
                class="custom-field"
                maxlength="80"
                counter
              />

              <!-- Wholesaler -->
              <h6 class="section-title mt-4 mb-6">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader mb-2">
                    Wholesaler Details
                  </span>
                  <!-- <v-divider class="ml-4"></v-divider> -->
                </div>
              </h6>
              <v-row dense>
                <v-col v-for="wh in wholesalers" :key="wh.id" cols="12" md="6">
                  <v-text-field
                    v-model="form.wholesaler_accounts[wh.id]"
                    :label="wh.name + ' Account Number'"
                    variant="outlined"
                    density="compact"
                    class="custom-field"
                  />
                  <!-- field-required -->
                  <!-- :rules="requiredRule" -->
                </v-col>
              </v-row>

              <!-- Medication -->
              <h6 class="section-title mt-2 mb-4">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader mb-2">
                    <span class="required-text">*</span> Medication
                  </span>
                  <!-- <v-divider class="ml-4"></v-divider> -->
                </div>
              </h6>
              <p class="mb-4" style="font-size: 14px">
                Please Select The Medication In Which You Want To Prescribe.
              </p>
              <v-row dense>
                <v-col
                  v-for="med in medications"
                  :key="med.id"
                  cols="12"
                  md="3"
                >
                  <v-checkbox
                    v-model="form.medications"
                    :label="med.drug_name"
                    :value="med.id"
                    density="compact"
                    color="#05668d"
                    hide-details
                  />
                </v-col>
              </v-row>

              <div v-if="medicationError" class="required-text">
                Please select at least one medication.
              </div>

              <!-- Account Details -->
              <h6 class="section-title mt-2 mb-6">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader mb-2">
                    Account Details
                  </span>
                  <!-- <v-divider class="ml-4"></v-divider> -->
                </div>
              </h6>

              <v-row dense>
                <v-col cols="12">
                  <div class="nhs-note">
                    <v-icon class="note-icon" size="20"
                      >mdi-alert-circle-outline</v-icon
                    >
                    <span>
                      Professional email address is required for successful
                      account validation
                      <!-- <strong>HCP-related email</strong>. -->
                    </span>
                  </div>
                  <v-text-field
                    hide-details="auto"
                    v-model="form.email"
                    :rules="[...requiredRule, ...emailRules]"
                    density="compact"
                    variant="outlined"
                    label="Email Address (A link will be sent to verify your email address)"
                    class="custom-field field-required"
                    :disabled="fromPage"
                  />
                </v-col>

                <!-- <v-col cols="12" md="6">
                  <v-text-field hide-details="auto" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'
                      " @click:append-inner="showPassword = !showPassword" :rules="[...requiredRule, ...passwordRules]"
                    density="compact" variant="outlined" label="Create Password" class="custom-field field-required"
                    maxlength="50" counter />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field hide-details="auto" v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'" :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
                      " @click:append-inner="
                        showConfirmPassword = !showConfirmPassword
                        " :rules="[...requiredRule, ...confirmPasswordRules]" density="compact" variant="outlined"
                    label="Confirm Password" class="custom-field field-required" maxlength="50" counter />
                </v-col> -->
                <v-col cols="12" md="6" v-if="!fromPage">
                  <v-text-field
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    :rules="[...requiredRule, ...passwordRules]"
                    @click:append-inner="showPassword = !showPassword"
                    density="compact"
                    variant="outlined"
                    label="Create Password"
                    class="custom-field field-required"
                    maxlength="50"
                    counter
                    hide-details
                    :disabled="fromPage"
                  />
                  <v-col
                    cols="12"
                    v-if="form.password || form.confirmPassword"
                    class="m-0 p-0"
                  >
                    <div v-if="form.password && !allPasswordValid" class="mt-2">
                      <div :class="ruleClass(hasMinLength)" class="rule-error">
                        <v-icon size="16" class="mr-2">
                          {{
                            hasMinLength
                              ? "mdi-check-circle"
                              : "mdi-close-circle"
                          }}
                        </v-icon>
                        Minimum 12 characters
                      </div>

                      <div :class="ruleClass(hasUppercase)" class="rule-error">
                        <v-icon size="16" class="mr-2">
                          {{
                            hasUppercase
                              ? "mdi-check-circle"
                              : "mdi-close-circle"
                          }}
                        </v-icon>
                        At least 1 uppercase letter
                      </div>

                      <div :class="ruleClass(hasNumber)" class="rule-error">
                        <v-icon size="16" class="mr-2">
                          {{
                            hasNumber ? "mdi-check-circle" : "mdi-close-circle"
                          }}
                        </v-icon>
                        At least 1 number
                      </div>

                      <div :class="ruleClass(hasSpecial)" class="rule-error">
                        <v-icon size="16" class="mr-2">
                          {{
                            hasSpecial ? "mdi-check-circle" : "mdi-close-circle"
                          }}
                        </v-icon>
                        At least 1 special character (~!@#$%)
                      </div>
                    </div>
                  </v-col>
                </v-col>

                <v-col cols="12" md="6" v-if="!fromPage">
                  <v-text-field
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="
                      showConfirmPassword = !showConfirmPassword
                    "
                    :rules="[...requiredRule, ...confirmPasswordRules]"
                    density="compact"
                    variant="outlined"
                    label="Confirm Password"
                    class="custom-field field-required"
                    maxlength="50"
                    counter
                    hide-details
                    :disabled="fromPage"
                  />
                  <v-col
                    cols="12"
                    v-if="form.password || form.confirmPassword"
                    class="m-0 p-0"
                  >
                    <div
                      v-if="form.confirmPassword && !passwordsMatch"
                      class="mt-2"
                    >
                      <div
                        v-if="form.confirmPassword"
                        :class="ruleClass(passwordsMatch)"
                        class="rule-error"
                      >
                        <v-icon size="16" class="mr-2">
                          {{
                            passwordsMatch
                              ? "mdi-check-circle"
                              : "mdi-close-circle"
                          }}
                        </v-icon>
                        Passwords must match
                      </div>
                    </div>
                  </v-col>
                </v-col>
              </v-row>

              <div class="form-actions">
                <div class="mandatory-legend">
                  <span class="mandatory-star">*</span>
                  <span class="theme-color">
                    Symbol indicates a mandatory field
                  </span>
                </div>

                <v-btn
                  size="small"
                  class="btn-filled theme-bg"
                  @click="goToNextStep"
                >
                  Next
                </v-btn>
              </div>
            </div>

            <!-- STEP 2 remains unchanged -->
            <!-- ================= STEP 2 ================= -->
            <div v-if="step === 2">
              <h6 class="section-title mt-5 mb-0">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader mb-2">
                    Pharmacist/Pharmacy Technician Confirmation
                  </span>
                  <!-- <v-divider class="ml-4 mb-1"></v-divider> -->
                </div>
              </h6>
              <div class="note-box">
                By registering Addenbrookes Hospital, Cambridge University Hosps
                NHS Foundation Trust to order and dispense
                {{ getCommaSeparatedDrugNames(selDrugList) }}, I agree to
                implement and ensure compliance with the risk minimisation
                measures associated with the Pregnancy Prevention Programme
                (PPP) for {{ getCommaSeparatedDrugNames(selDrugList) }} and
                adhere to the following requirements:
              </div>

              <div>
                <div
                  v-for="drugId in form.medications"
                  :key="drugId"
                  class="mb-3"
                >
                  <h6 class="theme-subheader text-title-case mb-3">
                    {{ getDrug(drugId)?.title }}
                  </h6>

                  <template v-if="confirmationChecks[drugId]">
                    <template
                      v-for="(term, index) in getDrug(drugId)?.questions"
                      :key="index"
                    >
                      <!-- Checkbox -->
                      <v-checkbox
                        v-if="term.q_type === 'Checkbox'"
                        v-model="confirmationChecks[drugId][index]"
                        density="compact"
                        hide-details
                        color="#05668d"
                        :class="{
                          'error-checkbox': getErrorClass(drugId, index),
                        }"
                      >
                        <template #label>
                          <div>
                            <span
                              class="chk-points"
                              v-html="term.question"
                            ></span>

                            <span
                              v-if="term.attach_doc == 1 && term.doc_link"
                              class="mx-2 chk-points"
                            >
                              <a
                                :href="term.doc_link"
                                target="_blank"
                                rel="noopener noreferrer"
                                :class="[
                                  'doc-link',
                                  {
                                    'doc-link-read':
                                      docClicks[drugId]?.[term.id],
                                  },
                                ]"
                                @click="markDocClicked(drugId, term.id)"
                              >
                                {{ term.doc_title }}
                              </a>
                            </span>
                          </div>
                        </template>
                      </v-checkbox>

                      <!-- Plain Text -->
                      <div
                        v-else-if="term.q_type === 'Plain Text'"
                        class="note-box mb-3"
                      >
                        <span class="chk-points" v-html="term.question"></span>

                        <span
                          v-if="term.attach_doc == 1 && term.doc_link"
                          class="mx-2 chk-points"
                        >
                          <a
                            :href="term.doc_link"
                            target="_blank"
                            rel="noopener noreferrer"
                            :class="[
                              'doc-link',
                              { 'doc-link-read': docClicks[drugId]?.[term.id] },
                            ]"
                            @click="markDocClicked(drugId, term.id)"
                          >
                            {{ term.doc_title }}
                          </a>
                        </span>
                      </div>
                    </template>
                  </template>
                  <hr />
                </div>

                <div
                  v-if="confirmationError"
                  style="color: red; font-size: 12px; margin-top: 8px"
                >
                  Please accept all terms and conditions before submitting.
                </div>

                <div>
                  <div class="note-box">
                    By clicking register, I understand that if during the period
                    of registration I am unable to fulfil requirements 1-11, the
                    above named pharmacy will be de registered by Company Name
                    and I will be unable to order any further
                    {{ getCommaSeparatedDrugNames(selDrugList) }} and required
                    to go through the registration process again, following any
                    necessary remedial action(s). I acknowledge this
                    registration to order and dispense
                    {{ getValidityText(selDrugList) }} only, after which I am
                    required to re register the above named pharmacy should I
                    wish to continue to order and dispense
                    {{ getCommaSeparatedDrugNames(selDrugList) }}.
                  </div>

                  <v-row dense>
                    <v-col cols="12" md="6">
                      <div class="custom-field plain-wrapper">
                        <label class="plain-label">Pharmacist Name</label>
                        <div class="plain-value">
                          {{ form.signature }}
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="custom-field plain-wrapper">
                        <label class="plain-label">Date</label>
                        <div class="plain-value" v-if="form.signature_date">
                          {{ formatDate(form.signature_date) }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <div class="form-actions d-flex justify-space-between">
                <v-btn
                  size="small"
                  variant="outlined"
                  class="btn-outline"
                  @click="goToPreviousStep"
                  :disabled="btndisable"
                >
                  ← Previous
                </v-btn>
                <v-btn
                  size="small"
                  class="btn-filled theme-bg"
                  @click="submitForm"
                  :disabled="btndisable"
                >
                  Register
                </v-btn>
              </div>
            </div>
          </v-form>
          <v-dialog
            v-model="showConfirmationDialog"
            width="520"
            persistent
            transition="dialog-transition"
            scrim="rgba(0,0,0,0.6)"
          >
            <v-card class="animated-card pa-10 text-center">
              <div class="icon-wrapper mb-6">
                <v-icon
                  icon="mdi-alert-circle"
                  size="70"
                  class="warning-icon"
                ></v-icon>
              </div>

              <h2 class="mb-4 dialog-title">Action Required</h2>

              <p class="dialog-text mb-6">
                You must agree to all required statements before submitting the
                form. Please review the checkboxes and confirm your agreement.
              </p>

              <v-btn
                class="continue-btn"
                size="large"
                @click="showConfirmationDialog = false"
              >
                Continue
              </v-btn>
            </v-card>
          </v-dialog>
          <!-- SUCCESS DIALOG -->
          <v-dialog
            v-model="showSuccessDialog"
            width="680"
            persistent
            scrim="rgba(0,0,0,0.65)"
            transition="dialog-transition"
          >
            <v-card class="success-dialog-card text-center" elevation="6">
              <!-- Icon Section -->
              <div class="success-icon-wrapper">
                <div class="success-circle">
                  <v-icon size="48" class="success-icon"> mdi-check </v-icon>
                </div>
              </div>

              <!-- Title -->
              <h2 class="success-title">
                {{
                  fromPage !== "my-profile"
                    ? "Registration is in Progress"
                    : "Registration Complete"
                }}
              </h2>

              <!-- Description -->
              <p v-if="!fromPage" class="success-description w-100 text-center">
                Thank you for registering for the PAF.<br />
                A representative will validate your account and you will receive
                an email confirmation within one working day.
              </p>

              <!-- Divider -->
              <v-divider class="my-6"></v-divider>

              <!-- Action Button -->
              <v-btn
                v-if="fromPage == 'my-profile'"
                class="success-login-btn"
                size="large"
                @click="goToDashboard()"
              >
                Go to Dashboard
              </v-btn>
              <v-btn
                v-else
                class="success-login-btn"
                size="large"
                @click="goToLogin()"
              >
                Go to Login
              </v-btn>
            </v-card>
          </v-dialog>

          <!-- not read dialog -->
          <v-dialog v-model="showDocErrorDialog" width="600" persistent>
            <v-card class="doc-error-card pa-8">
              <!-- Header -->
              <div class="text-center mb-6">
                <div class="error-icon-wrapper">
                  <v-icon size="48" class="error-icon">mdi-alert-circle</v-icon>
                </div>

                <h2 class="mt-4 error-title">Information Guide Not Read</h2>

                <p class="error-subtitle mt-2">
                  Please review the following required document(s) before
                  continuing:
                </p>
              </div>

              <!-- Document List -->
              <v-list class="doc-list" density="comfortable">
                <v-list-item
                  v-for="(doc, index) in pendingDocs"
                  :key="index"
                  class="doc-item"
                >
                  <template #prepend>
                    <v-icon color="red">mdi-file-document-outline</v-icon>
                  </template>

                  <v-list-item-title>
                    <!-- <a :href="doc.link" target="_blank" class="doc-link" @click="markManualClick(doc)">
                      {{ doc.title }}
                    </a> -->
                    <div class="doc-link">{{ doc.title }}</div>
                  </v-list-item-title>
                </v-list-item>
              </v-list>

              <!-- Footer -->
              <div class="d-flex justify-end mt-8">
                <v-btn
                  size="small"
                  class="btn-cancel mb-2 mr-3"
                  color="cancel"
                  @click="showDocErrorDialog = false"
                >
                  Back
                </v-btn>
              </div>
            </v-card>
          </v-dialog>

          <!-- read dialog  -->
          <v-dialog v-model="showDocSuccessDialog" width="520" persistent>
            <v-card class="animated-card pa-10 text-center">
              <div class="icon-wrapper mb-6">
                <v-icon size="70" color="green">mdi-check</v-icon>
              </div>

              <h2 class="mb-4" style="color: green">Information Guide Read</h2>

              <p class="mb-6">
                Please confirm below that you have read and understood the
                Healthcare Professionals Information Guide
              </p>

              <!--  Confirmation Checkbox -->
              <v-checkbox
                v-model="confirmGuideRead"
                density="compact"
                color="green"
                hide-details
                class="mb-6 text-left"
              >
                <template #label>
                  <span style="font-size: 14px">
                    I confirm that I have read and understood the Healthcare
                    Professionals information guide and understand the PPP
                    materials.
                  </span>
                </template>
              </v-checkbox>

              <!--  Next button disabled until checked -->
              <v-btn
                color="green"
                :disabled="!confirmGuideRead"
                @click="finalSubmit"
              >
                Next
              </v-btn>
            </v-card>
          </v-dialog>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["fromPage", "profile_details"],
  data() {
    return {
      registrationCompleted: false,
      selDrugList: [],
      step: 1,
      isFormValid: false,
      loading: false,
      medicationError: false,
      roleError: false,
      isLeadPharmacist: false,
      institutionTypes: [],
      institutions: [],
      medications: [],
      form: {
        name: "",
        lastname: "",
        reg_no: "",
        institution_type: "",
        phone_no: "",
        institution_id: "",
        role: "Pharmacist",
        dispensing_address: "",
        delivery_address: "",
        delivery_post_code: "",
        ordering_address: "",
        ordering_post_code: "",
        aah: "",
        phoenix: "",
        mawdsleys: "",
        alliance: "",
        teva: "",
        alloga: "",
        medications: [],
        email: "",
        password: "",
        confirmPassword: "",
        wholesaler_accounts: {},
      },
      confirmationError: false,
      confirmationChecks: {},
      showConfirmationDialog: false,
      btndisable: false,
      signature: "",
      signature_date: "",
      showSuccessDialog: false,
      medicationTerms: [],
      wholesalers: [],
      institutionsLoading: false,

      showPassword: false,
      showConfirmPassword: false,
      medicationTerms: [],
      confirmationChecks: {},
      docClicks: {},

      confirmationError: false,
      showConfirmationDialog: false,
      showDocErrorDialog: false,
      showDocSuccessDialog: false,
      confirmGuideRead: false,
      showValidation: false,
      dialogMessage: "",
      dialogTitle: "",
      user: [],
    };
  },

  mounted() {
    this.fetchLov();
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },

  watch: {
    async step(val) {
      if (val === 2) {
        await this.fetchPolicyQuestions();

        // Set prescriber name automatically
        this.form.signature = this.form.name + " " + this.form.lastname;

        // Set current date (DD / MM / YYYY)
        const today = new Date().toISOString().substr(0, 10);

        this.form.signature_date = today;
        this.initializeConfirmations();
      }
    },
    fromPage: {
      handler(newVal) {
        if (newVal === "my-profile") {
          const pharmacist = this.profile_details?.pharmacist_details?.[0];
          this.form.name = this.profile_details?.name || "";
          this.form.lastname = this.profile_details?.lastname || "";
          this.form.reg_no = pharmacist?.reg_no || "";
          this.form.phone_no = pharmacist?.phone_no || "";
          this.form.email = this.profile_details?.email || "";
          this.form.password = "Agileidc@456";
          this.form.confirmPassword = "Agileidc@456";
        }
      },
      immediate: true,
    },
  },

  computed: {
    hasMinLength() {
      return this.form.password?.length >= 12;
    },
    hasUppercase() {
      return /[A-Z]/.test(this.form.password || "");
    },
    hasNumber() {
      return /\d/.test(this.form.password || "");
    },
    hasSpecial() {
      return /[~!@#$%]/.test(this.form.password || "");
    },
    passwordsMatch() {
      return (
        this.form.password &&
        this.form.confirmPassword &&
        this.form.password === this.form.confirmPassword
      );
    },
    allPasswordValid() {
      return (
        this.hasMinLength &&
        this.hasUppercase &&
        this.hasNumber &&
        this.hasSpecial
      );
    },
    allConfirmationsChecked() {
      return this.form.medications.every((drugId) => {
        const drug = this.getDrug(drugId);
        if (!drug) return false;

        return drug.questions.every((q, index) => {
          if (q.q_type === "Checkbox") {
            return this.confirmationChecks[drugId]?.[index] === true;
          }
          return true; // Plain text always valid
        });
      });
    },
    pendingDocs() {
      let missing = [];

      this.form.medications.forEach((drugId) => {
        const drug = this.getDrug(drugId);
        if (!drug) return;

        drug.questions.forEach((q) => {
          if (q.attach_doc == 1 && q.doc_link) {
            const clicked = this.docClicks[drugId]?.[q.id];

            if (!clicked) {
              missing.push({
                title: q.doc_title,
                link: q.doc_link,
              });
            }
          }
        });
      });

      return missing;
    },
    allDocsClicked() {
      return this.pendingDocs.length === 0;
    },

    progress() {
      if (this.step === 1) return 50;

      if (this.step === 2 && !this.registrationCompleted) return 80;

      if (this.registrationCompleted) return 100;

      return 50;
    },
    requiredRule() {
      return [(v) => !!v || "This field is required"];
    },
    emailRules() {
      return [
        (v) => !!v || "Email is required",
        (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address",
      ];
    },
    passwordRules() {
      return [
        (v) => !!v || "Password required",
        (v) => v.length >= 12 || "Minimum length of 12 characters required",
        (v) => /[A-Z]/.test(v) || "Minimum of 1 uppercase letter required",
        (v) => /\d/.test(v) || "At least 1 number required",
        (v) =>
          /[~!@#$%]/.test(v) ||
          "At least 1 non-alphanumeric character (~!@#$%) required",
      ];
    },
    confirmPasswordRules() {
      return [
        (v) => !!v || "Confirm Password required",
        (v) => v === this.form.password || "Passwords do not match",
      ];
    },
    phoneRules() {
      return [
        (v) => !v || /^[0-9+\s()-]*$/.test(v) || "Only numbers and + - allowed",
        (v) =>
          !v ||
          v.replace(/\D/g, "").length >= 8 ||
          "Enter a valid phone number",
      ];
    },
    filteredInstitutionTypes() {
      const type = this.user?.pharmacist?.institution_type;

      // If user has no institution_type -> show all
      if (!type) {
        return this.institutionTypes;
      }

      // If user has institution_type -> show matching only
      const items = this.institutionTypes.filter(
        (item) => item.shortname === type
      );

      // Auto select if only one item
      if (items.length === 1 && !this.form.institution_type) {
        this.form.institution_type = items[0].shortname;
        this.fetchInstitutionList(this.form.institution_type);
      }

      return items;
    },
  },

  methods: {
    getErrorClass(drugId, index) {
      return this.showValidation && !this.confirmationChecks[drugId]?.[index];
    },
    async updateRole(val) {
      const oldRole = this.form.role;

      try {
        this.loader = true;

        // If switching OFF → no need to check
        if (!val) {
          this.form.role = "Pharmacist";
          return;
        }

        // Call API
        const res = await this.$axios.get(
          `check-lead-pharmacist/${this.form.institution_id}`
        );

        if (res.data.has_lead_pharmacist == 1) {
          const confirmed = await this.showConfirmation(
            "Confirm",
            "A Lead Pharmacist already exists for thi Institution. Are you a Lead Pharmacist as well?"
          );

          if (!confirmed) {
            // revert back
            this.form.role = oldRole;
            this.isLeadPharmacist = false;
            return;
          }
        }

        // Set role if confirmed or no existing lead
        this.form.role = "Lead Pharmacist";
        this.isLeadPharmacist = true;
        this.roleError = false;
      } catch (error) {
        // revert on error
        this.form.role = oldRole;
      } finally {
        this.loader = false;
      }
    },
    ruleClass(condition) {
      return condition
        ? "text-success d-flex align-center"
        : "text-error d-flex align-center";
    },
    getValidityText(drugs) {
      if (!Array.isArray(drugs) || drugs.length === 0) return "";

      // Group drugs by validity
      const grouped = {};

      drugs.forEach((drug) => {
        if (!grouped[drug.validity]) {
          grouped[drug.validity] = [];
        }
        grouped[drug.validity].push(drug.drug_name);
      });

      // Build formatted text
      const parts = Object.keys(grouped).map((months) => {
        const names = grouped[months];
        const years = months / 12;

        const formattedNames =
          names.length === 1
            ? names[0]
            : names.slice(0, -1).join(", ") + " and " + names[names.length - 1];

        return `${formattedNames} valid for ${years} ${
          years > 1 ? "years" : "year"
        }`;
      });

      // Join multiple validity groups
      if (parts.length === 1) return parts[0];

      return (
        parts.slice(0, -1).join(" and ") + " and " + parts[parts.length - 1]
      );
    },
    getDrug(drugId) {
      return this.medicationTerms.find((d) => Number(d.id) === Number(drugId));
    },
    populateAddress(id) {
      this.isLeadPharmacist = 0;
      const hospital = this.institutions.find((h) => h.id === id);
      this.form.dispensing_address = hospital ? hospital.address : "";
      this.form.ordering_address = hospital ? hospital.ordering_address : "";
      this.form.delivery_address = hospital ? hospital.delivery_address : "";
      this.form.ordering_post_code = hospital
        ? hospital.ordering_post_code
        : "";
      this.form.delivery_post_code = hospital
        ? hospital.delivery_post_code
        : "";
    },

    formatPhone() {
      if (!this.form.phone_no) return;

      // Remove non-numeric except +
      this.form.phone_no = this.form.phone_no
        .replace(/[^0-9+]/g, "")
        .substring(0, 22);
    },

    fetchInstitutionList(type) {
      this.institutionsLoading = true;
      this.institutions = [];
      this.form.institution_id = null;
      this.$axios
        .get("fetch_institution_by_type", {
          params: {
            type: type,
          },
        })
        .then((response) => {
          let institutions = response.data.institutions;

          const pharmacistDetails =
            this.profile_details?.pharmacist_details || [];

          // get all institution ids
          const existingInstitutionIds = pharmacistDetails
            .map((p) => p.institution_id)
            .filter(Boolean);

          // filter only if any institution ids exist
          if (existingInstitutionIds.length) {
            institutions = institutions.filter(
              (inst) => !existingInstitutionIds.includes(inst.id)
            );
          }

          this.institutions = institutions;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        })
        .finally(() => {
          setTimeout(() => {
            this.institutionsLoading = false;
          }, 1000);
        });
    },

    fetchLov() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "INSTITUTION_TYPE",
          },
        })
        .then((res) => {
          this.institutionTypes = res.data.lookup_details.filter((item) =>
            ["Inpatient Pharmacy", "Outpatient Pharmacy", "Homecare"].includes(
              item.shortname
            )
          );
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });

      this.$axios
        .get("fetch_active_drugs")
        .then((res) => {
          this.medications = res.data.drugs;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });

      this.$axios
        .get("fetch_active_wholesalers")
        .then((res) => {
          this.wholesalers = res.data.wholesalers;

          // Initialize empty account numbers dynamically
          this.wholesalers.forEach((wh) => {
            this.form.wholesaler_accounts[wh.id] = "";
          });
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    goToLogin() {
      this.btndisable = true;
      this.loading = true;
      this.showSuccessDialog = false;
      this.$router.push({ name: "login" });
    },
    goToDashboard() {
      this.btndisable = true;
      this.loading = true;
      this.showSuccessDialog = false;
      this.$router.push({ name: "institution_selection" });
    },

    initializeConfirmations() {
      this.form.medications.forEach((drugId) => {
        const drug = this.getDrug(drugId);

        if (drug && !this.confirmationChecks[drugId]) {
          this.confirmationChecks[drugId] = drug.questions.map((q) =>
            q.q_type === "Checkbox" ? false : null
          );
        }
      });
    },
    markDocClicked(drugId, questionId) {
      if (!this.docClicks[drugId]) {
        this.docClicks[drugId] = {};
      }

      this.docClicks[drugId][questionId] = true;
    },
    markManualClick(doc) {
      // find drug + question and mark clicked

      this.form.medications.forEach((drugId) => {
        const drug = this.getDrug(drugId);
        if (!drug) return;

        drug.questions.forEach((q) => {
          if (q.doc_link === doc.link) {
            this.markDocClicked(drugId, q.id);
          }
        });
      });
    },
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },
    resetConfirmation() {
      this.confirmGuideRead = false;
      // Reset checkbox confirmations
      this.confirmationChecks = {};

      // Reset document click tracking
      this.docClicks = {};

      // Reset dialogs
      this.showConfirmationDialog = false;
      this.showDocErrorDialog = false;
      this.showDocSuccessDialog = false;

      // Reset error states
      this.confirmationError = false;
    },
    goToPreviousStep() {
      this.resetConfirmation();
      this.step = 1;
    },
    submitForm() {
      this.showValidation = true;
      let isValid = true;

      this.form.medications.forEach((drugId) => {
        const drug = this.getDrug(drugId);

        if (!drug) return;

        drug.questions.forEach((q, index) => {
          if (q.q_type === "Checkbox") {
            if (!this.confirmationChecks[drugId]?.[index]) {
              isValid = false;
            }
          }
        });
      });

      if (!isValid) {
        this.confirmationError = true;
        this.$nextTick(() => {
          const el = document.querySelector(".error-checkbox");
          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        });
        return;
      }

      this.confirmationError = false;

      if (!this.allConfirmationsChecked) {
        this.showConfirmationDialog = true;
        return;
      }

      if (!this.allDocsClicked) {
        this.showDocErrorDialog = true;
        return;
      }

      this.showDocSuccessDialog = true;
    },

    finalSubmit() {
      if (!this.confirmGuideRead) return;

      this.registrationCompleted = true;

      this.confirmGuideRead = false;
      this.showDocSuccessDialog = false;

      this.confirmationError = false;
      this.loading = true;

      const payload = {
        name: this.form.name,
        lastname: this.form.lastname,
        email: this.form.email,
        password: this.form.password,
        reg_no: this.form.reg_no,
        phone_no: this.form.phone_no,
        institution_type: this.form.institution_type,
        institution_id: this.form.institution_id,
        dispensing_address: this.form.dispensing_address,
        delivery_address: this.form.delivery_address,
        delivery_post_code: this.form.delivery_post_code,
        ordering_address: this.form.ordering_address,
        ordering_post_code: this.form.ordering_post_code,
        medications: this.form.medications,
        signature: this.form.signature,
        signature_date: this.form.signature_date,
        role: this.form.role,
        wholesaler_accounts: this.form.wholesaler_accounts,
        from_page: this.fromPage,
        user_id: this.profile_details?.id || 0,
      };

      this.$axios
        .post("pharmacist_register", payload)
        .then((res) => {
          if (res.data.status == "E") {
            this.$toast.error(res.data.message);
            this.loading = false;
          } else {
            this.showSuccessDialog = true;
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.error(
            err?.response?.data?.message || "Something went wrong"
          );
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async fetchPolicyQuestions() {
      try {
        this.loading = true;
        if (!this.form.medications.length) return;

        const res = await this.$axios.get("fetch_policy_questions", {
          params: {
            type: "Pharmacist",
            medications: this.form.medications,
          },
        });

        this.medicationTerms = res.data.medications || [];
        this.selDrugList = res.data.drug_list || [];
        this.loading = false;
      } catch (error) {
        this.$toast.error("Failed to load confirmation questions");
        this.loading = false;
      }
    },

    async goToNextStep() {
      this.medicationError = this.form.medications.length === 0;
      this.roleError = !this.form.role;

      const { valid } = await this.$refs.formRef.validate();

      if (!valid || this.medicationError || this.roleError) {
        this.$nextTick(() => {
          const el = document.querySelector(".v-input--error");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        return;
      }

      if (this.form.email && !this.fromPage) {
        try {
          const response = await this.$axios.post("check-email-exists", {
            email: this.form.email,
          });

          if (response.data.status === "E") {
            this.$toast.error(response.data.message);
            return;
          }
        } catch (error) {
          this.$toast.error(
            error.response?.data?.message || "Email check failed"
          );
          return;
        }
      }

      this.step = 2;
    },
    // added by Raghavendra to return to myprofile
    returnToMyProfile() {
      this.$emit("show-profile", false);
    },
    // added by Raghavendra to return to myprofile
    returnToSelection() {
      this.$emit("category-selected", null);
    },

    getCommaSeparatedDrugNames(drugs) {
      if (!Array.isArray(drugs) || drugs.length === 0) return "";

      const names = drugs.map((d) => d.drug_name);

      if (names.length === 1) return names[0];

      return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
    },
  },
};
</script>

<style scoped>
/* PAGE BACKGROUND */
.register-page {
  margin: 15px;
  padding-top: 40px;
  width: 70vw;
}

/* PROGRESS BAR */
.progress-wrapper {
  max-width: 1200px;
  background: var(--theme-gradient);
  padding: 10px 60px;
  border-radius: 20px 20px 0 0;
  color: white;
}

.progress-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* MAIN CARD */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  /* padding: 0 20px 60px 20px; */
}

.form-card {
  background: #f4f4f4;
  border-radius: 2px;
  padding: 25px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  height: auto;
  /* overflow-y: auto; */
}

/* HEADER */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  gap: 16px;
}

/* BUTTON STYLES */
.btn-outline {
  border: 2px solid var(--theme-color) !important;
  color: var(--theme-color) !important;
  font-weight: 600;
  text-transform: none;
}

.btn-filled {
  color: white;
  font-weight: 600;
  text-transform: none;
}

/* SECTION TITLE */
.section-title {
  font-weight: 600;
  color: #555;
}

/* INPUT FIELD CUSTOM */
.custom-field :deep(.v-field) {
  border-radius: 2px !important;
  background: white;
}

/* ADDITIONAL LOCATION LINK */
.additional-location {
  margin-top: 20px;
  font-size: 14px;
  color: #6c63ff;
  cursor: pointer;
}

.additional-location:hover {
  text-decoration: underline;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 20px;
}

.section-text {
  min-width: 325px;
  font-weight: bold !important;
}

.custom-field :deep(.v-field) {
  border-radius: 2px !important;
  background: white;
}

.custom-field :deep(.v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}

.plain-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 56px;
  padding: 12px;
  background: white;
  border-radius: 4px;
}

.plain-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.plain-value {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
}

/* Dialog Card Animation */
.animated-card {
  border-radius: 24px;
  backdrop-filter: blur(10px);
  background: white;
  animation: cardPop 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Card entrance */
@keyframes cardPop {
  0% {
    transform: scale(0.7) translateY(40px);
    opacity: 0;
  }

  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Icon Pulse */
.warning-icon {
  color: #ff3b3b;
  animation: pulse 1.5s infinite;
}

/* Icon floating circle */
.icon-wrapper {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(255, 59, 59, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: floatIn 0.5s ease;
}

/* Pulse effect */
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }

  100% {
    transform: scale(1);
  }
}

/* Float entrance */
@keyframes floatIn {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Text styling */
.dialog-title {
  font-weight: 600;
  color: #222;
}

.dialog-text {
  font-size: 14px;
  color: #555;
}

/* Button styling */
.continue-btn {
  background: linear-gradient(135deg, #ff3b3b, #d32f2f);
  color: white;
  font-weight: 600;
  padding: 0 40px;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 59, 59, 0.3);
}

/* Simple Animated Mandatory Legend */
.mandatory-legend {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #555;
  animation: fadeSlideIn 0.4s ease;
  font-size: 12px;
  font-style: italic;
}

/* Animated star */
.mandatory-star {
  color: var(--required-color);
  font-weight: bold;
  font-size: 15px;
  animation: pulseStar 1.5s infinite ease-in-out;
}

/* Smooth appearance */
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Soft pulse animation */
@keyframes pulseStar {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

.success-dialog {
  border-radius: 28px;
}

.success-circle {
  width: 110px;
  height: 110px;
  border: 3px solid #94c11f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.success-title {
  font-size: 32px;
  font-weight: 500;
  color: #4a4a4a;
}

.success-text {
  font-size: 18px;
  color: #6c6c6c;
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto;
}

.login-btn {
  background-color: #0e5a74;
  color: white;
  min-width: 200px;
  height: 50px;
  font-size: 16px;
}

/* SUCCESS DIALOG CARD */
.success-dialog-card {
  border-radius: 32px;
  padding: 60px 50px;
  background: white;
  animation: popIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Entrance Animation */
@keyframes popIn {
  0% {
    transform: scale(0.85) translateY(40px);
    opacity: 0;
  }

  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* ICON WRAPPER */
.success-icon-wrapper {
  margin-bottom: 30px;
}

.success-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid var(--theme-color);
  background: rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: scalePulse 1.8s infinite ease-in-out;
}

.success-icon {
  color: var(--theme-color);
}

/* Subtle pulse animation */
@keyframes scalePulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

/* TITLE */
.success-title {
  font-size: 30px;
  font-weight: 600;
  color: var(--theme-color);
  margin-bottom: 18px;
}

/* DESCRIPTION */
.success-description {
  font-size: 16px;
  color: #5f6368;
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto;
}

/* LOGIN BUTTON */
.success-login-btn {
  background: var(--theme-gradient);
  color: white;
  font-weight: 600;
  padding: 0 50px;
  height: 52px;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.success-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.v-field__append-inner .v-icon {
  opacity: 0.7;
}

.chk-points:deep(p) {
  display: inline !important;
}

.doc-error-card {
  border-radius: 20px;
}

.error-icon-wrapper {
  width: 70px;
  height: 70px;
  margin: 0 auto;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  color: #e53935;
}

.error-title {
  font-weight: 600;
  color: #e53935;
}

.error-subtitle {
  font-size: 14px;
  color: #666;
}

.doc-list {
  background: #fafafa;
  border-radius: 12px;
  padding: 8px;
}

.doc-item {
  border-radius: 12px;
  transition: 0.2s ease;
}

.doc-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.doc-link {
  text-decoration: none;
  font-weight: 500;
  color: #1565c0;
  transition: 0.2s ease;
}

.doc-link:hover {
  text-decoration: underline;
}

.doc-link-read {
  color: #c47600 !important;
  font-weight: 600;
}

.error-checkbox :deep(.v-selection-control) {
  border: 1px solid red;
  border-radius: 6px;
  padding: 6px;
  background-color: #fff5f5;
}

.error-checkbox :deep(.v-label) {
  color: red !important;
}
</style>
