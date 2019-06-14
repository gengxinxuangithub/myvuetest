<template>
   <div class="authority-mgt">
      <div class="containerTitle">
        <el-row>
            <div class="left">
                <el-button class="addBtn" style="cursor: pointer;" type="success" icon="el-icon-circle-plus-outline" @click="userNewClick" v-show="result.showAdd">新增</el-button>
                <el-button class="deleteBtn" type="danger" icon="el-icon-delete" @click="moreDeleteClick" v-show="result.showDelete">删除</el-button>
                <el-button class="roleBtn" type="success" icon="el-icon-circle-plus" @click="roleBindClick" v-show="result.showResource">角色绑定</el-button>
            </div>
            <div class="right">
                <el-input v-model="username" size="small" prefix-icon="el-icon-search" placeholder="按用户名/手机搜索" class="block-search"></el-input>
            </div>
            <div class="right">
                <el-input v-model="tenantName" size="small" prefix-icon="el-icon-search" placeholder="按俱乐部搜索" class="block-search"></el-input>
            </div>
        </el-row>
    </div>
    <div class="containerBody">
        <el-table
            stripe ref="multipleTable" :data="userData" tooltip-effect="dark"  @selection-change="handleSelectionChange" v-loading = "tableLoading" :height="tableHeight">
            <el-table-column type="selection" fixed  width="55">
            </el-table-column>
            <el-table-column  label="序号" type="index" width="60"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="text"  @click="handleUserEdit(scope.$index, scope.row)" :disabled="!result.showResource">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" ></el-table-column>
            <el-table-column prop="userCode" label="用户CODE" ></el-table-column>
            <el-table-column label="所属代理商"  :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span>{{getNameByDict(scope.row.tenantCode) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="性别" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.userSex==0">保密</span>
                    <span v-if="scope.row.userSex==1">帅哥</span>
                    <span v-if="scope.row.userSex==2">靓女</span>
                </template>
            </el-table-column>
            <el-table-column prop="userMobile" label="手机"></el-table-column>
            <el-table-column label="有效期" prop="validDate" width="120"></el-table-column>
            <el-table-column label="角色" prop="roleName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="是否有效" width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.userStatus==1">是</span>
                <span v-if="scope.row.userStatus==0">否</span>
            </template>
            </el-table-column>
            <el-table-column
                label="创建时间" >
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
    <el-dialog
        :title="createOrEdit"
        :visible.sync="userNewVisible"
        :close-on-click-modal="notClose"
        width="30%">
        <div>
            <el-form :model="userInline" :rules="rulesInline" ref="userInline" label-width="120px" class="demo-userInline">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userInline.username" placeholder="请选择用户名称" @blur="mapName(userInline.username)"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="userSex">
                    <el-select v-model="userInline.userSex" placeholder="请选择用户性别">
                        <el-option
                            v-for="item in forSexs"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="初始密码" prop=" password" v-if="isUserCreated">
                    <el-input v-model="userInline.password" type="password" placeholder="设置初始密码"></el-input>
                </el-form-item>
                <el-form-item label="所属代理商" prop="tenantCode">
                    <el-select v-model="userInline.tenantCode" placeholder="请选择代理商">
                        <el-option v-for="(item,index) in tenantData"
                            :key="index" :label="item.tenantName" :value="item.tenantId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="userMobile">
                    <el-input :maxlength=11 v-model.number="userInline.userMobile" placeholder="输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="userInline.userEmail" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="有效日期" prop="validDate">
                    <el-date-picker format="yyyy-MM-dd"
                        v-model="userInline.validDate"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="userStatus">
                    <el-select v-model="userInline.userStatus" placeholder="请选择用户状态">
                        <el-option
                            v-for="item in forUserStatus"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="cancelBtn" @click="userNewVisible = false">取 消</el-button>
                    <el-button class="saveBtn" type="success" @click="onUserSubmit('userInline')">确 定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
        <el-dialog title="角色绑定" :close-on-click-modal="notClose" :visible.sync="roleBindShow" width="30%">
          <el-row >
              <el-col :span="10" style="margin-right:10px;">
                  <el-select v-model="choosedRole" filterable placeholder="请输入角色名">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                  </el-select>
              </el-col>
                <el-col :span="5">
                  <el-button class="addBtn" type="success" @click="addRole" :disabled="choosedRole.length==0">添加</el-button>
              </el-col>
          </el-row>
          <el-table :data="roleTableData" border style="width: 100%">
              <el-table-column prop="roleName" label="角色" ></el-table-column>
              <el-table-column label="操作" >
                <template slot-scope="scope">
                  <el-button @click="deleteRole(scope.row)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
          </el-table>
    </el-dialog>
   </div>
</template>
<script>
import {mapActions, mapState} from 'vuex'
import {
    httpPost,
    httpGet,
    httpGetParams,
    httpDelete,
    httpGetUser,
    httpPut
} from "@/axios/api";
import {clearError} from '@/utils';
export default {
    data(){
         var checkEmail = (rule, value, callback) => {
            if (!value) {
                return callback();
            }
            if (value) {
                setTimeout(() => {
                    var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入有效的电子邮箱！'));
                    } else {
                        callback();
                    }
                }, 500);
            }
        };
      return{
        currentPage:1,
            pageSize:10,
            total:1,
        result:this.$store.state.result.user,
        createOrEdit:'新增用户',
        userTenant:'',//所属代理商
        isUserCreated:false,
        roleBindShow:false,
        notClose:false,
        tenantData:[],//所有代理商
        userInline:{//用户form
            userId:'',
            username:'',
            userSex:'',
             password:'',//密码
            userMobile:'',
            tenantCode:'',//用户所属代理商code
            userEmail:'',
            validDate:'',
            userStatus:'',
        },
        roleData:[],//角色列表
        roleDataTemp:[],
        tableLoading:false,
        rulesInline:{//用户规则
            username: [
                { required: true, message: '请输入用户名称', trigger: 'blur' },
            ],
             password:[
                { required: true, message: '请输入用户密码', trigger: 'blur' },
                { min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' },
                {pattern: /^(\w){6,20}$/,message: '只能输入6-20个字母、数字、下划线'}
            ],
            tenantCode:[
                { required: true, message: '请输入所属代理商', trigger: 'blur' },
            ],
            userMobile:[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                {pattern: /^[1-9]\d*$/,message: '只能输入数字'},
            ],
            userEmail: [
                {validator: checkEmail, trigger: 'blur,change'}
            ],
        },
        forUserStatus:[{label:"有效",value:"1"},{label:"无效",value:"0"}],
        forSexs: [{value: '0',label: '保密'}, {value: '1',label: '帅哥'}, {value: '2靓女',label: '靓女'}],
        forRoles:[{value: '1', label: '系统管理员'},{ value: '0',label: '设备管理员'}],
        username:'',
        userMobile:'',
        tenantName:'',
        userData:[],
        userNewVisible:false,
        multipleSelection: [],
        bindId:'',
        options:[],
        choosedRole: '',
        roleTableData: [],
        roleHaveExist: [],
        dictData:[],//字典数据
        tableHeight: document.documentElement.clientHeight - 220
      }
    },
    activated(){
        this.getUserManageData();
        this.getAllRoleDate();
        this.getTenantManageData();
        this.getDictData();
        const that = this
        that.tableHeight = document.documentElement.clientHeight - 220
        window.onresize = () => {
            return (() => {
                    that.tableHeight = document.documentElement.clientHeight - 220
            })()
        }
    },
    computed:{
        ...mapState(["tenantId"]),
    },
    // created(){
    //   this.getUserManageData();
    //   this.getAllRoleDate();
    //   this.getTenantManageData();
    //   this.getDictData();
    // },
    methods:{
        //分页
        handleSizeChange(val) {
            this.pageSize = val
            this.searchUserData();
        },
        //分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.searchUserData();
        },
        //获取字典数据
        getDictData(){
            let _this=this;
            httpGet("/setting/dict/map/TENANT")
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
            return ret
        },
        //校验用户名重复性
         mapName(name){
            if(name){
                let _this=this;
                httpGet("/auth/users?username="+name)
                .then(function(response){
                    if(response.success&&response.data.length>0){
                        _this.$message({
                            message: '该名称已存在',
                            showClose: true,
                            type: 'warning'
                        });
                        _this.userInline.username="";
                    }
                })
            }
        },
        roleBindClick(){
            if(this.multipleSelection.length==1){
                this.bindId= this.multipleSelection[0].userId;
                this.roleBindShow = true;
                this.getAllRoleDate();
                this.getRoleData();
            }else{
                this.$message({
                    duration:2000,
                    showClose: true,
                    message:'请选择一个用户',
                    type: 'warning'
                });
            }
        },

        //获取用户角色
        getRoleData(){
            let _this=this;
            axios.get("/auth/roles/"+_this.bindId)
            .then(function(response){
                _this.roleTableData = response.data
                _this.roleHaveExist = []
                for(let key in _this.roleTableData){
                    _this.roleHaveExist.push(_this.roleTableData[key].roleId)
                }
            })
        },
        subTime(time){
            return time.substring(0,19);
        },
        //删除用户已有角色
        deleteRole(row){
            let _this=this;
            let arr = [{
                roleId:row.roleId
            }]
            httpDelete("/auth/role/"+_this.bindId,{data:arr})
            .then(function(response){
                if(response.success){
                    _this.$message({
                        duration:2000,
                        showClose: true,
                      message: '删除成功',
                      type: 'success'
                    });
                    _this.getRoleData()
                    _this.choosedRole=''
                }
            })
        },
        //为用户添加角色
        addRole(){
            if(this.roleHaveExist.indexOf(this.choosedRole)!=-1){
                this.$message({
                    duration:2000,
                    showClose: true,
                  message: '所选角色已存在，请重新选择！',
                  type: 'warning'
                });
                return
            }
            let _this=this;
            let param = {
                userId:_this.bindId,
                roleId:_this.choosedRole
            }
            httpPost("/auth/role/link",param)
            .then(function(response){
                if(response.success){
                    _this.$message({
                        duration:2000,
                        showClose: true,
                      message: '添加成功',
                      type: 'success'
                    });
                    _this.roleBindShow = false;
                    _this.getUserManageData();
                }
            })
        },
        //查询所有代理商
        getTenantManageData(){
          let _this=this;
            httpGet("/auth/all_tenants")
            .then(function(response){
                if(_this.$store.state.tenantId == "b78ded8f-209c-11e9-8101-52540016ed2f"){
                    _this.tenantData = response.data;
                }else{
                    response.data.forEach(function(el,index){
                        if(el.tenantId == _this.$store.state.tenantId){
                            _this.tenantData[0] = el;
                        return;
                        }
                    })
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //批量删除
        moreDeleteClick(){
          let _this = this;
          if(this.multipleSelection.length==0){
              this.$message({
                  duration:2000,
                  showClose: true,
                message: '请选择至少一个用户',
                type: 'warning'
            });
          }else{
            this.$confirm('确认删除？')
                .then(_ => {
                let param =[];
                let user={};
                this.multipleSelection.forEach(element => {
                    user={}
                    user.userId = element.userId;
                    param.push(user);
                });
                httpDelete("/auth/user",{data: param})
                .then(function(response){
                    if(response.success){
                        _this.$message({
                            duration:2000,
                            showClose: true,
                            message: response.message,
                            type: 'success'
                        });
                        _this.getUserManageData()
                    }
                })
              },() => {}
            )}
        },
      /*
        获取用户管理数据
        */
        getUserManageData(){
            this.username="";
            this.userMobile ="";
            let _this=this;
            _this.tableLoading= true;
            httpGet("/auth/users?tenantCode="+this.$store.state.tenantId+"&pageSize="+this.pageSize+"&currentPage="+this.currentPage)
             .then(function(response){
                 _this.tableLoading= false;
                 if(response.success){
                    _this.userData = response.data;
                    _this.userData.forEach(el=>{
                        let roleName=[];
                        let roleId=[];
                        el.userRoleList.forEach(element=>{
                            roleId.push(element.roleId);
                            roleName.push(element.roleName);
                        })
                        el.roleName = roleName.join(';')
                        el.roleId = roleId.join(';')
                    })
                    _this.total =  response.pageData.totalRows;
                 }
             })
        },
        //查询所有角色
      getAllRoleDate(){
        let _this=this;
        httpGet("/auth/roles?tenantCode="+this.$store.state.tenantId)
            .then(function(response){
                _this.roleData = response.data;
                _this.options = [];
                for(let key in _this.roleData){
                 _this.options.push({
                    'value':_this.roleData[key].roleId,
                    'label':_this.roleData[key].roleName
                 });
                }
                if(response.data){
                    _this.roleDataTemp = response.data.slice(0);
                }
            })
      },

        userNewClick(){
            this.createOrEdit='新增用户';
            this.userNewVisible= true;
            this.isUserCreated = true;
            this.$nextTick(()=>{
                clearError(this.$refs.userInline.fields)
            })
            this.userInline={//用户form
                userId:'',
                username:'',
                userSex:'',
                 password:'',//密码
                userMobile:'',
                tenantCode:'',//用户所属代理商code
                userEmail:'',
                validDate:'',
                userStatus:'',
            };
  
        },
        handleUserEdit(index, row){
            this.userNewVisible=true;
            this.isUserCreated=false;
            this.$nextTick(()=>{
                clearError(this.$refs.userInline.fields)
            })
            this.userInline.userId = row.userId;
            this.userInline.username = row.username;
            this.userInline.userSex = row.userSex==0?"保密":(row.userSex==1?"帅哥":'靓女');
            this.userInline. password = row. password;
            this.userInline.userMobile = row.userMobile;
            this.userInline.tenantCode = row.tenantCode;
            this.userInline.userEmail = row.userEmail;
            this.userInline.validDate = row.validDate;
            this.userInline.userStatus = row.userStatus==0?'无效':'有效';
            this.createOrEdit='用户编辑';
        },
      /*
        用户新增
        */
        onUserSubmit(formName){
            if(this.userInline.userMobile.toString().length<11){
                 this.$message({
                    duration:2000,
                    showClose: true,
                    message: '手机号码格式不正确',
                    type: 'warning'
                });
                return false;
            }
            let postData={};
            postData.userId= this.userInline.userId;
            postData.username= this.userInline.username;
            postData.userSex= this.userInline.userSex;
            postData.password= this.userInline.password;
            postData.userMobile= this.userInline.userMobile;
            postData.tenantCode= this.userInline.tenantCode;
            postData.userEmail= this.userInline.userEmail;
            postData.validDate= this.userInline.validDate;
            postData.userStatus= this.userInline.userStatus;
            let _this= this;
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(postData.userStatus =="有效"){
                    postData.userStatus =1;
                }
                if(postData.userStatus =="无效"){
                    postData.userStatus =0;
                }
                if(postData.userSex =="保密"){
                    postData.userSex=0;
                }
                if(postData.userSex =="帅哥"){
                    postData.userSex=1;
                }
                if(postData.userSex =="靓女"){
                    postData.userSex=2;
                }
                postData.userSex=parseInt(postData.userSex);
                let date = new Date(postData.validDate)
                postData.validDate =date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                if(this.isUserCreated){
                    httpPost("/auth/user",postData)
                        .then(function(response){
                            if(response.success){
                                _this.userNewVisible = false;
                                _this.getUserManageData();
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
                   httpPut("/auth/user",postData)
                        .then(function(response){

                            if(response.success){
                                _this.userNewVisible = false;
                                _this.getUserManageData();
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
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
         /*
        重置新增界面
        */
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //查询指定用户
        searchUserData(){
            let _this=this;
            httpGet("/auth/users?username=" + this.username + "&tenantName=" + this.tenantName + "&tenantCode=" + this.$store.state.tenantId+"&pageSize="+this.pageSize+"&currentPage="+this.currentPage)
             .then(function(response){
                 _this.userData = response.data;
                _this.userData.forEach(el=>{
                    let roleName=[];
                    let roleId=[];
                    el.userRoleList.forEach(element=>{
                        roleId.push(element.roleId);
                        roleName.push(element.roleName);
                    })
                    el.roleName = roleName.join(';')
                    el.roleId = roleId.join(';')
                })

                _this.total =  response.pageData.totalRows;
             })
        },
    },
    watch:{
        username(n,o){
            this.username = n;
            this.searchUserData();
        },
        tenantName(n,o){
            this.tenantName = n;
            this.searchUserData();
        }
    },
}
</script>
<style>
    .container .authority-mgt .el-row{
        height: auto !important;
    }
    .authority-mgt .el-date-editor.el-input, .authority-mgt .el-date-editor.el-input__inner{
        width: 100% !important;
    }
</style>

<style scope>
  @import '../common/common.css';
</style>