<template>
    <div style="margin: 35px;position: relative;" class="employeeAla" >
        <div class="manName" v-show="showDetailAll">
            <div class="out-cir">
                <div class="in-cir"></div>
            </div>
            <div class="cir-name">{{cirName}}</div>
        </div>
        <!-- 图标总数据 -->
        <el-row class="container-top"  v-show="!showDetailAll">
            <el-col :span="4" style="border-right: 1px solid #ddd;">
                <div style="font-size: 12px;"><span>投保总金额:</span></div>
                <div style="margin-top: 5px;">
                    <span class="money-show">{{statisticsData.salesAmount}}</span>
                    <span>元</span>
                </div>
            </el-col>
            <el-col :span="4" style="padding-left:15px;" >
                <div style="font-size: 12px;"><span>投保总数:</span></div>
                <div style="margin-top: 5px;">
                    <span class="money-show" >{{statisticsData.salesTicketAmount}}</span>
                    <span>单</span>
                </div>
            </el-col>
            <el-col :span="14" style="padding-left:15px;" >
                <div style="font-size: 12px;"><span>俱乐部总数:</span></div>
                <div style="margin-top: 5px;">
                    <span class="money-show" >{{statisticsData.salesTicketAmount}}</span>
                    <span>单</span>
                </div>
            </el-col>
            <el-col :span="2" style="line-height:50px;">
                <el-row style="font-size:20px;">
                    <!-- el-icon-d-arrow-left -->
                    <el-col :span="8">
                        <i class="el-icon-menu" :class="showEcharts?'blueStyle':''" @click="changeShowEcharts('true')" style="cursor: pointer;"></i>
                    </el-col>
                    <el-col :span="8">
                        <i class="whiteIcon" :style="{backgroundImage:imgWhite}" v-show="showEcharts"  @click="changeShowEcharts('false')"></i>
                        <i class="whiteIcon" :style="{backgroundImage:imgBlue}" v-show="!showEcharts"  @click="changeShowEcharts('false')"></i>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!-- 详细数据页面 -->
        <el-row class="container-top" v-if="showDetailAll">
            <el-col :span="4" style="border-right: 1px solid #ddd;">
                <div style="font-size: 12px;"><span>投保总金额:</span></div>
                <div style="margin-top: 5px;">
                    <span class="money-show" >{{detailsData.salesAmount}}</span>
                    <span>元</span>
                </div>
            </el-col>
            <el-col :span="4" style="padding-left:15px;border-right: 1px solid #ddd;">
                <div style="font-size: 12px;"><span>投保总数:</span></div>
                <div style="margin-top: 5px;">
                    <span class="money-show">{{detailsData.salesTicketAmount}}</span>
                    <span>单</span>
                </div>
            </el-col>
            <el-col :span="14" style="padding-left:15px;">
                <div style="font-size: 12px;"><span>俱乐部数量:</span></div>
                <div style="margin-top: 5px;">
                    <span class="money-show">{{detailsData.clubCount}}</span>
                    <span>个</span>
                </div>
            </el-col>
            <el-col :span="2" style="line-height:50px;">
                <el-row style="font-size:20px;">
                    <el-col :span="6">
                        <i class="el-icon-d-arrow-left hover" @click="showDetailAll = false;showEcharts = true" style="cursor: pointer;"></i>
                    </el-col>
                    <el-col :span="6">
                        <i class="el-icon-menu" :class="showEcharts?'blueStyle':''" @click="changeShowEcharts('true')" style="cursor: pointer;"></i>
                    </el-col>
                    <el-col :span="6">
                        <i class="whiteIcon" :style="{backgroundImage:imgWhite}" v-show="showEcharts"  @click="changeShowEcharts('false')"></i>
                        <i class="whiteIcon" :style="{backgroundImage:imgBlue}" v-show="!showEcharts"  @click="changeShowEcharts('false')"></i>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <div :style="{width:tableWidth + 'px'}" style="background-color:#fff" v-show="showEcharts">
            <div style="height:20px;width:100%"></div>
            <div id="echartContainer"  style="height:400px"></div>
        </div>
        <div v-show="!showEcharts" style="background-color:#fff">
            <div v-show="!showDetailAll">
                <el-table :data="salesStatisticsData" stripe style="width: 100%"  :height="tableHeight">
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="lookDetail(scope.row)">查看详情</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="employeeName" label="员工姓名">
                    </el-table-column>
                    <el-table-column prop="clubCount" label="客户数量">
                    </el-table-column>
                    <el-table-column prop="salesAmount" label="投保总金额(万元)">
                    </el-table-column>
                    <el-table-column prop="salesTicketAmount" label="投保总数">
                    </el-table-column>
                    <el-table-column prop="getMoney" label="提成">
                    </el-table-column>
                </el-table>
            </div>
            <div v-show="showDetailAll">
                <el-table :data="detailsData.clubStatisticsList" stripe style="width: 100%"  :height="tableHeight">
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="insuranceDetail(scope.row)">查看详情</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="insuranceHuataiOrderId" label="保单号" width="250">
                    </el-table-column>
                    <el-table-column prop="insurancePolicyName" label="名称" width="350">
                    </el-table-column>
                    <el-table-column prop="insuranceTotalMoney" label="投保金额(元)">
                    </el-table-column>
                    <el-table-column prop="insuranceApplicantName" label="投保人">
                    </el-table-column>
                    <el-table-column prop="insuranceInsurantCount" label="被保人数">
                    </el-table-column>
                    <el-table-column prop="insurancePolicyTenant" label="俱乐部" width="300">
                    </el-table-column>
                    <el-table-column prop="createdDate" label="日期" width="200">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div style="text-align: right;margin-top: 20px;margin-bottom: 10px;"  v-show="!showEcharts">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 40, 80]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="title" :visible.sync="perDetail" width="88%" lock-scroll >
            <dialog-detail :insurancePolicyId="insurancePolicyId" v-if="perDetail"></dialog-detail>
        </el-dialog>
    </div>
