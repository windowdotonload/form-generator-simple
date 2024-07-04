export default {
  data() {
    return {
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      promote_dialogVisible: false,
      promote_btnDisplay: false,
      promote_btnDisplay_apply: false,
      opName: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userType == 2 ? "退回" : "撤回",
      promote_revertBtnName: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userType == 2 ? "退回工单" : "撤回工单",
      promote_revertBtnName_apply: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userType == 2 ? "退回" : "撤回"
    };
  },
  methods: {
    promote_getBtnDisplay(workOrderNumber) {
      const params = {
        workOrderNumber
      };
      this.requestMethodGetTip("/workOrder/workOrderRevokeDisplay", params).then(res => {
        if (res.data.code == 1000) {
          this.promote_btnDisplay = res.data.data;
        }
      });
    },
    promote_getBtnDisplay_apply(serviceApplyOrderId) {
      const params = {
        serviceApplyOrderId
      };
      this.requestMethodGetTip("/serviceApply/applyOrderRevokeDisplay", params).then(res => {
        if (res.data.code == 1000) {
          this.promote_btnDisplay_apply = res.data.data;
        }
      });
    },
    promote_closeDialog() {
      this.promote_dialogVisible = false;
    },
    promote_revertClick(type) {
      this.$confirm(`${type == "applyOrder" ? "申请单" : "工单"}状态将变成“进行中”${type == "applyOrder" ? "" : "，可重新编辑工单信息"}，确认${this.opName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        top: "15%"
      })
        .then(() => {
          this.promote_dialogVisible = true;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
