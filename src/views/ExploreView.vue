<template>
  <div class="explore-view">
    <h1 class="page-title">{{ $t('nav.explore') }}</h1>
    
    <div class="explore-filters">
      <div class="filter-group">
        <h3 class="filter-title">Categories</h3>
        <div class="filter-options">
          <button 
            v-for="category in categories" 
            :key="category.id"
            class="filter-btn"
            :class="{ 'active': selectedCategories.includes(category.id) }"
            @click="toggleCategory(category.id)"
          >
            <span class="category-icon" :style="{ backgroundColor: category.color }">{{ category.icon }}</span>
            <span>{{ category.name }}</span>
          </button>
        </div>
      </div>
      
      <div class="filter-group">
        <h3 class="filter-title">Sources</h3>
        <div class="filter-options">
          <button 
            v-for="source in sources" 
            :key="source.id"
            class="filter-btn"
            :class="{ 'active': selectedSources.includes(source.id) }"
            @click="toggleSource(source.id)"
          >
            {{ source.name }}
          </button>
        </div>
      </div>
      
      <div class="filter-group">
        <h3 class="filter-title">Time Range</h3>
        <div class="filter-options">
          <button 
            v-for="range in timeRanges" 
            :key="range.value"
            class="filter-btn"
            :class="{ 'active': selectedTimeRange === range.value }"
            @click="setTimeRange(range.value)"
          >
            {{ range.label }}
          </button>
        </div>
      </div>
      
      <div class="filter-actions">
        <button class="btn-reset" @click="resetFilters">
          Reset Filters
        </button>
        <button class="btn-apply" @click="applyFilters">
          Apply Filters
        </button>
      </div>
    </div>
    
    <div class="news-grid">
      <NewsCard
        v-for="article in filteredArticles"
        :key="article.id"
        :article="article"
      />
    </div>
    
    <div v-if="isLoading" class="loading-indicator">
      <div class="spinner"></div>
      <p>{{ $t('feed.loading') }}</p>
    </div>
    
    <div v-if="!isLoading && filteredArticles.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="64" height="64">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <p>{{ $t('feed.empty') }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import NewsCard from '../components/NewsCard.vue';

export default {
  name: 'ExploreView',
  components: {
    NewsCard
  },
  setup() {
    const store = useStore();
    const isLoading = computed(() => store.state.loading);
    const articles = computed(() => store.state.articles);
    
    // Filter states
    const selectedCategories = ref([]);
    const selectedSources = ref([]);
    const selectedTimeRange = ref('all');
    
    // Available filter options
    const categories = ref([
      { id: 'technology', name: 'Technology', icon: '💻', color: '#4CAF50' },
      { id: 'development', name: 'Development', icon: '⚙️', color: '#2196F3' },
      { id: 'startup', name: 'Startups', icon: '🚀', color: '#FF5722' },
      { id: 'webdev', name: 'Web Dev', icon: '🌐', color: '#9C27B0' },
      { id: 'ai', name: 'AI', icon: '🤖', color: '#FFC107' }
    ]);
    
    const sources = ref([
      { id: 'hackernews', name: 'Hacker News' },
      { id: 'techcrunch', name: 'TechCrunch' },
      { id: 'dev', name: 'DEV.to' },
      { id: 'medium', name: 'Medium' },
      { id: 'reddit', name: 'Reddit' }
    ]);
    
    const timeRanges = ref([
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' },
      { value: 'all', label: 'All Time' }
    ]);
    
    // Filter methods
    const toggleCategory = (categoryId) => {
      if (selectedCategories.value.includes(categoryId)) {
        selectedCategories.value = selectedCategories.value.filter(id => id !== categoryId);
      } else {
        selectedCategories.value.push(categoryId);
      }
    };
    
    const toggleSource = (sourceId) => {
      if (selectedSources.value.includes(sourceId)) {
        selectedSources.value = selectedSources.value.filter(id => id !== sourceId);
      } else {
        selectedSources.value.push(sourceId);
      }
    };
    
    const setTimeRange = (range) => {
      selectedTimeRange.value = range;
    };
    
    const resetFilters = () => {
      selectedCategories.value = [];
      selectedSources.value = [];
      selectedTimeRange.value = 'all';
    };
    
    const applyFilters = () => {
      // We would typically dispatch an action to apply filters
      console.log('Applying filters:', {
        categories: selectedCategories.value,
        sources: selectedSources.value,
        timeRange: selectedTimeRange.value
      });
    };
    
    // Get filtered articles
    const filteredArticles = computed(() => {
      let filtered = [...articles.value];
      
      // Apply category filter
      if (selectedCategories.value.length > 0) {
        filtered = filtered.filter(article => {
          const articleCategories = article.categories || [];
          return selectedCategories.value.some(cat => articleCategories.includes(cat));
        });
      }
      
      // Apply source filter
      if (selectedSources.value.length > 0) {
        filtered = filtered.filter(article => {
          return selectedSources.value.includes(article.source.id);
        });
      }
      
      // Apply time range filter
      if (selectedTimeRange.value !== 'all') {
        const now = new Date();
        
        filtered = filtered.filter(article => {
          const pubDate = new Date(article.pubDate);
          
          if (selectedTimeRange.value === 'today') {
            // Today's articles
            return pubDate.toDateString() === now.toDateString();
          } else if (selectedTimeRange.value === 'week') {
            // This week's articles
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return pubDate >= oneWeekAgo;
          } else if (selectedTimeRange.value === 'month') {
            // This month's articles
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);
            return pubDate >= oneMonthAgo;
          }
          
          return true;
        });
      }
      
      return filtered;
    });
    
    // Load initial data if needed
    onMounted(() => {
      if (articles.value.length === 0) {
        store.dispatch('fetchFeeds');
      }
    });
    
    return {
      isLoading,
      categories,
      sources,
      timeRanges,
      selectedCategories,
      selectedSources,
      selectedTimeRange,
      filteredArticles,
      toggleCategory,
      toggleSource,
      setTimeRange,
      resetFilters,
      applyFilters
    };
  }
}
</script>

<style scoped>
.explore-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.explore-filters {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  padding: 1rem;
  margin-bottom: 2rem;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--accent-500);
}

.filter-btn.active {
  background-color: var(--accent-500);
  color: white;
  border-color: var(--accent-500);
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 0.75rem;
}

.btn-reset {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-apply {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  border: none;
  background-color: var(--accent-500);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  border-top-color: var(--accent-500);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: var(--text-secondary);
  text-align: center;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: var(--text-secondary);
  opacity: 0.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .explore-filters {
    padding: 0.75rem;
  }
  
  .filter-options {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
  }
  
  .filter-btn {
    flex-shrink: 0;
  }
}
</style>