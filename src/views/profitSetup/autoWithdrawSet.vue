<template>
	<div class="profitChangeContainer">
        <div class="white-con">			
            <div class="white-con-btn-con">
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
                <div v-permit="'32'" class="setAuto" @click="setAuto" :class="{enable:setOn}">
                    设为自动提现
                </div>
                <div v-permit="'32'" class="cancelAuto" @click="cancelAuto" :class="{enable:cancelOn}">
                    取消自动提现
                </div>
            </div>
            <div class="white-con-top-con">
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
                      <span>提现设置
                        </span>
                      <el-select v-model="value" placeholder="请选择" @change="optionChange">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                </div>
              <div class="btn-right">
                  <div class="btn-bg" @click="checkByWay">查询</div>
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
                    <el-table-column prop="id" type="selection"></el-table-column>
                    <el-table-column type="index" label="序号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="empNo" label="员工号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
<!--                    <el-table-column prop="name" label="身份证号"></el-table-column>-->
                    <el-table-column prop="hiredate" label="入职时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="username" label="手机号码" show-overflow-tooltip></el-table-column>
                    <el-table-column label="提现方式" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.autoWithdrawal==0?'手动':'自动' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="gmtCreate" label="设置时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="position" label="职位" show-overflow-tooltip></el-table-column>
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
                <div class="allStaffInfo">
                    <div>当前手动提现人员<span>{{rightCorner ? rightCorner.unAutoNum : 0}}</span>人</div>
                    <div>当前自动提现人员<span>{{ rightCorner ? rightCorner.autoNum : 0}}</span>人</div>
                </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
	</div>
