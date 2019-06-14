<template>
    <div class="dialog-detail" v-if="canShow">
        <section style="margin-top:-30px;">
            <el-row class="title">
                <el-col :span="24">基本信息</el-col>
            </el-row>
            <div class="border">
                <el-row class="content">
                    <el-col :span="4">保单号</el-col>
                    <el-col :span="8">{{detailsData.insurancePolicy.insuranceHuataiOrderId}}</el-col>
                    <el-col :span="4">总保费</el-col>
                    <el-col :span="8">{{detailsData.insurancePolicy.insuranceTotalMoney}}</el-col>
                </el-row>
                <el-row class="content">
                    <el-col :span="4">保障期限</el-col>
                    <el-col :span="8">{{detailsData.insurancePolicy.insuranceStartTime}} ~ {{detailsData.insurancePolicy.insuranceEndTime}}</el-col>
                    <el-col :span="4">投保日期</el-col>
                    <el-col :span="8">{{detailsData.insurancePolicy.createdDate}}</el-col>
                </el-row>
            </div>
        </section>
        <section style="margin-top:30px;">
            <el-row class="title">
                <el-col :span="24">投保人信息</el-col>
            </el-row>
            <div class="border">
                <el-row class="content">
                    <el-col :span="4">姓名</el-col>
                    <el-col :span="8">{{detailsData.insuranceApplicant.insuranceApplicantName}}</el-col>
                    <el-col :span="4">性别</el-col>
                    <el-col :span="8">{{detailsData.insuranceApplicant.insuranceApplicantSex | dictSex}}</el-col>
                </el-row>
                <el-row class="content">
                    <el-col :span="4">联系电话</el-col>
                    <el-col :span="8">{{detailsData.insuranceApplicant.insuranceApplicantTelphone}}</el-col>
                    <el-col :span="4">出生日期</el-col>
                    <el-col :span="8">{{detailsData.insuranceApplicant.insuranceApplicantBirthday}}</el-col>
                </el-row>
                <el-row class="content">
                    <el-col :span="4">证件类型</el-col>
                    <el-col :span="8">{{detailsData.insuranceApplicant.insuranceApplicantIdType | dictIdType}}</el-col>
                    <el-col :span="4">证件号码</el-col>
                    <el-col :span="8">{{detailsData.insuranceApplicant.insuranceApplicantIdNumber}}</el-col>
                </el-row>
                <el-row class="content">
                    <el-col :span="4">电子邮件</el-col>
                    <el-col :span="20">{{detailsData.insuranceApplicant.insuranceApplicantEmail}}</el-col>                    
                </el-row>
            </div>
        </section>
        <section style="margin-top:30px;">
            <el-row class="title">
                <el-col :span="24">被保人信息</el-col>
            </el-row>
            <el-table :data="detailsData.insuranceInsurant" stripe style="width: 100%">
                <el-table-column label="序号" width="50" type="index">
                </el-table-column>
                <el-table-column prop="insuranceInsurantName" label="姓名">
                </el-table-column>
                <el-table-column label="性别" width="50">
                    <template slot-scope="scope">
                        {{scope.row.insuranceInsurantSex | dictSex}}
                    </template>
                </el-table-column>
                <el-table-column prop="insuranceInsurantTelphone" label="联系电话">
                </el-table-column>
                <el-table-column label="证件类型">
                    <template slot-scope="scope">
                        {{scope.row.insuranceInsurantIdType | dictIdType}}
                    </template>
                </el-table-column>
                <el-table-column prop="insuranceInsurantIdNumber" label="证件号" width="200">
                </el-table-column>
                <el-table-column prop="insuranceInsurantBirthday" label="出生日期">
                </el-table-column>
                <el-table-column label="险种类型" width="350">
                    <template slot-scope="scope">
                        {{scope.row.insuranceType | dictInsuranceType}}
                    </template>
                </el-table-column>
                <el-table-column prop="insurancePremium" label="保费(元)">
                </el-table-column>
                <el-table-column prop="insuranceInsurantPolicyNo" label="保单号" width="200">
                </el-table-column>
                <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="">电子保单</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </section>
    </div>
</template>


<script>
  import {
    httpPost,
    httpGet,
    httpGetParams,
    httpDelete,
    httpPut
  } from "@/axios/api";
export default {
    props:['insurancePolicyId'],
    data(){
        return{
            detailsData:{},
            canShow:false
        }
    },
    created(){
        this.getInsuranceData()
    },
    methods:{
        getInsuranceData(){
            let insurancePolicyId = this.insurancePolicyId
            let l = this.$loading()
            let _this = this;
            httpGet(`/auth/sales/policy/${insurancePolicyId}`)
            .then(response => {
                l.close()   
                _this.canShow = true             
                if (response.success) {
                    _this.detailsData = response.data;
                }
            })
        },
    },
}
</script>

<style lang="scss">
    .dialog-detail {
        .el-table th>.cell {
            border-right: none;
        }
        .el-table th {
            background: #F2F4F5!important;
            color: #8F9298;
        }
        padding: 30px;
        .title {
            font-weight: bold;
            font-size: 15px;
        }
        .border {
            // margin-top: -15px;
            border-top: 1px solid #ddd;
            border-left: 1px solid #ddd;
            .content {
                margin-bottom: -15px;
                // 
                .el-col{
                    line-height: 50px;
                    height: 50px;
                    border-bottom: 1px solid #ddd;
                    border-right: 1px solid #ddd;
                    
                }
                .el-col:nth-of-type(odd){
                    background: #F2F4F5;
                    text-align: center;
                }
                .el-col:nth-of-type(even){
                    text-align: left;;
                    padding-left: 30px;
                }
            }
        }
        
    }
</style>

