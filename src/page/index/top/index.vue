<template>
  <div class="topcus">
      <div class="varChange">
          <i class="iconfont" :class="titleclass"></i>
          <div class="mar-left"> {{titlename}} </div>
      </div>
      <div class="rightAccountInfo">
          <i class="iconfont icon-home_-7"></i>
          <div class="name">{{currentUser.name}}</div>
          <div class="level">{{currentUser.position}}</div>
          
          <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          
        <el-tooltip class="item" effect="light" content="锁屏" placement="bottom">
        <span class="top-item-self"><top-lock></top-lock></span>
        </el-tooltip>
        <el-tooltip class="item" effect="light" content="退出登录" placement="bottom">
          <i class="iconfont icon-home_-8" @click="logout"></i>
        </el-tooltip>
          <div class="feedBack" @click="feedBack"> <i class="iconfont  icon-fk-"></i>    我要反馈</div>
      </div>
      
      <el-dialog class="passWord"   title="修改密码" :visible.sync="dialogVisible3">
          
          <el-form :model="form" :rules="rules" ref="form" label-width="140px" class="demo-ruleForm">
              
              <el-form-item label="输入旧密码" prop="origin">
                        <el-input type="password" v-model.trim="form.origin"></el-input>
                      </el-form-item>
              <el-form-item label="输入新密码" prop="new">
                        <el-input type="password" v-model.trim="form.new" @blur="checkNew"></el-input>
                      </el-form-item>
              <el-form-item label="再次输入新密码" prop="newAgain">
                        <el-input type="password" v-model.trim="form.newAgain" @blur="checkOk"></el-input>
                      </el-form-item>
              
         </el-form>
          <div class="editBtnContainer">
              <div  @click="edit('form')">修改</div>
          <div @click="cancel('form')">取消</div>
            </div>
          
          
      </el-dialog>
      
      <el-dialog class="details"   title="反馈" :visible.sync="dialogVisible4">
          <div class="feedBackContainer">
              <div class="fir" :class="{cusactive:firOn}" @click="firClick">我要反馈</div>
              <div class="sec" :class="{cusactive:secOn}" @click="secClick">我的反馈</div>
          </div>
          <div class="contentContainer">
              <div v-show="firOn">
                  <el-input
                      type="textarea"
                        :rows="14"
                      placeholder="请输入内容"
                      v-model="otherContent">
                    </el-input>
                    <div class="submitContainer">
                        <div @click="submitThiInput">提交</div>
                        <div @click="dialogVisible4 = false;otherContent = ''">取消</div>
                    </div>
                </div>
              <div v-show="secOn">
                  <div v-if="myFeedBack.length>0" >
                      <div class="loopCon">
                          <div class="loolFor" v-for="(val,i) in myFeedBack">
                              <div class="feedbackHeadCon">
                                  <div class="time">{{val.gmtCreate.split(' ')[0]}}</div>
                            </div>
                            <div class="content">{{val.description}}</div>
                        </div>
                    </div>
                      <div class="pagCon">
                          <el-pagination
                                @current-change="size1Change"
                            layout="prev, pager, next"
                            :total="size1Total"
                            :page-size="10">
                          </el-pagination>
                        </div>
                    </div>
                  <div class="else" v-else>暂无反馈</div>                  
                </div>
            </div>
      </el-dialog>
