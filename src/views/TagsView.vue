<template>
  <div class="tags-view">
    <h1 class="page-title">{{ $t('nav.tags') }}</h1>
    
    <div class="tag-search">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search for tags..." 
        class="tag-search-input"
      />
    </div>
    
    <div class="tags-container">
      <div v-if="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Loading tags...</p>
      </div>
      
      <div v-else-if="filteredTags.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="64" height="64">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <p>No tags found matching your search.</p>
      </div>
      
      <div v-else class="tags-grid">
        <router-link 
          v-for="tag in filteredTags" 
          :key="tag.id"
          :to="`/tags/${tag.name}`"
          class="tag-card"
          :style="{ borderColor: tag.color }"
        >
          <div class="tag-card-header" :style="{ backgroundColor: tag.color }">
            <span class="tag-icon">{{ tag.icon || '#' }}</span>
          </div>
          
          <div class="tag-card-content">
            <h3 class="tag-name">{{ tag.name }}</h3>
            <div class="tag-stats">
              <div class="tag-stat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ tag.articlesCount }} articles</span>
              </div>
              
              <div class="tag-stat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{{ tag.views }} views</span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    
    <div class="trending-tags">
      <h2 class="section-title">Trending Tags</h2>
      
      <div class="trending-tags-list">
        <router-link 
          v-for="tag in trendingTags" 
          :key="tag.id"
          :to="`/tags/${tag.name}`"
          class="trending-tag"
          :style="{ borderColor: tag.color }"
        >
          <span class="trending-tag-icon" :style="{ backgroundColor: tag.color }">
            {{ tag.icon || '#' }}
          </span>
          <span class="trending-tag-name">{{ tag.name }}</span>
          <span class="trending-tag-count">{{ tag.articlesCount }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'TagsView',
  setup() {
    const isLoading = ref(false);
    const searchQuery = ref('');
    
    // Mock tags data - in a real app this would come from the store
    const allTags = ref([
      { id: 1, name: 'JavaScript', icon: 'JS', color: '#F7DF1E', articlesCount: 128, views: 3420 },
      { id: 2, name: 'Python', icon: 'Py', color: '#3776AB', articlesCount: 105, views: 2854 },
      { id: 3, name: 'React', icon: '⚛️', color: '#61DAFB', articlesCount: 87, views: 2340 },
      { id: 4, name: 'Vue', icon: '🟢', color: '#4FC08D', articlesCount: 76, views: 1980 },
      { id: 5, name: 'AI', icon: '🤖', color: '#9C27B0', articlesCount: 92, views: 3120 },
      { id: 6, name: 'DevOps', icon: '🔄', color: '#FF9800', articlesCount: 64, views: 1750 },
      { id: 7, name: 'Cloud', icon: '☁️', color: '#03A9F4', articlesCount: 71, views: 1890 },
      { id: 8, name: 'Mobile', icon: '📱', color: '#4CAF50', articlesCount: 53, views: 1430 },
      { id: 9, name: 'Security', icon: '🔒', color: '#F44336', articlesCount: 48, views: 1280 },
      { id: 10, name: 'Web Dev', icon: '🌐', color: '#673AB7', articlesCount: 112, views: 2980 },
      { id: 11, name: 'CSS', icon: '🎨', color: '#2196F3', articlesCount: 68, views: 1720 },
      { id: 12, name: 'Databases', icon: '💾', color: '#795548', articlesCount: 42, views: 1120 }
    ]);
    
    // Filter tags based on search query
    const filteredTags = computed(() => {
      if (!searchQuery.value) return allTags.value;
      
      return allTags.value.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });
    
    // Get trending tags (top 5 by view count)
    const trendingTags = computed(() => {
      return [...allTags.value]
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    });
    
    // Load tags data
    onMounted(() => {
      isLoading.value = true;
      // Simulate API call
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    });
    
    return {
      isLoading,
      searchQuery,
      filteredTags,
      trendingTags
    };
  }
};
</script>

<style scoped>
.tags-view {
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

.tag-search {
  margin-bottom: 1.5rem;
}

.tag-search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.tags-container {
  margin-bottom: 2rem;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tag-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
  border-top-width: 4px;
}

.tag-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.tag-card-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.tag-icon {
  font-size: 1.5rem;
  font-weight: bold;
}

.tag-card-content {
  padding: 1rem;
}

.tag-name {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.tag-stats {
  display: flex;
  justify-content: space-between;
}

.tag-stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-secondary);
  font-size: 0.75rem;
}

.trending-tags {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.trending-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.trending-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-full);
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
  font-size: 0.875rem;
}

.trending-tag:hover {
  background-color: var(--bg-secondary);
}

.trending-tag-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.trending-tag-count {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
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
  .tags-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }
  
  .trending-tags-list {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 1rem;
  }
  
  .trending-tag {
    flex-shrink: 0;
  }
}
</style>