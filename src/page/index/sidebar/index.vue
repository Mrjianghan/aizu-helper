<template>
  <div class="sidebar-container" :class="{'is-active':isCollapse}">
    <logo :isCollapse="isCollapse"></logo>
    <el-menu unique-opened :default-active="nowTagValue" class="el-menu-vertical-demo" mode="vertical" :show-timeout="200" background-color="#00142a" text-color="hsla(0,0%,100%,.65)" active-text-color="#409eff" :collapse="isCollapse">
       <sidebar-item :menu="menu" :isCollapse="isCollapse">
      </sidebar-item> 
<!--
      <sidebar-item :menu="MENU" :isCollapse="isCollapse">
      </sidebar-item>
-->
    </el-menu>    
  </div>
</template>
<script>
import MENU from "@/mock/menu";
import { setUrlPath } from "@/util/util";
import { mapGetters } from "vuex";
import { mapMutations } from 'vuex'
import SidebarItem from "./sidebarItem";
import logo from "./logo";
    
export default {
  components: { SidebarItem, logo },
  data() {
    return {
        rotateOn:false,
        MENU
    };
  },
  computed: {
    nowTagValue: function() {
      return setUrlPath(this.$route);
    },
    ...mapGetters([
          'tag',
          'isCollapse',
          'menu'
      ])
  },
  mounted (){	  
//     this.$store.dispatch("GetMenu").then(res => {
//     }).catch(err => {
//     });
  },
  methods: {
      showCollapse() {
          this.$store.commit("SET_COLLAPSE");
          this.rotateOn = !this.rotateOn;
      },
  }
};
</script>
<style lang="scss" scoped>
    .sidebar-container{
        position: relative;
        z-index: 300;
        width: 230px;
       background-color: #21223f;
    }   
    .test {
        width: 200px;
        height: 100px;
        background-color: #fff;
    }
</style>
<style>
    .sidebar-container .is-active {
        min-width: 70px !important;
    }
    .sidebar-container .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 100%;
    }
</style>