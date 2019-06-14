<template>
    <div class="authority-mgt">
        <div class="containerTitle">
            <el-row>
                <div class="left">
                    <el-button class="addBtn" style="cursor: pointer;" type="success" icon="el-icon-circle-plus-outline" @click="addNewClick" v-show="result.showAdd">新增菜单</el-button>
                    <el-button class="deleteBtn" type="danger" icon="el-icon-delete" @click="moreDeleteClick" v-show="result.showDelete">删除</el-button>
                    <el-button class="roleBtn" type="success" icon="el-icon-circle-plus" @click="resourceNewClick" v-show="result.showResource">资源号</el-button>
                </div>
                <div class="right">
                    <el-input v-model="menuName" size="small" prefix-icon="el-icon-search" placeholder="按菜单名称搜索" class="block-search"></el-input>
                </div>
            </el-row>
        </div>
        <div class="containerBody">
            <el-table stripe tooltip-effect="dark"  @selection-change="handleSelectionChange" ref="multipleTable" v-loading = "tableLoading" :data="menuData" :height="tableHeight">
                <el-table-column fixed type="selection" >
                </el-table-column>
                <el-table-column  label="序号" type="index" width="50"></el-table-column>
                <el-table-column label="操作" width="150px;">
                    <template slot-scope="scope">
                        <el-button type="text"  @click="handleMenuEdit(scope.$index, scope.row)" :disabled="!result.showEdit">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="menuName" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="父级菜单" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span :title="scope.row.parentMenuCode">{{ getNameByDict(scope.row.parentMenuCode,'menu') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="代理商">
                    <template slot-scope="scope">
                        <span>{{ getNameByDict(scope.row.tenantCode,'dict') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="顺序" prop="menuOrder"></el-table-column>
                <el-table-column prop="menuUrl" label="首地址" :show-overflow-tooltip = "true"></el-table-column>
                <el-table-column label="是否可见" >
                    <template slot-scope="scope">
                        <span>{{ getLabelById(scope.row.menuVisibility) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否有效" >
                    <template slot-scope="scope">
                        <span>{{ getLabelById(scope.row.menuStatus) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" >
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
            <el-dialog :title="createOrEdit" :visible.sync="addNewVisible" :close-on-click-modal="notClose" width="33%">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="菜单名称" prop="menuName">
                        <el-input v-model="ruleForm.menuName" @blur="mapName(ruleForm.menuName)"></el-input>
                    </el-form-item>
                    <el-form-item label="父级菜单" prop="parentMenu">
                        <el-input v-model="ruleForm.parentMenu" disabled=""></el-input>
                    </el-form-item>
                    <el-form-item label="代理商" prop="tenantCode">
                    <el-select v-model="ruleForm.tenantCode" placeholder="请选择代理商">
                        <el-option v-for="(item,index) in tenantData" :key="index" :label="item.tenantName" :value="item.tenantId"></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="菜单顺序" prop="menuOrder">
                        <el-input v-model="ruleForm.menuOrder"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单首地址" prop="menuUrl">
                        <el-input v-model="ruleForm.menuUrl"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单是否可见" prop="menuVisibility">
                    <el-select v-model="ruleForm.menuVisibility" placeholder="请选择菜单可见性">
                        <el-option v-for="(item,index) in visibilityData"
                            :key="index" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="菜单是否有效" prop="menuStatus">
                    <el-select v-model="ruleForm.menuStatus" placeholder="请选择菜单有效性">
                        <el-option v-for="(item,index) in statusData"
                            :key="index" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button  class="cancelBtn" @click="addNewVisible=false">取 消</el-button>
                        <el-button class="saveBtn" type="success" @click="submitMenuForm('ruleForm')">确 定</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-dialog title="资源号管理" :visible.sync="resourceVisible" :close-on-click-modal="notClose" width="30%">
                <div class="containerTitle" style="padding-left:0px;height: 35px;line-height: 35px;">
                    <div class="left">
                        <el-button class="addBtn" style="cursor: pointer;" type="success" icon="el-icon-circle-plus-outline" @click="addsourceClick">新增</el-button>
                        <el-button class="deleteBtn" type="success" icon="el-icon-delete" @click="sourceDeleteClick">删除</el-button>
                    </div>
                </div>
                <el-table tooltip-effect="dark" @selection-change="resourceSelectionChange" ref="multipleSourceTable" border  v-loading = "sourceLoading" :data="sourceData"
                    style="margin-top:10px">
                    <el-table-column type="selection"> </el-table-column>
                    <el-table-column label="资源号名称" prop="resourceName"></el-table-column>
                    <el-table-column label="菜单">
                        <template slot-scope="scope">
                            <span>{{ getNameByDict(scope.row.ownerCode,'menu') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="资源号状态">
                        <template slot-scope="scope">
                            <span>{{getStatus(scope.row.resourceStatus)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作"  width="83">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="handleResourceEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog :title="creorEdi" :close-on-click-modal="notClose" :visible.sync="resourceNewVisible"  width="33%" append-to-body class="moreLayerDialog">
                    <el-form :model="formInline" :rules="rulesLine" ref="formInline" label-width="100px" class="demo-formInline">
                        <el-form-item label="资源号名称" prop="resourceName">
                            <el-input v-model="formInline.resourceName"  @blur="mapSourceName(formInline.resourceName)"></el-input>
                        </el-form-item>
                        <el-form-item label="父级菜单" prop="ownerName">
                            <el-input v-model="formInline.ownerName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="资源状态" prop="resourceStatus">
                            <el-select v-model="formInline.resourceStatus" placeholder="请选择资源号状态" style="width:100%">
                                <el-option v-for="(item,index) in statusData"
                                    :key="index" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item style="text-align: right;">
                            <el-button class="cancelBtn" @click="resourceNewVisible = false">取 消</el-button>
                            <el-button class="saveBtn" type="success" @click="submitSourceForm('formInline')">确 定</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </el-dialog>
        </div>
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
      return{
        result:this.$store.state.result.menu,
        isMenuCreate:false,
        orderValue:'',
        notClose:false,
        menuName:'',
        menuFather:'',
        menuData:[],//菜单管理表格
        sourceData:[],//资源号表格
        addNewVisible:false,
        orderVisible:false,
        resourceVisible:false,
        tableLoading:false,
        resourceNewVisible:false,
        sourceLoading:false,
        createResource:false,
        creorEdi:'',
        tenantData:[],//所有代理商
        isResourceCreate:false,//资源号新建/编辑
        visibilityData:[
            {name:'是',id:1},
            {name:'否',id:0},
        ],
        statusData:[
            {name:'是',id:1},
            {name:'否',id:0},
        ],
        rulesLine:{
            resourceName:[{ required: true, message: '请输入资源号名称', trigger: 'blur' }],
            ownerCode:[{ required: true, message: '请输入父级菜单', trigger: 'blur' }],
        },
        formInline: {
            resourceName: '',
            ownerCode: '',
            ownerName: '',
            resourceStatus:'',
        },
        ruleForm: {
          menuName: '',
          parentMenu: '',
          parentMenuCode:'',
          tenantCode:'',
          menuOrder: '',
          menuUrl: '',
          menuVisibility:'',//可见
          menuStatus:''//有效
        },
        currentPage:1,
            pageSize:10,
            total:1,
        dictData:[],//字典数据
        createOrEdit:'新增菜单',
        isMenuCreated:false,//是否新建
        multipleSelection:[],
        menuDictData:[],
        multipleSource:[],//资源选择
        rules: {
          menuOrder:[
              { required: true, message: '请输入菜单顺序', trigger: 'blur' },
              {pattern: /^[1-9]\d*$/,message: '只能输入数字'},
          ],
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
          ],
         tenantCode:[
             {required: true, message: '请选择代理商', trigger: 'blur' }
         ],
          menuUrl: [
            { required: true, message: '请填写菜单首地址', trigger: 'blur' }
          ]
        },
        tableHeight: document.documentElement.clientHeight - 220
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
    computed:{
        ...mapState(["tenantId"]),
    },
    created(){
        this.getTenantManageData();
        this.getmenuManageData();
        this.getDictData();
        this.getMenuData();
    },
    methods:{
               //分页
        handleSizeChange(val) {
            this.pageSize = val
            this.search();
        },
        //分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.search();
        },
        //获取字典数据
        getDictData(){
            let _this=this;
            httpGet("/setting/dict/map/TENANT")
            .then(function(response){
                if(response.success){
                    let resKeys =Object.keys(response.data);
                    let resValues =Object.values(response.data);
                    resKeys.forEach(function(el,index){
                        _this.dictData.push({key:el,value:resValues[index]});
                    })
                }
            })
        },
        getMenuData(){
            let _this=this;
            httpGet("/setting/dict/map/MENU")
            .then(function(response){
                if(response.success){
                    let resKeys =Object.keys(response.data);
                    let resValues =Object.values(response.data);
                    resKeys.forEach(function(el,index){
                        _this.menuDictData.push({key:el,value:resValues[index]});
                    })
                }
            })
        },
        //翻译代理商Code
        getNameByDict(key,tag){
            let ret="";
            if(tag=='dict'){
                this.dictData.forEach(function(element){
                    if(element.key==key){
                        ret = element.value;
                        return false;
                    }
                })
            }else if(tag=='menu'){
                this.menuDictData.forEach(function(element){
                    if(element.key==key){
                        ret = element.value;
                        return false;
                    }
                })
            }
            return ret
        },
         //截取字符串长度
        subStrLong(name){
            if(name.length > 30){
                return name.substring(0,30)+"...";
            }else{
                 return name;
            }
        },
        mapSourceName(name){
            if(name){
                let _this=this;
                httpGet("/auth/resource/"+this.multipleSelection[0].menuId+"?resourceName="+name)
                .then(function(response){
                    if(response.success&&response.data.length>0){
                        _this.$message({
                            message: '该名称已存在',
                            showClose: true,
                            type: 'warning'
                        });
                        _this.formInline.resourceName="";
                    }
                })
            }
        },
        //校验用户名重复性
         mapName(name){
            if(name){
                let _this=this;
                httpGet("/auth/menu/"+this.$store.state.tenantId+"?menuName="
                    +name+"&parentMenuCode="+this.ruleForm.parentMenuCode)
                .then(function(response){
                    if(response.success&&response.data.length>0){
                        _this.$message({
                            message: '该名称已存在',
                            showClose: true,
                            type: 'warning'
                        });
                        _this.ruleForm.menuName="";
                    }
                })
            }
        },
        subTime(time){
            return time.substring(0,19);
        },
        getStatus(status){
            if(status==1){
                return "是"
            }else{
                return "否"
            }
        },
        //菜单编辑
        handleMenuEdit(index, row) {
            this.addNewVisible=true;
            this.isMenuCreate=false;
            this.$nextTick(()=>{
                clearError(this.$refs.ruleForm.fields)
            })
            this.ruleForm =  {
                menuId: row.menuId,
                menuName: row.menuName,
                parentMenu: row.parentMenu,
                parentMenuCode:row.parentMenuCode,
                tenantCode:row.tenantCode,
                menuOrder: row.menuOrder,
                menuUrl: row.menuUrl,
                menuVisibility:row.menuVisibility==1?'是':'否',//可见
                menuStatus:row.menuStatus==1?'是':'否'//有效
            },
            this.createOrEdit = "菜单编辑"
        },
        //资源新增
        addsourceClick(){
            this.creorEdi ='新增资源号';            
            this.isResourceCreate = true;
            this.resourceNewVisible = true;
            this.$nextTick(()=>{
                clearError(this.$refs.formInline.fields)
            })
            let dd = this.multipleSelection[0];
            this.formInline= {
                resourceName: '',
                ownerCode:this.multipleSelection[0].menuId,
                ownerName:this.multipleSelection[0].menuName,
                resourceStatus:'',
            };
            this.createResource = true;//资源新建
        },
        //资源号删除
        sourceDeleteClick(){
            let _this = this;
            if(this.multipleSource.length==0){
                this.$message({
                    duration:2000,
                    showClose: true,
                    message:'请至少选择一个资源号',
                    type: 'warning'
                });
            }else{
                this.$confirm('确认删除？')
                .then(_ => {
                    let param =[];
                    this.multipleSource.forEach(element => {
                        param.push({resourceId:element.resourceId});
                    });
                    httpDelete("/auth/resource",{data: param})
                    .then(function(response){
                        if(response.success){
                            _this.$message({
                                duration:2000,
                                showClose: true,
                                message: response.message,
                                type: 'success'
                            });
                            _this.getResourceData();
                        }
                    })
                  },() => {
                })
            }
        },
        //查询所有代理商
        getTenantManageData(){
            let _this=this;
            httpGet("/auth/all_tenants")
             .then(function(response){

                 _this.tenantData = response.data;
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
        //z资源号新增保存
        submitSourceForm(formName){
            let _this = this;
            let postData=this.formInline;
            if(postData.resourceStatus=="是"){
                postData.resourceStatus=1;
            }else if(postData.resourceStatus=="否"){
                postData.resourceStatus=0;
            }
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this.isResourceCreate){
                    httpPost("/auth/resource",postData)
                    .then(function(response){
                        if(response.success){
                            _this.resourceNewVisible=false;
                            _this.isResourceCreate=false
                            _this.$message({
                                duration:2000,
                                showClose: true,
                                message: response.message,
                                type: 'success'
                            });
                            _this.getResourceData();
                        }else{
                            _this.$message({
                                 showClose: true,
                                message: response.message,
                                type: 'warning'
                            });
                        }
                    })
                }else{
                     httpPut("/auth/resource",postData)
                        .then(function(response){
                            if(response.success){
                                _this.resourceNewVisible=false;
                                _this.createResource=false;
                                _this.creorEdi ='新增资源号';
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });
                                _this.getResourceData();
                            }else{
                                _this.$message({
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
        //查询所有菜单
        getmenuManageData(){
            let _this=this;
            this.tableLoading = true;
            httpGet("/auth/menu/"+this.$store.state.tenantId+"?pageSize="+this.pageSize+"&currentPage="+this.currentPage)
             .then(function(response){
                 _this.tableLoading = false;
                 _this.menuData = response.data;
                 //_this.total =  response.pageInfo.total;
             })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        resourceSelectionChange(val){
            this.multipleSource = val;
        },
        //菜单新增
        submitMenuForm(formName){
            let _this = this;
            let postData=this.ruleForm;
            if(postData.menuStatus=="是"){
                postData.menuStatus=1;
            }else if(postData.menuStatus=="否"){
                postData.menuStatus=0;
            }
            if(postData.menuVisibility=="是"){
                postData.menuVisibility=1;
            }else if(postData.menuVisibility=="否"){
                postData.menuVisibility=0;
            }
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this.isMenuCreated){
                    httpPost("/auth/menu",postData)
                        .then(function(response){
                            if(response.success){

                                _this.addNewVisible=false;
                                _this.isMenuCreated=false
                                _this.getmenuManageData();
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });

                            }else{
                                _this.$message({
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });
                            }
                        })
                    }else{
                        httpPut("/auth/menu",postData)
                        .then(function(response){
                            if(response.success){
                                _this.addNewVisible=false;
                                _this.isMenuCreated=false
                                _this.getmenuManageData();
                                _this.$message({
                                    duration:2000,
                                    showClose: true,
                                    message: response.message,
                                    type: 'success'
                                });

                            }else{
                                _this.$message({
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
        //新增菜单
        addNewClick(){
            let selectedMenu = this.multipleSelection.slice(0);
            this.ruleForm= {
                menuName: '',
                parentMenu: '',
                parentMenuCode:'',
                tenantCode:this.$store.state.tenantId,
                menuOrder: '',
                menuUrl: ''
            };
            if(selectedMenu.length>1){
                this.$message({
                    duration:2000,
                    showClose: true,
                    message: '请选择单个菜单进行新建',
                    type: 'warning'
                });
                return false;
            }else if(selectedMenu.length==1){
                this.ruleForm.parentMenu=selectedMenu[0].menuName;
                this.ruleForm.parentMenuCode=selectedMenu[0].menuId;
            }else{
                this.ruleForm.parentMenu="Root";
                this.ruleForm.parentMenuCode="Root";
            }
            this.isMenuCreated = true;
            this.addNewVisible= true;
            this.$nextTick(()=>{
                clearError(this.$refs.ruleForm.fields)
            })
        },
        handleClose(done) {
        },
        //删除多项菜单
        moreDeleteClick(){
            let _this = this
            if(this.multipleSelection.length==0){
                this.$message({
                    message: '请至少选择一项',
                    showClose: true,
                    type: 'warning'
                });
            }else{
                this.$confirm('确认删除？')
                .then(_ => {
                    let toDel = false;
                    let ret =this.multipleSelection;
                    let param = [];let postData={};
                    ret.forEach(element => {
                        if(element.leaf){
                            toDel = true;
                            return;
                        }
                        let postData = {menuId:element.menuId,tenantCode:element.tenantCode};
                        param.push(postData);
                    });
                    if(toDel){
                        this.$message({
                            message: '请先删除子菜单',
                            showClose: true,
                            type: 'warning'
                        });
                        return false;
                    }
                    httpDelete("/auth/menu",{data: param})
                    .then(function(response){
                        if(response.success){
                            _this.$message({
                                duration:2000,
                                showClose: true,
                                message: response.message,
                                type: 'success'
                            });
                            _this.getmenuManageData();
                        }else{
                            _this.$message({
                                showClose: true,
                                message: response.message,
                                type: 'warning'
                            });
                        }
                    })
                },() => {
                })
            }
        },
        //编辑资源号
        handleResourceEdit(index, row){
            this.creorEdi='编辑资源号';
            this.resourceNewVisible = true;
            this.isResourceCreate=false;
            this.$nextTick(()=>{
                clearError(this.$refs.formInline.fields)
            })
            this.formInline={
                resourceName: row.resourceName,
                resourceId: row.resourceId,
                ownerCode: row.ownerCode,
                ownerName: this.getNameByDict(row.ownerCode,'menu'),//row.ownerName,
                resourceStatus:row.resourceStatus==1?'是':'否',
            }
        },
        //查询所有资源号
        getResourceData(){
            this.sourceLoading = true;
            let _this= this;
            httpGet("/auth/resource/"+this.multipleSelection[0].menuId)
            .then(function(response){
                if(response.data){
                    _this.sourceData = response.data;
                    _this.sourceLoading = false;
                }else{
                    _this.$message({
                        message: response.message,
                        showClose: true,
                        type: 'warning'
                    });
                }
            })
        },
        resourceNewClick(){
            if(this.multipleSelection.length==1){
                this.resourceVisible = true;
                this.isResourceCreate=true;
                this.getResourceData();
            }else{
                 this.$message({
                     duration:2000,
                     showClose: true,
                    message: '请先选择一个菜单',
                    type: 'warning'
                });
            }
        },
        search(){
            let _this=this;
            this.tableLoading = true;
            httpGet("/auth/menu/"+this.$store.state.tenantId+"?menuName="+this.menuName+"&pageSize="+this.pageSize+"&currentPage="+this.currentPage)
            .then(function(response){
                _this.tableLoading = false;
                _this.menuData = response.data;
                _this.total =  response.pageInfo.total;
            })
        },
    },
    watch:{
        menuName(n,o){
            this.menuName = n;
            this.search();
        },
    },
}
</script>

<style>
    .moreLayerDialog .el-dialog__body{
        border-top: none;
    }
    .authority-mgt .el-date-editor.el-input, .authority-mgt .el-date-editor.el-input__inner{
        width: 100% !important;
    }

</style>
<style scope>
    @import '../common/common.css';
</style>

