<!--
* @description 账号管理
* @fileName accountManagement.vue
* @author vvx
* @date 2020/05/15 15:30:23
* @version V1.0.0
!-->
<template>
  <div class="main-box">
    <div class="qr-management" :style="mainminheight">
      <el-row :gutter="20">
        <el-col :span="24" class="qr-management-serach-item">
          <label for>公司名称：</label>
          <el-input size="small" v-model="queryParams.companyName" placeholder="请输入公司名称" @change="handleSearchTableData" style="width:15%;margin-right:20px" clearable></el-input>

          <label for style="width: auto;">二维码ID：</label>
          <el-input size="small" v-model="queryParams.qrNumber" placeholder="请输入二维码ID" @change="handleSearchTableData" style="width:15%;margin-right:20px" clearable></el-input>
          <label for>状态：</label>
          <el-select v-model="queryParams.qrStatus" @change="handleSearchTableData" size="small" style="width:15%;margin-right:20px" clearable>
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>

          <el-button plain @click="handleClearSearch" size="small">重置</el-button>
          <el-button type="text" style="float:right;color: #333; font-size: 15px; padding: 0px" @click="showDialog">
            <i class="el-icon-warning" style="display: flex;height: 30px;align-items: center;"></i>
          </el-button>
          <el-button type="danger" plain @click="openQrDownloadBatch" style="float:right" size="small" :loading="isloadingBatch" v-gio.click="clickBulkDownloadButton">批量下载</el-button>
          <el-button type="danger" @click="openQrDownload" style="float:right" size="small" :loading="isloading" v-has="qrCodeDownBtn" v-gio.click="clickGenerateQrButton">生成二维码</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        ref="accountTable"
        :key="2"
        row-key="id"
        :data="newsTableData"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{ background: '#f7f7f7' }"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55" align="center" :selectable="selectedDisable"></el-table-column>
        <el-table-column type="index" label="序号" width="50"> </el-table-column>
        <el-table-column prop="qrNumber" label="二维码ID" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="qrStatusStr" label="状态" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="companyName" label="所属客户" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceName" label="所属设备" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="生成时间" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUser" label="创建人" min-width="15%" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="20%" align="center">
          <template slot-scope="scope">
            <el-link @click="lookDetail(scope.row)" type="danger" style="margin-right:10px;color:#fe000c;">查看</el-link>
            <span v-if="scope.row.qrStatus == 0" style="margin-right:10px;color:#999;">解绑</span>
            <el-link v-else v-has="qrCodeUnbindBtn" @click="handleUnbundling(scope.row)" type="danger" style="margin-right:10px;color:#fe000c;">解绑</el-link>
            <span v-if="scope.row.qrStatus == 0" style="color:#999;">下载二维码</span>
            <el-link v-else v-has="qrCodeOpenBtn" @click="redownload(scope.row)" type="danger" style="color:#fe000c;">下载二维码</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      v-if="totalNumber > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenation.current"
      :page-size="pagenation.size"
      :page-sizes="[5, 10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber"
      style="float: right;display:flex; margin-top: 10px"
    ></el-pagination>
    <!-- 批量生成二维码 -->
    <el-dialog title="生成二维码" :visible.sync="dialogVisible" :close-on-click-modal="false" class="dialog-qrcount" width="40%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="add-dealer-profile-ruleForm">
        <el-form-item label="生成二维码数量:" prop="qrCount">
          <el-input-number v-model="ruleForm.qrCount" @change="onlyNumber" :min="1" :max="99" label="1~99整数"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" align="center">
        <el-button type="danger" plain @click="dialogVisible = flase" size="small">取 消</el-button>
        <el-button type="danger" @click="donwnLoadData" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <QrOperation :dialogVisibleOperation="dialogVisibleOperation" v-on:closeVisibleOperation="closeVisibleOperation"></QrOperation>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import QrOperation from "./qrOperation.vue";
