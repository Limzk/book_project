<template>
  <div class="book">
    <div class="book_info">
      <span class="title">我的书籍</span>
    </div>
    <Tabs size="small" value="1" :animated="false" @on-click="activeTab">
      <TabPane :label="upBook" name="1">
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=20 class="demo-spin-icon-load" ></Icon>
          <div>拼命加载中...</div>
        </Spin>
        <div v-if="list.length !== 0">
          <div class="bookInfo" v-for="(item,index) in list" :key="index">
            <table>
              <tr>
                <td>
                  <img :src="'http://localhost:8888'+item.bookUrl"></img>
                </td>
                <td>
                  <p>《{{ item.bookName}}》</p>
                  <p> {{ item.bookAuthor}} </p>
                </td>
                <td>
                  <p>{{ item.uploadTime | timeFilter}}</p>
                </td>
                <!-- <td>
                  <p>数量：{{ item.bookName}}</p>
                </td> -->
                <td>
                  <!-- 库存不是不是上架数量 -->
                  库存：{{ item.bookQuantity}} 
                </td>
                <td>
                  <p>价格：￥{{ item.amount }} </p>  
                </td>
                <td>
                  <Button size="small" @click="edit(item)" type="primary">编辑</Button>
                  <Button size="small" @click="down(item)" type="primary">下架</Button>
                </td>
              </tr>
            </table> 
          </div>
         <div class="footer_page">
            <Page :total="total" size="small" show-total  @on-change="changePage" :current.sync="currentPage"/>
          </div>
        </div>
        <div class="noBook" v-else>
           <p>当前暂无数据</p>
        </div>
        
      </TabPane>
      <TabPane :label="aduditBook" name="2">
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=20 class="demo-spin-icon-load" ></Icon>
          <div>拼命加载中...</div>
        </Spin>
        <div v-if="list.length !== 0">
          <div class="bookInfo" v-for="(item,index) in list" :key="index">
            <table>
            <tr>
                <td>
                  <img :src="'http://localhost:8888'+item.bookUrl"></img>
                </td>
                <td>
                  <p>《{{ item.bookName}}》</p>
                  <p> {{ item.bookAuthor}} </p>
                </td>
                <td>
                  <p>库存：{{ item.bookQuantity}} </p>  
                </td>
                <td>
                  <p>价格：￥{{ item.amount }} </p>  
                </td>
                <td>
                  <p>{{ item.uploadTime | timeFilter }}</p>
                </td>
                <td>
                  <Button size="small" @click="down(item)" type="primary">下架</Button>
                </td>
              </tr>
            </table>
          </div>
          <div class="footer_page">
            <Page :total="total" size="small" show-total  @on-change="changePage" :current.sync="currentPage"/>
          </div>
        </div>
         <div class="noBook" v-else>
           <p>当前暂无数据</p>
        </div>
        
      </TabPane>
      <TabPane :label="downBook" name="0">
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=20 class="demo-spin-icon-load" ></Icon>
          <div>拼命加载中...</div>
        </Spin>
        <div v-if="list.length !== 0">
          <div class="bookInfo" v-for="(item,index) in list" :key="index">
            <table>
              <tr>
                <td>
                  <img :src="'http://localhost:8888'+item.bookUrl"></img>
                </td>
                <td>
                  <p>《{{ item.bookName}}》</p>
                  <p> {{ item.bookAuthor}} </p>
                </td>
                <td>
                  <p>库存：{{ item.bookQuantity}} </p>  
                </td>
                <td>
                  <p>价格：￥{{ item.amount }} </p>  
                </td>
                <td>
                  <p>{{ item.uploadTime | timeFilter }}</p>
                </td>
                <td>
                  <Button size="small" @click="up(item)" type="primary">上架</Button>
                  <!-- <Button size="small" @click="edit">编辑</Button> -->
                  <Button size="small" @click="remove(item)" type="primary">删除</Button>
                </td>
              </tr>
            </table>
          </div>
          <div class="footer_page">
            <Page :total="total" size="small" show-total  @on-change="changePage" :current.sync="currentPage"/>
          </div>
        </div>
        
         <div class="noBook" v-else>
             <p >当前暂无数据</p>           
        </div>
        
      </TabPane>
    </Tabs>

    <!-- 编辑组件 -->
    <edit-book ref="editBook" v-on:reload="getBookList"></edit-book>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import EditBook from "./edit-book";
