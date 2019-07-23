<template>
    <div class="salaryDownloadContainer">
        <div class="white-con">			
            <div class="white-con-top-con">                
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
				<div v-permit="'21'"  class="download" @click="ifPayDownload">打款下载</div>
            </div>
            <div class="white-con-top-form">
                <div class="staffNumber">
                    <span>员工号</span><input v-model.trim="staffNumber" @change="staffNumberBlur">
                </div>
                <div class="staffName">
                    <span>姓名</span><input v-model.trim="staffName" @change="staffNameBlur">
                </div>
				<div class="department">
                    <span>部门</span><input v-model.trim="department" @change="departmentBlur(department)">
                </div>
                <div class="money">
                    <span>金额</span>
                    <input placeholder="最低金额" class="minMoney" v-model.trim="minMoney" @change="minMoneyBlur">
                    <span class="hr" style="color: #6479ff!important;">——
                    </span>
                    <input placeholder="最高金额" class="maxMoney" v-model.trim="maxMoney" @change="maxMoneyBlur">
                </div>
				<div class="timer1">
					<el-date-picker
					  v-model="value2"
						prefix-icon="''"				
					  type="date"
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd" 
					  placeholder="选择提现起始日期"
					  align="right"
					  :picker-options="pickerOptions1">
					</el-date-picker>
				</div>
				<div class="timer2">
					<el-date-picker
					  v-model="value3"
						prefix-icon="''"
					  type="date"
					  placeholder="选择提现结束日期"
						format="yyyy-MM-dd" 
						value-format="yyyy-MM-dd" 
					  align="right"
					  :picker-options="pickerOptions1">
					</el-date-picker>
				</div>
                <div class="btn-right">
                    <div class="btn-bg" @click="checkByWay">查询</div>
                    <div class="btn-border" @click="reset">重置</div>
                </div>
            </div>
            <div class="white-con-table">
                <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" height="350" stripe @selection-change="handleSelectionChange">
                    <el-table-column type="selection">
                    </el-table-column>
                    <el-table-column type="index" label="序号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="billNo" label="帐单号"show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="transCode.message" label="账单类型"show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="empNo" label="员工号" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" show-overflow-tooltip>
                    </el-table-column>
					<el-table-column prop="department" label="部门" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="申请时间" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column  label="提现金额" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <span>￥{{ scope.row.amount }}</span>
                              </template>
                    </el-table-column>
                    <el-table-column label="其中利息" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <span>￥{{scope.row.withdrawIncome }}</span>
                              </template>
                    </el-table-column>
                    <el-table-column  label="其中本金" show-overflow-tooltip>
                        <template slot-scope="scope">
                                <span>￥{{scope.row.withdrawAmount }}</span>
                              </template>
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
                <div class="allStaffInfo"   >
                    <div>打款人数<span>{{rightCorner.count  }}</span>人</div>
                    <div>打款金额<span>￥{{  rightCorner.sumAmount ? rightCorner.sumAmount : 0 | moneyFormat  }}</span></div>                    
                </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
		<el-dialog class="detailsEnterprise details"   title="提示" :visible.sync="dialogVisibleEnterprise" >
            <div style="text-align: left;">无授权公司</div>
            <span slot="footer" class="dialog-footer">
                <div class="confirm3" @click="dialogVisibleEnterprise = false">确 定</div>
            </span>
        </el-dialog>	
    </div>
