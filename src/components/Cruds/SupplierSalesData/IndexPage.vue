<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>
    <confirmation-dialog ref="confirmationDialog" :title="dialogTitle" :message="dialogMessage"></confirmation-dialog>
    <div class="main-section">
      <div>
        <div class="d-flex justify-space-between align-center">
          <page-title class="col-md-3" heading="Supplier Sales Data" :google_icon="google_icon"></page-title>
          <!-- <div class="add_new_button">
            <v-tooltip :text="this.$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link :to="{ name: 'supplier_sales_data_amend' }" style="color: white">
                  <v-btn size="small" class="mb-2 create-btn" v-bind="props">
                    {{ $t("add_new") }}
                  </v-btn>
                </router-link>
              </template>
        </v-tooltip>
        </div> -->
        </div>
        <!-- Upload Section -->
        <SupplierUpload title="Upload Supplier Sales Data"
          subtitle="Upload supplier Excel file. Follow the sample format." uploadUrl="upload_supplier_sales_data"
          referenceFile="suppliersalesdata.xlsx" icon="mdi-cloud-upload-outline" v-model:open="uploadOpen"
          @refresh="initialize" />
        <!-- Upload Section -->
        <!-- Search Bar -->
        <div class="search-wrapper">
          <v-text-field density="comfortable" variant="solo" flat placeholder="Search here..." hide-details
            append-inner-icon="mdi-magnify" v-model="search" class="search-field"></v-text-field>
        </div>
        <!-- Data Table Card -->
        <v-card class="table-card pa-4">
          <v-data-table class="table-card" :headers="headers" :items="supplier_sales_data" :search="search"
            :loading="initval" v-bind:no-data-text="$t('no_data_available')" :footer-props="{
              'items-per-page-text': $t('rows_per_page'),
            }" v-bind:style="$route.params.lang == 'ar' ? 'direction:rtl' : ''">
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>
                  <span v-if="props.item.supplier">{{ props.item.supplier }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.invoice_date">{{ props.item.invoice_date }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.invoice_no">{{ props.item.invoice_no }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.order_ref">{{ props.item.order_ref }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.pip_code">{{ props.item.pip_code }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.account_no">{{ props.item.account_no }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.customer_name">{{ props.item.customer_name }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.postcode">{{ props.item.postcode }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.quantity">{{ props.item.quantity }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.pack">{{ props.item.pack }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.batch_no">{{ props.item.batch_no }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.product_description">{{ props.item.product_description }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.dispensed_caps">{{ props.item.dispensed_caps }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <!-- <td>
                  <v-btn class="hover_shine btn mr-2" :disabled="isDisabled"
                    @click="updateSupplierSalesDataStatus(props.item.id)" size="small" v-bind:color="[
                      props.item.status == 1 ? 'success' : 'warning',
                    ]">
                    <span v-if="props.item.status == 1" class="spanactivesize">{{ $t("active") }}</span>
                    <span v-else class="spanactivesize">{{
                      $t("inactive")
                    }}</span>
                  </v-btn>
                </td> -->

                <td class="px-0 text-center">
                  <!-- <router-link :to="{
                    name: 'supplier_sales_data_amend',
                    query: { slug: props.item.slug },
                  }">
                    <v-tooltip :text="this.$t('edit')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon plain v-bind="props" dense class="mr-2 edit_btn icon_size">mdi-pencil-outline</v-icon>
                      </template>
    </v-tooltip>
    </router-link> -->

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
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import SupplierUpload from "@/components/SupplierUpload.vue";
export default {
  components: {
    SupplierUpload,
  },
  data: () => ({
    uploadOpen: false,
    showConfirmDialog: false,
    search: "",
    dialog: false,
    loader: false,
    supplier_sales_data: [],
    initval: true,
    message: "",
    google_icon: {
      icon_name: "drive_folder_upload",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    dialogMessage: "",
    dialogTitle: "",
    pharmacy_types: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: "Supplier",
          align: "left",
          sortable: true,
          key: "supplier",
        },
        {
          title: "Invoice Date",
          key: "invoice_date",
        },
        {
          title: "Invoice No",
          key: "invoice_no",
        },
        {
          title: "Order Ref",
          key: "order_ref",
        },
        {
          title: "Pip Code",
          key: "pip_code",
        },
        {
          title: "Account No",
          key: "account_no",
        },
        {
          title: "Customer Name",
          key: "customer_name",
        },
        {
          title: "Postcode",
          key: "postcode",
        },
        {
          title: "Quantity",
          key: "quantity",
        },
        {
          title: "Pack",
          key: "pack",
        },
        {
          title: "Batch No",
          key: "batch_no",
        },
        {
          title: "Product",
          key: "product_description",
        },
        {
          title: "Dispensed Caps",
          key: "dispensed_caps",
        },
        // {
        //   title: "Status",
        //   key: "status",
        // },
        // {
        //   title: this.$t("action"),
        //   key: "name",
        //   align: "center",
        //   sortable: false,
        // },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.fetchPharmacies();
    this.initialize();
  },
  mounted() {
    this.initialize();
  },

  methods: {
    async fetchPharmacies() {
      try {
        const res = await this.$axios.get("fetchactivepharmacies");
        if (res.data.status === "S") {
          this.pharmacy_types = res.data.pharmacies;
        }
      } catch (error) {
        this.pharmacy_types = [];
      }
    },
    getPharmacyName(id) {
      const pharmacy = this.pharmacy_types.find((p) => p.id === id);
      return pharmacy ? pharmacy.name : this.$t("not_appllicable");
    },
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    async deleteItem(deleteID) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this Pharmacy ?"
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
    async updateSupplierSalesDataStatus(status_id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update this pharmacy status ?"
      );

      if (!result) return;
      this.loader = true;
      this.$axios
        .post("update_institution_status", {
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
            this.loader = false;
            this.initialize();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
            this.loader = false;
          } else {
            this.$toast.error(this.array_data);
            this.initialize();
            this.loader = false;
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
          this.loader = false;
        });
    },
    initialize() {
      this.$axios
        .get("get_supplier_sales_data")
        .then((res) => {
          this.supplier_sales_data = res.data.supplier_sales_data;
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
  },
};
</script>
<style scoped>
.upload-card {
  border-radius: 12px;
  background: #fafafa;
}

.upload-box,
.reference-box {
  border: 1px dashed #dcdcdc;
  padding: 16px;
  border-radius: 10px;
  background: #fff;
}

.upload-subtitle {
  font-size: 13px;
  color: #666;
}
</style>
