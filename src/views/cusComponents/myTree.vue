<template>
    <div class="myTreeContainer">		
		<div v-for="(val,index) in treeArray" :key="index">			
				<div class="treeName" :data-id="val.id"  :data-layer="val.layer" :data-name="val.name" :class="{activeTree:(treeIndex == val.id) ? true : false }"><i class="icon-font icon-tubiao-1" :data-layer="val.layer" :class="['icon'+val.layer]"></i>{{val.name}}</div>			
				<div v-if="val.children" class="treeSub">			
					<myTree :treeArray="val.children"></myTree>
				</div>	
		</div>
    </div>
</template>
<script>
	import { mapGetters } from 'vuex';
    export default {
		name:'myTree',
		props:{
			treeArray:Array,
		},
		computed:{		
			...mapGetters([
			  'treeIndex',			 
			])
		},
        data() {
            return {	
            };
        },
        mounted(){
        },
        methods: {	
        },
    }
</script>
<style scoped lang="scss">
	.myTreeContainer {
		.treeName {
			color: #979cb2;
			cursor: pointer;
			padding-top: 10px;
			padding-bottom: 10px;
			font-size: 14px;
			&:hover {
				color: #21223f;
				background-color: #f9f9fc;
			}
			.icon-font {
				font-size: 12px !important;
				margin-right: 4px;
				vertical-align: 2px;
			}
			.icon1,.icon11,.icon21{
				color: #feb64d;
			}
			.icon2,.icon12,.icon22{
				color: #6c79e0;
			}
			.icon3,.icon13,.icon23{
				color: #ffbec5;
			}
			.icon4,.icon14,.icon24{
				color: #84d387;
			}
			.icon5,.icon15,.icon25{
				color: #ffdf47;
			}
			.icon6,.icon16,.icon26{
				color: #7bd3fc;
			}
			.icon7,.icon17,.icon27{
				color: #f17171;
			}
			.icon8,.icon18,.icon28{
				color: #9d8ce2;
			}
			.icon9,.icon19,.icon29{
				color: #d38d7b;
			}
			.icon10,.icon20,.icon30{
				color: #61d7b5;
			}
		}
		.treeSub {
			padding-left: 40px;
			border-left: 2px dashed #e6e1e1;
		}
		.activeTree {
			color: #21223f;
			background-color: #f9f9fc;
		}
	}
</style>