<template>
  <div>
    <el-table @selection-change="selectTable" :header-cell-style="{ background: '#f7f7f7' }" :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column type="selection" width="55" v-if="selection"> </el-table-column>
      <el-table-column v-for="item in tableSettings" align="left" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip>
        <template #default="slotProps" v-if="(item.type && item.type === 'operation') || item.coloumMap || item.empty_fill || item.need_status_icon">
          <!-- 启用/禁用 圆点指示状态 -->
          <div class="status-box" v-if="item.need_status_icon">
            <p
              class="circle-icon"
              :style="{
                background: slotProps.row.status === 0 ? '#dd0000' : '',
              }"
            />
            <p>{{ slotProps.row[item.prop] }}</p>
          </div>
          <!-- 空内容填充 -->
          <span v-if="item.empty_fill">
            {{ slotProps.row[item.prop] ? slotProps.row[item.prop] : item.empty_fill }}
          </span>
          <!-- 状态字段映射 -->
          <span v-if="item.coloumMap" :style="{ color: item.styleColorMap && item.styleColorMap[slotProps.row[item.prop]] }">
            {{ item.coloumMap[slotProps.row[item.prop]] }}
          </span>
          <!-- 操作栏 -->
          <el-button
            type="text"
            v-for="btn in item.operateBtns"
            :key="btn.btn_text"
            :style="{
              color: btn.color,
              ...handleOnlyOntBtn(btn, slotProps),
            }"
            @click="handleFunc(btn.op_type, btn, slotProps.row)"
          >
            <!-- [hideOperation] [auths] -->
            {{ slotProps.row.hideOperation ? "" : btn.need_auth ? (slotProps.row.editable == "1" ? btn.btn_text : null) : btn.btn_text }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    />
  </div>
</template>

<script>
export default {
  props: {
    selection: {
      type: Boolean,
      default: false,
    },
    selectFun: Function,
    tableData: {
      required: true,
      default: [],
    },
    tableHeight: {
      type: Number,
    },
    tableSettings: {
      required: true,
    },
    currentPage: {
      type: Number,
    },
    pageSize: {
      type: Number,
    },
    total: {
      type: Number,
    },
    handleFunc: {
      type: Function,
    },
    pageSizeChange: {
      type: Function,
    },
    pageCurrentChange: {
      type: Function,
    },
    loading: {
      type: Boolean,
    },
  },
  methods: {
    selectTable(selection) {
      this.selectFun(selection);
    },
    handleSizeChange(val) {
      this.pageSizeChange(val);
    },
    handleCurrentChange(val) {
      this.pageCurrentChange(val);
    },
    handleOnlyOntBtn(btn, slotProps) {
      if (btn.need_auth && slotProps.row.auths && !slotProps.row.auths.includes(btn.btn_text)) {
        return {
          width: 0,
          "margin-right": "-10px",
        };
      }
    },
  },
};
</script>

<style lang='less' scoped>
/deep/ .el-button--text {
  border: none;
}
.circle-icon {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #008787;
  margin-right: 8px;
}
.status-box {
  display: flex;
  align-items: center;
}
</style>
