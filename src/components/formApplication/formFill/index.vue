<script>
import cloneDeep from "lodash/cloneDeep";
import { getFormListConfig, fieldRevertMap, backEndFullField, fieldConfigMap, saveFormRecord, getRecordDetail } from "../api/index.js";
import * as FORM from "../formGenerate/formOperation.js";
import { componentData, getComponentDataByType } from "../formGenerate/components/iconMenu/config.js";
import FormFillCard from "./components/formFillCard";
import { createDialog } from "../formGenerate/components/util.js";
import ChooseDevice from "./components/chooseDevice";
import ChooseCustomer from "./components/chooseCustome";
import Skeleton from "./components/skeleton";
const { ref, reactive, onMounted, onUnmounted } = VueCompositionAPI;

let __vm = null;
const deviceCardInfoKeys = [
  {
    label: "设备类型",
    prop: "deviceType"
  },
  {
    label: "所属车间",
    prop: "deviceWorkShopName"
  },
  {
    label: "设备编码",
    prop: "deviceCode"
  },
  {
    label: "设备位置",
    prop: "devicePosition"
  }
];
const customeCardInfoKeys = [
  {
    label: "行业",
    prop: "industryNameLv2"
  }
];
const lubPointCardInfoKeys = [
  {
    label: "润滑点名称",
    prop: "lubricationPointName"
  },
  {
    label: "设备名称",
    prop: "deviceName"
  },
  {
    label: "所属车间",
    prop: "deviceWorkShopName"
  }
];
export default {
  components: {
    FormFillCard,
    Skeleton
  },
  provide() {
    return {
      addDevice: this.addDevice,
      addCustome: this.addCustome,
      deviceCardInfoList: this.deviceCardInfoList
    };
  },
  data() {
    return {
      formId: "",
      deviceCardInfoList: [],
      customeCardInfoList: [],
      lubPointCardInfoList: []
    };
  },
  created() {
    this.getFormId();
  },
  methods: {
    getFormId() {
      this.formId = this.$route.query.formId;
      __vm = this;
    },
    createData(e) {
      const createInfo = this.handleCreateData(e);
      const INS = createDialog(createInfo);
      this.INS = INS;
      INS.$parent = this;
    },
    deleteCard(e) {
      const { cardType, cardItem } = e;
      if (cardType == 1) {
        this.deviceCardInfoList = this.deviceCardInfoList.filter(item => item.id != cardItem.id);
      } else if (cardType == 2) {
        this.customeCardInfoList = this.customeCardInfoList.filter(item => item.id != cardItem.id);
      } else if (cardType == 3) {
        this.lubPointCardInfoList = this.lubPointCardInfoList.filter(item => item.id != cardItem.id);
      }
    },
    viewHistory() {
      this.$confirm("是否确认退出记录表记录编辑？退出后当前填写内容无法恢复", "退出编辑", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$router.replace({
          name: "formHistoryRecord",
          query: {
            formId: this.$route.query.formId,
            formName: this.$route.query.formName
          }
        });
      });
    },
    handleCreateData(e) {
      if (e == 1) {
        return {
          width: "60%",
          title: "添加设备",
          componentProps: {
            deviceCardInfoList: this.deviceCardInfoList
          },
          ContentComponent: ChooseDevice
        };
      } else {
        return {
          width: "50%",
          title: "添加客户",
          componentProps: {
            customeCardInfoList: this.customeCardInfoList
          },
          ContentComponent: ChooseCustomer
        };
      }
    },
    addDevice(addDevices) {
      this.deviceCardInfoList = addDevices.map(device => {
        return {
          id: device.id,
          deviceId: device.id,
          cardName: device.deviceName,
          deviceNumber: device.deviceNumber,
          deviceCode: device.deviceCode,
          deviceName: device.deviceName,
          deviceType: device.deviceTypeName,
          deviceTypeName: device.deviceTypeName,
          deviceWorkShopName: device.workshopName,
          workshopName: device.workshopName,
          devicePosition: device.devicePosition
        };
      });
      this.INS.closeDialog();
    },
    addCustome(customers) {
      this.customeCardInfoList = customers.map(custome => {
        return {
          id: custome.companyId,
          cardName: custome.companyName,
          companyId: custome.companyId,
          companyName: custome.companyName,
          industryNameLv1: custome.companyIndustryName,
          industryNameLv2: custome.companyIndustryName
        };
      });
      this.INS.closeDialog();
    },
    addLubPoint(lubPointList) {
      this.lubPointCardInfoList = lubPointList.map(lubPoint => {
        return {
          ...lubPoint,
          deviceWorkShopName: lubPoint.workshopName,
          cardName: lubPoint.lubricationPointType,
          id: lubPoint.lubricationPointNumber
        };
      });
    },
    handleSaveTableFormData(copyParams, componentModel) {
      if (copyParams.componentType != 10) return;
      const tableData = componentModel.getAssignValue();
      copyParams.optionsDtos = undefined;
      copyParams.valueStr = undefined;
      copyParams.tableDataDtoList = tableData;
    },
    handleValueStr(copyParams, componentModel) {
      if (copyParams.componentType == 7 || copyParams.componentType == 8) {
        const componentValue = componentModel.getAssignValue();
        if (!componentValue) return;
        copyParams.valueStr = componentValue.map(item => item.halfPath).toString();
      } else if (copyParams.componentType == 5) {
        if (!copyParams.valueStr) return (copyParams.valueStr = "");
        copyParams.valueStr = Vue.prototype.moment(new Date(copyParams.valueStr)).format("HH:mm:ss");
      } else if (copyParams.componentType == 6) {
        if (!copyParams.valueStr) return (copyParams.valueStr = "");
        copyParams.valueStr = Vue.prototype.moment(new Date(copyParams.valueStr)).format("YYYY-MM-DD");
      } else if (copyParams.componentType == 9) {
        if (!copyParams.valueStr) return (copyParams.valueStr = "");
        copyParams.valueStr = copyParams.valueStr.split(",")[copyParams.valueStr.split(",").length - 1].toString();
      }
    },
    handleSaveParamsType(copyParams) {
      if ("style" in copyParams && typeof copyParams.style == "boolean") {
        copyParams.style = copyParams.style ? 1 : 0;
      }
    },
    cancelFill() {
      this.$router.replace({
        name: "formManage"
      });
    },
    async saveFillForm() {
      const componentList = this.formContentList.map(field => {
        const fieldINS = this.$refs[field.__uuid];
        const copyParams = JSON.parse(JSON.stringify(backEndFullField));
        Object.entries(fieldConfigMap).forEach(([backEndFullFieldKey, frontEndFieldKey]) => {
          copyParams[backEndFullFieldKey] = field._uFieldInfo._configField[frontEndFieldKey];
        });
        const componentModel = fieldINS.getComponentValue();
        copyParams.defaultValue = copyParams.defaultValue && copyParams.defaultValue.toString();
        copyParams.valueStr = componentModel.getAssignValue() ? componentModel.getAssignValue().toString() : "";
        copyParams.id = componentModel.fieldInfo.id;
        this.handleSaveParamsType(copyParams);
        this.handleValueStr(copyParams, componentModel);
        this.handleSaveTableFormData(copyParams, componentModel);
        return copyParams;
      });

      const validateFlag = componentList.every(field => {
        if (field.componentType == 11) return true;
        if (field.componentType == 10 && field.requiredFlag && !field.tableDataDtoList.length) {
          ELEMENT.Message({
            type: "warning",
            message: `${field.title}为必填项`
          });
          return false;
        } else if (field.componentType != 10 && field.requiredFlag && !field.valueStr) {
          ELEMENT.Message({
            type: "warning",
            message: `${field.title}为必填项`
          });
          return false;
        }
        return true;
      });

      if (!validateFlag) return;

      const params = {
        componentList,
        customerDtoList: this.customeCardInfoList,
        deviceDtoList: this.deviceCardInfoList,
        lubricationPointDtoList: this.lubPointCardInfoList,
        formId: this.formId
      };
      if (this.$route.query.noCreate) params.recordId = this.$route.query.recordId;

      const res = await saveFormRecord(params);
      if (res.data.code == 1000) this.$router.go(-1);
    }
  },
  setup() {
    const loading = ref(false);
    const { formContentList, createFormField } = FORM.useFormCreate();
    onMounted(async () => {
      loading.value = true;

      const editFormRevertMiscField = __emitItem => {
        if (__emitItem.configField.componentType == 7 || __emitItem.configField.componentType == 8) {
          __emitItem.configField.limit = __emitItem.configField.length;
        }
        if (__emitItem.configField.componentType == 11) {
          __emitItem.configField.textStyle = __emitItem.configField.fieldName.split("-")[0];
          __emitItem.configField.textContent = __emitItem.configField.fieldName.split("-")[1];
        }
      };
      const editFormDataRevertFormContentHandleTable = (target, sourceData) => {
        if (target.componentType != 10) return;
        const TABLE = {
          options: []
        };
        sourceData.tableHeaderDtoList &&
          sourceData.tableHeaderDtoList.map(item => {
            item.options = JSON.parse(item.options);
            const itemOptions = {
              colInfo: {
                fieldName: item.columnName,
                required: item.requiredFlag,
                length: item.length,
                default: item.defaultValue,
                options: item.options
              },
              colType: item.columnType,
              key: item.columnUuid || generateUniqueUUID()
            };
            TABLE.options.push(itemOptions);
          });
        target.configField.TABLE = TABLE;
        target.configField.options = TABLE;
      };

      const res = await getFormListConfig({ formId: __vm.formId });
      let recordDetail = null;
      let recordDetailComponentMap = null;
      let handleRecordDetailReuse = null;
      if (__vm.$route.query.recordId) {
        const res = await getRecordDetail({ recordId: __vm.$route.query.recordId });
        recordDetail = res.data.data;
        __vm.recordDetail = res.data.data;
        __vm.deviceCardInfoList = recordDetail.deviceDtoList.map(device => ({
          id: device.deviceId,
          deviceId: device.deviceId,
          cardName: device.deviceName,
          deviceCode: device.deviceCode,
          deviceName: device.deviceName,
          deviceType: device.deviceType,
          deviceTypeName: device.deviceType,
          deviceWorkShopName: device.deviceWorkShopName,
          workshopName: device.deviceWorkShopName,
          devicePosition: device.devicePosition
        }));
        __vm.customeCardInfoList = recordDetail.customerDtoList.map(item => {
          item.id = item.companyId;
          item.cardName = item.companyName;
          return item;
        });
        __vm.lubPointCardInfoList = recordDetail.lubricationPointDtoList.map(item => {
          item.id = item.lubricationPointNumber;
          item.cardName = item.lubricationPointType;
          return item;
        });
        recordDetailComponentMap = new Map();
        recordDetail.componentList.forEach(field => {
          recordDetailComponentMap.set(field.id, field);
        });
        handleRecordDetailReuse = __emitItem => {
          if (recordDetailComponentMap.has(__emitItem.id) && recordDetailComponentMap.get(__emitItem.id)) {
            __emitItem.configField.default = recordDetailComponentMap.get(__emitItem.id).valueStr;
            if (__emitItem.componentType == 5) {
              if (!__emitItem.configField.default) return;
              const revertTimeStamp = Vue.prototype.moment(new Date().getTime()).format("YYYY-MM-DD") + " " + recordDetailComponentMap.get(__emitItem.id).valueStr;
              __emitItem.configField.default = new Date(revertTimeStamp).getTime();
            } else if (__emitItem.componentType == 7 || __emitItem.componentType == 8) {
              __emitItem.configField.default = recordDetailComponentMap.get(__emitItem.id).valueStr ? recordDetailComponentMap.get(__emitItem.id).valueStr.split(",") : "";
            } else if (__emitItem.componentType == 10) {
              __emitItem.configField.default = recordDetailComponentMap.get(__emitItem.id).tableDataDtoList;
            }
          }
        };
      }
      if (res.data.code == 1000) {
        const revertMapList = res.data.data.componentList.map(item => {
          const __emitItem = cloneDeep(getComponentDataByType(item.componentType));
          __emitItem.componentType = item.componentType;
          __emitItem._BACKEND_H = true;
          __emitItem.id = item.id;
          __emitItem.formId = item.formId;
          Object.entries(fieldRevertMap).forEach(([backEndFullFieldKey, frontEndFieldKey]) => {
            frontEndFieldKey in __emitItem.configField && backEndFullFieldKey in item && (__emitItem.configField[frontEndFieldKey] = item[backEndFullFieldKey]);
          });
          handleRecordDetailReuse && handleRecordDetailReuse(__emitItem);
          editFormRevertMiscField(__emitItem);
          editFormDataRevertFormContentHandleTable(__emitItem, item);
          return __emitItem;
        });
        revertMapList.forEach(icon => createFormField(icon));

        Vue.nextTick(() => {
          loading.value = false;
        });
      }
    });
    onUnmounted(() => {
      FORM.clearFormGenerateData();
    });
    return {
      loading,
      formContentList
    };
  },
  render() {
    return (
      <div class="form-fill-container">
        <div class="form-property-box">
          <div class="form-property-box-header">表单内容</div>
          <div class="form-property-box-content">
            {this.loading ? (
              <Skeleton />
            ) : (
              <transition-group name="form-property-box-content-list">
                {this.formContentList.map(Field => (
                  <Field key={Field.__uuid} disabledEditForm={true} ref={Field.__uuid} />
                ))}
              </transition-group>
            )}
          </div>
        </div>

        <div class="form-property-right">
          <div class="form-property-right-header" onClick={this.viewHistory}>
            <img src={require("../assets/icon/historyIcon.png")} style="margin-right:8px;width:40px;height:40px" />
            <div style="width:100%">
              <div style="font-size:15px;color:#000;font-weight:bloder;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;width:100%">
                历史记录 <i class="el-icon-arrow-right" style="float:right" />
              </div>
              <div style="font-size:13px;color:#999">查看历史记录，或引用历史记录填表</div>
            </div>
          </div>

          <div class="form-addinfo-other-content">
            {this.$userInfo.userType == 2 && (
              <FormFillCard
                cardTitle="相关设备"
                cardType="1"
                buttonText="添加设备"
                cardInfoList={this.deviceCardInfoList}
                cardInfoKeys={deviceCardInfoKeys}
                onCreateAction={e => this.createData(e)}
                onDeleteCard={e => this.deleteCard(e)}
              />
            )}
            {this.$userInfo.userType == 2 && (
              <FormFillCard
                cardTitle="相关润滑点"
                cardType="3"
                buttonText="添加润滑点"
                cardInfoList={this.lubPointCardInfoList}
                cardInfoKeys={lubPointCardInfoKeys}
                onCreateAction={e => this.createData(e)}
                onDeleteCard={e => this.deleteCard(e)}
              />
            )}
            {this.$userInfo.userType == 1 && (
              <FormFillCard
                cardTitle="相关客户"
                cardType="2"
                buttonText="添加客户"
                cardInfoList={this.customeCardInfoList}
                cardInfoKeys={customeCardInfoKeys}
                onCreateAction={e => this.createData(e)}
                onDeleteCard={e => this.deleteCard(e)}
              />
            )}
          </div>
        </div>
        <div class="form-bottom-bar">
          <el-button size="mini" onClick={this.cancelFill}>
            取消
          </el-button>
          <el-button type="danger" size="mini" onClick={this.saveFillForm}>
            提交
          </el-button>
        </div>
      </div>
    );
  }
};
</script>

