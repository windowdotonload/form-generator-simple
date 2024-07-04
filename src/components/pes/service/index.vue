<template>
  <div style="position: relative">
    <div class="pes-service" :style="mainminheight" id="pesDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="searchForm" size="small" :inline="true" id="searchForm">
          <el-form-item label="所属客户" v-if="userInfo.userType != 2" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length > 0 ? 'color:#606266;' : ''">
              {{ selectCustomerList.length > 0 ? "指定客户" + selectCustomerList.length : "请选择" }}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length > 0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item label="服务商区域" class="form-item-outline">
            <el-select size="small" class="search-info" v-model="searchForm.areaCode" placeholder="请选择" clearable filterable multiple collapse-tags>
              <el-option v-for="item in serviceAreaList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户区域" class="form-item-outline">
            <el-select size="small" class="search-info" v-model="searchForm.customerAreaCode" placeholder="请选择" clearable filterable>
              <el-option v-for="item in serviceAreaList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="danger" plain @click="getServiceList">搜索</el-button>
            <el-button size="small" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <custom-field @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="servicePackage"></custom-field>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table
        class="table"
        ref="serviceTable"
        :tableHeader="tableDataHeader"
        :tableData="serviceTableData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        @changeSearch="tableTitleSearch"
        @changeSortTable="changeSortTable"
      >
        <template v-slot:servicePackageNum="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="档案ID"
            fixed="left"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="档案ID"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.servicePackageNum }}</span>
                <div>
                  <el-button class="copy_text" type="text" style="padding: 0px" v-clipboard:copy="scope.row.servicePackageNum" v-clipboard:success="onCopy" v-clipboard:error="onError">
                    <img src="../../../assets/icon-copy.png" alt="" style="width: 16px; height: 16px; position: relative; top: 3px; cursor: pointer; margin-left: 8px" />
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:customerCompanyName="slotProps">
          <el-table-column
            label="客户"
            fixed="left"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
              title="客户" 
              :sortTypeVal="slotProps.slotData.sortTypeVal" 
              :paramValue="slotProps.slotData.paramValue" 
              @changeSort="changeSortTable" />
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center;width:100%;cursor: pointer;" @click="toCustomerDetail(scope.row)">
                <div class="no-wrap-name">{{ scope.row.customerCompanyName }}</div>
                <img src="../../../assets/pes_icon.png" style="width:20px;height:16px;margin-left:5px" v-if="scope.row.pesFlag == 1 || scope.row.pesFlag == 3" />
                <img src="../../../assets/DPES_icon.png" style="width:20px;height:16px;margin-left:5px" v-if="scope.row.pesFlag == 2 || scope.row.pesFlag == 3" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:serviceCompanyType="slotProps">
          <el-table-column
            label="服务等级"
            fixed="left"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="服务等级"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :changeValue="slotProps.slotData.changeValue"
                :paramValue="slotProps.slotData.paramValue"
                :selectOptions="slotProps.slotData.selectOptions"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center;width:100%;cursor: pointer;">
                <div class="no-wrap-name">{{ scope.row.serviceCompanyType == 0 ? "PES" : "DPES" }}</div>
              </div>
            </template>
          </el-table-column>
        </template>

        <template v-slot:serviceCompanyName="slotProps">
          <el-table-column
            label="服务商"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="服务商"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.serviceCompanyName }}</span>
                <img v-if="scope.row.assistSpFlag" src="../../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:createTimeStr="slotProps">
          <el-table-column
            label="进度"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.progressIngNum }}/{{ scope.row.progressAllNum }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-slot:createUserName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="创建人"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="创建人"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                <div>
                  <div style="display: flex;align-items:center;">
                    <img :src="createUserDetail.headUrl ? createUserDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                    <div style="flex: 1; margin-left: 10px">
                      <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ createUserDetail.userName }}</div>
                    </div>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">电话: </span>
                    <span>{{ formatPhonenumber(createUserDetail.phonenumber) }}</span>
                    <el-button
                      class="copy_tel"
                      style="padding: 0px"
                      type="text"
                      v-clipboard:copy="createUserDetail.phonenumber"
                      v-clipboard:success="onCopyTel"
                      v-clipboard:error="onErrorTel"
                      v-if="createUserDetail.phonenumber"
                    >
                      <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">邮箱: </span>
                    <span>{{ formatEmail(createUserDetail.email) }}</span>
                    <el-button
                      class="copy_mail"
                      type="text"
                      v-clipboard:copy="createUserDetail.email"
                      v-clipboard:success="onCopyMail"
                      v-clipboard:error="onErrorMail"
                      style="padding: 0px"
                      v-if="createUserDetail.email"
                    >
                      <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                </div>
                <span
                  slot="reference"
                  :disabled="!scope.row.createUserName"
                  class="copy_text"
                  type="text"
                  style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                  @click="createPersonDetail(scope)"
                  >{{ scope.row.createUserName || "-" }}</span
                >
              </el-popover>
            </template>
          </el-table-column>
        </template>
        <!-- 创建时间 -->
        <template v-slot:createTime="slotProps">
          <el-table-column
            label="创建时间"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="创建时间"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.createTime }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- 计划书 -->
        <template v-slot:planReportName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="计划书"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-link class="no-wrap-name" v-if="scope.row.planReportUrl" @click="handlePreview(scope.row.planReportUrl, '查看')" style="color:rgb(0,20,79)" :underline="false">{{
                scope.row.planReportName || "-"
              }}</el-link>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </template>
        <!-- 计划书状态 -->
        <template v-slot:planReportStatus="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="计划书状态"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.planReportStatusDesc }}</span>
            </template>
          </el-table-column>
        </template>
        <!-- 效益报告 -->
        <template v-slot:xyzjReportName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="效益报告"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-link class="no-wrap-name" v-if="scope.row.xyzjReportUrl" @click="handlePreview(scope.row.xyzjReportUrl, '查看')" style="color:rgb(0,20,79)" :underline="false">{{
                scope.row.xyzjReportName
              }}</el-link>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </template>
        <!-- 效益报告状态 -->
        <template v-slot:xyzjReportStatus="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="效益报告状态"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.xyzjReportStatusDesc }}</span>
            </template>
          </el-table-column>
        </template>
        <!-- 年度总结  yearReportName -->
        <template v-slot:yearReportName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="年度总结"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-link class="no-wrap-name" v-if="scope.row.yearReportUrl" @click="handlePreview(scope.row.yearReportUrl, '查看')" style="color:rgb(0,20,79)" :underline="false">{{
                scope.row.yearReportName
              }}</el-link>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </template>
        <template v-slot:yearReportStatus="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="年度总结状态"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.yearReportStatusDesc }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-slot:fileStatus="slotProps">
          <el-table-column
            label="状态"
            fixed="right"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span :style="{ color: scope.row.fileStatus == '0' ? '#008888' : '#999999', 'font-weight': 800 }">{{ scope.row.fileStatusDesc }}</span>
              <el-tooltip class="item" effect="dark" v-if="scope.row.planStatus && scope.row.fileStatus == '0'" :content="scope.row.planStatusDesc" placement="top">
                <i class="el-icon-warning" style="color:#FF9900;margin-left:5px" v-if="scope.row.planStatus"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-link @click="handleLook(scope.row)" style="margin-right:10px;color:#001450">查看 </el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.current"
        :page-size="searchForm.size"
        :page-sizes="[40, 80, 100, 200, 500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <customer-list ref="selectCustomer" :showCustomerDialog="showCustomerDialog" @handleSubmitCustomer="handleSubmitCustomer" @handleCloseCustomer="handleCloseCustomer"></customer-list>
    </div>
  </div>
