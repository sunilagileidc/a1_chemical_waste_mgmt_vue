<template>
  <div class="pdf-container">
    <div class="watermark">
      <img v-if="app_logo" v-bind:src="app_logo" style="width: 235px" />
      <h3 v-else>{{ application_name }}</h3>
    </div>
    <div class="logo-section mb-4">
      <img v-if="app_logo" v-bind:src="app_logo" style="width: 235px" />
      <h3 v-else>{{ application_name }}</h3>
    </div>
    <!-- HEADER -->
    <div class="header">
      <h2 class="heading">
        Patient Details -
        <span
          v-if="selectedPaf?.status === 'Submitted'"
          style="
            background-color: #028302;
            color: #fff;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            display: inline-block;
          "
        >
          {{ selectedPaf?.status }}
        </span>

        <span
          v-else-if="selectedPaf?.status === 'Approved'"
          style="
            background-color: #4caf50;
            color: #fff;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            display: inline-block;
          "
        >
          {{ selectedPaf?.status }}
        </span>

        <span
          v-else-if="selectedPaf?.status === 'Dispensed'"
          style="
            background-color: #2196f3;
            color: #fff;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            display: inline-block;
          "
        >
          {{ selectedPaf?.status }}
        </span>

        <span
          v-else-if="selectedPaf?.status === 'Rejected'"
          style="
            background-color: #f44336;
            color: #fff;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            display: inline-block;
          "
        >
          {{ selectedPaf?.status }}
        </span>

        <span
          v-else-if="selectedPaf?.status === 'Reverted'"
          style="
            background-color: #ff9800;
            color: #fff;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            display: inline-block;
          "
        >
          {{ selectedPaf?.status }}
        </span>

        <span
          v-else
          style="
            background-color: #777;
            color: #fff;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            display: inline-block;
          "
        >
          {{ selectedPaf?.status }}
        </span>
      </h2>
    </div>
    <hr />
    <!-- TOP DETAILS -->
    <div class="grid-3">
      <div>
        <div class="info-label">Patient ID</div>
        <div class="info-value">{{ paf.patient_id }}</div>
      </div>

      <div>
        <div class="info-label">Initials</div>
        <div class="info-value">{{ paf.initials }}</div>
      </div>

      <div>
        <div class="info-label">Category</div>
        <div class="info-value">{{ paf.patient_category }}</div>
      </div>
      <div>
        <div class="info-label">Date of Birth</div>
        <div class="info-value">{{ formatDate(paf.dob) }}</div>
      </div>
      <div>
        <div class="info-label">Indication</div>
        <div class="info-value">
          {{ paf.indication ? paf.indication : "N/A" }}
        </div>
      </div>

      <div>
        <div class="info-label">Drug</div>
        <div class="info-value">{{ paf.drug }}</div>
      </div>

      <div>
        <div class="info-label">Date of PAF</div>
        <div class="info-value">{{ formatDate(paf.date) }}</div>
      </div>
      <div v-if="paf.patient_category == 'WCBP'">
        <div class="info-label">Date of Last Negative Pregnancy Test</div>
        <div class="info-value">
          {{ formatDate(paf.last_negative_preg_date) }}
        </div>
      </div>
    </div>

    <!-- CONSENT -->
    <div class="consent" v-if="paf.patient_category == 'M'">
      <span class="checkbox">✔</span>
      <p style="padding-right: 50px; font-size: 12px !important">
        The Patient Has Been Counselled About The Teratogenic Risk Of Treatment
        With Lenalidomide And Understands The Need To Use A Condom If Involved
        In Sexual Activity With A Woman Of Childbearing Potential Not Using
        Effective Contraception Or If Their Partner Is Pregnant (Even If The
        Patient Has Had A Vasectomy).
      </p>
    </div>

    <hr v-if="paf.patient_category == 'M'" />

    <!-- PRESCRIPTION -->
    <h3 class="theme-subheader mt-5">Prescription</h3>

    <div class="grid-3">
      <div class="d-flex flex-column">
        <div
          class="d-flex justify-space-between mr-6"
          style="width: 311px"
          v-for="(drug, index) in dosageRows"
          :key="index"
        >
          <div>
            <div class="info-label">
              {{ selectedPaf.drug.drug_form }} Strength
            </div>
            <div class="info-value">{{ drug.drug_strength }}</div>
          </div>

          <div>
            <div class="info-label">
              {{ selectedPaf.drug.drug_form }}s per Cycle
            </div>
            <div class="info-value">{{ drug.cap_per_cycle }}</div>
          </div>
        </div>
      </div>

      <div class="ml-8">
        <div class="info-label">No of Cycles</div>
        <div class="info-value">{{ paf.cycles }}</div>
      </div>

      <div>
        <div class="info-label">Total {{ selectedPaf.drug.drug_form }}s</div>
        <div class="info-value">{{ paf.total_supply }}</div>
      </div>
    </div>
    <!-- PRESCRIBER -->
    <h3 class="theme-subheader mt-5">Prescriber</h3>

    <div class="grid-3">
      <div>
        <div class="info-label">Name</div>
        <div class="info-value">{{ prescriber?.full_name }}</div>
      </div>

      <div>
        <div class="info-label">Treating Hospital</div>
        <div class="info-value">{{ selectedPaf?.institutions?.name }}</div>
      </div>

      <div>
        <div class="info-label">Address</div>
        <div class="info-value">{{ selectedPaf?.institutions?.address }}</div>
      </div>
    </div>
    <!-- Approval Details -->
    <h3 class="theme-subheader mt-5" v-if="selectedPaf.mah_data">
      Approval Details
    </h3>

    <div class="grid-3" v-if="selectedPaf.mah_data">
      <div>
        <!-- Name -->
        <div class="info-label">Contact Name</div>
        <div class="info-value">
          {{ selectedPaf.mah_data?.contact_name }}
        </div>
      </div>

      <div>
        <div class="info-label">Approver Signature</div>
        <div class="info-value">{{ selectedPaf.dispensing_sig }}</div>
      </div>

      <div>
        <div class="info-label">Approval Date</div>
        <div class="info-value">
          {{ formatDate(selectedPaf.dispensing_date) }}
        </div>
      </div>
    </div>
    <!-- Confirmation Details -->
    <div v-if="offlabel_confirmations && offlabel_confirmations.length > 0">
      <h3 class="theme-subheader mt-5">Off-Label Confirmations</h3>
      <div
        cols="12"
        class="consent"
        v-for="confirmation in offlabel_confirmations"
        :key="confirmation.id"
      >
        <span class="checkbox">✔</span>
        <span class="info-value">{{ confirmation.confirmation }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import localStorageWrapper from "../../../localStorageWrapper.js";
export default {
  props: {
    paf: Object,
    selectedPaf: Object,
    prescriber: Object,
    app_logo: String,
    dosageRows: Array,
    offlabel_confirmations: Object,
  },

  data() {
    return {
      baseUrl: import.meta.env.VITE_IMAGE_PATH + "/storage/",
      application_name: "",
      envImagePath: import.meta.env.VITE_IMAGE_PATH,
    };
  },

  computed: {
    patientCategory() {
      if (this.paf.patient_category == "M") return "Male";
      if (this.paf.patient_category == "WCBP")
        return "Women of Childbearing Potential";
      if (this.paf.patient_category == "WNCBP")
        return "Woman of Non-Childbearing Potential";
      return "-";
    },
  },
  mounted() {},

  methods: {
    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("en-GB");
    },
  },
};
</script>

