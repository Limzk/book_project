<template>
  <div>
    <layout></layout>
    <Breadcrumb separator=">">
      <BreadcrumbItem to="/">{{ bookType }}</BreadcrumbItem>
      <BreadcrumbItem>详情</BreadcrumbItem>
    </Breadcrumb>
    <div class="book_detail">
      <!-- <div class="book_photo" style=" background: url('../../assets/book.jpg') ">
        
      </div> -->
      <div class="book_photo" :style="{ backgroundImage: 'url(' + picUrl + ')'}" style="background-repeat: no-repeat; background-size: contain; background-position: center;">
        
      </div>
      <div class="book_describe">
        <div class="book_name">
          <h2>{{ bookInfo.bookName }}</h2>
        </div>
        <hr />
        <div class="book_author">
          <p>作者：{{ bookInfo.bookAuthor }}&nbsp;&nbsp;著</p>
        </div>
        <div class="book_price">
          <strong>￥{{ bookInfo.amount}}</strong>
        </div>
        <hr />
        <div class="book_purchase">
          <InputNumber :min="1" v-model="quantity" :max="bookInfo.bookQuantity"></InputNumber>
          <p>库存：{{ bookInfo.bookQuantity }}</p>
          <div class="book_purchase_btn">
            <Button type="error" @click="addShopCart">加入购物车</Button>
            <Button type="info" @click="buyNow">立即购买</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
  name: "detail",
  data() {
    return {
      quantity: 1,
      bookType: '',
      bookInfo: {},
      picUrl: '../../assets/book.jpg',
      //测试
      // bookInfo: 
      //   {
      //     bookName: "老人与海",
      //     bookAuthor: "lim",
      //     amount: 100,
      //     bookQuantity: 12,
      //     id: 2
      //   }
    };
  },
  created() {
    this.getBookId();
  },
  methods: {
    addShopCart() {
      if (!VueCookies.isKey("userId")) {
        this.$Message.warning("请先登录！");
        return;
      }
      this.$http.shopCartAdd({
        bookId: this.bookInfo.bookId,
        userId: VueCookies.get('userId')
      }).then( r => {
        this.$Message.success("加入购物车成功！");
      })

    },
    buyNow() {
      if(!VueCookies.isKey("userId")){
        this.$Message.warning('请先登录！');
        return
      }
      this.bookInfo.quantity = this.quantity;
      let settlementList = []
      settlementList.push(this.bookInfo)
      sessionStorage.setItem("data", JSON.stringify(settlementList));
      sessionStorage.setItem("price", this.bookInfo.amount * this.quantity);
      this.$router.push("settlement");

    },
    getBookId() {
      this.bookType = sessionStorage.getItem("type")
      this.id = this.$route.query.id;
      this.$http.getBookInfo({ bookId: this.id }).then(res => {
        if (res.code === 10000) {
          this.bookInfo = res.data;
        }
      });
    }
  }
};
</script>

<style scoped>
.ivu-breadcrumb{
  margin: 40px 20px;
}
.book_detail {
  width: 70%;
  /* height: 600px; */
  /* background: pink; */
  margin-left: 15%;
  /* margin-top: 30px; */
  /* padding: 50px; */
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}
.book_detail::after {
  content: "";
  display: block;
  clear: both;
}

.book_detail .book_photo {
  float: left;
  width: 40%;
  height: 420px;
  /* background: url("../../assets/book.jpg"); */
  /* background-repeat: no-repeat;
  background-size: contain;
  background-position: center; */
  /* border: 1px solid black; */
}
.book_detail .book_describe {
  float: right;
  width: 55%;
  height: 420px;
  /* background: olivedrab; */
  padding: 0 5px;
  /* border-left: 1px solid black; */
  /* border-radius: 3%; */
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}
.book_describe .book_name {
  height: 60px;
  /* background: black; */
}
.book_describe .book_author {
  height: 60px;
  /* background: black; */
}
.book_describe .book_price {
  color: #e42528;
  font-size: 26px;
  margin-top: 80px;
  margin-bottom: 119px;
  /* background: black; */
}
.book_describe .book_purchase {
  /* margin-bottom: 0px; */
  height: 60px;
  /* background: black;  */
  position: relative;
}
.book_describe .book_purchase .ivu-input-number {
  position: absolute;
  bottom: 10px;
}
.book_describe .book_purchase p {
  position: absolute;
  bottom: 18px;
  left: 100px;
  color: #ffd081;
  font-weight: bolder;
}
.book_describe .book_purchase .book_purchase_btn {
  position: absolute;
  bottom: 10px;
  right: 0px;
}
</style>