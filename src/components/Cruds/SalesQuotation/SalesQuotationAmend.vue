<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="mx-2 mt-3 p-0 main-section">
      <!-- TITLE -->

      <div class="my-3 d-flex align-center justify-space-between">
        <page-title
          class="ml-2"
          :heading="$t('Sales Quotation')"
          :google_icon="google_icon"
        />
      </div>

      <content-loader v-if="loader"></content-loader>

      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <!-- BASIC DETAILS -->

          <v-row class="px-4">
            <v-col cols="12" md="5">
              <v-autocomplete
                variant="outlined"
                density="compact"
                label="Customer"
                class="required_field"
                v-model="quotation.customer_id"
                :items="customers"
                item-title="company_name"
                item-value="id"
                hide-details="auto"
                clearable
                searchable
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                variant="outlined"
                density="compact"
                label="Job Name"
                v-model="quotation.job_name"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                variant="outlined"
                density="compact"
                label="Quotation Date"
                type="date"
                v-model="quotation.quotation_date"
              />
            </v-col>

            <!-- <v-col cols="12" md="6">
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
              />
            </v-col> -->
          </v-row>

          <!-- WASTE ITEMS -->

          <v-divider class="my-5" />

          <div class="d-flex justify-space-between align-center px-4">
            <h4>Waste Items</h4>

            <v-btn size="small" color="primary" @click="openItemDialog">
              Add Item
            </v-btn>
          </div>

          <v-data-table
            class="mx-0 mt-2 quotation-table"
            :headers="itemHeaders"
            :items="quotation.items"
            density="compact"
          >
            <template #item.waste_code="{ item }">
              {{ item.wasteStream?.waste_code || "-" }}
            </template>

            <template #item.waste_components="{ item }">
              {{ item.wasteStream?.waste_components || "-" }}
            </template>

            <template v-slot:item.quote_qty="{ item }">
              <v-text-field
                class="table-input"
                density="compact"
                variant="outlined"
                hide-details
                v-model="item.quote_qty"
                @keydown="allowDecimal"
              />
            </template>

            <template v-slot:item.quote_unit_price="{ item }">
              <v-text-field
                class="table-input"
                density="compact"
                variant="outlined"
                hide-details
                v-model="item.quote_unit_price"
                @keydown="allowDecimal"
              />
            </template>
            <template v-slot:item.vat="{ item }">
              <v-checkbox
                density="compact"
                hide-details
                v-model="item.quote_vat_exclude"
                :true-value="1"
                :false-value="0"
              />
            </template>

            <template v-slot:item.total="{ item }">
              {{
                Number(item.quote_qty || 0) *
                  Number(item.quote_unit_price || 0) +
                (item.quote_vat_exclude == 1
                  ? Number(item.quote_qty || 0) *
                    Number(item.quote_unit_price || 0) *
                    0.2
                  : 0)
              }}
            </template>

            <template v-slot:item.actions="{ index }">
              <v-btn
                icon
                size="x-small"
                color="red"
                @click="openDeleteDialog(index)"
              >
                <v-icon> mdi-delete-outline </v-icon>
              </v-btn>
            </template>

            <!-- CUSTOM FOOTER -->

            <template
              v-slot:bottom="{
                page,
                itemsPerPage,
                pageCount,
                setItemsPerPage,
                nextPage,
                prevPage,
              }"
            >
              <div class="quotation-summary">
                <!-- Waste Code -->
                <div></div>

                <!-- Components -->
                <div></div>

                <!-- Qty -->
                <div></div>

                <!-- Unit Price -->
                <div></div>

                <!-- Total column -->
                <div class="summary-title">
                  <div>Transport Cost</div>

                  <div>Document Cost</div>

                  <div class="bold">Total Cost</div>
                </div>

                <!-- Action column -->
                <div class="summary-value">
                  <v-text-field
                    density="compact"
                    variant="outlined"
                    hide-details
                    v-model="quotation.transport_cost"
                    @keydown="allowDecimal"
                  />

                  <v-text-field
                    density="compact"
                    variant="outlined"
                    hide-details
                    v-model="quotation.document_cost"
                    @keydown="allowDecimal"
                  />

                  <v-text-field
                    density="compact"
                    variant="outlined"
                    hide-details
                    readonly
                    :model-value="totalCost"
                  />
                </div>
              </div>
              <!-- DEFAULT PAGINATION -->
              <v-data-table-footer
                :page="page"
                :items-per-page="itemsPerPage"
                :items-per-page-options="[10, 20]"
                :page-count="pageCount"
                @update:page="page = $event"
                @update:items-per-page="setItemsPerPage"
                @next="nextPage"
                @prev="prevPage"
              />
            </template>
          </v-data-table>
          <confirmation-dialog ref="confirmationDialog" />

          <!-- ADD ITEM POPUP -->

          <v-dialog v-model="itemDialog" max-width="900">
            <v-card>
              <v-card-title> Select Waste Items </v-card-title>

              <v-card-text>
                <v-text-field
                  v-model="wasteSearch"
                  label="Search Waste Items"
                  placeholder="Search here.."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                  class="mb-0"
                />
                <v-data-table
                  class="waste-select-table"
                  :headers="wasteHeaders"
                  :items="filteredWasteStreams"
                  :search="wasteSearch"
                  item-value="id"
                  show-select
                  v-model="selectedWasteItems"
                  density="compact"
                  :items-per-page="10"
                  :items-per-page-options="[5, 10, 20, 50]"
                >
                  <template v-slot:item.waste_code="{ item }">
                    <strong>
                      {{ item.waste_code }}
                    </strong>
                  </template>

                  <template v-slot:item.waste_components="{ item }">
                    {{ item.waste_components }}
                  </template>

                  <template v-slot:item.waste_ewc="{ item }">
                    {{ item.waste_ewc }}
                  </template>

                  <template v-slot:item.waste_un_no="{ item }">
                    {{ item.waste_un_no }}
                  </template>

                  <template v-slot:item.is_hazard="{ item }">
                    <v-chip
                      size="small"
                      :color="item.is_hazard == 'Y' ? 'error' : 'success'"
                      variant="flat"
                    >
                      {{ item.is_hazard == "Y" ? "Yes" : "No" }}
                    </v-chip>
                  </template>
                </v-data-table>
              </v-card-text>

              <v-card-actions class="sticky-actions">
                <v-spacer />

                <v-btn class="btn-cancel" @click="itemDialog = false">
                  Cancel
                </v-btn>

                <v-btn color="success" class="add-btn" @click="saveItem">
                  Add
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- PARTNERS -->

          <v-divider class="my-5" />

          <!-- <div class="d-flex justify-space-between align-center px-4">
            <h4>Quotation Partners</h4>

            <v-btn
              size="small"
              color="primary"
              :disabled="!quotation.id"
              @click="
                $router.push({
                  name: 'quotation_partner_creation',
                  query: {
                    sales_quotation_id: quotation.id,
                  },
                })
              "
            >
              Add Partner
            </v-btn>
          </div> -->

          <!-- <v-data-table
            class="mx-4 mt-3"
            :headers="partnerHeaders"
            :items="partners"
            density="compact"
          >
            <template #item.partner="{ item }">
              <span v-if="item.partner_type == 'supplier'">
                {{ item.supplier?.supplier_name }}
              </span>

              <span v-if="item.partner_type == 'haulier'">
                {{ item.haulier?.haulier_name }}
              </span>
            </template>

            <template #item.total_cost="{ item }">
              {{
                Number(item.transport_cost || 0) +
                Number(item.document_cost || 0) +
                Number(item.fuel_charge || 0) +
                Number(item.demurrage_charge || 0)
              }}
            </template>

            <template #item.status="{ item }">
              <v-chip size="small">
                {{ item.status }}
              </v-chip>
            </template>

            <template #no-data> No partners added </template>
          </v-data-table> -->
        </v-form>
      </div>

      <!-- BUTTONS -->

      <div class="d-block mr-4 mt-3 text-right">
        <v-btn size="small" class="btn-cancel mr-2" @click="cancel">
          {{ $t("cancel") }}
        </v-btn>

        <v-btn
          size="small"
          color="success"
          class="status-approved"
          :disabled="isDisabled"
          @click="submit"
        >
          {{ $t("submit") }}

          <v-progress-circular
            v-if="isDisabled"
            indeterminate
            width="1"
            size="x-small"
            class="ml-2"
          />
        </v-btn>
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
      itemDialog: false,
      customers: [],
      wasteStreams: [],
      partners: [],
      selectedWasteItems: [],
      wasteSearch: "",
      confirmationDialog: false,
      deleteIndex: null,
      wasteHeaders: [
        {
          title: "Waste Code",
          key: "waste_code",
        },
        {
          title: "Components",
          key: "waste_components",
        },
        {
          title: "EWC",
          key: "waste_ewc",
        },
        {
          title: "UN No",
          key: "waste_un_no",
        },
        {
          title: "Hazard",
          key: "is_hazard",
        },
      ],

      google_icon: {
        icon_name: "request_quote",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      itemHeaders: [
        {
          title: "Waste Code",
          key: "waste_code",
        },
        {
          title: "Components",
          key: "waste_components",
        },
        {
          title: "Qty",
          key: "quote_qty",
        },
        {
          title: "Unit Price",
          key: "quote_unit_price",
        },
        {
          title: "VAT",
          key: "vat",
          width: "100",
        },
        {
          title: "Total",
          key: "total",
        },
        {
          title: "Action",
          key: "actions",
          sortable: false,
        },
      ],

      partnerHeaders: [
        { title: "Type", key: "partner_type" },
        { title: "Partner", key: "partner" },
        { title: "Transport", key: "transport_cost" },
        { title: "Document", key: "document_cost" },
        { title: "Total", key: "total_cost" },
        { title: "Status", key: "status" },
      ],

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
    filteredWasteStreams() {
      if (!this.wasteSearch) {
        return this.wasteStreams;
      }

      const search = this.wasteSearch.toLowerCase();

      return this.wasteStreams.filter(
        (item) =>
          (item.waste_code || "").toLowerCase().includes(search) ||
          (item.waste_components || "").toLowerCase().includes(search) ||
          (item.waste_ewc || "").toLowerCase().includes(search) ||
          (item.waste_un_no || "").toLowerCase().includes(search)
      );
    },
    totalCost() {
      let total = 0;

      this.quotation.items.forEach((item) => {
        let itemTotal =
          Number(item.quote_qty || 0) * Number(item.quote_unit_price || 0);

        total += itemTotal + this.vatAmount(item);
      });

      return (
        total +
        Number(this.quotation.transport_cost || 0) +
        Number(this.quotation.document_cost || 0)
      );
    },
  },

  mounted() {
    this.loadCustomers();
    this.loadWasteStreams();

    if (this.$route.query.slug) {
      this.fetchQuotation();
    }
  },

  methods: {
    vatAmount(item) {
      let amount =
        Number(item.quote_qty || 0) * Number(item.quote_unit_price || 0);

      if (item.quote_vat_exclude == 1) {
        return amount * 0.2;
      }

      return 0;
    },
    allowDecimal(event) {
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ];
      if (allowedKeys.includes(event.key)) {
        return;
      }
      if (/^[0-9]$/.test(event.key)) {
        return;
      }
      if (event.key === "." && !event.target.value.includes(".")) {
        return;
      }
      event.preventDefault();
    },
    openDeleteDialog(index) {
      this.deleteIndex = index;

      this.$refs.confirmationDialog.open().then((result) => {
        if (result) {
          this.quotation.items.splice(this.deleteIndex, 1);
        }

        this.deleteIndex = null;
      });
    },

    confirmDelete() {
      if (this.deleteIndex !== null) {
        this.quotation.items.splice(this.deleteIndex, 1);
      }

      this.deleteIndex = null;

      this.confirmationDialog = false;
    },
    openItemDialog() {
      this.selectedWasteItems = this.quotation.items.map(
        (item) => item.waste_stream_id
      );

      this.itemDialog = true;
    },
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
              status: data.status,
              items: data.items.map((item) => ({
                id: item.id,
                waste_stream_id: item.waste_stream_id,
                supplier_id: item.supplier_id,
                quote_size: item.quote_size,
                quote_qty: Math.floor(item.quote_qty),
                quote_unit_price: item.quote_unit_price,
                quote_vat_exclude: item.quote_vat_exclude ?? 0,
                vat: item.vat ?? 0,
                wasteStream: item.waste_stream,
              })),
            };

            this.loadQuotationPartners();
          }
        })

        .finally(() => {
          this.loader = false;
        });
    },

    loadCustomers() {
      this.$axios

        .get("customers")

        .then((res) => {
          this.customers = res.data.customers;
        });
    },

    loadWasteStreams() {
      this.$axios

        .get("wastestreams")

        .then((res) => {
          this.wasteStreams = res.data.waste_streams;
        });
    },

    saveItem() {
      this.selectedWasteItems.forEach((id) => {
        const waste = this.wasteStreams.find((w) => w.id === id);

        if (!waste) return;

        const exists = this.quotation.items.some(
          (item) => item.waste_stream_id == id
        );

        if (!exists) {
          this.quotation.items.push({
            waste_stream_id: waste.id,

            wasteStream: {
              ...waste,
            },
            quote_size: "",
            quote_qty: 0,
            quote_unit_price: 0,
            quote_vat_exclude: 0,
            vat: 0,
          });
        }
      });

      this.itemDialog = false;
    },

    removeItem(index) {
      this.quotation.items.splice(index, 1);
    },

    loadQuotationPartners() {
      if (!this.quotation.id) return;

      this.$axios

        .get("quotationpartners/" + this.quotation.id)

        .then((res) => {
          if (res.data.status == "S") {
            this.partners = res.data.partners;
          }
        });
    },

    submit() {
      if (!this.$refs.form.validate()) return;

      this.isDisabled = true;

      let payload = {
        id: this.quotation.id,

        customer_id: this.quotation.customer_id,

        job_name: this.quotation.job_name,

        quotation_date: this.quotation.quotation_date,

        transport_cost: this.quotation.transport_cost,

        document_cost: this.quotation.document_cost,

        status: this.quotation.status,

        items: this.quotation.items.map((item) => ({
          waste_stream_id: item.waste_stream_id,
          supplier_id: item.supplier_id,
          quote_size: item.quote_size,
          quote_qty: item.quote_qty,
          quote_unit_price: item.quote_unit_price,
          quote_vat_exclude: item.quote_vat_exclude,
          vat: this.vatAmount(item),
        })),
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

        .catch(() => {
          this.$toast.error("Something went wrong");
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
<style scoped>
.table-input {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.table-input .v-field {
  min-height: 38px !important;
}

.table-input input {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* reduce table row padding */
:deep(.v-data-table__td),
:deep(.v-data-table__th) {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
}

/* reduce footer height */
:deep(.v-data-table-footer) {
  min-height: 45px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.waste-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  font-size: 20px;
  font-weight: 600;
  padding: 20px;
}

/* table border */
.waste-select-table {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}

/* row lines */
:deep(.waste-select-table .v-data-table__tr) {
  border-bottom: 1px solid #e0e0e0;
}

/* column lines */
:deep(.waste-select-table th),
:deep(.waste-select-table td) {
  border-right: 1px solid #e0e0e0 !important;
}

:deep(.waste-select-table th:last-child),
:deep(.waste-select-table td:last-child) {
  border-right: none !important;
}

/* header */
:deep(.waste-select-table thead th) {
  background: #f5f7fb;
  font-weight: 700;
  color: #004b7a;
}

/* compact rows */
:deep(.waste-select-table td),
:deep(.waste-select-table th) {
  height: 42px !important;
}

/* footer smaller */
:deep(.waste-select-table .v-data-table-footer) {
  min-height: 45px !important;
  padding: 0 12px !important;
}

.dialog-actions {
  padding: 16px 20px;
}
.sticky-actions {
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 10;
  border-top: 1px solid #ddd;
  padding: 14px 20px;
}
.add-btn {
  background: green !important;
  color: white !important;
}
.quotation-summary {
  display: grid;

  grid-template-columns:
    20%
    25%
    15%
    15%
    12.5%
    12.5%;

  border-top: 1px solid #ddd;

  background: #fafafa;

  padding: 12px 0;
}

.summary-title {
  display: flex;

  flex-direction: column;

  gap: 14px;

  justify-content: center;

  font-weight: 600;

  padding-right: 15px;

  text-align: right;
}

.summary-value {
  display: flex;

  flex-direction: column;

  gap: 8px;

  padding-right: 15px;
}

.summary-value .v-field {
  min-height: 36px !important;
}

.bold {
  font-weight: 700;
}
</style>