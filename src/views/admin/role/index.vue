<template>
    <div class="characterManageContainer">
        <el-dialog class="editStaffDialog"   title="编辑" :visible.sync="dialogEditFormVisible">
            <el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" class="demo-ruleForm">
                <div class="editMenusContainer">              
                    <el-form-item label="角色名称" prop="rolename">
                        <el-input v-model.number="editruleForm.rolename"></el-input>
                      </el-form-item>
                    <el-form-item label="描述" prop="describe">
                        <el-input v-model="editruleForm.describe" placeholder="用户登录验证使用"></el-input>
                      </el-form-item>
                </div>
                <div class="editBtnContainer">
                    <div class="second" @click="submitEditForm('editruleForm')">确定</div>
                    <div class="third" @click="resetEditForm('editruleForm')">取消</div>
                </div >
            </el-form>
        </el-dialog>
        <el-dialog class="treeDialog"    :visible.sync="treeFormVisible">
            <div class="treeContainer">
                <el-tree :data="data2"  show-checkbox  default-expand-all node-key="id" ref="tree"  :default-checked-keys="defaultCheck" highlight-current :props="defaultProps"  @check = "checkChange" @check-change="handleCheckChange">
                </el-tree>
            </div>
<!--
            <div class="updateContainer">
                <div class="updateNow" @click="updatePermissons">更新</div>
            </div>
-->
        </el-dialog>
        <div class="white-con">
            <div class="white-con-table">
                <el-table  ref="multipleTable" :data="tableData3" tooltip-effect="dark"  style="width: 100%" height="350"  stripe @selection-change="handleSelectionChange">
<!--                        <el-table-column type="selection"></el-table-column>-->
                        <el-table-column type="index" label="序号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="角色名称" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="description" label="角色描述" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="gmtCreate" label="创建时间" show-overflow-tooltip></el-table-column>
                        <el-table-column  label="操作" width="240">
                            <template slot-scope="scope">
                                <div class="editContainer">
                                    <div class="editAndDelete">
<!--                                        <div class="edit" v-permit="'48'" @click="checkDetails(scope.$index,scope.row)"><i class="icon-font icon-jcxx_-"></i>编辑</div>-->
                                        <div v-permit="'49'"  class="delete" @click="permissions(scope.$index,scope.row)"><i class="icon-font icon-cxsz_-2"></i>权限</div>
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
                <div class="pagInfo">
                 共<span>{{totalLists}}</span>条记录，当前第<span>{{current}}</span>页/共<span>{{allPages}}</span>页
              </div>
              <div class="pagCon">
                  <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage1"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="10"
                      layout="total, sizes, prev, pager, next"
                      :total="totalLists">
                    </el-pagination>
              </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
    </div>
