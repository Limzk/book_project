<template>
  <div class="order">
    <div class="order_info">
      <span class="title">我的订单</span>
    </div>
    <Tabs size="small" value="1" :animated="false" @on-click="activeTab">
      <TabPane :label="allOrder" name="1" >
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=20 class="demo-spin-icon-load" ></Icon>
          <div>拼命加载中...</div>
        </Spin>
        <div v-if="list.length !== 0">
          <div class="orderInfo" v-for="(item,index) in list" :key="index">
            <table>
              <tr>
                <!-- <td>这是图片</td> -->
                <td>{{ item.orderId }}</td>
                <td>
                  <p  v-for="book in item.bookInfoVolist" :key="book.id">{{ book.bookName }}</p>
                </td>
                <td>
                  <p>{{ item.createTime | timeFilter }}</p>
                </td>
                <td>
                  <p>￥{{ item.amount }}</p>
                </td>
                <td>
                  <p>{{ item.payMethod | toMethod }}支付</p>
                </td>
              </tr>
            </table>
          </div>
          <div class="footer_page">
            <Page :total="total" size="small" show-total  @on-change="changePage" :current.sync="currentPage"/>
          </div>
          <!-- <Page :total="total" size="small" show-total @on-change="changePage" :current.sync="currentPage"/> -->
        </div>
        <div class="noOrder" v-else>
           <p>当前暂无数据</p>
        </div>   
      </TabPane>
      <!-- <TabPane :label="deliveryGoods" name="2">
        <div>
          <div class="orderInfo">
            <table>
              <tr>
                <td>这是图片</td>
                <td>122222222222222222222222222</td>
                <td>
                  <p>老人与海</p>
                  <p>老人与蛇</p>
                </td>
                <td>
                  <p>共两种书籍</p>
                  <p>2020-3-8 22:39:40</p>
                </td>
                <td>
                  <p>￥99.99</p>
                  <p>支付宝支付</p>
                </td>
              </tr>
            </table>
          </div>
          <Page :total="total" size="small" show-total />
        </div>
        <div class="noOrder" v-else>
           <p>当前暂无数据</p>
        </div>
      </TabPane> -->
      <TabPane :label="evaluation" name="3" >
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=20 class="demo-spin-icon-load" ></Icon>
          <div>拼命加载中...</div>
        </Spin>
        <div v-if="list.length !== 0">
          <div v-for="(item,index) in list" :key="index">
            <div class="orderInfo" v-for="book in item.bookInfoVoList" :key="book.id">
              <table>
                <tr>
                  <td>
                    <img :src="'http://localhost:8888'+book.bookUrl" style="width:45px; height:45px"/>
                  </td>
                  <td>{{ item.orderId }}</td>
                  <td>
                    <p>{{ book.bookName }}</p>
                  </td>
                  <td>
                    <!-- <p>共{{ item.quantity }}本书籍</p> -->
                    <p>{{ item.createTime | timeFilter }}</p>
                  </td>
                  <td>
                    <p>￥{{ book.amount }}</p>
                  </td>
                  <td>
                    <p>{{ item.payMethod | toMethod }}支付</p>
                  </td>
                  <td>
                    <Button @click="evaluate(book.id,item.orderId)" size="small" type="primary">评价</Button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div class="footer_page">
            <Page :total="total" size="small" show-total  @on-change="changePage" :current.sync="currentPage"/>
          </div>
        </div>
        <div class="noOrder" v-else>
           <p>当前暂无数据</p>
        </div>
      </TabPane>
    </Tabs>

    <!-- 组件 -->
    <evaluation-modal ref="evaluation" v-on:reload="getList"></evaluation-modal>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import EvaluationModal from "./add-evaluation";
