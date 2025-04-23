<template>
  <div class="bookmarks-view">
    <h1 class="bookmarks-title">{{ $t('bookmarks.title') }}</h1>
    
    <div v-if="bookmarkedArticles.length === 0" class="empty-container">
      <i class="pi pi-bookmark empty-icon"></i>
      <p>{{ $t('bookmarks.empty') }}</p>
      <router-link to="/">
        <Button 
          :label="$t('nav.home')" 
          icon="pi pi-home" 
        />
      </router-link>
    </div>
    
    <div v-else class="bookmarked-articles-grid">
      <div v-for="article in bookmarkedArticles" :key="article.id" class="article-card-container">
        <NewsCard :article="article" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import NewsCard from '../components/NewsCard.vue';

export default {
  name: 'BookmarksView',
  components: {
    NewsCard
  },
  setup() {
    const store = useStore();
    
    // Load bookmarks when component mounts
    onMounted(() => {
      store.dispatch('loadSavedState');
    });
    
    // Get bookmarked articles
    const bookmarkedArticles = computed(() => {
      return store.getters.getBookmarkedArticles;
    });
    
    return {
      bookmarkedArticles
    };
  }
}
</script>

<style scoped>
.bookmarks-view {
  padding: 1rem;
}

.bookmarks-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.bookmarked-articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.article-card-container {
  height: 100%;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .bookmarked-articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
