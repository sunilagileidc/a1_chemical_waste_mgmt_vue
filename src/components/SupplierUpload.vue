<template>
    <v-card class="upload-wrapper elevation-2">

        <!-- HEADER -->
        <div class="upload-header" @click="toggle">
            <div class="left">
                <v-icon class="mr-2" color="primary">{{ icon }}</v-icon>
                <span class="title-text">{{ title }}</span>
            </div>

            <v-icon class="toggle-icon">
                {{ isOpen ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
        </div>

        <!-- BODY -->
        <v-expand-transition>
            <div v-show="isOpen" class="upload-body">

                <v-row>

                    <!-- LEFT SIDE (UPLOAD BOX) -->
                    <v-col cols="12" md="7">
                        <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop">
                            <v-icon size="40" color="primary">mdi-file-upload-outline</v-icon>

                            <p class="main-text">
                                Drag & Drop your file here
                            </p>

                            <p class="sub-text">
                                or click below to browse
                            </p>

                            <v-file-input v-model="file" accept=".xlsx,.xls,.csv" hide-details variant="plain"
                                class="file-input"></v-file-input>

                            <div v-if="file" class="file-name">
                                📄 {{ file.name }}
                            </div>

                            <v-btn color="primary" class="upload-btn" :loading="loading" :disabled="!file"
                                @click.stop="uploadFile">
                                Upload File
                            </v-btn>
                        </div>
                    </v-col>

                    <!-- RIGHT SIDE (REFERENCE) -->
                    <v-col cols="12" md="5">
                        <div class="reference-card">
                            <v-icon size="30" color="secondary">mdi-file-document-outline</v-icon>

                            <h4 class="ref-title">Sample Format</h4>

                            <p class="ref-text">
                                {{ subtitle }}
                            </p>

                            <v-btn variant="outlined" color="secondary" :href="referenceFile" target="_blank">
                                Download Sample
                            </v-btn>
                        </div>
                    </v-col>

                </v-row>

            </div>
        </v-expand-transition>

    </v-card>
</template>

<script>
export default {
    name: "SupplierUpload",

    props: {
        uploadUrl: String,
        referenceFile: String,
        title: {
            type: String,
            default: "Upload Document",
        },
        subtitle: {
            type: String,
            default: "Upload your file using the supported format.",
        },
        icon: {
            type: String,
            default: "mdi-cloud-upload-outline",
        },
        open: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            isOpen: this.open,
            file: null,
            loading: false,
        };
    },

    watch: {
        open(val) {
            this.isOpen = val;
        },
    },

    methods: {
        toggle() {
            this.isOpen = !this.isOpen;
            this.$emit("update:open", this.isOpen);
        },

        handleDrop(e) {
            const files = e.dataTransfer.files;
            if (files.length) {
                this.file = files[0];
            }
        },

        async uploadFile() {
            if (!this.file) return;

            this.loading = true;

            const formData = new FormData();
            formData.append("file", this.file);

            try {
                const res = await this.$axios.post(this.uploadUrl, formData);

                if (res.data.status === "S") {
                    this.$toast.success(res.data.message);
                    this.$emit("refresh");
                    this.file = null;
                } else {
                    this.$toast.error(res.data.message);
                }
            } catch (e) {
                this.$toast.error("Upload failed. Please try again.");
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
/* CARD */
.upload-wrapper {
    border-radius: 14px;
    overflow: hidden;
}

/* HEADER */
.upload-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    cursor: pointer;
    background: linear-gradient(135deg, #f5f7fa, #eef1f5);
}

.title-text {
    font-size: 14px;
    font-weight: 600;
}

.left {
    display: flex;
    align-items: center;
}

.toggle-icon {
    transition: 0.3s;
}

/* BODY */
.upload-body {
    padding: 20px;
}

/* DROP ZONE */
.drop-zone {
    border: 2px dashed #cfd8dc;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    transition: 0.3s;
    background: #fafafa;
}

.drop-zone:hover {
    border-color: #1976d2;
    background: #f0f7ff;
}

.main-text {
    font-size: 15px;
    font-weight: 500;
    margin-top: 10px;
}

.sub-text {
    font-size: 12px;
    color: #777;
    margin-bottom: 10px;
}

.file-input {
    max-width: 200px;
    margin: auto;
}

.file-name {
    font-size: 12px;
    color: #444;
    margin-top: 8px;
}

/* BUTTON */
.upload-btn {
    margin-top: 15px;
    border-radius: 8px;
}

/* REFERENCE CARD */
.reference-card {
    background: #f9fbfd;
    border-radius: 12px;
    padding: 25px;
    text-align: center;
    height: 100%;
}

.ref-title {
    font-size: 14px;
    font-weight: 600;
    margin-top: 10px;
}

.ref-text {
    font-size: 12px;
    color: #666;
    margin: 10px 0 15px;
}
</style>