import { parseTime } from "../../utils/parseTime";
export default {
  components:{
    EvaluationModal
  },
  data() {
    return {
      number: 0,
      queryList:{
        page: 1,
        rows: 10
      },
      total: 0,
      currentPage: 1,
      userId: 0,
      // list:[{"orderId":"428961693255598081","amount":99.0,"payTime":"1582438502559","createTime":"1582438908184","payAmount":99.0,"orderState":1,"payState":-1,"payMethod":0,"bookInfoVoList":[{"id":"323","bookTypeName":"玄幻","bookContent":"","bookName":"5","bookAuthor":"22","amount":1.0,"uploadTime":"3","bookQuantity":1,"bookUrl":"/Users/lzr/Pictures/鬼刀.jpg","quantity":12},{"id":"1414","bookTypeName":"科学","bookName":"解忧杂货店","bookAuthor":"东野圭吾","amount":6.0,"uploadTime":"1574855793754","bookQuantity":1,"bookUrl":"/Users/lzr/Pictures/鬼刀.jpg","quantity":13},{"id":"1231","bookTypeName":"玄幻","bookContent":"","bookName":"幻夜","bookAuthor":"东野圭吾","amount":2.0,"uploadTime":"1574855793754","bookQuantity":1,"bookUrl":"/Users/lzr/Pictures/cat/幻夜.jpg","quantity":14}]}],
      list:[],
      loading: false,
      allOrder: h =>{
        return h('div', [
            h('span', '全部订单 '),
            h('span',{
              style:{ color: 'red'}
            })
        ])
      },
      deliveryGoods: h =>{
        return h('div', [
            h('span', '待收货 '),
            h('span',{
              style:{ color: 'red'}
            })
        ])
      },
      evaluation: h => {
        return h('div',[
          h('span','待评价 '),
          h('span',{
            style:{ color: 'red'}
          })
        ])
      }
    }
  },
  filters:{
    timeFilter(val) {
      if(val) return parseTime(val)
    },
    toMethod(val) {
      switch (val) {
        case 0:
          return "余额"
          break;
        case 1:
          return "支付宝"
          break;
      }
    }
  },
  created() {
    this.userId = VueCookies.get('userId')
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.queryList.userId = this.userId
      this.$http.getOrderList(this.queryList).then( r => {
        this.loading = false
        this.total = r.data.totalCount
        this.total === 0 ? this.list = [] : this.list = r.data.data
      }).catch( error => {
        this.loading = false
      })
    },
    evaluate(bookId,orderId) {
      this.$refs.evaluation.show(bookId,orderId)
    },
    // 切换标签页
    activeTab(name) {
      if( name === "1"){
        this.queryList = {
          page: 1,
          rows: 10
        }
      }
      if( name === "3") {
        this.queryList = {
          page: 1,
          rows: 10,
          state: 0,
        }
      }
      this.currentPage = 1
      this.getList()
    },
    // 页码改变
    changePage(page) {
      this.queryList.page = page
      this.getList()
    },
  },
};
</script>

<style scoped>
 .order {
  /* height: 240px; */
  border: 1px solid #dcdcdc;
}
  .order .order_info {
  height: 40px;
  border-bottom: 1px solid #dcdcdc;
  background: #fafafa;
  line-height: 40px;
}
  .order .order_info .title {
  margin-left: 10px;
  border-left: 2px solid #ff2832;
  padding-left: 10px;
  /* float: right; */
}
  .order .orderInfo {
    width: 100%;
    height: 110px;
    /* background: pink; */
    padding: 0px 10px;
    font-size:11px;
    text-align: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #dee0e4
}
  .order .noOrder {
     width: 100%;
    height: 90px;
    /* background: pink; */
    padding: 0px 10px;
    font-size:13px;
    text-align: center;
    line-height: 90px;
}
/*  .order .orderInfo td:nth-child(1){
    width: 200px;
    height: 80px;
    border: 1px solid black;
} */
 .order .orderInfo td{
    width: 150px;
    height: 85px;
    /* border: 1px solid black; */
}
 .order .footer_page{
    text-align: right;
    margin-bottom: 10px;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}

</style>