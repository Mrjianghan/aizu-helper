<template>
<!--
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.username" :placeholder="$t('table.accountName')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-waves @click="handleFilter">{{$t('button.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-waves @click="handleCreate">{{$t('button.add')}}</el-button>
        </el-form-item>
      </el-form>
     
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 99%">
      <el-table-column align="center" :label="$t('table.id')">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.accountName')">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.avatar" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.avatar+'?imageView2/1/w/20/h/20'"> {{scope.row.username}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.mobile')">
        <template slot-scope="scope">
          <span>{{scope.row.mobile || $t('table.unfilled')}}</span>
        </template>
      </el-table-column>
    
      <el-table-column align="center" :label="$t('table.role')">
        <template slot-scope="scope">
          <span v-for="role in scope.row.roleList">{{role.name}} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.gmtCreate')">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag>{{scope.row.enabled | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.operation')" width="200">
        <template slot-scope="scope">
          <el-button v-if="sys_user_edit" size="small" type="success" @click="handleUpdate(scope.row)">{{$t('button.edit')}}
          </el-button>
          <el-button v-if="sys_user_del" size="small" type="danger" @click="deletes(scope.row)">{{$t('button.forbidden')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible">
      <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current ref="deptTree" :props="defaultProps" @node-click="getNodeData" default-expand-all>
      </el-tree>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输用户名"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptName">
          <el-input v-model="form.deptName" placeholder="选择部门" @focus="handleDept()" readonly></el-input>
          <input type="hidden" v-model="form.deptId" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select class="filter-item" v-model="role" placeholder="请选择" multiple>
            <el-option v-for="item in rolesOptions" :key="item.id" :label="item.description" :value="item.id">
              <span style="float: left">{{ item.description }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="验证码登录使用"></el-input>
        </el-form-item>
        <el-form-item label="状态" v-if="dialogStatus == 'update' && sys_user_del " prop="enabled">
          <el-select class="filter-item" v-model="form.enabled" placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">修 改</el-button>
      </div>
    </el-dialog>
  </div>
-->




    <div class="adminContainer">
        <div class="white-con">
            <div class="white-con-top-con">
                <div class="first" @click="">
                    <i class="icon-font icon-jcxx_-6"></i>添加用户
                </div> 
            </div>
            <div class="white-con-top-form">
                <div class="first">
                  <span>员工号</span><input v-model.trim="staffNumber">
              </div>
              <div class="second">
                  <span>手机号</span><input v-model.trim="staffPhone">
              </div>
             <div class="btn-right">
                 <div class="btn-right-inner">
                  <div class="btn-bg" @click="checkByWay">查询</div>
                   <div class="btn-border" @click="reset">重置</div>
                </div>
              </div>
            </div>
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
                        <el-table-column prop="empNo" label="用户名"></el-table-column>
                        <el-table-column prop="name" label="手机号"></el-table-column>
                        <el-table-column prop="hiredate" label="角色"></el-table-column>

                        <el-table-column prop="workingState.message" label="创建时间"></el-table-column>

                        <el-table-column prop="position" label="状态" show-overflow-tooltip></el-table-column>
                        <el-table-column  label="查看">
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
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/user";
import { deptRoleList, fetchDeptTree } from "@/api/role";
import waves from "@/directive/waves/index.js"; // 水波纹指令
// import { parseTime } from '@/utils'
import { mapGetters } from "vuex";
import ElRadioGroup from "element-ui/packages/radio/src/radio-group";
import ElOption from "element-ui/packages/select/src/option";

export default {
  components: {
    ElOption,
    ElRadioGroup
  },
  name: "table_user",
  directives: {
    waves
  },
  data() {
    return {
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
      role: [],
      form: {
        username: undefined,
        password: undefined,
        delFlag: undefined,
        deptId: undefined,
        mobile: undefined
      },
      rules: {
        username: [{
            required: true,
            message: "请输入账户",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        password: [{
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur"
          }
        ],
        deptId: [
          {
            required: true,
            message: "请选择部门",
            trigger: "blur"
          }
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur"
          }
        ],mobile: [
          {
            required: true,
            message: "手机号",
            trigger: "blur"
          },
          {
            min: 11,
            max: 11,
            message: "长度在11 个字符",
            trigger: "blur"
          }
        ]
      },
      statusOptions: ["0", "1"],
      rolesOptions: [],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      userAdd: false,
      userUpd: false,
      userDel: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      isDisabled: {
        0: false,
        1: true
      },
      tableKey: 0
    };
  },
  computed: {
    ...mapGetters(["permissions"])
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
  created() {
    this.getList();
    this.sys_user_add = this.permissions["sys_user_add"];
    this.sys_user_edit = this.permissions["sys_user_edit"];
    this.sys_user_del = this.permissions["sys_user_del"];
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.orderByField = "`user`.gmt_create";
      this.listQuery.isAsc = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    getNodeData(data) {
      this.dialogDeptVisible = false;
      this.form.deptId = data.id;
      this.form.deptName = data.name;
      deptRoleList(data.id).then(response => {
        this.rolesOptions = response.data.records;
      });
    },
    handleDept() {
      fetchDeptTree().then(response => {
        this.treeDeptData = response.data;
        this.dialogDeptVisible = true;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
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
        this.dialogFormVisible = true;
        this.dialogStatus = "update";
        this.role = [];
        for (var i=0;i < row.roleList.length;i++) {
          this.role[i] = row.roleList[i].id
        }
        deptRoleList(response.data.deptId).then(response => {
          console.log(response.data)
          this.rolesOptions = response.data.records;
        });
      });
    },
    create(formName) {
      const set = this.$refs;
      this.form.role = this.role;
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
      this.form.role = this.role;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
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
    deletes(row) {
      this.$confirm(
        "此操作将永久删除该用户(用户名:" + row.username + "), 是否继续?",
        "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        delObj(row.id)
          .then(() => {
            this.getList();
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
              duration: 2000
            });
          })
          .cache(() => {
            this.$notify({
              title: "失败",
              message: "删除失败",
              type: "error",
              duration: 2000
            });
          });
      });
    },
    resetTemp() {
      this.form = {
        id: undefined,
        username: "",
        password: "",
        role: [],
        delFlag: "",
        deptId: "",
        mobile: ""
      };
    }
  }
};

</script>


<script>
    import { fetchList, getObj, addObj, putObj, delObj } from "@/api/user";
    import { deptRoleList, fetchDeptTree } from "@/api/role";
    
    export default {
      data() {
        return {
            staffNumber:'',
            staffPhone:'',
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
   
    .adminContainer {
        
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
                padding-bottom: 10px;
                span {
                    color: #979cb2!important;
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
                
                @media all and (max-width:1200px) {
                    .btn-right {
                        margin-top: 20px;
                        text-align: center;
                        &-inner {
                            width: 180px;
                            margin: 0 auto;
                        }
                    }
                    .btn-border {
                        margin-right: 0!important;
                    }
                    span {
                        display: inline-block;
                        margin-right: 10px;
                        width: 10%;
                    }
                    div {
                        font-size: 12px;
                        margin-bottom: 20px;
                        input {
                            width: 80%;
                        }
                    }
                    
                    
                    
                    
                }
                
                @media all and (min-width:1201px) {
                    span {
                        display: inline-block;
                        margin-right: 20px;
                    }
                    div {
                        float: left;
                        font-size: 12px;
                    }
                    .second {
                        span {
                            margin-left: 50px;
                        }
                    }
                    .btn-right {
                        margin-left: 50px;
                    }
                    
                    
                    
                }
            }
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
    .adminContainer .white-con-table .el-table {
        position: absolute;
        left: 0;
        top: 0;
    }

    .adminContainer .white-con-table .has-gutter th {
        background-color: #eff1ff;
        color: #21223f;
        font-size: 13px;
        font-weight: 700px;
    }

    .adminContainer .white-con-table .cell {
        text-align: center;
    }

    .adminContainer .white-con-table .el-table--striped .el-table__body tr.el-table__row--striped td {
        background-color: #f2f2f8;
        color: #21223f;
        font-size: 12px;
    }

    .adminContainer .white-con-table .el-table--striped .el-table__body tr.el-table__row td {
        color: #21223f;
        font-size: 12px;
    }

    .adminContainer .white-con-table .el-table--border::after,
    .el-table--group::after,
    .el-table::before {
        background-color: #fff;
    }

    .adminContainer .el-table__header-wrapper {
        background-color: #eff1ff;
    }

    .adminContainer .el-table__header {
        width: 100% !important;
    }

    .adminContainer .el-table__body {
        width: 100% !important;
    }
</style>
