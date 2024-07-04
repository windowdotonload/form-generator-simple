<template>
  <div class="pagination-container">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.current"
      :page-size="pageInfo.size"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    pageInfo: Object,
    currentPage: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default: [10, 30, 50, 100]
    },
    pageSize: {
      type: Number,
      default: 30
    },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageInfo.current = 1;
      this.pageInfo.size = val;
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val;
    }
  }
};
</script>

<style lang="less" scoped>
.pagination-container {
  box-sizing: border-box;
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
  /deep/ .el-pagination {
    position: static !important;
    right: 10px;
  }
}
</style>
