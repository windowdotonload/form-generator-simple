<template>
  <div style="position:relative">
    <div class="customer-group" :style="mainminheight" id="customerGroupDiv">
      <div class="toolbox-con flexBetween" id="searchForm">
        <!-- 查询条件 -->
        <el-form ref="searchForm" :model="searchForm" :inline="true" size="small">
          <el-form-item>
            <el-button size="small" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button type="danger" size="small" @click="createGroup">新建客户组</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table class="table" :tableHeader="tableDataHeader" :tableData="tableData" :tableHeight="tableHeight + ''" :loading="loading" @changeSearch="tableTitleSearch">
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="200" align="center">
          <i class="el-icon-share"></i>
          <template #default="{ row }">
            <el-link type="danger" @click="goDetail(row)" :underline="false" style="color:rgb(0,20,80)">
              预览
            </el-link>
          </template>
        </el-table-column>
      </custom-table>
      <!-- 分页 -->
      <el-pagination
        v-if="tableTotal"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.current"
        :page-size="pageInfo.size"
        :page-sizes="[10, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableTotal"
        class="listOptimizePage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import CreateCustomerInfo from "./components/createGroupInfo.vue";
import CreateSelCustomet from "./components/createSelCustomer.vue";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
export default {
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 110}px`,
      tableHeight: null,
      tableDataHeader: [
        { filterType: "input", paramValue: "groupName", changeValue: "", prop: "groupName", label: "客户组名称", width: "200", fixed: "left", tooltip: true },
        { filterType: "input", paramValue: "creator", changeValue: "", prop: "createUser", label: "创建人", width: "130", tooltip: true },
        { prop: "createTime", label: "创建时间", width: "150", tooltip: true },
        { prop: "amountOfDevice", label: "累计设备数量", width: "180", tooltip: true },
        { prop: "amountOfWorkOrder", label: "累计工单数量", width: "180", tooltip: true },
        { slot: "operation", label: "操作" }
      ],
      loading: false,
      searchForm: {
        groupName: "",
        creator: ""
      },
      customerTableData: [],
      customerTablTotal: 0,
      pageInfo: {
        current: 1,
        size: 30
      },
      modelStateOb: {
        recordData: {
          opType: "create"
        },
        currentStep: 0,
        title: "客户组信息",
        modelBoxWidth: "23%",
        dialogVisible: false
      }
    };
  },
  components: {
    "custom-table": customTable,
    "column-header": columnHeader
  },
  created() {
    if (this.$route.params.isSaveQuery) {
      this.searchForm = JSON.parse(sessionStorage.getItem("searchForm"));
      this.pageInfo.current = this.searchForm.current;
      this.pageInfo.size = this.searchForm.size;
      this.tableDataHeader.forEach(item => {
        item.changeValue = this.searchForm[item.prop] || "";
        if(item.prop == "createUser") {
          item.changeValue = this.searchForm.creator || "";
        }
      });
    }
    this.getCustomerGruopList();
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 110}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  },
  beforeRouteLeave(to, from, next) {
    this.searchForm.current = this.pageInfo.current;
    this.searchForm.size = this.pageInfo.size;
    sessionStorage.setItem("searchForm", JSON.stringify(this.searchForm));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/CustomerGroup/CustomerGroupDetail") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  methods: {
    tableTitleSearch(obj) {
      let searchVal = obj.changeValue;
      this.tableDataHeader.forEach(item => {
        if (obj.paramValue == item.paramValue) {
          item.changeValue = searchVal === 0 || searchVal === false ? searchVal : searchVal || "";
        }
      });
      this.searchForm[obj.paramValue] = searchVal;
      this.getCustomerGruopList();
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let customerGroupDiv = 0;
        let searchFormHeight = 0;
        if (document.getElementById("customerGroupDiv")) {
          customerGroupDiv = document.getElementById("customerGroupDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(customerGroupDiv) - Number(searchFormHeight) - 70;
      }, 200);
    },
    handleSizeChange(val) {
      this.pageInfo.size = val;
      this.getCustomerGruopList();
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val;
      this.getCustomerGruopList();
    },
    createGroup() {
      const components = { CreateCustomerInfo, CreateSelCustomet };
      this.$createModel({
        modelStateOb: Object.assign(this.modelStateOb, { successCb: this.getCustomerGruopList }),
        components
      });
    },
    goDetail(row) {
      this.$router.push({
        name: "CustomerGroupDetail",
        query: { groupId: row.id },
        params: { groupInfo: row }
      });
    },
    resetSearch() {
      this.searchForm = {
        groupName: "",
        creator: ""
      };
      (this.pageInfo = {
        current: 1,
        size: 30
      }),
        this.tableDataHeader.forEach(item => {
          item.changeValue = "";
        });
      this.getCustomerGruopList();
    },
    async getCustomerGruopList() {
      this.loading = true;
      const params = {
        ...this.pageInfo
      };
      if (this.searchForm.groupName) params.groupName = this.searchForm.groupName;
      if (this.searchForm.creator) params.creator = this.searchForm.creator;
      const res = await this.requestMethodGetHandlePage("/company/group/listByPage", params, { vm: this, method: "getCustomerGruopList", currentKey: "pageInfo.current" });

      if (res.data.code == 1000) {
        this.tableData = res.data.data.list;
        this.tableTotal = res.data.data.totalCount;
      }
      this.loading = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.customer-group {
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
}
.customer-group-container {
  position: relative;
}
.search-bar {
  margin-top: 20px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
.create-btn {
  position: absolute;
  right: 30px;
  top: -60px;
}
</style>
