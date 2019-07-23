<template>
  <div class="groupRightContainer">
	  <div class="left">
		  <div class="leftInner">
			  <div class="treeTitle">集团架构</div>
			  <div class="treeBody">
				  <myTree :treeArray="treeArr" @click.native.stop="outClick($event)"></myTree>
			  </div>
		   </div>
		</div>
	  <div class="right">
		  <div class="rightInner">
			  <div class="treeTitle">管理分配 <span v-show="companyName">—</span> {{companyName}}</div>
			  <div class="transferCon">
				  <myTransfer :leftArray="leftArr" :rightArray="rightArr" :showIcon="showOrnot" @leftClick="leftGet($event)" @rightClick="rightGet($event)"></myTransfer>
				</div>
		   </div>		  
		</div>
  </div>
</template>
<script>  
    import errInfo from '@/api/errInfo'
    import apiTwo from '@/api/reqApiTwo';
    import api from '@/api/reqApi';
    import day from 'dayjs';
    import storejs from 'store';  
    export default {
        data(){
            return {
				selectId:'',
				companyName:'',
				treeArr:[],
				leftArr:[],
				rightArr:[],
				showOrnot:false,
            }
        },
        mounted(){      
			this.getCompany();
        },  
		destroyed(){
			this.$store.commit('setTreeIndex','1');
		},
        methods:{	
			leftGet(id){
				console.log('out',id);
				
				apiTwo.groupAllocation(
					{
						enterpriseId:this.selectId ? this.selectId : '',
						userId:id,
						add:true
					}
				).then(res=>{
					if(res.success){       
						this.getTwinArr();
                    }else{
                        this.$message.error(res.message);
                    }	
				}).catch(err=>{
					errInfo.err(err);  
				});
				
				
			},
			rightGet(id){
				console.log('out',id);
				
				apiTwo.groupAllocation(
					{
						enterpriseId:this.selectId ? this.selectId : '',
						userId:id,
						add:false
					}
				).then(res=>{
					if(res.success){       	
						this.getTwinArr();
                    }else{
                        this.$message.error(res.message);
                    }	
				}).catch(err=>{
					errInfo.err(err);  
				});
				
			},
			getTwinArr(){
				apiTwo.queryMyEpAllocationDetail(
					{
						enterpriseId:this.selectId ? this.selectId : '',
					}
				).then(res=>{
					if(res.success){            
						this.leftArr = res.data.normalList;
						this.rightArr = res.data.perpermissionList;
                    }else{
                        this.$message.error(res.message);
                    }	
				}).catch(err=>{
					errInfo.err(err);  
				});
			},
			getCompany(){				
				let permissions = storejs.get('userInfo').permissions;
				  let senser = permissions.some(ele=>{
					  return ele == '68';
				  })
				console.log(senser);				
				if(senser){
				   this.showOrnot = true;
				}else{
				   this.showOrnot = false;
				}				
				apiTwo.queryMyEpAllocation().then(res=>{
					if(res.success){						
						if( res.data ){
							console.log( res.data );
							this.treeArr = res.data;
							this.selectId = res.data[0].id;
							this.companyName = res.data[0].name;
							this.getTwinArr();
						}
                    }else{
                        this.$message.error(res.message);
                    }	
				}).catch(err=>{
					errInfo.err(err);  
				});				
				
			},
			outClick($event){				
				let id = $event.target.dataset.id;
				console.log('外边点击',id);
				if(id){
				   this.$store.commit('setTreeIndex',id);
					let name = $event.target.dataset.name;
					this.companyName = name;
					this.selectId = id;
					this.getTwinArr();
				}
			},
		}            
    }  
</script>
<style lang="scss" scoped>
	.groupRightContainer {	
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-content: center;
		align-items:flex-start;
		padding-left: 60px;
        padding-right: 60px;	
		padding-bottom: 150px;
		.left {
			margin-top: 36px;
			width: 40%;
			background-color: #fff;
			border-radius: 12px;
			padding: 50px;
			box-sizing: border-box;			
			overflow: auto;
			.leftInner {
				min-width: 450px;
				border-radius: 12px;
			}
		}
		.right {
			margin-top: 36px;
			width: 60%;
			background-color: #fff;
			border-radius: 12px;
			margin-left: 20px;
			padding: 50px;
		}
		.rightInner {
			width: 80%;
			margin: 0 auto;
		}
		.treeTitle {
			margin-bottom: 20px;
			font-size: 16px;
			font-weight: 600;
		}
	}
</style>
<style lang="scss">
	.groupRightContainer {		
	}
</style>