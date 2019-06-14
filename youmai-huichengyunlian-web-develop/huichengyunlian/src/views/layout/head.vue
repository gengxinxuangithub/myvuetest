<template>
  <header class="head">
    <!-- 折叠按钮 云医诊所-->
    <div class="collapse-btn" @click="getCollapse">
      <i class="iconfont icon-caidan" :class="{isactive:collapse}"></i>
    </div>
    <bread/>
    <div class="top-nav">
          <!-- <div class="phoneImg" :style="{backgroundImage:phoneImg}">
            xxx-xxx-xxxx
          </div> -->
          <div class="tenantName">{{tenantNameTemp}}</div>
          <div class="userImg" :style="{backgroundImage:backImg}"></div>
        
          <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                  Hello {{userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item>关于我</el-dropdown-item>
                  <!-- <el-dropdown-item>设置</el-dropdown-item> -->
                   <!-- <el-dropdown-item divided>
                    <span style="display: block;" @click="mySchedules">我的排班</span>
                  </el-dropdown-item> -->
                  <el-dropdown-item divided>
                    <span style="display: block;" @click="loginOutClick">退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
      <!-- </template> -->
      <!--消息中心 -->
      <!-- <template> -->
        <!-- <div class="clearfix messageClass" @click="onlineRegistration">
          <el-row>
            <el-col :span="24">
              <el-tooltip class="news" effect="dark" :content="message?`有${message}条预约挂号消息`:`消息中心`" placement="bottom">
                <el-badge :value="message" type="success" class="item">
                    <i class="el-icon-message"></i>
                </el-badge>
              </el-tooltip>
            </el-col>
          </el-row>
          <el-row style="margin-top:-10px;margin-left:-10px;">
            <el-col :span="24">
              <div style="font-size:10px;color:#707070">预约挂号</div>
            </el-col>
          </el-row>
        </div> -->
        <div class="help" :style="{backgroundImage:helpImg}" @click="needHelp">帮助</div>
    </div>
    <doctor-time-edit ref="addDoctorTimeRef"></doctor-time-edit>
  </header>
</template>
<script>
import { mapState, mapActions } from "vuex";
import Bread from "./bread";
import doctorTimeEdit from "./doctorTimeEdit";
import {
    httpPost,
    httpGet,
    httpGetParams,
    httpDelete,
    httpPut
} from "@/axios/api";
export default {
  name: "Head",
  components: {
    Bread,
    doctorTimeEdit
  },
  data() {
    return {
      tableData:[],
      backImg:'url(' + require('../../assets/user.png') + ')',
      helpImg:'url(' + require('../../assets/help.png') + ')',
      phoneImg:'url(' + require('../../assets/phone.png') + ')',
      message: '', //消息
      changeBarDirection: false,
      tenantNameTemp:''
    };
  },
  created(){
    let _this = this    
    httpGet("/auth/common/user")
      .then(function(response){
          console.log(response)
          if(response.success){
              _this.$store.state.userInfo = response.data;
              _this.$store.state.tenantId = response.data.tenantCode;
              _this.tenantNameTemp = _this.$store.state.tenantName = response.data.tenantName;
              localStorage.setItem("userId",response.data.userId);
          }
      }).catch(error=>{
          this.$router.push('login')
      })
  },
  mounted() {},
  computed: {
    ...mapState(["collapse"]),
    tenantName(){
      return this.$store.state.tenantName;
    },
    userInfo(){
      let res = {}
      if(!!this.$store.state.userInfo){
        res = this.$store.state.userInfo
      }else{
        res.username = '登陆人'
      }
      return res
    },
    messageLength:function(){
      return this.$store.state.messageCount;
    },
  },

  methods: {
      //从接口获取数据
    ...mapActions(["getCollapse", "getCompanyValue"]), //简写
    //预约挂号
    onlineRegistration() {
      this.$emit("onlineRegistration");
      this.$emit("messigeListData",this.tableData)
    },
    getTime(date){
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        if(month<10){month = '0'+month.toString()}
        let day=date.getDate();
        if(day<10){day = '0'+day.toString()}
        return year.toString()+'-'+month.toString()+'-'+day.toString();
    },
    loginOutClick() {
      localStorage.clear()
      this.$router.push({path: '/login'})
    },
    mySchedules(){
       this.$refs.addDoctorTimeRef.showDialog();
    },
    needHelp(){
      this.$router.push({path: '/helpOnline'})
    }
  },
  watch: {
    messageLength:function(n,o){
      if(n == 0 || n == "0"){
        this.message = ""
      }else{
        this.message = n
      }
    },
  }
};
</script>
<style  lang="scss">
  .top-nav .userImg {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  margin-right: 17px;
  position: relative;
  top: 14px;
}

.messageClass{
  line-height: 50%;
  padding:27px 0;
}
//.messageClass > div{
  // float:left;
  // margin-right: 49px;
//}
.news .el-icon-bell:before, .news .el-icon-message:before{
  color:#C2C2C2;
}
.help{
    margin-left: 10px;
    background-repeat: no-repeat;
    background-position: 0 center;
    background-size: 23px;
    font-size: 16px;
    padding-left: 30px;
    color: rgba(112,112,112,1);
    margin-right: 32px !important;
}
.tenantName{
  font-size: 18px;
  color: rgba(112,112,112,1);
}
.phoneImg{
    background-repeat: no-repeat;
    background-position: 0 center;
    background-size: 23px;
    font-size: 16px;
    padding-left: 38px;
    color: rgba(112,112,112,1);
}
.head {
  .collapse-logo {
    padding: 0 20px;
    .icon-shouye {
      font-size: 28px;
    }
  }

  .icon-caidan {
    font-size: 28px;
    display: inline-block;
  }
  .isactive {
    transform: rotate(90deg) !important;
    transition: 0.38s !important;
    transform-origin: 50% 50% !important;
  }
  .el-breadcrumb {
    padding-top: 29px;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #707070;
  }
}
</style>