</template>

<script>
import dialogDetail from './dialogDetail'
  import {
    httpPost,
    httpGet,
    httpGetParams,
    httpDelete,
    httpPut
  } from "@/axios/api";
var echarts = require('echarts')

export default {
    data(){
        return{
            cirName:'',
            showBlue:false,
            total:0,
            pageSize:10,
            currentPage:1,
            title:"华泰境内'慧城天下'旅游境内险",
            showDetailAll:false,
            perDetail:false,
            detailsData: {},
            tableWidth: document.documentElement.clientWidth - 270,
            showEcharts:true,
            statisticsData:{},
            salesStatisticsData: [],
            employees:[],
            everyMoney:[],
            everyAmount:[],
            colorListMoney:[],
            colorListAmount:[],
            insurancePolicyId:'',
            tableHeight: document.documentElement.clientHeight - 270,
            employeesCode:'',
            imgWhite:'url(' + require('../../../static/image/white.png') + ')',
            imgBlue:'url(' + require('../../../static/image/blue.png') + ')',
        }
    },
    components:{dialogDetail},
    mounted(){
        const that = this
        that.tableHeight = document.documentElement.clientHeight - 270
        window.onresize = () => {
            return (() => {
                    if(this.showDetailAll){
                        that.tableHeight = document.documentElement.clientHeight - 320
                    }else{
                        that.tableHeight = document.documentElement.clientHeight - 270
                    }
                    
            })()
        }
    },
    created(){
        this.getStatistic();
        // this.getSalesList();
    },
    methods:{
        initEcharts(){
            var myChart = echarts.init(document.getElementById('echartContainer'));
            let _this = this
            myChart.setOption({
                backgroundColor:'#FAFAFA',
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    // data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎','百度','谷歌','必应','其他']
                    data:['投保金额','投保数量']
                },
                toolbox: {
                    show : true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis:  {
                    type : 'category',
                    data : _this.employees
                },
                yAxis: [
                    {
                        type: 'value',
                        name: '投保金额',
                        position: 'left',
                        nameTextStyle:{
                            color:'#fff',
                            backgroundColor:'#E16262',
                            fontSize:14,
                            borderRadius:15,
                            padding:10,
                            nameGap:100,
                            nameLocation:'center'
                        }
                    },
                    {
                        type: 'value',
                        name: '投保数量',
                        position: 'right',
                        nameTextStyle:{
                            color:'#fff',
                            backgroundColor:'#F9BC61',
                            fontSize:14,
                            borderRadius:15,
                            padding:10
                        }
                    }
                ],
                series: [
                    {
                        name:'投保金额',
                        type:'bar',
                        barWidth : 20,
                        yAxisIndex: 0,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 10,
                                color: function(params) {
                                    var colorList = _this.colorListMoney;
                                    return colorList[params.dataIndex]
                                },
                                // color: new echarts.graphic.LinearGradient(
                                //     0, 0, 0, 1,
                                //     [
                                //         {offset: 0, color: '#E90DA8'},
                                //         {offset: 0.5, color: '#F12D60'},
                                //         {offset: 1, color: '#F12D60'}
                                //     ]
                                // ),
                                // opacity: 0.85
                            }
                        },
                        data:_this.everyMoney
                    },
                    {
                        name:'投保数量',
                        type:'bar',
                        barWidth : 20,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                barBorderRadius: 10,
                                color: function(params) {
                                    var colorList = _this.colorListAmount;
                                    return colorList[params.dataIndex]
                                },
                            }
                        },
                        // stack: '搜索引擎',
                        data:_this.everyAmount
                    }
                ]}
            )
        },
        //分页
        handleSizeChange(val) {
            this.pageSize = val
            if(this.showDetailAll){
                this.getDetailsData();
            }else{
                this.getStatistic()
            }
        },
        //分页
        handleCurrentChange(val) {
            this.currentPage = val
            if(this.showDetailAll){
                this.getDetailsData();
            }else{
                this.getStatistic()
            }
        },
        changeShowEcharts(boolData){
            if(boolData == "true"){
                this.showDetailAll = false
                this.showEcharts = true
            }else{
                this.showEcharts = false
            }

        },
        lookDetail(data){
            this.tableHeight = document.documentElement.clientHeight - 320
            this.showDetailAll = true
            this.cirName = data.employeeName
            this.employeesCode = data.employeeCode;
            this.getDetailsData()
        },
        // get保单详情
        insuranceDetail(data){
            this.perDetail = true
            this.insurancePolicyId = data.insurancePolicyId            
        },
        //GET 保单列表debugger
                    //
        getDetailsData(){
            let l = this.$loading()
            let _this = this;
            let pageSize = this.pageSize
            let currentPage = this.currentPage
            let employeesCode = this.employeesCode
            httpGet(`/auth/sales/${employeesCode}/policy/list?pageSize=${pageSize}&currentPage=${currentPage}`)
            .then(response => {
                l.close()
                if (response.success) {
                    _this.detailsData = response.data;
                    _this.total = response.pageData.totalRows
                }
            })
        },
        //GET 保单统计
        getStatistic(){
            let _this = this;
            let l = this.$loading()
            let pageSize = this.pageSize
            let currentPage = this.currentPage
            httpGet(`/auth/sales/employee/statistics?pageSize=${pageSize}&currentPage=${currentPage}`)
            .then(response => {
                l.close()
                if (response.success) {
                    _this.statisticsData = response.data;
                    if(this.pageSize === 10 && this.currentPage ===1){
                        _this.statisticsData.salesStatisticsList.forEach(element => {
                            _this.employees.push(element.employeeName);
                            _this.everyMoney.push(element.salesAmount);
                            _this.everyAmount.push(element.salesTicketAmount);
                            _this.colorListMoney.push('#E16262');
                            _this.colorListAmount.push('#F9BC61');
                        });
                    }
                    _this.salesStatisticsData = _this.statisticsData.salesStatisticsList.slice(0)
                    _this.salesStatisticsData.forEach(element => {
                        element.getMoney = 0
                    });
                    _this.total = response.pageData.totalRows
                    console.log(_this.salesStatisticsData)
                    _this.initEcharts();
                }
            })
        },
    },

}
</script>

