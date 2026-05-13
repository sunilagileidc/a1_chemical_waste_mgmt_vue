<template>
  <v-dialog v-model="dialogVisible" persistent max-width="800">
    <v-card>
      <v-card-title>
        <span>Image Upload</span>
      </v-card-title>
      <v-card-text>
        <input
          type="file"
          ref="fileInput"
          @change="onFileChange"
          accept="image/*"
        />
        <!-- <img :src="croppedImage" alt="Cropped Image" v-if="croppedImage" /> -->
        <vue-cropper ref="cropper" :options="cropperOptions"></vue-cropper>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="cancel">Cancel</v-btn>
        <v-btn color="primary" text @click="upload">Upload</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  components: {
    VueCropper,
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    dialog: {
      type: String,
      required: true,
    },
  },
  watch: {
    dialog: {
      immediate: true,
      handler() {
     
        this.dialogVisible=this.dialog
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      file: null,
      croppedImage: null,
      cropperOptions: {
        viewMode: 1,
        dragMode: "move",
        autoCrop: false,
        aspectRatio: this.width / this.height,
        responsive: true,
      },
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.croppedImage = e.target.result;
          this.$nextTick(() => {
            this.$refs.cropper.replace(this.croppedImage);
            this.$refs.cropper.setCropBoxData({
              width: this.width,
              height: this.height,
            });
          });
        };
        reader.readAsDataURL(file);
      }
    },
    upload() {
      const croppedCanvas = this.$refs.cropper.getCroppedCanvas({
        width: this.width,
        height: this.height,
      });
      croppedCanvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("image", blob, "croppedImage.jpg");
        // Make an HTTP request to upload the image using Axios or any other library
        // axios.post('/upload', formData)
        //   .then(response => {
        //     // Handle the response
        //   })
        //   .catch(error => {
        //     // Handle the error
        //   });
      });
      this.cancel();
    },
    cancel() {
      this.file = null;
      this.croppedImage = null;
      this.dialogVisible = false;
      this.$refs.fileInput.value = "";
      this.$refs.cropper.clear();
    },
  },
};
</script>
