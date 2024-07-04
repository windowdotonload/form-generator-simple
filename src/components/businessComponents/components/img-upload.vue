<template>
  <div>
    <el-upload
      :class="{ isShowUploadBtn: (loopItem.imgFullDtoUrl.length >= loopItem.length || notShowUploadBtn) }"
      :action="uploadUrl"
      accept="image/*"
      list-type="picture-card"
      :limit="loopItem.length"
      :auto-upload="false"
      :disabled="true"
      :file-list="loopItem.imgFullDtoUrl">
      <div style="width:148px;height:148px;" @click="handlePictureUpload(loopItem)">
        <i class="el-icon-plus"></i>
      </div>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
          <span class="el-upload-list__item-preview">
            <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, loopItem)"></i>
          </span>
          <span class="el-upload-list__item-preview">
            <i class="el-icon-crop" @click.self="handlePicturePrune(file, loopItem)"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete">
            <i class="el-icon-delete" @click.self="handleRemove(file, loopItem)"></i>
          </span>
        </span>
      </div>
  </el-upload>
  <!-- 查看图片 -->
  <el-dialog :visible.sync="imgDialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="" />
  </el-dialog>
  <!-- 图片裁剪 -->
    <img-cutter
      ref="imgCutterModal"
      label="选择本地图片"
      :crossOrigin="true"
      :isModal="true"
      :crossOriginHeader="anonymous"
      :sizeChange="false"
      toolBgc="none"
      :lockScroll="true"
      :boxWidth="800"
      :boxHeight="450"
      :cutWidth="cutWidth"
      :cutHeight="cutHeight"
      :toolBoxOverflow="false"
      @cutDown="val => cutDown(val, item)"
    >
      <div slot="open"></div>
      <div slot="choose"></div>
    </img-cutter>
  </div>
</template>

<script>
import imgCutter from '@/components/imgCutter.vue'
export default {
  components: { imgCutter },
  props:{
    loopItem:{
      type:Object,
      default:()=>{
        return {}
      }
    },
  },
  data() {
    return {
      pruneIndex: null,
      uploadUrl:'',
      imgDialogVisible:false,
      dialogImageUrl:'',
      cutFileList:{},
      cutFlag: false,
      notShowUploadBtn: false,
      tempImagePath: '',
      cutWidth:200,
      cutHeight:200,
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val) && val.styleJsonDto){
          this.cutWidth = val.styleJsonDto.cutWidth?val.styleJsonDto.cutWidth:200
          this.cutHeight = val.styleJsonDto.cutHeight?val.styleJsonDto.cutHeight:200
        }
      },
      immediate:true
    },
  },
  created(){
    if(this.loopItem.nameKey == "device_img"){
      this.cutWidth = 700
      this.cutHeight = 394
    }
  },
  methods: {
    // 预览
    handlePictureCardPreview(file, item){
      this.dialogImageUrl = file.url
      this.imgDialogVisible = true
    },
    // 点击上传
    handlePictureUpload(item){
      this.cutFileList = item
      this.cutFlag = false
      this.$refs.imgCutterModal.handleOpen()
    },
    // 裁剪
    handlePicturePrune(file, item){
      this.cutFlag = true
      this.cutFileList = item
      item.imgFullDtoUrl.forEach((ele, i) => {
        if (file.uid === ele.uid) {
          this.pruneIndex = i
        }
      })
      let url = item.imgFullDtoUrl[this.pruneIndex].url
      this.$refs.imgCutterModal.handleOpen({
        name: 'img',
        src: url,
        width: 400,
        height: 400
      })
    },
    // 图片返显
    imgBackShow (file, pruneIndex, callback) {
      callback(file[pruneIndex].url)
    },
    // 裁剪确定
    cutDown(fileName){
      let cutDownData = this.cutFileList
      // console.log('裁剪确定....',fileName,cutDownData)
      var imgGs = fileName.dataURL.split(';')[0].split('/')[1]
      var file = this.dataURLtoBlob(fileName.dataURL, '裁剪图片.' + imgGs)
      var formData = new FormData()
      formData.append('fileType', 'lubrication_point')
      formData.append('multipartFiles', file)
      this.requestMethodPost('/web/file/uploadFiles', formData)
        .then(async res => {
          res = res.data
          if (res.code === 1000) {
            cutDownData.tempImagePath = res.data[0]
            this.getFullImgPath(cutDownData, res.data[0], this.cutFlag)
            cutDownData.value = res.data[0]
          } else {
            // cutDownData.imgFullDtoUrl = []
            cutDownData.notShowUploadBtn = false
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
    },
    // base64转换为file
    dataURLtoBlob(dataurl, name) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], name, { type: mime });
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath(item, path, flag) {
      // 轴承检查报告-轴承运行参数-轴承结构术语描述图片（仅供参考）
      // if (item.nameKey == "key_zcjgsyms_pic") {
      //   item.value = ""
      //   item.imgFullDtoUrl = []
      //   return
      // }
      const params = {
        url: path
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          let pathUrl = [];
          if (flag) {
            item.imgFullDtoUrl[this.pruneIndex].url = res.data.data;
            item.imgFullDtoUrl[this.pruneIndex].urlHalf = path;
            item.value = path;
          } else {
            item.imgFullDtoUrl.push({
              urlHalf: path,
              name: item.nameKey,
              url: res.data.data
            });
            item.imgFullDtoUrl.map(el => {
              pathUrl.push(el.urlHalf);
            });
            item.value = pathUrl.toString();
          }
          // console.log('===========',this.loopItem,item)
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 删除
    handleRemove(file, item){
      item.imgFullDtoUrl.forEach((ele, i) => {
        if (file.uid === ele.uid) {
          this.pruneIndex = i
        }
      })
      item.imgFullDtoUrl.splice(this.pruneIndex, 1)
      let valueArr = _.isEmpty(item.value)?[]:item.value.split(',')
      if(!_.isEmpty(valueArr)){
        valueArr.forEach((it,idx)=>{
          if(it == file.urlHalf){
            valueArr.splice(idx,1)
          }
        })
      }
      item.value = valueArr.join(',')
      // console.log('==========',file, item)
    },
  }
};
</script>
<style lang='less'>
  .isShowUploadBtn .el-upload {
    display: none;
  }
</style>

