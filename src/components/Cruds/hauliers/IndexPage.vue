<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>

    <div class="main-section">
      <div>
        <!-- Header -->
        <div class="d-flex justify-space-between align-center">
          <page-title
            class="col-md-3"
            :heading="$t('hauliers')"
            :google_icon="google_icon"
          ></page-title>

          <div class="add_new_button">
            <v-tooltip :text="$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link
                  :to="{ name: 'haulier_creation' }"
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

        <!-- Search -->
        <div class="search-wrapper">
          <v-text-field
            v-model="search"
            placeholder="Search hauliers..."
            append-inner-icon="mdi-magnify"
            variant="solo"
            flat
            hide-details
            density="comfortable"
            class="search-field"
          ></v-text-field>
        </div>

        <!-- Table -->
        <v-card class="table-card pa-4">
          <v-data-table
            class="table-card"
            :headers="headers"
            :items="hauliers"
            :search="search"
            :loading="tableLoading"
            :items-per-page-text="$t('rows_per_page')"
          >
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>
                  {{ props.item.haulier_name || $t("not_appllicable") }}
                </td>

                <td>
                  {{ props.item.haulier_telephone || $t("not_appllicable") }}
                </td>

                <td>
                  {{ props.item.haulier_email || $t("not_appllicable") }}
                </td>

                <td>
                  {{ props.item.haulier_license || $t("not_appllicable") }}
                </td>

                <td>
                  <router-link
                    :to="{
                      name: 'haulier_creation',
                      query: { slug: props.item.slug },
                    }"
                  >
                    <v-icon class="mr-2 edit_btn icon_size">
                      mdi-pencil-outline
                    </v-icon>
                  </router-link>
                  <!-- <v-icon
                    color="red"
                    class="icon_size"
                    @click="deleteHaulier(props.item.id)"
                  >
                    mdi-delete-outline
                  </v-icon> -->
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </div>
      <confirmation-dialog
        ref="confirmationDialog"
        :title="dialogTitle"
        :message="dialogMessage"
      ></confirmation-dialog>
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    google_icon: {
      icon_name: "groups",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },

    search: "",
    hauliers: [],
    tableLoading: false,
    loader: false,
    dialogTitle: "",
    dialogMessage: "",
    hauliers: [],
  }),

  mounted() {
    this.fetchHauliers();
  },

  computed: {
    headers() {
      return [
        {
          title: this.$t("name"),
          align: "left",
          sortable: true,
          key: "haulier_name",
        },
        {
          title: this.$t("phone"),
          align: "left",
          sortable: true,
          key: "haulier_telephone",
        },
        {
          title: this.$t("email"),
          align: "left",
          sortable: true,
          key: "haulier_email",
        },
        {
          title: "Carrier Licence",
          align: "left",
          sortable: true,
          key: "haulier_license",
        },
        {
          title: this.$t("actions"),
          align: "left",
          sortable: false,
          key: "actions",
        },
      ];
    },
  },

  methods: {
    fetchHauliers() {
      this.tableLoading = true;

      this.$axios
        .get("hauliers")
        .then((res) => {
          this.hauliers = res.data.hauliers;
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },
    async deleteHaulier(id) {
      const result = await this.showConfirmation(
        "Delete Haulier",
        "Are you sure you want to delete this haulier?"
      );

      if (!result) return;

      this.$axios
        .delete("deletehaulier/" + id)
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);
            this.fetchHauliers();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error(this.$t("something_went_wrong"));
        });
    },
  },
};
</script>

<style scoped>
.v-icon--size-default {
  font-size: calc(var(--v-icon-size-multiplier) * 2em) !important;
}
</style>