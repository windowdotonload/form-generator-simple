<template>
  <div>
    <div class="legend-box">
      <div class="legend-box-item" v-for="item in cardList" :key="item.idx"><span :style="{ background: item.hColor }"></span>{{ item.title }}</div>
    </div>
    <div class="services-overview" v-for="item in cardList" :key="item.idx">
      <div class="services-overview-card">
        <el-card class="soc-box-card" :style="{ background: item.bgColor, color: item.hColor }" v-loading="cardLoading" element-loading-spinner="el-icon-loading" element-loading-text="加载中...">
          <div
            v-for="o in item.serviceList"
            :key="o.code"
            :class="'soc-item ' + `soc-item-${item.idx}`"
            :data-idx="item.idx"
            :data-code="o.code"
            @click="
              () => {
                handlerClickService(item, o);
              }
            "
          >
            <span class="soc-item-tit">{{ o.serviceName }}</span
            ><span class="soc-item-child">{{ o.type }}</span>
          </div>
        </el-card>
      </div>
      <div class="services-overview-table">
        <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderWorkorder" :tableData="item.tableData" :tableHeight="tableHeight + ''" :loading="item.loading">
          <template #workOrderNumber="slotProps">
            <el-table-column label="工单编号" width="150" show-overflow-tooltip>
              <template slot="header">
                <column-header
                  title="工单编号"
                  :filterType="slotProps.slotData.filterType"
                  :sortTypeVal="slotProps.slotData.sortTypeVal"
                  :paramValue="slotProps.slotData.paramValue"
                  :changeValue="slotProps.slotData.changeValue"
                  :selectMultiple="slotProps.slotData.selectMultiple"
                  :selectOptions="slotProps.slotData.selectOptions"
                  @chSubmit="chSubmit"
                />
              </template>
              <template slot-scope="scope">
                <div>
                  <!-- <span>{{ scope.row.workOrderNumber || "-" }}</span> -->
                  <span style="color: #409eff; cursor: pointer" @click="handleJumpWorkOrderDetail(scope.row)">{{ scope.row.workOrderNumber || "-" }}</span>
                </div>
              </template>
            </el-table-column>
          </template>
          <template #serviceName="slotProps">
            <el-table-column label="服务项" width="150" show-overflow-tooltip>
              <template slot="header">
                <column-header
                  title="服务项"
                  :filterType="slotProps.slotData.filterType"
                  :sortTypeVal="slotProps.slotData.sortTypeVal"
                  :paramValue="slotProps.slotData.paramValue"
                  :changeValue="slotProps.slotData.changeValue"
                  :selectMultiple="slotProps.slotData.selectMultiple"
                  :selectOptions="slotProps.slotData.selectOptions"
                />
              </template>
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <span class="service-name">{{ scope.row.serviceName || "-" }}</span>
                  <!-- <div v-if="scope.row.workOrderPesFlag == 1" class="pes-div">PES</div>
                  <div v-if="scope.row.workOrderPesFlag == 2" class="dpes-div">DPES</div> -->
                </div>
              </template>
            </el-table-column>
          </template>
          <!-- <el-table-column slot="contactName" label="联系人" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popover-${scope.$index}`" trigger="click">
                <div>
                  <div style="display: flex">
                    <img :src="contactDetail.headUrl ? contactDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                    <div style="flex: 1; margin-left: 10px">
                      <div class="username-div">{{ contactDetail.userName }}</div>
                      <div class="rolename-div">{{ contactDetail.roleNames || "-" }}</div>
                    </div>
                  </div>
                  <div class="phone-div">
                    <span style="color: #666; margin-right: 8px">Tel: </span>
                    <span>{{ contactDetail.phonenumber }}</span>
                    <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="contactDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel">
                      <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                  <div class="mail-div">
                    <span style="color: #666; margin-right: 8px">Mail: </span>
                    <span>{{ contactDetail.email }}</span>
                    <el-button class="copy_mail" type="text" v-clipboard:copy="contactDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px">
                      <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                </div>
                <span slot="reference" :disabled="!scope.row.contactName" class="copy_text name-span" type="text" @click="executePersonDetail(scope)">{{ scope.row.contactName || "-" }}</span>
              </el-popover>
            </template>
          </el-table-column> -->
          <template #executePersonName="slotProps">
            <el-table-column label="执行人" width="150" show-overflow-tooltip>
              <template slot="header">
                <column-header
                  title="执行人"
                  :filterType="slotProps.slotData.filterType"
                  :sortTypeVal="slotProps.slotData.sortTypeVal"
                  :paramValue="slotProps.slotData.paramValue"
                  :changeValue="slotProps.slotData.changeValue"
                  :selectMultiple="slotProps.slotData.selectMultiple"
                  :selectOptions="slotProps.slotData.selectOptions"
                  @chSubmit="chSubmit"
                />
              </template>
              <template slot-scope="scope">
                <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                  <div>
                    <div style="display: flex">
                      <img :src="executeDetail.headUrl ? executeDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                      <div style="flex: 1; margin-left: 10px">
                        <div class="username-div">{{ executeDetail.userName }}</div>
                        <div class="rolename-div">{{ executeDetail.roleNames || "-" }}</div>
                      </div>
                    </div>
                    <div class="phone-div">
                      <span style="color: #666; margin-right: 8px">Tel: </span>
                      <span>{{ executeDetail.phonenumber }}</span>
                      <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="executeDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel">
                        <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                      </el-button>
                    </div>
                    <div class="mail-div">
                      <span style="color: #666; margin-right: 8px">Mail: </span>
                      <span>{{ executeDetail.email }}</span>
                      <el-button class="copy_mail" type="text" v-clipboard:copy="executeDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px">
                        <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                      </el-button>
                    </div>
                  </div>
                  <span slot="reference" :disabled="!scope.row.executePersonName" class="copy_text name-span" type="text" @click="contactPersonDetail(scope)">{{
                    scope.row.executePersonName || "-"
                  }}</span>
                </el-popover>
              </template>
            </el-table-column>
          </template>
          <el-table-column slot="workOrderStatus" label="工单状态" width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="workOrder-Status" style="color: #dd0000" v-if="scope.row.workOrderStatus == '0' || scope.row.workOrderStatus == '9'">{{ scope.row.workOrderStatusName }}</span>
              <span class="workOrder-Status" style="color: #001450" v-if="scope.row.workOrderStatus == '2'">{{ scope.row.workOrderStatusName }}</span>
              <span class="workOrder-Status" style="color: #008888" v-if="scope.row.workOrderStatus == '1'">{{ scope.row.workOrderStatusName }}</span>
              <span class="workOrder-Status" style="color: #999999" v-if="scope.row.workOrderStatus == '4'">{{ scope.row.workOrderStatusName }}</span>
              <span class="workOrder-Status" style="color: #999999" v-if="scope.row.workOrderStatus == '3'">{{ scope.row.workOrderStatusName }}</span>
            </template>
          </el-table-column>
        </custom-table>
        <el-pagination
          background
          @size-change="
            val => {
              handleSizeChange(item, val);
            }
          "
          @current-change="
            val => {
              handleCurrentChange(item, val);
            }
          "
          :current-page="item.pageSet.pageNum"
          :page-size="item.pageSet.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="item.pageSet.total"
          style="float: right; margin-top: 10px"
        ></el-pagination>
      </div>
    </div>
    <div class="non-tabs-cont">
      <p style="font-size: 16px;">本行业推荐的所有重点服务</p>
      <template v-if="allKeynotes[0] && allKeynotes[0].type === 'none'">
        <span style="color: #789;">暂无</span>
      </template>
      <template v-else>
        <el-tag v-for="item in allKeynotes" :key="item.code" style="margin:0 14px 10px 0;" type="danger">{{ item.serviceName }}</el-tag>
      </template>
    </div>
    <div class="non-tabs-cont">
      <p style="font-size: 16px;">未做的重点服务&emsp;&emsp;<el-button size="small" type="danger" @click="createWorkOrder">创建服务申请</el-button></p>
      <template v-if="nonTabs[0] && nonTabs[0].type === 'none'">
        <span style="color: #789;">暂无</span>
      </template>
      <template v-else>
        <el-tag v-for="item in nonTabs" :key="item.code" style="margin:0 14px 10px 0;" type="danger">{{ item.serviceName }}</el-tag>
      </template>
    </div>
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
      <el-form :model="questionForm" :rules="serviceTypeRuleApply" ref="questionForm" label-position="top" v-loading="questionFormLoading" style="max-height: 500px;overflow-y: auto;">
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
                <div class="select_person form-item-outline" style="color:#606266;width:80%;height: 30px;line-height: 30px;padding-left: 20px;" @click="allocationUser">
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
      </el-form>
      <div slot="footer" style="margin-top:-20px;">
        <el-button type="danger" plain @click="handleResetApply('questionForm')" size="small">取消</el-button>
        <el-button type="danger" @click="sureAddApply('questionForm')" size="small">确定</el-button>
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
  </div>
</template>

<script>
import customTable from "../../tableComponents/customTable";
import columnHeader from "../../tableComponents/headerComponent";
import UplaodSection from "../../equipment/components/uploadVideoImg.vue";
import { getServiceOverview, getServiceOverviewList } from "@/api/cpServicesOverview/index";
import DAModify from "../../newWorkOrder/mixins/DAModify";
import serviceIncome from "@/components/newWorkOrder/components/serviceIncome";
export default {
  components: {
    "custom-table": customTable,
    "column-header": columnHeader,
    UplaodSection,
    serviceIncome
  },
  mixins: [DAModify],
  props: {
    ruleForm: Object
  },
  data() {
    return {
      SPList: [],
      f: function(list, fn) {
        for (let i = 0; i < list.length; i++) {
          fn(list[i], i);
        }
      },
      activeQuestion:'',
      checkboxList:[], // 选中的问题的children
      incomeBblUnit: "BBL",
      incomeRmbUnit: "RMB",
      showIncomeBbl: false,
      showIncomeRmb: false,
      serviceIncomeList:[
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
      headImg: require("../../../assets/headImg.png"),
      tableDataHeaderWorkorder: [
        { slot: "workOrderNumber", label: "工单编号", paramValue: "workOrderNumber" },
        { slot: "serviceName", label: "服务项" },
        { slot: "contactName" },
        { slot: "executePersonName", label: "执行人", paramValue: "executePersonName" },
        { label: "预约日期", paramValue: "expectComingTime", prop: "expectComingTime", width: "150", tooltip: true },
        { label: "创建日期", paramValue: "createTime", prop: "createTime", width: "150", tooltip: true },
        { slot: "workOrderStatus" }
      ],
      tableHeight: 155,
      cardList: [
        {
          idx: "0",
          title: "过去12个月已做的重点服务",
          bgColor: "rgb(0, 174, 174, 0.1)",
          hColor: "#00aeae",
          tColor: "#e5f7f7",
          serviceList: [{ serviceName: "_", type: "", code: "" }], // 占位数据，勿删
          loading: false,
          tableData: [],
          pageSet: {
            pageNum: 1,
            pageSize: 10,
            total: 0
          }
        },
        {
          idx: "1",
          title: "其它已做的服务",
          bgColor: "rgb(0, 63, 224, 0.1)",
          hColor: "#003fe0",
          tColor: "#e5ebfc",
          serviceList: [{ serviceName: "_", type: "", code: "" }], // 占位数据，勿删
          loading: false,
          tableData: [],
          pageSet: {
            pageNum: 1,
            pageSize: 10,
            total: 0
          }
        }
      ],
      contactDetail: {},
      executeDetail: {},
      companyNumber: "",
      cardLoading: false,
      serverList: [],
      nonTabs: [],
      allKeynotes: [],
      addApplyVisibled: false,
      // 表单验证
      epInfo: {},
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      questionForm: {
        spId: "",
        description: "",
        contactUserId: ""
      },
      checkList: [], // 选中的问题
      lubricationPointTypeList: [], // 润滑点设备类型数组
      assignPermissionsFlag: false, // 分配权限
      executePermissionFlag: false, // 执行权限
      //   表单验证规则
      serviceTypeRuleApply: {
        lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
        oilNumber: [{ required: true, message: "请选择油品种类", trigger: "change" }],
        description: [{ required: true, message: "请输入详细描述", trigger: "change" }],
        contactUserId: [{ required: true, message: "请选择联系人", trigger: "blur" }]
      },
      companyList: [], // 公司数据
      selCompnyPeopleList: [],
      pageIndexDistributive: 1,
      engineerInfoList: [],
      loadMoreData: false,
      userOrRoleName: "",
      engineerTotal: 0,
      executePersonNameVisiable: false,
      applyAllocationObj: {
        customerType: "",
        distributorCompanyName: ""
      },
      executeUserId: "",
      executeUserName: "",
      executeUserRoles: "",
      showRoleNames: false,
      questionFormLoading: false,
      // 服务创造盈属性与服务收益
      applylist: {
        serviceProperty: "",
        incomeBbl: "",
        incomeRmb: ""
      }
    };
  },
  async created() {
    if (this.userInfo.userType === 2) {
      this.selCompnyPeopleList.push(this.userInfo);
    }
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      // if (buttonList[i].menuCode == "device-group-edit-btn") {
      //   this.editGroupBtn = true;
      // }
      if (buttonList[i].menuCode === "service_order_execute_btn") {
        this.executePermissionFlag = true;
      }
      if (buttonList[i].menuCode === "service_order_distribution_btn") {
        this.assignPermissionsFlag = true;
      }
    }
    // this.handlePermission()
    this.getSpList(this.epInfo.companyId);
  },
  mounted() {
    this.companyNumber = this.$route.query.companyNumber;
    this.getServiceOverviewData();
    this.$gio.viewTrend({
      customer: this.epInfo.companyName
    });
  },
  watch: {
    ruleForm: {
      handler(val) {
        console.log(val);
        this.$set(this.companyList, 0, { companyId: val.companyId, companyName: val.companyName });
        this.epInfo.companyId = val.companyId;
        this.epInfo.companyName = val.companyName;
        this.questionForm.customerId = val.companyId;
        this.applyAllocationObj.customerType = val.customerType;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    changeSelDisCompany() {
      this.$forceUpdate();
      this.handleDistributive();
    },
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
    // 问题的切换
    changeQuestion(item) {
      // console.log(item)
      this.activeQuestion = item.id
      this.checkboxList = item.children
    },
    changeCheck(val) {
      console.log(val,this.questionList)
      this.questionList.forEach(item=>{
          item.checkList = []
            val.forEach(it=>{
            if(item.children && item.children.length>0) {
              item.children.forEach(check=>{
                if(it==check.id) {
                  item.checkList.push(it);
                  item.checkList =[...new Set(item.checkList)]
                }
              })
            }
          })
        })
     
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
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); // 只允许输入一个小数点
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.applylist.incomeBbl = this.applylist.incomeBbl.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      } else {
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); // 只允许输入一个小数点
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
        this.applylist.incomeRmb = this.applylist.incomeRmb.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
      }
    },

    // 点击服务项改变样式
    handlerClickService(parent, val) {
      let domList = document.getElementsByClassName(`soc-item-${parent.idx}`);
      this.f(domList, (item, i) => {
        let code = item.dataset.code;
        if (val.code === code) {
          item.style.background = parent.hColor;
          item.style.color = parent.tColor;
        } else {
          item.style.background = "transparent";
          item.style.color = parent.hColor;
        }
      });
      this.cardList[parseInt(parent.idx)].pageSet = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      };
      this.getTableData(parent, val);
    },
    // 获取服务项数据
    getServiceOverviewData() {
      let params = {
        // companyCode: 'C20211201-0004'
        companyCode: this.companyNumber,
        menuCode: "NewWorkOrderList"
      };
      this.cardLoading = true;
      getServiceOverview(params)
        .then(res => {
          if (res.data.code === 1000) {
            let data = res.data.data;
            let soDoneData = data.doneService.map(item => {
              return { serviceName: item.serviceName, type: item.amount, code: item.serviceNumber };
            });
            this.cardList[0].serviceList = soDoneData.length > 0 ? soDoneData : [{ serviceName: "暂无数据", type: "", code: "" }];
            // let soNonData = data.nonService.map((item) => { return {serviceName: item.serviceName, type: '未执行', code: item.serviceNumber} })
            // this.cardList[1].serviceList = soNonData.length > 0 ? soNonData : [{serviceName: '暂无数据', type: '', code: ''}]
            let soOtherData = data.otherService.map(item => {
              return { serviceName: item.serviceName, type: item.amount, code: item.serviceNumber };
            });
            this.cardList[1].serviceList = soOtherData.length > 0 ? soOtherData : [{ serviceName: "暂无数据", type: "", code: "" }];
            // ----
            let nonTabsList = data.nonService.map(item => {
              return { serviceName: item.serviceName, type: "", code: item.serviceNumber };
            });
            this.nonTabs = nonTabsList.length > 0 ? nonTabsList : [{ serviceName: "暂无", type: "none", code: "none" }];
            let allKeynotesList = data.recommendService.map(item => {
              return { serviceName: item.serviceName, type: "", code: item.serviceNumber };
            });
            this.allKeynotes = allKeynotesList.length > 0 ? allKeynotesList : [{ serviceName: "暂无", type: "none", code: "none" }];
            // ----
            this.$nextTick(() => {
              this.f(this.cardList, (item, i) => {
                this.handlerClickService(item, item.serviceList[0]);
              });
            });
          } else {
            this.$message.warning(res.data.msg);
          }
          this.cardLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.cardLoading = false;
        });
    },
    // 获取表格数据
    getTableData(parent, val) {
      // console.log(parent, 'parent')
      if (val.code === "") return;
      let params = {
        companyCode: this.companyNumber,
        // companyCode: 'C20211201-0004',
        serviceNumber: val.code,
        otherFlag: parent.idx === "1" ? 1 : 0,
        current: this.cardList[parseInt(parent.idx)].pageSet.pageNum,
        size: this.cardList[parseInt(parent.idx)].pageSet.pageSize,
        menuCode:"NewWorkOrderList"
      };
      this.serverList[parseInt(parent.idx)] = val;
      this.cardList[parseInt(parent.idx)].loading = true;
      getServiceOverviewList(params)
        .then(res => {
          if (res.data.code === 1000) {
            this.cardList[parseInt(parent.idx)].tableData = res.data.data.list;
            this.cardList[parseInt(parent.idx)].pageSet.total = res.data.data.totalCount;
          } else {
            this.$message.warning(res.data.msg);
          }
          this.cardList[parseInt(parent.idx)].loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleJumpWorkOrderDetail(row) {
      if (row.serviceType === 1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType === 9 || row.serviceType == 11) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      } else if (row.serviceType === 2) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkorderTaskDetail",
          query: {
            workOrderNumber: row.workOrderNumber
          }
        });
      }
      this.$gio.viewCustomerWorkorder({
        workorderNumber: row.workOrderNumber
      });
    },
    // 查看联系人详情
    executePersonDetail(scope) {
      this.contactDetail = {};
      if (scope.row.contactNumber) {
        this.getUserDetail(scope.row.contactNumber, scope.$index, "contact");
      }
    },
    // 切换联系人
    handlerContactUserIdChange() {
      this.executeUserName = "";
      this.executeUserRoles = "";
      this.executeUserId = "";
      this.showRoleNames = false;
    },
    // 查看执行人详情
    contactPersonDetail(scope) {
      this.executeDetail = {};
      if (scope.row.executePersonNumber) {
        this.getUserDetail(scope.row.executePersonNumber, scope.$index, "execute");
      }
    },
    // 获取客户联系人详情
    getUserDetail(val, index, type) {
      if (val) {
        if (type === "contact") {
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
            if (res.code === 1000) {
              if (res.data) {
                if (type === "contact") {
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
                if (type === "contact") {
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
    async getFileUrl(halfPath) {
      const res = await this.requestMethodGet("/web/file/getFullUrl", {
        url: halfPath
      });
      if (res.data.code === 1000) {
        return Promise.resolve(res.data.data);
      } else {
        this.$message({
          type: "warning",
          message: "获取全路径失败，请稍后重试。"
        });
      }
    },
    // 创建申请单
    createWorkOrder() {
      this.getApplyReasonConfTree();
      this.getOilTypeData();
      this.$_queryLPData();
      this.getCompanyPeople(this.epInfo.customerNumber);
      this.questionForm = {
        spId: this.questionForm.spId,
        description: "",
        contactUserId: ""
      };
      if (this.userInfo.userType === 2) {
        this.questionForm.contactUserId = this.userInfo.userId;
      }
      this.checkList = [];
      this.addApplyVisibled = true;
      this.questionFormLoading = true;
      this.$gio.ClickCreateServiceRequest();
    },
    // 点击分配
    allocationUser() {
      console.log(11232333)
      if (!this.questionForm.spId) {
        this.$message({
          message: "请选择经销商",
          type: "warning"
        });
        return;
      }
      // 更新删除联系人,执行人与联系人无关与所选客户有关
      this.executePersonNameVisiable = true;
      this.handleDistributive();
    },
    // 分配工单
    handleDistributive(val) {
      if (val === "more") {
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
      if (this.userInfo.userType === 1) {
        param.userBelongType = 2;
        param.distributorId = this.userInfo.companyId;
      }
      if (this.active === 3) {
        param.contactPersonId = this.questionForm.contactUserId;
      }
      param.accountId = this.epInfo.companyId;
      param.spId = this.questionForm.spId;
      this.requestMethodGet("/weChat/comp/engCompany/getEngineerUserHasWorkOrderByPage", param)
        .then(res => {
          res = res.data;
          this.loadMoreData = false;
          if (res.code === 1000) {
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
    // 取消新建申请单
    handleResetApply(formName) {
      this.addApplyVisibled = false;
      this.executeUserId = "";
      this.executeUserRoles = "";
      this.executeUserName = "";
      this.showRoleNames = false;
      this.applylist.serviceProperty = "";
      this.applylist.incomeBbl = "";
      this.applylist.incomeRmb = "";
      this.$refs[formName].resetFields();
    },
    closeServiceDialog() {
      this.$refs.uploadVideoImg.cancelUplaod();
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
            // lubricationPointTypeCode: this.questionForm.lubricationPointTypeCode,
            // oilNumber: this.questionForm.oilNumber[this.questionForm.oilNumber.length - 1],
            customerId: this.epInfo.companyId,
            description: this.checkList.includes(2) ? this.questionForm.description : "",
            distributorId: this.userInfo.distributorId,
            reasonConfList: this.checkList,
            serviceApplyType: 1,
            serviceProperty: this.applylist.serviceProperty,
            incomeBbl: this.applylist.incomeBbl,
            incomeRmb: this.applylist.incomeRmb
          };
          // const targetPeople = this.selCompnyPeopleList.find(item => item.userId == this.questionForm.contactUserId);
          // param.customerContactPerson = `userId=${targetPeople.userId}&userName=${targetPeople.userName}&userPhone=${targetPeople.phonenumber}`;
          // param.customerContactPersonId = this.questionForm.contactUserId.toString()
          if (this.userInfo.userType !== 2) {
            param.serviceApplyType = 2;
            param.distributorId = this.userInfo.companyId;
            param.executeUserId = this.executeUserId;
          } else {
            param.customerId = this.userInfo.companyId;
          }
          const uploadAssets = await this.$refs.uploadVideoImg.getUplaodAssets();
          Object.assign(param, uploadAssets);
          param.distributorId = this.questionForm.spId;
          this.requestMethodPost("/serviceApply/addServiceApplyOrder", param)
            .then(res => {
              this.loading = false;
              res = res.data;
              if (res.code === 1000) {
                // 调取消息未读数据
                this.$parent.$parent.$parent.$parent.msgCount();
                if (this.executeUserId !== this.userInfo.userId) {
                  this.$router.push({ path: "/ServiceApplyList" });
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
            .catch(res => {
              console.log(res);
            });
        }
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
            this.questionList.forEach(item=>{
              item.checkList = []
            })
            this.activeQuestion = this.questionList[0].id
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
          if (res.code === 1000) {
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
    // 查询润滑点
    $_queryLPData() {
      let params = {
        parentCode: "lubrication_point_type"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code === 1000) {
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
    async getCompanyPeople(companyNumber) {
      if (this.userInfo.userType === 2) return;
      const params = {
        useFlag: 1,
        companyNumber,
        current: 1,
        size: 300
      };
      if (this.userInfo.userType === 1) params.companyFlag = true;
      const peopleListRes = await this.requestMethodGetTip("/web/system/permission/userManage/listByPage", params);
      if (peopleListRes.data.code === 1000) {
        this.selCompnyPeopleList = peopleListRes.data.data.list;
      }
      this.questionFormLoading = false;
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
    // 表格分页
    handleSizeChange(item, val) {
      this.cardList[parseInt(item.idx)].pageSet.pageSize = val;
      this.getTableData(item, this.serverList[parseInt(item.idx)]);
    },
    handleCurrentChange(item, val) {
      this.cardList[parseInt(item.idx)].pageSet.pageNum = val;
      this.getTableData(item, this.serverList[parseInt(item.idx)]);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .closeWorkOrder {
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
    margin-top: 0px;
  }
  .el-checkbox__label {
    display: inline-grid;
    white-space: pre-line;
    word-wrap: break-word;
    overflow: hidden;
    line-height: 20px;
  }
}
.legend-box {
  .legend-box-item {
    display: inline-block;
    margin-right: 30px;
    font-size: 14px;
    margin-bottom: 20px;
    span {
      display: inline-block;
      width: 12px;
      height: 12px;
      background: #f00;
      border-radius: 4px;
      margin-right: 10px;
    }
  }
}
.services-overview {
  display: flex;
  justify-content: space-between;
  
  .services-overview-card {
    width: 22%;
    .soc-box-card {
      padding: 10px;
      font-size: 14px;
      max-height: 100px;
      overflow-y: auto;
      /deep/.el-card__body {
        padding: 0 !important;
      }
      .soc-item {
        padding: 8px 10px;
        text-align: left;
        cursor: pointer;
        transition: all 0.25s;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        .soc-item-tit {
          display: block;
          width: 78%;
          overflow: hidden;
          text-overflow: ellipsis; //文本溢出显示省略号
          white-space: nowrap;
        }
        .soc-item-child {
          display: block;
          width: 22%;
          text-align: right;
          margin-left: 5px;
          overflow: hidden;
          text-overflow: ellipsis; //文本溢出显示省略号
          white-space: nowrap;
        }
      }
      .soc-item:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
  .services-overview-table {
    width: 76%;
    .el-pagination {
      position: inherit;
      margin-bottom: 10px;
    }
  }
}
.select_person {
    width:80%;
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
</style>
