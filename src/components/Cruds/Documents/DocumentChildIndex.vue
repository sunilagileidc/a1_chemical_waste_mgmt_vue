<template>
  <!-- <v-container fluid class="page-wrapper background-inner"> -->
  <content-loader v-if="loader"></content-loader>
  <confirmation-dialog
    ref="confirmationDialog"
    :title="dialogTitle"
    :message="dialogMessage"
  ></confirmation-dialog>

  <div class="main-section">
    <div>
      <!-- <div class="d-flex justify-space-between align-center">
        <page-title
          class="col-md-5"
          heading="Document Versions"
          :google_icon="google_icon"
        ></page-title>
        <div class="add_new_button">
          <router-link :to="{ name: 'documents' }" style="color: white">
            <v-btn
              size="small"
              variant="outlined"
              class="register-btn"
              @click="goBackToDetails()"
            >
              Back
            </v-btn>
          </router-link>
        </div>
      </div> -->
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
          class="table-card"
          :headers="headers"
          :items="documents"
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
                <span v-if="props.item.title">{{ props.item.title }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.category">{{
                  props.item.category
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.group">{{ props.item.group }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.drug_id">
                  {{ getDrugName(props.item.drug_id) }}</span
                >
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.description">{{
                  props.item.description
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.sequence">{{
                  props.item.sequence
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>
              <td>
                <span v-if="props.item.doc_version">{{
                  props.item.doc_version
                }}</span>
                <span v-else>{{ $t("not_appllicable") }}</span>
              </td>

              <td class="px-0 text-center">
                <v-icon
                  v-bind="props"
                  dense
                  class="mr-2 icon_size"
                  @click="copyLink(props.item.file_path)"
                >
                  mdi-content-copy
                </v-icon>
                <v-icon
                  v-bind="props"
                  dense
                  class="mr-2 icon_size"
                  @click="downloadFile(props.item.file_path)"
                >
                  mdi-download
                </v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </div>
  <!-- </v-container> -->
</template>

<script>
export default {
  props: {
    slug: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    folder: String,
    label: {
      type: String,
      default: "Upload File",
    },
    disabled: Boolean,
    baseUrl: {
      type: String,
      default: "/storage/",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    loader: false,
    search: "",
    dialog: false,
    documents: [],
    initval: true,
    message: "",
    delete_id: null,
    dialogMessage: "",
    dialogTitle: "",
    google_icon: {
      icon_name: "library_books",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    ref_value_array: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: "Title",
          align: "left",
          sortable: true,
          key: "title",
        },
        {
          title: "Category",
          key: "category",
        },
        {
          title: "Group",
          key: "group",
        },
        {
          title: "Drug",
          key: "drug_id",
        },
        {
          title: "Description",
          key: "description",
        },
        {
          title: "Sequence",
          key: "sequence",
        },
        {
          title: "Version",
          key: "doc_version",
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

    slug: {
      immediate: true,
      handler(newSlug) {
        if (newSlug) {
          this.fetchDocuments(newSlug);
        }
      },
    },
  },

  created() {
    this.fetchDrugList("Drugs");
  },
  mounted() {},

  methods: {
    fullPath(file_path) {
      return this.baseUrl + (file_path || "");
    },
    getDrugName(id) {
      const drug = this.ref_value_array.find((d) => d.drug_id == id);
      return drug ? drug.drug_name : this.$t("not_appllicable");
    },
    fetchDrugList(type) {
      this.refListLoader = true;
      this.ref_value_array = [];
      if (type === "Drugs") {
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
      } else {
        this.refListLoader = false;
      }
    },

    initialize() {
      this.$axios
        .get("fetch_documents")
        .then((res) => {
          this.documents = res.data.documents;
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
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
    copyLink(path) {
      const fullUrl = import.meta.env.VITE_IMAGE_PATH + "/storage/" + path;

      navigator.clipboard
        .writeText(fullUrl)
        .then(() => {
          this.$toast.success("Link copied to clipboard");
        })
        .catch(() => {
          this.$toast.error("Failed to copy link");
        });
    },
    downloadFile(path) {
      const fileUrl = import.meta.env.VITE_IMAGE_PATH + "/storage/" + path;

      const fileName = path.split("/").pop().toLowerCase();

      const isPreviewFile =
        fileName.endsWith(".pdf") || fileName.endsWith(".txt");

      // ✅ If PDF or TXT → open in new tab
      if (isPreviewFile) {
        window.open(fileUrl, "_blank");
        return;
      }

      // ✅ Other files → download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      link.target = "_blank"; // optional

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    fetchDocuments(slug) {
      this.loader = true;

      this.$axios
        .get("fetch_chid_documents/" + slug)
        .then((res) => {
          if (res.data.status === "S") {
            this.documents = res.data.documents;
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        })
        .finally(() => {
          this.loader = false;
          this.initval = false;
        });
    },
  },
};
</script>
<style scoped>
.main-section {
  background: rgba(209, 209, 209, 0.74) !important;
}
</style>
