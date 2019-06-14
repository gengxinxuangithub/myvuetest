<template>
  <div class="authority-mgt">
      <div class="containerTitle">
          <el-row>
              <div class="left">
                  <el-button class="addBtn" style="cursor: pointer;" type="success" icon="el-icon-circle-plus-outline" @click="toNewTicket" >新增</el-button>
                  <el-button class="deleteBtn" type="danger" icon="el-icon-delete">删除</el-button>                
              </div>
              <div class="right">
                <el-row :gutter="20">
                  <el-col :span="8">
                      <el-input v-model="scenicName" size="small" prefix-icon="el-icon-search" placeholder="景区名称" class="block-search"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-select v-model="statevalue" placeholder="景区状态">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8"></el-col>
              </el-row>
                  
                  
              </div>
          </el-row>
      </div>
    <!-- <div class="containerBody">
      <el-button >查询</el-button>  
      <el-button >重置</el-button>  
      <el-button type="primary" @click="toNewTicket" >新增</el-button>
      <el-button type="danger">删除</el-button>
        <div style="margin-top:20px">
            <div>
                <span>景区名称</span>
                <span ><el-input v-model="scenicName" style="width:200px"></el-input></span>
                <span style="padding-left:10px;">发布时间</span>
                <span> <el-date-picker v-model="releaseTimeF" type="date" placeholder="选择日期"></el-date-picker></span>
                <span>-</span>
                <span> <el-date-picker v-model="releaseTimeT" type="date" placeholder="选择日期"></el-date-picker></span>
                <span style="padding-left:10px;">状态</span>
                <span>
                    <el-select v-model="statevalue" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </span>
            </div>
        </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data(){
    return{
      scenicName:'',
      releaseTimeF:'',
      releaseTimeT:'',
      input21:'',
      statevalue:'',
      options: [{
          value: '私有',
          label: '私有'
        }, {
          value: '公有',
          label: '公有'
        }, {
          value: '下线',
          label: '下线'
        }],
    }
  },
  methods:{
      handleClick(tab, event) {
        this.tabName =this.activeName
      },
      toNewTicket(){
        this.$router.push('/newTicket')
      },
  },
}
</script>

<style scoped>
  @import '../../common/common.css';
</style>


