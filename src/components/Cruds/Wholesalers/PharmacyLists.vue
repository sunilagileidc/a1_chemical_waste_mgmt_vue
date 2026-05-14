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
            heading="Wholesaler Pharmacies"
            :google_icon="google_icon"
          ></page-title>
        </div>
        <!-- Stats section -->
        <!-- <stats-page :stats="stats" /> -->
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
            :headers="headers"
            :items="filteredData"
            item-value="institution_id"
          >
            <template v-slot:item="{ item }">
              <tr>
                <!-- Pharmacy -->
                <td>
                  <div class="font-weight-bold text-primary">
                    {{ item.institution_name }}
                  </div>
                  <div class="text-caption">
                    {{ item.institution_type }}
                  </div>
                </td>

                <!-- Type -->
                <!-- <td>
                  {{ item.institution_type || "-" }}
                </td> -->

                <!-- Drugs -->
                <td>
                  <div v-if="item.drugs && item.drugs.length">
                    <v-chip
                      v-for="(drug, index) in item.drugs"
                      :key="index"
                      size="small"
                      class="ma-1"
                    >
                      {{ drug.drug_name }}
                    </v-chip>
                  </div>
                  <div v-else>-</div>
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
    wholesaler_drugs: [],
    stats: [
      { label: "Total PAFs", value: 58 },
      { label: "Total patients", value: 9 },
      { label: "Overdue PAF (Action Required)", value: 7 },
      { label: "Rejected PAF", value: 0 },
    ],
    sel_lang: "",
    dialogMessage: "",
    dialogTitle: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    filteredData() {
      if (!this.search) return this.wholesaler_drugs;

      const search = this.search.toLowerCase();

      return this.wholesaler_drugs.filter((item) => {
        // Institution Name
        if (item.institution_name?.toLowerCase().includes(search)) {
          return true;
        }

        // Institution Type (NEW)
        if (item.institution_type?.toLowerCase().includes(search)) {
          return true;
        }

        // Drugs
        if (
          item.drugs?.some((drug) =>
            drug.drug_name?.toLowerCase().includes(search)
          )
        ) {
          return true;
        }

        // Optional: Pharmacists
        if (
          item.pharmacists?.some((ph) =>
            ph.user_name?.toLowerCase().includes(search)
          )
        ) {
          return true;
        }

        return false;
      });
    },
    headers() {
      return [
        {
          title: "Pharmacy",
          value: "institution_name",
        },

        {
          title: "Drugs",
          value: "drugs",
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
    initialize() {
      this.initval = true;
      this.$axios
        .get("fetch_wholesaler_drugs")
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.wholesaler_drugs = res.data.data;
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
