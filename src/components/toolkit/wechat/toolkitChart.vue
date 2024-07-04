<template>
  <div class="charts-container" style="position: relative">
    <div id="echart-box-wechat" class="chart-show-box"></div>
    <div class="xText">温度（℃）</div>
    <div class="yText">黏度（cSt）</div>
    <div class="xTip">该黏温曲线图仅在温度高于倾点20°C以上时有效。</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      calcInfo: null
    };
  },
  created() {
    this.calcInfo = JSON.parse(decodeURIComponent(location.hash.split("?")[1].split("=")[1]));
  },
  mounted() {
    if (Array.isArray(this.calcInfo) && this.calcInfo.length > 0) {
      this.generateChart(this.calcInfo);
    }
  },
  methods: {
    xAxis() {
      const res = [];
      let startNum = -40;
      while (startNum <= 200) {
        res.push(startNum);
        startNum += 20;
      }
      return res;
    },

    toNumber(val) {
      Object.keys(val).forEach(key => {
        val[key] = isNaN(Number(val[key])) ? val[key] : Number(val[key]);
      });
      return val;
    },

    getBaseLog(x, y) {
      return Number(Math.log(y) / Math.log(x));
    },

    handleItemDataKV(data) {
      const { productName, Temp_1, Temp_2, KV_1, KV_2 } = this.toNumber(data);
      const Z1 = KV_1 + 0.7 + Math.exp(-1.47 - 1.84 * KV_1 - 0.51 * Math.pow(KV_1, 2));
      const Z2 = KV_2 + 0.7 + Math.exp(-1.47 - 1.84 * KV_2 - 0.51 * Math.pow(KV_2, 2));
      const B = (this.getBaseLog(10, this.getBaseLog(10, Z1)) - this.getBaseLog(10, this.getBaseLog(10, Z2))) / (this.getBaseLog(10, Temp_2 + 273.15) - this.getBaseLog(10, Temp_1 + 273.15));
      const A = this.getBaseLog(10, this.getBaseLog(10, Z2)) + B * this.getBaseLog(10, Temp_2 + 273.15);
      return temp => Math.pow(10, Math.pow(10, A - B * this.getBaseLog(10, temp + 273.15))) - 0.7;
    },

    generateChart(baseData) {
      const chartDom = document.getElementById("echart-box-wechat");
      const myChart = echarts.init(chartDom);

      const xAxisData = this.xAxis();
      const legendData = [];
      const seriesData = [];

      baseData.forEach(item => {
        legendData.push(item.productName);
        item.calcFunc = this.handleItemDataKV(item);
        const itemData = [];
        xAxisData.forEach(data => {
          itemData.push(item.calcFunc(data));
        });
        seriesData.push({
          name: item.productName,
          smooth: true,
          type: "line",
          data: itemData
        });
      });

      const option = {
        tooltip: {
          trigger: "axis"
        },
        legend: { data: legendData },
        color: ["#001450", "#dd0000", "#008888", "#ff9900", "#ccddff", "#cccccc"],
        grid: {
          left: "2%",
          // right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData
        },
        yAxis: {
          type: "log",
          min: 1,
          logBase: 10
        },
        series: seriesData
      };
      option && myChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.chart-show-box {
  position: relative;
  width: 100vw;
  min-height: 390px;
}
.charts-container {
  box-sizing: border-box;
  padding: 10px 0;
  padding-bottom: 60px;
  width: 96vw;
  margin: 10px auto;
  overflow: hidden;
  border-radius: 6px;
  background: #e9e9e9;
}
.xText {
  position: absolute;
  font-size: 12px;
  left: 50%;
  transform: translateX(-50%) scale(0.8);
  font-weight: bolder;
  color: #000;
}
.yText {
  position: absolute;
  font-size: 12px;
  top: 50%;
  left: -23px;
  transform: rotate(-90deg) scale(0.9);
  font-weight: bolder;
  color: #000;
}
.xTip {
  width: 100%;
  text-align: center;
  position: absolute;
  font-size: 12px;
  left: 50%;
  transform: translateX(-50%);
  color: #000;
  bottom: 10px;
}
</style>
