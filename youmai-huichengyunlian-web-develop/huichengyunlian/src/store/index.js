/**
 * Created by 不动的推动者 on 2018/4/21.
 */
//分离vuex方便维护
// # 我们组装模块并导出 store 的地方
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './modules/actions'
import mutations from './modules/mutations'
import getters from "./getters";


Vue.use(Vuex);


const state = { //存储状态
  show: false,
  messages: 2,
  //userInfo: null, //用户信息
  collapse: false, //折叠面板
  tenantName:'',//代理商名称
  doctorId:"",//医生ID
  userInfo:{},
  mapData:{},//map对象
  messageCount:"",
  result:{
    routePermit:{}, ticketPermit:{},
    user:{},role:{},tenant:{},menu:{},config:{}
  },
  flagPicture: null,

  tenantId:"b78ded8f-209c-11e9-8101-52540016ed2f",//登录人的代理商Id
	register:1,//1注册 0修改
	lineId:'',//新建线路返回的6689d9c2-5e5c-4e8e-a818-fdb009a110e3
	lineCreate:true,
	routeMgt:'',
	route:'',
}



export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})




