<!--PES档案详情-->
<template>
  <div style="position: relative;">
    <div class="plan-wrap" :style="mainminheight">
      <div class="right-content" style="margin-top:20px">
        <div class="line"></div>
        <div class="right-title">计划目标</div>
      </div>
      <!-- 计划目标1 -->
      <div style="padding:24px 20px;">
        <el-form :model="planForm" :rules="rules" ref="planForm" label-width="100px" label-position="right">
          <div v-for="(item, index) in planForm.planList" :key="index">
            <div class="plan-items-title">
              {{ item.type == "1" ? "计划目标" : "新增目标" }}
              <span v-if="item.type == '1'" style="color:#dd0000;">{{ index + 1 }}</span>
              <span v-if="item.type == '2'" style="color:#dd0000;">{{ planNum == "0" ? index - planTotal + 1 : index - planNum + 1 }}</span>
              <el-button
                style="color:#dd0000;font-weight:400;font-size:13px;margin-left:24px;"
                v-if="((item.delFlag && item.id) || !item.id) && planForm.planList.length != 1"
                type="text"
                size="small"
                @click="deleteService(index)"
                >删除</el-button
              >
            </div>
            <el-form-item label="计划内容" :rules="[{ required: true, message: '请输入计划内容', trigger: 'blur' }]" :prop="'planList.' + index + '.content'">
              <el-input
                type="textarea"
                :rows="2"
                resize="none"
                maxlength="500"
                class="font-family"
                placeholder="请输入内容"
                show-word-limit
                style="width: 100%; margin-bottom: 0px"
                v-model="item.content"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="关联服务项">
              <span slot="label"><span style="color:#F56C6C;margin-right:4px;">*</span>关联服务项</span>
              <el-button size="mini" type="danger" @click="opService(1, index, item)">
                添加服务项
              </el-button>
            </el-form-item>

            <div v-if="item.itemDtoList.length">
              <el-row v-for="(item1, index1) in item.itemDtoList" :key="index1" :class="!item1.flag ? 'service-items-wrap' : 'service-items-wrap-error'">
                <el-col :span="3" class="no-wrap">
                  <span style="color:#001450;font-weight:400;font-family:Microsoft YaHei">{{ item1.serviceName }}</span>
                  <div class="line-grey"></div>
                </el-col>
                <el-col :span="3"> 计划开始日期：{{ item1.planStartTime || "暂无" }} </el-col>
                <el-col :span="5" class="no-wrap" v-if="serviceCompanyType == '0'"> 美孚项目成员：{{ item1.mobilProjectUserNames || "暂无" }} </el-col>

                <el-col :span="5" class="no-wrap" v-if="(detailData.distributorCompanyType == '1' && serviceCompanyType == '0') || serviceCompanyType == '1'">
                  经销商项目成员：{{ item1.distributorProjectUserNames || "暂无" }}
                </el-col>
                <el-col :span="5" class="no-wrap"> 客户项目成员：{{ item1.customerProjectUserNames || "暂无" }} </el-col>
                <el-col :span="1" align="right">
                  <el-button type="text" v-if="!item1.id" @click="deleteServiced(index, index1)" style="color:#dd0000;">删除</el-button>
                </el-col>
              </el-row>
            </div>
            <el-form-item
              label="预估价值"
              :prop="'planList.' + index + '.exceptWorth'"
              :rules="[
                { required: true, message: '请输入预估价值', trigger: 'blur' },
                ,
                { pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '数值不能为空或0,且小数点后最多2位小数', trigger: 'blur' }
              ]"
              style="margin-top:34px;"
            >
              <el-input size="small" maxlength="15" style="width:380px;margin-right:20px;" @keyup.native="proving(item)" v-model="item.exceptWorth"></el-input>万元
            </el-form-item>
          </div>
        </el-form>
        <div>
          <el-button type="text" size="small" @click="addPlanItem" style="color:#001450;font-size:14px;font-weight:400">+ {{ statusPlan == "3" ? "新增目标及服务项" : "添加计划目标" }}</el-button>
        </div>
      </div>

      <!-- 其他信息 -->
      <div class="right-content" style="margin-top:20px">
        <div class="line"></div>
        <div class="right-title">其它信息</div>
      </div>
      <div style="padding:24px 20px">
        <el-form :model="planForm.planReportOtherInfoDto" ref="planReportOtherInfoDto" label-width="120px" label-position="right">
          <el-form-item label="客户领导" prop="customerLeader" :rules="rulesOther.customerLeader">
            <el-input size="small" maxlength="20" style="width:380px;margin-right:20px;" v-model="planForm.planReportOtherInfoDto.customerLeader"></el-input>
          </el-form-item>
          <el-form-item label="客户工程师" prop="customerEngineer" :rules="rulesOther.customerEngineer">
            <el-input size="small" maxlength="20" style="width:380px;margin-right:20px;" v-model="planForm.planReportOtherInfoDto.customerEngineer"></el-input>
          </el-form-item>
          <el-form-item label="大区销售总监" prop="dqxszjValue" v-if="serviceCompanyType == '0'" :rules="rulesOther.dqxszjValue">
            <el-input size="small" maxlength="20" style="width:380px;margin-right:20px;" v-model="planForm.planReportOtherInfoDto.dqxszjValue"></el-input>
          </el-form-item>
          <el-form-item label="区域销售经理" prop="qyxsjlValue" v-if="serviceCompanyType == '0'" :rules="rulesOther.qyxsjlValue">
            <el-input size="small" maxlength="20" style="width:380px;margin-right:20px;" v-model="planForm.planReportOtherInfoDto.qyxsjlValue"></el-input>
          </el-form-item>
          <el-form-item label="区域技术经理" prop="qyjsjlValue" v-if="serviceCompanyType == '0'" :rules="rulesOther.qyjsjlValue">
            <el-input size="small" maxlength="20" style="width:380px;margin-right:20px;" v-model="planForm.planReportOtherInfoDto.qyjsjlValue"></el-input>
          </el-form-item>
          <el-form-item label="经销商名称" prop="jxsmcValue" v-if="serviceCompanyType == '1'" :rules="rulesOther.jxsmcValue">
            <el-input size="small" maxlength="20" style="width:380px;margin-right:20px;" v-model="planForm.planReportOtherInfoDto.jxsmcValue"></el-input>
          </el-form-item>
          <el-form-item label="销售经理" prop="xsjlValue" v-if="serviceCompanyType == '1'" :rules="rulesOther.xsjlValue">
            <el-input size="small" maxlength="20" style="width:380px;margin-right:20px;" v-model="planForm.planReportOtherInfoDto.xsjlValue"></el-input>
          </el-form-item>
          <el-form-item label="服务工程师" prop="fwgcsValue" v-if="serviceCompanyType == '1'" :rules="rulesOther.fwgcsValue">
            <el-input size="small" maxlength="20" style="width:380px;margin-right:20px;" v-model="planForm.planReportOtherInfoDto.fwgcsValue"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <OperationDrawer
      :serviceDrawerVisible.sync="serviceDrawerVisible"
      :indexPlan="indexPlan"
      :overViewData="overViewData"
      :planList="planForm.planList"
      :planAdd="planAdd"
      :pesInfo="pesInfo"
      v-bind="serviceDrawerOpTypeParams"
      v-if="serviceDrawerVisible && pesInfo"
    />

    <div class="foot-botton">
      <el-button type="danger" plain :disabled="disabledPreview" @click="previewReport" size="small">预览报告</el-button>
      <el-button type="danger" plain @click="saveInfoPublish('draft')" size="small">保存草稿</el-button>
      <el-button type="danger" v-if="statusPlan != '3'" @click="saveInfoPublish('publish')" size="small">保存并发布</el-button>
      <el-button type="danger" plain @click="cancleEditInfo" size="small">取消</el-button>
    </div>
  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
