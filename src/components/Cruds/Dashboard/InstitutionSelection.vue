<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>
    <div class="main-section">
      <page-title
        class="col-md-3"
        heading="Institutions"
        :google_icon="google_icon"
      ></page-title>
      <!-- <stats-page :stats="stats" /> -->
      <!-- Action Cards -->
      <v-row dense class="hospital-cards d-flex justify-center">
        <v-col v-if="hospitals.length == 0 || loader">
          <no-data-found text="No data found" />
        </v-col>
        <v-col
          v-else
          v-for="hospital in hospitals"
          :key="hospital.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="hospital-card ma-3">
            <div class="hospital-card-content">
              <div class="hospital-icon">
                <v-icon size="34">mdi-hospital-building</v-icon>
              </div>

              <div class="hospital-name mb-3">
                {{ hospital.institution_data.name }}
              </div>

              <v-btn
                small
                class="btn-filled"
                elevation="2"
                @click="goToHospital(hospital)"
              >
                Click Here
              </v-btn>
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
      { label: "Overdue PAF (Action Required)", value: 0 },
      { label: "Rejected PAF", value: 0 },
    ],
    hospitals: {},
    loader: false,
    user: [],
    hospital_list: [],
    google_icon: {
      icon_name: "apartment",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),

  mounted() {
    if (JSON.parse(localStorage.getItem("user_data"))) {
      this.user_data = JSON.parse(localStorage.getItem("user_data"));
      if (this.user_data.rolename == "Nurse") {
        this.user = this.user_data.created_user;
      } else {
        this.user = this.user_data;
      }
      this.role_id = this.user.role_id;
    }
    this.fetchInstitutions();
  },

  methods: {
    goToHospital(instObj) {
      localStorage.setItem("sel_inst", JSON.stringify(instObj));
      this.emitter.emit("institutionChanged", instObj);
      if (this.user.rolename === "Pharmacist") {
        this.$router.push({
          name: "paf",
        });
      } else {
        this.$router.push({
          name: "user_dashboard",
        });
      }
    },
    fetchInstitutions() {
      this.loader = true;

      let url = "";

      if (this.user.rolename === "Pharmacist") {
        url = "fetch_pharmacist_list_by_user/" + this.user.id;
      } else {
        url = "fetch_prescriber_list_by_user/" + this.user.id;
      }

      this.$axios
        .get(url)
        .then((res) => {
          if (res.data.status === "S") {
            this.hospitals =
              this.user.rolename === "Pharmacist"
                ? res.data.pharmacistdetails
                : res.data.prescriberdetails;

            this.loader = false;

            // FIXED CONDITION
            if (this.hospitals.length === 1) {
              const instObj = this.hospitals[0];

              // optional: store selected institution
              localStorage.setItem("sel_inst", JSON.stringify(instObj));
              this.emitter.emit("institutionChanged", instObj);
              if (this.user.rolename === "Pharmacist") {
                this.$router.push({
                  name: "paf",
                });
              } else {
                this.$router.push({
                  name: "user_dashboard",
                });
              }
            }

            localStorage.setItem("inst_length", this.hospitals.length);
          } else {
            this.loader = false;
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch((err) => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
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
.hospital-cards {
  padding: 30px;
}

.hospital-card {
  border-radius: 18px;
  padding: 28px;
  text-align: center;
  /* cursor: pointer; */

  background: linear-gradient(135deg, #ffffff, #f2f6fb);

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);

  transition: all 0.35s ease;

  position: relative;
  overflow: hidden;
}

.hospital-card::before {
  content: "";
  position: absolute;
  top: -40px;
  right: -40px;
  width: 120px;
  height: 120px;
  background: rgba(25, 118, 210, 0.08);
  border-radius: 50%;
}

/* .hospital-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.15);
} */

.hospital-icon {
  width: 60px;
  height: 60px;
  margin: auto;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: #e8f2ff;
  color: var(--theme-color);

  margin-bottom: 14px;
}
</style>
