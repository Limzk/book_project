<template>
  <div class="container">
    <layout></layout>
    <Breadcrumb separator=">">
      <BreadcrumbItem to="/">{{ bookType }}</BreadcrumbItem>
      <BreadcrumbItem>详情</BreadcrumbItem>
    </Breadcrumb>
    <div class="book_detail">
      <div class="book_photo" @mouseover="enter" @mouseout="leave" @mousemove="move" ref="picture">
         <!-- <img src="../../assets/book.jpg"></img> -->
         <img :src="'http://localhost:8888'+bookInfo.bookUrl"></img>
         <div class="small_box" ref="smallBox"></div>
           <div class="big_box" ref="bigBox">
             <img :src="'http://localhost:8888'+bookInfo.bookUrl" ref="bigImg" />
          </div>
      </div>

      <div class="book_describe">
          <h2>{{ bookInfo.bookName }}</h2>
        <div class="book_author">
          <p>作者：{{ bookInfo.bookAuthor }}&nbsp;&nbsp;著</p>
        </div>
        <div class="book_price">
          <span>价格</span>
          <strong>￥{{ bookInfo.amount}}</strong>
          <div class="book-quantity">
            <span>数量</span>
            <InputNumber :min="1" v-model="quantity" :max="bookInfo.bookQuantity"></InputNumber>
            <span>（库存：{{ bookInfo.bookQuantity }}）</span>
          </div>
        </div>
        
        <!-- <hr /> -->
        <div class="book_purchase">
          <div class="book-info">
            <Tooltip content="收藏" placement="top">
                <svg class="icon" aria-hidden="true" @click="collect">
                  <use :xlink:href="bookInfo.collectState === 1?'#icon-collect':'#icon-no-collect'"></use>
                </svg>
            </Tooltip>
            <Tooltip content="点赞" placement="top">
                <svg class="icon" aria-hidden="true" @click="thumbsUp">
                  <use :xlink:href="bookInfo.thumbsUpState === 1?'#icon-HaveThumbUp':'#icon-NoThumbUp'"></use>
                </svg>
                <span>{{ bookInfo.thumbsUp }}</span>
            </Tooltip>
            <Tooltip content="聊天" placement="top">
                <svg class="icon" aria-hidden="true" @click="joinChat">
                  <use xlink:href="#icon-chat"></use>
                </svg>
            </Tooltip>
            
          </div>
          <div class="book_purchase_btn">
            <!-- <Button  @click="joinChat" style="margin-right:10px;">聊天</Button> -->
            <Button type="error" @click="addShopCart">加入购物车</Button>
            <Button type="primary" @click="buyNow">立即购买</Button>
          </div>
        </div>
      </div>
    </div>

    <div class="book_comment">
      <div class="comment_title">
        <strong>书籍评论</strong>
      </div>
      <div v-if="commentList.length !== 0" >
        <div class="comment-list">
          <div class="comment_content" v-for="item in commentList">
            <Rate disabled v-model="item.score" allow-half/>
            <img :src="'http://localhost:8888'+ item.userUrl"/>
            <span>{{ item.content }}</span>
            <div class="comment_info">
              <p>{{ item.username }}</p>
              <p>{{ item.createTime | timeFilter}}</p>
            </div>
          </div>
        </div>
        <div class="book_footer">
          <Page :total="total" @on-change="changePage" simple/>
        </div>
      </div>

      <div class="book_no_comment"  v-else>
          <div></div>
          <h3>暂无更多评论</h3>   
      </div>
    </div>

    <chat-modal ref="chat"></chat-modal>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import ChatModal from "./chat";
