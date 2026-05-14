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
            :heading="$t('users')"
            :google_icon="google_icon"
          ></page-title>
          <div class="add_new_button">
            <v-tooltip :text="this.$t('add_new')" location="bottom">
              <template v-slot:activator="{ props }">
                <router-link
                  :to="{ name: 'user_creation' }"
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
        <!-- Search Bar -->
        <div class="search-wrapper">
          <v-text-field
            v-model="search"
            placeholder="Search Name, email, initials or date of birth..."
            append-inner-icon="mdi-magnify"
            variant="solo"
            flat
            hide-details
            density="comfortable"
            class="search-field"
          ></v-text-field>
        </div>
        <!-- Data Table Card -->
        <v-card class="table-card pa-4">
          <v-data-table
            class="table-card"
            :headers="headers"
            :items="adminUsers"
            :search="search"
            :loading="adminLoading"
            :items-per-page-text="$t('rows_per_page')"
          >
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>{{ props.item.full_name || $t("not_appllicable") }}</td>
                <td>{{ props.item.email || $t("not_appllicable") }}</td>
                <td>{{ props.item.mobile || $t("not_appllicable") }}</td>
                <!-- <td>{{ props.item.postcode || $t("not_appllicable") }}</td> -->
                <td>
                  {{
                    props.item.role?.role_display_name || $t("not_appllicable")
                  }}
                </td>
                <td>
                  <v-btn
                    class="hover_shine btn mr-2"
                    size="small"
                    :color="props.item.status == 1 ? 'success' : 'warning'"
                    @click="changeStatus(props.item.id)"
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
                </td>

                <td>
                  <router-link
                    :to="{
                      name: 'user_creation',
                      query: { slug: props.item.slug },
                    }"
                  >
                    <v-icon class="mr-2 edit_btn icon_size">
                      mdi-pencil-outline
                    </v-icon>
                  </router-link>
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
    dialogMessage: "",
    dialogTitle: "",
    initval: false,
    google_icon: {
      icon_name: "group",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    message: "",
    user: "",
    adminUsers: [],
    adminLoading: false,
    loader: false,
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {},
  computed: {
    headers() {
      return [
        {
          title: this.$t("name"),
          align: "left",
          sortable: true,
          key: "full_name",
        },
        {
          title: this.$t("email"),
          align: "left",
          sortable: true,
          key: "email",
        },
        {
          title: this.$t("phone"),
          align: "left",
          sortable: true,
          key: "phone",
        },
        // {
        //   title: this.$t("postcode"),
        //   align: "left",
        //   sortable: true,
        //   key: "postcode",
        // },
        {
          title: this.$t("role"),
          align: "left",
          sortable: true,
          key: "role_display_name",
        },
        {
          title: this.$t("status"),
          align: "left",
          sortable: false,
          key: "status",
        },
        {
          title: this.$t("actions"),
          align: "left",
          sortable: false,
          key: "actions",
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
    fetchUsers() {
      this.adminLoading = true;

      this.$axios
        .get("fetchuser")
        .then((res) => {
          this.adminUsers = res.data.usersdata;
          this.adminUsers = this.adminUsers.filter((elem) => {
            if (
              elem.id !== this.user.id &&
              elem.role.rolename !== "SuperUser"
            ) {
              return elem;
            }
          });
          this.initval = false;
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.adminLoading = false;
        });
    },
    routereditusers(slug, empno, role) {
      if (role) {
        return;
      }
      if (empno != null) {
        this.$router.push({
          name: "users.view",
          query: {
            slug: slug,
            view: "userview",
          },
        });
      } else {
        this.$router.push({
          name: "employee_creation",
          query: {
            slug: slug,
            pathname: "userview",
          },
        });
      }
    },

    async changeStatus(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to change the status of this user ?",
      );

      if (!result) return;
      this.$axios
        .post("updateuserstatus", {
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
            this.initval = true;
            this.fetchUsers();
          } else if (res.data.status == "E") {
            this.$toast.error(this.$t("something_went_wrong"));
          } else {
            this.$toast.error(this.array_data);
            this.initval = true;
            this.fetchUsers();
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
  },
};
</script>
<style scoped>
.v-icon--size-default {
  font-size: calc(var(--v-icon-size-multiplier) * 2em) !important;
}
</style>
