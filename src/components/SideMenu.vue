<template>
  <aside class="side-menu">
    <nav class="menu-nav">
      <div class="menu-section">
        <h2 class="menu-title">{{ $t('app.name') }}</h2>
        
        <ul class="menu-list">
          <li>
            <router-link to="/" class="menu-item" active-class="active">
              <i class="pi pi-home"></i>
              <span>{{ $t('nav.home') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/bookmarks" class="menu-item" active-class="active">
              <i class="pi pi-bookmark"></i>
              <span>{{ $t('nav.bookmarks') }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="menu-item" active-class="active">
              <i class="pi pi-cog"></i>
              <span>{{ $t('nav.settings') }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      
      <div class="menu-section">
        <h3 class="section-title">{{ $t('feed.title') }}</h3>
        
        <ul class="menu-list">
          <li v-for="category in feedCategories" :key="category.name">
            <a 
              href="#" 
              class="menu-item" 
              :class="{ 'active': activeCategory === category.name }"
              @click.prevent="setActiveCategory(category.name)"
            >
              <i :class="category.icon"></i>
              <span>{{ category.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
    
    <div class="bottom-section">
      <a href="https://github.com/yourusername/tofantech" target="_blank" class="menu-item">
        <i class="pi pi-github"></i>
        <span>GitHub</span>
      </a>
    </div>
  </aside>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'SideMenu',
  setup() {
    const activeCategory = ref('All');
    
    const feedCategories = [
      { name: 'All', icon: 'pi pi-globe' },
      { name: 'Technology', icon: 'pi pi-desktop' },
      { name: 'Development', icon: 'pi pi-code' },
      { name: 'Startups', icon: 'pi pi-chart-line' },
      { name: 'Web Dev', icon: 'pi pi-server' }
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
  width: 240px;
  height: 100%;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.menu-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.menu-title {
  font-size: 1.25rem;
  font-weight: 700;
  padding: 0.5rem 1.25rem;
  margin-bottom: 1rem;
  color: var(--brand-primary);
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
  padding: 0.75rem 1.25rem;
  margin-top: 1rem;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  color: var(--text-primary);
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.menu-item i {
  margin-right: 0.75rem;
  font-size: 1.125rem;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--brand-primary);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.05);
  border-left-color: var(--brand-primary);
  color: var(--brand-primary);
  font-weight: 500;
}

.bottom-section {
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
}

/* RTL Support */
:deep([dir="rtl"]) .menu-item i {
  margin-right: 0;
  margin-left: 0.75rem;
}

:deep([dir="rtl"]) .menu-item {
  border-left: none;
  border-right: 3px solid transparent;
}

:deep([dir="rtl"]) .menu-item.active {
  border-right-color: var(--brand-primary);
}

@media (max-width: 768px) {
  .side-menu {
    width: 60px;
  }
  
  .menu-item span,
  .menu-title,
  .section-title {
    display: none;
  }
  
  .menu-item {
    justify-content: center;
    padding: 0.75rem;
  }
  
  .menu-item i {
    margin-right: 0;
    font-size: 1.25rem;
  }
}
</style>
