<template>
  <div>
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
              class="col-md-5 ml-2"
              :heading="$t('create_ammend_marketing_holder')"
              :google_icon="google_icon"
            ></page-title>
          </div>
          <!-- Data Table Card -->
          <div class="mb-3 mx-auto">
            <div class="card-body">
              <content-loader v-if="loader"></content-loader>
              <v-form ref="form" v-model="valid">
                <v-row class="px-6">
                  <v-col xs="12" md="10" lg="10">
                    <v-row class="px-6">
                      <v-col xs="12" md="5" lg="5">
                        <v-tooltip :text="this.$t('name')" location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-text-field
                              v-bind="props"
                              v-model="fieldItem.contact_name"
                              :rules="nameRules"
                              v-bind:label="$t('name')"
                              variant="outlined"
                              density="compact"
                              class="required_field"
                              required
                            ></v-text-field>
                          </template>
                        </v-tooltip>
                      </v-col>
                      <v-col xs="12" md="5" lg="5">
                        <v-tooltip :text="this.$t('email')" location="bottom">
                          <template v-slot:activator="{ props }">
                            <v-text-field
                              v-bind="props"
                              v-model="fieldItem.contact_email"
                              :rules="emailRules"
                              v-bind:label="$t('email')"
                              variant="outlined"
                              density="compact"
                              class="required_field"
                              required
                            ></v-text-field>
                          </template>
                        </v-tooltip>
                      </v-col>
                      <v-col cols="2" md="2">
                        <v-switch
                          v-model="fieldItem.status"
                          :label="$t('status')"
                          :true-value="1"
                          :false-value="0"
                          color="success"
                          hide-details
                          inset
                          small
                        />
                      </v-col>
                      <v-col xs="12" md="12" lg="12">
                        <v-tooltip
                          :text="this.$t('description')"
                          location="bottom"
                        >
                          <template v-slot:activator="{ props }">
                            <v-textarea
                              v-bind="props"
                              v-model="fieldItem.description"
                              v-bind:label="$t('description')"
                              variant="outlined"
                              density="compact"
                              rows="1"
                              maxlength="500"
                              counter="true"
                            ></v-textarea>
                          </template>
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col xs="12" md="2" lg="2">
                    <v-row class="px-6">
                      <v-col
                        xs="12"
                        md="4"
                        lg="4"
                        style="
                          display: flex;
                          justify-content: center;
                          text-align: center;
                        "
                      >
                        <div>
                          <div class="image-container">
                            <v-hover v-slot="{ isHovering, props }">
                              <div style="position: relative" v-bind="props">
                                <img
                                  v-if="fieldItem.logo"
                                  v-bind:style="
                                    isHovering == true
                                      ? 'filter: blur(1px);'
                                      : ''
                                  "
                                  :src="envImagePath + fieldItem.logo"
                                  width="100"
                                  height="70"
                                  alt
                                />
                                <img
                                  v-bind:style="
                                    isHovering == true
                                      ? 'filter: blur(1px);'
                                      : ''
                                  "
                                  v-else
                                  src="@/assets/images/upload_image_default.png"
                                  width="100"
                                  height="70"
                                />
                                <div v-show="isHovering" class="camera-icon">
                                  <v-icon @click="uploadFile"
                                    >mdi-camera</v-icon
                                  >
                                </div>
                              </div>
                            </v-hover>
                          </div>
                          <div class="py-2">
                            <a
                              class="text-center pointer px-1"
                              @click="downloadImage(fieldItem.logo)"
                            >
                              <span><v-icon>mdi-download</v-icon></span>
                            </a>
                          </div>
                        </div>
                        <br />
                        <Imageupload
                          :folder="'marketing_holder_logo'"
                          :resizewidth="0.4"
                          :resizeheight="0.1"
                          @uploaded_image="uploaded_image"
                          :upload_profile="uploadfile"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-form>
            </div>
            <div class="d-block mr-4 mt-3 text-right">
              <v-tooltip :text="this.$t('cancel')" location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" class="d-inline-block mr-2">
                    <v-btn
                      v-bind="props"
                      size="small"
                      @click="cancel"
                      :disabled="loading"
                      class="btn-cancel ma-1"
                      color="cancel"
                      >{{ $t("cancel") }}</v-btn
                    >
                  </div>
                </template>
              </v-tooltip>
              <v-tooltip :text="this.$t('submit')" location="bottom">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" class="d-inline-block">
                    <v-btn
                      :disabled="isDisabled"
                      @click="submit"
                      size="small"
                      class="btn-approved mr-2"
                      color="success"
                    >
                      {{ $t("submit") }}
                      <v-progress-circular
                        v-if="isBtnLoading"
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
      </div>
    </v-container>
  </div>
</template>

<script>
import Imageupload from "../../CustomComponents/ImageUpload.vue";
export default {
  components: { Imageupload },
  data: () => ({
    envImagePath: import.meta.env.VITE_IMAGE_PATH,
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    valid: true,
    successmessage: "",
    message: "",
    sel_lang: "",
    file: "",
    loading: false,
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    uploadfile: false,
    fieldItem: {
      id: 0,
      contact_name: "",
      contact_email: "",
      logo: "",
      status: 1,
      description: "",
    },
    dialogMessage: "",
    dialogTitle: "",
  }),

  computed: {
    emailRules() {
      return [
        (v) => !!v || this.$t("email_required"),
        (v) =>
          !v ||
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          this.$t("email_valid"),
      ];
    },
    nameRules() {
      return [(v) => !!v || this.$t("name_required")];
    },

    descriptionRules() {
      return [(v) => !!v || this.$t("description_required")];
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
            .get("edit_marketing_holder/" + this.$route.query.slug)
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.fieldItem = res.data.marketing_holders;
                this.loader = false;
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
                this.loader = false;
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log(err);
            });
        }
      },
    },
  },
  methods: {
    cancel() {
      this.$router.push({
        name: "marketing_holders",
      });
    },
    submit() {
      if (this.$refs.form.validate() && this.valid == true) {
        this.isDisabled = true;
        this.isBtnLoading = true;
        this.$axios
          .post("marketing_holder", this.fieldItem)
          .then((res) => {
            if (Array.isArray(res.data.message)) {
              this.array_data = res.data.message.toString();
            } else {
              this.array_data = res.data.message;
            }
            if (res.data.status == "S") {
              this.$toast.success(this.array_data);
              this.message = res.data.message;
              this.$router.push({
                name: "marketing_holders",
              });
            } else {
              this.$toast.error(this.array_data);
            }
          })
          .catch((err) => {
            this.$toast.error(this.$t("something_went_wrong"));
            console.log("error", err);
          })
          .finally(() => {
            this.isDisabled = false;
            this.isBtnLoading = false;
          });
      }
    },
    clear() {
      this.$refs.form.reset();
    },
    uploadFile() {
      if (this.uploadfile == false) {
        this.uploadfile = true;
      } else {
        this.uploadfile = false;
      }
    },
    downloadImage(image_url) {
      window.open(this.envImagePath + image_url, "_blank");
    },
    uploaded_image(img_src) {
      this.fieldItem.logo = img_src;
    },
  },
};
</script>
<style scoped></style>
