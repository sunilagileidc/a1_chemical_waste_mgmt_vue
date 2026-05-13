<template>
  <div>
    <v-dialog v-model="documentDialog" max-width="1200">
      <div v-if="valid_error">
        <v-alert :value="valid_error" color="error" icon="warning" outlined>
          {{ message }}
        </v-alert>
      </div>
      <!-- Manage Assets section -->
      <div>
        <v-card style="margin-top: 40px">
          <v-card-title style="justify-content: space-between">
            <span class="headline">Manage Assets</span>

            <i
              class="lnr-cross"
              style="cursor: pointer"
              @click="closeDocumentLibrary()"
            ></i>
          </v-card-title>
          <v-progress-linear
            indeterminate
            color="blue"
            v-if="initval"
          ></v-progress-linear>
          <v-tabs vertical>
            <v-tab
              v-for="(assettype, i) in assetTypes"
              @click="getAssetData(assettype.type)"
              :key="i"
            >
              <v-icon left> {{ assettype.icon }}</v-icon>
              {{ assettype.type }}
            </v-tab>
            <!-- PDf section -->
            <v-tab-item>
              <v-card flat>
                <div class="search-sec">
                  <div>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <!-- @change="initialise" -->
                        <v-text-field
                          v-on="on"
                          style="width: 300px"
                          v-model="search"
                          append-icon="search"
                          label="Search"
                          single-line
                          hide-details
                        ></v-text-field>
                      </template>
                      <span>Search</span>
                    </v-tooltip>
                  </div>
                  <div>
                    <v-pagination
                      v-model="page"
                      :length="totalPages"
                      total-visible="9"
                      next-icon="mdi-menu-right"
                      prev-icon="mdi-menu-left"
                      @input="handlePageChange"
                    ></v-pagination>
                  </div>
                </div>
                <v-card-text>
                  <VueElementLoading
                    :active="loader"
                    spinner="bar-fade-scale"
                    color="var(--primary)"
                  />
                  <div v-if="AssetsData.length == 0 && !initval">
                    No PDF documents found, Please Upload
                  </div>
                  <div class="d-flex file-section">
                    <div v-for="(assetData, i) in AssetsData" :key="i">
                      <div class="mt-4">
                        <v-icon left> mdi-file-pdf </v-icon>
                      </div>
                      <div>
                        <div class="d-flex">
                          <h2>{{ assetData.alt_text }}</h2>
                          <div class="action-btn">
                            <a
                              :href="aws_url + assetData.media_url"
                              target="_blank"
                              style="color: red"
                            >
                              <i
                                style="margin-top: 10px"
                                class="vsm-icon pe-7s-download"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </div>
                        </div>
                        <p class="dec-ellipsis-1">
                          By: {{ assetData.user.name }}
                        </p>
                        <p class="dec-ellipsis-1">
                          Year: {{ assetData.photo_year }}
                          <!-- Year: {{ assetData.photo_year | formatDateYear }} -->
                        </p>
                        <p class="dec-ellipsis-1">
                          {{ assetData.uploaded_at }}
                        </p>
                      </div>
                      <v-btn
                        class="mt-4"
                        color="primary"
                        dark
                        small
                        @click="assignDocument(assetData)"
                      >
                        <v-icon dark style="margin-right: 20px">
                          mdi-plus
                        </v-icon>
                        Assign
                      </v-btn>
                    </div>
                  </div>
                  <div class="mt-20">
                    <vue-dropzone
                      ref="myVueDropzone"
                      id="dropzone"
                      :options="dropzoneOptions"
                      @vdropzone-file-added="afterFileLoad"
                    ></vue-dropzone>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- PDf section-->
            <!-- Word section -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <VueElementLoading
                    :active="loader"
                    spinner="bar-fade-scale"
                    color="var(--primary)"
                  />
                  <div v-if="AssetsData.length == 0 && !initval">
                    No Documents found, Please Upload
                  </div>
                  <div class="d-flex file-section">
                    <div v-for="(assetData, i) in AssetsData" :key="i">
                      <div class="mt-4">
                        <v-icon left> mdi-microsoft-word </v-icon>
                      </div>
                      <div>
                        <div class="d-flex">
                          <h2>{{ assetData.alt_text }}</h2>
                          <div class="action-btn">
                            <a
                              :href="aws_url + assetData.media_url"
                              target="_blank"
                              style="color: red"
                            >
                              <i
                                style="margin-top: 10px"
                                class="vsm-icon pe-7s-download"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </div>
                        </div>
                        <p class="dec-ellipsis-1">
                          By: {{ assetData.user.name }}
                        </p>
                        <p class="dec-ellipsis-1">
                          Year: {{ assetData.photo_year }}
                          <!-- Year: {{ assetData.photo_year | formatDateYear }} -->
                        </p>
                        <p class="dec-ellipsis-1">
                          {{ assetData.uploaded_at }}
                        </p>
                      </div>
                      <v-btn
                        class="mt-4"
                        color="primary"
                        dark
                        small
                        @click="assignDocument(assetData)"
                      >
                        <v-icon dark style="margin-right: 20px">
                          mdi-plus
                        </v-icon>
                        Assign
                      </v-btn>
                    </div>
                  </div>
                  <div class="mt-20">
                    <vue-dropzone
                      ref="myVueDropzone"
                      id="dropzone"
                      :options="dropzoneOptions"
                      @vdropzone-file-added="afterFileLoad"
                    ></vue-dropzone>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- word section -->
            <!-- Excel section -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <VueElementLoading
                    :active="loader"
                    spinner="bar-fade-scale"
                    color="var(--primary)"
                  />
                  <div v-if="AssetsData.length == 0 && !initval">
                    No Spreadshets found, Please Upload
                  </div>
                  <div class="d-flex file-section">
                    <div v-for="(assetData, i) in AssetsData" :key="i">
                      <div class="mt-4">
                        <v-icon left> mdi-microsoft-excel </v-icon>
                      </div>
                      <div>
                        <div class="d-flex">
                          <h2>{{ assetData.alt_text }}</h2>
                          <div class="action-btn">
                            <a
                              :href="aws_url + assetData.media_url"
                              target="_blank"
                              style="color: red"
                            >
                              <i
                                style="margin-top: 10px"
                                class="vsm-icon pe-7s-download"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </div>
                        </div>
                        <p class="dec-ellipsis-1">
                          By: {{ assetData.user.name }}
                        </p>
                        <p class="dec-ellipsis-1">
                          Year: {{ assetData.photo_year }}
                          <!-- Year: {{ assetData.photo_year | formatDateYear }} -->
                        </p>
                        <p class="dec-ellipsis-1">
                          {{ assetData.uploaded_at }}
                        </p>
                      </div>
                      <v-btn
                        class="mt-4"
                        color="primary"
                        dark
                        small
                        @click="assignDocument(assetData)"
                      >
                        <v-icon dark style="margin-right: 20px">
                          mdi-plus
                        </v-icon>
                        Assign
                      </v-btn>
                    </div>
                  </div>
                  <div class="mt-20">
                    <vue-dropzone
                      ref="myVueDropzone"
                      id="dropzone"
                      :options="dropzoneOptions"
                      @vdropzone-file-added="afterFileLoad"
                    ></vue-dropzone>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- Excel section -->
            <!-- Videos section -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <VueElementLoading
                    :active="loader"
                    spinner="bar-fade-scale"
                    color="var(--primary)"
                  />
                  <div class="mb-20" style="text-align: right">
                    <v-btn @click="opendialog">Add Video</v-btn>
                  </div>
                  <div v-if="AssetsData.length == 0 && !initval">
                    No Videos found, Add Video
                  </div>
                  <div class="d-flex file-section">
                    <div v-for="(assetData, i) in AssetsData" :key="i">
                      <div class="mt-4">
                        <v-icon left> mdi-movie </v-icon>
                      </div>
                      <div>
                        <div class="d-flex">
                          <h2>{{ assetData.alt_text }}</h2>
                          <div class="action-btn">
                            <a
                              :href="aws_url + assetData.media_url"
                              target="_blank"
                              style="color: red"
                            >
                              <i
                                style="margin-top: 10px"
                                class="vsm-icon pe-7s-download"
                                aria-hidden="true"
                              ></i>
                            </a>
                          </div>
                        </div>
                        <p class="dec-ellipsis-1">
                          By: {{ assetData.user.name }}
                        </p>
                        <p class="dec-ellipsis-1">
                          Year: {{ assetData.photo_year }}
                          <!-- Year: {{ assetData.photo_year | formatDateYear }} -->
                        </p>
                        <p class="dec-ellipsis-1">
                          {{ assetData.uploaded_at }}
                        </p>
                      </div>
                      <v-btn
                        class="mt-4"
                        color="primary"
                        dark
                        small
                        @click="assignDocument(assetData)"
                      >
                        <v-icon dark style="margin-right: 20px">
                          mdi-plus
                        </v-icon>
                        Assign
                      </v-btn>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <!-- Videos section -->
          </v-tabs>
        </v-card>
      </div>
    </v-dialog>
    <!-- Manage Assets section -->

    <v-dialog v-model="otherdialog" max-width="600">
      <v-form ref="form" v-model="valid">
        <v-card class="flexcard" height="100%">
          <v-card-title style="justify-content: space-between">
            <span class="headline">Upload Meta Data</span>
            <i
              class="lnr-cross"
              style="cursor: pointer"
              @click="closeotherdialog()"
            ></i>
          </v-card-title>
          <v-container grid-list-md>
            <v-layout>
              <v-flex xs12 md3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="alt_text"
                      label="Alt Text"
                      :rules="fieldRules"
                      required
                    ></v-text-field>
                  </template>
                  <span>Name</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md3>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-autocomplete
                      v-on="on"
                      label="Select Category"
                      index="shortname"
                      item-value="shortname"
                      item-text="shortname"
                      v-model="category"
                      :rules="fieldRules"
                      :items="categories"
                      required
                    ></v-autocomplete>
                  </template>
                  <span>Category</span>
                </v-tooltip>
              </v-flex>
              <v-flex xs12 md6>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-on="on"
                      v-model="description"
                      label="Description"
                      required
                    ></v-text-field>
                  </template>
                  <span>Description</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 md6>
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="photo_year"
                      label="Year"
                      prepend-icon="event"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    v-model="photo_year"
                    @input="menu2 = false"
                    :allowed-dates="
                      (date) => date <= new Date().toISOString().substr(0, 10)
                    "
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md6>
                <v-checkbox
                  v-model="status"
                  v-bind:false-value="0"
                  v-bind:true-value="1"
                  :label="`Active?: ${status == 1 ? 'Yes' : 'No'}`"
                ></v-checkbox>
              </v-flex>
            </v-layout>
            <v-layout v-if="selectedtype == 'Videos'">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-on="on"
                    v-model="media_url"
                    :rules="fieldRules"
                    label="Video Url"
                    required
                  ></v-text-field>
                </template>
                <span>Video Url</span>
              </v-tooltip>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="save" :disabled="!valid || btnloading">
              <b-spinner small v-if="btnloading"></b-spinner>Save
            </v-btn>
            <v-btn @click="closeotherdialog" :disabled="btnloading">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-layout
      style="
        flex-direction: column-reverse;
        align-items: center;
        padding: 10px;
        margin: 6px 3px;
      "
    >
      <v-flex
        xs12
        md7
        style="margin-left: 10px; font-size: 10px; text-align: center"
      >
        <label
          for="files"
          class="btn"
          style="margin: 0px; font-size: 10px"
          v-if="label"
          >{{ label }}</label
        >

        <v-btn
          class="mt-4"
          color="primary"
          dark
          small
          @click="openDocumentLibrary()"
          >Open Document Library</v-btn
        >
      </v-flex>
    </v-layout>
  </div>
