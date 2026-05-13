<template>
  <div>
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>
    <div
      flat
      color="white"
      class="row my-3 align-items-center component_app_bar position-relative"
    >
      <page-title
        class="col-md-3"
        heading="Institutions"
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
            <router-link
              :to="{ name: 'institution_amend' }"
              style="color: white"
            >
              <v-btn size="small" class="mb-2 create-btn" v-bind="props">
                {{ $t("add_new") }}
              </v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="institutions"
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
            <span v-if="props.item.name">{{ props.item.name }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.type">{{ props.item.type }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.address">{{ props.item.address }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>

          <td class="px-0 text-center">
            <router-link
              :to="{
                name: 'institution_amend',
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
  </div>
</template>

<script>
export default {
  data: () => ({
    showConfirmDialog: false,
    search: "",
    dialog: false,
    institutions: [],
    initval: true,
    message: "",
    google_icon: {
      icon_name: "local_hospital",
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
          title: "Institution Name",
          align: "left",
          sortable: true,
          key: "name",
        },

        {
          title: "Type",
          key: "type",
        },
        {
          title: "Address",
          key: "address",
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
        "Are you sure you want to delete this Institution ?"
      );

      if (!result) return;
      this.delete_id = deleteID;
      this.initval = true;
      this.$axios
        .delete("institution/" + this.delete_id)
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
        .get("institution")
        .then((res) => {
          console.log("res.data");
          console.log(res.data);
          this.institutions = res.data.institutions;
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
