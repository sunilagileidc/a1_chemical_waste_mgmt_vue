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
            heading="Connected users"
            :google_icon="google_icon"
          ></page-title>
          <div class="add_new_button" v-if="tab == 'Outpatient'">
            <v-tooltip :text="this.$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link
                  :to="{
                    name: 'connected-pharmacy-amend',
                    query: { tabname: tab },
                  }"
                  style="color: white"
                >
                  <v-btn size="small" class="mb-2 btn-filled" v-bind="props">
                    Add {{ tab }}
                  </v-btn>
                </router-link>
              </template>
            </v-tooltip>
          </div>
          <div class="add_new_button" v-else>
            <v-tooltip :text="this.$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link
                  :to="{
                    name: 'connected-homecare-amend',
                    query: { tabname: tab },
                  }"
                  style="color: white"
                >
                  <v-btn size="small" class="mb-2 btn-filled" v-bind="props">
                    Add {{ tab }}
                  </v-btn>
                </router-link>
              </template>
            </v-tooltip>
          </div>
        </div>
        <!-- Stats section -->
        <!-- <stats-page :stats="stats" /> -->
        <!-- Stats section -->
        <!-- Tabs -->
        <v-tabs v-model="tab" background-color="transparent" class="mb-2">
          <v-tab value="Outpatient" @click="getConnectedOutpatient()"
            >Outpatient</v-tab
          >
          <v-tab value="Homecare" @click="getConnectedHomecare()"
            >Homecare</v-tab
          >
        </v-tabs>
        <!-- Search Bar -->
        <div class="search-wrapper">
          <v-text-field
            v-model="search"
            placeholder="Search here..."
            append-inner-icon="mdi-magnify"
            variant="solo"
            flat
            hide-details
            density="comfortable"
            class="search-field"
          ></v-text-field>
        </div>
        <!-- Data Table Card -->

        <!-- Data Table Card -->
        <v-card class="table-card pa-4">
          <!-- Outpatient Table -->
          <v-data-table
            v-if="tab === 'Outpatient'"
            class="table-card"
            :headers="headers"
            :items="connected_outpatient"
            :search="search"
            :loading="initval"
            v-bind:no-data-text="$t('no_data_available')"
            :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
            :style="$route.params.lang == 'ar' ? 'direction:rtl' : ''"
          >
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>
                  <span v-if="props.item.name">{{ props.item.name }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.address">{{
                    props.item.address
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.post_code">
                    {{ props.item.post_code }}
                  </span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td class="px-0 text-center">
                  <span @click="updateConPharmacyStatus(props.item)">
                    <v-btn
                      v-bind="props"
                      class="delete_btn icon_size hover"
                      dense
                      :color="[props.item.status == 1 ? 'success' : 'warning']"
                    >
                      <span
                        v-if="props.item.status == 1"
                        class="spanactivesize"
                        >{{ $t("active") }}</span
                      >
                      <span v-else class="spanactivesize">{{
                        $t("inactive")
                      }}</span>
                    </v-btn>
                  </span>
                </td>
              </tr>
            </template>
          </v-data-table>

          <!-- your row template -->
          <!-- {{ connected_homecare }} -->
          <!-- Homecare Table -->
          <v-data-table
            v-else
            class="table-card"
            :headers="Homecareheaders"
            :items="connected_homecare"
            :search="search"
            :loading="initval"
            v-bind:no-data-text="$t('no_data_available')"
            :footer-props="{ 'items-per-page-text': $t('rows_per_page') }"
            :style="$route.params.lang == 'ar' ? 'direction:rtl' : ''"
          >
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>
                  <span v-if="props.item.name">{{ props.item.name }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.address">{{
                    props.item.address
                  }}</span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td>
                  <span v-if="props.item.post_code">
                    {{ props.item.post_code }}
                  </span>
                  <span v-else>{{ $t("not_appllicable") }}</span>
                </td>
                <td class="px-0 text-center">
                  <span @click="updateConPharmacyStatus(props.item)">
                    <v-btn
                      v-bind="props"
                      class="delete_btn icon_size hover"
                      dense
                      :color="[props.item.status == 1 ? 'success' : 'warning']"
                    >
                      <span
                        v-if="props.item.status == 1"
                        class="spanactivesize"
                        >{{ $t("active") }}</span
                      >
                      <span v-else class="spanactivesize">{{
                        $t("inactive")
                      }}</span>
                    </v-btn>
                  </span>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    showConfirmDialog: false,
    search: "",
    dialog: false,
    menu: [],
    initval: true,
    message: "",
    google_icon: {
      icon_name: "group",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    dialogMessage: "",
    dialogTitle: "",
    tab: 0,
    connected_outpatient: [],
    connected_homecare: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: "Outpatient Name",
          align: "left",
          sortable: true,
          key: "name",
        },
        {
          title: "Address",
          key: "address",
        },
        {
          title: "Postcode",
          key: "post_code",
        },
        // {
        //   title: "Reg Valid Untill",
        //   key: "valid",
        // },
        {
          title: this.$t("status"),
          key: "name",
          align: "center",
          sortable: false,
        },
      ];
    },
    Homecareheaders() {
      return [
        {
          title: "Homecare Name",
          align: "left",
          sortable: true,
          key: "title",
        },
        {
          title: "Address",
          key: "address",
        },
        {
          title: "Postcode",
          key: "post_code",
        },
        {
          title: this.$t("status"),
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
    this.user = JSON.parse(localStorage.getItem("user_data"));
    this.getConnectedOutpatient();
    this.getConnectedHomecare();
  },
  mounted() {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab;
    }
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },

  methods: {
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    // async deleteItem(deleteID) {
    //   const result = await this.showConfirmation(
    //     "Confirm",
    //     "Are you sure you want to delete this menu ?"
    //   );

    //   if (!result) return;
    //   this.initval = true;
    //   this.$axios
    //     .delete("menu/" + deleteID)
    //     .then((res) => {
    //       if (Array.isArray(res.data.message)) {
    //         this.array_data = res.data.message.toString();
    //       } else {
    //         this.array_data = res.data.message;
    //       }
    //       if (res.data.status == "E") {
    //         this.initval = false;
    //         this.$toast.error(this.array_data);
    //         this.getConnectedOutpatient();
    //       } else {
    //         this.initval = false;
    //         this.$toast.success(this.array_data);
    //         this.getConnectedOutpatient();
    //       }
    //     })
    //     .catch((err) => {
    //       this.initval = false;
    //       this.$toast.error(this.$t("something_went_wrong"));
    //       console.log(err);
    //     });
    // },
    getConnectedOutpatient() {
      this.initval = true;
      this.$axios
        .get("/connected_outpatient", {
          params: {
            user_id: this.user.id,
            institution_id: this.user.pharmacist.institution_id,
          },
        })
        .then((res) => {
          this.connected_outpatient = res.data.con_pharmacies;

          this.initval = false;
          this.loader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.loader = false;
          this.initval = false;
        });
    },
    getConnectedHomecare() {
      this.initval = true;
      this.$axios
        .get("/connected_homecare", {
          params: {
            user_id: this.user.id,
            institution_id: this.user.pharmacist.institution_id,
          },
        })
        .then((res) => {
          this.connected_homecare = res.data.con_homecares;

          this.initval = false;
          this.loader = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
          this.loader = false;
          this.initval = false;
        });
    },
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    async updateConPharmacyStatus(status_id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update this Connected Pharmacy status ?",
      );

      if (!result) return;
      this.loader = true;
      this.$axios
        .post("update_connected_pharmacy", {
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
            this.getConnectedOutpatient();
            this.getConnectedHomecare();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.getConnectedOutpatient();
            this.getConnectedHomecare();
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
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
  },
};
</script>
<style scoped></style>
