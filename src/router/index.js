import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const routes = [

  {
    path: "/",
    name: "login",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/LoginPage.vue"),
  },
  {
    name: "not-found",
    path: "/not-found",
    meta: { layout: "userpages" },
    component: () => import("../../src/components/PageNotFound.vue"),
  },
  {
    path: "/forgot_password",
    name: "forgot_password",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/ForgotPassword.vue"),
  },
  {
    path: "/set_password",
    name: "set_password",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/SetPassword.vue"),
  },
  {
    path: "/reset_password_form/:email?&:name?",
    name: "reset_password_form",
    component: () => import("../Admin/UserPages/ResetPasswordForm.vue"),
    meta: { layout: "userpages" },
  },
  // reset password from profile section
  {
    name: "reset_password",
    path: "/reset_password",
    beforeEnter: guardMyroute,
    component: () => import("../Admin/UserPages/ResetPassword.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    meta: { requiresAuth: true },
    component: () => import("../components/Cruds/Dashboard/MainDashboard.vue"),
  },
  {
    path: "/users",
    name: "users",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Users/IndexPage.vue"),
  },
  {
    path: "/locked_users",
    name: "locked_users",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Users/LockedUsers.vue"),
  },
  {
    path: "/user_creation",
    name: "user_creation",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Users/UserAmend.vue"),
  },
  {
    path: "/menus",
    name: "menus",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Menus/IndexPage.vue"),
  },
  {
    path: "/menu_amend",
    name: "menu_amend",
    beforeEnter: guardMyroute,
    // meta: { layout: "userpages" },
    component: () => import("../components/Cruds/Menus/MenuAmend.vue"),
  },
  {
    path: "/roles",
    name: "roles",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/IndexPage.vue"),
  },
  {
    path: "/roles_amend/:slug?",
    name: "roles_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/RolesAmend.vue"),
  },
  {
    path: "/roles_menu",
    name: "roles_menu",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/RolesMenu.vue"),
  },

  //system parameters
  {
    path: "/system_parameter",
    name: "system_parameter",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/SystemParameter/SystemParameterIndex.vue"),
  },
  {
    path: "/system_parameter_amend",
    name: "system_parameter_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/SystemParameter/SystemParameterAmend.vue"),
  },
  //lookup
  {
    path: "/lookups",
    name: "lookups",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Lookups/LookupsIndex.vue"),
  },
  {
    path: "/lookups_amend",
    name: "lookups_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Lookups/LookupsAmend.vue"),
  },
  {
    path: "/child_lookup",
    name: "child_lookup",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Lookups/ChildLookupsIndex.vue"),
  },
  {
    path: "/child_lookups_amend",
    name: "child_lookups_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/Lookups/ChildLookupsAmend.vue"),
  },

  //email template
  {
    path: "/email_template",
    name: "email_template",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/EmailTemplates/EmailTemplateIndex.vue"),
  },
  {
    path: "/email_template_amend",
    name: "email_template_amend",
    beforeEnter: guardMyroute,
    component: () =>
      import("../components/Cruds/EmailTemplates/EmailTemplateAmend.vue"),
  },

  {
    path: "/navigate_invite",
    name: "navigate_invite",
    beforeEnter: guardMyroute,
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/NavigateInvitation.vue"),
  },

  //countries
  {
    name: "countries",
    path: "/countries",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CountriesIndex.vue"),
  },
  {
    name: "countries_amend",
    path: "/countries_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CountriesAmend.vue"),
  },
  //states
  {
    name: "states",
    path: "/states",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/StatesIndex.vue"),
  },
  {
    name: "states_amend",
    path: "/states_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/StatesAmend.vue"),
  },
  //cities
  {
    name: "cities",
    path: "/cities",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CitiesIndex.vue"),
  },
  {
    name: "cities_amend",
    path: "/cities_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Countries/CitiesAmend.vue"),
  },
  //registration

  {
    path: "/register_user",
    name: "register_user",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/RegisterUser.vue"),
  },
  {
    path: "/register",
    name: "register",
    meta: { layout: "userpages" },
    component: () => import("../Admin/UserPages/OtpValidation.vue"),
  },
  {
    path: "/registration_list",
    name: "registration_list",
    beforeEnter: guardMyroute,
    component: () => import("../Admin/UserPages/RegistrationList.vue"),
  },
  {
    path: "/registration_details",
    name: "registration_details",
    beforeEnter: guardMyroute,
    component: () => import("../Admin/UserPages/RegistrationDetails.vue"),
    props: true,
  },

  //frontend user profile page
  {
    path: "/view-my-profile",
    name: "view-my-profile",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Profile/ViewProfile.vue"),
  },
  {
    path: "/update-my-profile",
    name: "update-my-profile",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Profile/ProfileAmend.vue"),
  },
  {
    path: "/institutions",
    name: "institutions",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Institutions/IndexPage.vue"),
  },
  {
    path: "/institution_amend",
    name: "institution_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Institutions/InstitutionAmend.vue"),
  },
  {
    path: "/action_master",
    name: "action_master",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ActionMaster/ActionMasterIndex.vue"),
  },
  {
    path: "/action_master_amend",
    name: "action_master_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ActionMaster/ActionMasterAmend.vue"),
  },
  {
    path: "/roles_assign",
    name: "roles_assign",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Roles/RolesAssign.vue"),
  },
  {
    path: "/documents",
    name: "documents",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Documents/IndexPage.vue"),
  },
  {
    path: "/documents_child",
    name: "documents_child",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Documents/DocumentChildIndex.vue"),
  },
  {
    path: "/documents_amend",
    name: "documents_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Documents/DocumentsAmend.vue"),
  },
  {
    path: "/drug",
    name: "drug",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Drug/IndexPage.vue"),
  },
  {
    path: "/drug_amend",
    name: "drug_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Drug/DrugAmend.vue"),
  },
  {
    path: "/wholesaler_amend",
    name: "wholesaler_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Wholesalers/WholesalerAmend.vue"),
  },
  {
    path: "/wholesalers",
    name: "wholesalers",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Wholesalers/IndexPage.vue"),
  },
  {
    path: "/policies_questions_setup",
    name: "policies_questions_setup",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PolicyQuestions/IndexPage.vue"),
  },
  {
    path: "/policy_question_create",
    name: "policy_question_create",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PolicyQuestions/AmendPage.vue"),
  },
  {
    path: "/policy_question_assign",
    name: "policy_question_assign",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PolicyQuestions/AssignQuestions.vue"),
  },
  {
    path: "/policy_question_amend",
    name: "policy_question_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PolicyQuestions/AssignQuestionsAmend.vue"),
  },
  {
    path: "/connected-pharmacy",
    name: "connected-pharmacy",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ConnectedPharmacy/ConnectedIndex.vue"),
  },
  {
    path: "/connected-pharmacy-amend/:tabname?",
    name: "connected-pharmacy-amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ConnectedPharmacy/OutpatientAmend.vue"),
  },

  {
    path: "/connected-homecare-amend/:tabname?",
    name: "connected-homecare-amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ConnectedPharmacy/HomecareAmend.vue"),
  },
  {
    path: "/pharmacies",
    name: "pharmacies",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Pharmacies/IndexPage.vue"),
  },
  {
    path: "/pharmacies_amend",
    name: "pharmacies_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Pharmacies/PharmacyAmend.vue"),
  },
  {
    path: "/indications",
    name: "indications",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Indications/IndexPage.vue"),
  },
  {
    path: "/indication_amend/:slug?",
    name: "indication_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Indications/IndicationAmend.vue"),
  },
  {
    path: "/marketing_holders",
    name: "marketing_holders",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/MarketingHolder/IndexPage.vue"),
  },
  {
    path: "/marketing_holder_amend/:slug?",
    name: "marketing_holder_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/MarketingHolder/MarketingHolderAmend.vue"),
  },
  {
    path: "/paf",
    name: "paf",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAF/PafIndex.vue"),
  },
  {
    path: "/paf_report",
    name: "paf_report",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAF/PafReport.vue"),
  },
  {
    path: "/paf_create",
    name: "paf_create",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAF/AmendPage.vue"),
  },
  {
    path: "/hospitals",
    name: "hospitals",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Hospitals/IndexPage.vue"),
  },
  {
    path: "/hospital_amend",
    name: "hospital_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Hospitals/HospitalAmend.vue"),
  },
  {
    path: "/audit_log",
    name: "audit_log",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Audits/IndexPage.vue"),
  },
  {
    path: "/paf_view",
    name: "paf_view",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAF/PafView.vue"),
  },
  {
    path: "/user_dashboard",
    name: "user_dashboard",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAF/PafIndex.vue"),
  },
  {
    path: "/training_documents",
    name: "training_documents",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Documents/TrainingDocuments.vue"),
  },
  // New Pharmacist registration route without guard
  {
    path: "/new-pharmacist-registration",
    name: "new-pharmacist-registration",
    component: () => import("../Admin/UserPages/PharmacistRegistration.vue"),
  },
  {
    path: "/institution_selection",
    name: "institution_selection",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Dashboard/InstitutionSelection.vue"),
  },


  {
    path: "/connected_nurses",
    name: "connected_nurses",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ConnectedNurses/IndexPage.vue"),
  },
  {
    path: "/nurse_creation",
    name: "nurse_creation",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ConnectedNurses/NurseAmend.vue"),
  },
  {
    path: "/off_label_pafs",
    name: "off_label_pafs",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAF/OffLabelPafsReport.vue"),
  },
  {
    path: "/paf_counts",
    name: "paf_counts",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Reports/PAFCounts.vue"),
  },
  {
    path: "/wholesaler_dashboard",
    name: "wholesaler_dashboard",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Wholesalers/PharmacyLists.vue"),
  },
  {
    path: "/review_paf",
    name: "review_paf",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAF/ReviewPaf.vue"),
  },
  {
    path: "/add-wholesaler",
    name: "add-wholesaler",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Wholesalers/AddWholesalers.vue"),
  },
  {
    path: "/non-conformace-rules",
    name: "non-conformace-rules",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ConformanceRules/IndexPage.vue"),
  },
  {
    path: "/non-conformace-rules-amend",
    name: "non-conformace-rules-amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ConformanceRules/ConformanceAmend.vue"),
  },
  {
    path: "/confirmation-text",
    name: "confirmation-text",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ConfirmationText/IndexPage.vue"),
  },
  {
    path: "/confirmation-text-amend",
    name: "confirmation-text-amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/ConfirmationText/ConfirmationTextAmend.vue"),
  },
  {
    path: "/paf_documents",
    name: "paf_documents",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAFDocuments/IndexPage.vue"),
  },
  {
    path: "/paf_documents_child",
    name: "paf_documents_child",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAFDocuments/PAFDocumentChildIndex.vue"),
  },
  {
    path: "/paf_documents_amend",
    name: "paf_documents_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/PAFDocuments/PAFDocumentsAmend.vue"),
  },
  {
    path: "/supplier_sales_data",
    name: "supplier_sales_data",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/SupplierSalesData/IndexPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ---- GLOBAL SAFE ROUTER HANDLER ----
const originalPush = router.push;
const originalReplace = router.replace;

router.push = function (location) {
  return originalPush.call(this, location).catch((error) => {
    if (error.message && error.message.includes("No match")) {
      return originalPush.call(this, { name: "not-found" });
    }
    return Promise.reject(error);
  });
};

router.replace = function (location) {

  return originalReplace.call(this, location).catch((error) => {
    if (error.message && error.message.includes("No match")) {
      return originalReplace.call(this, { name: "not-found" });
    }
    return Promise.reject(error);
  });
};

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters["auth/authentication"];
  if (to.matched.length === 0) {
    next("/not-found");
    return;
  }

  // Redirect logged in users from login/register to dashboard
  if (isAuthenticated && ["login", "register", "forgot_password"].includes(to.name)) {
    next({ name: "dashboard" });
    return;
  }

  // Protect routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
    return;
  }

  next();
});

function guardMyroute(to, from, next) {
  const isAuthenticated = store.getters["auth/authentication"];
  if (isAuthenticated) next();
  else next({ name: "login" });
}

export default router;
