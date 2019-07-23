<template>
      <div class="logo" :class="{trans:trans,conut:!trans}">
        <transition name="fade">
          <div v-if="isCollapse" class="logo_title  is-bold is-active" key="0">
              <img :src="companyLogo ? companyLogo : defaultLogo">
          </div>
        </transition>
        <transition-group name="fade">
            <template v-if="!isCollapse">
                <img :src="companyLogo ? companyLogo : defaultLogo" :key="1">
              <div class="logo_subtitle" key="2">工资宝企业管理系统</div>
            </template>
        </transition-group>
    </div>
</template>

<script>
    import errInfo from '@/api/errInfo'
    import { mapGetters  } from 'vuex'
    import storejs from 'store';
    import apiTwo from '@/api/reqApiTwo'; 
    export default {
      data() {
        return {
            leftBarLogo:'',
            trans:false,
            defaultLogo:require('../../../../static/img/ui/leftbar_logo@2x.png'),
        };
      },
        computed: {
          ...mapGetters({
              companyLogo:'companyLogo'
          })
        },
      props: ["isCollapse"],
      methods: {
          getInfo(){
                apiTwo.getMyEnterpriseLogo().then(res=>{
                    if(res.success){
                        let final = res.data;
                        storejs.set('companyLogo',final); 
                        this.$store.commit('changeLogo', final);
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                   errInfo.err(err); 
                })
            },
      },
        mounted(){
            this.getInfo();
        },
        watch:{
            isCollapse(val,nval){
                console.log(val);
                let logo = document.querySelector('.logo');
                console.log(logo);
                if(nval){
                   this.trans = false;
                }else {
                    this.trans = true;
                }
            }
        }
    };
</script>
<style scoped lang="scss">
    .fade-leave-active {
      transition: opacity 0.2s;
    }
    .fade-enter-active {
      transition: opacity 2.5s;
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
    .trans {
        background-color: transparent!important;
        transition: all 0.5s;
        overflow: hidden;
        width: 70px!important;
    }
    .conut {
        transition: all 0.6s;
        width: 230px!important;
    }
    .logo {
          z-index: -10;
          position: relative;
          width: 230px;
          padding-top: 60px;
          height: 200px;
          background: #21223f;
          color: #fdfdfd;
          text-align: center;
          box-sizing: border-box;
    }
    img {
        display: inline-block;
        margin-bottom: 13px;
        height: 48px;
        line-height: 48px;
        width: 48px;
    }
    .logo_title {
      left: -5px !important;
    }
    .is-active {
      position: absolute;
      top: 60px;
      left: 10px;
    }
    .logo_subtitle {
      height: 17px;
      line-height: 17px;
    }
</style>