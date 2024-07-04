<template>
  <div class="work-order-detail" style="position: relative; background: #f2f3f6">
    <!-- 工单审批流提升 -->
    <el-button size="small" v-if="promote_btnDisplay" type="danger" style="position:absolute;right:20px;top:-39px" @click="promote_revertClick">{{
      promote_revertBtnName
    }}</el-button>

    <!-- 待确认状态  进行中-->
    <div
      v-if="(woInfo.workOrderStatus == '0' || woInfo.workOrderStatus == '1' || woInfo.workOrderStatus == '2')"
      class="return-btn"
      style="position: absolute; right: 20px; height: 55px; line-height: 55px; top: -55px; color: red; cursor: pointer"
    >
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
      <!-- 需求变更36340 -->
      <!-- 美孚经销商取消 -->
      <el-button 
        type="danger" 
        @click="handleClose" 
        v-if="(woInfo.workOrderStatus<2 && mslaWorkOrderReportRel.msdpSampleStatus==2) && 
        (
          ($userInfo.userType == 0 && (woInfo.daFlag || (!woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
          ($userInfo.userType == 1 && (!woInfo.daFlag || (woInfo.daFlag && $userInfo.userId == woInfo.executeUserId)))
        )" 
        plain
        v-has="EMSP_service_order_list_cancel_btn"
        size="small">
        取消注册
      </el-button>
      <!-- 客户取消 -->
      <el-button 
        type="danger" 
        v-if="woInfo.workOrderStatus==0 && mslaWorkOrderReportRel.msdpSampleStatus==2 && $userInfo.userType == 2 && woInfo.contactCompanyNumber == $userInfo.companyNumber" 
        plain 
        size="small" 
        @click="handleClose" 
        v-has="service_order_list_cancel_btn">
        取消注册
      </el-button>
      <el-button 
        type="danger" 
        size="small" 
        v-if="woInfo.workOrderStatus == '1' && (($userInfo.userType == 0 && (woInfo.daFlag || (!woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))) ||
          ($userInfo.userType == 1 && (!woInfo.daFlag || (woInfo.daFlag && $userInfo.userId == woInfo.executeUserId))))"
        @click="handleDistributive('first')" 
        v-has="PC_WorkOrder_reassign">
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
            <el-link :underline="false" style="color:#dd0000"  v-if="woInfo.isGood && revocationCaseType==2" @click="viewDetail" v-has="Workorder_ExcellentcaseSu" >提交详情</el-link>
          </div>
          <div style="font-family: MicrosoftYaHei; font-size: 12px; margin-top: 16px">
            <el-row :gutter="20">
              <el-col :span="4" style="margin-left: 0px">
                <el-form-item label="工单编号">
                  <span style="font-size: 13px; font-family: ArialMt">{{ woInfo.workOrderNumber || "暂无" }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" style="margin-left: 0px">
                <el-form-item label="经销商">
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
          <div style="display: -webkit-box; margin-top: 20px">
            <div class="process-wrap1" :style="mainminFormheight">
              <div class="process-wrap">
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
                  }}
                    <el-tooltip :content="woInfo.executePersonHonoraryMedal=='3' ? '服务大师' :  woInfo.executePersonHonoraryMedal=='2' ? '服务达人' : woInfo.executePersonHonoraryMedal=='1' ?  '服务先锋' :''" placement="top">
                      <img v-if="woInfo.executePersonHonoraryMedal=='3'" src="../../assets/small_service_great_person.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top:4px;">
                      <img v-if="woInfo.executePersonHonoraryMedal=='2'" src="../../assets/small_service_master.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top:4px;">
                      <img v-if="woInfo.executePersonHonoraryMedal=='1'" src="../../assets/small_service_pioneer.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top:4px;">
                    </el-tooltip>
                    
                  </el-button>
                </el-popover>
              </div>
              <div style="font-size: 13px; color: #999; font-family: MicrosoftYaHei; padding: 20px 0;overflow:auto" :style="mainminProcessheight">
                <div style="display: flex; margin-bottom: 16px; padding: 0 20px">
                  <div style="width: 90px">取样日期</div>
                  <div style="flex: 1; color: #333">{{ woInfo.expectComingTime || "暂无" }}</div>
                </div>
                <div :style="{ marginBottom: woInfo.customerPesFlag == '1' ? '10px' : '16px' }" class="customerStyle">
                  <div style="width: 90px">客户名称</div>
                  <div style="flex: 1; color: #333; display: flex">
                    <span class="no-wrap" style="max-width: 158px">{{ woInfo.contactCompanyName || "暂无" }}</span>
                    <img v-if="woInfo.customerPesFlag == '1'" src="../../assets/pes-icon.png" alt="" style="margin-left: 8px; width: 24px; height: 23px" />
                  </div>
                </div>
                <div style="display: flex; margin-bottom: 16px; padding: 0 20px">
                  <div style="width: 90px">服务地址</div>
                  <div style="flex: 1; color: #333">{{ woInfo.contactMapAddress || "暂无" }}</div>
                </div>
                <div style="display: flex; margin-bottom: 16px; padding: 0 20px">
                  <div style="width: 90px">服务简述</div>
                  <div class="no-wrap" style="flex: 1; color: #333">{{ woInfo.shortDesc || "暂无" }}</div>
                </div>
                <div style="padding: 0 20px">
                  <div style="width: 90px">照片</div>
                  <div v-if="pictureDtoList.length > 0">
                    <div style="display: flex; align-items: center; margin-top: 16px">
                      <el-image
                        style="width: 80px; height: 80px; margin-right: 20px"
                        v-for="(item, index) in pictureDtoList"
                        :key="index"
                        :src="item.url"
                        :preview-src-list="[item.url]"
                      >
                      </el-image>
                    </div>
                  </div>
                  <div v-if="pictureDtoList.length == 0" style="margin-top: 10px; color: #333">暂无</div>
                </div>
                <div style="margin: 24px 0; height: 1px; width: 100%; background: #e9e9e9"></div>
                <!-- <div v-if="userInfo.userType<2 && woInfo.valetOrderType != '0'">
                  <div style="font-family: MicrosoftYaHei-Bold;padding: 0 20px 20px; font-size: 20px; color: #000; line-height: 28px; font-weight: bold">
                    服务创盈
                  </div>
                  <div style="display: flex; margin-bottom: 16px; padding: 0 20px">
                    <div style="width: 90px">服务属性</div>
                    <div  style="flex: 1; color: #333">{{woInfo.servicePropertyStr || "暂无" }}</div>
                  </div>
                  <div style="display: flex; margin-bottom: 16px; padding: 0 20px">
                    <div style="width: 90px">预估收益</div>
                    <div style="flex: 1; color: #333">{{woInfo.income || '暂无'}}</div>
                  </div>
                  <div style="margin: 24px 0; height: 1px; width: 100%; background: #e9e9e9"></div>
                </div> -->
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
                        <img style="width: 28px; height: 28px" v-if="item.operationStatus == 4" :src="closeIcon1" />
                        <img style="width: 28px; height: 28px" v-if="item.operationStatus == 5" :src="closeIcon1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right-wrap" :style="mainminFormheight">
              <!-- 油样报告 -->
              <div style="width: 100%; background: #fff" v-if="mslaWorkOrderReportRel">
                <!-- 分析报告生成中 && !woInfo.reportDtoList.length-->
                <div
                  v-if="
                    (woInfo.workOrderStatus == 1 &&
                      mslaWorkOrderReportRel.mslaWorkFlowReportStatus != 5 &&
                      mslaWorkOrderReportRel.mslaWorkFlowReportStatus != 7 &&
                      mslaWorkOrderReportRel.mslaWorkFlowReportStatus != 9) ||
                      (woInfo.workOrderStatus == 1 && !woInfo.serviceDtoList.length)
                  "
                  style="
                    margin-bottom: 20px;
                    height: 40px;
                    line-height: 40px;
                    background: #e6edff;
                    border-radius: 4px;
                    padding-left: 20px;
                    font-size: 13px;
                    font-family: MicrosoftYaHei;
                    display: flex;
                    align-items: center;
                  "
                >
                  <img src="../../assets/ev-icon.png" alt="" style="width: 16px; height: 16px; margin-right: 8px" />
                  <span style="color: #dd0000">分析报告</span>生成中，请耐心等待。
                </div>
                <!-- 待评价 -->
                <div style="padding: 20px; margin-bottom: 20px" v-if="woInfo.workOrderStatus == 2 && userInfo.userNumber === woInfo.contactNumber && woInfo.valetOrderType > 0">
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
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #001450; line-height: 14px; margin-left: 10px">非常满意，超出原本预期</div>
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
                        <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #dd0000; line-height: 14px; margin-left: 10px">请停止寄送油样瓶，若已寄送，请联系承运方截回！</span>
                      </div>
                      <div style="display: flex; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 10px">
                        <span style="color: #999; width: 70px">关闭原因：</span>
                        <div style="flex: 1; color: #666; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
                          {{ woInfo.closeTypeName || mslaWorkOrderReportRel.cancelReasonDesc }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 油样报告 -->
              <div v-if="woInfo.serviceDtoList != undefined" style="width: 100%; background: #fff; position: relative">
                <div style="padding: 20px">
                  <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; border-left: 3px solid #dd0000; padding-left: 10px">油样报告<span style="display:inline-block;padding-left:10px;font-weight:500;color:#001450;cursor:pointer;" @click="refreshMslaReport">刷新</span></div>
                  <!-- 暂无油样报告   待确认、执行中、已关闭-未上传报告  &&-->
                  <div
                    v-if="!woInfo.serviceDtoList.length && (woInfo.workOrderStatus == 0 || woInfo.workOrderStatus == 1 || woInfo.workOrderStatus == 4)"
                    style="font-family: MicrosoftYaHei; height: 126px; line-height: 126px; font-family: MicrosoftYaHei; font-size: 13px; color: #999; text-align: center"
                  >
                    暂无油样报告，请耐心等待
                  </div>
                  <!-- 油样报告有1条  mslaWorkOrderReportRel.mslaWorkFlowReportStatus ==5 ，7，9 报告生成-->
                  <div
                    v-if="
                      woInfo.serviceDtoList &&
                        woInfo.workOrderStatus == 1 &&
                        (mslaWorkOrderReportRel.mslaWorkFlowReportStatus == 5 || mslaWorkOrderReportRel.mslaWorkFlowReportStatus == 7 || mslaWorkOrderReportRel.mslaWorkFlowReportStatus == 9)
                    "
                  >
                    <div v-for="(item, index) in woInfo.serviceDtoList" :key="index" style="border: 1px solid #e9e9e9; font-family: MicrosoftYaHei; border-radius: 4px; margin-top: 14px">
                      <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px">
                        <div style="display: flex; align-items: center; font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                          <img v-if="item.attachmentType == 'docx' || item.attachmentType == 'doc'" src="../../assets/word.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                          <img v-else-if="item.attachmentType == 'pdf'" src="../../assets/pdf.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                          <img v-else-if="item.attachmentType == 'ppt' || item.attachmentType == 'pptx'" src="../../assets/pptx.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                          <img
                            v-else-if="item.attachmentType == 'excel' || item.attachmentType == 'xlsx' || item.attachmentType == 'xls'"
                            src="../../assets/excel.png"
                            alt=""
                            style="width: 32px; height: 32px; margin-right: 12px"
                          />
                          <img v-else src="../../assets/unknow-icon.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                          <div style="font-family: MicrosoftYaHei">
                            <div style="line-height: 13px; font-size: 13px; color: #333">{{ item.attachmentTitle }}</div>
                            <div style="display: flex; align-items: center; line-height: 12px; font-size: 12px; color: #999; margin-top: 12px">
                              <div>
                                报告评级：
                                <span v-if="mslaWorkOrderReportRel.mslaWorkFlowReportResultLevel == 'Caution'" style="color: #ff9900">注意</span>
                                <span v-if="mslaWorkOrderReportRel.mslaWorkFlowReportResultLevel == 'Alert'" style="color: #dd0000">警告</span>
                                <span v-if="mslaWorkOrderReportRel.mslaWorkFlowReportResultLevel == 'Normal'" style="color: #008888">正常</span>
                              </div>
                              <div style="margin-left: 10px; border-left: 1px solid #e9e9e9; padding-left: 10px">生成时间：{{ item.createTime }}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <img @click="downLoadServiceReport(item.attachmentUrl)" src="../../assets/download-icon.png" alt="" style="width: 32px; height: 32px" />
                        </div>
                      </div>
                      <!-- 建议 -->
                      <div
                        style="border-top: 1px solid #e9e9e9; padding-top: 20px; padding: 20px"
                        v-if="
                          woInfo.workOrderStatus == 1 &&
                            woInfo.serviceDtoList.length &&
                            (mslaWorkOrderReportRel.mslaWorkFlowReportStatus == 5 || mslaWorkOrderReportRel.mslaWorkFlowReportStatus == 7 || mslaWorkOrderReportRel.mslaWorkFlowReportStatus == 9)
                        "
                      >
                        <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; display: flex; justify-content: space-between">
                          工程师建议
                          <div
                            v-if="mslaWorkOrderReportRel.workFlowReportRemark && !editAdviceInput && woInfo.executePersonNumber == userInfo.userNumber"
                            style="color: #001450; font-family: MicrosoftYaHei; font-size: 13px; cursor: pointer"
                            v-has="PC_WorkOrder_ReportReview"
                            @click="handleEditAdvice"
                          >
                            编辑
                          </div>
                        </div>
                        <!-- 执行中-已传报告未建议 -->
                        <div v-if="!mslaWorkOrderReportRel.workFlowReportRemark && !editAdviceInput">
                          <div style="font-family: MicrosoftYaHei; line-height: 13px; font-family: MicrosoftYaHei; font-size: 13px; color: #999; text-align: center; margin: 16px auto 20px">
                            暂无工程师建议<span v-if="woInfo.executePersonNumber == userInfo.userNumber">，请填写</span>
                          </div>
                          <div style="text-align: center; margin-bottom: 20px" v-if="woInfo.executePersonNumber == userInfo.userNumber" v-has="PC_WorkOrder_ReportReview">
                            <el-button size="small" type="danger" @click="handleEditAdvice">立即填写</el-button>
                          </div>
                        </div>
                        <!--  执行中   完成- -->
                        <div v-if="mslaWorkOrderReportRel.workFlowReportRemark && !editAdviceInput" style="display: flex">
                          <div style="display: flex; align-items: center; margin-top: 16px">
                            <img :src="woInfo.executePersonHeadUrl ? woInfo.executePersonHeadUrl : headImg" alt="" style="width: 40px; height: 40px; border-radius: 50%" />
                            <div style="margin-left: 16px">
                              <div>
                                <span style="font-family: MicrosoftYaHei; font-size: 14px; color: #001450; line-height: 14px">{{ woInfo.executePersonName || "暂无" }}</span>
                                <span style="font-family: ArialMT; font-size: 12px; color: #999; line-height: 12px; margin-left: 10px">{{ mslaWorkOrderReportRel.workFlowReportRemarkTime || "暂无" }}</span>
                              </div>
                              <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #999; line-height: 13px; margin-top: 12px">
                                {{ mslaWorkOrderReportRel.workFlowReportRemark || "暂无意见" }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- 填写建议 / 编辑建议-->
                        <div v-if="editAdviceInput">
                          <div style="display: flex; margin-top: 16px">
                            <img :src="woInfo.executePersonHeadUrl ? woInfo.executePersonHeadUrl : headImg" alt="" style="width: 40px; height: 40px; border-radius: 50%" />
                            <div style="margin-left: 16px">
                              <div>
                                <span style="font-family: MicrosoftYaHei; font-size: 14px; color: #001450; line-height: 14px">{{ woInfo.executePersonName || "暂无" }}</span>
                              </div>
                              <div class="advice-wrap" style="margin-top: 12px">
                                <el-input
                                  resize="none"
                                  style="width: 640px"
                                  type="textarea"
                                  placeholder="请填写工程师建议"
                                  v-model="mslaWorkOrderReportRel.workFlowReportRemark"
                                  maxlength="200"
                                  rows="2"
                                  show-word-limit
                                ></el-input>
                              </div>
                              <div slot="footer" style="margin-top: 20px">
                                <el-button type="danger" @click="handleSubmitAdvice()" size="small">提交</el-button>
                                <el-button @click="handleResetAdvice()" size="small">取消</el-button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 待评价 已完成  已关闭  工单 -->
                  <div v-if="woInfo.serviceDtoList && (woInfo.workOrderStatus == 2 || woInfo.workOrderStatus == 3 || woInfo.workOrderStatus == 4)">
                    <div v-for="(item, index) in woInfo.serviceDtoList" :key="index" style="border: 1px solid #e9e9e9; font-family: MicrosoftYaHei; border-radius: 4px; margin-top: 14px">
                      <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px">
                        <div style="display: flex; align-items: center; font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                          <img v-if="item.attachmentType == 'docx' || item.attachmentType == 'doc'" src="../../assets/word.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                          <img v-else-if="item.attachmentType == 'pdf'" src="../../assets/pdf.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                          <img v-else-if="item.attachmentType == 'ppt' || item.attachmentType == 'pptx'" src="../../assets/pptx.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                          <img
                            v-else-if="item.attachmentType == 'excel' || item.attachmentType == 'xlsx' || item.attachmentType == 'xls'"
                            src="../../assets/excel.png"
                            alt=""
                            style="width: 32px; height: 32px; margin-right: 12px"
                          />
                          <img v-else src="../../assets/unknow-icon.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                          <div style="font-family: MicrosoftYaHei">
                            <div style="line-height: 13px; font-size: 13px; color: #333">{{ item.attachmentTitle }}</div>
                            <div style="display: flex; align-items: center; line-height: 12px; font-size: 12px; color: #999; margin-top: 12px">
                              <div>
                                报告评级：
                                <span v-if="mslaWorkOrderReportRel.mslaWorkFlowReportResultLevel == 'Caution'" style="color: #ff9900">注意</span>
                                <span v-if="mslaWorkOrderReportRel.mslaWorkFlowReportResultLevel == 'Alert'" style="color: #dd0000">警告</span>
                                <span v-if="mslaWorkOrderReportRel.mslaWorkFlowReportResultLevel == 'Normal'" style="color: #008888">正常</span>
                              </div>
                              <div style="margin-left: 10px; border-left: 1px solid #e9e9e9; padding-left: 10px">生成时间：{{ item.createTime }}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <img @click="downLoadServiceReport(item.attachmentUrl)" src="../../assets/download-icon.png" alt="" style="width: 32px; height: 32px" />
                        </div>
                      </div>
                      <!-- 建议 -->
                      <div style="border-top: 1px solid #e9e9e9; padding-top: 20px; padding: 20px">
                        <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold">工程师建议</div>
                        <div style="display: flex; align-items: center; margin-top: 16px">
                          <img :src="woInfo.executePersonHeadUrl ? woInfo.executePersonHeadUrl : headImg" alt="" style="width: 40px; height: 40px; border-radius: 50%" />
                          <div style="margin-left: 16px">
                            <div>
                              <span style="font-family: MicrosoftYaHei; font-size: 14px; color: #001450; line-height: 14px">{{ woInfo.executePersonName || "暂无" }}</span>
                              <span style="font-family: ArialMT; font-size: 12px; color: #999; line-height: 12px; margin-left: 10px">{{ mslaWorkOrderReportRel.workFlowReportRemarkTime || "暂无" }}</span>
                            </div>
                            <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #999; line-height: 13px; margin-top: 12px">
                              {{ mslaWorkOrderReportRel.workFlowReportRemark || "暂无意见" }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 油样信息 -->
              <div style="width: 100%; background: #fff; margin-top: 20px">
                <div style="padding: 20px">
                  <div style="font-family: MicrosoftYaHei-Bold; font-size: 14px; color: #000; line-height: 14px; font-weight: bold; border-left: 3px solid #dd0000; padding-left: 10px">油样信息</div>
                  <div>
                    <el-row>
                      <el-col :span="12" style="margin-top: 16px">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">油样状态</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                            
                            <span v-if="mslaWorkOrderReportRel.msdpSampleStatusDesc == '注意'" style="color: #ff9900">{{ mslaWorkOrderReportRel.msdpSampleStatusDesc }}</span>
                            <span v-else-if="mslaWorkOrderReportRel.msdpSampleStatusDesc == '警告'" style="color: #dd0000">{{ mslaWorkOrderReportRel.msdpSampleStatusDesc }}</span>
                            <span v-else-if="mslaWorkOrderReportRel.msdpSampleStatusDesc == '已取消'" style="color: #999">{{ mslaWorkOrderReportRel.msdpSampleStatusDesc }}</span>
                            <span v-else-if="mslaWorkOrderReportRel.msdpSampleStatusDesc == '报告已生成'" style="color: #008888">{{ mslaWorkOrderReportRel.msdpSampleStatusDesc }}</span>
                            <span v-else-if="mslaWorkOrderReportRel.msdpSampleStatusDesc == '报告已生成，工程师批注'" style="color: #008888">{{ mslaWorkOrderReportRel.msdpSampleStatusDesc }}</span>
                            <span v-else style="color: #001450">{{ mslaWorkOrderReportRel.msdpSampleStatusDesc }}</span>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12" v-for="(item, index) in lubricationPointAttributeList" :key="index" style="margin-top: 16px">
                        <div style="display: flex; align-items: center;width:100%;">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">{{ item.fieldTitleCn }}</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333;max-width:70%">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              :content="item.child && item.child.listItemValueCn ? item.child.listItemValueCn : item.listItemValueCn ? item.listItemValueCn : item.listItemValue"
                              placement="top-start"
                            >
                              <div class="header-no-wrap" style="width:100%">
                                {{ item.child && item.child.listItemValueCn ? item.child.listItemValueCn : item.listItemValueCn ? item.listItemValueCn : item.listItemValue }}
                              </div>
                            </el-tooltip>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12" style="margin-top: 16px">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">所属设备</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">{{ mslaWorkOrderReportRel.deviceName }}</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 16px">
                      <el-col :span="12">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">润滑点</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333; cursor: pointer;max-width:70%" @click="toDeviceDetail(mslaWorkOrderReportRel.deviceNumber)">
                            <div style="display:flex;align-items:center;">
                              <el-tooltip class="item" effect="dark" :content="mslaWorkOrderReportRel.lubricationPointType" placement="top-start">
                                <div class="header-no-wrap">{{ mslaWorkOrderReportRel.lubricationPointType }}</div>
                              </el-tooltip>
                              <i class="el-icon-arrow-right"></i>
                            </div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">单元编号</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">{{ mslaWorkOrderReportRel.mslaUnitNumber || "暂无" }}</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 16px">
                      <el-col :span="12">
                        <div style="display: flex; align-items: center;width:100%;">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">润滑点描述</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333;width:70%;">
                            <el-tooltip class="item" effect="dark" :content="mslaWorkOrderReportRel.lubricationPointDesc" placement="top-start">
                              <div class="header-no-wrap">{{ mslaWorkOrderReportRel.lubricationPointDesc || "暂无" }}</div>
                            </el-tooltip>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <!-- MSLA 字段 -->
                    <el-row style="margin-top: 20px; border-top: 1px solid #e9e9e9; padding-top: 4px">
                      <el-col :span="12" style="margin-top: 16px">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">油样瓶ID</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">{{ mslaWorkOrderReportRel.bottleId }}</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 20px; border-top: 1px solid #e9e9e9; padding-top: 20px">
                      <el-col :span="12">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">补油量</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333" v-if="mslaWorkOrderReportRel.fillOilQuantity">
                            {{ mslaWorkOrderReportRel.fillOilQuantity }} {{ mslaWorkOrderReportRel.fillOilQuantityUnitDesc }}
                          </div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333" v-else>暂无</div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">设备使用时间</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333" v-if="mslaWorkOrderReportRel.lubricationPointAge">
                            {{ mslaWorkOrderReportRel.lubricationPointAge }} {{ mslaWorkOrderReportRel.lubricationPointAgeUnitDesc }}
                          </div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333" v-else>暂无</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 16px">
                      <el-col :span="12">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">油箱温度</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333" v-if="mslaWorkOrderReportRel.oilBoxTemperature">
                            {{ mslaWorkOrderReportRel.oilBoxTemperature }} {{ mslaWorkOrderReportRel.oilBoxTemperatureUnitDesc }}
                          </div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333" v-else>暂无</div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">上次用油日期</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                            {{ mslaWorkOrderReportRel.lastOilChangeDate ? mslaWorkOrderReportRel.lastOilChangeDate : "暂无" }}
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 16px">
                      <el-col :span="12">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">油品是否更换</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                            {{ mslaWorkOrderReportRel.changeOil === null ? "暂无" : mslaWorkOrderReportRel.changeOil ? "是" : "否" }}
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">油品使用时间</div>
                          <div v-if="mslaWorkOrderReportRel.oilAgeNum" style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                            {{ mslaWorkOrderReportRel.oilAgeNum }}{{ mslaWorkOrderReportRel.oilAgeNumUnitDesc }}
                          </div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333" v-else>暂无</div>
                        </div>
                      </el-col>
                    </el-row>
                    <el-row style="margin-top: 16px">
                      <el-col :span="12">
                        <div style="display: flex; align-items: center">
                          <div style="width: 92px; font-family: MicrosoftYaHei; font-size: 13px; color: #999">滤芯是否更换</div>
                          <div style="font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                            {{ mslaWorkOrderReportRel.changeFilterElement === null ? "暂无" : mslaWorkOrderReportRel.changeFilterElement ? "是" : "否" }}
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
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
            <el-input type="textarea" placeholder="请输入" v-model="ruleForm.text" maxlength="300" resize="none" rows="2" show-word-limit></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style="margin-top: 20px">
          <el-button type="danger" plain @click="handleReset('ruleForm')" size="small">取消</el-button>
          <el-button type="danger" @click="handleSubmit('ruleForm')" size="small">提交</el-button>
        </div>
      </el-dialog>
      <!-- 分配弹框 -->
      <el-dialog title="分配工单" :visible.sync="executePersonNameVisiable" width="40%" class="create-task radio-tab le">
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
            :data="engineerInfoList"
            v-loading="loadingPerson"
            :row-key="getRowKey"
            v-el-table-infinite-scroll="loadMore"
            tooltip-effect="dark"
            @current-change="handleDistributionnChange"
          >
            <el-table-column width="55">
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
      <!-- 完结工单 -->
      <el-dialog class="closeWorkOrder" :visible.sync="finishWorkorder" :show-close="false" width="30%">
        <div style="display: flex; font-family: MicrosoftYaHei; line-height: 18px; font-size: 18px; color: #000; margin: 0px; align-items: center">
          <img src="../../assets/notice-icon.png" alt="" style="width: 18px; height: 18px; margin-right: 10px" />是否完结工单？
        </div>
        <div class="notice-title">工单完结后将无法进行任何操作</div>
        <div slot="footer">
          <el-button type="danger" plain @click="handleResetFinish()" size="small">取消</el-button>
          <el-button type="danger" @click="sureFinishOrder()" size="small">完结</el-button>
        </div>
      </el-dialog>
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
import Promote from "../newWorkerOrderAndServiceApplyPromote/workerOrder_promote.js";
import oilDetail from "./mixins/oilDetail.js";
import DAModify from "./mixins/DAModify.js";
export default {
  mixins: [Promote, DAModify, oilDetail],
  directives: {
    "el-table-infinite-scroll": elTableInfiniteScroll
  },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 136}px`,
      mainminFormheight: `height:${document.documentElement.clientHeight - 236}px`,
      mainminProcessheight: `height:${document.documentElement.clientHeight - 276}px`,
      headImg: require("../../assets/headImg.png"),
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

  components: {
    WorkerOrderPromote: () => import("../newWorkerOrderAndServiceApplyPromote/workerOrder_promote.vue")
  },

  computed: {},

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
    refreshMslaReport() {
      const loading = this.$loading({
        lock: true,
        text: "报告刷新中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.requestMethodGet("/weChat/workOrder/refreshMslaWorkOrderReport", {workOrderNumber: this.woInfo.workOrderNumber})
        .then(res => {
          loading.close();
          res = res.data;
          if(res.data&&res.data.length>0){
            this.woInfo.serviceDtoList = res.data
            this.woInfo.serviceDtoList.forEach(item => {
              item.attachmentTitle = item.attachmentUrl.split("/")[item.attachmentUrl.split("/").length - 1];
              item.attachmentType = item.attachmentTitle.split(".")[item.attachmentUrl.split(".").length - 1].toLowerCase();
            });
          }
          this.$message({
            message: res.msg,
            type: "warning"
          });
        })
        .catch(res => {
          loading.close();
           this.$message({
            message: res.msg,
            type: "warning"
          });
        });
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
  /deep/.closeWorkOrder {
    .el-dialog__header {
      padding: 0px;
    }
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
  /deep/.confirmButton {
    .el-button--primary {
      background: #ff0000 !important;
      border-color: #ff0000;
    }
  }
  /deep/.closeWorkOrder {
    .el-dialog__header {
      padding: 0px;
    }
  }
  .header-no-wrap {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 90%;
    display: inline-block;
  }
  /deep/.advice-wrap {
    .el-textarea__inner {
      font-family: MicrosoftYaHei;
      font-size: 13px;
      color: #999;
    }
  }

  .weui-cell-list:last-of-type .weui-cell-line::before {
    height: 65%;
    top: 4px;
  }
  .notice-title {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    line-height: 14px;
    margin: 20px 0 10px;
    color: #666;
  }
  /deep/.el-table::before {
    height: 0px;
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
  /deep/ .service-report {
    .el-col-12:nth-child(odd) {
      padding-right: 10px;
    }
    .el-col-12:nth-child(even) {
      padding-left: 10px;
    }
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
  .right-wrap {
    -webkit-box-flex: 1;
    margin-left: 20px;
    overflow-y: auto;
  }
  .progress-box {
    margin-top: 20px;
    font-size: 12px;
    overflow: auto;
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
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form-item__label {
    line-height: 14px;
    margin-top: 16px;
  }
  .no-wrap {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon-service {
    width: 18px;
    height: 18px;
  }
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
  .base-title {
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
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

  .el-dialog__title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    line-height: 16px;
  }
  .el-form-item__content {
    margin-top: 10px;
    line-height: 14px !important;
  }
  .weui-cell-list:first-of-type {
    color: #000;
  }
  .wrap-two {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
<style>
.work-order-detail .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-button .copy_text .el-button--text span {
  color: #fff;
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
.radio-table .el-table::before {
  height: 0px !important;
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
