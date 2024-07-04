<template>
  <div class="relativeCon" id="contentId">
    <div class="rightTopCon" @click="gioCreateTaskTrack" v-if="addTaskBtnFlag">
      <el-dropdown size="medium" trigger="click" @command="dropdownClick">
        <el-button type="danger" size="small" :disabled="createTaskDrop.length==0"> 创建任务<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus" command="check" v-if="check_dropdown">检查</el-dropdown-item>
          <el-dropdown-item divided>
            <el-dropdown size="medium" placement="bottom-start" trigger="hover" @command="maintainDropdownClick" v-if="addOil_dropdown || changeOil_dropdown || addFat_dropdown || general_dropdown">
              <span> 保养<i class="el-icon-arrow-right"></i> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="addOil" v-if="addOil_dropdown">加油</el-dropdown-item>
                <el-dropdown-item divided command="changeOil" v-if="changeOil_dropdown">换油</el-dropdown-item>
                <el-dropdown-item divided command="addFat" v-if="addFat_dropdown">加脂</el-dropdown-item>
                <el-dropdown-item divided command="general" v-if="general_dropdown">保养</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-dropdown-item>
          <el-dropdown-item divided icon="el-icon-plus" command="repair" v-if="repair_dropdown">维修</el-dropdown-item>
          <el-dropdown-item divided icon="el-icon-plus" command="other" v-if="other_dropdown">其他</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="work-order-component" id="searchForm">
      <!-- 查询项 -->
      <el-form ref="search" :inline="true" :model="searchForm">
        <el-form-item label="所属客户" v-if="userInfo.userType != 2" class="form-item-outline">
          <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
            <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div style="padding: 0 20px;">
        <custom-table
          :tableHeader="tableDataHeader"
          :tableData="taskTableData"
          :tableHeight="tableHeight + ''"
          :listEmptyType="listEmptyType" 
          :limitFlag="addTaskBtnFlag"
          :loading="loading"
          @changeSearch="tableTitleSearch" 
          @changeSortTable="changeSortTable"
        >
          <template v-slot:planStatus="slotProps">
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
                <div>
                  <span v-if="scope.row.planStatus == 0" style="color:#dd0000">未生效</span>
                  <span v-if="scope.row.planStatus == 1" style="color:rgb(0,136,136);">已生效</span>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-slot:taskType="slotProps">
            <el-table-column
              label="任务类型"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                  title="任务类型"
                  :filterType="slotProps.slotData.filterType"
                  :paramValue="slotProps.slotData.paramValue"
                  :changeValue="slotProps.slotData.changeValue"
                  :selectMultiple="slotProps.slotData.selectMultiple"
                  :selectOptions="slotProps.slotData.selectOptions"
                  @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.taskType == 1">换油</span>
                  <span v-if="scope.row.taskType == 2">加油</span>
                  <span v-if="scope.row.taskType == 3">加脂</span>
                  <span v-if="scope.row.taskType == 4">检查</span>
                  <span v-if="scope.row.taskType == 5">保养</span>
                  <span v-if="scope.row.taskType == 6">维修</span>
                  <span v-if="scope.row.taskType == 7">其他</span>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-slot:taskCycle="slotProps">
            <el-table-column
              label="任务周期"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div>
                  <span v-if="scope.row.taskCycle == 0">不重复</span>
                  <span v-if="scope.row.taskCycle == 1">按日</span>
                  <span v-if="scope.row.taskCycle == 2">按周</span>
                  <span v-if="scope.row.taskCycle == 3">按月</span>
                  <span v-if="scope.row.taskCycle == 4">按年</span>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-slot:actionType="slotProps">
            <el-table-column
              label="执行方式"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div style="display:flex;align-items:center">
                  <div>
                    <span v-if="scope.row.actionType == 1">按岗位领取</span>
                    <span v-if="scope.row.actionType == 2">指定领取人</span>
                    <span v-if="scope.row.actionType == 3">指定负责人</span>
                  </div>
                  <div>
                    <el-tooltip class="item" effect="dark" :content="scope.row.actionTarget" placement="top">
                      <i class="el-icon-warning"></i>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-slot:companyName="slotProps">
            <el-table-column
              label="所属客户"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
              v-if="userInfo.userType < 2"
            >
              <template slot-scope="scope">
                {{ scope.row.companyName || "-" }}
              </template>
            </el-table-column>
          </template>
          <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
          <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-link v-if="editBtnFlag" @click="copyTask(scope.row)" style="margin-right:10px;color:#001450">复制</el-link>
              <el-link v-if="editBtnFlag" @click="edit(scope.row)" style="margin-right:10px;color:#001450">编辑 </el-link>
              <el-link v-if="deleteBtnFlag" @click="deleteRow(scope.row)" style="margin-right:10px;color:#DD0000">删除 </el-link>
            </template>
          </el-table-column>
        </custom-table>
        <!-- 分页 -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.current"
          :page-size="searchForm.size"
          :page-sizes="[30, 60, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          class="listOptimizePage"
        ></el-pagination>
    </div>
    <!-- 删除提示框 -->
    <el-dialog title="删除任务" :visible.sync="deleteItemVisible" :close-on-click-modal="false" width="30%">
      <span>删除后，任务将无法继续执行，但不会影响有执行批号的任务。请谨慎操作。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteItemVisible = false" size="small">取 消</el-button>
        <el-button type="danger" @click="confirmDeleteItem" size="small">删 除</el-button>
      </span>
    </el-dialog>
    <customer-list ref="selectCustomer" :showCustomerDialog="showCustomerDialog" @handleSubmitCustomer="handleSubmitCustomer" @handleCloseCustomer="handleCloseCustomer"></customer-list>
  </div>
