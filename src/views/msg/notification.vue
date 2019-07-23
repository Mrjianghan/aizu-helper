<template>
    <div class="pushMessageContainer">
        <div class="white-con">
            <div class="white-con-top">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="消息标题" prop="title">
                        <el-input v-model="ruleForm.title" ></el-input>
                    </el-form-item>
                    <el-form-item class="notification-text" label="消息内容" prop="content">
                        <el-input type="textarea" v-model="ruleForm.content"></el-input>
                    </el-form-item>
<!--
                    <el-form-item label="发  送  人" prop="sender">
                        <el-input v-model="ruleForm.sender"></el-input>
                    </el-form-item>
-->
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
                    <div v-permit="'55'" class="notification-save">
                        <div class="save" @click="submitForm('ruleForm')">保存</div>
                    </div>
                </el-form>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>        
    </div>
</template>
<script>
    import apiTwo from '@/api/reqApiTwo';
    import errInfo from '@/api/errInfo'
    export default {
        data() {
            return {
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
                    ]
                }
            };
        },
        mounted(){
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //必填项都填完
                        if( this.ruleForm.radio === '1' ){
                            //选择了定时发送按钮
                           if(  this.ruleForm.date1  ){
                               //选择了定时时间
                               let now = Date.now();
                               let selectTimeTrans = Date.parse(  new Date( this.ruleForm.date1 )   );
                               var timediff = selectTimeTrans - now;
                               if(  timediff > 0  ){
                                   //选择的时间比当前时间晚（符合逻辑）
                                   let data = {
                                       gmtSendMessage:this.ruleForm.date1,
                                       title:this.ruleForm.title,
                                       Content:this.ruleForm.content,
                                       code:'1'
                                   };
                                   apiTwo.pushMessage(data).then(res=>{
                                       if(res.success){
                                           this.$message({
                                              message: '推送消息成功。',
                                              type: 'success'
                                            });
                                           this.ruleForm =  {
                                                title: '',
                                                date1: '',
                                                content: '',
                                                radio:'0',
                                            };
                                           this.$router.push('/msg/lists');
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
                            }else {
                              this.$message.error('请选择消息定时发送的时间！');
                            }
                        }else {
                            //视作立即发送来处理
                            let data = {
                                       title:this.ruleForm.title,
                                       Content:this.ruleForm.content,
                                       code:'0'
                            };
                            apiTwo.pushMessage(data).then(res=>{
                                if(res.success){
                                    this.$message({
                                              message: '推送消息成功。',
                                              type: 'success'
                                            });  
                                    this.ruleForm =  {
                                                title: '',
                                                date1: '',
                                                content: '',
                                                radio:'0',
                                            };
                                    this.$router.push('/msg/lists');
                                }else{
                                    this.$message.error(res.message);
                                }
                            }).catch(err=>{
                                  errInfo.err(err);  
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },        
    }
</script>
<style lang="scss" scoped>
    .pushMessageContainer {        
        background-color: #f9f9fc;
        padding-bottom: 100px;
        margin-bottom: 40px;
        box-sizing: border-box;
        padding-left: 60px;
        padding-right: 60px;        
        .radioContainer {
            text-align: center;
            margin-bottom: 20px;
        }
        .white-con {
            margin-top: 36px;
            background-color: #fff;
            border-radius: 12px;
            width: 100%;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 40px;
            padding-bottom: 20px;
            box-sizing: border-box;            
            &-top {
                width: 50%;
                min-width: 500px;
            }            
        }
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
    }
</style>
<style lang="scss">
	.pushMessageContainer {
		.el-form-item__label {
			width: 100px !important;
			color: #979cb2;
		}
		.el-form-item__content {
			margin-left: 100px !important;
		}
		.el-textarea__inner {
			height: 200px !important;
		}
	}	
</style>