import { clearState, getServiceTableData, getEditServiceChargetUserList, getEditServiceTypeTree, editServcieSingle } from "../api/serviceBatchOperationApi";
// import { archivesData } from "./data_config";
export default {
  components: {
    OperationDrawer: () => import("../component/serviceBatchOperationDrawer.vue")
  },
  provide() {
    return {
      SERVICEVM: this
    };
  },
  data() {
    return {
      statusPlan: "",
      indexPlan: null,
      filterForm: {
        planStartTime: "",
        chargeUserId: "",
        serviceNumber: ""
      },
      planAdd: "planAdd",
      applylist: {
        name: "",
        contactMapAddress: ""
      },
      cancelServiceDialog: false, // 计划目标弹框 显隐
      addPlanForm: {
        // 计划目标 表单
        reason: ""
      },
      selectRow: {}, // 选中的某个取消数据
      addPlanRules: {
        reason: [{ required: true, message: "请输入取消原因", trigger: "blur" }]
      },
      disabledPreview: true, // 预览按钮是否可以点击
      planNum: 0,
      planTotal: 0,
      serviceTableSelectedData: null,
      serviceDrawerVisible: false,
      serviceDrawerOpTypeParamsMap: {
        0: {
          serviceDrawerType: 0,
          serviceDrawerTitle: "批量取消服务项",
          selectedData: null
        },
        1: {
          serviceDrawerType: 1,
          serviceDrawerTitle: "添加服务项"
        },
        2: {
          serviceDrawerType: 2,
          serviceDrawerTitle: "批量编辑服务项",
          selectedData: null
        }
      },
      serviceDrawerOpTypeParams: null,
      overViewData: {},
      planForm: {
        planList: [
          {
            content: "",
            exceptWorth: "",
            itemDtoList: [],
            type: "1",
            pesItems: ""
          }
        ],
        planReportOtherInfoDto: {
          customerLeader: "",
          dqxszjValue: "",
          customerEngineer: "",
          fwgcsValue: "",
          jxsmcValue: "",
          qyjsjlValue: "",
          qyxsjlValue: "",
          xsjlValue: ""
        } // 其它信息
      },
      detailData: {},
      pagenation: {
        size: 4,
        current: 1
      },
      pesId: "",
      serviceCompanyType: "",
      pesFlag: "",
      selectIndex: null, // 记录是哪一条计划目标点击的选择的服务项
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      serviceData: [],
      selectServiceVisiable: false, // 选择服务项弹框
      //   表单验证规则
      rulesOther: {
        customerLeader: [{ required: true, message: "请输入客户领导", trigger: "change" }],
        dqxszjValue: [{ required: true, message: "请输入大区销售总监", trigger: "change" }],
        customerEngineer: [{ required: true, message: "请输入客户工程师", trigger: "change" }],
        fwgcsValue: [{ required: true, message: "请输入客户工程师", trigger: "change" }],
        jxsmcValue: [{ required: true, message: "请输入经销商名称", trigger: "change" }],
        qyjsjlValue: [{ required: true, message: "请输入区域技术经理", trigger: "change" }],
        qyxsjlValue: [{ required: true, message: "请输入区域销售经理", trigger: "change" }],
        xsjlValue: [{ required: true, message: "请输入销售经理", trigger: "change" }]
      },
      rules: {
        content: [{ required: true, message: "请输入计划内容", trigger: "change" }],
        exceptWorth: [{ required: true, message: "请输入预估价值", trigger: "change" }]
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      planData: {},
      reportId: "",
      newIds: [], // 选择的服务项id
      pesInfo: null
    };
  },
  created() {
    this.pesId = this.$route.query.pesId;
    this.serviceCompanyType = this.$route.query.serviceCompanyType;
    this.pesFlag = this.$route.query.pesFlag;
    this.statusPlan = this.$route.query.statusPlan;
    this.distributorCompanyType = this.$route.query.distributorCompanyType;
    this.planData = JSON.parse(sessionStorage.getItem("plan" + this.userInfo.userId + this.pesId));
    this.selectIndex = JSON.parse(sessionStorage.getItem("plan" + this.userInfo.userId + this.pesId + "z"));
    if (this.$route.query.resource == "plan") {
      sessionStorage.removeItem("plan" + this.userInfo.userId + this.pesId);
      sessionStorage.removeItem("plan" + this.userInfo.userId + this.pesId + "z");
    }
    if (this.planData && this.$route.query.false) {
      this.planForm.planList = this.planData.planList;
      this.statusPlan = this.$route.query.statusPlan;
      this.planForm.planReportOtherInfoDto = this.planData.planReportOtherInfoDto;
      this.reportId = this.$route.query.reportId;
      // 刷新选择服务项弹框列表
      this.selectServiceVisiable = true;
      this.queryServiceItemForEdit(this.planForm.planList[this.selectIndex]);
    }
  },
  mounted() {
    if (!this.planData) {
      this.getPlanReport();
    }
    window.onresize = () => {
      return (() => {
        this.mainminheight = `height:${document.documentElement.clientHeight - 200}px`;
      })();
    };
  },
  destroyed: function() {},
  methods: {
    proving(item) {
      item.exceptWorth = item.exceptWorth.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
      item.exceptWorth = item.exceptWorth.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
      item.exceptWorth = item.exceptWorth.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
      item.exceptWorth = item.exceptWorth
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", "."); // 只允许输入一个小数点
      item.exceptWorth = item.exceptWorth.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
      item.exceptWorth = item.exceptWorth.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
      item.exceptWorth = item.exceptWorth.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
      item.exceptWorth = item.exceptWorth.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
    },
    drawerCallRefreshTable(row) {
      console.log(row);
      var arr = Array(row.num).fill(row);
      this.planForm.planList[this.indexPlan].itemDtoList = [...this.planForm.planList[this.indexPlan].itemDtoList, ...arr];
      console.log(this.planForm.planList);
    },
    opService(type, index, item, selectedDataSingleRow) {
      this.indexPlan = index;
      // type ： 0 - 批量取消 1 - 添加服务项 2 - 批量编辑
      const params = cloneDeep(this.serviceDrawerOpTypeParamsMap[type]);
      if (type != 1) {
        params.selectedData = this.handleMergeSelectedTableData(selectedDataSingleRow);
      }
      let index1;
      console.log(params);
      let str = item.type == "1" ? "计划目标" : "新增目标";
      index1 = item.type == "1" ? index + 1 : this.planNum == "0" ? index - this.planTotal + 1 : index - this.planNum + 1;
      this.planAdd = str + index1;
      this.serviceDrawerOpTypeParams = params;
      this.serviceDrawerVisible = true;
    },
    handleMergeSelectedTableData(selectedDataSingleRow) {
      if (!selectedDataSingleRow && !this.serviceTableSelectedData) return null;
      if (!this.serviceTableSelectedData) return [selectedDataSingleRow];
      const curSelTableData = cloneDeep(this.serviceTableSelectedData);
      if (!selectedDataSingleRow) return curSelTableData;

      const exist = curSelTableData.some(row => row.id == selectedDataSingleRow.id);
      if (!exist) {
        curSelTableData.push(selectedDataSingleRow);
        this.serviceTableSelectedData.push(selectedDataSingleRow);
      }
      return curSelTableData;
    },
    resetFilterForm() {
      this.filterForm = {
        planStartTime: "",
        chargeUserId: "",
        serviceNumber: ""
      };
    },
    rowKey(row) {
      return row.id;
    },
    handleResetSelect() {
      this.selectServiceVisiable = false;
    },
    // 列标题 Label 区域渲染使用的 Function
    renderHeader(h, { column, $index }) {
      const label = column.label;
      return [
        h(
          "el-tooltip",
          {
            props: {
              content: (function() {
                return label;
              })(),
              placement: "top"
            }
          },
          [h("span", {}, label)]
        )
      ];
    },

    // 添加计划目标
    addPlanItem() {
      // 已发布之后新增的是新增目标   已发布之前是计划目标
      this.planForm.planList.push({
        content: "",
        exceptWorth: "",
        itemDtoList: [],
        type: this.statusPlan == "3" ? "2" : "1",
        pesItems: ""
      });
    },
    // 删除服务项
    deleteServiced(index, index1) {
      this.planForm.planList[index].itemDtoList.splice(index1, 1);
    },
    deleteService(index) {
      this.planForm.planList.splice(index, 1);
    },
    // 点击预览报告按钮
    previewReport() {
      const params = {
        pesInfoId: this.pesId
      };
      this.requestMethodGet("/pes/report/queryPlanReportPath", params).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data.status == "2") {
            this.$message({
              message: "报告正在生成中，请稍后",
              type: "warning"
            });
          } else {
            if (res.data.data.path) {
              window.open(res.data.data.path);
            } else {
              this.$message({
                message: "报告生成失败，请重试",
                type: "warning"
              });
            }
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 查询计划书
    getPlanReport() {
      this.requestMethodGet("/pes/report/queryPlanReport", { pesInfoId: this.pesId }).then(res => {
        if (res.data.code == 1000) {
          
          if (res.data.data) {
            this.pesInfo = res.data.data;
            if (res.data.data.list && res.data.data.list.length > 0) {
              this.planForm.planList = res.data.data.list;
            }
            if (res.data.data.status != null) {
              this.disabledPreview = false;
            }

            this.planTotal = res.data.data.list.length;
            this.reportId = res.data.data.reportId;
            this.statusPlan = res.data.data.status;
            this.overViewData = res.data.data;
            let index = this.planForm.planList.findIndex(value => value.type == "2");
            if (index != -1) {
              this.planNum = index;
            }
            if (res.data.data.planReportOtherInfoDto) {
              this.planForm.planReportOtherInfoDto = res.data.data.planReportOtherInfoDto;
            }
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 查询已有服务项
    queryServiceItemForEdit(val) {
      let arr = [];
      let arrIdNew = [];
      let arrString = "";
      this.newIds = [];
      if (val.pesItems != "" && !Array.isArray(val.pesItems)) {
        arr = val.pesItems.split(",");
      }
      if (Array.isArray(val.pesItems)) {
        arr = val.pesItems;
      }
      if (this.planForm.planList[this.selectIndex].pesItems != "" && !Array.isArray(this.planForm.planList[this.selectIndex].pesItems)) {
        this.planForm.planList[this.selectIndex].pesItems = this.planForm.planList[this.selectIndex].pesItems.split(",");
      }
      if (this.planForm.planList.length > 1) {
        const filteredItems = this.planForm.planList.slice(0, this.selectIndex).concat(this.planForm.planList.slice(this.selectIndex + 1, this.planForm.planList.length));
        filteredItems.forEach(it => {
          if (it.pesItems != "" && !Array.isArray(it.pesItems)) {
            it.pesItems = it.pesItems.split(",");
          }
        });
        filteredItems.forEach(it => {
          this.newIds = this.newIds.concat(it.pesItems);
        });
        arrIdNew = [...new Set(this.newIds)];
        arrString = arrIdNew.toString();
      }
      this.requestMethodGet("/pes/package/queryServiceItemForEditList", { pesId: this.pesId, excludeItemIds: arrString, queryReportFlag: true }).then(res => {
        if (res.data.code == 1000) {
          this.serviceData = res.data.data;
          this.$refs.tableAddLum.clearSelection();
          this.serviceData.forEach(item => {
            arr.forEach(it => {
              if (it == item.id) {
                let result = arr.findIndex(r => {
                  return r == item.id;
                });
                if (result == -1) {
                  this.planForm.planList[this.selectIndex].itemDtoList.push(item);
                }
                this.$refs.tableAddLum.toggleRowSelection(item);
              }
            });
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 保存草稿
    saveInfoDraft(val) {
      sessionStorage.removeItem("plan" + this.userInfo.userId + this.pesId);
      sessionStorage.removeItem("plan" + this.userInfo.userId + this.pesId + "z");
      this.planForm.planList.forEach((item, index) => {
        if (item.itemDtoList.length) {
          item.itemDtoList.forEach(item1 => {
            if (item1.num) {
              delete item1.num;
            }
          });
        }
        console.log(item);
      });
      let parmas = {
        list: this.planForm.planList,
        pesInfoId: this.pesId,
        reportId: this.reportId,
        planReportOtherInfoDto: this.planForm.planReportOtherInfoDto,
        publishFlag: val == "publish"
      };
      this.requestMethodPost("/pes/report/savePlanReport", parmas).then(res => {
        if (res.data.code == 1000) {
          this.disabledPreview = false;
          if (res.data.data) {
            this.reportId = res.data.data.reportId;
          }
          if (val == "publish") {
            this.$message({
              message: "发布成功",
              type: "success"
            });
            this.$router.push({
              path: "/CustomerProfile/CustomerPesIndex",
              query: {
                companyNumber: this.$route.query.companyNumber,
                companyId: this.$route.query.companyId,
                resource: "plan",
                pesId: this.pesId
              }
            });
          } else {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.getPlanReport();
          }
        } else if (res.data.code == 7001) {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
          let arrError = res.data.data.errorItemIds.split(",").map(Number);
          this.planForm.planList.map((it, index1) => {
            if (it.itemDtoList.length) {
              it.itemDtoList.forEach((itChild, index2) => {
                arrError.forEach(arrItem => {
                  if (arrItem == itChild.id) {
                    this.$set(this.planForm.planList[index1].itemDtoList[index2], "flag", true);
                  }
                });
              });
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
    saveInfoPublish(val) {
      let flag = false;
      if (val == "draft") {
        if (this.statusPlan == "3") {
          this.planForm.planList.forEach(item => {
            if (item.itemDtoList && item.itemDtoList.length == 0) {
              this.$message({
                message: "请关联服务项",
                type: "error"
              });
              flag = true;
            }
          });
          if (!flag) {
            this.saveInfoDraft(val);
            this.$gio.saveDraftOfArchiveReport({ reportType: "计划书", customer: this.$route.query.companyNumber });
          }
        } else {
          this.saveInfoDraft(val);
          this.$gio.saveDraftOfArchiveReport({ reportType: "计划书", customer: this.$route.query.companyNumber });
        }
      } else {
        this.$refs["planForm"].validate(valid => {
          if (valid) {
            this.planForm.planList.forEach(item => {
              if (item.itemDtoList && item.itemDtoList.length == 0) {
                this.$message({
                  message: "请关联服务项",
                  type: "error"
                });
                flag = true;
              }
            });
            if (!flag) {
              this.$refs["planReportOtherInfoDto"].validate(valid => {
                if (valid) {
                  this.saveInfoDraft(val);
                }
              });
            }
          }
        });
        this.$gio.publishArchiveReport({ reportType: "计划书", customer: this.$route.query.companyNumber });
      }
    },

    // 取消
    cancleEditInfo() {
      this.$confirm("取消后将丢失本次编辑内容", "取消编辑", {
        cancelButtonText: "继续编辑",
        confirmButtonText: "确定",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          sessionStorage.removeItem("plan" + this.userInfo.userId + this.pesId);
          sessionStorage.removeItem("plan" + this.userInfo.userId + this.pesId + "z");
          this.$router.push({
            path: "/CustomerProfile/CustomerPesIndex",
            query: {
              companyNumber: this.$route.query.companyNumber,
              companyId: this.$route.query.companyId,
              resource: "plan",
              pesId: this.pesId
            }
          });
          this.$gio.cancelCreateArchiveReport({ operation: "弹窗中点击确定", reportType: "计划书", customer: this.$route.query.companyNumber });
        })
        .catch(() => {
          this.$gio.cancelCreateArchiveReport({ operation: "弹窗中点击继续编辑", reportType: "计划书", customer: this.$route.query.companyNumber });
        });
      this.$gio.cancelCreateArchiveReport({ operation: "点击取消按钮", reportType: "计划书", customer: this.$route.query.companyNumber });
    }
  }
};
</script>
<style lang="less" scoped>
.plan-wrap {
  padding: 20px;
  height: 100%;
  position: relative;
  overflow: auto;
}
.right-content {
  display: flex;
  align-items: center;
  background: #ededed;
  font-size: 14px;
  margin-top: 40px;
  line-height: 50px;
  height: 50px;
  font-weight: 400;
  font-size: 14px;
  padding: 0 20px;
}
.line {
  width: 4px;
  height: 14px;
  background-color: #dd0000;
}
.line-grey {
  width: 1px;
  height: 14px;
  display: inline-block;
  margin: 0 24px;
  background-color: #e9e9e9;
}
.right-title {
  line-height: 25px;
  color: #000;
  margin-left: 8px;
  font-weight: bold;
}
.service-items-wrap,
.service-items-wrap-error {
  background: rgba(204, 221, 255, 0.2);
  font-weight: 400;
  color: #999;
  padding: 0 20px;
  border: 1px solid #ccddff;
  border-radius: 6px;
  height: 48px;
  line-height: 48px;
  font-size: 13px;
  margin-bottom: 12px;
}
.no-wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.service-items-wrap-error {
  border: 1px solid red;
}
.plan-items-title {
  font-weight: 700;
  font-size: 14px;
  line-height: 14px;
  color: #000;
  margin-bottom: 20px;
}
// 设置显示两行，超出省略
/deep/ .el-table th > .cell {
  word-break: keep-all !important;
  white-space: nowrap !important;
}
.foot-botton {
  width: 100%;
  background-color: #fff;
  height: 50px;
  padding: 0 20px;
  position: fixed;
  bottom: 0;
}
</style>
