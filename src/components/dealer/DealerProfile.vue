<template>
  <div style="position: relative">
    <div class="dealer-profile" :style="mainminheight" id="dealerDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button plain @click="handleDownload" v-has="DLDownloadBtn" size="small">批量导出</el-button>
          <el-button plain type="danger" @click="handleChargeDistributor" v-has="distribution_pool_btn_PC" size="small">分管经销商</el-button>
          <el-button type="danger" @click="handleJumpPage" v-has="DLAddBtn" size="small">新建经销商</el-button>
          <custom-field @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="distributor" style="display:inline-block;margin-left:10px;"></custom-field>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table
        class="table"
        :listEmptyType="listEmptyType"
        :limitFlag="limitFlag"
        :tableHeader="tableDataHeader"
        :tableData="dealerProfileData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        @selectionChange="handleSelectionChange"
        @changeSearch="tableTitleSearch"
        @changeSortTable="changeSortTable"
      >
        <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" width="40"></el-table-column>
        <template v-slot:companyName="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="经销商"
            fixed="left"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="经销商"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center;">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.companyName }}</span>
                <img v-if="scope.row.assistSpFlag" src="../../assets/da_icon.png" alt="" style="width:24px;height:23px;margin-left:8px;" />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:status="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="状态"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.status == "1" ? "正常" : "禁用" }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="100" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link type="danger" @click="handleLook(scope.row)">查看</el-link>
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
      <!-- 分管经销商弹框 -->
      <el-dialog title="分管经销商" :visible.sync="chargeDistributorVisiable" :append-to-body="true" width="60%" class="create-task">
        <div style="display: flex; align-items: center; margin-bottom: 10px; margin-top: 10px">
          <span>名称：</span>
          <el-input
            size="small"
            v-model="queryParamsDialog.companyName"
            placeholder="请输入关键词"
            suffix-icon="el-icon-search"
            style="width: 220px;"
            maxlength="50"
            @change="handleSearchTableData"
            clearable
          ></el-input>
          <span style="margin-left: 10px">城市：</span>
          <el-input
            size="small"
            v-model="queryParamsDialog.regionCityName"
            placeholder="请输入关键词"
            suffix-icon="el-icon-search"
            style="width: 220px;"
            maxlength="50"
            @change="handleSearchTableData"
            clearable
          ></el-input>
          <el-button @click="handleClearDialog" style="margin-left:30px;" size="small">重置</el-button>
        </div>
        <div>
          <el-table
            :data="chargeDistributorData"
            tooltip-effect="dark"
            ref="tableChargeDistributor"
            v-loading="loadingDialog"
            v-el-table-infinite-scroll="load"
            :row-key="getRowKey"
            @selection-change="selectAll"
          >
            <el-table-column type="selection" :reserve-selection="true" width="55"> </el-table-column>
            <el-table-column prop="companyName" min-width="20%" label="名称"> </el-table-column>
            <el-table-column prop="customerCount" min-width="10%" label="服务客户数">
              <template slot-scope="scope">
                {{ scope.row.customerCount || "0" }}
              </template>
            </el-table-column>
            <el-table-column prop="regionCityName" min-width="20%" label="所在城市">
              <template slot-scope="scope">
                {{ scope.row.regionCityName || "暂无" }}
              </template>
            </el-table-column>
            <el-table-column prop="custScaleName" min-width="10%" label="规模"> </el-table-column>
            <el-table-column prop="address" min-width="20%" label="公司地址">
              <template slot-scope="scope">
                {{ scope.row.address || "暂无" }}
              </template>
            </el-table-column>
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
          <el-button type="danger" @click="handleSubmitChargeDistributor()" size="small">确定</el-button>
        </div>
      </el-dialog>
      <!-- <customer-list ref="selectCustomer" :showCustomerDialog="showCustomerDialog" @handleSubmitCustomer="handleSubmitCustomer" @handleCloseCustomer="handleCloseCustomer"></customer-list> -->
    </div>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import customField from "../tableComponents/customField";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
