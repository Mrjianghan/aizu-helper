<template>
  <div class="groupCompanyContainer">
	  <div class="left">
		  <div class="leftInner">
			  <div class="treeTitle">集团架构</div>
			  <div class="treeBody">
				  <myTree :treeArray="treeArr" @click.native.stop="outClick($event)"></myTree>
			  </div>
		   </div>
		</div>
	  <div class="right">
		  <div class="rightTitle">
			  <div class="treeTitle">集团管理</div>
			  <div class="add" @click="popDialog"><i class="icon-font icon-jcxx_-6"></i>新增分公司</div>
		   </div>
		 <div class="rightFormCon">			 
			 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="left">
				  <el-form-item label="公司名称" prop="name">
					<el-input v-model="ruleForm.name"></el-input>
				  </el-form-item>				 
				 <el-form-item label="上级公司" prop="value">
					<el-select v-model="ruleForm.value" placeholder="请选择活动区域" @change="selectChange(ruleForm.value)">						
					  <el-option
						  v-for="item in options"
						  :key="item.value"
						  :label="item.label"
						  :value="item.value">
						</el-option>						
					</el-select>
				  </el-form-item>
				 <el-form-item label="公司电话" prop="phone">
					<el-input v-model="ruleForm.phone"></el-input>
				  </el-form-item>
				 <el-form-item label="联 系 人" prop="contacts">
					<el-input v-model="ruleForm.contacts"></el-input>
				  </el-form-item>
				 <el-form-item label="企业邮箱" prop="email">
					<el-input v-model="ruleForm.email"></el-input>
				  </el-form-item>
				 <el-form-item label="企业地址" prop="address">
					<el-input v-model="ruleForm.address"></el-input>
				  </el-form-item>
				 <el-form-item label="备 注" >
					<el-input type="textarea" :rows="4" resize="none" v-model="ruleForm.memo"></el-input>
				  </el-form-item>
			 </el-form> 
			 <div class="saveBtn" @click="saveBtn('ruleForm')" v-permit="'66'">保存</div>			 
			</div>				  
		</div>  
	  <el-dialog class="addStaffDialog"   title="新增分公司" :visible.sync="dialogAddFormVisible">
            <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-width="100px" class="demo-ruleForm"> 
				<div class="addMenusContainer">
                        <el-form-item label="公司名称" prop="name">
                            <el-input v-model="ruleForm1.name"></el-input>
                          </el-form-item>
                            <el-form-item label="上级公司">		
								<el-input v-model="ruleForm1.region" disabled></el-input>
                          </el-form-item>                            
                           <el-form-item label="公司电话" prop="phone">
                            <el-input  v-model="ruleForm1.phone"></el-input>
                          </el-form-item>
                         <el-form-item label="联系人" prop="contacts">
                            <el-input v-model="ruleForm1.contacts"></el-input>
                          </el-form-item>
                            <el-form-item label="企业邮箱" prop="email">
                            <el-input v-model="ruleForm1.email"></el-input>
                          </el-form-item>
                            <el-form-item label="企业地址" prop="address">
                            <el-input v-model="ruleForm1.address"></el-input>
                          </el-form-item>
						<el-form-item label="备 注" >
						<el-input type="textarea" :rows="4" resize="none" v-model="ruleForm1.memo"></el-input>
					  </el-form-item>
                    </div>                    
                <div class="addBtnContainer" v-permit="'65'">
                    <div @click="submitForm('ruleForm1')">确定</div>
                    <div @click="resetForm('ruleForm1')">取消</div>
                </div>
            </el-form>
        </el-dialog>	  
  </div>
