<template>
   <div class="component-activity">
      <div style="display: flex;align-items: center;justify-content: end;">
        <custom-field class="marLeft" @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="distributorCaseType"></custom-field>   
      </div>
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
          label="状态"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
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
              @chSubmit="tableTitleSearch"/>
          </template>
          <template slot-scope="scope">
            <!-- // 1.已提报 2.待提报 3.提报被驳回 -->
            <span v-show="scope.row.reportStatus == '1'" style="color:#67C23A;">已提报</span>
            <span v-show="scope.row.reportStatus == '2'" style="color:#666;">待提报</span>
            <span v-show="scope.row.reportStatus == '3'" style="color:#dd0000;">提报被驳回</span>
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
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
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
    "custom-field": customField
  },
  data () {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      loadingTable: false,
      tableHeight:null,
      customFieldlist:[],
      tableDataHeader: [],
      tableDataHeaderInit:{
        caseNo:{filterType: "input", paramValue: "caseNo", changeValue:"",  label: "案例编号", prop: "caseNo", width: "180", tooltip: true},
        accountName:{filterType: "input", paramValue: "accountName", changeValue:"",  label: "客户", prop: "accountName", width: "250", tooltip: true},
        serviceApplyNo:{filterType: "input", paramValue: "serviceApplyNo", changeValue:"",  label: "申请单号", prop: "serviceApplyNo", width: "150", tooltip: true},
        serviceProperty:{ filterType: "selection", paramValue: "serviceProperty",  selectOptions: [{name: "维护现有生意",code: "1"},{name: "油品升级",code: "2"},{name: "竞品转换",code: "3"},{name: "服务收费",code: "4"},{name: "支持新项目生意",code: "5"}], changeValue:"", label: "服务创盈", slot: "serviceProperty", width: "160" },
        commitName:{filterType: "input", paramValue: "commitName", changeValue:"",  label: "提报人", prop: "commitName", width: "120", tooltip: true},
        commitTime:{ filterType: "dateRange", paramValue: "commitTime", changeValue:"", sortTypeVal: "sortUp", label: "提报时间", prop: "commitTime", width: "200", tooltip: true },
        reportStatus:{ filterType: "selection", paramValue: "reportStatus", selectMultiple: false, selectOptions:  [{ code: '1', name: "已提报" },{ code: '2', name: "待提报" },{ code: '3', name: "提报被驳回" }], changeValue:"", label: "提报状态", slot: "reportStatus", width: "150" },
        operation:{ label: "操作", slot: "operation" }
      },
      customFieldlistUnit:[
        {
          fieldName: "caseNo",
          visible: 2
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
          fieldName: "commitName",
          visible: 1
        },{
          fieldName: "commitTime",
          visible: 1
        },{
          fieldName: "reportStatus",
          visible: 2
        },{
          fieldName: "operation",
          visible: 2
        }
      ],
      commitTime:'',
      queryParams:{
        caseNo:'',
        accountName:'',
        serviceApplyNo:'',
        serviceProperty:'',
        commitName:'',
        commitStartTime:'',
        commitEndTime:'',
        reportStatus:'',
        commitType:1
      },
      totalNumber:0,
      current:1,
      size:10,
      tableData:[],
      typeList:[
        {
          value:1,
          label:'优秀案例提报'
        }
      ],
    }
  },
  mounted () {
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  created () {
    this.getCustomFieldList()
    this.getTableData()
  },
  methods:{
    getTableData(){
      this.loadingTable = true
      const params = this.queryParams
      delete params.commitTime
      params.current = this.current
      params.size = this.size
      params.menuCode = 'Excellentcase'
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
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "distributorCaseType");
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
      console.log('data...',data)
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
    // 搜索值改变
    tableTitleSearch(obj){
      console.log('obj',obj)
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue == 'serviceProperty'){
        this.queryParams[obj.paramValue] = searchVal.toString()
      }else{
        this.queryParams[obj.paramValue] = searchVal
      }
      if(obj.paramValue == 'reportStatus'){
        this.queryParams[obj.paramValue] = searchVal.toString()
      }else{
        this.queryParams[obj.paramValue] = searchVal
      }
      if(obj.paramValue == 'commitTime'){
        if(searchVal){
          this.queryParams.commitStartTime = searchVal[0]
          this.queryParams.commitEndTime = searchVal[1]
        }else{
          this.queryParams.commitStartTime = ""
          this.queryParams.commitEndTime = ""
        }
      }
      this.current = 1
      this.getTableData()
    },
    // 排序
    changeSortTable(obj){
      console.log('sort',obj)
      let sortVal = obj.sortTypeVal
      let key = obj.paramValue
      if(sortVal=='sortUp'){
        this.queryParams.commitType = 1
      }else if(sortVal=='sortDown'){
        this.queryParams.commitType = 2
      }
      this.current = 1
      this.tableDataHeader.forEach(item=>{
        if(item.sortTypeVal&&(item.paramValue == key)){
          item.sortTypeVal = sortVal
        }else if(item.sortTypeVal&&(item.paramValue != key)){
          item.sortTypeVal = 'sortDefault'
        }
      })
      this.getTableData()
    },
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 226
    },
    handleSizeChange(val){
      this.size = val
      this.getTableData()
    },
    handleCurrentChange(val){
      this.current = val
      this.getTableData()
    },
    viewRow(row){
      this.$router.push({
        path:'/distributorCaseIndex/caseDetail',
        query:{
          caseId:row.id,
          type:'distributor'
        }
      })
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight()
    });
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
.draw-contnet{
  padding: 0 20px;
}
</style>
