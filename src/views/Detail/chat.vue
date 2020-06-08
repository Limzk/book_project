<template>
  <Modal v-model="active" title="聊天室" :mask-closable="false" width="650" @on-visible-change="close">
      <div class="container" >
        <div class="right-content" v-for="item in list">
            <span class="right-message">{{item.message}}</span>
            <img class="right-img" :src="'http://localhost:8888'+item.userUrl"></img>
        </div>
      </div>
      <Input v-model="value" maxlength="100" show-word-limit type="textarea" placeholder="说点什么吧..." @keyup.enter.native="send"/>
      <div slot="footer">
        <Button type="primary"  @click="send" >发送</Button>
      </div>
  </Modal>
</template>
<script>
import VueCookies from "vue-cookies";
export default {
  data() {
    return {
      active: false,
      value:'',
      list: [],
      websocket: null,
      userId: '',
    };
  },
  methods: {
    show() {
      this.active = true;
      this.userId = VueCookies.get("userId")
      this.connectWebSocket()
    },
    // 建立连接
    connectWebSocket() {
        this.websocket = new WebSocket("ws://localhost:7070/websocket/"+VueCookies.get("username"))
        //接收到消息的回调方法
        this.websocket.onmessage = event => {
            let data = JSON.parse(event.data)
            this.setMessageInnerHTML(data);
        }
    },
    //将消息显示在网页上
    setMessageInnerHTML(data) {
        this.list.push(data)
        if(data.type === 0) {
            let count = this.list.length
            this.$nextTick( () =>{
                $(".right-content").eq(count-1).addClass("center-content")
                $(".right-message").eq(count-1).addClass("center-message")
                $(".right-img").eq(count-1).addClass("hidden")
            })  
        }
        else {
            if(data.userId !== parseInt(this.userId)) {
            let count = this.list.length
            this.$nextTick( () =>{
                $(".right-content").eq(count-1).addClass("left-content")
                $(".right-message").eq(count-1).addClass("left-message")
                $(".right-img").eq(count-1).addClass("left-img")
            })   
            }
        } 
    },
    // 发送消息
    send() {
        if(this.value.length  == 0) {
            return
        }
        this.websocket.send(this.value)
        this.value = ''
    },
    close(flag) {
        if(!flag)  this.websocket.close();
    },
  }
};
</script>
<style scoped>

.container {
    height: 400px;
    overflow: auto;
    margin-bottom: 20px;
}
.container .remind{
    text-align: center;
    color: orange;
}
.right-content{
    margin-bottom: 10px;
    text-align: right;
}
.right-message{
    background-color: #2d8cf0;
    display: inline-block;
    padding:12px;
    border-radius: 5px;
    color: #fff;
    max-width:400px;
    vertical-align: text-top;
    margin-right: 7px;
    text-align:left;
}
.right-img{
    width: 45px;
    height: 45px;
    vertical-align: text-top;
}
.left-content{
    margin-bottom: 10px;
    text-align: left;
}
.left-message{
    background-color: #fff;
    display: inline-block;
    padding:12px;
    border-radius: 5px;
    color: black;
    max-width:400px;
    vertical-align: text-top;
    margin-left: 7px;
    border:1px solid #ccc;
    
}
.left-img{
    width: 45px;
    height: 45px;
    vertical-align: text-top;
    float: left;
}
.center-content {
    text-align: center;
}
.center-message {
    color:orange;
    background-color: #fff;
    display: inline-block;
    padding:none;
    border-radius: none;
    max-width:400px;
    vertical-align: text-top;
    text-align:center;
}
.hidden {
    display: none;
}

</style>