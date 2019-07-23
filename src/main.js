import Vue from 'vue';
import App from './App';
import './permission' // 权限
import router from './router/router';
import store from './store';
import ElementUI from 'element-ui'
Vue.use(ElementUI);
import AVUE from 'avue-cli/packages/index.js';
import {  loadStyle } from './util/util';
import * as urls from '@/config/env';
import * as filters from './filters' // 全局filter
import './styles/common.scss';
import storejs from 'store';
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.directive('permit', {
  inserted: function (el,binding) {
      let permissions = storejs.get('userInfo').permissions;
      let senser = permissions.some(ele=>{
          return ele == binding.value;
      })
      if( senser ){
         return true;
      }else{
          el.parentNode.removeChild(el);
      }
  }
});
import myTree from '@/views/cusComponents/myTree.vue'
Vue.component('myTree',myTree );
import myTransfer from '@/views/cusComponents/myTransfer.vue'
Vue.component('myTransfer',myTransfer );
Vue.config.productionTip = false;
export function createApp() {
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return {
    app,
    router,
    store
  }
}