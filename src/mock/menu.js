import {  baseUrl } from '@/config/env'
export default [
      {
      id: 1,
      name: "基础信息",
      icon: 'icon-leftbar__-4',
      parentId:-1,
      spread:false,
      type:"0",
      children: [        
        {
          icon:"icon-jiaoseguanli",
          id:3,
          name:"企业信息",
          parentId:1,
          path:"/baseInfo/enterprise",
          spread:false,
          type:"0",
          url:"/saas/role",
          children:[]
        },
          {
          icon:"icon-yonghuguanli",
          id:2,
          name:"员工信息",
          parentId:1,
          path:"/baseInfo/employer",
          spread:false,
          type:"0",
          url:"/saas/user",
          children:[]
        },
      ]
    },
    {
      id: 21,
      name: "工资管理",
      icon: 'icon-leftbar__-2',
      parentId:-1,
      spread:false,
      type:"0",
      children: [
        {
          icon:"icon-xitongguanli",
          id:22,
          name:"工资发放",
          parentId:21,
          path:"/salaryManage/salaryProvide",
          spread:false,
          type:"0",
          url:"",
          children:[]
        },
        {
          icon:"icon-jiaoseguanli",
          id:25,
          name:"打款下载",
          parentId:21,
          path:"/salaryManage/dealDownload",
          spread:false,
          type:"0",
          url:"",
          children:[]
        },
          {
          icon:"icon-jiaoseguanli",
          id:26,
          name:"打款确认",
          parentId:21,
          path:"/salaryManage/dealConfirm",
          spread:false,
          type:"0",
          url:"",
          children:[]
        }
      ]
    },
    {
      id: 31,
      name: "参数设置",
      icon: 'icon-leftbar__-7',
      parentId:-1,
      spread:false,
      type:"0",
      children: [
        {
          icon:"icon-xitongguanli",
          id:32,
          name:"收益设置",
          parentId:31,
          path:"/profit/profitChange",
          spread:false,
          type:"0",
          url:"",
          children:[]
        },
        {
          icon:"icon-jiaoseguanli",
          id:35,
          name:"自动提现设置",
          parentId:31,
          path:"/profit/autoWithdraw",
          spread:false,
          type:"0",
          url:"",
          children:[]
        }
      ]
    },
    {
      id: 41,
      name: "查询统计",
      icon: 'icon-cxtj_-',
      parentId:-1,
      spread:false,
      type:"0",
      children: [
        {
          icon:"icon-xitongguanli",
          id:42,
          name:"账户综合查询",
          parentId:41,
          path:"/query/multipleQuery",
          spread:false,
          type:"0",
          url:"",
          children:[]
        },
        {
          icon:"icon-jiaoseguanli",
          id:45,
          name:"员工余额查询",
          parentId:41,
          path:"/query/employerQuery",
          spread:false,
          type:"0",
          url:"",
          children:[]
        },
		  {
          icon:"icon-jiaoseguanli",
          id:46,
          name:"月汇总查询",
          parentId:41,
          path:"/query/summaryQuery",
          spread:false,
          type:"0",
          url:"",
          children:[]
        }
      ]
    },    
    {
      id: 51,
      name: "权限设置",
      icon: 'icon-leftbar__-9',
      parentId:-1,
      spread:false,
      type:"0",
      children: [
        {
          icon:"icon-xitongguanli",
          id:52,
          name:"用户管理",
          parentId:51,
          path:"/admin/user",
          spread:false,
          type:"0",
          url:"/saas/user",
          children:[]
        },
        {
          icon:"icon-jiaoseguanli",
          id:55,
          name:"角色管理",
          parentId:51,
          path:"/admin/role",
          spread:false,
          type:"0",
          url:"/saas/role",
          children:[]
        }
      ]
    },
    {
      id: 61,
      name: "消息管理",
      icon: 'icon-leftbar__-11',
      parentId:-1,
      spread:false,
      type:"0",
      children: [
        {
          icon:"icon-xitongguanli",
          id:62,
          name:"消息列表",
          parentId:61,
          path:"/msg/lists",
          spread:false,
          type:"0",
          url:"",
          children:[]
        },
        {
          icon:"icon-jiaoseguanli",
          id:65,
          name:"消息推送",
          parentId:61,
          path:"/msg/notification",
          spread:false,
          type:"0",
          url:"/enterprise/enterprise/queryMyEnterprise",
          children:[]
        }
      ]
    },
    {
      id: 71,
      name: "集团管理",
      icon: 'icon-jituanguanli-',
      parentId:-1,
      spread:false,
      type:"0",
      children: [
        {
          icon:"icon-xitongguanli",
          id:72,
          name:"集团公司",
          parentId:61,
          path:"/group/company",
          spread:false,
          type:"0",
          url:"",
          children:[]
        },
        {
          icon:"icon-jiaoseguanli",
          id:75,
          name:"集团分配",
          parentId:61,
          path:"/group/right",
          spread:false,
          type:"0",
          url:"",
          children:[]
        }
      ]
    }
]