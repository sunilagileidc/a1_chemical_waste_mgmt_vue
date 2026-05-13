<template>
  <div class="role-menu-wrapper">
    <content-loader v-if="loader" />

    <v-card v-else class="menu-card" elevation="2">
      <v-card-text class="pa-4">
        <!-- Search Field -->
        <div style="max-width: 380px">
          <v-text-field
            v-model="search"
            placeholder="Search menu..."
            prepend-inner-icon="mdi-magnify"
            density="compact"
            variant="outlined"
            hide-details
            clearable
            class="mb-3"
          />
        </div>

        <!-- Tree List -->
        <v-list v-model:opened="opened" density="compact" class="role-tree">
          <template v-for="(item, i) in filteredItems" :key="i">
            <!-- IF HAS CHILDREN -->
            <v-list-group
              v-if="item.children && item.children.length > 0"
              :value="item.id"
              class="tree-parent"
            >
              <template #activator="{ props }">
                <v-list-item v-bind="props" class="tree-parent-item">
                  <v-checkbox
                    v-if="selected.includes(item.id)"
                    :model-value="true"
                    @click.stop="updateMenuAssignment(false, item)"
                    :label="item.name"
                    density="compact"
                    hide-details
                    class="ma-0 pa-0"
                  />

                  <v-checkbox
                    v-else
                    :model-value="false"
                    @click.stop="updateMenuAssignment(true, item)"
                    :label="item.name"
                    density="compact"
                    hide-details
                    class="ma-0 pa-0"
                  />
                </v-list-item>
              </template>

              <!-- Children -->
              <v-list-item
                v-for="(child, j) in item.children"
                :key="j"
                class="tree-child-item"
              >
                <v-checkbox
                  v-if="selected.includes(child.id)"
                  :model-value="true"
                  @click.stop="updateMenuAssignment(false, child)"
                  :label="child.name"
                  density="compact"
                  hide-details
                  class="ma-0 pa-0"
                />

                <v-checkbox
                  v-else
                  :model-value="false"
                  @click.stop="updateMenuAssignment(true, child)"
                  :label="child.name"
                  density="compact"
                  hide-details
                  class="ma-0 pa-0"
                />
              </v-list-item>
            </v-list-group>

            <!-- IF NO CHILDREN -->
            <v-list-item v-else class="tree-parent-item no-arrow-item">
              <v-checkbox
                v-if="selected.includes(item.id)"
                :model-value="true"
                @click.stop="updateMenuAssignment(false, item)"
                :label="item.name"
                density="compact"
                hide-details
                class="ma-0 pa-0"
              />

              <v-checkbox
                v-else
                :model-value="false"
                @click.stop="updateMenuAssignment(true, item)"
                :label="item.name"
                density="compact"
                hide-details
                class="ma-0 pa-0"
              />
            </v-list-item>
          </template>
        </v-list>
      </v-card-text>

      <v-divider />

      <!-- Footer -->
      <div class="menu-footer">
        <!-- Cancel -->
        <v-tooltip :text="$t('cancel')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block mr-2">
              <v-btn
                v-bind="props"
                size="small"
                @click="$router.go(-1)"
                :disabled="isDisabled"
                class="ma-1"
                color="cancel"
              >
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </template>
        </v-tooltip>

        <!-- Submit -->
        <v-tooltip :text="$t('submit')" location="bottom">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="d-inline-block">
              <v-btn
                :disabled="isDisabled"
                @click="save()"
                size="small"
                class="mr-2"
                color="success"
              >
                {{ $t("submit") }}

                <v-progress-circular
                  v-if="isDisabled"
                  indeterminate
                  width="1"
                  size="x-small"
                  class="ml-2"
                />
              </v-btn>
            </div>
          </template>
        </v-tooltip>
      </div>
    </v-card>
  </div>
</template>

<script>
import PageTitle from "../../CustomComponents/PageTitle.vue";

