<!--
* @description 编辑经销商档案
* @fileName editDealerProfile.vue
* @author vvx
* @date 2020/04/14 09:50:24
* @version V1.0.0
!-->
<template>
  <div style="position:relative">
    <div class="return-btn" style="position:absolute;right:20px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer">
      <el-button type="danger" @click="handleEdit" v-has="DLEditBtn" size="small">编辑</el-button>
      <el-button type="danger" plain size="small" @click="handleCancle"
        ><img src="../../assets/back.png" style="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px" />返回</el-button
      >
    </div>

    <div class="add-customer-profile" :style="mainminheight">
      <!-- 公司名称 -->
      <div class="company-content">
        <div class="company-title-info">
          <div class="company-info">
            <div style="font-size:20px;color:#000;line-height:25px;font-weight:bold">{{ ruleForm.companyName }}</div>
            <div style="height:10px"></div>
            <div style="display:flex;align-items:center">
              <div class="da-tag" v-if="ruleForm.assistSpFlag">DA服务商</div>
              <div class="company-status" :style="{ backgroundColor: ruleForm.status == '0' ? 'rgba(0,0,0,0.05)' : 'rgba(0,136,136,0.1)', color: ruleForm.status == '0' ? '#666' : '#008888' }">
                {{ ruleForm.status == "1" ? "在用" : "禁用" }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 公司信息 -->
      <div id="header" class="company-info-content">
        <el-form ref="form" :model="ruleForm" label-width="80px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="税号">
                <span>{{ ruleForm.taxNumber || "暂无" }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="城市">
                <el-tooltip class="item" effect="dark" :content="ruleForm.regionCityName" placement="top-start" v-if="ruleForm.regionCityName">
                  <div class="warp-two">{{ ruleForm.regionCityName || "暂无" }}</div>
                </el-tooltip>
                <span v-else>暂无</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务区域">
                <el-tooltip class="item" effect="dark" :content="ruleForm.areaName" placement="top-start" v-if="ruleForm.areaName">
                  <div class="warp-two">{{ ruleForm.areaName || "暂无" }}</div>
                </el-tooltip>
                <span v-else>暂无</span>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="规模">
                <span>{{ ruleForm.custScaleName || "暂无" }} </span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="联系电话">
                <span>{{ accountInfo.telephone || ruleForm.telephone || "暂无" }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="公司地址">
                <el-tooltip class="item" effect="dark" :content="ruleForm.address" placement="top-start" v-if="ruleForm.address">
                  <div class="warp-two">{{ ruleForm.address || "暂无" }}</div>
                </el-tooltip>
                <span v-else>暂无</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建日期">
                <span>{{ ruleForm.createTimeStr || "暂无" }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-row :gutter="20" type="flex" align="bottom">
        <el-col :span="24" style="margin-top:20px;">
          <el-button type="danger" v-has="DLDEmailBtn" plain @click="handleShowEmail" size="small">邮件邀请经销商内勤</el-button>
        </el-col>
      </el-row>

      <!-- 表格 客户信息/员工信息 -->
      <el-tabs v-model="currentTab" @tab-click="handleClick">
        <el-tab-pane :label="'经销商客户 ' + ctTotalNumber" name="0" v-if="customerBtn">
          <div>
            <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderCustomer" :tableData="customerData" :tableHeight="tableHeight + ''" :loading="loading">
              <el-table-column slot="companyName" label="名称" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div style="display:flex;align-items:center;">
                    <span style="color:#409eff;cursor:pointer; word-break: break-all;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;" @click="handleJumpCustomerDetail(scope.row)">{{
                      scope.row.companyName
                    }}</span>
                    <img v-if="scope.row.pesFlag == '1'" src="../../assets/pes-icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
                    <img v-if="scope.row.pesFlag == '2'" src="../../assets/DPES_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
                    <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width:20px;height:20px;margin-left:8px;" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column slot="status" label="状态" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <span>{{ scope.row.status == "1" ? "在用" : "禁用" }}</span> -->
                  <span :style="{ color: scope.row.status == '0' ? '#999999' : '#008888', 'font-weight': 800 }">{{
                    scope.row.status == "1" ? "使用中" : scope.row.status == "2" ? "潜在客户" : scope.row.status == "3" ? "现有客户" : "已停用"
                  }}</span>
                </template>
              </el-table-column>
            </custom-table>
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagenation.current"
              :page-size="pagenation.size"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="ctTotalNumber"
              style="float: right;display:flex; margin-top: 10px"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'DA客户 ' + daTotal" name="3" v-if="ruleForm.assistSpFlag">
          <div>
            <el-table ref="daCustomerTable" row-key="id" :data="daCustomerData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }" stripe>
              <el-table-column prop="companyName" label="名称" min-width="15%" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div style="display:flex;align-items:center;">
                    <span style="color:#409eff;cursor:pointer; word-break: break-all;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;" @click="handleJumpCustomerDetail(scope.row)">{{
                      scope.row.companyName
                    }}</span>
                    <img v-if="scope.row.pesFlag == '1'" src="../../assets/pes-icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
                    <img v-if="scope.row.pesFlag == '2'" src="../../assets/DPES_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
                    <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width:20px;height:20px;margin-left:8px;" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="companyIndustryName" label="行业" min-width="12%" show-overflow-tooltip></el-table-column>
              <el-table-column prop="regionCityName" label="城市" min-width="12%" show-overflow-tooltip></el-table-column>
              <el-table-column prop="companyIndustryName" label="规模" min-width="12%" show-overflow-tooltip></el-table-column>
              <el-table-column prop="deviceTotalCount" label="设备数" min-width="10%" show-overflow-tooltip></el-table-column>
              <el-table-column prop="status" label="状态" min-width="6%">
                <template slot-scope="scope">
                  <!-- <span>{{ scope.row.status == "1" ? "在用" : "禁用" }}</span> -->
                  <span :style="{ color: scope.row.status == '0' ? '#999999' : '#008888', 'font-weight': 800 }">{{
                    scope.row.status == "1" ? "使用中" : scope.row.status == "2" ? "潜在客户" : scope.row.status == "3" ? "现有客户" : "已停用"
                  }}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              @size-change="daSizeChange"
              @current-change="daCurrentChange"
              :current-page="daCurrent"
              :page-size="daSize"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="daTotal"
              style="float: right;display:flex; margin-top: 10px"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'工单 ' + workOrderTotal" name="1" v-if="workOrderBtn">
          <div>
            <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderWorkorder" :tableData="workOrderData" :tableHeight="tableHeight + ''" :loading="loading">
              <el-table-column slot="workOrderNumber" label="工单编号" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span style="color:#409eff;cursor:pointer;" @click="handleJumpWorkOrderDetail(scope.row)">{{ scope.row.workOrderNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column slot="serviceName" label="服务项" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div style="display:flex;align-items:center;">
                    <span class="service-name">{{ scope.row.serviceName }}</span>
                    <div v-if="scope.row.workOrderPesFlag == 1" class="pes-div">PES</div>
                    <div v-if="scope.row.workOrderPesFlag == 2" class="dpes-div">DPES</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column slot="companyName" label="客户" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div style="display:flex;align-items:center;">
                    <span style="color:#409eff;cursor:pointer;" @click="handleJumpCustomerDetail(scope.row)">{{ scope.row.companyName }}</span>
                    <img v-if="scope.row.customerPesFlag == '1'" src="../../assets/pes-icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
                    <img v-if="scope.row.customerPesFlag == '2'" src="../../assets/DPES_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
                    <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width:20px;height:20px;margin-left:8px;" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column slot="executePersonName" label="执行人" width="130" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                    <div>
                      <div style="display:flex;">
                        <img :src="executeDetail.headUrl ? executeDetail.headUrl : headImg" alt="" style="width:40px;height:40px;" />
                        <div style="flex:1;margin-left:10px;">
                          <div class="username-div">{{ executeDetail.userName }}</div>
                          <div class="rolename-div">{{ executeDetail.roleNames || "-" }}</div>
                        </div>
                      </div>
                      <div class="phonenumber-div">
                        <span style="color:#666;margin-right:8px;">Tel: </span>
                        <span>{{ executeDetail.phonenumber }}</span>
                        <el-button class="copy_tel" style="padding:0px;" type="text" v-clipboard:copy="executeDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left:8px;" />
                        </el-button>
                      </div>
                      <div class="mail-div">
                        <span style="color:#666;margin-right:8px;">Mail: </span>
                        <span>{{ executeDetail.email }}</span>
                        <el-button class="copy_mail" type="text" v-clipboard:copy="executeDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding:0px;">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left:8px;" />
                        </el-button>
                      </div>
                    </div>
                    <span slot="reference" :disabled="!scope.row.executePersonName" class="copy_text name-span" type="text" @click="contactPersonDetail(scope)">{{
                      scope.row.executePersonName || "-"
                    }}</span>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column slot="workOrderStatusName" label="工单状态" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="workOrder-Status" style="color:#dd0000;" v-if="scope.row.workOrderStatus == '0' || scope.row.workOrderStatus == '9'">{{ scope.row.workOrderStatusName }}</span>
                  <span class="workOrder-Status" style="color:#001450;" v-if="scope.row.workOrderStatus == '2'">{{ scope.row.workOrderStatusName }}</span>
                  <span class="workOrder-Status" style="color:#008888;" v-if="scope.row.workOrderStatus == '1'">{{ scope.row.workOrderStatusName }}</span>
                  <span class="workOrder-Status" style="color:#999999;" v-if="scope.row.workOrderStatus == '4' || scope.row.workOrderStatus == '3'">{{ scope.row.workOrderStatusName }}</span>
                </template>
              </el-table-column>
            </custom-table>
            <el-pagination
              background
              @size-change="handleSizeChange3"
              @current-change="handleCurrentChange3"
              :current-page="pagenation3.current"
              :page-size="pagenation3.size"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="workOrderTotal"
              style="float: right;display:flex; margin-top: 10px"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'成员 ' + stTotalNumber" name="2">
          <div>
            <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderStaff" :tableData="staffData" :tableHeight="tableHeight + ''" :loading="loading">
              <el-table-column slot="userName" label="姓名" width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div style="display: flex;align-items: center;">
                    <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.userName }}</span>
                    <el-tooltip
                      :content="
                        scope.row.distributorHonoraryMedal == '3' ? '服务大师' : scope.row.distributorHonoraryMedal == '2' ? '服务达人' : scope.row.distributorHonoraryMedal == '1' ? '服务先锋' : ''
                      "
                      placement="top"
                    >
                      <img v-if="scope.row.distributorHonoraryMedal == '3'" src="../../assets/small_service_great_person.png" alt="" style="width:24px;height:20px;margin-left: 4px;" />
                      <img v-if="scope.row.distributorHonoraryMedal == '2'" src="../../assets/small_service_master.png" alt="" style="width:24px;height:20px;margin-left: 4px;" />
                      <img v-if="scope.row.distributorHonoraryMedal == '1'" src="../../assets/small_service_pioneer.png" alt="" style="width:24px;height:20px;margin-left: 4px;" />
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column slot="valid" label="账号状态" width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span :style="scope.row.valid == false ? 'color:rgb(221, 0, 0)' : 'color:rgb(0, 136, 136)'">{{ scope.row.valid == false ? "已失效" : "有效" }}</span>
                </template>
              </el-table-column>
            </custom-table>
            <el-pagination
              background
              @size-change="handleSizeChange2"
              @current-change="handleCurrentChange2"
              :current-page="pagenation2.current"
              :page-size="pagenation2.size"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="stTotalNumber"
              style="float: right;display:flex; margin-top: 10px"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'分管人 ' + chargeTableTotalNumber" name="chargeUser">
          <el-button type="danger" size="small" @click="addChargeUser" v-has="manage_distributor_manager_PC">添加分管人</el-button>
          <div style="height:10px"></div>
          <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderCharge" :tableData="chargeTableData" :tableHeight="tableHeight + ''" :loading="loading">
            <el-table-column slot="phonenumber" label="联系方式" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <div style="display:flex;align-items:center">
                  <span>{{ scope.row.isShowListAllPhone ? scope.row.phonenumber : scope.row.tempPhone }}</span>
                  <img
                    style="margin-left:10px;width:20px;height:20px;cursor: pointer;"
                    @click="viewListAll(scope.row, 'phoneNumber')"
                    :src="scope.row.isShowListAllPhone ? viewIcon : notViewIcon"
                    alt=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column slot="operation" label="操作" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span style="color: #001450; cursor: pointer" v-has="manage_distributor_manager_PC" v-if="scope.row.userId == userId" @click="handleExitChargeUser(scope.row)">退出</span>
                <span style="color: #001450; cursor: pointer" v-has="manage_distributor_manager_PC" v-if="scope.row.userId != userId" @click="handleDeleteChargeUser(scope.row)">移除</span>
                <span style="color: #001450; cursor: pointer" v-has="manage_distributor_manager_PC" @click="handleReplaceChargeUser(scope.row)">替换</span>
              </template>
            </el-table-column>
          </custom-table>
          <el-pagination
            background
            @size-change="chargeUserSizeChange"
            @current-change="chargeUserCurrentChange"
            :current-page="chargePage.current"
            :page-size="chargePage.size"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="chargeTableTotalNumber"
            style="float: right; display: flex; margin-top: 10px"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
      <!-- 邮件邀请弹出框 -->
      <el-dialog title="邮箱" :visible="dialogFormVisible" :show-close="false" width="30%">
        <el-form :rules="erules" :model="emaiRule" ref="emailForm">
          <el-form-item prop="email">
            <el-input size="small" v-model="emaiRule.emailValue" placeholder="请输入收件人邮箱" clearable autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" plain @click="handleResetEmail('emailForm')" size="small">取 消</el-button>
          <el-button type="danger" @click="handleSubmitEmial('emailForm')" size="small">发送</el-button>
        </div>
      </el-dialog>
      <!-- 添加/替换分管人 -->
      <el-dialog :title="title" :visible.sync="chargeUserDialogVisiable" :append-to-body="true" width="60%" class="create-task">
        <!-- 第一步 -->
        <div v-if="step == '1'">
          <div style="display: flex; align-items: center; margin-bottom: 10px; margin-top: 10px">
            <span>姓名：</span>
            <el-input
              size="small"
              v-model="queryParamsDialog.userName"
              placeholder="请输入关键字"
              suffix-icon="el-icon-search"
              style="width: 220px;"
              maxlength="50"
              @change="handleSearchTableData"
              clearable
            ></el-input>
            <span v-if="typeDialog == 'add'" style="margin-left: 10px">角色：</span>
            <el-select size="small" v-if="typeDialog == 'add'" v-model="queryParamsDialog.roleCodeList" multiple @change="handleSearchTableData" placeholder="全部" style="width:280px">
              <el-option v-for="item in roleList" :key="item.accessTemplateId" :label="item.accessTemplateName" :value="item.accessTemplateId"></el-option>
            </el-select>
            <el-button @click="handleClearSearch" style="margin-left:30px;" size="small">重置</el-button>
          </div>
          <div>
            <el-table
              :data="customerUserData"
              tooltip-effect="dark"
              ref="tableChargeDistributor"
              v-loading="loadingDialog"
              v-el-table-infinite-scroll="load"
              :row-key="getRowKey"
              @selection-change="selectAll"
            >
              <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
              <el-table-column prop="userName" min-width="20%" label="姓名"> </el-table-column>
              <el-table-column prop="roleNames" min-width="18%" label="角色"> </el-table-column>
            </el-table>
            <el-pagination
              v-if="customerUserTotalDialog"
              background
              @size-change="handleSizeChangeDialog"
              @current-change="handleCurrentChangeDialog"
              :current-page="pagenationDialog.current"
              :page-size="pagenationDialog.size"
              :page-sizes="[10, 20, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="customerUserTotalDialog"
              style="position: relative;margin-top: 50px;float: right;"
            ></el-pagination>
          </div>
        </div>
        <!-- 第二步 -->
        <div style="width:70%;margin:0 auto;" v-if="step == '2' && typeDialog != 'add'">
          <div class="confirm-tips">
            <div class="img_div">
              <img :src="replaceObj.avatar ? replaceObj.avatar : headImg" alt="" style="width: 40px; height: 40px" />
              <div class="img_text">{{ replaceObj.userName }}</div>
            </div>
            <div style="margin:0 40px;">
              <img src="../../assets/process-unChecked.png" style="width:32px;height:30px;" />
            </div>
            <div class="img_div">
              <img :src="selectObj.avatar ? selectObj.avatar : headImg" alt="" style="width: 40px; height: 40px" />
              <div class="img_text">{{ selectObj.userName }}</div>
            </div>
          </div>
          <div class="tips_text">
            <div style="margin:12px 0 4px 0;">为保证成功，请注意以下事项:</div>
            <div style="line-height:22px;color:#999;">
              <div>1）请尽量在非工作时段转移用户数据，推荐时间段：当日20:00 ～ 次日8:00；</div>
              <div>2）系统仅对经销商分管人和特价申请审批人数据进行继承；</div>
              <div>3）请尽量避免同时进行多个账号的数据转移；</div>
              <div>4）数据转移过程中，请尽量避免对双方账号有关的数据进行编辑、修改、执行、删除等操作;</div>
              <div>5）数据转移过程中，请尽量避免以双方账号为对象，进行创建、分配、转派等操作;</div>
              <div>6）数据转移开始和完成时，系统将发送邮件给被转移账号的用户和管理员用户，请注意查收;</div>
              <div>7）数据转移预计耗时1分钟，请耐心等待，是否完成请以邮件为准;</div>
            </div>
          </div>
        </div>
        <div slot="footer" style="margin: 50px 0 10px;" v-if="typeDialog == 'add'">
          <el-button type="danger" @click="handleReset()" size="small" plain>取消</el-button>
          <el-button type="danger" @click="handleSubmitChargeUser()" size="small">确定</el-button>
        </div>
        <div slot="footer" style="margin: 50px 0 10px;" v-if="typeDialog != 'add' && step == '1'">
          <el-button type="danger" @click="handleReset()" size="small" plain>取消</el-button>
          <el-button type="danger" @click="handleNextStep()" size="small">下一步</el-button>
        </div>
        <div slot="footer" style="margin: 50px 0 10px;" v-if="typeDialog != 'add' && step == '2'">
          <el-button type="danger" @click="handlePreStep()" size="small" plain>上一步</el-button>
          <el-button type="danger" @click="handleSubmitReplaceUser()" size="small">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import customTable from "../tableComponents/customTable";
export default {
  components: {
    "custom-table": customTable
  },
  data() {
    var validateEmail = (rule, value, callback) => {
      {
        let regEmail = new RegExp("^([a-z0-9A-Z]+[^a-z]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$");
        if (!regEmail.test(this.emaiRule.emailValue)) {
          callback(new Error("请输入正确的邮箱格式"));
        }
        callback();
      }
    };
    return {
      tableDataHeaderCustomer: [
        { slot: "companyName" },
        { label: "行业", prop: "companyIndustryName", width: "150", tooltip: true },
        { label: "城市", prop: "regionCityName", width: "150", tooltip: true },
        { label: "规模", prop: "companyIndustryName", width: "150", tooltip: true },
        { label: "设备数", prop: "deviceTotalCount", width: "150", tooltip: true },
        { slot: "status" }
      ],
      tableDataHeaderWorkorder: [
        { slot: "workOrderNumber" },
        { slot: "serviceName" },
        { slot: "companyName" },
        { slot: "executePersonName" },
        { label: "预约日期", prop: "expectComingTime", width: "150", tooltip: true },
        { slot: "workOrderStatusName" }
      ],
      tableDataHeaderStaff: [
        { label: "姓名", slot: "userName", prop: "userName", width: "130", tooltip: true },
        { label: "联系电话", prop: "phonenumber", width: "150", tooltip: true },
        { label: "邮箱", prop: "email", width: "180", tooltip: true },
        { label: "角色", prop: "roleNames", width: "180", tooltip: true },
        { slot: "valid" }
      ],
      tableDataHeaderCharge: [
        { label: "姓名", prop: "userName", width: "130", tooltip: true },
        { label: "角色", prop: "roleNames", width: "200", tooltip: true },
        { slot: "phonenumber" },
        { slot: "operation" }
      ],
      viewIcon: require("../../assets/account_view.png"),
      headImg: require("../../assets/headImg.png"),
      notViewIcon: require("../../assets/account_not_view.png"),
      contactDetail: {},
      title: "添加分管人",
      replaceObj: {},
      step: 1,
      selectObj: {},
      confirmReplaceVisible: false,
      typeDialog: "add",
      executeDetail: {},
      nameKey: 1,
      userId: "",
      defaultImg: require("../../assets/lp-none.png"),
      mainminheight: `height:${document.documentElement.clientHeight - 240}px`,
      headerHeight: null,
      companyNameList: [], // 公司名称列表
      provinceList: [], // 省列表
      cityList: [], // 市列表
      statusList: [], // 状态列表
      // 表单验证
      ruleForm: {},
      // 邮箱校验
      emaiRule: {
        emailValue: ""
      },
      erules: {
        email: [{ validator: validateEmail, trigger: "blur" }]
      },
      //   表单验证规则
      currentTab: "0", // 当先下标
      customerData: [], // 客户表格数
      // 分页参数
      pagenation: {
        current: 1,
        size: 10
      },
      loading: false,
      ctTotalNumber: 0, // 客户列表总数
      staffData: [], // 员工表格数据
      // 分页参数
      pagenation2: {
        current: 1,
        size: 10
      },
      // 分页参数
      pagenation3: {
        current: 1,
        size: 10
      },
      chargeTableData: [], // 分管人数据
      chargeTableTotalNumber: 0,
      chargeUserDialogVisiable: false,
      loadingDialog: false,
      chargePage: {
        // 分管人分页参数
        current: 1,
        size: 10
      },
      queryParamsDialog: {
        // 添加分管人搜索字段
        userName: "",
        roleCodeList: []
      },
      roleList: [],
      pagenationDialog: {
        current: 1,
        size: 50
      },
      replaceUserTotalDialog: 0,
      replaceUserDialog: false,
      replaceUserData: [],
      customerUserData: [], // 添加分管人弹框数据
      customerUserTotalDialog: 0, // 添加分管人弹框列表数据总数
      totalNumber: 0, // 总条数
      selectChecked: [], // 分管弹框选中的数据
      stTotalNumber: 0, // 员工列表总数
      woTotalNumber: 0, // 工单列表总数
      dialogFormVisible: false, // 是否展示邮件弹窗，默认隐藏
      accountInfo: {
        legacyId: ""
      },
      customerBtn: false,
      workOrderBtn: false,
      accountBtn: false,
      workOrderData: [],
      workOrderTotal: 0,
      tableHeight: 600,
      // DA客户
      daCustomerData: [],
      daCurrent: 1,
      daSize: 10,
      daTotal: 0,
      distributorId: null
    };
  },
  mounted() {
    this.$_queryDealerInfo(this.$route.query.companyNumber); // 查询经销商信息
    this.$_getCTData(this.$route.query.companyNumber); // 获取客户列表
    this.$_getSTData(); // 获取员工列表
    this.$_getWorkOrder();
    this.getChargeList(); // 获取分管人数据
    this.getBindingAccountId();
    var headerEl = document.getElementById("header");
    this.headerHeight = headerEl.offsetHeight;
    let mainHeight = document.documentElement.clientHeight - 240;
    this.tableHeight = mainHeight - headerEl.offsetHeight - 230;
    window.onresize = () => {
      return (() => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 240}px`;
        mainHeight = document.documentElement.clientHeight - 160;
        this.headerHeight = headerEl.offsetHeight;
        this.tableHeight = mainHeight - headerEl.offsetHeight - 230;
      })();
    };
  },
  created() {
    let buttonpermsStr = JSON.parse(sessionStorage.getItem("menuList"));
    this.userId = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userId;
    let btnStr;
    for (let i in buttonpermsStr) {
      let item = buttonpermsStr[i];
      if (item.menuCode == "customer_web") {
        this.customerBtn = true;
      }
      if (item.menuCode == "NewWorkOrderList") {
        this.workOrderBtn = true;
      }
      if (item.menuCode == "code_2185") {
        btnStr = item.children;
      }
    }
    if (btnStr && btnStr.length > 0) {
      for (let i in btnStr) {
        let item = btnStr[i];
        if (item.menuCode == "AccountManageme") {
          this.accountBtn = true;
        }
      }
    }
    this.distributorId = this.$route.query.distributorId;
    this.getDACustomerList();
  },
  methods: {
    checkSelectable(row, index) {
      if (this.typeDialog == "add") {
        if (!_.isEmpty(row.checkItemIds)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    // 获取DA客户
    getDACustomerList() {
      if (_.isEmpty(this.distributorId)) {
        return;
      }
      const params = {
        distributorId: this.EncryptUserId(this.distributorId),
        size: this.daSize,
        current: this.daCurrent
      };
      this.requestMethodGet("/directAccount/directAccountCompanys", params).then(res => {
        if (res.data.code == 1000) {
          this.daCustomerData = res.data.data.list;
          this.daTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    daSizeChange(val) {
      this.daSize = val;
      this.getDACustomerList();
    },
    daCurrentChange(val) {
      this.daCurrent = val;
      this.getDACustomerList();
    },
    // 查看执行人详情
    contactPersonDetail(scope) {
      this.executeDetail = {};
      if (scope.row.executePersonNumber) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        this.getUserDetail(scope.row.executePersonNumber, scope.$index, "execute");
      }
    },
    // 查询工单列表
    $_getWorkOrder() {
      let params = {
        ...this.pagenation3,
        distributorCompanyNumber: this.$route.query.companyNumber,
        menuCode: "NewWorkOrderList"
      };
      this.requestMethodGet("/weChat/workOrder/customerWithWorkOrderByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const list = res.data.list;
            const total = res.data.totalCount;
            this.workOrderData = list;
            this.workOrderTotal = total;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取客户联系人详情
    getUserDetail(val, index, type) {
      if (val) {
        if (type == "contact") {
          this.contactDetail = {};
        } else {
          this.executeDetail = {};
        }
        let param = {
          userNumber: val
        };
        this.requestMethodGet("/workOrder/getWorkOrderUser", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                if (type == "contact") {
                  this.$refs[`popover-${index}`].doShow();
                  this.contactDetail = res.data;
                  if (this.contactDetail.avatar) {
                    this.getFullUrl(this.contactDetail.avatar);
                  }
                  if (this.contactDetail.roleNames) {
                    this.contactDetail.roleNames = this.contactDetail.roleNames.join(",");
                  }
                  if (this.contactDetail.phonenumber) {
                    const phoneNum = this.contactDetail.phonenumber;
                    this.contactDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                  }
                } else {
                  this.$refs[`popovers-${index}`].doShow();
                  this.executeDetail = res.data;
                  if (this.executeDetail.avatar) {
                    this.getFullUrl(this.executeDetail.avatar);
                  }
                  if (this.executeDetail.roleNames) {
                    this.executeDetail.roleNames = this.executeDetail.roleNames.join(",");
                  }
                  if (this.executeDetail.phonenumber) {
                    const phoneNum = this.executeDetail.phonenumber;
                    this.executeDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                  }
                }
              } else {
                if (type == "contact") {
                  this.$refs[`popover-${index}`].doClose();
                  this.$message({
                    message: "人员不存在",
                    type: "warning"
                  });
                } else {
                  this.$refs[`popovers-${index}`].doClose();
                  this.$message({
                    message: "人员不存在",
                    type: "warning"
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
      }
    },
    // 查询经销商信息
    $_queryDealerInfo() {
      let params = {
        companyNumber: this.$route.query.companyNumber
      };
      this.regionCityCodeList = [];
      this.requestMethodGet("/web/company/queryCompanyByCompanyNumber", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            try {
              this.imageList = [];
              if (res.data.logo) {
                this.imageList.push({ url: res.data.logo });
              }
              this.ruleForm = res.data;
              this.ruleForm.city = this.ruleForm.regionCityArray;
              this.regionCityCodeList = [];

              for (let i in this.ruleForm.regionCityArray) {
                this.regionCityCodeList && this.regionCityCodeList.push(this.ruleForm.regionCityArray[i][1]);
              }
              if (this.ruleForm.custScale == null) {
                this.ruleForm.custScale = "";
              }
              if (this.ruleForm.companyNameShort == null) {
                this.ruleForm.companyNameShort = "";
              }
              if (this.ruleForm.address == null) {
                this.ruleForm.address = "";
              }
              if (this.ruleForm.status == null) {
                this.ruleForm.status = "";
              }
              if (this.ruleForm.createTimeStr == null) {
                this.ruleForm.createTimeStr = "";
              }
            } catch (e) {
              console.log("eeee", e);
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
    // 获取客户信息
    $_getCTData(companyNumber) {
      let params = {
        companyNumber,
        ...this.pagenation
      };
      this.loading = true;
      this.requestMethodGet("/web/customer/queryCompanyCustomerListByCompanyNumber", params)
        .then(res => {
          res = res.data;
          this.loading = false;
          if (res.code == 1000) {
            this.customerData = res.data.list;
            this.ctTotalNumber = res.data.totalCount;
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
    // 获取员工信息
    $_getSTData() {
      let params = {
        orgId: this.$route.query.companyInfo.companyId,
        // companyNumber,
        ...this.pagenation2
      };
      this.loading = true;
      this.requestMethodGet("/web/system/permission/orgSysUserManagae/userListOfOrg", params)
        .then(res => {
          res = res.data;
          this.loading = false;
          if (res.code == 1000) {
            this.staffData = res.data.list;
            this.stTotalNumber = res.data.totalCount;
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
    // 邮件邀请，显示弹窗
    handleShowEmail() {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.emaiRule.emailValue = sessionStorage.getItem("emailAddress");
    },
    // 邮件邀请取消
    handleResetEmail(formName) {
      this.$refs[formName].resetFields();
      this.emaiRule.emailValue = "";
      this.dialogFormVisible = false;
    },
    // 邮件邀请发送
    handleSubmitEmial(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("确认发送邮件?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.dialogFormVisible = false;
              let params = {
                receiveEmailAddress: this.emaiRule.emailValue,
                companyNumber: this.$route.query.companyNumber
              };
              this.requestMethodGet("/web/company/sendEmailQrCodeImgUrl", params)
                .then(res => {
                  res = res.data;
                  if (res.code == 1000) {
                    sessionStorage.setItem("emailAddress", this.emaiRule.emailValue);
                    this.$message({
                      message: "发送成功",
                      type: "success"
                    });
                  } else {
                    this.$message({
                      message: res.msg,
                      type: "warning"
                    });
                  }
                })
                .catch(res => {});
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    // 编辑
    handleEdit() {
      this.$router.push({
        path: "/DealerProfile/EditDealerProfile",
        query: {
          companyNumber: this.$route.query.companyNumber,
          scaleList: this.$route.query.scaleList
        }
      });
    },
    // 返回
    handleCancle() {
      if (this.$route.query.workorderPage) {
        history.back(-1);
      } else {
        this.$router.push({
          name: "DealerProfile",
          params: { isSaveQuery: true }
        });
      }
    },
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.$_getCTData(this.$route.query.companyNumber);
    },
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getCTData(this.$route.query.companyNumber);
    },
    handleCurrentChange3(current) {
      this.pagenation3.current = current;
      this.$_getWorkOrder(this.$route.query.companyNumber);
    },
    handleSizeChange3(size) {
      this.pagenation3.size = size;
      this.pagenation3.current = 1;
      this.$_getWorkOrder(this.$route.query.companyNumber);
    },
    handleCurrentChange2(current) {
      this.pagenation2.current = current;
      this.$_getSTData(this.$route.query.companyNumber);
    },
    handleSizeChange2(size) {
      this.pagenation2.size = size;
      this.pagenation2.current = 1;
      this.$_getSTData(this.$route.query.companyNumber);
    },
    // 跳转到工单详情
    handleJumpWorkOrderDetail(row) {
      if (row.serviceType == 1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType == 9 || row.serviceType == 10 || row.serviceType == 11) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType == 2) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkorderTaskDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      }
    },
    // 跳转到客户详情
    handleJumpCustomerDetail(row) {
      this.$router.push({
        path: "/CustomerProfile/CustomerProfileDetail",
        query: {
          companyId: row.companyId,
          companyNumber: row.companyNumber,
          isSaveDealer: true
        }
      });
    },
    // 跳转到员工详情
    handleJumpPersonnerDetail(row) {
      this.$router.push({
        path: "/PersonnelList/PersonnelDetail",
        query: {
          userNumber: row.userNumber,
          isSaveCompanyNumber: true
        }
      });
    },
    getBindingAccountId() {
      let params = {
        companyNumber: this.$route.query.companyNumber
      };
      this.requestMethodGet("/msla/account/getAccount", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.accountInfo = res.data.data || {};
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取角色数据
    $_queryRoleData() {
      this.roleList = [];
      this.requestMethodGet("/web/system/permission/roleManage/selectRoleListByMenuCode", { userType: 0, menuCode: "distribution_pool_btn_PC" })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.roleList = res.data;
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
    handleClearSearch() {
      this.pagenationDialog.current = 1;
      this.queryParamsDialog = {
        roleCodeList: [],
        userName: ""
      };
      this.$_getChargeDistributorData(this.typeDialog);
    },
    handleSearchTableData() {
      this.pagenationDialog.current = 1;
      this.$_getChargeDistributorData(this.typeDialog);
    },

    /** 分管经销商数据列表 */
    $_getChargeDistributorData(val) {
      this.loadingDialog = true;
      let params = { ...this.pagenationDialog, companyType: "1", userName: this.queryParamsDialog.userName };
      if (val == "" || val == "add") {
        params.sourceType = 1;
        params.areaCode = this.ruleForm.areaCode;
        params.roleIds = this.queryParamsDialog.roleCodeList.length > 0 ? this.queryParamsDialog.roleCodeList.toString() : "";
        params.companyNumber = this.$route.query.companyNumber;
      }
      if (val == "replace") {
        params.sourceType = 2;
        params.areaCode = this.replaceObj.area;
        params.roleCode = this.replaceObj.roleCode;
        params.checkUserId = this.replaceObj.userId;
      }
      params.source = "web";
      params.companyType = 1;
      this.requestMethodGet("/companyUser/queryChargeUserListByPage", params)
        .then(res => {
          this.loadingDialog = false;
          res = res.data;
          if (res.code == 1000) {
            this.customerUserData = res.data.list;
            this.customerUserTotalDialog = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleSizeChangeDialog(size) {
      this.pagenationDialog.size = size;
      this.pagenationDialog.current = 1;
      this.$_getChargeDistributorData(this.typeDialog);
    }, // current change
    handleCurrentChangeDialog(current) {
      this.pagenationDialog.current = current;
      this.$_getChargeDistributorData(this.typeDialog);
    },
    getRowKey(row) {
      return row.userNumber;
    },
    selectAll(val) {
      if (this.typeDialog == "add") {
        this.selectChecked = val;
      } else {
        this.selectChecked = val;
        if (val.length > 1) {
          this.$refs.tableChargeDistributor.clearSelection();
          this.$refs.tableChargeDistributor.toggleRowSelection(val.pop());
        }
      }
    },

    //分管客户保存接口
    submitCharge() {
      let selectCheckedData = [];
      this.selectChecked.forEach(item => {
        selectCheckedData.push(item.userNumber);
      });
      const param = {
        userList: selectCheckedData,
        loginUserId: this.userId,
        companyNumber: this.$route.query.companyNumber
      };
      this.requestMethodPost("/companyUser/batchAddCompanyChargeUser", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.chargeUserDialogVisiable = false;
            this.chargePage.current = 1;
            this.getChargeList();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 分管经销商弹框点击确定
    handleSubmitChargeUser() {
      if (this.selectChecked.length > 0) {
        this.$confirm("是否将这些用户设为分管人？", "添加分管人", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: ""
        })
          .then(() => {
            this.submitCharge();
          })
          .catch(() => {});
      } else {
        this.$message({
          type: "error",
          message: "请选择分管人"
        });
      }
    },
    // 替换分管人确认
    handleSubmitReplaceUser() {
      const param = {
        oldUserId: this.replaceObj.userId,
        oldUserNumber: this.replaceObj.userNumber,
        operationEntrance: "1",
        userNumber: this.selectChecked[0].userNumber,
        userId: this.selectChecked[0].userId,
        distributorNumber: this.$route.query.companyNumber
      };
      this.requestMethodPost("/companyUser/replaceUserData", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$message({
              message: "邮件已发送",
              type: "success"
            });
            this.chargeUserDialogVisiable = false;
            this.chargePage.current = 1;
            this.getChargeList();
            this.step = 1;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 替换分管人的下一步
    handleNextStep() {
      if (this.selectChecked && this.selectChecked.length > 0) {
        this.step = 2;
        this.selectObj = this.selectChecked[0];
      } else {
        this.$message({
          message: "请先选择用户",
          type: "warning"
        });
      }
    },
    // 替换分管人的上一步
    handlePreStep() {
      this.step = 1;
    },
    // 提交移除分管人
    submitChargeUser(item, val) {
      const param = {
        companyNumber: this.$route.query.companyNumber,
        userNumber: item.userNumber
      };
      this.requestMethodPost("/companyUser/deleteCompanyChargeUser", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            let msg = "";
            if (val == "delete") {
              msg = "移除成功";
              this.chargePage.current = 1;
              this.getChargeList();
            } else {
              msg = "退出成功";
              history.back(-1);
            }
            this.$message({
              type: "success",
              message: msg
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
    // 移除分管人
    handleDeleteChargeUser(item, index) {
      this.$confirm("是否移除分管人？移除后将失去对该经销商的部分管理权限", "移除分管人", {
        confirmButtonText: "移除",
        cancelButtonText: "取消",
        type: ""
      })
        .then(() => {
          this.submitChargeUser(item, "delete");
        })
        .catch(() => {});
    },
    // 分管人退出
    handleExitChargeUser(item) {
      this.$confirm("是否退出分管人？退出后将失去对该经销商的部分管理权限", "退出分管人", {
        confirmButtonText: "退出",
        cancelButtonText: "取消",
        type: ""
      })
        .then(() => {
          this.submitChargeUser(item, "exit");
        })
        .catch(() => {});
    },
    // 替换分管人
    handleReplaceChargeUser(item) {
      this.title = "替换分管人";
      this.chargeUserDialogVisiable = true;
      this.replaceObj = item;
      this.step = 1;
      this.typeDialog = "replace";
      this.selectChecked = [];
      this.$nextTick(() => {
        this.$refs.tableChargeDistributor.clearSelection();
      });

      this.$_getChargeDistributorData(this.typeDialog, item);
    },
    // 添加分管人按钮事件
    addChargeUser() {
      this.title = "添加分管人";
      this.typeDialog = "add";
      this.step = 1;
      this.chargeUserDialogVisiable = true;
      this.selectChecked = [];
      this.$nextTick(() => {
        this.$refs.tableChargeDistributor.clearSelection();
      });
      this.$_getChargeDistributorData(this.typeDialog);
      this.$_queryRoleData();
    },
    chargeUserSizeChange(val) {
      this.chargePage.current = 1;
      this.chargePage.size = val;
      this.getChargeList();
    },
    chargeUserCurrentChange(val) {
      this.chargePage.current = val;
      this.getChargeList();
    },
    viewListAll(row) {
      this.chargeTableData.forEach(it => {
        if (row.userId == it.userId) {
          it.isShowListAllPhone = !it.isShowListAllPhone;
        }
      });
    },
    // 手机号脱敏
    tmPhone(phonenumber) {
      if (null != phonenumber && phonenumber != undefined) {
        var pat = /(\d{3})\d*(\d{4})/;
        return phonenumber.replace(pat, "$1****$2");
      } else {
        return "";
      }
    },
    // 获取分管人数据 chargeTableData
    getChargeList() {
      let params = {
        companyNumber: this.$route.query.companyNumber,
        ...this.chargePage
      };

      this.requestMethodGet("/companyUser/queryCustomerChargeUserByCompany", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data.list;
            if (data.length) {
              data.forEach(it => {
                it.isShowListAllPhone = false;
                it.tempPhone = this.tmPhone(it.phonenumber);
              });
            }
            this.chargeTableData = data;
            this.chargeTableTotalNumber = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 取消分管经销商弹框
    handleReset() {
      this.chargeUserDialogVisiable = false;
      this.pagenationDialog = {
        current: 1,
        size: 50
      };
      this.queryParamsDialog = {
        roleCodeList: [],
        userName: ""
      };
    }
  }
};
</script>
<style lang="less" scoped>
.dialog-transfer .el-dialog__body {
  padding: 20px !important;
}
.dialog-transfer .el-form-item__label {
  font-size: 16px !important;
}
.username-div {
  color: #000;
  font-family: MicrosoftYaHei;
  font-size: 14px;
  line-height: 14px;
}
.rolename-div {
  color: rgb(0, 0, 0, 0.5);
  line-height: 12px;
  margin-top: 8px;
  font-size: 12px;
}
.phonenumber-div {
  color: #999;
  font-family: MicrosoftYaHei;
  font-size: 13px;
  line-height: 14px;
  margin-top: 12px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}
.mail-div {
  color: #999;
  font-family: MicrosoftYaHei;
  font-size: 13px;
  line-height: 14px;
  margin-top: 12px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}
.name-span {
  color: #001450;
  font-family: MicrosoftYaHei;
  cursor: pointer;
  padding: 0px;
}
.service-name {
  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.pes-div {
  height: 20px;
  line-height: 20px;
  width: 34px;
  text-align: center;
  background: rgba(255, 153, 0, 0.1);
  color: #ff9900;
  font-size: 12px;
  font-family: ArialMT;
  border-radius: 4px;
  margin-left: 10px;
  display: inline-block;
}
.dpes-div {
  height: 20px;
  line-height: 20px;
  width: 46px;
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  color: rgb(102, 102, 102);
  font-size: 12px;
  font-family: ArialMT;
  border-radius: 4px;
  margin-left: 10px;
  display: inline-block;
}
.confirm-tips {
  padding: 16px 24px;
  background: rgba(204, 221, 255, 0.2);
  border: 1px solid rgba(204, 221, 255, 0.4);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  .img_div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img_text {
      font-size: 14px;
      color: #000;
      margin-top: 8px;
    }
  }
}
.tips_text {
  font-weight: 400;
  font-size: 14px;
  color: #000;
}
.da-tag {
  width: 70px;
  height: 24px;
  background-color: #ccddff;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}
.company-content {
  display: flex;
  align-items: center;
}
.company-img {
  width: 64px;
  height: 64px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: solid 1px #e9e9e9;
}
.company-type {
  font-size: 12px;
  color: #666;
  line-height: 25px;
  padding: 0 9px;
  background-color: #ccddff;
  border-radius: 4px;
}
.company-status {
  line-height: 25px;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 9px;
}
.warp-two {
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
// 公司信息
.company-info-content {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 20px 0 0 20px;
  margin-top: 20px;
}

.member-number {
  height: 31px;
  display: flex;
  align-items: center;
  margin: 24px 0;
}
.tabs-item {
  margin-right: 15px;
  cursor: pointer;
}

.add-customer-profile {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-title {
    font-weight: bold;
    font-size: 16px;
  }
  &-base-info {
    padding: 20px 0;
    overflow: hidden;
  }
}
</style>
<style>
.el-tooltip__popper {
  max-width: 50% !important;
  /* toptip提示语的宽度可根据自己需要进行设置 */
}
.edit-dealer-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}
.edit-dealer-profile .el-tabs__nav-wrap::after {
  background: none;
}
.edit-dealer-profile .el-tabs__item.is-active {
  color: red;
}
.edit-dealer-profile .el-tabs__active-bar {
  background: red;
}
.edit-dealer-profile .el-form-item__label {
  color: #999999;
}
</style>
