<template>
  <div>
    <div class="joy-time-picker">
      <ul class="joy-time-picker__ap">
        <li>
          00:00-24:00
        </li>
      </ul>
      <ul class="joy-time-picker__hours">
        <li v-for="(item, index) in hours">
          {{ item }}
        </li>
      </ul>
      <ul class="joy-time-picker__harf">
        <li
          v-for="(item, index) in harfHours"
          @mousedown.stop.prevent="handleMouseDown"
          @mouseover.stop.prevent="handleMouseOver"
          :item-index="item.index"
          :item-status="item.active"
          :item-pause="item.pause"
          :start-time="item.startTime"
          :end-time="item.endTime"
          :class="{'active': item.active === 1, 'pause': item.pause === 1, 'remove': item.remove === 1}"
          >
        </li>
      </ul>
    </div>
    <div class="joy-time-picker__picked" v-if="times.length > 0">
      <div class="joy-time-picker__text">所选时段:</div>
      <ul class="joy-time-picker__sheet">
        <li v-for="(item, index) in times">
          {{ renderLabel(item.label) }}
          <div class="delete-icon" @click="deleteTime(item.value)">
            <i class="el-icon-close"></i>
          </div>
        </li>
        <li class="joy-time-picker__clear" @click="clearTime()">清空</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { cloneDeep } from 'lodash'

  export default {
    name: 'WTimePicker',
    data() {
      return {
        hours: [],
        harfHours: [],
        times: [],
        mouseDown: false,
        start: -1,
        end: -1,
        pause: -1,
        remove: -1,
        arr: [],
        startStatus: 0
      }
    },
    props: {
      value: {
        type: Array,
        default() {
          return []
        }
      },
    },
    watch: {
      arr(val) {
        let self = this
        self.times = self.getTimes();
        self.$emit('input', val);
        self.$emit('change', self.times);
      },
      value(val) {
        let self = this
        self.query = cloneDeep(val)
        self.arr = val
        this.renderTable(self.arr);
      }
    },
    methods: {
      //数组冒泡排序
      arraySort(arr) {
        if (!arr instanceof Array) {
          return;
        }
        if (arr.length < 2) {
          return;
        }
        for (let i = 0; i < arr.length - 1; i++) {
          for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
              var temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
            }
          }
        }
        return arr;
      },
      //获取已选择时间段数组
      getTimes() {
        let self = this
        let bakArr = self.harfHours.filter(v => self.arr.indexOf(v.index) > -1)
        let tempArr = []
        if(bakArr.length > 1) {
          let start = 0, end = 1
          bakArr.map((item, index) => {
            if(index > 0) {
              if(item.index !== bakArr[index - 1].index + 1) {
                end = index
                let obj = {}
                let timeLebel = bakArr.slice(start, end)
                let sliceArr = timeLebel.map(item => item.index)
                obj.value = sliceArr
                obj.label = `${timeLebel[0].startTime}~${timeLebel[timeLebel.length - 1].endTime}`
                tempArr.push(obj)
                start = index
              }
              if(index === bakArr.length - 1) {
                end = index + 1
                let obj = {}
                let timeLebel = bakArr.slice(start, end)
                let sliceArr = timeLebel.map(item => item.index)
                obj.value = sliceArr
                obj.label = `${timeLebel[0].startTime}~${timeLebel[timeLebel.length - 1].endTime}`
                tempArr.push(obj)
              }
            }
          })
        } else if(bakArr.length === 1){
          tempArr.push({
            value: bakArr[0].index,
            label: `${bakArr[0].startTime}~${bakArr[0].endTime}`
          })
        }
        return tempArr
      },

      /**
      * 生成对应长度数组
      * @param {Object} n 数组长度
      */
      getArray (n, type) {
        let arr = new Array(n)
        if (type === 1) {
          for (let i = 0; i < n; i ++) {
            arr[i] = i
          }
        } else if (type === 2) {
          for (let i = 0; i < n ; i ++) {
            arr[i] = {
              index: i+1,
              active: 0,
              pause: 0,
              // startTime: `${Math.floor(i / 2)}:${(i % 2) === 1 ? '30' : '00'}`,
              // endTime: `${Math.floor((i + 1) / 2)}:${(i % 2) === 0 ? '30' : '00'}`,
              startTime: `${Math.floor(i)} : 00`,
              endTime: `${Math.floor(i + 1)} : 00`,
            }
          }
        }
        return arr
      },

      //监听鼠标按下
      handleMouseDown (e) {
        let self = this
        self.mouseDown = true
        self.start = Number(e.target.getAttribute('item-index'))
        self.startStatus = Number(e.target.getAttribute('item-status'))
        self.handleMouseOver(e)
      },

      //监听鼠标松开
      handleMouseUp (e) {
        let self = this
        self.mouseDown = false
        self.end = Number(e.target.getAttribute('item-index'))
        if (self.end >= self.start) {
          if(self.startStatus === 1) {
            for (let i = self.start; i<= self.end; i ++) {
              if(self.arr.indexOf(i) > -1) {
                self.arr.splice(self.arr.indexOf(i), 1)
              }
            }
          } else {
            for (let i = self.start; i<= self.end; i ++) {
              if(self.arr.indexOf(i) === -1) {
                self.arr.push(i)
              }
            }
          }
        } else if (self.end < self.start) {
          if(self.startStatus === 1) {
            for (let i = self.end; i<= self.start; i ++) {
              if(self.arr.indexOf(i) > -1) {
                self.arr.splice(self.arr.indexOf(i), 1)
              }
            }
          } else {
            for (let i = self.end; i<= self.start; i ++) {
              if(self.arr.indexOf(i) === -1) {
                self.arr.push(i)
              }
            }
          }
        }
        this.arraySort(self.arr)
        self.renderTable(self.arr)
      },

      //监听鼠标移入
      handleMouseOver (e) {
        let self = this
        if (self.mouseDown) {
          let pause = []
          self.pause = Number(e.target.getAttribute('item-index'))
          if(self.pause >= self.start) {
            for (let i = self.start; i<= self.pause; i ++) {
              pause.push(i)
            }
          } else if(self.pause < self.start){
            for (let i = self.pause; i<= self.start; i ++) {
              pause.push(i)
            }
          }
          self.renderTable(self.arr, pause, self.startStatus === 1 ? 0 : 1)
        }
      },

      //鼠标移出并松开
      handleBodyMouseUp() {
        let self = this
        if(self.mouseDown) {
          self.mouseDown = false
          self.renderTable(self.arr)
          if (self.pause >= self.start) {
            if(self.startStatus === 1) {
              for (let i = self.start; i<= self.pause; i ++) {
                if(self.arr.indexOf(i) > -1) {
                  self.arr.splice(self.arr.indexOf(i), 1)
                }
              }
            } else {
              for (let i = self.start; i<= self.pause; i ++) {
                if(self.arr.indexOf(i) === -1) {
                  self.arr.push(i)
                }
              }
            }
          } else if (self.pause < self.start) {
            if(self.startStatus === 1) {
              for (let i = self.pause; i<= self.start; i ++) {
                if(self.arr.indexOf(i) > -1) {
                  self.arr.splice(self.arr.indexOf(i), 1)
                }
              }
            } else {
              for (let i = self.pause; i<= self.start; i ++) {
                if(self.arr.indexOf(i) === -1) {
                  self.arr.push(i)
                }
              }
            }
          }
          this.arraySort(self.arr)
          self.renderTable(self.arr)
        }
      },

      renderLabel(v) {
        if(!v || v === '') {
          return
        }
        let arr = v.split('~')
        let str = ''
        if(arr[0].length === 4) {
          arr[0] = `0${arr[0]}`
        }
        if(arr[1].length === 4) {
          arr[1] = `0${arr[1]}`
        }
        str = `${arr[0]}~${arr[1]}`
        return str
      },

      //渲染每一格
      renderTable(arr, pauseArr, type) {
        let self = this
        if (!arr instanceof Array) {
          return
        }
        self.harfHours = self.getArray(24, 2)
        arr.map ((item,i) => {
          self.harfHours.map ((item2, i2) => {
            if(item2.index === item) {
              item2.active = 1
            }
          })
        })
        if(pauseArr) {
          pauseArr.map ((item,i) => {
            self.harfHours.map ((item2, i2) => {
              if(item2.index === item) {
                if (type === 1) {
                  item2.pause = 1
                } else if (type === 0) {
                  item2.remove = 1
                }
              }
            })
          })
        }
      },

      //移除时间段
      deleteTime(a) {
        let self = this
        a.map(item => {
          if(self.arr.indexOf(item) > -1) {
            self.arr.splice(self.arr.indexOf(item), 1)
          }
        })
        this.arraySort(self.arr)
        self.renderTable(self.arr)
      },

      //清空时间段
      clearTime() {
        let self = this
        self.arr = []
        self.renderTable(self.arr)
      }
    },

    beforeMount() {
      let self = this
      self.hours = self.getArray(24, 1)
      self.harfHours = self.getArray(48, 2)
      self.arr = self.value.indexOf(0) > -1 ? [] : cloneDeep(self.value)
      self.renderTable(self.arr)
    },

    mounted() {
      let self = this
      document.addEventListener('click', self.handleBodyMouseUp)
    },

    destroyed () {
      let self = this
      document.removeEventListener('click', self.handleBodyMouseUp)
    }
  }

