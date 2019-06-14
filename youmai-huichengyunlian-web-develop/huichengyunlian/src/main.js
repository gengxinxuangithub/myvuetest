// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
 import $ from 'jquery'
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'//导入文件
import VueAreaLinkage from 'vue-area-linkage';
import 'vue-area-linkage/dist/index.css';
Vue.use(VueAreaLinkage);
import './assets/icon/iconfont.css'//引入icon库
import _ from 'lodash'
import './permission'
import VueQriously from 'vue-qriously'
import './axios/index.js'
import fliter from './filters/filter'
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts


Vue.use(VueQriously)
Vue.prototype.$moment = moment;//赋值使用
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
