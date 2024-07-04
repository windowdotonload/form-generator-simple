<!--
* @description 账号管理
* @fileName accountManagement.vue
* @author vvx
* @date 2020/05/15 15:30:23
* @version V1.0.0
!-->
<template>
    <div style="height:100%;position: relative;">
        <div class="return-btn" style="position:absolute;right:56px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer" >
            <!-- <img src="../../assets/back.png" style  ="vertical-align: middle;margin-right:5px;margin-top:-2px;height:14px;height:14px"> -->
            <el-button type="danger" plain size="small" @click="handleConfiguration"><img src="../../assets/pz.png" style  ="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px">配置</el-button>
            <el-button type="danger" plain size="small" @click="onBack"><img src="../../assets/back.png" style  ="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px">返回</el-button>
            <!-- <span style="font-size:15px">返回</span> -->
        </div>
        <div class="monitoring-data" :style="mainminheight">
            <div class="monitoring-top">
                <div><el-button type="danger" icon="el-icon-notebook-2" plain @click="handleRecord" size="small" style="float:right;">短信日志</el-button></div>
                <div>
                    <img :src="lubricationInfo.lubricationPointPicPath || defaultImg" alt="" class="top-image"/>
                    <div style="float:left;width:80%;margin-left:20px;">
                        <div style="font-weight:bold;margin-bottom:20px;font-size:24px;color:#333">{{lubricationInfo.lubricationPointName}}</div>
                        <el-row :gutter="20" style="margin-bottom:20px;font-size:14px;">
                            <el-col :span="6">
                                <label for style="color:#666">所属公司：</label>
                                <div style="color:#0c479d;cursor:pointer;font-weight:bold;margin-top:5px;font-size:16px;" @click="goCompanyDetail">{{deviceInfo.companyName}}</div>
                            </el-col>
                            <el-col :span="5">
                                <label for style="color:#666">设备区域：</label>
                                <div style="font-size:16px;color:#333;font-weight:bold;margin-top:5px">{{deviceInfo.region || '--'}}</div>
                            </el-col>
                            <el-col :span="5">
                                <label for style="color:#666">制造商：</label>
                                <div style="font-size:16px;color:#333;font-weight:bold;margin-top:5px">{{deviceInfo.manufacturer || '--'}}</div>
                            </el-col>
                            <el-col :span="5">
                                <label for style="color:#666">润滑点设备类型：</label>
                                <div style="font-size:16px;color:#333;font-weight:bold;margin-top:5px">{{lubricationInfo.lubricationPointType}}</div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" style="font-size:14px;">
                            <el-col :span="6">
                                <label for style="color:#666">换油周期：</label>
                                <div style="font-size:16px;color:#333;font-weight:bold;margin-top:5px">{{lubricationInfo.oilChangePeriod}} {{lubricationInfo.oilChangePeriodUnitName}}</div>
                            </el-col>
                            <el-col :span="5">
                                <label for style="color:#666">上次用油日期：</label>
                                <div style="font-size:16px;color:#333;font-weight:bold;margin-top:5px">{{oilRecordInfo.oilDate}}</div>
                            </el-col>
                            <el-col :span="5">
                                <label for style="color:#666">现用油品：</label>
                                <div style="font-size:16px;color:#333;font-weight:bold;margin-top:5px">{{oilRecordInfo.oilName}}</div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <!-- 监测图 -->
            <div class="monitoring-left">
                <div style="height:65px;line-height:65px;"><span style="border-left:3px solid red;padding-left:20px">监测指标</span></div>
                <div style="padding:0 20px">
                    <!-- <el-tabs type="border-card" @tab-click="hanldChange">
                        <el-tab-pane  v-for="(item,index) in IdentfiterInfo" :key="index">
                            <span slot="label">
                            <img src="../../assets/web-zc.png" style="vertical-align:middle;width:28px;height:28px" v-if="item.dangerLevel==0"> 
                            <img src="../../assets/web-wx.png" style="vertical-align:middle;width:28px;height:28px" v-if="item.dangerLevel==2"> 
                            <img src="../../assets/web-jg.png" style="vertical-align:middle;width:28px;height:28px" v-if="item.dangerLevel==1"> 
                            <img src="../../assets/web-gray.png" style="vertical-align:middle;width:28px;height:28px" v-if="item.dangerLevel==3"> 
                            {{item.name}}</span>
                            <div style="background:#f7f7fb;padding-left:20px">
                                    <div style="height:32px">当前监测值:
                                        <el-button  type="danger" plain @click="refreshData" icon="el-icon-refresh" size="small" style="float:right;margin-right:20px;width:50px"></el-button>
                                    </div>
                                    <div style="font-size:44px;margin-top:10px">
                                        <span style="color:#6dcca4" v-if="item.dangerLevel==0">{{arrY.length?arrY[arrY.length-1][1]:''}}</span>
                                        <span style="color:#fe000c" v-if="item.dangerLevel==2">{{arrY.length?arrY[arrY.length-1][1]:''}}</span>
                                        <span style="color:#ed8b00" v-if="item.dangerLevel==1">{{arrY.length?arrY[arrY.length-1][1]:''}}</span>
                                        <span style="color:#ccc" v-if="item.dangerLevel==3">{{arrY.length?arrY[arrY.length-1][1]:''}}</span>
                                        <span style="font-size:24px;color:#909399">{{item.unit}}</span>    
                                        <el-select v-model="timeValue" @change="onSelectedTime($event,item)" placeholder="请选择" style="float:right;margin:8px 20px 0 0;width:120px" size="small">
                                                <el-option
                                                v-for="item in timeList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                v-show="timeValue != item.value">
                                                </el-option>
                                            </el-select>
                                    </div>
                                </div>
                            </el-tab-pane>  
                    </el-tabs> -->
                    <div type="border-card">
                        <div style="padding:0 30px;position:relative;cursor:pointer;overflow:hidden">
                            <div class="pre-btn" style="left:0;" @click="prePage()"><i class="el-icon-arrow-left"></i></div>
                            <div class="pre-btn" style="right:0;" @click="nextPage()"><i class="el-icon-arrow-right"></i></div>
                           <div style="overflow:hidden;display: flex;" ref="offsetItem">
                                <div ref="menuItem" style="transition:all .5s;white-space: nowrap;float:left;color:#909399">
                                    <div v-for="(item,index) in IdentfiterInfo" :key="index" :ref="`tab`+index" style="display:inline-block;border-bottom:1px solid #DCDFE6;height:40px;line-height:40px;padding:0 20px;font-size:14px" @click="hanldChange(item,index)" :class="activeIndex==index?'active':'normal'">
                                        <img src="../../assets/web-zc.png" style="vertical-align:middle;width:28px;height:28px" v-if="item.dangerLevel==0"> 
                                        <img src="../../assets/web-wx.png" style="vertical-align:middle;width:28px;height:28px" v-if="item.dangerLevel==2"> 
                                        <img src="../../assets/web-jg.png" style="vertical-align:middle;width:28px;height:28px" v-if="item.dangerLevel==1"> 
                                        <img src="../../assets/web-gray.png" style="vertical-align:middle;width:28px;height:28px" v-if="item.dangerLevel==3"> 
                                        {{item.name}}
                                    </div>
                                </div>
                                <div style="float:left;width:auto;height:40px;border-bottom:1px solid #DCDFE6;flex:1"></div>
                            </div>
                        </div>
                        <div style="background:#f7f7fb;padding:25px 15px 0 35px">
                                    <div style="height:32px">当前监测值:
                                        <el-button  type="danger" plain @click="refreshData" icon="el-icon-refresh" size="small" style="float:right;margin-right:20px;">刷新</el-button>
                                        <el-button  type="danger" plain @click="dialogVisible = true" icon="el-icon-download" size="small" style="float:right;margin-right:20px;" v-if="timeValue == 1">下载</el-button>
                                    </div>
                                    <div style="font-size:44px;margin-top:10px;overflow:hidden">
                                        <span style="color:#6dcca4" v-if="IdentfiterInfo.length?IdentfiterInfo[activeIndex].dangerLevel==0:false">{{IdentfiterInfo.length && IdentfiterInfo[activeIndex].value?IdentfiterInfo[activeIndex].value:'--'}}</span>
                                        <span style="color:#fe000c" v-if="IdentfiterInfo.length?IdentfiterInfo[activeIndex].dangerLevel==2:false">{{IdentfiterInfo.length && IdentfiterInfo[activeIndex].value?IdentfiterInfo[activeIndex].value:'--'}}</span>
                                        <span style="color:#ed8b00" v-if="IdentfiterInfo.length?IdentfiterInfo[activeIndex].dangerLevel==1:false">{{IdentfiterInfo.length && IdentfiterInfo[activeIndex].value?IdentfiterInfo[activeIndex].value:'--'}}</span>
                                        <span style="color:#ccc" v-if="IdentfiterInfo.length?IdentfiterInfo[activeIndex].dangerLevel==3:false">{{IdentfiterInfo.length && IdentfiterInfo[activeIndex].value?IdentfiterInfo[activeIndex].value:'--'}}</span>
                                        <span style="font-size:24px;color:#909399">{{IdentfiterInfo.length?IdentfiterInfo[activeIndex].unit:''}}</span>    
                                        <el-select v-model="timeValue" @change="onSelectedTime($event,IdentfiterInfo[activeIndex])" placeholder="请选择" style="float:right;margin:8px 20px 0 0;width:120px" size="small">
                                                <el-option
                                                v-for="item in timeList"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                                v-show="timeValue != item.value">
                                                </el-option>
                                            </el-select>
                                    </div>
                                </div>
                            </div>  
                    <div ref="chart" style="width:100%;height:500px;background:#f7f7fb"></div>
                    <!-- <div style="text-align:center;background:#f7f7fb;color:#a9adb3;padding-bottom:20px">传感器：{{deviceName}} 数据来源于阿里云物联网 更新时间：{{byIdentifierUpdate}}</div> -->
                    <div style="text-align:center;background:#f7f7fb;color:#a9adb3;padding-bottom:20px">Powered by 阿里云 更新时间：{{byIdentifierUpdate}}</div>
                </div>
                
            </div>
            <!-- 报警信息 -->
             <div class="monitoring-right">
                <div style="height:65px;line-height:65px;"><span style="border-left:3px solid red;padding-left:4%">报警信息</span></div>
                <div class="warning-info" :style="bgcolor" v-for="(item,index) in AlarmHistoryInfo" :key="index">
                      <el-row :gutter="5">
                            <el-col :span="6">
                                <div class="warning-time">
                                    <div style="font-size:24px;margin-bottom:10px">{{item.time}}</div>
                                    <div style="font-size:14px;color:#666">{{item.data}}</div>
                                </div>
                            </el-col>
                            <el-col :span="18">
                                <div class="warning-news"> 
                                    <div style="font-size:14px;margin-bottom:5px">{{item.messageContent}}</div>
                                    <div style="font-size:14px;color:#666">通知次数：<span style="color:red">{{item.sendTimes}}次</span></div>
                                </div>
                            </el-col>
                        </el-row>
                </div>
                <el-pagination
                    v-if="totalNumber>0"
                    style="text-align: center;"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="totalNumber">
                </el-pagination>
                <div style="text-align:center;height:650px;display:flex;justify-content:center;align-items:center"  v-if="!AlarmHistoryInfo.length"><img src="../../assets/baojing.png" /></div>
            </div>
        </div>
        <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="30%"
        >
        <label for>下载日期：</label>
        <el-date-picker
        style="margin:0 auto"
        v-model="downloadDay"
        value-format="yyyy-MM-dd"
        type="date"
        size="small"
        :picker-options="pickerOptions"
        placeholder="选择下载日期">
        </el-date-picker>
        <span slot="footer" class="dialog-footer" align="center">
            <el-button type="danger" @click="donwnLoadData" size="small">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
