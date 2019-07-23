<template>
    <div class="msgListsContainer">        
        <el-dialog class="hint" title="提示" :visible.sync="centerDialogVisible" width="430px" center>
          <span>是否确认删除</span>
            <div class="confirmBtns">
                <div class="confirmYes" @click="confirmChangeType">确定</div>
                <div class="confirmNo" @click="centerDialogVisible = false">取消</div>
            </div>
        </el-dialog>  
        <div class="diagContainer">        
            <el-dialog title="编辑"  :visible.sync="editShow" width="780px">
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="消息标题" prop="title">
                                    <el-input v-model="ruleForm.title" ></el-input>
                                </el-form-item>
                                <el-form-item class="notification-text" label="消息内容" prop="content">
                                    <el-input type="textarea" v-model="ruleForm.content"></el-input>
                                </el-form-item>
                                <el-form-item label="发送时间">
                                    <el-date-picker
                                     class="timerSpecial"
                                      v-model="ruleForm.date1"
                                      type="datetime"
                                      format="yyyy-MM-dd HH:mm:ss"  value-format="yyyy-MM-dd HH:mm:ss" 
                                      placeholder="定时发送请选择发送时间"
                                      align="right"
                                      :picker-options="pickerOptions1">
                                    </el-date-picker>
                                </el-form-item>
                                <div class="radioContainer">
                                    <el-radio v-model="ruleForm.radio" label="0">立即发送</el-radio>
                                    <el-radio v-model="ruleForm.radio" label="1">定时发送</el-radio>
                                </div>
                                <div class="notification-save">
                                    <div class="save" v-permit="'53'"  @click="submitForm('ruleForm')">保存</div>
                                </div>
                            </el-form>
            </el-dialog>    
        </div>        
        <div class="white-con">
            <div class="white-con-top-con">
                <div class="third">
                      <span>推送状态</span>
                    <el-select v-model="selectStatus" slot="prepend" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                      <el-option label="发送成功" value="PUSH_SUCCESS"></el-option>
                      <el-option label="未发送" value="UNSENT"></el-option>
                    </el-select>
                </div>
              <div class="btn-right">
                  <div class="btn-right-inner">
                      <div class="btn-bg" @click="checkAction">查询</div>
                      <div class="btn-border" @click="reset">重置</div>
                    </div>
              </div>
            </div>
            <div class="white-con-table">
                  <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark"   style="width: 100%" height="350" stripe   @selection-change="handleSelectionChange">
<!--                        <el-table-column type="selection"></el-table-column>-->
                        <el-table-column type="index" label="序号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="title" label="消息标题" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="content" label="消息内容" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="gmtSendMessage" label="推送时间" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="pushStatus.message" label="状态" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="name" label="推送人" show-overflow-tooltip></el-table-column>
                        <el-table-column  label="操作" width="240">
                            <template slot-scope="scope">
                                <div class="editContainer">
                                    <div class="editAndDelete">
                                        <div  v-permit="'57'"  class="edit" @click="checkDetails(scope.$index,scope.row)"> 
                                        <i class="icon-font icon-jcxx_-"></i>编辑</div>
                                        <div v-permit="'52'"  class="delete" @click="deleteThis(scope.$index,scope.row)"> 
                                        <i class="icon-font icon-cxsz_-1"></i>删除</div>
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
                 共<span>{{totalLists}}</span>条记录，当前第<span>{{current}}</span>页/共<span>{{allPages}}</span>页
              </div>
              <div class="pagCon">
                  <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage1"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="10"
                      layout="total, sizes, prev, pager, next"
                      :total="totalLists">
                    </el-pagination>
              </div>
              <div class="allStaffInfo">
                  <div>当前待推送消息<span>{{rightCorner.pushUnsent ? rightCorner.pushUnsent : 0}}</span>条</div>
                  <div>当前已推送消息<span>{{rightCorner.pushSuccess ? rightCorner.pushSuccess : 0}}</span>条</div>
              </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
    </div>
