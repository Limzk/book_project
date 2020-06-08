<template >
  <div class="loginContent">
    <div class="layout">
      <div class="layout-ceiling">
        <a @click="goHome" style="margin-left: 15px;">首页</a>
        <div class="layout-ceiling-main">
          <a @click="goRegister">注册</a>
        </div>
      </div>
    </div>
    <transition name="enter">
      <div v-if="show" class="container">
        <h1>书友吧</h1>
        <div class="login">
          <Form ref="formCustom" :model="formCustom" :rules="ruleCustom"  label-position="top">
            <FormItem prop="username" label="用户名">
              <Input type="text" v-model="formCustom.username" />
            </FormItem>
            <FormItem prop="passwd"  label="密码">
              <Input type="password" v-model="formCustom.passwd" />
            </FormItem>
              <Button type="success" @click="handleSubmit('formCustom')">登录</Button>
          </Form>
        </div>
        <div class="register">
          <p>没有账号？</p>
          <a @click="goRegister">点击注册</a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码！"));
      } else {
        callback();
      }
    };
    const validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名！"));
      } else {
        callback();
      }
    };

    return {
      formCustom: {
        passwd: "",
        username: ""
      },
      ruleCustom: {
        passwd: [{ validator: validatePass, trigger: "blur" }],
        username: [{ validator: validateUsername, trigger: "blur" }]
      },
      show: false
    };
  },
  mounted() {
    this.show = true;
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$http
            .login({
              username: this.formCustom.username,
              password: this.$md5(this.formCustom.passwd)
            })
            .then(r => {
              if (r.code == 10000) {
                this.$Message.success({
                  background: true,
                  content: "登录成功！"
                });
                VueCookies.set("username", r.data.username);
                VueCookies.set("token", r.data.accessToken);
                VueCookies.set("userId", r.data.userId);
                VueCookies.set("userUrl",r.data.userUrl)
                this.$router.push("home");
              } else {
                this.$Message.error({
                  background: true,
                  content: "用户名或密码错误！"
                });
              }
            })
            .catch(err => {
              this.$Message.error({
                background: true,
                content: "服务器繁忙，请稍后重试！"
              });
            });
        } else {
          return false;
        }
      });
    },
    goRegister() {
      this.$router.push("register");
    },
    goHome() {
      this.$router.push("home");
    }
  }
};
</script>

<style scoped>
.enter-enter-active {
  transition: all .8s ease;
}
.enter-enter {
  transform: translateY(100px);
}

.loginContent {
  height: 100%;
  width: 100%;
  position: fixed;
  background: url('../../assets/background3.jpg') no-repeat; 
  background-size: cover;
}
.loginContent .layout-ceiling {
  background: #404142;
  padding: 10px 0;
  overflow: hidden;
}
.loginContent .layout-ceiling-main {
  float: right;
  margin-right: 15px;
}
.loginContent .layout-ceiling-main a {
  color: #bcbcbc;
}

.loginContent .container {
  margin-top: 95px;
  text-align: center;
  /* background: url('../../assets/background3.jpg') no-repeat; */
  /* background-size: cover; */
  /* color: black; */
}
.loginContent .container h1{
  margin-bottom: 10px;
  color: #000;
  /* letter-spacing: 100px; */
}
.loginContent .container .login {
  /* height: 315px; */
  width: 390px;
  margin: 0 auto 20px;
  padding: 10px 20px 40px;
  border: 1px solid #d8dee2;
  border-radius: 5px;
  background: rgba(69, 137, 171, 0.2);
  text-align: left;
}
.loginContent .container .login .ivu-form-item {
  margin-top:30px;
}
.loginContent .container .login .ivu-btn {
  width: 100%;
  margin-top: 20px;
  background-color: rgba(108, 179, 145, 0.85);
  border-color: rgba(108, 179, 145, 0.85);
}
.loginContent .container .register {
  height: 52px;
  width: 390px;
  margin: 0px auto;
  padding: 20px;
  text-align: center;
  line-height: 12px;
  border: 1px solid #d8dee2;
  border-radius: 5px;
  background: rgba(69, 137, 171, 0.2);
}
.loginContent .container .register p {
  display: inline-block;
}
.loginContent .container .register a {
  text-decoration: none;
  color: #bd2e0b;
}
</style>