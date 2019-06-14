<template>
  <el-dialog class="look-picture" title="查看图片" :visible.sync="casesPatientsDialogFormVisible" width="40%" height="1000px" append-to-body>
    <el-upload  :file-list="imgList"
                :action="pictureUrl"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove" :disabled="true">
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <div slot="footer" class="dialog-footer">
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "addPictureList",
  data() {
    return {
      pictureUrl: "http://www.yyzssoft.com/img/upload",
      casesPatientsDialogFormVisible: false,
      dialogVisible: false,
      imageUrl: "",
      dialogImageUrl: '',
      dataList: [],
      name: "",
      size: "",
      excellent: "",
      address: "",
      imgList:[],
      cPicList: []
    };
  },
  created() {},
  methods: {
    showDialog(medicalRecordFile) {
      this.casesPatientsDialogFormVisible = true;
      this.seemoreEid(medicalRecordFile)
    },
    seemoreEid(medicalRecordFile){
      this.imgList = []
       medicalRecordFile.forEach(ele=>{
        this.imgList.push({name:ele,url:"http://www.yyzssoft.com/img/"+ele});
      });
    },
    //新增档案关闭
    closeShowClick() {
      this.resetFunction();
      this.casesPatientsDialogFormVisible = false;
    },
    handleCurrentChange(val) {
      this.list = [];
      this.pages.page = val;
    },
    //上传图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>
<style lang="scss">
.look-picture{
  .el-upload--picture-card {
    display: none;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #363636;
  }
  .el-upload, .el-upload--picture-card {
    display: none;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 10%;
    height: 10%;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}

</style>
