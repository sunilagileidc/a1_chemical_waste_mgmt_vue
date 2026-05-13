<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <div class="confirm-dialog">
      <div class="confirm-header">
        <h3 class="confirmation-title">{{ title }}</h3>
        <v-icon class="close-icon" @click="close">mdi-close</v-icon>
      </div>

      <div class="confirm-message">
        <span v-html="message"></span>
      </div>

      <div class="confirm-dialog-buttons d-flex justify-end">
        <v-btn small class="no-btn bnc mr-2" text @click="close">Back</v-btn>
        <v-btn small class="yes-btn bnc" text @click="confirm">Confirm</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfirmationDialog",
  props: {
    title: { type: String, default: "Confirm" },
    message: { type: String, default: "Are you sure you want to proceed?" },
  },
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
    };
  },
  methods: {
    open() {
      this.dialog = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    confirm() {
      this.dialog = false;
      this.resolve(true);
    },
    close() {
      this.dialog = false;
      this.resolve(false);
    },
  },
};
</script>

<style scoped>
/* Dialog Container */
.v-dialog__content {
  align-items: center !important;
  justify-content: center !important;
}

/* Dialog Box */
.confirm-dialog {
  width: 500px;
  background: #ffffff;
  padding: 25px 30px;
  border-radius: 15px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* Header */
.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.confirmation-title {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
}

.close-icon {
  font-size: 22px;
  cursor: pointer;
  color: #888888;
  transition: color 0.3s;
}
.close-icon:hover {
  color: #ff5252;
}

/* Message */
.confirm-message {
  font-size: 16px;
  color: #555555;
  text-align: left;
  margin-bottom: 25px;
  line-height: 1.5;
}

/* Buttons */
.confirm-dialog-buttons .v-btn {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.yes-btn {
  background: #d4edda !important;
  color: #28a745 !important;
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.2);
}
.yes-btn:hover {
  background: #c3e6cb !important;
  transform: translateY(-2px);
}

.no-btn {
  background: #f8d7da !important;
  color: #dc3545 !important;
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);
}
.no-btn:hover {
  background: #f5c6cb !important;
  transform: translateY(-2px);
}

/* Bounce Animation */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
}

.bnc:hover {
  animation: bounce 0.4s;
}
</style>
