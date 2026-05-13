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
        :heading="$t('suburb')"
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
                name: 'cities_amend',
                query: {
                  countryslug: countryname,
                  statesslug: statename,
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
                name: 'states',
                query: {
                  countryslug: countryname,
                },
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
      :items="cities"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>{{ props.item.name }}</td>
          <td class="text-center px-0">
            <router-link
              :to="{
                name: 'cities_amend',
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
            <span @click="deletecity(props.item.id)">
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
    cities: [],
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
    statename: "",
    initval: true,
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
    "$route.query.stateslug": {
      immediate: true,
      handler() {
        if (this.$route.query.stateslug) {
          this.statename = this.$route.query.stateslug;
        }
      },
    },
  },
  mounted() {
    this.fetchcities();
  },
  methods: {
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },
    fetchcities() {
      this.initval = true;
      this.$axios
        .get(
          "fetch_cities?countryname=" +
            this.countryname +
            "&statename=" +
            this.statename
        )
        .then((res) => {
          this.initval = false;
          // this.$toast.success(this.array_data);
          this.cities = res.data.cities;
          this.selected_country_details = res.data.countries;
          this.selected_state_details = res.data.states;
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log(" error" + err);
        });
    },
    async deletecity(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this city ?"
      );
      if (!result) return;

      this.$axios
        .post("delete_cities/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchcities();
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
