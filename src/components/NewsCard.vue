<template>
  <Card class="news-card">
    <template #header v-if="article.imageUrl">
      <div class="card-image-container">
        <img :src="article.imageUrl" :alt="article.title" class="card-image">
        <div class="card-source-badge">
          <Chip :label="article.source.title" />
        </div>
      </div>
    </template>
    
    <template #title>
      <router-link :to="`/article/${article.id}`" class="card-title-link">
        <h3 class="card-title">{{ article.title }}</h3>
      </router-link>
    </template>
    
    <template #content>
      <p class="card-description">{{ article.description }}</p>
      
      <div class="card-tags">
        <Tag 
          v-for="tag in articleTags" 
          :key="tag" 
          :value="tag" 
          :severity="getTagSeverity(tag)" 
          class="mr-1"
        />
      </div>
      
      <div class="card-meta">
        <span class="card-date">{{ formattedDate }}</span>
        <span class="card-read-time">{{ $t('article.readTime', { time: article.readTime }) }}</span>
      </div>
    </template>
    
    <template #footer>
      <div class="card-actions">
        <Button 
          :icon="isBookmarked ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
          :class="['p-button-rounded p-button-text', { 'p-button-success': isBookmarked }]"
          @click="toggleBookmark"
          :title="isBookmarked ? $t('actions.unbookmark') : $t('actions.bookmark')"
        />
        
        <Button
          icon="pi pi-external-link"
          class="p-button-rounded p-button-text"
          @click="openArticle"
          :title="$t('actions.read')"
        />
        
        <Button
          icon="pi pi-share-alt"
          class="p-button-rounded p-button-text"
          @click="shareArticle"
          :title="$t('actions.share')"
        />
      </div>
    </template>
  </Card>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

export default {
  name: 'NewsCard',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const { t, d } = useI18n();
    
    // Check if the article is bookmarked
    const isBookmarked = computed(() => {
      return store.getters.isBookmarked(props.article.id);
    });
    
    // Extract tags from the article
    const articleTags = computed(() => {
      const title = props.article.title.toLowerCase();
      const description = props.article.description?.toLowerCase() || '';
      
      const possibleTags = ['javascript', 'python', 'react', 'vue', 'angular', 'node', 'php', 'golang', 'docker', 'kubernetes', 'aws', 'devops', 'frontend', 'backend', 'mobile', 'security', 'ai', 'ml', 'data'];
      
      const foundTags = possibleTags.filter(tag => 
        title.includes(tag) || description.includes(tag)
      );
      
      // Get the category (if not found in text, use default)
      const category = props.article.source.title.toLowerCase();
      
      // Combine for a maximum of 3 tags
      const allTags = [...new Set([...foundTags, category])].slice(0, 3);
      
      return allTags.length > 0 ? allTags : ['tech'];
    });
    
    // Format the publication date
    const formattedDate = computed(() => {
      const pubDate = new Date(props.article.pubDate);
      const now = new Date();
      const diffMs = now - pubDate;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return t('time.now');
      if (diffMins < 60) return t('time.minutesAgo', { count: diffMins });
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return t('time.hoursAgo', { count: diffHours });
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return t('time.daysAgo', { count: diffDays });
      
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) return t('time.monthsAgo', { count: diffMonths });
      
      const diffYears = Math.floor(diffMonths / 12);
      return t('time.yearsAgo', { count: diffYears });
    });
    
    // Get tag severity for styling
    const getTagSeverity = (tag) => {
      const tagMap = {
        javascript: 'warning',
        python: 'info',
        react: 'info',
        vue: 'success',
        angular: 'danger',
        node: 'success',
        php: 'secondary',
        golang: 'info',
        docker: 'info',
        kubernetes: 'warning',
        aws: 'warning',
        devops: 'danger',
        frontend: 'success',
        backend: 'info',
        mobile: 'secondary',
        security: 'danger',
        ai: 'warning',
        ml: 'warning',
        data: 'info',
        tech: 'secondary'
      };
      
      return tagMap[tag.toLowerCase()] || 'info';
    };
    
    // Toggle bookmark
    const toggleBookmark = () => {
      store.dispatch('toggleBookmark', props.article.id);
    };
    
    // Open the article in a new tab or navigate to it
    const openArticle = () => {
      if (props.article.link) {
        window.open(props.article.link, '_blank');
      }
    };
    
    // Share the article
    const shareArticle = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: props.article.title,
            text: props.article.description,
            url: props.article.link
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      } else {
        // Fallback - copy link to clipboard
        navigator.clipboard.writeText(props.article.link);
        // You would typically show a toast here
      }
    };
    
    return {
      isBookmarked,
      articleTags,
      formattedDate,
      getTagSeverity,
      toggleBookmark,
      openArticle,
      shareArticle
    };
  }
}
</script>

<style scoped>
.news-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.news-card:hover .card-image {
  transform: scale(1.05);
}

.card-source-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
}

.card-title-link {
  text-decoration: none;
  color: inherit;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.card-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0.75rem 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0.5rem 0;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

/* RTL Support */
:deep([dir="rtl"]) .card-source-badge {
  right: auto;
  left: 0.5rem;
}
</style>
