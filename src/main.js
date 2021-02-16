import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import enums from 'vue-enums';

Vue.config.productionTip = false
Vue.use(enums);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