import customerList from "../tableComponents/customerList";
export default {
  name: "DealerProfile",
  components: {
    "custom-field": customField,
    "custom-table": customTable,
    "column-header": columnHeader,
    "customer-list": customerList
  },
  data() {
    return {
      listEmptyType: "dealer-profile",
      limitFlag: false,
      customFieldlistUnit: [
        {
          fieldName: "taxNumber",
          visible: 2
        },
        {
          fieldName: "companyName",
          visible: 2
        },
        {
          fieldName: "custScaleName",
          visible: 1
        },
        {
          fieldName: "areaName",
          visible: 1
        },
        {
          fieldName: "regionCityName",
          visible: 1
        },
        {
          fieldName: "status",
          visible: 1
        },
        {
          fieldName: "createTimeStr",
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
        taxNumber: { filterType: "input", paramValue: "taxNumber", changeValue: "", prop: "taxNumber", label: "税号", fixed: "left", width: "180", tooltip: true },
        companyName: { filterType: "input", paramValue: "companyName", changeValue: "", sortTypeVal: "sortDefault", slot: "companyName", label: "经销商", fixed: "left", width: "200", tooltip: true },
        areaName: { filterType: "selection", paramValue: "searchAreaCode", selectMultiple: true, changeValue: "", selectOptions: [], prop: "areaName", label: "区域", width: "150", tooltip: true },
        custScaleName: {
          filterType: "selection",
          paramValue: "custScale",
          selectMultiple: true,
          changeValue: "",
          selectOptions: [],
          prop: "custScaleName",
          label: "规模",
          width: "150",
          tooltip: true
        },
        regionCityName: {
          filterType: "cascaderDevice",
          paramValue: "areaName",
          selectMultiple: true,
          changeValue: "",
          selectOptions: [],
          prop: "regionCityName",
          label: "业务范围",
          width: "150",
          tooltip: true
        },
        status: {
          filterType: "selection",
          paramValue: "status",
          selectMultiple: true,
          changeValue: "",
          selectOptions: [{ code: "1", name: "正常" }, { code: "0", name: "禁用" }],
          label: "状态",
          slot: "status",
          width: "130",
          tooltip: true
        },
        createTimeStr: { filterType: "dateRange", paramValue: "createDateStr", changeValue: "", sortTypeVal: "sortDown", prop: "createTimeStr", label: "创建日期", width: "150", tooltip: true },
        operation: { slot: "operation", label: "操作" }
      },
      tableDataHeader: [],
      mainminheight: `height:${document.documentElement.clientHeight - 150}px`,
      pageHeight: "",
      screenWidth: null,
      loadingDialog: false,
      selectChecked: [],
      provinceAndCityList: [],
      chargeDistributorVisiable: false, // 分管经销商弹框
      queryParams: {
        companyType: 1, // 公司类型，默认为1
        companyName: "", // 公司名称
        taxNumber: "", // 税号
        custScale: "", // 规模
        searchAreaCode: "", // 区域
        areaName: "", // 业务范围
        status: "", // 状态
        descFlag: true,
        orderBy: "createTime",
        createDateStr: "" // 创建日期
      },
      queryParamsDialog: {
        companyName: "",
        regionCityName: ""
      },
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
      scaleList: [], // 规模
      statusList: [{ value: "1", label: "正常" }, { value: "0", label: "禁用" }], // 状态
      pickerOptions: {
        shortcuts: [
          {
            text: "选择今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      },
      dealerProfileData: [],
      chargeDistributorData: [],
      selectList: [], // 表格所选列表
      loading: false, // 是否显示加载动画，默认隐藏
      loadingDialog: false, // 是否显示加载动画，默认隐藏
      queryParamsCityCode: "all_000",
      tableHeight: 0
    };
  },
  computed: {},
  created() {
    this.getCustomFieldList(); //获取自定义字段列表
    this.getAllProvinceAndCityList(); // 获取省市数据
    this.getAreaList();
    this.pageHeight = document.documentElement.clientHeight;
  },
  mounted() {
    this.limitFlag = this.judgeBtn();
    this.$_getScaleList(); // 获取规模数据
    this.$_getChargeDistributorData();
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 150}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  methods: {
    judgeBtn() {
      let isExit = false;
      let buttonpermsStr = JSON.parse(sessionStorage.getItem("btnPremissions"));
      if (buttonpermsStr === undefined || buttonpermsStr === null) {
        return false;
      }
      for (let i = 0; i < buttonpermsStr.length; i++) {
        if ("distribution_pool_btn_PC" === buttonpermsStr[i].menuCode) {
          isExit = true;
          break;
        }
      }
      return isExit;
    },
    tableTitleSearch(obj) {
      let searchVal = obj.changeValue;
      this.tableDataHeader.forEach(item => {
        if (obj.paramValue == item.paramValue) {
          item.changeValue = searchVal === 0 || searchVal === false ? searchVal : searchVal || "";
        }
      });
      if (obj.paramValue == "areaName") {
        if (searchVal) {
          this.queryParamsCityCode = searchVal;
        } else {
          this.queryParamsCityCode = [];
        }
      } else if (obj.paramValue == "searchAreaCode" || obj.paramValue == "custScale" || obj.paramValue == "status") {
        this.queryParams[obj.paramValue] = searchVal.toString();
      } else {
        this.queryParams[obj.paramValue] = searchVal;
      }
      this.searchTableData();
    },
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal;
      this.queryParams.orderBy = obj.paramValue == "createDateStr" ? "createTime" : obj.paramValue;
      if (sortVal == "sortUp") {
        this.queryParams.descFlag = false;
      } else if (sortVal == "sortDown") {
        this.queryParams.descFlag = true;
      }
      this.tableDataHeader.forEach(item => {
        if (item.sortTypeVal) {
          if (item.paramValue && item.paramValue == obj.paramValue) {
            item.sortTypeVal = sortVal;
          } else if (item.paramValue && item.paramValue != obj.paramValue) {
            item.sortTypeVal = "sortDefault";
          }
        }
      });
      this.searchTableData();
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "distributor");
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
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let dealerDivHeight = 0;
        let searchFormHeight = 0;
        if (document.getElementById("dealerDiv")) {
          dealerDivHeight = document.getElementById("dealerDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(dealerDivHeight) - Number(searchFormHeight) - 40;
      }, 200);
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
          this.tableDataHeader.forEach(item => {
            if (item.paramValue == "areaName") {
              item.selectOptions = this.provinceAndCityList;
            }
          });
          this.$_getDealerData(); // 获取经销商列表
          ++this.cascaderKey;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    getAreaList() {
      this.requestMethodGet("/weChat/company/queryCustomerAreaList", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.tableDataHeader.forEach(item => {
            if (item.paramValue == "searchAreaCode") {
              item.selectOptions = data;
            }
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    changeArea(e) {},
    // 搜索
    searchTableData() {
      this.pagenation.current = 1;
      this.$_getDealerData();
    },
    // 重置
    handleClearSearch() {
      this.queryParams = {
        companyType: 1, // 公司类型，默认为1
        companyName: "", // 公司名称
        taxNumber: "", // 税号
        custScale: "", // 规模
        searchAreaCode: "", // 区域
        areaName: "", // 业务范围
        status: "", // 状态
        createDateStr: "" // 创建日期
      };
      this.queryParamsCityCode = "all_000";
      this.pagenation = {
        current: 1,
        size: 30
      };
      this.tableDataHeader.forEach(item => {
        item.changeValue = "";
      });
      this.$_getDealerData();
    },

    // size change
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getDealerData();
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
    // current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.$_getDealerData();
    },
    // 表格多选
    handleSelectionChange(select) {
      this.selectList = [];
      select.forEach(item => {
        this.selectList.push(item.companyNumber);
      });
    },
    // 批量下载
    // handleBatchDownload() {},
    // 新建，跳转置仙剑经销商档案页面
    handleJumpPage() {
      this.$router.push({
        path: "/DealerProfile/AddDealerProfile",
        query: { scaleList: JSON.stringify(this.scaleList) }
      });
    },
    // 分管经销商
    handleChargeDistributor() {
      this.chargeDistributorVisiable = true;
      this.$_getChargeDistributorData();
      this.$nextTick(() => {
        this.$refs.tableChargeDistributor.clearSelection();
      });
    },
    getRowKey(row) {
      return row.companyNumber;
    },
    selectAll(val) {
      this.selectChecked = val;
    },
    // 取消分管经销商弹框
    handleResetChargeDistributor() {
      this.chargeDistributorVisiable = false;
      this.queryParams.lDOName = "";
      this.queryParams.selectGroupId = [];
    },
    //分管经销商保存接口
    submitCharge() {
      let selectCheckedData = [];
      this.selectChecked.forEach(item => {
        selectCheckedData.push(item.companyNumber);
      });
      const param = {
        companyNumberList: selectCheckedData
      };
      this.requestMethodPost("/companyUser/applyManage", param)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$message({
              message: "分管经销商成功",
              type: "success"
            });
            this.chargeDistributorVisiable = false;
            this.queryParamsCityCode = "all_000";
            this.pagenation = {
              current: 1,
              size: 30
            };
            this.$_getDealerData();
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
    handleSubmitChargeDistributor() {
      console.log(this.selectChecked);
      if (this.selectChecked.length > 0) {
        this.$confirm("是否确认成为这些经销商的分管人？", "分管经销商", {
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
          message: "请选择分管经销商"
        });
      }
    },
    // 下载
    handleDownload() {
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let url = "";
      let paramObj = {};
      if (this.selectList.length > 0) {
        url = "/web/company/exportCompanyExcel";
        paramObj = {
          companyNumbers: this.selectList.toString(),
          responseTypeBlob: true
        };
      } else {
        url = "/web/company/exportCompanyExcelByQuery";
        if (this.queryParamsCityCode == "all_000" || this.queryParamsCityCode.length == 0) {
          this.queryParams.provinceCode = "";
          this.queryParams.cityCode = "";
        } else {
          let provinceCode = [],
            cityCode = [];
          if (this.queryParamsCityCode[0][0] == "all_000") {
            (provinceCode = []), (cityCode = []);
          } else {
            this.queryParamsCityCode.forEach(item => {
              provinceCode.push(item[0]);
              if (item[1] == "") {
                cityCode.push(item[0].substring(0, 2));
              }
              if (item[1] && item[1].substring(0, 2) !== cityCode[cityCode.length - 1]) {
                cityCode.push(item[1]);
              }
            });
          }
          let newProvinceCode = Array.from(new Set(provinceCode));
          let newCityCode = cityCode.filter(item => {
            return item.length != 2;
          });
          newProvinceCode.forEach((item, index) => {
            newCityCode.forEach((itemA, indexA) => {
              if (item.substring(0, 2) == itemA.substring(0, 2)) {
                newProvinceCode.splice(index, 1);
              }
            });
          });
          this.queryParams.provinceCode = newProvinceCode.toString();
          this.queryParams.cityCode = newCityCode.toString();
        }
        paramObj = {
          companyType: this.queryParams.companyType,
          companyName: this.queryParams.companyName,
          taxNumber: this.queryParams.taxNumber,
          searchAreaCode: this.queryParams.searchAreaCode,
          custScale: this.queryParams.custScale,
          areaName: this.queryParams.areaName,
          status: this.queryParams.status,
          provinceCode: this.queryParams.provinceCode,
          cityCode: this.queryParams.cityCode,
          descFlag: this.queryParams.descFlag,
          orderBy: this.queryParams.orderBy,
          createDateStr: this.queryParams.createDateStr,
          responseTypeBlob: true
        };
      }
      paramObj.menuCode = 'distributor'
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
              link.setAttribute("download", "经销商.xls");
              document.body.appendChild(link);
              link.click();
            }
          };
          fileReader.readAsText(data);
        })
        .catch(res => {
          loading.close();
        });
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
        path: "/DealerProfile/DealerProfileDetail",
        query: {
          companyNumber: row.companyNumber,
          distributorId: row.companyId,
          companyInfo: queryCompanyInfo,
          scaleList: JSON.stringify(this.scaleList)
        }
      });
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: "/DealerProfile/EditDealerProfile",
        query: {
          companyNumber: row.companyNumber,
          scaleList: JSON.stringify(this.scaleList),
          statusList: JSON.stringify(this.statusList)
        }
      });
    },
    // 规模
    $_getScaleList() {
      this.getDicDataList("cust_scale").then(res => {
        this.scaleList = res;
        this.tableDataHeader.forEach(item => {
          if (item.paramValue == "custScale") {
            item.selectOptions = this.scaleList;
          }
        });
      });
    },
    // 搜索弹框表格
    handleSearchTableData() {
      this.pagenationDialog.current = 1;
      this.$_getChargeDistributorData();
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
      this.$_getChargeDistributorData();
    },
    /** 分管经销商数据列表 */
    $_getChargeDistributorData() {
      this.loadingDialog = true;
      let params = { ...this.queryParamsDialog, ...this.pagenationDialog };
      this.requestMethodGet("/weChat/mobil/company/queryDistributorPool", params)
        .then(res => {
          this.loadingDialog = false;
          res = res.data;
          if (res.code == 1000) {
            const tableData = res.data.list;
            this.chargeDistributorData = tableData;
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
    /** 经销商列表 */
    $_getDealerData() {
      this.loading = true;
      if (this.queryParamsCityCode == "all_000" || this.queryParamsCityCode.length == 0) {
        this.queryParams.provinceCode = "";
        this.queryParams.cityCode = "";
      } else {
        let provinceCode = [],
          cityCode = [];
        if (this.queryParamsCityCode[0][0] == "all_000") {
          (provinceCode = []), (cityCode = []);
        } else {
          this.queryParamsCityCode.forEach(item => {
            provinceCode.push(item[0]);
            if (item[1] == "") {
              cityCode.push(item[0].substring(0, 2));
            }
            if (item[1] && item[1].substring(0, 2) !== cityCode[cityCode.length - 1]) {
              cityCode.push(item[1]);
            }
          });
        }
        let newProvinceCode = Array.from(new Set(provinceCode));
        let newCityCode = cityCode.filter(item => {
          return item.length != 2;
        });
        newProvinceCode.forEach((item, index) => {
          newCityCode.forEach((itemA, indexA) => {
            if (item.substring(0, 2) == itemA.substring(0, 2)) {
              newProvinceCode.splice(index, 1);
            }
          });
        });
        this.queryParams.provinceCode = newProvinceCode.toString();
        this.queryParams.cityCode = newCityCode.toString();
      }
      if (this.queryParams.createDateStr && Array.isArray(this.queryParams.createDateStr) && this.queryParams.createDateStr.length) {
        this.queryParams.createDateStart = this.queryParams.createDateStr[0];
        this.queryParams.createDateEnd = this.queryParams.createDateStr[1];
        delete this.queryParams.createDateStr;
      }
      let params = { ...this.queryParams, ...this.pagenation, menuCode: "DealerProfile" };
      this.requestMethodGet("/web/company/queryCompanyListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            const tableData = res.data.list;
            if (tableData && tableData.length > 0) {
              tableData.forEach(item => {
                item.createTimeStr = item.createTimeStr;
              });
            }
            this.dealerProfileData = tableData;
            this.totalNumber = res.data.totalCount;
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
@import "../../assets/css/customTable.less";
.dealer-profile {
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
</style>
