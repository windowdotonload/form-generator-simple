<template>
  <div class="train-qaconfiure-container">
    <div class="toolbox-con flexEnd">
      <el-button size="small" type="danger" @click="addEditItem(null,'新建')">新建意见反馈</el-button>
    </div>
    <custom-table
      :tableHeader="tableDataHeader"
      :tableData="tableData"
      :tableHeight="tableHeight + ''"
      :loading="loading"
      class="moreSelectMar"
    >
      <template v-slot:status="slotProps">
        <el-table-column
          label="状态"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
          show-overflow-tooltip
        >
          <template #default="{row}">
            <span v-show="row.status" style="color:#008787">已上线</span>
            <span v-show="!row.status" style="color:#d10000">已下线</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
      <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="200" align="center">
        <template #default="{row}">
          <el-link type="danger" :underline="false" @click.stop="addEditItem(row,'查看')">查看</el-link>
          <el-link type="danger" :underline="false" @click.stop="addEditItem(row,'编辑')">编辑</el-link>
          <el-link type="danger" :underline="false" v-show="!row.status" @click.stop="updownLine(row)">上线</el-link>
          <el-link type="danger" :underline="false" v-show="row.status" @click.stop="updownLine(row)">下线</el-link>
        </template>
      </el-table-column>
    </custom-table>
    <Pagination :total="tableTotal" :pageInfo="tablePageInfo" class="listOptimizePage" />
    <CreateAndEditDrawer ref="detailDrawer" @confirmBack="refreshTableList"/>
  </div>
</template>

<script>
import customTable from "../tableComponents/customTable.vue";
export default {
  components: {
    CreateAndEditDrawer: () => import("./CreateAndEditDrawer.vue"),
    Pagination: () => import("./Pagination.vue"),
    "custom-table": customTable
  },
  data() {
    return {
      tableData: [],
      tableTotal: 0,
      tableLoading: false,
      tablePageInfo: {
        size: 30,
        current: 1
      },
      tableHeight:null,
      tableDataHeader: [
        { label: "创建日期", prop: "createTime", width: "180", tooltip: true},
        { label: "状态", slot: "status", width: "180" },
        { label: "操作", slot: "operation" }
      ],
    };
  },
  watch: {
    tablePageInfo: {
      handler() {
        this.getFeedbackList();
      },
      deep: true
    }
  },
  created() {
    this.getFeedbackList();
  },
  mounted(){
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  methods: {
    getFeedbackList() {
      this.tableLoading = true;
      this.requestMethodGet("/feedback/queryFeedbackList", {...this.tablePageInfo})
        .then(res => {
          this.tableLoading = false;
          if (res.data.code == 1000) {
            this.tableData = res.data.data.list
            this.tableTotal = res.data.data.totalCount
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.tableLoading = false;
        });
    },
    async addEditItem(editItem,type) {
      if(type=='编辑'){
        this.$refs.detailDrawer.evokeDrawer({
          title: "编辑",
          opType: "EDIT",
          editQAItem: editItem
        });
      }else if(type=='查看'){
        this.$refs.detailDrawer.evokeDrawer({
          title: "查看",
          opType: "VIEW",
          editQAItem: editItem
        });
      }else if(type=='新建'){
        this.$refs.detailDrawer.evokeDrawer({
          title: "新建",
          opType: "CREATE"
        });
      }
    },
    // 上/下线
    async updownLine(row) {
      let param = {...row}
      param.status = row.status==0?1:0
      const res = await this.requestMethodPost('feedback/updateFeedback', param);
      if (res.data.code == 1000) {
        this.refreshTableList()
      } else if (res.data.code == 2000){
        this.$message({
          message: res.data.msg,
          type: "warning"
        });
      }
    },
    refreshTableList() {
      this.tablePageInfo.current = 1
      this.getFeedbackList()
    },
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 230
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight()
    });
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/css/customTable.less";
::-webkit-scrollbar {
  display: none;
}
.train-qaconfiure-container {
  padding:0 20px 0 20px;
  /deep/ .el-dialog {
    border-radius: 8px;
  }
  /deep/ .el-link {
    color:#001450;
    margin-right: 10px;
  }
}
.search-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.qa-table-list {
  height: calc(100vh - 250px);
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
