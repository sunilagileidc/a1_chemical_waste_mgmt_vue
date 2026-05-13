<template>
  <v-dialog v-model="dialog" width="800">
    <v-card>
      <v-card-title class="dialog-header">
        <span class="text-h5">{{ $t("rejection_comment") }}</span>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="tabs" color="blue">
          <v-tab :value="1">
            <span>{{ $t("english") }}</span>
          </v-tab>

          <v-tab :value="2">
            <span>{{ $t("arabic") }}</span>
          </v-tab>
        </v-tabs>
        <v-window v-model="tabs">
          <v-window-item :value="1">
            <v-tooltip :text="this.$t('comments_en')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-textarea
                  class="mt-5"
                  v-on="on"
                  rows="5"
                  v-model="comment_en"
                  v-bind="props"
                  v-bind:label="$t('comments_en')"
                  variant="outlined"
                  maxlength="2000"
                  counter="true"
                ></v-textarea>
              </template>
            </v-tooltip>
          </v-window-item>
          <v-window-item :value="2">
            <v-tooltip :text="this.$t('comments_ar')" location="bottom">
              <template v-slot:activator="{ props }">
                <v-textarea
                  class="mt-5 ar-text-field"
                  v-on="on"
                  rows="5"
                  v-model="comment_ar"
                  v-bind="props"
                  v-bind:label="$t('comments_ar')"
                  variant="outlined"
                  maxlength="2000"
                  counter="true"
                ></v-textarea>
              </template>
            </v-tooltip>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions class="mr-2">
        <v-spacer></v-spacer>
        <v-tooltip :text="this.$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-on="on" class="d-inline-block mr-2">
              <v-btn
                v-on="on"
                x-small
                size="small"
                v-bind="props"
                style="background: black; color: white"
                @click="cancel()"
                >{{ $t("cancel") }}</v-btn
              >
            </div>
          </template>
          <span>{{ $t("cancel") }}</span>
        </v-tooltip>
        <v-tooltip :text="this.$t('submit')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block">
              <v-btn
                @click="submit()"
                size="small"
                class="mr-2"
                style="background: green; color: white"
              >
                {{ $t("submit") }}
              </v-btn>
            </div>
          </template>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: [],
  data: () => ({
    comment_en: "",
    comment_ar: "",
    dialog: true,
    tabs: 1,
  }),
  methods: {
    cancel() {
      this.$emit("close-dialog");
    },
    submit() {
      this.$emit("submit-data", this.comment_en, this.comment_ar);
    },
  },
};
</script>

<style scoped>
.ar-text-field :deep(textarea){
    direction: rtl;
}
</style>