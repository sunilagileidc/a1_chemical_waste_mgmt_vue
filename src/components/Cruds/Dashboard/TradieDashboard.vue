<template>
  <content-loader v-if="loader"></content-loader>
  <v-row>
    <v-col cols="12" md="8">
      <v-card class="rounded-lg licence_list" min-height="465">
        <v-card-title class="text-h6 text-md-h6 text-lg-h6 py-5">{{
          $t("tradiesafe_license")
        }}</v-card-title>
        <v-row>
          <v-col cols="12" md="8" class="p-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-text-field
                  dense
                  density="compact"
                  v-on="on"
                  variant="outlined"
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  class="srch_bar"
                  small
                  hide-details
                ></v-text-field>
              </template>
              <span>{{ $t("search") }}</span>
            </v-tooltip>
          </v-col></v-row
        >
        <v-data-table
          :headers="headers"
          :items="user_details.upload_data"
          :search="search"
          :loading="initval"
          v-bind:no-data-text="$t('no_data_available')"
          :footer-props="{
            'items-per-page-text': $t('rows_per_page'),
          }"
        >
          <template v-slot:item="props">
            <tr class="vdatatable_tbody">
              <td>{{ props.item.selectable.doc_name }}</td>
              <td>
                <span v-if="props.item.selectable.doc_date">
                  {{ formatDate(props.item.selectable.doc_date) }}
                </span>
                <span v-else>{{ $t("not_applicable") }}</span>
              </td>
              <td>
                <a
                  :href="envImagePath + props.item.selectable.doc_url"
                  download
                  target="_blank"
                >
                  <v-tooltip
                    :text="this.$t('download_license')"
                    location="bottom"
                  >
                    <template v-slot:activator="{ props }">
                      <v-icon
                        plain
                        v-bind="props"
                        dense
                        class="mr-2 edit_btn icon_size"
                        >mdi-download</v-icon
                      >
                    </template>
                  </v-tooltip>
                </a>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="mb-5 rounded-lg" v-if="user_details.header_answers" height>
        <div
          class="mb-4"
          v-if="user_details.header_answers.status == 'Approved'"
        >
          <v-layout
            v-if="user_details.header_answers.status == 'Approved'"
            row
            class="mt-5 justify-content-center align-items-center"
          >
            <div class="text-center">
              <v-tooltip :text="$t('approved')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    size="70"
                    color="green"
                    plain
                    v-bind="props"
                    dense
                    class="mr-2 edit_btn icon_size px-2 verified_icon"
                    >mdi mdi-check-circle</v-icon
                  >
                </template>
              </v-tooltip>
              <h5 class="text-center font-weight-bold mt-2">
                {{ $t("you_approved") }}
              </h5>
            </div>
          </v-layout>
        </div>
        <div class="mb-4" v-else-if="user_details.header_answers.status == 'Rejected' ||
                  user_details.header_answers.status == 'Completed'">
          <v-layout row class="mt-5 justify-content-center align-items-center">
            <div class="text-center">
              <v-tooltip :text="$t('not_approved')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    size="70"
                    color="red-accent-2"
                    plain
                    v-bind="props"
                    dense
                    class="mr-2 edit_btn icon_size px-2 rejected_icon"
                    >mdi mdi-close-circle</v-icon
                  >
                </template>
              </v-tooltip>
              <h5 class="text-center font-weight-bold mt-2">
                {{ $t("you_not_approved") }}
              </h5>
            </div>
          </v-layout>
        </div>
        <div class="mb-4" v-else>
          <v-layout row class="mt-5 justify-content-center align-items-center">
            <div
              class="text-center">
              <v-tooltip :text="$t('awaiting')" location="bottom">
                <template v-slot:activator="{ props }">
                    <i class="fa fa-clock-o fa-6 awaiting_image_size"  
                    color="red-accent-2" aria-hidden="true"  v-bind="props"></i>
                </template>
              </v-tooltip>
              <h5 class="text-center font-weight-bold mt-2">
                {{ $t("form_not_submitted") }}
              </h5>
            </div>
          </v-layout>
        </div>
      </v-card>
      <v-card class="rounded-lg">
        <div class="row mt-3 align-items-center">
          <div class="col-4 col-md-4 text-end">
            <v-avatar
              v-if="user_details.image_url != null"
              size="60"
              :image="envImagePath + user_details.image_url"
            ></v-avatar>
            <v-avatar v-else size="60">
              <v-img
                :src="require('@/assets/images/avatars/default.png')"
              ></v-img>
            </v-avatar>
          </div>

          <div class="col-8 col-md-8 text-start name_header">
            <div class="text-start">
              <h5>
                {{ user_details.salutation }}&nbsp;{{
                  user_details.name
                }}&nbsp;{{ user_details.lastname }}
              </h5>
            </div>
            <!-- <v-chip class="ma-2" color="green" text-color="white">
                Verified
            </v-chip>-->
            <!-- <router-link to="" class> -->

            <!-- </router-link> -->
          </div>
        </div>
        <v-divider class="mx-8"></v-divider>
        <div class="d-flex px-8 pb-2">
          <div class="left-details">{{ $t("profession") }}</div>
          <div class="field_label" v-if="user_details.profession">
            {{ user_details.profession }}
          </div>
          <div v-else>{{ $t("not_applicable") }}</div>
        </div>
        <div class="d-flex px-8 pb-2">
          <div class="left-details">{{ $t("phone") }}</div>

          <div class="field_label" v-if="user_details.phone">
            {{ user_details.phone }}
          </div>
          <div v-else>{{ $t("not_applicable") }}</div>
        </div>
        <div class="d-flex px-8 pb-2">
          <div class="left-details">{{ $t("email") }}</div>

          <div class="field_label" v-if="user_details.email">
            {{ user_details.email }}
          </div>
          <div v-else>{{ $t("not_applicable") }}</div>
        </div>
        <div class="d-flex px-8 pb-2">
          <div class="left-details">{{ $t("city") }}</div>

          <div class="field_label" v-if="user_details.city">
            {{ user_details.city }}
          </div>
          <div v-else>{{ $t("not_applicable") }}</div>
        </div>
        <v-divider class="mx-8"></v-divider>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    envImagePath: import.meta.env.VUE_APP_IMAGE_PATH,
    initval: false,
    loader: false,
    user_details: [],
    allLicenses: [],
    google_icon: {
      icon_name: "group",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    headers: [
      {
        title: "License Name",
        align: "left",
        key: "doc_name",
        sortable: true,
      },
      {
        title: "Expiry Date",
        align: "left",
        key: "doc_date",
      },
      {
        title: "Actions",
        key: "",
        align: "left",
      },
    ],
  }),

  props: ["user"],

  watch: {
    user: {
      immediate: true,
      handler() {
        if (this.user.slug) {
          this.fetchuserDetails(this.user.slug);
        }
      },
    },
  },
  methods: {
    fetchuserDetails(slug) {
      this.loader = true;
      this.initval = true;
      this.$axios
        .get( "fetchuserbyslug/" + slug)
        .then((res) => {
          this.loader = false;
          if (res.data.status == "S") {
            this.user_details = res.data.user;
            this.initval = false;
          } else {
            this.$toast.error(this.$t("something_went_wrong"));
            this.initval = false;
          }
        })
        .catch((err) => {
          this.loader = false;
          this.initval = false;

          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
  },
};
</script>
<style scoped>
.param-value {
  max-width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.userindexcodechip:hover {
  cursor: pointer;
}

.usernamehoverstyle:hover {
  /* cursor: pointer; */
  font-weight: 500;
}

.usernamehoverstyle {
  font-weight: 500;
  color: rgb(71, 174, 110);
}

.delete_icon_size {
  font-size: 20px !important;
}
.left-details {
  min-width: 100px;
  font-weight: 600;
  text-align: initial;
  font-size: 14px;
}
.coming_soon_container {
  min-height: 100px;
}
.date_font {
  font-size: 14px;
}
.field_label {
  font-size: 14px;
}
.profile_container {
  border: 1px solid grey;
  border-radius: 10px;
}
.cancel {
  background-color: rgb(45, 45, 45) !important;
  color: white !important;
}
.checkbox_item :deep(.v-input__details) {
  display: none;
}
.name_header {
  height: max-content !important;
}
.verified_icon {
  border: 3px solid #4caf50;
  border-radius: 50%;
}
.rejected_icon {
  border: 3px solid #ff5252 !important ;
  border-radius: 50%;
}
.awaiting_image_size {
  font-size: 90px;
  color: #ff6f00;
}
</style>