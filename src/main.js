import Vue from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
import VueCookie from 'vue-cookie'
import '@/element-ui'
import '@/element-ui-theme'
import '@/assets/css/font-awesome.min.css'
import axios from 'axios'
// import 'amfe-flexible'//字体自适应
import '@/assets/sass/index.scss'
import httpRequest from '@/utils/httpRequest'
// import '@/assets/css/jsmind.css'
// 防按钮多次点击
// import './utils/btn-directive'

Vue.use(VueCookie)
Vue.prototype.$http = httpRequest // ajax请求方法
Vue.config.productionTip = false
Vue.prototype.axios = axios
axios.defaults.withCredentials = true;

// const vuethis = new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
const vuethis = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default vuethis