import { createRouter, createWebHashHistory } from "vue-router";
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
    path: "/documents_amend",
    name: "documents_amend",
    beforeEnter: guardMyroute,
    component: () => import("../components/Cruds/Documents/DocumentsAmend.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
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
