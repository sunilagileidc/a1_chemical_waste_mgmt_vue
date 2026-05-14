<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>
    <div class="main-section">
      <page-title
        class="col-md-3"
        heading="Dashboard"
        :google_icon="google_icon"
      ></page-title>
      <stats-page :stats="stats" />
      <!-- Action Cards -->
      <v-row dense class="card-box">
        <!-- Refer Patient -->
        <!-- <v-col cols="12" md="6" class="d-flex justify-center">
          <v-card class="action-card">
            <div class="action-content">
              <div>
                <div class="action-title">Refer a Patient</div>
                <div class="action-subtitle">For new patients</div>

                <v-btn
                  class="mt-4"
                  color="primary"
                  rounded="pill"
                  @click="$router.push('/create-paf')"
                >
                  Generate a PAF
                </v-btn>
              </div>

              <v-img src="/images/patient-form.png" width="120" contain></v-img>
            </div>
          </v-card>
        </v-col> -->

        <!-- View Patients -->
        <v-col cols="12" md="12" class="d-flex justify-center">
          <v-card class="action-card">
            <div class="action-content">
              <div
                v-if="user.rolename == 'Nurse' || user.rolename == 'Pharmacist'"
                class="action-left"
              >
                <div class="icon-badge">
                  <v-icon size="28">mdi-account-heart</v-icon>
                </div>

                <div class="action-title">View Patients</div>

                <div class="action-subtitle">
                  View existing patients that are sent to your pharmacy
                </div>

                <v-btn
                  class="mt-4 create-btn"
                  elevation="2"
                  @click="$router.push('/paf_report')"
                >
                  <v-icon start>mdi-file-document-outline</v-icon>
                  View Patients
                </v-btn>
              </div>
              <div v-else class="action-left">
                <div class="icon-badge">
                  <v-icon size="28">mdi-account-heart</v-icon>
                </div>

                <div class="action-title">View Patients, Add or Renew PAF</div>

                <div class="action-subtitle">
                  View existing patients, add or renew a PAF
                </div>

                <v-btn
                  class="mt-4 create-btn"
                  elevation="2"
                  @click="$router.push('/paf_report')"
                >
                  <v-icon start>mdi-file-document-outline</v-icon>
                  Add/View/Renew PAF
                </v-btn>
              </div>

              <v-img
                src="/images/patient-card.png"
                width="130"
                contain
                class="action-image"
              ></v-img>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    stats: [
      { label: "Total PAFs", value: 0 },
      { label: "Total patients", value: 0 },
      { label: "Active Patients", value: 0 },
      { label: "Overdue PAF (Action Required)", value: 0 },
      { label: "Rejected PAF", value: 0 },
    ],
    loader: false,

    google_icon: {
      icon_name: "description",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    sel_institution: "",
    user: [],
  }),

  mounted() {
    this.sel_institution = JSON.parse(localStorage.getItem("sel_inst"));
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.getPafStats();
  },

  methods: {
    getPafStats() {
      this.loader = true;
      // decide URL based on role

      let url = null;
      if (this.user.rolename === "Prescriber") {
        url = "get_paf_stats";
      } else if (this.user.rolename === "Pharmacist") {
        url = "get_pharmacist_paf_stats";
      } else {
        url = "get_all_paf_stats";
      }

      this.$axios
        .get(url, {
          params: {
            institution_id: this.sel_institution?.institution_id,
          },
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.stats = res.data.stats;
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.loader = false;
        });
    },
  },
};
</script>

<style scoped>
/* Page */

.dashboard-page {
  background: #f5f7fa;
}

/* =========================
   Top Stats
========================= */

.stat-card {
  padding: 20px;
  border-radius: 10px;
  background: #eef2f5;
}

.stat-title {
  font-size: 14px;
  color: #6c7a89;
}

.stat-number {
  font-size: 34px;
  font-weight: 700;
  color: #0c4a6e;
}

/* =========================
   Action Card Layout
========================= */

.card-box {
  padding: 44px;
}

.action-card {
  padding: 30px;
  width: 500px;
  border-radius: 12px;
}

/* .action-content {
  display: flex;
  align-items: center;
  justify-content: center;
} */

/* .action-left {
  max-width: 320px;
} */

.action-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f3b4d;
}

.action-subtitle {
  margin-top: 6px;
  font-size: 14px;
  color: #6c7a89;
}

/* =========================
   Improved Card Styling
========================= */

.improved-card {
  padding: 34px;
  width: 520px;
  border-radius: 16px;
  /* cursor: pointer; */
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff, #f7fafc);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.improved-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* =========================
   Icon Badge
========================= */

.icon-badge {
  width: 50px;
  height: 50px;
  margin-bottom: 12px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #e8f2ff;
  color: #1976d2;

  transition: all 0.3s ease;
}

.improved-card:hover .icon-badge {
  transform: scale(1.1);
  background: var(--theme-color);
  color: #fff;
}

/* =========================
   Button Animation
========================= */

.action-btn {
  transition: transform 0.25s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

/* =========================
   Image Animation
========================= */

.action-image {
  margin-left: 30px;
  transition: transform 0.4s ease;
}

.improved-card:hover .action-image {
  transform: scale(1.08) rotate(2deg);
}
</style>
