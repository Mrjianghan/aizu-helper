//import router from '../router/router';
//import { Message } from 'element-ui'
//import errorCode from '@/const/errorCode'









//axios.interceptors.response.use(data => {
//      NProgress.done();
//      var resData = data.data;
//      var code = resData.code;
//      if (code && resData.success !== true) {
//            Message({
//              message: resData.message || errorCode['default'],
//              type: 'error'
//            });
//        if (code === "INVALID_TOKEN") {
//          console.log("登录状态过期")
//            store.dispatch("LogOut").then(() => {
//              router.push({ path: "/login" });
//            });
//        }   
//        return Promise.reject(new Error(resData));
//      }
//      return resData
//    }, error => {
//      NProgress.done();
//      let errMsg = error.toString();
//        console.log( 'error',error );
//      let code = errMsg.substr(errMsg.indexOf('code') + 5);
//      Message({
//        message: errorCode[code] || errorCode['default'],
//        type: 'error'
//      });
//      return Promise.reject(new Error(error));
//})