</template>
<script>  
    import errInfo from '@/api/errInfo'
    import apiTwo from '@/api/reqApiTwo';
    import api from '@/api/reqApi';
    import day from 'dayjs';
    import storejs from 'store'; 
	import { mapGetters } from 'vuex'
    export default {
        data(){
            return {
				ruleForm1:{
				},
				rules1:{
					name:{ required: true, message: '请输入名称', trigger: 'blur' },
					phone:[{ message: '请输入', trigger: 'blur', },{ min: 5,  message: '长度在 最少5 个字符', trigger: 'blur' }],
					contacts:{ message: '请输入', trigger: 'blur' },
					email:{  message: '请输入', trigger: 'blur',type: 'email' },
					address:{ required: true, message: '请输入', trigger: 'blur' },					
				},
				dialogAddFormVisible:false,
				selectId:'',
				ruleForm: {},
				rules: {
					name:{ required: true, message: '请输入名称', trigger: 'blur' },
//					value:{ required:true,trigger: 'blur'},
					phone:[{ message: '请输入', trigger: 'blur',   },{ min: 5,  message: '长度在 最少5 个字符', trigger: 'blur' }],
					contacts:{ message: '请输入', trigger: 'blur' },
					email:{  message: '请输入', trigger: 'blur',type: 'email' },
					address:{ required: true, message: '请输入', trigger: 'blur' },
				},
				treeArr:[],
				options:[									
				],
				options1:[						
				],
				storeSpecial:'',
            }
        },
		computed:{
			...mapGetters([
			  'treeIndex',
			])	
		},
        mounted(){        	
			this.getCompany();
        },       
		destroyed(){
			this.$store.commit('setTreeIndex','1');
		},
        methods:{
			selectChange(val){
				console.log(val);	
				console.log( this.ruleForm.value );
			},
			saveBtn(formName){				
				this.$refs[formName].validate((valid) => {
					  if (valid) {
						  let data = this.ruleForm;
						  console.log('ruleForm',data);
						  let final = {};
						  if( this.treeIndex == '1' ){
							  final = {
								  id:data.id,
								  parentId:this.treeArr[0].parentId,
								  name:data.name,
								  address:data.address,
								  contacts:data.contacts ? data.contacts : undefined,
								  phone:data.phone ? data.phone : undefined,
								  email:data.email ? data.email : undefined,
								  memo: data.memo ? data.memo :undefined,
							  }; 
							}else{								
								final = {
								  id:data.id,
								  parentId:data.value,
								  name:data.name,
								  address:data.address,
								  contacts:data.contacts ? data.contacts : undefined,
								  phone:data.phone ? data.phone : undefined,
								  email:data.email ? data.email : undefined,
								  memo: data.memo ? data.memo :undefined,
							  }; 	
							 }							  
						  apiTwo.updateSubEnterpriseTree(final).then(res=>{
							  if(res.success){		
								  this.$message({
								  message: '修改成功。',
								  type: 'success'
								});
								  this.$store.commit('setTreeIndex','1');
								 this.getCompany();
								  
							  }else{
								  this.$message.error(res.message);
							  }	
						  }).catch(err=>{
							  errInfo.err(err);  
						  });						  
					  } else {
						  this.$message.error('请检查表单。');
							return false;
					  }
					});
			},
			getCompany(){
				apiTwo.queryMyEnterpriseTree().then(res=>{
					if(res.success){
                        this.treeArr = res.data;	
						let deep = JSON.parse(JSON.stringify(res.data));
						if(this.treeArr.length){							
							this.ruleForm = deep[0];
							this.ruleForm1.region = deep[0].name;
							this.ruleForm1.specialId = deep[0].id;
							this.ruleForm.value = '';
						}else{
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
				if(id){		
					let currentName = $event.target.dataset.name;		
					console.log(currentName);
					this.ruleForm1.region = currentName;
					this.ruleForm1.specialId = id;
					this.$store.commit('setTreeIndex',id);		
					let obj = {};
					let save = JSON.parse(JSON.stringify(this.treeArr));
					function picker (arr){					
						arr.map(ele=>{						
							if( ele.id == id ){					
								obj = ele;	
								return obj;
							}else{
								picker(ele.children);							
							}
						})					
					};				
					picker(this.treeArr);				
					let trans = JSON.parse(JSON.stringify(obj));				
					this.ruleForm = trans;
					console.log('ruleForm',trans);					
					let layer = $event.target.dataset.layer;
					let childIndex,parent,childParentId;				
					if(layer == '1'){
						this.options = [];	
						this.rules.value = { trigger: 'blur', };	
						this.ruleForm.value = '';
					}else{	
						console.log( this.rules );					
						this.rules.value = { required:true,trigger: 'blur',message: '请选择上级公司',};						
						function trackIndex(arr){
							arr.map((ele,index)=>{							
								if(ele.id == id){								
									childParentId = ele.parentId;
									childIndex = index;
								}else{
									if(ele.children.length){
										trackIndex(ele.children);
									}
								}							
							})
						};
						trackIndex(save);									
						function getParent(arr,pId){						
							arr.map((ele,index)=>{							
								if(ele.id == pId){			
									parent = ele;
								}else{
									if(ele.children.length){
										getParent(ele.children,pId);
									}
								}							
							})
						};
						getParent(save,childParentId);					
						parent.children.splice(childIndex,1);
						let waitFlat = [];					
						function deep (param){		
							waitFlat.push(param);						
							param.map((ele)=>{
								if(ele.children.length){								
									deep(ele.children);								
								}	
							})
						};	
						this.storeSpecial = JSON.parse(JSON.stringify(childParentId));
						this.ruleForm.value = JSON.parse(JSON.stringify(childParentId));
						deep( save );	
						console.log(save);
						let final = waitFlat.reduce((start,current)=>{
							return start.concat(current);
						},[]);	
						console.log('fianl',final);
						let speFinal = JSON.parse(JSON.stringify(final));
						this.options = speFinal;	
					}	
				}
//				console.log('外边点击',id);				
			},
			submitForm(form){
				this.$refs[form].validate((valid) => {
                  if (valid) {  
					  let final = this.ruleForm1;
					  if( this.treeIndex == '1' ){
						  final.parentId = this.treeArr[0].id;						  
					  }else{
						  final.parentId = final.specialId;
					  }					  				  
					  apiTwo.addSubEnterpriseTree(final).then(res=>{
							  if(res.success){		
								  this.$message({
								  message: '添加成功。',
								  type: 'success'
								});
								  this.$store.commit('setTreeIndex','1');
								 this.getCompany();	
								  this.dialogAddFormVisible = false;
							  }else{
								  this.$message.error(res.message);
							  }	
					  }).catch(err=>{
						  errInfo.err(err);  
					  });
                  } else {
                    this.$message.error('请检查表单。');
                    return false;
                  }
                });
			},
			resetForm(){
				this.dialogAddFormVisible = false;				
			},
			popDialog(){
				this.dialogAddFormVisible = true;
				this.ruleForm1.name = '';
				this.ruleForm1.phone = '';
				this.ruleForm1.contacts = '';
				this.ruleForm1.email = '';
				this.ruleForm1.address = '';
				this.ruleForm1.memo = '';
			},
		}            
    }  
</script>
<style lang="scss" scoped>
	.groupCompanyContainer {	
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
			}
		}
		    .addStaffDialog {
				.addMenusContainer {
					height: 370px;
					overflow: scroll;
				}
				.addBtnContainer {
					padding-top: 10px;
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
		}
		.rightFormCon {
			width: 90%;
		}
		.right {
			margin-top: 36px;
			width: 60%;
			background-color: #fff;
			border-radius: 12px;
			margin-left: 20px;
			padding: 50px;
		}
		.rightTitle {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: space-between;
			align-content:center;
			align-items: center;
		}
		.treeTitle {
			margin-bottom: 20px;
			font-size: 16px;
			font-weight: 600;
		}
		.saveBtn {
			margin: 0 auto;
			cursor: pointer;
			background-image: linear-gradient(45deg, #767efd 0%, #48a3fc 100%), linear-gradient( #ffffff, #ffffff);
			background-blend-mode: normal, normal;
			border-radius: 22px;
			width: 150px;
			text-align: center;
			color: #fff;
			font-size: 14px;
			height: 40px;
			line-height: 40px;
			box-shadow: 0px 14px 20px -10px rgba(117, 126, 253, 1);
			margin-bottom: 40px;
		}
		.add {
			margin-bottom: 20px;
			font-size: 12px;
			color: #6479ff; 
			cursor: pointer;
			.icon-font {
				font-size: 14px !important;
                margin-right: 6px;
				vertical-align: -1px;
			}
		}
	}
</style>
<style lang="scss">
	.groupCompanyContainer {	
		.el-dialog {
			width: 470px;
			border-radius: 10px;
		}
		.el-dialog__title {
			font-size: 13px;
			line-height: 32px;
			color: #6479ff;
		}
		.right {
			.el-form-item__label {
				height: 50px !important;
				line-height: 50px !important;
				color: #979cb2 !important;
				font-size: 14px !important;
			}
			.el-input__inner {
				height: 50px !important;
				line-height: 50px !important;
				border-radius: 0 !important;
				border-width: 2px;
				border-color: #f2f2f2 !important;
			}
			.el-textarea__inner {
				border-radius: 0 !important;
				border-width: 2px;
				border-color: #f2f2f2 !important;
			}
		}
	}
</style>