import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import { formatter } from './components/DateFormatter';

Vue.prototype.$formatterDate = formatter;

new Vue({
  render: h => h(App),
}).$mount('#app')
