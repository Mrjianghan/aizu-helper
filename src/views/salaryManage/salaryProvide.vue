<template>
    <div class="salaryProvideContainer">
        <div class="white-con">
            <div class="white-con-top-con">				
				<div class="baseOne" v-if="groupShow">
					<el-select v-model="companyExtra" placeholder="请选择" @change="saveEnterprise(companyExtra)">
						<el-option
							  v-for="item in companyExtraOptions"
							  :key="item.value"
							  :label="item.label"
							  :value="item.value">
						</el-option>
					</el-select>
				</div>
                <div class="baseOne" @click="baseInfo"><i class="icon-font icon-jcxx_-6"></i>按员工信息发放</div>
                <div v-permit="'15'" class="salaryProvideInputCon baseTwo">
                    <input ref="salaryProvideInput"  type="file" accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="basefileChange">
                    <div class="salaryProvideDiv"><i class="icon-font icon-jcxx_-3"></i>导入文件发放</div>
                    <div class="cancelUploadBtn" v-show="grantType === 'TEMP'" @click="previewCancel">取消预览</div>
                    <div class="progresserContainer" v-show="upLoadEx"><el-progress :percentage="progressBar"></el-progress></div>
                </div>
               <div v-permit="'16'" class="baseThree"><a :href="getExcelSrc" :download="downloadInfo" target="_blank"><i class="icon-font icon-jcxx_-8"></i>导出模板</a></div>
            </div>
            <div class="white-con-button">
                <div v-permit="'17'" class="btn-bg" @click="ifProvide">确认发放</div>
                <div v-permit="'18'" class="export" @click="exportExcel"><i class="icon-font icon-jcxx_-7"></i>导出</div>
            </div>
            <div class="white-con-table">
                <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" height="350" stripe @selection-change="handleSelectionChange">
                    <el-table-column   type="selection" show-overflow-tooltip></el-table-column>
                    <el-table-column type="index" label="序号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="empNo" label="员工号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
                    <el-table-column  label="税后工资" show-overflow-tooltip>
                        <template slot-scope="scope"><span>￥{{ scope.row.afterAmount }}</span></template>
                    </el-table-column>
                    <el-table-column  label="奖金" show-overflow-tooltip v-if="typeBridge !== 'BASE' ">
                        <template slot-scope="scope"><span >￥{{scope.row.bonus ? scope.row.bonus : 0  }}</span></template>
                    </el-table-column>
                    <el-table-column  prop="other" label="其他" show-overflow-tooltip v-if="typeBridge !== 'BASE' ">
                        <template slot-scope="scope">
                            <span>￥{{ scope.row.other ? scope.row.other : 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column v-for="item in allList" v-if="item.status==1" :prop="item.code" :label="item.name" :key="item.id" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>￥{{ scope.row[item.code] ? scope.row[item.code] : 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="说明">
                        <template slot-scope="scope">
                            <div class="popContainer">
                                <div v-permit="'19'"  class="edit" @click="popDescribition(scope.$index, scope.row)"><i class="icon-font icon-jcxx_-"></i>说明</div>
                                <div class="lock"><i class="icon-font icon-sp--1"></i></div>                                
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="white-con-bottom">
                <div class="pagInfo">
                    共<span>{{pageTotal}}</span>条记录，当前第<span>{{current}}</span>页/共<span>{{allPages}}</span>页
                </div>
                <div class="pagCon">
                    <el-pagination small @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page="pageCurrent" :page-sizes="[10, 20, 50, 100]"  :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="pageTotal">
                    </el-pagination>
                </div>
                <div class="allStaffInfo">
                    <div>
                        <div >当前发放工资人员<span>{{rightCorner.salaryNum ? rightCorner.salaryNum : 0 }}</span></div>
                        <div>当前发放奖金人员<span>{{rightCorner.bonusNum ? rightCorner.bonusNum : 0}}</span></div>                        
                        <div>当前发放其它金额人员<span>{{rightCorner.otherNum ? rightCorner.otherNum : 0}}</span></div>
                    </div>
                    <div class="fixRight">
                        <div>当前发放总工资<span>￥{{rightCorner.totalSalary ? rightCorner.totalSalary : 0 | moneyFormat }}</span></div>
                        <div>当前发放总奖金<span>￥{{rightCorner.totalBonus ? rightCorner.totalBonus : 0 | moneyFormat}}</span></div>
                        <div>当前发放总其它金额<span>￥{{rightCorner.totalOther ? rightCorner.totalOther : 0 | moneyFormat}}</span></div>
                    </div>
                </div>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>薪资发放成功,发放时间为{{releaseTime}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="openNotarize">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog  title="提示"  :visible.sync="dialogVisible2"  width="30%"   :before-close="handleClose2">
            <div class="con">
                <div style="font-size: 14px;color: #21223f;">您当前选择发放：</div>
                <div style="margin: 20px 0">
                    <div style="font-size: 14px;color: #979cb2;">员工工资人数<span style="color: #6479ff;">{{alertInfo ? alertInfo.salaryNum : 0}}</span>人，总金额<span style="color: #6479ff;">￥{{alertInfo ?alertInfo.totalSalary : 0}}</span></div>
                    <div style="font-size: 14px;color: #979cb2;">员工奖金人数<span style="color: #6479ff;">{{ alertInfo ?alertInfo.bonusNum : 0}}</span>人，总金额<span style="color: #6479ff;">￥{{alertInfo ? alertInfo.totalBonus : 0}}</span></div>
                    <div style="font-size: 14px;color: #979cb2;">员工其他人数<span style="color: #6479ff;">{{alertInfo ? alertInfo.otherNum : 0}}</span>人，总金额<span style="color: #6479ff;">￥{{alertInfo ? alertInfo.totalOther : 0}}</span></div>
                </div>
                <div v-if="statusOk" style="font-size: 14px;color: #21223f;">是否发放？</div>
                <div v-if="salaryCover" style="font-size: 14px;color: #21223f;">其中<span class="warning">{{salaryCoverNumber}}</span>人已发放工资，是否查看？</div>
                <div v-if="bonusCover" style="font-size: 14px;color: #21223f;">其中<span class="warning">{{bonusCoverNumber}}</span>人已发放奖金，是否查看？</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm2">是</el-button>
                <el-button type="primary" @click="handleCancel2">否</el-button>
            </span>
        </el-dialog>
        <el-dialog class="details lists"   title="列表" :visible.sync="dialogVisible3">
            <div class="flexListsContainer">
                <div class="fir" :class="{switchActive:firListsShow}" @click="firLIstsClick">重复发放工资列表</div>
                <div class="sec" :class="{switchActive:secListsShow}" @click="secListsClick">重复发放奖金列表</div>
            </div>
            <div class="ListsContainer">
                <div v-if="firListsShow">
                    <div v-for="(val,i) in coverOneArr">
                        <div class="listsHeadCon"><div class="fir">{{val.name}}</div><div class="sec">员工号:{{val.empNo}}</div></div>
                    </div>
                </div>
                <div v-if="secListsShow">
                    <div v-for="(val,i) in coverTwoArr">
                        <div class="listsHeadCon">
                            <div class="fir">{{val.name}}</div>
                            <div class="sec">员工号:{{val.empNo}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="shutThisContainer">
                    <div class="attention">请自行在excel中删除重复条目。</div>
                    <div class="shutThis" @click="shutThis">确定</div>
            </div>
        </el-dialog>
        <el-dialog class="details"   title="添加说明" :visible.sync="dialogVisible4">
            <div class="flexSwitchContainer">
                <div class="fir" :class="{switchActive:firShow}" @click="firClick">工资说明</div><div class="sec" :class="{switchActive:secShow}" @click="secClick">奖金说明</div><div class="thi" :class="{switchActive:thiShow}" @click="thiClick">其他说明</div>
            </div>
            <div class="textareaContainer">
                <div class="firInput" v-if="firShow">
                    <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="afterContent" resize="'none'"></el-input>
                    <div class="submitContainer">
                        <div @click="submitFirInput">提交</div>
                        <div @click="dialogVisible4 = false;afterContent = ''">取消</div>
                    </div>
                </div>
                <div class="secInput" v-if="secShow">
                    <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="bonusContent" resize="'none'"	  ></el-input>
                    <div class="submitContainer">
                        <div @click="submitSecInput">提交</div>
                        <div @click="dialogVisible4 = false;bonusContent = ''">取消</div>
                    </div>
                </div>
                <div class="thiInput" v-if="thiShow">
                    <el-input
                      type="textarea"
                        :rows="6"
                      placeholder="请输入内容"
                      v-model="otherContent"
						resize="'none'"	  
							  >
                    </el-input>
                    <div class="submitContainer">
                        <div @click="submitThiInput">提交</div>
                        <div @click="dialogVisible4 = false;otherContent = ''">取消</div>
                    </div>
                </div>
            </div>
        </el-dialog>
		<el-dialog class="detailsEnterprise details"   title="提示" :visible.sync="dialogVisibleEnterprise" >
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
    </div>
</template>
<script>
    import dayjs from 'dayjs';
    import api from '@/api/reqApi'
    import errInfo from '@/api/errInfo'
    import apiTwo from '@/api/reqApiTwo'
    import money from '@/api/money'
	import storejs from 'store';     
    export default {
        data() {
            return {
				dialogEnterpriseOne:false,
                coverOneArr:[],
                coverTwoArr:[],
                firListsShow:true,
                secListsShow:false,
                salaryCover:false,
                salaryCoverNumber:0,
                bonusCover:false,
                bonusCoverNumber:0,
                statusOk:true,
                firShow:true,
                secShow:false,
                thiShow:false,
				
                pageCurrent: 0,
                pageSize: 10,
                pageTotal: 0,
				current:1,
                size:10,
				
                tableData3: [],
                multipleSelection: [],
                getExcelSrc:'',
                grantType: 'HISTORY',
                dialogVisible: false,
                dialogVisible2: false,
                dialogVisible3: false,
                dialogVisible4:false,
                checkList: [],
                allList: [],
                upLoadEx: false,
                progressBar: 0,                
                alertInfo:{
                    bonusNum:0,
                    otherNum:0,
                    salaryNum:0,
                    totalBonus:0,
                    totalOther:0,
                    totalSalary:0,
                },
                allPages:1,
                rightCorner:{},
                downloadInfo:'工资发放模板'+ dayjs(Date.now()).format("YYYY年MM月DD日HH时mm分") +'.xls',
                releaseTime:'',
                afterContent:'',
                bonusContent:'',
                otherContent:'',
                idBridge:'',
                typeBridge:'',
                waitExportArr:[],
				groupShow:true,
				companyExtra:'',				
				companyExtraOptions:[],
                dialogVisibleEnterprise:false,
				formData:null,
            };
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
        mounted() {
			this.dealEnterprise();
			let params = {
                grantType:this.grantType,
                size:this.size,
				subEpId:this.companyExtra ? this.companyExtra  : undefined,
            };
            this.getHistoryData(params);
            this.getTemplateLink();			
        },
        beforeRouteLeave (to, from, next) {
            clearTimeout(window.timer1);
            next();
          },
        filters:{
            moneyFormat:(val)=>{
                return money.getThousandNum(val);
            },
        },
        methods:{
			inputChangeConfirm(){
				this.uploadAction(this.formData);
				this.dialogEnterpriseOne = false;				
			},
			inputChangeCancel(){
				this.dialogEnterpriseOne = false;
				this.$refs.salaryProvideInput.value="";
			},
			dealEnterprise(){								
				let group = storejs.get('userInfo').group;
				if( group ){
				   this.groupShow = true;  
				}else{
					this.groupShow = false;   
				}
				let simpleEnterpriseList = storejs.get('userInfo').simpleEnterpriseList;
				this.companyExtraOptions = simpleEnterpriseList;
				this.initBlur();
			},
			initBlur(){
				let enterprise = storejs.get('saProvideEnterprise');
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
				storejs.set('saProvideEnterprise',val);
				let params = {
                    grantType:this.grantType,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
				this.getHistoryData(params);
				this.getTemplateLink();	
			},
            exportExcel(){
               let data ={
                   grantType:this.typeBridge,
				   subEpId:this.companyExtra ? this.companyExtra  : undefined, 
                };
                apiTwo.exportEmployeeBillTemplet(data).then(res=>{
                     this.download(res);
                }).catch(err=>{
                    errInfo.err(err);
                })
            },
            download(res){
                let now = Date.now();
                let timeMark = dayjs(now).format("YYYY年MM月DD日HH时mm分");
                const content = res;
                const blob = new Blob([content]);
                const fileName = '工资发放导出'+timeMark+'.xls';
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
            },            
            shutThis(){
                this.dialogVisible3 = false;
            },
            firLIstsClick(){
                this.firListsShow= true;
                this.secListsShow= false;
            },
            secListsClick(){
                this.firListsShow= false;
                this.secListsShow= true;
            },
            submitFirInput(){
                let data = {
                    grantType:this.typeBridge,
                    id:this.idBridge,
                    afterAmountDescription:this.afterContent,
					subEpId:this.companyExtra ? this.companyExtra  : undefined, 
                };
                apiTwo.addDescription(data).then(res=>{
                    if(res.success){
                        this.dialogVisible4 = false;
                        this.idBridge = '';
                        this.$message({
                          message: '添加成功。',
                          type: 'success'
                        });
						let params = {
							grantType:this.grantType,
							size:this.size,
							subEpId:this.companyExtra ? this.companyExtra  : undefined,
						};
                        this.getHistoryData(params);
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);
                })
            },
            submitSecInput(){
                let data = {
                    grantType:this.typeBridge,
                    id:this.idBridge,
                    bonusDescription:this.bonusContent,
					subEpId:this.companyExtra ? this.companyExtra  : undefined, 
                };
                apiTwo.addDescription(data).then(res=>{
                    if(res.success){
                        this.dialogVisible4 = false;
                        this.idBridge = '';
                        this.$message({
                          message: '添加成功。',
                          type: 'success'
                        });
						let params = {
							grantType:this.grantType,
							size:this.size,
							subEpId:this.companyExtra ? this.companyExtra  : undefined,
						};
                        this.getHistoryData(params);
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);
                })                
            },
            submitThiInput(){
                let data = {
                    grantType:this.typeBridge,
                    id:this.idBridge,
                    otherDescription:this.otherContent,
					subEpId:this.companyExtra ? this.companyExtra  : undefined, 
                };
                apiTwo.addDescription(data).then(res=>{
                    if(res.success){
                        this.dialogVisible4 = false;
                        this.idBridge = '';
                        this.$message({
                          message: '添加成功。',
                          type: 'success'
                        });
						let params = {
							grantType:this.grantType,
							size:this.size,
							subEpId:this.companyExtra ? this.companyExtra  : undefined,
						};
                        this.getHistoryData(params);
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err);
                })
            },
            firClick(){
                this.firShow = true;
                this.secShow = false;
                this.thiShow = false;                
            },
            secClick(){
                this.firShow = false;
                this.secShow = true;
                this.thiShow = false;
            },
            thiClick(){
                this.firShow = false;
                this.secShow = false;
                this.thiShow = true;
            },
            popDescribition(index,row){
                this.dialogVisible4 = true;
                this.idBridge = row.accountId;
                this.afterContent = row.afterAmountDescription;
                this.bonusContent = row.bonusDescription;
                this.otherContent = row.otherDescription;
            },
            getTemplateLink(){
				let data = {
					subEpId:this.companyExtra ? this.companyExtra  : undefined, 
				};
                api.exportSalaryExcel(data).then(res=>{
                        let blob = new Blob([res],{type : 'application/vnd.ms-excel'});
                        let transSrc = URL.createObjectURL(blob);
                        this.getExcelSrc = transSrc;
                }).catch(err=>{
                });
            },
            ifProvide() {
                if(this.tableData3.length){
                    this.dialogVisible2 = true;
                    var now = Date.now();
                    this.releaseTime = dayjs(now).format("YYYY年MM月DD日");
                    let data = {
                        grantType:this.typeBridge,
						subEpId:this.companyExtra ? this.companyExtra  : undefined,		
                    };
                    api.confirmPopout(data).then(res=>{
                        if( res.success ){
                            this.alertInfo = {
                                bonusNum:res.data.bonusNum ? res.data.bonusNum : 0,
                                otherNum:res.data.otherNum ? res.data.otherNum : 0,
                                salaryNum:res.data.salaryNum ? res.data.salaryNum : 0,
                                totalBonus:res.data.totalBonus ? res.data.totalBonus : 0,
                                totalOther:res.data.totalOther ? res.data.totalOther : 0,
                                totalSalary:res.data.totalSalary ? res.data.totalSalary : 0,
                            };
                            this.salaryCover = false;
                            this.bonusCover = false;
                            this.statusOk =true;
                        }else {
                            this.statusOk =false;
                            this.$message.error(res.message);
                            if(res.data.grantedSalarys){
                                this.salaryCover = true;
                                this.salaryCoverNumber = res.data.grantedSalarys.length;
                                this.coverOneArr = res.data.grantedSalarys;
                            }
                            if(res.data.grantedBonus){
                                this.bonusCover = true;
                                this.bonusCoverNumber = res.data.grantedBonus.length;
                                this.coverTwoArr = res.data.grantedBonus;
                            }
                        }
                    }).catch(err=>{
                        this.statusOk =false;
                        this.salaryCover = false;
                        this.bonusCover = false;
                        errInfo.err(err);
                    })
                }else{
                }
            },
            openNotarize() {
                let self = this;
                self.dialogVisible = false;
				let params = {
                    grantType:this.grantType,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                self.getHistoryData(params);
            },
            handleClose(done) {
                done();
            },
            handleClose2(done) {
                done();
            },
            handleConfirm2() {
                if(this.statusOk){
					let data = {
						grantType:this.typeBridge,
						subEpId:this.companyExtra ? this.companyExtra  : undefined,
					};
                      api.openGrantEmployeeBill(data).then(res => {
                        if(res.success){
                            this.dialogVisible = true;
                        }else{
                            this.$message.error(res.message);
                        }
                    }).catch(err => {
                        errInfo.err(err);
                    });  
                }else{
                   this.dialogVisible3 = true;
                }
                this.dialogVisible2 = false;
            },
            handleCancel2() {
                this.dialogVisible2 = false;
            },
            previewCancel() {
                this.grantType = 'HISTORY';
				let params = {
                    grantType:this.grantType,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.getHistoryData(params);
                this.upLoadEx = false;
            },
            baseInfo() {
                this.grantType = 'BASE';
				let params = {
                    grantType:this.grantType,
                    size:this.size,
					subEpId:this.companyExtra ? this.companyExtra  : undefined,
                };
                this.getHistoryData(params);
            },
            getHistoryData(params) {
                    api.getEmployeeBillTemplet(params).then(res=>{
                        if(res.success){
                            this.tableData3 = res.data.records;
                            this.pageCurrent = res.data.current;
                            this.pageSize = res.data.size;
                            this.pageTotal = res.data.total;
                            this.allList = res.data.extendData.salaryCategoryList;
                            this.rightCorner = res.data.extendData.employeeBillTempletCollectVO ? res.data.extendData.employeeBillTempletCollectVO : {};
                            this.size = res.data.size;	
							this.current = res.data.current;
                            this.allPages = Math.ceil ( res.data.total/this.size ) ; 
                            this.typeBridge = res.data.extendData.grantType.name;                            
                        }else{
                            this.$message.error(res.message);
                        }
                    }).catch(err=>{
                        errInfo.err(err);
                    });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                var filter = val.map(ele=>{
                    let obj = {};
                    return obj.id= ele.accountId;
                })
                this.waitExportArr = filter;
            },
            handleSizeChange(val) {
                this.size = val;
                if( this.grantType == 'BASE' ){
                    this.baseInfo();
                }else {
					let params = {
						grantType:this.grantType,
						size:this.size,
						subEpId:this.companyExtra ? this.companyExtra  : undefined,
					};
                   this.getHistoryData(params);
                }
            },
            handleCurrentChange(val) {
                this.current = val;
                if( this.grantType == 'BASE' ){
                    this.baseInfo();
                }else {
					let params = {
						grantType:this.grantType,
						current:this.current,
						size:this.size,
						subEpId:this.companyExtra ? this.companyExtra  : undefined,
					};
                   this.getHistoryData(params);
                }
            },
			uploadAction(form){				
				api.uploadSalaryExcel(form).then(res=>{
                        if(res.success){
                            this.progressBar = 100;
                            this.$refs.salaryProvideInput.value="";
                            window.timer1 = setTimeout(function(){
                                this.upLoadEx = false;
                            },1000);
                            this.grantType = 'TEMP';
							let params = {
								grantType:this.grantType,
								size:this.size,
								subEpId:this.companyExtra ? this.companyExtra  : undefined,
							};
                            this.getHistoryData(params);
							this.formData = null;
                        }else {
                            this.progressBar = 0;
                            this.$refs.salaryProvideInput.value="";
                            window.timer1 = setTimeout(function(){
                                this.upLoadEx = false;
                            },1000)
                            this.$message.error(res.message);
							this.formData = null;
                        }
                    }).catch(err=>{
                        this.$refs.salaryProvideInput.value="";
                        this.upLoadEx = false;
                        errInfo.err(err);
						this.formData = null;
                    })				
			},
            basefileChange(){
                var self = this;                
                var filesObject = this.$refs.salaryProvideInput.files;
                const excelReg = /(.(xls|xlsx))+$/i;
                let objValue = function(obj) {
                    if (obj !== Object(obj))
                        throw new TypeError('Object.values called on a non-object');
                    var val=[],key;
                    for (key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj,key)) {
                            val.push(obj[key]);
                        }
                    }
                    return val;
                };
                let filesArray = objValue( filesObject );
                var tar = filesArray.every((ele,index)=>{
                    return  excelReg.test(ele.name);
                })
                if( tar ){
                    //符合格式
                    this.upLoadEx = true;
                    const formData = new FormData();
                    formData.append('file',filesArray[0]);
					if(this.groupShow){
					   formData.append('subEpId',this.companyExtra);						
						this.dialogEnterpriseOne = true;
						this.formData = formData;
					}else{
						this.uploadAction(formData);
					}					
                }else {
                    this.$refs.salaryProvideInput.value="";
                   this.$message.error('请确保所选择文件为excel格式');
                }
            }
        },
};
</script>
<style lang="scss" scoped>
    .listsHeadCon {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: nowrap;
        padding-top: 10px;
        margin-bottom: 10px;
        color: #21223f;
        .fir {
            font-size: 12px;
        }
        .sec{
            font-size: 12px;
        }
    }
    .ListsContainer{
        height: 270px;
        overflow: scroll;
    }
    .shutThisContainer{
        margin-top: 20px;
        .attention{
            font-size: 12px;
            line-height: 12px;
            margin-bottom: 20px;
            text-align: left;
        }
        .shutThis{
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
            margin:0 auto;
        }
    }
    .warning {
        color: #f56c6c;
    }
    .flexListsContainer {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        .fir{
            margin-right: 20px;
            cursor: pointer;
            padding-bottom: 10px;
            border-bottom: 2px solid transparent;
        }
        .sec{
            cursor: pointer;
            padding-bottom: 10px;
            border-bottom: 2px solid transparent;
        }
    }
    .textareaContainer {
        margin-top: 20px;
    }
    .submitContainer {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        div:nth-child(1){
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
            margin-left: 60px;
        }
        div:nth-child(2){
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
            margin-right: 60px;
        }
    }
    .flexSwitchContainer {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
        .fir {
            padding-bottom: 10px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
        }
        .sec {
            margin-left: 20px;
            margin-right: 20px;
            padding-bottom: 10px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
        }
        .thi {
            padding-bottom: 10px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
        }
    }
    .switchActive {
        color: #6479ff;
        border-bottom-color:  #6479ff!important;
    }
    .salaryProvideContainer { 
        .popContainer {
            height: 30px;
            .edit {
                color: #6479ff;
                cursor: pointer;
                z-index: 20;
                text-align: center;
                width: 100%;
                line-height: 28px;
                cursor: pointer;
                margin: 0 auto;
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
        .progresserContainer {
            width: 150px;
            z-index: 20;
            position: absolute;
            left: 200px;
            height: 28px;
            padding-top: 7px;
            box-sizing: border-box;
        }
        .salaryProvideInputCon {
            position: relative;
            input {
                position: absolute;
                left: 0;
                width: 70px;
                opacity: 0;
                z-index: 10;
                font-size: 0;
                height: 100%;
                cursor: pointer;
                height: 30px;
            }
            .salaryProvideDiv {
                position: absolute;
                left: 0;
            }
            .cancelUploadBtn {
                position: absolute;
                cursor: pointer;
                left: 110px;
                height: 28px;
                width: 70px;
                text-align: center;
                line-height: 28px;
                border-radius: 20px;
                background-image: linear-gradient(-10deg, #48a3fc 0%, #767efd 100%);
                color: #fff;
                box-shadow: 0 10px 6px -4px rgba(122, 175, 253, 0.6);
            }
        }
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
                height: 380px;
                overflow: scroll;
                margin-top: 27px;
                margin-bottom: 28px;
            }
            &-bottom {
                position: relative;
                @media all and (max-width:1400px){
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
                @media all and (min-width:1401px){
                    .pagInfo {
                        float: left;
                        position: absolute;
                        bottom: 0;
                        font-size: 12px;
                        color: #c8cad7;
                        span {
                            font-size: 14px;
                            color: #6479ff;
                        }
                    }
                    .pagCon {
                        width: 400px;
                        position: absolute;
                        bottom: 0;
                        left: 43%;
                        transform: translateX(-200px);
                    }
                    .allStaffInfo {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        align-content: center;
                        align-items: center;
                        float: right;
                        font-size: 12px;
                        line-height: 28px;
                        height: auto;
                        color: #c8cad7;
                        .fixRight {
                            margin-left:40px;
                        }
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
            &-top-con {
               color: #6479ff;
                font-size: 12px;
                white-space: nowrap;
                margin-bottom: 28px;
                @media all and (max-width:768px){
                    .icon-font {
                        font-size: 14px !important;
                        margin-right: 6px;
                    }
                    div.baseOne{
                        margin-right: 10px;
                        float: left;
                        cursor: pointer;
                    }
                    div.baseTwo{
                        margin-right: 10px;
                        float: left;
                    }
                    div.baseThree{
                        float: right;
                        text-align: right;
                        cursor: pointer;
                    }
                }
                @media all and (min-width:769px) and (max-width:992px){
                    .icon-font {
                        font-size: 14px !important;
                        margin-right: 6px;
                    }
                    div.baseOne{
                        margin-right: 10px;
                        float: left;
                        cursor: pointer;
                    }
                    div.baseTwo{
                        margin-right: 10px;
                        float: left;
                    }
                    div.baseThree{
                        float: right;
                        text-align: right;
                        cursor: pointer;
                    }
                }
                @media all and (min-width:993px) and (max-width:1150px){
                    .icon-font {
                        font-size: 14px !important;
                        margin-right: 6px;
                    }
                    div.baseOne{
                        margin-right: 20px;
                        float: left;
                        cursor: pointer;
                    }
                    div.baseTwo{
                        margin-right: 20px;
                        float: left;
                    }
                    div.baseThree{
                        float: right;
                        text-align: right;
                        cursor: pointer;
                    }
                }
                @media all and (min-width:1151px) {
                    .icon-font {
                        font-size: 14px !important;
                        margin-right: 6px;
                    }
                    div.baseOne{
                        margin-right: 30px;
                        float: left;
                        cursor: pointer;
                    }
                    div.baseTwo{
                        margin-right: 30px;
                        float: left;
                    }
                    div.baseThree{
                        float: right;
                        text-align: right;
                        cursor: pointer;
                    }
                }
                &:after {
                    content: '';
                    display: block;
                    clear: both;
                    overflow: hidden;
                }
            }
            .white-con-button {
                &::after {
                    content: '';
                    display: block;
                    clear: both;
                    overflow: hidden;
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
                .export {
                    color: #6479ff;
                    font-size: 12px;
                    float: left;
                    height: 30px;
                    line-height: 30px;
                    cursor: pointer;
                    box-sizing: border-box;
                    .icon-font {
                        height: 30px;
                        font-size: 14px!important;
                        margin-right: 7px;
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
	.salaryProvideContainer {
		.white-con-table {
			.el-table {
				position: absolute;
				left: 0;
				top:0;
			}
			.has-gutter th{
				background-color: #eff1ff;
				color: #21223f;
				font-size: 13px;
				font-weight: 700px;
			}
			.cell{
				text-align: center;
			}
			.el-table--striped .el-table__body tr.el-table__row--striped td {
				background-color: #f2f2f8;
				color: #21223f;
				font-size: 12px;
			}
			.el-table--striped .el-table__body tr.el-table__row td {
				color: #21223f;
				font-size: 12px;
			}
			.el-table--border::after, .el-table--group::after, .el-table::before {
				background-color: #fff;
			}
		}
		.el-dialog {
			border-radius: 10px;
		}
		.el-dialog__headerbtn {
			top: 30px;
			right: 36px;
		}
		.el-dialog__body {
			padding: 20px 36px;
			text-align: center;
			.con {
				padding: 0px 40px;
				text-align: left;
			 }
		}
		.addStaff-bottom-container {
			margin-top: 10px;
		}
		.el-dialog__header {
			padding-top: 27px;
			padding-left: 36px;
			padding-bottom: 0;
		}
	}
	.salaryProvideContainer {
		.detailsEnterpriseAno .el-dialog{
			height: 200px !important;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto !important;		
		}
		.cancel3{
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
		.detailsEnterpriseAno .confirm3 {
			margin-left: 90px !important;
		}
		.detailsEnterpriseAno .cancel3 {
			margin-right: 90px !important;
			cursor: pointer;
		}
	}
	.salaryProvideContainer {
		.el-form-item {
			margin-bottom: 10px!important;
		}
		.el-form-item__label {
			text-align: left;
			font-size: 13px!important;
			color: #979cb2!important;
			width: 80px!important;
		}
		.el-form-item__content {
			margin-left: 80px!important;
			height: 27px!important;
			input{
				height: 27px!important;
			}
		}
		.el-dialog__header .el-dialog__title{
			font-size: 13px;
			line-height: 32px;
			color: #6479ff;
		}
		.el-table__header-wrapper {
			background-color: #eff1ff;
    	}
		.el-table__header {
			width: 100%!important;
		}
		.el-table__body {
			width: 100%!important;
		}
		.el-dialog__footer{
			text-align: center;
			button{
				box-shadow: 0 10px 6px -4px rgba(122, 175, 253, 0.6);
				width: 120px !important;
				background-image: linear-gradient(-10deg, #48a3fc 0%, #767efd 100%);
				color: #fff;
				text-align: center;
				border-radius: 20px;
				cursor: pointer;
				font-size: 12px;
			}
			button:nth-child(2) {
				background-image: linear-gradient(-10deg, #fff 0%, #fff 100%);
				box-shadow: none;
				color: #6479ff;
			}
		}
		.check .el-checkbox {
			width: 100px;
			margin: 16px 0;
			margin-left: 30px;
		}
	}
	.salaryProvideContainer {
		.el-select {
			width: 200px !important;
			height: 30px;
			input {
				height: 30px;
			}
		}
		.lists .el-dialog{
			height: 500px !important;
		}
		.first {
			margin-bottom: 20px;
		}
		.detailsEnterprise  .el-dialog{			
			height: 200px !important;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto !important;		
			.confirm3 {
				margin: 0 auto !important;
				float: none !important;
			}
		}
		.details .el-dialog__footer .confirm3{
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
		.details .el-dialog{
			border-radius: 10px;
			height: 360px;
			width: 480px;
		}
	}     
</style>