</script>
<style lang="scss">
li,ul {
  list-style: none
}

.joy-time-picker {
  width: 720px;
  text-align: center;
  border: 1px solid #ddd
}

.joy-time-picker__ap {
  width: 100%;
  zoom: 1;
  border-bottom: 1px solid #ddd;
  margin: 0;
  padding: 0
}

.joy-time-picker__ap:after,.joy-time-picker__ap:before {
  content: " ";
  display: table
}

.joy-time-picker__ap:after {
  clear: both;
  visibility: hidden;
  font-size: 0;
  height: 0
}

.joy-time-picker__ap li {
  height: 30px;
  line-height: 30px;
  float: left;
  width: 329px
}

.joy-time-picker__ap li:not(:last-child) {
  border-right: 1px solid #ddd;
  width: 389px
}

.joy-time-picker__hours {
  width: 100%;
  zoom: 1;
  border-bottom: 1px solid #ddd;
  margin: 0;
  padding: 0
}

.joy-time-picker__hours:after,.joy-time-picker__hours:before {
  content: " ";
  display: table
}

.joy-time-picker__hours:after {
  clear: both;
  visibility: hidden;
  font-size: 0;
  height: 0
}

.joy-time-picker__hours li {
  height: 30px;
  line-height: 30px;
  float: left;
  width: 4.032%;
}

