<template>
  <aside class="side-menu">
    <div class="menu-header">
      <div class="menu-label">Menu</div>
      <button class="menu-toggle-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-toggle-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
    
    <nav class="menu-nav">
      <!-- Main Navigation -->
      <div class="menu-section">
        <!-- New Post Button (similar to daily.dev) -->
        <div class="new-post-button-wrapper">
          <button class="new-post-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="new-post-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>{{ $t('actions.newPost') }}</span>
          </button>
        </div>
        
        <ul class="menu-list">
          <li>
            <router-link to="/" class="menu-item" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{{ $t('nav.home') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/following" class="menu-item" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{{ $t('nav.following') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/explore" class="menu-item" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span>{{ $t('nav.explore') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/history" class="menu-item" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ $t('nav.history') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/bookmarks" class="menu-item" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>{{ $t('nav.bookmarks') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="menu-item" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ $t('nav.settings') }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <!-- Custom Feeds Section -->
      <div class="menu-section">
        <div class="section-header">
          <h3 class="section-title">{{ $t('feed.customFeeds') }}</h3>
          <button class="section-action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="section-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
        
        <ul class="menu-list">
          <li>
            <a href="#" class="menu-item" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>{{ $t('feed.myNewFeed') }}</span>
            </a>
          </li>
          <li>
            <a href="#" class="menu-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{{ $t('feed.customFeed') }}</span>
            </a>
          </li>
        </ul>
      </div>
      
      <!-- Topic Categories -->
      <div class="menu-section">
        <div class="section-header">
          <h3 class="section-title">{{ $t('feed.discover') }}</h3>
          <button class="section-action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="section-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <ul class="menu-list">
          <li v-for="category in feedCategories" :key="category.name">
            <a 
              href="#" 
              class="menu-item" 
              :class="{ 'active': activeCategory === category.name }"
              @click.prevent="setActiveCategory(category.name)"
            >
              <span class="topic-icon" :style="{ backgroundColor: category.color }">
                {{ category.icon }}
              </span>
              <span>{{ category.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'SideMenu',
  setup() {
    const activeCategory = ref('All');
    
    const feedCategories = [
      { name: 'Technology', icon: '💻', color: '#4CAF50' },
      { name: 'Development', icon: '⚙️', color: '#2196F3' },
      { name: 'Startups', icon: '🚀', color: '#FF5722' },
      { name: 'Web Dev', icon: '🌐', color: '#9C27B0' },
      { name: 'AI', icon: '🤖', color: '#FFC107' }
    ];
    
    const setActiveCategory = (category) => {
      activeCategory.value = category;
      // Here you would typically dispatch an action to filter the feed
    };
    
    return {
      activeCategory,
      feedCategories,
      setActiveCategory
    };
  }
}
</script>

<style scoped>
.side-menu {
  width: 250px;
  height: 100%;
  background-color: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s, background-color 0.3s;
  flex-shrink: 0;
}

/* Menu Header */
.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-color);
}

.menu-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.menu-toggle-btn {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.menu-toggle-icon {
  width: 18px;
  height: 18px;
}

/* Menu Navigation */
.menu-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

/* New Post Button */
.new-post-button-wrapper {
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.new-post-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  gap: 0.5rem;
}

.new-post-button:hover {
  background-color: var(--border-color);
}

.new-post-icon {
  width: 16px;
  height: 16px;
}

/* Menu Section */
.menu-section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin: 0;
}

.section-action-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 18px;
  height: 18px;
}

.section-action-icon {
  width: 14px;
  height: 14px;
}

/* Menu List */
.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.625rem 1.25rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  border-radius: 0;
  font-size: 0.875rem;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.menu-item:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.menu-item.active {
  color: var(--text-primary);
  font-weight: 500;
  background-color: var(--bg-secondary);
}

/* Topic Icon */
.topic-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  margin-right: 1rem;
  font-size: 14px;
}

/* RTL Support */
:deep([dir="rtl"]) .menu-icon,
:deep([dir="rtl"]) .topic-icon {
  margin-right: 0;
  margin-left: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .side-menu {
    width: 56px;
  }
  
  .new-post-button span,
  .menu-item span,
  .menu-label,
  .section-header {
    display: none;
  }
  
  .menu-toggle-btn {
    margin: 0 auto;
  }
  
  .menu-header {
    justify-content: center;
    padding: 1rem 0;
  }
  
  .new-post-button {
    padding: 0.5rem;
  }
  
  .menu-item {
    justify-content: center;
    padding: 0.625rem 0;
  }
  
  .menu-icon,
  .topic-icon {
    margin-right: 0;
  }
  
  .new-post-button-wrapper {
    padding: 0 0.5rem;
  }
}

/* Custom Scrollbar */
.menu-nav::-webkit-scrollbar {
  width: 4px;
}

.menu-nav::-webkit-scrollbar-track {
  background: transparent;
}

.menu-nav::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 4px;
}
</style>
