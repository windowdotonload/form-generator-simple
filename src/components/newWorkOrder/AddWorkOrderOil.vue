<template>
  <div style="position: relative; width: 100%">
    <div class="add-customer-profile" :style="mainminheight">
      <el-form :model="applylist" :rules="rules" ref="applylist" label-width="100px" label-position="top" class="add-dealer-profile-applylist">
        <div class="add-customer-profile-header" style="background: #ebf1ff; border: 1px solid #ccddff">
          <span style="margin-left: 20px"
            >当前服务：<span style="color: #dd0000">{{ typeName }}</span></span
          >
        </div>
        <!-- 服务信息 -->
        <div class="add-customer-profile-wrap">
          <div class="add-customer-profile-header">
            <div style="border-left: 4px solid #dd0000; padding-left: 10px; margin-left: 20px">服务信息</div>
          </div>
          <div style="padding: 10px 80px 30px">
            <el-row :gutter="24" style="margin-top: 10px">
              <el-col :span="12">
                <el-form-item label="取样日期" prop="expectComingTime">
                  <el-date-picker
                    v-model="applylist.expectComingTime"
                    type="date"
                    :picker-options="pickerBeginDateBefore"
                    size="small"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="userInfo.userType != '2' && (distributiveBtn || executeBtn)">
                <el-form-item label="执行人" prop="executePersonName">
                  <el-input
                    placeholder="--请选择--"
                    suffix-icon="el-icon-arrow-down"
                    style="width:100%;"
                    size="small"
                    readonly
                    :disabled="!distributiveBtn || pesDisabled || serviceApplyOrderId != ''"
                    @click.native="handleDistributive"
                    v-model="applylist.executePersonName"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="客户名称" prop="companyNumber">
                  <el-select
                    size="small"
                    :disabled="pesDisabled || serviceApplyOrderId != '' || userInfo.userType == 2"
                    clearable
                    filterable
                    v-model="applylist.companyNumber"
                    @change="handleChangeCustomer"
                    placeholder="--请选择--"
                    style="width: 100%"
                  >
                    <el-option v-for="item in customerList" :key="item.companyNumber" :label="item.companyName" :value="item.companyNumber"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经销商" prop="spId" v-show="SPList.length > 1">
                  <div class="selectFollow">
                    <el-select
                      size="small"
                      popper-class="myCascader"
                      :popper-append-to-body="false"
                      clearable
                      filterable
                      v-model="applylist.spId"
                      placeholder="请选择"
                      style="width: 100%"
                      :disabled="pesDisabled"
                    >
                      <el-option v-for="item in SPList" :key="item.spId" :label="item.spName" :value="item.spId" />
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 服务创盈 -->
        <!-- <serviceIncome v-if="userInfo.userType<2" :applylist="applylist" :componentType="serviceIncomeComponentType"/> -->
        <!-- 润滑点信息 -->
        <div class="add-customer-profile-wrap">
          <div class="add-customer-profile-header">
            <div style="border-left: 4px solid #dd0000; padding-left: 10px; margin-left: 20px">润滑点信息</div>
          </div>
          <div style="padding: 24px 20px 30px">
            <el-alert title="请准确填写油样瓶ID，请在申请得到确认后再寄送油样瓶，并确保油样正确装瓶。" type="warning" :closable="false" show-icon> </el-alert>
            <el-row :gutter="24" style="margin-top: 10px; padding: 0 60px 0">
              <el-col :span="12">
                <el-form-item label="油样瓶ID" prop="bottleId">
                  <span slot="label">
                    <span class="span-box">
                      <span>油样瓶ID</span>
                      <el-tooltip style="diaplay: inline" effect="dark" placement="top">
                        <div slot="content" style="line-height: 16px">
                          提示：请联系您的销售代表获取油样瓶<br />公司：埃克森美孚（中国）投资有限公司<br />地址：上海市徐家汇天钥桥路30号美罗大厦17楼1<br />电话：021-34116022
                        </div>
                        <i class="el-icon-warning" />
                      </el-tooltip>
                    </span>
                  </span>
                  <el-input v-model="applylist.bottleId" style="width: 100%" maxlength="10" size="small" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="润滑点" prop="lubricationPointTypeName" :error="notice ? '请确认润滑点信息' : ''" :rules="[{ required: true, message: '请选择润滑点', trigger: 'change' }]">
                  <el-input
                    placeholder="--请选择--"
                    suffix-icon="el-icon-arrow-down"
                    style="width: 100%"
                    size="small"
                    readonly
                    @click.native="addLubricationPoints"
                    v-model="applylist.lubricationPointTypeName"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 换油信息 -->
        <div class="add-customer-profile-wrap">
          <div class="add-customer-profile-header">
            <div style="border-left: 4px solid #dd0000; padding-left: 10px; margin-left: 20px">换油信息</div>
          </div>
          <div style="padding: 10px 80px 30px">
            <el-row :gutter="24" style="margin-top: 10px">
              <el-col :span="12">
                <el-form-item label="上次用油日期" prop="lastOilChangeDate" :rules="{ required: true, message: '请选择上次用油日期' }">
                  <el-date-picker
                    v-model="applylist.lastOilChangeDate"
                    type="date"
                    :picker-options="pickerBeginDateBefore"
                    size="small"
                    style="width: 100%"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="select-input">
                <el-form-item>
                  <el-col :span="14" style="padding: 0">
                    <el-form-item label="油品使用时间" prop="oilAgeNumInput">
                      <el-input placeholder="请输入内容" maxlength="8" v-model="applylist.oilAgeNumInput" size="small" class="input-with-select"> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="单位" prop="oilUserTimeUnitCode">
                      <el-select size="small" clearable filterable v-model="applylist.oilUserTimeUnitCode" placeholder="--请选择--" style="width: 100%" @change="oilUseTimeUnitCodeChange()">
                        <el-option v-for="item in oilAgeNumList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="select-input">
                <el-form-item>
                  <el-col :span="14" style="padding: 0">
                    <el-form-item label="设备使用时间" prop="deviceAgeNumInput">
                      <el-input placeholder="请输入内容" maxlength="8" v-model="applylist.deviceAgeNumInput" size="small" class="input-with-select"> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="单位" prop="deviceUseTimeUnitCode">
                      <el-select size="small" clearable filterable v-model="applylist.deviceUseTimeUnitCode" placeholder="--请选择--" style="width: 100%" @change="deviceUseTimeUnitCodeChange()">
                        <el-option v-for="item in oilAgeNumList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="select-input">
                <el-form-item>
                  <el-col :span="14" style="padding: 0">
                    <el-form-item label="补油量" prop="repairNumber">
                      <el-input placeholder="请输入内容" maxlength="6" v-model="applylist.repairNumber" size="small" class="input-with-select"> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="单位" prop="repairOilUnitName">
                      <el-select size="small" clearable filterable v-model="applylist.repairOilUnitName" placeholder="--请选择--" style="width: 100%" @change="repairOilUnitNameChange()">
                        <el-option v-for="item in repairUnitList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="油品是否更换" prop="oilChangeCode" :rules="{ required: true, message: '请选择油品是否更换' }">
                  <el-select size="small" clearable filterable v-model="applylist.oilChangeCode" placeholder="--请选择--" style="width: 100%">
                    <el-option v-for="item in oilChangeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="select-input">
                <el-form-item>
                  <el-col :span="14" style="padding: 0">
                    <el-form-item label="油箱温度" prop="tankTempNumInput">
                      <el-input placeholder="请输入内容" maxlength="3" v-model="applylist.tankTempNumInput" size="small" class="input-with-select"> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="单位" prop="tempUnitCode">
                      <el-select size="small" clearable filterable v-model="applylist.tempUnitCode" placeholder="--请选择--" style="width: 100%" @change="tempUnitCodeChange()">
                        <el-option v-for="item in tempUnitList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="滤芯是否更换" prop="filterChangeCode" :rules="{ required: true, message: '请选择滤芯是否更换' }">
                  <el-select size="small" clearable filterable v-model="applylist.filterChangeCode" placeholder="--请选择--" style="width: 100%">
                    <el-option v-for="item in filterChangeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 备注 -->
        <div class="add-customer-profile-wrap" style="padding-bottom: 40px; padding-top: 10px">
          <div class="add-customer-profile-header">
            <div style="border-left: 4px solid #dd0000; padding-left: 10px; margin-left: 20px">备注</div>
          </div>
          <div style="padding: 10px 80px 0px">
            <el-row :gutter="24" style="margin-top: 10px">
              <el-col :span="24">
                <el-form-item label="简介" prop="shortDesc">
                  <el-input type="textarea" :rows="1" resize="none" class="font-family" placeholder="请输入内容" style="width: 100%" maxlength="25" v-model="applylist.shortDesc"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="24">
                <p class="add-customer-profile-title">上传图片</p>
                <el-upload
                  :class="{ hide: hideUpload || imageList.length >= 3 }"
                  :action="uploadUrl"
                  list-type="picture-card"
                  limit="3"
                  :file-list="imageList"
                  accept="image/*"
                  :auto-upload="false"
                  :on-change="handleAddFile"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <div class="add-customer-profile-title" style="margin-top: 8px">最多上传3张，10M以内 .jpg .png .gif .svg 格式的图片</div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <div v-if="userInfo.userType != '2' || (userInfo.distributorCompanyType == 1 && userInfo.userType == '2')" style="height: 40px; display: flex; align-items: center; margin-top: 10px">
        <el-checkbox v-model="checked" style="margin-right: 10px" @change="changeChecked"></el-checkbox>
        <div><span style="color: #fe000c">*</span> 我已同意条款，<span @click="seenNotice" style="color: #fe000c; text-decoration: underline; cursor: pointer">查看条款明细</span></div>
      </div>
      <div slot="footer" style="width: 130px; margin: 20px auto">
        <el-button size="small" @click="handleResetFrom('applylist')">取消</el-button>
        <el-button type="danger" @click="handleSubmitForm('applylist')" size="small">提交</el-button>
      </div>
    </div>
    <el-dialog title="选择执行人" ref="executePersonDialog" :visible.sync="executePersonNameVisiable" width="40%" class="create-task radio-table">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
        <el-input size="small" v-model="userOrRoleName" placeholder="请输入关键词" suffix-icon="el-icon-search" style="width: 30%" maxlength="50" @change="searchRoleTableData" clearable></el-input>
      </div>
      <div>
        <el-table
          ref="multipleTableAdd"
          :data="engineerInfoList"
          v-el-table-infinite-scroll="loadMore"
          tooltip-effect="dark"
          @current-change="handleDistributionnChange"
          style="height: 360px; overflow-y: auto"
        >
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio v-model="applylist.executePersonNumber" :label="scope.row.userNumber"><i></i></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="userName" min-width="20%" label="姓名"> </el-table-column>
          <el-table-column prop="roleName" min-width="18%" label="角色">
            <template width="90" slot-scope="scope">
              <div v-for="(item, index) in scope.row.roleDtoList" :key="index">{{ item.roleName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="numCount" min-width="10%" label="工单数量"> </el-table-column>
          <el-table-column prop="count" min-width="10%" label="进行中工单"> </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button type="danger" plain @click="handleReset()" size="small">取消</el-button>
        <el-button type="danger" @click="submitDistribution()" size="small">分配</el-button>
      </div>
    </el-dialog>
    <!-- 添加润滑点弹框 -->
    <el-dialog title="添加润滑点" :visible.sync="addLubricationPointsVisiable" :append-to-body="true" width="45%" class="create-task radio-table">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; margin-top: 10px">
        <el-input
          size="small"
          v-model="queryParams.lDOName"
          placeholder="请输入关键词"
          suffix-icon="el-icon-search"
          style="width: 30%"
          maxlength="50"
          @change="handleSearchTableData"
          clearable
        ></el-input>
      </div>
      <div>
        <el-table :data="lumDataCustomers" tooltip-effect="dark" ref="tableAddLum" v-loading="loadingLum" v-el-table-infinite-scroll="load" class="add-lum" @current-change="handleLumDataChange">
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio v-model="addLumdata" :label="scope.row"><i></i></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="serviceimg" min-width="20%" label="润滑点">
            <template width="90" slot-scope="scope">
              <div style="display: flex; align-items: center">
                <img style="width: 64px; height: 64px; border: none; margin-right: 12px" :src="scope.row.lubricationPointPicPath ? scope.row.lubricationPointPicPath : defaultIcon" />
                <span
                  >{{ scope.row.lubricationPointTypeName }} <span v-if="scope.row.lubricationPointName"> - {{ scope.row.lubricationPointName }}</span></span
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="deviceName" min-width="18%" label="设备名称"> </el-table-column>
          <el-table-column prop="nowOilName" min-width="10%" label="润滑油">
            <template slot-scope="scope">
              {{ scope.row.nowOilName || "暂无" }}
            </template>
          </el-table-column>
          <el-table-column prop="lastChangeOilDate" min-width="10%" label="上次换油日期">
            <template slot-scope="scope">
              {{ scope.row.lastChangeOilDate || "暂无" }}
            </template>
          </el-table-column>
          <p v-if="loadMoreBon">加载中...</p>
          <p v-if="!loadMoreBon">没有更多了</p>
        </el-table>
      </div>
      <div slot="footer">
        <el-button type="danger" plain @click="handleResetAddLum()" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitAddLum()" size="small">下一步</el-button>
      </div>
    </el-dialog>
    <!-- 更新润滑点信息 -->
    <el-dialog title="更新润滑点信息" :visible.sync="updateLumVisisble" width="30%" class="create-task">
      <div style="padding: 20px 0" class="formClass">
        <div>
          <el-form :model="updateLumForm" :rules="updateRules" ref="updateLumForm" label-width="100px" label-position="top">
            <div style="font-family: MicrosoftYaHei; font-size: 14px; color: #000; line-height: 14px; border-left: 4px solid #dd0000; padding-left: 10px">基本信息</div>
            <el-row style="margin-top: 14px">
              <el-col :span="12" style="padding-right: 20px">
                <el-form-item label="润滑点设备类型" :error="errMsg" prop="lubricationPointTypeName">
                  <el-select size="small" clearable filterable v-model="updateLumForm.lubricationPointTypeName" @change="handleChangeLubTypeName" placeholder="--请选择--" style="width: 100%">
                    <el-option v-for="item in lumTypeData" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="padding-right: 20px">
                <el-form-item label="润滑点信息" prop="mslaUnitNumber">
                  <el-input maxlength="50" v-model="updateLumForm.mslaUnitNumber" size="small" style="width: 100%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="padding-right: 20px">
              <el-form-item prop="lubricationPointDesc" label="描述">
                <el-input
                  type="textarea"
                  placeholder="请填写描述信息"
                  v-model="updateLumForm.lubricationPointDesc"
                  maxlength="25"
                  resize="none"
                  style="width: 100%"
                  rows="2"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-row>
            <div style="font-family: MicrosoftYaHei; font-size: 14px; color: #000; line-height: 14px; border-left: 4px solid #dd0000; padding-left: 10px; margin-top: 12px">
              润滑点设备类型<i @click="dialogVisibleNotice = true" style="color: #999; margin-left: 4px" class="el-icon-warning" />
            </div>
            <el-row style="margin-top: 20px">
              <div v-for="(domain, i) in updateLumForm.attributes" :key="i">
                <el-col :span="12" style="padding-right: 20px">
                  <el-form-item :label="domain.fieldTitleCn" :prop="'attributes.' + i + '.listItemValue'" :rules="{ required: domain.fieldRequired, message: '请完善信息' }">
                    <el-select
                      v-el-select-loadmore="loadSelectMore"
                      v-model="domain.listItemValue"
                      size="small"
                      style="width: 100%"
                      @visible-change="changeManufacturer($event, domain.fieldId)"
                      @change="selectManufacturer(domain)"
                      filterable
                      remote
                      :remote-method="searchDomain"
                    >
                      <el-option v-for="(item, i) in dataList" :key="i" :label="item.listItemValueCn ? item.listItemValueCn : item.listItemValue" :value="item.listItemValue">
                        <div style="float: left">{{ item.listItemValueCn || "--" }}</div>
                        <div style="float: right">/ {{ item.listItemValue }}</div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="padding-right: 20px">
                  <el-form-item v-if="domain.child" :label="domain.child.fieldTitleCn" :prop="'attributes.' + i + '.child.listItemValue'" :rules="{ required: true, message: '请完善信息' }">
                    <el-input v-model="domain.child.listItemValue" style="width: 100%" size="small" placeholder="请输入内容"></el-input>
                  </el-form-item>
                </el-col>
              </div>
            </el-row>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button type="danger" plain @click="handleResetEdit('updateLumForm')" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitEdit('updateLumForm')" size="small">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="小贴士" :visible.sync="dialogVisibleNotice" width="24%" class="create-task-notice" :before-close="handleClose">
      <div style="font-family: MicrosoftYaHei; color: #000; line-height: 24px; font-size: 14px">
        <div>1.为什么我要选择以下信息？</div>
        <div style="color: #666; margin-top: 4px">油品实验室根据油品使用得环境和条件使检测更精确</div>
        <div style="margin-top: 10px">2.为什么我的设备没有对应的选项？</div>
        <div style="color: #666; margin-top: 4px">润滑点设备类型下的数据不相同，若已正确选择，请联系美孚扩充备选项。</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisibleNotice = false">我知道了</el-button>
      </span>
    </el-dialog>
    <el-dialog title="条款与条件" :visible.sync="dialogVisibleHint" width="30%" class="create-task" :before-close="handleClose">
      <div v-html="serviceClause" style="height: 300px; overflow: auto">{{ serviceClause }}</div>
      <div slot="footer" class="dialog-footer" style="margin-top: -30px">
        <el-button type="danger" @click="submitAddWorkorder" size="small">我已知晓</el-button>
      </div>
    </el-dialog>
    <el-dialog title="服务条款" :visible.sync="dialogCheckedVisible" width="30%" :before-close="handleClose">
      <span>我已阅读并同意条款</span><span @click="seenNotice" style="color: #fe000c; text-decoration: underline; cursor: pointer">查看条款明细</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckedVisible = false">取 消</el-button>
        <el-button type="danger" @click="confirmChecked" size="small">同 意</el-button>
      </span>
    </el-dialog>
    <!-- 提交信息预览 -->
    <el-dialog title="提交信息预览" :visible.sync="dialogVisiblePreview" width="40%" :before-close="handleClose">
      <div style="height:500px;padding-bottom:20px;overflow:auto;">
        <div class="preview_tips">温馨提示<span style="color:#ff9900;padding-left:8px;">以下内容提交后将无法进行修改，请确认填写内容是否正确。</span></div>
        <div class="preview_item">
          <div style="color:#000;margin-bottom:16px;">服务信息</div>
          <div class="title">
            服务类型<span class="content">{{ typeName || "--" }}</span>
          </div>
          <div class="title">
            客户名称<span class="content">{{ applylist.contactCompanyName || "--" }}</span>
          </div>
          <div class="title">
            备注<span class="content">{{ applylist.shortDesc || "--" }}</span>
          </div>
          <div class="title">照片<span class="content" v-if="imageList && imageList.length == 0">--</span></div>
          <div style="dispaly:flex;flex-wrap: wrap;">
            <el-image v-for="(img, index) in imageList" :key="index" style="width: 80px; height: 80px;margin:0px 10px 10px 0;border-radius:6px" :src="img.url"> </el-image>
          </div>
        </div>
        <!-- <div v-if="userInfo.userType<2" class="preview_item">
          <div style="color:#000;margin-bottom:16px;">创盈信息</div>
          <div class="title">服务属性<span class="content">{{servicePropertyStr ||'--'}}</span></div>
          <div class="title">预估收益<span class="content">{{incomeInfo}}</span></div>
        </div> -->
        <div class="preview_item">
          <div style="color:#000;margin-bottom:16px;">油样信息</div>
          <div class="title">
            取样日期<span class="content">{{ applylist.expectComingTime || "--" }}</span>
          </div>
          <div class="title">
            油样瓶ID<span class="content">{{ applylist.bottleId || "--" }}</span>
          </div>
        </div>
        <div class="preview_item">
          <div style="color:#000;margin-bottom:16px;">润滑点信息</div>
          <div class="title">
            润滑点<span class="content">{{ addLumdata.lubricationPointName || "--" }}</span>
          </div>
          <div class="title">
            润滑点信息<span class="content">{{ updateLumForm.mslaUnitNumber || "--" }}</span>
          </div>
          <div class="title">
            润滑点设备类型<span class="content">{{ updateLumForm.lubricationPointTypeName || "--" }}</span>
          </div>
          <div class="title">
            所属设备<span class="content">{{ addLumdata.deviceName || "--" }}</span>
          </div>
          <div class="title">
            描述<span class="content">{{ updateLumForm.lubricationPointDesc || "--" }}</span>
          </div>
          <div v-for="(domain, i) in updateLumForm.attributes" :key="i">
            <div style="display:flex;flex-direction:column;">
              <div class="title">
                {{ domain.fieldTitleCn
                }}<span class="content"
                  ><span v-if="domain.listItemValueCn && domain.listItemValueCn !== domain.listItemValue">{{ domain.listItemValueCn }}</span
                  ><span v-if="domain.listItemValue">（ {{ domain.listItemValue }}）</span></span
                >
              </div>
              <div class="title" v-if="domain.child">
                {{ domain.child.fieldTitleCn
                }}<span class="content"
                  ><span>{{ domain.child.listItemValue || "--" }}</span></span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="preview_item">
          <div style="color:#000;margin-bottom:16px;">换油信息</div>
          <div class="title">
            设备使用时间<span class="content">{{ applylist.deviceAgeNumInput || applylist.deviceUseTimeUnitName ? applylist.deviceAgeNumInput + applylist.deviceUseTimeUnitName : "--" }}</span>
          </div>
          <div class="title">
            上次用油日期<span class="content">{{ applylist.lastOilChangeDate || "--" }}</span>
          </div>
          <div class="title">
            油品使用时间<span class="content">{{ applylist.oilAgeNumInput || applylist.oilUserTimeUnitName ? applylist.oilAgeNumInput + applylist.oilUserTimeUnitName : "--" }}</span>
          </div>
          <div class="title">
            补油量<span class="content">{{ applylist.repairNumber || applylist.repairOilUnitLabel ? applylist.repairNumber + applylist.repairOilUnitLabel : "--" }}</span>
          </div>
          <div class="title">
            油箱温度<span class="content">{{ applylist.tankTempNumInput || applylist.tempUnitName ? applylist.tankTempNumInput + applylist.tempUnitName : "--" }}</span>
          </div>
          <div class="title">
            油品是否更换<span class="content">{{ applylist.oilChangeCode === "" ? "--" : applylist.oilChangeCode ? "是" : "否" }}</span>
          </div>
          <div class="title">
            滤芯是否更换<span class="content">{{ applylist.filterChangeCode === "" ? "--" : applylist.filterChangeCode ? "是" : "否" }}</span>
          </div>
        </div>
        <div style="margin-top:20px;display:flex;justify-content:flex-end;">
          <el-button type="danger" plain @click="dialogVisiblePreview = false" size="small">返回修改</el-button>
          <el-button type="danger" @click="submitRequest()" size="small">确认提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 选择润滑点 -->
    <lupDialogNew
      :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
      :singleFlag="false"
      :checkedDevice="checkedDevice"
      :urlType="urlType"
      :taskType="taskType"
      :companyName="oilSelectedCompanyName"
      :companyId="deviceCompanyId"
      :companyNumber="deviceCompanyNumber"
      :workshopId="applylist.workshopId"
      :spId="applylist.spId"
      :filterDeviceNew="true"
      v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
      v-on:confirmChooseLup="confirmChooseLup"
    >
    </lupDialogNew>
  </div>
</template>

<script>
import lupDialogNew from "../spotInspection/components/chooseLubricationPointNew.vue";
import Promote from "./mixins/addWorkorder.js";
import PromoteOil from "./mixins/oilWorkorder.js";
import serviceIncome from "@/components/newWorkOrder/components/serviceIncome";
export default {
  mixins: [Promote, PromoteOil],
  components: { lupDialogNew, serviceIncome },
  data() {
    return {
      SPList: [],
      dialogCheckedVisible: false,
      oilSelectedCompanyName: "",
      defaultIcon: require("../../assets/device_default.png"),
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      serviceIncomeComponentType: "",
      serviceLevel: "",
      serviceType: "",
      mslaServiceType: ""
    };
  },
  created() {
    if (this.$userInfo.userType == 2 || this.$userInfo.userType == 1) {
      this.getSpList(this.userInfo.orgInfo.companyId);
    }
    if (this.$route.query.openOrderType == "serviceApply") {
      this.getSpList(this.$route.query.companyId);
    }
    if (this.$route.query.enterFrom == "serviceApply" && this.$route.query.spId) {
      this.applylist.spId = this.$route.query.spId;
    }
  },
  async mounted() {
    this.checked = this.$route.query.isChecked == "true" ? true : false;
  },

  methods: {
    async getSpList(val) {
      if (this.$route.query.enterFrom == "serviceApply"||this.$route.query.openOrderType == "pesPlan") return;
      if (this.$userInfo.userType == 1) {
        return (this.applylist.spId = val);
      }
      this.SPList = [];
      if (!val) return (this.SPList = []);

      const res = await this.requestMethodGetTip("/web/company/getSpsOfAccount", {
        accountId: val
      });
      this.SPList = res.data.data;
      if (this.SPList.length == 1) return (this.applylist.spId = this.SPList[0].spId);
    }
  }
};
</script>
<style lang="less" scoped>
.preview_tips {
  display: flex;
  align-items: center;
  padding: 0px 16px;
  height: 36px;
  background: rgba(255, 153, 0, 0.1);
  border-radius: 4px;
  font-weight: 400;
  font-size: 13px;
  line-height: 13px;
  color: #999;
}
.preview_item {
  margin-top: 10px;
  padding: 16px 20px 0;
  background: #f9f9f9;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  font-weight: 400;
  font-size: 13px;
  line-height: 13px;
  margin-bottom: 16px;
  .title {
    color: #999;
    margin-bottom: 16px;
  }
  .content {
    padding-left: 10px;
    color: #333;
  }
}
.add-customer-profile {
  padding: 0 20%;
  height: 100%;
  overflow: auto;
  &-title {
    font-size: 14px;
    color: #999;
    span {
      color: #999;
      font-weight: normal;
      font-size: 12px;
    }
  }
  &-wrap {
    border: 1px solid #e9e9e9;
    margin-top: 20px;
    border-radius: 4px;
  }
  &-header {
    width: 100%;
    background: #f9f9f9;
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    padding: 17px 0px;
    height: 14px;
    line-height: 14px;
    border-bottom: 1px solid #e9e9e9;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 148px;
    height: 148px;
  }
  /deep/.el-upload--picture-card {
    line-height: 148px;
  }
  /deep/ .formClass {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  /deep/.input-with-select .el-input-group__append {
    background-color: #fff;
  }
  /deep/.input-with-select .el-select .el-input__inner:focus {
    border-color: none;
  }
  /deep/ .select-input {
    .el-select .el-input {
      width: 130px;
    }
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 148px;
    height: 148px;
  }
}
</style>
<style>
.add-customer-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.radio-table .el-table::before {
  height: 0px !important;
}
.create-task .el-dialog__body {
  padding: 10px 20px;
}
.create-task .el-dialog__title {
  font-size: 18px;
  color: #000;
  font-family: MicrosoftYaHei;
}
.add-customer-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.add-customer-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.add-customer-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.add-customer-profile .el-form-item__label {
  color: #999999;
  padding: 0;
}
.footer {
  padding: 20px 20px 0;
}

.hide .el-upload--picture-card {
  display: none;
}
.create-task .el-dialog__title,
.edit-workOrder .el-dialog__title {
  font-size: 18px !important;
}
.create-task .el-dialog__body,
.edit-workOrder .el-dialog__body {
  padding: 0 20px 40px !important;
}
.create-task-notice .el-dialog__body {
  padding: 0 20px 0px !important;
}
.el-icon-question {
  color: #333 !important;
  cursor: pointer;
}
</style>
