<template>
  <div class="registerContent">
    <div class="layout">
      <div class="layout-ceiling">
        <a @click="goHome" style="margin-left: 15px;">首页</a>
        <div class="layout-ceiling-main">
          <a @click="goLogin">登录</a>
        </div>
      </div>
    </div>

    <div class="register">
      <h2>创建账号</h2>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <strong>用户名</strong>
        <span style="color:red">*</span>
        <FormItem prop="username">
          <Input v-model="formValidate.username"/>
        </FormItem>
        <strong>密码</strong>
        <span style="color:red">*</span>
        <FormItem prop="password" >
          <Input v-model="formValidate.password" type="password"/>
        </FormItem>
        <strong>确认密码</strong>
        <span style="color:red">*</span>
        <FormItem prop="checkPass" >
          <Input v-model="formValidate.checkPass" type="password"/>
        </FormItem>
        <FormItem style="text-align: center">
          <Button type="primary" @click="handleSubmit('formValidate')">注册</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var username = (rule, value, callback) => {
      if(value == "") {
        callback(new Error("请输入用户名！"));
      }
      else {
        callback()
      }
    };
    var password = (rule, value, callback) => {
      if(value == "") {
        callback(new Error("请输入密码！"));
      }
      else {
        callback()
      }
    };

    var checkPass = (rule, value, callback) => {
      if(value == "") {
        callback(new Error("请确认密码！"));
      }
      if(value !== this.formValidate.password) {
        callback(new Error("两次输入密码不一致!"));
      }
      else {
        callback()
      }
    }
    return {
      formValidate: {
        username: "",
        password: "",
        checkPass: ""
      },
      ruleValidate: {
        username: [{validator: username, trigger: "blur"}],
        password: [{validator: password, trigger: "blur"}],
        checkPass: [{validator: checkPass, trigger: "blur"}]
      }
    };
  },
  methods: {
    goLogin() {
      this.$router.push("login");
    },
    goHome() {
      this.$router.push('home')
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {       
        if (valid) {
          this.$http.register({
            username: this.formValidate.username,
            password: this.$md5(this.formValidate.password)
          }).then ( r => {
            if( r.code == 30001) {
              this.$Message.warning({
                    background: true,
                    content: '已存在该用户名，请重新输入！'
                });
                return             
            }
            this.$Message.success({
                background: true,
                content: '注册成功！即将为您跳转至登录页面'
            }); 
            setTimeout(()=>{
              this.$router.push('login')
            },1500 )
            
          }).catch( err => {
              this.$Message.error({
                background: true,
                content: '服务器繁忙，请稍后重试！'
              });
          })
        } 
        else {
          return false
        }
      });
    },
  }
};
</script>

<style  >
.registerContent .layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.registerContent .layout-ceiling {
  background: #464c5b;
  padding: 10px 0;
  overflow: hidden;
}
.registerContent .layout-ceiling-main {
  float: right;
  margin-right: 15px;
}
.registerContent .layout-ceiling-main a {
  /* color: #9ba7b5; */
  color:#bcbcbc;
}
.registerContent .register {
  height: 390px;
  width: 530px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #d8dee2;
  border-radius: 5px;
}
.registerContent .register  h2{
  text-align: center;
}
.registerContent .register .ivu-form-item-content {
  margin-left: 0px !important;
  height: 35px;
  margin-top: 5px;
  margin-bottom: 2px;
}
.registerContent .register .ivu-btn {
  width: 220px;
}
</style>