<template>
  <el-dialog title="上传图片" :visible.sync="casesPatientsDialogFormVisible" width="40%" height="1000px" append-to-body>
    <el-upload :action="pictureUrl"
               accept="image/jpeg,image/jpg,image/png"
               list-type="picture-card"
               :auto-upload="true"
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove"
               style="margin-bottom:20px"
               :file-list="imgList"
               :on-success="handleSuccess"
               :multiple="true">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="casesPatientsDialogFormVisible = false" @keyup.enter.native="casesPatientsDialogFormVisible = false"
          class="cancelBtn">取 消</el-button> -->
      <el-button type="primary" @click="saveUpPic">上传</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: "addPictureList",
  data() {
    return {
      pictureUrl: "http://www.yyzssoft.com/img/upload",
      casesPatientsDialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      imageUrl: "",
      imgList: [],
      qualifyList: "",
    };
  },
  created() {},
  watch:{
    flagPicture(){
      if(this.flagPicture){
        this.qualifyList = ""
        this.imgList = []
      }
    }
  },
  computed:{
    ...mapGetters(['flagPicture'])
  },
  methods: {
    showDialog() {
      this.casesPatientsDialogFormVisible = true;
    },
    //新增档案关闭
    closeShowClick() {
      //this.resetFunction();
      this.$emit("imgList", this.imgList)
      this.casesPatientsDialogFormVisible = false;
    },
    handleCurrentChange(val) {
      this.list = [];
      this.pages.page = val;
    },
    // //上传图片
    // handleRemove(file, fileList) {
    //   this.dowithImgPath(fileList);
    // },
    // handleSuccess(response, file, fileList){
    //   this.dowithImgPath(fileList);
    // },
    // dowithImgPath(fileList){
    //   let imgListFile = []
    //   if(fileList.length > 0){
    //     _.each(fileList, (item, index) => {
    //       if(item.response){
    //         imgListFile.push(item.response.data[0].filePath)
    //       }else{
    //         imgListFile.push(item.url.split("/").pop())
    //       }
    //     })
    //     this.imgList = imgListFile
    //   }else if(fileList.length == 0){
    //     this.imgList = [];
    //   }
    // },
    // 上传相关
    handleRemove(file, fileList) {
      this.dowithImgPath(fileList,"qualifyList");
    },
    handleSuccess(response, file, fileList){
        this.dowithImgPath(fileList,"qualifyList");
    },
    dowithImgPath(fileList,object){
      if(fileList.length > 0){
        let list = [];
      for(let a = 0;a < fileList.length; a++){
        if(fileList[a].response){
          list.push(fileList[a].response.data[0].filePath);
        }else {
          list.push(fileList[a].url.split("/").pop());
        }
      }
      this[object] = list;
      }else if(fileList == 0){
        this[object] = [];
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    saveUpPic(){
      this.$emit('getPictureList', this.qualifyList)
      this.casesPatientsDialogFormVisible = false;
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload:hover {
  border-color: #363636;
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
</style>
