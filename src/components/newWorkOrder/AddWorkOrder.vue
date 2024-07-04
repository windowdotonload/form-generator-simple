<template>
  <div style="position: relative; width: 100%">
    <div class="add-customer-profile" :style="mainminheight">
      <el-form :model="applylist" :rules="rules" ref="applylist" label-width="100px" label-position="top" class="add-dealer-profile-applylist">
        <div class="add-customer-profile-header" style="background: #ebf1ff; border: 1px solid #ccddff">
          <span style="margin-left: 20px"
            >当前服务：<span style="color: #dd0000">{{ typeName }}</span></span
          >
        </div>
        <!-- 服务信息 -->
        <div class="add-customer-profile-wrap">
          <div class="add-customer-profile-header">
            <div style="border-left: 4px solid #dd0000; padding-left: 10px; margin-left: 20px">服务信息</div>
          </div>
          <div style="padding: 10px 80px 30px">
            <el-row :gutter="24" style="margin-top: 10px">
              <!-- 更新去掉预约日期、服务地址 -->
              <el-col :span="12">
                <el-form-item label="客户名称" prop="companyNumber">
                  <el-select
                    size="small"
                    clearable
                    :disabled="pesDisabled || serviceApplyOrderId != '' || userInfo.userType == 2"
                    filterable
                    remote
                    :remote-method="requestMethodCustomer"
                    v-model="applylist.companyNumber"
                    @change="handleChangeCustomer"
                    placeholder="--请选择--"
                    style="width: 100%"
                  >
                    <el-option v-for="item in customerList" :key="item.companyNumber" :label="item.companyName" :value="item.companyNumber"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经销商" prop="spId" v-show="SPList.length > 1">
                  <div class="selectFollow">
                    <el-select
                      size="small"
                      popper-class="myCascader"
                      :popper-append-to-body="false"
                      clearable
                      filterable
                      v-model="applylist.spId"
                      placeholder="请选择"
                      style="width: 100%"
                      :disabled="pesDisabled"
                    >
                      <el-option v-for="item in SPList" :key="item.spId" :label="item.spName" :value="item.spId" />
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="userInfo.userType != '2' && (distributiveBtn || executeBtn)">
                <el-form-item label="执行人" prop="executePersonName">
                  <el-input
                    placeholder="--请选择--"
                    suffix-icon="el-icon-arrow-down"
                    style="width: 100%"
                    size="small"
                    readonly
                    :disabled="!distributiveBtn || pesDisabled || serviceApplyOrderId != ''"
                    @click.native="handleDistributive('first')"
                    v-model="applylist.executePersonName"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 更新---转移并修改服务创盈组件到申请单新建编辑 -->
        <!-- 备注 -->
        <div class="add-customer-profile-wrap" style="padding-bottom: 40px">
          <div class="add-customer-profile-header">
            <div style="border-left: 4px solid #dd0000; padding-left: 10px; margin-left: 20px">备注</div>
          </div>
          <div style="padding: 0 80px 0px">
            <el-row :gutter="24" style="margin-top: 10px">
              <el-col :span="24">
                <el-form-item label="简介" prop="shortDesc">
                  <el-input type="textarea" :rows="1" class="font-family" resize="none" placeholder="请输入内容" style="width: 100%" maxlength="25" v-model="applylist.shortDesc"> </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24" v-if="addServiceType == '9'">
              <el-col :span="24">
                <p class="add-customer-profile-title">上传图片</p>
                <el-upload
                  :class="{ hide: hideUpload || imageList.length >= 3 }"
                  :action="uploadUrl"
                  list-type="picture-card"
                  limit="3"
                  :file-list="imageList"
                  accept="image/*"
                  :auto-upload="false"
                  :on-change="handleAddFile"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <div class="add-customer-profile-title" style="margin-top: 8px">最多上传3张，10M以内 .jpg .png .gif .svg 格式的图片</div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="add-customer-profile-wrap" v-if="addServiceType == '2'">
          <div class="add-customer-profile-header" style="">
            <div style="border-left: 4px solid #dd0000; padding-left: 10px; margin-left: 20px">调查任务 <span>(必填)</span></div>
          </div>
          <!-- 调查任务信息 -->
          <div v-if="lumData != undefined" style="width: 100%; background: #fff; padding-bottom: 60px; position: relative">
            <div style="width: calc(100% - 40px); padding: 24px 20px 0">
              <div>
                <el-button type="danger" plain @click="addLubricationPoints" size="small">管理调查任务</el-button>
                <span v-if="isLumData" style="font-size: 14px; color: #dd0000; margin-left: 10px">请添加润滑点</span>
              </div>
              <div v-if="lumData.length == 0" style="font-family: MicrosoftYaHei; height: 146px; line-height: 146px; font-size: 13px; color: #999; text-align: center">暂无润滑点调查任务</div>
              <div v-if="lumData.length">
                <el-table :data="lumData" v-loading="loading" tooltip-effect="dark" style="width: calc(100% - 40px)">
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
                  <el-table-column prop="deviceName" min-width="10%" label="设备名称"> </el-table-column>
                  <el-table-column prop="oilName" min-width="10%" label="润滑油"> </el-table-column>
                  <el-table-column prop="lastOilChangeTime" min-width="15%" label="上次任务日期"> </el-table-column>
                  <el-table-column min-width="6%" label="操作">
                    <template slot-scope="scope">
                      <el-link @click="removeLupItem(scope.row)" style="margin-right: 10px; color: #dd0000">移除</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
        <!-- 添加润滑点 -->
        <div class="add-customer-profile-wrap" v-if="addServiceType == '9' || addServiceType == 10">
          <div class="add-customer-profile-header" style="">
            <div style="border-left: 4px solid #dd0000; padding-left: 10px; margin-left: 20px">
              润滑点
              <span v-if="(reportType == '0' && coreTemplateId == '0') || addServiceType == 10 ? false : paramDataLubFlag || coreDataLubFlag">(必填)</span>
            </div>
          </div>
          <!-- 润滑点信息 -->
          <div v-if="lumData != undefined" style="width: 100%; background: #fff; padding-bottom: 60px; position: relative">
            <div style="width: calc(100% - 40px); padding: 24px 20px 0">
              <div>
                <el-button type="danger" :disabled="reportType == '0' && coreTemplateId == '0' ? false : !(paramDataLubFlag || coreDataLubFlag || woFormType)" plain @click="addLubricationPoints" size="small">
                  管理润滑点
                </el-button>
                <span v-if="isLumData" style="color: #dd0000; margin-left: 10px">请添加润滑点</span>
              </div>
              <div v-if="lumData.length == 0" style="font-family: MicrosoftYaHei; height: 146px; line-height: 146px; font-size: 13px; color: #999; text-align: center">暂无关联设备&润滑点</div>
              <div v-if="lumData.length">
                <el-table :data="lumData" v-loading="loading" tooltip-effect="dark" style="width: calc(100% - 40px)">
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
                  <el-table-column prop="deviceName" min-width="10%" label="设备名称"> </el-table-column>
                  <el-table-column prop="oilName" min-width="10%" label="润滑油"> </el-table-column>
                  <el-table-column prop="lastOilChangeTime" min-width="15%" label="上次任务日期"> </el-table-column>
                  <el-table-column min-width="6%" label="操作">
                    <template slot-scope="scope">
                      <el-link @click="removeLupItem(scope.row)" style="margin-right: 10px; color: #dd0000">移除</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>
        <!-- 标准作业流程 -->
        <div class="add-customer-profile-wrap" v-if="userInfo.userType != '2' && submitSopUrl">
          <div class="add-customer-profile-header" style="">
            <div class="sop-name">标准作业流程</div>
          </div>
          <div class="file-wrap" style="margin: 20px">
            <div class="file-box">
              <img src="../../assets/pdf.png" alt="" class="pdf-icon" />
              <div @click="previewAttachment('sop', 'preview')" class="file-name">{{ sopName }}</div>
            </div>
            <div @click="previewAttachment('sop', 'preview')" class="preview">查看</div>
          </div>
        </div>

        <!-- 工作安全分析 -->
        <div v-if="userInfo.userType != '2' && submitJsaUrl" class="add-customer-profile-wrap">
          <div class="add-customer-profile-header">
            <div class="sop-name">工作安全分析</div>
          </div>
          <div class="file-wrap" style="margin: 20px">
            <div class="file-box">
              <img src="../../assets/pdf.png" alt="" class="pdf-icon" />
              <div @click="previewAttachment('jsa', 'preview')" class="file-name">{{ jsaName }}</div>
            </div>
            <div @click="previewAttachment('jsa', 'preview')" class="preview">查看</div>
          </div>
        </div>
      </el-form>
      <div v-if="userInfo.userType != '2' || (userInfo.distributorCompanyType == 1 && userInfo.userType == '2')" style="display: flex; align-items: center; margin-top: 10px; height: 40px">
        <el-checkbox v-model="checked" style="margin-right: 10px"></el-checkbox>
        <div><span style="color: #fe000c">*</span>我已同意条款，<span @click="seenNotice" style="color: #fe000c; text-decoration: underline; cursor: pointer">查看条款明细</span></div>
      </div>
      <div slot="footer" style="width: 130px; margin: 20px auto 0">
        <el-button size="small" @click="handleResetFrom('applylist')">取消</el-button>
        <el-button type="danger" @click="handleSubmitForm('applylist')" size="small">提交</el-button>
      </div>
    </div>
    <el-dialog title="选择执行人" ref="executePersonDialog" :visible.sync="executePersonNameVisiable" width="45%" class="create-task radio-table" v-if="initTemplateContent">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px">
        <div style="font-family: MicrosoftYaHei-Bold; font-size: 16px; line-height: 14px; color: #000; display: flex; flex-wrap: nowrap; align-items: center">
          <span style="width: 8px; height: 8px; display: inline-block; border-radius: 50%; background: #dd0000; margin-right: 12px"></span>
          <div v-html="initTemplateContent(selectedCompany)" style="display: flex" @click="(e) => clickRoleType(e)"></div>
        </div>
        <el-input size="small" v-model="userOrRoleName" placeholder="请输入关键词" suffix-icon="el-icon-search" style="width: 30%" maxlength="50" @change="handleDistributive" clearable></el-input>
      </div>
      <div v-if="executePersonNameVisiable">
        <el-table
          ref="multipleTableAdd"
          :data="engineerInfoList"
          v-el-table-infinite-scroll="loadMore"
          tooltip-effect="dark"
          height="400px"
          v-loading="loadMoreZhixingren"
          @current-change="handleDistributionnChange"
        >
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio v-model="applylist.executePersonNumber" :label="scope.row.userNumber"><i></i></el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="userName" min-width="20%" label="姓名"> </el-table-column>
          <el-table-column prop="roleName" min-width="18%" label="角色">
            <template width="90" slot-scope="scope">
              <div v-for="(item, index) in scope.row.roleDtoList" :key="index">{{ item.roleName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="numCount" min-width="10%" label="工单数量"> </el-table-column>
          <el-table-column prop="count" min-width="10%" label="进行中工单"> </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button type="danger" plain @click="handleReset()" size="small">取消</el-button>
        <el-button type="danger" @click="submitDistribution()" size="small">分配</el-button>
      </div>
    </el-dialog>
    <!-- 添加润滑点弹框 -->
    <el-dialog title="管理润滑点" :visible.sync="addLubricationPointsVisiable" :append-to-body="true" width="60%" class="create-task">
      <div style="display: flex; align-items: center; margin-bottom: 10px; margin-top: 10px">
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
          :options="groupList"
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
          ref="tableAddLum"
          v-loading="loadingLum"
          v-el-table-infinite-scroll="load"
          :row-key="rowKey"
          @select="handleSelectLum"
          @select-all="selectAll"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
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
          <el-table-column prop="deviceName" min-width="18%" label="设备名称"> {{}}</el-table-column>
          <el-table-column prop="oilName" min-width="10%" label="润滑油">
            <template slot-scope="scope"> {{ scope.row.oilName || "暂无" }} {{ scope.row.lubricationPointPicPathFull }} </template>
          </el-table-column>
          <el-table-column prop="lastOilChangeTime" min-width="15%" label="上次任务日期">
            <template slot-scope="scope">
              {{ scope.row.lastOilChangeTime || "暂无" }}
            </template>
          </el-table-column>
          <p v-if="loadMoreBon">加载中...</p>
          <p v-if="!loadMoreBon">没有更多了</p>
        </el-table>
      </div>
      <div slot="footer">
        <el-button type="danger" plain @click="handleResetAddLum()" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitAddLum()" size="small">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="免责条款" :visible.sync="dialogVisibleHint" width="30%" class="create-task" :before-close="handleClose">
      <div v-html="serviceClause">{{ serviceClause }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddWorkorder">我已知晓</el-button>
      </span>
    </el-dialog>
    <!-- 选择润滑点 -->
    <lupDialogNew
      :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
      :singleFlag="false"
      :checkedDevice="checkedDevice"
      :urlType="urlType"
      :taskType="taskType"
      :companyId="deviceCompanyId"
      :coreDataTemplateId="coreTemplateId"
      :companyName="workorderSelectCompanyName"
      :companyNumber="applylist.companyNumber"
      :workshopId="applylist.workshopId"
      :plantStudyServiceFlag="plantStudyServiceFlag"
      :reportType="reportType"
      :serviceNumber="serviceNumber"
      :spId="applylist.spId"
      :filterDeviceNew="true"
      @changeSelDevice="getDevice"
      v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
      v-on:confirmChooseLup="confirmChooseLup"
    >
    </lupDialogNew>
    <el-dialog title="服务条款" :visible.sync="dialogCheckedVisible" width="30%" :before-close="handleClose">
      <span>我已阅读并同意条款</span><span @click="seenNotice" style="color: #fe000c; text-decoration: underline; cursor: pointer">查看条款明细</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckedVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmChecked">同 意</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import lupDialogNew from "../spotInspection/components/chooseLubricationPointWorkorder.vue";
import Promote from "./mixins/addWorkorder.js";
import PromoteGeneral from "./mixins/generalWorkorder.js";
import DAModify from "../newWorkOrder/mixins/DAModify";
export default {
  mixins: [DAModify, Promote, PromoteGeneral],
  components: { lupDialogNew },
  data() {
    return {
      workorderSelectCompanyName: "",
      dialogCheckedVisible: false, // 是否同意勾选免责条款
      defaultIcon: require("../../assets/device_default.png"),
      serviceIncomeComponentType: "",
      serviceId: "",
      sopName: "",
      jsaName: "",
      submitSopUrl: "",
      submitJsaUrl: "",
      serviceNumber: "",
    };
  },
  created() {
    this.$gio.createWorkorder({
      entrance: "web工单列表",
    });
  },
  async mounted() {
    console.log(this.$route.query.isChecked);
    this.serviceId = this.$route.query.serviceId;
    this.serviceNumber = this.$route.query.serviceNumber;
    this.getServiceItemDetail(this.serviceId);
    this.checked = this.$route.query.isChecked == "true" ? true : false;
  },

  methods: {
    // 查询详情
    getServiceItemDetail(val) {
      const params = {
        id: val,
      };
      this.requestMethodGet("/web/config/serviceConfiguration/queryServiceConfInfoById", params).then(async (res) => {
        if (res.data.code == 1000) {
          const data = res.data.data;

          // sop文件
          if (data.sopUrl) {
            this.sopName = data.sopUrl.split("/")[data.sopUrl.split("/").length - 1];
          }
          this.submitSopUrl = data.sopUrl;
          // JSA文件
          if (data.jsaUrl) {
            this.jsaName = data.jsaUrl.split("/")[data.jsaUrl.split("/").length - 1];
          }
          this.submitJsaUrl = data.jsaUrl;
          console.log(this.jsaName, this.sopName);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 同意免责条款
    confirmChecked() {
      this.dialogCheckedVisible = false;
      // 调取接口
      this.submitRequest();
    },
    // 预览
    previewAttachment(val, type) {
      let url, methodUrl;
      if (val == "jsa") {
        url = this.submitJsaUrl;
      } else {
        url = this.submitSopUrl;
      }
      const params = {
        url: encodeURI(url),
      };
      if (type == "preview") {
        // 预览
        methodUrl = "/web/file/getFullUrl";
      } else {
        // 下载
        methodUrl = "/web/file/getFullDownloadUrl";
      }

      this.requestMethodGet(methodUrl, params).then((res) => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.add-customer-profile {
  padding: 0 25%;
  height: 100%;
  overflow: auto;
  &-title {
    font-size: 14px;
    color: #999;
    span {
      color: #999;
      font-weight: normal;
      font-size: 12px;
    }
  }
  &-wrap {
    border: 1px solid #e9e9e9;
    margin-top: 20px;
    border-radius: 4px;
  }
  &-header {
    width: 100%;
    background: #f9f9f9;
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    padding: 17px 0px;
    height: 14px;
    line-height: 14px;
    border-bottom: 1px solid #e9e9e9;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 148px;
    height: 148px;
  }
  /deep/.el-upload--picture-card {
    line-height: 148px;
  }
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }

  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 148px;
    height: 148px;
  }
  .file-wrap {
    border: 1px solid #e9e9e9;
    font-family: MicrosoftYaHei;
    padding: 20px;
    border-radius: 4px;
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .file-name {
    line-height: 13px;
    font-size: 13px;
    color: #333;
    cursor: pointer;
  }
  .sop-name {
    border-left: 4px solid #dd0000;
    padding-left: 10px;
    margin-left: 20px;
  }
  .preview {
    font-size: 14px;
    color: #001450;
    cursor: pointer;
  }
  .pdf-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
  }
  .file-title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
    border-left: 3px solid #dd0000;
    padding-left: 10px;
  }
  .file-box {
    display: flex;
    align-items: center;
    font-family: MicrosoftYaHei;
    font-size: 13px;
    color: #333;
  }
}
</style>
<style>
.font-family {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
}
.add-customer-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.add-customer-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.radio-table .el-table::before {
  height: 0px !important;
}
.add-customer-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.add-customer-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.add-customer-profile .el-form-item__label {
  color: #999999;
  padding: 0;
}
.footer {
  padding: 20px 20px 0;
}

.hide .el-upload--picture-card {
  display: none;
}
.create-task .el-dialog__title,
.edit-workOrder .el-dialog__title {
  font-size: 18px !important;
}
.create-task .el-dialog__body,
.edit-workOrder .el-dialog__body {
  padding: 0 20px 40px !important;
}
</style>
