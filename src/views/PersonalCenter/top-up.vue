<template>
  <Modal v-model="modal" title="充值入口">
    <p>充值用户：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;林阿稳</p>
    <div style="margin:20px 0">
      <span>充值猫币：</span>
      <InputNumber :min="1" v-model="number"></InputNumber>
    </div>
    
    <div class="btn" >
      <span>其他数量：</span>
      <Button v-for="(itemNumber,index) in topUpNumber" :key="index"  @click="chooseNumber(index)" :type="(index === activeNumber && number === itemNumber) ?'primary':'default'">{{ itemNumber }}</Button>
    </div>
    <p style="margin:20px 0">应付金额：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;￥{{ number }}</p>
    <div slot="footer">
      <Button type="text" @click="modalCancel">取消</Button>
      <Button type="primary" @click="modalOk">确定</Button>
    </div>
  </Modal>
</template>
<script>
import VueCookies from "vue-cookies";
export default {
  data() {
    return {
      modal: false,
      number: 1,
      topUpNumber:[10,30,50,100],
      activeNumber:'',
    };
  },
  methods: {
    show() {
      this.number = 1
      this.modal = true;
    },
    chooseNumber(index) {
      this.activeNumber = index
      this.number = this.topUpNumber[index]
    },
    modalOk() {
      this.$http.topUp({
        userId: VueCookies.get('userId'),
        totalAmount: this.number,
        type: 1
      }).then( r=> {
        this.$Message.success('充值成功！')
        this.modal = false;
        this.$emit('reload')
      })
      
    },
    modalCancel() {
      this.modal = false;
    }
  }
};
</script>

<style scoped>
p {
  margin: 10px 0;
}
.ivu-input-number {
  margin-left: 15px;
}

.btn .ivu-btn{
  margin-left: 15px;
}
/* .btn .ivu-btn:first-child{
  margin-left: 15px;
} */
</style>