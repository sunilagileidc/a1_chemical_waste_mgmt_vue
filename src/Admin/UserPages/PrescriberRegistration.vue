<template>
  <div class="register-page pa-0">
    <content-loader v-if="loading"></content-loader>
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
          <!-- FORM WRAPPER -->
          <v-form ref="formRef" v-model="isFormValid">
            <!-- Header -->
            <div class="form-header">
              <span class="theme-header">Prescriber Registration Form</span>

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

                <!-- <v-btn size="small" class="btn-filled theme-bg" >
                  Prescriber
                </v-btn> -->
              </div>
            </div>

            <!-- ================= STEP 1 ================= -->
            <div v-if="step === 1">
              <!-- PRESCRIBER DETAILS -->
              <h6 class="section-title mt-5 mb-6">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader mb-2">
                    Prescriber Details
                  </span>
                  <!-- <v-divider class="ml-4"></v-divider> -->
                </div>
              </h6>
              <!-- {{ form }} -->
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.name"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Prescriber First Name"
                    class="custom-field field-required"
                    maxlength="30"
                    counter
                    :disabled="fromPage"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.lastname"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Prescriber Last Name"
                    class="custom-field field-required"
                    maxlength="30"
                    counter
                    :disabled="fromPage"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.reg_no"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Registration Number"
                    class="custom-field field-required"
                    hint="This should be your professional body registration number"
                    persistent-hint="true"
                    maxlength="30"
                    counter
                    :disabled="fromPage"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-combobox
                    v-model="form.job_title"
                    :items="jobtitles"
                    item-title="longname"
                    item-value="shortname"
                    :rules="requiredRule"
                    label="Job Title"
                    variant="outlined"
                    density="compact"
                    class="custom-field field-required"
                    maxlength="30"
                    counter
                    clearable
                    :return-object="false"
                    hint="Select or enter job title"
                    :disabled="fromPage"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="form.institution_id"
                    :items="hospitals"
                    item-title="name"
                    item-value="id"
                    :rules="requiredRule"
                    density="compact"
                    variant="outlined"
                    label="Hospital"
                    class="custom-field field-required"
                    @update:modelValue="populateAddress"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <div class="custom-field plain-wrapper">
                    <label class="plain-label">Hospital Address</label>
                    <div class="plain-value">
                      {{ form.address }}
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- MEDICATION -->
              <h6 class="section-title mt-8 mb-4">
                <div class="d-flex align-center">
                  <span class="section-text theme-subheader mb-2">
                    <span class="required-text">*</span> Medication
                  </span>
                  <!-- <v-divider class="ml-4"></v-divider> -->
                </div>
              </h6>
              <!-- ---{{form}} -->

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

              <div
                v-if="medicationError"
                style="color: red; font-size: 12px; margin-top: 8px"
              >
                Please select at least one medication.
              </div>

              <p class="note-box">
                <strong>IMPORTANT:</strong> You will only be able to receive
                PAFs for drugs in which you have checked and registered with.
              </p>

              <!-- ACCOUNT DETAILS -->
              <h6 class="section-title mt-8 mb-6">
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
                    v-model="form.email"
                    hide-details="auto"
                    :rules="[...requiredRule, ...emailRules]"
                    density="compact"
                    variant="outlined"
                    label="Email Address (A link will be sent to verify your email address)"
                    class="custom-field field-required"
                    maxlength="50"
                    counter
                    :disabled="fromPage"
                  />
                </v-col>

                <v-col cols="12" md="6" v-if="!fromPage">
                  <v-text-field
                    :rules="[...requiredRule, ...passwordRules]"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="showPassword = !showPassword"
                    density="compact"
                    variant="outlined"
                    label="Create Password"
                    class="custom-field field-required"
                    maxlength="50"
                    counter
                    hide-details
                  />

                  <!-- Password Rules -->
                  <div v-if="form.password && !allPasswordValid" class="mt-2">
                    <div :class="ruleClass(hasMinLength)" class="rule-error">
                      <v-icon size="16" class="mr-2">
                        {{
                          hasMinLength ? "mdi-check-circle" : "mdi-close-circle"
                        }}
                      </v-icon>
                      Minimum 12 characters
                    </div>

                    <div :class="ruleClass(hasUppercase)" class="rule-error">
                      <v-icon size="16" class="mr-2">
                        {{
                          hasUppercase ? "mdi-check-circle" : "mdi-close-circle"
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

                <v-col cols="12" md="6" v-if="!fromPage">
                  <v-text-field
                    :rules="[...requiredRule, ...confirmPasswordRules]"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append-inner-icon="
                      showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'
                    "
                    @click:append-inner="
                      showConfirmPassword = !showConfirmPassword
                    "
                    density="compact"
                    variant="outlined"
                    label="Confirm Password"
                    class="custom-field field-required"
                    maxlength="50"
                    counter
                    hide-details
                  />

                  <!-- Match Validation -->
                  <div
                    v-if="form.confirmPassword && !passwordsMatch"
                    class="mt-2"
                  >
                    <div :class="ruleClass(passwordsMatch)" class="rule-error">
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
              </v-row>

              <!-- ACTION BUTTON -->
              <div class="form-actions">
                <div class="mandatory-legend">
                  <span class="mandatory-star">* </span>
                  <span class="theme-color"
                    >Symbol indicates a mandatory field</span
                  >
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

            <!-- ================= STEP 2 ================= -->
            <div v-if="step === 2">
              <div class="d-flex align-center">
                <!-- <span class="section-text theme-subheader">
                    Prescriber Confirmation
                  </span> -->
                <v-divider class="my-4"></v-divider>
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
                      <!-- CHECKBOX TYPE -->
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

                            <!-- ATTACHED DOCUMENT -->
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
                      <!-- PLAIN TEXT TYPE -->
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
                    <hr />
                  </template>
                </div>
                <div
                  v-if="confirmationError"
                  style="color: red; font-size: 12px; margin-top: 8px"
                >
                  Please accept all terms and conditions before submitting.
                </div>

                <div>
                  <p class="mt-6 mb-6" style="font-size: 14px">
                    By clicking 'Register', I confirm that I am a prescriber
                    appropriately experienced in managing immunomodulatory drugs
                    and that I have read and understand the Healthcare
                    Professional Brochure and agree to comply with all the
                    elements of the Pregnancy Prevention Programme described
                    within it.
                  </p>

                  <v-row dense>
                    <v-col cols="12" md="6">
                      <div class="custom-field plain-wrapper">
                        <label class="plain-label">Prescriber Name</label>
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
              <div class="success-icon-wrapper pa-4">
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

          <!-- -- {{ allDocsClicked }} -->
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
      confirmGuideRead: false,
      jobtitles: [],
      step: 1,
      isFormValid: false,
      medicationError: false,
      loading: false,

      hospitals: [],

      medications: [],

      form: {
        name: "",
        lastname: "",
        reg_no: "",
        job_title: "",
        institution_id: "",
        address: "",
        medications: [],
        email: "",
        password: "",
        confirmPassword: "",
        signature: "",
        signature_date: "",
      },
      confirmationError: false,
      showSuccessDialog: false,
      btndisable: false,

      medicationTerms: [],

      confirmationChecks: {},
      showConfirmationDialog: false,

      showPassword: false,
      showConfirmPassword: false,
      docClicks: {},

      showDocErrorDialog: false,
      showDocSuccessDialog: false,
      showValidation: false,
    };
  },
  mounted() {
    this.fetchInstitutions();
    this.fetchLov();
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
          const prescriber = this.profile_details?.prescriber_details?.[0];
          this.form.name = this.profile_details?.name || "";
          this.form.lastname = this.profile_details?.lastname || "";
          this.form.reg_no = prescriber?.reg_no || "";
          this.form.job_title = prescriber?.job_title || "";
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
    allPasswordValid() {
      return (
        this.hasMinLength &&
        this.hasUppercase &&
        this.hasNumber &&
        this.hasSpecial
      );
    },
    passwordsMatch() {
      return (
        this.form.password &&
        this.form.confirmPassword &&
        this.form.password === this.form.confirmPassword
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
    progress() {
      if (this.step === 1) return 50;

      if (this.step === 2 && !this.registrationCompleted) return 80;

      if (this.registrationCompleted) return 100;

      return 50;
    },

    //field rules
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
  },

  methods: {
    getErrorClass(drugId, index) {
      return this.showValidation && !this.confirmationChecks[drugId]?.[index];
    },
    ruleClass(condition) {
      return condition
        ? "text-success d-flex align-center"
        : "text-error d-flex align-center";
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
    markDocClicked(drugId, questionId) {
      if (!this.docClicks[drugId]) {
        this.docClicks[drugId] = {};
      }

      this.docClicks[drugId][questionId] = true;
    },
    getDrug(drugId) {
      return this.medicationTerms.find((d) => Number(d.id) === Number(drugId));
    },
    fetchLov() {
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
        .get("fetchlookup", {
          params: {
            lookup_type: "JOB_TITLES",
          },
        })
        .then((res) => {
          this.jobtitles = res.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    async fetchPolicyQuestions() {
      try {
        this.loading = true;
        if (!this.form.medications.length) return;

        const res = await this.$axios.get("fetch_policy_questions", {
          params: {
            type: "Prescriber",
            medications: this.form.medications,
          },
        });

        this.medicationTerms = res.data.medications || [];
        this.loading = false;
      } catch (error) {
        this.$toast.error("Failed to load confirmation questions");
        this.loading = false;
      }
    },

    async fetchInstitutions() {
      try {
        const res = await this.$axios.get("fetchactiveinstitutions", {
          params: {
            type: "Hospital",
          },
        });

        if (res.data.status === "S") {
          let institutions = res.data.institutions;

          const prescriberDetails =
            this.profile_details?.prescriber_details || [];
          console.log("prescriberDetails");
          console.log(prescriberDetails);
          // get all institution ids
          const existingInstitutionIds = prescriberDetails
            .filter((p) => p.reg_status != "Rejected")
            .map((p) => p.institution_id)
            .filter(Boolean);

          // filter only if any institution ids exist
          if (existingInstitutionIds.length) {
            institutions = institutions.filter(
              (inst) => !existingInstitutionIds.includes(inst.id)
            );
          }

          this.hospitals = institutions;
        }
      } catch (error) {
        this.hospitals = [];
      }
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
    populateAddress(id) {
      const hospital = this.hospitals.find((h) => h.id === id);
      this.form.address = hospital ? hospital.address : "";
    },

    async goToNextStep() {
      this.medicationError = this.form.medications.length === 0;

      const { valid } = await this.$refs.formRef.validate();

      if (!valid || this.medicationError) return;
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
    goToPreviousStep() {
      this.resetConfirmation();
      this.step = 1;
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
        reg_no: this.form.reg_no,
        job_title: this.form.job_title,
        institution_id: this.form.institution_id,
        address: this.form.address,
        medications: this.form.medications,
        email: this.form.email,
        password: this.form.password,
        signature: this.form.signature,
        signature_date: this.form.signature_date,
        from_page: this.fromPage,
        user_id: this.profile_details?.id || 0,
      };

      this.$axios
        .post("prescriber_register", payload)
        .then((res) => {
          if (res.data.status == "E") {
            this.$toast.error(res.data.message);
          } else {
            this.showSuccessDialog = true;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    returnToSelection() {
      this.$emit("category-selected", null);
    },
    // added by Raghavendra to return to myprofile
    returnToMyProfile() {
      this.$emit("show-profile", false);
    },
    // added by Raghavendra to return to myprofile
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
  min-width: 200px;
  font-weight: bold !important;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
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
.check :deep(.v-label.v-label--clickable) {
  pointer-events: none !important;
}
</style>
