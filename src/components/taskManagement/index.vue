<template>
  <div class="task-container" id="taskDiv">
    <div style="position: absolute;right: 30px;top: -50px;display: flex;align-items: center;">
      <p class="tips">
        <i class="el-icon-warning" />
        <span style="margin-left: 8px"> 仅统计与登陆人相关的任务</span>
      </p>
    </div>
    <!-- 统计看板 -->
    <header class="task-situation-small" id="taskSituationDiv">
      <div class="task-situation-item task-situation-super" v-for="item in taskCate" :key="item.cateName">
        <div class="task-item-left">
          <div class="task-left-text">{{ item.cateName }}</div>
          <div class="task-left-number">{{ item.val }}</div>
        </div>
      </div>
    </header>
    <div class="table-container">
      <div class="toolbox-con flexBetween marTop">
        <el-form ref="form" :model="searchForm" :inline="true" size="small" id="formDiv">
          <el-form-item label="所属客户" v-if="userInfo.userType != 2 && formDivLen>=1" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item v-show="formDivLen>=2" class="form-item-outline" label="所属车间">
            <el-select v-model="searchForm.workshopIdList" placeholder="请选择" class="search-info" size="small" clearable @visible-change="visibleChange" filterable multiple collapse-tags>
              <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="formDivLen>=3" class="form-item-outline" label="时间区间">
            <el-select v-model="searchForm.dataScopeList" size="small" @change="changeTaskTime()" class="search-info" multiple collapse-tags filterable>
              <el-option label="当前" :value="1"></el-option>
              <el-option label="未来" :value="2"></el-option>
              <el-option label="全部" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="formDivLen>=4" class="form-item-outline" label="设备类型">
            <el-cascader
              size="small"
              placeholder="请选择"
              :options="eptList"
              v-model="searchForm.deviceTypeList"
              filterable
              clearable
              collapse-tags
              :style="{width:(searchForm.deviceTypeList.length==0)?'150px':'450px'}"
              :props="{ value: 'code', label: 'name' , multiple: true }"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="handleMoreSearch">{{ showMoreSearch ? "收起" : "更多筛选" }}</el-button>
            <el-button size="small" type="danger" plain @click="getTaskListData">搜索</el-button>
            <el-button size="small" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button v-if="exportFlag" type="danger" plain size="small" @click="exportTodoData">导出任务结果</el-button>
          <div v-if="createTaskBtnFlag" class="marLeft">
            <div>
              <el-dropdown size="medium" trigger="click" @command="dropdownClick">
                <el-button type="danger" size="small" :disabled="createTaskDrop.length==0"> 创建任务<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-plus" command="check" v-if="check_dropdown">检查</el-dropdown-item>
                  <el-dropdown-item divided>
                    <el-dropdown
                      size="medium"
                      placement="bottom-start"
                      trigger="hover"
                      @command="maintainDropdownClick"
                      v-if="addOil_dropdown || changeOil_dropdown || addFat_dropdown || general_dropdown"
                    >
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
          </div>
          <custom-field class="marLeft" @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="todoTask"></custom-field>
        </div>
      </div>
      <div class="moreSearchCon" id="formMoreDiv" v-if="showMoreSearch">
        <el-form ref="form" :model="searchForm" :inline="true" size="small">
          <el-form-item label="所属客户" v-if="userInfo.userType != 2 && formDivLen<1" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item v-show="formDivLen<2" class="form-item-outline" label="所属车间">
            <el-select v-model="searchForm.workshopIdList" placeholder="请选择" class="search-info" size="small" clearable @visible-change="visibleChange" multiple filterable collapse-tags>
              <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="formDivLen<3" class="form-item-outline" label="时间区间">
            <el-select v-model="searchForm.dataScopeList" size="small" @change="changeTaskTime()" class="search-info" multiple collapse-tags filterable>
              <el-option label="当前" :value="1"></el-option>
              <el-option label="未来" :value="2"></el-option>
              <el-option label="全部" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="formDivLen<4" class="form-item-outline" label="设备类型">
            <el-cascader
              size="small"
              placeholder="请选择"
              :options="eptList"
              v-model="searchForm.deviceTypeList"
              filterable
              clearable
              collapse-tags
              :style="{width:(searchForm.deviceTypeList.length==0)?'150px':'450px'}"
              :props="{ value: 'code', label: 'name', multiple: true }"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item class="form-item-outline" label="设备位置" v-if="showMoreSearch">
            <el-input clearable v-model="searchForm.devicePosition" class="search-info" size="small" placeholder="请输入" maxlength="16" @change="getTaskListData" @clear="getTaskListData"></el-input>
          </el-form-item>
          <el-form-item class="form-item-outline" label="设备分组" v-if="showMoreSearch">
            <el-cascader
              :options="groupList"
              :key="groupKey"
              :props="{ label: 'groupName', value: 'id', multiple: true }"
              collapse-tags
              size="small"
              :style="{width:(searchForm.groupIdList.length==0)?'150px':'270px'}"
              v-model="searchForm.groupIdList"
              placeholder="请选择"
              no-data-text="暂无分组"
              @visible-change="visibleChange"
              filterable
              clearable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item class="form-item-outline" label="设备编码" v-if="showMoreSearch">
            <el-input clearable v-model="searchForm.deviceCode" class="search-info" size="small" placeholder="请输入" maxlength="16" @change="getTaskListData" @clear="getTaskListData"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog @close="closeDialog" title="转派任务" :visible.sync="opDialogVisible" width="20%">
        <div style="margin-top: 20px">
          <el-form ref="transferForm" :model="transferForm" :rules="rules" label-width="80px">
            <el-form-item label="负责人" prop="oilTaskPrincipalUserId">
              <el-select v-model="transferForm.oilTaskPrincipalUserId" size="small" style="width: 96%">
                <el-option :label="item.nameCn" :value="item.userId" v-for="item in chargePersonList" :key="item.userId"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="bottom-group">
            <el-button size="small" @click="cancelTransfer" plain>取消</el-button>
            <el-button size="small" type="danger" @click="submitTransfer">提交</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="导出为Excel" :visible.sync="dialogVisibleExport" width="30%" :before-close="handleClose">
        <div style="color: #333;font-size: 14px;font-weight: 400;margin-top: 20px;">
          当前共 <span style="color:#dd0000;">{{ todoCheckTaskList.length > 0 ? todoCheckTaskList.length : total }}</span> 条数据，是否需要导出？
        </div>
        <div style="margin-top:10px;line-height: 22px;color: #666;">
          <div>注意：</div>
          <div>1、只支持导出状态为“已执行”的任务的结果，若选择了其他状态的任务，这些任务将不会被导出；</div>
          <div>2、由于不同任务类型的结果格式不同，请注意查看Excel的底部分页；</div>
          <div>3、Excel每页最多支持10000条数据，若超过上限将导致导出失败</div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleExport = false" size="small">取 消</el-button>
          <el-button type="danger" @click="submitExport" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <div>
        <custom-table
          ref="tableRef"
          :class="[showMoreSearch?'moreSelectMar':'']"
          :tableHeader="tableDataHeader"
          :tableData="taskListTableData"
          :tableHeight="tableHeight + ''"
          :listEmptyType="listEmptyType"
          :limitFlag="createTaskBtnFlag"
          @selectionChange="handleSelectionChange"
          @changeSearch="tableTitleSearch" 
          @changeSortTable="changeSortTable"
          :loading="loading"
        >
          <el-table-column slot="selection" v-if="exportFlag" width="55" align="center" type="selection" :resizable="false" fixed></el-table-column>
          <template v-slot:taskTypeList="slotProps">
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
                  <span v-if="!scope.row.taskType">-</span>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-slot:taskStatus="slotProps">
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
                  <span v-if="scope.row.taskStatus == 1" style="color:#dd0000">待领取</span>
                  <span v-if="scope.row.taskStatus == 2" style="color:#008888">待执行</span>
                  <span v-if="scope.row.taskStatus == 3" style="color:#999999">已执行</span>
                  <span v-if="scope.row.taskStatus == 4" style="color:#999999">已取消</span>
                  <span v-if="!scope.row.taskStatus" style="color:#999999">-</span>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-slot:actionType="slotProps">
            <el-table-column
              label="执行方式"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            >
              <template slot="header">
                <column-header 
                title="执行方式"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
                v-if="userInfo.userType == 2"/>
              </template>
              <template slot-scope="scope">
                <div style="display:flex;align-items:center">
                  <div>
                    <span v-if="scope.row.actionType == 1">按岗位领取</span>
                    <span v-if="scope.row.actionType == 2">指定领取人</span>
                    <span v-if="scope.row.actionType == 3">指定负责人</span>
                    <span v-if="!scope.row.actionType">-</span>
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
          <template v-slot:companyName="slotProps" v-if="userInfo.userType != 2">
            <el-table-column
              label="所属客户"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                title="所属客户"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.companyName }}</span>
                  <span class="self-tips" v-if="scope.row.customerCompanyType == 0">直</span>
                  <img v-if="scope.row.pesFlag == '1' || scope.row.pesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                  <img v-if="scope.row.pesFlag == '2' || scope.row.pesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                  <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-slot:taskUserName="slotProps">
              <el-table-column
                :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                label="负责人"
                show-overflow-tooltip
              >
                <template slot="header">
                  <column-header 
                    title="负责人"
                    :filterType="slotProps.slotData.filterType"
                    :paramValue="slotProps.slotData.paramValue"
                    :changeValue="slotProps.slotData.changeValue"
                    @chSubmit="tableTitleSearch"/>
                </template>
                <template slot-scope="scope">
                  <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                    <div>
                      <div style="display: flex;align-items:center;">
                        <img :src="taskUserDetail.headUrl ? taskUserDetail.headUrl : require('../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                        <div style="flex: 1; margin-left: 10px">
                          <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ taskUserDetail.userName }}</div>
                        </div>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">电话: </span>
                        <span>{{ formatPhonenumber(taskUserDetail.phonenumber) }}</span>
                        <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="taskUserDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel" v-if="taskUserDetail.phonenumber">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">邮箱: </span>
                        <span>{{ formatEmail(taskUserDetail.email) }}</span>
                        <el-button class="copy_mail" type="text" v-clipboard:copy="taskUserDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px" v-if="taskUserDetail.email">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                    </div>
                    <span
                      slot="reference"
                      :disabled="!scope.row.taskUserName"
                      class="copy_text"
                      type="text"
                      style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                      @click="taskUserNameDetail(scope)"
                      >{{ scope.row.taskUserName || "-" }}</span
                    >
                  </el-popover>
                </template>
              </el-table-column>
            </template>
          <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
          <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-link @click="viewDetail(scope.row)" style="margin-right:10px;color:#00144f">查看</el-link>
            </template>
          </el-table-column>
        </custom-table>
        <!-- 分页 -->
        <el-pagination
          background
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          :current-page="searchForm.current"
          :page-size="searchForm.size"
          :page-sizes="[30, 60, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          class="listOptimizePage"
        ></el-pagination>
      </div>
      <customerListCom ref="selectCustomer" :selectCustomerList="selectCustomerList" :showCustomerDialog="showCustomerDialog" @handleSubmitCustomer="handleSubmitCustomer" @handleCloseCustomer="handleCloseCustomer"></customerListCom>
    </div>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import { taskListTableSettings } from "./tableSettings";
