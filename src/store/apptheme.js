import { ref } from "vue";

export const apptheme = ref({
  theme_type: localStorage.getItem("theme-type"),
  setTheme() {
    this.theme_type = localStorage.getItem("theme-type");
  },
});