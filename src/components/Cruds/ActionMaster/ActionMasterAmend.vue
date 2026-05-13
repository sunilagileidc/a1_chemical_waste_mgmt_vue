<template>
  <div class="mt-3 p-0">
    <div class="my-3 p-0">
      <page-title
        class="col-md-4"
        :heading="$route.query.slug ? $t('edit_action') : $t('create_action')"
        :google_icon="google_icon"
      />
    </div>

    <content-loader v-if="loader" />

    <div class="mb-3 mx-auto">
      <div class="card-body">
        <v-form ref="form" v-model="valid">
          <v-row class="px-6">
            <!-- Action Name -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="action.action_name"
                :rules="[...fieldRules, ...actionNameRules]"
                label="Action Name"
                required
                variant="outlined"
                density="compact"
                hide-details="auto"
                @keydown="allowOnlyValidChars"
                hint="Only uppercase letters, numbers and underscore allowed"
                counter
                maxlength="30"
              />
            </v-col>

            <!-- Category -->
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="action.category"
                :items="categories"
                item-title="longname"
                item-value="shortname"
                label="Category"
                variant="outlined"
                density="compact"
                hide-details="auto"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                v-model="action.status"
                :label="$t('status')"
                :true-value="1"
                :false-value="0"
                color="success"
                hide-details
                inset
                small
              />
            </v-col>
          </v-row>

          <!-- Description -->
          <v-row class="px-6">
            <v-col cols="12">
              <v-textarea
                v-model="action.description"
                label="Description"
                rows="2"
                maxlength="500"
                counter
                variant="outlined"
                hide-details="auto"
              />
            </v-col>
          </v-row>
        </v-form>
      </div>

      <!-- Buttons -->
      <div class="d-block mr-4 mt-3 pb-3 text-right">
        <v-btn
          size="small"
          @click="$router.go(-1)"
          :disabled="isDisabled"
          class="ma-1"
          color="cancel"
        >
          {{ $t("cancel") }}
        </v-btn>

        <v-btn
          :disabled="isDisabled"
          @click="submit"
          size="small"
          class="mr-2"
          color="success"
        >
          {{ $t("submit") }}
          <v-progress-circular
            v-if="isDisabled"
            indeterminate
            width="1"
            size="x-small"
            class="ml-2"
          />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      google_icon: {
        icon_name: "settings",
        color: "google_icon_gradient",
        icon: "material-symbols-outlined",
      },
      valid: false,
      loader: false,
      isDisabled: false,

      action: {
        id: 0,
        action_name: "",
        category: "",
        description: "",
        status: 1,
      },
      categories: [],
    };
  },

  computed: {
    fieldRules() {
      return [(v) => !!v || this.$t("field_required")];
    },
    actionNameRules() {
      return [
        (v) => !!v || this.$t("field_required"),
        (v) =>
          /^[A-Z0-9 ]+$/.test(v) ||
          "Only uppercase letters, numbers and spaces allowed",
      ];
    },
  },

  mounted() {
    this.fetchLookup();
  },

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;

          this.$axios
            .get("action_master/" + this.$route.query.slug)
            .then((res) => {
              this.action = res.data.data;
              this.loader = false;
            })
            .catch(() => {
              this.loader = false;
            });
        }
      },
    },
  },

  methods: {
    fetchLookup() {
      this.$axios
        .get("fetchlookup", {
          params: {
            lookup_type: "ACTION_CATEGORIES",
          },
        })
        .then((response) => {
          this.categories = response.data.lookup_details;
          if (this.categories.length > 0) {
            this.action.category = this.categories[0].shortname;
          }
        })
        .catch((err) => {
          this.$toast.error(this.$t("something_went_wrong"));
          console.log(err);
        });
    },

    submit() {
      if (this.$refs.form.validate() && this.valid) {
        this.isDisabled = true;

        // CREATE
        if (!this.action.id) {
          this.$axios
            .post("action_master", this.action)
            .then((res) => {
              if (res.data.status == "E") {
                this.$toast.error(res.data.message);
              } else {
                this.$toast.success(res.data.message);
                this.$router.push({ name: "action_master" });
              }
            })
            .catch((err) => {
              this.$toast.error(err.response.data.message);
            })
            .finally(() => {
              this.isDisabled = false;
            });
        }
        // UPDATE
        else {
          this.$axios
            .put("action_master/" + this.action.id, this.action)
            .then((res) => {
              if (res.data.status == "E") {
                this.$toast.error(res.data.message);
              } else {
                this.$toast.success(res.data.message);
                this.$router.push({ name: "action_master" });
              }
            })
            .catch((err) => {
              this.$toast.error(err.response.data.message);
            })
            .finally(() => {
              this.isDisabled = false;
            });
        }
      }
    },

    allowOnlyValidChars(e) {
      const input = e.target;
      const value = this.action.action_name || "";

      // Allow Ctrl/Cmd shortcuts (Copy, Paste, Cut, Select All)
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      const allowedPattern = /^[A-Z0-9 ]$/;

      const controlKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Home",
        "End",
      ];

      if (controlKeys.includes(e.key)) return;

      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;
      const hasSelection = selectionStart !== selectionEnd;

      // Max 30 characters
      if (!hasSelection && value.length >= 30) {
        e.preventDefault();
        return;
      }

      // Prevent multiple consecutive spaces
      if (e.key === " ") {
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);

        if (
          before.length === 0 || // leading space
          before.endsWith(" ") || // double space before
          after.startsWith(" ") // double space after
        ) {
          e.preventDefault();
        }

        return;
      }

      // Convert lowercase → uppercase
      if (/^[a-z]$/.test(e.key)) {
        e.preventDefault();

        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);

        const newValue = before + e.key.toUpperCase() + after;
        this.action.action_name = newValue;

        this.$nextTick(() => {
          const pos = selectionStart + 1;
          input.setSelectionRange(pos, pos);
        });

        return;
      }

      // Block everything else
      if (!allowedPattern.test(e.key)) {
        e.preventDefault();
      }
    },
  },
};
</script>
