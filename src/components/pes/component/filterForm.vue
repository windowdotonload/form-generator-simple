<template>
  <div class="form-container selected-table-filter" v-loading="filterLoading">
    <div class="module-title">筛选条件</div>
    <el-form :model="filterForm" class="search-form" label-position="top" v-show="!selectedData">
      <el-form-item label="服务类型">
        <el-cascader
          ref="serviceTypeCascader"
          clearable
          filterable
          :options="filterServiceTypeTree"
          :props="{ value: 'serviceNumber', label: 'serviceName', children: 'children', emitPath: false }"
          :show-all-levels="false"
          v-model="filterForm.serviceNumber"
          size="small"
          style="width: 100%"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="负责人">
        <el-select size="small" clearable v-model="filterForm.chargeUserId" placeholder="请选择" style="width: 100%">
          <el-option v-for="owner in filterChargeUserList" :key="owner.userId" :label="owner.userName" :value="owner.userId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划开始时间">
        <el-date-picker size="small" clearable v-model="filterForm.planStartTime" type="date" placeholder="请选择日期" style="width: 100%"></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="table-selected-container" v-show="selectedData && selectedData.length">
      <div class="table-selected-data-box" :style="{ 'max-height': selectedDataExpand ? '250px' : `${50 * renderData.length}px` }">
        <el-tooltip class="item" effect="dark" :content="item" placement="top-end" v-for="item in renderData" :key="item">
          <div class="table-selected-item">{{ item }}</div>
        </el-tooltip>
      </div>
      <div class="table-selected-more-btn" @click="switchCollapse" v-show="rawSelectedData.length > 5">
        <el-button type="text" style="color: #001450; padding: 0">{{ selectedDataExpand ? "展开" : "收起" }}</el-button>
        <i :class="selectedDataExpand ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" />
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import { getEditServiceChargetUserList, getEditServiceTypeTree } from "../api/serviceBatchOperationApi";
export default {
  props: {
    selectedData: {
      type: Array,
      default: null,
    },
    overViewData: {
      type: Object,
      default: {},
    },
  },
  inject: ["DRAWERVM", "SERVICEVM"],
  data() {
    return {
      selectedDataExpand: true,
      authorityRole: "",
      filterForm: {
        planStartTime: "",
        chargeUserId: "",
        serviceNumber: "",
      },
      filterLoading: false,
      filterChargeUserList: [],
      filterServiceTypeTree: [],
      renderData: [],
      authorityRole: "",
      foldSelectedData: [],
      rawSelectedData: [],
      serviceTypes: [
        { label: "类型1", value: "1" },
        { label: "类型2", value: "2" },
        { label: "类型3", value: "3" },
      ],
      serviceOwners: [
        { label: "负责人1", value: "1" },
        { label: "负责人2", value: "2" },
        { label: "负责人3", value: "3" },
      ],
    };
  },
  created() {
    console.log("this is selectedData", this.selectedData);
    this.initFilterForm();
    this.initSelectedTableData();
  },
  methods: {
    handleChange() {
      const item = this.$refs.serviceTypeCascader.getCheckedNodes(true)[0].data;
      this.authorityRole = item.authorityRole;
    },
    switchDrawerLoading(show) {
      this.filterLoading = show;
    },
    initFilterForm() {
      console.log("this ", this.SERVICEVM);
      Object.entries(this.SERVICEVM.filterForm).forEach(([key, val]) => {
        this.filterForm[key] = val;
      });
    },
    initSelectedTableData() {
      if (!this.selectedData) return this.getFilterSourceData();
      const rawData = cloneDeep(this.selectedData);
      const handlerData = rawData.map((row) => {
        const { serviceName, planStartTime, workshopName, chargeUserName, mobilProjectUserNames, customerProjectUserNames } = row;
        return [serviceName, planStartTime, workshopName, chargeUserName, mobilProjectUserNames, customerProjectUserNames].filter((i) => i).join("，");
      });
      this.rawSelectedData = handlerData;
      this.foldSelectedData = handlerData.slice(0, 5);
      console.log(rawData);
      this.renderData = this.selectedDataExpand ? this.foldSelectedData : this.rawSelectedData;
      if (rawData.length == 1) {
        this.authorityRole = rawData[0].authorityRole;
      }
    },
    switchCollapse() {
      this.selectedDataExpand = !this.selectedDataExpand;
      if (this.selectedDataExpand) {
        this.renderData = this.foldSelectedData;
      } else {
        this.renderData = this.rawSelectedData;
      }
    },
    async getFilterSourceData() {
      this.filterChargeUserList = cloneDeep(this.SERVICEVM.filterChargeUserList);
      this.filterServiceTypeTree = cloneDeep(this.SERVICEVM.filterServiceTypeTree);
    },
    async getFilterSourceDataAsync() {
      this.switchDrawerLoading(true);
      const params = {
        pesId: this.overViewData.pesInfoId,
      };
      const chargeUserList = await getEditServiceChargetUserList(params);
      const configTree = await getEditServiceTypeTree(params);
      this.filterChargeUserList = chargeUserList.data.data.filter((item) => item);
      this.filterServiceTypeTree = configTree;
      this.switchDrawerLoading(false);
    },
  },
};
</script>

<style lang="less" scoped>
.form-container {
  height: fit-content;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.module-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}
.table-selected-container {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  transition: all 0.5s ease;
}
.table-selected-data-box {
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  height: fit-content;
  box-sizing: border-box;
  transition: all 0.5s ease;
}
.table-selected-more-btn {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: 10px;
  padding-right: 10px;
  cursor: pointer;
}
.table-selected-item {
  margin-left: 15px;
  display: inline-block;
  height: 23px;
  font-size: 13px;
  color: #666;
  width: 100%;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 5px;
  margin-bottom: 5px;
}
.selected-table-filter {
  border-radius: 8px;
  background: #f9f9f9;
}
</style>
