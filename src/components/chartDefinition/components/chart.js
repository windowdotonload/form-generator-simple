// 图表配置
	export default {
	  data() {
		  return {};
	  },
	  methods: {
      // 柱状折线
    handlerUserCharts(ele,chartData,code){
      // 绘制图表
        ele.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data: code =='dimension_code15'?['登录人数', '登录人数百分比']:['深度活跃用户人数','深度活跃用户百分比']
          },
          xAxis: {
            name: '月份',
            type: 'category',
            data: chartData.xaxis,
            axisPointer: {
              type: 'shadow'
            },
            nameTextStyle: {
              align: 'left',
              padding: [60, 80, 50, 10]
            },
            nameRotate: -45,
            nameGap: -5
          },
          yAxis: [
            {
              type: 'value',
              name: code =='dimension_code15'?'登录人数':'深度活跃用户人数',
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: code =='dimension_code15'?'登录人数百分比':'深度活跃用户百分比',
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
              name: code =='dimension_code15'?'登录人数':'深度活跃用户人数',
              type: 'bar',
              itemStyle:{
                color:'#61a0a8'
              },
              data: chartData.yAxisUserNum
            },

            {
              name: code =='dimension_code15'?'登录人数百分比':'深度活跃用户百分比',
              type: 'line',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: function (value) {
                  return value + ' %';
                }
              },
              data: chartData.yAxisUserPercent
            }
          ]
        });
    },
    // 堆叠折线
    handlerUserStackChart(ele,chartData,code){
      ele.setOption({
        color: ['#ccddff', '#008888', '#ff9900'], // 柱子的颜色，几个柱子就可以设置几个颜色
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                  type: 'line',
                  label: {
                      backgroundColor: '#6a7985'
                  }
              }
          },
          legend: {
              top: 8,
              itemWidth: 10,
              itemHeight: 10,
              data: chartData.legendList
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [
              {
                  type: 'category',
                  axisLabel: {
                      color: '#999999',
                  },
                  axisLine: {show: true},
                  axisTick: {show: true},
                  boundaryGap: ['20%', '20%'],
                  data:  chartData.xaxis
              }
          ],
          yAxis: [
              {
                  type: 'value',
                  name: code == 'dimension_code19' ? '服务项数量' :'登录人数',
                  axisLabel: {
                    formatter: '{value}'
                  }
              }, {
                  type: 'value',
                  name: code == 'dimension_code15'?'登录人数百分比': code == 'dimension_code19' ? '服务项完成率' : '深度活跃用户百分比',
                  axisLabel: {
                    interval: 'auto',
                    formatter: '{value} %'
                  }
              }
          ],
          series: chartData.yaxis
      })
    },
    // 环状图配置
    handleRingChart(ele,chartData){
      const that = this
      ele.setOption({
          tooltip : {
              trigger: 'item',
              formatter: "{b} : {d}%"
          },
          legend: {
            top: '2%',
            left: 'center'
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: true,
              label: {
                show: true,
                position: 'outside'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '18',
                }
              },
              data: chartData,
              itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    normal:{
                        label:{
                            show: true,
                            formatter: '{b} : {d}%'
                        },
                        labelLine :{show:true}
                    }
                }
            }
          ]
        })
        // 客户-行业分布		时间下拉刷新(选择全部时间后点击弹出折线图)
        // 设备-行业分布		时间下拉刷新(选择全部时间后点击弹出折线图)
        ele.on('click',function(params){
          that.ringParams = JSON.parse(JSON.stringify(that.chartParams))
          that.ringParams.chartDimensionCode = params.data.type
          that.ringParams.industryCode = params.data.code
          that.dialogTitle = params.data.name
          if(params.data.code &&  params.data.name.indexOf('其它')<0){
            if(params.data.type=='dimension_code4'){
              if(that.selectMonth1 == ''){
                that.ringParams.primaryIndustryCode = that.selectIndustry1
                that.ringChartVisible = true
              }
            }else if(params.data.type=='dimension_code9'){
              if(that.selectMonth2 == ''){
                that.ringChartVisible = true
              }
            }
          }
        })
    },
    // 饼状图配置
    handlePieChart(ele,chartData,code){
      ele.setOption({
        title: {
          text: code==='dimension_code2' ? '历史累计总数' : '过去90天服务客户覆盖率',
          left: 'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {d}%"
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top:'8%'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: chartData,
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
              }
            },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                normal:{
                  label:{
                      show: true,
                      formatter: '{b} : {d}%'
                  },
                  labelLine :{show:true}
                }
              }
          }
        ]
      })
    },
    // 客户图表
    handleKeyCustomerChart(ele,chartData,yCustomerData,yCustomerPercentData,code){
      let dataName = code=='dimension_code25'? ['客户活跃数', '客户活跃占比'] : code=='dimension_code28'? ['客户新建数', '客户注册率'] : ['客户数', '客户数占比']
      yCustomerPercentData = yCustomerPercentData.map(item => parseFloat(item).toFixed(2))
      ele.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            },
            // formatter: '{b0}<br />{a0}: {c0}<br />{a1}: {c1}%'
            formatter: function (params) {
              let title = `<div>${params[0].name}</div>`
              let li = ``
              params.map(item => {
                li += `<div>${item.marker}${item.seriesName}：${item.value}${item.seriesIndex === 1 ? '%' : ''}</div>`
              })
              return title + li
            }
          },
          legend: {
            data: dataName
          },
          xAxis: {
            name: '',
            type: 'category',
            data: chartData.xaxis,
            axisPointer: {
              type: 'shadow'
            },
          },
          yAxis: [
            {
              type: 'value',
              name: code=='dimension_code23' ? '游客数量': code=='dimension_code25'? '客户活跃数' : code=='dimension_code28'? '客户每月新建数' : '客户数',
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: code=='dimension_code23' ? '游客转化率': code=='dimension_code25'? '客户活跃占比' :  code=='dimension_code28'? '截止每月注册率' :'客户数占比',
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            {
              name: code=='dimension_code23' ? '游客数量': code=='dimension_code25'? '客户活跃数' :code=='dimension_code28'? '客户新建数' : '客户数',
              type: 'bar',
              itemStyle:{
                color:'#61a0a8'
              },
              data: yCustomerData
            },

            {
              name: code=='dimension_code23' ? '游客转化率': code=='dimension_code25'? '客户活跃占比' :  code=='dimension_code28'? '客户注册率' :'客户数占比',
              type: 'line',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: function (value) {
                  return value + ' %';
                }
              },
              data: yCustomerPercentData
            }
          ]
        });
    },
    // 柱状折线图
    handlerColumnarChart(ele,chartData,userType){
      ele.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          top:'3%',
          data: userType=='0' ? ['经销商建立', '客户建立', '隶属pes客户'] : ['客户建立']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: chartData.xaxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '经销商建立',
            type: 'bar',
            barGap: 0,
            data: chartData.yDistributorNum,
            itemStyle: {
              normal: {
                color: '#73A0FA'
              }
            }
          },
          {
            name: '客户建立',
            type: 'bar',
            data: chartData.yCustomerNum,
            itemStyle: {
              normal: {
                color: '#73DEB3'
              }
            }
          },
          {
            name: '隶属pes客户',
            type: 'bar',
            data: chartData.yPesNum,
            itemStyle: {
              normal: {
                color: '#26C9C9'
              }
            }
          }
          ]
      })
    },
    // 折线
    handleBrokenLineChart1(ele,chartData,code){
      let dataTitle = chartData.legendArr[0]
      ele.setOption({
        tooltip: {
          trigger: 'axis',
          formatter:function (param){
            let relVal = param[0].name;
            for (let i = 0;i <param.length; i++) {
              relVal += ', '+param[i].value
            }
            return relVal;
          }
        },
        legend: {
          data: chartData.legendArr,
          top:'3%'
        },
        grid: {
          left: '5%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.xaxis
        },
        yAxis: {
          type: 'value',
          name:dataTitle,
          axisLabel: { formatter: '{value} ' }
        },
        series:[
          {
            data: chartData.yaxis[0].data,
            type: 'line'
          }
        ]
      })
    },
    handleBrokenLineChart(ele,chartData,code){
      ele.setOption({
        tooltip: {
          trigger: 'axis',
          formatter:function (param){
            let relVal = param[0].name;
            for (let i = 0;i <param.length; i++) {
              if(code=='dimension_code14'){//工单服务时长 xdxh
                const value = param[i].value.toString()
                let d = ''
                let h = ''
                let str = ''
                if(Number(value)>0){
                  d = value.split('.')[0]
                  h = ((Number(value)-d)*24).toFixed(2)
                  str = d + 'd' + h + 'h'
                }else{
                  str = '0' + 'd' + '0.00' + 'h'
                }
                relVal += '</br>' + param[i].seriesName + ' : ' + str
              }else{//x%
                relVal += '</br>' + param[i].seriesName + ' : ' + param[i].value + '%'
              }
            }
            return relVal;
          }
        },
        legend: {
          data: chartData.legendArr,
          top:'3%'
        },
        grid: {
          left: '5%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: chartData.xaxis
        },
        yAxis: {
          type: 'value',
          axisLabel: code=='dimension_code14' ? { formatter: '{value} d' } : { formatter: '{value} %' }
        },
        series: chartData.yaxis
      })
    },
    // 堆叠图
    handleStackedChart(ele,chartData){
      ele.setOption({
        color: ['#A9DF96','#748EDE','#81C1DC', '#3488AD', '#00557C',"#357F88","#310937","#F7393C"],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            let totalNumList = chartData.totalNumList || []
            let relVal = params[0].name;
            let total = 0;
            let sum = 1
            if(totalNumList.length>0){
              total = Number(totalNumList[params[0].dataIndex])
            }else{
              for (let j = 0;j < params.length; j++) {
                total += Number(params[j].value)
              }
            }
            for (let i = 0;i <params.length; i++) {
              sum = Number(params[i].value)>0 ? total : 1
              relVal += '</br>' + params[i].seriesName + ' : ' + ((Number(params[i].value) / sum)*100).toFixed(2) + "%"
            }
            return relVal;
          },
        },
        legend: {
          top:'3%'
        },
        xAxis: [
          {
            type: 'category',
            data: chartData.xaxis
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: chartData.yaxis
      })
    },
    // 用户比率
    handlerUserRetainedCharts(ele,chartData,code){
      ele.setOption({
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          center: 'center'
        },
        xAxis: {
          type: 'category',
          splitLine: { show: false },
          data: ['当月','次月','2月后','3月后']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        series: chartData
      })
    },
    // 双环形图配置
    handleRingChartDouble(ele,list1,list2){
      let legenda = list1.map(item=> item.name)
      let legendb = list2.map(item=> item.name)
      ele.setOption({
        title: [
          {
            text: '过去 90 天平均服务工单数占比 (客户行业维度)',
            left: 'center'
          },
          {
            top:'53%',
            text: '过去 90 天平均服务工单数占比 (工单类型维度)',
            left: 'center'
          }
        ],
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c}, {d}%"
        },
        legend: [
          {
            orient: 'horizontal',
            left: 'center',
            top:'5%',
            data:legenda
          },
          {
            orient: 'horizontal',
            left: 'center',
            top:'58%',
            data:legendb
          },
        ],
        series: [
          {
            type: 'pie',
            center:['50%','30%'],
            radius: ['18%','30%'],
            data: list1.length>0?list1:[0],
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
              }
            },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                normal:{
                  label:{
                      show: true,
                      formatter: '{b} : {d}%'
                  },
                  labelLine :{show:true}
                }
              }
          },
          {
            type: 'pie',
            center:['50%','82%'],
            radius: ['18%','30%'],
            data: list2.length>0?list2:[0],
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
              }
            },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                normal:{
                  label:{
                      show: true,
                      formatter: '{b} : {d}%'
                  },
                  labelLine :{show:true}
                }
              }
          }
        ]
      })
    },
	  }
	}