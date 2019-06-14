<template>
	<div>
		<cloud-header></cloud-header>
		<div class="block">
			<div class="backContainer">
				<el-carousel height="300px">
					<el-carousel-item v-for="item in 4" :key="item">
						<h3>{{ item }}</h3>

					</el-carousel-item>
				</el-carousel>
				<div class="rightTitle">
					<el-row>
						<h3>{{baseInfo.lineName}}
							<el-tag>标签一</el-tag>
							<el-tag type="success">标签二</el-tag>
						</h3>
						<h5>
							港澳台路线，景点多样
						</h5>
					</el-row>
					<el-row class="price_bg">
						<div class="price_list">
							成人价：
							<span class="price_text">
								<em>¥</em>
								<span id="adult">2323</span>
								<em class="ml5">元/人</em>
							</span>
							儿童价：
							<span class="price_text">
								<em>¥</em>
								<span id="children">2323</span>
								<em class="ml5">元/人</em></span>
						</div>
						<div class="line_infor">
							<div class="line_day"><span>2</span>天<span>1</span>晚</div>
							<div class="line_people"><span>0</span>人预览 <span>0</span>人已报名</div>
						</div>
					</el-row>
					<el-row class="gray">
						<span>目的地：</span>{{baseInfo.lineDestination}}
					</el-row>
					<el-row class="gray">
						<span>成团人数：</span>XXX
					</el-row>
					<el-row class="gray">
						<span>行程天数：</span>{{baseInfo.lineDay}}天
					</el-row>
					<el-row class="gray icon">
						<i class="el-icon-star-off save"> 收藏</i>
						<i class="el-icon-share share"> 分享</i>
					</el-row>	
				</div>
				<table class="dateTable">
					<thead>
						<tr>
							<th>日</th>
							<th>一</th>
							<th>二</th>
							<th>三</th>
							<th>四</th>
							<th>五</th>
							<th>六</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in 6">
							<td v-for="i in tableData.slice((item-1)*7,item*7)" 
								:class="i.className">
								{{i.innerText}}
							</td>
						</tr>
					</tbody>
				</table>
				<div class="numberDiv">
					<el-row>
						<label>出发城市：</label>
					</el-row>
					<el-row>
						<label>选择批次：</label>
					</el-row>
					<el-row>
						<label>出行方式：</label>
					</el-row>
					<el-row>
						<label>出游人数：</label>
						<el-input-number v-model="manNum" @change="" :min="1" :max="10" label="描述文字"></el-input-number>成人
						<el-input-number v-model="children" @change="" :min="0" :max="10" label="描述文字"></el-input-number>儿童
					</el-row>
					<el-row>
						<a href="javascript:;" class="sign_but_gray" draggable="false">联系客服：</a>
						<span class="gray_cont">400-029-0345</span>
					</el-row>
				</div>
			</div>
			<div class="detailDiv">
				<ul class="detail_nav float_nav fix mb10" :class="{topfixed:navFixed}">
					<li><a class="detailTitle" :class="{detail_cur:navShow==1}" href="javascript:;">线路详情</a></li>
					<!-- <li><a class="detailTitle" href="#1" :class="{detail_cur:navShow==2}">亮点</a></li>
					<li><a class="detailTitle" href="#2" :class="{detail_cur:navShow==3}">简介</a></li> -->
					<li><a class="detailTitle" href="#3" :class="{detail_cur:navShow==4}">行程</a></li>
					<li><a class="detailTitle" href="#4" :class="{detail_cur:navShow==5}">费用</a></li>
					<li><a class="detailTitle" href="#5" :class="{detail_cur:navShow==6}">注意</a></li>
					<li><a class="detailTitle" href="#6" :class="{detail_cur:navShow==7}">报名须知</a></li>
					<li><a class="detailTitle" href="#7" :class="{detail_cur:navShow==8}">退订保障</a></li>
					<li><a class="detailTitle" href="#8" :class="{detail_cur:navShow==9}">目的地</a></li>
				</ul>
				<div class="detailInnerDiv">
					<ul class="process_list">
					<!-- <li id="1" class="section">
						<p class="p_title"><i class="lightIcon"></i>线路亮点</p>
						<div class="icon-line"></div>
						<div class="content_text"><p class="no-infor">暂无信息</p>
						</div>
					</li>
					<li id="2" class="section">
						<p class="p_title"><i class="intrIcon"></i>线路简介</p>
						<div class="icon-line"></div>
						<div class="content_text"><p>【集合时间】123</p>
							<p>【集合地点】11</p>
							<p>【适合人群】老少皆宜</p>
							<p>【活动领队】蓝狮莎莎</p>
							<p>【成团人数】1人可成团，活动限额1人
							</p>
						</div>
					</li> -->
					<li id="3" class="section">
						<p class="p_title"><i class="travelIcon"></i>行程安排</p>
						<div class="icon-line"></div>
						<div class="content_text">
							<div>
								<p class="no-infor">暂无信息</p>
							</div><!-- 行程安排浮动快捷导航条 -->
							<div class="leftightSideShow fixed hide">
								<div class="routeDayShow" id="routeDayShow"><a class="" data-target="#Day1" href="#Day1" draggable="false">D1</a><a class="active" data-target="#Day2" href="#Day2" draggable="false">D2</a><a class="" data-target="#Day3" href="#Day3" draggable="false">D3</a><a class="" data-target="#Day4" href="#Day4" draggable="false">D4</a>
								</div>
							</div>
						</div>
					</li>
					<li id="4" class="section">
						<p class="p_title"><i class="moneyIcon"></i>费用明细</p>
						<div class="icon-line"></div>
						<div class="content_text">
							<pre>{{baseInfo.lineNotice}}</pre>
						</div></li>
					<li id="5" class="section">
						<p class="p_title"><i class="carefulIcon"></i>注意事项</p><div class="icon-line"></div>
						<div class="content_text fix">
							<pre>{{baseInfo.lineNotice}}</pre>
						</div>
					</li>
					<li id="6" class="section">
						<p class="p_title"><i class="icon_notice"></i>报名须知</p>
						<div class="icon-line"></div>
						<div class="content_text fix">
							<pre>{{baseInfo.lineSignUpInfo}}</pre>
						</div>   
					</li>
					<li id="7" class="section">
						<p class="p_title"><i class="processIcon"></i>退订保障</p>
						<div class="icon-line"></div>
						<div class="content_text fix">
							<pre>{{baseInfo.lineUnsubscribeEnsure}}</pre>  
						</div>
					</li>
					<li id="8" class="section">
						<p class="p_title"><i class="endIcon"></i>目的地介绍</p>
						<div class="icon-line"></div>
						<div class="content_text fix">
							<!-- 新建的景点介绍，如果没有先将以前的图片取出 -->
							<p></p>
							<!-- 整体景点 -->
							<p><img class="small_pic lazy" src="" data-original="" lineimg="0" draggable="false"></p>   </div>
					</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import cloudHeader from "../../pages/cloudHeader"
