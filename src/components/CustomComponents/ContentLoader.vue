<template>
  <v-overlay
    v-model="loader"
    persistent
    class="pharma-overlay"
  >
    <div class="loader-card">

      <!-- Medical cross glow -->
      <div class="cross-wrapper">
        <div class="medical-cross">
          <span class="v"></span>
          <span class="h"></span>
        </div>
      </div>

      <!-- Rotating capsule -->
      <div class="capsule-rotate">
        <div class="capsule">
          <div class="cap left"></div>
          <div class="divider"></div>
          <div class="cap right"></div>
        </div>
      </div>

      <!-- ECG line -->
      <svg class="ecg" viewBox="0 0 120 30">
        <polyline
          points="0,15 15,15 22,6 30,24 38,15 55,15 62,6 70,24 78,15 120,15"
        />
      </svg>

      <!-- Text -->
      <div class="loading-text">
        Preparing your medicines…
      </div>

    </div>
  </v-overlay>
</template>

<script>
export default {
  name: "PharmacyLoader",
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    loader: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700&display=swap");

/* ─── Overlay ─────────────────────────────────────────────── */
.pharma-overlay {
  background: rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Nunito", sans-serif;
}

/* ─── Card ────────────────────────────────────────────────── */
.loader-card {
  width: 220px;
  padding: 28px 22px 26px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px);
  box-shadow:
    0 14px 40px rgba(0, 0, 0, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.45);
  /* text-align: center; */
}
.loader-card {
  position: relative;
  border: 2px solid rgba(42, 157, 143, 0.35);
  animation: borderFade 2.4s ease-in-out infinite;
}
@keyframes borderFade {
  0%, 100% {
    border-color: rgba(42, 157, 143, 0.25);
  }
  50% {
    border-color: rgba(42, 157, 143, 0.85);
  }
}

/* ─── Cross glow ──────────────────────────────────────────── */
.cross-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.medical-cross {
  position: relative;
  width: 28px;
  height: 28px;
  animation: glow 2s ease-in-out infinite;
}

.medical-cross span {
  position: absolute;
  background: #2a9d8f;
  border-radius: 4px;
}

.medical-cross .v {
  width: 6px;
  height: 28px;
  left: 50%;
  transform: translateX(-50%);
}

.medical-cross .h {
  width: 28px;
  height: 6px;
  top: 50%;
  transform: translateY(-50%);
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 6px rgba(42,157,143,0.4); }
  50% { box-shadow: 0 0 14px rgba(42,157,143,0.9); }
}

/* ─── Capsule rotation ────────────────────────────────────── */
.capsule-rotate {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  animation: spin 2.2s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}

.capsule {
  width: 90px;
  height: 34px;
  border-radius: 40px;
  display: flex;
  overflow: hidden;
}

.cap.left {
  flex: 1;
  background: linear-gradient(135deg, #ff6b6b, #ff9a9a);
}

.cap.right {
  flex: 1;
  background: linear-gradient(135deg, #ffffff, #f1f1f1);
}

.divider {
  width: 3px;
  background: rgba(0, 0, 0, 0.15);
}

/* ─── ECG animation ───────────────────────────────────────── */
.ecg {
  width: 100%;
  height: 30px;
  margin-bottom: 12px;
}

.ecg polyline {
  fill: none;
  stroke: #2a9d8f;
  stroke-width: 2;
  stroke-dasharray: 120;
  stroke-dashoffset: 120;
  animation: ecgMove 1.6s linear infinite;
}

@keyframes ecgMove {
  to {
    stroke-dashoffset: 0;
  }
}

/* ─── Text ────────────────────────────────────────────────── */
.loading-text {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.4px;
  color: #2a9d8f;
}

/* ─── Reduced motion ──────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
  }
}
</style>
