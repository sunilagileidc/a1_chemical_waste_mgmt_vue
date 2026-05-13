<template>
  <div class="top-bar-wrapper">
    <div class="top-bar-container">
      
      <!-- LEFT: LOGO -->
      <div 
        class="logo"
        @click="$router.push('/')"
      >
        <img src="@/assets/images/headericon.png" alt="ePAF Logo" />
      </div>

      <!-- RIGHT: BUTTONS -->
      <div class="auth-buttons">
        <button
          class="btn-outline"
          @click="$router.push({ name: 'register_user' })"
        >
          Register →
        </button>

        <button
          class="btn-filled"
          @click="$router.push({ name: 'login' })"
        >
          Login →
        </button>
      </div>

    </div>
  </div>
</template>
<style scoped>

/* OUTER WRAPPER */
.top-bar-wrapper {
  width: 100%;
  background: #f4f6fb; /* page light background */
}

/* ROUNDED BAR */
.top-bar-container {
  margin: 0 auto;
  background: #e9ecf3; /* light grey container */
  border-radius: 20px;
  padding: 10px 30px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* LOGO */
.logo img {
  height: 45px;
  cursor: pointer;
  object-fit: contain;
}

/* BUTTON WRAPPER */
.auth-buttons {
  display: flex;
  gap: 16px;
}

/* OUTLINE BUTTON (Register) */
.btn-outline {
  padding: 10px 22px;
  border-radius: 30px;
  border: 2px solid #6c63ff;
  background: transparent;
  color: #6c63ff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-outline:hover {
  background: #6c63ff;
  color: white;
}

/* FILLED BUTTON (Login) */
.btn-filled {
  padding: 10px 22px;
  border-radius: 30px;
  border: none;
  background: linear-gradient(90deg, #6c63ff, #7c4dff);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-filled:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(108, 99, 255, 0.3);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .top-bar-container {
    padding: 15px 20px;
  }

  .logo img {
    height: 35px;
  }

  .btn-outline,
  .btn-filled {
    padding: 8px 16px;
    font-size: 13px;
  }
}

</style>
