<template>
  <div class="content">
    <div class="title">
      <strong>评论</strong>
    </div>
    <div>
      <div class="comment_content" v-for="(item,index) in sendList.messageList" :key="index">
        <div class="img_content">
          <img />
        </div>
        <div class="text_content">
          <!-- <strong>林阿稳</strong> -->
          <span>{{ item.content }}</span>
          <span style="float:right">{{ item.createTime | filterTime }}</span>
        </div>
      </div>
      <div class="footer_page" v-if="sendList.total > 9">
        <Page :total="sendList.total" size="small" show-total  @on-change="changePage"/>
      </div>
    </div>
    <div class="no_content" v-if="sendList.total === 0">
      <strong>暂时还没收到评论</strong>
    </div>
  </div>
</template>

<script>
import { parseTime } from "../../utils/parseTime";
export default {
  name: "commentMessage",
  data() {
    return {};
  },
  props: ['sendList'],
  filters:{
    filterTime(val) {
      if(val) return parseTime(val)
    }
  },
  methods: {
    changePage(page) {
      this.$emit('changPage',page,1)
    }
  },
};
</script>

<style scoped>
.content {
}
.content .title {
  font-size: 14px;
  border-bottom: 2px solid #d13030;
  padding-bottom: 12px;
}
.content .comment_content {
  /* height: 62px; */
  padding: 16px;
  border-bottom: 1px dotted #ccc;
}
.content .comment_content:after {
  display: block;
  clear: both;
  content: "";
}
.content .comment_content .img_content {
  float: left;
  width: 10%;
  margin-right: 2%;
}
.content .comment_content .img_content img {
  width: 62px;
  height: 62px;
  border: 1px solid black;
}
.content .comment_content .text_content {
  float: left;
  width: 88%;
  line-height: 62px;
}
.content .comment_content strong {
  font-size: 12px;
}
.content .comment_content span {
  font-size: 12px;
  color: #999999;
}
.content .footer_page {
  text-align: right;
  margin-top: 20px;
}
.content .no_content {
  text-align: center;
  line-height: 320px;
}
</style>