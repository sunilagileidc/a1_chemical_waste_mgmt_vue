<template>
  <div>
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
            <page-title
              class="col-md-5 ml-2"
              :heading="'Assign Menus/Actions to ' + name_val"
              :google_icon="google_icon"
            />
          </div>
          <!-- Data Table Card -->
          <div class="mb-3 mx-auto">
            <div class="card-body">
              <content-loader v-if="loader"></content-loader>
              <v-tabs v-model="tab">
                <v-tab value="menu">Role Menu</v-tab>
                <v-tab value="action">Role Action</v-tab>
              </v-tabs>

              <v-window v-model="tab" class="mt-4">
                <!-- Role Menu -->
                <v-window-item value="menu">
                  <RoleMenu />
                </v-window-item>

                <!-- Role Action -->
                <v-window-item value="action">
                  <RoleAction />
                </v-window-item>
              </v-window>
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import RoleMenu from "./RolesMenu.vue";
import RoleAction from "./RolesAction.vue";

export default {
  components: {
    RoleMenu,
    RoleAction,
  },

  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    loader: false,
    slug_val: "",
    id_val: "",
    name_val: "",
    tab: "menu",
  }),
  mounted() {
    this.name_val = this.$route.query.name;
  },
  watch: {},
};
</script>
