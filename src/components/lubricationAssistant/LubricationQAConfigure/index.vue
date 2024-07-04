<template>
  <div class="train-qaconfiure-container">
    <div class="search-bar">
      <el-button size="small" plain @click="handleClearSearch">重置筛选</el-button>
      <div class="op-group">
        <el-button size="small" plain type="danger" @click="openHistoryDialog">操作历史</el-button>
        <el-button size="small" plain type="danger" @click="openDataAnalysis">数据分析</el-button>
        <el-button size="small" type="danger" @click="configure">新建问答</el-button>
      </div>
    </div>
    <custom-table
      :tableHeader="tableDataHeader"
      :tableData="tableData"
      :tableHeight="tableHeight + ''"
      :loading="loading"
      class="moreSelectMar"
      @changeSearch="tableTitleSearch"  
      @changeSortTable="changeSortTable"
    >
      <template v-slot:nameLv2="slotProps">
          <el-table-column
            label="二级分类"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
                title="二级分类"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
                v-if="searchForm.idLv1!=''"
                />
                <span v-else>二级分类</span>
            </template>
            <template #default="{row}">
              {{ row.nameLv2 || "-"  }}
            </template>
          </el-table-column>
        </template>
      <template v-slot:state="slotProps">
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
          <template #default="{row}">
            <span v-show="row.status" style="color:#008787">启用</span>
            <span v-show="!row.status" style="color:#d10000">禁用</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
      <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="80" align="center">
        <template #default="{row}">
          <el-link :underline="false" style="color: #001450" @click.stop="editClassifyItem(row)">编辑</el-link>
        </template>
      </el-table-column>
    </custom-table>
    <Pagination :total="tableTotal" :pageInfo="tablePageInfo" class="listOptimizePage" />

    <el-dialog title="操作历史" :visible.sync="historyDialogVis" width="39%" top="5%">
      <div style="position:relative">
        <el-table height="550" :data="histoTableData" style="width: 100%;overflow:auto" :header-cell-style="{ background: '#f7f7f7' }" v-loading="historyDialogLoading">
          <el-table-column prop="operateName" label="操作类型" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="createTime" label="操作时间" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="createUserName" label="操作人" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="operateDesc" label="明细" show-overflow-tooltip> </el-table-column>
        </el-table>
        <Pagination :total="histoTableDataTotal" :pageInfo="historyTablePageInfo" />
      </div>
    </el-dialog>

    <DataAnalysis v-if="dataAnalysisVis" :dataAnalysisVis="dataAnalysisVis" @closeAnalysis="closeAnalysis" />
    <CreateAndEditDrawer ref="detailDrawerIndex" />
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import { getOpLog, getClassifyListAll, queryQAid, getChartSelectDataDropDown } from "../api/LubQA";
import customTable from "../../tableComponents/customTable.vue";
import columnHeader from "../../tableComponents/headerComponent";
export default {
  components: {
    DataAnalysis: () => import("../LubConfigureDataAnalysis/index.vue"),
    CreateAndEditDrawer: () => import("./LubConfigureDetail/components/CreateAndEditDrawer.vue"),
    Pagination: () => import("../api/components/Pagination.vue"),
    "custom-table": customTable,
    "column-header":columnHeader,
  },
  data() {
    return {
      dataAnalysisVis: false,
      searchForm: {
        number: "",
        idLv1: "",
        idLv2: "",
        qaName: "",
        state: ""
      },
      idLv1Options: [],
      idLv2Options: [],
      tableData: [],
      tableTotal: 0,
      tableLoading: false,
      tablePageInfo: {
        size: 30,
        current: 1
      },
      histoTableData: [],
      histoTableDataTotal: 0,
      historyDialogVis: false,
      historyDialogLoading: false,
      historyTablePageInfo: {
        size: 30,
        current: 1
      },
      tableHeight:null,
      tableDataHeader: [
        { filterType: "input", paramValue: "content", changeValue:"", label: "问题ID", prop: "number", width: "100", tooltip: true},
        { filterType: "selection", paramValue: "idLv1", selectMultiple: true, selectOptions:  [], changeValue:[], label: "一级分类", prop: "nameLv1", width: "120", tooltip: true},
        { filterType: "selection", paramValue: "idLv2", selectOptions:  [], changeValue:"", label: "二级分类", slot: "nameLv2", width: "120", tooltip: true},
        { filterType: "input", paramValue: "qaName", changeValue:"", label: "问题", prop: "qaName", width: "120", tooltip: true},
        { label: "创建时间", prop: "createTime", width: "150", tooltip: true},
        { filterType: "selection", paramValue: "state", selectMultiple: true, selectOptions:  [{ code: 1, name: "启用" },{ code: 0, name: "禁用" }], changeValue:[], label: "状态", slot: "state", width: "100" },
        { label: "操作", slot: "operation" }
      ],
    };
  },
  watch: {
    historyTablePageInfo: {
      handler() {
        this.getOpLogList();
      },
      deep: true
    },
    tablePageInfo: {
      handler() {
        this.getClassifyListAll();
      },
      deep: true
    },
    // searchForm: {
    //   handler: debounce(function() {
    //     this.refreshTableList();
    //   }, 800),
    //   deep: true
    // }
  },
  created() {
    this.getSelectOptions(1);
  },
  mounted(){
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  methods: {
    clearIdLv2Options() {
      this.searchForm.idLv2 = "";
      this.idLv2Options = [];
    },
    async getSelectOptions(level) {
      const params = {
        level,
        size: 300
      };
      const options = await getChartSelectDataDropDown(params);
      const key = `idLv${level}Options`;
      this[key] = options.data.data;
      let optionList = options.data.data.map(item=>{
        return {
          code:item.id,
          name:item.name
        }
      })
      this.tableDataHeader.forEach(item=>{
        if(item.paramValue == "idLv1"){
          item.selectOptions = optionList
        }
      })
      this.getClassifyListAll();
    },
    selIdLv2() {
      if (!this.searchForm.idLv1) {
        return this.$message({
          message: "请先选择一级分类",
          type: "warning"
        });
      }
    },
    async editClassifyItem(editItem) {
      this.tableLoading = true;
      const QADetail = await queryQAid({ id: editItem.id });
      this.tableLoading = false;
      const editItemDetail = QADetail.data.data;
      this.$refs.detailDrawerIndex.evokeDrawer({
        title: "编辑详情",
        opType: "EDIT",
        editQAItem: editItemDetail,
        editCallback: this.getClassifyListAll
      });
    },
    refreshTableList() {
      this.tablePageInfo = {
        size: 30,
        current: 1
      };
    },
    async getClassifyListAll() {
      this.tableLoading = true;
      const params = {
        ...this.tablePageInfo
      };
      Object.keys(this.searchForm).forEach(key => {
        if (this.searchForm[key] !== "") {
          params[key] = this.searchForm[key];
        }
      });

      const res = await getClassifyListAll(params);
      this.tableData = res.data.data.list;
      this.tableTotal = res.data.data.totalCount;
      this.tableLoading = false;
    },
    async openHistoryDialog() {
      this.historyDialogVis = true;
      this.getOpLogList();
    },
    async getOpLogList() {
      this.historyDialogLoading = true;
      const params = {
        ...this.historyTablePageInfo
      };
      const res = await getOpLog(params);
      this.histoTableData = res.data.data.list;
      this.histoTableDataTotal = res.data.data.totalCount;
      this.historyDialogLoading = false;
    },
    openDataAnalysis() {
      this.dataAnalysisVis = true;
    },
    closeAnalysis() {
      this.dataAnalysisVis = false;
    },
    configure() {
      this.$router.push({
        name: "LubQAConfigureDetail"
      });
    },
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 230
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
      this.tablePageInfo.current = 1
      this.getClassifyListAll()
    },
    async tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue == 'state'||obj.paramValue == 'idLv1'){
        this.searchForm[obj.paramValue] = searchVal.toString()
      }else{
        this.searchForm[obj.paramValue] = searchVal
      }
      if(obj.paramValue == 'idLv1'){
        if(searchVal){
          this.idLv2Options = [];
          const params = {
            idLv1: obj.changeValue.toString(),
            level: 2,
            size: 300
          };
          const options = await getChartSelectDataDropDown(params);
          this.idLv2Options = options.data.data;
          let optionList = options.data.data.map(item=>{
            return {
              code:item.id,
              name:item.name
            }
          })
          this.tableDataHeader.forEach(item=>{
            if(item.paramValue == "idLv2"){
              item.selectOptions = optionList
            }
          })
        }else{
          this.clearIdLv2Options()
        } 
      }
      this.tablePageInfo.current = 1
      this.getClassifyListAll()
    },
    // 重置
    handleClearSearch () {
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.clearIdLv2Options()
      this.tablePageInfo.current = 1
      this.getClassifyListAll()
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight()
    });
  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/css/customTable.less";
::-webkit-scrollbar {
  display: none;
}
.train-qaconfiure-container {
  padding:0 20px 0 20px;
  /deep/ .el-dialog {
    border-radius: 8px;
  }
}
.search-bar {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.qa-table-list {
  height: calc(100vh - 250px);
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
