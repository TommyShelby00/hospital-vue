import store from "@/store";
import axios from "axios";
import router from '@/router'
import { Message } from "element-ui";

//示例
// export function requestGateway(config){
//   //1.创建axios实例
//   const instance = axios.create({
//     baseURL:'http://127.0.0.1/taxi',
//     timeout: 5000
//   })
//   //2.1 axios拦截器
//   //全局拦截axios.interceptors
//   //局部拦截
//   instance.interceptors.request.use(config => {
//     //1.可以检验config信息

//     //2.每次发送请求的时候，显示加载图标

//     //3.某些网络请求必须携带信息，如（token）

//     //一定要发送回去，不然无法请求
//     return config 
//   },error => {
//     console.log('error :>> ', error);
//   //一般请求没有发出去的时候进入
//   })
//   //2.2响应拦截
//   instance.interceptors.response.use(result => {
//     //一定要发送回去，不然无法接受响应
//     return result
//   },error => {
//     console.log('error :>> ', error);
//   //一般响应错误的时候进入
//   })
//   //3.发送真正的网络请求并以Promise返回
//   return instance(config)
// }

export function request(config){
    const service = axios.create({
      baseURL:'/api',
      timeout: 5000
    })
    
    service.interceptors.request.use(config => {
      config.headers['token'] = store.state.token;
      return config
    },error => {
      return error
    })

    service.interceptors.response.use(result => {
      if (result.data.code===401) {
        if (router.currentRoute.path != '/login') {
          console.log("错误：", result.data.msg)
          //token过期，清除它
          store.commit("removeToken");
          // 重定向到登录页面
          router.push('/login')//.then(() => {
        //   location.reload(true);
        // });
        return Promise.reject(result.data.msg);
        }
    }
      return result
    },error => {
    return Promise.reject(error);
    })
    return service(config)
}

export function adminRequest(config){
  const service = axios.create({
    baseURL:'/api',
    timeout: 5000
  })
  
  service.interceptors.request.use(config => {
    config.headers['token'] = store.state.token;
    return config
  },error => {
    return error
  })

  service.interceptors.response.use(result => {
    if (result.data.code==401) {
      if (router.currentRoute.path != '/adminLogin') {
      console.log("错误：", result.data.msg)
      //可能是token过期，清除它
      store.commit("removeToken");
      // 重定向到登录页面
    router.push('/adminLogin').then(() => {
      location.reload(true);
    });
    return Promise.reject(result.data.msg);
  }
}
    return result
  },error => {
  return Promise.reject(error);
  })
  return service(config)
}

export function doctorRequest(config){
  const service = axios.create({
    baseURL:'/api',
    timeout: 5000
  })
  
  service.interceptors.request.use(config => {
    config.headers['token'] = store.state.token;
    return config
  },error => {
    return error
  })

  service.interceptors.response.use(result => {
    if (result.data.code===401) {
      console.log("错误：", result.data.msg)
      if (router.currentRoute.path !== '/doctorLogin') {
        // token过期，清除它
        store.commit("removeToken");
        // 重定向到登录页面
        router.push('/doctorLogin');
      }
    return Promise.reject(result.data.msg);
  }
    return result
  },error => {
  return Promise.reject(error);
  })
  return service(config)
}