<template>
  <div class="mx-2 mt-3 p-0">
    <div class="text-center">
      <page-title
        class="col-md-4"
        :heading="$t('amend_email_template')"
        :google_icon="google_icon"
      ></page-title>
    </div>
    <div class="mb-3">
      <content-loader v-if="loader"></content-loader>
      <div class="card-body" style="box-shadow: none !important">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6 mt-4">
            <v-col cols="12" sm="6" md="6">
              <v-tooltip :text="$t('select_mode')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-autocomplete
                    v-bind:label="$t('select_mode')"
                    item-value="id"
                    item-title="shortname"
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    index="id"
                    v-model="fieldItem.template_type_id"
                    :rules="fieldRules1"
                    :items="mode_items"
                    class="required_field"
                    outlined
                    required
                    dense
                  ></v-autocomplete>
                </template>
              </v-tooltip>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-tooltip :text="$t('name')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    :disabled="fieldItem.id == 0 ? disabled : ''"
                    v-bind="props"
                    maxlength="100"
                    v-model="fieldItem.template_name"
                    :rules="fieldRules"
                    class="required_field"
                    v-bind:label="$t('name')"
                    required
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6">
            <v-col cols="12" sm="12" md="12">
              <v-tooltip :text="$t('subject')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="fieldItem.template_subject"
                    :rules="fieldRules"
                    maxlength="100"
                    class="required_field"
                    v-bind:label="$t('subject')"
                    required
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6 pt-0">
            <v-col cols="12" md="12" lg="12" sm="12" class="pt-0">
              <v-card-title class="text-left" style="font-size: 17px">{{
                $t("body")
              }}</v-card-title>
              <v-tooltip :text="$t('body')" location="top">
                <template v-slot:activator="{ props }">
                  <div v-bind="props">
                    <QuillEditor
                      theme="snow"
                      contentType="html"
                      v-model:content="fieldItem.template_body"
                      class="hide_quill_input, required_field"
                      v-bind:id="
                        quill_item == true ? 'quill_item' : 'quill_item_border'
                      "
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)"
                      @change="onEditorChange($event)"
                    />
                    <small
                      v-if="quill_item"
                      class="text-danger ml-5 required_item shake"
                      >Field Required</small
                    >
                    <!-- <QuillEditor theme="snow" v-model:content="fieldItem.template_body"
                    contentType="html" name="template_body" v-bind:label="$t('body')" />-->
                  </div>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row class="px-6 mb-2">
            <v-col cols="12" md="12" lg="12" sm="12">
              <v-card-title class="text-left" style="font-size: 17px">{{
                $t("signature")
              }}</v-card-title>
              <v-tooltip :text="$t('signature')" location="top">
                <template v-slot:activator="{ props }">
                  <div v-bind="props">
                    <QuillEditor
                      class="hide_quill_input, required_field"
                      theme="snow"
                      contentType="html"
                      v-model:content="fieldItem.template_signature"
                      v-bind:id="
                        quill_sign == true
                          ? 'quill_item1'
                          : 'quill_item_border1'
                      "
                      v-bind:label="$t('body')"
                      @change="onEditorChangeSignature($event)"
                      @blur="onEditorBlurSign($event)"
                    />
                    <small
                      v-if="quill_sign"
                      class="text-danger ml-5 required_item shake"
                      >Field Required</small
                    >
                    <!-- <QuillEditor theme="snow" v-model:content="fieldItem.template_signature"
                    contentType="html" name="template_body" v-bind:label="$t('body')" />-->
                  </div>
                </template>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div class="d-block mr-4 mt-3 text-right">
        <v-tooltip :text="$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="$router.go(-1)"
                :disabled="loading"
                class="ma-1"
                color="cancel"
              >
                {{ $t("cancel") }}
              </v-btn>
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
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
    QuillEditor,
  },
  setup() {
    // const onEditorBlur = (quill) => {
    //   console.log('editor blur!', quill)
    // }
    const onEditorFocus = (quill) => {
      console.log("editor focus!", quill);
    };
    const onEditorReady = (quill) => {
      console.log("editor ready!", quill);
    };
    // const onEditorChange = ({ quill, html, text }) => {
    //   console.log('editor change!', quill, html, text)
    //   console.log("text is");
    //   console.log(text.length);

    // // if(text.length==1){
    // //  quill_item=true;
    // // }

    //   state._content = html
    // }

    // setTimeout(() => {
    //   state.disabled = true
    // }, 2000)

    return { onEditorReady, onEditorFocus };
  },
  data: () => ({
    quill_item: false,
    quill_sign: false,
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    btnloading: false,
    flowerbraceleft: "{{",
    flowerbraceright: "}}",
    orgcolumns: [],
    customercolumns: [],
    appointmentcolumns: [],
    // editor2: ClassicEditor,
    selectmode: null,
    loader: false,
    editorConfig: {
      required: true,
    },
    editor: "",
    valid: true,
    show: true,
    showsmsarea: false,
    message: "",
    errmsgsign: false,
    errmsgbody: false,
    valid_error: false,
    valid_success: false,
    successmessage: "",
    loading: false,
    isDisabled: false,
    fieldItem: {
      id: 0,
      template_name: "",
      template_subject: "",
      template_body: "",
      template_signature: "",
      can_override: "N",
      template_type_id: "",
    },
    template_slug: "",
    passwordvalue: String,
    mode_items: [],
    item: [],
    orgs: [],
    disabled: false,
    showerrmsg: false,
    email: "",
  }),

  computed: {
    fieldRules() {
      return [(v) => (!!v && !!v.trim()) || this.$t("field_required")];
    },
    fieldRules1() {
      return [(v) => !!v || this.$t("field_required")];
    },
  },

  created() {
    this.fetchLookup();
  },
  mounted() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.template_slug = this.$route.query.slug;
          this.$axios
            .get(
              
                "emailtemplates/" +
                this.$route.query.slug
            )
            .then((res) => {
              this.loader = false;
              this.fieldItem = res.data.email_template;
              this.loading = false;
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              this.loader = false;
              console.log("this error", err);
            });
        }
      },
    },
  },

  methods: {
    onEditorChange(event) {
      if (event.text.length == 1) {
        this.quill_item = true;
      } else {
        this.quill_item = false;
      }
    },
    onEditorChangeSignature(event) {
      if (event.text.length == 1) {
        this.quill_sign = true;
      } else {
        this.quill_sign = false;
      }
    },

    onEditorBlur(event) {
      console.log(event.options);
      if (this.fieldItem.template_body == "") {
        this.quill_item = true;
      }
    },
    onEditorBlurSign(event) {
      console.log(event);
      if (this.fieldItem.template_signature == "") {
        this.quill_sign = true;
      }
    },

    fetchLookup() {
      this.$axios
        .get( "fetchlookup", {
          params: {
            lookup_type: "TEMPLATE_TYPE",
          },
        })
        .then((response) => {
          console.log(response);
          this.mode_items = response.data.lookup_details;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    submit() {
      if (this.fieldItem.template_signature == "") {
        this.quill_sign = true;
      }
      if (this.fieldItem.template_body == "") {
        this.quill_item = true;
      }

      if (this.$refs.form.validate() && this.valid == true) {
        if (
          this.fieldItem.template_body == "" ||
          this.fieldItem.template_signature == ""
        ) {
          return;
        }
        this.isDisabled = true;
        if (this.template_slug == "") {
          this.$axios
            .post(
               "emailtemplates",
              this.fieldItem
            )
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
                  name: "email_template",
                });
              } else if (res.data.status == "E") {
                this.isDisabled = false;
                this.$toast.error(this.array_data);
              } else {
                this.$toast.error(this.array_data);
              }
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              console.log("this error" + err);
            });
        } else {
          this.$axios
            .patch(
              
                "emailtemplates/" +
                this.template_slug,
              this.fieldItem
            )
            .then((res) => {
              this.btnloading = false;
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }
              if (res.data.status == "S") {
                this.$toast.success(this.array_data);
                this.message = res.data.message;
                this.$router.push({
                  name: "email_template",
                });
              } else if (res.data.status == "E") {
                this.isDisabled = false;
                this.$toast.error(this.array_data);
              } else {
                this.isDisabled = false;
                this.$toast.error(this.array_data);
              }
            })
            .catch((err) => {
              this.$toast.error(this.$t("something_went_wrong"));
              this.isDisabled = false;
              console.log("this error" + err);
            });
        }
      }
    },
    cancel() {
      this.$router.push({
        name: "email_template",
      });
    },
  },
};
</script>
<style lang="css">
/* @import "~quill/dist/quill.core.css";
  @import "~quill/dist/quill.snow.css";
  @import "~quill/dist/quill.bubble.css"; */

#quill_item {
  border: 1px solid #b00020;
}
#quill_item_border {
  border: 1px solid #d1d5db;
}
#quill_item1 {
  border: 1px solid #b00020;
}
#quill_item_border1 {
  border: 1px solid #d1d5db;
}
.ql-tooltip {
  display: none !important;
}
.hide_quill_input :deep(input)  {
  display: none !important;
}
.required_item {
  position: absolute !important;
}
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
  