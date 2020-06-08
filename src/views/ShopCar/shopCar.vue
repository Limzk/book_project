<template>
  <div>
    <layout></layout>
    <div class="content" v-if="cartBookList.length != 0">
      <div class="shop_detail">
        <div class="shop_title">
          <ul>
            <li>
              <Checkbox v-model="checks" @on-change="checkAll">全选</Checkbox>
            </li>
            <li>书本名称</li>
            <li>库存量</li>
            <li>单价（元）</li>
            <li>数量</li>
            <li>总额（元）</li>
            <li>操作</li>
          </ul>
        </div>
        <div class="shop_content">
          <Card :bordered="false" style="height:100%;">
            <!-- <p><Checkbox v-model="check"></Checkbox></p>            -->
            <div v-for="item in cartBookList" :key="item.id">
              <div class="shop_book">
                <ul>
                  <li>
                    <Checkbox v-model="item.check" @on-change="checkOne(item)">
                      <span></span>
                    </Checkbox>
                  </li>
                  <li>
                    <img :src="'http://localhost:8888'+item.bookUrl"/>
                  </li>
                  <li>{{item.bookName}}</li>
                  <li>{{item.bookQuantity}}</li>
                  <li>￥{{item.amount}}</li>
                  <li> 
                    <InputNumber :min="1" :max="item.bookQuantity" v-model="item.quantity" @on-change="changNum(item)"></InputNumber>
                  </li>
                  <li>￥{{item.totalAmount}}</li>
                  <li> 
                    <Button type="primary" shape="circle" icon="ios-trash" @click="remove(item)"></Button>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
        <p>合计：￥{{ total }}</p>
        <div class="shop_total">
            <Tag color="blue" >
              <a  @click="batchDelete">批量删除</a>  
            </Tag>
          <i-button type="primary" size="large" @click="settlement">结算</i-button>
        </div>
      </div>
    </div>
    <div class="no_content" v-else>
      <div class="shop_cart_picture"></div>
      <div class="shop_cart_describe">
        <p>您的购物车还是空的，您可以：</p>
        <Button type="primary" @click="goHome">去逛逛</Button>
      </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
  name:"shopCar",
  data() {
    return {
      checks: false,
      check: false,
      cartBookList: [],
      // cartBookList: [
      //   {
      //     bookId: 1,
      //     bookName: "老人与海",
      //     bookQuantity:0,
      //     amount: 100,
      //     quantity: 2,
      //     totalAmount: 200,
      //     check: false
      //   },
      //   {
      //     bookId: 2,
      //     bookName: "老人与蛇",
      //     bookQuantity:20,
      //     amount: 100,
      //     quantity: 2,
      //     totalAmount: 200,
      //     check: false
      //   },
      // ],
      total: 0,
      checkBookList: []
    };
  },
  created() {
    this.getShopCart();
  },
  methods: {
    //获取购物车数据
    getShopCart() {
      this.$http.getCartList({
        userId:VueCookies.get('userId')
      }).then(res => {
        if (res.code === 10000) {
          this.cartBookList = res.data.data;
          this.cartBookList.forEach(ele => {
            ele.check = false;
          });
        }
      });
    },
    //进入结算页面
    settlement() {
      this.clickCheckBox().then(() => {
        let flag = false
        this.checkBookList.some( item =>{
          if(item.bookQuantity === 0){
            this.$Message.warning(`当前书籍《${item.bookName}》库存为0,请重新选择`)
            flag = true
          }
        })
        if(flag) return
        // this.$router.push({ name: 'detail', params: { id : id } })
        this.$router.push("/settlement");
        sessionStorage.setItem("data", JSON.stringify(this.checkBookList));
        sessionStorage.setItem("price", this.total);
      });
    },
    //全选
    checkAll() {
      if (this.checks) {
        this.cartBookList.forEach(ele => {
          ele.check = true;
          this.total += ele.totalAmount;
        });
      } else {
        this.cartBookList.forEach(ele => {
          ele.check = false;
        });
        this.total = 0;
      }
    },
    //单选
    checkOne(item) {
      if (item.check) {
        this.total += item.totalAmount;
        this.checks = true;
        this.cartBookList.forEach(ele => {
          if (!ele.check) this.checks = false;
        });
      } else {
        this.checks = false;
        this.total -= item.totalAmount;
      }
    },
    //调整数量
    changNum(item) {
      this.$http.cartAdjust( {
        quantity: item.quantity, 
        bookId: item.bookId,
        userId: VueCookies.get("userId"),
      }).then( r => {
        // this.cartBookList.forEach( ele =>{
        //   if(ele.bookId === item.bookId) {
        //    ele.quantity = r.data.quantity
        //    ele.totalAmount = r.data.totalAmount
        //   }
        // })
        this.cartBookList.find( ele =>{
          if(ele.bookId === item.bookId) {
            ele.quantity = r.data.quantity
            ele.totalAmount = r.data.totalAmount
          }
        })
      })
    },
    //单删
    remove(item) {
      this.$Modal.confirm({
        title: "提示",
        content: `是否从购物车中删除《${item.bookName}》?`,
        onOk: () => {
          let bookIds = []
          bookIds.push(item.bookId)
          this.$http
            .deleteCartBook({
              userId: VueCookies.get("userId"),
              bookIds: bookIds
            })
            .then(res => {
              this.$Message.success({
                background: true,
                content: "删除成功！"
              });
               for (let i = 0; i < this.cartBookList.length; i++) {
                if (this.cartBookList[i].bookId === item.bookId) {
                  this.cartBookList.splice(i, 1);
                  break;
                }
              }
              this.total = 0;
            });
        },
        onCancel: () => {
         
        }
      });
    },
    // 选择书籍
    clickCheckBox() {
      return new Promise(resovle => {
        this.checkBookList = [];
        this.cartBookList.forEach(ele => {
          if (ele.check) this.checkBookList.push(ele);
        });
        if (this.checkBookList.length === 0) {
          this.$Message.error({
            background: true,
            content: "请先选择书籍！"
          });
          return;
        }
        resovle();
      });
    },
    //批量删除
    batchDelete() {
      this.clickCheckBox().then(() => {
        this.$Modal.confirm({
          title: "提示",
          content: "是否从购物车中删除所选书籍?",
          onOk: () => {
            let bookIds = []
            this.checkBookList.forEach( e => {
              bookIds.push( e.bookId )
            })
            this.$http
              .deleteCartBook({
                userId: VueCookies.get("userId"),
                bookIds: bookIds
              })
              .then(res => {
                this.$Message.success({
                  background: true,
                  content: "删除成功！"
                });
                for (let i = 0; i < this.checkBookList.length; i++) {
                  for (let j = 0; j < this.cartBookList.length; j++) {
                    if ( this.checkBookList[i].bookId === this.cartBookList[j].bookId) {
                      this.cartBookList.splice(j, 1);
                      break;
                    }
                  }
                }
                this.total = 0;
              });
          },
          onCancel: () => {
 
          }
        });
      });
    },
    goHome() {
      this.$router.push("home");
    }
  }
};
</script>

