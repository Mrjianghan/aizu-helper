<template>
        <div class="login-container " @keyup.enter="handleLogin" tabindex="0">
            <div class="login-left">
              <div class="login-left-con-head">
                  <img class="login-left-headimg" :src="headsrc">
                  <div class="login-left-title">企业后台管理系统</div>
              </div>
              <div class="welcome-con">
                  <div class="welcome-con-cn">{{welcomeCn}}</div>
                  <div class="welcome">{{welocomEn}}</div>
              </div>
              <div class="form">
                  <div class="switch-con">
                      <div v-show="showAccountLogin" class="account-loginCon">
                          <input type="text" placeholder="用户名" v-model.trim="loginForm.username">
                          <input class="account-loginCon-psw" type="password" placeholder="密码" v-model.trim="loginForm.password">
                          <div class="picCode specialCode">
                                    <input class="picCodeInput" type="text" maxlength="4" placeholder="请输入验证码" v-model.trim="loginForm.code" autocomplete="off">
                                    <img  class="picImg" :src="picImgLogin">
                                    <div @click="WelcomeRefreshImg" class="refresh">刷新</div>
                          </div>
                          <div @click="forgetClick" class="forget">忘记密码？</div>
                      </div>
                      <div v-show="showNext" class="mobile-loginCon">
                              <input type="text" placeholder="请输入邮箱" v-model.trim="mobilePhone" @blur="phoneNumberBlur">
<!--
                          <div class="picCode">
                                    <input class="picCodeInput" type="text" maxlength="4" placeholder="请输入验证码" v-model.trim="picCode" autocomplete="off">
                                    <img  class="picImg" :src="picImg">
                                    <div @click="refreshImg" class="refresh">刷新</div>
                                </div>
-->
                                <div class="mobile-con">
                                    <input type="text" placeholder="验证码" v-model.trim="mobilePSW"><div @click="sendMsg" v-if="hideTimer" class="sendSmCode">发送邮件</div><div  v-else class="timer">{{timerNumer}}s</div>
                              </div>
                      </div>
                      <div v-show="showFinish" class="mobile-loginCon">
                                    <input type="password" maxlength="11" placeholder="请输入新密码" v-model.trim="mobileNPsw" @blur="nPswBlur">
                                    <div class="mobile-con">
                                        <input type="password" placeholder="再次输入密码" v-model.trim="mobileNPswAgain" @blur="nPswAgainBlur">
                                  </div>
                                </div>
                  </div>
                  <div class="login-btn" @click="loginAction" >{{btnText}}</div>
                  <div v-if="showNext" class="backNextCon" @click="backToLoginAction">返回登录页</div>
                  <div v-if="showFinish" class="backFinishCon">
                      <div class="backLogin" @click="backToLoginAction">返回登录页</div>
                      <div @click="gobackForget">返回上一页</div>
                  </div>
              </div>
                
              <div class="homefixed">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
      </div>
  </div>
