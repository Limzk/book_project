<template>
  <div class="personal_content">
    <div class="basicMessage">
      <span class="label">用户名：</span>
      <div class="value">
        <strong>limzk</strong>
      </div>
    </div>
    <div class="basicMessage">
      <span class="label">手机号码：</span>
      <div class="value">
        <strong>18888888888</strong>
      </div>
    </div>
    <div class="basicMessage">
      <span class="label">性别：</span>
      <div class="value">
        <strong>男</strong>
      </div>
    </div>
    <div class="basicMessage">
      <span class="label">生日：</span>
      <div class="value">
        <strong>1997.07.10</strong>
      </div>
    </div>
    <div class="basicMessage">
      <span class="label">居住城市：</span>
      <div class="value">
        <strong>惠州</strong>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
    name:'personalMessage',
    data() {
        return {
            
        }
    },
}
</script>

<style scoped>
.el-card__body {
    margin-left: -20px
}
.personal_content{
  width: 80%;
  height: 500px;
  background-color: pink;
  margin: 0 auto;
  margin-top: -19px;
  font-size:14px;
}
/* 解决高度塌陷问题 */
.basicMessage:after{
  content: '';
  display: block;
  clear: both;
  /* overflow: hidden; */
}
.basicMessage .label {
  float: left;
  height: 18px;
  line-height: 18px;
  padding: 6px 0;
  width: 98px;
  text-align: right;
}
.basicMessage .value{
  float: left;
  padding: 6px 0;
  /* width: 98px; */
}
</style>