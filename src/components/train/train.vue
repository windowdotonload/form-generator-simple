<template>
  <div class="main-box-train">
    <div class="train">
      <el-row :gutter="20">
        <el-col :span="24" class="train-serach-item">
          <!-- <el-button plain size="small"  @click="handleClearSearch">重置</el-button> -->
          <el-button type="danger" @click="handleEdit" size="small" style="float:right;" v-has="addTrainCode">新建课程</el-button>
          <el-button type="danger" @click="() => (trainAnalysisVis = true)" size="small" style="float:right;" plain>数据分析</el-button>
          <el-button type="danger" @click="handleConfig" size="small" style="float:right;" plain v-has="addWechatEnter">小程序入口配置</el-button>
        </el-col>
      </el-row>
      <custom-table
        :tableHeader="tableDataHeader"
        :tableData="newsTableData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        class="moreSelectMar"
        @changeSearch="tableTitleSearch" 
      >
        <template v-slot:trainName="slotProps">
          <el-table-column
            label="课程名称"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
                title="课程名称"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template slot-scope="scope">
              <div>
                {{ scope.row.trainName }}
                <span
                  v-if="scope.row.totalAuditStatus == 2"
                  style="margin-left:8px;background:rgba(221,0,0,0.08);color:#dd0000;padding:0 10px;height:24px;display:inline-block;font-size:12px;line-height:24px;border-radius:4px"
                >
                  视/音频 审核失败
                </span>
                <span
                  v-if="scope.row.totalAuditStatus == 0"
                  style="margin-left:8px;background:rgba(255,153,0,0.1);color:#ff9900;padding:0 10px;height:24px;display:inline-block;font-size:12px;line-height:24px;border-radius:4px"
                >
                  视/音频 审核中
                </span>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:status="slotProps">
          <el-table-column
            label="状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header 
                title="状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"/>
            </template>
            <template #default="{row}">
              <span v-show="row.status" style="color:#008787">已上线</span>
              <span v-show="!row.status" style="color:#d10000">已下线</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-link type="danger" @click="handleEdit(scope.row)" style="margin-right:10px;color:rgb(0,20,80)" :underline="false" v-has="editTrainCode">编辑</el-link>
            <el-link
              type="danger"
              v-has="trainStatusChangeCode"
              @click="handleTrainStatus(scope.row)"
              :style="scope.row.totalAuditStatus != 1 ? 'margin-right:10px;color:#aaa' : scope.row.status == 1 ? 'margin-right:10px;color:rgb(221, 0, 0)' : 'margin-right:10px;color:rgb(0, 136, 136)'"
              :underline="false"
              :disabled="scope.row.totalAuditStatus != 1"
              >&nbsp;{{ scope.row.status == 0 ? "上线" : "下线" }}
            </el-link>
            <el-link type="danger" @click="handleEvaluate(scope.row)" style="margin-right:10px;color:rgb(0,20,80)" :underline="false">&nbsp;查看评价</el-link>
            <el-link type="danger" @click="handleDrawer(scope.row)" style="margin-right:10px;color:#027DB4" :underline="false">&nbsp;数据分析</el-link>
            <el-link type="danger" @click="handleDelete(scope.row)" style="margin-right:10px" :underline="false" v-if="scope.row.status == 0" v-has="deleteTrainCode">&nbsp;删除 </el-link>
          </template>
        </el-table-column>
      </custom-table>
    </div>
    <el-pagination
      v-if="totalNumber > 0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenation.current"
      :page-size="pagenation.size"
      :page-sizes="[5, 10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber"
      class="listOptimizePage"
    ></el-pagination>
    <!-- 预览 -->
    <el-dialog :title="`评价（${evaluateTotal > 999 ? '999+' : evaluateTotal}）`" :visible.sync="priviewDialogFlag" custom-class="preview-dialog" width="800px" top="50px">
      <div style="display: flex;align-items: center;justify-content: center;">
        <el-scrollbar style="height:600px;">
          <div style="height:540px;width:760px" v-if="trainEvaluateList.length">
            <div v-for="item in trainEvaluateList" :key="item.id" style="display:flex;padding:16px 10px 16px 0;border-bottom:1px solid rgba(0,0,0,0.05) ">
              <img style="width: 40px;height:40px;border-radius:20px" :src="item.avatar ? item.avatar : headImg" object-fit="contain" />
              <div style="flex:1;margin-left:10px">
                <div style="display:flex;justify-content:space-between">
                  <div>
                    <span style="font-size:14px;color:#000;margin-right:8px">{{ item.userName }}</span> <span style="font-size:12px;color:#999">{{ item.createTime }}</span>
                  </div>
                  <el-link icon="el-icon-delete" @click="deleteTrack(item)" style="color:#999;font-size:16px" :underline="false"></el-link>
                </div>
                <div style="font-size:13px;color:#666;margin-top:10px;line-height:21px;">{{ item.evaluate }}</div>
              </div>
            </div>
          </div>
          <el-empty description="暂无评价" style="text-align:center;width:260px;margin-top:60px" v-else></el-empty>
        </el-scrollbar>
      </div>
      <el-pagination
        v-if="evaluateTotal > 0"
        @size-change="handleEvaluateSizeChange"
        @current-change="handleEvaluateCurrentChange"
        :current-page="evaluatePagenation.current"
        :page-size="evaluatePagenation.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="evaluateTotal"
        style="position:static;text-align:right;margin-top:20px"
      ></el-pagination>
    </el-dialog>
    <!-- 设置培训入口弹窗 -->
    <el-dialog :visible.sync="configDialogFlag" custom-class="preview-dialog" width="500px" :close-on-click-modal="false" top="30vh">
      <el-form :model="formData" ref="formData" label-width="100px" style="margin-top:20px">
        <el-form-item label="入口配置：" prop="type" :rules="[{ type: 'array', required: true, message: '请选择入口配置', trigger: 'change' }]">
          <el-cascader v-model="formData.type" :options="typeList" style="width:90%" size="small" :props="props" collapse-tags clearable></el-cascader>
          <div style="color:#999">（从配置好的二级服务进去，能看到培训入口）</div>
        </el-form-item>
        <div align="center" style="margin-top:80px">
          <el-button size="small" @click="configDialogFlag = false">取消</el-button>
          <el-button type="danger" size="small" @click="submitForm('formData')">保存</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 数据统计抽屉 -->
    <el-drawer title="数据分析" :visible.sync="drawer" :wrapperClosable="false" class="drawer-box" size="960px" style="height:100%;">
      <el-scrollbar style="height:calc(100% - 20px);">
        <div style="padding-right:20px;">
          <div class="train-name">培训：{{ trainName }}</div>
          <div class="title">课程数据概况</div>
          <div>
            <el-row :gutter="10" style="display:flex">
              <div class="col-5" style="margin-left:6px">
                <div class="grid-content">
                  <div class="name">
                    课程总参与人数
                    <el-tooltip content="参与该培训的总人数，点击数字可查看详情" effect="light" placement="top">
                      <i class="el-icon-info" style="font-size:14px;margin-left:8px;color:#ccc"></i>
                    </el-tooltip>
                  </div>
                  <div class="number" style="text-decoration: underline;" @click="showPersonList('有效观看人数', 0)">{{ trainDataInfo.watchCount }}</div>
                </div>
              </div>
              <div class="col-5">
                <div class="grid-content">
                  <div class="name">
                    测试参与人数
                    <el-tooltip content="累计到昨日，所有课程的测试参与人数，更新频率为1天，点击数字可查看详情" effect="light" placement="top">
                      <i class="el-icon-info" style="font-size:14px;margin-left:8px;color:#ccc"></i>
                    </el-tooltip>
                  </div>
                  <div class="number" style="text-decoration: underline;" @click="showPersonList('测试参与人数', 1)">{{ trainDataInfo.testCount }}</div>
                </div>
              </div>
              <div class="col-5">
                <div class="grid-content">
                  <div class="name">
                    点赞数
                    <el-tooltip content="累计到昨日，该培训的点赞数，更新频率为1天" effect="light" placement="top">
                      <i class="el-icon-info" style="font-size:14px;margin-left:8px;color:#ccc"></i>
                    </el-tooltip>
                  </div>
                  <div class="number">{{ trainDataInfo.praiseCount }}</div>
                </div>
              </div>
              <div class="col-5">
                <div class="grid-content">
                  <div class="name">
                    平均打分
                    <el-tooltip content="累计到昨日，该培训平均打分数，更新频率为1天" effect="light" placement="top">
                      <i class="el-icon-info" style="font-size:14px;margin-left:8px;color:#ccc"></i>
                    </el-tooltip>
                  </div>
                  <div class="number">{{ trainDataInfo.gradeCount || 0 }}</div>
                </div>
              </div>
              <div class="col-5" style="margin-right:0">
                <div class="grid-content">
                  <div class="name">
                    评论数
                    <el-tooltip content="累计到昨日，该培训的评论数，更新频率为1天" effect="light" placement="top">
                      <i class="el-icon-info" style="font-size:14px;margin-left:8px;color:#ccc"></i>
                    </el-tooltip>
                  </div>
                  <div class="number">{{ trainDataInfo.evaluateCount }}</div>
                </div>
              </div>
            </el-row>
          </div>
          <div v-loading="chartLoading">
            <div class="title" style="display:flex;justify-content: space-between;align-items:center">
              参与人数趋势图
              <div>
                <el-radio-group v-model="selectTime" fill="#001450" size="small" @change="initDataChart('radio')">
                  <el-radio-button :label="7">近7天</el-radio-button>
                  <el-radio-button :label="30">近30天</el-radio-button>
                </el-radio-group>
                <el-date-picker
                  v-model="chartTime"
                  clearable
                  size="small"
                  class="date-picker"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  style="width:260px;margin-left:10px"
                  @change="initDataChart('date')"
                  :picker-options="pickerOptions"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </div>
            </div>
            <div ref="dataChart" style="height:350px;width:920px"></div>
          </div>
          <div>
            <div class="title">打分结果占比图</div>
            <el-col :span="16"><div ref="testChart" style="height:280px;width:100%"></div></el-col>
            <el-col :span="8" style="display:flex;justify-content: center;flex-direction: column;height:280px">
              <div class="status">1星-很差（1分）</div>
              <div class="status star2">2星-较差（2分）</div>
              <div class="status star3">3星-还行（3分）</div>
              <div class="status star4">4星-推荐（4分）</div>
              <div class="status star5">5星-力荐（5分）</div>
            </el-col>
          </div>
          <div v-if="trainChapterList.length && trainChapterList[0].chapterName">
            <div class="title" style="display:block">培训数据详情</div>
            <!-- 表格 -->
            <el-table ref="trainChapterList" row-key="id" :data="trainChapterList" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }" stripe>
              <el-table-column prop="chapterName" label="章节名称" min-width="30%" show-overflow-tooltip> </el-table-column>
              <el-table-column prop="watchCount" label="参与人数" min-width="20%" show-overflow-tooltip> </el-table-column>
            </el-table>
          </div>
        </div>
      </el-scrollbar>
    </el-drawer>
    <!-- 课程数据概况弹窗 -->
    <el-dialog :visible.sync="personDialogFlag" :title="personTitle" custom-class="preview-dialog" width="50%" :close-on-click-modal="false">
      <!-- 表格 -->
      <el-table
        row-key="id"
        max-height="600"
        :data="trainParticipantList"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="trainParticipantLoading"
        :header-cell-style="{ background: '#f7f7f7' }"
        stripe
      >
        <el-table-column prop="userName" label="姓名/角色" min-width="20%" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.userName }}/{{ scope.row.roleName }}
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="所属公司" min-width="30%" show-overflow-tooltip> </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleTrainParticipantSizeChange"
        @current-change="handleTrainParticipantCurrentChange"
        :current-page="trainParticipantPagenation.current"
        :page-size="trainParticipantPagenation.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="trainParticipantTotal"
        style="position:static;text-align:right;margin-top:20px"
      ></el-pagination>
    </el-dialog>
    <TrainAnalysis v-if="trainAnalysisVis" :drawerVisable="trainAnalysisVis" :closeDrawer="() => (trainAnalysisVis = false)" />
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
export default {
  components: {
    TrainAnalysis: () => import("./trainDataAnalysis.vue"),
    'custom-table':customTable,
    "column-header":columnHeader,
  },
  data() {
    return {
      trainAnalysisVis: false,
      priviewDialogFlag: false,
      configDialogFlag: false,
      personDialogFlag: false,
      trainParticipantLoading: false,
      drawer: false,
      chartLoading: false,
      trainName: "",
      selectTime: 7,
      chartTime: [],
      choiceDate: "",
      trainDataInfo: {},
      trainParticipantList: [],
      trainChapterList: [],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate = minDate.getTime();
          if (maxDate) {
            this.choiceDate = "";
          }
        },
        disabledDate: time => {
          if (this.choiceDate) {
            const one = 30 * 24 * 3600 * 1000;
            const minTime = this.choiceDate - one;
            const maxTime = this.choiceDate + one;
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
        }
      },
      personTitle: "有效观看人数",
      headImg: require("../../assets/headImg.png"),
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      formData: {
        type: []
      },
      //  自定义属性
      props: {
        multiple: true,
        emitPath: false,
        value: "serviceNumber",
        label: "serviceName",
        children: "children"
      },
      typeList: [],
      queryParams: {
        trainName: "",
        status: ""
      },
      statusList: [
        {
          value: 1,
          label: "已上线"
        },
        {
          value: 0,
          label: "已下线"
        }
      ],
      pagenation: {
        current: 1,
        size: 30
      },
      evaluatePagenation: {
        current: 1,
        size: 30
      },
      trainParticipantPagenation: {
        current: 1,
        size: 10
      },
      newsTableData: [],
      totalNumber: 0, // 总条数
      evaluateTotal: 0, // 留言总条数
      dataRecordTableData: [],
      selectList: [],
      trainEvaluateList: [],
      dialogTitle: "",
      loading: false, // 是否加载
      trainId: 0,
      tableHeight:null,
      tableDataHeader: [
        { filterType: "input", paramValue: "trainName", changeValue:"",  label: "课程名称", slot: "trainName", width: "180" },
        { label: "课程类型", prop: "typeName", width: "180", tooltip: true},
        { filterType: "selection", paramValue: "status", selectMultiple: true, selectOptions:  [{ code: 1, name: "已上线" },{ code: 0, name: "已下线" }], changeValue:"", label: "状态", slot: "status", width: "100" },
        { label: "创建日期", prop: "createTime", width: "100", tooltip: true},
        { label: "操作", slot: "operation" }
     ],
    };
  },

  created() {
    this.$_getServiceList();
  },
  mounted() {
    this.getOrderManagementData(); // 获取订单列表
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  methods: {
    // 服务类型
    $_getServiceList(val) {
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTreeLv1AndLv2", {})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.typeList = this.formatData(res.data);
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
    handleEvaluate(row) {
      this.trainId = row.id;
      this.getTrainTrackList();
    },
    getTrainTrackList() {
      let param = {
        trainId: this.trainId,
        ...this.evaluatePagenation
      };
      this.requestMethodGet("/train/queryTrainEvaluateListByPage", param)
        .then(res => {
          if (res.data.code == 1000) {
            this.trainEvaluateList = res.data.data.list;
            this.evaluateTotal = res.data.data.totalCount;
            this.priviewDialogFlag = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    deleteTrack(row) {
      this.$confirm("确认删除这条评价?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          let params = {
            evaluateId: row.id
          };
          this.requestMethodGet("/train/deleteEvaluate", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getTrainTrackList(); // 获取列表
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
        .catch(err => {
          console.log(err);
        });
    },
    // 获取账号列表
    getOrderManagementData() {
      this.loading = true;
      let params = {
        trainName: this.queryParams.trainName,
        status: this.queryParams.status,
        ...this.pagenation
      };
      this.newsTableData = [];
      this.requestMethodGet("/train/queryTrainListByPage", params)
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
    // 查询
    handleSearchTableData(e) {
      this.pagenation.current = 1;
      this.getOrderManagementData(); // 获取列表
      if (e.target) {
        let target = e.target;
        if (target.nodeName == "SPAN" || target.nodeName == "I") {
          target = e.target.parentNode;
        }
        target.blur();
      }
    },
    handleTrainStatus(row) {
      let status = row.status == 1 ? 0 : 1;
      this.requestMethodGet("/train/modifyTrainStatus", { trainId: row.id, status: status }).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: status == 1 ? "上线成功" : "下线成功"
          });
          this.priviewDialogFlag = false;
          this.getOrderManagementData(); // 获取列表
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
      });
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除这条数据源?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          let params = {
            trainId: row.id
          };
          this.requestMethodGet("/train/deleteTrain", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.getOrderManagementData(); // 获取列表
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
        .catch(err => {
          console.log(err);
        });
    },
    // 下载
    handleDownload() {
      let ids = this.selectList.join(",");
      let startTime = this.queryParams.time[0] || "";
      let endTime = this.queryParams.time[1] || "";
      let url = '/msla/kit/order/export';
      let paramObj = { 
        orderNumber: this.queryParams.orderNumber,
        orderState: this.queryParams.orderState,
        companyName: this.queryParams.companyName,
        startTime: startTime,
        endTime: endTime,
        ids: ids,
        responseTypeBlob: true
      }
      const loading = this.$loading({
        lock: true,
        text: "模板下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.requestMethodGet(url, paramObj).then(res => {
        loading.close();
        let data = res.data;
        let fileReader = new FileReader();
        let that = this;
        fileReader.onload = function() {
          try {
            let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
            if (jsonData.code) {
              that.$message({
                message: jsonData.msg,
                type: "error"
              });
              return;
            }
          } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            const blob = new Blob([res.data], {
              type: "application/vnd.ms-excel"
            });
            const objectUrl = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = objectUrl;
            link.setAttribute("download", "订单管理.xls");
            document.body.appendChild(link);
            link.click();
          }
        };
        fileReader.readAsText(data);
      })
      .catch(res => {
        loading.close();
      });
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
    // page change  事件
    handleEvaluateCurrentChange(page) {
      this.evaluatePagenation.current = page;
      this.getTrainTrackList();
    },
    // size change 事件
    handleEvaluateSizeChange(size) {
      this.evaluatePagenation.size = size;
      this.evaluatePagenation.current = 1;
      this.getTrainTrackList();
    },
    handleEdit(row) {
      this.$router.push({
        path: "/Train/EditTrain",
        query: {
          trainId: row.id
        }
      });
    },
    handleConfig() {
      this.formData.type = [];
      if (this.$refs["formData"]) {
        this.$refs["formData"].clearValidate();
      }
      this.getServiceConfHasEntrance();
      this.configDialogFlag = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            serviceNumberList: this.formData.type
          };
          this.requestMethodPost("/web/config/serviceConfiguration/updateTrainEntrance", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "保存成功",
                  type: "success"
                });
                this.configDialogFlag = false;
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
        } else {
          return false;
        }
      });
    },
    getServiceConfHasEntrance() {
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfHasEntrance", {})
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.formData.type = res.data;
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
    handleDrawer(row) {
      this.trainName = row.trainName;
      this.trainId = row.id;
      this.selectTime = 7;
      this.getTrainDataInfo();
      this.getTrainDataDetails();
      this.drawer = true;
      setTimeout(() => {
        this.initDataChart();
        this.initTestChart();
      }, 200);
    },
    // 获取数据统计课程数据概况详情
    getTrainDataInfo(trainId) {
      this.requestMethodGet("/train/getTrainDataInfo", { trainId: this.trainId })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.trainDataInfo = res.data;
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
    // 获取有效观看人数和测试参与人数
    getTrainParticipantInfo(val) {
      this.trainParticipantLoading = true;
      this.requestMethodGet("/train/getTrainParticipantInfo", { trainId: this.trainId, isTest: val, ...this.trainParticipantPagenation })
        .then(res => {
          res = res.data;
          this.trainParticipantLoading = false;
          if (res.code == 1000) {
            this.trainParticipantList = res.data.list;
            this.trainParticipantTotal = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.trainParticipantLoading = false;
        });
    },
    //  参与人数page改变事件
    handleTrainParticipantCurrentChange(page) {
      this.trainParticipantPagenation.current = page;
      this.getTrainParticipantInfo(this.personTitle == "有效观看人数" ? 0 : 1);
    },
    // 参与人数size改变事件
    handleTrainParticipantSizeChange(size) {
      this.trainParticipantPagenation.size = size;
      this.trainParticipantPagenation.current = 1;
      this.getTrainParticipantInfo(this.personTitle == "有效观看人数" ? 0 : 1);
    },
    // 参与人数趋势图
    async initDataChart(val) {
      const chart = this.$refs.dataChart;
      const myChart = echarts.init(chart);
      let params = {
        trainId: this.trainId,
        startTime: this.chartTime ? this.chartTime[0] : "",
        endTime: this.chartTime ? this.chartTime[1] : ""
      };
      this.chartLoading = true;
      if (val == "date") {
        this.selectTime = "";
      } else {
        this.chartTime = [];
      }
      switch (this.selectTime) {
        case 7:
          params.startTime = this.moment(new Date())
            .add("days", -7)
            .format("YYYY-MM-DD");
          params.endTime = this.moment(new Date()).format("YYYY-MM-DD");
          break;
        case 30:
          params.startTime = this.moment(new Date())
            .add("days", -30)
            .format("YYYY-MM-DD");
          params.endTime = this.moment(new Date()).format("YYYY-MM-DD");
          break;
        default:
          break;
      }
      let datetimeList,
        testPeopleNumberList,
        totalPeopleNumberList = [];
      await this.requestMethodGet("/train/getTrainPeopleNumber", params)
        .then(res => {
          res = res.data;
          this.chartLoading = false;
          if (res.code == 1000) {
            datetimeList = res.data.datetimeList;
            testPeopleNumberList = res.data.testPeopleNumberList;
            totalPeopleNumberList = res.data.totalPeopleNumberList;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.chartLoading = false;
        });

      let option = {
        color: ["#1a91ff", "#31c25c"],
        tooltip: {
          trigger: "axis"
        },
        legend: {
          icon: "circle",
          itemHeight: 8,
          itemWidth: 8,
          data: ["总参与人数", "测试参与人数"]
        },
        grid: {
          left: "5%",
          right: "5%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: datetimeList
        },
        yAxis: {
          name: "人数",
          type: "value",
          // 坐标轴内线的样式
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ccc",
              type: "none"
            }
          }
        },
        series: [
          {
            name: "总参与人数",
            type: "line",
            data: totalPeopleNumberList
          },
          {
            name: "测试参与人数",
            type: "line",
            data: testPeopleNumberList
          }
        ]
      };
      myChart.clear();
      myChart.setOption(option, true);
    },
    // 打分结果占比图
    async initTestChart() {
      const chart = this.$refs.testChart;
      const myChart = echarts.init(chart);
      let dataList = [];
      await this.requestMethodGet("/train/getTrainGradeInfo", { trainId: this.trainId })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            dataList = res.data.map(item => {
              return {
                value: item.peopleNumber,
                name: item.starNumber == 1 ? "1星-很差" : item.starNumber == 2 ? "2星-较差" : item.starNumber == 3 ? "3星-还行" : item.starNumber == 4 ? "4星-推荐" : "5星-力荐"
              };
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
      let option = {
        color: ["#3ba1ff", "#37cbcb", "#4fcb74", "#fbd438", "#f2647c"],
        tooltip: {
          show: true,
          formatter: params => {
            return ` ${params.seriesName}<br/>${params.marker} ${params.data.name}：${params.percent}%`;
          }
        },
        series: [
          {
            name: "打分结果占比",
            type: "pie",
            radius: ["40%", "70%"],
            data: dataList,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b} : {d}%"
                },
                labelLine: { show: true }
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      myChart.clear();
      myChart.setOption(option, true);
    },
    getTrainDataDetails() {
      this.trainChapterList = [];
      this.requestMethodGet("/train/getTrainDataDetails", { trainId: this.trainId })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.trainChapterList = res.data;
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
    showPersonList(name, val) {
      this.getTrainParticipantInfo(val);
      this.personTitle = name;
      this.trainParticipantPagenation.size = 10;
      this.trainParticipantPagenation.current = 1;
      this.personDialogFlag = true;
    },
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 230
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue == 'status'){
        this.queryParams[obj.paramValue] = searchVal.toString()
      }else{
        this.queryParams[obj.paramValue] = searchVal
      }
      this.pagenation.current = 1;
      this.getOrderManagementData(); // 获取列表
    },
    // 重置
    handleClearSearch () {
      this.queryParams.trainName = ''
      this.queryParams.status = ''
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.pagenation.current = 1;
      this.getOrderManagementData(); // 获取列表
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight()
    });
  }
};
</script>
<style lang="less">
@import "../../assets/css/customTable.less";
.train {
  height: 100%;
  width: calc(100% - 40px);
  margin: 0 auto;
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
