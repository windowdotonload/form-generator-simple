<template>
  <el-dialog title="选择客户" :visible.sync="showCustomerDialog" :show-close="false" :close-on-click-modal="false" width="60%">
    <!-- 表格 -->
    <custom-table
      ref="customTableCustomer"
      :tableHeader="tableDataHeader"
      :tableData="customerTableData"
      :tableHeight="tableHeight + ''"
      :loading="loading"
      :pageInfoCurrent="pagenation.current"
      @loadMore="loadMore"
      @changeSearch="tableTitleSearch"
      @selectionChange="handleSelectionChange"
    >
      <el-table-column fixed slot="selection" type="selection" :resizable="false" :reserve-selection="true" width="55"></el-table-column>
      <template v-slot:companyName="slotProps">
        <el-table-column
          fixed
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
          label="客户"
        >
          <template slot="header">
            <column-header
              title="客户"
              :filterType="slotProps.slotData.filterType"
              :sortTypeVal="slotProps.slotData.sortTypeVal"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              @chSubmit="tableTitleSearch"
            />
          </template>
          <template slot-scope="scope">
            <div style="display: flex; align-items: center;width:100%;">
              <el-tooltip class="item" effect="dark" :content="scope.row.companyName" placement="top-start">
                <div class="no-wrap-name">{{ scope.row.companyName }}</div>
              </el-tooltip>
              <span class="self-tips" v-if="scope.row.customerCompanyType == 0">直</span>
              <img v-if="scope.row.pesFlag == '1' || scope.row.pesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
              <img v-if="scope.row.pesFlag == '2' || scope.row.pesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
              <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
            </div>
          </template>
        </el-table-column>
      </template>
      <template v-slot:customerDistributor="slotProps" v-if="this.roleType == 0">
        <el-table-column
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
          label="经销商"
          show-overflow-tooltip
          v-if="roleType == 0"
        >
          <template slot="header">
            <column-header
              title="经销商"
              :filterType="slotProps.slotData.filterType"
              :sortTypeVal="slotProps.slotData.sortTypeVal"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              @chSubmit="tableTitleSearch"
            />
          </template>
          <template slot-scope="scope">
            <div style="display:flex;align-items:center;">
              <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.customerDistributor ? scope.row.customerDistributor : "-" }}</span>
              <img v-if="scope.row.daFlag" src="../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
            </div>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
    </custom-table>
    <div slot="footer" class="dialog-footer" style="margin-top:30px;">
      <el-button @click="handleClose" size="small">取消</el-button>
      <el-button @click="submitSelect" size="small" type="danger">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import customTable from "./customTable";
