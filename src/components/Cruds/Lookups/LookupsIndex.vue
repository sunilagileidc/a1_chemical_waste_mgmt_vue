<template>
  <div class="main-20">
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>
    <content-loader v-if="loader"></content-loader>
    <div
      flat
      color="white"
      class="row my-3 align-items-center component_app_bar"
    >
      <div class="col-md-4">
        <page-title
          :heading="$t('lookups')"
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
              <router-link :to="{ name: 'lookups_amend' }" style="color: white">
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
      :items="lookup"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>
            <div class="text-truncate" style="max-width: 160px">
              {{ props.item.shortname }}
            </div>
          </td>
          <td>
            <div class="text-truncate" style="max-width: 160px">
              {{ props.item.longname }}
            </div>
          </td>
          <td>
            <v-btn
              class="hover_shine btn mr-2"
              :disabled="isDisabled"
              @click="updateLookupsStatus(props.item.id)"
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
              small
              :to="{
                name: 'lookups_amend',
                query: { slug: props.item.slug },
              }"
            >
              <v-tooltip :text="$t('edit')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    small
                    class="mr-2 edit_btn icon_size"
                    v-on="on"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
              </v-tooltip>
            </router-link>
            <router-link
              small
              class="mr-2"
              :to="{
                name: 'child_lookup',
                query: {
                  slug: props.item.slug,
                  parentname: props.item.shortname,
                },
              }"
            >
              <v-tooltip :text="$t('child_look_ups')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="mr-2 settings_icon icon_size"
                    v-on="on"
                    >mdi-sitemap</v-icon
                  >
                </template>
                <span>{{ $t("child_look_ups") }}</span>
              </v-tooltip>
            </router-link>
            <span @click="deleteItem(props.item.id)">
              <v-tooltip :text="$t('delete')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="delete_btn icon_size"
                    v-on="on"
                    small
                    type="button"
                    >mdi-trash-can-outline</v-icon
                  >
                </template>
                <span>{{ $t("delete") }}</span>
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
    lookup: [],
    loader: false,
    isDisabled: false,
    headers: [
      {
        title: "Shortname",
        align: "left",
        sortable: true,
        key: "shortname",
      },
      {
        title: "Longname",
        align: "left",
        sortable: false,
        key: "longname",
      },
      {
        title: "Status",
        align: "left",
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
    initval: false,
    message: "",
  }),
  mounted() {
    this.initialize();
  },
  methods: {
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    async updateLookupsStatus(status_id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update this lookup status ?"
      );

      if (!result) return;
      this.loader = true;
      this.$axios
        .post("update_lookups_status", {
          id: status_id,
        })
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.initialize();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.initialize();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
        });
      this.loader = false;
    },
    async deleteItem(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this lookup ?"
      );

      if (!result) return;
      this.loader = true;
      this.$axios
        .post("delete_lookup/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.success(this.array_data);
            this.initialize();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("error", err);
        });
      this.loader = false;
    },

    initialize() {
      this.initval = true;
      this.$axios
        .get("lookups")
        .then((res) => {
          this.initval = false;
          this.lookup = res.data.lookups;
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.initval = false;
            this.lookup = res.data.lookups;
          } else if (res.data.status == "E") {
            this.initval = false;
            this.$toast.error(this.array_data);
          } else {
            this.initval = false;
            this.$toast.error(this.array_data);
            console.log("error message");
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("error", err);
          this.initval = false;
        });
      this.loader = false;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    // PDF download
    pdfgen: function (lookups) {
      var pdfMake = require("pdfmake/build/pdfmake.js");
      if (pdfMake.vfs == undefined) {
        var pdfFonts = require("pdfmake/build/vfs_fonts.js");
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
      }
      var docDefinition = {
        content: [
          { text: "Lookups Report", style: "header" },
          this._table(lookups, ["shortname", "longname", "seq"]),
        ],
      };
      pdfMake.createPdf(docDefinition).download("Lookups.pdf");
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
</style>
