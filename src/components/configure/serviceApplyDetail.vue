<template>
  <div class="service-apply-detail">
    <div class="return-btn" style="position: absolute; right: 20px; height: 60px; line-height: 60px; top: -55px" v-if="detailData.buttonFlag || detailData.serviceApplyStatus == 3" :key="refreshBtnKey">
      <!-- style="position:absolute;right:119px;top:-40px;height:32px" -->
      <el-button v-if="$userInfo.userType !=2 && detailData.serviceApplyStatus == 3 && $userInfo.userId == detailData.executeUserId" v-has="PC_ApplyOrder_Undo" size="small" type="danger" @click="promote_revertClick('applyOrder')">
        {{ promote_revertBtnName_apply }}
      </el-button>
      <el-button v-if="$userInfo.userType ==2 && detailData.serviceApplyStatus == 3" v-has="PC_ApplyOrder_Undo" size="small" type="danger" @click="promote_revertClick('applyOrder')">
        {{ promote_revertBtnName_apply }}
      </el-button>
      <!-- 客户的取消按钮 -->
      <el-button plain size="small" @click="cancelApplyOrder" v-if="detailData.serviceApplyStatus == 0 && $userInfo.userType == 2" v-has="PC_ApplyOrder_Customerclose">
        取消
      </el-button>
      <!-- 1、美孚管理员角色登录web /小程序  
      1.1直供客户申请单详情：待确认、待处理、进行中申请单详情页，展示"编辑/取消"
      1.2经销商客户申请单详情：待确认、待处理、进行中且是当前用户是服务申请单执行人时展示"编辑/ 取消"；
      2、经销商管理员角色登录web/小程序
      2.1经销商客户申请单详情：待确认、待处理、进行中时展示"编辑/ 取消"；
      2.2直供客户申请单详情（DA客户）:待确认、待处理、进行中且当前用户是服务申请单执行人时展示"编辑/ 取消"； -->
      <!-- 美孚的取消按钮 -->
      <el-button
        plain
        size="small"
        @click="cancelApplyOrder"
        v-if=" $userInfo.userType == 0 && detailData.serviceApplyStatus < 3 && (detailData.daFlag || (!detailData.daFlag && detailData.executeUserId == $userInfo.userId))"
        v-has="EMSP_service_order_edit_btn"
      >
        取消
      </el-button>
      <!-- 经销商的取消按钮 -->
      <el-button
        plain
        size="small"
        @click="cancelApplyOrder"
        v-if="$userInfo.userType == 1 && detailData.serviceApplyStatus < 3 && (!detailData.daFlag || (detailData.daFlag && detailData.executeUserId == $userInfo.userId))"
        v-has="EMSP_service_order_edit_btn"
      >
        取消
      </el-button>
      <!-- 客户视角的这两个按钮，只在待确认状态出现 -->
      <el-button plain size="small" @click="editApplyOrder" v-if="detailData.serviceApplyStatus == 0 && $userInfo.userType == 2" v-has="PC_ApplyOrder_Customeredite">
        编辑
      </el-button>
      <!-- 美孚视角的这两个按钮，在待确认、待处理、进行中状态出现 -->
      <!-- detailData.customerType==1直供客户，detailData.customerType==2经销商客户 -->
      <el-button
        plain
        size="small"
        @click="editApplyOrder"
        v-if="$userInfo.userType == 0&&detailData.serviceApplyStatus < 3 && (detailData.daFlag || (!detailData.daFlag && detailData.executeUserId == $userInfo.userId))"
        v-has="PC_ApplyOrder_edite"
      >
        编辑
      </el-button>
      <!-- 经销商视角的这两个按钮，在待确认、待处理、进行中状态出现 -->
      <!-- detailData.customerType==1直供客户，detailData.customerType==2经销商客户 -->
      <el-button
        plain
        size="small"
        @click="editApplyOrder"
        v-if="$userInfo.userType == 1&&detailData.serviceApplyStatus < 3 && (!detailData.daFlag || (detailData.daFlag && detailData.executeUserId == $userInfo.userId))"
        v-has="PC_ApplyOrder_edite"
      >
        编辑
      </el-button>
      <el-button type="danger" size="small" @click="endApplyOrder" v-has="PC_ApplyOrder_finish" v-if="detailData.serviceApplyStatus == 2 && detailData.executeUserId == userInfo.userId">
        完结
      </el-button>
      <el-button
        type="danger"
        size="small"
        @click="createCase"
        v-if="detailData.serviceApplyStatus == 3 && !detailData.isGood"
        v-auth="{
          menuCodes: 'Applicationform_SubmitExcellentcase',
          strategyNames: ['personal'],
          strategySource: {
            personal: detailData.executeUserId
          }
        }"
      >
        提报优秀案例
      </el-button>
      <el-button
        type="danger"
        size="small"
        @click="revocationCase"
        v-if="detailData.isGood && detailData.reportStatus == 1 && revocationCaseType == 1"
        v-auth="{
          menuCodes: 'Applicationform_Excellent',
          strategyNames: ['personal'],
          strategySource: {
            personal: detailData.reportCreateUserId
          }
        }"
      >
        撤回优秀案例
      </el-button>
    </div>
    <!-- 内容区域 -->
    <div :style="mainminheight" class="service-apply-detail" style="padding: 10px 20px 24px; overflow: auto;height:100%">
      <!-- 最新样式 -->
      <el-row style="flex-grow: 1;height:100%;overflow-y: auto;">
        <el-col :span="7" style="border: 1px solid #dcdfe6;overflow-y: auto; height: 100%">
          <el-form label-width="100px" label-position="left" inline>
            <div style="padding:20px;border-bottom: 1px solid #DCDFE6;">
              <div class="status-title" :style="detailData.serviceApplyStatus == 2 ? 'color:#008888' : detailData.serviceApplyStatus > 2 ? '#666' : '#dd0000'">
                <img class="img" src="../../assets/service_apply_class.png" alt="" />{{ detailData.serviceApplyStatus | applyStatus }}
                <div class="case-title" v-if="detailData.isGood">优秀案例</div>
                <el-link :underline="false" style="color:#dd0000" v-if="detailData.isGood && revocationCaseType == 1" @click="viewDetail" v-has="Applicationformr_Excellen">提交详情</el-link>
              </div>
              <div>
                <el-row>
                  <el-col :span="24" v-if="userInfo.userType != 2">
                    <el-form-item label="客户:" class="label" style="width: 100%">
                      <el-tooltip class="item" effect="dark" :content="detailData.customerCompanyName" placement="top-start">
                        <div style="overflow: hidden; text-overflow: ellipsis; max-width: 100%; white-space: nowrap; color: #001450">{{ detailData.customerCompanyName }}</div>
                      </el-tooltip>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="执行人:" class="label">
                      <div>
                        <span v-if="detailData.executeUserId">{{ detailData.executeUserName }}</span>
                        <span v-else style="color:#dd0000;">未分配</span>
                        <el-button
                          plain
                          type="danger"
                          size="small"
                          style="height:28px;line-height:28px;padding: 0 10px;margin-left: 12px;"
                          @click="distributionAndSumbit"
                          v-has="PC_ApplyOrder_assign"
                          v-if="($userInfo.userType == 0 && detailData.serviceApplyStatus==0 && detailData.daFlag) || ($userInfo.userType == 1 && detailData.serviceApplyStatus==0 && !detailData.daFlag)"
                        >
                          分配执行人
                        </el-button>
                        <el-button
                          plain
                          type="danger"
                          size="small"
                          style="height:28px;line-height:28px;padding: 0 10px;margin-left: 12px;"
                          @click="distributionAndSumbit"
                          v-has="PC_ApplyOrder_reassign"
                          v-if="(
                            (detailData.serviceApplyStatus==1 || detailData.serviceApplyStatus==2) &&
                            (($userInfo.userType == 0 && detailData.daFlag) || 
                            ($userInfo.userType == 0 && !detailData.daFlag && ($userInfo.userId == detailData.executeUserId)))
                          ) || (
                            (detailData.serviceApplyStatus==1 || detailData.serviceApplyStatus==2) &&
                            (($userInfo.userType == 1 && detailData.daFlag && ($userInfo.userId == detailData.executeUserId))||
                              ($userInfo.userType == 1 && !detailData.daFlag)
                            )
                          )"
                        >
                        <!-- 重新分配 -->
                          变更执行人
                        </el-button>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </div>
            <!-- 需求概述 -->
            <div style="padding:20px;border-bottom: 1px solid #DCDFE6;">
              <el-row style="margin-bottom: 10px">
                <div style="display:flex;justify-content: space-between;">
                  <div>
                    <el-form-item label="需求概述" class="label"></el-form-item>
                  </div>

                  <div style="color:#ff9900;cursor: pointer;" v-if="detailData.serviceApplyStatus == 1 || detailData.serviceApplyStatus == 2" @click="viewSuggestions">
                    <i class="el-icon-warning-outline"></i>
                    查看服务指引和建议
                  </div>
                </div>
                <div v-if="!(detailData.reasonConfList && detailData.reasonConfList.length == 1 && detailData.reasonConfList[0] == '2' && detailData.serviceApplyReasonList[0].name == '')">
                  <el-row v-for="item in detailData.serviceApplyReasonList" :key="item.id" style="margin-top: 16px;">
                    <el-col :span="7" style="color: #000;font-weight: 700;font-size: 13px;padding-right: 30px;"> {{ item.parentName }} {{ item.total }} </el-col>
                    <el-col :span="15" style="color: #333;font-weight: 400;font-size: 13px;">
                      <span v-if="item.total == 0">暂无</span>
                      <span style="color:#333;" v-if="item.total > 0">
                        <div v-for="(name, index) in item.nameList" :key="index" style="margin-bottom:10px;">
                          {{ name }}
                        </div>
                      </span>
                    </el-col>
                  </el-row>
                </div>
                <div v-if="detailData.reasonConfList && detailData.reasonConfList.length == 1 && detailData.reasonConfList[0] == '2' && detailData.serviceApplyReasonList[0].name == ''">
                  暂无
                </div>
              </el-row>
            </div>
            <div style="padding:20px;border-bottom: 1px solid #DCDFE6;">
              <el-row style="margin-bottom: 10px">
                <el-form-item label="照片" class="label"></el-form-item>
                <div v-if="detailData.serviceImgFullUrlList && detailData.serviceImgFullUrlList.length > 0">
                  <el-image
                    v-for="(item, i) in detailData.serviceImgFullUrlList"
                    :key="item.uid"
                    style="width: 100px; height: 100px; margin-right: 12px; border-radius: 4px"
                    :src="detailData.serviceImgFullUrlList[i].url"
                    :preview-src-list="[...detailData.serviceImgFullUrlList.map(pic => pic.url)]"
                  />
                </div>
                <div v-else>暂无照片</div>
              </el-row>
              <el-row style="margin-bottom: 10px">
                <el-form-item label="视频" class="label"></el-form-item>
                <div @click="openVideo" v-if="detailData.videoFullUrl" style="position: relative; width: fit-content; display: flex; justify-content: center; align-items: center">
                  <video :src="detailData.videoFullUrl" style="height: 150px; cursor: pointer; border-radius: 6px"></video>
                  <i class="el-icon-video-play" style="font-weight: 700; font-size: 36px; color: #00144f; position: absolute; cursor: pointer" />
                </div>
                <div v-else>暂无视频</div>
              </el-row>
            </div>
            <!-- 其他内容 -->
            <div style="padding:20px;">
              <el-row>
                <el-form-item label="申请单号" class="label">
                  <el-tooltip class="item" effect="dark" :content="detailData.serviceApplyNo" placement="top-start">
                    <span style="color: #001450">{{ detailData.serviceApplyNo }}</span>
                  </el-tooltip>
                </el-form-item>
              </el-row>
              <el-row style="display: flex;">
                <el-form-item label="来源" class="label" style="margin-right: 0px;"></el-form-item>
                <!-- 未关联异常id为“直接创建”，关联了异常id为“处理异常” -->
                <div style="display: flex; align-items: center">
                  <div>{{ detailData.source == 2 ? "处理异常" : "直接创建" }}</div>
                  <el-link style="margin-left: 20px" @click="viewAbnormal" v-if="detailData.source == 2">查看异常</el-link>
                </div>
              </el-row>
              <el-row v-if="userInfo.userType != 2">
                <el-form-item label="服务创盈" class="label">
                  <div>{{ detailData.servicePropertyStr || "暂无" }}</div>
                </el-form-item>
              </el-row>
              <el-row v-if="userInfo.userType != 2">
                <el-form-item label="预估收益" class="label">
                  <div>{{ detailData.income || "暂无" }}</div>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="下单人" class="label">
                  <div>{{ detailData.applyUserName }}</div>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="申请时间" class="label" style="width: 100%">
                  <el-tooltip class="item" effect="dark" :content="detailData.applyTime" placement="top-start">
                    <div style="overflow: hidden; text-overflow: ellipsis; max-width: 100%; white-space: nowrap">{{ detailData.applyTime }}</div>
                  </el-tooltip>
                </el-form-item>
              </el-row>
            </div>
          </el-form>
        </el-col>
        <el-col :span="17" style="padding:20px;border: 1px solid #dcdfe6;border-left: none;overflow: auto; height: 100%">
          <div v-if="userInfo.userType != 2">
            <div style="color: #c0c4cc; font-size: 13px; margin-top: 40px; text-align: center" v-if="!detailData.executeUserId">请先分配申请单执行人</div>

            <div style="display: flex" v-if="detailData.serviceApplyStatus > 0 && userInfo.userType != 2">
              <el-row style="flex-grow: 1">
                <el-col :span="24">
                  <div>
                    <div class="flex" style="margin-bottom: 20px; font-weight: 600; font-size: 16px">
                      服务项（{{ detailData.serviceApplyOrderServiceItemDtoList.length }}）
                      <div>
                        <el-button
                          size="small"
                          type="danger"
                          v-has="PC_ApplyOrder_addserviceitem"
                          v-if="detailData.executeUserId == userInfo.userId && (detailData.serviceApplyStatus == 1 || detailData.serviceApplyStatus == 2)"
                          @click="addServiceItem"
                        >
                          添加服务项
                        </el-button>
                        <el-button
                          plain
                          type="danger"
                          size="small"
                          @click="relateWorkorder()"
                          v-if="detailData.executeUserId == userInfo.userId"
                          v-has="PC_ApplyOrder_WorkOrderAssociation"
                          >关联工单</el-button
                        >
                      </div>
                    </div>
                    <div style="color: #c0c4cc; font-size: 13px; margin-top: 80px; text-align: center" v-if="!detailData.serviceApplyOrderServiceItemDtoList.length">暂无服务项</div>
                    <div v-else :key="serviceItemKey">
                      <div style=" margin-bottom: 20px" class="flex" v-for="item in detailData.serviceApplyOrderServiceItemDtoList" :key="item.id">
                        <div class="service-list flex" style="align-items: stretch">
                          <div class="service-item">
                            <div style="color: #c0c4cc">服务项</div>
                            <div>{{ item.serviceName }}</div>
                          </div>
                          <div class="service-item">
                            <div style="color: #c0c4cc">状态</div>
                            <div style="display: flex; align-items: center">
                              <span class="status-tip" :style="item.workOrderStatus == 1 ? 'background:#008888' : item.workOrderStatus > 2 ? 'background:#999' : 'background:#dd0000'"></span>
                              {{ item.workOrderStatusName || "未开始" }}
                            </div>
                          </div>
                          <div class="service-item">
                            <div style="color: #c0c4cc">服务负责人</div>
                            <div>
                              {{ item.serviceChargeUserName }}
                              <el-button
                                type="danger"
                                plain
                                size="small"
                                @click="distributionDialog('服务负责人', item)"
                                v-has="PC_ApplyOrder_reassignservicemanage"
                                v-if="item.workOrderStatus == null && detailData.executeUserId == userInfo.userId && detailData.serviceApplyStatus < 4"
                                style="height: 28px; line-height: 28px; padding: 0; width: 47px; margin-left: 10px"
                              >
                                更 换
                              </el-button>
                            </div>
                          </div>
                          <div class="service-item">
                            <div style="color: #c0c4cc">操作</div>
                            <div>
                              <el-button
                                type="danger"
                                size="small"
                                style="height: 28px; line-height: 28px; padding: 0; width: 47px"
                                @click="openAddOrder(item)"
                                v-if="item.workOrderStatus == null && detailData && (detailData.serviceApplyStatus == 2 || detailData.serviceApplyStatus == 1) && $_has('PC_ApplyOrder_startorder') && item.serviceChargeUserId == $userInfo.userId"
                              >
                                开 单
                              </el-button>
                              <el-button
                                plain
                                size="small"
                                style="height: 28px; line-height: 28px; padding: 0; width: 47px"
                                @click="deleteServiceItem(item.id)"
                                v-has="PC_ApplyOrder_deleteserviceitem"
                                v-if="item.workOrderStatus == null && (detailData.serviceApplyStatus == 2 || detailData.serviceApplyStatus == 1) && detailData.executeUserId == userInfo.userId"
                              >
                                删 除
                              </el-button>
                              <el-button
                                plain
                                size="small"
                                style="height: 28px; line-height: 28px; padding: 0; width: 47px"
                                @click="handReport(item)"
                                v-if="item.workOrderStatus || item.workOrderStatus == 0"
                              >
                                详 情
                              </el-button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>

            <div class="service-name-form" style="margin-top: 20px; padding-top: 10px" v-if="detailData.evaluateContent || detailData.point != 0 || detailData.serviceApplyStatus == 4">
              <el-form label-width="80px" label-position="left" inline>
                <el-row style="margin-bottom: 10px" v-if="detailData.serviceApplyStatus == 4">
                  <el-form-item label="取消原因" class="label"></el-form-item>
                  <div>{{ detailData.cancelReason }}</div>
                </el-row>
                <el-row v-if="(detailData.evaluateContent || detailData.point != 0) && detailData.serviceApplyStatus == 5">
                  <div style="color:#000;font-weight: 700;font-size: 16px;">服务评价</div>
                  <div style="line-height: 14px; margin-top: 12px">
                    <div style="color:#000;font-weight: 700;font-size: 13px;">评分</div>
                    <div v-if="detailData.point" style="display: flex; align-items: center">
                      <img class="star" :src="src1" v-for="(it, index) in detailData.point" :key="index" />
                      <img class="star" :src="src2" v-for="(it, index) in 5 - detailData.point" :key="index" />
                      <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #001450; line-height: 14px; margin-left: 10px">{{ scoreRemark }}</span>
                    </div>
                    <div v-else style="margin-top: 10px">暂无打分</div>
                  </div>
                  <div style="color:#000;font-weight: 700;font-size: 13px;margin:16px 0 8px;">评价</div>
                  <div>{{ detailData.evaluateContent || "暂无评价" }}</div>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 客户展示页面    服务进度 -->
          <div v-else>
            <!-- 服务进度 -->
            <el-row v-if="userInfo.userType == 2">
              <div class="status-progress">服务进度</div>
              <el-timeline>
                <el-timeline-item :color="index == 0 ? '#008888' : '#D9ECFF'" size="large" v-for="(item, index) in detailData.applyOrderOperateRecordDtoList" :key="index">
                  <div slot="dot" class="level-point" v-if="index != 0"></div>
                  <i slot="dot" class="el-icon-success first-point" v-else></i>
                  <div style="padding-bottom: 10px">
                    <div class="content" :style="{ color: index == 0 ? '#909399' : '#C0C4CC' }">{{ item.createTime }}</div>
                    <div class="content" :style="{ color: index == 0 ? '#303133' : '#909399' }">
                      {{ item.operateDesc }}
                      <span v-if="item.serviceApplyStatus == 2">
                        <span style="color: #001450; text-decoration: underline; cursor: pointer" v-if="item.workOrderStatus == 2 || item.workOrderStatus == 3" @click="handReport(item)"
                          >点击查看报告</span
                        >

                        <div v-if="item.workOrderStatus == 1 || (item.workOrderNumber && (item.workOrderStatus == 6 || item.workOrderStatus == 7))">
                          <div style="padding: 0px 8px 0px; margin:6px 0 0px" class="flex" v-for="service in item.serviceItemList" :key="service.id">
                            <div class="item-service  flex" @click="handReport(service)">
                              {{ service.serviceName }}
                              <div class="flex" style="margin-left: 12px;">
                                <span
                                  class="status-tip"
                                  :style="
                                    service.workOrderStatus == 1 ? 'background:#008888' : service.workOrderStatus == 0 || service.workOrderStatus == 2 ? 'background:#dd0000' : 'background:#dd0000'
                                  "
                                ></span
                                >{{ service.workOrderStatusName }}
                                <i class="el-icon-arrow-right" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </span>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
              <div class="service-name-form" style="margin-top: 20px; padding-top: 10px" v-if="detailData.evaluateContent || detailData.point != 0 || detailData.serviceApplyStatus == 4">
                <el-form label-width="80px" label-position="left" inline>
                  <el-row style="margin-bottom: 10px" v-if="detailData.serviceApplyStatus == 4">
                    <el-form-item label="取消原因" class="label"></el-form-item>
                    <div>{{ detailData.cancelReason }}</div>
                  </el-row>
                  <el-row v-if="detailData.evaluateContent || detailData.point != 0">
                    <div style="color:#000;font-weight: 700;font-size: 16px;">服务评价</div>
                    <div style="line-height: 14px; margin-top: 12px">
                      <div style="color:#000;font-weight: 700;font-size: 13px;">评分</div>
                      <div v-if="detailData.point" style="display: flex; align-items: center">
                        <img class="star" :src="src1" v-for="(it, index) in detailData.point" :key="index" />
                        <img class="star" :src="src2" v-for="(it, index) in 5 - detailData.point" :key="index" />
                        <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #001450; line-height: 14px; margin-left: 10px">{{ scoreRemark }}</span>
                      </div>
                      <div v-else style="margin-top: 10px">暂无打分</div>
                    </div>
                    <div style="color:#000;font-weight: 700;font-size: 13px;margin:16px 0 8px;">评价</div>
                    <div>{{ detailData.evaluateContent || "暂无评价" }}</div>
                  </el-row>
                </el-form>
              </div>
              <el-row v-if="detailData.serviceApplyStatus == 3 && !detailData.point && !detailData.evaluateContent">
                <div style="color:#000;font-weight: 700;font-size: 16px;">服务评价</div>
                <div style="text-align:center;width:160px;margin:0 auto">
                  <img src="../../assets/empty_file.png" alt="" />
                  <div style="color:#999;font-size:13px;">暂无评价</div>
                  <el-button 
                  v-has="PC_ApplyOrder_comment" 
                  v-if="$userInfo.userType==2 && detailData.serviceApplyStatus == 3 && detailData.customerCompanyNumber==$userInfo.companyNumber"
                  type="danger" 
                  plain 
                  style="margin-top:16px;" 
                  size="small" 
                  @click="handleEvaluateRemark">
                    添加评价
                  </el-button>
                </div>
              </el-row>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 关闭工单弹出框 -->
    <el-dialog class="closeWorkOrder" :visible="dialogFormVisible" :show-close="false" width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
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
        </div>
        <el-form-item prop="cancelReason" v-if="ruleForm.close == '其他'" style="margin-top: 16px">
          <el-input type="textarea" placeholder="请输入" v-model="ruleForm.cancelReason" maxlength="200" :autosize="{ minRows: 4, maxRows: 8 }" resize="none" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-top: 20px">
        <el-button type="danger" plain @click="dialogFormVisible = false" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitCloseReason('ruleForm')" size="small">提交</el-button>
      </div>
    </el-dialog>
    <!--评价 -->
    <el-dialog title="评价" :visible.sync="reasonFormVisible" width="500px" class="email-dialog" :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right">
        <div style="display: flex; align-items: center; margin-bottom: 16px">
          <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #999; line-height: 14px; margin-right: 16px; width: 30px">打分</span>
          <div v-for="(item, index) in imgsStar" :key="index" @click="select(item)">
            <img class="star" :src="item.id > starId ? src2 : src1" />
          </div>
          <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #001450; line-height: 14px; margin-left: 10px">{{ scoreRemark }}</span>
        </div>
        <el-row class="email-font">
          <el-col :span="24">
            <span style="font-family: MicrosoftYaHei; font-size: 13px; color: #999; line-height: 14px; margin-right: 16px; width: 70px">评价</span>
            <el-form-item prop="evaluatRemark">
              <el-input
                :rows="4"
                v-model="ruleForm.evaluatRemark"
                style="margin-top: 10px"
                :clearable="true"
                type="textarea"
                maxlength="30"
                show-word-limit
                placeholder="请留下您宝贵的评价，30字以内"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="reasonFormVisible = false" size="small">取消</el-button>
        <el-button type="danger" @click="submitEvaluateRemark('ruleForm')" size="small">确定</el-button>
      </div>
    </el-dialog>
    <!--服务项 -->
    <el-dialog :title="`服务项（${serviceItemList.length}）`" :visible.sync="serviceListVisible" width="500px" class="email-dialog" :close-on-click-modal="false">
      <div style="min-height: 400px; max-height: 640px; overflow: auto">
        <div style="padding: 0 40rpx 40rpx; margin-bottom: 20px" class="flex" v-for="item in serviceItemList" :key="item.id">
          <div class="item-title list flex" @click="handReport(item)">
            {{ item.serviceName }}
            <div class="flex">
              <span
                class="status-tip"
                :style="item.workOrderStatus == 1 ? 'background:#008888' : item.workOrderStatus == 0 || item.workOrderStatus == 2 ? 'background:#dd0000' : 'background:#dd0000'"
              ></span
              >{{ item.workOrderStatusName }}
              <i class="el-icon-arrow-right" />
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 添加服务项 -->
    <el-dialog :visible.sync="addWorkorderVisibled" class="service-dialog" title="选择服务类型" :show-close="false" width="30%" @close="clearHandleSelectServiceType">
      <el-form :model="serviceTypeForm" :rules="serviceTypeRule" ref="serviceTypeForm" label-position="120px" :inline="true">
        <el-row>
          <el-col span="24">
            <el-form-item label="服务类型" prop="serviceType" required v-if="addWorkorderVisibled">
              <el-cascader
                style="z-index:2011"
                popper-class="sel-servicetype-box"
                ref="cascaderAddr"
                clearable
                :key="cascaderAddrt"
                v-model="serviceTypeForm.serviceType"
                :options="typeList"
                :props="industruPropsSelect"
                :show-all-levels="false"
                filterable
                size="small"
                collapse-tags
                @change="handleSelectServiceType"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="margin-top: -20px">
        <el-button type="danger" plain @click="addWorkorderVisibled = false" size="small">取消</el-button>
        <el-button type="danger" @click="sureAddWorkOrder('serviceTypeForm')" size="small">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分配弹框 -->
    <el-dialog :title="personTitle" ref="executePersonDialog" :visible.sync="executePersonNameVisiable" width="40%" class="create-task radio-table">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
        <div style="font-family: MicrosoftYaHei-Bold; font-size: 16px; line-height: 14px; color: #000;display:flex;flex-wrap:nowrap;align-items:center">
          <span style="width: 8px; height: 8px; display: inline-block; border-radius: 50%; background: #dd0000; margin-right: 12px"></span>
          <div v-html="initTemplateContent(detailData)" style="display:flex" @click="e => clickRoleType(e)"></div>
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
              <el-radio v-model="distributionPersonId" :label="scope.row.userId"><i></i></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="userName" min-width="20%" label="姓名"> </el-table-column>
          <el-table-column prop="roleName" min-width="18%" label="角色">
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
        <el-button type="danger" plain @click="cancelDistribution" size="small">取消</el-button>
        <el-button type="danger" @click="submitDistribution()" size="small" v-gio.click="selectExecutor">分配</el-button>
      </div>
    </el-dialog>
    <el-dialog class="closeWorkOrder" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="dialogFlag" title="编辑" top="100px" :show-close="false" width="50%">
      <el-form :model="questionForm" :rules="applyOrderRules" ref="questionForm" label-position="top" style="max-height: 500px;overflow-y: auto;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户" v-if="userInfo.userType != 2" prop="customerId">
              <el-select
                v-if="!((detailData.serviceApplyType == 1 || detailData.serviceApplyType == 3) && (detailData.serviceApplyStatus == 1 || detailData.serviceApplyStatus == 0))"
                size="small"
                clearable
                :disabled="true"
                class="dialog"
                style="width: 80%"
                filterable
                v-model="questionForm.customerId"
                @clear="clearPeopleList"
              >
                <el-option
                  @click.native="getCompanyPeople(item.companyNumber, item.companyId)"
                  v-for="item in companyList"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                ></el-option>
              </el-select>
              <div v-else>{{ detailData.customerCompanyName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="userInfo.userType != 2 && (hasDistributeBtn || executePermissionFlag)" class="">
              <span slot="label"><span style="color:#F56C6C;margin-right:4px" v-if="hasDistributeBtn">*</span>执行人</span>
              <div
                class="select_person form-item-outline"
                @click="editDistributionDialog"
                v-if="
                  detailData.serviceApplyStatus < 3 &&
                    hasDistributeBtn &&
                    ((detailData.buttonFlag && userInfo.userType == 1) || (userInfo.userType == 0))
                "
              >
                <span v-if="userInfo.userType != 2 && showRoleNames"></span>
                <span v-if="executeUserName">{{ executeUserName }}（{{ executeUserRoles }}）</span>
                <span v-else>请选择</span>
              </div>
              <div
                class="select_person form-item-outline"
                v-if="
                  !(
                    detailData.serviceApplyStatus < 3 &&
                    hasDistributeBtn &&
                    ((detailData.buttonFlag && userInfo.userType == 1) || (userInfo.userType == 0))
                  )
                "
              >
                <span v-if="userInfo.userType != 2 && showRoleNames"></span>
                <span v-if="executeUserName">{{ executeUserName }}（{{ executeUserRoles }}）</span>
                <span v-else>请选择</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" v-if="userInfo.userType < 2">
            <el-form-item label="服务创盈" prop="serviceProperty">
              <span slot="label"><span style="color: #f56c6c; margin-right: 4px">*</span>服务创盈</span>
              <el-select size="small" clearable placeholder-style="color:#e2e2e2;" style="width: 80%;" filterable @change="servicePropertyChange" v-model="applylist.serviceProperty">
                <el-option v-for="item in serviceIncomeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="applylist.serviceProperty && userInfo.userType < 2">
            <el-form-item>
              <span slot="label"><span style="color: #f56c6c; margin-right: 4px">*</span>预估收益</span>
              <el-col :span="24" class="select-input" v-if="showIncomeBbl">
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
              </el-col>
              <el-col :span="24" class="select-input" v-if="showIncomeRmb">
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
              </el-col>
            </el-form-item>
          </el-col>
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
        <UplaodSection ref="uploadVideoImg" :revert="true" :revertImg="revertImg" :revertVideoHalfPath="detailData.videoUrl" :revertVideo="revertVideo" :loadingRevert="loading" />
      </el-form>
      <div slot="footer" style="margin-top: -20px">
        <el-button type="danger" plain @click="handleResetAdd('questionForm')" size="small">取消</el-button>
        <el-button type="danger" @click="sureAddWork('questionForm')" size="small">确定</el-button>
      </div>
    </el-dialog>
    <!-- 无法取消 -->
    <el-dialog title="无法取消" :visible.sync="noCancelFlag" width="30%" :before-close="handleClose">
      <span>该申请单有关联未关闭工单，请关闭工单。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noCancelFlag = false" size="small" plain>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 处理异常 -->
    <el-dialog title="处理异常" :visible.sync="abnormalDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <span>关联异常ID：</span>
      <div class="abnormal-content">
        <div v-for="(item, index) in detailData.relationAbnormals" :key="index">
          <el-link style="color: rgb(0, 20, 80)" @click="handleAbnormal(item)">{{ item.abnormalNo }}</el-link>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="abnormalDialog = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 无法取消 -->
    <el-dialog title="无法取消" :visible.sync="noCancelFlag" width="30%" :before-close="handleClose">
      <span>该申请单有关联未关闭工单，请关闭工单。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noCancelFlag = false" size="small" plain>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 处理异常 -->
    <el-dialog title="处理异常" :visible.sync="abnormalDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <span>关联异常ID：</span>
      <div class="abnormal-content">
        <div v-for="(item, index) in detailData.relationAbnormals" :key="index">
          <el-link style="color: rgb(0, 20, 80)" @click="handleAbnormal(item)">{{ item.abnormalNo }}</el-link>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="abnormalDialog = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="videoDialogVisible" width="50%" @close="closeVideo">
      <video ref="videoPlayer" style="width: 100%" controls :src="detailData.videoFullUrl" />
    </el-dialog>
    <!-- 新建换油咨询工单   选择换油情况 -->
    <el-dialog title="请选择换油情况" class="closeWorkOrder" :visible="dialogOilChangeVisible" :show-close="false" width="30%">
      <el-form :model="ruleForm" :rules="closerules" ref="ruleForm" label-width="100px" label-position="top">
        <div class="radioGroup" style="margin-top:20px;border:1px solid #e9e9e9;border-bottom:none">
          <!-- 多选 -->
          <el-checkbox-group v-model="valueCheckBoxList" @change="selectId => changebox(selectId)" style="display: inline-block;">
            <el-checkbox style="height:50px;line-height:30px;" v-for="btn in oilChangefieldOption" :label="btn.type" :key="btn.type">{{ btn.desc }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="notice-text" v-if="resultBox">
          <img src="../../assets/notice-icon.png" alt="" style="margin-right:8px;" />
          请预先咨询美孚工程师
        </div>
      </el-form>
      <div slot="footer" style="margin-top: 20px">
        <el-button type="danger" plain @click="consoleOilChange('ruleForm')" size="small">取消</el-button>
        <el-button type="danger" @click="confirmContiun('ruleForm')" size="small">确认继续</el-button>
      </div>
    </el-dialog>
    <!-- 异常详情 -->
    <AbnormalDraw :openDrawFlag="openDrawFlag" :abnormalStatus="abnormalStatus" :id="abnormalId" v-on:refreshList="refreshList" v-on:closeDraw="closeDraw"></AbnormalDraw>
    <ServiceSuggestion :renderList="servcieSuggestionRenderList" ref="serviceSuggestion" />
    <WorkerOrderPromote
      :promoteDialogVisible="promote_dialogVisible"
      @promoteCloseDialog="promote_closeDialog"
      :orderType="'applyOrder'"
      :serviceId="detailData.id"
      :serviceApplyNo="detailData.serviceApplyNo"
      :callback="() => this.getApplyOrderDetail(this.$route.query.id)"
    />
    <el-dialog title="服务条款" :visible.sync="dialogCheckedVisible" width="30%" :before-close="handleClose">
      <span>我已阅读并同意条款</span><span @click="seenNotice" style="color: #fe000c; text-decoration: underline; cursor: pointer">查看条款明细</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckedVisible = false" size="small">取 消</el-button>
        <el-button type="danger" size="small" @click="confirmChecked">同 意</el-button>
      </span>
    </el-dialog>
    <el-dialog title="免责条款" :visible.sync="dialogVisibleHint" width="30%" class="create-task" :before-close="handleClose">
      <div v-html="serviceClause">{{ serviceClause }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="submitAddWorkorder">我已知晓</el-button>
      </span>
    </el-dialog>
    <!-- 关联工单 -->
    <ContactWorkorder
      v-if="contactWorkorderDialogFlag"
      :contactWorkorderDialogFlag="contactWorkorderDialogFlag"
      :dialogType="contactDailogType"
      :planList="planList"
      :companyIds="detailData.customerId"
      :serviceApplyOrderId="detailData.id"
      :serviceApplyStatus="detailData.serviceApplyStatus"
      :spId="detailData.distributorId"
      @handleSubmitBack="handleSubmitBack"
    />
  </div>
</template>

<script>
import Apply from "./components/apply";
import ServiceSuggestion from "./components/serviceDialog.vue";
import AbnormalDraw from "../spotInspection/abnormalRecord/abnormalDetail";
import UplaodSection from "./components/uploadVideoImg.vue";
import Promote from "../newWorkerOrderAndServiceApplyPromote/workerOrder_promote.js";
import detail from "./applyMixins/detail.js";
import DAModify from "../newWorkOrder/mixins/DAModify";
import serviceIncome from "@/components/newWorkOrder/components/serviceIncome";
import ContactWorkorder from "../pes/component/contactWorkorder.vue";
export default {
  mixins: [Promote, DAModify, detail],
  name: "EquipmentLubrTable",
  components: {
    ContactWorkorder,
    serviceIncome,
    Apply,
    AbnormalDraw,
    ServiceSuggestion,
    UplaodSection,
    WorkerOrderPromote: () => import("../newWorkerOrderAndServiceApplyPromote/workerOrder_promote.vue")
  },
  data() {
    return {
      contactDailogType: "apply",
      contactWorkorderDialogFlag: false,
      activeQuestion: "",
      serviceClause: "",
      dialogVisibleHint: false,
      dialogCheckedVisible: false,
      checkboxList: [], // 选中的问题的children
      incomeBblUnit: "BBL",
      incomeRmbUnit: "RMB",
      showIncomeBbl: false,
      showIncomeRmb: false,
      serviceIncomeList: [
        {
          label: "维护现有生意",
          value: "1"
        },
        {
          label: "油品升级",
          value: "2"
        },
        {
          label: "竞品转换",
          value: "3"
        },
        {
          label: "服务收费",
          value: "4"
        },
        {
          label: "支持新项目生意",
          value: "5"
        }
      ],
      workshopId: "",
      lubricationPointNumber: "",
      formPage: "",
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      src1: require("../../assets/xingxing_1.png"),
      src2: require("../../assets/xingxing.png"),
      hasDistributeBtn: false, // 是否有分配权限
      executePermissionFlag: false, //是否有执行权限
      serviceItemKey:1,
      refreshBtnKey:2
      // showCreateCaseBtn: false
    };
  },
  created() {
    if (this.userInfo.userType == 2) {
      this.selCompnyPeopleList.push(this.userInfo);
    }
    let buttonpermsStr = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let item of buttonpermsStr) {
      if (item.menuCode == "service_order_distribution_btn") {
        this.hasDistributeBtn = true;
      }
      if (item.menuCode == "service_order_execute_btn") {
        this.executePermissionFlag = true;
      }
    }
    this.userInfo.accessTemplateNames.forEach(item => {
      if (item.roleCode == "customer_admin") {
        this.isCustomerAdmin = true;
      }
    });
  },
  async mounted() {
    this.getApplyReasonConfTree();
    this.getApplyOrderDetail(this.$route.query.id); // 获取详情信息
    if (this.$route.query.formPage && this.$route.query.formPage == "equipmentDetail") {
      this.formPage = this.$route.query.formPage;
      this.workshopId = this.$route.query.workshopId;
      this.lubricationPointNumber = this.$route.query.lubricationPointNumber;
    }
  },
  methods: {
    handleSubmitBack() {
      this.getApplyOrderDetail(this.$route.query.id); // 获取详情信息
    },
    relateWorkorder() {
      this.contactWorkorderDialogFlag = true;
    },
    // 提报优秀案例
    createCase() {
      // 查询当月案例
      this.requestMethodGet("/emEcReport/queryNowMonthBySpId", { spId: this.detailData.distributorId }).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data < 5) {
            this.$confirm("确认提报该工单为优秀案例？", "提示", {
              confirmButtonText: "确认提报",
              cancelButtonText: "暂时不提报"
            })
              .then(() => {
                const fromPageType = "service";
                if (this.detailData.reportId) {
                  this.$router.push({
                    path: "/distributorCaseIndex/Create",
                    query: {
                      caseId: this.detailData.reportId,
                      createType: "edit",
                      fromPageType: fromPageType
                    }
                  });
                } else {
                  this.$router.push({
                    path: "/distributorCaseIndex/Create",
                    query: {
                      distributorCompanyId: this.detailData.distributorId,
                      distributorCompanyName: this.detailData.distributorCompanyName,
                      distributorCompanyType: this.detailData.distributorCompanyType,
                      customerName: this.detailData.customerCompanyName,
                      customerCompanyNumber: this.detailData.customerCompanyNumber,
                      companyId: this.detailData.customerId,
                      createUserName: this.userInfo.userName,
                      createUserId: this.userInfo.userId,
                      createUserNumber: this.userInfo.userNumber,
                      serviceOrderId: this.detailData.id,
                      fromPageType: fromPageType,
                      createType: "add"
                    }
                  });
                }
              })
              .catch(() => {});
          } else {
            this.$confirm("每月最多提报5个案例，当前月份的额度已用完，请下月再提报。", "提示", {
              confirmButtonText: "知道了",
              showCancelButton: false,
              confirmButtonClass: "case-confirm"
            })
              .then(() => {})
              .catch(() => {});
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 撤回优秀案例
    revocationCase() {
      this.$confirm("确认撤回该申请单的优秀案例？", "提示", {
        confirmButtonText: "确认撤回",
        cancelButtonText: "取消"
      })
        .then(() => {
          // 执行撤回操作
          const params = {
            id: this.detailData.reportId,
            reportStatus: 2
          };
          this.requestMethodPost("/emEcReport/updateStatus", params).then(res => {
            if (res.data.code == 1000) {
              this.getApplyOrderDetail(this.$route.query.id);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
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
          caseId: this.detailData.reportId,
          type: "distributor"
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
    // 我已知晓，同意条款和条件
    submitAddWorkorder() {
      this.dialogVisibleHint = false;
    },
    //   同意条款
    seenNotice() {
      this.dialogVisibleHint = true;
    },

    getHintCont() {
      let params = {
        valetOrderType: 0,
        customerCompanyNumber: ""
      };
      if (this.userInfo.userType < 2) {
        params.valetOrderType = 1; // 代客下单
        params.customerCompanyNumber = this.detailData.customerCompanyNumber; // 客户编码
      }
      let url = "/weChat/clause/getServiceClause";
      this.requestMethodGet(url, params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.serviceClause = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getHintContOil() {
      let params = {};
      let url = "/web/clause/getClause";
      this.requestMethodGet(url, params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.serviceClause = res.data.content;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    }
  }
};
</script>

<style lang="less" scoped>
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
.service-apply-detail {
  height: 100%;
  font-size: 14px;
  position: relative;
  .service-name-form {
    box-sizing: border-box;
  }
  .status-title {
    font-weight: 500;
    font-size: 20px;
    line-height: 30px;
    color: #dd0000;
    display: flex;
    align-content: center;
    margin-bottom: 10px;
    .img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
  .status-progress {
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #303133;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  .status-title-desc {
    font-size: 14px;
    color: #c0c4cc;
    line-height: 22px;
    margin-bottom: 20px;
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
  .level-point {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #d9ecff;
    &::after {
      content: "";
      width: 4px;
      height: 4px;
      display: block;
      background: #fff;
      border-radius: 50%;
      margin: 4px;
    }
  }
  .first-point {
    color: #008888;
    margin-left: -2px;
  }
  /deep/.closeWorkOrder {
    // z-index: 99999 !important;
    .notice-title {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      line-height: 14px;
      margin: 10px 0 10px;
      color: #666;
    }
    .notice-text {
      font-size: 12px;
      line-height: 12px;
      margin: 20px 0 10px;
      color: #ff9900;
      display: flex;
      align-items: center;
    }
  }
  // /deep/ .el-dialog__wrapper.closeWorkOrder {
  //   z-index: 2045 !important;
  // }
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
  .item-title {
    height: 60px;
    line-height: 60px;
    padding: 0 40px;
    font-size: 14px;
    border-radius: 4px;
    flex: 1;
    cursor: pointer;
  }
  .item-service {
    height: 24px;
    line-height: 24px;
    padding: 0 8px;
    background: rgba(0, 0, 0, 0.05);
  }
  .list {
    border: 1px solid #e4e7ed;
    box-sizing: border-box;
    padding: 0 30px;
  }
  .select_person {
    width: 80%;
    height: 36px;
    line-height: 36px;
    padding-left: 20px;
  }
  .status-tip {
    width: 8px;
    height: 8px;
    display: block;
    background: #008888;
    border-radius: 50%;
    margin-right: 4px;
  }
  .service-list {
    border: 1px solid #e4e7ed;
    padding: 20px;
    height: 100px;
    box-sizing: border-box;
    flex-grow: 1;
    border-radius: 4px;
    .service-item {
      display: flex;
      flex: 1;
      justify-content: space-between;
      flex-direction: column;
    }
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /deep/.el-form-item__label {
    color: #999;
  }
  .label {
    margin-right: 30px;
    margin-bottom: 0px;
  }
  /deep/.box-card .el-card__header {
    background: rgba(204, 221, 255, 0.2);
  }
  /deep/.box-card .detail-btn:hover {
    color: #001450 !important;
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
.content {
  font-size: 14px;
  color: #909399;
  line-height: 22px;
}
.form-item-outline :hover {
  border-color: #e43333;
}
.form-item-outline {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  box-sizing: border-box;
}
.look-process {
  .title {
    font-weight: bold;
    color: #000;
  }

  .el-timeline-item__node--large {
    width: 20px;
    height: 20px;
    left: -5px;
    top: -3px;
  }
}
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
.deletBtn {
  /deep/.el-button--primary {
    background-color: #fe000c !important;
    border-color: #fe000c !important;
  }
  /deep/.el-message-box__container {
    position: relative;
  }
  /deep/.el-icon-warning {
    color: #fe000c !important;
    /* top: 1px !important; */
  }
}
/deep/ .dialog .el-input--small .el-input__inner {
  height: 40px !important;
  line-height: 40px !important;
  background: #f9f9f9 !important;
}
/deep/ .dialog-contact .el-input--small .el-input__inner {
  height: 80px !important;
  line-height: 80px !important;
  background: #f9f9f9 !important;
}
/deep/ .dialog input::-webkit-input-placeholder {
  color: #333;
}
/deep/ .dialog-contact input::-webkit-input-placeholder {
  color: #333;
}
/deep/.radio-table .el-table::before {
  height: 0px !important;
}
/deep/.create-task .el-dialog__title,
.edit-workOrder .el-dialog__title {
  font-size: 18px !important;
}
/deep/.create-task .el-dialog__body,
.edit-workOrder .el-dialog__body {
  padding: 0 20px 40px !important;
}
</style>
<style lang="less">
.sel-servicetype-box {
  .el-scrollbar:first-child .el-checkbox {
    display: none !important;
  }
  .el-scrollbar:nth-child(2) .el-checkbox {
    display: none !important;
  }
}
.service-apply-detail .closeWorkOrder {
  .el-dialog__body {
    padding: 10px 20px 20px 40px;
  }
  /deep/ .el-dialog__body {
    padding: 40px;
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
  .el-dialog__header {
    padding: 20px 20px 10px;
  }
  .el-checkbox__label {
    display: inline-grid;
    white-space: pre-line;
    word-wrap: break-word;
    overflow: hidden;
    line-height: 20px;
  }
}
</style>
