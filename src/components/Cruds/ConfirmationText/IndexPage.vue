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
            class="col-md-5"
            heading="Confirmation Texts"
            :google_icon="google_icon"
          ></page-title>
          <div class="add_new_button">
            <v-tooltip :text="this.$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link
                  :to="{ name: 'confirmation-text-amend' }"
                  style="color: white"
                >
                  <v-btn size="small" class="mb-2 btn-filled" v-bind="props">{{
                    $t("add_new")
                  }}</v-btn>
                </router-link>
              </template>
            </v-tooltip>
          </div>
        </div>
        <!-- Stats section -->

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
            class="table-card"
            :headers="headers"
            :items="confirmation_texts"
            :search="search"
            :loading="initval"
            v-bind:no-data-text="$t('no_data_available')"
            :footer-props="{
              'items-per-page-text': $t('rows_per_page'),
            }"
          >
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>
                  <span v-if="props.item.type">
                    {{ props.item.type }}
                  </span>

                  <span v-else>
                    {{ $t("not_appllicable") }}
                  </span>
                </td>
                <td>
                  <span v-if="props.item.drug_id">
                    {{ getDrugName(props.item.drug_id) }}
                  </span>

                  <span v-else>
                    {{ $t("not_appllicable") }}
                  </span>
                </td>
                <td>
                  <span v-if="props.item.patient_category">
                    {{ props.item.patient_category }}
                  </span>

                  <span v-else>
                    {{ $t("not_appllicable") }}
                  </span>
                </td>
                <td>
                  <span v-if="props.item.note">
                    {{ props.item.note }}
                  </span>

                  <span v-else>
                    {{ $t("not_appllicable") }}
                  </span>
                </td>

                <td>
                  <v-btn
                    v-if="
                      props.item.status !== null &&
                      props.item.status !== undefined
                    "
                    @click="updateConfirmationStatus(props.item.id)"
                    class="hover_shine btn mr-2"
                    :disabled="isDisabled"
                    size="small"
                    :color="props.item.status === 1 ? 'success' : 'warning'"
                  >
                    <span class="spanactivesize">
                      {{
                        props.item.status === 1 ? $t("active") : $t("inactive")
                      }}
                    </span>
                  </v-btn>
                </td>

                <td class="px-0 text-center">
                  <router-link
                    :to="{
                      name: 'confirmation-text-amend',
                      query: { id: props.item.id },
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
    search: "",
    dialog: false,
    loader: false,

    initval: true,
    message: "",
    delete_id: null,
    dialogMessage: "",
    dialogTitle: "",
    google_icon: {
      icon_name: "check_circle",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    action_permissions: [],
    confirmation_texts: [],
    ref_value_array: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: "Type",
          align: "left",
          sortable: true,
          key: "type",
        },
        {
          title: "Drug",
          align: "left",
          sortable: true,
          key: "drug_id",
        },
        {
          title: "Patient Category",
          align: "left",
          sortable: true,
          key: "patient_id",
        },

        {
          title: "Note",
          key: "note",
        },
        {
          title: "Status",
          key: "status",
        },
        {
          title: "Actions",
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

    this.action_permissions = JSON.parse(
      localStorage.getItem("action_permissions") || "[]"
    );
  },
  mounted() {
    this.initialize();
    this.fetchDrugList();
  },

  methods: {
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },
    getDrugName(id) {
      const drug = this.ref_value_array.find((d) => d.drug_id == id);
      return drug ? drug.drug_name : this.$t("not_appllicable");
    },
    fetchDrugList() {
      this.refListLoader = true;
      this.ref_value_array = [];
      this.$axios
        .get("fetch_active_drugs")
        .then((res) => {
          this.ref_value_array = res.data.drugs;
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.refListLoader = false;
        });
    },

    initialize() {
      this.$axios
        .get("fetch_confirmation_texts")
        .then((res) => {
          this.confirmation_texts = res.data.confirmation_texts;
          this.initval = false;
          this.loader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          this.loader = false;
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

    async updateConfirmationStatus(status_id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update this Confirmation status ?"
      );

      if (!result) return;
      this.loader = true;
      this.$axios
        .post("update_confirmation_text_status", {
          id: status_id,
        })
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
            this.loader = false;
          } else {
            this.$toast.error(this.array_data);
            this.loader = false;
            this.initialize();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
          this.loader = false;
        });
    },
  },
};
</script>
<style scoped></style>
