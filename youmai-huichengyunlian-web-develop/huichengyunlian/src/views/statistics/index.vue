<template>
    <div class="enterSell-query-container" :style="{height:tableHeight + 'px'}">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="32">
          <div class="chart-wrapper">
            <!-- <div class="abposition"><U>查看详情</U> </div> -->
            <bar-chart/>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="32">
          <div class="bottom-wrapper">
              <el-row>
                  <el-col :span="16" class="bottom-left" >
                      <div class="left-top flag">
                          <el-row style="line-height: 60px;">
                              <el-col :span="20" class="moreTips">库存即将过期</el-col>
                              <!-- <el-col :span="4" class="morepoint"><i class="el-icon-more"></i></el-col> -->
                          </el-row>
                          <div style="padding: 0 15px;">
                              <el-table :data="leftData" height="366" stripe :default-sort = "{prop: 'medicalSuppliesProductionDate', order: 'descending'}">
                                  <el-table-column label="序号" type="index" width="60" fixed ></el-table-column>
                                  <el-table-column prop="basicInfoModel.medicalSuppliesName" label="药品名称" :show-overflow-tooltip="true"></el-table-column>
                                  <el-table-column prop="medicalSuppliesProductionDate" label="生产日期" :show-overflow-tooltip="true" width="150" sortable></el-table-column>
                                  <el-table-column prop="medicalSuppliesValidityPeriod" label="有效期至" :show-overflow-tooltip="true" width="150"></el-table-column>
                                  <el-table-column prop="medicalSuppliesProductionBatchNo" label="生产批号" :show-overflow-tooltip="true" ></el-table-column>
                                  <el-table-column prop="basicInfoModel.medicalSuppliesManufacturer" label="生产厂家" :show-overflow-tooltip="true" ></el-table-column>
                                  <el-table-column prop="medicalSuppliesStockQuantity" label="药品库存" :show-overflow-tooltip="true" width="120"></el-table-column>
                              </el-table>
                          </div>
  
                      </div>
                  </el-col>
                  <el-col :span="7" class="bottom-right" >
                      <div class="left-top">
                          <el-row style="line-height: 60px;">
                              <el-col :span="20" class="moreTips">畅销药Top10</el-col>
                              <!-- <el-col :span="4" class="morepoint"><i class="el-icon-more"></i></el-col> -->
                          </el-row>
                          <div style="padding: 0 15px;height:366px;overflow-y:auto">
                              <el-row v-for="(item,index) in rightData" :key="index">
                                  <el-col :span="2">
                                      <div class="radiu-num" style="background: #FDD059;" v-if="item.index < 4">{{item.index}}</div>
                                      <div class="radiu-num" style="background: #D5D5D5;" v-else>{{item.index}}</div>
                                  </el-col>
                                  <el-col :span="17">
                                      <div class="tool-flow" :title="item.name">{{item.name}}</div>
                                  </el-col>
                                  <el-col :span="4">
                                      <div class="money-flow" style="text-align:right" :title="item.amount">{{item.amount}}</div>
                                  </el-col>
                              </el-row>
                          </div>
                      </div>
                  </el-col>
              </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import BarChart from '../integratedQuery/ensterSellChildren/BarChart'
  import {
      httpPost,
      httpGet,
      httpGetParams,
      httpDelete,
      httpPut
  } from "@/axios/api";
  export default {
    name: 'DashboardAdmin',
    components: {
      BarChart
    },
  data() {
      return {
        leftData:[],
        rightData: [],
        tableHeight:document.documentElement.clientHeight - 80
      }
    },
    activated () {
          const that = this
          that.tableHeight = document.documentElement.clientHeight - 80
          window.onresize = () => {
                  return (() => {
                          that.tableHeight = document.documentElement.clientHeight - 80
                  })()
          }
      },
    created(){
          //GET /medicals/medical/supplie/expire
        this.getSalesTopTen();
        this.getSupplieaExpire();
    },
    methods: {
        getSupplieaExpire(){
          let l = this.$loading();
          let _this = this;
          this.rightData = [];
          httpGetParams("/inventory/medicals/medical/supplie/expire")
          .then(function(response){
              if(response.success && response.data.length > 0){
                  _this.leftData = response.data
              }
              l.close()
          })
          .catch(l.close())
        },
        getSalesTopTen(){
          let l = this.$loading();
          let _this = this;
          this.rightData = [];
                  httpGetParams("/inventory/medicals/sales/top_ten")
          .then(function(response){
              if(response.success && response.data.length > 0){
                response.data.forEach((element,index) => {
                  _this.rightData.push({
                    index:index + 1,
                    name:element.medicalSuppliesName,
                    amount:element.medicalSuppliesAmount,
                  })
                });
              }
              l.close()
          })
          .catch(l.close())
        }
    }
  }
  </script>
  
  <style>
      .enterSell-query-container .flag .el-row{
        margin-bottom: 5px;
      }
      .enterSell-query-container .el-table th {
          background: transparent;
      }
      .enterSell-query-container .el-table td, .el-table th.is-leaf {
          border-bottom: none;
      }
  </style>
  
  <style rel="stylesheet/scss" lang="scss" scoped>
  .enterSell-query-container {
    overflow-y: auto;
    padding: 32px 32px 0 32px;
    background-color: rgb(240, 242, 245);
    .left-top{
        border-bottom:1px solid #ddd;
        width:100%;
        height:60px
    }
    .bottom-wrapper{
      margin-bottom: 32px;
    }
    .bottom-left {
        background:red;
        height: 450px;
        background: #fff;
    }
    .bottom-right {
        background: #fff;
        height: 450px;
        margin-left: 4%;
    }
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
      position: relative;
    }
    .morepoint{
        text-align:right;
        padding-right: 20px;
        color: #6f6a6a;
        font-size: 20px;
        cursor: pointer;
    }
    .moreTips {
        padding-left: 15px;
        color: #6f6a6a;
        font-size: 17px;
    }
    .radiu-num{
        height: 30px;
        width: 30px;
        border-radius: 50%;
        color: #ffffff;
        line-height: 30px;
        text-align: center;
    }
    .tool-flow{
        width: 100%;
        padding-left: 5px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        color: #6f6a6a;
        padding-top: 5px;
    }
      .money-flow{
        width: 100%;
        padding-left: 5px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        color: #F2A064;
        font-weight: bold;
        padding-top: 5px;
    }
    .abposition{
      position: absolute;
      top: 20px;
      right: 35px;
      color: #48AFFF;
      cursor: pointer;
    }
  }
  </style>
  