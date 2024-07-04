const vm = new Vue();

export default class FileLoading {
  ___loading;
  constructor() {}
  LOADING(text) {
    this.___loading = vm.$loading({
      lock: true,
      text: text || "正在上传文件中，请稍后...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
  }
  ENDLOADING() {
    this.___loading.close();
  }
}

export const fullScreen_loading = new FileLoading();
