<template>
  <div>
    <div
      flat
      color="white"
      class="row my-3 align-items-center component_app_bar position-relative"
      v-bind:class="[sel_lang == 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-3"
        :heading="$t('role')"
        :google_icon="google_icon"
      ></page-title>

      <div class="col-md-4">
        <v-tooltip :text="this.$t('search')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-text-field
              rounded
              density="compact"
              variant="outlined"
              elevation="24"
              v-bind="props"
              v-model="search"
              append-icon="search"
              v-bind:label="$t('search')"
              hide-details
              class="srch_bar"
            ></v-text-field>
          </template>
        </v-tooltip>
      </div>

      <div class="add_new_button">
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link :to="{ name: 'roles_amend' }" style="color: white">
              <v-btn size="small" class="mb-2 create-btn" v-bind="props">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="roles"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :items-per-page-text="$t('rows_per_page')"
      v-bind:style="$route.params.lang == 'ar' ? 'direction:rtl' : ''"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>{{ props.item.rolename }}</td>
          <td>{{ props.item.roledescription }}</td>
          <td class="text-center px-0">
            <router-link
              small
              class="mr-2"
              :to="{
                name: 'roles_amend',
                query: { slug: props.item.slug },
              }"
            >
              <v-tooltip :text="this.$t('edit')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon class="mr-2 edit_btn icon_size" v-bind="props"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
                <span>{{ $t("edit") }}</span>
              </v-tooltip>
            </router-link>
            <router-link
              class="mr-2"
              :to="{
                name: 'roles_assign',
                query: {
                  slug: props.item.slug,
                  id: props.item.id,
                  name: props.item.rolename,
                },
              }"
            >
              <v-tooltip :text="this.$t('edit')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon class="mr-1" color="cancel" v-bind="props"
                    >mdi-cog</v-icon
                  >
                </template>
                <span>Assign menus/actions to role</span>
              </v-tooltip>
            </router-link>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: { PageTitle },
  data: () => ({
    search: "",
    dialog: false,
    initval: true,
    google_icon: {
      icon_name: "manage_accounts",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    roles: [],
    sel_lang: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: this.$t("name"),
          key: "rolename",
        },
        {
          title: this.$t("description"),
          key: "roledescription",
        },

        {
          title: this.$t("action"),
          align: "center",
          key: "class_name",
        },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    "$i18n.locale"(newLocale) {
      if (newLocale === "ar") {
        this.sel_lang = "ar";
      } else {
        ("");
        this.sel_lang = "en";
      }
    },
  },

  created() {},
  mounted() {
    this.initialize();
  },

  methods: {
    deleteRole(role) {
      this.$axios
        .delete("roles/" + role.id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.initialize();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.initialize();
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("error", err);
        });
    },

    initialize() {
      this.initval = true;
      this.$axios
        .get("roles")
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.roles = res.data.role;
            this.initval = false;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
            this.initval = false;
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
          this.initval = false;
        });
    },

    deleteItem(item) {
      const index = this.roles.indexOf(item);
      if (confirm(this.$t("delete_confirmation"))) {
        this.deleteRole(this.roles[index]);
        this.roles.splice(index, 1);
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
  },
};
</script>
<style scoped></style>
