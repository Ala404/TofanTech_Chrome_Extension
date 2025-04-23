<template>
  <header class="top-bar">
    <div class="logo-container">
      <img :src="logoSrc" alt="TofanTech Logo" class="logo" />
      <h1 class="app-title">{{ $t('app.name') }}</h1>
    </div>
    
    <div class="search-container">
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="searchQuery" :placeholder="$t('actions.search')" class="search-input" />
      </span>
    </div>
    
    <div class="actions-container">
      <Button 
        icon="pi pi-refresh" 
        class="p-button-rounded p-button-text" 
        :title="$t('actions.refresh')"
        @click="refreshFeed"
        :loading="isLoading"
      />
      
      <ToggleButton 
        v-model="darkMode" 
        onIcon="pi pi-moon" 
        offIcon="pi pi-sun"
        onLabel=""
        offLabel=""
        class="p-button-rounded p-button-text theme-toggle"
        @change="toggleTheme"
      />
      
      <Dropdown 
        v-model="selectedLanguage" 
        :options="languageOptions" 
        optionLabel="name" 
        class="language-dropdown"
        @change="changeLanguage"
      />
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import logoSrc from '../assets/logo.svg';

export default {
  name: 'TopBar',
  setup() {
    const store = useStore();
    const { locale } = useI18n();
    const searchQuery = ref('');
    const isLoading = ref(false);
    
    // Theme toggling
    const darkMode = ref(store.state.theme === 'dark');
    
    // Language dropdown options
    const languageOptions = [
      { name: 'English', code: 'en' },
      { name: 'العربية', code: 'ar' },
      { name: 'Français', code: 'fr' }
    ];
    
    // Selected language
    const selectedLanguage = computed(() => {
      return languageOptions.find(lang => lang.code === locale.value);
    });
    
    // Toggle theme function
    const toggleTheme = () => {
      const newTheme = darkMode.value ? 'dark' : 'light';
      store.dispatch('changeTheme', newTheme);
    };
    
    // Change language function
    const changeLanguage = (event) => {
      if (event.value && event.value.code) {
        locale.value = event.value.code;
        store.dispatch('changeLanguage', event.value.code);
      }
    };
    
    // Refresh feed function
    const refreshFeed = async () => {
      isLoading.value = true;
      await store.dispatch('fetchFeeds');
      isLoading.value = false;
    };
    
    // Initialize
    onMounted(() => {
      // Set initial values from store
      darkMode.value = store.state.theme === 'dark';
    });
    
    return {
      logoSrc,
      searchQuery,
      darkMode,
      languageOptions,
      selectedLanguage,
      isLoading,
      toggleTheme,
      changeLanguage,
      refreshFeed
    };
  }
}
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  height: 64px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 36px;
  width: 36px;
  margin-right: 0.75rem;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search-input {
  width: 100%;
  background-color: var(--bg-primary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.actions-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theme-toggle {
  border: none;
  background: transparent;
}

.language-dropdown {
  min-width: 120px;
}

.p-button-text {
  color: var(--text-primary);
}

.p-button-text:hover {
  background-color: var(--bg-secondary);
}

/* RTL Support */
:deep([dir="rtl"]) .logo {
  margin-right: 0;
  margin-left: 0.75rem;
}

:deep([dir="rtl"]) .search-container {
  margin: 0 2rem;
}

@media (max-width: 768px) {
  .search-container {
    display: none;
  }
  
  .actions-container {
    gap: 0.5rem;
  }
}
</style>
