<template>
<div class="bill">
  <div class="bill_info">
    <span class="title">我的账单</span>
  </div>
  <Table :columns="columns" :data="list">
    <template slot-scope="{ row }" slot="createTime">
        {{ row.createTime | timeFilter  }}
    </template>
    <template slot-scope="{ row }" slot="payAmount">
        {{ row.payAmount === 0?'----': row.payAmount }}
    </template>
    <template slot-scope="{ row }" slot="amount">
        {{ row.amount === 0?'----': row.amount }}
    </template>
    <template slot-scope="{ row }" slot="payMethod">
        {{ row.payMethod  === 0? '余额支付': '支付宝支付'  }}
    </template>
    <template slot-scope="{ row }" slot="incomeWay">
        {{ row.amount === 0?'----':'余额收入'}}
    </template>
  </Table>
  <Page :total="total" size="small" show-total @on-change="changePage" v-if="this.total > 9"/>
</div>
 
</template>

<script>
import { parseTime } from "../../utils/parseTime";
import VueCookies from "vue-cookies";
export default {
  name: "my-bill",
  data() {
    return {
      queryList:{
        rows: 10,
        page: 1
      },
      total:0,
      columns: [
        { title: "日期", slot: "createTime",width:150,align: 'center',},
        { title: "支出（-）", slot: "payAmount",align: 'center',},
        { title: "存入（+）", slot: "amount",align: 'center',},
        { title: "支出方式", slot: "payMethod",align: 'center',},
        { title: "收入方式", slot: "incomeWay",align: 'center',},
        { title: "订单号", key: "orderId",align: 'center',},
      ],
      list: []
    };
  },
  filters:{
    timeFilter(val) {
      if(val) return parseTime(val)
    },
  },
  created(){
    this.queryList.userId = VueCookies.get("userId")
    this.getBillList()
  },
  methods: {
    getBillList() {
      this.$http.billList(this.queryList).then( r => {
        this.total = r.data.totalCount
        this.list = r.data.data
      })
    },
    changePage(page) {
      this.queryList.page = page
      this.getBillList()
    }
  },
};
</script>

<style scoped>
.bill {
  border: 1px solid #dcdcdc;
  border-bottom: none;
}
.bill .bill_info {
  height: 40px;
  border-bottom: 1px solid #dcdcdc;
  background: #fafafa;
  line-height: 40px;
}
.bill .bill_info .title {
  margin-left: 10px;
  border-left: 2px solid #ff2832;
  padding-left: 10px;
  /* float: right; */
}
.bill .ivu-page{
    float:right;
    margin-top: 10px;
}
</style>