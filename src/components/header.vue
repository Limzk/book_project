<template>
  <Menu mode="horizontal" theme="dark">
    <MenuItem name>
      <a @click="goHome">首页</a>
    </MenuItem>
    <Submenu name v-if=" username !='' " >
      <template slot="title">
        <!-- <Icon type="md-person" />{{username}} -->
        <!-- <img :src="userUrl"/> -->
        <!-- <img src="../assets/avatar.jpg"/> -->
        <Avatar :src="'http://localhost:8888'+userUrl" />
        <span>{{username}}</span>
      </template>
      
      <MenuItem name >
        <a @click="personalCenter" >个人中心</a>
      </MenuItem>
      <MenuItem name>
        <a @click="myShopCar">我的购物车</a>
      </MenuItem>
      <MenuItem name>
        <a @click="myMessage">我的消息
          <Button type="error" shape="circle" style="width:16px;height:16px;padding:0;font-size:9px" v-show="count != 0">{{ count }}</Button>
        </a>
      </MenuItem>
      <MenuItem name>
        <a @click="logOut" >退出登录</a>
      </MenuItem>
    </Submenu>
    <MenuItem name="" class="menuInput" v-else>
            <a @click="goLogin">登录</a> 
             &nbsp;&nbsp;
            <a @click="goRegister">注册</a>
    </MenuItem>
    <MenuItem name class="menuInput">
      <!-- 插槽 -->
      <slot name="search"></slot>
      <!-- <Input  @keyup.enter.native="search" v-model="inputValue" placeholder="请搜索作者名或书名">
         <Icon type="ios-search" slot="suffix"  @click="search" />
      </Input> -->
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
      // inputValue: '',
      count: 0,
      userUrl:''
    };
  },
  created(){
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      // VueCookies.set('username',"lim")       //测试用
      if(VueCookies.isKey('username')) {
          this.userUrl =  VueCookies.get('userUrl')
          this.username = VueCookies.get('username')
          // 获得未读消息数量
          this.$http.messageCount({
            userId: VueCookies.get('userId'),
            state: 0
          }).then( r => {
            this.count = r.data
          })
      }
    },
    goLogin() {
      this.$router.push("login");
    },
    goRegister() {
      this.$router.push("register");
    },
    myShopCar() {
      this.$router.push({name:"shopCar"});
    },
    myMessage() {
      this.$router.push({path:'/message'})
    },
    personalCenter() {
      this.$router.push({name:"personal-center"})
    },
    goHome() {
      this.reset()
      this.$router.push({name:"home"});
    },
    search() {
      // console.log(this.inputValue)
      // this.$emit('searchContent',this.inputValue)
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
              VueCookies.remove('userUrl')
              this.username = ''
              this.reset()
              this.$router.push({name:"home"})
              this.$router.go(0)
            },
            onCancel: () => {
            }
        });
    },
    reset() {
      sessionStorage.setItem('page',1)
      sessionStorage.setItem('type','全部')
    }
  }
};
</script>

<style scoped>
.ivu-menu-light .ivu-menu-horizontal .ivu-menu-item-active {
  /* color: none; */
  border-bottom: none;
}
.ivu-menu{
  width: 100%;
}
.ivu-menu .ivu-menu-item a{
  /* color: #fff; */
}
.ivu-menu-dark{
  background: #464c5b;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
}
.ivu-menu-submenu {
  float: right;
}

.ivu-menu-submenu .ivu-menu-submenu-title span{
  margin-left: 10px;
}
.menuInput {
  float: right;
}
/* .menuInput a {
  color:#bcbcbc;
} */
a {
  /* color: black; */
}
</style>