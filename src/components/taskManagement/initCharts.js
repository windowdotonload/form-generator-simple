import * as echarts from "echarts";

export function initTrendLineChart(ID, data) {
  let chartDom = document.getElementById(ID);
  let myChart = echarts.init(chartDom);
  let option;

  const xAxisData = data[0].oilConsumptionTrendDtos.map(item => item.date);
  const yData = {};
  data.map(item => {
    yData[item.oilTrendType] = item.oilConsumptionTrendDtos.map(item => item.totalAmount);
  });

  option = {
    tooltip: {
      trigger: "axis"
    },
    legend: {
      data: ["用油量(L)", "加油量(L)", "换油量(L)", "加脂量(KG)"]
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
      data: xAxisData
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "用油量(L)",
        type: "line",
        data: yData[4]
      },
      {
        name: "加油量(L)",
        type: "line",
        data: yData[2]
      },
      {
        name: "换油量(L)",
        type: "line",
        data: yData[1]
      },
      {
        name: "加脂量(KG)",
        type: "line",
        data: yData[3]
      }
    ]
  };

  option && myChart.setOption(option);
}

export function initPieChart(ID, data) {
  const pieData = data
    .filter(item => item)
    .filter(item => item.totalAmount)
    .map(item => {
      return {
        value: item.totalAmount,
        name: item.oilBrandName,
        code: item.oilBrandCode
      };
    });

  let chartDom = document.getElementById(ID);
  let myChart = echarts.init(chartDom);
  let option;

  option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}"
    },
    legend: {
      orient: "vertical",
      left: "right"
    },
    color: ["#001450", "#dd0000", "#008888", "#ff9900", "#ccddff", "#cccccc"],
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: pieData,
        labelLine: false,
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

  option && myChart.setOption(option);
}
