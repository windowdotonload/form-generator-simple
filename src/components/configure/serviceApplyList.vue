<template>
  <div style="position: relative">
    <div class="apply-order-component" id="applyDiv">
      <div class="toolbox-con flexBetween" id="formDiv">
        <div class="toolbox-con">
          <el-form :inline="true" size="small" :model="queryParams">
            <el-form-item>
              <el-button-group class="tab-wrap" v-model="queryParams.dataFlag">
                <el-button size="small" :type="item.value == queryParams.dataFlag ? 'danger' : ''" v-for="(item, index) in dataRangeList" :key="index" @click="changeLookMain(item)">
                  {{ item.label }}
                </el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item label="所属客户" v-if="userInfo.userType != 2" class="form-item-outline">
              <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length > 0 ? 'color:#606266;' : ''">
                {{ selectCustomerList.length > 0 ? "指定客户" + selectCustomerList.length : "请选择" }}
                <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length > 0" @click.stop="handleClearCustomer"></i>
              </div>
            </el-form-item>
            <el-form-item class="form-item-outline" label="回退情况">
              <el-select
                :style="{ width: queryParams.revertType.length == 0 ? '150px' : '200px' }"
                size="small"
                v-model="queryParams.revertType"
                placeholder="请选择回退情况"
                clearable
                filterable
                multiple
                collapse-tags
              >
                <el-option v-for="item in revertTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="form-item-outline" label="优秀案例">
              <el-select style="width:150px" size="small" v-model="queryParams.isGood" placeholder="请选择" clearable filterable>
                <el-option v-for="item in caseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="danger" plain @click="handleSearchTableData">搜索</el-button>
              <el-button size="small" @click="restSearchInfo">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="tool-con">
          <el-button type="danger" size="small" @click="handleAddWorkOrder" v-has="PC_WorkOrder_Create">创建申请单</el-button>
          <custom-field class="marLeft" @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="serviceApply"></custom-field>
        </div>
      </div>
      <custom-table
        :listEmptyType="listEmptyType"
        :limitFlag="limitFlag"
        :tableHeader="tableDataHeader"
        :tableData="woTableData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        @changeSortTable="changeSortTable"
        @changeSearch="tableTitleSearch"
      >
        <template v-slot:serviceApplyNo="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="申请单号"
            fixed="left"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="申请单号"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.serviceApplyNo }}</span>
                <div>
                  <el-button class="copy_text" type="text" style="padding: 0px">
                    <img src="../../assets/icon_case.png" v-if="scope.row.isGood && userInfo.userType < 2" alt="" style="width: 24px; height: 21px; position: relative; top: 3px; margin-left: 8px" />
                    <img
                      src="../../assets/icon-copy.png"
                      alt=""
                      v-clipboard:copy="scope.row.serviceApplyNo"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                      style="width: 16px; height: 16px; position: relative; top: 3px; cursor: pointer; margin-left: 8px"
                    />
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:customerCompanyName="slotProps">
          <el-table-column
            v-if="userInfo.userType != 2"
            label="客户"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.customerCompanyName }}</span>
                <span class="self-tips" v-if="scope.row.daFlag">直</span>
                <img v-if="scope.row.pesFlag == '1' || scope.row.pesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.pesFlag == '2' || scope.row.pesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:serviceApplyType="slotProps">
          <el-table-column
            label="创建类型"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="创建类型"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span class="workOrder-Status">{{ scope.row.serviceApplyType == 1 ? "自主下单" : scope.row.serviceApplyType == 2 ? "代客下单" : "自助下单" }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-slot:distributorCompanyName="slotProps">
          <el-table-column
            v-if="userInfo.userType == 0"
            label="经销商"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="经销商"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.distributorCompanyName || "-" }}</span>
                <img v-if="scope.row.assistSpFlag" src="../../assets/da_icon.png" alt="" style="width:24px;margin-left:8px;" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:serviceProperty="slotProps">
          <el-table-column
            label="服务创盈"
            v-if="userInfo.roleType != 2"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="服务创盈"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span class="workOrder-Status">{{ scope.row.servicePropertyStr }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-slot:income="slotProps">
          <el-table-column
            v-if="userInfo.roleType != 2"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="预估收益"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="预估收益"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span class="workOrder-Status">{{ scope.row.income }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-slot:serviceItemCount="slotProps">
          <el-table-column
            label="服务项数量"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.serviceItemCount }}
            </template>
          </el-table-column>
        </template>
        <template v-slot:applyUserName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="创建人"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="创建人"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                <div>
                  <div style="display: flex;align-items:center;">
                    <img :src="applyUserDetail.headUrl ? applyUserDetail.headUrl : require('../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                    <div style="flex: 1; margin-left: 10px">
                      <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ applyUserDetail.userName }}</div>
                    </div>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">电话: </span>
                    <span>{{ formatPhonenumber(applyUserDetail.phonenumber) }}</span>
                    <el-button
                      class="copy_tel"
                      style="padding: 0px"
                      type="text"
                      v-clipboard:copy="applyUserDetail.phonenumber"
                      v-clipboard:success="onCopyTel"
                      v-clipboard:error="onErrorTel"
                      v-if="applyUserDetail.phonenumber"
                    >
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">邮箱: </span>
                    <span>{{ formatEmail(applyUserDetail.email) }}</span>
                    <el-button
                      class="copy_mail"
                      type="text"
                      v-clipboard:copy="applyUserDetail.email"
                      v-clipboard:success="onCopyMail"
                      v-clipboard:error="onErrorMail"
                      style="padding: 0px"
                      v-if="applyUserDetail.email"
                    >
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                </div>
                <span
                  slot="reference"
                  :disabled="!scope.row.applyUserName"
                  class="copy_text"
                  type="text"
                  style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                  @click="applyUserNameDetail(scope)"
                  >{{ scope.row.applyUserName || "-" }}</span
                >
              </el-popover>
            </template>
          </el-table-column>
        </template>
        <template v-slot:serviceApplyStatus="slotProps">
          <el-table-column
            label="状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span class="workOrder-Status" :style="scope.row.serviceApplyStatus | filterStatus">{{ scope.row.serviceApplyStatus | applyStatus }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-slot:spName="slotProps">
          <el-table-column
            label="服务方"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="服务方"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.spName }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="70" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <span style="color: #001450; cursor: pointer" @click="handleLook(scope.row)">查看</span>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>

      <el-dialog
        class="closeWorkOrder"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="addWorkorderVisibled"
        title="创建申请单"
        top="100px"
        :show-close="false"
        width="50%"
        @close="closeServiceDialog"
      >
        <el-form :model="questionForm" :rules="serviceTypeRule" ref="questionForm" label-position="top" style="max-height: 500px;overflow-y: auto;">
          <el-row style="display:flex;flex-wrap:wrap">
            <div :span="12" style="width:50%" v-if="userInfo.userType != 2">
              <el-form-item label="客户" prop="customerId">
                <el-select
                  @clear="clearPeopleList"
                  size="small"
                  :filter-method="handleGetCompany"
                  clearable
                  class="dialog"
                  placeholder-style="color:#e2e2e2;"
                  style="width: 80%;"
                  filterable
                  v-model="questionForm.customerId"
                  @change="changeSelCUstome"
                >
                  <el-option
                    @click.native="changeCompany(item.companyNumber, item.companyId, item)"
                    v-for="item in companyList"
                    :key="item.companyId"
                    :label="item.companyName"
                    :value="item.companyId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div :span="12" v-if="SPList.length > 1" style="width:50%">
              <el-form-item label="经销商" prop="spId">
                <div class="selectFollow">
                  <el-select size="small" clearable filterable placeholder="请选择" style="width: 80%" v-model="questionForm.spId" popper-append-to-body @change="changeSelDisCompany">
                    <el-option v-for="item in SPList" :key="item.spId" :label="item.spName" :value="item.spId"> </el-option>
                  </el-select>
                </div>
              </el-form-item>
            </div>
            <div :span="12" v-if="userInfo.userType != 2 && (assignPermissionsFlag || executePermissionFlag)" style="width:50%">
              <el-form-item>
                <span slot="label"><span style="color:#F56C6C;margin-right:4px" v-if="assignPermissionsFlag">*</span>执行人</span>
                <!-- <el-form-item label="所属客户" v-if="userInfo.userType != 2" class="form-item-outline"> -->
                <div class="select_person form-item-outline" :style="selectCustomerList.length > 0 ? 'color:#606266;' : ''" @click="allocationUser">
                  <span v-if="userInfo.userType != 2 && showRoleNames"></span>
                  <span v-if="executeUserName">{{ executeUserName }}（{{ executeUserRoles }}）</span>
                  <span v-else>请选择</span>
                </div>
              </el-form-item>
            </div>
            <div :span="12" v-if="userInfo.userType < 2" style="width:50%">
              <el-form-item label="服务创盈" prop="serviceProperty">
                <span slot="label"><span style="color: #f56c6c; margin-right: 4px">*</span>服务创盈</span>
                <el-select size="small" clearable placeholder-style="color:#e2e2e2;" style="width: 80%;" filterable @change="servicePropertyChange" v-model="applylist.serviceProperty">
                  <el-option v-for="item in serviceIncomeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div :span="12" v-if="applylist.serviceProperty" style="width:50%">
              <el-form-item>
                <span slot="label"><span style="color: #f56c6c; margin-right: 4px">*</span>预估收益</span>
                <div :span="24" class="select-input" v-if="showIncomeBbl">
                  <div style="display: flex; align-items: center">
                    <el-input
                      placeholder="请输入收益数值"
                      clearable
                      maxlength="16"
                      v-model="applylist.incomeBbl"
                      size="small"
                      style="width:75%;margin-right: 10px;"
                      @keyup.native="validateIncome('incomeBbl')"
                      @blur="validateIncome('incomeBbl')"
                    ></el-input>
                    {{ incomeBblUnit }}
                  </div>
                </div>
                <div :span="24" class="select-input" v-if="showIncomeRmb">
                  <div style="display: flex; align-items: center">
                    <el-input
                      placeholder="请输入收益数值"
                      maxlength="16"
                      clearable
                      v-model="applylist.incomeRmb"
                      size="small"
                      style="width:75%;margin-right: 10px;"
                      @keyup.native="validateIncome('incomeRmb')"
                      @blur="validateIncome('incomeRmb')"
                    ></el-input>
                    {{ incomeRmbUnit }}
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-row>
          <div style="margin-bottom: 20px; font-size: 16px"><span style="color: #dd0000">*</span>{{ userInfo.userType < 2 ? "请选择客户需求或遇到的问题（请选择至少一项）" : "请选择您遇到的问题" }}</div>
          <div style="margin-bottom:20px;">
            <el-button-group class="tab-wrap" v-model="activeQuestion">
              <el-button size="small" style="margin:0 10px 10px 0;" :type="item.id == activeQuestion ? 'danger' : ''" v-for="(item, index) in questionList" :key="index" @click="changeQuestion(item)">
                {{ item.name }}
              </el-button>
            </el-button-group>
            <div v-if="checkboxList.length > 0" style="border: 1px solid #E9E9E9;padding: 10px 0;">
              <el-checkbox-group v-model="checkList" @change="changeCheck">
                <el-checkbox :label="res.id" v-for="res in checkboxList" :key="res.id">{{ res.name }}</el-checkbox>
              </el-checkbox-group>
              
              <div style="padding:10px 20px;" v-if="checkList.includes(2) && activeQuestion == '1'">
                <el-form-item label="详细描述" prop="description">
                  <el-input
                    placeholder="请填写具体的现象，100字以内。"
                    size="small"
                    type="textarea"
                    resize="none"
                    style="width: 100%"
                    :row="4"
                    v-model="questionForm.description"
                    maxlength="100"
                    show-word-limit
                  >
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </div>

          <UplaodSection ref="uploadVideoImg" />
        </el-form>
        <div slot="footer" style="margin-top: -20px">
          <el-button type="danger" plain @click="handleResetAdd('questionForm')" size="small">取消</el-button>
          <el-button type="danger" @click="sureAddWorkOrder('questionForm')" size="small">确定</el-button>
        </div>
      </el-dialog>
      <!-- 分配 -->
      <el-dialog title="分配人员" ref="executePersonDialog" :visible.sync="executePersonNameVisiable" width="40%" class="create-task radio-table">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
          <div style="font-family: MicrosoftYaHei-Bold; font-size: 16px; line-height: 14px; color: #000;display:flex;flex-wrap:nowrap;align-items:center">
            <span style="width: 8px; height: 8px; display: inline-block; border-radius: 50%; background: #dd0000; margin-right: 12px"></span>
            <div v-html="initTemplateContent(applyAllocationObj)" style="display:flex" @click="e => clickRoleType(e)"></div>
          </div>
          <el-input size="small" v-model="userOrRoleName" placeholder="请输入关键词" suffix-icon="el-icon-search" style="width: 30%" maxlength="50" @change="handleDistributive" clearable></el-input>
        </div>
        <div v-if="executePersonNameVisiable">
          <el-table
            ref="multipleTableAdd"
            :data="engineerInfoList"
            v-el-table-infinite-scroll="loadMore"
            tooltip-effect="dark"
            :row-key="getRowKey"
            v-loading="loadMoreData"
            height="400px"
            @current-change="handleDistributionnChange"
          >
            <el-table-column width="55" :reserve-selection="true">
              <template slot-scope="scope">
                <el-radio v-model="executeUserId" :label="scope.row.userId"><i></i></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="userName" min-width="20%" label="姓名"> </el-table-column>
            <el-table-column prop="roleNames" min-width="18%" label="角色"></el-table-column>
            <el-table-column prop="numCount" min-width="10%" label="工单数量">
              <template slot-scope="scope">
                {{ scope.row.numCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="count" min-width="10%" label="进行中工单">
              <template slot-scope="scope">
                {{ scope.row.count || 0 }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer">
          <el-button type="danger" plain @click="executePersonNameVisiable = false" size="small">取消</el-button>
          <el-button type="danger" @click="submitDistribution" size="small">分配</el-button>
        </div>
      </el-dialog>
      <customerListCom
        ref="selectCustomer"
        :selectCustomerList="selectCustomerList"
        :showCustomerDialog="showCustomerDialog"
        @handleSubmitCustomer="handleSubmitCustomer"
        @handleCloseCustomer="handleCloseCustomer"
      ></customerListCom>
    </div>
  </div>
</template>

<script>
import UplaodSection from "./components/uploadVideoImg.vue";
import DAModify from "../newWorkOrder/mixins/DAModify";
import customField from "../tableComponents/customField.vue";
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
import serviceIncome from "@/components/newWorkOrder/components/serviceIncome";
import listJs from "./applyMixins/list.js";
import commonJS from "../tableComponents/tableCommon.js";
import debounce from "lodash/debounce";
export default {
  mixins: [DAModify, listJs, commonJS],
  data() {
    return {
      SPList: [],
      applyDivHeight: document.documentElement.clientHeight - 184,
      formDivHeight: 0,
      showRoleNames: false,
      activeQuestion: "",
      checkboxList: [], // 选中的问题的children
      revertTypeList: [
        {
          label: "客户退回",
          value: 2
        },
        {
          label: "美孚/经销商撤回",
          value: 1
        },
        {
          label: "无撤回退回",
          value: 0
        }
      ],
      incomeBblUnit: "BBL",
      incomeRmbUnit: "RMB",
      showIncomeBbl: false,
      showIncomeRmb: false,
      selCompnyPeopleList: [],
      questionForm: {
        spId: "",
        description: "",
        contactUserId: []
      },
      oilTypeList: [],
      companyList: [], // 公司数据
      lubricationPointTypeList: [], // 润滑点设备类型
      selectQuestionList: [],
      applyTypeData: [],
      //  自定义属性
      industruPropsSelect: {
        value: "serviceNumber",
        label: "serviceName",
        children: "children"
      },
      serviceIncomeList: [
        {
          label: "维护现有生意",
          value: 1
        },
        {
          label: "油品升级",
          value: 2
        },
        {
          label: "竞品转换",
          value: 3
        },
        {
          label: "服务收费",
          value: 4
        },
        {
          label: "支持新项目生意",
          value: 5
        }
      ],
      //   表单验证规则
      serviceTypeRule: {
        spId: [{ required: true, message: "请选择经销商", trigger: "blur" }],
        customerId: [{ required: true, message: "请选择客户", trigger: "change" }],
        description: [{ required: true, message: "请输入详细描述", trigger: "change" }],
        contactUserId: [{ required: true, message: "请选择联系人", trigger: "blur" }]
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      addWorkorderVisibled: false, // 新建工单
      loadingInput: false,
      downLoadWorkorder: false, // 导出工单
      dialogTableVisible: false,
      list: [],
      headImg: require("../../assets/headImg.png"),
      queryParams: {
        dataFlag: 0,
        serviceApplyStatus: "", // 状态
        serviceApplyNo: "",
        customerName: "",
        serviceApplyType: "",
        distributorName: "",
        companyIds: "",
        applyStartTime: "",
        applyEndTime: "",
        questionDescId: "",
        revertType: [],
        orderBy: "createTime",
        descFlag: true,
        finishStartTime: "",
        finishEndTime: "",
        isGood: ""
      },
      applyTime: [],
      questionList: [], // 服务类型列表
      pickerOptions: {
        shortcuts: [
          {
            text: "选择今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      },
      woTableData: [], // 工单列表
      checkList: [], // 选中的问题
      loading: false, // 是否展示加载动画，默认隐藏
      totalNumber: 0, // 总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 30
      },
      statusNum: {
        totalNum: 0,
        beConfirmedNum: 0,
        onGoingNum: 0,
        ToEvaluateNum: 0,
        completedNum: 0,
        closedNum: 0
      },
      selectServiceNumber: "",
      typeName: "",
      // 分配
      executePersonNameVisiable: false,
      executeUserId: "",
      userOrRoleName: "",
      engineerInfoList: [],
      applyAllocationObj: {
        customerType: "",
        distributorCompanyName: ""
      },
      pageIndexDistributive: 1,
      checkedCustomer: {},
      loadMoreData: false,
      engineerTotal: 0,
      executeUserRoles: "",
      executeUserName: "",
      assignPermissionsFlag: false, //分配权限
      executePermissionFlag: false, //执行权限
      dataRangeList: [
        {
          label: "全部数据",
          value: 0
        },
        {
          label: "与我相关",
          value: 1
        }
      ],
      tableHeight: null,
      customFieldlistUnit: [
        {
          fieldName: "serviceApplyNo",
          visible: 2
        },
        {
          fieldName: "customerCompanyName",
          visible: 1
        },
        {
          fieldName: "serviceApplyType",
          visible: 1
        },
        {
          fieldName: "distributorCompanyName",
          visible: 1
        },
        {
          fieldName: "questionDesc",
          visible: 1
        },
        {
          fieldName: "serviceProperty",
          visible: 1
        },
        {
          fieldName: "income",
          visible: 1
        },
        {
          fieldName: "serviceItemCount",
          visible: 1
        },
        {
          fieldName: "applyTime",
          visible: 1
        },
        {
          fieldName: "finishTime",
          visible: 1
        },
        {
          fieldName: "applyUserName",
          visible: 1
        },
        {
          fieldName: "serviceApplyStatus",
          visible: 1
        },
        {
          fieldName: "operation",
          visible: 2
        }
      ],
      customFieldlist: [],
      tableDataHeaderInit: {
        serviceApplyNo: { filterType: "input", paramValue: "serviceApplyNo", changeValue: "", sortTypeVal: "sortDefault", label: "申请单号", slot: "serviceApplyNo", width: "200" },
        customerCompanyName: { label: "客户", slot: "customerCompanyName", width: "250" },
        spName: {
          filterType: "input", 
          paramValue: "spName", 
          changeValue: "",
          label: "服务方",
          slot: "spName",
          width: "200",
          tooltip: true
        },
        serviceApplyType: {
          filterType: "selection",
          paramValue: "serviceApplyType",
          selectMultiple: true,
          changeValue: "",
          selectOptions: [],
          label: "创建类型",
          slot: "serviceApplyType",
          width: "100"
        },
        distributorCompanyName: { filterType: "input", paramValue: "distributorName", changeValue: "", label: "经销商", slot: "distributorCompanyName", width: "200" },
        questionDesc: {
          filterType: "cascaderQue",
          paramValue: "questionDescId",
          selectOptions: [],
          selectMultiple: true,
          changeValue: "",
          label: "需求概述",
          prop: "questionDesc",
          width: "200",
          tooltip: true
        },
        serviceProperty: {
          filterType: "selection",
          paramValue: "serviceProperty",
          selectOptions: [
            { name: "维护现有生意", code: "1" },
            { name: "油品升级", code: "2" },
            { name: "竞品转换", code: "3" },
            { name: "服务收费", code: "4" },
            { name: "支持新项目生意", code: "5" }
          ],
          changeValue: "",
          label: "服务创盈",
          slot: "serviceProperty",
          width: "100"
        },
        income: { filterType: "input", paramValue: "income", changeValue: "", label: "预估收益", slot: "income", width: "100" },
        serviceItemCount: { label: "服务项数量", slot: "serviceItemCount", width: "100", tooltip: true },
        applyTime: { filterType: "dateRange", paramValue: "applyTime", changeValue: "", sortTypeVal: "sortDefault", label: "申请时间", prop: "applyTime", width: "150", tooltip: true },
        finishTime: { filterType: "dateRange", paramValue: "finishTime", changeValue: "", sortTypeVal: "sortDefault", label: "完成时间", prop: "finishTime", width: "150", tooltip: true },
        applyUserName: { filterType: "input", paramValue: "createUserName", changeValue: "", label: "创建人", slot: "applyUserName", width: "100", tooltip: true },
        serviceApplyStatus: {
          filterType: "selection",
          paramValue: "serviceApplyStatus",
          selectMultiple: true,
          selectOptions: [
            { name: "待确认", code: "0" },
            { name: "待处理", code: "1" },
            { name: "进行中", code: "2" },
            { name: "已完成", code: "3" },
            { name: "已取消", code: "4" },
            { name: "已评价", code: "5" }
          ],
          changeValue: "",
          label: "状态",
          slot: "serviceApplyStatus",
          width: "100"
        },
        operation: { label: "操作", slot: "operation" }
      },
      tableDataHeader: [],
      listEmptyType: "apply_list",
      limitFlag: false,
      selectCustomerList: [],
      showCustomerDialog: false,
      // 服务创造盈属性与服务收益
      applylist: {
        serviceProperty: "",
        incomeBbl: "",
        incomeRmb: ""
      },
      caseList: [
        {
          value: 1,
          label: "是"
        },
        {
          value: 0,
          label: "否"
        }
      ]
    };
  },
  components: {
    UplaodSection,
    serviceIncome,
    "custom-field": customField,
    "custom-table": customTable,
    "column-header": columnHeader,
    customerListCom: () => import("../tableComponents/customerList")
  },
  filters: {
    filterStatus(status) {
      switch (status) {
        case 0:
        case 1:
          return "color:#dd0000";
        case 2:
          return "color:#008888";
        default:
          return "color:#999";
      }
    },
    applyStatus(status) {
      switch (status) {
        case 0:
          return "待确认";
        case 1:
          return "待处理";
        case 2:
          return "进行中";
        case 3:
          return "已完成";
        case 5:
          return "已评价";
        default:
          return "已取消";
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.queryParams.current = this.pagenation.current;
    this.queryParams.size = this.pagenation.size;
    sessionStorage.setItem("queryParams", JSON.stringify(this.queryParams));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/ServiceApplyList/ServiceApplyDetail") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  created() {
    if (this.$userInfo.userType == 2) {
      this.selCompnyPeopleList.push(this.$userInfo);
      this.dataRangeList = [
        {
          label: "全部数据",
          value: 0
        }
      ];
      this.getSpList(this.$userInfo.orgInfo.companyId);
    }
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "service_order_execute_btn") {
        this.executePermissionFlag = true;
      }
      if (buttonList[i].menuCode == "service_order_distribution_btn") {
        this.assignPermissionsFlag = true;
      }
    }
  },
  mounted() {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
      if (!this.queryParams.revertType) {
        this.queryParams.revertType = [];
      }
      if (this.queryParams.companyIds) this.selectCustomerList = this.queryParams.companyIds.split(",");
      this.pagenation.current = this.queryParams.current;
      this.pagenation.size = this.queryParams.size;
    }
    this.getApplyReasonConfTree();
    this.$_queryApplyType();
    this.getQuesdescList();
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  methods: {
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        if (document.getElementById("formDiv")) {
          this.formDivHeight = document.getElementById("formDiv").clientHeight;
        }
        this.tableHeight = Number(this.applyDivHeight) - Number(this.formDivHeight);
      }, 200);
    },
    // 点击分配
    allocationUser() {
      if (!this.questionForm.customerId) {
        this.$message({
          message: "请选择客户",
          type: "warning"
        });
        return;
      }
      if (!this.questionForm.spId) {
        this.$message({
          message: "请选择经销商",
          type: "warning"
        });
        return;
      }
      this.$refs["questionForm"].validateField(["customerId", "spId"], (err, validateRes) => {
        console.log("validateRes", validateRes);
        if (!err) {
          // 更新删除联系人,执行人与联系人无关与所选客户有关
          this.executePersonNameVisiable = true;
          this.handleDistributive();
        }
      });
    },
    // 问题的切换
    changeQuestion(item) {
      // console.log(item)
      this.activeQuestion = item.id;
      this.checkboxList = item.children;
    },
    changeCheck(val) {
      console.log(val, this.questionList);
      this.questionList.forEach(item => {
        item.checkList = [];
        val.forEach(it => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(check => {
              if (it == check.id) {
                item.checkList.push(it);
                item.checkList = [...new Set(item.checkList)];
                this.$set(item, "checkList", item.checkList);
                this.$forceUpdate();
              }
            });
          }
        });
      });
    },
    servicePropertyChange(value) {
      this.applylist.serviceProperty = value || "";
      if (value) {
        if (value == 4) {
          // Rmb
          this.showIncomeBbl = false;
          this.showIncomeRmb = true;
          this.applylist.incomeBbl = "";
        } else {
          // bbl
          this.showIncomeBbl = true;
          this.showIncomeRmb = false;
          this.applylist.incomeRmb = "";
        }
      } else {
        this.showIncomeBbl = false;
        this.showIncomeRmb = false;
        this.applylist.incomeBbl = "";
        this.applylist.incomeRmb = "";
      }
    },
    validateIncome(type) {
      if (type == "incomeBbl") {
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.applylist.incomeBbl = this.applylist.incomeBbl
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      } else {
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.applylist.incomeRmb = this.applylist.incomeRmb
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
    },
    handlePermission() {
      if (this.executePermissionFlag && !this.assignPermissionsFlag) {
        this.executeUserName = this.$userInfo.userName;
        this.executeUserRoles = this.$userInfo.roleNames.join("/");
        this.executeUserId = this.$userInfo.userId;
        this.showRoleNames = true;
      }
    },
    // 分配工单
    handleDistributive: debounce(function(val, companyId) {
      if (this.$userInfo.userType == 2) return;
      if (val == "more") {
        this.pageIndexDistributive++;
      } else {
        this.pageIndexDistributive = 1;
        this.engineerInfoList = [];
      }
      this.loadMoreData = true;
      let param = {
        useStateFlag: 1,
        current: this.pageIndexDistributive,
        userOrRoleName: this.userOrRoleName,
        workOrderBelongCompanyId: this.checkedCustomer.companyId
      };
      param.userBelongType = this.active;
      if (this.$userInfo.userType == 1) {
        param.userBelongType = 2;
        param.distributorId = this.$userInfo.orgInfo.companyId;
      }
      if (this.active == 3) {
        param.contactPersonId = this.questionForm.contactUserId[0];
      }
      param.accountId = this.questionForm.customerId;
      if (this.$userInfo.userType == 2) param.accountId = this.$userInfo.orgInfo.companyId;
      param.spId = this.questionForm.spId;
      this.requestMethodGet("/weChat/comp/engCompany/getEngineerUserHasWorkOrderByPage", param)
        .then(res => {
          res = res.data;
          this.loadMoreData = false;
          if (res.code == 1000) {
            this.engineerInfoList = [...this.engineerInfoList, ...res.data.list];
            this.engineerTotal = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    }, 500),

    loadMore() {
      if (!this.loadMoreData && this.engineerTotal > this.engineerInfoList.length) {
        this.handleDistributive("more");
      }
    },
    getRowKey(row) {
      return row.userId;
    },
    // 选择分配人
    handleDistributionnChange(row) {
      this.executeUserId = row.userId;
      this.executeUserRoles = row.roleDtoList
        .map(it => {
          return it.accessTemplateName;
        })
        .join("/");
      this.executeUserName = row.userName;
    },
    // 提交分配
    submitDistribution() {
      if (this.executeUserId) {
        this.executePersonNameVisiable = false;
        this.showRoleNames = true;
      } else {
        this.$message({
          message: "请选择用户",
          type: "warning"
        });
      }
    },

    handleGetCompany: debounce(function(query) {
      this.getCompanyData(query);
    }, 500),
    debounceFun(query) {
      let that = this;
      if (time) {
        clearTimeout(time);
      }
      let time = setTimeout(function() {
        that.getCompanyData(query);
        time = undefined;
      }, 800);
    },
    selCompanyPeople() {
      if (this.$userInfo.userType == 2) return;
      if (!this.questionForm.customerId) {
        return this.$message({
          type: "warning",
          message: "请先选择客户"
        });
      }
    },
    selCompanyPeopleChange() {
      if (this.assignPermissionsFlag) {
        this.showRoleNames = false;
        this.executeUserName = "";
        this.executeUserRoles = "";
        this.executeUserId = "";
      }
    },
    clearPeopleList() {
      this.getCompanyData("");
      this.questionForm.contactUserId = [];
      this.selCompnyPeopleList = [];
    },
    async changeCompany(companyNumber, companyId, companyInfo) {
      console.log("companyInfo", companyInfo);
      this.questionForm.spId = "";
      await this.getSpList(companyId, companyInfo.daFlag);
      this.executeUserId = "";
      this.executeUserName = "";
      this.executeUserRoles = "";
      // 获取当前客户是否是分管人且有执行权限
      const res = await this.requestMethodGet("/serviceApply/applyLoginUserJudgement", { companyId });
      if (res.data.code == 1000) {
        const { userId, userName, accessTemplateNames } = res.data.data;
        this.executeUserId = userId;
        this.executeUserRoles = accessTemplateNames.join("/");
        this.executeUserName = userName;
        this.showRoleNames = true;
      } else {
        this.showRoleNames = false;
      }
      let checkCompanyInfo = this.companyList.filter(it => {
        return it.companyNumber == companyNumber;
      })[0];
      this.checkedCustomer = checkCompanyInfo;
      this.applyAllocationObj.customerType = checkCompanyInfo.customerType;
      this.applyAllocationObj.distributorCompanyName = checkCompanyInfo.companyName;
      // if (!(this.executePermissionFlag && !this.assignPermissionsFlag)) {
      //   this.executeUserId = "";
      //   this.executeUserName = "";
      //   this.executeUserRoles = "";
      //   this.showRoleNames = false;
      // }
      this.selCompnyPeopleList = [];
      this.questionForm.contactUserId = [];
      this.getCompanyPeople(companyNumber);
    },
    async getCompanyPeople(companyNumber) {
      if (this.$userInfo.userType == 2) return;
      const params = {
        useFlag: 1,
        companyNumber,
        current: 1,
        size: 300
      };
      if (this.$userInfo.userType == 1) params.companyFlag = true;
      const peopleListRes = await this.requestMethodGetTip("/web/system/permission/userManage/listByPage", params);
      if (peopleListRes.data.code == 1000) {
        this.selCompnyPeopleList = peopleListRes.data.data.list;
      }
    },
    closeServiceDialog() {
      this.$refs.questionForm.resetFields();
      this.$refs.uploadVideoImg.cancelUplaod();
    },
    changeLookMain(item) {
      this.queryParams.dataFlag = item.value;
      this.$gio.changeDataRange({
        operation: this.queryParams.dataFlag ? "点击仅看与我相关" : "点击查看全部"
      });
      this.$_getWOData();
    },
    // 查询创建类型
    $_queryApplyType() {
      this.requestMethodGet("/serviceApply/getServiceApplyType")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.applyTypeData = res.data;
              let serviceApplyTypeList = res.data.map(item => {
                return {
                  code: item.type,
                  name: item.typeName
                };
              });
              this.tableDataHeader.forEach(item => {
                if (item.paramValue == "serviceApplyType") {
                  item.selectOptions = serviceApplyTypeList;
                }
              });
            }
            this.getCustomFieldList(); //获取自定义字段列表
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查询润滑点
    $_queryLPData() {
      let params = {
        parentCode: "lubrication_point_type"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.lubricationPointTypeList = res.data;
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
    getOilTypeData() {
      this.requestMethodGet("/serviceApply/getOilLv2")
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.oilTypeList = this.formatData1(res.data.list);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    formatData1(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children || data[i].children.length == 0) {
          data[i].children = null;
        } else {
          this.formatData1(data[i].children);
        }
      }
      return data;
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      // this.getCompanyData(val)
    },
    async changeSelCUstome(val) {
      // this.questionForm.spId = "";
      // await this.getSpList(val);
    },
    async getSpList(val, daFlag) {
      if (this.$userInfo.userType == 1 && !daFlag) {
        return (this.questionForm.spId = this.$userInfo.orgInfo.companyId);
      }
      if (!val) return (this.SPList = []);

      const res = await this.requestMethodGetTip("/web/company/getSpsOfAccount", {
        accountId: val
      });
      this.SPList = res.data.data;
      if (!this.SPList.length) return (this.questionForm.spId = "");
      if (this.SPList.length == 1) {
        this.questionForm.spId = this.SPList[0].spId;
        this.handleDistributive(null, val);
      }
    },
    changeSelDisCompany() {
      this.$forceUpdate();
      this.handleDistributive();
    },
    getCompanyData(val) {
      if (this.$userInfo.userType == 2) return;
      let param = {
        size: 500,
        accountName: val,
        menuCode:'CustomerProfileList'
      };
      this.companyList = [];
      this.requestMethodPostTip("/web/customer/filterAccount", param)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.companyList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 新建工单
    handleAddWorkOrder() {
      this.getCompanyData("");
      this.getOilTypeData();
      this.$_queryLPData();
      // this.handlePermission();
      this.questionForm = {
        description: "",
        contactUserId: [],
        spId: this.questionForm.spId
      };
      if (this.$userInfo.userType == 2) {
        this.questionForm.contactUserId = [this.$userInfo.userId];
      }
      this.checkList = [];
      this.addWorkorderVisibled = true;
      this.$gio.clickCreateApplicationButton();
    },
    handleResetAdd(formName) {
      this.addWorkorderVisibled = false;
      this.$refs[formName].resetFields();
      this.executeUserName = "";
      this.executeUserRoles = "";
      this.executeUserId = "";
      this.showRoleNames = false;
      this.applylist.serviceProperty = "";
      this.applylist.incomeBbl = "";
      this.applylist.incomeRmb = "";
    },
    // 确定新建申请单
    sureAddWorkOrder(formName) {
      if (this.$userInfo.userType != 2 && this.assignPermissionsFlag && !this.executeUserId) {
        this.$message({
          message: "请选择执行人",
          type: "warning"
        });
        return;
      }
      if (!this.checkList.length) {
        this.$message({
          message: "请选择问题",
          type: "warning"
        });
        return;
      }
      if (this.$userInfo.userType != 2 && !this.applylist.serviceProperty) {
        this.$message({
          message: "请选择服务创盈属性",
          type: "warning"
        });
        return;
      }
      if (this.$userInfo.userType != 2 && this.applylist.serviceProperty && this.applylist.serviceProperty == 4 && !this.applylist.incomeRmb) {
        this.$message({
          message: "请输入预估收益",
          type: "warning"
        });
        return;
      }
      if (this.$userInfo.userType != 2 && this.applylist.serviceProperty && this.applylist.serviceProperty != 4 && !this.applylist.incomeBbl) {
        this.$message({
          message: "请输入预估收益",
          type: "warning"
        });
        return;
      }
      if (this.checkList.includes(2) && !this.questionForm.description) {
        this.$message({
          message: "请输入详情描述",
          type: "warning"
        });
        return;
      }
      this.$refs[formName].validate(async (valid, validateRes) => {
        console.log("this is valid", valid, validateRes, this.questionForm);
        if (valid) {
          let param = {
            customerId: this.questionForm.customerId,
            description: this.checkList.includes(2) ? this.questionForm.description : "",
            distributorId: this.questionForm.spId,
            reasonConfList: this.checkList,
            serviceApplyType: 1,
            serviceProperty: this.$userInfo.userType == 2 ? 1 : this.applylist.serviceProperty,
            incomeBbl: this.applylist.incomeBbl,
            incomeRmb: this.applylist.incomeRmb
          };

          if (this.$userInfo.userType != 2) {
            param.serviceApplyType = 2;
            param.distributorId = this.$userInfo.orgInfo.companyId;
            param.executeUserId = this.executeUserId;
          } else {
            param.customerId = this.$userInfo.orgInfo.companyId;
          }
          const uploadAssets = await this.$refs.uploadVideoImg.getUplaodAssets();
          Object.assign(param, uploadAssets);
          param.distributorId = this.questionForm.spId;
          this.requestMethodPost("/serviceApply/addServiceApplyOrder", param)
            .then(res => {
              this.loading = false;
              res = res.data;
              if (res.code == 1000) {
                this.$gio.applyService_submit();
                // 调取消息未读数据
                this.$parent.msgCount();
                if (this.executeUserId != this.$userInfo.userId) {
                  this.handleResetAdd("questionForm");
                  this.$_getWOData();
                } else {
                  this.$router.push({
                    path: "/ServiceApplyList/ServiceApplyDetail",
                    query: {
                      id: res.data
                    }
                  });
                }
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        }
      });
    },
    // 查询
    handleSearchTableData() {
      this.pagenation.current = 1;
      this.$_getWOData();
    },

    // size change
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getWOData();
    },
    // current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.$_getWOData();
    },
    // 查看
    handleLook(row) {
      this.$router.push({
        path: "/ServiceApplyList/ServiceApplyDetail",
        query: {
          id: row.id
        }
      });
      this.$gio.toApplicationDetails({
        entrance: "申请单列表",
        applicationNumber: row.serviceApplyNo
      });
    },
    // 获取申请单列表
    $_getWOData() {
      this.loading = true;
      console.log(this.queryParams);
      if (this.queryParams.orderBy == "workOrderNumber") {
        this.queryParams.orderBy = "";
      }
      let params = { ...this.queryParams, ...this.pagenation };
      if (this.$userInfo.userType == 2) {
        params.customerId = this.$userInfo.orgInfo.companyId;
      } else {
        params.distributorId = this.$userInfo.orgInfo.companyId;
      }
      params.revertType = params.revertType ? params.revertType.toString() : "";
      if (params.serviceApplyType) {
        params.serviceApplyType = params.serviceApplyType.includes("0") ? "" : params.serviceApplyType;
      } else {
        params.serviceApplyType = "";
      }
      params.menuCode = "ServiceApply";
      // 数据标识：0：全部 1：与我相关
      this.requestMethodGet("/serviceApply/serviceApplyOrderListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.woTableData = res.data.list;
            this.totalNumber = res.data.totalCount;
            this.pagenation.current = res.data.pageIndex;

            const findStatus = params.serviceApplyStatus ? params.serviceApplyStatus : "";
            const applicationStatus = this.list.find(item => item.serviceApplyStatus == findStatus).statusName;
            this.$gio.filterApplication({
              createType: this.$gio.findValueCodeCorresponding(this.applyTypeData, this.queryParams.serviceApplyType, "type", "typeName"),
              applyTime: `${this.applyTime[0] || "无"} - ${this.applyTime[1] || "无"}`,
              recallOrReject: this.$gio.findValueCodeCorresponding(this.revertTypeList, this.queryParams.revertType, "value", "label"),
              customer: this.queryParams.customerName,
              applicationStatus: applicationStatus
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
    //  获取问题列表
    getApplyReasonConfTree() {
      let params = { status: 1 };
      this.requestMethodGet("/serviceApply/reasonConf/queryServiceApplyReasonConfTree", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.questionList = res.data;
            this.questionList.forEach(item => {
              item.checkList = [];
            });
            this.activeQuestion = this.questionList[0].id
            this.checkboxList = this.questionList[0].children;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 重置
    restSearchInfo() {
      sessionStorage.setItem("questionDescIdStorage", "");
      if (this.queryParams.companyIds) {
        this.$refs["selectCustomer"].clearSelectCustomer();
      }
      this.selectCustomerList = [];
      // 网页端优化功能修改，点击重置不清除tab页选项
      this.queryParams.serviceApplyStatus = "";
      this.queryParams.serviceApplyNo = "";
      this.queryParams.customerName = "";
      this.queryParams.serviceApplyType = "";
      this.queryParams.distributorName = "";
      this.queryParams.companyIds = "";
      this.queryParams.applyStartTime = "";
      this.queryParams.applyEndTime = "";
      this.queryParams.questionDescId = "";
      this.queryParams.revertType = [];
      this.queryParams.dataFlag = 0;
      this.queryParams.orderBy = "createTime";
      this.queryParams.descFlag = true;
      this.queryParams.finishStartTime = "";
      this.queryParams.finishEndTime = "";
      this.queryParams.isGood = "";
      this.tableDataHeader.forEach(item => {
        item.changeValue = "";
        if (item.sortTypeVal) {
          if (item.paramValue == "createTime") {
            item.sortTypeVal = "sortDown";
          } else {
            item.sortTypeVal = "sortDefault";
          }
        }
      });
      this.applyTime = [];
      this.pagenation.current = 1;
      this.$_getWOData();
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      if (this.$userInfo.userType == 2) {
        this.customFieldlistUnit = this.customFieldlistUnit.filter(item => item.fieldName != "distributorCompanyName" && item.fieldName != "customerCompanyName");
      } else if (this.$userInfo.userType == 1) {
        this.customFieldlistUnit = this.customFieldlistUnit.filter(item => item.fieldName != "distributorCompanyName");
      }

      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "serviceApply");
        if (index != -1) {
          let fieldDtoInfos = fieldDtoList[index].fieldDtoInfos;
          customFieldlistUnit = fieldDtoInfos.length == 0 ? this.customFieldlistUnit : fieldDtoInfos;
        } else {
          customFieldlistUnit = this.customFieldlistUnit;
        }
      }
      if (this.$userInfo.userType != 2) {
        const item = this.customFieldlistUnit.find(item => item.fieldName == "spName");
        if (!item) {
          this.customFieldlistUnit.push({
            fieldName: "spName",
            visible: 2
          });
        }
      }
      let customFieldlist = customFieldlistUnit.map(item => {
        item.fieldNameCn = this.tableDataHeaderInit[item.fieldName].label;
        return item;
      });
      customFieldlist.sort((a, b) => {
        return a.sort - b.sort;
      });
      this.customFieldlist = customFieldlist;
      let tableDataHeader = [];
      this.customFieldlist.forEach(item => {
        if (item.visible != 0) {
          tableDataHeader.push(this.tableDataHeaderInit[item.fieldName]);
        }
      });
      this.tableDataHeader = tableDataHeader;
      if (this.$route.params.isSaveQuery) {
        let queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
        if (sessionStorage.getItem("queryParams")) {
          this.tableDataHeader.forEach(item => {
            if (item.paramValue == "applyTime" && queryParams.applyStartTime && queryParams.applyEndTime) {
              item.changeValue = [queryParams.applyStartTime, queryParams.applyEndTime];
            } else if (item.paramValue == "serviceApplyNo") {
              item.changeValue = queryParams.serviceApplyNo;
            } else if (item.paramValue == "serviceApplyType") {
              let typeArr = [];
              item.selectOptions.forEach(it => {
                if (queryParams.serviceApplyType.includes(it.code)) typeArr.push(it.code);
              });
              item.changeValue = typeArr;
            } else if (item.paramValue == "distributorName") {
              item.changeValue = queryParams.distributorName;
            } else if (item.paramValue == "questionDescId") {
              if (item.paramValue) {
                item.changeValue = sessionStorage.getItem("questionDescIdStorage") ? JSON.parse(sessionStorage.getItem("questionDescIdStorage")) : [];
              }
            } else if (item.paramValue == "serviceApplyStatus") {
              let statusArr = [];
              item.selectOptions.forEach(it => {
                if (queryParams.serviceApplyStatus.includes(it.code)) statusArr.push(it.code);
              });
              item.changeValue = statusArr;
            }

            if (queryParams.orderBy == item.paramValue) {
              item.sortTypeVal = queryParams.descFlag ? "sortDown" : queryParams.descFlag === false ? "sortUp" : "sortDefault";
            } else if (item.sortTypeVal && queryParams.orderBy != item.paramValue) {
              item.sortTypeVal = "sortDefault";
            }
          });
        }
      }
    },
    // 自定义字段
    getCustomFields(data) {
      this.customFieldlist = data;
      let tableDataHeader = [];
      data.forEach(item => {
        if (item.visible != 0) {
          tableDataHeader.push(this.tableDataHeaderInit[item.fieldName]);
        }
      });
      this.tableDataHeader = tableDataHeader;
    },
    // 排序
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal;
      this.queryParams.orderBy = obj.paramValue;
      if (sortVal == "sortUp") {
        this.queryParams.descFlag = false;
      } else if (sortVal == "sortDown") {
        this.queryParams.descFlag = true;
      }
      this.pagenation.current = 1;
      this.tableDataHeader.forEach(item => {
        if (item.sortTypeVal) {
          if (item.paramValue && item.paramValue == this.queryParams.orderBy) {
            item.sortTypeVal = sortVal;
          } else if (item.paramValue && item.paramValue != this.queryParams.orderBy) {
            item.sortTypeVal = "sortDefault";
          }
        }
      });
      this.$_getWOData();
    },
    tableTitleSearch(obj) {
      let searchVal = obj.changeValue;
      this.tableDataHeader.forEach(item => {
        if (obj.paramValue == item.paramValue) {
          item.changeValue = searchVal === 0 || searchVal === false ? searchVal : searchVal || "";
        }
      });
      if (obj.paramValue == "applyTime") {
        if (searchVal) {
          this.queryParams.applyStartTime = searchVal[0];
          this.queryParams.applyEndTime = searchVal[1];
        } else {
          this.queryParams.applyStartTime = "";
          this.queryParams.applyEndTime = "";
        }
      } else if (obj.paramValue == "finishTime") {
        if (searchVal) {
          this.queryParams.finishStartTime = searchVal[0];
          this.queryParams.finishEndTime = searchVal[1];
        } else {
          this.queryParams.finishStartTime = "";
          this.queryParams.finishEndTime = "";
        }
      } else if (obj.paramValue == "questionDescId") {
        let vals = [];
        if (searchVal.length) {
          searchVal.forEach(item => {
            vals.push(item[1]);
          });
        }
        this.queryParams.questionDescId = searchVal.length ? vals.toString() : "";
        sessionStorage.setItem("questionDescIdStorage", JSON.stringify(searchVal));
      } else if (obj.paramValue == "serviceApplyStatus" || obj.paramValue == "serviceApplyType") {
        this.queryParams[obj.paramValue] = searchVal.toString();
      } else {
        this.queryParams[obj.paramValue] = searchVal;
      }
      this.pagenation.current = 1;
      this.$_getWOData();
    },
    showSelectCustomer() {
      this.showCustomerDialog = true;
    },
    handleClearCustomer() {
      this.selectCustomerList = [];
      this.queryParams.companyIds = "";
      this.pagenation.current = 1;
      this.$_getWOData();
      this.$refs["selectCustomer"].clearSelectCustomer();
    },
    handleSubmitCustomer(e) {
      let selectList = e.map(item => {
        return item.companyId;
      });
      this.selectCustomerList = selectList;
      this.queryParams.companyIds = selectList.join(",");
      this.pagenation.current = 1;
      this.$_getWOData();
      this.showCustomerDialog = false;
    },
    handleCloseCustomer() {
      this.showCustomerDialog = false;
    },
    //获取需求概述
    getQuesdescList() {
      this.requestMethodGet("/serviceApply/reasonConf/queryServiceApplyReasonConfTree?status=1", {}).then(res => {
        if (res.data.code == 1000) {
          let questionDescList = res.data.data;
          let index = this.tableDataHeader.findIndex(item => item.paramValue == "questionDescId");
          if (index != -1) {
            this.tableDataHeader[index].selectOptions = questionDescList;
          }
          this.$_getWOData(); // 获取工单列表
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  }
};
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  display: none;
}
.apply-order-component {
  padding: 0 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
  .el-popover-detail {
    /deep/ .el-button {
      padding: 0px !important;
    }
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #e9e9e9;
    background: #dd0000;
    color: #fff;
  }
  /deep/ .el-tabs--card > .el-tabs__header {
    border-bottom: none;
    margin: 0 0 20px;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    -webkit-transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  /deep/ .el-tabs__item {
    color: #666;
    height: 32px;
    line-height: 32px;
    overflow: hidden;
  }
  /deep/ .el-tabs__item:hover {
    color: #dd0000;
    cursor: pointer;
  }
  /deep/.el-table .descending .sort-caret.descending {
    border-top-color: #001450;
  }
  /deep/.el-table .ascending .sort-caret.ascending {
    border-bottom-color: #001450;
  }
  .workOrder-Status {
    // cursor:pointer;
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    font-weight: bold;
  }
  /deep/ .dialog .el-input--small .el-input__inner {
    height: 36px !important;
    line-height: 36px !important;
  }
  /deep/ .dialog-contact .el-input--small .el-input__inner {
    height: 80px !important;
    line-height: 80px !important;
  }
  /deep/ .dialog input::-webkit-input-placeholder {
    color: #333;
  }
  /deep/ .dialog-contact input::-webkit-input-placeholder {
    color: #333;
  }
  /deep/ .exDetail {
    .el-dialog__header {
      padding: 0px;
    }
    .el-dialog__body {
      padding: 13px;
    }
    .el-dialog__headerbtn {
      top: 13px;
      right: 12px;
    }
    .el-dialog__wrapper {
      left: 21%;
    }
  }
}
.select_person {
  width: 80%;
  height: 36px;
  line-height: 36px;
  padding-left: 20px;
}
</style>
<style scoped lang="less">
@import "../../assets/css/customTable.less";
/deep/ .apply-order-component .closeWorkOrder {
  .el-dialog__body {
    padding: 10px 20px 20px 40px;
  }
  .el-dialog__title {
    font-size: 18px;
    color: #000;
    font-family: MicrosoftYaHei;
  }
  .el-collapse {
    border: none !important;
  }
  .el-collapse-item__header {
    background: #f9f9f9;
    border-top: 1px solid #e4e7ed;
    padding: 0 20px;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-collapse-item {
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    margin-bottom: 20px;
    position: relative;
  }
  .el-collapse-item__wrap {
    border-bottom: none !important;
  }
  .el-checkbox {
    width: 100%;
    padding: 10px 20px;
    box-sizing: border-box;
    margin-right: 0;
  }
  .el-checkbox__label {
    display: inline-grid;
    white-space: pre-line;
    word-wrap: break-word;
    overflow: hidden;
    line-height: 20px;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266 !important;
  }
}
.self-tips {
  margin-left: 10px;
  min-height: 20px;
  min-width: 20px;
  width: 20px;
  height: 20px;
  background-color: #ccddff;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  font-size: 12px;
  line-height: 22px;
  color: #666;
}
</style>
