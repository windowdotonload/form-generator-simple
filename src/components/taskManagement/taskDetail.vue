<template>
  <div class="taskdetail-contaienr" v-loading="completeLoading">
    <div class="split-line"></div>
    <!-- 按钮权限判断-if -->
    <div class="btn-group" v-show="userInfo.userType == 2 && taskDetailInfo.taskUserId == userInfo.userId">
      <el-button size="small" @click="cancelTask" v-if="(taskDetailInfo.taskStatus == 2 || taskDetailInfo.taskStatus == 1) && cancelTaskBtnFlag">取消</el-button>
      <el-button size="small" @click="transfer" v-if="(taskDetailInfo.taskStatus == 1 || taskDetailInfo.taskStatus == 2) && transferFlag && transferTaskBtnFlag">转派</el-button>
      <el-button size="small" v-if="editTaskBtnFlag && (taskDetailInfo.taskStatus == 1 || taskDetailInfo.taskStatus == 2)" @click="editTask">编辑</el-button>
      <el-button size="small" type="danger" v-if="taskDetailInfo.taskStatus == 2 && completeTaskBtnFlag" @click="completeOrGet(taskDetailInfo)"> 完成 </el-button>
    </div>
    <!-- 按钮权限判断-else -->
    <div class="btn-group" v-show="!(userInfo.userType == 2 && taskDetailInfo.taskUserId == userInfo.userId)">
      <el-button size="small" @click="cancelTask" v-if="(taskDetailInfo.taskStatus == 2 || taskDetailInfo.taskStatus == 1) && cancelTaskBtnFlag">取消</el-button>
      <el-button size="small" @click="transfer" v-if="(taskDetailInfo.taskStatus == 1 || taskDetailInfo.taskStatus == 2) && transferFlag && transferTaskBtnFlag">转派</el-button>
      <el-button size="small" v-if="editTaskBtnFlag && (taskDetailInfo.taskStatus == 1 || taskDetailInfo.taskStatus == 2)" @click="editTask">编辑</el-button>
      <el-button size="small" type="danger" v-if="taskDetailInfo.taskStatus == 2 && completeTaskBtnFlag" @click="completeOrGet(taskDetailInfo)">
        完成
      </el-button>
      <el-button
        size="small"
        type="danger"
        v-if="!taskDetailInfo.taskUserId && taskDetailInfo.taskStatus == 1 && userInfo.userType == 2 && receiveFlag && takeTaskBtnFlag"
        @click="completeOrGet(taskDetailInfo)"
      >
        领取
      </el-button>
    </div>
    <div class="task-top-overview">
      <div class="status-line">
        <p class="task-name">{{ taskDetailInfo.taskName }}</p>
        <span class="status-tag" :style="{ 'background-color': statusTagColor[taskDetailInfo.taskStatus] }">{{ taskDetailInfo.taskStatus | statusMap }}</span>
      </div>
      <div class="person-info">
        <p class="info-line">
          <span class="task-title title-left">任务ID</span>
          <span class="task-title title-left">任务批号</span>
          <span class="task-title title-left">负责人</span>
          <span class="task-title" style="margin-right: 120px">计划执行日期</span>
          <span class="task-title">任务来源</span>
        </p>
        <p class="info-line">
          <span class="task-value title-left">{{ taskDetailInfo.taskPlanNo }}</span>
          <span class="task-value title-left">{{ taskDetailInfo.taskBatchNo }}</span>
          <span class="task-value title-left">{{ taskDetailInfo.taskUserName || "暂无" }}</span>
          <span class="task-value title-left">{{ taskDetailInfo.taskTime }}</span>
          <span class="task-value title-left" v-if="taskDetailInfo.taskSource == 1">
            <div style="display:flex;align-items:center">
              <div>设备周期生成</div>
              <div style="color: #04a8f0; cursor: pointer;margin-left:5px" @click="deviceDetail">查看设备</div>
              <el-tooltip class="item" effect="dark" content="您可以在设备中调整周期、记录上次执行时间和预计下次执行时间" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
          </span>
          <span style="font-size: 13px; line-height: 13px; color: #333333" v-if="taskDetailInfo.taskSource == 2">手动创建</span>
          <span class="task-value title-left" v-if="taskDetailInfo.taskSource == 3">
            处理异常
            <span style="color: #04a8f0; cursor: pointer" @click="viewAbnormal">查看异常</span>
          </span>
        </p>
      </div>
    </div>
    <div class="table-box">
      <div class="cancel-task-reason" v-if="taskDetailInfo.taskStatus == 4">
        <div class="left"><img src="@/assets/task_cancel.png" alt="" /></div>
        <div class="right">
          <p class="cancel-title">任务取消原因</p>
          <p class="cancel-reason">撤销原因：{{ taskDetailInfo.taskCancelReason }}</p>
          <p class="cancel-date">{{ taskDetailInfo.taskCancelTime }}</p>
        </div>
      </div>

      <p class="task-target">任务对象（{{ tableData.length }}）</p>

      <div class="table-container">
        <custom-table ref="tableRef" :tableHeader="tableDataHeader" :tableData="tableData">
          <template v-slot:lubricationPointName="slotProps">
            <el-table-column
              label="润滑点名称"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
              v-if="taskType == 1 || taskType == 2 || taskType == 3"
            >
              <template slot-scope="scope">
                {{ scope.row.lubricationPointName || "-" }}
              </template>
            </el-table-column>
          </template>
          <template v-slot:lubricationPointType="slotProps">
            <el-table-column
              label="润滑点设备类型"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
              v-if="taskType == 1 || taskType == 2 || taskType == 3"
            >
              <template slot-scope="scope">
                {{ scope.row.lubricationPointType || "-" }}
              </template>
            </el-table-column>
          </template>
          <template v-slot:deviceAbnormalCount="slotProps">
            <el-table-column
              label="检查项异常"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
              v-if="taskType == 4"
            >
              <template slot-scope="scope">
                <span style="color:#dd0000">{{ scope.row.deviceAbnormalCount }}</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
          <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-link @click="taskOperation(1, scope.row)" style="color:#dd0000" v-if="taskDetailInfo.taskStatus == 2 && userInfo.userId == taskDetailInfo.taskUserId">执行</el-link>
              <el-link @click="taskOperation(2, scope.row)" :disabled="!operateTaskItem" style="color:#dd0000" v-else>查看</el-link>
            </template>
          </el-table-column>
        </custom-table>
      </div>

      <el-pagination
        background
        style="position: relative; bottom: -5px; right: 0x; display: flex; justify-content: flex-end; margin-top: 10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageInfo.size"
        :current-page="pageInfo.current"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
    <!-- 维修/保养任务弹框 -->
    <MaintainTask
      :deviceNumber="tableRowDeviceNumber"
      :openMaintainDrawer="openMaintainDrawer"
      :todoTaskId="taskDetailInfo.id"
      :deviceId="tableRowId"
      :isEditFlag="isEditFlag"
      :taskType="taskDetailInfo.taskType"
      v-on:cancelMaintainDraw="cancelMaintainDraw"
    >
    </MaintainTask>
    <!-- 检查任务弹框 -->
    <CheckTaskDrawer
      :checkTaskDrawer="checkTaskDrawerFlag"
      :deviceNumber="tableRowDeviceNumber"
      :todoTaskId="taskDetailInfo.id"
      :deviceId="tableRowId"
      :isEditFlag="isEditFlag"
      v-on:cancelCheck="cancelCheck"
    >
    </CheckTaskDrawer>
    <el-drawer :modal-append-to-body="false" :append-to-body="true" @close="closeDrawer" :title="drawerTitle" :visible.sync="drawer" :direction="'rtl'" size="30%" :wrapperClosable="false">
      <OilEdit ref="oilEdit" :opItemInfo="operationInfo" :taskInfo="taskDetailInfo" v-on:handlePreview="handlePreview" v-on:closeOilEditDrawer="closeOilEditDrawer" />
    </el-drawer>

    <el-dialog @close="closeDialog" :title="dialogTitle" :visible.sync="opDialogVisible" width="20%">
      <div class="cancel-dialog" v-if="dialogType == 1">
        <p class="cancel-dialog-title">请输入取消原因</p>
        <el-input
          maxlength="50"
          show-word-limit
          @input="showCancelTips = false"
          ref="cancelReason"
          v-model="cancelReason"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          style="margin-bottom: 5px"
        />
        <p class="cancel-tips" v-if="showCancelTips">请输入取消原因</p>
        <div class="bottom-group">
          <el-button size="small" type="defult" @click="cancelCancel" plain>取消</el-button>
          <el-button size="small" type="danger" @click="submitCancelReason">提交</el-button>
        </div>
      </div>
      <div v-if="dialogType == 2" style="margin-top: 20px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="负责人" prop="taskUserId">
            <el-select v-model="form.taskUserId" size="small" style="width: 96%">
              <el-option :label="item.nameCn" :value="item.userId" v-for="item in chargePersonList" :key="item.userId"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="bottom-group">
          <el-button size="small" type="defult" @click="cancelCancel" plain>取消</el-button>
          <el-button size="small" type="danger" @click="submitTransfer">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 无法完成任务弹框 -->
    <el-dialog title="无法完成任务" :visible.sync="unableCompleteDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <span>请检查所有任务项中，是否有必填内容未填写。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="unableCompleteDialog = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 处理异常 -->
    <el-dialog title="处理异常" :visible.sync="abnormalDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <span>关联异常ID：</span>
      <div style="display: flex;align-items: center;justify-content: center;flex-wrap: wrap;">
        <div v-for="(item, index) in relationAbnormals" :key="index" style="margin: 10px 15px;">
          <el-link style="color:rgb(0,20,80)" @click="handleAbnormal(item)">{{ item.code }}</el-link>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="abnormalDialog = false" size="small">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 查看图片 -->
    <el-dialog :modal-append-to-body="true" :append-to-body="true" width="30%" :visible.sync="previewImgFlag" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closePreview">
      <el-image style="width: 100%; height: 100%;margin-top:20px" :src="dialogImageUrl"> </el-image>
    </el-dialog>
    <!-- 异常详情 -->
    <AbnormalDraw :openDrawFlag="openDrawFlag" :abnormalStatus="abnormalStatus" :id="abnormalId" v-on:refreshList="refreshList" v-on:closeDraw="closeDraw"></AbnormalDraw>
  </div>
