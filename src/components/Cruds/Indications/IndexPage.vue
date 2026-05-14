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
            :heading="$t('indications')"
            :google_icon="google_icon"
          ></page-title>
          <div class="add_new_button">
            <v-tooltip :text="this.$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link
                  :to="{ name: 'indication_amend' }"
                  style="color: white"
                >
                  <v-btn size="small" class="mb-2 btn-filled" v-bind="props">{{
                    $t("add_new")
                  }}</v-btn>
                </router-link>
              </template>
            </v-tooltip>
          </div>
        </div>
        <!-- Search Bar -->
        <div class="search-wrapper">
          <v-text-field
            density="comfortable"
            variant="solo"
            flat
            placeholder="Search here..."
            hide-details
            append-inner-icon="mdi-magnify"
            v-model="search"
            class="search-field"
          ></v-text-field>
        </div>
        <!-- Data Table Card -->
        <v-card class="table-card pa-4">
          <v-data-table
            class="table-card"
            :headers="headers"
            :items="indications"
            :search="search"
            :loading="initval"
            v-bind:no-data-text="$t('no_data_available')"
            :items-per-page-text="$t('rows_per_page')"
            v-bind:style="$route.params.lang == 'ar' ? 'direction:rtl' : ''"
          >
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.description }}</td>
                <td>{{ props.item.sequence }}</td>
                <td>
                  <v-btn
                    v-if="
                      props.item.status !== null &&
                      props.item.status !== undefined
                    "
                    @click="updateIndicationStatus(props.item.id)"
                    class="hover_shine btn mr-2"
                    :disabled="isDisabled"
                    size="small"
                    :color="props.item.status === 1 ? 'success' : 'warning'"
                  >
                    <span class="spanactivesize">
                      {{
                        props.item.status === 1 ? $t("active") : $t("inactive")
                      }}
                    </span>
                  </v-btn>
                </td>
                <td class="text-center px-0">
                  <router-link
                    small
                    class="mr-2"
                    :to="{
                      name: 'indication_amend',
                      query: { slug: props.item.slug },
                    }"
                  >
                    <v-tooltip :text="this.$t('edit')" location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-icon class="mr-2 edit_btn icon_size" v-bind="props"
                          >mdi-pencil-outline</v-icon
                        >
                      </template>
                      <span>{{ $t("edit") }}</span>
                    </v-tooltip>
                  </router-link>
                  <!-- <v-icon
                    color="error"
                    @click="deleteIndications(props.item.id)"
                  >
                    mdi-trash-can-outline
                  </v-icon> -->
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
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: { PageTitle },
  data: () => ({
    loader: false,
    search: "",
    dialog: false,
    initval: true,
    google_icon: {
      icon_name: "microbiology",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    indications: [],
    stats: [
      { label: "Total PAFs", value: 58 },
      { label: "Total patients", value: 9 },
      { label: "Overdue PAF (Action Required)", value: 7 },
      { label: "Rejected PAF", value: 0 },
    ],
    sel_lang: "",
    dialogMessage: "",
    dialogTitle: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      return [
        {
          title: this.$t("name"),
          key: "name",
        },
        {
          title: this.$t("description"),
          key: "description",
        },
        {
          title: this.$t("sequence"),
          key: "sequence",
        },
        {
          title: this.$t("status"),
          key: "status",
        },
        {
          title: this.$t("action"),
          align: "center",
          key: "class_name",
        },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {},
  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.initval = true;
      this.$axios
        .get("fetch_all_indications")
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.indications = res.data.indications;
            this.initval = false;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
            this.initval = false;
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
          this.initval = false;
        });
    },

    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    async deleteIndications(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this indication ?",
      );

      if (!result) return;
      this.$axios
        .delete("indication/" + id)
        .then((res) => {
          const msg = Array.isArray(res.data.message)
            ? res.data.message.toString()
            : res.data.message;

          res.data.status === "E"
            ? this.$toast.error(msg)
            : this.$toast.success(msg);

          this.initialize();
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        });
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async updateIndicationStatus(status_id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to update this indication status ?",
      );

      if (!result) return;
      this.loader = true;
      this.$axios
        .post("update_indication_status", {
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
            this.loader = false;
            this.initialize();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
            this.loader = false;
          } else {
            this.$toast.error(this.array_data);
            this.initialize();
            this.loader = false;
          }
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log("this error" + err);
          this.loader = false;
        });
    },
  },
};
</script>
<style scoped></style>
