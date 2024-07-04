import _ from "lodash"
import handleReport from "@/components/businessComponents/components/handleReport";
export default{
  mixins: [handleReport],
  data(){
    return {
      lubricationMethodType:'',
      lubricationData:{},
      everyMonthAddItem:{},
      monthWorkNum:'',
      everyMonthAddVal:''
    }
  },
  methods: {
    // 多个润滑点刷新
    handleRefreshItem(item){
      const params = this.findDeviceAndLup(item)
      // 获取设备数据
      this.getDeviceData(params,false,item)
      // 获取润滑点数据
      this.getLupData(params,false,item)
    },
    // 多个润滑点编辑
    async handleEditItem(item){
      this.refreshItem = item 
      const params = this.findDeviceAndLup(item)
      let queryParams = Object.assign({},{resource: 'report'},params)
      let res = await this.requestMethodGet("/web/device/queryDevice", {deviceNumber: queryParams.deviceNumber})
      if(res.data.code==1000){
        const data = res.data.data;
        data.createTime = this.moment(new Date(data.createTime)).format("YYYY-MM-DD");
        const date = new Date().getTime();
        if (Math.floor((date - data.createTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.creatNew = true;
        }
        if (Math.floor((date - data.updateTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.editNew = true;
        }
        this.epInfo = data;
      }
      this.resource = 'report'
      this.selectLubricationPointNumber = queryParams.lubricationPointNumber
      this.addDeviceDialog = true
      this.editDeviceType = 'editMulti'
    },
    // 多润滑点情况下找出设备编码和润滑点编码
    findDeviceAndLup(item){
      let params = {}
      item.children.forEach(it=>{
        if(it.nameKey == 'key_device_number'){//设备编码
          params.deviceNumber = it.value
        }
        if(it.nameKey == 'key_lup_number'){//润滑点编码
          params.lubricationPointNumber = it.value
        }
      })
      return params
    },
    // 取消编辑设备
    closeDialogAddDevice() {
      this.addDeviceDialog = false
    },  
    // 编辑设备弹框点击确定
    addOrEditDeviceAndLumpoint() {
      this.addDeviceDialog = false
      if(this.editDeviceType == 'editSingle'){
        this.handleRefresh();
      } else if (this.editDeviceType == 'editMulti'){
        this.handleRefreshItem(this.refreshItem)
      }
    }, 
    // 卡片右上角前往补充按钮
    async handleFillInfo(){
      this.resource = 'report'
      if(this.paramReportType==33){
        const list = this.paramReportNode.filter(it=>{
          return it.nodeName == '润滑点信息'
        })[0].nodeValue
        let lupType = ''
        list.forEach(it=>{
          if(it.nameKey == 'lup_type'){
            lupType = it.value
          }
        })
        if(lupType == '闭式齿轮' || lupType == '开式齿轮'){
          this.resource = 'task'
        }
      }
      let res = await this.requestMethodGet("/web/device/queryDevice", {deviceNumber: this.deviceDetailObj.deviceNumber})
      if(res.data.code==1000){
        const data = res.data.data;
        data.createTime = this.moment(new Date(data.createTime)).format("YYYY-MM-DD");
        const date = new Date().getTime();
        if (Math.floor((date - data.createTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.creatNew = true;
        }
        if (Math.floor((date - data.updateTimeMills) / 1000 / 60 / 60 / 24) == 0) {
          data.editNew = true;
        }
        this.epInfo = data;
      }
      this.selectLubricationPointNumber = this.deviceDetailObj.lubricationPointNumber
      this.addDeviceDialog = true
      this.editDeviceType = 'editSingle'
    },
    // 卡片右上角刷新数据
    handleRefresh(){
      // this.father();
      // 获取设备数据
      this.getDeviceData(this.deviceDetailObj,true)
      // 获取润滑点数据
      this.getLupData(this.deviceDetailObj,true)
      
    },
    getDeviceData(obj,flag,loopItem){
      const params = {
        deviceNumber: obj.deviceNumber
      }
      this.requestMethodGet('/web/device/queryDevice', params)
        .then(res => {
          res = res.data
          if (res.code == 1000) {
            const loopData = flag?this.cardItem.nodeValue:loopItem.children
            loopData.forEach(item => {
              // 设备名称
              if (item.nameKey == 'device_name') {
                item.value = res.data.deviceName
              }
              // 设备类型
              if (item.nameKey == 'device_type') {
                item.value = res.data.deviceTypeName
              }
              // 设备制造商名称
              if (item.nameKey == 'device_manufacturer') {
                item.value = res.data.manufacturer
              }
              if (item.nameKey == 'key_device_code') {
                item.value = res.data.deviceCode
              }
              // 设备位置
              if (item.nameKey == 'key_device_position') {
                item.value = res.data.devicePosition
              }
              // 设备型号
              if (item.nameKey == 'key_device_module') {
                item.value = res.data.deviceModel
              }
              // 所属车间
              if (item.nameKey == 'key_work_shop_name') {
                item.value = res.data.workshopName
              }
            })
            // 风机主齿箱换油报告，刷新风机参数1中的字段
            // 风机主轴承清洗服务报告  刷新风机参数中的字段
            // 风机编号：fan_number，风机型号，fan_model，风机制造商，fan_manufacturer
            
            if(this.paramReportType==1 || this.paramReportType==34){
              this.paramReportNode.filter(it=>{
                return it.nodeNo == 2
              })[0].nodeValue.forEach(it=>{
                if(it.nameKey == 'fan_number'){
                  it.value = res.data.deviceNumber
                }
                if(it.nameKey == 'fan_model'){
                  it.value = res.data.deviceModel
                }
                if(it.nameKey == 'fan_manufacturer'){
                  it.value = res.data.manufacturer
                }
              })
            }
            
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        }).catch(res => {})
    },
    getLupData(obj,flag,loopItem){
      const params = {
        lubricationPointNumber: obj.lubricationPointNumber
      }
      this.requestMethodGet('/web/device/queryLubricationPointDetail', params)
        .then(res => {
          res = res.data
          if (res.code == 1000) {
            for(let key in res.data){
              if(!res.data[key]){
                res.data[key] = ''
              }
            }
            let loopData = flag?this.cardItem.nodeValue:loopItem.children
            if(this.paramReportType==33){
              loopData = this.stepList[1].nodeValue
            }
            loopData.forEach(item => {
              if (item.nameKey == "lup_last_oil_change_date") {
                if (res.data.oilType == 2) {
                  item.value = "";
                } else {
                  item.value = res.data.lastOilChangeDate
                }
              }
              // 加油,加脂周期
              if (item.nameKey == 'key_add_oil_period' || item.nameKey == 'lup_grease_add_date' || item.nameKey == 'lup_oil_add_date') {
                // 加油周期
                item.value = res.data.oilAddPeriod
                // 修改润滑推荐报告，刷新数据后，单位没有刷新
                if(item.id=='149'&&res.data.oilAddPeriodUnit){
                  item.valueCode = res.data.oilAddPeriodUnit
                }
                item.unit = res.data.oilAddPeriodUnit == 'M' ? '月' : res.data.oilAddPeriodUnit == 'Y' ? '年' : res.data.oilAddPeriodUnit == 'D' ? '天' :res.data.oilAddPeriodUnit == 'KM' ? '公里' : '小时'
              }
              // 每次加油,加脂量
              if (item.nameKey == 'key_every_time_add_num' || item.nameKey == 'lup_per_grease' || item.nameKey == 'lup_per_refueling') {
                item.value = res.data.everyTimeOilAddQuantity
                item.unit = res.data.everyTimeOilAddQuantityUnit
              }
              // 润滑点设备制造商名称
              if (item.nameKey == 'lup_device_manufacturer') {
                item.value = res.data.lubricationPointManufacturer
              }
              // 上次加油，加脂日期
              if (item.nameKey == 'key_last_add_oil_date' || item.nameKey == 'lup_last_grease_change_date' || item.nameKey == 'lup_last_oil_add_date') {
                item.value = res.data.lastOilAddDate
              }
              if (item.nameKey == "key_149_oil_change") {
                if (res.data.oilType == 2) {
                  item.value = "";
                  item.unit =''
                } else {
                  item.value = res.data.oilChangePeriod
                  item.unit = res.data.oilChangePeriodUnitDesc
                }
              }
              // 润滑点设备名称
              if (item.nameKey == 'lup_name') {
                item.value = res.data.lubricationPointName
              }
              if (item.nameKey == 'key_desc') {
                item.value = res.data.lubricationPointDesc
              }
              if (item.nameKey == 'oil_box_quantity') {
                item.value = res.data.oilBoxQuantity
                item.display = res.data.oilType == 1
              }
              // 润滑点设备制造商名称
              if (item.nameKey == 'key_lup_manufacturer') {
                item.value = res.data.lubricationPointManufacturer
              }
              // 设备制造商推荐油品
              if (item.nameKey == 'lup_recommend_oil') {
                item.value = res.data.recommendOilName
              }
              // 润滑点图片
              if (item.nameKey == 'lup_img') {
                if (res.data.lubricationPointPicPath) {
                  let urlPic = res.data.lubricationPointPicPath
                  item.imgFullUrl = []
                  item.imgFullUrl.push(urlPic)
                  item.value = res.data.lubricationPointPicRelativePath
                } else {
                  item.imgFullUrl = []
                  item.value = ''
                }
              }
              // 润滑点设备类型
              if (item.nameKey == 'lup_type') {
                item.value = res.data.lubricationPointType
              }
              if (item.nameKey == 'lup_method') {
                item.value = res.data.lubricationMethodName
                item.valueCode = res.data.lubricationMethod
              }
              // 油箱容量
              if (item.nameKey == 'lup_oil_box_capacity') {
                item.value = res.data.oilBoxCapacity
                this.lubricationData = res.data.oilBoxCapacity
                if(this.deviceDetailObj.reportType==21){
                  this.calculatePotency()
                }
                item.unit = res.data.oilBoxCapacityUnit
                // 修改润滑推荐报告，刷新数据后，单位没有刷新
                if(item.unit&&item.id=='144'){
                  let unitArr = item.fieldOption.filter(a=>{
                    return a.option == item.unit
                  })
                  item.valueCode = unitArr[0].value
                }
                item.required = res.data.oilType == 1
              }
              if (item.nameKey == 'lup_oil_brand') {
                // 在用油品品牌
                item.value = res.data.oilBrandName
              }
              if (item.nameKey == 'lup_last_test_date') {
                item.value = res.data.lastTestDate
              }
              // 在用油品名称
              if (item.nameKey == 'lup_current_oil') {
                item.value = res.data.currentOilName
                item.valueCode = res.data.currentOilCode
              }
              // 每月润滑剂添加量
              if (item.nameKey == 'key_every_month_add_num') {
                item.value = res.data.preMonthOilAddQuantity
                item.unit = res.data.preMonthOilAddQuantityUnit
                this.everyMonthAddItem = item
              }
              // 上次换油时加注量 item.nameKey == 'key_schysjzl' && item.valueCodeNotDisplay == '1'
              if (item.nameKey == 'key_schysjzl') {
                item.value = res.data.fillingQuantity
                item.unit = res.data.fillingQuantityUnit
              }
              if (item.nameKey == 'sf_zdsc_xc_jyjh') {
                // 是否自动生成下次加油/加脂计划
                item.valueCode = res.data.autoCreateOilAddPlan ? '1' : '0'
                item.value = res.data.autoCreateOilAddPlan ? '是' : '否'
              }
              // 是否自动生成下次换油计划
              if (item.nameKey == 'sf_zdsc_xc_hyjh') {
                item.valueCode = res.data.autoCreateOilChangePlan ? '1' : '0'
                item.value = res.data.autoCreateOilChangePlan ? '是' : '否'
              }
              // 预计下次加油/加脂日期
              if(item.nameKey == 'yj_xc_jyjh'){
                item.value = res.data.nextScheduledOilAddDate
              }
              // 预计下次换油日期
              if(item.nameKey == 'lup_next_scheduled_oil_change_date'){
                item.value = res.data.nextScheduledOilChangeDate
              }
              if (item.nameKey == 'key_dq_az') {
                // 定期或按质换油？
                item.value = res.data.oilChangeMethod == '2' ? '按质' : res.data.oilChangeMethod == '1' ? '定期' : '暂无'
                item.valueCode = res.data.oilChangeMethod
                item.children.forEach(child => {
                  if (child.nameKey == 'key_has_done_oil_sysjc') {
                    child.value = res.data.hasDoneTest ? '是' : '否'
                    if (child.value) {
                      child.children[0].value = res.data.lastTestDate
                    }
                  }
                  if (item.valueCode == child.valueCodeNotDisplay) {
                    // child.nameKey == 'key_149_oil_change' && child.valueCodeNotDisplay == '1'
                    if (child.nameKey == 'key_149_oil_change') {
                      // 换油周期
                      child.value = res.data.oilChangePeriod
                      child.unit = res.data.oilChangePeriodUnitDesc
                    }
                    if (child.nameKey == 'sf_zdsc_xc_jyjh') {
                      // 是否自动生成下次加脂计划
                      child.valueCode = res.data.autoCreateOilAddPlan ? '1' : '0'
                      child.value = res.data.autoCreateOilAddPlan ? '是' : '否'
                      child.children[0].value = res.data.nextScheduledOilAddDate
                      if (res.data.oilAddPeriod != '' && res.data.oilAddPeriod != null && res.data.lastOilAddDate != '' && res.data.lastOilAddDate != null) {
                        child.display = true
                      } else {
                        child.display = false
                      }
                    }
                    if (res.data.autoCreateOilChangePlan && child.nameKey == 'sf_zdsc_xc_hyjh') {
                      // 是否自动生成下次换油计划
                      child.valueCode = '1'
                      child.children[0].value = res.data.nextScheduledOilChangeDate
                    }
                    if (child.nameKey == 'lup_last_oil_change_date') {
                      child.value = res.data.lastOilChangeDate
                    }
                    
                    if (child.nameKey == 'key_last_add_oil_date') {
                      child.value = res.data.lastOilAddDate
                    }
                    if (child.nameKey == 'key_every_time_add_num') {
                      // 每次加油量
                      child.value = res.data.everyTimeOilAddQuantity
                      child.unit = res.data.everyTimeOilAddQuantityUnit
                    }
                    // 每月油品添加量
                    if (child.nameKey == 'key_every_month_add_num') {
                      child.value = res.data.preMonthOilAddQuantity
                      child.unit = res.data.preMonthOilAddQuantityUnit
                    }
                    if (child.nameKey == 'key_schysjzl') {
                      child.value = res.data.fillingQuantity
                      child.unit = res.data.fillingQuantityUnit
                    }
                  }
                })
              }
            })
            // 风机主齿箱换油报告，刷新风机参数1中的字段 -在用油品名称，lup_current_oil
            // 风机主轴承清洗服务报告 刷新风机参数中的字段 -在用油品名称，lup_current_oil
            if(this.paramReportType==1 || this.paramReportType==34){
              this.paramReportNode.filter(it=>{
                return it.nodeNo == 2
              })[0].nodeValue.forEach(it=>{
                if(it.nameKey == 'lup_current_oil'){
                  it.value = res.data.currentOilName
                }
              })
            }
            // 风机主齿箱换油报告并且润滑点设备类型为闭式齿轮时
            if(this.paramReportType==1 ){
              console.log(1122223)
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0005' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 3
                })[0].nodeValue.forEach(it1=>{
                  console.log(122334,it1)
                  // 齿轮箱功率（kw）
                  if(it1.nameKey == 'key_input_power'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '输入功率（kw） '){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 齿轮箱型号
                  if(it1.nameKey == 'key_gearbox_model'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '齿轮箱型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 风机投运月份
                  if(it1.nameKey == 'key_operation_date'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '设备投运时间'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 设备润滑调查报告 并且 润滑点设备类型为闭式齿轮时
            if(this.paramReportType==33 ){
              console.log(1122223)
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0005' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 3
                })[0].nodeValue.forEach(it1=>{
                  // 齿轮箱功率（kw）
                  if(it1.nameKey == 'key_input_power'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '输入功率（kw） '){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 齿轮箱型号
                  if(it1.nameKey == 'key_gearbox_model'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '齿轮箱型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 速比
                  if(it1.nameKey == 'key_speed_ratio'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '速比'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 闭式齿轮内窥镜检查报告 并且 润滑点设备类型为闭式齿轮时
            if(this.paramReportType==23 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0005' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 1
                })[0].nodeValue.forEach(it1=>{
                  // 齿轮箱功率（kw）
                  if(it1.nameKey == 'power'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '输入功率（kw） '){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 转速
                  if(it1.nameKey == 'rotate_speed'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      if(iten.title == '输入转速（rpm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 齿轮箱级数
                  if(it1.nameKey == 'gearbox_series'){
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      if(iten.title == '齿轮箱级数'){
                        it1.value = iten.name
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 齿轮箱型号
                  if(it1.nameKey == 'gearbox_type'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '齿轮箱型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 速比
                  if(it1.nameKey == 'key_speed_ratio'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '速比'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 闭式齿轮检查报告 并且 润滑点设备类型为闭式齿轮时
            if(this.paramReportType==6 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0005' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 2
                })[0].nodeValue.forEach(it1=>{
                  // 齿轮箱运行状态
                  if(it1.nameKey == 'key_clxyxzt'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '齿轮箱运行状态'){
                        it1.value = iten.value
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 转速
                  if(it1.nameKey == 'key_clxcs_srzs'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      if(iten.title == '输入转速（rpm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 齿轮箱级数
                  if(it1.nameKey == 'key_clxcs_js'){
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      if(iten.title == '齿轮箱级数'){
                        it1.value = iten.value
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 齿轮箱型号
                  if(it1.nameKey == 'key_clxcs_xh'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '齿轮箱型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 速比
                  if(it1.nameKey == 'key_clxcs_sb'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '速比'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
             // 润滑节能方案及实施效益建议书 并且 润滑点设备类型为闭式齿轮时
             if(this.paramReportType==24 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0005' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 1
                })[0].nodeValue.forEach(it1=>{
                  // 齿轮箱功率（kw）
                  if(it1.nameKey == 'key_pip'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '输入功率（kw） '){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
             // 设备润滑调查报告并且润滑点设备类型为开式齿轮时
             if(this.paramReportType==33 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0011' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 3
                })[0].nodeValue.forEach(it1=>{
                  console.log(122334,it1)
                  // 齿轮箱功率（kw）
                  if(it1.nameKey == 'key_input_power'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '输入功率（kw） '){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 齿轮箱型号
                  if(it1.nameKey == 'key_gearbox_model'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '齿轮箱型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 速比
                  if(it1.nameKey == 'key_speed_ratio'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '速比'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
             // 润滑节能方案及实施效益建议书 并且 润滑点设备类型为开式齿轮时
             if(this.paramReportType==24 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0011' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 1
                })[0].nodeValue.forEach(it1=>{
                  // 齿轮箱功率（kw）
                  if(it1.nameKey == 'key_pip'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '输入功率（kw） '){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 开式齿轮检查报告 并且 润滑点设备类型为开式齿轮时
            if(this.paramReportType==8 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0011' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 2
                })[0].nodeValue.forEach(it1=>{
                  // 输出转速
                  if(it1.nameKey == 'key_1009'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      if(iten.title == '输出转速（rpm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 齿轮箱型号
                  if(it1.nameKey == 'key_1008'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '齿轮箱型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 速比
                  if(it1.nameKey == 'key_1010'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '速比'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 设备润滑调查报告 并且 润滑点设备类型为压缩机时
            if(this.paramReportType==33 ){
              console.log(1122223)
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0001' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 3
                })[0].nodeValue.forEach(it1=>{
                  // 压缩级数
                  if(it1.nameKey == 'key_compress_leve'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '压缩级数'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 设备润滑调查报告 并且 润滑点设备类型为滚动轴承时
            if(this.paramReportType==33 ){
              console.log(1122223)
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0007' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 3
                })[0].nodeValue.forEach(it1=>{
                  // 轴承品牌
                  if(it1.nameKey == 'key_827'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承品牌'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承类型
                  if(it1.nameKey == 'key_zclx'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承类型'){
                        it1.value = iten.name
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 轴承型号
                  if(it1.nameKey == 'key_829'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承转速
                  if(it1.nameKey == 'key_830'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承转速（r/min）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承内圈直径
                  if(it1.nameKey == 'key_831'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承内圈直径（mm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承外圈直径
                  if(it1.nameKey == 'key_832'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承外圈直径（mm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承宽度
                  if(it1.nameKey == 'key_833'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承宽度（mm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 该设备轴承数量
                  if(it1.nameKey == 'key_835'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '该设备轴承数量（个）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 轴承检查报告 并且 润滑点设备类型为滚动轴承时
            if(this.paramReportType==7 ){
              console.log(1122223)
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0007' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 2
                })[0].nodeValue.forEach(it1=>{
                  // 轴承品牌
                  if(it1.nameKey == 'key_827'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承品牌'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承类型
                  if(it1.nameKey == 'key_zclx'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承类型'){
                        it1.value = iten.name
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 轴承型号
                  if(it1.nameKey == 'key_829'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承转速
                  if(it1.nameKey == 'key_830'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承转速（r/min）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承内圈直径
                  if(it1.nameKey == 'key_831'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承内圈直径（mm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承外圈直径
                  if(it1.nameKey == 'key_832'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承外圈直径（mm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承宽度
                  if(it1.nameKey == 'key_833'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承宽度（mm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 轴承安装方向
                  if(it1.nameKey == 'key_834'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '轴承安装方向'){
                        it1.value = iten.name
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 设备润滑调查报告 并且 润滑点设备类型为液压系统时
            if(this.paramReportType==33 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0003' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 3
                })[0].nodeValue.forEach(it1=>{
                  // 液压系统额定压力
                  if(it1.nameKey == 'key_rated_pressure'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '液压系统额定压力（MPa）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 液压系统额定流量
                  if(it1.nameKey == 'key_rated_current'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '液压系统额定流量（L/min）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  
                })
              }
              
            }
            // 液压系统检查报告 并且 润滑点设备类型为液压系统时
            if(this.paramReportType==5 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0003' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 2
                })[0].nodeValue.forEach(it1=>{
                  // 液压系统额定压力
                  if(it1.nameKey == 'key_rated_pressure'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '液压系统额定压力（MPa）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 液压系统额定流量
                  if(it1.nameKey == 'key_rated_current'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '液压系统额定流量（L/min）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  
                })
              }
              
            }
            // 设备润滑调查报告 并且 润滑点设备类型为发动机时
            if(this.paramReportType==33 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0004' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 3
                })[0].nodeValue.forEach(it1=>{
                  // 发动机型号
                  if(it1.nameKey == 'key_engine_model'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '发动机型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 发动机排放标准
                  if(it1.nameKey == 'key_2190'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '发动机排放标准'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 燃料类型
                  if(it1.nameKey == 'key_2193'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '燃料类型'){
                        it1.value = iten.name
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 发动机进气方式
                  if(it1.nameKey == 'key_2191'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '发动机进气方式'){
                        it1.value = iten.name
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 机油滤清器品牌及型号
                  if(it1.nameKey == 'key_2200'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '机油滤清器品牌及型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 油滤清器更换周期
                  if(it1.nameKey == 'key_2201'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '机油滤清器更换周期'){
                        it1.value = iten.componentList[1][0].value
                        it1.unit = iten.componentList[1][1].name
                        it1.valueCode = iten.componentList[1][1].value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 发动机内窥镜检查报告 并且 润滑点设备类型为发动机时
            if(this.paramReportType==19 ){
              if(res.data.lubricationPointTypeCode =='lubrication_point_type_0004' && res.data.deviceWorkComponentList.length>0) {
                this.paramReportNode.filter(it=>{
                  return it.nodeNo == 2
                })[0].nodeValue.forEach(it1=>{
                  // 排放标准
                  if(it1.nameKey == 'key_2190'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '发动机排放标准'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 燃料种类
                  if(it1.nameKey == 'key_2193'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '燃料类型'){
                        it1.value = iten.name
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 发动机排量
                  if(it1.nameKey == 'key_2192'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '发动机排量'){
                        it1.value = iten.name
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 发动机进气方式
                  if(it1.nameKey == 'key_2191'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '发动机进气方式'){
                        it1.value = iten.name
                        it1.valueCode = iten.value
                      }
                      
                    })
                  }
                  // 机油滤清器品牌及型号
                  if(it1.nameKey == 'key_2200'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '机油滤清器品牌及型号'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 油滤清器更换周期
                  if(it1.nameKey == 'key_2201'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '机油滤清器更换周期'){
                        it1.value = iten.componentList[1][0].value
                        it1.unit = iten.componentList[1][1].name
                        it1.valueCode = iten.componentList[1][1].value
                      }
                      
                    })
                  }
                  // 额定转速
                  if(it1.nameKey == 'key_2188'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '额定转速（rpm）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 发动机最大输出功率（kw）
                  if(it1.nameKey == 'key_2187'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '发动机最大输出功率（kw）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 气缸数量（个）
                  if(it1.nameKey == 'key_2189'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '气缸数量（个）'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                  // 设备工作环境
                  if(it1.nameKey == 'key_2205'){
                    console.log( res.data.deviceWorkComponentList)
                     res.data.deviceWorkComponentList.forEach(iten=>{
                      console.log(iten)
                      if(iten.title == '设备工作环境'){
                        it1.value = iten.value
                      }
                      
                    })
                  }
                })
              }
              
            }
            // 轴承检查，润滑方式脂类，lubrication_method_0005|lubrication_method_0006|lubrication_method_0007|lubrication_method_0009
            // 润滑剂是否能正常加入和排出才展示
            if(this.paramReportType==7){
              const lupMethodItem=loopData.filter(it=>{
                return it.nameKey == 'lup_method'
              })[0]
              const fatMethodList = ['lubrication_method_0005','lubrication_method_0006','lubrication_method_0007','lubrication_method_0009']
              // 润滑剂是否能正常加入和排出
              let lubricantAddOrDischargeItem = this.paramReportNode.filter(it=>{
                return it.nodeName == '轴承检查'
              })[0].nodeValue.filter(nd=>{
                return nd.nameKey=='key_rhqkjc'
              })[0].children.filter(cd=>{
                return cd.nameKey=='key_rhqkjc_rhjsfnzcjrhpc'
              })[0]
              // 油位高度
              let oilHeightItem = this.paramReportNode.filter(it=>{
                return it.nodeName == '轴承检查'
              })[0].nodeValue.filter(nd=>{
                return nd.nameKey=='key_rhqkjc'
              })[0].children.filter(cd=>{
                return cd.nameKey=='key_rhqkjc_zcxywgd'
              })[0]
              // 有无呼吸器
              let haveRespirator = this.paramReportNode.filter(it=>{
                return it.nodeName == '轴承检查'
              })[0].nodeValue.filter(nd=>{
                return nd.nameKey=='key_rhqkjc'
              })[0].children.filter(cd=>{
                return cd.nameKey=='key_rhqkjc_hxflx'
              })[0]
              if(fatMethodList.includes(lupMethodItem.valueCode)){//脂类
                lubricantAddOrDischargeItem.value='是'
                lubricantAddOrDischargeItem.valueCode='1'
                oilHeightItem.value='正常'
                oilHeightItem.valueCode='1'
                oilHeightItem.display = false
                haveRespirator.value = '无呼吸器'
                haveRespirator.valueCode = '1'
                haveRespirator.display = false
              }else{//油类
                lubricantAddOrDischargeItem.value='否'
                lubricantAddOrDischargeItem.valueCode='2'
                oilHeightItem.value='正常'
                oilHeightItem.valueCode='1'
                oilHeightItem.display = true
                haveRespirator.value = '有呼吸器'
                haveRespirator.valueCode = '2'
                haveRespirator.display = true
              }
              this.handleHiddenOrShow(lubricantAddOrDischargeItem)
              this.handleHiddenOrShow(oilHeightItem)
              this.handleHiddenOrShow(haveRespirator)
              this.handleBearingDeviceAndOilInfo(loopData)
            }
            // 开式齿轮检查
            if(this.paramReportType==8){
              const lupMethodItemValueCode=loopData.filter(it=>{
                return it.nameKey == 'lup_method'
              })[0].valueCode
              this.paramReportNode.filter(it=>{
                return it.tabFlag
              })[0].nodeValue.forEach(nd=>{
                if(nd.nameKey == 'key_kscl_psxt'){
                  nd.display = lupMethodItemValueCode == 'lubrication_method_0003'
                }
              })
              // 每月润滑剂添加量:key_every_month_add_num
              const injectionSystemitem =  this.paramReportNode.filter(it=>{
                return it.tabFlag
              })[0].nodeValue.filter(item=>{
                return item.nameKey == 'key_kscl_psxt'
              })[0].children[0].children.filter(ps=>{
                return ps.nameKey == 'key_1060'
              })[0].children
              injectionSystemitem.forEach(it=>{
                // 每月润滑剂添加量
                if(it.nameKey == 'key_every_month_add_num'){
                  if(this.everyMonthAddItem.unit=='KG'){
                    it.value = (this.everyMonthAddItem.value/0.87).toFixed(2)
                  }else {
                    it.value = this.everyMonthAddItem.value
                  }
                  this.everyMonthAddVal = it.value
                }
              })
              injectionSystemitem.forEach(it=>{
                // 月工作时间
                if(it.nameKey == 'key_kscl_psxt_psxt_ygzsj'){
                  this.monthWorkNum = it.value
                }
              })
              // 实际每分钟喷射量
              injectionSystemitem.forEach(it=>{
                if(it.nameKey == 'key_kscl_psxt_psxt_sjmfzpsl'){
                  if(this.everyMonthAddVal && this.monthWorkNum){
                    it.value = ((Number(this.everyMonthAddVal)*1000)/(Number(this.monthWorkNum)*60)).toFixed(3)
                  }else{
                    it.value = ''
                  }
                }
              })
              this.handleOpenGearDeviceAndOilInfo(loopData)
            }
            this.handleRegItem()
            this.cardItem.nodeValue.forEach(item=>{
              this.handleHiddenOrShow(item)
            })
            // 润滑油换油周期优化建议书,刷新油品优化建议-推荐换油周期单位
            if(this.paramReportType==15){
              // 找到换油周期单位
              const unit = res.data.oilChangePeriod
              const unitName = res.data.oilChangePeriodUnitDesc
              this.paramReportNode.filter(it=>{
                return it.nodeNo == 3
              })[0].nodeValue.forEach(item=>{
                if(item.nameKey == 'key_150_oil_change'){
                  item.unit = unitName
                }
              })
            }
            // 润滑脂加脂周期优化报告,总结与建议,推荐加脂周期:key_150_oil_add
            if(this.paramReportType==16){
              const unitName = res.data.oilAddPeriodUnit == 'M' ? '月' : res.data.oilAddPeriodUnit == 'Y' ? '年' : res.data.oilAddPeriodUnit == 'D' ? '天' :res.data.oilAddPeriodUnit == 'KM' ? '公里' : '小时'
              this.paramReportNode.filter(it=>{
                return it.nodeNo == 5
              })[0].nodeValue.forEach(item=>{
                if(item.nameKey == 'key_add_oil_period'){
                  item.value = res.data.oilAddPeriod
                  item.unit = unitName
                }
                if(item.nameKey == 'key_150_oil_add'){
                  item.unit = unitName
                }
              })
            }
            if(this.paramReportType==11){
              this.handleChangeOilSuggestNode()
            }
            if(this.paramReportType==24){
              const nodeOne = this.paramReportNode.filter(it=>{
                return it.nodeNo == 1
              })[0]
              // 找出润滑点设备类型，开式齿轮
              const lupDeviceType = nodeOne.nodeValue.filter(it=>{
                return it.nameKey=='lup_type'
              })[0].value
              // 找出润滑方式,喷射：lubrication_method_0003
              const lupMethod = nodeOne.nodeValue.filter(it=>{
                return it.nameKey=='lup_method'
              })[0].valueCode
              // 定期或按质换油、换油周期、上次换油日期不是开式齿轮且喷射展示
              const nameKeyList = ['key_dq_az','key_149_oil_change','lup_last_oil_change_date']
              if(lupDeviceType == '开式齿轮' && lupMethod == 'lubrication_method_0003'){
                nodeOne.nodeValue.forEach(it=>{
                  if(nameKeyList.includes(it.nameKey)){
                    it.display = false
                  }
                })
              }
            }
            // 润滑推荐-刷新后换油/加脂周期赋值
            if(this.paramReportType==3){
              let lupType = ''//润滑点设备类型
              let lupMethod = ''//润滑方式
              let val = ''//换油/加脂周期数据
              let unitCode = ''//换油/加脂周期单位code
              let unitName = ''//换油/加脂周期单位名称
              loopData.forEach(it=>{
                // 在用油品名称
                if (it.nameKey == 'key_140') {
                  it.value = res.data.currentOilName
                  it.valueCode = res.data.currentOilCode
                }
                if(it.nameKey=='lup_type'){
                  lupType = it.valueCode
                }
                if(it.nameKey == 'lup_method'){
                  lupMethod = it.valueCode
                }
              })
              // 1：换油。2：加油，3：加脂
              if((lupType == 'lubrication_point_type_0011' && lupMethod == 'lubrication_method_0003')){//开式齿轮，喷射
                // 加油
                val = res.data.oilAddPeriod
                unitCode = res.data.oilAddPeriodUnit
                unitName = res.data.oilAddPeriodUnit == 'M' ? '月' : res.data.oilAddPeriodUnit == 'Y' ? '年' : res.data.oilAddPeriodUnit == 'D' ? '天' :res.data.oilAddPeriodUnit == 'KM' ? '公里' : '小时'
              }
              if(lupType != 'lubrication_point_type_0011' &&
              (lupMethod=='lubrication_method_0001' || 
              lupMethod=='lubrication_method_0002' || 
              lupMethod=='lubrication_method_0003' || 
              lupMethod=='lubrication_method_0008')){//换油
                val = res.data.oilChangePeriod
                unitCode = res.data.oilChangePeriodUnit
                unitName = res.data.oilChangePeriodUnitDesc
              }
              if(lupType != 'lubrication_point_type_0011' && 
              (lupMethod=='lubrication_method_0005' || lupMethod=='lubrication_method_0006' || 
                lupMethod=='lubrication_method_0007' || lupMethod=='lubrication_method_0009')){//加脂
                  val = res.data.oilAddPeriod
                  unitCode = res.data.oilAddPeriodUnit
                  unitName = res.data.oilAddPeriodUnit == 'M' ? '月' : res.data.oilAddPeriodUnit == 'Y' ? '年' : res.data.oilAddPeriodUnit == 'D' ? '天' :res.data.oilAddPeriodUnit == 'KM' ? '公里' : '小时'
              }
              if(lupType == 'lubrication_point_type_0011' && 
              (lupMethod=='lubrication_method_0001' || 
              lupMethod=='lubrication_method_0002' ||  
              lupMethod=='lubrication_method_0008')){//换油
                val = res.data.oilChangePeriod
                unitCode = res.data.oilChangePeriodUnit
                unitName = res.data.oilChangePeriodUnitDesc
              }

              if(lupType == 'lubrication_point_type_0011' && 
              (lupMethod=='lubrication_method_0005' || lupMethod=='lubrication_method_0006' || 
              lupMethod=='lubrication_method_0007' || lupMethod=='lubrication_method_0009')){//加脂
                val = res.data.oilAddPeriod
                unitCode = res.data.oilAddPeriodUnit
                unitName = res.data.oilAddPeriodUnit == 'M' ? '月' : res.data.oilAddPeriodUnit == 'Y' ? '年' : res.data.oilAddPeriodUnit == 'D' ? '天' :res.data.oilAddPeriodUnit == 'KM' ? '公里' : '小时'
              }
              loopData.forEach(it=>{
                if(it.nameKey == 'key_149_oil_change'){
                  it.unit = unitName
                  it.value = val
                  it.valueCode = unitCode
                }
              })
            }
            // 设备润滑调查，更新润滑点信息
            if(this.paramReportType==33){
              this.handlePlanStudyLupInfo(loopData)
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
    },
    calculatePotency() {
      if(!this.lubricationData) return
      let potency = ''
      let cleanOil = '' // 清洗剂油量
      let addTo = this.stepList[2].nodeValue.find(it=>{
        return it.nameKey == 'key_add'
      })
      if(!addTo.valueCode){
        return
      }
      if(addTo.valueCode==2){ // 选择的是一次冲洗用油
        return
      }

      if(addTo.valueCode==1){ // 选择的是在用油
        this.stepList[1].nodeValue.forEach(itemA=>{  // 清洗剂油量
          if(itemA.nameKey == 'oil_quantity'){
            cleanOil = itemA.value
          }
        })
        if(cleanOil){
          potency = Number(cleanOil)/Number(this.lubricationData)
        }
      }

      if(potency){
        potency = (potency*100).toFixed(2)+'%'
      }
      this.stepList[2].nodeValue.forEach(nodeItem=>{
        if(nodeItem.nameKey=='key_potency'){
          nodeItem.value = potency
        }
      })
    }
  },
}