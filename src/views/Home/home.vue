<template>
  <div class="layout">
    <layout  class="fixed">
      <Input  @keyup.enter.native="search" v-model="keyword" placeholder="请搜索作者名或书名" slot="search" clearable>
         <Icon type="ios-search" slot="suffix"  @click="search" />
      </Input> 
    </layout>
    <div class="container" >
        <Carousel autoplay v-model="value" class="infinite_Scroll" loop >
          <CarouselItem v-for="(item,index) in imgList" :key="index">
            <div >
              <img class="demo-img" :src="item.src" style="height:460px" />
            </div>
          </CarouselItem>
        </Carousel>
    </div>
  
  <div class="recommend-container" >
    <div class="recommend">
      <span>推荐栏目</span>
      <ul>
        <li @click="goDetail(item.bookId)" v-for="item in recommendList" :key="item.bookId">
          <div class="book-picture">
            <img :src="'http://localhost:8888'+item.bookUrl"/>
          </div>
          <div class="book-describe">
            <h4>{{ item.bookName }}</h4>
            <p>已有{{ item.thumbsUp }}人点赞</p>
            <span>{{ item.bookAuthor }}</span>
            <span style="font-weight:200">/作者</span>
            <p>￥{{ item.amount }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
    
    <div class="content">
      <!-- <div class="leftNav">
        <div class="leftHeader">
          <strong>热销排行榜</strong>
        </div>
        <div class="leftMid">
          <ul>
            <li v-for="(o) in 10" :key="o">
              <h2>{{ o }}</h2>
              <p>一万次悲伤</p>
              <p>销量：99</p>
            </li>
          </ul>
        </div>
        <div class="leftFooter"></div>
      </div> -->
      <div class="rightList">
        <div class="rightTitle">
          <span>书籍分类</span>
          <ul>
            <li v-for="item in TypeList" :key="item.index">
              <a @click="switchTo(item)" :class="{'active':item.show }">{{ item.type }}</a>
            </li>
          </ul>
        </div>
        <div class="rightPicture" >
          <div class="pictureList" @click="goDetail(item.id)" v-for="item in bookList" :key="item.id">
            <Card :bordered="false" >
              <div class="picture">
                <img :src="'http://localhost:8888'+item.bookUrl"></img>
              </div>
              <div class="bookDetail">
                <p>{{ item.bookName }}</p>
                <p>￥{{ item.amount }}元</p>
                <p>库存剩{{ item.bookQuantity }}本</p>
              </div>
            </Card>
          </div>
        </div>
        <div class="no-book" v-show="bookList.length === 0">
            <div></div>
            <h3>该分类下暂无书籍</h3>         
        </div>
      </div>

      <div class="page">
        <Page
          :total="total"
          show-total
          show-elevator
          :page-size="size"
          @on-change="changePage"
          :current.sync="currentPage"
        />
      </div>
    </div>
  </div>
</template>
<script>

import one from "../../assets/background.jpg";
import two from "../../assets/background2.jpg";
import three from "../../assets/background3.jpg";
export default {
  name: "home",
  data() {
    return {
      value: 0,
      total: 0,
      size: 12,
      bookList: [
        // { id: 1, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        // { id: 2, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        // { id: 3, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        // { id: 4, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        // { id: 5, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        // { id: 6, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        // { id: 7, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        // { id: 8, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        // { id: 9, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        // { id: 10, bookName: "老人与海", amount: 100, bookQuantity: 10 },
      ],
      recommendList: [],
      type: 0,
      TypeList: [
        { type: "全部", show: false },
        { type: "人文历史", show: false },
        { type: "小说集合", show: false },
        { type: "科学杂志", show: false },
        { type: "军事理论", show: false },
        { type: "体育教学", show: false },
        { type: "娱乐时尚", show: false },
        { type: "其他", show: false }
      ],
      imgList:[
        { src: one , type: 0 },
        { src: two , type: 1},
        { src: three, type: 2 },
      ],
      activeItem: {},
      bookType: "",
      page: 1,
      rows: 12,
      currentPage: 1,
      flag: false,
      keyword: '',
    };
  },
  created() {
    this.getRecommend()
    this.getBookList();
  },
  methods: {
    // 获取推荐列表
    getRecommend() {
      this.$http.recommend().then( r => this.recommendList = r.data)
    },
    // 获取数据列表
    getBookList() {
      // 首次进入，默认"全部"被选中
      this.bookType = sessionStorage.getItem("type");
      if (!this.bookType) {
        this.switchTo(this.TypeList[0]);
      } else {
        // 判断是否有key值，若有表示进入过详情页，标识为true
        if (sessionStorage.key("page")) this.flag = true;
        for (let i = 0; i < this.TypeList.length; i++) {
          if (this.TypeList[i].type === this.bookType) {
            this.switchTo(this.TypeList[i]);
            break;
          }
        }
      }
    },
    // 搜索功能
    search() {
      // console.log(this.keyword)
      this.TypeList.map ( item => item.show = false)
      this.TypeList[0].show = true
      this.$http
        .getBookList({
          keyword: this.keyword,
          rows: this.rows,
          page: 1,
          state: 1,
        })
        .then(res => {
          if (res.code === 10000) {
            let _data = res.data;
            this.total = _data.totalCount;
            this.bookList = _data.data;
          }
        });
    },
    // 加入购物车
    goShopping() {
      this.$router.push("shopCar");
    },
    // 进入详情页
    goDetail(id) {
      // 没点击类型进入时默认为“全部”
      if (!sessionStorage.key("type")) {
        sessionStorage.setItem("type", "全部");
      }
      // this.$router.push({ name: 'detail', params: { id : id } })
      this.$router.push({ path: "/detail", query: { id: id } });
    },

    // 页码跳转
    changePage(page) {
      // 存储页码
      sessionStorage.setItem("page", page);
      let type = sessionStorage.getItem("type");
      if (type !== "全部") {
        this.$http
          .getBookList({
            type: type,
            page: page,
            rows: this.rows,
            state: 1,
          })
          .then(res => {
            if (res.code === 10000) {
              let _data = res.data;
              this.total = _data.totalCount;
              this.bookList = _data.data;
            }
          });
      } else {
        this.$http
          .getBookList({
            page: page,
            rows: this.rows,
            state: 1
          })
          .then(res => {
            if (res.code === 10000) {
              let _data = res.data;
              this.total = _data.totalCount;
              this.bookList = _data.data;
            }
          });
      }
    },
    // 书籍类型跳转
    switchTo(item) {
      // this.TypeList.forEach(ele => {
      //   ele.show = false;
      // });
      this.TypeList.filter( ele => ele.show = false)
      item.show = true;
      sessionStorage.setItem("type", item.type);
      // 若 this.flag 为 true，定位到进入前的页码
      if (this.flag) {
        this.currentPage = parseInt(sessionStorage.getItem("page"));
      }
      // 反之重置
      else {
        sessionStorage.setItem("page", 1);
        this.currentPage = 1;
      }
      this.flag = false;
      if (item.type === "全部") {
        this.$http
          .getBookList({
            page: this.currentPage,
            rows: this.rows,
            state: 1
          })
          .then(res => {
            if (res.code === 10000) {
              let _data = res.data;
              this.total = _data.totalCount;
              this.bookList = _data.data;
            }
          });
      } else {
        this.$http
          .getBookList({
            bookType: item.type,
            page: this.currentPage,
            rows: this.rows,
            state: 1
          })
          .then(res => {
            if (res.code === 10000) {
              let _data = res.data;
              this.total = _data.totalCount;
              this.bookList = _data.data;
            }
          });
      }
    }
  }
};
</script>

<style scoped>
body{
  /* background-color: #fff; */
}
.layout {
  background: #f6f6f6;
  position: relative;
  overflow: hidden;
}
.fixed{
  position: fixed;
}
.layout .container{
  width: 100%;
  /* width: 1252px;
  margin: 0 auto; */
}
.infinite_Scroll {
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  width: 90%;
  margin: 90px auto 50px;
}
.demo-img {
  width: 100%;
}

.layout .content {
  width: 90%;
  margin: 0 auto;
  color:black;
}
.layout .recommend-container {
  /* padding-top: 2px; */
  /* background: #fff; */
}
.layout .recommend {
  width: 90%;
  margin: 20px auto;
  
  
}
.layout .recommend span{
  color: black; 
  font-size: 22px;
  font-weight: bold
}
.layout .recommend ul{
  width: 100%;
  display: flex;
  margin: 10px 0 30px;
  flex-wrap: wrap;
  justify-content: space-between;
  cursor: pointer;
}
.layout .recommend li{
  width: 420px;
  height: 190px;
  padding:15px;
  /* background: red; */
  margin: 10px 0;
  border-radius: 10px;
  display: flex;
  background: #fff;
}
.layout .recommend li:hover{
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
}
.layout .recommend li .book-picture{
  width: 150px;
}
.layout .recommend li .book-picture img{
  width: 100%;
  height: 155px;
}
.layout .recommend li .book-describe{
  width: 270px;
  /* background-color: pink; */
  padding-left: 25px;
}
.layout .recommend li .book-describe h4{
  color: #000;
  height: 45px;
}
.layout .recommend li .book-describe p:nth-of-type(1){
  font-size: 12px;
  color: #9199A1;
  text-align: left;
  line-height: 30px;
  border-bottom: 1px solid rgba(28, 31, 33, 0.1);
  margin-bottom:10px;
}
.layout .recommend li .book-describe span{
  font-size: 13px;
  /* line-height: 20px; */
  
}
.layout .recommend li .book-describe p:nth-of-type(2){
  font-size: 16px;
  color: #3377FF;
  line-height: 70px;
  font-weight: bold;
}
.content .leftNav {
  float: left;
  width: 20%;
  /* border: 2px solid #e1e1e1;
  border-top:none ;
  border-bottom:none ; */
  /* border-radius: 2%; */
  /* background: rebeccapurple; */
  /* height: 518px; */
}

.leftNav .leftHeader {
  height: 50px;
  width: 100%;
  /* background: red; */
  /* text-align: center; */
  padding-left: 15px;
  line-height: 50px;
  /* color: #d72832; */
  position: relative;
  font-size: 13px;
  font-weight: bold;
  border:2px solid #cfcfcf;
  border-top:none;
  color:#333;
}
.leftNav .leftHeader img {
  width: 45px;
  height: 45px;
  position: absolute;
  top: 5px;
  left: 5px;
}

.leftNav .leftMid ul > li {
  width: 100%;
  /* height: 45px; */
  /* line-height: 10px; */
  padding: 10px 15px;
  /* border: 1px solid black; */
  /* border-top: 1px dashed #93a26a; */
  border: 2px solid #cfcfcf;
  border-top:none;

}
.leftNav .leftMid ul > li::after {
  content: "";
  clear: both;
  display: block;
}
.leftNav .leftMid ul > li h2 {
  /* display: inline; */
  float: left;
  margin-right:21px;
  color:#333;
}
.leftNav .leftMid ul li:last-child h2 {
  margin-right:10px;
}

.leftNav .leftMid ul > li p:nth-child(2) {
  font-size: 13px;
  color: #333;
  
}
.leftNav .leftMid ul > li p:nth-child(3) {
  font-size: 10px;
  color: #ed4014;
}
/* .leftNav .leftMid ul > li span:nth-child(2) {
  float: left;
}
.leftNav .leftMid ul > li span:nth-child(3) {
  float: right;
} */
/* .leftNav .leftMid ul:last-child {
  border-bottom: 1px solid #93a26a;
} */
.content .leftFooter {
  float: left;
  height: 220px;
  width: 100%;
  /* background: red; */
  margin-top: 20px;
  background: url("../../assets/avatar.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.content .rightList {
  float: right;
  /* height: 50px; */
  width: 100%;
  overflow: hidden;
  position: relative;
  /* background: pink; */
}
.rightList .rightTitle {
  width: 100%;
  line-height:50px;
  /* border-bottom: 2px solid #C10D0C; */
  display: flex;
  /* background-color: #fff; */

}
.rightList .rightTitle span{
  width: 15%;
  color: black; 
  font-size: 22px;
  font-weight: bold
}
.rightList .rightTitle ul {
  width: 85%;
  text-align: center;
  display: flex;
  justify-content:space-between;
  
}
.rightList .rightTitle ul li {
  font-weight: bolder;
  /* border-right: 2px solid #666; */
}
.rightList .rightTitle ul li a{
  padding:5px;
}

.rightList .rightTitle ul li a:hover {
  color: #C10D0C;
}
.active {
  color: #C10D0C;
  border-bottom: 2px solid #C10D0C
}

.rightList .rightPicture {
  /* display: flex; */
  margin-top: 10px;

}
.rightList .pictureList {
  margin: 10px 0px;
  width: 18%;
  float: left;
  margin-bottom: 20px;
  /* margin-right: 4%; */
  margin-right: 2.4%;
  cursor: pointer;

}
.rightList .pictureList:nth-child(5n){
  margin-right: 0;
}
.pictureList .ivu-card {

  border-radius: 16px;
}
.pictureList .picture {
  width: 100%;
  height: 170px;
  /* border: 1px solid black; */
  /* border: 1px solid black; */
  /* background: url("../../assets/loading.jpg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center; */
}
.pictureList .picture img{
  width: 100%;
  height: 100%;
}
.pictureList .bookDetail {
  text-align: center;
  width: 100%;
  font-size: 12px;
}
.pictureList .bookDetail p {
  margin-top: 12px;
}
.pictureList .bookDetail p:nth-child(1) {
  /* margin-top: 12px; */
  font-weight: bolder;
}
.pictureList .bookDetail p:nth-child(2) {
  color: #ffa500;
}
.pictureList .bookDetail p:nth-child(3) {
  color: #eeb4b4;
}

.pictureList .bookDetail {
  /* margin-top: 8px;
  padding: 0px 10px; */
}

.pictureList .bookDetail .book span:nth-child(2) {
  float: right;
}
/* .rightList .no-book {
  width: 200px;
  height: 100px;
  background: #333;
} */
.rightList .no-book {
  height: 400px;
  display:flex;
  justify-content: center;
  align-items: center;
  /* background: #f6f6f6; */
}

.rightList .no-book div{
  width:200px;
  height:200px;
  background:url(../../assets/prompt.jpg);
  background-size:contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 20px;
}
.rightList .no-book h3{
  /* margin-left: 20px; */
  color: #000;
}
.page {
  float: right;
  text-align: right;
  margin-top: 10px;

}
</style>