<template>
  <div fluid class="ma-0 user-page-bg pa-0">
    <!-- Category selection start -->
    <div class="content-wrapper" v-if="!sel_category">
      <v-card class="register-card-transperant" elevation="0">
        <v-card-text class="text-center py-16">
          <h2 class="theme-header mb-12">
            Please select your registration category.
          </h2>

          <div class="button-group">
            <v-btn
              variant="outlined"
              class="register-btn"
              @click="selectCategory('Prescriber')"
            >
              Prescriber
            </v-btn>

            <v-btn
              variant="outlined"
              class="register-btn"
              @click="selectCategory('Pharmacist')"
            >
              Pharmacist/Pharmacy Technician
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>
    <!-- Category selection end -->
    <div>
      <prescriber-registration
        v-if="sel_category === 'Prescriber'"
        @category-selected="selectCategory(null)"
      />
      <pharmacist-registration
        v-else-if="sel_category === 'Pharmacist'"
        @category-selected="selectCategory(null)"
      />
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    sel_category: "",
  }),
  methods: {
    selectCategory(category) {
      this.sel_category = category;
    },
  },
};
</script>
<style scoped>
.content-wrapper {
  width: 100%;
  max-width: 1100px;
  padding: 40px;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-card-transperant {
  background: #ffffff96;
  border-radius: 28px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  width: inherit;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.register-btn {
  min-width: 260px;
  height: 40px;
  border: 2px solid var(--theme-color) !important;
  color: var(--theme-color) !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
}

.register-btn:hover {
  background: var(--theme-gradient) !important;
  color: white !important;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
    gap: 20px;
  }

  .register-btn {
    width: 100%;
  }
}
.user-page-bg {
  align-items: flex-start;
}
</style>
