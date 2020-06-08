<template>
  <Modal v-model="modal" title="评论" >
    <Form ref="formValidate" :model="formValidate"  :label-width="80">
      <span>评分</span>
      <Rate allow-half v-model="formValidate.score" />
      <Input v-model="formValidate.content" maxlength="100" :rows="4" show-word-limit type="textarea" style="margin-top:20px" />
    </Form>
    <div slot="footer">
      <Button type="text" @click="modalCancel">取消</Button>
      <Button type="primary" @click="modalOk" :disabled="formValidate.content === ''">确定</Button>
    </div>
  </Modal>
</template>
<script>
import VueCookies from "vue-cookies";
export default {
  data() {
    return {
      modal: false,
      formValidate:{
        content: ''
      }
    };
  },
  methods: {
    show(bookId,orderId) {
      this.formValidate = {
        userId: VueCookies.get('userId'),
        bookId: bookId,
        orderId: orderId
      }
      this.modal = true;
    },
    modalOk() {
      this.$http.addComment(this.formValidate).then( r => {
        if(r.code === 10000) {
          this.$Message.success('评价成功！');
          this.modal = false
          this.$emit("reload")
        }
      })
    },
    modalCancel() {
        
      this.modal = false
    }
  }
};
</script>

<style>
</style>