<template>
  <div>
    <el-upload class="upload-demo" :auto-upload="false" :show-file-list="false" :on-change="file => handleAddFile(file)" accept=".pdf">
      <el-button size="small">{{ loopItem.name }}</el-button>
    </el-upload>
  </div>
</template>

<script>
import OSSClient from "../../../utils/ossClient";
import { fullScreen_loading } from "../../../generalComponents/fullScreenLoading";
const oss_client = new OSSClient();
export default {
  props: {
    loopItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isValidateFileType: {
      type: Boolean,
      default: false
    },
    currentItem: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      fileDtoItem: []
    };
  },
  watch: {
    loopItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          // console.log('val......',val)
        }
      },
      immediate: true
    }
  },
  methods: {
    // 上传附件
    async handleAddFile(file) {
      const fileType = file.name.split(".")[file.name.split(".").length - 1];
      const limitSze = file.size / 1024 / 1024 < 50;
      if (!limitSze) {
        this.$message({
          type: "warning",
          message: "上传失败，请上传50M以内的pdf格式的单个附件"
        });
        return;
      }

      if (fileType.toLowerCase() != "pdf") {
        this.$message({
          type: "warning",
          message: "请上传pdf文件"
        });
        return;
      } else {
        fullScreen_loading.LOADING();
        await oss_client.getOSSClientInstance("service_report_file");
        const uploadFileRes = await oss_client.uploadFile(file.raw, file.raw.name);
        let obj = {};
        obj.fileName = file.name;
        obj.filePath = uploadFileRes.name;
        obj.createUserName = this.userInfo.userName;
        obj.createTime = this.formatDate(new Date());
        obj.bindingId = this.loopItem.styleJsonDto.bindingId;
        obj.uid = _.uniqueId("file_");
        this.$emit("addFile", obj);
        fullScreen_loading.ENDLOADING();
      }
    }
  }
};
</script>
<style lang="less" scoped></style>
