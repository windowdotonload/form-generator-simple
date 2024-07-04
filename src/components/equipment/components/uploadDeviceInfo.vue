<template>
  <div class="layout-container">
    <el-dialog title="文件信息" :visible.sync="dialogVisible" width="26%" :before-close="cancel">
      <el-form ref="uploadForm" hide-required-asterisk :rules="uploadRules" :model="uplodForm" label-position="top">
        <el-form-item>
          <template #label>
            <h3 style="margin: 0">状态</h3>
          </template>
          <el-radio v-model="uplodForm.status" label="1">使用中</el-radio>
          <el-radio v-model="uplodForm.status" label="0">已停用</el-radio>
        </el-form-item>
        <el-form-item label="文件描述">
          <template #label>
            <h3 style="margin: 0">文件描述</h3>
          </template>
          <el-input type="textarea" placeholder="请输入内容" maxlength="20" show-word-limit v-model="uplodForm.fileDesc" />
        </el-form-item>
        <el-form-item v-if="!editFlag">
          <template #label>
            <h3 style="margin: 0; margin-bottom: 5px">上传文件</h3>
          </template>
          <BatchUploadFile ref="BatchUpload" />
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: flex-end">
        <el-button size="small" style="margin-right: 10px" @click="cancel">取消</el-button>
        <el-button size="small" type="danger" @click="updateFile" v-if="editFlag">保存</el-button>
        <el-button size="small" type="danger" @click="uploadFormFile" v-else>上传文件</el-button>
        <el-upload
          class="upload-demo"
          action=""
          :limit="1"
          accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
          ref="upload"
          :file-list="fileList"
          :show-file-list="false"
          :http-request="handleUploadFile"
          :auto-upload="true"
        >
          <el-button size="small" type="danger" style="display: none" ref="uploadBtn"></el-button>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BatchUploadFile from "../../deviceDocument/components/BatchUploadFile.vue";
import mixin from "../../deviceDocument/mixin/index";
export default {
  props: {
    successCb: {
      type: Function
    }
  },
  mixins: [mixin],
  components: {
    BatchUploadFile
  },
  data() {
    return {
      dialogVisible: false,
      editFlag: false,
      uplodForm: {
        status: "1",
        fileDesc: "",
        filePath: ""
      },
      batchUploadFileList: []
    };
  },
  methods: {
    openDialog(info) {
      this.uplodForm.deviceId = info.deviceId;
      this.uplodForm.companyId = info.companyId;
      if (info.editFlag && info.editFlag == 1) {
        this.uplodForm.fileDesc = info.fileInfo.fileDesc || "";
        this.uplodForm.status = info.fileInfo.status ? info.fileInfo.status.toString() : "1";
        this.uplodForm.id = info.fileInfo.id;
        this.editFlag = true;
      }
      this.dialogVisible = true;
    },
    cancel() {
      if (this.editFlag) {
        this.$refs.BatchUpload && this.$refs.BatchUpload.resetUplaod();
      }
      this.uplodForm = {
        status: "1",
        fileDesc: ""
      };
      this.editFlag = false;
      this.dialogVisible = false;
    },
    async uploadFormFile() {
      this.batchUploadFileList = this.$refs.BatchUpload.uploadFileList;
      if (this.batchUploadFileList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择文件"
        });
        return;
      }

      const uplaodRes = await this.batchUpload(this.saveDeviceFile, this.uplodForm);
      const allSuccessfFlag = uplaodRes.every(item => item == 200);
      console.log("allSuccessfFlag", allSuccessfFlag);
      if (allSuccessfFlag) {
        this.$message({
          type: "success",
          message: "文件上传成功"
        });

        this.successCb();
        this.cancel();
        this.$refs.BatchUpload.resetUplaod();
      }
    },

    saveDeviceFile(uplodForm) {
      return this.requestMethodPost("/web/deviceInstructions/saveDeviceInstructions", { ...uplodForm }).then(res => {
        if (res.data.code == 1000) {
          return 200;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
        this.$refs.upload.clearFiles();
      });
    },
    updateFile() {
      delete this.uplodForm.filePath;
      this.requestMethodPost("/web/deviceInstructions/updateDeviceInstructions", { ...this.uplodForm }).then(res => {
        if (res.data.code == 1000) {
          this.cancel();
          this.successCb();
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.layout-container {
  /deep/ .el-dialog__body {
    padding-top: 0;
  }
  /deep/ .el-dialog {
    min-width: 440px;
  }
}
.search-bar {
  margin-top: 20px;
  display: flex;
  /deep/ .el-form {
    display: flex;
  }
  /deep/ .el-form-item {
    display: flex;
    margin-left: 20px;
    margin-bottom: 0;
  }
}
.split-line {
  width: 100%;
  border-bottom: 1px solid #e9e9ee;
}
</style>
