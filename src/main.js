import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import enums from 'vue-enums';
import i18n from './i18n'

Vue.config.productionTip = false;
Vue.use(enums);

export default new Vue({
  router,
  store,
  i18n,
  vuetify,
  
  render: h => h(App)
}).$mount('#app')
