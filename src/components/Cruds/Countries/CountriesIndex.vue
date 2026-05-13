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
          :heading="$t('countries')"
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
        <div class="my-3 mr-2 add_new_button">
          <v-tooltip :text="$t('add_new')" location="bottom">
            <template v-slot:activator="{ props }">
              <router-link :to="{ name: 'countries_amend' }">
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
      :items="countries"
      :search="search"
      :loading="initval"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.mobile_code }}</td>
          <td>{{ props.item.country_code }}</td>
          <td class="text-center">
            <v-btn
              class="hover_shine btn mr-2"
              :disabled="isDisabled"
              @click="statusUpdate(props.item.id)"
              size="small"
              v-bind:color="[
                props.item.is_whitelisted == 1 ? 'success' : 'warning',
              ]"
            >
              <span
                v-if="props.item.is_whitelisted == 1"
                class="spanactivesize"
                >{{ $t("whitelisted") }}</span
              >
              <span
                v-if="props.item.is_whitelisted == 0"
                class="spanactivesize"
                >{{ $t("blacklisted") }}</span
              >
            </v-btn>
          </td>
          <td class="text-center px-0">
            <router-link
              :to="{
                name: 'countries_amend',
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
            <router-link
              small
              class="mr-2"
              :to="{
                name: 'states',
                query: {
                  countryslug: props.item.slug,
                },
              }"
            >
              <v-tooltip :text="$t('states')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="mr-2 settings_icon icon_size"
                    v-on="on"
                    >mdi-sitemap</v-icon
                  >
                </template>
                <span>{{ $t("states") }}</span>
              </v-tooltip>
            </router-link>
            <span @click="deletecountry(props.item.id)">
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
    countries: [],
    isDisabled: false,
    google_icon: {
      icon_name: "globe_asia",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    message: "",
    initval: true,
  }),
  mounted() {
    this.fetchcountries();
  },
  computed: {
    headers() {
      return [
        {
          title: this.$t("name"),
          align: "left",
          sortable: true,
          key: "name",
        },
        {
          title: this.$t("mobile_code"),
          align: "left",
          sortable: true,
          key: "mobile_code",
        },
        {
          title: this.$t("country_code"),
          align: "left",
          sortable: true,
          key: "country_code",
        },
        {
          title: this.$t("is_whitelisted"),
          align: "center",
          sortable: true,
          key: "is_whitelisted",
        },
        {
          title: this.$t("actions"),
          key: "actions",
          align: "center",
          sortable: false,
        },
      ];
    },
  },
  methods: {
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },

    fetchcountries() {
      this.initval = true;
      this.$axios
        .get("fetch_countries")
        .then((res) => {
          this.initval = false;

          // this.$toast.success(this.array_data);
          this.countries = res.data.countries;
        })
        .catch((err) => {
          this.$toast.error(this.array_data);
          console.log(" error" + err);
        });
    },

    async deletecountry(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this country ?"
      );
      if (!result) return;

      this.$axios
        .post("delete_countries/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchcountries();
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
        "Are you sure you want to update the status of this country ?"
      );
      if (!result) return;

      this.$axios
        .post("update_country_status", {
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
            this.fetchcountries();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          }
        })
        .catch((err) => {
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
