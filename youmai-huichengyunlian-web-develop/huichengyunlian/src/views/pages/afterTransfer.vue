<template>
    <div class="afterTransfer">
        <div id="indexContainer"><img :src="qrUrl"/></div>
        <div class="nextInfo">
            <el-row>
                <el-col :span="24" style="font-weight: bold;font-size: 16px;">陕西线路-炎黄公路，乾坤湾太极湾风景</el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="font-size: 13px;">西安出发 豪华大巴|{{routeData.lineTripDays}}天</el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="font-size: 13px;">售价:<span style="color:orange">￥{{infoData.retailPrice}}</span>/成人 ￥0/儿童</el-col>
            </el-row>
            <el-row>
                <el-col :span="24" style="font-size: 13px;">团期计划：</el-col>
            </el-row>
        </div>
         <div class="nextInfo">
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
            <el-row >
                <el-col :span="24" style="font-weight: bold;font-size: 15px;">路线特色</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div v-html="routeData.lineTripIntroduce" class="routeDetail"></div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import {mapActions, mapState} from 'vuex'
    import axios from "axios"
    export default {
        data(){
            return {
                url:'',
                qrUrl:'',
                routeData:{},
                infoData:{},
                lineId:this.$route.query.lineId
            }
        },
        created(){
            this.getRouteData();
            this.getTransferInfo();
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
                        console.log(_this.routeData)
                    }
                })
            },
            getTransferInfo(){
                let _this = this;
                let lineForwardId = this.$route.query.lineForwardId?this.$route.query.lineForwardId:'';
                axios
                .get("http://www.hctx365.cn/line/forward/record?lineForwardId="+lineForwardId+"&lineId="+this.$route.query.lineId)
                .then(res=>{
                    if(res.data.success&&res.data.data){
                        res.data.data.forEach(element => {
                            element.lineCollectionDate = element.lineCollectionDate.split('.')[0]
                        });
                        _this.infoData =  res.data.data[0];
                        _this.qrUrl = "http://www.hctx365.cn/img/"+_this.infoData.forwardQrCode;
                        console.log( _this.qrUrl)
                    }
                })
            },
        },
    }
</script>


<style>
	.afterTransfer #indexContainer img{
		/* position: absolute; */
    	width: 100%;
    	height: 100%;
	}
    .afterTransfer {
        background: #ddd;
        height: 100%;
    }
    .baseInfo {
        background: white;
        box-shadow: 1px 2px 0px #e8dbc3;
    }
    .nextInfo .el-row , .baseInfo .el-row {
        padding: 5px;
    }
    .empty{
        margin-bottom: 10px;
    }
    .freeDom {
        height: 35px;
        width: 135px;
        padding-left: 5px;
        background: #ef89e6;
        line-height: 35px;
        border-radius: 15px;
    }
    .nextInfo {
        margin-top: 5px;
        background: white;
        box-shadow: 1px 2px 0px #e8dbc3;
    }
    .routeDetail img {
        width:100%; 
    }
    td{
        border: 1px solid #ddd;
        border-right: none;
        border-bottom: none;
    }
</style>
<style scoped>
  
</style>

