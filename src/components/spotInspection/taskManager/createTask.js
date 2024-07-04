const rawBaseForm = {
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
import { SHAREDATA } from "./createCycleOptimize.js";
export default {
  data() {
    const checkActionTypeAndActionTargets = (rule, value, callback) => {
      if (!this.baseForm.actionType) {
        this.showPlaceholder = false;
        return callback(new Error("请选择执行方式"));
      }
      if (this.baseForm.actionType < 3) {
        if (!this.baseForm.actionTargets.length) {
          this.showPlaceholder = false;
          return callback(new Error("请选择执行方式"));
        }
      } else {
        if (!this.baseForm.actionTargets) {
          this.showPlaceholder = false;
          return callback(new Error("请选择执行方式"));
        }
      }
      this.showPlaceholder = true;
      callback();
    };
    const checkStartTimeAndEndTime = (rule, value, callback) => {
      if (!this.baseForm.planStartTime) {
        return callback(new Error("请选择开始日期"));
      } else if (!this.baseForm.planEndTime) {
        return callback(new Error("请选择结束日期"));
      } else {
        callback();
      }
    };
    const validatorDay = (rule, value, callback) => {
      if (this.baseForm.taskCycle == 1) {
        if (!this.baseForm.day || (this.baseForm.day && this.baseForm.day.toString().indexOf(".") > -1)) {
          return callback(new Error("请填写1～31间的整数（包括两端）"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validatorWeek = (rule, value, callback) => {
      if (this.baseForm.taskCycle == 2) {
        if (!this.baseForm.weekNum || (this.baseForm.weekNum && this.baseForm.weekNum.toString().indexOf(".") > -1)) {
          return callback(new Error("请填写1～5间的整数（包括两端）"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validatorMouth = (rule, value, callback) => {
      if (this.baseForm.taskCycle == 3) {
        if (!this.baseForm.mouthNum || (this.baseForm.mouthNum && this.baseForm.mouthNum.toString().indexOf(".") > -1)) {
          return callback(new Error("请填写1～12间的整数（包括两端）"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validatorYear = (rule, value, callback) => {
      if (this.baseForm.taskCycle == 4) {
        if (!this.baseForm.yearNum || (this.baseForm.yearNum && this.baseForm.yearNum.toString().indexOf(".") > -1)) {
          return callback(new Error("请填写1～5间的整数（包括两端）"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      implementTypeList: [
        // {
        //   label: "按岗位领取",
        //   value: 1
        // },
        {
          label: "指定领取人",
          value: 2
        },
        {
          label: "指定负责人",
          value: 3
        }
      ],
      taskWeekList: [
        {
          value: 0,
          label: "不重复"
        },
        {
          value: 1,
          label: "按日"
        },
        {
          value: 2,
          label: "按周"
        },
        {
          value: 3,
          label: "按月"
        },
        {
          value: 4,
          label: "按年"
        }
      ],
      weekList: [
        {
          label: "周日",
          value: "周日",
          active: false
        },
        {
          label: "周一",
          value: "周一",
          active: true
        },
        {
          label: "周二",
          value: "周二",
          active: false
        },
        {
          label: "周三",
          value: "周三",
          active: false
        },
        {
          label: "周四",
          value: "周四",
          active: false
        },
        {
          label: "周五",
          value: "周五",
          active: false
        },
        {
          label: "周六",
          value: "周六",
          active: false
        }
      ],
      taskList: [
        {
          name: "换油任务",
          code: "1",
          taskName: "changeOil"
        },
        {
          name: "加油任务",
          code: "2",
          taskName: "addOil"
        },
        {
          name: "加脂任务",
          code: "3",
          taskName: "addFat"
        },
        {
          name: "检查任务",
          code: "4",
          taskName: "check"
        },
        {
          name: "保养任务",
          code: "5",
          taskName: "general"
        },
        {
          name: "维修任务",
          code: "6",
          taskName: "repair"
        },
        {
          name: "其他任务",
          code: "7",
          taskName: "other"
        }
      ],
      baseForm: {
        customerCompanyNumber: "",
        taskType: "",
        planTitle: "",
        actionType: 2,
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
      },
      baseFormRules: {
        customerCompanyNumber: [{ required: true, message: "请选择所属客户", trigger: "change" }],
        planTitle: [{ required: true, message: "请输入任务主题", trigger: "blur" }],
        actionTypeAndActionTargets: [{ required: true, validator: checkActionTypeAndActionTargets, trigger: "change" }],
        startTimeAndEndTime: [{ required: true, validator: checkStartTimeAndEndTime, trigger: "change" }],
        dates: [{ required: true, message: "请选择日期", trigger: "change" }],
        week: [{ required: true, message: "请选择星期", trigger: "change" }],
        day: [{ required: true, validator: validatorDay, trigger: "blur" }],
        weekNum: [{ required: true, validator: validatorWeek, trigger: "blur" }],
        mouthNum: [{ required: true, validator: validatorMouth, trigger: "blur" }],
        yearNum: [{ required: true, validator: validatorYear, trigger: "blur" }]
      }
    };
  },
  created() {
    const y = new Date().getFullYear();
    let m = new Date().getMonth() + 1;
    if (m < 10) {
      m = "0" + m;
    }
    let d = new Date().getDate();
    if (d < 10) {
      d = "0" + d;
    }
    this.currentDate = y + "-" + m + "-" + d;
    // 时间点
    let arr = [];
    for (let i = 0; i < 24; i++) {
      let obj = {};
      obj.label = i + ":" + "00";
      obj.value = i + ":" + "00";
      arr.push(obj);
    }
    this.timeList = arr;
    // 日期
    let dayArr = [];
    for (let j = 1; j < 29; j++) {
      let obj = {};
      obj.value = j;
      obj.label = j;
      obj.active = false;
      dayArr.push(obj);
    }
    dayArr[0].active = true;
    this.dayList = dayArr;
  },
  methods: {
    showFixDevice() {
      this.chooseDeviceDialog = true;
    },
    taskCycleChange() {
      this.$refs.baseForm.validateField(["day", "weekNum", "mouthNum", "yearNum"]);
      this.$refs.cycleForm.validateField(["day", "weekNum", "mouthNum", "yearNum"]);
    },
    planStartTimeChange(val) {
      this.baseForm.planEndTime = "";
    },
    // 编辑回显
    handleEditRevertItem(taskDetail, planCycles) {
      planCycles.forEach(cycle => {
        const data = Object.assign({}, cycle);
        cycle.__cycleId = cycle.id;
        cycle.lubList = cycle.taskPlanTargetRelDtos.map(item => {
          if (item.lubricationPoint) return item.lubricationPoint;
          else if (item.device) return item.device;
        });
        const checkCycleItem = {};
        checkCycleItem.taskCycle = data.taskCycle;
        checkCycleItem.cycleGap = data.cycleGap;
        checkCycleItem.targetDays = data.targetDays;
        checkCycleItem.targetTimes = data.targetTimes;

        const curCycleStamp = Object.values(checkCycleItem)
          .filter(item => item != undefined && item != null && item.toString())
          .join("-");
        this.cycleStamp.set(curCycleStamp, curCycleStamp);
        SHAREDATA.selDeviceIdMapLub[cycle.__cycleId] = cycle.lubList;

        let deviceListParms = [];
        cycle.lubList.forEach((it, index) => {
          let obj = {};
          obj.sort = index;
          obj.targetId = it.id;
          obj.workshopId = it.workshopId;
          if (this.taskType == "check" && it.deviceCheck) {
            obj.deviceCheckIds = it.deviceCheck.map(item => item.id).join(",");
            obj.deviceCheck = it.deviceCheck;
          }
          deviceListParms.push(obj);
        });
        cycle.taskPlanTargetRels = deviceListParms;

        if (data.taskCycle == 0) {
          data.dates = data.targetDays;
        } else if (data.taskCycle == 1) {
          data.day = data.cycleGap;
        } else if (data.taskCycle == 2) {
          data.weekNum = data.cycleGap;
          const checkWeek = data.targetDays;
          const weekData = this.weekList;
          if (checkWeek && checkWeek.length) {
            weekData.forEach(item => {
              item.active = checkWeek.includes(item.value);
            });
          }
          data.week = data.targetDays;
          this.weekList = weekData;
        } else if (data.taskCycle == 3) {
          data.mouthNum = data.cycleGap;
          let arr = [];
          if (data.targetDays && data.targetDays.length) {
            data.targetDays.forEach(it => {
              arr.push(Number(it));
            });
          }
          const dayData = this.dayList;
          dayData.forEach(it => {
            it.active = arr.includes(it.value);
          });
          data.mouth = data.cycleGap;
          this.dayList = dayData;
        } else {
          data.yearNum = data.cycleGap;
          data.dates = this.handleEditDate(data.targetDays);
        }

        cycle.__revertBaseForm = _.cloneDeep(data);
      });
    },
    getEditDetail() {
      this.requestMethodGet("/device/check/taskManage/taskDetail", { planId: this.editId }).then(res => {
        if (res.data.code == 1000) {
          this.editLoadImplementFlag = true;
          const data = res.data.data;
          this.planCycles = res.data.data.planCycles;
          this.handleEditRevertItem(data, this.planCycles);
          data.taskType = data.taskType.toString();
          if (data.actionType == 3) {
            data.actionTargets = data.actionTargets[0];
          }
          // 是否生效
          data.planStatus = data.planStatus ? true : false;

          this.baseForm = Object.assign({}, rawBaseForm, data);
          this.baseForm.dates = [this.currentDate];

          this.implementChange();
          // 设备回显
          let deviceList = [];
          let checkItemList = [];
          let lupList = [];

          this.activeCycleId = this.planCycles[0].__cycleId;
          SHAREDATA.activeCycleId = this.planCycles[0].__cycleId;
          this.showResponeseLubList = this.planCycles[0].lubList || [];

          if (data.taskPlanTargetRelDtos && data.taskPlanTargetRelDtos.length) {
            data.taskPlanTargetRelDtos.forEach((it, index) => {
              if (this.taskType == "addOil" || this.taskType == "changeOil" || this.taskType == "addFat") {
                //润滑点
                deviceList.push(it.lubricationPoint);
              } else {
                //设备和设备检查项
                this.tempDevice = data.taskPlanTargetRelDtos[0].device;
                it.device.isEdit = true;
                // 设备下的检查项
                if (this.taskType == "check") {
                  if (!index) {
                    it.device.active = true;
                  } else {
                    it.device.active = false;
                  }
                  it.device.checkItemList = it.device.deviceCheck;
                  let arr = [];
                  if (it.device.deviceCheck && it.device.deviceCheck.length) {
                    it.device.deviceCheck.forEach(item => {
                      arr.push(item.id);
                      item.taskTypeName = item.deviceOptionNames;
                      item.lupName = item.lubricationPointNames ? item.lubricationPointNames : "无";
                    });
                  }
                  it.device.checkItemIdsList = arr;
                }
                deviceList.push(it.device);
                checkItemList = data.taskPlanTargetRelDtos[0].device.deviceCheck;
                if (checkItemList && checkItemList.length) {
                  checkItemList.forEach(it => {
                    this.$nextTick(() => {
                      this.$refs["deviceItemRef"].toggleRowSelection(it, true);
                    });
                  });
                }
              }
            });
          }
          if (this.taskType == "check") {
            this.tempDevice = data.planCycles[0].taskPlanTargetRelDtos[0].device;

            this.getDeviceCheckItem();
          }
          this.checkedDevice = deviceList;
          this.editDeviceList = _.cloneDeep(deviceList);
          this.deviceItemTable = checkItemList;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 根据设备ID获取设备下得检查项
    getDeviceCheckItem() {
      if (!this.tempDevice || !this.tempDevice.id) return;
      const params = {
        deviceId: this.tempDevice.id,
        optionIdsStr: this.checkItemFilter.join(",")
      };
      this.requestMethodGet("/device/check/checkItem/checkItemsOfDevice", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data;
          let checkItemList = [];
          if (list.length) {
            list.forEach(item => {
              let taskTypeNameList = [];
              let lupNameList = [];
              if (item.deviceOptionList && item.deviceOptionList.length) {
                item.deviceOptionList.forEach(it => {
                  taskTypeNameList.push(it.taskTypeName);
                });
              }
              if (item.lubricationList && item.lubricationList.length) {
                item.lubricationList.forEach(lup => {
                  lupNameList.push(lup.lubricationPointName);
                });
              }
              item.taskTypeName = taskTypeNameList.length ? taskTypeNameList.join(",") : "全部";
              item.lupName = item.lubricationPointNames ? item.lubricationPointNames : "无";
            });
          }
          this.$refs["deviceItemRef"] && this.$refs["deviceItemRef"].clearSelection();
          // 如果是编辑先清空选中然后重新选中
          let editDeviceIds = [];
          let itemIds = [];
          this.editDeviceList.forEach(it => {
            editDeviceIds.push(it.id);
          });
          if (editDeviceIds.includes(this.tempDevice.id)) {
            //编辑已有
            this.editDeviceList.forEach(item => {
              if (item.deviceCheck && item.deviceCheck.length) {
                item.deviceCheck.forEach(checkItem => {
                  itemIds.push(checkItem.id);
                  checkItem.taskTypeName = checkItem.deviceOptionNames;
                  checkItem.lupName = checkItem.lubricationPointNames ? checkItem.lubricationPointNames : "无";
                });
              }
            });
            // 找出编辑设备对应的检查项
            this.editDeviceList.forEach(it => {
              if (it.id == this.tempDevice.id) {
                checkItemList = it.deviceCheck;
              }
            });
            // 默认勾选
            let defaultCheck = [];
            this.editDeviceList.forEach(it => {
              if (it.id == this.tempDevice.id) {
                defaultCheck = it.deviceCheck;
              }
            });
            if (defaultCheck.length) {
              defaultCheck.forEach(row => {
                this.$nextTick(() => {
                  this.$refs["deviceItemRef"].toggleRowSelection(row, true);
                });
              });
            }
          } else {
            this.checkedDevice &&
              this.checkedDevice.forEach(item => {
                if (item.id == list[0].deviceId) {
                  item.checkItemList = list;
                }
              });
            checkItemList = list;
            const checkItemIdsList = this.tempDevice.checkItemIdsList;
            // 选中该设备下检查项
            this.$nextTick(() => {
              if (list.length && checkItemIdsList && checkItemIdsList.length) {
                for (let i = 0; i < list.length; i++) {
                  for (let j = 0; j < checkItemIdsList.length; j++) {
                    if (list[i].id == checkItemIdsList[j]) {
                      this.$refs["deviceItemRef"].toggleRowSelection(list[i], true);
                    }
                  }
                }
              }
            });
          }
          this.deviceItemTable = checkItemList;
          this.activeDviceCheck = checkItemList;
          const editItem = this.planCycles.find(item => item.__cycleId == this.activeCycleId);
          if (!editItem) return;
          const activeTarget = editItem.taskPlanTargetRels.find(item => item.targetId == this.tempDevice.id);

          if (!activeTarget) return;

          this.$nextTick(() => {
            this.$refs["deviceItemRef"].clearSelection();
            const activeCycle = this.planCycles.find(item => item.__cycleId == this.activeCycleId);
            const activeDevice = activeCycle.taskPlanTargetRels ? activeCycle.taskPlanTargetRels.find(item => item.targetId == this.tempDevice.id) : null;
            if (activeDevice && activeDevice.deviceCheck && activeDevice.deviceCheck.length) {
              const selIds = activeDevice.deviceCheck.map(item => item.id.toString());
              this.activeDviceCheck.forEach(it => {
                if (selIds.includes(it.id.toString())) {
                  this.$refs["deviceItemRef"].toggleRowSelection(it, true);
                }
              });
              return;
            }
            if (this.activeDviceCheck && this.activeDviceCheck.length && this.tempDevice.deviceCheck) {
              const selIds = this.tempDevice.deviceCheck.map(item => item.id.toString());
              this.activeDviceCheck.forEach(it => {
                if (selIds.includes(it.id.toString())) {
                  this.$refs["deviceItemRef"].toggleRowSelection(it, true);
                }
              });
            } else if (this.activeDviceCheck && this.activeDviceCheck.length && this.tempDevice.checkItemIds && !this.tempDevice.deviceCheck) {
              this.activeDviceCheck.forEach(it => {
                if (this.tempDevice.checkItemIds.includes(it.id.toString())) {
                  this.$refs["deviceItemRef"].toggleRowSelection(it, true);
                }
              });
            }

            if (this.$route.query.pageFlag && !this.tempDevice.checkItemIds && !this.tempDevice.deviceCheck) {
              activeDevice.checkItemIds = this.activeDviceCheck.map(item => item.id).join(",");
              this.activeDviceCheck.forEach(it => {
                this.$refs["deviceItemRef"].toggleRowSelection(it, true);
              });
            }
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 提交
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 提交接口入参
          let params = {};
          // 设备还是润滑点 1-设备，2-润滑点
          if (this.taskType == "check" || this.taskType == "general" || this.taskType == "repair" || this.taskType == "other") {
            params.targetType = 1;
          } else {
            params.targetType = 2;
          }
          params.companyId = this.userInfo.orgInfo.companyId;
          // 任务类型
          params.taskType = this.baseForm.taskType;
          // 任务主题
          params.planTitle = this.baseForm.planTitle;
          // 执行方式
          params.actionType = this.baseForm.actionType;
          // 执行方式的人或者岗位
          params.actionTargets = this.baseForm.actionType < 3 ? this.baseForm.actionTargets : [this.baseForm.actionTargets];
          // 有效时间
          params.planStartTime = this.baseForm.planStartTime;
          params.planEndTime = this.baseForm.planEndTime;
          // 是否生效
          params.planStatus = this.baseForm.planStatus;
          // 任务周期
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

          if (this.pageType == "abnormal") {
            params.taskSource = 3;
          }
          let url = "";
          params.planCycles = this.planCycles;
          ["cycleGap", "targetDays", "targetTimes", "taskCycle", "taskPlanTargetRels"].forEach(item => {
            params[item] = "";
          });
          let checkTargetRelsFlag = false;
          params.planCycles.forEach((cycle, index) => {
            if (!cycle.taskPlanTargetRels || !cycle.taskPlanTargetRels.length) {
              const taskType = this.taskType;
              const tipType = taskType == "check" || taskType == "general" || taskType == "repair" || taskType == "other" ? `设备` : `润滑点`;
              this.$message({
                type: "warning",
                message: `任务计划${index + 1}未选择${tipType}`
              });
              checkTargetRelsFlag = true;
              return;
            }
            cycle.taskPlanTargetRels.forEach(item => {
              if (item.deviceCheck && Array.isArray(item.deviceCheck)) {
                item.deviceCheck = item.deviceCheck.map(item => item.id).join(",");
                item.deviceCheckIds = item.deviceCheck;
              } else if (cycle.lubList && Array.isArray(cycle.lubList)) {
                const targetDevice = cycle.lubList.find(it => it.id == item.targetId);
                if (targetDevice) {
                  item.deviceCheck = targetDevice.checkItemIds;
                  item.deviceCheckIds = targetDevice.checkItemIds;
                }
              }

              if (item.checkItemIds && !item.deviceCheck) {
                item.deviceCheck = item.checkItemIds;
              }
            });
          });

          if (checkTargetRelsFlag) return;

          if (!this.editId) {
            //创建
            url = "/device/check/taskManage/createTask";
            this.createSubmit(url, params);
            this.$gio.sumbitTaskInfo({
              operation: "点击底部确定按钮"
            });
          } else {
            //编辑
            if (this.baseForm.planNo) params.planNo = this.baseForm.planNo;
            if (this.isCopy) {
              url = "/device/check/taskManage/createTask";
              this.createSubmit(url, params);
              this.$gio.sumbitTaskInfo({
                operation: "点击确定按钮"
              });
            } else {
              // 如果是编辑的话需要传入planId
              this.$gio.editTaskInfo({
                operation: "点击编辑页提交按钮"
              });
              params.id = this.editId;
              url = "/device/check/taskManage/updateTask";
              this.createSubmit(url, params);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 上移
    up(item, idx) {
      const data = this.checkedDevice;
      if (idx != 0) {
        data[idx] = data.splice(idx - 1, 1, data[idx])[0];
      }
      this.checkedDevice = data;
    },
    // 下移
    down(item, idx) {
      const data = this.checkedDevice;
      if (idx != this.checkedDevice.length - 1) {
        data[idx] = data.splice(idx + 1, 1, data[idx])[0];
      }
      this.checkedDevice = data;
    },
    // 置顶
    topping(item, idx) {
      const data = this.checkedDevice;
      if (idx != 0) {
        data.unshift(data.splice(idx, 1)[0]);
      }
      this.checkedDevice = data;
    },
    // 移除
    removeItem(item) {
      let arr = [];
      arr = this.handleRemove(this.showResponeseLubList, item);
      this.syncItemLubList();
      this.editDeviceList = this.handleRemove(this.editDeviceList, item);
      let isCheckFlag = false;
      if (arr.length) {
        arr.forEach(it => {
          if (it.active) {
            isCheckFlag = true;
          }
        });
      }

      if (!isCheckFlag && arr.length) {
        arr[0].active = true;
        this.tempDevice = arr[0];
      }
      this.checkedDevice = arr;
      this.getDeviceCheckItem();
    },
    handleRemove(list, item) {
      list.forEach((it, idx) => {
        if (it.id == item.id) {
          list.splice(idx, 1);
        }
      });
      return list;
    },
    // 表格上移
    tableUp(row, index) {
      if (index > 0) {
        let upData = this.showResponeseLubList[index - 1];
        this.showResponeseLubList.splice(index - 1, 1);
        this.showResponeseLubList.splice(index, 0, upData);
      } else {
        this.$message({
          message: "已经是第一条，上移失败",
          type: "warning"
        });
      }
      this.syncItemLubList();
    },
    // 表格下移
    tableDown(row, index) {
      if (index + 1 == this.showResponeseLubList.length) {
        this.$message({
          message: "已经是最后一条，下移失败",
          type: "warning"
        });
      } else {
        let downData = this.showResponeseLubList[index + 1];
        this.showResponeseLubList.splice(index + 1, 1);
        this.showResponeseLubList.splice(index, 0, downData);
      }
      this.syncItemLubList();
    },
    // 表格置顶
    tableTopping(row, index) {
      this.showResponeseLubList.splice(index, 1);
      this.showResponeseLubList.unshift(row);
      this.syncItemLubList();
    },
    // 表格删除
    tableRemoveItem(row, index) {
      this.showResponeseLubList.forEach((it, index) => {
        if (it.id == row.id) {
          this.showResponeseLubList.splice(index, 1);
        }
      });
      this.syncItemLubList();
    }
  }
};
