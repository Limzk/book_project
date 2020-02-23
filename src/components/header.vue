<template>
  <Menu mode="horizontal" theme="dark">
    <MenuItem name>
      <a @click="goHome">首页</a>
    </MenuItem>
    <Submenu name v-if=" username !='' " >
      <template slot="title">
        <Icon type="md-person" />{{username}}
      </template>
      <MenuItem name>
        <a @click="personalCenter" >个人中心</a>
      </MenuItem>
      <MenuItem name>
        <a @click="myShopCar">我的购物车</a>
      </MenuItem>
      <MenuItem name>
        <a @click="logOut" >退出登录</a>
      </MenuItem>
    </Submenu>
    <MenuItem name="" class="menuInput" v-else>
            <a @click="goLogin">登录</a> |
            <a @click="goRegister">注册</a>
    </MenuItem>
    <MenuItem name class="menuInput">
      <Input  @keyup.enter.native="search" v-model="inputValue" placeholder="请搜索作者名或书名">
         <Icon type="ios-search" slot="suffix"  @click="search" />
      </Input>
    </MenuItem>
  </Menu>
</template>

<script>
import VueCookies from 'vue-cookies'
export default {
  name: "layout",
  data() {
    return {
      username: '',
      inputValue: '',
    };
  },
  created(){
    this.getUsername()
  },
  methods: {
    getUsername() {
      // VueCookies.set('username',"lim")       //测试用
      if(VueCookies.isKey('username')) {
        this.username = VueCookies.get('username')
      }
    },
    goLogin() {
      this.$router.push("login");
    },
    goRegister() {
      this.$router.push("register");
    },
    myShopCar() {
      this.$router.push("shopCar");
    },
    personalCenter() {},
    goHome() {
      this.$router.push("home");
    },
    search() {
      this.$emit('searchContent',this.inputValue)
    },
    logOut() {
       this.$Modal.confirm({
            title: '提示',
            content: '是否退出当前用户？',
            onOk: () => {
              this.$Message.success({
                content:'退出成功！',
              });
              VueCookies.remove('username')
              VueCookies.remove('token')
              VueCookies.remove('userId')
              this.username = ''
              this.$router.push('home')
            },
            onCancel: () => {
            }
        });
 
    }
  }
};
</script>

<style scoped>
.ivu-menu-light .ivu-menu-horizontal .ivu-menu-item-active {
  color: none;
  border-bottom: none;
}
.ivu-menu-submenu {
  float: right;
}
.menuInput {
  float: right;
}
.menuInput a {
  /* color: #9ba7b5; */
  color:#bcbcbc;
}
</style>