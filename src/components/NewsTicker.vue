<template>
  <div class="news-ticker">
    <Transition name="fade" mode="out-in">
      <div v-if="currentItem" class="ticker-content" :key="currentItemIndex">
        <div class="ticker-icon">
          <i :class="tickerIcon"></i>
        </div>
        <div class="ticker-text">
          <span class="ticker-title">{{ currentItem.title }}</span>
          <a 
            v-if="currentItem.link" 
            :href="currentItem.link" 
            target="_blank" 
            class="ticker-link"
          >
            {{ $t('actions.read') }} <i class="pi pi-external-link"></i>
          </a>
        </div>
        <Button 
          icon="pi pi-refresh"
          class="p-button-text p-button-rounded refresh-button"
          @click="nextItem"
          :title="$t('actions.refresh')"
        />
      </div>
      <div v-else class="ticker-loading">
        {{ $t('ticker.title') }}
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
    
    // Get tickers from the store
    const tickers = computed(() => store.state.tickers);
    
    // Get the current ticker item
    const currentItem = computed(() => {
      if (tickers.value.length === 0) return null;
      return tickers.value[currentItemIndex.value];
    });
    
    // Determine icon based on content
    const tickerIcon = computed(() => {
      if (!currentItem.value) return 'pi pi-spin pi-spinner';
      
      const title = currentItem.value.title.toLowerCase();
      const content = (currentItem.value.content || '').toLowerCase();
      
      if (title.includes('meme') || content.includes('meme') || 
          title.includes('humor') || content.includes('humor') ||
          title.includes('funny') || content.includes('funny')) {
        return 'pi pi-smile';
      } else if (title.includes('tip') || content.includes('tip') ||
                title.includes('guide') || content.includes('guide') ||
                title.includes('how to') || content.includes('how to')) {
        return 'pi pi-info-circle';
      } else if (title.includes('success') || content.includes('success') ||
                title.includes('motivation') || content.includes('motivation') ||
                title.includes('inspire') || content.includes('inspire')) {
        return 'pi pi-heart';
      }
      
      return 'pi pi-bell';
    });
    
    // Move to the next ticker item
    const nextItem = () => {
      if (tickers.value.length === 0) return;
      currentItemIndex.value = (currentItemIndex.value + 1) % tickers.value.length;
    };
    
    // Initialize ticker system
    onMounted(() => {
      // If no tickers in store, fetch them
      if (tickers.value.length === 0) {
        store.dispatch('fetchTickers');
      }
      
      // Set up interval to rotate tickers every 10 seconds
      tickerInterval.value = setInterval(() => {
        nextItem();
      }, 10000);
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
      nextItem
    };
  }
}
</script>

<style scoped>
.news-ticker {
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0.75rem 1rem;
  height: 3.5rem;
  overflow: hidden;
}

.ticker-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.ticker-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--brand-primary);
  border-radius: 50%;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.ticker-icon i {
  color: var(--bg-primary);
  font-size: 1rem;
}

.ticker-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ticker-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-right: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticker-link {
  color: var(--brand-primary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.ticker-link i {
  margin-left: 0.25rem;
  font-size: 0.75rem;
}

.ticker-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
}

.refresh-button {
  margin-left: 0.5rem;
  color: var(--text-secondary);
}

.refresh-button:hover {
  color: var(--brand-primary);
}

/* Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RTL Support */
:deep([dir="rtl"]) .ticker-icon {
  margin-right: 0;
  margin-left: 0.75rem;
}

:deep([dir="rtl"]) .ticker-title {
  margin-right: 0;
  margin-left: 1rem;
}

:deep([dir="rtl"]) .ticker-link i {
  margin-left: 0;
  margin-right: 0.25rem;
}

:deep([dir="rtl"]) .refresh-button {
  margin-left: 0;
  margin-right: 0.5rem;
}
</style>