<!--
    <div class="top-button is-left">
      <div class="tags-breadcrumb">
        <i class="icon-navicon tag-collapse" :class="[{ 'tag-collapse_right': isCollapse }]" @click="showCollapse"></i>
      </div>
    </div>
   
    <div class="top-button is-right">
      <el-dropdown @command="handleCommand" class="change-lang">
        <span class="el-dropdown-link">
          {{lang}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="CN">中文</el-dropdown-item>
          <el-dropdown-item command="EN">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tooltip class="item" effect="dark" content="主题色" placement="bottom">
        <span class="top-item">
          <top-theme></top-theme>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="锁屏" placement="bottom">
        <span class="top-item">
          <top-lock></top-lock>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="isFullScren?'退出全屏':'全屏'" placement="bottom">
        <span class="top-item">
          <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'" @click="handleScreen"></i>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="用户头像" placement="bottom">
        <img class="top-userImg" :src="userInfo.avatar">
      </el-tooltip>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/">首页</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/info/index">修改信息</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
-->
      
  </div>
</template>

<script>
        import errInfo from '@/api/errInfo'
        import { mapState, mapGetters } from "vuex";
        import { fullscreenToggel, listenfullscreen } from "@/util/util";
        import { setStore, getStore } from '@/util/store'
        import topLock from "./top-lock";
        // import topMenu from "./top-menu";
        import topTheme from "./top-theme";
        import apiTwo from '@/api/reqApiTwo'
        import {getToken,removeToken } from '@/util/auth'
        import storejs from 'store'
    
    
        export default {
        components: { topLock, topTheme },
          data() {
            return {
                dialogVisible4:false,
                lang: getStore({name:'lang1'})=='en'?'English':'中文',
                titlename:'首页',
                titleclass:'icon-home_-4',
                currentUser:{
                    name:'',
                    position:''
                },
                firOn:true,
                secOn:false,
                thiOn:false,
                otherContent:'',
                myFeedBack:[],
                allFeedBack:[],
                size2Total:1,
                size1Total:1,
                current1:1,
                current2:1,
                dialogVisible3:false,
                twoPasswordSame:false,
                form:{
                  origin:'',  
                  new:'',
                    newAgain:''
                },
                rules: {
                    origin:[{ required: true, message: '请输入旧密码', trigger: 'blur' },
                        { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }],
                    new:[{ required: true, message: '请输入新密码', trigger: 'blur' },
                        { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }],
                     newAgain:[{ required: true, message: '请输入新密码', trigger: 'blur' },
                        { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }]
                }

                };
                  
                  
                  
        
                  
                  
          },
          mounted() {
            listenfullscreen(this.setScreen);
            let info = storejs.get("userInfo");
              this.currentUser = {
                    name:info.name,
                    position:info.roleName
              }
          },
          computed: {
            ...mapState({
              userInfo: state => state.user.userInfo
            }),
            ...mapGetters(["isFullScren", "isCollapse"])
          },
            watch:{
                $route:function(to,from){
                    this.titlename = to.meta.name;
                    this.titleclass = to.meta.icon;
                },
            },
          methods: {
              edit(form){
                  if( this.twoPasswordSame  ){
                      this.$refs[form].validate((valid) => {
                          if (valid) {
                              let data = {
                                  oldPassword:this.form.origin,
                                  newPassword:this.form.new
                              };
                            apiTwo.updatekLoginPassword(data).then(res=>{
                                if(res.success){
                                    this.$message({
                                          message: '修改成功',
                                          type: 'success'
                                        });
                                    this.dialogVisible3 = false; 
									this.form = {
										  origin:'',  
										  new:'',
											newAgain:''
										};
                                }else{
									this.$message.error(res.message);
								}
                            }).catch(err=>{
                                errInfo.err(err); 
                            })
                          } else {
                            return false;
                          }
                      })
                  }else{
                     this.$message.error('新密码不一致');
                  }
              },
              cancel(form){
                  this.$refs[form].resetFields();
                  this.dialogVisible3 = false;   
              },
              checkNew(){
                  if( this.form.newAgain==='' ){
                     this.twoPasswordSame = false;
                      console.log( '下面为空' );
                  }else{
                      if( this.form.new === this.form.newAgain  ){
                         this.twoPasswordSame = true;
                      }else{
                         this.twoPasswordSame = false;
                          this.$message.error('新密码不一致');
                      }
                  }
              },
              checkOk(){
                  if( this.form.new === this.form.newAgain  ){
                     this.twoPasswordSame = true;
                  }else{
                     this.twoPasswordSame = false;
                      this.$message.error('新密码不一致');
                  }
              },
              handleCommand(command) {
                  this.dialogVisible3 = true;
              },
              size1Change(val){
                this.current1 = val;
                  this.myFeedSizeChange();
                },
              size2Change(val){
                  this.current2 = val;
                  this.allFeedSizeChange();
            },
              submitThiInput(){
                  if(  this.otherContent.trim().length  ){
                      let data = {
                          description:this.otherContent
                      };
                      apiTwo.addFeedback(data).then(res=>{
                          if(res.success){
                              this.$message({
                                  message: '提交成功',
                                  type: 'success'
                                });
                              this.otherContent = '';
                              this.dialogVisible4 = false;
                          }else{
                              this.$message.error(res.message);
                          }
                      }).catch(err=>{
                          errInfo.err(err); 
                      })
                  }else{
                      this.$message.error('不能为空！');
                  }
              },
              firClick(){
                  this.firOn = true;
                    this.secOn = false;
                    this.thiOn = false;
              },
              myFeedSizeChange(){
                  let data = {
                        current:this.current1
                    };
                    apiTwo.queryMyFeedback(data).then(res=>{
                        if(res.success){
                            let trans = res.data;
                            this.myFeedBack= trans.records;
                            this.size1Total = trans.total;
                        }else{
                            this.$message.error(res.message);
                        }
                    }).catch(err=>{
                        errInfo.err(err); 
                    })
              },
              allFeedSizeChange(){
                  let data = {
                        current:this.current2
                    };
                    apiTwo.queryAllFeedback(data).then(res=>{
                        if(res.success){
                            let trans = res.data;
                            this.allFeedBack= trans.records;
                            this.size2Total = trans.total;
                        }else{
                            this.$message.error(res.message);
                        }
                    }).catch(err=>{
                        errInfo.err(err); 
                    })
              },
                secClick(){
                    this.firOn = false;
                    this.secOn = true;
                    this.thiOn = false;
                    apiTwo.queryMyFeedback().then(res=>{
                        if(res.success){
                            let trans = res.data;
                            this.myFeedBack= trans.records;
                            this.size1Total = trans.total;
                        }else{
                            this.$message.error(res.message);
                        }
                    }).catch(err=>{
                        errInfo.err(err); 
                    })
                },
              feedBack(){
                  this.dialogVisible4 = true;
              },
            
            showCollapse() {
              this.$store.commit("SET_COLLAPSE");
            },
            handleScreen() {
              fullscreenToggel();
            },
            setScreen() {
              this.$store.commit("SET_FULLSCREN");
            },
            logout() {
              this.$confirm("是否退出系统, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                  let data = {
                      accesstoken:getToken()
                  };
                  apiTwo.quit( data ).then(res=>{
                      this.$store.commit('SET_ACCESS_TOKEN', '');
                      this.$store.commit('SET_USER_INFO','');
                      this.$store.commit('DEL_ALL_TAG');
                      removeToken();
                      this.$router.push({ path: "/login" });
                      storejs.clearAll()
                  }).catch(err=>{
                      console.log(err);
                      this.$store.commit('SET_ACCESS_TOKEN', '');
                      this.$store.commit('SET_USER_INFO','');
                      this.$store.commit('DEL_ALL_TAG');
                      removeToken();
                      this.$router.push({ path: "/login" });
                      storejs.clearAll()
                  })
              });
            }
          }
        };
