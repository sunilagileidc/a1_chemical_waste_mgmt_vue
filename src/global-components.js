// Custom Components
import PageTitle from "@/components/CustomComponents/PageTitle.vue";
import ContentLoader from "@/components/CustomComponents/ContentLoader.vue";
import ConfirmationDialog from "@/components/CustomComponents/ConfirmationDialog.vue";
import NoDataFound from "@/components/CustomComponents/NoDataFound.vue";
import DocumentUpload from "@/components/CustomComponents/DocumentUpload.vue";
import HeaderPage from "@/components/CustomComponents/HeaderPage.vue";
import FooterPage from "@/components/CustomComponents/FooterPage.vue";

// Third-party Components
import VOtpInput from "vue3-otp-input";

export default {
  install(app) {
    app.component("page-title", PageTitle);
    app.component("content-loader", ContentLoader);
    app.component("v-otp-input", VOtpInput);
    app.component("confirmation-dialog", ConfirmationDialog);
    app.component("no-data-found", NoDataFound);
    app.component("document-upload", DocumentUpload);
    app.component("header-page", HeaderPage);
    app.component("footer-page", FooterPage);
  },
};