<style scoped>
.content {
  width: 70%;
  /* background: pink; */
  /* height: 1000px; */
  margin: 100px auto;
}
.content .shop_detail {
  width: 100%;
  height: 500px;
  /* background: blue; */
  /* border: 1px solid black; */
}
.content .shop_detail .shop_title {
  width: 100%;
  height: 50px;
  /* background: blueviolet; */
  background: #f5f5f5;
}

.content .shop_detail .shop_title li{
  float: left;
  width: 10%;
  text-align: center;
  line-height: 50px;
  /* background: red; */
}

.content .shop_detail .shop_title li:nth-child(2){
  width: 38%;
  padding-left: 11%;
}
.content .shop_detail .shop_title li:nth-child(6){
  padding-left: 1%;
}

.ivu-checkbox-wrapper {
  margin-right: 13px;
}
.content .shop_detail .shop_content {
  width: 100%;
  /* height: 300px; */
  /* background: black; */
  margin: 50px 0px;
}
.content .shop_detail .shop_content .ivu-card {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.shop_detail .shop_content .shop_book {
  width: 100%;
  /* margin-top: -10px; */
  margin-left: -6px;
}
.shop_detail .shop_content .shop_book ul{
 height: 120px;
}
.shop_detail .shop_content .shop_book li{
  float: left;
  width: 10%;
  text-align: center;
  height: 100px;
  line-height: 120px;
}
.shop_detail .shop_content .shop_book li img{
  width: 100%;
  height: 100%;
  margin-top: 10px;
}
.shop_detail .shop_content .shop_book li:nth-child(1){
  width: 5%;
}
.shop_detail .shop_content .shop_book li:nth-child(2){
  width: 15%;
  /* background: url("../../assets/book.jpg");
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat; */
}
.shop_detail .shop_content .shop_book li:nth-child(3){
  width: 29%;
}
.shop_detail .shop_content .shop_book li:nth-child(6){
  width: 11%;
  padding-left: 1%;
}

.content .shop_detail .shop_total {
  width: 100%;
  height: 50px;
  background: #f5f5f5;
  text-align: center;
}
.content .shop_detail .shop_total .ivu-tag {
  float: left;
  margin-top: 13px; 
}
.content .shop_detail .shop_total .ivu-tag a {
  color: #2d8cf0
}
.content .shop_detail .shop_total a:hover {
  color: #92c2f4;
}
.content .shop_detail .shop_total .ivu-btn {
  width: 200px;
}

.no_content {
  width: 55%;
  margin: 200px auto;
  /* height: 200px; */
}
.no_content .shop_cart_picture {
  width: 60%;
  background: url("../../assets/shopCart.jpg");
  /* border: 1px solid black; */
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  float: left;
  height: 200px;
}
.no_content .shop_cart_describe {
  width: 40%;
  /* background: red; */
  float: right;
  height: 200px;
  /* text-align: center; */
  padding-top: 70px;
}
.no_content .shop_cart_describe p {
  font-weight: bolder;
}
.no_content .shop_cart_describe .ivu-btn {
  margin-top: 25px;
  margin-left: 15%;
}
</style>