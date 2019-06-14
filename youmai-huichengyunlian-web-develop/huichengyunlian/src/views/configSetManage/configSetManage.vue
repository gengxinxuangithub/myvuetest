<template>
  <div class="config_total clearfix">
    <div class="config_top containerTitle">
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="dialogFormVisible = true" >新增</el-button>
      <!-- v-show="!result.showAdd" -->
      <el-button type="danger" icon="el-icon-delete" @click="deleteconfig">删除</el-button>
       <!-- v-show="!result.showDelete" -->
      <el-button type="success" icon="el-icon-circle-plus-outline" @click="addBook">字典数据</el-button>
       <!-- v-show="!result.authority" -->
      <div class="top_right">
        <el-input placeholder="请输入字典名称" v-model="searchContent">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
    <div class="clicnic_body">
      <el-table ref="multipleTable" :data="tableDatas" stripe tooltip-effect="dark" style="width: 100%" :height="tableHeight"
        @selection-change="configSetChange" v-loading="tableData.loading">
        <el-table-column type="selection" width="58" fixed></el-table-column>
        <el-table-column prop="index" label="序号" width="50" fixed></el-table-column>
        <el-table-column label="操作" width="80" fixed>
          <template slot-scope="scope">
              <el-button type="text"  @click="editRow(scope.$index, scope.row)" >编辑</el-button>
              <!-- :disabled="result.showEdit" -->
          </template>
        </el-table-column>
        <el-table-column prop="name" label="字典名称" width="150" show-overflow-tooltip fixed>
        </el-table-column>
        <el-table-column prop="descrition" label="字典描述"  width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="type" label="字典类别" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="store" label="字典数据库" width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="pos" label="字典所在表" width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="othername" label="字典Key别名" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="valueothername" label="字典Value别名" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bookNum" label="字典序号" width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bookTip" label="字典备注" width="180" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div style="text-align: right;margin-top: 20px;">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 40, 80]"
              :page-size="pageSize"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              >
          </el-pagination>
      </div>
    </div>
    <!-- 新增字典 -->
    <el-dialog title="新增字典" @opened="resetAdd('addconfigSet.form')" :visible.sync="dialogFormVisible" width="30%" class="configSet_dilog clinic_dilog">
      <el-form :model="addconfigSet.form" ref="addconfigSet.form">
        <el-form-item label="字典名称" prop="name" :rules="[{required: true, message: '不能为空'}]" :label-width="formLabelWidth">
          <el-input v-model="addconfigSet.form.name" autocomplete="off" placeholder="请输入字典名称" @blur="validName"></el-input>
        </el-form-item>
        <el-form-item label="字典描述" prop="descrition" :label-width="formLabelWidth" class="nurse_pos">
          <el-input v-model="addconfigSet.form.descrition" autocomplete="off" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="字典类别" prop="type" :label-width="formLabelWidth" :rules="[{required: true, message: '不能为空'}]">
          <el-select v-model="addconfigSet.form.type" placeholder="请选择字典类别">
            <el-option v-for="item in addconfigSet.form.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典数据库" :rules="[{required: true, message: '不能为空'}]" prop="store" :label-width="formLabelWidth">
          <el-input v-model="addconfigSet.form.store" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典表所在表" :rules="[{required: true, message: '不能为空'}]" prop="pos" :label-width="formLabelWidth">
          <el-input v-model="addconfigSet.form.pos" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典Key别名" :rules="[{required: true, message: '不能为空'}]" prop="othername" :label-width="formLabelWidth">
          <el-input v-model="addconfigSet.form.othername" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典Value别名" :rules="[{required: true, message: '不能为空'}]" prop="valueothername" :label-width="formLabelWidth">
          <el-input v-model="addconfigSet.form.valueothername" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典序号" :rules="[{required: true, message: '不能为空'}]" prop="bookNum" :label-width="formLabelWidth">
          <el-input v-model="addconfigSet.form.bookNum" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典备注" prop="bookTip" :label-width="formLabelWidth">
          <el-input v-model="addconfigSet.form.bookTip" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" class="cancelBtn">取 消</el-button>
        <el-button type="success" class="saveBtn" @click="addEnsure('addconfigSet.form')" @keyup.enter.native="addEnsure('addconfigSet.form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑字典 -->
    <el-dialog title="字典编辑" :visible.sync="dialogFormVisibleEdit" width="30%" class="configSet_dilog clinic_dilog">

      <el-form :model="editconfigSet.form" ref="editconfigSet.form">
        <el-form-item label="字典名称" prop="name" :rules="[{required: true, message: '不能为空'}]" :label-width="formLabelWidth">
          <el-input v-model="editconfigSet.form.name" autocomplete="off" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典描述" :label-width="formLabelWidth" class="nurse_pos">
          <el-input v-model="editconfigSet.form.descrition" autocomplete="off" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="字典类别" prop="type" :label-width="formLabelWidth" :rules="[{required: true, message: '不能为空'}]">
          <el-select v-model="editconfigSet.form.type" placeholder="请选择字典类别" @change="editChange">
            <el-option v-for="item in editconfigSet.form.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典数据库" :rules="[{required: true, message: '不能为空'}]" :label-width="formLabelWidth">
          <el-input v-model="editconfigSet.form.store" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典表所在表" :rules="[{required: true, message: '不能为空'}]" :label-width="formLabelWidth">
          <el-input v-model="editconfigSet.form.pos" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典Key别名" :rules="[{required: true, message: '不能为空'}]" :label-width="formLabelWidth">
          <el-input v-model="editconfigSet.form.othername" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典Value别名" :rules="[{required: true, message: '不能为空'}]" :label-width="formLabelWidth">
          <el-input v-model="editconfigSet.form.valueothername" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典序号" :rules="[{required: true, message: '不能为空'}]" :label-width="formLabelWidth">
          <el-input v-model="editconfigSet.form.bookNum" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典备注" :label-width="formLabelWidth">
          <el-input v-model="editconfigSet.form.bookTip" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false" class="cancelBtn">取 消</el-button>
        <el-button type="success" class="saveBtn" @click="editEnsure('editconfigSet.form')" @keyup.enter.native="editEnsure('editconfigSet.form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 操作字典 -->
    <el-dialog title="字典数据" :visible.sync="dialogFormVisibleBook" class="clinic_dilog">
      <el-dialog  @opened="resetAdd('configBook.form')" width="30%" title=维护字典数据 :visible.sync="innerVisible" append-to-body class="clinic_dilog">
        <el-form :model="configBook.form" ref="configBook.form">
          <el-form-item label="字典数据对应的key" :label-width="detailWidth" prop="dictDataKey" :rules="[{required: true, message: '不能为空'}]">
            <el-input v-model="configBook.form.dictDataKey" autocomplete="off" placeholder="请输入key"></el-input>
          </el-form-item>
          <el-form-item label="字典数据对应的value" :label-width="detailWidth" prop="dictDataValue" :rules="[{required: true, message: '不能为空'}]">
            <el-input v-model="configBook.form.dictDataValue" autocomplete="off" placeholder="请输入value"></el-input>
          </el-form-item>
          <el-form-item label="字典数据的顺序" :label-width="detailWidth" prop="dictDataOrder" :rules="[{ type: 'number', message:'请输入数字'},{required: true}]">
            <el-input type="dictDataOrder" v-model.number="configBook.form.dictDataOrder" autocomplete="off"
              placeholder=""></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false" class="cancelBtn">取 消</el-button>
          <el-button type="success" class="saveBtn" @click="editBookEnsure('configBook.form')" @keyup.enter.native="editBookEnsure('configBook.form')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog width="30%" title=维护字典数据 :visible.sync="innerVisibleEdit" append-to-body class="clinic_dilog">
        <el-form :model="editConfigBook.form" ref="editConfigBook.form">
          <el-form-item label="字典数据对应的key" :label-width="detailWidth" prop="dictDataKey" :rules="[{required: true, message: '不能为空'}]">
            <el-input v-model="editConfigBook.form.dictDataKey" autocomplete="off" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="字典数据对应的value" :label-width="detailWidth" :rules="[{required: true, message: '不能为空'}]">
            <el-input v-model="editConfigBook.form.dictDataValue" autocomplete="off" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="字典数据的顺序" :label-width="detailWidth" prop="dictDataOrder" :rules="[{ type: 'number', message:'请输入数字'},{required: true}]">
            <el-input type="dictDataOrder" v-model.number="editConfigBook.form.dictDataOrder" autocomplete="off"
              placeholder=""></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisibleEdit = false" class="cancelBtn">取 消</el-button>
          <el-button type="success" class="saveBtn" @click="editRowBookEnsure('editConfigBook.form')"  @keyup.enter.native="editBookEnsure('configBook.form')">确 定</el-button>
        </div>
      </el-dialog>
      <div class="book_top containerTitle">
        <el-button type="success" icon="el-icon-circle-plus-outline" @click="innerVisible = true">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteItemsDia">删除</el-button>
      </div>
      <div>
        <el-table ref="multipleTable" stripe :data="dialogTable" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChangeDia">
          <el-table-column type="selection" width="50">
          </el-table-column>
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <el-button type="text"  @click="detailEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="dictDataKey" label="字典数据对应的key">
          </el-table-column>
          <el-table-column prop="dictDataValue" label="字典数据对应的value" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="dictDataOrder" label="字典数据的顺序" show-overflow-tooltip>
          </el-table-column>
        </el-table>
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
    httpPut
  } from "@/axios/api";
  import {
    mapActions,
    mapState
  } from "vuex";
  export default {
    data() {
      return {
        tableHeight: document.documentElement.clientHeight - 220,
        result:this.$store.state.result.config,
        searchContent: "",
        dialogTable: [],
        multipleSelectiondia: [],
        tableData: {
          configList: [],
          loading: true,
          multipleSelection: []
        },
          total: 1,
          pageSize: 10,
          currentPage: 1,
        dialogFormVisible: false,
        dialogFormVisibleBook: false,
        dialogFormVisibleEdit: false,
        innerVisible: false,
        innerVisibleEdit: false,
        formLabelWidth: '120px',
        detailWidth: "170px",
        configBook: {
          form: {
            dictDataKey: "",
            dictDataOrder: "",
            dictDataValue: ""
          }
        },
        editConfigBook: {
          form: {
            dictDataKey: "",
            dictDataOrder: "",
            dictDataValue: ""
          }
        },
        addconfigSet: {
          form: {
            name: "",
            descrition: "",
            store: "",
            pos: "",
            othername: "",
            valueothername: "",
            bookNum: "",
            bookTip: "",
            type: "",
            options: [{
              value: 0,
              label: '独立表'
            }, {
              value: 1,
              label: '公用表'
            }]
          }
        },
      transferNum:{
        "独立表":0,
        "公用表":1
      },
        editconfigSet: {
          form: {
            name: "",
            descrition: "",
            store: "",
            pos: "",
            itemId: "",
            othername: "",
            valueothername: "",
            bookNum: "",
            bookTip: "",
            type: "",
            options: [{
              value: 0,
              label: '独立表'
            }, {
              value: 1,
              label: '公用表'
            }]            
          }
        }
      }
    },
    computed: {
      //...mapState(["nowRoute"])
      tableDatas() {
        return this.tableData.configList
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
    created() { //每次进入调用
      this.queryBookList();
      //this.storeNowRoute(this.$route.path);
    },
    methods: {
      editChange(key){
      },
            //分页
            handleSizeChange(val) {
            this.pageSize = val
            this.queryInfo()
        },
        //分页
        handleCurrentChange(val) {
            this.currentPage = val
            this.queryInfo()
        },
      resetAdd(form){
        this.$refs[form].resetFields();
      },
      handleSelectionChangeDia(val) {
        this.multipleSelectiondia = val;
      },
      deleteItemsDia() {
        let _this = this;
        if (_this.multipleSelectiondia.length == 0) {
          _this.$message({
            duration: 2000,
            showClose: true,
            message: '请选择至少一项数据',
            type: 'warning'
          });
        } else {
          _this.$confirm('确认删除？')
            .then(_ => {

              let params = [];
              _this.multipleSelectiondia.forEach(element => {
                let config = {
                  "dictDataId": element.dictDataId
                };
                params.push(config);
              });

              httpDelete("/setting/dict/data", params).then(response => {
                if (response.success) {
                  _this.$message({
                    duration: 2000,
                    showClose: true,
                    message: "删除成功！",
                    type: 'success'
                  });

                  _this.querybookDetail();
                }
              })
            }, _ => {
              return;
            })
        }
      },
      validName() {
        // let _this = this;
        // httpGet("/setting/dict?dictItemName=" + _this.addconfigSet.form.name).then(response => {
        //   if (response.success) {
        //     let responseData = response.data;
        //     if (responseData.length > 0) {
        //       _this.$message({
        //         duration: 2000,
        //         message: "字典名称重复！",
        //         type: 'error'
        //       });
        //     }
        //   }
        // }).catch(error => {
        //   _this.$message({
        //     duration: 2000,
        //     message: "查询出错了！",
        //     type: 'error'
        //   });
        // })
      },
      // 编辑字典数据
      editRowBookEnsure(formRule) {
        let _this = this;
        this.$refs[formRule].validate((valid) => {
          if (valid) {
            let params = {
              dictDataKey: _this.editConfigBook.form.dictDataKey,
              dictDataOrder: _this.editConfigBook.form.dictDataOrder,
              dictDataValue: _this.editConfigBook.form.dictDataValue,
              dictItemId: _this.editConfigBook.form.dictItemId,
              dictDataId: _this.editConfigBook.form.dictDataId
            }
            httpPut("/setting/dict/data", params).then(response => {
              if (response.success) {
                _this.innerVisibleEdit = false;

                _this.$message({
                  duration: 2000,
                  showClose: true,
                  message: '更新成功了！',
                  type: 'success'
                });
                _this.querybookDetail();
              }else{
                _this.$message({
                duration: 2000,
                showClose: true,
                message: response.message,
                type: 'error'
              });
              }

            })
          } else {
            return false;
          }
        })
      },
      detailEdit(row) {
        this.innerVisibleEdit = true;
        this.editConfigBook.form.dictDataKey = row.dictDataKey;
        this.editConfigBook.form.dictDataValue = row.dictDataValue;
        this.editConfigBook.form.dictDataId = row.dictDataId;
        this.editConfigBook.form.dictItemId = row.dictItemId;
        this.editConfigBook.form.dictDataOrder = row.dictDataOrder;
      },
      // 新增字典数据
      editBookEnsure(formRule) {
        let _this = this;
        this.$refs[formRule].validate((valid) => {
          if (valid) {
            let params = {
              dictDataKey: _this.configBook.form.dictDataKey,
              dictDataOrder: _this.configBook.form.dictDataOrder,
              dictDataValue: _this.configBook.form.dictDataValue,
              dictItemId: _this.tableData.multipleSelection[0].itemId
            }

            httpPost("/setting/dict/data", params).then(response => {
              if (response.success) {
                _this.innerVisible = false;

                _this.$message({
                  duration: 2000,
                  showClose: true,
                  message: '创建成功了！',
                  type: 'success'
                });
                _this.querybookDetail();
              }else{
                _this.$message({
                duration: 2000,
                showClose: true,
                message: response.message,
                type: 'error'
              });
              }

            })
          } else {
            return false;
          }
        })

      },
      addEnsure(formRule) {
        let _this = this;
        this.$refs[formRule].validate((valid) => {
          if (valid) {
            let params = {
              dictDisplayName: _this.addconfigSet.form.othername,
              dictDisplayValue: _this.addconfigSet.form.bookNum,
              dictItemDesc: _this.addconfigSet.form.descrition,
              dictItemName: _this.addconfigSet.form.name,
              dictItemType: _this.addconfigSet.form.type,
              dictSortColName: "",
              dictTableName: _this.addconfigSet.form.pos,
              dictTableSchema: _this.addconfigSet.form.store,
              remark: _this.addconfigSet.form.bookTip
            }
            httpPost("/setting/dict", params).then(response => {
              if (response.success) {
                _this.dialogFormVisible = false;

                _this.$message({
                  duration: 2000,
                  message: '创建成功了！',
                   showClose: true,
                  type: 'success'
                });
                _this.queryBookList();
              }else{
                _this.$message({
                duration: 2000,
                showClose: true,
                message: response.message,
                type: 'error'
              });
              }

            })
          } else {
            return false;
          }
        })

      },
      editEnsure(formRule) {
        let _this = this;
        this.$refs[formRule].validate((valid) => {
          if (valid) {
            let params = {
              dictDisplayName: _this.editconfigSet.form.othername,
              dictDisplayValue: _this.editconfigSet.form.valueothername,
              dictItemDesc: _this.editconfigSet.form.descrition,
              dictItemId: _this.editconfigSet.form.itemId,
              dictItemName: _this.editconfigSet.form.name,
              dictItemType: _this.editconfigSet.form.type,
              dictSortColName: _this.editconfigSet.form.bookNum,
              dictTableName: _this.editconfigSet.form.pos,
              dictTableSchema: _this.editconfigSet.form.store,
              remark: _this.editconfigSet.form.bookTip
            }
            if(typeof(params.dictItemType) !== "number"){
              params.dictItemType = _this.transferNum[params.dictItemType];
            }
            httpPut("/setting/dict", params).then(response => {
              if (response.success) {
                _this.dialogFormVisibleEdit = false;

                _this.$message({
                  duration: 2000,
                  showClose: true,
                  message: '修改成功了！',
                  type: 'success'
                });
                _this.queryBookList();
              }else{
                _this.$message({
                duration: 2000,
                showClose: true,
                message: response.message,
                type: 'error'
              });
              }
            })
          } else {
            return false;
          }
        })
      },
      // 查询
      queryInfo() {
        let _this = this;
        httpGet("/setting/dict?dictItemName=" + _this.searchContent+"&pageSize="+this.pageSize+"&currentPage="+this.currentPage).then(
          response => {
            if (response.success) {
              let responseData = response.data;
              _this.tableData.configList = [];
            for (let a = 0; a < responseData.length; a++) {
              let combineObj = {
                name: responseData[a].dictItemName,
                descrition: responseData[a].dictItemDesc,
                type: responseData[a].dictItemType == 0 ? "独立表" : "公用表",
                typeNum: responseData[a].dictItemType,
                store: responseData[a].dictTableSchema,
                pos: responseData[a].dictTableName,
                othername: responseData[a].dictDisplayName,
                valueothername: responseData[a].dictDisplayValue,
                bookNum: responseData[a].dictSortColName,
                bookTip: responseData[a].remark,
                itemId: responseData[a].dictItemId,
              }
              _this.tableData.configList.push(combineObj);
            }
            // _this.total = response.pageInfo.total;
            }
          })
      },
      // 查询字典
      queryBookList() {
        let _this = this;
        httpGet("/setting/dict?pageSize="+this.pageSize+"&currentPage="+this.currentPage).then(response => {
          console.log(response)
          if (response.success) {
            _this.tableData.configList = [];
            let responseData = response.data;
            for (let a = 0; a < responseData.length; a++) {
              let combineObj = {
                index:a+1,
                name: responseData[a].dictItemName,
                descrition: responseData[a].dictItemDesc,
                type: responseData[a].dictItemType == 0 ? "独立表" : "公用表",
                typeNum: responseData[a].dictItemType,
                store: responseData[a].dictTableSchema,
                pos: responseData[a].dictTableName,
                othername: responseData[a].dictDisplayName,
                valueothername: responseData[a].dictDisplayValue,
                bookNum: responseData[a].dictSortColName,
                bookTip: responseData[a].remark,
                itemId: responseData[a].dictItemId,
              }
              _this.tableData.configList.push(combineObj);
            }
          
            _this.tableData.loading = false;
            // _this.total = response.pageInfo.total;

          }
        })
      },


      //表格选项变化触发
      configSetChange(val) {
        this.tableData.multipleSelection = val;
      },
      // 编辑当前行
      editRow(index, row) {
        this.dialogFormVisibleEdit = true;
        this.editconfigSet.form.name = row.name;
        this.editconfigSet.form.bookNum = row.bookNum;
        this.editconfigSet.form.descrition = row.descrition;
        this.editconfigSet.form.itemId = row.itemId;
        this.editconfigSet.form.othername = row.othername;
        this.editconfigSet.form.type = row.type;
        this.editconfigSet.form.pos = row.pos;
        this.editconfigSet.form.store = row.store;
        this.editconfigSet.form.bookTip = row.bookTip;
        this.editconfigSet.form.valueothername = row.valueothername;

      },
      //  删除
      deleteconfig() {
        let _this = this;
        if (_this.tableData.multipleSelection.length == 0) {
          _this.$message({
            duration: 2000,
            showClose: true,
            message: '请至少选择一个字典',
            type: 'warning'
          });
        } else {
          _this.$confirm('确认删除？')
            .then(_ => {

              let params = [];
              this.tableData.multipleSelection.forEach(element => {

                let config = {
                  "dictItemId": element.itemId
                };
                params.push(config);

              });

              httpDelete("/setting/dict", params).then(response => {
                if (response.success) {
                  _this.$message({
                    duration: 2000,
                    showClose: true,
                    message: "删除成功！",
                    type: 'success'
                  });

                  _this.queryBookList();
                }
              })
            }, _ => {
              return;
            })
        }
      },
      //  查询字典详情
      querybookDetail() {
        let _this = this;
        httpGet("/setting/dict/data?dictItemName=" + _this.tableData.multipleSelection[0].name).then(
          response => {
            if (response.success) {
              let responseData = response.data;
              _this.dialogTable = [];
              for (let a = 0; a < responseData.length; a++) {
                let dataObj = {
                  dictDataKey: responseData[a].dictDataKey,
                  dictDataOrder: responseData[a].dictDataOrder,
                  dictDataValue: responseData[a].dictDataValue,
                  dictDataId: responseData[a].dictDataId,
                  dictItemId: responseData[a].dictItemId,
                }
                _this.dialogTable.push(dataObj);
              }
            }
          })
      },
      //  添加字典
      addBook() {
        let _this = this;
        if (this.tableData.multipleSelection.length == 1 && this.tableData.multipleSelection[0].typeNum == 0) {
          this.dialogFormVisibleBook = true;

          this.querybookDetail();
        } else {
          _this.$message({
            duration: 2000,
            showClose: true,
            message: "请最多选择一个字典且只能选择独立表！",
            type: 'warning'
          });
        }
      }
    },
    watch:{
      searchContent(n,o){
            this.queryInfo();
        }
    }
  }
</script>
<style scoped>
  .book_top {
    padding-left: 0 !important;
  }

  .clicnic_body {
    padding: 0 31px;
    background: #F5F5F5;
  }



  .configSet_query {
    width: 80px;
    height: 30px;
    background: rgba(92, 184, 92, 1);
    border-radius: 4px;
    margin-left: 13px;
    padding: 0;
  }

  .configSet_dilog .el-select {
    width: 100%;
  }

  .configSetdetail_total {
    background: #fff;
    margin-top: 20px;
  }
</style>
<style>
  @import '../common/common.css';
</style>