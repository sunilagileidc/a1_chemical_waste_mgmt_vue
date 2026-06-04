<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="mx-2 mt-3 p-0 main-section">
      <div class="my-3 d-flex align-center justify-space-between">
        <page-title
          class="ml-2"
          :heading="$t('Sales Quotation')"
          :google_icon="google_icon"
        ></page-title>
      </div>

      <content-loader v-if="loader"></content-loader>

      <div class="mb-3 mx-auto">
        <div class="card-body">
          <v-form ref="form" v-model="valid">
            <v-row class="px-4">
              <!-- Customer -->
              <v-col cols="12" md="6">
                <v-select
                  variant="outlined"
                  density="compact"
                  label="Customer"
                  class="required_field"
                  v-model="quotation.customer_id"
                  :items="customers"
                  item-title="company_name"
                  item-value="id"
                  :rules="fieldRules"
                  hide-details="auto"
                ></v-select>
              </v-col>

              <!-- Quotation Date -->
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  type="date"
                  label="Quotation Date"
                  v-model="quotation.quotation_date"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <!-- Job Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Job Name"
                  v-model="quotation.job_name"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="6">
                <v-select
                  variant="outlined"
                  density="compact"
                  label="Status"
                  :items="[
                    { title: 'Draft', value: 'draft' },
                    { title: 'Finalised', value: 'finalised' },
                    { title: 'Cancelled', value: 'cancelled' },
                  ]"
                  v-model="quotation.status"
                ></v-select>
              </v-col>
            </v-row>

            <!-- Items Section -->

            <v-divider class="my-4"></v-divider>

            <h4 class="ml-4 mb-3">Waste Items</h4>

            <v-row
              v-for="(item, index) in quotation.items"
              :key="index"
              class="px-4"
            >
              <v-col cols="12" md="3">
                <v-select
                  variant="outlined"
                  density="compact"
                  label="Waste Stream"
                  v-model="item.waste_stream_id"
                  :items="wasteStreams"
                  item-title="waste_description"
                  item-value="id"
                ></v-select>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Size"
                  v-model="item.quote_size"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Qty"
                  type="number"
                  v-model="item.quote_qty"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Unit Price"
                  type="number"
                  v-model="item.quote_unit_price"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Total"
                  :model-value="
                    Number(item.quote_qty || 0) *
                    Number(item.quote_unit_price || 0)
                  "
                  readonly
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="1">
                <v-btn color="red" icon size="small" @click="removeItem(index)">
                  <v-icon> mdi-delete-outline </v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-btn size="small" color="primary" class="ml-4" @click="addItem">
              Add Item
            </v-btn>

            <!-- Amounts -->

            <v-row class="px-4 mt-5">
              <v-col cols="12" md="4">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Transport Cost"
                  type="number"
                  v-model="quotation.transport_cost"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Document Cost"
                  type="number"
                  v-model="quotation.document_cost"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  variant="outlined"
                  density="compact"
                  label="Total Cost"
                  :model-value="totalCost"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </div>

        <!-- Buttons -->
        <v-btn
          color="primary"
          class="mr-2"
          @click="
            $router.push({
              name: 'quotation_partner_creation',
              query: {
                sales_quotation_id: this.quotation.id,
              },
            })
          "
        >
          Partners
        </v-btn>
        <!-- <v-btn
          v-if="quotation.id"
          color="primary"
          size="small"
          class="ml-2"
          @click="
            $router.push({
              name: 'quotation_partners',
              query: {
                sales_quotation_id: this.quotation.id,
              },
            })
          "
        >
          Quotation Partners
        </v-btn> -->

        <div class="d-block mr-4 mt-3 text-right">
          <v-btn
            size="small"
            @click="cancel"
            class="btn-cancel mr-2"
            color="cancel"
          >
            {{ $t("cancel") }}
          </v-btn>

          <v-btn
            :disabled="isDisabled"
            @click="submit"
            size="small"
            class="status-approved"
            color="success"
          >
            {{ $t("submit") }}

            <v-progress-circular
              v-if="isDisabled"
              indeterminate
              width="1"
              size="x-small"
              class="ml-2"
            ></v-progress-circular>
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
      valid: false,
      loader: false,
      isDisabled: false,

      customers: [],
      wasteStreams: [],

      google_icon: {
        icon_name: "request_quote",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      quotation: {
        id: 0,
        quotation_number: "QT-" + Date.now(),
        customer_id: null,
        job_name: "",
        quotation_date: new Date().toISOString().substr(0, 10),
        transport_cost: 0,
        document_cost: 0,
        status: "draft",
        items: [],
      },
    };
  },

  computed: {
    totalCost() {
      let total = 0;

      this.quotation.items.forEach((item) => {
        total += item.quote_qty * item.quote_unit_price;
      });

      return (
        total +
        Number(this.quotation.transport_cost) +
        Number(this.quotation.document_cost)
      );
    },
    total() {
      let total = 0;

      this.quotation.items.forEach((row) => {
        total += (row.quote_qty || 0) * (row.quote_unit_price || 0);
      });

      return total;
    },
  },

  mounted() {
    this.loadCustomers();

    this.loadWasteStreams();

    if (this.$route.query.slug) {
      this.fetchQuotation();
    } else {
      this.addRow();
    }
  },

  methods: {
    fetchQuotation() {
      this.loader = true;

      this.$axios
        .get("salesquotationbyslug/" + this.$route.query.slug)
        .then((res) => {
          if (res.data.status == "S") {
            let data = res.data.quotation;

            this.quotation = {
              id: data.id,

              quotation_number: data.quotation_number,

              customer_id: data.customer_id,

              job_name: data.job_name,

              quotation_date: data.quotation_date,

              transport_cost: data.transport_cost,

              document_cost: data.document_cost,

              items: data.items.map((item) => ({
                id: item.id,

                waste_stream_id: item.waste_stream_id,

                supplier_id: item.supplier_id,

                quote_size: item.quote_size,

                quote_qty: item.quote_qty,

                quote_unit_price: item.quote_unit_price,
              })),
            };
          }
        })
        .catch((err) => {
          console.log(err);

          this.$toast.error("Unable to load quotation");
        })
        .finally(() => {
          this.loader = false;
        });
    },
    addItem() {
      this.quotation.items.push({
        waste_stream_id: null,
        quote_size: "",
        quote_qty: 0,
        quote_unit_price: 0,
      });
    },

    removeItem(index) {
      this.quotation.items.splice(index, 1);
    },
    addRow() {
      this.quotation.items.push({
        waste_stream_id: null,

        supplier_id: null,

        quote_qty: 0,

        quote_unit_price: 0,
      });
    },

    removeRow(index) {
      this.quotation.items.splice(index, 1);
    },

    loadCustomers() {
      this.$axios.get("customers").then((res) => {
        this.customers = res.data.customers;
      });
    },

    loadWasteStreams() {
      this.$axios.get("wastestreams").then((res) => {
        this.wasteStreams = res.data.waste_streams;
      });
    },

    submit() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.isDisabled = true;

      let payload = {
        id: this.quotation.id,

        customer_id: this.quotation.customer_id,

        job_name: this.quotation.job_name,

        quotation_date: this.quotation.quotation_date,

        transport_cost: this.quotation.transport_cost,

        document_cost: this.quotation.document_cost,

        total_cost: this.totalCost,

        items: this.quotation.items.map((item) => {
          return {
            waste_stream_id: item.waste_stream_id,

            supplier_id: item.supplier_id,

            quote_size: item.quote_size,

            quote_qty: item.quote_qty,

            quote_unit_price: item.quote_unit_price,
          };
        }),
      };

      this.$axios
        .post("savesalesquotation", payload)
        .then((res) => {
          if (res.data.status == "S") {
            this.$toast.success(res.data.message);

            this.$router.push({
              name: "sales_quotations",
            });
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);

          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.isDisabled = false;
        });
    },

    cancel() {
      this.$router.go(-1);
    },
  },
};
</script>