</template>
<script>
    import dayjs from 'dayjs';
    import api from '@/api/reqApi';
    import errInfo from '@/api/errInfo'
    import storejs from 'store';  
    import money from '@/api/money';	
    export default {
        data() {
            return {
				department:'',
                staffNumber:'',
                staffName:'',
                minMoney:'',
                maxMoney:'',
                pageCurrent: 1,
                pageSize: 10,
                pageTotal: 0,
                tableData3: [],
                multipleSelection: [],
                size:10,
                current:1,
                rightCorner:{},
                allPages:1,
				value2:'',
				value3:'',
				groupShow:false,
				companyExtra:'',				
				companyExtraOptions:[],
				dialogVisibleEnterprise:false,
				pickerOptions1: {
				  shortcuts: [{
					text: '今天',
					onClick(picker) {
					  picker.$emit('pick', new Date());
					}
				  }, {
					text: '昨天',
					onClick(picker) {
					  const date = new Date();
					  date.setTime(date.getTime() - 3600 * 1000 * 24);
					  picker.$emit('pick', date);
					}
				  }, {
					text: '一周前',
					onClick(picker) {
					  const date = new Date();
					  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
					  picker.$emit('pick', date);
					}
				  }]
				},
            };
        },       
        mounted() {
            this.dealEnterprise();			
			let form = {
				department:this.department ? this.department : undefined,
                empNo:this.staffNumber ? this.staffNumber : undefined,
                name:this.staffName ? this.staffName : undefined,
                minAmount:this.minMoney ? this.minMoney : undefined,
                maxAmount:this.maxMoney ? this.maxMoney : undefined,
                size:this.size,
				applyStartTime:this.value2 ? this.value2 : undefined,
				applyEndTime:this.value3 ? this.value3 : undefined,
				subEpId:this.companyExtra ? this.companyExtra  : undefined,
            };
            this.withParmas(form);			          
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
				storejs.set('dealDownloadEnterprise',val);				
				let form = {
					department:this.department ? this.department : undefined,
                    empNo:this.staffNumber ? this.staffNumber : undefined,
                    name:this.staffName ? this.staffName : undefined,
                    minAmount:this.minMoney ? this.minMoney : undefined,
                    maxAmount:this.maxMoney ? this.maxMoney : undefined,
                    size:this.size,
					applyStartTime:this.value2 ? this.value2 : undefined,
					applyEndTime:this.value3 ? this.value3 : undefined,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.withParmas(form);
			},
            initBlur(){
                let no = storejs.get('dealDownloadStaffNumber');
                let name = storejs.get('dealDownloadStaffName');
                let min = storejs.get('dealDownloadMinMoney');
                let max = storejs.get('dealDownloadMaxMoney');
                let department = storejs.get('dealDownloadDepartment');
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
				if(department){
                    this.department = department;
                }  
				let enterprise = storejs.get('dealDownloadEnterprise');
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
			departmentBlur(val){
				storejs.set('dealDownloadDepartment',val);
			},
            staffNumberBlur(){
                storejs.set('dealDownloadStaffNumber',this.staffNumber);
            },
            staffNameBlur(){
                storejs.set('dealDownloadStaffName',this.staffName);
            },
            minMoneyBlur(){
                storejs.set('dealDownloadMinMoney',this.minMoney);
            },
            maxMoneyBlur(){
                storejs.set('dealDownloadMaxMoney',this.maxMoney);
            },
            download (data) {
                let now = Date.now();
                let timeMark = dayjs(now).format("YYYY年MM月DD日HH时mm分");
                const content = data;
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
            },
            withParmas(form){
                api.getWithdrawalDownload(form).then(res=>{					
                    if(res.success){
                        if(res.data){
                            this.tableData3 = res.data.records;
                            this.pageCurrent = res.data.current;
							this.current = res.data.current;
                            this.pageSize = res.data.size;
                            this.pageTotal = res.data.total;
                            this.rightCorner = res.data.extendData ? res.data.extendData : {
                                sumAmount:"0",
                                count:0
                            } ;
                            this.allPages = Math.ceil ( res.data.total/this.size ) ; 							
                        }else {
                            this.tableData3 = [];
                        }
                    }else {
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);
                })
            },
            checkByWay(){
                let form = {
					department:this.department ? this.department : undefined,
                    empNo:this.staffNumber ? this.staffNumber : undefined,
                    name:this.staffName ? this.staffName : undefined,
                    minAmount:this.minMoney ? this.minMoney : undefined,
                    maxAmount:this.maxMoney ? this.maxMoney : undefined,
                    size:this.size,
					applyStartTime:this.value2 ? this.value2 : undefined,
					applyEndTime:this.value3 ? this.value3 : undefined,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.withParmas(form);
            },
            reset(){
				this.department = '';
                this.staffNumber = '';
                this.staffName = "";
                this.minMoney = "";
                this.maxMoney = "";
				this.value2 = '';
				this.value3 = '';				
				storejs.remove('dealDownloadDepartment');
                storejs.remove('dealDownloadStaffNumber');
                storejs.remove('dealDownloadStaffName');
                storejs.remove('dealDownloadMinMoney');
                storejs.remove('dealDownloadMaxMoney');
                let form = {
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.withParmas(form);
            },
            ifPayDownload(){
                if( this.tableData3.length ){
                    let data;
                    if(this.multipleSelection.length === 0) {
                        data={
							id:'',							
							department:this.department ? this.department : undefined,
                    		empNo:this.staffNumber ? this.staffNumber : undefined,
                    		name:this.staffName ? this.staffName : undefined,
                    		minAmount:this.minMoney ? this.minMoney : undefined,
                    		maxAmount:this.maxMoney ? this.maxMoney : undefined,
							applyStartTime:this.value2 ? this.value2 : undefined,
							applyEndTime:this.value3 ? this.value3 : undefined,		
							subEpId:this.companyExtra ? this.companyExtra  : undefined,
						};		
						console.log(data);
						api.openwithdrawalDownload(data).then(res=>{
							console.log(res);
							this.download(res);
//							if(res.success){
//							   this.download(res);
//							}else{
//							   this.$message.error(res.message);
//							}
						}).catch(err=>{
							console.log(err);
						})   
                    }else {
                        data={
							id:this.multipleSelection,
							department:this.department ? this.department : undefined,
                    		empNo:this.staffNumber ? this.staffNumber : undefined,
                    		name:this.staffName ? this.staffName : undefined,
                    		minAmount:this.minMoney ? this.minMoney : undefined,
                    		maxAmount:this.maxMoney ? this.maxMoney : undefined,
							applyStartTime:this.value2 ? this.value2 : undefined,
							applyEndTime:this.value3 ? this.value3 : undefined,
							subEpId:this.companyExtra ? this.companyExtra  : undefined,
						};	
						console.log(data);
						api.openwithdrawalDownload(data).then(res=>{	
							console.log(res);
							this.download(res);
//							if(res.success){
//							   this.download(res);
//							}else{
//							   this.$message.error(res.message);
//							}
						}).catch(err=>{
							console.log(err);
						})   
                    }                                     
                }
            },
            handleSelectionChange(val) {
                let all = [];
                for (var i=0;i<val.length;i++){
                    all.push(val[i].id);
                }
                this.multipleSelection = all;
				console.log( all );
            },
            handleSizeChange(val) {
                this.size = val;
                let form = {
                    empNo:this.staffNumber ? this.staffNumber : null,
                    name:this.staffName ? this.staffName : null,
                    minAmount:this.minMoney ? this.minMoney : null,
                    maxAmount:this.maxMoney ? this.maxMoney : null,
					department:this.department ? this.department : undefined,
                    size:val,
					applyStartTime:this.value2 ? this.value2 : undefined,
					applyEndTime:this.value3 ? this.value3 : undefined,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.withParmas(form);
            },
            handleCurrentChange(val) {
                this.current = val;
                let form = {
					department:this.department ? this.department : undefined,
                    empNo:this.staffNumber ? this.staffNumber : null,
                    name:this.staffName ? this.staffName : null,
                    minAmount:this.minMoney ? this.minMoney : null,
                    maxAmount:this.maxMoney ? this.maxMoney : null,
                    size:this.size,
                    current:val,
					applyStartTime:this.value2 ? this.value2 : undefined,
					applyEndTime:this.value3 ? this.value3 : undefined,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.withParmas(form);
            }
        },
    };
</script>
<style lang="scss" scoped>
	.groupShow {
		margin-right: 20px;
	}
	.white-con-top-form {
		display: flex;
		flex-direction:row;
		flex-wrap: wrap;
		justify-content:flex-start;
		align-content: center;
		align-items: center;
		font-size: 12px;
		white-space: nowrap;
		span {
		   color: #979cb2!important;
		}
		.hr {
		   margin-left: 10px;
		}
		div {
			span {
				margin-right: 10px;
			}
		   height: 30px;
			margin-bottom: 30px;
		   input {
			  padding-left: 20px;
			}
		}
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
		.staffNumber {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
		}
		.staffName {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
		}
		.department {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
		}
		.money {
			input {
				width: 76px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
		}
		.timer1 {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
		}
		.timer2 {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
		}
	}
    .salaryDownloadContainer {
        background-color: #f9f9fc;
        padding-bottom: 100px;
        margin-bottom: 40px;
        box-sizing: border-box;
        padding-left: 60px;
        padding-right: 60px;
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
            &-top-con {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-content: center;
				align-items: center;
                margin-bottom: 30px;
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
                    margin-right: 35px;
                    cursor: pointer;
                    font-size: 12px;
                }
            }
            &-table {
                position: relative;
                background-color: #fff;
                height: 360px;
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
        }
    }
</style>
<style lang="scss">
	.salaryDownloadContainer {
		.white-con-table {
			.el-table {
				position: absolute;
				left: 0;
				top:0;
			}
			.has-gutter th{
				background-color: #eff1ff;
				color: #21223f;
				font-size: 13px;
				font-weight: 700px;
			}
			.cell{
				text-align: center;
			}
			.el-table--striped .el-table__body tr.el-table__row--striped td {
				background-color: #f2f2f8;
				color: #21223f;
				font-size: 12px;
			}
			.el-table--striped .el-table__body tr.el-table__row td {
				color: #21223f;
				font-size: 12px;
			}
			.el-table--border::after, .el-table--group::after, .el-table::before {
				background-color: #fff;
			}			
		}
		.white-con-top-form .el-input--prefix .el-input__inner {
			padding-left: 20px !important;
		}
		.el-dialog {
			border-radius: 10px;
			height: 500px;
		}
		.el-dialog__headerbtn {
			top: 30px;
			right: 36px;
		}
		.el-dialog__body {
			padding: 20px 36px;
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
		.el-table__header-wrapper {
			background-color: #eff1ff;
		}
		.el-table__header {
			width: 100%!important;
		}
		.el-table__body {
			width: 100%!important;
		}
	}	
	.salaryDownloadContainer {		
		.detailsEnterprise .el-dialog{
			height: 200px !important;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto !important;		
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
		.el-select {
			width: 200px !important;
			height: 30px;
			input {
				height: 30px;
			}
		}
		.first {
			margin-bottom: 20px;
		}
		.white-con-top-form {
			.el-input__inner {
				height: 30px !important;
				width: 170px !important;
				padding-right: 0 !important;				
			}
			.el-date-editor {
				position: relative;
			}
			.el-input__suffix {
				position: absolute;
				right: 20px;
				top: -4px;
			}
		}
		.btn-right {
			margin-left: 0!important;
		}
		.el-dialog {
		   width: 480px;
		}
	}     
</style>