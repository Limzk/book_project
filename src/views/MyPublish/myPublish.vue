<template>
  <div class="publish_content">
    <div class="publish_amount">
        <strong>当前发布物品总数：6</strong>
    </div>
    <div class="publish_detail">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="物品名称 Consistency" name="1">
                <div class="object_photo">
                </div>
                <div class="object_message">
                    <div class="object_label">
                        <span>租借时间：&nbsp;&nbsp;</span>
                        <span>2</span>
                    </div>
                    <div class="object_label">
                        <span>租借时间：&nbsp;&nbsp;</span>
                        <span>2</span>
                    </div>
                </div>
                <div class="object_operate">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" transition="el-fade-in-linear">
                        <el-button size="mini" circle icon="el-icon-edit" type="primary" ></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="详情" placement="top-start">
                        <el-button size="mini" circle icon="el-icon-s-order" type="warning"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="下架" placement="top-start">
                        <el-button size="mini" circle icon="el-icon-sort-down" type="danger" @click="down"></el-button>
                    </el-tooltip>
                                       
                </div>
            </el-collapse-item>
            <el-collapse-item title="物品名称 Feedback" name="2">
                <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
            </el-collapse-item>
            <el-collapse-item title="物品名称 Efficiency" name="3">
                <div>简化流程：设计简洁直观的操作流程；</div>
                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
            </el-collapse-item>
            <el-collapse-item title="物品名称 Controllability" name="4">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
            <el-collapse-item title="物品名称 Efficiency" name="5">
                <div>简化流程：设计简洁直观的操作流程；</div>
                <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
                <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
            </el-collapse-item>
            <el-collapse-item title="物品名称 Controllability" name="6">
                <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
                <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
        </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
    name:'myPublish',
    data() {
        return {
            activeNames: ['1']
        }
    },
    methods: {
        handleChange(){
            
        },
        down() {
            this.$confirm('是否下架该物品', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$notify({
                    title: '下架成功！',
                    message: '可在下架物品中查看',
                    position: 'bottom-right',
                    duration: 2000,
                    type:'success',
                });
     
            }).catch(() => {
        
            });
        }
    },
}
</script>

<style scoped>
.publish_content{
  width: 80%;
  height: 800px;
  background-color: pink;
  margin: 0 auto;
  margin-top: -19px;
  font-size:14px;
}
.publish_content .publish_amount{
    padding: 6px 0;
}
.publish_content .publish_detail{
    margin-top: 40px;
}
.publish_detail .object_photo {
    float: left;
    width: 35%;
    height: 300px;
    background: #409eff;
}
.publish_detail .object_message {
    width: 40%;
    height: 250px;
    background: #e6a23c;
    float:left;
    margin-left: 10%;  
}
.object_message .object_label {


}
.publish_detail .object_operate {
    width: 60%;
    height: 50px;
    background: #67c23a;
    float:left;
    text-align: right;   
}
.object_operate .el-button{
    margin-top: 10px;
}

</style>