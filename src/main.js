import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局初始化样式
import './assets/index.css'
// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 插件 Element-ui
import VueLazyload from 'vue-lazyload'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('../src/assets/loading.gif'),
  attempt: 1
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
