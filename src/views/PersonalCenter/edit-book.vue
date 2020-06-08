<template>
  <Modal v-model="active" title="修改书籍信息" >
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <!-- <FormItem label="书籍名称" prop="bookName">
        <Input v-model="formValidate.bookName" placeholder="请输入书籍名称"></Input>
      </FormItem>
      <FormItem label="书籍作者" prop="bookAuthor">
        <Input v-model="formValidate.bookAuthor" placeholder="请输入书籍作者"></Input>
      </FormItem> -->
      <FormItem label="上架数量" >
        <InputNumber  :min="1" v-model="formValidate.bookQuantity"></InputNumber>
      </FormItem>
      <FormItem label="价格" >
        <InputNumber  :min="1" v-model="formValidate.amount"></InputNumber>
      </FormItem>
    </Form>  
      <div slot="footer">
          <Button type="text" @click="modalCancel">取消</Button>
          <Button type="primary"  @click="modalOk">确定</Button>
      </div>
  </Modal>
</template>
<script>
export default {
  data() {
    return {
      active: false,
      formValidate: {
        // bookName: "",
        // bookAuthor: "",
        // quantity: 0,
      },
       ruleValidate: {
            bookName: [
                { required: true, message: '书籍名称不能为空！', trigger: 'blur' }
            ],
            bookAuthor: [
                { required: true, message: '书籍作者不能为空！', trigger: 'change' }
            ],
       }
    };
  },
  methods: {
    show(item) {
      // this.$refs.formValidate.resetFields()
      this.formValidate.bookQuantity = item.bookQuantity
      this.formValidate.amount = item.amount
      this.formValidate.bookId = item.id
      this.active = true;
    },
    modalCancel() {
        this.close()
    },
    modalOk() {
      this.$http.updateBook(this.formValidate).then( r => {
        this.close()
        this.$emit("reload")
      })
      // this.$refs[name].validate((valid) => {
      //       if (valid) {
      //         this.$http.updateBook(this.formValidate).then( r => this.close())
      //       } else {
                
      //       }
      //   })  
    },
    close() { 
        this.active = false
    },
  }
};
</script>
<style scoped>
.ivu-form {
  margin-top: 20px;
}
</style>