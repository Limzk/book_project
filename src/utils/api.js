import Axios from 'axios';
import VueCookies from 'vue-cookies';


//设置Axios默认值
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if(VueCookies.isKey('token')) {
      config.headers['Authorization'] = VueCookies.get('token');
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


// 登录接口
export function login(params) {
    return Axios.get('/api/cat/user/login', { params: params } ).then( res => res.data )

}
// 注册接口
export function register(params) {
    return Axios.post('/api/cat/user/register', params).then( res => res.data )
}
// 获取首页书籍
export function getBookList(params) {
    return Axios.get('/api/cat/book/list', { params: params }).then( res => res.data)
}
// 获取首页未读消息数量
export function messageCount(params) {
    return Axios.get('/api/cat/message/unread/count', { params: params }).then( res => res.data)
}
// 获取首页推荐
export function recommend(params) {
  return Axios.get('/api/cat/book/recommend', { params: params }).then( res => res.data)
}
// 获取书籍详情
export function getBookInfo(params) {
  return Axios.get('/api/cat/book/info', { params: params }).then( res => res.data)
}
// 获取评论列表
export function getCommentList(params) {
  return Axios.get('/api/cat/comment/list', { params: params }).then( res => res.data)
}
// 点赞
export function thumbsUp(params) {
  return Axios.post('/api/cat/book/thumbsUp/update', params).then( res => res.data)
}
// 收藏
export function collect(params) {
  return Axios.post('/api/cat/book/collect/update', params).then( res => res.data)
}
// 添加购物车
export function shopCartAdd(params) {
  return Axios.post('/api/cat/cart/add', params).then( res => res.data)
}

// 获取购物车
export function getCartList(params) {
  return Axios.get('/api/cat/cart/list', { params: params }).then( res => res.data)
}

// 删除购物车书籍
export function deleteCartBook(params) {
  return Axios.post('/api/cat/cart/delete', params).then( res => res.data )
}

// 调整购物车书籍数量
export function cartAdjust(params) {
  return Axios.post('/api/cat/cart/adjust', params).then( res => res.data )
}

// 支付宝支付
export function payment(params) {
  return Axios.post('/api/cat/order/insert', params).then( res => res.data)
}

// 余额支付
export function payByGold(params) {
  return Axios.post('/api/cat/order/balance/insert', params).then( res => res.data)
}

// 支付成功
export function paymentSuccessful(params) {
  return Axios.post('api/cat/order/finish', params).then( res => res.data)
}

// 添加评论
export function setComment(params) {
  return Axios.post('/api/cat/comment/insert', { params: params }).then( res => res.data)
}

// 获取用户个人信息
export function getUserInfo(params) {
  return Axios.get('/api/cat/user/person/info', { params: params } ).then( res => res.data )
}
// 更换头像
export function changeAvatar(params) {
  return Axios.post('/api/cat/user/upload', params ).then( res => res.data )
}
// 余额充值
export function topUp(params) {
  return Axios.post('/api/cat/user/balance/update', params).then( res => res.data )
}
// 编辑用户个人信息
export function editUserInfo(params) {
  return Axios.post('/api/cat/user/info/update ', params ).then( res => res.data )
}
// 获取我的订单列表
export function getOrderList(params) {
  return Axios.get('/api/cat/order/all/list', { params: params } ).then( res => res.data )
}
// 添加评论
export function addComment(params) {
  return Axios.post('/api/cat/comment/insert', params ).then( res => res.data )
}
// 获取账单列表
export function billList(params) {
  return Axios.get('/api/cat/order/flow/list',{params}).then( res => res.data)
}
// 获取我的书籍列表
export function bookStateList(params) {
  return Axios.get('/api/cat/book/list', { params: params } ).then( res => res.data )
}
// 书籍状态调整
export function bookAdjust(params) {
  return Axios.post('/api/cat/book/state/adjust', params).then( res => res.data )
}
// 删除下架书籍
export function deleteBook(params) {
  return Axios.post('/api/cat/book/delete', params).then( res => res.data )
}
// 上传书籍
export function uploadBook(params) {
  return Axios.post('/api/cat/book/add', params).then( res => res.data)
}
// 编辑上架书籍
export function updateBook(params) {
  return Axios.post('/api/cat/book/update', params).then( res => res.data)
}
// 查看收藏
export function collectList(params) {
  return Axios.get('/api/cat/book/collect/list', { params:params }).then( res => res.data)
}
// 取消收藏
export function cancelCollect(params) {
  return Axios.post('/api/cat/collect/update', params).then( res => res.data)
}
// 获取消息内容
export function messageContent(params) {
  return Axios.get('/api/cat/message/list', { params:params } ).then( res => res.data)
}
// 点击消息
export function reloadMessage(params) {
  return Axios.post('/api/cat/message/adjust', params).then( res => res.data)
}