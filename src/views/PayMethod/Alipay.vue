<template>
  <div v-html="payHTML">

  </div>

</template>

<script>
import VueCookies from "vue-cookies";
export default {
    name:"Alipay",
    data() {
        return {
            payHTML:''
        }
},
created() {
    this.getHTML()
},
methods: {
    getHTML() {
        let bookList = JSON.parse(VueCookies.get('bookList'))
        this.$http.payment({
            userId: VueCookies.get("userId"),
            bookList: bookList
        }).then ( r => {
            this.payHTML = r
            this.$nextTick(()=> {
                document.forms[0].submit();
            })
        })
    },
    }
}
</script>

<style>

</style>