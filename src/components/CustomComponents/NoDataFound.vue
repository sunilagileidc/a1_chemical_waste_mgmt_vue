<template>
  <div class="no-data-wrapper">
    <v-card
      elevation="0"
      class="no-data-card text-center pa-8"
    >
      <v-avatar size="80" class="mb-4 no-data-avatar">
        <v-icon size="42" :icon="icon" />
      </v-avatar>

      <h3 class="no-data-title">
        {{ text }}
      </h3>

      <p class="no-data-subtitle mt-2">
        Nothing to display at the moment.
      </p>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "NoDataFound",
  props: {
    text: {
      type: String,
      default: "No Details Found",
    },
    icon: {
      type: String,
      default: "mdi-database-remove",
    },
  },
};
</script>

<style scoped>
.no-data-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
}

.no-data-card {
  background: linear-gradient(145deg, #f8f9fa, #ffffff);
  border-radius: 16px;
}

.no-data-avatar {
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
}

.no-data-title {
  font-weight: 600;
  color: #374151;
}

.no-data-subtitle {
  font-size: 14px;
  color: #6b7280;
}
</style>
