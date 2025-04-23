<template>
  <div class="article-view">
    <div v-if="article" class="article-container">
      <div class="article-header">
        <Button 
          icon="pi pi-arrow-left" 
          class="p-button-text back-button" 
          @click="goBack"
        />
        
        <div class="article-actions">
          <Button 
            :icon="isBookmarked ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
            :class="['p-button-rounded p-button-text', { 'p-button-success': isBookmarked }]"
            @click="toggleBookmark"
            :title="isBookmarked ? $t('actions.unbookmark') : $t('actions.bookmark')"
          />
          
          <Button
            icon="pi pi-share-alt"
            class="p-button-rounded p-button-text"
            @click="shareArticle"
            :title="$t('actions.share')"
          />
          
          <Button
            icon="pi pi-external-link"
            class="p-button-rounded p-button-text"
            @click="openOriginalArticle"
            :title="$t('actions.read')"
          />
        </div>
      </div>
      
      <div class="article-content">
        <img 
          v-if="article.imageUrl" 
          :src="article.imageUrl" 
          :alt="article.title" 
          class="article-image"
        />
        
        <h1 class="article-title">{{ article.title }}</h1>
        
        <div class="article-meta">
          <span class="article-source">{{ $t('article.source', { source: article.source.title }) }}</span>
          <span class="article-date">{{ formattedDate }}</span>
          <span class="article-read-time">{{ $t('article.readTime', { time: article.readTime }) }}</span>
        </div>
        
        <div class="article-body" v-html="article.content"></div>
        
        <div class="article-footer">
          <a :href="article.link" target="_blank" class="read-original-link">
            {{ $t('actions.read') }} <i class="pi pi-external-link"></i>
          </a>
        </div>
      </div>
    </div>
    
    <div v-else class="not-found-container">
      <i class="pi pi-exclamation-circle not-found-icon"></i>
      <p>{{ $t('errors.articleNotFound') }}</p>
      <router-link to="/">
        <Button 
          :label="$t('nav.home')" 
          icon="pi pi-home" 
        />
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ArticleView',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const { t, d } = useI18n();
    
    // Get article id from route params
    const articleId = route.params.id;
    
    // Get article from store
    const article = computed(() => {
      return store.getters.getArticleById(articleId);
    });
    
    // Check if article is bookmarked
    const isBookmarked = computed(() => {
      return store.getters.isBookmarked(articleId);
    });
    
    // Format the publication date
    const formattedDate = computed(() => {
      if (!article.value) return '';
      
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return new Date(article.value.pubDate).toLocaleDateString(
        undefined, 
        options
      );
    });
    
    // Toggle bookmark
    const toggleBookmark = () => {
      store.dispatch('toggleBookmark', articleId);
    };
    
    // Share article
    const shareArticle = async () => {
      if (!article.value) return;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: article.value.title,
            text: article.value.description,
            url: article.value.link
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      } else {
        // Fallback - copy link to clipboard
        navigator.clipboard.writeText(article.value.link);
        // You would typically show a toast here
      }
    };
    
    // Open original article
    const openOriginalArticle = () => {
      if (article.value && article.value.link) {
        window.open(article.value.link, '_blank');
      }
    };
    
    // Go back to previous page
    const goBack = () => {
      router.back();
    };
    
    // Load article when component mounts
    onMounted(() => {
      // If article is not in store, try to load it
      if (!article.value) {
        // The actual implementation would fetch the article
        // For now, we just navigate back
        router.push('/');
      }
    });
    
    return {
      article,
      isBookmarked,
      formattedDate,
      toggleBookmark,
      shareArticle,
      openOriginalArticle,
      goBack
    };
  }
}
</script>

<style scoped>
.article-view {
  padding: 1rem;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.article-content {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.article-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

.article-title {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
  padding: 1.5rem 1.5rem 0.75rem;
  color: var(--text-primary);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0 1.5rem 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  border-bottom: 1px solid var(--border-color);
}

.article-body {
  padding: 1.5rem;
  line-height: 1.6;
}

.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  margin: 1rem 0;
}

.article-body :deep(a) {
  color: var(--brand-primary);
  text-decoration: none;
}

.article-body :deep(a:hover) {
  text-decoration: underline;
}

.article-body :deep(pre) {
  background-color: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 1rem 0;
}

.article-body :deep(blockquote) {
  border-left: 4px solid var(--brand-primary);
  padding-left: 1rem;
  margin-left: 0;
  color: var(--text-secondary);
}

.article-footer {
  display: flex;
  justify-content: center;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.read-original-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--brand-primary);
  font-weight: 500;
  text-decoration: none;
}

.read-original-link:hover {
  text-decoration: underline;
}

.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.not-found-icon {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

/* RTL Support */
:deep([dir="rtl"]) .article-body :deep(blockquote) {
  border-left: none;
  border-right: 4px solid var(--brand-primary);
  padding-left: 0;
  padding-right: 1rem;
}

:deep([dir="rtl"]) .read-original-link {
  flex-direction: row-reverse;
}
</style>