</script>
<style>
  .change-lang{
    margin-right: 15px;
  }
</style>
<style lang="scss">
    .topcus .el-icon--right {
        color: #6479ff;
        cursor: pointer;
    }
    
    .topcus .editBtnContainer {
            padding-top: 15px;
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
    
    .topcus  .el-dropdown {
        line-height: 20px;
    }
    
    .topcus .details,.passWord .el-dialog__header .el-dialog__title{
        font-size: 13px;
        line-height: 32px;
        color: #6479ff;
    }
    .topcus .contentContainer {}
    .topcus .loopCon {
        height: 320px;
        overflow-y: scroll;
    }
    .topcus  .pagCon {
        margin-top: 10px;
    }
   .topcus .content {
       margin-top: 10px;
       margin-bottom: 10px;
       color: #979cb2;
       font-size: 14px;
    }
    .topcus  .loolFor {
        margin-top: 10px;
        margin-bottom: 10px;
        border-bottom: 1px solid #f2f2f2;
    }
    .topcus .details .else {
        font-size: 14px;
        color: #979cb2;
        text-align: center;
        padding-top: 20px;
    }
    .topcus .feedbackHeadCon {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        .person {
            color: #21223f;
            font-size: 12px;
        }
        .time {
            color: #21223f;
            font-size: 12px;
        }
    }
    .topcus .submitContainer {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        div:nth-child(1){
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
            margin-left: 120px;
        }
        div:nth-child(2){
            background: #fff;
            box-shadow: none;
            color: #6479ff;
            height: 40px;
            line-height: 40px;
            width: 120px !important;
            border: 1px solid #6479ff;
            box-sizing: border-box;
            text-align: center;
            border-radius: 20px;
            margin-right: 120px;
            cursor: pointer;
        }
    }
    .topcus .details .el-dialog__body {
        padding-top: 10px;
        font-size: 16px;
    }
    .topcus .cusactive {
        color: #6479ff;
        position: relative;
            &::after {
                content: "";
                position: absolute;
                top: 30px;
                left: calc( 50% - 10px );
                height: 4px;
                width: 20px;
                background-color: #6479ff;
            }
    }
    .topcus .feedBackContainer {
        display: flex;
        height: 40px;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-content:center;
        align-items: flex-start;
        .fir {
            cursor: pointer;
        }
        .sec {
            margin-left: 20px;
            margin-right: 20px;
            cursor: pointer;
        }
        .thi {
            cursor: pointer;
        }
    }
    .topcus .details .el-dialog{
        border-radius: 10px;
        height: 500px;
        width: 600px;
    }
    .topcus .passWord  .el-dialog{
        border-radius: 10px;
        height:370px;
        width: 450px;
    }

    .topcus {
        height: 56px;
        padding-left: 60px;
        padding-right: 60px;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: nowrap;
        align-content: center;
        align-items: center; 
        z-index: 20;
        display: flex;
        box-sizing: border-box;
        border-bottom: 1px solid #edeef3;
        box-shadow: 0 2px 1px #fafafa;
    }
    .varChange {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }
    .mar-left {
        margin-left: 20px;
        line-height: 40px;
        letter-spacing: 5px;
        font-weight: 600;
        font-size: 16px;
        min-width: 84px;
    }
    .icon-home_-4 {
        color: #6479ff;
        font-size: 20px;
    }
    .icon-home_-7 {
        color: #6479ff;
        font-size: 20px;
        cursor: pointer;
        line-height: 20px;
    }
    .icon-home_-8 {
        color: #6479ff;
        font-size: 20px;
        cursor: pointer;        
        line-height: 20px;
    }
    .icon-- {
        color: #6479ff;
        font-size: 20px;
    }
    .rightAccountInfo {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content:flex-end;
        width: 500px;
        height: 20px;
        .feedBack {
            font-size: 12px;
            color: #6479ff;
            line-height: 20px;
            margin-left: 50px;
            cursor: pointer;
            .icon-fk- {
                color: #6479ff;
                font-size: 12px;
            }
        }
    }
    .name{
        font-size: 12px;
        line-height: 20px;
        margin-left: 14px;
        color: #979cb2;
    }
    .level{
        line-height: 20px;
        font-size: 12px;
        margin-left: 14px;
        color: #6479ff;
    }
    .varChange .iconfont {
        color: #6479ff;
        font-size: 20px;
    }
    .top-item-self {
        margin-right: 50px;
        margin-left: 60px;
        cursor: pointer;
    }
</style>