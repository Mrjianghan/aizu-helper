<template>
    <div class="enterpriseInfo">
        <div class="whitebg">
            <div class="subcontainer">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item class="enterpriseInfo-logo" label="公司logo" >
                    <input type="file" ref="logo"  accept="image/x-png,image/jpeg" @change="uploadLogo">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span class="hint">上传企业logo，支持jpg，png；建议图片大小不超过1M</span>
            </el-form-item>
            <el-form-item label="公司名称" prop="name">
                <el-input v-model="ruleForm.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="site">
                <el-input v-model="ruleForm.site"></el-input>
            </el-form-item>
            <el-form-item label="员工上限" prop="scale">
                <el-select v-model="ruleForm.scale" disabled>
                    <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="统一社会信用代码" prop="uscCode" >
                <el-input v-model="ruleForm.uscCode" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contactName">
                <el-input v-model="ruleForm.contactName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactMoblie" >
                <el-input v-model="ruleForm.mobile" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="座机" prop="contactMoblie" >
                <el-input v-model="ruleForm.phone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="企业邮箱" prop="eMail" >
                <el-input v-model="ruleForm.eMail" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="企业类型" prop="enterpriseType">                
                <el-select  v-model="ruleForm.enterpriseType" placeholder="请选择行业">
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
            <el-form-item label="服务期限" prop="eMail" >
                <div class="timeDisable">
                    <span>{{startTime}}</span>
                    <span>至</span>
                    <span>{{endTime}}</span>
                </div>
            </el-form-item>
                <div v-permit="'3'" class="enterpriseInfo-save-btn" @click="submitForm('ruleForm')">更新</div>
        </el-form>
            </div>
            <div class="copyRightBottom">Copyright © 2018-2019 杭州爱薪科技有限公司</div>
            </div>
    </div>
</template>