</template>
<script>
        import errInfo from '@/api/errInfo'
        import apiTwo from '@/api/reqApiTwo'
    import _ from 'lodash'
    import storejs from 'store';  
    export default {
      data() {
        return {
            super:false,
            allPages:0,
            tableData3: [],
            totalLists:0,
            currentPage1:1,
            size:10,
            current:1,
            editruleForm:{
                rolename:"",                
                describe:"",
            },
            editrules:{
                rolename: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                  ],
                  describe: [
                    { required: true, message: '请输入描述', trigger: 'blur' }                    
                  ]
            },
            dialogEditFormVisible:false,
            trackEditId:'',
            treeFormVisible:false,
            data2: [],
            defaultProps: {
              children: 'children',
              label: 'label'
            },
            defaultCheck:[],
            changeDefaultCheck:false,
            anotherCheckArr:[]
            }
          },
        mounted(){
            this.initGetLists();
        },
        methods:{
            updatePermissons(){
                if(this.changeDefaultCheck){
                    let data = {
                        roleId:this.trackEditId,
                        menuIds:this.anotherCheckArr
                    };
                    apiTwo.editRolePermission(data).then(res=>{
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
            submitEditForm(form){
                let data = {
                    name:this.editruleForm.rolename,
                    description:this.editruleForm.describe,
                    id:this.trackEditId
                };
                apiTwo.editRoleInfo( data ).then(res=>{
                    if(res.success){
                        this.$message({
                          message: '修改成功。',
                          type: 'success'
                        });
                        this.dialogEditFormVisible = false;
						let data = {
							size:this.size
						};
                        this.checkByWay(data);
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);    
                })
            },
            resetEditForm(form){
                this.dialogEditFormVisible = false;
                this.editruleForm = {};
            },
            checkDetails(index,row){
                this.dialogEditFormVisible = true;
                this.trackEditId = row.id;                
                this.editruleForm = {
                    rolename:row.name,
                    describe:row.description
                };
            },
            permissions(index,row){
				console.log( 'row哦哦哦',row );
                this.changeDefaultCheck = false;
                this.treeFormVisible = true;
                 let data = {
                    roleId:row.id
                } ;
                this.trackEditId = row.id;    
                let idArr=[];
				this.defaultCheck =[];
				apiTwo.permissionsMenu(data).then(res=>{
					if(res.success){						
						var deep = _.cloneDeep( res.data ); 
						this.data2 = deep;
						var filterOne =  deep.filter(ele=>{
                              return ele.selected == true;
                        });
						console.log( 'filterOne',filterOne );
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
//									console.log('首页',homeSenser);									
									if( homeSenser[0].selected ){
                                           idArr = idArr.concat(homeSenser[0].id);
                                    }else {
                                    }									
									this.defaultCheck = idArr; 
                              }	
					}else{
						this.$message.error(res.message);
					}
				})
				.catch(err=>{
					errInfo.err(err); 
				});				
//                if( row.code == 'admin' ){
//                   this.super = true;
//                                    apiTwo.permissionsMenu(data).then(res=>{
//                                    if(res.success){
//                                        var deep = _.cloneDeep( res.data ); 
//                                        console.log( 'deep',deep );
//                                        let trackIndex = _.findIndex(deep, function(o) { return o.id == 42; });
//                                        let subArr = deep[trackIndex].children;
//                                        let subTrackIndex = _.findIndex(subArr, function(o) { return o.id == 47; });
//                                        let thirdArr = subArr[subTrackIndex].children;
//                                        let thirdTrackIndex = _.findIndex(thirdArr, function(o) { return o.id == 49; });
//                                        let target = thirdArr[thirdTrackIndex];
//                                        target.disabled = true;
//                                        let homeIndex = _.findIndex(deep, function(o) { return o.id == 56; });
////                                        deep[homeIndex].disabled = true;
//                                        
//                                        console.log( 'deep',deep );
//                                        this.data2 = deep;
//                                       var filterOne =  deep.filter(ele=>{
//                                           return ele.selected == true;
//                                       });
//                //                        filterOne.forEach(ele=>{
//                //                        })
//                                        for (let val of filterOne){
//                                            var child = val.children;
//                                            let innerSelect = child.filter(ele=>{
//                                                return ele.selected == true;
//                                            })
//                //                            innerSelect.forEach(ele=>{
//                //                            })
//                                            for (let inner of innerSelect){
//                                                var last = inner.children.filter(el=>{
//                                                    return el.selected == true;
//                                                });
//                                                last.forEach(ele=>{
//                                                    idArr.push(ele.id);
//                                                })
//                                            }
//                                        }
//
//                                        let homeSenser = deep.filter(ele=>{
//                                            return ele.id == 56;
//                                        })
//
//                                        if( homeSenser[0].selected ){
//                                           idArr = idArr.concat(homeSenser[0].id);
//                                        }else {
//                                        }
//                                        this.defaultCheck = idArr; 
//                                    }else{
//                                        this.$message.error(res.message);
//                                    }
//                                }).catch(err=>{
//                                    errInfo.err(err);    
//                                })
//                    
//                    
//                }else{
//                   this.super = false;
//                                    apiTwo.permissionsMenu(data).then(res=>{
//                                    if(res.success){
//                                        var deep = _.cloneDeep( res.data ); 
//                                        let homeIndex = _.findIndex(deep, function(o) { return o.id == 56; });
////                                        deep[homeIndex].disabled = true;
//                                        this.data2 = deep;
//                                        
//                                       var filterOne =  deep.filter(ele=>{
//                                           return ele.selected == true;
//                                       });
//                //                        filterOne.forEach(ele=>{
//                //                        })
//                                        for (let val of filterOne){
//                                            var child = val.children;
//                                            let innerSelect = child.filter(ele=>{
//                                                return ele.selected == true;
//                                            })
//                //                            innerSelect.forEach(ele=>{
//                //                            })
//                                            for (let inner of innerSelect){
//                                                var last = inner.children.filter(el=>{
//                                                    return el.selected == true;
//                                                });
//                                                last.forEach(ele=>{
//                                                    idArr.push(ele.id);
//                                                })
//                                            }
//                                        }
//                                        let homeSenser = deep.filter(ele=>{
//                                            return ele.id == 56;
//                                        })
//                                        if( homeSenser[0].selected ){
//                                           idArr = idArr.concat(homeSenser[0].id);
//                                        }else {
//                                        }
//                                        this.defaultCheck = idArr; 
//                                    }else{
//                                        this.$message.error(res.message);
//                                    }
//                                }).catch(err=>{
//                                    errInfo.err(err);    
//                                })
//                }
            },
            initGetLists(){
                apiTwo.getRolesLists().then(res=>{
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
            checkByWay(data){
                apiTwo.getRolesLists(data).then(res=>{
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(val){
                this.size = val;
				let data = {
                    size:this.size,
                };
                this.checkByWay(data);
            },
            handleCurrentChange(val){
                this.current = val;
                let data = {
                    size:this.size,
                    current:this.current
                };
                this.checkByWay(data);
            },
        }
    }
</script>
<style lang="scss">
    .characterManageContainer {
        .treeContainer {
            height: 400px;
            overflow: scroll;
            margin-top: 10px;
        }
        .upContainer {
            width: 100%;
        }
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
            &-table {
                position: relative;
                background-color: #fff;
                height: 360px;
                margin-top: 27px;
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
	.characterManageContainer {		
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
		 .el-dialog {
			border-radius: 10px;
			height: 300px;
			width: 480px;			
		}
		  .el-select{
			margin-left: 0!important;
		}
		  .el-form-item__label {
				text-align: left;
				font-size: 13px!important;
				color: #979cb2!important;
				width: 80px!important;
		}
		  .treeDialog  .el-dialog{
			height: auto;
		}	
	} 	
</style>