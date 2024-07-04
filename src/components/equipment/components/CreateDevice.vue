<template>
  <div class="addDevice">
    <el-dialog :title="deviceTypeDialog == 'addDeviceAndLubpoint' ? '创建设备' : '编辑设备'" :visible.sync="addDeviceDialog" width="40%" :close-on-click-modal="false" :before-close="cancelAddDevice">
      <div style="padding: 0px 20px 0;height:630px;overflow: auto;">
        <el-form :model="addDeviceForm" :rules="addDeviceRules" ref="addDeviceRef" class="demo-addDeviceForm" label-width="100px" label-position="top">
          <div style="margin-top: 20px;"></div>
          <el-row v-if="deviceTypeDialog != 'editDevice' && deviceTypeDialog != 'editDeviceAndLumPoint'">
            <el-col :span="24" v-if="roleType != '2'">
              <el-form-item label="所属客户" prop="customerNumber">
                <div class="selectFollow">
                  <el-select
                    size="small"
                    popper-class="myCascader"
                    :popper-append-to-body="false"
                    clearable
                    filterable
                    :disabled="customerObj && customerObj.companyNumber"
                    v-model="addDeviceForm.customerNumber"
                    :filter-method="customerAllFilter"
                    @change="handleChangeCustomer"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option v-for="item in customerList" :key="item.companyNumber" :label="item.companyName" :value="item.companyNumber"></el-option>
                    <template slot="empty">
                      <div style="text-align:center;padding:5px;color:grey;font-size: 13px;" v-if="loadingRemote">
                        加载中···
                      </div>
                      <div style="display: flex; align-items: center; justify-content: center; padding: 5px 0px" v-else>
                        暂无数据
                      </div>
                    </template>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="服务商" prop="spId" v-if="SPList.length > 1 && roleType != '1'">
                <div class="selectFollow">
                  <el-select size="small" popper-class="myCascader" :popper-append-to-body="false" clearable filterable v-model="addDeviceForm.spId" placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in SPList" :key="item.spId" :label="item.spName" :value="item.spId" />
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 分割线 -->
          <div v-if="roleType != '2' && deviceTypeDialog != 'editDevice' && deviceTypeDialog != 'editDeviceAndLumPoint'" class="border"></div>
          <el-row :gutter="20" v-show="roleType != '2'">
            <el-col :span="20">
              <el-form-item label="是否是新项目设备初装生意？" prop="newBusinessFlag" label-width="220px">
                <el-radio-group v-model="addDeviceForm.newBusinessFlag">
                  <el-radio :label="false">现有生意</el-radio>
                  <el-radio :label="true">新项目初装</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="设备名称" prop="deviceName">
                <el-input size="small" v-model="addDeviceForm.deviceName" maxlength="50" clearable placeholder="请输入" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型" prop="eptType">
                <el-cascader
                  size="small"
                  v-model="addDeviceForm.eptType"
                  placeholder="试试搜索：设备"
                  :options="eptList"
                  filterable
                  @change="changeEpt"
                  clearable
                  style="width: 100%"
                  ref="deviceRef"
                  :props="{ value: 'code', label: 'name' }"
                >
                  <template slot="empty">
                    <div style="display: flex; align-items: center; justify-content: center; padding: 5px 0px">
                      暂无匹配数据<el-link style="margin-left: 10px; color: #409eff" @click="createDevice">去创建</el-link>
                    </div>
                  </template>
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所属车间" prop="workshopId">
                <el-select v-model="addDeviceForm.workshopId" placeholder="请选择" size="small" clearable style="width: 100%" filterable>
                  <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="roleType != '2'">
              <el-form-item label="是否对客户可见" prop="customerVisibility" label-width="220px">
                <el-radio-group v-model="addDeviceForm.customerVisibility">
                  <el-radio :label="1">可见</el-radio>
                  <el-radio :label="0">不可见</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 分割线 -->
          <div class="border"></div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="制造商">
                <el-input size="small" v-model="addDeviceForm.manufacturer" maxlength="50" clearable placeholder="请输入" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备型号">
                <el-input size="small" v-model="addDeviceForm.deviceModel" maxlength="50" clearable placeholder="请输入" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编码">
                <el-input size="small" v-model="addDeviceForm.deviceCode" maxlength="50" clearable placeholder="请输入" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备位置">
                <el-input size="small" v-model="addDeviceForm.devicePosition" maxlength="50" clearable placeholder="请输入" style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddDevice('addDeviceRef')" size="small">取 消</el-button>
        <el-button type="danger" v-if="deviceTypeDialog != 'editDevice'" @click="handleContinueAddLumpoint('addDeviceRef')" size="small">下一步</el-button>
        <el-button type="danger" v-if="deviceTypeDialog == 'editDevice'" @click="handleSaveDevice('addDeviceRef')" size="small">确定</el-button>
      </div>
    </el-dialog>
    <!-- 自定义设备类型 -->
    <el-dialog title="自定义设备类型" :visible.sync="createDeviceFlag" width="30%" :close-on-click-modal="false">
      <el-form :model="addDeviceTypeForm" :rules="addDeviceDefinedRules" ref="addDeviceRef" class="demo-addDeviceForm" style="padding: 20px;">
        <el-form-item prop="name">
          <el-input v-model="addDeviceTypeForm.name" size="small" clearable maxlength="25"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addDeviceRef')" size="small">取 消</el-button>
        <el-button type="danger" @click="completeAdd('addDeviceRef')" size="small">完 成</el-button>
      </span>
    </el-dialog>
    <!-- 查重 -->
    <el-dialog title="设备类型查重" :visible.sync="showDialog" width="30%" :close-on-click-modal="false">
      <span>{{ addDeviceMsg }}</span>
      <span slot="footer" class="dialog-footer" v-if="addDeviceCode == 4307">
        <el-button @click="chooseAgain" size="small">重新选择</el-button>
        <el-button type="danger" @click="confirmAddDevice" size="small">确 定</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if="addDeviceCode == 4306">
        <el-button @click="showDialog = false" size="small">我知道了</el-button>
      </span>
    </el-dialog>
    <!-- 创建润滑点 -->
    <CreateLubricationPoint
      v-if="addLubricationPointDialog"
      :addDeviceForm="addDeviceForm"
      :deviceTypeDialog="deviceTypeDialog"
      :selectLubricationPointNumber="selectLubricationPointNumber"
      :addLumPointFormSave="addLumPointFormSave"
      :saveFlag="saveFlag"
      :epInfo="epInfo"
      :resource="resource"
      :imageLubricationList="imageLubricationList"
      :uploadUrl="uploadUrl"
      :addLubricationPointDialog="addLubricationPointDialog"
      v-on:addOrEditDevice="addOrEditDevice"
      v-on:addOrEditLup="addOrEditLup"
      v-on:lastNext="lastNext"
      v-on:addDevice="addDevice"
      v-on:editDeviceAndLumPoint="editDeviceAndLumPoint"
      v-on:closeDialogAddLubPoint="closeDialogAddLubPoint"
    />
    <SyncLub :dialogFlag="showSyncLubDialog" @closeSyncLubDialog="closeSyncLubDialog" :tipsData="tipsData" />
  </div>
