import Vue from 'vue';
import Router from 'vue-router';
import Fragment from 'vue-fragment';
import App from 'App';
import HomePage from 'pages/home';

Vue.config.productionTip = false;

const router = new Router({
  routes: [
    {
      path: '/',
      component: HomePage,
    },
  ],
  fallback: true,
  mode: 'history',
});

Vue.use(Fragment.Plugin);
Vue.use(Router);

new Vue({
  el: 'body',
  router,
  render: (h) => h(App),
});

