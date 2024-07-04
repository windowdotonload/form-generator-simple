<template>
  <div style="position:relative">
    <div class="customer-profile" :style="mainminheight" id="customerDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item label="归属渠道" v-if="userInfo.userType == 0" class="form-item-outline">
            <el-select size="small" class="search-info" v-model="queryParams.customerType" @change="handleSearchTableData" placeholder="请选择客户类型" clearable filterable :disabled="loading">
              <el-option v-for="item in customerTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户等级" class="form-item-outline">
            <el-cascader
              size="small"
              :style="{ width: pesFlagVal.length == 0 ? '150px' : '240px' }"
              popper-class="pc-sel-area-cascader"
              placeholder="请选择"
              clearable
              :props="{ value: 'code', label: 'name', children: 'children', multiple: true }"
              collapse-tags
              v-model="pesFlagVal"
              :options="serviceTypeList"
              filterable
              :disabled="loading"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="客户类型" class="form-item-outline">
            <el-select
              size="small"
              :style="{ width: queryParams.dutyNum.length == 0 ? '150px' : '240px' }"
              v-model="queryParams.dutyNum"
              placeholder="请选择"
              clearable
              multiple
              filterable
              collapse-tags
              :disabled="loading"
            >
              <el-option v-for="item in dutyNumList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="danger" plain @click="handleSearchTableData">搜索</el-button>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button plain @click="handleChangeDownload" v-has="CSChangeBtn" size="small">批量导出更换记录</el-button>
          <el-button plain @click="handleDownload" v-has="CSDownloadBtn" size="small">批量导出客户数据</el-button>
          <el-button type="danger" @click="handleAddnewCustomer" size="small" v-has="CSAddBtn">新建客户</el-button>
          <el-button type="danger" @click="handleChargeDistributor" v-has="customer_pool_btn_PC" size="small">分管客户</el-button>
          <custom-field @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="customer" style="display:inline-block;margin-left:10px;"></custom-field>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table
        class="table"
        ref="customerIndusTable"
        :tableHeader="tableDataHeader"
        :tableData="customerTableData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        :listEmptyType="listEmptyType"
        :limitFlag="limitFlag"
        @changeSearch="tableTitleSearch"
        @changeSortTable="changeSortTable"
        @selectionChange="handleSelectionChange"
      >
        <el-table-column fixed slot="selection" type="selection" :resizable="false" :reserve-selection="true" width="55"></el-table-column>
        <template v-slot:companyName="slotProps">
          <el-table-column
            fixed
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="客户名称"
          >
            <template slot="header">
              <column-header
                title="客户名称"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center;width:100%;">
                <el-tooltip class="item" effect="dark" :content="scope.row.companyName" placement="top-start">
                  <div class="no-wrap-name">{{ scope.row.companyName }}</div>
                </el-tooltip>
                <span class="self-tips" v-if="scope.row.daFlag">直</span>
                <img v-if="scope.row.pesFlag == '1' || scope.row.pesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.pesFlag == '2' || scope.row.pesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:customerDistributor="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="经销商"
            show-overflow-tooltip
            v-if="roleType == 0"
          >
            <template #header>
              <column-header
                title="经销商"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template #default="slotScope">
              <div style="display:flex;align-items:center;">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{
                  slotScope.row.customerDistributor ? slotScope.row.customerDistributor : "-"
                }}</span>
                <img v-if="slotScope.row.assistSpFlag" src="../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:inviterName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="邀请人"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="邀请人"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                <div>
                  <div style="display: flex;align-items:center;">
                    <img :src="inviterPersonDetail.headUrl ? inviterPersonDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                    <div style="flex: 1; margin-left: 10px">
                      <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ inviterPersonDetail.userName }}</div>
                    </div>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">电话: </span>
                    <span>{{ formatPhonenumber(inviterPersonDetail.phonenumber) }}</span>
                    <el-button
                      class="copy_tel"
                      style="padding: 0px"
                      type="text"
                      v-clipboard:copy="inviterPersonDetail.phonenumber"
                      v-clipboard:success="onCopyTel"
                      v-clipboard:error="onErrorTel"
                      v-if="inviterPersonDetail.phonenumber"
                    >
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">邮箱: </span>
                    <span>{{ formatEmail(inviterPersonDetail.email) }}</span>
                    <el-button
                      class="copy_mail"
                      type="text"
                      v-clipboard:copy="inviterPersonDetail.email"
                      v-clipboard:success="onCopyMail"
                      v-clipboard:error="onErrorMail"
                      style="padding: 0px"
                      v-if="inviterPersonDetail.email"
                    >
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                </div>
                <span
                  slot="reference"
                  :disabled="!scope.row.inviterName"
                  class="copy_text"
                  type="text"
                  style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                  @click="getPersonDetail(scope)"
                  >{{ scope.row.inviterName || "-" }}</span
                >
              </el-popover>
            </template>
          </el-table-column>
        </template>
        <template v-slot:status="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="状态"
          >
            <template slot="header">
              <column-header
                title="状态"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span :style="{ color: scope.row.status == '0' ? '#999999' : '#008888', 'font-weight': 800 }">{{
                scope.row.status == "1" ? "使用中" : scope.row.status == "2" ? "潜在客户" : scope.row.status == "3" ? "现有客户" : "已停用"
              }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" fixed="right" slot="operation" label="操作" width="100" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link @click="handleLook(scope.row)" style="margin-right: 10px; color: #001450">查看 </el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
    </div>
    <!-- 分管经销商弹框 -->
    <el-dialog title="分管客户" :visible.sync="chargeCustomerVisiable" :append-to-body="true" width="60%" class="create-task">
      <div style="display: flex; align-items: center; margin-bottom: 10px; margin-top: 10px">
        <span>名称：</span>
        <el-input
          size="small"
          v-model="queryParamsDialog.companyName"
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          style="width: 220px;"
          maxlength="50"
          @change="handleSearchDialogData"
          clearable
        ></el-input>
        <span style="margin-left: 10px">城市：</span>
        <el-input
          size="small"
          v-model="queryParamsDialog.regionCityName"
          placeholder="请输入关键字"
          suffix-icon="el-icon-search"
          style="width: 220px;"
          maxlength="50"
          @change="handleSearchDialogData"
          clearable
        ></el-input>
        <el-button @click="handleClearDialog" style="margin-left:30px;" size="small">重置</el-button>
      </div>
      <div>
        <el-table
          :data="customerPoolList"
          tooltip-effect="dark"
          ref="tableChargeDistributor"
          v-loading="loadingDialog"
          v-el-table-infinite-scroll="load"
          :row-key="getRowKey"
          @selection-change="selectAll"
        >
          <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
          <el-table-column prop="companyName" min-width="20%" label="名称"> </el-table-column>
          <el-table-column prop="regionCityName" min-width="10%" label="所在城市">
            <template slot-scope="scope">
              {{ scope.row.regionCityName || "暂无" }}
            </template>
          </el-table-column>
          <el-table-column prop="custScaleName" min-width="15%" label="规模">
            <template slot-scope="scope">
              {{ scope.row.custScaleName || "暂无" }}
            </template>
          </el-table-column>
          <el-table-column prop="address" min-width="15%" label="公司地址">
            <template slot-scope="scope">
              {{ scope.row.address || "暂无" }}
            </template>
          </el-table-column>
          <template slot="empty">
            <div style="font-size: 13px;line-height: 21px;color: #999;">
              <img src="../../assets/pes_empty.png" style="width: 160px;height: 160px;" alt="" />
              <div>暂无数据</div>
              <div>您可前往小程序端邀请客户注册</div>
            </div>
          </template>
        </el-table>
        <el-pagination
          v-if="totalNumberDialog"
          background
          @size-change="handleSizeChangeDialog"
          @current-change="handleCurrentChangeDialog"
          :current-page="pagenationDialog.current"
          :page-size="pagenationDialog.size"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumberDialog"
          style="position: relative;margin-top: 50px;float: right;"
        ></el-pagination>
      </div>
      <div slot="footer" style="margin: 50px 0 10px;">
        <el-button type="danger" plain @click="handleResetChargeDistributor()" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitChargeCustomer()" size="small">确定</el-button>
      </div>
    </el-dialog>
    <newCustomerDrawer :visible="addNewCustomerData.visible" v-if="addNewCustomerData.visible"></newCustomerDrawer>
  </div>
</template>

<script>
import customField from "../tableComponents/customField";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
import commonJS from "../tableComponents/tableCommon.js";
import addNewCustomer from "./components/addNewCustomer/addNewCustomer";
export default {
  mixins: [commonJS, addNewCustomer],
  data() {
    return {
      inviterPersonDetail: {},
      pesFlagVal: [],
      customerDivHeight: 0,
      searchFormHeight: 0,
      customFieldlistUnit: [
        {
          fieldName: "companyName",
          visible: 2
        },
        {
          fieldName: "customerDistributor",
          visible: 1
        },
        {
          fieldName: "regionCityName",
          visible: 1
        },
        {
          fieldName: "companyIndustryName",
          visible: 1
        },
        {
          fieldName: "createTimeStr",
          visible: 1
        },
        {
          fieldName: "inviterName",
          visible: 1
        },
        {
          fieldName: "status",
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
        companyName: { filterType: "input", paramValue: "companyName", changeValue: "", sortTypeVal: "sortDefault", slot: "companyName", label: "客户名称", fixed: "left", width: "250" },
        customerDistributor: { filterType: "input", paramValue: "customerDistributor", changeValue: "", slot: "customerDistributor", label: "经销商", width: "250" },
        regionCityName: { selectMultiple: true, filterType: "", paramValue: "regionCityName", changeValue: "", selectOptions: [], label: "城市", prop: "regionCityName", width: "120", tooltip: true },
        companyIndustryName: {
          selectMultiple: true,
          filterType: "",
          paramValue: "companyIndustryCode",
          changeValue: "",
          selectOptions: [],
          label: "行业",
          prop: "companyIndustryName",
          width: "180",
          tooltip: true
        },
        createTimeStr: { filterType: "dateRange", paramValue: "createTime", changeValue: "", sortTypeVal: "sortDown", label: "创建日期", prop: "createTimeStr", width: "120", tooltip: true },
        inviterName: { label: "邀请人", slot: "inviterName", width: "120", tooltip: true },
        status: {
          selectMultiple: true,
          filterType: "selection",
          paramValue: "status",
          changeValue: "",
          selectOptions: [{ code: "1", name: "使用中" }, { code: "0", name: "已停用" }, { code: "2", name: "潜在客户" }, { code: "3", name: "现有客户" }],
          slot: "status",
          label: "状态",
          width: "120"
        },
        operation: { slot: "operation", label: "操作" }
      },
      tableDataHeader: [],
      mainminheight: `height:${document.documentElement.clientHeight - 110}px`,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      chargeCustomerVisiable: false,
      selectChecked: [],
      queryParams: {
        companyType: 2, // 公司类型，1经销商 ，2是工业客户
        companyName: "", // 公司名称
        customerType: null, // 客户类型
        status: "", // 状态
        pesFlag: "", // 服务等级
        pesFlagYear: "", // 服务年份
        customerDistributor: "",
        createTimeStart: "",
        createTimeEnd: "",
        primaryCompanyIndustry: "",
        companyIndustry: "",
        dutyNum: [], // 客户有无税号
        orderBy: "createTime",
        descFlag: true
      },
      queryParamsDialog: {
        regionCityName: "",
        companyName: ""
      },
      dutyNumList: [
        {
          label: "有税号（普通客户）",
          value: 1
        },
        {
          label: "无税号（项目制客户）",
          value: 2
        }
      ],
      serviceTypeList: [
        // { value: "1", label: "PES" },
        // { value: "2", label: "DPES" },
        // { value: "0", label: "普通" },
        // { value: "3", label: "SP" }
      ], // 服务等级
      scaleList: [], // 规模列表
      showMoreSearch: false,
      statusList: [{ value: "1", label: "使用中" }, { value: "0", label: "已停用" }, { value: "2", label: "潜在客户" }, { value: "3", label: "现有客户" }], // 状态列表
      // ，0：查询所有客户，1：查询直营客户，2：查询非直营客户
      customerTypeList: [
        {
          value: 1,
          label: "直供客户"
        },
        {
          value: 2,
          label: "经销商客户"
        }
      ],
      customerTableData: [], // 客户列表
      selectList: [], // 表格多选列表
      loading: false,
      customerId: "",
      loadingDialog: false,
      key: 1, // table key
      totalNumber: 0, // 总条数
      totalNumberDialog: 0,
      //  分页参数
      pagenation: {
        current: 1,
        size: 30
      },
      pagenationDialog: {
        current: 1,
        size: 50
      },
      customerPoolList: [],
      // UI优化
      queryParamsCityCode: "all_000",
      industryList: [],
      industruProps: {
        value: "code",
        label: "name"
      },
      companyIndustryCode: [],
      time: [],
      selfCompanyNumber: "",
      roleType: "",
      listEmptyType: "customer_list",
      limitFlag: false,
      headImg: require("../../assets/headImg.png")
    };
  },
  components: {
    "custom-field": customField,
    "custom-table": customTable,
    "column-header": columnHeader,
    newCustomerDrawer: () => import("./components/addNewCustomer/anCustomerDrawer.vue")
  },
  beforeRouteLeave(to, from, next) {
    this.queryParams.current = this.pagenation.current;
    this.queryParams.size = this.pagenation.size;
    sessionStorage.setItem("queryParams", JSON.stringify(this.queryParams));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/CustomerProfile/CustomerProfileDetail") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  mounted() {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
      if (this.queryParams.regionProvince) this.queryParamsCityCode = [this.queryParams.regionProvince, this.queryParams.regionCity];
      if (this.queryParams.companyIndustry) {
        this.companyIndustryCode = [this.queryParams.primaryCompanyIndustry, this.queryParams.companyIndustry];
      }
      this.pagenation.current = this.queryParams.current;
      this.pagenation.size = this.queryParams.size;
    }
    this.$_getScaleList(); // 获取规模列表
    this.$_getCustomerData(); // 获取工业客户列表
    this.handleTableHeight();
    this.getServiceTypeList();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 110}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  created() {
    this.selfCompanyNumber = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).orgInfo.companyNumber;
    this.customerId = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).orgInfo.companyId;
    this.roleType = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userType;
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "customer_pool_btn_PC") {
        this.limitFlag = true;
      }
    }
    if (this.roleType != 0) {
      delete this.queryParams.customerType;
    }
    this.getAllProvinceAndCityList(); // 获取省市数据
    // this.$_getIndustryData();
    this.getCustomFieldList();
  },
  methods: {
    getPersonDetail(scope) {
      this.inviterPersonDetail = {};
      if (scope.row.inviter) {
        let param = {
          userId: scope.row.inviter
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.inviterPersonDetail = res.data;
                if (this.inviterPersonDetail.avatar) {
                  this.getFullUrl(this.inviterPersonDetail.avatar);
                }
                if (this.inviterPersonDetail.roleNames) {
                  this.inviterPersonDetail.roleNames = this.inviterPersonDetail.roleNames.join(",");
                }
                if (this.inviterPersonDetail.phonenumber) {
                  const phoneNum = this.inviterPersonDetail.phonenumber;
                  this.inviterPersonDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
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
    tableTitleSearch(obj) {
      let searchVal = obj.changeValue;
      this.tableDataHeader.forEach(item => {
        if (obj.paramValue == item.paramValue) {
          item.changeValue = searchVal === 0 || searchVal === false ? searchVal : searchVal || "";
        }
      });
      if (obj.paramValue == "createTime") {
        if (searchVal) {
          this.queryParams.createTimeStart = searchVal[0];
          this.queryParams.createTimeEnd = searchVal[1];
        } else {
          this.queryParams.createTimeStart = "";
          this.queryParams.createTimeEnd = "";
        }
      } else if (obj.paramValue == "regionCityName") {
        if (searchVal) {
          this.queryParamsCityCode = searchVal;
        } else {
          this.queryParamsCityCode = [];
        }
      } else if (obj.paramValue == "companyIndustryCode") {
        if (searchVal) {
          sessionStorage.setItem("customerIndustryStorage", JSON.stringify(searchVal));
          let firstLevel = [],
            secondLevel = [];
          searchVal.forEach(item => {
            if (!firstLevel.includes(item[0])) {
              firstLevel.push(item[0]);
            }
            if (!secondLevel.includes(item[1])) {
              secondLevel.push(item[1]);
            }
          });
          this.companyIndustryCode = [firstLevel.toString(), secondLevel.toString()];
        } else {
          this.companyIndustryCode = [];
        }
      } else if (obj.paramValue == "status") {
        this.queryParams[obj.paramValue] = searchVal.toString();
      } else {
        this.queryParams[obj.paramValue] = searchVal;
      }
      this.handleSearchTableData(); // 获取工业客户列表
    },
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal;
      this.queryParams.orderBy = obj.paramValue;
      if (sortVal == "sortUp") {
        this.queryParams.descFlag = false;
      } else if (sortVal == "sortDown") {
        this.queryParams.descFlag = true;
      }
      this.tableDataHeader.forEach(item => {
        if (item.sortTypeVal && item.paramValue == this.queryParams.orderBy) {
          item.sortTypeVal = sortVal;
        } else if (item.sortTypeVal && item.paramValue != this.queryParams.orderBy) {
          item.sortTypeVal = "sortDefault";
        }
      });
      this.pagenation.current = 1;
      this.handleSearchTableData(); // 获取工业客户列表
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        if (document.getElementById("customerDiv")) {
          this.customerDivHeight = document.getElementById("customerDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          this.searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(this.customerDivHeight) - Number(this.searchFormHeight) - 70;
      }, 200);
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      if (this.userInfo.userType != 0) {
        this.customFieldlistUnit = this.customFieldlistUnit.filter(item => item.fieldName != "customerDistributor");
      }
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "customer");
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
      if (this.$route.params.isSaveQuery) {
        let queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
        if (sessionStorage.getItem("queryParams")) {
          this.pesFlagVal = [queryParams.pesFlag, queryParams.pesFlagYear];
          this.tableDataHeader.forEach(item => {
            if (item.paramValue == "createTime" && queryParams.createTimeStart && queryParams.createTimeEnd) {
              item.changeValue = [queryParams.createTimeStart, queryParams.createTimeEnd];
            } else if (item.paramValue == "companyName") {
              item.changeValue = queryParams.companyName;
            } else if (item.paramValue == "customerDistributor") {
              item.changeValue = queryParams.customerDistributor;
            } else if (item.paramValue == "status") {
              item.changeValue = queryParams.status;
            } else if (item.paramValue == "regionCityName" && queryParams.regionProvince) {
              item.changeValue = [queryParams.regionProvince, queryParams.regionCity];
            } else if (item.paramValue == "companyIndustryCode" && queryParams.primaryCompanyIndustry) {
              item.changeValue = JSON.parse(sessionStorage.getItem("customerIndustryStorage"));
            }

            if (queryParams.orderBy == item.paramValue) {
              item.sortTypeVal = queryParams.descFlag ? "sortDown" : queryParams.descFlag === false ? "sortUp" : "sortDefault";
            } else if (item.sortTypeVal && queryParams.orderBy != item.paramValue) {
              item.sortTypeVal = "sortDefault";
            }
          });
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
    // 分管客户
    handleChargeDistributor() {
      this.chargeCustomerVisiable = true;
      this.queryParamsDialog = {
        companyName: "",
        regionCityName: ""
      };
      this.pagenationDialog = {
        current: 1,
        size: 50
      };
      this.$_getChargeCustomerData();
      this.$nextTick(() => {
        this.$refs.tableChargeDistributor.clearSelection();
      });
    },
    // 重置表单
    handleClearDialog() {
      this.queryParamsDialog = {
        companyName: "",
        regionCityName: ""
      };
      this.pagenationDialog = {
        current: 1,
        size: 50
      };
      this.$_getChargeCustomerData();
    },
    // 搜索弹框表格
    handleSearchDialogData() {
      this.pagenationDialog.current = 1;
      this.$_getChargeCustomerData();
    },
    /** 分管经销商数据列表 */
    $_getChargeCustomerData() {
      this.loadingDialog = true;
      let params = { ...this.queryParamsDialog, ...this.pagenationDialog };
      if (this.roleType == 1) {
        params.flagVisibleCustomerPool = 1;
        params.companyNumber = this.userInfo.companyNumber;
        params.userNumber = this.userInfo.userNumber;
        params.companyType = this.userInfo.userType;
        params.customerType = 0;
      }
      this.requestMethodGet("/weChat/comp/company/queryCustomerPoolList", params)
        .then(res => {
          this.loadingDialog = false;
          res = res.data;
          if (res.code == 1000) {
            const tableData = res.data.list;
            this.customerPoolList = tableData;
            this.totalNumberDialog = res.data.totalCount;
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
      this.$_getChargeCustomerData();
    }, // current change
    handleCurrentChangeDialog(current) {
      this.pagenationDialog.current = current;
      this.$_getChargeCustomerData();
    },
    getRowKey(row) {
      return row.companyId;
    },
    selectAll(val) {
      this.selectChecked = val;
    },
    // 取消分管经销商弹框
    handleResetChargeDistributor() {
      this.chargeCustomerVisiable = false;
      this.queryParamsDialog.companyName = "";
      this.queryParamsDialog.regionCityName = "";
      this.selectChecked = [];
    },
    //分管客户保存接口
    submitCharge() {
      let selectCheckedData = [];
      this.selectChecked.forEach(item => {
        selectCheckedData.push(item.companyId);
      });
      const param = {
        companyIdList: selectCheckedData,
        customerId: this.customerId
      };
      this.requestMethodPost("/weChat/chargeUser/addCompanyChargeRel", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$message({
              message: "分管客户成功",
              type: "success"
            });
            this.chargeCustomerVisiable = false;
            this.$_getCustomerData(); // 刷新列表
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
    handleSubmitChargeCustomer() {
      if (this.selectChecked.length > 0) {
        this.$confirm("是否确认成为这些客户的分管人？", "分管客户", {
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
          message: "请选择分管客户"
        });
      }
    },
    // 获取行业列表
    $_getIndustryData() {
      let params = {
        parentCode: "company_industry"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.industryList = res.data;
              if (this.userInfo.userType != 2) {
                this.tableDataHeader.forEach(item => {
                  if (item.paramValue == "companyIndustryCode") {
                    item.filterType = "cascaderIndustry";
                    item.selectOptions = this.industryList;
                  }
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
    },
    getAllProvinceAndCityList() {
      this.requestMethodGet("/weChat/common/getAreaListByBusinessArea", { businessAreaCode: "" }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.unshift({ code: "", name: "全部" });
            }
          });
          data.unshift({ code: "all_000", name: "全部" });
          this.provinceAndCityList = data;
          if (this.userInfo.userType != 2) {
            this.tableDataHeader.forEach(item => {
              if (item.paramValue == "regionCityName") {
                item.filterType = "cascaderDevice";
                item.selectOptions = this.provinceAndCityList;
              }
            });
          }
          ++this.cascaderKey;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 查询
    handleSearchTableData() {
      if (!this.queryParams.customerType) {
        delete this.queryParams.customerType;
      }
      this.pagenation.current = 1;
      this.$_getCustomerData();
    },
    // 筛选条件收起/更多筛选
    handleMoreSearch() {
      this.showMoreSearch = !this.showMoreSearch;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    },
    // 重置
    handleClearSearch() {
      this.queryParams = {
        companyType: 2, // 公司类型，1经销商 ，2是工业客户
        companyName: "", // 公司名称
        status: "", // 状态
        pesFlag: "",
        pesFlagYear: "",
        dutyNum: []
      };
      this.pesFlagVal = [];
      if (this.roleType == 0) {
        this.queryParams.customerType = null; // 客户类型
      }
      (this.time = []), (this.companyIndustryCode = []);
      this.queryParamsCityCode = "all_000";
      this.pagenation = {
        current: 1,
        size: 30
      };
      this.tableDataHeader.forEach(item => {
        item.changeValue = "";
      });
      this.$_getCustomerData();
    },
    // 新建
    handleAdd() {
      this.$router.push({
        path: "/CustomerProfile/AddCustomerProfile",
        query: {
          scaleList: JSON.stringify(this.scaleList)
        }
      });
    },
    // 下载更换记录
    handleChangeDownload() {
      let url = "";
      let paramObj = {};
      if (this.selectList.length > 0) {
        // 批量下载
        url = "/web/customer/exportCustomerExcel";
        paramObj = {
          companyNumbers: this.selectList.toString(),
          responseTypeBlob: true
        };
        const loading = this.$loading({
          lock: true,
          text: "数据下载中，请稍后",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.requestMethodGet(url, paramObj)
          .then(res => {
            let data = res.data;
            let fileReader = new FileReader();
            let that = this;
            loading.close();
            fileReader.onload = function() {
              try {
                let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
                if (jsonData.code) {
                  that.$message({
                    message: jsonData.msg,
                    type: "error"
                  });
                  return;
                }
              } catch (err) {
                // 解析成对象失败，说明是正常的文件流
                const blob = new Blob([res.data], {
                  type: "application/vnd.ms-excel"
                });
                const objectUrl = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = objectUrl;
                link.setAttribute("download", "更换记录.xlsx");
                document.body.appendChild(link);
                link.click();
              }
            };
            fileReader.readAsText(data);
          })
          .catch(res => {
            loading.close();
          });
      } else {
        // 全部下载
        url = "/web/customer/exportCompanyChangeRecord";
        if (this.queryParamsCityCode == "all_000" || this.queryParamsCityCode.length == 0) {
          this.queryParams.regionProvince = "";
          this.queryParams.regionCity = "";
        } else {
          let regionProvince = [],
            regionCity = [];
          if (this.queryParamsCityCode[0][0] == "all_000") {
            (regionProvince = []), (regionCity = []);
          } else {
            this.queryParamsCityCode.forEach(item => {
              regionProvince.push(item[0]);
              if (item[1] == "") {
                regionCity.push(item[0].substring(0, 2));
              }
              if (item[1] && item[1].substring(0, 2) !== regionCity[regionCity.length - 1]) {
                regionCity.push(item[1]);
              }
            });
          }
          let newregionProvince = Array.from(new Set(regionProvince));
          let newregionCity = regionCity.filter(item => {
            return item.length != 2;
          });
          newregionProvince.forEach((item, index) => {
            newregionCity.forEach((itemA, indexA) => {
              if (item.substring(0, 2) == itemA.substring(0, 2)) {
                newregionProvince.splice(index, 1);
              }
            });
          });
          this.queryParams.regionProvince = newregionProvince.toString();
          this.queryParams.regionCity = newregionCity.toString();
        }
        if (this.companyIndustryCode.length > 0) {
          this.queryParams.primaryCompanyIndustry = this.companyIndustryCode[0];
          this.queryParams.companyIndustry = this.companyIndustryCode[1];
        } else {
          this.queryParams.primaryCompanyIndustry = "";
          this.queryParams.companyIndustry = "";
        }
        if (this.pesFlagVal && this.pesFlagVal.length) {
          let pesFlag = [],
            pesFlagYear = [],
            dpesFlagYear = [],
            ordinaryFlagYear = [],
            spFlagYear = [];
          this.pesFlagVal.forEach(item => {
            if (item.length == 1) {
              if (!pesFlag.includes(item[0])) pesFlag.push(item[0]);
            } else if (item.length > 1) {
              if (!pesFlag.includes(item[0])) pesFlag.push(item[0]);
              if (item[0] === 1) pesFlagYear.push(item[1]);
              if (item[0] === 2) dpesFlagYear.push(item[1]);
              if (item[0] === 0) ordinaryFlagYear.push(item[1]);
              if (item[0] === 3) spFlagYear.push(item[1]);
            }
          });
          this.queryParams.pesFlag = pesFlag.toString();
          this.queryParams.pesFlagYear = pesFlagYear.toString();
          this.queryParams.dpesFlagYear = dpesFlagYear.toString();
          this.queryParams.ordinaryFlagYear = ordinaryFlagYear.toString();
          this.queryParams.spFlagYear = spFlagYear.toString();
        } else if (this.pesFlagVal.length == 0) {
          this.queryParams.pesFlag = "";
          this.queryParams.pesFlagYear = "";
          this.queryParams.dpesFlagYear = "";
          this.queryParams.ordinaryFlagYear = "";
          this.queryParams.spFlagYear = "";
        }
        if (!this.queryParams.customerType) {
          paramObj = {
            companyType: 2,
            companyName: this.queryParams.companyName,
            regionProvince: this.queryParams.regionProvince,
            regionCity: this.queryParams.regionCity,
            status: this.queryParams.status,
            pesFlag: this.queryParams.pesFlag,
            pesFlagYear: this.queryParams.pesFlagYear,
            dpesFlagYear: this.queryParams.dpesFlagYear,
            ordinaryFlagYear: this.queryParams.ordinaryFlagYear,
            spFlagYear: this.queryParams.spFlagYear,
            primaryCompanyIndustry: this.queryParams.primaryCompanyIndustry,
            companyIndustry: this.queryParams.companyIndustry,
            customerDistributor: this.queryParams.customerDistributor,
            createTimeStart: this.queryParams.createTimeStart,
            createTimeEnd: this.queryParams.createTimeEnd,
            orderBy: this.queryParams.orderBy,
            descFlag: this.queryParams.descFlag,
            dutyNum: this.queryParams.dutyNum.toString()
          };
        } else {
          paramObj = {
            companyType: 2,
            companyName: this.queryParams.companyName,
            pesFlag: this.queryParams.pesFlag,
            pesFlagYear: this.queryParams.pesFlagYear,
            dpesFlagYear: this.queryParams.dpesFlagYear,
            ordinaryFlagYear: this.queryParams.ordinaryFlagYear,
            spFlagYear: this.queryParams.spFlagYear,
            customerType: this.queryParams.customerType,
            regionProvince: this.queryParams.regionProvince,
            regionCity: this.queryParams.regionCity,
            status: this.queryParams.status,
            primaryCompanyIndustry: this.queryParams.primaryCompanyIndustry,
            customerDistributor: this.queryParams.customerDistributor,
            companyIndustry: this.queryParams.companyIndustry,
            createTimeStart: this.queryParams.createTimeStart,
            createTimeEnd: this.queryParams.createTimeEnd,
            orderBy: this.queryParams.orderBy,
            descFlag: this.queryParams.descFlag,
            dutyNum: this.queryParams.dutyNum.toString()
          };
        }
        this.requestMethodGet(url, paramObj).then(res => {
          if (res.data.code == 1000) {
            this.$message({
              message: "下载中，请稍后去下载中心查看",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
      }
    },
    // 下载
    handleDownload() {
      let url = "";
      let paramObj = {};
      if (this.selectList.length > 0) {
        // 批量下载
        url = "/web/customer/exportCustomerExcel";
        paramObj = {
          companyNumbers: this.selectList.toString(),
          responseTypeBlob: true
        };
      } else {
        if (this.totalNumber > 10000) {
          this.$confirm("超过导出上限（1万条），请尝试以下方法分批导出：<br/> 1、选择 1 条或 N 条数据导出 <br/> 2、筛选特定属性的数据后导出", "批量导出客户数据", {
            confirmButtonText: "取消",
            showCancelButton: false,
            dangerouslyUseHTMLString: true
          })
            .then(() => {})
            .catch(() => {});
          return;
        }
        // 全部下载
        url = "/web/customer/exportCompanyExcelByQuery";
        let primaryCompanyIndustry = "";
        let companyIndustry = "";
        if (this.queryParamsCityCode == "all_000" || this.queryParamsCityCode.length == 0) {
          this.queryParams.regionProvince = "";
          this.queryParams.regionCity = "";
        } else {
          let regionProvince = [],
            regionCity = [];
          if (this.queryParamsCityCode[0][0] == "all_000") {
            (regionProvince = []), (regionCity = []);
          } else {
            this.queryParamsCityCode.forEach(item => {
              regionProvince.push(item[0]);
              if (item[1] == "") {
                regionCity.push(item[0].substring(0, 2));
              }
              if (item[1] && item[1].substring(0, 2) !== regionCity[regionCity.length - 1]) {
                regionCity.push(item[1]);
              }
            });
          }
          let newregionProvince = Array.from(new Set(regionProvince));
          let newregionCity = regionCity.filter(item => {
            return item.length != 2;
          });
          newregionProvince.forEach((item, index) => {
            newregionCity.forEach((itemA, indexA) => {
              if (item.substring(0, 2) == itemA.substring(0, 2)) {
                newregionProvince.splice(index, 1);
              }
            });
          });
          this.queryParams.regionProvince = newregionProvince.toString();
          this.queryParams.regionCity = newregionCity.toString();
        }
        if (this.companyIndustryCode.length > 0) {
          this.queryParams.primaryCompanyIndustry = this.companyIndustryCode[0];
          this.queryParams.companyIndustry = this.companyIndustryCode[1];
        } else {
          this.queryParams.primaryCompanyIndustry = "";
          this.queryParams.companyIndustry = "";
        }
        if (this.pesFlagVal && this.pesFlagVal.length) {
          let pesFlag = [],
            pesFlagYear = [],
            dpesFlagYear = [],
            ordinaryFlagYear = [],
            spFlagYear = [];
          this.pesFlagVal.forEach(item => {
            if (item.length == 1) {
              if (!pesFlag.includes(item[0])) pesFlag.push(item[0]);
            } else if (item.length > 1) {
              if (!pesFlag.includes(item[0])) pesFlag.push(item[0]);
              if (item[0] === 1) pesFlagYear.push(item[1]);
              if (item[0] === 2) dpesFlagYear.push(item[1]);
              if (item[0] === 0) ordinaryFlagYear.push(item[1]);
              if (item[0] === 3) spFlagYear.push(item[1]);
            }
          });
          this.queryParams.pesFlag = pesFlag.toString();
          this.queryParams.pesFlagYear = pesFlagYear.toString();
          this.queryParams.dpesFlagYear = dpesFlagYear.toString();
          this.queryParams.ordinaryFlagYear = ordinaryFlagYear.toString();
          this.queryParams.spFlagYear = spFlagYear.toString();
        } else if (this.pesFlagVal.length == 0) {
          this.queryParams.pesFlag = "";
          this.queryParams.pesFlagYear = "";
          this.queryParams.dpesFlagYear = "";
          this.queryParams.ordinaryFlagYear = "";
          this.queryParams.spFlagYear = "";
        }
        if (!this.queryParams.customerType) {
          paramObj = {
            companyType: 2,
            companyName: this.queryParams.companyName,
            regionProvince: this.queryParams.regionProvince,
            regionCity: this.queryParams.regionCity,
            status: this.queryParams.status,
            pesFlag: this.queryParams.pesFlag,
            pesFlagYear: this.queryParams.pesFlagYear,
            dpesFlagYear: this.queryParams.dpesFlagYear,
            ordinaryFlagYear: this.queryParams.ordinaryFlagYear,
            spFlagYear: this.queryParams.spFlagYear,
            primaryCompanyIndustry: this.queryParams.primaryCompanyIndustry,
            companyIndustry: this.queryParams.companyIndustry,
            dutyNum: this.queryParams.dutyNum.toString(),
            customerDistributor: this.queryParams.customerDistributor,
            createTimeStart: this.queryParams.createTimeStart,
            createTimeEnd: this.queryParams.createTimeEnd,
            orderBy: this.queryParams.orderBy,
            descFlag: this.queryParams.descFlag,
            responseTypeBlob: true
          };
        } else {
          paramObj = {
            companyType: 2,
            companyName: this.queryParams.companyName,
            pesFlag: this.queryParams.pesFlag,
            pesFlagYear: this.queryParams.pesFlagYear,
            dpesFlagYear: this.queryParams.dpesFlagYear,
            ordinaryFlagYear: this.queryParams.ordinaryFlagYear,
            spFlagYear: this.queryParams.spFlagYear,
            customerType: this.queryParams.customerType,
            regionProvince: this.queryParams.regionProvince,
            regionCity: this.queryParams.regionCity,
            status: this.queryParams.status,
            primaryCompanyIndustry: primaryCompanyIndustry,
            companyIndustry: companyIndustry,
            dutyNum: this.queryParams.dutyNum.toString(),
            customerDistributor: this.queryParams.customerDistributor,
            createTimeStart: this.queryParams.createTimeStart,
            createTimeEnd: this.queryParams.createTimeEnd,
            orderBy: this.queryParams.orderBy,
            descFlag: this.queryParams.descFlag,
            responseTypeBlob: true
          };
        }
      }
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.requestMethodGet(url, paramObj)
        .then(res => {
          let data = res.data;
          let fileReader = new FileReader();
          let that = this;
          loading.close();
          fileReader.onload = function() {
            try {
              let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
                that.$message({
                  message: jsonData.msg,
                  type: "error"
                });
                return;
              }
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              const blob = new Blob([res.data], {
                type: "application/vnd.ms-excel"
              });
              const objectUrl = URL.createObjectURL(blob);
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              that.$refs["customerIndusTable"].clearSelection();
              link.setAttribute("download", "客户列表.xlsx");
              document.body.appendChild(link);
              link.click();
            }
          };
          fileReader.readAsText(data);
          this.$gio.exportCustomerData();
        })
        .catch(res => {
          loading.close();
        });
    },
    // 表格多选事件
    handleSelectionChange(select) {
      this.selectList = [];
      select.forEach(item => {
        this.selectList.push(item.companyNumber);
      });
    },
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getCustomerData();
    },
    // current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.$_getCustomerData();
    },
    // 查看
    handleLook(row) {
      const queryCompanyInfo = Object.fromEntries(
        new Map([
          ...Object.keys(row)
            .filter(key => row[key])
            .map(key => {
              return [key, row[key]];
            })
        ])
      );
      this.$router.push({
        path: "/CustomerProfile/CustomerProfileDetail",
        query: {
          companyId: row.companyId,
          companyNumber: row.companyNumber,
          companyInfo: queryCompanyInfo,
          daFlag: row.daFlag,
          customerDistributorId: row.customerDistributorId,
          scaleList: JSON.stringify(this.scaleList)
        }
      });
      this.$gio.clickViewButtonInCustomerList();
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: "/CustomerProfile/EditCustomerProfile",
        query: {
          companyNumber: row.companyNumber,
          scaleList: JSON.stringify(this.scaleList)
        }
      });
    },
    // 获取工业客户列表
    $_getCustomerData() {
      this.loading = true;
      if (this.queryParamsCityCode == "all_000" || this.queryParamsCityCode.length == 0) {
        this.queryParams.regionProvince = "";
        this.queryParams.regionCity = "";
      } else {
        let regionProvince = [],
          regionCity = [];
        if (this.queryParamsCityCode[0][0] == "all_000") {
          (regionProvince = []), (regionCity = []);
        } else {
          this.queryParamsCityCode.forEach(item => {
            regionProvince.push(item[0]);
            if (item[1] == "") {
              regionCity.push(item[0].substring(0, 2));
            }
            if (item[1] && item[1].substring(0, 2) !== regionCity[regionCity.length - 1]) {
              regionCity.push(item[1]);
            }
          });
        }
        let newregionProvince = Array.from(new Set(regionProvince));
        let newregionCity = regionCity.filter(item => {
          return item.length != 2;
        });
        newregionProvince.forEach((item, index) => {
          newregionCity.forEach((itemA, indexA) => {
            if (item.substring(0, 2) == itemA.substring(0, 2)) {
              newregionProvince.splice(index, 1);
            }
          });
        });
        this.queryParams.regionProvince = newregionProvince.toString();
        this.queryParams.regionCity = newregionCity.toString();
      }
      if (this.pesFlagVal && this.pesFlagVal.length) {
        let pesFlag = [],
          pesFlagYear = [],
          dpesFlagYear = [],
          ordinaryFlagYear = [],
          spFlagYear = [];
        this.pesFlagVal.forEach(item => {
          if (item.length == 1) {
            if (!pesFlag.includes(item[0])) pesFlag.push(item[0]);
          } else if (item.length > 1) {
            if (!pesFlag.includes(item[0])) pesFlag.push(item[0]);
            if (item[0] === 1) pesFlagYear.push(item[1]);
            if (item[0] === 2) dpesFlagYear.push(item[1]);
            if (item[0] === 0) ordinaryFlagYear.push(item[1]);
            if (item[0] === 3) spFlagYear.push(item[1]);
          }
        });
        this.queryParams.pesFlag = pesFlag.toString();
        this.queryParams.pesFlagYear = pesFlagYear.toString();
        this.queryParams.dpesFlagYear = dpesFlagYear.toString();
        this.queryParams.ordinaryFlagYear = ordinaryFlagYear.toString();
        this.queryParams.spFlagYear = spFlagYear.toString();
      } else if (this.pesFlagVal.length == 0) {
        this.queryParams.pesFlag = "";
        this.queryParams.pesFlagYear = "";
        this.queryParams.dpesFlagYear = "";
        this.queryParams.ordinaryFlagYear = "";
        this.queryParams.spFlagYear = "";
      }
      if (this.companyIndustryCode.length > 0) {
        this.queryParams.primaryCompanyIndustry = this.companyIndustryCode[0];
        this.queryParams.companyIndustry = this.companyIndustryCode[1];
      } else {
        this.queryParams.primaryCompanyIndustry = "";
        this.queryParams.companyIndustry = "";
      }
      let params = { ...this.queryParams, ...this.pagenation };
      params.dutyNum = params.dutyNum.toString();
      this.customerTableData = [];
      params.menuCode = "CustomerProfileList";
      this.requestMethodGetHandlePage("/web/customer/queryCompanyListByPage", params, { vm: this, method: "$_getCustomerData", currentKey: "pagenation.current" })
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            res.data.list.forEach(item => {
              item.companyIndustryName = item.companyIndustryNameLevel1 + "/" + item.companyIndustryName;
            });
            this.customerTableData = res.data.list;
            this.totalNumber = res.data.totalCount;
            this.$gio.filterCustomer({
              customerName: params.companyName,
              // serviceLevel: this.$gio.findValueCodeCorresponding(this.serviceTypeList, this.queryParams.pesFlag, "value", "label") || "无",
              taxStatus: this.$gio.findValueCodeCorresponding(this.dutyNumList, this.queryParams.dutyNum, "value", "label") || "无",
              city: this.$gio.findValueCodeCorresponding(this.provinceAndCityList, this.queryParams.regionCity, "code", "name", true) || "全部",
              industy: this.$gio.findValueCodeCorresponding(this.industryList, params.companyIndustry, "code", "name", true) || "全部"
            });
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
    // 获取规模列表
    $_getScaleList() {
      this.getDicDataList("cust_scale").then(res => {
        this.scaleList = res;
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
@import "../../assets/css/customTable.less";
.customer-profile {
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
}
// 设置显示两行，超出省略
/deep/ .el-table th > .cell {
  word-break: keep-all !important;
  white-space: nowrap !important;
}
.no-wrap-name {
  white-space: nowrap;
  max-width: 75%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
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
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #001450 !important;
  border-color: #001450 !important;
}
// .pc-sel-area-cascader {
//   .el-cascader-node.in-active-path,
//   .el-cascader-node.is-active,
//   .el-cascader-node.is-selectable.in-checked-path {
//     color: #dd0000;
//   }
// }
</style>
