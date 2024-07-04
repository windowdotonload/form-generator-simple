<!--
 * @Company: Inossem
 * @Email: qiuping.li@inossem.com
 * @Autor: LiQiuPing
 * @Date: 2022-11-02 13:46:14
 * @LastEditors: LiQiuPing
 * @LastEditTime: 2022-11-11 11:12:40
-->
<template>
  <el-card class="deviceInfo" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
      <el-divider direction="vertical"></el-divider>
      <span>现场图片</span>
    </div>
    <el-form :model="scenePicturesForm" ref="scenePicturesRef" label-width="auto" label-position="top" style="padding:0 20px;">
      <div style="font-size:14px;color:#C0C4CC;" >建议：请尽量使用横向的图片。图片大小限制：50M，支持.png .jpg .svn .gif格式图片</div>
      <el-row style="margin-top:20px;">
      <div v-for="(item,i) in scenePicturesForm" :key="i">
        <el-col :span="4" class="upload-img" style="width:80px;margin-right:20px;">
          <el-form-item
          :required="item.required"
          style="position:relative;"
          >
          <div style="border-bottom-left-radius:6px;left: 0;text-align: center;border-bottom-right-radius:6px;position: absolute;bottom: 0px;font-size:12px;;width:100%;z-index: 99;background: rgba(0,0,0,0.6);height: 20px;line-height: 20px; display: inline-block;color:#fff" slot="label">{{item.name}}</div>
            <!-- 图片 -->
            <el-upload
              ref="fileRefs"
              v-if="item.type == 'img' && type == 'edit'"
              :class="{'noUploadBtn': item.imgFullDtoUrl.length>0 || item.notShowUploadBtn}"
              style="width:90px;height:80px;"
              :action="uploadUrl"
              accept="image/*"
              list-type="picture-card"
              :limit='1'
              :auto-upload="false"
              :disabled="true"
              :file-list="item.imgFullDtoUrl">
              <i class="el-icon-plus" @click="handlePictureUpload(i)"></i>
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                <span class="el-upload-list__item-actions" style="top: -12px;">
                  <span class="el-upload-list__item-preview"  style="width:5%;">
                    <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(item)"></i>
                  </span>
                  <span style="width:5%;">
                    <i class="el-icon-crop" @click.self="handlePicturePrune(i,item)"></i>
                  </span>
                  <span v-if="!disabled" class="el-upload-list__item-delete" style="width:5%;">
                    <i class="el-icon-delete" @click.self="handleRemove(item)"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <el-dialog :visible.sync="imgDialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          </el-col>
      </div>
      </el-row>
    </el-form>
    <img-cutter ref="imgCutterModal" label="选择本地图片" :crossOrigin="true" :isModal="true" :crossOriginHeader="anonymous" :sizeChange="false" toolBgc="none" :lockScroll="true" :boxWidth="800" :boxHeight="450" :toolBoxOverflow="false" @cutDown="cutDown">
      <div slot="open"></div>
      <div slot="choose"></div>
    </img-cutter>
  </el-card>
</template>

