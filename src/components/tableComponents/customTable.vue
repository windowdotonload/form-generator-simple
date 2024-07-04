<template>
  <div class="table-container">
    <el-table
      :data="tableData"
      width="100%"
      :key="tableKey"
      row-key="companyId"
      :height="tableHeight"
      tooltip-effect="dark"
      header-row-class-name="table_header_class"
      stripe
      v-loading="loading"
      element-loading-text="加载中..."
      border
      :highlight-current-row="highlight ? true : false"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @row-click="handleRowClick"
      @header-dragend="handleHeaderdragend"
      ref="coustomTable"
    >
      <template v-for="(item, index) in tableHeader">
        <slot v-if="item.slot" :name="item.slot" :slotData="item" :ind="index"></slot>
        <el-table-column
          v-else
          :resizable="item.resizable === false ? false : index == tableHeader.length - 2 ? false : true"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          label-class-name="hightLight"
          :type="item.type"
          :fixed="item.fixed || false"
          :min-width="item.minWidth ? item.minWidth : ''"
          :width="item.width && index !== tableHeader.length - 2 ? item.width : ''"
          :align="item.align || 'left'"
          :show-overflow-tooltip="item.tooltip || false"
          :render-header="item.renderHeader ? renderHeader : ''"
        >
          <template slot="header" v-if="item.paramValue && item.paramValue != ''">
            <column-header
              :title="item.label"
              :showTips="item.showTips"
              :filterType="item.filterType"
              :sortTypeVal="item.sortTypeVal"
              :paramValue="item.paramValue"
              :changeValue="item.changeValue"
              :selectMultiple="item.selectMultiple"
              :selectOptions="item.selectOptions"
              @changeSort="changeSortTable"
              @chSubmit="searchAppTable"
            />
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row[item.prop] || "-" }}</span>
          </template>
        </el-table-column>
      </template>
      <template slot="empty">
        <div style="font-size: 13px;line-height: 21px;color: #999;">
          <img src="../../assets/pes_empty.png" style="width: 160px;height: 160px;" alt="" />
          <div>暂无数据</div>
          <div v-if="listEmptyType == 'work_order'">{{ limitFlag ? "您可根据需要点击右上角按钮创建服务工单" : "您可通过创建润滑服务申请开具润滑服务工单" }}</div>
          <div v-if="listEmptyType == 'customer_list'">{{ limitFlag ? "您可点击右上角按钮分管客户" : "您可前往小程序端邀请客户注册" }}</div>
          <div v-if="listEmptyType == 'equipment'">{{ limitFlag ? "您可点击右上角按钮新建设备" : "" }}</div>
          <div v-if="listEmptyType == 'apply_list'">您可点击右上角按钮创建润滑服务申请单</div>
          <div v-if="listEmptyType == 'task_manager'">{{ limitFlag ? "您可根据需要点击右上角按钮创建任务" : "" }}</div>
          <div v-if="listEmptyType == 'abnormal_list'">{{ limitFlag ? "您可根据需要点击右上角按钮创建异常" : "" }}</div>
          <div v-if="listEmptyType == 'dealer-profile'">{{ limitFlag ? "您可根据需要点击右上角按钮分管经销商" : "" }}</div>
          <div v-if="listEmptyType == 'spot_item'">{{ limitFlag ? "您可点击右上角按钮创建检查项" : "" }}</div>
          <div v-if="listEmptyType == 'device_lube'">{{ limitFlag ? "您可根据需要点击右上角按钮创建特价润滑油表" : "" }}</div>
        </div>
      </template>
    </el-table>
  </div>
