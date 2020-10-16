import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'
import vuethis from '@/main'

axios.defaults.headers.post['Content-Type'] = 'application/json';
const http = axios.create({
  timeout: 1000 * window.SITE_CONFIG['timeout'],
  withCredentials: true
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['Authorization'] = Vue.cookie.get('Authorization') // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 500) {
    vuethis.$message({
      message: response.data.msg,
      type: 'error',
      duration: 1500
    })
  }
  if(response.headers["authorization"]){
    Vue.cookie.set('Authorization',response.headers["authorization"])
  }
  return response
}, error => {
  if(!Vue.cookie.get('Authorization') && error.request.responseURL.indexOf('login')<0){
    
    gotoLogin = true
    if(gotoLogin){
      clearLoginInfo()
      router.push({ name: 'login' })
    }
    return
  }
  let msg = ''
  let gotoLogin = false
  if(error.message.includes('timeout')){
    msg = '请求超时'
  }else{
    if (error.response.status === 401) {
      msg = '认证失败，请检查账号信息是否正确'
      gotoLogin = true
    }else if (error.response.status === 402) {
      msg = '该账户不能使用！'
      gotoLogin = true
    }else if (error.response.status === 403) {
      msg = '页面禁止访问'
    }else if (error.response.status === 404) {
      msg = '未找到指定页面'
    }else if (error.response.status === 405) {
      msg = '请求方法不允许'
    }else if (error.response.status === 500) {
      msg = error.response.data.message
    }
  }
  vuethis.$message({
    message: msg,
    type: 'error',
    duration: 1500
  })
  if(gotoLogin){
    clearLoginInfo()
    router.push({ name: 'login' })
  }
  return Promise.reject(error)
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  if ( actionName == '/' || actionName == '') {
    return window.SITE_CONFIG.baseUrl
  }
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' ? '/proxyApi'+ window.SITE_CONFIG.baseUrl : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  // var defaults = {
  //   't': new Date().getTime()
  // }
  // data = openDefultdata ? merge(defaults, data) : data
  data = openDefultdata ? data : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
