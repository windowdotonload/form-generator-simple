<template>
  <div class="con">
    <el-dialog class="conExportType" :visible.sync="dialogVisible" title="批量导出设备" width="480px" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelExportType">
      <div class="listCon">
        <div class="listTip">请选择模板:</div>
        <div class="listItem" :class="[item.id == exportTypeId ? 'listItemActive' : 'listItemCom']" v-for="item in list" :key="item.id" @click="chooseExportType(item.id)">
          <div class="listItemTit">{{ item.tit }}</div>
          <div class="listItemText">{{ item.text }}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelExportType">取消</el-button>
        <el-button size="small" type="danger" @click="submitExportType">下一步</el-button>
      </span>
    </el-dialog>
    <el-dialog class="conExportItem" :visible.sync="exportDialogVisible" title="批量导出设备" top="100px" width="640px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="exportCon">
        <div class="exportListCon" v-for="(item, index) in exportTypeList" :key="index">
          <div class="exportFlex">
            <div class="exportType">{{ item.exportTypeName }}</div>
            <div class="exportCheck">
              <el-checkbox v-model="item.checkAll" @change="handleCheckAllChange($event, index)">全选</el-checkbox>
            </div>
          </div>
          <div class="exportTip">注：{{ item.exportTypeTip }}</div>
          <div class="exportList">
            <div :class="[itemSmall.tip ? 'exportListItemWidth' : 'exportListItem']" v-for="(itemSmall, indexSmall) in item.list" :key="indexSmall">
              <div class="exportItemFlex">
                <el-checkbox :disabled="disabledObj[itemSmall.key]" @change="checkLengthChange($event, index)" v-model="itemSmall.check"></el-checkbox>
                <div class="exportListItemTit">{{ itemSmall.name }}</div>
              </div>
              <div class="exportListItemTip" v-show="itemSmall.tip">{{ itemSmall.tip }}</div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="exportDialogVisible = false">取消</el-button>
        <el-button size="small" type="danger" @click="submitExportInfo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "batchExport",
  props: {
    showBatchExport: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      dialogVisible: false,
      exportDialogVisible: false,
      list: [
        {
          id: 1,
          tit: "仅设备信息",
          text: "仅包含设备相关信息，不包含润滑点信息"
        },
        {
          id: 2,
          tit: "设备+润滑点信息",
          text: "包含设备信息和润滑点完整信息"
        }
      ],
      exportTypeId: null,
      deviceList: [
        {
          exportTypeName: "设备相关",
          exportTypeTip: "设备信息中必定包含：设备ID、设备名称",
          checkAll: true,
          list: [
            {
              check: true,
              name: "是否是新项目设备初装生意",
              key: "newBusinessFlag",
              tip: ""
            },
            {
              check: true,
              name: "所属工业客户",
              key: "companyName",
              tip: ""
            },
            {
              check: true,
              name: "客户ID",
              key: "companyId",
              tip: ""
            },
            {
              check: true,
              name: "客户所属经销商",
              key: "distributorCompanyName",
              tip: ""
            },
            {
              check: true,
              name: "设备ID",
              key: "deviceNumber",
              tip: ""
            },
            
            {
              check: true,
              name: "设备名称",
              key: "deviceName",
              tip: ""
            },
            
            
            
            
            {
              check: true,
              name: "设备类型",
              key: "deviceTypeName",
              tip: ""
            },
            {
              check: true,
              name: "所属车间",
              key: "workshopName",
              tip: ""
            },
            {
              check: true,
              name: "制造商名称",
              key: "manufacturer",
              tip: ""
            },
            {
              check: true,
              name: "型号",
              key: "deviceModel",
              tip: ""
            },
            {
              check: true,
              name: "编码",
              key: "deviceCode",
              tip: ""
            },
            {
              check: true,
              name: "位置",
              key: "devicePosition",
              tip: ""
            },
            {
              check: true,
              name: "信息状态",
              key: "dataIntegrityFlagDesc",
              tip: ""
            },
            {
              check: true,
              name: "活跃状态",
              key: "deviceActiveStatusStr",
              tip: ""
            },
            {
              check: true,
              name: "创建人",
              key: "createUserName",
              tip: ""
            },
            {
              check: true,
              name: "创建账号",
              key: "createUser",
              tip: ""
            },
            {
              check: true,
              name: "创建日期",
              key: "createTimeStr",
              tip: ""
            },
            {
              check: true,
              name: "创建类型",
              key: "createMethod",
              tip: ""
            },
            {
              check: true,
              name: "客户可见性",
              key: "customerVisibility",
              tip: ""
            }
          ]
        }
      ],
      deviceSuperList: [
        {
          exportTypeName: "设备相关",
          exportTypeTip: "设备信息中必定包含：设备ID、设备名称",
          checkAll: true,
          list: [
            {
              check: true,
              name: "设备ID",
              key: "deviceNumber",
              tip: ""
            },
            {
              check: true,
              name: "设备名称",
              key: "deviceName",
              tip: ""
            },
            {
              check: true,
              name: "设备类型",
              key: "deviceTypeName",
              tip: ""
            },
            {
              check: true,
              name: "所属车间",
              key: "workshopName",
              tip: ""
            },
            {
              check: true,
              name: "制造商名称",
              key: "manufacturer",
              tip: ""
            },
            {
              check: true,
              name: "型号",
              key: "deviceModel",
              tip: ""
            },
            {
              check: true,
              name: "编码",
              key: "deviceCode",
              tip: ""
            },
            {
              check: true,
              name: "位置",
              key: "devicePosition",
              tip: ""
            },
            {
              check: true,
              name: "创建人",
              key: "createUserName",
              tip: ""
            },
            {
              check: true,
              name: "创建账号",
              key: "createUser",
              tip: ""
            },
            {
              check: true,
              name: "创建日期",
              key: "createTimeStr",
              tip: ""
            }
            // {
            //   check: true,
            //   name: '创建类型',
            //   key: 'createMethod',
            //   tip: ''
            // },
            // {
            //   check: true,
            //   name: '客户可见性',
            //   key: 'customerVisibility',
            //   tip: ''
            // }
          ]
        }
      ],
      lubricationPointList: [
        {
          exportTypeName: "润滑点相关",
          exportTypeTip: "润滑点信息中必定包含：润滑点ID、润滑点设备类型、润滑点设备名称",
          checkAll: true,
          list: [
            {
              check: true,
              name: "润滑点ID",
              key: "lubricationPointNumber",
              tip: ""
            },
            {
              check: true,
              name: "润滑点设备类型",
              key: "lubricationPointType",
              tip: ""
            },
            {
              check: true,
              name: "设备运行信息",
              key:
                "inputPowerClosedGear,gearboxModelClosedGear,deviceOperationDate,gearboxOperatingStatus,gearboxStage,inputSpeed,speedRatio,engineModel,emissionStandard,fuelType,engineDisplacement,intakeMethod,oilFilterBrandAndModel,oilFilterChangeCycle,oilFilterChangeCycleUnit,ratedSpeed,maxOutputPower,numberOfCylinders,operatingEnvironment,bearingBrand,bearingType,bearingModel,bearingSpeed,bearingInnerDiameter,bearingOuterDiameter,bearingWidth,bearingInstallationDirection,numberOfBearings,inputPowerOpenGear,gearboxModelOpenGear,speedRatioOpenGear,inputSpeedOpenGear,ratedPressure,ratedFlowRate,compressionStages",
              tip: ""
            },
            {
              check: true,
              name: "创建人",
              key: "luCreateUserName",
              tip: ""
            },
            {
              check: true,
              name: "创建人账号",
              key: "luCreateUser",
              tip: ""
            },
            {
              check: true,
              name: "创建日期",
              key: "luCreateTime",
              tip: ""
            },
            {
              check: true,
              name: "创建方式",
              key: "copyStr",
              tip: ""
            },
            {
              check: true,
              name: "油箱容量",
              key: "oilBoxCapacityStr",
              tip: ""
            },
            {
              check: true,
              name: "在用油品品牌",
              key: "oilBrandName",
              tip: ""
            },
            {
              check: true,
              name: "在用油品名称",
              key: "currentOilName",
              tip: ""
            },
            {
              check: true,
              name: "润滑点设备名称",
              key: "lubricationPointName",
              tip: ""
            },
            {
              check: true,
              name: "润滑点设备制造商名称",
              key: "lubricationPointManufacturer",
              tip: ""
            },
            {
              check: true,
              name: "描述",
              key: "lubricationPointDesc",
              tip: ""
            },
            {
              check: true,
              name: "设备制造商推荐油品",
              key: "recommendOil",
              tip: ""
            },
            
            
            {
              check: true,
              name: "润滑方式",
              key: "lubricationMethod",
              tip: ""
            },
            {
              check: true,
              name: "用油信息",
              key:
                "oilChangeMethodStr,oilChangePeriodStr,lastOilChangeDate,autoCreateOilChangePlan,nextScheduledOilChangeDate,fillingQuantityStr,oilAddPeriodStr,everyTimeOilAddQuantityStr,lastOilAddDate,autoCreateOilAddPlan,nextScheduledOilAddTime,oilAddPeriodStr,everyTimeOilAddQuantityStr,lastOilAddDate,autoCreateOilAddPlan,nextScheduledOilAddTime,preMonthOilAddQuantityStr",
              tip: "定期/按质、周期、下次计划、用量等"
            },
            
          ]
        }
      ],
      disabledObj: {
        deviceNumber: "设备ID",
        newBusinessFlag: "是否新项目设备初装生意",
        deviceName: "设备名称",
        lubricationPointNumber: "润滑点ID",
        lubricationPointType: "润滑点设备类型",
        lubricationPointName: "润滑点设备名称"
      },
      exportTypeList: []
    };
  },
  watch: {
    showBatchExport: {
      handler: function(val, oldVal) {
        this.dialogVisible = val;
        this.exportTypeId = null;
      },
      immediate: true
    }
  },
  created() {
    this.exportTypeList = [];
  },
  methods: {
    chooseExportType(id) {
      this.exportTypeId = id;
      if (id == 1) {
        if (this.$userInfo.userType == 2) {
          this.exportTypeList = this.deviceSuperList;
        } else {
          this.exportTypeList = this.deviceList;
        }
      } else {
        if (this.$userInfo.userType == 2) {
          this.exportTypeList = this.deviceSuperList.concat(this.lubricationPointList);
        } else {
          this.exportTypeList = this.deviceList.concat(this.lubricationPointList);
        }
      }
    },
    submitExportType() {
      if (this.exportTypeId) {
        this.$emit("closeBatchExport");
        this.exportDialogVisible = true;
      } else {
        this.$message({
          message: "请先选择模板",
          type: "warning"
        });
      }
    },
    cancelExportType() {
      this.$emit("closeBatchExport");
    },
    handleCheckAllChange(val, index) {
      if (val) {
        this.exportTypeList[index].list.forEach(item => (item.check = true));
      } else {
        this.exportTypeList[index].list.forEach(item => {
          if (!this.disabledObj[item.key]) {
            item.check = false;
          }
        });
      }
    },
    checkLengthChange(val, index) {
      let checkedArr = this.exportTypeList[index].list.filter(item => item.check);
      let checkeLength = checkedArr.length;
      this.exportTypeList[index].checkAll = checkeLength == this.exportTypeList[index].list.length || false;
    },
    submitExportInfo() {
      this.exportDialogVisible = false;
      let itemList = [];
      if (this.exportTypeList[0] && this.exportTypeList[1]) {
        // 选择设备+润滑点信息
        itemList = this.exportTypeList[0].list.concat(this.exportTypeList[1].list);
      } else if (this.exportTypeList[0] && !this.exportTypeList[1]) {
        // 选择仅导出设备
        itemList = this.exportTypeList[0].list;
      }
      let deviceExportFieldCheckArr = itemList.filter(item => item.check);
      let deviceExportFieldArr = deviceExportFieldCheckArr.map(item => item.key);
      let deviceExportFieldStr = deviceExportFieldArr.join(",");
      this.$emit("getExportInfo", deviceExportFieldStr);
    }
  }
};
</script>
<style scoped lang="less">
.iconCon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .iconPic {
    width: 16px;
    display: block;
  }
}
.listCon {
  width: 440px;
  margin: 20px auto auto auto;
  .listTip {
    width: 100%;
    font-size: 14px;
    line-height: 14px;
    color: #dd0000;
    margin-bottom: 6px;
  }
  .listItemActive {
    background-color: rgba(204, 221, 255, 0.2);
    border: 1px solid rgba(204, 211, 255, 0.4);
  }
  .listItemCom {
    background-color: #fff;
    border: 1px solid #e9e9e9;
  }
  .listItem:hover {
    border: 1px solid #ccddff;
    cursor: pointer;
  }
  .listItem {
    width: 100%;
    margin: 20px 0;
    padding: 16px 0;
    border-radius: 4px;
    .listItemTit {
      width: calc(100% - 40px);
      margin: 0 auto;
      color: #000;
      font-size: 14px;
      font-weight: bold;
      line-height: 14px;
    }
    .listItemText {
      width: calc(100% - 40px);
      margin: 0 auto;
      color: #999;
      font-size: 14px;
      line-height: 14px;
      margin-top: 16px;
    }
  }
}
.exportCon {
  width: 100%;
  .exportListCon {
    width: 100%;
    position: relative;
    margin: 20px 0;
    .exportFlex {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .exportType {
        width: calc(100% - 60px);
        font-size: 14px;
        line-height: 14px;
        font-weight: bold;
        color: #000;
      }
    }
    .exportTip {
      width: 100%;
      color: #ff9900;
      font-size: 12px;
      line-height: 12px;
      margin-top: 12px;
    }
    .exportList {
      width: 100%;
      padding: 10px 0;
      margin-top: 16px;
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
      border-radius: 4px;
      display: flex;
      flex-wrap: wrap;
      .exportListItemWidth {
        width: 600px;
        margin: 10px 20px;
      }
      .exportListItem {
        width: 168px;
        margin: 10px 10px 10px 18px;
      }
      .exportItemFlex {
        display: flex;
        align-items: center;
      }
      .exportListItemTit {
        width: calc(100% - 24px);
        font-size: 14px;
        line-height: 14px;
        margin-left: 10px;
        color: #000;
        white-space: nowrap;
      }
      .exportListItemTip {
        width: calc(100% - 24px);
        margin-left: 24px;
        color: #999;
        margin-top: 8px;
        font-size: 12px;
        line-height: 12px;
      }
    }
  }
}
/deep/ .conExportItem .el-dialog {
  height: calc(100% - 200px);
}
/deep/ .conExportItem .el-dialog__body {
  padding: 0 20px 30px 20px;
  height: calc(100% - 176px);
  overflow: scroll;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__label {
  color: #000;
}
/deep/ .el-checkbox {
  color: #000;
}
</style>
