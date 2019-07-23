<template>
  <div class="pull-height animated" :class="{'zoomOutUp': isLock}">
    <div class="index">
      <sidebar class="left">
      </sidebar>
      <div class="right">
        <div class="switch-collapse"  @click="showCollapse">
          <i class="icon-font  icon-leftbar_- " :class="{rotate:rotateOn}"></i>
      </div>
        <div class="nav">
          <top></top>
          <tags></tags>
        </div>
        <div class="main">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tags from "./tags";
import top from "./top/";
import sidebar from "./sidebar/";
export default {
  components: {top,tags,sidebar},
  data() {
    return {
      rotateOn:false,
    };
  },
  computed: mapGetters(["isLock"]),
  methods: {
      showCollapse() {
          this.$store.commit("SET_COLLAPSE");
          this.rotateOn = !this.rotateOn;
      },
  }
};
</script>
<style lang="scss" scoped>
        .index {
          display: flex;
          position: relative;
          height: 100%;
          background: #fff;
          overflow: hidden;
          .left {
            width: 230px;
            overflow-y: scroll;
            overflow-x: hidden;
            padding-bottom: 100px;
          }
          .rotate {
                transform: rotate(180deg);
                transition: all 0.5s;
            }
          .right {
            position: relative;
            flex: 1;
            .switch-collapse {
                position: absolute;
                cursor: pointer;
                left: -8px;
                z-index: 1000;
                top:48%;
                color: #fff;
                height: 70px;
                width: 20px;
                background-image: url('../../../static/img/ui/littlebar.png');
                border-bottom-right-radius: 25px;
                border-top-right-radius: 25px;
                .icon-font {
                    position: absolute;
                    top: 15px;
                    left: 0;
                }
            }
          }
      .main {
        height: 100%;
        overflow-y: scroll;  
        background-color: #f9f9fc;  
      }
      .nav {}
      .top {}
}
</style>