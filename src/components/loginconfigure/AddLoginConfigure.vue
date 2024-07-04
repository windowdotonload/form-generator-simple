<template>
  <div class="edit-configure" :style="mainminheight">
    <div style="margin-top: 30px;width:32%">
       <el-form ref="ruleForm" class="demo-ruleForm">
            <el-form-item prop="title">
                <div style="font-size:18px;font-weight:900"> 标题：<span class="colccc">覆盖在banner图片上,字体颜色为白色(15字)</span> </div>
                <el-input v-model="ruleForm.title" maxlength="15" clearable placeholder="请输入" size="small"></el-input>
            </el-form-item>
            <el-form-item prop="serviresType">
                <div style="font-size:18px;font-weight:900"><span class="red">*</span>图片：<span class="colccc">建议上传图片大小10M以内,图片尺寸比例为3:4</span> </div>
                <imgUpload :loopItem="loopItem" @getImagePath="getImagePath"/>
            </el-form-item>
            <el-form-item prop="status">
              <div style="display:flex;align-items:center;">
                <div style="font-size:18px;font-weight:900"> <span class="red">*</span>状态：</div>
                <el-radio-group v-model="ruleForm.status">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">停用</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item prop="linkType">
              <div style="display:flex;align-items:center;">
                <div style="font-size:18px;font-weight:900"> <span class="red">*</span>跳转链接：</div>
                <el-select v-model="ruleForm.linkType" placeholder="请选择" size="small" style="width: 30%" @change="linkTypeChange">
                  <el-option v-for="item in firstOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="ruleForm.childLinkType" v-if="ruleForm.linkType==2" placeholder="请选择" size="small" style="width: 35%;margin-left:20px;">
                  <el-option v-for="item in childOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item prop="linkUrl" v-if="ruleForm.linkType==4||ruleForm.linkType==5">
                <div style="font-size:18px;font-weight:900"><span class="red">*</span>URL：<span class="colccc">请填写与MSDP关联认证的小程序/公众号URL</span></div>
                <el-input v-model="ruleForm.linkUrl" clearable placeholder="请输入" size="small"></el-input>
            </el-form-item>
            <el-form-item prop="appId" v-if="ruleForm.linkType==3">
                <div style="font-size:18px;font-weight:900"><span class="red">*</span>appId：<el-input v-model="ruleForm.appId" clearable placeholder="请输入" size="small"></el-input></div>
            </el-form-item>
            <el-form-item prop="linkUrl" v-if="ruleForm.linkType==3">
                <div style="font-size:18px;font-weight:900"><span class="red">*</span>跳转路径：<span class="colccc">pages/index/index</span></div>
                <el-input v-model="ruleForm.linkUrl" clearable placeholder="请输入" size="small"></el-input>
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
import imgUpload from './ImageUpload.vue'
export default {
  name: 'HelloWorld',
  data () {
    return {
      isCutter:false,
      firstOptions:[{value:1,label:'登录页'},{value:2,label:'功能菜单'},{value:3,label:'小程序'},{value:4,label:'公众号文章'},{value:5,label:'H5页面'}],
      childOptions:[{value:1,label:'服务介绍'},{value:2,label:'润滑知识学堂'},{value:3,label:'计算工具'},{value:4,label:'产品手册'},{value:5,label:'润滑常见问答'}],
      value: true,
      mainminheight: `height:${document.documentElement.clientHeight - 180}px`,
      hidden: true,
      activeName: 'first',
      uploadUrl: '',
      ruleForm: {
        linkUrl:'',
        title:'',
        status:0,
        linkType:1,
        appId:'',
        imgPath:''
      },
      ImageList: [],
      key: 1, // table key
      imageUrl: '',
      totalNumber: 0, // 总条数
      currPageNumber: 1, // 当前页
      workStatusOptions: [], // 状态
      pagesize: 30, // 当前页展示条
      hideUpload: false,
      dialogImageUrl: '',
      dialogVisible: false,
      loopItem:{
        imgFullDtoUrl:[],
        length:1,
      }
    }
  },
  computed: {
  },
  components:{
    imgUpload
  },
  methods: {
    //   返回未登录页列表
    retunStep () {
      this.$router.push({ // 核心语句
        path: '/LoginConfigure' // 跳转的路径
      })
    },
    linkTypeChange() {
      this.ruleForm.linkUrl=''
      this.ruleForm.appId = ''
    },
    handleAddFile (file, fileList) {
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
      this.ImageList.push({ url: file.url })
      let params = new FormData()
      params.append('fileType', 'banner_conf')
      params.append('multipartFiles', file.raw)
      this.requestMethodPost('/web/file/uploadFiles', params)
      .then(res => {
          res = res.data
          if (res.code == 1000) {
          this.ImageList.map(item => {
              if (item.url == file.url) {
              item.raw = res.data[0]
              }
          })
          this.hideUpload = fileList.length >= 1
          } else {
          this.$message({
              message: res.msg,
              type: 'warning'
          })
          }
      })
      .catch(res => {})
    },
    handleRemove (file, fileList) {
      this.ImageList.splice(this.ImageList.findIndex(item => item.url === file.url), 1)
      setTimeout(() => {
        this.hideUpload = fileList.length >= 1
      }, 500)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    submitData () {
      if (this.ruleForm.imgPath=='') {
        this.$message({
          type: 'error',
          message: '请先上传图片'
        })
        return
      }
      if(this.ruleForm.linkType==2&&!this.ruleForm.childLinkType){
        this.$message({
          type: 'error',
          message: '请选择二级跳转链接'
        })
        return
      }
      if(!this.ruleForm.linkUrl&&(this.ruleForm.linkType==3)){
        this.$message({
          type: 'error',
          message: '请输入跳转路径'
        })
        return
      }
      if(!this.ruleForm.appId&&(this.ruleForm.linkType==3)){
        this.$message({
          type: 'error',
          message: '请输入小程序appid'
        })
        return
      }
      if(!this.ruleForm.linkUrl&&(this.ruleForm.linkType==4||this.ruleForm.linkType==5)){
        this.$message({
          type: 'error',
          message: '请输入URL'
        })
        return
      }
      if ((this.ruleForm.linkType==4||this.ruleForm.linkType==5)&&this.ruleForm.linkUrl && !this.ruleForm.linkUrl.startsWith('http')) {
        this.$message({
          type: 'error',
          message: '请输入正确的url,只能时http/https'
        })
        return
      } else {
        let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
        if (reg.test(this.ruleForm.linkUrl)) {
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
        let url = '/conf/loginPage/addBanner'
        let param = {
          title: this.ruleForm.title,
          status: this.ruleForm.status,
          linkType: this.ruleForm.linkType,
          linkUrl: this.ruleForm.linkUrl||'',
          appId: this.ruleForm.appId||''
        }
        if(this.ruleForm.linkType==2){
          param.childLinkType = this.ruleForm.childLinkType
        }
        if(this.$route.query&&this.$route.query.rowData){
          param.id = this.ruleForm.id
          url='/conf/loginPage/editBanner'
          if(this.isCutter){
          param.imgPath = this.ruleForm.imgPath
          }
        }else{
          param.imgPath = this.ruleForm.imgPath

        }
        this.requestMethodPost(url, param).then(res => {
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
    },
    getImagePath(path) {
      this.ruleForm.imgPath = path
      this.isCutter = true
    },
  },
  mounted () {
    if(this.$route.query&&this.$route.query.rowData){
      this.ruleForm = this.$route.query.rowData;
      this.loopItem.imgFullDtoUrl.push({urlHalf:'',url:this.ruleForm.imgPath,uid:this.ruleForm.createTime})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .edit-configure {
    position: relative;
    overflow: auto;
    padding: 20px 30px 0;
    // .el-upload--picture-card,
    // .el-upload-list--picture-card .el-upload-list__item{
    //   width: 100% !important;
    // }
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
        left:16%;
    }
  }
</style>
