<template>
    <div class="employerqueryContainer">
        <div class="white-con">			
            <div class="white-con-top-con">
                <div class="floatLeft">
                    <div class="flexCon" v-show="showHead">
						<div class="first" v-if="groupShow">
							 <el-select v-model="companyExtra" placeholder="请选择" @change="saveEnterprise(companyExtra)">
								<el-option
										  v-for="item in companyExtraOptions"
										  :key="item.value"
										  :label="item.label"
										  :value="item.value">
										</el-option>
							</el-select>
						</div>
                        <div class="flexfirst">
                            <div class="fir">留存余额：<span>{{head.valOne ? head.valOne : 0 | moneyFormat }}</span>元</div>
                        </div>
                        <div class="flexsecond">
                            <div class="sec">其中本金：<span>{{head.valTwo ? head.valTwo : 0| moneyFormat}}</span>元</div>
                        </div>
                        <div class="flexthird">
                            <div class="sec">其中利息：<span>{{head.valThree ? head.valThree : 0| moneyFormat }}</span>元</div>
                        </div>
                    </div>
                </div>
                <div v-show="showForm"  v-permit="'39'" @click="exportExcel" class="floatRight">
                    <i class="icon-font icon-jcxx_-7"></i>导出
                </div>
            </div>
            <div class="white-con-top-form" v-show="showForm">
                <div class="first">
                    <span>员工号
                    </span>
                    <input v-model.trim="staffNumber" @blur="staffNumberBlur">
                </div>
                <div class="second">
                    <span>姓名
                    </span>
                    <input v-model.trim="staffName" @blur="staffNameBlur">
                </div>
                <div class="third">
                    <span>金额
                    </span>
                    <input placeholder="最低金额" class="minMoney" v-model.trim="minMoney" @blur="minMoneyBlur">
                    <span class="hr" style="color: #6479ff!important;">——
                    </span>
                    <input placeholder="最高金额" class="maxMoney" v-model.trim="maxMoney" @blur="maxMoneyBlur">
                </div>
                <div class="btn-right">
                    <div class="btn-bg" @click="checkAction">
                        查询
                    </div>
                    <div class="btn-border" @click="reset">
                        重置
                    </div>
                </div>
            </div>            
            <div v-if = "infoHide">
                <div class="white-con-table">
                    <el-table
                        ref="multipleTable"
                        :data="tableData3"
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="350"
                        stripe
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column type="index" label="序号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="empNo" label="员工号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="workingState.message" label="在职状态" show-overflow-tooltip></el-table-column>
                        <el-table-column  label="余额" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>￥{{ scope.row.avaiableAmount ? scope.row.avaiableAmount : 0 }}</span>
                              </template>
                        </el-table-column>
                        <el-table-column  label="其中本金" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>￥{{scope.row.principal ? scope.row.principal : 0}}</span>
                              </template>
                        </el-table-column>
                        <el-table-column label="其中利息" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>￥{{ scope.row.incomeAmount ? scope.row.incomeAmount : 0 }}</span>
                              </template>
                        </el-table-column>
                        <el-table-column  label="操作">
                            <template slot-scope="scope">
                                <div class="checkScope">
                                    <div v-permit="'40'" class="edit" @click="takeAll(scope.$index,scope.row)"> 
                                    <i class="icon-font icon--1"></i>
                                    提取
                                  </div>
                                    <div class="lock">
                                        <i class="icon-font icon-sp--1"></i>
                                    </div>
                                </div>
                                </template>
                        </el-table-column>
                        <el-table-column  label="查看">
                            <template slot-scope="scope">
                                <div class="checkScope">
                                    <div v-permit="'41'" class="edit" @click="checkDetails(scope.$index,scope.row)"> 
                                    <i class="icon-font icon-jcxx_-4"></i>
                                    详情
                                  </div>
                                    <div class="lock">
                                        <i class="icon-font icon-sp--1"></i>
                                    </div>
                                </div>
                                </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="white-con-bottom">
                    <div class="pagInfo">
                        共<span>{{pageTotal}}</span>条记录，当前第<span>{{current}}</span>页/共<span>{{ allPages }}</span>页
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
                </div>
            </div>
            <div v-else class="else">
                <div class="infoContainer">
                    <div class="tableCon">
                        <el-table
                        ref="multipleTable2"
                        :data="tableData2"
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="350"
                        stripe
                        >
                        <el-table-column prop="billNo" label="账单号" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="name" label="名字" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="transCode.message" label="账单类型" show-overflow-tooltip></el-table-column>
                        <el-table-column label="发生金额" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>￥{{scope.row.transAmount }}</span>
                              </template>                            
                            </el-table-column>                            
                            <el-table-column label="变动前金额" show-overflow-tooltip>
                                <template slot-scope="scope">
                                <span>￥{{scope.row.availableBefore }}</span>
                              </template>
                            </el-table-column>                            
                            <el-table-column  label="变动后金额" show-overflow-tooltip>
                                <template slot-scope="scope">
                                <span>￥{{scope.row.availableAfter }}</span>
                              </template>
                            </el-table-column>
                        <el-table-column prop="gmtCreate" label="时间" show-overflow-tooltip></el-table-column>
                    </el-table>
                    </div>
                    <div class="pagCon">
                        <el-pagination
                          @size-change="handleSizeChange1"
                          @current-change="handleCurrentChange1"
                          :current-page="pageCurrent1"
                          :page-sizes="[10, 20, 50, 100]"
                          :page-size="pageSize1"
                          layout="total, sizes, prev, pager, next"
                          :total="pageTotal1">
                        </el-pagination>
                    </div>
                    <div class="goBack" >
                        <span @click="goBack">返回</span>
                    </div>
                </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
        <el-dialog class="details"  title="提现" :visible.sync="dialogVisible3" top="200px">
            <div style="text-align: left;height:440px">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <div class="addMenusContainer">
                    <el-form-item label="可用金额">
                    <el-input v-model.number="ruleForm.available" disabled></el-input>
                  </el-form-item>
                    <el-form-item label="提现金额" prop="amount">
                    <el-input v-model.number="ruleForm.amount" @blur="blurInput"></el-input>
                  </el-form-item>
                    <div class="addBtnContainer">
                        <div @click="submitForm('ruleForm')">确定</div>
                        <div @click="resetForm('ruleForm')">取消</div>
                    </div >
                </div>
                </el-form>
            </div>
        </el-dialog>
		<el-dialog class="detailsEnterprise details"   title="提示" :visible.sync="dialogVisibleEnterprise">
            <div style="text-align: left;">无授权公司</div>
            <span slot="footer" class="dialog-footer">
                <div class="confirm3" @click="dialogVisibleEnterprise = false">确 定</div>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import apiTwo from '@/api/reqApiTwo';
    import errInfo from '@/api/errInfo'
    import dayjs from 'dayjs';
    import storejs from 'store'; 
    import money from '@/api/money';   
    export default {
        data() {
            return {
                pageCurrent1:1,
                pageSize1:10,
                pageTotal1:0,
                pageCurrent: 1,
                pageSize: 10,
                pageTotal: 0,
                tableData3: [],
                tableData2:[],
                radio: '1',
                staffNumber: '',
                staffName: '',
                minMoney: '',
                maxMoney: '',
                size: 10,
                current: 1,
                size1: 10,
                current1: 1,
                infoHide:true,
                cusArr:[],
                head: {
                    valOne: 0,
                    valTwo: 0,
                    valThree: 0
                },
                allPages:0,
                showHead:true,
                dialogVisible3:false,
                ruleForm:{
                    amount: '',
                    available:''
                },
                rules: {
                    amount: [
                        { required: true, message: '请输入数字', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                  ]
                },
                idBridge:'',
                multipleSelection:[],
                showForm:true,
                nameBridge:'',				
				groupShow:false,
				companyExtra:'',				
				companyExtraOptions:[],
				dialogVisibleEnterprise:false,
            };
        },
        mounted() {
            this.dealEnterprise();
			let params = {
                    empNo:this.staffNumber ? this.staffNumber:undefined,
                    name:this.staffName ? this.staffName:undefined,
                    minAvaiableAmount:this.minMoney ? this.minMoney : undefined,
                    maxAvaiableAmount:this.maxMoney ? this.maxMoney :undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
            this.checkByWay(params); 
        },
        filters:{
            moneyFormat:(val)=>{
                return money.getThousandNum(val);
            },
        },
        methods: {
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
				storejs.set('eQueryEnterprise',val);
				let params = {
                    empNo:this.staffNumber ? this.staffNumber:undefined,
                    name:this.staffName ? this.staffName:undefined,
                    minAvaiableAmount:this.minMoney ? this.minMoney : undefined,
                    maxAvaiableAmount:this.maxMoney ? this.maxMoney :undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.checkByWay(params);
			},
            initBlur(){
                let no = storejs.get('eQueryStaffNumber');
                let name = storejs.get('eQueryStaffName');
                let min = storejs.get('eQueryMinMoney');
                let max = storejs.get('eQueryMaxMoney');
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
				let enterprise = storejs.get('eQueryEnterprise'); 
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
                storejs.set('eQueryStaffNumber',this.staffNumber);
            },
            staffNameBlur(){
                storejs.set('eQueryStaffName',this.staffName);
            },
            minMoneyBlur(){
                storejs.set('eQueryMinMoney',this.minMoney);
            },
            maxMoneyBlur(){
                storejs.set('eQueryMaxMoney',this.maxMoney);
            },  
            download(res){
                let now = Date.now();
                        let timeMark = dayjs(now).format("YYYY年MM月DD日HH时mm分");
                        const content = res;
                        const blob = new Blob([content]);
                        const fileName = '员工余额查询列表'+timeMark+'.xls';
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
            exportExcel(){
                if( this.multipleSelection.length ){
                   let data ={
                       empNo:this.staffNumber ? this.staffNumber : undefined ,
                       name: this.staffName ? this.staffName : undefined,
                       minAvaiableAmount: this.minMoney ? this.minMoney : undefined,
                       maxAvaiableAmount: this.maxMoney ? this.maxMoney : undefined,
                       id:this.multipleSelection,
					   subEpId:this.companyExtra ? this.companyExtra  : undefined,
                   };
                    apiTwo.exportEmployeeAmount(data).then(res=>{
                        this.download(res);
                    }).catch(err=>{
                        errInfo.err(err);
                    })                    
                }else{
                    let data ={
                       empNo:this.staffNumber ? this.staffNumber : undefined ,
                       name: this.staffName ? this.staffName : undefined,
                       minAvaiableAmount: this.minMoney ? this.minMoney : undefined,
                       maxAvaiableAmount: this.maxMoney ? this.maxMoney : undefined,
                        id:[],
						subEpId:this.companyExtra ? this.companyExtra  : undefined,
                   };
                    apiTwo.exportEmployeeAmount(data).then(res=>{
                        this.download(res);
                    }).catch(err=>{
                        errInfo.err(err);
                    })
                }
            },
            handleSizeChange1(val){
                this.size1 = val;
                let data = {
                    id:this.idBridge,
                    size:this.size1,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                apiTwo.getAccountLog(data).then(res=>{
                    if( res.success ){
                        let data = res.data;
                        if(data.records.length){
                            data.records.forEach(ele=>{
                                ele.name = this.nameBridge;
                            })
                        }else{
                        }
                        this.tableData2 = data.records;
                        this.pageTotal1 = data.total;
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);   
                })
            },
            handleCurrentChange1(val){
                this.current1 = val;
                let data = {
                    id:this.idBridge,
                    size:this.size1,
                    current:this.current1,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                apiTwo.getAccountLog(data).then(res=>{
                    if( res.success ){
                        let data = res.data;                             
                        if(data.records.length){
                            data.records.forEach(ele=>{
                                ele.name = this.nameBridge;
                            })
                        }else{
                        }
                        this.tableData2 = data.records;
                        this.pageTotal1 = data.total;
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);   
                })
            },
            blurInput(){
                let amount = this.ruleForm.amount;
                let available = this.ruleForm.available;
                if(  amount > available ){
                   this.$message.error('输入金额不能大于可用金额');
                    this.ruleForm.amount = '';
                }else {
                    if(this.ruleForm.amount){
                        this.ruleForm.amount = Math.abs( this.ruleForm.amount );
                        if(  this.ruleForm.amount > available ){
                           this.$message.error('输入金额不能大于可用金额');
                            this.ruleForm.amount = '';
                        }
                    }else{
                        this.ruleForm.amount = '';
                        this.$message.error('输入金额不能为空。');
                    }
                }
            },
            resetForm(formName){
                this.ruleForm = {};
                this.dialogVisible3 = false;
                this.idBridge = '';
            },
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                      let data = {
                          id:this.ruleForm.id,
                          amount:this.ruleForm.amount,
						  subEpId:this.companyExtra ? this.companyExtra  : undefined,
                      };
                      apiTwo.extractMoney(data).then(res=>{
                          if(res.success){
                              this.$message({
                                  message: '提取成功！',
                                  type: 'success'
                                });
                              this.dialogVisible3 = false;
                          }else{
                              this.$message.error(res.message);
                          }
                      }).catch(err=>{
                          errInfo.err(err);   
                      })
                  } else {
                    console.log('error submit!!');
                    return false;
                  }
                });
            },
            takeAll(index,row){
                this.dialogVisible3 = true;
                this.ruleForm = {
                    amount: row.avaiableAmount,
                    available: row.avaiableAmount,
                    id:row.id
                };
            },
            goBack(){
                this.infoHide = true;
                this.showHead = true;
                this.showForm = true;
                this.pageCurrent1 = 1;
                this.pageSize1 = 10;
                this.pageTotal1 = 0;
                this.nameBridge = '';
            },
            checkDetails(index, row) {
				this.tableData2 = [];
                this.showHead = false;
                this.showForm = false;
                this.idBridge = row.id;
                this.nameBridge = row.name;
                console.log(row.name);
                let data = {
                    id:row.id,
                    size:this.size1,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                apiTwo.getAccountLog(data).then(res=>{
                    if( res.success ){
                        let data = res.data;
                        if(data.records.length){
                            data.records.forEach(ele=>{
                                ele.name = row.name;
                            })
                        }else{
                        }
                        this.tableData2 = data.records;
                        this.pageTotal1 = data.total;
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);   
                })
                this.infoHide = false;
              },
			checkAction(){
				let params = {
                    empNo:this.staffNumber ? this.staffNumber:undefined,
                    name:this.staffName ? this.staffName:undefined,
                    minAvaiableAmount:this.minMoney ? this.minMoney : undefined,
                    maxAvaiableAmount:this.maxMoney ? this.maxMoney :undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.checkByWay(params);
			},
            checkByWay(params) {                
                apiTwo.queryEmployeeAmount(params).then(res=>{
                    if( res.success ){
						this.current = res.data.current;
						this.pageCurrent = res.data.current;
                        this.tableData3 = res.data.records;
                        this.pageTotal = res.data.total; 
                        this.allPages = Math.ceil ( res.data.total/this.size ) ;
                        this.head = {
                            valOne:  res.data.extendData ? res.data.extendData.employeeAvailableCollect.totalAvailable :  0,
                            valTwo: res.data.extendData ? res.data.extendData.employeeAvailableCollect.totalPrincipal : 0,
                            valThree: res.data.extendData ? res.data.extendData.employeeAvailableCollect.totalIncome : 0
                        };
                    }else {
                       this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);   
                })
            },
            reset() {
                this.staffNumber = '';
                this.staffName = '';
                this.minMoney = '';
                this.maxMoney = '';
                storejs.remove('eQueryStaffNumber');
                storejs.remove('eQueryStaffName');
                storejs.remove('eQueryMinMoney');
                storejs.remove('eQueryMaxMoney');
				let params = {
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.checkByWay(params); 
            },
            handleSizeChange(val) {
                this.size = val;
				let params = {
                    empNo:this.staffNumber ? this.staffNumber:undefined,
                    name:this.staffName ? this.staffName:undefined,
                    minAvaiableAmount:this.minMoney ? this.minMoney : undefined,
                    maxAvaiableAmount:this.maxMoney ? this.maxMoney :undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.checkByWay(params); 
            },
            handleCurrentChange(val) {
                this.current = val;
				let params = {
                    empNo:this.staffNumber ? this.staffNumber:undefined,
                    name:this.staffName ? this.staffName:undefined,
                    minAvaiableAmount:this.minMoney ? this.minMoney : undefined,
                    maxAvaiableAmount:this.maxMoney ? this.maxMoney :undefined,
                    size:this.size,
                    current:this.current,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.checkByWay(params); 
            },
            handleSelectionChange(val) {
                var arr = [];
                for (let i of val){
                    arr.push(i.id);
                }
                this.multipleSelection = arr;
            },
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
		input {
			padding-left: 20px;
		}
        span {
             line-height: 30px;
            color: #979cb2;
            margin-right: 10px;
        }
        .btn-border {
            width: 71px !important;
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
        .btn-bg {
            box-shadow: 0 10px 6px -4px rgba(122, 175, 253, 0.6);
            width: 71px !important;
            height: 30px;
            float: left;
            background-image: linear-gradient(-10deg,
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
		.hr {
			margin-left: 10px;
		}
		.first {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
			margin-bottom: 30px
		}
		.second {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
			margin-bottom: 30px
		}
		.third {
			input {
				width: 143px;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
			margin-bottom: 30px
		}
		.btn-right {
			margin-right: 20px;	
			margin-bottom: 30px
		}		
	}
    .addBtnContainer {
            padding-top: 10px;
            display:flex;
            justify-content: space-around;
            align-content: center;
            align-items: center;
            width: 320px;
            margin: 0 auto;
            div:nth-child(1){
                height: 40px;
                width: 120px;
                line-height: 40px;
                box-sizing: border-box;
                text-align: center;
                cursor: pointer;
                border-radius: 20px;
                color: #fff;
                background-image: linear-gradient(-10deg, 
                    #48a3fc 0%, 
                    #767efd 100%);
                box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6); 
            }
            div:nth-child(2){
                height: 40px;
                width: 120px;
                line-height: 40px;
                box-sizing: border-box;
                text-align: center;
                cursor: pointer;
                border: 1px solid #6479ff;
                color: #6479ff;
                border-radius: 20px;
            }
        }    
    .goBack {
        position: relative;
        margin-top: 20px;
        span {
            display: block;
            width: 71px!important;
            height: 30px;
            border: 1px solid #6479ff;
            color: #6479ff;
            text-align: center;
            line-height: 30px;
            border-radius: 20px;
            box-sizing: border-box;
            cursor: pointer;
            font-size: 12px;
            margin: 0 auto;
        }        
    }
    .infoContainer {
        margin-top: 20px;
        width: 100%;
        position: relative;
        height: auto;
    } 
    .else {
        height: 440px;
    }
    .tableCon {
        height: 360px;
    }
    .flexCon {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
    }
     .checkScope {
            height: 30px;
            .lock {
                width: 100%;
                height: 30px;
                line-height: 30px;
                z-index: 19;
                margin: 0 auto;
                .icon-sp--1 {
                    font-weight: bolder;
                    color: #fb617f;
                }
            }
            .edit {
                text-align: center;
                line-height: 28px;
                color: #6477ff;
                cursor: pointer;
                .icon-font {
                    font-size: 12px;
                }
            }
        }    
    .flexfirst {
        align-content: center;
        align-items: center;
    }
    .flexsecond {
        align-content: center;
        align-items: center;
    }
    .flexthird {
        align-content: center;
        align-items: center;
    }
    .employerqueryContainer {
        background-color: #f9f9fc;
        padding-bottom: 100px;
        margin-bottom: 40px;
        box-sizing: border-box;
        padding-left: 60px;
        padding-right: 60px;
		.first {
			margin-bottom: 20px;
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
            &-top-con {
                overflow: hidden;
                margin-bottom: 20px;
                .floatLeft {
                    float: left;
                    font-size: 14px;
                    color: #21223f;
                    width: 75%;
                    span {
                        font-size: 16px;
                        color: #6479ff;
                    }
                }
                .floatRight {
                    cursor: pointer;
                    float: right;
                    color: #6479ff;
                    font-size: 12px;
                    height: 30px;
                    line-height: 30px;
                    box-sizing: border-box;
                    .icon-font {
                        height: 30px;
                        font-size: 14px !important;
                        margin-right: 7px;
                    }
                }
            }
            &-table {
                position: relative;
                background-color: #fff;
                height: 360px;
                overflow: scroll;
                margin-bottom: 28px;
            }
            &-bottom {
                position: relative;
                @media all and (max-width: 1190px) {
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
                @media all and (min-width: 1191px) {
                    .pagInfo {
                        float: left;
                        font-size: 12px;
                        color: #c8cad7;
                        span {
                            font-size: 14px;
                            color: #6479ff;
                        }
                    }
                    .pagCon {
                        width: 440px;
                        margin: 0 auto;
                    }
                    .allStaffInfo {
                        position: absolute;
                        right: 0;
                        top: -15px;
                        font-size: 12px;
                        line-height: 28px;
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
	.employerqueryContainer {
		.detailsEnterprise .el-dialog__body {
			padding-top: 10px !important;
		}
		.detailsEnterprise .el-dialog {			
			height: 200px !important;
			position: absolute;
			width: 500px;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto !important;		
			.confirm3 {
				margin: 0 auto !important;
				float: none !important;
			}
		}
		 .el-dialog__footer .confirm3{
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
			float: left;
			margin-left: 100px;
		}
		.el-select {
			width: 200px !important;
			height: 30px;
			input {
				height: 30px;
			}
		}
		.el-table {
			position: absolute;
			left: 0;
			top: 0;
		}
		  .has-gutter th {
			background-color: #eff1ff;
			color: #21223f;
			font-size: 13px;
			font-weight: 700px;
		}
		  .cell {
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
      .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
        background-color: #fff;
    }
     .el-table__header-wrapper {
        background-color: #eff1ff;
    }
     .el-table__header {
        width: 100% !important;
    }
     .el-table__body {
        width: 100% !important;
    }
     .el-dialog__header .el-dialog__title{
        font-size: 13px;
        line-height: 32px;
        color: #6479ff;
    }
     .el-dialog {
        border-radius: 10px;
        height: 320px;        
        width: 480px;        
    }
       .el-form-item__label {
            text-align: left;
            font-size: 13px!important;
            color: #979cb2!important;
            width: 80px!important;
        }
         .el-form-item__content {
            margin-left: 80px!important;
            height: 40px!important;
        }
	}
</style>