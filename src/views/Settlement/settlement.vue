<template>
  <div>
    <layout></layout>
    <div class="listing">
      <div class="list_title">
        <strong>送货清单</strong>
        <span>
          <a @click="shoppingCar" style="color:#7EC0EE">返回购物车</a>
          <!-- <a @click="detail" style="color:#7EC0EE">返回物品详情</a> -->
        </span>
      </div>
      <div class="list_book">
        <div class="book_message">
          <ul>
            <li>书本名称</li>
            <li>单价</li>
            <li>数量</li>
            <li>总价</li>
          </ul>
        </div>
        <div class="book_content" v-for="item in settlementList" :key="item.id">
          <ul>
            <li>
              <div class="book_picture">
                <img :src="'http://localhost:8888'+item.bookUrl"/>
              </div>
              <div class="book_name">
                <span>{{ item.bookName }}</span>
              </div>
            </li>
            <li>￥{{ item.amount }}</li>
            <li>{{ item.quantity}}</li>
            <li>￥{{ item.totalAmount }}</li>
          </ul>
        </div>
      </div>
      <div class="book_total">
        <span>共计：￥{{ total }}</span>
        <Button @click="show = true">立即支付</Button>
      </div>
    </div>
    <transition name="fade" >
      <div class="way" v-if="show">
        <h1>请选择支付方式</h1>
        <Button size="large" :type="type=== 0? 'error':'default'" @click="miaoPay">猫币支付</Button>
        <Button size="large" :type="type=== 1? 'error':'default'" @click="Alipay">支付宝支付</Button>
      </div>
    </transition>

    <pay-modal ref="goldPay"></pay-modal>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import PayModal from "../PayMethod/gold-pay";
export default {
  name: "settlement",
  components:{
    PayModal
  },
  data() {
    return {
      settlementList: [],
      total: 0,
      type: 0,
      show: false,
      bookList: [],
    };
  },
  created() {
    this.getCartData();
  },
  methods: {
    getCartData() {
      this.settlementList = JSON.parse(sessionStorage.getItem("data"));
      this.total = sessionStorage.getItem("price");
      // 从详情跳转过来，总价 = 共计
      if (!("totalAmount" in this.settlementList[0])) {
        this.settlementList[0].totalAmount = this.total;
      }
      // this.settlementList = this.$route.params.data
      // this.total = this.$route.params.price
    },
    shoppingCar() {
      this.$router.push("shopCar");
    },
    // pay() {
    //   this.show = true;
    // },
    // 参数存放
    setParams() {
      this.bookList = []
      this.settlementList.forEach ( e => {
        let bookInfo = {
          bookId: e.bookId,
          quantity: e.quantity,
          totalAmount: e.totalAmount
        }
        this.bookList.push(bookInfo)
      })
    },
    miaoPay() {
      this.type = 0;
      this.setParams()
      console.log(this.bookList)
      let stringBookList = JSON.stringify(this.bookList)
      this.$refs.goldPay.show(this.total,stringBookList)
    },
    // 支付宝支付
    Alipay() {
      this.type = 1;
      this.setParams()
      let stringBookList = JSON.stringify(this.bookList)
      VueCookies.set('bookList',stringBookList)
      this.$router.push("Alipay")
    },
    detail() {
      this.$router.push("detail");
    }
  }
};
</script>

<style scoped>
.listing {
  width: 80%;
  /* height: 500px; */
  /* background: pink; */
  margin: 100px auto;
  margin-bottom: 40px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}
.listing .list_title {
  width: 100%;
  height: 50px;
}
.listing .list_title strong {
  font-size: 16px;
}
.listing .list_title span {
  float: right;
}
.listing .list_book {
  width: 100%;
  /* height: 200px; */
  /* border: 1px solid black; */
}

.listing .book_message {
  width: 100%;
  height: 30px;
  background: #f5f5f5;
}
.list_book ul {
  position: relative;
}

.list_book ul li {
  float: left;
  width: 20%;
  /* border: 1px solid black; */
  text-align: center;
  line-height: 30px;
}
.list_book ul li:first-child {
  left: 20px;
  width: 40%;
}
.list_book .book_message ul li:first-child {
  padding-left: 16%;
}

.list_book .book_content {
  width: 100%;
  /* height: 170px; */
}
.list_book .book_content::after {
  content: "";
  display: block;
  clear: both;
}
.list_book .book_content ul li {
  height: 100px;
  line-height: 100px;
}
.list_book .book_content .book_picture {
  width: 40%;
  height: 100%;
  /* background: url("../../assets/book.jpg");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat; */
  /* border-right: 1px solid black; */
  float: left;
}
.list_book .book_content .book_picture img{
  width: 100%;
  height: 100%;
}
.list_book .book_content .book_name {
  width: 60%;
  height: 100%;
  /* background: blueviolet; */
  float: left;
  text-align: center;
  overflow: hidden;
}
.listing .book_total {
  background: #f1f5f8;
  width: 100%;
  height: 60px;
  /* border: 1px solid black; */
  text-align: right;
  line-height: 60px;
}
.way {
  width: 80%;
  margin: 0 auto;
  text-align: left;
}
.way h1 {
  font-size: 16px;
  color: #000;
  line-height: 22px;
  padding: 15px 0;
  font-weight: bold;
}
.way .ivu-btn {
  width: 210px;
  margin-right: 40px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>