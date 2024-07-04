<template>
  <div class="service-drawer-container">
    <el-drawer :visible.sync="serviceDrawerVisible" @closed="closeDrawer" :wrapperClosable="false" size="26%">
      <template v-slot:title>
        <p class="drawer-title">{{ serviceDrawerTitle }}</p>
      </template>
      <div class="service-opcontent-container">
        <div class="loading-mask" v-loading="drawerLoading" v-show="drawerLoading"></div>
        <div class="service-opcontent-form-container ">
          <FilterForm ref="filterForm" :overViewData="overViewData" v-show="serviceDrawerType == 0 || serviceDrawerType == 2" :class="showBorderClass" :selectedData="selectedData" />
          <SubmitFrom
            ref="submitFrom"
            :overViewData="overViewData"
            :planAdd="planAdd"
            :indexPlan="indexPlan"
            :planList="planList"
            v-show="serviceDrawerType == 1 || serviceDrawerType == 2"
            :class="showBorderClass"
            :selectedData="selectedData"
            :serviceDrawerType="serviceDrawerType"
          />
          <cancelReason
            ref="cancelReasonForm"
            :overViewData="overViewData"
            :planList="planList"
            v-show="serviceDrawerType == 0"
            :class="showBorderClass"
            :selectedData="selectedData"
            :serviceDrawerType="serviceDrawerType"
          ></cancelReason>
          <FormTip :serviceDrawerType="serviceDrawerType" :overViewData="overViewData" />
        </div>

        <div class="form-btn-bar">
          <el-button size="mini" type="danger" class="op-btn" @click="confirmSubmit">确定</el-button>
          <el-button size="mini" plain class="op-btn" @click="cancelDrawer">取消</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="" :visible.sync="dialogVisible" width="20%" :before-close="handleClose">
      <div>您将修改{{ editNum }}条服务项的 {{ updateFields }} 字段，是否继续？</div>
      <div style="color: #dd0000;font-size: 13px;margin-top: 15px;">*注：MSAA服务不参与批量编辑，只能单个编辑。</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createServiceItemBatch, queryEditNum, editServiceBatch, cancelServiceBatch } from "../api/serviceBatchOperationApi";
