<script>
import { createFilterIcon } from "./components/index";
export default {
  props: {
    selectable: {
      type: Boolean,
      default: false
    },
    opSlots: {
      type: Object,
      default: {}
    },
    tableData: {
      type: Array,
      default: []
    },
    colData: {
      type: Array,
      default: []
    }
  },
  methods: {
    layoutTable() {
      Promise.resolve().then(() => {
        this.$nextTick(() => {
          this.$refs.filterTable.doLayout();
        });
      });
    },
    select(selection, row) {
      this.$emit("select", { selection, row });
    },
    selectAll(selection, row) {
      this.$emit("selectAll", { selection, row });
    },
    tableHeaderFixed(item) {
      if (item.colInfo.columnName.includes("最后编辑人") || item.colInfo.columnName.includes("最后编辑日期")) return "left";
      return false;
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
  },
  render() {
    return (
      <div class="form-filter-table">
        <el-table
          ref="filterTable"
          border
          stripe
          class="form-filter-table-content"
          data={this.tableData}
          height="73vh"
          style="width: 100%;margin-top: 10px;box-sizeing:border-box"
          onSelect={this.select}
          on-select-all={this.selectAll}
          on-header-dragend={this.handleHeaderdragend}
          cell-style={() => ({
            border: "1px solid #fff"
          })}
          header-cell-style={() => ({
            "box-sizeing": "border-box",
            background: "#f7f7f7"
          })}
        >
          {this.selectable && <el-table-column type="selection" width="55" fixed="left" />}
          {this.colData.length &&
            this.colData.map((item, index) => {
              const FilterIcon = createFilterIcon(item);
              const scopedSlots = {
                default: scope => {
                  if (item.colInfo.slot) {
                    const ContentSlot = item.colInfo.slot ? item.colInfo.slot(item, scope) : null;
                    return <ContentSlot />;
                  } else {
                    return <div>{scope.row.value}</div>;
                  }
                }
              };
              if (index == this.colData.length - 1) this.layoutTable();
              return (
                item.label != "id" && (
                  <el-table-column prop={item.prop} show-overflow-tooltip scopedSlots={scopedSlots} fixed={this.tableHeaderFixed(item)} resizable>
                    <div slot="header" class="form-filter-header-col">
                      <el-tooltip content={item.label} effect="dark" placement="top" trigger="hover">
                        <div style="white-space: nowrap;margin-right: 20px;text-overflow: ellipsis;overflow: hidden;width: fit-content;max-width: 300px;font-weight:bloder;color:#000">
                          {item.label}
                        </div>
                      </el-tooltip>
                      <FilterIcon />
                    </div>
                  </el-table-column>
                )
              );
            })}
          {(() => (
            <el-table-column fixed="right" width="120px" align="center" scopedSlots={this.opSlots}>
              <div slot="header" style="color:#000">
                操作
              </div>
            </el-table-column>
          ))()}
        </el-table>
      </div>
    );
  }
};
</script>

<style>
.form-filter-header-filter-icon {
  cursor: pointer;
}
</style>
<style lang="less" scoped>
.form-filter-header-col {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
}
.form-filter-header-filter-icon {
  cursor: pointer;
}
.form-filter-table-content ::-webkit-scrollbar {
  width: 3px !important;
}
</style>
