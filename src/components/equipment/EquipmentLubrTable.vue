<template>
  <div style="position:relative">
    <div class="equipment-lubr-Table" :style="mainminheight" id="equipmentLubrDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item label="所属客户" v-if="userInfo.userType != 2" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length > 0 ? 'color:#606266;' : ''">
              {{ selectCustomerList.length > 0 ? "指定客户" + selectCustomerList.length : "请选择" }}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length > 0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item style="width:20%" v-if="showFilterStatus">
            <el-select v-model="filterType" placeholder="请选择" @change="filterTypeList">
              <el-option label="已处理" :value="2" />
              <el-option label="待处理" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button type="danger" size="small" v-if="userInfo.userType == 1" v-has="PC_rateapply_create" @click="addTable">发起申请</el-button>
          <custom-field @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="deviceLubs" style="display:inline-block;margin-left:10px;"></custom-field>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table
        class="table"
        :tableHeader="tableDataHeader"
        :tableData="deviceLubesData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        :listEmptyType="listEmptyType"
        :limitFlag="limitFlag"
        @changeSearch="tableTitleSearch"
        @changeSortTable="changeSortTable"
      >
        <template v-slot:deviceLubesNo="slotProps">
          <el-table-column
            fixed
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="申请单号"
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
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.deviceLubesNo }}</span>
                <div>
                  <el-button class="copy_text" type="text" style="padding: 0px" v-clipboard:copy="scope.row.deviceLubesNo" v-clipboard:success="onCopy" v-clipboard:error="onError">
                    <img src="../../assets/icon-copy.png" alt="" style="width: 16px; height: 16px; position: relative; top: 3px; cursor: pointer; margin-left: 8px" />
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:applyReason="slotProps">
          <el-table-column
            fixed
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="价格申请原因"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="价格申请原因"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center;justify-content: space-between;">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.priceApplyReason }}</span>
                <div>
                  <el-button class="copy_text" type="text" style="padding: 0px" v-clipboard:copy="scope.row.priceApplyReason" v-clipboard:success="onCopy" v-clipboard:error="onError">
                    <img src="../../assets/icon-copy.png" alt="" style="width: 16px; height: 16px; position: relative; top: 3px; cursor: pointer; margin-left: 8px" />
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:disCompanyName="slotProps">
          <el-table-column
            v-if="userInfo.userType == 0"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="经销商"
          >
            <template slot="header">
              <column-header
                title="经销商"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                <el-tooltip class="item" effect="dark" :content="scope.row.disCompanyName" placement="top-start">
                  <div class="nowrap-name">{{ scope.row.disCompanyName }}</div>
                </el-tooltip>
                <img v-if="scope.row.assistSpFlag" src="../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:companyName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="客户"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.companyName }}</span>
                <span class="self-tips" v-if="scope.row.customerCompanyType == 0">直</span>
                <img v-if="scope.row.pesFlag == '1' || scope.row.pesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.pesFlag == '2' || scope.row.pesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:applyUserName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="申请人"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="申请人"
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
                    <img :src="applyUserDetail.headUrl ? applyUserDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
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
                  @click="createPersonDetail(scope)"
                  >{{ scope.row.applyUserName || "-" }}</span
                >
              </el-popover>
            </template>
          </el-table-column>
        </template>
        <template v-slot:status="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="状态"
          >
            <!-- <template slot="header" v-if="showFilterStatus">
              <column-header
                title="状态"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="false"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template> -->
            <template slot-scope="scope">
              <span class="workOrder-Status" style="color: #001450" v-if="scope.row.status == '0'">未提交</span>
              <span class="workOrder-Status" style="color: #dd0000" v-if="scope.row.status == '1'">进行中</span>
              <span class="workOrder-Status" style="color: #008888" v-if="scope.row.status == '2'">已审批</span>
              <span class="workOrder-Status" style="color: #999999" v-if="scope.row.status == '3'">已驳回</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" fixed="right" slot="operation" label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-link @click="downloadPDF(scope.row)" style="margin-right: 10px; color: rgb(0, 20, 80)" :underline="false" v-if="scope.row.status == 2">下载PDF </el-link>
            <el-link @click="handleLook(scope.row)" style="margin-right: 10px; color: rgb(0, 20, 80)" :underline="false">查看</el-link>
            <el-link
              @click="handleEdit(scope.row)"
              style="margin-right: 10px; color: rgb(0, 20, 80)"
              :underline="false"
              v-if="(scope.row.status == 0 || scope.row.status == 3) && userInfo.userType == 1 && scope.row.applyUserId == userInfo.userId"
              >编辑</el-link
            >
            <el-link @click="getDeviceLubesProcess(scope.row)" style="margin-right: 10px; color: rgb(0, 20, 80)" :underline="false" v-if="scope.row.status != 0">查看审批流</el-link>
            <el-link @click="handleRecall(scope.row)" style="margin-right: 10px; color: rgb(0, 20, 80)" :underline="false" v-if="scope.row.recall && userInfo.userType == 1">撤回</el-link>
            <el-link @click="handleCopy(scope.row)" style="margin-right: 10px; color: rgb(0, 20, 80)" :underline="false" v-if="scope.row.applyUserId == userInfo.userId && userInfo.userType == 1"
              >复制</el-link
            >
            <el-link type="danger" @click="handleDelete(scope.row)" :underline="false" v-if="scope.row.status == 0 && userInfo.userType == 1 && scope.row.applyUserId == userInfo.userId">删除</el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <!--完善邮箱弹窗 -->
      <el-dialog :visible.sync="dialogFormVisible" width="500px" class="email-dialog" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="right">
          <el-row style="margin-bottom: 25px">
            <el-col :span="24">
              <div style="font-size: 16px">
                <span class="title">公司名称：</span><span style="color: #666">{{ userInfo.orgInfo.companyName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 25px">
            <el-col :span="24">
              <div style="font-size: 16px">
                <span class="title">姓名：</span><span style="color: #666">{{ userInfo.userName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 25px">
            <el-col :span="24">
              <div style="font-size: 16px">
                <span class="title">联系电话：</span><span style="color: #666">{{ userInfo.phonenumber }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 25px" class="email-font">
            <el-col :span="24">
              <el-form-item label="邮箱：" prop="email">
                <el-input size="small" v-model="ruleForm.email" clearable autocomplete="off" style="width: 280px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: right">
          <el-button @click="dialogFormVisible = false" size="small">取消</el-button>
          <el-button type="danger" @click="saveEmail('ruleForm')" size="small">保存</el-button>
        </div>
      </el-dialog>
      <!-- 无申请权限弹窗 -->
      <el-dialog :visible.sync="applyDialogFlag" :append-to-body="true" width="600px" :close-on-click-modal="false" class="select-device">
        <div>非常抱歉，贵组织还没有分管的区域经理和区域技术经理，或区域经理和区域高级工程师。</div>
        <br />
        <div>
          请先邮件联系 美孚管理员{{ emailNameInfo.name }}（<span style="color: #dd0000">{{ emailNameInfo.email }}</span
          >） 解决分管事宜。解决后即可新建设备润滑表。
        </div>
      </el-dialog>
      <!-- 选择设备 -->
      <!-- <el-dialog title="选择设备" :visible.sync="selectDeviceVisiable" :append-to-body="true" width="1000px" :close-on-click-modal="false" class="select-device">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px">
          <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; font-weight: bold; line-height: 14px; color: #000; display: flex; align-items: center">
            已选设备
            <span style="color: #dd0000; margin-left: 4px">{{ selectionDevice.length }}</span>
            <span style="color: #999; margin-left: 16px; font-weight: 400">(温馨提示：同类设备可以只选择一台)</span>
          </div>
          <div>
            <el-select
              v-model="queryDeviceParams.companyNumber"
              @change="getDeviceByPage('customer')"
              size="small"
              filterable
              :filter-method="customerAllFilter"
              placeholder="选择客户"
              style="width: 180px; margin-right: 15px"
            >
              <el-option v-for="item in customerList" :key="item.companyNumber" :label="item.companyName" :value="item.companyNumber"></el-option>
            </el-select>
            <el-input
              size="small"
              @change="getDeviceByPage"
              v-model="queryDeviceParams.deviceName"
              maxlength="25"
              placeholder="请输入设备名称、所属设备类型"
              style="width: 280px; margin-right: 15px"
              clearable
            >
            </el-input>
          </div>
        </div>
        <div v-if="selectDeviceVisiable">
          <el-table
            :data="deviceList"
            tooltip-effect="dark"
            ref="tableAddLumData"
            v-el-table-infinite-scroll="loadData"
            height="400px"
            :empty-text="queryDeviceParams.companyNumber ? '暂无数据' : '暂无数据，请先选择客户'"
            :header-cell-style="{ background: '#f7f7f7' }"
            v-loading="loadingLum"
            class="add-lum"
            :row-key="rowKey"
            @selection-change="handleSelectChange"
          >
            <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
            <el-table-column prop="deviceName" min-width="15%" label="设备名称"> </el-table-column>
            <el-table-column prop="deviceTypeName" min-width="15%" label="所属设备类型"> </el-table-column>
            <el-table-column prop="workshopName" min-width="15%" label="所属车间"> </el-table-column>
            <el-table-column prop="createTime" min-width="15%" label="创建日期"> </el-table-column>
          </el-table>
        </div>
        <div slot="footer" style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-size: 13px; color: #000"
            >没找到相关设备？请前往
            <span style="color: #001450; text-decoration: underline; cursor: pointer" @click="handleAddDevice" v-if="queryDeviceParams.companyNumber">创建设备</span>
            <span style="color: rgb(128, 138, 168); text-decoration: underline; cursor: not-allowed" v-else>创建设备</span>
            <span style="color: #001450; margin-left: 24px; cursor: pointer" @click="getDeviceByPage('refresh')" v-if="queryDeviceParams.companyNumber"
              ><i class="el-icon-refresh"> </i> 刷新设备列表</span
            >
            <span style="color: rgb(128, 138, 168); margin-left: 24px; cursor: not-allowed" v-else><i class="el-icon-refresh"> </i> 刷新设备列表</span>
          </span>
          <div>
            <el-button type="danger" plain @click="selectDeviceVisiable = false" size="small">取消</el-button>
            <el-button type="danger" @click="handleSubmitAddLum()" size="small">生成设备润滑表</el-button>
          </div>
        </div>
      </el-dialog> -->
      <el-dialog title="选择客户" :visible.sync="selectDeviceVisiable" :append-to-body="true" width="500px" :close-on-click-modal="false" class="select-device">
        <div>
          <span style="color:#dd0000;display:inline-block;padding-right:3px;">*</span>客户<el-select
            v-model="queryDeviceParams.companyNumber"
            @change="getDeviceByPage('customer')"
            size="small"
            filterable
            :filter-method="customerAllFilter"
            placeholder="选择客户"
            style="width: 250px; margin-left: 20px"
          >
            <el-option v-for="item in customerList" :key="item.companyNumber" :label="item.companyName" :value="item.companyNumber"></el-option>
          </el-select>
        </div>
        <div slot="footer">
          <el-button type="danger" plain @click="selectDeviceVisiable = false" size="small">取消</el-button>
          <el-button type="danger" @click="handleSelectDevice" size="small">下一步</el-button>
        </div>
      </el-dialog>
      <!-- 查看审批流程 -->
      <el-dialog title="查看审批流程" :visible.sync="lookProcessVisiable" :append-to-body="true" width="500px" :close-on-click-modal="false" class="select-device look-process">
        <div style="max-height: 600px; overflow: auto; padding-top: 10px">
          <el-timeline>
            <el-timeline-item
              :icon="item.actionType == 4 ? 'el-icon-more' : item.actionType == 0 ? 'el-icon-close' : 'el-icon-check'"
              :color="item.actionType == 4 ? '#999' : item.actionType == 0 ? '#dd0000' : '#008888'"
              size="large"
              v-for="(item, index) in deviceLubesProcessList"
              :key="index"
            >
              <div style="padding-bottom: 10px">
                <div class="title" v-if="item.actionType == 1">已提交申请</div>
                <div class="title" style="color: #999" v-if="item.actionType == 4">
                  等待埃克森美孚公司{{ item.step == 2 ? "区域技术经理/区域总工程师" : "区域经理" }}审批<span v-if="item.nextUser != null && item.nextUser.length > 1">(或签)</span>
                </div>
                <div class="title" v-if="item.actionType == 2">埃克森美孚公司{{ item.roleName }}已审批</div>
                <div class="title" v-if="item.actionType == 0">
                  埃克森美孚公司{{ item.roleName }}
                  <span style="color: #dd0000"> 驳回申请</span>
                </div>
                <div class="content" :style="item.actionType == 4 ? 'color:#999' : 'color:#666'" v-if="(item.actionType == 2 || item.actionType == 4 || item.actionType == 0) && item.nextUser == null">
                  {{ item.userName }}（{{ item.roleName }})
                  <span style="color: #001450; margin-left: 10px">{{ item.phonenumber }}</span>
                </div>
                <div
                  class="content"
                  :style="item.actionType == 4 ? 'color:#999' : 'color:#666'"
                  v-if="(item.actionType == 2 || item.actionType == 4 || item.actionType == 0) && item.nextUser != null && item.nextUser.length"
                >
                  <div v-for="(it, index1) in item.nextUser" :key="index1">
                    {{ it.userName }}（{{ it.roleName }})
                    <span style="color: #001450; margin-left: 10px">{{ it.phonenumber }}</span>
                  </div>
                </div>
                <div class="content" style="line-height: 20px" v-if="item.actionType == 0"><span style="color: #dd0000">驳回原因：</span>{{ item.remark }}</div>
                <div class="title" v-if="item.actionType == 3">申请已审批通过</div>
                <div class="content" v-if="item.actionType != 4">
                  {{ item.createTime }}
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-dialog>
      <customer-list
        ref="selectCustomer"
        :selectCustomerList="selectCustomerList"
        :showCustomerDialog="showCustomerDialog"
        @handleSubmitCustomer="handleSubmitCustomer"
        @handleCloseCustomer="handleCloseCustomer"
      ></customer-list>
      <!-- 选择润滑点 -->
      <!-- <lupDialogNew
        :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
        :singleFlag="false"
        :checkedDevice="checkedDevice"
        :urlType="urlType"
        :companyId="companyId"
        :companyNumber="queryDeviceParams.companyNumber"
        v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
        v-on:confirmChooseLup="confirmChooseLup"
        >
      </lupDialogNew> -->
      <lupDialogNew
        :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
        :singleFlag="false"
        :checkedDevice="checkedDevice"
        :urlType="urlType"
        :companyName="this.customerCompanyName"
        :companyId="companyId"
        :companyNumber="queryDeviceParams.companyNumber"
        v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
        v-on:confirmChooseLup="confirmChooseLup"
      >
      </lupDialogNew>
    </div>
  </div>
</template>
<script>
import lupDialogNew from "../spotInspection/components/chooseLubricationPointWorkorder.vue";
import customField from "../tableComponents/customField.vue";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
import customerList from "../tableComponents/customerList";
import commonJS from "../tableComponents/tableCommon.js";
export default {
  name: "EquipmentLubrTable",
  mixins: [commonJS],
  data() {
    return {
      filterType: 1,
      urlType: "lubrTable",
      chooseDeviceAndLupDialog: false,
      checkedDevice: [],
      applyUserDetail: {},
      dialogFormVisible: false,
      selectDeviceVisiable: false,
      applyDialogFlag: false,
      lookProcessVisiable: false,
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      queryParams: {
        companyId: "",
        companyName: "", // 客户名称
        status: "1", // 状态
        orderBy: "deviceLubesNo", //默认工单编号降序排序
        descFlag: true
      },
      queryDeviceParams: {
        companyNumber: "", // 客户编码
        deviceName: "" // 状态
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      ruleForm: {
        email: ""
      },
      rules: {
        email: [{ required: true, message: "请输入邮箱地址", trigger: "blur" }, { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }]
      },
      deviceList: [],
      customerList: [],
      companyId: 0,
      customerCompanyName: "",
      currentDevicePage: 1,
      selectionDevice: [],
      statusList: [
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
          label: "已审批"
        },
        {
          value: 3,
          label: "已驳回"
        }
      ],
      statusMap: {
        0: "未提交",
        1: "进行中",
        2: "已审批",
        3: "已驳回"
      },
      pagenation: {
        current: 1,
        size: 30
      },
      deviceLubesData: [],
      deviceLubesProcessList: [],
      totalNumber: 0, // 总条数
      deviceTotalCount: 0, // 设备总条数
      dataRecordTableData: [],
      selectList: [],
      dialogTitle: "",
      loading: false, // 是否加载
      loadingLum: false,
      emailNameInfo: {},
      customFieldlistUnit: [
        {
          fieldName: "deviceLubesNo",
          visible: 2
        },
        {
          fieldName: "disCompanyName",
          visible: 1
        },
        {
          fieldName: "priceApplyReason",
          visible: 1
        },
        {
          fieldName: "companyName",
          visible: 1
        },
        {
          fieldName: "applyUserName",
          visible: 1
        },
        {
          fieldName: "createTime",
          visible: 1
        },
        {
          fieldName: "status",
          visible: 1
        },
        {
          fieldName: "operation",
          visible: 2
        }
      ],
      customFieldlist: [],
      tableHeight: null,
      tableDataHeaderInit: {
        deviceLubesNo: { filterType: "input", paramValue: "deviceLubesNo", changeValue: "", sortTypeVal: "sortDown", slot: "deviceLubesNo", label: "申请单号", fixed: "left", width: "180" },
        disCompanyName: { filterType: "input", paramValue: "disCompanyName", changeValue: "", slot: "disCompanyName", label: "经销商", fixed: "left", width: "200" },
        priceApplyReason: { filterType: "input", paramValue: "priceApplyReason", changeValue: "", prop: "priceApplyReason", slot: "applyReason", label: "价格申请原因", width: "180", tooltip: true },
        companyName: { label: "客户", slot: "companyName", width: "250" },
        applyUserName: { filterType: "input", paramValue: "applyUserName", changeValue: "", slot: "applyUserName", label: "申请人", width: "130" },
        createTime: { filterType: "dateRange", paramValue: "createTime", changeValue: "", sortTypeVal: "sortDefault", prop: "createTime", label: "创建时间", width: "180" },
        status: {
          filterType: "selection",
          paramValue: "status",
          selectMultiple: true,
          changeValue: 1,
          selectOptions: [{ code: "0", name: "未提交" }, { code: "1", name: "进行中" }, { code: "2", name: "已审批" }, { code: "3", name: "已驳回" }],
          label: "状态",
          slot: "status",
          width: "130"
        },
        operation: { slot: "operation", label: "操作" }
      },
      tableDataHeader: [],
      headImg: require("../../assets/headImg.png"),
      listEmptyType: "device_lube",
      limitFlag: false,
      showCustomerDialog: false,
      selectCustomerList: [],
      filterCode: ["sa", "fes", "ace-fes"],
      showFilterStatus: false
    };
  },
  components: {
    "custom-field": customField,
    "custom-table": customTable,
    "column-header": columnHeader,
    "customer-list": customerList,
    lupDialogNew
  },
  filters: {
    status(val) {
      switch (val) {
        case 0:
          return "未提交";
        case 1:
          return "进行中";
        case 3:
          return "已驳回";
        case 2:
          return "已审批";
        default:
          break;
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
    if (from.path == "/EquipmentLubrTable/EquipmentLubrTableDetai" || from.path == "/EquipmentLubrTable/EditEquipmentLubrTable" || from.path == "/EquipmentLubrTable/AddEquipmentLubrTable") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  created() {
    this.$userInfo.accessTemplates.forEach(accessTemplate => {
      if (accessTemplate.accessTemplateCode && this.filterCode.includes(accessTemplate.accessTemplateCode)) {
        this.showFilterStatus = true;
      } else {
        this.showFilterStatus = false;
      }
    });
    if (this.showFilterStatus) {
      this.queryParams.status = 1;
    } else {
      this.queryParams.status = "";
    }
    if (this.userInfo.userType == 1) this.limitFlag = true;
    // 美孚
    if (this.userInfo.userType == 0) {
      // this.queryParams.status = 1;
      // 判断当前是否是FES/SA
      this.requestMethodGet("/device/lubes/getRoleCode", {})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data == "sa" || res.data == "fes" || res.data == "ace-fes") {
              this.statusList = [
                {
                  value: 1,
                  label: "待处理"
                },
                {
                  value: 2,
                  label: "已处理"
                }
              ];
              this.tableDataHeader.forEach(item => {
                if (item.paramValue == "status") {
                  item.selectOptions = [{ code: 1, name: "待处理" }, { code: 2, name: "已处理" }];
                }
              });
            } else {
              this.statusList = [
                {
                  value: 1,
                  label: "进行中"
                },
                {
                  value: 2,
                  label: "已审批"
                },
                {
                  value: 3,
                  label: "已驳回"
                }
              ];
              this.tableDataHeader.forEach(item => {
                if (item.paramValue == "status") {
                  item.selectOptions = [{ code: 1, name: "进行中" }, { code: 2, name: "已审批" }, { code: 3, name: "已驳回" }];
                }
              });
            }
            this.getDeviceLubesList(); // 获取列表
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    } else {
      this.tableDataHeader.forEach(item => {
        if (item.paramValue == "status") {
          item.selectOptions = [{ code: 0, name: "未提交" }, { code: 1, name: "进行中" }, { code: 2, name: "已审批" }, { code: 3, name: "已驳回" }];
        }
      });
      this.getDeviceLubesList(); // 获取列表
    }
  },
  mounted() {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
      if (this.queryParams.companyId) this.selectCustomerList = this.queryParams.companyId.split(",");
      this.pagenation.current = this.queryParams.current;
      this.pagenation.size = this.queryParams.size;
    }
    this.getCustomerList("");
    this.getCustomFieldList(); //获取自定义字段列表
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  methods: {
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false;
    },
    confirmChooseLup(list) {
      // 将对应的润滑点放在设备的deviceLubesLubs中
      let deviceList = [];
      let deviceListUni = _.uniqBy(list, "deviceId");
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
              lubricationId: "",
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
      this.$router.push({
        path: "/EquipmentLubrTable/AddEquipmentLubrTable",
        query: {
          companyId: this.companyId,
          companyName: this.customerCompanyName,
          companyNumber: this.queryDeviceParams.companyNumber,
          deviceList: JSON.stringify(deviceList)
        }
      });
      this.$gio.selectDevice({
        customer: this.queryParams.companyName,
        operation: "弹窗中点击生成设备润滑表"
      });
      this.chooseDeviceAndLupDialog = false;
    },
    handleCloseCustomer() {
      this.showCustomerDialog = false;
    },
    handleClearCustomer() {
      this.selectCustomerList = [];
      this.queryParams.companyId = "";
      this.getDeviceLubesList();
      this.$refs["selectCustomer"].clearSelectCustomer();
    },
    tableTitleSearch(obj) {
      let searchVal = obj.changeValue;
      this.tableDataHeader.forEach(item => {
        if (obj.paramValue == item.paramValue) {
          item.changeValue = searchVal === 0 || searchVal === false ? searchVal : searchVal || "";
        }
      });
      if (obj.paramValue == "createTime") {
        if (searchVal) {
          this.queryParams.createTimeStart = searchVal[0];
          this.queryParams.createTimeEnd = searchVal[1];
        } else {
          this.queryParams.createTimeStart = "";
          this.queryParams.createTimeEnd = "";
        }
      } else if (obj.paramValue == "status") {
        this.queryParams[obj.paramValue] = searchVal.toString();
      } else {
        this.queryParams[obj.paramValue] = searchVal;
      }
      this.pagenation.current = 1;
      this.getDeviceLubesList();
    },
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
        if (item.sortTypeVal && item.paramValue == this.queryParams.orderBy) {
          item.sortTypeVal = sortVal;
        } else if (item.sortTypeVal && item.paramValue != this.queryParams.orderBy) {
          item.sortTypeVal = "sortDefault";
        }
      });
      this.getDeviceLubesList();
    },
    handleClearSearch() {
      if (this.queryParams.companyId) {
        this.$refs["selectCustomer"].clearSelectCustomer();
      }
      this.pagenation = {
        current: 1,
        size: 30
      };
      this.queryParams = {
        companyId: "",
        deviceLubesNo: "",
        disCompanyName: "",
        priceApplyReason: "",
        companyName: "",
        applyUserName: "",
        createTimeStart: "",
        createTimeEnd: "",
        status: ""
      };
      this.selectCustomerList = [];
      this.tableDataHeader.forEach(item => {
        item.changeValue = "";
      });
      this.getDeviceLubesList();
    },
    showSelectCustomer() {
      this.showCustomerDialog = true;
    },
    handleSubmitCustomer(e) {
      let selectList = e.map(item => {
        return item.companyId;
      });
      this.selectCustomerList = selectList;
      this.queryParams.companyId = selectList.join(",");
      (this.pagenation = {
        current: 1,
        size: 30
      }),
        this.getDeviceLubesList();
      this.showCustomerDialog = false;
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "deviceLubs");
        if (index != -1) {
          let fieldDtoInfos = fieldDtoList[index].fieldDtoInfos;
          customFieldlistUnit = fieldDtoInfos.length == 0 ? this.customFieldlistUnit : fieldDtoInfos;
        } else {
          customFieldlistUnit = this.customFieldlistUnit;
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
      if (this.tableDataHeaderInit.selection) {
        tableDataHeader.unshift(this.tableDataHeaderInit.selection);
      }
      this.tableDataHeader = tableDataHeader;
      if (this.$route.params.isSaveQuery) {
        let queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
        if (sessionStorage.getItem("queryParams")) {
          this.tableDataHeader.forEach(item => {
            if (item.paramValue == "createTime" && queryParams.createTimeStart && queryParams.createTimeEnd) {
              item.changeValue = [queryParams.createTimeStart, queryParams.createTimeEnd];
            } else if (item.paramValue == "deviceLubesNo") {
              item.changeValue = queryParams.deviceLubesNo;
            } else if (item.paramValue == "disCompanyName") {
              item.changeValue = queryParams.disCompanyName;
            } else if (item.paramValue == "priceApplyReason") {
              item.changeValue = queryParams.priceApplyReason;
            } else if (item.paramValue == "applyUserName") {
              item.changeValue = queryParams.applyUserName;
            } else if (item.paramValue == "status") {
              let statusArr = [];
              item.selectOptions.forEach(it => {
                if (queryParams.status.includes(it.code)) statusArr.push(Number(it.code));
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
      if (this.tableDataHeaderInit.selection) {
        tableDataHeader.unshift(this.tableDataHeaderInit.selection);
      }
      this.tableDataHeader = tableDataHeader;
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let equipmentLubrDiv = 0;
        let searchFormHeight = 0;
        if (document.getElementById("equipmentLubrDiv")) {
          equipmentLubrDiv = document.getElementById("equipmentLubrDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(equipmentLubrDiv) - Number(searchFormHeight) - 40;
      }, 200);
    },
    customerAllFilter(val) {
      this.getCustomerList(val);
    },
    handleLook(row) {
      this.$router.push({
        path: "/EquipmentLubrTable/EquipmentLubrTableDetai",
        query: {
          id: row.id
        }
      });
      this.$gio.clickButtonUnderOperation({
        operation: "点击查看按钮",
        applicationNumber: row.deviceLubesNo,
        customer: this.$userInfo.userType == 0 ? row.disCompanyName : row.companyName
      });
      this.$gio.viewApplyInfoDetails({
        customer: this.$userInfo.userType == 0 ? row.disCompanyName : row.companyName,
        applicationNumber: row.deviceLubesNo
      });
    },
    handleEdit(row) {
      this.$router.push({
        path: "/EquipmentLubrTable/EditEquipmentLubrTable",
        query: {
          id: row.id
        }
      });
      this.$gio.clickButtonUnderOperation({
        operation: "点击编辑按钮",
        customer: this.$userInfo.userType == 0 ? row.disCompanyName : row.companyName,
        applicationNumber: row.deviceLubesNo
      });
      this.$gio.toEditLubricationTablePage({
        customer: this.$userInfo.userType == 0 ? row.disCompanyName : row.companyName,
        applicationNumber: row.deviceLubesNo,
        entrance: "操作下点击编辑按钮"
      });
    },
    // 查看申请人详情
    createPersonDetail(scope) {
      this.applyUserDetail = {};
      if (scope.row.applyUserId) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        let param = {
          userId: scope.row.applyUserId
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.$refs[`popovers-${scope.$index}`].doShow();
                this.applyUserDetail = res.data;
                if (this.applyUserDetail.avatar) {
                  this.getFullUrl(this.applyUserDetail.avatar);
                }
                if (this.applyUserDetail.roleNames) {
                  this.applyUserDetail.roleNames = this.applyUserDetail.roleNames.join(",");
                }
                if (this.applyUserDetail.phonenumber) {
                  const phoneNum = this.applyUserDetail.phonenumber;
                  this.applyUserDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                }
              } else {
                this.$refs[`popover-${scope.$index}`].doClose();
                this.$message({
                  message: "人员不存在",
                  type: "warning"
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
    },
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.applyUserDetail.headUrl = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取流程详情
    getDeviceLubesProcess(row) {
      let params = {
        id: row.id
      };
      this.deviceLubesProcessList = [];
      this.requestMethodGet("/device/lubes/getDeviceLubesProcess", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.deviceLubesProcessList = res.data;
            this.lookProcessVisiable = true;
            this.$gio.clickButtonUnderOperation({
              operation: "点击查看审批流按钮",
              customer: this.$userInfo.userType == 0 ? row.disCompanyName : row.companyName,
              applicationNumber: row.deviceLubesNo
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
    getAdminInfoForDeviceLube() {
      this.requestMethodGet("/device/lubes/getAdminInfoForDeviceLubes", {})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.emailNameInfo = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 复制成功
    onCopy(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制失败
    onError(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    addTable() {
      this.requestMethodGet("/device/lubes/isSFExist", {})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.deviceList = [];
            this.queryDeviceParams = {
              companyNumber: "",
              deviceName: ""
            };
            this.selectDeviceVisiable = true;
            this.$gio.clickCreateButtonOfLubricationTable();
          } else if (res.code == 4600) {
            this.getAdminInfoForDeviceLube();
            this.applyDialogFlag = true;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    saveEmail(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.requestMethodPost("/device/lubes/setUserEmail", this.ruleForm, true)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "设置成功",
                  type: "success"
                });
                this.userInfo.email = this.ruleForm.email;
                sessionStorage.setItem("userInfo", JSON.stringify(this.userInfo));
                // this.$cookies.set("userInfo", JSON.stringify(this.userInfo));
                this.dialogFormVisible = false;
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        } else {
          console.log("error submit!!");
          return false;
        }
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
            id: row.id
          };
          const formData = new FormData();
          formData.append("id", row.id);
          this.requestMethodPost("/device/lubes/deleteDeviceLubes", formData)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getDeviceLubesList();
                this.$gio.clickButtonUnderOperation({
                  operation: "点击删除按钮",
                  customer: this.$userInfo.userType == 0 ? row.disCompanyName : row.companyName,
                  applicationNumber: row.deviceLubesNo
                });
                this.$gio.deleteLubricationTable({
                  operation: "点击删除按钮",
                  customer: this.$userInfo.userType == 0 ? row.disCompanyName : row.companyName,
                  applicationNumber: row.deviceLubesNo
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 撤回
    handleRecall(row) {
      this.$confirm("确认撤回?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: row.id
          };
          const paramsFormData = new FormData();
          paramsFormData.append("id", row.id);
          this.requestMethodPost("/device/lubes/reCallDeviceLubes", paramsFormData)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "撤回成功",
                  type: "success"
                });
                this.getDeviceLubesList();
                this.$gio.clickButtonUnderOperation({
                  operation: "点击撤回按钮",
                  customer: this.$userInfo.userType == 0 ? row.disCompanyName : row.companyName,
                  applicationNumber: row.deviceLubesNo
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 复制数据
    handleCopy(row) {
      let params = {
        deviceLubesId: row.id
      };
      this.loading = true;
      this.requestMethodGet("/device/lubes/copyDeviceLubes", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.getDeviceLubesList();
            this.$gio.clickButtonUnderOperation({
              operation: "点击复制按钮",
              customer: this.$userInfo.userType == 0 ? row.disCompanyName : row.companyName,
              applicationNumber: row.deviceLubesNo
            });
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
    },
    filterTypeList() {
      this.pagenation = {
        current: 1,
        size: 30
      };
      this.getDeviceLubesList();
    },
    // 获取列表
    getDeviceLubesList() {
      this.loading = true;
      let params = {
        ...this.queryParams,
        ...this.pagenation
      };

      if (this.showFilterStatus) {
        params.type = this.filterType;
      }
      params.menuCode = "EquipmentLubrTable";
      this.selectionDevice = [];
      this.deviceLubesData = [];
      delete params.status;
      this.requestMethodGet("/device/lubes/getDeviceLubesList", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.deviceLubesData = res.data.list;
            this.totalNumber = res.data.totalCount;
            this.$gio.filterLubricationTable({
              customer: this.queryParams.companyName,
              lubrTableStatus: this.statusMap[this.queryParams.status]
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
    // 获取客户列表
    getCustomerList(val) {
      let params = {
        size: 3000,
        onlyNoDaAccoutFlag: true,
        accountName: val,
        serviceType: 1,
        menuCode: "CustomerProfileList"
      };
      this.requestMethodPost("/web/customer/filterAccount", params)
        .then(res => {
          res = res.data;
          console.log("this is resresres", res);
          if (res.code == 1000) {
            this.customerList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 根据客户查询设备列表
    queryDeviceByPage(val) {
      if (!this.queryDeviceParams.companyNumber) {
        return;
      }
      this.loadingLum = true;
      let params = {
        customerNumber: this.queryDeviceParams.companyNumber,
        deviceName: this.queryDeviceParams.deviceName,
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
    getDeviceByPage(val) {
      if (val == "customer") {
        let row = this.customerList.filter(item => {
          return this.queryDeviceParams.companyNumber == item.companyNumber;
        });
        this.companyId = row[0].companyId;
        this.customerCompanyName = row[0].companyName;
        this.selectionDevice = [];
        // this.$refs.tableAddLumData.clearSelection();
      }
      if (val == "refresh") {
        this.queryDeviceParams.deviceName = "";
      }
      // this.currentDevicePage = 1;
      // this.queryDeviceByPage();
    },
    handleSelectDevice() {
      if (!this.queryDeviceParams.companyNumber) {
        this.$message({
          message: "请选择客户",
          type: "warning"
        });
        return;
      }
      this.$gio.selectDeviceOfLubricationTable({
        customer: this.customerCompanyName
      });
      this.selectDeviceVisiable = false;
      this.chooseDeviceAndLupDialog = true;
    },
    rowKey(row) {
      return row.deviceNumber;
    },
    loadData() {
      if (!this.loadingLum && this.queryDeviceParams.companyNumber && this.deviceList.length < this.deviceTotalCount) {
        ++this.currentDevicePage;
        this.queryDeviceByPage("scroll");
      }
    },
    // 选择设备
    handleSelectChange(selection) {
      this.selectionDevice = selection;
    },
    handleSubmitAddLum() {
      if (!this.queryDeviceParams.companyNumber) {
        this.$message({
          message: "请选择客户",
          type: "warning"
        });
        return;
      }
      if (!this.selectionDevice.length) {
        this.$message({
          message: "请至少选择一台设备",
          type: "warning"
        });
        return;
      }
      let deviceList = this.selectionDevice.map(item => {
        return {
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
              lubricationId: "",
              odi: "",
              oilNumber: "",
              oilPackage: "",
              productNumber: "",
              oilTankVol: "",
              serviceFillVol: "",
              yearOilVol: "",
              oilBoxCapacityUnit: "L"
            }
          ]
        };
      });
      this.$router.push({
        path: "/EquipmentLubrTable/AddEquipmentLubrTable",
        query: {
          companyId: this.companyId,
          companyName: this.customerCompanyName,
          companyNumber: this.queryDeviceParams.companyNumber,
          deviceList: JSON.stringify(deviceList)
        }
      });
      this.$gio.selectDevice({
        customer: this.queryParams.companyName,
        operation: "弹窗中点击生成设备润滑表"
      });
    },
    // 查询
    handleSearchTableData(e) {
      this.pagenation.current = 1;
      this.getDeviceLubesList();
      if (e.target) {
        let target = e.target;
        if (target.nodeName == "SPAN" || target.nodeName == "I") {
          target = e.target.parentNode;
        }
        target.blur();
      }
    },
    downloadPDF(item) {
      const params = {
        url: item.pdfUrl
      };
      this.requestMethodGet("/web/file/getFullDownloadUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
      this.getDeviceLubesList(); // 获取日志列表
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.getDeviceLubesList(); // 获取短信日志列表
    },
    // 前往创建设备
    handleAddDevice() {
      let routeUrl = this.$router.resolve({
        path: "/EquipmentProfile/AddEquipmentProfile",
        query: {
          customerNumber: this.queryDeviceParams.companyNumber,
          companyId: this.companyId
        }
      });
      window.open(routeUrl.href, "_blank");
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
@import "../../assets/css/customTable.less";
.equipment-lubr-Table {
  padding: 0 20px;
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
  .nowrap-name {
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .workOrder-Status {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    font-weight: bold;
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
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: rgba(254, 0, 24, 1) !important;
    border-color: rgba(254, 0, 24, 1) !important;
  }
  .el-radio-button__inner:hover {
    color: rgba(254, 0, 24, 1) !important;
  }
  .is-active .el-radio-button__inner:hover {
    color: #fff !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f7fa !important;
  }
  // .el-pagination.is-background .el-pager li:not(.disabled).active {
  //   background:#fff !important;
  // }
  .el-tabs__item.is-active {
    color: #fe000c !important;
    font-weight: 900 !important;
  }
  .el-tabs__active-bar {
    background-color: #fe000c !important;
  }
  .el-tabs__item:hover {
    color: #fe000c !important;
  }
  .bold {
    font-weight: bold;
  }
  .email-info {
    height: 36px;
    line-height: 36px;
    color: #ff9900;
    font-size: 13px;
    margin-bottom: 20px;
    border-radius: 4px;
    background: rgba(255, 153, 0, 0.1);
  }
}
.email-dialog {
  .title {
    width: 100px;
    display: inline-block;
    padding-right: 12px;
    box-sizing: border-box;
    text-align: right;
  }
  .email-font label {
    font-size: 16px !important;
  }
}
.select-device {
  .el-dialog__title {
    font-size: 16px;
  }
  .el-dialog__body {
    padding: 10px 20px 40px !important;
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
.deletBtn .el-button--primary {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.deletBtn .el-message-box__container {
  position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
}
</style>
