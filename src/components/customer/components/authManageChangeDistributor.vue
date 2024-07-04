<template>
  <div v-loading="disListLoading">
    <div v-for="item in distributorList" :key="item.distirbutorCompanyNumer" class="distribute-container">
      <span class="distribute-name" style="width: 30%;">{{ item.distributorCompanyName }}</span>
      <span class="distribute-block" style="width: 20%;margin-left: 5px;">
        更换为
        <img src="@/assets/replace-distributor.png" style="margin-left: 5px;" />
      </span>
      <span class="distribute-block" style="width: 50%;">
        <el-select ref="selDisCompanyREF" v-model="item.newDistributorNumber" placeholder="请选择" size="mini" style="width: 100%;" @click.native="openDialog(item)">
          <el-option :key="item.newDistributorNumber" :label="item.newDistributorName" :value="item.newDistributorNumber"> </el-option>
        </el-select>
      </span>
    </div>

    <el-dialog title="选择分管经销商" :visible.sync="distributorDialog" width="50%" @close="cancelSelDist" style="margin-top: -3%;" :modal="false">
      <div class="workshop_dialog_inner">
        <el-input style="width: 220px;" size="small" placeholder="请输入名称" clearable v-model="searchDisComName" @clear="clearDist">
          <el-button slot="append" icon="el-icon-search" @click="searchDist"></el-button>
        </el-input>
        <div class="workshop_dialog_table" style="margin-top: 10px">
          <el-table
            height="500"
            v-loading="distLoading"
            @selection-change="changeSelDist"
            ref="distributorTable"
            :data="distributorData"
            tooltip-effect="dark"
            :header-cell-style="{ background: '#f7f7f7' }"
          >
            <el-table-column type="selection" />
            <el-table-column prop="companyName" label="经销商名称" min-width="15%" show-overflow-tooltip />
            <el-table-column prop="taxNumber" label="税号" min-width="15%" show-overflow-tooltip />
          </el-table>
        </div>
        <el-pagination
          background
          @size-change="handleSizeChangedistributor"
          @current-change="handleCurrentChangedistributor"
          :current-page="distributorpagenation.current"
          :page-size="distributorpagenation.size"
          :page-sizes="[10, 20, 30, 50]"
          :total="distributorTotal"
          layout="total, sizes, prev, pager, next, jumper"
          style="position: static; bottom: -5px; right: 20px; text-align: right; margin-top: 10px"
        />
        <div style="display: flex; justify-content: flex-end; margin-top: 20px; margin-bottom: -10px">
          <el-button size="mini" type="danger" plain @click="cancelDistributorDialog">取消</el-button>
          <el-button size="mini" type="danger" @click="confirmSelDist">下一步</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="选择数据接收人" :visible.sync="receivePeopleDialogShow" width="50%" :before-close="cancelSelReceivePeople" :modal="false" style="margin-top: -3%;">
      <div>
        <el-form label-width="100px" style="display: flex;margin: 0;align-items: center;width:80%">
          <el-form-item label="姓名" label-position="left" label-width="60px" prop="name" style="width: 40%;margin-bottom: 0;margin-right:20px;">
            <el-input placeholder="请输入姓名" clearable size="mini" v-model="receivePeopleSearchForm.userName" />
          </el-form-item>
          <!-- <el-form-item label="角色" label-position="left" label-width="60px" prop="role" style="width: 40%;margin-bottom: 0;">
            <el-select v-model="receivePeopleSearchForm.roleId" placeholder="请选择" clearable size="mini">
              <el-option v-for="item in fitlerRoleList" :key="item.accessTemplateId" :label="item.accessTemplateName" :value="item.accessTemplateId" />
            </el-select>
          </el-form-item> -->
          <el-button size="mini" @click="handleReset" style="margin-left: 10px;">重置</el-button>
          <el-button size="mini" @click="refreshReceivePersonList" style="margin-left: 10px;" type="danger">搜索</el-button>
        </el-form>
        <div class="workshop_dialog_table" style="margin-top: 10px">
          <el-table v-loading="rpLoading" @selection-change="changeSelRP" ref="rpTable" :data="receivePeopleData" tooltip-effect="dark" :header-cell-style="{ background: '#f7f7f7' }">
            <el-table-column type="selection" />
            <el-table-column prop="userName" label="姓名" min-width="15%" show-overflow-tooltip />
            <el-table-column prop="roleNames" label="角色" min-width="15%" show-overflow-tooltip />
          </el-table>
        </div>
        <el-pagination
          background
          @size-change="handleSizeChangedRPList"
          @current-change="handleCurrentChangeRPList"
          :current-page="receivePeoplePage.current"
          :page-size="receivePeoplePage.size"
          :page-sizes="[10, 20, 30, 50]"
          :total="RPListTotal"
          layout="total, sizes, prev, pager, next, jumper"
          style="position: static; bottom: -5px; right: 20px; text-align: right; margin-top: 10px"
        />
        <div style="display: flex; justify-content: flex-end; margin-top: 20px; margin-bottom: -10px">
          <el-button size="mini" type="danger" plain @click="cancelSelRP">上一步</el-button>
          <el-button size="mini" type="danger" @click="confirmSelRP">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    customerInfo: {
      type: Object
    }
  },
  created() {
    this.getRoleList();
  },
  data() {
    return {
      fitlerRoleList: [],
      show: true,
      distLoading: false,
      disListLoading: false,
      rpLoading: false,
      currentChangeDistributor: null,
      searchDisComName: "",
      distributorList: [],
      distributorDialog: false,
      receivePeopleDialogShow: false,
      receivePeopleData: [],
      RPListTotal: 0,
      receivePeopleSearchForm: {
        userName: "",
        roleId: ""
      },
      distributorpagenation: {
        current: 1,
        size: 10
      },
      receivePeoplePage: {
        current: 1,
        size: 10
      }
    };
  },
  watch: {
    "$parent.visible": {
      handler(show) {
        console.log(show);
        if (show) {
          this.distributorList = [];
          this.generateDistributorList();
        }
      },
      immediate: true
    }
  },
  methods: {
    getRoleList() {
      this.requestMethodGetTip("/web/system/permission/roleManage/allocatedRoleList", {
        roleType: this.$userInfo.userType
      }).then(res => {
        this.fitlerRoleList = res.data.data;
      });
    },
    handleReset() {
      this.receivePeopleSearchForm = {
        name: "",
        role: ""
      };
      this.receivePeoplePage = {
        current: 1,
        size: 10
      };
      this.refreshReceivePersonList();
    },
    cancelDistributorDialog() {
      this.distributorDialog = false;
    },
    openDialog(item) {
      this.rawItem = JSON.parse(JSON.stringify(item));
      this.currentChangeDistributor = item;
      this.$refs.selDisCompanyREF[0].blur();
      this.distributorDialog = true;
      this.getDistributorData();
    },
    cancelSelDist() {
      if (this.rawItem) {
        this.currentChangeDistributor = JSON.parse(JSON.stringify(this.rawItem));
      }
      this.distributorDialog = false;
      this.selDistRes = null;
      this.rawItem = null;
      this.searchDisComName = "";
      this.distributorpagenation = {
        current: 1,
        size: 10
      };
    },
    cancelSelRP() {
      this.receivePeopleDialogShow = false;
      this.receivePeoplePage = {
        current: 1,
        size: 10
      };
    },
    clearSelRP() {
      this.receivePeopleSearchForm = {
        name: "",
        role: ""
      };
      this.selRP = null;
      this.currentChangeDistributor = null;
      // this.cancelSelDist();
    },
    confirmSelDist() {
      if (!this.selDistRes) {
        return this.$message({
          message: "请选择经销商",
          type: "warning"
        });
      }
      this.receivePeopleDialogShow = true;
      this.getReveivePeopleData();
    },
    confirmSelRP() {
      if (!this.selRP) {
        return this.$message({
          message: "请选择数据接收人",
          type: "warning"
        });
      }
      this.currentChangeDistributor.dataReceiverUserId = this.selRP.userId;
      this.cancelSelRP();
      this.cancelSelDist();
    },
    handleSizeChangedRPList(val) {
      this.receivePeoplePage.size = val;
      this.getReveivePeopleData();
    },
    handleCurrentChangeRPList(val) {
      this.receivePeoplePage.current = val;
      this.getReveivePeopleData();
    },
    refreshReceivePersonList() {
      this.receivePeoplePage = {
        current: 1,
        size: 10
      };
      this.getReveivePeopleData();
    },
    async getReveivePeopleData() {
      this.rpLoading = true;
      const res = await this.requestMethodGetTip("/web/system/permission/orgSysUserManagae/userListOfOrg", {
        orgId: this.selDistRes.id,
        ...this.receivePeoplePage,
        ...this.receivePeopleSearchForm
      });
      this.receivePeopleData = res.data.data.list;
      this.RPListTotal = res.data.data.totalCount;
      this.rpLoading = false;
    },
    revertDisCompany() {
      const Index = this.distributorData.findIndex(item => item.id == this.currentChangeDistributor.newDistirbutorCompanyid);
      this.$refs.distributorTable && this.$refs.distributorTable.toggleRowSelection(this.distributorData[Index], true);
    },
    getDistributorData() {
      this.distLoading = true;
      this.requestMethodPost("/web/company/filterSp", {
        spName: this.searchDisComName,
        ...this.distributorpagenation,
        companyType: 1,
        spType:1,
        menuCode: "DealerProfile"
      }).then(res => {
        if (res.data.code == 1000) {
          this.distributorData = res.data.data.list;
          this.distributorTotal = res.data.data.totalCount;
          setTimeout(() => {
            if (!this.currentChangeDistributor) return;
            this.revertDisCompany();
          }, 100);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
        this.distLoading = false;
      });
    },
    searchDist() {
      this.distributorpagenation.current = 1;
      this.getDistributorData();
    },
    changeSelDist(selection) {
      if (selection.length > 1) {
        this.$refs.distributorTable.toggleRowSelection(selection[0], false);
      }
      this.selDistRes = selection[selection.length - 1];
      if (!this.selDistRes) return;
      this.currentChangeDistributor.newDistributorName = this.selDistRes.companyName;
      this.currentChangeDistributor.newDistributorNumber = this.selDistRes.companyNumber;
      this.currentChangeDistributor.newDistirbutorCompanyid = this.selDistRes.id;
    },
    changeSelRP(selection) {
      if (!selection || !selection.length) return;
      if (selection.length > 1) {
        this.$refs.rpTable.toggleRowSelection(selection[0], false);
      }
      this.selRP = selection[selection.length - 1];
      this.selRP.companyId = this.selDistRes.newDistirbutorCompanyid;
    },
    clearDist() {
      this.distributorpagenation.current = 1;
      this.getDistributorData();
    },
    cancelSelReceivePeople() {
      this.receivePeopleSearchForm = {
        userName: "",
        roleId: ""
      };
      this.cancelSelRP();
    },
    handleSizeChangedistributor(size) {
      this.distributorpagenation.size = size;
      this.distributorpagenation.current = 1;
      this.getDistributorData();
    },
    handleCurrentChangedistributor(current) {
      this.distributorpagenation.current = current;
      this.getDistributorData();
    },
    async generateDistributorList() {
      this.disListLoading = true;
      const res = await this.requestMethodGetTip("/web/company/getSpsOfAccount", {
        accountId: this.customerInfo.companyId
      });
      this.disListLoading = false;
      this.distributorList = res.data.data.map(item => {
        return {
          distributorCompanyName: item.spName,
          distirbutorCompanyNumer: item.spNumber,
          distirbutorCompanyid: item.spId,
          newDistributorName: item.spName,
          newDistributorNumber: item.spNumber,
          newDistirbutorCompanyid: item.spId
        };
      });
    }
  }
};
</script>
<style scoped lang="less">
.distribute-container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  box-sizing: border-box;
  width: 100%;
}
.distribute-name {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.distribute-block {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-customer-profile {
  padding: 20px;
  height: calc(100% - 60px);
  overflow: auto;
  &-title {
    font-weight: bold;
    font-size: 16px;
    span {
      color: #999999;
      font-size: 14px;
      font-weight: normal;
    }
  }
}
.detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.info {
  width: 960px;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
}
.info-title {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e9e9e9;
}
.title {
  margin-left: 10px;
  font-size: 14px;
  line-height: 14px;
  font-weight: bold;
  color: #000;
}
.line {
  width: 4px;
  height: 14px;
  background: #dd0000;
  margin-left: 20px;
}
.detail-form {
  margin-top: 20px;
  margin-left: 80px;
}
</style>