import { parseTime } from "../../utils/parseTime";
export default {
  name: "detail",
  components:{
    ChatModal
  },
  data() {
    return {
      quantity: 1,
      bookType: "",
      bookInfo: {},
      commentList: [],
      queryList: {
        page: 1,
        rows: 10
      },
      loading: true,
      total: 0,
      //测试
      // bookInfo:
      //   {
      //     bookName: "老人与海",
      //     bookAuthor: "lim",
      //     amount: 100,
      //     bookQuantity: 12,
      //     id: 2,
      //     collectState:0
      //   },
      thumbsUpTimer:null,
      collectTimer: null,
    };
  },
  filters:{
    timeFilter(val) {
      if(val) return parseTime(val)
    }
  },
  created() {
    this.getBookId();
    this.getComment();
  },
  methods: {
    // 加入购物车
    addShopCart() {
      if(!this.isLogin()) return
      if(this.isOwn()) return
      this.$http
        .shopCartAdd({
          totalAmount: this.quantity * this.bookInfo.amount,
          quantity: this.quantity,
          bookId: this.bookInfo.id,
          userId: VueCookies.get("userId")
        })
        .then(r => {
          this.$Message.success("加入购物车成功！");
        });
    },
    // 立即购买
    buyNow() {
      if(!this.isLogin()) return
      if(this.isOwn()) return
      if(!this.havebookQuantity()) return
      this.bookInfo.quantity = this.quantity;
      this.bookInfo.bookId = this.bookInfo.id
      let settlementList = [];
      settlementList.push(this.bookInfo);
      sessionStorage.setItem("data", JSON.stringify(settlementList));
      sessionStorage.setItem("price", this.bookInfo.amount * this.quantity);
      this.$router.push("settlement");
    },
    joinChat() {
      this.$refs.chat.show()
    },
    // 判断是否已登录
    isLogin() {
      if(!VueCookies.isKey("userId")){
        this.$Message.error({
          background: true,
          content: '请先登录！'
        });
        return false
      }
      else{
        return true
      }
    },
    // 判断是否为自己发布的
    isOwn() {
      if(this.bookInfo.uploadUserId === VueCookies.get("userId")) {
        this.$Message.warning({
          background: true,
          content: '不能对自己发布的书籍进行添加购物车或购买！'
        });
        return true
      }
      else {
        return false
      }
    },
    // 判断库存是否为0
    havebookQuantity() {
      if(this.bookInfo.bookQuantity === 0) {
        this.$Message.warning({
          background: true,
          content: '当前书籍库存不足，不能购买！'
        })
        return false
      }
      else {
        return true
      }
    },
    // 获取书籍信息
    getBookId() {
      this.bookType = sessionStorage.getItem("type");
      // this.id = this.$route.params.id
      this.id = this.$route.query.id;
      this.queryList.bookId = this.id;
      this.$http.getBookInfo({ bookId: this.id }).then(res => {
        if (res.code === 10000) {
          this.bookInfo = res.data;
        }
      });
    },
    // 获取评论列表
    getComment() {
      this.$http.getCommentList(this.queryList).then(r => {
        if (r.code === 10000) {
          this.total = r.data.totalCount;
          this.commentList = r.data.data;
        }
      });
    },
    //点赞
    thumbsUp(){
      if(!this.isLogin()) return
      if(this.bookInfo.thumbsUpState === 0) {
        this.bookInfo.thumbsUp ++
        this.bookInfo.thumbsUpState = 1
      }
      else{
        this.bookInfo.thumbsUp --
        this.bookInfo.thumbsUpState = 0
      }
      this.setThumbsUpTime({
        bookId: this.id,
        userId: VueCookies.get("userId"),
        state:  this.bookInfo.thumbsUpState,
        thumbsUp: this.bookInfo.thumbsUp
      })
    },
    //收藏
    collect() {
      if(!this.isLogin()) return
      this.bookInfo.collectState === 0? this.bookInfo.collectState = 1:this.bookInfo.collectState = 0
      if(this.bookInfo.collectState) {
        this.$Message.success({
          background: true,
          content: '收藏成功！'
        });
      }
      this.setCollectTime({ 
        bookId: this.id,
        userId: VueCookies.get("userId"),
        state: this.bookInfo.collectState
      })
    },
    // 点赞防抖
    setThumbsUpTime(params) {
      if(this.thumbsUpTimer) {
        clearTimeout(this.thumbsUpTimer)
      }
      this.thumbsUpTimer = setTimeout( () =>{
        this.thumbsUpTimer = null
        this.$http.thumbsUp(params).then( r => {})
      },1000)
    },
    // 收藏防抖
    setCollectTime(params) {
      if(this.collectTimer) {
        clearTimeout(this.collectTimer)
      }
      this.collectTimer = setTimeout( () =>{
        this.collectTimer = null
        this.$http.collect(params).then( r => {})
      },1000)
    },
    // 页码改变
    changePage(page) {
      this.queryList.page = page;
      this.getComment();
    },
     enter() {
      this.$refs.smallBox.style.display = 'block'
      this.$refs.bigBox.style.display = 'block'
    },
    leave() {
      this.$refs.smallBox.style.display = 'none'
      this.$refs.bigBox.style.display = 'none'
    },
    move(event) {
      let picture = this.$refs.picture
      let smallBox = this.$refs.smallBox
      let bigBox = this.$refs.bigBox
      let bigImg = this.$refs.bigImg
      // 鼠标相对于body的坐标 - 图片相对于body的坐标 = 鼠标在图片中移动的坐标
      let x = event.pageX - this.$refs.picture.offsetLeft
      let y = event.pageY - this.$refs.picture.offsetTop
      // 遮挡层移动距离(设置鼠标在box的正中央)
      let smallMoveX = x - smallBox.offsetWidth/2 
      let smallMoveY = y - smallBox.offsetHeight/2
      // 遮挡层最大移动距离
      let smallMaxMoveX = picture.offsetWidth - smallBox.offsetWidth
      let smallMaxMoveY = picture.offsetHeight - smallBox.offsetHeight
      // 遮挡层最小和最大移动距离
      if(smallMoveX <= 0) {
        smallMoveX = 0
      }else if(smallMoveX >= smallMaxMoveX ) {
        smallMoveX = smallMaxMoveX
      }
      if(smallMoveY <= 0) {
        smallMoveY = 0
      }else  if(smallMoveY >= smallMaxMoveY ) {
        smallMoveY = smallMaxMoveY
      }
      smallBox.style.left = smallMoveX + 'px'
      smallBox.style.top = smallMoveY +'px'
      // 大图片最大移动距离
      let bigMaxMoveX = bigBox.offsetWidth 
      let bigMaxMoveY = bigBox.offsetHeight 
      // 大图片的移动距离 = 遮挡层移动的距离 * 大图片最大移动距离  / 遮挡层最大移动距离
      let bigMoveX = bigMaxMoveX * smallMoveX / smallMaxMoveX
      let bigMoveY = bigMaxMoveY * smallMoveY / smallMaxMoveY
      bigImg.style.left = -bigMoveX +1+'px'
      bigImg.style.top = -bigMoveY +1+'px'     
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #f6f6f6;
}
.ivu-breadcrumb {
  /* margin: 40px 20px; */
  margin-left: 20px;
  line-height: 100px;
}
.book_detail {
  width: 70%;
  /* margin-left: 15%; */
  margin: 0 auto;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  padding: 30px;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: #fff;
}
.book_detail::after {
  content: "";
  display: block;
  clear: both;
}

.book_detail .book_photo {
  float: left;
  width: 35%;
  height: 340px;
  position: relative;
}
.book_detail .book_photo img{
  width: 100%;
  height: 100%;
}
.book_detail .book_photo .small_box {
  width: 40%;
  height: 40%;
  background: #fede4f;
  opacity: .5;
  position: absolute;
  top: 0;
  left: 0;
  display:none;
  cursor:move;
}
.book_detail .book_photo .big_box {
  width:580px;
  height:600px;
  background:#fff;
  position:absolute;
  top:-100px;
  left:100%;
  z-index:999;
  display:none;
  overflow:hidden;
  /* border-left: 1px solid #ccc; */
}
.book_detail .book_photo .big_box img{
  position:absolute;
  top:0px;
  left:0px;
  transform: scale(2);
  transform-origin: 0 0;
}

.book_detail .book_describe {
  float: right;
  width: 60%;
  height: 340px;
  /* padding: 0 5px; */
  position: relative;
}
.book_describe h2 {
  line-height: 50px;
  border-bottom: 2px solid #ccc;
}
.book_describe .book_author {
  line-height: 60px;
  /* background: black; */
}
.book_describe .book_price {
  line-height: 50px;
  position: absolute;
  top:55%;
  transform: translateY(-50%);
  
}
.book_describe .book_price strong{
  line-height: 50px;
  color: #e42528;
  margin-left: 10px;
  font-size: 20px;
}
.book_describe .book_price .book-quantity{
  
}
.book_describe .book_price .book-quantity .ivu-input-number{
  margin-left: 14px;
}
.book_describe .book_price .book-quantity span:nth-child(3){
   /* margin-left: 20px; */
  color: #ffd081;
  font-weight: bolder;
}

.book_describe .book_purchase {
  width: 100%;
  position: absolute;
  bottom: 0;
  display:flex;
  justify-content:space-between;
  flex-wrap: nowrap;
  /* align-items: center; */
}
/* .book_describe .book_purchase .book-info .ivu-btn{
      box-shadow: none;
      padding: none !important;
} */
.book_describe .book_purchase .book-info .icon{
  font-size:28px;
  cursor: pointer;
  margin-right: 5px;

}
.book_describe .book_purchase .book-info span{
  font-size:16px;
}

.book_comment {
  width: 70%;
  margin-top: 20px;
  margin-left: 15%;
  
}
.book_comment .comment_title {
  width: 100%;
  /* background: #f0f0f0; */
  text-align: left;
  line-height: 80px;
}
.book_comment .comment-list {
  box-shadow: 0 4px 8px 0 rgba(28,31,33,.1);
  padding: 10px 20px;
  border-radius: 12px;
  background-color: #fff;
}
.book_comment .comment_content {
  width: 100%;
  border-bottom:1px solid rgba(56,61,66,.1)
}
.book_comment .comment_content:last-child{
  border: none;
}

.book_comment .comment_content .ivu-rate {
  margin: 10px 0;
  display: block;
  /* text-align: right; */
  /* float: right; */
}
.book_comment .comment_content img {
  border-radius: 50%;
  height: 50px;
  width: 50px;
  position: relative;
  top:15px;
}
.book_comment .comment_content span {
  margin-left: 20px;
}
.book_comment .comment_content .comment_info {
  margin-top: 30px;
  height: 50px;
  width: 100%;
  /* background:darkcyan; */
  line-height: 50px;
  display: flex;
  justify-content: space-between;
}
.book_comment .comment_content .comment_info p:nth-child(1) {
  margin-left: 15px;
  color:seagreen;
}

.book_footer {
  text-align: right;
  height: 60px;
  line-height: 60px;
}
.book_no_comment {
  /* height: 100px; */
  /* margin-top: 20px; */
  /* background: #f0f0f0; */
  /* text-align: center;
  line-height: 100px;
  font-weight: 520; */
  /* color: #EE7600; */
  height: 400px;
  display:flex;
  justify-content: center;
  align-items: center;
}
.book_no_comment div{
  width:200px;
  height:200px;
  background:url(../../assets/prompt.jpg);
  background-size:contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 20px;
}
.book_no_comment h3{
  
  color:black;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
</style>