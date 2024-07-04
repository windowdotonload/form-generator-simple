<template>
    <div style="position:relative">
      <div class="equipment-lubr-Table" :style="mainminheight" id="equipmentLubrDiv">
        <div class="toolbox-con flexBetween">
          <!-- 查询条件 -->
          <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm" >
            <el-form-item label="所属客户"  class="form-item-outline" v-if="$userInfo.userType != 2">
            <div v-if="$userInfo.userType != 2" class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
            <el-form-item class="form-item-outline" label="设备分组">
                <el-cascader
                :style="{width:(queryParams.groupIdList.length==0)?'180px':'260px'}"
                :options="groupList"
                :key="groupKey"
                :props="{ label: 'groupName', value: 'id', multiple:true }"
                collapse-tags
                size="small"
                v-model="queryParams.groupIdList"
                placeholder="请选择"
                no-data-text="暂无分组"
                @visible-change="groupVisibleChange"
                filterable
                clearable
                >
                </el-cascader>
            </el-form-item>
            <el-form-item class="form-item-outline" label="在用油品">
                <el-select size="small" :style="{width:(queryParams.currentOilCodeList.length==0)?'180px':'300px'}" v-model="queryParams.currentOilCodeList" placeholder="请选择" clearable filterable multiple collapse-tags remote :remote-method="getOilList" :loading="loadingRemote">
                  <el-option v-for="item in oilList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="danger" plain @click="handleSearchTableData">搜索</el-button>
              <el-button size="small" @click="handleClearSearch">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="tool-con">
            <el-button type="danger" plain @click="handleDown" size="small">批量导出</el-button>
            <el-button type="danger" plain @click="addLum"  size="small">新建润滑点</el-button>
            <custom-field @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="lubepoint" style="display:inline-block;margin-left:10px;"></custom-field>
          </div>
        </div>
        <!-- 表格 -->
        <custom-table
          class="table"
          :tableHeader="tableDataHeader"
          :tableData="deviceLubesData"
          :tableHeight="tableHeight + ''"
          :loading="loading"
          @selectionChange="handleSelectionChange"
          @changeSearch="tableTitleSearch"
          @changeSortTable="changeSortTable"
        >
            <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" :resizable="false" align="center" width="55"></el-table-column>
            <template v-slot:deviceName="slotProps">
                <el-table-column
                  fixed
                  label="设备名称"
                  :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                  :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                  show-overflow-tooltip
                >
                  <template slot="header">
                    <column-header 
                      title="设备名称"
                      :filterType="slotProps.slotData.filterType"
                      :paramValue="slotProps.slotData.paramValue"
                      :changeValueInput="slotProps.slotData.changeValueInput"
                      :changeValueSelect="slotProps.slotData.changeValueSelect"
                      :selectOptions="slotProps.slotData.selectOptions"
                      @chSubmit="tableTitleSearch"/>
                  </template>
                  <template slot-scope="scope">
                    <div style="display: flex; align-items: center">
                      <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.deviceName || "-" }}</span>
                      <el-tag v-if="!scope.row.deviceActiveStatus" class="unActiveTag">非活跃</el-tag>
                    </div>
                  </template>
                </el-table-column>
              </template>
        <template v-slot:oilChangeMethod="slotProps">
                <el-table-column
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    label="定期或按质换油"
                    show-overflow-tooltip
                >
                  <template slot="header" >
                    <column-header 
                    title="定期或按质换油"
                    :filterType="slotProps.slotData.filterType"
                    :paramValue="slotProps.slotData.paramValue"
                    :changeValue="slotProps.slotData.changeValue"
                    :selectOptions="slotProps.slotData.selectOptions"
                    :showTips="slotProps.slotData.showTips"
                    @chSubmit="tableTitleSearch"/>
                    </template>
                    <template slot-scope="scope">
                    <span>{{ scope.row.oilChangeMethod == '2' ? '按质' : scope.row.oilChangeMethod == '1' ? '定期' : '暂无'}}</span>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:workshopName="slotProps">
              <el-table-column
                :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                label="所属车间"
                show-overflow-tooltip
              >
                <template slot="header" v-if="!queryParams.companyId">
                  <span>所属车间</span>
                </template>
                <template slot="header" v-if="queryParams.companyId">
                  <column-header 
                  title="所属车间"
                  :filterType="slotProps.slotData.filterType"
                  :paramValue="slotProps.slotData.paramValue"
                  :changeValue="slotProps.slotData.changeValue"
                  :selectOptions="slotProps.slotData.selectOptions"
                  :showTips="slotProps.slotData.showTips"
                  @chSubmit="tableTitleSearch"/>
                </template>
                <template slot-scope="scope">
                  <span>{{ scope.row.workshopName || '-'}}</span>
                </template>
              </el-table-column>
            </template>
            <template v-slot:lubricationMethod="slotProps">
                <el-table-column
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    label="润滑方式"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                    <span>{{ scope.row.lubricationMethod || '-'}}</span>
                    </template>
                </el-table-column>
            </template>
            <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
            <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="100" align="center">
                <i class="el-icon-share"></i>
                <template slot-scope="scope">
                    <el-link @click="handleLook(scope.row)" style="margin-right: 10px; color: #001450">查看</el-link>
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
          :page-sizes="[5, 10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          class="listOptimizePage"
        ></el-pagination>
        <customerListCom class="customerList" 
        ref="selectCustomer" 
        :selectCustomerList="selectCustomerList" 
        v-if="showCustomerDialog" 
        :showCustomerDialog="showCustomerDialog" 
        @handleSubmitCustomer="handleSubmitCustomer" 
        @handleCloseCustomer="handleCloseCustomer"></customerListCom>
        <!-- 创建设备 -->
        <CreateDevice
          v-if="addDeviceDialog"
          :deviceTypeDialog="deviceTypeDialog"
          :addDeviceDialog="addDeviceDialog"
          v-on:addOrEditDevice="addOrEditDevice"
          v-on:addOrEditDeviceAndLumpoint="addOrEditDeviceAndLumpoint"
          v-on:closeDialogAddDevice="closeDialogAddDevice"
        />
      </div>
    </div>
  </template>
  <script>
  import CreateDevice from "./components/CreateDevice.vue";
  import customField from "../tableComponents/customField.vue";
  import customTable from "../tableComponents/customTable";
  import columnHeader from "../tableComponents/headerComponent";
  import commonJS from "../tableComponents/tableCommon.js";
  export default {
    name: "EquipmentLubrTable",
    mixins: [commonJS],
    components: {
        CreateDevice,
        "custom-field": customField,
        "custom-table": customTable,
        "column-header":columnHeader,
        customerListCom: ()=>import("../tableComponents/customerList")
    },
    data() {
      return {
        addDeviceDialog:false,// 新建设备弹框
        deviceTypeDialog:'',
        applyUserDetail: {},
        dialogFormVisible: false,
        showCustomerDialog:false,
        selectDeviceVisiable: false,
        applyDialogFlag: false,
        lookProcessVisiable: false,
        mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
        queryParams: {
          orderBy: '',
          descFlag: true,
          deviceName: "", // 设备名称
          deviceActiveStatus: "", // 活跃状态
          companyNumber: "",
          groupIdList: [],
          companyName: "",
          workshopId: "",
          deviceCode: "",
          devicePosition: "",
          deviceModel: "",
          manufacturer: "",
          companyId:'',
          oilBoxCapacityName:'',
          oilChangePeriodName:'',
          deviceTypeList:[],
          currentOilCodeList:[],
          oilChangeMethod:'',
          lastOilAddDate:[],
          recommendOilName:[],
          lubricationPointTypeName:[],
          lubricationPointTypeList:[]
        },
        oilList:[],
        queryDeviceParams: {
          companyNumber: "", // 客户编码
          deviceName: "" // 状态
        },
        // 设备分组
        groupList: [],
        userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
        ruleForm: {
          email: ""
        },
        rules: {
          email: [{ required: true, message: "请输入邮箱地址", trigger: "blur" }, { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }]
        },
        deviceList: [],
        customerList: [],
        companyId: 0,
        customerCompanyName: "",
        currentDevicePage: 1,
        selectionDevice: [],
        pagenation: {
          current: 1,
          size: 30
        },
        deviceLubesData: [],
        deviceLubesProcessList: [],
        dataList:[],
        totalNumber: 0, // 总条数
        deviceTotalCount: 0, // 设备总条数
        dataRecordTableData: [],
        selectList: [],
        dialogTitle: "",
        loading: false, // 是否加载
        loadingLum: false,
        emailNameInfo: {},
        customFieldlistUnit: [
          {
            fieldName: "deviceName",
            visible: 2
          },
          {
            fieldName: "deviceTypeName",
            visible: 2
          },
          {
            fieldName: "customerName",
            visible: 2
          },
          {
            fieldName: "lubricationPointName",
            visible: 2
          },
          {
            fieldName: "workshopName",
            visible: 1
          },
          {
            fieldName: "manufacturer",
            visible: 1
          },
          {
            fieldName: "deviceModel",
            visible: 1
          },
          {
            fieldName: "deviceCode",
            visible: 1
          },
          {
            fieldName: "devicePosition",
            visible: 1
          },
          {
            fieldName: "lubricationPointTypeName",
            visible: 1
          },
          {
            fieldName: "lubricationMethod",
            visible: 1
          },
          {
            fieldName: "oilBrandCodeName",
            visible: 1
          },
          {
            fieldName: "currentOilCodeName",
            visible: 1
          },
          {
            fieldName: "oilBoxCapacityName",
            visible: 1
          },
          {
            fieldName: "oilAddPeriodName",
            visible: 1
          },
          {
            fieldName: "everyTimeOilAddQuantityName",
            visible: 1
          },
          {
            fieldName: "preMonthOilAddQuantityName",
            visible: 1
          },
          {
            fieldName: "lastOilAddDate",
            visible: 1
          },
          {
            fieldName: "lastOilChangeDate",
            visible: 1
          },
          {
            fieldName: "recommendOilName",
            visible: 1
          },
          {
            fieldName: "lubricationPointManufacturer",
            visible: 1
          },
          {
            fieldName: "oilChangePeriodName",
            visible: 1
          },
          {
            fieldName: "oilChangeMethod",
            visible: 1
          },
          {
            fieldName: "lubricationPointDescHistory",
            visible: 1
          },
          {
            fieldName: "createTime",
            visible: 1
          },
          {
            fieldName: "updateTime",
            visible: 1
          },
          {
            fieldName:'operation',
            visible: 2
          }
        ],
        customFieldlist: [],
        tableHeight: null,
        tableDataHeaderInit: {
            selection: { slot: "selection" },
            deviceName: { filterType: "inputAndselection", changeValue:"", paramValue: "deviceName", selectOptions: [{ code: 1, name: "活跃" },{ code: 0, name: "不活跃" }], changeValueInput:"", changeValueSelect:"", label: "设备名称", slot: "deviceName", width: "200" },
            deviceTypeName: { selectMultiple: true, filterType: "cascaderDevice", paramValue: "deviceTypeList", selectOptions: [], changeValue:"", label: "设备类型", prop: "deviceTypeName", width: "120", tooltip: true, fixed: "left" },
            customerName: {  prop: "customerName", label: "所属客户", fixed: "left", width: "180", tooltip: true },
            lubricationPointName: { filterType: "input",paramValue: "lubricationPointName",selectOptions: [],  label: "润滑点设备名称", prop: "lubricationPointName",fixed: "left",  width: "250" , tooltip: true},
            workshopName: { showTips: false, filterType: "selection", paramValue: "workshopId", changeValue:"", selectOptions: [], label: "所属车间", slot: "workshopName", width: "120", tooltip: true },
            manufacturer: { filterType: "input", paramValue: "manufacturer", changeValue: "",  prop: "manufacturer", label: "制造商", width: "180" , tooltip: true},
            deviceModel: { filterType: "input", paramValue: "deviceModel", changeValue: "",  prop: "deviceModel", label: "设备型号", width: "180", tooltip: true },
            deviceCode: { filterType: "input", paramValue: "deviceCode", changeValue: "",  prop: "deviceCode", label: "设备编码", width: "180", tooltip: true },
            devicePosition: { filterType: "input", paramValue: "devicePosition", changeValue: "",  prop: "devicePosition", label: "设备位置", width: "180" , tooltip: true},
            lubricationPointTypeName: { filterType: "selection",selectMultiple: true, paramValue: "lubricationPointTypeName", changeValue: "",  prop: "lubricationPointTypeName", label: "润滑点设备类型", width: "180", tooltip: true },
            lubricationMethod: {   prop: "lubricationMethod", label: "润滑方式", width: "180" , tooltip: true},
            oilBrandCodeName: {  prop: "oilBrandCodeName", label: "在用油品牌", width: "180" , tooltip: true},
            currentOilCodeName: {  prop: "currentOilCodeName", label: "在用油名称", width: "180" , tooltip: true},
            oilBoxCapacityName: { filterType: "input", paramValue: "oilBoxCapacityName", changeValue: "",  prop: "oilBoxCapacityName", label: "油箱容量", width: "180" , tooltip: true},
            oilAddPeriodName: { filterType: "input", paramValue: "oilAddPeriodName", changeValue: "",  prop: "oilAddPeriodName", label: "加油周期/加脂周期", width: "180" , tooltip: true},
            everyTimeOilAddQuantityName: { filterType: "input", paramValue: "everyTimeOilAddQuantityName", changeValue: "",  prop: "everyTimeOilAddQuantityName", label: "每次加油量/每次加脂量", width: "180" , tooltip: true},
            preMonthOilAddQuantityName: { filterType: "input", paramValue: "preMonthOilAddQuantityName", changeValue: "",  prop: "preMonthOilAddQuantityName", label: "每月润滑剂添加量", width: "180" , tooltip: true},
            lastOilAddDate: { filterType: "dateRange", paramValue: "lastOilAddDate", changeValue: "",  prop: "lastOilAddDate", label: "上次加油日期/上次加脂日期", width: "230", tooltip: true },
            oilChangePeriodName: { filterType: "input", paramValue: "oilChangePeriodName", changeValue: "",  prop: "oilChangePeriodName", label: "换油周期", width: "180", tooltip: true },
            lastOilChangeDate: {  paramValue: "lastOilChangeDate", changeValue: "",  prop: "lastOilChangeDate", label: "上次换油日期", sortTypeVal: "sortDefault",width: "180", tooltip: true },
            recommendOilName: { selectMultiple: true, filterType: "selection", paramValue: "recommendOilName", changeValue: "",  prop: "recommendOilName",selectOptions: [],  label: "设备制造商推荐油品", width: "180", tooltip: true },
            lubricationPointManufacturer: { filterType: "input", paramValue: "lubricationPointManufacturer", changeValue: "",  prop: "lubricationPointManufacturer", label: "润滑点设备制造商名称", width: "180", tooltip: true },
            oilChangeMethod: { selectMultiple: true, filterType: "selection", paramValue: "oilChangeMethod", changeValue: "",slot: "oilChangeMethod",  prop: "oilChangeMethod",selectOptions: [{ code: 1, name: "定期" },{ code: 2, name: "按质" }], label: "定期或按质换油", width: "180" , tooltip: true},
            lubricationPointDescHistory: { prop: "lubricationPointDescHistory", label: "描述", width: "180" },
            createTime: {  prop: "createTime", label: "创建时间", width: "180" },
            updateTime: {   prop: "updateTime", label: "最后更新时间", width: "180" },
            operation: { slot: "operation", label: "操作" }
        },
        tableDataHeader: [],
        selectCustomerList: []
      };
    },
    beforeRouteLeave(to, from, next) {
      this.queryParams.current = this.pagenation.current;
      this.queryParams.size = this.pagenation.size;
      sessionStorage.setItem("queryParams", JSON.stringify(this.queryParams));
      next();
    },
    beforeRouteEnter(to, from, next) {
      if (from.path == "/EquipmentProfile/EditEquipmentProfile" ) {
        to.params.isSaveQuery = true;
      }
      next();
    },
    created() {
    },
    mounted() {
      if (this.$route.params.isSaveQuery) {
        this.queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
        if (this.queryParams.companyId) this.selectCustomerList = this.queryParams.companyId.split(",");
        this.pagenation.current = this.queryParams.current;
        this.pagenation.size = this.queryParams.size;
      }
      this.getCustomerList("");
      this.getOilList('');
      this.getDeviceLubesList();
      this.getCustomFieldList(); //获取自定义字段列表
      this.handleTableHeight();
      this.getEptList();
      this.getLupData()
      window.addEventListener("resize", () => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
        this.$nextTick(() => {
          this.handleTableHeight();
        });
      });
    },
    methods: {
    closeDialogAddDevice() {
      this.addDeviceDialog = false
    }, 
    addOrEditDevice() {
      this.addDeviceDialog = false
      this.getDeviceLubesList();
    },  
    addOrEditDeviceAndLumpoint() {
      this.addDeviceDialog = false
      this.getDeviceLubesList();
    },
      // 新建润滑点
      addLum() {
        this.deviceTypeDialog='addDeviceAndLubpoint'
        this.addDeviceDialog  = true
      },
      handleDown() {
        console.log(this.selectList)
        if (this.selectList.length > 0) {
          this.uploadData()
        } else {
          if (this.totalNumber > 10000) {
            this.$confirm("超过导出上限（1万条），请尝试以下方法分批导出：<br/> 1、选择 1 条或 N 条数据导出 <br/> 2、筛选特定属性的数据后导出", "批量导出设备", {
              confirmButtonText: "取消",
              showCancelButton: false,
              dangerouslyUseHTMLString: true
              // type: "error"
            })
              .then(() => {})
              .catch(() => {});
          } else if (this.totalNumber == 0) {
            this.$message({
              message: "暂无内容导出",
              type: "error"
            });
          } else {
            this.uploadData()

          }
        }
      },
      uploadData(){
        const loading = this.$loading({
          lock: true,
          text: "数据下载中，请稍后",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let queryParams = _.cloneDeep(this.queryParams)
        let deviceTypeList = []
        queryParams.lubePointIds = this.selectList
        if(queryParams.deviceTypeList.length>0){
          queryParams.deviceTypeList.forEach(item=>{
            deviceTypeList.push(item[item.length-1])
          })
        }
        if(queryParams.oilChangeMethod.length>0){
          queryParams.oilChangeMethod = queryParams.oilChangeMethod.toString()
        } 
        if(queryParams.lastOilAddDate.length>0){
          queryParams.lastOilAddDateStart = queryParams.lastOilAddDate[0]
          queryParams.lastOilAddDateEnd = queryParams.lastOilAddDate[1]
          
        } else {
          queryParams.lastOilAddDateStart = ''
          queryParams.lastOilAddDateEnd = ''
        }
        delete queryParams.lastOilAddDate
        let groupIdList = [];
        if (queryParams.groupIdList.length) {
          queryParams.groupIdList.forEach(item=>{
            groupIdList.push(item[1])
          })
        }  
        if (queryParams.recommendOilName.length) {
          queryParams.recommendOilCodeList = queryParams.recommendOilName
          delete queryParams.recommendOilName
        } 
        if (queryParams.lubricationPointTypeName.length) {
          queryParams.lubricationPointTypeList = queryParams.lubricationPointTypeName
          delete queryParams.lubricationPointTypeName
        }  else {
          queryParams.lubricationPointTypeList = []
        }
        queryParams.lubricationPointName = queryParams.lubricationPointName
        // 每月润滑剂添加量
        if (queryParams.preMonthOilAddQuantityName) {
          queryParams.preMonthOilAddQuantitySearch = queryParams.preMonthOilAddQuantityName
          delete queryParams.preMonthOilAddQuantityName
        } 
        // 加油周期/加脂周期
        if (queryParams.oilAddPeriodName) { 
          let str = queryParams.oilAddPeriodName
          str = str.replace('天','D')
          str = str.replace('月','M')
          str = str.replace('年','Y')
          str = str.replace('小时','H')
          queryParams.oilAddPeriodSearch = str
          delete queryParams.oilAddPeriodName
        } 
        //所属客户
        if (queryParams.companyId) {
          queryParams.companyIds = queryParams.companyId
          delete queryParams.companyId
        }  else {
          queryParams.companyIds = ''
        }
        // 油箱容量
        if (queryParams.oilBoxCapacityName) {
          queryParams.oilBoxSearch = queryParams.oilBoxCapacityName
          delete queryParams.oilBoxCapacityName
        } 
        // 换油周期
        if (queryParams.oilChangePeriodName) {
          let str = queryParams.oilChangePeriodName
          str = str.replace('天','D')
          str = str.replace('月','M')
          str = str.replace('年','Y')
          str = str.replace('小时','H')
          queryParams.oilChangePeriodSearch = str
          delete queryParams.oilChangePeriodName
        } 
        // 每次加油量/加脂量
        if (queryParams.everyTimeOilAddQuantityName) {
          queryParams.everyTimeOilAddQuantitySearch = queryParams.everyTimeOilAddQuantityName
          delete queryParams.everyTimeOilAddQuantityName
        } 
        let params = { ...queryParams};
        params.groupIdList = groupIdList;
        params.deviceTypeList = deviceTypeList;
        params.companyName = "";
        params.responseTypeBlob=true


        this.requestMethodPost("/lubePoint/exportAllLubePointExcel", params).then(res => {
        loading.close();
        let data = res.data;
        
        
        let fileReader = new FileReader();
        let that = this;
        fileReader.onload = function () {
        try {
            let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
            if (jsonData.code) {
            that.$message({
                message: jsonData.msg,
                type: "error",
            });
            return;
            }
        } catch (err) {
          

            // 解析成对象失败，说明是正常的文件流
            const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
            });
            let fileName = decodeURI(res.headers['content-disposition'].split("filename*=utf-8''")[1])
            const text = blob.text(); 
            const objectUrl = URL.createObjectURL(blob);
            // window.location.href = objectUrl
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = objectUrl;
            link.setAttribute("download", fileName);
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
      // 表格多选事件
      handleSelectionChange(select) {
        this.selectionRow = select;
        this.selectList = [];
        select.forEach(item => {
          this.selectList.push(item.lubricationPointId);
        });
      },
       // 设备类型
        getEptList() {
          this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", {filterFlag:true}).then(res => {
            if (res.data.code == 1000) {
              this.eptList = res.data.data;
              let index = this.tableDataHeader.findIndex(item=>item.paramValue == "deviceTypeList")
              if(index!=-1){
                this.tableDataHeader[index].selectOptions = this.eptList
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        },
        // 润滑点设备类型
        getLupData(){
          let params = {
            size:200
          }
          this.requestMethodGet("/web/config/lubricationPoint/getLubricationPointTypeParentChildrenList", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                if (res.data && res.data.list.length > 0) {
                  this.dataList = res.data.list
                  let index = this.tableDataHeader.findIndex(item=>item.paramValue == "lubricationPointTypeName")
                  if(index!=-1){
                    this.tableDataHeader[index].selectOptions = this.dataList
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
        getOilList(val) {
            this.loadingRemote = true
            this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, size:200, current:1})
            .then(res => {
            res = res.data;
            this.loadingRemote = false
            if (res.code == 1000) {
                this.oilList = res.data.list;
                let index = this.tableDataHeader.findIndex(item=>item.paramValue == "recommendOilName")
                if(index!=-1){
                  this.tableDataHeader[index].selectOptions = this.oilList
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
        // 获取分组树
        getGroupTree() {
            // 美孚/经销商选择客户,客户取自己公司ID
            if(this.queryParams.companyId.toString().includes(',')){
              return;
            }
            let companyId = this.userInfo.userType != 2 ?  this.queryParams.companyId : this.userInfo.companyId;
            if (!companyId) {
                return;
            }
            const params = {
                companyId: companyId
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
        // 分组面板展示
        groupVisibleChange(val) {
        if (val && this.userInfo.userType < 2) {
            if (_.isEmpty(this.queryParams.companyId)) {
            this.$message({
                type: "warning",
                message: "请选择工业客户"
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
        // 清空所属客户
        clearCustomer(val) {
            if (!val) {
                this.customerFilter("");
                this.groupList = [];
                this.queryParams.groupIdList = [];
                this.queryParams.workshopId = "";
                this.workShopSearchList = [];
                this.workshopList = [];
                ++this.groupKey;
                this.handleSearchTableData();
            }
            },
            // 所属客户搜索
    async customerFilter(val) {
      if(this.$userInfo.userType == 2) return
      let params = {
        companyType: 2,
        size: 300,
        status: 1,
        accountName: val
      };
      await this.requestMethodPost("/web/customer/filterAccount", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.customerSearchList = res.data.list;
            this.getGroupTree();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 清空所属客户
    clearCustomer(val) {
      if (!val) {
        this.customerFilter("");
        this.groupList = [];
        this.queryParams.groupIdList = [];
        this.queryParams.workshopId = "";
        this.workShopSearchList = [];
        this.workshopList = [];
        ++this.groupKey;
        this.handleSearchTableData();
      }
    },
    // 所属客户
    customerChange(val) {
      this.queryParams.workshopId = "";
      this.getGroupTree();
      this.handleSearchTableData();
    },
    handleSearchCustomerChange(val) {
      if (val) {
        const selectCompanyId = this.customerSearchList.filter(item => {
          return item.companyNumber == val;
        })[0].companyId;
        this.getWorkShopList(selectCompanyId);
        this.getGroupTree();
        this.handleSearchTableData();
      } else {
        this.selectCompanyName = "";
        ++this.groupKey;
        this.workshopList = [];
        this.groupList = [];
      }
    },
    // 所属客户 change 事件
    handleChangeCustomer(val) {
      this.fileForm.workshopId = "";
      if (val) {
        const selectCompanyId = this.customerList.filter(item => {
          return item.companyNumber == val;
        })[0].companyId;
        this.getWorkShopList(selectCompanyId);
      } else {
        this.selectCompanyName = "";
        this.workshopList = [];
        this.$_queryCustomerData();
      }
    },
      handleCloseCustomer() {
        this.showCustomerDialog = false;
      },
      handleClearCustomer() {
        this.selectCustomerList = [];
        this.queryParams.companyId = "";
        this.getDeviceLubesList();
        this.groupList = [];
        ++this.groupKey;
        this.$refs["selectCustomer"].clearSelectCustomer();
      },
      tableTitleSearch(obj) {
        this.tableDataHeader.forEach(item=>{
          if(obj.paramValue==item.paramValue){
            if(obj.changeType){
              // 表头有搜索框和下拉框，单独处理
              if(obj.changeType=='input'){
                item.changeValueInput = obj.changeValueInput
              }else if(obj.changeType=='selection'){
                item.changeValueSelect = obj.changeValueSelect
              }
            }else{
              item.changeValue = (obj.changeValue === 0 || obj.changeValue === false) ? obj.changeValue : obj.changeValue || "";
            }
          }
        })
        if(obj.changeType){
          // 表头有搜索框和下拉框，单独处理
          if(obj.changeType=='input'){
            this.queryParams.deviceName = obj.changeValueInput
          }else if(obj.changeType=='selection'){
            this.queryParams.deviceActiveStatus = obj.changeValueSelect
          }
        }else if(obj.paramValue == 'deviceDataIntegrityStatus'){
          this.queryParams[obj.paramValue] = obj.changeValue.toString()
        }else{
          this.queryParams[obj.paramValue] = obj.changeValue
        }
        this.getDeviceLubesList();
      },
      changeSortTable(obj) {
        let sortVal = obj.sortTypeVal;
        this.queryParams.orderBy = obj.paramValue;
        if (sortVal == "sortUp") {
          this.queryParams.descFlag = false;
        } else if (sortVal == "sortDown") {
          this.queryParams.descFlag = true;
        }
        this.pagenation.current = 1;
        this.tableDataHeader.forEach(item => {
          if (item.sortTypeVal && item.paramValue == this.queryParams.orderBy) {
            item.sortTypeVal = sortVal;
          } else if (item.sortTypeVal && item.paramValue != this.queryParams.orderBy) {
            item.sortTypeVal = "sortDefault";
          }
        });
        this.getDeviceLubesList();
      },
      // 重置
    handleClearSearch() {
      console.log(this.queryParams.companyId,this.$refs["selectCustomer"])
      if(this.queryParams.companyId){
        this.selectCustomerList = []
      }
      this.selectCustomerList = []
      for (let key in this.queryParams) {
        this.queryParams[key] = "";
      }
      this.queryParams.deviceTypeList = [];
      this.queryParams.currentOilCodeList = [];
      this.queryParams.orderBy = ""
      this.queryParams.descFlag = true
      this.groupList = [];
      ++this.groupKey;
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
        if(item.sortTypeVal){
          item.sortTypeVal = 'sortDefault'
        }
        if(item.paramValue == "workshopId"){
          item.showTips = false
          item.selectOptions = [];
        }
        if(item.paramValue == "deviceName"){
          item.changeValueInput = ""
          item.changeValueSelect = ""
        }
        if(item.paramValue == "deviceName"){
          item.changeValueInput = ""
          item.changeValueSelect = ""
        }
      })
      this.handleSearchTableData();
    },
      // 所属客户组件
        showSelectCustomer() {
          this.showCustomerDialog = true
        },
        handleSubmitCustomer(e){
            this.selectCustomerList = e
            let selectList = this.selectCustomerList.map(item=>{
                return item.companyId
            })
            this.groupList = [];
            ++this.groupKey;
            this.queryParams.groupIdList = [];
            this.queryParams.workshopId = "";
            this.queryParams.companyId = selectList.join(",")
            this.getCustomerWorkshopList(selectList.join(","))
            this.getGroupTree()
            this.showCustomerDialog = false
        },
        // 根据所属客户获取所属车间下拉框数据
        async getCustomerWorkshopList(companyIds) {
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
                if(item.paramValue == "workshopId"){
                    if(!this.$route.params.isSaveQuery){
                    item.changeValue=""
                    }
                    item.showTips = companyIds.toString().includes(',')?true:false
                    item.selectOptions = workshopList
                }
                })
                this.handleSearchTableData()
            } else {
                this.$message({
                message: res.data.msg,
                type: "warning"
                });
            }
            })
            .catch(res => {});
        },
      // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "lubepoint");
        if (index != -1) {
          let fieldDtoInfos = fieldDtoList[index].fieldDtoInfos;
          customFieldlistUnit = fieldDtoInfos.length == 0 ? this.customFieldlistUnit : fieldDtoInfos;
        } else {
          customFieldlistUnit = this.customFieldlistUnit;
        }
      }
      let customFieldlist = customFieldlistUnit.map(item => {
        console.log(this.tableDataHeaderInit[item.fieldName])
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
        let queryParams = JSON.parse(sessionStorage.getItem("queryParams"))
        if(sessionStorage.getItem("queryParams")){
          this.tableDataHeader.forEach(item=>{
            if(item.paramValue=='deviceName'){
              item.changeValueInput = queryParams.deviceName
              item.changeValueSelect = queryParams.deviceActiveStatus
            }else if(item.paramValue=='deviceTypeList'){
              item.changeValue = queryParams.deviceTypeList.length==0?'':queryParams.deviceTypeList
            }else if(item.paramValue=='devicePosition'){
              item.changeValue = queryParams.devicePosition
            }else if(item.paramValue=='deviceCode'){
              item.changeValue = queryParams.deviceCode
            }else if(item.paramValue=='deviceModel'){
              item.changeValue = queryParams.deviceModel
            }else if(item.paramValue=='manufacturer'){
              item.changeValue = queryParams.manufacturer
            }else if(item.paramValue=='deviceDataIntegrityStatus'){
              let dataIntegrityArr = []
              item.selectOptions.forEach(it=>{
                if(queryParams.deviceDataIntegrityStatus.includes(it.code)) dataIntegrityArr.push(it.code)
              })
              item.changeValue = dataIntegrityArr
            }else if(item.paramValue=='workshopId'){
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
      // 自适应获取table高度
      handleTableHeight() {
        setTimeout(() => {
          let equipmentLubrDiv = 0;
          let searchFormHeight = 0;
          if (document.getElementById("equipmentLubrDiv")) {
            equipmentLubrDiv = document.getElementById("equipmentLubrDiv").clientHeight;
          }
          if (document.getElementById("searchForm")) {
            searchFormHeight = document.getElementById("searchForm").clientHeight;
          }
          this.tableHeight = Number(equipmentLubrDiv) - Number(searchFormHeight) - 40;
        }, 200);
      },
      handleLook(row) {
        console.log(row)
        this.$router.push({
          path: "/EquipmentProfile/EquipmentProfileDetail",
          query: {
            deviceNumber: row.deviceNumber,
            deviceId: row.id,
            lubricationId:row.lubricationPointId,
            resource:'lumpointList'
          }
        });
      },
      // 获取列表
      getDeviceLubesList() {
        this.loading = true;
        let queryParams = _.cloneDeep(this.queryParams)
        let deviceTypeList = []
        if(queryParams.deviceTypeList.length>0){
          queryParams.deviceTypeList.forEach(item=>{
            deviceTypeList.push(item[item.length-1])
          })
        }
        if(queryParams.oilChangeMethod.length>0){
          queryParams.oilChangeMethod = queryParams.oilChangeMethod.toString()
        } 
        if(queryParams.lastOilAddDate.length>0){
          queryParams.lastOilAddDateStart = queryParams.lastOilAddDate[0]
          queryParams.lastOilAddDateEnd = queryParams.lastOilAddDate[1]
        } else {
          queryParams.lastOilAddDateStart = ''
          queryParams.lastOilAddDateEnd = ''
        }
        delete queryParams.lastOilAddDate
        let groupIdList = [];
        if (queryParams.groupIdList.length) {
          queryParams.groupIdList.forEach(item=>{
            groupIdList.push(item[1])
          })
        }  
        if (queryParams.recommendOilName.length) {
          queryParams.recommendOilCodeList = queryParams.recommendOilName
          delete queryParams.recommendOilName
        } 
        if (queryParams.lubricationPointTypeName.length) {
          queryParams.lubricationPointTypeList = queryParams.lubricationPointTypeName
          delete queryParams.lubricationPointTypeName
        }  else{
          queryParams.lubricationPointTypeList = []
        }
        queryParams.lubricationPointName = queryParams.lubricationPointName
        // 每月润滑剂添加量
        if (queryParams.preMonthOilAddQuantityName) {
          queryParams.preMonthOilAddQuantitySearch = queryParams.preMonthOilAddQuantityName
          delete queryParams.preMonthOilAddQuantityName
        } 
        // 加油周期/加脂周期
        if (queryParams.oilAddPeriodName) {
          let str = queryParams.oilAddPeriodName
          str = str.replace('天','D')
          str = str.replace('月','M')
          str = str.replace('年','Y')
          str = str.replace('小时','H')
          queryParams.oilAddPeriodSearch = str
          delete queryParams.oilAddPeriodName
        } 
        // 换油周期
        if (queryParams.oilChangePeriodName) {
          let str = queryParams.oilChangePeriodName
          str = str.replace('天','D')
          str = str.replace('月','M')
          str = str.replace('年','Y')
          str = str.replace('小时','H')
          queryParams.oilChangePeriodSearch = str
          delete queryParams.oilChangePeriodName
        } 
        //所属客户
        queryParams.companyIds = queryParams.companyId
        delete queryParams.companyId
        // 油箱容量
        if (queryParams.oilBoxCapacityName) {
          queryParams.oilBoxSearch = queryParams.oilBoxCapacityName
          delete queryParams.oilBoxCapacityName
        } 
        
        // 每次加油量/加脂量
        if (queryParams.everyTimeOilAddQuantityName) {
          queryParams.everyTimeOilAddQuantitySearch = queryParams.everyTimeOilAddQuantityName
          delete queryParams.everyTimeOilAddQuantityName
        } 
        let params = { ...queryParams, ...this.pagenation, menuCode:'/EquipLubrListCustomer' };
        params.groupIdList = groupIdList;
        params.deviceTypeList = deviceTypeList;
        params.companyName = "";
        this.deviceLubesData = [];
        this.requestMethodPost("/lubePoint/getLubePointList", params)
          .then(res => {
            this.loading = false;
            res = res.data;
            if (res.code == 1000) {
              this.deviceLubesData = res.data.list;
              this.totalNumber = res.data.totalCount;
              console.log(this.deviceLubesData)
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
      // 获取客户列表
      getCustomerList(val) {
        if(this.$userInfo.userType == 2) return;
        let params = {
          size: 3000,
          accountName: val,
          menuCode:'customer'
        };
        this.requestMethodPost("/web/customer/filterAccount", params)
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
      // 根据客户查询设备列表
      queryDeviceByPage(val) {
        if (!this.queryDeviceParams.companyNumber) {
          return;
        }
        this.loadingLum = true;
        let params = {
          customerNumber: this.queryDeviceParams.companyNumber,
          deviceName: this.queryDeviceParams.deviceName,
          current: 1,
          size: 20
        };
        if (val == "scroll") {
          params.current = this.currentDevicePage;
        } else {
          this.deviceList = [];
        }
        this.requestMethodGet("/weChat/device/queryDeviceByPage", params)
          .then(res => {
            this.loadingLum = false;
            res = res.data;
            if (res.code == 1000) {
              this.deviceList = [...this.deviceList, ...res.data.list];
              this.deviceTotalCount = res.data.totalCount;
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {
            this.loadingLum = false;
          });
      },
      getDeviceByPage(val) {
        if (val == "customer") {
          let row = this.customerList.filter(item => {
            return this.queryDeviceParams.companyNumber == item.companyNumber;
          });
          this.companyId = row[0].companyId;
          this.customerCompanyName = row[0].companyName;
          this.selectionDevice = [];
          this.$refs.tableAddLumData.clearSelection();
        }
        if (val == "refresh") {
          this.queryDeviceParams.deviceName = "";
        }
        this.currentDevicePage = 1;
        this.queryDeviceByPage();
      },
      rowKey(row) {
        return row.deviceNumber;
      },
      loadData() {
        if (!this.loadingLum && this.queryDeviceParams.companyNumber && this.deviceList.length < this.deviceTotalCount) {
          ++this.currentDevicePage;
          this.queryDeviceByPage("scroll");
        }
      },
      // 选择设备
      handleSelectChange(selection) {
        this.selectionDevice = selection;
      },
      handleSubmitAddLum() {
        if (!this.queryDeviceParams.companyNumber) {
          this.$message({
            message: "请选择客户",
            type: "warning"
          });
          return;
        }
        if (!this.selectionDevice.length) {
          this.$message({
            message: "请至少选择一台设备",
            type: "warning"
          });
          return;
        }
        let deviceList = this.selectionDevice.map(item => {
          return {
            deviceName: item.deviceName,
            deviceTypeName: item.deviceTypeName,
            deviceNumber: item.deviceNumber,
            deviceCount: "",
            isEditFinish: false,
            deviceId: item.id,
            deviceLubesLubs: [
              {
                changeOver: "",
                flushingVol: "",
                lubricationId: "",
                odi: "",
                oilNumber: "",
                oilPackage: "",
                productNumber: "",
                oilTankVol: "",
                serviceFillVol: "",
                yearOilVol: "",
                oilBoxCapacityUnit: "L"
              }
            ]
          };
        });
        this.$router.push({
          path: "/EquipmentLubrTable/AddEquipmentLubrTable",
          query: {
            companyId: this.companyId,
            companyName: this.customerCompanyName,
            companyNumber: this.queryDeviceParams.companyNumber,
            deviceList: JSON.stringify(deviceList)
          }
        });
        this.$gio.selectDevice({
          customer: this.queryParams.companyName,
          operation: "弹窗中点击生成设备润滑表"
        });
      },
      // 查询
      handleSearchTableData(e) {
        this.pagenation.current = 1;
        this.getDeviceLubesList();
        if (e.target) {
          let target = e.target;
          if (target.nodeName == "SPAN" || target.nodeName == "I") {
            target = e.target.parentNode;
          }
          target.blur();
        }
      },
      // page change  事件
      handleCurrentChange(page) {
        this.pagenation.current = page;
        this.getDeviceLubesList(); // 获取日志列表
      },
      // size change 事件
      handleSizeChange(size) {
        this.pagenation.size = size;
        this.pagenation.current = 1;
        this.getDeviceLubesList(); // 获取短信日志列表
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
  .equipment-lubr-Table {
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
    .nowrap-name {
      word-break: break-all;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .workOrder-Status {
      font-family: MicrosoftYaHei-Bold;
      font-size: 14px;
      font-weight: bold;
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
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: rgba(254, 0, 24, 1) !important;
      border-color: rgba(254, 0, 24, 1) !important;
    }
    .el-radio-button__inner:hover {
      color: rgba(254, 0, 24, 1) !important;
    }
    .is-active .el-radio-button__inner:hover {
      color: #fff !important;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #f5f7fa !important;
    }
    // .el-pagination.is-background .el-pager li:not(.disabled).active {
    //   background:#fff !important;
    // }
    .el-tabs__item.is-active {
      color: #fe000c !important;
      font-weight: 900 !important;
    }
    .el-tabs__active-bar {
      background-color: #fe000c !important;
    }
    .el-tabs__item:hover {
      color: #fe000c !important;
    }
    .bold {
      font-weight: bold;
    }
    .email-info {
      height: 36px;
      line-height: 36px;
      color: #ff9900;
      font-size: 13px;
      margin-bottom: 20px;
      border-radius: 4px;
      background: rgba(255, 153, 0, 0.1);
    }
  }
  .email-dialog {
    .title {
      width: 100px;
      display: inline-block;
      padding-right: 12px;
      box-sizing: border-box;
      text-align: right;
    }
    .email-font label {
      font-size: 16px !important;
    }
  }
  .select-device {
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__body {
      padding: 10px 20px 40px !important;
    }
  }
  .look-process {
    .title {
      font-weight: bold;
      color: #000;
    }
    .content {
      margin-top: 8px;
      font-size: 12px;
      color: #999;
    }
    .el-timeline-item__node--large {
      width: 20px;
      height: 20px;
      left: -5px;
      top: -3px;
    }
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
  }
  </style>
  