.joy-time-picker__hours li:not(:last-child) {
  border-right: 1px solid #ddd
}

.joy-time-picker__harf {
  width: 100%;
  zoom: 1;
  margin: 0;
  padding: 0
}

.joy-time-picker__harf:after,.joy-time-picker__harf:before {
  content: " ";
  display: table
}

.joy-time-picker__harf:after {
  clear: both;
  visibility: hidden;
  font-size: 0;
  height: 0
}

.joy-time-picker__harf li {
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  float: left;
 width:  4.032%
}

.joy-time-picker__harf li.active {
  background: #1482ff
}

.joy-time-picker__harf li.pause {
  background: rgba(20,130,255,.5)!important
}

.joy-time-picker__harf li.remove {
  background: #f8f8f8!important
}

.joy-time-picker__harf li:not(:last-child) {
  border-right: 1px solid #ddd
}

.joy-time-picker__picked {
  margin-top: 10px
}

.joy-time-picker__text {
  font-size: 13px;
  color: #666;
  line-height: 14px;
  padding: 10px 0
}

.joy-time-picker__sheet {
  width: 100%;
  zoom: 1;
  margin: 0;
  padding: 0;
  transition: display .5s ease
}

.joy-time-picker__sheet:after,.joy-time-picker__sheet:before {
  content: " ";
  display: table
}

.joy-time-picker__sheet:after {
  clear: both;
  visibility: hidden;
  font-size: 0;
  height: 0
}

.joy-time-picker__sheet li:not(:last-child) {
  cursor: pointer;
  float: left;
  margin: 0 8px 10px 0;
  height: 28px;
  line-height: 26px;
  padding-left: 24px;
  width: 122px;
  background: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 99px;
  position: relative;
  color: #555;
  transition: padding-left .2s ease
}

.joy-time-picker__sheet li:not(:last-child) .delete-icon {
  display: none;
  width: 20px;
  height: 20px;
  transition: display .2s;
  position: absolute;
  right: 8px;
  top: 3px
}

.joy-time-picker__sheet li:not(:last-child):hover {
  background: rgba(20,130,255,.1);
  border: 1px solid rgba(20,130,255,.2);
  padding-left: 16px;
  color: #1482ff
}

.joy-time-picker__sheet li:not(:last-child):hover .delete-icon {
  display: block
}

.joy-time-picker__sheet li:last-child {
  padding-left: 0;
  color: #1482ff;
  float: left;
  margin: 0 8px 10px 0;
  height: 28px;
  line-height: 26px;
  cursor: pointer
}
</style>