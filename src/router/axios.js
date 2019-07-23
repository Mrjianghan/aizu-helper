import axios from 'axios'
import store from '../store'
import { getToken } from '@/util/auth';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from '@/router/router'
import { Message } from 'element-ui'
//超时时间
axios.defaults.timeout = 10000;
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
//axios.defaults.baseURL = 'http://www.52gongzi.com:8040';
//axios.defaults.baseURL = 'http://106.15.225.38:8040'
axios.defaults.baseURL = 'http://123.206.120.120:8040'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
//HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  if (store.getters.access_token) {
    config.headers['token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  return Promise.reject(error)
})
//HTTPresponse拦截
axios.interceptors.response.use(data => {
      NProgress.done();
      var resData = data.data;    
        if( resData.success ){
        }else{
            if(resData.message === '请先进行参数设置' ){ 
                    Message.error(resData.message);
                    router.push({ path: '/params' })
            }else if (resData.message === "请先同意协议"){       
                    Message.error(resData.message);
                    router.push({ path: '/protocol' })
            }
        }
        resData.code = data.status;
      return resData
}, error => {
      NProgress.done();
      return Promise.reject(new Error(error));
})
export default axios