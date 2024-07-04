<template>
  <div v-loading="revert ? loadingRevert : false">
    <div :class="imgFiles.length < 3 ? '' : 'hideUpload'">
      <div class="tip" style="margin-bottom: 5px">上传图片 <span class="tip" style="margin-top: 5px; font-size: 12px;color: #999;">（最多上传3张，10M以内.jpg .png .gif .svg格式的图片）</span></div>
      <el-upload :file-list="fileList" ref="uploadImg" action="" list-type="picture-card" :limit="3" :on-remove="removeFile" :http-request="uplaodImg" accept=".jpg,.png,.gif,.svg">
        <i class="el-icon-plus"></i>
      </el-upload>
    </div>
    

    <div>
      <div class="tip" style="margin-bottom: 5px; margin-top: 15px">上传视频 <span class="tip" style="margin-top: 5px; font-size: 12px;color: #999;">（选填，视频大小不能超过500M）</span></div>
      <el-upload class="avatar-uploader" ref="uploadVideo" :show-file-list="false" :disabled="uploadVidepSrc != ''" :multiple="false" :limit="1" action="" :http-request="uplaodVideo" accept=".mp4">
        <div v-show="uploadVidepSrc" style="display: flex; align-items: flex-start">
          <video :src="uploadVidepSrc" controls="controls" style="height: 148px"></video>
          <span style="color: #d10000; margin-left: 5px; cursor: pointer" @click.stop="removeVideo">删除</span>
        </div>
        <i v-show="!uploadVidepSrc" class="el-icon-plus avatar-uploader-icon upload-box"></i>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { fullScreen_loading } from "../../../generalComponents/fullScreenLoading";
import OSSClient from "../../../utils/ossClient";
const oss_client = new OSSClient();
export default {
  props: {
    loadingRevert: {
      type: Boolean
    },
    revert: {
      type: Boolean
    },
    revertImg: {
      type: Array
    },
    revertVideo: {
      type: String
    },
    revertVideoHalfPath: {
      type: String
    }
  },

  data() {
    return {
      loadingAttr: "",
      rawRevertAssets: null,
      fileList: [],
      imgFiles: [],

      uploadFile: null,
      uploadVidepSrc: "",
      videoHalfPath: ""
    };
  },
  mounted() {
    this.fileList = [];
    if (this.revert) {
      this.fileList = this.revertImg;
      this.imgFiles = this.revertImg.map(item => item.halfPath);
      this.uploadVidepSrc = this.revertVideo;
      this.videoHalfPath = this.revertVideoHalfPath;
    }
  },

  methods: {
    cancelUplaod() {
      this.$refs.uploadImg.clearFiles();
      this.$refs.uploadVideo.clearFiles();
      this.imgFiles = [];
      this.uploadFile = null;
      this.uploadVidepSrc = "";
    },
    async getUplaodAssets() {
      const res = {
        videoUrl: "",
        serviceImgUrl: ""
      };
      if (this.imgFiles.length > 0) res.serviceImgUrl = this.imgFiles.join(",");
      res.videoUrl = this.videoHalfPath;
      return res;
    },
    uplaodImg(file) {
      const isLt100M = file.file.size / 1024 / 1024 < 10;
      if (!isLt100M) {
        this.$message({
          type: "error",
          message: "请选择10M以内的文件"
        });
        this.$refs.uploadImg.abort();
        return;
      }
      this.AddOssFile(file.file, this.imgFiles);
    },
    AddOssFile(file, recordTarget) {
      const loading = this.$loading({
        lock: true,
        text: "正在上传文件中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = new FormData();

      params.append("fileType", "service_apply_img");
      params.append("multipartFiles", file);
      this.requestMethodPost("/web/file/uploadFiles", params).then(res => {
        res = res.data;
        if (res.code == 1000) {
          file.halfPath = res.data[0];
          recordTarget.push(res.data[0]);
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        loading.close();
      });
    },
    removeFile(file) {
      let rawFile;
      if (file.raw) rawFile = file.raw;
      else rawFile = file;
      const { halfPath } = rawFile;
      const removeIndex = this.imgFiles.indexOf(halfPath);
      this.imgFiles.splice(removeIndex, 1);
    },

    async uplaodVideo(file) {
      const isLt100M = file.file.size / 1024 / 1024 < 300;
      if (!isLt100M) {
        this.$message({
          type: "error",
          message: "请选择300M以内的文件"
        });
        this.$refs.uploadVideo.abort();
        return;
      }
      this.uploadVidepSrc = window.URL.createObjectURL(file.file);
      this.uploadFile = file.file;
      fullScreen_loading.LOADING();
      await oss_client.getOSSClientInstance();
      const uploadFileRes = await oss_client.uploadFile(file.file, file.file.name);
      fullScreen_loading.ENDLOADING();
      if (uploadFileRes && uploadFileRes.name) {
        this.videoHalfPath = uploadFileRes.name;
      } else {
        this.$message({
          type: "warning",
          message: "文件上传失败，请稍后重试。"
        });
      }
    },
    removeVideo() {
      this.uploadFile = null;
      this.uploadVidepSrc = "";
      this.videoHalfPath = "";
      this.$refs.uploadVideo.clearFiles();
    }
  }
};
</script>

<style scoped lang="less">
.hideUpload {
  /deep/ .el-upload--picture-card {
    display: none;
  }
}
/deep/ .el-upload--picture-card,.upload-box {
  width: 80px !important;
  height: 80px !important;
  line-height: 80px !important;
}
.upload-box {
  font-size: 28px;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  line-height: 146px;
  vertical-align: top;
}
</style>
