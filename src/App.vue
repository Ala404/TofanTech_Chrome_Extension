<template>
  <div
    :class="[
      'tofantech-app',
      currentTheme === 'dark' ? 'dark-theme' : 'light-theme',
      { rtl: currentLocale === 'ar' },
    ]"
  >
    <Toast position="top-right" />

    <div class="app-container">
      <SideMenu />

      <div class="main-content">
        <TopBar @toggle-theme="toggleTheme" :current-theme="currentTheme" />

        <NewsTicker class="news-ticker" />

        <main class="content-area">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import SideMenu from "./components/SideMenu.vue";
import TopBar from "./components/TopBar.vue";
import NewsTicker from "./components/NewsTicker.vue";

export default {
  name: "App",
  components: {
    SideMenu,
    TopBar,
    NewsTicker,
  },
  setup() {
    const store = useStore();
    const { locale } = useI18n();
    const currentTheme = computed(() => store.state.theme);

    // Initialize app state from localStorage
    onMounted(() => {
      // First check if there's theme in localStorage
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        // Use store dispatch to ensure it updates everywhere
        store.dispatch("changeTheme", savedTheme);
        document.documentElement.classList.toggle(
          "dark",
          savedTheme === "dark"
        );
      } else {
        // Set default theme to dark
        store.dispatch("changeTheme", "dark");
        document.documentElement.classList.add("dark");
      }

      // Load language preference
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage) {
        store.dispatch("changeLanguage", savedLanguage);
        locale.value = savedLanguage;
      } else {
        localStorage.setItem("language", locale.value);
      }

      // Handle RTL for Arabic language
      document.documentElement.dir = locale.value === "ar" ? "rtl" : "ltr";

      // Fetch initial news feeds
      store.dispatch("fetchFeeds");
    });

    // Watch for theme changes
    watch(currentTheme, (newTheme) => {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    });

    // Function to toggle between dark and light themes
    const toggleTheme = () => {
      const newTheme = currentTheme.value === "dark" ? "light" : "dark";
      store.dispatch("changeTheme", newTheme);
    };

    // Watch for language changes and update RTL/LTR
    watch(locale, (newLocale) => {
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    });

    // Computed property for current locale
    const currentLocale = computed(() => locale.value);

    return {
      currentTheme,
      currentLocale,
      toggleTheme,
    };
  },
};
</script>

<style>
.tofantech-app {
  width: 100%;
  height: 100vh;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
  transition: background-color 0.3s, color 0.3s;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.5;
}

/* Theme settings */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --accent-500: #8b5cf6;
  --accent-600: #7c3aed;
}

.dark {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --border-color: #374151;
  --accent-500: #8b5cf6;
  --accent-600: #7c3aed;
}

.rtl {
  direction: rtl;
  text-align: right;
}

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  /*display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;*/
  background-color: var(--bg-primary);
}

.news-ticker {
  padding: 0.5rem 1rem;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
}

/* Global Link Style */
a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--accent-500);
}

/* Global Button Reset */
button {
  cursor: pointer;
  font-family: inherit;
}

/* Global Focus Styles */
*:focus-visible {
  outline: 2px solid var(--accent-500);
  outline-offset: 2px;
}

/* Remove browser default focus for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Global scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-secondary);
}

/* Global transition for theme changes */
*,
*::before,
*::after {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: 0.2s;
  transition-timing-function: ease;
}
</style>
