<template>
<!--
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button style="margin-bottom:20px;" type="primary" icon="el-icon-plus" @click="handleCreate" v-if="roleManager_btn_add">添加</el-button>
      
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%;">
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色标识">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">
          <span>{{scope.row.description }}</span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="状态">
        <template slot-scope="scope">
          <el-tag>{{scope.row.enabled | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="success" v-if="roleManager_btn_edit" @click="handleUpdate(scope.row)">{{$t('button.edit')}}
          </el-button>
          <el-button size="mini" type="danger" v-if="roleManager_btn_del" @click="handleDelete(scope.row)">{{$t('button.del')}}
          </el-button>
          <el-button size="mini" type="info" plain @click="handlePermission(scope.row)" v-if="roleManager_btn_perm">{{$t('button.permission')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="form.code" placeholder="角色标识"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="描述"></el-input>
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current ref="deptTree" @node-click="getNodeData" :props="defaultProps" :filter-node-method="filterNode" default-expand-all>
      </el-tree>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPermissionVisible">
      <el-tree class="filter-tree" :data="treeData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current :props="defaultProps" show-checkbox ref="menuTree" :filter-node-method="filterNode" default-expand-all>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updatePermession(roleId, roleCode)">更 新</el-button>
      </div>
    </el-dialog>
  </div>
-->


    <div class="characterManageContainer">
        <div class="white-con">
            <div class="white-con-table">
                
                <el-table
                        ref="multipleTable"
                        :data="tableData3"
                        tooltip-effect="dark"
                        style="width: 100%"
                        height="600"
                        stripe
                        @selection-change="handleSelectionChange">
<!--                        <el-table-column type="selection"></el-table-column>-->
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column prop="empNo" label="角色名称"></el-table-column>
                        <el-table-column prop="name" label="角色描述"></el-table-column>
                        

                        <el-table-column prop="workingState.message" label="创建时间"></el-table-column>

                        <el-table-column  label="操作">
                            <template slot-scope="scope">
                                <div class="edit" @click="checkDetails(scope.$index,scope.row)"> 
                                    <i class="icon-font icon-jcxx_-"></i>
                                    详情
                                  </div>
                                <div class="edit" @click="checkDetails(scope.$index,scope.row)"> 
                                    <i class="icon-font icon-jcxx_-"></i>
                                    详情
                                  </div>
                                </template>
                        </el-table-column>

                    </el-table>
                
                
            </div>
            
            <div class="white-con-bottom">
                
                <div class="pagInfo">
                 共<span>{{totalLists}}</span>条记录，当前第<span>1</span>页/共<span>20</span>页
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
            
            
            
        
        
        </div>
    </div>


</template>
<script>
import {
  fetchList,
  getObj,
  addObj,
  putObj,
  delObj,
  permissionUpd,
  fetchRoleTree,
  fetchDeptTree
} from "@/api/role";
import { fetchTree } from "@/api/menu";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令

export default {
  name: "table_role",
  directives: {
    waves
  },
  data() {
    return {
      treeData: [],
      treeDeptData: [],
      checkedKeys: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      form: {
        roleName: undefined,
        roleCode: undefined,
        roleDesc: undefined,
        deptName: undefined,
        roleDeptId: undefined
      },
      roleId: undefined,
      roleCode: undefined,
      rules: {
        roleName: [{
            required: true,
            message: "角色名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        roleCode: [{
            required: true,
            message: "角色标识",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        roleDesc: [{
            required: true,
            message: "角色标识",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ]
      },
      statusOptions: ["0", "1"],
      rolesOptions: undefined,
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogPermissionVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建",
        permission: "分配权限"
      },
      tableKey: 0,
      tableKey: 0,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false
    };
  },
  created() {
    this.getList();
    this.roleManager_btn_add = this.permissions["sys_role_add"];
    this.roleManager_btn_edit = this.permissions["sys_role_edit"];
    this.roleManager_btn_del = this.permissions["sys_role_del"];
    this.roleManager_btn_perm = this.permissions["sys_role_perm"];
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "无效",
        1: "有效",
        9: "锁定"
      };
      return statusMap[status];
    }
  },
  computed: {
    ...mapGetters(["elements", "permissions"])
  },
  methods: {
    getList() {
      this.listLoading = true;
      console.log(this.$route.query)
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    handleUpdate(row) {
      getObj(row.id).then(response => {
        this.form = response.data;
        // this.form.deptName = row.name;
        this.form.roleDeptId = row.id;
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
      });
    },
    handlePermission(row) {
      fetchRoleTree(row.id)
        .then(response => {
          this.checkedKeys = response.data;
          return fetchTree();
        })
        .then(response => {
          this.treeData = response.data;
          this.dialogStatus = "permission";
          this.dialogPermissionVisible = true;
          this.roleId = row.id;
          this.roleCode = row.code;
        });
    },
    handleDept() {
      fetchDeptTree().then(response => {
        this.treeDeptData = response.data;
        this.dialogDeptVisible = true;
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      this.dialogDeptVisible = false;
      this.form.roleDeptId = data.id;
      this.form.deptName = data.name;
      console.log(data);
    },
    handleDelete(row) {
      delObj(row.id).then(response => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
      });
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          putObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    updatePermession(roleId, roleCode) {
      permissionUpd(roleId, this.$refs.menuTree.getCheckedKeys()).then(() => {
        this.dialogPermissionVisible = false;
        fetchTree()
          .then(response => {
            this.treeData = response.data;
            return fetchRoleTree(roleId);
          })
          .then(response => {
            this.checkedKeys = response.data;
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
      });
    },
    resetTemp() {
      this.form = {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleDesc: undefined
      };
    }
  }
};

</script>


<script>
        
    
    export default {
      data() {
        return {
            
            tableData3: [],
            totalLists:1,
            currentPage1:1,
            totalLists:1,
            size:10,
            current:1,
        }
      },
        methods:{
            
            initGetLists(){
                
            },
            checkByWay(){
                
            },
            reset(){
            
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(){
                
            },
            handleCurrentChange(){
            
            },
        },
        mounted(){
            
        },
    }
        
    

    
    
    
</script>


<style lang="scss">
    
    
    .characterManageContainer {
        padding-top: 36px;
        min-height: 100%;
        background-color: #f9f9fc;
        padding-bottom: 100px;
        margin-bottom: 40px;
        box-sizing: border-box;
        padding-left: 60px;
        padding-right: 60px;
        .white-con {
            background-color: #fff;
            border-radius: 12px;
            width: 100%;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 28px;
            padding-bottom: 65px;
            box-sizing: border-box;
            
            
            &-table {
                position: relative;
                background-color: #fff;
                height: 610px;
                overflow: scroll;
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
    .characterManageContainer .white-con-table .el-table {
        position: absolute;
        left: 0;
        top: 0;
    }

    .characterManageContainer .white-con-table .has-gutter th {
        background-color: #eff1ff;
        color: #21223f;
        font-size: 13px;
        font-weight: 700px;
    }

    .characterManageContainer .white-con-table .cell {
        text-align: center;
    }

    .characterManageContainer .white-con-table .el-table--striped .el-table__body tr.el-table__row--striped td {
        background-color: #f2f2f8;
        color: #21223f;
        font-size: 12px;
    }

    .characterManageContainer .white-con-table .el-table--striped .el-table__body tr.el-table__row td {
        color: #21223f;
        font-size: 12px;
    }

    .characterManageContainer .white-con-table .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
        background-color: #fff;
    }

    .characterManageContainer .el-table__header-wrapper {
        background-color: #eff1ff;
    }

    .characterManageContainer .el-table__header {
        width: 100% !important;
    }

    .characterManageContainer .el-table__body {
        width: 100% !important;
    }
</style>