</template>

<script>
import customField from "../../tableComponents/customField.vue";
import customTable from "../../tableComponents/customTable";
import customerList from "../../tableComponents/customerList";
import columnHeader from "../../tableComponents/headerComponent";
import commonJS from "../../tableComponents/tableCommon.js";
export default {
  mixins: [commonJS],
  components: {
    "custom-field": customField,
    "custom-table": customTable,
    "customer-list": customerList,
    "column-header": columnHeader
  },
  data() {
    return {
      createUserDetail: {},
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      activeName: "0",
      loading: false,
      pesDivHeight: 0,
      searchFormHeight: 0,
      customFieldlistUnit: [
        {
          fieldName: "servicePackageNum",
          visible: 2
        },
        {
          fieldName: "customerCompanyName",
          visible: 2
        },
        {
          fieldName: "serviceCompanyType",
          visible: 2
        },
        {
          fieldName: "year",
          visible: 2
        },
        {
          fieldName: "serviceCompanyName",
          visible: 1
        },
        {
          fieldName: "createTimeStr",
          visible: 1
        },
        {
          fieldName: "createUserName",
          visible: 1
        },
        {
          fieldName: "createTime",
          visible: 1
        },
        {
          fieldName: "planReportName",
          visible: 1
        },
        {
          fieldName: "planReportStatus",
          visible: 1
        },
        {
          fieldName: "xyzjReportName",
          visible: 1
        },
        {
          fieldName: "xyzjReportStatus",
          visible: 1
        },
        {
          fieldName: "yearReportName",
          visible: 1
        },
        {
          fieldName: "yearReportStatus",
          visible: 1
        },
        {
          fieldName: "fileStatus",
          visible: 2
        },
        {
          fieldName: "operation",
          visible: 2
        }
      ],
      customFieldlist: [],
      tableHeight: null,
      sortType: true,
      tableDataHeaderInit: {
        servicePackageNum: { filterType: "input", paramValue: "servicePackageNum", changeValue: "", label: "档案ID", slot: "servicePackageNum", width: "200", tooltip: true, fixed: "left" },
        customerCompanyName: {  paramValue: "customerCompanyName", sortTypeVal: "sortDefault", slot: "customerCompanyName", label: "客户", width: "230" },
        serviceCompanyType: { filterType: "selection",sortTypeVal: "sortDefault",changeValue:'', paramValue: "serviceCompanyType", slot: "serviceCompanyType", label: "服务等级", width: "120",selectOptions: [{ name: "PES", code: "0" }, { name: "DPES", code: "1" }], },
        year: {
          filterType: "selection",
          selectMultiple: true,
          paramValue: "year",
          changeValue: "",
          sortTypeVal: "sortDefault",
          label: "年份",
          selectOptions: [],
          fixed: "left",
          prop: "year",
          width: "120",
          tooltip: true
        },
        serviceCompanyName: { filterType: "input", paramValue: "serviceCompanyName", changeValue: "", sortTypeVal: "sortDefault", slot: "serviceCompanyName", label: "服务商", width: "170" },
        createTimeStr: { slot: "createTimeStr", label: "进度", width: "100" },
        createUserName: { filterType: "input", paramValue: "createUserName", changeValue: "", sortTypeVal: "sortDefault", label: "创建人", slot: "createUserName", width: "100", tooltip: true },
        createTime: { filterType: "dateRange", paramValue: "createTime", changeValue: "", sortTypeVal: "sortDown", label: "创建时间", prop: "createTime", width: "150", tooltip: true },
        planReportName: { label: "计划书", slot: "planReportName", width: "230", tooltip: true },
        planReportStatus: { label: "计划书状态", slot: "planReportStatus", prop: "planReportStatus", width: "120", tooltip: true },
        xyzjReportName: { paramValue: "xyzjReportName", changeValue: "", label: "效益报告", slot: "xyzjReportName", width: "230", tooltip: true },
        xyzjReportStatus: { label: "效益报告状态", slot: "xyzjReportStatus", prop: "xyzjReportStatus", width: "120", tooltip: true },
        yearReportName: { paramValue: "yearReportName", changeValue: "", label: "年度总结", slot: "yearReportName", width: "230", tooltip: true },
        yearReportStatus: { label: "年度总结状态", slot: "yearReportStatus", prop: "yearReportStatus", width: "120", tooltip: true },
        fileStatus: {
          filterType: "selection",
          paramValue: "fileStatus",
          selectMultiple: true,
          changeValue: [],
          sortTypeVal: "sortDefault",
          selectOptions: [{ name: "进行中", code: "0" }, { name: "已归档", code: "1" }],
          slot: "fileStatus",
          label: "状态",
          width: "100",
          fixed: "right"
        },
        operation: { slot: "operation", label: "操作" }
      },
      headImg: require("../../../assets/headImg.png"),
      tableDataHeader: [],
      mainminheight: `height:${document.documentElement.clientHeight - 150}px`,
      searchForm: {
        todoFlag: "0",
        servicePackageNum: "",
        serviceCompanyName: "",
        customerCompanyNumber: "",
        year: [],
        serviceCompanyType: '',
        pesFlagYear: "",
        dpesFlagYear: "",
        ordinaryFlagYear: "",
        spFlagYear: "",
        workshopId: "",
        areaCode: [],
        createUserName: "",
        fileStatus: "",
        size: 40,
        orderBy: "createTime",
        current: 1
      },
      pesFlagVal: [],
      serviceTypeList: [],
      serviceAreaList: [],
      selectCompanyName: "",
      customerList: [],
      serviceBtnList: [
        {
          todoFlag: "0",
          name: "全部",
          active: true
        },
        {
          todoFlag: "1",
          name: "已到期"
        }
      ],
      serviceTableData: [],
      showMoreSearch: false,
      totalNumber: 0,
      scaleList: [],
      yearList: [],
      createUserList: [],
      selectCustomerList: [],
      showCustomerDialog: false
    };
  },
  created() {
    // 设置年份数据源
    const minDate = 2021;
    const maxDate = 2050;
    let list = [];
    for (let i = minDate; i <= maxDate; i++) {
      let obj = {};
      obj.value = i;
      obj.label = i;
      list.push(obj);
    }
    this.yearList = list;

    this.getAreaList();
    this.$_getScaleList();
    // this.$_queryCustomerData();

    this.getServiceTypeList();
  },
  async mounted() {
    this.handleTableHeight();
    this.getYearList();
    this.getCustomFieldList();
    if (this.userInfo.userType == 2) {
      this.getCustomerWorkshopList(this.userInfo.companyId);
    } else {
      this.getServiceList();
    }
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 150}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  methods: {
    //获取档案年份下拉数据
    getYearList() {
      this.requestMethodGet("/pes/package/queryAllYears", {}).then(res => {
        if (res.data.code == 1000) {
          let yearList = [];
          let data = res.data.data;
          yearList = data.map(item => {
            return {
              code: item,
              name: item
            };
          });
          let index = this.tableDataHeader.findIndex(item => item.paramValue == "year");
          if (index != -1) {
            this.tableDataHeader[index].selectOptions = yearList;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getServiceTypeList() {
      this.requestMethodGet("/weChat/service/configuration/getServiceLevelTree", {})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            res.data.forEach(item => {
              if (item.children.length == 0) {
                item.children = null;
              } else {
                item.children.forEach(it => {
                  if (it.children.length == 0) {
                    it.children = null;
                  }
                });
              }
            });
            this.serviceTypeList = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 预览文件
    handlePreview(url) {
      const params = {
        url: encodeURI(url)
      };
      this.requestMethodGet("/web/file/getFullUrl", params, true).then(res => {
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
    tableTitleSearch(obj) {
      let searchVal = obj.changeValue;
      this.tableDataHeader.forEach(item => {
        if (obj.paramValue == item.paramValue) {
          item.changeValue = searchVal === 0 || searchVal === false ? searchVal : searchVal || "";
        }
      });

      if (obj.paramValue == "createTime") {
        if (searchVal) {
          (this.searchForm.createTimeStart = searchVal[0] + " 00:00:00"), (this.searchForm.createTimeEnd = searchVal[1] + " 23:59:59");
        } else {
          this.searchForm.createTimeStart = "";
          this.searchForm.createTimeEnd = "";
        }
      } else if (obj.paramValue == "workshopId" || obj.paramValue == "fileStatus") {
        this.searchForm[obj.paramValue] = searchVal.toString();
      } else {
        this.searchForm[obj.paramValue] = searchVal;
      }
      this.getServiceList();
    },
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal;
      this.searchForm.orderBy = obj.paramValue;
      if (sortVal == "sortUp") {
        this.sortType = false;
      } else if (sortVal == "sortDown") {
        this.sortType = true;
      }
      this.tableDataHeader.forEach(item => {
        if (item.sortTypeVal && item.paramValue == this.searchForm.orderBy) {
          item.sortTypeVal = sortVal;
        } else if (item.sortTypeVal && item.paramValue != this.searchForm.orderBy) {
          item.sortTypeVal = "sortDefault";
        }
      });
      this.searchForm.current = 1;
      this.getServiceList();
    },
    // 查看创建人详情
    createPersonDetail(scope) {
      this.createUserDetail = {};
      if (scope.row.createUserId) {
        let param = {
          userId: scope.row.createUserId
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.createUserDetail = res.data;
                if (this.createUserDetail.avatar) {
                  this.getFullUrl(this.createUserDetail.avatar);
                }
                if (this.createUserDetail.roleNames) {
                  this.createUserDetail.roleNames = this.createUserDetail.roleNames.join(",");
                }
                if (this.createUserDetail.phonenumber) {
                  const phoneNum = this.createUserDetail.phonenumber;
                  this.createUserDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                }
              } else {
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
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.createUserDetail.headUrl = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    handleSubmitCustomer(e) {
      this.selectCustomerList = e;
      let selectCompanyNumber = this.selectCustomerList.map(item => {
        return item.companyNumber;
      });
      let selectId = this.selectCustomerList.map(item => {
        return item.companyId;
      });
      this.tableDataHeader.forEach(item => {
        if (item.paramValue == "workshopId") {
          item.changeValue = "";
          item.selectOptions = [];
        }
      });
      this.searchForm.workshopId = "";
      this.searchForm.customerCompanyNumber = selectCompanyNumber.join(",");
      this.getCustomerWorkshopList(selectId.join(","));
      this.showCustomerDialog = false;
    },
    handleCloseCustomer() {
      this.showCustomerDialog = false;
    },
    handleClearCustomer() {
      this.selectCustomerList = [];
      this.searchForm.customerCompanyNumber = "";
      this.tableDataHeader.forEach(item => {
        if (item.paramValue == "workshopId") {
          item.showTips = false;
          item.selectOptions = [];
        }
      });
      this.getServiceList();
      this.$refs["selectCustomer"].clearSelectCustomer();
    },
    getCustomerWorkshopList(companyIds) {
      const params = {
        companyId: companyIds,
        current: 1,
        size: 500
      };
      this.requestMethodPostTip("/weChat/workshop/filterWorkshop", params)
        .then(res => {
          if (res.data.code == 1000) {
            let workshopList = [];
            if (res.data.data.list.length > 0) {
              res.data.data.list.forEach(item => {
                let obj = {
                  code: item.workshopId,
                  name: item.workshopName
                };
                workshopList.push(obj);
              });
            }
            this.tableDataHeader.forEach(item => {
              if (item.paramValue == "workshopId") {
                item.showTips = companyIds.toString().includes(",") ? true : false;
                item.selectOptions = workshopList;
              }
            });
            this.getServiceList();
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    showSelectCustomer() {
      this.showCustomerDialog = true;
    },
    handleClick(item) {
      this.searchForm.todoFlag = item.todoFlag;
      this.serviceBtnList.forEach(it => {
        if (item.name == it.name) {
          it.active = true;
        } else {
          it.active = false;
        }
      });
      this.getServiceList();
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        if (document.getElementById("pesDiv")) {
          this.pesDivHeight = document.getElementById("pesDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          this.searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(this.pesDivHeight) - Number(this.searchFormHeight) - 40;
      }, 200);
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "servicePackage");
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
    handleMoreSearch() {
      this.showMoreSearch = !this.showMoreSearch;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    },
    // 列标题 Label 区域渲染使用的 Function
    renderHeader(h, { column, $index }) {
      const label = column.label;
      return [
        h(
          "el-tooltip",
          {
            props: {
              content: (function() {
                return label;
              })(),
              placement: "top"
            }
          },
          [h("span", {}, label)]
        )
      ];
    },
    // 获取区域
    getAreaList() {
      this.requestMethodGet("/weChat/common/getAreaDropsExcludeArea0000", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.forEach(item => {
            item.label = item.name;
            item.value = item.code;
          });
          this.serviceAreaList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取规模列表
    $_getScaleList() {
      this.getDicDataList("cust_scale").then(res => {
        this.scaleList = res;
      });
    },
    // 查询服务包列表
    getServiceList() {
      this.loading = true;
      if(this.searchForm.serviceCompanyType==''){
        this.searchForm.pesFlagYear = "";
        this.searchForm.dpesFlagYear = "";
        this.searchForm.ordinaryFlagYear = "";
        this.searchForm.spFlagYear = "";
      }
      if(this.searchForm.serviceCompanyType==0){
        this.searchForm.dpesFlagYear = "";
        this.searchForm.ordinaryFlagYear = "";
        this.searchForm.spFlagYear = "";
      }
      if(this.searchForm.serviceCompanyType==1){
        this.searchForm.pesFlagYear = "";
        this.searchForm.ordinaryFlagYear = "";
        this.searchForm.spFlagYear = "";
      }
      const params = _.cloneDeep(this.searchForm);
      (params.orderBy = this.searchForm.orderBy), (params.descFlag = this.sortType);
      params.areaCode = params.areaCode.toString();
      params.year = params.year.length > 0 ? params.year.toString() : "";
      params.menuCode ='PESpackage_web'
      this.requestMethodGet("/pes/package/queryServicePackageListByPage", params)
        .then(res => {
          this.loading = false;
          if (res.data.code == 1000) {
            this.serviceTableData = res.data.data.list;
            this.totalNumber = res.data.data.totalCount;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
          this.$gio.PES_archive_List();
          this.$gio.searchPES_archive_List();
        })
        .catch(res => {});
    },
    onCopy() {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    onError() {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    // 重置
    resetSearch() {
      if (this.searchForm.customerCompanyNumber) {
        this.$refs["selectCustomer"].clearSelectCustomer();
      }
      this.searchForm = {
        todoFlag: this.searchForm.todoFlag,
        serviceCompanyName: "",
        year: [],
        customerCompanyNumber: "",
        pesFlag: "",
        workshopId: "",
        areaCode: [],
        createUserName: "",
        fileStatus: "",
        size: 40,
        current: 1
      };
      this.pesFlagVal = [];
      (this.selectCustomerList = []),
        this.tableDataHeader.forEach(item => {
          item.changeValue = "";
          if (item.paramValue == "workshopId") {
            item.selectOptions = [];
          }
        });
      this.getServiceList();
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      this.selectCompanyName = val;
      // this.$_queryCustomerData();
    },
    clearCustomer(val) {
      if (!val) {
        this.selectCompanyName = "";
        // this.$_queryCustomerData();
      }
    },
    // 查询所属客户
    // $_queryCustomerData() {
    //   let params = {
    //     companyType: 2,
    //     size: 3000,
    //     status: 1,
    //     companyName: this.selectCompanyName
    //   };
    //   this.requestMethodGet("/web/customer/queryCompanyListByPage", params)
    //     .then(res => {
    //       res = res.data;
    //       if (res.code == 1000) {
    //         this.customerList = res.data.list;
    //       } else {
    //         this.$message({
    //           message: res.msg,
    //           type: "warning"
    //         });
    //       }
    //     })
    //     .catch(res => {});
    // },
    handleSizeChange(size) {
      this.searchForm.size = size;
      this.getServiceList();
    },
    handleCurrentChange(current) {
      this.searchForm.current = current;
      this.getServiceList();
    },
    // 工业客户详情
    toCustomerDetail(row) {
      this.$router.push({
        path: "/CustomerProfile/CustomerProfileDetail",
        query: {
          companyNumber: row.customerCompanyNumber,
          companyId: row.customerCompanyId,
          scaleList: JSON.stringify(this.scaleList)
        }
      });
    },
    // 查看
    handleLook(row) {
      this.$router.push({
        path: "/CustomerProfile/CustomerPesIndex",
        query: {
          companyNumber: row.customerCompanyNumber,
          companyId: row.customerCompanyId,
          customerCompanyType: row.customerCompanyType,
          serviceFileNum: row.serviceFileNum,
          assistSpFlag: row.assistSpFlag,
          year: row.year,
          pesInfoId: row.pesInfoId,
          resurce: "list",
          selectedYearItem: JSON.stringify(row)
        }
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/css/customTable.less";
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
.pes-service {
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
      padding-bottom: 10px;
    }
  }
  .el-popover-detail {
    /deep/ .el-button {
      padding: 0px !important;
    }
  }
}
// 设置显示两行，超出省略
/deep/ .el-table th > .cell {
  word-break: keep-all !important;
  white-space: nowrap !important;
}
.no-wrap-name {
  white-space: nowrap;
  max-width: 85%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
