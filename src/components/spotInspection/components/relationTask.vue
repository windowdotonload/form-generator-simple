<template>
  <div style="position:relative">
    <el-dialog title="关联任务" :visible.sync="chooseTask" width="75%" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true" :before-close="cancelChoose">
      <!-- 搜索项 -->
      <el-form ref="searchForm" :model="searchForm" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="任务ID">
              <el-input v-model="searchForm.planNo" placeholder="请输入" size="small" clearable @change="getTaskTableData('refresh')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="任务主题">
              <el-input v-model="searchForm.planTitle" placeholder="请输入" size="small" clearable @change="getTaskTableData('refresh')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="任务类型">
              <el-select v-model="searchForm.taskType" clearable size="small" placeholder="请选择" @change="getTaskTableData('refresh')">
                <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <div slot="label">
                <el-button size="small" @click="resetSearch">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <div>
          <el-table
            :data="planTableData"
            tooltip-effect="dark"
            ref="plan"
            v-loading="loadingPlan"
            v-el-table-infinite-scroll="loadMore"
            :row-key="rowKey"
            @select="handleSelectTask"
            @select-all="selectAllTask"
          >
            <el-table-column type="selection" :reserve-selection="true" width="50"> </el-table-column>
            <el-table-column prop="planNo" min-width="8%" label="任务ID" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="planTitle" min-width="12%" label="任务主题" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="planStatus" min-width="4%" label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.planStatus == 0" style="color:#dd0000">未生效</span>
                <span v-if="scope.row.planStatus == 1" style="color:rgb(0,136,136);">已生效</span>
              </template>
            </el-table-column>
            <el-table-column prop="taskType" min-width="6%" label="任务类型" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.taskType == 1">换油</span>
                <span v-if="scope.row.taskType == 2">加油</span>
                <span v-if="scope.row.taskType == 3">加脂</span>
                <span v-if="scope.row.taskType == 4">检查</span>
                <span v-if="scope.row.taskType == 5">保养</span>
                <span v-if="scope.row.taskType == 6">维修</span>
                <span v-if="scope.row.taskType == 7">其他</span>
              </template>
            </el-table-column>
            <el-table-column prop="taskCycle" min-width="8%" label="任务周期" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.taskCycle == 0">不重复</span>
                <span v-if="scope.row.taskCycle == 1">按日</span>
                <span v-if="scope.row.taskCycle == 2">按周</span>
                <span v-if="scope.row.taskCycle == 3">按月</span>
                <span v-if="scope.row.taskCycle == 4">按年</span>
              </template>
            </el-table-column>
            <el-table-column prop="timeStr" min-width="10%" label="有效时间" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="taskItemCount" min-width="4%" label="任务项" show-overflow-tooltip> </el-table-column>
            <p v-if="loadMorePlanFlag">加载中...</p>
            <p v-if="!loadMorePlanFlag">没有更多了</p>
          </el-table>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelChoose" size="small">取 消</el-button>
        <el-button type="danger" size="small" @click="confirmChoose">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    abnormalData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    chooseTask: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    abnormalId: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    companyId: {
      type: Number,
      default: () => {
        return null;
      }
    },
    deviceId: {
      type: Number,
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      searchForm: {
        planNo: "",
        planTitle: "",
        taskType: ""
      },
      planTotal: 0,
      taskCurrent: 1,
      taskTypeList: [
        {
          label: "加油",
          value: 2
        },
        {
          label: "换油",
          value: 1
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
        }
      ],
      planTableData: [],
      loadingPlan: false,
      loadMorePlanFlag: false,
      checkedPlanList: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")))
    };
  },
  watch: {
    chooseTask: function(val, oldVal) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.plan.clearSelection();
        });
        this.getTaskTableData("refresh");
      }
    }
  },
  methods: {
    // 获取任务列表
    getTaskTableData(val) {
      const params = this.searchForm;
      params.companyId = this.companyId;
      params.size = 30;
      params.current = this.taskCurrent;
      params.abnormalId = this.abnormalId;
      params.deviceId = this.deviceId;
      params.menuCode = 'taskManager'
      this.loadingPlan = true;
      this.requestMethodPost("/device/check/taskManage/list", params).then(res => {
        if (res.data.code == 1000) {
          let list = [];
          if (val) {
            list = res.data.data.list;
          } else {
            list = this.planTableData.concat(res.data.data.list);
          }
          if (list.length) {
            list.forEach(item => {
              item.timeStr = item.planStartTime + "至" + item.planEndTime;
            });
          }
          this.planTableData = list;
          this.planTotal = res.data.data.totalCount;
          if (this.planTableData.length < this.planTotal) {
            this.loadMorePlanFlag = true;
          } else {
            this.loadMorePlanFlag = false;
          }
          this.loadingPlan = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 重置
    resetSearch() {
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.taskCurrent = 1;
      this.getTaskTableData("refresh");
    },
    rowKey(row) {
      return row.planId;
    },
    // 加载更多
    loadMore() {
      if (this.loadMorePlanFlag && this.planTableData.length < this.planTotal) {
        ++this.taskCurrent;
        this.getTaskTableData();
      }
    },
    // 选择任务
    handleSelectTask(list) {
      this.checkedPlanList = list;
    },
    // 全选
    selectAllTask(list) {
      this.checkedPlanList = list;
    },
    // 取消选择
    cancelChoose() {
      this.checkedPlanList = [];
      this.$refs.plan.clearSelection();
      this.$emit("cancelTaskDialog");
    },
    // 确定选择
    confirmChoose() {
      const checkArr = this.$refs.plan.selection;
      this.$emit("confirmChoosePlan", checkArr);
      this.$gio.associateTasks({
        eventID: this.abnormalData.abnormalNo
      });
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-checkbox {
  border: none;
}
</style>