</template>
<script>
    import api from '@/api/reqApi'
    import apiTwo from '@/api/reqApiTwo'
    import errInfo from '@/api/errInfo'
    export default {
        data() {
            return {
                allPages:1,
                selectStatus:'',
                totalLists:1,
                currentPage1:1,
                totalLists:1,
                size:10,
                current:1,
                tableData3:[],
                rightCorner:{},
                centerDialogVisible:false,
                deleteId:'',
                editShow:false,
                pickerOptions1: {
                    disabledDate:function(time){
                      return time.getTime() < Date.now() - 8.64e7;
                    },
                      shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                          picker.$emit('pick', new Date());
                        }
                      }, {
                        text: '明天',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() + 3600 * 1000 * 24);
                          picker.$emit('pick', date);
                        }
                      }, {
                        text: '一周后',
                        onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                          picker.$emit('pick', date);
                        }
                      }]
                    },                
                ruleForm: {
                    title: '',
                    sender: '',
                    date1: '',
                    content: '',
                    radio:'0',
                },
                rules: {
                    title: [
                        { required: true, message: '请输入消息标题', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请选择消息内容', trigger: 'blur' }
                    ],
                    date1: [
                        {  message: '请选择发送时间', trigger: 'change' }
                    ],
                    sender: [
                        { required: true, message: '请选择发送人', trigger: 'blur' }
                    ],                    
                }                
            };
        },
        mounted(){
            this.initGetlists();
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //必填项都填完
                        if( this.ruleForm.radio ){
                            switch(  this.ruleForm.radio  ){
                                   case "0":
                                   //立即发送
                                     let data = {
                                       title:this.ruleForm.title,
                                       Content:this.ruleForm.content,
                                       code:'0'
                                    };
                            apiTwo.pushMessage(data).then(res=>{                                
                                if(res.success){
                                       this.ruleForm = {};
                                        this.editShow = false;
                                        this.$message({
                                          message: '推送消息成功',
                                          type: 'success'
                                        });
									let data = {
									   size:this.size,
									   pushStatus:this.selectStatus ?  this.selectStatus : undefined                   
								   };
                                    this.checkByWay(data);                                    
                                }else{
                                    this.$message.error(res.message);
                                }
                            }).catch(err=>{
                                    errInfo.err(err); 
                            })                                   
                                   break;
                                   case "1":
                                   //定时发送
                                    let now = Date.now();
                                   let selectTimeTrans = Date.parse(  new Date( this.ruleForm.date1 )   );
                                   var timediff = selectTimeTrans - now;
                                    if(  timediff > 0  ){
                                   //选择的时间比当前时间晚（符合逻辑）
                                        let trans = {
                                           gmtSendMessage:this.ruleForm.date1,
                                           title:this.ruleForm.title,
                                           Content:this.ruleForm.content,
                                           id:this.ruleForm.id
                                       };
                                   apiTwo.editMessage(trans).then(res=>{
                                       if(res.success){
                                           this.ruleForm = {};
                                            this.editShow = false;
                                            this.$message({
                                              message: '推送消息成功',
                                              type: 'success'
                                            });
										   let data = {
											   size:this.size,
											   pushStatus:this.selectStatus ?  this.selectStatus : undefined                   
										   };
                                        this.checkByWay(data);     
                                       }else{
                                           this.$message.error(res.message);
                                       }
                                   }).catch(err=>{
                                       errInfo.err(err); 
                                   })
                                }else {
                                  //选择的时间比当前时间早（不符合逻辑）
                                   this.$message.error('请选择合理的消息发送时间！'); 
                                }
                                   break;
                            }
                        }else {
                           this.$message.error('请选择推送类型！'); 
                        }
                    } else {
                        return false;
                    }
                });
            },  
            confirmChangeType(){
                this.centerDialogVisible = false;
                    let data = {
                        id:this.deleteId
                    };
                    apiTwo.deleteMessage(data).then(res=>{
                        if(res.success){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                              });
							let data = {
							   size:this.size,
							   pushStatus:this.selectStatus ?  this.selectStatus : undefined                   
						   };
                            this.checkByWay(data);
                        }else{
                            this.$message.error(res.message);
                        }
                    }).catch(err=>{
                        errInfo.err(err); 
                    })
            },
            checkDetails(index,row){
                this.editShow = true;
                let params = {
                    id:row.id
                };
                apiTwo.getBackMessage(params).then(res=>{
                    let data = res.data; 
                    if(res.success){
                        this.ruleForm = {
                            title: data.title,
                            date1: data.gmtSendMessage,
                            content: data.content,
                            id:data.id,
                        };
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err); 
                })
            },
            deleteThis(index,row){
                this.deleteId = row.id;
                this.centerDialogVisible = true;
            },
            handleSizeChange(val){
                this.size = val;
				let data = {
                   size:this.size,
                   pushStatus:this.selectStatus ?  this.selectStatus : undefined                   
               };
                this.checkByWay(data);
            },
            handleCurrentChange(val){
                this.current = val;
				let data = {
                   size:this.size,
                   current:this.current,
                   pushStatus:this.selectStatus ?  this.selectStatus : undefined                   
               };
                this.checkByWay(data);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
			checkAction(){
				let data = {
                   size:this.size,
                   pushStatus:this.selectStatus ?  this.selectStatus : undefined                   
               };
				this.checkByWay(data);
			},
           checkByWay(data){               
               apiTwo.getMessagesLists(data).then(res=>{                   
                   if(res.success){
					   this.current = res.data.current;
                       this.tableData3 = res.data.records;
                       this.totalLists = res.data.total;
                        this.allPages = Math.ceil ( res.data.total/this.size ) ;
                       this.rightCorner = res.data.extendData ? res.data.extendData : {};
                   }else{
                       this.$message.error(res.message);
                   }
                }).catch(err=>{
                    errInfo.err(err); 
                })
           },
            initGetlists(){
                apiTwo.getMessagesLists().then(res=>{
                     if(res.success){
						 this.current = res.data.current;
                       this.tableData3 = res.data.records;
                         this.totalLists = res.data.total;
                        this.allPages = Math.ceil ( res.data.total/this.size ) ;
                         this.rightCorner = res.data.extendData ? res.data.extendData : {};
                   }else{
                       this.$message.error(res.message);
                   }
                }).catch(err=>{
                    errInfo.err(err); 
                })
            },
            reset(){
                this.selectStatus = '';
				let data = {
                   size:this.size,               
               };
                this.checkByWay(data);
            },
        },        
    }
