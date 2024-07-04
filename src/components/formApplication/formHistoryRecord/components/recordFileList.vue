<template>
  <div class="file-list-container">
    <div class="file-list-line-item" v-for="item in fileList" :key="item._uid">
      <div class="file-list-line-item-left">
        <img src="../../assets/icon/pdf.svg" style="margin-right:10px" />
        <div>{{ item.name }}</div>
      </div>
      <div class="file-list-line-item-right">
        <img src="../../assets/icon/download.svg" style="width:26px;height:28px" @click="downLoadFile(item)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fileListString: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      fileList: []
    };
  },
  created() {
    this.getFileList();
  },
  methods: {
    async getFileList() {
      if (!this.fileListString) return;
      const Paths = this.fileListString.split(",");
      const res = await this.getFullPathBatch(Paths);
      const fullPaths = res.map(item => item.data.data);
      this.fileList = Paths.map((halfPath, index) => ({
        name: halfPath.split("/")[halfPath.split("/").length - 1],
        url: fullPaths[index],
        halfPath,
        _uid: new Date().getTime() + halfPath + index
      }));
    },
    async getFullPathBatch(paths) {
      const reqs = paths.map(path => this.getFullPath(path));
      return Promise.all(reqs);
    },
    async getFullPath(path) {
      return await this.requestMethodGetTip("/web/file/getFullUrl", {
        url: path
      });
    },
    async downLoadFile(item) {
      const res = await this.requestMethodGet("/web/file/getFullDownloadUrl", { url: item.halfPath });
      window.open(res.data.data);
    }
  }
};
</script>

<style lang="less" scoped>
.file-list-container {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  background: rgba(153, 153, 153, 0.08);
}
.file-list-line-item-left {
  align-items: center;
  width: fit-content;
  display: flex;
  flex-wrap: nowrap;
}
.file-list-line-item {
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: space-between;
  flex-wrap: nowrap;
}
.file-list-line-item-right {
  cursor: pointer;
}
</style>