</template>
<script>
    import url from '@/api/picCodeUrl'
    import apiTwo from '@/api/reqApiTwo'
    import storejs from 'store';   
    import { loginByUsername } from '@/api/login'
    import { mapGetters } from "vuex";
    import { getToken, setToken, removeToken } from '@/util/auth'
    import errInfo from '@/api/errInfo'
    export default {
      data() {
        return {
          bgsrc:require('../../../static/img/ui/login_1@2x.png'),
            headsrc:require('../../../static/img/ui/logo@2x.png'),
            firstactive:true,
            showAccountLogin:true,   
            showFinish:false,
            showNext:false,
            mobilePhone:'',
            mobilePSW:'',
            mobileNPsw:'',
            mobileNPswAgain:'',
            accountValidate:false,
            mobileValidate:false,
            hideTimer:true,
            timerNumer:60,
            btnText:'登录',
            welcomeCn:'欢迎，登录',
            welocomEn:'WELCOME TO LOGIN',
            picCode:'',
            email:'',
            loginForm: {
                username: "",
                password: "",
                code:""
            },
            randomStr:'',
            picImg:'',
            picImgLogin:''
        };
      },
		beforeCreate(){
			storejs.clearAll();
		},
      mounted() {
          storejs.set('homeTagshow',false);
          storejs.set('homestatushow',true);
          this.$store.commit('switchhometag',false);
          this.$store.commit('switchhomestatus',true);
          this.initPicCode();
      },
        beforeRouteLeave (to, from, next) {
        // 导航离开该组件的对应路由时调用
            clearInterval( window.Timer );
            next();
        },
      computed: {
          ...mapGetters(["tagWel"])
      },
      methods: {  
          gobackForget(){
              this.showAccountLogin =false;
              this.showNext = true;
              this.showFinish = false;
              this.hideTimer = true;
              this.refreshImg();
              this.btnText = '下一步';
          },
          backToLoginAction(){
              this.showAccountLogin =true;
              this.showNext = false;
              this.hideTimer = true;
              this.showFinish = false;
            this.btnText = '登录';
              this.initPicCode();
            this.welcomeCn = '欢迎，登录';
            this.welocomEn = 'WELCOME TO LOGIN';
          },
          initPicCode(){
              this.randomStr = Date.now();
              this.picImgLogin = url.url + "/code/" + this.randomStr;
          },
          emailBlur(){
              let val = this.email;
              if(val){
              }else{
                  this.$message.error('请输入邮箱号。');
              }
          },
          
          handleLogin(){
               if( this.showAccountLogin ){
                   //登录
                        this.login();   
              }else if ( this.showNext ){
                        this.middleStep();
              } else {
                      //显示完成
                         this.resetPsw();       
              }  
          },
          nPswBlur(){
              let val = this.mobileNPsw;
              if(val){
                  if(val.length<6){
                      this.$message.error('密码长度不小于6位。');
                  }
              }
          },
          nPswAgainBlur(){
              let val = this.mobileNPswAgain;
              if(val){
                  if(val.length<6){
                      this.$message.error('密码长度不小于6位。');
                  }
              }
          },
          phoneNumberBlur(){
              let val = this.mobilePhone;              
              if( /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val) ){
              }else{
                  this.$message.error('请检查邮箱格式。');
              }
          },
          refreshImg(){
              this.randomStr = Date.now();
              this.picImg = url.url + "/code/" + this.randomStr;
          },
          WelcomeRefreshImg(){
              this.initPicCode();              
          },
          sendMsg(){
              if( (this.mobilePhone) ){
                  let data = {
                      email:this.mobilePhone,
                      emailSendType:'FORGET_PASSWORD'					  
                  };
                  apiTwo.sendNotLogEmail(data).then(res=>{
                      console.log(res);
                      if(res.success){
                          this.hideTimer = false;						  
                          window.Timer = setInterval(()=>{
                              this.timerNumer = this.timerNumer - 1;
                              if( this.timerNumer === 0 ){
                                    clearInterval( window.Timer );
                                    this.hideTimer = true;
                                  this.timerNumer = 60;
                              }
                          },1000);
						  
                          this.$message({
                              message: '邮件发送成功。',
                              type: 'success'
                            });
                      }else{
                          this.$message.error(res.message);
                      }
                  }).catch(err=>{
                      errInfo.err(err);    
                  })
              }else{
                  this.$message.error('请输入邮箱。');
              }
          },
          forgetClick(){
              this.showAccountLogin =false;
              this.showNext = true;
              this.showFinish = false;
              this.btnText = '下一步';
              this.hideTimer = true;
              this.welcomeCn = '修改密码';
              this.welocomEn = 'MODIFY PASSWORD';
              this.randomStr = Date.now();
              this.picImg = url.url + "/code/" + this.randomStr; 
          },
          login(){
              if( (this.loginForm.username === '' ) || (this.loginForm.password === '' ) || ( this.loginForm.code === '' ) ){
                      this.$message.error('登录名，密码，图片验证码不能为空！');               
                  }else {
                      this.loginForm.randomStr = this.randomStr;
                       let data = this.loginForm;
                      loginByUsername(data).then(res=>{
                          if(res.success){
                              let trans = res.data;
                              setToken(trans);
                              this.$store.commit('SET_ACCESS_TOKEN', trans);
                              this.$store.commit('CLEAR_LOCK');
                              this.$store.commit("ADD_TAG", this.tagWel);
                                      this.$router.push({ path: this.tagWel.value });
                          }else{
                              this.$message.error(res.message);
                          }
                      }).catch(err=>{
                          errInfo.err(err);                  
                      });  
                  }
          },
          middleStep(){
                    if( !this.mobilePhone ){
                         this.$message.error('请输入邮箱。');
                      }else {
                            if( !this.mobilePSW ){
                                this.$message.error('请输入验证码。');
                            }else{
                                  this.showAccountLogin =false;
                                  this.showNext = false;
                                  this.showFinish = true;
                                  this.btnText = '完成';
                                  this.welcomeCn = '修改密码';
                                  this.welocomEn = 'MODIFY PASSWORD';
								this.email = this.mobilePhone;
								
                            }
                      }
          },
          resetPsw(){
//                            if(!this.email){
//                               this.$message.error('请输入邮箱。');
//                            }else {
                                if( !this.mobileNPsw ){
                                   this.$message.error('请输入新密码。');
                                }else if ( this.mobileNPsw !== this.mobileNPswAgain  ){
                                    this.$message.error('新密码不一致。');
                                }else {
                                    if( this.mobileNPsw.length < 6 ){
                                       this.$message.error('密码长度不小于6位。');
                                    }else{
                                        let data = {
                                              email:this.email,
                                              code:this.mobilePSW,
                                              newPassword:this.mobileNPsw,
                                              emailSendType:'FORGET_PASSWORD'
                                          };
                                        apiTwo.forgetLoginPassword(data).then(res=>{
                                            if(res.success){
                                                this.$message({
                                                  message: '修改成功。',
                                                  type: 'success'
                                                });
                                                this.mobilePhone = '';
                                                this.mobilePSW = '';
                                                this.email = '';
                                                this.mobileNPsw = '';
                                                this.mobileNPswAgain = '';
                                                this.picCode = '';                                                     
                                                this.showAccountLogin = true;
                                                  this.showFinish = false;
                                                this.showNext = false;
                                                this.btnText = '登录';
                                                this.welcomeCn = '欢迎，登录';
                                                this.welocomEn = 'WELCOME TO LOGIN';
												this.timerNumer = 60;
                                            }else {
                                                this.$message.error(res.message);
                                            }
                                          }).catch(err=>{
                                              errInfo.err(err);
                                          })
                                    }
                                }
								
								
								
								
//							}
          },
          loginAction(){
              if ( this.showAccountLogin ){
                   //登录
                    this.login(); 
              } else if( this.showNext ){
                  this.middleStep();
              } else {
                      //显示完成
                    this.resetPsw();       
              }              
          },
      }
    };