<script>
    import storejs from 'store';
    import apiTwo from '@/api/reqApiTwo'; 
    import errInfo from '@/api/errInfo'   
    export default {
        data() {
            return {
                options:[
                     {label:"100人", value:"100"},
                    {label:"200人" ,value:"200"},
                    {label:"300人" ,value:"300"},
                    {label:"400人", value:"400"},
                    {label:"500人", value:"500"},
                    {label:"600人", value:"600"},
                    {label:"700人", value:"700"},
                    {label:"800人", value:"800"},
                    {label:"900人", value:"900"},
                    {label:"1000人", value:"1000"},
                    {label:"1000人以上", value:"1001"}
                ],
                imageUrl: '',
                ruleForm: {
                    name: '',
                    site: '',
                    logo:'',
                    scale: '',
                    uscCode: '',
                    contactName: '',
                    phone: '',
                    mobile:'',
                    eMail: '',
                    enterpriseType:'',
                    id:'',
                },
                startTime:'',
                endTime:'',
                rules: {
                }
            };
        },
        mounted(){
            this.getInfo();
        },
        methods: {
            getInfo(){
                apiTwo.getEnterpriseInfo().then(res=>{
                    if(res.success){
                        let final = res.data;
                        this.ruleForm = {
                            id:final.id,
                            site: final.address ? final.address : '',
                            scale: final.scale ? final.scale : '',
                            contactName: final.contacts ? final.contacts : '',
                            enterpriseType:final.enterpriseType ? final.enterpriseType : '',
                            phone:final.phone ? final.phone : '',
                            mobile:final.mobile ? final.mobile : '',
                            name: final.name ? final.name : '',                    
                            uscCode: final.businessLicence ? final.businessLicence : '',
                            eMail: final.email ? final.email : '',
                            logo:final.logo ? final.logo : ''
                        };
                        this.startTime = final.startTime;
                        this.endTime = final.endTime;
                        this.imageUrl = final.logo;
                        storejs.set('companyLogo',final.logo);
                        this.$store.commit('changeLogo', final.logo);
                    }else{
                        this.$message.error(res.message);
                    }           
                }).catch(err=>{
                    errInfo.err(err); 
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let form = {
                            id:this.ruleForm.id ? this.ruleForm.id : null,
                            address:this.ruleForm.site ? this.ruleForm.site : null,
                            enterpriseType:this.ruleForm.enterpriseType ? this.ruleForm.enterpriseType :null ,
                            contacts:this.ruleForm.contactName ? this.ruleForm.contactName : null,
                            logo:this.ruleForm.logo
                        };
                        apiTwo.modifiedMyEnterprise(form).then(res=>{
                            if(res.success){
                               this.$message({
                                  message: '修改成功。',
                                  type: 'success'
                                });
                                this.getInfo();
                                storejs.set('companyLogo',this.ruleForm.logo);
                                this.$store.commit('changeLogo', this.ruleForm.logo);
                            }else{
                                this.$message.error(res.message);
                            }
                        }).catch(err=>{
                            this.$message.error(res.message);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            uploadLogo(){
                let tar = this.$refs.logo;
                if( (tar.files[0].type=="image/jpeg") || (tar.files[0].type=="image/png") ){
                    if(  tar.files[0].size/1024/1024 > 1  ){
                       this.$message.error('图片大小不超过1M。');
                        tar.value = '';
                    }else {
                        let fd = new FormData();
                        fd.append('file',tar.files[0]);
                       apiTwo.modifiedEnterpriseLogo(fd).then(res=>{
                           if(res.success){
                               this.imageUrl = res.data;
                               this.ruleForm.logo = res.data;
                               tar.value = '';
                               this.$message({
                                  message: '上传成功。',
                                  type: 'success'
                                });
                           }else{
                               this.$message.error(res.message);
                           }
                       }).catch(err=>{
                           tar.value = '';
                           errInfo.err(err); 
                       })
                    }
                }else {
                    tar.value = '';
                    this.$message.error('只支持jpg，png');
                }
            },
        }
    }
</script>

<style scoped>
    .enterpriseInfo {
        padding-bottom: 150px;
        padding-left: 60px;
        padding-right: 60px;
        overflow-y: scroll;
        background-color: #f9f9fc;
    }
    .timeDisable {
        padding-left: 15px;
        background-color: #f5f7fa;
        border-color: #e4e7ed;
        color: #c0c4cc;
        cursor: not-allowed;
        height: 40px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
    }
    .subcontainer {
        width: 50%;
        min-width: 450px;
    }
    .whitebg {
        background-color: #fff;
        border-radius: 10px;
        padding-top: 40px;
        margin-top: 36px;
        padding-bottom: 20px;
        padding-left: 43px;
    }

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
        width: 130px;
        height: 130px;
        line-height: 130px;
        text-align: center;
    }
    .avatar {
        width: 130px;
        height: 130px;
        display: inline-block;
    }
    .hint {
        font-size: 12px;
        color: #feb64d;
        line-height: 1px!important;
    }
    .avatar-uploader-icon {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    
</style>
<style lang="scss">
    .enterpriseInfo .el-form-item__label {
        width: 80px !important;
        line-height: 20px;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .enterpriseInfo label[for=logo]  {
        line-height: 130px;
    }
    .enterpriseInfo label[for=name]  {
        line-height: 40px;
    }
    .enterpriseInfo label[for=site]  {
        line-height: 40px;
    }
    .enterpriseInfo label[for=scale]  {
        line-height: 40px;
    }
    .enterpriseInfo label[for=contactMoblie]  {
        line-height: 40px;
    }
    .enterpriseInfo label[for=contactName]  {
        line-height: 40px;
    }
    .enterpriseInfo label[for=eMail]  {
        line-height: 40px;
    }
    .enterpriseInfo label[for=enterpriseType]  {
        line-height: 40px;
    }
    
    .enterpriseInfo .el-form-item__content {
        margin-left: 100px !important;
    }
    .enterpriseInfo-save-btn {
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
    }
    .enterpriseInfo-logo .el-form-item__content{
        input {
            position: absolute;
            left: 0;
            top: 0;
            height: 130px;
            width: 130px;
            font-size: 0;
            opacity: 0;
            cursor: pointer;
        }
    }
</style>
