<template>
  <div class="drawer-analysis-container" v-loading="hoverLoading">
    <el-drawer title="数据分析" :visible="dataAnalysisVis" size="50%" :wrapperClosable="false" @close="closeAnalysis" append-to-body>
      <div class="data-alalysis-container">
        <div style="font-weight: bolder;">问答访问人数统计（TOP 5）</div>
        <div class="filter-section">
          <el-form style="display:flex;width:100%;align-items:center">
            <el-form-item style="width:30%">
              <template #label>
                <span>一级分类：</span>
              </template>
              <el-select clearable filterable @clear="clearIdLv2Options" placeholder="全部" size="mini" style="width:65%" v-model="queryChartsParams.idLv1">
                <el-option @click.native="selIdLv1Item(item)" v-for="item in idLv1Options" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width:30%">
              <template #label>
                <span>二级分类：</span>
              </template>
              <el-select clearable filterable placeholder="全部" size="mini" style="width:65%" v-model="queryChartsParams.idLv2" :disabled="!queryChartsParams.idLv1">
                <el-option v-for="item in idLv2Options" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="sec-bar">
            <div class="num-box">
              <span @click="switchDateNum(1)" :class="queryChartsParams.dataType == 1 ? 'num-active' : ''">总点击数（PV）</span>
              <span @click="switchDateNum(2)" :class="queryChartsParams.dataType == 2 ? 'num-active' : ''">总访客数（UV）</span>
            </div>
            <div style="display:flex;justify-content:flex-end;flex-wrap:nowrap;width:70%">
              <el-radio-group v-model="queryChartsParams.timeType" size="mini" style="margin-right:15px">
                <el-radio-button :label="1">近7天</el-radio-button>
                <el-radio-button :label="2">近30天</el-radio-button>
              </el-radio-group>
              <el-date-picker
                clearable
                @change="changeDate"
                style="width:50%"
                size="mini"
                v-model="DateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
          </div>
        </div>
        <div style="width:100%;display:flex;justify-content:center">
          <div class="chart-show-box" id="QAChart" v-loading="chartLoading" />
        </div>
        <el-button size="mini" type="danger" @click="exportData" plain style="margin-top:20px">导出分析数据</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { queryChartsData, getChartSelectData, getChartSelectDataDropDown } from "../api/LubQA";