export default {
  components: {
    SubmitFrom: () => import("./submitFrom.vue"),
    FilterForm: () => import("./filterForm.vue"),
    FormTip: () => import("./formTip.vue"),
    CancelReason: () => import("./cancelReason.vue")
  },
  props: {
    pesInfo: {
      type: Object,
      default: () => {}
    },
    serviceDrawerVisible: {
      type: Boolean,
      default: false
    },
    serviceDrawerTitle: {
      type: String,
      default: "添加服务项"
    },
    serviceDrawerType: {
      type: Number,
      default: 0
    },
    planList: {
      type: Array,
      default: null
    },
    indexPlan: {
      type: Number,
      default: 0
    },
    planAdd: {
      type: String,
      default: ""
    },
    overViewData: {
      type: Object,
      default: () => {}
    },
    selectedData: {
      type: Array,
      default: null
    }
  },
  inject: ["SERVICEVM"],
  computed: {
    showBorderClass() {
      if (this.serviceDrawerType == 0 || this.serviceDrawerType == 2) return "border";
      return "";
    }
  },
  data() {
    return {
      drawerLoading: false,
      dialogVisible: false,
      submitParams: {},
      editNum: "",
      updateFields: "",
      updateKayNameMap: {
        planId: "计划目标",
        workshopId: "所属车间",
        serviceName: "",
        chargeUserId: "服务负责人",
        planStartTime: "计划开始时间",
        serviceNumber: "服务类型",
        customerProjectUsers: "客户项目成员",
        distributorProjectUsers: "经销商项目成员",
        mobilProjectUsers: "美孚项目成员"
      }
    };
  },
  provide() {
    return {
      DRAWERVM: this
    };
  },
  methods: {
    closeDrawer() {
      this.$emit("update:serviceDrawerVisible", false);
    },
    switchDrawerLoading(show) {
      this.drawerLoading = show;
    },
    evokeConfirmBox(message, func) {
      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          func();
        })
        .catch(() => "nop");
    },
    confirmSubmit() {
      if (this.serviceDrawerType == 1) {
        console.log(this.planAdd, this.indexPlan);
        this.createServiceBatch();
      } else if (this.serviceDrawerType == 2) {
        this.editServiceBatch();
      } else if (this.serviceDrawerType == 0) {
        this.cancelServiceBatch();
        this.$gio.PES_service_batchcancel({ customer: this.overViewData.customerName });
      }
    },
    cancelDrawer() {
      this.closeDrawer();
      if (this.serviceDrawerType == 1) {
      } else if (this.serviceDrawerType == 2) {
        this.editServiceBatch();
        this.$gio.PES_service_editor({ customer: this.overViewData.customerName });
      } else if (this.serviceDrawerType == 0) {
        this.cancelServiceBatch();
      }
    },
    async getOperationServiceNum(preParams = {}) {
      const queryNumParams = {
        pesId: this.overViewData.pesInfoId,
        ...preParams
      };
      if (this.selectedData && this.selectedData.length) {
        queryNumParams.itemIdList = this.selectedData.map(sel => sel.id);
        return { editNum: this.selectedData.length, queryNumParams };
      } else if (!this.selectedData) {
        const filterFormRef = this.$refs.filterForm;
        const filterForm = filterFormRef.filterForm;
        Object.entries(filterForm).forEach(([key, val]) => {
          if (!val) return;
          if (key == "planStartTime") val = this.moment(val).format("YYYY-MM-DD");
          queryNumParams[key] = val;
          queryNumParams[`${key}Search`] = val;
        });
        this.switchDrawerLoading(true);
        const editNum = await queryEditNum(queryNumParams);
        this.switchDrawerLoading(false);
        return { editNum, queryNumParams, filterForm };
      }
    },
    checkExistFilterParams(params) {
      if (!params && this.selectedData && this.selectedData.length) return true;
      if (params && Object.entries(params).filter(([_, val]) => val).length) return true;
      this.$message({
        type: "warning",
        message: "请选择筛选条件"
      });
      return false;
    },
    async createServiceBatch() {
      const submitFormRef = this.$refs.submitFrom;
      const submitForm = submitFormRef.submitForm;
      submitFormRef.$refs.submitFromValidate.validate(valid => {
        if (valid) {
          if (!this.planAdd) {
            this.evokeConfirmBox(`您将创建${submitForm.num}条${submitForm.serviceName}服务，是否继续？`, async () => {
              const createParams = {
                num: submitForm.num,
                planId: submitForm.planId,
                pesId: this.overViewData.pesInfoId,
                workshopId: submitForm.workshopId,
                serviceName: submitForm.serviceName,
                chargeUserId: this.$userInfo.userType == 0 ? submitForm.chargeUserId[1] : submitForm.chargeUserId,
                planStartTime: submitForm.planStartTime ? this.moment(submitForm.planStartTime).format("YYYY-MM-DD") : "",
                serviceNumber: submitForm.serviceNumber[submitForm.serviceNumber.length - 1],
                customerProjectUsers: submitForm.customerProjectUsers ? submitForm.customerProjectUsers.join(",") : "",
                distributorProjectUsers: submitForm.distributorProjectUsers ? submitForm.distributorProjectUsers.join(",") : "",
                mobilProjectUsers: submitForm.mobilProjectUsers ? submitForm.mobilProjectUsers.join(",") : ""
              };
              const submitParams = {};
              Object.entries(createParams).forEach(([key, val]) => {
                if (val) submitParams[key] = val;
              });
              const res = await createServiceItemBatch(submitParams);
              if (res.data.code == 1000) {
                this.$message({
                  type: "success",
                  message: "创建成功"
                });
                this.closeDrawer();
                this.SERVICEVM.drawerCallRefreshTable();
              }
              if (this.serviceDrawerType == 1) {
              } else if (this.serviceDrawerType == 2) {
              } else if (this.serviceDrawerType == 0) {
              }
              this.$gio.PES_service_batchcreate({ customer: this.overViewData.customerName });
            });
          } else {
            const createParams = {
              num: submitForm.num,
              planId: submitForm.planId,
              pesId: this.overViewData.pesInfoId,
              workshopId: submitForm.workshopId,
              serviceName: submitForm.serviceName,
              chargeUserId: this.$userInfo.userType == 0 ? submitForm.chargeUserId[1] : submitForm.chargeUserId,
              planStartTime: submitForm.planStartTime ? this.moment(submitForm.planStartTime).format("YYYY-MM-DD") : "",
              serviceNumber: submitForm.serviceNumber[submitForm.serviceNumber.length - 1],
              customerProjectUsers: submitForm.customerProjectUsers ? submitForm.customerProjectUsers.join(",") : "",
              distributorProjectUsers: submitForm.distributorProjectUsers ? submitForm.distributorProjectUsers.join(",") : "",
              mobilProjectUsers: submitForm.mobilProjectUsers ? submitForm.mobilProjectUsers.join(",") : "",
              mobilProjectUserNames: submitForm.mobilProjectUsersNames,
              distributorProjectUserNames: submitForm.distributorProjectUsersNames,
              customerProjectUserNames: submitForm.customerProjectUsersNames
            };
            const submitParams = {};
            Object.entries(createParams).forEach(([key, val]) => {
              if (val) submitParams[key] = val;
            });
            this.closeDrawer();
            this.SERVICEVM.drawerCallRefreshTable(submitParams);
          }
        }
      });
    },
    async editServiceBatch() {
      const submitFormRef = this.$refs.submitFrom;
      const submitForm = submitFormRef.submitForm;
      submitFormRef.$refs.submitFromValidate.validate(async valid => {
        if (valid) {
          const { queryNumParams, editNum, filterForm } = await this.getOperationServiceNum();
          if (!this.checkExistFilterParams(filterForm)) return;
          const handleObj = {
            workshopId: submitForm.workshopId,
            serviceName: submitForm.serviceName,
            planId: submitForm.planId,
            chargeUserId: this.$userInfo.userType == 0 ? submitForm.chargeUserId[1] : submitForm.chargeUserId,
            planStartTime: submitForm.planStartTime ? this.moment(submitForm.planStartTime).format("YYYY-MM-DD") : "",
            serviceNumber: submitForm.serviceNumber[submitForm.serviceNumber.length - 1],
            customerProjectUsers: submitForm.customerProjectUsers ? submitForm.customerProjectUsers.join(",") : "",
            distributorProjectUsers: submitForm.distributorProjectUsers ? submitForm.distributorProjectUsers.join(",") : "",
            mobilProjectUsers: submitForm.mobilProjectUsers ? submitForm.mobilProjectUsers.join(",") : ""
          };
          const updateInfoDto = {};
          const updateFields = [];
          Object.entries(handleObj).forEach(([key, val]) => {
            if (val) {
              updateInfoDto[key] = val;
              if (this.updateKayNameMap[key]) updateFields.push(this.updateKayNameMap[key]);
            }
          });
          const submitParams = {
            ...queryNumParams,
            pesId: this.overViewData.pesInfoId,
            updateInfoDto,
            webServiceBatchUplFlag: true
          };
          this.dialogVisible = true;
          this.editNum = editNum;
          this.updateFields = updateFields.join("，");
          this.submitParams = submitParams;
          this.$gio.PES_service_batcheditor({ customer: this.overViewData.customerName });
        }
      });
    },
    async dialogSure() {
      if (this.editNum == 0) return this.closeDrawer();
      const res = await editServiceBatch(this.submitParams);
      if (res.data.code == 1000) {
        this.$message({
          type: "success",
          message: "修改成功"
        });
        this.closeDrawer();
        this.SERVICEVM.drawerCallRefreshTable();
      }
    },
    async cancelServiceBatch() {
      const { queryNumParams, editNum, filterForm } = await this.getOperationServiceNum({ cancelFlag: true });
      if (!this.checkExistFilterParams(filterForm)) return;
      console.log(this.$refs.cancelReasonForm);
      const addPlanFormRef = this.$refs.cancelReasonForm;
      const addPlanForm = addPlanFormRef.addPlanForm;
      if (!addPlanForm.reason) {
        this.$message({
          type: "warning",
          message: "请输入取消原因"
        });
        return;
      }
      this.evokeConfirmBox(`您将取消${editNum}条服务，是否继续？`, async () => {
        if (editNum == 0) return this.closeDrawer();
        const submitFormRef = this.$refs.submitFrom;
        const submitForm = submitFormRef.submitForm;

        const submitParams = {
          ...queryNumParams,
          num: submitForm.num,
          reason: addPlanForm.reason,
          pesId: this.overViewData.pesInfoId
        };
        const res = await cancelServiceBatch(submitParams);
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "取消成功"
          });
          this.closeDrawer();
          this.SERVICEVM.drawerCallRefreshTable();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.service-drawer-container {
  /deep/ .el-drawer__header {
    padding: 0;
    margin: 0;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: 1px solid #e9e9e9;
  }
}
.drawer-title {
  font-size: 16px;
  color: #000;
  font-weight: 500;
}
.service-opcontent-container {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: space-between;
  width: 100%;
  height: calc(100vh - 35px);
  padding: 30px;
  overflow: auto;
}
.loading-mask {
  position: fixed;
  width: 26%;
  height: 100vh;
  top: 0;
  right: 0;
  z-index: 99;
  background: rgb(255, 255, 255, 0.5);
  opacity: 0.5;
}
.service-opcontent-form-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  width: 100%;
}

.form-btn-bar {
  display: flex;
  justify-content: space-between;
  align-self: flex-end;
  width: 100%;

  .op-btn {
    height: 36px;
    width: 50%;
  }
}
.border {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e9e9ee;
  margin-bottom: 15px;
}
</style>
