<template>
  <div class="equipment-management" :style="mainminheight">
    <el-tabs v-model="activeName">
      <el-tab-pane label="提醒" name="first">
        <el-row :gutter="24">
          <el-col :span="20" class="equipment-management-serach-item">
            <label for>阅读状态：</label>
            <el-select
              v-model="queryParams.readFlag"
              size="small"
              filterable
              clearable
              style="width: 220px; margin-right: 20px"
              placeholder="请选择"
              @change="handleSearchTableData"
              :loading="isloading"
            >
              <el-option v-for="item in readFlagList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <label for>类型：</label>
            <el-select
              v-model="queryParams.bizType"
              size="small"
              filterable
              clearable
              style="width: 220px; margin-right: 20px"
              placeholder="请选择"
              @change="handleSearchTableData"
              :loading="isloading"
            >
              <el-option v-for="item in bizTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <span @click="setReadAll" style="cursor: pointer;font-size: 14px;color: #000;">
              全部已读
              <img src="../../assets/read-icon.svg" alt="" style="margin-left: 2px;position: relative;top: 2px;" />
            </span>
          </el-col>
        </el-row>
        <!-- 列表 -->
        <div v-for="(item, index) in msgData" :key="index">
          <div class="content-item-box" style="">
            <div style="display: flex; justify-content: space-between">
              <!-- 申请单 -->
              <!-- <img class="msg" v-if="item.bizType == 1" :src="item.bizType == 1 ? applyIcon : item.bizType == 2 ? noticeIcon : item.bizType == 7 ? benefitReportIcon : serviceIcon" alt="" /> -->
              <img class="msg" v-if="item.bizType == 1" :src="applyIcon" alt="" />
              <!-- 工单 -->
              <img class="msg" v-if="item.bizType == 2 || item.bizType == 10" :src="noticeIcon" alt="" />
              <!-- 计划工程服务 -->
              <img class="msg" v-if="item.bizType == 3" :src="serviceIcon" alt="" />
              <!-- 任务 -->
              <img class="msg" v-if="item.bizType == 4" :src="taskIcon" alt="" />
              <!-- 访客 -->
              <img class="msg" v-if="item.bizType == 5" :src="visiteIcon" alt="" />
              <!-- 计划工程服务报告书 -->
              <img class="msg" v-if="item.bizType == 6" :src="serviceIcon" alt="" />
              <!-- 非计划工程服务 -->
              <img class="msg" v-if="item.bizType == 7" :src="benefitReportIcon" alt="" />
              <!-- pop/rop -->
              <img class="msg" v-if="item.bizType == 8 || item.bizType == 9" :src="popRopMsgIcon" alt="" />
              <!-- 用户数据转移 -->
              <img class="msg" v-if="item.bizType == 11" :src="tranferIcon" alt="" />
              <!-- 异常记录 -->
              <img class="msg" v-if="item.bizType == 12" :src="abmoralIcon" alt="" />
              <div>
                <div style="font-family: MicrosoftYaHei-Bold; color: rgb(51, 51, 51); font-weight: bold">{{ item.msgName }}</div>
                <div style="margin-top: 12px; font-size: 13px">
                  {{ item.content }}
                </div>
                <div style="margin-top: 12px; font-size: 12px; font-family: MicrosoftYaHei">
                  <span :style="{ color: item.readFlag == '0' ? 'rgb(211,0,0) ' : '#000' }">{{ item.readFlag == "0" ? "未读" : "已读" }}</span>
                  <span style="color: rgb(153, 153, 153); margin-left: 12px">{{ item.createTime }}</span>
                </div>
              </div>
            </div>
            <div>
              <el-button
                @click="handleDetail(item)"
                v-if="item.readFlag == '0' && item.bizType != 5 && item.bizType != 11 && item.bizType != 3"
                class="btn"
                size="small"
                style="color: rgb(211, 0, 0); background: rgba(211, 0, 0, 0.05); border: 1px solid rgb(211, 0, 0)"
              >
                处理
              </el-button>
              <el-button @click="handleDetail(item)" v-if="item.readFlag == '1' || item.bizType == 5 || item.bizType == 3" class="btn" size="small">
                查看
              </el-button>
              <el-button size="small" class="btn" @click="deleteItem(item)">移除</el-button>
            </div>
          </div>
        </div>
        <div v-if="!totalNumber" style="text-align: center; margin-top: 200px; color: rgb(153, 153, 153)">暂无消息</div>
        <el-pagination
          v-if="totalNumber"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagenation.current"
          :page-size="pagenation.size"
          :page-sizes="[1, 10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          style="float: right; display: flex; margin-top: 10px"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
