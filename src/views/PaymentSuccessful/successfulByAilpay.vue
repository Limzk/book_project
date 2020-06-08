<template>
<div>
    <div class="menu">
        <Icon type="md-cash" size="30" class="cashIcon"/>
        <strong style="margin-left:8px;">收银台</strong>
        <a class="index" href="/home">返回首页</a>  
    </div>
    <div class="pay">
      <div class="success">
          <Icon type="md-checkmark-circle"  size="60" color="#3CB371"/>
          <span>支付成功！我们会尽快为您发货！</span>
      </div>
      <div class="purchaseInfo">
          <div class="info">
              <p>订单编号：&nbsp;{{ info.out_trade_no }}</p>
          </div>
          <div class="info">
              <p>购买金额：&nbsp;￥{{ info.total_amount }}</p>
          </div>
          <div class="info">
              <p>创建时间：&nbsp;{{ info.timestamp }}</p>
          </div>
      </div>
  </div>
</div>
  
</template>

<script>
import VueCookies from "vue-cookies";
export default {
    data() {
        return {
            info:{}
        }
    },
    created(){
        this.getRouteQuery()
    },
    methods: {
        getRouteQuery() {
            this.info = this.$route.query
            let bookList = JSON.parse(VueCookies.get('bookList'))
            // 防止页面刷新又调取接口
            VueCookies.remove('bookList')
            if(bookList) {
                this.$http.paymentSuccessful({
                    userId: VueCookies.get('userId'),
                    orderId: this.info.out_trade_no,
                    totalAmout: this.info.total_amount,
                    bookList: bookList
                }).then( r =>{
                    
                })
            }         
        }
    },
}
</script>

<style scoped>
.menu {
    padding:0 30px;
    width: 100%;
    border-bottom: 2px solid #ABABAB;
    height: 50px;
    line-height: 50px;
     /* background: #FFFFF0;     */
}
.menu .cashIcon{
    position: relative;
    top:5px;
}
.menu .index{
    float: right;
    font-weight: 600;
    font-size: 15px;
    color: #515A6E;
}
.pay{
    width: 90%;
    /* height: 600px; */
    margin: 120px auto;
    background: #f5f5f5;
    border-top: 3px solid #3CB371;
}
.success{
    width: 80%;
    /* height: 200px; */
    margin: 30px auto;
    /* background: burlywood; */
    text-align: center;

}
.success span{
    position: relative;
    top:-10px;
    color:#3CB371;
    font-weight: bolder;
}
.purchaseInfo {
    width: 80%;
    height: 150px;
    margin: 0 auto;
    /* background: yellowgreen; */
    /* text-align: center; */
    padding-left: 32%;
    margin-top: 50px;
}
.purchaseInfo  .info{
    height: 30px;
}
</style>
