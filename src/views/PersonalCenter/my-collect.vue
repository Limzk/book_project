<template>
<div class="bill">
  <div class="bill_info">
    <span class="title">我的收藏</span>
  </div>
  <Table :columns="columns" :data="list">
    <template slot-scope="{ row }" slot="createTime">
        {{ row.createTime | timeFilter  }}
    </template>
     <template slot-scope="{ row, index }" slot="operate">
       <!-- <Button  size="small" type="primary">进入详情</Button>
       <Button  size="small" type="primary">取消收藏</Button> -->
       <Button  type="success"  icon="md-arrow-dropright"  title="进入详情" shape="circle" size="small"  @click="goDetail(row.bookId)" ></Button>
       <Button  type="error"  icon="ios-close"  title="取消收藏" shape="circle" size="small"  @click="cancel(row)" ></Button>
      </template>
  </Table>
  <Page :total="total" size="small" show-total @on-change="changePage" v-if="this.total > 9"/>
</div>
 
</template>

<script>
import { parseTime } from "../../utils/parseTime";
import VueCookies from "vue-cookies";
export default {
  name: "my-collect",
  data() {
    return {
      queryList:{
        rows: 10,
        page: 1
      },
      total:0,
      columns: [
        { title: "书籍名称", key: "bookName",align: 'center'},
        { 
            title: "书籍图片", key: "bookUrl",align: 'center',
            render: (h, params) => {
            return h("img", {
              /*  组件样式 */
              style: {
                width: "70px",
                height: "70px"
              },
              /*  html属性 */
              attrs: {
                /*  图片的路径,直接采用后台返回的键值 */
                src: "http://localhost:8888"+params.row.bookUrl
              }
            });
          }
        },
        { title: "收藏时间", slot: "createTime",align: 'center'},
        { title: "操作", slot: "operate",align: 'center'},
      ],
      list: [{}]
    };
  },
  filters:{
    timeFilter(val) {
      if(val) return parseTime(val)
    },
  },
  created(){
    this.queryList.userId = VueCookies.get("userId")
    this.getCollectList()
  },
  methods: {
    getCollectList() {
      this.$http.collectList(this.queryList).then( r => {
        this.total = r.data.totalCount
        this.list = r.data.data
      })
    },
    changePage(page) {
      this.queryList.page = page
      this.getCollectList()
    },
    // 取消收藏
    cancel(item) {
        this.$Modal.confirm({
            title: '提示',
            content: `是否取消收藏书籍《${item.bookName}》？`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              this.$http.cancelCollect({
                userId: VueCookies.get("userId"),
                bookId: item.bookId,
                state: 0
            }).then( r => {
                this.$Message.success({
                  background: true,
                  content: '取消收藏成功！'
                });
                this.getCollectList()
            })       
            }
        });
    },
    // 进入详情
    goDetail(id) {
        let routeData = this.$router.resolve({
            path: "/detail",
            query:{ id }
        })
        window.open(routeData.href, '_blank');
    }
  },
};
</script>

<style scoped>
.bill {
  border: 1px solid #dcdcdc;
  border-bottom: none;
}
.bill .bill_info {
  height: 40px;
  border-bottom: 1px solid #dcdcdc;
  background: #fafafa;
  line-height: 40px;
}
.bill .bill_info .title {
  margin-left: 10px;
  border-left: 2px solid #ff2832;
  padding-left: 10px;
  /* float: right; */
}
.bill .ivu-page{
    float:right;
    margin-top: 10px;
}
</style>