</template>

<script>
import customTable from "../../tableComponents/customTable.vue";
import columnHeader from "../../tableComponents/headerComponent";
import customerList from "../../tableComponents/customerList";
export default {
  components: {
    "custom-table": customTable,
    "column-header":columnHeader,
    "customer-list":customerList,
  },
  data() {
    return {
      listEmptyType:'task_manager',
      mainminheight: `height:${document.documentElement.clientHeight - 240}px`,
      tableHeight: 0,
      actionTypeList: [],
      selectActionList: [],
      multipleFlag: false,
      pageHeight: "",
      screenWidth: null,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      searchForm: {
        planNo: "",
        planTitle: "",
        planStatus: "",
        taskType: "",
        dateRange: [],
        taskType: "",
        companyName: "",
        companyId:'',
        current: 1,
        size: 30
      },
      taskTypeList: [
        {
          label: "换油",
          value: 1
        },
        {
          label: "加油",
          value: 2
        },
        {
          label: "加脂",
          value: 3
        },
        {
          label: "检查",
          value: 4
        },
        {
          label: "保养",
          value: 5
        },
        {
          label: "维修",
          value: 6
        },
        {
          label: "其他",
          value: 7
        }
      ],
      taskTableData: [],
      totalNumber: 0,
      statusList: [
        {
          label: "未生效",
          value: 0
        },
        {
          label: "已生效",
          value: 1
        }
      ],
      taskTypeList: [
        {
          label: "换油",
          value: 1
        },
        {
          label: "加油",
          value: 2
        },
        {
          label: "加脂",
          value: 3
        },
        {
          label: "检查",
          value: 4
        },
        {
          label: "保养",
          value: 5
        },
        {
          label: "维修",
          value: 6
        },
        {
          label: "其他",
          value: 7
        }
      ],
      customerList: [],
      deleteItemVisible: false,
      tableRow: {},
      createType: "",
      deleteBtnFlag: false,
      editBtnFlag: false,
      addTaskBtnFlag: false,
      createTaskDrop: [],
      check_dropdown: false, // 检查
      addOil_dropdown: false, // 加油
      changeOil_dropdown: false, // 换油
      addFat_dropdown: false, // 加脂
      general_dropdown: false, // 一般保养
      repair_dropdown: false, // 维修
      other_dropdown: false, // 其他
      tableHeight:null,
      tableDataHeader: [
        { filterType: "input", paramValue: "planNo", changeValue:"", label: "任务ID", prop: "planNo", width: "100", tooltip: true},
        { filterType: "input", paramValue: "planTitle", changeValue:"", label: "任务主题", prop: "planTitle", width: "100", tooltip: true},
        { filterType: "selection", paramValue: "planStatus", selectMultiple: true, selectOptions:  [{ code: 0, name: "未生效" },{code:1,name:'已生效'}], changeValue:"", label: "状态", slot: "planStatus", width: "180" },
        { filterType: "selection", paramValue: "taskType", selectMultiple: true, selectOptions:  [{name: "换油",code: 1},{name: "加油",code: 2},{name: "加脂",code: 3},{name: "检查",code: 4},{name: "保养",code: 5},{name: "维修",code: 6},{name: "其他",code: 7}], changeValue:"", label: "任务类型", slot: "taskType", width: "180" },
        { label: "执行方式", slot: "actionType", width: "180" },
        { filterType: "dateRange", paramValue: "dateRange", changeValue:"", label: "有效时间", prop: "planTime", width: "100", tooltip: true},
        { label: "任务项", prop: "taskItemCount", width: "100", tooltip: true},
        { label: "所属客户",slot: "companyName",width: "200"},
        { label: "操作", slot: "operation" }
      ],
      selectCustomerList:[],
      showCustomerDialog:false
    };
  },
  created() {
    this.pageHeight = document.documentElement.clientHeight;
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "web_Plan_delete") {
        // 删除
        this.deleteBtnFlag = true;
      }
      if (buttonList[i].menuCode == "web_Plan_edit") {
        // 编辑
        this.editBtnFlag = true;
      }
      if (buttonList[i].menuCode == "web_Task_Add") {
        // 创建
        this.addTaskBtnFlag = true;
      }
    }
    if(this.userInfo.userType != 2) {
      this.getCustomerData();
    } 
    
    // 获取任务列表
    this.getTableData();
    // 获取当前用户可用的任务类型
    this.getTaskType();
    // 获取执行方式下拉
    this.getActionType();
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        this.pageHeight = document.documentElement.clientHeight;
        this.mainminheight = `height:${document.documentElement.clientHeight - 240}px`;
      })();
    };
    this.$nextTick(()=>{
      this.handleHeight()
    })
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  methods: {
    handleHeight(){
      // const searchFormHeight = document.getElementById("searchForm").clientHeight
      // this.tableHeight = Number(document.documentElement.clientHeight)-Number(searchFormHeight)-200
      this.tableHeight = Number(document.documentElement.clientHeight) - 226
    },
    gioCreateTaskTrack() {
      this.$gio.toCreateTask({
        entrance: "任务管理页面"
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
    getActionType() {
      this.requestMethodGet("/device/check/taskManage/executionWays", {}).then(res => {
        if (res.data.code == 1000) {
          this.actionTypeList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getTaskType() {
      this.requestMethodGet("/device/check/taskManage/taskTypes", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          let codeList = [];
          if (data.length) {
            data.forEach(it => {
              codeList.push(it.code);
            });
          }
          this.createTaskDrop = data
          this.check_dropdown = codeList.includes("4");
          this.addOil_dropdown = codeList.includes("2");
          this.changeOil_dropdown = codeList.includes("1");
          this.addFat_dropdown = codeList.includes("3");
          this.general_dropdown = codeList.includes("5");
          this.repair_dropdown = codeList.includes("6");
          this.other_dropdown = codeList.includes("7");
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    gioTrackFilterManage(params) {
      this.$gio.filterTaskInTaskManagement({
        effectiveTime: `${params.planStartTime} - ${params.planEndTime}`,
        customer: params.companyName,
        taskID: params.planNo,
        taskStatus: params.planStatus ? "已生效" : "未生效",
        taskType: params.taskType ? params.taskType : "无",
        taskTitle:params.planTitle,
        effectiveStatus :params.planStatus
        // taskType: params.taskType ? this.taskTypeList.find(task => task.value == params.taskType).label : "无"
      });
    },
    getTableData() {
      const params = { ...this.searchForm };
      if (params.dateRange && params.dateRange.length) {
        params.planStartTime = params.dateRange[0];
        params.planEndTime = params.dateRange[1];
      } else {
        params.planStartTime = "";
        params.planEndTime = "";
      }
      if (this.selectActionList.length) {
        params.actionType = this.selectActionList[0];
        params.actionTarget = this.selectActionList[1];
      } else {
        params.actionType = "";
        params.actionTarget = "";
      }
      params.menuCode='taskManager',
      this.requestMethodPost("/device/check/taskManage/list", params).then(res => {
        if (res.data.code == 1000) {
          this.gioTrackFilterManage(params);
          const data = res.data.data.list;
          if (data.length) {
            data.forEach(it => {
              it.planTime = it.planStartTime + "至" + it.planEndTime;
            });
          }
          this.taskTableData = data;
          this.totalNumber = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 创建任务选择任务项
    dropdownClick(type) {
      this.$gio.toCreateTask({
        entrance: "任务管理页面"
      });
      this.createType = type;
      // 匹配不同得type跳转页面带参数
      if (type) {
        this.$router.push({
          path: "/taskManager/createTaskNew",
          query: {
            taskType: this.createType,
            pageType: "task"
          }
        });
      }
      this.$gio.selectTask({
        entrance: "任务管理页面"
      });
    },
    // 保养项目
    maintainDropdownClick(type) {
      this.createType = type;
      // 匹配不同得type跳转页面带参数
      this.$router.push({
        path: "/taskManager/createTaskNew",
        query: {
          taskType: this.createType,
          pageType: "task"
        }
      });
    },
    // 查询所属客户
    getCustomerData() {
      let params = {
        companyType: 2,
        size: 500,
        status: 1,
        menuCode:'taskManager',
        accountName: this.selectCompanyName
      };
      this.requestMethodPostTip("/web/customer/filterAccount", params)
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
    // 模糊搜索公司
    customerAllFilter(val) {
      this.selectCompanyName = val;
      this.getCustomerData();
    },
    clearCustomer(val) {
      if (!val) {
        this.selectCompanyName = "";
        this.getCustomerData();
      }
    },
    // 重置搜索条件
    resetSearch() {
      if(this.searchForm.companyId){
        this.$refs["selectCustomer"].clearSelectCustomer()
      }
      this.selectCustomerList = []
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.selectActionList = [];
      this.searchForm.dateRange = [];
      this.searchForm.current = 1;
      this.searchForm.size = 30;
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.getTableData();
    },
    // 一页多少条
    handleSizeChange(val) {
      this.searchForm.size = val;
      this.getTableData();
    },
    // 分页
    handleCurrentChange(val) {
      this.searchForm.current = val;
      this.getTableData();
    },
    // 编辑
    edit(row) {
      this.$router.push({
        path: "/taskManager/createTaskNew",
        query: {
          taskType: row.taskType,
          pageType: "task",
          editId: row.planId
        }
      });
      this.$gio.editTask();
    },
    // 复制
    copyTask(row) {
      this.$router.push({
        path: "/taskManager/createTaskNew",
        query: {
          taskType: row.taskType,
          pageType: "task",
          editId: row.planId,
          isCopy: true
        }
      });
      this.$gio.copyTask();
    },
    // 删除
    deleteRow(row) {
      this.tableRow = row;
      this.deleteItemVisible = true;
      this.$gio.deleteTask({
        operation: "点击删除按钮"
      });
    },
    // 确定删除
    confirmDeleteItem() {
      let url = `/device/check/taskManage/delete`;
      this.requestMethodGet(url, { planId: this.tableRow.planId }).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.deleteItemVisible = false;
          this.searchForm.current = 1;
          this.searchForm.size = 30;
          this.getTableData();
          this.$gio.deleteTask({
            operation: "弹框中点击确定"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 250
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
      this.searchForm.current = 1;
      this.getTableData();
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue=="planStatus"||obj.paramValue=="taskType"){
        this.searchForm[obj.paramValue] = searchVal.toString()
      }else{
        this.searchForm[obj.paramValue] = searchVal
      }
      this.searchForm.current = 1;
      this.getTableData();
    },
    showSelectCustomer() {
      this.showCustomerDialog = true
    },
    handleClearCustomer() {
      this.selectCustomerList = []
      this.searchForm.companyId = ""
      this.searchForm.current = 1;
      this.getTableData();
      this.$refs["selectCustomer"].clearSelectCustomer()
    },
    handleSubmitCustomer(e){
      this.selectCustomerList = e
      let selectList = this.selectCustomerList.map(item=>{
        return item.companyId
      })
      this.searchForm.companyId = selectList.join(",")
      this.searchForm.current = 1;
      this.getTableData();
      this.showCustomerDialog = false
    },
    handleCloseCustomer(){
      this.showCustomerDialog = false
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
.work-order-component {
  padding:0 20px 12px 20px;
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
  .el-form-item {
    margin-bottom: 0px !important;
  }
  // 设置显示两行，超出省略
  /deep/ .el-table th > .cell {
    word-break: keep-all !important;
    white-space: nowrap !important;
  }
}
</style>
