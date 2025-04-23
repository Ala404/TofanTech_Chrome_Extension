<template>
  <aside class="side-menu" :class="{'collapsed': isCollapsed}">
    <div class="menu-header">
      <div class="menu-label">{{ !isCollapsed ? 'Menu' : '' }}</div>
      <button class="menu-toggle-btn" @click="toggleSidebar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-toggle-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </div>
    
    <nav class="menu-nav">
      <!-- Main Navigation -->
      <div class="menu-section">
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
            <router-link to="/tags" class="menu-item" active-class="active">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{{ $t('nav.tags') }}</span>
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
      
      <!-- Tags Section -->
      <div class="menu-section tags-section" v-if="showTagsInSidebar">
        <div class="section-header">
          <h3 class="section-title">Popular Tags</h3>
          <button class="section-action-btn" @click="toggleTagsSection">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="section-action-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <ul class="menu-list" v-if="!tagsCollapsed">
          <li v-for="tag in popularTags" :key="tag.name">
            <a 
              href="#" 
              class="menu-item" 
              :class="{ 'active': activeTag === tag.name }"
              @click.prevent="setActiveTag(tag.name)"
            >
              <span class="topic-icon" :style="{ backgroundColor: tag.color }">
                {{ tag.icon || '#' }}
              </span>
              <span>{{ tag.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Contact Developer Button at bottom -->
    <div class="contact-developer">
      <button @click="showContactModal = true" class="contact-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="menu-icon">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{{ $t('nav.contact') }}</span>
      </button>
    </div>
    
    <!-- Contact Modal -->
    <div v-if="showContactModal" class="contact-modal-backdrop" @click="showContactModal = false">
      <div class="contact-modal" @click.stop>
        <div class="contact-modal-header">
          <h3>Contact Developer</h3>
          <button @click="showContactModal = false" class="close-modal-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="contact-modal-body">
          <div class="developer-info">
            <img src="https://github.com/identicons/app/icon.png" alt="Developer" class="developer-avatar" />
            <h4>John Developer</h4>
            <p>Full-stack developer passionate about creating useful tools and extensions.</p>
          </div>
          
          <div class="social-links">
            <a href="https://github.com/johndeveloper" target="_blank" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href="https://twitter.com/johndeveloper" target="_blank" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
              </svg>
              Twitter
            </a>
            <a href="https://linkedin.com/in/johndeveloper" target="_blank" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
          
          <div class="contact-form">
            <a href="mailto:john@example.com" class="email-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              john@example.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'SideMenu',
  setup() {
    const store = useStore();
    const isCollapsed = ref(false);
    const showContactModal = ref(false);
    const showTagsInSidebar = ref(true);
    const tagsCollapsed = ref(false);
    const activeTag = ref('');
    
    // Popular tags for the sidebar
    const popularTags = ref([
      { name: 'JavaScript', icon: 'JS', color: '#F7DF1E' },
      { name: 'Python', icon: 'Py', color: '#3776AB' },
      { name: 'React', icon: '⚛️', color: '#61DAFB' },
      { name: 'Vue', icon: '🟢', color: '#4FC08D' },
      { name: 'AI', icon: '🤖', color: '#9C27B0' },
      { name: 'DevOps', icon: '🔄', color: '#FF9800' },
      { name: 'Cloud', icon: '☁️', color: '#03A9F4' },
      { name: 'Mobile', icon: '📱', color: '#4CAF50' },
      { name: 'Security', icon: '🔒', color: '#F44336' }
    ]);
    
    // Toggle sidebar collapse state
    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value;
      // Save preference to localStorage
      localStorage.setItem('sidebarCollapsed', isCollapsed.value ? 'true' : 'false');
    };
    
    // Toggle tags section visibility
    const toggleTagsSection = () => {
      tagsCollapsed.value = !tagsCollapsed.value;
    };
    
    // Set active tag for filtering
    const setActiveTag = (tag) => {
      activeTag.value = tag;
      // Here you would typically dispatch an action to filter by tag
      store.dispatch('filterByTag', tag);
    };
    
    // Load saved preferences on mount
    onMounted(() => {
      const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
      if (savedCollapsedState === 'true') {
        isCollapsed.value = true;
      }
      
      // Check screen size for responsive behavior
      const handleResize = () => {
        if (window.innerWidth < 768) {
          isCollapsed.value = true;
        }
      };
      
      // Set initial state based on screen size
      handleResize();
      
      // Add resize event listener
      window.addEventListener('resize', handleResize);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });
    
    return {
      isCollapsed,
      showContactModal,
      showTagsInSidebar,
      tagsCollapsed,
      activeTag,
      popularTags,
      toggleSidebar,
      toggleTagsSection,
      setActiveTag
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

/* Contact Developer Button */
.contact-developer {
  padding: 1rem;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
}

.contact-button {
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.contact-button:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.contact-button .menu-icon {
  margin-right: 0.75rem;
}

/* Contact Modal */
.contact-modal-backdrop {
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

.contact-modal {
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

.contact-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.contact-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-modal-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  padding: 0.25rem;
  border-radius: 50%;
}

.close-modal-btn:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.contact-modal-body {
  padding: 1.5rem;
}

.developer-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: center;
}

.developer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  background-color: var(--bg-secondary);
}

.developer-info h4 {
  margin: 0 0 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
}

.developer-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  padding: 0.75rem;
  border-radius: var(--radius-md);
}

.social-link:hover {
  color: var(--accent-500);
  background-color: var(--bg-secondary);
}

.email-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s;
}

.email-link:hover {
  background-color: var(--accent-500);
  color: white;
}

/* Collapsed Sidebar */
.side-menu.collapsed {
  width: 64px;
}

.side-menu.collapsed .menu-label,
.side-menu.collapsed .menu-item span,
.side-menu.collapsed .section-header,
.side-menu.collapsed .contact-button span {
  display: none;
}

.side-menu.collapsed .menu-toggle-btn {
  margin: 0 auto;
}

.side-menu.collapsed .menu-header {
  justify-content: center;
  padding: 1rem 0;
}

.side-menu.collapsed .menu-item {
  justify-content: center;
  padding: 0.625rem 0;
}

.side-menu.collapsed .menu-icon,
.side-menu.collapsed .topic-icon {
  margin-right: 0;
}

.side-menu.collapsed .contact-button {
  justify-content: center;
}

.side-menu.collapsed .section-title,
.side-menu.collapsed .tags-section {
  display: none;
}

/* Responsive Design (Mobile) */
@media (max-width: 768px) {
  .side-menu {
    width: 64px;
  }
  
  .menu-label,
  .menu-item span,
  .section-header,
  .contact-button span {
    display: none;
  }
  
  .menu-toggle-btn {
    margin: 0 auto;
  }
  
  .menu-header {
    justify-content: center;
    padding: 1rem 0;
  }
  
  .menu-item {
    justify-content: center;
    padding: 0.625rem 0;
  }
  
  .menu-icon,
  .topic-icon {
    margin-right: 0;
  }
  
  .contact-button {
    justify-content: center;
  }
  
  .section-title,
  .tags-section {
    display: none;
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
