import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/Home/home'
import login from '@/views/Login/login'
import register from '@/views/Register/register'
import detail from '@/views/Detail/detail'
import personal from '@/views/PersonalCentral/personalCentral'
import personalMessage from '@/views/PersonalCentral/personalMessage'
import rentObject from '@/views/RentObject/rentObject'
import myPublish from '@/views/MyPublish/myPublish'
import shopCar from '@/views/ShopCar/shopCar'
import settlement from '@/views/Settlement/settlement'
import payment from '@/views/Payment/payment'
import pay from '@/views/Pay/pay'
import paymentSuccessful from '@/views/PaymentSuccessful/paymentSuccessful'



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
      path: '/personal',
      component: personal,
      children:[
        { path: '/personalMessage', name:'personalMessage', component: personalMessage},
        { path: '/myPublish', name:'myPublish', component: myPublish},
      ]
    },
    {
      path: '/rentObject',
      name: 'rentObject',
      component: rentObject
    },
    {
      path: '/shopCar',
      name: 'shopCar',
      component: shopCar
    },
    {
      path: '/settlement',
      name: 'settlement',
      component: settlement
    },
    {
      path: '/payment',
      name: 'payment',
      component: payment
    },  
    {
      path: '/pay',
      name: 'pay',
      component: pay
    },  
    {
      path: '/paymentSuccessful',
      name: 'paymentSuccessful',
      component: paymentSuccessful
    },  
  ]
})
