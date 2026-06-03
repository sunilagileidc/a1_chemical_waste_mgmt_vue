<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="loader"></content-loader>

    <div class="main-section">
      <!-- Header -->
      <div class="d-flex justify-space-between align-center">
        <page-title
          class="col-md-3"
          heading="Waste Streams"
          :google_icon="google_icon"
        />

        <div class="add_new_button">
          <v-tooltip text="Add New" location="bottom">
            <template v-slot:activator="{ props }">
              <router-link
                :to="{ name: 'waste_stream_creation' }"
                style="color: white"
              >
                <v-btn size="small" class="mb-2 create-btn" v-bind="props">
                  Add New
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
          placeholder="Search waste stream..."
          append-inner-icon="mdi-magnify"
          variant="solo"
          flat
          hide-details
          density="comfortable"
          class="search-field"
        />
      </div>

      <v-card class="table-card pa-4">
        <v-data-table
          class="table-card"
          :headers="headers"
          :items="wasteStreams"
          :search="search"
          :loading="tableLoading"
          :items-per-page-text="$t('rows_per_page')"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>
                {{ props.item.waste_code || "-" }}
              </td>

              <!-- <td class="description-column">
                {{ props.item.waste_description || "-" }}
              </td> -->

              <td>
                {{ props.item.waste_ewc || "-" }}
              </td>

              <td>
                {{ props.item.waste_physical_form || "-" }}
              </td>

              <td>
                {{ props.item.waste_haz_code || "-" }}
              </td>

              <td>
                {{ props.item.waste_un_no || "-" }}
              </td>

              <td>
                {{ props.item.waste_pkg_grp || "-" }}
              </td>

              <td>
                {{ props.item.waste_un_cls || "-" }}
              </td>

              <td>
                {{ props.item.waste_ship_name || "-" }}
              </td>
              <td>
                <v-btn
                  size="small"
                  :color="props.item.is_hazard == 'Y' ? 'error' : 'success'"
                >
                  {{ props.item.is_hazard == "Y" ? "Yes" : "No" }}
                </v-btn>
              </td>

              <td>
                <router-link
                  :to="{
                    name: 'waste_stream_creation',
                    query: {
                      slug: props.item.slug,
                    },
                  }"
                >
                  <v-icon class="edit_btn icon_size">
                    mdi-pencil-outline
                  </v-icon>
                </router-link>
              </td>
            </tr>
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
        icon_name: "delete_sweep",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },

      search: "",

      wasteStreams: [],

      tableLoading: false,

      loader: false,
    };
  },

  mounted() {
    this.fetchWasteStreams();
  },

  computed: {
    headers() {
      return [
        {
          title: "Code",
          key: "waste_code",
        },

        // {
        //   title: "Desc",
        //   key: "waste_description",
        // },

        {
          title: "EWC",
          key: "waste_ewc",
        },

        {
          title: "Phys Form",
          key: "waste_physical_form",
        },

        {
          title: "Haz Code",
          key: "waste_haz_code",
        },

        {
          title: "UN No",
          key: "waste_un_no",
        },

        {
          title: "Pkg Group",
          key: "waste_pkg_grp",
        },

        {
          title: "UN Class",
          key: "waste_un_cls",
        },

        {
          title: "Ship Name",
          key: "waste_ship_name",
        },
        {
          title: "Hazard",
          key: "is_hazard",
        },

        {
          title: "Actions",
          key: "actions",
          sortable: false,
        },
      ];
    },
  },

  methods: {
    fetchWasteStreams() {
      this.tableLoading = true;

      this.$axios

        .get("wastestreams")

        .then((res) => {
          this.wasteStreams = res.data.waste_streams;
        })

        .catch(() => {
          this.$toast.error("Something went wrong");
        })

        .finally(() => {
          this.tableLoading = false;
        });
    },
  },
};
</script>
<style scoped>
v-btn--size-small {
  --v-btn-size: 0.75rem;
  --v-btn-height: 24px;
  font-size: var(--v-btn-size);
  padding: 0 7px;
}
.description-column {
  min-width: 200px;
  max-width: 200px;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>