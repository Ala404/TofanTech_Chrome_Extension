<template>
  <div class="news-card">
    <!-- Card Header with Image -->
    <div v-if="article.imageUrl" class="card-image-container">
      <img :src="article.imageUrl" :alt="article.title" class="card-image">
      <div class="card-category" v-if="article.category">
        <!-- Pill-shaped category labels similar to daily.dev -->
        <span :style="{ backgroundColor: getCategoryColor(article.category) }" class="category-label">
          {{ article.category }}
        </span>
      </div>
    </div>
    
    <!-- Card Content Section -->
    <div class="card-content">
      <!-- Source and Date Info -->
      <div class="card-meta-top">
        <div class="card-source">
          <img v-if="article.source.icon" :src="article.source.icon" alt="" class="source-icon">
          <span class="source-name">{{ article.source.title }}</span>
        </div>
        <span class="card-date">{{ formattedDate }}</span>
      </div>
      
      <!-- Article Title -->
      <router-link :to="`/article/${article.id}`" class="card-title-link">
        <h3 class="card-title">{{ article.title }}</h3>
      </router-link>
      
      <!-- Tags Row -->
      <div class="card-tags">
        <span 
          v-for="tag in articleTags" 
          :key="tag" 
          class="card-tag"
        >
          #{{ tag }}
        </span>
      </div>
      
      <!-- Action Buttons -->
      <div class="card-actions">
        <!-- Views/Comments Count -->
        <div class="card-stats">
          <button class="card-stat-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="card-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{{ article.readTime }}</span>
          </button>
          
          <button class="card-stat-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="card-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>4</span>
          </button>
        </div>
        
        <!-- Action Buttons -->
        <div class="card-action-buttons">
          <button 
            class="card-action-btn"
            :class="{ 'active': isBookmarked }"
            @click="toggleBookmark"
            :title="isBookmarked ? $t('actions.unbookmark') : $t('actions.bookmark')"
          >
            <svg v-if="!isBookmarked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="card-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="card-action-icon">
              <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button
            class="card-action-btn"
            @click="openArticle"
            :title="$t('actions.read')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="card-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          
          <button
            class="card-action-btn"
            @click="shareArticle"
            :title="$t('actions.share')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="card-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
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
