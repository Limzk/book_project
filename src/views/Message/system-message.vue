<template>
  <div class="content">
    <div class="title">
      <strong>系统通知</strong>
    </div>
    <div>
      <div class="notice_content" v-for="(item,index) in sendList.messageList" :key="index">
        <strong>通知：</strong>
        <!-- <span>您上传的物品"i6"被用户林阿稳买走了，快去看看吧！</span> -->
        <span>{{ item.content }}</span>
        <span style="float:right">{{ item.createTime | filterTime }}</span>
      </div>
      <div class="footer_page" v-if="sendList.total > 9">
          <Page :total="sendList.total" size="small" show-total  @on-change="changePage"/>
      </div>
    </div>
    <div class="no_content" v-if="sendList.total === 0">
      <strong>暂时还没收到系统通知</strong>
    </div>
  </div>
</template>

<script>
import { parseTime } from "../../utils/parseTime";
export default {
  name: "noticeMessage",
  data() {
    return {
      // sendList: []
    };
  },
  filters:{
    filterTime(val) {
      if(val) return parseTime(val)
    }
  },
  props: ['sendList'],
  methods: {
    changePage(page) {
      this.$emit('changPage',page,3)
    }
  },
};
</script>

<style scoped>
.content {
  position: relative;
}
.content .title {
  font-size: 14px;
  border-bottom: 2px solid #d13030;
  padding-bottom: 12px;
}
.content .notice_content {
  padding: 16px;
  border-bottom: 1px dotted #ccc;
}
.content .notice_content strong {
  font-size: 12px;
}
.content .notice_content span {
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