<template>
  <div>
    <el-dialog title="批量导入报告" :visible.sync="batchUpload.visible" width="400px" class="batch-upload" :before-close="handleBatchUploadClose">
      <div>
        <p style="margin: 0;">请您下载模板，并根据模板要求进行整理上传</p>
        <el-button type="text" style="color: #dd0000;" @click="handlerDownTemplate" icon="el-icon-download">点击下载模板</el-button>
        <el-upload
          drag
          action="uploadUrl"
          accept=".xlsx"
          class="batch-upload-demo"
          :limit="1"
          :auto-upload="false"
          :on-exceed="handleExceedFile"
          :on-change="handleFileChangeFile"
          :file-list="batchUpload.fileList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            <p>将文件拖到此处，或<em>点击上传</em></p>
            <p class="el-upload__tips">只能上传.xlsx或.xls文件</p>
          </div>
        </el-upload>
      </div>
      <span slot="footer">
        <el-button @click="handleBatchUploadClose" size="small" :loading="batchUpload.submitLoading">取 消</el-button>
        <el-button type="danger" @click="handlerSubmitExcel" size="small" :loading="batchUpload.submitLoading">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="导入结果" :visible.sync="rMsg.visible" width="400px" :before-close="handlerMsgClose">
      <div>{{ rMsg.requestMsg }}</div>
      <span slot="footer">
        <el-button @click="handlerMsgClose" size="small" :loading="rMsg.failDownLoad">关 闭</el-button>
        <el-button :disabled="rMsg.failCount == 0" type="danger" @click="handlerDownError" size="small" :loading="rMsg.failDownLoad">错误结果下载</el-button>
      </span>
    </el-dialog>
    <el-dialog title="请选择导入报告类型" :visible.sync="modelvisible" width="400px" :before-close="handlerModelvisibleClose">
      <el-radio v-model="radioReport" label="1">风机主齿箱换油服务报告</el-radio>
      <el-radio v-model="radioReport" label="34" style="margin-top: 10px;">风机主轴承清洗服务报告</el-radio>
      <span slot="footer">
        <el-button @click="handlerModelvisibleClose" size="small" >取 消</el-button>
        <el-button  type="danger" @click="handlerDown" size="small" >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      batchUpload: {
        visible: false,
        submitLoading: false,
        fileList: [],
        file: null
      },
      rMsg: {
        visible: false,
        requestMsg: "",
        failData: [],
        failCount: 0,
        failDownLoad: false
      },
      modelvisible:false,
      workOrderNumber: "",
      openSta: 0,
      userInfo: {},
      radioReport:''
    };
  },
  methods: {
    // 打开弹窗
    openDrawer(val, sta) {
      console.log(val,sta)
      this.workOrderNumber = val;
      this.openSta = sta;
      if(sta ==0 && this.userInfo.orgInfo.importChangeOilFlag && this.userInfo.orgInfo.importChangeOilFlag.length>1 ) {
        this.modelvisible = true
      } else {
        this.batchUpload.visible = true;
      }
      
    },
    // 关闭批量导入报告弹窗
    handleBatchUploadClose() {
      this.batchUpload.visible = false;
      this.batchUpload.submitLoading = false;
      this.batchUpload.fileList = [];
    },
    // 下载
    downLoadTemplate(val) {
      this.$gio.clickDownloadTemplate();
      this.batchUpload.submitLoading = true;
      let data = {};
      if (this.openSta === 1) {
        data = {
          responseTypeBlob: true,
          workOrderNumber: this.workOrderNumber
        };
      } else {
        data = {
          responseTypeBlob: true
        };
        if(this.radioReport) {
          data.reportType = this.radioReport
        } else {
          data.reportType = this.userInfo.orgInfo.importChangeOilFlag[0]==1 ? 1 : 34
        }
      }
      data.distributorCompanyNumber = this.userInfo.companyNumber;
      data.menuCode = 'NewWorkOrderList'
      this.requestMethodGet("/weChat/workOrder/exportChangeOilDraft", data)
        .then(res => {
          let data = res.data;
          let fileReader = new FileReader();
          let that = this;
          fileReader.onload = function() {
            try {
              let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
                that.$message({
                  message: jsonData.msg,
                  type: "error"
                });
                return;
              }
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              const blob = new Blob([res.data], {
                type: "application/vnd.ms-excel"
              });
              let fileName = decodeURI(res.headers["content-disposition"].split("filename=")[1]);
              const objectUrl = URL.createObjectURL(blob);
              // window.location.href = objectUrl
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", fileName);
              document.body.appendChild(link);
              link.click();
            }
          };
          fileReader.readAsText(data);
          this.batchUpload.submitLoading = false;
        })
        .catch(err => console.log(err));
    },
    // 点击下载模板
    handlerDownTemplate() {
      // 下载事件
      this.downLoadTemplate()
    },
    // 选择模板弹框点击确定
    handlerDown() {
      if(this.radioReport) {
        this.batchUpload.visible = true;
      } else {
        this.$message.error('请选择导入报告类型');
      }
      this.modelvisible = false
    },
    // 文件上传超出限制
    handleExceedFile(files, fileList) {
      this.$message.error(`最多上传 1 个文件`);
    },
    // 文件选择改变钩子
    handleFileChangeFile(file, fileList) {
      this.batchUpload.fileList = fileList;
      this.batchUpload.file = file;
    },
    // 提交
    handlerSubmitExcel() {
      this.rMsg.failData = [];
      this.rMsg.requestMsg = "";
      this.batchUpload.submitLoading = true;
      let params = new FormData();
      params.append("file", this.batchUpload.file.raw);
      if (this.openSta === 1) {
        params.append("workOrderNumber", this.workOrderNumber);
      }
      params.append("distributorCompanyNumber", this.userInfo.companyNumber);
      if(this.radioReport) {
        params.append("reportType", this.radioReport);
      } else {
        params.append("reportType", this.userInfo.orgInfo.importChangeOilFlag[0]==1 ? 1 : 34)
      }
      params.append("menuCode", 'NewWorkOrderList');
      this.requestMethodPost("/weChat/workOrder/importChangeOilDraft", params)
        .then(res => {
          if (res.data.code === 1000) {

            this.rMsg.failData = res.data.data.failList;
            this.rMsg.requestMsg = `共导入${res.data.data.totalCount}条数据，成功${res.data.data.successCount}条，失败${res.data.data.failCount}条。`;
            this.rMsg.failCount = res.data.data.failCount;
            this.rMsg.visible = true;
            this.$forceUpdate();
          } else if (res.data.code === 2000) {
            this.rMsg.failData = res.data.data.failList;
            this.rMsg.requestMsg = `共导入${res.data.data.totalCount}条数据，成功${res.data.data.successCount}条，失败${res.data.data.failCount}条。`;
            this.rMsg.failCount = res.data.data.failCount;
            this.rMsg.visible = true;
            // this.$message.error(res.data.msg);
          }
          this.$gio.ClickBatchImportWorkorderReport({
            operation: "工单列表导入"
          });
          this.batchUpload.submitLoading = false;
          this.batchUpload.visible = false;
          this.radioReport = ''
          this.$emit("getOilChangeReportCount", res);
        })
        .catch(err => {
          console.log(err);
          this.$message.error(err.data.msg);
          this.batchUpload.submitLoading = false;
        });
    },
    // 错误结果下载
    handlerDownError() {
      let params = {
        failList: this.rMsg.failData,
        responseTypeBlob: true
      };
      this.rMsg.failDownLoad = true;
      this.requestMethodPost("/weChat/workOrder/exportChangeOilErrorImportData", params)
        .then(res => {
          console.log(res);
          let data = res.data;
          let fileReader = new FileReader();
          let that = this;
          fileReader.onload = function() {
            try {
              let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
                that.$message({
                  message: jsonData.msg,
                  type: "error"
                });
                return;
              }
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              const blob = new Blob([res.data], {
                type: "application/vnd.ms-excel"
              });
              // let fileName = decodeURI(res.headers['content-disposition'].split('filename=')[1])
              let date = new Date();
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              const objectUrl = URL.createObjectURL(blob);
              // window.location.href = objectUrl
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", `false-data-${year}年${month}月${day}日`);
              document.body.appendChild(link);
              link.click();
            }
          };
          fileReader.readAsText(data);
          this.handlerMsgClose();
        })
        .catch(err => console.log(err));
    },
    handlerMsgClose() {
      this.rMsg.visible = false;
      this.rMsg.failDownLoad = false;
      this.batchUpload.submitLoading = false;
      this.batchUpload.visible = false;
      this.batchUpload.fileList = [];
      this.$nextTick(() => {
        this.batchUpload = {
          visible: false,
          submitLoading: false,
          fileList: [],
          file: null
        };
        this.rMsg = {
          visible: false,
          requestMsg: "",
          failData: [],
          failCount: 0,
          failDownLoad: false
        };
      });
    },
    handlerModelvisibleClose() {
      this.modelvisible = false
    }
  },
  created() {
    this.userInfo = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")));
  }
};
</script>

<style lang="less" scoped>
.batch-upload-demo {
  .el-upload__text {
    p {
      margin: 0;
    }
    .el-upload__tips {
      font-size: 12px;
      color: #a0a0a0;
      margin-top: 14px;
    }
  }
}

/deep/.el-dialog__footer {
  text-align: center;
}
</style>
