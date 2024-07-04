<template>
    <div style="padding: 20px 60px" class="editHistory">
      <el-table
        ref="customerTable"
        :key="key"
        row-key="id"
        :data="changeHistoryTableData"
        tooltip-effect="dark"
        style="width: 100%"
        max-height="400"
        :header-cell-style="{ background: '#f7f7f7' }"
        stripe
      >
        <el-table-column prop="fileType" label="申请类型" min-width="20%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="申请时间" min-width="25%" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        v-if="cHDataTotalNumber"
        background
        @size-change="handleSizeChangeCH"
        @current-change="handleCurrentChangeCH"
        :current-page="current"
        :page-size="size"
        :page-sizes="[10, 20, 30, 50]"
        :pager-count="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cHDataTotalNumber"
        style="float: right; display: flex; margin-top: 10px"
      ></el-pagination>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      key: {
        type: [String, Array]
      },
      current: {
        type: Number
      },
      size: {
        type: Number
      },
      changeHistoryTableData: {
        type: Array
      },
      cHDataTotalNumber: {
        type: Number
      }
    },
    methods: {
      handleSizeChangeCH(size) {
        this.$emit("handleSizeChangeCH", size);
      },
      handleCurrentChangeCH(current) {
        this.$emit("handleCurrentChangeCH", current);
      }
    }
  };
  </script>
  
  <style lang="less" scoped>
  .editHistory .el-pagination {
    position: static;
  }
  </style>
  