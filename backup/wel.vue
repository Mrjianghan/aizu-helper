<template>
    <div class="index-main">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <div class="grid-content white">
                    <el-container>
                        <el-aside width="70px"><i class="iconfont icon-home_-2" :style="{color: '#409EFF',fontSize: '18px'}"></i></el-aside>
                        <el-main>
                            <div class="text-smaller ml">留存总额（元）</div>
                            <div class="text-number">{{headNumber.totalAvailable}}</div>
                            <div class="ml barContainer"><el-progress :percentage="headNumber.totalAvailableRatio" color="#409eff" :show-text="false"></el-progress></div>
                            <div class="text-smaller ml">比上月同时期<span class="spotlight">{{headNumber.totalAvailableRatio}}%</span></div>                           
                        </el-main>
                    </el-container>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <div class="grid-content white">
                    <el-container>
                        <el-aside width="70px"><i class="iconfont icon-home_-2" :style="{color: '#409EFF',fontSize: '18px'}"></i></el-aside>
                        <el-main>
                            <div class="text-smaller ml">工资留存总额（元）</div>
                            <div class="text-number">{{headNumber.totalPrincipal}}</div>
                            <div class="ml barContainer"><el-progress :percentage="headNumber.totalPrincipalRatio" color="#409eff" :show-text="false"></el-progress></div>
                            <div class="text-smaller ml">比上月同时期<span class="spotlight">{{headNumber.totalPrincipalRatio}}%</span></div>
                           
                        </el-main>
                    </el-container>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <div class="grid-content white">
                    <el-container>
                        <el-aside width="70px"><i class="iconfont icon-home_-2" :style="{color: '#fabec5',fontSize: '18px'}"></i></el-aside>
                        <el-main>
                            <div class="text-smaller ml">溢价留存总额（元）</div>
                            <div class="text-number">{{headNumber.totalIncome}}</div>
                            <div class="ml barContainer"><el-progress :percentage="headNumber.totalIncomeRatio" color="#f56c6c" :show-text="false"></el-progress></div>
                            <div class="text-smaller ml">比上月同时期<span class="spotlight">{{headNumber.totalIncomeRatio}}%</span></div>
                        </el-main>
                    </el-container>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                <div class="grid-content white">
                    <el-container>
                        <el-aside width="70px"><i class="iconfont icon-home_-2" :style="{color: '#E6A23C',fontSize: '18px'}"></i></el-aside>
                        <el-container :style="{display: 'block'}">
                            <el-main :style="{paddingBottom: '0'}">
                                <div class="text-smaller">工资发放总额（元）</div>
                                <div class="text-number-smaller">{{headNumber.totalGrant}}</div>
                            </el-main>
                            <el-main :style="{paddingTop: '0',paddingBottom: '20px'}">
                                <div class="text-smaller">收益分配总额（元）</div>
                                <div class="text-number-smaller">{{headNumber.totalGrantIncome}}</div>
                            </el-main>
                        </el-container>
                    </el-container>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <div class="grid-content bg-purple">
                    <el-card :body-style="{ padding: '0px'}">
                        <div class="echarts-title">
                            <i class="icon-font icon-home_--"></i><span>留存率</span>
                        </div>
                        <div class="echarts-date">
                            <div class="left-switch" style="height: 40px">
                                <el-switch
                                    v-model="leftswitch"
                                    active-text="每月"
                                    inactive-text="每日">
                                </el-switch>
                            </div>

                            <div class="left-timer" style="height: 40px">
                                <div v-if="leftswitch">
                                    <el-date-picker
                                        v-model="value1"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </div>

                                <div v-else>
                                    <el-date-picker
                                        v-model="value2"
                                        type="month"
                                        placeholder="选择月">
                                    </el-date-picker>
                                </div>
                            </div>
                        </div>
                        <div class="echarts-content">
                            <visite-volume></visite-volume>
                        </div>
                    </el-card>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <div class="grid-content bg-purple">
                    <el-card :body-style="{ padding: '0px'}">
                        <div class="echarts-title">
                            <i class="icon-font icon-home_--"></i><span>留存金额（单位：万元）</span>
                        </div>
                        <div class="echarts-date">
                            <div class="left-switch" style="height: 40px">
                                <el-switch
                                    v-model="rightswitch"
                                    active-text="每月"
                                    inactive-text="每日">
                                </el-switch>
                            </div>

                            <div class="left-timer" style="height: 40px">
                                <div v-if="rightswitch">
                                    <el-date-picker
                                        v-model="value1"
                                        type="date"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </div>

                                <div v-else>
                                    <el-date-picker
                                        v-model="value2"
                                        type="month"
                                        placeholder="选择月">
                                    </el-date-picker>
                                </div>
                            </div>
                        </div>
                        <div class="echarts-content">
                            <dataSource-pie></dataSource-pie>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import apiTwo from '@/api/reqApiTwo'
    import DATA from "@/const/wel";
    import dataSourcePie from './components/dataSourcePie.vue';
    import visiteVolume from './components/visiteVolume.vue';
    export default {
        name: "wel",
        components: {
            dataSourcePie,
            visiteVolume,
        },
        data() {
            return {
                DATA: DATA,
                text: "",
                actor: "",
                count: 0,
                isText: false,
                value1:Date.now(),
                value4:Date.now(),
                value2:Date.now(),
                value3:Date.now(),
                showright:false,
                showleft:true,
                leftChart:null,
                rightChart:null,
                leftswitch:true,
                rightswitch:true,
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
            };
        },

        mounted(){
            this.getHeadData();
            let data = {
                date:'2018-7-13',
                queryMonth:true
            };
            apiTwo.losingRate(data).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
            
            apiTwo.retainedAmount(data).then(res=>{
                console.log(res);
            }).catch(err=>{
                console.log(err);
            })
            
            
        },
        created() {
            this.actor = this.DATA[this.count] || "";
            setTimeout(() => {
                this.isText = true;
                this.setData();
            }, 2000);
            this.$store.commit('switchhomestatus',true);
            this.$store.commit('switchhometag',false);
        },
        methods: {
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
                        totalAvailableRatio : data.totalAvailableRatio ? data.totalAvailableRatio   : 100,
                        totalPrincipalRatio : data.totalPrincipalRatio ? data.totalPrincipalRatio   : 100,
                        totalIncomeRatio : data.totalIncomeRatio ? data.totalIncomeRatio   : 100,
                    };
                }
            }).catch(err=>{
                console.log(err);
            })
            },
            getData() {
                if (this.count < this.DATA.length - 1) {
                    this.count++;
                } else {
                    this.count = 0;
                }
                this.isText = true;
                this.actor = this.DATA[this.count];
            },
            setData() {
                let num = 0;
                let count = 0;
                let active = false;
                let timeoutstart = 5000;
                let timeoutend = 1000;
                let timespeed = 10;
                setInterval(() => {
                    if (this.isText) {
                        if (count == this.actor.length) {
                            active = true;
                        } else {
                            active = false;
                        }
                        if (active) {
                            num--;
                            this.text = this.actor.substr(0, num);
                            if (num == 0) {
                                this.isText = false;
                                setTimeout(() => {
                                    count = 0;
                                    this.getData();
                                }, timeoutend);
                            }
                        } else {
                            num++;
                            this.text = this.actor.substr(0, num);
                            if (num == this.actor.length) {
                                this.isText = false;
                                setTimeout(() => {
                                    this.isText = true;
                                    count = this.actor.length;
                                }, timeoutstart);
                            }
                        }
                    }
                }, timespeed);
            }
        }
    };
</script>

<style scoped>
    
    .index-main .spotlight {
        color: #6479ff;
        font-size: 16px;
    }
    .index-main .barContainer {
/*        width: 80%;*/
    }
    .index-main {
        background-color: #f9f9fc;
    }
    .white {
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
        border-radius: 4px;
        min-height: 36px;
        margin-bottom: 10px;
        
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
        font-weight: 600;
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
    @media screen and (max-width:1322px) {
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
    .echarts-title, .echarts-date {
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
    }
    .echarts-date .left-switch {
        flex: 1;
    }
    .echarts-content {
        height: 360px;
    }

</style>
<style>
    .echarts-date input {
        border: 0;
        width: 136px;
    }
</style>

