<template>
  <el-dialog title="关联工单" :visible.sync="contactWorkorderDialogFlag" :close-on-click-modal="false" :before-close="handleResetFrom" width="65%">
    <div v-if="dialogType=='plan'" style="margin-bottom:20px;margin-left:6px;">
      <span style="color:#dd0000;">*</span> 计划目标
      <el-select v-model="planId" clearable placeholder="请选择" size="small" style="width:200px;margin-left:10px;">
          <el-option
            v-for="(item,index) in planList"
            :key="item.id"
            :label='`计划目标${ index+1 }`'
            :value="item.id">
          </el-option>
        </el-select>
    </div>
    <el-form ref="searchForm" label-width="80px" :inline="true">
      <el-form-item label="服务类型">
        <el-cascader
          size="small"
          style="width:200px;"
          popper-class="pc-sel-area-cascader"
          :options="serviceTypeList"
          :props="industruProps"
          collapse-tags
          filterable
          clearable
          placeholder="请选择"
          v-model="serviceTypeVal"
          @change="handleSelectServiceType">
        </el-cascader>
      </el-form-item>
      <el-form-item label="工单状态">
        <el-select size="small" v-model="workOrderStatus" style="width:200px;" collapse-tags multiple clearable placeholder="请选择">
          <el-option
            v-for="item in workorderListStatus"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left:20px;">
        <el-button plain @click="handleResetQuery" size="small">重置</el-button>
        <el-button type="danger" @click="handleSearchQuery" size="small">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <custom-table
      ref="customTableWorkorder"
      :tableHeader="tableDataHeader"
      :tableData="workorderTableData"
      :tableHeight="tableHeight + ''"
      :loading="loading"
      :pageInfoCurrent="pagenation.current"
      @loadMore="loadMore"
      @selectionChange="handleSelectionChange"
    >
      <el-table-column fixed slot="selection" type="selection" :resizable="false" :reserve-selection="true" width="55"></el-table-column>
      <template v-slot:workOrderStatusName="slotProps">
        <el-table-column
          :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
          label="工单状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="workOrder-Status" style="color: #dd0000" v-if="scope.row.workOrderStatus == '0' || scope.row.workOrderStatus == '9'">{{ scope.row.workOrderStatusName }}</span>
            <span class="workOrder-Status" style="color: #001450" v-if="scope.row.workOrderStatus == '2'">{{ scope.row.workOrderStatusName }}</span>
            <span class="workOrder-Status" style="color: #008888" v-if="scope.row.workOrderStatus == '1'">{{ scope.row.workOrderStatusName }}</span>
            <span class="workOrder-Status" style="color: #999999" v-if="scope.row.workOrderStatus == '4'">{{ scope.row.workOrderStatusName }}</span>
            <span class="workOrder-Status" style="color: #999999" v-if="scope.row.workOrderStatus == '3'">{{ scope.row.workOrderStatusName }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
    </custom-table>
    <div class="warn-tip">
      <img src="../../../assets/warning.png" alt="" class="warn-tip-img" />
      您可以选择并关联本年度没有关联{{dialogType=='plan'?'计划工程服务':'服务申请'}}的其它工单！
    </div>
    <div slot="footer" class="dialog-footer" style="margin-top:30px;">
      <el-button plain @click="handleResetFrom" size="small">取消</el-button>
      <el-button type="danger" @click="handleSubmitForm" size="small">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import customTable from "../../tableComponents/customTable";
import columnHeader from "../../tableComponents/headerComponent";
export default {
  data() {
    return {
      serviceTypeVal: '',
      workOrderStatus: [],
      serviceTypeList: [],
      industruProps: {
        value: "serviceNumber",
        label: "serviceName",
        children: "children",
        disabled: !"hasAuth",
        multiple: true
      },
      planId: '',
      planList:[],  // 计划目标的数据
      workorderListStatus: [],
      pageInfo: {
        current: 1,
        size: 500
      },
      tableHeight: 400,
      tableDataHeader: [
        { slot: "selection" },
        { prop: "workOrderNumber", label: "工单编号", width: "150", tooltip: true },
        { prop: "distributeTime", label: "派工时间", width: "100", tooltip: true },
        { prop: "contactCompanyName", label: "所属客户", width: "250", tooltip: true },
        { prop: "executePersonName", label: "执行人", width: "150", tooltip: true },
        { slot: "workOrderStatusName", label: "工单状态", width: "100" },
      ],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      selectChecked: [],
      companyIndustryCode: [],
      workorderTableData: [], // 客户列表
      selectList: [], // 表格多选列表
      loading: false,
      customerId: "",
      loadingDialog: false,
      key: 1, // table key
      totalNumber: 0, // 总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 500
      },
      // UI优化
      roleType: ""
    };
  },
  props: {
    planList: {
      type: Array,
      default: null
    },
    contactWorkorderDialogFlag: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    dialogType: {
      type: String,
      default: () => {
        return '';
      }
    },
    serviceApplyOrderId: {
      type: String,
      default: () => {
        return '';
      }
    },
    serviceApplyStatus: {
      type: String,
      default: () => {
        return '';
      }
    },
    pesId: {
      type: String,
      default: () => {
        return '';
      }
    },
    spId: {
      type: String,
      default: () => {
        return '';
      }
    },
    companyIds: {
      type: String,
      default: () => {
        return '';
      }
    },
    serviceCompanyId: {
      type: String,
      default: () => {
        return '';
      }
    },
    relatedWorkOrdersYear: {
      type: String,
      default: () => {
        return '';
      }
    },
    selectCustomerList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  components: {
    "column-header": columnHeader,
    "custom-table": customTable
  },
  async mounted() {
    this.$_getWorkorder();
    this.$_getServiceListAll();
    const res =  await this.requestMethodGet("/workOrder/getWorkOrderStatusDropDown", {workOrderStatus: ""});
    if (res.data.code == 1000) {
      res.data.data.forEach(item=>{
        this.workorderListStatus.push({code: item.workOrderStatus,name: item.workOrderStatusName})
      })
      this.workorderListStatus.unshift({ code: 5, name: "全部" });
    } else {
      this.$message({
        message: res.data.msg,
        type: "warning"
      });
    }
  },
  created() {
    this.customerId = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyId;
    this.roleType = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).roleType;
    if (this.roleType != 0) {
      delete this.queryParams.customerType;
    }
  },
  methods: {
    handleResetQuery() {
      this.serviceTypeVal = '';
      this.workOrderStatus = [];
      this.pagenation.current = 1;
      this.$_getWorkorder();
    },
    handleSearchQuery(){
      this.pagenation.current = 1;
      this.$_getWorkorder();
    },
    handleSelectServiceType(val) {
      let arr = []
      if(val.length>0){
        val.forEach(item=>{
          item.forEach(it=>{
            arr.push(it)
          })
        })
        this.serviceTypeVal = arr.join(',')
      }else{
        this.serviceTypeVal = ''
      }
    },
    // 服务类型
    $_getServiceListAll() {
      this.serviceTypeList = [];
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", { serviceName: "", disabled: true })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.serviceTypeList = res.data;
            this.serviceTypeList = this.formatData(this.serviceTypeList);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.formatData(data[i].children);
        }
      }
      return data;
    },
    async loadMore(e) {
      if (this.workorderTableData == this.totalNumber) return;
      this.pagenation.current++;
      await this.$_getWorkorder();
    },
    clearSelectCustomer() {
      this.$refs.customTableWorkorder.clearSelection();
    },
    handleResetFrom() {
      this.$refs.customTableWorkorder.clearSelection();
      this.selectList = []
      this.planId = ''
      this.workOrderStatus = []
      this.serviceTypeVal = []
      this.contactWorkorderDialogFlag = false
      this.$parent.contactWorkorderDialogFlag = false
    },
    handleSubmitForm() {
      let params = {}
      let url = ''
      if(this.selectList.length==0){
        this.$message({
          message: '请选择关联工单',
          type: "warning"
        });
        return
      }
      if(this.dialogType=='plan'){
        if(this.planId=='') {
          this.$message({
            message: '请选择计划目标',
            type: "warning"
          });
          return
        }
        url = "/pes/item/relatedWorkOrders"
        let pesServiceItemList = []
        this.selectList.forEach(item=>{
          pesServiceItemList.push({
            status: Number(item.workOrderStatus),
            serviceNumber: item.serviceNumber,
            serviceName: item.serviceName,
            workOrderNumber: item.workOrderNumber,
            chargeUserId: item.executePersonId||'',
            planStartTime: item.createTime||''
          })
        })
        params = {
          planId: this.planId,
          pesId: this.pesId,
          pesServiceItemList: pesServiceItemList
        }
      }else if(this.dialogType=='apply'){
        url = "/serviceApply/relatedWorkOrders"
        let applyOrderServiceRelList = []
        this.selectList.forEach(item=>{
          applyOrderServiceRelList.push({
            serviceApplyOrderId: this.serviceApplyOrderId,
            serviceNumber: item.serviceNumber,
            workOrderNumber: item.workOrderNumber,
            serviceChargeUserId: item.executePersonId||'',
            workOrderStatus: item.workOrderStatus,
            serviceApplyStatus: Number(this.serviceApplyStatus)
          })
        })
        params = {
          applyOrderServiceRelList: applyOrderServiceRelList
        }
      }
      this.requestMethodPost(url, params)
      .then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: '关联成功',
            type: "success"
          });
          this.$emit('handleSubmitBack')
          this.$refs.customTableWorkorder.clearSelection();
          this.handleResetFrom()
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      })
      .catch(res => {
      });
    },
    // 表格多选事件
    handleSelectionChange(select) {
      this.selectList = select
    },
    // 获取工单列表
    $_getWorkorder() {
      if(this.totalCount<=this.workorderTableData.length){
        this.$message({
          message: '暂无更多数据',
          type: "warning"
        });
        return
      }
      this.loading = true;
      let params = {
      }
      if(this.dialogType == 'plan') {
        params = {
          menuCode: 'PC_PES_WorkOrderAssociation',
          orderBy: 'workOrderNumber',
          descFlag: true,
          ...this.pagenation, 
          relatedWorkOrdersFlag: 1,
          spId: this.spId,
          companyIds: this.companyIds,
          relatedWorkOrdersYear: this.relatedWorkOrdersYear,
          serviceNumber: this.serviceTypeVal,
          workOrderStatus: '',
        }
      }else if(this.dialogType == 'apply') {
        params = {
          menuCode: 'NewWorkOrderList',
          orderBy: 'workOrderNumber',
          descFlag: true,
          ...this.pagenation, 
          relatedWorkOrdersFlag: 2,
          companyIds: this.companyIds,
          serviceNumber: this.serviceTypeVal,
          workOrderStatus: '',
          spId: this.spId
        }
      }
      params.workOrderStatus = this.workOrderStatus.includes(5)?'':this.workOrderStatus.toString()
      this.requestMethodGet("/weChat/workOrder/customerWithWorkOrderByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.workorderTableData = res.data.list
            this.totalCount = res.data.totalCount
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
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/css/customTable.less";
.customer-profile {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: 28%;
      text-align: right;
      padding-bottom: 10px;
    }
  }
}
.warn-tip{
  color:#999;
  font-size:12px;
  display:flex;
  align-items:center;
  margin-top: 20px;
}
.warn-tip-img{
  width:16px;
  height:16px;
  margin-right:5px;
}
// 设置显示两行，超出省略
/deep/ .el-table th > .cell {
  word-break: keep-all !important;
  white-space: nowrap !important;
}
.no-wrap-name {
  white-space: nowrap;
  max-width: 75%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.self-tips {
  margin-left: 10px;
  min-height: 20px;
  min-width: 20px;
  width: 20px;
  height: 20px;
  background-color: #ccddff;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  font-size: 12px;
  line-height: 22px;
  color: #666;
}
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #001450 !important;
  border-color: #001450 !important;
}
/deep/ .el-dialog__body{
  padding: 30px 20px 10px;
}
.workOrder-Status {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    font-weight: bold;
  }
</style>
