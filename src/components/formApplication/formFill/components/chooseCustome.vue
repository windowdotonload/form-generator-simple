<template>
  <div style="position:relative" v-loading="loadingTable">
    <el-form ref="searchForm" :model="searchForm" label-width="60px" label-position="left">
      <el-form-item label="名称">
        <el-input style="width:30%" v-model="searchForm.companyName" placeholder="请输入" size="mini" clearable @input="searchCustome"></el-input>
      </el-form-item>

      <div>
        <el-table height="390px" :data="customerTable" tooltip-effect="dark" ref="deviceTableRef" :row-key="rowKey" @select="handeleSelectCustome" :header-cell-class-name="cellClass">
          <el-table-column type="selection" width="55" selectable> </el-table-column>
          <el-table-column prop="companyName" min-width="8%" label="名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="taxNumber" min-width="8%" label="税号" show-overflow-tooltip> </el-table-column>
        </el-table>
      </div>
    </el-form>
    <span slot="footer" style="display: flex;align-items: center;justify-content: space-between;" :style="taskType == 'check' || taskType == 'item' ? 'display:flex' : 'display:block'">
      <div style="width:100%;display:flex;align-item:center;position:relative;justify-content:center;margin-top:10px">
        <el-button @click="cancelChoose" size="mini">取 消</el-button>
        <el-button type="danger" size="mini" @click="confirmChoose">确 定</el-button>
      </div>
    </span>
  </div>
</template>

<script>
import debounce from "lodash/debounce";
export default {
  inject: ["addCustome", "customeCardInfoList"],
  data() {
    return {
      loadingTable: false,
      customerTable: [],
      searchForm: {
        companyName: ""
      },
      current: 1,
      selectCustome: []
    };
  },
  mounted() {
    this.registerScrollEvent();
  },
  beforeDestroy() {
    this.uninstallScrollEvent();
  },
  created() {
    this.getCompanyList();
  },
  methods: {
    cellClass(row) {
      if (row.columnIndex == 0) return "table-header-line";
    },
    registerScrollEvent() {
      this.$refs.deviceTableRef.$el.querySelector(".el-table__body-wrapper").addEventListener("wheel", this.scrollDirection, {
        passive: true
      });
      this.$refs.deviceTableRef.$el.querySelector(".el-table__body-wrapper").addEventListener("scroll", this.loadMore, {
        passive: true
      });
    },
    uninstallScrollEvent() {
      this.$refs.deviceTableRef.$el.querySelector(".el-table__body-wrapper").removeEventListener("scroll", this.loadMore);
      this.$refs.deviceTableRef.$el.querySelector(".el-table__body-wrapper").removeEventListener("scroll", this.scrollDirection);
    },
    searchCustome: debounce(function() {
      this.current = 1;
      this.customerTable = [];
      this.getCompanyList();
    }, 800),
    async getCompanyList() {
      this.loadingTable = true;
      const params = {
        orderBy: "createTime",
        descFlag: true,
        companyType: 2,
        current: this.current,
        size: 10
      };
      params.userId = this.$userInfo.userId;
      if (this.searchForm.companyName) params.accountName = this.searchForm.companyName;
      const res = await this.requestMethodPost("/customize/form/record/companyList", params);
      this.customerTable = this.customerTable.concat(res.data.data.list);
      this.cusromerTotal = res.data.data.totalCount;
      this.$nextTick(() => {
        this.revertCheckList();
      });
      this.loadingTable = false;
    },
    revertCheckList() {
      const existIds = this.customeCardInfoList && this.customeCardInfoList.map(item => item.id);
      if (!existIds) return;
      if (!this.selectCustome || !this.searchCustome.length) this.selectCustome = [];
      this.customerTable.forEach(row => {
        if (existIds.includes(row.companyId)) {
          this.selectCustome.push(row);
          this.$refs.deviceTableRef && this.$refs.deviceTableRef.toggleRowSelection(row, true);
        }
      });
    },
    loadMore: debounce(function(e) {
      if (this.deltaY < 0) return;
      const target = e.target;
      const reachBottomFlag = target.scrollTop + target.clientHeight + 30 >= target.scrollHeight;
      if (reachBottomFlag) {
        if (this.customerTable.length >= this.cusromerTotal) return;
        this.current++;
        this.getCompanyList();
      }
    }, 100),
    handeleSelectCustome(val, row) {
      if (val.length == 1) return (this.selectCustome = [row]);
      const prevSel = val.shift();
      this.$refs.deviceTableRef.toggleRowSelection(prevSel, false);
      this.selectCustome = [row];
    },
    cancelChoose() {
      this.selectCustome = [];
      let parent = this.$parent;
      while (!parent.INS && parent && parent.$parent) {
        parent = parent.$parent;
      }
      parent.INS && parent.INS.closeDialog && parent.INS.closeDialog();
    },
    confirmChoose() {
      this.addCustome(this.selectCustome);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  display: none;
}
/deep/ .el-table .table-header-line .cell .el-checkbox__inner {
  display: none;
}
</style>
