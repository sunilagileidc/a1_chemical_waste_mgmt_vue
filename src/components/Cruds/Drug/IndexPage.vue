<template>
  <div>
    <div
      flat
      color="white"
      class="row my-3 align-items-center component_app_bar position-relative"
    >
      <page-title
        class="col-md-3"
        heading="Drug"
        :google_icon="google_icon"
      ></page-title>
      <content-loader v-if="loader"></content-loader>
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
            <router-link :to="{ name: 'drug_amend' }" style="color: white">
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
      :items="drug"
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
            <span v-if="props.item.drug_name">{{ props.item.drug_name }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span>
              {{ props.item.validity }}
              {{ props.item.validity == 1 ? "month" : "months" }}
            </span>
          </td>
          <td>
            <span
              v-if="props.item.drug_strength && props.item.drug_strength.length"
            >
              {{
                props.item.drug_strength
                  .map((item) => item.capsule_strength)
                  .join(", ")
              }}
            </span>

            <span v-else>
              {{ $t("not_appllicable") }}
            </span>
          </td>
          <td>
            <span v-if="props.item.capsules && props.item.capsules.length">
              {{
                props.item.capsules
                  .map((item) => parseInt(item.no_of_capsules))
                  .join(", ")
              }}
            </span>

            <span v-else>
              {{ $t("not_appllicable") }}
            </span>
          </td>
          <td>
            <span v-if="props.item.drug_form">
              {{ props.item.drug_form }}
            </span>
            <span v-else>
              {{ $t("not_appllicable") }}
            </span>
          </td>
          <td>
            <span v-if="props.item.cycles && props.item.cycles.length">
              {{
                props.item.cycles
                  .map((item) => item.no_of_cycle_weeks)
                  .join(", ")
              }}
            </span>

            <span v-else>
              {{ $t("not_appllicable") }}
            </span>
          </td>
          <td>
            <span v-if="props.item.sequence">
              {{ props.item.sequence }}
            </span>

            <span v-else>
              {{ $t("not_appllicable") }}
            </span>
          </td>
          <td>
            <v-btn
              v-if="
                props.item.status !== null && props.item.status !== undefined
              "
              @click="updateDrugStatus(props.item.id)"
              class="hover_shine btn mr-2"
              :disabled="isDisabled"
              size="small"
              :color="props.item.status === 1 ? 'success' : 'warning'"
            >
              <span class="spanactivesize">
                {{ props.item.status === 1 ? $t("active") : $t("inactive") }}
              </span>
            </v-btn>
          </td>

          <td class="px-0 text-center">
            <router-link
              :to="{
                name: 'drug_amend',
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

            <v-tooltip :text="$t('force_to_reregister')" location="bottom">
              <template v-slot:activator="{ props: tooltipProps }">
                <v-icon
                  v-bind="tooltipProps"
                  @click="forceToReRegisterBulk(props.item)"
                  class="mr-2 edit_btn icon_size"
                  v-if="action_permissions.includes('FORCE REREGISTER DRUG')"
                >
                  mdi-account-reactivate
                </v-icon>
              </template>
            </v-tooltip>

            <!-- <span @click="deleteItem(props.item.id)">
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
            </span> -->
          </td>
        </tr>
      </template>
    </v-data-table>
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    loader: false,
    drug: [],
    initval: true,
    message: "",
    delete_id: null,
    dialogMessage: "",
    dialogTitle: "",
    google_icon: {
      icon_name: "medication_liquid",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    action_permissions: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: "Drug Name",
          align: "left",
          sortable: true,
          key: "drug_name",
        },
        {
          title: "Validity",
          key: "validity",
        },
        {
          title: "Drug Strength",
          key: "drug_strength",
        },
        {
          title: "Capsules",
          key: "capsules",
        },
        {
          title: "Drug Form",
          key: "drug_form",
        },
        {
          title: "Cycles",
          key: "cycles",
        },
        {
          title: "Sequence",
          key: "sequence",
        },
        {
          title: "Status",
          key: "status",
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
    this.action_permissions = JSON.parse(
      localStorage.getItem("action_permissions") || "[]"
    );
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

    async deleteItem(deleteId) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this Drug ?",
      );
      if (!result) return;
      this.$axios.delete(`drug/${deleteId}`).then((res) => {
        this.$toast.success(res.data.message);
        this.initialize();
      });
    },

    initialize() {
      this.$axios
        .get("fetch_drug")
        .then((res) => {
          this.drug = res.data.drug;
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

    async updateDrugStatus(status_id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update this drug status ?",
      );

      if (!result) return;
      this.loader = true;
      this.$axios
        .post("update_drug_status", {
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

    async forceToReRegisterBulk(selectedDrug) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to force re-registration for this drug?"
      );

      if (!result) return;

      this.loader = true;

      const payload = {
        drug_id: selectedDrug.id,
      };

      this.$axios
        .post("force_to_re_register_drug_level", payload)
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.initialize();
          } else {
            this.$toast.warning(res.data.message);
          }
        })
        .catch((err) => {
          this.$toast.error(
            err?.response?.data?.message || "Something went wrong"
          );
        })
        .finally(() => {
          this.loader = false;
        });
    }
  },
};
</script>
<style scoped></style>
