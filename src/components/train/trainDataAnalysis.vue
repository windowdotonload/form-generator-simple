<template>
  <el-drawer title="数据分析" :visible.sync="drawerVisable" :wrapperClosable="false" size="50%" @close="closeDrawerAction" class="train-data-box">
    <div class="train-data-box-container">
      <el-divider style="margin:0" />
      <div class="train-analysis-content">
        <div class="title">课程数据概况</div>
        <div class="train-overview-container" v-loading="overviewLoading">
          <div class="col-5" v-for="item in trainDataAnalysisOverviewConfig" :key="item.mapKey">
            <div class="grid-content">
              <div class="name">
                {{ item.title }}
                <el-tooltip :content="item.tip" effect="light" placement="top">
                  <i class="el-icon-info" style="font-size:14px;margin-left:8px;color:#ccc"></i>
                </el-tooltip>
              </div>
              <div class="number" :style="{ 'text-decoration': item.needShowDetail ? 'underline' : '', cursor: item.needShowDetail ? 'pointer' : '' }" @click="showDetail(item)">
                {{ item.total || 0 }}
              </div>
            </div>
          </div>
        </div>

        <el-form ref="form" :model="filterForm" style="display:flex" class="filter-form-container">
          <el-form-item label="培训类型：" style="display:flex;margin-right:16px">
            <el-select :disabled="chartLoading" v-loading="typeListLoading" v-model="filterForm.trainType" placeholder="全部" size="mini" clearable>
              <el-option v-for="item in typeList" :key="item.id" :label="item.typeName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="指标名称：" style="display:flex">
            <el-select :disabled="chartLoading" v-loading="targetListLoading" v-model="filterForm.trainTarget" @change="changeSelTarget" placeholder="全部" size="mini">
              <el-option v-for="item in targetList" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
        </el-form>

        <div>
          <div class="title" style="display:flex;justify-content: space-between;align-items:center;">
            课程数据统计（TOP5）
            <div>
              <el-radio-group :disabled="chartLoading" v-model="filterForm.selectTime" fill="#001450" size="small" @change="switchTimeType($event, 'radio')">
                <el-radio-button :label="7">近7天</el-radio-button>
                <el-radio-button :label="30">近30天</el-radio-button>
              </el-radio-group>
              <el-date-picker
                :disabled="chartLoading"
                v-model="filterForm.chartTime"
                clearable
                size="small"
                class="date-picker"
                type="daterange"
                value-format="yyyy-MM-dd"
                style="width:260px;margin-left:10px"
                @change="switchTimeType($event, 'date')"
                @cleard="clearDatePicker"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </div>
          </div>

          <div class="chart-box" v-loading="chartLoading">
            <span class="chart-unit">单位：{{ chartUnit }}</span>
            <div ref="dataChart" class="chart-content" />
            <div v-show="yAxisTipText" class="y-tooltip" ref="yAxisTip" :style="yAxisTipStyle">{{ yAxisTipText }}</div>
          </div>
        </div>
        <el-button plain type="danger" size="mini" style="margin:20px 5px" @click="req_exportData">导出数据分析</el-button>
      </div>
    </div>

    <el-dialog :title="detailTableTitle" :visible.sync="detailDialogVisible" width="50%" :before-close="handleCloseDetailTable" append-to-body>
      <el-table ref="accountTable" v-loading="tableLoading" :data="detailTableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }">
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
        :current-page="trainOverViewPagenation.current"
        :page-size="trainOverViewPagenation.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="trainOverviewTableTotal"
        style="position:static;text-align:right;margin-top:20px"
      ></el-pagination>
    </el-dialog>
  </el-drawer>
</template>

