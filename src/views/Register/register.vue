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

    <transition name="enter">
      <div class="register" v-if="show">
        <h2>创建账号</h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" >
          <FormItem prop="username" label="用户名">
            <Input v-model="formValidate.username" />
          </FormItem>
          <FormItem prop="password" label="密码">
            <Input v-model="formValidate.password" type="password" />
          </FormItem>
          <FormItem prop="checkPass" label="确认密码">
            <Input v-model="formValidate.checkPass" type="password" />
          </FormItem>
          <FormItem style="text-align: center">
            <Button type="primary" @click="handleSubmit('formValidate')">注册</Button>
          </FormItem>
        </Form>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    var username = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入用户名！"));
      } else {
        callback();
      }
    };
    var password = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码！"));
      } else {
        callback();
      }
    };

    var checkPass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请确认密码！"));
      }
      if (value !== this.formValidate.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      show: false,
      formValidate: {
        username: "",
        password: "",
        checkPass: ""
      },
      ruleValidate: {
        username: [{ validator: username, trigger: "blur" }],
        password: [{ validator: password, trigger: "blur" }],
        checkPass: [{ validator: checkPass, trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.show = true
  },
  methods: {
    goLogin() {
      this.$router.push("login");
    },
    goHome() {
      this.$router.push("home");
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$http
            .register({
              username: this.formValidate.username,
              password: this.formValidate.password
            })
            .then(r => {
              if (r.code == 30001) {
                this.$Message.warning({
                  background: true,
                  content: "已存在该用户名，请重新输入！"
                });
                return;
              }
              this.$Message.success({
                background: true,
                content: "注册成功！即将为您跳转至登录页面"
              });
              setTimeout(() => {
                this.$router.push("login");
              }, 1500);
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
    }
  }
};
</script>

<style  scoped>
.enter-enter-active {
  transition: all .8s ease;
}
.enter-enter {
  transform: translateY(35px);
}
.registerContent  {
  height: 100%;
  width: 100%;
  position: fixed;
  background: url('../../assets/background3.jpg') no-repeat; 
  background-size: cover;
}
.registerContent h2 {
  color: #000;
}
.registerContent .layout {
  /* background: #f5f7f9; */
  position: relative;
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
  color: #bcbcbc;
}
.registerContent .register {
  /* height: 390px; */
  width: 530px;
  margin: 90px auto;
  padding: 20px;
  border: 1px solid #d8dee2;
  border-radius: 5px;
  background: rgba(69, 137, 171, 0.2);
}
.registerContent .register h2 {
  text-align: center;
}
.registerContent .register .ivu-form-item {
  /* font-weight: 550; */
  
}
.registerContent .register .ivu-btn {
  width: 220px;
  margin-top: 10px;
  background: rgba(45, 140, 240, 0.2);
  border-color: rgba(45, 140, 240, 0.2);
}

</style>