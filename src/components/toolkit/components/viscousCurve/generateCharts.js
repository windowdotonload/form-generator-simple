function xAxis() {
  const res = [];
  let startNum = -40;
  while (startNum <= 200) {
    res.push(startNum);
    startNum += 20;
  }
  return res;
}

function toNumber(val) {
  Object.keys(val).forEach(key => {
    val[key] = isNaN(Number(val[key])) ? val[key] : Number(val[key]);
  });
  return val;
}

function getBaseLog(x, y) {
  return Number(Math.log(y) / Math.log(x));
}

function handleItemDataKV(data) {
  const { productName, temperature1: Temp_1, temperature2: Temp_2, viscosity1: KV_1, viscosity2: KV_2 } = toNumber(Object.assign({}, data));
  const Z1 = KV_1 + 0.7 + Math.exp(-1.47 - 1.84 * KV_1 - 0.51 * Math.pow(KV_1, 2));
  const Z2 = KV_2 + 0.7 + Math.exp(-1.47 - 1.84 * KV_2 - 0.51 * Math.pow(KV_2, 2));
  const B = (getBaseLog(10, getBaseLog(10, Z1)) - getBaseLog(10, getBaseLog(10, Z2))) / (getBaseLog(10, Temp_2 + 273.15) - getBaseLog(10, Temp_1 + 273.15));
  const A = getBaseLog(10, getBaseLog(10, Z2)) + B * getBaseLog(10, Temp_2 + 273.15);
  return temp => Math.pow(10, Math.pow(10, A - B * getBaseLog(10, temp + 273.15))) - 0.7;
}

export const generateChart = baseData => {
  const chartDom = document.getElementById("echart-box");
  const myChart = echarts.init(chartDom);

  const xAxisData = xAxis();
  const legendData = [];
  const seriesData = [];

  baseData.forEach(item => {
    legendData.push(item.productName);
    item.calcFunc = handleItemDataKV(item);
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
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    xAxis: {
      type: "category",
      // name:''
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
};
