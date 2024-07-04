<template>
  <div class="edit-login-background-configure" :style="mainminheight">
    <div style="width:30%">
       <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item prop="serviresType">
                <div style="font-size:18px;font-weight:900;margin-bottom:10px"><span style="color:#fe000c">*</span>登录页背景图：<span class="colccc">建议上传图片宽高比例为：1080 x 1920</span> </div>
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
      ImageList: [],
      flag: false, // 是否删除图片
      uploadUrl: `${process.env.api}/web/config/serviceConfiguration/addServiceConfiguration`,
      imageFileRaw: '',
      videoFileList: [],
      videoFileRaw: '',
      ruleForm: {},
      rules: {
        type: [
          { required: true, message: '请输入服务类型', trigger: 'blur' }
        ],
        sop: [
          { required: true, message: '请选择sop文件', trigger: 'change' }
        ]
      },
      key: 1, // table key
      imageUrl: '',
      hideUpload: false,
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
          if (res.data.data.videoUrl) {
            this.videoFileList.push({
              name: res.data.data.videoUrl.split('/')[res.data.data.videoUrl.split('/').length - 1],
              url: res.data.data.videoUrl
            })
          }
        }
      })
    },
    //   返回未登录页列表
    retunStep () {
      this.$router.push({ // 核心语句
        path: '/LoginConfigure' // 跳转的路径
      })
    },
    handleChange (file, fileList) {
      if (!file.raw.type.startsWith('image')) {
        this.ImageList = []
        this.$message.error('只能上传图片类型文件')
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 50
      if (!isLt2M) {
        this.ImageList = []
        this.$message.error('上传图片大小不能超过 50MB!')
        return
      }
      this.imageFileRaw = file.raw
      this.flag = false
      this.ImageList = [{
        url: file.url
      }]
      this.hideUpload = fileList.length >= 1
    },
    handleRemove (file, fileList) {
      this.imageFileRaw = ''
      this.flag = true
      setTimeout(() => {
        this.ImageList = []
        this.hideUpload = fileList.length >= 1
      }, 500)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传前回调
    beforeUploadVideo (file) {
    },
    handleVideoRemove (file, fileList) {
      this.videoFileList = []
      this.videoFileRaw = ''
    },
    submitData () {
      if (!this.ImageList.length) {
        this.$message({
          type: 'error',
          message: '请先上传背景图片'
        })
        return
      }
      this.$confirm('请确认是否提交数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = new FormData()
        param.append('newsNumber', this.$route.query.newsNumber)
        param.append('imgFile', this.imageFileRaw)
        this.requestMethodPost('/web/composite/updateBigBanner', param).then(res => {
          if (res.data.code == 1000) {
            this.$message({
              type: 'success',
              message: '保存成功'
            })
            setTimeout(() => {
              this.$router.push({ // 核心语句
                path: '/LoginConfigure' // 跳转的路径
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
  .edit-login-background-configure {
    position: relative;
    overflow: auto;
    padding: 20px 30px 0;
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
        width: 100px;
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
    }
    .el-upload-list__item{
      height: 600px !important;
      width: 350px !important;
    }
    .el-upload.el-upload--picture-card {
      height: 600px !important;
      line-height: 600px !important;
      width: 350px !important;
    }
  }
</style>
