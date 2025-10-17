import Dashboard from './components/Dashboard.js';
import MetricCard from './components/MetricCard.js';

const routes = [
  { path: '/', component: Dashboard },
  { path: '/operators', component: () => import('./components/Operators.js') },
  { path: '/memberships', component: () => import('./components/Memberships.js') },
  { path: '/tariffs', component: () => import('./components/Tariffs.js') },
  { path: '/reports', component: () => import('./components/Reports.js') }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

const app = Vue.createApp({
  data() {
    return {
      currentRoute: window.location.hash || '#/'
    }
  },
  methods: {
    updateActiveLink(hash) {
      document.querySelectorAll('#main-nav a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === hash);
      });
    }
  },
  mounted() {
    this.updateActiveLink(this.currentRoute);
    window.addEventListener('hashchange', () => {
      this.currentRoute = window.location.hash;
      this.updateActiveLink(this.currentRoute);
    });
  }
});

app.component('metric-card', MetricCard);
app.use(router);

app.mount('#app');