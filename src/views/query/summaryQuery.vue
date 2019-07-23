<template>
    <div class="summaryQueryContainer">		
        <div class="white-con">			
			<div v-if="mainShow">
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
						</div>
					</div>                
				</div>
				<div class="white-con-top-form" v-show="showForm">                
					<div class="third">
						<span >时间</span>
						<div class="limit">
							<el-date-picker v-model="value1"  type="month"  align="left"  format="yyyy-MM"  value-format="yyyy-MM" placeholder="开始时间"    @change="date1Change(value1)">
								</el-date-picker>
						</div>                            
						<span class="dateText">至</span>
						<div class="limit">
							<el-date-picker v-model="value2"  type="month"  align="left"  format="yyyy-MM"  value-format="yyyy-MM"  placeholder="结束时间"  @change="date2Change(value2)">
								</el-date-picker>
						</div>
					</div>
					<div class="btn-right">
						<div class="btn-bg" @click="checkAction">查询</div>
						<div class="btn-border" @click="reset">重置</div>
					</div>
				</div>            
					<div class="white-con-table">
						<el-table
							ref="multipleTable"
							:data="tableData3"
							tooltip-effect="dark"
							style="width: 100%"
							height="350"
							stripe
							@selection-change="handleSelectionChange">
							<el-table-column prop="date" label="时间" show-overflow-tooltip></el-table-column>
							<el-table-column prop="totalGrant" label="总发放" show-overflow-tooltip>
								<template slot-scope="scope">
									<span >￥{{ scope.row.totalGrant }}</span>
								  </template>
							</el-table-column>
							<el-table-column prop="totalWithdraw" label="总提取" show-overflow-tooltip>
								<template slot-scope="scope">
									<span >￥{{ scope.row.totalWithdraw }}</span>
								  </template>
							</el-table-column>
							<el-table-column prop="totalProfit" label="总收益" show-overflow-tooltip>
								<template slot-scope="scope">
									<span >￥{{ scope.row.totalProfit }}</span>
								  </template>
							</el-table-column>
							<el-table-column  label="查看" >
                            <template slot-scope="scope">
                                <div class="checkScope" v-permit="'70'">
                                    <div  class="edit" @click="checkDetails(scope.$index,scope.row)"> 
                                    <i class="icon-font icon-jcxx_-4"></i>
                                    详情
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
				<div v-else>					
					<div class="white-con-top-form">                
						<div class="third">
							<span >姓名</span>
							<div class="limit">
								<input v-model.trim="name" >
							</div>  
						</div>
						<div class="btn-right">
							<div class="btn-bg" @click="checkByWayInner">查询</div>
							<div class="btn-border" @click="resetInner">重置</div>
						</div>
					</div>
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
                            <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>                        	
								<el-table-column prop="date" label="日期" show-overflow-tooltip></el-table-column>
                        	<el-table-column label="总发放" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>￥{{scope.row.totalGrant }}</span>
                              </template>                            
                            </el-table-column>                            
                            <el-table-column label="总提取" show-overflow-tooltip>
                                <template slot-scope="scope">
                                <span>￥{{scope.row.totalWithdraw }}</span>
                              </template>
                            </el-table-column>                            
                            <el-table-column  label="总收益" show-overflow-tooltip>
                                <template slot-scope="scope">
                                <span>￥{{scope.row.totalProfit }}</span>
                              </template>
                            </el-table-column>
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
    import storejs from 'store'; 
    import money from '@/api/money';   
    export default {
        data() {
            return {
				value1:'',
				value2:'',
                pageCurrent: 1,
                pageSize: 10,
                pageTotal: 0,
                tableData3: [],
                size: 10,
                current: 1,                
                allPages:0,
                showHead:true,
                multipleSelection:[],
                showForm:true,	
				groupShow:false,
				companyExtra:'',				
				companyExtraOptions:[],
				dialogVisibleEnterprise:false,		
				mainShow:true,				
				pageCurrent1:1,
				pageSize1:10,
				pageTotal1:0,
				tableData2:[],
				name:'',
				gmtCreate:'',
            };
        },
        mounted() {
            this.dealEnterprise();
			let params = {
					gmtStart:this.value1 ? this.value1 :undefined,
                    gmtEnd:this.value2 ? this.value2 :undefined,
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
			checkByWayInner(){
				let params = {
					gmtCreate:this.gmtCreate,
					name:this.name ? this.name :undefined,                 
                    size:this.pageSize1,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.detailQuery(params);
			},
			resetInner(){
				this.name = '';
				let params = {
					gmtCreate:this.gmtCreate,
					name:this.name ? this.name :undefined,                 
                    size:this.pageSize1,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.detailQuery(params);
			},
			detailQuery(params){
                apiTwo.queryMonthCollectionDetails(params).then(res=>{
                    if( res.success ){
						console.log(res);
                        this.tableData2 = res.data.records;
						this.pageTotal1 = res.data.total;  
						this.pageCurrent1 = res.data.current;
                    }else {
                       this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);   
                })
			},
			handleSizeChange1(val){				
				this.pageSize1 = val;
				let params = {
					gmtCreate:this.gmtCreate,
					name:this.name ? this.name :undefined,                 
                    size:this.pageSize1,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.detailQuery(params);
			},
			handleCurrentChange1(val){
				this.pageCurrent1 = val;
				let params = {
					gmtCreate:this.gmtCreate,
					name:this.name ? this.name :undefined,                 
                    size:this.pageSize1,
                    current:this.pageCurrent1,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.detailQuery(params);
			},
			goBack(){
				this.mainShow = true;
			},
			checkDetails(index,row){
				console.log(index,row);
				this.mainShow = false;
				this.gmtCreate = row.date;
				let params = {
					gmtCreate:this.gmtCreate,
					name:this.name ? this.name :undefined,                 
                    size:this.pageSize1,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.detailQuery(params);
			},
			date1Change(value){
				storejs.set('sumQDate1',value);
			},
			date2Change(value){
				storejs.set('sumQDate2',value);
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
				storejs.set('sumQEnterprise',val);
				let params = {
					gmtStart:this.value1 ? this.value1 :undefined,
                    gmtEnd:this.value2 ? this.value2 :undefined,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
					size:this.size,
                };
				this.checkByWay(params);
			},
            initBlur(){
                let date1 = storejs.get('sumQDate1');
                let date2 = storejs.get('sumQDate2');
                if(date1){
                   this.value1 = date1;
                }
                if(date2){
                    this.value2 = date2;
                } 
				let enterprise = storejs.get('sumQEnterprise'); 
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
			checkAction(){
				let params = {
					gmtStart:this.value1 ? this.value1 :undefined,
                    gmtEnd:this.value2 ? this.value2 :undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.checkByWay(params);
			},
            checkByWay(params) {
                apiTwo.queryMonthCollection(params).then(res=>{
                    if( res.success ){
						console.log(res);
                        this.tableData3 = res.data.records;
                        this.pageTotal = res.data.total; 
                        this.allPages = Math.ceil ( res.data.total/this.size ) ;    
						this.current = res.data.current; 
                    }else {
                       this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);   
                })
            },
            reset() {
                this.value1 = '';
                this.value2 = '';
                storejs.remove('sumQDate1');
                storejs.remove('sumQDate2');
				let params = {
					gmtStart:this.value1 ? this.value1 :undefined,
                    gmtEnd:this.value2 ? this.value2 :undefined,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
					size:this.size,
                };
                this.checkByWay(params); 
            },
            handleSizeChange(val) {
                this.size = val;
				let params = {
					gmtStart:this.value1 ? this.value1 :undefined,
                    gmtEnd:this.value2 ? this.value2 :undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.checkByWay(params); 
            },
            handleCurrentChange(val) {
                this.current = val;
				let params = {
					gmtStart:this.value1 ? this.value1 :undefined,
                    gmtEnd:this.value2 ? this.value2 :undefined,
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
	.checkScope {
            height: 30px;
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
	.dateText {
		margin-left: 10px;
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
	.tableCon {
        height: 360px;
    }
	.limit {
		display: inline-block;
		width: 180px;
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
				width: 143px !important;
				height: 30px;
				border: 1px solid #f2f2f2;
			}
			margin-right: 20px;	
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
    .else {
        height: 440px;
    }
    .flexCon {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
    }
	.infoContainer {		
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
		
	}

    .summaryQueryContainer {
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
	.summaryQueryContainer {
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
			width: 180px !important;
		}
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