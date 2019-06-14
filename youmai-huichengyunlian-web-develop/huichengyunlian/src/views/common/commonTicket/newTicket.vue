<template>
    <div style="width:100%">
        <div class="tab-top">
            <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label="基本信息" name="first">
                    <div>
                        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                            <el-form-item label="景区名称" prop="name">
                                <el-input v-model="ruleForm.name" placeholder="请输入景区名称"></el-input>
                            </el-form-item>
                            <el-form-item label="景区名称" prop="name">
                                <el-input v-model="ruleForm.name" placeholder="请输入景区名称"></el-input>
                            </el-form-item>
                            <el-form-item label="门票分类" prop="region">
                                <el-select v-model="ruleForm.region" placeholder="请选择门票分类">
                                <el-option label="国内门票" value="country"></el-option>
                                <el-option label="海外门票" value="foreige"></el-option>
                                </el-select>
                            </el-form-item>
                              <el-form-item label="产品介绍" prop="desc">
                                <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                            </el-form-item>
                            <el-form-item label="景区等级" prop="level">
                                <el-radio-group v-model="ruleForm.level">
                                <el-radio label="AA"></el-radio>
                                <el-radio label="AAA"></el-radio>
                                <el-radio label="AAAA"></el-radio>
                                <el-radio label="AAAAA"></el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="景区名称" prop="openTime">
                                <el-input v-model="ruleForm.openTime" placeholder="请输入景区开放时间"></el-input>
                            </el-form-item>
                            <el-form-item label="景区地址" prop="openTime">
                                <el-input v-model="ruleForm.openTime" placeholder="请输入景区地址"></el-input>
                            </el-form-item>
                            <el-form-item label="产品样图" prop="routePic">
                                <el-upload
                                    class="upload-demo"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :file-list="fileList2"
                                    list-type="picture">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                    </el-upload>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="门票价格" name="second">
                    <el-form :model="ruleFormcharge" :rules="rulescharge" ref="ruleFormcharge" label-width="100px" class="demo-ruleFormcharge">
                        <el-form-item label="有效期" required>
                            <el-col :span="6">
                            <el-form-item prop="start">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleFormcharge.start" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                            </el-col>
                            <el-col class="line" :span="2">~</el-col>
                            <el-col :span="6">
                            <el-form-item prop="end">
                                <el-date-picker type="date" placeholder="选择日期" v-model="ruleFormcharge.end" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="门票价格" prop="goTime">
                            <el-button>新增</el-button>
                            <el-button style="margin-bottom:20px;">删除</el-button>
                             <el-table
                                :data="tableData"
                                border
                                style="width: 50%">
                                <el-table-column
                                prop="ticketType"
                                label="门票类型"
                                width="169">
                                </el-table-column>
                                <el-table-column
                                prop="charge"
                                label="原价"
                                width="165">
                                </el-table-column>
                                <el-table-column
                                prop="settlementCharge"
                                label="结算价"
                                width="165">
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="景区介绍" name="third">
                    <div>
                        <el-form :model="ruleFormscenic" :rules="rulesscenic" ref="ruleFormscenic" label-width="100px" class="demo-ruleFormscenic">
                            <el-form-item label="景区介绍" prop="desc">
                                <el-input type="textarea" v-model="ruleFormscenic.desc"></el-input>
                            </el-form-item>
                            <el-form-item label="预订须知" prop="booking">
                                <el-input type="textarea" v-model="ruleFormscenic.booking"></el-input>
                            </el-form-item>
                            <el-form-item label="同业须知" prop="trade">
                                <el-input type="textarea" v-model="ruleFormscenic.trade"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tableData:[
                {ticketTy:'',charge:'1',settlementCharge:'2'},
            ],
            dayvalue:'',
            nightvalue:'',
            editorContent:'',
            editorOption:{},
            content:"",
            fileList2:[],
            activeName2: 'first',
            ruleFormscenic:{
                desc:'',
                trade:'',
                booking:''
            },
            ruleForm: {
                region:'',
                desc:'',
                name: '',
                openTime:'',


                from:'',
                to:'',
                atention:'',
                needKnow:'',
                backPromise:'',
                owner:'',
                charge:'',
                otherCharge:'',
                macketCharge:'',
                hotLine:'',
                type: [],
                theme:[],
                level: '',
            },
            routeEditType:'',
            ruleFormcharge:{
                start:'',
                end:'',
            },
            rulescharge:{
                start: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                end: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
            },
            rulesscenic:{
                desc: [
                    { required: true, message: '请填写景区介绍', trigger: 'blur' }
                ],
                booking: [
                    { required: true, message: '请填写预定须知', trigger: 'blur' }
                ],
                trade: [
                    { required: true, message: '请填写同业须知', trigger: 'blur' }
                ],
            },
            rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    // { min: 1, max: 50, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择门票分类', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写产品介绍', trigger: 'blur' }
                ],
                openTime: [
                    { required: true, message: '请输入景区开放时间', trigger: 'blur' },
                ],
                from: [
                    { required: true, message: '请输入出发地', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                to: [
                    { required: true, message: '请输入目的地', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                atention: [
                    { required: true, message: '请输入注意事项', trigger: 'blur' },
                    { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }
                ],
                needKnow: [
                    { required: true, message: '请输入报名须知', trigger: 'blur' },
                    { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }
                ],
                backPromise: [
                    { required: true, message: '请输入退订保证', trigger: 'blur' },
                    { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'blur' }
                ],
                atention: [
                    { required: true, message: '请输入注意事项', trigger: 'blur' }
                ],
                hotLine: [
                    { required: true, message: '请输入客服电话', trigger: 'blur' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个出行方式', trigger: 'change' }
                ],
                theme: [
                    { type: 'array', required: true, message: '请至少选择一个线路主题', trigger: 'change' }
                ],
                level: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ]
            }
        }
    },


    methods: {
        //应用价格
        applyCharge(){

        },
        //清除价格
        clearCharge(){
            this.ruleFormcharge.goTime=[];
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                
            } else {
                this.activeName2 = 'second'
                // return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleClick(tab, event) {
            console.log(tab, event);
        }

    }
}
</script>


<style scoped>
    .quill-editor {
        height: 745px;
    }
    .quill-editor .ql-container {
        height: 680px;
    }
    .limit {
        height: 30px;
        border: 1px solid #ccc;
        line-height: 30px;
        text-align: right;
    }
    .line{
        padding-left: 35px;
    }
    .limit span {
        color: #ee2a7b;
    }
    .ql-snow .ql-editor img {
        max-width: 480px;
    }

    .ql-editor .ql-video {
        max-width: 480px;
    }
    .demo-ruleForm{
        height: 811px;
        overflow-y: auto
    }
    .tableright{
        margin-left: 50px;
        margin-top: 20px;
    }
    .tableleft{
        margin-left: 30px;
        margin-top: 20px;
    }
    .demo-ruleFormcharge .el-input--small{
        width: 20%;
    }
    .timeTable{
        width:100%;
        height:500px;
        background:#ddd;
        margin-left: 20px;
        margin-top: 20px;
    }
  .route-manage{
    width:100%;
    height:40px;
    background:#ddd;
    margin-top: 15px;
  }
  .route-manage-top{
    margin-left: 20px;
    line-height: 40px;
  }
  .tab-top{
      margin-top: 10px;
      margin-left: 10px;
  }
</style>
