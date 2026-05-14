<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>

    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>

    <div class="main-section">
      <div>
        <!-- Header -->
        <div class="d-flex justify-space-between align-center">
          <page-title
            class="col-md-5"
            heading="Policies & Questions"
            :google_icon="google_icon"
          ></page-title>

          <div class="add_new_button">
            <v-tooltip :text="$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  size="small"
                  class="mb-2 create-btn"
                  v-bind="props"
                  @click="goToCreatePolicy"
                >
                  {{ $t("add_new") }}
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </div>

        <!-- Search -->
        <div class="search-wrapper">
          <v-text-field
            flat
            density="comfortable"
            variant="solo"
            v-model="search"
            append-inner-icon="mdi-magnify"
            placeholder="Search title or category..."
            hide-details
            class="search-field"
          ></v-text-field>
        </div>
        <!-- Table -->
        <v-card class="table-card pa-4">
          <v-data-table
            class="table-card"
            :headers="headers"
            :items="allPolicies"
            :search="search"
            :loading="loader"
            :no-data-text="$t('no_data_available')"
            :items-per-page-text="$t('rows_per_page')"
          >
            <template #item="{ item }">
              <tr class="vdatatable_tbody">
                <!-- Title -->
                <td>
                  <span v-if="item.title">
                    {{ item.title }}
                  </span>
                  <span v-else>{{ $t("not_applicable") }}</span>
                </td>

                <!-- Description -->
                <td class="param-value">
                  <span v-if="item.description">
                    {{ item.description }}
                  </span>
                  <span v-else>{{ $t("not_applicable") }}</span>
                </td>

                <!-- Linked to -->
                <td>
                  <span v-if="item.linked_to">
                    {{ item.linked_to }}
                  </span>
                  <span v-else>{{ $t("not_applicable") }}</span>
                </td>
                <!-- Category -->
                <td>
                  <span v-if="item.ref_type">
                    {{ item.ref_type }} - {{ item.ref_name }}
                  </span>
                  <span v-else>{{ $t("not_applicable") }}</span>
                </td>

                <!-- Sequence -->
                <td>
                  <span v-if="item.sequence">
                    {{ item.sequence }}
                  </span>
                  <span v-else>{{ $t("not_applicable") }}</span>
                </td>

                <!-- Status -->
                <td>
                  <v-btn
                    size="small"
                    variant="flat"
                    class="mr-2"
                    @click="changeStatus(item.id)"
                    :color="item.status == 1 ? 'success' : 'warning'"
                  >
                    <span v-if="item.status == 1" class="spanactivesize">
                      {{ $t("active") }}
                    </span>
                    <span v-else class="spanactivesize">
                      {{ $t("inactive") }}
                    </span>
                  </v-btn>
                </td>

                <!-- Actions -->
                <td class="text-center px-0">
                  <!-- EDIT -->
                  <v-tooltip :text="$t('edit')" location="bottom">
                    <template #activator="{ props }">
                      <v-icon
                        class="mr-2 edit_btn icon_size"
                        v-bind="props"
                        @click="goToEditPolicy(item.slug)"
                      >
                        mdi-pencil-outline
                      </v-icon>
                    </template>
                  </v-tooltip>

                  <!-- ASSIGN -->
                  <span>
                    <v-tooltip text="Assign" location="bottom">
                      <template #activator="{ props }">
                        <v-icon
                          class="mr-2 icon_size"
                          v-bind="props"
                          @click="assignQuestions(item)"
                        >
                          mdi-cog
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </span>

                  <!-- DELETE -->
                  <span>
                    <v-tooltip :text="$t('delete')" location="bottom">
                      <template #activator="{ props }">
                        <v-icon
                          class="mr-2 delete_btn icon_size"
                          v-bind="props"
                          @click="deletePolicy(item.id)"
                        >
                          mdi-trash-can-outline
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialogMessage: "",
    dialogTitle: "",
    loader: false,
    search: "",

    google_icon: {
      icon_name: "shield_question",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },

    allPolicies: [],
  }),

  mounted() {
    this.fetchPolicies();
  },

  computed: {
    headers() {
      return [
        { title: this.$t("title"), key: "title", sortable: true },
        { title: this.$t("description"), key: "description", sortable: false },
        { title: this.$t("linked_to"), key: "linked_to", sortable: false },
        { title: this.$t("category"), key: "ref_type", sortable: true },
        { title: this.$t("sequence"), key: "sequence", sortable: true },
        { title: this.$t("status"), key: "status", sortable: false },
        { title: this.$t("actions"), key: "actions", sortable: false },
      ];
    },
  },

  methods: {
    assignQuestions(policy) {
      this.$router.push({
        name: "policy_question_assign",
        query: { slug: policy.slug, title: policy.title },
      });
    },
    /* =========================
           FETCH LIST
        ========================== */
    fetchPolicies() {
      this.loader = true;

      this.$axios
        .get("policy_questions")
        .then((res) => {
          if (res.data.status === "S") {
            this.allPolicies = res.data.data;
          }
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.loader = false;
        });
    },

    /* =========================
           ROUTING
        ========================== */
    goToCreatePolicy() {
      this.$router.push({
        name: "policy_question_create",
      });
    },

    goToEditPolicy(slug) {
      this.$router.push({
        name: "policy_question_create",
        query: { slug: slug },
      });
    },

    /* =========================
           CONFIRMATION
        ========================== */
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    /* =========================
           CHANGE STATUS
        ========================== */
    async changeStatus(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to change the status?",
      );
      if (!result) return;

      this.loader = true;

      this.$axios
        .post("update_policy_question_status", { id: id })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchPolicies();
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

    /* =========================
           DELETE
        ========================== */
    async deletePolicy(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this record?",
      );
      if (!result) return;

      this.loader = true;

      this.$axios
        .delete("policy_questions/" + id)
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchPolicies();
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
.param-value {
  max-width: 250px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.delete_icon_size {
  font-size: 20px !important;
  cursor: pointer;
}
</style>
