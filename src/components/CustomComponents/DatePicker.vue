<template>
  <div>
    <v-menu
      ref="menu1"
      v-model="menu1"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
      :close-on-content-click="false"
      :return-value="show_date"
    >
      <template v-slot:activator="{ props }">
        <v-text-field
          density="compact"
          v-model="DateFormatted"
          :label="label"
          :rules="fieldRules"
          append-inner-icon="mdi-calendar"
          :readonly="true"
          :disabled="disable_field"
          v-bind:class="class_required ? 'required_field' : ''"
          variant="outlined"
          @blur="date = parseDate(dateFormatted)"
          v-bind="props"
        ></v-text-field>
      </template>
      <datepicker
        @selected="handleSelectDate"
        :disabled-dates="disabledDates"
        :prevent-disable-date-selection="preventDisableDateSelection"
        v-model="show_date"
        inline="true"
        format="dd/MMM/yyyy"
        @input="selectdatemodel()"
        class="datepickerpackage"
      >
      </datepicker>
    </v-menu>
  </div>
</template>

<script>
import Datepicker from "vuejs3-datepicker";
export default {
  props: [
    "label",
    "max",
    "min",
    "translation",
    "stored_date",
    "rules",
    "class_required",
    "disable_field",
    "list_index",
    "array_index",
    "slot_index",
  ],
  components: {
    Datepicker,
  },
  data: () => ({
    show_date: "",
    padStart: "",
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    //dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    menu1: false,

    disabledDates: {
      to: "",
      from: "",
      preventDisableDateSelection: true,
    },
    // disabledDates: {
    //   to: '',
    //   from: new Date(2024, 1, 29), // Disable all dates after specific date

    //   preventDisableDateSelection: true
    // }
  }),

  computed: {
    fieldRules() {
      if (this.translation == "arabic") {
        return [(v) => !!v || !this.rules || this.$t("field_required_ar")];
      } else {
        return [(v) => !!v || !this.rules || this.$t("field_required")];
      }
    },

    DateFormatted() {
      if (this.array_index != null) {
        // console.log('inside if');
        this.$emit("formatted_date", this.show_date, this.array_index);
        return this.formatDate(this.show_date);
      } else {
        // console.log('inside else');
        if (this.list_index >= 0) {
          this.$emit("formatted_date_index", this.show_date, this.list_index);
          return this.formatDate(this.show_date);
        } else {
          if (this.slot_index>=0) {
            this.$emit("formatted_service_start_date", this.slot_index,this.show_date);
          } else {
            this.$emit("formatted_date", this.show_date);
          }
          return this.formatDate(this.show_date);
        }
      }
    },
  },

  watch: {
    stored_date: {
      immediate: true,
      handler() {
        if (this.stored_date == "") {
          this.show_date = "";
        } else {
          this.show_date = this.stored_date;
        }
      },
    },
    min: {
      immediate: true,
      handler() {
        if (this.min) {
          this.disabledDates.to = new Date(
            this.min.split("-")[0],
            this.min.split("-")[1] - 1,
            this.min.split("-")[2]
          );
        } else {
          this.disabledDates.to = "";
        }
      },
    },
    max: {
      immediate: true,
      handler() {
        if (this.max) {
          const dateObject = new Date(
            this.max.split("-")[0],
            this.max.split("-")[1] - 1,
            this.max.split("-")[2]
          );
          dateObject.setDate(dateObject.getDate() + 1);
          this.disabledDates.from = dateObject;
        } else {
          this.disabledDates.from = "";
        }
      },
    },
    date() {
      this.dateFormatted = this.formatDate(this.show_date);
    },
    menu(val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
  methods: {
    handleSelectDate() {
      this.$emit("on-change");
    },
    selectdatemodel() {
      this.menu1 = false;
      const emitDate = this.show_date.toISOString().substring(0, 10);
      this.$emit("formatted_date", emitDate);
      return this.formatDate(emitDate);
    },

    formatDate(date) {
      if (!date) {
        return null;
      } else {
        const formatted_date =
          ("0" + new Date(this.show_date).getDate()).slice(-2) +
          "/" +
          ("0" + (new Date(this.show_date).getMonth() + 1)).slice(-2) +
          "/" +
          new Date(this.show_date).getFullYear();
        return formatted_date;
      }
    },
    parseDate(date) {
      if (!date) {
        return null;
      } else {
        const formatted_date =
          ("0" + new Date(this.show_date).getDate()).slice(-2) +
          "/" +
          ("0" + (new Date(this.show_date).getMonth() + 1)).slice(-2) +
          "/" +
          new Date(this.show_date).getFullYear();
        return formatted_date;
      }
    },
  },
};
</script>
<style scoped>
.datepickerpackage :deep(.vuejs3-datepicker__calendar-topbar) {
  display: none !important;
}
</style>
