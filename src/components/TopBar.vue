<template>
  <header class="top-bar">
    <div class="logo-container">
      <!-- <img :src="logoSrc" alt="TofanTech Logo" class="logo" /> -->
      <h1 class="app-title">{{ $t("app.name") }}</h1>
    </div>

    <div class="search-container">
      <div class="search-input-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="search-icon"
        >
          <path
            fill-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="$t('actions.search')"
          class="search-input"
        />
      </div>
      <div class="search-kbd-shortcut">
        <span>⌘</span>
        <span>K</span>
      </div>
    </div>

    <div class="actions-container">
      <!-- Level Up Button (similar to daily.dev) -->
      <button class="btn-level-up">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="level-up-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
        <span>{{ $t("actions.levelUp") }}</span>
      </button>

      <!-- Notification Button -->
      <button class="btn-icon notifications-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
      </button>

      <!-- Refresh Button -->
      <button
        class="btn-icon refresh-btn"
        :class="{ loading: isLoading }"
        @click="refreshFeed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>

      <!-- Theme Toggle Button -->
      <button
        class="btn-icon theme-toggle"
        @click="toggleTheme"
        :title="
          currentTheme === 'dark'
            ? 'Switch to Light Mode'
            : 'Switch to Dark Mode'
        "
      >
        <svg
          v-if="currentTheme === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      </button>

      <!-- Language Dropdown (simplified to match daily.dev style) -->
      <div class="language-dropdown-container">
        <button class="btn-icon language-btn" @click="toggleLanguageDropdown">
          <span class="language-code">{{
            selectedLanguage.code.toUpperCase()
          }}</span>
        </button>
        <div v-if="showLanguageDropdown" class="language-dropdown">
          <div
            v-for="lang in languageOptions"
            :key="lang.code"
            class="language-option"
            :class="{ selected: selectedLanguage.code === lang.code }"
            @click="selectLanguage(lang)"
          >
            <span>{{ lang.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import logoSrc from "../assets/logo.svg";

export default {
  name: "TopBar",
  props: {
    currentTheme: {
      type: String,
      default: "dark",
    },
  },
  emits: ["toggle-theme"],
  setup(props, { emit }) {
    const store = useStore();
    const { locale } = useI18n();
    const searchQuery = ref("");
    const isLoading = ref(false);
    const showLanguageDropdown = ref(false);

    // Language dropdown options
    const languageOptions = [
      { name: "English", code: "en" },
      { name: "العربية", code: "ar" },
      { name: "Français", code: "fr" },
    ];

    // Selected language
    const selectedLanguage = computed(() => {
      return (
        languageOptions.find((lang) => lang.code === locale.value) ||
        languageOptions[0]
      );
    });

    // Toggle theme function
    const toggleTheme = () => {
      const newTheme = props.currentTheme === "dark" ? "light" : "dark";
      store.dispatch("changeTheme", newTheme);
      emit("toggle-theme", newTheme);
    };

    // Toggle language dropdown
    const toggleLanguageDropdown = () => {
      showLanguageDropdown.value = !showLanguageDropdown.value;
    };

    // Select language
    const selectLanguage = (lang) => {
      locale.value = lang.code;
      store.dispatch("changeLanguage", lang.code);
      showLanguageDropdown.value = false;
    };

    // Refresh feed function
    const refreshFeed = async () => {
      isLoading.value = true;
      await store.dispatch("fetchFeeds");
      isLoading.value = false;
    };

    // Close language dropdown when clicking outside
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector(".language-dropdown-container");
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        showLanguageDropdown.value
      ) {
        showLanguageDropdown.value = false;
      }
    };

    // Add/remove event listener for clicks
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    // Clean up event listener
    onMounted(() => {
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    });

    return {
      logoSrc,
      searchQuery,
      currentTheme: computed(() => props.currentTheme),
      languageOptions,
      selectedLanguage,
      showLanguageDropdown,
      isLoading,
      toggleTheme,
      toggleLanguageDropdown,
      selectLanguage,
      refreshFeed,
    };
  },
};
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  height: 56px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 28px;
  width: 28px;
  margin-right: 0.5rem;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.025rem;
}

/* Search styled to match daily.dev */
.search-container {
  flex: 1;
  max-width: 360px;
  margin: 0 1.5rem;
  position: relative;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.search-input-wrapper:focus-within {
  border-color: var(--border-color);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

.search-icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  margin-right: 0.5rem;
}

.search-input {
  width: 100%;
  background-color: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.875rem;
  padding: 0.375rem 0;
  outline: none;
}

.search-kbd-shortcut {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 2px;
}

.search-kbd-shortcut span {
  background-color: rgba(107, 114, 128, 0.1);
  color: var(--text-secondary);
  font-size: 0.7rem;
  padding: 0.1rem 0.25rem;
  border-radius: 3px;
  font-weight: 500;
}

/* Actions Container */
.actions-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Level Up Button */
.btn-level-up {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--accent-500);
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.375rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-level-up:hover {
  background-color: var(--accent-600);
  transform: translateY(-1px);
}

.level-up-icon {
  width: 14px;
  height: 14px;
}

/* Icon Buttons */
.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.btn-icon svg {
  width: 20px;
  height: 20px;
}

/* Theme Toggle */
.theme-toggle {
  color: var(--text-secondary);
}

.theme-toggle:hover {
  color: var(--text-primary);
}

/* Refresh Button */
.refresh-btn.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Language Dropdown */
.language-dropdown-container {
  position: relative;
}

.language-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
}

.language-code {
  font-size: 0.75rem;
  font-weight: 600;
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  min-width: 150px;
  z-index: 100;
  overflow: hidden;
}

.language-option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
}

.language-option:hover {
  background-color: var(--bg-secondary);
}

.language-option.selected {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--accent-500);
}

/* RTL Support */
:deep([dir="rtl"]) .logo {
  margin-right: 0;
  margin-left: 0.5rem;
}

:deep([dir="rtl"]) .search-icon {
  margin-right: 0;
  margin-left: 0.5rem;
}

:deep([dir="rtl"]) .search-kbd-shortcut {
  right: auto;
  left: 8px;
}

:deep([dir="rtl"]) .language-dropdown {
  right: auto;
  left: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .search-container {
    display: none;
  }

  .actions-container {
    gap: 0.25rem;
  }

  .app-title {
    display: none;
  }
}
</style>
