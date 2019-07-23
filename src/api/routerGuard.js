import router from '@/router/router'
const whiteList = ['/login', '/404', '/401', '/lock']
const lockPage = '/lock'
import store from '@/store/index'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import storejs from 'store';  
import {  getUserInfo, logout } from '@/api/login'
import errInfo from '@/api/errInfo' 
let guard = {
        "innerGuard":(to, from, next) => {
                     NProgress.start() // start progress bar
                     const value = to.query.src ? to.query.src : to.path;
                     const label = to.query.name ? to.query.name : to.name;
                     if (whiteList.indexOf(value) == -1) {
                         store.commit('ADD_TAG', {
                             label: label,
                             value: value,
                             query: to.query
                         });
                     }
                     if (store.getters.access_token) { // determine if there has token
                         /* has token*/
                         if (store.getters.isLock && to.path != lockPage) {
                             next({ path: lockPage })
                             NProgress.done();
                         } else if (to.path === '/login') {
                             next({ path: '/' })
                             NProgress.done();
                         } else {
                             if (!store.getters.username) {
                                 getUserInfo().then(res=>{
                                     if(res.success){
                                         let userInfo = res.data;
                                         store.dispatch('GetUserInfo',userInfo);
                                         let sortArr = userInfo.menuTrees.sort((a,b)=>{
                                            return a.sort - b.sort;
                                        });
                                         store.commit('SET_MENU',sortArr);
                                         storejs.set('userInfo',userInfo);
                                         next();
                                     }
                                 }).catch(err=>{
                                     errInfo.err(err); 
                                     store.dispatch('FedLogOut').then(() => {
                                         next({ path: '/login' })
                                         NProgress.done();
                                     })
                                 })
                             } else {
                                 next()
                             }
                         }
                     } else {
                         /* has no token*/
                         if (whiteList.indexOf(to.path) !== -1) {
                             next()
                         } else {
                             next('/login')
                             NProgress.done();
                         }
                     }                
            }
    
    
    
}



export default guard