import { baseRemoteOauth2 } from "@/api/api";
export default {
  props: {
    dataAnalysisVis: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    drawerVis() {
      return this.dataAnalysisVis;
    }
  },
  created() {
    this.getSelectOptions(1);
    this.queryChartsData();
  },
  data() {
    return {
      queryChartsParams: {
        idLv1: "",
        idLv2: "",
        dataType: 1,
        timeType: 1
      },
      idLv1Options: [],
      idLv2Options: [],
      dataNum: "",
      DateRange: [],
      chartsData: null,
      hoverLoading: false,
      chartLoading: false,
      eChartInstance: null
    };
  },
  watch: {
    queryChartsParams: {
      handler() {
        this.$nextTick(() => {
          if (!this.dataAnalysisVis) return;
          this.queryChartsData();
        });
      },
      deep: true
    }
  },
  methods: {
    clearIdLv2Options() {
      this.queryChartsParams.idLv2 = "";
      this.idLv2Options = [];
    },
    async getSelectOptions(level) {
      const params = {
        level,
        size: 300
      };
      const options = await getChartSelectDataDropDown(params);
      const key = `idLv${level}Options`;
      this[key] = options.data.data;
    },
    async selIdLv1Item(item) {
      this.idLv2Options = [];
      this.queryChartsParams.idLv2 = "";
      const params = {
        idLv1: item.id,
        level: 2,
        size: 300
      };
      const options = await getChartSelectDataDropDown(params);
      this.idLv2Options = options.data.data;
    },
    changeDate(val) {
      if (!val) {
        this.queryChartsParams.timeType = 1;
        delete this.queryChartsParams.startTime;
        delete this.queryChartsParams.endTime;
      } else {
        const startTime = this.moment(val[0]).format("yyyy-MM-DD");
        const endTime = this.moment(val[1]).format("yyyy-MM-DD");
        this.queryChartsParams.startTime = startTime;
        this.queryChartsParams.endTime = endTime;
        this.queryChartsParams.timeType = null;
      }
      this.queryChartsData();
    },
    async exportData() {
      this.hoverLoading = true;
      let url = '/knowledge/base/exportAnalysisChart'
      this.queryChartsParams.responseTypeBlob = true
      this.requestMethodGet(url, this.queryChartsParams).then(res => {
        let fileReader = new FileReader();
        let that = this;
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
            link.setAttribute("download", "导出分析数据.xlsx");
            document.body.appendChild(link);
            link.click();
            that.$message({
              message: "下载成功",
              type: "success"
            });
            this.hoverLoading = false;
          }
        };
        fileReader.readAsText(res.data);
        })
        .catch(res => {
          this.hoverLoading = false;
        });
    },
    closeAnalysis() {
      if (this.eChartInstance) {
        this.eChartInstance.clear();
        this.eChartInstance = null;
      }
      this.$emit("closeAnalysis");
    },
    async queryChartsData() {
      this.chartLoading = true;
      this.chartsData = null;
      if (this.eChartInstance) this.eChartInstance.clear();
      const data = await queryChartsData(this.queryChartsParams);
      this.chartsData = data.data.data;
      await this.InitChart("QAChart", this.chartsData);
      this.chartLoading = false;
    },
    switchDateNum(dataType) {
      this.queryChartsParams.dataType = dataType;
    },
    InitChart(ID, data) {
      let chartDom = document.getElementById(ID);
      let myChart = echarts.init(chartDom);
      if (!chartDom || !myChart) return;
      this.eChartInstance = myChart;
      let option;

      const { xaxis, yaxis } = data;
      if (yaxis.length == 0 || !yaxis) {
        option = {
          title: {
            text: "暂无数据",
            x: "center",
            y: "center",
            textStyle: {
              fontSize: 16,
              fontWeight: "oblique"
            }
          }
        };

        option && myChart.setOption(option);
        return;
      }
      const legendNames = yaxis.map((item, i) => item.name + "-" + i);

      yaxis.forEach((item, i) => {
        item.name = legendNames[i];
        item.type = "line";
      });

      option = {
        tooltip: {
          trigger: "axis",
          position(pos, params) {
            if (params.componentType == "legend") {
              return [pos[0] + 10, pos[1] + 10];
            }
          }
        },
        legend: {
          tooltip: {
            show: true,
            formatter(params) {
              return params.name.split("-")[0];
            }
          },
          type: "scroll",
          data: legendNames,
          formatter: function(name) {
            return name.split("-")[0].length <= 30 ? name.split("-")[0] : name.split("-")[0].substr(0, 30) + "...";
          }
        },
        color: ["#001450", "#dd0000", "#008888", "#ff9900", "#ccddff", "#cccccc"],
        grid: {
          left: "2%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xaxis
        },
        yAxis: {
          type: "value"
        },
        series: yaxis
      };

      option && myChart.setOption(option);
    }
  }
};
</script>

<style lang="less" scoped>
.data-alalysis-container {
  padding: 20px;
  height: 100%;

  /deep/ .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background: #001450;
    border-color: #001450;
  }
}
.drawer-analysis-container {
  /deep/ .el-drawer__header {
    margin-bottom: 10px;
  }
}
.filter-section {
  margin-top: 20px;
  box-sizing: border-box;
  width: 100%;
}
.sec-bar {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.num-box {
  width: 28%;
  display: flex;
  justify-content: space-between;
  display: flex;
  position: relative;
  span {
    width: 50%;
    display: flex;
    justify-content: center;
    font-size: 13px;
    color: #999;
    border-bottom: 1px solid#999;
    cursor: pointer;
  }
}
.num-active {
  color: #d10000 !important;
  border-bottom: 1px solid #d10000 !important;
}
.chart-show-box {
  background: rgba(233, 233, 233, 0.3);
  margin-top: 30px;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  width: 95%;
  border-radius: 16px;
  min-height: 390px;
  overflow: auto;
}
::-webkit-scrollbar {
  height: 3px !important;
  width: 3px !important;
}
</style>
