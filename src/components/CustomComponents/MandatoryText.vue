<template>
  <div class="mandatory-legend">
    <span class="mandatory-star">*</span>
    <span class="theme-color">
      {{ text }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "Symbol indicates a mandatory field"
  }
})
</script>