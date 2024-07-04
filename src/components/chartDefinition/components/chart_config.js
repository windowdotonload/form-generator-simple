export default {
  data() {
    return {
      haveLubrList:[
        {
          label:'有润滑点设备',
          value:1
        },{
          label:'无润滑点设备',
          value:2
        },{
          label:'全部设备',
          value:0
        }
      ],
      dimensionCode1:false,//客户-区域分布
      dimensionCode1Ele:'',
      dimensionCode2:false,//客户-PES客户数
      dimensionCode2Ele:'',
      dimensionCode3:false,//客户-服务覆盖率
      dimensionCode3Ele:'',
      dimensionCode4:false,//客户-行业分布
      dimensionCode4Ele:'',
      dimensionCode5:false,//设备-数量
      dimensionCode5Ele:'',
      dimensionCode6:false,//设备-新建VS复制比例
      dimensionCode6Ele:'',
      dimensionCode7:false,//设备-信息完善率变化
      dimensionCode7Ele:'',
      dimensionCode8:false,//设备-做过油品检测/设备润滑调查的设备比例
      dimensionCode8Ele:'',
      dimensionCode9:false,//设备-行业分布
      dimensionCode9Ele:'',
      dimensionCode10:false,//设备-区域分布
      dimensionCode10Ele:'',
      dimensionCode11:false,//工单-经销商代下单VS客户自主下单比例
      dimensionCode11Ele:'',
      dimensionCode12:false,//工单-核心服务工单数
      dimensionCode12Ele:'',
      dimensionCode13:false,//工单-工单服务类型
      dimensionCode13Ele:'',
      dimensionCode14:false,//工单-工单服务时长
      dimensionCode14Ele:'',
      dimensionCode15:false,//用户-月活
      dimensionCode15Ele:'',
      dimensionCode16:false,//用户-月深度活跃
      dimensionCode16Ele:'',
      dimensionCode17:false,//工单-行业分布
      dimensionCode17Ele:'',
      dimensionCode18:false,//客户-留存率
      dimensionCode18Ele:'',
      dimensionCode19:false,//客户-重点客户交付完成率
      dimensionCode19Ele:'',
      dimensionCode20:false,//用户-月活客户用户行业分布
      dimensionCode20Ele:'',
      dimensionCode21:false,//用户-月活客户用户区域分布
      dimensionCode21Ele:'',
      dimensionCode22:false,//用户-月活经销商用户角色分布
      dimensionCode22Ele:'',
      dimensionCode23:false,//用户-游客转化率
      dimensionCode23Ele:'',
      dimensionCode24:false,//用户-游客平均转化时长
      dimensionCode24Ele:'',
      dimensionCode25:false,//客户-月活
      dimensionCode25Ele:'',
      dimensionCode26:false,//客户-服务广度
      dimensionCode26Ele:'',
      dimensionCode27:false,//客户-服务广度
      dimensionCode27Ele:'',
      dimensionCode28:false,//客户-注册率
      dimensionCode28Ele:'',
    };
  },
  methods: {
    handleYData(data){
      let arr = []
      if(data.length){
        data.forEach(it=>{
          if(Number(it)>0){//有d和h
            arr.push(Number(it)/60/60/24)
          }else{
            arr.push(0)
          }
        })
        return arr
      }
    },
    // 客户-区域分布-月份改变
    monthChange(val){
      this.getRingChartData(this.dimensionCode1Ele,'dimension_code1')
    },
    // 客户-行业分布-月份改变
    monthChange1(val){
      this.getRingChartData(this.dimensionCode4Ele,'dimension_code4')
    },
    // 客户-重点客户数 - 年份改变
    yearChange1(val){
       this.drawPieChart(this.dimensionCode2Ele,'dimension_code2')
    },
    // 客户-行业分布-行业改变
    industryChange1(){
      this.getRingChartData(this.dimensionCode4Ele,'dimension_code4')
    },
    // 工单-行业分布-月份改变
    monthChange5(){
      this.getRingChartData(this.dimensionCode17Ele,'dimension_code17')
    },
    // 工单-行业分布-行业改变
    industryChange2(){
      this.getRingChartData(this.dimensionCode17Ele,'dimension_code17')
    },
    // 用户-月活客户用户行业改变
    industryChange20(){
      this.getRingChartData(this.dimensionCode20Ele,'dimension_code20')
    },
    // 用户-月活客户用户区域分布-月份改变
    monthChange21(val){
      this.getRingChartData(this.dimensionCode21Ele,'dimension_code21')
    },
    // 用户-月活客户用户区域分布-月份改变
    monthChange22(val){
      this.getRingChartData(this.dimensionCode22Ele,'dimension_code22')
    },
    // 设备-行业分布-月份改变
    monthChange2(val){
      this.getRingChartData(this.dimensionCode9Ele,'dimension_code9')
    },
    // 用户-月活客户用户行业分布
    monthChange20(val){
      this.getRingChartData(this.dimensionCode20Ele,'dimension_code20')
    },
    // 设备-区域分布-月份改变
    monthChange3(val){
      this.getRingChartData(this.dimensionCode10Ele,'dimension_code10')
    },
    // 工单-工单服务类型-月份改变
    monthChange4(val){
      this.getRingChartData(this.dimensionCode13Ele,'dimension_code13')
    },
    // 工单-工单服务类型-服务类型改变
    serviceClassChange(){
      this.getRingChartData(this.dimensionCode13Ele,'dimension_code13')
    },
    // 工单-工单服务类型-区域改变
    areaChange4(val){
      this.getRingChartData(this.dimensionCode13Ele,'dimension_code13')
    },
    // 工单-工单服务级别-区域选择
    areaChangeDc27(val){
      this.getRingChartData(this.dimensionCode27Ele,'dimension_code27')
    },
    // 工单-工单服务级别-时间选择
    monthChangeDc27(val){
      this.getRingChartData(this.dimensionCode27Ele,'dimension_code27')
    },
    // 工单-工单服务级别-级别选择
    serviceGradeChangeDc27(val){
      this.getRingChartData(this.dimensionCode27Ele,'dimension_code27')
    },
    // 工单-下单方式区域改变
    areaChange(val){
      this.getStackedChartData(this.dimensionCode11Ele,'dimension_code11')
    },
    // 服务类型改变
    serviceTypeChange(){
      this.getBrokenLineChartData(this.dimensionCode14Ele,'dimension_code14')
    },
    // 设备-数量 有无润滑点筛选
    haveLubrChange(){
      this.drawColumnarChart('dimension_code5')
    },
    // 设备-自建VS复制比例 有无润滑点筛选
    haveLubrChange6(){
      this.getStackedChartData(this.dimensionCode6Ele,'dimension_code6')
    },
    // 用户-月活下拉改变事件
    changeUserRole(val){
      this.$nextTick(()=>{
        let idEle = ''
        if(this.isAll && val == ''){
          idEle = this.$echarts.init(document.getElementById('userCharts3'))
        }else{
          idEle = this.$echarts.init(document.getElementById('userCharts'))
        }
        this.dimensionCode15Ele = idEle
        this.getUserChartData(this.dimensionCode15Ele,'dimension_code15',val)
      })
    },
    // 用户-月深度活跃下拉
    changeUserRole1(val){
      this.$nextTick(()=>{
        let idEle = ''
        if(this.isAll && val == ''){
          idEle = this.$echarts.init(document.getElementById('userCharts4'))
        }else{
          idEle = this.$echarts.init(document.getElementById('userCharts1'))
        }
        this.dimensionCode16Ele = idEle
        this.getUserChartData(this.dimensionCode16Ele,'dimension_code16',val)
      })
    },
  }
}