import customField from "../tableComponents/customField.vue";
import sortType from "../tableComponents/sortType.vue";
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
import commonJS from "../tableComponents/tableCommon.js";
export default {
  mixins: [commonJS],
  components: {
    "custom-field": customField,
    "sort-type": sortType,
    "custom-table": customTable,
    "column-header":columnHeader,
    customerListCom: ()=>import("../tableComponents/customerList")
  },
  data() {
    return {
      listEmptyType:'task_manager',
      limitFlag:false,
      loading: false,
      taskDivHeight: document.documentElement.clientHeight - 184,
      formDivHeight: 0,
      taskStatusMap: {
        1: "待领取",
        2: "待执行",
        3: "已执行",
        4: "已取消"
      },
      taskTypeMap: {
        1: "换油",
        2: "加油",
        3: "加脂",
        4: "检查",
        5: "保养",
        6: "维修",
        7: "其他"
      },
      executeDateMap: {
        1: "当前",
        2: "未来",
        3: "全部",
        4: "选择日期"
      },
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      actionTypeList: [],
      selectActionList: [],
      exportFlag: false,
      screenWidth: null,
      $btn__permission_codes: [],
      taskListTableSettings,
      taskOverviewInfo: {},
      opDialogVisible: false,
      tableSelection: [],
      total: 0,
      taskCate: [
        { cateName: "待办任务数", code: "taskNumber", val: null },
        { cateName: "未完成数", code: "unfinishedTaskNumber", val: null },
        { cateName: "未完成比例", code: "unfinishedTaskRatio", val: null },
        { cateName: "完成比例", code: "finishedTaskRatio", val: null },
        { cateName: "取消比例", code: "cancelTaskRatio", val: null },
        { cateName: "相关设备数", code: "deviceNumber", val: null },
        { cateName: "月度检查设备数", code: "deviceNumberOfMonth", val: null }
      ],
      transferForm: {
        oilTaskPrincipalUserId: ""
      },
      taskTime: [],
      searchForm: {
        dataScopeList: [1],
        taskName: "",
        taskPlanNo: "",
        planTitle: "",
        taskTypeList: "",
        companyId: "",
        devicePosition: "",
        startDate: "",
        endDate: "",
        workshopIdList: [],
        deviceTypeList: [],
        taskBatchNo: "",
        taskStatusList: [2, 3],
        taskUserName: "",
        groupIdList: [],
        deviceCode: "",
        size: 30,
        current: 1
      },
      dialogVisibleExport: false, // 导出的提示内容
      chargePersonList: [],
      taskListTableData: [],
      rules: {
        oilTaskPrincipalUserId: [{ required: true, message: "请选择负责人", trigger: "blur" }]
      },
      modelStateOb: {
        // Record.companyNumber 记录美孚/经销商比客户多一步选择的客户companyNumber
        Record: {},
        secListRecord: [],
        secTotal: 0,
        secSelectionRecord: [],
        dialogVisible: false,
        currentStep: 0,
        modelBoxWidth: "28%"
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      createTaskBtnFlag: false,
      createTaskDrop: [],
      check_dropdown: false, // 检查
      addOil_dropdown: false, // 加油
      changeOil_dropdown: false, // 换油
      addFat_dropdown: false, // 加脂
      general_dropdown: false, // 一般保养
      repair_dropdown: false, // 维修
      other_dropdown: false, // 其他
      statusList: [
        {
          name: "待领取",
          code: 1
        },
        {
          name: "待执行",
          code: 2
        },
        {
          name: "已执行",
          code: 3
        },
        {
          name: "已取消",
          code: 4
        }
      ],
      eptList: [],
      workshopList: [],
      showMoreSearch: false,
      customerList: [],
      selectCompanyName: "",
      groupList: [],
      groupKey: 1,
      todoCheckTaskList: [],
      sortMethodList: [
        {
          label: "任务名称",
          value: "taskName"
        },
        {
          label: "任务ID",
          value: "taskPlanNo"
        },
        {
          label: "计划执行时间",
          value: "taskTime"
        },
        {
          label: "创建日期",
          value: "createTime"
        }
      ],
      sortMethod: "createTime",
      sortType: false,
      tableHeight: null,
      customFieldlistUnit: [
        {
          fieldName: "taskName",
          visible: 2
        },
        {
          fieldName: "planTitle",
          visible: 2
        },
        {
          fieldName: "taskPlanNo",
          visible: 1
        },
        {
          fieldName: "taskTypeList",
          visible: 1
        },
        {
          fieldName: "taskStatus",
          visible: 1
        },
        {
          fieldName: "actionType",
          visible: 1
        },
        {
          fieldName: "companyName",
          visible: 1
        },
        {
          fieldName: "taskUserName",
          visible: 1
        },
        {
          fieldName: "taskTime",
          visible: 1
        },
        {
          fieldName: "operation",
          visible: 2
        }
      ],
      customFieldlist: [],
      tableDataHeaderInit: {
        selection: { slot: "selection" },
        taskName: { filterType: "input", paramValue: "taskName", changeValue:"", sortTypeVal: "sortDefault", label: "任务名称", prop: "taskName", width: "160", fixed: "left", tooltip: true },
        planTitle: { filterType: "input", paramValue: "planTitle", changeValue:"", label: "任务主题", prop: "planTitle", width: "200", fixed: "left", tooltip: true },
        taskPlanNo: { filterType: "input", paramValue: "taskPlanNo", changeValue:"", sortTypeVal: "sortDefault", label: "任务ID", prop: "taskPlanNo", width: "150", tooltip: true },
        taskTypeList: { selectMultiple: true, filterType: "selection", paramValue: "taskTypeList", selectOptions:  [{ name: "加油", code:"2"},{ name: "换油", code:"1"},{ name: "加脂", code:"3"},{ name: "检查", code:"4"},{ name: "保养", code:"5"},{ name: "维修", code:"6"},{ name: "其他", code:"7"}], changeValue:"", label: "任务类型", slot: "taskTypeList", width: "100" },
        taskStatus: { selectMultiple: true, filterType: "selection", paramValue: "taskStatusList", selectOptions:  [{ name: "待领取",code: 1 },{ name: "待执行",code: 2 },{ name: "已执行",code: 3 },{ name: "已取消",code: 4 }], changeValue:"", label: "状态", slot: "taskStatus", width: "100" },
        actionType: { filterType: "cascaderActtype", paramValue: "actionType", selectOptions: [], changeValue:"", label: "执行方式", slot: "actionType", width: "150" },
        companyName: { filterType: "input", paramValue: "companyName", changeValue:"", label: "所属客户", slot: "companyName", width: "200", tooltip: true },
        taskUserName: { filterType: "input", paramValue: "taskUserName", changeValue:"", label: "负责人", slot: "taskUserName", width: "100", tooltip: true },
        taskTime: { filterType: "datetimerange", paramValue: "taskTime", changeValue:"", sortTypeVal: "sortDefault", label: "计划执行时间", prop: "taskTime", width: "150", tooltip: true },
        operation: { label: "操作", slot: "operation" }
      },
      tableDataHeader: [],
      taskSituationDivHeight: 0,
      selectCustomerList:[],
      showCustomerDialog:false,
      formDivLen:3,
      taskUserDetail:{}
    };
  },
  beforeRouteLeave(to, from, next) {
    sessionStorage.setItem("taskListParams", JSON.stringify(this.searchForm));
    sessionStorage.setItem("taskListAction", JSON.stringify(this.selectActionList));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/taskManagement/taskDetail") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  async mounted() {
    if (this.$route.params.isSaveQuery) {
      this.searchForm = JSON.parse(sessionStorage.getItem("taskListParams"));
      if(this.searchForm.deviceTypeList!=[]&&this.searchForm.deviceTypeList!=""){
        this.searchForm.deviceTypeList = this.searchForm.deviceTypeList
      }
      if(this.searchForm.companyId){
        this.selectCustomerList = this.searchForm.companyId.split(',')
      }
      if(this.searchForm.groupIdList!=[]&&this.searchForm.groupIdList!=""){
        this.searchForm.groupIdList = this.searchForm.groupIdList
      }
      let taskListAction = JSON.parse(sessionStorage.getItem("taskListAction"))
      if(taskListAction.length>0){
        this.selectActionList = taskListAction
        this.searchForm.actionType = taskListAction[0]
        this.searchForm.actionTarget = taskListAction[1]
      }
    }
    this.screenWidth = document.body.clientWidth;
    this.handleTableHeight();
    if(this.userInfo.userType == 2){
      this.getWorkshopList();
      this.getGroupTree();
      this.getActionType();
    }else{
      if(this.$route.params.isSaveQuery&&this.searchForm.companyId){
        const res = await this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", {companyId: this.searchForm.companyId,workshopName: "",current: 1,size: 300})
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.workshopList = list;
        }
        const groupRes = await this.requestMethodGet("/weChat/deviceGroup/getDeviceGroupTree", {companyId: this.searchForm.companyId})
        if (groupRes.data.code == 1000) {
          this.groupList = groupRes.data.data;
        }
      }
      this.getDataList();
    }
    window.addEventListener("resize", () => {
      this.screenWidth = document.body.clientWidth;
      this.mainminheight = `height:${document.documentElement.clientHeight - 220}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  created() {
    this.getOverview();
    // 获取当前用户可用的任务类型
    this.getTaskType();
    this.getEptList();
    if(this.userInfo.userType < 2) {
      this.getCustomerData();
    }
    
    this.getCustomFieldList(); //获取自定义字段列表
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "web_Task_Add") {
        // 创建
        this.createTaskBtnFlag = true;
      }
      if (buttonList[i].menuCode == "web_InspectionTask_Export") {
        // 导出
        this.exportFlag = true;
      }
    }
    if (this.userInfo.userType == "2") {
      const index = this.taskListTableSettings.findIndex(item => item.label == "所属客户");
      if (index != -1) {
        this.taskListTableSettings.splice(5, 1);
      }
    }
  },
  methods: {
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        if(document.getElementById("taskDiv")){
          let formDivWidth = (document.getElementById("taskDiv").clientWidth - 346);
          this.formDivLen = Math.trunc( formDivWidth / 270)
        }
        if (document.getElementById("taskSituationDiv")) {
          this.taskSituationDivHeight = document.getElementById("taskSituationDiv").clientHeight;
        }
        if (document.getElementById("formDiv")) {
          this.formDivHeight = document.getElementById("formDiv").clientHeight;
        }
        let moreSearchHeight = 0
        if (document.getElementById("formMoreDiv")) {
          moreSearchHeight = Number(document.getElementById("formMoreDiv").clientHeight) + 12;
        }
        this.tableHeight = Number(this.taskDivHeight) - Number(this.formDivHeight) -Number(this.taskSituationDivHeight) - 20 - Number(moreSearchHeight);
      }, 200);
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
    // 选择行数据
    handleSelectionChange(list) {
      this.todoCheckTaskList = list;
    },
    submitExport() {
      const date = new Date();
      const year = date.getFullYear(); // 获取当前年份
      const mon = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1); // 获取当前月份
      const da = date.getDate()+1 > 10 ? date.getDate() : "0" + date.getDate(); // 获取当前日
      
      let time = "" + year + mon + da
      let title = '任务结果'+'_'+time+'.xlsx'
      let otherTodoTaskList = [];
      this.todoCheckTaskList.forEach(it => {
        otherTodoTaskList.push(it);
      });
      // 导出
      let exportTask = [];
      this.todoCheckTaskList.forEach(it => {
        exportTask.push(it.id);
      });
      let orderBy = this.sortMethod;
      let descFlag = !this.sortType;
      const params = {
        ...this.searchForm,
        orderBy,
        descFlag
      };
      params.taskStatusList = params.taskStatusList==""?[]:params.taskStatusList
      params.taskTypeList = params.taskTypeList==""?[]:params.taskTypeList
      if (params.deviceTypeList.length) {
        let deviceTypeList = []
        params.deviceTypeList.forEach(item=>{
          deviceTypeList.push(item[item.length - 1])
        })
        params.deviceTypeList = deviceTypeList;
      } else {
        params.deviceTypeList = [];
      }
      if (params.groupIdList.length) {
        let groupIdList = []
        params.groupIdList.forEach(item=>{
          groupIdList.push(item[item.length - 1])
        })
        params.groupIdList = groupIdList;
      } else {
        params.groupIdList = [];
      }
      if (this.selectActionList.length) {
        params.actionType = this.selectActionList[0];
        params.actionTarget = this.selectActionList[1];
      } else {
        params.actionType = "";
        params.actionTarget = "";
      }
      const ids = exportTask.join(",");
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let paramObj = {
        ids: ids,
        actionType:params.actionType,
        actionTarget:params.actionTarget,
        groupIdList:params.groupIdList,
        deviceTypeList:params.deviceTypeList,
        companyId:params.companyId,
        dataScopeList:params.dataScopeList,
        descFlag:params.descFlag,
        deviceCode:params.deviceCode,
        devicePosition:params.devicePosition,
        endDate:params.endDate,
        planTitle:params.planTitle,
        orderBy:params.orderBy,
        startDate:params.startDate,
        taskBatchNo:params.taskBatchNo,
        taskName:params.taskName,
        taskPlanNo:params.taskPlanNo,
        taskStatusList:params.taskStatusList,
        taskTypeList:params.taskTypeList,
        taskUserName:params.taskUserName,
        workshopIdList:params.workshopIdList,
        responseTypeBlob: true,
        menuCode:'Task_web'
      }
      this.requestMethodPost("/device/check/todoTask/exportTaskOfCheckItem", paramObj).then(res => {
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
              link.setAttribute("download", title);
              document.body.appendChild(link);
              link.click();
              that.dialogVisibleExport = false
              that.$refs["tableRef"].clearSelection();
              that.$message({
                message: "下载成功",
                type: "success"
              });
            }
          };
          fileReader.readAsText(data);
        })
        .catch(res => {
          loading.close();
        });
    },
    // 导出
    exportTodoData() {
      if (this.todoCheckTaskList.length > 0) {
        this.dialogVisibleExport = true;
      } else {
        if (this.total > 10000) {
          this.$confirm("超过导出上限（1万条），请尝试以下方法分批导出：<br/> 1、选择 1 条或 N 条数据导出 <br/> 2、筛选特定属性的数据后导出", "导出为Excel", {
            confirmButtonText: "取消",
            showCancelButton: false,
            dangerouslyUseHTMLString: true
            // type: "error"
          })
            .then(() => {})
            .catch(() => {});
        } else if (this.total == 0) {
          this.$message({
            message: "暂无内容导出",
            type: "error"
          });
        } else {
          this.dialogVisibleExport = true;
        }
      }
    },
    getActionType() {
      this.loading = true;
      this.requestMethodGet("/device/check/taskManage/executionWays", {}).then(res => {
        if (res.data.code == 1000) {
          this.actionTypeList = res.data.data;
          let index = this.tableDataHeader.findIndex(item=>item.paramValue == 'actionType');
          if(index != -1){
            this.tableDataHeader[index].selectOptions = res.data.data;
          }
          this.getDataList();
        } else {
          this.loading = false;
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 查询所属客户
    getCustomerData() {
      let params = {
        companyType: 2,
        size: 200,
        status: 1,
        companyName: this.selectCompanyName
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
    // 模糊搜索公司
    customerAllFilter(val) {
      this.selectCompanyName = val;
      this.getCustomerData();
    },
    clearCustomer(val) {
      if (!val) {
        this.selectCompanyName = "";
        ++this.groupKey;
        this.groupList = [];
        this.workshopList = [];
        this.getCustomerData();
      }
    },
    companyChange() {
      this.getWorkshopList();
      this.getGroupTree();
      setTimeout(() => {
        this.getTaskListData();
      }, 800);
    },
    visibleChange(val) {
      if (val && this.userInfo.userType < 2) {
        if (!this.searchForm.companyId) {
          this.$message({
            type: "warning",
            message: "请选择所属客户"
          });
        }else{
          if(this.searchForm.companyId.toString().includes(',')){
            this.$message({
              type: "warning",
              message: "请选择一个客户后重新尝试"
            });
          }
        }
      }
    },
    getWorkshopList() {
      if(this.userInfo.userType != 2){
        if(this.searchForm.companyId.toString().includes(',')){
          return;
        }
      }
      const params = {
        companyId: this.userInfo.userType < 2 ? this.searchForm.companyId : this.userInfo.companyId,
        workshopName: "",
        current: 1,
        size: 300
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.workshopList = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 获取分组树
    getGroupTree() {
      if(this.userInfo.userType != 2){
        if(this.searchForm.companyId.toString().includes(',')){
          return;
        }
      }
      const params = {
        companyId: this.userInfo.userType < 2 ? this.searchForm.companyId : this.userInfo.companyId
      };
      if (!params.companyId) {
        return;
      }
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
    handleMoreSearch() {
      this.showMoreSearch = !this.showMoreSearch;
      this.$nextTick(() => {
        this.screenWidth = document.body.clientWidth;
        this.handleTableHeight();
      });
    },
    // 设备类型
    getEptList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", {}).then(res => {
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
    // 创建任务选择任务项
    dropdownClick(type) {
      // 匹配不同得type跳转页面带参数
      if (type) {
        this.$router.push({
          path: "/taskManager/createTaskNew",
          query: {
            taskType: type,
            pageType: "task"
          }
        });
      }
    },
    // 保养项目
    maintainDropdownClick(type) {
      // 匹配不同得type跳转页面带参数
      this.$router.push({
        path: "/taskManager/createTaskNew",
        query: {
          taskType: type,
          pageType: "task"
        }
      });
    },
    async getOverview() {
      const overview = await this.requestMethodGet("/device/check/todoTask/overview");
      if (overview.data.code === 1000) {
        const data = overview.data.data;
        this.taskCate.forEach(item => {
          item.val = data[item.code];
        });
        this.handleTableHeight()
      }
    },
    changeTaskTime() {
      if (this.searchForm.dataScope == 1 || this.searchForm.dataScope == 2 || this.searchForm.dataScope == 3) {
        this.searchForm.startDate = "";
        this.searchForm.endDate = "";
        this.searchForm.size = 30;
        this.searchForm.current = 1;
        this.getDataList();
      }
    },
    getDataList() {
      this.loading = true;
      let orderBy = this.sortMethod;
      let descFlag = !this.sortType;
      const params = {
        ...this.searchForm,
        orderBy,
        descFlag
      };
      params.taskStatusList = params.taskStatusList===""?[]:params.taskStatusList
      if (params.deviceTypeList.length) {
        let deviceTypeList = []
        params.deviceTypeList.forEach(item=>{
          deviceTypeList.push(item[item.length - 1])
        })
        params.deviceTypeList = deviceTypeList;
      } else {
        params.deviceTypeList = [];
      }
      if (params.groupIdList.length) {
        let groupIdList = []
        params.groupIdList.forEach(item=>{
          groupIdList.push(item[item.length - 1])
        })
        params.groupIdList = groupIdList;
      } else {
        params.groupIdList = [];
      }
      if (this.selectActionList.length) {
        params.actionType = this.selectActionList[0];
        params.actionTarget = this.selectActionList[1];
      } else {
        params.actionType = "";
        params.actionTarget = "";
      }
      if(params.dataScopeList.includes(3)) params.dataScopeList=[3]
      params.taskTypeList=params.taskTypeList==""?[]:params.taskTypeList
      params.menuCode = 'Task_web'
      this.requestMethodPost("/device/check/todoTask/queryTaskListByPage", params)
        .then(res => {
          this.loading = false;
          if (res.data.code == 1000) {
            this.$refs.tableRef.clearSelection();
            const data = res.data.data;
            this.total = data.totalCount;
            this.taskListTableData = data.list;
            this.todoCheckTaskList = [];
            this.gioFilterTrack(params);
            this.$nextTick(() => {
              this.handleTableHeight();
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    gioFilterTrack(params) {
      const taskStatus = params.taskStatusList
        .map(task => {
          return this.taskStatusMap[task];
        })
        .join(",");
      const taskType = this.taskTypeMap[params.taskType];
      const planExecuteDate = (() => {
        if (this.searchForm.dataScope == 4) {
          return params.startDate + "-" + params.endDate;
        } else {
          return this.executeDateMap[this.searchForm.dataScope];
        }
      })();
      this.$gio.filterTaskFromPopup({
        taskStatus: taskStatus,
        taskType: taskType,
        taskName: params.taskName,
        taskTitle: params.planTitle,
        taskID: params.taskPlanNo,
        planExcuteTime :params.taskTime,
        taskNumber: params.taskBatchNo,
        planExecuteDate: planExecuteDate,
        director: params.taskUserName,
        customer: this.$gio.findValueCodeCorresponding(this.customerList, params.companyId, "companyId", "companyName") || "无"
      });
    },
    selectTable(selection) {
      this.tableSelection = selection;
    },
    cancelTransfer() {
      this.transferForm.oilTaskPrincipalUserId = "";
      this.oilTaskPrincipalUserId = false;
    },

    async transferBatch() {
      if (this.tableSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请先选择数据"
        });
        return;
      }
      if (this.chargePersonList.length == 0) {
        const res = await this.requestMethodGet("/oilTask/queryCompanyUsers", {
          current: 1,
          size: 500,
          companyNumber: this.userInfo.companyNumber
        });
        if (res.data.code == 1000) {
          this.chargePersonList = res.data.data.list;
        }
      }
      this.opDialogVisible = true;
    },
    submitTransfer() {
      this.$refs.transferForm.validate(async valid => {
        if (valid) {
          const taskIds = this.tableSelection.map(item => item.id);
          const res = await this.requestMethodPost("/oilTask/pickUpOilTask", {
            pickUpType: 1,
            taskIds,
            principalUserId: this.transferForm.oilTaskPrincipalUserId
          });
          if (res.data.code == 1000) {
            this.opDialogVisible = false;
            this.transferForm.oilTaskPrincipalUserId = "";
            this.$message({
              type: "success",
              message: res.data.msg || "成功"
            });
            this.getOverview();
            this.getDataList(true);
          } else {
            this.transferForm.oilTaskPrincipalUserId = "";
            this.$message({
              type: "error",
              message: res.data.msg || "请稍后重试"
            });
          }
        }
      });
    },
    getBatch() {
      if (this.tableSelection.length == 0) {
        this.$message({
          type: "warning",
          message: "请先选择数据"
        });
        return;
      }
      this.$confirm("领取后您将成为任务负责人", "领取任务", {
        confirmButtonText: "完成",
        cancelButtonText: "取消",
        customClass: "deletBtn"
      })
        .then(async () => {
          const taskIds = this.tableSelection.map(item => item.id);
          const res = await this.requestMethodPost("/oilTask/pickUpOilTask", {
            pickUpType: 2,
            taskIds
          });
          if (res.data.code == 1000) {
            this.opDialogVisible = false;
            this.$message({
              type: "success",
              message: res.data.msg || "成功"
            });
            this.getOverview();
            this.getDataList(true);
          } else {
            this.$message({
              type: "error",
              message: res.data.msg || "请稍后重试"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handle(opType, btn, rowData) {
      if (opType == "READ") {
        this.$router.push({
          name: "taskDetail",
          query: {
            taskId: rowData.id,
            taskType: rowData.taskType
          }
        });
      }
    },
    viewDetail(rowData) {
      this.$router.push({
        name: "taskDetail",
        query: {
          taskId: rowData.id,
          taskType: rowData.taskType
        }
      });
      this.$gio.toTaskDetailsPage({
        entrance: "任务调度"
      });
    },
    pageSizeChange(pageSize) {
      this.searchForm.size = pageSize;
      this.getDataList(true);
    },
    pageCurrentChange(currentPage) {
      this.searchForm.current = currentPage;
      this.getDataList(true);
    },
    resetSearch() {
      if(this.searchForm.companyId){
        this.$refs["selectCustomer"].clearSelectCustomer()
      }
      this.selectCustomerList = []
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.statusList.forEach(it => {
        if (it.value == 2 || it.value == 3) {
          it.active = true;
        } else {
          it.active = false;
        }
      });
      this.selectActionList = [];
      this.searchForm.deviceTypeList = [];
      this.searchForm.groupIdList = [];
      this.searchForm.workshopIdList = [];
      this.searchForm.taskStatusList = [2, 3];
      this.searchForm.size = 30;
      this.searchForm.current = 1;
      this.searchForm.dataScopeList = [1];
      this.sortMethod = "createTime"
      this.sortType = false
      if(this.userInfo.userType != 2){
        this.workshopList = []
        ++this.groupKey;
        this.groupList = []
      }

      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.getDataList();
    },
    getTaskListData() {
      this.searchForm.size = 30;
      this.searchForm.current = 1;
      this.getDataList();
    },
    // 排序
    changeSortType(data) {
      this.sortType = data;
      this.searchForm.current = 1;
      this.getDataList(true);
    },
    changeSortMethod(data) {
      this.sortMethod = data;
      this.searchForm.current = 1;
      this.getDataList(true);
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "todoTask");
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
      this.tableDataHeader.forEach(item=>{
        if(item.paramValue=='taskStatusList'){
          item.changeValue =  [2, 3]
        }
      })
      if (this.$route.params.isSaveQuery) {
        let searchForm = JSON.parse(sessionStorage.getItem("taskListParams"))
        if(sessionStorage.getItem("taskListParams")){
          this.tableDataHeader.forEach(item=>{
            if(item.paramValue=='taskTime'&&searchForm.startDate&&searchForm.endDate){
              item.changeValue=[searchForm.startDate,searchForm.endDate]
            }else if(item.paramValue=='taskName'){
              item.changeValue = searchForm.taskName
            }else if(item.paramValue=='planTitle'){
              item.changeValue = searchForm.planTitle
            }else if(item.paramValue=='taskPlanNo'){
              item.changeValue = searchForm.taskPlanNo
            }else if(item.paramValue=='taskTypeList'){
              item.changeValue = searchForm.taskTypeList
            }else if(item.paramValue=='taskStatusList'){
              item.changeValue = searchForm.taskStatusList
            }else if(item.paramValue=='actionType'){
              item.changeValue = [searchForm.actionType, searchForm.actionTarget]
            }else if(item.paramValue=='companyName'){
              item.changeValue = searchForm.companyName
            }else if(item.paramValue=='taskUserName'){
              item.changeValue = searchForm.taskUserName
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
      this.getDataList();
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue == 'taskTime'){
        if (searchVal) {
          this.searchForm.startDate = searchVal[0];
          this.searchForm.endDate = searchVal[1];
        } else{
          this.searchForm.startDate = "";
          this.searchForm.endDate = "";
        }
      }else if(obj.paramValue == 'actionType') {
        this.selectActionList = searchVal
      }else{
        this.searchForm[obj.paramValue] = searchVal
      }
      this.searchForm.current = 1;
      this.getDataList();
    },
    showSelectCustomer() {
      this.showCustomerDialog = true
    },
    handleClearCustomer() {
      this.selectCustomerList = []
      this.searchForm.companyId = ""
      this.searchForm.workshopIdList = []
      this.searchForm.groupIdList = []
      this.searchForm.current = 1;
      this.workshopList = []
      ++this.groupKey;
      this.groupList = []
      this.getDataList();
      this.$refs["selectCustomer"].clearSelectCustomer()
    },
    handleSubmitCustomer(e){
      this.selectCustomerList = e
      let selectList = this.selectCustomerList.map(item=>{
        return item.companyId
      })
      this.searchForm.workshopIdList = []
      this.searchForm.groupIdList = []
      this.workshopList = []
      ++this.groupKey;
      this.groupList = []
      this.searchForm.companyId = selectList.join(",")
      this.getGroupTree()
      this.getWorkshopList()
      this.searchForm.current = 1;
      this.getDataList();
      this.showCustomerDialog = false
    },
    handleCloseCustomer(){
      this.showCustomerDialog = false
    },
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.$set(this.taskUserDetail,'headUrl',res.data.data)
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
        this.taskUserDetail = {};
        let param = {
          userId: val
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.$refs[`popovers-${index}`].doShow();
                this.taskUserDetail = res.data;
                if (this.taskUserDetail.avatar) {
                  this.getFullUrl(this.taskUserDetail.avatar);
                }
                if (this.taskUserDetail.roleNames) {
                  this.taskUserDetail.roleNames = this.taskUserDetail.roleNames.join(",");
                }
                if (this.taskUserDetail.phonenumber) {
                  const phoneNum = this.taskUserDetail.phonenumber;
                  this.taskUserDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
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
    taskUserNameDetail(scope) {
      this.taskUserDetail = {};
      if (scope.row.taskUserId) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        this.getUserDetail(scope.row.taskUserId, scope.$index, "");
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
@import "../../assets/css/customTable.less";
.task-container {
  position: relative;
  padding:0 20px;
}
.tips {
  display: flex;
  align-items: center;
  color: #b2b2b2;
  justify-content: flex-end;
}
.task-sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0;
}
// 设置显示两行，超出省略
/deep/ .el-table th > .cell {
  word-break: keep-all !important;
  white-space: nowrap !important;
}
.table-container {
  overflow: auto;
}
/deep/ .el-dialog__body {
  padding: 0 20px 20px 20px;
}
.bottom-group {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.task-situation-super{
  width: calc(14% - 12px);
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
</style>
