<template>
  <div style="position: relative">
    <div class="return-btn" style="position: absolute; right: 20px; height: 55px; line-height: 55px; top: -75px" v-if="showButtonFlag">
      <el-button type="danger" size="small" @click="setBusinessLine" v-has="businessline">配置业务线</el-button>
      <el-button type="danger" size="small" @click="manageAccount" v-gio.click="clickManageLinkAccount">管理关联账号</el-button>
      <el-button type="danger" plain size="small" @click="distributeDealer('add')" v-if="DABtn && ruleForm.daFlag">
        分配服务商
      </el-button>
      <el-button
        type="danger"
        plain
        size="small"
        @click="edit"
        v-auth="{
          menuCodes: 'CSEditBtn',
          strategyNames: ['service_assetGroup', 'assetGroup'],
          strategySource: {
            service_assetGroup: $route.query.companyId,
            assetGroup: $route.query.companyId
          },
          matchKey: {
            service_assetGroup: 'accountId',
            assetGroup: 'accountId'
          }
        }"
        >编辑</el-button
      >
      <el-button size="small" @click="useOrStop">{{ ruleForm.status == "0" ? "启用" : "停用" }}</el-button>
    </div>
    <el-divider style="margin:17px 0"></el-divider>
    <div class="customer-profile-detail" :style="mainminheight">
      <!-- 公司名称 -->
      <div class="company-content">
        <div class="company-title-info">
          <div class="company-info">
            <div style="font-size: 20px; color: #000; line-height: 25px; font-weight: bold">{{ ruleForm.companyName }}</div>
            <div style="height: 10px"></div>
            <div style="display: flex; align-items: center;margin-left:10px">
              <div class="company-type" v-if="ruleForm.daFlag" style="margin-right: 10px">直供客户</div>
              <div class="company-status" :style="{ backgroundColor: ruleForm.status == '0' ? 'rgba(0,0,0,0.05)' : 'rgba(0,136,136,0.1)', color: ruleForm.status == '0' ? '#666' : '#008888' }">
                {{ ruleForm.status == "0" ? "已停用" : ruleForm.status == "1" ? "使用中" : ruleForm.status == "2" ? "潜在" : "现有" }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="font-size:13px;color:#666;width: 100%;margin-top: 10px;line-height:1.5">
        所属经销商： {{ ruleForm.customerCompanyName }}
        <el-button v-has="PC_Customer_changeSP" type="text" size="mini" style="color:#d10000;margin-left:10px" @click="openChangeDistributorDialog">
          更换
        </el-button>
      </div>
      <!--  PES客户 pes 档案 -->
      <div
        class="company-info-content-achives"
        v-auth="{
          menuCodes: 'manage_PES_tag',
          strategyNames: ['assetGroup'],
          strategySource: {
            assetGroup: $route.query.companyId
          },
          matchKey: {
            assetGroup: 'accountId'
          }
        }"
        style="
          padding: 0 20px;
          height: 40px;
          line-height: 40px;
          font-size: 13px;
          font-family: MicrosoftYaHei;
          color: #666;
          display: flex;
          align-items: center;
        "
        :style="{ 'background-image': ruleForm.pesFilesCount == 0 ? 'linear-gradient(to right, rgb(249, 249, 249, ), #fff)' : 'linear-gradient(to right, rgb(255, 153, 0, 0.1), #fff)' }"
      >
        <img v-if="ruleForm.pesFlag == 1 || ruleForm.pesFlag == 3" src="../../assets/pes-icon.png" alt="" style="width: 24px; margin-right: 4px; height: 23px" />
        <img v-if="ruleForm.pesFlag == 2 || ruleForm.pesFlag == 3" src="../../assets/DPES_icon.png" alt="" style="width: 24px; margin-right: 4px; height: 23px" />
        计划工程服务档案
        <span @click="handlePESindex" style="color: #ff9900; margin-left: 10px; cursor: pointer"> 详情<i class="el-icon-arrow-right"/></span>
      </div>
      <!-- 公司信息 -->
      <div class="company-info-content" id="header" style="border: 1px solid #e9e9e9;">
        <el-form ref="form" :model="ruleForm" label-width="100px" label-position="left">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="税号" label-width="110px">
                <el-tooltip class="item" effect="dark" :content="ruleForm.taxNumber" placement="top">
                  <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ ruleForm.taxNumber || "- -" }}</div>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="城市" label-width="110px">
                <div style="display: flex; align-items: center">
                  <el-tooltip class="item" effect="dark" :content="ruleForm.regionCityName" placement="top">
                    <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ ruleForm.regionCityName || "--" }}</div>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="行业" label-width="50px">
                <span>{{ ruleForm.companyIndustryName || "暂无" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="规模" label-width="50px">
                <span>{{ ruleForm.custScaleName || "暂无" }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="联系电话" label-width="110px">
                <span>{{ ruleForm.telephone || "暂无" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="详细地址" label-width="110px">
                <div style="display: flex; align-items: center">
                  <el-tooltip class="item" effect="dark" :content="ruleForm.address" placement="top">
                    <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ ruleForm.address || "--" }}</div>
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="无税号注册原因" label-width="110px">
                <span>{{ ruleForm.noTaxNumberReason || "-" }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="是否为SP客户" label-width="110px">
                <span>{{ ruleForm.spFlag == 1 ? "是" : "否" }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间" label-width="110px">
                <span>{{ ruleForm.createTimeStr || "暂无" }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 表格 客户信息/员工信息 -->
      <el-tabs v-model="currentTab" @tab-click="handleClick" :before-leave="beforeTabLeave" style="margin-top: 20px">
        <!-- <el-tab-pane :label="'工单 ' + workOrderTotal" name="3" v-if="workOrderBtn"> -->
        <el-tab-pane :label="'车间 ' + workshopTotal" name="1">
          <el-button type="danger" v-if="!(ruleForm.daFlag && userInfo.userType == 1)" plain size="small" v-has="newWorkshop" @click="handleCreateWorkshop()">新建车间</el-button>
          <div style="margin-top:20px;">
            <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderWorkshop" :tableData="workshopList" :tableHeight="tableHeight + ''" :loading="loadingWorkShop">
              <el-table-column slot="operation" label="操作" width="330" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span style="color: #001450; cursor: pointer;" @click="handleEditWorkshop(scope.row)" v-has="manageWorkshop">编辑</span>
                  <span style="color: #001450; cursor: pointer;margin-left:10px;" @click="handletranferEquip(scope.row)" v-has="manageWorkshop">转移设备</span>
                  <span style="color: #dd0000; cursor: pointer;margin-left:10px;" v-if="!scope.row.no" @click="handleDeleteWorkshop(scope.row)" v-has="manageWorkshop">删除</span>
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
              :total="workshopTotal"
              style="float: right; display: flex; margin-top: 10px"
            ></el-pagination>
          </div>
          <!-- 新增车间 -->
          <CreateWorkshop
            :createWorkshopDialog="createWorkshopDialog"
            :workshopType="workshopType"
            :companyId="ruleForm.companyId"
            :addWorkshopForm="addWorkshopForm"
            :customerCompanyType="ruleForm.customerCompanyType"
            v-on:addOrEditWorkshop="addOrEditWorkshop"
            v-on:closeDialogAdd="closeDialogAdd"
            ref="child"
          />
          <!-- 选择设备 车间 -->
          <lupDialogNew
            :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
            :singleFlag="false"
            :selectMax="selectMax"
            :checkedDevice="checkedDevice"
            :urlType="urlType"
            :companyName="ruleForm.companyName"
            :workShopId="workShopId"
            :taskType="taskType"
            :companyId="ruleForm.companyId"
            :companyNumber="ruleForm.companyNumber"
            v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
            v-on:confirmTranfer="confirmTranfer"
            v-on:confirmChooseLup="confirmChooseLup"
          >
          </lupDialogNew>
        </el-tab-pane>
        <el-tab-pane :label="'设备 ' + equipmentTotal" name="2" v-if="EquipmentProfilBtn">
          <div>
            <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderEquipment" :tableData="equipmentList" :tableHeight="tableHeight + ''" :loading="loading">
              <el-table-column slot="deviceName" label="设备名称" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <span style="color: #409eff; cursor: pointer" @click="handleJumpEquipmentDetail(scope.row)">{{ scope.row.deviceName || "-" }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column slot="dataIntegrityFlag" label="信息状态" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.dataIntegrityFlag == '1' && !scope.row.editNew" style="color: #999; font-weight: 800">已完善</span>
                  <span v-if="scope.row.dataIntegrityFlag == '0'" style="color: #dd0000; font-weight: 800">待完善</span>
                  <span
                    v-if="scope.row.creatNew && scope.row.editNew && scope.row.dataIntegrityFlag != 0 && scope.row.updateTimeMills == scope.row.createTimeMills"
                    style="color: rgb(0, 136, 136); font-weight: 800"
                    >新创建</span
                  >
                  <span
                    v-if="((scope.row.editNew && scope.row.creatNew) || scope.row.editNew) && scope.row.dataIntegrityFlag != 0 && scope.row.updateTimeMills != scope.row.createTimeMills"
                    style="rgb(153,153,153);font-weight:800"
                    >刚修改</span
                  >
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
              :total="equipmentTotal"
              style="float: right; display: flex; margin-top: 10px"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="服务概览" name="serviceOverview" v-if="($_has('NewWorkOrderList') && userInfo.userType == 2) || userInfo.userType != 2">
          <cpServicesOverview v-if="showServiceOverview" :ruleForm="ruleForm" menuCode="NewWorkOrderList"></cpServicesOverview>
        </el-tab-pane>
        <el-tab-pane :label="'设备润滑表 ' + numTotal" name="equipLum" v-if="$_has('PC_Customer_Lurication')">
          <equipLumList v-if="showDeviceLum" :numTotal="numTotal" :tableHeight="tableHeight" :ruleForm="ruleForm" :loading="loading" @change="handleChange($event)"></equipLumList>
        </el-tab-pane>
        <el-tab-pane label="记录表" name="recordList" v-if="$_has('PC_form_customer_access')">
          <div style="margin-top:20px;position:relative">
            <RecordCardList :external="true" :resetBtnStyle="{ top: '10px' }" style="padding:0;margin:0" :companyId="$route.query.companyId" :fillAuth="true" :viewAuth="true" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="成员" name="companyMember" v-if="$_has('PC_Customer_user')">
          <custom-table class="table" :tableHeader="memberTableDataHeader" :tableData="companyMemberList">
            <el-table-column slot="phonenumber" label="联系电话" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <div style="display:flex;align-items:center">
                  <span>{{ scope.row.isShowListAllPhone ? scope.row.phonenumber : scope.row.tempPhone }}</span>
                  <img style="margin-left:10px;width:20px;height:20px;cursor: pointer;" @click="viewListAllMember(scope.row)" :src="scope.row.isShowListAllPhone ? viewIcon : notViewIcon" alt="" />
                </div>
              </template>
            </el-table-column>
          </custom-table>
          <el-pagination
            background
            @size-change="handleNormalSizeChange"
            @current-change="handleNormalCurrentChange"
            :current-page="userListPage.current"
            :page-size="userListPage.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="companyMemberTotal"
            layout="total, sizes, prev, pager, next, jumper"
            style="float: right; display: flex; margin-top: 10px"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="岗位" name="companyPosition">
          <el-button size="mini" type="danger" style="margin-bottom:5px;float:right" @click="editPost('createPost')" v-has="department_create_post">新建岗位</el-button>
          <custom-table class="table" :tableHeader="positionTableDataHeader" :tableData="companyPostList" :loading="loading">
            <template v-slot:operation>
              <el-table-column label="操作" width="300" show-overflow-tooltip>
                <template v-slot="scope">
                  <el-button type="text" @click="editPost('editPost', scope.row)" v-has="post_edit">编辑</el-button>
                  <el-button type="text" @click="editMember(scope.row)" v-has="post_member">编辑岗位人员</el-button>
                </template>
              </el-table-column>
            </template>
          </custom-table>
          <el-pagination
            background
            @size-change="handleNormalSizeChange($event, 'post')"
            @current-change="handleNormalCurrentChange($event, 'post')"
            :current-page="postListPage.current"
            :page-size="postListPage.size"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="postListTotal"
            style="float: right; display: flex; margin-top: 10px"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane :label="'服务商 ' + serviceDistributorList.length" name="serviceDistributor" v-if="ruleForm.customerCompanyType == '0'">
          <div>
            <el-table ref="staffTable" row-key="id" :data="serviceDistributorList" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }" stripe>
              <el-table-column prop="serviceProviderName" label="服务商名称" min-width="15%" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div style="display:flex;align-items:center;">
                    <span>{{ scope.row.serviceProviderName }}</span>
                    <img src="../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="workshopNames" label="管理车间" min-width="10%" show-overflow-tooltip></el-table-column> -->
              <el-table-column label="操作" min-width="5%">
                <template slot-scope="scope">
                  <!-- <el-link @click="editDistributor(scope.row)" style="margin-right:10px;color:#001450">编辑</el-link> -->
                  <el-link v-if="$_has('PC_Customer_ReleaseDASP')" @click="cancelRelationClick(scope.row)" style="margin-right:10px;color:#DD0000">解除关联</el-link>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'效益报告'" name="benefitReport">
          <!-- 头部 -->
          <div style="display: flex;align-items: center;justify-content: space-between;">
            <div class="right-content">
              <div class="line"></div>
              <div class="right-title">效益报告</div>
            </div>
            <div style="display:flex;">
              <template>
                <el-upload ref="upload" :auto-upload="false" :show-file-list="false" :on-change="file => handleAddFile(file, '')" />
                <el-button type="danger" plain size="small" @click="tipAlert()" v-has="PC_customer_benefits_report_manage">上传效益报告</el-button>
              </template>
              <el-button type="danger" size="mini" @click="makeReport" style="margin-left:10px;" v-has="PC_customer_benefits_report_manage">在线制作效益报告</el-button>
            </div>
          </div>
          <!-- 内容 -->
          <div>
            <div v-if="allReportList.length > 0" style="max-height:300px;overflow:auto;">
              <div v-for="(item, index) in allReportList" :key="index">
                <div :class="!item.hideMore ? 'core-content' : ''" v-show="item.createType == 2">
                  <div v-show="!item.hideMore">
                    <div style="margin-bottom:16px;">
                      <div class="margin-b2" style="display:inline-block;margin-right:5px;"><label class="red-label">*</label>报告名称</div>
                      <el-input placeholder="请输入" resize="none" maxlength="20" show-word-limit style="width: 600px;" v-model="item.pdfName"></el-input>
                      <div class="notice">自定义报告名称，最终报告名称将显示为：客户公司名称-年份-自定义部分+效益报告，此处只需填写自定义部分</div>
                    </div>
                    <div class="core-title">核心信息录入</div>
                    <div style="display:flex;">
                      <div class="core-item">
                        <div class="margin-b2">
                          <label class="red-label">*</label>润滑痛点
                          <el-tooltip class="item" effect="dark" content="一句话描述" placement="top">
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </div>
                        <wangEditor :inputVal="item.lubPainSpot" maxLength="500" placeholder="请输入润滑痛点" @msgChange="wangEditorMsg('lubPainSpot', index, $event)" />
                        <!-- <el-input v-model="item.lubPainSpot" clearable placeholder="请输入" maxlength="500" show-word-limit @change="noSaveReportFlag = true"></el-input> -->
                      </div>
                    </div>
                    <div style="display:flex;">
                      <div class="core-item" style="margin-right:15px;">
                        <div class="margin-b2"><label class="red-label">*</label>解决方案</div>
                        <wangEditor :inputVal="item.solution" maxLength="500" placeholder="请输入解决方案" @msgChange="wangEditorMsg('solution', index, $event)" />
                        <!-- <el-input v-model="item.solution" clearable placeholder="请输入" maxlength="500" show-word-limit @change="noSaveReportFlag = true"></el-input> -->
                      </div>
                      <div class="core-item">
                        <div class="margin-b2"><label class="red-label">*</label>结果</div>
                        <wangEditor :inputVal="item.resultDesc" maxLength="500" placeholder="请输入结果" @msgChange="wangEditorMsg('resultDesc', index, $event)" />
                        <!-- <el-input v-model="item.resultDesc" clearable placeholder="请输入" maxlength="500" show-word-limit @change="noSaveReportFlag = true"></el-input> -->
                      </div>
                    </div>
                    <div class="core-title">效益</div>
                    <div style="width:50%;">
                      <div class="core-item">
                        <div class="margin-b2">
                          安全
                          <el-tooltip class="item" effect="dark" content="减少设备维护人员与设备的接触时间（小时）" placement="top">
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </div>
                        <div style="display:flex;align-items: center;">
                          <el-input
                            clearable
                            placeholder="请输入"
                            @change="noSaveReportFlag = true"
                            @keyup.native="proving(item, 'safe')"
                            :rules="[
                              { required: true, message: '请输入安全字段', trigger: 'blur' },
                              ,
                              { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
                            ]"
                            v-model="item.effectSafe"
                          ></el-input>
                          <div style="width:50px;margin-left:10px;">小时</div>
                        </div>
                      </div>
                    </div>
                    <div class="margin-b2">
                      <label class="red-label">环保</label>
                      <el-tooltip class="item" effect="dark" content="减少废润滑油的产生和处置（升）" placement="top">
                        <i class="el-icon-warning-outline"></i>
                      </el-tooltip>
                    </div>
                    <div style="display:flex;">
                      <div class="core-item">
                        <div class="margin-b2">减少废润滑油的产生和处置</div>
                        <div style="display:flex;align-items: center;">
                          <el-input
                            clearable
                            placeholder="请输入"
                            @change="noSaveReportFlag = true"
                            @keyup.native="proving(item, 'environment')"
                            :rules="[
                              { required: true, message: '请输入减少废润滑油的产生和处置', trigger: 'blur' },
                              ,
                              { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
                            ]"
                            v-model="item.effectEnvironment"
                          ></el-input>
                          <div style="width:50px;margin-left:10px;">升</div>
                        </div>
                      </div>
                      <div class="core-item">
                        <div class="margin-b2">减少CO2排放情况</div>
                        <el-select v-model="item.effectEnvironmentCo2Flag" style="width:100%;" @change="noSaveReportFlag = true">
                          <el-option v-for="item in emissionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div style="width:50%;" v-if="item.effectEnvironmentCo2Flag">
                      <div class="core-item">
                        <div class="margin-b2">减少CO2排放</div>
                        <div style="display:flex;align-items: center;">
                          <el-input
                            clearable
                            placeholder="请输入"
                            @change="noSaveReportFlag = true"
                            @keyup.native="proving(item, 'co2Num')"
                            :rules="[
                              { required: true, message: '请输入减少CO2排放', trigger: 'blur' },
                              ,
                              { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
                            ]"
                            v-model="item.effectEnvironmentCo2Num"
                          ></el-input>
                          <div style="width:50px;margin-left:10px;">吨</div>
                        </div>
                      </div>
                    </div>
                    <div style="width:50%;">
                      <div class="core-item">
                        <div class="margin-b2">
                          <label class="red-label">*</label>高效
                          <el-tooltip class="item" effect="dark" content="降低设备维护成本和非计划停机损失，增加效益（万元）" placement="top">
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </div>
                        <div style="display:flex;align-items: center;">
                          <el-input
                            clearable
                            placeholder="请输入"
                            @change="noSaveReportFlag = true"
                            @keyup.native="proving(item, 'efficiency')"
                            :rules="[
                              { required: true, message: '请输入高效字段', trigger: 'blur' },
                              ,
                              { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空,且小数点后最多2位小数', trigger: 'blur' }
                            ]"
                            v-model="item.effectHigh"
                          ></el-input>
                          <div style="width:50px;margin-left:10px;">万元</div>
                        </div>
                      </div>
                    </div>
                    <div class="core-item" style="display:flex;align-items:center;">
                      <div class="margin-b2" style="margin-right:15px;"><label class="red-label">*</label>报告</div>
                      <el-upload :auto-upload="false" :show-file-list="false" :on-change="file => handleAddFile(file, item)">
                        <el-button type="danger" plain size="small">点击上传</el-button>
                      </el-upload>
                    </div>
                  </div>
                  <!-- 报告 -->
                  <div v-show="item.uploadFileName" class="list-content" :style="!item.hideMore ? 'border: 1px solid #CCDDFF;background: rgba(204, 221, 255, 0.2);' : ''">
                    <div style="width:80%">
                      <div style="display:flex;align-items:center">
                        <!-- 展开则显示上传的报告名称，收起则显示客户公司名称-年份-自定义部分+效益报告 -->
                        <div class="report-title" style="margin-left: 0px;" :title="item.uploadFileName">
                          {{
                            !item.hideMore
                              ? item.uploadFileName
                              : ruleForm.companyName + "-" + (item.id ? item.createTime.substr(0, 4) : nowYear) + "-" + (item.pdfName ? item.pdfName : "") + "-效益报告"
                          }}
                        </div>
                      </div>
                      <div style="display:flex;align-items:center;margin-top:12px;font-size:12px;font-weight:400;color:#999">
                        <div>创建人：{{ item.createUserName }}</div>
                        <div class="content-line"></div>
                        <div>创建时间：{{ item.createTime }}</div>
                        <div class="content-line"></div>
                        <div>
                          关联POP（业绩证明）：{{ item.relPopName ? item.relPopName.split(",")[0] : "--" }}
                          <span v-if="item.relPopName && item.relPopName.includes(',')">,</span>
                          <el-tooltip class="item" effect="dark" :content="item.relPopName" placement="top" v-if="item.relPopName && item.relPopName.includes(',')">
                            <i class="el-icon-more"></i>
                          </el-tooltip>
                        </div>
                      </div>
                    </div>
                    <div>
                      <!-- FES/高工/管理员 能展开/收起 -->
                      <el-link style="margin-right:10px;" @click="changeMore(item, index)" v-has="PC_customer_benefits_report_manage">{{ item.hideMore ? "展开" : "" }}</el-link>
                      <el-link style="margin-right:10px;" @click="previewReportItem(item)">预览</el-link>
                      <el-link style="margin-right:10px;" @click="downloadReportItem(item)">下载</el-link>
                      <el-link style="color:#dd0000;" @click="deleteReportItem(item, index)" v-has="PC_customer_benefits_report_manage">删除</el-link>
                    </div>
                  </div>
                  <el-button type="danger" plain size="small" @click="changeMore(item, index)" v-show="!item.hideMore">收起</el-button>
                  <el-button type="danger" size="small" @click="saveCenterItem(item)" v-show="!item.hideMore">保存</el-button>
                  <el-button type="danger" plain size="small" @click="deleteCenterItem(item, index)" v-show="!item.hideMore">删除</el-button>
                </div>
                <!-- 报告列表 -->
                <div class="list-content" v-show="item.createType == 1">
                  <div style="width:80%">
                    <!--  -->
                    <div style="display:flex;align-items:center">
                      <div :class="item.status == 1 ? 'unrelease' : item.status == 2 ? 'create-report-status' : 'release'">
                        {{ item.status == 1 ? "未发布" : item.status == 2 ? "报告生成中" : "已发布" }}
                      </div>
                      <div class="report-title" :title="item.fileName">{{ item.fileName }}</div>
                    </div>
                    <div style="display:flex;align-items:center;margin-top:12px;font-size:12px;font-weight:400;color:#999">
                      <div>创建人：{{ item.createUserName }}</div>
                      <div class="content-line"></div>
                      <div>创建时间：{{ item.createTime }}</div>
                      <div class="content-line"></div>
                      <div>
                        关联POP（业绩证明）：{{ item.relPopName ? item.relPopName.split(",")[0] : "--" }}
                        <span v-if="item.relPopName && item.relPopName.includes(',')">,</span>
                        <el-tooltip class="item" effect="dark" :content="item.relPopName" placement="top" v-if="item.relPopName && item.relPopName.includes(',')">
                          <i class="el-icon-more"></i>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span style="color:#dd0000;" v-if="item.status == 2">报告生成中 ···</span>
                    <el-link style="margin-right:10px" @click="editBenefitReport(item)" v-has="PC_customer_benefits_report_manage">编辑</el-link>
                    <el-link style="margin-right:10px" @click="previewBenefitReport(item)" v-if="item.status == 4 || item.status == 1">预览</el-link>
                    <el-link style="color:#dd0000;" @click="deleteBenefitReport(item)" v-if="item.status == 1" v-has="PC_customer_benefits_report_manage">删除</el-link>
                    <el-link @click="downloadBenefitReport(item)" v-if="item.status == 4">下载</el-link>
                  </div>
                </div>
              </div>
            </div>
            <!-- 无报告 -->
            <div v-if="allReportList.length == 0" style="font-size:14px;text-align:center;color:#666;margin-top:30px">暂无报告</div>
            <Pagination :total="totalBenefitNumber" :pageInfo="pagenation4" v-if="totalBenefitNumber > 0" />

            <!-- 计划工程服务效益报告 -->
            <div class="right-content">
              <div class="line"></div>
              <div class="right-title">计划工程服务效益报告</div>
            </div>
            <div v-if="pesReportList.length > 0" style="max-height:300px;overflow:auto;">
              <div v-for="(item, index) in pesReportList" :key="index">
                <!-- 报告列表 -->
                <div class="list-content">
                  <div style="width:80%">
                    <div style="display:flex;align-items:center">
                      <div :class="item.status == 1 ? 'unrelease' : item.status == 2 ? 'create-report-status' : 'release'">
                        {{ item.status == 1 ? "未发布" : item.status == 2 ? "报告生成中" : "已发布" }}
                      </div>
                      <div class="report-title" :title="item.reportName">{{ item.reportName }}</div>
                    </div>
                    <div style="display:flex;align-items:center;margin-top:12px;font-size:12px;font-weight:400;color:#999">
                      <div>创建人：{{ item.createUserName }}</div>
                      <div class="content-line"></div>
                      <div>创建时间：{{ item.createTime }}</div>
                    </div>
                  </div>
                  <div>
                    <el-link style="margin-right:10px" @click="previewPesReport(item)" v-if="item.status == 4">预览</el-link>
                    <el-link style="margin-right:10px" @click="downloadPesReport(item)" v-if="item.status == 4">下载</el-link>
                  </div>
                </div>
              </div>
            </div>
            <!-- 无报告 -->
            <div v-if="pesReportList.length == 0" style="font-size:14px;text-align:center;color:#666;margin-top:30px">暂无报告</div>
            <Pagination :total="totalPesNumber" :pageInfo="pagenation6" v-if="totalPesNumber > 0" />
            <!-- 动态 -->
            <div style="display: flex;align-items: center;justify-content: space-between;">
              <div class="right-content">
                <div class="line"></div>
                <div class="right-title">动态</div>
              </div>
            </div>
          </div>
          <div style="margin-top:24px" v-if="benefitReportDynamicList.length">
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(item, index) in benefitReportDynamicList" :key="index" :timestamp="item.createTime" color="#ccddff" size="large" placement="top">
                <div style="font-size:13px" v-if="item.type == 1">
                  <span style="color:#000">{{ item.createUserName }}</span>
                  <span style="color:#666;margin:0 5px">{{ item.trendOperate }}</span>
                  <span style="color:#000">{{ item.trendMgs }}</span>
                </div>
                <div style="font-size:13px" v-if="item.type == 2">
                  <span style="color:#000;margin:0 5px">{{ item.trendMgs }}</span>
                  <span style="color:#666">{{ item.trendOperate }}</span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-if="!benefitReportDynamicList.length" style="font-size:14px;text-align:center;color:#666;margin-top:30px">暂无动态</div>
        </el-tab-pane>
        <el-tab-pane :label="'客户案例(POP/ROP)'" name="customerStories">
          <div style="display:flex;align-items:center;justify-content: space-between;">
            <div>
              <el-button-group>
                <el-button :type="activeType == 'pop' ? 'danger' : ''" size="small" @click="activeStories('pop')">业绩证明（POP）</el-button>
                <el-button :type="activeType == 'rop' ? 'danger' : ''" size="small" @click="activeStories('rop')">业绩参考（ROP）</el-button>
              </el-button-group>
            </div>
            <div
              v-auth="{
                menuCodes: 'add_report',
                strategyNames: ['service_assetGroup', 'assetGroup','sp'],
                strategySource: {
                  service_assetGroup: $route.query.companyId,
                  assetGroup: $route.query.companyId,
                  sp: $route.query.customerDistributorId,
                },
                matchKey: {
                  service_assetGroup: 'accountId',
                  assetGroup: 'accountId',
                  sp: 'dataId'
                }
              }"
            >
              <el-button size="small" @click="addReport('', 'add')">添加报告</el-button>
            </div>
          </div>
          <div style="display: flex;align-items: center;justify-content: space-between;">
            <div class="right-content">
              <div class="line"></div>
              <div class="right-title">{{ activeType == "pop" ? "业绩证明（POP）" : "业绩参考（ROP）" }}</div>
            </div>
          </div>
          <!-- 列表 -->
          <div v-if="popOrRopList.length > 0" style="height:500px;overflow:auto;">
            <div class="report-content" v-for="(item, index) in popOrRopList" :key="index">
              <!-- 头部 -->
              <div class="report-header" v-if="activeType == 'pop'">
                <div>
                  <span class="head-title">创建类型：</span>
                  <span class="head-val">{{ item.createType == 1 ? "自动" : "手动" }}创建</span>
                </div>
                <div style="margin-left:24px;flex:1">
                  <span class="head-title">效益报告：</span>
                  <span class="head-val">{{ item.relationXyzjName ? item.relationXyzjName : "--" }}</span>
                  <span v-if="item.relationXyzjName" @click="toView(item)" style="color:#001450;margin-left:8px;cursor: pointer;">前往查看</span>
                </div>
              </div>
              <!-- 报告 -->
              <div>
                <!-- 报告列表 -->
                <div class="list-content-pop">
                  <div style="display: flex;align-items: center;justify-content: space-between;padding: 16px" :style="item.displayUploadFilesFlag ? 'border-bottom: 1px solid #e9e9e9;' : ''">
                    <div style="width:80%">
                      <div style="display:flex;align-items:center">
                        <div :class="item.status == '1' ? 'on-confirm' : item.status == '0' ? 'unrelease' : item.status == '2' ? 'approve' : item.status == '3' ? 'recall' : 'report-creating'">
                          {{ item.status == "1" ? "已确认" : item.status == "0" ? "未发布" : item.status == "2" ? "待确认" : item.status == "3" ? "已驳回" : "报告生成中" }}
                        </div>

                        <div class="report-title" :title="item.reportFullName">{{ item.reportFullName }}</div>
                      </div>
                      <div style="display:flex;align-items:center;margin-top:12px;font-size:12px;font-weight:400;color:#999">
                        <div>创建人：{{ item.createUser }}</div>
                        <div class="content-line"></div>
                        <div>创建时间：{{ item.createTime }}</div>
                      </div>
                      <div style="display:flex;align-items:center;margin-top:10px" v-if="userInfo.userType == 1 && (item.status == 1 || item.status == 2 || item.status == 3)">
                        <img src="../../assets/notice-icon.png" alt="" style="width:14px;height:14px" />
                        <span style="color:#ff9900;font-size:12px;font-weight:400;margin-left:8px">
                          {{
                            item.status == 2
                              ? "已发布的报告，需要美孚工程师确认，确认之后才可上传文件"
                              : item.status == 1
                              ? "美孚工程师已确认，现在可以上传文件了"
                              : "已发布的报告，需要美孚工程师确认，确认之后才可上传文件"
                          }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span style="color:#dd0000;margin-right:10px" v-if="item.status == '9'">报告生成中 ···</span>
                      <!-- 新增加的按钮开始 -->
                      <el-link style="margin-right:10px;color:#409EFF;" @click="watchRecallReason(item)" v-if="!item.sharedFlag && item.status == '3'">查看驳回原因</el-link>
                      <el-link style="margin-right:10px;color:#409EFF;" @click="handleReportStatus('reject', item)" v-if="!item.sharedFlag && (item.status == '2' && userInfo.userType == 0)"
                        >驳回</el-link
                      >
                      <el-link style="margin-right:10px;color:#409EFF;" @click="handleReportStatus('approve', item)" v-if="!item.sharedFlag && (item.status == '2' && userInfo.userType == 0)"
                        >确认</el-link
                      >
                      <el-link style="margin-right:10px;color:#409EFF;" @click="handleReportStatus('recall', item)" v-if="!item.sharedFlag && (item.status == '2' && userInfo.userType == 1)"
                        >撤回</el-link
                      >
                      <el-link style="margin-right:10px;color:#409EFF;" @click="handleReportStatus('publishAgain', item)" v-if="!item.sharedFlag && item.status == '1'">再次发布</el-link>
                      <!-- 新增加的按钮结束-->
                      <el-link
                        style="margin-right:10px"
                        @click="editPopReport(item)"
                        v-if="
                          !item.sharedFlag &&
                            edit_report &&
                            (item.status == '0' || (item.status == '3' && userInfo.userType == 1) || ((item.status == '3' || item.status == '2') && userInfo.userType == 0))
                        "
                        >编辑</el-link
                      >
                      <el-link style="margin-right:10px" @click="previewPopReport(item)" v-if="item.status != '9'">预览</el-link>
                      <!-- <el-link style="color:#dd0000;" @click="deletePopReport(item)" v-if="!item.status == '1' && delete_report">删除</el-link> -->
                      <el-link @click="downloadPopReport(item)" v-if="item.status != '9'">下载</el-link>
                    </div>
                  </div>
                  <!-- 上传附件 开始-->
                  <div style="margin-top:20px" v-if="item.displayUploadFilesFlag">
                    <!-- pop上传文件列表 -->
                    <div v-if="activeType == 'pop'">
                      <!-- POP客户签字盖章文件 -->
                      <div class="file-list">
                        <div class="file-title-op">POP客户签字盖章文件：</div>
                        <el-upload
                          :show-file-list="false"
                          :on-change="
                            file => {
                              upChange(file, 'pop_customer', item, index);
                            }
                          "
                          accept=".pdf,.png"
                          :auto-upload="false"
                        >
                          <span
                            style="color:#001450;font-size:12px;cursor: pointer;text-decoration: underline;"
                            v-if="!item.sharedFlag && upload_file && item.displayUploadFilesFlag && item.status == 1"
                            >上传文件</span
                          >
                        </el-upload>
                      </div>
                      <!-- 上传的文件 -->
                      <div style="display: flex;align-items: center;margin:20px 0;padding-left:16px" v-for="(sign, signIdx) in item.customerSignFileList" :key="signIdx">
                        <div v-if="sign.fileName.toLowerCase().includes('.pdf')">
                          <img src="../../assets/pdf.png" alt="" style="width:32px;height:32px" />
                        </div>
                        <div v-else>
                          <img src="../../assets/png_icon.png" alt="" style="width:32px;height:32px" />
                        </div>
                        <div style="margin-left:12px">
                          <div style="font-size:13px;color:#333;font-weight:400;cursor: pointer;" @click="previewUploadFile(sign)">{{ sign.fileName }}</div>
                          <div style="display:flex;align-items:center;margin-top:12px;font-size:12px;font-weight:400;color:#999">
                            <div>创建人：{{ sign.createUserName }}</div>
                            <div class="content-line"></div>
                            <div>创建时间：{{ sign.createTime }}</div>
                            <el-link style="color:#dd0000;margin-left:10px" @click="deleteFile('pop_customer', sign, index, signIdx)" v-if="!item.sharedFlag && delete_file">删除</el-link>
                          </div>
                        </div>
                      </div>
                      <!-- 效益报告客户签字盖章文件 -->
                      <div class="file-list">
                        <div class="file-title-op">效益报告客户签字盖章文件：</div>
                        <el-upload
                          :show-file-list="false"
                          :on-change="
                            file => {
                              upChange(file, 'benefit_customer', item, index);
                            }
                          "
                          accept=".pdf,.png"
                          :auto-upload="false"
                        >
                          <span
                            style="color:#001450;font-size:12px;cursor: pointer;text-decoration: underline;"
                            v-if="!item.sharedFlag && upload_file && item.displayUploadFilesFlag && item.status == 1"
                            >上传文件</span
                          >
                        </el-upload>
                      </div>
                      <div style="display: flex;align-items: center;margin:20px 0;padding-left:16px" v-for="(xyzj, xyzjIdx) in item.xyzjSignFileList" :key="xyzjIdx">
                        <div v-if="xyzj.fileName.toLowerCase().includes('.pdf')">
                          <img src="../../assets/pdf.png" alt="" style="width:32px;height:32px" />
                        </div>
                        <div v-else>
                          <img src="../../assets/png_icon.png" alt="" style="width:32px;height:32px" />
                        </div>
                        <div style="margin-left:12px">
                          <div style="font-size:13px;color:#333;font-weight:400;cursor: pointer;" @click="previewUploadFile(xyzj)">{{ xyzj.fileName }}</div>
                          <div style="display:flex;align-items:center;margin-top:12px;font-size:12px;font-weight:400;color:#999">
                            <div>创建人：{{ xyzj.createUserName }}</div>
                            <div class="content-line"></div>
                            <div>创建时间：{{ xyzj.createTime }}</div>
                            <el-link style="color:#dd0000;margin-left:10px" @click="deleteFile('benefit_customer', xyzj, index, xyzjIdx)" v-if="!item.sharedFlag && delete_file">删除</el-link>
                          </div>
                        </div>
                      </div>
                      <!-- 法务审批文件 -->
                      <div class="file-list">
                        <div class="file-title-op">法务审批文件：</div>
                        <el-upload
                          :show-file-list="false"
                          :on-change="
                            file => {
                              upChange(file, 'legal_approval', item, index);
                            }
                          "
                          accept=".pdf,.png"
                          :auto-upload="false"
                        >
                          <span
                            style="color:#001450;font-size:12px;cursor: pointer;text-decoration: underline;"
                            v-if="!item.sharedFlag && upload_file && item.displayUploadFilesFlag && item.status == 1"
                            >上传文件</span
                          >
                        </el-upload>
                      </div>
                      <div style="display: flex;align-items: center;margin:20px 0;padding-left:16px" v-for="(legal, legalIdx) in item.legalAffairsFileList" :key="legalIdx">
                        <div v-if="legal.fileName.toLowerCase().includes('.pdf')">
                          <img src="../../assets/pdf.png" alt="" style="width:32px;height:32px" />
                        </div>
                        <div v-else>
                          <img src="../../assets/png_icon.png" alt="" style="width:32px;height:32px" />
                        </div>
                        <div style="margin-left:12px">
                          <div style="font-size:13px;color:#333;font-weight:400;cursor: pointer;" @click="previewUploadFile(legal)">{{ legal.fileName }}</div>
                          <div style="display:flex;align-items:center;margin-top:12px;font-size:12px;font-weight:400;color:#999">
                            <div>创建人：{{ legal.createUserName }}</div>
                            <div class="content-line"></div>
                            <div>创建时间：{{ legal.createTime }}</div>
                            <el-link style="color:#dd0000;margin-left:10px" @click="deleteFile('legal_approval', legal, index, legalIdx)" v-if="!item.sharedFlag && delete_file">删除</el-link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- rop上传文件列表 -->
                    <div v-if="activeType == 'rop'">
                      <!-- 客户签字文件 -->
                      <div class="file-list">
                        <div class="file-title-op">客户签字文件：</div>
                        <el-upload
                          :show-file-list="false"
                          :on-change="
                            file => {
                              upChange(file, 'rop_customer', item, index);
                            }
                          "
                          accept=".pdf,.png"
                          :auto-upload="false"
                        >
                          <span
                            style="color:#001450;font-size:12px;cursor: pointer;text-decoration: underline;"
                            v-if="!item.sharedFlag && upload_file && item.displayUploadFilesFlag && item.status == 1"
                            >上传文件</span
                          >
                        </el-upload>
                      </div>
                      <!-- 上传的文件 -->
                      <div style="display: flex;align-items: center;margin:20px 0;padding-left:16px" v-for="(sign, signRopIdx) in item.customerSignFileList" :key="signRopIdx">
                        <div v-if="sign.fileName.toLowerCase().includes('.pdf')">
                          <img src="../../assets/pdf.png" alt="" style="width:32px;height:32px" />
                        </div>
                        <div v-else>
                          <img src="../../assets/png_icon.png" alt="" style="width:32px;height:32px" />
                        </div>
                        <div style="margin-left:12px">
                          <div style="font-size:13px;color:#333;font-weight:400;cursor: pointer;" @click="previewUploadFile(sign)">{{ sign.fileName }}</div>
                          <div style="display:flex;align-items:center;margin-top:12px;font-size:12px;font-weight:400;color:#999">
                            <div>创建人：{{ sign.createUserName }}</div>
                            <div class="content-line"></div>
                            <div>创建时间：{{ sign.createTime }}</div>
                            <el-link style="color:#dd0000;margin-left:10px" @click="deleteFile('rop_customer', sign, index, signRopIdx)" v-if="!item.sharedFlag && delete_file">删除</el-link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 分享 -->
                    <div style="margin:20px 0;padding-left:16px" v-if="!item.sharedFlag && confirm_sharing">
                      <el-button type="danger" plain size="small" @click="confirmShare('share', item)" :disabled="!(item.status && item.canShareFlag)">确认分享</el-button>
                      <div style="display:flex;align-items:center;margin-top:4px">
                        <img src="../../assets/notice-icon.png" alt="" style="width:14px;height:14px" />
                        <span style="color:#ff9900;font-size:12px;font-weight:400;margin-left:8px">
                          {{
                            activeType == "pop"
                              ? "业绩证明报告已发布、签字文件（POP签字盖章文件、效益报告签字盖章文件、法务审批文件）都已上传，才可分享"
                              : "业绩参考报告已发布、客户签字已上传，才可分享"
                          }}
                        </span>
                      </div>
                    </div>
                    <!-- 已分享 -->
                    <div style="margin:20px 0;padding-left:16px" v-if="item.sharedFlag">
                      <div style="display:flex;align-items:center;">
                        <img src="../../assets/success-icon.png" alt="" style="width:14px;height:14px" />
                        <div style="font-size:12px;font-weight:400;color:#008888;margin-left:8px">分享成功</div>
                      </div>
                      <div style="margin-top:20px">
                        <el-button size="small" @click="confirmShare('set', item)">可见性设置</el-button>
                        <el-button size="small" @click="revokeShare(item)">撤销分享</el-button>
                      </div>
                    </div>
                  </div>
                  <!-- 上传附件 结束 -->
                </div>
                <!-- 无报告 -->
                <!-- <div v-if="popOrRopList.length==0" style="font-size:14px;text-align:center;color:#666;margin:30px 0">暂无报告</div> -->
              </div>
            </div>
          </div>
          <div v-if="popOrRopList.length == 0" style="font-size:14px;text-align:center;color:#666;margin:30px 0">暂无报告</div>
          <Pagination :total="totalPopOrRopNumber" :pageInfo="pagenation5" v-if="totalPopOrRopNumber > 0" />
          <!-- 动态 -->
          <div style="display: flex;align-items: center;justify-content: space-between;">
            <div class="right-content">
              <div class="line"></div>
              <div class="right-title">动态</div>
            </div>
          </div>
          <!-- 动态展示 -->
          <div style="margin-top:24px" v-if="customerCaseDynamicList.length">
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(item, index) in customerCaseDynamicList" :key="index" :timestamp="item.createTime" color="#ccddff" size="large" placement="top">
                <div style="font-size:13px">
                  <span style="color:#000">{{ item.createUserName }}</span>
                  <span style="color:#666;margin:0 5px">{{ item.trendOperate }}</span>
                  <span style="color:#000">{{ item.trendMgs }}</span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-if="!customerCaseDynamicList.length" style="font-size:14px;text-align:center;color:#666;margin-top:30px">暂无动态</div>
        </el-tab-pane>
        <el-tab-pane :label="'服务申请单'" name="serviceApply" v-if="serviceApplyTabFlag">
          <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderApply" :tableData="serviceApplyTableData" :tableHeight="tableHeight + ''" :loading="loading">
            <el-table-column slot="serviceApplyType" label="创建类型" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="workOrder-Status">{{ scope.row.serviceApplyType == 1 ? "自主下单" : scope.row.serviceApplyType == 2 ? "代客下单" : "自助下单" }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="userInfo.userType == 0" slot="distributorCompanyName" label="经销商" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <div style="display:flex;align-items:center;">
                  <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.distributorCompanyName || "-" }}</span>
                  <img v-if="scope.row.assistSpFlag" src="../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
                </div>
              </template>
            </el-table-column>
            <el-table-column slot="serviceApplyStatus" label="状态" width="130" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="workOrder-Status" :style="scope.row.serviceApplyStatus | filterStatus">{{ scope.row.serviceApplyStatus | applyStatus }}</span>
              </template>
            </el-table-column>
            <el-table-column slot="operation" label="操作" align="center" width="130" show-overflow-tooltip>
              <template slot-scope="scope">
                <span style="color: #001450; cursor: pointer" @click="handleLook(scope.row)">查看</span>
              </template>
            </el-table-column>
          </custom-table>
          <el-pagination
            background
            @size-change="serviceApplySizeChange"
            @current-change="serviceApplyCurrentChange"
            :current-page="serviceApplyPage.current"
            :page-size="serviceApplyPage.size"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="serviceApplyTotalNumber"
            style="float: right; display: flex; margin-top: 10px"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane :label="'分管人 ' + chargeTableTotalNumber" name="chargeUser">
          <el-button
            type="danger"
            size="small"
            @click="addChargeUser"
            v-has="customer_distribution_btn_PC"
            v-if="(userInfo.userType == 0 && ruleForm.daFlag) || (userInfo.userType == 1 && !ruleForm.daFlag)"
            >添加分管人</el-button
          >
          <div style="height:10px"></div>
          <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderCharge" :tableData="chargeTableData" :tableHeight="tableHeight + ''" :loading="loading">
            <el-table-column slot="telephone" label="联系方式" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <div style="display:flex;align-items:center">
                  <span>{{ scope.row.isShowListAllPhone ? scope.row.telephone : scope.row.tempPhone }}</span>
                  <img style="margin-left:10px;width:20px;height:20px;cursor: pointer;" @click="viewListAllPerson(scope.row)" :src="scope.row.isShowListAllPhone ? viewIcon : notViewIcon" alt="" />
                </div>
              </template>
            </el-table-column>
            <el-table-column slot="operation" label="操作" width="150" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  style="color: #001450; cursor: pointer"
                  v-has="customer_distribution_btn_PC"
                  v-if="scope.row.userId != userInfo.userId && (userInfo.userType == 1 || userInfo.userType == 0)"
                  @click="handleDeleteChargeUser(scope.row, 'delete')"
                  >移除</span
                >
                <span style="color: #001450; cursor: pointer" v-has="customer_distribution_btn_PC" v-if="scope.row.userId == userInfo.userId" @click="handleDeleteChargeUser(scope.row, 'exit')"
                  >退出</span
                >
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
    </div>
    <!-- 配置业务线 -->
    <el-dialog title="配置业务线" :visible.sync="businessLineDialog" width="500px" :close-on-click-modal="false">
      business_line ID:
      <el-select size="small" v-model="businesslineId" style="300px" @change="changeBusinessId">
        <el-option v-for="item in businessLineList" :key="item.businessLineId" :label="item.description" :value="item.businessLineId"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="businessLineDialog = false">取 消</el-button>
        <el-button size="small" type="danger" @click="saveBusinessLine">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 关联面板 -->
    <el-dialog title="关联客户MSLA账号" :visible.sync="MSLAInfoDialog" width="592px" :close-on-click-modal="false">
      <div v-if="accountInfo.id">
        <el-form ref="MSLAForm" :model="accountInfo" label-width="80px" label-position="top">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item>
                <span slot="label">MSLA</span><span style="margin-left: 7px" slot="label">Account</span>
                <span>{{ accountInfo.legacyId }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="ERP ID">
                <span>{{ accountInfo.erpId }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="ERP账户名称">
                <span>{{ accountInfo.accountName }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="地址">
                <span>{{ accountInfo.address }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div v-else style="display: flex; align-items: center; justify-content: center">
        暂无关联信息 <el-link @click="handReales" style="margin-left: 10px; color: #001450" v-gio.click="clickLinkNow">立即关联</el-link>
      </div>
      <span slot="footer" class="dialog-footer" v-if="accountInfo.id">
        <el-button size="small" @click="updateMsla">更 新</el-button>
        <el-button size="small" type="danger" @click="unbound">解 绑</el-button>
      </span>
    </el-dialog>
    <!-- 关联MSLA账号弹框 -->
    <el-dialog title="关联账号" :visible.sync="releaseMSLAAccountDialog" width="30%" :close-on-click-modal="false" @close="cancelMslaBind">
      <el-form ref="MSLAForm" :model="accountInfoForm" label-width="80px" label-position="top">
        <el-form-item>
          <span slot="label">MSLA</span><span style="margin-left: 7px" slot="label">Account：</span>
          <el-input v-model="accountInfoForm.legacyId" size="small" placeholder="请输入36位GUID" maxlength="36" show-word-limit clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: right">
        <el-button size="small" @click="cancelMslaBind">取 消</el-button>
        <el-button size="small" type="danger" @click="confirmReleaseMSLAAccount" v-gio.click="submitLinkAccount">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 初次设为 PES -->
    <el-dialog title="开启计划工程服务" :visible.sync="firstSetPesVisiable" top="5vh" :append-to-body="teue" width="30%" :close-on-click-modal="false" @close="cancelFirstPes">
      <span>初次开启计划工程服务，请填写服务信息：</span>
      <el-form ref="setPesForm" :model="setPesForm" label-width="80px" label-position="top" :rules="rules" style="margin-top: 20px">
        <el-form-item prop="year" label="年度">
          <el-select v-model="setPesForm.year" size="small" clearable placeholder="请选择" style="width: 60%">
            <el-option v-for="item in yearListData" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="workshopSelect" label="所属车间">
          <el-select multiple collapse-tags v-model="setPesForm.workshopSelect" clearable size="small" placeholder="请选择" style="width: 60%">
            <el-option v-for="item in pesWorkshopList" :key="item.workshopId" :label="item.workshopName" :disabled="item.disabled" :value="item.workshopId"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: right">
        <el-button size="small" @click="cancelFirstPes">取 消</el-button>
        <el-button size="small" type="danger" @click="confirmFirstPes('setPesForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 非初次设为 PES -->
    <el-dialog title="启用计划工程服务" :visible.sync="setPesVisiable" width="30%" :close-on-click-modal="false" @close="cancelsetPes">
      启用计划工程服务后，将开启客户计划工程服务档案管理权限
      <span slot="footer" class="dialog-footer" style="text-align: right">
        <el-button size="small" @click="cancelsetPes">取 消</el-button>
        <el-button size="small" type="danger" @click="confirmsetPes">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 取消 PES -->
    <el-dialog title="完结提示" :visible.sync="cancelPesVisiable" width="30%" :close-on-click-modal="false" @close="cancelPesClose">
      <div v-if="isEnd">完结后，系统将归档当前的年度档案，您将无法编辑。</div>
      <div v-else>无法完结，请完结所有服务项，确认计划书，发布年度总结后尝试。</div>
      <span slot="footer" class="dialog-footer" style="text-align: right" v-if="isEnd">
        <el-button size="small" @click="cancelPesClose">取 消</el-button>
        <el-button size="small" type="danger" @click="confirmCancelPes">完 结</el-button>
      </span>
      <span slot="footer" class="dialog-footer" style="text-align: right" v-if="!isEnd">
        <el-button size="small" @click="cancelPesClose">知道了</el-button>
      </span>
    </el-dialog>
    <!-- 分配经销商 -->
    <el-dialog
      :title="distributeDealerType == 'add' ? '分配服务商' : '编辑服务商'"
      :visible.sync="distributeDealerDialog"
      width="35%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      style="margin-top: -2%"
    >
      <el-form ref="distributorForm" :model="distributorForm" :rules="distributorRules" label-position="top">
        <el-form-item label="请选择服务商管理范围" prop="workshopIdList">
          <el-select v-model="distributorForm.workshopIdList" placeholder="请选择" clearable multiple size="small" style="width:80%">
            <el-option v-for="item in distributorWorkshopList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('distributorForm')">取 消</el-button>
        <el-button type="danger" size="small" @click="nextStep('distributorForm')" v-if="distributeDealerType == 'add'">下一步</el-button>
        <el-button type="danger" size="small" @click="consfirm('distributorForm')" v-if="distributeDealerType == 'edit'">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择经销商 -->
    <el-dialog title="分配服务商" :visible.sync="distributorDialog" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeDistorbutor">
      <el-form :model="distorbutorForm" label-width="80px">
        <el-form-item label="名称：">
          <el-input v-model="distorbutorForm.companyName" size="small" clearable placeholder="请输入名称" @change="nameChange" style="width:35%"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-table height="400px" :data="distorbutorTableData" tooltip-effect="dark" ref="distorbutorTableRef" row-key="id" @select="handleSelectDistorbutor" @select-all="selectAllDistorbutor">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="companyName" label="名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                <span>{{ scope.row.companyName }}</span>
                <img v-if="scope.row.assistSpFlag" src="../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="taxNumber" label="税号" show-overflow-tooltip> </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="distorbutorSizeChange"
          @current-change="distorbutorCurrentChange"
          :current-page="distorbutorForm.current"
          :page-size="distorbutorForm.size"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="distorbutorTotal"
          style="position: relative;display: flex;justify-content: flex-end;margin-top: 10px;bottom:0px;right:0px"
        >
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="upStep">取 消</el-button>
        <el-button type="danger" size="small" @click="confirmDistorbutor">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 取消关联 -->
    <el-dialog title="取消关联" :visible.sync="cancelRelationDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelRelation">
      <div>
        取消关联后将产生以下变化：
        <p>该服务商将无法查看、管理该直供客户的任何数据</p>
        <p>如果该服务商仅关联了该直供客户，该服务商将变为普通经销商</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelRelationDialog = false">取 消</el-button>
        <el-button type="danger" size="small" @click="dissRelation" v-has="PC_Customer_ReleaseDASP">解除关联</el-button>
      </span>
    </el-dialog>
    <!-- 删除效益报告弹框 -->
    <el-dialog title="删除提示" :visible.sync="deleteDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="30%" :before-close="handleClose">
      <span><span style="color:#dd0000">*</span>您删除的效益报告关联有客户案例（POP/ROP），无法删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- pop可见性 -->
    <el-dialog title="对谁可见" :visible.sync="canViewVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="30%" center :before-close="handleClose">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全部</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <div>
        <el-checkbox-group v-model="checkedView" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="(item, index) in viewList" :label="item.value" :key="index"
            >{{ item.label }}
            <div style="font-size:12px;color:#ccc">{{ item.notice }}</div>
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="danger" plain @click="cancelCanView">取 消</el-button>
        <el-button size="small" type="danger" @click="saveCanView">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="isShowPopOrRopPic" :close-on-click-modal="false" :close-on-press-escape="false" width="45%" center>
      <el-image style="width: 90%; height: 90%" :src="popOrRopImgUrl" :preview-src-list="[popOrRopImgUrl]" :fit="fit"></el-image>
    </el-dialog>
    <!-- 添加分管人 -->
    <el-dialog title="添加分管人" :visible.sync="chargeUserVisiable" :append-to-body="true" width="60%" class="create-task">
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
        <span style="margin-left: 10px">角色：</span>
        <el-select size="small" v-model="queryParamsDialog.roleCodeList" multiple @change="handleSearchTableData" placeholder="全部" style="width:280px">
          <el-option v-for="item in roleList" :key="item.accessTemplateId" :label="item.accessTemplateName" :value="item.accessTemplateId"></el-option>
        </el-select>
        <el-button @click="handleClearDialog" style="margin-left:30px;" size="small">重置</el-button>
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
      <div slot="footer" style="margin: 50px 0 10px;">
        <el-button type="danger" plain @click="handleResetChargeUser()" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitChargeUser()" size="small">确定</el-button>
      </div>
    </el-dialog>
    <!-- 岗位 -->
    <el-dialog
      width="30%"
      :title="postType == 'createPost' ? '新建岗位' : '编辑岗位'"
      :visible.sync="addPostDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelAddPost"
    >
      <el-form ref="addPost" :rules="addPostRules" :model="addPostForm" label-width="80px" label-position="top">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="岗位名称" prop="postName">
              <el-input v-model="addPostForm.postName" size="small" maxlength="15" placeholder="请输入" style="width:90%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="管理任务类型" label-width="120">
              <el-select v-model="addPostForm.taskTypeCode" multiple clearable placeholder="请选择" size="small" style="width:90%">
                <el-option v-for="item in taskTypeList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="岗位详情">
              <el-input type="textarea" :rows="3" v-model="addPostForm.postDetails" size="small" maxlength="50" placeholder="请输入" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" plain size="small" @click="deletePost" v-if="postType == 'editPost'">删 除</el-button>
        <el-button type="danger" size="small" @click="saveAddPost">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="确认删除" :visible.sync="deletePostDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelDelete">
      <div>删除岗位后您将无法恢复，是否继续？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="confirmDeletePost">确 认</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑人员" :visible.sync="editUserDialog" width="45%" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelEditUser">
      <div class="choose-workshop-title">
        <span style="color:#000;font-size:16px;font-weight:bolder;">岗位人员</span>
        <span style="color:#dd0000;margin-left:10px;font-size:16px;font-weight:bolder;">{{ editUserNum }}</span>
      </div>
      <!-- 滚动加载表格 -->
      <div>
        <el-table
          height="400"
          :data="companyMemberList"
          tooltip-effect="dark"
          ref="editUserRef"
          v-loading="loadingUser"
          v-el-table-infinite-scroll="loadMoreCompanyMemer"
          row-key="id"
          @select="handleSelectUser"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="userName" label="姓名" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="phonenumber" label="电话" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip> </el-table-column>
          <p v-if="loadMoreUserFlag">加载中...</p>
          <p v-if="!loadMoreUserFlag">没有更多了</p>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="confirmEditUser">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="isWatchRecallReason ? '驳回原因' : '输入驳回原因'" :visible.sync="reasonFormVisible" width="500px" class="email-dialog" :close-on-click-modal="false">
      <el-form :model="ruleFormReject" ref="ruleForm" label-position="right">
        <el-row class="email-font">
          <el-col :span="24">
            <el-form-item prop="rejectReason">
              <el-input
                :rows="4"
                v-if="!isWatchRecallReason"
                v-model="ruleFormReject.rejectReason"
                :clearable="true"
                type="textarea"
                maxlength="50"
                show-word-limit
                placeholder="请输入驳回原因"
              ></el-input>
              <el-input :rows="4" v-if="isWatchRecallReason" v-model="ruleFormReject.rejectReason" type="textarea" maxlength="50" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: right" v-if="!isWatchRecallReason">
        <el-button @click="reasonFormVisible = false" size="small">取消</el-button>
        <el-button type="danger" @click="rejectReasonSubmit('ruleFormReject')" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import LeftTree from "../myTeam/components/leftTree.vue";
import CreateWorkshop from "./components/createWorkshop";
// import rightDetail from "../myTeam/components/rightDetail.vue";
import { fullScreen_loading } from "../../generalComponents/fullScreenLoading";
import Pagination from "./components/Pagination.vue";
import wangEditor from "../pes/component/wangEditor.vue";
import customTable from "../tableComponents/customTable";
import OSSClient from "../../utils/ossClient";
import RecordCardList from "../formApplication/formHistoryRecordStaticList/index";
import lupDialogNew from "../spotInspection/components/chooseLubricationPointWorkorder.vue";
import columnHeader from "../tableComponents/headerComponent";
import cpServicesOverview from "./components/cpServicesOverview.vue";
import AuthManageMixin from "./mixins/authManage";
import equipLumList from "./components/equipLumList.vue";
const oss_client = new OSSClient();
export default {
  mixins: [AuthManageMixin],
  components: {
    Pagination,
    wangEditor,
    RecordCardList,
    "custom-table": customTable,
    CreateWorkshop,
    lupDialogNew,
    "column-header": columnHeader,
    cpServicesOverview,
    equipLumList
  },
  data() {
    return {
      memberTableDataHeader: [
        { label: "姓名", prop: "userName", width: "150", tooltip: true },
        { label: "岗位", prop: "postNames", width: "200", tooltip: true },
        { slot: "phonenumber" },
        { label: "邮箱", prop: "email", width: "200", tooltip: true }
      ],
      positionTableDataHeader: [
        { label: "岗位", prop: "postName", width: "150", tooltip: true },
        { label: "岗位详情", prop: "postDetails", width: "200", tooltip: true },
        { label: "管理任务类型", prop: "taskTypeName", width: "200", tooltip: true },
        { label: "岗位人数", prop: "userCounts", width: "200", tooltip: true },
        { slot: "operation" }
      ],
      selectItem: {},
      isWatchRecallReason: false,
      busId: "",
      ruleFormReject: {
        rejectReason: ""
      },
      reasonFormVisible: false,
      businesslineId: "",
      businessLineList: [],
      businessLineDialog: false,
      headImg: require("../../assets/headImg.png"),
      showServiceOverview: false, // 服务概览是否被点击
      tableHeight: 300,
      loadingWorkShop: false,
      tableDataHeaderWorkshop: [
        { label: "车间名称", prop: "workshopName", width: "150", tooltip: true },
        // { label: "成员数", prop: "userCount", width: "120", tooltip: true },
        { label: "设备数", prop: "deviceCount", width: "120", tooltip: true },
        // { label: "工单数", prop: "workOrderCount", width: "120", tooltip: true },
        { label: "创建日期", prop: "createTime", width: "200", tooltip: true },
        // { slot: "distributorName" },
        { slot: "operation" }
      ],
      tableDataHeaderEquipment: [
        { slot: "deviceName" },
        { label: "设备类型", prop: "deviceTypeName", width: "150", tooltip: true },
        { label: "所属车间", prop: "workshopName", width: "150", tooltip: true },
        { label: "润滑点数", prop: "lubricationPointNum", width: "150", tooltip: true },
        { label: "最后服务日期", prop: "lastServiceTime", width: "150", tooltip: true },
        { label: "创建日期", prop: "createTime", width: "150", tooltip: true },
        { label: "最后修改日期", prop: "updateTime", width: "150", tooltip: true },
        { slot: "dataIntegrityFlag" }
      ],
      tableDataHeaderWorkorder: [
        { slot: "workOrderNumber", label: "工单编号", paramValue: "workOrderNumber", filterType: "input", sortTypeVal: "default" },
        { slot: "serviceName", label: "服务项", paramValue: "serviceName", filterType: "selection" },
        { label: "所属车间", paramValue: "workshopName", prop: "workshopName", width: "180", tooltip: true, filterType: "selection" },
        { slot: "contactName" },
        { slot: "executePersonName", label: "执行人", paramValue: "executePersonName", filterType: "input" },
        { label: "预约日期", paramValue: "expectComingTime", prop: "expectComingTime", width: "150", tooltip: true, filterType: "dateSingle", sortTypeVal: "default" },
        { label: "创建日期", paramValue: "createTime", prop: "createTime", width: "150", tooltip: true, filterType: "dateSingle", sortTypeVal: "default" },
        { slot: "workOrderStatus" }
      ],
      tableDataHeaderApply: [
        { label: "申请单号", prop: "serviceApplyNo", width: "180", tooltip: true },
        { slot: "serviceApplyType" },
        { slot: "distributorCompanyName" },
        { label: "需求概述", prop: "questionDesc", width: "180", tooltip: true },
        { label: "申请时间", prop: "applyTime", width: "180", tooltip: true },
        { slot: "serviceApplyStatus" },
        { slot: "operation" }
      ],
      tableDataHeaderCharge: [
        { label: "姓名", prop: "userName", width: "150", tooltip: true },
        { label: "角色", prop: "roleNames", width: "200", tooltip: true },
        { slot: "telephone" },
        { slot: "operation" }
      ],
      workShopId: "",
      viewIcon: require("../../assets/account_view.png"),
      notViewIcon: require("../../assets/account_not_view.png"),
      loadMoreBon: true,
      loadMorePopRop: true,
      noSaveReportFlag: false,
      chargeUserVisiable: false, // 添加分管人弹框是否展示
      queryParams: {},
      chargePage: {
        // 分管人分页参数
        current: 1,
        size: 10
      },
      showDeviceLum: false,
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
      customerUserData: [], // 添加分管人弹框数据
      customerUserTotalDialog: 0, // 添加分管人弹框列表数据总数
      loadingDialog: false,
      selectChecked: [], // 分管弹框选中的数据
      nowYear: "",
      xyzjIdQuery: "",
      totalPopOrRopNumber: 0,
      totalBenefitNumber: 0,
      authorityType: false,
      emissionList: [{ value: true, label: "有" }, { value: false, label: "无" }],
      pesWorkshopList: [],
      currentTab: "1", // 当先下标
      contactDetail: {},
      executeDetail: {},
      firstSetPesVisiable: false,
      setPesVisiable: false,
      cancelPesVisiable: false, // 取消 pes
      spLoading: false,
      yearListData: [],
      defaultImg: require("../../assets/lp-none.png"),
      mainminheight: `height:${document.documentElement.clientHeight - 290}px`,
      imgUrl: "", // 图片
      // 表单验证
      ruleForm: {
        name: "",
        number: "",
        scale: "",
        industry: "",
        dealer: "",
        shortName: "",
        province: "",
        city: "",
        address: "",
        phone: "",
        status: "",
        nowDate: "",
        spFlag: 0
      },
      setPesForm: {
        year: "",
        workshopSelect: "",
        workshopId: []
      },
      //   表单验证规则
      rules: {
        year: [{ required: true, message: "请选择年份", trigger: "change" }],
        workshopSelect: [{ required: true, message: "请选择所属车间", trigger: "blur" }],
        workshopId: [{ required: true, message: "请选择具体所属车间", trigger: "change" }]
      },
      scaleList: [], // 规模
      industryList: [], // 行业
      dealerList: [], // 经销商
      staffData: [],
      // 分页参数
      pagenation: {
        current: 1,
        size: 10
      },
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
      // 效益报告分页参数
      pagenation4: {
        current: 1,
        size: 10
      },
      // pop/rop分页参数
      pagenation5: {
        current: 1,
        size: 10
      },
      // 计划工程服务分页参数
      pagenation6: {
        current: 1,
        size: 10
      },
      pesReportList: [],
      totalPesNumber: 0, // 计划工程服务档案总条数
      totalNumber: 0, // 总条数
      numTotal: 0,
      accountInfo: {},
      pageHeight: "",
      tabsType: "workshop",
      workshopList: [],
      workshopCurrent: 1,
      workshopTotal: 0,
      workOrderList: [],
      workOrderTotal: 0,
      equipmentList: [],
      equipmentTotal: 0,
      MSLAInfoDialog: false,
      releaseMSLAAccountDialog: false,
      userType: "",
      selfCompanyNumber: "",
      accountInfoForm: {
        legacyId: ""
      },
      companyId: "",
      isEnd: false,
      jurisdictionBtn: false,
      EquipmentProfilBtn: false,
      workOrderBtn: false,
      accountBtn: false,
      menuList: [],
      spBtnFlag: false,
      userInfo: this.$userInfo,
      // 人员
      loadingDetail: false,
      nodeObj: {},
      userTotalNum: 0,
      // 分配经销商
      distributeDealerDialog: false,
      distributeDealerType: "add",
      distributorForm: {
        workshopIdList: []
      },
      distributorWorkshopList: [],
      distributorRules: {
        workshopIdList: [{ required: true, message: "请选择服务商管理范围", trigger: "change" }]
      },
      // 选择经销商
      distributorDialog: false,
      distorbutorForm: {
        companyName: "",
        areaName: "",
        current: 1,
        size: 10,
        companyType: 1
      },
      distorbutorTableData: [],
      distorbutorTotal: 0,
      // 服务商tab页
      serviceDistributorList: [],
      // 取消关联
      cancelRelationDialog: false,
      cancelRelationObj: {},
      editDistributorObj: {},
      DABtn: false,
      showButtonFlag: false,
      defaultExpandedList: [],
      // 非计划工程服务档案
      reverse: false,
      deleteDialogVisible: false,
      allReportList: [],
      benefitReportDynamicList: [],
      // pop/rop
      activeType: "pop",
      canViewVisible: false,
      distributorViewList: [
        {
          value: "11",
          label: "分管的美孚区域技术经理",
          notice: "经销商创建者账号，与分管经销商的区域技术经理的账号，能看见"
        },
        // {
        //   value: "12",
        //   label: "当前客户",
        //   notice: "经销商创建者账号，与当前客户的账号，能看见"
        // },
        {
          value: "13",
          label: "其他经销商",
          notice: "经销商创建者账号，与其他经销商的账号，能看见"
        },
        {
          value: "14",
          label: "美孚",
          notice: "经销商创建者账号，与美孚的账号，能看见"
        }
      ],
      mobilViewList: [
        {
          value: "21",
          label: "分管的经销商",
          notice: "美孚创建者账号，与分管该客户的经销商的账号，能看见"
        },
        {
          value: "22",
          label: "其他经销商",
          notice: "美孚创建者账号，与其他经销商的账号，能看见"
        },
        {
          value: "23",
          label: "美孚其他人",
          notice: "美孚创建者账号，与美孚其他人的账号，能看见"
        }
      ],
      isIndeterminate: false,
      checkAll: false,
      checkedView: [],
      viewList: [],
      popList: [],
      ropList: [],
      popOrRopList: [],
      customerCaseDynamicList: [],
      customerSignFileList: [], // POP客户签字盖章文件
      xyzjSignFileList: [], // 效益报告客户签字盖章文件
      legalAffairsFileList: [], //法务审批文件
      shareType: "",
      popOrRopItem: {},
      add_report: false,
      delete_report: false,
      edit_report: false,
      upload_file: false,
      delete_file: false,
      confirm_sharing: false,
      isShowPopOrRopPic: false,
      popOrRopImgUrl: "",
      serviceApplyTableData: [],
      chargeTableData: [], // 分管人数据
      chargeTableTotalNumber: 0,
      serviceApplyPage: {
        current: 1,
        size: 10
      },
      serviceApplyTotalNumber: 0,
      serviceApplyTabFlag: false,
      createWorkshopDialog: false, // 新建车间的弹框显隐
      chooseDeviceAndLupDialog: false,
      urlType: "workshop",
      checkedDevice: [],
      workshopType: "", // 创建车间类型
      addWorkshopForm: {}, // 编辑车间选中的数据
      manageWorkshop: false // 管理车间的按钮权限
    };
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
        default:
          return "已取消";
      }
    }
  },
  created() {
    this.$gio.toCustomerDetails({
      entrance: "客户列表"
    });
    let nowDate = new Date();
    this.nowYear = nowDate.getFullYear();
    this.pageHeight = document.documentElement.clientHeight;
    this.selfCompanyNumber = this.userInfo.orgInfo.companyNumber;
    this.userType = this.userInfo.userType;
    this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    let btnStr = [];
    let btnStr1 = [];
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "manage_PES_tag") {
        this.jurisdictionBtn = true;
      }
      if (buttonList[i].menuCode == "manageWorkshop") {
        this.manageWorkshop = true;
      }
      if (buttonList[i].menuCode == "manage_SP_tag") {
        this.spBtnFlag = true;
      }
      if (buttonList[i].menuCode == "Distribute-DA-Service") {
        this.DABtn = true;
      }
      if (buttonList[i].menuCode == "add_report") {
        this.add_report = true;
      }
      if (buttonList[i].menuCode == "delete_report") {
        this.delete_report = true;
      }
      if (buttonList[i].menuCode == "edit_report") {
        this.edit_report = true;
      }
      if (buttonList[i].menuCode == "upload_file") {
        this.upload_file = true;
      }
      if (buttonList[i].menuCode == "delete_file") {
        this.delete_file = true;
      }
      if (buttonList[i].menuCode == "confirm_sharing") {
        this.confirm_sharing = true;
      }
    }
    for (let i in this.menuList) {
      let item = this.menuList[i];
      if (item.menuCode == "FirstDevice") {
        btnStr1 = item.children;
      }
      if (item.menuCode == "NewWorkOrderList") {
        this.workOrderBtn = true;
      }
      if (item.menuCode == "NewWorkOrderList") {
        this.workOrderBtn = true;
      }
      if (item.menuCode == "ServiceApply") {
        this.serviceApplyTabFlag = true;
      }
      if (item.menuCode == "code_2185") {
        btnStr = item.children;
      }
    }
    if (btnStr1.length > 0) {
      for (let i in btnStr1) {
        let item = btnStr1[i];
        if (item.menuCode == "EquipmentProfil") {
          this.EquipmentProfilBtn = true;
        }
      }
    }
    if (btnStr.length > 0) {
      for (let i in btnStr) {
        let item = btnStr[i];
        if (item.menuCode == "AccountManageme") {
          this.accountBtn = true;
        }
      }
    }
    // if (this.userInfo.userType == 0 && this.selfCompanyNumber != this.ruleForm.customerCompanyNumber) {
    //   this.tableDataHeaderWorkshop.push({ label: "所属经销商", prop: "distributorName", width: "200", tooltip: true });
    // }
    this.getBusinesslineList();
    this.$_getScaleList(); // 获取规模列表
    this.$_queryDealerInfo(this.$route.query.companyNumber); // 查询经销商信息
    this.$_getEquipmentList(); // 获取设备列表
    this.getBindingAccountId();
    this.getPesWorkShopList();
    // 获取服务商列表
    this.getServiceDistributorList();
    // 获取效益报告-动态
    this.getBenefitReportDynamic();
    this.xyzjIdQuery = this.$route.query.xyzjIdQuery ? this.$route.query.xyzjIdQuery : "";
    this.currentTab = this.$route.query.tabSource ? this.$route.query.tabSource : "1";
    this.activeType = this.$route.query.popRopFlag ? this.$route.query.popRopFlag : "pop";
    // 获取pop列表
    this.getPopOrRopList();
    // 获取客户案例动态
    this.getCustomerCaseDynamicList();
    // 获取上传效益报告权限
    this.getAuthorityType();
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 290}px`;
      })();
    };
    window.addEventListener("beforeunload", e => this.beforeunloadHandler(e));
  },
  watch: {
    popOrRopList: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          val.forEach(it => {
            if (this.activeType == "pop") {
              if (it.customerSignFileList.length && it.xyzjSignFileList.length && it.legalAffairsFileList.length) {
                it.canShareFlag = true;
              } else {
                it.canShareFlag = false;
              }
            } else {
              if (it.customerSignFileList.length) {
                it.canShareFlag = true;
              } else {
                it.canShareFlag = false;
              }
            }
          });
        }
      },
      immediate: true,
      deep: true
    },
    pagenation4: {
      handler() {
        this.getBenefitReportList();
      },
      deep: true
    },
    pagenation5: {
      handler() {
        this.getPopOrRopList();
      },
      deep: true
    },
    pagenation6: {
      handler() {
        this.getPesReportList();
      },
      deep: true
    }
  },
  methods: {
    changeBusinessId(val) {
      this.businessLineId = val;
    },
    saveBusinessLine() {
      this.requestMethodPost("/msla/account/updateAccountBussinessLine", { companyNumber: this.$route.query.companyNumber, businessLineId: this.businessLineId })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.businessLineDialog = false;
            this.$message({
              message: res.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        });
    },
    getBusinesslineList() {
      this.requestMethodGet("/msla/bussinessLine/queryMslaBussinessLineList")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.businessLineList = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        });
    },
    // 点击新建车间
    handleCreateWorkshop() {
      this.createWorkshopDialog = true;
      this.workshopType = "add";
      this.addWorkshopForm = {
        workshopName: "",
        workshopPrincipal: [],
        distributorId: ""
      };
      this.$gio.clickCreateWorkshop({
        entrance: "客户详情页"
      });
    },
    // 编辑车间
    handleEditWorkshop(row) {
      if (row.no) {
        this.workshopType = "editNo";
      } else {
        this.workshopType = "edit";
      }
      this.addWorkshopForm.workshopId = row.workshopId; // 编辑车间选中的数据
      this.createWorkshopDialog = true;
      this.$gio.EditingWorkshop({
        entrance: "编辑车间"
      });
      this.$gio.Clicktoedit({
        entrance: "客户详情页"
      });
    },
    handleDeleteWorkshop(row) {
      this.$confirm("是否确认删除车间？", "删除车间", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestMethodGet("/weChat/workshop/canDissolveWorkshop", {
            workshopId: row.workshopId
          })
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.deleteWorkshop(row);
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
          this.$gio.DeleteWorkshop();
        })
        .catch(() => {});
    },
    deleteWorkshop(item) {
      const params = {
        workshopId: item.workshopId,
        workshopPrincipalPostId: item.workshopPrincipalPostId
      };
      this.requestMethodGet("/web/system/permission/orgWorkShopManage/delete", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: item.workshopName + "车间删除成功",
            type: "success"
          });
          this.$_getWorkshopList(); // 刷新车间列表
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        this.$gio.DeleteWorkshop();
      });
    },
    addOrEditWorkshop(formName) {
      let params;
      let url;
      if (this.workshopType == "add") {
        url = "/web/system/permission/orgWorkShopManage/add";
        params = {
          companyId: this.ruleForm.companyId,
          workshopName: formName.workshopName
        };
      } else {
        url = "/web/system/permission/orgWorkShopManage/edit";
        params = {
          id: this.addWorkshopForm.workshopId,
          workshopName: formName.workshopName
        };
      }
      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
          let msg = this.workshopType == "add" ? "新建成功" : "编辑成功";
          this.$message({
            message: msg,
            type: "success"
          });
          this.createWorkshopDialog = false;
          this.$_getWorkshopList(); // 刷新车间列表
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
        this.$gio.Clicksave();
      });
    },
    closeDialogAdd() {
      this.createWorkshopDialog = false;
    },
    // 点击确认转移按钮，关闭选择设备弹框
    confirmTranfer() {
      this.chooseDeviceAndLupDialog = false;
      this.$_getWorkshopList(); // 刷新车间列表
      this.$_getEquipmentList(); // 刷新设备列表
    },
    // 转移设备
    handletranferEquip(row) {
      this.workShopId = row.workshopId;
      this.chooseDeviceAndLupDialog = true;
      this.$gio.Clicktotransferdevice({
        entrance: "客户详情页"
      });
    },
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false;
    },
    confirmChooseLup(list) {
      this.chooseDeviceAndLupDialog = false;
      this.checkedDeviceForm.checkedDevice = list;
    },
    wangEditorMsg(msg, index, val) {
      let htmlVal = val.getHtml();
      if (msg == "lubPainSpot") {
        this.allReportList[index].lubPainSpot = htmlVal;
      } else if (msg == "solution") {
        this.allReportList[index].solution = htmlVal;
      } else if (msg == "resultDesc") {
        this.allReportList[index].resultDesc = htmlVal;
      }
      // this.noSaveReportFlag = true
    },
    proving(item, val) {
      if (val == "safe") {
        item.effectSafe = item.effectSafe.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        item.effectSafe = item.effectSafe.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        item.effectSafe = item.effectSafe.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        item.effectSafe = item.effectSafe
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        item.effectSafe = item.effectSafe.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        item.effectSafe = item.effectSafe.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.effectSafe = item.effectSafe.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        item.effectSafe = item.effectSafe.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == "environment") {
        item.effectEnvironment = item.effectEnvironment.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        item.effectEnvironment = item.effectEnvironment.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        item.effectEnvironment = item.effectEnvironment.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        item.effectEnvironment = item.effectEnvironment
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        item.effectEnvironment = item.effectEnvironment.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        item.effectEnvironment = item.effectEnvironment.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.effectEnvironment = item.effectEnvironment.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        item.effectEnvironment = item.effectEnvironment.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == "efficiency") {
        item.effectHigh = item.effectHigh.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        item.effectHigh = item.effectHigh.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        item.effectHigh = item.effectHigh.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        item.effectHigh = item.effectHigh
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        item.effectHigh = item.effectHigh.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        item.effectHigh = item.effectHigh.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.effectHigh = item.effectHigh.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        item.effectHigh = item.effectHigh.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
      if (val == "co2Num") {
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", "."); // 只允许输入一个小数点
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        item.effectEnvironmentCo2Num = item.effectEnvironmentCo2Num.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
    },
    beforeunloadHandler(event) {
      if (this.noSaveReportFlag) {
        event.preventDefault();
        event.returnValue = "您还未保存记录，该项上传报告内容将不被保存，是否继续？";
        return "您还未保存记录，该项上传报告内容将不被保存，是否继续？";
      }
    },
    getAuthorityType() {
      if (this.userInfo.userType == 0 && this.userInfo.accessTemplateNames.length > 0) {
        this.userInfo.accessTemplateNames.forEach(item => {
          if (item.roleCode == "fes" || item.roleCode == "ace-fes" || item.roleCode == "admin") {
            this.authorityType = true;
          }
        });
      }
      // 获取效益报告列表
      this.getBenefitReportList();
      this.getPesReportList();
    },
    // 上传附件
    async handleAddFile(file, item) {
      const fileType = file.name.split(".")[file.name.split(".").length - 1];
      const limitSze = file.size / 1024 / 1024 < 50;
      if (!limitSze) {
        this.$message({
          type: "warning",
          message: "上传失败，请上传50M以内的pdf格式的单个附件"
        });
        return;
      }
      fullScreen_loading.LOADING();
      await oss_client.getOSSClientInstance("pes_report_file");
      const uploadFileRes = await oss_client.uploadFile(file.raw, file.raw.name);
      if (!item) {
        // 点击上传效益报告
        this.addCenterGroup(file.name, uploadFileRes.name);
      } else {
        // 点击上传报告
        item.uploadFileName = file.name;
        item.fileUrl = uploadFileRes.name;
        item.createUserName = this.userInfo.userName;
        item.createTime = this.formatDate(new Date());
        this.noSaveReportFlag = true;
      }
      fullScreen_loading.ENDLOADING();
    },
    tipAlert() {
      if (this.noSaveReportFlag) {
        this.$confirm("您还未保存记录，该项上传报告内容将不被保存，是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$refs["upload"].$refs["upload-inner"].handleClick();
          })
          .catch(() => {});
      } else {
        this.$refs["upload"].$refs["upload-inner"].handleClick();
      }
    },
    uploadBenefitFile() {
      this.$refs["uploadBenefit"].click();
    },
    // 添加一组核心信息录入
    addCenterGroup(fileName, filePath) {
      this.allReportList.forEach(item => {
        // 其他的上传报告收起
        if (item.createType == 2) this.$set(item, "hideMore", true);
      });
      this.allReportList.unshift({
        customerId: this.companyId,
        distributorCompanyType: this.userInfo.userType,
        distributorCompanyId: this.userInfo.orgInfo.companyId,
        createType: 2,
        pdfName: "",
        lubPainSpot: "",
        solution: "",
        resultDesc: "",
        effectSafe: "",
        effectEnvironment: "",
        effectHigh: "",
        effectEnvironmentCo2Flag: true,
        effectEnvironmentCo2Num: "",
        uploadFileName: fileName,
        fileUrl: filePath,
        createTime: this.formatDate(new Date()),
        createUserName: this.userInfo.userName,
        relPopName: ""
      });
      this.noSaveReportFlag = true;
    },
    // 保存一组核心信息录入
    saveCenterItem(item) {
      if (
        !item.pdfName ||
        (!item.lubPainSpot || item.lubPainSpot == "<p><br></p>") ||
        (!item.solution || item.solution == "<p><br></p>") ||
        (!item.resultDesc || item.resultDesc == "<p><br></p>") ||
        !item.effectHigh
      ) {
        let firstMsg = !item.pdfName
          ? "报告名称"
          : !item.lubPainSpot || item.lubPainSpot == "<p><br></p>"
          ? "润滑痛点"
          : !item.solution || item.solution == "<p><br></p>"
          ? "解决方案"
          : !item.resultDesc || item.resultDesc == "<p><br></p>"
          ? "结果"
          : "高效";
        this.$alert(`您有${firstMsg}必填项未填写，数据将不被保存，请完善数据`, "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      if (!item.uploadFileName && !item.fileUrl) {
        this.$alert(`您有未上传报告，数据将不被保存，请上传报告`, "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      this.requestMethodPost("/pes/customer/addOrEdit", item).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.getBenefitReportDynamic();
          this.pagenation4.current = 1;
          this.getBenefitReportList();
          // this.checkNoSave();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 删除一组核心信息录入
    deleteCenterItem(item, index) {
      if (item.id) {
        if (item.relPopName) {
          this.deleteDialogVisible = true;
        } else {
          this.$confirm("是否确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.deleteReport(item);
            })
            .catch(() => {});
        }
      } else {
        this.$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.allReportList.splice(index, 1);
          })
          .catch(() => {});
      }
    },
    // 重置表单
    handleClearDialog() {
      this.queryParamsDialog = {
        userName: "",
        roleCodeList: []
      };
      this.pagenationDialog = {
        current: 1,
        size: 50
      };
      this.$_getChargeDistributorData();
    },
    // 获取角色数据
    $_queryRoleData() {
      this.roleList = [];
      this.requestMethodGet("/web/system/permission/roleManage/selectRoleListByMenuCode", {
        roleType: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userType,
        menuCode: "customer_pool_btn_PC"
      })
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
    handleSearchTableData() {
      this.pagenationDialog.current = 1;
      this.$_getChargeDistributorData();
    },
    /** 分管经销商数据列表 */
    $_getChargeDistributorData() {
      this.loadingDialog = true;
      let params = {
        ...this.pagenationDialog,
        companyNumber: this.$route.query.companyNumber,
        companyType: 2,
        sourceType: 1,
        userName: this.queryParamsDialog.userName,
        roleIds: this.queryParamsDialog.roleCodeList.length > 0 ? this.queryParamsDialog.roleCodeList.toString() : "",
        companyId: this.ruleForm.companyId
      };

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
      this.$_getChargeDistributorData();
    }, // current change
    handleCurrentChangeDialog(current) {
      this.pagenationDialog.current = current;
      this.$_getChargeDistributorData();
    },
    getRowKey(row) {
      return row.userId;
    },
    selectAll(val) {
      this.selectChecked = val;
    },
    // 取消分管经销商弹框
    handleResetChargeUser() {
      this.chargeUserVisiable = false;
    },
    //分管客户保存接口
    submitCharge() {
      let selectCheckedData = [];
      this.selectChecked.forEach(item => {
        selectCheckedData.push(item.userId);
      });
      const param = {
        userIdList: selectCheckedData,
        customerId: this.userInfo.orgInfo.companyId,
        companyId: this.$route.query.companyId
      };
      this.requestMethodPost("/weChat/chargeUser/addBatchChargeUser", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$message({
              message: "添加成功",
              type: "success"
            });

            this.chargeUserVisiable = false;
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
    // 提交移除分管人
    submitChargeUser(item, val) {
      const param = {
        companyId: this.$route.query.companyId,
        customerId: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyId,
        userId: item.id
      };
      this.requestMethodPost("/weChat/chargeUser/deleteCompanyChargeRel", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (val == "exit") {
              this.$message({
                type: "success",
                message: "退出成功"
              });
              history.back(-1);
            } else {
              this.$message({
                type: "success",
                message: "移除成功"
              });
              this.chargePage.current = 1;
              this.getChargeList();
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
    // 移除分管人
    handleDeleteChargeUser(item, val) {
      let btn = "移除";
      let msg = "是否移除分管人？移除后将失去对该客户的部分管理权限";
      let title = "移除分管人";
      if (val != "delete") {
        btn = "退出";
        msg = "是否退出分管人？退出后将失去对该客户的部分管理权限";
        title = "退出分管人";
      }
      this.$confirm(msg, title, {
        confirmButtonText: btn,
        cancelButtonText: "取消",
        type: ""
      })
        .then(() => {
          this.submitChargeUser(item, val);
        })
        .catch(() => {});
    },
    // 添加分管人按钮事件
    addChargeUser() {
      this.chargeUserVisiable = true;
      this.queryParamsDialog = {
        userName: "",
        roleCodeList: []
      };
      this.pagenationDialog = {
        current: 1,
        size: 50
      };
      this.$_getChargeDistributorData();
      this.$_queryRoleData();
      this.$nextTick(() => {
        this.$refs.tableChargeDistributor.clearSelection();
      });
    },
    changeMore(item, index) {
      // 只有一个未保存的上传效益报告，展开时不提示
      let saveArr = [];
      this.allReportList.forEach((item, index) => {
        if (item.createType == 2 && !item.status) {
          saveArr.push(item);
        }
      });
      if (item.hideMore) {
        // 点击展开，校验其他报告是否保存
        if (this.noSaveReportFlag && saveArr.length > 1) {
          this.$confirm("您还未保存记录，该项上传报告内容将不被保存，是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              // 当前报告展开
              item.hideMore = item.hideMore ? this.$set(item, "hideMore", false) : this.$set(item, "hideMore", true);
              // 其他展开的报告收起
              this.allReportList.forEach((item, indexA) => {
                if (index !== indexA && !item.hideMore && item.createType == 2) {
                  this.$set(item, "hideMore", true);
                }
              });
            })
            .catch(() => {});
        } else {
          // 当前报告展开
          item.hideMore = item.hideMore ? this.$set(item, "hideMore", false) : this.$set(item, "hideMore", true);
          // 其他展开的报告收起
          this.allReportList.forEach((item, indexA) => {
            if (index !== indexA && !item.hideMore && item.createType == 2) {
              this.$set(item, "hideMore", true);
            }
          });
        }
      } else {
        // 点击收起
        if (!item.fileUrl || item.fileUrl == "") {
          this.$message({
            message: "请先上传报告后，再收起。",
            type: "warning"
          });
          return;
        }
        item.hideMore = item.hideMore ? this.$set(item, "hideMore", false) : this.$set(item, "hideMore", true);
      }
    },
    checkNoSave() {
      let noSaveFlag = false;
      this.allReportList.forEach(item => {
        if ((!item.status || (item.status && item.status !== 4)) && item.createType == 2) {
          noSaveFlag = true;
        }
      });
      this.noSaveReportFlag = noSaveFlag;
    },
    deleteReportItem(item, index) {
      if (item.hideMore) {
        // 收起状态
        this.deleteCenterItem(item, index);
      } else {
        if (item.id) {
          if (item.relPopName) {
            this.deleteDialogVisible = true;
          } else {
            this.$confirm("是否确认删除?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                item.uploadFileName = "";
                item.fileUrl = "";
                item.createUserName = "";
                item.createTime = "";
                this.noSaveReportFlag = true;
              })
              .catch(() => {});
          }
        } else {
          this.$confirm("是否确认删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              item.uploadFileName = "";
              item.fileUrl = "";
              item.createUserName = "";
              item.createTime = "";
              this.noSaveReportFlag = true;
            })
            .catch(() => {});
        }
      }
    },
    async previewUploadFile(item) {
      if (item.fileName.toLowerCase().includes(".pdf")) {
        window.open(await this.getFileUrl(item.fileUrl));
      } else {
        this.popOrRopImgUrl = await this.getFileUrl(item.fileUrl);
        this.isShowPopOrRopPic = true;
      }
    },
    async getFileUrl(halfPath) {
      const res = await this.requestMethodGet("/web/file/getFullUrl", {
        url: encodeURI(halfPath)
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
    async getDownloadFile(halfPath) {
      const res = await this.requestMethodGet("/web/file/getFullDownloadUrl", {
        url: halfPath
      });
      if (res.data.code == 1000) {
        return Promise.resolve(res.data.data);
      } else {
        this.$message({
          type: "warning",
          message: "获取下载路径失败，请稍后重试。"
        });
      }
    },
    // tab切换事件
    handleClick(val) {
      if (this.currentTab == "companyPosition") {
        this.refreshMemberList();
      }
      this.currentTab = val.name;
      this.$gio.changeTabInCustomerDetails({
        customer: this.ruleForm.companyName
      });
      this.xyzjIdQuery = "";
      if (this.currentTab == "customerStories") {
        // 客户案例(POP/ROP)
        this.pagenation5.current = 1;
        this.getPopOrRopList();
        this.getCustomerCaseDynamicList();
      } else if (this.currentTab == "equipLum") {
        // 设备润滑表
        this.showDeviceLum = true;
      } else if (this.currentTab == "serviceOverview") {
        // 服务概览tab
        this.showServiceOverview = true;
        this.$gio.ClickonServiceOverview({
          customer: this.ruleForm.companyName
        });
      }
    },
    async beforeTabLeave(activeName) {
      // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
      if (activeName == "benefitReport") {
        this.pagenation4.current = 1;
        this.getBenefitReportList();
        this.getPesReportList();
        this.getBenefitReportDynamic();
      }
      if (activeName != "benefitReport") {
        return await this.formValidate();
      }
    },
    formValidate() {
      let p = new Promise((resolve, reject) => {
        if (this.noSaveReportFlag) {
          this.$confirm("您还未保存记录，该项上传报告内容将不被保存，是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        } else {
          resolve();
        }
      });
      return p;
    },
    getPopOrRopList() {
      const loading = this.$loading({
        lock: true,
        text: "数据加载中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const params = {
        popRopFlag: this.activeType == "pop" ? 1 : 2,
        customerId: this.$route.query.companyId,
        ...this.pagenation5
      };
      this.requestMethodGet("/pes/pop/listByPage", params).then(res => {
        if (res.data.code == 1000) {
          this.popOrRopList = res.data.data.list;
          this.totalPopOrRopNumber = res.data.data.totalCount;
          loading.close();
        } else {
          loading.close();
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getCustomerCaseDynamicList() {
      const params = {
        customerId: this.$route.query.companyId
      };
      this.requestMethodGet("/pes/pop/trends/list", params).then(res => {
        if (res.data.code == 1000) {
          this.customerCaseDynamicList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // pop/rop点击
    activeStories(type) {
      this.activeType = type;
      this.pagenation5.current = 1;
      this.getPopOrRopList();
      this.$gio.changeTabOfCustomerCase();
    },
    // 前往查看
    toView(item) {
      this.$gio.clickToViewButton({
        entrance: "客户详情页-业绩证明"
      });
      if (item.createType == 1) {
        // 1制作的报告
        const routeUrl = this.$router.resolve({
          path: "/CustomerProfile/benefitReport",
          query: {
            companyName: this.ruleForm.companyName,
            customerId: this.ruleForm.companyId,
            customerCompanyNumber: this.$route.query.companyNumber,
            distributorCompanyType: this.userInfo.userType,
            distributorCompanyId: this.userInfo.orgInfo.companyId,
            pageType: this.activeType,
            benefitReportId: item.relationXyzjId
          }
        });
        window.open(routeUrl.href, "_blank");
      } else if (item.createType == 2) {
        // 2上传报告
        const routeUploadUrl = this.$router.resolve({
          path: "/CustomerProfile/CustomerProfileDetail",
          query: {
            companyNumber: this.$route.query.companyNumber,
            companyId: this.$route.query.companyId,
            xyzjIdQuery: item.relationXyzjId,
            tabSource: "benefitReport"
          }
        });
        window.open(routeUploadUrl.href, "_blank");
      }
    },
    // 上传文件
    upChange(file, type, item, index) {
      this.$gio.uploadFileOfCustomerCase({
        caseType: this.activeType == "pop" ? "业绩证明：POP" : "业绩参考：ROP"
      });
      switch (type) {
        // POP客户签字盖章文件
        case "pop_customer":
          if (this.handleLimit(type, index) > 4) {
            this.$message({
              type: "warning",
              message: "POP客户签字盖章文件最多上传5个"
            });
            return;
          }
          this.ossUploadFile(file, type, item, index);
          break;
        // 效益报告客户签字盖章文件
        case "benefit_customer":
          if (this.handleLimit(type, index) > 4) {
            this.$message({
              type: "warning",
              message: "效益报告客户签字盖章文件最多上传5个"
            });
            return;
          }
          this.ossUploadFile(file, type, item, index);
          break;
        // 法务审批文件
        case "legal_approval":
          if (this.handleLimit(type, index) > 4) {
            this.$message({
              type: "warning",
              message: "法务审批文件最多上传5个"
            });
            return;
          }
          this.ossUploadFile(file, type, item, index);
          break;
        // 客户签字文件
        case "rop_customer":
          if (this.handleLimit(type, index) > 4) {
            this.$message({
              type: "warning",
              message: "客户签字文件最多上传5个"
            });
            return;
          }
          this.ossUploadFile(file, type, item, index);
          break;
        default:
          break;
      }
    },
    handleLimit(type, index) {
      let lg = 0;
      if (type == "pop_customer" || type == "rop_customer") {
        this.popOrRopList.forEach((it, idx) => {
          if (idx == index) {
            lg = it.customerSignFileList.length;
          }
        });
      } else if (type == "benefit_customer") {
        this.popOrRopList.forEach((it, idx) => {
          if (idx == index) {
            lg = it.xyzjSignFileList.length;
          }
        });
      } else if (type == "legal_approval") {
        this.popOrRopList.forEach((it, idx) => {
          if (idx == index) {
            lg = it.legalAffairsFileList.length;
          }
        });
      }
      return lg;
    },
    // oss上传文件
    async ossUploadFile(file, type, item, index) {
      const fileType = file.name.split(".")[1];
      if (fileType.toLowerCase() == "pdf" || fileType.toLowerCase() == "png") {
        await oss_client.getOSSClientInstance("pop_rop_file");
        const uploadFileRes = await oss_client.uploadFile(file.raw, file.raw.name, true);
        this.uploadCaseFile(type, uploadFileRes.name, file, item, index);
        this.dynamicFile(file, item);
      } else {
        this.$message({
          type: "warning",
          message: "请上传pdf或者png格式文件"
        });
        return;
      }
    },
    uploadCaseFile(type, fileUrl, file, item, index) {
      const params = {
        attachmentType: type == "pop_customer" || type == "rop_customer" ? 3 : type == "benefit_customer" ? 4 : 5,
        path: fileUrl,
        businessId: item.id
      };
      this.requestMethodPost("/common/business/attachment/uploadBusinessFiles", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.fileName = file.name;
          data.createTime = this.formatDate(new Date());
          if (type == "pop_customer" || type == "rop_customer") {
            this.popOrRopList.forEach((it, idx) => {
              if (idx == index) {
                it.customerSignFileList.push(data);
              }
            });
          } else if (type == "benefit_customer") {
            this.popOrRopList.forEach((it, idx) => {
              if (idx == index) {
                it.xyzjSignFileList.push(data);
              }
            });
          } else if (type == "legal_approval") {
            this.popOrRopList.forEach((it, idx) => {
              if (idx == index) {
                it.legalAffairsFileList.push(data);
              }
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    dynamicFile(file, item) {
      const params = {
        attachmentName: file.name,
        busId: item.id
      };
      this.requestMethodPost("/pes/pop/saveUploadFileMsg", params).then(res => {
        if (res.data.code == 1000) {
          this.getCustomerCaseDynamicList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 删除
    deleteFile(type, item, index, itemIndex) {
      this.$gio.deleteFileOfCustomerCase({
        caseType: this.caseType == "pop" ? "业绩证明：POP" : "业绩参考：ROP"
      });
      if (type == "pop_customer" || type == "rop_customer") {
        this.popOrRopList.forEach((it, idx) => {
          if (idx == index) {
            it.customerSignFileList.splice(itemIndex, 1);
          }
        });
      } else if (type == "benefit_customer") {
        this.popOrRopList.forEach((it, idx) => {
          if (idx == index) {
            it.xyzjSignFileList.splice(itemIndex, 1);
          }
        });
      } else {
        this.popOrRopList.forEach((it, idx) => {
          if (idx == index) {
            it.legalAffairsFileList.splice(itemIndex, 1);
          }
        });
      }
      this.deleteFileApi(item.id);
    },
    deleteFileApi(fileId) {
      this.requestMethodPost("/common/business/attachment/delete", { id: fileId }).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    async handleChange(value) {
      this.numTotal = value;
    },
    // 确认分享或者可见性设置
    confirmShare(type, item) {
      this.$gio.clickShareButton({
        caseType: this.caseType == "pop" ? "业绩证明：POP" : "业绩参考：ROP"
      });

      this.popOrRopItem = item;
      this.shareType = type;
      this.viewList = item.distributorCompanyType > 0 ? this.distributorViewList : this.mobilViewList;
      let list = [];
      if (type == "share") {
        list = this.viewList.map(it => {
          return it.value;
        });
      } else {
        list = item.dataVisibility ? item.dataVisibility.split(",") : [];
      }
      this.checkedView = list;
      this.checkAll = this.checkedView.length === this.viewList.length;
      this.isIndeterminate = this.checkAll ? false : true;
      this.canViewVisible = true;
    },
    // 撤销分享
    revokeShare(item) {
      this.$confirm("是否确认撤销分享?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestMethodGet("/pes/pop/cancelShare", { popRopId: item.id }).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                type: "success",
                message: "撤销分享成功!"
              });
              // 重新获取列表，刷新
              this.pagenation5.current = 1;
              this.getPopOrRopList();
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
    // 取消pop可见性弹框
    cancelCanView() {
      this.$gio.cancelOrSaveShare({
        operation: "取消分享",
        caseType: this.caseType == "pop" ? "业绩证明：POP" : "业绩参考：ROP"
      });
      this.canViewVisible = false;
    },
    // 确定
    saveCanView() {
      if (!this.checkedView.length) {
        this.$message({
          type: "warning",
          message: "至少选择一项可见性"
        });
        return;
      }

      let url = this.shareType == "share" ? "/pes/pop/confirmShare" : "/pes/pop/updateDataVisibility";
      const str = this.checkedView.join(",");
      this.requestMethodPost(url, { popRopId: this.popOrRopItem.id, dataVisibility: str }).then(res => {
        if (res.data.code == 1000) {
          this.$gio.cancelOrSaveShare({
            operation: "保存分享",
            caseType: this.caseType == "pop" ? "业绩证明：POP" : "业绩参考：ROP"
          });
          this.canViewVisible = false;
          this.$message({
            message: this.shareType == "share" ? "分享成功" : "设置成功",
            type: "success"
          });
          // 重新获取列表，刷新
          this.pagenation5.current = 1;
          this.getPopOrRopList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 全选
    handleCheckAllChange(val) {
      const list = this.viewList.map(it => {
        return it.value;
      });
      this.checkedView = val ? list : [];
      this.isIndeterminate = false;
    },
    // 选项改变
    handleCheckedCitiesChange(val) {
      this.checkAll = val.length === this.viewList.length;
      this.isIndeterminate = val.length > 0 && val.length < this.viewList.length;
    },
    // 添加报告
    addReport(val, status) {
      const customerId = this.companyId;
      if (this.activeType == "pop") {
        this.$router.push({
          query: {
            customerId: customerId,
            companyName: this.ruleForm.companyName,
            industry: this.ruleForm.companyIndustryName,
            companyNumber: this.ruleForm.companyNumber,
            reportId: val ? val : "",
            reportStatus: status == 0 || status == 3 || status == "add" ? "1" : "2"
          },
          path: "/CustomerProfile/CustomerProfileDetail/createPopReport"
        });
      } else {
        this.$router.push({
          query: {
            customerId: customerId,
            companyName: this.ruleForm.companyName,
            industry: this.ruleForm.companyIndustryName,
            companyNumber: this.ruleForm.companyNumber,
            reportId: val ? val : "",
            reportStatus: status == 0 || status == 3 || status == "add" ? "1" : "2"
          },
          path: "/CustomerProfile/CustomerProfileDetail/createRopReport"
        });
      }
      this.$gio.clickAddReportButton({
        caseType: this.activeType == "pop" ? "业绩证明：POP" : "业绩参考：ROP"
      });
    },
    // 编辑pop,rop
    editPopReport(item) {
      this.addReport(item.id, item.status);
    },
    // 预览pop，rop
    previewPopReport(item) {
      window.open(item.reportUrlForOpen, "_blank");
      this.$gio.previewReport();
    },
    // 删除pop，rop
    deletePopReport(item) {
      // 删除后重新查询列表
      this.requestMethodPost("/pes/pop/deletePopRop", { popRopId: item.id }).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.pagenation5.current = 1;
          this.getPopOrRopList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 下载pop，rop
    downloadPopReport(item) {
      window.open(item.reportUrlForDownLoad, "_blank");
      this.$gio.downloadReport({
        customer: this.ruleForm.companyName,
        reportType: this.activeType == "pop" ? "业绩证明：POP" : "业绩参考：ROP"
      });
    },
    // 制作效益报告
    makeReport() {
      this.$gio.clickCreateBenefitReportButton();
      this.$router.push({
        path: "/CustomerProfile/benefitReport",
        query: {
          companyName: this.ruleForm.companyName,
          customerId: this.companyId,
          customerCompanyNumber: this.$route.query.companyNumber,
          distributorCompanyType: this.userInfo.userType,
          distributorCompanyId: this.userInfo.orgInfo.companyId
        }
      });
    },
    // 获取效益报告列表
    getBenefitReportList() {
      this.loading = true;
      const params = {
        customerId: this.$route.query.companyId,
        distributorCompanyId: this.userInfo.orgInfo.companyId,
        distributorCompanyType: this.userInfo.userType,
        ...this.pagenation4
      };
      if (this.xyzjIdQuery) {
        params.xyzjId = this.xyzjIdQuery;
      }
      this.requestMethodGet("/pes/customer/list", params).then(res => {
        if (res.data.code == 1000) {
          this.totalBenefitNumber = res.data.data.totalCount;
          this.allReportList = res.data.data.list;
          if (this.xyzjIdQuery) {
            // 点击查看跳转过来，默认展开
            this.allReportList.forEach((item, index) => {
              if (item.createType == 2) this.$set(item, "hideMore", false);
            });
          } else {
            // 切换tab页，默认收起
            this.allReportList.forEach((item, index) => {
              if (item.createType == 2) this.$set(item, "hideMore", true);
            });
          }
          // this.checkNoSave();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
        this.loading = false;
      });
    },
    // 获取计划工程服务档案列表
    getPesReportList() {
      const params = {
        customerNumber: this.$route.query.companyNumber,
        ...this.pagenation6
      };
      this.requestMethodGet("/pes/report/xyzj/pesXyzjList", params).then(res => {
        if (res.data.code == 1000) {
          this.totalPesNumber = res.data.data.totalCount;
          this.pesReportList = res.data.data.list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    previewPesReport(item) {
      const params = {
        url: encodeURI(item.fileUrl)
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
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
    downloadPesReport(item) {
      const params = {
        url: item.fileUrl
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
    // 获取效益报告-动态
    getBenefitReportDynamic() {
      const params = {
        customerId: this.$route.query.companyId,
        distributorCompanyId: this.userInfo.orgInfo.companyId,
        distributorCompanyType: this.userInfo.userType
      };
      this.requestMethodGet("/pes/customer/trends/list", params).then(res => {
        if (res.data.code == 1000) {
          this.benefitReportDynamicList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    rejectReasonSubmit() {
      if (this.ruleFormReject.rejectReason == "") {
        this.$message({
          message: "请输入驳回原因",
          type: "warning"
        });
        return;
      }
      this.requestMethodPost("/pes/pop/processReport", { action: "reject", busId: this.busId, evaluate: this.ruleFormReject.rejectReason }).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "驳回成功",
            type: "success"
          });
          this.reasonFormVisible = false;
          this.getPopOrRopList();
          this.$gio.popRopOperationButton({
            operation: "驳回",
            caseType: this.selectItem.popRopFlag == "1" ? "业绩证明：POP" : "业绩参考：ROP"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    watchRecallReason(item) {
      this.selectItem = item;
      this.requestMethodGet("/pes/pop/getRejectById", { busId: item.id })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.reasonFormVisible = true;
            this.isWatchRecallReason = true;
            this.ruleFormReject.rejectReason = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 处理报告状态
    handleReportStatus(val, item) {
      if (val == "reject") {
        this.busId = item.id;
        this.ruleFormReject.rejectReason = "";
        this.isWatchRecallReason = false;
        this.reasonFormVisible = true;
        return;
      }
      if (val == "approve") {
        this.$confirm(`确认后您将无法修改，是否继续？`, {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.requestMethodPost("/pes/pop/processReport", { action: val, busId: item.id, evaluate: "" })
              .then(res => {
                res = res.data;
                if (res.code == 1000) {
                  this.$gio.popRopOperationButton({
                    operation: "确认",
                    caseType: item.popRopFlag == "1" ? "业绩证明：POP" : "业绩参考：ROP"
                  });
                  this.$message({
                    message: "确认成功",
                    type: "success"
                  });
                  this.getPopOrRopList();
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
        this.requestMethodPost("/pes/pop/processReport", { action: val == "publishAgain" ? "recall" : val, busId: item.id, evaluate: "" }).then(res => {
          if (res.data.code == 1000) {
            let msg = "";
            if (val == "recall") {
              msg = "撤回";
            }
            if (val == "publishAgain") {
              msg = "再次发布";
            }
            this.$message({
              message: msg + "成功",
              type: "success"
            });
            this.getPopOrRopList();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      }
    },
    // 编辑报告
    editBenefitReport(item) {
      this.$gio.clickEditButtonOfBenefitReport();
      this.$router.push({
        path: "/CustomerProfile/benefitReport",
        query: {
          benefitReportId: item.id,
          companyName: this.ruleForm.companyName,
          customerId: this.$route.query.companyId,
          customerCompanyNumber: this.$route.query.companyNumber,
          distributorCompanyType: this.userInfo.userType,
          distributorCompanyId: this.userInfo.orgInfo.companyId
        }
      });
    },
    // 预览报告
    previewBenefitReport(item) {
      window.open(item.fileUrlFull, "_blank ");
      this.$gio.previewBenefitReport();
    },
    async previewReportItem(item) {
      if (item.fileUrl.toLowerCase().includes(".pdf")) {
        // pdf文件预览
        window.open(await this.getFileUrl(item.fileUrl));
      } else {
        // 其他类型文件下载
        window.open(await this.getDownloadFile(item.fileUrl));
      }
    },
    async downloadReportItem(item) {
      window.open(await this.getDownloadFile(item.fileUrl));
    },
    // 删除报告
    deleteBenefitReport(item) {
      if (item.relPopName) {
        this.deleteDialogVisible = true;
      } else {
        this.$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deleteReport(item);
          })
          .catch(() => {});
      }
    },
    deleteReport(item) {
      this.requestMethodPost("/pes/customer/delete", { id: item.id }).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.pagenation4.current = 1;
          this.getBenefitReportList();
          this.getBenefitReportDynamic();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 下载报告
    downloadBenefitReport(item) {
      window.open(item.fileDownloadUrl);
      this.$gio.downloadBenefitReport({
        operation: "点击下载按钮"
      });
    },
    // 获取分配经销商可选车间列表
    getDistributorWorkshop() {
      const params = {
        customerId: this.EncryptUserId(this.$route.query.companyId)
      };
      this.requestMethodGet("/directAccount/workshopsOfCompany", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.distributorWorkshopList = res.data.data;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    // 分配经销商
    distributeDealer(type) {
      if (this.serviceDistributorList.length > 4) {
        this.$message({
          type: "warning",
          message: `每家直供客户最多只能被分配5个服务商`
        });
        return;
      }
      this.distributeDealerType = type;
      this.getDistributorList();
    },
    // 取消
    cancel() {
      this.distributeDealerDialog = false;
    },
    // 下一步
    nextStep(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.getDistributorList();
        } else {
          return false;
        }
      });
    },
    closeDistorbutor() {
      this.$refs.distorbutorTableRef.clearSelection();
      this.distributeDealerDialog = false;
      this.distributorDialog = false;
      this.distorbutorForm.companyName = "";
      this.distorbutorForm.current = 1;
      this.distorbutorForm.size = 10;
    },
    nameChange() {
      this.distorbutorForm.current = 1;
      this.distorbutorForm.size = 10;
      this.getDistributorList();
    },
    // 选择经销商
    handleSelectDistorbutor(val, row) {
      if (!val.length) {
        this.$refs.distorbutorTableRef.clearSelection();
        return;
      }
      let num = 5 - this.serviceDistributorList.length;
      if (val.length > num) {
        this.$message({
          type: "warning",
          message: `每家直供客户最多只能被分配${num}个服务商`
        });
        return;
      }
      this.selectServiceDistributor = val;
    },
    // 全选经销商
    selectAllDistorbutor(val) {
      let num = 5 - this.serviceDistributorList.length;
      if (val.length > num) {
        this.$message({
          type: "warning",
          message: `每家直供客户最多只能被分配${num}个服务商`
        });
      }
    },
    distorbutorSizeChange(val) {
      this.distorbutorForm.size = val;
      this.getDistributorList();
    },
    distorbutorCurrentChange(val) {
      this.distorbutorForm.current = val;
      this.getDistributorList();
    },
    // 获取经销商列表
    getDistributorList() {
      // 接口拿到数据展示弹框
      const params = this.distorbutorForm;
      params.areaName = this.ruleForm.areaDtoList
        .map(it => {
          return it.name;
        })
        .join(",");
      params.menuCode = "DealerProfile";
      params.spType = 1;
      params.serviceProvidersCompanyId = this.ruleForm.companyId;
      this.requestMethodPost("/web/company/filterSp", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.distorbutorTableData = res.data.data.list;
            this.distorbutorTotal = res.data.data.totalCount;
            this.distributorDialog = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 上一步
    upStep() {
      this.$refs.distorbutorTableRef.clearSelection();
      this.distributorDialog = false;
    },
    // 确定选择经销商
    confirmDistorbutor() {
      const checkedDistributor = this.$refs.distorbutorTableRef.selection;
      if (_.isEmpty(checkedDistributor)) {
        this.$message({
          type: "warning",
          message: "请选择经销商"
        });
        return;
      }
      let num = 5 - this.serviceDistributorList.length;
      if (checkedDistributor.length > num) {
        this.$message({
          type: "warning",
          message: `每家直供客户最多只能被分配${num}个服务商`
        });
        return;
      }
      let distributorList = checkedDistributor.map(it => it.id);
      const params = {
        customerId: this.$route.query.companyId,
        distributorIdList: distributorList,
        workshopIdList: this.distributorForm.workshopIdList
      };
      this.requestMethodPost("/directAccount/relation/add", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "分配成功"
          });
          this.closeDistorbutor();
          this.getServiceDistributorList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    cancelRelation() {
      this.cancelRelationDialog = false;
    },
    // 获取服务商列表
    getServiceDistributorList() {
      const params = {
        customerId: this.EncryptUserId(this.$route.query.companyId)
      };
      this.requestMethodGet("/directAccount/serviceProviders", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.serviceDistributorList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑服务商
    editDistributor(row) {
      this.distributeDealerType = "edit";
      this.editDistributorObj = row;
      this.distributorForm.workshopIdList = row.workshopList.map(it => it.id);
      this.getDistributorWorkshop();
      this.distributeDealerDialog = true;
    },
    // 编辑确定
    consfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            customerId: this.$route.query.companyId,
            distributorId: this.editDistributorObj.serviceProviderId,
            workshopIdList: this.distributorForm.workshopIdList
          };
          this.requestMethodPost("/directAccount/relation/update", params).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.distributeDealerDialog = false;
              this.getServiceDistributorList();
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
    // 取消关联
    cancelRelationClick(row) {
      this.cancelRelationDialog = true;
      this.cancelRelationObj = row;
    },
    // 解除关联
    dissRelation() {
      this.cancelRelationDialog = false;
      const params = {
        customerId: this.$route.query.companyId,
        distributorId: this.cancelRelationObj.serviceProviderId
      };
      this.requestMethodPost("/directAccount/relation/release", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: "解除关联成功"
            });
            this.getServiceDistributorList();
          } else {
            this.cancelRelationDialog = true;
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.cancelRelationDialog = true;
        });
    },
    // 选中左侧树节点查询右侧详情
    checkedNode(node) {
      if (!_.isEqual(node, this.nodeObj)) {
        this.loadingDetail = true;
        this.nodeObj = node;
      }
    },
    userTotal(val) {
      this.userTotalNum = val;
    },
    loadingEnd() {
      this.loadingDetail = false;
    },
    // 创建部门，岗位成功刷新左侧树
    refreshTree() {
      this.$refs.leftTree.getDeptTreeData();
      this.$refs.leftTree.findDefaultExpand();
    },
    getPesWorkShopList() {
      this.loadingWorkShop = true;
      const params = {
        companyId: this.$route.query.companyId,
        current: 1,
        size: 500,
        noWorkShopFlag: false
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params)
        .then(res => {
          this.loadingWorkShop = false;
          if (res.data.code == 1000) {
            this.pesWorkshopList = res.data.data.list;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.loadingWorkShop = false;
        });
    },
    $_getWorkshopList(arg, tableSearch = false) {
      const params = {
        companyId: this.companyId,
        ...this.pagenation,
        noWorkShopFlag: false
      };
      if (!tableSearch) {
        params.current = this.workshopCurrent;
      }
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.$nextTick(() => {
              const data = res.data.data.list;
              this.workshopList = data;
              this.workshopTotal = res.data.data.totalCount;
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {});
    },
    handleCurrentChange(current) {
      this.workshopList = [];
      this.pagenation.current = current;
      this.$_getWorkshopList(this.$route.query.companyNumber, true);
    },
    handleSizeChange(size) {
      this.workshopList = [];
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getWorkshopList(this.$route.query.companyNumber);
    },
    handleCurrentChange2(current) {
      this.pagenation2.current = current;
      this.$_getEquipmentList(); // 获取设备列表
    },
    handleSizeChange2(size) {
      this.pagenation2.size = size;
      this.pagenation2.current = 1;
      this.$_getEquipmentList(); // 获取设备列表
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
                  this.$message({
                    message: "人员不存在",
                    type: "warning"
                  });
                } else {
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
    // 查看联系人详情
    executePersonDetail(scope) {
      this.contactDetail = {};
      if (scope.row.contactNumber) {
        this.getUserDetail(scope.row.contactNumber, scope.$index, "contact");
      }
    },
    // 查看执行人详情
    contactPersonDetail(scope) {
      this.executeDetail = {};
      if (scope.row.executePersonNumber) {
        this.getUserDetail(scope.row.executePersonNumber, scope.$index, "execute");
      }
    },
    // 设置取消SP
    setSpById() {
      let params = {
        customerId: this.ruleForm.companyId
      };
      this.spLoading = true;
      this.requestMethodPost("/device/lubes/setSpById", params, true)
        .then(res => {
          if (res.data.code == 1000) {
            this.$message({
              message: this.ruleForm.spFlag == 1 ? "取消SP成功" : "设为SP成功",
              type: "success"
            });
            this.$_queryDealerInfo(this.ruleForm.companyNumber);
          } else {
            this.spLoading = false;
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 设置为 pes
    setPes(formName) {
      // 如果是初次设为 PES
      if (this.ruleForm.pesFlag == "0") {
        this.getYear();
        this.firstSetPesVisiable = true;
        this.$refs[formName].resetFields();
      } else {
        // 非初次设为PES
        this.setPesVisiable = true;
      }
    },
    // 初次设为 pes  --- 取消
    cancelFirstPes() {
      this.firstSetPesVisiable = false;
      this.setPesForm.year = "";
      this.setPesForm.workshopId = [];
    },
    // 初次设为 pes  --- 确定
    confirmFirstPes(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = {
            companyNumber: this.ruleForm.companyNumber,
            year: this.setPesForm.year,
            workshopDtoList: this.setPesForm.workshopSelect,
            pesFlag: 1
          };
          this.requestMethodPost("/web/customer/updateCompanyPesFlag", param).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                message: "成功启用计划工程服务",
                type: "success"
              });
              this.firstSetPesVisiable = false;
              this.$_queryDealerInfo(this.ruleForm.companyNumber);
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 跳转设备详情
    handleJumpEquipmentDetail(row) {
      this.$router.push({
        path: "/EquipmentProfile/EquipmentProfileDetail",
        query: {
          deviceId: row.deviceId,
          deviceNumber: row.deviceNumber
        }
      });
      this.$gio.viewCustomerDevice({
        entrance: "客户详情页-设备tab"
      });
    },
    handleJumpWorkOrderDetail(row) {
      if (row.serviceType == 1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
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
    },
    // 非初次设为 pes  --- 取消
    cancelsetPes() {
      this.setPesVisiable = false;
    },
    // 非初次设为 pes  --- 确定
    confirmsetPes() {
      let param = {
        companyNumber: this.ruleForm.companyNumber,
        pesFlag: 1
      };
      this.requestMethodPost("/web/customer/updateCompanyPesFlag", param).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "成功启用计划工程服务",
            type: "success"
          });
          this.setPesVisiable = false;
          this.$_queryDealerInfo(this.ruleForm.companyNumber);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 取消PES
    cancelPes() {
      const params = {
        companyNumber: this.ruleForm.companyNumber
      };
      this.requestMethodGet("/pes/package/queryNoFinishPackage", params).then(res => {
        if (res.data.code == 1000) {
          this.isEnd = res.data.data;
          this.cancelPesVisiable = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 取消 pes
    cancelPesClose() {
      this.cancelPesVisiable = false;
    },
    // 取消pes 确定
    confirmCancelPes() {
      let param = {
        companyNumber: this.ruleForm.companyNumber,
        pesFlag: -1
      };
      this.requestMethodPost("/web/customer/updateCompanyPesFlag", param).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "成功完成计划工程服务",
            type: "success"
          });
          this.cancelPesVisiable = false;
          this.$_queryDealerInfo(this.ruleForm.companyNumber);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 跳转pes档案
    handlePESindex() {
      this.$gio.toPESArchivePage();
      this.$router.push({
        path: "/CustomerProfile/CustomerPesIndex",
        query: {
          companyNumber: this.ruleForm.companyNumber,
          companyId: this.ruleForm.companyId,
          customerCompanyType: this.ruleForm.customerCompanyType,
          isDaFlag: this.ruleForm.daFlag
        }
      });
    },
    // 获取设为pes选择的年份列表
    getYear() {
      const params = {
        companyNumber: this.ruleForm.companyNumber
      };
      this.requestMethodGet("/pes/queryYearsForAddPes", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data || [];
          if (list.length > 0) {
            list.forEach(item => {
              item.label = item.year;
              item.value = item.year;
            });
          }
          this.yearListData = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 管理关联账号
    manageAccount() {
      this.MSLAInfoDialog = true;
    },
    // 配置业务线
    setBusinessLine() {
      this.businessLineDialog = true;
    },
    // 启用或者停用
    useOrStop() {
      const params = {
        companyNumber: this.$route.query.companyNumber,
        status: this.ruleForm.status == "0" ? "1" : "0"
      };
      this.requestMethodGet("/web/company/modifyCompanyStatus", params).then(res => {
        if (res.data.code == 1000) {
          const str = this.ruleForm.status == "0" ? "启用成功" : "停用成功";
          this.$message({
            message: str,
            type: "success"
          });
          this.$_queryDealerInfo(this.$route.query.companyNumber);
          this.$gio.startOrStopUseCustomer({
            operation: this.ruleForm.status == "0" ? "启用" : "停用",
            customer: this.ruleForm.companyName
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 跳转经销商详情
    toDealerDetail(num) {
      if (num) {
        this.$router.push({
          path: "/DealerProfile/DealerProfileDetail",
          query: {
            companyNumber: num,
            scaleList: JSON.stringify(this.scaleList),
            workorderPage: true
          }
        });
      }
    },
    // 编辑
    edit() {
      this.$router.push({
        path: "/CustomerProfile/EditCustomerProfile",
        query: {
          companyId: this.$route.query.companyId,
          companyNumber: this.$route.query.companyNumber,
          customerCompanyNumber: this.ruleForm.customerCompanyNumber,
          scaleList: JSON.stringify(this.scaleList)
        }
      });
    },
    // 解绑
    unbound() {
      this.$confirm("小程序用户使用商品模块的必要条件之一，若为空，公司成员商品模块不开放", "提示信息", {
        confirmButtonText: "确认解绑",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        closeOnClickModal: false,
        type: "warning"
      })
        .then(() => {
          let params = {
            id: this.accountInfo.id,
            companyNumber: this.$route.query.companyNumber
          };
          this.requestMethodPost("/msla/account/unBindingAccount", params)
            .then(res => {
              if (res.data.code == 1000) {
                this.$message({
                  message: "解绑成功",
                  type: "success"
                });
                this.getBindingAccountId();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        })
        .catch(() => {});
    },
    // 更新
    updateMsla() {
      this.accountInfoForm.legacyId = this.accountInfo.legacyId;
      this.releaseMSLAAccountDialog = true;
    },
    // 立即关联
    handReales() {
      this.accountInfoForm.legacyId = "";
      this.releaseMSLAAccountDialog = true;
    },
    cancelMslaBind() {
      this.releaseMSLAAccountDialog = false;
    },
    // 确定
    confirmReleaseMSLAAccount() {
      if (!this.accountInfoForm.legacyId) {
        this.$message({
          message: "请先输入MSLA  Account",
          type: "warning"
        });
        return;
      }
      let params = {
        legacyId: this.accountInfoForm.legacyId,
        companyNumber: this.$route.query.companyNumber
      };
      let url = "/msla/account/bindingAccount";
      this.requestMethodPost(url, params)
        .then(res => {
          if (res.data.code == 1000) {
            this.$message({
              message: "MSLA账号关联成功",
              type: "success"
            });
            this.getBindingAccountId();
            this.releaseMSLAAccountDialog = false;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    $_getScaleList() {
      this.getDicDataList("cust_scale").then(res => {
        this.scaleList = res;
      });
    },
    // 查询工业客户信息
    $_queryDealerInfo(companyNumber) {
      let params = {
        companyNumber
      };
      this.requestMethodGet("/web/customer/queryCompanyByCompanyNumber", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data;
            this.companyId = data.companyId;
            this.defaultExpandedList = [this.companyId];
            this.ruleForm = data;
            this.imgUrl = data.logo;
            this.showButtonFlag = data.buttonFlag;
            let arr = [];
            if (data.areaDtoList.length) {
              data.areaDtoList.forEach(it => {
                arr.push(it.name);
              });
            }
            this.distorbutorForm.areaName = arr.join(",");
            this.spLoading = false;
            this.$_getWorkshopList();
            this.getServiceApplyList();
            this.getChargeList();
            this.showDeviceLum = true;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 编辑
    handleEdit() {
      this.$gio.clickEditButtonOfCustomerCase({
        caseType: this.activeType == "pop" ? "业绩证明：POP" : "业绩参考：ROP"
      });
      this.$router.push({
        path: "/CustomerProfile/EditCustomerProfile",
        query: {
          companyNumber: this.ruleForm.companyNumber,
          scaleList: JSON.stringify(this.scaleList)
        }
      });
    },
    // 返回
    handleBack(formName) {
      if (this.$route.query.workorderPage || this.$route.query.isSaveDealer) {
        history.back();
      } else {
        this.$router.push({
          name: "CustomerProfile",
          params: { isSaveQuery: true }
        });
      }
    },
    $_getEquipmentList() {
      const params = {
        companyNumber: this.$route.query.companyNumber,
        menuCode: "EquipmentProfil",
        ...this.pagenation2
      };
      this.requestMethodPostTip("/web/device/deviceListOfAccount", params).then(res => {
        if (res.data.code == 1000) {
          this.equipmentList = res.data.data.list;
          this.equipmentTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },

    // 查看人员详情
    hadleLookDetail(row) {
      this.$router.push({
        path: "/PersonnelList/personnelDetail",
        query: {
          userNumber: row.userNumber,
          isSaveWoNumber: true
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
    // 查看
    handleLook(row) {
      this.$router.push({
        path: "/ServiceApplyList/ServiceApplyDetail",
        query: {
          id: row.id
        }
      });
      this.$gio.viewCustomerApplication({
        applicationNumber: row.serviceApplyNo
      });
    },
    serviceApplySizeChange(val) {
      this.serviceApplyPage.current = 1;
      this.serviceApplyPage.size = val;
      this.getServiceApplyList();
    },
    serviceApplyCurrentChange(val) {
      this.serviceApplyPage.current = val;
      this.getServiceApplyList();
    },
    getServiceApplyList() {
      let params = { ...this.serviceApplyPage };
      params.customerId = this.$route.query.companyId;
      if (this.userInfo.userType == 2) {
        params.customerId = this.userInfo.orgInfo.companyId;
      } else {
        params.distributorId = this.userInfo.orgInfo.companyId;
      }
      params.serviceApplyStatus = "";
      // 数据标识：0：全部 1：与我相关
      params.dataFlag = 0;
      params.menuCode = "ServiceApply";
      this.requestMethodGet("/serviceApply/serviceApplyOrderListByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.serviceApplyTableData = res.data.list;
            this.serviceApplyTotalNumber = res.data.totalCount;
            this.serviceApplyPage.current = res.data.pageIndex;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
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
    viewListAllPerson(row) {
      this.chargeTableData.forEach(it => {
        if (row.userId == it.userId) {
          it.isShowListAllPhone = !it.isShowListAllPhone;
        }
      });
    },
    viewListAllMember(row) {
      this.companyMemberList.forEach(it => {
        if (row.userId == it.userId) {
          it.isShowListAllPhone = !it.isShowListAllPhone;
        }
      });
    },
    // 手机号脱敏
    tmPhone(phone) {
      if (null != phone && phone != undefined) {
        var pat = /(\d{3})\d*(\d{4})/;
        return phone.replace(pat, "$1****$2");
      } else {
        return "";
      }
    },
    // 获取分管人数据 chargeTableData
    getChargeList() {
      let params = {
        customerId: this.userInfo.orgInfo.companyId,
        companyId: this.$route.query.companyId,
        ...this.chargePage
      };
      if (this.userInfo.userType == 0) {
        if (this.ruleForm.customerCompanyNumber != this.userInfo.orgInfo.companyNumber) {
          params.customerType = 2;
        }
      }
      this.requestMethodGet("/weChat/chargeUser/queryChargeUserByCompanyList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data.list;
            if (data.length) {
              data.forEach(it => {
                it.isShowListAllPhone = false;
                it.tempPhone = this.tmPhone(it.telephone);
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
    }
  },
  computed: {},
  destroyed() {
    window.removeEventListener("beforeunload", e => this.beforeunloadHandler(e));
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/customTable.less";

.notice {
  font-size: 12px;
  line-height: 12px;
  color: #999;
  margin-top: 4px;
  margin-left: 68px;
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
.phone-div {
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
.core-content {
  font-size: 14px;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}
.core-content .core-title {
  color: #000;
  font-weight: bold;
  margin-bottom: 16px;
}
.core-item {
  flex: 1;
  margin-bottom: 16px;
}
.margin-b2 {
  margin-bottom: 14px;
}
// pop/rop
.report-content {
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  margin-bottom: 20px;
}
.report-header {
  height: 36px;
  padding: 12px 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 400;
}
.head-title {
  color: #999;
}
.head-val {
  margin-left: 8px;
}
.file-list {
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 10px;
}
.file-title-op {
  font-size: 12px;
  font-weight: 400;
  color: #999;
}

/deep/ .company-info-content .el-form-item {
  margin-bottom: 0;
}

/deep/.el-checkbox {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.right-content {
  display: flex;
  align-items: center;
  font-size: 14px;
  height: 50px;
}
.line {
  width: 4px;
  height: 14px;
  background-color: #dd0000;
}
.right-title {
  line-height: 50px;
  color: #000;
  margin-left: 10px;
  font-weight: bold;
}
.list-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}
.list-content-pop {
  // display:flex;
  // align-items:center;
  // justify-content: space-between;
  font-size: 14px;
  border-bottom: 1px solid #e9e9e9;
  // padding: 16px;
  margin-bottom: 16px;
}
.list-content-pop:last-child {
  border-bottom: none;
}
.recall {
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  width: 48px;
  padding: 4px 6px;
  background-color: rgba(221, 0, 0, 0.6);
  border-radius: 4px;
  color: #dd0000;
}
.approve {
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  width: 48px;
  padding: 4px 6px;
  background-color: rgba(255, 153, 0, 0.2);
  border-radius: 4px;
  color: #ff9900;
}
.on-confirm {
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  width: 48px;
  padding: 4px 6px;
  background-color: rgba(164, 231, 231, 0.5);
  border-radius: 4px;
  color: #008888;
}
.unrelease {
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  width: 48px;
  padding: 4px 6px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  color: #fff;
}
.release {
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  width: 48px;
  padding: 4px 6px;
  background-color: rgb(204, 221, 255);
  border-radius: 4px;
  color: #666;
}
.create-report-status {
  display: flex;
  align-content: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  width: 80px;
  padding: 4px 6px;
  background-color: #fef0f0;
  border-radius: 4px;
  color: #dd0000;
}
// 报告生成中
.report-creating {
  font-weight: 400;
  font-family: Microsoft-Ya-Hei;
  font-size: 12px;
  color: #dd0000;
  background-color: #fef0f0;
  padding: 0 6px;
  height: 24px;
  display: inline-block;
  line-height: 24px;
  border-radius: 4px;
}
.red-label {
  color: #dd0000;
}
.report-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
  margin-left: 10px;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content-line {
  height: 14px;
  width: 1px;
  background-color: #e9e9e9;
  margin: 0 10px;
}
.makeReport-link el-link {
  color: #001450;
  font-size: 13px;
  line-height: 13px;
}
.team {
  min-height: 260px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  display: flex;
}
.left-tree-content {
  width: 300px;
  padding: 20px 0;
  padding-left: 20px;
  border-right: 1px solid #ccc;
}
.right-detail-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
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
// 公司信息
.company-info-content {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 10px 20px;
  margin-top: 15px;
  box-sizing: border-box;
}
.company-info-content-achives {
  border-radius: 6px;
  padding: 10px 20px;
  margin-top: 15px;
  display: flex !important;
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

.customer-profile-detail {
  padding: 20px;
  padding-top: 0;
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
  /deep/ .el-tabs__item {
    font-weight: bold;
    color: #999;
  }
}
</style>
<style>
.customer-profile-detail .el-upload {
  /* border-radius: 6px; */
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.customer-profile-detail .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.customer-profile-detail .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.customer-profile-detail .avatar {
  width: 128px;
  height: 128px;
  display: block;
}
.customer-profile-detail .el-form-item__label {
  color: #999999;
  padding: 0;
}
.customer-profile-detail .el-tabs__nav-wrap::after {
  background: none;
}
.customer-profile-detail .el-tabs__item.is-active {
  color: red;
}
.customer-profile-detail .el-tabs__active-bar {
  background: red;
}
.customer-profile-detail .el-form-item__label {
  color: #999999;
}
.footer {
  padding: 20px 0;
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
  top: 15px !important;
}
.company-title-info {
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
}
.company-info {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.auth-manage-change-distributor-dialog {
  margin-top: -10%;
  width: 28%;
}
</style>
