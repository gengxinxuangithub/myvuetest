/**
 * Created by 不动的推动者 on 2018/4/30.
 */
export default {
  //接口代理配置
  Hallowmas:'http://jsonplaceholder.typicode.com/users',
  commonLick:'../static/data/localData.json',
  ws:'ws://baidu.com'
}

//区分环境或者区分服务器
// let service = 'dev';
// // // let service = 'prod';
// let api = '';
// if (service === 'dev') {
//   /**dev开发**/
//   api = 'data/localData.json';
// } else if (service === 'prod') {
//   /**prod部署**/
//   api = '/proxy/client';
// }
//
// export default {
//   /**个人中心start**/
//   //1 获取c端个人信息 POST /wx/getClientInfo
//   getClientInfo: `${api}/wx/getClientInfo`,
//   //2 获取手机注册验证码 POST /wx/getClientRegisterCode
//   getClientRegisterCode: `${api}/wx/getClientRegisterCode`,
//   //3 绑定手机号 POST /wx/clientBindMobile
//   clientBindMobile: `${api}/wx/clientBindMobile`,
//   /**个人中心end**/
//
// }
