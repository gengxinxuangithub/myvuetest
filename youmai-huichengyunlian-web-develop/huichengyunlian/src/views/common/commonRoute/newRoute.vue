<template>
    <div class="authority-mgt">
        <div class="containerBody">
            <div class="baseInfo" :style="{height:tableHeight + 'px'}">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="线路名称" prop="lineName">
                        <el-input v-model="ruleForm.lineName" placeholder="请输入线路名称"></el-input>
                    </el-form-item>
                    <el-form-item label="市场参考价" prop="lineMarketPrice">
                        <el-input v-model="ruleForm.lineMarketPrice" placeholder="请输入市场参考价"></el-input>
                    </el-form-item>
                    <el-form-item label="行程天数" prop="lineTripDays">
                        <el-input v-model="ruleForm.lineTripDays" placeholder="请输入行程天数"></el-input>
                    </el-form-item>
                    <!-- http://www.hctx365.cn/general/upload/files 非图片类上传地址 -->
                    <el-form-item label="封面图" prop="lineCoverId">
                        <el-upload
                            action="http://www.hctx365.cn/img/upload"
                            list-type="picture-card"
                            :on-preview="handlePictureCardPreview"
                            :on-success="uploadSuccess"
                            :file-list="fileList"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-form>
                <el-row style="margin-left: 27px;font-weight:bold">
                    <el-col :span="16">行程详情</el-col>
                </el-row>
                <el-row style="margin-bottom:70px;z-index: 1;margin-left: 27px;">
                    <el-col :span="15">
                        <!-- <div id="editor" type="text/plain" style="width:90%;height:400px;"></div> -->
                        <div><UEditor :config=config ref="ueditor"></UEditor></div>
                        
                    </el-col>
                </el-row>
                
            </div>
        </div>
        <div class="footer">
            <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="returnRouteManage">返回</el-button>
        </div>
    </div>
</template>

