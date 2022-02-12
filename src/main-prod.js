import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import '@/assets/css/global.css'
import '@/assets/icon/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
axios.defaults.baseURL = 'http://106.55.183.116:3333'
// axios.defaults.baseURL = '/api' //打包后前端代理失效 直接用
// axios拦截器
axios.interceptors.request.use(function (config) {
  // 添加一个时间戳 防止缓存
  if (config.params) {
    config.params.time = Number(new Date())
  }
  // 携带cookie 跨域
  config.withCredentials = true
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
