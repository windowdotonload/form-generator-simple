<!--
* @description  查看设备档案
* @author vvx
* @date 2020/04/145 16:57:26
* @version V1.0.0
!-->
<template>
  <div style="position: relative">
    <div class="return-btn" style="position: absolute; right: 20px; height: 55px; line-height: 55px; top: -70px; color: red; cursor: pointer">
      <el-button type="danger" size="small" @click="manageCard" :loading="isloadingCard">查看设备铭牌</el-button>
      <el-button type="text" style="color: #333; font-size: 15px; padding: 0px" @click="showDialog">
        <i class="el-icon-warning" style="display: flex;height: 30px;align-items: center;"></i>
      </el-button>
      <el-button type="danger" size="small" @click="editGroup" v-if="editGroupBtn">编辑分组</el-button>
      <el-button type="danger" plain size="small" @click="editEpt" v-has="PC_Device_edit">编辑</el-button>
      <el-button size="small" @click="deleteEpt">删除</el-button>
    </div>
    <el-divider></el-divider>
    <div class="equipment-profile-detail apply-order-component" :style="mainminheight">
      <!-- 设备图片 -->
      <div class="company-content">
        <img class="company-img" :src="epInfo.devicePicPath || defaultImg" alt="" />
        <div class="company-title-info">
          <div class="company-info">
            <div style="font-size: 20px; color: #000; line-height: 25px; font-weight: bold">{{ epInfo.deviceName }}</div>
            <div style="height: 10px"></div>
            <div style="display: flex; align-items: center">
              <span class="ept-status" v-if="epInfo.dataIntegrityFlag == '1' && !epInfo.editNew" style="color: #666; backgroundcolor: rgba(0, 0, 0, 0.05)">已完善</span>
              <span class="ept-status" v-if="epInfo.dataIntegrityFlag == '0'" style="color: #dd0000; backgroundcolor: rgba(221, 0, 0, 0.08)">待完善</span>
              <span
                class="ept-status"
                v-if="epInfo.creatNew && epInfo.editNew && epInfo.dataIntegrityFlag != 0 && epInfo.updateTimeMills == epInfo.createTimeMills"
                style="color: rgb(0, 136, 136); backgroundcolor: rgba(0, 136, 136, 0.1)"
                >新创建</span
              >
              <span
                class="ept-status"
                v-if="((epInfo.editNew && epInfo.creatNew) || epInfo.editNew) && epInfo.dataIntegrityFlag != 0 && epInfo.updateTimeMills != epInfo.createTimeMills"
                style="rgb(153,153,153);backgroundColor:rgba(0,0,0,0.05)"
                >刚修改</span
              >
              <span class="ept-status" v-if="!epInfo.deviceActiveStatus" style="rgb(153,153,153);backgroundColor:rgba(0,0,0,0.05);margin-left:8px;">非活跃</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 设备信息 -->
      <div style="background-color: #f9f9f9; border-radius: 6px; padding: 30px 0 0 30px; margin-top: 20px">
        <el-form ref="epInfo" :model="epInfo" label-width="80px" label-position="left">
          <el-row :gutter="20">
            <el-col :span="6" style="height:70px;">
              <el-form-item label="所属客户">
                <div style="display:flex;align-items:center">
                  <el-tooltip class="item" effect="dark" :content="epInfo.companyName" placement="top-start">
                    <div class="no-wrap-eq" @click="toCustomerDetail(epInfo)">{{ epInfo.companyName || "暂无" }}</div>
                  </el-tooltip>
                  <i class="el-icon-arrow-right"></i>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="6" style="height:70px;">
              <el-form-item label="所属车间">
                <span>{{ epInfo.workshopName }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="6" style="height:70px;">
              <el-form-item label="卡牌ID">
                <span>{{ epInfo.cardNumber || "暂无" }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="6" style="height:70px;">
              <el-form-item label="设备名称">
                <el-tooltip class="item" effect="dark" :content="epInfo.deviceName" placement="top-start" v-if="epInfo.deviceName">
                  <div class="no-wrap-eq">{{ epInfo.deviceName || "暂无" }}</div>
                </el-tooltip>
                <span v-else>暂无</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="6" style="height:70px;">
              <el-form-item label="设备类型">
                <el-tooltip class="item" effect="dark" :content="epInfo.deviceType == 'device_0747' ? epInfo.deviceTypeName + '-' + epInfo.otherDeviceTypeName : epInfo.deviceTypeName" placement="top">
                  <span v-if="epInfo.deviceType != 'device_0747'">{{ epInfo.deviceTypeName || "暂无" }}</span>
                  <span v-if="epInfo.deviceType == 'device_0747'">{{ epInfo.deviceTypeName }}-{{ epInfo.otherDeviceTypeName }}</span>
                </el-tooltip>
              </el-form-item>
            </el-col>

            <el-col :span="6" style="height:70px;">
              <el-form-item label="设备型号">
                <el-tooltip class="item" effect="dark" :content="epInfo.deviceModel" placement="top" v-if="epInfo.deviceModel">
                  <div class="no-wrap-eq">{{ epInfo.deviceModel }}</div>
                </el-tooltip>
                <span v-else>暂无</span>
              </el-form-item>
            </el-col>

            <el-col :span="6" style="height:70px;">
              <el-form-item label="制造商">
                <el-tooltip class="item" effect="dark" :content="epInfo.manufacturer" placement="top" v-if="epInfo.manufacturer">
                  <div class="no-wrap-eq">{{ epInfo.manufacturer }}</div>
                </el-tooltip>
                <span v-else>暂无</span>
              </el-form-item>
            </el-col>

            <el-col :span="6" style="height:70px;">
              <el-form-item label="创建时间">
                <span>{{ epInfo.createTime || "暂无" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="height:70px;">
              <el-form-item label="设备编码">
                <el-tooltip class="item" effect="dark" :content="epInfo.deviceCode" placement="top" v-if="epInfo.deviceCode">
                  <div class="no-wrap-eq">{{ epInfo.deviceCode }}</div>
                </el-tooltip>
                <span v-else>暂无</span>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="height:70px;">
              <el-form-item label="设备位置">
                <el-tooltip class="item" effect="dark" :content="epInfo.devicePosition" placement="top" v-if="epInfo.devicePosition">
                  <div class="no-wrap-eq">{{ epInfo.devicePosition }}</div>
                </el-tooltip>
                <span v-else>暂无</span>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="height:70px;">
              <el-form-item label="设备分组">
                <span>{{ epInfo.deviceGroupName || "暂无分组" }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 20px; padding-bottom: 80px">
        <el-tab-pane label="润滑点" name="first">
          <!-- 润滑点信息 -->
          <div class="lup-info" style="margin-top: 15px">
            <div class="lup-left">
              <div class="content-title left-padding">润滑点列表</div>
              <div style="margin: 16px 0" class="left-padding">
                <el-button style="width: 100%" type="danger" plain size="small" @click="addLup" v-has="EPAddBtn">添加润滑点</el-button>
              </div>
              <!-- 润滑点列表 -->
              <div style="border-top: 1px solid #e9e9e9">
                <ul style="list-style: none; display: contents" v-if="menus && menus.length > 0">
                  <li v-for="item in menus" :key="item.lubricationPointNumber" class="lup-li" @click="clickLupItem(item.id)" :style="{ backgroundColor: item.isActive ? '#f9f9f9' : '#fff' }">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.lubricationPointName ? item.lubricationPointName + '-' + item.lubricationPointType : item.lubricationPointType"
                      placement="top"
                    >
                      <div class="lup-name" :style="{ color: item.isActive ? '#001450' : '#333' }">
                        {{ item.lubricationPointName ? item.lubricationPointName + "-" + item.lubricationPointType : item.lubricationPointType }}
                      </div>
                    </el-tooltip>
                  </li>
                </ul>
                <span v-else style="font-size:14px;color:#999;display: flex;align-items: center;justify-content: center;margin-top: 18px;">暂无润滑点</span>
              </div>
            </div>
            <div class="lup-right">
              <div v-if="menus && menus.length">
                <div class="content-title" style="display: flex; justify-content: space-between">
                  <span>润滑点详情</span>
                  <div>
                    <el-button plain size="small" @click="checkLubricationPoint">删除</el-button>
                    <el-button type="danger" v-has="PC_Device_CreateWorkOrder" v-if="userInfo.userType < 2" plain size="small" @click="createWorkOrder">创建服务申请</el-button>
                    <el-button
                      type="danger"
                      v-if="userInfo.userType == 2"
                      plain
                      size="small"
                      @click="createWorkOrder"
                      v-auth="{
                        menuCodes: 'PC_Device_CreateWorkOrder',
                        strategyNames: ['assetGroup'],
                        strategySource: {
                          assetGroup: epInfo.spId
                        },
                        matchKey: {
                          assetGroup: 'spId'
                        }
                      }"
                      >创建服务申请</el-button
                    >
                    <!-- <el-dropdown v-if="userInfo.userType == 2" @command="handleCommand" size="small" split-button trigger="click">
                      下单
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a">创建服务申请</el-dropdown-item>
                        <el-dropdown-item command="b">自助下单</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown> -->
                    <el-button type="danger" plain size="small" @click="editLup">编辑</el-button>
                  </div>
                </div>
                <el-row :gutter="24">
                  <!-- 图片名称 -->
                  <el-col :span="24">
                    <div style="display: flex; margin-top: 24px">
                      <div style="width: 45px">
                        <div class="none-img" v-if="!selectLubricatePointData.lubricationPointPicPath">暂无</div>
                        <div v-else>
                          <img :src="selectLubricatePointData.lubricationPointPicPath" class="has-img" />
                        </div>
                      </div>
                      <el-row :gutter="24" style="width: 100%">
                        <el-col :span="screenWidth > 1600 ? '6' : '8'">
                          <div style="display: flex; flex-direction: column; margin-left: 20px">
                            <div class="title-lup">润滑点设备类型</div>
                            <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.lubricationPointType" placement="top">
                              <span class="type-name" style="font-weight: bold">{{ selectLubricatePointData.lubricationPointType }}</span>
                            </el-tooltip>
                          </div>
                        </el-col>
                        <el-col :span="14">
                          <div style="display: flex; flex-direction: column; margin-left: 20px">
                            <div class="title-lup">润滑点设备名称</div>
                            <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.lubricationPointName" placement="top">
                              <span class="type-name">{{ selectLubricatePointData.lubricationPointName || "暂无" }}</span>
                            </el-tooltip>
                          </div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
                <!-- 详情表单 -->
                <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px 20px; margin-top: 20px">
                  <el-form ref="selectLubricatePointData" :model="selectLubricatePointData" label-width="170px" label-position="left">
                    <el-row class="formStyle" :gutter="20" style="margin-left:0px;">
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="设备制造商推荐油品" class="form_item_height">
                          <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.recommendOilName" placement="top" v-if="selectLubricatePointData.recommendOilName">
                            <div class="no-wrap-eq">{{ selectLubricatePointData.recommendOilName }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="在用油品牌" class="form_item_height">
                          <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.oilBrandName" placement="top" v-if="selectLubricatePointData.oilBrandName">
                            <div class="no-wrap-eq">{{ selectLubricatePointData.oilBrandName }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="在用油品名称" class="form_item_height">
                          <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.currentOilName" placement="top" v-if="selectLubricatePointData.currentOilName">
                            <div class="no-wrap-eq">{{ selectLubricatePointData.currentOilName }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="润滑点设备制造商名称" class="form_item_height">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="selectLubricatePointData.lubricationPointManufacturer"
                            placement="top"
                            v-if="selectLubricatePointData.lubricationPointManufacturer"
                          >
                            <div class="no-wrap-eq">{{ selectLubricatePointData.lubricationPointManufacturer }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="润滑方式" class="form_item_height">
                          <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.lubricationMethodName" placement="top" v-if="selectLubricatePointData.lubricationMethodName">
                            <div class="no-wrap-eq">{{ selectLubricatePointData.lubricationMethodName }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="油箱容量" class="form_item_height">
                          <span>{{ selectLubricatePointData.oilBoxCapacity || "暂无" }}</span>
                          <span v-if="selectLubricatePointData.oilBoxCapacity">{{ selectLubricatePointData.oilBoxCapacityUnit || "暂无" }}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="20" style="margin-left:0px;">
                      <el-col :span="24" style="padding: 0">
                        <el-form-item label="描述" class="form_item_height">
                          <div class="break-all" style="overflow: hidden; white-space: normal; margin-right: 20px">{{ selectLubricatePointData.lubricationPointDesc || "暂无" }}</div>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- 如果 是脂类润滑点 -->
                    <el-row :gutter="20" style="border-top: 1px solid #e9e9e9; padding: 20px 0px;margin:0px" v-if="selectLubricatePointData.oilType == 2">
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="加脂周期" class="form_item_height" label-width="180px">
                          <span>{{ selectLubricatePointData.oilAddPeriod || "暂无" }}</span>
                          <span v-if="selectLubricatePointData.oilAddPeriod">{{
                            selectLubricatePointData.oilAddPeriodUnit == "M"
                              ? "月"
                              : selectLubricatePointData.oilAddPeriodUnit == "Y"
                              ? "年"
                              : selectLubricatePointData.oilAddPeriodUnit == "D"
                              ? "天"
                              : selectLubricatePointData.oilAddPeriodUnit == "KM"
                              ? "公里"
                              : "小时" || "暂无"
                          }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="上次加脂日期" class="form_item_height">
                          <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.lastOilAddDate" placement="top" v-if="selectLubricatePointData.lastOilAddDate">
                            <div class="no-wrap-eq">{{ selectLubricatePointData.lastOilAddDate }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0" v-if="selectLubricatePointData.autoCreateOilAddPlan && selectLubricatePointData.oilAddPeriodUnit != 'KM'">
                        <el-form-item label="预计下次加脂日期" class="form_item_height">
                          <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.nextScheduledOilAddDate" placement="top" v-if="selectLubricatePointData.nextScheduledOilAddDate">
                            <div class="no-wrap-eq">{{ selectLubricatePointData.nextScheduledOilAddDate }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="每次加脂量" class="form_item_height">
                          <span>{{ selectLubricatePointData.everyTimeOilAddQuantity || "暂无" }}</span>
                          <span v-if="selectLubricatePointData.everyTimeOilAddQuantity">{{ selectLubricatePointData.everyTimeOilAddQuantityUnit || "暂无" }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <!-- 每月滑脂添加量 -->
                        <el-form-item label="每月润滑剂添加量" class="form_item_height">
                          <span>{{ selectLubricatePointData.preMonthOilAddQuantity || "暂无" }}</span>
                          <span v-if="selectLubricatePointData.preMonthOilAddQuantity">{{ selectLubricatePointData.preMonthOilAddQuantityUnit || "暂无" }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="报告评级" class="form_item_height">
                          <span>{{ selectLubricatePointData.mslaWorkFlowReportResultLevel || "暂无" }}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- 如果 油类润滑点 -->
                    <el-row :gutter="20" style="border-top: 1px solid #e9e9e9; padding: 20px 0px;margin:0px" v-if="selectLubricatePointData.oilType == 1">
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0" v-if="showOrHideStateFlag == 0">
                        <el-form-item label="定期或按质换油" class="form_item_height">
                          <span>{{ selectLubricatePointData.oilChangeMethod == 1 ? "定期" : "按质" }}</span>
                        </el-form-item>
                      </el-col>
                      <!-- v-if="selectLubricatePointData.oilChangeMethod == 1"  -->
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0" v-if="showOrHideStateFlag == 0">
                        <el-form-item label="换油周期" class="form_item_height">
                          <span>{{ selectLubricatePointData.oilChangePeriod || "暂无" }}</span>
                          <span v-if="selectLubricatePointData.oilChangePeriod">{{
                            selectLubricatePointData.oilChangePeriodUnit == "M"
                              ? "月"
                              : selectLubricatePointData.oilChangePeriodUnit == "Y"
                              ? "年"
                              : selectLubricatePointData.oilChangePeriodUnit == "D"
                              ? "天"
                              : selectLubricatePointData.oilChangePeriodUnit == "KM"
                              ? "公里"
                              : "小时" || "暂无"
                          }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0" v-if="showOrHideStateFlag == 0">
                        <el-form-item label="上次换油日期" class="form_item_height">
                          <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.lastOilChangeDate" placement="top" v-if="selectLubricatePointData.lastOilChangeDate">
                            <div class="no-wrap-eq">{{ selectLubricatePointData.lastOilChangeDate }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <!-- 上次换油日期 按质的话不展示 -->
                      <el-col
                        :span="screenWidth > 1600 ? '6' : '8'"
                        style="padding: 0"
                        v-if="
                          showOrHideStateFlag == 0 &&
                            selectLubricatePointData.oilChangeMethod == 1 &&
                            selectLubricatePointData.autoCreateOilChangePlan &&
                            selectLubricatePointData.oilChangePeriodUnit != 'KM'
                        "
                      >
                        <el-form-item label="预计下次换油日期" class="form_item_height">
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :content="selectLubricatePointData.nextScheduledOilChangeDate"
                            placement="top"
                            v-if="selectLubricatePointData.nextScheduledOilChangeDate"
                          >
                            <div class="no-wrap-eq">{{ selectLubricatePointData.nextScheduledOilChangeDate }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="加油周期" class="form_item_height">
                          <span>{{ selectLubricatePointData.oilAddPeriod || "暂无" }}</span>
                          <span v-if="selectLubricatePointData.oilAddPeriod">{{
                            selectLubricatePointData.oilAddPeriodUnit == "M"
                              ? "月"
                              : selectLubricatePointData.oilAddPeriodUnit == "Y"
                              ? "年"
                              : selectLubricatePointData.oilAddPeriodUnit == "D"
                              ? "天"
                              : selectLubricatePointData.oilAddPeriodUnit == "KM"
                              ? "公里"
                              : "小时" || "暂无"
                          }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="上次加油日期" class="form_item_height">
                          <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.lastOilAddDate" placement="top" v-if="selectLubricatePointData.lastOilAddDate">
                            <div class="no-wrap-eq">{{ selectLubricatePointData.lastOilAddDate }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0" v-if="selectLubricatePointData.oilAddPeriodUnit != 'KM'">
                        <el-form-item label="预计下次加油日期" class="form_item_height">
                          <el-tooltip class="item" effect="dark" :content="selectLubricatePointData.nextScheduledOilAddDate" placement="top" v-if="selectLubricatePointData.nextScheduledOilAddDate">
                            <div class="no-wrap-eq">{{ selectLubricatePointData.nextScheduledOilAddDate }}</div>
                          </el-tooltip>
                          <span v-else>暂无</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="每次加油量" class="form_item_height">
                          <span>{{ selectLubricatePointData.everyTimeOilAddQuantity || "暂无" }}</span>
                          <span v-if="selectLubricatePointData.everyTimeOilAddQuantity">{{ selectLubricatePointData.everyTimeOilAddQuantityUnit || "暂无" }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="每月润滑剂添加量" class="form_item_height">
                          <span>{{ selectLubricatePointData.preMonthOilAddQuantity || "暂无" }}</span>
                          <span v-if="selectLubricatePointData.preMonthOilAddQuantity">{{ selectLubricatePointData.preMonthOilAddQuantityUnit || "暂无" }}</span>
                        </el-form-item>
                      </el-col>
                      <el-col :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                        <el-form-item label="报告评级" class="form_item_height">
                          <span>{{ selectLubricatePointData.mslaWorkFlowReportResultLevel || "暂无" }}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <!-- 如果有设备运行信息 -->
                    <el-row :gutter="20" style="border-top: 1px solid #e9e9e9; padding: 20px 0px;margin:0px" v-if="fields.length >= 1">
                      <div v-for="(item, index) in fields" :key="index">
                        <el-col v-if="item.componentType != '12'" :span="screenWidth > 1600 ? '6' : '8'" style="padding: 0">
                          <el-form-item label="" class="form_item_height" v-if="item.componentType != '8' && item.componentType != '11' && item.componentType != '12'">
                            <span slot="label">{{ item.title }}</span>
                            <span class="break-all" v-if="item.componentType == '2'">{{ item.name || "暂无" }}</span>
                            <span class="break-all" v-else>{{ item.value || "暂无" }}</span>
                          </el-form-item>
                          <!-- 带单位的数据结构 -->
                          <el-form-item label="" class="form_item_height" v-if="item.componentType == '11'">
                            <span slot="label">{{ item.title }}</span>
                            <span v-for="(itemChild, index) in item.componentList['1']" :key="index">
                              <span class="break-all" v-if="itemChild.componentType == 1">
                                {{ itemChild.value || "暂无" }}
                              </span>
                              <span class="break-all" v-if="itemChild.componentType == 2">
                                <span v-if="showFlag && !itemChild.name">暂无</span>
                                <span v-if="showFlag && itemChild.name">{{ itemChild.name }}</span>
                              </span>
                            </span>
                          </el-form-item>
                        </el-col>
                        <!-- 带图片和描述的数据结构 -->
                        <el-col :span="24" style="width:100%" v-if="item.componentType == '12' && !isObjectEmpty(item.componentList)">
                          <div v-for="(valueObj, key, index1) in item.componentList" :key="key">
                            <div v-for="(itemChild, index) in valueObj" :key="index">
                              <el-col :span="screenWidth > 1600 ? '6' : '8'" v-if="itemChild.componentType == 8" style="padding:0px;">
                                <el-form-item label="" class="form_item_height">
                                  <span slot="label">设备工况图片{{ index1 + 1 }}</span>
                                  <img v-if="itemChild.imgFullDtoUrl && itemChild.imgFullDtoUrl.length > 0" :src="itemChild.imgFullDtoUrl[0].url" style="width:120px;height:120px;" alt="" />
                                  <span v-else>暂无图片</span>
                                </el-form-item>
                              </el-col>
                              <el-col :span="screenWidth > 1600 ? '6' : '8'" v-if="itemChild.componentType == 1" style="padding:0px;">
                                <el-form-item label="" class="form_item_height">
                                  <span slot="label">图片{{ index1 + 1 }}描述</span>
                                  <span> {{ itemChild.value || "暂无" }}</span>
                                </el-form-item>
                              </el-col>
                            </div>
                          </div>
                        </el-col>
                      </div>
                    </el-row>
                  </el-form>
                </div>
                <div>
                  <el-tabs v-model="activeNameTab" @tab-click="handleClickTab">
                    <el-tab-pane label="动态" name="dynamic">
                      <!-- 动态内容 -->
                      <div style="margin-top: 32px; margin-bottom: 50px">
                        <el-timeline :reverse="reverse">
                          <el-timeline-item v-for="(item, index) in countData" :key="index" :timestamp="item.dynamicTitle" color="#ccddff" size="large" placement="top">
                            <el-row :gutter="20">
                              <el-col :span="12">
                                <div>
                                  <span @click="handleWorkOrder(item)" style="color: #001450; font-size: 13px; cursor: pointer">#{{ item.trendsLabel }}</span
                                  ><span style="margin-left: 10px; font-size: 13px; color: #666">{{ item.trendsContent }}</span>
                                  <div v-if="item.attachmentList && item.attachmentList.length > 0">
                                    <el-image
                                      v-for="(img, idx) in item.attachmentList"
                                      :key="idx"
                                      style="width: 64px; height: 64px; border-radius: 6px; margin: 24px 10px 24px 0; cursor: pointer"
                                      :src="img.attachmentUrl"
                                      @click="viewPic(img.attachmentUrl)"
                                    >
                                    </el-image>
                                  </div>
                                </div>
                              </el-col>
                              <el-col :span="12" align="right">
                                <span style="font-size: 13px; color: #999">{{ item.trendsTitle }}</span>
                              </el-col>
                            </el-row>
                          </el-timeline-item>
                        </el-timeline>
                        <div class="notice-loading" v-if="countData.length < countTrends" @click="loadMore">点击加载更多</div>
                        <div class="notice-loading" v-else>没有更多了</div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="修改历史" name="second">
                      <div style="margin-top:20px;display: flex;justify-content: space-between;">
                        <div>
                          <el-select
                            size="small"
                            filterable
                            style="width: 220px; margin: 0 0px 20px 0px"
                            v-model="searchFormLog.fieldCode"
                            placeholder="请选择修改字段名称"
                            @change="handleSearchLogData"
                            clearable
                          >
                            <el-option v-for="item in fieldNamesData" :key="item.fieldCode" :label="item.fieldName" :value="item.fieldCode"></el-option>
                          </el-select>
                          <el-date-picker
                            v-model="searchFormLog.time"
                            type="daterange"
                            clearable
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            style="width: 220px; margin: 0 0px 20px 20px"
                            size="small"
                            @change="handleSearchLogData"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          >
                          </el-date-picker>
                        </div>
                        <div>
                          <el-button size="small" @click="handleResetHistory">重置</el-button>
                          <el-button size="small" @click="exportLog" v-has="lpm - history - exportlog">导出</el-button>
                        </div>
                      </div>
                      <!-- 表格 -->
                      <div style="position:relative;flex:1;height:100%">
                        <div class="table-wrap">
                          <el-table
                            style="width:100%;overflow-y:scroll;"
                            :data="updateLogData"
                            tooltip-effect="dark"
                            v-loading="loadingLog"
                            v-el-table-infinite-scroll="loadMoreDataLog"
                            height="400px"
                          >
                            <el-table-column prop="createTime" min-width="5%" label="修改时间" show-overflow-tooltip> </el-table-column>
                            <el-table-column prop="createUser" min-width="5%" label="操作人员" show-overflow-tooltip> </el-table-column>
                            <el-table-column prop="companyName" min-width="10%" label="公司" show-overflow-tooltip> </el-table-column>
                            <el-table-column prop="fieldName" min-width="15%" label="修改字段" show-overflow-tooltip> </el-table-column>
                            <el-table-column min-width="5%" label="操作">
                              <template slot-scope="scope">
                                <span style="color: #001450; cursor: pointer" @click="handleLookDetail(scope.row, '')">详情</span>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
              <div v-else style="display: flex;align-items: center;justify-content: center;flex-direction: column;">
                <img src="../../assets/no_lup.png" alt="" />
                <div style="font-size:14px;color:#999;">暂无润滑点详情</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- 异常记录 -->
        <el-tab-pane label="异常记录" name="abnormal">
          <div style="margin-top:20px">
            <WorkOrderList
              :height="pageHeight - 330"
              :isView="true"
              :tableData="tableData"
              :tableCurrent="tableCurrent"
              :tableSize="tableSize"
              :tableTotal="tableTotal"
              :tableType="activeName"
              v-on:tableSizeChange="tableSizeChange"
              v-on:tableCurrentChange="tableCurrentChange"
              v-on:tableRowView="tableRowView"
            />
          </div>
        </el-tab-pane>
        <!-- 任务记录 -->
        <el-tab-pane label="任务记录" name="task" v-if="Task_web">
          <el-form ref="form" :model="taskNotes" :inline="true" size="small">
            <el-form-item class="form-item-outline" label="时间区间" style="margin-top: 12px;">
              <el-select v-model="taskNotes.dataScope" size="small" @change="changeTaskTime()" class="search-info">
                <el-option v-for="item in taskTimeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div>
            <WorkOrderList
              :isView="true"
              :height="pageHeight - 330"
              :tableData="tableData"
              :tableType="activeName"
              :tableCurrent="tableCurrent"
              :tableSize="tableSize"
              :tableTotal="tableTotal"
              v-on:tableSizeChange="tableSizeChange"
              v-on:tableCurrentChange="tableCurrentChange"
              v-on:tableRowView="tableRowView"
              v-on:taskTypeChange="taskTypeChange"
              v-on:taskTimeChange="taskTimeChange"
            />
          </div>
        </el-tab-pane>
        <!-- 工单记录 -->
        <el-tab-pane label="工单记录" name="workOrder">
          <div style="margin-top:20px">
            <WorkOrderList
              :isView="true"
              :height="pageHeight - 330"
              :tableData="tableData"
              :tableType="activeName"
              :tableCurrent="tableCurrent"
              :tableSize="tableSize"
              :tableTotal="tableTotal"
              v-on:tableSizeChange="tableSizeChange"
              v-on:tableCurrentChange="tableCurrentChange"
              v-on:tableRowView="tableRowView"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="记录表" name="recordList" v-if="$_has('PC_Device_accessForm') && epInfo.id">
          <div style="margin-top:20px">
            <RecordCardList :external="true" :resetBtnStyle="{ top: '10px' }" :deviceId="epInfo.id" :fillAuth="$_has('PC_form_record_device_manage')" :viewAuth="true" style="padding:0;margin:0" />
          </div>
        </el-tab-pane>
        <!-- 检查项 -->
        <el-tab-pane label="检查项" name="check" v-if="inspectItemCode">
          <div style="margin-top:20px">
            <div style="float: right;margin-bottom: 20px;">
              <el-button type="danger" size="small" @click="createCheckItem">创建检查项</el-button>
            </div>
            <WorkOrderList
              :isView="false"
              :isEdit="true"
              :isDelete="true"
              :height="pageHeight - 330"
              :tableData="tableData"
              :tableType="activeName"
              v-on:tableRowEdit="tableRowEdit"
              v-on:tableRowDelete="tableRowDelete"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备资料" name="second">
          <div style="float: right; margin-bottom: 20px" v-has="PC_Device_edit" class="return-btn">
            <el-button type="danger" size="small" style="color: #fff; font-size: 14px" @click="uploadDeviceInfo">上传专属资料</el-button>
          </div>
          <h4>专属资料</h4>
          <div style="padding-bottom: 50px">
            <custom-table :tableHeader="instableDataHeader" :tableData="instructionsData" :tableHeight="tableHeight + ''" :loading="loading">
              <template v-slot:fileDesc="slotProps">
                <el-table-column
                  fixed
                  label="描述"
                  :width="slotProps.slotData.width && slotProps.ind !== instableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == instableDataHeader.length - 2 ? false : true"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div v-if="!scope.row.editing">
                      <span style="color: #999">{{ scope.row.fileDesc || "-" }}</span>
                    </div>
                    <div v-else>
                      <el-input size="mini" style="width: 60%" v-model="scope.row.fileDesc" maxlength="20" placeholder="请输入资料描述"></el-input>
                    </div>
                  </template>
                </el-table-column>
              </template>
              <template v-slot:status="slotProps">
                <el-table-column
                  label="状态"
                  :width="slotProps.slotData.width && slotProps.ind !== instableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == instableDataHeader.length - 2 ? false : true"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">使用中</span>
                    <span v-if="scope.row.status == 0">已停用</span>
                  </template>
                </el-table-column>
              </template>
              <template v-slot:fileSize="slotProps">
                <el-table-column
                  :width="slotProps.slotData.width && slotProps.ind !== instableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == instableDataHeader.length - 2 ? false : true"
                  label="文件大小"
                  show-overflow-tooltip
                >
                  <template #default="{ row }">
                    <span>{{ row.fileSize | calcFileSize }}</span>
                  </template>
                </el-table-column>
              </template>
              <template v-slot:userName="slotProps">
                <el-table-column
                  :width="slotProps.slotData.width && slotProps.ind !== instableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == instableDataHeader.length - 2 ? false : true"
                  label="上传人"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                      <div>
                        <div style="display: flex;align-items:center;">
                          <img :src="userDetail.headUrl ? userDetail.headUrl : require('../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                          <div style="flex: 1; margin-left: 10px">
                            <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ userDetail.userName }}</div>
                          </div>
                        </div>
                        <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                          <span style="color: #666; margin-right: 8px">电话: </span>
                          <span>{{ formatPhonenumber(userDetail.phonenumber) }}</span>
                          <el-button
                            class="copy_tel"
                            style="padding: 0px"
                            type="text"
                            v-clipboard:copy="userDetail.phonenumber"
                            v-clipboard:success="onCopyTel"
                            v-clipboard:error="onErrorTel"
                            v-if="userDetail.phonenumber"
                          >
                            <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                          </el-button>
                        </div>
                        <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                          <span style="color: #666; margin-right: 8px">邮箱: </span>
                          <span>{{ formatEmail(userDetail.email) }}</span>
                          <el-button
                            class="copy_mail"
                            type="text"
                            v-clipboard:copy="userDetail.email"
                            v-clipboard:success="onCopyMail"
                            v-clipboard:error="onErrorMail"
                            style="padding: 0px"
                            v-if="userDetail.email"
                          >
                            <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                          </el-button>
                        </div>
                      </div>
                      <span
                        slot="reference"
                        :disabled="!scope.row.userName"
                        class="copy_text"
                        type="text"
                        style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                        @click="getUserDetail(scope)"
                        >{{ scope.row.userName || "-" }}</span
                      >
                    </el-popover>
                  </template>
                </el-table-column>
              </template>
              <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
              <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="200" align="center">
                <template #default="{ row }">
                  <el-button style="margin-right: 10px; color: #001450" @click="editDescribe(row)" type="text">编辑</el-button>
                  <el-button
                    :disabled="!row.fileName.includes('pdf')"
                    :style="row.fileName.includes('pdf') ? 'color:#001450' : 'color:#999'"
                    @click="previewFile(row)"
                    type="text"
                    style="margin: -2px"
                  >
                    预览
                  </el-button>
                  <span @click="handleLook(row)" style="margin-right: 10px; color: #001450; cursor: pointer">下载</span>
                  <span v-has="PC_Device_edit" @click="handleDeleteData(row)" style="color: #001450; cursor: pointer">删除</span>
                </template>
              </el-table-column>
            </custom-table>
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagenation.current"
              :page-size="pagenation.size"
              :page-sizes="[5, 10, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNumber"
              style="float: right; display: flex; margin-top: 10px; background: #fff; position: relative; bottom: -10px"
            ></el-pagination>
          </div>
          <h4>公共资料</h4>
          <div style="padding-bottom: -50px">
            <custom-table :tableHeader="publictableDataHeader" :tableData="publicInfoData" :tableHeight="tableHeight + ''" :loading="uploadLoading">
              <template v-slot:fileDesc="slotProps">
                <el-table-column
                  fixed
                  label="描述"
                  :width="slotProps.slotData.width && slotProps.ind !== publictableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == publictableDataHeader.length - 2 ? false : true"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div v-if="!scope.row.editing">
                      <span style="color: #999">{{ scope.row.fileDesc || "-" }}</span>
                    </div>
                    <div v-else>
                      <el-input size="mini" style="width: 60%" v-model="scope.row.fileDesc" maxlength="20" placeholder="请输入资料描述"></el-input>
                    </div>
                  </template>
                </el-table-column>
              </template>
              <template v-slot:status="slotProps">
                <el-table-column
                  label="状态"
                  :width="slotProps.slotData.width && slotProps.ind !== publictableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == publictableDataHeader.length - 2 ? false : true"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 1">使用中</span>
                    <span v-if="scope.row.status == 0">已停用</span>
                  </template>
                </el-table-column>
              </template>
              <template v-slot:fileSize="slotProps">
                <el-table-column
                  :width="slotProps.slotData.width && slotProps.ind !== publictableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == publictableDataHeader.length - 2 ? false : true"
                  label="文件大小"
                  show-overflow-tooltip
                >
                  <template #default="{ row }">
                    <span>{{ row.fileSize | calcFileSize }}</span>
                  </template>
                </el-table-column>
              </template>
              <template v-slot:userName="slotProps">
                <el-table-column
                  :width="slotProps.slotData.width && slotProps.ind !== publictableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == publictableDataHeader.length - 2 ? false : true"
                  label="上传人"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                      <div>
                        <div style="display: flex;align-items:center;">
                          <img :src="userDetail.headUrl ? userDetail.headUrl : require('../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                          <div style="flex: 1; margin-left: 10px">
                            <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ userDetail.userName }}</div>
                          </div>
                        </div>
                        <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                          <span style="color: #666; margin-right: 8px">电话: </span>
                          <span>{{ formatPhonenumber(userDetail.phonenumber) }}</span>
                          <el-button
                            class="copy_tel"
                            style="padding: 0px"
                            type="text"
                            v-clipboard:copy="userDetail.phonenumber"
                            v-clipboard:success="onCopyTel"
                            v-clipboard:error="onErrorTel"
                            v-if="userDetail.phonenumber"
                          >
                            <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                          </el-button>
                        </div>
                        <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                          <span style="color: #666; margin-right: 8px">邮箱: </span>
                          <span>{{ formatEmail(userDetail.email) }}</span>
                          <el-button
                            class="copy_mail"
                            type="text"
                            v-clipboard:copy="userDetail.email"
                            v-clipboard:success="onCopyMail"
                            v-clipboard:error="onErrorMail"
                            style="padding: 0px"
                            v-if="userDetail.email"
                          >
                            <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                          </el-button>
                        </div>
                      </div>
                      <span
                        slot="reference"
                        :disabled="!scope.row.userName"
                        class="copy_text"
                        type="text"
                        style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                        @click="getUserDetail(scope)"
                        >{{ scope.row.userName || "-" }}</span
                      >
                    </el-popover>
                  </template>
                </el-table-column>
              </template>
              <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
              <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="200" align="center">
                <template #default="{ row }">
                  <el-button :disabled="!row.fileName.includes('pdf')" :style="row.fileName.includes('pdf') ? 'color:#001450' : 'color:#999'" @click="previewFile(row)" type="text"> 预览 </el-button>
                  <span @click="handleLook(row)" style="margin-right: 10px; color: #001450; cursor: pointer">下载</span>
                </template>
              </el-table-column>
            </custom-table>
            <el-pagination
              background
              @size-change="handleSizeChangeUpload"
              @current-change="handleCurrentChangeUpload"
              :current-page="pagenationUpload.current"
              :page-size="pagenationUpload.size"
              :page-sizes="[5, 10, 30, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="publicInfoTotal"
              style="float: right; display: flex; margin-top: 10px; background: #fff; position: relative; bottom: 0px"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 设备卡牌 -->
      <el-dialog title="查看设备铭牌" :visible.sync="eptCardFlag" width="480px" :close-on-click-modal="false">
        <div class="card_show">
          <el-image style="width: 100%;" :src="epInfo.cardFullPath" :preview-src-list="[epInfo.cardFullPath]"> </el-image>
        </div>
        <div class="downQrcodeCon">
          <el-checkbox v-model="isIncludeLogo" @change="changeIsIncludeLogo">铭牌中是否包含美孚Logo</el-checkbox>
          <div class="downQrcodeTip">请确认设备名称，设备制造商，设备型号，设备位置正确填写，再确认下载</div>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align: right">
          <el-button size="small" @click="eptCardFlag = false">取 消</el-button>
          <el-button size="small" type="danger" @click="redownload" :loading="isloadNameplate">下载设备铭牌</el-button>
        </span>
      </el-dialog>
      <!-- 查看动态图片 -->
      <el-dialog :visible.sync="imgDialogVisible" :modal="isModal">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
      <!-- 编辑分组 -->
      <el-dialog title="编辑分组" :visible.sync="editGroupFlag" width="30%" :before-close="cancelEditGroup">
        <div style="display: flex; align-items: center">
          <div style="color: #000; margin-right: 10px; width: 30px">分组</div>
          <div style="width: 88%">
            <el-cascader
              :options="groupList"
              :props="{ label: 'groupName', value: 'id', multiple: true }"
              size="small"
              style="width: 100%"
              v-model="selectGroupId"
              placeholder="请选择"
              @change="handleSearchTableData"
              filterable
              clearable
            >
              <template slot="empty">
                <div>暂无分组</div>
              </template>
            </el-cascader>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelEditGroup" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmEdit" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 创建申请单 -->
      <el-dialog
        class="closeWorkOrder"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="addApplyVisibled"
        title="创建申请单"
        top="100px"
        :show-close="false"
        width="50%"
        @close="closeServiceDialog"
      >
        <el-form :model="questionForm" :rules="serviceTypeRule" ref="questionForm" label-position="top" style="max-height: 500px;overflow-y: auto;">
          <el-row style="display:flex;flex-wrap:wrap">
            <div :span="12" style="width:50%" v-if="userInfo.userType != 2">
              <el-form-item label="客户" prop="customerId" v-if="userInfo.userType != 2">
                <el-select size="small" class="dialog" placeholder-style="color:#e2e2e2;" style="width:80%" disabled v-model="epInfo.companyName">
                  <el-option
                    @click.native="changeCompany(item.companyId, item.companyNumber)"
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
                <div class="select_person form-item-outline" style="color:#606266;" @click="allocationUser">
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
          <div style="margin-bottom: 20px; font-size: 16px">
            <span style="color: #dd0000">*</span>{{ userInfo.userType < 2 ? "请选择客户需求或遇到的问题（请选择至少一项）" : "请选择您遇到的问题" }}
          </div>
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
        <div slot="footer" style="margin-top:-20px;">
          <el-button type="danger" plain @click="handleResetApply('questionForm')" size="small">取消</el-button>
          <el-button type="danger" @click="sureAddApply('questionForm')" size="small">确定</el-button>
        </div>
      </el-dialog>
      <!-- 新建换油咨询工单   选择换油情况 -->
      <el-dialog title="请选择换油情况" class="closeWorkOrder" :visible="dialogOilChangeVisible" :show-close="false" width="30%">
        <el-form :model="ruleFormChangeOil" ref="ruleFormChangeOil" label-width="100px" label-position="top">
          <div class="radioGroup" style="border:1px solid #e9e9e9;">
            <!-- 多选 -->
            <el-checkbox-group v-model="valueCheckBoxList" @change="selectId => changebox(selectId)" style="display: inline-block;">
              <el-checkbox style="height:50px;line-height:30px;" v-for="btn in oilChangefieldOption" :label="btn.type" :key="btn.type">{{ btn.desc }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="notice-text" v-if="resultBox">
            <img src="../../assets/notice-icon.png" alt="" style="margin:20px 8px 0 0;" />
            请预先咨询美孚工程师
          </div>
        </el-form>
        <div slot="footer" style="margin-top: 20px">
          <el-button type="danger" plain @click="consoleOilChange('ruleFormChangeOil')" size="small">取消</el-button>
          <el-button type="danger" @click="confirmContiun('ruleFormChangeOil')" size="small">确认继续</el-button>
        </div>
      </el-dialog>
      <!-- 分配 -->
      <el-dialog
        title="分配人员"
        ref="executePersonDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="executePersonNameVisiable"
        width="40%"
        class="create-task radio-table"
      >
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
            v-el-table-infinite-scroll="loadMoreExecutePerson"
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
          <el-button type="danger" plain @click="executePersonNameVisiable = false" size="small">取消</el-button>
          <el-button type="danger" @click="submitDistribution" size="small">分配</el-button>
        </div>
      </el-dialog>
      <!-- 修改详情弹框 -->
      <el-dialog title="修改详情" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="editDetailDialog" width="40%" class="create-task radio-table">
        <div style="padding:15px;background: rgba(204,221,255,0.2);border: 1px solid #ccddff;border-radius: 4px;">
          <el-row>
            <el-col :span="12">
              <span style="color:#999">修改时间</span>
              <span style="color:#333;margin-left:10px;">{{ updateLogDetailObj.createTime }}</span>
            </el-col>
            <el-col :span="12">
              <span style="color:#999">操作人员</span>
              <span style="color:#333;margin-left:10px;">{{ updateLogDetailObj.createUser }}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top:8px;">
            <el-col :span="24">
              <span style="color:#999">所属公司</span>
              <span style="color:#333;margin-left:10px;">{{ updateLogDetailObj.companyName }}</span>
            </el-col>
          </el-row>
        </div>
        <el-table
          ref="multipleTableAdd"
          :data="updateLogDetailData"
          v-el-table-infinite-scroll="loadMoreEditDetail"
          tooltip-effect="dark"
          :row-key="getRowKey"
          v-loading="loadMoreDataDetail"
          height="400px"
        >
          <el-table-column prop="fieldName" min-width="20%" label="字段名称"> </el-table-column>
          <el-table-column prop="fieldValueBefore" min-width="10%" label="修改前内容">
            <template slot-scope="scope">
              <div v-if="scope.row.picFlag == 0 || !scope.row.fieldValueBefore">
                {{ scope.row.fieldValueBefore || "暂无" }}
              </div>
              <div v-if="scope.row.picFlag == 1 && scope.row.fieldValueBefore" @click="lookPic(scope.row, 'before')">
                <div class="look-img">点击查看</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="fieldValueAfter" min-width="10%" label="修改后内容">
            <template slot-scope="scope">
              <div v-if="scope.row.picFlag == 0 || !scope.row.fieldValueAfter">
                {{ scope.row.fieldValueAfter || "暂无" }}
              </div>
              <div v-if="scope.row.picFlag == 1 && scope.row.fieldValueAfter" @click="lookPic(scope.row, 'after')">
                <div class="look-img">点击查看</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer">
          <el-button type="danger" plain @click="editDetailDialog = false" size="small">确定</el-button>
        </div>
      </el-dialog>

      <!-- 新增润滑点 -->
      <LupDialog
        :dialogFlag="dialogFlag"
        :ruleForm="addLupForm"
        :lupDeviceNameList="lupDeviceNameList"
        :recommendOilCodeKey="recommendOilCodeKey"
        :imageLubricationList="addLupImgList"
        :lubricationPointTypeList="lubricationPointTypeList"
        :oilBrandList="oilBrandList"
        :oilChangePeriodList="oilChangePeriodList"
        :oilBoxCapacityList="oilBoxCapacityList"
        :methodsList="methodsList"
        :recommendOilList="recommendOilList"
        :oilList="oilList"
        v-on:addOrEditLup="addOrEditLup"
        v-on:closeDialog="closeDialog"
        ref="LupDialogRef"
      />
      <!-- 删除提示框 -->
      <el-dialog title="删除检查项" :visible.sync="deleteItemVisible" :close-on-click-modal="false" width="30%">
        <span>删除后，未来的任务中将不在出现该检查项（但不会影响已生成的任务），请谨慎操作。</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteItemVisible = false" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmDeleteItem" size="small">删 除</el-button>
        </span>
      </el-dialog>
      <!-- 异常详情 -->
      <AbnormalDraw :openDrawFlag="openDrawFlag" :abnormalStatus="abnormalStatus" :id="abnormalId" v-on:refreshList="refreshList" v-on:closeDraw="closeDraw"></AbnormalDraw>
    </div>
    <UploadDeviceInfo ref="deviceUpoad" :successCb="$_getDeviceData" />
    <QrOperation :dialogVisibleOperation="dialogVisibleOperation" v-on:closeVisibleOperation="closeVisibleOperation"></QrOperation>
    <!-- 放大的图片展示 -->
    <el-dialog title="" :visible.sync="dialogVisibleImg" width="60%" style="text-align: center;" :before-close="handleClose">
      <img :src="imgSrc" alt="" style="width:100%;" />
    </el-dialog>
    <el-dialog class="closeWorkOrder" :visible.sync="selfServiceVisibled" title="选择服务类型" :show-close="false" width="30%">
      <el-form :model="serviceTypeForm" :rules="serviceTypeRule" ref="serviceTypeForm" label-position="120px" :inline="true">
        <el-row>
          <el-col span="24">
            <el-form-item label="服务类型" prop="serviceType" required>
              <el-cascader
                ref="cascaderAddr"
                clearable
                v-model="serviceTypeForm.serviceType"
                :options="serviceTypeList"
                :props="industruPropsSelect"
                :show-all-levels="false"
                filterable
                size="small"
                @change="handleSelectServiceType"
              >
                <template #default="slotScope">
                  <div @click="clickServiceItem(slotScope)">{{ slotScope.data.serviceName }}</div>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="margin-top: -20px">
        <el-button type="danger" plain @click="handleResetAdd('serviceTypeForm')" size="small">取消</el-button>
        <el-button type="danger" @click="sureAddWorkOrder('serviceTypeForm')" size="small">确定</el-button>
      </div>
    </el-dialog>
    <!-- 显示同步核心润滑表信息弹框 -->
    <SyncLub :dialogFlag="showSyncLubDialog" @closeSyncLubDialog="closeSyncLubDialog" :tipsData="tipsData" />
    <!-- 编辑设备弹框 -->
    <CreateDevice
      v-if="addDeviceDialog"
      :deviceTypeDialog="deviceTypeDialog"
      :selectLubricationPointNumber="selectLubricationPointNumber"
      :addDeviceDialog="addDeviceDialog"
      :epInfo="epInfo"
      v-on:addOrEditDevice="addOrEditDevice"
      v-on:closeDialogAddDevice="closeDialogAddDevice"
    />
    <!-- 创建润滑点 -->
    <CreateLubricationPoint
      v-if="addLubricationPointDialog"
      :epInfo="epInfo"
      :selectLubricationPointNumber="selectLubricationPointNumber"
      :deviceTypeDialog="deviceTypeDialog"
      :addLubricationPointDialog="addLubricationPointDialog"
      v-on:addOrEditDevice="addOrEditDevice"
      v-on:addOrEditLup="addOrEditLup"
      v-on:lastNext="lastNext"
      v-on:closeDialogAddLubPoint="closeDialogAddLubPoint"
    />
  </div>
</template>

<script>
import CreateDevice from "./components/CreateDevice.vue";
import CreateLubricationPoint from "./components/CreateLubricationPoint.vue";
import SyncLub from "./components/syncLubDialog.vue";
import LupDialog from "./components/lupDialog";
import UplaodSection from "./components/uploadVideoImg.vue";
import TabsTable from "./components/tabsTable";
import { table_head_config } from "./components/tableHead";
import AbnormalDraw from "../spotInspection/abnormalRecord/abnormalDetail";
import UploadDeviceInfo from "./components/uploadDeviceInfo.vue";
import QrOperation from "../qrManagement/qrOperation.vue";
import DAModify from "../newWorkOrder/mixins/DAModify.js";
import { baseRemoteOauth2 } from "@/api/api";
import service from "../../api/request";
import RecordCardList from "../formApplication/formHistoryRecordStaticList/index";
import WorkOrderList from "./components/workOrderList";
import customTable from "../tableComponents/customTable";
import commonJS from "../tableComponents/tableCommon.js";
import serviceIncome from "@/components/newWorkOrder/components/serviceIncome";
export default {
  components: {
    SyncLub,
    CreateDevice,
    CreateLubricationPoint,
    LupDialog,
    TabsTable,
    AbnormalDraw,
    UploadDeviceInfo,
    UplaodSection,
    QrOperation,
    RecordCardList,
    WorkOrderList,
    "custom-table": customTable,
    serviceIncome
  },
  mixins: [table_head_config, DAModify, commonJS],
  filters: {
    calcFileSize(fileS) {
      let fileSizeString = "";
      if (fileS == 0 || !fileS) {
        return "0B";
      }
      if (fileS < 1024) {
        fileSizeString = fileS + "B";
      } else if (fileS < 1048576) {
        fileSizeString = (fileS / 1024).toFixed(2) + "KB";
      } else if (fileS < 1073741824) {
        fileSizeString = (fileS / 1048576).toFixed(2) + "MB";
      } else {
        fileSizeString = (fileS / 1073741824).toFixed(2) + "GB";
      }
      return fileSizeString;
    }
  },
  data() {
    return {
      Task_web: false,
      inspectItemCode: false,
      SPList: [],
      activeQuestion: "",
      checkboxList: [], // 选中的问题的children
      incomeBblUnit: "BBL",
      incomeRmbUnit: "RMB",
      showIncomeBbl: false,
      showIncomeRmb: false,
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

      showCreateApply: false,
      showFlag: false,
      selectServiceNumber: "",
      selectServiceLevel: "",
      selectMslaServiceType: "",
      typeName: "",
      serviceId: "",
      paramDataLubFlag: "",
      coreDataLubFlag: "",
      coreDataTemplateId: "",
      fields: [],
      oilChangefieldOption: [],
      valueCheckBoxList: [],
      ruleFormChangeOil: {},
      dialogOilChangeVisible: false,
      resultBox: false,
      serviceTypeForm: { serviceType: "" },
      serviceTypeList: [],
      selfServiceVisibled: false,
      showSyncLubDialog: false,
      tipsData: {},
      taskNotes: {
        startDate: "",
        endDate: "",
        dataScope: "1",
        taskTime: [],
        taskTypeValue: ""
      },
      addDeviceDialog: false, // 编辑设备弹框
      addLubricationPointDialog: false, // 编辑润滑点弹框
      deviceTypeDialog: "edit", // 设备弹框类型
      dialogVisibleImg: false,
      imgSrc: "",
      pickerOptions: {
        disabledDate: dateValue => {
          return dateValue.getTime() > Date.now() - 8.64e6 || dateValue < new Date(2023, 0, 1).getTime();
        }
      },
      loadingDevice: false,
      loadMoreDeviceFlag: false,
      editDetailDialog: false, // 修改详情弹框
      loadMoreDataDetail: false,
      updateLogDetailObj: {}, // 修改详情弹框字段
      updateLogDetailData: [], // 修改详情弹框字段
      currentEditDetail: 1,
      fieldNamesData: [], //修改字段下拉框可选数据
      srcList: [],
      deviceCurrent: 1,
      currentLog: 1,
      deviceTableData: [],
      deviceTotal: 0,
      taskTypeOptions: [
        { label: "换油", value: "1" },
        { label: "加油", value: "2" },
        { label: "加脂", value: "3" },
        { label: "检查", value: "4" },
        { label: "保养", value: "5" },
        { label: "维修", value: "6" },
        { label: "其他", value: "7" }
      ],
      deviceStatusData: [
        { label: "换油", value: "1" },
        { label: "加油", value: "2" },
        { label: "加脂", value: "3" },
        { label: "检查", value: "4" },
        { label: "保养", value: "5" },
        { label: "维修", value: "6" },
        { label: "其他", value: "7" }
      ],
      searchForm: {},
      searchFormLog: {
        time: [],
        fieldCode: ""
      },
      taskTimeOptions: [{ label: "当前", value: "1" }, { label: "未来", value: "2" }, { label: "全部", value: "3" }],
      qrCardDetail: {
        manufacturer: "",
        deviceModel: "",
        deviceCode: "",
        devicePosition: ""
      },
      dialogVisibleOperation: false,
      selCompnyPeopleList: [],
      checkList: [], // 选中的问题
      questionList: [], // 服务类型列表
      selectQuestionList: [],
      oilTypeListWorker: [],
      loading: false, // 是否展示加载动画，默认隐藏
      companyList: [], // 公司数据
      questionForm: {
        spId: "",
        description: "",
        contactUserId: ""
      },
      publicInfoData: [],
      pagenationUpload: {
        size: 10,
        current: 1
      },
      uploadLoading: false,
      publicInfoTotal: 0,

      deleteItemVisible: false,
      deleteRow: {},
      openDrawFlag: false,
      abnormalStatus: 0,
      abnormalId: null,
      tableData: [],
      tableCurrent: 1,
      tableSize: 30,
      tableTotal: 0,
      pageHeight: "",
      showOrHideStateFlag: null,
      dialogFlag: false,
      activeName: "first",
      activeNameTab: "dynamic",
      instructionsData: [], // 说明书数据
      pagenation: {
        size: 10,
        current: 1
      },
      accountTotal: 0,
      expireTimeOption: {
        disabledDate(date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now();
        }
      },
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now(); // 如果当天可选，就不用减8.64e7
        }
      },
      //  自定义属性
      industruPropsSelect: {
        value: "serviceNumber",
        label: "serviceName",
        children: "children"
      },
      // 表单验证规则
      serviceTypeRule: {
        serviceType: [{ required: true, message: "请选择服务类型", trigger: "change" }]
      },
      // 表单验证规则
      serviceTypeRule: {
        lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
        oilNumber: [{ required: true, message: "请选择油品种类", trigger: "change" }],
        description: [{ required: true, message: "请输入详细描述", trigger: "change" }],
        contactUserId: [{ required: true, message: "请选择联系人", trigger: "blur" }]
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      defaultImg: require("../../assets/lp-none.png"),
      addApplyVisibled: false, // 新建申请单
      mainminheight: `height:${document.documentElement.clientHeight - 160}px`,
      imgUrl: "", // 图片
      imageList: [], //
      uploadUrl: "",
      hideUpload: false, //
      // 表单验证
      epInfo: {},
      lubricationPointInfo: {}, // 润滑点详情
      lubricatePointData: [],
      menus: [],
      recommendOilName: "", // 推荐油品名称
      oilChangePeriodList: [],
      oilBoxCapacityList: [{ oilBoxCapacityUnit: "L", oilBoxCapacityUnitDesc: "L" }, { oilBoxCapacityUnit: "KG", oilBoxCapacityUnitDesc: "KG" }],
      methodsList: [{ value: "循环", label: "循环" }, { value: "飞溅", label: "飞溅" }, { value: "喷射", label: "喷射" }, { value: "手刷", label: "手刷" }, { value: "油枪", label: "油枪" }],
      totalNumber: 0, // 总条数
      dialogTableVisible: false, // 是否展示查看对话框，默认隐藏
      recordList: [], // 换油记录
      //   表单验证规则
      rules: {
        oilChangePeriodUnit: [{ required: true, message: "请选择换油/加脂周期单位", trigger: "change" }],
        lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
        oilBoxCapacityUnit: [{ required: true, message: "请选择油箱容量单位", trigger: "change" }],
        oilBrandCode: [{ required: true, message: "请选择在用油品牌", trigger: "change" }],
        nextScheduledOilChangeDate: [{ required: true, message: "请选择预计下次换油/加脂日期", trigger: "change" }],
        recommendOilCode: [{ required: false, message: "请继续完善设备制造商推荐油品名称", trigger: "change" }],
        recommendOilSeries: [{ required: false, message: "请继续完善设备制造商推荐油品系列", trigger: "change" }],
        recommendOilType: [{ required: false, message: "请继续完善设备制造商推荐油品类型", trigger: "change" }],
        oilSeries: [{ required: false, message: "请继续完善在用油品系列", trigger: "change" }],
        oilName: [{ required: false, message: "请继续完善在用油品名称", trigger: "change" }]
      },
      selectLubricationPointNumber: "",
      seleWayId: "",
      visibleDetail: true,
      visibleAdd: false,
      selectLubricatePointData: {},
      addLubricatePointData: {
        recommendOilCode: "",
        imgFile: "", // 图片文件
        lubricationPointImgFile: "",
        oilName: "",
        lastOilChangeDate: "",
        oilSeries: "",
        recommendOilSeries: "",
        recommendOilType: "",
        fillingQuantity: "",
        lubricationPointDesc: "",
        lubricationPointName: "",
        lubricationMethod: ""
      }, // 新建润滑点数据
      countData: [], // 动态
      countTrends: 0, // 动态总条数
      updateLogData: [], // 修改历史数据
      loadMoreLogFlag: false,
      loadMoreEditDetailFlag: false,
      countUpdateLog: 0, //  修改历史总条数
      countUpdateLogDetail: 0,
      loadingLog: false,
      current: 1,
      oilBrandList: [], // 油品品牌数组
      page_count: "",
      lubricationPointTypeList: [], // 润滑点设备类型数组
      typeProps: {
        value: "code",
        label: "name"
      },
      deviceType: "", // 选中的类型
      deviceTypeName: "", // 类型名称
      recommendOilTypeList: [], // 推荐油品类型数组
      recommendOilSeriesList: [], // 推荐油品系列数组
      recommendOilList: [], // 推荐油品名称数组
      oilTypeList: [], // 在用油品类型数组
      oilSeriesList: [], // 在用油品系列数组
      oilList: [], // 在用油品名称数组
      selectOil: "", // 选择的在用油品牌
      oilBrandCodeAdd: "",
      oilTypeListAdd: [],
      oilSeriesListAdd: [],
      oilListAdd: [],
      selectRecommendOil: "", // 选择的推荐用油品牌
      reverse: false,
      reportTypeSelect: "",
      reportType: 0,
      eptCardFlag: false,
      cardForm: {
        cardId: ""
      },
      imgDialogVisible: false,
      dialogImageUrl: "",
      addLupImgList: [],
      addLupForm: {},
      recommendOilCodeKey: 1,
      workOrderBtn: false,
      sopFileRow: "",
      // 分组
      editGroupFlag: false,
      groupTags: [],
      groupList: [],
      selectGroupId: [],
      editGroupBtn: false,
      screenWidth: null,
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
      isIncludeLogo: true,
      isloadingCard: false,
      isloadNameplate: false,
      lupDeviceNameList: [],
      instableDataHeader: [
        { label: "文件名", prop: "fileName", width: "200", tooltip: true },
        { label: "描述", slot: "fileDesc", width: "200" },
        { label: "状态", slot: "status", width: "120" },
        { label: "文件大小", slot: "fileSize", width: "120" },
        { label: "上传人", slot: "userName", width: "120" },
        { label: "上传时间", prop: "createTime", width: "180" },
        { label: "操作", slot: "operation" }
      ],
      publictableDataHeader: [
        { label: "文件名", prop: "fileName", width: "200", tooltip: true },
        { label: "描述", slot: "fileDesc", width: "200" },
        { label: "状态", slot: "status", width: "120" },
        { label: "文件大小", slot: "fileSize", width: "120" },
        { label: "上传人", slot: "userName", width: "120" },
        { label: "上传时间", prop: "createTime", width: "180" },
        { label: "操作", slot: "operation" }
      ],
      userDetail: {},
      // 服务创造盈属性与服务收益
      applylist: {
        serviceProperty: "",
        incomeBbl: "",
        incomeRmb: ""
      }
    };
  },
  mounted() {
    this.$_queryLPData(); // 查询润滑点
    this.$_queryOilChangePeriodData(); // 查询换油单位配置数据
    this.getQueryOilList("0", null, "oilBrandList"); // 查询用油品牌
    this.$_getDeviceData(); // 查询设备资料列表
    this.screenWidth = document.body.clientWidth;
    this.questionForm.customerId = this.epInfo.companyId;
    // this.deviceTableData()
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        this.mainminheight = `height:${document.documentElement.clientHeight - 160}px`;
      })();
    };
    this.$gio.viewTrend({
      customer: this.epInfo.companyName
    });
  },
  async created() {
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "device-group-edit-btn") {
        this.editGroupBtn = true;
      }
      if (buttonList[i].menuCode == "service_order_execute_btn") {
        this.executePermissionFlag = true;
      }
      if (buttonList[i].menuCode == "service_order_distribution_btn") {
        this.assignPermissionsFlag = true;
      }
    }
    // this.handlePermission();
    this.$_getLubricatePointData(this.$route.query.deviceNumber); // 润滑点列表
    this.getOilList("");
    let buttonpermsStr = JSON.parse(sessionStorage.getItem("menuList"));
    for (let i in buttonpermsStr) {
      let item = buttonpermsStr[i];
      if (item.menuCode == "NewWorkOrderList") {
        this.workOrderBtn = true;
      }
      if (item.menuCode == "Task_web") {
        this.Task_web = true;
      }
    }

    this.$userInfo.menus.some(menu => {
      if (menu.menuCode == "FirstDevice") {
        return menu.children.some(item => {
          if (item.menuCode == "inspectItem") {
            this.inspectItemCode = true;
            return true;
          }
        });
      }
    });
    this.pageHeight = document.documentElement.clientHeight;
    await this.$_queryEPInfo(this.$route.query.deviceNumber); // 设备详情
    this.getAllDeviceInfo();
    if (this.userInfo.userType == 2) {
      // this.getCompanyPeople(this.userInfo.companyNumber);
      this.selCompnyPeopleList.push(this.userInfo);
    }
    if (this.$route.query.resource == "lumpointList") {
      this.clickLupItem(this.$route.query.lubricationId);
    }
    this.getSpList(this.epInfo.companyId);
  },

  methods: {
    async getSpList(val) {
      if (this.$userInfo.userType == 1) {
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
    changebox(val) {
      if (val.length) {
        if (val[val.length - 1] == "0") {
          this.valueCheckBoxList = ["0"];
        }
        if (val[val.length - 1] != "0") {
          // 有正常得选项
          let index = val.findIndex(it => it == "0");
          if (index > -1) {
            val.splice(index, 1);
            this.valueCheckBoxList = val;
          }
        }
      }
      this.resultBox = this.valueCheckBoxList.find(item => {
        return item == 1 || item == 2 || item == 3 || item == 4;
      });
    },
    // 取消选择换油情况
    consoleOilChange() {
      this.dialogOilChangeVisible = false;
    },
    // 确认继续
    confirmContiun() {
      if (this.valueCheckBoxList.length > 0) {
        this.createdWork();
      } else {
        this.$message({
          message: "请选择换油情况",
          type: "warning"
        });
      }
      //
    },
    // 获取换油情况
    getOilChangeStatus() {
      this.requestMethodGet("/serviceReport/queryOilChangeStates")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.oilChangefieldOption = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 确定新建工单
    sureAddWorkOrder(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.reportTypeSelect == "11") {
            this.dialogOilChangeVisible = true;
            this.getOilChangeStatus();
          } else {
            this.createdWork();
          }
        } else {
          return false;
        }
      });
    },
    createdWork() {
      if (this.addServiceType == "1") {
        this.$router.push({
          path: "/NewWorkOrderList/AddWorkOrderOil",
          query: {
            serviceType: this.addServiceType,
            serviceNumber: this.selectServiceNumber,
            serviceLevel: this.selectServiceLevel,
            mslaServiceType: this.selectMslaServiceType,
            typeName: this.typeName,
            workshopId: this.epInfo.workshopId,
            deviceId: this.$route.query.deviceId,
            lubricationPointNumber: this.selectLubricationPointNumber,
            isNormal: 2,
            pesServiceItemId: ""
          }
        });
      } else if (this.addServiceType == "2" || this.addServiceType == "9" || this.addServiceType == "10") {
        this.$router.push({
          path: "/NewWorkOrderList/AddWorkOrder",
          query: {
            serviceNumber: this.selectServiceNumber,
            addServiceType: this.addServiceType,
            serviceId: this.serviceId,
            typeName: this.typeName,
            reportType: this.reportTypeSelect,
            paramDataLubFlag: this.paramDataLubFlag,
            coreDataLubFlag: this.coreDataLubFlag,
            coreDataTemplateId: this.coreDataTemplateId,
            pesServiceItemId: "",
            workshopId: this.epInfo.workshopId,
            lubricationPointNumber: this.selectLubricationPointNumber,
            isNormal: 1,
            changeOil: this.valueCheckBoxList.toString()
          }
        });
      } else {
        this.$message({
          message: "此服务类型不可以创建工单",
          type: "warning"
        });
      }
    },
    handleResetAdd(formName) {
      this.selfServiceVisibled = false;
      this.$refs[formName].resetFields();
    },
    clickServiceItem(slotScope) {
      const ownerRoleIds = this.$userInfo.accessTemplates.map(item => item.accessTemplateId.toString());
      const data = slotScope.data;
      let authorityRoles = [];
      if (data.authorityRole) {
        authorityRoles = data.authorityRole.split(",").map(item => item.toString());
        const authorFlag = authorityRoles.some(item => ownerRoleIds.includes(item));
        if (!authorFlag) {
          this.disabledSelServiceItem = true;
          console.log(this.userInfo.userType);
          let msg = "";
          if (this.$userInfo.userType == "2") {
            msg = `您暂无权限能添加${data.serviceName}服务项，请联系埃克森美孚当地授权经销商或者区域技术工程师解决服务申请事宜。`;
          } else {
            msg = `您暂无权限能添加${data.serviceName}服务项，请联系埃克森美孚区域技术工程师解决服务申请事宜。`;
          }
          this.$message({
            type: "warning",
            message: msg
          });
          this.$nextTick(() => {
            setTimeout(() => {
              this.selectServiceNumber = "";
              this.selectServiceLevel = "";
              this.selectMslaServiceType = "";
              this.serviceTypeForm.serviceType = "";
              this.$refs.cascaderAddr.inputValue = "";
              this.$refs.cascaderAddr.checkedValue = [];
              this.$refs.cascaderAddr.presentText = [];
            }, 100);
          });
        }
      }
    },
    // 创建工单选择服务类型
    handleSelectServiceType(val) {
      if (this.disabledSelServiceItem) return (this.disabledSelServiceItem = false);
      this.selectServiceNumber = val[val.length - 1];
      this.serviceTypeList.map(item => {
        if (item.children) {
          item.children.map(i => {
            if (i.children) {
              i.children.map(t => {
                if (t.serviceNumber == this.selectServiceNumber) {
                  this.addServiceType = t.serviceType;
                  this.selectServiceLevel = t.serviceLevel;
                  if (t.mslaServiceType) {
                    this.selectMslaServiceType = t.mslaServiceType;
                  }
                  this.reportTypeSelect = t.reportType;
                  this.typeName = t.serviceName;
                  this.serviceId = t.id;
                  this.paramDataLubFlag = t.paramDataLubFlag;
                  this.coreDataLubFlag = t.coreDataLubFlag;
                  this.coreDataTemplateId = t.coreDataTemplateId;
                }
              });
            } else {
              if (i.serviceNumber == this.selectServiceNumber) {
                this.addServiceType = i.serviceType;
                this.selectServiceLevel = i.serviceLevel;
                if (i.mslaServiceType) {
                  this.selectMslaServiceType = i.mslaServiceType;
                }
                this.serviceId = i.id;
                this.reportTypeSelect = t.reportType;
                this.typeName = i.serviceName;
                this.paramDataLubFlag = t.paramDataLubFlag;
                this.coreDataLubFlag = t.coreDataLubFlag;
                this.coreDataTemplateId = t.coreDataTemplateId;
              }
            }
          });
        } else {
          if (item.serviceNumber == this.selectServiceNumber) {
            this.addServiceType = item.serviceType;
            this.selectServiceLevel = item.serviceLevel;
            if (item.mslaServiceType) {
              this.selectMslaServiceType = item.mslaServiceType;
            }
            this.serviceId = item.id;
            this.reportTypeSelect = t.reportType;
            this.typeName = item.serviceName;
            this.paramDataLubFlag = t.paramDataLubFlag;
            this.coreDataLubFlag = t.coreDataLubFlag;
            this.coreDataTemplateId = t.coreDataTemplateId;
          }
        }
      });
    },
    // 服务类型
    $_getServiceList(val) {
      this.serviceTypeList = [];
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", { serviceName: val || "", serviceDisplay: 1 })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.serviceTypeList = this.formatData(res.data);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleCommand(command) {
      if (command == "a") {
        this.createWorkOrder();
      } else if (command == "b") {
        this.handleSelfService();
        this.$_getServiceList();
      }
    },
    handleSelfService() {
      this.selfServiceVisibled = true;
    },
    // 取消编辑设备
    closeDialogAddDevice() {
      this.addDeviceDialog = false;
    },
    // 编辑设备弹框点击确定
    addOrEditDevice() {
      this.addDeviceDialog = false;
      this.$_queryEPInfo(this.epInfo.deviceNumber);
    },
    // 取消编辑润滑点
    closeDialogAddLubPoint() {
      this.addLubricationPointDialog = false;
    },
    closeSyncLubDialog() {
      this.showSyncLubDialog = false;
      this.$refs.LupDialogRef.cancelDialog();
      this.$_getLubricatePointData(this.$route.query.deviceNumber); // 润滑点列表
    },
    // 点击分配
    allocationUser() {
      if (!this.questionForm.spId) {
        this.$message({
          message: "请选择服务商",
          type: "warning"
        });
        return;
      }
      this.$refs["questionForm"].validateField(["customerId"], err => {
        if (!err) {
          // 更新删除联系人,执行人与联系人无关与所选客户有关
          this.executePersonNameVisiable = true;
          this.handleDistributive();
        }
      });
    },
    selCompanyPeopleChange() {
      this.executeUserId = "";
      this.executeUserRoles = "";
      this.executeUserName = "";
      this.showRoleNames = false;
    },
    lookPic(row, type) {
      this.srcList = [];
      this.dialogVisibleImg = true;
      if (type == "after") {
        this.imgSrc = row.fieldValueAfter;
      } else {
        this.imgSrc = row.fieldValueBefore;
      }
    },
    // 动态和修改历史的tab切换事件
    handleClickTab(tab, event) {
      if (tab.name == "second") {
        this.$_queryUpdateLog("");
        this.$_queryFieldNames();
      }
    },

    handlePermission() {
      if (this.executePermissionFlag && !this.assignPermissionsFlag) {
        this.executeUserName = this.userInfo.userName;
        this.executeUserRoles = this.userInfo.roleNames.join("/");
        this.executeUserId = this.userInfo.userId;
        this.showRoleNames = true;
      }
    },
    // 分配工单
    handleDistributive(val) {
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
        workOrderBelongCompanyId: this.epInfo.companyId
      };
      param.userBelongType = this.active;
      if (this.userInfo.userType == 1) {
        param.userBelongType = 2;
        param.distributorId = this.userInfo.companyId;
      }
      if (this.active == 3) {
        param.contactPersonId = this.questionForm.contactUserId;
      }
      param.accountId = this.epInfo.companyId;
      param.spId = this.questionForm.spId;
      if (this.$userInfo.userType == 2) return;
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
    },
    loadMoreExecutePerson() {
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

    // 选择日期变化
    changeTaskTime() {
      if (this.taskNotes.dataScope == 1 || this.taskNotes.dataScope == 2 || this.taskNotes.dataScope == 3) {
        this.taskNotes.taskTime = [];
        this.taskNotes.startDate = "";
        this.taskNotes.endDate = "";
        this.tableSize = 30;
        this.tableCurrent = 1;
        this.handleTabsClick();
      }
    },
    changeSelectTime() {
      if (this.taskNotes.dataScope == 4 && this.taskNotes.taskTime) {
        this.taskNotes.startDate = this.taskNotes.taskTime[0] + " 00:00:00";
        this.taskNotes.endDate = this.taskNotes.taskTime[1] + " 23:59:59";
      } else if (this.taskNotes.dataScope == 4 && !this.taskNotes.taskTime) {
        this.taskNotes.startDate = "";
        this.taskNotes.endDate = "";
      }
      this.tableSize = 30;
      this.tableCurrent = 1;
      this.handleTabsClick();
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
    selCompanyPeople() {},
    clearPeopleList() {
      this.questionForm.contactUserId = "";
      this.selCompnyPeopleList = [];
    },
    closeServiceDialog() {
      this.$refs.uploadVideoImg.cancelUplaod();
    },
    // 取消新建申请单
    handleResetApply(formName) {
      this.addApplyVisibled = false;
      this.executeUserId = "";
      this.executeUserRoles = "";
      this.executeUserName = "";
      this.showRoleNames = false;
      this.$refs[formName].resetFields();
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

    // 确定新建申请单
    sureAddApply(formName) {
      if (this.userInfo.userType != 2 && this.assignPermissionsFlag && !this.executeUserId) {
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
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let param = {
            customerId: this.epInfo.companyId,
            description: this.checkList.includes(2) ? this.questionForm.description : "",
            distributorId: this.userInfo.distributorId,
            reasonConfList: this.checkList,
            serviceApplyType: 1,
            serviceProperty: this.userInfo.userType == 2 ? 1 : this.applylist.serviceProperty,
            incomeBbl: this.applylist.incomeBbl,
            incomeRmb: this.applylist.incomeRmb
          };
          if (this.userInfo.userType != 2) {
            param.serviceApplyType = 2;
            param.distributorId = this.userInfo.companyId;
            param.executeUserId = this.executeUserId;
          } else {
            param.customerId = this.$userInfo.orgInfo.companyId;
          }
          const uploadAssets = await this.$refs.uploadVideoImg.getUplaodAssets();
          Object.assign(param, uploadAssets);
          param.distributorId = this.questionForm.spId;
          param.accountId = this.epInfo.companyId;
          this.requestMethodPost("/serviceApply/addServiceApplyOrder", param)
            .then(res => {
              this.loading = false;
              res = res.data;
              if (res.code == 1000) {
                // 润滑点关联申请单id
                this.relateApply(res.data);
                // 调取消息未读数据
                this.$parent.msgCount();
                if (this.executeUserId != this.userInfo.userId) {
                  if (this.userInfo.userType == 2) {
                    this.$router.push({
                      path: "/ServiceApplyList/ServiceApplyDetail",
                      query: {
                        id: res.data,
                        formPage: "equipmentDetail",
                        workshopId: this.epInfo.workshopId,
                        lubricationPointNumber: this.selectLubricationPointNumber
                      }
                    });
                  } else {
                    this.$router.push({
                      path: "/ServiceApplyList"
                    });
                  }
                } else {
                  this.$router.push({
                    path: "/ServiceApplyList/ServiceApplyDetail",
                    query: {
                      id: res.data,
                      formPage: "equipmentDetail",
                      workshopId: this.epInfo.workshopId,
                      lubricationPointNumber: this.selectLubricationPointNumber
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
    // 申请单id关联润滑点
    relateApply(id) {
      this.requestMethodGet("/serviceApply/createApplyOrderLubRel", { id: id, workshopId: this.epInfo.workshopId, lubricationPointNumber: this.selectLubricationPointNumber })
        .then(res => {})
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
    getOilTypeData() {
      this.requestMethodGet("/serviceApply/getOilLv2")
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.oilTypeListWorker = this.formatData1(res.data.list);
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
    getDeviceData(val) {
      if (val) {
        this.deviceCurrent = 1;
      }
      const params = {
        size: 30,
        current: this.deviceCurrent,
        ...this.searchForm
      };
      if (params.deviceType.length) {
        params.deviceType = params.deviceType[params.deviceType.length - 1];
      } else {
        params.deviceType = "";
      }
      if (params.groupId.length) {
        params.groupId = params.groupId[params.groupId.length - 1];
      } else {
        params.groupId = "";
      }
      params.companyId = this.companyId;
      if (this.workshopId) {
        if (this.firstLoadFlag) {
          params.workshopId = this.workshopId;
          this.firstLoadFlag = false;
        }
      }
      this.loadingDevice = true;
      let url = "";
      if (this.urlType == "createInspection" || this.urlType == "createAbnormal" || this.urlType == "MSLAWorkOrder") {
        url = "/web/device/queryAllDeviceByPage";
      } else if (this.urlType == "workOrder" || this.urlType == "workOrderReport") {
        params.companyNumber = this.companyNumber;
        params.workshopId = this.workshopId;
        params.plantStudyServiceFlag = this.plantStudyServiceFlag;
        params.reportType = this.reportType;
        url = "/workOrder/getDeviceByCompany";
      } else {
        params.actionType = this.actionType;
        params.actionTargets = this.actionType < 3 ? this.actionTargets.join(",") : this.actionTargets;
        if (this.abnormalDeviceId) {
          params.deviceId = this.abnormalDeviceId;
        }
        url = "/device/check/taskManage/devicesByPage";
      }
      this.requestMethodGet(url, params).then(res => {
        if (res.data.code == 1000) {
          let list = [];
          if (val) {
            this.$refs.deviceTableRef.clearSelection();
            list = res.data.data.list;
          } else {
            list = this.deviceTableData.concat(res.data.data.list);
          }
          if (list.length) {
            list.forEach(item => {
              if (!_.isEmpty(item.checkItemIds)) {
                item.checkItemIdsList = item.checkItemIds.indexOf(",") > -1 ? item.checkItemIds.split(",") : [item.checkItemIds];
              } else {
                item.checkItemIdsList = [];
              }
            });
          }
          this.deviceTableData = list;
          this.deviceTotal = res.data.data.totalCount;
          if (this.deviceTableData.length < this.deviceTotal) {
            this.loadMoreDeviceFlag = true;
          } else {
            this.loadMoreDeviceFlag = false;
          }
          this.loadingDevice = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    loadMoreData() {
      if (this.loadMoreDeviceFlag && this.deviceTableData.length < this.deviceTotal) {
        ++this.deviceCurrent;
        this.getDeviceData();
      }
    },

    getAllDeviceInfo() {
      this.uploadLoading = true;
      const params = {
        ...this.pagenationUpload,
        deviceId: this.epInfo.id,
        instructionType: 2
      };

      this.requestMethodGet("/web/deviceInstructions/getMyInstructions", params).then(res => {
        this.uploadLoading = false;
        if (res.data.code == 1000) {
          this.publicInfoData = res.data.data.list;
          this.publicInfoTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
        this.tableLoading = false;
      });
    },
    uploadDeviceInfo() {
      const deviceId = this.$route.query.deviceId ? this.$route.query.deviceId : this.epInfo.id;
      this.$refs.deviceUpoad.openDialog({ deviceId: deviceId, companyId: this.epInfo.companyId });
      this.$gio.uploadExclusiveDoc({
        operation: "确定上传",
        customer: this.epInfo.companyName
      });
    },
    tableRowView(row) {
      switch (this.activeName) {
        case "abnormal": // 异常
          this.abnormalStatus = row.abnormalStatus;
          this.abnormalId = row.id;
          this.openDrawFlag = true;
          this.$gio.viewEvent({
            customer: this.epInfo.companyName
          });
          break;
        case "task": // 任务记录
          this.$router.push({
            name: "taskDetail",
            query: {
              taskId: row.id,
              taskType: row.taskType
            }
          });
          this.$gio.viewTask_PC();
          break;
        case "workOrder": // 工单记录
          if (row.serviceType == 1) {
            this.$router.push({
              path: "/NewWorkOrderList/newWorkOrderOilDetail",
              query: {
                workOrderNumber: row.workOrderNumber
              }
            });
            this.$gio.viewWorkorder({
              workorderNumber: row.workOrderNumber,
              workorderType: "加油工单",
              customer: this.epInfo.companyName
            });
          } else if (row.serviceType == 9 || row.serviceType == 11) {
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
          this.$gio.toWorkorderDetails({
            workorderNumber: row.workOrderNumber,
            entrance: "设备详情页-工单记录"
          });
          break;
        case "check": // 检查项
          this.$router.push({
            path: "/inspectItem/createItem",
            query: {
              type: "view",
              checkItemsId: row.id
            }
          });
          break;
        case "first": // 润滑点
        case "second": // 设备资料
        default:
          break;
      }
    },
    refreshList() {
      this.openDrawFlag = false;
      this.handleTabsClick();
    },
    closeDraw() {
      this.openDrawFlag = false;
    },
    showDialog() {
      this.dialogVisibleOperation = true;
      this.$gio.viewDeviceQrGuideline({
        entrance: "设备详情页"
      });
    },
    closeVisibleOperation() {
      this.dialogVisibleOperation = false;
    },
    tableRowEdit(row) {
      this.$router.push({
        path: "/inspectItem/createItem",
        query: {
          type: "editEeuip",
          pageFlag: "deviceEdit",
          checkItemsId: row.id
        }
      });
    },
    tableRowDelete(row) {
      this.deleteRow = row;
      this.deleteItemVisible = true;
    },
    // 确定删除
    confirmDeleteItem() {
      const params = {
        checkItemId: this.deleteRow.id
      };
      this.requestMethodGet("/device/check/checkItem/delete", params).then(res => {
        if (res.data.code == 1000) {
          this.deleteItemVisible = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.tableSize = 30;
          this.tableCurrent = 1;
          this.handleTabsClick();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // tabs点击
    handleClick() {
      this.tableSize = 30;
      this.tableCurrent = 1;
      this.handleTabsClick();
    },
    handleTabsClick() {
      let params = {};
      let url = "";
      params.deviceNumber = this.epInfo.deviceNumber;
      params.deviceId = this.epInfo.id;
      switch (this.activeName) {
        case "abnormal": // 异常post
          params.abnormalStatus = [0, 1];
          params.type = "post";
          params.menuCode = "Event_web";
          url = "/device/check/abnormal/queryListByPage";
          this.getTableData(url, params);
          this.$gio.changeTab_PC({
            tabType_PC: "异常记录"
          });
          this.$gio.viewEvent();
          break;
        case "task": // 任务记录post
          params.type = "post";
          params.taskType = this.taskNotes.taskTypeValue;
          params.dataScope = this.taskNotes.dataScope;
          params.startDate = this.taskNotes.startDate;
          params.endDate = this.taskNotes.endDate;
          params.menuCode = "Task_web";
          url = "/device/check/todoTask/queryTaskListByPage";
          this.getTableData(url, params);
          this.$gio.changeTab_PC({
            tabType_PC: "任务记录"
          });
          break;
        case "workOrder": // 工单记录get
          params.type = "get";
          params.orderBy = "workOrderNumber";
          params.menuCode = "NewWorkOrderList";
          url = "/web/workOrder/queryWorkOrderListByPage";
          this.getTableData(url, params);
          this.$gio.changeTab_PC({
            tabType_PC: "工单记录"
          });
          break;
        case "check": // 检查项post
          params.type = "post";
          params.menuCode = "inspectItem";
          url = "/device/check/checkItem/checkItemsListByPage";
          this.getTableData(url, params);
          this.$gio.changeTab_PC({
            tabType_PC: "检查项"
          });
          break;
        case "first": // 润滑点
          this.$gio.changeTab_PC({
            tabType_PC: "润滑点"
          });
          break;
        case "second": // 设备资料
          this.$gio.changeTab_PC({
            tabType_PC: "设备资料"
          });
          break;
        default:
          break;
      }
    },
    // 判断是否是空对象
    isObjectEmpty(obj) {
      return Object.keys(obj).length === 0;
    },
    // 创建检查项
    createCheckItem() {
      if (this.tableData.length > 30) {
        this.$message({
          type: "error",
          message: "已超过设备的检查项上限，请删除部分后重试"
        });
        return;
      }
      this.$router.push({
        path: "/inspectItem/createItem",
        query: {
          type: "add",
          pageFlag: "deviceCreate",
          deviceNumber: this.epInfo.deviceNumber,
          companyName: this.epInfo.companyName
        }
      });
      this.$gio.clickCreateCheckItemButton({
        entrance: "设备详情页",
        customer: this.epInfo.companyName
      });
    },
    // 表格页数改变
    tableSizeChange(val) {
      this.tableSize = val;
      this.handleTabsClick();
    },
    tableCurrentChange(val) {
      this.tableCurrent = val;
      this.handleTabsClick();
    },
    // 获取表格数据
    getTableData(url, params) {
      // 根据不同页签获取不同表格数据
      params.size = this.tableSize;
      params.current = this.tableCurrent;
      if (params.type == "post") {
        this.postTableApi(url, params);
      } else {
        this.getTableApi(url, params);
      }
    },
    postTableApi(url, params) {
      this.tableData = [];
      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data.list;
          if (this.activeName == "check") {
            if (data.length) {
              data.forEach(item => {
                let names = [];
                if (item.deviceOptionList && item.deviceOptionList.length) {
                  item.deviceOptionList.forEach(it => {
                    names.push(it.taskTypeName);
                  });
                }
                item.taskNames = names.length ? names.join(",") : "全部";
              });
            }
          }
          this.tableData = data;
          this.tableTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getTableApi(url, params) {
      this.requestMethodGet(url, params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data.list;
          this.tableData = data;
          this.tableTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getGroupList() {
      const params = {
        companyId: this.epInfo.companyId
      };
      this.requestMethodGet("/weChat/deviceGroup/getDeviceGroupTree", params).then(res => {
        if (res.data.code == 1000) {
          this.groupList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑分组
    editGroup() {
      this.$gio.editDeviceGroup({
        operation: "点击编辑分组按钮"
      });
      if (this.epInfo.deviceGroupList && this.epInfo.deviceGroupList.length) {
        // 需要把已选择的分组回显到级联数据中
        let arr = [];
        this.epInfo.deviceGroupList.forEach(it => {
          let idArr = [];
          idArr.push(it.visibleType);
          idArr.push(it.id);
          arr.push(idArr);
        });
        this.selectGroupId = arr;
      } else {
        this.selectGroupId = [];
      }
      this.editGroupFlag = true;
    },
    // 选择分组
    handleSearchTableData() {
      // console.log('=============',this.selectGroupId)
    },
    // 取消编辑分组弹框
    cancelEditGroup() {
      this.editGroupFlag = false;
    },
    // 确定编辑分组弹框
    confirmEdit() {
      this.$gio.editDeviceGroup({
        operation: "弹框中点击确定"
      });
      let list = [];
      if (this.selectGroupId.length) {
        this.selectGroupId.forEach(it => {
          list.push(it[it.length - 1]);
        });
      }
      const params = {
        deviceId: this.epInfo.id,
        gruopIdList: list
      };
      this.requestMethodPost("/weChat/deviceGroup/updateDeviceGroupByDeviceId", params).then(res => {
        if (res.data.code == 1000) {
          this.$_queryEPInfo(this.$route.query.deviceNumber);
          this.cancelEditGroup();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getOilList(val) {
      this.requestMethodGet("/mdm/oil/queryOilListByPage", { oilName: val, status: 1, size: 200, current: 1 }).then(res => {
        if (res.data.code == 1000) {
          this.oilList = res.data.data.list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
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
    // 编辑设备资料
    editDescribe(row) {
      // this.$set(row, "editing", true);
      this.$refs.deviceUpoad.openDialog({ deviceId: this.$route.query.deviceId, companyId: this.epInfo.companyId, editFlag: 1, fileInfo: row });
    },
    // 保存设备资料
    saveDescribe(row) {
      let params = {
        fileDesc: row.fileDesc,
        id: row.id,
        companyId: row.companyId
      };
      this.requestMethodPost("/web/deviceInstructions/updateDeviceInstructions", params).then(res => {
        this.loading = false;
        if (res.data.code == 1000) {
          this.$set(row, "editing", false);
          // 刷新设备资料列表
          this.$_getDeviceData();
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 取消
    cancleDescribe(row) {
      this.$set(row, "editing", false);
      // 刷新设备资料列表
      this.$_getDeviceData();
    },
    // 获取设备资料列表
    $_getDeviceData() {
      this.loading = true;
      let params = { ...this.pagenation, deviceId: this.$route.query.deviceId ? this.$route.query.deviceId : this.epInfo.id };
      this.requestMethodGet("/web/deviceInstructions/getInstructionsByDeviceId", params).then(res => {
        this.loading = false;
        if (res.data.code == 1000) {
          this.instructionsData = res.data.data.list;
          this.instructionsData.map(item => {
            this.$set(item, "editing", false);
          });
          this.totalNumber = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    handleCurrentChangeUpload(val) {
      this.pagenationUpload.current = val;
      this.getAllDeviceInfo();
    },
    handleSizeChangeUpload(val) {
      this.pagenationUpload.size = val;
      this.getAllDeviceInfo();
    },
    // size change
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getDeviceData();
    },
    // current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.$_getDeviceData();
    },
    // 删除设备资料
    async handleDeleteData(row) {
      this.$confirm("此操作将删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let params = {
            id: row.id,
            companyId: row.companyId
          };

          const res = await this.requestMethodGet("/web/deviceInstructions/deleteDeviceInstructions", params);
          if (res.data.code == 1000) {
            this.$_getDeviceData();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //   上传文件
    handleReportChange(file, fileList) {
      if (!file.raw.type.startsWith("application")) {
        fileList.pop();
        this.$message.error("只能上传pdf / word / excel / ppt 类型文件");
        return;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.$message({
          type: "error",
          message: "请选择100M以内的文件"
        });
        return;
      }
      this.sopFileRow = file.raw;
    },
    // 上传报告
    handleUploadForm(param) {
      let formData = new FormData();
      formData.append("deviceNumber", this.$route.query.deviceNumber); // 额外参数
      formData.append("file", this.sopFileRow);
      formData.append("fileName", param.file.name);
      this.requestMethodPost("/weChat/device/uploadDeviceInstructions", formData)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.pagenation.current = 1;
            this.$message({
              message: "上传设备资料成功",
              type: "success"
            });
            this.$_getDeviceData();
            this.activeName = "second";
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleWorkOrder(row) {
      if (this.workOrderBtn) {
        const params = {
          deviceNumber: this.$route.query.deviceNumber
        };
        this.requestMethodGet("/web/common/device/canGetDevice", params).then(res => {
          if (res.data.code == 1000) {
            if (res.data) {
              if (row.serviceType == 1) {
                this.$router.push({
                  path: "/NewWorkOrderList/newWorkOrderOilDetail",
                  query: {
                    workOrderNumber: row.trendsKey
                  }
                });
              } else if (row.serviceType == 9 || row.serviceType == 11) {
                this.$router.push({
                  path: "/NewWorkOrderList/newWorkOrderDetail",
                  query: {
                    workOrderNumber: row.trendsKey
                  }
                });
              } else if (row.serviceType == 2) {
                this.$router.push({
                  path: "/NewWorkOrderList/newWorkorderTaskDetail",
                  query: {
                    workOrderNumber: row.trendsKey
                  }
                });
              }
            } else {
              this.$message({
                message: "当前账号权限不足",
                type: "warning"
              });
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      } else {
        this.$message({
          message: "当前账号权限不足",
          type: "warning"
        });
      }
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.formatData(data[i].children);
        }
      }
      return data;
    },
    // 创建申请单
    createWorkOrder() {
      this.getApplyReasonConfTree();
      this.getOilTypeData();
      this.$_queryLPData();
      this.getCompanyPeople(this.epInfo.customerNumber);
      // 获取默认客户对应的执行人
      this.changeCompany(this.epInfo.companyId);
      this.questionForm = {
        spId: this.questionForm.spId,
        description: "",
        contactUserId: ""
      };
      if (this.userInfo.userType == 2) {
        this.questionForm.contactUserId = this.userInfo.userId;
      }
      this.checkList = [];
      this.addApplyVisibled = true;
    },
    // 跳转所属客户详情
    toCustomerDetail(epInfo) {
      if (epInfo) {
        this.$router.push({
          path: "/CustomerProfile/CustomerProfileDetail",
          query: {
            companyNumber: epInfo.customerNumber,
            companyId: epInfo.companyId,
            scaleList: JSON.stringify(this.scaleList)
          }
        });
        his.$gio.toCustomerDetails({
          entrance: "设备详情页"
        });
      }
    },
    getNameListData(deviceCode) {
      const params = {
        deviceCode: deviceCode,
        lubPointName: "",
        status: 1,
        current: 1,
        size: 100
      };
      this.requestMethodGet("/device/coreDeviceLubPoint/pageList", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data.list || [];
          if (data.length) {
            data.forEach(it => {
              it.isCustomFlag = false;
            });
          }
          let obj = {
            lubPointName: "自定义",
            isCustomFlag: true
          };
          data.push(obj);
          this.lupDeviceNameList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 添加润滑点成功
    addOrEditLup() {
      this.addLubricationPointDialog = false;
      this.$_queryEPInfo(this.$route.query.deviceNumber);
      this.$_getLubricatePointData(this.$route.query.deviceNumber); // 润滑点列表
    },
    // 关闭弹框
    closeDialog() {
      this.dialogFlag = false;
    },
    // 编辑润滑点
    editLup() {
      this.deviceTypeDialog = "editLumPoint";
      this.addLubricationPointDialog = true;
    },
    // 添加润滑点
    addLup() {
      this.deviceTypeDialog = "addLumPoint";
      this.addLubricationPointDialog = true;
    },
    // 查看动态图片
    viewPic(url) {
      this.dialogImageUrl = url;
      this.imgDialogVisible = true;
    },
    // 管理设备二维码
    manageCard() {
      this.isloadingCard = true;
      this.cardForm.cardId = this.epInfo.cardNumber || "";
      this.viewNameplate();
      if (!this.epInfo.cardNumber) {
        this.$gio.clickAddDeviceQrButton();
      } else {
        this.$gio.viewDeviceQr({
          device: this.epInfo.deviceName,
          QrID: this.epInfo.cardNumber,
          customer: this.epInfo.companyName
        });
      }
    },
    // 编辑
    editEpt() {
      this.deviceTypeDialog = "editDevice";
      // this.deviceTypeDialog = 'editDeviceAndLumPoint'
      // this.selectLubricationPointNumber='L20231113-000003'
      this.addDeviceDialog = true;
    },
    sum(arr) {
      return eval(arr.join("+"));
    },
    // 删除
    deleteEpt() {
      this.$gio.deleteDevice({
        customer: this.epInfo.companyName,
        operation: "点击删除设备按钮"
      });
      let hasOilPlanList = [];
      let iotDeviceRelationList = [];
      let hasOilPlanListStr;
      let workOrderRelationList = [];
      let workOrderRelationStr;
      let serviceNameList;
      let str;
      let moreWorkOrder = false;
      let thirdCount = [];
      let iotDeviceRelationListStr;
      let params = {
        deviceNumber: this.$route.query.deviceNumber
      };
      this.requestMethodGet("/recycle/checkDeviceLubricationPointRelation", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            let dataList = res.data;
            dataList.map(item => {
              if (item.hasPlantStudyWorkOrder) {
                serviceNameList = item.thirdServiceName;
                if (item.lubricationPointName) {
                  hasOilPlanList.push(item.lubricationPointTypeName + "-" + item.lubricationPointName);
                } else {
                  hasOilPlanList.push(item.lubricationPointTypeName);
                }
              }
              if (item.workOrderRelation || item.mslaWorkOrderRelation) {
                serviceNameList = item.thirdServiceName;
                if (item.lubricationPointName) {
                  workOrderRelationList.push(item.lubricationPointTypeName + "-" + item.lubricationPointName);
                } else {
                  workOrderRelationList.push(item.lubricationPointTypeName);
                }
              }
              if (item.thirdServiceCount) {
                thirdCount.push(item.thirdServiceCount);
              }
              if (item.iotDeviceRelation) {
                if (item.lubricationPointName) {
                  item.lubricationPointTypeName = item.lubricationPointTypeName + "-" + item.lubricationPointName;
                } else {
                  item.lubricationPointTypeName = item.lubricationPointTypeName;
                }
                iotDeviceRelationList.push(`该设备下的润滑点[${item.lubricationPointTypeName}]已关联IOT设备[${item.deviceName}]`);
                if (iotDeviceRelationList.length == 3) {
                  iotDeviceRelationList.push("...");
                }
              }
            });
            let thirdCountTotal = 0;
            if (thirdCount.length > 1) {
              thirdCountTotal = this.sum(thirdCount);
            }
            let msg = "删除设备后，所有润滑点的相关信息也将被删除。";
            let title = "删除该设备？";
            // Iot 关联
            if (iotDeviceRelationList.length) {
              iotDeviceRelationListStr = iotDeviceRelationList.toString();
              str = `${iotDeviceRelationListStr}请先解除关联。`;
            }
            if (iotDeviceRelationList.length || hasOilPlanList.length || workOrderRelationList.length) {
              title = "无法删除设备";
              if (iotDeviceRelationList.length) {
                str = `${iotDeviceRelationListStr}请先解除关联。`;
              }
              if (hasOilPlanList.length) {
                hasOilPlanListStr = hasOilPlanList[0].toString();
                if (thirdCountTotal > 1) {
                  str = `该设备下的润滑点【${hasOilPlanListStr}】正在进行【${serviceNameList}】等任务，不可删除`;
                } else {
                  str = `该设备下的润滑点【${hasOilPlanListStr}】正在进行【${serviceNameList}】，不可删除`;
                }
              }
              if (workOrderRelationList.length) {
                workOrderRelationStr = workOrderRelationList[0].toString();
                if (thirdCountTotal > 1) {
                  str = `该设备下的润滑点【${workOrderRelationStr}】正在进行【${serviceNameList}】等任务，不可删除`;
                } else {
                  str = `该设备下的润滑点【${workOrderRelationStr}】正在进行【${serviceNameList}】，不可删除`;
                }
              }
              this.$confirm(str, title, {
                closeOnClickModal: false,
                confirmButtonText: "我知道了",
                showCancelButton: false,
                customClass: "deletBtn",
                type: "warning"
              })
                .then(() => {})
                .catch(() => {});
            } else {
              this.$confirm(msg, title, {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                customClass: "deletBtn",
                type: "warning"
              })
                .then(() => {
                  this.requestMethodGet("/recycle/deleteDevice", params)
                    .then(res => {
                      res = res.data;
                      if (res.code == 1000) {
                        this.$message({
                          message: "删除成功",
                          type: "success"
                        });
                        this.$router.push({
                          name: "EquipmentProfile"
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
    // 润滑点点击
    clickLupItem(id, val) {
      let checkedNum = "";
      let checkedId = "";
      this.menus.forEach(item => {
        if (item.id == id) {
          item.isActive = true;
          checkedNum = item.lubricationPointNumber;
          checkedId = item.id;
        } else {
          item.isActive = false;
        }
      });
      this.selectLubricationPointNumber = checkedNum;
      this.seleWayId = checkedId;
      this.$_getLubricationPointDetail(); // 润滑点列表
      this.current = 1; // 切换润滑点时，设置current 为1
      this.$gio.viewDetailsOfOilConsumption({
        customer: this.epInfo.companyName
      });
    },
    // 获取油品品牌/类型/系列/名称 方法
    getQueryOilList(type, oilNumber, listName) {
      let params = {};
      if (type == 0) {
        params = {
          parentCode: 0,
          status: 1
        };
      } else if (type == 3) {
        params = {
          parentCode: oilNumber,
          status: 1
        };
      }
      this.requestMethodGet("/mdm/oil/queryOilList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map(item => {
                return { value: item.code, label: item.name };
              });
              switch (listName) {
                case "oilListAdd":
                  this.oilListAdd = optionData;
                  break;
                case "recommendOilSeriesList":
                  this.recommendOilSeriesList = optionData;
                  break;
                case "oilBrandList":
                  this.oilBrandList = optionData;
                  break;
                case "oilSeriesListAdd":
                  this.oilSeriesListAdd = optionData;
                  break;
                default:
                  break;
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
    },
    // 查询动态信息  /web/device/queryOilChangeTrendsByPage
    $_queryOilChangeTrendsByPage() {
      let params = {
        lubricationPointNumber: this.selectLubricationPointNumber,
        size: 5,
        current: this.current
      };
      this.requestMethodGet("/web/device/queryOilChangeTrendsByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const list = res.data.list;
            if (list.length > 0) {
              list.forEach(item => {
                let dynamicType = "";
                if (item.trendsType == "1") {
                  dynamicType = "油品分析";
                } else if (item.trendsType == "3") {
                  dynamicType = "任务";
                } else if (item.trendsType == "9") {
                  dynamicType = "服务";
                }
                item.dynamicTitle = item.createTime + " " + dynamicType;
              });
            }
            this.countData = list;
            this.countTrends = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 重置修改历史搜索条件
    handleResetHistory() {
      this.searchFormLog = {
        fieldCode: "",
        time: []
      };
      // 调取列表接口
      this.currentLog = 1;
      this.updateLogData = [];
      this.$_queryUpdateLog("");
    },
    // 修改历史 搜索事件
    handleSearchLogData() {
      this.currentLog = 1;
      this.updateLogData = [];
      this.$_queryUpdateLog("");
    },

    // 删除润滑点
    checkLubricationPoint() {
      let params = {
        lubricationPointNumber: this.selectLubricationPointNumber
      };
      this.requestMethodGet("/web/lubricationPoint/checkLubricationPointRelation", params)
        .then(res => {
          res = res.data;
          console.log(res);
          if (res.code == 1000) {
            let msg = "是否删除润滑点？";
            if (res.data.hasOilPlan) {
              msg = "确认删除润滑点和换油记录吗？";
            }
            if (res.data.iotDeviceRelation || res.data.hasPlantStudyWorkOrder || res.data.workOrderRelation || res.data.mslaWorkOrderRelation) {
              let str = "";
              if (res.data.iotDeviceRelation) {
                str = `失败原因：已关联设备【${res.data.deviceName}】，请先解除关联！`;
              }
              if (res.data.workOrderRelation || res.data.mslaWorkOrderRelation || res.data.hasPlantStudyWorkOrder) {
                if (res.data.thirdServiceCount == 1) {
                  str = `失败原因：润滑点正在进行【${res.data.thirdServiceName}】，不可删除`;
                } else {
                  console.log(1112666);
                  str = `失败原因：润滑点正在进行【${res.data.thirdServiceName}】等任务，不可删除`;
                }
              }
              this.$gio.deleteLubrPoint({
                operation: "点击删除按钮",
                customer: this.addLupForm.companyName
              });
              this.$confirm(str, "删除失败", {
                closeOnClickModal: false,
                confirmButtonText: "我知道了",
                showCancelButton: false,
                customClass: "deletBtn",
                type: "warning"
              })
                .then(() => {})
                .catch(() => {});
            } else {
              this.$confirm(msg, "", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                customClass: "deletBtn",
                type: "warning"
              })
                .then(() => {
                  const params = {
                    lubricationPointNumber: this.selectLubricationPointNumber
                  };
                  this.requestMethodGet("/web/lubricationPoint/deleteLubricationPoint", params).then(res => {
                    if (res.data.code == 1000) {
                      this.$message({
                        message: "删除成功",
                        type: "success"
                      });
                      this.$_getLubricatePointData(this.$route.query.deviceNumber); // 润滑点列表
                    } else {
                      this.$message({
                        message: res.msg,
                        type: "warning"
                      });
                    }
                  });
                })
                .catch(() => {});
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
    loadMoreDataLog() {
      if (this.loadMoreLogFlag && this.updateLogData.length < this.countUpdateLog) {
        ++this.currentLog;
        this.$_queryUpdateLog("scroll");
      }
    },
    // 查询修改字段下拉
    $_queryFieldNames() {
      this.requestMethodGet("/device/LubUpdateLog/fieldDropdownList")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.fieldNamesData = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 修改历史数据导出
    async exportLog() {
      this.hoverLoading = true;
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = "";
      let paramObj = {};
      if (this.searchFormLog.time && this.searchFormLog.time.length > 0) {
        url = "/device/LubUpdateLog/exportDeviceLubUpdateLog";
        paramObj = {
          deviceId: this.epInfo.id,
          lubricationPointId: this.seleWayId,
          fieldCode: this.searchFormLog.fieldCode,
          startTime: this.searchFormLog.time[0],
          endTime: this.searchFormLog.time[1],
          responseTypeBlob: true
        };
      } else {
        url = "/device/LubUpdateLog/exportDeviceLubUpdateLog";
        paramObj = {
          deviceId: this.epInfo.id,
          lubricationPointId: this.seleWayId,
          fieldCode: this.searchFormLog.fieldCode,
          startTime: "",
          endTime: "",
          responseTypeBlob: true
        };
      }
      this.requestMethodGet(url, paramObj)
        .then(res => {
          loading.close();
          let fileReader = new FileReader();
          let that = this;
          fileReader.onload = function() {
            try {
              let jsonData = JSON.parse(this.result);
              if (jsonData.code) {
                that.$message({
                  message: jsonData.msg,
                  type: "error"
                });
                return;
              }
            } catch (err) {
              const blob = new Blob([res.data], {
                type: "application/vnd.ms-excel"
              });

              const objectUrl = URL.createObjectURL(blob);
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", "修改历史数据.xlsx");
              document.body.appendChild(link);
              link.click();
              that.$message({
                message: "下载成功",
                type: "success"
              });
              this.hoverLoading = false;
            }
          };
          fileReader.readAsText(res.data);
        })
        .catch(res => {
          loading.close();
        });
    },
    // 查询 修改历史
    $_queryUpdateLog(val) {
      this.loadingLog = true;
      let params = {
        deviceId: this.epInfo.id,
        lubricationPointId: this.seleWayId,
        fieldCode: this.searchFormLog.fieldCode,
        startTime: "",
        endTime: "",
        size: 20,
        current: this.currentLog
      };
      if (this.searchFormLog.time && this.searchFormLog.time.length > 0) {
        params.startTime = this.searchFormLog.time[0];
        params.endTime = this.searchFormLog.time[1];
      }
      this.requestMethodPost("/device/LubUpdateLog/listByPage", params)
        .then(res => {
          this.loadingLog = false;
          res = res.data;
          if (res.code == 1000) {
            if (val == "") {
              this.updateLogData = res.data.list;
            } else {
              this.updateLogData = this.updateLogData.concat(res.data.list);
            }
            this.countUpdateLog = res.data.totalCount;
            if (this.updateLogData.length < this.countUpdateLog) {
              this.loadMoreLogFlag = true;
            } else {
              this.loadMoreLogFlag = false;
            }
          } else {
            this.loadingLog = false;
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查看修改历史详情 查看更多
    loadMoreEditDetail() {
      if (this.loadMoreEditDetailFlag && this.updateLogDetailData.length < this.countUpdateLogDetail) {
        ++this.currentEditDetail;
        this.handleLookDetail(this.updateLogDetailObj, "scroll");
      }
    },
    // 查看修改历史详情
    handleLookDetail(row, val) {
      if (val == "") {
        this.currentEditDetail = 1;
      }
      this.editDetailDialog = true;
      this.loadMoreDataDetail = true;
      this.updateLogDetailObj = row;
      const params = {
        id: this.EncryptUserId(row.id),
        current: this.currentEditDetail,
        size: 20
      };
      this.requestMethodGet("/device/LubUpdateLog/queryDeviceLubUpdateLogDetail", params).then(res => {
        this.loadMoreDataDetail = false;
        if (res.data.code == 1000) {
          if (!val) {
            this.updateLogDetailData = res.data.data.list;
          } else {
            this.updateLogDetailData = this.updateLogDetailData.concat(res.data.data.list);
          }
          this.countUpdateLogDetail = res.data.data.totalCount;
          if (this.updateLogDetailData.length < this.countUpdateLogDetail) {
            this.loadMoreEditDetailFlag = true;
          } else {
            this.loadMoreEditDetailFlag = false;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 在用油品品牌 change
    selectOilBrand(val) {
      this.selectOil = val;
      this.OilTypeList = [];
      this.oilSeriesList = [];
      this.oilList = [];
      this.addLubricatePointData.oilType = "";
      this.addLubricatePointData.oilSeries = "";
      this.addLubricatePointData.oilName = "";
      this.getQueryOilList("3", val, "oilList");
    },
    // 查询换油单位配置数据
    $_queryOilChangePeriodData() {
      this.requestMethodGet("/web/device/getOilChangePeriodUnitConfig")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map(item => {
                return { oilChangePeriodUnit: item.oilChangePeriodUnit, oilChangePeriodUnitDesc: item.oilChangePeriodUnitDesc };
              });
              this.oilChangePeriodList = optionData;
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
    // 润滑点设备类型 change 事件
    handleLubricationPointTypeChange(val) {
      if (val.length > 0) {
        var obj = {};
        obj = this.lubricationPointTypeList.find(item => {
          return item.code === val[0];
        });
        var objChild = obj.children.find(element => {
          return element.code == val[1];
        });
        this.addLubricatePointData.lubricationPointTypeCode = objChild.code;
        this.addLubricatePointData.lubricationPointType = objChild.name;
      }
    },
    // 加载更多
    loadMore() {
      this.current += 1;
      let params = {
        lubricationPointNumber: this.selectLubricationPointNumber,
        size: 5,
        current: this.current
      };
      this.requestMethodGet("/web/device/queryOilChangeTrendsByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const list = res.data.list;
            if (list.length > 0) {
              list.forEach(item => {
                let dynamicType = "";
                if (item.trendsType == "1") {
                  dynamicType = "油品分析";
                } else if (item.trendsType == "3") {
                  dynamicType = "任务";
                } else if (item.trendsType == "9") {
                  dynamicType = "服务";
                }
                item.dynamicTitle = item.createTime + " " + dynamicType;
              });
            }
            this.countTrends = res.data.totalCount;
            this.countData = this.countData.concat(list);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },

    // 添加图片
    handleAddFile(file, fileList) {
      if (!file.raw.type.startsWith("image")) {
        this.ImageList = [];
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.imageList = [];
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      let fileName = file.name;
      this.imageList.push({ url: file.url });
      this.addLubricatePointData.imgFile = file.raw;
    },
    // 删除图片
    handleRemove(fileList) {
      this.addLubricatePointData.imgFile = "";
      this.imageList = [];
      setTimeout(() => {
        this.hideUpload = fileList.length >= 1;
      }, 500);
    },
    // 查询设备档案详情
    async $_queryEPInfo(deviceNumber) {
      let params = {
        deviceNumber
      };
      await this.requestMethodGet("/web/device/queryDevice", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data;
            data.createTime = this.moment(new Date(data.createTime)).format("YYYY-MM-DD");
            const date = new Date().getTime();
            if (Math.floor((date - data.createTimeMills) / 1000 / 60 / 60 / 24) == 0) {
              data.creatNew = true;
            }
            if (Math.floor((date - data.updateTimeMills) / 1000 / 60 / 60 / 24) == 0) {
              data.editNew = true;
            }
            this.epInfo = data;
            // let distributorCompanyNumbersList = this.epInfo.distributorCompanyNumbers&&this.epInfo.distributorCompanyNumbers.includes(',')?this.epInfo.distributorCompanyNumbers.split(','):[this.epInfo.distributorCompanyNumbers]
            // if(distributorCompanyNumbersList.includes(this.userInfo.companyNumber)){
            //   this.showCreateApply = true
            // }
            this.applyAllocationObj.customerType = this.epInfo.customerType;
            this.applyAllocationObj.distributorCompanyName = this.epInfo.companyName;
            if (this.epInfo.manufacturer.length > 10) {
              this.qrCardDetail.manufacturer = this.epInfo.manufacturer.substr(0, 10) + "...";
            } else {
              this.qrCardDetail.manufacturer = this.epInfo.manufacturer;
            }

            if (this.epInfo.deviceModel.length > 10) {
              this.qrCardDetail.deviceModel = this.epInfo.deviceModel.substr(0, 10) + "...";
            } else {
              this.qrCardDetail.deviceModel = this.epInfo.deviceModel;
            }

            if (this.epInfo.deviceCode.length > 10) {
              this.qrCardDetail.deviceCode = this.epInfo.deviceCode.substr(0, 10) + "...";
            } else {
              this.qrCardDetail.deviceCode = this.epInfo.deviceCode;
            }

            if (this.epInfo.devicePosition.length > 10) {
              this.qrCardDetail.devicePosition = this.epInfo.devicePosition.substr(0, 10) + "...";
            } else {
              this.qrCardDetail.devicePosition = this.epInfo.devicePosition;
            }
            this.getGroupList(); // 获取分组树
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查询润滑点列表
    $_getLubricatePointData(deviceNumber) {
      let params = {
        deviceNumber
      };
      this.requestMethodGet("/web/lubricationPoint/queryLubricationPointList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              const data = res.data;
              data.forEach(async (item, idx) => {
                if (idx == 0) {
                  item.isActive = true;
                } else {
                  item.isActive = false;
                }
                if (item.lubricationPointPicRelativePath) {
                  let lubricationPointPicPath = await this.getFullpath(item.lubricationPointPicRelativePath);
                  this.$set(item, "lubricationPointPicPath", lubricationPointPicPath);
                }
              });
              this.menus = data;
              this.selectLubricationPointNumber = this.menus[0].lubricationPointNumber;
              this.seleWayId = this.menus[0].id;
              this.$_getLubricationPointDetail(); // 获取润滑点详情
            } else {
              this.menus = [];
              this.selectLubricatePointData = {};
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
    async getFullpath(halfPath) {
      const res = await this.requestMethodGet("/web/file/getFullUrl", {
        url: halfPath
      });
      if (res.data.code == 1000) {
        return Promise.resolve(res.data.data);
      } else {
        this.$message({
          type: "warning",
          message: "获取全路径失败，请稍后重试。"
        });
      }
    },
    showOrHideState(lubricationPointTypeCode, lubricationMethod) {
      if (lubricationMethod == "lubrication_method_0004" || (lubricationMethod == "lubrication_method_0003" && lubricationPointTypeCode == "lubrication_point_type_0011")) {
        return 1;
      } else if (
        lubricationMethod == "lubrication_method_0001" ||
        lubricationMethod == "lubrication_method_0002" ||
        lubricationMethod == "lubrication_method_0008" ||
        (lubricationMethod == "lubrication_method_0003" && lubricationPointTypeCode != "lubrication_point_type_0011")
      ) {
        return 0;
      } else if (
        lubricationMethod == "lubrication_method_0005" ||
        lubricationMethod == "lubrication_method_0006" ||
        lubricationMethod == "lubrication_method_0007" ||
        lubricationMethod == "lubrication_method_0009"
      ) {
        return 2;
      } else {
        return null;
      }
    },
    // 获取全路径赋值imgFullDtoUrl
    async getFullImg(item, path) {
      const params = {
        url: path
      };
      await this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          console.log(res.data.data, item);
          let imageList = [];
          imageList.push({ url: res.data.data });
          console.log(imageList);
          this.$set(item, "imgFullDtoUrl", imageList);
          console.log(item);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 查看润滑点详情
    $_getLubricationPointDetail() {
      if (!this.selectLubricationPointNumber) return;
      let params = {
        lubricationPointNumber: this.selectLubricationPointNumber
      };
      this.requestMethodGet("/web/device/queryLubricationPointDetail", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$_queryOilChangeTrendsByPage(); // 查询动态信息
            this.currentLog = 1;
            if (res.data.deviceWorkComponentList.length == 0) {
              this.fields = [];
            } else {
              res.data.deviceWorkComponentList.forEach(it => {
                if (it.componentType == 2) {
                  let nameObj = it.optionsDtos.filter(name => name.value == it.value);
                  console.log(nameObj);
                  if (nameObj.length > 0) {
                    it.name = nameObj[0].option;
                  }
                }
                if (it.componentType == 11) {
                  for (var child in it.componentList) {
                    it.componentList[child].forEach(child2 => {
                      if (child2.componentType == "1" && child2.value) {
                        this.showFlag = true;
                      }
                      if (child2.componentType == "1" && !child2.value) {
                        this.showFlag = false;
                      }
                      if (child2.componentType == "2") {
                        if (child2.value) {
                          let nameObj2 = child2.optionsDtos.filter(name1 => name1.value == child2.value);
                          console.log(nameObj2);
                          if (nameObj2.length > 0) {
                            child2.name = nameObj2[0].option;
                          }
                        } else {
                          child2.name = "";
                        }
                      }
                    });
                  }
                  console.log(res.data.deviceWorkComponentList);
                }
                if (it.componentType == 12) {
                  for (var child in it.componentList) {
                    it.componentList[child].forEach(child2 => {
                      if (child2.componentType == "8") {
                        if (child2.value) {
                          this.getFullImg(child2, child2.value);
                        }
                      }
                    });
                  }
                  console.log(res.data.deviceWorkComponentList);
                }
              });
              this.fields = [...res.data.deviceWorkComponentList];
            }
            this.updateLogData = [];
            this.$_queryUpdateLog(""); // 查询修改历史
            this.selectLubricatePointData = res.data;

            console.log(this.selectLubricatePointData);
            const { lubricationPointTypeCode, lubricationMethod } = this.selectLubricatePointData;
            this.showOrHideStateFlag = this.showOrHideState(lubricationPointTypeCode, lubricationMethod);
            this.oilBrandCodeAdd = this.selectLubricatePointData.oilBrandCode;
            if (!this.oilBrandCodeAdd) {
              this.oilBrandCodeAdd = "oil_0001";
            }
            this.recommendOilName = this.selectLubricatePointData.recommendOilName;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 新建
    handleAdd() {
      this.visibleDetail = false; // 查看的具体详情隐藏
      this.visibleAdd = true; // 新建展示
    },
    async previewFile(row) {
      const params = {
        url: encodeURI(row.fileUrl)
      };
      const res = await this.requestMethodGet("/web/file/getFullUrl", params);
      if (res.data.code == 1000) {
        window.open(res.data.data, "_blank");
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },

    // 查看润滑点换油记录
    handleLook(row) {
      const params = {
        url: row.fileUrl
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
    handlePreviewFile(row) {
      window.open(row.fileUrl);
    },
    // 编辑
    handleEdit() {
      this.$router.push({
        path: "/EquipmentProfile/EditEquipmentProfile",
        query: {
          deviceNumber: this.$route.query.deviceNumber
        }
      });
    },
    // 下载服务报告
    handleDownLoad(url) {
      window.open(url);
    },
    // 返回
    handleResetFrom(formName) {
      this.visibleDetail = true;
      this.visibleAdd = false;
      this.$refs[formName].resetFields();
    },
    // 返回
    handleBack(formName) {
      this.$router.push({
        name: "EquipmentProfile",
        params: { isSaveQuery: true }
      });
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 160}px`;
    },
    // 查看设备铭牌
    viewNameplate() {
      const params = {
        deviceNumber: this.$route.query.deviceNumber,
        withLogoFlag: this.isIncludeLogo ? 1 : 0
      };
      this.requestMethodGet("/web/device/getQrFullPath", params)
        .then(res => {
          this.isloadingCard = false;
          if (res.data.code == 1000) {
            this.epInfo.cardFullPath = res.data.data;
            this.eptCardFlag = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.isloadingCard = false;
        });
    },
    // 下载二维码
    redownload() {
      this.isloadNameplate = true;
      const params = {
        deviceNumber: this.$route.query.deviceNumber,
        withLogoFlag: this.isIncludeLogo ? 1 : 0
      };
      this.requestMethodGet("/qr/manage/downloadDeviceQr", params)
        .then(res => {
          this.isloadNameplate = false;
          this.eptCardFlag = false;
          res = res.data;
          if (res.code == 1000) {
            window.location.href = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.isloadNameplate = false;
          this.eptCardFlag = false;
        });
    },
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.$set(this.userDetail, "headUrl", res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取人详情
    getUserDetailById(val, index, type) {
      if (val) {
        this.userDetail = {};
        let param = {
          userId: val
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.$refs[`popovers-${index}`].doShow();
                this.userDetail = res.data;
                if (this.userDetail.avatar) {
                  this.getFullUrl(this.userDetail.avatar);
                }
                if (this.userDetail.roleNames) {
                  this.userDetail.roleNames = this.userDetail.roleNames.join(",");
                }
                if (this.userDetail.phonenumber) {
                  const phoneNum = this.userDetail.phonenumber;
                  this.userDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                }
              } else {
                this.$refs[`popovers-${index}`].doClose();
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
    // 查看人详情
    getUserDetail(scope) {
      this.userDetail = {};
      if (scope.row.userId) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        this.getUserDetailById(scope.row.userId, scope.$index, "");
      }
    },
    taskTypeChange(val) {
      this.taskNotes.taskTypeValue = val;
      this.handleTabsClick();
    },
    taskTimeChange(val) {
      this.taskNotes.dataScope = 4;
      if (val) {
        this.taskNotes.startDate = val[0];
        this.taskNotes.endDate = val[1];
      } else {
        this.taskNotes.startDate = "";
        this.taskNotes.endDate = "";
      }
      this.tableSize = 30;
      this.tableCurrent = 1;
      this.handleTabsClick();
    },
    // 切换是否包含logo
    changeIsIncludeLogo() {
      this.isloadingCard = true;
      this.viewNameplate();
    },
    // 获取当前客户是否是分管人且有执行权限展示执行人
    async changeCompany(companyId, companyNumber) {
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
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-upload {
  border: none;
}
/deep/ .el-tabs__header {
  margin: 0px !important;
}
.look-img {
  font-weight: 400;
  font-size: 14px;
  color: #001450;
  text-decoration: underline;
  cursor: pointer;
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
.lup-info {
  border: 1px solid #e9e9e9;
  border-radius: 6px;
  width: 100%;
  display: flex;
  margin-bottom: 40px;
}
.content-title {
  font-size: 14px;
  color: #000;
  font-weight: bold;
}
.lup-left {
  padding: 16px 0;
  width: 270px;
  border-right: 1px solid #e9e9e9;
}
.left-padding {
  padding: 0 20px;
}
.lup-li {
  // height: 48px;
  // line-height: 48px;
  text-align: left;
  font-size: 14px;
  color: #333;
  padding: 0 20px;
  cursor: pointer;
}
.lup-name {
  width: 100%;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 21px;
  padding: 21px 0px;
}
.lup-right {
  padding: 16px 20px;
  flex: 1;
}
.none-img {
  width: 48px;
  height: 48px;
  font-size: 14px;
  border-radius: 50%;
  background-color: #001450;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-wrap-eq {
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
  display: inline-block;
  overflow: hidden;
}
.has-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}
.title-lup {
  font-size: 13px;
  color: #999;
  line-height: 25px;
}
.type-name {
  font-size: 16px;
  color: #000;
}
.form_item_height {
  margin-bottom: 18px;
  // height:30px !important;
  line-height: 50px !important;
}
.dynamic-content {
  height: 40px;
  border-bottom: 2px solid #e9e9e9;
}
.dynamic-title {
  font-size: 14px;
  font-weight: bold;
  color: #000;
  line-height: 40px;
  width: 28px;
  border-bottom: 2px solid #dd0000;
}
/deep/ .el-timeline-item__timestamp {
  font-size: 13px;
  font-weight: bold;
  color: #000;
}
/deep/ .table-wrap {
  width: 100%;
  height: 400px;
  overflow-y: scroll;
}
/deep/ .table-wrap .el-table::before {
  height: 0px;
}
.member-number {
  height: 31px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 24px 0;
}
.ept-status {
  font-size: 12px;
  border-radius: 4px;
  padding: 3px 10px;
}
.company-content {
  display: flex;
  align-items: center;
}
.notice-loading {
  text-align: center;
  margin-top: 20px;
  color: #999;
  font-size: 14px;
  cursor: pointer;
}
.company-img {
  width: 64px;
  height: 64px;
  background-color: #f9f9f9;
  border-radius: 6px;
  border: solid 1px #e9e9e9;
}
.company-info {
  margin-left: 12px;
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
  margin-left: 10px;
  padding: 0 9px;
}
.equipment-profile-detail {
  padding: 0 20px;
  height: 100%;
  overflow: auto;
  &-title {
    color: #999;
    font-size: 14px;
  }
  &-base-info {
    padding: 10px 0 20px;
    overflow: hidden;
  }
  &-header {
    width: 100%;
    height: 40px;
    background: rgb(247, 247, 247);
    line-height: 40px;
    padding-left: 20px;
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0;
  }
  .setLineHeight .el-form-item__content {
    line-height: 20px !important;
  }
  .el-menu-item {
    border: 1px solid #dcdfe6;
    margin-bottom: 10px;
    border-radius: 10px;
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    color: #999;
  }
  .el-menu-item.is-active {
    border: 1px solid #179bff;
    color: #179bff;
  }
  .break-all {
    word-break: break-all;
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
  .select_person {
    width: 80%;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }
  .item-service {
    height: 24px;
    line-height: 24px;
    padding: 0 8px;
    background: rgba(0, 0, 0, 0.05);
  }
  .icon-service {
    width: 18px;
    height: 18px;
  }
  /deep/.el-upload--picture-card {
    width: 114px;
    height: 114px;
    line-height: 114px;
  }
  /deep/.el-upload-list--picture-card .el-upload-list__item {
    width: 114px;
    height: 114px;
  }
  .formStyle .el-form-item__content {
    height: 30px !important;
  }
  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #333;
  }
  /deep/ .form-item-outline .el-input__inner {
    border: none;
    font-size: 13px !important;
  }

  /deep/ .form-item-outline .el-form-item__label {
    line-height: 32px !important;
    padding: 0 0 0 12px !important;
    font-size: 13px !important;
  }

  .form-item-outline {
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-sizing: border-box;
  }

  .form-item-outline:hover {
    border-color: #e43333;
  }
}
</style>
<style>
.el-form-item__label {
  line-height: 22px !important;
  /* height:30px  !important; */
}
.el-form-item__content {
  line-height: 18px !important;
  /* height:30px  !important; */
}
.el-form-item {
  margin-bottom: 24px;
}
.equipment-profile-detail .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
}
.equipment-profile-detail .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.equipment-profile-detail .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 114px;
  height: 114px;
  line-height: 114px;
  text-align: center;
}
.equipment-profile-detail .avatar {
  width: 114px;
  height: 114px;
  display: block;
}

.equipment-profile-detail .el-form-item__label {
  color: #999999;
  padding: 0;
}
.equipment-profile-detail .el-tabs__nav-wrap::after {
  background: none;
}
.equipment-profile-detail .el-tabs__item.is-active {
  color: red;
}
.equipment-profile-detail .el-tabs__active-bar {
  background: red;
}
.equipment-profile-detail .el-form-item__label {
  color: #999999;
}
.footer {
  padding: 20px 0;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.equipment-profile-detail .el-timeline {
  padding: 0;
}
.equipment-profile-detail .el-card__body {
  padding: 10px 20px;
}
/* .equipment-profile-detail .el-dialog__body {
  height: 620px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
} */
/* .equipment-profile-detail .el-tooltip.item {
  outline-color: transparent !important;
  outline-width: 0 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: bottom;
  max-width: 100% !important;
} */
.equipment-profile-detail .el-tooltip.item {
  outline-color: transparent !important;
  outline-width: 0 !important;
}
</style>
<style lang="less">
.apply-order-component .closeWorkOrder {
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
    // height: 45px;
    // line-height: 45px;
    padding: 10px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #e4e7ed;
    margin-right: 0;
  }
  .el-checkbox__label {
    display: inline-grid;
    white-space: pre-line;
    word-wrap: break-word;
    overflow: hidden;
    line-height: 20px;
  }
}
.card_show {
  width: 400px;
  margin: 0 auto;
  padding: 15px;
  border: 1px solid #e9e9e9;
  border-radius: 6px;
  .device_name {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #000;
    margin: 5px 0 8px;
  }
  .left_middle {
    font-weight: 400;
    font-size: 13px;
    line-height: 22px;
    color: #000;
    display: flex;
    justify-content: space-between;
    .middle_title {
      width: 250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.downQrcodeCon {
  width: 430px;
  margin: 20px auto;
  .downQrcodeTip {
    margin-top: 10px;
    color: #666;
    font-size: 12px;
  }
}
</style>
