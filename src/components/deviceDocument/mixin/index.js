import { openLoading, closeLoading } from "../../../api/request";
export default {
  data() {
    return {
      batchHaflPaths: []
    };
  },
  methods: {
    async batchUpload(callback, uplaodParam) {
      /**
       * need [batchUploadFileList] in parent component
       */
      closeLoading();
      const loadingInstance = window.ELEMENT.Loading.service({
        fullscreen: true,
        lock: true,
        text: "上传中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      try {
        const uplaodMap = this.batchUploadFileList.map(fileItem => this.uploadSingleFileToOSS(fileItem.raw));
        const uploadRes = await Promise.all(uplaodMap);
        const cbMap = uploadRes.map(path => callback(Object.assign({}, uplaodParam, { filePath: path }))); //assign filePath
        const callbackRes = await Promise.all(cbMap);
        return callbackRes;
      } catch (e) {
        this.$message({
          type: "warning",
          message: "系统异常，请稍后重试！"
        });
      } finally {
        loadingInstance.close();
        openLoading();
      }
    },
    async uploadSingleFileToOSS(file) {
      let params = new FormData();
      params.append("fileType", "device_Instructions");
      params.append("multipartFiles", file);
      let res = await this.requestMethodPost("/web/file/uploadFiles", params);
      res = res.data;
      if (res.code == 1000) {
        return res.data[0];
      } else {
        this.$message({
          message: res.msg,
          type: "warning"
        });
      }
    }
  }
};
