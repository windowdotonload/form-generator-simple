<template>
  <div class="systemFile-management">
    <!-- 获取文件全路径 并显示图片 -->
    <div style="margin-bottom:50px;">
      <span style="font-size:14px;">文件路径</span>
      <el-input size="small" v-model="iconUrl"  placeholder="请输入文件路径" class="input-url" clearable> </el-input>
      <el-button type="primary" size="small" @click="getFullUrl">点击获取</el-button>
      <div v-if="getFullUrlFlag" class="icon-style">
        <img :src="iconFullUrl" alt="" style="width: 200px;height: 200px;" />
      </div>
    </div>
    <el-divider></el-divider>
    <!-- 上传附件 -->
    <div style="margin-top:50px;">
      <div style="font-size:14px;line-height: 40px;">上传文件</div>
      <el-form :model="form" ref="form" :rules="rule" label-width="120px" label-position="left">
        <el-form-item label="文件名称" prop="fileName">
          <el-input v-model="form.fileName" class="input-url" size="small"></el-input>
        </el-form-item>
        <el-form-item label="文件夹路径" prop="filePath">
          <el-input v-model="form.filePath" class="input-url" size="small"></el-input>
        </el-form-item>
        <el-form-item label="是否为公共读" prop="isPublic">
          <el-radio-group v-model="form.isPublic">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-upload
          class="upload-demo"
          style="margin-top: 20px;"
          :auto-upload="false"
          :show-file-list="true"
          limit="1"
          :on-remove="handleRemove"
          :on-change="(file, fileList) => handleAddFile(file, fileList)"
        >
          <el-button size="small" type="primary">点击选择文件</el-button>
        </el-upload>
      </el-form>
      <div>
        <el-button size="small" @click="submitFile('form')" type="primary" style="margin-top:40px;">提交</el-button>
      </div>

      <!-- 文件半路径 -->
      <div style="font-size:14px;margin-top:20px;">
        上传的文件路径：{{ filePathUpload }}
        <el-button type="primary" size="small" @click="previewAttachment" style="margin-left:20px;">点击预览文件</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import OSSClient from "../../utils/ossClient";
const oss_client = new OSSClient();
export default {
  data() {
    return {
      getFullUrlFlag: false,
      filePathUpload: "",
      form: {
        fileName: "",
        isPublic: "",
        filePath: ""
      },
      iconUrl: "", // 图片半路径
      iconFullUrl: "", // 图片全路径
      uploadFileResData: {},
      fileData: {},
      rule: {
        filePath: [{ required: true, message: "请输入文件路径", trigger: "blur" }],
        isPublic: [{ required: true, message: "请选择是否为公共流", trigger: "change" }]
      }
    };
  },
  components: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    // 获取图片全路径
    getFullUrl() {
      if (!_.isEmpty(this.iconUrl)) {
        const params = {
          url: this.iconUrl
        };
        this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
          if (res.data.code == 1000) {
            this.iconFullUrl = res.data.data;
            this.getFullUrlFlag = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      } else {
        this.$message({
          message: "请输入文件路径",
          type: "warning"
        });
      }
    },
    // 上传附件
    async handleAddFile(file) {
      console.log(file);
      await oss_client.getOSSClientInstance("service_report_file");
      const uploadFileRes = await oss_client.uploadFile(file.raw, file.raw.name);
      console.log(uploadFileRes, file);
      this.uploadFileResData = uploadFileRes;
      this.fileData = file;
    },
    // 删除附件
    handleRemove(file) {
      this.uploadFileResData = {};
      this.fileData = {};
    },
    // 提交文件
    submitFile(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!_.isEmpty(this.fileData)) {
            let params = new FormData();
            params.append("fileName", this.form.fileName || this.fileData.name);
            params.append("filePath", this.form.filePath);
            params.append("isPublic", this.form.isPublic);
            params.append("multipartFile", this.fileData.raw);
            this.requestMethodPost("/web/file/uploadFilesWithPath", params).then(res => {
              if (res.data.code == 1000) {
                this.filePathUpload = res.data.data;
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            });
          } else {
            this.$message({
              message: "请上传文件",
              type: "warning"
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 预览
    previewAttachment() {
      const params = {
        url: encodeURI(this.filePathUpload)
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
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
.systemFile-management {
  margin: 50px;
  .input-url {
    width: 360px;
    margin: 0 40px 0px 10px;
  }
  .icon-style {
    border: 1px solid #ededed;
    width: 200px;
    height: 200px;
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
