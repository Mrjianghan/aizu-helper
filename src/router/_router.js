const _import = require('./_import');
import guard from '@/api/routerGuard' 
const Layout  = (resolve) => require(['../page/index/index.vue'], resolve)
const wel  = () => import('../page/wel.vue')
export default [
    {
      name:'协议',
      path: '/protocol',
      component:  require('../views/protocol/protocol'),     
    },
    {
        name:'首次参数设置',
        path: '/params',
        component:  require('../views/protocol/params'),     
    },
    {
      path: '/wel',
      component: Layout,
      redirect: '/wel/index',
        children: [{
          path: 'index',
          name: '首页',
            component:wel,
            meta:{
                name:'首页',
                icon:'icon-home_-4'
            },            
            beforeEnter:guard.innerGuard
        }]
    },
    {
      path: '/baseInfo',
      component: Layout,
      name:'基础信息',
        children: [
            {
              path: 'employer',
              name: '员工信息',
              component: require('../views/baseInfo/employerInfo'),
                meta:{
                    name:'基础信息',
                    icon:'icon-leftbar__-4'
                },
                beforeEnter:guard.innerGuard
            },
            {
              path: 'enterprise',
              name: '企业信息',
              component: require('../views/baseInfo/enterpriseInfo'),
                meta:{
                    name:'基础信息',
                    icon:'icon-leftbar__-4'
                },
                beforeEnter:guard.innerGuard
            }
        ]
    },    
    {
      path: '/salaryManage',
      component: Layout,
      name:'工资管理',
        children: [
            {
              path: 'salaryProvide',
              name: '工资发放',
              component: require('../views/salaryManage/salaryProvide'),
                meta:{
                    name:'工资管理',
                    icon:'icon-leftbar__-2'
                },
                beforeEnter:guard.innerGuard
            },
            {
              path: 'dealDownload',
              name: '打款下载',
              component: require('../views/salaryManage/dealDownload'),
                meta:{
                    name:'工资管理',
                    icon:'icon-leftbar__-2'
                },
                beforeEnter:guard.innerGuard
            },
            {
              path: 'dealConfirm',
              name: '打款确认',
              component: require('../views/salaryManage/dealConfirm'),
                meta:{
                    name:'工资管理',
                    icon:'icon-leftbar__-2'
                },
                beforeEnter:guard.innerGuard
            }
        ]
    },    
    {
        path: '/msg',
        component: Layout,
        name:'消息管理',
        children: [
            {
                path: 'notification',
                name: '消息推送',
                component: require('../views/msg/notification'),
                meta:{
                    name:'消息管理',
                    icon:'icon-leftbar__-11'
                },
                beforeEnter:guard.innerGuard
            },
            {
                path: 'lists',
                name: '消息列表',
                component: require('../views/msg/MsgLists'),
                meta:{
                    name:'消息管理',
                    icon:'icon-leftbar__-11'
                },
                beforeEnter:guard.innerGuard
            }
        ]
    },
	{
        path: '/group',
        component: Layout,
        name:'集团管理',
        children: [
            {
                path: 'company',
                name: '集团公司',
                component: require('../views/group/groupCompany'),
                meta:{
                    name:'集团管理',
                    icon:'icon-jituanguanli-'
                },
                beforeEnter:guard.innerGuard
            },
            {
                path: 'right',
                name: '集团分配',
                component: require('../views/group/groupRight'),
                meta:{
                    name:'集团管理',
                    icon:'icon-jituanguanli-'
                },
                beforeEnter:guard.innerGuard
            }
        ]
    },
    {
        path: '/profit',
        component: Layout,
        name:'参数设置',
        children: [
            {
                path: 'profitChange',
                name: '收益设置',
                component: require('../views/profitSetup/profitChangeRecords'),
                meta:{
                    name:'参数设置',
                    icon:'icon-leftbar__-7'
                },
                beforeEnter:guard.innerGuard
            },
            {
                path: 'autoWithdraw',
                name: '自动提现设置',
                component: require('../views/profitSetup/autoWithdrawSet'),
                meta:{
                    name:'参数设置',
                    icon:'icon-leftbar__-7'
                },
                beforeEnter:guard.innerGuard
            }
			
        ]
    },
       {
        path: '/query',
        component: Layout,
        name:'查询统计',
        children: [
            {
                path: 'multipleQuery',
                name: '账户综合查询',
                component: require('../views/query/multipleQuery'),
                meta:{
                    name:'查询统计',
                    icon:'icon-cxtj_-'
                },
                beforeEnter:guard.innerGuard
            },
            {
                path: 'employerQuery',
                name: '员工余额查询',
                component: require('../views/query/employerQuery'),
                meta:{
                    name:'查询统计',
                    icon:'icon-cxtj_-'
                },
				beforeEnter:guard.innerGuard
            },
			{
                path: 'summaryQuery',
                name: '月汇总查询',
                component: require('../views/query/summaryQuery'),
                meta:{
                    name:'查询统计',
                    icon:'icon-cxtj_-'
                },
				beforeEnter:guard.innerGuard
            }
        ]
    },
    {
      path: '/',
      name: '主页',
      redirect: '/wel'
    },
    {
      path: '/info',
      component: Layout,
      redirect: '/info/index'
    },
    {
      menuId: 1,
      path: '/admin',
      component: Layout,
      name: '权限设置',
      hidden: false,
      redirect: '/admin/user',
      meta: {
        title: '权限设置',
      },
        children: [{
            menuId: 2,
            path: 'user',
            component: _import('admin/user/index', 'views'),
            name: '用户管理',
            meta: {
              title: '用户管理',
                name:'权限设置',
                icon:'icon-leftbar__-9'
            },
            beforeEnter:guard.innerGuard
          },
          {
            menuId: 4,
            path: 'role',
            component: _import('admin/role/index', 'views'),
            name: '角色管理',
            meta: {
              title: '角色管理',
                name:'系统管理',
                icon:'icon-leftbar__-9'
            },
              beforeEnter:guard.innerGuard
          },
        ]
    },
]