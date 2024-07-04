<template>
  <div class="detail-container">
    <div style="position: absolute; right: 10px; top: 80px">
      <el-button size="small" type="danger" v-if="overviewData" @click="editGroup">编辑</el-button>
      <el-button size="small" plain @click="removeGroup">移除</el-button>
    </div>
    <div class="split-line"></div>
    <div class="content-box">
      <div class="industry-container">
        <div style="display: flex; align-items: center; height: 26px">
          <img src="./assets/link-square.png" alt="" style="margin-right: 10px" />
          <span style="font-weight: 700; font-size: 20px; line-height: 26px">{{ groupInfo.groupName }}</span>
        </div>

        <div style="display: flex; align-items: center; height: 26px; margin-top: 20px">
          <div style="display: flex; align-item: center; height: 15px; margin-right: 30px">
            <span style="font-size: 13px; color: #999; margin-right: 10px">创建日期</span>
            <span style="font-size: 13px; color: #000; line-height: 18px">{{ groupInfo.createTime }}</span>
          </div>
          <div style="display: flex; align-item: center">
            <span style="font-size: 13px; color: #999; margin-right: 10px">创建人</span>
            <span style="font-size: 13px; color: #000">{{ groupInfo.createUser || "--" }}</span>
          </div>
        </div>
      </div>

      <div class="amount-bar" v-if="overviewData">
        <div class="amount-item" v-for="item in amountType" :key="item.key">
          <span>{{ item.title }}</span>
          <span style="color: #d10000">{{ overviewData[item.key] }}</span>
        </div>
      </div>
      <div class="table-container">
        <el-table :header-cell-style="{ background: '#f7f7f7' }" :data="customerTableData" v-loading="loading" style="width: 100%; margin-top: 20px">
          <el-table-column prop="companyName" label="客户名称" width="300px">
            <template #default="scope">
              <div style="display: flex; align-items: center">
                <span>{{ scope.row.companyName }}</span
                ><span class="self-tips" v-if="roleType == '0' && selfCompanyNumber == scope.row.customerCompanyNumber">直</span>
                <img v-if="scope.row.pesFlag == '1' || scope.row.pesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.pesFlag == '2' || scope.row.pesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="customerDistributor" label="经销商" />
          <el-table-column show-overflow-tooltip prop="companyIndustryName" label="行业" />
          <el-table-column show-overflow-tooltip prop="regionCityName" label="城市" />
          <el-table-column show-overflow-tooltip prop="createTimeStr" label="创建日期" />
          <el-table-column show-overflow-tooltip prop="deviceTotalCount" label="设备数">
            <template #default="{ row }">
              <span style="cursor: pointer" @click="customerDetail(row, 0)">{{ row.deviceTotalCount }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="workerorderTotalCount" label="工单数">
            <template #default="{ row }">
              <span style="cursor: pointer" @click="customerDetail(row, 1)">{{ row.workerorderTotalCount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <span v-if="row.status == 1" style="color: rgb(0, 136, 136); font-weight: 800">使用中</span>
              <span v-if="row.status == 2" style="color: #008888; font-weight: 800">潜在客户</span>
              <span v-if="row.status == 3" style="color: #008888; font-weight: 800">现有客户</span>
              <span v-if="row.status == 0" style="color: #d10000; font-weight: 800">已停用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="customerDetail(row, 3)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenation.current"
      :page-size="pagenation.size"
      :page-sizes="[10, 30, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="customerTablTotal"
    >
    </el-pagination>
  </div>
</template>

<script>
import CreateCustomerInfo from "./components/createGroupInfo.vue";
import CreateSelCustomet from "./components/createSelCustomer.vue";
export default {
  props: {
    groupInfo: {
      type: Object
    }
  },
  data() {
    return {
      loading: false,
      modelStateOb: {
        recordData: {
          groupName: "",
          comoanyIds: null,
          editFlag: true,
          groupId: null
        },
        currentStep: 0,
        title: "客户组信息",
        modelBoxWidth: "23%",
        dialogVisible: false
      },
      pagenation: {
        current: 1,
        size: 10
      },
      scaleList: [],
      overviewData: null,
      customerTableData: null,
      amountType: [
        { title: "累计设备数量", key: "amountOfDevice" },
        { title: "累计工单数量", key: "amountOfWorkOrder" },
        { title: "客户数量", key: "amountOfCustomer" },
        { title: "PES客户数量", key: "amountOfPesCustomer" },
        { title: "DPES客户数量", key: "amountOfDpesCustomer" },
        { title: "SP客户数量", key: "amountOfSpCustomer" }
      ]
    };
  },
  created() {
    this.getGroupDetail();
    this.$_getCustomerData();
    this.$_getScaleList();
    this.modelStateOb.recordData.groupId = this.$route.query.groupId;
  },
  methods: {
    $_getScaleList() {
      this.getDicDataList("cust_scale").then(res => {
        this.scaleList = res;
      });
    },
    handleSizeChange(val) {
      this.pagenation.size = val;
      this.$_getCustomerData();
    },
    handleCurrentChange(val) {
      this.pagenation.current = val;
      this.$_getCustomerData();
    },
    customerDetail(row, type) {
      if (type == 0) {
        this.$router.replace({
          name: "EquipmentProfile",
          params: {
            routerCompanyInfo: row
          }
        });
      } else if (type == 1) {
        this.$router.replace({
          name: "NewWorkOrderList",
          params: {
            routerCompanyInfo: row
          }
        });
      } else {
        this.$router.replace({
          path: "/CustomerProfile/CustomerProfileDetail",
          query: {
            companyId: row.companyId,
            companyNumber: row.companyNumber,
            scaleList: JSON.stringify(this.scaleList)
          }
        });
      }
    },
    async removeGroup() {
      this.$confirm("确认删除该分组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.requestMethodGetTip("/company/group/delete", {
            id: this.$route.query.groupId
          });
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.$router.go(-1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    resetName(val) {
      this.groupInfo.groupName = val;
    },
    editGroup() {
      this.modelStateOb.recordData.groupName = this.groupInfo.groupName;
      this.modelStateOb.recordData.comoanyIds = this.overviewData.companyIds;
      const components = { CreateCustomerInfo, CreateSelCustomet };
      this.$createModel({
        modelStateOb: Object.assign(this.modelStateOb, { successCb: this.refresh, resetName: this.resetName }),
        components
      });
    },
    refresh() {
      this.getGroupDetail();
      this.$_getCustomerData();
    },
    // 获取工业客户列表
    $_getCustomerData() {
      this.loading = true;
      let params = { ...this.pagenation, customerGroupId: this.$route.query.groupId };
      this.requestMethodGet("/web/customer/queryCompanyListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.customerTableData = res.data.list || [];
            this.customerTablTotal = res.data.totalCount;
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
    async getGroupDetail() {
      const params = {
        groupId: this.$route.query.groupId
      };
      const res = await this.requestMethodGetTip("/company/group/overview", params);
      if (res.data.code == 1000) {
        this.overviewData = res.data.data || {};
      }
    }
  }
};
</script>

<style lang="less" scoped>
.split-line {
  width: 100%;
  height: 1px;
  margin-top: 5px;
  background: #e9e9e9;
}
.content-box {
  padding: 20px;
}
.industry-container {
  padding: 16px;
  height: 85px;
  background: #f9f9f9;
  border-radius: 6px;
}
.amount-bar {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .amount-item {
    padding: 13px 20px;
    border-radius: 3px;
    border: 1px solid #ccddff;
    background: rgba(204, 221, 255, 0.2);
    width: 13%;
    color: #333333;
    font-size: 13px;
  }
}
.table-container {
  height: calc(100vh - 400px);
  overflow: auto;
}
</style>
