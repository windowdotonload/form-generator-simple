<template>
   <div class="component-activity">
    <div style="display: flex;align-items: center;justify-content: end;">
      <!-- 待审阅 -->
      <custom-field class="marLeft" @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="areaManagerWait" v-if="activeName=='wait'"></custom-field>   
      <!-- 已审阅 -->
      <custom-field class="marLeft" @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="areaManagerHas" v-if="activeName=='has'"></custom-field>   
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待审阅" name="wait">
        <custom-table
          :tableHeader="tableDataHeader"
          :tableData="tableData"
          :tableHeight="tableHeight + ''"
          :loading="loadingTable"
          class="moreSelectMar"
          @changeSearch="tableTitleSearch"  
          @changeSortTable="changeSortTable"
        >
        <!-- 服务创盈类型 -->
        <template v-slot:serviceProperty="slotProps">
            <el-table-column
              label="服务创盈类型"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                title="服务创盈类型"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <span class="workOrder-Status">{{ scope.row.serviceProperty }}</span>
              </template>
            </el-table-column>
          </template>
          
        <template v-slot:reportStatus="slotProps">
          <el-table-column
            label="提报状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip>
            <template slot="header">
              <column-header 
                title="提报状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <!-- <span style="color:#67C23A;">已提报</span> -->
              <span v-show="scope.row.reportStatus == '1'" style="color:#67C23A;">已提报</span>
              <span v-show="scope.row.putStatus == '2'" style="color:#666;">待提报</span>
              <span v-show="scope.row.reportStatus == '3'" style="color:#dd0000;">提报被驳回</span>
            </template>
          </el-table-column>
        </template>

        <template v-slot:checkStatus="slotProps">
          <el-table-column
            label="审阅状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip>
            <template slot="header">
              <column-header 
                title="审阅状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <!-- <span style="color:#dd0000;">待审阅</span> -->
              <span v-show="scope.row.checkStatus == '1'" style="color:#dd0000;">待审阅</span>
              <span v-show="scope.row.checkStatus == '2'" style="color:#67C23A;">已推选</span>
              <span v-show="scope.row.checkStatus == '3'" style="color:#666;">已审阅</span>
              <span v-show="scope.row.checkStatus == '4'" style="color:#dd0000;">已驳回</span>
            </template>
          </el-table-column>
        </template>
          <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
          <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="100" align="center">
            <i class="el-icon-share"></i>
            <template slot-scope="scope">
              <!-- v-has="Excellentcase" -->
              <el-link
                type="danger"
                @click="viewRow(scope.row)"
                style="color: #001450"
                :underline="false"
                >查看</el-link
              >
            </template>
          </el-table-column>
        </custom-table>
        </el-tab-pane>
      <el-tab-pane label="已审阅" name="has">
        <custom-table
          :tableHeader="tableDataHeader"
          :tableData="tableData"
          :tableHeight="tableHeight + ''"
          :loading="loadingTable"
          class="moreSelectMar"
          @changeSearch="tableTitleSearch"  
          @changeSortTable="changeSortTable"
        >
        <!-- 服务创盈类型 -->
        <template v-slot:serviceProperty="slotProps" >
            <el-table-column
              label="服务创盈类型"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                title="服务创盈类型"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <span class="workOrder-Status">{{ scope.row.serviceProperty }}</span>
              </template>
            </el-table-column>
          </template>
          
        <template v-slot:reportStatus="slotProps">
          <el-table-column
            label="提报状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip>
            <template slot="header">
              <column-header 
                title="提报状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <span v-show="scope.row.reportStatus == '1'" style="color:#67C23A;">已提报</span>
              <span v-show="scope.row.putStatus == '2'" style="color:#666;">待提报</span>
              <span v-show="scope.row.reportStatus == '3'" style="color:#dd0000;">提报被驳回</span>
            </template>
          </el-table-column>
        </template>

        <template v-slot:checkStatus="slotProps">
          <el-table-column
            label="审阅状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip>
            <template slot="header">
              <column-header 
                title="审阅状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <span v-show="scope.row.checkStatus == '1'" style="color:#dd0000;">待审阅</span>
              <span v-show="scope.row.checkStatus == '2'" style="color:#67C23A;">已推选</span>
              <span v-show="scope.row.checkStatus == '3'" style="color:#666;">已审阅</span>
              <span v-show="scope.row.checkStatus == '4'" style="color:#dd0000;">已驳回</span>
            </template>
          </el-table-column>
        </template>
          <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
          <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="100" align="center">
            <i class="el-icon-share"></i>
            <template slot-scope="scope">
              <!-- v-has="Excellentcase" -->
              <el-link
                type="danger"
                @click="viewRow(scope.row)"
                style="color: #001450"
                :underline="false"
                >查看</el-link
              >
            </template>
          </el-table-column>
        </custom-table>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      v-if="totalNumber"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="current"
      :page-size="size"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber"
      class="listOptimizePage"
    ></el-pagination>
    </div>
