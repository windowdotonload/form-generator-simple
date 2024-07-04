<template>
  <div style="position: relative">
    <!-- 查看设备资料 -->
    <el-dialog title="设备资料" append-to-body :visible.sync="deviceDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="30%" :before-close="cancelDeviceFile">
      <div @click="switchTab">
        <span class="type-tap" :class="activeTab == 1 ? 'active-tab' : ''" data-type="1">专属资料</span>
        <span class="type-tap" :class="activeTab == 2 ? 'active-tab' : ''" data-type="2">公共资料</span>
      </div>
      <el-table v-loading="tableLoading" :data="activeTab == 1 ? deviceInfoList : publicDevcieInfoList" height="450px" tooltip-effect="dark" ref="device">
        <el-table-column prop="fileName" min-width="12%" label="文件名" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" min-width="6%" align="center">
          <template #default="{ row }">
            <!-- 非pdf文件不可预览 -->
            <el-link style="margin-right: 10px; color: #ccc" v-if="!row.fileName.includes('pdf') && !row.fileName.includes('png') && !row.fileName.includes('jpg') && !row.fileName.includes('jpeg')"
              >预 览</el-link
            >
            <el-link
              @click="previewFile(row)"
              style="margin-right: 10px; color: #001450"
              v-if="row.fileName.includes('pdf') || row.fileName.includes('png') || row.fileName.includes('jpg') || row.fileName.includes('jpeg')"
            >
              预 览
            </el-link>
            <el-link @click="downloadRowFile(row)" style="margin-right: 10px; color: #dd0000">下 载</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="activeTab == 1 ? pageInfo.current : publicPageIfno.current"
        :page-size="activeTab == 1 ? pageInfo.size : publicPageIfno.size"
        layout=" prev, pager, next"
        :total="activeTab == 1 ? deviceInfoDataTotal : publicDeviceInfoDataTotal"
        style="margin-top: 20px; float: right"
      ></el-pagination>
      <span slot="footer" class="dialog-footer;">
        <el-button @click="cancelDeviceFile" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="预览" @close="previewImgSrc = ''" :visible.sync="previewImgDialogVisible" width="60%">
      <div v-loading="!previewImgSrc" style="width: 100%; height: 100%; min-height: 300px; display: flex; align-items: center; justify-content: center">
        <img style="max-width: 100%" :src="previewImgSrc" alt="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    deviceId: { type: String },
    deviceDialog: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    deviceNumber: {
      type: String,
      default: () => {
        return "";
      }
    }
  },

  watch: {
    deviceDialog: async function(val, oldVal) {
      if (val) {
        this.pageInfo = {
          current: 1,
          size: 10
        };
        this.publicPageIfno = {
          current: 1,
          size: 10
        };
        this.activeTab = 1;
        this.getDiffTypeDeviceList();
      }
    }
  },
  data() {
    return {
      activeTab: "1",
      deviceInfoTableData: [],
      deviceInfoCurrent: 1,
      deviceInfoSize: 30,
      totalNumber: 0,
      pageInfo: {
        current: 1,
        size: 10
      },
      publicPageIfno: {
        current: 1,
        size: 10
      },
      deviceInfoList: [],
      deviceInfoDataTotal: 0,
      publicDevcieInfoList: [],
      publicDeviceInfoDataTotal: 0,
      devcieDetailInfo: null,
      tableLoading: false,
      previewImgSrc: "",
      previewImgDialogVisible: false
    };
  },

  methods: {
    async previewFile(row) {
      const params = {
        url: row.fileUrl
      };
      if (row.fileName.includes("png") || row.fileName.includes("jpg") || row.fileName.includes("jpeg")) {
        this.previewImgDialogVisible = true;
      }
      const res = await this.requestMethodGet("/web/file/getFullUrl", params);
      if (res.data.code == 1000) {
        if (row.fileName.includes("png") || row.fileName.includes("jpg") || row.fileName.includes("jpeg")) {
          this.previewImgSrc = res.data.data;
          return;
        }
        window.open(res.data.data, "_blank");
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },
    downloadRowFile(row) {
      const params = {
        url: row.fileUrl
      };
      this.requestMethodGet("/web/file/getFullDownloadUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    async getDeviceDetailInfo() {
      if (!this.deviceNumber) return;
      const deviceDetail = await this.requestMethodGetTip("/web/device/queryDevice", {
        deviceNumber: this.deviceNumber
      });
      if (deviceDetail.data.code == 1000) {
        return deviceDetail.data.data;
      }
    },
    getDiffTypeDeviceList() {
      this.tableLoading = true;
      if (this.activeTab == 1) {
        this.getDeviceInfoList();
      } else {
        this.getPublicDeviceInfoList();
      }
    },
    switchTab(e) {
      if (!e.target.dataset.type) return;
      const { type } = e.target.dataset;
      this.activeTab = type;
      if (type == 2 && this.publicDevcieInfoList.length == 0) {
        this.getDiffTypeDeviceList();
      }
    },
    getDeviceInfoList() {
      let params = { ...this.pageInfo, deviceId: this.deviceId };
      this.requestMethodGet("/web/deviceInstructions/getInstructionsByDeviceId", params).then(res => {
        this.tableLoading = false;
        if (res.data.code == 1000) {
          this.deviceInfoList = res.data.data.list;
          this.deviceInfoDataTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    async getPublicDeviceInfoList() {
      const detailRes = await this.getDeviceDetailInfo();
      const params = {
        ...this.publicPageIfno,
        workshopId: detailRes.workshopId,
        instructionType: 2
      };

      this.requestMethodGet("/web/deviceInstructions/getMyInstructions", params).then(res => {
        this.tableLoading = false;
        if (res.data.code == 1000) {
          this.publicDevcieInfoList = res.data.data.list;
          this.publicDeviceInfoDataTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 一页多少
    handleSizeChange(val) {
      const page = this.activeTab == 1 ? this.pageInfo : this.publicPageIfno;
      page.size = val;
      this.getDiffTypeDeviceList();
    },
    // 页数
    handleCurrentChange(val) {
      const page = this.activeTab == 1 ? this.pageInfo : this.publicPageIfno;
      page.current = val;
      this.getDiffTypeDeviceList();
    },
    // 获取设备资料列表
    getDeviceTableData() {
      const params = {
        deviceNumber: this.deviceNumber,
        size: this.deviceInfoSize,
        current: this.deviceInfoCurrent
      };
      this.requestMethodGet("/web/deviceInstructions/queryInstructionsByPage", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.deviceInfoTableData = data.list;
          this.totalNumber = data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 取消
    cancelDeviceFile() {
      this.$emit("cancelDeviceFile");
    },
    preView(item) {
      window.open(item.fileUrl);
    },
    downLoadFile(item) {
      window.open(item.fileUrlDownload);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-dialog__footer {
  margin-top: 40px;
}
/deep/.el-pagination {
  position: static;
}
.type-tap {
  margin-right: 18px;
  cursor: pointer;
}
.active-tab {
  color: #d10000;
}
</style>
