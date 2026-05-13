<template>
  <div class="session-wrapper">

    <!-- TOP FLOATING SESSION TIMER -->
    <!-- <div
      v-if="isAuthenticated"
      :class="['top-timer', { danger: remainingTime <= warningBefore }]"
    >
      ⏳ Session expires in {{ formattedRemainingTime }}
    </div> -->

    <!-- WARNING POPUP -->
    <v-dialog
      v-model="showWarningPopup"
      width="440"
      persistent
      transition="scale-transition"
    >
      <v-card class="popup-card">

        <!-- HEADER -->
        <div class="popup-header">
          <div class="icon-wrapper">⏳</div>
          <div class="title-text">Session Expiring Soon</div>
        </div>

        <!-- BODY -->
        <v-card-text class="text-center popup-body">

          <!-- Circular Countdown -->
          <div class="circle-wrapper">
            <svg class="progress-ring" width="130" height="130">

              <defs>
                <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#4a90e2" />
                  <stop offset="100%" stop-color="#6c5ce7" />
                </linearGradient>
              </defs>

              <circle
                class="progress-ring-bg"
                cx="65"
                cy="65"
                r="55"
              />

              <circle
                class="progress-ring-circle"
                cx="65"
                cy="65"
                r="55"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
              />
            </svg>

            <!-- WARNING COUNTDOWN -->
            <div class="circle-text">
              {{ warningCountdown }}
            </div>
          </div>

          <div class="popup-message">
            Your session will expire soon.<br />
            Would you like to extend it?
          </div>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="popup-actions">
          <v-btn
            class="logout-btn"
            variant="outlined"
            @click="handleLogout"
          >
            Logout
          </v-btn>

          <v-btn
            class="extend-btn"
            @click="extendSession"
          >
            Extend Session
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  data() {
    return {
      logoutTimer: null,
      countdownInterval: null,
      warningInterval: null,

      inactiveTime: 1 * 60 * 1000,   // 30 minutes total session in ms
      warningBefore: 0.9 * 60 * 1000,     // show popup 2 minutes before logout

      remainingTime: 0,
      warningCountdown: 0,

      showWarningPopup: false,
    };
  },

  computed: {
    isAuthenticated() {
      return this.$store.getters["auth/authentication"];
    },

    formattedRemainingTime() {
      const totalSeconds = Math.max(Math.floor(this.remainingTime / 1000), 0);
      const minutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (totalSeconds % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    },

    circumference() {
      return 2 * Math.PI * 55;
    },

    dashOffset() {
      const totalWarningSeconds = this.warningBefore / 1000;
      const progress =
        (this.warningCountdown / totalWarningSeconds) *
        this.circumference;

      return this.circumference - progress;
    },
  },

  watch: {
    isAuthenticated(newVal) {
      if (!newVal) {
        this.showWarningPopup = false;
        this.clearAllTimers();
      }
    },
  },

  mounted() {
    if (this.isAuthenticated) {
      this.startSession();
    }

    window.addEventListener("mousemove", this.resetLogoutTimer);
    window.addEventListener("keydown", this.resetLogoutTimer);
  },

  beforeUnmount() {
    window.removeEventListener("mousemove", this.resetLogoutTimer);
    window.removeEventListener("keydown", this.resetLogoutTimer);
    this.clearAllTimers();
  },

  methods: {
    /* =========================
       START SESSION
    ==========================*/
    startSession() {
      this.remainingTime = this.inactiveTime;
      this.startCountdown();
      this.startLogoutTimer();
    },

    startLogoutTimer() {
      this.logoutTimer = setTimeout(() => {
        this.forceLogout();
      }, this.inactiveTime);
    },

    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (!this.isAuthenticated) return;

        this.remainingTime -= 1000;

        // FIXED CONDITION (<= instead of ===)
        if (
          this.remainingTime <= this.warningBefore &&
          !this.showWarningPopup
        ) {
          this.showWarningPopup = true;
          this.startWarningCountdown();
        }

        if (this.remainingTime <= 0) {
          this.clearAllTimers();
        }
      }, 1000);
    },

    startWarningCountdown() {
      this.warningCountdown = this.warningBefore / 1000;

      this.warningInterval = setInterval(() => {
        this.warningCountdown--;

        if (this.warningCountdown <= 0) {
          clearInterval(this.warningInterval);
        }
      }, 1000);
    },

    /* =========================
       RESET ON ACTIVITY
    ==========================*/
    resetLogoutTimer: debounce(function () {
      if (!this.isAuthenticated) return;
      if (this.showWarningPopup) return;

      this.clearAllTimers();
      this.startSession();
    }, 200),

    /* =========================
       EXTEND SESSION
    ==========================*/
    extendSession() {
      if (!this.isAuthenticated) {
        this.showWarningPopup = false;
        return;
      }

      this.showWarningPopup = false;
      this.clearAllTimers();
      this.startSession();
    },

    /* =========================
       FORCE LOGOUT
    ==========================*/
    forceLogout() {
      if (!this.isAuthenticated) return;

      this.$store.dispatch("auth/logoutUser");
      this.$router.replace({ name: "login" });

      this.showWarningPopup = false;
      this.clearAllTimers();
    },

    handleLogout() {
      this.forceLogout();
    },

    clearAllTimers() {
      clearTimeout(this.logoutTimer);
      clearInterval(this.countdownInterval);
      clearInterval(this.warningInterval);
    },
  },
};
</script>

<style scoped>
.session-wrapper {
  position: relative;
}

/* TOP TIMER */
.top-timer {
  position: fixed;
  top: 15px;
  right: 170px;
  padding: 10px 22px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(14px);
  background: linear-gradient(135deg, #4a90e2, #6c5ce7);
  color: white;
  /* box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25); */
  animation: slideFade 0.5s ease;
  z-index: 9999;
  transition: all 0.3s ease;
}

.top-timer.danger {
  background: linear-gradient(135deg, #ff4d4d, #ff0000);
  animation: blink 1s infinite;
}

/* POPUP */
.popup-card {
  border-radius: 28px;
  overflow: hidden;
  backdrop-filter: blur(25px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
}

.popup-header {
  background: linear-gradient(135deg, #4a90e2, #6c5ce7);
  padding: 28px 20px;
  text-align: center;
  color: white;
}

.icon-wrapper {
  font-size: 30px;
  margin-bottom: 8px;
  animation: pulse 1.5s infinite;
}

.title-text {
  font-size: 20px;
  font-weight: 600;
}

.popup-body {
  padding: 35px 25px;
}

.popup-message {
  margin-top: 22px;
  font-size: 14px;
  color: #444;
}

/* Circle */
.circle-wrapper {
  position: relative;
  width: 130px;
  height: 130px;
  margin: 0 auto;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: transparent;
  stroke: rgba(0, 0, 0, 0.08);
  stroke-width: 8;
}

.progress-ring-circle {
  fill: transparent;
  stroke: url(#gradientStroke);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}

.circle-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
  font-weight: 700;
  color: #6c5ce7;
}

/* Buttons */
.popup-actions {
  padding: 20px;
  display: flex;
  gap: 15px;
}

.logout-btn,
.extend-btn {
  border-radius: 40px;
  flex: 1;
  font-weight: 600;
}

.extend-btn {
  background: linear-gradient(135deg, #4a90e2, #6c5ce7);
  color: white;
}

/* Animations */
@keyframes slideFade {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}
</style>
