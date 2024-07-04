<template>
  <div style="position:relative">
    <div class="work-order-component" :style="mainminheight">
      <div class="create-item-content">
        <!-- 所属设备 -->
        <div class="right-content">
          <div class="line"></div>
          <div class="right-title">所属设备</div>
        </div>
        <el-form ref="deviceFormRef" :model="deviceForm" :rules="deviceFormRules" label-width="100px">
          <el-form-item label="所属客户" prop="companyId" v-if="userInfo.userType < 2">
            <el-select
              size="small"
              style="width:500px"
              clearable
              filterable
              :disabled="pageFlag != '' && $userInfo.userType != 2"
              v-model="deviceForm.companyId"
              :filter-method="customerAllFilter"
              @clear="clearCustomer"
              placeholder="请选择"
              @change="companyChange"
            >
              <el-option v-for="item in customerList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="pageType == 'add' && !pageFlag">
            <div slot="label" style="display: flex;align-items: center;justify-content: right;">
              <div style="color:#F56C6C;margin:5px 5px 0 0">*</div>
              <div>请选择设备</div>
            </div>
            <el-button type="danger" size="small" plain @click="chooseDevice">选择设备</el-button>
          </el-form-item>
        </el-form>
        <!-- 选择设备后回显 -->
        <div v-for="(device, index) in checkedDevice" v-show="pageType == 'edit' || checkedDevice.length" :key="index">
          <div class="choose-device-content">
            <!-- 设备信息 -->
            <div style="display:flex;align-items:center;justify-content: space-between;">
              <!-- 设备详情 -->
              <div style="font-size:13px;font-weight:400;">
                <div style="display:flex;align-items:center;">
                  <div>
                    <span style="color:#000">设备名称：</span><span style="color:#008888">{{ device.deviceName }}</span>
                  </div>
                  <div>
                    <span style="color:#000;margin-left:24px">设备类型：</span><span style="color:#008888">{{ device.deviceTypeName }}</span>
                  </div>
                </div>
                <div style="display:flex;align-items:center;color:#999;margin-top:12px">
                  <div style="margin-right: 20px;">
                    <span>设备位置：</span><span>{{ device.devicePosition ? device.devicePosition : "暂无" }}</span>
                  </div>
                  <div style="margin-right: 20px;">
                    <span>设备编码：</span><span>{{ device.deviceCode }}</span>
                  </div>
                  <div style="margin-right: 20px;">
                    <span>设备分组：</span><span>{{ device.deviceGroupName ? device.deviceGroupName : "暂无" }}</span>
                  </div>
                </div>
              </div>
              <!-- 重新选择按钮 -->
              <div>
                <el-link size="small" style="color:#dd0000" @click="removeDevice(device)" v-if="pageType != 'edit' && !pageFlag">移除</el-link>
              </div>
            </div>
          </div>
          <div style="font-size:14px;margin:20px 0" v-if="device.lubricationPointList && device.lubricationPointList.length">请选择检查项关联的【润滑点】（非必填）</div>
          <!-- 表格 -->
          <div style="margin-bottom:20px" v-if="device.lubricationPointList && device.lubricationPointList.length">
            <el-table
              :data="device.lubricationPointList"
              tooltip-effect="dark"
              ref="lupRef"
              row-key="id"
              border
              @select="val => handleSelectLup(val, device)"
              @select-all="val => selectAllLup(val, device)"
            >
              <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
              <el-table-column prop="name" min-width="20%" label="润滑点名称" show-overflow-tooltip> </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 检查项 -->
        <div class="right-content">
          <div class="line"></div>
          <div class="right-title">检查项</div>
        </div>
        <!-- 检查项表单 -->
        <el-form ref="checkItemFormRef" :model="checkItemForm" :rules="checkItemFormRules" label-width="90px" label-position="left">
          <el-form-item label="检查内容" prop="content">
            <el-input v-model="checkItemForm.content" show-word-limit size="small" placeholder="请输入" clearable maxlength="50" style="width:500px"></el-input>
          </el-form-item>
          <el-form-item label="适用任务">
            <div style="display: flex;align-items: center;">
              <div>
                <el-select v-model="checkItemForm.task" multiple clearable placeholder="默认为“全部”" style="width:500px" size="small" @visible-change="taskVisibleChange">
                  <el-option v-for="item in taskList" :key="item.id" :label="item.taskTypeName" :value="item.id"> </el-option>
                </el-select>
              </div>
              <div>
                <div style="margin-left:10px;font-size:14px;color:#001450;font-weight:400;cursor:pointer" @click="managerItem">
                  管理可选项
                </div>
              </div>
            </div>
            <div style="color:rgb(153, 153, 153)">
              提示：请根据需要选择，以便创建任务时根据任务筛选检查项
            </div>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="checkItemForm.checkType" placeholder="请选择" style="width:500px" size="small">
              <el-option v-for="item in classicList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <div style="color:rgb(153, 153, 153)">
              {{ checkItemForm.checkType == 5 ? "提示：用于填写非标准化的检查结果，不会判断输入结果是否异常。" : checkItemForm.checkType == 2 ? "提示：标准值默认为“正常。" : "" }}
            </div>
          </el-form-item>
          <!-- 类型-数字区间 -->
          <div style="width:50%" v-if="checkItemForm.checkType == 1">
            <el-form-item label="单位">
              <el-select v-model="checkItemForm.unit" placeholder="请选择" size="small" style="width:500px">
                <el-option v-for="item in unitList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
            <!-- 单位选择“其他”项时，展示此字段 -->
            <el-form-item label="单位名称" prop="unitName" v-if="checkItemForm.unit == 43">
              <el-input v-model="checkItemForm.unitName" placeholder="最多输入10个字符" maxlength="10" size="small" style="width:500px"></el-input>
            </el-form-item>
            <el-form-item label="最大标准值" prop="maxVal" label-width="100px">
              <div style="display:flex;align-items:center">
                <div>
                  <el-select v-model="checkItemForm.maxValSymbol" placeholder="请选择" size="small" style="width:100px">
                    <el-option v-for="item in maxList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </div>
                <div style="margin-left:20px">
                  <el-input-number style="width:370px" v-model="checkItemForm.maxVal" :min="-9999999999" :max="99999999999" size="small" maxlength="10"></el-input-number>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="最小标准值" prop="minVal" label-width="100px">
              <div style="display:flex;align-items:center">
                <div>
                  <el-select v-model="checkItemForm.minValSymbol" placeholder="请选择" size="small" style="width:100px">
                    <el-option v-for="item in minList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>
                </div>
                <div style="margin-left:20px">
                  <el-input-number style="width:370px" v-model="checkItemForm.minVal" :min="-9999999999" :max="99999999999" size="small" maxlength="10"></el-input-number>
                </div>
              </div>
            </el-form-item>
          </div>
          <!-- 类型-选项 -->
          <div v-if="checkItemForm.checkType == 3">
            <template v-for="(it, index) in checkItemForm.chooseItemList">
              <el-form-item
                :label="'选项' + (index + 1)"
                :key="it.code"
                :prop="`chooseItemList.${index}.name`"
                :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur'
                }"
              >
                <el-input v-model="it.name" size="small" placeholder="最多输入10个字符" maxlength="10" style="width:500px" @change="chooseItemChange"></el-input>
                <i style="font-size:18px;color:#dd0000;" class="el-icon-remove" @click="deleteItem(it)"></i>
              </el-form-item>
            </template>
            <el-form-item label="">
              <div style="cursor:pointer">
                <i :style="!addFlag ? 'color:#001450' : 'color:rgb(153, 153, 153)'" class="el-icon-plus" @click="addItem">添加选项</i>
              </div>
            </el-form-item>
            <el-form-item label="标准值" prop="standVal">
              <el-select v-model="checkItemForm.standVal" placeholder="请选择一个或多个选项" multiple clearable size="small" @visible-change="standSelectVisible" style="width:500px">
                <el-option v-for="item in standList" :key="item.code" :label="item.name" :value="item.name"> </el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- 选项-数字 -->
          <div style="width:50%" v-if="checkItemForm.checkType == 4">
            <el-form-item label="单位">
              <el-select v-model="checkItemForm.numberUnit" placeholder="请选择" size="small" style="width:500px">
                <el-option v-for="item in unitList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
            <!-- 单位选择“其他”项时，展示此字段 -->
            <el-form-item label="单位名称" prop="unitName" v-if="checkItemForm.numberUnit == 43">
              <el-input v-model="checkItemForm.unitName" placeholder="最多输入10个字符" maxlength="10" size="small" style="width:500px"></el-input>
            </el-form-item>
            <template v-for="(it, index) in checkItemForm.numberItemList">
              <el-form-item
                :label="'标准值' + (index + 1)"
                :key="index"
                :prop="`numberItemList.${index}.name`"
                :rules="{
                  required: true,
                  message: '请输入',
                  trigger: 'blur'
                }"
              >
                <!-- <el-input v-model="it.name" size="small" placeholder="最多输入10个字符,仅支持数字负号" maxlength="10" style="width:500px"></el-input> -->
                <el-input-number
                  style="width:500px"
                  v-model="it.name"
                  :min="-9999999999"
                  :max="99999999999"
                  size="small"
                  maxlength="10"
                  placeholder="最多输入10个字符,仅支持数字负号"
                ></el-input-number>
                <i style="font-size:18px;color:#dd0000;" class="el-icon-remove" @click="deleteStandItem(it)"></i>
              </el-form-item>
            </template>
            <el-form-item label="">
              <div style="cursor:pointer">
                <i :style="!addStand ? 'color:#001450' : 'color:rgb(153, 153, 153)'" class="el-icon-plus" @click="addStandItem">添加标准值</i>
              </div>
            </el-form-item>
          </div>
          <el-form-item label="检查标准">
            <el-input v-model="checkItemForm.stander" :autosize="{ minRows: 6, maxRows: 8 }" type="textarea" maxlength="200" show-word-limit style="width:500px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-upload
              :class="{ noShowImgUpload: hideUpload || checkItemForm.imageList.length > 9 }"
              :action="uploadUrl"
              list-type="picture-card"
              limit="9"
              :file-list="checkItemForm.imageList"
              accept=".jpg,.png"
              :auto-upload="false"
              :on-change="handleAddFile"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
            >
              <i class="el-icon-plus" style="display: flex; align-items: center;justify-content: center;height: 100px;"></i>
            </el-upload>
            <div style="font-size:12px;color:#999">最多上传9张，规格要求：≤10M，jpg/png格式</div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部按钮 -->
      <div>
        <el-button size="small" @click="cancelCreate">取消</el-button>
        <el-button type="danger" size="small" @click="submit">{{ pageType == "edit" ? "保存" : "提交" }}</el-button>
        <el-button type="danger" size="small" @click="submitAndContinue" v-if="pageType != 'edit'">提交并继续</el-button>
        <el-tooltip class="item" effect="dark" v-if="pageType != 'edit'" content="继续创建时，系统会自动将当前页面内容载入新表单中" placement="top-start">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </div>
      <!-- 可选项弹框 -->
      <el-dialog title="管理可选项" :visible.sync="itemDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="40%">
        <div style="margin-bottom:20px;color:#c0c4cc">最多新增10个“适用任务”的选项，每个选项最多10字：</div>
        <el-row :gutter="30">
          <div v-for="(item, index) in itemList">
            <el-col :span="12" style="margin-bottom:20px">
              <el-input v-model="itemList[index].taskTypeName" placeholder="请输入" size="small" :disabled="!item.editFlag" maxlength="10"></el-input>
            </el-col>
          </div>
        </el-row>

        <div slot="footer">
          <el-button @click="cancelItem" size="small">取 消</el-button>
          <el-button type="danger" size="small" @click="saveItem">保 存</el-button>
        </div>
      </el-dialog>
      <!-- 选择设备 -->
      <ChooseDevice
        :chooseDeviceDialog="chooseDeviceDialog"
        :singleFlag="false"
        :checkedDevice="checkedDevice"
        :urlType="urlType"
        :actionType="actionType"
        :actionTargets="actionTargets"
        :taskType="taskType"
        :companyNumber="userInfo.userType == 2 ? userInfo.companyNumber : companyNumber"
        :companyId="deviceCompanyId"
        :noFilter="true"
        v-on:cancelChooseDevice="cancelChooseDevice"
        v-on:confirmChooseDevice="confirmChooseDevice"
      ></ChooseDevice>
      <!-- 取消 -->
      <el-dialog
        :title="pageType == 'edit' ? '取消编辑' : '取消创建'"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="cancelCreateDialog"
        width="30%"
        :before-close="() => (cancelCreateDialog = false)"
      >
        <span>是否放弃当前填写的内容？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelCreateDialog = false" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmCancel" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 图片预览 -->
      <el-dialog width="30%" :visible.sync="previewImg" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeImgPreview">
        <el-image style="width: 100%; height: 100%;margin-top:20px" :src="dialogImageUrl"> </el-image>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { validateForms } from "../../../utils/index";
