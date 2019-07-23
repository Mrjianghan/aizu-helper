<template>
    <div class="adminContainer">
        <div class="white-con">
            <div class="white-con-top-con">
                <div v-permit="'44'" class="first" @click="dialogAddFormVisible = true">
                    <i class="icon-font icon-jcxx_-6"></i>添加用户
                </div> 
            </div>
            <div class="white-con-top-form">
                <div class="first">
                  <span>姓名</span><input v-model.trim="staffName" @blur="staffNameBlur">
              </div>
              <div class="second">
                  <span>手机号</span><input v-model.trim="staffPhone" @blur="phoneBlur">
              </div>
             <div class="btn-right">
                 <div class="btn-right-inner">
                  <div class="btn-bg" @click="checkAction">查询</div>
                   <div class="btn-border" @click="reset">重置</div>
                </div>
              </div>
            </div>
            <div class="white-con-table">
                <el-table  ref="multipleTable"  :data="tableData3"   tooltip-effect="dark"  style="width: 100%" height="350"  stripe   @selection-change="handleSelectionChange">
                        <el-table-column type="index" label="序号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="roleName" label="角色" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="gmtCreate" label="创建时间" show-overflow-tooltip></el-table-column>
                        <el-table-column  label="状态" show-overflow-tooltip>
                            <template slot-scope="scope">{{ scope.row.enabled == '1' ? "有效" : '无效'  }}</template>
                        </el-table-column>
                        <el-table-column width="240"  label="查看">
                            <template slot-scope="scope">
                                <div class="editContainer">
                                    <div class="editAndDelete">
                                        <div v-permit="'45'" class="edit" @click="checkDetails(scope.$index,scope.row)"><i class="icon-font icon-jcxx_-"></i>编辑</div>
										<div v-permit="'61'" class="delete" @click="permissionThis(scope.$index,scope.row)"><i class="icon-font icon-cxsz_-2"></i>权限</div>
                                        <div v-permit="'46'" class="delete" @click="deleteThis(scope.$index,scope.row)"><i class="icon-font icon-jcxx_-10"></i>禁用</div>
                                    </div>
                                    <div class="lock">
                                        <i class="icon-font icon-sp--1"></i>
                                    </div>
                                </div>
                                </template>
                        </el-table-column>
                    </el-table>
            </div>
            <div class="white-con-bottom">
                <div class="pagInfo">共<span>{{totalLists}}</span>条记录，当前第<span>{{current}}</span>页/共<span>{{allPages}}</span>页</div>
              <div class="pagCon">
                  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage1" :page-sizes="[10, 20, 50, 100]" :page-size="10"  layout="total, sizes, prev, pager, next" :total="totalLists">
                    </el-pagination>
              </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
        <el-dialog class="hintInfo" title="提示" :visible.sync="centerDialogVisible" width="430px" center>
          <span>此操作将禁用该用户{{ trackDeletePosition }},是否继续？</span>
            <div class="confirmBtns">
                <div class="confirmYes" @click="confirmDelete">是</div>
                <div class="confirmNo" @click="centerDialogVisible = false">否</div>
            </div>
        </el-dialog>
        <el-dialog class="editStaffDialog"   title="编辑" :visible.sync="dialogEditFormVisible">
            <el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" class="demo-ruleForm">
                <div class="editMenusContainer">              
                    <el-form-item label="用户名称" prop="username">
                    <el-input v-model.number="editruleForm.username"></el-input>
                  </el-form-item>
                    <el-form-item label="名字" prop="name">
                    <el-input v-model.number="editruleForm.name"></el-input>
                  </el-form-item>
                   <el-form-item label="角色" prop="roleId">
                       <el-select v-model="editruleForm.roleId" collapse-tags  style="margin-left: 20px;"  placeholder="请选择">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                  </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="editruleForm.mobile" placeholder="用户登录验证使用"></el-input>
                      </el-form-item>
                    <el-form-item label="状态" prop="able">
                        <el-select v-model="editruleForm.able" placeholder="请选择状态" collapse-tags>
                            <el-option
                              v-for="item in StatusOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                      </el-form-item>                   
                </div>
                <div class="editBtnContainer">
                    <div v-permit="'58'" class="first" @click="resetPassword">重置密码</div>
                    <div class="second" @click="submitEditForm('editruleForm')">确定</div>
                    <div class="third" @click="resetEditForm('editruleForm')">取消</div>
                </div >
            </el-form>
        </el-dialog>        
        <el-dialog class="addStaffDialog"   title="添加用户" :visible.sync="dialogAddFormVisible">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <div class="addMenusContainer">
                    <el-form-item label="登录邮箱" prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                  </el-form-item>
                    <el-form-item label="名字" prop="username">
                    <el-input v-model="ruleForm.name"></el-input>
                  </el-form-item>
                   <el-form-item label="角色" prop="roleId">
                       <el-select v-model="ruleForm.roleId"
                            collapse-tags
                            style="margin-left: 20px;"
                            placeholder="请选择">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                  </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="ruleForm.mobile" placeholder="用户登录验证使用"></el-input>
                  </el-form-item>
                </div>
                <div class="addBtnContainer">
                    <div @click="submitForm('ruleForm')">确定</div>
                    <div @click="resetForm('ruleForm')">取消</div>
                </div >
            </el-form>
        </el-dialog>
		<el-dialog class="treeDialog"    :visible.sync="treeFormVisible">
            <div class="treeContainer">
                <el-tree :data="data2"  show-checkbox  default-expand-all node-key="id" ref="tree"  :default-checked-keys="defaultCheck" highlight-current :props="defaultProps"  @check = "checkChange" @check-change="handleCheckChange">
                </el-tree>
            </div>
            <div class="updateContainer">
                <div  v-permit="'62'" class="updateNow" @click="updatePermissons">更新</div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import apiTwo from '@/api/reqApiTwo'
    import errInfo from '@/api/errInfo';
    import storejs from 'store';
	import _ from 'lodash'
    export default {
      data() {
        return {
			data2:[],
			defaultProps: {
              children: 'children',
              label: 'label'
            },
			defaultCheck:[],
			treeFormVisible:false,
            allPages:0,
            staffName:'',
            staffPhone:'',
            tableData3: [],
            totalLists:0,
            currentPage1:1,
            size:10,
            current:1,
            StatusOptions:[
                { label:'启用',value:'1' },
                { label:'禁用',value:'0' }
            ],
            dialogAddFormVisible:false,
            ruleForm: {
                  username:'',
                    roleId:'',
                    mobile:'',
                    name:'',
                },
            rules: {
                  username: [
                    { required: true, message: '请输入登录邮箱', trigger: 'blur' }
                  ],
                    name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                  ],
                  roleId: [
                    { required: true, message: '请选择角色', trigger: 'blur' }                    
                  ],
                    mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                  ]
                },
            editruleForm:{
                name:'',
                username:'',
                roleId:'',
                mobile:'',
                able:'',
                id:'',
            },
            editrules:{
                name: [
                    { required: true, message: '请输入名字', trigger: 'blur' }
                  ],
                username: [
                    { required: true, message: '请输入登录邮箱', trigger: 'blur' }
                  ],
                 able: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                  ],
                  roleId: [
                    { required: true, message: '请选择角色', trigger: 'blur' }                    
                  ],
                    mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' }
                  ]
            },
            options:[],
            centerDialogVisible:false,
            trackDeleteId:'',
            trackDeletePosition:'',
            dialogEditFormVisible:false,
            trackEditId:'',
        }
      },
        mounted(){
            this.initBlur();
			let data = {
                    size:this.size,
                    name:this.staffName ? this.staffName : undefined,
                    mobile:this.staffPhone ? this.staffPhone : undefined
                };
            this.checkByWay(data);
            this.getRole();
        },
        methods:{
			checkAction(){
				let data = {
                    size:this.size,
                    name:this.staffName ? this.staffName : undefined,
                    mobile:this.staffPhone ? this.staffPhone : undefined
                };
            	this.checkByWay(data);
			},
			updatePermissons(){
                if(this.changeDefaultCheck){
                    let data = {
                        id:this.trackEditId,
                        menuIds:this.anotherCheckArr
                    };
                    apiTwo.updateUserPerssion(data).then(res=>{
                        if(res.success){
                            this.$message({
                              message: '修改成功',
                              type: 'success'
                            });
                            this.treeFormVisible = false;
                        }else{
                            this.$message.error(res.message);
                        }
                    }).catch(err=>{
                        errInfo.err(err); 
                    })
                }else{
                    this.treeFormVisible = false;
                }
            },
			handleCheckChange(data, checked, indeterminate){
                this.changeDefaultCheck = true;
            },
            checkChange(para1,para2){   
                let trans = para2.checkedKeys.concat(para2.halfCheckedKeys);
                this.anotherCheckArr = para2.checkedKeys.concat(para2.halfCheckedKeys);
                console.log( this.anotherCheckArr );
            },
			permissionThis(index,row){
				console.log(row.id);
				this.treeFormVisible = true;
				let params ={
					id:	row.id
				};
				this.trackEditId = row.id;
				let idArr=[];
				this.defaultCheck =[];
				apiTwo.checkUserPerssion(params).then(res=>{
					if( res.success ){
					   console.log(res);						
						var deep = _.cloneDeep( res.data ); 
						this.data2 = deep;						
						var filterOne =  deep.filter(ele=>{
                              return ele.selected == true;
                        });
						console.log( 'filterOne',filterOne );
						let homeIndex = _.findIndex(deep, function(o) { return o.id == 56; });
                        deep[homeIndex].disabled = true;						
						for (let val of filterOne){
                                    var child = val.children;
                                    let innerSelect = child.filter(ele=>{
                                          return ele.selected == true;
                                    });
									for (let inner of innerSelect){
										var last = inner.children.filter(el=>{
											return el.selected == true;
										});
										last.forEach(ele=>{
											idArr.push(ele.id);
										})
									}									
									let homeSenser = deep.filter(ele=>{
                                         return ele.id == 56;
                                    });															
									if( homeSenser[0].selected ){
                                           idArr = idArr.concat(homeSenser[0].id);
                                    }else {
                                    }									
									this.defaultCheck = idArr; 
                              }	
						
					}else{
					   this.$message.error(res.message);
					}					
				}).catch(err=>{
					errInfo.err(err);
				})
			},
            initBlur(){
                let no = storejs.get('rolePhone');
                let name = storejs.get('roleStaffName');              
                if(no){
                   this.staffPhone = no;
                }
                if(name){
                    this.staffName = name;
                }                         
            },
            phoneBlur(){
                storejs.set('rolePhone',this.staffPhone);
            },
            staffNameBlur(){
                storejs.set('roleStaffName',this.staffName);
            },
            submitEditForm(editruleForm){
                let data = {
                    name:this.editruleForm.name,
                    id:this.editruleForm.id,
                    username:this.editruleForm.username,
                    enabled:this.editruleForm.able,
                    roleId:this.editruleForm.roleId,
                    mobile:this.editruleForm.mobile
                };
                apiTwo.editUserAndRoleInfo( data ).then(res=>{
                    if(res.success){
                        this.$message({
                          message: '修改成功。',
                          type: 'success'
                        });
                        this.dialogEditFormVisible = false;   
						let data = {
							size:this.size,
							name:this.staffName ? this.staffName : undefined,
							mobile:this.staffPhone ? this.staffPhone : undefined
						};
                        this.checkByWay(data);
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);    
                })
            },
            resetEditForm(editruleForm){
                this.editruleForm = {};
                this.dialogEditFormVisible = false;  
            },
            resetPassword(){
                let data = {
                    id:this.trackEditId
                };
                apiTwo.resetPassword( data ).then(res=>{
                    if(res.success){
                        this.$message({
                          message: '重置密码成功。',
                          type: 'success'
                        });
                        this.dialogEditFormVisible = false;   
                        
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);  
                })
            },
            confirmDelete(){                
                apiTwo.deleteUser( this.trackDeleteId ).then(res=>{
                    if(res.success){
						let data = {
							size:this.size,
							name:this.staffName ? this.staffName : undefined,
							mobile:this.staffPhone ? this.staffPhone : undefined
						};
                        this.checkByWay(data);
                        this.centerDialogVisible = false;
                        this.$message({
                          message: '禁用成功。',
                          type: 'success'
                        });
                        this.trackDeleteId = '';
                        this.trackDeletePosition='';                        
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);  
                })
            },
            getRole(){
                let data = {
                    size:1000,
                    current:1
                };
                apiTwo.getRolesLists(data).then(res=>{
                    if(res.success){
                        var arr = res.data.records.map((ele,i)=>{
                            var newObj = {};
                            newObj.value=ele.id;
                            newObj.label=ele.name;
                            return newObj;
                        });
                        this.options = arr;
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);  
                })
            },
            submitForm(form){
                let data = this.ruleForm;
                apiTwo.addUser(data).then(res=>{
                    if(res.success){
                        this.dialogAddFormVisible = false;
						let data = {
							size:this.size,
							name:this.staffName ? this.staffName : undefined,
							mobile:this.staffPhone ? this.staffPhone : undefined
						};
                        this.checkByWay(data);
                        this.ruleForm={};
                        this.$message({
                          message: '添加成功，初始密码为手机号。',
                          type: 'success'
                        });
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);  
                })
            },
            resetForm(form){
                this.dialogAddFormVisible = false;
                this.ruleForm={};
            },
            checkDetails(index,row){
                this.dialogEditFormVisible = true;
                this.trackEditId = row.id;
                this.editruleForm = {
                    name:row.name,
                    username:row.username,
                    roleId:row.roleId,
                    mobile:row.mobile,
                    id:row.id,
                    able:String(row.enabled)
                };   
            },
            deleteThis(index,row){
                this.centerDialogVisible = true;
                this.trackDeleteId = row.id;
                this.trackDeletePosition = row.name;
            },            
            checkByWay(data){
                apiTwo.getUsersLists(data).then(res=>{
                    if(res.success){
						this.current = res.data.current;
                        this.tableData3 = res.data.records;
                        this.totalLists = res.data.total;
                        this.allPages = Math.ceil ( res.data.total/this.size ) ;
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);  
                })
            },
            reset(){
                this.staffName = "";
                this.staffPhone = "";
                storejs.remove('rolePhone');
                storejs.remove('roleStaffName'); 
				let data = {
                    size:this.size,
                    current:this.current,
                };
                this.checkByWay(data);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(val){
                this.size = val;
				let data = {
                    size:this.size,
                    name:this.staffName ? this.staffName : undefined,
                    mobile:this.staffPhone ? this.staffPhone : undefined
                };
                this.checkByWay(data);
            },
            handleCurrentChange(val){
                this.current = val;
				let data = {
                    size:this.size,
                    current:this.current,
                    name:this.staffName ? this.staffName : undefined,
                    mobile:this.staffPhone ? this.staffPhone : undefined
                };
                this.checkByWay(data);
            },
        },
    }
