<template>
    <div class="transferInfo">
        <div class="top">
            <el-row>
                <el-col :span="24" class="tips">
                    <span>输入正确的信息!</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-input placeholder="姓名" v-model="name">
                        <template slot="prepend">用户姓名<span style="color:red">*</span></template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-input placeholder="电话" v-model="phone">
                        <template slot="prepend">联系电话<span style="color:red">*</span></template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-input placeholder="请填写您旅行社的名字" v-model="travalName">
                        <template slot="prepend">旅行社名<span style="color:red">*</span></template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-input placeholder="请填写您旅行社的地址" v-model="address">
                        <template slot="prepend">联系地址</template>
                    </el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="6" > <div class="collection-Date">集合时间</div> </el-col>
                    <el-col :span="18" class="dateValue">
                        <el-date-picker
                            v-model="collectionDate"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-input placeholder="请填写集合地点" v-model="collectionSit">
                        <template slot="prepend">集合地点</template>
                    </el-input>
                </el-col>
            </el-row>
        </div>
        <el-row>
            <el-col :span="24">
                <span style="color:rgb(129,129,129);padding-left: 20px;">统一零售价</span>
            </el-col>
        </el-row>
        <div class="price">
            <el-row style="padding-top:8px;padding-left: 5px;">
                <el-col :span="12">
                    <el-row style="margin-left: 15px;">
                        <el-col :span="5" style="font-size:14px;padding-top: 3px;">成人</el-col>
                        <el-col :span="10"><el-input v-model="adultPrice"></el-input></el-col>
                        <el-col :span="3" style="font-size:14px;padding-top: 3px;">/人</el-col>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <el-row>
                        <el-col :span="5" style="font-size:14px;padding-top: 3px;">儿童</el-col>
                        <el-col :span="10"><el-input v-model="childrenPrice"></el-input></el-col>
                        <el-col :span="3" style="font-size:14px;padding-top: 3px;">/人</el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <el-row>
            <el-col :span="24">
                <el-button class="bottom" @click="createTransferPage">生成转发页</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {mapActions, mapState} from 'vuex'
    import axios from "axios"
    export default {
        data(){
            return {
                name:'',//姓名
                phone:'',//联系电话
                travalName:'',//旅行社名称
                address:'',//联系地址
                collectionSit:'',//集合地点
                collectionDate:'',//集合时间
                adultPrice:0,//成人
                childrenPrice:0,//儿童
                //lineId:this.$route.query.lineId,
                //lineForwardId:this.$route.query.lineForwardId,//转发过的Id
                routeData:{},//线路数据
            }
        },
        created(){
            this.getRouteData();
        },
        methods:{
            getRouteData(){
                let _this = this;
                axios
                .get("http://www.hctx365.cn/line/baseinfo?lineTenantId="+this.$store.state.tenantId +"&lineId="+this.$route.query.lineId)
                .then(res=>{
                    if(res.data.data&&res.data.success){
                        _this.routeData =  res.data.data[0];
                        _this.adultPrice = res.data.data[0].lineMarketPrice;
                    }
                })
            },
            createTransferPage(){
                if(!this.name||!this.travalName||!this.phone){
                    this.$notify({
                        message: '请填写必填项',
                        type: 'warning',
                        duration:2000
                    });
                    return
                }
                let _this = this;
                let time="";
                if(!!this.collectionDate){
                    let date = this.collectionDate;
                    let year= date.getFullYear().toString();
                    let month= (date.getMonth()+1).toString();
                    let day= date.getDate().toString();
                    let hours= date.getHours().toString();
                    let minutes= date.getMinutes().toString();
                    time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
                }
                let postData = {
                    lineParentForwardId:this.$route.query.lineForwardId?this.$route.query.lineForwardId:'',
                    lineId:this.$route.query.lineId,
                    userName:this.name,
                    userTel:this.phone,
                    travelAgency:this.travalName,
                    address:this.address,
                    lineCollectionSite:this.collectionSit,
                    lineCollectionDate:time ,
                    retailPrice:this.adultPrice
                }
                console.log(postData)
                axios
                .post("http://www.hctx365.cn/line/forward/record",postData)
                .then(res=>{
                    if(res.data.success){
                        _this.$router.push({
                            path: '/transferPicture',
                            query: {
                                lineId: this.$route.query.lineId,
                                lineForwardId:this.$route.query.lineForwardId
                            }
                        });
                    }
                })
                
            },
        },
    }
</script>

<style>
    .transferInfo .dateValue .el-date-editor.el-input, .transferInfo .el-date-editor.el-input__inner {
        width: 100% !important
    }
    .transferInfo .dateValue  .el-input--small .el-input__inner{
        height: 45px;
        line-height: 45px;
    }
    .transferInfo .top .el-input__inner {
        border-left: none;
        border-radius: 0px;
        border-right: none;
        border-top: none;
    }
    .transferInfo .price .el-input--small .el-input__inner {
        height: 25px;
        line-height: 25px;
    }
    .transferInfo .el-input__inner:focus {
        border-color: #dcdfe6;
    }
    .transferInfo .el-col-24 {
        height: 45px;
        line-height: 45px;
    }
    .transferInfo .el-input-group--prepend .el-input__inner, .transferInfo .el-input-group__append {
        height: 45px;
    }
    .transferInfo .el-input-group__append, .transferInfo .el-input-group__prepend {
        border-radius: 0px;
        background-color: transparent;
        width: 52px;
        background: white;
        border: none;
        border-bottom: 1px solid #dcdfe6;
    }
    .collection-Date {
        border-bottom: 1px solid #ddd;
        color: #909399 !important;
        font-size: 13px !important;
        padding-left: 20px !important;
        padding-top: 1px;
    }
    .el-time-panel {
        width: 160px;
    }
</style>
<style scoped>
    .top{        
        background: white;
    }
    .bottom {
        background: rgb(212,45,45);
        color: rgb(255,255,255);
        height: 45px;
        font-size: 24px;
        margin-top: 50px;
        width: 90%;
        margin-left: 5%;
    }
    .transferInfo  {
        height: 100%;
        background:#e0e0e0;
    }
    .price{
        width:100%;
        height:45px;
        background: white;
    }
    .price span{
        padding-left:20px;
        color:rgb(240,112,112);
        font-size:20px;
        line-height: 45px;
    }
    .tips {
        background: #d6d874;
        font-size: 20px;
        padding-left: 20px;
        color:red;
    }
</style>

