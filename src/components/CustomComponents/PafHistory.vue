<template>
  <div>
    <content-loader v-if="loader"></content-loader>

    <no-data-found
      v-if="paf_history.length == 0"
      text="No PAF history found."
    />
    
    <v-row v-else>
      <v-col cols="12" class="plain-wrapper">
        <!-- HEADER -->
        <div class="mb-4">
          <div class="d-flex align-center justify-space-between">
            <span class="paf-no mb-3" v-if="paf_history.versions">
              PAF - {{ paf_history.versions[0].paf_no }}
            </span>
          </div>

          <v-row>
            <v-col cols="12" md="3">
              <div class="info-label">Indication</div>
              <div class="text-left">{{ paf_header.indication || "-" }}</div>
            </v-col>

            <v-col cols="12" md="3">
              <div class="info-label">Drug</div>
              <div class="text-left">{{ paf_header.drug }}</div>
            </v-col>

            <v-col cols="12" md="3">
              <div class="info-label">Date of PAF</div>
              <div class="text-left">{{ formatDate(paf_header.date) }}</div>
            </v-col>

            <v-col cols="12" md="3">
              <div class="info-label">Patient Category</div>
              <div class="text-left">
                {{ patientCategoryLabel(paf_header.patient_category) }}
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- VERSION LOOP -->
        <div
          v-for="paf in paf_history.versions"
          :key="paf.id"
          class="version-card mb-4"
        >
          <!-- HEADER -->
          <div class="version-header">
            <div>
              <div class="version-title">
                {{ isCurrentVersion(paf) ? "Current Version" : "Version" }}
                <span class="version-number">#{{ paf.version }}</span>
              </div>
              <!-- <div class="version-sub">
                PAF No: {{ paf.paf_no }}
              </div> -->
            </div>

            <v-chip
              :color="$helpers.getStatusColor(paf.status)"
              size="small"
              class="status-chip"
            >
              {{ paf.status }}
            </v-chip>
          </div>

          <v-row>
            <!-- LEFT SIDE -->
            <v-col cols="12" md="8">
              <div
                v-for="cycle in paf.drug_cycles"
                :key="cycle.id"
                class="cycle-card"
                :class="isCurrentVersion(paf) ? 'current' : ''"
              >
                <div class="cycle-grid">
                  <div class="cycle-item">
                    <div class="label">Strength</div>
                    <div class="value">
                      {{ cycle.drug_strength }}
                    </div>
                  </div>

                  <div class="cycle-item">
                    <div class="label">{{ drug_form }}s</div>
                    <div class="value">
                      {{ cycle.cap_per_cycle }}
                    </div>
                  </div>

                  <div class="cycle-item">
                    <div class="label">Cycles</div>
                    <div class="value">
                      {{ cycle.no_of_cycles }}
                    </div>
                  </div>
                </div>
              </div>
            </v-col>

            <!-- RIGHT SIDE -->
            <v-col cols="12" md="4" v-if="paf.patient_category === 'WCBP'">
              <div class="side-card" :class="isCurrentVersion(paf) ? 'current_pregdate' : ''">
                <div class="side-content">
                  <div class="side-label">Last Negative Pregnancy Test</div>
                  <div class="side-value">
                    {{ formatDate(getPregDate(paf)) || "Not Available" }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["sel_paf_id", "paf_header", "drug_form"],

  data() {
    return {
      loader: false,
      paf_history: [],
    };
  },

  watch: {
    sel_paf_id: {
      immediate: true,
      handler(newVal) {
        if (!newVal) return;
        this.fetchPafHistory(newVal);
      },
    },
  },

  methods: {
    isCurrentVersion(paf) {
      return paf.drug_cycles.some((cycle) => cycle.is_current);
    },

    getPregDate(paf) {
      const c = paf.drug_cycles.find((x) => x.last_negative_preg_date);
      return c ? c.last_negative_preg_date : null;
    },

    patientCategoryLabel(category) {
      if (category == "M") return "Male";
      if (category == "WCBP") return "Women of Childbearing Potential";
      if (category == "WNCBP") return "Woman of Non-Childbearing Potential";
      return "-";
    },

    fetchPafHistory(paf_id) {
      this.loader = true;

      this.$axios
        .get("get_paf_history", {
          params: { paf_id },
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.paf_history = res.data.paf_history;
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
.version-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #ececec;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.version-title {
  font-size: 16px;
  font-weight: 600;
}

.version-number {
  color: #4caf50;
  margin-left: 6px;
}

.version-sub {
  font-size: 12px;
  color: #888;
}

.cycle-card {
  background: #fafafa;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #eee;
}

.cycle-card.current {
  border-left: 4px solid #4caf50;
  background: #f4fbf6;
}

.cycle-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.label {
  font-size: 12px;
  color: #777;
}

.value {
  font-size: 14px;
  font-weight: 500;
}

.side-card {
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #e0e4ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fafafa;
}

.side-title {
  font-size: 14px;
  font-weight: 600;
  color: #3f51b5;
  margin-bottom: 10px;
}

.side-label {
  font-size: 12px;
  color: #666;
}

.side-value {
  font-size: 14px;
  font-weight: 300;
  color: #000000;
}
.current_pregdate{
  border-left: 4px solid #4caf50;
  background: #f4fbf6;
}
</style>
