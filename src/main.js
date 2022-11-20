import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueBus from 'vue-bus'
// 导入全局初始化样式
import './assets/index.css'
// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 导入 Vue-lazyload
import VueLazyload from 'vue-lazyload'
// 导入 Vue-aplayer
import APlayer from '@moefe/vue-aplayer'
Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('../src/assets/loading.gif'),
  attempt: 1
})

Vue.use(APlayer, {
  defaultCover: 'https://github.com/u3u.png',
  productionTip: true
})

Vue.use(VueBus)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
