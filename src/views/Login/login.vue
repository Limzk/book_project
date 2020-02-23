<template>
  <div class="loginContent">
    <div class="layout">
      <div class="layout-ceiling">
        <a @click="goHome" style="margin-left: 15px;">首页</a>
        <div class="layout-ceiling-main">
          <a @click="goRegister">注册</a>
        </div>
      </div>
    </div>
    <div class="login">
      <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <p>用户名</p>
        <FormItem prop="username">
          <Input type="text" v-model="formCustom.username"/>
        </FormItem>
        <p>密码</p>
        <FormItem prop="passwd">
          <Input type="password" v-model="formCustom.passwd"/>
        </FormItem>
        <FormItem>
          <Button type="success" @click="handleSubmit('formCustom')">登录</Button>
        </FormItem>
      </Form>
    </div>
    <div class="register">
      <p>没有账号？</p>
      <a @click="goRegister">点击注册</a>
    </div>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
export default {
  data() {
     const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码！"));
      } else {
        callback()
      }
    };
      const validateUsername = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入用户名！"));
        } else {
          callback()
        }
      }

    return {
      formCustom: {
        passwd: "",
        username: "",
      },
      ruleCustom: {
        passwd: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateUsername, trigger: "blur" }]
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$http.login({
            username:this.formCustom.username,
            password: this.$md5(this.formCustom.passwd)
          }).then ( r => {
            if( r.code == 10000) {
              this.$Message.success({
                    background: true,
                    content: '登录成功！'
                });
              VueCookies.set('username',r.data.username)
              VueCookies.set('token',r.data.accessToken)
              VueCookies.set('userId',r.data.userId)
              this.$router.push('home')
            }
            else {
              this.$Message.error({
                    background: true,
                    content: '用户名或密码错误！'
                });
            }
          }).catch( err => {
            this.$Message.error({
                    background: true,
                    content: '服务器繁忙，请稍后重试！'
                });
          })
        } else {
          return false
        }
      });
    },
    goRegister(){
      this.$router.push('register')
    },
    goHome() {
      this.$router.push('home')
    }
  }
};
</script>

<style  >
.loginContent .layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.loginContent .layout-ceiling {
  background: #464c5b;
  padding: 10px 0;
  overflow: hidden;
}
.loginContent .layout-ceiling-main {
  float: right;
  margin-right: 15px;
}
.loginContent .layout-ceiling-main a {
  /* color: #9ba7b5; */
  color:#bcbcbc;
}

.loginContent .login {
  height: 315px;
  width: 370px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #d8dee2;
  border-radius: 5px;
}
.loginContent .login p {
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  margin-top: 10px;
}
.loginContent .login .ivu-form-item-content {
  margin-left: 0px !important;
  height: 35px;
  margin-top: 5px;
  margin-bottom: 10px;
}
.loginContent .login .ivu-btn {
  width: 100%;
  margin-top: 20px;
}

.loginContent .register {
  height: 52px;
  width: 370px;
  margin: 0px auto;
  padding: 20px;
  text-align: center;
  line-height: 12px;
  border: 1px solid #d8dee2;
  border-radius: 5px;
}
.loginContent .register p {
  display: inline-block;
}
.loginContent .register a {
  text-decoration: none;
}
</style>