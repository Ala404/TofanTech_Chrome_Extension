<template>
  <div class="settings-panel">
    <h2 class="settings-title">{{ $t('settings.title') }}</h2>
    
    <section class="settings-section">
      <h3 class="section-title">{{ $t('settings.theme.label') }}</h3>
      <div class="theme-options">
        <div 
          class="theme-option"
          :class="{ 'active': theme === 'light' }"
          @click="setTheme('light')"
        >
          <i class="pi pi-sun"></i>
          <span>{{ $t('settings.theme.light') }}</span>
        </div>
        
        <div 
          class="theme-option"
          :class="{ 'active': theme === 'dark' }"
          @click="setTheme('dark')"
        >
          <i class="pi pi-moon"></i>
          <span>{{ $t('settings.theme.dark') }}</span>
        </div>
      </div>
    </section>
    
    <section class="settings-section">
      <h3 class="section-title">{{ $t('settings.language.label') }}</h3>
      <div class="language-options">
        <div 
          v-for="lang in languages" 
          :key="lang.code"
          class="language-option"
          :class="{ 'active': language === lang.code }"
          @click="setLanguage(lang.code)"
        >
          <span>{{ lang.name }}</span>
        </div>
      </div>
    </section>
    
    <section class="settings-section">
      <h3 class="section-title">{{ $t('settings.feedSources.label') }}</h3>
      <div class="feed-sources-actions">
        <Button 
          :label="$t('settings.feedSources.selectAll')" 
          class="p-button-sm p-button-outlined" 
          @click="selectAllSources"
        />
        <Button 
          :label="$t('settings.feedSources.deselectAll')" 
          class="p-button-sm p-button-outlined p-button-secondary" 
          @click="deselectAllSources"
        />
      </div>
      
      <div class="feed-sources-list">
        <div 
          v-for="source in feedSources" 
          :key="source.url"
          class="feed-source-item"
        >
          <div class="source-info">
            <span class="source-icon">{{ source.icon }}</span>
            <span class="source-name">{{ source.name }}</span>
          </div>
          <ToggleButton 
            v-model="selectedSources[source.url]" 
            class="source-toggle"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
          />
        </div>
      </div>
    </section>
    
    <section class="settings-section">
      <h3 class="section-title">{{ $t('settings.readingPreferences.label') }}</h3>
      <div class="reading-preferences">
        <div class="preference-item">
          <label class="preference-label">
            {{ $t('settings.readingPreferences.openInNewTab') }}
          </label>
          <ToggleButton 
            v-model="openInNewTab" 
            class="preference-toggle"
          />
        </div>
      </div>
    </section>
    
    <div class="settings-actions">
      <Button 
        :label="$t('actions.save')" 
        icon="pi pi-check" 
        class="p-button-primary" 
        @click="saveSettings"
      />
      <Button 
        :label="$t('actions.cancel')" 
        icon="pi pi-times" 
        class="p-button-secondary" 
        @click="cancelChanges"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { techFeedSources } from '../utils/feedSources';

export default {
  name: 'SettingsPanel',
  setup() {
    const store = useStore();
    const { locale } = useI18n();
    const router = useRouter();
    
    // Theme settings
    const theme = ref(store.state.theme);
    
    // Language settings
    const language = ref(store.state.language);
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'العربية' },
      { code: 'fr', name: 'Français' }
    ];
    
    // Feed sources settings
    const feedSources = techFeedSources;
    const selectedSources = ref({});
    
    // Initialize selectedSources with all feeds selected
    onMounted(() => {
      feedSources.forEach(source => {
        selectedSources.value[source.url] = true;
      });
    });
    
    // Reading preferences
    const openInNewTab = ref(localStorage.getItem('openInNewTab') === 'true');
    
    // Actions
    const setTheme = (newTheme) => {
      theme.value = newTheme;
    };
    
    const setLanguage = (newLanguage) => {
      language.value = newLanguage;
    };
    
    const selectAllSources = () => {
      feedSources.forEach(source => {
        selectedSources.value[source.url] = true;
      });
    };
    
    const deselectAllSources = () => {
      feedSources.forEach(source => {
        selectedSources.value[source.url] = false;
      });
    };
    
    const saveSettings = () => {
      // Save theme
      store.dispatch('changeTheme', theme.value);
      
      // Save language
      if (language.value !== locale.value) {
        store.dispatch('changeLanguage', language.value);
        locale.value = language.value;
      }
      
      // Save reading preferences
      localStorage.setItem('openInNewTab', openInNewTab.value);
      
      // Save selected sources
      localStorage.setItem('selectedSources', JSON.stringify(selectedSources.value));
      
      // Show success notification (you would typically use a toast here)
      alert('Settings saved successfully!');
      
      // Navigate back to home
      router.push('/');
    };
    
    const cancelChanges = () => {
      router.back();
    };
    
    return {
      theme,
      language,
      languages,
      feedSources,
      selectedSources,
      openInNewTab,
      setTheme,
      setLanguage,
      selectAllSources,
      deselectAllSources,
      saveSettings,
      cancelChanges
    };
  }
}
</script>

<style scoped>
.settings-panel {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.settings-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.theme-options, .language-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.theme-option, .language-option {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.theme-option i {
  margin-right: 0.75rem;
  font-size: 1.125rem;
}

.theme-option.active, .language-option.active {
  border-color: var(--brand-primary);
  background-color: rgba(34, 197, 94, 0.1);
}

.feed-sources-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.feed-sources-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.feed-source-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.source-info {
  display: flex;
  align-items: center;
}

.source-icon {
  margin-right: 0.75rem;
  font-size: 1.125rem;
}

.reading-preferences {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}

.settings-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* RTL Support */
:deep([dir="rtl"]) .theme-option i,
:deep([dir="rtl"]) .source-icon {
  margin-right: 0;
  margin-left: 0.75rem;
}

:deep([dir="rtl"]) .settings-actions {
  flex-direction: row-reverse;
}
</style>