</template>
  
  <script>
// import vue2Dropzone from "vue2-dropzone";
//import "vue2-dropzone/dist/vue2Dropzone.min.css";

export default {
  props: {
    entity_type: {
      type: String,
      default: "None",
    },
    entity_id: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: "Logo",
    },
    documentlink: {
      type: String,
      default: "",
    },
    folder: {
      type: String,
      default: "others",
    },
    resizewidth: {
      type: Number,
      default: 321,
    },
    resizeheight: {
      type: Number,
      default: 268,
    },
    uploadtype: {
      type: String,
      default: "",
    },
  },
  data: () => ({
    documentDialog: false,
    aws_url: import.meta.env.VITE_AWS_URL,
    page: 1,
    totalPages: 0,
    sharedpage: 1,
    sharedTotalPages: 0,
    search: "",
    loader: false,
    valid_error: false,
    initval: false,
    dialog: false,
    selectedtype: "Pdf",
    edit_id: 0,
    edit_alt_text: "",
    edit_description: "",
    edit_photo_year: "",
    edit_status: "",
    edit_category: "",
    edit_coordinates: {},
    AssetsData: [],
    SharedAssets: [],
    selectedImages: [],
    access_token: "XXX",
    dropzoneOptions: {
      url: "/api/v1/dragUpload",
      thumbnailWidth: 150,
      maxFilesize: 0.5,
      headers: { Assets: "Assets" },
      previewsContainer: false,
      autoProcessQueue: false,
    },
    assetTypes: [
      { type: "Pdf", icon: "mdi-file-pdf" },
      { type: "Doc", icon: "mdi-microsoft-word" },
      { type: "Excel", icon: "mdi-microsoft-excel" },
      { type: "Videos", icon: "mdi-movie" },
    ],
    message: "",

    currentFile: undefined,
    progress: 0,
    fileInfos: [],
    icon: "",
    filename: "icon",
    extension: "png",
    imageloading: false,
    sourceimage: "",
    cropperdialog: false,
    url: "",
    base64: "",
    error: "",
    editmode: false,
    editImageUrl: "",
    componentKey: 0,
    addbtn: false,
    valid: false,
    otherdialog: false,
    menu2: false,
    alt_text: "",
    description: "",
    photo_year: "",
    media_url: "",
    category: "",
    status: 0,
    selectedfile: {},
    btnloading: false,
    fieldRules: [(v) => !!v || "Field is required"],
    categories: [],
  }),
  components: {
    // vueDropzone: vue2Dropzone,
  },
  watch: {
    uploadtype: {
      immediate: true,
      handler() {
        if (this.uploadtype) {
          this.documentDialog = true;
        }
      },
    },
  },
  created() {
    this.selectedtype = "Pdf";

    this.$axios
      .get("lookupdata/IMAGE_CATEGORY")
      .then((res) => {
        this.categories = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  methods: {
    openDocumentLibrary() {
      this.documentDialog = true;
    },

    closeDocumentLibrary() {
      this.documentDialog = false;
      this.$emit("closeDialog", this.uploadtype);
    },

    assignDocument(document) {
      console.log("documentUrl", document);
      this.closeDocumentLibrary();

      this.$emit("updateDocument", document.media_url);
      this.$emit("documentExt", document.type);
    },

    removeDocument() {
      // this.documentlink = '';
      this.$emit("updateDocument", "");
    },

    opendialog() {
      this.save();
    },

    closeotherdialog() {
      this.otherdialog = false;
    },

    getAssetData(type) {
      this.selectedtype = type;
      this.AssetsData = [];
      // this.initialise();
    },

    afterFileLoad(file) {
      if (this.selectedtype == "Image") {
        if (file.type.includes("image")) {
          console.log("Continue Image Upload");
        } else {
          alert("Only Images allowed!!");
          return false;
        }
      }
      if (this.selectedtype == "Pdf") {
        if (file.type.includes("pdf")) {
          console.log("Continue PDF Upload");
        } else {
          alert("Only PDF's allowed!!");

          return false;
        }
      } else if (this.selectedtype == "Doc") {
        if (file.type.includes("document")) {
          console.log("Continue Document Upload");
        } else {
          alert("Only Document's allowed!!");
          return false;
        }
      } else if (this.selectedtype == "Excel") {
        if (file.type.includes("sheet")) {
          console.log("Continue SpreadSheet Upload");
        } else {
          alert("Only Spreadsheet's allowed!!");
          return false;
        }
      }
      this.selectedfile = file;
      this.opendialog();
    },

    save() {
      this.loader = true;

      this.btnloading = true;
      if (this.selectedtype == "Videos") {
        if (this.edit_id > 0) {
          this.$axios
            .patch("assets/" + this.edit_id, {
              alt_text: this.alt_text,
              description: this.description,
              media_url: this.media_url,
              category: this.category,
            })
            .then((res) => {
              this.btnloading = false;
              if (res.data.status == "E") {
                this.btnloading = false;
                this.valid_error = true;
                this.message = res.data.message;
                this.$vuetify.goTo(0);
              } else {
                // this.initialise();
                this.closeotherdialog();
              }
            })
            .catch((err) => {
              console.log(err);
              this.btnloading = false;
              this.valid_error = true;
              this.message =
                "Something went wrong.  Please contact the administrator.";
              this.$vuetify.goTo(0);
            });
        } else {
          this.$axios
            .post("upload", {})
            .then((res) => {
              console.log("success");
              this.btnloading = false;
              if (res.data.status == "E") {
                this.loader = false;
                this.btnloading = false;
                this.valid_error = true;
                this.message = res.data.message;
                this.$vuetify.goTo(0);
              } else {
                console.log("loader is false");
                this.loader = false;
                this.documentDialog = false;
                this.$emit("uploadedDocument", res.data.filepath);
              }
            })
            .catch((err) => {
              console.log(err);
              this.loader = false;
              this.btnloading = false;
              this.valid_error = true;
              this.message =
                "Something went wrong.  Please contact the administrator.";
              this.$vuetify.goTo(0);
            });
        }
      } else {
        let formData = new FormData();
        formData.append("file", this.selectedfile);
        formData.append("folder_name", this.folder);
        // formData.append("alt_text", this.alt_text);
        // formData.append("category", this.category);
        // formData.append("description", this.description);
        // formData.append("type", this.selectedtype);
        // formData.append("entity_id", this.$userOrgId);
        // formData.append("photo_year", this.photo_year);
        // formData.append("status", this.status);
        // formData.append("id", this.edit_id);
        console.log("form data will b e", this.selectedfile);
        this.$axios
          .post("upload", formData)
          .then((res) => {
            this.btnloading = false;
            if (res.data.status == "E") {
              this.btnloading = false;
              this.valid_error = true;
              this.message = res.data.message;
              this.$vuetify.goTo(0);
              this.loader = false;
            } else {
              this.documentDialog = false;
              this.loader = false;

              console.log("res. data will be", res.data.filepath);

              this.$emit("uploadedDocument", res.data.filepath);
            }
          })
          .catch((err) => {
            console.log(err);
            this.loader = false;
            this.btnloading = false;
            this.valid_error = true;
            this.message =
              "Something went wrong.  Please contact the administrator.";
            this.$vuetify.goTo(0);
          });
      }
    },

    handlePageChange(value) {
      this.page = value;
      console.log("Handle Page Change Value => " + value);
      // this.initialise();
    },
  },
};
</script>
  <style scoped>
.mt-20 {
  margin-top: 20px;
}
.v-tabs :deep(.v-tabs-bar)  {
  /* width: 157px; */
  border-right: 1px solid #dedede !important;
}

.theme--dark.v-toolbar.v-sheet {
  height: auto !important;
}
.v-toolbar :deep(.v-toolbar__content) {
  height: auto !important;
}
.v-tab {
  justify-content: left;
}
.file-section > div {
  margin-right: 13px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 2px 1px #eee;
  padding: 16px;
  width: 190px;
  position: relative;
  margin-top: 19px;
  flex-flow: wrap;
}
.file-section div > h2 {
  font-size: 17px;
  margin-bottom: 0px;
  font-weight: 500;
  margin-top: 6px;
  color: #007ca1;
}
.circle-img {
  background: #ffffff
    url(https://d175p71fr6e2yb.cloudfront.net/storage/orglogo/961dcfe1-696c-4276-a4dd-ef75ad6b7673.png);
  width: 116px;

  border-radius: 11px;

  background-size: cover;
  background-position: center;
  margin-right: 20px;
  border: 1px solid #f0f0f0;
}
.featured-parent > h3 {
  width: 100%;
  font-size: 20px;
  margin-top: 10px;
  color: rgb(16, 145, 189);
  font-weight: 500;
  text-align: left;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dec-ellipsis-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  color: #707070 !important;
  font-weight: 500 !important;
}
.dec-ellipsis-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14px;
  margin-bottom: 0px;
  color: #a4a4a4 !important;
  font-weight: 500 !important;
}
.action-btn {
  position: absolute;
  top: -9px;
  right: 0px;
}
.action-btn > i {
  font-weight: 900;
  font-size: 17px;
  color: #000000;
  cursor: pointer;
}
.mt-4 {
  margin-top: 4px !important;
}
.search-sec {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 98%;
}
.upload-img {
  flex-direction: column-reverse;
  align-items: center;
  padding: 10px;
  height: 190px;
  background: #f1f1f1;
  margin: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px dashed gray;
  color: gray;
}
</style>
  