// var sock = new WebSocket( 'ws://192.168.1.105:8800/myWS?token=index1')
export default {
  data() {
    return {
      dialogVisible:false,
      downloadDay:'',
    pickerOptions: {
        disabledDate(time) {
        return time.getTime() > Date.now();
        }
    },
      defaultImg: require("../../assets/lp-none.png"),
      activeName:'first',
      selectRadioed:'24小时',
      bgcolor:'border-left:5px solid red;margin-bottom: 15px;',
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      lubricationInfo: {},//润滑点信息
      deviceInfo:{},//设备信息
      oilRecordInfo:{},//油品信息
      pagenation: {
        current: 1,
        size: 30
      },
      totalNumber: 0, //总条数
      byIdentifierUpdate:'',
      selectList: [],
      AlarmHistoryInfo:[],//报警信息
      timeValue:1,
      timeList:[{
        value:1,
        label:'近1天'
      },
      {
        value:2,
        label:'近1周'
      },
      {
        value:3,
        label:'近1月'
      },  {
        value:4,
        label:'近3月'
      },  {
        value:5,
        label:'近2年'
      }],
      dialogFormVisible: false, //新增账号对话框
      rules: {
        name: [{ required: true, message: "请输入公司名称", trigger: "blur" }],
        loginAccount: [
          { required: true, message: "请选择设备名称", trigger: "change" }
        ],
        roleNumbers: [
          { required: true, message: "请选择润滑点名称", trigger: "change" }
        ]
      },
      arrY:[],//echart 纵坐标
      arrX:[],//echart 横坐标
      maxValue:0,
      minValue:0,
      IdentfiterInfo:[
        //   {value:23,dangerLevel:0,current:true},{value:23,dangerLevel:1,current:false},{value:23,dangerLevel:1},{value:23,dangerLevel:1},{value:23,dangerLevel:1},{value:23,dangerLevel:1},{value:23,dangerLevel:1}
      ],
      deviceName:'',
      roleList: [], //角色列表
      dialogTitle: "",
      loading: false, //是否加载
      addFlag: 1, //是否是新建弹窗
      activeIndex:0,
      interval:null,
      offsetItemWidth:0,
      listItemWidth:0,
      stepWidth:0,
      ACCEditBtn: false,
      ACCDeleteBtn: false,
    markVisualMapArray:[],   // 折现分段展示颜色
    markVisualMapArray11:[
    ],
    markAreaObj:{
        dangerMax:'',
        dangerMin:'',
        alertMin:'',
        alertMax:'',
        min:'',
        max:''
    }
    };
  },

  components: {},

  computed: {},
  created() {
    this.getLubricationPointDetail()
    this.getOilRecordDetail()
    this.getLubricationPointIdentfiter()
    this.interval = setInterval(() => {
        this.getLubricationPointIdentfiter()
    }, 60000);
  },
  beforeRouteLeave(to, from, next) {  
    window.clearInterval(this.interval)
    next();
  },
  mounted() {
      this.getAlarmHistoryTop10()
  },
  methods: {
      onBack() {
        this.$router.push({
            path: "/IotManagement",
        });
        //   history.back()
      },
    donwnLoadData(){
        if(!this.downloadDay) {
             this.$message({
              message: '请先选择下载日期',
              type: "warning"
            });
            return
        }
        const loading = this.$loading({
          lock: true,
          text: '数据下载中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let paramObj = {
          day: this.downloadDay.toString(),
          lubricationPointNumber: this.$route.query.lubricationPointNumber,
          responseTypeBlob: true
        }
        this.requestMethodGet("/iot/device/data/realData/exportAll", paramObj).then(res => {
          let data = res.data;
          let fileReader = new FileReader();
          let that = this
          loading.close();
          fileReader.onload = function() {
            try {
              let jsonData = JSON.parse(this.result);  // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
                that.$message({
                    message: jsonData.msg,
                    type: "error"
                });
                return
              }
              } catch (err) {   // 解析成对象失败，说明是正常的文件流
                const blob = new Blob([res.data], {
                    type: "application/vnd.ms-excel"
                });
                const objectUrl = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = objectUrl;
                link.setAttribute("download", "operateLog.xls");
                document.body.appendChild(link);
                link.click();
                that.dialogVisible = false
                that.downloadDay = ''
              } 
          };
          fileReader.readAsText(data)
        })
        .catch((res) => {
          loading.close()
        });
    },
    refreshData(e){
        let target = e.target;
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = e.target.parentNode;
        }
        target.blur()
        this.getLubricationPointIdentfiter()
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 130}px`;
        this.offsetItemWidth = this.$refs.offsetItem.offsetWidth
        this.listItemWidth = this.$refs.menuItem.offsetWidth
    },
    // 获取报警信息
    getAlarmHistoryTop10(val=1){
         let params = {
            current:val,
            lubricationPointNumber:this.$route.query.lubricationPointNumber
        }
        this.requestMethodGet("/iot/device/data/getAlarmHistoryByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.totalNumber = res.data.totalCount
            res.data.list.forEach(item => {
                item.data = item.sendTime.split(' ')[0].replace(/-/g,'/')
                item.time = item.sendTime.split(' ')[1].substr(0,5)
            })
            this.AlarmHistoryInfo = res.data.list
  
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
        });
    },
    handleCurrentChange(val){
        this.getAlarmHistoryTop10(val)
    },
    // 获取润滑点监测指标最新数值
    getLubricationPointIdentfiter() {
        let params = {
            lubricationPointNumber:this.$route.query.lubricationPointNumber
        }
        this.requestMethodGet("/iot/device/data/getIdentifier", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.IdentfiterInfo = res.data
            this.deviceName = res.data[this.activeIndex].deviceName
            let params = {
                timeType:this.timeValue,
                iotId:res.data[this.activeIndex].iotId,
                identifier:res.data[this.activeIndex].identifier
            }
            // if(val) {
            //    params.iotId = res.data[this.activeIndex].iotId
            //    params.identifier = res.data[this.activeIndex].identifier
            //     this.getDataByIdentifier(params,res.data[this.activeIndex])
            //     return
            // }
            this.getDataByIdentifier(params,res.data[this.activeIndex])
            this.$nextTick( () =>{
                if(!this.offsetItemWidth) {
                    this.offsetItemWidth = this.$refs.offsetItem.offsetWidth
                    this.listItemWidth = this.$refs.menuItem.offsetWidth
                } 
            })
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
        });
    },
    goCompanyDetail() {
        this.$router.replace({
          //核心语句
          path: "/CustomerProfile/CustomerProfileDetail", //跳转的路径
          query: {
              companyNumber: this.deviceInfo.customerNumber
          }
        })
    },
    getLubricationPointDetail(){
        let params = {
            lubricationPointNumber:this.$route.query.lubricationPointNumber
        }
        this.requestMethodGet("/web/common/lubricationPoint/queryLubricationPoint", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data
            data.oilChangePeriodUnitName = data.oilChangePeriodUnit == 'Y' ? '年' : data.oilChangePeriodUnit == 'M' ? '月' : data.oilChangePeriodUnit == 'D' ? '天' : '小时'
            this.lubricationInfo = res.data
            this.getdeviceDetail(res.data.deviceNumber)
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
        });
    },
    getdeviceDetail(val){
        let params = {
            deviceNumber:val
        }
        this.requestMethodGet("/web/common/device/queryDeviceInfo", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.deviceInfo = res.data
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
        });
    },
    getOilRecordDetail(){
        let params = {
            lubricationPointNumber:this.$route.query.lubricationPointNumber
        }
        this.requestMethodGet("/web/common/device/queryOilRecordListWithLpNum", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
              if(res.data.length) {
                this.oilRecordInfo = res.data[0]
                  }
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
    // hanldChange(res){
    //     this.activeIndex = res.index
    //     let item = this.IdentfiterInfo[res.index]
    //     this.deviceName = item.deviceName
    //     let params = {
    //         timeType:this.timeValue,
    //         iotId:item.iotId,
    //         identifier:item.identifier
    //     }
    //     this.getLubricationPointIdentfiter()
    // },
    hanldChange(res,index){
        this.markVisualMapArray=[]
           this.$nextTick( () =>{
            //    console.log(this.$refs['tab'+index][0].offsetLeft,this.stepWidth)
               let offsetLeftFirst = this.$refs['tab'+index][0].offsetLeft
               if(offsetLeftFirst < this.stepWidth) {
                   this.stepWidth = offsetLeftFirst
                    this.$refs.menuItem.style.transform=`translateX(-${this.stepWidth}px)`;
               }
               let offsetLeftLast = this.$refs['tab'+index][0].offsetLeft + this.$refs['tab'+index][0].offsetWidth
                
               if(offsetLeftLast > this.stepWidth+this.offsetItemWidth){
                    this.stepWidth +=  (offsetLeftLast - this.stepWidth - this.offsetItemWidth)
                    this.$refs.menuItem.style.transform=`translateX(-${this.stepWidth}px)`;
               }
            })
        this.activeIndex = index
        let item = this.IdentfiterInfo[index]
        this.deviceName = item.deviceName
        this.getLubricationPointIdentfiter()
    },
    prePage(){
        this.stepWidth -= (this.offsetItemWidth/3)*2
        if(this.stepWidth >= 0 ) {
            this.$refs.menuItem.style.transform=`translateX(-${this.stepWidth}px)`;
        } else {
            this.stepWidth = 0
            this.$refs.menuItem.style.transform=`translateX(0px)`;
        }
    },
    nextPage(){
        if(this.listItemWidth>this.offsetItemWidth ) {
            this.stepWidth += (this.offsetItemWidth/3)*2
            if(this.listItemWidth-this.stepWidth > this.offsetItemWidth) {
                this.$refs.menuItem.style.transform=`translateX(-${this.stepWidth}px)`;
            }else {
                this.stepWidth = this.listItemWidth - this.offsetItemWidth 
                this.$refs.menuItem.style.transform=`translateX(-${this.stepWidth}px)`;
            }
        }
    },
    onSelectedTime(val,row){
        let params = {
            timeType:val,
            iotId:row.iotId,
            identifier:row.identifier
        }
        this.getLubricationPointIdentfiter()
        // this.getDataByIdentifier(params,row)
    },
    getDataByIdentifier(params,item){
        this.requestMethodGet("/iot/device/data/getDataByIdentifier", params)
        .then(res => {
            res = res.data;
            if (res.code == 1000) {
                this.byIdentifierUpdate = res.data.time
                this.arrY = res.data.iotIndexValues
                this.minValue = res.data.min
                this.maxValue = res.data.max
                this.getEchartData(item)
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
    getEchartData(res){
        const chart = this.$refs.chart
        const myChart = echarts.init(chart)
        // const xAxisData = this.arrX
        const xAxisData = this.arrY;
        // let interval = 24
        let interval = 12*60*60*1000
        let minTime = this.moment(new Date()).subtract(1,'days').format('YYYY-MM-DD HH:mm')
        if(this.timeValue == 2) {
            minTime = this.moment(new Date()).subtract(7,'days').format('YYYY-MM-DD')
            interval = 24*60*60*1000*4
        }
        if(this.timeValue == 3) {
            minTime = this.moment(new Date()).subtract(1,'months').format('YYYY-MM-DD');
            interval = 24*60*60*1000*15
        }
        if(this.timeValue == 4) {
            minTime = this.moment(new Date()).subtract(3,'months').format('YYYY-MM-DD');
            interval = 24*60*60*1000*45
        }
        if(this.timeValue == 5) {
            minTime = this.moment(new Date()).subtract(2,'years').format('YYYY-MM-DD');
            interval = 24*60*60*1000*365
        }
        let arr = []
        if(res.dangerMax && res.dangerMaxStatus) {
            arr.push({
                yAxis:res.dangerMax,
                itemStyle: {
                    normal: {
                        color: 'red'
                    }
                },
                lineStyle:{               //警戒线的样式  ，虚实  颜色
                    type:"dashed"
                },
                label: {   // 线条提示字体
                    show: true, 
                    position:'end',
                    formatter: '危险上限',
                    color: '#ff3040'
                }
            })
        }
        if(res.alertMax && res.alertMaxStatus) {
            arr.push({
                yAxis:res.alertMax,
                itemStyle: {
                    normal: {
                        color: '#FFCC00'
                    }
                },
                lineStyle:{               //警戒线的样式  ，虚实  颜色
                    type:"dashed"
                },
                label: {   // 线条提示字体
                    show: true, 
                    position:'end',
                    formatter: '警戒上限',
                    color: '#FFCC00'
                }
            })
        }
        if(res.alertMin && res.alertMinStatus) {
            arr.push({
                yAxis:res.alertMin,
                itemStyle: {
                    normal: {
                        color: '#FFCC00'
                    }
                },
                lineStyle:{               //警戒线的样式  ，虚实  颜色
                    type:"dashed"
                },
                label: {   // 线条提示字体
                    show: true, 
                    position:'end',
                    formatter: '警戒下限',
                    color: '#FFCC00'
                }
            })
        }
        if(res.dangerMin && res.dangerMinStatus) {
            arr.push({
                yAxis:res.dangerMin,
                itemStyle: {
                    normal: {
                        color: 'red'
                    }
                },
                lineStyle:{               //警戒线的样式  ，虚实  颜色
                    type:"dashed"
                },
                label: {   // 线条提示字体
                    show: true,
                    position:'end',
                    formatter: '危险下限',
                    color: '#ff3040'
                }
            })
        }
        this.$_getMarkAreaData(res)
        let option = {
            tooltip: {
                trigger: 'axis',
                hideDelay:3000,
                formatter: (params) => {
                    const item = params[0];

                    if(item.data[1]==null) {
                        item.data[1] = "无数据"
                    }
                    if(this.timeValue == 1) {
                        return ` 
                            ${item.data[0].split(' ')[0].substr(5)} ${item.data[0].split(' ')[1].substr(0,5)}
                            <br>
                            <i class="el-icon-s-opportunity" style="color:#3aa1ef"></i> 当前监测值：${item.data[1]}
                        `
                    }
                    return ` 
                        ${item.data[0].split(' ')[0]}
                        <br>
                        <i class="el-icon-s-opportunity" style="color:#3aa1ef"></i> 当前监测值：${item.data[1]}
                    `;
                }
            },
            xAxis: {
                type: 'time',
                min: minTime,//最小时间
                max: this.moment(new Date()).format('YYYY-MM-DD HH:mm'),
                interval: interval,//毫秒时间戳 
                boundaryGap: false,
                // data: xAxisData,
                "axisTick": {
                    "show": true
                },
                //坐标轴内线的样式
                splitLine: {
                    show:false
                },
                axisLabel: {
                    showMaxLabel: true,
                    formatter: (val,index) => {
                        let date= this.moment(new Date(val)).format('YYYY-MM-DD HH:mm')
                        if(this.timeValue == 1) {
                            if(index == 0) {
                                return '                    ' + date.split(' ')[0].substr(5) +' '+ date.split(' ')[1]
                            } else if(index == 1) {
                                return date.split(' ')[0].substr(5)+' ' + date.split(' ')[1]
                            }
                            return date.split(' ')[0].substr(5) +' '+ date.split(' ')[1] + '                     '
                        } else {
                            if(index == 0) {
                                return '                     ' + date.split(' ')[0]
                            } else if(index == 1) {
                                return date.split(' ')[0]
                            }
                            return date.split(' ')[0]+ '                      '
                        }
                    }
                }
            },
            yAxis: [{
                min:this.minValue, //y轴的最小值
                max:this.maxValue, //y轴最大值 
                // interval:5, 
                type: 'value',
                    //坐标轴内线的样式
                    splitLine: {
                        show:false,
                        lineStyle: {
                            color: '#ccc',
                            type:'none'
                        }
                    },
                axisLabel: {
                    formatter: '{value}'
                }
            }],
            visualMap: {
                show: false,
                dimension: 1,
                pieces:this.markVisualMapArray
            },
            series: [
                {
                    name: '当前监测值',
                    type: 'line',
                    smooth: false,
                    data: xAxisData,
                    symbol: 'circle',//折线点设置为实心点
                    symbolSize: 4, 
                    // "data": this.arrY,
                    "smoothMonotone": "x",
                    "cursor": "pointer",
                    "showSymbol": false,
                    // itemStyle: {
                    //     color: '#3aa1ef' // 线条的颜色
                    // },
                    markLine: {
                        symbol: ['none', 'none'],//去掉箭头
                        itemStyle: {
                            normal: {
                                lineStyle: {  //全局的样式
                                    type: 'dashed',
                                    width: 1 // 线条高度
                                }, 
                            }
                        },
                        data: arr
                    },
                }
            ],
        };
        myChart.setOption(option)
    },
// 获取设备不同区域不同背景颜色的数组
$_getMarkAreaData(result) {
    this.markAreaObj={}
    if (result.dangerMax && result.dangerMaxStatus) {
        this.markAreaObj.dangerMax = parseInt(result.dangerMax)
    }
    if (result.alertMax && result.alertMaxStatus) {
        this.markAreaObj.alertMax = parseInt(result.alertMax)
    }
    if (result.alertMin && result.alertMinStatus) {
        this.markAreaObj.alertMin = parseInt(result.alertMin)
    }
    if (result.dangerMin && result.dangerMinStatus) {
        this.markAreaObj.dangerMin = parseInt(result.dangerMin)
    }
    if(result.max) {
        this.markAreaObj.max = parseInt(result.max)
    }
    if(result.min) {
        this.markAreaObj.min = parseInt(result.min)
    }
    // 如果全都有
    if(Object.keys(this.markAreaObj).length==6 ) {   // 四个值全都有
        this.markVisualMapArray=[]
        this.markVisualMapArray.push(
            {
            lt: this.markAreaObj.dangerMin,
            color: '#ff4e4e'
            }, // 危险下限 下边的区域
            {
                gt: this.markAreaObj.dangerMin,
                lte: this.markAreaObj.alertMin,
                color: '#ffc04c'
            }, // 危险下限 -- 警戒下限 区域
            {
                gt: this.markAreaObj.alertMin,
                lte: this.markAreaObj.alertMax,
                color: '#4da64c'
            }, //// 警戒下限 -- 警戒上限 --区域
            {
                gt: this.markAreaObj.alertMax,
                lte: this.markAreaObj.dangerMax,
                color: '#ffc04c'
            }, // 警戒上限 -- 危险上限 区域
            {
                gt: this.markAreaObj.dangerMax,
                color: '#ff4e4e'
            }//// 危险上限 上边区域
        )
    }
    // 如果只设置了一个值
    let area = ''
    if(Object.keys(this.markAreaObj).length==3 ) {   // 只设置一个值
        this.markVisualMapArray=[]
        delete this.markAreaObj.max;
        delete this.markAreaObj.min
        Object.keys(this.markAreaObj).forEach(trait=> {
            area = trait
        });
        switch(area){
            case 'dangerMin':   // 只存在危险下限
                this.markVisualMapArray.push(
                    {
                        lte:10000,
                        gt:this.markAreaObj.dangerMin,
                        color: '#4da64c'
                    },
                    {
                        gt: -10000,
                        lt:this.markAreaObj.dangerMin,
                        color: '#ff4e4e'
                    }
                    // 危险下限 下边区域
                )
                break;
            case 'dangerMax':   // 只存在危险上限
                this.markVisualMapArray.push(
                    {
                        lte:10000,
                        gt: this.markAreaObj.dangerMax,
                        color: '#ff4e4e'
                    },
                    {
                        lte:this.markAreaObj.dangerMax,
                        gt: -10000,
                        color: '#4da64c'
                    }
                    // 危险上限 上边区域
                )
            break;
            case 'alertMin':   // 只存在警戒下限
                this.markVisualMapArray.push(
                    {
                        lte: 10000,
                        gt:this.markAreaObj.alertMin,
                        color: '#4da64c'
                    },
                    {
                        lte: this.markAreaObj.alertMin,
                        gt:-10000,
                        color: '#ffc04c'
                    }
                    // 警戒下限 下边区域
                )
            break;
            case 'alertMax':   // 只存在警戒上限
                this.markVisualMapArray.push(
                    {
                        lte:this.markAreaObj.alertMax,
                        gt: -1000,
                        color: '#4da64c'
                    },
                    {
                        lte:10000,
                        gt: this.markAreaObj.alertMax,
                        color: '#ffc04c'
                    }
                    // 警戒上限 上边区域
                )
            break;
            default:
                break;
            }
    }

    // 如果设置了三个值
    if(Object.keys(this.markAreaObj).length==5 ) {   // 只设置三个值
        this.markVisualMapArray=[]
        if(!this.markAreaObj.hasOwnProperty('dangerMax')) {  // true  没有危险上限    有危险下限/警戒上限/警戒下限
            this.markVisualMapArray.push(
                {
                    lt: this.markAreaObj.dangerMin,
                    color: '#ff4e4e'
                    },
                // 危险下限 下边的区域
                {
                    gt: this.markAreaObj.dangerMin,
                    lte: this.markAreaObj.alertMin,
                    color: '#ffc04c'
                    },
                // 危险下限 -- 警戒下限 区域
                {
                    gt: this.markAreaObj.alertMin,
                    lte: this.markAreaObj.alertMax,
                    color: '#4da64c'
                    },
                // 警戒下限 -- 警戒上限 --区域
                {
                    gt: this.markAreaObj.alertMax,
                    color: '#ffc04c'
                }, // 警戒上限 -- 上边 区域
            )
        } else  if(!this.markAreaObj.hasOwnProperty('alertMax')){    // 没有警戒上限      有危险下限/危险上限/警戒下限
            // console.log('没有警戒上限')
            this.markVisualMapArray.push(
                {
                    lt: this.markAreaObj.dangerMin,
                    color: '#ff4e4e'
                },
                // 危险下限 下边的区域
                {
                    gt: this.markAreaObj.dangerMin,
                    lte: this.markAreaObj.alertMin,
                    color: '#ffc04c'
                }, // 危险下限 -- 警戒下限 区域
                {
                    gt: this.markAreaObj.alertMin,
                    lte: this.markAreaObj.dangerMax,
                    color: '#4da64c'
                    }, // 警戒下限 -- 危险上限 --区域
                    {
                        gt: this.markAreaObj.dangerMax,
                        color: '#ff4e4e'
                    } //// 危险上限 上边区域
            )
        } else if(!this.markAreaObj.hasOwnProperty('alertMin')) {   // 没有警戒下限         有危险下限/危险上限/警戒上限
        // console.log('没有警戒下限')
            this.markVisualMapArray.push(
                {
                    lt: this.markAreaObj.dangerMin,
                    color: '#ff4e4e'
                }, // 危险下限 下边的区域
                {
                    gt: this.markAreaObj.dangerMin,
                    lte: this.markAreaObj.alertMax,
                    color: '#ffc04c'
                }, //// 危险下限 -- 警戒上限 --区域
                {
                    gt: this.markAreaObj.alertMax,
                    lte: this.markAreaObj.dangerMax,
                    color: '#4da64c'
                },  // 警戒上限--危险上限区域
                {
                    gt: this.markAreaObj.dangerMax,
                    color: '#ff4e4e'
                } // 危险上限 上边区域
            )
        } else {   // 没有危险下限            警戒下限/危险上限/警戒上限
            // console.log('没有危险下限')
            this.markVisualMapArray.push(
                {
                    lt: this.markAreaObj.alertMin,
                    color: '#ffc04c'
                }, //  警戒下限  下方 区域
                {
                    gt: this.markAreaObj.alertMin,
                    lte: this.markAreaObj.alertMax,
                    color: '#4da64c'
                }, //// 警戒下限 -- 警戒上限 --区域
                {
                    gt: this.markAreaObj.alertMax,
                    lte: this.markAreaObj.dangerMax,
                    color: '#ffc04c'
                },
                // 警戒上限 -- 危险上限 区域
                {
                    gt: this.markAreaObj.dangerMax,
                    color: '#ff4e4e'
                } //// 危险上限 上边区域
            )
        }
    }

        // 如果设置了两个值
        if(Object.keys(this.markAreaObj).length==4 ) {   // 只设置两个值
        // console.log('222个')
            this.markVisualMapArray=[]
            if(this.markAreaObj.hasOwnProperty('dangerMax')) {
                if(this.markAreaObj.hasOwnProperty('alertMax')) {  
                    // console.log('有危险上限--警戒上限',this.markAreaObj) // 有危险上限--警戒上限
                    this.markVisualMapArray.push(
                        {
                            lt: this.markAreaObj.alertMax, //
                            color: '#4da64c'
                        }, // 警戒上限 下方 --区域
                        {
                            gt: this.markAreaObj.alertMax,
                            lte: this.markAreaObj.dangerMax,
                            color: '#ffc04c'
                        }, // 警戒上限 -- 危险上限 区域
                        {
                            gt: this.markAreaObj.dangerMax,
                            color: '#ff4e4e'
                        } // 危险上限 上边区域
                    )
                } else if(this.markAreaObj.hasOwnProperty('alertMin')) {  // 有危险上限--警戒下限
                // console.log('有危险上限--警戒下限')
                    this.markVisualMapArray.push(
                        {
                            lt: this.markAreaObj.alertMin,
                            color: '#ffc04c'
                        }, // 警戒下限 区域
                        {
                            gt: this.markAreaObj.alertMin,
                            lte: this.markAreaObj.dangerMax,
                            color: '#4da64c'
                        },  // 警戒下限 -- 危险上限 区域
                        {
                            gt: this.markAreaObj.dangerMax,
                            color: '#ff4e4e'
                        } // 危险上限 上边区域
                    )
                } else {   //  有危险上限 -- 危险下限
                // console.log('有危险上限--危险下限')
                    this.markVisualMapArray.push(
                        {
                            lt: this.markAreaObj.dangerMin,
                            color: '#ff4e4e'
                        }, // 危险下限 下边的区域
                        {
                            gt: this.markAreaObj.dangerMin,
                            lte: this.markAreaObj.dangerMax,
                            color: '#4da64c'
                        }, //危险下限 -- 危险上限 区域
                        {
                            gt: this.markAreaObj.dangerMax,
                            color: '#ff4e4e'
                        }  //// 危险上限 上边区域
                    )
                }
            } else {  // 没有危险上限
            // console.log('没有危险上限')
                if(this.markAreaObj.hasOwnProperty('alertMax')) {    // 有警戒上限
                // console.log('有警戒上限')
                    if(this.markAreaObj.hasOwnProperty('alertMin')) {   // 有警戒上限 -- 警戒下限
                    // console.log('有警戒上限 -- 警戒下限')
                        this.markVisualMapArray.push(
                            {
                                lt: this.markAreaObj.alertMin,
                                color: '#ffc04c'
                            }, // 警戒下限 下边的区域
                            {
                                gt: this.markAreaObj.alertMin,
                                lte: this.markAreaObj.alertMax,
                                color: '#4da64c'
                            }, //// 警戒下限 -- 警戒上限 --区域
                            {
                                gt: this.markAreaObj.alertMax,
                                color: '#ffc04c'
                            } // 警戒上限 -- 上方 区域
                        )
                    } else {  // 警戒上限--危险下限
                    // console.log('警戒上限--危险下限')
                        this.markVisualMapArray.push(
                            {
                                lt: this.markAreaObj.dangerMin,
                                color: '#ff4e4e'
                            }, // 危险下限 下边的区域
                            {
                                gt: this.markAreaObj.dangerMin,
                                lte: this.markAreaObj.alertMax,
                                color: '#ffc04c'
                            }, // 危险下限 -- 警戒上限 区域
                            {
                                gt: this.markAreaObj.alertMax,
                                color: '#ffc04c'
                            } //// 警戒上限 上边区域
                        )
                    }
                } else {  // 没有警戒上限/危险上限  有警戒下限/危险下限
                // console.log('有警戒下限/危险下限')
                    this.markVisualMapArray.push(
                        {
                            lt: this.markAreaObj.dangerMin,
                            color: '#ff4e4e'
                        }, // 危险下限 下边的区域
                        {
                            gt: this.markAreaObj.dangerMin,
                            lte: this.markAreaObj.alertMin,
                            color: '#ffc04c'
                        }, // 危险下限 -- 警戒下限 区域
                        {
                            gt: this.markAreaObj.alertMin,
                            color: '#4da64c'
                        }
                        //// 警戒下限 -- 上方 --区域
                    )
                }
            }
        }
        // console.log(this.markVisualMapArray,222)
            // if(this.arrY.length==0) {
            //     this.markVisualMapArray=[]
            // }
            //   如果一个警戒线也没有设置  折线展示默认颜色
            if(Object.keys(this.markAreaObj).length == 2) {
                this.markVisualMapArray=[
                    {
                        gte: this.markAreaObj.min,   //最小值 
                        lt:this.markAreaObj.max,
                        color: 'rgba(140, 200, 246, 1)'
                    }
                ]
            }
            // console.log(this.markVisualMapArray,1111)
        },
        // 查询
        handleSearchTableData() {
            this.pagenation.current = 1;
        },
        // 编辑
        handleEdit(row) {
        this.dialogTitle = "绑定设备信息";
        this.dialogFormVisible = true;
        },
        handleRecord(){
            this.$router.push({
                path: "/IotManagement/lubricatepointRecord",
                query: {
                    lubricationPointNumber: this.$route.query.lubricationPointNumber
                }
            });
        },
                // 点击配置跳转管理页面
        handleConfiguration() {
        this.$router.push({
            //核心语句
            path: "/IotManagement/IotConfiguration", //跳转的路径
            query: {
                lubricationPointNumber: this.$route.query.lubricationPointNumber
            }
        })
        }
    }
};
</script>
<style lang='less'>
.monitoring-data {
    padding: 0px 20px;
    height: 100%;
    background: #f4f5f7;
    overflow: auto;
    .el-pagination {
        position:static !important;
    }
    .monitoring-top {
        width: 100%;
        // height:220px;
        overflow: hidden;
        box-sizing: border-box;
        padding: 20px;
        margin-bottom:20px;
        background: #fff;
        .top-image {
            height:168px;
            width:168px;
            float:left;
            border-radius:15px;
        }
        label {
            color: #666 !important;
        }
    }
    .monitoring-left {
        width:67%;
        min-height: 700px;
        float: left;
        background: #fff;
    }
     .monitoring-right {
        width: 32%;
        float: right;
        background: #fff;
        min-height: 700px;
        padding-bottom: 20px;
        .warning-info {
            overflow: hidden;
            margin: 0 20px;
            background:#f7f7fb;
            .warning-time {
                // width:25%;
                // height:100%;
                // float:left;
                margin:20px 0;
                text-align:center;
                border-right:1px solid #ccc;
            }
            .warning-news {
                // width:65%;
                height:100%;
                // float:left;
                margin:4%;
            }
        }
        .warning-color {
            float: left;
            height:100%;
            width:4px;
        }
    }
  .el-tabs--border-card>.el-tabs__header {
      background-color: #fff !important;
  }
  .el-tabs--border-card {
      border: none !important;
      box-shadow: none !important;
      background:#f7f7fb !important;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item {
      border: none !important;
      &.is-active {
          background-color:#f7f7fb !important;
          color: red !important;
          font-weight: bold;
          font-size: 16px;
        //   img {
        //     width:32px !important;
        //     height:32px !important;
        //   }
      }
  }
  .el-radio-button__inner {
      width: 75px !important;
  }
  .el-tabs__content {
      padding-bottom:0px !important;
      padding-top:25px !important;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
      font-weight: bold;
      font-size: 16px;
      color:red !important;
    //   img {
    //       width:32px !important;
    //       height:32px !important;
    //   }
  }
  .el-tabs__nav-wrap.is-scrollable {
      padding: 0 30px !important;
  }
//   .el-tabs__nav-scroll {
//       overflow:visible !important
//   }
  .el-tabs__nav-prev .el-icon-arrow-left,.el-tabs__nav-next .el-icon-arrow-right {
      margin-top:5px;
      font-size:25px !important;
      color:#909399 !important;
  }
  .active{
    transition:all .3s;
    background-color:#f7f7fb !important;
    color: red !important;
    font-weight: bold;
    border-bottom: 1px solid #f7f7fb !important;
    font-size: 16px !important;
  }
  .normal{
    transition:font-size .3s cubic-bezier(.645,.045,.355,1);
  }
  .normal:hover {
    color: red !important;
    font-weight: bold;
    font-size: 16px !important;
  }
  .pre-btn{
    position:absolute;
    height:100%;
    background:#fff;
    z-index:12;
    width:30px;
    border-bottom:1px solid #DCDFE6;
    box-sizing:border-box;
    text-align:center;
    line-height:40px;
    font-size:25px;
    color:#909399;
    vertical-align: middle;
  }
}

</style>
<style>
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
</style>