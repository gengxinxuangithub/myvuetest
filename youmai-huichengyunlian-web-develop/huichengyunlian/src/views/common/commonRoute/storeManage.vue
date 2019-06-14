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
            tooltip-effect="dark"
            :height="tableHeight"
            style="width: 100%">
            <el-table-column
              label="同业操作"
              width="80">
              <template slot-scope="scope">
                  <el-button type="warning" @click="handleCollect(scope.$index, scope.row)" style="width: 80%;line-height: 28px;">收藏</el-button>
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
        let l = this.$loading()
        axios
        .get("http://www.hctx365.cn/line/baseinfo?lineStatus=1"+"&lineName="+name)
        .then(res=>{
            if(res.data.success){
                _this.routeData =  res.data.data;
            }
            l.close()
        })
    },
    getRouteData(){
        let l = this.$loading()
        let _this = this;
        axios
        .get("http://www.hctx365.cn/line/baseinfo?lineStatus=1")
        .then(res=>{            
            if(res.data.success){
                _this.routeData =  res.data.data;
            }
            l.close()
        }).catch(l.close())
      },
      handleCollect(index, row) {
        let _this = this;
        let postData = {
            lineTenantId : row.lineTenantId,
            lineId : row.lineTenantId,
            tenantId : this.$store.state.tenantId
        }
        axios
        .post("http://www.hctx365.cn/line/baseinfo/collect",postData)
        .then(res=>{
            if(res.data.success){
                _this.$notify({
                    duration:2000,
                    message: res.data.message,
                    type: 'success'
                });
            }
        })
        console.log(postData)
     }
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


