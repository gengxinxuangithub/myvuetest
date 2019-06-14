<template>
  <div id="sidebar-left">
    <div>
      <img :src="url" class="header-icon"/>
    </div>
    <el-menu :default-active="$route.path"
             :collapse="collapse"
             class="el-menu-vertical-demo"
             background-color="#363636"
             text-color="#fff"
             active-text-color="#ffd04b"
             unique-opened
             :router="true">
      <template v-for="(item,index) in sidebarInfo">
        <el-submenu :index="item.index" :key="index" v-if="item.subNav">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </template>
          <el-menu-item-group>            
            <el-menu-item :index="list.index" v-for="(list,index) in item.subNav" :key="index">{{list.title}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item :index="item.index" :key="index" v-else>
          <template>
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";
import {
    httpPost,
    httpGet,
    httpGetParams,
    httpDelete,
    httpGetUser,
    httpPut
} from "@/axios/api";
export default {
  name: "sidebar",
  data() {
    return {
      url:require( '../../../static/image/icon.png'),
      indexPath: [], //保存点击过的页面路由信息
      sidebarInfo: []
    };
  },
  computed: {
    ...mapState({
      collapse: state => state.collapse
    })
  },
  created(){
    this.getSideBarInfo();
  },
  methods: {
    getResource(data){
      let resourceData = []
      var map = {};
      data.forEach(element => {
        if(element.leaf){
           map[element.menuName] = element.menuId 
        }else{
          element.childrenMenuList.forEach(child => {
            map[child.menuName] = child.menuId 
          });
        }
      });
      this.$store.state.mapData = map;
      console.log(this.$store.state.mapData)
      this.getShowData();
      
    },
    getShowData(){
      let vm = this
      let l = this.$loading()
      let data = this.$store.state.result
      // data.config.showDelete = data.config.authority = data.config.showEdit = data.config.showAdd = true;
      data.user.showDelete = data.user.showResource = data.user.showEdit = data.user.showAdd = true;
      data.role.showDelete = data.role.authority = data.role.showEdit = data.role.showAdd = true;
      data.tenant.showDelete = data.tenant.showEdit = data.tenant.showAdd = true;
      data.menu.showDelete = data.menu.showResource = data.menu.showEdit = data.menu.showAdd = true;
      l.close()
      vm.$emit('finish',true)
      // axios.all([this.getRoutePermit(), this.getTicketPermit(),this.getUserFile(), this.getRoleFile(), this.getTenantFile(), this.getMenuFile()]), this.getCongigFile()
      // .then(axios.spread(function (routePermit, ticketPermit, user,role,tenant,menu,config) {
      //   //线路的
      //   routePermit.data.data.forEach(element => {
      //     if(element.resourceName == "新增"){data.routePermit.showDelete = element.checked}
      //   });
      //   //门票的
      //   ticketPermit.data.data.forEach(element => {
      //     if(element.resourceName == "删除"){data.ticketPermit.showDelete = element.checked}
      //   });
      //   user.data.data.forEach(element => {
      //     if(element.resourceName == "删除"){data.user.showDelete = element.checked}
      //     if(element.resourceName == "资源号"){data.user.showResource = element.checked}
      //     if(element.resourceName == "编辑"){data.user.showEdit = element.checked}
      //     if(element.resourceName == "新增"){data.user.showAdd = element.checked}
      //   });
      //   role.data.data.forEach(element => {
      //     if(element.resourceName == "删除"){data.role.showDelete = element.checked}
      //     if(element.resourceName == "角色授权"){data.role.authority = element.checked}
      //     if(element.resourceName == "编辑"){data.role.showEdit = element.checked}
      //     if(element.resourceName == "新增"){data.role.showAdd = element.checked}
      //   });
      //   tenant.data.data.forEach(element => {
      //     if(element.resourceName == "删除"){data.tenant.showDelete = element.checked}          
      //     if(element.resourceName == "编辑"){data.tenant.showEdit = element.checked}
      //     if(element.resourceName == "新增"){data.tenant.showAdd = element.checked}
      //   });
      //   menu.data.data.forEach(element => {
      //     if(element.resourceName == "删除"){data.menu.showDelete = element.checked}
      //     if(element.resourceName == "资源号"){data.menu.showResource = element.checked}
      //     if(element.resourceName == "编辑"){data.menu.showEdit = element.checked}
      //     if(element.resourceName == "新增"){data.menu.showAdd = element.checked}
      //   });
      //   // config.data.data.forEach(element => {
      //   //   if(element.resourceName == "删除"){data.config.showDelete = element.checked}
      //   //   if(element.resourceName == "字典数据"){data.config.authority = element.checked}
      //   //   if(element.resourceName == "编辑"){data.config.showEdit = element.checked}
      //   //   if(element.resourceName == "新增"){data.config.showAdd = element.checked}
      //   // });
      //   l.close()
      //   vm.$emit('finish',true)
      // }))
    },

    //线路的
    getRoutePermit() {
      return axios.get('/auth/menu/resources/d8d40b61-e8dc-4ab9-9e97-03ec138daa29');
    },
    //门票的
    getTicketPermit() {
      return axios.get('/auth/menu/resources/fcad9f94-0586-4f7b-9476-cc83aa7061cf');
    },
    getUserFile() {
      return axios.get('/auth/menu/resources/bce53370-4f4d-479e-9775-58a61129dc0c');// + this.$store.state.mapData['用户管理']);
    },
    getRoleFile() {
      return axios.get('/auth/menu/resources/72654472-f6c8-4d84-a05e-3b9c3ce8a2dd');// + this.$store.state.mapData['角色管理']);
    },
    getTenantFile() {
      return axios.get('/auth/menu/resources/19c094e5-4600-4e3e-8fc7-708af4dacd07');// + this.$store.state.mapData['俱乐部管理']);
    },
    getMenuFile() {
      return axios.get('/auth/menu/resources/30bb63ed-c932-47fc-9145-0a2eef443bfc');// + this.$store.state.mapData['菜单管理']);
    },
    getCongigFile() {
      return axios.get('/auth/menu/resources/a8b58b86-f5b8-401f-b5c8-1a580496048c');// + this.$store.state.mapData['配置管理']);
    },
    getSideBarInfo(){
      this.sidebarInfo = [];
      let _this = this
      httpGetUser("/auth/menu/user")
      .then(function(response){
          if(response.success){            
            let sideBarList = response.data
            _this.getResource(response.data)
            sideBarList.forEach((element,index) => {
                if(element.leaf){
                  //无子菜单
                  _this.sidebarInfo.push({
                    icon: element.menuIcon,
                    index: '/' + element.menuUrl,
                    title: element.menuName
                  })                  
                }else{
                  //有子菜单
                  let subNav = [];
                  element.childrenMenuList.forEach(child => {
                    subNav.push({
                      index: '/' + child.menuUrl,
                      title: child.menuName
                    })
                  });
                  if(element.menuUrl.trim() == ""){
                    element.menuUrl = index.toString()
                  }else{
                      element.menuUrl = '/' +  element.menuUrl
                  }
                  _this.sidebarInfo.push({
                    icon: element.menuIcon,
                    index: element.menuUrl,
                    title: element.menuName,
                    subNav: subNav
                  })
                }
            });
          }
      }).catch(_this.dataLoading = false)
    }
  }
};
</script>
<style scoped lang="scss">
  .header-icon {
    font-size: 20px;
    padding-top: 20px;
    padding-left: 0px;
    color: rgb(255, 255, 255);
    height: 100px;
    background-color: #363636;
    display: inherit;
    width: 200px;
    margin-top: -20px;
  }
</style>
