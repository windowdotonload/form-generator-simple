<template>
  <div>
    <el-table :data="tableData" ref="tableRef" tooltip-effect="dark" :height="height" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }" stripe>
      <el-table-column v-for="head in headList" :min-width="head.width" :key="head.key" :label="head.label" :prop="head.prop" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="head.prop == 'operation'">
            <el-link v-if="isView" style="color:rgb(0,20,80)" @click="viewRow(scope.row)">查看</el-link>
            <el-link v-if="isEdit" style="color:rgb(0,20,80)" @click="editRow(scope.row)">编辑</el-link>
            <el-link v-if="isDelete" style="color:rgb(211,0,0)" @click="deleteRow(scope.row)">删除</el-link>
          </div>
          <div v-else-if="head.prop == 'abnormalStatus' && tableType == 'abnormal'">
            <span v-if="scope.row.abnormalStatus" style="color:#999">已处理</span>
            <span v-else style="color: #dd0000">待处理</span>
          </div>
          <div v-else-if="head.prop == 'abnormalSource' && tableType == 'abnormal'">
            <span v-if="scope.row.abnormalSource == '1'">手工创建</span>
            <span v-else>检查</span>
          </div>
          <div v-else-if="head.prop == 'priority' && tableType == 'abnormal'">
            <span v-if="scope.row.priority == 1">急需处理</span>
            <span v-else>可暂缓处理</span>
          </div>
          <div v-else-if="head.prop == 'taskType' && tableType == 'task'">
            <span v-if="scope.row.taskType == 1">换油</span>
            <span v-if="scope.row.taskType == 2">加油</span>
            <span v-if="scope.row.taskType == 3">加脂</span>
            <span v-if="scope.row.taskType == 4">检查</span>
            <span v-if="scope.row.taskType == 5">保养</span>
            <span v-if="scope.row.taskType == 6">维修</span>
            <span v-if="scope.row.taskType == 7">其他</span>
          </div>
          <div v-else-if="head.prop == 'taskStatus' && tableType == 'task'">
            <span v-if="scope.row.taskStatus == 1" style="color:#dd0000">待领取</span>
            <span v-if="scope.row.taskStatus == 2" style="color:#008888">执行中</span>
            <span v-if="scope.row.taskStatus == 3" style="color:#999">已执行</span>
            <span v-if="scope.row.taskStatus == 4" style="color:#999">已取消</span>
          </div>
          <div v-else-if="head.prop == 'workOrderStatus' && tableType == 'workOrder'">
            <span style="color:#dd0000;" v-if="scope.row.workOrderStatus == '0' || scope.row.workOrderStatus == '9'">待确认</span>
            <span style="color:#001450;" v-if="scope.row.workOrderStatus == '2'">待评价</span>
            <span style="color:#008888;" v-if="scope.row.workOrderStatus == '1'">进行中</span>
            <span style="color:#999999;" v-if="scope.row.workOrderStatus == '4'">已关闭</span>
            <span style="color:#999999;" v-if="scope.row.workOrderStatus == '3'">已完成</span>
          </div>
          <div v-else>
            {{ scope.row[head.prop] }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="tableType != 'check'"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tableCurrent"
      :page-size="tableSize"
      :page-sizes="[30, 60, 100, 200, 500]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableTotal"
      style="float: right; display: flex; bottom: 15px; background: #fff"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    // 表头字段,label,prop,width,默认全部列超出鼠标悬浮展示所有
    headList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 是否展示查看按钮
    isView: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    // 是否展示编辑按钮
    isEdit: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    // 是否展示删除按钮
    isDelete: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    height: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    tableType: {
      type: String,
      default: () => {
        return "";
      }
    },
    tableCurrent: {
      type: Number,
      default: () => {
        return 1;
      }
    },
    tableSize: {
      type: Number,
      default: () => {
        return 30;
      }
    },
    tableTotal: {
      type: Number,
      default: () => {
        return 0;
      }
    }
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    handleSizeChange(val) {
      this.$emit("tableSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("tableCurrentChange", val);
    },
    viewRow(row) {
      this.$emit("tableRowView", row);
    },
    editRow(row) {
      this.$emit("tableRowEdit", row);
      this.$gio.deleteCheckItem({
        operation: "点击编辑按钮",
        customer: this.$parent.epInfo.companyName
      });
      this.$gio.createOrEditCheckItem({
        operation: "点击编辑按钮",
        customer: this.$parent.epInfo.companyName
      });
    },
    deleteRow(row) {
      this.$emit("tableRowDelete", row);
      this.$gio.deleteCheckItem({
        operation: "点击删除按钮",
        customer: this.$parent.epInfo.companyName
      });
    }
  }
};
</script>
<style lang="less" scoped></style>
