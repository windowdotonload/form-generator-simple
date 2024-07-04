<!--
* @description 账号管理
* @fileName accountManagement.vue
* @author vvx
* @date 2020/05/15 15:30:23
* @version V1.0.0
!-->

<template>
  <div class="add-equipment-lubr" v-loading="loading">
    <!-- 内容区域 -->

    <div :style="mainminheight" class="add-equipment-lubr" style="padding: 10px 20px 24px; overflow: auto">
      <div class="email-info">
        已选设备：<span style="color: #dd0000">{{ dataInfo.dataList.length }}</span>
      </div>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="box-card" style="margin-bottom: 20px">
            <div slot="header" class="clearfix">
              <span
                style="
                  font-size: 14px;

                  font-weight: bold;

                  color: #000;

                  border-left: 4px solid #dd0000;

                  padding-left: 8px;
                "
                >基础信息</span
              >
            </div>

            <div style="padding-left: 10px">
              <div class="customer-info" style="margin-left: 10px">所属客户：{{ $route.query.companyName }}</div>

              <el-form :model="defaultForm" ref="defaultValidateForm" class="demo-ruleForm" label-position="top" style="overflow: hidden">
                <el-col :span="12">
                  <el-form-item label="价格支持时间段" prop="time" :rules="rules.time">
                    <el-date-picker v-model="defaultForm.startTime" type="date" clearable size="small" :picker-options="pickerStartOptions" value-format="yyyy-MM-dd" placeholder="开始时间">
                    </el-date-picker>

                    <span style="margin: 0 10px"> 至 </span>

                    <el-date-picker v-model="defaultForm.endTime" type="date" clearable size="small" :picker-options="pickerEndOptions" value-format="yyyy-MM-dd" placeholder="结束时间">
                    </el-date-picker>

                    <div style="color: #999; font-size: 12px">此时间段，需要先与美孚销售经理确认好再填写</div>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label="客户子账号"
                    prop="customerSubaccount"
                    :rules="[
                      {
                        required: true,

                        message: '请输入子账号',

                        trigger: 'blur'
                      },
                      {
                        validator: validateNum,
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input placeholder="请输入子账号" clearable size="small" v-model="defaultForm.customerSubaccount" maxlength="6"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="价格申请原因" prop="age">
                    <el-input placeholder="请填写原因" size="small" :autosize="{ minRows: 1, maxRows: 6 }" v-model="defaultForm.priceApplyReason" maxlength="500" show-word-limit></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item
                    prop="radio"
                    :rules="[
                      {
                        required: true,

                        message: '请阅读并同意',

                        trigger: 'change'
                      }
                    ]"
                  >
                    <div class="radio-read">
                      <span
                        ><el-radio v-model="defaultForm.radio" label="true" style="margin-right: 0px" @change="radioChange"><span style="color: #dd0000">* </span>我已阅读并同意</el-radio></span
                      >

                      <span
                        style="
                          color: #001450;

                          cursor: pointer;

                          text-decoration: underline;
                        "
                        @click="dialogManageVisible = true"
                        >《埃克森美孚企业业务（“B2B”）特殊价格申请及管理规定》</span
                      >
                    </div>
                  </el-form-item>
                </el-col>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-card class="box-card device-card" style="margin-bottom: 20px">
            <el-col :span="4" style="padding: 0">
              <div :class="currentActiveDevice == indexDevice ? 'active-device device-item' : 'device-item'" v-for="(item, indexDevice) in dataInfo.dataList" :key="indexDevice">
                <span @click="selectCurrentDevice(indexDevice)" style="padding: 15px 10px 15px 20px; flex: 1">
                  <!-- 设备{{ indexDevice + 1 }} -->

                  <span
                    style="
                      width: 58%;

                      display: inline-block;

                      height: 15px;

                      overflow: hidden;

                      text-overflow: ellipsis;

                      white-space: nowrap;
                    "
                  >
                    {{ item.deviceName }}
                  </span>

                  <span :style="dataInfo.dataList[indexDevice].isEditFinish ? 'color:#999' : 'color:#dd0000'">{{ dataInfo.dataList[indexDevice].isEditFinish ? "(已填写)" : "(待填写)" }}</span>
                </span>

                <i class="el-icon-delete" style="margin-right: 15px" @click="deleteDevice(indexDevice)" v-if="dataInfo.dataList.length > 1"></i>
              </div>

              <div style="text-align: center">
                <el-button type="danger" plain size="small" @click="handleAddDevice" style="width: 70%; margin-top: 20px">+ 添加润滑点</el-button>
              </div>
            </el-col>

            <el-col :span="20" style="border-left: 1px solid #ebeef5; padding: 24px 30px">
              <div style="padding-left: 10px" v-for="(item, index) in dataInfo.dataList" :key="index">
                <div v-if="currentActiveDevice == index">
                  <div
                    style="
                      margin-bottom: 20px;

                      font-size: 14px;

                      font-weight: bold;
                    "
                  >
                    设备信息
                  </div>

                  <el-form :model="dataInfo" ref="defaultDeviceValidateForm" class="demo-ruleForm" label-position="top">
                    <el-row :gutter="20">
                      <el-col :span="8">
                        <el-form-item label="设备数量（台）" :prop="'dataList.' + index + '.deviceCount'" :rules="rules.deviceNum">
                          <el-input
                            size="small"
                            v-model="item.deviceCount"
                            @keyup.native="
                              item.deviceCount = item.deviceCount.replace(
                                /[^\d]/g,

                                ''
                              )
                            "
                            maxlength="7"
                            placeholder="请输入设备数量"
                            style="width: 60%"
                            clearable
                          >
                          </el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="8">
                        <el-form-item label="设备名称" :prop="'dataList.' + index + '.deviceName'">
                          <div style="color: #999">{{ item.deviceName }}</div>
                        </el-form-item>
                      </el-col>

                      <el-col :span="8">
                        <el-form-item label="设备类型" :prop="'dataList.' + index + '.deviceTypeName'">
                          <div style="color: #999">
                            {{ item.deviceTypeName }}
                          </div>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>

                  <!-- 润滑点 -->
                  <div>
                    <el-tabs
                      v-model="currentLubricatepointActive"
                      type="card"
                      :closable="item.deviceLubesLubs.length > 1 ? true : false"
                      @tab-remove="deleteLubricationPoint($event, item)"
                      @tab-click="tabClick($event, item)"
                    >
                      <el-tab-pane v-for="(row, i) in item.deviceLubesLubs" :key="i" :label="'润滑点' + (i + 1)" :name="i"> </el-tab-pane>
                    </el-tabs>

                    <el-form :model="item" ref="dynamicValidateForm" class="demo-dynamic" label-position="top">
                      <div v-for="(row, i) in item.deviceLubesLubs" :key="i">
                        <div v-if="currentLubricatepointActive == i">
                          <div
                            style="
                              margin-bottom: 20px;

                              font-size: 14px;

                              font-weight: bold;
                            "
                          >
                            润滑点信息

                            <div style="float: right; font-weight: 400">
                              <span style="color: #001450; cursor: pointer" @click="handleEditLub(item.deviceNumber, row.lubricationPointNumber)" v-if="row.id"
                                ><i class="el-icon-edit"> </i>

                                前往编辑润滑点信息</span
                              >

                              <span
                                style="
                                  color: rgb(128, 138, 168);

                                  cursor: not-allowed;
                                "
                                v-else
                                ><i class="el-icon-edit"> </i>

                                前往编辑润滑点信息</span
                              >
                            </div>
                          </div>

                          <el-row :gutter="20" v-loading="refreshLoading">
                            <el-col :span="8">
                              <el-form-item label="润滑点名称" :prop="'deviceLubesLubs.' + i + '.lubricationId'">
                                <div style="color: #999">{{ row.lubricationPointName || "--" }}</div>
                                <!-- <el-select
                                  size="small"
                                  v-model="row.lubricationId"
                                  @change="lubricationPointChange(row, item)"
                                  @visible-change="lubricationPointFocus($event, item)"
                                  style="width: 256px"
                                  placeholder="请选择润滑点"
                                >
                                  <el-option
                                    v-for="res in item.lubricationPointList"
                                    :disabled="res.disabled"
                                    :key="res.id"
                                    :label="res.lubricationPointType + (res.lubricationPointName ? '/' : '') + res.lubricationPointName"
                                    :value="res.id"
                                  ></el-option>
                                </el-select> -->
                              </el-form-item>
                            </el-col>

                            <el-col :span="8">
                              <el-form-item :prop="'deviceLubesLubs.' + i + '.oilTankVol'">
                                <span slot="label"
                                  >油箱容量

                                  <el-tooltip content="若要更改油箱容量与换油周期，请去润滑点信息更新" effect="light" placement="top" style="display: inline-block">
                                    <i class="el-icon-warning" style="font-size: 14px; color: #ccc"></i>
                                  </el-tooltip>
                                </span>

                                <div style="color: #999">{{ row.oilTankVol || "--" }}（{{ row.oilBoxCapacityUnit }}）</div>
                              </el-form-item>
                            </el-col>

                            <el-col :span="8">
                              <el-form-item :prop="'deviceLubesLubs.' + i + '.odi'">
                                <span slot="label"
                                  >换油周期

                                  <el-tooltip content="若要更改油箱容量与换油周期，请去润滑点信息更新" effect="light" placement="top" style="display: inline-block">
                                    <i class="el-icon-warning" style="font-size: 14px; color: #ccc"></i>
                                  </el-tooltip>
                                </span>

                                <div style="color: #999">{{ row.odi || row.odi == 0 ? row.odi : "--" }} （{{ row.odiUnit }}）</div>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <el-row :gutter="20" v-loading="refreshLoading">
                            <el-col :span="8">
                              <el-form-item :prop="'deviceLubesLubs.' + i + '.oilBrandName'">
                                <span slot="label">在用油品牌 </span>

                                <div style="color: #999">{{ row.oilBrandName || "--" }}</div>
                              </el-form-item>
                            </el-col>

                            <el-col :span="8">
                              <el-form-item :prop="'deviceLubesLubs.' + i + '.currentOilName'">
                                <span slot="label">在用油名称 </span>

                                <div style="color: #999">{{ row.currentOilName || "--" }}</div>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <div style="font-size: 12px;color: rgb(255, 153, 0);padding-bottom: 20px;">
                            <i class="el-icon-warning"></i>

                            如需变更润滑点信息，请选择右上角“前往编辑润滑点信息”进行更改
                          </div>

                          <!-- 单台设备用油信息 -->

                          <!-- <div style="height:1px;background:#e9e9e9;margin:20px 0 20px"></div>

                            <div style="margin-bottom:20px;font-size:14px;font-weight:bold;"> 单台设备用油信息</div> -->

                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-form-item
                                :prop="'deviceLubesLubs.' + i + '.changeOver'"
                                :rules="[
                                  {
                                    required: true,

                                    message: '请选择初装/整体换油',

                                    trigger: 'change'
                                  }
                                ]"
                              >
                                <span slot="label">是否初装/整体换油</span>

                                <!-- <el-radio-group v-model="row.changeOver">

                                  <el-radio :label="false">否</el-radio>

                                  <el-radio :label="true">是</el-radio>

                                </el-radio-group> -->

                                <el-select size="small" v-model="row.changeOver" style="width: 256px" placeholder="请选择润滑点" @change="changeSelectOver">
                                  <el-option label="否" :value="false" />

                                  <el-option label="是" :value="true" />
                                </el-select>
                              </el-form-item>
                            </el-col>

                            <el-col :span="8">
                              <el-form-item :prop="'deviceLubesLubs.' + i + '.serviceFillVol'" :rules="rules.number">
                                <span slot="label"
                                  >添加量

                                  <el-tooltip content="单台设备的估计的年消耗量" effect="light" placement="top" style="display: inline-block">
                                    <i class="el-icon-warning" style="font-size: 14px; color: #ccc"></i>
                                  </el-tooltip>
                                </span>

                                <el-input
                                  size="small"
                                  v-model="row.serviceFillVol"
                                  @keyup.native="row.serviceFillVol = row.serviceFillVol.replace(/[^\d.]/g, '')"
                                  maxlength="6"
                                  placeholder="请输入添加量"
                                  style="width: 256px"
                                  clearable
                                >
                                  <template slot="append">{{ row.oilBoxCapacityUnit }}</template>
                                </el-input>

                                <div style="color: #dd0000; font-size: 13px">(若年度换油次数大于1， 额外需求量请填入添加量中)</div>
                              </el-form-item>
                            </el-col>

                            <el-col :span="8">
                              <el-form-item :prop="'deviceLubesLubs.' + i + '.flushingVol'" :rules="rules.number">
                                <span slot="label"
                                  >冲洗量

                                  <el-tooltip content="单台设备的冲洗油用量" effect="light" placement="top" style="display: inline-block">
                                    <i class="el-icon-warning" style="font-size: 14px; color: #ccc"></i>
                                  </el-tooltip>
                                </span>

                                <el-input
                                  size="small"
                                  v-model="row.flushingVol"
                                  @keyup.native="
                                    row.flushingVol = row.flushingVol.replace(
                                      /[^\d.]/g,

                                      ''
                                    )
                                  "
                                  maxlength="6"
                                  placeholder="请输入冲洗量"
                                  style="width: 256px"
                                  clearable
                                >
                                  <template slot="append">{{ row.oilBoxCapacityUnit }}</template>
                                </el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <!-- 油品信息 -->

                          <div
                            style="
                              height: 1px;

                              background: #e9e9e9;

                              margin: 20px 0 20px;
                            "
                          ></div>

                          <div
                            style="
                              margin-bottom: 20px;

                              font-size: 14px;

                              font-weight: bold;
                            "
                          >
                            油品信息
                          </div>

                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-form-item class="form" :prop="'deviceLubesLubs.' + i + '.productNumber'" :rules="rules.productNumber">
                                <span slot="label">产品编号</span>
                                <el-autocomplete
                                  size="small"
                                  style="width: 256px"
                                  maxlength="9"
                                  popper-class="my-autocomplete"
                                  v-model="row.productNumber"
                                  @keyup.native="row.productNumber = row.productNumber.replace(/[^\d.]/g, '')"
                                  :fetch-suggestions="
                                    (queryString, cb) => {
                                      querySearch(queryString, cb, item, row);
                                    }
                                  "
                                  clearable
                                  hide-loading="true"
                                  placeholder="请输入6位产品编号查询"
                                  @blur="handleBlur($event, item, row)"
                                  @input="handleChange($event, item, row)"
                                  @select="handleSelect($event, item, row)"
                                >
                                  <template slot-scope="{ item }">
                                    <div v-if="!noData">
                                      <span class="name">{{ item.globalId }} {{ item.localProductNameCh }}</span>
                                    </div>
                                    <div v-if="noData" style="white-space: normal;font-size:13px;line-height: 18px;">{{ item.default }}</div>
                                  </template>
                                </el-autocomplete>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item :prop="'deviceLubesLubs.' + i + '.oilNumber'">
                                <span slot="label">
                                  <span style="color: #f56c6c;font-size: 14px;margin-right: 2px;">*</span>
                                  油品名称</span
                                >
                                <el-input size="small" v-model="row.localProductNameCh" placeholder="请输入" style="width: 256px" disabled> </el-input>
                              </el-form-item>

                              <div v-if="row.diffOilName && row.oilNumber" style="margin-top: -16px;color: rgb(255, 153, 0);">温馨提示：当前油品与设备使用中油品不一致，请留意</div>
                              <div v-if="row.emptyOilName && row.oilNumber == ''" style="color: #dd0000; font-size: 13px;margin-top: -16px;">当前油品名称在数据库中未维护，请联系管理员或更换油品</div>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item :prop="'deviceLubesLubs.' + i + '.oilPackage'" :rules="rules.oilPackage">
                                <span slot="label">油品包装</span>
                                <el-input
                                  size="small"
                                  v-model="row.oilPackage"
                                  @keyup.native="
                                    row.oilPackage = row.oilPackage.replace(
                                      /[^\d.]/g,

                                      ''
                                    )
                                  "
                                  maxlength="10"
                                  placeholder="请输入油品包装"
                                  style="width: 256px"
                                  clearable
                                >
                                  <template slot="append">{{ row.oilBoxCapacityUnit }}</template>
                                </el-input>
                                <div style="color: #999; font-size: 13px">散装油包装规格为1</div>
                              </el-form-item>
                            </el-col>
                          </el-row>

                          <div
                            style="
                              height: 1px;

                              background: #e9e9e9;

                              margin: 20px 0 20px;
                            "
                          ></div>

                          <div
                            style="
                              margin-bottom: 20px;

                              font-size: 14px;

                              font-weight: bold;
                            "
                          >
                            申请量信息<span style="color: #999; font-weight: 400">（申请量根据用油信息、油品信息、辅助信息，自动得出，无需填写） </span>
                          </div>

                          <div class="customer-info" style="margin-bottom: 15px">
                            <span>年度用油量申请数（件）：{{ row.yearOilVol || row.yearOilVol === 0 ? row.yearOilVol : "--" }}</span>
                          </div>

                          <div style="color: #999; margin-bottom: 10px">
                            注：{{
                              row.changeOver && row.oilPackage > 1
                                ? "年度用油量申请数(件)=(油箱容量+冲洗量+添加量)×设备数量/油品包装"
                                : !row.changeOver && row.oilPackage > 1
                                ? "年度用油量申请数(件)=添加量×设备数量/油品包装"
                                : row.changeOver && row.oilPackage == 1 && row.oilBoxCapacityUnit == "L"
                                ? "年度用油量申请数(件)=((油箱容量+冲洗量+添加量)×138/159)×设备数量"
                                : row.changeOver && row.oilPackage == 1 && row.oilBoxCapacityUnit == "KG"
                                ? "年度用油量申请数(件)=(油箱容量+冲洗量+添加量)×设备数量"
                                : !row.changeOver && row.oilPackage == 1 && row.oilBoxCapacityUnit == "L"
                                ? "年度用油量申请数(件)=(添加量×138/159)×设备数量"
                                : !row.changeOver && row.oilPackage == 1 && row.oilBoxCapacityUnit == "KG"
                                ? "年度用油量申请数(件)=添加量×设备数量"
                                : "—"
                            }}
                          </div>

                          <el-button
                            :type="!item.deviceCount || !row.id || !row.oilPackage ? 'info' : 'danger'"
                            plain
                            size="small"
                            @click="calcApply(row, item.deviceCount)"
                            :disabled="!item.deviceCount || !row.id || !row.oilPackage"
                            style="margin-bottom: 20px"
                            >一键生成申请量</el-button
                          >
                        </div>
                      </div>
                    </el-form>
                  </div>
                </div>
              </div>
            </el-col>
          </el-card>
        </el-col>
      </el-row>

      <div style="margin: 40px 0 80px; text-align: center">
        <el-button size="small" @click="saveDeviceLubes">保存草稿</el-button>

        <el-button size="small" @click="cancelDeviceLubes">取消</el-button>

        <el-button size="small" :disabled="!$route.query.id" @click="previewPDF">申请表预览</el-button>

        <el-button type="danger" size="small" @click="saveDeviceLubes('submit')">提交申请表</el-button>
      </div>
    </div>
    <lupDialogNew
      :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
      :singleFlag="false"
      :checkedDevice="checkedDevice"
      :urlType="urlType"
      :companyName="$route.query.companyName"
      :companyId="$route.query.companyId"
      :companyNumber="$route.query.companyNumber"
      v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
      v-on:confirmChooseLup="confirmChooseLup"
    >
    </lupDialogNew>
    <!-- 编辑设备弹框 -->
    <CreateDevice
      v-if="addDeviceDialog"
      :deviceTypeDialog="deviceTypeDialog"
      :selectLubricationPointNumber="selectLubricationPointNumber"
      :addDeviceDialog="addDeviceDialog"
      :epInfo="epInfo"
      v-on:addOrEditDeviceAndLumpoint="addOrEditDeviceAndLumpoint"
      v-on:closeDialogAddDevice="closeDialogAddDevice"
    />
    <el-dialog title="《埃克森美孚企业业务（“B2B”）特殊价格申请及管理规定》" :visible.sync="dialogManageVisible" width="600px" :close-on-click-modal="false" class="select-device manage-title">
      <div v-html="clauseContent"></div>

      <div style="text-align: center; margin-top: 30px">
        <el-button type="danger" size="small" @click="readAndAgree('true')">我已阅读并同意</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CreateDevice from "./components/CreateDevice.vue";
