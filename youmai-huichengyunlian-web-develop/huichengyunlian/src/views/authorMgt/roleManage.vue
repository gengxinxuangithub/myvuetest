<template>
  <div class="authority-mgt">
      <div class="containerTitle">
        <el-row>
             <div class="left">
                <el-button class="addBtn" style="cursor: pointer;" type="success" icon="el-icon-circle-plus-outline" @click="roleNewClick" v-show="result.showAdd">新增角色</el-button>
                <el-button class="deleteBtn" type="danger" icon="el-icon-delete" @click="moreDeleteClick" v-show="result.showDelete">删除</el-button>
                <el-button class="roleBtn" type="success" icon="el-icon-circle-plus" @click="roleAuth" v-show="result.authority">角色授权</el-button>
            </div>
            <div class="right">
                <el-input v-model="roleName" size="small" prefix-icon="el-icon-search" placeholder="按角色搜索" class="block-search"></el-input>
            </div>
        </el-row>
    </div>
    <div class="containerBody">
        <el-table stripe tooltip-effect="dark" @selection-change="handleSelectionChange" ref="multipleTable"  v-loading = "tableLoading" :data="roleData" :height="tableHeight">
            <el-table-column type="selection" fixed width="55"></el-table-column>
            <el-table-column  label="序号" type="index" width="50"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="text"  @click="handleRoleEdit(scope.$index, scope.row)" :disabled="!result.showEdit">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="roleName" label="角色" width="200"> </el-table-column>
            <el-table-column label="所属代理商" width="200">
                <template slot-scope="scope">
                    <span>{{getNameByDict(scope.row.tenantCode) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="角色描述" prop="roleDesc" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="创建时间" width="200">
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
        :close-on-click-modal="notClose"
        :visible.sync="roleNewAddVisible"
        width="30%">
        <div class="role-div">
            <el-form :model="roleInline" :rules="rulesInline" ref="roleInline" label-width="120px" class="demo-roleInline">
                 <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleInline.roleName" @blur="mapName(roleInline.roleName)" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="所属代理商" prop="tenantCode">
                    <el-select v-model="roleInline.tenantCode" placeholder="请选择">
                        <el-option
                        v-for="item in tenantData"
                        :key="item.tenantId"
                        :label="item.tenantName"
                        :value="item.tenantId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input type="textarea" v-model="roleInline.roleDesc"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="cancelBtn" @click="roleNewAddVisible=false">取 消</el-button>
                    <el-button class="saveBtn"  type="success" @click="onRoleSubmit('roleInline')">确 定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
    <el-dialog
        title="角色授权"
        :close-on-click-modal="notClose"
        :visible.sync="roleNewVisible"
        width="33%">
        <div class="role-div">
            <el-tree
                ref="tree"
                :props="props"
                :data="treeDataCur"
                show-checkbox
                check-strictly
                node-key="id"
                @check="treeCheck"
                :default-expanded-keys="[]"
                :default-checked-keys="defaultCheckedKeys">
            </el-tree>
            <div style="margin-top:20px;text-align: right;">
                <el-button class="cancelBtn" @click="roleNewVisible = false" >取 消</el-button>
                <el-button class="saveBtn" type="success" @click="saveTree">确 定</el-button>
            </div>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {
    httpPost,
    httpGet,
    httpGetParams,
    httpDelete,
    httpGetUser,
    httpPut
} from "@/axios/api";
import axios from 'axios'
import {mapActions, mapState} from 'vuex'
import {clearError} from '@/utils';
export default {
    data(){
      return{
        result:this.$store.state.result.role,
        roleName:'',
        username:'',
        currentPage:1,
            pageSize:10,
            total:1,
        createOrEdit:'新增角色',
        multipleSelection:'',
        roleNewAddVisible:false,
        roleNewVisible:false,
        selectedRole:'',
        isCreate:false,//是否新建
        roleData:[],//
        tenantData:[],//所有代理商
        notClose:false,
        tableLoading:false,
        roleInline:{//用户form
            tenantCode:'',
            roleName:'',
            roleDesc:'',
        },
        props: {
            label: 'label',
            children: 'children'
        },
        treeData:[],
        treeDataCur: [],
        defaultCheckedKeys: [],
        dictData:[],//字典集合
        checkedKeys:[],
        count: 1,
        rulesInline:{
          tenantCode:[
                { required: true, message: '请输入代理商', trigger: 'blur' },
            ],
            roleName:[
                { required: true, message: '请输入用户名称', trigger: 'blur' },
            ],
        },
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
    },
    
    created(){
      this.getAllDate();
      this.getAllTenant();
      this.getDictData();
    },
    methods:{
          //分页
          handleSizeChange(val) {
            this.pageSize = val
            this.searchRoleData();
        },
        //分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.searchRoleData();
        },
        //树节点选中
        treeCheck(treeNode,checked){
            if(checked.checkedKeys.indexOf(treeNode.id)!=-1){
                this.stepCheckParent(treeNode.id)
            }else{
                this.stepCheckoutChildren(treeNode.children)
            }
        },
        //递归冒泡选中父节点
        stepCheckParent(id){
            if(this.$refs.tree.getNode(id).level>1){
                let parentId = this.$refs.tree.getNode(id).parent.data.id
                this.$refs.tree.setChecked(parentId,true)
                this.stepCheckParent(parentId)
            }
        },
        //递归取消全部字节点
        stepCheckoutChildren(children){
            if(children.length>0){
                for(let key in children){
                    this.$refs.tree.setChecked(children[key].id,false)
                    this.stepCheckoutChildren(children[key].children)
                }
            }
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
            return ret;
        },
        //校验重复性
        mapName(name){
            if(name){
                let _this=this;
                httpGet("/auth/roles?roleName="+name)
                .then(function(response){
                    if(response.success&&response.data.length>0){
                        _this.$message({
                            message: '该名称已存在',
                            showClose: true,
                            type: 'warning'
                        });
                        _this.roleInline.roleName="";
                    }
                })
            }
        },
        //树形控件
        handleCheckChange(data, checked, indeterminate) {
            console.log(data, checked, indeterminate);
        },
        handleNodeClick(data) {
            console.log(data);
        },
        roleAuth(){
            if(this.multipleSelection.length==1){
                this.roleNewVisible = true;
                this.selectedRole = this.multipleSelection[0].roleId;
                this.getRoleRight(this.multipleSelection[0].tenantCode);
            }else{
                this.$message({
                    duration:2000,
                    showClose: true,
                    message: '请选择一个且最多一个角色',
                    type: 'warning'
                });
            }
        },
        getRoleRight(tenantCode){
            var _this = this;
            this.treeDataCur = [];
            this.checkedKeys = [];
            httpGet("/auth/menu/tree/"+tenantCode+"/"+this.selectedRole)
            .then(function(response){
                _this.treeData = response.data;
                _this.stepRunTree(_this.treeData,_this.treeDataCur)
                _this.$nextTick(function () {
                    _this.$refs.tree.setCheckedKeys(_this.checkedKeys)
                })
            })
        },
        //递归遍历树结构方法
        stepRunTree(tree,treeNow){
            for(var key in tree){
                treeNow.push({
                    id:"",
                    label:"",
                    children:[]
                });
                treeNow[key].id = tree[key].menuId;
                treeNow[key].label = tree[key].menuName
                if(tree[key].checked){
                    this.checkedKeys.push(tree[key].menuId)
                }
                if(tree[key].childrenMenuList&&tree[key].childrenMenuList.length>0){
                    this.stepRunTree(tree[key].childrenMenuList,treeNow[key].children)
                }
            }
        },
        //保存树
        saveTree(){
            var _this = this;
            var arr = this.$refs.tree.getCheckedKeys();
            axios.post("/auth/role/resource?roleId="+this.selectedRole,arr)
            .then(function(response){
                if(response.data.success){
                    _this.$message({
                        duration: 2000,
                        showClose: true,
                        message: '保存成功',
                        type: 'success'
                    });
                    _this.roleNewVisible = false;
                }
            })
        },
        //多选选择项
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //角色编辑
        handleRoleEdit(index, row){
            this.roleNewAddVisible=true;
            this.isCreate=false;
            this.$nextTick(()=>{
                clearError(this.$refs.roleInline.fields)
            })
            this.roleInline.tenantCode = row.tenantCode;
            this.roleInline.roleName = row.roleName;
            this.roleInline.roleDesc = row.roleDesc;
            this.roleInline.roleId = row.roleId;
            this.createOrEdit = "角色编辑"
        },
      //角色新增
        onRoleSubmit(formName){
            let postData = this.roleInline;
            let _this = this;
            this.$refs[formName].validate((valid) => {
                if (valid){
                    if(this.isCreate){
                        httpPost("/auth/role",postData)
                        .then(function(response){
                            if(response.success){
                                _this.roleNewAddVisible=false;
                                _this.isCreate=false
                                _this.getAllDate();
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
                                    type: 'waining'
                                });
                            }
                        })
                    }else{
                        httpPut("/auth/role",postData)
                        .then(function(response){
                            if(response.success){
                               _this.roleNewAddVisible=false;
                                _this.isCreate=false
                                _this.getAllDate();
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
            })

        },
        subTime(time){
            return time.substring(0,19);
        },
      //批量删除
      moreDeleteClick(){
          let _this = this;
          if(this.multipleSelection.length==0){
              this.$message({
                  duration:2000,
                   showClose: true,
                message: '请选择至少一个角色',
                type: 'warning'
            });
          }else{
              this.$confirm('确认删除？')
                .then(_ => {
                let param =[];
                this.multipleSelection.forEach(element => {
                    param.push({roleId:element.roleId});
                });
                httpDelete("/auth/role",{data: param})
                .then(function(response){
                    if(response.success){
                        _this.$message({
                            duration:2000,
                            showClose: true,
                            message: response.message,
                            type: 'success'
                        });
                        _this.getAllDate();
                    }
                })
            },() => {})
          }
      },
      //查询所有角色
      getAllDate(){
        let _this=this;
        _this.tableLoading= true;
        httpGet("/auth/roles?tenantCode="+this.$store.state.tenantId+"&pageSize="+this.pageSize+"&currentPage="+this.currentPage)
        .then(function(response){
            _this.tableLoading= false;
            _this.roleData = response.data;
            //_this.total =  response.pageInfo.total;
        })
      },
      //查询所有 代理商
      getAllTenant(){
        let _this=this;
        httpGet("/auth/all_tenants")
        .then(function(response){
            if(_this.$store.state.tenantId == "dd747e0b-c57c-4773-9950-7c11578c5068"){
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
        roleNewClick(){
            this.createOrEdit = "新增角色"
            this.roleNewAddVisible=true;
            this.isCreate=true;
            this.$nextTick(()=>{
                clearError(this.$refs.roleInline.fields)
            })
            this.roleInline={//用户form
                tenantCode:'',
                roleName:'',
                roleDesc:'',
            };
        },
         /*
        重置新增界面
        */
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //查询指定用户
        searchRoleData(){
            let _this=this;
            _this.tableLoading= true;
            httpGet("/auth/roles?roleName="+this.roleName+'&tenantCode='+this.$store.state.tenantId+"&pageSize="+this.pageSize+"&currentPage="+this.currentPage)
             .then(function(response){
                 _this.tableLoading= false;
                 _this.roleData = response.data;
                 _this.total =  response.pageInfo.total;
             })
        },
    },
    watch:{
        roleName(n,o){
            this.roleName = n;
            this.searchRoleData();
        }
    },
}
</script>

<style scope>
    @import '../common/common.css';
</style>