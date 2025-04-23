<template>
  <div class="history-view">
    <h1 class="page-title">{{ $t('nav.history') }}</h1>
    
    <div class="history-controls">
      <div class="history-search">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search your reading history..." 
          class="history-search-input"
        />
      </div>
      
      <div class="history-actions">
        <button v-if="selectedArticles.length > 0" class="btn-remove" @click="removeSelected">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove Selected
        </button>
        
        <button class="btn-clear" @click="showClearConfirm = true">
          Clear History
        </button>
      </div>
    </div>
    
    <div v-if="readingHistory.length > 0" class="history-list">
      <div 
        v-for="section in historySections" 
        :key="section.date" 
        class="history-section"
      >
        <h2 class="section-date">{{ section.date }}</h2>
        
        <div class="history-items">
          <div 
            v-for="article in section.articles" 
            :key="article.id" 
            class="history-item"
            :class="{ 'selected': selectedArticles.includes(article.id) }"
          >
            <div class="history-item-checkbox">
              <input 
                type="checkbox" 
                :id="`article-${article.id}`" 
                :checked="selectedArticles.includes(article.id)"
                @change="toggleArticleSelection(article.id)"
              />
            </div>
            
            <div class="history-item-time">
              {{ formatTime(article.readAt) }}
            </div>
            
            <div class="history-item-content">
              <router-link :to="`/article/${article.id}`" class="history-item-title">
                {{ article.title }}
              </router-link>
              
              <div class="history-item-source">
                {{ article.source.title }}
              </div>
            </div>
            
            <div class="history-item-actions">
              <button class="history-action-btn" @click="removeFromHistory(article.id)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <button 
                class="history-action-btn" 
                :class="{ 'active': isBookmarked(article.id) }"
                @click="toggleBookmark(article.id)"
              >
                <svg v-if="isBookmarked(article.id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!isLoading" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="64" height="64">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p>You haven't read any articles yet.</p>
      <router-link to="/" class="empty-action-btn">
        Start Reading
      </router-link>
    </div>
    
    <div v-if="isLoading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Loading your reading history...</p>
    </div>
    
    <!-- Clear History Confirmation Modal -->
    <div v-if="showClearConfirm" class="modal-backdrop" @click="showClearConfirm = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Clear Reading History</h3>
          <button @click="showClearConfirm = false" class="modal-close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to clear all your reading history? This action cannot be undone.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showClearConfirm = false">Cancel</button>
          <button class="btn-confirm-clear" @click="clearAllHistory">Clear All History</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HistoryView',
  setup() {
    const store = useStore();
    const isLoading = ref(false);
    const searchQuery = ref('');
    const selectedArticles = ref([]);
    const showClearConfirm = ref(false);
    
    // This would typically come from Vuex store
    // Simulating reading history data for the UI
    const readingHistory = ref([
      {
        id: 1,
        title: 'The Future of JavaScript: What\'s New in ECMAScript 2023',
        source: { title: 'DEV.to', id: 'dev' },
        readAt: new Date(new Date().setHours(new Date().getHours() - 2))
      },
      {
        id: 2,
        title: 'Building Performant React Applications',
        source: { title: 'Medium', id: 'medium' },
        readAt: new Date(new Date().setHours(new Date().getHours() - 5))
      },
      {
        id: 3,
        title: 'Getting Started with Vue 3 Composition API',
        source: { title: 'Vue Blog', id: 'vue' },
        readAt: new Date(new Date().setDate(new Date().getDate() - 1))
      },
      {
        id: 4,
        title: 'Introduction to GraphQL: A New API Standard',
        source: { title: 'Apollo Blog', id: 'apollo' },
        readAt: new Date(new Date().setDate(new Date().getDate() - 1))
      },
      {
        id: 5,
        title: '10 Useful Python Libraries You Should Know About',
        source: { title: 'DEV.to', id: 'dev' },
        readAt: new Date(new Date().setDate(new Date().getDate() - 2))
      }
    ]);
    
    // Group history items by date
    const historySections = computed(() => {
      const filteredHistory = readingHistory.value.filter(article => {
        if (!searchQuery.value) return true;
        return article.title.toLowerCase().includes(searchQuery.value.toLowerCase());
      });
      
      const sections = {};
      
      filteredHistory.forEach(article => {
        const date = new Date(article.readAt).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        });
        
        if (!sections[date]) {
          sections[date] = {
            date,
            articles: []
          };
        }
        
        sections[date].articles.push(article);
      });
      
      // Convert to array and sort by date (most recent first)
      return Object.values(sections).sort((a, b) => {
        return new Date(b.articles[0].readAt) - new Date(a.articles[0].readAt);
      });
    });
    
    // Format time to display (e.g., "3:45 PM")
    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    };
    
    // Check if an article is bookmarked
    const isBookmarked = (articleId) => {
      return store.getters.isBookmarked(articleId);
    };
    
    // Toggle bookmark status
    const toggleBookmark = (articleId) => {
      store.dispatch('toggleBookmark', articleId);
    };
    
    // Toggle article selection
    const toggleArticleSelection = (articleId) => {
      if (selectedArticles.value.includes(articleId)) {
        selectedArticles.value = selectedArticles.value.filter(id => id !== articleId);
      } else {
        selectedArticles.value.push(articleId);
      }
    };
    
    // Remove an article from history
    const removeFromHistory = (articleId) => {
      readingHistory.value = readingHistory.value.filter(article => article.id !== articleId);
      // In a real app, you'd dispatch an action to remove from store/backend
      // store.dispatch('removeFromHistory', articleId);
    };
    
    // Remove selected articles
    const removeSelected = () => {
      readingHistory.value = readingHistory.value.filter(article => !selectedArticles.value.includes(article.id));
      selectedArticles.value = [];
      // In a real app, you'd dispatch an action
      // store.dispatch('removeMultipleFromHistory', selectedArticles.value);
    };
    
    // Clear all history
    const clearAllHistory = () => {
      readingHistory.value = [];
      selectedArticles.value = [];
      showClearConfirm.value = false;
      // In a real app, you'd dispatch an action
      // store.dispatch('clearHistory');
    };
    
    // Fetch reading history on component mount
    onMounted(() => {
      // In a real app, you'd fetch the data from the store
      // store.dispatch('fetchReadingHistory');
    });
    
    return {
      isLoading,
      searchQuery,
      readingHistory,
      selectedArticles,
      showClearConfirm,
      historySections,
      formatTime,
      isBookmarked,
      toggleBookmark,
      toggleArticleSelection,
      removeFromHistory,
      removeSelected,
      clearAllHistory
    };
  }
}
</script>

