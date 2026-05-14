<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>

    <div class="main-section">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-5">
        <page-title
          class="col-md-3 pt-6"
          heading="PAF Counts - (WCBP)"
          :google_icon="google_icon"
        />
      </div>
      <!-- Dashboard Cards -->
      <v-row dense>
        <v-col
          v-for="item in paf_counts"
          :key="item.label"
          cols="12"
          sm="6"
          md="3"
          class="mb-6"
        >
          <v-card class="dashboard-card pa-5">
            <!-- Top -->
            <div class="d-flex justify-space-between align-start">
              <div>
                <div class="card-title">
                  {{ item.label }}
                </div>

                <div class="card-value mt-2">
                  {{ item.count }}
                </div>

                <!-- <div
                  class="card-growth mt-2 d-flex align-center"
                  :class="getPercentageColor(item.percentage)"
                >
                  <v-icon small class="mr-1">
                    {{ getPercentageIcon(item.percentage) }}
                  </v-icon>

                  {{ item.percentage }}%
                  <span class="grey--text text--lighten-1 ml-1">
                    last week
                  </span>
                </div> -->
              </div>

              <!-- Mini Graph -->
              <!-- <div class="mini-chart">
                <svg width="95" height="50" viewBox="0 0 95 50">
                  <path
                    d="M5 38 C18 48, 22 12, 35 22 S55 45, 68 18 S82 8, 90 14"
                    fill="none"
                    stroke-width="3"
                    :stroke="getGraphColor(item.label)"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="55"
                    cy="26"
                    r="4"
                    :fill="getGraphColor(item.label)"
                  />
                </svg>
              </div> -->
            </div>

            <!-- Bottom -->
            <div class="mt-6 d-flex justify-space-between align-center">
              <span class="metric-subtitle" v-if="item.label != 'Total PAFs'">
                {{ item.percentage }}%
              </span>

              <span class="metric-score" v-if="item.label != 'Total PAFs'">
                {{ item.count }}/{{ item.totalcount }}
              </span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";

export default {
  components: { PageTitle },

  data: () => ({
    loader: false,
    paf_counts: [],
    google_icon: {
      icon_name: "article",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),

  mounted() {
    this.getPafCounts();
  },

  methods: {
    getPafCounts() {
      this.loader = true;

      this.$axios
        .get("get_all_paf_counts")
        .then((res) => {
          if (res.data.status === "S") {
            this.paf_counts = res.data.counts;
          }
        })
        .finally(() => {
          this.loader = false;
        });
    },

    getPercentageColor(val) {
      if (val >= 80) return "green--text";
      if (val >= 50) return "orange--text";
      return "red--text";
    },

    getPercentageIcon(val) {
      return val >= 50 ? "mdi-arrow-up-bold" : "mdi-arrow-down-bold";
    },

    getGraphColor(label) {
      switch (label) {
        case "Total PAFs":
          return "#4f46e5";
        case "Dispensed within 7 days":
          return "#10b981";
        case "Rejected PAF":
          return "#ef4444";
        default:
          return "#06b6d4";
      }
    },
  },
};
</script>

<style scoped>
.dashboard-card {
  border-radius: 18px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f1f1;
  transition: 0.25s ease;
  min-height: 160px;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #2d2d2d;
}

.card-value {
  font-size: 42px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.card-growth {
  font-size: 14px;
  font-weight: 600;
}

.metric-subtitle {
  font-size: 13px;
  color: #9ca3af;
}

.metric-score {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
}

.mini-chart {
  opacity: 0.95;
}
</style>