</script>
<style lang="scss">
    .adminContainer {		
		.updateNow {
            box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6);
            width: 80px;
            height: 40px;
            background-image:
                    linear-gradient(-10deg, 
                    #48a3fc 0%, 
                    #767efd 100%);
            color: #fff;
            text-align: center;
            line-height: 40px;
            border-radius: 20px; 
            cursor: pointer;
            font-size: 12px;    
            margin: 0 auto;
            margin-top: 10px;
        } 
		.treeContainer {
            height: 400px;
            overflow: scroll;
            margin-top: 10px;
        }
        .confirmBtns {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                align-content: center;
                align-items: center;
                margin-top: 40px;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .confirmYes {
                width: 80px;
                height: 40px;
                box-sizing: border-box;
                font-size: 12px;
                box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6);
                    background-image:
                    linear-gradient(-10deg, 
                    #48a3fc 0%, 
                    #767efd 100%);
                    color: #fff;
                    text-align: center;
                    line-height: 40px;
                    border-radius: 20px; 
                    margin-right: 22px;
                    cursor: pointer;
                    margin-left: 90px;
            }
            .confirmNo {
                width: 80px;
                height: 40px;
                box-sizing: border-box;
                border: 1px solid #6479ff;
                color: #6479ff;
                text-align: center;
                line-height: 40px;
                border-radius: 20px;
                cursor: pointer;
                margin-right: 90px;
            }        
        .editBtnContainer {
            padding-top: 10px;
            display:flex;
            justify-content: space-around;
            align-content: center;
            align-items: center;
            width: 320px;
            margin: 0 auto;
            .second{
                height: 40px;
                width: 120px;
                margin-left: 20px;
                margin-right: 20px;
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
            .first{
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
            .third{
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
        .editContainer{
            width: 100%;
            height: 30px;
            .editAndDelete {
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-around;
                align-content: center;
                align-items: center;
                .edit {
                    text-align: center;
                    width: 50%;
                    line-height: 28px;
                    color: #6477ff;
                    cursor: pointer;
                    .icon-font {
                        font-size: 12px;
                        margin-right: 5px;
                    }
                }
                 .delete {
                    text-align: center;
                     width: 50%;
                    line-height: 28px;
                    color: #6477ff;
                    cursor: pointer;
                    .icon-font {
                        font-size: 12px;
                        margin-right: 5px;
                    }
                }
            }
            .lock {
                width: 100%;
                height: 30px;
                line-height: 30px;
                z-index: 19;
                margin: 0 auto;
                .icon-sp--1 {
                    font-weight: bolder;
                    color: #fb617f;
                }
            }
        }
        background-color: #f9f9fc;
        padding-bottom: 100px;
        margin-bottom: 40px;
        box-sizing: border-box;
        padding-left: 60px;
        padding-right: 60px;
        .white-con {
            margin-top: 36px;
            background-color: #fff;
            border-radius: 12px;
            width: 100%;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 28px;
            padding-bottom: 20px;
            box-sizing: border-box;
            &-top-con {
                color: #6479ff; 
                font-size: 12px;
                white-space: nowrap;
                margin-bottom: 28px;
                overflow: hidden;
                .icon-font {
                        font-size: 14px !important;
                        margin-right: 6px;
                    }
                    div {
                        float: left;
                        cursor: pointer;
                        margin-right: 20px;
                    }
            }
            &-top-form {
                overflow: hidden;
				display: flex;
				flex-direction:row;
				flex-wrap: wrap;
				justify-content:flex-start;
				align-content: center;
				align-items: center;
				font-size: 12px;
				white-space: nowrap;		
				input {
					padding-left: 20px;
				}
				span {
					 line-height: 30px;
					color: #979cb2;
					margin-right: 10px;
				}
                
                div {
                    height: 30px;
                    input {
                        padding-left: 20px;
                        height: 30px;
                        border: 1px solid #f2f2f2;
                    }
                }
                .btn-border{
                    width: 71px!important;
                    height: 30px;
                    float: left;
                    border: 1px solid #6479ff;
                    color: #6479ff;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 20px;
                    box-sizing: border-box;
                    cursor: pointer;
                    font-size: 12px;
                }
                .btn-bg{
                    box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6);
                    width: 71px !important;
                    height: 30px;
                    float: left;
                    background-image:
                    linear-gradient(-10deg, 
                    #48a3fc 0%, 
                    #767efd 100%);
                    color: #fff;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 20px; 
                    margin-right: 35px;
                    cursor: pointer;
                    font-size: 12px;
                }    
				.first {
					input {
						width: 143px;
						height: 30px;
						border: 1px solid #f2f2f2;
					}
					margin-right: 20px;	
					margin-bottom: 30px
				}
				.second {
					input {
						width: 143px;
						height: 30px;
						border: 1px solid #f2f2f2;
					}
					margin-right: 20px;	
					margin-bottom: 30px
				}
				.btn-right {
					margin-bottom: 30px
				}
            }
            &-table {
                position: relative;
                background-color: #fff;
                height: 360px;
                margin-bottom: 28px;
            }
            &-bottom {
                position: relative;
                @media all and (max-width: 1190px) {
                    .pagInfo {
                        font-size: 12px;
                        color: #c8cad7;
                        span {
                            font-size: 13px;
                            color: #6479ff;
                        }
                    }
                    .pagCon {
                        width: 440px;
                        margin-top: 20px;
                        margin-bottom: 20px;
                    }
                    .allStaffInfo {
                        font-size: 12px;
                        line-height: 28px;
                        color: #c8cad7;
                        span {
                            font-size: 13px;
                            color: #6479ff;
                        }
                    }
                }
                @media all and (min-width: 1191px) {
                    .pagInfo {
                        float: left;
                        font-size: 12px;
                        color: #c8cad7;
                        span {
                            font-size: 14px;
                            color: #6479ff;
                        }
                    }
                    .pagCon {
                        width: 440px;
                        margin: 0 auto;
                    }
                    .allStaffInfo {
                        position: absolute;
                        right: 0;
                        top: -15px;
                        font-size: 12px;
                        line-height: 28px;
                        color: #c8cad7;
                        span {
                            font-size: 14px;
                            color: #6479ff;
                        }
                    }
                }
                &:after {
                    content: '';
                    display: block;
                    clear: both;
                    overflow: hidden;
                }
            }
        }
    }
</style>
<style lang="scss">	
	.adminContainer {		
		  .white-con-table .el-table {
				position: absolute;
				left: 0;
				top: 0;
			}
			 .white-con-table .has-gutter th {
				background-color: #eff1ff;
				color: #21223f;
				font-size: 13px;
				font-weight: 700px;
			}
			 .white-con-table .cell {
				text-align: center;
			}
			 .white-con-table .el-table--striped .el-table__body tr.el-table__row--striped td {
				background-color: #f2f2f8;
				color: #21223f;
				font-size: 12px;
			}
			 .white-con-table .el-table--striped .el-table__body tr.el-table__row td {
				color: #21223f;
				font-size: 12px;
			}
			 .white-con-table .el-table--border::after,
			.el-table--group::after,
			.el-table::before {
				background-color: #fff;
			}
			 .el-table__header-wrapper {
				background-color: #eff1ff;
			}
			 .el-table__header {
				width: 100% !important;
			}
			 .el-table__body {
				width: 100% !important;
			}
       .el-form-item__label {
            text-align: left;
            font-size: 13px!important;
            color: #979cb2!important;
            width: 80px!important;
        }
          .el-form-item__content {
            margin-left: 80px!important;
            height: 40px!important;
        }
          .cusinput {
            padding-left: 15px;
            height: 40px!important;
            width: 99%;
            box-sizing: border-box;
            border: 1px solid #dcdfe6;
            border-radius: 5px;
        }
          .el-form-item__content input{
            height: 40px!important;
            width: 99%;
        }
          .el-dialog__headerbtn {
            top: 30px;
            right: 36px;
        }
          .el-dialog__body {
            padding: 20px 32px;
            padding-top: 20px;
        }
          .el-dialog__header {
            padding-top: 27px;
            padding-left: 36px;
            padding-bottom: 0;
        }
          .el-dialog__header .el-dialog__title{
            font-size: 13px;
            line-height: 32px;
            color: #6479ff;
        }
	}
  .adminContainer   .el-dialog {
        border-radius: 10px;
        height: 420px;
        width: 480px;       
    }
    .adminContainer  .el-select{
        margin-left: 0!important;
    }
    .adminContainer {
        .hintInfo {
            .el-dialog__header {
                text-align: left;
            }
            .el-dialog__body {
                text-align: center;
            }
            .el-dialog {
                height: 220px;
            }
        }
    }
    .adminContainer {
        .editStaffDialog {
            .el-dialog__header {
                text-align: left;
            }
            .el-dialog__body {
                text-align: center;
            }
            .el-dialog {
                height: 460px;
            }
        }
    }
	.treeDialog .el-dialog {
		height: auto;
	}
</style>