<script>
import imgCutter from '@/components/imgCutter.vue'
export default {
  components: { imgCutter },
  props: {
    type: {
      type: String,
      default: () => {
        return ''
      }
    },
    deviceObj: {
      type: Array,
      default: () => {
        return []
      }
    },
    scenePicturesObj: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      scenePicturesForm: this.scenePicturesObj,
      uploadUrl: '',
      pruneIndex: null,
      imgDialogVisible: false,
      dialogImageUrl: '',
      recommendOilList: [],
      oilBrandList: [],
      oilNameList: [],
      cylinderOilNameList: [],
      currentBrandCode: '',
      cylinderCurrentBrandCode: '',
      oilNameKey: 0,
      cylinderOilNameKey: 0,
      fileList: [],
      dicList: [],
      tempOilBrandCode: ''
    }
  },
  created () {
    this.scenePicturesForm = this.scenePicturesObj
    this.scenePicturesForm.forEach(item => {
      if (item.type === 'img') {
        item.isUpload = true
        if (item.imgFullDtoUrl.length > 0) {
          item.notShowUploadBtn = true
          item.tempImagePath = item.imgFullUrl[0]
        } else {
          item.notShowUploadBtn = false
        }
      }
    })
  },
  methods: {
    // 上传前置
    beforelubricationImgUpload (file) {
    },
    // 上传
    handlePictureUpload (index) {
      this.pruneIndex = index
      this.$refs.imgCutterModal.handleOpen()
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath (objData, path) {
      const params = {
        url: path
      }
      this.requestMethodGet('/web/file/getFullUrl', params).then(res => {
        if (res.data.code === 1000) {
          objData.value = path
          objData.imgFullDtoUrl = [{
            name: objData.nameKey,
            url: res.data.data
          }]
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 预览
    handlePictureCardPreview (obj) {
      const params = {
        url: obj.value
      }
      this.requestMethodGet('/web/file/getFullUrl', params).then(res => {
        if (res.data.code === 1000) {
          this.dialogImageUrl = res.data.data
          this.imgDialogVisible = true
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 移除
    removeFileChange (obj) {
      obj.data.notShowUploadBtn = false
      obj.data.value = ''
      obj.data.imgFullUrl = []
      obj.data.imgFullDtoUrl = []
    },
    /**
     * @Description: 图片删除
     * @Author: LiQiuPing
     * @param {*} fileList
     */
    handleRemove (fileList) {
      fileList.notShowUploadBtn = false
      fileList.value = ''
      fileList.imgFullUrl = []
      fileList.imgFullDtoUrl = []
    },
    /**
     * @Description: 图片返显
     * @Author: LiQiuPing
     * @param {*} file
     * @param {*} callback
     */
    imgBackShow (file, callback) {
      callback(file[0].url)
    },
    /**
     * @Description: 图片裁剪
     * @Author: LiQiuPing
     * @param {*} fileList
     */
    handlePicturePrune (index, fileList) {
      this.pruneIndex = index
      let url = fileList.imgFullDtoUrl[0].url
      this.$refs.imgCutterModal.handleOpen({
        name: 'img',
        src: url,
        width: 400,
        height: 400
      })
    },
    /**
     * @Description: 裁剪
     * @Author: LiQiuPing
     * @param {*} fileName
     */
    cutDown (fileName) {
      let cutDownData = this.scenePicturesForm[this.pruneIndex]
      var imgGs = fileName.dataURL.split(';')[0].split('/')[1]
      var file = this.dataURLtoBlob(fileName.dataURL, '裁剪图片.' + imgGs)
      var formData = new FormData()
      formData.append('fileType', 'lubrication_point')
      formData.append('multipartFiles', file)
      cutDownData.imgFullDtoUrl = [{
        name: file.name,
        url: file.url
      }]
      this.requestMethodPost('/web/file/uploadFiles', formData).then(res => {
        res = res.data
        if (res.code === 1000) {
          cutDownData.tempImagePath = res.data[0]
          this.getFullImgPath(cutDownData, res.data[0])
          cutDownData.value = res.data[0]
        } else {
          cutDownData.imgFullDtoUrl = []
          cutDownData.notShowUploadBtn = false
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      }).catch(res => {})
    },
    /**
     * @Description: base64转换为file
     * @Author: LiQiuPing
     * @param {*} dataurl
     * @param {*} name
     */
    dataURLtoBlob (dataurl, name) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], name, { type: mime })
    }
  }
}
</script>

<style lang='less'>
.upload-img  .el-upload--picture-card {
  width:80px;
  height:80px;
  line-height: 80px;
}
.noUploadBtn .el-upload--picture-card {
      display: none;
  }
.upload-img .el-upload-list--picture-card .el-upload-list__item {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    margin: 0 8px 8px 0;
    display: inline-block;
}
.upload-img .el-upload--picture-card i {
    font-size: 18px;
    color: #8c939d;
}
/deep/  .el-upload-list__item {
    transition: none ;
  }
.hide .el-upload--picture-card {
      display: none;
  }
</style>
<style lang="less" scoped>
.el-upload-list--picture-card .el-upload-list__item-actions{
  width:90px;
  margin-left: -12px;
  padding-top:12px;
}
.deviceInfo .el-upload-list__item-thumbnail{
  width: 90px;
  height: 90px;
  object-fit: cover;
}
</style>
