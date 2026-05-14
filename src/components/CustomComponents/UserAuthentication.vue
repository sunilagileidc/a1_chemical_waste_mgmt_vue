<template>
  <content-loader v-if="loader"></content-loader>
  <v-dialog v-model="retrospectiveDialog" max-width="500" persistent>
    <v-card class="pa-5">
      <h3 class="mb-3">{{ dialogTitle }}</h3>

      <p class="text-grey mb-4">
        {{ dialogDesc }}
      </p>

      <v-text-field
        v-model="retrospectivePassword"
        :type="showPassword ? 'text' : 'password'"
        label="Enter Password"
        variant="outlined"
        density="compact"
        :error-messages="retrospectiveError"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
      />

      <div class="d-flex justify-end mt-4">
        <v-btn
          class="btn-cancel mr-2"
          size="small"
          @click="cancelRetrospective"
        >
          Cancel
        </v-btn>

        <v-btn color="success" size="small" @click="verifyRetrospective">
          Confirm
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "UserAuth",

  props: {
    showauthentication: {
      type: Boolean,
      required: true,
    },
    dialogTitle: {
      type: String,
      default: "Retrospective Entry",
    },
    dialogDesc: {
      type: String,
      default:
        "You selected a past date. Please enter your password to confirm.",
    },
  },

  data() {
    return {
      retrospectiveDialog: false,
      retrospectivePassword: "",
      retrospectiveError: "",
      showPassword: false,
      loader: false,
    };
  },

  watch: {
    showauthentication: {
      immediate: true,
      handler(val) {
        this.retrospectiveDialog = val;
      },
    },

    retrospectiveDialog(val) {
      // close parent state also
      if (!val) {
        this.$emit("update:showauthentication", false);
      }
    },
  },

  methods: {
    async verifyRetrospective() {
      this.retrospectiveError = "";

      if (!this.retrospectivePassword) {
        this.retrospectiveError = "Please enter your password to continue.";
        return;
      }

      this.loader = true;

      try {
        const res = await this.$axios.post("verify_retrospective", {
          password: this.retrospectivePassword,
        });

        if (res.data.valid) {
          this.retrospectiveDialog = false;
          this.retrospectivePassword = "";
          this.$emit("confirmed");
        } else {
          this.retrospectiveError =
            res.data.message || "Incorrect password. Please try again.";
        }
      } catch (e) {
        this.$toast.error("Unable to verify password. Please try again.");
      } finally {
        this.loader = false;
      }
    },

    cancelRetrospective() {
      this.retrospectiveDialog = false;
      this.retrospectivePassword = "";
      this.retrospectiveError = "";
      /* emit cancel event */
      this.$emit("cancelled");
    },
  },
};
</script>
