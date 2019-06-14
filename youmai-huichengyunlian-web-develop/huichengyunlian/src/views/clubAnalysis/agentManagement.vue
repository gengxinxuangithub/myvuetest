<template>
  <div class="authority-mgt">
    <div class="containerTitle">
        <el-row >
            <div class="right">
                <el-input v-model="tenantName" size="small" prefix-icon="el-icon-search" placeholder="按代理商搜索" class="block-search"></el-input>
            </div>
        </el-row>
    </div>
    <div class="containerBody">
        <el-table v-loading = "tableLoading" tooltip-effect="dark" @selection-change="handleSelectionChange" ref="multipleTable" stripe :data="tenantData" :height="tableHeight">
            <el-table-column  label="序号" type="index" width="50"></el-table-column>
            <el-table-column  type="selection" fixed >
            </el-table-column>
            <el-table-column label="操作" width="200px;">
                <template slot-scope="scope">
                    <el-button type="text" style="width:auto" @click="handleClubRelation(scope.$index, scope.row)" :disabled="!result.showEdit">客户关系</el-button>
                    <el-button type="text" style="width:auto" @click="handleAgentStatus(scope.$index, scope.row)"  v-show="scope.row.isAgent==0" :disabled="!result.showEdit">升级代理商</el-button>
                    <el-button type="text" style="width:auto" @click="handleAgentStatus(scope.$index, scope.row)" v-show="scope.row.isAgent==1" :disabled="!result.showEdit">降级俱乐部</el-button>
                </template>
            </el-table-column>
            <el-table-column width="300" prop="tenantName" label="代理商名称" > </el-table-column>
            
            <el-table-column label="代理商描述" :show-overflow-tooltip="true" prop="tenantDesc"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="代理商管理员" width="120">
                <template slot-scope="scope">
                    <span>{{getNameByDict(scope.row.tenantAdminId) }}</span>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="是否代理商" width="100">
                <template slot-scope="scope">
                    <span>{{getLabelById(scope.row.isAgent) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="推荐码" width="100">
                <template slot-scope="scope">
                    <span>{{getuserName(scope.row.referrerCode) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="代理商期限" width="150" prop="validDate"></el-table-column>
            <el-table-column
                label="创建时间" width="180">
                <template slot-scope="scope">
                    <span>{{ subTime(scope.row.createdDate) }}</span>
                </template>
             </el-table-column>
        </el-table>
        <div style="text-align: right;margin-top: 20px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 40, 80]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
    </div>
    <el-dialog :title="createOrEdit" :visible.sync="tenantNewVisible" :close-on-click-modal="notClose" width="33%">
        <div class="tenant-div">
            <el-form :model="tenantForm" :rules="tenantRules" ref="tenantForm" label-width="100px" class="demo-tenantForm">
                <el-form-item label="代理商名称" prop="tenantName">
                    <el-input v-model="tenantForm.tenantName" @blur="mapName(tenantForm.tenantName)"></el-input>
                </el-form-item>
                <el-form-item label="代理商期限" >
                    <el-col :span="24">
                        <el-date-picker type="date" placeholder="选择日期" v-model="tenantForm.validDate" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="代理商描述" prop="tenantDesc">
                    <el-input type="textarea" v-model="tenantForm.tenantDesc"></el-input>
                </el-form-item>
                <el-form-item label="代理商管理员" prop="tenantAdminId" style="width: 100%;">
                    <el-select
                        v-model="tenantForm.tenantAdminId"
                        filterable
                        remote
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading">
                        <el-option
                        v-for="item in userOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="cancelBtn" @click="tenantNewVisible = false">取 消</el-button>
                    <el-button class="saveBtn" type="success" @click="submitTenantForm('tenantForm')">确 定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
    <el-dialog :title="editClubRelationDialog" :visible.sync="editClubRelationVisible" :close-on-click-modal="notClose" width="33%">
        <div class="clubRelationDialog-div">
            <el-form :model="clubRrelationForm" ref="clubRrelationForm" label-width="100px" class="demo-tenantForm">
                <el-form-item label="员工Code" prop="userCode">
                    <el-select v-model="clubRrelationForm.referrerCode" filterable placeholder="请选择" clearable>
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <!-- <el-input v-model="clubRrelationForm.referrerCode"></el-input> -->
                </el-form-item>
                <el-form-item>
                    <el-button class="cancelButton" @click="editClubRelationVisible = false">取 消</el-button>
                    <el-button class="saveButton" type="success" @click="putClubRelation('clubRrelationForm')">确 定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {clearError} from '@/utils';
import {
    httpPost,
    httpGet,
    httpGetParams,
    httpDelete,
    httpGetUser,
    httpPut
} from "@/axios/api";
export default {
    data(){
      return{
        options:[],
        result:this.$store.state.result.tenant,
        tenantName:'',
        notClose:false,
        createOrEdit:'新增代理商',
        tenantForm:{//代理商form
            tenantName:'',
            tenantDesc:'',
            validDate:'',
            tenantAdminId:'',
        },
        tenantRules:{//代理商规则
            tenantName: [
                { required: true, message: '请输入代理商名称', trigger: 'blur' },
            ],
            tenantDesc: [
                { required: true, message: '请填写代理商描述', trigger: 'blur' }
            ],
        },
        tenantNewVisible:false,
        isTenantCreated:false,//是否新建
        tableLoading:false,
        multipleSelection:[],
        currentPage:1,
            pageSize:10,
            total:1,
        tenantData:[],//代理商表格
        loading:false,//远程搜索的
        userOptions: [],
        dictData:[],//字典数据
        tableHeight: document.documentElement.clientHeight - 220,
        editClubRelationDialog:'编辑客户关系',
        editClubRelationVisible:false,
        clubRrelationForm:{
            tenantId:'',
            referrerCode:''
        }
      }
    },
    activated () {
        const that = this
        that.tableHeight = document.documentElement.clientHeight - 220
        window.onresize = () => {
            return (() => {
                    that.tableHeight = document.documentElement.clientHeight - 220
            })()
        }
    },
    created(){
        this.getUserCode()
        this.getUserManageData();
        
        this.getDictData();
    },
    methods:{
        getuserName(code){
            let ret = "";
            this.options.forEach(element => {
                if(element.value == code){
                    ret = element.label
                }
            });
            return ret
        },
        getUserCode() {
            this.options = []
            httpGet('/setting/dict/map/USER_CODE')
            .then(res=>{
                if(res.success){
                    for (var key in res.data){
                        this.options.push({value:key,label:res.data[key]})
                    }
                    this.getTenantManageData();
                }else{
                    this.options = []
                }
            })
            .catch(error=>{
                this.options = []
            })
        },
        //分页
        handleSizeChange(val) {
            this.pageSize = val
            this.tenantSearch();
        },
        //分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.tenantSearch();
        },
        //获取字典数据
        getDictData(){
            let _this=this;
            httpGet("/setting/dict/map/USER")
            .then(function(response){
                if(response.success){
                    let resKeys =Object.keys(response.data);
                    let resValues =Object.values(response.data);
                    resKeys.forEach(function(el,index){
                        _this.dictData.push({key:el,value:resValues[index]});
                    })
                }
            })
        },  
        //翻译代理商Code
        getNameByDict(key){
            let ret='';
            this.dictData.forEach(function(element){
                if(element.key==key){
                    ret = element.value;
                    return false;
                }
            })
            if(ret==""){
                ret = key;
            }
            return ret;
        },
        //新建代理商校验是否重名
        mapName(name){
            if(name){
                let _this=this;
                httpGet("/auth/tenants?tenantName="+name)
                .then(function(response){
                    if(response.success&&response.data.length>0){
                        _this.$message({
                            message: '该名称已存在',
                            showClose: true,
                            type: 'warning'
                        });
                        _this.tenantForm.tenantName="";
                    }
                })
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
      //新增按钮点击事件
      addNewClick(){
        this.createOrEdit='新增代理商';
        this.tenantNewVisible=true;
        this.$nextTick(()=>{
            clearError(this.$refs.tenantForm.fields)
        })
        this.isTenantCreated=true;
        this.tenantForm={//
            tenantName:'',
            tenantDesc:'',
            tenantAdminId:'',
        }
      },
        //批量删除
        moreDeleteClick(){
          let _this = this;
          if(this.multipleSelection.length==0){
              this.$message({
                duration:2000,
                message: '请选择至少一个代理商',
                showClose: true,
                type: 'warning'
            });
          }else{
            this.$confirm('确认删除？')
            .then(_ => {
                let param =[];
                this.multipleSelection.forEach(element => {
                    param.push({tenantId:element.tenantId});
                });
                httpDelete("/auth/tenant",{data: param})
                .then(function(response){
                    if(response.success){
                        _this.$message({
                            duration:2000,
                            showClose: true,
                            message: response.message,
                            type: 'success'
                        });
                        _this.getTenantManageData();
                    }
                })
                },() => {})
            }
        },
      //查询所有代理商
        getTenantManageData(){
            let _this=this;
            _this.tableLoading = true;
            httpGet("/auth/all_tenants?isAgentManager=true&pageSize="+this.pageSize+"&currentPage="+this.currentPage)
             .then(function(response){
                 _this.tableLoading = false;
                 _this.tenantData = response.data;
                 _this.total = response.pageData.totalRows;
             })
        },
        getTime(date){
            let year=date.getFullYear();
            let month=date.getMonth()+1;
            if(month<10){month = '0'+month.toString()}
            let day=date.getDate();
            if(day<10){day = '0'+day.toString()}
            return year.toString()+'-'+month.toString()+'-'+day.toString();
        },
        //代理商新增
        submitTenantForm(formName){
            let postData = this.tenantForm;
            this.tenantForm.validDate = !!this.tenantForm.validDate ? this.getTime(this.tenantForm.validDate) : '';
            let _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid){
                    if(this.isTenantCreated){
                        httpPost("/auth/tenant",postData)
                        .then(function(response){
                            if(response.success){
                                _this.tenantNewVisible=false;
                                _this.isTenantCreated=false
                                _this.getTenantManageData();
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });

                            }else{
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'warning'
                                });
                            }
                        })
                    }else{
                        httpPut("/auth/tenant",postData)
                        .then(function(response){
                            if(response.success){
                                _this.tenantNewVisible=false;
                                _this.isTenantCreated=false
                                _this.getTenantManageData();
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });

                            }else{
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });
                            }
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })

        },
        subTime(time){
            return time.substring(0,19);
        },
        //代理商编辑
        handleTenantEdit(index, row){
            this.tenantNewVisible=true;
            this.isTenantCreated=false;
            this.$nextTick(()=>{
                clearError(this.$refs.tenantForm.fields)
            })
            this.tenantForm.tenantId = row.tenantId;
            this.tenantForm.validDate = new Date(row.validDate);
            this.tenantForm.tenantName = row.tenantName;
            this.tenantForm.tenantDesc = row.tenantDesc;
            this.tenantForm.tenantAdminId = row.tenantAdminId;
            this.userOptions=[{label:this.getNameByDict(row.tenantAdminId),value:row.tenantAdminId}],
            this.createOrEdit='代理商编辑';
        },
        //代理商删除
        handleDelete(index, row) {
            console.log(index, row);
        },
        //维护俱乐部跟员工之间的关系
        handleClubRelation(index, row){
            this.editClubRelationDialog='维护客户关系';
            this.editClubRelationVisible=true;
            this.$nextTick(()=>{
                clearError(this.$refs.clubRrelationForm.fields)
            })
            this.clubRrelationForm.tenantId = row.tenantId;
            this.clubRrelationForm.referrerCode = row.referrerCode;
        },
        //维护俱乐部跟员工之间的关系
        putClubRelation(formName){
            let postData = this.clubRrelationForm;
            let _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid){
                    httpPut("/auth/tenant/referrer/code",postData)
                        .then(function(response){
                            if(response.success){
                                _this.editClubRelationVisible=false;
                                _this.getTenantManageData();
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });

                            }else{
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });
                            }
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })

        },
        handleAgentStatus(index, row){
            let _this = this;
            let postData = {tenantId:row.tenantId,isAgent:row.isAgent == 1 ? '0' : '1'}
            httpPut("/auth/tenant/agent/status",postData)
                        .then(function(response){
                            if(response.success){
                                _this.getTenantManageData();
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });
                            }else{
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'error'
                                });
                            }
                        })
        },

        getLabelById(id){
            let ret = "";
            if(id=="1"||id==1){
                ret ="是"
            }
            if(id=="0"||id==0){
                ret ="否"
            }
            return ret;
        },

        /*
        获取用户管理数据
        */
        getUserManageData(){
            let _this=this;
            httpGet("/auth/all_users")
             .then(function(response){
                 _this.userData = response.data;
                 _this.userList = _this.userData.map(item => {
                    return { value: item.userId, label: item.userName };
                });
             })
        },
        //远程搜索代理商管理员
        remoteMethod(query) {
            if (query !== '') {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.userOptions = this.userList.filter(item => {
                return item.label.toLowerCase()
                    .indexOf(query.toLowerCase()) > -1;
                });
            }, 200);
            } else {
                this.userOptions = [];
            }
        },
        //代理商查询
        tenantSearch(){
            let _this=this;
            httpGet("/auth/all_tenants?tenantName="+this.tenantName+ "&tenantId" + this.$store.state.tenantId+"&pageSize="+this.pageSize+"&currentPage="+this.currentPage)
             .then(function(response){
                 _this.tenantData = response.data;
                 _this.total = response.pageData.totalRows;
             })
        },
    },
    watch:{
        tenantName(n,o){
            this.tenantName = n;
            this.tenantSearch();
        },
    },
}
</script>
<style>
     .authority-mgt .el-date-editor.el-input, .authority-mgt .el-date-editor.el-input__inner{
        width: 100% !important;
    }
</style>

<style scope>
    @import '../common/common.css';
</style>