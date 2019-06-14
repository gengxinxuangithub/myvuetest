<template>
  <el-dialog title="我的排班" :visible.sync="priceDialogFormVisible" width="56%">
    <el-form label-position="right" label-width="120px" ref="timeRef" :model="formData">
      <el-form-item label="排班日期范围" class="is-required">
       <el-date-picker
          v-model="formData.everyDay.bidDate"
          type="date"
          placeholder="选择日期"
          @change="addEveryDay">
        </el-date-picker>
        </el-date-picker>
      </el-form-item>

      <time-picker ref="timePickerRef" v-model="formData.everyDay.bidTimeIndex" @change="getTimesLabel"></time-picker>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="saveClick">保 存</el-button>
      <el-button type="primary" @click="sureClick">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import TimePicker from "@/components/timePicker/timePicker";
let dateObj = new Date();
export default {
  components: {
    TimePicker
  },
  data() {
    return {
      priceDialogFormVisible: false,
      formData: {
        arr: [],
        everyDay:[
          {
            bidTimeIndex:null,
            bidDate: "",
          }
        ]
      }
    };
  },
  computed: {},
  created() {},
  methods: {
    addEveryDay(){
      this.clickDay = this.formData.everyDay.bidDate
      this.formData.everyDay.bidTimeIndex = []
    },
    //保存
    saveClick() {
      // this.$refs["timeRef"].validate(valid => {
      // })
      let everyArr = {}
      let key = _.cloneDeep(this.clickDay)
      let value = _.cloneDeep(this.formData.everyDay.bidTimeIndex)
      everyArr[key] = value;
      this.formData.arr.push(everyArr)
      console.log(this.formData.arr)
    },
    sureClick(){

    },
    //展示编辑弹窗
    showDialog() {
      this.priceDialogFormVisible = true;
    },
    //关闭编辑弹窗
    handleClose() {
      this.priceDialogFormVisible = false;
    },
    //获取选择时间区间
    getTimesLabel(val) {
      // this.everyDay.bidTime = [];
      // _.each(val, (item, index) => {
      //   this.everyDay.bidTime.push(item.label);
      // });
    }
  }
};
</script>