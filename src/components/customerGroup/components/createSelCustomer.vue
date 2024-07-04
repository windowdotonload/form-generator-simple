<template>
  <div class="selcustomer-container">
    <div class="search-bar">
      <el-form :model="searchForm" style="display: flex; align-items: center">
        <el-form-item label="客户名称" label-width="80px">
          <el-input v-model="searchForm.companyName" size="small" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="行业" label-width="60px">
          <el-cascader
            v-model="searchForm.industry"
            size="small"
            :checkStrictly="true"
            placeholder="请输入关键词(多选)"
            :options="industryData"
            :props="typeProps"
            collapse-tags
            :show-all-levels="false"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="所属经销商" label-width="100px">
          <el-select size="small" v-model="searchForm.distributorTaxNo" :filter-method="handleGetCompanyNameData" filterable clearable placeholder="请输入">
            <el-option v-for="item in companyNameList" :key="item.taxNumber" :label="item.companyName" :value="item.taxNumber"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <el-table
        ref="selTable"
        @select="selectRow"
        @selection-change="selChange"
        height="500"
        row-key="companyId"
        :header-cell-style="{ background: '#f7f7f7' }"
        :data="customerTableData"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column :reserve-selection="true" type="selection" width="55" />
        <el-table-column prop="companyName" label="客户名称" width="300px">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span>{{ scope.row.companyName }}</span
              ><span class="self-tips" v-if="roleType == '0' && selfCompanyNumber == scope.row.customerCompanyNumber">直</span>
              <img v-if="scope.row.pesFlag == '1'" src="../../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
              <img v-if="scope.row.pesFlag == '2'" src="../../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
              <img v-if="scope.row.spFlag == '1'" src="../../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="regionCityName" label="城市" />
        <el-table-column show-overflow-tooltip prop="companyIndustryName" label="行业" />
        <el-table-column show-overflow-tooltip prop="createTimeStr" label="创建日期" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <span v-if="row.status == 1" style="color: rgb(0, 136, 136); font-weight: 800">使用中</span>
            <span v-if="row.status == 2" style="color: #008888; font-weight: 800">潜在客户</span>
            <span v-if="row.status == 3" style="color: #008888; font-weight: 800">现有客户</span>
            <span v-if="row.status == 0" style="color: #d10000; font-weight: 800">已停用</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="width: 100%; display: flex; justify-content: flex-end; position: relative">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="customerTablTotal"
        style="position: relative; right: 10px; bottom: 0; margin-top: 10px"
      >
      </el-pagination>
    </div>
    <div style="display: flex; justify-content: flex-end; margin-top: 20px">
      <el-button size="small" plain @click="cancel">取消</el-button>
      <el-button size="small" type="danger" @click="createGroup">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["modelStateOb"],
  data() {
    return {
      loading: false,
      companyNameList: [],
      industryData: [],
      customerTableData: [],
      customerTablTotal: 0,
      selTableSelection: [],
      pagenation: {
        current: 1,
        size: 10
      },
      typeProps: {
        multiple: true,
        value: "code",
        label: "name",
        emitPath: false
      },
      searchForm: {
        companyName: "",
        industry: [],
        distributorTaxNo: ""
      }
    };
  },
  created() {
    this.$_getIndustryData();
    this.$_getCustomerData();
    this.handleGetCompanyNameData();
  },
  methods: {
    async createGroup() {
      const params = {
        groupName: this.modelStateOb.recordData.groupName,
        comoanyIds:
          this.modelStateOb.recordData.opType == "create"
            ? this.selTableSelection.map(item => item.companyId)
            : [...new Set(this.selTableSelection.map(item => item.companyId).concat(this.modelStateOb.recordData.comoanyIds))]
      };
      if (this.modelStateOb.recordData.editFlag) {
        params.id = this.modelStateOb.recordData.groupId;
      }
      if (!params.comoanyIds.length) return this.$message.warning("请至少选择一个选择客户");
      const url = this.modelStateOb.recordData.editFlag ? "/company/group/update" : "/company/group/add";
      const res = await this.requestMethodPostTip(url, { ...params });
      if (res.data.code == 1000) {
        this.modelStateOb.dialogVisible = false;
        this.modelStateOb.successCb();
        if (this.modelStateOb.resetName) {
          this.modelStateOb.resetName(this.modelStateOb.recordData.groupName);
        }
      }
    },

    cancel() {
      this.modelStateOb.recordData = {};
      this.modelStateOb.dialogVisible = false;
    },
    selectRow(selection, row) {
      if (this.modelStateOb.recordData.opType && this.modelStateOb.recordData.opType == "create") return;

      const index = this.modelStateOb.recordData.comoanyIds.findIndex(item => item == row.companyId);
      if (index >= 0) {
        this.modelStateOb.recordData.comoanyIds.splice(index, 1);
      }
    },
    selChange(selection) {
      this.selTableSelection = selection;
    },
    handleSizeChange(val) {
      this.pagenation.size = val;
      this.$_getCustomerData();
    },
    handleCurrentChange(val) {
      this.pagenation.current = val;
      this.$_getCustomerData();
    },
    // 获取工业客户列表
    $_getCustomerData() {
      this.loading = true;
      let params = { ...this.pagenation };
      params.areaCode = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).areaCode;
      if (this.searchForm.companyName) params.companyName = this.searchForm.companyName;
      if (this.searchForm.distributorTaxNo) params.distributorTaxNo = this.searchForm.distributorTaxNo;
      if (this.searchForm.industry.length > 0) params.industry = this.searchForm.industry;
      params.menuCode = "CustomerProfileList";
      this.customerTableData = [];
      this.requestMethodPost("/company/group/companyListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.customerTableData = res.data.list;
            this.customerTablTotal = res.data.totalCount;
            const reverseIndex = [];
            res.data.list.forEach((item, index) => {
              if (this.modelStateOb.recordData.comoanyIds.includes(item.companyId)) {
                reverseIndex.push(index);
              }
            });

            this.$nextTick(() => {
              reverseIndex.forEach(index => {
                this.$refs.selTable.toggleRowSelection(this.customerTableData[index], true);
              });
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.loading = false;
        });
    },
    $_getIndustryData() {
      let params = {
        parentCode: "company_industry"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.industryData = res.data;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },

    handleGetCompanyNameData(val) {
      let areaCode = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).areaCode;
      let params = {
        areaCode: areaCode,
        size: 300
      };
      this.requestMethodPostTip("/web/company/filterSp", params).then(res => {
        res = res.data;

        if (res.code == 1000) {
          this.companyNameList = res.data.list;
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    }
  },
  watch: {
    searchForm: {
      handler() {
        this.pagenation = {
          current: 1,
          size: 10
        };
        this.$_getCustomerData();
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.selcustomer-container {
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
  margin-top: 20px;
  padding: 0 20px;
}
.create-btn {
  position: absolute;
  right: 30px;
  top: -60px;
}
</style>
