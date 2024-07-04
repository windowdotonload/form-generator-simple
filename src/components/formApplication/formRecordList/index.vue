<template>
  <div>
    <div class="search-bar">
      <el-form :model="searchForm" :inline="true" style="width:25%" label-width="90px" label-position="left">
        <el-form-item label="搜索记录表">
          <el-input size="mini" placeholder="请输入关键词搜索记录表" prefix-icon="el-icon-search" style="width:160%" v-model="searchForm.recordName" @input="changeSearch" clearable />
        </el-form-item>
      </el-form>
    </div>
    <div class="form-record-list">
      <RecordCard v-for="item in listData" :key="item.id" :formItemInfo="item" :fillAuth="fillAuth" :viewAuth="viewAuth" :companyId="companyId" :deviceId="deviceId" />
      <el-pagination
        style="display:flex;height:60px;align-items:center;background:#fff;z-index:999;bottom:0"
        @size-change="this.handleSizeChange"
        @current-change="this.handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageInfo.size"
        :current-page="pageInfo.current"
        :total="tableTotal"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
import { getFormList } from "../api/index.js";
import RecordCard from "./components/formRecordListItem";
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
    fillAuth: {
      type: Boolean,
      default: true
    },
    viewAuth: {
      type: Boolean,
      default: true
    }
  },
  components: {
    RecordCard
  },
  data() {
    return {
      pageInfo: {
        size: 10,
        current: 1
      },
      searchForm: {
        recordName: ""
      },
      tableTotal: 0,
      listData: []
    };
  },
  created() {
    this.getFormList();
  },
  methods: {
    changeSearch: debounce(function() {
      this.pageInfo = {
        size: 10,
        current: 1
      };
      this.$gio.ClickSearchRecordSheet();
      this.getFormList({
        searchKey: this.searchForm.recordName
      });
    }, 800),
    handleSizeChange(size) {
      this.pageInfo.size = size;
      this.getFormList();
    },
    handleCurrentChange(current) {
      this.pageInfo.current = current;
      this.getFormList();
    },
    async getFormList(filterParams = {}) {
      const params = {
        ...filterParams,
        ...this.pageInfo,
        menuCode:'form_manage'
      };
      if (this.deviceId) params.deviceId = this.deviceId;
      if (this.companyId) params.companyId = this.companyId;
      const res = await getFormList(params);
      this.tableTotal = res.data.data.totalCount;
      this.listData = res.data.data.list;
    }
  }
};
</script>

<style>
@import "../formGenerate/index.css";
</style>
<style lang="less" scoped>
.search-bar {
  width: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
}
.form-record-list {
  padding: 5px;
  padding-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: fit-content;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}
.form-record-list::-webkit-scrollbar {
  width: 3px !important;
}
</style>
