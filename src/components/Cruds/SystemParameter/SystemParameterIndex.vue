<template>
  <div class="main-20">
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>

    <div
      flat
      color="white"
      class="row my-3 align-items-center component_app_bar"
    >
      <div class="col-md-4">
        <page-title
          :heading="$t('sytem_parameter')"
          :google_icon="google_icon"
        ></page-title>
      </div>
      <div class="col-md-4">
        <v-tooltip :text="$t('search')" location="bottom">
          <template v-slot:activator="{ props }">
            <v-text-field
              rounded
              density="compact"
              variant="outlined"
              elevation="24"
              v-bind="props"
              v-model="search"
              append-icon="search"
              v-bind:label="$t('search')"
              hide-details
              class="srch_bar"
            ></v-text-field>
          </template>
        </v-tooltip>
      </div>
      <div class="col-md-4 d-flex justify-content-end">
        <div class="my-3 mr-2">
          <v-tooltip :text="$t('add_new')" location="bottom">
            <template v-slot:activator="{ props }">
              <router-link
                :to="{ name: 'system_parameter_amend' }"
                style="color: white"
              >
                <v-btn size="small" class="mb-2 create-btn" v-bind="props">{{
                  $t("add_new")
                }}</v-btn>
              </router-link>
            </template>
          </v-tooltip>
        </div>
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="systemparameter"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>{{ props.item.parameter_name }}</td>
          <td class="param-value">
            {{ props.item.parameter_value }}
          </td>
          <td class="desc_div_overflow">{{ props.item.description }}</td>
          <td class="text-center">
            <v-btn
              class="hover_shine btn mr-2"
              :disabled="isDisabled"
              @click="statusUpdate(props.item.id)"
              size="small"
              v-bind:color="[props.item.status == 1 ? 'success' : 'warning']"
            >
              <span v-if="props.item.status == 1" class="spanactivesize">{{
                $t("active")
              }}</span>
              <span v-if="props.item.status == 0" class="spanactivesize">{{
                $t("inactive")
              }}</span>
            </v-btn>
          </td>

          <td class="text-center px-0">
            <router-link
              :to="{
                name: 'system_parameter_amend',
                query: { slug: props.item.slug },
              }"
            >
              <v-tooltip :text="$t('edit')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-on="on"
                    small
                    class="mr-2 edit_btn icon_size"
                    v-bind="props"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
              </v-tooltip>
            </router-link>
            <span @click="deletesystemparameter(props.item.id)">
              <v-tooltip :text="$t('delete')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    class="delete_btn icon_size"
                    v-bind="props"
                    v-on="on"
                    small
                    type="button"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
              </v-tooltip>
            </span>
          </td>
        </tr>
      </template>
    </v-data-table>
    
  </div>
</template>

<script>
export default {
  data: () => ({
    dialogMessage: "",
    dialogTitle: "",
    systemparameter: [],
    showdeleteDialog: false,
    showStatusDialog: false,
    delete_id: null,
    status_id: null,
    isDisabled: false,
    initval: false,
    headers: [
      {
        title: "Name",
        align: "left",
        sortable: true,
        key: "parameter_name",
      },
      {
        title: "Value",
        align: "left",
        sortable: false,
        key: "parameter_value",
      },
      {
        title: "Description",
        align: "left",
        sortable: false,
        key: "description",
      },
      {
        title: "Status",
        align: "center",
        sortable: false,
        key: "status",
      },
      {
        title: "Actions",
        key: "name",
        align: "center",
        sortable: false,
      },
    ],
    google_icon: {
      icon_name: "settings_suggest",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid: false,
    message: "",
  
  }),
  mounted() {
    this.fetchSystemParameters();
  },
  methods: {
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    fetchSystemParameters() {
      this.initval = true;
      this.$axios
        .get("getsystem_params")
        .then((res) => {
          this.initval = false;

          // this.$toast.success(this.array_data);
          this.systemparameter = res.data.systemparameters;
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log(" error" + err);
        });
    },

    async deletesystemparameter(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this System Parameter?"
      );

      if (!result) return;
      this.$axios
        .post("delete_system_params/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchSystemParameters();
            localStorage.removeItem("appimage");
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
    },

    async statusUpdate(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update this System Parameter status ?"
      );

      if (!result) return;
      this.$axios
        .post("update_system_param_status", {
          id: id,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchSystemParameters();
            this.emitter.emit("app_image_update");
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          }
        })
        .catch((err) => {
          console.log("this error" + err);
        });
    },

    // PDF download
    pdfgen: function (systemparameter) {
      var pdfMake = require("pdfmake/build/pdfmake.js");
      if (pdfMake.vfs == undefined) {
        var pdfFonts = require("pdfmake/build/vfs_fonts.js");
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
      }
      var docDefinition = {
        content: [
          { text: "System Parameter Report", style: "header" },
          this._table(systemparameter, [
            "parameter_name",
            "parameter_value",
            "description",
            "status",
          ]),
        ],
      };

      pdfMake.createPdf(docDefinition).download("System Parameter.pdf");
    },

    _table(data, cols) {
      return {
        table: {
          headerRows: 1,
          body: this._buildTableBody(data, cols),
        },
      };
    },

    _buildTableBody(data, cols) {
      let body = [];
      body.push(cols);
      data.forEach(function (row) {
        // reg obj doesn't have forEach
        let dataRow = [];
        cols.forEach(function (column) {
          dataRow.push(row[column].toString());
        });
        body.push(dataRow);
      });

      return body;
    },
  },
};
</script>
<style scoped>
.v-text-field :deep(.v-input__slot) {
  min-height: 38px !important;
  width: 353px;
}
.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.v-btn:not(.v-btn--round).v-size--small {
  min-width: 90px !important;
}
.desc_div_overflow {
  white-space: nowrap;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* .desc_div_overflow:hover {
  white-space:break-spaces;
  max-width: 300px; 
  overflow-y: scroll;
  text-overflow: inherit;
} */
</style>
