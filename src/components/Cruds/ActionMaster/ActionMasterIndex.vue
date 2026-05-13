<template>
  <div class="main-20">
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>
    <div
      flat
      color="white"
      class="row my-3 align-items-center component_app_bar"
    >
      <div class="col-md-4">
        <page-title heading="Action Master" :google_icon="google_icon" />
      </div>

      <div class="col-md-4">
        <v-tooltip text="Search" location="bottom">
          <template #activator="{ props }">
            <v-text-field
              rounded
              density="compact"
              variant="outlined"
              v-bind="props"
              v-model="search"
              append-icon="search"
              label="Search"
              hide-details
              class="srch_bar"
            />
          </template>
        </v-tooltip>
      </div>
      <div
        class="col-md-4 d-flex justify-content-end"
        v-if="hasPermission('ADD ACTION MASTER')"
      >
        <v-tooltip text="Add New" location="bottom">
          <template #activator="{ props }">
            <v-btn
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

    <!-- TABLE -->
    <v-data-table
      :headers="headers"
      :items="actions"
      :search="search"
      :loading="loading"
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

            <span>
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
            </span>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
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

  mounted() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.loadPermissions(this.user.role_id);
    this.fetchActions();
  },

  methods: {
    async loadPermissions(roleId) {
      try {
        const res = await this.$axios.get("check_action_permission", {
          params: {
            role_id: roleId,
          },
        });

        if (res.data.status === "S") {
          this.permissions = res.data.permissions;
        }
      } catch (error) {
        this.permissions = [];
      }
    },

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
        "Are you sure you want to delete this action ?"
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
        "Are you sure you want to change the status of this action?"
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