</script>

<style lang="scss">
     .login-container {
         .homefixed {
            font-size: 12px;
            line-height: 28px;
            letter-spacing: 0.3px;
            color: #979cb2;
            width: 280px;
            margin: 0 auto;
            margin-top: 2em;
         }
          background: rgba(0, 0, 0, 0);
            min-height: 100%;
            background-image: url('../../../static/img/ui/login_1@2x.png');
            background-repeat: no-repeat;
            background-position-x: 50%;
            background-position-y: 50%;
            background-size: cover;
         .login-left {
             
             @media all and (max-width:1400px){
                    padding-top: 50px;
                        padding-left: 100px;
                        width: 440px;
            }
             @media all and (min-width:1401px) and (max-width:1600px){
                    padding-top: 70px;
                    padding-left: 120px;
                    width: 470px;
            }
                    @media all and (min-width:1601px){
                        padding-top: 90px;
                        padding-left: 120px;
                        width: 490px;
                    }
            }
         .login-left-con-head {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
                .login-left-headimg {
                    @media all and (max-width:1400px){
                        width: 130px;
                    }
                    @media all and (min-width:1401px) {
                        width: 150px;
                    }   
                }
                .login-left-title {
                    letter-spacing: 3px;
                        color: #21223f;
                    @media all and (max-width:1400px){
                         margin-left: 30px;
                         font-size: 18px;
                        letter-spacing: 2px;
                    }
                    @media all and (min-width:1401px) and (max-width:1500px){
                        margin-left: 30px;
                         font-size: 20px;
                    }
                    @media all and (min-width:1501px){
                        margin-left: 40px;
                         font-size: 22px;
                     }
                }  
            }
         
         .backNextCon {
             text-align: center;
             color: #c8cad7;
             cursor: pointer;
             margin-top: 1em;
             font-size: 14px;
         }
         .backFinishCon {
             width: 50%;
             margin: 0 auto;
             margin-top: 1em;
             font-size: 14px;
             display: flex;
             flex-direction: row;
             flex-wrap: nowrap;
             justify-content: space-around;
             align-content: center;
             align-items: center;
             color: #c8cad7;
             .backLogin {
                 margin-right: 0;
             }
             div {
                 cursor: pointer;
             }
         }
         
         .form {
             @media all and (max-width:1400px){
                 margin-top: 5%;
             }
             @media all and (min-width:1401px) and (max-width:1500px) {
                margin-top: 8%;
            }
             @media all and (min-width:1501px){
                 margin-top: 10%;
             }
         }
         .forget {
             text-align: right;
             color: #6479ff;
             cursor: pointer;
             @media all and (max-width:1500px) {
                margin-top: 4%;
                 font-size: 14px;
            }  
             @media all and (min-width:1501px){
                 margin-top: 10px;
             }
         }
         .welcome-con {
             @media all and (max-width:1400px){
                 margin-top: 20%;
             }
             @media all and (min-width:1401px) and (max-width:1500px){
                margin-top: 24%;
            }  
             @media all and (min-width:1501px){
                 margin-top: 30%;
             }
         }
         .welcome-con-cn {
            font-weight: 600;
             @media all and (max-width:1400px){
                 font-size: 26px;
                letter-spacing: 0.7px;
                 line-height: 26px;
                color: #21223f;
             }
             @media all and (min-width:1401px) and (max-width:1500px) {
                font-size: 30px;
                 line-height: 30px;
                letter-spacing: 0.7px;
                color: #21223f;
            }  
             @media all and (min-width:1501px) {
                font-size: 34px;
                 line-height: 34px;
                letter-spacing: 0.7px;
                color: #21223f;
            } 
         }
         .welcome {
             color: #c8cad7;
             @media all and (max-width:1400px){
                 margin-top: 5px;
                font-size: 12px;
                letter-spacing: 1.5px;
             }
             @media all and (min-width:1401px) and (max-width:1500px) {
                margin-top: 7px;
                font-size: 12px;
                letter-spacing: 2.6px;
            }  
             @media all and (min-width:1501px){
                margin-top: 9px;
                font-size: 12px;
                line-height: 23px;
                letter-spacing: 2.6px;
             }
        } 
         .login-btn {
             text-align: center;
             cursor: pointer;
                background-image: linear-gradient(to right,#767efd,#48a3fc);
                color: #fff;
                border-radius: 1.5em;
                margin: 0 auto;
                box-shadow: 0 1.5em 1.5em -0.8em rgba(72,163,252,0.3);
                width: 15em;
                height: 3em;
                line-height: 3em;
             @media all and (max-width:1400px){
                 margin-top: 50px;
             }
             @media all and (min-width:1401px) and (max-width:1500px) {
                 margin-top: 50px;
            }  
             @media all and (min-width:1501px){
                 margin-top: 40px;
             }
        }
         .mobile-con {
             position: relative;
             .sendSmCode,.timer {
                 position: absolute;
                 right: 0;
                 bottom: 33%;
                 color: #6479ff;
                 cursor: pointer;
                 @media all and (max-width:1500px) {
                    margin-top: 4%;
                     font-size: 14px;
                }  
                 @media all and (min-width:1501px){
                     margin-top: 10px;
                 }
             }
         }
         .form {
             input {
                 width: 100%;
                display: block;
                border: none;
                border-bottom: 2px solid #b2bcff;
                background-color: transparent;
                 font-size: 1em;
                padding-bottom: 1.1em;
                 font-size: 20px;
                letter-spacing: 1px;
                color: #555;
                 @media all and (max-width:1400px){
                     font-size: 16px;
                 }
                 @media all and (min-width:1401px) and (max-width:1500px) {
                        font-size: 18px;
                    } 
                 @media all and (min-width:1501px){
                     font-size: 20px;
                 }
             }
            input:nth-child(2) {
                margin-top: 2em;
            }
             .account-loginCon-psw {
                 margin-top: 2em;
             }
             .mobile-loginCon {
                 margin-bottom: 5.2em;
                 input {
                     margin-top: 2em;
                 }
             }
             
             .specialCode {
                 margin-top: 2em;
             }
             
             .picCode {
                 width: 100%;
                 border-bottom: 2px solid #b2bcff;
                 
                 position: relative;
                 input {
                     border: none;
                 }
                 .picCodeInput {
                     width: 60%;
                     display: inline-block;
                 }
                 .picImg {
                     width: 25%;
                     position: absolute;
                     bottom: 25%;
                     display: inline-block;
                 }
                 .refresh {
                     display: inline-block;
                     position: absolute;
                     right: 0;
                     bottom: 20%;
                     color: #6479ff;
                     cursor: pointer;
                 }
             }
         }
    }
</style>