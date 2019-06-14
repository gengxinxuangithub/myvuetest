<template>
    <div class="authority-mgt">
        <div class="containerTitle">
            <el-row>
                <div class="right">
                    <el-input style="width:250px;margin-right:20px" placeholder="请输入线路名称" suffix-icon="el-icon-search" v-model="input21"> </el-input>
                </div>
            </el-row>
        </div>
        <div class="containerBody">
            <el-table
            :border ='showBorder'
            ref="multipleTable"
            :data="routeData"
            :height="tableHeight"
            tooltip-effect="dark">
            <el-table-column
              label="网店操作"
              width="200">
              <template slot-scope="scope">
                  <el-row class="operate" :gutter="20">
                      <el-col :span="8">
                        <el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button> 
                      </el-col>
                      <el-col :span="8">
                        <el-button type="danger" @click="handleUpload(scope.$index, scope.row)">下架</el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-popover
                            placement="top-start"
                            trigger="hover" >
                            <div><img style="width: 150px;" :src="scope.row.lineQrCode"/></div>
                            <el-button  size="mini" slot="reference">二维码</el-button>
                        </el-popover>
                      </el-col>
                  </el-row>
              </template>
            </el-table-column>
            <el-table-column label="线路名称" :show-overflow-tooltip="true" >
                <template slot-scope="scope"><span @click="showRouteDetail(scope.row)" class="route-name">{{ scope.row.lineName}}</span></template>
            </el-table-column>
            <el-table-column label="市场参考价" :show-overflow-tooltip="true" width="150">
                <template slot-scope="scope"><span>{{ scope.row.lineMarketPrice }}</span></template>
            </el-table-column>
            <el-table-column label="行程天数" :show-overflow-tooltip="true" width="150">
                <template slot-scope="scope"><span>{{ scope.row.lineTripDays }}</span></template>
            </el-table-column>
          </el-table>
        </div>
    </div>
</template>

<script>
import { mapState} from 'vuex'
import axios from "axios"
export default {
  data(){
    return{      
      input21:'',
      routeData:[],
      showBorder:true,
      multipleSelection: [],
      loading:false,
      url:'',
      tableHeight: document.documentElement.clientHeight - 220
    }
  },
  activated(){ 
    const that = this
    that.tableHeight = document.documentElement.clientHeight - 220
    window.onresize = () => {
        return (() => {
                that.tableHeight = document.documentElement.clientHeight - 220
        })()
    }
    this.getRouteData();  
  },
  computed:{
    ...mapState(["tenantId",'lineId','lineCreate']),

  },
  methods:{    
      //制定查询线路
    searchRoute(name){
        let _this = this;
        axios
        .get("http://www.hctx365.cn/line/baseinfo?lineTenantId="+this.$store.state.tenantId+"&lineName="+name+"&lineStatus=1")
        .then(res=>{
            if(res.data.success){
                _this.routeData =  res.data.data;
            }
        })
    },
    getRouteData(){
        let _this = this;
        axios
        .get("http://www.hctx365.cn/line/baseinfo?lineTenantId="+this.$store.state.tenantId+"&lineStatus=1")
        .then(res=>{
            if(res.data.success){
                _this.routeData =  res.data.data;
            }
        })
      },
      handleEdit(index, row){
          this.$store.state.lineId = row.lineId;
          this.$store.state.lineCreate = false;
          this.$router.push({
              path: '/newRoute',
              query: {
                lineId: row.lineId
              }
            });
      },
    //xia架
    handleUpload(index, row) {
        let postData = {};
        let _this = this;
        postData = row;
        if(postData.lineStatus == '0'){
            this.$notify({
                duration:2000,
                message: '该线路已下架',
                type: 'warning'
            });
            return false;
        }
        postData.lineStatus = '0';
        axios
        .put("http://www.hctx365.cn/line/baseinfo",postData)
        .then(res=>{
            if(res.data.success){
                _this.$notify({
                    duration:2000,
                    message: res.data.message,
                    type: 'success'
                });
                _this.getRouteData();
            }
        })
    },
  },
  watch:{
    input21(){
        this.searchRoute(this.input21);
    },
  },
}
</script>

<style scoped>
@import '../../common/common.css';
.operate .el-button{
  width: 120% !important;
  line-height: 28px;
}
</style>


