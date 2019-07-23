<template>
  <div class="staffContainer cusDialog">
      <div class="white-con">
          <div class="white-con-top-con">			  
			  <div class="first" v-if="groupShow">
				  <el-select v-model="companyExtra" placeholder="请选择" @change="saveEnterprise(companyExtra)">
					<el-option
					  v-for="item in companyExtraOptions"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
					</el-option>
				  </el-select>
			  </div>
                <div v-permit="'5'" class="first" @click=" popAddDiag">
                    <i class="icon-font icon-jcxx_-6"></i>新增员工
                </div> 
                <div v-permit="'6'" class="importStaffExcelCon">
                    <i class="icon-font icon-jcxx_-3"></i>批量导入
                    <input class="importStaffExcel" ref="importStaffExcel" type="file" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="importChange">
                </div> 
                <div v-permit="'7'" class="third" @click="export2Excel">
                    <i class="icon-font icon-jcxx_-7"></i>导出 
                </div> 
                <div v-permit="'10'" class="four">
                    <a  :href="getTemplateSrc" :download="downloadInfo" target="_blank"><i class="icon-font icon-jcxx_-8"></i>导出模板</a>                    
                </div> 
                <div  v-permit="'8'"  class="third" @click="deleteMany">
                    <i class="icon-font icon-cxsz_-1"></i>删除 
                </div> 
              <div v-permit="'9'"  class="btn-border" @click="addPayType()">
                    +&nbsp;&nbsp;添加新资类别
                </div>
          </div>
          <div class="white-con-top-form">
              <div class="first">
                  <span>员工号</span><input v-model.trim="staffNumber" @blur="saveStaffNumber">
              </div>
              <div class="second">
                  <span>姓名</span><input v-model.trim="staffName" @blur="saveStaffName">
              </div>
              <div class="fourth">
                  <span>手机号</span><input v-model.trim="mobile" @blur="saveMobile"> 
              </div>
              <div class="btn-right">
                  <div class="btn-bg" @click="checkByWay">查询</div><div class="btn-border" @click="reset">重置</div>
              </div>
            </div>
          <div class="white-con-table">
             <el-table  ref="multipleTable"  :data="tableData3"  tooltip-effect="dark"  style="width: 100%"   height="330"  stripe   
            @selection-change="handleSelectionChange">
                <el-table-column     type="selection"> </el-table-column>
                <el-table-column  label="员工号" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.empNo }}</template>
                </el-table-column>
            <el-table-column   prop="name"  label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column label="入职时间" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{   scope.row.hiredate ? scope.row.hiredate.split(' ')[0]  :'暂无'  }}</span>
                  </template>
                </el-table-column>
            <el-table-column  prop="username" label="手机号码" show-overflow-tooltip>
                </el-table-column>
            <el-table-column prop="workingState.message" label="在职状态"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column  prop="department" label="所属部门" show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="position"
                  label="职位"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  label="税后工资"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                        <span>￥{{ scope.row.afterAmount ? scope.row.afterAmount : 0  }}</span>
                      </template>
                </el-table-column>
                  <el-table-column label="操作" min-width="140">
                      <template slot-scope="scope">
						<div class="editCon">
							<div class="showEditNot">
								<div v-permit="'11'"  class="edit" @click="editStaffDetails(scope.$index,scope.row)"><i class="icon-font icon-jcxx_-"></i>管理</div>
									<div v-permit="'24'" class="lock" @click="editCrop(scope.$index,scope.row)"><i class="icon-font   icon-qiehuangongsi-"></i>切换公司
									</div>
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
              <div class="allStaffInfo">
                  <div>当前在职员工<span>{{rightCorner.onjobCount ? rightCorner.onjobCount : 0 }}</span>人</div>
                  <div>当前离职员工<span>{{rightCorner.dimissionCount ? rightCorner.dimissionCount : 0}}</span>人</div>
              </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
      </div>
        <el-dialog class="editStaffDialog"  title="管理" :visible.sync="dialogFormVisible">
            <el-form :model="editruleForm" :rules="editrules" ref="editruleForm" label-width="100px" class="demo-ruleForm">
                <div class="switchEditHead">
                        <div  class="baseSwitch1 " @click="initActive = true,editBaseInfoShow = true" :class="{switchActive : initActive}">基础信息</div>
                        <div class="baseSwitch2" @click="initActive = false,editBaseInfoShow = false" :class="{switchActive : !initActive}">工资信息</div>
                    </div>
                <div class="editMenusContainer">
                    <div v-if="editBaseInfoShow">
                        <el-form-item label="员工号" prop="empNo"  >
                        <el-input v-model="editruleForm.empNo"  :disabled = "editAble"></el-input>
                      </el-form-item>
                        <el-form-item label="员工姓名" >
                        <el-input v-model="editruleForm.name" :disabled = "true"></el-input>
                      </el-form-item>
                        <el-form-item label="证件号" >
                        <el-input v-model="editruleForm.idNo" :disabled = "true"></el-input>
                      </el-form-item>
                        <el-form-item label="入职时间" :label-width="formLabelWidth" >
                              <el-date-picker   prop="hiredate" v-model="editruleForm.hiredate"  align="right" type="date"  placeholder="选择日期"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions1" :disabled = "editAble">
                                </el-date-picker>
                      </el-form-item>
                       <el-form-item label="手机号码">
                        <el-input v-model="editruleForm.mobile" :disabled = "true"></el-input>
                      </el-form-item>
                        <el-form-item label="在职状态" prop="workingState">
                            <el-select v-model="editruleForm.workingState" placeholder="选择在职状态" :disabled = "editAble">
                                <el-option label="在职" value="ON_JOB"></el-option>
                                  <el-option label="离职" value="DIMISSION"></el-option>
                              </el-select>
                      </el-form-item>
                        <el-form-item label="部门" prop="department">
                        <el-input v-model="editruleForm.department" :disabled = "editAble"></el-input>
                      </el-form-item>
                        <el-form-item label="职位" prop="position">
                        <el-input v-model="editruleForm.position" :disabled = "editAble"></el-input>
                      </el-form-item>
                        <el-form-item label="开户银行" prop="bankName">
                            <el-input v-model="editruleForm.bankName"></el-input>
                          </el-form-item>
                        <el-form-item label="银行卡号" prop="bankNo">
                        <el-input v-model="editruleForm.bankNo" :disabled = "editAble"></el-input>
                      </el-form-item>
                        <el-switch
                            :disabled = "editAble"       
                          v-model="editruleForm.forbidden"
                          :active-value="'0'"
                          :inactive-value="'1'"
                          active-text="启用"
                          inactive-text="禁用">
                        </el-switch>
                </div>
                    <div v-else>
                        <el-form-item label="税后工资" >
                        <el-input v-model.trim="editruleForm.afterAmount" @blur="afterChange" :disabled = "editAble"></el-input>
                      </el-form-item>
                        <el-form-item :label="i.name" v-for="i in filterArr" :key="i.id">
                            <el-input v-model="editruleForm[i.code]" @blur="extraChange(i.code,$event)" :disabled = "editAble"></el-input>
                          </el-form-item>                        
                    </div>
                </div>                
                <div class="editBtnContainer">
                    <div v-permit="'12'" @click="editsubmitForm('editruleForm')">修改</div>
                    <div @click="editresetForm('editruleForm')">取消</div>
                </div >
            </el-form>   
        </el-dialog>
        <el-dialog class="addStaffDialog"   title="添加员工" :visible.sync="dialogAddFormVisible">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">              
                <div class="switchEditHead">
                        <div  class="baseSwitch1 " @click="initActive3 = true,editBaseInfoShow3 = true" :class="{switchActive : initActive3}">基础信息</div>
                        <div class="baseSwitch2" @click="initActive3 = false,editBaseInfoShow3 = false" :class="{switchActive : !initActive3}">工资信息</div>
                </div>
                <div class="addMenusContainer">
                    <div v-if="editBaseInfoShow3">
                        <el-form-item label="员工号" prop="empNo">
                            <el-input v-model="ruleForm.empNo"></el-input>
                          </el-form-item>
                            <el-form-item label="员工姓名" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                          </el-form-item>
                            <el-form-item label="证件号" prop="idNo">
                            <el-input v-model="ruleForm.idNo"></el-input>
                          </el-form-item>
                            <el-form-item label="入职时间" :label-width="formLabelWidth" >
                                  <el-date-picker   prop="hiredate" v-model="ruleForm.hiredate" align="right"  type="date" placeholder="选择日期" format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"   :picker-options="pickerOptions1">
                                    </el-date-picker>
                          </el-form-item>
                           <el-form-item label="手机号码" prop="username">
                            <el-input  v-model="ruleForm.username"></el-input>
                          </el-form-item>
                         <el-form-item label="部门" prop="department">
                            <el-input v-model="ruleForm.department"></el-input>
                          </el-form-item>
                            <el-form-item label="职位" prop="position">
                            <el-input v-model="ruleForm.position"></el-input>
                          </el-form-item>
                            <el-form-item label="开户银行" prop="bankName">
                            <el-input v-model="ruleForm.bankName"></el-input>
                          </el-form-item>
                            <el-form-item label="银行卡号" prop="bankNo">
                            <el-input v-model="ruleForm.bankNo"></el-input>
                          </el-form-item>
                    </div>
                    <div v-else>
                        <el-form-item label="税后工资" prop="afterAmount">
                            <el-input v-model.number="ruleForm.afterAmount"></el-input>
                          </el-form-item>
                          <el-form-item :label="i.name" v-for="i in filterArr" :key="i.id">
                            <el-input v-model="ruleForm[i.code]"></el-input>
                          </el-form-item>
                    </div>
                </div>
                <div class="addBtnContainer">
                    <div @click="submitForm('ruleForm')">确定</div>
                    <div @click="resetForm('ruleForm')">取消</div>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog class="details"   title="添加工资类别" :visible.sync="dialogVisible3">
            <div style="text-align: left;height:440px">
                <el-checkbox-group v-model="checkList">
					<div class="threeDivideContainer">
						<div class="threeDivide firstDivide">
							<el-checkbox v-for="item in oneAllList" :label="item.name" :checked="item.status==1" :key="item.id"></el-checkbox>
						</div>
						<div class="threeDivide secondDivide">
							<el-checkbox v-for="item in twoAllList" :label="item.name" :checked="item.status==1" :key="item.id"></el-checkbox>
						</div>
						<div class="threeDivide thirdDivide">
							<el-checkbox v-for="item in threeAllList" :label="item.name" :checked="item.status==1" :key="item.id"></el-checkbox>
						</div>
					</div>
                 </el-checkbox-group>           
            </div>
            <span slot="footer" class="dialog-footer">
                <div class="confirm3" @click="handleConfirm3">确 定</div>
                <div class="cancel3" @click="handleCancel3">取 消</div>
            </span>
        </el-dialog>
		<el-dialog class="spe details"   title="提示" :visible.sync="dialogVisibleEnterprise">
            <div style="text-align: left;">无授权公司</div>
            <span slot="footer" class="dialog-footer">
                <div class="confirm3" @click="dialogVisibleEnterprise = false">确 定</div>
            </span>
        </el-dialog>
		<el-dialog class="detailsEnterpriseAno details"   title="提示" :visible.sync="dialogEnterpriseOne">
            <div style="text-align: left;">确定向{{enterpriseName}}批量导入</div>
            <span slot="footer" class="dialog-footer">
                <div class="confirm3" @click="inputChangeConfirm">确 定</div>
				<div class="cancel3" @click="inputChangeCancel">取 消</div>
            </span>
        </el-dialog>

		<el-dialog class="detailsEnterpriseSwitch details"   title="选择公司" :visible.sync="switchShow">
                 <el-select v-model="setCrop" placeholder="请选择公司" @change="setCropChange(setCrop)">
					<el-option
					  v-for="item in companyExtraOptions"
					  :key="item.value"
					  :label="item.label"
					  :value="item.value">
					</el-option>
				  </el-select>
            <span slot="footer" class="dialog-footer">
                <div class="confirm3" @click="setCropConfirm">确 定</div>
				<div class="cancel3" @click="setCropCancel">取 消</div>
            </span>
        </el-dialog>
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
				setCrop:'',
				switchShow:false,
				dialogEnterpriseOne:false,
				dialogVisibleEnterprise:false,
				groupShow:false,
				companyExtra:'',
				companyExtraOptions:[],
                editAble:false,
                editBaseInfoShow:true,
                editBaseInfoShow2:true,
                checkList: [],
                allSetList: [],
                oneAllList:[],
                twoAllList:[],
                threeAllList:[],
                pickerOptions1: {
                  shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                      picker.$emit('pick', new Date());
                    }
                  }, {
                    text: '昨天',
                    onClick(picker) {
                      const date = new Date();
                      date.setTime(date.getTime() - 3600 * 1000 * 24);
                      picker.$emit('pick', date);
                    }
                  }, {
                    text: '一周前',
                    onClick(picker) {
                      const date = new Date();
                      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', date);
                    }
                  }]
                },
                filterArr:[],
                initActive:true,
                initActive2:true,
                value4: true,
                downloadInfo:'员工信息模板'+day(Date.now()).format("YYYY年MM月DD日HH时mm分")+'.xls',
                getTemplateSrc:'',
                options: [{
                  value: 'ID_CARD',
                  label: '身份证'
                }, {
                  value: 'PASSPORT',
                  label: '护照'
                }],
                transSwitch:[],
               ruleForm: {
                  name: '',
                  hiredate: '',
                   empNo:'',
                   idNo:'',
                   username:'',
                   position:'',
                   afterAmount:'',
                   bankName:'',
                   bankNo:'',
                   department:'',
                },
                editruleForm: {
                    id:'',
                  name: '',
                  hiredate: '',
                   empNo:'',
                   idNo:'',
                   mobile:'',
                    workingState:'',
                   position:'',
                   bankNo:'',
                   department:'',
                    forbidden:'',
                    bankName:'',
                },
                detailsForm:{},                
                editrules: {
                  name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                  ],
                  hiredate: [
                    { type: 'date', message: '请选择日期', trigger: 'change' }
                  ],
                  empNo: [
                    { required: true, message: '请输入员工号', trigger: 'blur' }
                  ],
