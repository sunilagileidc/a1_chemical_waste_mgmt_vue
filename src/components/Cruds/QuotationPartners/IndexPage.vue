<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="main-section">
      <div class="d-flex justify-space-between align-center">
        <page-title heading="Quotation Partners" :google_icon="google_icon" />

        <v-btn color="success" size="small" @click="addPartner">
          Add Partner
        </v-btn>
      </div>

      <v-card class="table-card pa-4 mt-4">
        <v-data-table
          :headers="headers"
          :items="partners"
          :loading="tableLoading"
        >
          <template #item.partner_type="{ item }">
            <v-chip
              :color="item.partner_type == 'supplier' ? 'primary' : 'orange'"
              size="small"
            >
              {{ item.partner_type }}
            </v-chip>
          </template>

          <template #item.partner="{ item }">
            <span v-if="item.partner_type == 'supplier'">
              {{ item.supplier?.supplier_name }}
            </span>

            <span v-else>
              {{ item.haulier?.haulier_name }}
            </span>
          </template>

          <template #item.actions="{ item }">
            <v-icon class="edit_btn" @click="editPartner(item)">
              mdi-pencil-outline
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
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

      partners: [],
      tableLoading: false,
    };
  },

  computed: {
    headers() {
      return [
        {
          title: "Type",
          key: "partner_type",
        },

        {
          title: "Partner",
          key: "partner",
        },

        {
          title: "Quotation Date",
          key: "quotation_date",
        },

        {
          title: "Transport",
          key: "transport_cost",
        },

        {
          title: "Document",
          key: "document_cost",
        },

        {
          title: "Total",
          key: "total_cost",
        },

        {
          title: "Status",
          key: "status",
        },

        {
          title: "Actions",
          key: "actions",
          sortable: false,
        },
      ];
    },
  },

  mounted() {
    this.fetchPartners();
  },

  methods: {
    fetchPartners() {
      this.tableLoading = true;

      this.$axios
        .get("quotationpartners/" + this.$route.query.sales_quotation_id)

        .then((res) => {
          this.partners = res.data.partners;
        })

        .catch((err) => {
          console.log(err);

          this.$toast.error("Something went wrong");
        })

        .finally(() => {
          this.tableLoading = false;
        });
    },

    addPartner() {
      this.$router.push({
        name: "quotation_partner_creation",

        query: {
          sales_quotation_id: this.$route.query.sales_quotation_id,
        },
      });
    },

    editPartner(item) {
      this.$router.push({
        name: "quotation_partner_creation",

        query: {
          id: item.id,

          sales_quotation_id: item.sales_quotation_id,
        },
      });
    },
  },
};
</script>