</template>

<script>
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
import customField from "../tableComponents/customField.vue";
export default {
  components: {
    "custom-table": customTable,
    "column-header":columnHeader,
    "custom-field": customField,
  },
  data () {
    return {
      loadingTable: false,
      tableDataHeader: [],
      customFieldlist:[],
      tableHeight:null,
      waitCheckTableInit:{
        caseNo:{filterType: "input", paramValue: "caseNo", changeValue:"",  label: "案例编号", prop: "caseNo", width: "180", tooltip: true},
        spAreaCode:{filterType: "selection", paramValue: "spAreaCode", changeValue:"",selectOptions: [], prop: "spAreaName", label: "服务商区域", width: "140", tooltip: true },
        spName:{filterType: "input", paramValue: "spName", changeValue:"",  label: "服务商", prop: "spName", width: "250", tooltip: true},
        accountName:{filterType: "input", paramValue: "accountName", changeValue:"",  label: "客户", prop: "accountName", width: "250", tooltip: true},
        serviceApplyNo:{filterType: "input", paramValue: "serviceApplyNo", changeValue:"",  label: "申请单号", prop: "serviceApplyNo", width: "150", tooltip: true},
        serviceProperty:{filterType: "selection", paramValue: "serviceProperty",  selectOptions: [{name: "维护现有生意",code: "1"},{name: "油品升级",code: "2"},{name: "竞品转换",code: "3"},{name: "服务收费",code: "4"},{name: "支持新项目生意",code: "5"}], changeValue:"", label: "服务创盈", slot: "serviceProperty", width: "160" },
        serviceScore:{ filterType: "", paramValue: "serviceScore", changeValue:"", sortTypeVal: "sortDefault", label: "服务级别得分", prop: "serviceGradeMark", width: "160", tooltip: true },
        commitName:{filterType: "input", paramValue: "commitName", changeValue:"",  label: "提报人", prop: "commitName", width: "120", tooltip: true},
        commitTime:{filterType: "dateRange", paramValue: "commitTime", changeValue:"", sortTypeVal: "sortUp", label: "提报时间", prop: "commitTime", width: "200", tooltip: true },
        reportStatus:{ label: "提报状态", slot: "reportStatus", width: "150" },
        checkStatus:{ label: "审阅状态", slot: "checkStatus", width: "150" },
        operation:{label: "操作", slot: "operation" }
      },
      hasCheckTableInit:{
        caseNo:{filterType: "input", paramValue: "caseNo", changeValue:"",  label: "案例编号", prop: "caseNo", width: "180", tooltip: true},
        spAreaCode:{filterType: "selection", paramValue: "spAreaCode", changeValue:"",selectOptions: [], prop: "spAreaName", label: "服务商区域", width: "140", tooltip: true },
        spName:{filterType: "input", paramValue: "spName", changeValue:"",  label: "服务商", prop: "spName", width: "250", tooltip: true},
        accountName:{filterType: "input", paramValue: "accountName", changeValue:"",  label: "客户", prop: "accountName", width: "250", tooltip: true},
        serviceApplyNo:{filterType: "input", paramValue: "serviceApplyNo", changeValue:"",  label: "申请单号", prop: "serviceApplyNo", width: "150", tooltip: true},
        serviceProperty:{filterType: "selection", paramValue: "serviceProperty",  selectOptions: [{name: "维护现有生意",code: "1"},{name: "油品升级",code: "2"},{name: "竞品转换",code: "3"},{name: "服务收费",code: "4"},{name: "支持新项目生意",code: "5"}], changeValue:"", label: "服务创盈", slot: "serviceProperty", width: "160" },
        serviceScore:{ filterType: "", paramValue: "serviceScore", changeValue:"", sortTypeVal: "sortDefault", label: "服务级别得分", prop: "serviceGradeMark", width: "140", tooltip: true },
        commitName:{filterType: "input", paramValue: "commitName", changeValue:"",  label: "提报人", prop: "commitName", width: "110", tooltip: true},
        commitTime:{filterType: "dateRange", paramValue: "commitTime", changeValue:"", sortTypeVal: "sortUp", label: "提报时间", prop: "commitTime", width: "200", tooltip: true },
        reportStatus:{filterType: "selection", paramValue: "reportStatus", selectMultiple: false, selectOptions:  [{ code: '1', name: "已提报" },{ code: '3', name: "提报被驳回" }], changeValue:"", label: "提报状态", slot: "reportStatus", width: "150" },
        reviewUserName:{filterType: "input", paramValue: "reviewUserName", changeValue:"",  label: "审阅人", prop: "reviewUserName", width: "250", tooltip: true},
        reviewTime:{filterType: "dateRange", paramValue: "reviewTime", changeValue:"", sortTypeVal: "sortDefault", label: "审阅时间", prop: "reviewTime", width: "200", tooltip: true },
        checkStatus:{filterType: "selection", paramValue: "checkStatus", selectMultiple: false, selectOptions:  [{ code: '1', name: "已推选" },{ code: '2', name: "已审阅" },{ code: '3', name: "已驳回" }], changeValue:"", label: "审阅状态", slot: "checkStatus", width: "150" },
        operation:{label: "操作", slot: "operation" }
      },
      customWaitFieldlistUnit:[
        {
          fieldName: "caseNo",
          visible: 2
        },{
          fieldName: "spAreaCode",
          visible: 1
        },{
          fieldName: "spName",
          visible: 1
        },{
          fieldName: "accountName",
          visible: 1
        },{
          fieldName: "serviceApplyNo",
          visible: 1
        },{
          fieldName: "serviceProperty",
          visible: 1
        },{
          fieldName: "serviceScore",
          visible: 1
        },{
          fieldName: "commitName",
          visible: 1
        },{
          fieldName: "commitTime",
          visible: 1
        },{
          fieldName: "reportStatus",
          visible: 2
        },{
          fieldName: "checkStatus",
          visible: 2
        },{
          fieldName: "operation",
          visible: 2
        }
      ],
      customHasFieldlistUnit:[
        {
          fieldName: "caseNo",
          visible: 2
        },{
          fieldName: "spAreaCode",
          visible: 1
        },{
          fieldName: "spName",
          visible: 1
        },{
          fieldName: "accountName",
          visible: 1
        },{
          fieldName: "serviceApplyNo",
          visible: 1
        },{
          fieldName: "serviceProperty",
          visible: 1
        },{
          fieldName: "serviceScore",
          visible: 1
        },{
          fieldName: "commitName",
          visible: 1
        },{
          fieldName: "commitTime",
          visible: 1
        },{
          fieldName: "reviewUserName",
          visible: 1
        },{
          fieldName: "reviewTime",
          visible: 1
        },{
          fieldName: "reportStatus",
          visible: 2
        },{
          fieldName: "checkStatus",
          visible: 2
        },{
          fieldName: "operation",
          visible: 2
        }
      ],
      activeName:'wait',
      reviewTime:'',
      queryParamsWait:{
        caseNo:'',
        spAreaCode:'',
        spName:'',
        accountName:'',
        serviceApplyNo:'',
        serviceProperty:'',
        serviceGradeMarkType:'',
        commitName:'',
        commitStartTime:'',
        commitEndTime:'',
        reportStatus:'',
        checkStatus:'',
        commitType:1,
        notReportStatus:2,
      },
      queryParamsHas:{
        caseNo:'',
        spAreaCode:'',
        spName:'',
        accountName:'',
        serviceApplyNo:'',
        serviceProperty:'',
        serviceGradeMarkType:'',
        commitName:'',
        commitStartTime:'',
        commitEndTime:'',
        reviewUserName:'',
        reviewTimeType:'',
        reviewStartTime:'',
        reviewEndTime:'',
        reportStatus:'',
        checkStatus:'',
        commitType:1,
        notReportStatus:2,
      },
      queryParams:{},
      tableData:[],
      totalNumber:0,
      current:1,
      size:10,
    }
  },
   mounted () {
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  created () {
    this.activeName = this.$route.query.tabsType ? this.$route.query.tabsType : 'wait'
    this.getAreaList()//获取区域下拉数据源
    this.getTableData()
  },
  methods:{
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 290
    },
    getTableData(){
      this.loadingTable = true
      const params = this.activeName == 'wait' ? this.queryParamsWait : this.queryParamsHas
      delete params.reviewTime
      delete params.commitTime
      params.current = this.current
      params.size = this.size
      params.menuCode = 'ReadExcellentcase'
      params.checkStatus = this.activeName=='wait' ? 1 : 5
      this.requestMethodGet('/emEcReport/paginQuery',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data.list || []
          this.tableData = data
          this.totalNumber = res.data.data.totalCount
          this.loadingTable = false
        }else{
          this.loadingTable = false
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    getAreaList(){
      this.requestMethodGet('/weChat/common/getAreaDropsExcludeArea0000',{}).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data
          data.forEach(item=>{
              item.label = item.name
              item.value = item.code
          })
          this.waitCheckTableInit.spAreaCode.selectOptions = data
          this.hasCheckTableInit.spAreaCode.selectOptions = data
          this.getCustomFieldList()
        }else{
          this.$message({
              message: res.data.msg,
              type: "warning"
          });
        }
      })
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.activeName=='wait' ? this.customWaitFieldlistUnit : this.customHasFieldlistUnit
      } else {
        let index
        if(this.activeName=='wait'){
          index = fieldDtoList.findIndex(item => item.listType == "areaManagerWait");
        }else{
          index = fieldDtoList.findIndex(item => item.listType == "areaManagerHas");
        }
        if (index != -1) {
          let fieldDtoInfos = fieldDtoList[index].fieldDtoInfos;
          if(fieldDtoInfos.length == 0){
            if(this.activeName=='wait'){
              customFieldlistUnit = this.customWaitFieldlistUnit
            }else{
              customFieldlistUnit = this.customHasFieldlistUnit
            }
          }else{
            customFieldlistUnit = fieldDtoInfos
          }
        } else {
          customFieldlistUnit = this.activeName=='wait' ? this.customWaitFieldlistUnit : this.customHasFieldlistUnit
        }
        console.log('========',index,customFieldlistUnit)
      }
      let tableHead
      if(this.activeName=='wait'){
        tableHead = this.waitCheckTableInit
      }else{
        tableHead = this.hasCheckTableInit
      }
      let customFieldlist 
      customFieldlist = customFieldlistUnit.map(item => {
        item.fieldNameCn = tableHead[item.fieldName].label;
        return item;
      });
      customFieldlist.sort((a, b) => {
        return a.sort - b.sort;
      });
      this.customFieldlist = customFieldlist;
      let tableDataHeader = [];
      this.tableDataHeader = []
      this.customFieldlist.forEach(item => {
        if (item.visible != 0) {
          tableDataHeader.push(tableHead[item.fieldName]);
        }
      });
      if (tableHead.selection) {
        tableDataHeader.unshift(tableHead.selection);
      }
      console.log('tableDataHeader',tableDataHeader)
      this.tableDataHeader = tableDataHeader
    },
    // 自定义字段
    getCustomFields(data) {
      this.customFieldlist = data;
      let tableDataHeader = [];
      let tableHead
      if(this.activeName=='wait'){
        tableHead = this.waitCheckTableInit
      }else{
        tableHead = this.hasCheckTableInit
      }
      data.forEach(item => {
        if (item.visible != 0) {
          tableDataHeader.push(tableHead[item.fieldName]);
        }
      });
      if (tableHead.selection) {
        tableDataHeader.unshift(tableHead.selection);
      }
      this.tableDataHeader = tableDataHeader;
    },
    // 搜索值改变
    tableTitleSearch(obj){
      console.log('obj',obj)
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      let queryParams = this.activeName == 'wait' ? this.queryParamsWait : this.queryParamsHas
      if(obj.paramValue == 'spAreaCode'){
        queryParams[obj.paramValue] = searchVal.toString()
      }else{
        queryParams[obj.paramValue] = searchVal
      }
      if(obj.paramValue == 'serviceProperty'){
        queryParams[obj.paramValue] = searchVal.toString()
      }else{
        queryParams[obj.paramValue] = searchVal
      }
      if(obj.paramValue == 'reportStatus'){
        queryParams[obj.paramValue] = searchVal.toString()
      }else{
        queryParams[obj.paramValue] = searchVal
      }
      if(obj.paramValue == 'checkStatus'){
        queryParams[obj.paramValue] = searchVal.toString()
      }else{
        queryParams[obj.paramValue] = searchVal
      }
      if(obj.paramValue == 'commitTime'){
        if(searchVal){
          queryParams.commitStartTime = searchVal[0]
          queryParams.commitEndTime = searchVal[1]
        }else{
          queryParams.commitStartTime = ""
          queryParams.commitEndTime = ""
        }
      }
      if(obj.paramValue == 'reviewTime'){
        if(searchVal){
          queryParams.reviewStartTime = searchVal[0]
          queryParams.reviewEndTime = searchVal[1]
        }else{
          queryParams.reviewStartTime = ""
          queryParams.reviewEndTime = ""
        }
      }
      this.queryParams = queryParams
      this.current = 1
      this.getTableData()
    },
    // 排序
    changeSortTable(obj){
      console.log('sort',obj)
      let sortVal = obj.sortTypeVal
      let key = obj.paramValue
      let queryParams = this.activeName == 'wait' ? this.queryParamsWait : this.queryParamsHas
      if(key=='serviceScore'){//分数
        if(sortVal=='sortUp'){
          queryParams.serviceGradeMarkType = 1
          queryParams.commitType = ''
          if(this.activeName == 'has'){
            queryParams.reviewTimeType = ''
          }
        }else if(sortVal=='sortDown'){
          queryParams.serviceGradeMarkType = 2
          queryParams.commitType = ''
          if(this.activeName == 'has'){
            queryParams.reviewTimeType = ''
          }
        }
      }else if(key == 'commitTime'){//提报时间
        if(sortVal=='sortUp'){
          queryParams.commitType = 1
          queryParams.serviceGradeMarkType = ''
          if(this.activeName == 'has'){
            queryParams.reviewTimeType = ''
          }
        }else if(sortVal=='sortDown'){
          queryParams.commitType = 2
          queryParams.serviceGradeMarkType = ''
          if(this.activeName == 'has'){
            queryParams.reviewTimeType = ''
          }
        }
      }else if(key == 'reviewTime'){//审阅时间
        if(sortVal=='sortUp'){
          queryParams.serviceGradeMarkType = ''
          queryParams.commitType = ''
          queryParams.reviewTimeType = 1
        }else if(sortVal=='sortDown'){
          queryParams.reviewTimeType = 2
          queryParams.serviceGradeMarkType = ''
          queryParams.commitType = ''
        }
      }
      this.current = 1
      this.queryParams = queryParams
      this.tableDataHeader.forEach(item=>{
        if(item.sortTypeVal&&(item.paramValue == key)){
          item.sortTypeVal = sortVal
        }else if(item.sortTypeVal&&(item.paramValue != key)){
          item.sortTypeVal = 'sortDefault'
        }
      })
      this.getTableData()
    },
    // 页签切换
    handleClick(){
      this.current = 1
      this.size = 10
      this.getCustomFieldList()
      let tableRef
      if(this.activeName=='wait'){
        tableRef = this.$refs.waitTabsTableRef
      }else if(this.activeName=='has'){
        tableRef = this.$refs.hasTabsTableRef
      }
      // 切换tab，重置搜索，列表数据重置
      // tableRef.changeTabs()
      this.getTableData()
    },
    sizeChange(val){
      this.size = val
      this.getTableData()
    },
    currentChange(val){
      this.current = val
      this.getTableData()
    },
    viewRow(row){
      this.$router.push({
        path:'/areaManagerIndex/caseDetail',
        query:{
          caseId:row.id,
          type:'areaManager'
        }
      })
    },
    beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  },
}
</script>
<style lang='less' scoped>
@import "../../assets/css/customTable.less";
.component-activity {
  width: calc(100% - 40px);
  margin: 0 auto;
  height: 100%;
  overflow: auto;
}
</style>
