<template>
  <div style="padding: 20px 60px" class="editHistory">
    <el-table row-key="id" :data="lMTableData" tooltip-effect="dark" style="width: 100%" max-height="400" :header-cell-style="{ background: '#f7f7f7' }" stripe>
      <el-table-column prop="lubricationPointName" label="润滑点名称" min-width="20%" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.lubricationPointName">{{ scope.row.lubricationPointType }} - {{ scope.row.lubricationPointName }}</span>
          <span v-if="!scope.row.lubricationPointName">{{ scope.row.lubricationPointType }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deviceName" :show-overflow-tooltip="true" label="所属设备" min-width="25%"> </el-table-column>
      <el-table-column prop="companyName" label="所属客户" min-width="25%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updateTimeStr" label="删除日期" min-width="20%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updateUserName" label="删除人" min-width="12%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="delReason" label="删除原因" min-width="22%" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" min-width="12%" align="center">
        <template slot-scope="scope">
          <el-link @click="handleReductionLm(scope.row)" style="margin-right: 10px; color: rgb(0, 20, 79)" :underline="false">还原</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="lMTotal"
      background
      @size-change="handleSizeLm"
      @current-change="handleCurrentLm"
      :current-page="current"
      :page-size="size"
      :page-sizes="[10, 20, 30, 50]"
      :pager-count="4"
      layout="total, sizes, prev, pager, next, jumper"
      :total="lMTotal"
      style="float: right; display: flex; margin-top: 10px"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number
    },
    current: {
      type: Number
    },
    lMTableData: {
      type: Array
    },
    lMTotal: {
      type: Number
    }
  },
  methods: {
    handleSizeLm(size) {
      this.$emit("handleSizeLm", size);
    },
    handleCurrentLm(current) {
      this.$emit("handleCurrentLm", current);
    },
    handleReductionLm(val) {
      this.$emit("handleReductionLm", val);
    }
  }
};
</script>

<style lang="less" scoped>
.editHistory .el-pagination {
  position: static;
}
</style>
