<template>
  <div style="position: relative">
    <div class="apply-order-component" id="applyDiv">
      <div class="toolbox-con flexBetween">
        <!-- 搜索区域 -->
        <el-form ref="form" id="formDiv" :model="queryParams" :inline="true" size="small">
          <el-form-item v-show="formDivLen >= 1">  
            <el-button-group class="tab-wrap">
              <el-button size="small" :type="item.active ? 'danger' : ''" v-for="(item, index) in typeList" :key="index" @click="handleClick(item)">
                {{ item.workOrderName }}
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item label="所属客户" v-if="userInfo.userType != 2 && formDivLen >= 2" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item class="form-item-outline" label="服务类型" v-if="(activeName=='普通工单' || activeName=='计划工程服务') && formDivLen >= 3">
            <el-cascader
              size="small"
              popper-class="pc-sel-area-cascader"
              :style="{width:(serviceNumber.length==0)?'150px':'400px'}"
              v-model="serviceNumber"
              :options="typeListData"
              clearable
              :props="industruProps"
              collapse-tags="true"
              filterable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item v-show="formDivLen >= 4" class="form-item-outline" label="服务商">
            <el-input
              suffix-icon="el-icon-search"
              class="search-info"
              size="small"
              v-model="queryParams.distributorCompanyName"
              placeholder="请输入"
              maxlength="50"
              @change="getReportManagementData"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="danger" plain @click="getReportManagementData">搜索</el-button>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
            <el-button @click="handleMoreSearch" plain size="small">{{ showMoreSearch ? "收起筛选" : "更多筛选" }}</el-button>
            </el-form-item>
        </el-form>
        <div>
          <el-button :type="selectList.length ? 'danger' : 'info'" v-loading="downloadFileLoading" @click="handleDownload" plain size="small" :disabled="!selectList.length">批量导出</el-button>
        </div>
      </div>
      <div class="moreSearchCon marBottom" id="formMoreDiv" v-if="showMoreSearch">
        <el-form ref="formMore" :model="queryParams" :inline="true" size="small">
          <el-form-item v-show="formDivLen < 1">  
            <el-button-group class="tab-wrap">
              <el-button size="small" :type="item.active ? 'danger' : ''" v-for="(item, index) in typeList" :key="index" @click="handleClick(item)">
                {{ item.workOrderName }}
              </el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item label="所属客户" v-if="userInfo.userType != 2 && formDivLen < 2" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item class="form-item-outline" label="服务类型" v-if="(activeName=='普通工单' || activeName=='计划工程服务') && formDivLen < 3">
            <el-cascader
              size="small"
              popper-class="pc-sel-area-cascader"
              :style="{width:(serviceNumber.length==0)?'150px':'400px'}"
              v-model="serviceNumber"
              :options="typeListData"
              clearable
              :props="industruProps"
              collapse-tags="true"
              filterable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item v-show="formDivLen < 4" class="form-item-outline" label="服务商">
            <el-input
              suffix-icon="el-icon-search"
              class="search-info"
              size="small"
              v-model="queryParams.distributorCompanyName"
              placeholder="请输入"
              maxlength="50"
              @change="getReportManagementData"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="form-item-outline" label="服务等级" v-if="showMoreSearch&&(activeName=='计划工程服务' || activeName=='MSLA工单' )">
            <el-select size="small" class="search-info" v-model="queryParams.workOrderPesFlag" @change="getReportManagementData" placeholder="请选择" clearable>
              <el-option v-for="item in serviceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-item-outline" label="计划工程服务档案" v-if="showMoreSearch&&activeName=='计划工程服务'">
            <el-input
              suffix-icon="el-icon-search"
              class="search-info"
              size="small"
              v-model="queryParams.servicePackage"
              placeholder="请输入"
              maxlength="50"
              @change="getReportManagementData"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="form-item-outline" label="设备类型" v-if="showMoreSearch">
            <el-cascader
              size="small"
              placeholder="请选择"
              :options="eptList"
              v-model="deviceTypeCode"
              :style="{width:(deviceTypeCode.length==0)?'150px':'450px'}"
              filterable
              clearable
              collapse-tags="true"
              :props="{ value: 'code', label: 'name', multiple:true }">
            </el-cascader>
          </el-form-item>
          <el-form-item class="form-item-outline" label="设备编码" v-if="showMoreSearch">
            <el-input
              suffix-icon="el-icon-search"
              class="search-info"
              v-model="queryParams.deviceCode"
              @change="getReportManagementData"
              placeholder="请输入"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="form-item-outline" label="润滑点设备类型" v-if="showMoreSearch">
            <el-select v-model="queryParams.lubricationPointTypeCode" placeholder="请选择" size="small" class="search-info" clearable @change="getReportManagementData">
              <el-option v-for="item in lubricationPointTypeList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-item-outline" label="润滑油" v-if="showMoreSearch&&activeName=='MSLA工单'">
            <el-select size="small" class="search-info" v-model="queryParams.mslaOilCode" placeholder="请选择" clearable filterable @change="getReportManagementData" remote :remote-method="getLubricant" :loading="loadingLubricant">
              <el-option v-for="item in lubricantList" :key="item.listItemValue" :label="item.listItemValueCn ? item.listItemValueCn : item.listItemValue" :value="item.listItemValue">
                <div style="float: left">{{ item.listItemValueCn || "--" }}</div>
                <div style="float: right">/ {{ item.listItemValue }}</div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-item-outline" label="设备制造商" v-if="showMoreSearch&&activeName=='MSLA工单'">
            <el-select size="small" class="search-info" v-model="queryParams.mslaManufacturer" placeholder="请选择" clearable filterable @change="getReportManagementData" remote :remote-method="getManufacturer" :loading="loadingManufacturer">
              <el-option v-for="item in manufacturerList" :key="item.listItemValue" :label="item.listItemValueCn ? item.listItemValueCn : item.listItemValue" :value="item.listItemValue">
                <div style="float: left">{{ item.listItemValueCn || "--" }}</div>
                <div style="float: right">/ {{ item.listItemValue }}</div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div style="display:flex;">
        <div style="width:70%;">
          <custom-table :highlight="highlight" :tableHeader="tableDataHeader" :tableData="newsTableData" :tableHeight="tableHeight + ''" :loading="loading" @selectionChange="handleSelectionChange" @rowClick="handleRowClick" @changeSearch="tableTitleSearch"  @changeSortTable="changeSortTable">
            <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" :resizable="false" align="center" width="55"></el-table-column>
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
                    :paramValue="slotProps.slotData.paramValue"
                    :changeValue="slotProps.slotData.changeValue"
                    @chSubmit="tableTitleSearch"/>
                </template>
                <template slot-scope="scope">
                  <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                    <div>
                      <div style="display: flex;align-items:center;">
                        <img :src="createUserDetail.headUrl ? createUserDetail.headUrl : require('../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                        <div style="flex: 1; margin-left: 10px">
                          <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ createUserDetail.userName }}</div>
                        </div>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">电话: </span>
                        <span>{{ formatPhonenumber(createUserDetail.phonenumber) }}</span>
                        <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="createUserDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel" v-if="createUserDetail.phonenumber">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">邮箱: </span>
                        <span>{{ formatEmail(createUserDetail.email) }}</span>
                        <el-button class="copy_mail" type="text" v-clipboard:copy="createUserDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px" v-if="createUserDetail.email">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                    </div>
                    <span
                      slot="reference"
                      :disabled="!scope.row.createUserName"
                      class="copy_text"
                      type="text"
                      style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px;display: flex;"
                      @click="createUserNameDetail(scope)"
                      >
                      <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.createUserName || "-" }}</span>
                      <el-tooltip :content="scope.row.createUserHonoraryMedal=='3' ? '服务大师' :  scope.row.createUserHonoraryMedal=='2' ? '服务达人' : scope.row.createUserHonoraryMedal=='1' ?  '服务先锋' :''" placement="top">
                        <img v-if="scope.row.createUserHonoraryMedal=='3'" src="../../assets/small_service_great_person.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top: 4px;">
                        <img v-if="scope.row.createUserHonoraryMedal=='2'" src="../../assets/small_service_master.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top: 4px;">
                        <img v-if="scope.row.createUserHonoraryMedal=='1'" src="../../assets/small_service_pioneer.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top: 4px;">
                      </el-tooltip>
                     
                      </span
                    >
                  </el-popover>
                </template>
              </el-table-column>
            </template>
            <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
            <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-link
                  type="danger"
                  @click.stop="handleLook(scope.row)"
                  :underline="false"
                  :style="scope.row.fileName && scope.row.fileName.toLowerCase().includes('.pdf') ? 'color:rgb(0,20,80)' : 'color:#999'"
                  >预览
                </el-link>
                <el-link
                  type="danger"
                  @click.stop="downloadRowFile(scope.row)"
                  :underline="false"
                  style="color:rgb(0,20,80);margin-left:5px;"
                  >下载
                </el-link>
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
            style="position:relative;display:flex;justify-content:flex-end;bottom:0px;right:0px;margin-top:10px;"
          ></el-pagination>
        </div>
        <workorder-detail :tableHeight="tableHeight" :activeName="activeName" :detailObj="detailObj" :userInfo="userInfo"></workorder-detail>
        <customer-list ref="selectCustomer" :showCustomerDialog="showCustomerDialog" @handleSubmitCustomer="handleSubmitCustomer" @handleCloseCustomer="handleCloseCustomer"></customer-list>
      </div>
    </div>
  </div>
