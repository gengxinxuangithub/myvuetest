<template>
<transition name="right-slide">
    <div class="messageListPage">
        <div class="title">
            <span @click="hospitalizedClick">消息列表</span>
            <div @click="closeMessageList" class="closeBtn"><i class="el-dialog__close el-icon el-icon-close"></i></div>
        </div>
        <el-table  :data="tableData" :height="tableHeight" style="width: 100%" stripe :show-header="false">
            <el-table-column>
                <template slot-scope="scope">
                    <div style="position:relative;padding: 5px 0;" v-html="getMessageListData(scope.row)"></div>
                    <div @click="hospitalizedClick(scope.row)" class="btn">已就医</div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</transition>
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
  data() {
    return {
        tableData:[],
         tableHeight:document.body.clientHeight - 160
    };
  },
    activated () {
        const that = this
        that.tableHeight = document.documentElement.clientHeight - 160
        window.onresize = () => {
            return (() => {
                that.tableHeight = document.documentElement.clientHeight - 160
            })()
        }
    },
 created(){
      this.tableData = this.messigeListData;
 },
  props:["messigeListData"],
  methods: {
    //已就医接口
    hospitalizedClick(data){
        let putData = {
            doctorId:data.doctorId,
            registrationId:data.registrationId,
            patientId:data.patientId,
            registrationStatus:'1',
        }
        let _this = this
        httpPut("http://yyzssoft.com/registration/register/",putData)
        .then(function(response){
            if(response.success){
                _this.getMessageList();
            }
        })
        .catch(error=>{})
    },
    //从接口获取数据
    getMessageList(){
        let _this = this;
        let postData = {
          "clinicId":this.$store.state.tenantId,
          "doctorId":this.$store.state.doctorId,
        //   "clinicId":"96d5138e-bfe3-40e4-addc-53ba33ea4b19",
        //   "doctorId":"ab3f34ad-8635-4365-a11d-9f56d442a661",
          //"registrationDay":this.getTime(new Date()),
          "registrationStatus":["0"]
        };  
        httpPost("http://yyzssoft.com/registration/register/some",postData)
        .then(response => {
          if (response.success) {
              _this.tableData = response.data;
              _this.$store.state.messageCount = response.data.length;
          }
        }).catch(error => {

        });   
    },
    getTime(date){
        let year=date.getFullYear();
        let month=date.getMonth()+1;
        if(month<10){month = '0'+month.toString()}
        let day=date.getDate();
        if(day<10){day = '0'+day.toString()}
        return year.toString()+'-'+month.toString()+'-'+day.toString();
    },
    //关闭消息列表页面事件
    closeMessageList(){
        this.$emit("onlineRegistration");
    },
    //获取消息列表dom格式化
   getMessageListData(data){
      let registrationDate = "";
      let registrationBigDate = data.registrationDate.split(" ")[0]
      let registrationFlag = data.registrationDate.split(" ")[1].split(":")[0];
      if(registrationFlag.indexOf('9') > -1){
          registrationDate = "08:00-"+ registrationFlag +":00"
      }
      if(registrationFlag.indexOf('10') > -1){
          registrationDate = "09:00-"+ registrationFlag +":00"
      }
      if(registrationFlag.indexOf('11') > -1){
          registrationDate = "10:00-"+ registrationFlag +":00"
      }
      if(registrationFlag.indexOf('12') > -1){
          registrationDate = "11:00-"+ registrationFlag +":00"
      }
      if(registrationFlag.indexOf('14') > -1){
          registrationDate = "13:00-"+ registrationFlag +":00"
      }
      if(registrationFlag.indexOf('15') > -1){
          registrationDate = "14:00-"+ registrationFlag +":00"
      }
      if(registrationFlag.indexOf('16') > -1){
          registrationDate = "15:00-"+ registrationFlag +":00"
      }  
      if(registrationFlag.indexOf('17') > -1){
          registrationDate = "16:00-"+ registrationFlag +":00"
      }    
     return "<div class='messageItem messageItemTop'>"+ data.clinicPatientName + ": " + data.clinicPatientPhone 
     +"</div><div class='messageItem messageItemBottom'>预约日期："+ registrationBigDate +"</div><div class='messageItem messageItemBottom'>预约时间："+ registrationDate +"</div>"
   }
  },
};
</script>
<style lang="scss">
.right-slide-enter,
.right-slide-leave-active {
    transform: translateX(300px);
    -webkit-transform:translateX(300px);
    -ms-transform: translateX(300px);
    -moz-transform: translateX(300px);
}
.right-slide-leave-active,
.right-slide-enter-active {
    transition: all 1s;
}
.messageListPage{
    .closeBtn{
        padding:10px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        -webkit-transform:translateY(-50%,);
        -ms-transform: translateY(-50%);
        -moz-transform: translateY(-50%);
        right: 10px;
        cursor: pointer;
    }
    .btn{
        position: absolute;
        width:50px;
        height:25px;
        line-height:25px;
        cursor: pointer;
        border-radius: 10px;
        background-color: #67c23a;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
       -webkit-transform:translateY(-50%,);
		-ms-transform: translateY(-50%);
		-moz-transform: translateY(-50%);
        font-size:10px;
        color: white;
    }
    .title{
        color:#363636;
        margin: 20px 0 20px 20px;
        font-size:15px;
        position: relative;

    }
    .messageItem{
        padding-left:10px;
        text-align: left;
        padding-bottom: 5px;
    }
    .messageItemTop{
        color: #5D5D5D;
        font-size: 14px;
    }
    .messageItemBottom{
        color: #A4A4A4;
        font-size: 12px;
    }
    .el-table tr:nth-child(1){
         background-color: #F5F9FD;
     }
}
</style>
