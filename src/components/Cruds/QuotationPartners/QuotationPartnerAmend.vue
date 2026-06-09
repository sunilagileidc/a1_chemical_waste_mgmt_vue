<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="mx-2 mt-3 p-0 main-section">
      <!-- TITLE -->
      <div class="my-3 d-flex align-center justify-space-between">
        <page-title
          class="ml-2"
          heading="Quotation Partner"
          :google_icon="google_icon"
        />
      </div>

      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form">
            <div class="row">
              <div class="col-md-12 pl-6">
                <!-- ROW 1 -->
                <v-row class="px-4">
                  <!-- Partner Type -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="partner.partner_type"
                      variant="outlined"
                      density="compact"
                      label="Partner Type"
                      :items="[
                        {
                          title: 'Supplier',
                          value: 'supplier',
                        },
                        {
                          title: 'Haulier',
                          value: 'haulier',
                        },
                      ]"
                      hide-details="auto"
                    />
                  </v-col>

                  <!-- Partner -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="partner.partner_id"
                      variant="outlined"
                      density="compact"
                      label="Partner"
                      :items="filteredPartners"
                      item-title="name"
                      item-value="id"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>

                <!-- ROW 2 -->
                <v-row class="px-4">
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="partner.quotation_date"
                      variant="outlined"
                      density="compact"
                      label="Quotation Date"
                      type="date"
                      hide-details="auto"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="partner.transport_cost"
                      variant="outlined"
                      density="compact"
                      label="Transport Cost"
                      type="number"
                      hide-details="auto"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="partner.document_cost"
                      variant="outlined"
                      density="compact"
                      label="Document Cost"
                      type="number"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>

                <!-- ROW 3 -->
                <v-row class="px-4">
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="partner.fuel_charge"
                      variant="outlined"
                      density="compact"
                      label="Fuel Charge"
                      type="number"
                      hide-details="auto"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="partner.demurrage_charge"
                      variant="outlined"
                      density="compact"
                      label="Demurrage"
                      type="number"
                      hide-details="auto"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="partner.number_pallets"
                      variant="outlined"
                      density="compact"
                      label="Number Pallets"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>

                <!-- ROW 4 -->
                <v-row class="px-4">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="partner.load_type"
                      variant="outlined"
                      density="compact"
                      label="Load Type"
                      hide-details="auto"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="partner.load_other"
                      variant="outlined"
                      density="compact"
                      label="Load Other"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>

                <!-- ROW 5 -->
                <v-row class="px-4">
                  <v-col cols="12">
                    <v-textarea
                      v-model="partner.haulier_notes"
                      variant="outlined"
                      density="compact"
                      label="Haulier Notes"
                      rows="3"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-form>
        </div>

        <!-- BUTTONS -->
        <div class="d-block mr-4 mt-3 text-right">
          <v-btn
            size="small"
            class="btn-cancel ma-1"
            color="cancel"
            @click="cancel"
          >
            {{ $t("cancel") }}
          </v-btn>

          <v-btn
            size="small"
            color="success"
            class="status-approved mr-2"
            @click="submit"
          >
            {{ $t("submit") }}
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";

export default {
  components: {
    PageTitle,
  },

  data() {
    return {
      google_icon: {
        icon_name: "groups",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      suppliers: [],
      hauliers: [],

      partner: {
        id: 0,
        sales_quotation_id: null,
        partner_type: "supplier",
        partner_id: null,
        quotation_date: new Date().toISOString().substr(0, 10),
        transport_cost: 0,
        document_cost: 0,
        fuel_charge: 0,
        demurrage_charge: 0,
        load_type: "",
        load_other: "",
        number_pallets: "",
        haulier_notes: "",
      },
    };
  },
  computed: {
    filteredPartners() {
      if (this.partner.partner_type == "haulier") {
        return this.hauliers;
      }
      return this.suppliers;
    },
  },

  mounted() {
    if (this.quotationId) {
      this.partner.sales_quotation_id = this.quotationId;
    }

    this.loadSuppliers();
    this.loadHauliers();
  },

  methods: {
    loadSuppliers() {
      this.$axios.get("suppliers").then((res) => {
        this.suppliers = res.data.suppliers.map((item) => ({
          id: item.id,
          name: item.supplier_name,
        }));
      });
    },

    loadHauliers() {
      this.$axios.get("hauliers").then((res) => {
        this.hauliers = res.data.hauliers.map((item) => ({
          id: item.id,
          name: item.haulier_name,
        }));
      });
    },

    submit() {
      this.$axios
        .post("savequotationpartner", this.partner)
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);

            this.$emit("saved");

            this.$emit("close");
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error("Something went wrong");
        });
    },

    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>