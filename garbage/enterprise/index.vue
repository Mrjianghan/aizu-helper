<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input @keyup.enter.native="handleFilter" v-model="listQuery.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-waves @click="handleFilter">{{$t('button.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-waves @click="handleCreate">{{$t('button.add')}}</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名" v-model="listQuery.username">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button v-if="sys_user_add" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button> -->
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row style="width: 99%">
      <el-table-column align="center" :label="$t('table.id')">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司名称">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.logo" class="user-avatar" style="width: 20px; height: 20px; border-radius: 50%;" :src="scope.row.logo+'?imageView2/1/w/20/h/20'"> {{scope.row.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司地址">
        <template slot-scope="scope">
          <span>{{scope.row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="公司规模" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.scale}} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="信用代码" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.businessLicence}} </span>
        </template>
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
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="sys_user_edit" size="small" type="success" @click="handleUpdate(scope.row)">{{$t('button.edit')}}
          </el-button>
          <el-button v-if="sys_user_del" size="small" type="danger" @click="deletes(scope.row)">{{$t('button.del')}}
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
        <el-form-item label="公司LOGO" prop="logo">
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="form.logo" :src="form.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        </el-form-item>
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="公司英文名称" prop="enName">
          <el-input v-model="form.enName" placeholder="请输入公司英文名称"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入公司地址"></el-input>
        </el-form-item>
        <el-form-item label="公司规模" prop="scale">
          <el-select class="filter-item" v-model="form.scale" placeholder="请选择公司规模">
            <el-option label="0-49人" value="49"></el-option>
            <el-option label="50-149人" value="149"></el-option>
            <el-option label="150-499人" value="499"></el-option>
            <el-option label="500-999人" value="999"></el-option>
            <el-option label="1000-4999人" value="4999"></el-option>
            <el-option label="5000-9999人" value="9999"></el-option>
            <el-option label="10000人以上" value="10000"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="businessLicence">
          <el-input v-model="form.businessLicence" placeholder="请输入统一社会信用代码"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="企业邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入企业邮箱"></el-input>
        </el-form-item>
        <el-form-item label="行业" prop="enterpriseType">
          <el-select class="filter-item" v-model="form.enterpriseType" placeholder="请选择行业">
            <el-option label="互联网科技" value="互联网科技"></el-option>
            <el-option label="医疗器械" value="医疗器械"></el-option>
            <el-option label="本地生活" value="本地生活"></el-option>
            <el-option label="广告文化" value="广告文化"></el-option>
            <el-option label="游戏" value="游戏"></el-option>
            <el-option label="餐饮" value="餐饮"></el-option>
            <el-option label="金融服务" value="金融服务"></el-option>
            <el-option label="商贸" value="商贸"></el-option>
            <el-option label="电影休闲娱乐" value="电影休闲娱乐"></el-option>
            <el-option label="职业人才中介" value="职业人才中介"></el-option>
            <el-option label="注册进出口公司类公司" value="注册进出口公司类公司"></el-option>
            <el-option label="建筑" value="建筑"></el-option>
            <el-option label="旅游" value="旅游"></el-option>
            <el-option label="教育" value="教育"></el-option>
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
</template>
<style>
   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<script>
import { fetchList, getObj, addObj, putObj, delObj } from "@/api/enterprise";
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
        logo: undefined,
        name: undefined,
        enName: undefined,
        address: undefined,
        scale: undefined,
        businessLicence: undefined,
        contacts: undefined,
        phone: undefined,
        email: undefined,
        enterpriseType: undefined
      },
      rules: {
        name: [{
            required: true,
            message: "请输入账户",
            trigger: "blur"
          }
        ],
        address: [{
            required: true,
            message: "请输入企业地址",
            trigger: "blur"
          }
        ],
        email: [{
            required: true,
            message: "请输入企业邮箱",
            trigger: "blur"
          },
          {
            min: 4,
            max: 32,
            message: "长度在 4 到 32 个字符",
            trigger: "blur"
          }
        ],
        businessLicence: [{
            required: true,
            message: "请输入统一社会信用代码",
            trigger: "blur"
          },
          {
            min: 18,
            max: 18,
            message: "长度在18 个字符",
            trigger: "blur"
          }
        ],
        contacts: [{
            required: true,
            message: "请输入联系人",
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
      // this.listQuery.orderByField = "`enterprise`.gmt_create";
      this.listQuery.isAsc = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleAvatarSuccess(res, file) {
      this.form.logo = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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
      this.form.role = this.role;
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
        logo: "",
        name: "",
        enName: "",
        address: "",
        scale: "",
        businessLicence: "",
        contacts: "",
        phone: "",
        email: "",
        enterpriseType: ""
      };
    }
  }
};

</script>
