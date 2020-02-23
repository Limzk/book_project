import Axios from 'axios';
import VueCookies from 'vue-cookies';

const service = Axios.create({

})

//设置Axios默认值
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if(VueCookies.isKey('token')) {
      config.defaults.headers.common['Authorization'] = VueCookies.get('token');
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// // 添加响应拦截器
// Axios.interceptors.response.use(function (response) {
//     // 对响应数据做点什么
//     return response;
//   }, function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   });



//登录接口
export function login(params) {
    return Axios.get('/api/cat/user/login', { params: params } ).then( res => res.data )

}
//注册接口
export function register(params) {
    return Axios.post('/api/cat/user/register', params).then( res => res.data )
    // return Axios({
    //     url: '/api/cat/user/register',
    //     method: 'post',
    //     data: params
    // })
}
//获取首页书籍
export function getBookList(params) {
    return Axios.get('/api/cat/book/list', { params: params }).then( res => res.data)
}
//获取书籍详情
export function getBookInfo(params) {
  return Axios.get('/api/cat/book/info', { params: params }).then( res => res.data)
}

//添加购物车
export function shopCartAdd(params) {
  return Axios.post('/api/cat/cart/add', params).then( res => res.data)
}

//获取购物车
export function getCartList(params) {
  return Axios.get('/api/cat/cart/list', { params: params }).then( res => res.data)
}

//删除购物车书籍
export function deleteCartBook(params) {
  return Axios.post('/api/cat/cart/delete', params).then( res => res.data )
}

//调整购物车书籍数量
export function cartAdjust(params) {
  return Axios.post('/api/cat/cart/adjust', params).then( res => res.data )
}

//支付
export function payment(params) {
  return Axios.post('/api/cat/order/insert', params).then( res => res.data)
}

//支付成功
export function paymentSuccessful(params) {
  return Axios.post('api/cat/order/finish', params).then( res => res.data)
}