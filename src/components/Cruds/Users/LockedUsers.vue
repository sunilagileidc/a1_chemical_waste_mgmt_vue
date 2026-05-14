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
            :heading="$t('locked_users')"
            :google_icon="google_icon"
          ></page-title>
        </div>
        <!-- Stats section -->
        <!-- <stats-page :stats="stats" /> -->
        <!-- Stats section -->
        <!-- Search Bar -->
        <div class="search-wrapper">
          <v-text-field
            v-model="search"
            placeholder="Search Name, Email, Initials, Date of Birth..."
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
            :headers="userheaders"
            :items="locked_users"
            :search="search"
            :loading="lockedLoading"
            :items-per-page-text="$t('rows_per_page')"
          >
            <template v-slot:item="props">
              <tr class="vdatatable_tbody">
                <td>{{ props.item.full_name || $t("not_appllicable") }}</td>
                <td>{{ props.item.email || $t("not_appllicable") }}</td>
                <td>{{ props.item.mobile || $t("not_appllicable") }}</td>
                <td>{{ props.item.postcode || $t("not_appllicable") }}</td>
                <td>
                  {{
                    props.item.role?.role_display_name || $t("not_appllicable")
                  }}
                </td>

                <td class="d-flex align-center">
                  <!-- Unlock Icon (If Locked) -->
                  <v-tooltip text="Lock User" location="bottom">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-icon
                        v-if="props.item.is_locked !== 'Y'"
                        v-bind="tooltipProps"
                        class="mr-2 icon_size text-warning"
                      >
                        mdi-lock-outline
                      </v-icon>
                    </template>
                  </v-tooltip>

                  <!-- Lock Icon (If Not Locked) -->
                  <v-tooltip text="Unlock User" location="bottom">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-icon
                        v-if="props.item.is_locked === 'Y'"
                        v-bind="tooltipProps"
                        class="mr-2 icon_size text-error"
                        @click="unlockUser(props.item.id)"
                      >
                        mdi-lock-open-outline
                      </v-icon>
                    </template>
                  </v-tooltip>
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
    google_icon: {
      icon_name: "lock_person",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    search: "",
    message: "",
    user: "",
    locked_users: [],
    lockedLoading: false,
    loader: false,
  }),
  created() {
    this.user = JSON.parse(localStorage.getItem("user_data"));
  },
  mounted() {
    this.fetchLockedUsers();
  },
  watch: {},
  computed: {
    userheaders() {
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

    fetchLockedUsers() {
      this.lockedLoading = true;

      this.$axios
        .get("fetch_locked_users")
        .then((res) => {
          this.locked_users = res.data.usersdata;
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.lockedLoading = false;
        });
    },

    async unlockUser(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to unlock this user?",
      );

      if (!result) return;

      this.$axios
        .post("unlock_user", { id })
        .then((res) => {
          if (res.data.status === "S") {
            this.$toast.success(res.data.message);
            this.fetchLockedUsers();
          } else {
            this.$toast.error(res.data.message);
          }
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
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
