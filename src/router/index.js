import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/Home/home'
import login from '@/views/Login/login'
import register from '@/views/Register/register'
import detail from '@/views/Detail/detail'
import shopCar from '@/views/ShopCar/shopCar'
import settlement from '@/views/Settlement/settlement'
import Alipay from '@/views/PayMethod/Alipay'
import successfulByAilpay from '@/views/PaymentSuccessful/successfulByAilpay'
import successfulByGold from '@/views/PaymentSuccessful/successfulByGold'
import personalCenter from '@/views/PersonalCenter/personal-center'
import myOrder from '@/views/PersonalCenter/my-order'
import myBill from '@/views/PersonalCenter/my-bill'
import myInfo from '@/views/PersonalCenter/my-info'
import myBook from '@/views/PersonalCenter/my-book'
import myCollect from '@/views/PersonalCenter/my-collect'
import uploadBook from '@/views/PersonalCenter/upload-book'
import message from '@/views/Message/message'
import commentMessage from '@/views/Message/comment-message'
import systemMessage from '@/views/Message/system-message'
import reviewMessage from '@/views/Message/review-message'

Vue.use(Router)

export default new Router({
  //去掉地址中的哈希#
  mode: 'history',
  routes: [
    {
      path: '/',
      // name: 'home',
      component: home,
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/shopCar',
      name: 'shopCar',
      component: shopCar
    },
    {
      path: '/message',
      name: 'message',
      component: message,
      redirect: '/message/systemMessage',
      children:[
        { path: 'systemMessage' , name: 'systemMessage' ,component: systemMessage},
        { path: 'commentMessage' , name: 'commentMessage' ,component: commentMessage},
        { path: 'reviewMessage' , name: 'reviewMessage' ,component: reviewMessage},
      ]
    },
    {
      path: '/settlement',
      name: 'settlement',
      component: settlement
    },
    {
      path: '/Alipay',
      name: 'Alipay',
      component: Alipay
    },  
    {
      path: '/successfulByAilpay',
      name: 'successfulByAilpay',
      component: successfulByAilpay
    },  
    {
      path: '/successfulByGold',
      name: 'successfulByGold',
      component: successfulByGold
    },  
    {
      path: '/personalCenter',
      name: 'personal-center',
      component: personalCenter,
      redirect:'/personalCenter/myInfo',
      children:[
        { path: 'myInfo', name: 'my-info' ,component: myInfo},
        { path: 'myOrder', name: 'my-order', component: myOrder},
        { path: 'myBill', name: 'my-bill', component: myBill},
        { path: 'myBook', name: 'my-book' ,component: myBook},
        { path: 'myCollect', name: 'my-collect' ,component: myCollect},
        { path: 'uploadBook', name: 'upload-book' ,component: uploadBook},
      ]
    },  
  ]
})
