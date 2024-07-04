<template>
    <div style="position:relative">
      <el-button style="position: absolute;right: 20px;top: -40px;" type="danger"  plain @click="handleDown" size="small">导出设备润滑表</el-button>

      <div class="equipment-lubr-Table" :style="mainminheight" id="equipmentLubrDiv">

        <!-- 表格 -->
        <custom-table
          class="table"
          :tableHeader="tableDataHeaderInit"
          :tableData="deviceLubesData"
          :tableHeight="tableHeight + ''"
          :loading="loading"
          :listEmptyType="listEmptyType"
          @selectionChange="handleSelectionChange"
          @changeSearch="tableTitleSearch"
          @changeSortTable="changeSortTable"
        >
            <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" :resizable="false" align="center" width="55"></el-table-column>
            <template v-slot:deviceName="slotProps">
          <el-table-column
            fixed
            label="设备名称"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeaderInit.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeaderInit.length - 2 ? false : true"
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
            <template v-slot:lubricationMethod="slotProps">
                <el-table-column
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeaderInit.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeaderInit.length - 2 ? false : true"
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
      </div>
      
    </div>
  </template>
  <script>
  import customField from "../tableComponents/customField.vue";
  import customTable from "../tableComponents/customTable";
  import columnHeader from "../tableComponents/headerComponent";
  import commonJS from "../tableComponents/tableCommon.js";
  export default {
    name: "EquipmentLubrTable",
    mixins: [commonJS],
    components: {
        "custom-field": customField,
        "custom-table": customTable,
        "column-header":columnHeader
    },
    data() {
      return {
        applyUserDetail: {},
        dialogFormVisible: false,
        selectDeviceVisiable: false,
        applyDialogFlag: false,
        lookProcessVisiable: false,
        listEmptyType:'equipment',
        mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
        queryParams: {
          orderBy: '',
          descFlag: true,
          deviceName: "", // 设备名称
          deviceActiveStatus: "", // 活跃状态
          currentOilCodeName:[],
          lastOilAddDate:[],
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
            fieldName: "lubricationPointName",
            visible: 2
          },
          {
            fieldName: "lubricationMethod",
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
            fieldName: "oilChangePeriodName",
            visible: 1
          },
          {
            fieldName:'operation',
            visible: 2
          }
        ],
        customFieldlist: [],
        tableHeight: null,
        tableDataHeaderInit: [
            { slot: "selection" },
            { filterType: "inputAndselection", paramValue: "deviceName", selectOptions: [{ code: 1, name: "活跃" },{ code: 0, name: "不活跃" }], changeValueInput:"", changeValueSelect:"", label: "设备名称", slot: "deviceName", width: "200" },
            { filterType: "input",paramValue: "lubricationPointName",label: "润滑点设备名称", prop: "lubricationPointName",fixed: "left",  width: "250" , tooltip: true},
            { prop: "lubricationMethod", label: "润滑方式", width: "180" , tooltip: true},
            {  filterType: "cascaderOil",selectMultiple: true, label: "在用油名称", paramValue: "currentOilCodeName", changeValue: "",  prop: "currentOilCodeName",selectOptions: [],  label: "在用油名称", width: "180", tooltip: true},
            { filterType: "input", paramValue: "oilBoxCapacityName", changeValue: "",  prop: "oilBoxCapacityName", label: "油箱容量", width: "180" , tooltip: true},
            { filterType: "input", paramValue: "oilAddPeriodName", changeValue: "",  prop: "oilAddPeriodName", label: "加油周期/加脂周期", width: "180" , tooltip: true},
            { filterType: "input", paramValue: "everyTimeOilAddQuantityName", changeValue: "",  prop: "everyTimeOilAddQuantityName", label: "每次加油量/每次加脂量", width: "180" , tooltip: true},
            { filterType: "input", paramValue: "preMonthOilAddQuantityName", changeValue: "",  prop: "preMonthOilAddQuantityName", label: "每月润滑剂添加量", width: "180" , tooltip: true},
            { filterType: "dateRange", paramValue: "lastOilAddDate", changeValue: "",  prop: "lastOilAddDate", label: "上次加油日期/上次加脂日期", width: "230", tooltip: true },
            { filterType: "input", paramValue: "oilChangePeriodName", changeValue: "",  prop: "oilChangePeriodName", label: "换油周期", width: "180", tooltip: true },
            {  paramValue: "lastOilChangeDate", changeValue: "",  prop: "lastOilChangeDate", label: "上次换油日期", sortTypeVal: "sortDefault",width: "180", tooltip: true },
            { slot: "operation", label: "操作" }
        ],
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
      if (from.path == "/EquipmentProfile/EditEquipmentProfile") {
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
      this.getOilList('', '');
      this.getDeviceLubesList();
      this.handleTableHeight();
      window.addEventListener("resize", () => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
        this.$nextTick(() => {
          this.handleTableHeight();
        });
      });
    },
    methods: {
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
        queryParams.lubePointIds = this.selectList
        if(queryParams.lastOilAddDate.length>0){
          queryParams.lastOilAddDateStart = queryParams.lastOilAddDate[0]
          queryParams.lastOilAddDateEnd = queryParams.lastOilAddDate[1]
          
        } else {
          queryParams.lastOilAddDateStart = ''
          queryParams.lastOilAddDateEnd = ''
        }
        delete queryParams.lastOilAddDate
        queryParams.lubricationPointName = queryParams.lubricationPointName
        // 每月润滑剂添加量
        if (queryParams.preMonthOilAddQuantityName) {
          queryParams.preMonthOilAddQuantitySearch = queryParams.preMonthOilAddQuantityName
          delete queryParams.preMonthOilAddQuantityName
        } 
        // 再用油品
        if (queryParams.currentOilCodeName) {
          queryParams.currentOilCodeList = queryParams.currentOilCodeName
          delete queryParams.currentOilCodeName
        } else {
          queryParams.currentOilCodeList = []
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
        queryParams.customerFlag =true
        // 每次加油量/加脂量
        if (queryParams.everyTimeOilAddQuantityName) {
          queryParams.everyTimeOilAddQuantitySearch = queryParams.everyTimeOilAddQuantityName
          delete queryParams.everyTimeOilAddQuantityName
        } 
        let params = { ...queryParams};
        params.companyName = "";
        params.responseTypeBlob=true
        params.menuCode = "/EquipLubrListCustomer"

      this.requestMethodPost("/lubePoint/exportLubePointExcel", params).then(res => {
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
            type: "application/vnd.ms-excel",
            });
            let fileName = decodeURI(res.headers['content-disposition'].split("filename*=utf-8''")[1])
            const objectUrl = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = objectUrl;
            link.setAttribute("download",fileName);
            document.body.appendChild(link);
            link.click();
          }
        };
        fileReader.readAsText(data);
      })
      .catch(res => {});
        
      },
      getOilList(code, type) {
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {code: code, oilName:'', fullQueryFlag:true, size:200, current:1})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.oilList = res.data.list;
            let index = this.tableDataHeaderInit.findIndex(item=>item.paramValue == "currentOilCodeName")
              if(index!=-1){
                this.tableDataHeaderInit[index].selectOptions = this.oilList
              }
            this.getDeviceLubesList()
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
      // 表格多选事件
      handleSelectionChange(select) {
        this.selectionRow = select;
        this.selectList = [];
        select.forEach(item => {
          this.selectList.push(item.lubricationPointId);
        });
      },
      // 清空所属客户
      clearCustomer(val) {
          if (!val) {
              this.customerFilter("");
              this.groupList = [];
              this.queryParams.workshopId = "";
              this.workShopSearchList = [];
              this.workshopList = [];
              ++this.groupKey;
              this.handleSearchTableData();
          }
        },
      tableTitleSearch(obj) {
        this.tableDataHeaderInit.forEach(item=>{
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
        }else if(obj.paramValue=='currentOilCodeName'){
          this.queryParams[obj.paramValue] = obj.changeValue
          console.log(obj)
          this.getOilList(obj.changeValue.toString(), 'search')
        }else{
          this.queryParams[obj.paramValue] = obj.changeValue
        }
        this.pagenation.current = 1;
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
        this.tableDataHeaderInit.forEach(item => {
          if (item.sortTypeVal && item.paramValue == this.queryParams.orderBy) {
            item.sortTypeVal = sortVal;
          } else if (item.sortTypeVal && item.paramValue != this.queryParams.orderBy) {
            item.sortTypeVal = "sortDefault";
          }
        });
        this.getDeviceLubesList();
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
        let queryParams = _.cloneDeep(this.queryParams)
        if(queryParams.lastOilAddDate.length>0){
          queryParams.lastOilAddDateStart = queryParams.lastOilAddDate[0]
          queryParams.lastOilAddDateEnd = queryParams.lastOilAddDate[1]
        } else {
          queryParams.lastOilAddDateStart = ''
          queryParams.lastOilAddDateEnd = ''
        }
        delete queryParams.lastOilAddDate
        queryParams.lubricationPointName = queryParams.lubricationPointName
        // 再用油品
        if (queryParams.currentOilCodeName) {
          queryParams.currentOilCodeList = queryParams.currentOilCodeName
          delete queryParams.currentOilCodeName
        } 
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
        console.log(this.userInfo)
        queryParams.customerFlag =true
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
        let params = { ...queryParams, ...this.pagenation,menuCode: "/EquipLubrListCustomer" };
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
  