</template>
<script>
import SyncLub from "./syncLubDialog.vue";
import CreateLubricationPoint from "./CreateLubricationPoint.vue";
import debounce from "lodash/debounce";
export default {
  components: {
    CreateLubricationPoint,
    SyncLub
  },
  props: {
    addDeviceDialog: {
      // 编辑设备弹框是否展示
      type: Boolean,
      default: () => {
        return false;
      }
    },
    //  addDeviceAndLubpoint 新建设备和润滑点  addLumPoint  单独添加润滑点
    //  editDevice  单独编辑设备   editLumPoint 单独编辑润滑点  editDeviceAndLumPoint  编辑设备和润滑点
    deviceTypeDialog: {
      type: String,
      default: ""
    },
    selectLubricationPointNumber: {
      // 编辑的润滑点编码
      type: String,
      default: ""
    },
    workshopId: {
      // 传过来车间id
      type: String,
      default: ""
    },
    customerObj: {
      // 所属客户带过来的值
      type: Object,
      default: () => {
        return {};
      }
    },
    resource: {
      // 入口类型
      type: String,
      default: ""
    },
    epInfo: {
      // 设备详情字段
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入自定义设备类型"));
      } else {
        const reg1 = /^[\u4e00-\u9fa5]{0,}$/;
        if (!reg1.test(value)) {
          return callback(new Error("请输入中文"));
        } else {
          callback();
        }
      }
    };
    const validateEptType = (rule, value, callback) => {
      if (!this.addDeviceForm.eptType.length) {
        return callback(new Error("请选择设备类型"));
      } else {
        callback();
      }
    };
    return {
      roleType: "",
      loadingRemote: false, // 所属数据加载中动画
      customerList: [], //所属客户下拉数据
      eptList: [], // 设备类型的数据源
      selectCompanyName: "", // 所属客户的模糊搜索
      createDeviceFlag: false,
      workshopList: [], // 所属车间
      addLubricationPointDialog: false, // 创建润滑点的弹框
      canEditFlag: true,
      showDialog: false,
      addDeviceMsg: "",
      addDeviceCode: null,
      showSyncLubDialog: false,
      tipsData: {},
      SPList: [],
      // 新建设备表单
      addDeviceForm: {
        spId: "", //服务商
        customerNumber: "", //所属客户
        newBusinessFlag: false, // 是否是新项目设备初装生意？
        deviceName: "", //设备名称
        eptType: [], //设备类型
        workshopId: "", //车间
        manufacturer: "", //制造商
        deviceModel: "", //型号
        deviceCode: "", // 设备编码
        devicePosition: "", // 设备位置
        customerVisibility: 1 // 是否对客户可见
      },
      saveFlag: false, // 是否是从下一步点击上一步回来的
      addLumPointFormSave: {
        // 润滑点表单
        imgLubricationFile: "", //润滑点图片
        recommendOilBrand: "",
        oilChangeMethod: 2, // 定期或按质换油
        recommendOilType: "",
        recommendOilSeries: "",
        recommendOilCode: "",
        lubricationPointType: "",
        lubricationPointTypeCode: "",
        lastOilAddDate: "",
        oilBrandCode: "",
        lubricationPointName: "",
        lubricationPointDesc: "",
        lubricationPointManufacturer: "",
        lubricationMethod: "",
        oilAddPeriod: "",
        oilName: "",
        oilSeries: "",
        oilType: "",
        everyTimeOilAddQuantityUnit: "L",
        fillingQuantityUnit: "L",
        preMonthOilAddQuantityUnit: "L",
        preMonthOilAddQuantity: "",
        lastOilChangeDate: "",
        fillingQuantity: "",
        oilBoxCapacity: "",
        currentOilCode: "",
        everyTimeOilAddQuantity: "",
        nextScheduledOilChangeDate: "",
        nextScheduledOilAddDate: "",
        autoCreateOilChangePlan: false,
        lastTestDate: "",
        autoCreateOilAddPlan: false, // 是否自动生成下次加脂计划
        oilChangePeriodUnit: "D",
        oilChangePeriod: "",
        oilBoxCapacityUnit: "L",
        oilAddPeriodUnit: "D",
        lubricationPointSelectName: ""
      },
      addDeviceRules: {
        deviceName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        spId: [{ required: true, message: "请选择经销商", trigger: "blur" }],
        customerNumber: [{ required: true, message: "请选择所属客户", trigger: "change" }],
        eptType: [{ required: true, validator: validateEptType, trigger: "change" }],
        customerVisibility: [{ required: true, message: "请选择是否对客户可见", trigger: "change" }],
        newBusinessFlag: [{ required: true, message: "是否是新项目设备初装生意", trigger: "change" }]
      },
      addDeviceTypeForm: {
        name: ""
      },
      addDeviceDefinedRules: {
        name: [{ validator: validateName, trigger: "blur" }]
      },
      uploadUrl: "",
      imageLubricationList: [],
      oldBussess: Boolean
    };
  },
  created() {
    this.roleType = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userType;
    if (this.roleType == "2") {
      this.addDeviceForm.customerNumber = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber;
      this.getWorkShopList(JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyId);
      this.getSpList(this.$userInfo.orgInfo.companyId);
    }
    if (this.customerObj && this.customerObj.companyId) {
      this.getSpList(this.customerObj.companyId);
    }
  },
  watch: {
    addDeviceDialog: {
      handler: function(val, oldVal) {
        if (val) {
          this.oldBussess = this.epInfo.newBusinessFlag;
          this.getEptList();
          if (this.deviceTypeDialog == "editDevice" || this.deviceTypeDialog == "editDeviceAndLumPoint") {
            // 调取车间下拉数据
            this.getWorkShopList(this.epInfo.companyId);
            this.getDeviceEdit(this.epInfo.deviceNumber);
            Object.keys(this.addDeviceForm).forEach(key => {
              this.addDeviceForm[key] = this.epInfo[key];
            });
          } else {
            if (this.customerObj == undefined || JSON.stringify(this.customerObj == "{}")) {
              this.$_queryCustomerData(); //查询所属客户
            }
          }
          if (this.workshopId) {
            this.$set(this.addDeviceForm, "workshopId", this.workshopId);
            this.canEditFlag = false;
            // 调取车间下拉数据
            this.getWorkShopList(this.customerObj.companyId);
          }
          if (this.customerObj && JSON.stringify(this.customerObj) != "{}") {
            console.log(this.customerObj, 1111);
            this.$set(this.addDeviceForm, "customerNumber", this.customerObj.companyNumber);
            this.selectCompanyName = this.customerObj.companyName;
            this.$_queryCustomerData(); //查询所属客户
            // 调取车间下拉数据
            this.getWorkShopList(this.customerObj.companyId);
          }
          const list = [];
          // 给设备类型赋值
          if (this.epInfo.deviceTypeDto) {
            this.epInfo.deviceTypeDto.forEach(item => {
              list.push(item.code);
            });
          }
          this.addDeviceForm.eptType = list;
          if (!this.addDeviceForm.customerVisibility && this.addDeviceForm.customerVisibility != 0) {
            this.$set(this.addDeviceForm, "customerVisibility", false);
          }
          if (!this.addDeviceForm.newBusinessFlag || this.addDeviceForm.newBusinessFlag == undefined) {
            this.$set(this.addDeviceForm, "newBusinessFlag", false);
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    // 上一步事件
    lastNext(formName, imageLubricationList, uploadUrl) {
      this.addLubricationPointDialog = false;
      this.addLumPointFormSave = formName;
      this.imageLubricationList = imageLubricationList;
      this.uploadUrl = uploadUrl;
      this.saveFlag = true;
    },
    // 取消创建润滑点
    closeDialogAddLubPoint() {
      this.addLubricationPointDialog = false;
    },
    changeEpt(val) {
      this.addDeviceForm.eptType = val;
    },
    // 直接创建设备
    addDevice() {
      this.submitDevice(this.addDeviceForm, "addDevice");
    },
    // 编辑设备和润滑点
    editDeviceAndLumPoint() {
      this.addLubricationPointDialog = false;
      this.$emit("addOrEditDeviceAndLumpoint");
    },
    // 创建设备和润滑点
    addOrEditLup() {
      this.addLubricationPointDialog = false;
      this.$emit("addOrEditDeviceAndLumpoint");
    },
    closeSyncLubDialog() {
      this.showSyncLubDialog = false;
      this.$emit("closeDialogAddDevice");
    },
    // 取消按钮
    cancelAddDevice() {
      this.$emit("closeDialogAddDevice");
    },
    // 编辑设备点击确定
    handleSaveDevice() {
      if (this.oldBussess && !this.addDeviceForm.newBusinessFlag) {
        this.$alert("设备由新项目初装设备变为现有生意设备，必填信息发生改变，请及时补全设备及润滑点信息", "提示", {
          confirmButtonText: "知道了",
          callback: action => {
            this.submitDevice(this.addDeviceForm, "editDevice");
          }
        });
      } else {
        this.submitDevice(this.addDeviceForm, "editDevice");
      }
    },
    // 创建设备或者编辑设备
    submitDevice(formDevice, type) {
      if (type == "addDevice") {
        let params = {};
        params.spId = formDevice.spId;
        params.deviceName = formDevice.deviceName;
        params.newBusinessFlag = formDevice.newBusinessFlag;
        params.customerNumber = formDevice.customerNumber;
        params.deviceType = formDevice.eptType[formDevice.eptType.length - 1];
        params.workshopId = formDevice.workshopId;
        params.manufacturer = formDevice.manufacturer;
        params.deviceModel = formDevice.deviceModel;
        params.deviceCode = formDevice.deviceCode;
        params.devicePosition = formDevice.devicePosition;
        params.customerVisibility = formDevice.customerVisibility;
        params.haveLubricationPointFlag = false;
        this.requestMethodPost("/web/device/addDeviceV2", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              if (res.data.tips && this.$userInfo.userType != 2) {
                this.showSyncLubDialog = true;
                this.tipsData = res.data.tips;
              } else {
                this.$emit("addOrEditDevice");
              }
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      } else {
        let params = {
          deviceNumber: this.epInfo.deviceNumber,
          newBusinessFlag: formDevice.newBusinessFlag,
          deviceName: formDevice.deviceName,
          customerNumber: formDevice.customerNumber,
          manufacturer: formDevice.manufacturer || "",
          deviceModel: formDevice.deviceModel || "",
          picDeleteFlag: formDevice.delDevicePicFlag || "",
          lubricationPointUpdateRequestList: null,
          deviceType: formDevice.eptType[formDevice.eptType.length - 1],
          workshopId: formDevice.workshopId,
          deviceCode: formDevice.deviceCode,
          devicePosition: formDevice.devicePosition,
          customerVisibility: formDevice.customerVisibility
        };
        this.requestMethodPost("/web/device/updateDeviceAndLPBatch", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$emit("addOrEditDevice");
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      }
    },
    getDeviceEdit(deviceNumber) {
      const params = {
        deviceNumberList: [deviceNumber]
      };
      this.requestMethodPost("weChat/workshop/getNoMoveDevice", params).then(res => {
        if (res.data.code == 1000) {
          this.canEditFlag = res.data.data.canEditFlag;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 下一步
    handleContinueAddLumpoint(formName) {
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addLubricationPointDialog = true;
        }
      });
    },
    //查询所属客户
    $_queryCustomerData() {
      console.log(122333, this.$userInfo.orgInfo);
      if (this.$userInfo.userType == 2) {
        this.customerList = [
          {
            companyName: this.$userInfo.orgInfo.companyName,
            companyNumber: this.$userInfo.orgInfo.companyNumber
          }
        ];
        return;
      }
      this.loadingRemote = true;
      let params = {
        companyType: 2,
        size: 100,
        status: "1,2,3",
        companyName: this.selectCompanyName,
        menuCode: "CustomerProfileList"
      };
      this.requestMethodGet("/web/customer/queryCompanyListByPage", params)
        .then(res => {
          this.loadingRemote = false;
          res = res.data;
          if (res.code == 1000) {
            this.customerList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loadingRemote = false;
        });
    },
    // 模糊搜索公司
    customerAllFilter: debounce(function(val) {
      this.selectCompanyName = val;
      this.$_queryCustomerData();
    }, 500),
    // 所属客户 change 事件
    handleChangeCustomer(val) {
      this.SPList = [];
      this.addDeviceForm.workshopId = "";
      let accountId = "";
      let selectCompany = {};
      if (val) {
        selectCompany = this.customerList.filter(item => {
          return item.companyNumber == val;
        })[0];
        const selectCompanyId = selectCompany.companyId;
        accountId = selectCompanyId;
        this.getWorkShopList(selectCompanyId, selectCompany.daFlag);
      } else {
        this.selectCompanyName = "";
        this.$_queryCustomerData();
      }
      this.getSpList(accountId, selectCompany.daFlag);
    },
    async getSpList(val, daFlag) {
      if (this.$userInfo.userType == 1 && !daFlag) {
        return (this.addDeviceForm.spId = this.$userInfo.orgInfo.companyId);
      }
      this.SPList = [];
      if (!val) return (this.SPList = []);

      const res = await this.requestMethodGetTip("/web/company/getSpsOfAccount", {
        accountId: val
      });
      this.SPList = res.data.data;
      if (this.SPList.length == 1) return (this.addDeviceForm.spId = this.SPList[0].spId);
    },
    // 获取车间
    getWorkShopList(id) {
      const params = {
        companyId: id,
        workshopName: "",
        current: 1,
        size: 500
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.workshopList = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 设备类型
    getEptList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", { filterFlag: true }).then(res => {
        if (res.data.code == 1000) {
          this.eptList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 取消创建
    cancelAdd(formName) {
      this.createDeviceFlag = false;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    // 重新选择
    chooseAgain() {
      this.showDialog = false;
      this.cancelAdd("addDeviceRef");
    },
    // 查重确定新增
    confirmAddDevice() {
      const params = {
        level: "4",
        name: this.addDeviceTypeForm.name,
        parentCode: "device_user_defined",
        forceSaveExistNameFlag: true
      };
      this.requestMethodPost("web/config/industryDevice/addIndustryDevice", params).then(res => {
        if (res.data.code == 1000) {
          this.addDeviceForm.eptType = ["industry_0013", "industry_0051", "device_user_defined", res.data.data];
          this.chooseAgain();
          this.getEptList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 创建新设备
    createDevice() {
      this.createDeviceFlag = true;
      this.addDeviceTypeForm.name = this.$refs.deviceRef.inputValue;
    },
    // 确定创建
    completeAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            level: "4",
            name: this.addDeviceTypeForm.name,
            parentCode: "device_user_defined"
          };
          this.requestMethodPost("web/config/industryDevice/addIndustryDevice", params).then(res => {
            if (res.data.code == 1000) {
              this.addDeviceForm.eptType = ["industry_0013", "industry_0051", "device_user_defined", res.data.data];
              this.chooseAgain();
              this.getEptList();
            } else if (res.data.code == 4306 || res.data.code == 4307) {
              this.addDeviceCode = res.data.code;
              this.addDeviceMsg = res.data.msg;
              this.showDialog = true;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  computed: {}
};
</script>
<style lang="less" scoped>
.addDevice {
  /deep/ .el-dialog__body {
    padding: 0px !important;
  }
  /deep/ .el-row .el-col-12 {
    padding-right: 20px !important;
  }
  .border {
    width: 100%;
    height: 1px;
    background-color: #e9e9e9;
    margin-bottom: 20px;
  }
  /deep/ .el-form-item__label {
    color: #000;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    margin-bottom: 10px !important;
  }
  /deep/ .el-form-item {
    margin-bottom: 22px !important;
  }
  /deep/ .el-radio__label {
    color: #000;
    font-family: "Microsoft YaHei";
    font-size: 14px;
  }
  /deep/ .el-dialog__title {
    color: #000;
    font-family: "Microsoft YaHei";
    font-size: 18px;
  }
  .selectFollow {
    position: relative;
    .myCascader {
      position: absolute !important;
      top: 40px !important;
      left: 0;
    }
  }
}
</style>
