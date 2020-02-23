<template>
  <div class="layout">
    <layout v-on:searchContent="search"></layout>
    <div>
      <Carousel autoplay v-model="value" class="infinite_Scroll" loop>
        <CarouselItem>
          <div>
            <img class="demo-img" src="../../assets/picture.jpg" style="height:450px" />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div class="demo-carousel">
            <img class="demo-img" src="../../assets/picture2.jpg" style="height:450px" />
            <!-- <img  /> -->
          </div>
        </CarouselItem>
        <CarouselItem>
          <div>
            <img class="demo-img" src="../../assets/picture3.jpg" style="height:450px" />
          </div>
        </CarouselItem>
      </Carousel>
    </div>
    <!-- <div class="layout-copy">2011-2016 &copy; TalkingData</div> -->
    <div class="content">
      <div class="leftNav">
        <div class="leftHeader">
          <img src="../../assets/flower.jpg" />
          <strong>热销排行榜</strong>
        </div>
        <div class="leftMid">
          <ul>
            <li v-for="(o) in 10" :key="o">
              <h2>1.</h2>
              <span>lzk自传</span>
              <span>销量：999</span>
            </li>
          </ul>
        </div>
        <div class="leftFooter"></div>
      </div>

      <div class="rightList">
        <div class="rightTitle">
          <ul>
            <li v-for="item in TypeList" :key="item.index">
              <a @click="switchTo(item)" :class="{'active':item.show }">{{ item.type }}</a>
            </li>
            <!-- <li >
              <strong>人物历史</strong>
            </li>-->
          </ul>
        </div>

        <div class="rightPicture" v-for="item in bookList" :key="item.id">
          <div class="pictureList" @click="goDetail(item.id)">
            <Card :bordered="false" style="height:280px;">
              <div class="picture"></div>
              <div class="bookDetail">
                <p>{{ item.bookName }}</p>
                <p>￥{{ item.amount }}元</p>
                <p>库存仅剩{{ item.bookQuantity }}本</p>
              </div>
            </Card>
          </div>
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

export default {
  name: "home",
  data() {
    return {
      value: 0,
      total: 33,
      size: 12,
      bookList: [
        { id: 1, bookName: "老人与海", amount: 100, bookQuantity: 10 },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {}
      ],
      // bookList: [],
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
      activeItem: {},
      bookType: "",
      page: 1,
      rows: 12,
      currentPage: 1,
      flag: false
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
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
    search(data) {
      this.$http
        .getBookList({
          keyword: data,
          rows: this.rows,
          page: 1
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
            rows: this.rows
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
            rows: this.rows
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
      this.TypeList.forEach(ele => {
        ele.show = false;
      });
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
            rows: this.rows
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
            rows: this.rows
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
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}

.infinite_Scroll {
  /* height: 350px; */
  overflow: hidden;
  /* padding: 0 5px; */
}
.infinite_Scroll .demo-carousel img {
  /* background: url("../../assets/background.jpg") */
  /* background: red; */
}
.demo-img {
  width: 100%;
}

.layout .content {
  height: 900px;
  width: 100%;
  padding: 0 5px;
  /* background: yellowgreen; */
}
.content .leftNav {
  float: left;
  width: 20%;
  border: 1px solid black;
  border-radius: 2%;
  /* background: rebeccapurple; */
  height: 518px;
}

.leftNav .leftHeader {
  height: 60px;
  width: 100%;
  /* background: red; */
  text-align: center;
  line-height: 60px;
  color: #d72832;
  position: relative;
  font-size: 16px;
  font-weight: bold;
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
  line-height: 45px;
  padding-left: 15px;
  padding-right: 15px;
  /* border: 1px solid black; */
  border-top: 1px dashed #93a26a;
}
.leftNav .leftMid ul > li::after {
  content: "";
  clear: both;
  display: block;
}
.leftNav .leftMid ul > li h2 {
  /* display: inline; */
  float: left;
}
.leftNav .leftMid ul > li span:nth-child(2) {
  float: left;
}
.leftNav .leftMid ul > li span:nth-child(3) {
  float: right;
}
/* .leftNav .leftMid ul:last-child {
  border-bottom: 1px solid #93a26a;
} */
.content .leftFooter {
  float: left;
  height: 280px;
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
  height: 965px;
  width: 79%;
  overflow: hidden;
  /* background: rebeccapurple; */
}
.rightList .rightTitle {
  width: 100%;
  height: 60px;
  /* background: black; */
  /* border: 1px solid #538278; */
  /* background: #333333; */
  background-color: #ffd84d;
}
.rightList .rightTitle ul {
  text-align: center;
  line-height: 60px;
}
.rightList .rightTitle ul li {
  float: left;
  width: 12%;
  font-weight: bolder;

  /* color: #666; */
  /* border: 1px solid #538278; */
  /* border-right: 1px solid black; */
}
.rightList .rightTitle ul li a:hover {
  color: #222;
  /* color:#d6d6d6 */
}
.rightList .rightTitle ul li a {
  /* color: #222; */
  /* color:#bcbcbc; */
}
.active {
  font-size: 20px;
  height: 28px;
  line-height: 28px;
  font-family: PingFangSC-Semibold;
  font-weight: 700;
  color: #222;

  border-bottom: 2px solid black;
  padding-bottom: 5px;
}

.photoContent {
  background: #d72832;
}
.rightList .rightPicture {
  margin: 10px 0px;
}

.rightList .pictureList {
  width: 23%;
  float: left;
  margin-bottom: 20px;
  margin-right: 2%;
  cursor: pointer;
}
.pictureList .ivu-card-head {
  border-bottom: none;
}
.pictureList .picture {
  width: 100%;
  height: 165px;
  /* border: 1px solid black; */
  /* border: 1px solid black; */
  background: url("../../assets/book.jpg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.pictureList .bookDetail {
  text-align: center;
  width: 100%;
}
.pictureList .bookDetail p:nth-child(1) {
  margin-top: 12px;
  font-weight: bolder;
}
.pictureList .bookDetail p:nth-child(2) {
  color: #ffa500;
}
.pictureList .bookDetail p:nth-child(3) {
  color: #eeb4b4;
}
.pictureList .bookDetail p {
  margin-bottom: 6px;
}
.pictureList .bookDetail {
  margin-top: 8px;
  padding: 0px 10px;
}

.pictureList .bookDetail .book span:nth-child(2) {
  float: right;
}
.page {
  float: right;
  text-align: right;
  margin-right: 50px;
}
</style>