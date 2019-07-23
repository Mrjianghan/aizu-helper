<template>
    <div class="paramsContainer">
        
        <el-dialog title="提示"  :visible.sync="centerDialogVisible2" width="430px"  center>
          <span>您当前设置的收益率为<span class="highLight">{{rate}}</span>%，<span v-if="rate>10 ? true : false " class="highLight">已超过10%，</span>是否继续设置?</span>
            <div class="confirmBtns">
                <div class="confirmYes" @click="confirmChangeRate">是</div>
                <div class="confirmNo" @click="cancelChangeRate">否</div>
            </div>
        </el-dialog>
        
        <div class="center">
            <div class="title">首次参数设置</div>
            
            <div class="inputContainer">
                <div class="first">
                    <span class="nameFirst">收益率设置</span>
                    <input v-model.number.trim="rate" @blur="checkValidate">
                    <span class="percent">%</span>
                </div>
                <div class="second">
                    <span class="nameFirst">是否计算复利：</span>
                    <el-radio v-model="radio" label="1">单利</el-radio>
                        <el-radio v-model="radio" label="2">复利</el-radio>
                </div>
                <div class="third">
                    <span class="nameFirst">提现顺序：</span>
                      <el-radio v-model="prefer" label="1">本金优先</el-radio>
                        <el-radio v-model="prefer" label="2">收益优先</el-radio>
                </div>
                
            </div>
            
            <div class="btnConatiner">
                <div class="agree" @click="agree">保存
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
    import apiTwo from '@/api/reqApiTwo'
    import errInfo from '@/api/errInfo'   
    
    export default {
        data () {
            return {
                rate:'',
                radio:'',
                prefer:'',
                centerDialogVisible2:false,
            }
        },
        methods:{
            confirmChangeRate(){
                this.centerDialogVisible2 = false;
            },
            cancelChangeRate(){
                this.centerDialogVisible2 = false;
                this.rate = '';
            },
            checkValidate(){
                if( this.rate ){
                     this.rate = Math.abs( this.rate );  
                    if(this.rate > 10){
                        this.centerDialogVisible2 = true;
                    }else {
                        this.centerDialogVisible2 = false;
                    }
                  }else {
                     this.$message.error('收益率不能为0');
                  }
            },
            agree(){
                if( !this.rate || !this.radio || !this.prefer  ){
                   this.$message.error('请将参数填写完整。');
                }else {
                let data ={
                    earnings:this.rate,
                    category: this.radio == '1' ? '0' : '1',
                    withdrawOrder:this.prefer  == '1' ? '1' :'0',
                };
                apiTwo.firstSetParams(data).then(res=>{
                    if(res.success){
                        this.$message({
                          message: '设置成功。',
                          type: 'success'
                        });
                        this.$router.push({path:'/wel'});
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err); 
                })
                    
                }
            }
        }
        
    }
</script>

<style lang="scss" scoped>
    .highLight {
            color: #ec3434;
            font-weight: 700;
        }
    .confirmBtns {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                align-content: center;
                align-items: center;
                margin-top: 40px;
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
    .nameFirst {
        font-weight: 600;
    }
    .second{
        font-size: 16px;
        height: 50px;
        margin-top: 40px;
        margin-bottom: 40px;
        line-height: 50px;
    }
    .third{
        font-size: 16px;
        height: 50px;
        line-height: 50px;
    }
    .first{
        font-size: 16px;
        height: 50px;
        input {
            height: 50px;
            border: 2px solid #f2f2f2;
            width: 240px;
            box-sizing: border-box;
            padding-left: 20px;
            color: #828282;
        }
        span {
            color: #434343;
            margin-right: 20px;                            
        }
        .percent {
            margin-left: 20px;
        }
    }
    .inputContainer {
        height: 340px;
        width: 430px;
        margin: 0 auto;
        padding-top: 60px;
        box-sizing: border-box;
    }
    .paramsContainer {
        min-height: 600px;
        overflow-y: scroll;
        z-index: -2;
        width: 100%;
        height: 100%;
        background-position: 50% center;
        background-image: url("../../../static/img/ui/protocol.png");
        background-size: cover;
    }
    .center {
        height: 540px;
        width: 850px;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;
        border-radius: 20px;
        box-sizing: border-box;
        padding: 50px;
    }
    .title {
        font-size: 20px;
        color: #6479ff;
    }
    .btnConatiner {
            height: 60px;
    }
    .agree {
        width: 300px;
        height: 60px;
        border-radius: 30px;
        margin: 0 auto;
        text-align: center;
        line-height: 60px;
        font-size: 22px;
        cursor: pointer;
        background-image: linear-gradient(45deg, #767efd 0%, #48a3fc 100%), linear-gradient( #ffffff, #ffffff);
        color: #fff;        
        box-shadow: 0px 14px 20px -10px rgba(117, 126, 253, 1);
    }
</style>