export default {
  components: { PageTitle },

  data: () => ({
    google_icon: {
      icon_name: "edit_note",
      color: "google_icon_gradient",
      icon: "material-symbols-outlined",
    },
    selected: [],
    items: [],
    opened: [],
    search: "",
    message: "",
    isBtnLoading: false,
    isDisabled: false,
    loader: false,
    isChecked: [],
  }),

  computed: {
    filteredItems() {
      if (!this.search) return this.items;

      const searchLower = this.search.toLowerCase();

      return this.items
        .map((item) => {
          const filteredChildren = (item.children || []).filter((child) =>
            child.name.toLowerCase().includes(searchLower)
          );

          if (
            item.name.toLowerCase().includes(searchLower) ||
            filteredChildren.length > 0
          ) {
            return {
              ...item,
              children: filteredChildren,
            };
          }

          return null;
        })
        .filter(Boolean);
    },
  },

  watch: {
    "$route.query.slug": {
      immediate: true,
      handler() {
        if (this.$route.query.slug) {
          this.loader = true;
          this.$axios
            .get("rolemenu")
            .then((res) => {
              if (Array.isArray(res.data.message)) {
                this.array_data = res.data.message.toString();
              } else {
                this.array_data = res.data.message;
              }

              if (res.data.status == "S") {
                this.items = res.data.menu;

                this.opened = this.items
                  .filter((item) => item.children && item.children.length > 0)
                  .map((item) => item.id);

                this.selectedmenus(this.$route.query.id);
              } else {
                this.$toast.error(this.array_data);
              }
            })
            .catch((err) => {
              this.loader = false;
              this.$toast.error(this.$t("something_went_wrong"));
              console.log(err);
            });
        }
      },
    },
  },

  methods: {
    updateMenuAssignment(value, item) {
      if (value === true) {
        if (!item.children || item.children.length == 0) {
          this.selected.push(item.id);
        } else {
          this.selected.push(item.id);
          item.children.forEach((child) => {
            this.selected.push(child.id);
          });
        }
      } else {
        if (!item.children || item.children.length == 0) {
          this.selected = this.selected.filter((menu) => menu !== item.id);
        } else {
          this.selected = this.selected.filter((menu) => menu !== item.id);
          item.children.forEach((child) => {
            this.selected = this.selected.filter((menu) => menu !== child.id);
          });
        }
      }
    },

    selectedmenus(roleid) {
      this.loader = true;
      this.$axios
        .get("getmenuaccess/" + roleid)
        .then((res) => {
          if (res.data.status == "S") {
            this.selected = JSON.parse(JSON.stringify(res.data.selected_menu));
          }
          this.loader = false;
        })
        .catch(() => {
          this.loader = false;
          this.$toast.error(this.$t("something_went_wrong"));
        });
    },

    save() {
      this.isDisabled = true;
      this.loader = true;

      this.$axios
        .post("storemenuaccess", {
          role_id: this.$route.query.id,
          role_access: this.selected,
        })
        .then((res) => {
          this.loader = false;

          if (res.data.status == "S") {
            this.emitter.emit("fetchAssignedMenus");
            this.$toast.success(res.data.message);
            this.$router.push({ name: "roles" });
          } else {
            this.isDisabled = false;
            this.$toast.error(this.$t("something_went_wrong"));
          }
        })
        .catch(() => {
          this.isDisabled = false;
          this.$toast.error(this.$t("something_went_wrong"));
        });
    },
  },
};
</script>

<style scoped>
.role-menu-wrapper {
  padding: 16px;
}

.menu-card {
  border-radius: 14px;
}

.role-tree {
  padding-left: 4px;
}

.tree-parent-item {
  min-height: 36px !important;
  border-radius: 8px;
  transition: 0.2s ease;
}

.tree-parent-item:hover {
  background: #f5f5f5;
}

.tree-child-item {
  padding-left: 32px !important;
  min-height: 34px !important;
  border-radius: 6px;
  transition: 0.2s ease;
}

.tree-child-item:hover {
  background: #fafafa;
}

.menu-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
}
</style>
