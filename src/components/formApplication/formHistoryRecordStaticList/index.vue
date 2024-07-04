<template>
  <div v-loading="tableLoading">
    <CustomeTable class="table" :tableHeader="tableDataHeader" :tableData="tableData">
      <template v-slot:operation>
        <el-table-column label="操作" width="130" show-overflow-tooltip>
          <template v-slot="scope">
            <span style="color: #001450; cursor: pointer;" @click="handleLook(scope)">查看</span>
          </template>
        </el-table-column>
      </template>
    </CustomeTable>
    <el-pagination
      style="display:flex;height:60px;align-items:center;background:#fff;z-index:999;bottom:0"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableTotal"
      :current-page="pageInfo.current"
      :page-size="pageInfo.size"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-drawer :visible="drawerVis" direction="rtl" :show-close="false">
      <template slot="title">
        <div class="form-record-header">
          <span>记录表记录</span>
          <div><i class="el-icon-close" @click="closeDrawer" style="cursor: pointer; margin-left: 18px " /></div>
        </div>
      </template>
      <RecordDetail v-if="drawerVis" :activeRecordId="activeRecordId" :external="true" :companyId='companyId' :deviceId="deviceId"/>
    </el-drawer>
  </div>
</template>

<script>
export default {
  props: {
    companyId: {
      type: String,
      default: ""
    },
    deviceId: {
      type: String,
      default: ""
    }
  },
  components: {
    RecordDetail: () => import("../formHistoryRecord/components/recordDetail.vue"),
    CustomeTable: () => import("@/components/tableComponents/customTable.vue")
  },
  data() {
    return {
      tableLoading: false,
      tableDataHeader: [
        { label: "记录表名称", prop: "formName", width: "150", tooltip: true },
        { label: "最后编辑日期", prop: "lastUpdateTime", width: "200", tooltip: true },
        { label: "最后编辑人", prop: "lastUpdateUserName", width: "200", tooltip: true },
        { slot: "operation" }
      ],
      tableData: [],
      pageInfo: {
        size: 30,
        current: 1
      },
      activeRecordId: "",
      drawerVis: false,
      tableTotal: 0
    };
  },
  created() {
    this.getHistoryRecordList();
  },
  methods: {
    async getHistoryRecordList() {
      this.tableLoading = true;
      const params = {
        ...this.pageInfo
      };
      if (this.companyId) {
        params.companyId = this.companyId;
        params.menuCode = "PC_form_customer_access";
      }
      if (this.deviceId) {
        params.deviceId = this.deviceId;
        params.menuCode = "PC_Device_accessForm";
      }
      const res = await this.requestMethodGetTip("/customize/form/record/getFormRecordListOfDeviceAndCompanyId", params);
      res.data.data.list.forEach(item => {
        item.lastUpdateTime = this.moment(item.lastUpdateTime).format("YYYY-MM-DD HH:mm:ss");
      });
      this.tableData = res.data.data.list;
      this.tableTotal = res.data.data.totalCount;
      this.tableLoading = false;
    },
    handleSizeChange(val) {
      this.pageInfo.size = val;
      this.getHistoryRecordList();
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val;
      this.getHistoryRecordList();
    },
    handleLook(scope) {
      this.activeRecordId = scope.row.recordId;
      this.drawerVis = true;
    },
    closeDrawer() {
      this.drawerVis = false;
      this.activeRecordId = "";
    }
  }
};
</script>

<style lang="less" scoped>
.form-record-header {
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
}
</style>
