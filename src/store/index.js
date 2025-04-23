import { createStore } from 'vuex';
import { fetchRssFeed } from '../utils/rssParser';
import { techFeedSources, memeFeedSources, motivationalFeedSources } from '../utils/feedSources';

export default createStore({
  state: {
    articles: [],
    bookmarks: [],
    tickers: [],
    isLoading: false,
    error: null,
    theme: localStorage.getItem('theme') || 'dark',
    language: localStorage.getItem('language') || 'en'
  },
  
  getters: {
    getArticleById: (state) => (id) => {
      return state.articles.find(article => article.id === id);
    },
    
    getBookmarkedArticles: (state) => {
      return state.articles.filter(article => state.bookmarks.includes(article.id));
    },
    
    isBookmarked: (state) => (id) => {
      return state.bookmarks.includes(id);
    },
    
    getRandomTicker: (state) => {
      if (state.tickers.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * state.tickers.length);
      return state.tickers[randomIndex];
    }
  },
  
  mutations: {
    SET_ARTICLES(state, articles) {
      state.articles = articles;
    },
    
    ADD_ARTICLES(state, articles) {
      const uniqueArticles = articles.filter(article => 
        !state.articles.some(existingArticle => existingArticle.id === article.id)
      );
      state.articles = [...state.articles, ...uniqueArticles];
    },
    
    SET_TICKERS(state, tickers) {
      state.tickers = tickers;
    },
    
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    
    SET_ERROR(state, error) {
      state.error = error;
    },
    
    SET_THEME(state, theme) {
      state.theme = theme;
      localStorage.setItem('theme', theme);
    },
    
    SET_LANGUAGE(state, language) {
      state.language = language;
      localStorage.setItem('language', language);
    },
    
    TOGGLE_BOOKMARK(state, articleId) {
      const index = state.bookmarks.indexOf(articleId);
      if (index === -1) {
        state.bookmarks.push(articleId);
      } else {
        state.bookmarks.splice(index, 1);
      }
      localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    },
    
    LOAD_BOOKMARKS(state) {
      const savedBookmarks = localStorage.getItem('bookmarks');
      if (savedBookmarks) {
        state.bookmarks = JSON.parse(savedBookmarks);
      }
    }
  },
  
  actions: {
    async fetchFeeds({ commit, dispatch }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // Fetch articles from tech feeds
        const articlePromises = techFeedSources.map(source => fetchRssFeed(source.url));
        const articlesResults = await Promise.allSettled(articlePromises);
        
        // Process successful results
        const articles = articlesResults
          .filter(result => result.status === 'fulfilled')
          .flatMap(result => result.value);
        
        commit('SET_ARTICLES', articles);
        
        // Also fetch tickers (memes and motivational content)
        dispatch('fetchTickers');
        
        commit('SET_LOADING', false);
      } catch (error) {
        console.error('Error fetching feeds:', error);
        commit('SET_ERROR', 'Failed to fetch news feeds. Please try again later.');
        commit('SET_LOADING', false);
      }
    },
    
    async fetchTickers({ commit }) {
      try {
        // Fetch meme and motivational content for the ticker
        const memePromises = memeFeedSources.map(source => fetchRssFeed(source.url, 5));
        const motivationalPromises = motivationalFeedSources.map(source => 
          fetchRssFeed(source.url, 5)
        );
        
        const [memeResults, motivationalResults] = await Promise.all([
          Promise.allSettled(memePromises),
          Promise.allSettled(motivationalPromises)
        ]);
        
        // Process successful results for tickers
        const memeTickers = memeResults
          .filter(result => result.status === 'fulfilled')
          .flatMap(result => result.value);
          
        const motivationalTickers = motivationalResults
          .filter(result => result.status === 'fulfilled')
          .flatMap(result => result.value);
        
        // Combine both types and set as tickers
        const tickers = [...memeTickers, ...motivationalTickers];
        commit('SET_TICKERS', tickers);
      } catch (error) {
        console.error('Error fetching tickers:', error);
      }
    },
    
    toggleBookmark({ commit }, articleId) {
      commit('TOGGLE_BOOKMARK', articleId);
    },
    
    changeTheme({ commit }, theme) {
      commit('SET_THEME', theme);
    },
    
    changeLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language);
    },
    
    loadSavedState({ commit }) {
      commit('LOAD_BOOKMARKS');
    }
  }
});
