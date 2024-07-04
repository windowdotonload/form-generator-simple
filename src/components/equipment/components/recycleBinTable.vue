<template>
  <div style="padding: 20px 60px" class="editHistory">
    <el-table row-key="id" :data="eqTableData" tooltip-effect="dark" style="width: 100%" max-height="400" :header-cell-style="{ background: '#f7f7f7' }" stripe>
      <el-table-column prop="deviceName" label="设备名称" min-width="20%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="companyName" label="所属客户" min-width="25%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="workshopName" label="所属车间" min-width="25%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="deviceTypeName" :show-overflow-tooltip="true" label="设备类型" min-width="22%"> </el-table-column>
      <el-table-column prop="updateTimeStr" label="删除日期" min-width="18%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updateUserName" label="删除人" min-width="12%" show-overflow-tooltip></el-table-column>
      <el-table-column prop="delReason" label="删除原因" min-width="22%" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" min-width="12%" align="center">
        <template slot-scope="scope">
          <el-link @click="handleReductionEq(scope.row)" style="margin-right: 10px; color: rgb(0, 20, 79)" :underline="false">还原</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="eqTotal"
      background
      @size-change="handleSizeEq"
      @current-change="handleCurrentEq"
      :current-page="current"
      :page-size="size"
      :page-sizes="[10, 20, 30, 50]"
      :pager-count="4"
      layout="total, sizes, prev, pager, next, jumper"
      :total="eqTotal"
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
    eqTableData: {
      type: Array
    },
    eqTotal: {
      type: Number
    }
  },
  methods: {
    handleSizeEq(size) {
      this.$emit("handleSizeEq", size);
    },
    handleCurrentEq(current) {
      this.$emit("handleCurrentEq", current);
    },
    handleReductionEq(row) {
      this.$emit("handleReductionEq", row);
    }
  }
};
</script>

<style lang="less" scoped>
.editHistory .el-pagination {
  position: static;
}
</style>
