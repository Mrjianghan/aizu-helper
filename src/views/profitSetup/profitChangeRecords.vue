<template>
	<div class="profitChangeContainer">
        <el-dialog title="提示" :visible.sync="centerDialogVisible3" width="430px" center>
          <span>您将修改提现顺序为{{preferType}}，是否继续？</span>
            <div class="confirmBtns">
                <div class="confirmYes" @click="changePrefer">是</div>
                <div class="confirmNo" @click="centerDialogVisible3 = false">否</div>
            </div>
        </el-dialog>        
        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="430px" center>
          <span>您将修改溢价计算方式为{{incomeType}}，是否继续？</span>
            <div class="confirmBtns">
                <div class="confirmYes" @click="confirmChangeType">是</div>
                <div class="confirmNo" @click="centerDialogVisible = false">否</div>
            </div>
        </el-dialog>
        <el-dialog title="提示"  :visible.sync="centerDialogVisible2" width="430px"  center>
          <span>您当前设置的收益率为<span class="highLight">{{rate}}</span>%，<span v-if="rate>10 ? true : false " class="highLight">已超过10%，</span>是否继续设置?</span>
            <div class="confirmBtns">
                <div class="confirmYes" @click="confirmChangeRate">是</div>
                <div class="confirmNo" @click="centerDialogVisible2 = false">否</div>
            </div>
        </el-dialog>
		
		<el-dialog title="提示" :visible.sync="minLimitVisible" width="430px" center>
          <span>最低提现金额{{minWithdrawLimit}}元，是否继续？</span>
            <div class="confirmBtns">
                <div class="confirmYes" @click="setMinLimitConfirm">是</div>
                <div class="confirmNo" @click="minLimitVisible = false">否</div>
            </div>
        </el-dialog>
        <div class="white-con">
			<div class="paraTop">
				<div class="paraTopDivide">
					<div class="white-con-top-con">
						<div  class="first">
							<span>收益率设置</span>
							<input v-model.number.trim="rate" @blur="checkValidate">
							<span class="percent">%</span>
						</div>
						<div  class="second btn-bg" @click="setRateAction" v-permit="'28'" >保存</div>
						<div class="third btn-border" @click="reset" v-permit="'28'" >重置</div>
					</div>
				</div>
				<div class="paraTopDivide">
					<div class="white-con-top-con">
						<div  class="first">
							<span>最低提现金额</span>
							<input v-model.trim="minWithdrawLimit" @blur="minWithdrawLimitCheck(minWithdrawLimit)">
							<span class="percent">元</span>
						</div>
						<div  class="second btn-bg" @click="confirmMinWithdrawLimit(minWithdrawLimit)" v-permit="'33'" >保存</div>
					</div>
				</div>
			</div>
			<div class="paraBottom">
				<div class="paraBottomDivide">
					 <div class="white-con-check">
						<div class="check-one">
							<span>提现顺序：</span>
							  <el-radio v-model="prefer" label="1">本金优先</el-radio>
								<el-radio v-model="prefer" label="2">收益优先</el-radio>
						</div>
						<div class="btn-bg" @click="savePrefer" v-permit="'30'" >保存</div>
					</div>
				</div>
				<div class="paraBottomDivide">
					<div  class="white-con-check">
						<div class="check-one">
							<span>是否计算复利：</span>
							  <el-radio v-model="radio" label="1">单利</el-radio>
								<el-radio v-model="radio" label="2">复利</el-radio>
						</div>
						<div class="btn-bg" @click="setCategory" v-permit="'29'">保存</div>
					</div>
				</div>	
			</div>
			
			
			
			
            
			
            
			
           
			
            <div class="white-con-table">
                <el-table ref="multipleTable"  :data="tableData3" tooltip-effect="dark" style="width: 100%" height="350" stripe   @selection-change="handleSelectionChange">
<!--
                    <el-table-column  type="selection"></el-table-column>
