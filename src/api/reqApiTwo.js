import axios from '@/router/axios'
import qs from 'qs'
let reqApiTwo = {
    getRevenueHistory:(params) => {
        return axios({
            url: '/account/saas/revenueSettingHistory/queryRevenueHistory',
            method: 'get',
            params
        })
        //收益设置历史记录查询
    },
    getQueryType:(params) => {
        return axios({
            url: '/account/saas/revenueType/queryType',
            method: 'get',
			params
        })
        //显示默认收益参数
    },
    setPreferMoney:(data) => {
        return axios({
            url: '/account/saas/revenueType/updateWithdrawOrderSetting',
            method: 'post',
            data:qs.stringify(data)
        })
        //收益工资优先
    },    
    updateEarningsSetting:(data) => {
        return axios({
            url: '/account/saas/revenueType/updateEarningsSetting',
            method: 'post',
            data:qs.stringify(data)
        })
        //添加收益率设置
    },    
    updateCategorySetting:(data) => {
        return axios({
            url: '/account/saas/revenueType/updateCategorySetting',
            method: 'post',
            data:qs.stringify(data)
        })
        //添加单复利设置
    },    
	updateMinimumAmountSetting:(data) => {
        return axios({
            url: '/account/saas/revenueType/updateMinimumAmountSetting',
            method: 'post',
            data:qs.stringify(data)
        })
        //最低提现金额设置
    }, 
	
	switchSubEnterpirse:(data)=> {
        return axios({
            url: '/account/saas/account/switchSubEnterpirse',
            method: 'post',
            data:qs.stringify(data)
        })
        //切换公司
    }, 
	
    modifiedMyEnterprise:(data) => {
        return axios({
            url: '/enterprise/saas/enterprise/modifiedMyEnterprise',
            method: 'post',
            data:qs.stringify(data)
        })
        //编辑企业接口
    },
    modifiedEnterpriseLogo:(data) => {
        return axios({
            url:'/oss/saas/upload/logo',
            method: 'post',
            data
        })
        //上传企业头像
    },    
    getEnterpriseInfo:(params) => {
        return axios({
            url: '/enterprise/saas/enterprise/queryMyEnterprise',
            method: 'get',
            params
        })
        //查询企业
    },
    exportEmployerExcel:(data)=>{
        return axios({
            url: '/account/saas/account/exportEmployeeTemplet',
            method: 'post',
			data:qs.stringify(data),
            responseType: 'blob'
        })
        //导出员工信息模板
    },    
    editEmployerInfo:(data)=>{
        return axios({
            url: '/account/saas/account/modifiedBasic',
            method: 'post',
            data:qs.stringify(data)
        })
        //编辑员工基础信息
    },
    editEmployerStatus:(data)=>{
        return axios({
            url: '/account/saas/account/setStatus',
            method: 'post',
            data:qs.stringify(data)
        })
        //编辑员工状态
    },
    queryMultiple:(params) => {
        return axios({
            url: '/account/saas/bill/queryBill',
            method: 'get',
            params
        })
        //账户综合查询
    },
    queryEmployeeAmount:(params) => {
        return axios({
            url: '/account/saas/account/queryEmployeeAmount',
            method: 'get',
            params
        })
        //员工余额查询
    },
    queryEmployerDetailAmount:(params) => {
        return axios({
            url: '/account/saas/account/queryAmountBalance/'+params,
            method: 'get'
        })
        //员工余额详情查询
    },
    queryMultipleBillDetail:(params) => {
        return axios({
            url: '/account/saas/bill/billDetail/'+params,
            method: 'get'
        })
        //账户综合查询详情查询
    },
    getMessagesLists:(params) => {
        return axios({
            url: '/gotone/saas/gtTimingPushEp',
            method: 'get',
            params
        })
        //获取发送消息列表
    },
    deleteMessage:(data)=>{
        return axios({
            url: '/gotone/saas/gtTimingPushEp/deletePush',
            method: 'post',
            data:qs.stringify(data)
        })
        //删除消息
    },
    pushMessage:(data)=>{
        return axios({
            url: '/gotone/saas/gtTimingPushEp/pushSetting',
            method: 'post',
            data:qs.stringify(data)
        })
        //消息发送
    },
    getBackMessage:(params) => {
        return axios({
            url: '/gotone/saas/gtTimingPushEp/forDetails',
            method: 'get',
            params
        })
        //消息详情查看
    },
    editMessage:(data)=>{
        return axios({
            url: '/gotone/saas/gtTimingPushEp/updateInformation',
            method: 'post',
            data:qs.stringify(data)
        })
        //消息编辑
    },    
    getRolesLists:(params) => {
        return axios({
            url: '/enterprise/saas/role',
            method: 'get',
            params
        })
        //获取角色列表
    },
    getHeaderCollect:() => {
        return axios({
            url: '/account/saas/index/indexHeaderCollect',
            method: 'get'
        })
        //首页头部信息
    },
    getMenuIdByRole:(params) => {
        return axios({
            url: '/saas/saas/menu/getMenuIdByRoleId/'+params,
            method: 'get'
        })
        //通过角色id获取菜单
    },
    permissionsMenu:(params) => {
        return axios({
            url: '/saas/saas/menu',
            method: 'get',
            params
        })
        //获取权限菜单
    },
    editRoleInfo:(data) => {
        return axios({
            url: '/enterprise/saas/role',
            method: 'put',
            data:qs.stringify(data)
        })
        //修改角色信息
    },
    deleteRoleInfo:(data) => {
        return axios({
            url: '/enterprise/saas/role',
            method: 'delete',
            data:qs.stringify(data)
        })
        //删除角色信息
    },
    getRoleDetails:(params) => {
        return axios({
            url: '/enterprise/saas/role/'+params,
            method: 'get'
        })
        //获取角色详细信息
    },
    addRole:(data) => {
        return axios({
            url: '/enterprise/saas/role',
            method: 'post',
            data:qs.stringify(data)
        })
        //新增角色
    },
    editRolePermission:(data) => {
        return axios({
            url: '/enterprise/saas/role/updatePermission',
            method: 'post',
            data:qs.stringify(data,{ arrayFormat: 'repeat' })
        })
        //修改角色权限
    },
    
    getUsersLists:(params) => {
        return axios({
            url: '/enterprise/saas/user',
            method: 'get',
            params
        })
        //获取用户列表
    },  
    editUserInfo:(data) => {
        return axios({
            url: '/enterprise/saas/user/updateUser',
            method: 'post',
            data:qs.stringify(data)
        })
        //根据id修改用户信息
    },
    editUserAndRoleInfo:(data) => {
        return axios({
            url: '/enterprise/saas/user/updateUser',
            method: 'post',
            data:qs.stringify(data,{ arrayFormat: 'repeat' })            
        })
        //修改用户及其角色信息
    },
    deleteUser:(data) => {
        return axios({
            url: '/enterprise/saas/user/'+data,
            method: 'delete'
        })
        //禁用用户
    },
    addUser:(data) => {
        return axios({
            url: '/enterprise/saas/user/addSaasUser',
            method: 'post',
            data:qs.stringify(data)
        })
        //新增用户
    },
    losingRate:(params) => {
        return axios({
            url: '/account/saas/index/retentionRate',
            method: 'get',
            params
        })
        //留存率
    },
    retainedAmount:(params) => {
        return axios({
            url: '/account/saas/index/retention',
            method: 'get',
            params
        })
        //留存金额
    },
    quit:(data) => {
        return axios({
            url: '/enterprise/saas/user/logout',
            method: 'post',
            data:qs.stringify(data)
        })
        //退出登录
    },
    resetPassword:(data) => {
        return axios({
            url: '/enterprise/saas/user/resetLoginPassword',
            method: 'post',
            data:qs.stringify(data)
            
        })
        //重置用户密码
    },
    
    deleteEmployer:(data) => {
        return axios({
            url: '/account/saas/account/deleteEmployee',
            method: 'post',
            data:qs.stringify(data,{ arrayFormat: 'repeat' })
        })
        //删除用户
    },
     getAccountLog:(params) => {
        return axios({
            url: '/account/saas/accountlog',
            method: 'get',
            params
        })
        //员工余额详情查询
    },
    queryStaffInfoById:(params)=>{
        return axios({
            url: '/account/saas/account/queryEmployeeInfoById',
            method: 'get',
            params
        })
        //根据ID获取员工信息
    },
    queryStaffDeatils:(params)=>{
        return axios({
            url: '/account/saas/account/queryEmployeeDetail',
            method: 'get',
            params
        })
        //查看员工详情
    },
    extractMoney:(data) => {
        return axios({
            url: '/account/saas/account/replaceWithdraw',
            method: 'post',
            data:qs.stringify(data)
        })
        //提取金额
    },
    addDescription:(data) => {
        return axios({
            url: '/account/saas/bill/addDescription',
            method: 'post',
            data:qs.stringify(data)
        })
        //工资发放说明
    },
    addFeedback:(data) => {
        return axios({
            url: '/core/saas/feedback/add',
            method: 'post',
            data:qs.stringify(data)
        })
        //发送反馈
    },
    queryMyFeedback:(params)=>{
        return axios({
            url: '/core/saas/feedback/queryMyFeedback',
            method: 'get',
            params
        })
        //查看我的反馈
    }, 
    reExportWithdrawalDownload: (data) => {
        return axios({
            url: '/account/saas/bill/exportWithdrawalDownload',
            method: 'POST',
            data: qs.stringify(data,{ arrayFormat: 'repeat' }),
            responseType: 'blob'
        })
        //重新下载付款单
    },
    exportBtnExcel:(data)=>{
        return axios({
            url: '/account/saas/account/exportEmployee',
            method: 'post',
            responseType: 'blob',
			data: qs.stringify(data),
        })
        //员工基础信息页面导出按钮
    },    
     getMyInfo:()=>{
        return axios({
            url: '/enterprise/saas/user/info',
            method: 'get'
        })
        //获取登录用户所有信息
    },
    updatekLoginPassword:(data) => {
        return axios({
            url: '/enterprise/saas/user/updateLoginPassword',
            method: 'post',
            data:qs.stringify(data)
        })
        //顶部修改密码
    },
    exportEmployeeAmount: (data) => {
        return axios({
            url: '/account/saas/account/exportEmployeeAmount',
            method: 'POST',
            data: qs.stringify(data,{ arrayFormat: 'repeat' }),
            responseType: 'blob'
        })
        //员工余额导出
    },    
    exportEmployeeBillTemplet: (data) => {
        return axios({
            url: '/account/saas/bill/exportEmployeeBillTemplet',
            method: 'POST',
            data: qs.stringify(data,{ arrayFormat: 'repeat' }),
            responseType: 'blob'
        })
        //工资发放导出
    },    
    sendNotLogEmail:(data) => {
        return axios({
            url: '/gotone/saas/sendEmail/sendNotLogin',
            method: 'post',
            data:qs.stringify(data)
        })
        //未登录状态下发送邮件
    },
    forgetLoginPassword:(data) => {
        return axios({
            url: '/enterprise/saas/user/forgetLoginPassword',
            method: 'post',
            data:qs.stringify(data)
        })
        //忘记登录密码，修改密码
    },
    getMyEnterpriseLogo:()=>{
        return axios({
            url: '/enterprise/saas/enterprise/queryMyEpLogo',
            method: 'get'
        })
        //获取企业头像
    },
     agreeProtocol:()=>{
        return axios({
            url: '/enterprise/saas/enterprise/firstConfirm',
            method: 'post'
        })
        //同意协议
    },
    firstSetParams:(data)=>{
        return axios({
            url: '/enterprise/saas/enterprise/firstSet',
            method: 'post',
            data:qs.stringify(data)
        })
        //首次设置收益
    },	
	checkUserPerssion:(params)=>{
        return axios({
            url: '/saas/saas/saasUserMenu',
            method: 'get',
			params
        })
        //用户查看权限
    },
	updateUserPerssion:(data)=>{
        return axios({
            url: '/saas/saas/saasUserMenu/updatePermission',
            method: 'post',
            data:qs.stringify(data,{ arrayFormat: 'repeat' })
        })
        //变更用户权限
    },
	queryMyEnterpriseTree:(params)=>{
		return axios({
            url: '/enterprise/saas/enterprise/queryMyEnterpriseTree',
            method: 'get',
			params
        })
        //获取企业列表
	},	
	addSubEnterpriseTree:(data)=>{
        return axios({
            url: '/enterprise/saas/enterprise/addSubEnterpriseTree',
            method: 'post',
            data:qs.stringify(data,{ arrayFormat: 'repeat' })
        })
        //添加子企业
    },	
	updateSubEnterpriseTree:(data)=>{
        return axios({
            url: '/enterprise/saas/enterprise/updateSubEnterpriseTree',
            method: 'post',
            data:qs.stringify(data,{ arrayFormat: 'repeat' })
        })
        //更新子企业
    },	
	queryMyEpAllocation:(params)=>{
		return axios({
            url: '/enterprise/saas/enterprise/queryMyEpAllocation',
            method: 'get',
			params
        })
        //获取企业列表分配
	},	
	queryMyEpAllocationDetail:(params)=>{
		return axios({
            url: '/enterprise/saas/enterprise/queryMyEpAllocationDetail',
            method: 'get',
			params
        })
        //获取企业分配双数组
	},	
	groupAllocation:(data)=>{
        return axios({
            url: '/saas/saas/eplink/groupAllocation',
            method: 'post',
            data:qs.stringify(data,{ arrayFormat: 'repeat' })
        })
        //调换分配
    },
	queryMonthCollection:(params) => {
        return axios({
            url: '/account/saas/bill/queryMonthCollection',
            method: 'get',
            params
        })
        //月汇总查询
    },
	queryMonthCollectionDetails:(params) => {
        return axios({
            url: '/account/saas/bill/queryMonthCollectionDetails',
            method: 'get',
            params
        })
        //月汇总详情查询
    },
	
	
	
};
export default reqApiTwo;