<script>
import { getRecordList, deleteRecordItem, exportData } from "../api/index.js";
import RecordDetail from "./components/recordDetail";
import FilterTable from "../filterTable/index";
export default {
  props: {
    deviceId: {
      type: String,
      default: ""
    },
    companyId: {
      type: String,
      default: ""
    },
    external: {
      type: Boolean,
      default: false
    }
  },
  components: {
    RecordDetail,
    FilterTable
  },
  data() {
    return {
      activeRecordId: "",
      drawerVis: false,
      tablleCols: [],
      tableData: [],
      recordTableFilterParams: new Map(),
      tableSelection: [],
      filterParms: [],
      pageInfo: {
        size: 10,
        current: 1
      },
      external: false
    };
  },
  provide() {
    return {
      recordTableFilterParams: this.recordTableFilterParams
    };
  },
  created() {
    this.concatFormName();
    this.getQuery();
    this.getRecordList();
  },
  methods: {
    getQuery() {
      this.external = this.$route.query.external;
    },
    concatFormName() {
      this.$route.meta.title = this.$route.meta.title
        .split(",")
        .splice(0, 2)
        .concat(this.$route.query.formName)
        .join(",");
      this.$forceUpdate();
    },
    async getRecordList(filterParams) {
      let params = {
        formId: this.$route.query.formId || 86,
        ...this.pageInfo
      };
      if (this.$route.query.companyId) params.companyId = this.$route.query.companyId;
      if (this.$route.query.deviceId) params.deviceId = this.$route.query.deviceId;
      if (filterParams) params = Object.assign({}, params, filterParams);
      const res = await getRecordList(params);

      if (res.data.code == 1000) {
        this.tableTotal = res.data.data.totalCount;
        this.handleTableData(res.data.data.list, res.data.data.headerNameList);
      }
    },
    handleSizeChange(size) {
      this.pageInfo.size = size;
      this.getRecordList();
    },
    handleCurrentChange(current) {
      this.pageInfo.current = current;
      this.getRecordList();
    },
    handleSetColItemSlot(lineItem) {
      lineItem.slot = (colItemInfo, scopeData) => {
        const columnType = colItemInfo.colInfo.columnType;
        const colValueKey = colItemInfo.colInfo.columnUuid;
        const row = scopeData.row;
        const colValue = row[colValueKey];
        return Vue.extend({
          render() {
            if (columnType == 7 || columnType == 8) {
              return <div style={{ "font-weight": "bolder", color: `${colValue ? "rgb(0, 136, 136)" : "rgb(221, 0, 0)"}` }}>{colValue ? "已上传" : "未上传"}</div>;
            }
            return <div>{colValue}</div>;
          }
        });
      };
      return lineItem;
    },
    async handleTableData(rawList, tableHeaderList) {
      if (rawList == undefined || rawList == null) rawList = [];
      const cols = new Map();
      Object.entries(tableHeaderList[0]).forEach(([_, lineItem]) => {
        if (!cols.has(lineItem.columnUuid)) cols.set(lineItem.columnUuid, this.handleSetColItemSlot(lineItem));
      });
      const handleData = rawList.map(item => {
        const tempObj = {};
        Object.entries(item).forEach(([_, lineItem]) => {
          if (lineItem.columnUuid) tempObj[lineItem.columnUuid] = lineItem.value;
        });
        tempObj.id = item.id.value;
        return tempObj;
      });

      this.tableData = handleData;
      this.tablleCols = [...cols.entries()].map(([key, colInfo]) => ({ key, colInfo })).map(item => ({ label: item.colInfo.columnName, prop: item.colInfo.columnUuid, colInfo: item.colInfo }));
    },
    reuseRecord(row) {
      this.$router.push({
        name: "formFill",
        query: {
          formId: this.$route.query.formId,
          formName: this.$route.query.formName,
          recordId: row.id
        }
      });
      this.$gio.Clickmultiplexing()
    },
    viewRecord(row) {
      this.activeRecordId = row.id;
      this.drawerVis = true;
      this.$gio.Clicktoview()
    },
    closeDrawer() {
      this.activeRecordId = "";
      this.drawerVis = false;
    },
    async deleteRecord() {
      this.$confirm("是否确定删除记录表记录？删除后记录表记录将无法恢复？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await deleteRecordItem({
            recordId: this.activeRecordId
          });
          if (res.data.code == 1000) {
            this.closeDrawer();
            this.getRecordList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    editRecord() {
      this.$router.push({
        name: "formFill",
        query: {
          noCreate: true,
          formId: this.$route.query.formId,
          formName: this.$route.query.formName,
          recordId: this.activeRecordId
        }
      });
    },
    filterMethod(searchInfo, filterCol) {
      const colInfo = filterCol.colInfo;
      const { searchValue, searchOptions } = searchInfo;
      const colSearchParams = {
        columnUuid: colInfo.columnUuid,
        componentType: colInfo.columnType
      };
      if (searchValue) colSearchParams.valueStr = searchValue;
      if (searchOptions.length) {
        if (searchOptions[0] instanceof Date && searchOptions[1] instanceof Date) {
          if (colInfo.columnType == 5) {
            colSearchParams.startTime = Vue.prototype.moment(searchOptions[0]).format("HH:mm:ss");
            colSearchParams.endTime = Vue.prototype.moment(searchOptions[1]).format("HH:mm:ss");
          } else {
            colSearchParams.startTime = Vue.prototype.moment(searchOptions[0]).format("YYYY-MM-DD");
            colSearchParams.endTime = Vue.prototype.moment(searchOptions[1]).format("YYYY-MM-DD");
          }
        } else {
          colSearchParams.valueStr = searchOptions.join(",");
        }
      }
      this.recordTableFilterParams.set(colInfo.columnUuid, colSearchParams);

      const columnSearchList = [...this.recordTableFilterParams.entries()].map(([_, val]) => val);
      const filterParms = {
        columnSearchList
      };
      this.filterParms = filterParms;
      this.getRecordList(filterParms);
    },
    clearFilterMethod(filterCol) {
      const colInfo = filterCol.colInfo;
      if (this.recordTableFilterParams.has(colInfo.columnUuid)) this.recordTableFilterParams.delete(colInfo.columnUuid);
      const columnSearchList = [...this.recordTableFilterParams.entries()].map(([_, val]) => val);
      const filterParms = {
        columnSearchList
      };
      this.filterParms = filterParms;
      this.getRecordList(filterParms);
    },
    fillForm() {
      this.$router.replace({
        name: "formFill",
        query: {
          formId: this.$route.query.formId,
          formName: this.$route.query.formName
        }
      });
      this.$gio.Clicktofillform()
    },
    select({ row, selection }) {
      this.tableSelection = selection;
    },
    selectAll({ row, selection }) {
      this.tableSelection = selection;
    },
    resetTable() {
      this.pageInfo = {
        size: 10,
        current: 1
      };
      this.recordTableFilterParams.clear();
      this.getRecordList();
    },
    async exportData() {
      const records = this.tableSelection.map(item => item.id);
      const columnSearchList = this.filterParms.columnSearchList;
      const params = {
        formId: this.$route.query.formId,
        records,
        columnSearchList
      };
      if (this.$route.query.deviceId) params.deviceId = this.$route.query.deviceId;
      if (this.$route.query.companyId) params.companyId = this.$route.query.companyId;
      const res = await exportData(params);
      if (res.data.code == 1000) {
        this.$message({
          type: "success",
          message: "导出成功,请在导出任务中查看"
        });
      }
      this.$gio.ClickbulkExport()
    }
  },
  render() {
    const tableOpColScopeSlots = {
      default: ({ row }) => (
        <div>
          <el-button size="mini" type="text" style="color:#001450" onClick={() => this.viewRecord(row)}>
            查看
          </el-button>
          {this.external ? null : (
            <el-button size="mini" type="text" style="color:#001450" onClick={() => this.reuseRecord(row)}>
              复用
            </el-button>
          )}
        </div>
      )
    };
    return (
      <div class="form-record-container">
        <el-button size="mini" plain onClick={this.resetTable}>
          重置筛选
        </el-button>
        {this.external ? null : (
          <div style="display:flex;float:right">
            <el-button size="mini" type="danger" style="float:right;" onClick={this.fillForm}>
              填写表记录
            </el-button>
            <el-button size="mini" type="danger" plain onClick={this.exportData} style="float:right;">
              批量导出
            </el-button>
          </div>
        )}
        <FilterTable tableData={this.tableData} colData={this.tablleCols} opSlots={tableOpColScopeSlots} selectable onSelect={this.select} onSelectAll={this.selectAll} />
        <el-pagination
          style="display:flex;height:60px;align-items:center;background:#fff;z-index:999;bottom:0"
          on-size-change={this.handleSizeChange}
          on-current-change={this.handleCurrentChange}
          current-page={this.currentPage}
          page-sizes={[10, 20, 30, 50]}
          page-size={10}
          layout="total, sizes, prev, pager, next, jumper"
          total={this.tableTotal}
        />

        <el-drawer visible={this.drawerVis} direction="rtl" show-close={false}>
          <template slot="title">
            <div class="form-record-header">
              <span>记录表记录</span>
              {this.external ? (
                <div>
                  <i class="el-icon-close" onClick={this.closeDrawer} style={{ cursor: "pointer", marginLeft: "18px" }} />
                </div>
              ) : (
                <div>
                  <el-button size="mini" type="danger" onClick={this.editRecord}>
                    编辑
                  </el-button>
                  <el-button size="mini" onClick={this.deleteRecord}>
                    删除
                  </el-button>
                  <i class="el-icon-close" onClick={this.closeDrawer} style={{ cursor: "pointer", marginLeft: "18px" }} />
                </div>
              )}
            </div>
          </template>
          {this.drawerVis && <RecordDetail activeRecordId={this.activeRecordId} external={this.external} />}
        </el-drawer>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
.form-record-container {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
  /deep/ .el-drawer__header {
    margin-bottom: 16px !important;
    padding-top: 16px !important;
  }
}
.form-record-header {
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
}
</style>
