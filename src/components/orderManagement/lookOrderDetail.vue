<!--
* @author vvx
* @date 2020/04/14 16:57:26
* @version V1.0.0
!-->
<template>
  <div style="position:relative">
    <div class="return-btn" style="position:absolute;right:20px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer">
      <el-button type="danger" plain size="small" @click="handleResetFrom('ruleForm')"
        ><img src="../../assets/back.png" style="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px" />返回</el-button
      >
    </div>
    <div class="look-order-profile" :style="mainminheight">
      <el-row :gutter="20">
        <el-col :span="12" style="padding:0px 10px;margin-top:10px;background:rgb(247, 247, 247)">
          <div>
            <p class="look-order-profile-title">
              当前订单状态：{{ ruleForm.orderStateDesc }}
              <el-link type="primary" style="float:right;margin-right:10px" @click="showStatusDetail = !showStatusDetail">进度跟踪<i class="el-icon-arrow-right"></i></el-link>
            </p>
            <div style="font-size:15px;margin-bottom:15px">{{ ruleForm.progressList[0] ? ruleForm.progressList[0].progressDesc : "" }}</div>
            <div style="font-size:15px;margin-bottom:15px" v-if="ruleForm.orderState == 2 && time > 0">
              剩余<span style="color:#fe000c"
                >{{
                  parseInt(this.time / 60)
                    .toString()
                    .padStart(2, "0")
                }}分{{ (time % 60).toString().padStart(2, "0") }}秒</span
              >
              &nbsp;可<span style="color:#3399FF;cursor:pointer" @click="cancelOrder">取消订单</span>
            </div>

            <div style="font-size:15px;margin-bottom:15px" v-if="ruleForm.orderCloseTypeDesc && ruleForm.orderState == 4">关闭类型：{{ ruleForm.orderCloseTypeDesc }}</div>
            <div style="font-size:15px;margin-bottom:15px" v-if="ruleForm.orderCancelReasonTypeDesc && ruleForm.orderState == 4">原因：{{ ruleForm.orderCancelReasonTypeDesc }}</div>
            <div style="font-size:15px;margin-bottom:15px" v-if="ruleForm.orderCancelFailReason && ruleForm.orderState == 4">关闭失败原因：{{ ruleForm.orderCancelFailReason }}</div>
          </div>
        </el-col>
        <el-col :span="10" style="padding:0px 10px 30px;margin-top:10px;position:absolute;left:50%" v-if="showStatusDetail">
          <el-steps :active="currentStatus" process-status="finish" finish-status="wait" style="margin-bottom:40px;width:80%">
            <el-step title="待确认" icon="el-icon-success"></el-step>
            <el-step title="待发货" icon="el-icon-success"></el-step>
            <el-step title="待收货" icon="el-icon-success" v-if="ruleForm.orderState != 4"></el-step>
            <el-step title="已完成" icon="el-icon-success" v-if="ruleForm.orderState != 4"></el-step>
            <el-step title="已关闭" icon="el-icon-success" v-if="ruleForm.orderState == 4"></el-step>
          </el-steps>
          <div class="block">
            <el-timeline style="padding-left:0">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-col>
      </el-row>

      <p class="look-order-profile-title">订单信息</p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="add-dealer-profile-ruleForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="订单编号：">
              <span>{{ ruleForm.mslaOrderNumber || "--" }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订购方：">
              <span style="color:#00A0F0;cursor:pointer" @click="lookCompanyInfo">{{ ruleForm.companyName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="订购人：">
              <span>{{ ruleForm.nameCn }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="收货人：">
              <span>{{ ruleForm.addressObj.firstName }} {{ ruleForm.addressObj.lastName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号：">
              <span>{{ ruleForm.addressObj.phone }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="收货地址：" prop="detatilAddress">
              <div style="word-break:break-all;">{{ ruleForm.addressObj.detatilAddress }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="下单时间：" prop="orderTime">
              <span>{{ ruleForm.orderTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <p class="look-order-profile-title">商品信息</p>
        <el-row :gutter="20" style="margin: 0 0 20px 0px;">
          <el-col :span="5">
            <div style="color:#999;font-size:14px">商品名称</div>
          </el-col>
          <el-col :span="5">
            <div style="color:#999;font-size:14px">单价</div>
          </el-col>
          <el-col :span="5">
            <div style="color:#999;font-size:14px">购买数量</div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin: 0 0 20px 0px;" v-for="item in ruleForm.productInfoList" :key="item.kitOrderNumber">
          <el-col :span="5">
            <span style="font-size:14px">{{ item.productName }}</span>
          </el-col>
          <el-col :span="5">
            <span style="font-size:14px">{{ item.unit }}{{ item.productPrice }}</span>
          </el-col>
          <el-col :span="5">
            <span style="font-size:14px">{{ item.num }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin: 0 0 20px 0px;">
          <el-col :span="5">
            <span style="font-size:14px">总额：{{ ruleForm.productInfoList[0].unit }}{{ ruleForm.totalProductPrice }}</span>
          </el-col>
        </el-row>
        <p class="look-order-profile-title" style="padding-top:22px">支付信息</p>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="结算方式：">
              <span>通过美孚ERP ID进行结算</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="ERP ID：" prop="erpId">
              <span>{{ ruleForm.erpId }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-dialog :visible.sync="dialogVisible" :show-close="false" width="600px" :close-on-click-modal="false">
        <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="80px" class="add-dealer-profile-ruleForm">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="关闭说明：" prop="orderCancelReasonType">
                <el-select v-model="changeForm.orderCancelReasonType" size="small" style="width:60%;margin-right:40px" clearable>
                  <el-option v-for="item in closeReasonList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" v-if="changeForm.orderCancelReasonType == 5">
            <el-col :span="24">
              <el-form-item prop="orderCancelReasonTypeDesc">
                <span slot="label"><span style="color:transparent">*</span> 关闭原因：</span>
                <el-input
                  type="textarea"
                  resize="none"
                  maxlength="100"
                  show-word-limit
                  :autosize="{ minRows: 6, maxRows: 8 }"
                  placeholder="若有其他原因,请描述"
                  v-model="changeForm.orderCancelReasonTypeDesc"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button type="danger" @click="handleSubmitForm" size="small">提交</el-button>
          <el-button type="danger" plain @click="dialogVisible = false" size="small">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from "element-china-area-data";
export default {
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      imageList: [], // 图片
      detaiImglList: [], // 详情页图片
      time: 0,
      dialogVisible: false,
      showStatusDetail: false,
      currentStatus: 0,
      activities: [],
      show: false,
      closeReasonList: [
        { label: "数量填写错误", value: 1 },
        { label: "商品选择错误", value: 2 },
        { label: "收货信息错误", value: 3 },
        { label: "暂不需要", value: 4 },
        { label: "其它原因", value: 5 }
      ],
      changeForm: {
        orderCancelReasonType: "",
        orderCancelReasonTypeDesc: ""
      },
      // 表单验证
      ruleForm: {
        addressObj: {},
        progressList: []
      },
      //   表单验证规则
      rules: {
        orderCancelReasonType: [{ required: true, message: "请选择取消原因", trigger: "change" }]
      },
      hideUpload: false // 是否隐藏添加图片按钮
    };
  },

  components: {},

  computed: {},
  created() {},
  mounted() {
    this.getOrderDetail();
  },

  methods: {
    getOrderDetail() {
      // 回显
      let params = {
        kitOrderNumber: this.$route.query.kitOrderNumber
      };
      this.requestMethodGet("/msla/kit/order/queryKitOrderByOrderNumber", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.ruleForm = res.data || {}; // 回显数据
            let currenTime = this.moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
            if (res.data.orderConfirmTime && 1800000 - (new Date(currenTime) - new Date(res.data.orderConfirmTime)) > 0) {
              this.time = 1800 - parseInt((new Date(currenTime) - new Date(res.data.orderConfirmTime)) / 1000);
            } else {
              this.time = 0;
            }

            const interval = setInterval(() => {
              if (--this.time <= 0) {
                window.clearInterval(interval);
              }
            }, 1000);
            this.activities = res.data.progressList.map((item, index) => {
              if (index == 0) {
                return {
                  content: item.progressDesc,
                  color: "#FF9900",
                  icon: "content",
                  timestamp: item.progressTime
                };
              }
              if (item.progressState == 3) {
                return {
                  content: item.progressDesc + `:${item.progressRemark}`,
                  color: "#FF9900",
                  icon: "content",
                  timestamp: item.progressTime
                };
              }
              return {
                content: item.progressDesc,
                color: "#ccc",
                icon: "content",
                timestamp: item.progressTime
              };
            });
            switch (res.data.orderState) {
              case "1":
                this.currentStatus = 0;
                break;
              case "2":
                this.currentStatus = 1;
                break;
              case "3":
              case "4":
                this.currentStatus = 2;
                break;
              case "7":
                this.currentStatus = 3;
                break;
              default:
                break;
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
    cancelOrder() {
      this.changeForm = {};
      if (this.$refs["changeForm"]) {
        this.$refs["changeForm"].resetFields();
      }
      this.dialogVisible = true;
    },
    handleSubmitForm() {
      this.$refs["changeForm"].validate(valid => {
        if (valid) {
          let params = {
            kitOrderNumber: this.ruleForm.kitOrderNumber,
            orderCancelReasonType: this.changeForm.orderCancelReasonType
          };
          if (this.changeForm.orderCancelReasonType == 5) {
            params.orderCancelReasonTypeDesc = this.changeForm.orderCancelReasonTypeDesc;
          }
          this.$confirm(`关闭后，订单所有者将被取消此次购买，是否提交?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            customClass: "deletBtn",
            closeOnClickModal: false,
            type: "warning"
          })
            .then(() => {
              this.requestMethodPost("/msla/kit/order/cancelOrder", params)
                .then(res => {
                  if (res.data.code == 1000) {
                    this.$message({
                      message: "取消成功",
                      type: "warning"
                    });
                    this.getOrderDetail();
                    this.dialogVisible = false;
                  } else {
                    this.$message({
                      message: res.data.msg,
                      type: "warning"
                    });
                  }
                })
                .catch(res => {});
            })
            .catch(res => {});
        } else {
          return false;
        }
      });
    },
    lookCompanyInfo() {
      let path = "/CustomerProfile/CustomerProfileDetail";
      if (this.ruleForm.companyType == 1) {
        path = "/DealerProfile/DealerProfileDetail";
      }
      this.$router.push({
        path: path,
        query: {
          companyNumber: this.ruleForm.companyNumber,
          workorderPage: true
        }
      });
    },
    // 返回
    handleResetFrom(formName) {
      history.back();
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 150}px`;
    }
  }
};
</script>
<style lang="less" scoped>
.look-order-profile {
  padding: 0 20px 20px;
  height: calc(100% - 60px);
  overflow: auto;
  position: relative;
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
</style>
<style>
.look-order-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.look-order-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.look-order-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.look-order-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.look-order-profile .el-form-item__label {
  color: #999999;
  padding: 0;
}
.hide .el-upload--picture-card {
  display: none;
}
.look-order-profile .el-form-item__label {
  text-align: left !important;
}
.look-order-profile .el-timeline .el-timeline-item:nth-of-type(1) .el-timeline-item__content,
.look-order-profile .el-timeline .el-timeline-item:nth-of-type(1) .el-timeline-item__timestamp.is-bottom,
.el-step__head.is-finish .el-step__icon-inner.el-icon-success,
.el-step__title.is-finish {
  color: rgb(255, 153, 0) !important;
}
.look-order-profile .el-timeline .el-timeline-item:nth-of-type(1) .el-timeline-item__node .el-timeline-item__icon {
  background-color: rgb(255, 153, 0) !important;
}
.look-order-profile .el-timeline .el-timeline-item:nth-of-type(1) .el-timeline-item__node {
  border: 1px solid rgb(255, 153, 0);
}
.look-order-profile .el-timeline .el-timeline-item .el-timeline-item__node .el-timeline-item__icon {
  width: 8px;
  height: 8px;
  background: #ccc;
  position: absolute;
  border-radius: 7px;
}
.look-order-profile .el-timeline .el-timeline-item .el-timeline-item__node {
  width: 14px;
  height: 14px;
  left: -3px;
  border: 1px solid #ccc;
  background-color: #fff !important;
}
.look-order-profile .el-timeline-item {
  padding-bottom: 50px;
}
.look-order-profile .el-timeline-item__content,
.look-order-profile .el-timeline-item__timestamp {
  font-size: 16px;
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
  top: 15px !important;
}
</style>
