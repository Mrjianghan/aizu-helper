<template>
	<div id="app">
			<router-view></router-view>
	</div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
    };
  },

};
</script>
<style lang="scss">
#app {
  height: 100%;
    -webkit-font-smoothing: antialiased;
    font-family: PingFang SC,Microsoft YaHei,BlinkMacSystemFont,Helvetica Neue,Hiragino Sans GB,Arial,sans-serif;
}
/*
    input:-webkit-autofill {
         -webkit-box-shadow: 0 0 0px 1000px #fff inset;
    }
    input[type=text]:focus, input[type=password]:focus, textarea:focus {
          -webkit-box-shadow: 0 0 0 1000px #fff inset;
    }
*/
</style>