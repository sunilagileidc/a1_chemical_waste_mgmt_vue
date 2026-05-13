<template>
  <div>
    <v-row v-if="response_data">
      <v-col md="12">
        <v-alert
          icon="mdi-message-alert"
          class="erroralert"
          v-model="fail_alert"
          variant="tonal"
          closable
          close-label="Close Alert"
          color="error"
          :title="$t('error_message')"
        >
          {{ fail_message }}
        </v-alert>
        <v-alert
          icon="mdi-check-bold"
          class="erroralert"
          v-model="success_alert"
          variant="tonal"
          closable
          close-label="Close Alert"
          color="success"
          :title="$t('uploaded_succesfully')"
        >
          {{ success_message }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="9" class="align-self-center pl-6">
        <div class="fileinputdiv" style="padding-top: 13px">
          <input
            type="file"
            @change="handleFileUpload"
            id="fileselector"
            ref="file"
            accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
        </div>
        <div style="position: relative">
          <v-btn v-if="filename == ''" block class="py-5" @click="selectFile">{{
            $t("click_here_to_file_upload")
          }}</v-btn>
          <v-btn
            v-else
            disabled="true"
            block
            class="py-5"
            style="background: white !important"
            >{{ filename }}
          </v-btn>
          <v-tooltip :text="this.$t('cancel')" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-if="filename != ''"
                @click="clearFile"
                class="ma-1 closebtn"
                color="error"
                :disabled="btn_loader"
                size="xx-small"
                v-bind="props"
                icon="mdi-close"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </v-col>
      <v-col md="1">
        <a :href="excelldownloadtemplate" download="countrystatecity.xlsx">
          <v-tooltip text="Download Template" location="bottom">
            <template v-slot:activator="{ props }">
              <img
                style="height: 70px"
                v-bind="props"
                src="../../../public/img/xlsxicon.png"
                alt
              />
            </template>
          </v-tooltip>
        </a>
      </v-col>
      <v-col md="2" class="align-self-center">
        <v-btn
          color="primary"
          :disabled="btn_loader"
          v-if="filename"
          @click="uploadexcell"
          ><v-progress-circular
            class="mr-2"
            v-if="btn_loader"
            indeterminate
            :size="24"
          ></v-progress-circular
          >{{ $t("upload") }}</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
export default {
  props: ["response_data"],
  data() {
    return {
      tableData: [],
      filename: "",
      count_row: 0,
      excel_json: [],
      success_message: "",
      fail_message: "",
      success_alert: false,
      fail_alert: false,
      btn_loader: false,
    };
  },
  computed: {
    excelldownloadtemplate() {
      return import.meta.env.VITE_FILE_DOWNLOAD + "/countrystatecity.xlsx";
    },
  },
  watch: {
    response_data: {
      immediate: true,
      handler() {
        this.btn_loader = false;
        this.fail_alert = false;
        this.success_alert = false;
        if (this.response_data == "S") {
          this.success_message = this.count_row - 1 + this.$t("rows_inserted");
          this.filename = "";
          this.$refs.file.value = null;
          this.success_alert = false;
          this.fail_alert = false;
          this.fail_message = "";
          this.success_alert = true;
          this.fail_alert = false;
          this.tableData = [];
        } else {
          this.success_alert = false;
          this.fail_alert = true;
          this.success_message = "";
          this.fail_message = this.$t("pls_fill_all_fields_in_template");
        }
      },
    },
  },
  methods: {
    selectFile() {
      document.getElementById("fileselector").click();
    },
    clearFile() {
      this.fail_message = "";
      this.success_message = "";
      this.count_row = 0;
      this.filename = "";
      this.tableData = [];
      this.$refs.file.value = null;
      this.success_alert = false;
      this.fail_alert = false;
    },
    handleFileUpload(event) {
      this.count_row = 0;
      this.fail_message = "";
      this.success_message = "";
      this.success_alert = false;
      this.fail_alert = false;
      const file = event.target.files[0];
      this.filename = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        this.tableData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      };
      reader.readAsArrayBuffer(file);
    },
    uploadexcell() {
      this.tableData.forEach((element) => {
        if (element) {
          this.count_row = this.count_row + 1;
        }
      });
      this.btn_loader = true;
      this.$emit("ExcellRecieved", this.tableData);
    },
  },
};
</script>
<style scoped>
.fileinputdiv {
  display: none;
}

.closebtn {
  position: absolute;
  right: 5px;
  top: 4px;
  font-size: 16px;
}

.erroralert :deep( i) {
  margin-top: 5px;
}
</style>
