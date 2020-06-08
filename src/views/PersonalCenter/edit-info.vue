<template>
  <Modal v-model="active" title="编辑个人信息" :mask-closable="false">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="用户名" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入您的用户名"></Input>
      </FormItem>
      <FormItem label="手机号码" prop="phoneNumber">
        <Input v-model="formValidate.phoneNumber" placeholder="请输入您的手机号码"></Input>
      </FormItem>
      <FormItem label="收货地址" prop="address">
         <Input v-model="formValidate.address" maxlength="100" :rows="3" show-word-limit type="textarea" placeholder="请输入您的收货地址"  />
      </FormItem>
    </Form>  
      <div slot="footer">
          <Button type="text" @click="modalCancel">取消</Button>
          <Button type="primary"  @click="modalOk('formValidate')">确定</Button>
      </div>
  </Modal>
</template>
<script>
import VueCookies from "vue-cookies";
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
        if ( value && !(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
            callback('请输入正确的手机号码');
        } else {
            callback();
        }   
    }
    return {
      active: false,
      formValidate: {
        name: "",
        phoneNumber: '',
        address:"",
      },
       ruleValidate: {
            name: [
              { required: true, message: '用户名不能为空！', trigger: 'blur' }
            ],
            address: [
              { required: true, message: '收货地址不能为空！', trigger: 'blur' }
            ],
            phoneNumber:[
              {  required: true,validator:validatePhone, trigger:'blur' }
            ]
       }
    };
  },
  methods: {
    show(name) {
      this.formValidate = {}
      this.$refs.formValidate.resetFields()
      this.active = true;
      this.formValidate.name = name 
    },
    modalCancel() {
        this.close()
    },
    modalOk(name) {
      this.$refs[name].validate((valid) => {
            if (valid) {
              this.formValidate.userId = VueCookies.get('userId')
              this.$http.editUserInfo(this.formValidate).then( r => {
                this.$Message.success({
                  background:true,
                  content:'保存成功'
                })
                this.close()
                this.$emit('reload')
              })
                
            } else {
                
            }
        })  
    },
    close() { 
        this.active = false
    },
  }
};
</script>