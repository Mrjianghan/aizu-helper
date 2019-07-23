<template>
    <div class="index-main">
        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <div class="grid-content white whiteSpecial">
                    <div class="flexCon">
                    <div class="circleIcon">
                        <i class="iconfont icon-home_-2" :style="{color: '#78d2fc',fontSize: '20px'}"></i>
                    </div>
                        <div class="subCon">
                            <div class="text-smaller ml" style="">留存总额（元）</div>
                            <div class="text-number "style="color: #6479ff;font-family: Helvetica-Bold;">{{  firstNumber  }}</div>
                            <div class="ml barContainer">
                                <el-progress v-if="showOne" :percentage=" Number(((headNumber.totalAvailableRatio)*100).toFixed(2)) - 100 ? 100 : Number(((headNumber.totalAvailableRatio)*100).toFixed(2))" color="#6bce61" :show-text="false" ></el-progress>
                                <el-progress v-else :percentage=" Number((Math.abs(Number(headNumber.totalAvailableRatio) )*100).toFixed(2))-100 ? 100 : Number((Math.abs(Number(headNumber.totalAvailableRatio) )*100).toFixed(2)) " color="#fb6174" :show-text="false"></el-progress>
                            </div>
                            <div class="text-smaller ml" style="">比上月同时期<span class="spotlight" :class="{cusRed:!showOne}"><span v-if="showOne">+</span>{{ ( (headNumber.totalAvailableRatio)*100) | fix }}%</span></div>
                            </div>
                        </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <div class="grid-content white">
                    <div class="flexCon">
                            <div class="circleIcon">
                                <i class="iconfont icon-home_-2" :style="{color: '#b2a8eb',fontSize: '20px'}"></i>
                            </div>
                        <div class="subCon">
                            <div class="text-smaller ml">工资留存总额（元）</div>
                            <div class="text-number" style="font-family: Helvetica-Bold;">{{ secondNumber }}</div>
                            <div class="ml barContainer">
                                <el-progress v-if="showTwo" :percentage="Number(((headNumber.totalPrincipalRatio)*100).toFixed(2))-100 ? 100 : Number(((headNumber.totalPrincipalRatio)*100).toFixed(2)) " color="#6bce61" :show-text="false"></el-progress>
                                <el-progress v-else :percentage="Number((Math.abs(Number(headNumber.totalPrincipalRatio) )*100).toFixed(2))-100 ? 100 : Number((Math.abs(Number(headNumber.totalPrincipalRatio) )*100).toFixed(2))" color="#fb6174" :show-text="false"></el-progress>
                            </div>
                            <div class="text-smaller ml">比上月同时期<span class="spotlight" :class="{cusRed:!showTwo}"><span v-if="showTwo">+</span>{{(headNumber.totalPrincipalRatio)*100 | fix }}%</span></div>
                           </div>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <div class="grid-content white">
                    <div class="flexCon">
                        <div class="circleIcon">
                            <i class="iconfont icon-home_-2" :style="{color: '#b2a8eb',fontSize: '20px'}"></i>
                        </div>
                        <div class="subCon">
                            <div class="text-smaller ml">溢价留存总额（元）</div>
                            <div class="text-number" style="font-family: Helvetica-Bold;">{{ thirdNumber }}</div>
                            <div class="ml barContainer">
                                <el-progress v-if="showThree" :percentage="Number(((headNumber.totalIncomeRatio)*100).toFixed(2))-100 ? 100 : Number(((headNumber.totalIncomeRatio)*100).toFixed(2))" color="#6bce61" :show-text="false"></el-progress>
                                <el-progress v-else :percentage="Number((Math.abs(Number(headNumber.totalIncomeRatio) )*100).toFixed(2))-100 ? 100 : Number((Math.abs(Number(headNumber.totalIncomeRatio) )*100).toFixed(2))" color="#fb6174" :show-text="false"></el-progress>
                            </div>
                            <div class="text-smaller ml">比上月同时期<span class="spotlight" :class="{cusRed:!showThree}"><span v-if="showThree">+</span>{{(headNumber.totalIncomeRatio)*100 | fix }}%</span></div>
                            </div>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <div class="grid-content white">
                            <div class="topInline">
                                <div class="topInlineSide"><i class="iconfont icon-home_-2" :style="{color: '#78d2fc',fontSize: '20px'}"></i></div>
                                <div class="topInlineRight">
                                    <div class="text-smaller">工资发放总额（元）</div>
                                    <div class="text-number-smaller" style="font-family: Helvetica-Bold;">{{ fourthNumber }}</div>
                                </div>
                            </div>
                            <div class="bottomInline">
                                <div class="bottomInlineSide"><i class="iconfont icon-home_-2" :style="{color: '#78d2fc',fontSize: '20px'}"></i></div>
                                <div class="bottomInlineRight">
                                    <div class="text-smaller">收益分配总额（元）</div>
                                    <div class="text-number-smaller" style="font-family: Helvetica-Bold;">{{ fifthNumber }}</div>
                                </div>
                            </div>
                </div>
            </el-col>
        </el-row>
                <div class="grid-content">
                        <div class="echarts-title">
                            <i class="icon-font icon-home_--"></i><span>留存金额（单位：万元）</span>
                        </div>
                        <div class="echarts-date">
                            <div class="left-switch" style="height: 40px">
                                <div class="switchCon" @click="changeRight" >
                                    <div class="monthSelect " :class="{bgSelect:monthOn}">每月</div>
                                    <div class="daySelect" :class="{bgSelect:dayOn}">每日</div>
                                </div>
                            </div>
                            <div class="left-timer" style="height: 40px">
                                <div v-if="!rightswitch">
                                    <el-date-picker
                                        v-model="value3"
                                        @change="changeDate3"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </div>
                                <div v-else>
                                    <el-date-picker
                                        v-model="value4"
                                        @change="changeDate4"
                                        type="month"
                                        placeholder="选择月">
                                    </el-date-picker>
                                </div>
                            </div>
                        </div>
                        <div class="echarts-content">
                            <div style="width:100%;height:100%;" id="data_source_con"></div>
                        </div>
                </div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import apiTwo from '@/api/reqApiTwo'
    import dayjs from 'dayjs'
    import storejs from 'store';
    import errInfo from '@/api/errInfo'
    import money from '@/api/money'
    export default {
        data() {
            return {
                text: "",
                actor: "",
                count: 0,
                monthOn:true,
                dayOn:false,
                isText: false,
                firstNumber:'',
                secondNumber:'',
                thirdNumber:'',
                fourthNumber:'',
                fifthNumber:'',
                value4:Date.now(),
                value3:Date.now(),
                rightChart:null,
                rightswitch:true,
                negativeArr:[],
                headNumber:{
                    totalAvailable:0,
                    totalGrant:0,
                    totalGrantIncome:0,
                    totalIncome:0,
                    totalPrincipal:0,
                    totalAvailableRatio:0,
                    totalPrincipalRatio:0,
                    totalIncomeRatio:0,
                },
                showOne:false,
                showTwo:false,
                showThree:false,
                chartRight:null              
            };
        },
        filters:{
          fix:(val)=>{
              return val.toFixed(2) ;
          }     
        },
        mounted(){
            this.getHeadData();
            this.chartRight = echarts.init(document.getElementById('data_source_con'));
            let trans1 = dayjs(this.value4).format("YYYY-MM-DD");      
            let data1 = {
                    date:trans1,
                    queryMonth:true
            };
            this.rightQuery(data1);
            window.addEventListener('resize', ()=>{
                this.chartRight.resize();
            });
            this.$store.commit('switchhomestatus',true);
            this.$store.commit('switchhometag',false);
        },
        methods: {
            rightQuery(data){
                apiTwo.retainedAmount(data).then(res=>{
                    if(res.success){
                        let trans = res.data;
                        var pick = trans.dateList;
                        var transRate = trans.retentionRateList;
                        var emp = [];
                        for(let i of transRate){
                            var inner = (parseInt( i * 100))/1000000 ;
                            inner.toFixed(2);
                            emp.push( Number(inner.toFixed(2) ) );
                        }  
                        var rate=emp;
                        var arr = [];
                        var months = '';
                        for(let i of pick){
                            var nDate = new Date(i);
                            if( data.queryMonth ){
                               months = dayjs(nDate).format("YYYY/MM");
                            }else{
                               months = dayjs(nDate).format("MM/DD");
                            }
                            arr.push( months );
                        } 
                        var optionTwo = {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0, color: '#767efd' // 0% 处的颜色
                                }, {
                                    offset: 1, color: '#48a3fc' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            tooltip : {
                                trigger: 'axis',
                                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                    type : 'cross'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            xAxis : [
                                {
                                    type : 'category',
                                    data : arr.reverse(),
                                    axisTick: {
                                        alignWithLabel: true
                                    },
                                    axisLine:{
                                        lineStyle :{
                                            color:'#c5c7d3'
                                        }
                                    }
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'value',
                                    axisLine:{
                                        lineStyle :{
                                            color:'#c5c7d3',
                                            width : 0,
                                        }
                                    }
                                }
                            ],
                            series : [
                                {
                                    name:'留存金额',
                                    type:'bar',
                                    barWidth: '40%',
                                    data:rate.reverse(),
                                    itemStyle:{
                                        barBorderRadius:[30, 30, 0, 0],
                                    },
                                    markPoint:{
                                        label:{
                                            color:'red'
                                        }
                                    }

                                }
                            ]
                        };
                     this.chartRight.setOption(optionTwo);   
                    }else{
                        this.$message.error(res.message);
                    }
                }).catch(err=>{
                    errInfo.err(err); 
                })
            },
            changeDate4(){
                let trans = dayjs(this.value4).format("YYYY-MM-DD");
                let data1 = {
                    date:trans,
                    queryMonth:true
                };
                this.rightQuery(data1);
            },
            changeDate3(){
                let trans = dayjs(this.value3).format("YYYY-MM-DD");
                let data1 = {
                    date:trans,
                    queryMonth:false
                };
                this.rightQuery(data1);
            },
            changeRight(){
                this.monthOn = !this.monthOn;
                this.dayOn = !this.dayOn;
                this.rightswitch = !this.rightswitch;
                if( this.rightswitch ){
                    let trans = dayjs(this.value4).format("YYYY-MM-DD");
                    let data = {
                        date:trans,
                        queryMonth:true
                    };
                    this.rightQuery(data);
                }else{
                    let trans = dayjs(this.value3).format("YYYY-MM-DD");
                    let data = {
                        date:trans,
                        queryMonth:false
                    };
                    this.rightQuery(data);
                }
            },
            getHeadData(){
                apiTwo.getHeaderCollect().then(res=>{
                if(res.success){
                    let data = res.data;
                    this.headNumber = {
                        totalAvailable : data.totalAvailable ? data.totalAvailable   : 0,
                        totalGrant : data.totalGrant ? data.totalGrant   : 0,
                        totalGrantIncome : data.totalGrantIncome ? data.totalGrantIncome   : 0,
                        totalIncome : data.totalIncome ? data.totalIncome   : 0,
                        totalPrincipal : data.totalPrincipal ? data.totalPrincipal   : 0,
                        totalAvailableRatio : data.totalAvailableRatio ? data.totalAvailableRatio   : 1,                        
                        totalPrincipalRatio : data.totalPrincipalRatio ? data.totalPrincipalRatio   : 1,
                        totalIncomeRatio : data.totalIncomeRatio ? data.totalIncomeRatio   : 1,
                    };
                    
                    this.firstNumber = money.getThousandNum( this.headNumber.totalAvailable );
                    this.secondNumber = money.getThousandNum( this.headNumber.totalPrincipal );
                    this.thirdNumber = money.getThousandNum( this.headNumber.totalIncome );
                    this.fourthNumber = money.getThousandNum( this.headNumber.totalGrant );
                    this.fifthNumber = money.getThousandNum( this.headNumber.totalGrantIncome );
                  
                    

                    if(String(this.headNumber.totalAvailableRatio).indexOf('-') !== -1){
                       this.showOne = false;
                    }else {
                        this.showOne = true;
                    }
                    if(String(this.headNumber.totalPrincipalRatio).indexOf('-') !== -1){
                       this.showTwo = false;
                    }else {
                        this.showTwo = true;
                    }                    
                    if(String(this.headNumber.totalIncomeRatio).indexOf('-') !== -1){
                       this.showThree = false;
                    }else {
                        this.showThree = true;
                    }
                    
                }else{
                    this.$message.error(res.message);
                }
            }).catch(err=>{
                    errInfo.err(err); 
            })
        },
        }
    };
</script>

<style scoped>
    .switchCon {
        width: 100px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        border-radius: 13px;
        overflow: hidden;
        border: 1px solid #e6e6ec;
        color: #a3a5ad;
        font-size: 14px;
        line-height: 40px;
        height: 26px;
        margin-top: 10px;
        box-sizing: border-box;
    }
    .bgSelect {
        background-image: linear-gradient(-10deg, #48a3fc 0%, #767efd 100%);
        color: #fff;
        transition-property: all;
        transition-duration: 0.3s;
    }
    .monthSelect {
        width:50%;
        text-align: center;
        height: 26px;
        line-height: 26px;
        border-radius: 13px;
    }
    .daySelect {
        width:50%;
        text-align: center;
        height: 26px;
        line-height: 26px;
        border-radius: 13px;
    }
    .cusGreen {
        color: #6bce61 !important;
    }
    .cusRed {
        color: #fb617f !important;
    }
    .index-main .spotlight {
        color: #6bce61;
        font-size: 14px;
    }
    .topInline {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .bottomInline {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
    }
    .topInlineRight {
        padding-top: 20px;
    }
    .bottomInlineRight {
        padding-bottom: 20px;
    }
    .index-main .spotlightSpecial {
        color: #feb64d;
        font-size: 14px;
    }
    .index-main .barContainer {
        width: 80%;
    }
    .index-main {
        background-color: #f9f9fc;
    }
    .white {
        background-color: #fff;
        margin-bottom: 10px;
    }
    .whiteSpecial {
        background-color: #fff;
    }
    .el-row {
        margin-top: 18px;
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        width: 100%;
        background-color: #fff;
        margin-top: 15px;
        border-radius: 4px;
    }
    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
    .el-aside {
        color: #333;
        margin: auto;
        text-align: center;
    }
    .el-main {
        background-color: #fff;
        color: #333;
    }
    .index-main {
        padding: 0 40px;
        padding-top: 20px;
        padding-bottom: 70px;
    }
    .text-smaller {
        font-size: 12px;
        margin: 10px 0;
        color: #979cb2;
    }
    .text-number {
        font-size: 32px;
        font-weight:bolder;
        color: #21223f;
        padding-bottom: 10px;
    }
    .text-number-smaller {
        font-size: 20px;
        font-weight: 600;
        color: #21223f;
    }
    .ml {
        margin-left: 4px;
    }
    @media screen and (max-width:1425px) {
        .text-number{
            font-size: 28px;
        }
        .text-number-smaller {
            font-size: 18px;
        }
    }
    @media screen and (min-width:1301px) and (max-width:1322px) {
        .text-number{
            font-size: 26px;
        }
        .text-number-smaller {
            font-size: 17px;
        }
    }
    @media screen and (max-width:1300px) {
        .text-number{
            font-size: 22px;
        }
        .text-number-smaller {
            font-size: 15px;
        }
    }
    @media screen and (max-width:1245px) {
        .el-aside {
            width: 50px !important;
        }
    }
    .echarts-title{
        padding: 14px;
        padding-top: 40px;
        padding-left: 68px;
    }
     .echarts-date {
        padding: 14px;
        padding-left: 68px;
    }
    .echarts-title i {
        color: rgb(64, 158, 255);
    }
    .echarts-title span {
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        color: #21223f;
        padding-left: 10px;
    }
    .echarts-date {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-content: center;
        align-items: center;
    }
    .echarts-date .left-switch {
        line-height: 40px;
    }
    .echarts-content {
        height: 360px;
        padding-bottom: 20px;
    }
</style>
<style lang="scss">
    .index-main .circleIcon {
        width: 70px;
        text-align: center;
        @media all and (min-width: 1401px) {
            padding-top: 76px;
        }
        @media all and (min-width: 1301px) and (max-width: 1400px){
            padding-top: 72px;
        }
        @media all and (max-width: 1300px){
            padding-top: 65px;
        }
    }
    .index-main .subCon {
        padding-top: 20px;
        padding-bottom: 20px;
        min-width: 80%;
    }
    .index-main  .flexCon {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        
    }
    .index-main .echarts-date input {
        border: 0;
        width: 136px;
    }
    .index-main .whiteSpecial {
        background-color: #fff;
        .el-main {
            background-color: #fff;
        }
        .el-progress-bar__outer {
        }
    }
    .index-main {
        .topInlineSide {
            width: 70px;
            text-align: center;
            @media all and (min-width: 1501px) {
                padding-top: 65px;
            }
            @media all and (min-width: 1301px) and (max-width: 1500px){
                padding-top: 62px;
            }
            @media all and (max-width: 1300px){
                padding-top: 60px;
            }
        }
        .bottomInlineSide {
            width: 70px;
            text-align: center;
            @media all and (min-width: 1501px) {
                padding-top: 45px;
            }
            @media all and (min-width: 1301px) and (max-width: 1500px){
                padding-top: 42px;
            }
            @media all and (max-width: 1300px){
                padding-top: 38px;
            }

        }
    } 
</style>