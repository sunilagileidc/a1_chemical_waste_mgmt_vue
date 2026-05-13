<template>
  <div class="centered-container">
    <span class="text-label">Coming soon</span>
  </div>
</template>

<style scoped>
.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
}

.text-label {
  font-weight: bold;
  font-size: 40px;
  color: #808080ba;
  animation: fadeInUp 1s forwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
