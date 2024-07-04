<template>
  <div id="app">
    <router-view v-if="$route.path.toLowerCase() == '/toolkittable' || $route.path.toLowerCase() == '/toolkitchart'"></router-view>
    <div id="app-sub" v-else>
      <router-view v-if="this.$route.path.toLowerCase() == '/login' || this.$route.path.toLowerCase() == '/wechatlogin' || this.$route.path.toLowerCase() == '/userhelpdisplay'" />
      <div style="overflow: hidden; height: 100%" v-else>
        <div class="title-logo">
          <img src="../src/assets/logo-1.png" style="width: 160px; height: 30px; padding-left: 20px" />
          <div style="float: right; height: 60px; margin-right: 10px; display: flex; align-items: center">
            <div style="width:90px;display: flex; align-items: center">
                <img v-if="distributorHonoraryMedal=='3'" src="../src/assets/service_icon3_middle.png" alt="" style="width:80px;">
                <img v-if="distributorHonoraryMedal=='2'" src="../src/assets/service_icon2_middle.png" alt="" style="width:80px;">
                <img v-if="distributorHonoraryMedal=='1'" src="../src/assets/service_icon1_middle.png" alt="" style="width:80px;">
            </div>
            
            
            <span style="font-size: 14px; margin: 10px; color: #999">{{ userEmail }}</span
            ><span style="color: #ededed">|</span>
            <div style="position: relative">
              <el-button type="text" @click="msgCenter" style="margin: 10px 10px 10px 16px; color: #000">
                <img src="../src/assets/navigation-top.png" alt="" style="width: 22px; height: 22px" />
              </el-button>
              <span v-if="totalNumber != 0" class="number-msg">{{ totalNumber >= 99 ? "..." : totalNumber }}</span>
            </div>
            <el-button type="text" @click="openToolkit" style="margin: 10px 10px 10px 16px; color: #000">
              <img src="../src/assets/calculator.png" alt="" style="width: 22px; height: 22px" />
            </el-button>
            <el-button type="text" @click="downLoadProgress" style="margin: 10px 10px 10px 16px; color: #000">
              <img src="../src/assets/download-icon.png" alt="" style="width: 22px; height: 22px" />
            </el-button>
            <el-button type="text" @click="routerToUserHelp" style="margin: 10px 10px 10px 16px; color: #000">
              <img src="../src/assets/user-help-icon.png" alt="" style="width: 22px; height: 22px" />
            </el-button>
            <el-button type="text" @click="setLoginOut" style="margin: 15px; color: #000">退出</el-button>
          </div>
        </div>
        <left-nav class="left-nav" @getUserEmail="getUserEmail" @getUserName="getUserName" @msgCount="msgCount" @getMedal="getMedal"></left-nav>
        <div class="right-nav" :style="mainminheight">
          <top-nav></top-nav>
          <router-view ref="contentResize" v-if="!refreshLoading" />
        </div>
      </div>
      <el-dialog class="download-wrap" top="50px" :modal="false" title="导出任务" style="" :visible.sync="downloadProgressVisible" :show-close="false" width="30%">
        <div>
          <div class="notice-title" style="border-bottom: 1px solid #e9e9e9; padding: 0px 20px 16px; color: rgba(153, 153, 153)">生成完成后将自动下载文件，若无下载将手动操作</div>
          <div style="max-height: 280px; overflow: auto" v-if="downLoadRecords.length">
            <div class="download-box" v-for="(item, index) in downLoadRecords" :key="index">
              <div style="display: flex; align-items: center; font-family: MicrosoftYaHei; font-size: 13px; color: #333">
                <img v-if="item.fileType == 'docx' || item.fileType == 'doc'" src="../src/assets/word.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                <img v-else-if="item.fileType == 'pdf'" src="../src/assets/pdf.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                <img v-else-if="item.fileType == 'ppt' || item.fileType == 'pptx'" src="../src/assets/pptx.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                <img
                  v-else-if="item.fileType == 'excel' || item.fileType == 'xlsx' || item.fileType == 'xls'"
                  src="../src/assets/excel.png"
                  alt=""
                  style="width: 32px; height: 32px; margin-right: 12px"
                />
                <img v-else src="../src/assets/unknow-icon.png" alt="" style="width: 32px; height: 32px; margin-right: 12px" />
                <div style="line-height: 13px; font-size: 13px; color: #333">
                  <div class="file-title">{{ item.fileName }}</div>
                  <div v-if="item.status == '0'" class="file-notice">预计耗时3~10分钟，请耐心等待</div>
                  <div v-if="item.status == '1'" class="file-notice">生成时间： {{ item.updateTime }}</div>
                  <div v-if="item.status == '2'" class="file-notice" style="color: #dd0000">文件生成失败，请重试</div>
                </div>
              </div>
              <div v-if="item.status == '0'">
                <el-button type="danger" size="small" disabled style="background: #ee8080 !important">生成中...</el-button>
              </div>
              <div v-if="item.status == '1'">
                <el-button size="small" @click="downLoadFile(item)">下载文件</el-button>
              </div>
            </div>
          </div>
          <div v-if="downLoadRecords.length == 0" style="height: 280px; line-height: 280px; text-align: center; color: rgba(153, 153, 153)">暂无导出任务</div>
          <div class="export-notice" style="margin-top: 20px">
            <img src="../src/assets/warn-download.png" alt="" style="width: 14px; height: 14px; margin-right: 8px" />
            系统会为您保留最近3个月生成的前20份文件
          </div>
        </div>
      </el-dialog>
      <!-- 消息中心 -->
      <el-dialog class="download-wrap" top="50px" :modal="false" title="未读消息" :visible.sync="msgCenterVisible" :show-close="false" width="400px" height="620px">
        <el-divider style="margin: 10px 0; background: #e9e9e9"></el-divider>
        <span @click="handleMsgPage" class="yahei" style="position: absolute; top: 21px; right: 20px; cursor: pointer">更多 ></span>
        <div style="height: 280px; overflow: auto">
          <div v-if="totalNumber" v-infinite-scroll="load">
            <div class="download-box" v-for="(item, index) in msgData" :key="index">
              <div class="yahei" style="display: flex; cursor: pointer" @click="handleDetail(item)">
                <!-- <img class="msg-center" :src="item.bizType == 1 ? applyIcon : item.bizType == 2 ? noticeIcon : serviceIcon" alt="" /> -->
                <!-- 申请单 -->
                <img class="msg-center" v-if="item.bizType == 1" :src="applyIcon" alt="" />
                <!-- 工单 -->
                <img class="msg-center" v-if="item.bizType == 2 || item.bizType == 10" :src="noticeIcon" alt="" />
                <!-- 计划工程服务 -->
                <img class="msg-center" v-if="item.bizType == 3" :src="serviceIcon" alt="" />
                <!-- 任务 -->
                <img class="msg-center" v-if="item.bizType == 4" :src="taskIcon" alt="" />
                <!-- 访客 -->
                <img class="msg-center" v-if="item.bizType == 5" :src="visiteIcon" alt="" />
                <!-- 计划工程服务报告书 -->
                <img class="msg-center" v-if="item.bizType == 6" :src="serviceIcon" alt="" />
                <!-- 非计划工程服务 -->
                <img class="msg-center" v-if="item.bizType == 7" :src="benefitReportIcon" alt="" />
                <!-- pop/rop -->
                <img class="msg-center" v-if="item.bizType == 8 || item.bizType == 9" :src="popRopMsgIcon" alt="" />
                <img class="msg-center" v-if="item.bizType == 11" :src="tranferIcon" alt="" />
                <div style="line-height: 13px">
                  <div style="display: flex; align-items: center; justify-content: space-between">
                    <div style="font-family: MicrosoftYaHei-Bold; color: rgb(51, 51, 51); font-weight: bold">
                      {{ item.msgName }}
                    </div>
                    <div style="font-size: 12px; color: rgb(153, 153, 153)">
                      {{ item.createTime }}
                    </div>
                  </div>
                  <div style="margin-top: 8px; font-size: 12px; line-height: 18px">
                    {{ item.content }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!totalNumber" style="height: 280px; line-height: 280px; text-align: center; color: rgba(153, 153, 153); font-family: MicrosoftYaHei">
            暂无未读消息,查看
            <span @click="handleMsgPage" style="color: rgb(0, 20, 80); text-decoration: underline; cursor: pointer">全部已读</span>
          </div>
          <p style="text-align: center; color: rgba(153, 153, 153); font-family: MicrosoftYaHei; font-size: 12px" v-if="loadMoreBon && totalNumber">加载中...</p>
          <p style="text-align: center; color: rgba(153, 153, 153); font-family: MicrosoftYaHei; font-size: 12px" v-if="!loadMoreBon && totalNumber">已全部加载</p>
        </div>
      </el-dialog>
      <!--经销商荣誉勋章的提示弹框  -->
      <el-dialog class="honor-wrap" top="18%" :modal="true" title="提示" :visible.sync="honorDialopVisible" :show-close="false" width="400px" height="206px">
        <div style="height: 210px; text-align: center;font-family: Microsoft YaHei;font-size: 14px;line-height: 22px;">
          <div>亲爱的 {{ userName }},恭喜您</div>
          <div>最新获得以下荣誉称号</div>
          <div style="margin-top: 20px;">
            <!-- 服务先锋 -->
            <img v-if="distributorHonoraryMedal == '1'" src="../src/assets/big_service_pioneer.png" alt="" style="width: 108px;height: 112px;" />
            <!-- 服务达人 -->
            <img v-if="distributorHonoraryMedal == '2'" src="../src/assets/big_service_master.png" alt="" style="width: 108px;height: 112px;" />
            <!-- 服务大师 -->
            <img v-if="distributorHonoraryMedal == '3'" src="../src/assets/Service_great_master.png" alt="" style="width: 108px;height: 112px;" />
          </div>
          <span slot="footer" class="dialog-footer" style="float:right;margin-right: 20px;bottom: 20px;">
            <el-button type="danger" @click="confirm()" size="small">知道了</el-button>
          </span>
        </div>
      </el-dialog>
      <Toolkit :drawer="drawerShow" @closeToolkit="closeDrawer" v-if="drawerShow" />
    </div>
  </div>
</template>

<script>
// import leftnav from "@/components/leftnav";
// import topnav from "@/components/topnav";
// import Toolkit from "@/components/toolkit/toolkitDrawer.vue";
export default {
  name: "App",
  components: {
    "left-nav": () => import("@/components/leftnav"),
    "top-nav": () => import("@/components/topnav"),
    Toolkit: () => import("@/components/toolkit/toolkitDrawer.vue")
  },
  data() {
    return {
      drawerShow: false,
      mainminheight: `height:${document.documentElement.clientHeight - 60}px`,
      userName: "",
      distributorHonoraryMedal: "",
      userEmail: "",
      backPathName: "",
      downloadProgressVisible: false,
      msgCenterVisible: false, // 消息中心弹框
      honorDialopVisible: false, // 经销商荣誉勋章的弹框
      current: 1,
      loadMoreBon: true,
      applyIcon: require("../src/assets/msg-apply.png"),
      noticeIcon: require("../src/assets/msg-notice.png"),
      serviceIcon: require("../src/assets/msg-service.png"),
      benefitReportIcon: require("../src/assets/msg_benefit.png"),
      popRopMsgIcon: require("../src/assets/pop_rop_msg_icon.png"),
      visiteIcon: require("../src/assets/visite_icon.png"),
      taskIcon: require("../src/assets/task_icon.png"),
      tranferIcon: require("../src/assets/tranfer_icon.png"),
      downLoadRecords: [],
      totalNumber: 0,
      msgData: [],
      userHelpPage: false,
      refreshLoading: true,
      userInfo: {},
    };
  },

  watch: {
    "$route.path": function(val) {
      if (val === "/userHelpDisplay") {
        this.userHelpPage = true;
      } else {
        this.userHelpPage = false;
      }
    }
  },
  created() {
    this.userInfo = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")))
  },
  mounted() {},
  methods: {
    confirm() {
      this.honorDialopVisible = false;
    },
    openToolkit() {
      this.drawerShow = true;
      this.$gio.clickTopBarMenuButton({
        topBarMenuName: "计算工具"
      });
    },
    closeDrawer() {
      this.$store.commit("Toolkit/flashBackState");
      this.drawerShow = false;
    },
    getUserName(val) {
      this.userName = val;
    },
    getUserEmail(val) {
      this.userEmail = val;
    },
    downLoadFile(item) {
      const params = {
        url: item.filePath
      };
      this.requestMethodGet("/web/file/getFullDownloadUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取荣誉勋章
    getMedal() {
      // if(this.userInfo.userType != 1)return
      this.requestMethodGet("/common/guide/read/getMedalReadStatus", { webLogin: true })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.distributorHonoraryMedal = res.data.distributorHonoraryMedal;
            if (res.data && !res.data.webReadFlag && res.data.distributorHonoraryMedal) {
              this.honorDialopVisible = true;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
          this.$gio.Clickonthehonoricon()
        })
        .catch(res => {});
    },
    //查询信息
    msgCount(val) {
      if (val == "read") {
        this.current = 1;
        this.msgData = [];
      }
      let params = {
        size: 20,
        current: this.current,
        readFlag: 0
      };
      this.requestMethodGet("/msg/getMyMsgList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.totalNumber = res.data.totalCount;
            this.msgData = this.msgData.concat(res.data.list);
            this.loadMoreBon = this.msgData.length <= res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 设置消息为已读
    handleSetMsgRead(val) {
      let param = new FormData();
      param.append("id", val);
      this.requestMethodPost("msg/setMsgRead", param).then(res => {
        if (res.data.code == 1000) {
          this.msgCount("read");
          this.msgCenterVisible = false;
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    handleDetail(item) {
      if (item.bizType == 2) {
        // 工单
        this.getServiceType(item.bizCode, item.id, item.readFlag);
      } else if (item.bizType == 3) {
        this.handleSetMsgRead(item.id);
        // 计划工程服务单
        this.getPesId(item.bizCode, item.id, item.readFlag);
      } else if (item.bizType == 4) {
        if (item.bizTypeName.includes("任务即将开始")) {
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
            }
          });
          return;
        }
        const taskNumber = item.bizCode;
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
        this.$router.push({
          //核心语句
          path: "/message" //跳转的路径
        });
        this.msgCenterVisible = false;
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
        this.$router.push({
          name: "AccountManagement"
        });
      } else {
        this.getApplyId(item.bizCode, item.id, item.readFlag);
      }
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
    // 通过工单编码获取工单类型
    getServiceType(val, id, readFlag) {
      let param = {
        workOrderNumber: val
      };
      this.requestMethodGet("/workOrder/getServiceTypeByWorkOrderNumber", param).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data == 1) {
            this.handleSetMsgRead(id);
            if (this.$route.path == "/NewWorkOrderList/newWorkOrderOilDetail") {
              this.$refs.contentResize.$_getWOInfo(val);
            } else {
              this.$router.push({
                path: "/NewWorkOrderList/newWorkOrderOilDetail",
                query: {
                  workOrderNumber: val
                }
              });
            }
          } else if (res.data.data == 2) {
            this.handleSetMsgRead(id);
            if (this.$route.path == "/NewWorkOrderList/newWorkorderTaskDetail") {
              this.$refs.contentResize.$_getWOInfo(val);
            } else {
              this.$router.push({
                path: "/NewWorkOrderList/newWorkorderTaskDetail",
                query: {
                  workOrderNumber: val
                }
              });
            }
          } else {
            this.handleSetMsgRead(id);
            if (this.$route.path == "/NewWorkOrderList/newWorkOrderDetail") {
              this.$refs.contentResize.$_getWOInfo(val);
            } else {
              this.$router.push({
                path: "/NewWorkOrderList/newWorkOrderDetail",
                query: {
                  workOrderNumber: val
                }
              });
            }
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
          if (this.$route.path == "/ServiceApplyList/ServiceApplyDetail") {
            this.$refs.contentResize.getApplyOrderDetail(res.data.data);
          } else {
            this.$router.push({
              path: "/ServiceApplyList/ServiceApplyDetail",
              query: {
                id: res.data.data
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
    // 通过计划工程服务单编码查询 pesId
    getPesId(val, id, readFlag) {
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
    load() {
      if (this.loadMoreBon && this.current * 20 < this.totalNumber) {
        ++this.current;
        this.msgCount();
      } else {
        this.loadMoreBon = false;
      }
    },
    // 消息中心
    msgCenter() {
      this.msgCenterVisible = true;
      this.$gio.clickTopBarMenuButton({
        topBarMenuName: "消息提醒"
      });
    },
    // 跳转全部已读页面
    handleMsgPage() {
      this.$router.push({
        //核心语句
        path: "/message" //跳转的路径
      });
      this.msgCenterVisible = false;
      this.$gio.clickMoreButton();
      this.$gio.toMessageCenter();
      this.$gio.viewMessage();
    },
    // 导出
    downLoadProgress() {
      this.downLoadRecords = [];
      this.downloadProgressVisible = true;
      let params = {};
      this.requestMethodGet("/download/center/getMyDownLoadRecords", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.downLoadRecords = res.data;
            this.downLoadRecords.forEach(item => {
              item.fileType = item.fileName.split(".")[item.fileName.split(".").length - 1].toLowerCase();
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
      this.$gio.clickTopBarMenuButton({
        topBarMenuName: "导出任务"
      });
    },
    setLoginOut() {
      let params = {};
      this.requestMethodGet("/web/system/logout", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            sessionStorage.removeItem("menuList");
            sessionStorage.removeItem("userInfo");
            sessionStorage.removeItem("btnPremissions");
            this.backPathName = localStorage.getItem("backName");
            if (this.backPathName == "/login") {
              this.$router.push({
                //核心语句
                path: "/login" //跳转的路径
              });
            } else {
              this.$router.push({
                //核心语句
                path: "/wechatLogin" //跳转的路径
              });
            }
            localStorage.removeItem("backName");
            this.$gio.clickLogoutButton();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
      // window.location.href = `${process.env.api}/web/system/logout`;
    },
    // 设置cookie
    setCookie(name, tokenId, exdays) {
      var exdate = new Date(); //获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
      //字符串拼接cookie
      window.document.cookie = `${name}=${tokenId};domain=dev-mobilserv.mobil.com.cn;path=/;expires=` + exdate.toGMTString();
    },
    routerToUserHelp() {
      const routeData = this.$router.resolve({
        name: "userHelpDisplay"
      });
      window.open(routeData.href, "_blank");
      this.$gio.clickTopBarMenuButton({
        topBarMenuName: "系统使用小助手"
      });
    }
  },
  mounted() {
    window.onbeforeunload = () => {
      this.$cookies.remove("MSDPAuthorization", { domain: window.location.hostname, path: "/" });
    };
    window.addEventListener("resize", () => {
      if (this.$refs.contentResize && this.$refs.contentResize.onResize) {
        this.$refs.contentResize.onResize();
      }
      this.mainminheight = `height:${document.documentElement.clientHeight - 60}px`;
    });
  }
};
</script>

<style lang="less">
// @import "./assets/font/font.css";
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}
#app {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app-sub {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  min-width: 1300px;
  color: #2c3e50;
}
.el-button--confirm-msdp {
  border: 1px solid #d10000;
  background-color: #d10000;
}

.msg-center {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}
::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.6);
  border-radius: 6px !important;
}
.number-msg {
  padding: 0 7px;
  height: 18px;
  background-color: #dd0000;
  color: #ffffff;
  border-radius: 10px;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  margin-right: 10px;
  position: absolute;
  top: 16px;
  left: 30px;
}
.yahei {
  font-family: MicrosoftYaHei;
  font-size: 13px;
  color: rgb(153, 153, 153);
}
.title-logo {
  // border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  height: 60px;
  line-height: 60px;
}
//  去掉表格内部边框
.data-table {
  min-height: 500px;
}
// 导出提示语
.export-notice {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: #ff9900;
  margin-left: 20px;
  display: flex;
  align-items: center;
}
.download-box {
  font-family: MicrosoftYaHei;
  padding: 0px 20px 20px 20px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.file-title {
  font-family: MicrosoftYaHei;
  font-size: 13px;
  color: #333;
  line-height: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 300px;
}
.file-notice {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: #999;
  line-height: 12px;
  margin-top: 10px;
}
.download-wrap {
  .el-dialog {
    margin-right: 40px;
    padding-bottom: 20px;
    border-radius: 4px;
  }
  .el-dialog__body {
    padding: 0px 0px 0px;
  }
  .el-tooltip_popper {
    max-width: 20% !important;
  }
  .el-dialog__title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    line-height: 16px;
  }
  .el-divider--horizontal {
    margin: 10px 0;
  }
}
.honor-wrap {
  .el-dialog {
    padding-bottom: 20px;
    border-radius: 4px;
  }
  .el-dialog__body {
    padding: 0px 0px 0px;
  }
  .el-dialog__title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    line-height: 16px;
  }
  .el-divider--horizontal {
    margin: 10px 0;
  }
}
// .data-table::after {
//   width: 0 !important;
// }
.data-table td,
.data-table th.is-leaf {
  border: none !important;
}
.data-table thead tr th.is-leaf {
  // border: 1px solid #ebeef5 !important;
  border-right: none !important;
}
.data-table thead tr th:nth-last-of-type(2) {
  border-right: 0px solid #ebeef5 !important;
}
// .nav-left > div:first-child {
//   overflow-y: auto !important;
// }
.right-nav {
  float: left;
  width: calc(100% - 220px) !important;
}
.left-nav {
  float: left;
  background: #f2f3f7;
  width: 220px !important;
}
.el-button--danger {
  background: rgb(221, 0, 0) !important;
}
.el-button--danger.is-plain {
  color: rgb(221, 0, 0);
  background-color: #fcf2f1 !important;
  border-color: #f56c6c !important;
}
.el-button--danger.is-plain:focus,
.el-button--danger.is-plain:hover {
  color: rgb(221, 0, 0) !important;
}
.el-button--default.el-button--small:focus,
.el-button--default.el-button--small:hover {
  color: rgb(221, 0, 0) !important;
  background-color: #fcf2f1 !important;
  border-color: #fe000c !important;
}
.deletBtn .el-button--primary:focus,
.deletBtn .el-button--primary:hover {
  background-color: #fe000c !important;
  color: #fff !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.data-table .el-table__body tr.current-row > td {
  background-color: #fee7e8 !important;
}
.el-form-item__label {
  line-height: 30px !important;
}
.el-form-item__content {
  line-height: 30px !important;
}
.el-form--label-top .el-form-item__label {
  padding: 0px !important;
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background: #fff !important;
  border: 1px solid #dcdfe6 !important;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: #fff !important;
  border: 1px solid #fe000c !important;
  color: #fe000c !important ;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #fe000c !important ;
}
.el-select .el-input.is-focus .el-input__inner,
.el-select .el-input__inner:focus,
.el-input.is-active .el-input__inner,
.el-input__inner:focus,
.el-range-editor.is-active,
.el-range-editor.is-active:hover,
.el-textarea__inner:focus {
  border-color: #fe000c !important;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #001450 !important;
  background: #001450 !important;
}
.el-radio.is-checked .el-radio__label {
  color: #001450 !important;
}
.el-select-dropdown__item.selected,
.el-date-table td.today span,
.el-date-table td.available:hover {
  color: #fe000c !important;
}
.el-date-table td.today.start-date span {
  color: #fff !important;
}
.el-submenu__title:hover {
  background-color: #fee7e8 !important;
}
.el-date-table td.end-date span,
.el-date-table td.start-date span {
  background-color: #fe000c !important;
}
.el-pagination {
  position: fixed;
  bottom: 25px;
  right: 25px;
  // .el-pagination__sizes {
  //   display: none !important;
  // }
}
.el-table .el-table__header-wrapper thead {
  color: #000;
}
.el-textarea__inner {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
}
label {
  font-size: 14px !important;
}
// .el-input__inner{
//   height:32px !important;
//   line-height: 32!important;
// }
// .el-pagination__editor.el-input .el-input__inner{
//   height:28px !important;
// }
.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.6);
  border-radius: 3px;
}
::-webkit-scrollbar {
  width: 6px; /*竖向*/
  height: 6px; /*横向*/
}
::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.6);
  border-radius: 3px;
}
.empty-content {
  &:empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &::after {
      color: #999;
      font-size: 15px;
      content: "暂无内容";
    }
  }
}
</style>
