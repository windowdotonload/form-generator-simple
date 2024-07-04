<template>
  <div class="work-order-detail" style="position: relative; background: #f2f3f6">
    <div
      v-if="(woInfo && (woInfo.workOrderStatus == '0' || woInfo.workOrderStatus == '1' || woInfo.workOrderStatus == '2')) || (promote_btnDisplay)"
      class="return-btn"
      style="position: absolute; right: 20px; height: 55px; line-height: 55px; top: -55px; color: red; cursor: pointer"
    >
      <!-- 工单审批流提升 -->
      <el-button size="small" v-if="promote_btnDisplay" type="danger" @click="promote_revertClick">{{
        promote_revertBtnName
      }}</el-button>
      <el-button type="danger"
        plain 
        size="small" 
        @click="createCase" 
        v-if="woInfo.workOrderStatus == '2' && showCreateCaseBtn"
        v-auth="{ 
          menuCodes:'Workorder_SubmitExcellentcase', 
          strategyNames:['personal'],
          strategySource:{
            personal:woInfo.executeUserId
          }
        }"
      >
        提报优秀案例
      </el-button>
      <el-button type="danger"
        plain 
        size="small" 
        @click="revocationCase" 
        v-if="woInfo.isGood && woInfo.reportStatus==1 && revocationCaseType==2" 
        v-auth="{ 
          menuCodes:'Workorder_ExcellentcaseWithdraw', 
          strategyNames:['personal'],
          strategySource:{
            personal:woInfo.reportCreateUserId
          }
        }">
        撤回优秀案例
      </el-button>
      <!-- 美孚，经销商关闭 -->
      <el-button 
        type="danger" 
        v-if="woInfo.workOrderStatus<2 && 
        (
          ($userInfo.userType == 0 && (woInfo.daFlag || (!woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
          ($userInfo.userType == 1 && (!woInfo.daFlag || (woInfo.daFlag && $userInfo.userId == woInfo.executeUserId)))
        )" 
        plain 
        size="small" 
        @click="handleClose" 
        v-has="EMSP_service_order_list_cancel_btn">
        关闭工单
      </el-button>
      <!-- 客户关闭 -->
      <el-button 
        type="danger" 
        v-if="woInfo.workOrderStatus==0 && $userInfo.userType == 2 && woInfo.contactCompanyNumber == $userInfo.companyNumber" 
        plain 
        size="small" 
        @click="handleClose" 
        v-has="service_order_list_cancel_btn">
        关闭工单
      </el-button>
      <el-button 
        type="danger" 
        v-if="woInfo.workOrderStatus == '1' && (($userInfo.userType == 0 && (woInfo.daFlag || (!woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
          ($userInfo.userType == 1 && (!woInfo.daFlag || (woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))))"
        v-has="PC_WorkOrder_reassign" 
        size="small" 
        @click="handleDistributive('first')">
        重新分配
      </el-button>
      <el-button 
        type="danger" 
        v-has="PC_work_order_finish"
        v-if="$userInfo.userId == woInfo.executeUserId && woInfo.workOrderStatus == '1'" 
        plain size="small" 
        @click="handleFinish">
        完结工单
      </el-button>
    </div>
    <div class="work-order-detail">
      <el-form :model="woInfo" :rules="rules" ref="woInfo" label-width="100px" label-position="top" class="work-order-detail-woInfo">
        <div id="header" style="padding: 16px 20px; background: #fff">
          <div style="font-family: MicrosoftYaHei-Bold; font-size: 20px; color: #000; line-height: 28px; display: flex; align-items: center; font-weight: bold">
            {{ woInfo.serviceName }}
            <span class="status-tag" v-if="woInfo.workOrderStatus == 2" style="background: #001450">{{ woInfo.workOrderStatusName }}</span>
            <span class="status-tag" v-if="woInfo.workOrderStatus == 0" style="background: #dd0000">{{ woInfo.workOrderStatusName }}</span>
            <span class="status-tag" v-if="woInfo.workOrderStatus == 1" style="background: #008888">{{ woInfo.workOrderStatusName }}</span>
            <span class="status-tag" v-if="woInfo.workOrderStatus > 2" style="background: #ccc">{{ woInfo.workOrderStatusName }}</span>
            <div class="case-title" v-if="woInfo.isGood">优秀案例</div>
            <el-link :underline="false" style="color:#dd0000"  v-if="woInfo.isGood && revocationCaseType==2" @click="viewDetail" v-has="Workorder_ExcellentcaseSu">提交详情</el-link>
          </div>
          <div style="font-family: MicrosoftYaHei; font-size: 12px; margin-top: 16px">
            <el-row :gutter="24">
              <el-col :span="4" style="margin-left: 0px">
                <el-form-item label="工单编号">
                  <span style="font-size: 13px; font-family: ArialMt">{{ woInfo.workOrderNumber || "暂无" }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-left: 0px">
                <el-form-item label="服务商">
                  <el-tooltip class="item" effect="dark" :content="woInfo.distributorCompanyName" placement="top-start">
                    <div class="header-no-wrap" style="display:flex;align-items:center">
                      <span class="da-tag-company">{{ woInfo.distributorCompanyName || "暂无" }}</span>
                      <img v-if="woInfo.assistSpFlag" src="../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
                    </div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-left: 0px">
                <el-form-item label="工单类型">
                  <el-tooltip class="item" effect="dark" :content="woInfo.serviceNameAlias" placement="top-start">
                    <div class="header-no-wrap">{{ woInfo.serviceNameAlias || "暂无" }}</div>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-left: 0px" v-if="woInfo.serviceApplyNo">
                <el-form-item label="所属服务申请单">
                  <div style="display: flex; align-items: center; cursor: pointer" @click="handApplyOrderDetail">
                    <span style="font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 500px; display: inline-block; color: #001450">{{
                      woInfo.serviceApplyNo
                    }}</span>
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </el-form-item>
              </el-col>
              <el-col v-if="woInfo.workOrderPesFlag == 1 || woInfo.workOrderPesFlag == 2" :span="4" style="margin-left: 0px">
                <el-form-item label="服务等级">
                  <div
                    v-if="woInfo.workOrderPesFlag == 1"
                    style="
                      height: 20px;
                      line-height: 20px;
                      width: 34px;
                      text-align: center;
                      background: rgba(255, 153, 0, 0.1);
                      color: #ff9900;
                      font-size: 12px;
                      font-family: ArialMT;
                      border-radius: 4px;
                      display: inline-block;
                    "
                  >
                    PES
                  </div>
                  <div
                    v-if="woInfo.workOrderPesFlag == 2"
                    style="
                      height: 20px;
                      line-height: 20px;
                      width: 46px;
                      text-align: center;
                      background: rgba(0, 0, 0, 0.05);
                      color: rgb(102, 102, 102);
                      font-size: 12px;
                      font-family: ArialMT;
                      border-radius: 4px;
                      display: inline-block;
                    "
                  >
                    DPES
                  </div>
                </el-form-item>
              </el-col>
              <!--  -->
              <el-col v-if="(woInfo.workOrderPesFlag == 1 || woInfo.workOrderPesFlag == 2) && PESpackageBtn" :span="4" style="cursor: pointer; margin-left: 0px">
                <el-form-item label="所属计划工程服务档案">
                  <span
                    @click="handlePesDetail"
                    style="font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 500px; display: inline-block; color: #666; font-family: MicrosoftYaHei"
                    >{{ woInfo.servicePackage }}<i class="el-icon-arrow-right"></i
                  ></span>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-left: 0px">
                <el-form-item label="创建日期">
                  <span style="font-size: 13px">{{ woInfo.createTime || "暂无" }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="创建人">
                  <el-popover class="el-popover-detail" placement="bottom" width="272" @show="showPopverSubmit" ref="popoverSubmit" trigger="click">
                    <div>
                      <div style="display: flex">
                        <img :src="submitDetail.headUrl ? submitDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                        <div style="flex: 1; margin-left: 10px">
                          <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ submitDetail.userName }}</div>
                          <div style="color: rgb(0, 0, 0, 0.5); line-height: 12px; margin-top: 8px; font-size: 12px">{{ submitDetail.roleNames || "暂无" }}</div>
                        </div>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">Tel: </span>
                        <span>{{ submitDetail.phonenumber }}</span>
                        <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="submitDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">Mail: </span>
                        <span>{{ submitDetail.email }}</span>
                        <el-button class="copy_mail" type="text" v-clipboard:copy="submitDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                    </div>
                    <el-button slot="reference" :disabled="!woInfo.submitPersonName" class="copy_text" type="text" style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px">{{
                      woInfo.submitPersonName || "暂无"
                    }}</el-button>
                  </el-popover>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div>
          <div style="display: flex; margin-top: 20px">
            <div class="process-wrap1" :style="mainminFormheight">
              <div class="process-wrap">
                <div>
                  <span>执行人：</span>
                  <el-popover class="el-popover-detail" placement="bottom" width="272" @show="showPopverExecute" ref="popoverExecute" trigger="click">
                    <div>
                      <div style="display: flex">
                        <img :src="exceptDetail.headUrl ? exceptDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                        <div style="flex: 1; margin-left: 10px">
                          <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ exceptDetail.userName }}</div>
                          <div style="color: rgb(0, 0, 0, 0.5); line-height: 12px; margin-top: 8px; font-size: 12px">{{ exceptDetail.roleNames || "暂无" }}</div>
                        </div>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">Tel: </span>
                        <span>{{ exceptDetail.phonenumber }}</span>
                        <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="exceptDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">Mail: </span>
                        <span>{{ exceptDetail.email }}</span>
                        <el-button class="copy_mail" type="text" v-clipboard:copy="exceptDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                    </div>
                    <el-button slot="reference" :disabled="!woInfo.executePersonName" class="copy_text" type="text" style="color: #fff; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px">{{
                      woInfo.executePersonName || "暂无"
                    }}</el-button>
                  </el-popover>
                </div>
                <span
                  v-has="EMSP_service_order_edit_btn"
                  v-if="woInfo.workOrderStatus<2 && 
                    (
                      ($userInfo.userType == 0 && (woInfo.daFlag || (!woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
                      ($userInfo.userType == 1 && (!woInfo.daFlag || (woInfo.daFlag && $userInfo.userId == woInfo.executeUserId)))
                    )" 
                  style="color: #dd0000; cursor: pointer"
                  @click="editWorkorder"
                >
                  编辑
                </span>
              </div>
              <div style="font-size: 13px; color: #999; font-family: MicrosoftYaHei; padding: 20px 0;overflow:auto" :style="mainminProcessheight">
                <!-- 去除服务创赢、服务地址、预约日期 -->
                <div :style="{ marginBottom: woInfo.customerPesFlag == '1' ? '10px' : '16px' }" class="customerStyle">
                  <div style="width: 90px">客户名称</div>
                  <div style="flex: 1; color: #333; display: flex">
                    <span class="no-wrap" style="max-width: 158px">{{ woInfo.contactCompanyName || "暂无" }}</span>
                    <img v-if="woInfo.customerPesFlag == '1'" src="../../assets/pes-icon.png" alt="" style="margin-left: 8px; width: 24px; height: 23px" />
                  </div>
                </div>
                <div style="display: flex; margin-bottom: 16px; padding: 0 20px">
                  <div style="width: 90px">服务简述</div>
                  <div style="flex: 1; color: #333" class="no-wrap">{{ woInfo.shortDesc || "暂无" }}</div>
                </div>
                <div style="margin: 24px 0; height: 1px; width: 100%; background: #e9e9e9"></div>
                <!-- 下方进程 -->
                <div class="work-order-detail-status-wrap-progress" style="padding: 0 20px 20px">
                  <div style="font-family: MicrosoftYaHei-Bold; font-size: 20px; color: #000; line-height: 28px; display: flex; align-items: center; font-weight: bold">
                    {{ woInfo.workOrderStatusName }}
                  </div>
                  <div class="progress-box" style="height:160px">
                    <div v-for="(item, index) in woInfo.recordDtoList" :key="index" :class="index == 0 ? 'currentProgress weui-cell-list' : 'weui-cell-list'">
                      <div class="weui-cell-line">
                        <div class="weui-cell-event base-title">
                          {{ item.operationDesc }}
                          <span style="margin-left: 10px; font-family: ArialMT; font-size: 12px; color: #999; font-weight: normal">{{ item.createTime }}</span>
                        </div>
                        <div class="weui-cell-hot" style="font-size: 12px; font-family: MicrosoftYaHei; color: #666; margin-top: 4px">{{ item.traceDesc }}</div>
                      </div>
                      <div class="weui-cell-circle-new">
                        <img style="width: 28px; height: 28px" v-if="item.operationStatus == 0" :src="toBeConfirmed1" />
                        <img style="width: 28px; height: 28px" v-if="item.operationStatus == 1 || item.operationStatus == 6 || item.operationStatus == 7" :src="toGoing1" />
                        <img style="width: 28px; height: 28px" v-if="item.operationStatus == 2" :src="toEvaluate1" />
                        <img style="width: 28px; height: 28px" v-if="item.operationStatus == 3" :src="finishIcon" />
                        <img style="width: 28px; height: 28px" v-if="item.operationStatus == 4" :src="closeIcon1" />
                        <img style="width: 28px; height: 28px" v-if="item.operationStatus == 5" :src="closeIcon1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right-wrap" :style="mainminFormheight">
              <!-- 服务评价 -->
              <div style="width: 100%; background: #fff">
                <!-- 待评价 -->
                <div style="padding: 20px; margin-bottom: 20px" v-if="woInfo.workOrderStatus == 2 && userInfo.userNumber === woInfo.contactNumber && woInfo.valetOrderType > 0">
                  <!-- v-if="woInfo.workOrderStatus == 3" -->
                  <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; border-left: 3px solid #dd0000; padding-left: 10px">服务评价</div>
                  <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #001450; line-height: 14px; margin: 20px 0px 16px; display: flex; align-items: center">
                    <img src="../../assets/ev-icon.png" alt="" style="width: 16px; height: 16px; margin-right: 8px" />
                    服务已完成，请为该服务打分！
                  </div>
                  <div style="display: flex; align-items: center; margin-bottom: 16px">
                    <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #999; line-height: 14px; margin-right: 16px; width: 70px">服务评分</span>
                    <div v-for="(item, index) in imgsStar" :key="index" @click="select(item)">
                      <img class="star" :src="item.id > starId ? src2 : src1" />
                    </div>
                    <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #001450; line-height: 14px; margin-left: 10px">{{ scoreRemark }}</span>
                  </div>
                  <div style="display: flex; margin-bottom: 16px; width: 100%">
                    <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #999; line-height: 14px; margin-right: 16px; width: 70px"
                      >意见反馈<span v-if="starId < 3" style="color: red"> *</span></span
                    >
                    <div style="width: 70%">
                      <el-form ref="formRemark" class="remark" :model="formRemark" label-width="0px">
                        <el-form-item prop="remark" :rules="[{ required: isRequire, message: '请输入意见反馈', trigger: 'blur' }]">
                          <el-input
                            type="textarea"
                            placeholder="为了给您提供更优质的服务，请输入反馈意见"
                            v-model="formRemark.remark"
                            maxlength="200"
                            resize="none"
                            style="width: 640px; height: 100px"
                            show-word-limit
                          >
                          </el-input>
                        </el-form-item>
                      </el-form>
                    </div>
                  </div>
                  <el-button type="danger" size="small" style="margin-top: 10px; margin-left: 86px; background: #dd0000" @click="submitRemark">提交评价</el-button>
                </div>
                <!-- 评价结果  已完成工单可见-->
                <div style="padding: 20px; margin-bottom: 20px" v-if="woInfo.workOrderStatus == 3">
                  <div style="display: flex">
                    <img src="../../assets/toGoing1.png" alt="" style="width: 48px; height: 48px" />
                    <div style="flex: 1; padding-left: 16px">
                      <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; display: flex; align-items: center">
                        <span style="margin-right: 12px">评价结果</span>
                        <div v-if="woInfo.evaluateStars" style="display: flex; align-items: center">
                          <img class="star" :src="src1" v-for="(it, index) in woInfo.evaluateStars" :key="index" />
                          <img class="star" :src="src2" v-for="(it, index) in 5 - woInfo.evaluateStars" :key="index" />
                          <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #001450; line-height: 14px; margin-left: 10px">{{ scoreRemark }}</span>
                        </div>
                      </div>
                      <div v-if="!woInfo.evaluateContent" style="font-family: MicrosoftYaHei; font-size: 13px; color: #999; line-height: 14px; margin-top: 10px">客户未填写反馈意见</div>
                      <div v-else style="display: flex; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 10px">
                        <span style="color: #999; width: 70px">意见反馈：</span>
                        <div style="flex: 1; color: #666; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
                          {{ woInfo.evaluateContent }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 服务已关闭 -->
                <div style="padding: 20px; margin-bottom: 20px" v-if="woInfo.workOrderStatus == 4">
                  <div style="display: flex; align-items: center">
                    <img src="../../assets/service-close.png" alt="" style="width: 48px; height: 48px" />
                    <div style="flex: 1; padding-left: 16px">
                      <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; display: flex; align-items: center">
                        <span style="margin-right: 12px">服务已关闭</span>
                      </div>
                      <div style="display: flex; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 10px">
                        <span style="color: #999; width: 70px">关闭原因：</span>
                        <div style="flex: 1; color: #666; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
                          {{ woInfo.closeReason ? woInfo.closeReason : woInfo.closeTypeName }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 调查任务 -->
              <div style="width: 100%; background: #fff; position: absolute; padding-bottom: 60px">
                <div style="width: calc(100% - 40px); padding: 20px 20px 0">
                  <div style="display: flex; justify-content: space-between; align-items: center">
                    <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; border-left: 3px solid #dd0000; padding-left: 10px">
                      调查任务 <span v-if="taskTableData.length">（{{ taskTableData.length }}）</span>
                    </div>
                    <!-- v-has='service_order_create_btn'  创建任务-->
                    <div style="display: flex">
                      <div
                        v-has="service_order-down-btn"
                        v-if="woInfo.workOrderStatus == 2 || woInfo.workOrderStatus == 3"
                        style="color: 001450; font-family: MicrosoftYaHei; font-size: 13px; cursor: pointer"
                        @click="sendEmail"
                      >
                        发送报告至邮箱
                      </div>
                      <div
                        v-if="woInfo.workOrderStatus == 1 && userInfo.userNumber === woInfo.executePersonNumber"
                        v-has="PC_WorkOrder_LubCheck_create"
                        style="color: 001450; font-family: MicrosoftYaHei; font-size: 13px; cursor: pointer; margin-left: 12px"
                        @click="createTask('first')"
                      >
                        创建任务
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="taskTableData.length == 0"
                    style="font-family: MicrosoftYaHei; height: 146px; line-height: 146px; font-family: MicrosoftYaHei; font-size: 13px; color: #999; text-align: center"
                  >
                    暂无润滑点调查任务
                  </div>
                  <div v-if="taskTableData.length != 0" style="margin-top: 10px">
                    <el-table :data="taskTableData" v-loading="loading" tooltip-effect="dark" @selection-change="handleSelectionPath">
                      <el-table-column type="selection" width="55"> </el-table-column>
                      <el-table-column prop="serviceimg" min-width="18%" label="润滑点" :show-overflow-tooltip="true" :render-header="renderHeader">
                        <template width="90" slot-scope="scope">
                          <div style="display: flex; align-items: center;width:100%">
                            <img style="width: 64px; height: 64px; border: none; margin-right: 12px" :src="scope.row.lubricationPointPicPath ? scope.row.lubricationPointPicPath : defaultIcon" />
                            <div style="width: calc(100% - 50px);">
                              <div style="display: flex; align-items: center;width:100%">
                                <div style="width:calc(100% - 40px);margin-left: 5px;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap">
                                  {{ scope.row.lubricationPointTypeName }}<span v-if="scope.row.lubricationPointName">-</span>{{ scope.row.lubricationPointName }}
                                </div>
                              </div>

                              <div
                                style="border-radius: 6px; width: 48px; text-align: center; font-size: 12px; font-family: MicrosoftYaHei; border: 1px solid #ededed"
                                v-if="woInfo.reportType==-1 ? scope.row.reportStatus == 0 : scope.row.publishStatus == 0"
                              >
                                草稿
                              </div>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="deviceName" min-width="10%" label="设备名称" :show-overflow-tooltip="true" :render-header="renderHeader"> </el-table-column>
                      <el-table-column prop="currentOilName" min-width="10%" label="润滑油" :show-overflow-tooltip="true" :render-header="renderHeader">
                        <template slot-scope="scope">
                          {{ scope.row.currentOilName || "暂无" }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="lastOilChangeDate" min-width="10%" label="上次任务日期" :show-overflow-tooltip="true" :render-header="renderHeader">
                        <template slot-scope="scope">
                          {{ scope.row.lastOilChangeDate || "暂无" }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="perfectRate" min-width="14%" label="报告完整度" :show-overflow-tooltip="true" :render-header="renderHeader">
                        <template slot-scope="scope">
                          <div v-if="woInfo.reportType==-1 ? scope.row.reportPercent : scope.row.perfectRate" :class="(woInfo.reportType==-1 ? scope.row.reportPercent > 50 : scope.row.perfectRate > 50) ? 'process1' : 'process'">
                            <el-progress :percentage="woInfo.reportType==-1 ? scope.row.reportPercent : scope.row.perfectRate" :color="customColorMethod"></el-progress>
                          </div>
                          <span v-else>报告未生成，请先在详情中补全必填项！</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="serviceName" min-width="10%" label="操作">
                        <template slot-scope="scope">
                          <div class="link-wrap">
                            <div
                              v-if="woInfo.workOrderStatus == 1 && userInfo.userNumber === woInfo.executePersonNumber"
                              v-has="PC_WorkOrder_LubCheck_delete"
                              @click="handleDeleteReport(scope.row)"
                              style="font-family: MicrosoftYaHei-Bold; font-size: 13px; color: #333; line-height: 13px; margin-bottom: 8px"
                            >
                              删除
                            </div>
                            <div
                              v-if="woInfo.reportType==-1 ? scope.row.reportPath : scope.row.draftPath"
                              @click="handlePreviewReport(scope.row)"
                              style="font-family: MicrosoftYaHei-Bold; font-size: 13px; color: #333; line-height: 13px; margin-bottom: 8px"
                            >
                              预览报告
                            </div>
                            <div
                              type="danger"
                              @click="handleContinueImprove(scope.row)"
                              v-has="PC_WorkOrder_LubCheck_edit"
                              v-if="woInfo.workOrderStatus == 1 && userInfo.userNumber === woInfo.executePersonNumber && (woInfo.reportType==-1 ? scope.row.reportPercent != 100 : scope.row.perfectRate != 100)"
                              style="font-family: MicrosoftYaHei-Bold; font-size: 13px; color: #dd0000; line-height: 13px; margin-bottom: 8px"
                            >
                              {{ woInfo.reportType==-1 ? (scope.row.reportStatus == 0 ? "继续填写" : "继续完善") : scope.row.publishStatus == 0 ? "继续填写" : "继续完善"}}
                            </div>
                            <!-- 编辑 -->
                            <div
                              type="danger"
                              @click="handleContinueImprove(scope.row)"
                              v-has="PC_WorkOrder_LubCheck_edit"
                              v-if="woInfo.workOrderStatus == 1 && userInfo.userNumber === woInfo.executePersonNumber && (woInfo.reportType==-1 ? scope.row.reportPercent == 100 : scope.row.perfectRate == 100)"
                              style="font-family: MicrosoftYaHei-Bold; font-size: 13px; color: #333; line-height: 13px; margin-bottom: 8px"
                            >
                              编辑
                            </div>
                            <div
                              v-has="service_order-down-btn"
                              v-if="scope.row.reportPath && (woInfo.workOrderStatus == 2 || woInfo.workOrderStatus == 3)"
                              @click="handleDownloadReport(scope.row)"
                              style="font-family: MicrosoftYaHei-Bold; font-size: 13px; color: #333; line-height: 13px; margin-bottom: 8px"
                            >
                              下载报告
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <!-- 发送报告弹框 -->
      <el-dialog title="发送报告到邮箱" :visible.sync="sendEmailDialog" width="400px" :close-on-click-modal="false">
        <el-form :model="emailForm" :rules="emailRule" ref="emailRef" label-position="120px" :inline="true">
          <el-row>
            <el-col span="24">
              <el-form-item label="邮箱地址：" prop="emailAdress" required>
                <el-input v-model="emailForm.emailAdress" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="display: flex; align-items: center; justify-content: center">
          <el-button type="danger" plain @click="cancelSend('emailRef')" size="small">取消</el-button>
          <el-button type="danger" @click="confirmSend('emailRef')" size="small">确认</el-button>
        </div>
      </el-dialog>
      <!-- 关闭工单弹出框 -->
      <el-dialog class="closeWorkOrder" :visible="dialogFormVisible" :show-close="false" width="30%">
        <el-form :model="ruleForm" :rules="closerules" ref="ruleForm" label-width="100px" label-position="top">
          <div style="display: flex; font-family: MicrosoftYaHei; line-height: 18px; font-size: 18px; color: #000; margin: 0px; align-items: center">
            <img src="../../assets/notice-icon.png" alt="" style="width: 18px; height: 18px; margin-right: 10px" />请选择关闭原因（单选）
          </div>
          <div class="notice-title">工单关闭后将无法再次开启</div>
          <div class="radioGroup">
            <el-radio-group v-model="ruleForm.close" size="small">
              <el-radio-button style="margin-right: 10px; border-radius: 4px" v-for="item in closeList" :key="item.value" :label="item.value">
                <div>{{ item.label }}</div>
              </el-radio-button>
            </el-radio-group>
            <!-- <span  style="height:28px;line-height:28px;border-radius:4px;display:inline-block;">{{item.label}}</span> -->
          </div>
          <el-form-item prop="text" v-if="ruleForm.close == 3" style="margin-top: 16px">
            <el-input type="textarea" placeholder="请输入" resize="none" v-model="ruleForm.text" maxlength="300" rows="2" show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style="margin-top: 20px">
          <el-button type="danger" plain @click="handleReset('ruleForm')" size="small">取消</el-button>
          <el-button type="danger" @click="handleSubmit('ruleForm')" size="small">提交</el-button>
        </div>
      </el-dialog>
      <!-- 创建任务弹框 -->
      <el-dialog title="创建调查任务" :visible.sync="createTaskVisiable" width="60%" class="create-task">
        <div style="display: flex; align-items: center; margin-bottom: 10px">
          <span>关键词搜索：</span>
          <el-input
            size="small"
            v-model="lubricationName"
            placeholder="请输入关键词"
            suffix-icon="el-icon-search"
            style="width: 30%"
            maxlength="50"
            @change="handleSearchTableData"
            @clear="clearSearch"
            clearable
          ></el-input>
          <span style="margin-left: 10px">设备分组：</span>
          <el-cascader
            :options="deviceGroupList"
            size="small"
            style="width: 30%"
            :props="{ label: 'groupName', value: 'id' }"
            v-model="selectGroupId"
            placeholder="请选择"
            no-data-text="暂无分组"
            @change="handleSearchLupTableData"
            filterable
            clearable
          >
          </el-cascader>
          <div style="justify-content: space-between; display: flex; align-items: center; flex: 1; margin-left: 10px">
            <div @click="handleRefresh" style="color: #001450; font-weight: normal; font-size: 13px; margin-right: 20px; cursor: pointer">
              <i class="el-icon-refresh-right" style="margin-right: 4px"></i>刷新
            </div>
            <el-button type="danger" plain @click="handleAddDevice" size="small">新建设备</el-button>
          </div>
        </div>
        <div>
          <el-table
            :data="lumDataCustomers"
            tooltip-effect="dark"
            ref="refTable"
            class="add-task"
            v-loading="loadingLum"
            v-el-table-infinite-scroll="load"
            :row-key="rowKey"
            @selection-change="handleSelectionChange"
          >
            <el-table-column :selectable="checkedSelectTask" :reserve-selection="true" type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="serviceimg" min-width="20%" label="润滑点" :show-overflow-tooltip="true" :render-header="renderHeader">
              <template width="90" slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <img style="width: 64px; height: 64px; border: none; margin-right: 12px" :src="scope.row.lubricationPointPicPath ? scope.row.lubricationPointPicPath : defaultIcon" />
                  <span>{{ scope.row.lubricationPointType }}-{{ scope.row.lubricationPointName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="deviceName" min-width="18%" label="设备名称" :show-overflow-tooltip="true" :render-header="renderHeader"> </el-table-column>
            <el-table-column prop="oilName" min-width="10%" label="润滑油" :show-overflow-tooltip="true" :render-header="renderHeader">
              <template slot-scope="scope">
                {{ scope.row.oilName || "暂无" }}
              </template>
            </el-table-column>
            <el-table-column prop="lastOilChangeTime" min-width="10%" label="上次任务日期" :show-overflow-tooltip="true" :render-header="renderHeader">
              <template slot-scope="scope">
                {{ scope.row.lastOilChangeTime || "暂无" }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer">
          <el-button type="danger" plain @click="handleResetAddTask()" size="small">取消</el-button>
          <el-button type="danger" @click="submitLubrication()" size="small">添加</el-button>
        </div>
      </el-dialog>
      <!-- 编辑工单 -->
      <el-dialog title="编辑工单" :visible.sync="editWorkorderVisisble" width="30%" class="edit-workOrder" :close-on-click-modal="false" :close-on-press-escape="false">
        <div style="padding: 20px 0">
          <div style="padding: 20px; background: #f9f9f9; border: 1px solid #e9e9e9; font-family: MicrosoftYaHei">
            <div style="display: flex; align-items: center; margin-bottom: 16px">
              <span style="width: 100px; font-size: 13px; line-height: 13px; color: #999">工单编号</span>
              <span style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.workOrderNumber }}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 16px">
              <span style="width: 100px; font-size: 13px; line-height: 13px; color: #999">工单类型</span>
              <span style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.serviceName }}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 16px">
              <span style="width: 100px; font-size: 13px; line-height: 13px; color: #999">客户名称</span>
              <span class="no-wrap" style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.contactCompanyName || "暂无" }}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 16px">
              <span style="width: 100px; font-size: 13px; line-height: 13px; color: #999">所属车间</span>
              <span class="no-wrap" style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.workshopName }}</span>
            </div>
            <!-- <div style="display: flex; align-items: center">
              <span style="width: 100px; font-size: 13px; line-height: 13px; color: #999">客户联系人</span>
              <span style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.contactName || "暂无" }}</span>
            </div> -->
          </div>
          <div>
            <el-form :model="ruleForm1" :rules="ruleForm1rules" ref="ruleForm1" label-width="100px" label-position="top">
              <!-- 移除服务创赢、预约日期、服务地址 -->
              <el-form-item prop="shortDesc" style="margin-top: 14px" label="服务简述">
                <el-input type="textarea" placeholder="请填写服务简述" v-model="ruleForm1.shortDesc" maxlength="25" rows="2" resize="none" show-word-limit></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer">
          <el-button type="danger" plain @click="handleResetEdit('ruleForm1')" size="small">取消</el-button>
          <el-button type="danger" @click="handleSubmitEdit('ruleForm1')" size="small">保存</el-button>
        </div>
      </el-dialog>
      <!-- 删除调查任务弹框 -->
      <el-dialog class="closeWorkOrder" :visible.sync="taskDeleteVisible" :show-close="false" width="30%">
        <div style="display: flex; font-family: MicrosoftYaHei; line-height: 18px; font-size: 18px; color: #000; margin: 0px; align-items: center">
          <img src="../../assets/notice-icon.png" alt="" style="width: 18px; height: 18px; margin-right: 10px" />是否删除调查任务？
        </div>
        <div class="notice-title">任务删除后无法恢复，请谨慎操作。</div>
        <div slot="footer">
          <el-button type="danger" plain @click="handleResetReport()" size="small">取消</el-button>
          <el-button type="danger" @click="sureDeleteReport()" size="small">删除</el-button>
        </div>
      </el-dialog>
      <!-- 完结工单 -->
      <el-dialog class="closeWorkOrder" :visible.sync="finishWorkorder" :show-close="false" width="30%">
        <div style="display: flex; font-family: MicrosoftYaHei; line-height: 18px; font-size: 18px; color: #000; margin: 0px; align-items: center">
          <img src="../../assets/notice-icon.png" alt="" style="width: 18px; height: 18px; margin-right: 10px" />是否完结工单？
        </div>
        <div class="notice-title">工单完结后将无法进行任何操作</div>
        <div slot="footer">
          <el-button type="danger" plain @click="handleResetFinish()" size="small">取消</el-button>
          <el-button type="danger" @click="sureFinishOrder('orderOnly')" size="small">完结</el-button>
        </div>
      </el-dialog>
      <!-- 分配弹框 -->
      <el-dialog title="分配工单" :visible.sync="executePersonNameVisiable" width="40%" class="create-task radio-table">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
          <div style="font-family: MicrosoftYaHei-Bold; font-size: 16px; line-height: 14px; color: #000;display:flex;flex-wrap:nowrap;align-items:center">
            <span style="width: 8px; height: 8px; display: inline-block; border-radius: 50%; background: #dd0000; margin-right: 12px"></span>
            <div v-html="initTemplateContent(woInfo)" style="display:flex" @click="clickRoleType"></div>
          </div>
          <el-input size="small" v-model="userOrRoleName" placeholder="请输入关键词" suffix-icon="el-icon-search" style="width: 30%" maxlength="50" @change="searchRoleTableData" clearable></el-input>
        </div>
        <div>
          <el-table
            ref="multipleTable"
            :row-key="getRowKey"
            :data="engineerInfoList"
            v-loading="loadingPerson"
            v-el-table-infinite-scroll="loadMore"
            tooltip-effect="dark"
            @current-change="handleDistributionnChange"
          >
            <el-table-column width="55" :reserve-selection="true">
              <template slot-scope="scope">
                <el-radio v-model="distributionPerson" :label="scope.row"><i></i></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="userName" min-width="20%" label="姓名"> </el-table-column>
            <el-table-column prop="roleName" min-width="18%" label="角色">
              <template width="90" slot-scope="scope">
                <div v-for="(item, index) in scope.row.roleDtoList" :key="index">{{ item.accessTemplateName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="numCount" min-width="10%" label="工单数量"> </el-table-column>
            <el-table-column prop="count" min-width="10%" label="进行中工单"> </el-table-column>
          </el-table>
        </div>
        <div slot="footer">
          <el-button type="danger" plain @click="handleResetDistribution()" size="small">取消</el-button>
          <el-button type="danger" @click="submitDistribution()" size="small">分配</el-button>
        </div>
      </el-dialog>
      <el-dialog  title="提示" class="newDiaolg" :visible.sync="finishAllWorkorder" :show-close="true" width="30%">
        <div style="font-size: 14px; color: #666; ">
          完成该工单后可同步完成服务申请，是否同步完成？
        </div>
        <div slot="footer" style="display: flex;justify-content: space-between;">
          
          <el-button type="danger" plain @click="cancelFinishAllOrder()" size="small">取消</el-button>
          <div>
            <el-button plain type="danger" @click="sureFinishApply()" size="small">同步完成服务申请</el-button>
            <el-button type="danger" @click="onlyFinishWorkOrder()" size="small">仅完成工单</el-button>
          </div>
          
        </div>
      </el-dialog> 
      <el-dialog title="补全申请单信息" class="newDiaolg" :visible.sync="applyMsgDialog" :show-close="true" width="30%">
      <div style="font-size: 14px; color: #666;margin-top: 20px; ">
        <i class="el-icon-warning" style="color:rgb(255,153,0);font-size: 15px;margin-right:4px;" ></i>申请单必填信息缺失，工单可完成，请编辑申请单并补全信息后，重新尝试完结申请单
      </div>
      <div slot="footer">
          <el-button plain @click="cancelFinishApplyDialog()" size="small">取消</el-button>
          <el-button  type="danger" plain @click="GoToReplenish()" size="small">前往补全</el-button>
      </div>
    </el-dialog>
    </div>
    <!-- 选择润滑点 -->
    <div v-if="woInfo && woInfo.id">
      <lupDialogNew
        :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
        :singleFlag="false"
        :checkedDevice="checkedDevice"
        :urlType="urlType"
        :taskType="taskType"
        :companyName="woInfo.contactCompanyName"
        :companyId="woInfo.companyId"
        :companyNumber="woInfo.contactCompanyNumber"
        :workshopId="woInfo.workshopId"
        :plantStudyServiceFlag="plantStudyServiceFlag"
        :reportType="woInfo.reportType"
        :isPlantStudyServiceFlag="true"
        :spId="woInfo.distributorCompanyId"
        v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
        v-on:confirmChooseLup="confirmChooseLup"
      >
      </lupDialogNew>
    </div>
    <WorkerOrderPromote
      v-if="promote_dialogVisible"
      :promoteDialogVisible="promote_dialogVisible"
      @promoteCloseDialog="promote_closeDialog"
      :workOrderNumber="woInfo.workOrderNumber"
      :callback="() => this.$_getWOInfo(this.$route.query.workOrderNumber)"
      :workerOrderMslaFlag="woInfo.isMslaFlag"
    />
  </div>
</template>
<script>
import elTableInfiniteScroll from "el-table-infinite-scroll";
import lupDialogNew from "../spotInspection/components/chooseLubricationPointWorkorder.vue";
import Promote from "../newWorkerOrderAndServiceApplyPromote/workerOrder_promote.js";
import taskDetail from "./mixins/taskDetail.js";
import DAModify from "./mixins/DAModify.js";
import serviceIncome from '@/components/newWorkOrder/components/serviceIncome'
export default {
  mixins: [Promote, DAModify, taskDetail],
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll
  },
  components: { lupDialogNew, serviceIncome, WorkerOrderPromote: () => import("../newWorkerOrderAndServiceApplyPromote/workerOrder_promote.vue") },
  data() {
    return {
      headImg: require("../../assets/headImg.png"),
      defaultIcon: require("../../assets/device_default.png"),
      toBeConfirmed1: require("../../assets/toBeConfirmed1.png"),
      toBeConfirmed: require("../../assets/toBeConfirmed.png"),
      toGoing1: require("../../assets/toGoing1.png"),
      toGoing: require("../../assets/toGoing.png"),
      toEvaluate1: require("../../assets/toEvaluate1.png"),
      toEvaluate: require("../../assets/toEvaluate.png"),
      finishIcon1: require("../../assets/finish-icon1.png"),
      finishIcon: require("../../assets/finish-icon.png"),
      closeIcon1: require("../../assets/close-order-icon1.png"),
      closeIcon: require("../../assets/close-order-icon.png"),
      src1: require("../../assets/xingxing_1.png"),
      src2: require("../../assets/xingxing.png")
    };
  },
  mounted() {},

  created() {},

  methods: {
    // 提报优秀案例
    createCase(){
      // 查询当月案例
      this.requestMethodGet('/emEcReport/queryNowMonthBySpId',{spId:this.woInfo.distributorCompanyId}).then(res=>{
        if(res.data.code == 1000){
          if(res.data.data<5){
            this.$confirm('确认提报该工单为优秀案例？', '提示', {
              confirmButtonText: '确认提报',
              cancelButtonText: '暂时不提报'
            }).then(() => {
              const fromPageType = 'workOrder'
              if(this.woInfo.reportId){
                this.$router.push({
                    path:'/distributorCaseIndex/Create',
                    query:{
                      caseId:this.woInfo.reportId,
                      createType:'edit',
                      fromPageType: fromPageType
                    }
                  })
              }else{
                this.$router.push({
                  path:'/distributorCaseIndex/Create',
                  query:{
                    distributorCompanyId:this.woInfo.distributorCompanyId,
                    distributorCompanyName:this.woInfo.distributorCompanyName,
                    customerName:this.woInfo.contactCompanyName,
                    customerCompanyNumber:this.woInfo.contactCompanyNumber,
                    companyId:this.woInfo.companyId,
                    createUserName:this.userInfo.userName,
                    createUserId:this.userInfo.userId,
                    createUserNumber:this.userInfo.userNumber,
                    serviceOrderId:this.woInfo.id,
                    fromPageType:fromPageType,
                    createType:'add'
                  }
                })
              }
            }).catch(() => {
                        
            });
          }else{
            this.$confirm('每月最多提报5个案例，当前月份的额度已用完，请下月再提报。', '提示', {
              confirmButtonText: '知道了',
              showCancelButton:false,
              confirmButtonClass:'case-confirm'
            }).then(() => {
            }).catch(() => {
            });
          }
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    revocationCase(){
      this.$confirm('确认撤回该工单的优秀案例？', '提示', {
        confirmButtonText: '确认撤回',
        cancelButtonText: '取消'
      }).then(() => {
        // 执行撤回操作
        const params = {
          id:this.woInfo.reportId,
          reportStatus:2
        }
        this.requestMethodPost('/emEcReport/updateStatus',params).then(res=>{
          if(res.data.code == 1000){
            this.$_getWOInfo(this.$route.query.workOrderNumber);
          }else{
            this.$message({
                message: res.data.msg,
                type: "error"
            });
          }
        })
      }).catch(() => {
                  
      });
    },
    viewDetail(){
      this.$router.push({
        path:'/distributorCaseIndex/caseDetail',
        query:{
          caseId:this.woInfo.reportId,
          type:'distributor'
        }
      })
    },
  }
};
</script>
<style lang="less" scoped>
.da-tag-company {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #f2f6fc !important;
  border-color: #dcdfe6 !important ;
}
.work-order-detail {
  padding: 10px;
  height: calc(100% - 40px);

  &-title {
    font-weight: bold;
    font-size: 16px;
  }
  &-base-info {
    padding: 20px 0;
    overflow: hidden;
  }

  &-woInfo {
    &-img {
      display: flex;
      justify-content: start;
      img {
        width: 128px;
        height: 128px;
        margin-right: 20px;
      }
    }
  }
  &-status-box {
    position: relative;
    &-flex {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-line {
        height: 2px;
        width: 100%;
        position: absolute;
        top: 10px;
        left: 0px;
        background: rgb(204, 204, 204);
      }
      img {
        width: 48px;
        height: 48px;
        background: #ffffff;
      }
      &-progress {
        padding-top: 20px;
      }
    }
  }
  .header-no-wrap {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 90%;
    display: inline-block;
  }
  // 设置显示两行，超出省略
  /deep/ .el-table th > .cell {
    word-break: keep-all !important;
    white-space: nowrap !important;
  }

  .process-wrap1 {
    width: 320px;
    background: #fff;
    border-radius: 8px;
  }
  .process-wrap {
    display: flex;
    align-items: center;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    justify-content: space-between;
    padding: 0 20px;
    height: 40px;
    line-height: 40px;
    background: #001450;
    font-size: 13px;
    color: #fff;
    font-family: MicrosoftYaHei;
  }
  .add-task {
    height: 100% !important;
    overflow-y: auto;
  }
  /deep/ .el-textarea__inner {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #606266;
  }
  /deep/ .el-message-box__btns .el-button--primary {
    background-color: #ff0000 !important;
  }
  /deep/.create-task,
  /deep/.edit-workOrder {
    .el-dialog__title {
      font-size: 18px;
    }
    .el-dialog__body {
      padding: 0 20px 30px;
    }
  }
  .notice-title {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    line-height: 14px;
    margin: 20px 0 10px;
    color: #666;
  }
  /deep/ .radioGroup {
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #666;
    .el-radio-button__inner {
      height: 28px;
      line-height: 28px;
      padding: 0px 16px;
      border: 1px solid #e9e9e9;
    }
    .el-radio-button:last-child .el-radio-button__inner {
      border-radius: 4px;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #f9f9f9;
      background-color: #001450;
      border-color: #001450;
      -webkit-box-shadow: -1px 0 0 0 #001450;
      box-shadow: -1px 0 0 0 #001450;
    }
    .el-radio-button__inner:hover {
      color: #001450;
      border: 1px solid #001450;
    }
  }
  /deep/ .process {
    .el-progress-bar__outer {
      background: rgba(211, 0, 0, 0.1);
    }
  }
  .link-wrap {
    div {
      display: block;
      cursor: pointer;
    }
  }
  .el-dialog__title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    line-height: 16px;
  }
  .right-wrap {
    flex: 1;
    margin-left: 20px;
    position: relative;
    overflow-y: auto;
  }
  /deep/ .process1 {
    .el-progress-bar__outer {
      background: rgba(0, 136, 136, 0.15);
    }
  }
  /deep/.el-table .el-table__header-wrapper thead {
    font-size: 13px;
    color: #999;
    font-family: MicrosoftYaHei;
  }
  /deep/.el-table td {
    height: 72px;
  }
  .no-wrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .star {
    width: 20px;
    height: 20px;
    margin-right: 2px;
  }
  /deep/.el-textarea__inner {
    height: 100px;
  }
  /deep/.closeWorkOrder {
    .el-dialog__header {
      padding: 0px;
    }
  }
  /deep/.el-textarea__inner {
    &::placeholder {
      color: #999;
      font-family: MicrosoftYaHei;
      font-size: 13px;
    }
  }
  .icon-service {
    width: 18px;
    height: 18px;
  }
}
/deep/.el-form-item {
  margin-bottom: 0px;
}
.el-form-item__label {
  line-height: 14px;
  margin-top: 16px;
}

.el-form-item__content {
  margin-top: 10px;
  line-height: 14px !important;
}
.work-order-detail-status-wrap-progress {
  .progress-dec {
    font-size: 16px;
  }
  .weui-cell-third {
    background: #fff;
  }
  .weui-cell-list {
    background: #fff;
    position: relative;
    margin: 0 20px 0px 9px;
  }
  .progress-box {
    margin-top: 20px;
    font-size: 12px;
    overflow: auto;
  }
  .weui-cell-line {
    margin-left: 5px;
    padding-left: 25px;
    padding-bottom: 36px;
    border-left: 1px solid #ddd;
    background: #fff;
  }
  .weui-cell-list:last-of-type .weui-cell-line {
    margin-left: 5px;
    padding-left: 25px;
    padding-bottom: 10px;
    border-left: none;
    background: #fff;
  }

  .weui-cell-line view {
    padding-bottom: 5px;
  }
  .weui-cell-circle-new {
    position: absolute;
    top: 0;
    left: -9px;
  }
  .base-title {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
  }
  .weui-cell-list:last-of-type .weui-cell-line {
    margin-left: 5px;
    padding-left: 25px;
    padding-bottom: 10px;
    border-left: none;
    background: #fff;
  }
  .footer {
    padding: 20px 0;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  .work-order-detail .el-timeline {
    padding: 20px 0 0;
  }
  .weui-cell-list:first-of-type {
    color: #000;
  }
}
</style>
<style>
.status-tag {
  width: 60px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  border-radius: 14px;
  display: inline-block;
  margin-left: 10px;
}
.work-order-detail .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.work-order-detail .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}

.work-order-detail .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.work-order-detail .el-form-item__label {
  color: #999999;
  padding: 0;
}
.work-order-detail .el-tabs__nav-wrap::after {
  background: none;
}
.work-order-detail .el-tabs__item.is-active {
  color: red;
}
.work-order-detail .el-tabs__active-bar {
  background: red;
}
.work-order-detail .el-form-item__label {
  color: #999999;
}

.download {
  display: inline-block;
  width: 60px;
  height: 24px;
  line-height: 24px;
  box-sizing: border-box;
  border: 1px solid #0c479d;
  color: #0c479d;
  font-size: 14px;
  text-align: center;
  border-radius: 24px;
  cursor: pointer;
}
.radio-table .el-table::before {
  height: 0px !important;
}
.create-task .el-dialog__title,
.edit-workOrder .el-dialog__title {
  font-size: 18px !important;
}
.create-task .el-dialog__body,
.edit-workOrder .el-dialog__body {
  padding: 0 20px 40px !important;
}

.customerStyle {
  display: flex;
  padding: 0 20px;
}
.case-title{
  width: 74px;
  height: 28px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dd0000;
  color: #fff;
  font-size: 12px;
  margin: 0 10px;
}
</style>
