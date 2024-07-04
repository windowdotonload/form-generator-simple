<template>
  <div style="position:relative">
    <div class="work-order-component" :style="mainminheight">
      <div class="notice-wrap1"><span style="color:#999;margin-right:10px;">温馨提示</span>完成报告草稿后，请勿忘记 <span style="color:#dd0000;">发布到工单</span></div>
      <div style=" cursor: pointer;font-size: 13px; margin-bottom:20px;">
        所属服务申请单：<span style="max-width: 500px;color: #001450" @click="handApplyOrderDetail">{{ serviceApplyNo }}</span>
        <i class="el-icon-arrow-right" @click="handApplyOrderDetail"></i>
        <el-button
          v-if="batUploadBtnAuth"
          type="text"
          v-has="fengji"
          :disabled="up_disabled"
          style="color: #001450; font-size: 14px;float: right;"
          @click="
            () => {
              handleBatchUpload($route.query.workOrderNumber, 1);
            }
          "
          >导入报告
          <el-tooltip class="item" effect="dark" content="有模板的批量导入" placement="top">
            <i class="el-icon-warning"></i>
          </el-tooltip>
        </el-button>
      </div>
      <el-table ref="customerTable" :key="key" :data="woTableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" :header-cell-style="{ background: '#f7f7f7' }" stripe v-loading="loading">
        <el-table-column prop="draftName" label="标题" min-width="20%" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="perfectRate" :show-overflow-tooltip="true" label="完善率" min-width="15%">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.perfectStatus ? '#333' : 'rgb(211,0,0)' }">{{ scope.row.perfectRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="publishStatus" :show-overflow-tooltip="true" label="发布状态" min-width="15%">
          <template slot-scope="scope">
            <div style="display:flex;align-items:center;">
              <span v-if="scope.row.publishStatus == 1" style="color:#333">已发布</span>
              <span v-if="scope.row.publishStatus == 0" style="color:rgb(211,0,0)">未发布</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="12%" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link type="danger" @click="handleEdit(scope.row)" style="margin-right:10px">编辑</el-link
            ><em v-if="(scope.row.pdfCreateFlag == '1' && scope.row.draftPath) || scope.row.pdfCreateFlag == '2' || scope.row.pdfCreateFlag == 3">|</em>
            <el-link type="danger" v-if="scope.row.draftPath && scope.row.pdfCreateFlag == '1'" @click="handlePreview(scope.row)" style="margin-left:10px">预览</el-link>
            <el-link type="danger" v-if="scope.row.pdfCreateFlag == '2'" style="margin-left:10px">报告生成中 ···</el-link>
            <el-link type="danger" v-if="scope.row.pdfCreateFlag == 3" style="margin-left:10px">报告生成失败，请重试</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        style="float: right;display:flex; margin-top: 10px"
      ></el-pagination>
    </div>
    <BatchUpload ref="batchUpload" @getOilChangeReportCount="getOilChangeReportCount"></BatchUpload>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import BatchUpload from "@/components/batchUpload/index";
