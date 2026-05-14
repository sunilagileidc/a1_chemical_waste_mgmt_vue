<template>
  <div class="mt-4">
    <!-- Stats section -->
    <div class="d-flex flex-wrap justify-start ga-6">
      <div class="stat-wrapper" v-for="item in stats" :key="item.label">
        <div class="stat-label">{{ item.label }}</div>
        <div class="stat-pill">
          <span class="stat-value">{{ item.value }}</span>
        </div>
      </div>
    </div>
    <!-- Stats section -->
  </div>
</template>
<script>
export default {
  props: ["stats"],
  name: "Stats",
  data() {
    return {};
  },

  computed: {},

  mounted() {
    // You can fetch or initialize data here if needed
    console.log("PatientsTable component mounted");
  },

  created() {
    // Initialization logic here
    console.log("PatientsTable component created");
  },
};
</script>

<style scoped>
/* Page Background */

.search-field {
  width: 500px;
  border-radius: 999px;
}

/* Status styling */
.status-text {
  font-weight: 600;
}

.status-submitted {
  color: #6c6c6c;
}

.status-rejected {
  color: #ff2d55;
}

/* PDF button */
.pdf-btn {
  background: #05668d;
  color: white;
  border-radius: 50%;
}

.pdf-btn:hover {
  background: #045373;
}
.v-table {
  background: #e9edf7 !important;
}
</style>
