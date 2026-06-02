<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>

    <div class="main-section">
      <div>
        <!-- Header -->
        <div class="d-flex justify-space-between align-center">
          <page-title
            class="col-md-3"
            :heading="$t('suppliers')"
            :google_icon="google_icon"
          ></page-title>

          <div class="add_new_button">
            <v-tooltip :text="$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link
                  :to="{ name: 'supplier_creation' }"
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
            placeholder="Search suppliers..."
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
            :items="suppliers"
            :search="search"
            :loading="tableLoading"
            :items-per-page-text="$t('rows_per_page')"
            show-expand
          >
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>
                  {{ props.item.supplier_name || $t("not_appllicable") }}
                </td>

                <td>
                  {{ props.item.supplier_telephone || $t("not_appllicable") }}
                </td>

                <td>
                  {{ props.item.supplier_email || $t("not_appllicable") }}
                </td>

                <td>
                  {{ props.item.supplier_license || $t("not_appllicable") }}
                </td>
                <td>
                  <v-btn
                    class="hover_shine btn mr-2 status-btn"
                    size="small"
                    :color="props.item.active == 1 ? 'success' : 'warning'"
                  >
                    <span
                      v-if="props.item.active == 1"
                      class="spanactivesize"
                      >{{ $t("active") }}</span
                    >
                    <span v-else class="spanactivesize">{{
                      $t("inactive")
                    }}</span>
                  </v-btn>
                </td>

                <td>
                  <router-link
                    :to="{
                      name: 'supplier_creation',
                      query: { slug: props.item.slug },
                    }"
                  >
                    <v-icon class="mr-2 edit_btn icon_size">
                      mdi-pencil-outline
                    </v-icon>
                  </router-link>
                  <v-icon
                    color="success"
                    class="mr-2 icon_size"
                    @click="addContact(props.item)"
                  >
                    mdi-account-plus
                  </v-icon>
                  <!-- <v-icon
                    color="red"
                    class="icon_size"
                    @click="deleteSupplier(props.item.id)"
                  >
                    mdi-delete-outline
                  </v-icon> -->
                </td>
                <td>
                  <v-btn
                    icon
                    size="small"
                    variant="text"
                    @click="props.toggleExpand(props.internalItem)"
                  >
                    <v-icon>
                      {{
                        props.isExpanded(props.internalItem)
                          ? "mdi-chevron-up"
                          : "mdi-chevron-down"
                      }}
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
            <!-- Expanded Row -->
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td :colspan="columns.length">
                  <v-sheet border rounded class="ma-2">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Telephone</th>
                          <th>Email</th>
                          <th>Position</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="supplier in item.individuals || []"
                          :key="supplier.id"
                        >
                          <td>{{ supplier.name }}</td>
                          <td>{{ supplier.telephone }}</td>
                          <td>{{ supplier.email }}</td>
                          <td>{{ supplier.position }}</td>
                          <td>
                            {{ supplier.active == 1 ? "Active" : "Inactive" }}
                          </td>
                          <td>
                            <v-icon
                              color="primary"
                              class="mr-2"
                              @click="editContact(supplier)"
                            >
                              mdi-pencil-outline
                            </v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-sheet>
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
    suppliers: [],
    tableLoading: false,
    loader: false,
    dialogTitle: "",
    dialogMessage: "",
    suppliers: [],
  }),

  mounted() {
    this.fetchSuppliers();
  },

  computed: {
    headers() {
      return [
        {
          title: this.$t("name"),
          align: "left",
          sortable: true,
          key: "supplier_name",
        },
        {
          title: this.$t("phone"),
          align: "left",
          sortable: true,
          key: "supplier_telephone",
        },
        {
          title: this.$t("email"),
          align: "left",
          sortable: true,
          key: "supplier_email",
        },
        {
          title: "Disposal Licence",
          align: "left",
          sortable: true,
          key: "supplier_license",
        },
        {
          title: this.$t("status"),
          align: "left",
          sortable: false,
          key: "status",
        },
        {
          title: this.$t("actions"),
          align: "left",
          sortable: false,
          key: "actions",
        },
        {
          title: "",
          key: "data-table-expand",
          sortable: false,
          width: "50px",
        },
      ];
    },
  },

  methods: {
    addContact(supplier) {
      console.log(supplier);

      this.$router.push({
        name: "supplier_contact_creation",
        query: {
          supplier_id: supplier.id,
        },
      });
    },
    editContact(supplier) {
      this.$router.push({
        name: "supplier_contact_creation",
        query: {
          id: supplier.id,
        },
      });
    },
    fetchSuppliers() {
      this.tableLoading = true;

      this.$axios
        .get("suppliers")
        .then((res) => {
          this.suppliers = res.data.suppliers;
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
    async deleteSupplier(id) {
      const result = await this.showConfirmation(
        "Delete Supplier",
        "Are you sure you want to delete this supplier?"
      );

      if (!result) return;

      this.$axios
        .delete("deletesupplier/" + id)
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);
            this.fetchSuppliers();
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
.status-btn {
  cursor: default !important;
  pointer-events: none;
}
</style>