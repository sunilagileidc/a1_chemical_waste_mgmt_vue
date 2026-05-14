<template>
  <div>
    <v-text-field
      maxlength="11"
      ref="textfield"
      v-model="inputValue"
      :label="label"
      :rules="rules"
      :disabled="disable_field"
      :clearable="clearable"
      placeholder="dd/MMM/yyyy"
      variant="outlined"
      density="compact"
      hint="Format: DD/MMM/YYYY (e.g. 27/Mar/2026) or select from calendar"
      persistent-hint
      append-inner-icon="mdi-calendar"
      :class="class_required ? 'required_field' : ''"
      :hide-details="hide_details"
      :filled="filled"
      @click:append-inner.stop="openMenu" 
      @click:clear="clearDate"
      @blur="validateTypedDate"
      @keydown.enter="validateTypedDate"
      @input="handleTyping"
    />

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="bottom start"
      offset="8"
      transition="scale-transition"
      :target="textfieldEl"
      max-width="290"
    >
      <v-date-picker
        :min="min"
        :max="max"
        v-bind="$attrs"
        :model-value="internalDate"
        @update:modelValue="updateDate"
      />
    </v-menu>
  </div>
</template>

<script>
import { parse, isValid, format } from "date-fns";

export default {
  name: "EnhancedDatePicker",
  inheritAttrs: false,

  props: {
    modelValue: [String, Date],
    label: String,
    rules: { type: Array, default: () => [] },
    class_required: Boolean,
    disable_field: Boolean,
    hide_details: Boolean,
    filled: Boolean,
    min: { type: String, default: null },
    max: { type: String, default: null },
    clearable: { type: Boolean, default: true },
  },

  data() {
    return {
      menu: false,
      internalDate: this.modelValue || null,
      inputValue: "",
      textfieldEl: null,
    };
  },

  mounted() {
    this.textfieldEl = this.$refs.textfield?.$el;

    if (this.internalDate) {
      this.inputValue = this.formatDisplay(this.internalDate);
    }
  },

  watch: {
    modelValue(val) {
      this.internalDate = val;
      this.inputValue = val ? this.formatDisplay(val) : "";
    },
  },

  methods: {
    openMenu() {
      this.menu = true;
    },

    updateDate(date) {
      const selected = Array.isArray(date) ? date[0] : date;
      if (!selected) return;

      const formatted = format(new Date(selected), "yyyy-MM-dd");

      this.internalDate = formatted;
      this.inputValue = this.formatDisplay(formatted);
      this.menu = false;

      this.$emit("update:modelValue", formatted);
      this.$emit("change", formatted);
    },

    validateTypedDate() {
      if (!this.inputValue) return;

      const parsed = parse(this.inputValue, "dd/MMM/yyyy", new Date());

      if (!isValid(parsed)) {
        this.resetInput();
        return;
      }

      const formatted = format(parsed, "yyyy-MM-dd");

      const selectedDate = new Date(formatted);
      selectedDate.setHours(0, 0, 0, 0);

      const min = this.min ? new Date(this.min) : null;
      const max = this.max ? new Date(this.max) : null;

      if (min) min.setHours(0, 0, 0, 0);
      if (max) max.setHours(0, 0, 0, 0);

      if (min && selectedDate < min) return this.resetInput();
      if (max && selectedDate > max) return this.resetInput();

      this.internalDate = formatted;

      this.$emit("update:modelValue", formatted);
      this.$emit("change", formatted);
    },

    resetInput() {
      this.inputValue = this.internalDate
        ? this.formatDisplay(this.internalDate)
        : "";
    },

    handleTyping(e) {
      let value = e.target.value;

      // allow only letters, numbers and '/'
      value = value.replace(/[^0-9a-zA-Z/]/g, "");

      // auto add slashes
      if (value.length === 2 && !value.includes("/")) {
        value += "/";
      }

      if (value.length === 6 && value.split("/").length === 2) {
        value += "/";
      }

      this.inputValue = value;

      // validate when full length reached
      if (value.length >= 11) {
        this.validateTypedDate();
      }
    },

    clearDate() {
      this.internalDate = null;
      this.inputValue = "";

      this.$emit("update:modelValue", null);
      this.$emit("change", null);
    },

    formatDisplay(date) {
      return format(new Date(date), "dd/MMM/yyyy");
    },
  },
};
</script>
