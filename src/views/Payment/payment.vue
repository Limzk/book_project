<template>
   <span class="red">{{minutes}}分{{second}}秒</span>

</template>

<script>
export default {
data() {
    return {
        minutes: 0, //分
        seconds: 10, //秒
    }
},
mounted() {
    // 倒计时
    this.timer();
},
watch: {
    // 倒计时
    second: {
    handler(newVal) {
        this.num(newVal);
    },
    },
    // 倒计时
    minute: {
    handler(newVal) {
        this.num(newVal);
    },
    },
},
computed: {
    // 倒计时
    second: function() {
    return this.num(this.seconds);
    },
    minute: function() {
    return this.num(this.minutes);
    },
},
methods: {
    // 倒计时
    num(n) {     
      return n < 10 ? '0' + n : '' + n;
    },
    // 倒计时
    timer() {
      var time = window.setInterval(() => {
        if (this.seconds === 0 && this.minutes !== 0) {
          this.seconds = 59;
          this.minutes -= 1;
        } else if (this.minutes === 0 && this.seconds === 0) {
          this.seconds = 0;
          window.clearInterval(time);
        } else {
          this.seconds -= 1;
        }
      }, 1000);
    },
  },
}

</script>

<style>

</style>