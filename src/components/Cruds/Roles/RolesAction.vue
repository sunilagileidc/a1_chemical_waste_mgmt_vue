<template>
  <div class="role-action-wrapper">
    <content-loader v-if="loader" />

    <v-card v-else class="action-card" elevation="2">
      <!-- Search -->
      <div style="max-width: 380px">
        <v-card-text class="pa-4 pb-0">
          <v-text-field
            v-model="search"
            placeholder="Search actions..."
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </v-card-text>
      </div>

      <!-- Actions -->
      <v-card-text v-if="filteredActions.length > 0" class="pa-4 pt-2">
        <v-row dense>
          <v-col
            v-for="item in filteredActions"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="py-1"
          >
            <div class="action-item">
              <v-checkbox
                v-model="item.checked"
                hide-details
                density="compact"
                class="ma-0 pa-0"
              >
                <template #label>
                  <div class="d-flex align-center">
                    <span class="action-label">
                      {{ item.action_name }}
                    </span>

                    <v-tooltip v-if="item.description" location="bottom">
                      <template #activator="{ props }">
                        <v-icon
                          v-bind="props"
                          size="16"
                          class="ml-2 text-grey-darken-1 cursor-pointer"
                        >
                          mdi-information-outline
                        </v-icon>
                      </template>
                      <span>{{ item.description }}</span>
                    </v-tooltip>
                  </div>
                </template>
              </v-checkbox>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <no-data-found v-else text="No Actions Found" />

      <v-divider />

      <!-- Footer -->
      <div class="d-block mr-4 mt-3 text-right pb-3">
        <!-- Cancel -->
        <v-tooltip :text="$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="$router.go(-1)"
                :disabled="isDisabled"
                class="ma-1"
                color="cancel"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
        </v-tooltip>

        <!-- Submit -->
        <v-tooltip :text="$t('submit')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block">
              <v-btn
                :disabled="isDisabled"
                @click="save()"
                size="small"
                class="mr-2"
                color="success"
              >
                {{ $t("submit") }}

                <v-progress-circular
                  v-if="isDisabled"
                  indeterminate
                  width="1"
                  size="x-small"
                  class="ml-2"
                />
              </v-btn>
            </div>
          </template>
        </v-tooltip>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    actions: [],
    loader: false,
    isDisabled: false,
    search: "",
  }),

  computed: {
    filteredActions() {
      if (!this.search) return this.actions;

      const searchLower = this.search.toLowerCase();

      return this.actions.filter(
        (item) =>
          item.action_name.toLowerCase().includes(searchLower) ||
          (item.description &&
            item.description.toLowerCase().includes(searchLower))
      );
    },
  },

  mounted() {
    this.fetchActions();
  },

  methods: {
    fetchActions() {
      this.loader = true;

      this.$axios
        .get("fetchroleactions/" + this.$route.query.id)
        .then((res) => {
          if (res.data.status === "S") {
            this.actions = res.data.actions;
          } else {
            this.$toast.error(res.data.message);
          }
          this.loader = false;
        })
        .catch(() => {
          this.loader = false;
          this.$toast.error("Something went wrong");
        });
    },

    save() {
      this.isDisabled = true;

      const selected = this.actions
        .filter((item) => item.checked)
        .map((item) => item.id);

      this.$axios
        .post("storeactionaccess", {
          role_id: this.$route.query.id,
          role_access: selected,
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.$router.push({ name: "roles" });
          } else {
            this.$toast.error(res.data.message);
            this.isDisabled = false;
          }
        })
        .catch(() => {
          this.$toast.error("Something went wrong");
          this.isDisabled = false;
        });
    },
  },
};
</script>

<style scoped>
.role-action-wrapper {
  padding: 16px;
}

.action-card {
  border-radius: 14px;
}

.action-item {
  background: #fafafa;
  border-radius: 8px;
  padding: 6px 10px;
  transition: 0.2s ease;
}

.action-item:hover {
  background: #f0f0f0;
}

.action-label {
  font-size: 13px;
  font-weight: 500;
}

.action-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
}
.cursor-pointer:hover {
  cursor: pointer;
  color: blue !important;
}
</style>
