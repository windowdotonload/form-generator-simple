<template>
  <div style="position: relative">
    <div class="customer-case" :style="mainminheight" id="customerCaseDive">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button plain :type="selectList.length ? 'danger' : 'info'" v-loading="downloadFileLoading" @click="handleDownload" size="small" :disabled="!selectList.length">下载文件</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table class="table" :tableHeader="tableDataHeader" :tableData="caseTableData" :tableHeight="tableHeight + ''" :loading="loadingCase" @selectionChange="handleSelectionChange" @changeSearch="tableTitleSearch">
        <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" width="40"></el-table-column>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="100" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link
              type="danger"
              @click="handlePreivew(scope.row)"
              :underline="false"
              :style="scope.row.reportUrl && scope.row.reportUrl.toLowerCase().includes('.pdf') ? 'color:rgb(0,20,80)' : 'color:#999'"
              >预览
            </el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        background
        v-if="totalNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.current"
        :page-size="queryParams.size"
        :page-sizes="[10, 20, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import customTable from "../tableComponents/customTable";
export default {
  components: {
    "custom-table": customTable
  },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 150}px`,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      selectList: [],
      tableDataHeader: [
        { slot: "selection" },
        { filterType: "input", paramValue: "reportName", changeValue:"", prop: "reportName", label: "文件名称", width: "200", tooltip: true },
        { selectMultiple: true, filterType: "selection", paramValue: "popRopFlag", selectOptions: [{name: "业绩证明",code: 1}, {name: "业绩参考",code: 2}], changeValue:"", prop: "popRopDesc", label: "案例类型", width: "130", tooltip: true },
        { filterType: "selection", paramValue: "customerId", selectOptions:[], changeValue:"", prop: "customerCompanyName", label: "客户", width: "150", tooltip: true },
        { selectMultiple: true, filterType: "cascaderDevice", paramValue: "deviceTypeCodeList",  selectOptions: [], changeValue:"", prop: "deviceTypeName", label: "设备类型", width: "130", tooltip: true },
        { filterType: "input", paramValue: "deviceManufacturer", changeValue:"", prop: "deviceManufacturer", label: "设备制造商", width: "150", tooltip: true },
        { selectMultiple: true, filterType: "selection", paramValue: "industryCodeList", selectOptions: [], changeValue:"", prop: "industryName", label: "行业", width: "180", tooltip: true },
        { selectMultiple: true, filterType: "selection", paramValue: "oilCodeList", selectOptions: [], changeValue:"", prop: "oilName", label: "油品名称", width: "130", tooltip: true },
        { slot: "operation", label: "操作" }
      ],
      tableHeight: null,
      queryParams: {
        reportName: "",
        popRopFlag: "",
        customerId: "",
        deviceTypeCodeList: [],
        deviceManufacturer: "",
        industryCodeList: [],
        oilCodeList: [],
        current: 1,
        size: 10
      },
      typeList: [
        {
          label: "业绩证明",
          value: 1
        },
        {
          label: "业绩参考",
          value: 2
        }
      ],
      caseTableData: [],
      totalNumber: 0,
      eptList: [],
      oilList: [],
      industryList: [],
      downloadFileLoading: false,
      loadingCase: false
    };
  },
  async created() {
    let res = await this.requestMethodGet("/pes/pop/getAllPropIndustry", {current: 1, size: 5000})
    res = res.data
    if (res.code == 1000) {
      this.industryList = res.data.list;
      this.industryList.forEach(item=>{
        item.code=item.industryCode
        item.name=item.industryName
      })
      this.tableDataHeader[6].selectOptions = this.industryList
    }
    let allCustomer = await this.requestMethodGet("/pes/pop/getAllCustomer", {customerName: '',current: 1, size: 5000})
    allCustomer = allCustomer.data
    if (allCustomer.code == 1000) {
      allCustomer.data.list.forEach(item=>{
        item.code=item.customerId
        item.name=item.customerName
      })
      this.tableDataHeader[3].selectOptions = allCustomer.data.list
    }
    let allOil = await this.requestMethodGet("/pes/pop/getCustomerReportOilListByPage", {oilName: '',current: 1, size: 5000})
    allOil = allOil.data
    if (allOil.code == 1000) {
      this.tableDataHeader[7].selectOptions = allOil.data.list
    }
    let allDeviceType = await this.requestMethodGet("/pes/pop/getAllDeviceType", {current: 1, size: 5000})
    allDeviceType = allDeviceType.data
    if (allDeviceType.code == 1000) {
      allDeviceType.data.list.forEach(item=>{
        item.code=item.deviceTypeCode
        item.name=item.deviceTypeName
        if(item.children&&item.children.length>0){
          item.children.forEach(it=>{
            it.code=it.deviceTypeCode
            it.name=it.deviceTypeName
          })
        }
      })
      this.tableDataHeader[4].selectOptions = allDeviceType.data.list
    }
    this.handleSearchTableData();
    this.$gio.toCustomerCaseInquirePage();
  },
  mounted() {
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 150}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  methods: {
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      this.queryParams[obj.paramValue] = searchVal
      this.handleSearchTableData()
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let customerCaseDive= 0
        let searchFormHeight= 0
        if (document.getElementById("customerCaseDive")) {
          customerCaseDive = document.getElementById("customerCaseDive").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(customerCaseDive) - Number(searchFormHeight) - 40;
      }, 200);
    },
    // 重置
    handleClearSearch() {
      for (let key in this.queryParams) {
        this.queryParams[key] = "";
      }
      this.queryParams.deviceTypeCodeList = [];
      this.queryParams.industryCodeList = [];
      this.queryParams.oilCodeList = [];
      this.queryParams.current = 1;
      this.queryParams.size = 10;
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.handleSearchTableData();
    },
    gioFilterTrack(params) {
      this.$gio.filterCustomerCase({
        fileName: params.reportName,
        caseType: params.popRopFlag == 1 ? "业绩证明" : "业绩参考",
        customer: params.customerName,
        industry: this.$gio.findValueCodeCorresponding(this.industryList, params.industryCodeList, "code", "name", true),
        deviceType: this.$gio.findValueCodeCorresponding(this.eptList, params.deviceTypeCodeList, "code", "name", true),
        manufacturer: params.deviceManufacturer,
        oilName: this.$gio.findValueCodeCorresponding(this.oilList, params.oilCodeList, "oilNumber", "oilName", true)
      });
    },
    // 获取列表
    handleSearchTableData() {
      const params = _.cloneDeep(this.queryParams);
      let deviceTypeCodeList = []
      if(params.deviceTypeCodeList.length>0){
        params.deviceTypeCodeList.forEach(item=>{
          deviceTypeCodeList.push(item[item.length-1])
        })
      }
      params.deviceTypeCodeList = deviceTypeCodeList;
      params.industryCodeList = params.industryCodeList==''?[]:params.industryCodeList;
      params.oilCodeList = params.oilCodeList==""?[]:params.oilCodeList
      params.popRopFlag = params.popRopFlag.toString();
      this.loadingCase = true
      this.requestMethodPost("/pes/pop/queryCustomerReportListByPage", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.loadingCase = false;
            this.caseTableData = res.data.data.list;
            this.totalNumber = res.data.data.totalCount;
            this.gioFilterTrack(params);
          } else {
            this.loadingCase = false;
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.loadingCase = false;
        });
    },
    // 预览
    handlePreivew(row) {
      this.$gio.previewCustomerCaseReport({entrance:'客户案例查询列表',caseType:row.popRopFlag==1 ?'POP':'ROP'});
      if (row.reportUrl && row.reportUrl.toLowerCase().includes(".pdf")) {
        window.open(row.reportUrlForOpen, "_blank");
      }
    },
    // 选择
    handleSelectionChange(list) {
      this.selectList = list;
    },
    // 下载
    handleDownload() {
      this.$gio.bulkDownloadCustomerCaseReport();

      if (this.selectList.length == 1) {
        this.downloadFile();
        return;
      }
      let urlList = this.selectList.map(item => {
        return {
          fileUrl: item.reportUrl
        };
      });
      let paramObj = {
        fileDtos: urlList,
        responseTypeBlob: true
      }
      this.requestMethodPost("/pes/downLoadPesZipFile", paramObj).then(res => {
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
              type: "application/zip"
            });
            const objectUrl = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = objectUrl;
            link.setAttribute("download", `客户案例查询`);
            document.body.appendChild(link);
            link.click();
            that.$message({
              message: "下载成功",
              type: "success"
            });
          }
        };
        fileReader.readAsText(data);
      })
      .catch(res => {});
    },
    downloadFile() {
      let param = {
        url: this.selectList[0].reportUrl
      };
      this.downloadFileLoading = true;
      this.requestMethodGet("/web/file/getFullDownloadUrl", param)
        .then(res => {
          res = res.data;
          this.downloadFileLoading = false;
          if (res.code == 1000) {
            window.location.href = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.downloadFileLoading = false;
        });
    },
    handleSizeChange(val) {
      this.queryParams.current = 1;
      this.queryParams.size = val;
      this.handleSearchTableData();
    },
    handleCurrentChange(val) {
      this.queryParams.current = val;
      this.handleSearchTableData();
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.customer-case {
  padding: 0 20px;
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
  .no-wrap-name {
    white-space: nowrap;
    max-width: 75%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  // 设置显示两行，超出省略
  /deep/ .el-table th > .cell {
    word-break: keep-all !important;
    white-space: nowrap !important;
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