</template>

<script>
import OilEdit from "./changeOilEdit.vue";
import AbnormalDraw from "../spotInspection/abnormalRecord/abnormalDetail";
import customTable from "../tableComponents/customTable.vue";
const taskTypeMap = {
  1: "换油任务",
  2: "加油任务",
  3: "加脂任务"
};
export default {
  components: {
    OilEdit,
    MaintainTask: () => import("./components/maintainTask.vue"),
    CheckTaskDrawer: () => import("./components/checkTask.vue"),
    AbnormalDraw,
    "custom-table": customTable
  },
  data() {
    return {
      operateTaskItem: true,
      openDrawFlag: false,
      abnormalStatus: 0,
      btnPermissionCodes: [],
      getBtnCode: "",
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      drawerTitle: "",
      completeLoading: false,
      taskId: this.$route.query.taskId,
      taskType: this.$route.query.taskType, // 1-加油；2-换油；3-加脂；4-检查；5-保养；6-维修
      dialogType: "",
      dialogTitle: "",
      opDialogVisible: false,
      drawer: false,
      cancelReason: "",
      showCancelTips: false,
      chargePersonList: [],
      total: 0,
      backendTransferBtnFlag: false,
      operationInfo: {
        type: 0,
        currentItem: null
      },
      pageInfo: {
        current: 1,
        size: 30
      },
      statusTagColor: {
        1: "#dd0000",
        2: "#386D86",
        3: "#cccccc",
        4: "#cccccc"
      },
      loading: false,
      taskDetailInfo: {},
      tableData: [],
      form: {
        taskUserId: ""
      },
      rules: {
        taskUserId: [{ required: true, message: "请选择负责人", trigger: "blur" }]
      },
      unableCompleteDialog: false,
      abnormalDialog: false,
      receiveFlag: false,
      transferFlag: false,
      tableRowId: "",
      isEditFlag: false,
      transferTaskBtnFlag: false,
      cancelTaskBtnFlag: false,
      completeTaskBtnFlag: false,
      takeTaskBtnFlag: false,
      editTaskBtnFlag: false,
      checkTaskDrawerFlag: false,
      openMaintainDrawer: false,
      previewImgFlag: false,
      dialogImageUrl: "",
      relationAbnormals: [],
      tableDataHeader: [
        { label: "润滑点名称", slot: "lubricationPointName", width: "150" },
        { label: "润滑点设备类型", slot: "lubricationPointType", width: "150" },
        { label: "设备名称", prop: "deviceName", width: "150", tooltip: true },
        { label: "设备类型", prop: "deviceTypeName", width: "150", tooltip: true },
        { label: "设备分组", prop: "deviceGroupName", width: "150", tooltip: true },
        { label: "设备位置", prop: "devicePosition", width: "150", tooltip: true },
        { label: "设备编码", prop: "deviceCode", width: "150", tooltip: true },
        { label: "完成度", prop: "completeness", width: "150", tooltip: true },
        { label: "检查项异常", slot: "deviceAbnormalCount", width: "150" },
        { label: "操作", slot: "operation" }
      ]
    };
  },
  filters: {
    statusMap(val) {
      switch (val) {
        case 1:
          return "待领取";
        case 2:
          return "执行中";
        case 3:
          return "已执行";
        case 4:
          return "已取消";
      }
    }
  },
  mounted() {
    if (!/^\d+$/.test(this.taskId)) {
      // 判断任务id是否为uuid
      this.operateTaskItem = false;
    }
    this.getTaskDetail();
    this.taskButtonRight();
  },
  created() {
    this.$gio.viewTaskCompletedInfo();
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "web_Task_Transfer") {
        // 转派
        this.transferTaskBtnFlag = true;
      }
      if (buttonList[i].menuCode == "web_Task_Cancel") {
        // 取消
        this.cancelTaskBtnFlag = true;
      }
      if (buttonList[i].menuCode == "web_Task_Complete") {
        // 完成
        this.completeTaskBtnFlag = true;
      }
      if (buttonList[i].menuCode == "web_Task_Take") {
        // 领取
        this.takeTaskBtnFlag = true;
      }
      if (buttonList[i].menuCode == "web_Task_Edit") {
        // 编辑
        this.editTaskBtnFlag = true;
      }
    }
  },
  methods: {
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.previewImgFlag = true;
    },
    closePreview() {
      this.previewImgFlag = false;
    },
    taskButtonRight() {
      this.requestMethodGet("/device/check/todoTask/taskButtonRight", { taskTodoId: this.taskId }).then(res => {
        if (res.data.code == 1000) {
          const { receiveFlag, transferFlag } = res.data.data;
          this.receiveFlag = receiveFlag;
          this.transferFlag = transferFlag;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑任务
    editTask() {
      this.$router.push({
        path: "/taskManager/createTaskNew",
        query: {
          taskType: this.taskDetailInfo.taskType,
          pageType: "task",
          editId: this.taskDetailInfo.parentPlanId
        }
      });
      this.$gio.editTaskInfo({
        operation: "任务详情页点击编辑按钮"
      });
    },
    // 查看异常
    viewAbnormal() {
      // 查询异常编号列表
      this.requestMethodGet("/device/check/todoTask/queryAbnormals", { todoTaskId: this.taskId }).then(res => {
        if (res.data.code == 1000) {
          this.relationAbnormals = res.data.data;
          this.abnormalDialog = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 处理异常
    handleAbnormal(item) {
      this.abnormalStatus = item.name;
      this.abnormalId = item.id;
      this.openDrawFlag = true;
    },
    // 关闭异常详情抽屉
    closeDraw() {
      this.openDrawFlag = false;
    },
    refreshList() {
      this.openDrawFlag = false;
      this.viewAbnormal();
    },
    deviceDetail() {
      this.$router.push({
        name: "EquipmentProfileDetail",
        query: {
          deviceNumber: this.tableData[0].deviceNumber
        }
      });
    },
    async getTaskDetail() {
      const res = await this.requestMethodGet("/device/check/todoTask/queryTaskTodoDetail", {
        taskTodoId: this.taskId,
        ...this.pageInfo
      });
      if (res.data.code == 1000) {
        const data = res.data.data;
        this.taskDetailInfo = data;
        if (this.taskType < 4) {
          this.tableData = data.taskTodoLubricationPoint.list;
          this.total = data.taskTodoLubricationPoint.totalCount;
        } else {
          this.tableData = data.taskTodoDevice.list;
          this.total = data.taskTodoDevice.totalCount;
        }
      } else {
        this.$message({
          type: "error",
          message: res.data.msg || "请稍后重试"
        });
      }
    },
    closeDrawer() {
      this.$refs.oilEdit.cancel();
    },
    closeOilEditDrawer() {
      this.getTaskDetail();
      this.drawer = false;
    },
    async completeOrGet(taskItem) {
      let title, desc, url, btnText, params, method, methodOther, paramOther, urlOther;
      let isNum = /^\d+$/.test(taskItem.id);
      if (taskItem.taskUserId && taskItem.taskStatus == 2) {
        const checkRes = await this.requestMethodGet("/oilTask/checkFinishOilTask", {
          taskId: taskItem.id
        });
        if (checkRes.data.code == 1000) {
          desc = checkRes.data.data;
        } else {
          desc = "任务完成后将无法进行任何操作";
        }
        title = "完成任务";
        if (this.taskDetailInfo.taskType < 4) {
          url = "/oilTask/finishOilTask";
        } else {
          url = "/device/check/todoTask/fininshTodoTask";
        }
        btnText = "完成";
        method = "requestMethodGet";
        params = {
          id: taskItem.id,
          todoTaskId: this.taskId
        };
      } else {
        this.$gio.receiveTask({
          entrance: "任务详情页"
        });
        title = "领取任务";
        desc = "领取后您将成为任务负责人";
        url = "/oilTask/pickUpOilTask";
        btnText = "领取";
        method = "requestMethodPost";
        params = {
          pickUpType: 2,
          taskIds: [this.taskId]
        };
        if (!isNum && taskItem.taskStatus == 1) {
          // 待领取的未来任务
          methodOther = "requestMethodGet";
          urlOther = "/device/check/todoTask/createFutureTask";
          paramOther = {
            uuid:  this.EncryptUserId(taskItem.id),
            taskPlanId: this.EncryptUserId(taskItem.planId)
          };
        }
        
      }
      this.$confirm(desc, title, {
        confirmButtonText: btnText,
        cancelButtonText: "取消",
        customClass: "deletBtn"
      })
        .then(async () => {
          this.completeLoading = true;
          if (!isNum && taskItem.taskStatus == 1) {
            const futureReceive = await this[methodOther](urlOther, paramOther);
            this.taskId = taskItem.id = futureReceive.data.data;
            params.taskIds = [taskItem.id];
          }
          const res = await this[method](url, params);
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: res.data.msg || "执行成功"
            });
            this.operateTaskItem = true;
            await this.getTaskDetail();
            this.$forceUpdate();
            this.completeLoading = false;
            if (this.dialogTitle == "转派任务") {
              this.$gio.reassignTask({
                entrance: "任务详情页"
              });
            } else if (title == "领取任务") {
              this.$gio.receiveTask({
                entrance: "任务详情页"
              });
            } else if (title == "完成任务") {
              this.$gio.completeTask({
                operation: "弹框中点击完成按钮"
              });
            }
          } else {
            this.$message({
              type: "error",
              message: res.data.msg || "请稍后重试"
            });
            this.completeLoading = false;
          }
        })
        .catch(() => {
          if (this.dialogTitle == "转派任务") {
            this.$gio.reassignTask({
              entrance:'任务详情页'
            });
          } else if (title == "领取任务") {
            this.$gio.receiveTask({
              entrance: "任务详情页"
            });
          }
        });
    },
    handleSizeChange(val) {
      this.pageInfo.size = val;
      this.getTaskDetail();
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val;
      this.getTaskDetail();
    },
    async taskOperation(type, row) {
      this.tableRowDeviceNumber = row.deviceNumber;
      // type   1 - 执行 | 2 - 查看
      // 加油，换油，加脂用之前的功能，检查，维修，保养用新的表单
      if (type == 2) {
        // 查看
        this.isEditFlag = false;
        this.goDetail(type, row);
        this.$gio.clickViewButton();
      } else {
        let planExcuteTime = this.taskDetailInfo.taskTime;
        if (planExcuteTime && planExcuteTime.includes("全天")) {
          planExcuteTime = planExcuteTime.substring(0, 10) + " 00:00:00";
        }
        let date_unix = Date.parse(planExcuteTime.replace(/\-/g, "/"));
        let nowTime = new Date().getTime();
        // 未落库任务/计划执行时间>当前时间
        if (!this.operateTaskItem || date_unix > nowTime) {
          // this.$confirm("确认提前执行吗？", "提示", {
          //   confirmButtonText: "确认",
          //   cancelButtonText: "取消",
          //   customClass: "deletBtn",
          //   type: "warning"
          // })
          //   .then(async () => {
          if (!this.operateTaskItem) {
            const createTask = await this.requestMethodGet("/device/check/todoTask/createFutureTask", { uuid: this.EncryptUserId(this.taskDetailInfo.id), taskPlanId: this.EncryptUserId(this.taskDetailInfo.planId) });
            this.taskId = this.taskDetailInfo.id = createTask.data.data;
            this.operateTaskItem = true;
          }
          this.getTaskForm(type, row);
          this.$gio.clickExceuteButton();
          // })
          // .catch(() => {
          // });
        } else {
          this.isEditFlag = true;
          this.goDetail(type, row);
        }
      }
    },
    async getTaskForm(type, row) {
      const res = await this.requestMethodGet("/device/check/todoTask/queryTaskTodoDetail", {
        taskTodoId: this.taskId,
        ...this.pageInfo
      });
      if (res.data.code == 1000) {
        const data = res.data.data;
        this.taskDetailInfo = data;
        if (this.taskType < 4) {
          this.tableData = data.taskTodoLubricationPoint.list;
          this.total = data.taskTodoLubricationPoint.totalCount;
        } else {
          this.tableData = data.taskTodoDevice.list;
          this.total = data.taskTodoDevice.totalCount;
        }
        this.tableData.forEach(item => {
          if (item.id == row.id) {
            this.$set(row, "todoTaskFormId", item.todoTaskFormId);
          }
        });
        this.isEditFlag = true;
        this.goDetail(type, row);
      } else {
        this.$message({
          type: "error",
          message: res.data.msg || "请稍后重试"
        });
      }
    },
    goDetail(type, row) {
      const taskType = this.taskDetailInfo.taskType;
      if (taskType < 4) {
        this.drawerTitle = taskTypeMap[taskType];
        const Item = {
          type,
          currentItem: row,
          companyId: this.taskDetailInfo.companyId,
          taskType: taskType,
          taskStatus: this.taskDetailInfo.taskStatus,
          taskUserId: this.taskDetailInfo.taskUserId,
          taskSource: this.taskDetailInfo.taskSource,
          todoTaskId: this.taskId
        };
        this.operationInfo = Object.assign({}, Item);
        this.drawer = true;
      } else if (taskType == 4) {
        // 检查
        this.tableRowId = row.id;
        this.tableRowDeviceNumber = row.deviceNumber;
        this.checkTaskDrawerFlag = true;
      } else {
        // 维修，保养
        this.tableRowId = row.id;
        this.openMaintainDrawer = true;
      }
    },
    // 取消维修保养类型
    cancelMaintainDraw() {
      this.getTaskDetail();
      this.openMaintainDrawer = false;
    },
    // 取消检查类型
    cancelCheck() {
      this.getTaskDetail();
      this.checkTaskDrawerFlag = false;
    },
    cancelTask() {
      this.dialogType = 1;
      this.dialogTitle = "取消任务";
      this.opDialogVisible = true;
      this.$gio.cancelTask({
        operation: "任务详情页点击取消按钮"
      });
    },
    async transfer() {
      this.$gio.clickReassignButton({
        entrance: "任务详情页"
      });
      this.dialogType = 2;
      this.dialogTitle = "转派任务";
      let isNum = /^\d+$/.test(this.taskDetailInfo.id);
      if (!isNum) {
        const futureTransfer = await this.requestMethodGet("/device/check/todoTask/createFutureTask", {
          uuid: this.EncryptUserId(this.taskDetailInfo.id),
          taskPlanId: this.EncryptUserId(this.taskDetailInfo.planId)
        });
        this.taskDetailInfo.id = futureTransfer.data.data;
      }
      if (this.chargePersonList.length == 0) {
        const res = await this.requestMethodGet("/oilTask/queryCompanyUsers", {
          current: 1,
          size: 500,
          companyId: this.taskDetailInfo.companyId,
          oilTaskType: this.taskDetailInfo.taskType,
          taskId: this.taskDetailInfo.id
        });
        if (res.data.code == 1000) {
          this.chargePersonList = res.data.data.list;
        }
      }
      this.opDialogVisible = true;
    },
    closeDialog() {
      this.cancelReason = "";
      this.showCancelTips = false;
      if (this.$refs.form && this.$refs.form.clearValidate) {
        this.$refs.form.clearValidate();
      }
    },
    cancelCancel() {
      this.cancelReason = "";
      this.opDialogVisible = false;
    },
    async submitCancelReason() {
      if (this.cancelReason == "") {
        this.$refs.cancelReason.focus();
        this.showCancelTips = true;
        return;
      }
      let isNum = /^\d+$/.test(this.taskDetailInfo.id);
      if (!isNum) {
        const futureCancel = await this.requestMethodGet("/device/check/todoTask/createFutureTask", {
          uuid: this.EncryptUserId(this.taskDetailInfo.id),
          taskPlanId: this.EncryptUserId(this.taskDetailInfo.planId)
        });
        this.taskId = this.taskDetailInfo.id = futureCancel.data.data;
      }
      const res = await this.requestMethodPost("/oilTask/cancelOilTask", {
        cancelReason: this.cancelReason,
        taskId: this.taskDetailInfo.id
      });
      if (res.data.code == 1000) {
        this.$message({
          type: "success",
          message: "取消任务成功"
        });
        this.cancelReason = "";
        this.showCancelTips = false;
        if (this.$refs.form && this.$refs.form.clearValidate) {
          this.$refs.form.clearValidate();
        }
        this.opDialogVisible = false;
        this.operateTaskItem = true;
        this.getTaskDetail();
        this.$gio.cancelTask({
          operation: "弹框中点击取消"
        });
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },
    submitTransfer() {
      this.$refs.form.validate(async val => {
        if (val) {
          const res = await this.requestMethodPost("/oilTask/pickUpOilTask", {
            pickUpType: 1,
            taskIds: [this.taskDetailInfo.id],
            principalUserId: this.form.taskUserId
          });
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: res.data.msg || "转派任务成功"
            });
            this.cancelReason = "";
            this.showCancelTips = false;
            this.form.taskUserId = "";
            if (this.$refs.form && this.$refs.form.clearValidate) {
              this.$refs.form.clearValidate();
            }
            this.opDialogVisible = false;
            this.operateTaskItem = true;
            this.$router.go(-1);
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.taskdetail-contaienr {
  position: relative;
}
.btn-group {
  position: absolute;
  top: -35px;
  right: 20px;
}
.split-line {
  width: 100%;
  height: 20px;
  border-bottom: 1px solid #cccccc;
}
.task-top-overview {
  width: auto;
  box-sizing: border-box;
  margin: 0 16px;
  margin-top: 24px;
  background: #f9f9f9;
  border-radius: 6px;
  padding: 16px 20px;

  .status-line {
    height: 28px;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .task-name {
    margin: 0;
    font-size: 20px;
    line-height: 20px;
    font-weight: 700;
  }
  .status-tag {
    font-size: 15px;
    margin-left: 10px;
    border-radius: 30px;
    color: white;
    padding: 6px 12px;
  }
  .info-line {
    margin: 10px 0;
  }
}
.table-box {
  box-sizing: border-box;
  margin: 0 16px;
  margin-top: 24px;
  border: 1px solid #cccccc;
  border-radius: 6px;
  padding: 24px 20px;
  max-height: 600px;

  .task-target {
    margin: 0;
    font-weight: 700;
    font-size: 15px;
    line-height: 15px;
    margin-bottom: 20px;
  }
}
.cancel-task-reason {
  display: flex;
  flex-wrap: nowrap;
  padding-bottom: 12px;
  border-bottom: 1px solid #cccccc;

  margin-bottom: 24px;
  .left {
    width: 30px;
  }
  .right {
    margin-left: 16px;
  }
  .cancel-title {
    margin-top: 0;
    color: #000000;
    font-size: 14px;
    font-weight: 700;
  }
  .cancel-reason {
    font-size: 13px;
    font-weight: 400;
    line-height: 13px;
    color: #666666;
  }
  .cancel-date {
    font-size: 13px;
    font-weight: 400;
    line-height: 13px;
    color: #666666;
  }
}
.bottom-group {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.cancel-dialog-title::before {
  content: "*";
  font-size: 12px;
  color: #f56c6c;
}
/deep/ .el-dialog__body {
  padding: 0 20px 20px 20px;
}
.cancel-tips {
  margin: 5px;
  font-size: 12px;
  color: #f56c6c;
}

.table-container {
  max-height: 400px;
  overflow: auto;
}
.task-title {
  font-size: 13px;
  line-height: 13px;
  color: #999999;
}
.title-left {
  display: inline-block;
  width: 150px;
  margin-right: 48px;
}
.task-value {
  font-size: 13px;
  line-height: 13px;
  color: #333;
}
</style>
