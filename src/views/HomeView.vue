<template>
  <div class="home-view">
    <div v-if="isLoading" class="loading-container">
      <i class="pi pi-spin pi-spinner loading-icon"></i>
      <p>{{ $t('feed.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <i class="pi pi-exclamation-triangle error-icon"></i>
      <p>{{ error }}</p>
      <Button 
        :label="$t('actions.refresh')" 
        icon="pi pi-refresh" 
        @click="refreshFeed"
      />
    </div>
    
    <div v-else-if="articles.length === 0" class="empty-container">
      <i class="pi pi-inbox empty-icon"></i>
      <p>{{ $t('feed.empty') }}</p>
      <Button 
        :label="$t('actions.refresh')" 
        icon="pi pi-refresh" 
        @click="refreshFeed"
      />
    </div>
    
    <div v-else class="articles-grid">
      <div v-for="article in articles" :key="article.id" class="article-card-container">
        <NewsCard :article="article" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import NewsCard from '../components/NewsCard.vue';

export default {
  name: 'HomeView',
  components: {
    NewsCard
  },
  setup() {
    const store = useStore();
    const isLoading = ref(false);
    
    // Articles from the store
    const articles = computed(() => store.state.articles);
    
    // Error state
    const error = computed(() => store.state.error);
    
    // Fetch articles when component mounts
    onMounted(async () => {
      if (articles.value.length === 0) {
        refreshFeed();
      }
    });
    
    // Refresh the feed
    const refreshFeed = async () => {
      isLoading.value = true;
      await store.dispatch('fetchFeeds');
      isLoading.value = false;
    };
    
    return {
      articles,
      isLoading,
      error,
      refreshFeed
    };
  }
}
</script>

<style scoped>
.home-view {
  padding: 1rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.article-card-container {
  height: 100%;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-icon,
.error-icon,
.empty-icon {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
