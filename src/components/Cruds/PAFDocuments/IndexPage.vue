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
            heading="PAF Documents"
            :google_icon="google_icon"
          ></page-title>
          <div class="add_new_button">
            <v-tooltip :text="this.$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link
                  :to="{ name: 'paf_documents_amend' }"
                  style="color: white"
                >
                  <v-btn size="small" class="mb-2 create-btn" v-bind="props">
                    {{ $t("add_new") }}
                  </v-btn>
                </router-link>
              </template>
            </v-tooltip>
          </div>
        </div>
        <!-- Stats section -->
        <stats-page :stats="stats" />
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
                  <span v-if="props.item.patient_category">{{
                    props.item.patient_category
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
                <td class="px-0 text-center">
                  <div class="action-icons">
                    <v-icon
                      class="icon-btn"
                      @click="copyLink(props.item.file_path)"
                    >
                      mdi-content-copy
                    </v-icon>

                    <v-icon
                      class="icon-btn"
                      @click="downloadFile(props.item.file_path)"
                    >
                      mdi-download
                    </v-icon>

                    <router-link
                      :to="{
                        name: 'paf_documents_amend',
                        query: { slug: props.item.slug },
                      }"
                    >
                      <v-icon class="icon-btn edit_btn">
                        mdi-pencil-outline
                      </v-icon>
                    </router-link>
                    <v-icon
                      class="icon-btn"
                      v-if="props.item.parent_id != null"
                      @click="openChildDialog(props.item)"
                    >
                      mdi-file-tree
                    </v-icon>
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
                    <!-- placeholder to keep alignment -->
                    <div v-else class="icon-placeholder"></div>
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
        <v-dialog v-model="showChildDialog" max-width="1100">
          <v-card>
            <v-card-title class="d-flex justify-space-between">
              <span>Document Versions</span>
              <v-btn
                size="small"
                variant="outlined"
                class="register-btn mt-2"
                @click="showChildDialog = false"
              >
                Back
              </v-btn>
            </v-card-title>

            <v-card-text style="height: 400px; overflow-y: auto">
              <component :is="childComponent" :slug="selectedSlug" />
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </v-container>
</template>

<script>
import DocumentsChild from "../PAFDocuments/PAFDocumentChildIndex.vue";
export default {
  props: {
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
    showChildDialog: false,
    selectedSlug: null,
    childComponent: DocumentsChild,
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
    // baseUrl: "/storage/app/public/",
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
          title: "Patient Category",
          key: "patient_category",
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
    this.fetchDrugList("Drugs");
  },
  mounted() {
    this.initialize();
  },

  methods: {
    openChildDialog(item) {
      this.selectedSlug = item.slug;
      this.showChildDialog = true;
    },
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
      // this.policy_details.ref_value = null;

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
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    async deleteItem(deleteId) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this PAF Document ?",
      );
      if (!result) return;
      this.$axios.delete(`paf_documents/${deleteId}`).then((res) => {
        this.$toast.success(res.data.message);
        this.initialize();
      });
    },

    initialize() {
      this.$axios
        .get("fetch_paf_documents")
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

      const lowerPath = path.toLowerCase();

      //  Open PDF & TXT in new tab
      if (lowerPath.endsWith(".pdf") || lowerPath.endsWith(".txt")) {
        window.open(fileUrl, "_blank");
        return;
      }

      // ✅ Download other files
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = path.split("/").pop();

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>
<style scoped>
.action-icons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.icon-btn {
  width: 24px;
  text-align: center;
  cursor: pointer;
}

.icon-placeholder {
  width: 24px;
}
</style>