<style scoped>
.pdf-container {
  position: relative;
  width: 800px;
  padding: 20px;
}

/* WATERMARK */
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  opacity: 0.06;
  z-index: 0;
}

.watermark img {
  width: 300px;
}

/* content above */
.pdf-container > * {
  position: relative;
  z-index: 1;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px !important;
}

.status {
  background: #f3e7c3;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 4px;
}

/* GRID */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 10px;
  gap: 10px;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 10px;
  gap: 10px;
}

/* LABEL */
.label {
  color: #0a7c86;
  font-weight: 600;
  margin-bottom: 3px;
}

/* CONSENT */
.consent {
  display: flex;
  margin-top: 15px;
}

.checkbox {
  margin-right: 10px;
  font-size: 16px;
}

/* SECTION TITLE */
.theme-subheader mt-5 {
  margin-top: 20px;
  color: #0a7c86;
}

/* TABLE */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table th {
  background: #eee;
  text-align: left;
  padding: 8px;
}

.table td {
  padding: 8px;
  border-top: 1px solid #ddd;
}

hr {
  margin: 15px 0;
}
.logo-section {
  position: absolute;
  top: 10px;
  left: 20px;
}

.logo {
  height: 50px;
  object-fit: contain;
}
.info-label,
.info-value {
  font-size: 12px !important;
}
</style>
