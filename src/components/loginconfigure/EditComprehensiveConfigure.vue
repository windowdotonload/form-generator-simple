<template>
  <div class="edit-comprehensive-configure" :style="mainminheight">
    <div style="margin-top: 30px;width:30%">
       <el-form ref="ruleForm" class="demo-ruleForm" >
            <el-form-item prop="title">
                <div style="font-size:18px;font-weight:900"> 标题：<span class="colccc">字体颜色白色(25字)</span> </div>
                <el-input v-model="ruleForm.title" maxlength="25" clearable placeholder="请输入" size="small"></el-input>
            </el-form-item>
                <el-form-item prop="newsUrl">
                <div style="font-size:18px;font-weight:900">URL：</div>
                <el-input v-model="ruleForm.newsUrl" size="small"></el-input>
            </el-form-item>
            <el-form-item prop="serviresType">
                <div style="font-size:18px;font-weight:900"><span class="red">*</span>图片：<span class="colccc">建议上传图片大小10M以内,宽高比例为：710*255</span> </div>
                    <el-upload
                        :class="{hide:hideUpload || ImageList.length}"
                        :action="uploadUrl"
                        list-type="picture-card"
                        limit=1
                        accept="image/*"
                        :auto-upload="false"
                        :file-list="ImageList"
                        :before-upload="beforeAvatarUpload"
                        :on-change="handleChange"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
        </el-form>
    </div>
    <div class="foot-botton">
     <el-button type="danger"  @click="submitData" size="small">提交</el-button>
     <el-button type="danger" plain @click="retunStep" size="small">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      value: true,
      mainminheight: `height:${document.documentElement.clientHeight - 180}px`,
      hidden: true,
      activeName: 'first',
      uploadUrl: `${process.env.api}/web/news/newsInfo`,
      ruleForm: {},
      ImageList: [],
      key: 1, // table key
      imageUrl: '',
      totalNumber: 0, // 总条数
      currPageNumber: 1, // 当前页
      workStatusOptions: [], // 状态
      pagesize: 30, // 当前页展示条
      hideUpload: false,
      imageFileRaw: '',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {

  },
  methods: {
    searchTableData () {
      let param = {
        newsNumber: this.$route.query.newsNumber
      }
      this.requestMethodGet('/web/composite/newsInfo', param).then(res => {
        if (res.data.code == 1000) {
          this.ruleForm = res.data.data
          if (res.data.data.picUrl) {
            this.ImageList.push({
              url: res.data.data.picUrl
            })
          }
        }
      })
    },
    //   返回综合页列表
    retunStep () {
      this.$router.push({ // 核心语句
        path: '/ComprehensiveConfigure' // 跳转的路径
      })
    },

    handleChange (file, fileList) {
      if (!file.raw.type.startsWith('image')) {
        this.ImageList = []
        this.$message.error('只能上传图片类型文件')
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.ImageList = []
        this.$message.error('上传图片大小不能超过 10MB!')
        return
      }
      this.ImageList = [{
        url: file.url
      }]
      this.hideUpload = fileList.length >= 1
      this.imageFileRaw = file.raw
    },
    handleRemove (file, fileList) {
      this.imageFileRaw = ''
      setTimeout(() => {
        this.ImageList = []
        this.hideUpload = fileList.length >= 1
      }, 500)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    submitData () {
      if (!this.ImageList.length) {
        this.$message({
          type: 'error',
          message: '请先上传图片'
        })
        return
      }
      if (this.ruleForm.newsUrl && !this.ruleForm.newsUrl.startsWith('http')) {
        this.$message({
          type: 'error',
          message: '请输入正确的url,只能时http/https'
        })
        return
      } else {
        let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
        if (reg.test(this.ruleForm.newsUrl)) {
          this.$message({
            type: 'error',
            message: '请输入正确的url,不能含有中文'
          })
          return
        }
      }
      this.$confirm('请确认是否提交数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = new FormData()
        param.append('newsNumber', this.$route.query.newsNumber)
        param.append('title', this.ruleForm.title || '')
        param.append('newsUrl', this.ruleForm.newsUrl || '')
        param.append('imgFile', this.imageFileRaw)
        this.requestMethodPost('/web/composite/newsUpdate', param).then(res => {
          if (res.data.code == 1000) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            setTimeout(() => {
              this.$router.push({ // 核心语句
                path: '/ComprehensiveConfigure' // 跳转的路径
              })
            }, 1000)
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
      }).catch(() => {})
    },
    onResize () {
      this.mainminheight = `height:${document.documentElement.clientHeight - 180}px`
    }
  },
  mounted () {
    this.searchTableData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .edit-comprehensive-configure {
    position: relative;
    overflow: auto;
    padding: 20px 30px 0;
    .el-upload--picture-card,
    .el-upload-list--picture-card .el-upload-list__item{
      width: 100% !important;
    }
    .el-link {
      margin-right: 10px;
    }
    .el-switch__label.is-active {
      color:red;
    }
    .colccc{
        color: #999;
        font-size: 14px;
        font-weight: 400;
    }
    .red {
      color: red;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .hide .el-upload--picture-card {
        display: none;
    }
    .el-button--danger {
        width: 120px;
    }
    .is-plain {
        background:#fff !important;
    }
    .el-button--danger.is-plain:hover,
    .el-button--danger.is-plain:focus
     {
        color:#F56C6C !important;
    }
    .foot-botton {
        position: fixed;
        bottom:20px;
        left:16%;
    }
  }
</style>
