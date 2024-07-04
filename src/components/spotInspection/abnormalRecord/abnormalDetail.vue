<template>
  <div style="position:relative" class="detail-content">
    <!-- 异常详情 -->
    <el-drawer :visible.sync="openDrawFlag" :direction="direction" :close-on-press-escape="false" :destroy-on-close="true" size="45%" :wrapperClosable="false" :before-close="closeDraw">
      <!-- 头部 -->
      <div slot="title" class="abnormal-header">
        <div>异常详情</div>
        <div style="margin-right:20px" v-if="btnFlag">
          <!-- 根据不同异常类型展示不同颜色和文案的按钮 -->
          <el-button :type="abnormalStatus > 0 ? '' : 'danger'" size="small" @click="changeAbnormalStatus">{{ abnormalStatus > 0 ? "转为待处理" : "转为已处理" }}</el-button>
        </div>
      </div>
      <!-- 异常详情 -->
      <div style="padding:20px">
        <div class="abnormal-content" :style="abnormalStatus > 0 ? 'background-color:#f9f9f9' : 'background-image: linear-gradient(to right,rgba(211,0,0,0.05) , #fff );'">
          <!-- 第一行 -->
          <div class="abnormal-title-content">
            <div style="font-size:16px;font-weight:400;" class="abnormal-title">
              ID:<span>{{ abnormalDetail.abnormalNo }}</span>
            </div>
          </div>

          <div style="margin-top:10px;">
            <span style="color:#000;font-weight:700;font-size:18px;">
              {{ abnormalDetail.abnormalType == "2" ? "润滑异常" : "设备异常" }}
            </span>
          </div>
          <!-- 第二行 -->
          <div class="abnormal-info-content">
            <div class="abnormal-flex">
              <div class="abnormal-title">状态</div>
              <div class="abnormal-value" style="color:#dd0000;">
                {{ abnormalStatus > 0 ? "已处理" : "待处理" }}
              </div>
            </div>
            <div class="abnormal-flex" style="margin-left:50px">
              <div class="abnormal-title">优先级</div>
              <div class="abnormal-value">
                <span>{{ abnormalDetail.priority == 1 ? "急需处理" : "可暂缓处理" }}</span>
                <span style="font-size:13px;color:#001450;cursor:pointer;margin-left:5px" @click="editPriority" v-if="!abnormalStatus && btnFlag">编辑></span>
              </div>
            </div>

            <div class="abnormal-flex" style="margin-left:50px">
              <div class="abnormal-title">创建人&时间</div>
              <div class="abnormal-value">{{ abnormalDetail.createUserName }} {{ abnormalDetail.createTime }}</div>
            </div>

            <div class="abnormal-flex" style="margin-left:50px">
              <div class="abnormal-title">关闭人&时间</div>
              <div class="abnormal-value" v-if="abnormalStatus > 0">{{ abnormalDetail.updateUserName }} {{ abnormalDetail.updateTime }}</div>
              <div class="abnormal-value" v-else>暂无</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 异常描述 -->
      <div style="padding:20px">
        <div class="abnormal-desc-content">
          <!-- title -->
          <div class="right-content">
            <div class="line"></div>
            <div class="right-title">异常描述</div>
          </div>
          <div class="abnormal-desc-flex desc" v-if="userInfo.userType < 2">
            <div class="abnormal-title">所属客户</div>
            <div class="abnormal-desc">{{ abnormalDetail.companyName }}</div>
          </div>
          <div class="abnormal-desc-flex desc" v-show="showServer">
            <div class="abnormal-title" style="width:39px">服务商</div>
            <div class="abnormal-desc" style="flex: 1;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              {{ abnormalDetail.distributors }}
            </div>
          </div>
          <!-- <div class="abnormal-desc-flex desc">
            <div class="abnormal-title">异常类型</div>
            <div class="abnormal-desc">{{ abnormalDetail.abnormalType == "2" ? "润滑点异常" : "设备异常" }}</div>
          </div> -->
          <div class="abnormal-desc-flex desc">
            <div class="abnormal-title">异常说明</div>
            <div class="abnormal-desc" style="flex:1">
              <span v-if="abnormalDetail.abnormalSource == 2 && !abnormalDetail.studyRecordId">《</span>{{ abnormalDetail.abnormalDesc }}
              <span v-if="abnormalDetail.abnormalSource == 2 && !abnormalDetail.studyRecordId">》发现设备异常</span>
            </div>
          </div>
          <!-- 描述 -->
          <div class="abnormal-desc-flex desc">
            <div class="abnormal-title">所属设备</div>
            <div class="abnormal-desc">{{ abnormalDetail.deviceName }}</div>
            <div style="font-size:13px;color:#001450;cursor:pointer;margin-left:5px" @click="deviceDetail">详情></div>
          </div>
          <div class="abnormal-desc-flex desc" v-if="abnormalDetail.abnormalType == '2'">
            <div class="abnormal-title">所属润滑点</div>
            <div class="abnormal-desc">{{ abnormalDetail.lubricationPointNames || "暂无" }}</div>
          </div>
          <div class="abnormal-desc-flex desc">
            <div class="abnormal-title">来源</div>
            <div class="abnormal-desc">{{ abnormalDetail.abnormalSource == "1" ? "手工创建" : abnormalDetail.abnormalSource == "0" ? "检查" : "润滑服务" }}</div>
            <div v-if="abnormalDetail.abnormalSource == 0" style="font-size:13px;color:#001450;cursor:pointer;margin-left:10px" @click="toTaskDetail">
              {{ abnormalDetail.abnormalRelationTaskName }}>
            </div>
            <div v-if="abnormalDetail.abnormalSource == 2 && !abnormalDetail.studyRecordId" style="font-size:13px;color:#001450;cursor:pointer;margin-left:10px">
              <el-popover placement="center" width="80" trigger="click">
                <div style="line-height:40px;font-size:13px;">
                  <div style="color:#dd0000;" @click="handleOpenFile">查看报告</div>
                  <div style="color:#333;" @click="handleJumpPage">查看工单</div>
                </div>

                <el-button slot="reference" size="small" type="text" style="color:#001450;position: relative;top: 0px;">查看></el-button>
              </el-popover>
            </div>
          </div>
          <div class="abnormal-desc-flex desc" v-if="abnormalDetail.abnormalSource != 1 && abnormalDetail.abnormalSource != 2">
            <div class="abnormal-title">检查内容</div>
            <div class="abnormal-desc">{{ abnormalDetail.content }}</div>
          </div>

          <div class="abnormal-desc-flex desc" v-if="abnormalDetail.abnormalSource != 1 && abnormalDetail.abnormalSource != 2">
            <div class="abnormal-title" style="width:30px">标准</div>
            <div class="abnormal-desc" style="flex:1">{{ abnormalDetail.standValue }}</div>
          </div>

          <div class="abnormal-desc-flex desc" v-if="abnormalDetail.abnormalSource != 1 && abnormalDetail.abnormalSource != 2">
            <div class="abnormal-title">检查值</div>
            <div class="abnormal-desc">{{ abnormalDetail.enterValue }}</div>
          </div>

          <div v-if="abnormalDetail.abnormalSource != 2">
            <div class="abnormal-title">现场照片</div>
            <div class="abnormal-desc-flex" style="flex-wrap: wrap;">
              <div v-for="(img, index) in abnormalDetail.livePictureList" :key="index">
                <el-image style="width: 80px; height: 80px;margin:10px 10px 10px 0;border-radius:6px" :src="img.url"> </el-image>
              </div>
            </div>
          </div>
          <!-- 备注 -->
          <div style="margin: 20px 0;">
            <div style="display: flex;align-items: center;">
              <div class="abnormal-title">备注</div>
              <div class="abnormal-desc" style="flex: 1;display: inline;">
                <span style="margin-right:20px;">{{ abnormalDetail.remark || "暂无备注" }}</span>
              </div>
            </div>
            <div style="color: #001450;font-size:13px;cursor: pointer;margin-left: 42px;margin-top: 10px;">
              <span @click="viewRemarkHistory">查看备注历史</span>
              <span v-if="btnFlag && !abnormalDetail.abnormalStatus" @click="fillRemark"><icon class="el-icon-edit"></icon>填写备注</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 关联任务 -->
      <div style="padding:20px">
        <div class="abnormal-desc-content">
          <div class="abnormal-desc-flex" style="justify-content: space-between;">
            <div class="right-content">
              <div class="line"></div>
              <div class="right-title">内部处理</div>
            </div>
            <div v-if="!abnormalStatus">
              <el-button v-has="PC_Event_link_Create" type="danger" size="small" icon="el-icon-plus" plain @click="relationDeviceTask">关联设备任务</el-button>
              <el-button v-has="PC_Event_link_Create" type="danger" size="small" icon="el-icon-plus" plain @click="createDeviceTask">创建设备任务</el-button>
            </div>
          </div>
          <!-- 表格 -->
          <div style="margin-top:20px">
            <custom-table class="table" :tableHeader="taskTableDataHeader" :tableData="taskTableData" :tableHeight="tableHeight + ''">
              <template v-slot:taskStatus="slotProps">
                <el-table-column
                  :width="slotProps.slotData.width && slotProps.ind !== taskTableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == taskTableDataHeader.length - 2 ? false : true"
                  label="状态"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.taskStatus == 1" style="color:#dd0000">待领取</span>
                    <span v-if="scope.row.taskStatus == 2" style="color: #008888">执行中</span>
                    <span v-if="scope.row.taskStatus == 3" style="color: #999">已执行</span>
                    <span v-if="scope.row.taskStatus == 4" style="color: #999">已取消</span>
                  </template>
                </el-table-column>
              </template>
              <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
              <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="100" align="center" v-if="btnFlag">
                <template slot-scope="scope">
                  <el-link @click="viewTaskDetail(scope.row)" style="margin-right:10px;color:#001450">查看</el-link>
                  <el-link @click="cancelTaskRelation(scope.row)" style="margin-right:10px;color:#001450">取消关联</el-link>
                </template>
              </el-table-column>
            </custom-table>
            <!-- 分页 -->
            <el-pagination
              background
              @size-change="taskSizeChange"
              @current-change="taskCurrentChange"
              :current-page="taskCurrent"
              :page-size="taskSize"
              :page-sizes="[5, 10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="taskTotalNumber"
              style="position: inherit;margin-top:10px;display: flex;justify-content: flex-end;"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 关联申请单 -->
      <div style="padding:20px">
        <div class="abnormal-desc-content">
          <div class="abnormal-desc-flex" style="justify-content: space-between;">
            <div class="right-content">
              <div class="line"></div>
              <div class="right-title">美孚服务</div>
            </div>
            <div v-if="!abnormalStatus">
              <el-button
                v-auth="{
                  menuCodes: 'PC_ExceptionRecord_linkApplyOrder',
                  strategyNames: ['assetGroup'],
                  strategySource: {
                    assetGroup: abnormalDetail.distributorId
                  },
                  matchKey: {
                    assetGroup: 'spId'
                  }
                }"
                type="danger"
                size="small"
                icon="el-icon-plus"
                plain
                @click="relationApplyBtn"
                >关联服务申请单</el-button
              >
              <el-button
                v-auth="{
                  menuCodes: 'PC_ExceptionRecord_linkApplyOrder',
                  strategyNames: ['assetGroup'],
                  strategySource: {
                    assetGroup: abnormalDetail.distributorId
                  },
                  matchKey: {
                    assetGroup: 'spId'
                  }
                }"
                type="danger"
                size="small"
                icon="el-icon-plus"
                plain
                @click="createApply"
                >创建服务申请单</el-button
              >
            </div>
          </div>
          <!-- 表格 -->
          <div style="margin-top:20px">
            <custom-table class="table" :tableHeader="tableDataHeader" :tableData="applyTableData" :tableHeight="tableHeight + ''">
              <template v-slot:serviceApplyStatus="slotProps">
                <el-table-column
                  :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                  label="状态"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.serviceApplyStatus == 0" style="color:#dd0000">待确认</span>
                    <span v-if="scope.row.serviceApplyStatus == 1" style="color:#dd0000">待处理</span>
                    <span v-if="scope.row.serviceApplyStatus == 2" style="color:#008888">进行中</span>
                    <span v-if="scope.row.serviceApplyStatus == 3" style="color:#999">已完成</span>
                    <span v-if="scope.row.serviceApplyStatus == 4" style="color:#999">已取消</span>
                  </template>
                </el-table-column>
              </template>
              <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
              <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="100" align="center" v-if="btnFlag">
                <template slot-scope="scope">
                  <el-link @click="viewApplyDetail(scope.row)" style="margin-right:10px;color:#001450">查看</el-link>
                  <el-link @click="cancelApplyRelation(scope.row)" style="margin-right:10px;color:#001450">取消关联</el-link>
                </template>
              </el-table-column>
            </custom-table>
            <!-- 分页 -->
            <el-pagination
              background
              @size-change="applySizeChange"
              @current-change="applyCurrentChange"
              :current-page="applyCurrent"
              :page-size="applySize"
              :page-sizes="[5, 10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="applyTotalNumber"
              style="position: inherit;margin-top:10px;display: flex;justify-content: flex-end;"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-drawer>
    <!-- 取消关联二次确认 -->
    <el-dialog title="取消关联" :visible.sync="cancelRelationDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <span>取消关联不会删除任务，是否取消关联？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelRelationDialog = false" size="small">取 消</el-button>
        <el-button type="danger" @click="confirmCancel" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑优先级 -->
    <el-dialog title="编辑优先级" :visible.sync="editPriorityDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="priorityForm" :model="priorityForm" :rules="priorityRules" label-width="80px">
        <el-form-item label="优先级" prop="priorityVal">
          <el-radio-group v-model="priorityForm.priorityVal">
            <el-radio :label="item.value" v-for="(item, idx) in priorityList" :key="idx">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPriorityDialog = false" size="small">取 消</el-button>
        <el-button type="danger" @click="savePriority('priorityForm')" size="small">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 关联任务 -->
    <RelationTask
      :abnormalData="abnormalData"
      :chooseTask="chooseTask"
      :abnormalId="id"
      :companyId="abnormalDetail.companyId"
      :deviceId="abnormalDetail.deviceId"
      v-on:cancelTaskDialog="cancelTaskDialog"
      v-on:confirmChoosePlan="confirmChoosePlan"
    ></RelationTask>
    <!-- 关联申请单 -->
    <RelationApply
      :chooseApply="chooseApply"
      :abnormalId="id"
      :companyId="abnormalDetail.companyId"
      v-on:cancelApplyDialog="cancelApplyDialog"
      v-on:confirmChooseApply="confirmChooseApply"
    ></RelationApply>
    <!-- 创建申请单 -->
    <el-dialog class="closeWorkOrder" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="createApplyDialog" title="创建申请单" top="100px" :show-close="false" width="50%">
      <el-form :model="questionForm" :rules="serviceTypeRule" ref="questionForm" label-position="top" style="max-height: 500px;overflow-y: auto;">
        <el-row style="display:flex;flex-wrap:wrap">
          <div :span="12" style="width:50%" v-if="userInfo.userType != 2">
            <el-form-item label="客户" prop="customerId">
              <el-select
                @clear="clearPeopleList"
                size="small"
                :filter-method="handleGetCompany"
                clearable
                placeholder-style="color:#e2e2e2;"
                style="width: 80%;"
                filterable
                v-model="questionForm.customerId"
                @change="changeSelCUstome"
              >
                <el-option
                  @click.native="changeCompany(item.companyNumber, item.companyId)"
                  v-for="item in companyList"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- <div :span="12" v-if="SPList.length > 1" style="width:50%">
            <el-form-item label="经销商" prop="spId">
              <span slot="label"><span style="color:#F56C6C;margin-right:4px">*</span>经销商</span>
              <el-select size="small" clearable filterable placeholder="请选择" style="width: 80%" v-model="questionForm.spId" popper-append-to-body @change="changeSelDisCompany">
                <el-option v-for="item in SPList" :key="item.spId" :label="item.spName" :value="item.spId"> </el-option>
              </el-select>
            </el-form-item>
          </div> -->
          <div :span="12" v-if="userInfo.userType != 2 && (assignPermissionsFlag || executePermissionFlag)" style="width:50%">
            <el-form-item>
              <span slot="label"><span style="color:#F56C6C;margin-right:4px" v-if="assignPermissionsFlag">*</span>执行人</span>
              <div class="select_person form-item-outline" style="" @click="allocationUser">
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
          <el-table-column prop="roleNames" min-width="18%" label="角色">
            <template slot-scope="scope">
              <div v-for="(item, index) in scope.row.roleDtoList" :key="index">{{ item.accessTemplateName }}</div>
            </template>
          </el-table-column>
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
    <!-- 备注历史 -->
    <el-dialog title="备注变更历史" :visible.sync="remarkChangeDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="height: 400px;overflow: auto;padding-right: 20px;">
        <el-timeline :reverse="false" v-if="remarkChangeList.length">
          <el-timeline-item v-for="(item, index) in remarkChangeList" :key="index" :timestamp="item.createTime + ' ' + item.createUserName" color="#ccddff" size="large" placement="top">
            <div style="font-size:13px">
              <span style="color:#000">{{ item.remark }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
        <div v-else style="display:flex;align-items:center;justify-content:center;color:#666;height:400px">暂无数据</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="remarkChangeDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 填写备注 -->
    <el-dialog title="填写备注" :visible.sync="remarkFillDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <div style="height: 400px;overflow: auto;padding-right: 20px;">
        <el-input size="small" type="textarea" placeholder="请输入备注" v-model="remarkTextarea" maxlength="500" show-word-limit :autosize="{ minRows: 12, maxRows: 20 }"> </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeRemark">关 闭</el-button>
        <el-button size="small" type="danger" @click="saveReamrk">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import RelationTask from "../components/relationTask";
import debounce from "lodash/debounce";
import RelationApply from "../components/relationApply";
import UplaodSection from "../../configure/components/uploadVideoImg.vue";
import DAModify from "../../newWorkOrder/mixins/DAModify";
import customTable from "../../tableComponents/customTable";
import serviceIncome from "@/components/newWorkOrder/components/serviceIncome";
export default {
  components: {
    RelationTask,
    UplaodSection,
    RelationApply,
    "custom-table": customTable,
    serviceIncome
  },
  mixins: [DAModify],
  props: {
    // 是否打开抽屉标识
    openDrawFlag: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    // 异常数据源
    abnormalData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    abnormalStatus: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    id: {
      type: Number,
      default: () => {
        return 0;
      }
    }
  },
  data() {
    return {
      showServer: false,
      SPList: [],
      selCompanyPeopleKey: 1,
      taskTableData: [],
      taskCurrent: 1,
      taskSize: 5,
      taskTotalNumber: 0,
      applyTableData: [],
      activeQuestion: "",
      applyCurrent: 1,
      applySize: 5,
      applyTotalNumber: 0,
      cancelType: "",
      cancelRelationDialog: false, // 取消关联二次确认弹框
      cancelRow: {},
      checkboxList: [], // 选中的问题的children
      incomeBblUnit: "BBL",
      incomeRmbUnit: "RMB",
      showIncomeBbl: false,
      showIncomeRmb: false,
      selCompnyPeopleList: [],
      priorityList: [
        {
          label: "急需处理",
          value: 1
        },
        {
          label: "可暂缓处理",
          value: 2
        }
      ],
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
      priorityForm: {
        priorityVal: 1
      },
      priorityRules: {
        priorityVal: [{ required: true, message: "请选择优先级", trigger: "change" }]
      },
      editPriorityDialog: false,
      chooseTask: false,
      chooseApply: false,
      createApplyDialog: false,
      companyList: [],
      questionForm: {
        spId: "",
        description: "",
        contactUserId: []
      },
      //   表单验证规则
      serviceTypeRule: {
        customerId: [{ required: true, message: "请选择客户", trigger: "change" }],
        description: [{ required: true, message: "请输入详细描述", trigger: "change" }],
        contactUserId: [{ required: true, message: "请选择联系人", trigger: "blur" }]
      },
      questionList: [], // 服务类型列表
      selectQuestionList: [],
      checkList: [], // 选中的问题
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      abnormalDetail: {},
      btnFlag: false,
      createTaskBtnFlag: false,
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
      selCompnyPeopleList: [],
      remarkChangeDialog: false,
      remarkChangeList: [],
      historyCurrent: 1,
      historySize: 10,
      historyTotal: 0,
      remarkFillDialog: false,
      remarkTextarea: "",
      remarkBtnFlag: false,
      tableDataHeader: [
        { label: "申请单ID", prop: "serviceApplyNo", width: "120", tooltip: true },
        { label: "包含工单数", prop: "workOrderCount", width: "120", tooltip: true },
        { label: "状态", slot: "serviceApplyStatus", width: "100" },
        { label: "操作", slot: "operation" }
      ],
      taskTableDataHeader: [
        { label: "任务名称", prop: "taskName", width: "120", tooltip: true },
        { label: "任务主题", prop: "planTitle", width: "120", tooltip: true },
        { label: "状态", slot: "taskStatus", width: "100" },
        { label: "操作", slot: "operation" }
      ],
      // 服务创造盈属性与服务收益
      applylist: {
        serviceProperty: "",
        incomeBbl: "",
        incomeRmb: ""
      }
    };
  },
  watch: {
    openDrawFlag: function(val, oldVal) {
      if (val) {
        // 异常详情
        this.getAbnormalDetail();
        // 异常-关联待办任务
        this.getTaskTableData();
        // 异常-关联服务申请
        this.getApplyTableData();
      }
    }
  },
  created() {
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      // 变更状态、编辑优先级、关联任务、关联申请单、创建申请单、取消关联按钮受 web_Event_Handle 控制
      if (buttonList[i].menuCode == "web_Event_Handle") {
        this.btnFlag = true;
      }
      // 创建任务按钮同时受 web_Event_Handle 和 web_Task_Add 控制（且关系）
      if (buttonList[i].menuCode == "web_Task_Add") {
        this.createTaskBtnFlag = true;
      }
      if (buttonList[i].menuCode == "service_order_execute_btn") {
        this.executePermissionFlag = true;
      }
      if (buttonList[i].menuCode == "service_order_distribution_btn") {
        this.assignPermissionsFlag = true;
      }
      if (buttonList[i].menuCode == "workorder-remark-btn") {
        this.remarkBtnFlag = true;
      }
    }
    if (this.userInfo.userType == 2) {
      this.selCompnyPeopleList.push(this.userInfo);
    }
    // this.getSpList(this.userInfo.orgInfo.companyId);
    // this.handlePermission();
  },
  methods: {
    async getServerSpIds() {
      const res = await this.requestMethodGetTip("/web/company/getSpsOfAccount", {
        // accountId: this.$userInfo.orgInfo.companyId
        accountId: 820
      });
      return res.data.data.map(item => item.spId);
    },
    fillRemark() {
      this.remarkTextarea = "";
      this.remarkFillDialog = true;
    },
    saveReamrk() {
      if (this.remarkTextarea.trim() == "") {
        this.$message({
          type: "warning",
          message: "请填写备注"
        });
        return;
      }
      const params = {
        abnormalId: this.id,
        remark: this.remarkTextarea
      };
      this.requestMethodPost("/device/check/abnormal/addRemark", params).then(res => {
        if (res.data.code == 1000) {
          // 异常详情
          this.getAbnormalDetail();
          // 异常-关联待办任务
          this.getTaskTableData();
          // 异常-关联服务申请
          this.getApplyTableData();
          this.closeRemark();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        this.$gio.ClicktofillinRemarks({ eventId: this.abnormalDetail.abnormalNo });
        this.$gio.ClicksaveAbnormalRemark({ eventId: this.abnormalDetail.abnormalNo });
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
                console.log(item, 1222);
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
    closeRemark() {
      this.remarkFillDialog = false;
      this.remarkTextarea = "";
    },
    // 查看备注历史
    viewRemarkHistory() {
      const params = {
        abnormalId: this.id,
        current: this.historyCurrent,
        size: 100
      };
      this.requestMethodGet("device/check/abnormal/remarks", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data.list || [];
          this.remarkChangeList = data;
          this.historyTotal = res.data.data.totalCount;
          this.remarkChangeDialog = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
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
      this.$refs["questionForm"].validateField(["customerId", "spId"], err => {
        if (!err) {
          // 更新删除联系人,执行人与联系人无关与所选客户有关
          this.executePersonNameVisiable = true;
        }
      });
    },
    selCompanyPeopleChange() {
      this.executeUserName = "";
      this.executeUserRoles = "";
      this.executeUserId = "";
      this.showRoleNames = false;
    },
    handlePermission() {
      if (this.executePermissionFlag && !this.assignPermissionsFlag) {
        this.executeUserName = this.userInfo.userName;
        this.executeUserRoles = this.userInfo.roleNames.join("/");
        this.executeUserId = this.userInfo.userId;
        this.showRoleNames = true;
      }
    },
    async changeSelCUstome(val) {
      this.questionForm.spId = "";
      // await this.getSpList(val);
    },
    async getSpList(val) {
      if (this.userInfo.orgInfo.userType == 1) {
        return (this.questionForm.spId = this.SPList[0].spId);
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
    // 分配工单
    handleDistributive: debounce(function(val, companyId) {
      if (this.userInfo.userType == 2) return;
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
      if (this.userInfo.userType == 1) {
        param.userBelongType = 2;
        param.distributorId = this.userInfo.orgInfo.companyId;
      }
      if (this.active == 3) {
        param.contactPersonId = this.questionForm.contactUserId[0];
      }
      param.accountId = this.questionForm.customerId;
      if (this.userInfo.userType == 2) param.accountId = this.userInfo.orgInfo.companyId;
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
    clearPeopleList() {
      this.getCompanyData("");
      this.questionForm.contactUserId = [];
      this.selCompnyPeopleList = [];
    },
    handleGetCompany: debounce(function(query) {
      this.getCompanyData(query);
    }, 500),
    async changeCompany(companyNumber, companyId) {
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
      this.selCompnyPeopleList = [];
      this.questionForm.contactUserId = [];
      this.getCompanyPeople(companyNumber);
    },
    async getCompanyPeople(companyNumber) {
      if (this.userInfo.userType == 2) return;
      const params = {
        useFlag: 1,
        companyNumber,
        current: 1,
        size: 300
      };
      if (this.userInfo.userType == 1) params.companyFlag = true;
      const peopleListRes = await this.requestMethodGetTip("/web/system/permission/userManage/listByPage", params);
      if (peopleListRes.data.code == 1000) {
        this.selCompnyPeopleList = peopleListRes.data.data.list;
      }
    },
    selCompanyPeople() {
      if (this.userInfo.userType == 2) return;
      if (!this.questionForm.customerId) {
        return this.$message({
          type: "warning",
          message: "请先选择客户"
        });
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

    getAbnormalDetail() {
      const params = {
        id: this.EncryptUserId(this.id)
      };
      this.requestMethodGet("/device/check/abnormal/details", params).then(async res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          if (data.livePictureList && data.livePictureList.length) {
            data.livePictureList.forEach(img => {
              img.url = img.attachmentUrl;
            });
          } else {
            data.livePictureList = [];
          }
          this.abnormalDetail = res.data.data;

          if (this.$userInfo.userType != 2) {
            this.showServer = true;
          } else {
            const spIdsRes = await this.getServerSpIds();
            if (spIdsRes.includes(this.abnormalDetail.distributorId)) {
              this.showServer = true;
            } else {
              this.showServer = false;
            }
          }
          this.$gio.viewAssociateTask({
            eventID: this.abnormalData.abnormalNo
          });
          this.$gio.viewAssociateApplication({
            eventID: this.abnormalData.abnormalNo
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 查看
    handleJumpPage() {
      if (this.abnormalDetail.serviceType == 1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: this.abnormalDetail.workOrderNumber
          }
        });
      } else if (this.abnormalDetail.serviceType == 9 || this.abnormalDetail.serviceType == 11) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderDetail",
          query: {
            workOrderNumber: this.abnormalDetail.workOrderNumber
          }
        });
      } else if (this.abnormalDetail.serviceType == 2) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkorderTaskDetail",
          query: {
            workOrderNumber: this.abnormalDetail.workOrderNumber
          }
        });
      }
      this.$gio.mobilService_viewWorkorder({
        eventID: this.abnormalData.abnormalNo
      });
    },
    // 预览
    handleOpenFile() {
      const params = {
        url: encodeURI(this.abnormalDetail.fileUrl)
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
          this.$gio.mobilService_clickViewReport({
            eventID: this.abnormalData.abnormalNo
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 更改异常状态
    changeAbnormalStatus() {
      // 根据异常处理状态是转为已处理还是转为待处理
      const params = {
        abnormalStatus: this.abnormalStatus > 0 ? 0 : 1,
        abnormalIds: [this.id],
        priority: this.priorityForm.priorityVal
      };
      this.requestMethodPost("/device/check/abnormal/batchUpdate", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "处理成功"
          });
          this.$emit("refreshList");
          this.changeEventStatus({
            eventID: this.abnormalData.abnormalNo
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑优先级
    editPriority() {
      // 赋值
      this.priorityForm.priorityVal = this.abnormalDetail.priority;
      this.editPriorityDialog = true;
    },
    // 设备详情
    deviceDetail() {
      this.$router.push({
        path: "/EquipmentProfile/EquipmentProfileDetail",
        query: {
          deviceNumber: this.abnormalDetail.deviceNumber
        }
      });
      this.$gio.viewEventDeviceInfo({
        eventID: this.abnormalData.abnormalNo
      });
    },
    // 任务详情
    toTaskDetail() {
      this.$router.push({
        name: "taskDetail",
        query: {
          taskId: this.abnormalDetail.todoTaskId,
          taskType: 4
        }
      });
    },
    // 编辑优先级保存
    savePriority(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            abnormalId: this.id,
            priority: this.priorityForm.priorityVal,
            abnormalStatus: this.abnormalStatus
          };
          this.requestMethodGet("/device/check/abnormal/updatePriority", params).then(res => {
            if (res.data.code == 1000) {
              this.editPriorityDialog = false;
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.$emit("refreshList");
              this.$gio.changePriority({
                eventID: this.abnormalData.abnormalNo
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 关联设备任务
    relationDeviceTask() {
      this.chooseTask = true;
      this.$gio.selectInternalProcessPattern({
        eventID: this.abnormalData.abnormalNo,
        pattern: "关联设备任务"
      });
    },
    // 取消关联
    cancelTaskDialog() {
      this.chooseTask = false;
      this.$gio.cancelAssociateTask({
        operation: "点击取消关联按钮",
        eventID: this.abnormalData.abnormalNo
      });
    },
    // 关联任务确定
    confirmChoosePlan(list) {
      if (!list.length) {
        this.chooseTask = false;
        return;
      }
      let arr = [];
      list.forEach(it => {
        arr.push(it.planId);
      });
      const params = {
        abnormalId: this.id,
        associationType: 1,
        targetIds: arr
      };
      this.requestMethodPost("/device/check/abnormal/associate", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "关联成功"
          });
          this.chooseTask = false;
          this.taskSize = 5;
          this.taskCurrent = 1;
          this.getTaskTableData();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 创建设备任务
    createDeviceTask() {
      // 需要把已选中的设备数据带过去，异常的任务类型带过去，是选择设备还是选择润滑点
      this.$router.push({
        path: "/taskManager/createTaskNew",
        query: {
          pageFlag: "createAbnormal",
          abnormalId: this.id,
          deviceNumber: this.abnormalDetail.deviceNumber,
          pageType: "abnormal",
          abnormalDeviceId: this.abnormalDetail.deviceId
        }
      });
      this.$gio.selectInternalProcessPattern({
        eventID: this.abnormalData.abnormalNo,
        pattern: "创建设备任务"
      });
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
            this.activeQuestion = this.questionList[0].id;
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
    // 获取公司
    getCompanyData(val) {
      if (this.userInfo.userType == 2) return;
      let param = {
        size: 500,
        accountName: val
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
    // 创建申请单
    createApply() {
      if (this.userInfo.userType != 2) {
        this.getCompanyData("");
      }

      this.getApplyReasonConfTree();
      // this.handlePermission();
      this.questionForm = {
        description: ""
      };
      this.questionForm.spId = this.abnormalDetail.distributorId;
      // this.questionForm.spId = ""
      this.checkList = [];
      if (this.userInfo.userType == 2) {
        this.questionForm.contactUserId = [this.userInfo.userId];
      }
      this.createApplyDialog = true;
      ++this.selCompanyPeopleKey;
      this.$gio.selectMobilProcessPattern({
        eventID: this.abnormalData.abnormalNo,
        pattern: "创建申请单"
      });
    },
    handleResetAdd(formName) {
      this.createApplyDialog = false;
      this.executeUserName = "";
      this.executeUserRoles = "";
      this.executeUserId = "";
      this.showRoleNames = false;
      this.$refs[formName].resetFields();
    },
    // 确定新建申请单
    sureAddWorkOrder(formName) {
      if (this.userInfo.userType != 2 && this.assignPermissionsFlag && !this.executeUserId) {
        this.$message({
          message: "请选择执行人",
          type: "warning"
        });
        return;
      }
      if (this.SPList.length > 1 && !this.questionForm.spId) {
        this.$message({
          message: "请选择经销商",
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
      if (this.userInfo.userType != 2 && !this.applylist.serviceProperty) {
        this.$message({
          message: "请选择服务创盈属性",
          type: "warning"
        });
        return;
      }
      if (this.userInfo.userType != 2 && this.applylist.serviceProperty && this.applylist.serviceProperty == 4 && !this.applylist.incomeRmb) {
        this.$message({
          message: "请输入预估收益",
          type: "warning"
        });
        return;
      }
      if (this.userInfo.userType != 2 && this.applylist.serviceProperty && this.applylist.serviceProperty != 4 && !this.applylist.incomeBbl) {
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
      console.log(11222, this.questionForm.spId);
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let param = {
            customerId: this.questionForm.customerId,
            description: this.checkList.includes(2) ? this.questionForm.description : "",
            distributorId: this.questionForm.spId,
            reasonConfList: this.checkList,
            serviceApplyType: 1,
            serviceProperty: this.userInfo.userType == 2 ? 1 : this.applylist.serviceProperty,
            incomeBbl: this.applylist.incomeBbl,
            incomeRmb: this.applylist.incomeRmb
          };

          if (this.userInfo.userType != 2) {
            param.serviceApplyType = 2;
            param.distributorId = this.userInfo.orgInfo.companyId;
            param.executeUserId = this.executeUserId;
          } else {
            param.customerId = this.userInfo.orgInfo.companyId;
          }
          const uploadAssets = await this.$refs.uploadVideoImg.getUplaodAssets();
          Object.assign(param, uploadAssets);
          param.distributorId = this.questionForm.spId;
          this.requestMethodPost("/serviceApply/addServiceApplyOrder", param)
            .then(res => {
              this.loading = false;
              res = res.data;
              if (res.code == 1000) {
                const params = {
                  abnormalId: this.id,
                  associationType: 2,
                  targetIds: [res.data]
                };
                this.handleAssociate(params);
                this.handleResetAdd(formName);
                if (this.executeUserId != this.userInfo.userId) {
                  this.$router.push({
                    path: "/ServiceApplyList"
                  });
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
    // 关联申请单
    relationApplyBtn() {
      this.chooseApply = true;
      this.$gio.selectMobilProcessPattern({
        eventID: this.abnormalData.abnormalNo,
        pattern: "关联申请单"
      });
    },
    // 取消关联申请单
    cancelApplyDialog() {
      this.chooseApply = false;
      this.$gio.cancelAssociateApplication({
        operation: "点击取消关联按钮",
        eventID: this.abnormalData.abnormalNo
      });
    },
    // 确定关联申请单
    confirmChooseApply(list) {
      if (!list.length) {
        this.chooseApply = false;
        return;
      }
      let arr = [];
      list.forEach(it => {
        arr.push(it.id);
      });
      const params = {
        abnormalId: this.id,
        associationType: 2,
        targetIds: arr
      };
      this.handleAssociate(params);
    },
    handleAssociate(params) {
      this.requestMethodPost("/device/check/abnormal/associate", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "关联成功"
          });
          this.chooseApply = false;
          this.applySize = 5;
          this.applyCurrent = 1;
          this.getApplyTableData();
          this.$gio.associateApplications({
            eventID: this.abnormalData.abnormalNo
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    taskSizeChange(val) {
      this.taskSize = val;
      this.getTaskTableData();
    },
    taskCurrentChange(val) {
      this.taskCurrent = val;
      this.getTaskTableData();
    },
    applySizeChange(val) {
      this.applySize = val;
      this.getApplyTableData();
    },
    applyCurrentChange(val) {
      this.applyCurrent = val;
      this.getApplyTableData();
    },
    getTaskTableData() {
      const params = {
        current: this.taskCurrent,
        size: this.taskSize,
        abnormalId: this.id
      };
      this.requestMethodGet("/device/check/abnormal/relationTodoTasks", params).then(res => {
        if (res.data.code == 1000) {
          this.taskTableData = res.data.data.list;
          this.taskTotalNumber = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getApplyTableData() {
      const params = {
        current: this.applyCurrent,
        size: this.applySize,
        abnormalId: this.id
      };
      params.menuCode = "ServiceApply";
      this.requestMethodGet("/device/check/abnormal/relationServiceApplyOrders", params).then(res => {
        if (res.data.code == 1000) {
          this.applyTableData = res.data.data.list;
          this.applyTotalNumber = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 任务取消关联
    cancelTaskRelation(row) {
      this.cancelType = "task";
      this.cancelRow = row;
      this.cancelRelationDialog = true;
    },
    // 查看任务详情
    viewTaskDetail(row) {
      this.$router.push({
        name: "taskDetail",
        query: {
          taskId: row.taskId,
          taskType: row.taskType
        }
      });
      this.$gio.mobilService_clickViewReport({
        eventID: this.abnormalData.abnormalNo
      });
    },
    // 取消申请单关联
    cancelApplyRelation(row) {
      this.cancelType = "apply";
      this.cancelRow = row;
      this.cancelRelationDialog = true;
    },
    // 查看申请详情
    viewApplyDetail(row) {
      this.$router.push({
        path: "/ServiceApplyList/ServiceApplyDetail",
        query: {
          id: row.id
        }
      });
    },
    // 确认取消
    confirmCancel() {
      let params = {
        abnormalId: this.id
      };
      if (this.cancelType == "task") {
        // 取消后刷新关联任务列表
        params.associationType = 1;
        params.targetIds = [this.cancelRow.taskId];
      } else {
        // 取消后刷新关联申请单列表
        params.associationType = 2;
        params.targetIds = [this.cancelRow.id];
      }
      this.handleCancel(params);
    },
    handleCancel(params) {
      this.requestMethodPost("/device/check/abnormal/canalAssociate", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "取消成功"
          });
          this.cancelRelationDialog = false;
          if (this.cancelType == "task") {
            // 取消后刷新关联任务列表
            this.taskSize = 5;
            this.taskCurrent = 1;
            this.getTaskTableData();
          } else {
            // 取消后刷新关联申请单列表
            this.applySize = 5;
            this.applyCurrent = 1;
            this.getApplyTableData();
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 关闭抽屉
    closeDraw() {
      this.$emit("closeDraw");
    }
  }
};
</script>
<style lang="less" scoped>
.abnormal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.abnormal-desc-flex {
  display: flex;
  align-items: center;
}
/deep/ .dialog .el-input--small .el-input__inner {
  height: 36px !important;
  line-height: 36px !important;
}
.abnormal-content {
  padding: 20px;
  border-radius: 6px;
}
.abnormal-title-content {
  display: flex;
  align-items: center;
}
.abnormal-tag {
  width: 52px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 10px;
}
.abnormal-info-content {
  margin-top: 16px;
  display: flex;
  align-content: center;
}
.abnormal-flex {
  display: flex;
  flex-direction: column;
}
.abnormal-title {
  font-size: 13px;
  color: #999;
  font-weight: 400;
}
.abnormal-value {
  margin-top: 10px;
  font-size: 13px;
  color: #333;
}
.company-name {
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.abnormal-desc-content {
  border: 1px solid #e9e9e9;
  border-radius: 6px;
  padding: 20px;
}
.right-content {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.line {
  width: 4px;
  height: 14px;
  background-color: #dd0000;
}
.right-title {
  color: #000;
  margin-left: 10px;
  font-weight: bold;
}
.desc {
  margin: 20px 0;
}
.abnormal-desc {
  font-size: 13px;
  color: #333;
  margin-left: 16px;
}
/deep/ .el-drawer__body {
  overflow-y: auto;
}
/deep/ .el-collapse {
  border: none;
}
/deep/ .el-collapse-item {
  border-top: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  margin-bottom: 20px;
}
/deep/.el-checkbox {
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e7ed;
  margin-right: 0;
}
/deep/ .el-popover {
  width: 80px;
  text-align: center;
  padding: 8px 0;
}
/deep/.el-checkbox__label {
  display: inline-grid;
  white-space: pre-line;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
}
/deep/ .el-collapse-item__header {
  background: #f9f9f9;
  padding: 0 20px;
}
/deep/ .dialog .el-input--small .el-input__inner {
  height: 48px !important;
  line-height: 48px !important;
  background: #f9f9f9 !important;
}
/deep/ .dialog input::-webkit-input-placeholder {
  color: #333;
}
/deep/ .dialog-contact input::-webkit-input-placeholder {
  color: #333;
}
/deep/ .dialog-contact .el-input--small .el-input__inner {
  height: 80px !important;
  line-height: 80px !important;
  background: #f9f9f9 !important;
}
.form-item-outline:hover {
  border-color: #e43333;
}
.form-item-outline {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
}
.select_person {
  width: 80%;
  height: 36px;
  line-height: 36px;
  padding-left: 20px;
}
</style>