<script>
import { trainDataAnalysisOverviewConfig, trainDataAnalysisOverviewMap } from "./config";
import { baseRemoteOauth2 } from "@/api/api";
import debounce from "lodash/debounce";
export default {
  props: {
    drawerVisable: {
      type: Boolean,
      default: false
    },
    closeDrawer: Function
  },
  data() {
    return {
      trainDataAnalysisOverviewConfig,
      detailDialogVisible: false,
      detailTableData: [],
      detailTableColumns: [],
      tableLoading: false,
      detailTableTitle: "",
      trainOverviewTableTotal: 0,
      chartLoading: false,
      selectOptins: [],
      typeListLoading: false,
      targetListLoading: false,
      chartLoading: false,
      overviewLoading: false,
      typeList: [],
      targetList: [],
      targetUnitMap: {},
      chartUnit: "人数",
      yAxisTipStyle: {},
      yAxisTipText: null,
      chartRecord: null,
      tempRecordTargetCode: null,
      trainOverViewPagenation: {
        current: 1,
        size: 10
      },
      filterForm: {
        trainType: "",
        trainTarget: "train_target_1",
        selectTime: 7,
        chartTime: []
      }
    };
  },
  async mounted() {
    await this.initReqs();
    this.generateDataChart();
  },
  beforeDestroy() {
    this.chartRecord = null;
  },
  watch: {
    filterForm: {
      handler: debounce(function() {
        this.generateDataChart();
      }, 10),
      deep: true
    }
  },
  methods: {
    initReqs() {
      this.req_getTranOverview();
      this.req_getTypeList();
      this.req_getTargetList();
    },
    getFilterTime() {
      let startTime, endTime;
      if (this.filterForm.chartTime && this.filterForm.chartTime.length) {
        startTime = this.filterForm.chartTime[0];
        endTime = this.filterForm.chartTime[1];
      } else {
        const oneDay = 24 * 60 * 60 * 1000;
        endTime = this.moment(new Date() - oneDay).format("yyyy-MM-DD");
        startTime = this.moment(new Date() - oneDay * this.filterForm.selectTime).format("yyyy-MM-DD");
      }
      return { startTime, endTime };
    },
    async req_getChartData() {
      const { startTime, endTime } = this.getFilterTime();
      const params = {
        trainType: this.filterForm.trainType || null,
        targetCode: this.filterForm.trainTarget,
        startTime,
        endTime
      };
      const res = await this.requestMethodGetTip("/train/getTrainDataTop5", params);
      return res;
    },
    async req_getTranOverview() {
      this.overviewLoading = true;
      const res = await this.requestMethodGetTip("/train/getTrainDataCollect");
      this.trainDataAnalysisOverviewConfig.forEach(item => {
        item.total = res.data.data[trainDataAnalysisOverviewMap[item.mapKey]];
      });
      this.overviewLoading = false;
    },
    async req_getTypeList() {
      this.typeListLoading = true;
      const res = await this.requestMethodGetTip("/train/queryTrainTypeList");
      this.typeList = res.data.data;
      this.typeListLoading = false;
    },
    async req_getTargetList() {
      this.targetListLoading = true;
      const res = await this.requestMethodGetTip("/train/getTrainTargetDropDownList");
      this.targetList = res.data.data;
      this.handleTargetUnitMap(res.data.data);
      this.targetListLoading = false;
    },
    async req_getOverviewDetailAndAssignTable(targetCode) {
      this.tableLoading = true;
      const params = {
        targetCode: targetCode || this.tempRecordTargetCode,
        ...this.trainOverViewPagenation
      };
      const res = await this.requestMethodGetTip("/train/getTrainDataUserInfoByPage", params);
      this.detailTableData = res.data.data.list;
      this.trainOverviewTableTotal = res.data.data.totalCount;
      this.tableLoading = false;
    },
    async req_exportData() {
      const { startTime, endTime } = this.getFilterTime();
      this.FULLSCREENLOADING("加载中...");
      let url = '/train/trainDataExport';
      let paramObj = { 
        startTime:startTime,
        endTime:endTime,
        responseTypeBlob: true
      }
      this.requestMethodGet(url, paramObj).then(res => {
        let data = res.data;
        let fileReader = new FileReader();
        let that = this;
        const name = "数据分析表.xlsx";
        this.FULLSCREENENDLOADING();
        fileReader.onload = function() {
          try {
            let jsonData = JSON.parse(this.result);
            if (jsonData.code) {
              that.$message({
                message: jsonData.msg,
                type: "error"
              });
              return;
            }
          } catch (err) {
            const blob = new Blob([res.data], {
              type: "application/vnd.ms-excel"
            });

            const objectUrl = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = objectUrl;
            link.setAttribute("download", name);
            document.body.appendChild(link);
            link.click();
          }
        };
        fileReader.readAsText(data);
      })
      .catch(res => {
      });
    },
    closeDrawerAction() {
      this.closeDrawer();
    },
    handleTargetUnitMap(targetListData) {
      targetListData.forEach(item => {
        this.targetUnitMap[item.code] = item.unit;
      });
    },
    changeSelTarget(val) {
      this.chartUnit = this.targetUnitMap[val] || "--";
    },
    async showDetail(item) {
      if (!item.needShowDetail) return;
      this.detailDialogVisible = true;
      this.detailTableTitle = item.title;
      this.tempRecordTargetCode = item.targetCode;
      await this.req_getOverviewDetailAndAssignTable(item.targetCode);
    },
    handleCloseDetailTable() {
      this.tempRecordTargetCode = null;
      this.trainOverViewPagenation = {
        current: 1,
        size: 10
      };
      this.trainOverviewTableTotal = 0;
      this.detailTableData = [];
      this.detailDialogVisible = false;
    },
    handleTrainParticipantSizeChange(val) {
      this.trainOverViewPagenation.size = val;
      this.req_getOverviewDetailAndAssignTable();
    },
    handleTrainParticipantCurrentChange(val) {
      this.trainOverViewPagenation.current = val;
      this.req_getOverviewDetailAndAssignTable();
    },
    switchTimeType(e, val) {
      if (!e && val == "date") {
        return (this.filterForm.selectTime = 7);
      }
      if (val == "date") {
        this.filterForm.selectTime = "";
      } else {
        this.filterForm.chartTime = [];
      }
    },
    async generateDataChart() {
      this.chartLoading = true;
      const res = await this.req_getChartData();
      this.chartLoading = false;

      const yAxisData = [];
      const seriesData = [];
      const chartData = res.data.data;
      chartData.forEach(data => {
        yAxisData.push(data.name);
        seriesData.push(data.count);
      });

      const myChart = echarts.init(this.$refs.dataChart);
      this.chartRecord = myChart;
      const option = {
        title: {
          show: !res.data.data.length,
          textStyle: {
            color: "#000",
            fontSize: 18
          },
          text: "暂无数据",
          left: "center",
          top: "center"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          show: res.data.data.length,
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed"
            }
          }
        },
        yAxis: {
          show: res.data.data.length,
          triggerEvent: true,
          type: "category",
          data: yAxisData.reverse(),
          axisLabel: {
            formatter(val) {
              return val.toString().length > 20 ? val.substr(0, 20) + "..." : val;
            }
          }
        },
        series: [
          {
            type: "bar",
            barMaxWidth: "40%",
            data: seriesData.reverse(),
            itemStyle: {
              color: "#0c479d"
            }
          }
        ]
      };
      this.extension(myChart);
      option && myChart.setOption(option);
    },
    extension(chart2) {
      chart2.on("mouseover", params => {
        if (params.componentType == "yAxis") {
          this.yAxisTipText = params.value;

          const cssObj = {
            position: "absolute",
            left: params.event.event.offsetX - 60 + "px",
            top: params.event.event.offsetY - 50 + "px",
            "font-size": "12px",
            "box-shadow": "rgba(0, 0, 0, 0.3) 2px 2px 8px"
          };
          this.yAxisTipStyle = cssObj;
        }
      });
      chart2.on("mouseout", params => {
        if (params.componentType == "yAxis") {
          this.yAxisTipStyle = {};
          this.yAxisTipText = null;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.train-data-box {
  /deep/ .el-drawer__header {
    margin-bottom: 0;
  }
  /deep/ .el-drawer__header {
    font-size: 18px;
    color: #000;
    line-height: 26px;
    margin-bottom: 8px !important;
  }
  /deep/ .el-divider--horizontal {
    margin: 0;
    margin-bottom: 10px;
  }
  .filter-form-container {
    /deep/ .el-loading-spinner .circular {
      width: 20px !important;
      height: 20px !important;
      margin-top: 6% !important;
    }
  }
}
.train-analysis-content {
  position: relative;
  width: 100%;
}
.train-data-box-container {
  box-sizing: border-box;
  padding: 0 20px;
  height: calc(100vh - 60px);
  overflow: auto;
}
.title {
  font-size: 16px;
  color: #000;
  font-weight: bold;
  margin-bottom: 20px;
}
.grid-content {
  background: rgba(204, 221, 255, 0.2);
  padding: 20px;
}
.train-overview-container {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
}
.col-5 {
  width: 23%;
  margin-right: 10px;
  border: 1px solid rgba(204, 221, 255, 0.8);
  border-radius: 6px;
  margin-bottom: 10px;
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
    user-select: none;
  }
}
.chart-box {
  box-sizing: border-box;
  position: relative;
  height: 350px;
  width: 100%;
  background: #f6f9ff;
  border-radius: 10px;
}
.chart-unit {
  position: absolute;
  top: 10px;
  z-index: 999;
  font-size: 13px;
  right: 18px;
  color: #666;
}
.chart-content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.y-tooltip {
  box-sizing: border-box;
  position: absolute;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(48, 49, 51, 0.8);
  color: #fff;
  padding: 13px;
  border-radius: 5px;
  line-height: 20px;
  height: 20px;
}
</style>