</script>
<style lang="scss" scoped>
    .msgListsContainer {        
        .diagContainer {
            .save {
                width: 160px;
                background-image: linear-gradient(45deg, #767efd 0%, #48a3fc 100%), linear-gradient( #ffffff, #ffffff);
                background-blend-mode: normal, normal;
                border-radius: 22px;
                box-shadow: 0px 14px 20px -10px rgba(117, 126, 253, 1);
                margin: 0 auto;
                color: #fff;
                text-align: center;
                font-size: 14px;
                height: 40px;
                line-height: 40px;
                cursor: pointer;
            }
            .radioContainer {
                margin-bottom: 20px;
            }  
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
         .editContainer{
             width: 100%;
            height: 30px;
             .editAndDelete {
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-around;
                align-content: center;
                align-items: center;                 
                  .edit {
                    text-align: center;
                    width: 50%;
                    line-height: 28px;
                    color: #6477ff;
                    cursor: pointer;
                    .icon-font {
                        font-size: 12px;
                        margin-right: 5px;
                    }
                }
                 .delete {
                    text-align: center;
                     width: 50%;
                    line-height: 28px;
                    color: #6477ff;
                    cursor: pointer;
                    .icon-font {
                        font-size: 12px;
                        margin-right: 5px;
                    }
                }                 
             }             
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
        }
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
            &-top-con {
                overflow: hidden;
                padding-bottom: 20px;                
                .btn-right-inner {
                    overflow: hidden;
                    padding-bottom: 10px;
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
                    box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6); 
                    font-size: 12px;
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
                    font-size: 12px;
                }
                .first{
                        margin-right: 20px;
                        margin-left: 54px;
                        margin-bottom: 20px;
                        color: #979cb2;
                        font-size: 12px;
                        float: left;
                        width: 286px;
                        height: 30px;
                }                    
                .third{
                        margin-bottom: 20px;
                        color: #979cb2;
                        float: left;
                        font-size: 12px;
                        width: 250px;
                        height: 30px;
                        span {
                            margin-right: 20px;
                        }
                }
                .btn-right {
                        font-size: 12px;
                        float: left;
                        margin-left: 20px;
                }
            }
        }
    }
</style>
<style lang="scss">
    .msgListsContainer {
        .diagContainer {
            .el-dialog  {
                border-radius: 10px;
                margin-top: 10vh!important;
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
                padding-top: 10px !important;
                text-align: center;
            }
            .el-form-item__label {
                width: 80px !important;
                color: #979cb2;
            }
           .el-form-item__content {
                margin-left: 80px !important;
            }
             .el-textarea__inner {
                height: 150px !important;
            }
        }
        .hint {
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
        }
    }
	.msgListsContainer {
		.white-con-table {
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
		.el-input__inner{
			height: 30px;
			line-height: 30px;
		}
		.white-con-top-con {
            .el-select  {
                width: 142px !important;
            }
    	}
	}
</style>