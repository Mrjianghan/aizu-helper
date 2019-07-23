import axios from '@/router/axios'
import qs from 'qs'
let reqApi = {
    getAllStaff:(params) => {
        return axios({
            url: '/account/saas/account',
            method: 'get',
            params
        })
        //查询企业下所有员工
    },
    addStaff:(data) => {
        return axios({
            url: '/account/saas/account/addEmployee',
            method: 'post',
            data: qs.stringify(data)
        })
        //新增员工
    },
    getWithdrawalDownload: (params) => {
        return axios({
            url: '/account/saas/bill/queryWithdrawalDownload',
            method: 'get',
            params
        })
        //打款下载查询
    },
    openwithdrawalDownload: (data) => {
        return axios({
            url: '/account/saas/bill/withdrawalDownload',
            method: 'POST',
            data: qs.stringify(data,{ arrayFormat: 'repeat' }),
            responseType: 'blob'
        })
        //打款下载
    },
    getWithdrawalNotarize: (params) => {
        return axios({
            url: '/account/saas/bill/queryWithdrawalNotarize',
            method: 'get',
            params
        })
        //打款确认查询
    },
    openWithdrawalNotarize: (data) => {
        return axios({
            url: '/account/saas/bill/confirmWithdrawal',
            method: 'POST',
            data: qs.stringify(data,{ arrayFormat: 'repeat' }),
        })
        //打款确认
    },
    
    getEmployeeBillTemplet: (params) => {
        return axios({
            url: '/account/saas/bill/queryEmployeeBillTemplet' ,
            method: 'get',
            params
        })
        //工资发放查询
    },
    openGrantEmployeeBill:(data) => {
        return axios({
            url: '/account/saas/bill/grantEmployeeBill',
            method: 'post',
            data: qs.stringify(data)
        })
        //确认发放
    },
    getQueryAll: () => {
        return axios({
            url: '/account/saas/salaryCategory/queryAll',
            method: 'get'
        })
        //查询所有薪资类别
    },
    openUpdateSalaryCategory: (ids) => {
        return axios({
            url: '/account/saas/salaryCategory/updateSalaryCategory',
            method: 'POST',
            data: qs.stringify({
                id: ids
            },{ arrayFormat: 'repeat' }),
        })
        //勾选薪资类别
    },
    importStaffExcel:( data )=>{
        return axios({
            url: '/account/saas/account/importEmployee',
            method: 'post',
            data,
        })
        //企业导入旗下所有员工信息接口
    },


    uploadSalaryExcel:( data )=>{
        return axios({
            url: '/account/saas/bill/importEmployeeBill',
            method: 'post',
            data,
        })
        //选择文件上传工资模板
    },

    exportSalaryExcel:(data)=>{
        return axios({
            url: '/account/saas/bill/exportBaseBillExcel',
            method: 'post',
			data:qs.stringify(data),
            responseType: 'blob'
        })
        //导出工资模板
    },
    getAutoWithdrawal:(params) => {
        return axios({
            url: '/account/saas/account/queryAutoWithdrawal',
            method: 'get',
            params
        })
        //自动提现设置用户所有状态查询
    },
    openUpdateAutoWithdrawal: (ids,num) => {
        return axios({
            url: '/account/saas/account/updateAutoWithdrawal',
            method: 'POST',
            data: qs.stringify({
                id: ids,
                autoWithdrawal: num
            },{ arrayFormat: 'repeat' })
        })
        //设置提现状态
    },
    confirmPopout:(data) => {
        return axios({
            url: '/account/saas/bill/grantEmployeeBillValidate',
            method: 'post',
            data: qs.stringify(data)
        })
        //确认发放工资弹窗
    },
    
    
    

};


export default reqApi;