import lupDialogNew from "../spotInspection/components/chooseLubricationPointWorkorder.vue";
export default {
  name: "EquipmentLubrTable",
  components: {
    lupDialogNew,
    CreateDevice
  },
  data() {
    var validateNumber = (rule, value, callback) => {
      console.log(value);
      if (value && isNaN(value)) {
        return callback(new Error("请输入正确的数字"));
      } else {
        callback();
      }
    };

    let validateTime = (rule, value, callback) => {
      if (!this.defaultForm.startTime) {
        return callback(new Error("请选择价格支持开始时间"));
      } else if (!this.defaultForm.endTime) {
        return callback(new Error("请选择价格支持结束时间"));
      } else {
        callback();
      }
    };

    return {
      validateNum: (rule, value, callback) => {
        if (value && isNaN(value)) {
          return callback(new Error("请输入正确的数字"));
        } else {
          callback();
        }
      },
      epInfo: {},
      addDeviceDialog: false,
      deviceTypeDialog: "editDeviceAndLumPoint",
      selectLubricationPointNumber: "",
      chooseDeviceAndLupDialog: false,
      checkedDevice: [],
      urlType: "lubrTable",
      currentActiveDevice: 0,
      keyNumber: 0,

      currentLubricatepointActive: 0,

      preLubriActiveIndex: 0,
      searchOil: false,

      defaultForm: {
        customerSubaccount: "",

        startTime: "",

        endTime: "",

        priceApplyReason: "",

        radio: ""
      },

      queryDeviceParams: {
        deviceName: "" //状态
      },

      dialogFormVisible: false,

      dialogManageVisible: false,

      dataInfo: {
        dataList: []
      },

      statusList: [
        {
          value: "",

          label: "全部"
        },

        {
          value: 0,

          label: "未提交"
        },

        {
          value: 1,

          label: "进行中"
        },

        {
          value: 2,

          label: "已驳回"
        },

        {
          value: 3,

          label: "已审批"
        }
      ],

      detailDialogFlag: false,

      status: 2,

      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,

      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      // userInfo: JSON.parse(this.$cookies.get("userInfo")),

      ruleForm: {
        email: ""
      },

      pickerStartOptions: {
        disabledDate: time => {
          if (this.defaultForm.endTime) {
            return time.getTime() > new Date(this.defaultForm.endTime).getTime();
          }
        }
      },

      pickerEndOptions: {
        disabledDate: time => {
          if (this.defaultForm.startTime) {
            return time.getTime() <= new Date(this.defaultForm.startTime).getTime();
          }
        }
      },

      rules: {
        time: [{ required: true, validator: validateTime, trigger: "change" }],

        email: [{ required: true, message: "请输入邮箱地址", trigger: "blur" }, { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],

        deviceNum: [{ required: true, message: "请输入设备数量", trigger: "blur" }],

        oilPackage: [{ required: true, message: "请输入油品包装", trigger: "change" }],

        productNumber: [{ required: true, message: "请输入产品编号", trigger: "change" }, { type: "number", validator: validateNumber, trigger: "blur" }],

        number: [{ required: false, validator: validateNumber, trigger: "blur" }]
      },

      lumDataCustomers: [],

      lubricatepointNameList: [],

      statusList: [
        {
          value: "",

          label: "全部"
        },

        {
          value: 0,

          label: "未提交"
        },

        {
          value: 1,

          label: "进行中"
        },

        {
          value: 2,

          label: "已驳回"
        },

        {
          value: 3,

          label: "已审批"
        }
      ],

      pagenation: {
        current: 1,

        size: 30
      },

      newsTableData: [],

      totalNumber: 0, //总条数

      dataRecordTableData: [],

      selectList: [],

      deviceList: [],

      dialogTitle: "",

      currentDevicePage: 1,

      deviceTotalCount: 0, //设备总条数

      loadingLum: false,

      selectionDevice: [], //选择的设备

      loading: false, //是否加载

      refreshLoading: false,

      clauseContent: "",
      restaurants: [],
      noData: false, // 产品编号是否有匹配数据
      oilId: "",
      errOilBox: false,
      getOil: []
    };
  },
  created() {
    if (!this.$route.query.id) {
      this.dataInfo.dataList = JSON.parse(this.$route.query.deviceList);
      this.dataInfo.dataList.forEach((item, index) => {
        this.$_getLubricatePointData(item.deviceNumber, index);
      });
    }
  },

  mounted() {
    if (this.$route.query.id) {
      this.getDeviceLubesDetail(); //获取特价润滑详情
    }

    this.getClause();
  },

  methods: {
    // 取消编辑设备
    closeDialogAddDevice() {
      this.addDeviceDialog = false;
    },
    // 编辑设备弹框点击确定
    addOrEditDeviceAndLumpoint() {
      this.addDeviceDialog = false;
      this.$_queryEPInfo(this.epInfo.deviceNumber);
    },
    $_queryEPInfo(deviceNumber) {
      let params = {
        deviceNumber
      };
      this.requestMethodGet("/web/device/queryDevice", params)
        .then(async res => {
          res = res.data;
          if (res.code == 1000) {
            const deviceData = res.data;
            const lubriListRes = await this.requestMethodGet("/web/lubricationPoint/queryLubricationPointList", params);
            let selectLubri = {};
            if (lubriListRes.data.code == 1000) {
              let lubriList = lubriListRes.data.data;
              lubriList.forEach(item => {
                if (item.lubricationPointNumber == this.selectLubricationPointNumber) {
                  selectLubri = item;
                }
              });
            }
            this.dataInfo.dataList.forEach(item => {
              if (item.deviceNumber == this.epInfo.deviceNumber) {
                item.deviceName = deviceData.deviceName;
                item.deviceTypeName = deviceData.deviceTypeName;
                item.deviceNumber = deviceData.deviceNumber;
                item.deviceId = deviceData.id;
              }
              if (item.deviceLubesLubs) {
                item.deviceLubesLubs.forEach(async it => {
                  if (it.lubricationPointNumber == this.selectLubricationPointNumber) {
                    it.odi = selectLubri.oilChangePeriod;
                    it.odiUnit = selectLubri.oilChangePeriodUnitDesc;
                    it.oilTankVol = selectLubri.oilBoxCapacity;
                    it.oilBoxCapacityUnit = selectLubri.oilBoxCapacityUnit;
                    it.lubricationPointName = selectLubri.lubricationPointName;
                    it.lubricationPointNumber = selectLubri.lubricationPointNumber;
                    it.lubricationPointType = selectLubri.lubricationPointType;
                    it.oilBrandName = selectLubri.oilBrandName;
                    it.oilBrandCode = selectLubri.oilBrandCode;
                    it.currentOilCode = selectLubri.currentOilCode;
                    it.oilChangePeriodUnit = selectLubri.oilChangePeriodUnit;
                    if (it.currentOilCode) {
                      let currentOilName = await this.getOilNameByOilCode(it.currentOilCode);
                      this.$set(it, "currentOilName", currentOilName);
                    }
                  }
                });
              }
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false;
    },
    confirmChooseLup(list) {
      console.log(list);
      let deviceList = [];
      let deviceListUni = _.uniqBy(list, "deviceId");
      let newClone = _.cloneDeep(this.dataInfo.dataList);
      let deviceIds = newClone.map(item => {
        return item.deviceId;
      });
      deviceListUni.forEach(item => {
        deviceList.push({
          deviceName: item.deviceName,
          deviceTypeName: item.deviceTypeName,
          deviceNumber: item.deviceNumber,
          deviceCount: "",
          isEditFinish: false,
          deviceId: item.deviceId,
          deviceLubesLubs: []
        });
      });
      list.forEach(item => {
        deviceList.forEach(it => {
          if (item.deviceId == it.deviceId) {
            it.deviceLubesLubs.push({
              deviceId: item.deviceId,
              deviceName: item.deviceName,
              deviceNumber: item.deviceNumber,
              id: item.lubricationPointId,

              lubricationPointName: item.lubricationPointName,
              lubricationPointNumber: item.lubricationPointNumber,
              changeOver: "",
              flushingVol: "",
              lubricationId: item.lubricationPointId,
              odi: "",
              oilNumber: "",
              oilPackage: "",
              productNumber: "",
              oilTankVol: "",
              serviceFillVol: "",
              yearOilVol: "",
              oilBoxCapacityUnit: "L"
            });
          }
        });
      });
      // 将deviceId相同的润滑点合并在一起
      deviceList.forEach(it => {
        if (deviceIds.includes(it.deviceId)) {
          this.dataInfo.dataList.forEach(item => {
            if (item.deviceId == it.deviceId) {
              item.isEditFinish = false;
              item.deviceLubesLubs = item.deviceLubesLubs.concat(it.deviceLubesLubs);
            }
          });
        } else {
          this.dataInfo.dataList.push(it);
        }
      });
      this.dataInfo.dataList.forEach((item, index) => {
        this.$_getLubricatePointData(item.deviceNumber, index);
      });
      this.chooseDeviceAndLupDialog = false;
    },
    changeSelectOver(val) {
      var validateNumber = (rule, value, callback) => {
        if (value && isNaN(value)) {
          return callback(new Error("请输入正确的数字"));
        } else {
          callback();
        }
      };

      if (val) {
        this.rules.number = [{ required: false, validator: validateNumber, trigger: "blur" }];
      } else {
        this.rules.number = [{ required: true, message: "请输入添加量", trigger: "change" }, { required: false, validator: validateNumber, trigger: "blur" }];
      }
    },
    // 模糊搜索
    async querySearch(queryString, cb, item, row) {
      let oilNumber = "";
      // let res = item.lubricationPointList.find(it => it.id == row.lubricationId);
      // if (res) {
      oilNumber = row.currentOilCode;
      // }
      if ((queryString && queryString.length < 6) || !queryString) {
        this.restaurants = [];
        this.noData = false;
        return;
      }
      await this.requestMethodGet("/mdm/oil/getOilProductDropDownListByPage", { globalId: queryString, size: 200, oilNumber: oilNumber })
        .then(res => {
          if (res.data.code == 1000) {
            this.restaurants = res.data.data.list;
            this.noData = false;
            if (res.data.data.list.length === 0) {
              this.restaurants = [{ default: "未查询到相关油品" }];
              this.noData = true;
            } else {
              this.getOil = res.data.data.list;
            }
          }
        })
        .catch(res => {});

      // 调用 callback 返回建议列表的数据
      cb(this.restaurants);
    },
    createFilter(queryString) {
      return restaurant => {
        return restaurant.globalId.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    handleChange(val, deviceItem, lubItem) {
      lubItem.localProductNameCh = "";
      lubItem.oilNumber = "";
      lubItem.diffOilName = false;
      lubItem.emptyOilName = true;
    },
    handleBlur(val, deviceItem, lubItem) {
      if (this.restaurants.length == 0 || (this.restaurants.length == 1 && this.restaurants[0].default) || lubItem.productNumber.length < 6) {
        lubItem.productNumber = "";
      }
    },
    handleSelect(val, deviceItem, lubItem) {
      this.oilId = val.globalId;
      // let res = deviceItem.lubricationPointList.find(it => it.id == lubItem.lubricationId);
      deviceItem.deviceLubesLubs.forEach((row, index) => {
        if (row.id == lubItem.id) {
          row.localProductNameCh = val.localProductNameCh;
          row.oilNumber = val.globalId;
          if (!row.localProductNameCh) {
            row.diffOilName = false;
          } else {
            row.emptyOilName = false;
          }
        }
        if (this.getOil[0].spuCode != this.getOil[0].localProductNameCode || !this.getOil[0].spuCode) {
          row.diffOilName = true;
          row.emptyOilName = false;
        }
        if (this.getOil[0].spuCode == this.getOil[0].localProductNameCode) {
          row.diffOilName = false;
        }
      });
      lubItem.productNumber = val.globalId;
    },

    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
    },

    getClause() {
      let param = {
        clauseCode: "device_lubes_clause"
      };

      this.requestMethodGet("/web/clause/getClause", param)

        .then(res => {
          res = res.data;

          if (res.code == 1000) {
            this.clauseContent = res.data.content;
          } else {
            this.$message({
              message: res.msg,

              type: "warning"
            });
          }
        })

        .catch(res => {
          this.loading = false;
        });
    },

    readAndAgree(val) {
      this.defaultForm.radio = val;

      this.dialogManageVisible = false;
    },

    selectCurrentDevice(index) {
      if (this.currentActiveDevice == index) {
        return;
      }

      if (
        this.validateDeviceLub(
          "defaultDeviceValidateForm",

          "设备数量必填项未填"
        ) &&
        this.validateDeviceLub("dynamicValidateForm", "润滑点必填项未填", this.currentActiveDevice, "eq")
      ) {
        this.calcApply(
          this.dataInfo.dataList[this.currentActiveDevice].deviceLubesLubs[this.preLubriActiveIndex],

          this.dataInfo.dataList[this.currentActiveDevice].deviceCount
        );

        this.dataInfo.dataList[this.currentActiveDevice].isEditFinish = true;

        this.currentActiveDevice = index;

        // 每次选择设备将当前润滑点变成第一个

        this.$nextTick(() => {
          this.preLubriActiveIndex = this.currentLubricatepointActive = "0";
        });
        this.setLubInfo();
      } else {
        this.dataInfo.dataList[this.currentActiveDevice].isEditFinish = false;
      }
    },

    async tabClick(val, item) {
      if (this.preLubriActiveIndex == val.name) {
        return;
      }

      if (
        this.validateDeviceLub(
          "defaultDeviceValidateForm",

          "设备数量必填项未填"
        ) &&
        this.validateDeviceLub("dynamicValidateForm", "润滑点必填项未填")
      ) {
        this.calcApply(
          item.deviceLubesLubs[this.preLubriActiveIndex],

          item.deviceCount
        );
        let currentOilCode = item.deviceLubesLubs[this.preLubriActiveIndex].currentOilCode;
        if (currentOilCode) {
          let currentOilName = await this.getOilNameByOilCode(currentOilCode);
          this.$set(item.deviceLubesLubs[this.preLubriActiveIndex], "currentOilName", currentOilName);
        }
        this.preLubriActiveIndex = val.name;
      } else {
        this.$nextTick(() => {
          this.currentLubricatepointActive = this.preLubriActiveIndex;
        });
      }
    },

    // 获取详情信息

    getDeviceLubesDetail() {
      let params = {
        id: this.$route.query.id
      };

      this.newsTableData = [];

      this.requestMethodGet("/device/lubes/getDeviceLubesDetail", params)

        .then(res => {
          res = res.data;

          if (res.code == 1000) {
            this.$route.query.companyNumber = res.data.companyNumber;

            this.$route.query.companyName = res.data.companyName;

            this.$route.query.companyId = res.data.customerId;

            this.defaultForm.startTime = res.data.startTime;

            this.defaultForm.endTime = res.data.endTime;

            this.defaultForm.priceApplyReason = res.data.priceApplyReason;

            this.defaultForm.customerSubaccount = res.data.customerSubaccount;

            this.defaultForm.radio = "true";

            this.pdfUrl = res.data.pdfUrl;

            this.dataInfo.dataList = res.data.deviceLubesDevs;

            this.dataInfo.dataList.forEach((item, index) => {
              if (item.deviceLubesLubs && item.deviceLubesLubs.length > 0) {
                item.deviceLubesLubs.forEach(it => {
                  it.id = it.lubricationId;
                });
              }
              item.isEditFinish = true;

              this.$_getLubricatePointData(item.deviceNumber, index);
            });
          } else {
            this.$message({
              message: res.msg,

              type: "warning"
            });
          }
        })

        .catch(res => {
          this.loading = false;
        });
    },

    handleAddDevice() {
      if (
        this.validateDeviceLub(
          "defaultDeviceValidateForm",

          "设备数量必填项未填"
        ) &&
        this.validateDeviceLub("dynamicValidateForm", "润滑点必填项未填")
      ) {
        this.dataInfo.dataList[this.currentActiveDevice].isEditFinish = true;

        let index = -1;

        for (let [i, item] of this.dataInfo.dataList.entries()) {
          if (!item.isEditFinish) {
            index = i + 1;

            break;
          }
        }

        if (index > -1) {
          this.$message({
            message: "请完善设备" + index + "必填信息",

            type: "warning"
          });

          return;
        }
        this.checkedDevice = [];
        this.dataInfo.dataList.forEach(item => {
          this.checkedDevice = this.checkedDevice.concat(item.deviceLubesLubs);
        });
        this.chooseDeviceAndLupDialog = true;

        // this.queryDeviceParams.deviceName = "";

        // this.selectionDevice = [];

        // this.getDeviceByPage();

        // this.dialogFormVisible = true;

        // if (this.$refs.tableAddLumData) {
        //   this.$refs.tableAddLumData.clearSelection();
        // }
      } else {
        this.dataInfo.dataList[this.currentActiveDevice].isEditFinish = false;
      }
    },

    // 前往创建设备

    handleCreateDevice() {
      let routeUrl = this.$router.resolve({
        path: "/EquipmentProfile/AddEquipmentProfile",

        query: {
          customerNumber: this.$route.query.companyNumber,

          companyId: this.$route.query.companyId
        }
      });

      window.open(routeUrl.href, "_blank");
    },

    // 前往编辑润滑点
    async handleEditLub(deviceNumber, lubricationPointNumber) {
      this.selectLubricationPointNumber = lubricationPointNumber;
      let res = await this.requestMethodGet("/web/device/queryDevice", { deviceNumber });
      if (res.data.code == 1000) {
        const data = res.data.data;
        data.createTime = this.moment(new Date(data.createTime)).format("YYYY-MM-DD");
        const date = new Date().getTime();
        if (Math.floor((date - data.createTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.creatNew = true;
        }
        if (Math.floor((date - data.updateTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.editNew = true;
        }
        this.epInfo = data;
      }
      this.addDeviceDialog = true;
      // let routeUrl = this.$router.resolve({
      //   path: "/EquipmentProfile/EditEquipmentProfile",

      //   query: {
      //     deviceNumber: deviceNumber
      //   }
      // });

      // window.open(routeUrl.href, "_blank");
    },
    getDeviceByPage(val) {
      if (val == "refresh") {
        this.queryDeviceParams.deviceName = "";
      }

      this.currentDevicePage = 1;

      this.queryDeviceByPage();
    },

    rowKey(row) {
      return row.deviceNumber;
    },

    // 选择设备

    handleSelectChange(selection) {
      this.selectionDevice = selection;
    },

    loadData() {
      if (!this.loadingLum && this.deviceList.length < this.deviceTotalCount) {
        ++this.currentDevicePage;

        this.queryDeviceByPage("scroll");
      }
    },

    // 根据客户查询设备列表

    queryDeviceByPage(val) {
      this.loadingLum = true;

      let excludeDeviceNumbers = this.dataInfo.dataList.map(item => {
        return item.deviceNumber;
      });

      let params = {
        customerNumber: this.$route.query.companyNumber,

        deviceName: this.queryDeviceParams.deviceName,

        excludeDeviceNumber: excludeDeviceNumbers.join(),

        current: 1,

        size: 20
      };

      if (val == "scroll") {
        params.current = this.currentDevicePage;
      } else {
        this.deviceList = [];
      }

      this.requestMethodGet("/weChat/device/queryDeviceByPage", params)

        .then(res => {
          this.loadingLum = false;

          res = res.data;

          if (res.code == 1000) {
            this.deviceList = [...this.deviceList, ...res.data.list];

            this.deviceTotalCount = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,

              type: "warning"
            });
          }
        })

        .catch(res => {
          this.loadingLum = false;
        });
    },

    // 删除

    handleDelete(row) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",

        cancelButtonText: "取消",

        customClass: "deletBtn",

        type: "warning"
      })

        .then(() => {
          let params = {
            operIds: row.operId
          };

          this.requestMethodPost(
            "/web/system/operate/operateLog/delete",

            params,

            true
          )

            .then(res => {
              res = res.data;

              if (res.code == 1000) {
                this.$message({
                  message: "删除成功",

                  type: "success"
                });

                this.$_queryAccountList();
              } else {
                this.$message({
                  message: res.msg,

                  type: "warning"
                });
              }
            })

            .catch(res => {
              this.loading = false;
            });
        })

        .catch(err => {
          console.log(err);
        });
    },

    // 查询润滑点列表

    $_getLubricatePointData(deviceNumber, index, row) {
      let params = {
        deviceNumber
      };

      this.requestMethodGet(
        "/web/lubricationPoint/queryLubricationPointList",

        params
      )

        .then(res => {
          res = res.data;
          this.refreshLoading = false;

          if (res.code == 1000) {
            let deviceLubesLubs = this.dataInfo.dataList[index].deviceLubesLubs;
            let lubricationPointIds = [];
            let lubricationPointList = [];
            deviceLubesLubs.forEach(item => {
              lubricationPointIds.push(item.id);
            });
            res.data.forEach(item => {
              if (lubricationPointIds.includes(item.id)) lubricationPointList.push(item);
            });
            this.$set(this.dataInfo.dataList[index], "lubricationPointList", lubricationPointList);
            this.$set(this.dataInfo.dataList[index], "deviceTypeName", lubricationPointList[0].deviceTypeName);
            if (row == undefined) {
              this.setLubInfo();
            }
            if (row.id) {
              this.setLubInfo(row);
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

    lubricationPointChange(row, deviceItem) {
      this.setLubInfo(deviceItem.lubricationPointList, row);
    },

    setLubInfo(list, row) {
      if (row == undefined) {
        this.dataInfo.dataList[this.currentActiveDevice].lubricationPointList.forEach(item => {
          this.dataInfo.dataList[this.currentActiveDevice].deviceLubesLubs.forEach(async it => {
            if (it.id == item.id) {
              // it.currentOilName = item.currentOilName;
              it.currentOilCode = item.currentOilCode;
              if (item.currentOilCode) {
                let currentOilName = await this.getOilNameByOilCode(item.currentOilCode);
                this.$set(it, "currentOilName", currentOilName);
              }
              it.oilBrandName = item.oilBrandName;
              it.odi = item.oilChangePeriod;
              switch (item.oilChangePeriodUnit) {
                case "D":
                  it.odiUnit = "天";
                  break;
                case "Y":
                  it.odiUnit = "年";
                  break;
                case "M":
                  it.odiUnit = "月";
                  break;
                case "H":
                  it.odiUnit = "小时";
                  break;
                case "KM":
                  it.odiUnit = "公里";
                  break;
              }

              it.oilTankVol = item.oilBoxCapacity;

              it.oilBoxCapacityUnit = item.oilBoxCapacityUnit;
              this.comparativeData(it);
            }
          });
        });
      }
      if (list && list.length > 0) {
        list.forEach(async item => {
          if (row.id == item.id) {
            row.odi = item.oilChangePeriod;
            switch (item.oilChangePeriodUnit) {
              case "D":
                row.odiUnit = "天";
                break;
              case "Y":
                row.odiUnit = "年";
                break;
              case "M":
                row.odiUnit = "月";
                break;
              case "H":
                row.odiUnit = "小时";
                break;
              case "KM":
                row.odiUnit = "公里";
                break;
            }

            row.oilTankVol = item.oilBoxCapacity;

            row.oilBoxCapacityUnit = item.oilBoxCapacityUnit;

            row.currentOilCode = item.currentOilCode;

            // row.currentOilName = item.currentOilName;
            if (item.currentOilCode) {
              let currentOilName = await this.getOilNameByOilCode(item.currentOilCode);
              this.$set(row, "currentOilName", currentOilName);
            }
            row.oilBrandCode = item.oilBrandCode;

            row.oilBrandName = item.oilBrandName;
            this.comparativeData(row);
          }
        });
      }
    },
    // 判断产品编号所选和润滑点在用油品名称是否一致
    comparativeData(row) {
      let index;
      this.dataInfo.dataList[this.currentActiveDevice].deviceLubesLubs.forEach((item, index1) => {
        if (item.id == row.id) {
          index = index1;
        }
      });
      this.requestMethodGet("/mdm/oil/getOilProductDropDownListByPage", { globalId: row.productNumber, size: 200, oilNumber: row.currentOilCode })
        .then(res => {
          if (res.data.code == 1000) {
            this.$set(row, "localProductNameCh", res.data.data.list[0].localProductNameCh);
            if (res.data.data.list[0].spuCode != res.data.data.list[0].localProductNameCode || !res.data.data.list[0].spuCode) {
              this.$set(row, "diffOilName", true);
              this.dataInfo.dataList[this.currentActiveDevice].deviceLubesLubs[index].diffOilName = true;
              ++this.keyNumber;
              this.dataInfo.dataList[this.currentActiveDevice].deviceLubesLubs = [...this.dataInfo.dataList[this.currentActiveDevice].deviceLubesLubs];
            }
            if (res.data.data.list[0].spuCode == res.data.data.list[0].localProductNameCode) {
              // this.$set(row,'diffOilName',false)
              this.dataInfo.dataList[this.currentActiveDevice].deviceLubesLubs[index].diffOilName = false;
              ++this.keyNumber;
              this.dataInfo.dataList[this.currentActiveDevice].deviceLubesLubs = [...this.dataInfo.dataList[this.currentActiveDevice].deviceLubesLubs];
            }
          }
        })
        .catch(res => {});
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children || data[i].children.length == 0) {
          data[i].children = null;
        } else {
          this.formatData(data[i].children);
        }
      }

      return data;
    },

    // 一键计算申请

    calcApply(row, deviceCount) {
      if ((row.flushingVol && isNaN(row.flushingVol)) || (row.serviceFillVol && isNaN(row.serviceFillVol)) || isNaN(row.oilPackage)) {
        this.$message({
          message: "设备数量/冲洗量/添加量/油品包装只能为数字",

          type: "warning"
        });

        return;
      }

      let params = {
        deviceCount: deviceCount,

        oilTankVol: row.oilTankVol,

        flushingVol: row.flushingVol,

        serviceFillVol: row.serviceFillVol,

        odi: row.odi,

        oilPackage: row.oilPackage,

        oilBoxCapacityUnit: row.oilBoxCapacityUnit,

        changeOver: row.changeOver
      };
      if (!params.oilTankVol)
        return this.$message({
          message: "请完善润滑点信息",
          type: "warning"
        });

      this.requestMethodPost("/device/lubes/calcApply", params)

        .then(res => {
          res = res.data;

          if (res.code == 1000) {
            row.yearOilVol = res.data.yearOilVol;
            this.$gio.clickGenerateApplyVolume();
          } else {
            this.$message({
              message: res.msg,

              type: "warning"
            });
          }
        })

        .catch(res => {
          this.loading = false;
        });
    },

    addDevice() {
      this.selectionDevice.forEach(item => {
        this.dataInfo.dataList.push({
          deviceName: item.deviceName,

          deviceTypeName: item.deviceTypeName,

          deviceNumber: item.deviceNumber,

          deviceCount: "",

          isEditFinish: false,

          deviceId: item.id,

          deviceLubesLubs: [
            {
              changeOver: "",

              flushingVol: "",

              id: "",

              odi: "",
              odiUnit: "",
              oilNumber: "",

              oilPackage: "",

              productNumber: "",

              oilBrandName: "",
              currentOilName: "",

              oilTankVol: "",

              serviceFillVol: "",

              yearOilVol: "",

              oilBoxCapacityUnit: "L"
            }
          ]
        });
      });

      this.selectionDevice.forEach((res, index) => {
        this.$_getLubricatePointData(
          res.deviceNumber,

          this.dataInfo.dataList.length - this.selectionDevice.length + index
        );
      });

      this.dialogFormVisible = false;
    },

    // 删除设备

    deleteDevice(index) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",

        cancelButtonText: "取消",

        customClass: "deletBtn",

        type: "warning"
      })

        .then(() => {
          this.dataInfo.dataList.splice(index, 1);

          if (this.currentActiveDevice == index) {
            this.$nextTick(() => {
              this.currentActiveDevice = 0;

              this.preLubriActiveIndex = this.currentLubricatepointActive = "0";
            });
          }

          if (this.currentActiveDevice > index) {
            this.$nextTick(() => {
              this.currentActiveDevice = this.currentActiveDevice - 1;
            });
          }
        })

        .catch(err => {});
    },

    // 删除润滑点

    deleteLubricationPoint(i, item) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",

        cancelButtonText: "取消",

        customClass: "deletBtn",

        type: "warning"
      })

        .then(() => {
          item.deviceLubesLubs.splice(i, 1);
          if (this.currentLubricatepointActive == i) {
            this.preLubriActiveIndex = this.currentLubricatepointActive = "0";
          }

          if (this.currentLubricatepointActive > i) {
            this.preLubriActiveIndex = this.currentLubricatepointActive = this.currentLubricatepointActive - 1 + "";
          }
        })

        .catch(err => {});
    },

    // 检验设备和润滑点必填项是否已填

    validateDeviceLub(formName, msg, index, val) {
      let validateFormS = this.$refs[formName];

      let flag = true;
      if (val == "eq" && formName == "dynamicValidateForm") {
        this.dataInfo.dataList[index].deviceLubesLubs.forEach(it => {
          if (it.oilNumber == "" || it.oilNumber == null) {
            flag = false;
          }
        });
      } else {
        if (formName == "dynamicValidateForm") {
          // this.dataInfo.dataList.forEach(item => {
          //   item.deviceLubesLubs.forEach(it => {
          //     if (it.oilNumber == "" || it.oilNumber == null) {
          //       flag = false;
          //     }
          //   });
          // });
        }
      }
      for (let form of validateFormS) {
        form.validate(valid => {
          if (!valid) {
            flag = false;
          }
        });

        if (!flag) {
          this.$message({
            message: msg,

            type: "warning"
          });

          break;
        }
      }

      return flag;
    },

    saveDeviceLubes(val) {
      this.$refs["defaultValidateForm"].validate(valid => {
        if (valid) {
          if (
            this.validateDeviceLub(
              "defaultDeviceValidateForm",

              "设备数量必填项未填"
            ) &&
            this.validateDeviceLub("dynamicValidateForm", "润滑点必填项未填")
          ) {
            this.dataInfo.dataList[this.currentActiveDevice].isEditFinish = true;

            let index = -1;

            for (let [i, item] of this.dataInfo.dataList.entries()) {
              if (!item.isEditFinish) {
                index = i + 1;

                break;
              }
            }

            if (index > -1) {
              this.$message({
                message: "请完善设备" + index + "必填信息",

                type: "warning"
              });

              return;
            }

            this.saveData(val);
            this.$gio.saveDraftOfLubricationTable({
              operation: "点击保存草稿按钮"
            });
          } else {
            this.dataInfo.dataList[this.currentActiveDevice].isEditFinish = false;
          }
        } else {
          this.$message({
            message: "基础信息必填项未填",

            type: "warning"
          });
        }
      });
    },

    saveData(val) {
      let deviceList = JSON.parse(JSON.stringify(this.dataInfo.dataList));

      let yearOilVolFlag = false;

      deviceList.forEach(item => {
        for (let res of item.deviceLubesLubs) {
          if (!res.yearOilVol && res.yearOilVol !== 0) {
            yearOilVolFlag = true;

            this.$message({
              message: "申请量未生成",

              type: "warning"
            });

            break;
          }
        }

        delete item.lubricationPointList;
      });

      if (yearOilVolFlag) {
        return;
      }

      this.$confirm(val == "submit" ? "确认提交?" : "确认保存?", "提示", {
        confirmButtonText: "确定",

        cancelButtonText: "取消",

        customClass: "deletBtn",

        type: "warning"
      })

        .then(() => {
          this.loading = true;

          let params = {
            customerId: this.$route.query.companyId,

            deviceLubesDevs: deviceList,

            endTime: this.defaultForm.endTime,

            priceApplyReason: this.defaultForm.priceApplyReason,

            startTime: this.defaultForm.startTime,

            customerSubaccount: this.defaultForm.customerSubaccount
          };

          let url = "/device/lubes/addDeviceLubes";

          if (this.$route.query.id) {
            url = "/device/lubes/editDeviceLubes";
            params.deviceLubesDevs.forEach(item => {
              item.deviceId = item.deviceLubesLubs[0].deviceId;
              item.deviceLubesLubs.forEach(it => {
                it.lubricationId = it.lubricationId;
              });
            });
            params.id = this.$route.query.id;
          } else {
            params.deviceLubesDevs.forEach(item => {
              item.deviceId = item.deviceLubesLubs[0].deviceId;
              item.deviceLubesLubs.forEach(it => {
                it.lubricationId = it.id;
              });
            });
          }

          this.requestMethodPost(url, params)

            .then(res => {
              res = res.data;

              if (res.code == 1000) {
                if (val == "submit") {
                  this.submitDeviceLubes(this.$route.query.id ? this.$route.query.id : res.data);
                  this.$gio.submitLubricationTable();
                } else {
                  this.loading = false;

                  this.$message({
                    message: "保存成功",
                    type: "success"
                  });

                  this.$router.back();
                }
              } else {
                this.loading = false;

                this.$message({
                  message: res.msg,

                  type: "warning"
                });
              }
            })

            .catch(res => {
              this.loading = false;
            });
        })
        .catch(err => {
          this.$gio.cancelCreateOrEditLubricationTable({
            operation: "点击取消按钮"
          });
        });
    },

    submitDeviceLubes(id) {
      let params = {
        id: id
      };
      const formData = new FormData();
      formData.append("id", id);
      this.requestMethodPost("/device/lubes/submitFlow", formData)
        .then(res => {
          res = res.data;
          this.loading = false;
          if (res.code == 1000) {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.$router.back();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })

        .catch(res => {
          this.loading = false;
        });
    },

    cancelDeviceLubes() {
      this.$confirm("确认取消?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          this.$router.back();
        })

        .catch(err => {});
    },

    previewPDF() {
      if (this.pdfUrl) {
        window.open(this.pdfUrl);
      } else {
        this.$message({
          message: "特价申请设备润滑表正在生成中，请稍后再试。",
          type: "warning"
        });
      }
    },

    radioChange() {
      this.$refs.defaultValidateForm.clearValidate("radio");
    }
  }
};
</script>

<style lang="less" scoped>
.add-equipment-lubr {
  height: 100%;

  font-size: 13px;

  position: relative;

  .service-name-form {
    padding: 16px;

    background: #f9f9f9;

    border-radius: 6px;
  }

  .name-content {
    display: flex;

    align-items: center;
  }

  .title {
    font-size: 20px;

    font-weight: bold;

    color: #000;
  }

  .status {
    width: 60px;

    border-radius: 13px;

    background-color: #999;

    color: #fff;

    font-size: 12px;

    display: flex;

    align-items: center;

    justify-content: center;

    height: 26px;

    line-height: 26px;

    margin-left: 10px;
  }

  /deep/.el-form-item__label {
    margin-bottom: 10px;
  }

  .label {
    margin-right: 30px;

    margin-bottom: 0px;
  }

  /deep/.box-card .el-card__header {
    background: #f9f9f9;
  }

  /deep/.box-card .detail-btn:hover {
    color: #001450 !important;
  }

  /deep/.device-card .el-card__body {
    padding: 0;
  }

  /deep/.radio-read .el-radio__label {
    padding-left: 4px;
  }

  .email-info {
    height: 48px;

    line-height: 48px;

    color: #000;

    font-size: 14px;

    padding-left: 20px;

    margin-bottom: 20px;

    font-weight: bold;

    border-radius: 4px;

    border: 1px solid #ccddff;

    background: #ebf1ff;
  }

  .customer-info {
    height: 40px;

    line-height: 40px;

    color: #dd0000;

    font-size: 13px;

    padding-left: 20px;

    margin-bottom: 20px;

    border-radius: 4px;

    background: rgba(221, 0, 0, 0.05);
  }

  .lub-box {
    background: #f9f9f9;

    padding: 20px;

    margin-bottom: 20px;
  }
}

.select-device {
  /deep/.el-dialog__title {
    font-size: 16px;
  }

  /deep/.el-dialog__body {
    font-size: 14px;

    padding: 10px 20px 40px !important;
  }
}

.manage-title {
  /deep/ .el-dialog__header {
    text-align: center;
  }
}

.device-item {
  cursor: pointer;

  display: flex;

  justify-content: space-between;

  align-items: center;
}

.active-device {
  background: rgb(249, 249, 249);
}

.el-icon-delete {
  font-size: 18px;

  color: #999;

  &:hover {
    color: #dd0000;
  }
}

.look-process {
  .title {
    font-weight: bold;

    color: #000;
  }

  .content {
    margin-top: 8px;

    font-size: 12px;

    color: #999;
  }

  .el-timeline-item__node--large {
    width: 20px;

    height: 20px;

    left: -5px;

    top: -3px;
  }
}

// .equipment-management .el-form--label-top .el-form-item__label {

//   padding: 0 !important;

// }

.deletBtn .el-button--primary {
  background-color: #fe000c !important;

  border-color: #fe000c !important;
}

.deletBtn .el-message-box__container {
  position: relative;
}

.deletBtn .el-icon-warning {
  color: #fe000c !important;

  /* top: 1px !important; */
}

/deep/.el-tabs__item:focus.is-active.is-focus:not(:active) {
  -webkit-box-shadow: none;

  box-shadow: none;
}
</style>
<style>
.form-icon .el-icon-arrow-down {
  opacity: 0 !important;
}
.el-autocomplete-suggestion li {
  overflow: visible !important;
}
</style>