export default {
  data() {
    return {
      dialogVisibleOperation: false,
      selectCompanyId: "",
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      activeName: "second",
      dialogVisible: false,
      isloading: false,
      isloadingBatch: false,
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      queryParams: {
        companyName: "",
        qrNumber: [], // 二维码编码
        qrStatus: "" // 状态
      },
      statusList: [
        {
          value: 1,
          label: "已绑定"
        },
        {
          value: 0,
          label: "未绑定"
        }
      ],
      pagenation: {
        current: 1,
        size: 30
      },
      newsTableData: [],
      totalNumber: 0, // 总条数
      dataRecordTableData: [],
      selectList: [],
      dialogTitle: "",
      loading: false, // 是否加载
      // 表单验证
      ruleForm: {
        qrCount: 1
      },
      //   表单验证规则
      rules: {
        qrCount: [{ required: true, message: "请输入1~99整数", trigger: "blur" }, { pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/, message: "只能输入1~99整数", trigger: "blur" }]
      }
    };
  },

  components: { QrOperation },

  computed: {},
  created() {},
  mounted() {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
      this.pagenation.current = this.queryParams.current;
      this.pagenation.size = this.queryParams.size;
    }
    this.$_queryAccountList(); // 获取短信列表
  },
  beforeRouteLeave(to, from, next) {
    sessionStorage.setItem("queryParams", JSON.stringify({ ...this.queryParams, ...this.pagenation }));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/QrManagement/QrManagementDetail") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  methods: {
    closeVisibleOperation() {
      this.dialogVisibleOperation = false;
    },
    showDialog() {
      this.dialogVisibleOperation = true;
    },
    selectedDisable(row, index) {
      if (row.qrStatus == 0) {
        return false; // 不可勾选
      } else {
        return true; // 可勾选
      }
    },
    // 表格多选事件
    handleSelectionChange(select) {
      this.selectList = select;
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 220}px`;
    },
    // 获取账号列表
    $_queryAccountList() {
      this.loading = true;
      let params = {
        ...this.queryParams,
        ...this.pagenation
      };
      this.newsTableData = [];
      this.requestMethodGet("/qr/manage/queryQrListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.newsTableData = res.data.list;
            this.totalNumber = res.data.totalCount;
            this.$gio.filterDeviceQr({
              customer: params.companyName,
              QrID: params.qrNumber,
              QrIStatus: params.qrStatus == 1 ? "已绑定" : "未绑定"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    handleUnbundling(row) {
      let params = {
        id: row.id
      };
      this.$confirm("确定解除二维码和设备的绑定吗？解除后，扫一扫将无法读取二维码中设备信息", "提交", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          this.requestMethodPost("/qr/manage/unBindingQr", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "解绑成功",
                  type: "success"
                });
                this.$_queryAccountList(); // 获取列表
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        })
        .catch(() => {});
    },
    // 查询
    handleSearchTableData(e) {
      this.pagenation.current = 1;
      this.$_queryAccountList(); // 获取列表
      if (e.target) {
        let target = e.target;
        if (target.nodeName == "SPAN" || target.nodeName == "I") {
          target = e.target.parentNode;
        }
        target.blur();
      }
    },
    // 清空
    handleClearSearch() {
      this.queryParams = {
        companyName: "",
        qrNumber: [], // 二维码编码
        qrStatus: "" // 状态
      };
      this.$_queryAccountList(); // 获取短信日志列表
    },
    lookDetail(row) {
      this.$router.push({
        path: "/QrManagement/QrManagementDetail",
        query: {
          id: row.id
        }
      });
    },
    onlyNumber(val) {
      this.ruleForm.qrCount = val.replace(/[^\d]/g, "");
    },
    redownload(row) {
      const params  ={
        id: this.EncryptUserId(row.id.toString())
      }
      this.requestMethodGet("/qr/manage/getDeviceQrImagePath", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            window.location.href = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    openQrDownload() {
      if (this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].resetFields();
      }
      this.dialogVisible = true;
    },
    createDeviceQrCode() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.isloading = true;
          this.dialogVisible = false;
          let params = {
            num: Number(this.ruleForm.qrCount)
          };
          this.requestMethodGet("/qr/manage/createDeviceQrCode", params)
            .then(res => {
              this.loading = false;
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "生成二维码成功，请查看",
                  type: "success"
                });
                this.$_queryAccountList(); // 刷新列表
                // this.$gio.submitGenerateQr({
                //   customer: this.$gio.findValueCodeCorresponding(this.customerList, this.ruleForm.companyNumber, "companyNumber", "companyName"),
                //   workshop: this.$gio.findValueCodeCorresponding(this.workshopList, params.workshopId, "workshopId", "workshopName")
                // });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    // 批量下载
    openQrDownloadBatch() {
      if (this.selectList.length == 0) {
        this.$message({
          message: "请先选择二维码",
          type: "warning"
        });
        return false;
      }
      this.isloadingBatch = true;
      let ids = this.selectList.map(item => {
        return item.id;
      });
      this.$gio.downloadDeviceQr();
      ids = this.EncryptUserId(ids.toString());
      let paramObj = {
        ids: ids,
        responseTypeBlob: true
      }
      this.requestMethodGet("/qr/manage/downLoadZipQrImages", paramObj).then(res => {
        let data = res.data;
          let fileReader = new FileReader();
          let that = this;
          that.isloadingBatch = false;
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
                type: "application/zip"
              });
              const objectUrl = URL.createObjectURL(blob);
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", "设备二维码归档.zip");
              document.body.appendChild(link);
              link.click();
              that.$message({
                message: "批量下载成功",
                type: "success"
              });
            }
          };
          fileReader.readAsText(data);
        })
        .catch(res => {
          this.isloadingBatch = false;
        });
    },
    donwnLoadData() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.isloading = true;
          this.dialogVisible = false;
          let url = '/qr/manage/batchCreateAndDownloadZipDeviceQrCode';
          let paramObj = { 
            num: this.ruleForm.qrCount,
            responseTypeBlob: true
          }
          this.requestMethodGet(url, paramObj).then(res => {
            let data = res.data;
            let fileReader = new FileReader();
            let that = this;
            that.isloading = false;
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
                  type: "application/zip"
                });
                const objectUrl = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = objectUrl;
                link.setAttribute("download", "设备二维码归档.zip");
                document.body.appendChild(link);
                link.click();
                that.$message({
                  message: "生成二维码成功，请查看",
                  type: "success"
                });
                that.$_queryAccountList(); // 刷新列表
              }
            };
            fileReader.readAsText(data);
        })
        .catch(res => {
          this.isloading = false;
        });
        } else {
          return false;
        }
      });
    },
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
      this.$_queryAccountList(); // 获取短信日志列表
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_queryAccountList(); // 获取短信日志列表
    }
  }
};
</script>
<style lang="less">
.qr-management {
  padding: 10px 25px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    margin: 15px 0 30px;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: rgba(254, 0, 12, 1) !important;
    border-color: rgba(254, 0, 12, 1) !important;
  }
  .el-radio-button__inner:hover {
    color: rgba(254, 0, 12, 1) !important;
  }
  .is-active .el-radio-button__inner:hover {
    color: #fff !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f7fa !important;
  }
  // .el-pagination.is-background .el-pager li:not(.disabled).active {
  //   background:#fff !important;
  // }
  .el-tabs__item.is-active {
    color: #fe000c !important;
    font-weight: 900 !important;
  }
  .el-tabs__active-bar {
    background-color: #fe000c !important;
  }
  .el-tabs__item:hover {
    color: #fe000c !important;
  }
}
</style>
<style>
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
.deletBtn .el-button--primary {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.deletBtn .el-message-box__container {
  position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
  top: 15px !important;
}
.dialog-qrcount .el-dialog__body {
  padding: 20px !important;
}
.dialog-qrcount .el-form-item__label {
  font-size: 16px !important;
}
</style>
