<template>
  <div>
    <layout></layout>
    <div class="layout" :style="{ height: elementHeight}">
        <div class="my_message" :style="{ height: elementHeight}">
            <h2>我的消息</h2>
                <ul>
                    <router-link :to="item.path" v-for="(item,index) in titleList" :key="index" @click.native="activeRouter(index)">
                        <li>
                            <Icon :type="item.class" style="font-size:13px;margin-right:5px;"/>
                            {{ item.title }}
                            <!-- <Badge :count="10"></Badge> -->
                            <Button type="error" shape="circle" style="width:16px;height:16px;padding:0;margin:0;font-size:9px" v-show="item.count !== 0">{{ item.count }}</Button>

                        </li>
                    </router-link>
                </ul>
        </div>
        <div class="message_content" ref="messageContent" >
            <router-view :sendList="sendList" v-on:changPage="changPage"></router-view>
        </div>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
    data() {
        return {
            titleList:[
                { title:"系统通知",path:'/message/systemMessage', class: "md-megaphone",count: 0},  
                { title:"审核通知",path:'/message/reviewMessage', class: "ios-list-box-outline", count: 0},
                { title:"评论",path:'/message/commentMessage',class:"md-at",count: 0},
            ],
            elementHeight: 0,
            userId:'',
            queryList: {
                page: 1,
                rows: 10,
            },
            sendList:[],
            height: 0,
        }
    },
    mounted(){
        // this.elementHeight = 820 + 'px'
        this.$nextTick( () =>{       
            this.getHeight()
        })
    },
    watch: {
        height:(newVal) =>{
            // console.log('?????')
            // 520 > newVal? this.elementHeight = 520 + 'px':this.elementHeight = newVal + 15 + 'px'
            // console.log(this.elementHeight)
        }
    },
    created() {
        // this.userId = VueCookies.get('userId'),
        this.queryList.userId =  VueCookies.get('userId')
        // 若刷新页面，重定位到之前点击的路由  若退出当前页面，则默认type为空默认加载系统通知
        sessionStorage.getItem('messageIndex')? this.getIndex(sessionStorage.getItem('messageIndex')):this.getMessageList()
    },
    destroyed() {
        sessionStorage.removeItem('messageIndex')
    },
    methods: {
        // 激活路由事件
        activeRouter(index) {
            sessionStorage.setItem('messageIndex',index)
            // 获取内容区高度
            // this.getHeight()
            // this.height = this.$refs.messageContent.clientHeight
            // 传参
            this.getIndex(index)

        },
        // 若 520 大于 内容区高度，则整体高度默认为520 否则 整体高度为内容区高度 + 15 使页码与下边框有间隙
        getHeight() {
            520 > this.$refs.messageContent.clientHeight? this.elementHeight = 520 + 'px':this.elementHeight = this.$refs.messageContent.clientHeight + 15 + 'px'
            console.log(this.elementHeight)
        },
        // 激活路由下标与传参type的关系 
        // type:    1---评论       2---审核通知   3---系统通知
        // index:   0---系统通知    1---评论      2---审核通知
        getIndex(index) {
            this.queryList = {
                rows: 10,
                page: 1,
                userId: VueCookies.get('userId')
            }
            parseInt(index) === 0? this.queryList.type = 3:index === 1?this.queryList.type = 1: this.queryList.type = 2
            this.reloadMessage(index)
        },
        //首页加载消息
        getMessageList() {
            // this.titleList.map( item => item.count = 2)
            this.$http.messageContent(this.queryList).then ( r => {
                if( r.code === 10000) {
                    let _data = r.data.data[0]
                    this.titleList[0].count = _data.systemUnreadCount
                    this.titleList[1].count = _data.commentUnreadCount
                    this.titleList[2].count = _data.reviewUnreadCount
                    // 传 页码总数量以及显示内容
                    let dataList = {
                        total: r.data.totalCount,
                        messageList: _data.messageList
                    }
                    // 向子组件传值
                   this.sendList = dataList
                   this.height = this.$refs.messageContent.clientHeight
                   this.$nextTick( () =>{
                        this.getHeight()
                    })
                }
            })
        },
        // 点击消息列表模块重新加载
        reloadMessage(index) {
            // let messageList = [
            //     { content: 111 },
            //     { content: 222 },
            //     { content: 333 },
            //     { content: 333 },
            //     { content: 333 },
            //     { content: 333 },
            //     { content: 333 },
            //     { content: 333 },
            //     { content: 333 },
            // ]
            // this.dataList  = {
            //     total:9,
            //     messageList:messageList
            // }
            // this.sendList = this.dataList
            // this.getHeight()
            // this.$nextTick( () =>{
            //     this.height = this.$refs.messageContent.clientHeight
            // })
            this.$http.reloadMessage(this.queryList).then( r => {
                if( r.code === 10000) {
                    let _data = r.data.data[0]
                    this.titleList[index].count = 0
                    let dataList = {
                        total: r.data.totalCount,
                        messageList: _data.messageList
                    }
                    // 向子组件传值
                   this.sendList = dataList
                   this.height = this.$refs.messageContent.clientHeight
                   this.getHeight()
                }
            })
        },
        // 子组件页码改变时
        changPage(page,state) {
            this.queryList.page = page
            this.queryList.state = state
            this.reloadMessage()
        }
    },
};
</script>

<style scoped>
.layout{
    width: 80%;
    /* height: 420px; */
    margin: 0px auto;
    border: 1px solid #dfdfdf;
    margin-bottom: 20px;
    /* border-top: 1px solid #dfdfdf; */
}
.layout .my_message{
    width: 18%;
    /* height: 420px; */
    float:left;
    border-right: 1px solid #dfdfdf;
    /* border-top:none;
    border-bottom:none; */
    padding-top: 50px;
}
.layout .my_message h2{
    font-size: 20px;
    font-weight: normal;
    height: 30px;
    text-align: center;
    margin: 16px 0;
}
.layout .my_message ul{
    text-align: center;
    padding: 0px;
}
.layout .my_message li{
    width: 100%;
    height: 53px;
    line-height: 53px;
    border-top: 1px solid #dfdfdf;
    font-size: 12px;
    color:black;
}
.layout .my_message ul:last-child{
    border-bottom: 1px solid #dfdfdf;
}
.layout .my_message li:hover{
    background: #f7f7f7;
}

.layout .message_content{
    width: 81%;
    /* height: 420px; */
    float:right;
    box-sizing: border-box;
    padding:78px 30px 0px;
    /* padding-top: 78px; */
    /* border: 1px solid #dfdfdf;
    border-top:none;
    border-left:none; */
}
.router-link-active li{
  background: #f7f7f7;
}
.ivu-badge-count {
    padding: 0;
}

</style>