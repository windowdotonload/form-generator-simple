
<template>
  <div class="customer-group-container">
    <!--查询-->
    <div class="search-bar">
      <el-form :model="searchForm" label-width="100px" style="display: flex; align-items: center">
        <el-form-item label="Table ID">
          <el-input size="small" v-model="searchForm.id" clearable></el-input>
        </el-form-item>
        <el-form-item label="Table name">
          <el-input size="small" v-model="searchForm.tableName" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-button size="small" style="margin-left: 47.5%" @click="resetSearch">重置</el-button>
    </div>
    <!--表格-->
    <div class="table-container">
      <el-table :header-cell-style="{ background: '#f7f7f7' }" :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column show-overflow-tooltip prop="id" label="Table ID" />
        <el-table-column show-overflow-tooltip prop="tableName" label="Table name" />
        <el-table-column show-overflow-tooltip prop="startTime" label="请求时间" />
        <el-table-column show-overflow-tooltip prop="endTime" label="请求完成时间" />
        <el-table-column show-overflow-tooltip prop="result" label="状态" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.result == '失败'" class="dv-item-table"><span class="red">失败</span><span @click="faultDetail(scope.row)" style="cursor: pointer;">详情</span></div>
            <div v-else class="dv-item-table"><span>成功</span></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出框 -->
    <el-dialog :title="'失败详情' + ' > ' + this.tableName" :visible.sync="dialogTableVisible" width="60%" height="70%">
      <div style="padding-bottom: 40px;">
        <el-table :header-cell-style="{ background: '#f7f7f7' }" :data="datatableDataXian" style="width: 100%;padding-bottom: 30px;" height="350">
          <el-table-column show-overflow-tooltip type="index" label="序号" width="50" />
          <el-table-column show-overflow-tooltip prop="startTime" label="请求时间" />
          <el-table-column show-overflow-tooltip prop="endTime" label="请求完成时间" />
          <el-table-column show-overflow-tooltip prop="errorMsg" label="失败详情"></el-table-column>
          <el-table-column width="50">
            <template slot-scope="scope">
              <i class="el-icon-copy-document" style="cursor: pointer;" @click=" copyText(scope.row)"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
        <el-pagination
          background
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="pageInfo1.current"
          :page-size="pageInfo1.size"
          :page-sizes="[10, 30, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableTotal1"
          style="position: absolute;">
        </el-pagination>
      
    </el-dialog>
  </div>
</template>

<script>
import CreateCustomerInfo from "../customerGroup/components/createGroupInfo.vue";
import CreateSelCustomet from "../customerGroup/components/createSelCustomer.vue";
import moment from "moment";
export default {
  data() {
    return {
      loading: false,
      searchForm: {
        id: "",
        tableName: "",
      },
      customerTableData: [],
      customerTablTotal: 0,
      readFlag: [
        { value: "1", label: "成功" },
        { value: "0", label: "失败" },
      ],
      pageInfo: {
        current: 1,
        size: 30,
      },
      modelStateOb: {
        recordData: {
          opType: "create",
        },
        currentStep: 0,
        title: "客户组信息",
        modelBoxWidth: "23%",
        dialogVisible: false,
      },
      dialogTableVisible: false, // 弹出框
      datatableDataXian: [],
      pageInfo1: {
        current: 1,
        size: 10,
      },
      tableName: "",
      tableTotal1:0
    };
  },
  created() {
    this.getCustomerGruopList(); //客户列表数据
  },
  methods: {
    createGroup() {
      const components = { CreateCustomerInfo, CreateSelCustomet };
      this.$createModel({
        modelStateOb: Object.assign(this.modelStateOb, { successCb: this.getCustomerGruopList }),
        components,
      });
    },
    resetSearch() {
      // 重置功能
      this.searchForm = {
        id: "",
        tableName: "",
      };
    },
    async getCustomerGruopList() {
      this.loading = true;
      const params = {
        ...this.pageInfo,
      };
      if (this.searchForm.id) params.id = this.searchForm.id;
      if (this.searchForm.tableName) params.tableName = this.searchForm.tableName;
      const res = await this.requestMethodGetTip("/web/datalakePush/selectDatalakeApiPush", params);
      if (res.data.code == 1000) {
        res.data.data.forEach((itm, num) => {
          res.data.data[num].endTime = moment(itm.endTime).format("YYYY-MM-DD hh:mm:ss");
          res.data.data[num].startTime = moment(itm.startTime).format("YYYY-MM-DD hh:mm:ss");
        });
        this.tableData = res.data.data;
        this.tableTotal = res.data.data.totalCount;
      }
      this.loading = false;
    },
    async faultDetail({ tableName }) {
      this.dialogTableVisible = true;
      this.tableName = tableName;
      this.getXian.call(this,tableName)
    },
    async getXian() {
      const params = {
        ...this.pageInfo1,
        tableName:this.tableName,
      };
      const res = await this.requestMethodGetTip("/web/datalakePush/selectErrorDetailLog", params);
      if (res.data.code == 1000) {
        res.data.data.list.forEach((itm, num) => {
          res.data.data.list[num].endTime = moment(itm.endTime).format("YYYY-MM-DD hh:mm:ss");
          res.data.data.list[num].startTime = moment(itm.startTime).format("YYYY-MM-DD hh:mm:ss");
        });
        this.datatableDataXian = res.data.data.list;
        this.tableTotal1 = res.data.data.totalCount
      }
    },
    handleSizeChange1(val) {
      this.$set(this.pageInfo1, "size", val);
      this.$nextTick(() => {
        this.getXian.call(this)
      });
    },
    handleCurrentChange1(val) {
      this.$set(this.pageInfo1, "current", val);
      this.getXian.call(this)
    },
    copyText(row) {
      const oInput = document.createElement('input')     //创建一个隐藏input（重要！）
      oInput.value = row.errorMsg    //赋值
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand("Copy") // 执行浏览器复制命令
      oInput.className = 'oInput'
      oInput.style.display='none'
      this.$message({ message:'复制成功',type:'success'})
    },
  },
  watch: {
    searchForm: {
      handler(val) {
        this.getCustomerGruopList();
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
.customer-group-container {
  position: relative;
}
.search-bar {
  margin-top: 20px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  width: 100%;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
.table-container {
  height: calc(100vh - 300px);
  // cursor: pointer;
  overflow: auto;
  margin-top: 50px;
  padding: 0 20px;
  .dv-item-table {
    > span.red {
      display: inline-block;
      color: red;
      margin-right: 10px;
    }
    span:last-child {
      color: #3f82ef;
    }
  }
}
.create-btn {
  position: absolute;
  right: 30px;
  top: -60px;
}
.paginXcl{
  position: static;
  bottom: 20px;
  right: 20px;
}
</style>
