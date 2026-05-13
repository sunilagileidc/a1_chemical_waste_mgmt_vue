import * as dateFns from "date-fns";
export const dateMixin = {
  methods: {
    formatDate(value) {
      const date = new Date(value);
      return dateFns.format(date, "dd-MM-yyyy");
    },
    formatDatewithshortMonth(value) {
      const date = new Date(value);
      return dateFns.format(date, "dd-MMM-yyyy");
    },
    formatTime(value) {
      const date = new Date(value);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },
    formatDateTime(value) {
      const date = new Date(value);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    },
    formatDateString(value) {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    formatMonthstring(value) {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric'
        });
    },
  },
};
