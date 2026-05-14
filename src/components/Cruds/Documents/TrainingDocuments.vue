<template>
  <v-container fluid class="page-wrapper background-inner">
    <content-loader v-if="refListLoader"></content-loader>
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
            heading="Training Documents"
            :google_icon="google_icon"
          ></page-title>
          <!-- <div class="add_new_button">
            <v-tooltip :text="this.$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link
                  :to="{ name: 'documents_amend' }"
                  style="color: white"
                >
                  <v-btn size="small" class="mb-2 create-btn" v-bind="props">
                    {{ $t("add_new") }}
                  </v-btn>
                </router-link>
              </template>
            </v-tooltip>
          </div> -->
        </div>
        <!-- Search Bar -->
        <!-- Data Table Card -->
        <v-card class="table-card pa-4">
          <div v-if="documents.length == 0">
            <no-data-found text="No data found" />
          </div>
          <div>
            <div
              v-for="(categoryData, categoryName) in documents"
              :key="categoryName"
            >
              <h2 class="category-title">{{ categoryName }}</h2>

              <!-- DRUG CATEGORY -->
              <div v-if="categoryName === 'Drugs'">
                <div v-for="drugGroup in categoryData" :key="drugGroup.drug_id">
                  <h3 class="drug-title">
                    {{ drugGroup.drug_name }}
                  </h3>

                  <div class="card-grid d-flex flex-wrap">
                    <div
                      v-for="doc in drugGroup.documents"
                      :key="doc.id"
                      class="card work mr-3"
                    >
                      <div class="img-section">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="100"
                          height="100"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#a3d0c1"
                            fill-rule="nonzero"
                            d="M6 2C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 12h8v1.5H8V12zm0 3h8v1.5H8V15zm0-6h5v1.5H8V9z"
                          />
                        </svg>
                      </div>

                      <div class="card-desc">
                        <div
                          class="card-head"
                          style="background-color: none !important"
                        >
                          <div class="card-title">
                            {{ doc.title }}
                          </div>
                        </div>

                        <div class="d-flex justify-space-between align-center">
                          <div>
                            <div class="card-time">
                              {{ doc.file_type }}
                              <small>({{ formatSize(doc.file_size) }})</small>
                            </div>
                          </div>
                          <div>
                            <span
                              class="download-btn"
                              @click="handleDownload(doc)"
                            >
                              <v-icon size="22" color="#237f61">
                                mdi-download
                              </v-icon>
                            </span>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />
              </div>

              <!-- GENERAL CATEGORY -->
              <div v-else>
                <div class="card-grid d-flex flex-wrap">
                  <div
                    v-for="doc in categoryData"
                    :key="doc.id"
                    class="card work mr-3"
                  >
                    <div class="img-section">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#a3d0c1"
                          fill-rule="nonzero"
                          d="M6 2C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM8 12h8v1.5H8V12zm0 3h8v1.5H8V15zm0-6h5v1.5H8V9z"
                        />
                      </svg>
                    </div>

                    <div class="card-desc">
                      <div class="card-head">
                        <div class="card-title">
                          {{ doc.title }}
                        </div>
                      </div>

                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="card-time">
                            {{ doc.file_type }}
                            <small>({{ formatSize(doc.file_size) }})</small>
                          </div>
                        </div>
                        <div>
                          <span
                            class="download-btn"
                            @click="handleDownload(doc)"
                          >
                            <v-icon size="22" color="#237f61">
                              mdi-download
                            </v-icon>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card>
        <!-- From Uiverse.io by satyamchaudharydev -->
      </div>
    </div>
  </v-container>
</template>

<script>
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
    refListLoader: false,
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
    basePath: import.meta.env.VITE_IMAGE_PATH + "/storage/",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
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
    formatSize(size) {
      return (size / 1024 / 1024).toFixed(2) + " MB";
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
        "Are you sure you want to delete this Document ?",
      );
      if (!result) return;
      this.$axios.delete(`documents/${deleteId}`).then((res) => {
        this.$toast.success(res.data.message);
        this.initialize();
      });
    },

    initialize() {
      this.$axios
        .get("fetch_latest_document_details")
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
    async handleDownload(doc) {
      if (doc.download_alert == 1) {
        try {
          const res = await this.$axios.post("download_notification", {
            id: doc.id,
          });

          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
          } else {
            this.$toast.warning(res.data.message);
          }

        } catch (error) {
          this.$toast.error(this.$t("something_went_wrong"));
        }
      }

      // Always allow download
      const link = document.createElement("a");
      link.href = this.basePath + doc.file_path;
      link.target = "_blank";
      link.click();
    }
  },
};
</script>
<style scoped>
/* From Uiverse.io by satyamchaudharydev */
.card {
  --primary-clr: #1c204b;
  --dot-clr: #bbc0ff;
  --play: hsl(195, 74%, 62%);
  width: 250px;
  min-height: auto;
  border-radius: 10px;
}

.card {
  font-family: "Arial";
  color: #fff;
  display: grid;
  grid-template-rows: 50px 1fr;
}

.card:hover .img-section {
  transform: translateY(1em);
}
.card .work {
  margin-right: 38px;
}
.card-desc {
  border-radius: 10px;
  padding: 15px;
  position: relative;
  top: -10px;
  display: grid;
  gap: 10px;
  background: var(--theme-gradient-light);
}

.card-time {
  font-size: 17px !important;
  font-weight: 500 !important;
  padding: 10px 0px;
  color: #000 !important;
}
.card-grid {
  margin-bottom: 44px;
}
.img-section {
  transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: #47a083;
}

.card-head {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px;

  border-bottom: none !important;
}

.card-title {
  flex: 1;
  font-size: 0.9em;
  font-weight: 500;
  color: #000 !important;
  word-break: break-word;
  white-space: normal;
}

.card-menu {
  display: flex;
  gap: 4px;
  margin-inline: auto;
}

.card svg {
  float: right;
  max-width: 100%;
  max-height: 100%;
}

.card .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--dot-clr);
}

.card .recent {
  line-height: 0;
  font-size: 0.8em;
}
.download-btn {
  color: #000 !important;
  cursor: pointer;
}
.card {
  border: none !important;
  background: none !important;
}
.category-title {
  font-size: 20px !important;
  margin-bottom: 20px;
}
.drug-title {
  font-size: 18px;
  color: #000 !important;
}
</style>
