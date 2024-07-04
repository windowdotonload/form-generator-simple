<template>
  <div>
    <el-upload class="upload-demo" :show-file-list="false" accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png" drag action="" :auto-upload="false" :on-change="changeSelFile">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div class="file-list">
      <div class="file-list-item" v-for="item in uploadFileList" :key="item.uid">
        <span> <span class="el-icon-document" style="margin-right: 5px" />{{ item.name }}</span>
        <i class="el-icon-close" style="cursor: pointer" @click="removeFile(item)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalFileSize: 0,
      uploadFileList: [],
      uploadFileName: []
    };
  },
  methods: {
    resetUplaod() {
      this.totalFileSize = 0;
      this.uploadFileList = [];
      this.uploadFileName = [];
    },
    changeSelFile(file) {
      const continueUpload = this.calcFileSize(file.size + this.totalFileSize);
      if (!continueUpload) return;
      const existFile = this.checkSameNameFile(file.name);
      if (existFile) return;
      this.cacheFile(file);
    },
    removeFile(file) {
      const { name, size } = file;
      this.totalFileSize -= size / 1024 / 1024;
      const fileIndex = this.uploadFileList.findIndex(item => item.name == name);
      const fileNameIndex = this.uploadFileName.findIndex(item => item == name);

      this.uploadFileList.splice(fileIndex, 1);
      this.uploadFileName.splice(fileNameIndex, 1);
    },
    cacheFile(file) {
      this.uploadFileList.push(file);
      this.uploadFileName.push(file.name);
    },
    checkSameNameFile(fileName) {
      let flag = false;
      if (this.uploadFileName.includes(fileName)) {
        flag = true;
        this.$message({
          type: "warning",
          message: "请勿上传重复文件"
        });
      }
      return flag;
    },
    calcFileSize(fileSize, fieSizeLimit = 10) {
      let flag = true;
      const convertSize = fileSize / 1024 / 1024;

      if (this.totalFileSize + convertSize > fieSizeLimit) {
        flag = false;
        this.$message({
          type: "warning",
          message: "一次仅能上传10M的文件"
        });
      } else {
        this.totalFileSize += convertSize;
      }
      return flag;
    }
  }
};
</script>

<style lang="less" scoped>
.file-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  background: #f9f9f9;
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 5px;
  i {
    display: none;
  }
}
.file-list-item:hover {
  cursor: pointer;
  background: rgba(233, 233, 233, 0.8);
  i {
    display: inline-block;
  }
}
</style>