import BatchUploadJS from "@/components/batchUpload/batchUpload";
export default {
  mixins: [BatchUploadJS],
  components: {
    BatchUpload
  },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      woTableData: [], // 报告草稿列表
      loading: false, // 是否展示加载动画，默认隐藏
      totalNumber: 0, // 总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 30
      },
      serviceApplyNo: "",
      serviceApplyOrderId: "",
      batUploadBtnAuth: false
    };
  },
  mounted() {
    this.getBatUploadBtnAuth();
    this.$_getWOData(); // 获取工单列表
    this.serviceApplyNo = this.$route.query.serviceApplyNo;
    this.serviceApplyOrderId = this.$route.query.serviceApplyOrderId;
  },

  methods: {
    getBatUploadBtnAuth() {
      console.log("---", this.$route.query.batUploadBtnAuth);
      this.batUploadBtnAuth = this.$route.query.batUploadBtnAuth == "false" || !this.$route.query.batUploadBtnAuth ? false : true;
    },
    getOilChangeReportCount(res) {
      this.pagenation = {
        current: 1,
        size: 30
      };
      this.$_getWOData(); // 获取工单列表
    },
    // 编辑
    handleEdit(row) {
      let workshopId = this.$route.query.workshopId;
      let companyNumber = this.$route.query.companyNumber;
      let companyId = this.$route.query.companyId;
      let contactCompanyName = this.$route.query.contactCompanyName;
      let path = "";
      if (
        row.reportType == 1 ||
        row.reportType == 2 ||
        row.reportType == 3 ||
        row.reportType == 4 ||
        row.reportType == 5 ||
        row.reportType == 6 ||
        row.reportType == 7 ||
        row.reportType == 8 ||
        row.reportType == 9 ||
        row.reportType == 10 ||
        row.reportType == 11 ||
        row.reportType == 12 ||
        row.reportType == 13 ||
        row.reportType == 14 ||
        row.reportType == 15 ||
        row.reportType == 16 ||
        row.reportType == 17 ||
        row.reportType == 18 ||
        row.reportType == 19 ||
        row.reportType == 20 ||
        row.reportType == 21 ||
        row.reportType == 22 ||
        row.reportType == 23 ||
        row.reportType == 24
      ) {
        path = "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/reportCommon";
      } else {
        path = "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/EditReport";
      }
      this.$router
        .push({
          path: path,
          query: {
            workOrderNumber: row.workOrderNumber,
            type: "edit",
            draftId: row.id,
            workshopId: workshopId,
            companyNumber: companyNumber,
            companyId: companyId,
            contactCompanyName: contactCompanyName,
            perfectRate: row.perfectRate,
            publishStatus: row.publishStatus
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    handApplyOrderDetail() {
      this.$router.push({
        path: "/ServiceApplyList/ServiceApplyDetail",
        query: {
          id: this.serviceApplyOrderId
        }
      });
    },
    // 预览
    handlePreview(row) {
      this.$gio.previewServiceReport_serviceReport({
        entrance: "工单详情页"
      });
      window.open(row.draftPath);
    },
    // 获取工单列表
    $_getWOData() {
      this.loading = true;
      let params = {
        workOrderNumber: this.$route.query.workOrderNumber,
        current: this.pagenation.current,
        size: this.pagenation.size
      };
      this.requestMethodGet("/serviceReport/draftListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.woTableData = res.data.list;
            this.totalNumber = res.data.totalCount;
            this.pagenation.current = res.data.pageIndex;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 220}px`;
    }
  }
};
</script>
<style lang="less" scoped>
.work-order-component {
  padding: 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
  .notice-wrap1 {
    font-size: 13px;
    font-family: MicrosoftYaHei;
    margin: 20px 0;
    height: 40px;
    line-height: 40px;
    background: #e6edff;
    border-radius: 4px;
    padding: 0 20px;
  }
  .el-popover-detail {
    /deep/ .el-button {
      padding: 0px !important;
    }
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #e9e9e9;
    background: #dd0000;
    color: #fff;
  }
  /deep/ .el-tabs--card > .el-tabs__header {
    border-bottom: none;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    -webkit-transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  /deep/ .el-tabs__item {
    color: #666;
  }
  /deep/ .el-tabs__item:hover {
    color: #dd0000;
    cursor: pointer;
  }
  /deep/.el-table .descending .sort-caret.descending {
    border-top-color: #001450;
  }
  /deep/.el-table .ascending .sort-caret.ascending {
    border-bottom-color: #001450;
  }
  .workOrder-Status {
    // cursor:pointer;
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    font-weight: bold;
  }
  /deep/ .exDetail {
    .el-dialog__header {
      padding: 0px;
    }
    .el-dialog__body {
      padding: 13px;
    }
    .el-dialog__headerbtn {
      top: 13px;
      right: 12px;
    }
    .el-dialog__wrapper {
      left: 21%;
    }
  }
}
</style>
<style>
.closeWorkOrder .el-dialog__body {
  padding: 20px 20px;
}
.closeWorkOrder .el-dialog__title {
  font-size: 18px;
  color: #000;
  font-family: MicrosoftYaHei;
}
</style>