</template>
<script>
import debounce from "lodash/debounce";
import columnHeader from "./headerComponent";
export default {
  name: "customTable",
  components: {
    "column-header": columnHeader
  },
  props: {
    needSrollLoad: {
      type: Boolean,
      default: false
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 表格头标题
    tableHeader: {
      type: Array,
      require: true,
      default: () => {
        return [];
      }
    },
    // 加载层
    loading: {
      type: Boolean,
      default: false
    },
    // 是否展示多选框
    showSelect: {
      type: Boolean,
      default: false
    },
    // 高度
    tableHeight: {
      type: String,
      default: '400'
    },
    // 表格空数据类型
    listEmptyType: {
      type: String,
      default: ""
    },
    // 权限标识
    limitFlag: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Boolean,
      default: false
    },
    pageInfoCurrent: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      selectOptions: [],
      tableKey: Date.now()
    };
  },
  watch: {
    tableData: {
      handler: function(val, oldVal) {
        this.tableKey = Date.now();
        if (!_.isEmpty(val)) {
          this.tableData = val;
          this.$nextTick(() => {
            this.registerScrollEvent();
          });
        }
      },
      immediate: true
    },
    tableHeader: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          let isCludeEmpty = [];
          isCludeEmpty = val.filter(item => {
            return item.label == "空白列";
          });
          this.tableKey = Date.now();
          this.tableHeader = val;
          if (isCludeEmpty.length == 0) {
            this.tableHeader.splice(val.length - 1, 0, { label: "空白列", slot: "empty", width: 80 });
          }
        }
      },
      immediate: true
    },
    tableHeight: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.tableKey = Date.now();
          this.tableHeight = val;
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.uninstallScrollEvent();
  },
  methods: {
    registerScrollEvent() {
      if (this.registerEvent) {
        this.$nextTick(() => {
          setTimeout(() => {
            const elm = this.$refs.coustomTable.$el.querySelector(".el-table__body-wrapper");
            elm.scrollTop = this.tableHeight * (this.pageInfoCurrent - 1) - 80;
          }, 100);
        });
        this.uninstallScrollEvent();
      }
      this.$refs.coustomTable.$el.querySelector(".el-table__body-wrapper").addEventListener("wheel", this.scrollDirection, {
        passive: true
      });
      this.$refs.coustomTable.$el.querySelector(".el-table__body-wrapper").addEventListener("scroll", this.loadMore, {
        passive: true
      });
      this.registerEvent = true;
    },
    uninstallScrollEvent() {
      this.$refs.coustomTable.$el.querySelector(".el-table__body-wrapper").removeEventListener("scroll", this.loadMore);
      this.$refs.coustomTable.$el.querySelector(".el-table__body-wrapper").removeEventListener("wheel", this.scrollDirection);
    },
    scrollDirection(e) {
      this.deltaY = e.deltaY;
    },
    loadMore: debounce(function(e) {
      if (this.deltaY < 0) return;
      const target = e.target;
      const reachBottomFlag = target.scrollTop + target.clientHeight + 30 >= target.scrollHeight;
      if (reachBottomFlag) {
        this.$emit("loadMore", e);
      }
    }, 800),
    searchAppTable(e) {
      this.$emit("changeSearch", e);
    },
    changeSortTable(e) {
      this.$emit("changeSortTable", e);
    },
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
      this.$emit("selectionChange", list);
    },
    handleSelect(list, row) {
      this.$emit("select", list, row);
    },
    handleSelectAll(list) {
      this.$emit("selectAll", list);
    },
    handleRowClick(row, column, event) {
      this.$emit("rowClick", row, column);
    },
    clearSelection() {
      this.$refs.coustomTable.clearSelection();
      this.$emit("selectionChange", []);
    },
    toggleRowSelection(row) {
      this.$refs.coustomTable.toggleRowSelection(row, true);
    },
    handleHeaderdragend(newWidth, oldWidth, column, event) {
      if (newWidth < 110) {
        column.width = 110;
        column.realWidth = 110;
      }
      if (column.label == "") {
        column.width = oldWidth;
        column.realWidth = oldWidth;
      } else if (newWidth > 300 && column.label != "") {
        column.width = 300;
        column.realWidth = 300;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/customTable.less";
::deep .el-table__empty-text {
  line-height: 0;
}
</style>
