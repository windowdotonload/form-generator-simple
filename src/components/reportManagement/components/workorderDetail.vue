<template>
  <div class="detail_info" :style="'height:' + tableHeight + 'px'">
    <div class="report_msg"><img src="../../../assets/report_title.svg" alt="" />&nbsp;报告信息</div>
    <div v-if="JSON.stringify(detailObj) == '{}'" class="no-msg">暂无信息</div>
    <div v-else>
      <div class="cus_info" v-if="userInfo.userType != 2">
        <div class="belong_to">归属</div>
        <div style="font-weight:bold;">
          <div style="display: flex; align-items: center">
            所属客户：<span style="color:#008888;">{{ detailObj.companyName || "-" }}</span>
            <span class="self-tips" v-if="detailObj.customerCompanyType == 0">直</span>
            <img v-if="detailObj.pesFlag == '1' || detailObj.pesFlag == '3'" src="../../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
            <img v-if="detailObj.pesFlag == '2' || detailObj.pesFlag == '3'" src="../../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
            <img v-if="detailObj.spFlag == '1'" src="../../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
          </div>
        </div>
      </div>
      <div style="font-size:14px;">
        <div :style="userInfo.userType != 2 ? 'font-weight:bold;margin-bottom:15px;' : 'font-weight:bold;margin-bottom:15px;margin-top:20px'">来源</div>
        <div style="margin-bottom:10px;"><span class="item_left">服务项</span>{{ detailObj.serviceName || "-" }}</div>
        <div style="margin-bottom:10px;">
          <span class="item_left">工单编号</span>{{ detailObj.workOrderNumber || "-" }}<span class="see_workorder_detail" @click="handleWorkorderDetail()">查看工单详情</span>
        </div>
        <div style="margin-bottom:10px;display: flex;align-items: center;"><span class="item_left">服务商</span>{{ detailObj.distributorCompanyName || "-" }}
          <img v-if="detailObj.assistSpFlag" src="../../../assets/da_icon.png" alt="" style="width:24px;margin-left:8px;" />
        </div>
        <div style="margin-bottom:10px;" v-show="activeName == '计划工程服务'"><span class="item_left">工单服务等级</span>{{ detailObj.workOrderPesFlagName || "-" }}</div>
        <div style="margin-bottom:10px;" v-show="activeName == '计划工程服务'"><span class="item_left">计划工程服务档案</span>{{ detailObj.servicePackage || "-" }}</div>
        <div v-if="detailObj.deviceList.length > 0">
          <div style="font-weight:bold;margin-bottom:15px;margin-top:10px;">相关设备</div>
          <div v-for="(item, index) in detailObj.deviceList" :key="index">
            <div style="margin-bottom:10px;"><span class="item_left">设备名称</span>{{ item.name || "-" }}</div>
            <div style="margin-bottom:10px;"><span class="item_left">设备类型</span>{{ item.typeName || "-" }}</div>
            <div style="margin-bottom:10px;"><span class="item_left">设备编码</span>{{ item.number || "-" }}</div>
          </div>
          <div style="font-weight:bold;margin-bottom:15px;margin-top:10px;">相关润滑点</div>
          <div v-for="(item, index) in detailObj.lubricationList" :key="index">
            <div style="margin-bottom:10px;"><span class="item_left">润滑点名称</span>{{ item.name || "-" }}</div>
            <div style="margin-bottom:10px;"><span class="item_left">润滑点设备类型</span>{{ item.typeName || "-" }}</div>
          </div>
          <div style="margin-bottom:10px;" v-show="activeName == 'MSLA工单'">
            <span class="item_left">油品检测等级</span><span style="color:#008888;" v-show="detailObj.reportLevelName == '正常'">正常</span
            ><span style="color:#DD0000;" v-show="detailObj.reportLevelName == '警告'">警告</span><span style="color:#FF9900;" v-show="detailObj.reportLevelName == '预警'">预警</span>
          </div>
          <div style="margin-bottom:10px;" v-show="activeName == 'MSLA工单'"><span class="item_left">润滑油</span>{{ detailObj.lubricationOil || "-" }}</div>
          <div style="margin-bottom:10px;" v-show="activeName == 'MSLA工单'"><span class="item_left">设备制造商</span>{{ detailObj.mslaManufacturer || "-" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableHeight: {
      type: String,
      default: () => {
        return "";
      }
    },
    activeName: {
      type: String,
      default: () => {
        return "";
      }
    },
    detailObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    userInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  mounted() {},
  created() {},
  methods: {
    // 查看工单详情
    handleWorkorderDetail() {
      if (this.detailObj.serviceType == 1) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: this.detailObj.workOrderNumber
          }
        });
      } else if (this.detailObj.serviceType == 9 || this.detailObj.serviceType == 10 || this.detailObj.serviceType == 11) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderDetail",
          query: {
            workOrderNumber: this.detailObj.workOrderNumber
          }
        });
      } else if (this.detailObj.serviceType == 2) {
        this.$router.push({
          path: "/NewWorkOrderList/newWorkorderTaskDetail",
          query: {
            workOrderNumber: this.detailObj.workOrderNumber
          }
        });
      }
      this.$gio.viewWorkorder({
        workorderNumber: this.detailObj.workOrderNumber
      });
    }
  }
};
</script>

<style lang="less" scoped>
.detail_info {
  height: 100%;
  overflow-y: scroll;
  width: 30%;
  // margin-top:12px;
  border: 1px solid #ebeef5;
  padding: 20px;
  .no-msg {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .report_msg {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
  }
  .cus_info {
    display: flex;
    border: solid 1px #ccddff;
    background: rgba(204, 221, 255, 0.2);
    border-radius: 4px;
    padding: 10px 20px;
    margin: 20px 0;
    align-items: center;
    .belong_to {
      width: 40px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #dd0000;
      margin-right: 10px;
      color: #fff;
      border-radius: 4px;
      font-size: 12px;
    }
  }
  .item_left {
    margin-right: 15px;
    color: #999;
  }
  .see_workorder_detail {
    margin-left: 10px;
    color: #001450;
    text-decoration: underline;
  }
  .see_workorder_detail:hover {
    cursor: pointer;
  }
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
</style>
