import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import '@/assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'
axios.defaults.baseURL = 'http://127.0.0.1:3000'
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
