<template>
  <div :class="[
    'tofantech-app',
    currentTheme === 'dark' ? 'dark-theme' : 'light-theme',
    { 'rtl': currentLocale === 'ar' }
  ]">
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
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import SideMenu from './components/SideMenu.vue';
import TopBar from './components/TopBar.vue';
import NewsTicker from './components/NewsTicker.vue';

export default {
  name: 'App',
  components: {
    SideMenu,
    TopBar,
    NewsTicker
  },
  setup() {
    const store = useStore();
    const { locale } = useI18n();
    const currentTheme = computed(() => store.state.theme);
    
    // Initialize app state from localStorage
    onMounted(() => {
      // First check if there's theme in localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        // Use store dispatch to ensure it updates everywhere
        store.dispatch('changeTheme', savedTheme);
      } else {
        // Set default theme to dark
        store.dispatch('changeTheme', 'dark');
      }
      
      // Load language preference
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        store.dispatch('changeLanguage', savedLanguage);
        locale.value = savedLanguage;
      } else {
        localStorage.setItem('language', locale.value);
      }
      
      // Handle RTL for Arabic language
      document.documentElement.dir = locale.value === 'ar' ? 'rtl' : 'ltr';
      
      // Fetch initial news feeds
      store.dispatch('fetchFeeds');
    });
    
    // Function to toggle between dark and light themes
    const toggleTheme = () => {
      const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark';
      store.dispatch('changeTheme', newTheme);
    };
    
    // Watch for language changes and update RTL/LTR
    watch(locale, (newLocale) => {
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    });
    
    // Computed property for current locale
    const currentLocale = computed(() => locale.value);
    
    return {
      currentTheme,
      currentLocale,
      toggleTheme
    };
  }
}
</script>

<style>
.tofantech-app {
  width: 100%;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  transition: background-color 0.3s, color 0.3s;
  overflow: hidden;
}

.dark-theme {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --bg-card: #252525;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --brand-primary: #4ade80;
  --brand-secondary: #22c55e;
  --border-color: #333333;
  
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.light-theme {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-card: #ffffff;
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --brand-primary: #22c55e;
  --brand-secondary: #16a34a;
  --border-color: #e5e7eb;
  
  background-color: var(--bg-primary);
  color: var(--text-primary);
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
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.news-ticker {
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}
</style>