<script>
import { mapState} from 'vuex'
import UEditor from '../ueditor/ueditor.vue'
import {
    httpPost,
    httpGet,
    httpGetParams,
    httpDelete,
    httpGetUser,
    httpPut
} from "@/axios/api";
export default {

    name: 'hello',
    components: {UEditor},
    data(){
        return{
            tableHeight: document.documentElement.clientHeight - 180,
            dialogImageUrl: '',
            fileList:[],
            dialogVisible: false,
            ruleForm:{
                lineName:'',
                lineMarketPrice:'',
                lineTripDays:'',
                // lineCollectionSite:'',
                // lineCollectionDate:'',
                lineTripIntroduce:'',
            },
            rules: {
                lineName: [
                    { required: true, message: '请输入线路名称', trigger: 'blur' },
                    { min: 5, max: 1000, message: '长度不得小于5 个字符', trigger: 'blur' }
                ],
            },
            config: {
            //可以在此处定义工具栏的内容
            // toolbars: [
            //  ['fullscreen', 'undo', 'redo','|','bold', 'italic', 'underline',
            //  '|','superscript','subscript','|', 'insertorderedlist', 'insertunorderedlist',
            //  '|','fontfamily','fontsize','justifyleft','justifyright','justifycenter','justifyjustify']
            // ],
            autoHeightEnabled: false,
            autoFloatEnabled: true,
            initialContent:'请输入内容',   //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
            autoClearinitialContent:true, //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
            initialFrameWidth: null,
            initialFrameHeight: 350,
            BaseUrl: '',
            UEDITOR_HOME_URL: 'static/ueditor/'
          },
          addFormVisible: false,
          filepath:'',
        //   routeData:{},
        }
    },
    mounted() { 
        this.ue = UE.getEditor('editor',{ 
            BaseUrl: '', 
            UEDITOR_HOME_URL: 'static/ueditor/', 
        // toolbars:[] 
        }); 

    },
    computed:{
        ...mapState(["tenantId",'lineId','lineCreate']),
    },
    beforeCreate(){        
    },
    activated(){    
        const that = this
        that.tableHeight = document.documentElement.clientHeight - 180
        window.onresize = () => {
            return (() => {
                that.tableHeight = document.documentElement.clientHeight - 180
            })()
        }
        if(window.location.href.indexOf(this.$store.state.route)<0){
            this.$store.state.route = 'newRoute';
            this.$router.go(0)
        }    
        let lineId =this.$route.query.lineId
        if(!!lineId){
            this.$store.state.lineCreate = false;
            this.getLineData(lineId);
        }else{
            this.clearForm();
        }
    },
    methods: {
        clearForm(){
            this.ruleForm = {
                lineName:'',
                lineMarketPrice:'',
                lineTripDays:'',
                // lineCollectionSite:'',
                // lineCollectionDate:'',
                lineTripIntroduce:'',
            };
            this.fileList = [];
            $('.el-upload--picture-card').removeClass('display');
            this.filepath='';
            
        },
        //编辑线路获取数据
        getLineData(lineId){
            let _this = this;
            this.fileList = [];
            httpGet("http://www.hctx365.cn/line/baseinfo?lineTenantId="+this.$store.state.tenantId+"&lineId=" + lineId)
            .then(res=>{
                if(res.data.success){
                    _this.ruleForm =  res.data.data[0];
                    _this.fileList.push({name:'login_back_20181014200305.jpg',url:"http://www.hctx365.cn/img/"+res.data.data[0].lineCoverPath});
                    UE.getEditor('editor').ready(function() { 
                        UE.getEditor('editor').setContent(res.data.data[0].lineTripIntroduce); 
                    });
                    $('.el-upload--picture-card').addClass('display')
                }
            })
        },
        //获取文档内容
        getContent: function(){
          let content = this.$refs.ueditor.getUEContent();
          console.log(content);
          alert(content);
        },
        submits(){ 
            this.uedata.push(UE.getEditor('editor').getContent()); 
            console.log(this.uedata.join("\n")); 
        }, 

        //封面上传成功
        uploadSuccess(response, file, fileList){
            this.filepath = response.data[0].filePath;
            $('.el-upload--picture-card').addClass('display')
        },
        handleRemove(file, fileList) {
            this.filepath = '';
            $('.el-upload--picture-card').removeClass('display')
            // console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        submitForm(formName) {
            console.log(this.$refs.ueditor.getUEContent())
            this.$refs[formName].validate((valid) => {
            if (valid) {
                var _this = this;
                let postData = this.ruleForm;
                postData.lineTenantId = this.$store.state.tenantId;//线路所属代理商ID
                postData.lineCoverPath = this.filepath;
                postData.lineTripIntroduce = this.$refs.ueditor.getUEContent();
                if(!!this.$route.query.lineId){
                    httpPut("http://www.hctx365.cn/line/baseinfo",postData) 
                    .then(function(response){
                        if(response.success){
                            _this.$notify({
                                duration: 2000,
                                message: '编辑成功',
                                type: 'success'
                            });
                            _this.$router.push('/myRouteManage')
                        }
                    })
                }else{
                    httpPost("http://www.hctx365.cn/line/baseinfo",postData) 
                    .then(function(response){
                        if(response.success){
                            _this.$notify({
                                duration: 2000,
                                message: '保存成功',
                                type: 'success'
                            });
                            _this.$router.push('/myRouteManage')
                        }
                    })
                }
                
            } else {
                return false;
            }
            });
        },
        returnRouteManage(){
            this.$router.push('/myRouteManage')
        },
        // resetForm(formName) {
        //     UE.getEditor('editor').setContent("");
        //     this.clearForm();
        // }
    }
}
</script>

<style>
    .newRoute .el-input--small {
        width: 20%
    }
    .display {
        display: none !important;
    }
</style>

<style scoped>

  .newRoute {
      width:100%;
      position: relative;
  }
  .route-manage{
    width:100%;
    height:40px;
    background:#ddd;
    margin-top: 15px;
    margin-bottom: 20px;
  }
  .route-manage-top{
    margin-left: 20px;
    line-height: 40px;
  }
  .baseInfo {
    padding-left: 20px;
    width: 100%;
    margin-top:20px;
    overflow-y:auto;
  }
  .baseInfo .el-input{
      width:80% !important
  }
  .input-value {
      margin-top:10px;
  }
  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    height: 66px;
    /* box-shadow: 17px 26px 24px red; */
    background: white;
    border-top: 1px solid #ddd;
    padding: 0;
    z-index: 5;
    text-align: center;
  }
  .footer>button{
      margin-top:20px;
  }
</style>
