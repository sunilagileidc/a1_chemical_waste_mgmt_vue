<template>
  <div>
    <v-container fluid class="page-wrapper background">
      <content-loader v-if="loader"></content-loader>
      <confirmation-dialog
        ref="confirmationDialog"
        :title="dialogTitle"
        :message="dialogMessage"
      />
      <v-container class="py-0">
        <alert-popup
          v-model="showAlert"
          :message="alertMessage"
          :confirmText="confirmText"
          :type="confirmType"
        />
        <v-card class="pa-8 form-card" elevation="10" v-if="!showPharReg">
          <!-- ================= HEADER ================= -->
          <div class="d-flex justify-end align-center flex-wrap">
            <div class="text-center">
              <!-- IMAGE UPLOAD COMPONENT -->
              <image-upload
                v-if="!isViewMode"
                :folder="'user_profile'"
                :resizewidth="200"
                :resizeheight="200"
                :upload_profile="uploadfile"
                @uploaded_image="uploaded_image"
              />
            </div>
            <!-- Action Buttons -->
            <!-- <div
              class="nhs-note mx-3"
              v-if="
                page_from == 'view' &&
                profile_details.reg_status !== 'Approved' &&
                profile_details.reg_status !== 'Rejected'
              "
            >
              <v-icon class="note-icon" size="20"
                >mdi-alert-circle-outline</v-icon
              >
              <span>
                Professional email address is required for successful account
                validation
                
              </span>
            </div> -->
            <div class="d-flex">
              <!-- <div
                class="d-flex justify-end"
                v-if="
                  action_permissions.includes('APPROVE REG USER') &&
                  page_from == 'view' &&
                  profile_details.reg_status !== 'Approved' &&
                  profile_details.reg_status !== 'Rejected'
                "
              >
                <v-btn
                  class="status-approved mr-3"
                  size="small"
                  @click="updateStatus(profile_details, 'Approved', 1)"
                >
                  Approve
                </v-btn>

                <v-btn
                  v-if="action_permissions.includes('REJECT REG USER')"
                  color="red"
                  size="small"
                  @click="openRejectDialog(profile_details)"
                >
                  Reject
                </v-btn>
              </div> -->
              <v-btn
                v-if="isViewMode && icon_page_from == 'eye'"
                size="small"
                variant="outlined"
                class="register-btn ml-2"
                @click="goBackToDetails()"
              >
                Back
              </v-btn>
            </div>
            <!-- Action Buttons -->

            <div class="d-flex justify-end ml-3" v-if="icon_page_from != 'eye'">
              <!-- ================= VIEW MODE BUTTON ================= -->

              <v-btn
                v-if="
                  action_permissions.includes('SUSPICIOUS ACTOR') &&
                  page_from == 'view' &&
                  profile_details.is_suspicious_actor == 0 &&
                  profile_details.status == 1
                "
                class="mr-3 text-none"
                size="small"
                color="error"
                @click="updateSuspiciousActor(profile_details.id)"
              >
                Mark as Suspicious User
              </v-btn>

              <v-btn
                v-if="isViewMode"
                @click="isViewMode = false"
                class="complete-btn"
                color="primary"
                size="small"
              >
                Edit Profile <b> ✓</b>
              </v-btn>
              <v-btn
                v-if="isViewMode"
                size="small"
                variant="outlined"
                class="register-btn ml-2"
                @click="goBackToDetails()"
              >
                Back
              </v-btn>

              <!-- ================= EDIT MODE BUTTONS ================= -->
              <!-- v-if="!isViewMode && profile_details.reg_status == 'Approved'" -->
              <template v-if="!isViewMode">
                <!-- CANCEL BUTTON -->
                <v-tooltip :text="$t('cancel')" location="bottom">
                  <template #activator="{ props }">
                    <v-btn
                      size="small"
                      v-bind="props"
                      @click="cancel()"
                      :disabled="loading"
                      class="mr-3 btn-cancel"
                      color="btn-cancel"
                    >
                      Cancel
                    </v-btn>
                  </template>
                </v-tooltip>

                <!-- SUBMIT BUTTON -->
                <v-tooltip :text="$t('submit')" location="bottom">
                  <template #activator="{ props }">
                    <v-btn
                      size="small"
                      v-bind="props"
                      :disabled="isDisabled"
                      @click="submit"
                      color="success"
                      class="complete-btn"
                    >
                      {{ $t("submit") }}

                      <v-progress-circular
                        v-if="isDisabled"
                        indeterminate
                        size="16"
                        width="2"
                        color="white"
                        class="ml-2"
                      />
                    </v-btn>
                  </template>
                </v-tooltip>
              </template>
            </div>
          </div>
          <!-- {{ profile_details.prescriber_details[0].reg_no }} -->
          <no-data-found
            text="No data Found"
            v-if="profile_details.length == 0"
          />
          <!-- ================= PERSONAL DETAILS ================= -->
          <div v-if="profile_details.role">
            <div class="theme-header text-title-case mt-2">
              Personal Details -
              {{
                profile_details.rolename === "Pharmacist"
                  ? profile_details.pharmacist_role
                  : profile_details.rolename
              }}
            </div>
            <hr class="my-1" />
            <v-row class="mt-3">
              <v-col cols="12" md="3">
                <v-text-field
                  v-if="!isViewMode"
                  label="First name"
                  v-model="profile_details.name"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="field-required"
                  hide-details="auto"
                  :readonly="
                    !['SuperUser', 'PCG Admin', 'PCG User'].includes(
                      user?.rolename
                    )
                  "
                  :disabled="
                    !['SuperUser', 'PCG Admin', 'PCG User'].includes(
                      user?.rolename
                    )
                  "
                />
                <div v-else>
                  <b>First Name</b>
                  <p>{{ profile_details.name ?? "-" }}</p>
                </div>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-if="!isViewMode"
                  label="Last name"
                  v-model="profile_details.lastname"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="field-required"
                  hide-details="auto"
                  :readonly="
                    !['SuperUser', 'PCG Admin', 'PCG User'].includes(
                      user?.rolename,
                      user?.rolename
                    )
                  "
                  :disabled="
                    !['SuperUser', 'PCG Admin', 'PCG User'].includes(
                      user?.rolename
                    )
                  "
                />
                <div v-else>
                  <b>Last Name</b>
                  <p>{{ profile_details.lastname ?? "-" }}</p>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <div>
                  <b>Email</b>
                  <p>{{ profile_details.email ?? "-" }}</p>
                </div>
              </v-col>

              <v-col cols="12" md="3">
                <div>
                  <b>Role</b>
                  <p>{{ profile_details.rolename ?? "-" }}</p>
                </div>
              </v-col>

              <v-col cols="12" md="3">
                <v-switch
                  v-if="!isViewMode"
                  v-model="profile_details.status"
                  @update:modelValue="handleStatusToggle"
                  :disabled="
                    user.rolename != 'SuperUser' && user.rolename != 'PCG Admin'
                  "
                  :label="$t('status')"
                  :true-value="1"
                  :false-value="0"
                  color="success"
                  hide-details
                  inset
                  small
                />
                <div v-else>
                  <b>Status</b>
                  <p>
                    <b
                      class="status-text-approved"
                      v-if="profile_details.status == 1"
                      >Active</b
                    >
                    <b class="status-text-warning" v-else>Inactive</b>
                  </p>
                </div>
              </v-col>

              <v-col
                cols="12"
                md="3"
                v-if="!isViewMode && profile_details.reg_status == 'Rejected'"
              >
                <v-text-field
                  v-if="!isViewMode && profile_details.reg_status == 'Rejected'"
                  label="Rejection Reason"
                  v-model="profile_details.rejection_reason"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  class="field-required"
                  hide-details="auto"
                  readonly
                />
                <div
                  v-if="isViewMode && profile_details.reg_status == 'Rejected'"
                >
                  <b>Rejected Reason</b>
                  <p>
                    {{ profile_details.rejection_reason ?? "-" }}
                  </p>
                </div>
              </v-col>
              <v-col cols="12" md="3">
                <v-switch
                  v-if="!isViewMode"
                  v-model="profile_details.email_subscription"
                  :label="$t('email_subscription')"
                  :true-value="1"
                  :false-value="0"
                  color="success"
                  hide-details
                  inset
                  small
                />

                <div v-else>
                  <b>Email Subscription</b>
                  <p>
                    <b
                      class="status-text-approved"
                      v-if="profile_details.email_subscription == 1"
                      >Yes</b
                    >
                    <b class="status-text-warning" v-else>No</b>
                  </p>
                </div>
              </v-col>

              <!-- <v-col
                cols="12"
                md="3"
                v-if="profile_details.rolename === 'Pharmacist'"
              >
            <div v-if="!isViewMode">
                  <v-text-field
                    v-if="!isViewMode"
                    label="Wholesaler"
                    v-model="profile_details.wholesalers.acc_no"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    hide-details="auto"
                  />
                </div>
                <div v-else>
                  <b>Wholesaler</b>
                  <p>
                    {{ profile_details.wholesalers.acc_no }}
                  </p>
                </div>
              </v-col> -->
              <!-- <v-col
                cols="12"
                md="3"
                v-if="
                  user.rolename === 'SuperUser' || user.rolename === 'PCG Admin'
                "
              >
                <div>
                  <b>Registration status</b>
                  <p>{{ profile_details.reg_status ?? "-" }}</p>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="3"
                v-if="
                  (user.rolename === 'SuperUser' ||
                    user.rolename === 'PCG Admin') &&
                  profile_details.rejection_reason
                "
              >
                <div>
                  <b>Registration Reason</b>
                  <p>{{ profile_details.rejection_reason ?? "-" }}</p>
                </div>
              </v-col> -->
            </v-row>
          </div>
          <!-- ================= REGISTERED HOSPITALS ================= -->
          <div
            class="hospital-section mt-4"
            v-if="
              profile_details.role &&
              !['SuperUser', 'Nurse', 'PCG Admin', 'PCG User'].includes(
                profile_details?.role?.rolename
              )
            "
          >
            <div class="connected-wrapper pa-4 mb-5">
              <div class="header-wrapper mb-3">
                <div class="header-left">
                  <span>Connected Nurses</span>
                  <span class="count">
                    ({{ profile_details.connected_nurses.length }})
                  </span>
                </div>

                <v-btn
                  size="small"
                  v-if="action_permissions.includes('CONNECTED NURSES')"
                  class="btn-filled theme-bg"
                  @click="addNurse()"
                >
                  Add Nurse
                </v-btn>
              </div>
              <div
                v-if="profile_details.connected_nurses?.length"
                class="chips-container"
              >
                <div
                  v-for="nurse in profile_details.connected_nurses"
                  :key="nurse.id"
                  class="chip-hover-wrapper"
                  @mouseenter="hovered = nurse.id"
                  @mouseleave="hovered = null"
                >
                  <!-- CHIP -->
                  <v-chip
                    class="ma-2 rounded-chip"
                    color="indigo"
                    prepend-icon="mdi-account-circle"
                  >
                    {{ nurse.full_name }}
                  </v-chip>

                  <!-- PREMIUM HOVER CARD -->
                  <transition name="fade-slide">
                    <div v-if="hovered === nurse.id" class="hover-popup">
                      <div class="popup-header-flex">
                        <div class="popup-header">
                          <div class="avatar-big">
                            {{ getInitials(nurse.full_name) }}
                          </div>
                          <div>
                            <!-- <span class="role">
                              {{ nurse.salutation || "Nurse" }}
                            </span> -->
                            <div class="name">{{ nurse.full_name }}</div>
                          </div>
                        </div>

                        <!-- EXISTING ICON (just styled) -->
                        <router-link
                          v-if="action_permissions.includes('CONNECTED NURSES')"
                          :to="{
                            name: 'nurse_creation',
                            query: {
                              slug: nurse.slug,
                              from: 'view_profile',
                            },
                          }"
                          class="edit-icon-wrapper"
                        >
                          <v-icon class="edit-icon">
                            mdi-pencil-outline
                          </v-icon>
                        </router-link>
                      </div>

                      <div class="popup-body">
                        <div class="info-row">📧 {{ nurse.email }}</div>
                        <!-- <div class="info-row">📱 {{ nurse.mobile }}</div> -->
                        <!-- Institutions -->
                        <div
                          v-if="
                            nurse.other_user_details &&
                            nurse.other_user_details.length
                          "
                          class="mt-2"
                        >
                          <div class="institution-heading">Institutions</div>

                          <div class="institution-chips">
                            <v-chip
                              v-for="(
                                detail, index
                              ) in nurse.other_user_details"
                              :key="index"
                              size="small"
                              class="ma-1 rounded-chip-institute"
                              text-color="black"
                            >
                              {{ detail.institution?.name }}
                            </v-chip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <div v-else class="no-data">No connected nurses found</div>
            </div>
            <div
              class="connected-wrapper pa-4 mb-5"
              v-if="
                action_permissions.includes('CONNECTED USERS') &&
                profile_details.pharmacist &&
                profile_details.pharmacist.institution_type ==
                  'Inpatient Pharmacy'
              "
            >
              <div class="header-wrapper mb-3">
                <div class="header mb-3">
                  <span>Connected Pharmacies</span>
                  <span class="count"
                    >({{ profile_details.connected_pharmacies.length }})</span
                  >
                </div>
                <v-btn
                  size="small"
                  v-if="action_permissions.includes('CONNECTED USERS')"
                  class="btn-filled theme-bg"
                  @click="addConnectedPharmacies('Outpatient')"
                >
                  Add Connected Pharmacies
                </v-btn>
              </div>

              <div
                v-if="profile_details.connected_pharmacies?.length"
                class="chips-container"
              >
                <div
                  v-for="pharmacies in profile_details.connected_pharmacies"
                  :key="pharmacies.id"
                  class="chip-hover-wrapper"
                  @mouseenter="hovered = pharmacies.id"
                  @mouseleave="hovered = null"
                >
                  <!-- CHIP -->
                  <v-chip
                    class="ma-2 rounded-chip"
                    color="success"
                    prepend-icon="mdi-server-plus"
                  >
                    {{ pharmacies.name }}
                  </v-chip>

                  <!-- PREMIUM HOVER CARD -->
                  <transition name="fade-slide">
                    <div v-if="hovered === pharmacies.id" class="hover-popup">
                      <div class="popup-header">
                        <div class="avatar-big">
                          {{ getInitials(pharmacies.name) }}
                        </div>
                        <div>
                          <div class="name">{{ pharmacies.name }}</div>
                        </div>
                      </div>

                      <div class="popup-body">
                        <div class="info-row">📍 {{ pharmacies.address }}</div>
                        <div class="info-row">
                          📬 {{ pharmacies.post_code }}
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <div v-else class="no-data">No connected pharmacies found</div>
            </div>
            <div
              class="connected-wrapper pa-4 mb-5"
              v-if="
                action_permissions.includes('CONNECTED USERS') &&
                profile_details.pharmacist &&
                profile_details.pharmacist.institution_type ==
                  'Inpatient Pharmacy'
              "
            >
              <div class="header-wrapper mb-3">
                <div class="header mb-3">
                  <span>Connected Homecares</span>
                  <span class="count"
                    >({{ profile_details.connected_homecares.length }})</span
                  >
                </div>
                <v-btn
                  size="small"
                  v-if="action_permissions.includes('CONNECTED USERS')"
                  class="btn-filled theme-bg"
                  @click="addConnectedPharmacies('Homecare')"
                >
                  Add Connected Homecares
                </v-btn>
              </div>
              <div
                v-if="profile_details.connected_homecares?.length"
                class="chips-container"
              >
                <div
                  v-for="homecares in profile_details.connected_homecares"
                  :key="homecares.id"
                  class="chip-hover-wrapper"
                  @mouseenter="hovered = homecares.id"
                  @mouseleave="hovered = null"
                >
                  <!-- CHIP -->
                  <v-chip
                    class="ma-2 rounded-chip"
                    color="orange"
                    prepend-icon="mdi-server-plus"
                  >
                    {{ homecares.name }}
                  </v-chip>

                  <!-- PREMIUM HOVER CARD -->
                  <transition name="fade-slide">
                    <div v-if="hovered === homecares.id" class="hover-popup">
                      <div class="popup-header">
                        <div class="avatar-big">
                          {{ getInitials(homecares.name) }}
                        </div>
                        <div>
                          <div class="name">{{ homecares.name }}</div>
                        </div>
                      </div>

                      <div class="popup-body">
                        <div class="info-row">📍 {{ homecares.address }}</div>
                        <div class="info-row">📬 {{ homecares.post_code }}</div>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <div v-else class="no-data">No connected homecares found</div>
            </div>
            <div>
              <div
                v-if="profile_details.rolename == 'Pharmacist'"
                class="theme-header text-title-case"
              >
                Registered Institutions
              </div>
              <div
                v-if="profile_details.rolename == 'Prescriber'"
                class="theme-header text-title-case"
              >
                Registered Hospitals
              </div>
              <hr class="my-1" />

              <v-row class="mt-2">
                <!-- LEFT SIDE -->
                <v-col cols="12" md="5">
                  <v-btn
                    size="small"
                    v-for="item in hospitals"
                    :key="item.id"
                    block
                    class="mb-3"
                    :class="[
                      item.reg_status === 'Awaiting Approval'
                        ? 'red-pill'
                        : selectedHospital?.id === item.id
                        ? 'purple-pill'
                        : 'outline-pill',
                    ]"
                    :variant="
                      selectedHospital?.id === item.id ? 'flat' : 'outlined'
                    "
                    @click="selectedHospital = item"
                  >
                    {{ getHospitalName(item) }}
                  </v-btn>
                  <!-- {{ user.rolename }}
                {{ isViewMode }}
                {{ isAddHospitalDisabled }} -->

                  <v-btn
                    size="small"
                    :disabled="
                      isViewMode ||
                      isAddHospitalDisabled ||
                      !action_permissions.includes('ADD NEW HOSPITAL')
                    "
                    v-if="action_permissions.includes('ADD NEW HOSPITAL')"
                    block
                    variant="outlined"
                    class="outline-pill"
                    @click="addNewHospital"
                  >
                    <span v-if="profile_details.rolename == 'Pharmacist'"
                      >Add new institution</span
                    >
                    <span v-if="profile_details.rolename == 'Prescriber'"
                      >Add new hospital</span
                    >
                  </v-btn>
                </v-col>
                <!-- RIGHT SIDE -->
                <v-col cols="12" md="7" v-if="selectedHospital">
                  <v-row>
                    <v-col cols="12" md="6" class="pb-0">
                      <div>
                        <div class="info-label">Institution Name</div>
                        <div class="info-value">{{ selectedHospitalName }}</div>
                      </div>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      class="pb-0"
                      v-if="
                        selectedHospital.institution_data.institution_contacts
                      "
                    >
                      <div class="info-label">Chief Pharmacists</div>
                      <div class="info-value">
                        <span
                          v-if="
                            selectedHospital.institution_data
                              .institution_contacts.length
                          "
                        >
                          <span
                            v-for="(contact, index) in selectedHospital
                              .institution_data.institution_contacts"
                            :key="contact.id"
                          >
                            {{ contact.name }}
                            <span
                              v-if="
                                index <
                                selectedHospital.institution_data
                                  .institution_contacts.length -
                                  1
                              "
                              >,
                            </span>
                          </span>
                        </span>
                        <span v-else>-</span>
                      </div>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      class="pb-0"
                      v-if="
                        user.rolename !== 'Pharmacist' &&
                        user.rolename !== 'Lead Pharmacist' &&
                        selectedHospital?.institution_data?.pharmacy_name
                      "
                    >
                      <div class="info-label">Pharmacy</div>
                      <div class="info-value">
                        {{ selectedHospital.institution_data.pharmacy_name }}
                      </div>
                    </v-col>

                    <v-col cols="12" md="6" class="py-0">
                      <div class="info-label">Address</div>
                      <div class="info-value">
                        {{ getHospitalAddress(selectedHospital) }}
                      </div>
                    </v-col>

                    <v-col
                      cols="12"
                      md="6"
                      class="py-0"
                      v-if="
                        user.rolename != 'Prescriber' &&
                        selectedHospital.dispensing_address
                      "
                    >
                      <div class="info-label">Dispensing Address</div>
                      <div class="info-value">
                        {{ selectedHospital.dispensing_address }}
                        <span v-if="selectedHospital.ordering_post_code"
                          >- {{ selectedHospital.ordering_post_code }}</span
                        >
                      </div>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      class="py-0"
                      v-if="
                        user.rolename != 'Prescriber' &&
                        selectedHospital.delivery_address
                      "
                    >
                      <div class="info-label">Delivery Address</div>
                      <div class="info-value">
                        {{ selectedHospital.delivery_address }}
                        <span v-if="selectedHospital.ordering_post_code"
                          >- {{ selectedHospital.delivery_post_code }}</span
                        >
                      </div>
                    </v-col>
                    <v-col cols="12" md="6" class="py-0">
                      <div class="info-label">Registration Status</div>
                      <div class="info-value">
                        <p>
                          <b
                            class="status-text-approved"
                            v-if="selectedHospital.reg_status == 'Approved'"
                            >Approved</b
                          >
                          <b
                            class="status-text-rejected"
                            v-else-if="
                              selectedHospital.reg_status == 'Rejected'
                            "
                            >Rejected</b
                          >
                          <b
                            class="status-text-warning"
                            v-else-if="
                              selectedHospital.reg_status == 'Awaiting Approval'
                            "
                            >Awaiting Approval</b
                          >
                        </p>
                      </div>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      class="py-0"
                      v-if="selectedHospital.rejection_reason != null"
                    >
                      <div class="info-label">Rejection Reason</div>
                      <div class="info-value">
                        {{ selectedHospital.rejection_reason }}
                      </div>
                    </v-col>

                    <v-col
                      cols="12"
                      md="6"
                      class="py-0"
                      v-if="user.rolename === 'Pharmacist'"
                    >
                      <div class="d-flex flex-column">
                        <b class="info-label">Wholesalers</b>
                        <div class="d-flex flex-wrap">
                          <template v-if="selectedHospital.wholesalers?.length">
                            <v-chip
                              class="rounded-chip mb-1 mr-1"
                              color="primary"
                              size="x-small"
                              prepend-icon="mdi-account-circle"
                              v-for="(
                                item, index
                              ) in selectedHospital.wholesalers"
                              :key="index"
                            >
                              {{ item?.wholesaler_name ?? "-" }}
                            </v-chip>
                          </template>

                          <span v-else>-</span>
                        </div>
                      </div>
                    </v-col>
                    <v-col
                      cols="12"
                      md="6"
                      class="py-0"
                      v-if="user.rolename === 'Pharmacist'"
                    >
                      <div
                        v-if="
                          !isViewMode &&
                          selectedHospital.reg_status == 'Approved'
                        "
                      >
                        <v-switch
                          v-if="!isViewMode"
                          v-model="selectedHospital.isLeadPharmacist"
                          :label="$t('Lead Pharmacist')"
                          :true-value="1"
                          :false-value="0"
                          color="success"
                          hide-details
                          inset
                          small
                          @click="storePreviousLeadValue"
                          @update:modelValue="confirmLeadPharmacistChange"
                        />
                      </div>
                      <div v-else>
                        <b class="info-label">Lead Pharmacist</b>
                        <p class="info-value">
                          <b
                            class="status-text-approved"
                            v-if="selectedHospital.isLeadPharmacist == 1"
                            >Yes</b
                          >
                          <b class="status-text-warning" v-else>No</b>
                        </p>
                      </div>
                    </v-col>
                  </v-row>
                  <!-- Action Buttons -->
                  <div class="d-flex align-center justify-space-between mt-4">
                    <div
                      class="nhs-note"
                      v-if="
                        action_permissions.includes('APPROVE REG USER') &&
                        page_from == 'view' &&
                        selectedHospital.reg_status !== 'Approved' &&
                        selectedHospital.reg_status !== 'Rejected'
                      "
                    >
                      <v-icon class="note-icon" size="20"
                        >mdi-alert-circle-outline</v-icon
                      >
                      <span>
                        Professional email address is required for successful
                        account validation
                        <!-- <strong>HCP-related email</strong>. -->
                      </span>
                    </div>

                    <div
                      class="d-flex justify-end"
                      v-if="
                        action_permissions.includes('APPROVE REG USER') &&
                        page_from == 'view' &&
                        selectedHospital.reg_status !== 'Approved' &&
                        selectedHospital.reg_status !== 'Rejected'
                      "
                    >
                      <v-btn
                        class="btn-approved mr-3"
                        size="small"
                        @click="updateStatus(profile_details, 'Approved', 1)"
                      >
                        Approve
                      </v-btn>

                      <v-btn
                        class="btn-reject"
                        size="small"
                        @click="openRejectDialog(profile_details)"
                      >
                        Reject
                      </v-btn>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                </v-col>
              </v-row>
            </div>
            <div
              v-if="
                profile_details.role &&
                profile_details.role.rolename !== 'SuperUser' &&
                profile_details.role.rolename !== 'Nurse'
              "
            >
              <!-- ================= DRUG REGISTRATION DETAILS ================= -->
              <div class="d-flex justify-space-between">
                <div class="theme-subheader mt-6">
                  Drug registration details for -
                  {{ getHospitalName(selectedHospital) }}
                </div>
                <v-btn
                  v-if="
                    action_permissions.includes('FORCE REREGISTER DRUG') &&
                    profile_details.reg_status == 'Approved'
                  "
                  :disabled="!selectedDrugs.length"
                  size="small"
                  class="btn-filled mt-4"
                  @click="forceToReRegisterBulk(selectedDrugs)"
                >
                  <v-icon size="18" class="mr-2">mdi-account-reactivate</v-icon>
                  Force to Re-Register
                </v-btn>
              </div>
              <hr class="my-1" />
              <v-row
                class="mt-3"
                v-for="(drug, index) in drugs
                  .filter(
                    (drug) =>
                      !(
                        (user.rolename === 'SuperUser' ||
                          user.rolename === 'PCG Admin') &&
                        drug.isNew
                      )
                  )
                  .sort((a, b) => b.isNew - a.isNew)"
                :key="index"
              >
                <v-col cols="12">
                  <v-card
                    class="pa-4 drug-card"
                    :class="{ 'selected-card': isSelected(drug) }"
                    variant="outlined"
                  >
                    <v-row align="center">
                      <!-- DRUG NAME -->
                      <v-col cols="12" md="3" class="d-flex align-center">
                        <!-- <v-icon size="28" color="primary" class="mr-2">
                          mdi-pill
                        </v-icon> -->
                        <div>
                          <div class="text-caption text-grey">Drug Name</div>
                          <div class="text-subtitle-1 font-weight-medium">
                            {{ getDrugName(drug.drug_id) }}
                          </div>
                        </div>
                      </v-col>
                      <!-- START DATE -->
                      <v-col cols="12" md="3" class="d-flex align-center">
                        <!-- <v-icon size="22" color="info" class="mr-2">
                          mdi-calendar-start
                        </v-icon> -->

                        <div>
                          <div class="text-caption text-grey">
                            Date of most recent registration
                          </div>
                          <div class="text-body-1">
                            {{
                              drug.start_date
                                ? formatDate(drug.start_date)
                                : "-"
                            }}
                          </div>
                        </div>
                      </v-col>

                      <!-- END DATE -->
                      <v-col cols="12" md="2" class="d-flex align-center">
                        <!-- <v-icon size="22" color="warning" class="mr-2">
                          mdi-calendar-end
                        </v-icon> -->

                        <div>
                          <div class="text-caption text-grey">
                            Date of registration expiry
                          </div>
                          <div class="text-body-1">
                            {{
                              drug.end_date ? formatDate(drug.end_date) : "-"
                            }}
                          </div>
                        </div>
                      </v-col>
                      <!-- STATUS SECTION (UNCHANGED LOGIC) -->
                      <v-col cols="12" md="3">
                        <div
                          class="d-flex flex-column flex-md-row align-md-center"
                        >
                          <!-- STATUS BUTTON -->
                          <v-btn
                            v-if="!drug.isNew"
                            size="small"
                            elevation="0"
                            class="mr-2 fixed-status-btn"
                            :style="{
                              cursor:
                                !isExpired(drug) && !isNearExpiry(drug)
                                  ? 'default'
                                  : 'pointer',
                            }"
                            :color="
                              isExpired(drug)
                                ? 'red'
                                : isNearExpiry(drug)
                                ? 'orange'
                                : 'green'
                            "
                          >
                            <v-icon start size="16">
                              {{
                                isExpired(drug)
                                  ? "mdi-alert-circle"
                                  : isNearExpiry(drug)
                                  ? "mdi-clock-outline"
                                  : "mdi-check-circle"
                              }}
                            </v-icon>

                            {{
                              isExpired(drug)
                                ? "Expired"
                                : isNearExpiry(drug)
                                ? "Renew"
                                : "Valid"
                            }}
                          </v-btn>

                          <!-- REGISTER / RE-REGISTER BUTTON -->

                          <v-btn
                            v-if="
                              drug.isNew ||
                              ((isExpired(drug) || isNearExpiry(drug)) &&
                                action_permissions.includes('REGISTER DRUG'))
                            "
                            size="small"
                            class="btn-filled"
                            @click="reRegister(drug)"
                          >
                            <v-icon start size="16">
                              {{ drug.isNew ? "mdi-plus" : "mdi-refresh" }}
                            </v-icon>

                            {{ drug.isNew ? "Register" : "Re-Register" }}
                          </v-btn>
                          <!-- REGISTER / RE-REGISTER BUTTON -->
                          <!-- Force To expire drug BUTTON -->

                          <v-tooltip text="Force to re-register">
                            <template #activator="{ props }">
                              <v-btn
                                v-if="
                                  action_permissions.includes(
                                    'FORCE REREGISTER DRUG'
                                  ) &&
                                  isRestrictedRole(drug) &&
                                  profile_details.reg_status == 'Approved'
                                "
                                v-bind="props"
                                icon
                                size="x-small"
                                class="btn-filled ml-2"
                                @click="forceToReRegister(drug)"
                              >
                                <v-icon size="18"
                                  >mdi-account-reactivate</v-icon
                                >
                              </v-btn>
                            </template>
                          </v-tooltip>
                        </div>

                        <!-- WARNING / EXPIRED TEXT -->
                        <div class="mt-1">
                          <small
                            v-if="drug.expiry_reason"
                            class="text-red text-caption mb-0"
                            >Expiry reason: {{ drug.expiry_reason }}</small
                          >
                          <p
                            v-if="
                              isNearExpiry(drug) &&
                              user.rolename != 'SuperUser' &&
                              user.rolename != 'PCG Admin' &&
                              new Date(drug.end_date + 'T00:00:00') < new Date()
                            "
                            class="text-orange text-caption mb-0"
                          >
                            Will expire in {{ getExpiryDays(drug) }} day<span
                              v-if="getExpiryDays(drug) !== 1"
                              >s</span
                            >, Please re-register
                          </p>

                          <p
                            v-else-if="
                              isExpired(drug) &&
                              user.rolename != 'SuperUser' &&
                              user.rolename != 'PCG Admin' &&
                              drug.expiry_reason == null &&
                              new Date(drug.end_date + 'T00:00:00') < new Date()
                            "
                            class="text-red text-caption mb-0"
                          >
                            Expired {{ Math.abs(getExpiryDays(drug)) }} day<span
                              v-if="Math.abs(getExpiryDays(drug)) !== 1"
                              >s</span
                            >
                            ago, Please re-register
                          </p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="1">
                        <v-checkbox
                          v-model="selectedDrugs"
                          :value="drug"
                          hide-details
                          density="compact"
                          v-if="
                            action_permissions.includes(
                              'FORCE REREGISTER DRUG'
                            ) &&
                            isRestrictedRole(drug) &&
                            profile_details.reg_status == 'Approved'
                          "
                        />
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <!-- User Authentication Component Start -->
            <user-authentication
              :showauthentication="authflag"
              @update:showauthentication="authflag = $event"
              @confirmed="handleLeadConfirmed"
              @cancelled="handleLeadCancelled"
              dialogTitle="Lead Pharmacist Authorization"
              dialogDesc="Please Enter your Password to Confirm"
            />
            <!-- User Authentication Component Start -->

            <!-- <user-drugs :user_slug="$route.query.slug"></user-drugs> -->
            <!-- Terms And Conditions Start -->

            <!-- Terms and Conditions Dialog -->
            <v-dialog v-model="termsDialog" max-width="1000">
              <v-card class="form-card">
                <v-card-title>Terms & Conditions</v-card-title>
                <v-card-text>
                  <h6 class="section-title mt-0 mb-6">
                    <div class="d-flex align-center">
                      <span class="section-text theme-subheader">
                        {{ profile_details.rolename }} Confirmation
                      </span>
                      <!-- <v-divider class="ml-4"></v-divider> -->
                    </div>
                  </h6>
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
                                class="doc-link"
                                @click="markDocClicked(drugId, term.id)"
                              >
                                {{ term.doc_title }}
                              </a>
                            </span>
                          </div>
                        </template>
                      </template>
                    </div>
                    <div
                      v-if="confirmationError"
                      style="color: red; font-size: 12px; margin-top: 8px"
                    >
                      Please accept all terms and conditions before submitting.
                    </div>

                    <div>
                      <div class="note-box">
                        By clicking register, I understand that if during the
                        period of registration I am unable to fulfil
                        requirements 1-11, the above named pharmacy will be de
                        registered by Company Name and I will be unable to order
                        any further
                        {{ getCommaSeparatedDrugNames(selDrugList) }} and
                        required to go through the registration process again,
                        following any necessary remedial action(s). I
                        acknowledge this registration to order and dispense
                        {{ getValidityText(selDrugList) }} only, after which I
                        am required to re register the above named pharmacy
                        should I wish to continue to order and dispense
                        {{ getCommaSeparatedDrugNames(selDrugList) }}.
                      </div>

                      <v-row dense>
                        <v-col cols="12" md="6">
                          <div class="custom-field plain-wrapper">
                            <label class="plain-label"
                              >{{ profile_details.rolename }} Name</label
                            >
                            <div class="plain-value">
                              {{ form.signature }}
                            </div>
                          </div>
                        </v-col>

                        <v-col cols="12" md="6">
                          <div class="custom-field plain-wrapper">
                            <label class="plain-label">Date</label>
                            <div class="plain-value">
                              {{ formatDate(form.signature_date) }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions class="justify-end">
                  <div class="form-actions d-flex justify-space-between">
                    <v-btn
                      size="small"
                      variant="outlined"
                      class="btn-outline"
                      @click="termsDialog = false"
                    >
                      Close
                    </v-btn>
                    <v-btn
                      size="small"
                      class="btn-filled theme-bg"
                      @click="submitForm()"
                      :disabled="btndisable"
                    >
                      Register
                    </v-btn>
                  </div>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
                  You must agree to all required statements before submitting
                  the form. Please review the checkboxes and confirm your
                  agreement.
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
                <div class="success-icon-wrapper mt-3">
                  <div class="success-circle">
                    <v-icon size="48" class="success-icon"> mdi-check </v-icon>
                  </div>
                </div>

                <!-- Title -->
                <h2 class="success-title">Registration Completed</h2>

                <!-- Description -->
                <p class="success-description">
                  Your drug has been successfully registered and updated.
                </p>

                <!-- Divider -->
                <v-divider class="my-6"></v-divider>

                <!-- Action Button -->
                <v-btn
                  class="success-login-btn"
                  size="large"
                  @click="closeAllModals()"
                >
                  close
                </v-btn>
              </v-card>
            </v-dialog>
            <!-- Terms And Conditions End -->
          </div>
        </v-card>
        <!-- Calling Pharmacist Registration Form -->
        <div class="d-flex justify-center" v-else>
          <pharmacist-registration
            v-if="user.rolename === 'Pharmacist'"
            :profile_details="profile_details"
            fromPage="my-profile"
            @show-profile="ViewProfile"
          />
          <prescriber-registration
            v-if="user.rolename === 'Prescriber'"
            :profile_details="profile_details"
            fromPage="my-profile"
            @show-profile="ViewProfile"
          />
        </div>
        <!-- Calling Pharmacist Registration Form -->
      </v-container>
    </v-container>

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
            Please review the following required document(s) before continuing:
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
            class="status-rejected mb-2 mr-3"
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
          Please confirm below that you have read and understood the Healthcare
          Professionals Information Guide
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
              Professionals information guide and understand the PPP materials.
            </span>
          </template>
        </v-checkbox>

        <!--  Next button disabled until checked -->
        <v-btn
          color="green"
          :disabled="!confirmGuideRead"
          @click="finalSubmit(selectedDrug, profile_details.rolename)"
        >
          Next
        </v-btn>
      </v-card>
    </v-dialog>
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
    <!-- User status Authentication Component Start -->
    <user-authentication
      :showauthentication="changeStatusDialog"
      @update:showauthentication="changeStatusDialog = $event"
      @confirmed="updateUserStatus"
      @cancelled="cancelStatusUpdate"
      dialogTitle="Confirm Status Change"
      dialogDesc="You are about to change the user status. Please enter your password to confirm this action."
    />
    <!-- User status Authentication Component end -->
  </div>
</template>

<script>
import DatePicker from "../../CustomComponents/DatePicker.vue";
export default {
  components: { DatePicker },
  data: () => ({
    dialogMessage: "",
    dialogTitle: "",
    envImagePath: import.meta.env.VITE_IMAGE_PATH,
    loader: false,
    loading: false,
    changeStatusDialog: false,
    showPassword: false,
    oldStatus: null,
    profile_details: {
      id: 0,
      salutation: null,
      name: "",
      middlename: "",
      lastname: "",
      gender: null,
      email: "",
      image_url: "",
      postcode: "",
      dob: "",
      profession: "",
      maritalstatus_id: null,
      country: null,
      state: null,
      city: null,
      address: "",
      email_subscription: 1,
      status: 1,
      description: "",
      role_id: null,
      mobile: "",
      mobile_code: null,
      store_id: null,
    },
    selectedHospital: null,
    user: "",
    isDisabled: false,
    show_update: false,
    isViewMode: true,
    uploadfile: false,
    google_icon: {
      icon_name: "account_circle",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    drugs: [],
    hospitals: [],
    drug_list: [],
    hospital_list: [],
    showAlert: false,
    alertMessage: "",
    confirmText: "",
    confirmType: "",
    rejectDialog: false,
    rejectReason: "",
    rejectObj: null,
    role_array_view_profile: [],
    page_from: "",
    icon_page_from: "",
    medications: [],
    form: {
      medications: [],
      signature: "",
      signature_date: "",
    },
    medicationTerms: [],
    confirmationChecks: {},
    termsDialog: false,
    confirmationError: false,
    showSuccessDialog: false,
    showConfirmationDialog: false,
    selectedDrug: {},
    showDocErrorDialog: false,
    showDocSuccessDialog: false,
    docClicks: {},
    confirmGuideRead: false,
    showPharReg: false,
    rejected_reasons: [],
    showValidation: false,
    allDrugs: [],
    action_permissions: [],
    hovered: null,
    selectedDrugs: [],
    selDrugList: [],
    btndisable: false,
    previousLeadValue: 0,
    authflag: false,
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.action_permissions = JSON.parse(
      localStorage.getItem("action_permissions") || "[]"
    );
    this.showPharReg = false;
    // this.initialize();
    this.fetchLookup();
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
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
    maxDobDate() {
      const today = new Date();
      today.setFullYear(today.getFullYear() - 18);
      return today.toISOString().split("T")[0];
    },
    filteredHospitalList() {
      if (!this.selectedHospital) return this.hospital_list;

      const selectedIds = this.hospitals
        .filter((h) => h !== this.selectedHospital)
        .map((h) => h.institution_id);

      return this.hospital_list.filter(
        (hospital) => !selectedIds.includes(hospital.institution_id)
      );
    },

    isAddHospitalDisabled() {
      return this.hospitals.some(
        (h) => !h.institution_id || h.institution_id === null
      );
    },
    selectedHospitalName() {
      const hospital = this.hospital_list.find(
        (h) => h.institution_id === this.selectedHospital?.institution_id
      );
      return hospital ? hospital.name : "-";
    },
  },
  mounted() {
    this.showPharReg = false;

    this.fetchLov();
    this.fetchRoles();
  },
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     vm.fetchUsers();
  //   });
  // },
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.fetchUsers();
        }
      },
    },
    "$route.query.from": {
      immediate: true,
      handler() {
        if (this.$route.query.from) {
          this.page_from = this.$route.query.from;
        }
      },
    },
    "$route.query.icon": {
      immediate: true,
      handler() {
        if (this.$route.query.icon) {
          this.icon_page_from = this.$route.query.icon;
        }
      },
    },

    async selectedHospital(newHospital) {
      this.loader = true;
      const user = this.profile_details;
      if (!newHospital) {
        this.drugs = [];
        return;
      }
      this.selectedHospital.isLeadPharmacist =
        (this.selectedHospital.role || "").trim().toLowerCase() ===
        "lead pharmacist"
          ? 1
          : 0;

      try {
        await this.initialize(newHospital);

        const hospitalId = Number(newHospital.institution_data.id);
        const role = user.role?.rolename;
        // API params
        const params = {
          user_id: user.id,
          institution_id: hospitalId,
        };

        if (role === "Pharmacist") {
          params.role = role;
        } else if (role === "Prescriber") {
          params.role = role;
        }
        // API CALL
        const res = await this.$axios.get("get_inst_drugs", {
          params,
        });
        // let drugs = [];
        if (res.data.status === "S") {
          this.drugs = res.data.data || [];
        }
        // =====================================================
        // CREATE MAP (FAST LOOKUP)
        // =====================================================
        const drugMap = {};
        this.drugs.forEach((d) => {
          drugMap[d.drug_id] = d;
        });
        // =====================================================
        // MERGE LOGIC
        // =====================================================
        this.drugs = this.allDrugs
          .map((drug) => {
            const existing = drugMap[drug.id];
            //Existing drug
            console.log("existing:", existing); // 👈 prints value
            if (existing) {
              return {
                ...existing,
                drug_id: drug.id,
                isNew: false,
              };
            }

            //New drug
            return {
              id: null,
              user_id: user.id,
              drug_id: drug.id,
              prescriber_id: role === "Prescriber" ? hospitalId : null,
              pharmacist_id: role === "Pharmacist" ? hospitalId : null,
              is_check: 0,
              start_date: null,
              end_date: null,
              version: 0,
              expired: 0,
              expiry_reason: null,
              created_by: user.id,
              updated_by: null,
              created_at: null,
              updated_at: null,
              isNew: true,
            };
          })
          //New drugs at last
          .sort((a, b) => a.isNew - b.isNew);
      } catch (err) {
        console.error(err);
        this.$toast.error(this.$t("something_went_wrong"));
      } finally {
        await this.$nextTick(); // wait for DOM update
        this.selectedHospital = this.selectedHospital;
        this.loader = false;
      }
    },
  },
  methods: {
    getInitials(name) {
      if (!name) return "";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },

    async initialize(newHospital) {
      this.loader = true;
      const hospitalId = Number(newHospital.institution_data.id);
      const user = this.profile_details;
      const role = user.role?.rolename;
      try {
        // API params
        const params = {
          user_id: user.id,
          institution_id: hospitalId,
        };

        if (role === "Pharmacist") {
          params.role = role;
        } else if (role === "Prescriber") {
          params.role = role;
        }
        const res = await this.$axios.get("get_unregistred_drugs", {
          params,
        });
        this.allDrugs = res.data.drug || [];
        this.initval = false;
        // this.loader = false;
      } catch (err) {
        this.$toast.error(this.$t("something_went_wrong"));
        this.loader = false;
        this.initval = false;
        console.log(err);
      }
    },
    getErrorClass(drugId, index) {
      return this.showValidation && !this.confirmationChecks[drugId]?.[index];
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
    getDrugName(id) {
      // alert(id);
      return this.drug_list.find((d) => d.drug_id === id)?.drug_name || "-";
    },
    fetchRoles() {
      this.$axios
        .get("fetchrole")
        .then((response) => {
          this.role_array = response.data.roles;

          // Remove unwanted roles
          this.role_array_view_profile = this.role_array.filter((ele) => {
            return (
              ele.rolename === "Prescriber" || ele.rolename === "Pharmacist"
            );
          });

          if (
            this.user.rolename === "SuperUser" &&
            this.profile_details.id === 0
          ) {
            this.role_array_view_profile = this.role_array_view_profile.filter(
              (ele) => ele.rolename !== "SuperUser"
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatted_from_date(formatted_date) {
      this.profile_details.dob = formatted_date;
    },
    goBackToDetails() {
      if (
        this.$route.query.from == "amend" ||
        this.$route.query.from == "pafview" ||
        this.$route.query.from == "paf"
      ) {
        if (
          this.user.rolename == "Prescriber" ||
          this.user.rolename == "Pharmacist" ||
          this.user.rolename == "Nurse"
        ) {
          this.$router.push({ name: "institution_selection" });
        } else {
          this.$router.push({ name: "dashboard" });
        }
      } else {
        this.$router.push({ name: "registration_list" });
      }
    },
    fetchUsers() {
      this.loader = true;

      // Store previously selected hospital id
      const prevHospitalId = this.selectedHospital?.id;

      this.$axios
        .get("fetchuserdatabyslug/" + this.$route.query.slug)
        .then((res) => {
          if (res.data.status === "S") {
            const user = res.data.user;
            this.profile_details = user;

            // ROLE BASED HOSPITAL ASSIGNMENT
            if (user.role?.rolename === "Prescriber") {
              this.hospitals = user.prescriber_details || [];
            } else if (user.role?.rolename === "Pharmacist") {
              this.hospitals = user.pharmacist_details || [];
            } else {
              this.hospitals = [];
            }

            // Restore previously selected hospital if exists
            let selected = null;

            if (prevHospitalId) {
              selected = this.hospitals.find(
                (h) => Number(h.id) === Number(prevHospitalId)
              );
            }

            const instId = this.$route.query.inst_id;

            if (instId) {
              const selected = this.hospitals.find(
                (h) => String(h.id) === String(instId)
              );

              this.selectedHospital = selected || this.hospitals[0] || null;
            } else {
              this.selectedHospital = this.hospitals[0] || null;
            }

            // FILTER DRUGS
            if (this.selectedHospital) {
              const hospitalId = Number(this.selectedHospital.id);

              if (user.role?.rolename === "Prescriber") {
                this.drugs = (user.prescriber_medications || []).filter(
                  (drug) => Number(drug.prescriber_id) === hospitalId
                );
              } else if (user.role?.rolename === "Pharmacist") {
                this.drugs = (user.pharmacist_medications || []).filter(
                  (drug) => Number(drug.pharmacist_id) === hospitalId
                );
              } else {
                this.drugs = [];
              }
            } else {
              this.drugs = [];
            }
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
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
      // console.log("rejectObj");
      // console.log(this.rejectObj);
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
          institution_id: this.selectedHospital.institution_id,
          rolename: this.rejectObj.rolename,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchUsers();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
        });
    },
    addNewHospital() {
      this.showPharReg = true;
      // alert("add pharmacist");
      // this.$router.push({ name: "new-pharmacist-registration" });

      // const newHospital = {
      //   institution_id: null,
      //   user_id: this.profile_details.id,
      // };
      // this.hospitals.push(newHospital);
      // this.selectedHospital = newHospital;
    },
    ViewProfile(val) {
      this.showPharReg = val;
    },
    storePreviousLeadValue() {
      this.previousLeadValue = this.selectedHospital.isLeadPharmacist;
    },
    async confirmLeadPharmacistChange(newValue) {
      const oldValue = this.previousLeadValue;

      try {
        if (newValue == 0) {
          const confirmed = await this.showConfirmation(
            "Confirm",
            "Are you sure you want to remove Lead Pharmacist access?"
          );

          if (!confirmed) {
            this.selectedHospital.isLeadPharmacist = oldValue;
            return;
          }

          this.pendingLeadValue = 0;
          this.authflag = true;
          return;
        }

        const checkRes = await this.$axios.get(
          `check-lead-pharmacist/${this.selectedHospital.institution_id}`
        );

        if (checkRes.data.has_lead_pharmacist == 1) {
          const confirmed = await this.showConfirmation(
            "Confirm",
            "A Lead Pharmacist already exists for this Institution. Are you a Lead Pharmacist as well?"
          );

          if (!confirmed) {
            this.selectedHospital.isLeadPharmacist = oldValue;
            return;
          }
        }

        this.pendingLeadValue = 1;
        this.authflag = true;
      } catch (error) {
        this.selectedHospital.isLeadPharmacist = oldValue;
      }
    },
    handleLeadCancelled() {
      this.selectedHospital.isLeadPharmacist = this.previousLeadValue;
    },

    // Called when password verified successfully
    handleLeadConfirmed() {
      this.$toast.success("User verified successfully.");
      this.selectedHospital.isLeadPharmacist = this.pendingLeadValue;
      this.authflag = false;
    },

    getHospitalName(item) {
      const found = this.hospital_list.find(
        (h) => h.institution_id === item.institution_id
      );
      return found?.name || "Select hospital";
    },

    getHospitalAddress(item) {
      const found = this.hospital_list.find(
        (h) => h.institution_id === item.institution_id
      );
      return found?.address || "";
    },
    async fetchLov() {
      this.$axios
        .get("fetch_all_drugs")
        .then((res) => {
          this.drug_list = res.data.drugs;
          this.medications = res.data.drugs;

          this.initializeConfirmations();
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

    async fetchPolicyQuestions() {
      try {
        if (!this.form.medications.length) return;
        this.loader = true;
        const res = await this.$axios.get("fetch_policy_questions", {
          params: {
            type: this.profile_details.rolename,
            medications: this.form.medications,
          },
        });

        this.medicationTerms = res.data.medications || [];
        this.selDrugList = res.data.drug_list || [];
        this.loader = false;
        // console.log("medicationTerms");
        // console.log(medicationTerms);
      } catch (error) {
        this.loader = false;
        this.$toast.error("Failed to load confirmation questions");
      }
    },

    cancel() {
      this.isViewMode = true;
      this.fetchUsers();
    },
    getStatusDays(drug) {
      if (!drug.end_date) return 0;

      const today = new Date();
      const endDate = new Date(drug.end_date + "T00:00:00");

      // Normalize time (CRITICAL)
      today.setHours(0, 0, 0, 0);

      const diffTime = endDate - today;

      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    isExpired(drug) {
      if (drug.isNew) return false;

      // normalize today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!drug.end_date) return false;

      // force correct parsing
      const endDate = new Date(drug.end_date + "T00:00:00");
      endDate.setHours(0, 0, 0, 0);

      return Number(drug.expired) === 1 || endDate < today;
    },

    isNearExpiry(drug) {
      if (drug.isNew) return false;
      if (!drug.end_date) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const endDate = new Date(drug.end_date);
      endDate.setHours(0, 0, 0, 0);

      const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

      return diff > 0 && diff <= 30;
    },
    getExpiryDays(drug) {
      const today = new Date();
      const expiry = new Date(drug.end_date);

      today.setHours(0, 0, 0, 0);
      expiry.setHours(0, 0, 0, 0);

      return Math.ceil((expiry - today) / 86400000);
    },

    saveProfile() {
      console.log("Profile Data:", this.profile_details);
      console.log("Drugs:", this.drugs);
    },
    uploaded_image(img_src) {
      this.profile_details.image_url = img_src;
    },
    uploadFile() {
      if (this.uploadfile == false) {
        this.uploadfile = true;
      } else {
        this.uploadfile = false;
      }
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
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
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
          institution_id: this.selectedHospital.institution_id,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchUsers();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
        });
    },
    submitForm(selectedDrug) {
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
    finalSubmit(selectedDrug) {
      this.loader = true;
      const payload = {
        drug_id: selectedDrug.drug_id,
        user_id: selectedDrug.user_id,
        role: this.profile_details.rolename,
        is_check: selectedDrug.is_check,
        start_date: this.form.signature_date,
        newDrug: selectedDrug.isNew,
      };

      if (this.profile_details.rolename === "Pharmacist") {
        payload.pharmacist_id = selectedDrug.pharmacist_id;
      }

      if (this.profile_details.rolename === "Prescriber") {
        payload.prescriber_id = selectedDrug.prescriber_id;
      }

      this.$axios
        .post("update_drug", payload)
        .then((res) => {
          res.data.status === "E"
            ? this.$toast.error(res.data.message)
            : (this.showSuccessDialog = true);
        })
        .catch((err) => {
          this.$toast.error(
            err?.response?.data?.message || "Something went wrong"
          );
        })
        .finally(() => {
          this.loading = false;
          this.selectedDrug = {};
        });
    },
    submit() {
      // Hospital validation
      const hasEmptyHospital = this.hospitals.some(
        (h) => !h.institution_id || h.institution_id === null
      );

      if (hasEmptyHospital) {
        this.alertMessage =
          "Please fill all required fields before proceeding.";
        this.confirmText = "OK";
        this.confirmType = "warning";
        this.showAlert = true;
        return;
      }
      this.isDisabled = true;
      this.$axios
        .post("updateprofile", {
          profile_details: this.profile_details,
          hospitals: this.hospitals,
          drugs: this.drugs,
          institution_id: this.selectedHospital.institution_id,
          isLeadPharmacist: this.selectedHospital.isLeadPharmacist,
          wholesaler: this.selectedHospital.wholesalers.acc_no ?? null,
        })
        .then((res) => {
          if (res.data.status == "S") {
            this.user.image_url = this.profile_details.image_url;
            const userdetails = JSON.stringify(this.user);
            localStorage.setItem("user_data", userdetails);
            this.$toast.success(res.data.message);
            this.fetchUsers();
            this.isDisabled = false;
            this.isViewMode = true;
          } else if (res.data.status == "E") {
            this.$toast.error(res.data.message);
            this.isDisabled = false;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
            this.isDisabled = false;
          }
        })
        .catch((err) => {
          this.isDisabled = false;
          this.$toast.error(this.$t("something_went_wrong"));
          this.isDisabled = false;
          console.log("error", err);
        });
    },
    getDrug(drugId) {
      return this.medicationTerms.find((d) => Number(d.id) === Number(drugId));
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
    closeAllModals() {
      if (this.$route.query.from === "paf") {
        this.$router.push({
          name: "paf_create",
          query: {
            step_value: 2,
          },
        });
      }
      if (this.$route.query.from === "pafview") {
        this.$router.push({
          name: "paf_report",
        });
      }
      this.showSuccessDialog = false;
      this.showConfirmationDialog = false;
      this.termsDialog = false;
      this.showDocErrorDialog = false;
      this.confirmGuideRead = false;
      this.docClicks = {};
      this.showDocSuccessDialog = false;
      this.fetchUsers();
      this.loader = false;
      this.showValidation = false;
    },
    async reRegister(drug) {
      // Set prescriber name automatically
      this.selectedDrug = drug;
      this.form.signature =
        this.profile_details.name + " " + this.profile_details.lastname;

      // Set current date (DD / MM / YYYY)
      const today = new Date().toISOString().substr(0, 10);

      this.form.signature_date = today;
      this.termsDialog = true;
      const drugId = drug.drug_id; // 👈 important

      // Set only selected drug
      this.form.medications = [drugId];
      await this.fetchPolicyQuestions();
      // Reset confirmations
      this.confirmationChecks = {};

      // Initialize terms for that drug
      this.$nextTick(() => {
        this.initializeConfirmations();
      });
    },
    getCommaSeparatedDrugNames(drugs) {
      if (!Array.isArray(drugs) || drugs.length === 0) return "";

      const names = drugs.map((d) => d.drug_name);

      if (names.length === 1) return names[0];

      return names.slice(0, -1).join(", ") + " and " + names[names.length - 1];
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
    isRestrictedRole(drug) {
      if (!drug?.end_date) return false;

      const today = new Date();
      const endDate = new Date(drug.end_date);

      // Normalize both dates
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const isRestrictedUser = ["SuperUser", "PCG Admin", "PCG User"].includes(
        this.user?.rolename
      );

      const isExpiredOrPast = endDate > today && drug.expired === 0;

      return isRestrictedUser && isExpiredOrPast;
    },
    async forceToReRegister(drug) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to force re-registration for this drug?"
      );
      if (!result) return;
      this.loader = true;
      this.$axios
        .post("force_to_re_register", drug)
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchUsers();
          } else {
            this.$toast.error(res.data.message);
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
    isSelected(drug) {
      return this.selectedDrugs.some((d) => d.id === drug.id);
    },

    async forceToReRegisterBulk(selectedDrugs) {
      console.log("selectedDrugs");
      console.log(selectedDrugs);
      if (!selectedDrugs.length) {
        this.$toast.error("Please select at least one drug");
        return;
      }
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to force re-registration for this selected drug?"
      );
      if (!result) return;
      this.loader = true;
      // Extract from selected drugs
      const payload = {
        user_id: selectedDrugs[0].user_id,
        drug_ids: selectedDrugs.map((d) => d.drug_id),
      };

      // Dynamically assign (VERY IMPORTANT)
      if (selectedDrugs[0].pharmacist_id) {
        payload.pharmacist_id = selectedDrugs[0].pharmacist_id;
      }

      if (selectedDrugs[0].prescriber_id) {
        payload.prescriber_id = selectedDrugs[0].prescriber_id;
      }
      this.$axios
        .post("force_to_re_register_selected_drug", payload)
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.selectedDrugs = [];
            this.selectedDrugs.forEach((d) => (d.is_check = 0));
            this.fetchUsers();
          } else {
            this.$toast.error(res.data.message);
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
    async updateSuspiciousActor(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update this user as a suspicious actor?"
      );

      if (!result) return;
      this.loader = true;
      this.$axios
        .post("update_suspicious_actor", {
          id: id,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchUsers();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .finally(() => {
          this.loader = false;
        });
    },
    addNurse() {
      this.$router.push({
        name: "nurse_creation",
        query: {
          from: "view_profile",
        },
      });
    },
    addConnectedPharmacies(tab) {
      if (tab == "Outpatient") {
        this.$router.push({
          name: "connected-pharmacy-amend",
          query: {
            tabname: tab,
            from: "view_profile",
          },
        });
      } else {
        this.$router.push({
          name: "connected-homecare-amend",
          query: {
            tabname: tab,
            from: "view_profile",
          },
        });
      }
    },
    handleStatusToggle(newValue) {
      // store previous value BEFORE change
      this.oldStatus =
        this.oldStatus === null ? (newValue === 1 ? 0 : 1) : this.oldStatus;

      this.changeStatusDialog = true;
    },

    async updateUserStatus() {
      try {
        const res = await this.$axios.post("updateuserstatus", {
          id: this.profile_details.id,
          status: this.profile_details.status,
        });

        if (res.data.status === "S") {
          this.$toast.success("User status updated successfully.");
          this.oldStatus = null;
          this.cancel();
        } else {
          this.$toast.error(res.data.message);
          this.profile_details.status = this.oldStatus;
        }
      } catch (e) {
        this.$toast.error("Something went wrong");
        this.profile_details.status = this.oldStatus;
      }
    },

    cancelStatusUpdate() {
      this.changeStatusDialog = false;
      this.profile_details.status = this.oldStatus;
    },
  },
};
</script>
<style scoped>
.profile-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f4f1e8, #f6e8c3);
}

.avatar-bg {
  background: var(--theme-color);
  color: white;
}

.profile-name {
  font-weight: 600;
  font-size: 22px;
}

.complete-btn {
  background: var(--theme-color) !important;
  color: white !important;
}

.purple-pill {
  background: var(--theme-color) !important;
  color: white !important;
}

.outline-pill {
  border: 2px solid var(--theme-color) !important;
  color: var(--theme-color) !important;
}
.red-pill {
  border: 2px solid var(--reject-color) !important;
  color: var(--reject-color) !important;
  background: transparent !important;
}

.position-relative {
  position: relative;
}

.avatar-bg {
  background: linear-gradient(135deg, #6a5af9, #836fff);
}

.avatar-edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s ease;
}

.status-btn {
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #fff !important;
}

.action-btn {
  font-weight: 500;
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
.fixed-status-btn {
  width: 110px;
  justify-content: center;
  text-align: center;
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
/* Container */
.connected-wrapper {
  background: #f7f7f7;
  border-radius: 12px;
}

/* Header */
.header {
  font-weight: 600;
  font-size: 15px;
  color: #444;
}

.count {
  color: #888;
  margin-left: 5px;
}

/* Chips layout */
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Chip */
.custom-chip {
  background: #ffffff;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.custom-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* Avatar */
.avatar {
  background: linear-gradient(135deg, #42a5f5, #7e57c2);
  color: white;
  font-size: 11px;
}

/* Wrapper */
.chip-hover-wrapper {
  position: relative;
}

/* Hover Popup */
.hover-popup {
  position: absolute;
  bottom: 45px;
  left: 80%;
  width: 340px;
  z-index: 20;
  transform: translateX(-20%);
  /* Glassmorphism */
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
}

/* Header inside popup */
.popup-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.rounded-chip {
  border-radius: 999px !important;
  cursor: pointer;
}
.rounded-chip-institute {
  border-radius: 999px !important;
}
.avatar-big {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42a5f5, #7e57c2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
}

.name {
  font-weight: 600;
  font-size: 14px;
}

.role {
  font-size: 12px;
  color: #777;
}

/* Body */
.popup-body {
  font-size: 13px;
  color: #444;
}

.info-row {
  margin-top: 4px;
}

/* Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* No Data */
.no-data {
  color: #999;
  font-size: 13px;
}
.selected-card {
  border: 2px solid #3f51b5 !important;
  background: #eef2ff;
}
.institution-heading {
  font-size: 12px;
  color: #9e9e9e; /* light gray */
  margin-bottom: 6px;
  font-weight: 500;
}

.institution-chips {
  display: flex;
  flex-wrap: wrap;
}

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.popup-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Make your existing header inline */
.popup-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Rounded edit icon */
.edit-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #ddd;
  cursor: pointer;
}

.edit-icon {
  font-size: 18px;
  color: #555;
}

.edit-icon-wrapper:hover {
  background: #f5f5f5;
}
</style>
