<template>
    <div class="myTransferContainer">		
		<div class="leftTransfer">
			<div class="leftTransferTitle">可选管理员</div>
			<div class="leftScroller">
				<template v-for="(val,index) in leftArray">
					<div class="itemCon">
						<i class="icon-font icon-jcxx_-6" @click="toRight(val.id)" v-if="showIcon"></i>
						<span>{{val.name}}</span>						
					</div>					
				</template>
			</div>
		</div>
		<div class="icon">
			<i class="icon-font icon-zhuanhuan-"></i>
		</div>
		<div class="rightTransfer">
			<div class="rightTransferTitle">已选管理员</div>
			<div class="rightScroller">
				<template v-for="(val,index) in rightArray">
					<div class="itemCon">
						<i class="icon-font icon-jianhao-" @click="toLeft(val.id)" v-if="showIcon"></i>
						<span>{{val.name}}</span>
					</div>	
				</template>
			</div>
		</div>
    </div>
</template>
<script>
	import { mapGetters } from 'vuex';
	
    export default {
		name:'myTransfer',
		props:{
			leftArray:Array,
			rightArray:Array,
			showIcon:Boolean,
		},
		computed:{		
			...mapGetters([
			  			 
			])
		},
        data() {
            return {	
            };
        },
        mounted(){
        },
        methods: {	
			toRight(id){
				this.$emit('leftClick',id);
			},
			toLeft(id){
				this.$emit('rightClick',id);
			},
        },
    }
</script>
<style scoped lang="scss">
	.myTransferContainer {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content:space-between;
		align-content: center;
		align-items: center;
		.leftTransfer {
			height: 550px;
			width: 40%;
			border: 2px solid #fbfbfb;
			box-sizing: border-box;
			.leftTransferTitle {
				height: 50px;
				background-color: #f9f9fc;
				font-weight: 600;
				line-height: 50px;
				padding-left: 20px;
				font-size: 15px;
			}
		}
		.rightTransfer {
			height: 550px;
			width: 40%;
			border: 2px solid #fbfbfb;
			box-sizing: border-box;
			.rightTransferTitle {
				font-size: 15px;
				height: 50px;
				background-color: #f9f9fc;
				font-weight: 600;
				line-height: 50px;
				padding-left: 20px;
			}
		}
		.icon-zhuanhuan- {
			width: 30px;
			height: 30px;
			font-size: 30px !important;
			color: #6479ff;
			font-weight: 600;
		}
		.leftScroller {
			overflow-y: auto;
			height: 490px;
			.icon-font {
				color:#2ac16a;
			}
		}
		.rightScroller  {
			overflow-y: auto;
			height: 490px;
			.icon-font {
				color: #e85050;
			}
		}
		.itemCon {
			height: 50px;
			line-height: 50px;
			font-size: 15px;
			padding-left: 20px;
			cursor: pointer;
			color: #979cb2;
			&:hover {
				background-color: #f9f9fc;
			}			
			.icon-font {
				font-size: 15px !important;
				margin-right: 6px;
				font-weight: 600;
			}
		}
	}
</style>