-->
                    <el-table-column prop="id" label="序号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="username" label="操作人" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="gmtCreate" label="操作时间" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="setParameters" label="设置参数" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="revenueType" label="设置" show-overflow-tooltip></el-table-column>
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
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
	</div>
</template>
<script>
    import apitwo from '@/api/reqApiTwo';
    import storejs from'store';
    import errInfo from '@/api/errInfo'
export default {
  data() {
    return {
        pageCurrent: 0,
        pageSize: 10,
        pageTotal: 0,
        tableData3: [],
        centerDialogVisible: false,
        centerDialogVisible2:false,
        centerDialogVisible3:false,
        radio:'1',
        rate:'',
        current:1,
        size:10,
        incomeType:'单利',
        allPages:0,
        prefer:'0',
        preferType:'本金优先',
		minWithdrawLimit:'',
		minLimitVisible:false,
    };
  },
  watch: {},
    beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        storejs.remove('initRate');
        next();
      },
    mounted(){
      this.initGetLists();
    },
  methods: {
	  setMinLimitConfirm(){
		  let data = {
				   amount:this.minWithdrawLimit
			  };    
			  apitwo.updateMinimumAmountSetting(data).then(res=>{
					if(res.success){
					this.initGetLists();
						this.minLimitVisible = false;
					  this.$message({
						 message: '修改成功',
						 type: 'success'
					  });
					 }else{
						this.$message.error(res.message);
					 }
				}).catch(err=>{
					 errInfo.err(err);    
				})
	  },
	  confirmMinWithdrawLimit(val){
		  if(val){
			  this.minLimitVisible = true;
			}else{
				this.minLimitVisible = false;
				this.$message.error('请输入最低提现金额。');
			}
	  },
	  minWithdrawLimitCheck(val){
		  if(val.length){
			  let num = Number(val);
			  if(num!=num){
				 //是NaN情况
			 	this.minWithdrawLimit = '';
			  }else{
				 this.minWithdrawLimit = Math.abs(  num  );
			  }
		  }		  
	  },
      changePrefer(){
          let data;
          switch(  this.prefer  ){
                 case '1':
                    data = {
                          withdrawOrder:'1'
                      };    
                      apitwo.setPreferMoney(data).then(res=>{
                          if(res.success){
                            this.initGetLists();
                              this.centerDialogVisible3 = false;
                              this.$message({
                                  message: '修改成功',
                                  type: 'success'
                                });
                            }else{
                                this.$message.error(res.message);
                            }
                      }).catch(err=>{
                          errInfo.err(err);    
                      })
                 break;
                 case '2':
                     data = {
                          withdrawOrder:'0'
                      };  
                      apitwo.setPreferMoney(data).then(res=>{
                          if(res.success){
                            this.initGetLists();
                               this.$message({
                                  message: '修改成功',
                                  type: 'success'
                                });
                              this.centerDialogVisible3 = false;
                            }else{
                                this.$message.error(res.message);
                            }
                      }).catch(err=>{
                          errInfo.err(err);   
                      })
                 break;
          }
      },
      savePrefer(){
          this.centerDialogVisible3 = true;
          switch(  this.prefer  ){
                 case '1':
                  this.preferType = '本金优先';
                 break;
                 case '2':
                  this.preferType = '收益优先';
                 break;
          }
      },
      checkValidate(){
          if( this.rate ){
             this.rate = Math.abs( this.rate );
          }else {
             this.$message.error('收益率不能为0');
          }
      },
      confirmChangeType(){
          let data;          
          switch(  this.radio  ){
                 case '1':
                    data = {
                          category:'0'
                      };              
                      apitwo.updateCategorySetting(data).then(res=>{
                          if(res.success){
                            this.initGetLists();
                              this.centerDialogVisible = false;
                              this.$message({
                                  message: '修改成功',
                                  type: 'success'
                                });
                            }else{
                                this.$message.error(res.message);
                            }
                      }).catch(err=>{
                          errInfo.err(err);   
                      })
                 break;
                 case '2':
                     data = {
                          category:'1'
                      };  
                      apitwo.updateCategorySetting(data).then(res=>{
                          if(res.success){
                            this.initGetLists();
                               this.$message({
                                  message: '修改成功',
                                  type: 'success'
                                });
                              this.centerDialogVisible = false;
                            }else{
                                this.$message.error(res.message);
                            }
                      }).catch(err=>{
                          errInfo.err(err);   
                      })
                 break;
          }
      },
      confirmChangeRate(){
            let data = {
                earnings:this.rate
            };              
            apitwo.updateEarningsSetting(data).then(res=>{
                if(res.success){
                    this.centerDialogVisible2 = false;
                    this.initGetLists();
                    this.$message({
                                  message: '修改成功',
                                  type: 'success'
                    });
                }else{
                    this.$message.error(res.message);
                }
            }).catch(err=>{
                errInfo.err(err);   
            })
      },
      reset(){
          this.rate = storejs.get('initRate');
      },
      setRateAction(){
          if( this.rate ){
             this.centerDialogVisible2 = true;
          }else{
             this.$message.error('收益率不能为0');
          }
      },
      setCategory(){
              this.centerDialogVisible = true;
              switch(  this.radio  ){
                      case '1':
                      this.incomeType = '单利';
                      break;
                      case '2':
                      this.incomeType = '复利';
                      break;
              }
      },
      handleSizeChange(val) {
          this.size = val;		  
          let params = {
              size:val
          };
          this.getListWithParams(params);
      },
      handleCurrentChange(val) {
          this.current = val;
          let params = {
              current:val,
              size:this.size
          };
          this.getListWithParams(params);
      },
      handleSelectionChange(val) {
          this.multipleSelection = val;
      },
      getListWithParams(params){
          apitwo.getQueryType(params).then(res=>{			  
              if(res.success){
				  this.current =  res.data.current;
                  this.tableData3 = res.data.records; 
                  this.pageTotal = res.data.total;
                  this.allPages = Math.ceil ( res.data.total/this.size ) ; 
                  this.rate = res.data.extendData.typeVOList[0].value;
				  this.minWithdrawLimit = res.data.extendData.typeVOList[3].value;
                  if( res.data.extendData.typeVOList[2].value == '0' ){
                      this.prefer = '2';
                  }else{
                     this.prefer = '1';
                  }
                  if( res.data.extendData.typeVOList[1].value =='0' ){
                      this.radio = '1';
                  }else{
                      this.radio = '2';
                  }
              }else{
                  this.$message.error(res.message);
              }
          }).catch(err=>{
              errInfo.err(err);   
          })
      },
      initGetLists(){
          apitwo.getQueryType().then(res=>{
              if(res.success){
				  this.current =  res.data.current;
                  this.tableData3 = res.data.records; 
                  this.pageTotal = res.data.total;
                  this.allPages = Math.ceil ( res.data.total/this.size ) ;
                  this.rate = res.data.extendData.typeVOList[0].value;
				  this.minWithdrawLimit = res.data.extendData.typeVOList[3].value;
                  storejs.set('initRate',this.rate);
                  if( res.data.extendData.typeVOList[2].value == '0' ){
                      this.prefer = '2';
                  }else{
                     this.prefer = '1';
                  }
                  if( res.data.extendData.typeVOList[1].value =='0' ){
                      this.radio = '1';
                  }else{
                      this.radio = '2';
                  }
              }else{
                  this.$message.error(res.message);
              }
          }).catch(err=>{
              errInfo.err(err);   
          })
      },
  },
};
</script>
<style lang="scss" scoped>
    .specialMargin {
        margin-top: 20px;
    }
	.paraTopDivide {
		width:50%;
	}
	.paraBottomDivide {
		width:50%;
	}
	.paraTop {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-content: center;
		align-items: center;
	}
	.paraBottom {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-content: center;
		align-items: center;
	}
    .profitChangeContainer {
        background-color: #f9f9fc;
        padding-bottom: 100px;
        margin-bottom: 40px;
        box-sizing: border-box;
        padding-left: 60px;
        padding-right: 60px;
        .highLight {
            color: #ec3434;
            font-weight: 700;
        }
        .confirmBtns {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            margin-top: 40px;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
            .confirmYes {
                width: 80px;
                height: 40px;
                box-sizing: border-box;
                font-size: 12px;
                box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6);
                    background-image:
                    linear-gradient(-10deg, 
                    #48a3fc 0%, 
                    #767efd 100%);
                    color: #fff;
                    text-align: center;
                    line-height: 40px;
                    border-radius: 20px; 
                    margin-right: 22px;
                    cursor: pointer;
                    margin-left: 90px;
            }
            .confirmNo {
                width: 80px;
                height: 40px;
                box-sizing: border-box;
                border: 1px solid #6479ff;
                color: #6479ff;
                text-align: center;
                line-height: 40px;
                border-radius: 20px;
                cursor: pointer;
                margin-right: 90px;
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
                margin-top: 27px;
                margin-bottom: 28px;
            }
            &-check {
                .btn-bg {
                    width: 56px !important;
                    height: 30px;
                    float: left;
                    font-size: 12px;
                    background-image:
                    linear-gradient(-10deg, 
                    #48a3fc 0%, 
                    #767efd 100%);
                    color: #fff;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 20px; 
                    margin-right: 22px;
                    cursor: pointer;
                }
                .check-one {
                    width: 310px;
                    float: left;
                    span {
                        font-size: 12px;
                        color: #21223f;
                    }
                }
                &:after {
                    content: '';
                    display: block;
                    clear: both;
                    overflow: hidden;
                } 
            }
            &-top-con {
                    span {
                        display: inline-block;                        
                    }
                    input {
                        border: none;
                        height: 30px;
                        border: 1px solid #f2f2f2;
                        padding-left: 20px;
                        box-sizing: border-box;
                        width: 140px;
                    }
                    .first{
                        margin-right: 20px;
                        margin-bottom: 20px;
                        color: #979cb2;
                        font-size: 12px;
                        float: left;
                        min-width:  290px;
                        span {
                            color: #21223f;
                            margin-right: 20px;                            
                        }
                        .percent {
                            margin-left: 20px;
                        }
                    }
                    .second{
                        margin-right: 20px;
                        margin-bottom: 20px;
                        color: #979cb2;
                        font-size: 12px;
                        float: left;
                        width: 95%;
                    }

                    .third{
                        margin-right: 20px;
                        margin-bottom: 20px;
                        color: #979cb2;
                        float: left;
                        font-size: 12px;
                        width: 95%;
                    }
                    .btn-bg{
                            width: 56px !important;
                            height: 30px;
                            float: left;
                            background-image:
                                    linear-gradient(-10deg, 
                                    #48a3fc 0%, 
                                    #767efd 100%);
                            color: #fff;
                            text-align: center;
                            line-height: 30px;
                            border-radius: 20px; 
                            margin-right: 22px;
                            cursor: pointer;
                        }
                    .btn-border{
                            width: 56px!important;
                            height: 30px;
                            float: left;
                            border: 1px solid #6479ff;
                            color: #6479ff;
                            text-align: center;
                            line-height: 30px;
                            border-radius: 20px;
                            box-sizing: border-box;
                            cursor: pointer;
                            margin-right: 0;
                    }                
                &:after {
                    content: '';
                    display: block;
                    clear: both;
                    overflow: hidden;
                }
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
        box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6);
    }
</style>
<style lang="scss">
    .profitChangeContainer {
        .el-dialog  {
            border-radius: 10px;
            margin-top: 30vh!important;
        }
        .el-dialog__header {
            text-align: left;
            padding-left: 40px;
            padding-right: 40px;
            padding-top: 30px;
            padding-bottom: 0;
            .el-dialog__title {
                color: #6479ff;
                font-size: 14px;
            }
        }
        .el-dialog__body {
            font-size: 13px;
            color: #21223f;
            padding-bottom: 10px;
            text-align: center;
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
    }
</style>