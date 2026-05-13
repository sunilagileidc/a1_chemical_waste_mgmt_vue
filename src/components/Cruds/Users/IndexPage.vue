<template>
  <div>
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>
    <div
      flat
      color="white"
      class="row my-3 align-items-center component_app_bar position-relative"
    >
      <page-title
        class="col-md-3"
        :heading="$t('users')"
        :google_icon="google_icon"
      ></page-title>
      <div class="col-md-4">
        <v-tooltip :text="this.$t('search')" location="bottom">
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
        <v-tooltip :text="this.$t('add_new')" location="bottom">
          <template v-slot:activator="{ props }">
            <router-link :to="{ name: 'user_creation' }" style="color: white">
              <v-btn size="small" class="mb-2 create-btn" v-bind="props">{{
                $t("add_new")
              }}</v-btn>
            </router-link>
          </template>
        </v-tooltip>
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="allUsers"
      :search="search"
      :loading="initval"
      v-bind:no-data-text="$t('no_data_available')"
      :items-per-page-text="$t('rows_per_page')"
    >
      <template v-slot:item="props">
        <tr class="vdatatable_tbody">
          <td>
            <span v-if="props.item.full_name"> {{ props.item.full_name }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.email"> {{ props.item.email }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.mobile"> {{ props.item.mobile }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.postcode"> {{ props.item.postcode }}</span>
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <span v-if="props.item.rolename">
              {{ props.item.role.role_display_name }}</span
            >
            <span v-else>{{ $t("not_appllicable") }}</span>
          </td>
          <td>
            <v-btn
              class="hover_shine btn mr-2"
              :disabled="isDisabled"
              size="small"
              @click="changeStatus(props.item.id)"
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
          <td>
            <router-link
              :to="{
                name: 'user_creation',
                query: { slug: props.item.slug },
              }"
            >
              <v-tooltip :text="this.$t('edit')" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    plain
                    v-bind="props"
                    dense
                    class="mr-2 edit_btn icon_size"
                    >mdi-pencil-outline</v-icon
                  >
                </template>
              </v-tooltip>
            </router-link>
          </td>
          <td>
            <v-btn
              size="small"
              @click="redirectView(props.item.slug)"
              :disabled="loading"
              class="ma-1"
              color="blue"
              >{{ $t("view") }}</v-btn
            >
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
    allUsers: [],
    initval: false,
    isDisabled: false,
    google_icon: {
      icon_name: "group",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    valid_error: false,
    valid_success: false,
    successmessage: "",
    valid: false,
    message: "",
    user: "",
    showStatusDialog: false,
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
    console.log("asdasd", this.user);
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {
   
  },
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
          sortable: true, // Assuming sorting is desired
          key: "email",
        },
        {
          title: this.$t("phone"),
          align: "left",
          sortable: true,
          key: "phone",
        },
        {
          title: this.$t("postcode"),
          align: "left",
          sortable: true,
          key: "postcode",
        },
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
          align: "center",
          sortable: false,
          key: "actions",
        },
        {
          title: " ",
          align: "center",
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
    redirectView(slug) {
      this.$router.push({
        name: "view-my-profile",
        query: {
          slug: slug,
          from: "view",
        },
      });
    },
    async deleteConfirm(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this user ?"
      );

      if (!result) return;
      this.$axios
        .post("delete_draft_user/" + id)
        .then((res) => {
          if (Array.isArray(res.data.message)) {
            this.array_data = res.data.message.toString();
          } else {
            this.array_data = res.data.message;
          }
          if (res.data.status == "S") {
            this.$toast.success(this.array_data);
            this.fetchUsers();
          } else if (res.data.status == "E") {
            this.$toast.error(this.array_data);
          } else {
            this.$toast.error(this.array_data);
            this.fetchUsers();
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("this error" + err);
        });
    },
    fetchUsers() {
      this.initval = true;
      this.$axios
        .get("fetchuser")
        .then((res) => {
          this.allUsers = res.data.usersdata;
          // console.log("this.allUsers");
          // console.log(this.allUsers);
          this.allUsers = this.allUsers.filter((elem) => {
            if (
              elem.id !== this.user.id &&
              elem.role.rolename !== "SuperUser"
            ) {
              return elem;
            }
          });
          this.initval = false;
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log("error" + err);
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
        "Are you sure you want to change the status of this user ?"
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
            this.$toast.success(this.$t("something_went_wrong"));
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
</style>