<style>
    .employeeAla .el-table th>.cell {
        border-right: 1px solid;
    }
    .employeeAla .el-dialog__title {
        line-height: 30px;
        font-size: 20px;
        color: #303133;
        font-weight: bold;
    }
    .employeeAla .el-dialog__header {
        border-bottom: 1px solid #ddd;
    }
    .employeeAla .el-table th {
        background: #ACBECF !important;
        color: white;
    }
    /* .el-table th:last-child>.cell {
         border-right: none;
    } */
</style>

<style scoped>
    .out-cir {
        height: 25px;
        width: 25px;
        border: 2px solid #ced4da;
        position: absolute;
        left: 25px;
        border-radius: 50%;
        top: 25px;
    }
    .cir-name {
        position: absolute;
        left: 60px;
        font-weight: bold;
        font-size: 22px;
        top: 21px;
    }
    .in-cir {
        height: 15px;
        width: 15px;
        border: 5px solid #409EFF;
        border-radius: 50%;
        margin-top: 3px;
        margin-left: 3px;
        box-shadow: 0 0 10px #78aee4;
    }
    .manName {
        margin-top: 20px;
        height: 60px;
        background: #fff
    }
    .container-top {
        height: 80px;
        padding: 15px;
        background: #fff;
        margin-bottom: -35px;
        border-bottom: 1px solid #efebeb;
        z-index: 10;
    }
    .money-show {
        font-size: 25px;
        color:#F9BC61;
        font-weight:bold;
    }
    .blueStyle {
        color: #409EFF
    }
    .hover:hover {
        cursor: pointer;
        color: #409EFF
    }
    .whiteIcon {
        background-repeat: no-repeat;
        background-position: 0px 0px;
        background-size: 16px;
        font-size: 17px;
        padding-left: 15px;
        cursor: pointer;
    }
</style>

