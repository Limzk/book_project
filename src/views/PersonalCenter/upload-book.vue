<template>
  <div class="upload_book">
    <div class="upload_title">
      <span class="title">上传书籍</span>
    </div>
    <div class="upload_info">
      <!-- 图片上传 -->
      <p> <span class="star">*</span>书籍图片</p>
      <div style="text-align:right">
        <div class="demo-upload-list" v-for="item in uploadList">
          <template v-if="item.status === 'finished'">
            <img :src="'http://localhost:8888'+ item.url" />
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          :hearders="{'Content-Type': 'multipart/form-data'}"
          multiple
          type="drag"
          action="/api/cat/book/upload"
          style="display: inline-block;width:58px;"
        >
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
      </div>
      <Modal title="View Image" v-model="visible">
        <img
          :src="'http://localhost:8888' + imgName + '/large'"
          v-if="visible"
          style="width: 100%"
        />
      </Modal>

      <!-- 表单验证 -->
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="margin-top:20px">
        <FormItem label="书籍名称" prop="bookName" >
          <Input v-model="formValidate.bookName" placeholder="请输入书籍名称" maxlength="15" show-word-limit ></Input>
        </FormItem>
        <FormItem label="书籍作者" prop="bookAuthor">
          <Input v-model="formValidate.bookAuthor" placeholder="请输入书籍作者" maxlength="15" show-word-limit></Input>
        </FormItem>
        <FormItem label="书籍类型" prop="bookTypeName">
          <Select v-model="formValidate.bookTypeName" style="width:200px" placeholder="请选择书籍类型">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="价格" prop="amount">
          <InputNumber :min="1" v-model="formValidate.amount"></InputNumber>
          <span> 元/本</span>
        </FormItem>
        <FormItem label="上架数量" prop="bookQuantity">
          <InputNumber :min="1" v-model="formValidate.bookQuantity"></InputNumber>
        </FormItem>
        <div class="formBtn">
          <Button   @click="reset">重置</Button>
          <Button type="primary"  @click="modalOk('formValidate')">确定</Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import VueCookies from "vue-cookies";
export default {
  data() {
    return {
      imgName: "",
      visible: false,
      uploadList: [],
      formValidate: {
        amount:1,
        bookQuantity:1
      },
      typeList: [
        { label: "人文历史", value: "人文历史" },
        { label: "小说集合", value: "小说集合" },
        { label: "科学杂志", value: "科学杂志" },
        { label: "军事理论", value: "军事理论" },
        { label: "体育教学", value: "体育教学" },
        { label: "娱乐时尚", value: "娱乐时尚" },
        { label: "其他", value: "其他" }
      ],
      ruleValidate: {
        bookName: [
          { required: true, message: "书籍名称不能为空！", trigger: "blur" }
        ],
        bookAuthor: [
          { required: true, message: "书籍作者不能为空！", trigger: "blur" }
        ],
        bookTypeName: [
          { required: true, message: "请选择书籍类型！", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      this.formValidate.bookUrl = res.data.bookUrl
    },
    handleFormatError(file) {
      this.$Message.error({
        background: true,
        content: "上传格式不正确，只能上传jpg 或者 png、jpeg."
      });
    },
    handleMaxSize(file) {
      this.$Message.error({
        background: true,
        content: "上传内容不能超过2M"
      });
    },
    handleBeforeUpload(file) {
      const check = this.uploadList.length < 1;
      if (!check) {
        this.$Message.warning({
          background: true,
          content: "只能上传一张图片"
        });
      }
      return check;
    },
     modalOk(name) {
      this.$refs[name].validate((valid) => {
            if (valid) {
                if(!this.formValidate.bookUrl) {
                  this.$Message.error({
                    background:true,
                    content:"请上传书籍图片"
                  })
                  return 
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: `是否确定提交上传书籍？`,
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                      this.formValidate.uploadUserId = VueCookies.get('userId')
                      this.$http.uploadBook(this.formValidate).then( r =>{
                        this.$Message.success({
                            background: true,
                            content: '上传成功！书籍将通过审核后将上架到首页！'
                        });
                        this.reset()
                      })
                    }
                });
            } else {
                
            }
        })  
    },
    // 重置
    reset() {
      this.$refs.formValidate.resetFields()
      this.$refs.upload.clearFiles()
    },
  }
};
</script>

<style scoped>
.upload_book {
  /* height: 240px; */
  border: 1px solid #dcdcdc;
}
.upload_book .upload_title {
  height: 40px;
  border-bottom: 1px solid #dcdcdc;
  background: #fafafa;
  line-height: 40px;
}
.upload_book .upload_title .title {
  margin-left: 10px;
  border-left: 2px solid #ff2832;
  padding-left: 10px;
  /* float: ; */
}
.upload_book .upload_info {
  width: 100%;
  /* float: ; */
  padding: 30px;
}
.upload_book .upload_info .star{
      margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 14px;
    color: #ed4014;
}
.upload_book .upload_info .formBtn{
  text-align: right;
  margin-top:30px;
  letter-spacing: 20px;
}


/* 图片上传样式 */
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>