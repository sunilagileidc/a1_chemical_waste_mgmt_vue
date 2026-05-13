<template>
  <div class="main-20">
    <confirmation-dialog
      ref="confirmationDialog"
      :title="dialogTitle"
      :message="dialogMessage"
    ></confirmation-dialog>
    <!-- HEADER -->
    <div
      class="row my-3 align-items-center component_app_bar position-relative"
      :class="[sel_lang === 'ar' ? 'rtl-page-title' : '']"
    >
      <page-title
        class="col-md-4"
        :heading="$t('email_templates')"
        :google_icon="google_icon"
      />

      <!-- SEARCH -->
      <div class="col-md-4">
        <v-text-field
          v-model="search"
          rounded
          density="compact"
          variant="outlined"
          append-icon="search"
          :label="$t('search')"
          hide-details
          class="srch_bar"
        />
      </div>

      <!-- ADD BUTTON -->
      <div class="add_new_button">
        <router-link :to="{ name: 'email_template_amend' }">
          <v-btn size="small" class="green_btn_color">
            {{ $t("add_new") }}
          </v-btn>
        </router-link>
      </div>
    </div>

    <!-- TABLE -->
    <v-data-table
      :headers="headers"
      :items="filteredTemplates"
      :loading="initval"
      item-key="id"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.template_name }}</td>
          <td>{{ item.template_subject }}</td>
          <td class="text-center">
            <router-link
              :to="{
                name: 'email_template_amend',
                query: { slug: item.slug },
              }"
            >
              <v-icon class="mr-2">mdi-pencil-outline</v-icon>
            </router-link>

            <v-icon color="error" @click="deleteEmailTemplate(item.id)">
              mdi-trash-can-outline
            </v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogMessage: "",
      dialogTitle: "",
      search: "",
      email_templates: [],
      initval: true,

      google_icon: {
        icon_name: "dynamic_feed",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },
    };
  },

  computed: {
    headers() {
      return [
        { title: this.$t("name"), key: "template_name" },
        { title: this.$t("subject"), key: "template_subject" },
        { title: this.$t("action"), key: "action", align: "center" },
      ];
    },

    filteredTemplates() {
      if (!this.search) return this.email_templates;

      return this.email_templates.filter((t) =>
        t.template_name?.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },

  mounted() {
    this.fetchEmailTemplates();
  },

  methods: {
    showConfirmation(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      return this.$refs.confirmationDialog.open();
    },
    fetchEmailTemplates() {
      this.initval = true;

      this.$axios
        .get("emailtemplates")
        .then((res) => {
          this.email_templates = res.data?.email_templates || [];
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        })
        .finally(() => {
          this.initval = false;
        });
    },

    async deleteEmailTemplate(id) {
      const result = await this.showConfirmation(
        "Confirm",
        "Are you sure you want to delete this email template ?"
      );

      if (!result) return;
      this.$axios
        .delete("emailtemplates/" + id)
        .then((res) => {
          const msg = Array.isArray(res.data.message)
            ? res.data.message.toString()
            : res.data.message;

          res.data.status === "E"
            ? this.$toast.error(msg)
            : this.$toast.success(msg);

          this.fetchEmailTemplates();
        })
        .catch(() => {
          this.$toast.error(this.$t("something_went_wrong"));
        });
    },
  },
};
</script>
<style scoped>
.list_item {
  cursor: pointer;
}
</style>
