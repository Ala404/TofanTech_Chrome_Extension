import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import BookmarksView from '../views/BookmarksView.vue';
import SettingsView from '../views/SettingsView.vue';
import ArticleView from '../views/ArticleView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'TofanTech - Home'
    }
  },
  {
    path: '/bookmarks',
    name: 'bookmarks',
    component: BookmarksView,
    meta: {
      title: 'TofanTech - Bookmarks'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'TofanTech - Settings'
    }
  },
  {
    path: '/article/:id',
    name: 'article',
    component: ArticleView,
    props: true,
    meta: {
      title: 'TofanTech - Article'
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Update page title based on route
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'TofanTech';
  next();
});

export default router;
