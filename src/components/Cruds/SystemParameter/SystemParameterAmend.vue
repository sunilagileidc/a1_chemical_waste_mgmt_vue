<template>
  <div class="mx-2 mt-3 p-0">
    <div class="container my-3 p-0">
      <page-title
        class="col-md-4 ml-2"
        :heading="$t('create_system_parameter')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <content-loader v-if="loader"></content-loader>
    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6" v-if="system_params.parameter_name == 'APP_LOGO'">
            <!-- :value="system_params.is_file_upload" -->
            <v-col md="6">
              <v-checkbox
                v-model="system_params.is_file_upload"
                v-bind:label="$t('is_file_upload')"
                color="green"
                @click="uploadImagestatus(system_params.is_file_upload)"
                :value="1"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row class="px-6">
            <v-col cols="12" md="6">
              <v-tooltip :text="$t('parameter_name')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-on="on"
                    v-model="system_params.parameter_name"
                    :rules="fieldRules"
                    v-bind:label="$t('parameter_name')"
                    required
                    v-bind="props"
                    class="required_field"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col md="6" v-if="system_params.is_file_upload == false">
              <v-tooltip :text="$t('parameter_value')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-on="on"
                    v-model="system_params.parameter_value"
                    :rules="fieldRules"
                    v-bind="props"
                    v-bind:label="$t('parameter_value')"
                    required
                    class="required_field"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
            <v-col
              md="2"
              v-if="
                system_params.is_file_upload == true &&
                system_params.parameter_name == 'APP_LOGO'
              "
              style="display: flex; justify-content: center; text-align: center"
            >
              <div>
                <div class="image-container">
                  <v-hover v-slot="{ isHovering, props }">
                    <div style="position: relative" v-bind="props">
                      <img
                        v-if="system_params.parameter_value"
                        v-bind:style="
                          isHovering == true ? 'filter: blur(1px);' : ''
                        "
                        :src="envImagePath + system_params.parameter_value"
                        width="100"
                        height="70"
                        alt
                      />
                      <img
                        v-bind:style="
                          isHovering == true ? 'filter: blur(1px);' : ''
                        "
                        v-else
                        src="@/assets/images/upload_image_default.png"
                        width="100"
                        height="70"
                      />
                      <div v-show="isHovering" class="camera-icon">
                        <v-icon @click="uploadFile">mdi-camera</v-icon>
                      </div>
                    </div>
                  </v-hover>
                </div>
                <div
                  v-if="
                    system_params.parameter_value &&
                    system_params.parameter_name == 'APP_LOGO' &&
                    system_params.is_file_upload == true
                  "
                  class="py-2"
                >
                  <a
                    class="text-center pointer px-1"
                    @click="downloadImage(system_params.parameter_value)"
                  >
                    <span><v-icon>mdi-download</v-icon></span>
                  </a>
                  <!-- <a
                    class="px-1"
                    @click="deleteImage()"
                    style="cursor: pointer"
                  >
                    <v-icon color="red">mdi-delete-outline</v-icon>
                  </a> -->
                </div>
              </div>
              <br />
              <Imageupload
                :folder="'user_profile'"
                :resizewidth="0.4"
                :resizeheight="0.1"
                @uploaded_image="uploaded_image"
                :upload_profile="uploadfile"
              />
            </v-col>
          </v-row>
          <v-layout class="pt-3">
            <v-row class="px-6">
              <v-col md="12">
                <v-tooltip :text="$t('description')" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-textarea
                      v-on="on"
                      rows="2"
                      v-bind="props"
                      v-model="system_params.description"
                      :rules="fieldRules"
                      v-bind:label="$t('description')"
                      required
                      counter="250"
                      counter-value="250"
                      maxlength="250"
                      class="required_field"
                      variant="outlined"
                    ></v-textarea>
                  </template>
                  <span>{{ $t("description") }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-layout>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 pb-3 text-right">
        <v-tooltip :text="$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="$router.go(-1)"
                :disabled="isDisabled"
                class="ma-1"
                color="cancel"
                >{{ $t("cancel") }}</v-btn
              >
            </div>
          </template>
        </v-tooltip>
        <v-tooltip :text="$t('submit')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block">
              <v-btn
                :disabled="isDisabled"
                @click="submit"
                size="small"
                class="mr-2"
                color="success"
              >
                {{ $t("submit") }}
                <v-progress-circular
                  v-if="isDisabled"
                  indeterminate
                  width="1"
                  color="cancel"
                  size="x-small"
                  class="ml-2"
                ></v-progress-circular>
              </v-btn>
            </div>
          </template>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
import Imageupload from "../../CustomComponents/ImageUpload.vue";
import localStorageWrapper from "../../../localStorageWrapper.js";
export default {
  components: { PageTitle, Imageupload },
  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    envImagePath: import.meta.env.VITE_IMAGE_PATH,
    valid: false,
    loader: false,
    file: "",
    isBtnLoading: false,
    showupload: "",
    isDisabled: false,
    checkbox_value: false,
    system_params: {
      id: 0,
      parameter_name: "",
      parameter_value: "",
      description: "",
      is_file_upload: false,
    },
    noimagepreview: "",
    uploadfile: false,
    items: [],
  }),

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },

    numberRules() {
      return [(v) => !!v || this.$t("number_required")];
    },
  },

  created() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("edit_system_params/" + this.$route.query.slug)
            .then((res) => {
              this.system_params = res.data.systemparameter;
              this.loader = false;
            });
        }
      },
    },
  },
  methods: {
    deleteImage() {
      this.system_params.parameter_value = "";
    },
    uploaded_image(img_src) {
      this.system_params.parameter_value = img_src;
    },
    uploadFile() {
      if (this.uploadfile == false) {
        this.uploadfile = true;
      } else {
        this.uploadfile = false;
      }
    },
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        // Form is valid, process
        this.$axios
          .post("save_system_params", this.system_params)
          .then((res) => {
            this.emitter.emit("app_image_update");
            this.btnloading = false;
            let app_image_url = res.data.systemparameter.image_full_url;
            console.log("res data");
            console.log(res.data.systemparameter);
            if (app_image_url) {
              localStorageWrapper.setItem("App_Image_Url", app_image_url);
              console.log("app_image_url inside");
              console.log(app_image_url);
            }
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.$toast.success(this.array_data);
              this.message = res.data.message;
              this.$router.push({
                name: "system_parameter",
              });
            } else if (res.data.status == "E") {
              this.$toast.error(this.array_data);
              this.isBtnLoading = false;
              this.isDisabled = false;
            } else {
              this.isBtnLoading = false;
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    //  addfilename(filename) {
    //   this.upload_cv.filename = filename;
    // },
    //  fileExtension(file_extension) {
    //   this.upload_cv.mime_type = file_extension;
    // },
    uploadImagestatus(value) {
      if (value == false) {
        this.system_params.is_file_upload = true;
      } else {
        this.system_params.is_file_upload = false;
      }
    },
    updateFile(filepath) {
      this.system_params.parameter_value = filepath;

      // this.updateCV();
    },

    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
<style scoped>
input.larger {
  width: 20px;
  height: 20px;
}
.image-container {
  max-width: 110px;
  border-radius: 3px;
}
.image-container :deep(img)  {
  border: 3px dashed black;
}
.camera-icon {
  position: absolute;
  bottom: 20px;
  left: 40px;
  animation: fadeInUp 0.5s forwards;
}
.upload_doc {
  margin-top: -14px;
}
.pointer {
  cursor: pointer;
}
.upload_image {
  margin-bottom: 3px;
}
.download_btn_color {
  color: blue;
}
.image-width {
  border: 2px solid black;
  padding: 1px;
}
</style>
