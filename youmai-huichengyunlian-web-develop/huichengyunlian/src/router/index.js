import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path: '/login',
      component:resolve => require(['@/views/login/Login'],resolve),
      meta: { title: '登陆' }
    },
    {
      path: '/',
      component:resolve => require(['@/views/mainMenu'],resolve),
      name: '',
      children: [
        {
          path: '/mainPage',
          name: '数据统计',
          component:resolve => require(['@/views/pages/mainPage'],resolve),
        },
      ]
    },
    {
      path: '/routeTransfer',
      component:resolve => require(['@/views/common/routeApp/routeTransfer'],resolve),
      name: '',      
    },
    {
      path: '/transferInfo',
      component:resolve => require(['@/views/common/routeApp/transferInfo'],resolve),
      name: '',      
    },
    {
      path: '/transferPicture',
      component:resolve => require(['@/views/common/routeApp/transferPicture'],resolve),
      name: '',      
    }, 
    {
      path: '/',
      component:resolve => require(['@/views/mainMenu'],resolve),
      name: '员工销售业绩统计分析',
      children: [
        {
          path: '/employeeAnalysis',
          name: '分析',
          component:resolve => require(['@/views/employeeAnalysis/employeeAnalysis'],resolve),
        },
      ]
    },    
    {
      path: '/',
      component:resolve => require(['@/views/mainMenu'],resolve),
      name: '员工销售业绩统计分析',
      children: [
        {
          path: '/employeeManagement',
          name: '员工管理',
          component:resolve => require(['@/views/employeeAnalysis/employeeManagement'],resolve),
        },
      ]
    },    
    {
      path: '/',
      component:resolve => require(['@/views/mainMenu'],resolve),
      name: '代理商销售业绩统计分析',
      children: [
        {
          path: '/clubAnalysis',
          name: '分析',
          component:resolve => require(['@/views/clubAnalysis/clubAnalysis'],resolve),
        },
      ]
    },
    {
      path: '/',
      component:resolve => require(['@/views/mainMenu'],resolve),
      name: '代理商销售业绩统计分析',
      children: [
        {
          path: '/agentManagement',
          name: '代理商管理',
          component:resolve => require(['@/views/clubAnalysis/agentManagement'],resolve),
        },
      ]
    },
    {
      path: '/',
      component:resolve => require(['@/views/mainMenu'],resolve),
      name: '配置管理',
      children: [
        {
          path: '/configSet',
          name: '字典管理',
          component:resolve => require(['@/views/configSetManage/configSetManage'],resolve),
        },
      ]
    },
    {
      path: '/',
      component:resolve => require(['@/views/mainMenu'],resolve),
      name: '线路管理',
      children: [
        {
          path: '/myRouteManage',
          name: '我的产品',
          component:resolve => require(['@/views/common/commonRoute/routeManage'],resolve),
        },
        {
          path: '/publishRouteManage',
          name: '上线产品',
          component:resolve => require(['@/views/common/commonRoute/storeManage'],resolve),
        },
        {
          path: '/tradeRouteManage',
          name: '同业产品',
          component:resolve => require(['@/views/common/commonRoute/tradeManage'],resolve),
        },
        {
          path: '/newRoute',
          name: '新建线路',
          component:resolve => require(['@/views/common/commonRoute/newRoute'],resolve),
        },
        {
          path: '/ticketManage',
          name: '门票管理',
          component:resolve => require(['@/views/common/commonTicket/ticketManage'],resolve),
        },
        {
          path: '/newTicket',
          name: '新建门票',
          component:resolve => require(['@/views/common/commonTicket/newTicket'],resolve),
        },
        {
          path: '/showRouteDetail',
          name: '线路详情',
          component:resolve => require(['@/views/common/commonRoute/showRouteDetail'],resolve),
        },
        {
          path: '/afterTransfer',
          name: '线路转发',
          component:resolve => require(['@/views/common/routeApp/afterTransfer'],resolve),
        },
        
      ]
    },
    {
      path: '/',
      component:resolve => require(['@/views/mainMenu'],resolve),
      name: '权限管理',
      children: [
        {
          path: '/userManage',
          component:resolve => require(['@/views/authorMgt/userManage'],resolve),
          name: '用户管理',
          meta: {
            title: '用户管理'
          }
        },
        {
          path: '/roleManage',
          component:resolve => require(['@/views/authorMgt/roleManage'],resolve),
          name: '角色管理',
          meta: {
            title: '角色管理'
          }
        },
        {
          path: '/menuManage',
          component:resolve => require(['@/views/authorMgt/menuManage'],resolve),
          name: '菜单管理',
          meta: {
            title: '菜单管理'
          }
        },
        {
          path: '/tenantManage',
          component:resolve => require(['@/views/authorMgt/tenantManage'],resolve),
          name: '俱乐部管理',
          meta: {
            title: '俱乐部管理'
          }
        }
      ]
    },
  ]
})
