<template>
  <div class="pa-3">
    <div v-for="(document, index) in documents" :key="document.id">
      <div class="row">
        <div class="col-md-4 col-sm-4">
          <v-tooltip :text="$t('file_name')" location="bottom">
            <template v-slot:activator="{ props }">
              <v-text-field
                :disabled="is_disabled"
                v-bind="props"
                variant="outlined"
                maxlength="100"
                density="compact"
                :error="errorName"
                :error-messages="errorNameMessage"
                @keyup="clearNameErrors"
                v-model="document.doc_name"
                :rules="fieldRules"
                v-bind:label="$t('file_name')"
                class="required_field"
                required
                @change="emitData()"
              ></v-text-field>
            </template>
          </v-tooltip>
        </div>
        <div class="col-md-3 col-sm-4">
          <v-tooltip :text="$t('expiry_date')" location="bottom">
            <template v-slot:activator="{ props }">
              <DatePicker
                :disable_field="is_disabled"
                v-bind="props"
                v-model="document.doc_date"
                :label="$t('expiry_date')"
                :stored_date="document.doc_date"
                :array_index="index"
                dense
                @on-change="emitData()"
                @formatted_date="formatDate"
              ></DatePicker>
            </template>
          </v-tooltip>
        </div>
        <!-- @change="emitData()" -->
        <div class="col-md-4 col-sm-4">
          <div class="row pt-2" v-if="document.doc_url">
            <v-tooltip :text="$t('show_file')" location="bottom">
              <template v-slot:activator="{ props }">
                <div class="col-md-1">
                  <a :href="doc_path + document.doc_url" download
                    ><v-icon v-bind="props">mdi mdi-file</v-icon></a
                  >
                </div>
                <div class="col-md-9">
                  <a :href="doc_path + document.doc_url" download>
                    <v-chip size="small" v-bind="props">{{
                      document.doc_url
                    }}</v-chip>
                  </a>
                </div>
              </template>
            </v-tooltip>
            <div class="col-md-1">
              <v-tooltip
                :text="$t('remove_file')"
                location="bottom"
                v-if="is_disabled != true"
              >
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    @click="removeUploadedFile(index)"
                    size="small"
                    >mdi-close</v-icon
                  >
                </template>
              </v-tooltip>
            </div>
          </div>
          <div v-else>
            <v-tooltip :text="$t('upload_file')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-file-input
                  :disabled="is_disabled"
                  v-bind="props"
                  show-size
                  :label="$t('file_input')"
                  outlined
                  :rules="fileRules"
                  :error="errorUpload"
                  :error-messages="errorUploadMessage"
                  @input="clearUploadErrors"
                  prepend-icon=""
                  append-inner-icon="mdi mdi-file-document-plus"
                  accept="*"
                  required
                  class="required_field"
                  variant="outlined"
                  density="compact"
                  @click="updateFileIndex(index)"
                  @change="onFileChange"
                  ><template v-slot:selection="{ fileNames }">
                    <template v-for="fileName in fileNames" :key="fileName">
                      <v-chip size="small" label class="me-2">
                        {{ fileName }}
                      </v-chip>
                    </template>
                  </template>
                </v-file-input>
              </template>
            </v-tooltip>
          </div>
        </div>
        <div class="col-md-1 col-sm-1 pt-1" v-if="index > 0">
          <v-icon
            v-bind:class="is_disabled == true ? 'disable-delete' : ''"
            @click="deleteFile(index)"
            size="x-large"
            class="delete-bin ml-4"
            >mdi mdi-delete-circle-outline</v-icon
          >
        </div>
      </div>
    </div>
    <div
      class="d-flex justify-content-start"
      v-if="doc_upload_type == 'Multiple'"
    >
      <v-btn
        :disabled="is_disabled"
        @click="addField(documents)"
        color="green"
        size="small"
        >Add new</v-btn
      >
    </div>
  </div>
