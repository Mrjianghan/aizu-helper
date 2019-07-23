<template>
  <div class="menu-wrapper">
    <div v-for="(item,index) in menu" :key="index">
      <el-menu-item v-if="item.children.length===0 " :index="filterPath(item.path,index)" @click="open(item)" :key="item.name">
        <i :class="item.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
        
      <el-submenu v-else :index="filterPath(item.name,index)" :key="item.name">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title"  :class="{'el-menu--display':isCollapse}">{{item.name}}</span>
        </template>
        <template v-for="(child,cindex) in item.children">
          <el-menu-item :index="filterPath(child.path,cindex)" @click="open(child)" v-if="child.children.length==0" :key="cindex">
              <i class="icon-font"></i>
            <span slot="title">{{child.name}}</span>
          </el-menu-item>
          <sidebar-item v-else :menu="[child]" :key="cindex" :isCollapse="isCollapse"></sidebar-item>
        </template>
      </el-submenu>
    </div>
      
<!--
     <template v-for="(item,index) in menu">
        
      <el-menu-item v-if="item.children.length===0 "  :index="filterPath(item.path,index)" @click="open(item)" :key="item.name">
        <i :class="item.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>

      <el-submenu v-else :index="filterPath(item.name,index)" :key="item.name">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title"  :class="{'el-menu--display':isCollapse}">{{item.name}}</span>
        </template>
        <template v-for="(child,cindex) in item.children">
          <el-menu-item :index="filterPath(child.path,cindex)" @click="open(child)" v-if="child.children.length==0" :key="cindex">
            <i :class="child.icon"></i>
            <span slot="title">{{child.name}}</span>
          </el-menu-item>
          <sidebar-item v-else :menu="[child]" :key="cindex" :isCollapse="isCollapse"></sidebar-item>
        </template>
      </el-submenu>
    </template> 
-->



  </div>
</template>
<script>
    import storejs from 'store';
    import { resolveUrlPath } from "@/util/util";
    import { mapGetters } from 'vuex'
    import { mapMutations } from 'vuex'
    export default {
      data() {
        return {
            homeactive:false
        };
      },
      props: {
        menu: {
          type: Array
        },
        isCollapse: {
          type: Boolean
        }
      },
      mounted() {},
      computed: {
          ...mapGetters([
          'homeopen',
            'homeshowtag',
          ])
      },
      methods: {
        filterPath(path, index) {
          return path == null ? index + "" : path;
        },
        open(item) {
               this.$store.commit('switchhometag',true);
               storejs.set('homeTagshow',true);
              this.$router.push({
                path: resolveUrlPath(item.path, item.name)
              });
        }
      }
    };
</script>

<style lang="scss">
     .menu-wrapper .el-menu-item {
        background-color: #21223f !important;
    }
</style>
<style lang="scss" scoped>
        .menu-wrapper .el-menu-item.is-active{
            color: #6479ff!important;
            background-color: #32334e!important;
            border-right:6px solid #6479ff;
        }
        .home {
            height: 56px;
            line-height: 56px;
            background-color: #21223f;
            cursor: pointer;
            color: rgba(255, 255, 255, 0.65);
            .iconfont {
                color: #8c8d9a;
                font-size: 18px;
                margin-left: 23px;
                margin-right: 7px;
            }
            span {
                font-size: 14px;
                letter-spacing: 27px;
            }
        }
        .homeon {
            color: #6479ff!important;
            background-color: #32334e!important;
            border-right:6px solid #6479ff;
            .iconfont {
                color: #6479ff;
            }
        }
</style>