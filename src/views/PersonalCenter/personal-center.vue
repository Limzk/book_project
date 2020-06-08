<template>
  <div >
    <layout></layout>
    <div class="content">
      <div class="left">
        <div class="left_header">
          <Icon type="md-person" />
          <span>我的中心</span>
        </div>
        <div class="left-menu">
          <ul v-for="(item,index) in menuList">
            <router-link :to="item.path">
              <li>{{ item.title }}</li>
            </router-link>
          </ul>
        </div>
        <div class="left_footer">

        </div>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "personal-center",
  data() {
    return {
      menuList: [
        { title:'我的信息', path:'/personalCenter/myInfo'},
        { title:'我的订单', path:'/personalCenter/myOrder'},
        { title:'我的账单', path:'/personalCenter/myBill'},
        { title:'我的书籍', path:'/personalCenter/myBook'},
        { title:'我的收藏', path:'/personalCenter/myCollect'},
        { title:'上传书籍', path:'/personalCenter/uploadBook'},
      ]
    };
  }
};
</script>

<style  scoped>
.content {
  width: 80%;
  /* height: 300px; */
  /* background: pink; */
  margin: 20px auto;
  background: 
}
.content .left {
  width: 15%;
  height: 100%;
  /* background: red; */
  float: left;
}
.content .left .left_header {
  height: 50px;
  border: 1px solid #dcdcdc;
  border-bottom: none;
  background: #fafafa;
  line-height: 50px;
  text-align: center;
}
.content .left .left_header span {
  font-weight: normal;
  font-size: 90%;
}
.content .left .left-menu {
  /* height: 200px; */
  width: 100%;
  border: 1px solid #dcdcdc;
  border-bottom: none;
  padding-top: 15px;
}

.content .left ul li {
  width: 100%;
  height: 50px;
  /* border-top: 1px solid black; */
  text-align: center;
  line-height: 50px;
}
.content .left .left-menu li:hover {
  background: #dfedfd;
  /* color:#6ca7f4; */
}
.content .left .left_footer {
  height: 200px;
  /* background: red; */
  border: 1px solid #dcdcdc;
  border-top: none
}
.content .right {
  width: 84%;
  height: 100%;
  /* background: burlywood; */
  float: right;
}
.router-link-active{
  color: green;
}
</style>