</template>


<script>
import { baseRemoteOauth2 } from "@/api/api";
import debounce from "lodash/debounce";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
import workOrderDetail from "./components/workorderDetail";
import customField from "../tableComponents/customField.vue";
import customerList from "../tableComponents/customerList";
import commonJS from "../tableComponents/tableCommon.js";
export default {
  mixins: [commonJS],
  components: {
    "custom-table": customTable,
    "workorder-detail": workOrderDetail,
    "column-header": columnHeader,
    "custom-field": customField,
    "customer-list":customerList,
  },
  data() {
    return {
      loadingLubricant: false,
      loadingManufacturer: false,
      detailObj: {},
      dataList: [],
      //  自定义属性
      industruProps: {
        value: "serviceNumber",
        label: "serviceName",
        children: "children",
        disabled: !"hasAuth",
        multiple: true
      },
      customerList: [],
      workshopList: [],
      lubricationPointTypeList: [], // 润滑点设备类型
      lubricantList: [],
      manufacturerList: [],
      serviceTypeList: [{ value: "1", label: "PES" }, { value: "2", label: "DPES" }, { value: "0", label: "普通" }], //服务等级
      typeList: [{workOrderName:'普通工单', active:true},{workOrderName:'MSLA工单', active:false},{workOrderName:'计划工程服务', active:false}],
      activeName: "普通工单",
      eptList: [],
      mainminheight: `height:${document.documentElement.clientHeight - 170}px`,
      serviceNumber: [],
      deviceTypeCode: [],
      queryParams: {
        workOrderNumber: "",
        companyId: "",
        serviceNumber: "",
        distributorCompanyName: "",
        workOrderPesFlag: "",
        servicePackage: "",
        workshopId: "",
        deviceTypeCode: "",
        deviceCode: "",
        lubricationPointTypeCode: "",
        mslaOilCode: "",
        mslaManufacturer: "",
        fileName:'',
        createStartTime:'',
        createEndTime:''
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      pagenation: {
        current: 1,
        size: 30
      },
      reportLevelData: [{ value: "1", label: "PES" }, { value: "2", label: "DPES" }, { value: "0", label: "普通" }],
      newsTableData: [],
      totalNumber: 0, //总条数
      dataRecordTableData: [],
      selectList: [],
      showMoreSearch: false,
      dialogTitle: "",
      loading: false, //是否加载
      downloadFileLoading: false,
      tableHeight: null,
      customFieldlistUnit: [
        {
          fieldName: "fileName",
          visible: 2
        },
        {
          fieldName: "serviceName",
          visible: 1
        },
        {
          fieldName: "fileCreateTime",
          visible: 1
        },
        {
          fieldName: "operation",
          visible: 2
        }
      ],
      customFieldlist: [],
      tableDataHeader: [
        { slot: "selection" },
        { filterType: "input", paramValue: "fileName", changeValue:"",  label: "文件名", prop: "fileName", width: "400", tooltip: true},
        { filterType: "input", paramValue: "createUserName", changeValue:"", label: "创建人", slot: "createUserName", width: "150" },
        { filterType: "dateRange", paramValue: "createTime", changeValue:"", sortTypeVal: "sortDown",  label: "创建时间", prop: "createTime", width: "150" },
        { label: "操作", slot: "operation" }],
      applyDivHeight: document.documentElement.clientHeight - 184,
      selectCustomerList:[],
      showCustomerDialog:false,
      formDivLen:4,
      createUserDetail:{},
      sortMethod: "createTime",
      sortType: false,
      highlight:true
    };
  },
  mounted() {
    this.$_getServiceListAll();
    this.$_queryLPData();
    this.getOilDataList();
    this.getDeviceManuList();
    if(this.userInfo.userType==2){
      this.queryParams.companyId = this.userInfo.companyId
      // this.getCustomerWorkshopList()
    }else{
      this.customerFilter();
    }
    this.getReportManagementData(); //获取报告列表
    this.getEptList();
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 170}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  methods: {
    downloadRowFile(row) {
      const params = {
        url: row.fileUrl
      };
      this.requestMethodGet("/web/file/getFullDownloadUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.location.href = res.data.data;
          this.$gio.downloadServiceReport_serviceReport()
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    selectManufacturer (val) {
      if (val.listItemValueCn == '') {
        val.listItemValueCn = val.listItemValue
      }
      if (val.listItemValue == 'NOT LISTED') {
        let notfileid = {}
        notfileid = this.dataList.find((item) => item.listItemValue == val.listItemValue)
        this.listItemId = notfileid.listItemId
      } else {
        let data1 = this.dataList.find((item) => item.listItemValue == val.listItemValue)
        this.lubAttributes.forEach((item) => {
          if (item.fieldId == val.fieldId) {
            item.listItemValue = data1.listItemValue
            item.listItemValueCn = data1.listItemValueCn
            item.listItemId = data1.listItemId
            item.child = null
          }
        })
      }
    },
    getLubricant: debounce(function(val) {
      this.loadingLubricant = true
      this.getOilDataList(val)
    }, 800),
    getManufacturer: debounce(function(val) {
      this.loadingManufacturer = true
      this.getDeviceManuList(val)
    }, 800),
    getOilDataList (val) {
      let params = {
        fieldTitle: 'Lubricant',
        distinctNameFlag: true,
        itemValue: val,
        size: 1000
      }
      this.requestMethodGet('/weChat/msla/lubricationPoint/queryListItemsByFieldId', params)
        .then((res) => {
          res = res.data
          this.loadingLubricant = false
          if (res.code == 1000) {
              this.lubricantList = res.data.list
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
    },
    getDeviceManuList(val) {
      let params = {
        fieldTitle: 'Manufacturer',
        distinctNameFlag: true,
        itemValue: val,
        size: 1000
      }
      this.requestMethodGet('/weChat/msla/lubricationPoint/queryListItemsByFieldId', params)
        .then((res) => {
          res = res.data
          this.loadingManufacturer = false
          if (res.code == 1000) {
            this.manufacturerList = res.data.list
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch((res) => {})
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
    // 服务类型
    $_getServiceListAll(val) {
      this.typeListData = [];
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", { serviceName: val || "", disabled: true })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.typeListData = res.data;
            this.typeListData = this.formatData(this.typeListData);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
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
    customerFilter(query) {
      let params = {
        companyType: 2,
        size: 300,
        status: 1,
        companyName: query
      };
      this.requestMethodGet("/web/customer/queryCompanyListByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.customerList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleMoreSearch() {
      this.showMoreSearch = !this.showMoreSearch;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        if(document.getElementById("applyDiv")){
          let formDivWidth = (document.getElementById("applyDiv").clientWidth - 314);
          this.formDivLen = Math.trunc( formDivWidth / 275)
        }
        if (document.getElementById("formDiv")) {
          this.formDivHeight = document.getElementById("formDiv").clientHeight;
        }
        let moreSearchHeight = 0
        if(this.showMoreSearch && document.getElementById("formMoreDiv")){
          moreSearchHeight = Number(document.getElementById("formMoreDiv").clientHeight) + 12;
        }
        this.tableHeight = Number(this.applyDivHeight) - Number(this.formDivHeight) - Number(moreSearchHeight);
      }, 200);
    },
    handleClick(item) {
      this.activeName = item.workOrderName
      this.typeList.forEach(it => {
        if (item.workOrderName == it.workOrderName) {
          it.active = true;
        } else {
          it.active = false;
        }
      });
      this.pagenation.current = 1
      this.getReportManagementData()
    },
    // 设备类型
    getEptList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", {filterFlag:true}).then(res => {
        if (res.data.code == 1000) {
          this.eptList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
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
    handleClearSearch() {
      if(this.queryParams.companyId&&this.userInfo.userType<2){
        this.$refs["selectCustomer"].clearSelectCustomer()
      }
      this.selectCustomerList = []
      this.serviceNumber = []
      this.deviceTypeCode = []
      this.sortMethod = "createTime"
      this.sortType = false
      this.queryParams = {
        workOrderNumber:'',
        companyId: "",
        serviceNumber: "",
        distributorCompanyName: "",
        workOrderPesFlag: "",
        servicePackage: "",
        workshopId: "",
        deviceTypeCode: "",
        deviceCode: "",
        lubricationPointTypeCode: "",
        mslaOilCode: "",
        mslaManufacturer: "",
        fileName:'',
        createStartTime:'',
        createEndTime:''
      }
      if(this.userInfo.userType != 2){
        this.workshopList = []
      }
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
        if(item.sortTypeVal){
          if(item.paramValue != "createTime"){
            item.sortTypeVal = 'sortDown'
          }else{
            item.sortTypeVal = 'sortDefault'
          }
        }
      })
      this.pagenation.current = 1;
      this.getReportManagementData();
    },
    // 表格多选
    handleSelectionChange(select) {
      this.selectList = select;
    },
    // 获取报告列表
    getReportManagementData() {
      this.loading = true;
      let orderBy = this.sortMethod;
      let descFlag = !this.sortType;
      let params = {...this.pagenation, orderBy, descFlag }
      if(this.activeName=='MSLA工单') this.queryParams.serviceNumber = ""
      if(this.activeName=='普通工单') this.queryParams.workOrderPesFlag = ""
      if(this.activeName=='普通工单'||this.activeName=='MSLA工单') this.queryParams.servicePackage = ""
      if(this.activeName=='普通工单'||this.activeName=='计划工程服务') {
        this.queryParams.mslaOilCode = ""
        this.queryParams.mslaManufacturer = ""
      }
      if (this.serviceNumber.length>0) {
          let serviceNumbers = []
          this.serviceNumber.forEach(item=>{
            serviceNumbers.push(item[item.length - 1])
          })
          this.queryParams.serviceNumber = serviceNumbers.join(",")
        } else {
          this.queryParams.serviceNumber = "";
        }
        if (this.deviceTypeCode.length>0) {
          let deviceTypes = []
          this.deviceTypeCode.forEach(item=>{
            deviceTypes.push(item[item.length - 1])
          })
          this.queryParams.deviceTypeCode = deviceTypes.join(",")
        } else {
          this.queryParams.deviceTypeCode = "";
        }
      // flagFilter：无筛选条件：0否1是
      if(this.checkObjEmpty(this.queryParams)){
        params.flagFilter = 1
      }else{
        Object.assign(params, this.queryParams)
        params.flagFilter = 0
      }
      params.reportType = this.activeName=='普通工单'?1:this.activeName=='MSLA工单'?2:3
      params.distributorCompanyNumber = this.userInfo.companyNumber
      params.menuCode = 'ReportManagement'
      this.newsTableData = []
      this.totalNumber = 0
      this.detailObj = {}
      this.requestMethodGet("/weChat/workOrder/handle/queryWorkOrderReportByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.newsTableData = res.data.list;
            this.getReportDetail(this.newsTableData[0])
            this.totalNumber = res.data.totalCount;
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
    // 获取报告详情
    getReportDetail(row) {
      this.requestMethodGet("/weChat/workOrder/handle/getWorkOrderReportDetail", {id: row.id, workOrderReportType: this.activeName=='普通工单'?'1':this.activeName=='MSLA工单'?'2':'3'})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.detailObj = res.data
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
    handleRowClick(row, column){
      this.detailObj = {}
      this.getReportDetail(row)
    },
    checkObjEmpty(obj) {
      for (let key in obj) {
          if (obj[key]) {
              return false;
          }
      }
      return true;
    },
    // 下载
    handleDownload() {
      if (this.selectList.length == 1) {
        this.downloadFile();
        return;
      }
      let urlList = this.selectList.map(item => {
        return {
          fileUrl: item.fileUrl
        };
      });
      let paramObj = {
        fileDtos: urlList,
        responseTypeBlob: true
      }
      this.requestMethodPost("/pes/downLoadPesZipFile", paramObj).then(res => {
        let data = res.data;
          let fileReader = new FileReader();
          let that = this;
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
                type: "application/zip"
              });
              const objectUrl = URL.createObjectURL(blob);
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", `服务报告下载${that.moment(new Date()).format("YYYYMMDDHH")}`);
              document.body.appendChild(link);
              link.click();
              that.$message({
                message: "下载成功",
                type: "success"
              });
            }
          };
          fileReader.readAsText(data);
        })
        .catch(res => {});
    },
    downloadFile() {
      let param = {
        url: this.selectList[0].fileUrl
      };
      this.downloadFileLoading = true;
      this.requestMethodGet("/web/file/getFullDownloadUrl", param)
        .then(res => {
          res = res.data;
          this.downloadFileLoading = false;
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
          this.downloadFileLoading = false;
        });
    },
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
      this.getReportManagementData(); //获取订单管理列表
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.getReportManagementData(); //获取订单管理列表
    },
    handleLook(row) {
      if (row.fileName && row.fileName.toLowerCase().includes(".pdf")) {
        this.requestMethodGet("/web/file/getFullUrl", {url: encodeURI(row.fileUrl)}).then(res => {
          if (res.data.code == 1000) {
           window.open(res.data.data);
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        });
        this.$gio.previewServiceReport_serviceReport({
          entrance: "服务报告列表"
        });
      }
    },
    // 排序
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal
      this.sortMethod = obj.paramValue
      if(sortVal=='sortUp'){
        this.sortType = true
      }else if(sortVal=='sortDown'){
        this.sortType = false
      }
      this.tableDataHeader.forEach(item=>{
        if(item.sortTypeVal){
          if(item.paramValue&&(item.paramValue == this.sortMethod)){
            item.sortTypeVal = sortVal
          }else if(item.paramValue&&(item.paramValue != this.sortMethod)){
            item.sortTypeVal = 'sortDefault'
          }
        }
      })
      this.pagenation.current = 1;
      this.getReportManagementData(); //获取订单管理列表
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue=="createTime"){
        if(searchVal){
          this.queryParams.createStartTime = searchVal[0]
          this.queryParams.createEndTime = searchVal[1]
        }else{
          this.queryParams.createStartTime = ''
          this.queryParams.createEndTime = ''
        }
      }else{
        this.queryParams[obj.paramValue] = searchVal
      }
      this.pagenation.current = 1;
      this.getReportManagementData(); //获取订单管理列表
    },
    showSelectCustomer() {
      this.showCustomerDialog = true
    },
    handleClearCustomer() {
      this.selectCustomerList = []
      this.queryParams.companyId = ""
      this.queryParams.workshopId = ""
      this.workshopList = []
      this.pagenation.current = 1;
      this.getReportManagementData(); 
      this.$refs["selectCustomer"].clearSelectCustomer()
    },
    handleSubmitCustomer(e){
      this.selectCustomerList = e
      let selectList = this.selectCustomerList.map(item=>{
        return item.companyId
      })
      this.queryParams.companyId = selectList.join(",")
      // this.getCustomerWorkshopList()
      this.pagenation.current = 1;
      this.getReportManagementData(); 
      this.showCustomerDialog = false
    },
    handleCloseCustomer(){
      this.showCustomerDialog = false
    },
    // 查询客户下的车间
    getCustomerWorkshopList() {
      this.workshopList = []
      this.queryParams.workshopId = ""
      if(this.userInfo.userType != 2){
        if(this.queryParams.companyId.toString().includes(',')){
          return;
        }
      }
      if(!this.queryParams.companyId) return
      const params = {
        companyId: this.queryParams.companyId,
        noWorkShopFlag: true,
        size: 1000
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params)
        .then(res => {
          if (res.data.code == 1000) {
            this.workshopList = res.data.data.list;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.$set(this.createUserDetail,'headUrl',res.data.data)
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取客户联系人详情
    getUserDetail(val, index, type) {
      if (val) {
        this.createUserDetail = {};
        let param = {
          userId: val
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.$refs[`popovers-${index}`].doShow();
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
    // 查看创建人详情
    createUserNameDetail(scope) {
      this.createUserDetail = {};
      if (scope.row.createUserId) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        this.getUserDetail(scope.row.createUserId, scope.$index, "");
      }
    },
    visibleChange(val) {
      if (val && this.userInfo.userType < 2) {
        if (!this.queryParams.companyId) {
          this.$message({
            type: "warning",
            message: "请选择所属客户"
          });
        }else{
          if(this.queryParams.companyId.toString().includes(',')){
            this.$message({
              type: "warning",
              message: "请选择一个客户后重新尝试"
            });
          }
        }
      }
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
::-webkit-scrollbar {
  display: none;
}
.apply-order-component {
  padding:0 20px;
  height: 100%;
  position: relative;
  &-serach-item {
    label {
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
  /deep/.el-select {.el-select__caret:first-child::before {content: "\e6e1";}.is-focus {.el-select__caret:first-child {transform: rotateZ(0deg);}}
  }
  .el-popover-detail {
    /deep/ .el-button {
      padding: 0px !important;
    }
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #e9e9e9;
    background: #dd0000;
    color: #fff;
  }
  /deep/ .el-tabs--card > .el-tabs__header {
    border-bottom: none;
    margin: 0 0 20px;
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
    height: 32px;
    line-height: 32px;
    overflow: hidden;
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
<style scoped lang="less">
@import "../../assets/css/customTable.less";
/deep/ .apply-order-component .closeWorkOrder {
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
.marBottom{
  margin-bottom: 12px;
}
</style>
