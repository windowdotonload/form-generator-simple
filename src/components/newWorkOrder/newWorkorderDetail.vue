<template>
  <div class="work-order-detail" style="position: relative; background: #f2f3f6">
    <div
      v-if="woInfo.workOrderStatus == '0' || woInfo.workOrderStatus == '1' || woInfo.workOrderStatus == '2' || (promote_btnDisplay && woInfo.serviceType != '11')"
      class="return-btn"
      style="position: absolute; right: 20px; height: 55px; line-height: 55px; top: -55px; color: red; cursor: pointer; display: flex; align-items: center"
    >
      <!-- 工单审批流提升 ,woInfo.serviceType == 11是润滑调查工单，不显示撤回-->
      <el-button size="small" v-if="promote_btnDisplay && woInfo.serviceType != '11' && $_has('PC_work_order_revert')" type="danger" @click="promote_revertClick">
        {{ promote_revertBtnName }}
      </el-button>
      <el-button
        type="danger"
        plain
        size="small"
        @click="createCase"
        v-if="woInfo.workOrderStatus == '2' && showCreateCaseBtn"
        v-auth="{
          menuCodes: 'Workorder_SubmitExcellentcase',
          strategyNames: ['personal'],
          strategySource: {
            personal: userInfo.userId,
          },
        }"
      >
        提报优秀案例
      </el-button>
      <el-button
        type="danger"
        plain
        size="small"
        @click="revocationCase"
        v-if="woInfo.isGood && woInfo.reportStatus == 1 && revocationCaseType == 2"
        v-auth="{
          menuCodes: 'Workorder_ExcellentcaseWithdraw',
          strategyNames: ['personal'],
          strategySource: {
            personal: userInfo.userId,
          },
        }"
      >
        撤回优秀案例
      </el-button>
      <!-- 美孚，经销商关闭 -->
      <el-button
        type="danger"
        v-if="
          woInfo.workOrderStatus < 2 &&
          (($userInfo.userType == 0 && (woInfo.daFlag || (!woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
            ($userInfo.userType == 1 && (!woInfo.daFlag || (woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))))
        "
        plain
        size="small"
        @click="handleClose"
        v-has="EMSP_service_order_list_cancel_btn"
      >
        关闭工单
      </el-button>
      <!-- 客户关闭 -->
      <el-button
        type="danger"
        v-if="woInfo.workOrderStatus == 0 && $userInfo.userType == 2 && woInfo.contactCompanyNumber == $userInfo.companyNumber"
        plain
        size="small"
        @click="handleClose"
        v-has="service_order_list_cancel_btn"
      >
        关闭工单
      </el-button>
      <el-button
        type="danger"
        size="small"
        v-has="PC_WorkOrder_reassign"
        @click="handleDistributive('first')"
        v-if="
          woInfo.workOrderStatus == '1' &&
          (($userInfo.userType == 0 && (woInfo.daFlag || (!woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
            ($userInfo.userType == 1 && (!woInfo.daFlag || (woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))))
        "
      >
        重新分配
      </el-button>
      <el-button type="danger" v-has="PC_work_order_finish" v-if="$userInfo.userId == woInfo.executeUserId && woInfo.workOrderStatus == '1'" plain size="small" @click="handleFinish">
        完结工单
      </el-button>
    </div>
    <div class="work-order-detail" :style="mainminheight">
      <el-form :model="woInfo" :rules="rules" ref="woInfo" label-width="100px" label-position="top" class="work-order-detail-woInfo">
        <div id="header" style="padding: 16px 20px 16px 16px; background: #fff">
          <div style="font-family: MicrosoftYaHei-Bold; font-size: 20px; color: #000; line-height: 28px; display: flex; align-items: center; font-weight: bold">
            {{ woInfo.serviceName }}
            <span class="status-tag" v-if="woInfo.workOrderStatus == 2" style="background: #001450">{{ woInfo.workOrderStatusName }}</span>
            <span class="status-tag" v-if="woInfo.workOrderStatus == 0" style="background: #dd0000">{{ woInfo.workOrderStatusName }}</span>
            <span class="status-tag" v-if="woInfo.workOrderStatus == 1" style="background: #008888">{{ woInfo.workOrderStatusName }}</span>
            <span class="status-tag" v-if="woInfo.workOrderStatus > 2" style="background: #ccc">{{ woInfo.workOrderStatusName }}</span>
            <div class="case-title" v-if="woInfo.isGood">优秀案例</div>
            <el-link :underline="false" style="color: #dd0000" v-if="woInfo.isGood && revocationCaseType == 2" @click="viewDetail" v-has="Workorder_ExcellentcaseSu">提交详情</el-link>
          </div>
          <div style="font-family: MicrosoftYaHei; font-size: 12px; margin-top: 16px">
            <el-row>
              <el-col :span="4" style="margin-left: 0px">
                <el-form-item label="工单编号">
                  <span style="font-size: 13px; font-family: ArialMt">{{ woInfo.workOrderNumber || "暂无" }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-left: 0px">
                <el-form-item label="服务商">
                  <el-tooltip class="item" effect="dark" :content="woInfo.distributorCompanyName" placement="top-start">
                    <div class="header-no-wrap" style="display: flex; align-items: center">
                      <span class="da-tag-company">{{ woInfo.distributorCompanyName || "暂无" }}</span>
                      <img v-if="woInfo.daFlag" src="../../assets/da_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
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
              <el-col v-if="(woInfo.workOrderPesFlag == 1 || woInfo.workOrderPesFlag == 2) && PESpackageBtn" :span="4" style="margin-left: 0px; cursor: pointer">
                <el-form-item label="所属计划工程服务档案">
                  <span
                    @click="handlePesDetail"
                    style="font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 500px; display: inline-block; color: #666; font-family: MicrosoftYaHei"
                    >{{ woInfo.servicePackage || "暂无" }}<i class="el-icon-arrow-right"></i
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
          <div style="display: -webkit-box; margin-top: 20px">
            <div class="process-wrap1" :style="mainminFormheight">
              <div class="process-wrap">
                <div style="display: flex; align-items: center">
                  <el-popover class="el-popover-detail" placement="bottom" width="272" @show="showPopverExecute" ref="popoverExecute" trigger="click">
                    <div>
                      <div style="display: flex">
                        <img :src="exceptDetail.headUrl ? exceptDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                        <div style="flex: 1; margin-left: 10px">
                          <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ exceptDetail.userName }}</div>
                          <div style="color: rgb(0, 0, 0, 0.5); line-height: 14px; margin-top: 8px">{{ exceptDetail.roleNames || "暂无" }}</div>
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
                    <span
                      slot="reference"
                      :disabled="!woInfo.executePersonName"
                      class="copy_text"
                      type="text"
                      style="color: #fff; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px; display: flex; align-items: center"
                    >
                      <div style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; max-width: 260px">执行人：{{ woInfo.executePersonName || "暂无" }}</div>
                      <el-tooltip
                        :content="
                          woInfo.executePersonHonoraryMedal == '3' ? '服务大师' : woInfo.executePersonHonoraryMedal == '2' ? '服务达人' : woInfo.executePersonHonoraryMedal == '1' ? '服务先锋' : ''
                        "
                        placement="top"
                      >
                        <img v-if="woInfo.executePersonHonoraryMedal == '3'" src="../../assets/small_service_great_person.png" alt="" style="width: 24px; height: 20px; margin-left: 4px" />
                        <img v-if="woInfo.executePersonHonoraryMedal == '2'" src="../../assets/small_service_master.png" alt="" style="width: 24px; height: 20px; margin-left: 4px" />
                        <img v-if="woInfo.executePersonHonoraryMedal == '1'" src="../../assets/small_service_pioneer.png" alt="" style="width: 24px; height: 20px; margin-left: 4px" />
                      </el-tooltip>
                    </span>
                  </el-popover>
                </div>
                <span
                  v-has="PC_EMSP_workorder_edit_btn"
                  v-if="
                    woInfo.workOrderStatus < 2 &&
                    (($userInfo.userType == 0 && (woInfo.daFlag || (!woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
                      ($userInfo.userType == 1 && (!woInfo.daFlag || (woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))))
                  "
                  style="color: #dd0000; cursor: pointer"
                  @click="editWorkorder"
                >
                  编辑
                </span>
              </div>
              <div style="font-size: 13px; color: #999; font-family: MicrosoftYaHei; padding: 20px 0; overflow: auto" :style="mainminProcessheight">
                <!-- 更新删除预约日期与服务地址 -->
                <div :style="{ marginBottom: woInfo.customerPesFlag == '1' ? '10px' : '16px' }" class="customerStyle">
                  <div style="width: 90px">客户名称</div>
                  <div style="flex: 1; color: #333; display: flex">
                    <span class="no-wrap" style="max-width: 158px">{{ woInfo.contactCompanyName || "暂无" }}</span>
                    <img v-if="woInfo.customerPesFlag == '1' || woInfo.customerPesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="margin-left: 8px; width: 24px; height: 23px" />
                    <img v-if="woInfo.customerPesFlag == '2' || woInfo.customerPesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="margin-left: 8px; width: 24px; height: 23px" />
                  </div>
                </div>
                <div style="display: flex; margin-bottom: 16px; padding: 0 20px">
                  <div style="width: 90px">服务简述</div>
                  <div class="no-wrap" style="flex: 1; color: #333">{{ woInfo.shortDesc || "暂无" }}</div>
                </div>
                <div style="padding: 0 20px">
                  <div style="width: 90px">照片</div>
                  <div v-if="pictureDtoList.length > 0">
                    <div style="display: flex; align-items: center; margin-top: 16px">
                      <el-image style="width: 80px; height: 80px; margin-right: 20px" v-for="(item, index) in pictureDtoList" :key="index" :src="item.url" :prediv-src-list="[item.url]"> </el-image>
                    </div>
                  </div>
                  <div v-if="pictureDtoList.length == 0" style="margin-top: 10px; color: #333">暂无</div>
                </div>
                <div style="margin: 24px 0; height: 1px; width: 100%; background: #e9e9e9"></div>
                <!-- 下方进程 -->
                <div class="work-order-detail-status-wrap-progress" style="padding: 0 20px 20px">
                  <div style="font-family: MicrosoftYaHei-Bold; font-size: 20px; color: #000; line-height: 28px; display: flex; align-items: center; font-weight: bold">
                    {{ woInfo.workOrderStatusName }}
                  </div>
                  <div class="progress-box" :style="{ height: pictureDtoList.length > 0 ? '160px' : '230px' }">
                    <div v-for="(item, index) in woInfo.recordDtoList" :key="index" class="weui-cell-list">
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
                        <img style="width: 28px; height: 28px" v-if="item.operationStatus > 3 && item.operationStatus < 6" :src="closeIcon1" />
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
                    <div v-for="(item, index) in imgsStar" :key="index" @click="select(item)" style="display: flex; align-items: center">
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
                            resize="none"
                            placeholder="为了给您提供更优质的服务，请输入反馈意见"
                            v-model="formRemark.remark"
                            maxlength="200"
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
                  <div style="display: flex; align-items: center">
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
                <div v-if="woInfo.workOrderStatus == 4" style="padding: 20px; margin-bottom: 20px">
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
              <!-- 润滑点信息 -->
              <div v-if="lumData != undefined" style="width: 100%; background: #fff; padding-bottom: 60px; position: relative">
                <div style="width: calc(100% - 40px); padding: 20px 20px 0">
                  <div style="display: flex; width: 100%; justify-content: space-between; align-items: center">
                    <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; border-left: 3px solid #dd0000; padding-left: 10px">
                      润滑点 <span v-if="lumData.length != 0">（{{ lumTotalNum }}）</span>
                    </div>
                    <div
                      v-if="(woInfo.workOrderStatus == 0 || woInfo.workOrderStatus == 1) && (woInfo.reportType != 17 || (woInfo.reportType == 17 && lumData.length == 0))"
                      style="color: #001450; font-family: MicrosoftYaHei; font-size: 13px; cursor: pointer"
                      v-has="PC_WorkOrder_addLub"
                    >
                      <el-button
                        :disabled="woInfo.reportType == 3 || (woInfo.reportType == 0 && woInfo.coreTemplateId == 0) ? false : !(woInfo.paramDataLubFlag || woInfo.coreDataLubFlag)"
                        v-has="PC_WorkOrder_addLub"
                        v-if="
                          (woInfo.workOrderStatus < 2 && (($userInfo.userType == 0 && woInfo.daFlag) || ($userInfo.userType == 0 && !woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
                          (woInfo.workOrderStatus < 2 && (($userInfo.userType == 1 && woInfo.daFlag && $userInfo.userId == woInfo.executeUserId) || ($userInfo.userType == 1 && !woInfo.daFlag)))
                        "
                        @click="addLubricationPoints()"
                        type="text"
                        >添加润滑点</el-button
                      >
                    </div>
                  </div>
                  <el-input
                    size="small"
                    v-model="lubricationPointsSearch"
                    placeholder="请输入关键词"
                    suffix-icon="el-icon-search"
                    style="width: 30%; margin: 24px 0 6px"
                    maxlength="50"
                    @change="handleSearchLumData"
                    clearable
                  ></el-input>
                  <div v-if="searchLumResult && lumData.length == 0" style="font-family: MicrosoftYaHei; height: 220px; line-height: 220px; font-size: 13px; color: #999; text-align: center">
                    暂无搜索内容
                  </div>
                  <div v-if="!searchLumResult && lumData.length == 0" style="font-family: MicrosoftYaHei; height: 146px; line-height: 146px; font-size: 13px; color: #999; text-align: center">
                    暂无关联设备&润滑点
                  </div>
                  <div v-if="lumData.length">
                    <el-table :data="lumData" v-loading="loading" tooltip-effect="dark" style="width: calc(100% - 40px)">
                      <el-table-column prop="serviceimg" min-width="20%" label="润滑点">
                        <template slot-scope="scope">
                          <div class="flex-center" style="display: flex; align-items: center">
                            <img
                              style="width: 64px; height: 64px; border: none; margin-right: 12px"
                              :src="scope.row.lubricationPointPicPathFull ? scope.row.lubricationPointPicPathFull : defaultIcon"
                            />
                            <span style="cursor: pointer" @click="toDeviceDetail(scope.row)"
                              >{{ scope.row.lubricationPointType }} <span v-if="scope.row.lubricationPointName"> - {{ scope.row.lubricationPointName }}</span></span
                            >
                            <i class="el-icon-arrow-right"></i>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="deviceName" min-width="10%" label="设备名称"> </el-table-column>
                      <el-table-column prop="oilName" min-width="10%" label="润滑油">
                        <template slot-scope="scope">
                          {{ scope.row.oilName || "暂无" }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="lastOilChangeTime" min-width="15%" label="上次任务日期">
                        <template slot-scope="scope">
                          {{ scope.row.lastOilChangeTime || "暂无" }}
                        </template>
                      </el-table-column>
                      <!-- v-if="
                          (woInfo.workOrderStatus == 0 || woInfo.workOrderStatus == 1) &&
                            userInfo.userNumber === woInfo.executePersonNumber &&
                            (woInfo.reportType != 17 || (woInfo.reportType == 17 && lumData.length == 0)) &&
                            DA_judgeDAOPAuth(woInfo, userInfo, 0)
                        " -->
                      <el-table-column
                        label="操作"
                        min-width="6%"
                        align="center"
                        v-has="PC_WorkOrder_releaseLub"
                        v-if="
                          (woInfo.workOrderStatus < 2 && (($userInfo.userType == 0 && woInfo.daFlag) || ($userInfo.userType == 0 && !woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
                          (woInfo.workOrderStatus < 2 && (($userInfo.userType == 1 && woInfo.daFlag && $userInfo.userId == woInfo.executeUserId) || ($userInfo.userType == 1 && !woInfo.daFlag)))
                        "
                      >
                        <i class="el-icon-share"></i>
                        <template slot-scope="scope">
                          <el-link
                            type="danger"
                            @click="
                              handleDeleteLum(scope.row);
                              $gio.deleteLubrPointTrack($data);
                            "
                            style="margin-left: 10px"
                          >
                            移除
                          </el-link>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      layout="prev, pager, next"
                      :page-size="5"
                      @current-change="handleCurrentChangeLum"
                      style="float: right; display: flex; margin-top: 10px; position: absolute; bottom: 20px"
                      :current-page.sync="pagenationLum.current"
                      :total="lumTotalNum"
                    >
                    </el-pagination>
                  </div>
                </div>
              </div>
              <!-- 服务报告 -->
              <div style="width: 100%; background: #fff; margin-top: 20px; position: relative">
                <div class="service-wrap" :style="{ paddingBottom: serviceData.length > 10 ? '40px' : '20px' }">
                  <div style="display: flex; width: 100%; justify-content: space-between; align-items: center">
                    <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; border-left: 3px solid #dd0000; padding-left: 10px">
                      服务报告<span v-if="serviceData.length">（{{ serviceData.length }}）</span>
                    </div>
                  </div>
                  <!-- 在执行中状态，当【制作报告】按钮显示时 -->
                  <div class="notice-wrap" v-if="woInfo.workOrderStatus == '1' && (groupList.length || userInfo.userNumber === woInfo.executePersonNumber)">
                    <div class="flex-center">
                      <span style="color: #999; margin-right: 6px">温馨提示</span>完结工单前，请先完成服务报告
                      <!-- <span style="color: #dd0000; margin-left: 10px">发布进度 {{ unPublicDraftCount }}/{{ totalDraftCount }}</span> -->
                    </div>
                    <div style="display: flex; align-items: center">
                      <el-upload
                        v-if="(groupList.length || userInfo.userNumber === woInfo.executePersonNumber) && (!woInfo.haveDraftFlag || woInfo.coreDataStatus == 2) && !customeConfigDataList.length"
                        v-has="PC_WorkOrder_uploadreport"
                        style="height: 40px"
                        ref="upload"
                        :action="uploadUrl"
                        :on-prediv="handlePrediv"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :show-file-list="false"
                        :http-request="handleUploadForm"
                        :on-change="handleReportChange"
                        accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx"
                        :auto-upload="true"
                      >
                        <el-button type="text" size="small" style="color: #001450; font-size: 14px">上传报告</el-button>
                      </el-upload>
                      <el-button
                        type="text"
                        v-if="woInfo.workOrderStatus == '1' && woInfo.reportType && isCoreInfoFlag && !woInfo.coreDataStatus"
                        style="color: #001450; font-size: 14px"
                        @click="coreInfoUploadFile"
                        v-has="PC_WorkOrder_selectuploadreport"
                        >上传报告</el-button
                      >
                      <el-divider
                        v-if="woInfo.reportType && isCoreInfoFlag && !woInfo.coreDataStatus"
                        class="white-divider"
                        direction="vertical"
                        style="background-color: #fff; width: 1px"
                      ></el-divider>
                      <!-- isCoreInfoFlag && !this.woInfo.coreDataStatus -->
                      <el-button
                        type="text"
                        @click="handleMakeReport"
                        style="color: #001450"
                        v-has="PC_WorkOrder_selectonlinereport"
                        v-if="
                          woInfo.workOrderStatus == '1' && (groupList.length || userInfo.userNumber === woInfo.executePersonNumber) && woInfo.reportType && !woInfo.coreDataStatus && isCoreInfoFlag
                        "
                        >在线制作报告</el-button
                      >
                    </div>
                  </div>
                  <!-- FES/高工/管理员 -->
                  <editIndex
                    style="margin-top: 10px"
                    v-if="
                      isCoreInfoFlag &&
                      isExecuteRoleFlag &&
                      ((woInfo.coreDataStatus == 2 && woInfo.coreDataTemplateId && woInfo.reportType) || (woInfo.coreDataTemplateId && !woInfo.reportType)) &&
                      woInfo.workOrderStatus >= 1
                    "
                    ref="editServiceReportIndex"
                    :isEditFlag="userInfo.userNumber === woInfo.executePersonNumber && woInfo.workOrderStatus == '1'"
                    :workOrderNumber="woInfo.workOrderNumber"
                    :sysAttachmentList="sysAttachmentList"
                    v-on:saveSuccess="saveSuccess"
                    v-on:getCoreInfoId="getCoreInfoId"
                    v-on:uploadSuccess="uploadSuccess"
                  ></editIndex>
                  <!-- 暂无服务报告 -->
                  <!-- 无报告，且三角色，配了核心模板和报告模板，且选择了制作报告，报告未发布 
                        或者 非三角色，配置了核心模板没有配置报告模板（上传报告）
                        或者 非三角色，配置了核心模板且配置报告模板（制作报告）且报告未发布
                    -->
                  <div
                    v-if="
                      customeConfigDataList.length == 0 &&
                      serviceData.length == 0 &&
                      reportList.length == 0 &&
                      !(
                        isCoreInfoFlag &&
                        isExecuteRoleFlag &&
                        ((woInfo.coreDataStatus == 2 && woInfo.coreDataTemplateId && woInfo.reportType) ||
                          (woInfo.coreDataTemplateId && !woInfo.reportType && !woInfo.coreDataStatus && isCoreInfoFlag)) &&
                        (woInfo.executePersonRoleCodes.includes('admin') || woInfo.executePersonRoleCodes.includes('fes') || woInfo.executePersonRoleCodes.includes('ace-fes'))
                      )
                    "
                    style="font-family: MicrosoftYaHei; height: 126px; line-height: 126px; font-family: MicrosoftYaHei; font-size: 13px; color: #999; text-align: center"
                  >
                    暂无服务报告
                  </div>
                  <!-- 草稿列表 自定义报告列表-->
                  <div
                    v-if="
                      customeConfigDataList.length ||
                      (((woInfo.coreDataStatus == 1 && woInfo.coreDataTemplateId && isCoreInfoFlag) ||
                        (!woInfo.coreDataStatus && !woInfo.coreDataTemplateId) ||
                        (woInfo.executeUserId == $userInfo.userId && !isCoreInfoFlag)) &&
                        woInfo.reportType &&
                        (woInfo.workOrderStatus == 1 || woInfo.workOrderStatus == 0) &&
                        woInfo.executeUserId == $userInfo.userId)
                    "
                  >
                    <div v-if="customeConfigDataList && customeConfigDataList.length > 0">
                      <div
                        v-for="(item, index) in customeConfigDataList"
                        :key="index"
                        style="border: 1px solid #e9e9e9; font-family: MicrosoftYaHei; padding: 20px; border-radius: 4px; margin-top: 20px"
                      >
                        <div class="flex-center" style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                          <div style="width: 80%">
                            <div
                              @click="handlePreviewCustomeReport(item)"
                              style="
                                cursor: pointer;
                                text-decoration: underline;
                                font-weight: bold;
                                font-size: 13px;
                                color: #333;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                max-width: 90%;
                              "
                            >
                              {{ item.reportName || "--" }}
                            </div>
                            <div style="display: flex; align-items: center; margin-top: 16px">
                              <div class="tag" v-if="item.status == 0 " style="background: #dd0000">未发布</div>
                              <div class="tag" v-if="item.status == 1 " style="background: #008888">已发布</div>
                              <div style="font-weight: 400; font-size: 26rpx; line-height: 26rpx; color: #999; margin-left: 10px">完善率：{{ item.rate || '0%' }}</div>
                            </div>
                            <div style="margin-top: 16px; color: #999; display: flex; align-items: center" v-if="item.status == 1">
                              发布人：{{ item.createUserName || '--' }}
                              <div style="margin-left: 6px; border-left: 1px solid #e9e9e9; padding-left: 6px">发布时间：{{ item.createTime || '--' }}</div>
                            </div>
                          </div>
                          <div style="width: 50%; text-align: right">
                            <el-button
                              type="danger"
                              v-if="woInfo.workOrderStatus == 1 && $userInfo.userId === woInfo.executeUserId"
                              v-has="PC_WorkOrder_editdraft"
                              size="small"
                              @click="handleEdit(item)"
                            >
                              编辑
                            </el-button>
                            <el-button v-if="item.path" @click="handlePreview(item)" size="small" style="color: #001450">预览</el-button>
                            <el-button v-if="item.publishStatus == 1 && item.pdfCreateFlag != 2 && item.pdfCreateFlag != 3" @click="handleDown(item)" size="small" style="color: #001450"
                              >下载</el-button
                            >
                            <el-button v-if="item.status == '2'" disabled size="small" style="color: #b3b3b3">报告生成中···</el-button>
                            <el-button v-if="item.status == '3'" disabled size="small" style="color: #b3b3b3">报告生成失败，请重试</el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="reportList && reportList.length > 0 && !customeConfigDataList.length">
                      <div v-for="(item, index) in reportList" :key="index" style="border: 1px solid #e9e9e9; font-family: MicrosoftYaHei; padding: 20px; border-radius: 4px; margin-top: 20px">
                        <div class="flex-center" style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                          <div style="width: 80%">
                            <div
                              @click="handlePreview(item)"
                              style="
                                cursor: pointer;
                                text-decoration: underline;
                                font-weight: bold;
                                font-size: 13px;
                                color: #333;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                max-width: 90%;
                              "
                            >
                              {{ item.draftName }}
                            </div>
                            <div style="display: flex; align-items: center; margin-top: 16px">
                              <div class="tag" v-if="item.publishStatus == 0 && item.pdfCreateFlag != 2 && item.pdfCreateFlag != 3" style="background: #dd0000">未发布</div>
                              <div class="tag" v-if="item.publishStatus == 1 && item.pdfCreateFlag != 2 && item.pdfCreateFlag != 3" style="background: #008888">已发布</div>
                              <div style="font-weight: 400; font-size: 26rpx; line-height: 26rpx; color: #999; margin-left: 10px">完善率：{{ item.perfectRate }}%</div>
                            </div>
                            <div style="margin-top: 16px; color: #999; display: flex; align-items: center" v-if="item.publishStatus == 1 && item.pdfCreateFlag != 2 && item.pdfCreateFlag != 3">
                              发布人：{{ item.createUserName }}
                              <div style="margin-left: 6px; border-left: 1px solid #e9e9e9; padding-left: 6px">发布时间：{{ item.createTime }}</div>
                            </div>
                          </div>
                          <div style="flex: 1; text-align: right">
                            <el-button
                              type="danger"
                              v-if="woInfo.workOrderStatus == 1 && $userInfo.userId === woInfo.executeUserId"
                              v-has="PC_WorkOrder_editdraft"
                              size="small"
                              @click="handleEdit(item)"
                            >
                              编辑
                            </el-button>
                            <el-button v-if="item.draftPath && item.pdfCreateFlag == '1'" @click="handlePreview(item)" size="small" style="color: #001450">预览</el-button>
                            <el-button v-if="item.publishStatus == 1 && item.pdfCreateFlag != 2 && item.pdfCreateFlag != 3" @click="handleDown(item)" size="small" style="color: #001450"
                              >下载</el-button
                            >
                            <el-button v-if="item.pdfCreateFlag == '2'" disabled size="small" style="color: #b3b3b3">报告生成中···</el-button>
                            <el-button v-if="item.pdfCreateFlag == '3'" disabled size="small" style="color: #b3b3b3">报告生成失败，请重试</el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 美孚三角色，配置了模板，选择了上传报告，查看人是改工单的执行人,工单进行中 == 不展示-->
                  <!-- v-if="
                      !(
                        isCoreInfoFlag &&
                        ((woInfo.coreDataStatus == 2 && woInfo.coreDataTemplateId && woInfo.reportType) || (woInfo.coreDataTemplateId && !woInfo.reportType)) &&
                        woInfo.workOrderStatus >= 1 &&
                        (woInfo.executePersonRoleCodes.includes('admin') || woInfo.executePersonRoleCodes.includes('fes') || woInfo.executePersonRoleCodes.includes('ace-fes'))
                      ) ||
                        (!isCoreInfoFlag && serviceData.length && woInfo.workOrderStatus > 1)
                    " -->
                  <!-- 文件列表 -->
                  <div
                    v-if="
                      ($userInfo.userId != woInfo.executeUserId && woInfo.coreDataTemplateId && woInfo.coreDataStatus == 1 && woInfo.workOrderStatus >= 1) ||
                      (woInfo.reportType && (($userInfo.userId != woInfo.executeUserId && woInfo.workOrderStatus == 1) || woInfo.workOrderStatus > 1)) ||
                      (!woInfo.reportType && !woInfo.coreDataTemplateId && woInfo.workOrderStatus >= 1)
                    "
                  >
                    <!-- 服务报告有1条 -->
                    <div v-if="serviceData && serviceData.length == 1" style="border: 1px solid #e9e9e9; font-family: MicrosoftYaHei; padding: 20px; border-radius: 4px; margin-top: 20px">
                      <div v-for="(item, index) in serviceData" :key="index" class="flex-center" style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                        <img v-if="item.fileType == 'docx' || item.fileType == 'doc'" src="../../assets/word.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                        <img v-else-if="item.fileType == 'pdf'" src="../../assets/pdf.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                        <img v-else-if="item.fileType == 'ppt' || item.fileType == 'pptx'" src="../../assets/pptx.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                        <img
                          v-else-if="item.fileType == 'excel' || item.fileType == 'xlsx' || item.fileType == 'xls'"
                          src="../../assets/excel.png"
                          alt=""
                          style="width: 32px; height: 32px; margin-right: 12px"
                        />
                        <img v-else src="../../assets/unknow-icon.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                        <div style="font-family: MicrosoftYaHei; flex: 1">
                          <div
                            @click="perdivFile(item)"
                            style="
                              cursor: pointer;
                              text-decoration: underline;
                              font-weight: bold;
                              font-size: 13px;
                              color: #333;
                              overflow: hidden;
                              text-overflow: ellipsis;
                              white-space: nowrap;
                              max-width: 70%;
                            "
                          >
                            {{ item.attachmentFileName }}
                          </div>
                          <div class="flex-center" style="line-height: 12px; font-size: 12px; color: #999; margin-top: 12px">
                            <div v-if="item.businessId && item.lubricationPointNumber" style="margin-right: 6px; border-right: 1px solid #e9e9e9; padding-right: 6px">
                              <el-popover class="el-popover-detail" placement="bottom" width="272" trigger="click">
                                <div style="line-height: 30px; font-size: 13px; padding-left: 10px">
                                  <div style="color: #333">
                                    设备名称：<span style="color: #999">{{ item.deviceName }}</span>
                                  </div>
                                  <div style="color: #333">
                                    行业：<span style="color: #999">{{ item.industryFullName }}</span>
                                  </div>
                                  <div style="color: #333">
                                    设备类型：<span style="color: #999">{{ item.deviceTypeFullName }}</span>
                                  </div>
                                  <div style="color: #333">
                                    润滑点设备类型：<span style="color: #999">{{ item.lubricationPointType }}</span>
                                  </div>
                                </div>
                                <el-button slot="reference" class="copy_text" type="text" style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px; font-size: 12px"
                                  >润滑点：{{ item.lubricationPointType }} <span v-if="item.lubricationPointName">- {{ item.lubricationPointName }}</span></el-button
                                >
                              </el-popover>
                            </div>
                            <div style="min-width: 40px">{{ item.businessId ? "制作人：" : "上传人：" }}</div>
                            <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="popover + item.id" trigger="click">
                              <div>
                                <div style="display: flex">
                                  <img :src="uploadDetail.headUrl ? uploadDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                                  <div style="flex: 1; margin-left: 10px">
                                    <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ uploadDetail.userName }}</div>
                                    <div style="color: rgb(0, 0, 0, 0.5); line-height: 12px; margin-top: 8px; font-size: 12px">{{ uploadDetail.roleNames || "暂无" }}</div>
                                  </div>
                                </div>
                                <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                                  <span style="color: #666; margin-right: 8px">Tel: </span>
                                  <span>{{ uploadDetail.phonenumber }}</span>
                                  <el-button
                                    class="copy_tel"
                                    style="padding: 0px"
                                    type="text"
                                    v-clipboard:copy="uploadDetail.phonenumber"
                                    v-clipboard:success="onCopyTel"
                                    v-clipboard:error="onErrorTel"
                                  >
                                    <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                                  </el-button>
                                </div>
                                <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-bottom: 4px; display: flex; align-items: center">
                                  <span style="color: #666; margin-right: 8px">Mail: </span>
                                  <span>{{ uploadDetail.email }}</span>
                                  <el-button class="copy_mail" type="text" v-clipboard:copy="uploadDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px">
                                    <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                                  </el-button>
                                </div>
                              </div>
                              <el-button
                                slot="reference"
                                class="copy_text"
                                type="text"
                                @click="executePersonDetail(item)"
                                style="font-size: 12px; color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                                >{{ item.createUserName }}</el-button
                              >
                            </el-popover>
                            <div v-if="screenWidth > 1300" style="margin-left: 6px; border-left: 1px solid #e9e9e9; padding-left: 6px">
                              {{ item.businessId ? "发布时间：" : "上传时间：" }}{{ item.createTime }}
                            </div>
                            <div v-if="screenWidth <= 1300" style="margin-left: 6px; border-left: 1px solid #e9e9e9; padding-left: 6px">
                              {{ item.businessId ? "发布时间：" : "上传时间：" }}{{ item.createTime }}
                            </div>

                            <div
                              @click="deleteReport(item)"
                              v-if="(userInfo.userNumber == woInfo.executePersonNumber && woInfo.workOrderStatus == '1') || (userInfo.userNumber == item.createUser && woInfo.workOrderStatus == '1')"
                              style="color: #dd0000; padding-left: 6px; border-left: 1px solid #e9e9e9; margin-left: 6px; cursor: pointer"
                            >
                              删除
                            </div>
                          </div>
                        </div>
                        <div>
                          <img src="../../assets/download-icon.png" alt="" @click="downLoadService(item)" style="width: 32px; height: 32px" />
                        </div>
                      </div>
                    </div>
                    <!-- 服务报告超过1条 -->
                    <div v-if="serviceData && serviceData.length > 1" style="margin-top: 20px">
                      <el-row class="service-report">
                        <el-col :span="12" v-for="(item, index) in serviceData" :key="index">
                          <div class="wrap-big" style="width: calc(100% - 40px)">
                            <div class="flex-center" style="font-family: MicrosoftYaHei; font-size: 13px; color: #333; width: calc(100% - 40px)">
                              <img v-if="item.fileType == 'docx' || item.fileType == 'doc'" src="../../assets/word.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                              <img v-else-if="item.fileType == 'pdf'" src="../../assets/pdf.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                              <img v-else-if="item.fileType == 'ppt' || item.fileType == 'pptx'" src="../../assets/pptx.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                              <img
                                v-else-if="item.fileType == 'excel' || item.fileType == 'xlsx' || item.fileType == 'xls'"
                                src="../../assets/excel.png"
                                alt=""
                                style="width: 32px; height: 32px; margin-right: 12px"
                              />
                              <img v-else src="../../assets/unknow-icon.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                              <div style="font-family: MicrosoftYaHei; max-width: 80%">
                                <el-tooltip class="item" effect="dark" :content="item.attachmentFileName" placement="top-start">
                                  <div
                                    @click="perdivFile(item)"
                                    style="
                                      cursor: pointer;
                                      text-decoration: underline;
                                      font-weight: bold;
                                      line-height: 16px;
                                      font-size: 13px;
                                      color: #333;
                                      overflow: hidden;
                                      text-overflow: ellipsis;
                                      white-space: nowrap;
                                      max-width: 100%;
                                    "
                                  >
                                    {{ item.attachmentFileName }}
                                  </div>
                                </el-tooltip>
                                <div class="flex-center" style="line-height: 12px; font-size: 12px; color: #999; margin-top: 12px">
                                  <div v-if="item.businessId" style="margin-right: 6px; border-right: 1px solid #e9e9e9; padding-right: 6px">
                                    <el-popover class="el-popover-detail" placement="bottom" width="272" trigger="click">
                                      <div style="line-height: 30px; font-size: 13px; padding-left: 10px">
                                        <div style="color: #333">
                                          设备名称：<span style="color: #999">{{ item.deviceName }}</span>
                                        </div>
                                        <div style="color: #333">
                                          行业：<span style="color: #999">{{ item.industryFullName }}</span>
                                        </div>
                                        <div style="color: #333">
                                          设备类型：<span style="color: #999">{{ item.deviceTypeFullName }}</span>
                                        </div>
                                        <div style="color: #333">
                                          润滑点设备类型：<span style="color: #999">{{ item.lubricationPointType }}</span>
                                        </div>
                                      </div>
                                      <el-button slot="reference" class="copy_text" type="text" style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px; font-size: 12px"
                                        >润滑点：{{ item.lubricationPointType }} <span v-if="item.lubricationPointName">- {{ item.lubricationPointName }}</span></el-button
                                      >
                                    </el-popover>
                                  </div>
                                  <div style="min-width: 48px">{{ item.businessId ? "制作人：" : "上传人：" }}</div>
                                  <div>
                                    <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="popover + item.id" trigger="click">
                                      <div>
                                        <div style="display: flex">
                                          <img :src="uploadDetail.headUrl ? uploadDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                                          <div style="flex: 1; margin-left: 10px">
                                            <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ uploadDetail.userName }}</div>
                                            <div style="color: rgb(0, 0, 0, 0.5); line-height: 12px; margin-top: 8px; font-size: 12px">{{ uploadDetail.roleNames || "暂无" }}</div>
                                          </div>
                                        </div>
                                        <div
                                          style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center"
                                        >
                                          <span style="color: #666; margin-right: 8px">Tel: </span>
                                          <span>{{ uploadDetail.phonenumber }}</span>
                                          <el-button
                                            class="copy_tel"
                                            style="padding: 0px"
                                            type="text"
                                            v-clipboard:copy="uploadDetail.phonenumber"
                                            v-clipboard:success="onCopyTel"
                                            v-clipboard:error="onErrorTel"
                                          >
                                            <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                                          </el-button>
                                        </div>
                                        <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-bottom: 4px; display: flex; align-items: center">
                                          <span style="color: #666; margin-right: 8px">Mail: </span>
                                          <span>{{ uploadDetail.email }}</span>
                                          <el-button
                                            class="copy_mail"
                                            type="text"
                                            v-clipboard:copy="uploadDetail.email"
                                            v-clipboard:success="onCopyMail"
                                            v-clipboard:error="onErrorMail"
                                            style="padding: 0px"
                                          >
                                            <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                                          </el-button>
                                        </div>
                                      </div>
                                      <el-button
                                        slot="reference"
                                        class="copy_text"
                                        type="text"
                                        @click="executePersonDetail(item)"
                                        style="
                                          font-size: 12px;
                                          color: #001450;
                                          font-family: MicrosoftYaHei;
                                          cursor: pointer;
                                          padding: 0px;
                                          overflow: hidden;
                                          text-overflow: ellipsis;
                                          white-space: nowrap;
                                          max-width: 90px;
                                          text-align: left;
                                          display: inline-block;
                                        "
                                      >
                                        {{ item.createUserName }}
                                      </el-button>
                                    </el-popover>
                                  </div>

                                  <div v-if="screenWidth > 1500" style="margin-left: 6px; border-left: 1px solid #e9e9e9; padding-left: 6px">
                                    {{ item.businessId ? "发布时间：" : "上传时间：" }}{{ item.createTime }}
                                  </div>
                                  <div v-if="screenWidth <= 1500" style="margin-left: 6px; border-left: 1px solid #e9e9e9; padding-left: 6px">
                                    <div style="min-width: 70px">{{ item.businessId ? "发布时间:" : "上传时间：" }}</div>
                                    <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; width: 80px">{{ item.createTime }}</div>
                                  </div>
                                  <div
                                    v-if="
                                      (userInfo.userNumber == woInfo.executePersonNumber && woInfo.workOrderStatus == '1') || (userInfo.userNumber == item.createUser && woInfo.workOrderStatus == '1')
                                    "
                                    @click="deleteReport(item)"
                                    style="color: #dd0000; padding-left: 4px; border-left: 1px solid #e9e9e9; margin-left: 4px; cursor: pointer"
                                  >
                                    删除
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <img src="../../assets/download-icon.png" alt="" @click="downLoadService(item)" style="width: 32px; height: 32px" />
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                      <el-pagination
                        v-if="serviceData.length > 10"
                        layout="prev, pager, next"
                        :page-size="100"
                        @current-change="handleCurrentChangeService"
                        style="float: right; display: flex; margin-top: 10px; position: absolute; bottom: 20px"
                        :current-page.sync="pagenationService.current"
                        :total="totalNumber"
                      >
                      </el-pagination>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 报告列表 -->
              <!-- <div
                v-if="
                  ((woInfo.coreDataStatus == 1 && woInfo.coreDataTemplateId && isCoreInfoFlag) ||
                    (!woInfo.coreDataStatus && !woInfo.coreDataTemplateId) ||
                    (woInfo.executeUserId == $userInfo.userId && !isCoreInfoFlag)) &&
                    woInfo.reportType
                "
                style="width: 100%; background: #fff; margin-top: 20px; position: relative;"
              >
                <div class="service-wrap" :style="{ paddingBottom: serviceData.length > 10 ? '40px' : '20px' }">
                  <div style="display: flex; width: 100%; justify-content: space-between; align-items: center">
                    <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; border-left: 3px solid #dd0000; padding-left: 10px">
                      报告列表
                    </div>
                  </div>
                  <div v-if="reportList && reportList.length > 0">
                    <div v-for="(item, index) in reportList" :key="index" style="border: 1px solid #e9e9e9; font-family: MicrosoftYaHei; padding: 20px; border-radius: 4px; margin-top: 20px">
                      <div class="flex-center" style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                        <div style="width: 80%;">
                          <div
                            @click="perdivFile(item)"
                            style="
                              cursor: pointer;
                              text-decoration: underline;
                              font-weight: bold;
                              font-size: 13px;
                              color: #333;
                              overflow: hidden;
                              text-overflow: ellipsis;
                              white-space: nowrap;
                              max-width: 90%;
                            "
                          >
                            {{ item.draftName }}
                          </div>
                          <div style="display:flex;align-items: center;margin-top:16px;">
                            <div class="tag" v-if="item.publishStatus == 0 && item.pdfCreateFlag != 2 && item.pdfCreateFlag != 3" style="background: #dd0000;">未发布</div>
                            <div class="tag" v-if="item.publishStatus == 1 && item.pdfCreateFlag != 2 && item.pdfCreateFlag != 3" style="background: #008888;">已发布</div>
                            <div style="font-weight:400;font-size: 26rpx;line-height: 26rpx;color:#999;margin-left:10px;">完善率：{{ item.perfectRate }}%</div>
                          </div>
                          <div style="margin-top:16px;color: #999;display: flex;align-items: center;" v-if="item.publishStatus == 1 && item.pdfCreateFlag != 2 && item.pdfCreateFlag != 3">
                            发布人：{{ item.createUserName }}
                            <div style="margin-left: 6px; border-left: 1px solid #e9e9e9; padding-left: 6px">发布时间：{{ item.createTime }}</div>
                          </div>
                        </div>
                        <div style="flex: 1;text-align: right;">
                          <el-button
                            type="danger"
                            v-if="woInfo.executeUserId == $userInfo.userId"
                            v-auth="{
                              menuCodes: 'PC_WorkOrder_editdraft',
                              strategySource: {
                                personal: $userInfo.userId
                              }
                            }"
                            size="small"
                            @click="handleEdit(item)"
                          >
                            编辑
                          </el-button>
                          <el-button v-if="item.draftPath && item.pdfCreateFlag == '1'" @click="handlePreview(item)" size="small" style="color:#001450">预览</el-button>
                          <el-button v-if="item.publishStatus == 1 && item.pdfCreateFlag != 2 && item.pdfCreateFlag != 3" @click="handleDown(item)" size="small" style="color:#001450">下载</el-button>
                          <el-button v-if="item.pdfCreateFlag == '2'" disabled size="small" style="color:#b3b3b3;">报告生成中···</el-button>
                          <el-button v-if="item.pdfCreateFlag == '3'" disabled size="small" style="color:#b3b3b3;">报告生成失败，请重试</el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </el-form>
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
            <el-input type="textarea" placeholder="请输入" v-model="ruleForm.text" maxlength="300" rows="2" resize="none" show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style="margin-top: 20px">
          <el-button type="danger" plain @click="resetCloseWorkorder('ruleForm')" size="small">取消</el-button>
          <el-button type="danger" @click="submitCloseWorkorder('ruleForm')" size="small">提交</el-button>
        </div>
      </el-dialog>
      <!-- 添加润滑点弹框 -->
      <el-dialog title="添加润滑点" :visible.sync="addLubricationPointsVisiable" :append-to-body="true" width="60%" class="create-task">
        <div style="display: flex; align-items: center; margin-bottom: 10px">
          <span>关键词搜索：</span>
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
          <span style="margin-left: 10px">设备分组：</span>
          <el-cascader
            :options="deviceGroupList"
            size="small"
            style="width: 30%"
            :props="{ label: 'groupName', value: 'id' }"
            v-model="queryParams.selectGroupId"
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
            ref="tableAddLumData"
            v-loading="loadingLum"
            v-el-table-infinite-scroll="load"
            class="add-lum"
            :row-key="rowKey"
            @select="handleSelectLum"
            @select-all="selectAll"
          >
            <el-table-column type="selection" :selectable="checkedSelectLum" :reserve-selection="true" width="55"> </el-table-column>
            <el-table-column prop="serviceimg" min-width="20%" label="润滑点">
              <template width="90" slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <img style="width: 64px; height: 64px; border: none; margin-right: 12px" :src="scope.row.lubricationPointPicPathFull ? scope.row.lubricationPointPicPathFull : defaultIcon" />
                  <span
                    >{{ scope.row.lubricationPointType }} <span v-if="scope.row.lubricationPointName"> - {{ scope.row.lubricationPointName }}</span></span
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="deviceName" min-width="18%" label="设备名称"> </el-table-column>
            <el-table-column prop="oilName" min-width="10%" label="润滑油">
              <template slot-scope="scope">
                {{ scope.row.oilName || "暂无" }}
              </template>
            </el-table-column>
            <el-table-column prop="lastOilChangeTime" min-width="15%" label="上次任务日期">
              <template slot-scope="scope">
                {{ scope.row.lastOilChangeTime || "暂无" }}
              </template>
            </el-table-column>
            <p v-if="this.lubrtotalCount > this.lumDataCustomers.length">加载中...</p>
            <p v-else>没有更多了</p>
          </el-table>
        </div>
        <div slot="footer">
          <el-button type="danger" plain @click="handleResetAddLum('ruleForm')" size="small">取消</el-button>
          <el-button type="danger" @click="handleSubmitAddLum()" size="small">添加</el-button>
        </div>
      </el-dialog>
      <!-- 工作组添加人员弹框 -->
      <el-dialog title="添加成员" :visible.sync="addWorkGroupsVisiable" width="40%" class="create-task">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
          <div style="font-family: MicrosoftYaHei-Bold; font-size: 16px; line-height: 14px; color: #000; display: flex; flex-wrap: nowrap; align-items: center">
            <span style="width: 8px; height: 8px; display: inline-block; border-radius: 50%; background: #dd0000; margin-right: 12px"></span>
            <div v-html="initTemplateContent(woInfo)" style="display: flex" @click="clickRoleType"></div>
          </div>
          <el-input
            size="small"
            v-model="queryParams.taskName"
            placeholder="请输入关键词"
            suffix-icon="el-icon-search"
            style="width: 30%"
            maxlength="50"
            @change="handleSearchTableGroups"
            clearable
          ></el-input>
        </div>
        <div>
          <el-table
            ref="multipleTable"
            :data="engineerInfoList"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            v-el-table-infinite-scroll="() => getPersonList('more')"
            v-loading="loadingPersonGroup"
          >
            <el-table-column type="selection" :selectable="selectable" width="55"> </el-table-column>
            <el-table-column prop="userName" min-width="20%" label="姓名"> </el-table-column>
            <el-table-column prop="roleName" min-width="18%" label="角色">
              <template width="90" slot-scope="scope">
                <div v-for="(item, index) in scope.row.roleDtoList" :key="index">{{ item.roleName }}</div>
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
          <el-button type="danger" plain @click="handleResetAdd()" size="small">取消</el-button>
          <el-button type="danger" @click="submitAddWorkGroups()" size="small">添加</el-button>
        </div>
      </el-dialog>
      <!-- 编辑工单 -->
      <el-dialog title="编辑工单" :visible.sync="editWorkorderVisisble" width="30%" class="edit-workOrder" :close-on-click-modal="false" :close-on-press-escape="false">
        <div style="padding: 20px 0">
          <div style="padding: 20px; background: #f9f9f9; border: 1px solid #e9e9e9; font-family: MicrosoftYaHei">
            <div style="display: flex; align-items: center; margin-bottom: 16px">
              <span style="width: 90px; font-size: 13px; line-height: 13px; color: #999">工单编号</span>
              <span style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.workOrderNumber }}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 16px">
              <span style="width: 90px; font-size: 13px; line-height: 13px; color: #999">工单类型</span>
              <span style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.serviceName }}</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 16px">
              <span style="width: 90px; font-size: 13px; line-height: 13px; color: #999">客户名称</span>
              <span style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.contactCompanyName }}</span>
            </div>
            <!-- <div style="display: flex; align-items: center; margin-bottom: 16px">
              <span style="width: 90px; font-size: 13px; line-height: 13px; color: #999">所属车间</span>
              <span style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.workshopName }}</span>
            </div> -->
            <!-- <div style="display: flex; align-items: center">
              <span style="width: 90px; font-size: 13px; line-height: 13px; color: #999">客户联系人</span>
              <span style="font-size: 14px; line-height: 14px; color: #666; flex: 1">{{ woInfo.contactName }}</span>
            </div> -->
          </div>
          <div>
            <el-form :model="ruleForm1" :rules="ruleForm1rules" ref="ruleForm1" label-width="100px" label-position="top">
              <!-- 更新删除预约日期、服务地址、服务创赢属性 -->
              <el-form-item prop="shortDesc" style="margin-top: 14px" label="服务简述">
                <el-input type="textarea" placeholder="请填写服务简述" v-model="ruleForm1.shortDesc" maxlength="25" rows="2" show-word-limit></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div slot="footer">
          <el-button type="danger" plain @click="handleResetEdit('ruleForm1')" size="small">取消</el-button>
          <el-button type="danger" @click="handleSubmitEdit('ruleForm1')" size="small">保存</el-button>
        </div>
      </el-dialog>
      <!-- 完结工单 -->
      <el-dialog class="closeWorkOrder" :visible.sync="finishWorkorder" :show-close="false" width="30%">
        <div style="display: flex; font-family: MicrosoftYaHei; line-height: 18px; font-size: 18px; color: #000; margin: 0px; align-items: center">
          <img src="../../assets/notice-icon.png" alt="" style="width: 18px; height: 18px; margin-right: 10px" />是否完结工单？
        </div>
        <div class="notice-title">工单完结后将无法进行任何操作</div>
        <div slot="footer">
          <el-button type="danger" plain @click="cancelFinishOrder()" size="small">取消</el-button>
          <el-button type="danger" @click="sureFinishOrder()" size="small">完结</el-button>
        </div>
      </el-dialog>
      <el-dialog title="提示" class="newDiaolg" :visible.sync="finishAllWorkorder" :show-close="true" width="30%">
        <div style="font-size: 14px; color: #666">完成该工单后可同步完成服务申请，是否同步完成？</div>
        <div slot="footer" style="display: flex; justify-content: space-between">
          <el-button type="danger" plain @click="cancelFinishAllOrder()" size="small">取消</el-button>
          <div>
            <el-button plain type="danger" @click="sureFinishApply()" size="small">同步完成服务申请</el-button>
            <el-button type="danger" @click="onlyFinishWorkOrder()" size="small">仅完成工单</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="补全申请单信息" class="newDiaolg" :visible.sync="applyMsgDialog" :show-close="true" width="30%">
        <div style="font-size: 14px; color: #666; margin-top: 20px">
          <i class="el-icon-warning" style="color: rgb(255, 153, 0); font-size: 15px; margin-right: 4px"></i>申请单必填信息缺失，工单可完成，请编辑申请单并补全信息后，重新尝试完结申请单
        </div>
        <div slot="footer">
          <el-button plain @click="cancelFinishApplyDialog()" size="small">取消</el-button>
          <el-button type="danger" plain @click="GoToReplenish()" size="small">前往补全</el-button>
        </div>
      </el-dialog>
      <!-- 分配弹框 -->
      <el-dialog title="分配工单" ref="executePersonDialog" :visible.sync="executePersonNameVisiable" width="40%" class="create-task radio-table">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
          <div style="font-family: MicrosoftYaHei-Bold; font-size: 16px; line-height: 14px; color: #000; display: flex; flex-wrap: nowrap; align-items: center">
            <span style="width: 8px; height: 8px; display: inline-block; border-radius: 50%; background: #dd0000; margin-right: 12px"></span>
            <div v-html="initTemplateContent(woInfo)" style="display: flex" @click="clickRoleType"></div>
          </div>
          <el-input size="small" v-model="userOrRoleName" placeholder="请输入关键词" suffix-icon="el-icon-search" style="width: 30%" maxlength="50" @change="searchRoleTableData" clearable></el-input>
        </div>
        <div>
          <el-table
            ref="multipleTableAdd"
            :data="engineerInfoList"
            v-loading="loadingPerson"
            v-el-table-infinite-scroll="loadMore"
            tooltip-effect="dark"
            :row-key="getRowKey"
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
          <el-button type="danger" plain @click="handleReset()" size="small">取消</el-button>
          <el-button type="danger" @click="submitDistribution()" size="small">分配</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 选择润滑点 -->
    <div v-if="woInfo.companyId">
      <LupDialogNew
        :key="chooseLupDialogKey"
        :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
        :singleFlag="false"
        :checkedDevice="checkedDevice"
        :urlType="urlType"
        :coreDataTemplateId="woInfo.coreDataTemplateId"
        :taskType="taskType"
        :companyName="woInfo.contactCompanyName"
        :companyId="woInfo.companyId"
        :companyNumber="woInfo.contactCompanyNumber"
        :serviceNumber="woInfo.serviceNumber"
        :workshopId="woInfo.workshopId"
        :plantStudyServiceFlag="plantStudyServiceFlag"
        :reportType="woInfo.reportType"
        :spId="woInfo.distributorCompanyId"
        v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
        v-on:confirmChooseLup="confirmChooseLup"
      ></LupDialogNew>
    </div>
    <WorkerOrderPromote
      v-if="promote_dialogVisible"
      :promoteDialogVisible="promote_dialogVisible"
      @promoteCloseDialog="promote_closeDialog"
      :workOrderNumber="woInfo.workOrderNumber"
      :callback="() => this.$_getWOInfo(this.$route.query.workOrderNumber)"
      :workerOrderMslaFlag="woInfo.isMslaFlag"
    />
    <BatchUpload ref="batchUpload" @getOilChangeReportCount="getOilChangeReportCount"></BatchUpload>
  </div>
</template>
<script>
import LupDialogNew from "../spotInspection/components/chooseLubricationPointWorkorder.vue";
import elTableInfiniteScroll from "el-table-infinite-scroll";
import Promote from "../newWorkerOrderAndServiceApplyPromote/workerOrder_promote.js";
import general from "./mixins/generalDetail.js";
import CustomeReportMixin from "./mixins/customeForm.js";
import DAModify from "./mixins/DAModify.js";
import editIndex from "./components/editIndex.vue";
import serviceReportForView from "./components/serviceReportForView.vue";
import BatchUpload from "@/components/batchUpload/index";
import BatchUploadJS from "@/components/batchUpload/batchUpload";
export default {
  mixins: [Promote, DAModify, general, BatchUploadJS, CustomeReportMixin],
  components: {
    LupDialogNew,
    editIndex,
    serviceReportForView,
    WorkerOrderPromote: () => import("../newWorkerOrderAndServiceApplyPromote/workerOrder_promote.vue"),
    BatchUpload,
  },
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll,
  },

  data() {
    return {
      reportList: [],
      uploadUrl: `${process.env.api}/weChat/workOrder/service/report/upload`,
      mainminheight: `height:${document.documentElement.clientHeight - 136}px`,
      mainminFormheight: `height:${document.documentElement.clientHeight - 236}px`,
      mainminProcessheight: `height:${document.documentElement.clientHeight - 276}px`,
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
      img2: require("../../assets/checked.png"),
      src1: require("../../assets/xingxing_1.png"),
      src2: require("../../assets/xingxing.png"),
      headImg: require("../../assets/headImg.png"),
      defaultIcon: require("../../assets/device_default.png"),
    };
  },
  computed: {
    is_hasNum() {
      let idx = this.woInfo.authorityDistributorNum.indexOf(this.userInfo.companyNumber);
      return idx != -1;
    },
  },
  mounted() {},
  methods: {
    // 提报优秀案例
    createCase() {
      // 查询当月案例
      this.requestMethodGet("/emEcReport/queryNowMonthBySpId", { spId: this.woInfo.distributorCompanyId }).then((res) => {
        if (res.data.code == 1000) {
          if (res.data.data < 5) {
            this.$confirm("确认提报该工单为优秀案例？", "提示", {
              confirmButtonText: "确认提报",
              cancelButtonText: "暂时不提报",
            })
              .then(() => {
                const fromPageType = "workOrder";
                if (this.woInfo.reportId) {
                  this.$router.push({
                    path: "/distributorCaseIndex/Create",
                    query: {
                      caseId: this.woInfo.reportId,
                      createType: "edit",
                      fromPageType: fromPageType,
                    },
                  });
                } else {
                  this.$router.push({
                    path: "/distributorCaseIndex/Create",
                    query: {
                      distributorCompanyId: this.woInfo.distributorCompanyId,
                      distributorCompanyName: this.woInfo.distributorCompanyName,
                      customerName: this.woInfo.contactCompanyName,
                      customerCompanyNumber: this.woInfo.contactCompanyNumber,
                      companyId: this.woInfo.companyId,
                      createUserName: this.userInfo.userName,
                      createUserId: this.userInfo.userId,
                      createUserNumber: this.userInfo.userNumber,
                      serviceOrderId: this.woInfo.id,
                      fromPageType: fromPageType,
                      createType: "add",
                    },
                  });
                }
              })
              .catch(() => {});
          } else {
            this.$confirm("每月最多提报5个案例，当前月份的额度已用完，请下月再提报。", "提示", {
              confirmButtonText: "知道了",
              showCancelButton: false,
              confirmButtonClass: "case-confirm",
            })
              .then(() => {})
              .catch(() => {});
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
      });
    },
    revocationCase() {
      this.$confirm("确认撤回该工单的优秀案例？", "提示", {
        confirmButtonText: "确认撤回",
        cancelButtonText: "取消",
      })
        .then(() => {
          // 执行撤回操作
          const params = {
            id: this.woInfo.reportId,
            reportStatus: 2,
          };
          this.requestMethodPost("/emEcReport/updateStatus", params).then((res) => {
            if (res.data.code == 1000) {
              this.$_getWOInfo(this.$route.query.workOrderNumber);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });
        })
        .catch(() => {});
    },
    viewDetail() {
      this.$router.push({
        path: "/distributorCaseIndex/caseDetail",
        query: {
          caseId: this.woInfo.reportId,
          type: "distributor",
        },
      });
    },
    // 获取工单列表
    $_getReportList() {
      this.loading = true;
      let params = {
        workOrderNumber: this.$route.query.workOrderNumber,
        current: 1,
        size: 100,
      };
      this.requestMethodGet("/serviceReport/draftListByPage", params)
        .then((res) => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.reportList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        })
        .catch((res) => {});
    },
    // 预览
    async handlePreview(item) {
      // window.open(item.draftPath);
      const res = await this.requestMethodGetTip("/web/file/getFullUrl", {
        url:item.path
      });
      if(res.data.code == 1000){
        window.open(res.data.data);
      }
    },
    async handlePreviewCustomeReport(item){
      if(!item.path){
        return this.$message({
          message: "报告生成中，请稍后再试",
          type: "warning",
        });
      }
      const res = await this.requestMethodGetTip("/web/file/getFullUrl", {
        url:item.path
      });
      if(res.data.code == 1000){
        window.open(res.data.data, "_blank");
      }
    },
    // 预览
    handleDown(item) {
      window.open(item.draftPath);
    },
    // 编辑
    handleEdit(item) {
      if (this.customeConfigDataList && this.customeConfigDataList.length) {
        return this.customeReportFormEdit(item);
      }
      let workshopId = this.woInfo.workshopId;
      let companyNumber = this.woInfo.companyNumber;
      let companyId = this.woInfo.companyId;
      let contactCompanyName = this.woInfo.contactCompanyName;
      let path = "";
      if (
        item.reportType == 1 ||
        item.reportType == 2 ||
        item.reportType == 3 ||
        item.reportType == 4 ||
        item.reportType == 5 ||
        item.reportType == 6 ||
        item.reportType == 7 ||
        item.reportType == 8 ||
        item.reportType == 9 ||
        item.reportType == 10 ||
        item.reportType == 11 ||
        item.reportType == 12 ||
        item.reportType == 13 ||
        item.reportType == 14 ||
        item.reportType == 15 ||
        item.reportType == 16 ||
        item.reportType == 17 ||
        item.reportType == 18 ||
        item.reportType == 19 ||
        item.reportType == 20 ||
        item.reportType == 21 ||
        item.reportType == 22 ||
        item.reportType == 23 ||
        item.reportType == 24 ||
        item.reportType == 34
      ) {
        path = "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/reportCommon";
      } else {
        path = "/NewWorkOrderList/newWorkOrderDetail/DraftReportList/EditReport";
      }
      this.$router
        .push({
          path: path,
          query: {
            workOrderNumber: item.workOrderNumber,
            type: "edit",
            draftId: item.id,
            serviceApplyOrderId: this.woInfo.serviceApplyOrderId,
            coreDataTemplateId: this.woInfo.coreDataTemplateId,
            coreDataStatus: this.woInfo.coreDataStatus,
            workshopId: workshopId,
            companyNumber: companyNumber,
            companyId: companyId,
            contactCompanyName: contactCompanyName,
            perfectRate: item.perfectRate,
            publishStatus: item.publishStatus,
          },
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.case-cancel {
  color: #dd0000 !important;
  background-color: #fcf2f1 !important;
  border-color: #f56c6c !important;
}
.case-confirm {
  background: #dd0000 !important;
  color: #fff !important;
  border-color: #f56c6c !important;
}
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
  padding: 10px 0;
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
  /deep/.el-form-item {
    margin-bottom: 0px;
  }
  /deep/ .newDiaolg {
    .el-dialog__header .el-dialog__title {
      color: #000;
      font-weight: 400;
      font-size: 18px;
    }
    .el-dialog__body {
      padding: 0px 20px 10px;
    }
  }
  /deep/.closeWorkOrder {
    .el-dialog__header {
      padding: 0px;
    }
  }
  /deep/ .el-upload {
    border: none;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  .service-wrap {
    padding: 20px 20px 0px;
  }
  .icon-copy {
    width: 16px;
    height: 16px;
    position: relative;
    top: 3px;
    cursor: pointer;
    margin-left: 18px;
  }
  .wrap-big {
    border: 1px solid #e9e9e9;
    font-family: MicrosoftYaHei;
    padding: 20px;
    border-radius: 4px;
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .wrap-two {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .el-dialog__title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    line-height: 16px;
  }
  .el-form-item__label {
    line-height: 14px;
    margin-top: 16px;
  }
  .el-form-item__content {
    margin-top: 10px;
    line-height: 14px !important;
  }
  /deep/ .el-textarea__inner {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #606266;
  }
  /deep/ .popoverWorkGroup {
    .el-button:focus,
    .el-button:hover {
      background: #fff;
      border-color: none;
    }
  }
  /deep/.remark {
    .el-form-item__content {
      margin-top: 0px;
    }
  }
  /deep/ .service-report {
    .el-col-12:nth-child(odd) {
      padding-right: 10px;
    }
    .el-col-12:nth-child(even) {
      padding-left: 10px;
    }
  }

  .el-icon-delete-solid {
    color: #999;
  }
  /deep/ .el-icon-delete-solid:hover {
    color: #dd0000;
  }
  /deep/ .process {
    .el-progress-bar__outer {
      background: rgba(211, 0, 0, 0.1);
    }
  }
  .userName-big {
    color: #001450;
    font-family: MicrosoftYaHei;
    cursor: pointer;
    padding: 0px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    min-width: 90px;
  }
  .header-no-wrap {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 90%;
    display: inline-block;
  }
  .userName-small {
    color: #001450;
    font-family: MicrosoftYaHei;
    cursor: pointer;
    padding: 0px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    min-width: 100px;
  }
  .wrap-group {
    padding-left: 7px;
  }
  .base-title {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
  }
  .add-lum {
    height: 100% !important;
    overflow-y: auto;
  }
  .process-wrap1 {
    width: 320px;
    background: #fff;
    border-radius: 8px;
  }
  .progress-box {
    padding-top: 20px;
    font-size: 12px;
    overflow: auto;
  }
  .white-divider {
    background-color: #fff;
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
  .right-wrap {
    -webkit-box-flex: 1;
    margin-left: 20px;
    overflow-y: auto;
  }
  /deep/ .process1 {
    .el-progress-bar__outer {
      background: rgba(0, 136, 136, 0.15);
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

  /deep/.el-table .el-table__header-wrapper thead {
    font-size: 13px;
    color: #999;
    font-family: MicrosoftYaHei;
  }
  /deep/.el-table td {
    height: 72px;
  }
  .star {
    width: 20px;
    height: 20px;
    margin-right: 2px;
  }
  /deep/.el-textarea__inner {
    height: 100px;
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
.flex-center {
  display: flex;
  align-items: center;
}
.tag {
  font-family: PingFang-SC-Regular;
  font-size: 12px;
  color: #fff;
  padding: 4px 6px;
  display: inline-block;
  border-radius: 4px;
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
  .flex-center {
    display: flex;
    align-items: center;
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
  .weui-cell-line div {
    padding-bottom: 5px;
  }
  .weui-cell-circle-new {
    position: absolute;
    top: 0;
    left: -9px;
  }
}
</style>
<style>
.customerStyle {
  display: flex;
  padding: 0 20px;
}
.no-wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.upload-demo {
  display: inline-block !important;
  height: 36px !important;
  line-height: 34px !important;
  position: relative !important;
  margin-left: 6px !important;
  margin-right: 6px !important;
}
.return-btn .el-upload {
  border: none !important;
  height: 36px !important;
  line-height: 34px !important;
}
.notice-wrap {
  display: flex;
  font-size: 13px;
  font-family: MicrosoftYaHei;
  justify-content: space-between;
  margin: 20px 0;
  height: 40px;
  line-height: 40px;
  background: #e6edff;
  border-radius: 4px;
  padding: 0 20px;
}
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
.footer {
  padding: 20px 0;
}
.work-order-detail .el-timeline {
  padding: 20px 0 0;
}
.weui-cell-list:first-of-type {
  color: #000;
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
.case-title {
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
