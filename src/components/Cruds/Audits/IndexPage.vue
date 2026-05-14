<template>
  <v-container fluid class="audit-wrapper">
    <content-loader v-if="loader"></content-loader>
    <v-row no-gutters>

      <!-- LEFT PANEL (20%) -->
      <v-col cols="12" md="3" class="left-panel">
        <v-card flat class="menu-card">
          <div class="menu-title">Modules</div>

          <v-list dense nav>
            <v-list-item v-for="module in modules" :key="module" @click="selectModule(module)"
              :class="['menu-item', { active: module === selectedModule }]">
              <v-list-item-title>{{ module }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- RIGHT PANEL (80%) -->
      <v-col cols="12" md="9" class="right-panel">
        <v-card flat class="pa-4 content-card">

          <!-- HEADER -->
          <div class="d-flex justify-space-between align-center mb-4">
            <div>
              <div class="title">Audit Logs</div>
              <div class="subtitle">{{ selectedModule }}</div>
            </div>

            <!-- 🔍 SEARCH -->
            <v-text-field v-model="search" placeholder="Search audits..." dense outlined hide-details clearable
              prepend-inner-icon="mdi-magnify" class="search-field" />
          </div>

          <!-- AUDIT LIST -->
          <div v-for="audit in filteredAudits" :key="audit.id" class="audit-row">

            <!-- ICON -->
            <div class="icon-wrapper" :class="audit.action.toLowerCase()">
              <v-icon size="18">{{ getIcon(audit.action) }}</v-icon>
            </div>

            <!-- CONTENT -->
            <div class="audit-content">

              <!-- TOP -->
              <div class="d-flex justify-space-between align-center">
                <div class="action-title">
                  {{ audit.action }} • {{ audit.module }}
                </div>

                <div class="time">
                  {{ formatDate(audit.created_at) }}
                </div>
              </div>

              <!-- DESCRIPTION -->
              <div class="description">
                {{ truncateText(formatAuditMessage(audit), 120) }}
              </div>

              <!-- META -->
              <div class="meta">
                👤 {{ audit.user?.full_name || "Unknown" }}
                • 🌐 {{ getBrowser(audit.user_agent) }}
                • 📍 {{ audit.ip_address }}
              </div>

              <!-- EXPAND ICON -->
              <div class="expand-btn">
                <v-icon small @click="toggleExpand(audit.id)">
                  {{ expanded.includes(audit.id)
                    ? "mdi-chevron-up"
                    : "mdi-chevron-down" }}
                </v-icon>
              </div>

              <!-- DETAILS -->
              <v-expand-transition>
                <div v-if="expanded.includes(audit.id)" class="details">

                  <div><strong>URL:</strong> {{ audit.url }}</div>
                  <div><strong>Status:</strong> {{ audit.status }}</div>

                  <div v-if="audit.new_values" class="mt-2">
                    <strong>New Values:</strong>
                    <pre>{{ formatJson(audit.new_values) }}</pre>
                  </div>

                  <div v-if="audit.old_values" class="mt-2">
                    <strong>Old Values:</strong>
                    <pre>{{ formatJson(audit.old_values) }}</pre>
                  </div>

                </div>
              </v-expand-transition>

            </div>
          </div>

          <!-- EMPTY STATE -->
          <div v-if="filteredAudits.length === 0" class="no-data">
            No audit records found
          </div>

        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      modules: [],
      audits: [],
      selectedModule: null,
      expanded: [],
      search: "", // ✅ search added
      loader: false,
    };
  },

  computed: {
    filteredAudits() {
      return this.audits
        .filter((a) => a.module === this.selectedModule)
        .filter((audit) => {
          if (!this.search) return true;

          const text = (
            audit.description +
            " " +
            audit.action +
            " " +
            audit.module +
            " " +
            (audit.user?.full_name || "")
          ).toLowerCase();

          return text.includes(this.search.toLowerCase());
        });
    },
  },

  mounted() {
    this.fetchAudits();
  },

  methods: {
    fetchAudits() {
      this.loader = true;
      this.$axios.get("fetch_all_audits").then((res) => {
        this.audits = res.data.audit.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        this.modules = [...new Set(this.audits.map((i) => i.module))];
        this.selectedModule = this.modules[0];
        this.loader = false;
      });
    },

    selectModule(module) {
      this.selectedModule = module;
      this.expanded = [];
      this.search = ""; // reset search when switching module
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    truncateText(text, limit) {
      if (!text) return "";
      return text.length > limit
        ? text.substring(0, limit) + "..."
        : text;
    },

    formatAuditMessage(audit) {
      return audit.description || "No description available";
    },

    toggleExpand(id) {
      this.expanded.includes(id)
        ? (this.expanded = this.expanded.filter((i) => i !== id))
        : this.expanded.push(id);
    },

    getBrowser(ua) {
      if (!ua) return "Unknown";
      if (ua.includes("Chrome")) return "Chrome";
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Edg")) return "Edge";
      return "Browser";
    },

    formatJson(data) {
      return JSON.stringify(data, null, 2);
    },

    getIcon(action) {
      switch (action) {
        case "CREATE": return "mdi-plus";
        case "UPDATE": return "mdi-pencil";
        case "DELETE": return "mdi-delete";
        case "LOGIN": return "mdi-login";
        case "LOGOUT": return "mdi-logout";
        default: return "mdi-information";
      }
    },
  },
};
</script>

<style scoped>
.audit-wrapper {
  background: #f6f8fb;
}

/* LEFT PANEL */
.left-panel {
  border-right: 1px solid #e0e0e0;
}

.menu-card {
  height: 100%;
  padding: 10px;
}

.menu-title {
  font-weight: 600;
  padding: 10px;
  color: #555;
}

.menu-item {
  border-radius: 6px;
  margin-bottom: 4px;
  cursor: pointer;
}

.menu-item.active {
  background: #67a5ed;
  color: #fff !important;
}

/* RIGHT PANEL */
.content-card {
  background: #fff;
  border-radius: 10px;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.subtitle {
  font-size: 13px;
  color: #888;
}

/* SEARCH */
.search-field {
  max-width: 280px;
}

/* AUDIT ROW */
.audit-row {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #eee;
}

/* ICON */
.icon-wrapper {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-wrapper.create {
  background: #4caf50;
}

.icon-wrapper.update {
  background: #2196f3;
}

.icon-wrapper.delete {
  background: #f44336;
}

.icon-wrapper.login {
  background: #9c27b0;
}

.icon-wrapper.logout {
  background: #ff9800;
}

/* CONTENT */
.audit-content {
  flex: 1;
}

.action-title {
  font-weight: 600;
  font-size: 14px;
}

.time {
  font-size: 12px;
  color: #999;
}

.description {
  margin-top: 4px;
  font-size: 13px;
  color: #444;
}

.meta {
  margin-top: 6px;
  font-size: 12px;
  color: #777;
}

/* EXPAND */
.expand-btn {
  text-align: right;
  cursor: pointer;
  margin-top: 4px;
}

/* DETAILS */
.details {
  margin-top: 10px;
  background: #f9fafc;
  padding: 10px;
  border-radius: 6px;
}

pre {
  font-size: 11px;
  background: #eef1f5;
  padding: 8px;
  border-radius: 6px;
  overflow-x: auto;
}

/* EMPTY */
.no-data {
  text-align: center;
  padding: 20px;
  color: #888;
}
</style>