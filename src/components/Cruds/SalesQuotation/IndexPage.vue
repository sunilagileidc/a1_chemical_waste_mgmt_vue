<template>
  <v-container fluid class="page-wrapper background-inner">
    <div class="main-section">
      <div class="d-flex justify-space-between align-center">
        <page-title
          :heading="$t('Sales Quotations')"
          :google_icon="google_icon"
        />

        <v-btn
          color="success"
          size="small"
          @click="$router.push({ name: 'sales_quotation_creation' })"
        >
          Add New
        </v-btn>
      </div>

      <v-card class="table-card pa-4 mt-4">
        <v-data-table
          :headers="headers"
          :items="quotations"
          :loading="tableLoading"
        >
          <template v-slot:item.quotation_date="{ item }">
            {{ formatDatewithshortMonth(item.quotation_date) }}
          </template>
          <!-- Status -->
          <!-- <template #item.status="{ item }">
            <v-btn class="status-btn" size="small" :color="getStatusColor(item.status)">
              {{ item.status }}
            </v-btn>
          </template> -->

          <!-- Actions -->
          <template #item.actions="{ item }">
            <router-link
              :to="{
                name: 'sales_quotation_creation',
                query: {
                  slug: item.slug,
                },
              }"
            >
              <v-icon class="edit_btn"> mdi-pencil-outline </v-icon>
            </router-link>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </v-container>
</template>



<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";

export default {
  data() {
    return {
      quotations: [],
      tableLoading: false,

      google_icon: {
        icon_name: "request_quote",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },
    };
  },

  computed: {
    headers() {
      return [
        {
          title: "Quotation No",
          key: "quotation_number",
        },

        {
          title: "Job Name",
          key: "job_name",
        },

        {
          title: "Date",
          key: "quotation_date",
        },

        {
          title: "Total",
          key: "total_cost",
        },

        // {
        //   title: "Status",
        //   key: "status",
        // },

        {
          title: "Actions",
          key: "actions",
          sortable: false,
        },
      ];
    },
  },

  mounted() {
    this.getQuotations();
  },

  methods: {
    getStatusColor(status) {
      switch (status) {
        case "draft":
          return "warning";
        case "finalised":
          return "success";
        case "cancelled":
          return "error"; // red
        default:
          return "grey";
      }
    },
    getQuotations() {
      this.tableLoading = true;

      this.$axios
        .get("salesquotations")
        .then((res) => {
          if (res.data.status == "S") {
            this.quotations = res.data.quotations;
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
  },
};
</script>
<style scoped>
.status-btn {
  cursor: default !important;
  pointer-events: none;
}
</style>