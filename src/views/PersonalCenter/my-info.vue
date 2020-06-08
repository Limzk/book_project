<template>
  <div>
    <div class="info">
      <div class="avatar_info">
        <span>头像信息</span>
      </div>
      <div class="avatar">
        <div class="avatar_left" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
          <img :src="'http://localhost:8888'+ userInfo.userUrl"></img>
          <!-- <img :src="userInfo.userUrl"></img> -->
          <div class="avatar_btn" >
            <a @click="change" class="hidden">更换头像</a>
          </div>
        </div>
        <input  type="file"   ref="uploadAvatar" @change="changeAvatar" accept="image/*" style="display:none"/>
        <div class="avatar_right">
          <p>{{ userInfo.name }}</p>
          <!-- <h4>我的猫币</h4> -->
          <div class="gold">
            <div class="gold_info" @click="toTopUp">      
              <!-- <Button size="small" >充值</Button> -->
            </div>
            <div class="balance">
              <p>猫币余额</p>
              <p>{{ userInfo.balance }}</p>
            </div>  
          </div>
          
        </div>
      </div>
      <div class="person_info">
        <span>个人信息</span>
      </div>
      <div class="person">
        <p>用户名：&nbsp;&nbsp;{{ userInfo.name }}</p>
        <p>手机号码：&nbsp;&nbsp;{{ userInfo.phoneNumber }}</p>
        <p>收货地址：&nbsp;&nbsp;{{ userInfo.address }}</p>
      </div>
    </div>
    <div class="btn">
      <Button @click="editInfo">编辑</Button>
    </div>

    <!-- 编辑个人信息组件 -->
    <edit-modal ref="edit" v-on:reload="getUserInfo"></edit-modal>
    <!-- 充值组件 -->
    <top-up-modal ref="topUp" v-on:reload="getUserInfo"></top-up-modal>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
import EditModal from "./edit-info";
import TopUpModal from "./top-up";
export default {
  components:{
    EditModal,
    TopUpModal
  },
  data() {
    return {
      userInfo: {
        userUrl:''
      },
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    change() {
      this.$refs.uploadAvatar.click()
    },
    changeAvatar() {
      let render = new FileReader()
      render.readAsDataURL(this.$refs.uploadAvatar.files[0])
      render.onload = ( () =>{
        this.userInfo.userUrl = render.result
      })
      let formData = new FormData()
      formData.append("file",this.$refs.uploadAvatar.files[0])
      formData.append("userId",VueCookies.get('userId'))
      this.$http.changeAvatar(formData).then( r =>{
        VueCookies.set("userUrl",r.data.userUrl)
        this.getUserInfo()
      })
    },
    // 鼠标移进img，添加蒙版，显示更换头像按钮
    mouseEnter() {
      $(".avatar_btn a").removeClass("hidden")
      $(".avatar_left img").addClass("img_opacity")
    },
    // 鼠标移出img
    mouseLeave() {
      $(".avatar_btn a").addClass("hidden")
      $(".avatar_left img").removeClass("img_opacity")
    },
    getUserInfo() {
      this.$http.getUserInfo({ userId: VueCookies.get('userId')}).then( r =>{
        this.userInfo = r.data
      })
    },
    toTopUp() {
      this.$refs.topUp.show()
    },
    editInfo() {
      this.$refs.edit.show(this.userInfo.name)
    }
  },
};
</script>

<style scoped>
html{
  background: #fff !important;
}
.info {
  /* height: 400px; */
  /* background: pink; */
  border: 1px solid #dcdcdc;
}
.info .avatar_info,
.person_info {
  height: 40px;
  border-bottom: 1px solid #dcdcdc;
  background: #fafafa;
  line-height: 40px;
}

.info span {
  margin-left: 20px;
  margin-left: 10px;
  border-left: 2px solid #ff2832;
  padding-left: 10px;
}
.info .avatar {
  width: 100%;
  height: 210px;
  border-bottom: 1px solid #dcdcdc;
  /* background:url(); */
}
.info .avatar .avatar_left{
  width: 25%;
  height: 100%;
  float: left;
  padding: 20px;
  padding-right: 35px;

}
.info .avatar .avatar_left img{
  width: 100%;
  height: 100%;
  border: 1px solid #dcdcdc;
}
.info .avatar .avatar_left .img_opacity{
  background: rgba(0, 0, 0, 0.5);
  opacity: 0.5;
}
.info .avatar .avatar_left .avatar_btn{
  position: relative;
  top:-27px;
  text-align: center;
  background: #333;
  color:#fff;
}
.info .avatar .avatar_left .avatar_btn .hidden{
  display: none;
}

.info .avatar .avatar_right{
  width: 75%;
  height: 100%;
   
  float: right;
}
.info .avatar .avatar_right > p{
  font-size: 22px;
  margin-top: 10px;
  border-bottom: 1px solid rgba(28,31,33,.1);
  padding-bottom: 10px;
}
.info .avatar .avatar_right h4{
  margin-top: 10px;

}
.info .avatar .avatar_right .gold{
  width: 100%;
  margin-top: 20px;
  /* padding-left: 18%; */
}
.info .avatar .avatar_right .gold .gold_info{
  width: 60px;
  height: 60px;
  margin-left: 40%;
  margin-top: 6px;
  background: url('../../assets/icon.png');
  background-position: 0 -433px;
  cursor: pointer;
}
.info .avatar .avatar_right .gold  .balance{
  /* width: 200px;
  margin-left: 80px;
  padding-top: 12px;
  font-weight: bold; */
  /* margin-top: 10px; */
  /* margin: 10px auto 0; */
  margin-left: 40%;
  margin-top: 10px;
  width: 60px;
  text-align: center;
}
.info .avatar .avatar_right .gold  .balance p:last-child{
  font-weight: 700;
}

.info .avatar .avatar_right .gold .ivu-btn{
  margin: 6px;
  
}

.info .person {
  width: 100%;
  /* height: 400px; */
  /* border-bottom: 1px solid #dcdcdc; */
  padding: 20px;
}
.info .person p {
  margin-bottom: 10px;
}
.btn{
  margin-top: 15px;
  text-align: right;
}
</style>