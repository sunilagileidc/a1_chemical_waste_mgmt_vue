<template>
  <v-dialog
    v-model="internalModel"
    persistent
    width="420"
    content-class="modern-alert-dialog"
  >
    <div class="alert-wrapper">
      <v-card class="alert-card">

        <!-- ICON -->
        <div class="alert-icon-wrapper">
          <v-avatar :color="iconColor" size="80" class="alert-avatar">
            <v-icon size="42" color="white">
              {{ iconName }}
            </v-icon>
          </v-avatar>
        </div>

        <!-- MESSAGE -->
        <v-card-text class="text-center alert-content">
          <div class="alert-message">
            {{ message }}
          </div>
        </v-card-text>

        <!-- ACTION -->
        <v-card-actions class="justify-center pb-8">
          <v-btn
            :color="iconColor"
            class="confirm-btn"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </v-btn>
        </v-card-actions>

      </v-card>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "AnimatedAlert",
  props: {
    modelValue: { type: Boolean, required: true },
    message: { type: String, default: "Something went wrong." },
    confirmText: { type: String, default: "OK" },
    type: { type: String, default: "warning" },
  },
  emits: ["update:modelValue", "confirm"],
  computed: {
    internalModel: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },
    iconName() {
      switch (this.type) {
        case "error":
          return "mdi-close-circle";
        case "success":
          return "mdi-check-circle";
        case "info":
          return "mdi-information";
        default:
          return "mdi-alert";
      }
    },
    iconColor() {
      switch (this.type) {
        case "error":
          return "error";
        case "success":
          return "success";
        case "info":
          return "info";
        default:
          return "warning";
      }
    },
  },
  methods: {
    handleConfirm() {
      this.$emit("confirm");
      this.internalModel = false;
    },
  },
};
</script>

<style scoped>

/* Allow overflow so icon isn't clipped */
:deep(.modern-alert-dialog) {
  overflow: visible !important;
}

/* CARD */
.alert-card {
  position: relative;
  border-radius: 24px;
  padding-top: 65px;
  overflow: visible;
  background: white;
  animation: modernPop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05);
}

/* ICON */
.alert-icon-wrapper {
  position: absolute;
  top: -37px;
  left: 50%;
  transform: translateX(-50%);
}

.alert-avatar {
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.15),
    0 4px 10px rgba(0, 0, 0, 0.1);
}

/* MESSAGE */
.alert-message {
  font-size: 17px;
  font-weight: 500;
  line-height: 1.6;
  color: #2c2c2c;
  padding: 0 20px;
}

/* BUTTON */
.confirm-btn {
  min-width: 130px;
  border-radius: 30px;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 10px 28px;
  transition: all 0.25s ease;
  box-shadow: 0 2px 2px rgba(0,0,0,0.15);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  
}

/* ENTRY ANIMATION */
@keyframes modernPop {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

</style>