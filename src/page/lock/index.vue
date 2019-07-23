<template>
  <div class="lock-container pull-height">
      <i class="iconfont icon-sp--2"></i>
    <div class="lock-form animated bounceInDown">
      <div class="animated" :class="{'shake':passwdError,'bounceOut':pass}">
          <div class="inputcon">
              <span>密码</span>
              <input type="password" v-model="passwd" placeholder="请输入解锁密码" autofocus @keyup.enter="handleLogin">
              <i class="iconfont icon-sp--1" @click="handleLogin"></i>
          </div>
      </div>
    </div>
      <div class="quit" @click="handleLogout">
          <div>退出&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <i class="iconfont icon-sp--"></i>
          </div>
      </div>
  </div>
</template>
<script>
        import { mapGetters, mapState } from "vuex";
        import { resolveUrlPath } from "@/util/util";
        import storejs from 'store'
        import apiTwo from '@/api/reqApiTwo'
        import {getToken,removeToken } from '@/util/auth'
        export default {
          data() {
            return {
              passwd: "",
              passwdError: false,
              pass: false,
            };
          },
          computed: {
            ...mapState({
              userInfo: state => state.user.userInfo
            }),
            ...mapGetters(["tag", "lockPasswd"])
          },
          props: [],
          methods: {
            handleLogout() {
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
//                this.$store.dispatch("LogOut").then(() => {
//                  this.$router.push({ path: "/login" });
//                });
              });
            },
            handleLogin() {
              if (this.passwd != this.lockPasswd) {
                this.passwd = "";
                this.$message({
                  message: "解锁密码错误,请重新输入",
                  type: "error"
                });
                this.passwdError = true;
                setTimeout(() => {
                  this.passwdError = false;
                }, 1000);
                return;
              }
              this.pass = true;
              setTimeout(() => {
                this.$store.commit("CLEAR_LOCK");
                this.$router.push({ path: resolveUrlPath(this.tag.value || "/") });
              }, 1000);
            }
          }
};
</script>
<style  lang="scss">
    .lock-container {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
        .icon-sp--2 {
            position: absolute;
            left: 60px;
            top: -80px;
            font-size: 180px;
            color: #fff;
        }
    }
        .inputcon {
            border-bottom: 2px solid #fff;
            cursor: pointer;
            span {
                color: #fff;
                font-size: 24px;
            }
            .icon-sp--1 {
                color: #fff;
                font-size: 24px;
            }
            input {
                border: none;
                outline: none;
                background-color: transparent;
                color: #fff;
                font-size: 18px;
                padding-left: 20px;
                width: 235px;
            }
        }
    .quit {
        position: fixed;
        right: 80px;
        bottom: 80px;
        width: 224px;
        height: 70px;
        cursor: pointer;
        border: 1px solid #fff;
        box-sizing: border-box;
        border-radius: 35px;
        text-align: center;
        line-height: 70px;
        font-size: 24px;
        color: #fff;
        .icon-sp-- {
            font-size: 25px;
            line-height: 25px;
            height: 25px;
        }
    }
    .lock-container::before {
      z-index: -999;
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
        background-position: 50% center;
      background-image: url("../../../static/img/ui/lock.jpg");
      background-size: cover;
    }
    .lock-form {
      width: 340px;
    }
</style>
