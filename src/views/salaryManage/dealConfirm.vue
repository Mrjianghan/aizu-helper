<template>
    <div class="salaryConfirmContainer">
        <div class="white-con">
            <div class="white-con-top-con">
				<div class="leftFlex">
					<div class="groupShow" v-if="groupShow">
						  <el-select v-model="companyExtra" placeholder="请选择" @change="saveEnterprise(companyExtra)">
							<el-option
							  v-for="item in companyExtraOptions"
							  :key="item.value"
							  :label="item.label"
							  :value="item.value">
							</el-option>
						  </el-select>
					</div>
                	<div v-permit="'23'" class="download" @click="ifDialogVisible">打款确认</div>
				</div>
                <div class="reExportStyle" v-permit="'25'" @click="reExport">
                    <i class="icon-font icon-jcxx_-8"></i>重新下载付款单
                </div>
            </div>
            <div class="white-con-top-form">
                <div class="staffNumber">
                    <span>员工号</span><input v-model.trim="staffNumber" @blur="staffNumberBlur">
                </div>
                <div class="staffName">
                    <span>姓名</span><input v-model.trim="staffName" @blur="staffNameBlur">
                </div>
                <div class="money">
                    <span>金额</span><input placeholder="最低金额" class="minMoney" v-model.trim="minMoney" @blur="minMoneyBlur"><span class="hr" style="color: #6479ff!important;">——
                    </span><input placeholder="最高金额" class="maxMoney" v-model.trim="maxMoney" @blur="maxMoneyBlur">
                </div>
                <div class="btn-right">
                    <div class="btn-bg" @click="checkByWay">查询</div>
                    <div class="btn-border" @click="reset">重置</div>
                </div>
            </div>
            <div class="white-con-table">
                <el-table ref="multipleTable"  :data="tableData3" tooltip-effect="dark" style="width: 100%" height="350" stripe @selection-change="handleSelectionChange">
                    <el-table-column prop="id" type="selection">
                    </el-table-column>
                    <el-table-column type="index" label="序号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="billNo"
                        label="账单号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="transCode.message"
                        label="账单类型" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="empNo"
                        label="员工号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="bankName"
                        label="银行名称" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="bankNo"
                        label="银行卡号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop="gmtCreate"
                        label="申请时间" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="提现金额" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <span>￥{{scope.row.amount ? scope.row.amount : 0}}</span>
                              </template>
                    </el-table-column>
                    <el-table-column  label="其中利息" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <span>￥{{ scope.row.withdrawIncome ? scope.row.withdrawIncome : 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="其中本金"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                                <span>￥{{ scope.row.withdrawAmount ? scope.row.withdrawAmount : 0 }}</span>
                              </template>
                    </el-table-column>
                    <el-table-column
                        prop="operator"
                        label="操作人"
                        show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </div>
            <div class="white-con-bottom">
                <div class="pagInfo">
                    共<span>{{pageTotal}}</span>条记录，当前第<span>{{current}}</span>页/共<span>{{allPages}}</span>页
                </div>
                <div class="pagCon">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="pageCurrent"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next"
                      :total="pageTotal">
                    </el-pagination>
                </div>
                <div class="allStaffInfo" >
                    <div>打款条目<span>{{rightCorner.count }}</span>条</div>
                    <div>打款金额<span>￥{{rightCorner.sumAmount ? rightCorner.sumAmount : 0 | moneyFormat}}</span></div>
                </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>您当前正在处理 <span class="hightLight">{{sendToNumber}}</span>条打款项目，打款总金额￥<span class="hightLight">{{sendToMoney}}</span>,是否确认？</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="openNotarize">确 定</el-button>
            </span>
        </el-dialog>
		<el-dialog class="detailsEnterprise details"   title="提示" :visible.sync="dialogVisibleEnterprise" >
            <div style="text-align: left;">无授权公司</div>
            <span slot="footer" class="dialog-footer">
                <div class="confirm3" @click="dialogVisibleEnterprise = false">确 定</div>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import api from '@/api/reqApi';
    import apiTwo from '@/api/reqApiTwo';
    import _ from 'lodash';
    import errInfo from '@/api/errInfo'
    import dayjs from 'dayjs';
    import storejs from 'store'; 
    import money from '@/api/money';
    export default {
        data() {
            return {
				groupShow:false,
				companyExtra:'',				
				companyExtraOptions:[],
				dialogVisibleEnterprise:false,
                staffNumber:'',
                staffName:'',
                minMoney:'',
                maxMoney:'',
                pageCurrent: 1,
                pageSize: 10,
                pageTotal: 0,
                tableData3: [],
                multipleSelection: [],
                dialogVisible: false,
                current:1,
                size:10,
                rightCorner:{},
                allPages:1,
                sendToNumber:0,
                sendToMoney:0,
                selectAllContent:[],
            };
        },
        mounted() {
            this.dealEnterprise();			
			let params = {
               empNo: this.staffNumber ? this.staffNumber :undefined,
                name: this.staffName ? this.staffName :undefined,
               minAmount: this.minMoney ? this.minMoney :undefined,
               maxAmount:this.maxMoney ? this.maxMoney :undefined,
               size:this.size,
				subEpId:this.companyExtra ? this.companyExtra  : undefined,
             };                
             this.getDataWithParams(params);
        },
        filters:{
            moneyFormat:(val)=>{
                return money.getThousandNum(val);
            },
        },
        methods:{
			dealEnterprise(){								
				let group = storejs.get('userInfo').group;
				if( group ){
				   this.groupShow = true;  
				}else{
					this.groupShow = false;   
				}
				let simpleEnterpriseList = storejs.get('userInfo').simpleEnterpriseList;
				this.companyExtraOptions = simpleEnterpriseList;
				this.initBlur();
			},
			saveEnterprise(val){
				storejs.set('dealConfirmEnterprise',val);
				let params = {
				   empNo: this.staffNumber ? this.staffNumber :undefined,
					name: this.staffName ? this.staffName :undefined,
				   minAmount: this.minMoney ? this.minMoney :undefined,
				   maxAmount:this.maxMoney ? this.maxMoney :undefined,
				   size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
				 };                
				 this.getDataWithParams(params);
			},
            initBlur(){
                let no = storejs.get('dealConfirmStaffNumber');
                let name = storejs.get('dealConfirmStaffName');
                let min = storejs.get('dealConfirmMinMoney');
                let max = storejs.get('dealConfirmMaxMoney');				
                if(no){
                   this.staffNumber = no;
                }
                if(name){
                    this.staffName = name;
                }
                if(min){
                    this.minMoney = min;
                }
                if(max){
                    this.maxMoney = max;
                }    				
				let enterprise = storejs.get('dealConfirmEnterprise');
				if(enterprise){
				   this.companyExtra = enterprise;
				}else{
					if(this.companyExtraOptions.length){
						this.dialogVisibleEnterprise = false;
						this.companyExtra = this.companyExtraOptions[0].value;
					}else{
						this.dialogVisibleEnterprise = true;
					}
				}
            },
            staffNumberBlur(){
                storejs.set('dealConfirmStaffNumber',this.staffNumber);
            },
            staffNameBlur(){
                storejs.set('dealConfirmStaffName',this.staffName);
            },
            minMoneyBlur(){
                storejs.set('dealConfirmMinMoney',this.minMoney);
            },
            maxMoneyBlur(){
                storejs.set('dealConfirmMaxMoney',this.maxMoney);
            },            
            reExport(){
                if(  this.tableData3.length ){
                    let data;
                    if( this.multipleSelection.length  ){
                       data = {
						   id:this.multipleSelection,
						   subEpId:this.companyExtra ? this.companyExtra  : undefined,
					   };
                    }else {
                        data = {
							id:'',
							subEpId:this.companyExtra ? this.companyExtra  : undefined,
						};
                    }
                    apiTwo.reExportWithdrawalDownload(data).then(res=>{
                        let now = Date.now();
                        let timeMark = dayjs(now).format("YYYY年MM月DD日HH时mm分");
                        const content = res;
                        const blob = new Blob([content]);
                        const fileName = '打款下载'+timeMark+'.xls';
                        if ('download' in document.createElement('a')) { // 非IE下载
                            const elink = document.createElement('a');
                            elink.download = fileName;
                            elink.style.display = 'none';
                            elink.href = URL.createObjectURL(blob);
                            document.body.appendChild(elink);
                            elink.click();
                            URL.revokeObjectURL(elink.href); // 释放URL 对象
                            document.body.removeChild(elink)
                        } else { // IE10+下载
                            navigator.msSaveBlob(blob, fileName)
                        }
                    }).catch(err=>{})
                }
            },            
            getDataWithParams(params) {
                api.getWithdrawalNotarize(params).then(res=>{
                    if(res.success){
                        this.tableData3 = res.data.records;
                        this.pageCurrent = res.data.current;
						this.current = res.data.current;
                        this.pageSize = res.data.size;
                        this.pageTotal = res.data.total;
                        this.rightCorner = res.data.extendData ? res.data.extendData : {
                            count:0,
                            sumAmount:0
                        } ;
                        this.allPages = Math.ceil ( res.data.total/this.size ) ; 
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err); 
                })
            },
            download (data) {
                const content = data;
                const blob = new Blob([content]);
                let now = Date.now();
                let timeMark = dayjs(now).format("YYYY年MM月DD日HH时mm分");
                const fileName = '打款确认'+timeMark+'.xls';;
                if ('download' in document.createElement('a')) { // 非IE下载
                    const elink = document.createElement('a');
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink)
                } else { // IE10+下载
                    navigator.msSaveBlob(blob, fileName)
                }
            },            
            ifDialogVisible() {
                if( this.tableData3.length ){
                    if(this.multipleSelection.length === 0) {
                        this.dialogVisible = true;
                        this.sendToNumber = this.rightCorner ? this.rightCorner.count : 0;
                        this.sendToMoney =  this.rightCorner ? this.rightCorner.sumAmount : 0; 
                    }else {
                        this.dialogVisible = true;             
                        this.sendToNumber = this.selectAllContent.length;
                    }
                }          
            },
            openNotarize() {	
				let data = {
					id:this.multipleSelection,
					empNo: this.staffNumber ? this.staffNumber :undefined,
                    name: this.staffName ? this.staffName :undefined,
                    minAmount: this.minMoney ? this.minMoney :undefined,
                    maxAmount:this.maxMoney ? this.maxMoney :undefined,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
				};
                api.openWithdrawalNotarize(data).then(res=>{
                    if(res.success){
                        this.dialogVisible = false;
						let params = {
							empNo: this.staffNumber ? this.staffNumber :undefined,
							name: this.staffName ? this.staffName :undefined,
							minAmount: this.minMoney ? this.minMoney :undefined,
							maxAmount:this.maxMoney ? this.maxMoney :undefined,
							size:this.size,
							current:this.current,
							subEpId:this.companyExtra ? this.companyExtra  : undefined,
						};                
						this.getDataWithParams(params);						
                    }
                }).catch(err=>{
                    this.dialogVisible = false;
					errInfo.err(err); 
                })
            },
            handleClose(done) {
                done();
            },
            checkByWay(){
                let params = {
                    empNo: this.staffNumber ? this.staffNumber :undefined,
                    name: this.staffName ? this.staffName :undefined,
                    minAmount: this.minMoney ? this.minMoney :undefined,
                    maxAmount:this.maxMoney ? this.maxMoney :undefined,
                    size:this.size,
                    current:this.current,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };                
                this.getDataWithParams(params);
            },
            reset(){
                  this.staffNumber = '';
                  this.staffName = '';
                  this.minMoney = '';
                  this.maxMoney = '';
                storejs.remove('dealConfirmStaffNumber');
                storejs.remove('dealConfirmStaffName');
                storejs.remove('dealConfirmMinMoney');
                storejs.remove('dealConfirmMaxMoney');
                    let params = {
                        size:this.size,
						subEpId:this.companyExtra ? this.companyExtra  : undefined,
                    };   
                  this.getDataWithParams(params);
            },
            handleSelectionChange(val) {
                let initEmpty = [];
                let initMoney = 0;
                for( let i in val ){
                    initEmpty.push( val[i] );
                    initMoney = initMoney + val[i].amount;
                }
                this.sendToMoney = initMoney;
                this.selectAllContent = initEmpty;
                let all = [];
                for (var i=0;i<val.length;i++){
                  all.push(val[i].id);
                }
                this.multipleSelection = all;
            },
            handleSizeChange(val) {
                this.size = val;				
				let params = {
					empNo: this.staffNumber ? this.staffNumber :undefined,
					name: this.staffName ? this.staffName :undefined,
					minAmount: this.minMoney ? this.minMoney :undefined,
					maxAmount:this.maxMoney ? this.maxMoney :undefined,
					size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
				};                
				this.getDataWithParams(params);
            },
            handleCurrentChange(val) {
                this.current = val;
				let params = {
					empNo: this.staffNumber ? this.staffNumber :undefined,
					name: this.staffName ? this.staffName :undefined,
					minAmount: this.minMoney ? this.minMoney :undefined,
					maxAmount:this.maxMoney ? this.maxMoney :undefined,
					size:this.size,
					current:this.current,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
				};                
				this.getDataWithParams(params);
            }
        },
    };
</script>
<style lang="scss" scoped>    
	.white-con-top-form {			
		display: flex;
		flex-direction:row;
		flex-wrap: wrap;
		justify-content:flex-start;
		align-content: center;
		align-items: center;
		font-size: 12px;
		white-space: nowrap;
		.btn-border{
			 width: 71px!important;
			 height: 30px;
			 float: left;
			 border: 1px solid #6479ff;
			 color: #6479ff;
			 text-align: center;
			 line-height: 30px;
			 border-radius: 20px;
			 box-sizing: border-box;
			 cursor: pointer;
		}
		.btn-bg{
			box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6);
			width: 71px !important;
			height: 30px;
			float: left;
			background-image:linear-gradient(-10deg, #48a3fc 0%,#767efd 100%);
			color: #fff;
			text-align: center;
			line-height: 30px;
			border-radius: 20px; 
			margin-right: 35px;
			cursor: pointer;
			font-size: 12px;
		}	
		div {
			input {
			  padding-left: 20px;
			}
		}
		span {
		   color: #979cb2!important;
			margin-right: 10px;
		}
		.staffNumber {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
			margin-bottom: 30px
		}
		.staffName {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
			margin-bottom: 30px
		}
		.money {
			input {
				width: 76px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
			margin-bottom: 30px
		}
		.hr {
		   margin-left: 10px;
		}
		.btn-right {
			margin-bottom: 30px
		}		
	}
    .reExportStyle {
        float: right !important;
    }
    .salaryConfirmContainer {
        background-color: #f9f9fc;
        padding-bottom: 100px;
        margin-bottom: 40px;
        box-sizing: border-box;
        padding-left: 60px;
        padding-right: 60px;
        .hightLight {
            color: #6479ff;
        }		
        .white-con {
            margin-top: 36px;
            background-color: #fff;
            border-radius: 12px;
            width: 100%;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 28px;
            padding-bottom: 20px;
            box-sizing: border-box;
            &-table {
                position: relative;
                background-color: #fff;
                height: 360px;
                overflow: scroll;
                margin-bottom: 28px;
            }
            &-bottom {
                position: relative;
                @media all and (max-width:1190px){
                    .pagInfo {
                        font-size: 12px;
                        color: #c8cad7;
                        span {
                            font-size: 13px;
                            color: #6479ff;
                        }
                    }
                    .pagCon {
                        width: 440px;
                        margin-top: 20px;
                        margin-bottom: 20px;
                    }
                    .allStaffInfo {
                        font-size: 12px;
                        line-height: 28px;
                        color: #c8cad7;
                        span {
                            font-size: 13px;
                            color: #6479ff;
                        }
                    }
                }
                @media all and (min-width:1191px){
                    .pagInfo {
                        float: left;
                        position: absolute;
                        bottom: 0;
                        font-size: 12px;
                        color: #c8cad7;
                        span {
                            font-size: 14px;
                            color: #6479ff;
                        }
                    }
                    .pagCon {
                        width: 440px;
                        position: absolute;
                        bottom: 0;
                        left: 50%;
                        transform: translateX(-220px);
                    }
                    .allStaffInfo {
                        float: right;
                        font-size: 12px;
                        line-height: 28px;
                        height: auto;
                        color: #c8cad7;
                        span {
                            font-size: 14px;
                            color: #6479ff;
                        }
                    }
                }
                &:after {
                    content: '';
                    display: block;
                    clear: both;
                    overflow: hidden;
                }
            }
			.leftFlex {
				display: flex;
				flex-direction: row;
				justify-content:flex-start;
				align-content: center;
				align-items: center;
			}
			.groupShow {
				margin-right: 20px;
			}
            &-top-con {
                color: #6479ff;
                font-size: 12px;
				display: flex;
				flex-direction: row;
				justify-content:space-between;
				align-content: center;
				align-items: center;
                margin-bottom: 28px;
                .download {
                    box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6);
                    width: 71px !important;
                    height: 30px;
                    background-image:
                        linear-gradient(-10deg,
                            #48a3fc 0%,
                            #767efd 100%);
                    color: #fff;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 20px;                    
                    cursor: pointer;
                    font-size: 12px;
                }
            }
        }
    }
</style>
<style lang="scss">
	.salaryConfirmContainer {
		.el-select {
			width: 200px !important;
			height: 30px;
			input {
				height: 30px;
			}
		}
		.detailsEnterprise .el-dialog{
			height: 200px !important;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto !important;	
			width: 500px;
		}	
		.detailsEnterprise {
			.confirm3 {
				margin: 0 auto !important;
				box-shadow: 0 10px 6px -4px rgba(122, 175, 253, 0.6);
				width: 120px !important;
				background-image: linear-gradient(-10deg, #48a3fc 0%, #767efd 100%);
				color: #fff;
				height: 40px;
				line-height: 40px;
				text-align: center;
				border-radius: 20px;
				cursor: pointer;
				font-size: 14px;
				box-sizing: border-box;
				margin-left: 100px;
			}
		}	
		.white-con-table .el-table {
			position: absolute;
			left: 0;
			top:0;
		}
		.white-con-table .has-gutter th{
			background-color: #eff1ff;
			color: #21223f;
			font-size: 13px;
			font-weight: 700px;
		}
		.white-con-table .cell{
			text-align: center;
		}
		.white-con-table .el-table--striped .el-table__body tr.el-table__row--striped td {
			background-color: #f2f2f8;
			color: #21223f;
			font-size: 12px;
		}
		.white-con-table .el-table--striped .el-table__body tr.el-table__row td {
			color: #21223f;
			font-size: 12px;
		}
		.white-con-table .el-table--border::after, .el-table--group::after, .el-table::before {
			background-color: #fff;
		}
		.el-dialog {
			border-radius: 10px;
		}
		.el-dialog__headerbtn {
			top: 30px;
			right: 36px;
		}
		.el-dialog__body {
			padding: 20px 24px;
			padding-top: 20px;
		}
		.addStaff-bottom-container {
			margin-top: 10px;
		}
		.el-dialog__header {
			padding-top: 27px;
			padding-left: 36px;
			padding-bottom: 0;
		}
		.el-form-item {
			margin-bottom: 10px!important;
		}
		.el-form-item__label {
			text-align: left;
			font-size: 13px!important;
			color: #979cb2!important;
			width: 80px!important;
		}
		.el-form-item__content {
			margin-left: 80px!important;
			height: 27px!important;
		}
		.el-form-item__content input{
			height: 27px!important;
		}
		.el-dialog__header .el-dialog__title{
			font-size: 13px;
			line-height: 32px;
			color: #6479ff;
		}
		.el-dialog__footer{
			text-align: center;
		}
		.el-dialog__footer button{
			box-shadow: 0 10px 6px -4px rgba(122, 175, 253, 0.6);
			width: 120px !important;
			background-image: linear-gradient(-10deg, #48a3fc 0%, #767efd 100%);
			color: #fff;
			text-align: center;
			border-radius: 20px;
			cursor: pointer;
			font-size: 12px;
		}
		.el-table__header-wrapper {
			background-color: #eff1ff;
		}
		.el-table__header {
			width: 100%!important;
		}
		.el-table__body {
			width: 100%!important;
		}
		.white-con-top-con .el-select {
			width: 143px;
		}
	}
</style>