</template>
<script>
import DatePicker from "./DatePicker.vue";
export default {
  props: {
    array_data: {
      type: Array,
      default: () => [],
    },
    is_disabled: {
      type: Boolean,
      default: false,
    },
    doc_upload_type: {
      type: String,
      default: "Multiple",
    },
    // array_index: {
    //   type: Number,
    //   default: null,
    //   required: true,
    // },

    question_index: {
      type: Number,
      default: null,
      required: true,
    },

    section_index: {
      type: Number,
      default: null,
    },
    invalid_id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      doc_path: import.meta.env.VITE_IMAGE_PATH,
      documents: [],
      menu1: false,
      errorName: false,
      errorUpload: false,
      sel_file_index: null,
      errorNameMessage: "",
      errorUploadMessage: "",
      file_name: "",
      fileurl: "",
      folder: "wizard_file_upload",
    };
  },
  watch: {
    array_data: {
      immediate: true,
      handler() {
        if (this.array_data.length > 0) {
          this.documents = this.array_data;
        }
      },
    },
    invalid_id: {
      immediate: true,
      handler() {
        if (this.invalid_id > 0) {
          this.errorName = true;
          this.errorUpload = true;
          this.errorNameMessage = this.$t("field_required");
          this.errorUploadMessage = this.$t("field_required");
        }
      },
    },
  },
  created() {
    if (this.documents.length == 0) {
      const qarray = {
        id: 1,
        doc_name: "",
        doc_date: "",
        doc_url: "",
      };
      this.documents.push(qarray);
    }
  },
  components: {
    DatePicker,
  },
  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    fileRules() {
      return [(v) => v.length > 0 || this.$t("field_required")];
    },
  },

  methods: {
    clearNameErrors() {
      this.errorName = false;
      this.errorNameMessage = "";
    },
    clearUploadErrors() {
      this.errorUpload = false;
      this.errorUploadMessage = "";
    },
    updateFileIndex(index) {
      this.sel_file_index = index;
    },
    onFileChange(e) {
      console.log("evnrnt target", this.sel_file_index);
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
      const filename = event.target.files[0].name;
      const lastDot = filename.lastIndexOf(".");
      const fileNameWithoutExt = filename.substring(0, lastDot);
      const ext = filename.substring(lastDot + 1);
      console.log("FileName => " + fileNameWithoutExt);
      this.filename = fileNameWithoutExt;
      console.log("Extension => " + ext);
      this.extension = ext;
    },
    removeUploadedFile(index) {
      this.documents[index].doc_url = "";
    },
    createImage(file) {
      this.emitData();
      //var imagex = new Image();
      var reader = new FileReader();
      this.progress = 0;
      reader.onload = (e) => {
        this.$emit("updateImage", e.target.result);
        this.upload(e.target.result);
      };
      reader.readAsDataURL(file);
      //this.upload(this.image);
    },
    upload(imagedata) {
      this.loader = true;
      if (!imagedata) {
        this.message = "Please select a file!";
        return;
      }
      this.message = "";
      return this.$axios
        .post("file_upload", {
          image: imagedata,
          folder: this.folder,
          filename: this.filename,
          extension: this.extension,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status == "S") {
            this.message = res.data.message;

            this.fileurl = res.data.filepath;
            this.file_name = this.fileurl.replace(/^.*[/]/, "");
            for (let index in this.documents) {
              if (this.sel_file_index == index) {
                this.documents[index].doc_url = this.fileurl;
              }
            }
            // console.log(res.data.filepath);
            // this.$emit('file-url', this.file_name);
            // this.$emit('filepath', this.fileurl);
            this.loader = false;
          }
        })
        .catch((err) => {
          alert("Unable to upload file, try later");
          console.log("this error -> " + err);
        });
    },
    emitData() {
      var index_path = {
        index1: this.section_index,
        index2: this.question_index,
      };
      console.log("index path will be ", index_path);
      this.$emit("update-data", this.documents, index_path);
    },

    addField(array) {
      const qarray = {
        id: array.length,
        doc_name: "",
        doc_date: "",
        doc_url: "",
      };
      this.documents.push(qarray);
    },
    formatDate(date, index) {
      if (index >= 0) {
        this.documents[index].doc_date = date;
      }
    },
    deleteFile(index) {
      this.documents.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.disable-delete {
  pointer-events: none;
  color: grey !important;
}
</style>