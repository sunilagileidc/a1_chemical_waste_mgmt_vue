<template>
  <content-loader v-if="loader"></content-loader>
  <div class="main-20">
    <div
      flat
      color="white"
      class="row py-5 pl-5 align-items-center component_app_bar"
    >
      <page-title
        class="col-md-3"
        :heading="$t('my_profile')"
        :google_icon="google_icon"
      ></page-title>
      <div class="add_new_button">
        <span class="mr-2">
          <v-tooltip :text="this.$t('back')" location="bottom">
            <template v-slot:activator="{ props }">
              <!-- <router-link
                :to="{
                  name: 'dashboard',
                }"
                style="color: white"
              > -->
              <v-btn
                size="small"
                class="mb-2"
                color="cancel"
                style="color: white"
                v-bind="props"
                @click="$router.go(-1)"
                >{{ $t("back") }}</v-btn
              >
              <!-- </router-link> -->
            </template>
          </v-tooltip>
        </span>
        <span>
          <v-tooltip :text="this.$t('update_profile')" location="bottom">
            <template v-slot:activator="{ props }">
              <router-link
                v-if="show_update"
                :to="{
                  name: 'user_creation',
                  query: {
                    slug: profile_details.slug,
                    from: $route.query.from,
                  },
                }"
              >
                <v-btn
                  size="small"
                  class="mb-2"
                  color="#0959f1"
                  style="color: white"
                  v-bind="props"
                  >{{ $t("update_profile") }}</v-btn
                >
              </router-link>
            </template>
          </v-tooltip>
        </span>
      </div>
    </div>

    <div class="card-body">
      <div class="pa-5">
        <v-row class="mx-auto">
          <v-col md="4" sm="4">
            <div class="field_label">{{ $t("name") }}</div>
            <div class="field_value" v-if="profile_details.name">
              {{ profile_details.salutation }}&nbsp;{{
                profile_details.name
              }}&nbsp;{{ profile_details.lastname }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
          <v-col md="3" sm="3">
            <div class="field_label">{{ $t("email") }}</div>
            <div class="field_value" v-if="profile_details.email">
              {{ profile_details.email }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
          <v-col md="2" sm="2">
            <div class="field_label">{{ $t("gender") }}</div>
            <div class="field_value" v-if="profile_details.gender">
              {{ profile_details.gender }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
          <v-col md="3" sm="3">
            <div class="image-container">
              <v-hover v-slot="{ props }">
                <div style="position: relative" v-bind="props">
                  <img
                    v-if="profile_details.image_url != null"
                    :src="envImagePath + profile_details.image_url"
                    width="100"
                    height="100"
                    class="img_border"
                    alt
                  />
                  <img
                    v-else
                    src="@/assets/images/avatars/default.png"
                    width="100"
                    class="img_border"
                  />
                </div>
              </v-hover>
            </div>
          </v-col>
        </v-row>
        <v-row class="mx-auto mt-3">
          <v-col md="4" sm="4">
            <div class="field_label">{{ $t("dob") }}</div>
            <div class="field_value" v-if="profile_details.dob">
              {{ formatDate(profile_details.dob) }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
          <v-col md="8" sm="8">
            <div class="field_label">{{ $t("address") }}</div>
            <div class="field_value" v-if="profile_details.address">
              {{ profile_details.address }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
        </v-row>
        <v-row class="mx-auto mt-3">
          <v-col md="4" sm="8">
            <div class="field_label">{{ $t("postcode") }}</div>
            <div class="field_value" v-if="profile_details.postcode">
              {{ profile_details.postcode }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
          <v-col md="3" sm="3">
            <div class="field_label">{{ $t("country") }}</div>
            <div class="field_value" v-if="profile_details.country">
              {{ profile_details.country.name }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
          <v-col md="3" sm="3">
            <div class="field_label">{{ $t("state") }}</div>
            <div class="field_value" v-if="profile_details.state">
              {{ profile_details.state.name }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
        </v-row>
        <v-row class="mx-auto mt-3">
          <v-col md="4" sm="4">
            <div class="field_label">{{ $t("city") }}</div>
            <div class="field_value" v-if="profile_details.city">
              {{ profile_details.city.name }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
          <v-col md="3" sm="3">
            <div class="field_label">{{ $t("mobile") }}</div>
            <div class="field_value" v-if="profile_details.mobile">
              {{ profile_details.mobile }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
          <v-col md="4" sm="4">
            <div class="field_label">{{ $t("description") }}</div>
            <div class="field_value" v-if="profile_details.description">
              {{ profile_details.description }}
            </div>
            <div v-else>
              {{ $t("not_applicable") }}
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";
export default {
  components: {
    PageTitle,
  },
  data: () => ({
    envImagePath: import.meta.env.VITE_IMAGE_PATH,
    loader: false,
    profile_details: [],
    role_details: [],
    isDisabled: false,
    show_update: false,
    google_icon: {
      icon_name: "account_circle",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
  }),
  mounted() {},
  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("fetchuserdatabyslug/" + this.$route.query.slug)
            .then((res) => {
              this.loader = false;
              if (res.data.status == "S") {
                this.profile_details = res.data.user;
                this.role_details = res.data.user.role;
              } else {
                this.$toast.error(this.$t("something_went_wrong"));
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log("this error" + err);
            });
        }
      },
    },

    "$route.query.from": {
      immediate: true,
      handler() {
        if (this.$route.query.from) {
          if (this.$route.query.from == "amend") {
            this.show_update = true;
          }
        }
      },
    },
  },
  methods: {},
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
.field_value {
  font-weight: 600;
}
.img_border {
  border: 1px solid black;
  padding: 2px;
}
</style>