<template>
  <div>
    <v-dialog v-model="dialogVisible" max-width="500px" persistent>
      <content-loader v-if="loader"></content-loader>

      <v-card>
        <v-card-title>{{ $t("crop_image") }} </v-card-title>
        <v-card-text>
          <div class="cropper-container" ref="cropperContainer">
            <!-- Below one is porp can be used where we can define all the props in data and pass like below one -->
            <!-- :options="cropperOptions" -->
            <VueCropper
              ref="cropper"
              :dragMode="'none'"
              :src="selectedFile"
              :view-mode="1"
              cropBoxResizable="true"
              cropBoxMovable="true"
              :minCropBoxWidth="600"
              :minCropBoxHeight="150"
              autoCrop="true"
              :img-style="{ width: '500px', height: '400px' }"
              v-bind="$attrs"
              @crop="handleCrop"
              @ready="cropperReady"
            ></VueCropper>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="cropImage">{{ $t("upload") }}</v-btn>
          <v-btn color="error" @click="cancelCrop">{{ $t("cancel") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <input
      type="file"
      @change="onFileChange"
      accept="image/*"
      ref="fileInput"
      style="display: none"
      id="file"
    />
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import VueCropper from "vue-cropperjs";

export default {
  name: "ImageUploadCropper",
  components: {
    VueCropper,
  },
  props: {
    resizewidth: {
      type: Number,
      default: 0.3,
    },
    resizeheight: {
      type: Number,
      default: 0.2,
    },
    folder: {
      type: String,
      default: "others",
    },
    upload_profile: {},
  },
  data() {
    return {
      selectedFile: null,
      message: "",
      dialogVisible: false,
      loader: false,
      //Below are the options that are there in Cropper
      cropperOptions: {
        aspectRatio: 12 / 12,
        viewMode: 1,
        autoCropArea: 1,
        movable: false,
        scalable: false,
        zoomable: false,
        rotatable: false,
        checkCrossOrigin: false,
        checkOrientation: false,
        cropBoxResizable: false,
      },
      cropper: null,
      cropperInstance: null,
      imagedata: "",
    };
  },
  watch: {
    upload_profile() {
      document.getElementById("file").click();
    },
  },
  methods: {
    handleCrop() {
      if (this.selectedFile && this.$refs.cropper) {
        const croppedCanvas = this.$refs.cropper.getCroppedCanvas();
        // Use the cropped canvas as needed
        this.imagedata = croppedCanvas.toDataURL();
      }
    },
    cropperReady() {
      const cropper_data = this.$refs.cropper;
      if (cropper_data) {
        const cropBoxData = cropper_data.getCropBoxData();
        const newWidth = cropBoxData.width * this.resizewidth; // Example: Reduce width by 20%
        const newHeight = cropBoxData.height * this.resizeheight; // Example: Reduce height by 20%
        cropper_data.setCropBoxData({
          ...cropBoxData,
          width: newWidth,
          height: newHeight,
        });
      }
    },

    openFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      const filename = event.target.files[0].name;
      if (file) {
        this.selectedFile = URL.createObjectURL(file);
        console.log("all files are ", event.target.files[0]);
        const lastDot = filename.lastIndexOf(".");
        const fileNameWithoutExt = filename.substring(0, lastDot);
        const ext = filename.substring(lastDot + 1);
        console.log("FileName => " + fileNameWithoutExt);
        this.filename = fileNameWithoutExt;
        console.log("Extension => " + ext);
        this.extension = ext;
        this.dialogVisible = true;
      } else {
        this.selectedFile = null;
        this.dialogVisible = false;
      }
    },

    cropImage() {
      if (this.imagedata) {
        this.upload(this.imagedata);
      }
    },

    upload(imagedata) {
      this.loader = true;
      if (!imagedata) {
        this.message = "Please select a file!";
        return;
      }

      this.message = "";
      this.$axios
        .post("imageupload", {
          image: imagedata,
          folder: this.folder,
          filename: this.filename,
          extension: this.extension,
        })
        .then((res) => {
          this.loader = false;
          console.log(res.data);
          this.imageloading = false;
          if (res.data.status == "S") {
            this.message = res.data.message;
            this.icon = res.data.filepath;
            this.selectedFile = null;
            this.dialogVisible = false;
            this.$emit("uploaded_image", res.data.filepath);
          } else {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          this.loader = false;
          this.imageloading = false;
          alert("Unable to upload file, try later");
          console.log("this error -> " + err);
        });
    },
    cancelCrop() {
      // Reset the selected file and cropper
      this.selectedFile = null;
      this.dialogVisible = false;
      // this.cropperInstance.reset();
    },
  },
};
</script>

<style scoped>
.cropper-container .cropper-view-box,
.cropper-container .cropper-face {
  min-width: 200px !important; /* Set your desired minimum width here */
  min-height: 10px !important; /* Set your desired minimum width here */
}
</style>
