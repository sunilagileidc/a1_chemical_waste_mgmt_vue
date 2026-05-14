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
            class="col-md-10"
            :heading="'Assigned Questions Report - ' + $route.query.title"
            :google_icon="google_icon"
          >
          </page-title>
          <!-- <span class="sel_record"><v-icon>mdi-check-circle-outline</v-icon>{{ $route.query.title }}</span> -->

          <div class="add_new_button">
            <v-btn
              size="small"
              class="status-rejected mb-2 mr-3"
              color="cancel"
              @click="$router.back()"
            >
              Back
            </v-btn>
            <v-btn size="small" class="mb-2 create-btn" @click="goToCreate">
              Add New
            </v-btn>
          </div>
        </div>

        <!-- Search -->
        <div class="search-wrapper">
          <v-text-field
            density="comfortable"
            variant="solo"
            flat
            v-model="search"
            append-inner-icon="mdi-magnify"
            placeholder="Search question or type..."
            hide-details
            class="search-field"
          >
          </v-text-field>
        </div>

        <!-- Table -->
        <v-card class="table-card pa-4">
          <v-data-table
            class="table-card"
            :headers="headers"
            :items="assignedQuestions"
            :search="search"
            :loading="loader"
            :no-data-text="$t('no_data_available')"
            :items-per-page-text="$t('rows_per_page')"
          >
            <template #item="{ item }">
              <tr class="vdatatable_tbody">
                <!-- Question Type -->
                <td>
                  <span v-if="item.q_type">
                    {{ item.q_type }}
                  </span>
                  <span v-else>N/A</span>
                </td>

                <!-- Question -->
                <td class="param-value">
                  <span v-if="item.question">
                    <div v-html="item.question"></div>
                  </span>
                  <span v-else>N/A</span>
                </td>

                <!-- Description -->
                <!-- <td class="param-value">
                  <span v-if="item.description">
                    {{ item.description }}
                  </span>
                  <span v-else>N/A</span>
                </td> -->

                <!-- Sequence -->
                <td>
                  <span v-if="item.sequence">
                    {{ item.sequence }}
                  </span>
                  <span v-else>N/A</span>
                </td>

                <!-- Document -->
                <td>
                  <span v-if="item.doc_link">
                    <a :href="item.doc_link" target="_blank">
                      {{ item.doc_title || "View Document" }}
                    </a>
                  </span>
                  <span v-else>N/A</span>
                </td>

                <!-- Status -->
                <td>
                  <v-btn
                    :loading="loader"
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
                  <v-tooltip text="Edit" location="bottom">
                    <template #activator="{ props }">
                      <v-icon
                        class="mr-2 edit_btn icon_size"
                        v-bind="props"
                        @click="goToEdit(item.slug)"
                      >
                        mdi-pencil-outline
                      </v-icon>
                    </template>
                  </v-tooltip>

                  <!-- DELETE -->
                  <v-tooltip text="Delete" location="bottom">
                    <template #activator="{ props }">
                      <v-icon
                        class="mr-2 delete_btn icon_size"
                        v-bind="props"
                        @click="deleteAssigned(item.id)"
                      >
                        mdi-trash-can-outline
                      </v-icon>
                    </template>
                  </v-tooltip>
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
    assignedQuestions: [],

    google_icon: {
      icon_name: "assignment",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),

  mounted() {
    this.fetchAssignedQuestions();
  },

  computed: {
    headers() {
      return [
        { title: "Question Type", key: "q_type", sortable: true },
        { title: "Question", key: "question", sortable: false },
        // { title: "Description", key: "description", sortable: false },
        { title: "Sequence", key: "sequence", sortable: true },
        { title: "Document", key: "doc_link", sortable: false },
        { title: "Status", key: "status", sortable: false },
        { title: "Actions", key: "actions", sortable: false },
      ];
    },
  },

  methods: {
    async changeStatus(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to change the status?",
      );
      if (!result) return;

      this.loader = true;

      this.$axios
        .post("update_assign_policy_question_status", { id: id })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchAssignedQuestions();
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

    fetchAssignedQuestions() {
      this.loader = true;

      this.$axios
        .get("assign_policy_questions", {
          params: {
            parent_slug: this.$route.query.slug,
          },
        })
        .then((res) => {
          if (res.data.status === "S") {
            this.assignedQuestions = res.data.data;
          }
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.loader = false;
        });
    },

    goToCreate() {
      this.$router.push({
        name: "policy_question_amend",
        query: {
          parent_slug: this.$route.query.slug,
        },
      });
    },

    goToEdit(slug) {
      this.$router.push({
        name: "policy_question_amend",
        query: { slug: slug },
      });
    },

    async deleteAssigned(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this record?",
      );
      if (!result) return;

      this.loader = true;

      this.$axios
        .delete("assign_policy_questions/" + id)
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchAssignedQuestions();
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

    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },
  },
};
</script>

<style scoped>
.param-value {
  max-width: 250px;
  text-overflow: ellipsis;
  /* white-space: nowrap; */
  overflow: hidden;
}
.param-value:deep(p) {
  margin: 0px;
}
</style>
