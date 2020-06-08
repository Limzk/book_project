<template>
   <Modal v-model="active" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>支付确认</span>
        </p>
        <div style="text-align:center">
            <p>本次支付需消费{{ total }}个猫币</p>
            <p>是否继续支付？</p>
        </div>
        <div slot="footer">
            <Button type="default" @click="active = false">取消</Button>
            <Button type="primary" @click="confirmPay"> 确定</Button>
            
        </div>
    </Modal>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
data() {
    return {
        active: false,
        total: 0,
        bookList: []
    }
},
methods: {
    show(total,list) {
        this.active = true
        this.total = total
        this.bookList = JSON.parse(list)
    },
    confirmPay() {
        // let r = {
        //     out_trade_no: 1,
        //     total_amount: 100,
        //     timestamp: 520
        // }
        // this.$router.push({name:'successfulByGold',params:{ data: r}})
        this.$http.payByGold({
            userId: VueCookies.get("userId"),
            bookList: this.bookList
        }).then ( r => {
            if(r.code === 30001) {
                this.active = false
                this.$Modal.error({
                    title: '支付失败',
                    content: '余额不足，请先充值后重试！'
                });     
            }
            else {
                this.$router.push({name:'successfulByGold',params:{ data: r.data}})
            }           
        })
    },
},
}
</script>

<style>

</style>