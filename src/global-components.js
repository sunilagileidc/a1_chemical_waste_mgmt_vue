// Custom Components
import PageTitle from "@/components/CustomComponents/PageTitle.vue";
import ContentLoader from "@/components/CustomComponents/ContentLoader.vue";
import ConfirmationDialog from "@/components/CustomComponents/ConfirmationDialog.vue";
import NoDataFound from "@/components/CustomComponents/NoDataFound.vue";
import DocumentUpload from "@/components/CustomComponents/DocumentUpload.vue";
import HeaderPage from "@/components/CustomComponents/HeaderPage.vue";
import FooterPage from "@/components/CustomComponents/FooterPage.vue";
import PrescriberRegistration from "@/Admin/UserPages/PrescriberRegistration.vue";
import PharmacistRegistration from "@/Admin/UserPages/PharmacistRegistration.vue";
import StatsPage from "@/components/CustomComponents/Stats.vue";
import Checkbox from "@/components/CustomComponents/Checkbox.vue";
import Imageupload from "@/components/CustomComponents/ImageUpload.vue";
import AlertPopup from "@/components/CustomComponents/AlertPopup.vue";
import UserDrugs from "@/components/CustomComponents/UserDrugs.vue";
import DatePicker from "@/components/CustomComponents/DatePicker.vue";
import MandatoryText from "@/components/CustomComponents/MandatoryText.vue";
import PafHistory from "@/components/CustomComponents/PafHistory.vue";
import PafDownload from "@/components/Cruds/PAF/PafDownload.vue";
import UserAuthentication from "@/components/CustomComponents/UserAuthentication.vue";


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
    app.component("prescriber-registration", PrescriberRegistration);
    app.component("pharmacist-registration", PharmacistRegistration);
    app.component("stats-page", StatsPage);
    app.component("checkbox", Checkbox);
    app.component("image-upload", Imageupload);
    app.component("alert-popup", AlertPopup);
    app.component("user-drugs", UserDrugs);
    app.component("date-picker", DatePicker);
    app.component("mandatory-text", MandatoryText);
    app.component("paf-history", PafHistory);
    app.component("paf-download", PafDownload);
    app.component("user-authentication", UserAuthentication);
  },
};
