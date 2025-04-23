<template>
  <div class="news-ticker">
    <div v-if="loading" class="ticker-loading">
      <svg class="ticker-loading-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="30 100"/>
      </svg>
      <span>{{ $t('ticker.loading') }}</span>
    </div>
    
    <Transition name="fade" mode="out-in">
      <div v-if="currentItem" class="ticker-content" :key="currentItemIndex">
        <!-- Category Badge - similar to daily.dev -->
        <div class="ticker-badge" :style="{ backgroundColor: getCategoryColor() }">
          <svg v-if="tickerIcon === 'trending'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ticker-badge-icon">
            <path fill-rule="evenodd" d="M15.22 6.268a.75.75 0 01.44.674v8.59a2.25 2.25 0 01-1.995 2.245l-.005.006-.426.078-4.5.75a.75.75 0 01-.88-.58 3.74 3.74 0 01-.262-1.437V6.741a.75.75 0 011.042-.673l4.5 1.5a.75.75 0 01.08.036zm-.878 8.028A.75.75 0 0014 14.5V7.766l-3 1V15.5a2.273 2.273 0 01-.159.89l3.501-.583z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="tickerIcon === 'news'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ticker-badge-icon">
            <path fill-rule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-3A.75.75 0 009 6.75H6z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="ticker-badge-icon">
            <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.219 8.219 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
            <path fill-rule="evenodd" d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <!-- Main ticker content -->
        <div class="ticker-text">
          <span class="ticker-title">{{ currentItem.title }}</span>
        </div>
        
        <!-- Action buttons -->
        <div class="ticker-actions">
          <a 
            v-if="currentItem.link" 
            :href="currentItem.link" 
            target="_blank" 
            class="ticker-link-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="ticker-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          
          <button 
            class="ticker-refresh-btn"
            @click="nextItem"
            :title="$t('actions.refresh')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="ticker-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'NewsTicker',
  setup() {
    const store = useStore();
    const currentItemIndex = ref(0);
    const tickerInterval = ref(null);
    const loading = ref(false);
    
    // Get tickers from the store
    const tickers = computed(() => store.state.tickers);
    
    // Get the current ticker item
    const currentItem = computed(() => {
      if (tickers.value.length === 0) return null;
      return tickers.value[currentItemIndex.value];
    });
    
    // Determine icon type based on content (for styling)
    const tickerIcon = computed(() => {
      if (!currentItem.value) return 'notification';
      
      const title = currentItem.value.title.toLowerCase();
      const content = (currentItem.value.content || '').toLowerCase();
      
      // Check for trending content
      if (title.includes('trending') || content.includes('trending') ||
          title.includes('popular') || content.includes('popular') ||
          title.includes('hot') || content.includes('hot')) {
        return 'trending';
      }
      
      // Check for news content
      if (title.includes('news') || content.includes('news') ||
          title.includes('update') || content.includes('update') ||
          title.includes('release') || content.includes('release')) {
        return 'news';
      }
      
      // Default to notification
      return 'notification';
    });
    
    // Get appropriate color for the ticker badge (similar to daily.dev)
    const getCategoryColor = () => {
      if (!currentItem.value) return '#4299e1'; // Default blue
      
      const iconType = tickerIcon.value;
      
      switch (iconType) {
        case 'trending':
          return '#f97316'; // Orange for trending
        case 'news':
          return '#10b981'; // Green for news
        default:
          return '#6366f1'; // Indigo for notifications
      }
    };
    
    // Move to the next ticker item
    const nextItem = () => {
      if (tickers.value.length === 0) return;
      currentItemIndex.value = (currentItemIndex.value + 1) % tickers.value.length;
    };
    
    // Initialize ticker system
    onMounted(async () => {
      loading.value = true;
      
      // If no tickers in store, fetch them
      if (tickers.value.length === 0) {
        try {
          await store.dispatch('fetchTickers');
        } catch (error) {
          console.error('Failed to fetch tickers:', error);
        }
      }
      
      loading.value = false;
      
      // Set up interval to rotate tickers every 12 seconds
      tickerInterval.value = setInterval(() => {
        nextItem();
      }, 12000);
    });
    
    // Clean up interval when component is destroyed
    onBeforeUnmount(() => {
      if (tickerInterval.value) {
        clearInterval(tickerInterval.value);
      }
    });
    
    return {
      currentItem,
      currentItemIndex,
      tickerIcon,
      loading,
      getCategoryColor,
      nextItem
    };
  }
}
</script>

<style scoped>
/* News Ticker - modeled after daily.dev */
.news-ticker {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  height: 48px;
  overflow: hidden;
  position: relative;
}

/* Ticker Content */
.ticker-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 0.75rem;
}

/* Category Badge */
.ticker-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  flex-shrink: 0;
  color: white;
}

.ticker-badge-icon {
  width: 16px;
  height: 16px;
}

/* Ticker Text */
.ticker-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ticker-title {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ticker Actions */
.ticker-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.ticker-link-btn,
.ticker-refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: transparent;
  color: var(--text-secondary);
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.ticker-link-btn:hover,
.ticker-refresh-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.ticker-action-icon {
  width: 16px;
  height: 16px;
}

/* Loading State */
.ticker-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  font-size: 0.875rem;
  gap: 0.75rem;
}

.ticker-loading-icon {
  width: 18px;
  height: 18px;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* RTL Support */
:deep([dir="rtl"]) .ticker-actions {
  flex-direction: row-reverse;
}
</style>
