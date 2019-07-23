<template>
    <div class="multipleQueryContainer">
        <div class="white-con">
            <div class="white-con-top-con">
                <div class="floatLeft">
                    <div class="flexCon" v-show="showHead">
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
                        <div class="flexfirst">
                            <div class="fir">发放总额：<span>{{head.valOne ? head.valOne : 0 | moneyFormat}}</span>元</div>
                        </div>
                        <div class="flexsecond">
                            <div class="sec">收益分配总额：<span>{{head.valTwo ? head.valTwo : 0 | moneyFormat}}</span>元</div>
                        </div>
                        <div class="flexthird">
                            <div class="thi">提现总额：<span>{{head.valThree ? head.valThree : 0 | moneyFormat }}</span>元</div>
                        </div>
                        <div class="flexfourth">
                            <div class="fou">留存总额：<span>{{head.valFour ? head.valFour : 0 | moneyFormat}}</span>元</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="white-con-top-form" v-show="showForm">
                    <div class="first">
                        <span>姓名</span><input v-model.trim="staffNumber" @blur="staffNumberBlur">
                    </div>
                    <div class="second">
                        <span>类型</span>
                        <el-select v-model="getType" placeholder="请选择类型" @change="typeBlur">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="提现" value="WITHDRAW"></el-option>
                            <el-option label="工资发放" value="SALARY"></el-option>
                            <el-option label="奖金" value="BONUS"></el-option>
                            <el-option label="其它" value="OTHER"></el-option>
                            <el-option label="收益" value="PROFIT"></el-option>
                        </el-select>
                    </div>
                    <div class="second">
                        <span class="span">状态</span>
                        <el-select v-model="getStatus" placeholder="请选择状态" @change="statusBlur">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="申请中" value="APPLYING"></el-option>
                            <el-option label="打款中" value="	PENDING"></el-option>
                            <el-option label="成功" value="SUCCESS"></el-option>
                        </el-select>
                    </div>
                        <div class="third speThird">
                            <span >创建日期</span>
                            <el-date-picker v-model="value5"  type="daterange"  align="left"  unlink-panels  format="yyyy-MM-dd"  value-format="yyyy-MM-dd"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" :picker-options="pickerOptions2"  @blur="dateBlur">
                            </el-date-picker>
                        </div>     
                        <div class="third">
                            <span >成功日期</span>
                            <el-date-picker v-model="value6"  type="daterange"  align="left"  unlink-panels  format="yyyy-MM-dd"  value-format="yyyy-MM-dd"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" :picker-options="pickerOptions2"   @blur="dateBlurSec">
                            </el-date-picker>
                        </div> 
                    <div class="btn-right">
                        <div class="btn-bg" @click="checkAction">查询</div>
                        <div class="btn-border" @click="reset">重置</div>
                    </div>
            </div>
            <div v-if="infoHide">
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
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="billNo" label="帐单号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="transCode.message" label="账单类型" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="empNo" label="员工号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="status.message" label="账单状态" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="gmtCreate" label="创建时间" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="gmtSuccess" label="完成时间" show-overflow-tooltip></el-table-column>
                        <el-table-column label="发生金额" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="positive" :class="{negative:  scope.row.transDirection.name == 'O' ? true :false  }">￥{{ scope.row.amount }}</span>
                              </template>
                        </el-table-column>
                        <el-table-column  label="查看">
                            <template slot-scope="scope">
                                <div class="checkScope">
                                    <div v-permit="'37'" class="edit" @click="checkDetails(scope.$index,scope.row)"> 
                                    <i class="icon-font icon-jcxx_-4"></i>
                                    查看
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
                    <div class="allStaffInfo">
                        <div v-if="showRightCorner">{{textSet}}<span>￥{{moneySet | moneyFormat}}</span></div>
                    </div>
                </div>
            </div>
            <div v-else>
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
                            <el-table-column prop="type" label="账单类型" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="status" label="账单状态" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="operator" label="操作人" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="gmtCreate" label="创建时间" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="gmtSuccess" label="成功时间" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="amount" label="操作金额" show-overflow-tooltip>
                                <template slot-scope="scope">
                                <span >￥{{ scope.row.amount }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="avaiableAmount" label="账户金额" show-overflow-tooltip>
                                <template slot-scope="scope">
                                <span >￥{{ scope.row.avaiableAmount }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="principal" label="本金金额" show-overflow-tooltip>
                                <template slot-scope="scope">
                                <span >￥{{ scope.row.principal }}</span>
                              </template>
                            </el-table-column>
                            <el-table-column prop="incomeAmount" label="溢价金额" show-overflow-tooltip>
                                <template slot-scope="scope">
                                <span >￥{{ scope.row.incomeAmount }}</span>
                              </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="goBack" >
                        <span @click="goBack">返回</span>
                    </div>
                </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
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
    import errInfo from '@/api/errInfo';
    import storejs from 'store'; 
    import money from '@/api/money'
	import dayjs from 'dayjs';    
    export default {
        data() {
            return {
                minus:false,
                showRightCorner:false,
                infoHide:true,
                pageCurrent: 1,
                pageSize: 10,
                pageTotal: 0,
                tableData3: [],
                tableData2:[],
                radio: '1',
                staffNumber: '',
                getType: '',
                minMoney: '',
                maxMoney: '',
                size: 10,
                current: 1,
                cusArr:[],
                head: {
                    valOne: 0,
                    valTwo: 0,
                    valThree: 0,
                    valFour: 0,
                },
                showForm:true,
                getStatus:'',
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value5: '',
                value6:'',
                allPages:0,
                showHead:true,
                textSet:'',
                moneySet:'',
				multipleSelection:[],				
				groupShow:false,
				companyExtra:'',				
				companyExtraOptions:[],
				dialogVisibleEnterprise:false,
            }
        },
        mounted() {
			this.dealEnterprise();
			let parms = {
                    name: this.staffNumber ? this.staffNumber :undefined,
                    transCode: this.getType ? this.getType :undefined,
                    minGmtCreate: this.value5 ? this.value5[0] :undefined,
                    maxGmtCreate: this.value5? this.value5[1] :undefined,
                    minGmtSuccessCreate:this.value6 ? this.value6[0] :undefined,
                    maxGmtSuccessCreate:this.value6 ? this.value6[1] :undefined,
                    status:this.getStatus ? this.getStatus : undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
            this.checkByWay(parms);
        },
        filters:{
            moneyFormat:(val)=>{
                return money.getThousandNum(val);
            },
        },
        methods: {	
			checkAction(){
				let parms = {
                    name: this.staffNumber ? this.staffNumber :undefined,
                    transCode: this.getType ? this.getType :undefined,
                    minGmtCreate: this.value5 ? this.value5[0] :undefined,
                    maxGmtCreate: this.value5? this.value5[1] :undefined,
                    minGmtSuccessCreate:this.value6 ? this.value6[0] :undefined,
                    maxGmtSuccessCreate:this.value6 ? this.value6[1] :undefined,
                    status:this.getStatus ? this.getStatus : undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.checkByWay(parms);
			},
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
				storejs.set('mQueryEnterprise',val);
				let parms = {
                    name: this.staffNumber ? this.staffNumber :undefined,
                    transCode: this.getType ? this.getType :undefined,
                    minGmtCreate: this.value5 ? this.value5[0] :undefined,
                    maxGmtCreate: this.value5? this.value5[1] :undefined,
                    minGmtSuccessCreate:this.value6 ? this.value6[0] :undefined,
                    maxGmtSuccessCreate:this.value6 ? this.value6[1] :undefined,
                    status:this.getStatus ? this.getStatus : undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.checkByWay(parms);
			},
			handleSelectionChange(val) {
                var arr = [];
                for (let i of val){
                    arr.push(i.id);
                }
                this.multipleSelection = arr;
            },
			download(res){
                let now = Date.now();
                        let timeMark = dayjs(now).format("YYYY年MM月DD日HH时mm分");
                        const content = res;
                        const blob = new Blob([content]);
                        const fileName = '综合查询列表'+timeMark+'.xls';
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
            initBlur(){
                let no = storejs.get('mQueryStaffNumber');
                let type = storejs.get('mQueryType');
                let date = storejs.get('mQueryDate');
                let dateSec = storejs.get('mQueryDateSec');
                let status = storejs.get('mQueryStaffType');
				let enterprise = storejs.get('mQueryEnterprise'); 
                if(no){
                   this.staffNumber = no;
                }
                if(type){
                    this.getType = type;
                }
                if(date){
                    this.value5 = date;
                }
                if(status){
                    this.getStatus = status;
                }
                if(dateSec){
                    this.value6 = dateSec;
                }
                if( this.getType ){
                    this.showRightCorner = true;
                }else{
                    this.showRightCorner = false;
                }				
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
            statusBlur(){
                storejs.set('mQueryStaffType',this.getStatus);
            },
            staffNumberBlur(){
                storejs.set('mQueryStaffNumber',this.staffNumber);                
            },
            typeBlur(){
                storejs.set('mQueryType',this.getType);
            },
            dateBlur(){
                storejs.set('mQueryDate',this.value5);
            },
            dateBlurSec(){
                storejs.set('mQueryDateSec',this.value6);
            },
            goBack(){
                this.infoHide = true;
                this.showHead = true;
                this.showForm = true;
            },
            checkDetails(index, row) {
                this.showHead = false;
                this.showForm = false;
                let params = row.id;
                apiTwo.queryMultipleBillDetail(params).then(res=>{
                    if( res.success ){
                       let data = res.data;
                         this.tableData2 = [{ 
                             billNo:data.billNo,
                             type:data.transCode.message,
                             name:data.name,
                             status:data.status.message,
                             operator:data.operator,
                             gmtCreate:data.gmtCreate,
                             gmtSuccess:data.gmtSuccess,
                             amount:data.amount,
                             avaiableAmount:data.avaiableAmount,
                             principal:data.principal,
                             incomeAmount:data.incomeAmount 
                            }];
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err); 
                })
                this.infoHide = false;
              },
            checkByWay(parms) {
                apiTwo.queryMultiple(parms).then(res => {
                    if( res.success ){
                        this.tableData3 = res.data.records;
                        this.pageTotal = res.data.total; 
						this.current = res.data.current; 
						this.pageCurrent = res.data.current; 
                        this.allPages = Math.ceil ( res.data.total/this.size ) ;
                        this.head = {
                            valOne: res.data.extendData ? res.data.extendData.billCollect.totalGrant : 0,
                            valTwo: res.data.extendData ? res.data.extendData.billCollect.totalGrantIncome :0,
                            valThree: res.data.extendData ? res.data.extendData.billCollect.totalWithdraw : 0,
                            valFour: res.data.extendData ? res.data.extendData.billCollect.totalAvailable : 0,
                        };                        
                        let result = res.data.extendData ? (res.data.extendData.sumAmount ? res.data.extendData.sumAmount : 0 ) : 0;
                        
                         if( this.getType ){
                           this.showRightCorner = true;
                             let val = this.getType;
                             switch(val){
                                 case 'WITHDRAW':
                                     this.textSet = '提现金额';
                                     this.moneySet = result;
                                     break;
                                case 'SALARY':
                                     this.textSet = '工资发放金额';
                                     this.moneySet = result;
                                     break;
                                case 'BONUS':
                                     this.textSet = '奖金金额';
                                     this.moneySet = result;
                                     break;
                                case 'OTHER':
                                     this.textSet = '其它金额';
                                     this.moneySet = result;
                                     break;
                                 case 'PROFIT':
                                     this.textSet = '收益金额';
                                     this.moneySet = result;
                                     break;    
                             }
                        }else{
                            this.showRightCorner = false;
                        }                        
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err => {
                    errInfo.err(err); 
                })
            },
            reset() {
                this.staffNumber = '';
                this.getType = '';
                this.value5 = '';
                this.value6 = '';
                this.getStatus = '';
                storejs.remove('mQueryStaffNumber');
                storejs.remove('mQueryType');
                storejs.remove('mQueryDate');
                storejs.remove('mQueryDateSec');
                storejs.remove('mQueryStaffType');
				let parms = {
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                 this.checkByWay(parms);
            },
            handleSizeChange(val) {
                this.size = val;
				let parms = {
                    name: this.staffNumber ? this.staffNumber :undefined,
                    transCode: this.getType ? this.getType :undefined,
                    minGmtCreate: this.value5 ? this.value5[0] :undefined,
                    maxGmtCreate: this.value5? this.value5[1] :undefined,
                    minGmtSuccessCreate:this.value6 ? this.value6[0] :undefined,
                    maxGmtSuccessCreate:this.value6 ? this.value6[1] :undefined,
                    status:this.getStatus ? this.getStatus : undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.checkByWay(parms); 
            },
            handleCurrentChange(val) {
                this.current = val;
				let parms = {
                    name: this.staffNumber ? this.staffNumber :undefined,
                    transCode: this.getType ? this.getType :undefined,
                    minGmtCreate: this.value5 ? this.value5[0] :undefined,
                    maxGmtCreate: this.value5? this.value5[1] :undefined,
                    minGmtSuccessCreate:this.value6 ? this.value6[0] :undefined,
                    maxGmtSuccessCreate:this.value6 ? this.value6[1] :undefined,
                    status:this.getStatus ? this.getStatus : undefined,
                    current:this.current,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.checkByWay(parms); 
            },           
        },
    };
</script>
<style lang="scss" scoped>
    .flexCon {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .positive{
        color: #6bce61;
    }
    .negative{
        color: #fb617f;
    }
    .goBack {
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
        }
        .odd {
            background-color: #eff1ff;
        }
		.first {
			margin-bottom: 20px;
		}
        .infoFlexCon {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            height: 50px;
        }
        .infoFlexLeft {
            margin-left: 70px;
            color: #21223f;
            font-size: 14px;
        }
        .infoFlexRight {
            margin-right: 70px;
            color: #21223f;
            font-size: 14px;
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
        .flexfourth {
            align-content: center;
            align-items: center;
        }
    .white-con-top-con {
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
			margin-right: 20px;	
			margin-bottom: 30px
		}
		.btn-right {
			margin-bottom: 30px
		}
    }
    .multipleQueryContainer {
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
            &-table {
                position: relative;
                background-color: #fff;
                height: 360px;
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
                        top: 3px;
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
    .multipleQueryContainer {
        .el-col {
            border-radius: 4px;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .bg-purple {
            background: #d3dce6;
        }
        .bg-purple-light {
            background: #e5e9f2;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
    }	
	.multipleQueryContainer {
		.detailsEnterprise .el-dialog__body {
			padding-top: 10px !important;
		}
		.detailsEnterprise .el-dialog {			
			height: 200px !important;
			position: absolute;
			left: 0;
			width: 500px;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto !important;		
			border-radius: 10px;
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
	     .white-con-table .el-table {
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
		.white-con-top-form { 
			.el-date-editor {
				height: 30px;
				line-height: 30px;
				span {
					line-height: 22px;
				}
				.el-input__icon {
					line-height: 22px;
				}
				input {
					height: 28px;
				}
				width: 240px !important;
			}
		}
	}
</style>