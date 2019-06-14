<template>
    <div class="indexPage">
        <el-row class="breadcrum">
            <el-col :span="4"><span></span></el-col>
            <el-col :span="16">
                <div class="wrap">
                    <div class="content">
                        <p>新闻凄凄切切多所付或军所多或付军卡所付多...</p>
                        <p>的撒荆防颗粒sad荆防颗粒时代峻峰开始懂了福建省的李开复接收到...</p>
                    </div>
                </div>
            </el-col>
            <el-col class="right" :span="4">
                <el-button type="text">系统公告</el-button>
            </el-col>
        </el-row>
        <el-row :gutter="10" class="count">
            <el-col class="col">
                <div class="card bg-primary">
                    <div class="first">
                        <h6 class="white">注册用户数</h6>
                    </div>
                    <div class="second">
                        <i class="el-icon-tickets"></i>
                        <h3 class="white bold rightH3">2280</h3>
                    </div>
                    <div class="third">
                        <div class="white right">
                          <span class="tx-white">Gross Sales</span>
                          <h6 class="white">$2,210</h6>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col class="col">
                <div class="card bg-info">
                    <div class="first">
                        <h6 class="white">活跃用户数</h6>
                    </div>
                    <div class="second">
                        <i class="el-icon-bell"></i>
                        <h3 class="white bold rightH3">1850</h3>
                    </div>
                    <div class="third">
                        <div class="white right">
                          <span class="tx-white">Gross Sales</span>
                          <h6 class="white">$2,210</h6>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col class="col">
                <div class="card bg-purple">
                    <div class="first">
                        <h6 class="white">新增用户数</h6>
                    </div>
                    <div class="second">
                        <i class="el-icon-edit-outline"></i>
                        <h3 class="white bold rightH3">350</h3>
                    </div>
                    <div class="third">
                        <div class="white right">
                          <span class="tx-white">Gross Sales</span>
                          <h6 class="white">$2,210</h6>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col class="col">
                <div class="card bg-sl-primary">
                    <div class="first">
                        <h6 class="white">用户访问量</h6>
                    </div>
                    <div class="second">
                        <i class="el-icon-news"></i>
                        <h3 class="white bold rightH3">1250</h3>
                    </div>
                    <div class="third">
                        <div class="white right">
                          <span class="tx-white">Gross Sales</span>
                          <h6 class="white">$2,210</h6>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col class="col">
                <div class="card bg-blue">
                    <div class="first">
                        <h6 class="white">同业入驻数</h6>
                    </div>
                    <div class="second">
                        <i class="el-icon-sold-out"></i>
                        <h3 class="white bold rightH3">550</h3>
                    </div>
                    <div class="third">
                        <div class="white right">
                          <span class="tx-white">Gross Sales</span>
                          <h6 class="white">$2,210</h6>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row id='myChart'>
            
        </el-row>
    </div>
</template>

<script>
export default{
    mounted(){
      this.drawLine();
    },
    methods: {
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
                title: { text: '同业业务增长趋势' },
                tooltip: {},
                xAxis: {
                    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            });
        }
    }
}
</script>

<style scoped lang='scss'>
    #myChart{
        width:calc(100% - 20px);
        height:400px;
        margin-top:20px;
        padding:20px;
        background-color:#fff;
        margin-left:5px;
    }
    .indexPage{
        padding: 10px 0px 0px 20px;
        width:calc(100% - 25px);
        background-color:#D8DCE3;
    }
    .card{
        padding: 20px;
    }
    .white{
        color: #fff;
    }
    .col{
        width: 19%;
        margin-right: 1%; 
    }
    .count{
        margin: 0 !important;
    }
    .bg-primary {
        background-color: #0866C6 !important;
    }
    .bg-info {
        background-color: #5B93D3 !important;
    }
    .bg-purple {
        background-color: #6f42c1;
    }
    .bg-sl-primary {
        background-color: #2b333e;
    }
    .bg-blue{
        background-color: #727B84;
    }
    .first,.second{
        margin-bottom: 20px;
    }
    .bold{
        font-size: 700;
        font-size: 1.75rem;
        align-items: center !important;
    }
    .right{
        text-align: right;
    }
    .rightH3{
        float: right;
    }
    .third{
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        padding-top:20px;
        h6 {
            display: block;
            font-size: 0.67em;
            margin-block-start: 2.33em;
            margin-block-end: 2.33em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
            font-weight: bold;
            margin:0;
        }
    }
    .tx-white{
        color: rgba(255, 255, 255, 0.6);
    }
    i{
        color: #fff;
        font-size: xx-large;
    }
    .breadcrum{
        height: 60px;
        border-radius: 0;
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        list-style: none;
        background-color: #e9ecef;
        margin: -10px 0 20px -20px;
    }
    .wrap{
        height:30px;
        overflow: hidden;
        position: absolute;
        top:15px;
        text-align:center;
        width:66%;
    }
    p{margin:0;height: 30px;width: 100%}
    .content{
        width:100%;
        position: absolute;
    }
    @-webkit-keyframes anim1{
        0% {top: 50px;}
        50% {top: 0px;}
        100%{top: -50px;}
    }
    .content{
        -webkit-animation: anim1 5s linear infinite;
    }
</style>

