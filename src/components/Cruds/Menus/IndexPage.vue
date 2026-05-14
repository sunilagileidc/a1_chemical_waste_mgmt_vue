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
          <page-title
            class="col-md-3"
            :heading="$t('menus')"
            :google_icon="google_icon"
          ></page-title>
          <div class="add_new_button">
            <v-tooltip :text="this.$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link :to="{ name: 'menu_amend' }" style="color: white">
                  <v-btn size="small" class="mb-2 btn-filled" v-bind="props">
                    {{ $t("add_new") }}
                  </v-btn>
                </router-link>
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
            v-model="search"
            placeholder="Search here..."
            append-inner-icon="mdi-magnify"
            variant="solo"
            flat
            hide-details
            density="comfortable"
            class="search-field"
          ></v-text-field>
        </div>
        <!-- Data Table Card -->
        <v-card class="table-card pa-4">
          <v-data-table
            class="table-card"
            :headers="headers"
            :items="menu"
            :search="search"
            :loading="initval"
            v-bind:no-data-text="$t('no_data_available')"
            :footer-props="{
              'items-per-page-text': $t('rows_per_page'),
            }"
            v-bind:style="$route.params.lang == 'ar' ? 'direction:rtl' : ''"
          >
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>
                  <span v-if="props.item.title">{{ props.item.title }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.href">{{ props.item.href }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.parent_name">{{
                    props.item.parent_name
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.seq">{{ props.item.seq }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>

                <td class="px-0 text-center">
                  <router-link
                    :to="{
                      name: 'menu_amend',
                      query: { slug: props.item.slug },
                    }"
                  >
                    <v-tooltip :text="this.$t('edit')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          plain
                          v-bind="props"
                          dense
                          class="mr-2 edit_btn icon_size"
                          >mdi-pencil-outline</v-icon
                        >
                      </template>
                    </v-tooltip>
                  </router-link>

                  <span @click="deleteItem(props.item.id)">
                    <v-tooltip :text="this.$t('delete')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon
                          type="button"
                          class="delete_btn icon_size"
                          v-bind="props"
                          dense
                          color="error"
                          >mdi-trash-can-outline</v-icon
                        >
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
    showConfirmDialog: false,
    search: "",
    dialog: false,
    menu: [],
    initval: true,
    message: "",
    google_icon: {
      icon_name: "menu",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    dialogMessage: "",
    dialogTitle: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: this.$t("title"),
          align: "left",
          sortable: true,
          key: "title",
        },
        {
          title: this.$t("link"),
          key: "href",
        },
        {
          title: this.$t("parent"),
          key: "parent_name",
        },
        {
          title: this.$t("sequence"),
          key: "seq",
        },
        {
          title: this.$t("action"),
          key: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },
  mounted() {
    this.initialize();
  },

  methods: {
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    async deleteItem(deleteID) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this menu ?"
      );

      if (!result) return;
      this.initval = true;
      this.$axios
        .delete("menu/" + deleteID)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.initval = false;
            this.$toast.error(this.array_data);
            this.initialize();
          } else {
            this.initval = false;
            this.$toast.success(this.array_data);
            this.initialize();
          }
        })
        .catch((err) => {
          this.initval = false;
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    initialize() {
      this.$axios
        .get("menu")
        .then((res) => {
          this.menu = res.data.menu;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.initval = false;
        });
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