import ChooseDevice from "../components/chooseDevice";
export default {
  components: { ChooseDevice },
  data() {
    return {
      checkItemsDetail: {},
      cancelCreateDialog: false,
      taskType: "item",
      actionType: "",
      actionTargets: "",
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      chooseDeviceDialog: false,
      checkedDevice: [],
      urlType: "createInspection",
      deviceForm: {
        companyId: ""
      },
      deviceFormRules: {
        companyId: [{ required: true, message: "请选择所属客户", trigger: "change" }]
      },
      lupTableData: [],
      unitList: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      uploadUrl: "",
      checkItemForm: {
        content: "",
        task: [],
        checkType: 2,
        unit: "1", //数字区间-单位
        numberUnit: "1",
        unitName: "", //数字区间-单位名称-单位选择其他时展示
        maxValSymbol: 1,
        maxVal: 0,
        minValSymbol: 3,
        minVal: 0,
        chooseItemList: [
          {
            name: "",
            code: _.uniqueId("chooseItem_")
          },
          {
            name: "",
            code: _.uniqueId("chooseItem_")
          }
        ],
        numberItemList: [
          {
            name: "",
            code: _.uniqueId("numberItem_")
          }
        ],
        stander: "",
        standVal: [],
        imageList: []
      },
      addFlag: false,
      addStand: false,
      deviceCompanyId: "",
      checkItemFormRules: {
        content: [{ required: true, message: "请输入检查项内容", trigger: "blur" }],
        unitName: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
        standVal: [{ required: true, message: "请选择标准值", trigger: "change" }],
        maxVal: [{ required: true, message: "最多输入10个字符，仅支持数字、负号、小数点", trigger: "blur" }],
        minVal: [{ required: true, message: "最多输入10个字符，仅支持数字、负号、小数点", trigger: "blur" }]
      },
      taskList: [],
      itemDialog: false,
      itemList: [],
      classicList: [
        {
          value: 2,
          label: "正常/异常"
        },
        {
          value: 1,
          label: "数字区间"
        },
        {
          value: 3,
          label: "选项"
        },
        {
          value: 4,
          label: "数字"
        },
        {
          value: 5,
          label: "文本"
        }
      ],
      customerList: [],
      maxList: [
        {
          label: "<",
          value: 1
        },
        {
          label: "≤",
          value: 2
        }
      ],
      minList: [
        {
          label: ">",
          value: 3
        },
        {
          label: "≥",
          value: 4
        }
      ],
      hideUpload: false,
      standList: [],
      checkItemsId: "",
      pageType: "",
      editId: "",
      pageFlag: "",
      previewImg: false,
      dialogImageUrl: ""
    };
  },
  async created() {
    // 获取单位下拉
    this.getUnitList();
    const query = this.$route.query;
    this.pageType = query.type;
    if (query.type == "edit") {
      //编辑
      this.selectCompanyName = this.$route.query.companyName;
      // 获取检查项详情
      this.checkItemsId = query.checkItemsId;
      await this.getCheckItemDetail();
      this.getCustomerData();
    } else if (query.type == "editEeuip") {
      this.pageFlag = query.pageFlag;
      //编辑
      this.selectCompanyName = this.$route.query.companyName;
      // 获取检查项详情
      this.checkItemsId = query.checkItemsId;
      await this.getCheckItemDetail();
      this.getCustomerData();
    } else {
      //新建
      // 获取适用任务
      this.getTaskList();
      if (query.pageFlag) {
        this.pageFlag = query.pageFlag;
        if (query.pageFlag == "deviceCreate") {
          //设备详情创建检查项-回显设备和设备下的润滑点
          this.selectCompanyName = query.companyName;
          this.getCustomerData();
          this.getDeviceDetail(query.deviceNumber);
        }
      } else {
        this.getCustomerData();
      }
    }
  },
  methods: {
    getDeviceDetail(deviceNumber) {
      this.requestMethodGet("/web/device/queryDevice", { deviceNumber: deviceNumber })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data;
            this.deviceForm.companyId = Number(data.companyId);
            this.confirmChooseDevice([data]);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 编辑时获取检查项详情
    getCheckItemDetail() {
      let url = `/device/check/checkItem/checkItemsDetail`;
      this.requestMethodGet(url, { checkItemsId: this.checkItemsId }).then(res => {
        if (res.data.code == 1000) {
          this.checkItemsDetail = res.data.data;
          const data = res.data.data;
          // 拼装设备信息
          this.editId = data.id;
          let obj = data.device;
          if (data.lubricationList && data.lubricationList.length) {
            data.lubricationList.forEach(it => {
              it.name = it.lubricationPointName;
            });
          }
          obj.lubricationPointList = data.lubricationList;
          obj.checkLupIdList = data.lubricationIds ? data.lubricationIds.split(",") : [];
          this.checkedDevice.push(obj);
          // 润滑点勾选
          let lupList = data.lubricationIds ? data.lubricationIds.split(",") : [];
          if (data.lubricationList && data.lubricationList.length && lupList.length) {
            data.lubricationList.forEach((it, idx) => {
              lupList.forEach(item => {
                this.$nextTick(() => {
                  this.$refs["lupRef"][0].toggleRowSelection(
                    data.lubricationList.find(row => {
                      return row.id == item;
                    }),
                    true
                  );
                });
              });
            });
          }
          // 检查项回显
          let checkObj = {};
          // 检查内容
          checkObj.content = data.content;
          // 适用任务
          checkObj.task = data.optionIds && data.optionIds != "0" ? data.optionIds.split(",") : [];
          // 类型
          checkObj.checkType = data.checkType;
          // 检查标准
          checkObj.stander = data.checkStandard;
          // 根据类型找出对应项回显
          switch (data.checkType) {
            // 数字区间
            case 1:
              checkObj.unit = data.digitalIntervalItem.unit ? data.digitalIntervalItem.unit : "1";
              if (data.digitalIntervalItem.unit == 43) {
                checkObj.unitName = data.digitalIntervalItem.customizeUnitName ? data.digitalIntervalItem.customizeUnitName : "";
              }
              checkObj.maxValSymbol = data.digitalIntervalItem.maxStandValueSymbol ? data.digitalIntervalItem.maxStandValueSymbol : this.checkItemForm.maxValSymbol;
              checkObj.maxVal = data.digitalIntervalItem.maxStandValue ? data.digitalIntervalItem.maxStandValue : 0;
              checkObj.minValSymbol = data.digitalIntervalItem.minStandValueSymbol ? data.digitalIntervalItem.minStandValueSymbol : this.checkItemForm.minValSymbol;
              checkObj.minVal = data.digitalIntervalItem.minStandValue ? data.digitalIntervalItem.minStandValue : 0;
              break;
            // 正常/异常
            case 2:
              checkObj.standValue = "正常/异常";
              break;
            // 选项
            case 3:
              checkObj.standVal = data.optionsItem.standValues || [];
              break;
            // 数字
            case 4:
              checkObj.numberUnit = data.digitalItem.unit ? data.digitalItem.unit : "1";
              if (data.digitalItem.unit == 43) {
                checkObj.unitName = data.digitalItem.unitName ? data.digitalItem.unitName : "";
              }
              break;
            default:
              break;
          }
          if (data.checkType == 1) {
            checkObj.numberUnit = "1";
          } else if (data.checkType == 4) {
            checkObj.unit = "1";
          }
          let chooseItemList = [
            {
              name: "",
              code: _.uniqueId("chooseItem_")
            },
            {
              name: "",
              code: _.uniqueId("chooseItem_")
            }
          ];
          checkObj.chooseItemList = data.optionsItem && data.optionsItem.optionValues ? data.optionsItem.optionValues : chooseItemList;
          let list = [];
          if (data.digitalItem && data.digitalItem.standValue) {
            data.digitalItem.standValue.forEach(it => {
              let obj = {};
              obj.name = it;
              obj.code = _.uniqueId("numberItem_");
              list.push(obj);
            });
          } else {
            list = [
              {
                name: 0,
                code: _.uniqueId("numberItem_")
              }
            ];
          }
          checkObj.numberItemList = list;
          if (data.checkType == 2 || data.checkType == 3) {
            checkObj.numberUnit = "1";
            checkObj.unit = "1";
          }
          if (data.pictureList && data.pictureList.length) {
            data.pictureList.forEach(it => {
              it.url = it.attachmentUrl;
            });
          }
          // 所属客户
          this.deviceForm.companyId = data.companyId;
          checkObj.imageList = data.pictureList && data.pictureList.length ? data.pictureList : [];
          this.hideUpload = checkObj.imageList.length == 9;
          this.checkItemForm = checkObj;
          this.getTaskList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getTaskList() {
      const params = {
        companyId: this.userInfo.userType < 2 ? this.deviceForm.companyId : this.userInfo.orgInfo.companyId
      };
      if (!params.companyId) {
        return;
      }
      this.requestMethodGet("/device/check/checkItem/deviceOptionList", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.forEach(it => {
            it.id = it.id.toString();
          });
          this.taskList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getUnitList() {
      this.requestMethodGet("/device/check/checkItem/unitSelect", {}).then(res => {
        if (res.data.code == 1000) {
          this.unitList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 查询所属客户
    getCustomerData() {
      if (this.$userInfo.userType == 2) {
        this.customerList = [
          {
            companyName: this.checkItemsDetail.companyName,
            companyId: this.checkItemsDetail.companyId
          }
        ];
        return;
      }
      let params = {
        size: 100,
        status: 1,
        accountName: this.selectCompanyName,
        menuCode: "CustomerProfileList"
      };
      this.requestMethodPost("web/customer/filterAccount", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data.list;
            this.customerList = data;
            if (this.checkItemsDetail && this.checkItemsDetail.companyId) {
              const existFlag = data.some(item => {
                return item.companyId == this.checkItemsDetail.companyId;
              });
              if (!existFlag) {
                this.customerList.unshift({
                  companyName: this.checkItemsDetail.companyName,
                  companyId: this.checkItemsDetail.companyId
                });
              }
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      this.selectCompanyName = val;
      this.getCustomerData();
    },
    clearCustomer(val) {
      if (!val) {
        this.selectCompanyName = "";
        this.checkedDevice = [];
        this.getCustomerData();
      }
    },
    companyChange(e) {
      this.checkedDevice = [];
      this.checkItemForm.task = [];
      this.getTaskList();
      let obj = {};
      // 找到选中项的整个object对象
      obj = this.customerList.find(item => {
        return item["companyId"] === e;
      });
      // 获取对应的number属性
      this.companyNumber = obj.companyNumber;
    },
    taskVisibleChange(val) {
      if (val) {
        if (this.userInfo.userType < 2 && !this.deviceForm.companyId) {
          this.$message({
            type: "warning",
            message: "请选择所属客户"
          });
          return;
        }
      }
    },
    // 选择设备
    chooseDevice() {
      if (this.userInfo.userType < 2) {
        this.$refs["deviceFormRef"].validateField(["companyId"], err => {
          if (!err) {
            this.deviceCompanyId = this.deviceForm.companyId;
            this.chooseDeviceDialog = true;
          }
        });
      } else {
        this.deviceCompanyId = this.userInfo.orgInfo.companyId;
        this.chooseDeviceDialog = true;
      }
      // this.deviceCompanyId = this.userInfo.companyId//'820'
      // this.chooseDeviceDialog = true
    },
    cancelChooseDevice() {
      this.chooseDeviceDialog = false;
    },
    confirmChooseDevice(list) {
      if (!list.length) {
        return;
      }
      // const checkedDeviceList = this.checkedDevice
      // let newArr1 = []
      // let newArr2 = []
      // list.forEach(it=>{
      //   newArr1.push(it.id)
      // })
      // if(checkedDeviceList.length){
      //   checkedDeviceList.forEach(it=>{
      //     newArr2.push(it.id)
      //   })
      // }
      // const _newArr1 = newArr1.filter(it=>!newArr2.includes(it))//新的不同ID值
      // // 先找出id，在找出对应的项
      // let newList = []
      // if(_newArr1.length){
      //   _newArr1.forEach(id=>{
      //     list.forEach(item=>{
      //       if(id == item.id){
      //         newList.push(item)
      //       }
      //     })
      //   })
      // }
      this.cancelChooseDevice();
      // const str = _newArr1.join(',')
      // if(!_newArr1.length){
      //   return
      // }
      let idList = [];
      list.forEach(it => {
        idList.push(it.id);
      });
      const str = idList.join(",");
      this.requestMethodGet("/device/check/checkItem/getLubricationPoints", { deviceIds: str }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          if (data.length) {
            list.forEach(item => {
              data.forEach(it => {
                if (item.id == it.deviceId) {
                  item.lubricationPointList = it.lubricationPoints;
                  item.checkLupIdList = [];
                }
              });
            });
          }
          // if(data.length && newList.length){
          //   data.forEach(item=>{
          //     newList.forEach(it=>{
          //       if(item.deviceId == it.id){
          //         it.lubricationPointList = item.lubricationPoints
          //         it.checkLupIdList = []
          //       }
          //     })
          //   })
          // }
          // this.checkedDevice.unshift(...newList)
          // let deviceList = []
          // list.reverse()
          // if(list.length && this.checkedDevice.length){
          //   list.forEach(it=>{
          //     this.checkedDevice.forEach((item,idx)=>{
          //       if(it.id==item.id){
          //         deviceList.push(item)
          //       }
          //     })
          //   })
          // }
          // this.checkedDevice = deviceList
          this.checkedDevice = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 选择润滑点
    handleSelectLup(list, device) {
      this.handleCheck(list, device);
    },
    // 全选润滑点
    selectAllLup(list, device) {
      this.handleCheck(list, device);
    },
    handleCheck(list, device) {
      let checkLupList = [];
      if (list.length) {
        list.forEach(it => {
          checkLupList.push(it.id);
        });
        this.checkedDevice.forEach(item => {
          if (item.id == device.id) {
            item.checkLupIdList = checkLupList;
          }
        });
      } else {
        this.checkedDevice.forEach(item => {
          if (item.id == device.id) {
            item.checkLupIdList = [];
          }
        });
      }
    },
    // 移除设备
    removeDevice(item) {
      this.checkedDevice.forEach((it, index) => {
        if (item.id == it.id) {
          this.checkedDevice.splice(index, 1);
        }
      });
    },
    // 管理可选项
    managerItem() {
      // 走接口查询已有管理项，弹出弹框
      const params = {
        companyId: this.userInfo.userType < 2 ? this.deviceForm.companyId : this.userInfo.orgInfo.companyId
      };
      if (!params.companyId) {
        this.$message({
          type: "warning",
          message: "请选择所属客户"
        });
        return;
      }
      this.requestMethodGet("/device/check/checkItem/deviceOptionList", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          const lg = data.length == 12 ? 0 : 12 - data.length;
          if (lg) {
            for (let i = 0; i < lg; i++) {
              let obj = {};
              obj.companyId = this.userInfo.userType < 2 ? this.deviceForm.companyId : this.userInfo.orgInfo.companyId;
              obj.taskTypeName = "";
              obj.key = _.uniqueId("item_");
              obj.sort = data.length + 1;
              obj.editFlag = true;
              data.push(obj);
            }
          }
          this.itemList = data;
          this.itemDialog = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 添加类型-选项
    addItem() {
      const obj = {
        name: "",
        code: _.uniqueId("chooseItem_")
      };
      // 最多添加18条
      if (this.checkItemForm.chooseItemList.length < 20) {
        this.checkItemForm.chooseItemList.push(obj);
      }
      this.addFlag = this.checkItemForm.chooseItemList.length == 20;
    },
    // 删除选项
    deleteItem(item) {
      // 只有两条的时候不可删除，有且只有大于两条才可删除
      const data = this.checkItemForm.chooseItemList;
      if (this.checkItemForm.chooseItemList.length > 2) {
        data.forEach((it, index) => {
          if (item.code == it.code) {
            data.splice(index, 1);
          }
        });
        this.checkItemForm.standVal = [];
      }
      this.checkItemForm.chooseItemList = data;
      this.addFlag = this.checkItemForm.chooseItemList.length == 20;
    },
    chooseItemChange() {
      this.checkItemForm.standVal = [];
    },
    standSelectVisible() {
      this.standList = this.checkItemForm.chooseItemList.filter(it => {
        return it.name != "";
      });
    },
    // 添加类型-数字标准值
    addStandItem() {
      const obj = {
        name: 0,
        code: _.uniqueId("numberItem_")
      };
      // 最多添加19条
      if (this.checkItemForm.numberItemList.length < 20) {
        this.checkItemForm.numberItemList.push(obj);
      }
      this.addStand = this.checkItemForm.numberItemList.length == 20;
    },
    // 删除类型-数字标准项
    deleteStandItem(item) {
      const data = this.checkItemForm.numberItemList;
      if (data.length > 1) {
        data.forEach((it, index) => {
          if (it.code == item.code) {
            data.splice(index, 1);
          }
        });
      }
      this.checkItemForm.numberItemList = data;
      this.addStand = this.checkItemForm.numberItemList.length == 20;
    },
    // 关闭管理可选项弹框
    cancelItem() {
      this.itemDialog = false;
    },
    // 保存添加的管理项
    saveItem() {
      let list = [];
      this.itemList.forEach((item, index) => {
        if (item.id || item.taskTypeName) {
          list.push(item);
        }
      });
      this.requestMethodPost("/device/check/checkItem/saveDeviceOption", list).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.checkItemForm.task = [];
          this.cancelItem();
          this.getTaskList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 添加图片
    handleAddFile(file, fileList) {
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      this.checkItemForm.imageList.push({ url: file.url });
      let params = new FormData();
      params.append("fileType", "device_check_item");
      params.append("multipartFiles", file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.checkItemForm.imageList.map(item => {
              if (item.url == file.url) {
                item.attachmentHalfUrl = res.data[0];
              }
            });
            this.hideUpload = this.checkItemForm.imageList.length == 9;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 删除图片
    handleRemove(item) {
      this.checkItemForm.imageList.forEach((it, index) => {
        if (it.uid == item.uid) {
          this.checkItemForm.imageList.splice(index, 1);
        }
      });
      this.hideUpload = this.checkItemForm.imageList.length == 9;
    },
    // 预览图片
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.previewImg = true;
      console.log("file....", file);
    },
    closeImgPreview() {
      this.previewImg = false;
    },
    // 提交
    submit() {
      const formRefs = ["deviceFormRef", "checkItemFormRef"].map(key => this.$refs[key]);
      this.submitApi(formRefs, "submit");
    },
    // 提交并继续
    submitAndContinue() {
      const formRefs = ["deviceFormRef", "checkItemFormRef"].map(key => this.$refs[key]);
      this.submitApi(formRefs, "submitAndContinue");
    },
    // 提交接口
    submitApi(formRefs, flag) {
      validateForms(formRefs)
        .then(() => {
          if (!this.checkedDevice.length) {
            this.$message({
              type: "warning",
              message: "请选择设备"
            });
            return;
          }
          // 如果选择的是数字区间类型，则需要校验最大值最小值之间的关系
          if (this.checkItemForm.checkType == 1) {
            //数字区间
            // 最小标准值不得大于等于最大标准值
            if (this.checkItemForm.minVal && this.checkItemForm.maxVal && (this.checkItemForm.minVal > this.checkItemForm.maxVal || this.checkItemForm.minVal == this.checkItemForm.maxVal)) {
              this.$message({
                type: "warning",
                message: "最小标准值不得大于等于最大标准值"
              });
              return;
            }
            // 最长十个字符
            if (this.checkItemForm.maxVal && this.checkItemForm.maxVal.toString().length > 10) {
              this.$message({
                type: "warning",
                message: "最大标准值最多十个字符"
              });
              return;
            }
            if (this.checkItemForm.minVal && this.checkItemForm.minVal.toString().length > 10) {
              this.$message({
                type: "warning",
                message: "最小标准值最多十个字符"
              });
              return;
            }
            // 数字区间输入值小数最多三位
            if (this.judgePointNum(this.checkItemForm.maxVal)) {
              this.$message({
                type: "warning",
                message: "最大标准值最多三位小数"
              });
              return;
            }
            if (this.judgePointNum(this.checkItemForm.minVal)) {
              this.$message({
                type: "warning",
                message: "最小标准值最多三位小数"
              });
              return;
            }
          }
          // 数字类型
          if (this.checkItemForm.checkType == 4) {
            let flagList = [];
            let lg = [];
            this.checkItemForm.numberItemList.forEach(it => {
              if (it.name) {
                flagList.push(this.judgePointNum(it.name));
              }
              if (it.name && it.name.toString().length > 10) {
                lg.push(it.name);
              }
            });
            // 最长十位
            if (lg.length) {
              this.$message({
                type: "warning",
                message: "标准值最长十个字符"
              });
              return;
            }
            if (flagList.includes(true)) {
              this.$message({
                type: "warning",
                message: "标准值最多三位小数"
              });
              return;
            }
          }
          // 判断是否选择了设备，没有选择设备全局提示选择设备;flag:submit,提交,submitAndContinue提交并继续
          // 拼装数据接口
          const params = {};
          params.companyId = this.userInfo.userType < 2 ? this.deviceForm.companyId : this.userInfo.orgInfo.companyId;
          // 设备和润滑点
          let deviceAndLupList = [];
          this.checkedDevice.forEach(item => {
            let obj = {};
            obj.deviceId = item.id;
            obj.lubricationIds = item.checkLupIdList;
            deviceAndLupList.push(obj);
          });
          console.log("this.checkedDevice", this.checkedDevice);
          params.deviceAndLubricationsReqs = deviceAndLupList;
          // 检查内容
          params.content = this.checkItemForm.content;
          // 适用任务
          params.optionIds = this.checkItemForm.task;
          // 类型
          params.checkType = this.checkItemForm.checkType;
          // 检查标准
          params.checkStandard = this.checkItemForm.stander;
          // 图片
          let imgList = [];
          if (this.checkItemForm.imageList.length) {
            this.checkItemForm.imageList.forEach(it => {
              imgList.push(it.attachmentHalfUrl);
            });
          }
          params.pictureOssPaths = imgList;
          // checkType 检查类型,1:数字区间 2:正常/异常 3:选项 4:数字
          let digitalIntervalItemObj = {};
          let abnormalItemObj = {};
          let optionsItemObj = {};
          let digitalItemObj = {};
          switch (this.checkItemForm.checkType) {
            // 数字区间
            case 1:
              digitalIntervalItemObj.unit = this.checkItemForm.unit;
              if (this.checkItemForm.unit == 43) {
                digitalIntervalItemObj.customizeUnitName = this.checkItemForm.unitName;
              }
              digitalIntervalItemObj.maxStandValueSymbol = this.checkItemForm.maxValSymbol;
              digitalIntervalItemObj.maxStandValue = this.checkItemForm.maxVal;
              digitalIntervalItemObj.minStandValueSymbol = this.checkItemForm.minValSymbol;
              digitalIntervalItemObj.minStandValue = this.checkItemForm.minVal;
              params.digitalIntervalItem = digitalIntervalItemObj;
              break;
            // 正常/异常
            case 2:
              abnormalItemObj.standValue = "正常/异常";
              params.abnormalItem = abnormalItemObj;
              break;
            // 选项
            case 3:
              optionsItemObj.optionValues = this.checkItemForm.chooseItemList;
              optionsItemObj.standValues = this.checkItemForm.standVal;
              params.optionsItem = optionsItemObj;
              break;
            // 数字
            case 4:
              let list = [];
              if (this.checkItemForm.numberItemList.length) {
                this.checkItemForm.numberItemList.forEach(it => {
                  list.push(it.name);
                });
              }
              if (this.checkItemForm.numberUnit == 43) {
                digitalItemObj.unitName = this.checkItemForm.unitName;
              }
              digitalItemObj.unit = this.checkItemForm.numberUnit;
              digitalItemObj.standValue = list;
              params.digitalItem = digitalItemObj;
              break;
            default:
              break;
          }
          console.log("提交参数。。。。", params);
          if (this.pageType == "add") {
            this.handleSubmit("/device/check/checkItem/create", params, flag);
            this.$gio.submitCreatePost()
          } else {
            params.id = this.editId;
            this.handleSubmit("/device/check/checkItem/update", params, flag);
            this.$gio.submitCreatePost()
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    judgePointNum(val) {
      let flag = false;
      if (val && val.toString().indexOf(".") > -1 && val.toString().split(".")[1].length > 3) {
        flag = true;
        return flag;
      }
      return flag;
    },
    handleSubmit(url, params, flag) {
      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "提交成功"
          });
          if (flag == "submit") {
            //提交
            this.$router.back();
          } else {
            //提交并继续
            // 检查内容，检查标准，图片清空，其他内容保留
            this.checkItemForm.content = "";
            this.checkItemForm.stander = "";
            this.hideUpload = false;
            this.checkItemForm.imageList = [];
          }
        } else if (res.data.code == 8000) {
          if (flag != "submit") {
            //提交并继续
            // 检查内容，检查标准，图片清空，其他内容保留
            this.checkItemForm.content = "";
            this.checkItemForm.stander = "";
            this.hideUpload = false;
            this.checkItemForm.imageList = [];
            this.checkedDevice = [];
          }
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 取消
    cancelCreate() {
      this.cancelCreateDialog = true;
    },
    confirmCancel() {
      this.cancelCreateDialog = false;
      this.$router.back();
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 220}px`;
    }
  }
};
</script>
<style lang="less" scoped>
.work-order-component {
  padding: 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
}
.right-content {
  display: flex;
  align-items: center;
  font-size: 14px;
  height: 50px;
  background-color: #f9f9f9;
  border: 1px solid #e9e9e9;
  border-left: none;
  margin-bottom: 20px;
}
.line {
  margin-left: 20px;
  width: 4px;
  height: 14px;
  background-color: #dd0000;
}
.right-title {
  line-height: 50px;
  color: #000;
  margin-left: 10px;
  font-weight: bold;
}
.choose-device-content {
  background-color: #f9f9f9;
  border: 1px solid #e9e9e9;
  padding: 16px 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}
.item-input :nth-child(even) {
  margin-left: 20px;
}
.noShowImgUpload /deep/ .el-upload--picture-card {
  display: none !important;
}
/deep/.el-upload--picture-card {
  width: 100px;
  height: 100px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 100px;
  height: 100px;
}
</style>