import { parseTime } from "../../utils/parseTime";
export default {
  components:{
    EditBook
  },
  data() {
    return {
      upNumber: 1,
      aduditNumber: 0,
      downNumber: 1,
      queryList:{
        page: 1,
        rows: 10,
        state: 1
      },
      total: 0,
      currentPage: 1,
      list: [],
      loading: false,
      userId: 0,
      upBook: h =>{
        return h('div'),[
          h('span','已上架 '),
          h('span',{
            style:{ color: 'red'}
          })
        ]
      },
      aduditBook: h =>{
        return h('div'),[
          h('span','审核中 '),
          h('span',{
            style:{ color: 'red'}
          })
        ]
      },
      downBook: h =>{
        return h('div'),[
          h('span','已下架 '),
          h('span',{
            style:{ color: 'red'}
          })
        ]
      },
    }
  },
  filters:{
    timeFilter(val) {
      if(val) return parseTime(val)
    }
  },
  created() {
    this.userId = VueCookies.get('userId')
    this.getBookList()
  },
    methods: {
      getBookList() {
        this.loading = true
        this.queryList.userId = this.userId
        this.$http.bookStateList(this.queryList).then( r => {
          this.loading = false
          this.total = r.data.totalCount
          this.total === 0 ? this.list = [] : this.list = r.data.data
        }).catch( err =>{
          this.loading = false
        })
      },
      // 切换标签页
      activeTab(name) {
        // 1表示上架 2表示审核中 0已下架
        this.queryList = {
          page: 1,
          rows: 10,
          state: parseInt(name),
        }
        this.currentPage = 1
        this.getBookList()
      },
      // 下架
      down(item) {
        this.$Modal.confirm({
            title: '提示',
            content: `是否下架书籍《${item.bookName}》？`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.$http.bookAdjust({
                bookId: item.id,
                state: 0
              }).then( r => {
                this.$Message.success({
                  background: true,
                  content: '下架成功！可到已下架查看书籍信息'
                  });
                this.getBookList()
              })
              
            }
        });
      },
      // 上架
      up(item) {
        this.$Modal.confirm({
            title: '提示',
            content: `是否上架书籍《${item.bookName}》？`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.$http.bookAdjust({
                bookId: item.id,
                state: 2
              }).then( r => {
                this.$Message.success({
                  background: true,
                  content: '书籍已提交审核，可在审核中查看书籍信息'
                });
                this.getBookList()
              })
              
            }
        });
      },
      // 编辑
      edit(item) {
        this.$refs.editBook.show(item)
      },
      // 删除
      remove(item) {
        this.$Modal.confirm({
            title: '提示',
            content: `是否继续删除书籍《${item.bookName}》？删除后该书籍将不会出现在列表中`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              let bookIds = []
              bookIds.push(item.id)
              this.$http.deleteBook({
                bookIds: bookIds
              }).then( r => {
                this.$Message.success({
                  background: true,
                  content: '删除成功！'
                });
                this.getBookList()
              })
              
            }
        });
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
 .book {
  /* height: 240px; */
  border: 1px solid #dcdcdc;
}
 .book .book_info {
  height: 40px;
  border-bottom: 1px solid #dcdcdc;
  background: #fafafa;
  line-height: 40px;
}
  .book .book_info .title {
  margin-left: 10px;
  border-left: 2px solid #ff2832;
  padding-left: 10px;
  /* float: ; */
}
 .book .bookInfo {
     width: 100%;
    height: 110px;
    /* background: pink; */
    padding: 0px 10px;
    font-size:11px;
    text-align: center;
    margin-bottom: 15px;
    border-bottom: 1px solid #dee0e4
}
 .book .bookInfo img{
     width: 50%;
    height: 100%;
}
  .book .noBook {
     width: 100%;
    height: 90px;
    /* background: pink; */
    padding: 0px 10px;
    font-size:13px;
    text-align: center;
    line-height: 90px;
}
 .book .bookInfo td:nth-child(1){
    width: 200px;
    height: 80px;
    /* border: 1px solid black; */
}
 .book .bookInfo td{
    width: 150px;
    height: 85px;
    /* border: 1px solid black; */
}
 .book .footer_page{
    text-align: right;
    margin-bottom: 10px;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}

</style>