import columnHeader from "./headerComponent";
export default {
  data() {
    return {
      pageInfo: {
        current: 1,
        size: 30
      },
      customerDivHeight: 0,
      searchFormHeight: 0,
      tableHeight: 400,
      tableDataHeader: [
        { slot: "selection" },
        { filterType: "input", paramValue: "companyName", changeValue: "", slot: "companyName", label: "客户", width: "320" },
        { filterType: "input", paramValue: "customerDistributor", changeValue: "", slot: "customerDistributor", label: "经销商", width: "320" },
        { filterType: "selection", paramValue: "companyIndustryCode", changeValue: "", selectOptions: [], prop: "companyIndustryName", label: "行业", width: "320", tooltip: true },
        { slot: "operation" }
      ],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      selectChecked: [],
      companyIndustryCode: [],
      queryParams: {
        companyType: 2, // 公司类型，1经销商 ，2是工业客户
        companyName: "", // 公司名称
        customerType: null, // 客户类型
        status: "", // 状态
        pesFlag: "", // 服务等级
        customerDistributor: "",
        dutyNum: "" // 客户有无税号
      },
      customerTableData: [], // 客户列表
      selectList: [], // 表格多选列表
      loading: false,
      customerId: "",
      loadingDialog: false,
      key: 1, // table key
      totalNumber: 0, // 总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 10
      },
      // UI优化
      selfCompanyNumber: "",
      roleType: ""
    };
  },
  props: {
    showCustomerDialog: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    selectCustomerList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: {
    "column-header": columnHeader,
    "custom-table": customTable
  },
  mounted() {
    this.$_getIndustryData(); // 获取工业客户列表
  },
  created() {
    this.selfCompanyNumber = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber;
    this.customerId = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyId;
    this.roleType = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).roleType;
    if (this.roleType != 0) {
      delete this.queryParams.customerType;
    }
  },
  methods: {
    async loadMore(e) {
      if (this.customerTableData == this.totalNumber) return;
      this.pagenation.current++;
      await this.$_getCustomerData();
    },
    tableTitleSearch(obj) {
      let searchVal = obj.changeValue;
      this.tableDataHeader.forEach(item => {
        if (obj.paramValue == item.paramValue) {
          if (searchVal) {
            item.changeValue = searchVal;
          } else {
            item.changeValue = "";
          }
        }
      });
      if (obj.paramValue == "companyIndustryCode") {
        if (searchVal) {
          this.companyIndustryCode = searchVal;
        } else {
          this.companyIndustryCode = [];
        }
      } else {
        this.queryParams[obj.paramValue] = searchVal;
      }
      this.handleSearchTableData();
    },
    // 查询
    handleSearchTableData() {
      if (!this.queryParams.customerType) {
        delete this.queryParams.customerType;
      }
      this.pagenation.current = 1;
      this.customerTableData = [];
      this.$_getCustomerData();
    },
    clearSelectCustomer() {
      this.$refs.customTableCustomer.clearSelection();
    },
    submitSelect() {
      this.$emit("handleSubmitCustomer", this.selectList);
    },
    handleClose() {
      this.$emit("handleCloseCustomer");
      this.showCustomerDialog = false;
    },
    // 表格多选事件
    handleSelectionChange(select) {
      this.selectList = [];
      select.forEach(item => {
        this.selectList.push({ companyId: item.companyId, companyName: item.companyName, companyNumber: item.companyNumber });
      });
    },
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getCustomerData();
    },
    // current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.$_getCustomerData();
    },
    // 获取行业列表
    $_getIndustryData() {
      let params = {
        parentCode: "company_industry"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.tableDataHeader.forEach(item => {
                if (item.paramValue == "companyIndustryCode") {
                  item.filterType = "cascaderIndustry";
                  item.selectOptions = res.data;
                }
              });
              this.$_getCustomerData();
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取工业客户列表
    async $_getCustomerData() {
      if (this.$userInfo.userType == 2) return;
      this.loading = true;
      this.queryParams.regionProvince = "";
      this.queryParams.regionCity = "";
      let params = { ...this.queryParams, ...this.pagenation };
      if (this.companyIndustryCode.length > 0) {
        params.primaryCompanyIndustry = this.companyIndustryCode[0];
        params.companyIndustry = this.companyIndustryCode[1];
      } else {
        params.primaryCompanyIndustry = "";
        params.companyIndustry = "";
      }
      params.createTimeStart = "";
      params.createTimeEnd = "";
      params.orderBy = "createTime";
      params.descFlag = true;
      params.accountName = params.companyName;
      params.firstIndustryCode = params.primaryCompanyIndustry;
      params.secondIndustryCode = params.companyIndustry;
      params.menuCode = 'CustomerProfileList'
      if (this.$route.fullPath == "/EquipmentLubrTable") params.onlyNoDaAccoutFlag = true;
      if (this.customerTableData.length != 0 && this.customerTableData.length >= this.totalNumber) return (this.loading = false);
      await this.requestMethodPostTip("/web/customer/filterAccount", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            res.data.list.forEach(item => {
              if (!item.companyIndustryNameLevel1) item.companyIndustryNameLevel1 = "-";
              if (!item.companyIndustryName) item.companyIndustryName = "-";
              item.companyIndustryName = item.companyIndustryNameLevel1 + "/" + item.companyIndustryName;
              if (item.companyIndustryName == "-/-") item.companyIndustryName = "-";
            });
            this.customerTableData = this.customerTableData.concat(res.data.list);
            this.totalNumber = res.data.totalCount;
            let checkedrow = [];
            if (this.selectCustomerList.length == 0 && this.selectList.length == 0) return;
            const manualSelectedRow = this.selectList.map(item => item.companyId);
            const allSelectedRowId = Array.from(new Set(manualSelectedRow.concat(this.selectCustomerList)));
            this.customerTableData.forEach(item => {
              if (allSelectedRowId.includes(item.companyId)) {
                checkedrow.push(item);
              }
            });

            // this.$refs.customTableCustomer.clearSelection();
            this.$nextTick(() => {
              checkedrow.forEach(row => {
                this.$refs.customTableCustomer.toggleRowSelection(row); // 回显
              });
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
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.customer-profile {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: 28%;
      text-align: right;
      padding-bottom: 10px;
    }
  }
}
// 设置显示两行，超出省略
/deep/ .el-table th > .cell {
  word-break: keep-all !important;
  white-space: nowrap !important;
}
.no-wrap-name {
  white-space: nowrap;
  max-width: 75%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.self-tips {
  margin-left: 10px;
  min-height: 20px;
  min-width: 20px;
  width: 20px;
  height: 20px;
  background-color: #ccddff;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  font-size: 12px;
  line-height: 22px;
  color: #666;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #001450 !important;
  border-color: #001450 !important;
}
</style>
