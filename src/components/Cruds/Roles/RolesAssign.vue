<template>
  <div class="mt-3 p-0">
    <div class=" p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="'Assign Menus/Actions to ' + name_val"
        :google_icon="google_icon"
      />
    </div>

    <content-loader v-if="loader" />

    <v-card v-else elevation="0">
      <v-tabs v-model="tab">
        <v-tab value="menu">Role Menu</v-tab>
        <v-tab value="action">Role Action</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="mt-4">
        <!-- Role Menu -->
        <v-window-item value="menu">
          <RoleMenu
          />
        </v-window-item>

        <!-- Role Action -->
        <v-window-item value="action">
          <RoleAction
          />
        </v-window-item>
      </v-window>
    </v-card>
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

  watch: {
    
  },
};
</script>
