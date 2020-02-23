<template>
  <el-container>
    <el-header>
        <layout></layout>
    </el-header>
    <el-container>
      
      <el-aside width="200px">
          <div class="asideAvatar">
              <el-avatar :size="100" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" fit="cover" ></el-avatar>
              <el-button type="primary">修改头像</el-button>
          </div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >

         <router-link to="/personalMessage">
            <el-menu-item index="2">
                <i class="el-icon-s-custom"></i> 
                  <span slot="title">个人信息</span>           
            </el-menu-item>    
          </router-link>

          <router-link to="/myPublish">       
            <el-menu-item index="3">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">我的发布</span>
            </el-menu-item>
          </router-link>
          <router-link to="/myPublish">       
            <el-menu-item index="4">
              <i class="el-icon-sort-down"></i>
              <span slot="title">我的下架</span>
            </el-menu-item>
          </router-link>

          <router-link to="personalMessage">   
            <el-menu-item index="5">
              <i class="el-icon-s-tools"></i>
              <span slot="title">修改密码</span>
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "personal",
  data() {
    return {};
  },
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    personalMessage() {
        // this.$router.push('personal/personalMessage')
    },
  }
};
</script>

<style scoped>
.asideAvatar{
    height: 200px;
    width: 199px;
    /* border: 1px solid black; */
    margin-top:1px;
    text-align: center;
    padding-top:10px;
    background-color: #545c64
}
.asideAvatar .el-button {
  height: 20px;
  padding-top: 4px;
  margin-top: 12px;
}


</style>