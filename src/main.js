import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { createI18n } from 'vue-i18n';
import messages from './i18n';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import Tag from 'primevue/tag';
import ToggleButton from 'primevue/togglebutton';
import Toast from 'primevue/toast';
import Chip from 'primevue/chip';
import ScrollPanel from 'primevue/scrollpanel';
// Tailwind CSS now loaded via CDN

// Get stored language preference or default to 'en'
const storedLanguage = localStorage.getItem('language') || 'en';

// Configure i18n
const i18n = createI18n({
  locale: storedLanguage,
  fallbackLocale: 'en',
  messages,
  legacy: false
});

// Create the Vue app
const app = createApp(App);

// Use plugins
app.use(router);
app.use(store);
app.use(i18n);
app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'filled'
});
app.use(ToastService);
app.use(ConfirmationService);

// Register PrimeVue components
app.component('Button', Button);
app.component('Card', Card);
app.component('Dropdown', Dropdown);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('Tag', Tag);
app.component('ToggleButton', ToggleButton);
app.component('Toast', Toast);
app.component('Chip', Chip);
app.component('ScrollPanel', ScrollPanel);

// Register directives
app.directive('tooltip', Tooltip);

// Mount the app
app.mount('#app');
