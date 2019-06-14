<template>
  <div class='bread_container' id="bread_container">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item> -->
      <el-breadcrumb-item v-for='(item,index) in levelList' :key='index' v-if='item.name'>
        {{item.name}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        changeBarDirection: false,
        levelList: null
      };
    },
    created() {
      this.getBreadcrumb();
    },
    methods: {
      getBreadcrumb() {
        let matched = this.$route.matched.filter(item => item.name);
        const first = matched[0];
        this.levelList = matched;
      }
    },
    watch: {
      $route() {
        this.getBreadcrumb();
      }
    }
  };
</script>
<style scoped>
  .breadcrumb {
    height: 30px;
    line-height: 18px;
    font-size: 16px;
  }

  .breadbutton {
    float: left;
    margin: 4px 5px 0 0;
  }

  .bread_container {
    margin-bottom: 5px;
  }
</style>
