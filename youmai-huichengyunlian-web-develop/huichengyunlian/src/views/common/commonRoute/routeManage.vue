<template>
    <div class="authority-mgt">
        <div class="containerTitle">
            <el-row>
                <div class="left">
                    <el-button type="primary" @click="toNewRoute">新建线路</el-button>
                    <el-button type="danger" @click="deleteRoute">删除线路</el-button>
                </div>
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
                tooltip-effect="dark"
                v-loading="loading"
                style="width: 100%" 
                :height="tableHeight"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection"  width="55" style="text-align:center"> </el-table-column>
                <el-table-column 
                width="250"
                label="我的操作">
                <template slot-scope="scope">
                    <el-row class="operate" :gutter="20">
                      <el-col :span="6">
                         <el-button  @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
                      </el-col>
                      <el-col :span="6">
                        <el-button  type="success" @click="handleUpload(scope.$index, scope.row,'1')" >上架</el-button>
                      </el-col>
                      <el-col :span="6">
                        <el-button  type="danger" @click="handleUpload(scope.$index, scope.row,'0')" >下架</el-button>
                      </el-col>
                      <el-col :span="6">
                        <el-popover
                          placement="top-start"
                          trigger="hover" >
                          <div><img style="width: 150px;" :src="scope.row.lineQrCode"/></div>
                          <el-button slot="reference" >二维码</el-button>
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
      deleteRoute(){
        let _this =this;
        if( this.multipleSelection.length==0){
            this.$notify({
                duration: 2000,
                message: '请至少选择一条线路',
                type: 'warning'
            });
        }else{
            //执行删除
            this.$confirm('确认删除？')
                .then(_ => {
                let param =[];
                this.multipleSelection.forEach(element => {                    
                    param.push({lineId:element.lineId});
                });
                axios
                .delete("http://www.hctx365.cn/line/baseinfo",{data: param})
                .then(function(response){
                    if(response.success){
                        _this.$notify({                     
                            duration:2000,
                            message: response.message,
                            type: 'success'
                        });
                        _this.getRouteData();
                    }
                })
            },() => {})
        }
    },
    //点击进入线路详情
    showRouteDetail(row){
        window.open('#/showRouteDetail?lineId='+row.lineId+'&lineTenantId='+row.lineTenantId,'_blank');
    },
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    //制定查询线路
    searchRoute(name){
        let _this = this;
        axios
        .get("http://www.hctx365.cn/line/baseinfo?lineTenantId="+this.$store.state.tenantId+"&lineName="+name)
        .then(res=>{
            if(res.data.success){
                _this.routeData =  res.data.data;
            }
        })
    },
    getRouteData(){
        let _this = this;
        this.loading = true;
        axios
        .get("http://www.hctx365.cn/line/baseinfo?lineTenantId="+this.$store.state.tenantId)
        .then(res=>{
            if(res.data.success){
                _this.routeData =  res.data.data;
                 _this.routeData.forEach(element => {
                    element.lineQrCode = "http://www.hctx365.cn/img/"+element.lineQrCode
                });
                _this.loading = false;
                console.log(_this.routeData);
            }
        })
      },
      handleEdit(index, row){
          this.$store.state.lineId = row.lineId;
          this.$store.state.lineCreate = false;
          this.$store.state.route='myRoute';
          this.$router.push({
              path: '/newRoute',
              query: {
                lineId: row.lineId
              }
            });
      },
      //上架/下架
    handleUpload(index, row,num) {
        let postData={};
        let _this = this;
        postData = row;
        if(postData.lineStatus == num){
            let message = num=='1'?'该线路已上架':'该线路已下架';
            this.$notify({
            duration:2000,
            message: message,
            type: 'warning'
        });
        return false;
        }
        postData.lineStatus = num;
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
    toNewRoute(){
      this.$store.state.lineCreate = true;
      this.$store.state.route='routeManage';
      this.$router.push('/newRoute');
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


