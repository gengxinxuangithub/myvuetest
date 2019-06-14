<template>
    <div class="routeTransfer">
        <div id="indexContainer"><img :src="url"/></div>
        <div class="baseInfo">
            <el-row>
                <el-col :span="24" style="font-weight: bold;font-size: 15px;">{{routeData.lineName}}</el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span="24" style="font-size: 12px;">西安出发 豪华大巴|{{routeData.lineTripDays}}天</el-col>
            </el-row> -->
            <el-row>
                <el-col :span="24" style="font-size: 12px;">售价:<span style="color:orange">￥{{routeData.lineMarketPrice}}</span>/成人 ￥0/儿童</el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="font-size: 12px;">团期计划:{{routeData.lineTripDays}}天</el-col>
            </el-row>
        </div>
        <div class="nextInfo" v-if="isTranstered==true">
            <el-row>
                <el-col :span="24" style="font-weight: bold;font-size: 16px;">慧程天下</el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="font-size: 13px;">
                    <span>产品负责人：</span><span>{{infoData.userName}}</span><span style="display:inline-block;margin-left:15px;">手机：</span><span>{{infoData.userTel}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="font-size: 13px;">旅行社名：<span>{{infoData.travelAgency}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="font-size: 13px;">联系地址：<span>{{infoData.address}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="font-size: 13px;">集合时间：<span>{{infoData.lineCollectionDate}}</span></el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="font-size: 13px;">集合地点：<span>{{infoData.lineCollectionSite}}</span></el-col>
            </el-row>
        </div>
        <div class="nextInfo empty">        
            <el-row>
                <el-col :span="24">
                    <div style="font-weight:bold;font-size:16">行程详情</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div v-html="routeData.lineTripIntroduce" class="routeDetail"></div>
                </el-col>
            </el-row>
        </div>
        <el-row class="bottom">
            <el-col :span="8">
                <el-button style="width:100%;" type="primary" class="icon-common-style icon-customer" icon="el-icon-search">客服</el-button>
            </el-col>
            <el-col :span="8">
               <el-button style="width:100%;" type="primary" class="icon-common-style icon-transfer" icon="el-icon-search" @click="linkToInfo">路线转发</el-button>
            </el-col>
            <el-col :span="8">
                <el-button style="width:100%;" type="primary" class="icon-common-style icon-buy" icon="el-icon-search">立即购买</el-button>
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
                url:'',
                routeData:{},//线路数据
                infoData:{},
                isTranstered:false,//转发后的Id
            }
        },
        created(){
            this.getRouteData();
            if(!!this.$route.query.lineForwardId){
                this.isTranstered = true;
                this.getTransferInfo();
            }else{
                this.isTranstered = false;
            }
        },
        methods:{
            getRouteData(){
                let _this = this;
                axios
                .get("http://www.hctx365.cn/line/baseinfo?lineTenantId="+this.$store.state.tenantId +"&lineId="+this.$route.query.lineId)
                .then(res=>{
                    if(res.data.data&&res.data.success){
                        _this.routeData =  res.data.data[0];
                        _this.url = "http://www.hctx365.cn/img/"+_this.routeData.lineCoverPath;
                        console.log(_this.routeData);
                    }
                })
            },
             getTransferInfo(){
                let _this = this;
                let lineForwardId = this.$route.query.lineForwardId;
                axios
                .get("http://www.hctx365.cn/line/forward/record?lineForwardId="+lineForwardId+"&lineId="+this.$route.query.lineId)
                .then(res=>{
                    if(res.data.success&&res.data.data){
                        res.data.data.forEach(element => {
                            element.lineCollectionDate = element.lineCollectionDate.split('.')[0]
                        });
                        _this.infoData =  res.data.data[0];
                        // _this.qrUrl = "http://www.hctx365.cn/img/"+_this.infoData.forwardQrCode;
                        // console.log( _this.qrUrl)
                    }
                })
            },
            linkToInfo(){
                // this.$router.push('transferInfo');
                this.$router.push({
                    path: '/transferInfo',
                    query: {
                        lineId: this.$route.query.lineId,
                        lineForwardId:this.$route.query.lineForwardId
                    }
                });
            },
        },
    }
</script>

<style>
	.routeTransfer #indexContainer img{
		/* position: absolute; */
    	width: 100%;
    	height: 100%;
	}
    .routeTransfer {
        background: #ddd;
        height: 100%;
        overflow-y: scroll;
    }
    .routeTransfer .el-button--mini, .el-button--small {
        border-radius: 0px !important;
        border:none !important;
        font-size: 20px;
    }
    .routeTransfer .bottom {
        width: 100%;
        position: fixed;
        bottom: 0;
    }
    .baseInfo {
        background: white;
        box-shadow: 1px 2px 0px #e8dbc3;
    }
    .nextInfo .el-row , .baseInfo .el-row {
        padding: 5px;
    }
    .empty{
        margin-bottom: 35px;
    }
    .nextInfo {
        margin-top: 5px;
        background: white;
        box-shadow: 1px 2px 0px #e8dbc3;
    }
    .icon-customer:before {
        content:"";
        font-size: "18px";
    }
     .routeDetail img {
        width:100%; 
    }
    .routeTransfer td{
        border: 1px solid #ddd;
        border-right: none;
        border-bottom: none;
    }
    
</style>
<style scoped>
    .icon-customer {
       background-color: #FF834C;
    }
    .icon-transfer {
        background-color: #5C5A54;
    }
    .icon-buy {
        background-color: rgb(212,45,45);
    }
    .icon-common-style {
        /* font-size:15px; */
    }
</style>

