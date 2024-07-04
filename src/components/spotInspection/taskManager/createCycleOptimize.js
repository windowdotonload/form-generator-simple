import cloneDeep from "lodash/cloneDeep";
const typeMap = {
  1: "changeOil",
  2: "addOil",
  3: "addFat",
  4: "check",
  5: "general",
  6: "repair",
  changeOil: "1",
  addOil: "2",
  addFat: "3",
  check: "4",
  general: "5",
  repair: "6"
};
const cycleTypeMap = {
  0: "不重复",
  1: "日",
  2: "周",
  3: "月",
  4: "年"
};
let rawBaseForm = {
  customerCompanyNumber: "",
  taskType: "",
  planTitle: "",
  actionType: 1,
  actionTargets: [],
  planStartTime: "",
  planEndTime: "",
  planStatus: true,
  taskCycle: 0,
  dates: [],
  day: 1,
  weekNum: 1,
  mouthNum: 1,
  yearNum: 1,
  week: ["周一"],
  mouth: ["1"],
  targetTimes: []
};
export let SHAREDATA = {
  activeCycleId: "",
  selDeviceIdMapLub: {}
};
export default {
  data() {
    return {
      activeCycleId: "",
      createCycleDialog: false,
      planCycles: [],
      showResponeseLubList: [],
      cycleStamp: new Map(),
      activeDviceCheck: [],
      startTimePickerOptions: {
        disabledDate(time) {
          const currentDate = new Date();
          const oneYearLater = new Date();
          const oneYearAgo = new Date();

          oneYearLater.setFullYear(currentDate.getFullYear() + 1);
          oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
          const TIME = new Date(time).getTime();
          return TIME > oneYearLater || TIME < oneYearAgo;
        }
      }
    };
  },
  beforeDestroy() {
    SHAREDATA = {
      activeCycleId: "",
      selDeviceIdMapLub: {}
    };
  },
  filters: {
    handleCycleListInfo(val, returnType) {
      if (returnType == "date") {
        if (val.taskCycle == 0) {
          return val.targetDays.join("，");
        } else if (val.taskCycle == 1) {
          return `每 ${val.cycleGap} 日`;
        }
        return `每 ${val.cycleGap} ${cycleTypeMap[val.taskCycle]}  ${val.targetDays.join("，")}`;
      } else if (returnType == "time") {
        if (!val.targetTimes || val.targetTimes.length == 0) return "全天";
        return val.targetTimes.join("，");
      }
    }
  },
  methods: {
    createCycle() {
      rawBaseForm = cloneDeep(this.baseForm);
      this.createCycleDialog = true;
    },
    resetBaseFormForCycle() {
      ["taskCycle", "yearNum", "dates", "day", "weekNum", "week", "mouthNum", "targetTimes"].forEach(item => {
        this.baseForm[item] = rawBaseForm[item];
      });
    },
    confirmCreateCycle() {
      let validateArr;
      if (this.baseForm.taskCycle == 1) {
        validateArr = ["dates", "day"];
      } else if (this.baseForm.taskCycle == 2) {
        validateArr = ["dates", "weekNum", "week"];
      } else if (this.baseForm.taskCycle == 3) {
        validateArr = ["dates", "mouthNum"];
      } else if (this.baseForm.taskCycle == 3) {
        validateArr = ["dates", "yearNum"];
      }
      let validateFlag = true;
      this.$refs.cycleForm.validateField(["dates"], err => {
        if (!err) {
          validateFlag = true;
        } else {
          this.$message({
            type: "warning",
            message: err
          });
          validateFlag = false;
        }
      });
      if (!validateFlag) return;

      const params = {};
      params.taskCycle = this.baseForm.taskCycle;
      if (this.baseForm.taskCycle == 0) {
        //不重复
        // 需要把日期去掉年份后组成月-日数组传入
        params.targetDays = this.baseForm.dates;
      } else if (this.baseForm.taskCycle == 1) {
        //按日
        params.cycleGap = this.baseForm.day;
      } else if (this.baseForm.taskCycle == 2) {
        //按周
        params.cycleGap = this.baseForm.weekNum;
        // 找出周选中的值list传入
        let list = [];
        this.weekList.forEach(item => {
          if (item.active) {
            list.push(item.value);
          }
        });
        params.targetDays = list;
      } else if (this.baseForm.taskCycle == 3) {
        //按月
        params.cycleGap = this.baseForm.mouthNum;
        // 找出月选中的值list传入
        let list = [];
        this.dayList.forEach(it => {
          if (it.active) {
            list.push(it.value);
          }
        });
        params.targetDays = list;
      } else {
        //按年
        params.cycleGap = this.baseForm.yearNum;
        params.targetDays = this.handleDate(this.baseForm.dates);
      }
      // 时间点
      params.targetTimes = this.baseForm.targetTimes;
      const planItem = cloneDeep(params);
      const curCycleStamp = Object.values(planItem)
        .filter(item => item != undefined && item != null && item.toString())
        .join("-");

      if (this.editItemId && this.currentEditItem) {
        if (curCycleStamp != this.currentEditItem.cycleStamp && this.cycleStamp.has(curCycleStamp)) {
          return this.$message({
            type: "error",
            message: "存在相同的周期频率，请修改后重试"
          });
        }
      }
      if (this.cycleStamp.has(curCycleStamp) && !this.editItemId)
        return this.$message({
          type: "error",
          message: "存在相同的周期频率，请修改后重试"
        });
      this.cycleStamp.set(curCycleStamp, curCycleStamp);

      planItem.__revertBaseForm = cloneDeep(this.baseForm);
      if (this.$route.query.pageFlag && this.$route.query.pageFlag == "createAbnormal") {
        this.showResponeseLubList = cloneDeep(this.abnormalDeviceListCarryForm);
        this.checkedDevice = cloneDeep(this.abnormalDeviceListCarryForm);
        this.tempDevice = this.checkedDevice[0];
        planItem.lubList = cloneDeep(this.abnormalDeviceListCarryForm);
        let deviceListParms = [];
        this.showResponeseLubList.forEach((it, index) => {
          let obj = {};
          obj.sort = index;
          obj.targetId = it.id;
          obj.workshopId = it.workshopId;
          if (it.deviceCheck) obj.deviceCheck = it.deviceCheck;
          deviceListParms.push(obj);
        });
        planItem.taskPlanTargetRels = deviceListParms;
      }
      if (this.editItemId) {
        this.cycleStamp.delete(this.currentEditItem.cycleStamp);
        planItem.cycleStamp = curCycleStamp;
        const index = this.planCycles.findIndex(item => item.__cycleId == this.editItemId);
        const rawItem = this.planCycles[index];
        this.planCycles.splice(index, 1, Object.assign({}, rawItem, planItem));
      } else {
        planItem.cycleStamp = curCycleStamp;
        planItem.__cycleId = new Date().getTime();
        this.planCycles.push(planItem);
      }
      if (!this.activeCycleId) {
        this.activeCycleId = this.planCycles[0].__cycleId;
      }

      if (this.$route.query.pageFlag && this.$route.query.pageFlag == "createAbnormal" && this.taskType == "check") {
        this.getDeviceCheckItem();
      }
      this.resetBaseFormForCycle();
      this.editItemId = "";
      this.createCycleDialog = false;
    },
    cancelCreateSelCycle() {
      this.resetBaseFormForCycle();
      this.editItemId = "";
      this.currentEditItem = null;
      this.createCycleDialog = false;
    },

    checkCyclye(item) {
      if (this.activeCycleId == item.__cycleId) return;
      this.tempDevice = null;
      this.activeDviceCheck = [];
      this.activeCycleId = item.__cycleId;
      SHAREDATA.activeCycleId = item.__cycleId;
      this.showResponeseLubList = item.lubList || [];
      if (this.$route.query.taskType == "check" || this.$route.query.taskType == 4) {
        this.tempDevice = this.showResponeseLubList[0];
        this.getDeviceCheckItem();
      }
    },

    editCycleItem(editItem) {
      rawBaseForm = cloneDeep(this.baseForm);
      this.currentEditItem = editItem;
      this.editItemId = editItem.__cycleId;
      this.createCycleDialog = true;
      ["taskCycle", "yearNum", "dates", "day", "weekNum", "week", "mouthNum", "targetTimes"].forEach(item => {
        if (item == "taskCycle" || item == "targetTimes" || item == "dates") {
          this.baseForm[item] = editItem.__revertBaseForm[item];
        } else {
          this.baseForm[item] = editItem.__revertBaseForm[item] || 1;
        }
      });
    },

    deleteCycleItem(item) {
      this.$confirm("删除周期频率会一并清空该分组下的所有设备，是否继续操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const checkCycleItem = {};
          checkCycleItem.taskCycle = item.taskCycle;
          checkCycleItem.cycleGap = item.cycleGap;
          checkCycleItem.targetDays = item.targetDays;
          checkCycleItem.targetTimes = item.targetTimes;

          const curCycleStamp = Object.values(checkCycleItem)
            .filter(v => v != undefined && v != null && v.toString())
            .join("-");
          if (this.cycleStamp.has(curCycleStamp)) this.cycleStamp.delete(curCycleStamp);
          delete SHAREDATA.selDeviceIdMapLub[item.__cycleId];
          this.activeCycleId = null;
          SHAREDATA.activeCycleId = "";
          this.showResponeseLubList = [];

          const index = this.planCycles.findIndex(it => it.__cycleId == item.__cycleId);
          if (index > -1) {
            this.planCycles.splice(index, 1);
          }
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    lubListSelectableFilter(row, index) {
      if (Object.keys(SHAREDATA.selDeviceIdMapLub).length == 0) return true;
      const excludeLub = Object.keys(SHAREDATA.selDeviceIdMapLub).reduce((accumulator, currentValue) => {
        if (currentValue == SHAREDATA.activeCycleId) return;
        return accumulator.concat(SHAREDATA.selDeviceIdMapLub[currentValue]);
      }, []);
      const excludeLubIds = excludeLub ? excludeLub.map(item => item.id) : [];
      if (excludeLubIds.includes(row.id)) return false;

      return true;
    },
    reverseLubTableDataChecked(sourceData, vm) {
      if (!vm) vm = this;
      // const reverseTarget = SHAREDATA.selDeviceIdMapLub[SHAREDATA.activeCycleId] ? SHAREDATA.selDeviceIdMapLub[SHAREDATA.activeCycleId].map(item => item.id) : [];
      const reverseTarget = this.$parent.showResponeseLubList && this.$parent.showResponeseLubList.map(item => item.lubricationPointId);

      this.$nextTick(() => {
        Promise.resolve("_").then(() => {
          sourceData.forEach(item => {
            if (reverseTarget.includes(item.lubricationPointId)) {
              vm.$refs.lubricationPointRef.toggleRowSelection(item, true);
            }
          });
        });
      });
    },

    setCycleLubPoint(deviceList, activeId, type) {
      console.log("deviceList activeId", deviceList, activeId);
      const deviceListMap = {};
      deviceList.forEach(item => {
        deviceListMap[item.id] = item;
      });
      const item = this.planCycles.find(it => it.__cycleId == activeId);
      if (!item) return;
      item.lubList = SHAREDATA.selDeviceIdMapLub[activeId] || [];
      item.lubList.push(...deviceList);
      item.lubList = cloneDeep([
        ...Object.values(
          item.lubList.reduce((accumulator, current) => {
            if (!accumulator[current.id]) {
              if (deviceListMap[current.id]) current.deviceCheck = deviceListMap[current.id].deviceCheck;
              accumulator[current.id] = current;
            }
            return accumulator;
          }, {})
        )
      ]);
      const data = item.lubList;
      SHAREDATA.selDeviceIdMapLub[activeId] = [...cloneDeep(item.lubList)];

      // this.showResponeseLubList = item.lubList;
      this.showResponeseLubList = deviceList;
      let deviceListParms = [];
      this.showResponeseLubList.forEach((it, index) => {
        let obj = {};
        obj.sort = index;
        obj.targetId = type == "device" ? it.deviceId : it.lubricationPointId;
        if (it.deviceCheck) obj.deviceCheck = it.deviceCheck;
        deviceListParms.push(obj);
      });
      item.taskPlanTargetRels = deviceListParms;

      this.checkedDevice = [];
      this.$refs.lupDiaolg.$refs.lubricationPointRef && this.$refs.lupDiaolg.$refs.lubricationPointRef.clearSelection();
      this.$refs.deviceDiaolg.$refs.deviceTableRef && this.$refs.deviceDiaolg.$refs.deviceTableRef.clearSelection();
    },

    syncItemLubList() {
      const item = this.planCycles.find(item => item.__cycleId == this.activeCycleId);
      item.lubList = [...cloneDeep(this.showResponeseLubList)];
      const data = item.lubList;
      let deviceListParms = [];
      data.forEach((it, index) => {
        let obj = {};
        obj.sort = index;
        obj.targetId = it.id;
        obj.workshopId = it.workshopId;
        deviceListParms.push(obj);
      });
      item.taskPlanTargetRels = deviceListParms;
      SHAREDATA.selDeviceIdMapLub[this.activeCycleId] = [...cloneDeep(this.showResponeseLubList)];
    }
  }
};
