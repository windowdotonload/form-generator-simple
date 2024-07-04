<template>
  <div style="position: relative">
    <div class="work-order-component" :style="mainminheight" id="workOrderDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item label="所属客户" v-if="userInfo.userType != 2" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item label="工单类别" class="form-item-outline">
            <el-select size="small" class="search-info" v-model="queryParams.pesFlag" placeholder="请选择" clearable filterable multiple collapse-tags>
              <el-option v-for="item in serviceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="回退情况" class="form-item-outline">
            <el-select size="small" :style="{width:(queryParams.revertType.length==0)?'150px':'200px'}" v-model="queryParams.revertType" placeholder="请选择" clearable filterable multiple collapse-tags>
              <el-option v-for="item in revertTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优秀案例" class="form-item-outline">
            <el-select size="small" :style="{width:(queryParams.revertType.length==0)?'150px':'200px'}" v-model="queryParams.isGood" placeholder="请选择" clearable filterable>
              <el-option v-for="item in caseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="danger" plain @click="handleSearchTableData">搜索</el-button>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <block v-if="importChangeOilFlag && importChangeOilFlag.length>=1" style="margin-right: 10px;">
            <el-button @click="()=>{handleBatchUpload(null, 0)}" type="danger" plain size="small" v-has="fengji">
              批量导入报告
            </el-button>
          </block>
          <el-button @click="handleDownload" v-has="WODownLoadBtn" plain size="small">批量导出</el-button>
          <el-button type="danger" size="small" v-has="service_order_new_add_btn" @click="handleAddWorkOrder" >创建工单</el-button>
          <custom-field @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="workOrder" style="display:inline-block;margin-left:10px;"></custom-field>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table class="table" :listEmptyType="listEmptyType" :limitFlag="limitFlag" :tableHeader="tableDataHeader" :tableData="woTableData" :tableHeight="tableHeight + ''" :loading="loading" @selectionChange="handleSelectionChange" @changeSearch="tableTitleSearch" @changeSortTable="changeSortTable">
        <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" width="40"></el-table-column>
        <template v-slot:workOrderNumber="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="工单编号"
            fixed="left"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
              title="工单编号"
              :filterType="slotProps.slotData.filterType"
              :sortTypeVal="slotProps.slotData.sortTypeVal"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              @changeSort="changeSortTable"
              @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.workOrderNumber }}</span>
                <div>
                  <el-button class="copy_text" type="text" style="padding: 0px">
                    <img src="../../assets/icon_case.png" v-if="scope.row.isGood && userInfo.userType < 2" alt="" style="width: 24px; height: 21px; position: relative; top: 3px; margin-left: 8px" />
                    <img src="../../assets/icon-copy.png"  v-clipboard:copy="scope.row.workOrderNumber" v-clipboard:success="onCopy" v-clipboard:error="onError" alt="" style="width: 16px; height: 16px; position: relative; top: 3px; cursor: pointer; margin-left: 8px" />
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:serviceName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="服务项"
            fixed="left"
          >
            <template slot="header">
              <column-header 
              title="服务项"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectOptions="slotProps.slotData.selectOptions"
              @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <el-tooltip class="item" effect="dark" :content="scope.row.serviceNameAlias" placement="top-start">
                  <div class="service-name">{{ scope.row.serviceName }}</div>
                </el-tooltip>
                <div v-if="scope.row.workOrderPesFlag == 1" class="pes-one">
                  PES
                </div>
                <div v-if="scope.row.workOrderPesFlag == 2" class="pes-two">
                  DPES
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:contactCompanyName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="客户"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.contactCompanyName }}</span>
                <span class="self-tips" v-if="scope.row.daFlag">直</span>
                <img v-if="scope.row.customerPesFlag == '1' || scope.row.customerPesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.customerPesFlag == '2' || scope.row.customerPesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:distributorCompanyName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="经销商"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
              title="经销商"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.distributorCompanyName }}</span>
                <img v-if="scope.row.assistSpFlag" src="../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:serviceSpName="slotProps" v-if="userInfo.userType==0||userInfo.userType==1">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="服务方"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
              title="服务方"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                {{ scope.row.serviceSpName }}
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:executePersonName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="执行人"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
              title="执行人"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                <div>
                  <div style="display: flex;align-items:center;">
                    <img :src="executeDetail.headUrl ? executeDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                    <div style="flex: 1; margin-left: 10px">
                      <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ executeDetail.userName }}</div>
                    </div>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">电话: </span>
                    <span>{{ formatPhonenumber(executeDetail.phonenumber) }}</span>
                    <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="executeDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel" v-if="executeDetail.phonenumber">
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">邮箱: </span>
                    <span>{{ formatEmail(executeDetail.email) }}</span>
                    <el-button class="copy_mail" type="text" v-clipboard:copy="executeDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px" v-if="executeDetail.email">
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                </div>
                <span
                  slot="reference"
                  :disabled="!scope.row.executePersonName"
                  class="copy_text"
                  type="text"
                  style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px;display: flex;"
                  @click="contactPersonDetail(scope)"
                  >
                  <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden"> {{ scope.row.executePersonName || "-" }}</span>
                  <el-tooltip :content="scope.row.executePersonHonoraryMedal=='3' ? '服务大师' :  scope.row.executePersonHonoraryMedal=='2' ? '服务达人' : scope.row.executePersonHonoraryMedal=='1' ?  '服务先锋' :''" placement="top">
                    <img v-if="scope.row.executePersonHonoraryMedal=='3'"  src="../../assets/small_service_great_person.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top: 4px;">
                    <img v-if="scope.row.executePersonHonoraryMedal=='2'" src="../../assets/small_service_master.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top: 4px;">
                    <img v-if="scope.row.executePersonHonoraryMedal=='1'" src="../../assets/small_service_pioneer.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top: 4px;">
                  </el-tooltip>

                   
                  </span
                >
              </el-popover>
            </template>
          </el-table-column>
        </template>
        <template v-slot:workOrderStatusName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="工单状态"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
                title="工单状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <span class="workOrder-Status" style="color: #dd0000" v-if="scope.row.workOrderStatus == '0' || scope.row.workOrderStatus == '9'">{{ scope.row.workOrderStatusName }}</span>
              <span class="workOrder-Status" style="color: #001450" v-if="scope.row.workOrderStatus == '2'">{{ scope.row.workOrderStatusName }}</span>
              <span class="workOrder-Status" style="color: #008888" v-if="scope.row.workOrderStatus == '1'">{{ scope.row.workOrderStatusName }}</span>
              <span class="workOrder-Status" style="color: #999999" v-if="scope.row.workOrderStatus == '4'">{{ scope.row.workOrderStatusName }}</span>
              <span class="workOrder-Status" style="color: #999999" v-if="scope.row.workOrderStatus == '3'">{{ scope.row.workOrderStatusName }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="100" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <span style="color: #001450; cursor: pointer" @click="handleLook(scope.row)">查看</span>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <el-dialog class="closeWorkOrder" :visible.sync="downLoadWorkorder" title="导出为Excel" :show-close="false" width="30%">
        <div class="notice-title">当前共{{ totalWorkorder }}条数据，是否需要导出？</div>
        <div slot="footer">
          <el-button type="danger" plain @click="handleResetFinish()" size="small">取消</el-button>
          <el-button type="danger" @click="sureDownLoadOrder()" size="small">导出</el-button>
        </div>
      </el-dialog>
      <el-dialog class="closeWorkOrder" :visible.sync="addWorkorderVisibled" title="选择服务类型" :show-close="false" width="30%">
        <el-form :model="serviceTypeForm" :rules="serviceTypeRule" ref="serviceTypeForm" label-position="120px" :inline="true">
          <el-row>
            <el-col span="24">
              <el-form-item label="服务类型" prop="serviceType" required>
                <el-cascader
                  ref="cascaderAddr"
                  clearable
                  v-model="serviceTypeForm.serviceType"
                  :options="typeList"
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
        <!-- <div v-if="userInfo.userType != '2' || (userInfo.distributorCompanyType == 1 && userInfo.userType == '2')" style="display: flex; align-items: center; margin-top: 10px; height: 40px">
          <el-checkbox v-model="checked" style="margin-right: 10px"></el-checkbox>
          <div><span style="color: #fe000c">*</span>我已同意条款，<span @click="seenNotice" style="color: #fe000c; text-decoration: underline; cursor: pointer">查看条款明细</span></div>
        </div> -->
        <div slot="footer" style="margin-top: -20px">
          <el-button type="danger" plain @click="handleResetAdd('serviceTypeForm')" size="small">取消</el-button>
          <el-button type="danger" @click="sureAddWorkOrder('serviceTypeForm')" size="small">确定</el-button>
        </div>
      </el-dialog>
      <!-- 新建换油咨询工单   选择换油情况 -->
      <el-dialog title="请选择换油情况" class="closeWorkOrder" :visible="dialogOilChangeVisible" :show-close="false" width="30%">
        <el-form :model="ruleForm" :rules="closerules" ref="ruleForm" label-width="100px" label-position="top">
          <div class="radioGroup" style="margin-top:20px;border:1px solid #e9e9e9;padding: 20px;">
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
      <el-dialog title="免责条款" :visible.sync="dialogVisibleHint" width="30%" class="create-task" :before-close="handleClose">
      <div v-html="serviceClause">{{ serviceClause }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddWorkorder">我已知晓</el-button>
      </span>
    </el-dialog>
      <customerListCom ref="selectCustomer" :selectCustomerList="selectCustomerList" :showCustomerDialog="showCustomerDialog" @handleSubmitCustomer="handleSubmitCustomer" @handleCloseCustomer="handleCloseCustomer"></customerListCom>
    </div>
    <BatchUpload ref="batchUpload"></BatchUpload>
  </div>
</template>

<script>
import listJs from "./mixins/list.js";
import customField from "../tableComponents/customField";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
import commonJS from "../tableComponents/tableCommon.js";
import BatchUpload from '@/components/batchUpload/index'
import BatchUploadJS from '@/components/batchUpload/batchUpload'
export default {
  mixins: [listJs, commonJS, BatchUploadJS],
  components: {
    "custom-field": customField,
    "custom-table": customTable,
    "column-header":columnHeader,
    customerListCom: ()=>import("../tableComponents/customerList"),
    BatchUpload
  },
  data() {
    return {
      serviceClause:'',
      dialogVisibleHint:false,
      checked:false,  // 免责条款
      showCustomerDialog: false,
      workOrderDivHeight: 0,
      searchFormHeight: 0,
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      customFieldlistUnit: [
        {
          fieldName: "workOrderNumber",
          visible: 2
        },
        {
          fieldName: "serviceName",
          visible: 2
        },
        {
          fieldName: "contactCompanyName",
          visible: 1
        },
        {
          fieldName: "distributorCompanyName",
          visible: 1
        },
        {
          fieldName: "serviceSpName",
          visible: 1
        },
        {
          fieldName: "executePersonName",
          visible: 1
        },
        {
          fieldName: "finishTime",
          visible: 1
        },
        {
          fieldName: "createTimeStr",
          visible: 1
        },
        {
          fieldName: "workOrderStatusName",
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
        selection: { slot: "selection" },
        workOrderNumber: { filterType: "input", paramValue: "workOrderNumber", changeValue:"", sortTypeVal: "sortDown", slot: "workOrderNumber", label: "工单编号", fixed: "left", width: "180" },
        serviceName: { filterType: "cascaderService", paramValue: "serviceNumber", changeValue:"", selectOptions:[], slot: "serviceName", label: "服务项", fixed: "left", width: "200" },
        contactCompanyName: { slot: "contactCompanyName", label: "客户", width: "250" },
        distributorCompanyName: { filterType: "input", paramValue: "distributorCompanyName", changeValue:"", slot: "distributorCompanyName", label: "经销商", width: "250" },
        serviceSpName:  { filterType: "input", paramValue: "serviceSpName", changeValue:"", label: "服务方", slot: "serviceSpName", width: "250", tooltip: true},
        executePersonName: { filterType: "input", paramValue: "executePersonName", changeValue:"",slot: "executePersonName", label: "执行人", width: "140" },
        finishTime: { filterType: "dateRange", paramValue: "finishTime", changeValue:"", sortTypeVal: "sortDefault", label: "完成日期", prop: "finishTime", width: "130", tooltip: true },
        createTimeStr: { filterType: "dateRange", paramValue: "createTime", changeValue:"", sortTypeVal: "sortDefault", label: "创建日期", prop: "createTimeStr", width: "130", tooltip: true },
        workOrderStatusName: { selectMultiple: true, filterType: "selection", paramValue: "workOrderStatus", changeValue:"", slot: "workOrderStatusName", label: "工单状态", width: "100" },
        operation: { slot: "operation", label: "操作" }
      },
      tableDataHeader: [],
      headImg: require("../../assets/headImg.png"),
      caseList:[
        {
          value:1,
          label:'是'
        },{
          value:0,
          label:'否'
        }
      ]
    };
  },
  beforeRouteLeave(to, from, next) {
    this.queryParams.current = this.pagenation.current;
    this.queryParams.size = this.pagenation.size;
    this.queryParams.resource = 'workorder'
    sessionStorage.setItem("queryParams", JSON.stringify(this.queryParams));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/NewWorkOrderList/newWorkOrderDetail" || from.path == "/NewWorkOrderList/newWorkOrderOilDetail" || from.path == "/NewWorkOrderList/newWorkorderTaskDetail") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  async created() {
    this.$gio.toWorkorderList({
      entrance: "web导航栏"
    });
    if (this.$route.params.isSaveQuery&&(JSON.parse(sessionStorage.getItem("queryParams")).resource=='workorder')) {
      this.queryParams = sessionStorage.getItem("queryParams")
        ? JSON.parse(sessionStorage.getItem("queryParams"))
        : {
            workOrderNumber: "", //工单编号
            serviceNumber: "", //服务类型
            orderBy: "workOrderNumber", //默认工单编号降序排序
            descFlag: true,
            distributorCompanyName: "",
            executePersonName: "",
            workOrderStatus: "",
            expectComingTimeStart: "", //开始时间
            expectComingTimeEnd: "", //结束时间
            createTimeStart: "", //开始时间
            createTimeEnd: "", //结束时间
            finishStartTime: '',
            finishEndTime: '',
            pesFlag: [], // 工单类别
            workshopId: "" //车间
          };
      if(this.queryParams.companyIds) {
        this.selectCustomerList = this.queryParams.companyIds.split(',')
      }
      if (this.$route.params.routerCompanyInfo) {
        this.queryParams.companyIds = this.$route.params.routerCompanyInfo.companyId;
      }
      this.pagenation.current = this.queryParams.current;
      this.pagenation.size = this.queryParams.size;
    }
    this.$_getServiceList(); //获取服务类型列表
    this.handleTableHeight();
    const res =  await this.requestMethodGet("/workOrder/getWorkOrderStatusDropDown", {workOrderStatus: ""});
    if (res.data.code == 1000) {
      res.data.data.forEach(item=>{
        this.list.push({code: item.workOrderStatus,name: item.workOrderStatusName})
      })
      this.list.unshift({ code: 5, name: "全部" });
      this.getCustomFieldList(); //获取自定义字段列表
    } else {
      this.$message({
        message: res.data.msg,
        type: "warning"
      });
    }
    this.$_getServiceListAll(); //获取服务类型列表包含禁用数据
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
    this.$gio.toWorkorderList({
      entrance: "web导航栏"
    });
  },
  methods: {
    handleClearCustomer() {
      this.selectCustomerList = []
      this.queryParams.companyIds = ""
      this.queryParams.workshopId = ""
      this.tableDataHeader.forEach(item=>{
        if(item.label == "所属车间"){
          item.showTips = false
          item.selectOptions = []
          item.filterType = ''
          item.paramValue = ''
        }
      })
      this.handleSearchTableData()
    },
    getHintCont() {
      let params = {
        valetOrderType: 0,
        customerCompanyNumber: ""
      };
      if (this.userInfo.userType < 2) {
        params.valetOrderType = 1; // 代客下单
        params.customerCompanyNumber = this.applylist.companyNumber; // 客户编码
      } else {
        params.valetOrderType = 0; // 工业客户自己下单
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
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue=="serviceNumber"){
        if (searchVal) {
          sessionStorage.setItem('serviceNumberStorage',JSON.stringify(searchVal))
          let val = []
          searchVal.forEach(item=>{
            val.push(item[item.length - 1])
          })
          this.queryParams.serviceNumber = val.join(",");
        } else {
          this.queryParams.serviceNumber = "";
        }
      }else if(obj.paramValue=="expectComingTime"){
        if(searchVal){
          this.queryParams.expectComingTimeStart = searchVal[0]
          this.queryParams.expectComingTimeEnd = searchVal[1]
        }else{
          this.queryParams.expectComingTimeStart = ""
          this.queryParams.expectComingTimeEnd = ""
        }
      }else if(obj.paramValue=="createTime"){
        if(searchVal){
          this.queryParams.createTimeStart = searchVal[0]
          this.queryParams.createTimeEnd = searchVal[1]
        }else{
          this.queryParams.createTimeStart = ""
          this.queryParams.createTimeEnd = ""
        }
      }else if(obj.paramValue=="evaluateTime"){
        if(searchVal){
          this.queryParams.evaluateTimeStart = searchVal[0]
          this.queryParams.evaluateTimeEnd = searchVal[1]
        }else{
          this.queryParams.evaluateTimeStart = ""
          this.queryParams.evaluateTimeEnd = ""
        }
      }else if(obj.paramValue=="finishTime"){
        if(searchVal){
          this.queryParams.finishStartTime = searchVal[0]
          this.queryParams.finishEndTime = searchVal[1]
        }else{
          this.queryParams.finishStartTime = ''
          this.queryParams.finishEndTime = ''
        }
      }else if(obj.paramValue=="workshopId"||obj.paramValue=="workOrderStatus"){
        this.queryParams[obj.paramValue] = searchVal.toString()
      }else{
        this.queryParams[obj.paramValue] = searchVal
      }
      this.pagenation.current = 1;
      this.handleSearchTableData()
    },
    showSelectCustomer() {
      this.showCustomerDialog = true
    },
    handleSubmitCustomer(e){
      let selectList = e.map(item=>{
        return item.companyId
      })
      this.selectCustomerList = selectList
      this.tableDataHeader.forEach(item=>{
        if(item.label == "所属车间"){
          item.changeValue = ""
          item.selectOptions = []
        }
      })
      this.queryParams.workshopId = ""
      this.queryParams.companyIds = selectList.join(",")
      this.getCustomerWorkshopList(selectList.join(","))
      this.showCustomerDialog = false
    },
    getCustomerWorkshopList(companyIds) {
      const params = {
        companyId: companyIds,
        current: 1,
        size: 500
      };
      this.requestMethodPostTip("/weChat/workshop/filterWorkshop"    , params)
        .then(res => {
          if (res.data.code == 1000) {
            let workshopList = [];
            if(res.data.data.list.length>0){
              res.data.data.list.forEach(item=>{
                let obj = {
                  code:item.workshopId,
                  name:item.workshopName
                }
                workshopList.push(obj)
              })
            }
            this.tableDataHeader.forEach(item=>{
              if(item.label == "所属车间"){
                item.paramValue = "workshopId"
                item.showTips = companyIds.toString().includes(',')?true:false
                item.selectOptions = workshopList
                item.filterType = 'selection'
                let workshopArr = []
                workshopList.forEach(it=>{
                  if(this.queryParams.workshopId.includes(it.code)) workshopArr.push(it.code)
                })
                item.changeValue = workshopArr
              }
            })
            if(this.userInfo.userType == 2){
              this.$_getServiceListAll()
            }else{
              this.handleSearchTableData()
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleCloseCustomer(){
      this.showCustomerDialog = false
    },
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal
      this.queryParams.orderBy = obj.paramValue
      if(sortVal=='sortUp'){
        this.queryParams.descFlag = false
      }else if(sortVal=='sortDown'){
        this.queryParams.descFlag = true
      }
      this.pagenation.current = 1;
      this.tableDataHeader.forEach(item=>{
        if(item.sortTypeVal&&(item.paramValue == this.queryParams.orderBy)){
          item.sortTypeVal = sortVal
        }else if(item.sortTypeVal&&(item.paramValue != this.queryParams.orderBy)){
          item.sortTypeVal = 'sortDefault'
        }
      })
      this.$_getWOData(); //获取工单列表
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        if (document.getElementById("workOrderDiv")) {
          this.workOrderDivHeight = document.getElementById("workOrderDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          this.searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(this.workOrderDivHeight) - Number(this.searchFormHeight) - 40;
      }, 200);
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if(this.userInfo.userType==2){
        this.customFieldlistUnit = [
          {
            fieldName: "workOrderNumber",
            visible: 2
          },
          {
            fieldName: "serviceName",
            visible: 2
          },
          {
            fieldName: "contactCompanyName",
            visible: 1
          },
          {
            fieldName: "executePersonName",
            visible: 1
          },
          {
            fieldName: "finishTime",
            visible: 1
          },
          {
            fieldName: "createTimeStr",
            visible: 1
          },
          {
            fieldName: "workOrderStatusName",
            visible: 1
          },
          {
            fieldName: "operation",
            visible: 2
          }
        ]
      }
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "workOrder");
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
      this.tableDataHeader.forEach(item=>{
        if(item.paramValue=='workOrderStatus')
        item.selectOptions = this.list
      })
      if (this.$route.params.isSaveQuery&&(JSON.parse(sessionStorage.getItem("queryParams")).resource=='workorder')) {
        let queryParams = JSON.parse(sessionStorage.getItem("queryParams"))
        if(sessionStorage.getItem("queryParams")){
          this.tableDataHeader.forEach(item=>{
            if(item.paramValue=='expectComingTime'&&queryParams.expectComingTimeStart&&queryParams.expectComingTimeEnd){
              item.changeValue=[queryParams.expectComingTimeStart,queryParams.expectComingTimeEnd]
            }else if(item.paramValue=='evaluateTime'&&queryParams.evaluateTimeStart&&queryParams.evaluateTimeEnd){
              item.changeValue=[queryParams.evaluateTimeStart,queryParams.evaluateTimeEnd]
            }else if(item.paramValue=='createTime'&&queryParams.createTimeStart&&queryParams.createTimeEnd){
              item.changeValue=[queryParams.createTimeStart,queryParams.createTimeEnd]
            }else if(item.paramValue=='workOrderNumber'){
              item.changeValue = queryParams.workOrderNumber
            }else if(item.paramValue=='serviceNumber'){
              if(item.changeValue){
                item.changeValue = sessionStorage.getItem('serviceNumberStorage')?JSON.parse(sessionStorage.getItem('serviceNumberStorage')):[]
              }
            }else if(item.paramValue=='distributorCompanyName'){
              item.changeValue = queryParams.distributorCompanyName
            }else if(item.paramValue=='executePersonName'){
              item.changeValue = queryParams.executePersonName
            }else if(item.paramValue=='workOrderStatus'){
              let statusArr = []
              item.selectOptions.forEach(it=>{
                if(queryParams.workOrderStatus.includes(it.code)) statusArr.push(it.code)
              })
              item.changeValue = statusArr
            }else if(item.label=='所属车间'){
              item.changeValue = queryParams.workshopId
            }

            if(queryParams.orderBy==item.paramValue){
              item.sortTypeVal = queryParams.descFlag?'sortDown':queryParams.descFlag===false?'sortUp':'sortDefault'
            }else if(item.sortTypeVal&&queryParams.orderBy!=item.paramValue){
              item.sortTypeVal = 'sortDefault'
            }
          })
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
.tab-wrap {
  /deep/ .el-button {
    font-size: 14px;
  }
  /deep/ .el-button:hover {
    border: 1px solid #e4e7ed;
    color: #dd0000;
    cursor: pointer;
    background-color: #fff;
  }
  /deep/ .el-button--danger:hover {
    color: #fff;
    cursor: pointer;
  }
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
.notice-text {
  font-size: 12px;
  line-height: 12px;
  margin: 20px 0 10px;
  color: #ff9900;
  display: flex;
  align-items: center;
}
.work-order-component {
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
    }
  }
  .el-popover-detail {
    /deep/ .el-button {
      padding: 0px !important;
    }
  }
  .pover-class{
    background: #000 !important;
    color: #fff;
  }
  // 设置显示两行，超出省略
  /deep/ .el-table th > .cell {
    word-break: keep-all !important;
    white-space: nowrap !important;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    -webkit-transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  /deep/ .el-tabs__item {
    color: #666;
  }
  /deep/ .el-tabs__item:hover {
    color: #dd0000;
    cursor: pointer;
  }
  /deep/.el-table .descending .sort-caret.descending {
    border-top-color: #001450;
  }
  /deep/.el-table .ascending .sort-caret.ascending {
    border-bottom-color: #001450;
  }
  .workOrder-Status {
    // cursor:pointer;
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    font-weight: bold;
  }
  /deep/ .exDetail {
    .el-dialog__header {
      padding: 0px;
    }
    .el-dialog__body {
      padding: 13px;
    }
    .el-dialog__headerbtn {
      top: 13px;
      right: 12px;
    }
    .el-dialog__wrapper {
      left: 21%;
    }
  }
}
</style>
<style lang="less">
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
.closeWorkOrder .el-dialog__body {
  padding: 20px 20px;
}
.work-order-component .el-checkbox {
  display: block;
}
.closeWorkOrder .el-dialog__title {
  font-size: 18px;
  color: #000;
  font-family: MicrosoftYaHei;
}
.service-name{
  word-break: break-all; 
  white-space: nowrap; 
  text-overflow: ellipsis; 
  overflow: hidden
}
.pes-one{
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
.pes-two{
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
</style>