import axios from "axios"
export default{
	data(){
		return{
			tableData:[],
			manNum:1,
			children:0,
			navFixed:false,
			navShow:1,
			baseInfo:{},
			priceData:{},
			scroll: '',
		}
	},
	components:{
        cloudHeader
    },
    watch: {
		scroll: function () {
			this.loadSroll()
			if(this.scroll>559){//滚动条的高度，可以动态获取也可以写死
	     		this.navFixed = true
	     	}else{
	     		this.navFixed = false
	     	}
		}
	},
	mounted() {
		window.addEventListener('scroll', this.dataScroll);
	},
	methods:{
		/**
	   * 日期转化为字符串， 4位年+2位月+2位日
	   */
		getDateStr(date) {
		  var _year = date.getFullYear();
		  var _month = date.getMonth() + 1;    // 月从0开始计数
		  var _d = date.getDate();
		     
		  _month = (_month > 9) ? ("" + _month) : ("0" + _month);
		  _d = (_d > 9) ? ("" + _d) : ("0" + _d);
		  return _year + _month + _d;
		},
	 	showCalendarData() {
		    var _year = new Date().getFullYear();
		    var _month = new Date().getMonth() + 1;
		    var _dateStr = this.getDateStr(new Date());
			var map = {}
		 
		    // 设置表格中的日期数据
		    var _firstDay = new Date(_year, _month-1, 1);  // 当前月第一天
		    for(var i = 0; i < 42; i++) {
		      var _thisDay = new Date(_year, _month-1, i + 1 - _firstDay.getDay());
		      var _thisDayStr = this.getDateStr(_thisDay);
			 map={innerText:'',className:''}
			  
		      map.innerText = _thisDay.getDate();
		      if(_thisDayStr == this.getDateStr(new Date())) {    // 当前天
				map.className = 'currentDay';
		      }else if(_thisDayStr.substr(0, 6) == this.getDateStr(_firstDay).substr(0, 6)) {
				map.className = 'currentMonth';  // 当前月
		      }else {    // 其他月
				map.className = 'otherMonth';
		      }
				this.tableData.push(map)
		    }
		  },
		getBaseIfoDate(){
            let _this = this;
            axios
            .get("http://www.hctx365.cn/line/baseinfo?lineTenantId="+this.$route.query.lineTenantId+"&lineId="+this.$route.query.lineId)
            .then(res=>{
            	if(res.data.success){
            		_this.baseInfo = res.data.data[0]
            	}
            })
        },
        getPriceData(){
            let _this = this;
            axios
            .get("http://www.hctx365.cn/line/price?lineId="+this.$route.query.lineId)
            .then(res=>{
            	if(res.data.success){
            		_this.baseInfo = res.data.data[0]
            	}
            })
        },
        dataScroll: function () {
			this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
		},
		jump(index) {
			let jump = document.getElementsByClassName('section');
			// 获取需要滚动的距离
			let total = jump[index].offsetTop;
			// Chrome
			document.body.scrollTop = total;
			// Firefox
			document.documentElement.scrollTop = total;
			// Safari
			window.pageYOffset = total;
			// $('html, body').animate({
			// 'scrollTop': total
			// }, 400);
		},
		loadSroll: function () {
			var self = this;
			var $navs = document.getElementsByClassName('detail_nav')[0];
			var sections = document.getElementsByClassName('section');
			for (var i = sections.length - 1; i >= 0; i--) {
				if (self.scroll >= sections[i].offsetTop - 100) {
					self.navShow = i
					break;
				}
			}
		}
	},
	created(){
		this.showCalendarData()
		this.getBaseIfoDate()
		this.getPriceData()
		let _this = this
		// window.addEventListener('scroll',function(){
	 //    	var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	 //    	if(scrollTop>559){//滚动条的高度，可以动态获取也可以写死
	 //    		_this.navFixed = true
	 //    	}else{
	 //    		_this.navFixed = false
	 //    	}
	 //    	if(scrollTop<=649){
	 //    		_this.navShow = 1
	 //    	}else if(scrollTop<=751){
	 //    		_this.navShow = 2
	 //    	}else if(scrollTop<=947){
	 //    		_this.navShow = 3
	 //    	}else if(scrollTop<=1067){
	 //    		_this.navShow = 4
	 //    	}else if(scrollTop<=1192){
	 //    		_this.navShow = 5
	 //    	}else if(scrollTop<=1322){
	 //    		_this.navShow = 6
	 //    	}else if(scrollTop<=1435){
	 //    		_this.navShow = 7
	 //    	}else if(scrollTop<=1559){
	 //    		_this.navShow = 8
	 //    	}else{
	 //    		_this.navShow = 9
	 //    	}
  //   	})
	},
}
</script>
<style scoped>
.block{
	overflow: hidden;
	padding: 20px 70px;
	background-color: #F7F7F7;
	border-top: 1px solid #ddd;
}
.backContainer{
	overflow: hidden;
	background-color: #fff;
	padding: 20px;
}
.el-carousel{
	width: 50%;
	float: left;
}
.el-carousel__item h3 {
	color: #475669;
	font-size: 14px;
	opacity: 0.75;
	line-height: 150px;
	margin: 0;
}

