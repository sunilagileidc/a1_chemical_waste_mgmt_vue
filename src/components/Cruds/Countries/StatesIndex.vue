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
      <page-title
        class="col-md-3"
        :heading="$t('states')"
        :google_icon="google_icon"
      ></page-title>
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
      <div class="add_new_button">
        <v-tooltip :text="$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link
              :to="{
                name: 'states_amend',
                query: {
                  countryslug: countryname,
                },
              }"
              style="color: white"
            >
              <v-btn size="small" class="mb-2 create-btn" v-bind="props">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
        <v-tooltip :text="$t('back')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link
              :to="{
                name: 'countries',
              }"
              style="color: white"
            >
              <v-btn
                size="small"
                class="mb-2 ml-2"
                color="cancel"
                v-bind="props"
                >{{ $t("back") }}</v-btn
              >
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="states"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>{{ props.item.name }}</td>
          <td class="text-center px-0">
            <router-link
              :to="{
                name: 'states_amend',
                query: {
                  slug: props.item.slug,
                },
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
            <router-link
              small
              class="mr-2"
              :to="{
                name: 'cities',
                query: {
                  countryslug: countryname,
                  stateslug: props.item.slug,
                },
              }"
            >
              <v-tooltip :text="$t('city')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="mr-2 settings_icon icon_size"
                    v-on="on"
                    >mdi-sitemap</v-icon
                  >
                </template>
                <span>{{ $t("city") }}</span>
              </v-tooltip>
            </router-link>
            <span @click="deletestate(props.item.id)">
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
    states: [],
    selected_country_details: [],
    headers: [
      {
        title: "Name",
        align: "left",
        sortable: true,
        key: "name",
      },
      {
        title: "Actions",
        key: "actions",
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
    message: "",
    countryname: "",
    initval: true,
    dialogMessage: "",
    dialogTitle: "",
  }),
  watch: {
    "$route.query.countryslug": {
      immediate: true,
      handler() {
        if (this.$route.query.countryslug) {
          this.countryname = this.$route.query.countryslug;
        }
      },
    },
  },
  mounted() {
    this.fetchstates();
  },
  methods: {
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    fetchstates() {
      this.initval = true;
      this.$axios
        .get("fetch_states?countryname=" + this.countryname)
        .then((res) => {
          this.initval = false;
          // this.$toast.success(this.array_data);
          this.states = res.data.states;
          this.selected_country_details = res.data.countries;
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log(" error" + err);
        });
    },

    async deletestate(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this state ?"
      );
      if (!result) return;

      this.$axios
        .post("delete_states/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchstates();
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