<style scoped>
.history-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.history-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.history-search {
  flex: 1;
  max-width: 400px;
}

.history-search-input {
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.history-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-remove,
.btn-clear {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove {
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.btn-clear {
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
}

.btn-remove:hover {
  background-color: #FEE2E2;
  color: #DC2626;
  border-color: #DC2626;
}

.btn-clear:hover {
  color: #DC2626;
}

.history-section {
  margin-bottom: 2rem;
}

.section-date {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.history-items {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item:hover {
  background-color: var(--bg-secondary);
}

.history-item.selected {
  background-color: rgba(99, 102, 241, 0.05);
}

.history-item-checkbox {
  margin-right: 1rem;
}

.history-item-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
  width: 80px;
  flex-shrink: 0;
}

.history-item-content {
  flex: 1;
  min-width: 0;
}

.history-item-title {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-title:hover {
  color: var(--accent-500);
}

.history-item-source {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.history-item-actions {
  display: flex;
  gap: 0.5rem;
}

.history-action-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-action-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.history-action-btn.active {
  color: var(--accent-500);
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

.empty-action-btn {
  display: inline-block;
  background-color: var(--accent-500);
  color: white;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-full);
  margin-top: 1.5rem;
  text-decoration: none;
  transition: all 0.2s;
}

.empty-action-btn:hover {
  background-color: var(--accent-600);
  transform: translateY(-1px);
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

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
}

.modal-content {
  width: 90%;
  max-width: 480px;
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
  color: var(--text-primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  gap: 1rem;
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-confirm-clear {
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  border: none;
  background-color: #DC2626;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .history-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .history-search {
    max-width: none;
  }
  
  .history-item {
    flex-wrap: wrap;
  }
  
  .history-item-time {
    width: auto;
    margin-right: 1rem;
  }
  
  .history-item-content {
    width: 100%;
    margin-top: 0.5rem;
    order: 1;
  }
}
</style>