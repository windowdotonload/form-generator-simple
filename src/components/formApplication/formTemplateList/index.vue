<template>
  <div class="form-template-lsit-container">
    <el-button type="danger" size="mini" @click="createForm" class="config-btn" v-if="!external">新建记录表</el-button>
    <el-button size="mini" @click="resetTable" class="config-btn-reset" :style="resetBtnStyle ? resetBtnStyle : {}">重置筛选</el-button>
    <div class="search-bar">
      <el-form :model="searchForm" :inline="true" style="width:25%" label-width="90px" label-position="left">
        <el-form-item label="搜索记录表">
          <el-input size="mini" placeholder="请输入关键词搜索记录表" prefix-icon="el-icon-search" style="width:160%" v-model="searchForm.recordName" @input="changeSearch" clearable />
        </el-form-item>
      </el-form>
    </div>
    <el-table
      border
      stripe
      :data="tableData"
      style="width: 100%;"
      class="form-template-list"
      height="72vh"
      :header-cell-style="headerCellStyle"
      :cell-style="CELLStyle"
      @header-dragend="handleHeaderdragend"
    >
      <el-table-column prop="formName" label="记录表名称" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="remark" label="描述" show-overflow-tooltip v-if="!external">
        <template #default="{row}">
          {{ row.remark ? row.remark : "暂无" }}
        </template>
      </el-table-column>
      <el-table-column prop="status" show-overflow-tooltip v-if="!external">
        <template #header>
          <el-popover placement="bottom" width="200" trigger="click" ref="filterPopover">
            <template #reference>
              <div class="table-header-inner">
                <span>状态</span>
                <i class="el-icon-sort" style="margin-left:20px;cursor: pointer;" />
              </div>
            </template>
            <div>
              <el-checkbox-group v-model="searchForm.status" style="display:flex;flex-wrap:wrap" @input="changeValue">
                <el-checkbox label="1" size="mini" style="width:100%">启用</el-checkbox>
                <el-checkbox label="0" size="mini">禁用</el-checkbox>
              </el-checkbox-group>
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" @click="clearFilter('status')" style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" @click="searchFilter">
                  确定
                </el-button>
              </div>
            </div>
          </el-popover>
        </template>
        <template #default="{row}">
          {{ row.status ? "启用" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" show-overflow-tooltip v-if="!external">
        <template #header>
          <el-popover placement="bottom" width="200" trigger="click" ref="filterPopover">
            <template #reference>
              <div class="table-header-inner">
                <span>创建人</span>
                <i class="el-icon-search" style="margin-left:20px;cursor: pointer;" />
              </div>
            </template>
            <div style="cursor:pointer">
              <el-input size="mini" placeholder="请输入" v-model="searchForm.createUserName" />
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" @click="clearFilter('createUserName')" style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" @click="searchFilter">
                  确定
                </el-button>
              </div>
            </div>
          </el-popover>
        </template>
        <template #default="{row}">
          {{ row.createUserName ? row.createUserName : "暂无" }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" show-overflow-tooltip v-if="!external">
        <template #header>
          <el-popover placement="bottom" width="200" trigger="click" ref="filterPopover">
            <template #reference>
              <div class="table-header-inner">
                <span>创建时间</span>
                <i class="el-icon-sort" style="margin-left:20px;cursor: pointer;" />
              </div>
            </template>
            <div style="cursor:pointer">
              <el-date-picker
                style="width:100%"
                size="mini"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                v-model="searchForm.createTime"
              />
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" @click="clearFilter('createTime')" style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" @click="searchFilter">
                  确定
                </el-button>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="updateUserName" show-overflow-tooltip>
        <template #header>
          <el-popover placement="bottom" width="200" trigger="click" ref="filterPopover">
            <template #reference>
              <div class="table-header-inner">
                <span>最后编辑人</span>
                <i class="el-icon-search" style="margin-left:20px;cursor: pointer;" />
              </div>
            </template>
            <div style="cursor:pointer">
              <el-input size="mini" placeholder="请输入" v-model="searchForm.updateUserName" />
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" @click="clearFilter('updateUserName')" style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" @click="searchFilter">
                  确定
                </el-button>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="最后编辑时间" show-overflow-tooltip>
        <template #header>
          <el-popover placement="bottom" width="200" trigger="click" ref="filterPopover">
            <template #reference>
              <div class="table-header-inner">
                <span>最后编建时间</span>
                <i class="el-icon-sort" style="margin-left:20px;cursor: pointer;" />
              </div>
            </template>
            <div style="cursor:pointer">
              <el-date-picker
                style="width:100%"
                size="mini"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                v-model="searchForm.updateTime"
              />
              <div style="margin-top:10px;float:right">
                <el-button size="mini" type="text" @click="clearFilter('updateTime')" style="color:#000">
                  清空
                </el-button>
                <el-button size="mini" type="danger" @click="searchFilter">
                  确定
                </el-button>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="{row}">
          <el-button type="text" size="mini" @click="() => viewHistoryRecord(row)" style="color:#001450" v-if="external">查看</el-button>
          <el-button type="text" size="mini" @click="() => editFormTemplate(row)" style="color:#001450" v-if="!external">编辑</el-button>
          <el-button type="text" size="mini" @click="() => deleteFormTemplate(row)" style="color:#d10000" v-if="!external"> 删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="display:flex;height:60px;align-items:center;background:#fff;z-index:999;bottom:0"
      :current-page="pageInfo.current"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageInfo.size"
      :total="tableTotal"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
// import FilterTable from "../filterTable/index.vue";
import debounce from "lodash/debounce";
import { getFormList, deleteFormTemplateItem } from "../api/index.js";
export default {
  components: {
    // FilterTable
  },
  props: {
    resetBtnStyle: {
      type: Object,
      default: () => {}
    },
    external: {
      type: Boolean,
      default: false
    },
    deviceId: {
      type: String,
      default: ""
    },
    companyId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      pageInfo: {
        current: 1,
        size: 10
      },
      tableTotal: 0,
      tableData: [],
      searchForm: {
        recordName: "",
        status: [],
        createUserName: "",
        updateUserName: "",
        createTime: "",
        createTimeStart: "",
        createTimeEnd: "",
        updateTime: "",
        updateTimeStart: "",
        updateTimeEnd: ""
      }
    };
  },
  created() {
    this.getFormList();
  },
  methods: {
    viewHistoryRecord(row) {
      const query = {
        formName: row.formName,
        formId: row.id,
        external: this.external
      };
      if (this.companyId) query.companyId = this.companyId;
      if (this.deviceId) query.deviceId = this.deviceId;
      this.$router.push({
        name: "formHistoryRecord",
        query
      });
    },
    changeSearch: debounce(function() {
      this.pageInfo = {
        current: 1,
        size: 10
      };
      this.$gio.ClickSearchRecordSheet();
      this.getFormList({
        searchKey: this.searchForm.recordName
      });

    }, 800),
    headerCellStyle() {
      return {
        "box-sizeing": "border-box",
        background: "#f7f7f7"
      };
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
    },
    CELLStyle() {
      return {
        border: "1px solid #fff"
      };
    },
    searchFilter() {
      if (this.searchForm.createTime.length) {
        this.searchForm.createTimeStart = Vue.prototype.moment(this.searchForm.createTime[0]).format("YYYY-MM-DD");
        this.searchForm.createTimeEnd = Vue.prototype.moment(this.searchForm.createTime[1]).format("YYYY-MM-DD");
      }
      if (this.searchForm.updateTime.length) {
        this.searchForm.updateTimeStart = Vue.prototype.moment(this.searchForm.updateTime[0]).format("YYYY-MM-DD");
        this.searchForm.updateTimeEnd = Vue.prototype.moment(this.searchForm.updateTime[1]).format("YYYY-MM-DD");
      }
      const tableHeaderFilterParams = JSON.parse(JSON.stringify(this.searchForm));
      delete tableHeaderFilterParams.createTime;
      delete tableHeaderFilterParams.updateTime;
      tableHeaderFilterParams.status = tableHeaderFilterParams.status.join(",");
      const params = {};
      Object.keys(tableHeaderFilterParams).forEach(key => {
        if (tableHeaderFilterParams[key]) params[key] = tableHeaderFilterParams[key];
      });
      this.getFormList(params);
    },
    clearFilter(key) {
      if (key == "status") {
        this.searchForm.status = [];
      } else {
        this.searchForm[key] = "";
      }
      if (key == "createTime") {
        this.searchForm.createTimeStart = "";
        this.searchForm.createTimeEnd = "";
      } else if (key == "updateTime") {
        this.searchForm.updateTimeStart = "";
        this.searchForm.updateTimeEnd = "";
      }
      this.searchFilter();
    },
    resetFormList() {
      this.getFormList();
    },
    resetTable() {
      this.searchForm = {
        recordName: "",
        status: [],
        createUserName: "",
        updateUserName: "",
        createTime: "",
        createTimeStart: "",
        createTimeEnd: "",
        updateTime: "",
        updateTimeStart: "",
        updateTimeEnd: ""
      };
      this.pageInfo = {
        current: 1,
        size: 10
      };
      this.getFormList();
    },
    createForm() {
      this.$router.push({
        name: "formCreate"
      });
      this.$gio.ClickNewRecordTable();
    },
    editFormTemplate(row) {
      row.eidtFlag = true;
      this.$router.push({
        name: "formCreate",
        query: {
          formData: JSON.stringify(row)
        }
      });
      this.$gio.RecordformClickEdit();
    },
    async deleteFormTemplate(row) {
      const res = await deleteFormTemplateItem(
        { id: row.id },
        () =>
          this.$router.replace({
            name: "formHistoryRecord",
            query: {
              formName: row.formName,
              formId: row.id
            }
          }),
        () => this.resetFormList()
      );
      this.$gio.ClickDelete();
    },
    handleSizeChange(size) {
      this.pageInfo.size = size;
      this.getFormList();
    },
    handleCurrentChange(current) {
      this.pageInfo.current = current;
      this.getFormList();
    },
    async getFormList(serarchParams) {
      const params = {
        ...this.pageInfo,
        ...serarchParams,
        menuCode:'form_manage'
      };
      params.queryFormConfigFlag = true;
      if (this.deviceId) params.deviceId = this.deviceId;
      if (this.companyId) params.companyId = this.companyId;
      const res = await getFormList(params);
      this.tableData = res.data.data.list;
      this.tableTotal = res.data.data.totalCount;
    }
  }
};
</script>

<style lang="less" scoped>
.form-template-lsit-container {
  box-sizing: border-box;
  padding: 0 20px;
}
.config-btn {
  position: absolute;
  right: 2%;
  top: 80px;
}
.config-btn-reset {
  position: absolute;
  right: 2%;
  top: 130px;
  z-index: 99;
}
.search-bar {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
}
.form-template-list {
  /deep/ .el-table__header-wrapper ::-webkit-scrollbar {
    width: 3px !important;
  }
}
</style>