<style>
@import "../formGenerate/index.css";
</style>
<style lang="less" scoped>
.form-fill-container {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  padding-top: 0;
}
.form-property-box {
  box-sizing: border-box;
  position: relative;
  transform: translateX(30%);
  width: 50%;
  height: 88%;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.5);
  overflow: hidden;
}
.form-bottom-bar {
  position: relative;
  bottom: 0;
  width: 100%;
  height: 39px;
  padding-left: 39%;
  margin-top: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.form-property-right::-webkit-scrollbar {
  display: none;
}
.form-property-box::-webkit-scrollbar {
  display: none;
}
.form-property-box-header {
  background-color: #f9f9f9;
  padding: 0 20px;
  height: 39px;
  display: flex;
  align-items: center;
  color: #000;
  font-size: 15px;
  font-weight: bolder;
}
.form-addinfo-other-content {
  height: calc(100% - 100px);
  overflow-y: auto;
}
.form-addinfo-other-content::-webkit-scrollbar {
  display: none;
}
.form-property-box-header::before {
  content: "";
  display: inline-block;
  width: 5px;
  height: 20px;
  margin-right: 10px;
  background-color: rgb(209, 0, 0, 0.8);
}
.form-property-box-content {
  background: #fff;
  padding: 20px 50px;
  height: calc(100% - 82px);
  overflow-y: auto;
}
.form-property-box-content::-webkit-scrollbar {
  display: none;
}
.form-property-box-content:empty::after {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  content: "请从左侧列表中点击需要添加组件";
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #999;
}
.form-property-box-content-list-move {
  transition: transform 0.5s;
}
.form-property-right {
  top: 0;
  right: 13%;
  box-sizing: border-box;
  position: absolute;
  width: 20%;
  height: 86%;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.5);
  overflow: auto;
}
.form-property-right-header {
  max-height: 100px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  align-items: center;
  width: 100%;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 5px 0 rgba(204, 221, 255, 1);
  background: linear-gradient(86deg, rgba(204, 221, 255, 0.4) 0%, rgba(204, 221, 255, 0.1) 100%);
}
.form-addinfo-box {
  margin: 3px;
  margin-top: 15px;
  box-sizing: border-box;
  position: relative;
  padding: 16px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.form-addinfo-title {
  font-size: 16px;
  font-weight: bolder;
}
.form-addinfo-btn {
  cursor: pointer;
  color: #d10000;
  padding: 5px;
  margin-top: 8px;
  width: 100%;
  align-items: center;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  border-radius: 3px;
  font-size: 13px;
  border: 1px solid var(--dd-0000, #d00);
  background: var(--dd-00005, rgba(221, 0, 0, 0.05));
}
.form-addinfo-addeditem {
  padding: 12px;
  margin-top: 8px;
  width: 100%;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: center;
  border-radius: 3px;
  font-size: 13px;
  border-radius: 5px;
  background: var(--f-9-f-9-f-9, #f9f9f9);
}
.form-addinfo-header {
  width: 100%;
  font-size: 13px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.delete-icon {
  font-size: 15px;
  cursor: pointer;
}
.delete-icon:hover {
  color: #d10000;
}
.form-addinfo-header-title {
  color: #000;
  font-size: 15px;
  font-weight: bolder;
}
.form-addinfo-content {
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-wrap: wrap;
}
.form-addinfo-content-line {
  margin: 3px 0;
  display: flex;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}
.form-addinfo-content-line-key {
  width: 80px;
  margin-right: 10px;
  color: #999;
}
</style>