.el-carousel__item:nth-child(2n) {
	background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
	background-color: #d3dce6;
}
.rightTitle{
	width: 49%;
	margin-left: 1%;
	float: left;
}
.el-tag{
	margin-left: 10px;
}
h5{
	margin-top:10px; 
	color: #FF6600;
}
.price_bg {
    background-color: #fff8ee;
    margin-top: 20px;
    width: 100%;
    position: relative;
    padding: 25px 20px 35px 10px;
    margin-top: 20px;
}
.price_list {
    margin: 4px 0px 0px 14px;
    font-size: 14px;
}
.price_text {
    font-size: 28px;
    color: #F60;
    font-family: Arial, Helvetica, sans-serif;
    margin-right: 10px;
}
.price_text em {
    font-size: 14px;
    margin-right: 5px;
    margin-left: 5px;
}
.price_bg .line_infor {
    position: absolute;
    text-align: right;
    right: 20px;
    top: 50%;
    margin-top: -23px;
}
.price_bg .line_infor .line_day {
    font-size: 14px;
    color: #f90;
}
.price_bg .line_infor .line_day span {
    font-size: 24px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    margin-left: 5px;
    margin-right: 5px;
}
.price_bg .line_infor .line_people {
    font-size: 12px;
    color: #999;
    margin-top: 7px;
}
.line_people span {
    font-weight: bold;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    color: #666;
    margin-right: 5px;
    margin-left: 10px;
}
.gray{
	font-size: 14px;
	margin: 10px 10px;
}
.gray span{
	color: #aaa;
}
.gray.icon{
	margin-top:20px; 
}
.gray.icon i{
	margin-right: 10px; 
}
.gray.icon i.save{
	color: #FF6600;
}
.gray.icon i.save:hover{
	color: #aaa;
}
.gray.icon i.share{
	color: #6C996C;
}
.dateTable{
	width: 50%;
	float: left;
	text-align: center;
	line-height: 35px;
    border-collapse: collapse;
    margin-top: 20px;
    margin-bottom: 10px;
}
.dateTable thead{
	background-color: #ccc;
	border-color: #ccc;	
}
.dateTable tbody td{
	border: 1px solid #eee;
}
.dateTable tbody .otherMonth{
	color: #ccc;
}
.dateTable tbody .currentDay{
	background-color: #ccc;
}
.numberDiv{
	width: calc(50% - 52px);
	border: 1px solid #FF6600;
	float: left;
	padding: 20px;
	height: 212px;
	margin-top:20px; 
	margin-left: 10px
}
.numberDiv .el-row{
	height: 40px;
}
.sign_but_gray, .sign_but_gray:hover {
    width: 108px;
    height: 36px;
    margin-top: 0;
    background-color: #7abd54;
    border: 2px solid #7abd54;
    color: #fff;
    line-height: 200%;
    font-size: 18px;
    font-weight: bold;
    border-radius: 2px 0 0 2px;
    text-align: center;
    display: inline-block;
    margin-left: 70px;
    cursor: default;
    margin-top: 10px;
    float: left;
    padding-left: 10px;
    text-decoration: none;
}
.gray_cont {
    width: 132px;
    height: 36px;
    margin-top: 0;
    background-color: #fff;
    border: 2px solid #7abd54;
    color: #333;
    line-height: 200%;
    font-size: 18px;
    font-weight: bold;
    border-radius: 0 2px 2px 0;
    text-align: center;
    display: inline-block;
    cursor: default;
    padding-left: 10px;
    padding-right: 10px;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    float: left;
    margin-top: 10px;
}
.detailDiv{
	float: left;
	width: 100%;
	background-color: #F7F7F7;
    padding-top: 10px;
}
.float_nav {
    background-color: #fff;
    border-bottom: 1px solid #ebebeb;
    width: 100%;
    height: 55px;
}
.mb10 {
    margin-bottom: 10px;
}
li {
    list-style: none;
    float: left;
}
.detail_nav li a {
    padding-left: 27px;
    padding-right: 27px;
    text-align: center;
    color: #333;
    font-size: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
    display: inline-block;
    font-weight: bold;
}
.detail_nav li .detail_cur {
    background-color: #11abfe;
    color: #fff;
}
a {
    text-decoration: none;
}
.process_list li {
    display: block;
    padding: 20px;
    padding-bottom: 0px;
    border: 1px solid #ebebeb;
    margin-bottom: 10px;
    background: #fff;
    width:  calc(100% - 42px);
}
.process_list li .p_title {
    font-size: 18px;
    color: #333;
}
.process_list li .content_text {
    padding-left: 32px;
    padding-top: 10px;
    padding-bottom: 20px;
    padding-right: 15px;
}
.topfixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    background: #fff;
    width: calc(100% - 140px);
    margin: 0 70px;
}
pre { 
	white-space: pre-wrap; /*css-3*/ 
	white-space: -moz-pre-wrap; /*Mozilla,since1999*/ 
	white-space: -pre-wrap; /*Opera4-6*/ 
	white-space: -o-pre-wrap; /*Opera7*/ 
	word-wrap: break-word; /*InternetExplorer5.5+*/ 
} 
</style>