//                    idNo: [
//                    { required: true, message: '请输入证件号', trigger: 'blur' },
//                     {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '证件号码格式有误！', trigger: 'blur'}
//                  ],
                    workingState:[
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    forbidden:[
                        { required: true, message: '请选择状态', trigger: 'blur' }
                    ],
                    mobile: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                        { min: 4, max: 11, message: '长度在 4 到 11 个字符', trigger: 'blur' }
                  ],
                    position: [
                    { message: '请输入职位信息', trigger: 'blur' }
                  ],
                     bankNo: [
                    { required: true, message: '请输入银行卡号', trigger: 'blur'},
                         {pattern: /(^[0-9]*$)/, message: '卡号格式有误！', trigger: 'blur'}
                  ],
                     department: [
                    {  message: '请输入部门', trigger: 'blur' }
                  ],
                     bankName: [
                    { required: true, message: '请输入开户银行', trigger: 'blur' },
                  ],
                },
                rules: {
                  name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                  ],
                  hiredate: [
                    { type: 'date',  message: '请选择日期', trigger: 'change' }
                  ],
                  empNo: [
                    { required: true, message: '请输入员工号', trigger: 'blur' }
                  ],
                    idNo: [
                    { required: true, message: '请输入证件号', trigger: 'blur' },
                     {pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '证件号码格式有误！', trigger: 'blur'}
                  ],
                    username: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                        { min: 4, max: 11, message: '长度在 4 到 11 个字符', trigger: 'blur' }
                  ],
                    position: [
                    {  message: '请输入职位信息', trigger: 'blur' }
                  ],
                    afterAmount: [
                    { required: true, message: '请输入税后工资', trigger: 'blur' },
                        { type: 'number', message: '必须为数字值'}
                  ],
                    bankName: [
                    { required: true, message: '请输入开户银行', trigger: 'blur' },
                  ],
                     bankNo: [
                    { required: true, message: '请输入银行卡号', trigger: 'blur'},
                         {pattern: /(^[0-9]*$)/, message: '卡号格式有误！', trigger: 'blur'}
                  ],
                  department: [
                    {  message: '请输入部门', trigger: 'blur' }
                  ]
                },
                formLabelWidth: '120px',
                dialogFormVisible:false,
                dialogAddFormVisible:false,
                staffNumber:'',
                staffName:'',
                mobile:'',
                currentPage1: 1,
                tableData3: [],
                multipleSelection: [],
                totalLists:0,
                current:1,
                size:10,
                allPages:0,
                waitDeleteArr:[],
                rightCorner:{},
                dialogVisible3:false,
                initActive3:true,
                editBaseInfoShow3:true,
                list:[],
				fileForm:null,
				storeId:'',
            }
        },
        mounted(){
            this.dealEnterprise();
			let data = {
                    empNo:this.staffNumber ? this.staffNumber :undefined ,
                    name:this.staffName ? this.staffName :undefined,
                    mobile:this.mobile ? this.mobile  :undefined,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
            };
            this.withParamsGetAllStaff(data);
            this.exportStaffTemplate();
            this.getTypeList();
            this.inputAble();	
        },
        computed:{
			enterpriseName(){
				if(this.companyExtraOptions.length){
				   let res = this.companyExtraOptions.filter((ele,index)=>{
					   if(ele.value == this.companyExtra){
						   return this.companyExtraOptions[index];
					   }
				   });
					return res[0].label;
				}else {
					return null;
				}
			},
		},
        methods:{
			dealEnterprise(){								
				let group = storejs.get('userInfo').group;
				if( group ){
				   this.groupShow = true;  
				}else{
					this.groupShow = false;   
				}
				let simpleEnterpriseList = storejs.get('userInfo').simpleEnterpriseList;
				this.companyExtraOptions = simpleEnterpriseList;
				this.getQueryValue();
			},
			editCrop(index,row){
				console.log( row );	
				this.switchShow = true;
				this.setCrop = this.companyExtra;
				this.storeId = row.id;
			},
			setCropChange(val){
				console.log(val);				
			},
			setCropConfirm(){
				let data = {                    
					newEpId:this.setCrop,
					accountId:this.storeId,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
				};	
				apiTwo.switchSubEnterpirse(data).then(res=>{
					console.log(res);
					if(res.success){
                        this.switchShow = false;
						this.setCrop = '';
                        this.$message({
                          message: '修改成功。',
                          type: 'success'
                        });
						let data = {
								empNo:this.staffNumber ? this.staffNumber :undefined ,
								name:this.staffName ? this.staffName :undefined,
								mobile:this.mobile ? this.mobile  :undefined,
								size:this.size,
								subEpId:this.companyExtra ? this.companyExtra  : undefined,
						};
						this.withParamsGetAllStaff(data);
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err => {
                    errInfo.err(err); 
                });
			},
			setCropCancel(){
				this.switchShow = false;
				this.setCrop = '';
			},
            getQueryValue(){
                let staffNO = storejs.get('baseEmployerStaffNumber');
                let staffName = storejs.get('baseEmployerStaffName');
                let mobile = storejs.get('baseEmployerMobile');     
				let enterprise = storejs.get('baseEmployerEnterprise'); 
                if(staffNO){
                   this.staffNumber = staffNO;
                }
                if(staffName){
                   this.staffName = staffName;
                }
                if(mobile){
                   this.mobile = mobile;
                }
				if(enterprise){
				   this.companyExtra = enterprise;
				}else{
					if(this.companyExtraOptions.length){
						this.dialogVisibleEnterprise = false;
						this.companyExtra = this.companyExtraOptions[0].value;
					}else{
						this.dialogVisibleEnterprise = true;
					}
				}
            },
			saveEnterprise(val){
				storejs.set('baseEmployerEnterprise',val);
				let data = {
                    empNo:this.staffNumber ? this.staffNumber :undefined ,
                    name:this.staffName ? this.staffName :undefined,
                    mobile:this.mobile ? this.mobile  :undefined,     
					size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
            	};
				this.withParamsGetAllStaff(data);
				this.exportStaffTemplate();
			},
            saveStaffNumber(){
                storejs.set('baseEmployerStaffNumber',this.staffNumber);
            },
            saveStaffName(){
                storejs.set('baseEmployerStaffName',this.staffName);
            },
            saveMobile(){
                storejs.set('baseEmployerMobile',this.mobile);
            },
            inputAble(){
                let permissions = storejs.get('userInfo').permissions;
                let editTrans = permissions.filter(ele=>{
                    return ele == '12';
                })
                if(editTrans.length){
                    this.editAble = false;
                }else {
                    this.editAble = true;
                }
            },
             popAddDiag(){
                 this.dialogAddFormVisible = true;
                 this.getTypeList();                  
             },
            export2Excel() {
                if( this.tableData3.length ){
					let data = {						
						subEpId:this.companyExtra ? this.companyExtra : undefined,	
					};					
                    apiTwo.exportBtnExcel(data).then(res=>{                        
                        let now = Date.now();
                        let timeMark = day(now).format("YYYY年MM月DD日HH时mm分");
                        const content = res;
                        const blob = new Blob([content]);
                        const fileName = '员工列表'+timeMark+'.xls';
                        if ('download' in document.createElement('a')) { // 非IE下载                            
                            const elink = document.createElement('a');
                            elink.download = fileName;
                            elink.style.display = 'none';
                            elink.href = URL.createObjectURL(blob);
                            document.body.appendChild(elink);
                            elink.click();
                            URL.revokeObjectURL(elink.href); // 释放URL 对象
                            document.body.removeChild(elink)
                        } else { // IE10+下载
                            navigator.msSaveBlob(blob, fileName)
                        }
                    }).catch(err=>{});
                }
            },
            afterChange(){
                let numberValue = this.editruleForm.afterAmount;
                if(numberValue){
                    if( isNaN( numberValue )  ){
                        this.editruleForm.afterAmount = '';
                        this.$message.error('必须为数字');
                        //也不提交该项
                    }
                }else {
                    this.$message.error('不能为空。');
                }
            },
            handleConfirm3(){
                let ids = [];
                for(let i=0;i<this.allSetList.length;i++){
                  for(let j=0;j<this.checkList.length;j++){
                        if(this.checkList[j] == this.allSetList[i].name){
                            ids.push(this.allSetList[i].id)
                        }
                  }
                }
                api.openUpdateSalaryCategory(ids).then(res => {
                    if(res.success){
                        this.dialogVisible3 = false;
                        this.$message({
                          message: '修改成功。',
                          type: 'success'
                        });
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err => {
                    errInfo.err(err); 
                });
            },
            handleCancel3(){
                this.dialogVisible3 = false;
            },
            getTypeList(){
            	api.getQueryAll().then(res => {
                    if(res.success){
                        this.allSetList = res.data;
                            let all = this.allSetList;
                            this.oneAllList = [];
                            this.twoAllList = [];
                            this.threeAllList  = [];
                            let temp1 = this.allSetList.filter(ele=>{
                                return ele.category === 1;
                            });
                            let temp2 = this.allSetList.filter(ele=>{
                                return ele.category === 2;
                            });
                            let temp3 = this.allSetList.filter(ele=>{
                                return ele.category === 3;
                            });
                            this.oneAllList = temp1;
                            this.twoAllList = temp2;
                            this.threeAllList  = temp3;
                            var filter = res.data.filter(ele=>{
                                return ele.status == '1';
                            })													
                            this.filterArr = filter;							
                        }else{
                            this.$message.error(res.message);
                        }
                }).catch(err=>{
                    errInfo.err(err); 
                });
            },
            addPayType() {
                this.dialogVisible3 = true;
            },
            deleteMany(){
                if ( this.waitDeleteArr.length > 0 ){
                let data = {
                    ids:this.waitDeleteArr,
					subEpId:this.companyExtra ? this.companyExtra : undefined,					
                };
                apiTwo.deleteEmployer(data).then(res=>{
                    if(res.success){
                        this.$message({
                              message: '删除成功',
                              type: 'success'
                            });						
						let data = {
							empNo:this.staffNumber ? this.staffNumber :undefined ,
							name:this.staffName ? this.staffName :undefined,
							mobile:this.mobile ? this.mobile  :undefined,								
							subEpId:this.companyExtra ? this.companyExtra  : undefined,
							size:this.size,
						};
                        this.withParamsGetAllStaff(data);
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err); 
                })
                }else {
                    this.$message.error('请选择员工。');
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                      let data = this.ruleForm;					  
					  if(this.companyExtraOptions.length){
						 data.subEpId = this.companyExtra
						}
					  this.addStaff(data);					  
                  } else {
                    this.$message.error('请检查表单。');
                    return false;
                  }
                });
              },
              resetForm(formName) {
                  this.dialogAddFormVisible = false;
                  this.$refs[formName].resetFields();
              },
            extraChange(val,$event){
                let length = $event.currentTarget.value.trim().length;
                let numberValue = Number($event.currentTarget.value.trim() );
                if( length > 0 ){
                   //不为空
                    if( isNaN( numberValue )  ){
                        $event.currentTarget.value = '';
                        this.$message.error('必须为数字');
                        //也不提交该项
                    }else {
                        this.editruleForm[val]= numberValue;
                    }                    
                }else {
                   //为空不提交
                    this.$message.error('不能为空');
                }
            },
            editsubmitForm(editformName) {
                if( this.editBaseInfoShow ){
                    //显示基础信息
                    this.$refs[editformName].validate((valid) => {
                      if (valid) {
                          let data = this.editruleForm;
						  if(this.companyExtraOptions.length){
						 data.subEpId = this.companyExtra
						}
                          apiTwo.editEmployerInfo(data).then(res=>{
                              if(res.success){
                                 this.$message({
                                  message: '修改成功',
                                  type: 'success'
                                });
                                this.reset();
                                  this.dialogFormVisible = false;
                              }else{
                                  this.$message.error(res.message);
                              }
                          }).catch(err=>{
                              errInfo.err(err); 
                          })
                      } else {
                        this.$message.error('请检查表单。');
                        return false;
                      }
                    });                   
                }else {
                    //显示金额信息
                    let data = this.editruleForm;
                    apiTwo.editEmployerInfo(data).then(res=>{
                        if(res.success){
                            this.$message({
                                  message: '修改成功',
                                  type: 'success'
                                });
                                this.reset();
                                this.dialogFormVisible = false;
                        }else{
                            this.$message.error(res.message);
                        }
                    }).catch(err=>{
                        errInfo.err(err); 
                    })                   
                }
              },
              editresetForm(editformName) {
                  this.dialogFormVisible = false;
              },
            editStaffDetails(index,row){
                let getArr = this.getTypeList();
                //管理
                this.dialogFormVisible = true;
                let fixTime = row. hiredate ?  row. hiredate.split(' ')[0] : '';
                let data = {
                    id:row.id
                };
                apiTwo.queryStaffDeatils(data).then(res=>{
                    if(res.success){
                        let trans = res.data;	
                        this.editruleForm= {
                            id:trans.id,
                            name: trans.name,
                            hiredate: fixTime,
                            empNo:trans.empNo,
                            idNo:trans.idNo,
                            mobile:trans.mobile,
                            workingState:trans.workingState.name,
                            position:trans.position,
                            afterAmount:Number(trans.afterAmount),
                            bankNo:trans.bankNo,
                            bankName:trans.bankName,
                            department:trans.department,
                            forbidden:String(trans.forbidden),
							
                            falseDeductions:trans.falseDeductions,
                            overtimePay:trans.overtimePay,
                            attendanceBonus:trans.attendanceBonus,
                            arriveLate:trans.arriveLate,
                            leaveEarly:trans.leaveEarly,
                            housingAllowance:trans.housingAllowance,
                            fareSubsidy:trans.fareSubsidy,
                            socialSecuritySubsidy:trans.socialSecuritySubsidy,
                            endowmentInsurance:trans.endowmentInsurance,
                            medicalInsurance:trans.medicalInsurance,
                            unemploymentInsurance:trans.unemploymentInsurance,
                            employmentInjuryInsurance:trans.employmentInjuryInsurance,
                            maternityInsurance:trans.maternityInsurance,
                            housingFund:trans.housingFund,
                            personalIncomeTax:trans.personalIncomeTax,
                            communicationExpense:trans.communicationExpense,
                            sickLeave:trans.sickLeave,
                            commercialHealthInsurance:trans.commercialHealthInsurance,
                            basicWage:trans.basicWage,
                            jobWage:trans.jobWage,
                            performancePay:trans.performancePay,
                            subsidy:trans.subsidy,
                        };
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err); 
                })
            }, 
			importAction(formData){
				 api.importStaffExcel(
                        formData
                    ).then(res=>{
                        if( res.success ){
                           //上传成功
                            this.$refs.importStaffExcel.value = '';
                            this.$message({
                              message: '上传成功，请稍后刷新列表。',
                              type: 'success'
                            });               
							this.fileForm = null;							
							let data = {
									empNo:this.staffNumber ? this.staffNumber :undefined ,
									name:this.staffName ? this.staffName :undefined,
									mobile:this.mobile ? this.mobile  :undefined,
									subEpId:this.companyExtra ? this.companyExtra  : undefined,
								size:this.size,
							};
                            this.withParamsGetAllStaff(data);
                        }else {
                           //上传失败
                             this.$message.error('上传失败');
                            this.$refs.importStaffExcel.value="";
                            this.$message.error(res.message);
							this.fileForm = null;
                        }
                    }).catch(err=>{
                        errInfo.err(err); 
                        this.$refs.importStaffExcel.value="";
					 this.fileForm = null;
                    })
			},			
			inputChangeConfirm(){				
				this.importAction( this.fileForm );
				this.dialogEnterpriseOne = false;
			},
			inputChangeCancel(){
				this.fileForm = null;
				this.dialogEnterpriseOne = false;
				 this.$refs.importStaffExcel.value="";
			},
            importChange(){
                //导入
                var file = this.$refs.importStaffExcel.files[0];
                const excelReg = /(.(xls|xlsx))+$/i;
                if (excelReg.test(file.name) === false) {
                    this.$message.error('请导入文件类型为excel格式的表格文件。');
                    this.$refs.importStaffExcel.value="";
                    return false;
                }else {
                    const formData = new FormData();
                    formData.append('file',file);
					if(this.groupShow){
					   formData.append('subEpId',this.companyExtra);
					};					
					if(this.groupShow){	
						this.dialogEnterpriseOne = true;
						this.fileForm = formData;					
					}else{
					   this.importAction(formData);	
					}
                }
            },
            addStaff(data){  
                //添加员工
                api.addStaff(data).then(res=>{
                    if( res.success ){
                       this.reset();
                        this.dialogAddFormVisible = false;
                        this.$message({
                          message: '已添加成功。',
                          type: 'success'
                        });
                        this.ruleForm={};
						let data = {
								empNo:this.staffNumber ? this.staffNumber :undefined ,
								name:this.staffName ? this.staffName :undefined,
								mobile:this.mobile ? this.mobile  :undefined,
								subEpId:this.companyExtra ? this.companyExtra  : undefined,
							size:this.size,
						};
						this.withParamsGetAllStaff(data);
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err); 
                })
            },  
            checkByWay(){
				let data = {
					empNo:this.staffNumber ? this.staffNumber :null ,
					name:this.staffName ? this.staffName :null,
					mobile:this.mobile ? this.mobile  :null,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
					size:this.size,
				};
                this.withParamsGetAllStaff(data);
            },
            reset(){
                    this.staffNumber = "";
                    this.staffName = '';
                    this.mobile = '';
                    storejs.remove('baseEmployerStaffNumber');
                    storejs.remove('baseEmployerStaffName');
                    storejs.remove('baseEmployerMobile'); 
					let data = {
						empNo:this.staffNumber ? this.staffNumber :undefined ,
						name:this.staffName ? this.staffName :undefined,
						mobile:this.mobile ? this.mobile  :undefined,
						subEpId:this.companyExtra ? this.companyExtra  : undefined,
						size:this.size,
					};
                    this.withParamsGetAllStaff(data);
            },           
            handleSelectionChange(val) {
                this.multipleSelection = val;
                var filter = val.map(ele=>{
                    let obj = {};
                    return obj.id= ele.id;
                })
                this.waitDeleteArr = filter;
            },
            handleSizeChange(val) {
                this.size = val;
				let data = {
						empNo:this.staffNumber ? this.staffNumber :undefined,
						name:this.staffName ? this.staffName :undefined,
						mobile:this.mobile ? this.mobile  :undefined,
						size:this.size,
						subEpId:this.companyExtra ? this.companyExtra  : undefined,
				};
                this.withParamsGetAllStaff(data);
              },
              handleCurrentChange(val) {
                  this.current = val;
				  let data = {
						empNo:this.staffNumber ? this.staffNumber :undefined ,
						name:this.staffName ? this.staffName :undefined,
						mobile:this.mobile ? this.mobile  :undefined,
						current:this.current,
						size:this.size,
						subEpId:this.companyExtra ? this.companyExtra  : undefined,
				};
                  this.withParamsGetAllStaff(data);
              },
            withParamsGetAllStaff(data){
                api.getAllStaff( data ).then(res=>{
                    if(res.success){
                        this.tableData3 = res.data.records;
                        this.totalLists = res.data.total;
                        this.rightCorner = res.data.extendData ? res.data.extendData :{};
                        this.allPages = Math.ceil ( res.data.total/this.size ) ;
						this.current = res.data.current;
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err); 
                })
            },
            exportStaffTemplate(){
				let data = {
					subEpId:this.companyExtra ? this.companyExtra  : undefined, 
				};
                apiTwo.exportEmployerExcel(data).then(res=>{
                    let blob = new Blob([res],{type : 'application/vnd.ms-excel'});
                    let transSrc = URL.createObjectURL(blob);
                    this.getTemplateSrc = transSrc;
                }).catch(err=>{
                    errInfo.err(err); 
                });
            }
        },
    }  
</script>
<style lang="scss" scoped>    
	.editCon {
	}
    .showEditNot {
        height: 30px;
		width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-around;
        align-content: center;
        align-items: center;
        .edit,.lock {
            line-height: 28px;
            color: #6477ff;
            cursor: pointer;
            .icon-font {
                font-size: 12px;
            }
        }
    }
    .switchActive {
        border-bottom-color: #6479ff !important;
        color: #6479ff;
    }
    .switchEditHead {
        height: 30px;
        margin-bottom: 20px;
        font-size: 15px;
        .baseSwitch1 {
            display: inline-block;
            padding-bottom: 10px;
            border-bottom: 2px solid transparent;
            margin-right: 20px;
            cursor: pointer;
        }
        .baseSwitch2 {
            display: inline-block;
            padding-bottom: 10px;
            border-bottom: 2px solid transparent;
            cursor: pointer;
        }
    }   
    .check {
        text-align: center;
        width: 50px;
        display: inline-block;
        line-height: 28px;
        color: #6477ff;
        cursor: pointer;
        margin-left: 10px;
    }
    .tar {
        display: inline-block;
        vertical-align: top;
        width: 40%;
        height: 23px;
        line-height: 23px;
        text-align: center;
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
	.editStaffDialog {
        .editMenusContainer {
            height: 370px;
            overflow: scroll;
        }
        .editBtnContainer {
            padding-top: 15px;
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
    .staffContainer {
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
                .btn-border{
                    float: left;
                    width: 110px;
                    height: 30px;
                    border: 1px solid #6479ff;
                    color: #6479ff;
                    text-align: center;
                    line-height: 28px;
                    font-size: 12px;
                    border-radius: 20px;
                    box-sizing: border-box;
                    cursor: pointer;
                    margin-right: 0;
                }
                    .icon-font {
                        font-size: 14px !important;
                        margin-right: 6px;
                    }
                    div {
                        float: left;
                        cursor: pointer;
                        margin-right: 20px;
                    }
                    .four{
                        margin-right: 0;
                        float: right;
                        text-align: right;
                    }
            }
            &-top-form {
                overflow: hidden;
                display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: flex-start;
				align-content: center;
				align-items: center;
				font-size: 12px;
				input {
					padding-left: 20px;
				}
                .btn-bg{
                     width: 56px !important;
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
                      margin-right: 22px;
                      cursor: pointer;
                  }
                 .btn-border{
                      width: 56px!important;
                      height: 30px;
                      float: left;
                      border: 1px solid #6479ff;
                      color: #6479ff;
                      text-align: center;
                      line-height: 30px;
                      border-radius: 20px;
                      box-sizing: border-box;
                      cursor: pointer;
                      margin-right: 0;
                }
				span {
				   color: #979cb2!important;
					margin-right: 10px;					
				}
				div {
					input {
						width: 143px;
						height: 30px;
						border: 1px solid #f2f2f2;
					}
					margin-right: 20px;	
				}
				.first {
					margin-bottom: 30px;
				}
				.second {
					margin-bottom: 30px;
				}
				.fourth {
					margin-bottom: 30px;
				}
				.btn-right {
					margin-bottom: 30px;
				}
            }            
            &-table {
                position: relative;
                background-color: #fff;
                height: 360px;
                margin-bottom: 20px;
            }
            &-bottom {
                position: relative;
                @media all and (max-width:1190px){
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
                @media all and (min-width:1191px){
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
    .btn-bg{
        box-shadow: 0 10px 6px -4px rgba(122,175,253,0.6); 
    }
    .importStaffExcelCon {
        cursor: pointer;
        position: relative;        
        .importStaffExcel {
            position: absolute;
            width: 70px;
            left: 0;
            opacity: 0;
            cursor: pointer;
        }
    }
</style>
<style lang="scss">	
	.staffContainer {
		.white-con-table .has-gutter th{
			background-color: #eff1ff;
			color: #21223f;
			font-size: 13px;
			font-weight: 700px;
		}
		.white-con-table .el-table {
			position: absolute;
			left: 0;
			top:0;
		}
		.el-table__fixed-header-wrapper th:last-child {
			position: relative;
			border-bottom: none;
			.cell {
				position: absolute;
				height: 51px;
				top: 0;
				color: #21223f;
				background-color: #eff1ff;
				line-height: 51px;
				padding-left: 0;
				padding-right: 0;
			}
		}
		.el-table__fixed-header-wrapper .el-table_1_column_14 {
			position: relative;
			.cell {
				position: absolute;
				height: 51px;
				top: 0;
				line-height: 51px;
				padding-left: 0;
				padding-right: 0;
				color: #21223f;
				background-color: #eff1ff;
			}
		}
		.white-con-table .cell{
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
		.el-table__header-wrapper {
			background-color: #eff1ff;
		}
		.ban {
			.el-switch__label >span {
				font-size: 12px!important;
			}    
			.el-switch__label.is-active {
				color: #6679ff;
			}
		}   
	}	
	.cusDialog {		
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
		.el-dialog {
			border-radius: 10px;
			height: 580px;
			width: 480px;
		}  	
		.spe .el-dialog{
			height: 200px !important;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto !important;		
		}
		.detailsEnterpriseSwitch .el-dialog{
			height: 230px !important;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto !important;		
		}
		.detailsEnterpriseAno .el-dialog{
			height: 200px !important;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto !important;		
		}
	}	
	.spe {
		.confirm3 {
			margin: 0 auto !important;
			float: none !important;
		}
	}
    .editMenusContainer {
        .el-switch {
            left: 36%;
        }
    }
	.staffContainer   {
        .el-table::before {
            height: 0;
        }
		.first {
			.el-select {
				.el-input__inner {
					height: 30px;
					line-height: 30px;
					border-color: #f2f2f2 !important;
				}
			}
		}
		.details {
			.el-dialog {
				border-radius: 10px;
				height: 620px;
				width: 500px;
			}
			.el-checkbox {
				width: 100px;
				margin: 10px 0;
				margin-left: 10px;
			}    
			.el-dialog__footer .confirm3{
				box-shadow: 0 10px 6px -4px rgba(122, 175, 253, 0.6);
				width: 120px !important;
				background-image: linear-gradient(-10deg, #48a3fc 0%, #767efd 100%);
				color: #fff;
				height: 40px;
				line-height: 40px;
				text-align: center;
				border-radius: 20px;
				cursor: pointer;
				font-size: 14px;
				box-sizing: border-box;
				float: left;
				margin-left: 100px;
			}
			.el-dialog__footer {
				overflow: hidden;
			}
			.el-dialog__footer  .cancel3{
				background: #fff;
				box-shadow: none;
				color: #6479ff;
				height: 40px;
				line-height: 40px;
				width: 120px !important;
				border: 1px solid #6479ff;
				box-sizing: border-box;
				text-align: center;
				border-radius: 20px;
				float: right;
				margin-right: 100px;
			}
		}
		.threeDivide {
			width: 33.333%;
		}  
		.firstDivide {
			border-right: 1px solid #eee;
			height: 440px;       
		}
		.secondDivide {
			border-right: 1px solid #eee;
			height: 440px;        
		}
		.thirdDivide {
			height: 440px;        
		}
		.threeDivideContainer {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: space-around;
			align-content: center;
			align-items:flex-start;
		}
    }  
	.cancel3 {
		cursor: pointer;
	}
</style>