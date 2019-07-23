import router from './router/router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { setTitle } from '@/util/util';
import { asyncRouterMap } from '@/router/router'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/404', '/401', '/lock']
const lockPage = '/lock'
router.addRoutes(asyncRouterMap); // 动态添加可访问路由表
//寻找子菜单的父类
function findMenuParent(tag) {
    let tagCurrent = [];
    const menu = store.getters.menu;
    tagCurrent.push(tag);
    return tagCurrent;
}
router.afterEach((to, from) => {
    
    NProgress.done();
    
    setTimeout(() => {
        
        const tag = store.getters.tag;
        
        setTitle(tag.label);
        
        store.commit('SET_TAG_CURRENT', findMenuParent(tag));
        
    }, 0);
})
