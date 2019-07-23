<template>
    <div class="profitChangeContainer">
        <div class="white-con">
            <div class="white-con-top-con">
                <div class="" @click="">
                    <span>收益率设置</span>
                    <input>
                    <span>%</span>
                </div>
                <div class="" @click="">保存</div>
                <div class="" @click="">重置</div>

            </div>
            <div class="white-con-check">
                <div>
                    <span>是否计算复利：</span>
                    <el-radio v-model="radio" label="1">单利</el-radio>
                    <el-radio v-model="radio" label="2">复利</el-radio>
                </div>

                <div class="" @click="">
                    保存
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


                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="" label="员工号"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="" label="入职时间"></el-table-column>
                    <el-table-column prop="" label="手机号码"></el-table-column>
                    <el-table-column prop="" label="在职状态"></el-table-column>
                    <el-table-column prop="" label="所属部门"></el-table-column>
                    <el-table-column prop="" label="职位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="other" label="其他"></el-table-column>
                    <el-table-column prop="memo" label="备注"></el-table-column>


                </el-table>


            </div>
            <div class="white-con-bottom">
                <div class="pagInfo">
                    共<span>{{pageTotal}}</span>条记录，当前第<span>1</span>页/共<span>20</span>页
                </div>
                <div class="pagCon">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="pageCurrent"
                      :page-sizes="[10, 20, 50, 100]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next"
                      :total="pageTotal">
                    </el-pagination>
                </div>
                <div class="allStaffInfo">
                    <div>当前在职员工<span>150</span>人</div>
                    <div>当前离职员工<span>50</span>人</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                pageCurrent: 1,
                pageSize: 10,
                pageTotal: 0,
                tableData3: [],
                radio: '1',
            };
        },
        watch: {},
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
        },
        computed: {}
    };
</script>
<style lang="scss" scoped>
    .profitChangeContainer {
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
    .profitChangeContainer .white-con-table .el-table {
        position: absolute;
        left: 0;
        top: 0;
    }

    .profitChangeContainer .white-con-table .has-gutter th {
        background-color: #eff1ff;
        color: #21223f;
        font-size: 13px;
        font-weight: 700px;
    }

    .profitChangeContainer .white-con-table .cell {
        text-align: center;
    }

    .profitChangeContainer .white-con-table .el-table--striped .el-table__body tr.el-table__row--striped td {
        background-color: #f2f2f8;
        color: #21223f;
        font-size: 12px;
    }

    .profitChangeContainer .white-con-table .el-table--striped .el-table__body tr.el-table__row td {
        color: #21223f;
        font-size: 12px;
    }

    .profitChangeContainer .white-con-table .el-table--border::after, .el-table--group::after, .el-table::before {
        background-color: #fff;
    }

    .profitChangeContainer .el-table__header-wrapper {
        background-color: #eff1ff;
    }

    .profitChangeContainer .el-table__header {
        width: 100% !important;
    }

    .profitChangeContainer .el-table__body {
        width: 100% !important;
    }


</style>
