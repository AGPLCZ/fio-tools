import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import enums from 'vue-enums';
import i18n from './i18n';
import VCurrencyField from 'v-currency-field';
import { VTextField } from 'vuetify/lib';

Vue.config.productionTip = false;
Vue.use(enums);

Vue.component('v-text-field', VTextField)
Vue.use(VCurrencyField, { 
	locale: 'cs-CZ',
	decimalLength: 2,
	autoDecimalMode: true,
	min: null,
	max: null,
	defaultValue: 0,
    valueAsInteger: false,
    allowNegative: true
})

export default new Vue({
  router,
  store,
  i18n,
  vuetify,
  
  render: h => h(App)
}).$mount('#app')
