export const helpers = {
  getStatusColor(status) {
    const map = {
      1: "var(--status-active)",
      0: "var(--status-inactive)",
      Submitted: "var(--status-submitted)",
      Submitted: "var(--status-submitted)",
      Approved: "var(--status-approved)",
      Dispensed: "var(--status-dispensed)",
      Rejected: "var(--status-rejected)",
      Reverted: "var(--status-reverted)",
      "Action Required": "var(--status-ActionRequired)",
    };

    return map[status] || "grey";
  },

  /* ================= Handle Function For User Routing ================= */
  handleUserRouting(userdata, router, loadPermissions) {
    if (userdata.rolename == "Prescriber") {
      localStorage.setItem("active_menu", "User Dashboard");
      localStorage.setItem("active_parent", "User Dashboard");
      router.push({ name: "institution_selection" });
    } else if (userdata.rolename == "Pharmacist") {
      localStorage.setItem("active_menu", "Pharmacist Dashboard");
      localStorage.setItem("active_parent", "Pharmacist Dashboard");
      router.push({ name: "institution_selection" });
    } else if (
      userdata.rolename == "Nurse" &&
      userdata.created_user.rolename == "Prescriber"
    ) {
      localStorage.setItem("active_menu", "User Dashboard");
      localStorage.setItem("active_parent", "User Dashboard");
      router.push({ name: "institution_selection" });
    } else if (
      userdata.rolename == "Nurse" &&
      userdata.created_user.rolename == "Pharmacist"
    ) {
      localStorage.setItem("active_menu", "Pharmacist Dashboard");
      localStorage.setItem("active_parent", "Pharmacist Dashboard");
      router.push({ name: "institution_selection" });
    } else {
      localStorage.setItem("active_menu", "Dashboard");
      localStorage.setItem("active_parent", "Dashboard");
      router.push({ name: "dashboard" });
    }

    // call passed function
    if (loadPermissions) {
      loadPermissions(userdata.role_id);
    }
  },

  getRiskLevelColor(status) {
    switch (status) {
      case "High Risk":
        return "var(--status-high-risk)";

      case "Low Risk":
        return "var(--status-low-risk)";

      default:
        return "grey";
    }
  },
    getRetrospectiveColor(status) {
    const map = {
      0: "var(--retrospective-no)",
      1: "var(--retrospective-yes)",
    };

    return map[status] || "grey";
  },
};
