<template>
  <el-dialog class="closeWorkOrder" :visible="promoteDialogVisible" :show-close="false" width="30%" top="15%">
    <div style="display: flex; font-family: MicrosoftYaHei; line-height: 18px; font-size: 18px; color: #000; margin: 0px; align-items: center">
      <img src="../../assets/notice-icon.png" alt="" style="width: 18px; height: 18px; margin-right: 10px" />{{ nameMap[dialogType] }}
    </div>
    <div class="notice-title">{{ dialogType == "revert" ? "撤回" : "退回" }}后，{{ orderNameType[orderType] }}状态变成“进行中”。</div>
    <div v-show="dialogType == 'revert'">
      <div class="radioGroup">
        <span class="reason-item" :class="activeValue == item.value ? 'reason-item-active' : ''" v-for="item in reasonList" :key="item.value" :label="item.text" @click="selReasonItem(item)">
          {{ item.text }}
        </span>
      </div>
      <span v-show="activeValue == 3" class="notice-title" style="margin-top:20px;display:inline-block;margin-bottom:0">撤回原因</span>
      <el-input
        ref="otherReasonInput"
        v-show="activeValue == 3"
        style="margin-top: 16px"
        type="textarea"
        placeholder="请输入"
        v-model="otherReason"
        maxlength="50"
        rows="2"
        resize="none"
        show-word-limit
      ></el-input>
    </div>
    <div v-show="dialogType == 'reject'">
      <span class="notice-title" style="margin-top:20px">原因简述</span>
      <el-input ref="otherReasonInputCustomer" style="margin-top: 6px" type="textarea" placeholder="请输入" v-model="otherReason" maxlength="50" rows="2" resize="none" show-word-limit></el-input>
    </div>
    <div slot="footer" style="margin-top: 20px">
      <el-button type="danger" plain @click="cancelSubmit" size="small">取消</el-button>
      <el-button type="danger" @click="confirmSubmit" size="small">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    callback: {
      type: Function
    },
    workerOrderMslaFlag: {
      type: Number,
      default: 0
    },
    workOrderNumber: {
      type: String,
      default: ""
    },
    serviceId: {
      type: String,
      default: ""
    },
    promoteDialogVisible: Boolean,
    orderType: {
      type: String,
      default: "workerOrder"
    },
    serviceApplyNo: {
      type: String,
      default: ""
    },
  },

  data() {
    return {
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      dialogType: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).roleType == 2 ? "reject" : "revert",
      orderNameType: {
        workerOrder: "工单",
        applyOrder: "申请单"
      },
      nameMap: {
        revert: "请选择撤回原因（单选）",
        reject: "请填写退回原因"
      },
      activeValue: -1,
      otherReason: "",
      reasonList: [
        { text: "修改报告", value: 0 },
        { text: "修改工单", value: 1 },
        //  { text: "关闭工单", value: 2 },
        { text: "其他", value: 3 }
      ]
    };
  },
  created() {
    if (this.workerOrderMslaFlag == 1) {
      this.reasonList[0].text = "修改建议";
    }
  },
  methods: {
    selReasonItem(item) {
      this.activeValue = item.value;
    },
    cancelSubmit() {
      this.activeValue = -1;
      this.otherReason = "";
      this.$emit("promoteCloseDialog");
    },
    async revertRequest(params) {
      const res = await this.requestMethodPostTip("/workOrder/workOrderRevoke", params);
      return res;
    },
    async revertServiceApplyRequest(params) {
      const res = await this.requestMethodPostTip("/serviceApply/applyOrderRevoke", params);
      return res;
    },
    async confirmSubmit() {
      if (this.userInfo.userType == 2) this.activeValue = 3;
      if (this.activeValue == -1) {
        this.$message({
          type: "warning",
          message: "请选择原因"
        });
        return;
      }
      const params = {
        revertReason: ""
      };
      const reasonItem = this.reasonList.find(item => item.value == this.activeValue);
      if (reasonItem.value != 3) {
        params.revertReason = reasonItem.text;
      } else {
        if (!this.otherReason && this.userInfo.userType != 2) {
          this.$message({
            type: "warning",
            message: "请输入撤回原因"
          });
          this.$refs.otherReasonInput.focus();
          this.$refs.otherReasonInputCustomer.focus();
          return;
        }
        params.revertReason = this.otherReason;
      }

      if (this.orderType == "workerOrder") {
        params.workOrderNumber = this.workOrderNumber;
        const res = await this.revertRequest(params);
        if (res.data.code == 1000) {
          this.callback();
          this.$emit("promoteCloseDialog");
          if (this.$userInfo.userType == 2) {
            this.$gio.rejectWorkorder(this.workOrderNumber, "弹窗中点击确定");
          } else {
            this.$gio.recallWorkorder(this.workOrderNumber, "弹窗中点击确定");
          }
        }
      } else if (this.orderType == "applyOrder") {
        params.id = this.serviceId;
        const res = await this.revertServiceApplyRequest(params);
        if (res.data.code == 1000) {
          this.callback();
          this.$emit("promoteCloseDialog");
          // 变更:this.datailDate.serviceApplyNo -> this.serviceApplyNo, serviceApplyNo从传参中获得
          if (this.$userInfo.userType == 2) {
            this.$gio.rejectApplication({
              applicationNumber: this.serviceApplyNo,
              operation: "点击申请单详情页撤回工单按钮"
            });
          } else {
            this.$gio.recallApplication({
              applicationNumber: this.serviceApplyNo,
              operation: "点击申请单详情页撤回工单按钮"
            });
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.closeWorkOrder {
  .el-dialog__header {
    padding: 0px;
  }
}
.notice-title {
  font-family: MicrosoftYaHei;
  font-size: 14px;
  line-height: 14px;
  margin: 20px 0 10px;
  color: #666;
}
.radioGroup {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: #666;
  .reason-item {
    cursor: pointer;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    padding: 0px 16px;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    margin-right: 10px;
  }

  .reason-item:hover {
    color: #001450;
    border: 1px solid #001450;
  }
  .reason-item-active {
    color: #f9f9f9;
    background-color: #001450;
    border-color: #001450;
    -webkit-box-shadow: -1px 0 0 0 #001450;
    box-shadow: -1px 0 0 0 #001450;
  }
  .reason-item-active:hover {
    color: white;
  }
}
</style>