export default {
  data() {
    return {
      activeName: "first",
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      queryParams: {
        readFlag: "",
        bizType: ""
      },
      applyIcon: require("../../assets/msg-apply.png"),
      noticeIcon: require("../../assets/msg-notice.png"),
      serviceIcon: require("../../assets/msg-service.png"),
      benefitReportIcon: require("../../assets/msg_benefit.png"),
      popRopMsgIcon: require("../../assets/pop_rop_msg_icon.png"),
      visiteIcon: require("../../assets/visite_icon.png"),
      taskIcon: require("../../assets/task_icon.png"),
      tranferIcon: require("../../assets/tranfer_icon.png"),
      abmoralIcon: require("../../assets/abnormal.png"),
      readFlagList: [{ value: "0", label: "未读" }, { value: "1", label: "已读" }],
      bizTypeList: [],
      totalNumber: 0,
      msgData: [],
      pagenation: {
        current: 1,
        size: 30
      },
      loading: false, //是否加载
      isloading: false //远程搜索loading
    };
  },
  created() {},
  mounted() {
    this.$_queryMessageByPage();
    this.getResource(); // 获取消息来源
  },
  methods: {
    handleDetail(item) {
      if (item.bizType == 2) {
        // 工单
        this.getServiceType(item.bizCode, item.id, item.readFlag);
      } else if (item.bizType == 3) {
        this.handleSetMsgRead(item.id);
        // 计划工程服务单
        this.getPesId(item.bizCode, item.id, item.readFlag, item);
      } else if (item.bizType == 4) {
        if (item.msgName.includes("任务即将开始")) {
          this.handleSetMsgRead(item.id);
          this.$parent.msgCount("read");
          this.requestMethodGet("/web/device/queryLubricationPointDetail", {
            lubricationPointNumber: item.bizCode
          }).then(res => {
            if (res.data.code == 1000) {
              this.$router.push({
                name: "EquipmentProfileDetail",
                query: {
                  deviceNumber: res.data.data.deviceNumber
                }
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.msg || "请稍后重试"
              });
            }
          });
          return;
        }
        const taskNumber = item.bizCode;
        this.handleSetMsgRead(item.id);
        this.$parent.msgCount("read");

        this.requestMethodGet("/oilTask/queryTaskDetailByTaskNumber", {
          taskNumber,
          size: 1,
          current: 30
        }).then(res => {
          if (res.data.code == 1000) {
            this.$router.push({
              name: "taskDetail",
              query: { taskId: res.data.data.oilTaskId }
            });
          }
        });
      } else if (item.bizType == 5) {
        this.handleSetMsgRead(item.id);
        this.$parent.msgCount("read");
        this.requestMethodGet("visitor/getRegisterInfo", {
          bizCode: item.bizCode
        }).then(res => {
          if (res.data.code == 1000) {
            const info = res.data.data || {};
            const infoContent = `<div>访客公司信息<br/>公司名称：${info.companyName || "暂无"}<br/>行业：${info.companyIndustryName || "暂无"}<br/>城市：${info.regionProvinceName}/${
              info.regionCityName
            }<br/><br/>访客个人信息<br/>姓名：${info.userName}<br/>手机号：${info.userPhone}<br/>问题&需求：${info.requireContent || ""}<br/>提交时间：${info.createTime}<br/></div>`;

            this.$alert(infoContent, "以下内容为访客问题反馈的留资内容，请尽快安排经销商跟进处理！", {
              confirmButtonText: "知道了",
              dangerouslyUseHTMLString: true,
              customClass: "message-tip-box",
              callback: () => {
                this.$_queryMessageByPage();
              }
            });
          }
        });
      } else if (item.bizType == 6) {
        this.$router.push({
          path: "/PESIndex",
          query: {
            pesId: item.bizCode
          }
        });
        this.handleSetMsgRead(item.id);
      } else if (item.bizType == 7) {
        this.handBenefitReport(item.bizCode, item.id);
      } else if (item.bizType == 8 || item.bizType == 9) {
        this.handPopOrRopReport(item.bizCode, item.id, item);
      } else if (item.bizType == 10) {
        this.handleSetMsgRead(item.id);
        this.$router.push({
          path: "/NewWorkOrderList/newWorkOrderOilDetail",
          query: {
            workOrderNumber: item.bizCode
          }
        });
      } else if (item.bizType == 11) {
        this.handleSetMsgRead(item.id);
        this.$parent.msgCount("read");
        // this.$router.push({
        //   name: "AccountManagement"
        // });
      } else if (item.bizType == 12) {
        this.handleSetMsgRead(item.id);
        this.$parent.msgCount("read");
        this.$router.push({
          name: "abnormalRecord",
          query: {
            id: item.bizCode,
            resource: "message"
          }
        });
      } else {
        this.getApplyId(item.bizCode, item.id, item.readFlag);
      }
      this.$gio.Singlemessageclickread();
    },
    // 获取消息来源
    getResource() {
      this.requestMethodGet("/msg/getMsgTypeListByUserId").then(res => {
        if (res.data.code == 1000) {
          this.bizTypeList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 效益报告跳转
    handBenefitReport(val, id) {
      this.requestMethodGet("/pes/customer/queryInfoForMsg", { bizCode: val }).then(res => {
        if (res.data.code == 1000) {
          this.handleSetMsgRead(id);
          this.$router.push({
            path: "/CustomerProfile/CustomerProfileDetail",
            query: {
              companyId: res.data.data.customerCompanyId,
              companyNumber: res.data.data.customerCompanyNumber,
              tabSource: "benefitReport"
            }
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // pop/rop跳转
    handPopOrRopReport(val, id, item) {
      this.requestMethodGet("/pes/pop/queryInfoForMsg", { popRopId: val }).then(res => {
        if (res.data.code == 1000) {
          this.handleSetMsgRead(id);
          const data = res.data.data;
          const queryParams = {
            customerId: data.customerCompanyId,
            companyName: data.customerCompanyName,
            industry: data.customerIndustryName,
            companyNumber: data.customerNumber,
            reportId: val,
            reportStatus: true
          };
          if (item.bizType == 8) {
            //pop
            this.$router.push({
              query: queryParams,
              path: "/CustomerProfile/CustomerProfileDetail/createPopReport"
            });
          } else if (item.bizType == 9) {
            //rop
            this.$router.push({
              query: queryParams,
              path: "/CustomerProfile/CustomerProfileDetail/createRopReport"
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 设置消息为已读
    handleSetMsgRead(val) {
      let param = new FormData();
      param.append("id", val);
      this.requestMethodPost("msg/setMsgRead", param).then(res => {
        if (res.data.code == 1000) {
          // this.$parent.msgCount('read')
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 移除
    deleteItem(item) {
      let param = new FormData();
      param.append("id", item.id);
      this.requestMethodPost("msg/setMsgDelete", param).then(res => {
        if (res.data.code == 1000) {
          this.$parent.msgCount("read");
          this.pagenation.current = 1;
          this.$_queryMessageByPage();
          this.$message({
            message: "移除成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        this.$gio.Singlemessageclickdelete();
      });
    },
    // 全部已读
    setReadAll() {
      let param = {
        readFlag: this.queryParams.readFlag,
        subType: this.queryParams.bizType
      };
      this.requestMethodPost("msg/setMsgAllRead", param).then(res => {
        if (res.data.code == 1000) {
          this.$parent.msgCount("read");
          this.pagenation.current = 1;
          this.$_queryMessageByPage();
          this.$message({
            message: "已将所有消息标为已读",
            type: "success"
          });
        } else if (res.data.code == 9300) {
          this.$message({
            message: "当前暂无未读消息哦",
            type: "warning"
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
        this.$gio.ClickReadAll();
      });
    },
    // 通过工单编码获取工单类型
    getServiceType(val, id, readFlag) {
      let param = {
        workOrderNumber: val
      };
      this.requestMethodGet("/workOrder/getServiceTypeByWorkOrderNumber", param).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data == 1) {
            this.handleSetMsgRead(id);
            this.$parent.msgCount("read");
            this.$router.push({
              path: "/NewWorkOrderList/newWorkOrderOilDetail",
              query: {
                workOrderNumber: val
              }
            });
          } else if (res.data.data == 2) {
            this.handleSetMsgRead(id);
            this.$parent.msgCount("read");
            this.$router.push({
              path: "/NewWorkOrderList/newWorkorderTaskDetail",
              query: {
                workOrderNumber: val
              }
            });
          } else {
            this.handleSetMsgRead(id);
            this.$parent.msgCount("read");
            this.$router.push({
              path: "/NewWorkOrderList/newWorkOrderDetail",
              query: {
                workOrderNumber: val
              }
            });
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 申请单
    getApplyId(val, id) {
      let param = {
        serviceApplyNo: val
      };
      this.requestMethodGet("/serviceApply/getApplyIdByApplyNo", param).then(res => {
        if (res.data.code == 1000) {
          this.handleSetMsgRead(id);
          this.$parent.msgCount("read");
          this.$router.push({
            path: "/ServiceApplyList/ServiceApplyDetail",
            query: {
              id: res.data.data
            }
          });
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    // 通过计划工程服务单编码查询 pesId
    getPesId(val, id, readFlag, msgItem) {
      let data = val.split(",");
      this.$router.push({
        path: "/CustomerProfile/CustomerPesIndex",
        query: {
          pesId: data[0],
          pesInfoId: data[0],
          pageFrom: "msgCenter",
          companyNumber: data[1]
        }
      });
    },
    // 查询
    handleSearchTableData() {
      this.pagenation.current = 1;
      this.$_queryMessageByPage();
    },
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_queryMessageByPage();
    },
    //current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.$_queryMessageByPage();
    },
    //查询信息
    $_queryMessageByPage() {
      let params = {
        readFlag: this.queryParams.readFlag,
        size: this.pagenation.size,
        current: this.pagenation.current,
        subType: this.queryParams.bizType
      };
      this.requestMethodGet("/msg/getMyMsgList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data.list;
            this.msgData = data;
            this.totalNumber = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    }
  }
};
</script>
<style lang="less" scoped>
.msg {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}
.content-item-box {
  padding: 20px 20px;
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    cursor: pointer;
    background: #f2f2f2;
  }
}
/deep/ .el-pager li.active {
  color: rgba(254, 0, 12, 1);
}
.equipment-management {
  padding: 10px 25px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    margin: 15px 0 30px;
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
  //  .el-pagination.is-background .el-pager li:not(.disabled).active {
  //   background:#fe000c !important;
  // }
  .el-tabs__item.is-active {
    color: #fe000c !important;
    font-weight: 900 !important;
  }
  .el-tabs__active-bar {
    background-color: #fe000c !important;
  }
  .btn {
    width: 56px;
    text-align: center;
    line-height: 32px;
    height: 32px;
    padding: 0px;
    border-radius: 3px;
  }
  .el-tabs__item:hover {
    color: #fe000c !important;
  }
  .el-pagination {
    position: fixed;
    bottom: 25px;
    right: 25px;
  }
}
</style>
<style>
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
.message-tip-box {
  width: 35%;
}
</style>
