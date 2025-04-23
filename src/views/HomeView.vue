<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-center">
      <i class="pi pi-spin pi-spinner text-5xl text-secondary mb-4"></i>
      <p class="text-lg text-secondary">{{ $t('feed.loading') }}</p>
    </div>
    
    <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center">
      <i class="pi pi-exclamation-triangle text-5xl text-red-500 mb-4"></i>
      <p class="text-lg text-secondary mb-4">{{ error }}</p>
      <Button 
        :label="$t('actions.refresh')" 
        icon="pi pi-refresh" 
        @click="refreshFeed"
        class="p-button-primary"
      />
    </div>
    
    <div v-else-if="articles.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <i class="pi pi-inbox text-5xl text-secondary mb-4"></i>
      <p class="text-lg text-secondary mb-4">{{ $t('feed.empty') }}</p>
      <Button 
        :label="$t('actions.refresh')" 
        icon="pi pi-refresh" 
        @click="refreshFeed"
        class="p-button-primary"
      />
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      <div v-for="article in articles" :key="article.id" class="h-full">
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
/* Custom styles if needed later */
</style>
