<template>
  <div class="file-upload-wrapper">
    <!-- ================= Uploaded View ================= -->
    <div v-if="fileData.file_path" class="d-flex align-center ga-2">
      <v-tooltip text="Download file">
        <template #activator="{ props }">
          <a :href="fullPath" download>
            <v-chip v-bind="props" size="small" class="cursor-pointer">
              <v-icon start size="16">mdi-file</v-icon>
              {{ fileData.file_name }}
            </v-chip>
          </a>
        </template>
      </v-tooltip>

      <v-tooltip text="Remove file" v-if="!disabled">
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            size="18"
            color="red"
            class="cursor-pointer"
            @click="removeFile"
          >
            mdi-close
          </v-icon>
        </template>
      </v-tooltip>
    </div>

    <!-- ================= Upload Input ================= -->
    <v-file-input
      v-else
      :label="label"
      :disabled="disabled"
      :rules="inputRules"
      variant="outlined"
      density="compact"
      show-size
      prepend-icon=""
      append-inner-icon="mdi-file-document-plus"
      accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
      @update:modelValue="onFileChange"
    />
  </div>
</template>

<script>
export default {
  name: "DocumentUpload",

  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    folder: String,
    label: {
      type: String,
      default: "Upload File",
    },
    disabled: Boolean,
    baseUrl: {
      type: String,
      default: "/storage/",
    },
    required: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue", "uploaded", "removed"],

  computed: {
    fileData() {
      return this.modelValue || {};
    },

    fullPath() {
      return this.baseUrl + (this.fileData.file_path || "");
    },
    inputRules() {
      if (!this.required) return [];

      return [(v) => !!this.fileData?.file_path || "Document is required"];
    },
  },

  methods: {
    toBase64(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
    },

    async onFileChange(files) {
      const file = Array.isArray(files) ? files[0] : files;
      if (!file) return;

      const base64 = await this.toBase64(file);

      const payload = {
        image: base64,
        folder: this.folder,
        filename: file.name.split(".")[0],
        extension: file.name.split(".").pop(),
      };

      const res = await this.$axios.post("upload_file", payload);

      const fileObject = {
        file_name: file.name,
        file_path: res.data.path,
        file_size: file.size,
        file_type: file.name.split(".").pop(),
        mime: file.type,
      };

      this.$emit("update:modelValue", fileObject);
      this.$emit("uploaded", fileObject);
    },

    removeFile() {
      this.$emit("update:modelValue", {});
      this.$emit("removed");
    },
  },
};
</script>

<style scoped>
.file-upload-wrapper {
  width: 100%;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
