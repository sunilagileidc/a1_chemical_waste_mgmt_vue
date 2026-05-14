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
        <div class="d-flex justify-space-between align-center">
          <page-title heading="Action Master" :google_icon="google_icon" />
          <div class="col-md-4 d-flex justify-content-end">
            <!-- v-if="hasPermission('ADD ACTION MASTER')" -->
            <v-tooltip text="Add New" location="bottom">
              <template #activator="{ props }">
                <v-btn
                  v-if="user.rolename == 'SuperUser'"
                  size="small"
                  class="mb-2 create-btn"
                  v-bind="props"
                  @click="routeToAmend()"
                >
                  Add New
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </div>
        <!-- Stats section -->
        <stats-page :stats="stats" />
        <!-- Stats section -->
        <!-- Search Bar -->
        <div class="search-wrapper">
          <v-text-field
            density="comfortable"
            variant="solo"
            flat
            placeholder="Search here..."
            hide-details
            append-inner-icon="mdi-magnify"
            v-model="search"
            class="search-field"
          ></v-text-field>
        </div>
        <!-- Data Table Card -->
        <v-card class="table-card pa-4">
          <v-data-table
            :headers="headers"
            :items="actions"
            :search="search"
            :loading="loading"
            class="table-card"
          >
            <template #item="{ item }">
              <tr class="vdatatable_tbody">
                <td>{{ item.action_name }}</td>
                <td>{{ item.category }}</td>
                <td class="desc_div_overflow">{{ item.description }}</td>

                <!-- STATUS -->
                <td class="text-center">
                  <v-btn
                    size="small"
                    class="hover_shine"
                    :color="item.status === 1 ? 'success' : 'warning'"
                    @click="toggleStatus(item.id)"
                  >
                    {{ item.status === 1 ? "Active" : "Inactive" }}
                  </v-btn>
                </td>

                <!-- ACTIONS -->
                <td class="text-center px-0">
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

                  <!-- <span>
                    <v-tooltip text="Delete" location="bottom">
                      <template #activator="{ props }">
                        <v-icon
                          @click="deleteItem(item.id)"
                          class="delete_btn icon_size"
                          v-bind="props"
                        >
                          mdi-trash-can-outline
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </span> -->
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
  data() {
    return {
      actions: [],
      loading: false,
      search: "",

      headers: [
        { title: "Action Name", key: "action_name", sortable: true },
        { title: "Category", key: "category", sortable: true },
        { title: "Description", key: "description", sortable: false },
        { title: "Status", key: "status", align: "center" },
        { title: "Actions", align: "center", sortable: false },
      ],

      google_icon: {
        icon_name: "policy",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      dialogMessage: "",
      dialogTitle: "",
      user: null,
      permissions: [],
    };
  },

  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.fetchActions();
  },

  methods: {
    hasPermission(actionName) {
      return this.permissions.includes(actionName);
    },

    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    goToEdit(slug) {
      this.$router.push({
        name: "action_master_amend",
        query: { slug: slug },
      });
    },

    routeToAmend() {
      this.$router.push({ name: "action_master_amend" });
    },

    fetchActions() {
      this.loading = true;
      this.$axios
        .get("action_master")
        .then((res) => {
          this.actions = res.data.data;
        })
        .finally(() => (this.loading = false));
    },

    async deleteItem(deleteId) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this action ?",
      );

      if (!result) return;
      this.$axios.delete(`action_master/${deleteId}`).then(() => {
        this.$toast.success("Action deleted");
        this.fetchActions();
      });
    },

    async toggleStatus(rowid) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to change the status of this action?",
      );

      if (!result) return;
      this.$axios
        .post("update_action_master_status", { id: rowid })
        .then(() => {
          this.$toast.success("Status updated");
          this.fetchActions();
        });
      this.showStatusDialog = false;
    },
  },
};
</script>

<style scoped>
.param-value {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc_div_overflow {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
