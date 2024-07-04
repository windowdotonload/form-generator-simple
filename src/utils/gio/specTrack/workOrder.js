const gio = window.gio;
const Track = (eventId, eventLevelVariables) => {
  gio("track", eventId, eventLevelVariables);
};
export default {
  deleteLubrPointTrack(vm) {
    Track("deleteLubrPoint", {
      operation: "点击移除按钮",
      workorderNumber: vm.woInfo.workOrderNumber
    });
  },
  addLubrPointTrack(vm, operation) {
    Track("addLubrPoint", {
      operation: operation,
      workorderNumber: vm && vm.woInfo.workOrderNumber
    });
  },
  createResearchTask(workorderNumber) {
    Track("createResearchTask", {
      workorderNumber: workorderNumber
    });
  },
  deleteResearchTask(workorderNumber) {
    Track("deleteResearchTask", {
      operation: "工单详情页点击删除按钮",
      workorderNumber: workorderNumber
    });
  },
  assignWorkorder(workorderNumber) {
    Track("assignWorkorder", {
      workorderNumber: workorderNumber
    });
  },
  closeWorkorder(workorderNumber) {
    Track("closeWorkorder", {
      operation: "工单详情页点击取消注册/关闭工单按钮",
      workorderNumber: workorderNumber
    });
  },
  completeWorkorder(workorderNumber, operation = "工单详情页点击完成工单按钮") {
    Track("completeWorkorder", { operation: operation, workorderNumber: workorderNumber });
  },
  recallWorkorder(workorderNumber, operation = "工单详情页点击撤回工单") {
    Track("recallWorkorder", { operation: operation, workorderNumber: workorderNumber });
  },
  rejectWorkorder(workorderNumber, operation = "工单详情页点击退回工单") {
    Track("rejectWorkorder", { operation: operation, workorderNumber: workorderNumber });
  }
};
