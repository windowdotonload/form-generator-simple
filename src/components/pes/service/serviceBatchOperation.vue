<template>
  <div class="service-batch-container" v-loading="serviceTableLoading">
    <div class="button-container">
      <el-button size="mini" type="danger" @click="goBack">返回</el-button>
    </div>
    <div class="service-search-container">
      <el-form :inline="true" :model="filterForm" class="search-form">
        <el-form-item label="服务类型">
          <el-cascader
            ref="serviceTypeCascader"
            clearable
            filterable
            :options="filterServiceTypeTree"
            :props="{ value: 'serviceNumber', label: 'serviceName', children: 'children', emitPath: false }"
            :show-all-levels="false"
            v-model="filterForm.serviceNumber"
            size="small"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="服务负责人">
          <el-select size="small" clearable v-model="filterForm.chargeUserId" placeholder="请选择">
            <el-option v-for="owner in filterChargeUserList" :key="owner.userId" :label="owner.userName" :value="owner.userId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划开始时间">
          <el-date-picker size="small" clearable v-model="filterForm.planStartTime" type="date" placeholder="请选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button plian size="small" @click="resetFilterForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="service-data-table-container">
      <div class="service-data-table-opbtn-bar">
        <el-button
          size="mini"
          type="danger"
          @click="
            opService(1);
          "
        >
          添加服务项
        </el-button>
        <el-button
          size="mini"
          plain
          type="danger"
          @click="
            opService(2)
          "
        >
          批量编辑
        </el-button>
        <el-button
          size="mini"
          plain
          @click="
            opService(0)
          "
        >
          批量取消
        </el-button>
      </div>
      <el-table
        @select="selectTableData"
        @select-all="selectTableData"
        style="width: 100%"
        height="90%"
        ref="serviceTable"
        :data="serviceTableData"
        :header-cell-style="{ background: '#f7f7f7' }"
        stripe
      >
        <el-table-column show-overflow-tooltip type="selection" width="55" :selectable="row => serviceTableEditable(row)" />
        <el-table-column show-overflow-tooltip prop="serviceName" label="服务类型" />
        <el-table-column show-overflow-tooltip prop="planStartTime" label="计划开始时间" />
        <el-table-column show-overflow-tooltip prop="workshopName" label="车间" />
        <el-table-column show-overflow-tooltip prop="chargeUserName" label="服务负责人" />
        <el-table-column show-overflow-tooltip prop="mobilProjectUserNames" label="美孚项目成员" :formatter="(a, b, c) => (c ? c : '暂无')" v-if="$route.query.serviceCompanyType == '0'" />
        <el-table-column
          show-overflow-tooltip
          prop="distributorProjectUserNames"
          label="经销商项目成员"
          :formatter="(a, b, c) => (c ? c : '暂无')"
          v-if="($route.query.distributorCompanyType == '1' && $route.query.serviceCompanyType == '0') || $route.query.serviceCompanyType == '1'"
        />
        <el-table-column show-overflow-tooltip prop="customerProjectUserNames" label="客户项目成员" :formatter="(a, b, c) => (c ? c : '暂无')" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="text"
              size="mini"
              style="color:#001450"
              v-show="serviceTableEditable(row)"
              @click="
                editRow(row)
              "
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              style="color:#909399"
              v-show="servcieTableBtnPermission(0, row)"
              @click="
                operationSingleRow(row, 3)
              "
            >
              取消
            </el-button>
            <el-button
              type="text"
              size="mini"
              style="color:#001450;margin-left:0"
              v-show="servcieTableBtnPermission(1, row)"
              @click="
                operationSingleRow(row, 0)
              "
            >
              恢复
            </el-button>
            <el-button type="text" size="mini" style="color:#B3B3B3;margin-left:0" disabled v-show="servcieTableBtnPermission(2, row)">无法编辑</el-button>
            <el-button type="text" size="mini" style="color:#B3B3B3;margin-left:0" disabled v-show="servcieTableBtnPermission(3, row)">由美孚修改，无法编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="serviceTableDataPageInfo.size"
        :current-page="serviceTableDataPageInfo.current"
        :total="serviceTableTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="position:absolute;bottom:5px;background:#fff;z-index:5"
      >
      </el-pagination>
    </div>
    <OperationDrawer :serviceDrawerVisible.sync="serviceDrawerVisible" v-bind="serviceDrawerOpTypeParams" v-if="serviceDrawerVisible" />
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import { clearState, getServiceTableData, getEditServiceChargetUserList, getEditServiceTypeTree, editServcieSingle } from "../api/serviceBatchOperationApi";
export default {
  components: {
    OperationDrawer: () => import("../component/serviceBatchOperationDrawer.vue")
  },
  provide() {
    return {
      SERVICEVM: this
    };
  },
  data() {
    return {
      filterForm: {
        planStartTime: "",
        chargeUserId: "",
        serviceNumber: ""
      },
      filterChargeUserList: [],
      filterServiceTypeTree: [],
      serviceTypes: [{ label: "类型1", value: "1" }, { label: "类型2", value: "2" }, { label: "类型3", value: "3" }],
      serviceOwners: [{ label: "负责人1", value: "1" }, { label: "负责人2", value: "2" }, { label: "负责人3", value: "3" }],
      serviceTableData: [],
      serviceTableLoading: false,
      serviceTableDataPageInfo: {
        size: 30,
        current: 1
      },
      serviceTableTotal: 0,
      serviceTableSelectedData: null,
      serviceDrawerVisible: false,
      serviceDrawerOpTypeParamsMap: {
        0: {
          serviceDrawerType: 0,
          serviceDrawerTitle: "批量取消服务项",
          selectedData: null
        },
        1: {
          serviceDrawerType: 1,
          serviceDrawerTitle: "添加服务项"
        },
        2: {
          serviceDrawerType: 2,
          serviceDrawerTitle: "批量编辑服务项",
          selectedData: null
        }
      },
      serviceDrawerOpTypeParams: null
    };
  },
  watch: {
    filterForm: {
      handler(val) {
        this.refreshServiceTableData(val);
      },
      deep: true
    }
  },
  created() {
    this.getServiceTableData();
  },
  methods: {
    resetFilterForm() {
      this.filterForm = {
        planStartTime: "",
        chargeUserId: "",
        serviceNumber: ""
      };
    },
    drawerCallRefreshTable() {
      this.resetFilterForm();
      this.getFilterSourceData();
    },
    refreshServiceTableData(params, retainCurrentPage = false) {
      this.serviceTableDataPageInfo = {
        size: 30,
        current: 1
      };
      this.serviceTableSelectedData = null;
      this.getServiceTableData(params);
    },
    handleSizeChange(size) {
      this.serviceTableSelectedData = null;
      this.serviceTableDataPageInfo.size = size;
      this.getServiceTableData(this.filterForm);
    },
    handleCurrentChange(current) {
      this.serviceTableSelectedData = null;
      this.serviceTableDataPageInfo.current = current;
      this.getServiceTableData(this.filterForm);
    },
    switchServiceTableLoading(show) {
      this.serviceTableLoading = show;
    },
    editRow(row) {
      this.$refs.serviceTable.toggleRowSelection(row, true);
      this.opService(2, cloneDeep(row));
    },
    async operationSingleRow(row, opType) {
      const params = {
        id: row.id,
        status: opType
      };
      const res = await editServcieSingle(params);
      this.resetFilterForm();
    },
    opService(type, selectedDataSingleRow) {
      // type ： 0 - 批量取消 1 - 添加服务项 2 - 批量编辑
      const params = cloneDeep(this.serviceDrawerOpTypeParamsMap[type]);
      if (type != 1) {
        params.selectedData = this.handleMergeSelectedTableData(selectedDataSingleRow);
      }
      this.serviceDrawerOpTypeParams = params;
      this.serviceDrawerVisible = true;
    },
    handleMergeSelectedTableData(selectedDataSingleRow) {
      if (!selectedDataSingleRow && !this.serviceTableSelectedData) return null;
      if (!this.serviceTableSelectedData) return [selectedDataSingleRow];
      const curSelTableData = cloneDeep(this.serviceTableSelectedData);
      if (!selectedDataSingleRow) return curSelTableData;

      const exist = curSelTableData.some(row => row.id == selectedDataSingleRow.id);
      if (!exist) {
        curSelTableData.push(selectedDataSingleRow);
        this.serviceTableSelectedData.push(selectedDataSingleRow);
      }
      return curSelTableData;
    },
    servcieTableBtnPermission(judgeType, item) {
      // judgeType 0 取消 1 恢复 2 无法编辑 3 - 由美孚修改无法编辑
      if (judgeType == 0) {
        return item.status == 0 && item.editFlag;
      } else if (judgeType == 1) {
        return item.status == 3 && item.editFlag;
      } else if (judgeType == 2) {
        return (item.status == 1 || item.status == 2 || item.status == 4) && item.editFlag;
      } else if (judgeType == 3) {
        return !item.editFlag && this.$userInfo.userType == "1";
      }
    },
    serviceTableEditable(row) {
      return !this.servcieTableBtnPermission(2, row) && !this.servcieTableBtnPermission(3, row) && !this.servcieTableBtnPermission(1, row);
    },
    async getFilterSourceData() {
      const params = {
        pesId: this.$route.query.pesId
      };
      const chargeUserList = await getEditServiceChargetUserList(params);
      const configTree = await getEditServiceTypeTree(params);
      this.filterChargeUserList = chargeUserList.data.data.filter(item => item);
      this.filterServiceTypeTree = configTree;
    },
    async getServiceTableData(receiveFilterParams, retainCurrentPage = false) {
      this.switchServiceTableLoading(true);
      if (!receiveFilterParams && !retainCurrentPage) {
        await this.getFilterSourceData();
      }
      const params = {
        pesId: this.$route.query.pesId,
        ...this.serviceTableDataPageInfo
      };
      if (receiveFilterParams) {
        Object.entries(receiveFilterParams).forEach(([key, val]) => {
          if (!val) return;
          if (key == "planStartTime") {
            params[key] = this.moment(val).format("YYYY-MM-DD");
          } else {
            params[key] = val;
          }
        });
      }
      try {
        const res = await getServiceTableData(params);
        const { list, total } = res;
        this.serviceTableData = list || [];
        this.serviceTableTotal = total || 0;
      } finally {
        this.switchServiceTableLoading(false);
      }
    },
    selectTableData(selection) {
      if (selection && selection.length) {
        this.serviceTableSelectedData = selection;
      } else {
        this.serviceTableSelectedData = null;
      }
    },

    goBack() {
      clearState();
      if (this.$route.query.resource == "plan") {
        const planData = JSON.parse(sessionStorage.getItem("plan" + this.$userInfo.userId + "y"));
        setTimeout(() => {
          this.$router.push({
            path: "/CustomerProfile/servicePlan",
            query: {
              false: true,
              pesId: planData.pesId,
              statusPlan: planData.statusPlan,
              companyNumber: planData.companyNumber,
              companyId: planData.companyId,
              resource: "planY",
              reportId: planData.reportId,
              serviceCompanyType: planData.serviceCompanyType,
              pesFlag: planData.pesFlag
            }
          });
        }, 100);
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.service-batch-container {
  margin-top: 20px;
  border-top: 1px solid #e9e9e9;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 30px;
  height: 95%;
  min-height: 500px;
}
.button-container {
  position: absolute;
  right: 30px;
  top: -55px;
}
.service-search-container {
  height: 60px;
  display: flex;
  align-items: center;
}
.service-data-table-container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 80px);
  padding: 20px;
  padding-bottom: 35px;
  border-radius: 10px;
  border: 1px solid #e9e9e9;
}
.service-data-table-opbtn-bar {
  margin-bottom: 15px;
}
</style>
