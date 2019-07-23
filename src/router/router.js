import Vue from 'vue';
import VueRouter from 'vue-router';
import { routerMode } from '@/config/env';
import store from '@/store'
import Layout from '@/page/index/'
import viewRouter from './_router'
const _import = require('./_import');
import guard from '@/api/routerGuard'
Vue.use(VueRouter);

export default new VueRouter({
	// mode: 'history',
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
			return {
				x: 0,
				y: to.meta.savedPosition || 0
			}
		}
	},
});
export const asyncRouterMap = [
	{
        path: '/login', 
        name: '登录页',
        component: _import('login/index'),
        beforeEnter:guard.innerGuard
    },
	{ 
        path: '/lock',
        name: '锁屏页', 
        component: _import('lock/index'),
        beforeEnter:guard.innerGuard
    },
	{ path: '*', redirect: '/wel', hidden: true },
	{
		path: '/myiframe',
		component: Layout,
		redirect: '/myiframe',
		meta: { keepAlive: true },
		children: [
			{
				path: ":routerPath",
				name: 'iframe',
				component: _import('iframe/main', 'components'),
				props: true
			}
		]

	}
].concat(viewRouter)
