<template>
   <div class="component-activity">
      <div style="display: flex;align-items: center;justify-content: end;">
        <el-button @click="exportFile" size="small" v-has="Excellentcase_Export">批量导出</el-button>
        <custom-field class="marLeft" @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="adminCaseList"></custom-field>   
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
      <!-- 服务商区域 -->
      <template v-slot:spAreaName="slotProps" >
        <el-table-column
          label="服务商区域"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
          show-overflow-tooltip
        >
          <template slot="header">
            <column-header 
            title="服务商区域"
            :filterType="slotProps.slotData.filterType"
            :paramValue="slotProps.slotData.paramValue"
            :changeValue="slotProps.slotData.changeValue"
            :selectOptions="slotProps.slotData.selectOptions"
            @chSubmit="tableTitleSearch"/>
          </template>
          <template slot-scope="scope">
            <span class="workOrder-Status">{{ scope.row.spAreaName }}</span>
          </template>
        </el-table-column>
      </template>
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
            <div>
              <span v-show="scope.row.reportStatus == '1'" style="color:#67C23A;">已提报</span>
              <span v-show="scope.row.reportStatus == '3'" style="color:#dd0000;">提报被驳回</span>
            </div>
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
            <div>
              <span v-show="scope.row.checkStatus == '1'" style="color:#dd0000;">待审阅</span>
              <span v-show="scope.row.checkStatus == '2'" style="color:#67C23A;">已推选</span>
              <span v-show="scope.row.checkStatus == '3'" style="color:#666;">已审阅</span>
              <span v-show="scope.row.checkStatus == '4'" style="color:#dd0000;">已驳回</span>
            </div>
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
        spAreaCode:{filterType: "selection", paramValue: "spAreaCode", changeValue:"",selectOptions: [], prop: "spAreaName", label: "服务商区域", width: "140", tooltip: true },
        spName:{filterType: "input", paramValue: "spName", changeValue:"",  label: "服务商", prop: "spName", width: "250", tooltip: true},
        accountName:{filterType: "input", paramValue: "accountName", changeValue:"",  label: "客户", prop: "accountName", width: "250", tooltip: true},
        serviceApplyNo:{filterType: "input", paramValue: "serviceApplyNo", changeValue:"",  label: "申请单号", prop: "serviceApplyNo", width: "150", tooltip: true},
        serviceProperty:{filterType: "selection", paramValue: "serviceProperty",  selectOptions: [{name: "维护现有生意",code: "1"},{name: "油品升级",code: "2"},{name: "竞品转换",code: "3"},{name: "服务收费",code: "4"},{name: "支持新项目生意",code: "5"}], changeValue:"", label: "服务创盈", slot: "serviceProperty", width: "160" },
        serviceScore:{filterType: "", paramValue: "serviceScore", changeValue:"", sortTypeVal: "sortDefault", label: "服务级别得分", prop: "serviceGradeMark", width: "140", tooltip: true },
        activityName:{filterType: "input", paramValue: "activityName", changeValue:"",  label: "活动名称", prop: "activityName", width: "110", tooltip: true},
        commitName:{filterType: "input", paramValue: "commitName", changeValue:"",  label: "提报人", prop: "commitName", width: "110", tooltip: true},
        commitTime:{filterType: "dateRange", paramValue: "commitTime", changeValue:"", sortTypeVal: "sortUp", label: "提报时间", prop: "commitTime", width: "200", tooltip: true },
        reviewUserName:{filterType: "input", paramValue: "reviewUserName", changeValue:"",  label: "审阅人", prop: "reviewUserName", width: "150", tooltip: true},
        reviewTime:{filterType: "dateRange", paramValue: "reviewTime", changeValue:"", sortTypeVal: "sortDefault", label: "审阅时间", prop: "reviewTime", width: "200", tooltip: true },
        reportStatus:{filterType: "selection", paramValue: "reportStatus", selectMultiple: false, selectOptions:  [{ code: '1', name: "已提报" },{ code: '3', name: "提报被驳回" }], changeValue:"", label: "提报状态", slot: "reportStatus", width: "150" },
        checkStatus:{filterType: "selection", paramValue: "checkStatus", selectMultiple: false, selectOptions:  [{ code: '1', name: "待审阅" },{ code: '2', name: "已推选" },{ code: '3', name: "已审阅" },{ code: '4', name: "已驳回" }], changeValue:"", label: "审阅状态", slot: "checkStatus", width: "150" },
        operation:{label: "操作", slot: "operation" }
      },
      customFieldlistUnit: [
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
          fieldName: "activityName",
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
      commitTime:'',
      reviewTime:'',
      totalNumber:0,
      current:1,
      size:10,
      queryParams:{
        caseNo:'',
        spAreaCode:'',
        spName:'',
        accountName:'',
        serviceApplyNo:'',
        serviceProperty:'',
        serviceGradeMarkType:'',
        activityName:'',
        commitName:'',
        reviewUserName:'',
        commitStartTime:'',
        commitEndTime:'',
        reportStatus:'',
        checkStatus:'',
        commitType:1,
        reviewStartTime:'',
        reviewEndTime:'',
        reviewTimeType:'',
        notReportStatus:2,
      },
      tableData:[],
    }
  },
  mounted () {
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  created () {
    this.getAreaList()
    this.getTableData()
  },
  methods:{
    getTableData(){
      this.loadingTable = true
      const params = this.queryParams
      params.current = this.current
      params.size = this.size
      params.menuCode = 'ReadAllExcellentcase'
      delete params.commitTime
      delete params.reviewTime
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
          this.tableDataHeaderInit.spAreaCode.selectOptions = data
          this.getCustomFieldList(); //获取自定义字段列表
        }else{
          this.$message({
              message: res.data.msg,
              type: "warning"
          });
        }
      })
    },
    // 批量导出
    exportFile(){
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const downloadParams = JSON.parse(JSON.stringify(this.queryParams))
      downloadParams.current = this.current
      downloadParams.size = this.size
      downloadParams.responseTypeBlob = true
      this.requestMethodGet('/emEcReport/excelTable',downloadParams).then(res=>{
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
            link.setAttribute("download", "优秀案例提报.xls");
            document.body.appendChild(link);
            link.click();
          }
        };
        fileReader.readAsText(data); 
      }).catch(err=>{
        loading.close();
      })
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "adminCaseList");
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
      if(obj.paramValue == 'spAreaCode'){
        this.queryParams[obj.paramValue] = searchVal.toString()
      }else{
        this.queryParams[obj.paramValue] = searchVal
      }
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
      if(obj.paramValue == 'checkStatus'){
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
      if(obj.paramValue == 'reviewTime'){
        if(searchVal){
          this.queryParams.reviewStartTime = searchVal[0]
          this.queryParams.reviewEndTime = searchVal[1]
        }else{
          this.queryParams.reviewStartTime = ""
          this.queryParams.reviewEndTime = ""
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
      if(key=='serviceScore'){//分数
        if(sortVal=='sortUp'){
          this.queryParams.serviceGradeMarkType = 1
          this.queryParams.commitType = ''
          this.queryParams.reviewTimeType = ''
        }else if(sortVal=='sortDown'){
          this.queryParams.serviceGradeMarkType = 2
          this.queryParams.commitType = ''
          this.queryParams.reviewTimeType = ''
          
        }
      }else if(key == 'commitTime'){//提报时间
        if(sortVal=='sortUp'){
          this.queryParams.serviceGradeMarkType = ''
          this.queryParams.reviewTimeType = ''
          this.queryParams.commitType = 1
        }else if(sortVal=='sortDown'){
          this.queryParams.commitType = 2
          this.queryParams.serviceGradeMarkType = ''
          this.queryParams.reviewTimeType = ''
        }
      }else if(key == 'reviewTime'){//审阅时间
        if(sortVal=='sortUp'){
          this.queryParams.reviewTimeType = 1
          this.queryParams.serviceGradeMarkType = ''
          this.queryParams.commitType = ''
        }else if(sortVal=='sortDown'){
          this.queryParams.reviewTimeType = 2
          this.queryParams.serviceGradeMarkType = ''
          this.queryParams.commitType = ''
        }
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
        path:'/adminCaseIndex/caseDetail',
        query:{
          caseId:row.id,
          type:'admin'
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
</style>
