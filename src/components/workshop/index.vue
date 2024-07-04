<template>
  <div class="main-box-train">
    <div class="train-management" :style="mainminheight">
      <el-button v-has="newWorkshop" @click="handleCreateWorkshop" size="small" type="danger" style="margin-bottom: 20px;float: right;">新建车间</el-button>

      <!-- 表格 -->
      <custom-table class="table" :tableHeader="tableDataHeader" :tableData="newsTableData" :tableHeight="tableHeight + ''" :loading="loading">
        <el-table-column slot="deviceCount" align="center" label="设备">
          <template slot-scope="scope">
            <span>{{ scope.row.deviceCount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="$_has('manageWorkshop')" :resizable="false" slot="operation" fixed="right" label="操作" width="230" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link @click="handleEditWorkshop(scope.row)" style="margin-right:10px;color:rgb(0,20,79)" :underline="false">编辑 </el-link>
            <el-link @click="handletranferEquip(scope.row)" style="margin-right:10px;color:rgb(0,20,79)" :underline="false">转移设备 </el-link>
            <el-link v-if="scope.row.isNo != 1" @click="handleDeleteWorkshop(scope.row)" style="margin-right:10px;color:#dd0000" :underline="false">删除 </el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        v-if="totalNumber > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        style="float: right;display:flex; margin-top: 10px"
      ></el-pagination>
    </div>

    <!-- 新增车间 -->
    <CreateWorkshop
      :createWorkshopDialog="createWorkshopDialog"
      :workshopType="workshopType"
      :companyId="userInfo.companyId"
      :addWorkshopForm="addWorkshopForm"
      :customerCompanyType="customerCompanyType"
      v-on:addOrEditWorkshop="addOrEditWorkshop"
      v-on:closeDialogAdd="closeDialogAdd"
      ref="child"
    />
    <!-- 选择设备 车间 -->
    <lupDialogNew
      :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
      :singleFlag="false"
      :selectMax="selectMax"
      :checkedDevice="checkedDevice"
      :urlType="urlType"
      :companyName="userInfo.orgInfo.companyName"
      :taskType="taskType"
      :workShopId="workShopId"
      :companyId="userInfo.companyId"
      :companyNumber="userInfo.companyNumber"
      :menuCode="'PC_workshopdata'"
      v-on:confirmTranfer="confirmTranfer"
      v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
      v-on:confirmChooseLup="confirmChooseLup"
    >
    </lupDialogNew>
  </div>
</template>

<script>
import lupDialogNew from "../spotInspection/components/chooseLubricationPointWorkorder.vue";
import CreateWorkshop from "../customer/components/createWorkshop";
import customTable from "../tableComponents/customTable";
import columnHeader from "../tableComponents/headerComponent";
import customField from "../tableComponents/customField";
export default {
  components: {
    CreateWorkshop,
    lupDialogNew,
    "custom-field": customField,
    "custom-table": customTable,
    "column-header": columnHeader,
    "custom-field": customField,
    customerListCom: ()=>import("../tableComponents/customerList"),},
    data() {
      return {
        createWorkshopDialog:false,  // 新建车间的弹框显隐
        chooseDeviceAndLupDialog:false,
        checkedDevice:[],
        workShopId:'',
        workshopType:'',  // 创建车间类型
        companyId:'',
        userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
        customerCompanyType:'',
        companyNumber:'',
        addWorkshopForm:{},  // 编辑车间选中的数据
        urlType:'workshop',
        newsTableData:[],
        changeFlag:false,
        mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
        tableDataHeader: [
        { prop: "workshopName", label: "车间名称", width: "200",  tooltip: true },
        { prop: "deviceCount", label: "设备数", width: "130", tooltip: true },
        { prop: "createTime", label: "创建日期", width: "200", tooltip: true },
        { slot: "operation",width: "200", label: "操作" }
      ],
      pagenation: {
        current: 1,
        size: 30
      },
      totalNumber: 0, // 总条数
      loading: false // 是否加载
    };
  },

  async created() {
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "device-workshop-change-btn") {
        this.changeFlag = true;
      }
    }
  },
  mounted() {
    this.getOrderManagementData(); // 获取订单列表
  },
  methods: {
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 200}px`;
    },
    // 获取车间列表
    getOrderManagementData() {
      this.loading = true;
      let params = {
        ...this.pagenation
      };
      this.newsTableData = [];
      params.menuCode = 'PC_workshopdata'
      this.requestMethodGet("/web/system/permission/orgWorkShopManage/overviewByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.newsTableData = res.data.list;
            this.totalNumber = res.data.totalCount;
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
    confirmTranfer() {
      this.chooseDeviceAndLupDialog = false;
      this.pagenation.current = 1;
      this.getOrderManagementData(); // 获取订单管理列表
    },
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
      this.getOrderManagementData(); // 获取订单管理列表
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.getOrderManagementData(); // 获取订单管理列表
    },
    // 点击新建车间
    handleCreateWorkshop() {
      this.createWorkshopDialog = true;
      this.workshopType = "add";
      this.addWorkshopForm = {
        workshopName: "",
        workshopPrincipal: [],
        distributorId: ""
      };
    },
    // 编辑车间
    handleEditWorkshop(row) {
      console.log(row);
      if (row.isNo == 1) {
        this.workshopType = "editNo";
      } else {
        this.workshopType = "edit";
      }
      this.addWorkshopForm = row; // 编辑车间选中的数据
      this.createWorkshopDialog = true;
      this.$gio.EditingWorkshop({
        entrance: "编辑车间"
      });
    },
    handleDeleteWorkshop(row) {
      this.$confirm("是否确认删除车间？", "删除车间", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.requestMethodGet("/weChat/workshop/canDissolveWorkshop", {
            workshopId: row.workshopId
          })
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.deleteWorkshop(row);
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
        })
        .catch(() => {});
    },
    deleteWorkshop(item) {
      const params = {
        workshopId: item.workshopId,
        workshopPrincipalPostId: item.workshopPrincipalPostId
      };
      this.requestMethodGet("/web/system/permission/orgWorkShopManage/delete", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: item.workshopName + "车间删除成功",
            type: "success"
          });
          this.pagenation.current = 1;
          this.getOrderManagementData(); // 刷新车间列表
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        this.$gio.DeleteWorkshop();
      });
    },
    addOrEditWorkshop(formName) {
      console.log(formName);
      let params;
      let url;
      if (this.workshopType == "add") {
        url = "/web/system/permission/orgWorkShopManage/add";
        params = {
          companyId: this.userInfo.companyId,
          workshopName: formName.workshopName
        };
      } else {
        url = "/web/system/permission/orgWorkShopManage/edit";
        params = {
          id: this.addWorkshopForm.workshopId,
          workshopName: formName.workshopName
        };
      }
      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
          let msg = this.workshopType == "add" ? "新建成功" : "编辑成功";
          this.$message({
            message: msg,
            type: "success"
          });
          this.createWorkshopDialog = false;
          this.pagenation.current = 1;
          this.getOrderManagementData(); // 刷新车间列表
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
        this.$gio.Clicksave();
      });
    },
    closeDialogAdd() {
      this.createWorkshopDialog = false;
    },
    // 转移设备
    handletranferEquip(row) {
      this.workShopId = row.workshopId;
      this.chooseDeviceAndLupDialog = true;
    },
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false;
    },
    confirmChooseLup(list) {
      console.log(list);
      this.chooseDeviceAndLupDialog = false;
      this.checkedDeviceForm.checkedDevice = list;
      console.log(this.checkedDeviceForm.checkedDevice);
    }
  }
};
</script>
<style lang="less">
.train-management {
  padding: 10px 25px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    margin: 0px 0 22px;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: rgba(254, 0, 12, 1) !important;
    border-color: rgba(254, 0, 12, 1) !important;
  }
  .el-radio-button__inner:hover {
    color: rgba(254, 0, 12, 1) !important;
  }
  .is-active .el-radio-button__inner:hover {
    color: #fff !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f7fa !important;
  }
  .el-tabs__item.is-active {
    color: #fe000c !important;
    font-weight: 900 !important;
  }
  .el-tabs__active-bar {
    background-color: #fe000c !important;
  }
  .el-tabs__item:hover {
    color: #fe000c !important;
  }
}
</style>
<style lang="less">
.preview-dialog .el-scrollbar__wrap,
.drawer-box .el-scrollbar__wrap {
  overflow-x: hidden;
}
.main-box-train .el-dialog__body {
  padding-top: 5px !important;
}
.el-icon-delete:hover {
  color: #dd0000;
}
.el-pager li.active {
  color: #dd0000 !important;
}
.deletBtn .el-button--primary {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.deletBtn .el-message-box__container {
  position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
}
.deletBtn .el-message-box__message {
  word-break: break-all !important;
}
.drawer-box {
  .el-drawer__header {
    font-size: 18px;
    color: #000;
    line-height: 26px;
    margin-bottom: 8px !important;
  }
  .el-drawer__body {
    padding-left: 20px;
    height: calc(100% - 50px);
  }
  .train-name {
    color: #999;
    font-size: 13px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e9e9e9;
  }
  .title {
    font-size: 14px;
    color: #000;
    font-weight: bold;
    margin: 20px 0;
  }
  .grid-content {
    background: rgba(204, 221, 255, 0.2);
    padding: 20px;
  }
  .col-5 {
    width: 20%;
    margin-right: 10px;
    border: 1px solid rgba(204, 221, 255, 0.8);
    border-radius: 6px;
    .name {
      color: #666;
      font-size: 14px;
      margin-bottom: 20px;
    }
    .number {
      color: #dd0000;
      font-size: 20px;
      display: inline;
      font-weight: bold;
      cursor: pointer;
    }
  }
  .status {
    position: relative;
    padding-left: 15px;
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
    display: inline-block;
    &::before {
      content: "";
      position: absolute;
      top: 6px;
      left: 0;
      width: 6px;
      height: 6px;
      background-color: #3ba1ff;
      border-radius: 3px;
    }
  }
  .star2::before {
    background-color: #37cbcb;
  }
  .star3::before {
    background-color: #4fcb74;
  }
  .star4::before {
    background-color: #fbd438;
  }
  .star5::before {
    background-color: #f2647c;
  }
}
</style>