</template>
<script>
    import api from '@/api/reqApi';
    import errInfo from '@/api/errInfo';
    import storejs from 'store'; 
    export default {
        data() {
            return {
                setOn:false,
                cancelOn:false,
                pageCurrent: 1,
                pageSize: 10,
                pageTotal: 0,
                tableData3: [],
                multipleSelection: [],
                radio:'1',
                staffNumber:'',
                staffName:'',
                value:'',
                options: [
                    {
                    value: '',
                    label: '全部'
                    },
                    {
                    value: '0',
                    label: '手动'
                }, {
                    value: '1',
                    label: '自动'
                }],
                AutoWithdrawalData: {
                    empNo: '',
                    name: '',
                    AutoWithdrawal: '',
                    current:'',
                    size:'',
                },
                current:1,
                size:10,
                allPages:0,
                rightCorner:{
                    autoNum:0,
                    unAutoNum:0,
                },
				groupShow:false,
				companyExtra:'',				
				companyExtraOptions:[],
				dialogVisibleEnterprise:false,
            };
        },
        mounted() {
            this.dealEnterprise();
            this.AutoWithdrawalData = {
                    empNo: this.staffNumber ? this.staffNumber :undefined,
                    name: this.staffName ? this.staffName :undefined,
                    AutoWithdrawal: this.value ? this.value : undefined,
                    size:this.size,
				subEpId:this.companyExtra ? this.companyExtra  : undefined,
            };
            this.getData(this.AutoWithdrawalData);
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
				storejs.set('autoEnterprise',val);
				 this.AutoWithdrawalData = {
                    empNo: this.staffNumber ? this.staffNumber :undefined,
                    name: this.staffName ? this.staffName :undefined,
                    AutoWithdrawal: this.value ? this.value : undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
				};
				this.getData(this.AutoWithdrawalData);
			},			
            initBlur(){
                let no = storejs.get('autoStaffNumber');
                let name = storejs.get('autoStaffName');
                let option = storejs.get('autoOption');
                if(no){
                   this.staffNumber = no;
                }
                if(name){
                    this.staffName = name;
                }    
                if( option ){
                    this.value = option;
                }				
				let enterprise = storejs.get('autoEnterprise'); 
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
                storejs.set('autoStaffNumber',this.staffNumber);
            },
            staffNameBlur(){
                storejs.set('autoStaffName',this.staffName);
            },
            optionChange(){
                storejs.set('autoOption',this.value);
            },
            getData(params) {
                api.getAutoWithdrawal(params).then(res=>{
                    if(res.success){
						this.current = res.data.current;
                        this.tableData3 = res.data.records;
                        this.pageCurrent = res.data.current;
                        this.pageSize = res.data.size;
                        this.pageTotal = res.data.total;
                        this.allPages = Math.ceil ( res.data.total/this.size ) ;
                        this.rightCorner = {
                            autoNum: res.data.extendData?  res.data.extendData.autoNum : 0,
                            unAutoNum: res.data.extendData ? res.data.extendData.unAutoNum : 0,
                        };
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);  
                })
            },
            checkByWay(){
            let val = this.value;
                if(val){
                    switch(val){
                        case '1':
                            this.setOn = true;
                            this.cancelOn = false;
                            break;
                        case '0':
                            this.setOn = false;
                            this.cancelOn = true;
                            break;  
                    }
                }else{
                    this.setOn = false;
                    this.cancelOn = false;
                }
                this.AutoWithdrawalData = {
                    empNo: this.staffNumber ? this.staffNumber :undefined,
                    name: this.staffName ? this.staffName :undefined,
                    AutoWithdrawal: this.value ? this.value : undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined, 
                };
                this.getData(this.AutoWithdrawalData);
            },
            reset(){
                this.staffNumber = '';
                this.staffName = '';
                this.value = '';
                storejs.remove('autoStaffNumber');
                storejs.remove('autoStaffName');
                storejs.remove('autoOption');
                this.AutoWithdrawalData = {
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.getData(this.AutoWithdrawalData);
                this.setOn = false;
                this.cancelOn = false;
            },
            setAuto() {
                if(  this.setOn  ){
                }else {
                    if(this.multipleSelection.length === 0) {
                            this.$message({
                                message: '你未选中任何项',
                                type: 'warning'
                            });
                        }else {
                            api.openUpdateAutoWithdrawal(this.multipleSelection,1).then(res=>{
                                if(res.success){
                                    this.AutoWithdrawalData = {
                                        empNo: this.staffNumber ? this.staffNumber :undefined,
                                        name: this.staffName ? this.staffName :undefined,
                                        AutoWithdrawal: this.value ? this.value : undefined,
                                        size:this.size,
										subEpId:this.companyExtra ? this.companyExtra  : undefined, 
                                    };
                                    this.getData(this.AutoWithdrawalData);
                                    this.$message({
                                      message: '设置成功。',
                                      type: 'success'
                                    });
                                }else{
                                    this.$message.error(res.message);
                                }
                            }).catch(err=>{
                                errInfo.err(err);    
                            })
                        }
                }
            },
            cancelAuto() {
                if(this.cancelOn){
                }else {
                    if(this.multipleSelection.length === 0) {
                        this.$message({
                            message: '你未选中任何项',
                            type: 'warning'
                        });
                    }else {
                        api.openUpdateAutoWithdrawal(this.multipleSelection,0).then(res=>{
                            if(res.success){
                                this.AutoWithdrawalData = {
                                        empNo: this.staffNumber ? this.staffNumber :undefined,
                                        name: this.staffName ? this.staffName :undefined,
                                        AutoWithdrawal: this.value ? this.value : undefined,
                                        size:this.size,
									subEpId:this.companyExtra ? this.companyExtra  : undefined,
                                };
                                this.getData(this.AutoWithdrawalData);
                                this.$message({
                                      message: '设置成功。',
                                      type: 'success'
                                    });
                            }else{
                                this.$message.error(res.message);
                            }
                        }).catch(err=>{
                            errInfo.err(err);    
                        })
                    }
                }
            },
            handleSizeChange(val) {
                this.size = val;
                this.AutoWithdrawalData = {
                    empNo: this.staffNumber ? this.staffNumber :undefined,
                    name: this.staffName ? this.staffName :undefined,
                    AutoWithdrawal: this.value ? this.value : undefined,
                    size:val,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.getData(this.AutoWithdrawalData);
            },
            handleCurrentChange(val) {
                this.current = val;
                this.AutoWithdrawalData = {
                    empNo: this.staffNumber ? this.staffNumber :undefined,
                    name: this.staffName ? this.staffName :undefined,
                    AutoWithdrawal: this.value ? this.value : undefined,
                    current:val,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.getData(this.AutoWithdrawalData);
            },
            handleSelectionChange(val) {
                let all = [];
                for (var i=0;i<val.length;i++){
                    all.push(val[i].id);
                }
                this.multipleSelection = all;
            },
        }
    };
</script>
<style lang="scss" scoped>
    .enable {
        background-image:
                        linear-gradient(-10deg,
                        #acb2fe 0%,
                        #94c9fd 100%) !important;
        cursor:not-allowed !important;
    }	
	.groupShow {
		margin-right: 20px;
	}
    .profitChangeContainer {
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
            &-btn-con {
                display: flex;
				flex-direction: row;
				justify-content:flex-start;
				align-content: center;
				align-items: center;
                margin-bottom: 30px;
                .setAuto {
                    width: 100px !important;
                    height: 30px;
                    float: left;
                    box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6);
                    background-image:
                        linear-gradient(-10deg,
                        #48a3fc 0%,
                        #767efd 100%);
                    color: #fff;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 20px;
                    margin-right: 22px;
                    font-size: 12px;
                    cursor: pointer;
                }
                .cancelAuto {
                    width: 100px !important;
                    height: 30px;
                    float: left;
                    box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6);
                    background-image:
                        linear-gradient(-10deg,
                        #48a3fc 0%,
                        #767efd 100%);
                    color: #fff;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 20px;
                    margin-right: 22px;                    
                    font-size: 12px;
                    cursor: pointer;
                }
                .export {
                    color: #6479ff;
                        font-size: 12px!important;
                        line-height: 30px;
                    float: left;
                    .icon-font {
                        font-size: 14px!important;
                    }
                }
            }
            &-top-con {
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
						width: 76px;
						height: 30px;
						border: 1px solid #f2f2f2;
					}
					margin-right: 20px;	
					margin-bottom: 30px;
				}
				.btn-right {
					margin-bottom: 30px;
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
    .btn-bg{
        box-shadow:  0 10px 6px -4px rgba(122, 175, 253, 0.6);
    }
</style>
<style lang="scss">
	.profitChangeContainer {
		.el-select {
			width: 200px !important;
			height: 30px;
			input {
				height: 30px;
			}
		}
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
		 .el-table__header-wrapper {
			background-color: #eff1ff;
		}
		 .el-table__header {
			width: 100%!important;
		}
		 .el-table__body {
			width: 100%!important;
		}
		 .el-input__inner {
			height: 30px!important;
		}
		.white-con-top-con {
			.el-select {
				width: 165px !important;
			}
		}
	}     
</style>