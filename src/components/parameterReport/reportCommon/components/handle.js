import _ from "lodash"

export default{
  data(){
    return{
      stepList:[],
      reportObj:{},
      deviceLupOilInfoItem:{},
      equipmentApplicationItem:{},
      faultDescItem:{},
      causeAnalysisItem:{},
      summarySuggestItem:{},
      appendixItem:{},
      addFieldPoolDtoList:[],
      orderInfo:{},
      userInfo:JSON.parse(this.Decrypt(sessionStorage.getItem('userInfo'))),
      reportItemKey:1
    }
  },
  created() {
    this.getDetail()
  },
  methods:{
    getDetail(val){
      console.log(val)
      const loading = this.$loading({
        lock: true,
        text: '请稍后，Loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.requestMethodGet('/serviceReport/queryServiceDraftDetail', { draftId: this.$route.query.draftId }).then(res => {
        if(res.data.code == 1000){
          ++this.reportKey
          const data = res.data.data
          this.paramReportType = res.data.data.reportType
          const stepListData = data.draftDetailJsonDtoList
          
          stepListData.forEach((it,index)=>{
            it.scrollId='id'+index
            it.reportType = data.reportType
            if(it.id!=155601){ // 隐藏润滑调查报告润滑点信息的前往补充按钮，润滑调查报告润滑点信息的id==155601
              it.isShowEdit = this.isGoToEditDevice(it.nodeValue,'goToEditDevice')
            }
            it.isImportFile = it.nodeName == '自动便携验油箱验油数据' || it.nodeName == '验油数据'
            it.isCountAddFatFlag = it.nodeName == '润滑脂润滑轴承参数和加脂周期计算' && data.reportType == 16
            if(data.reportType != 3){
              it.isShowLupBlock = this.isGoToEditDevice(it.nodeValue,'button_device')
            }
            if(data.reportType == 21){
              if(it.nodeNo==2){
                let cleanPurLevel = it.nodeValue.find(item=>{
                  return item.nameKey=='clean_pur_level'
                })
                if(cleanPurLevel.valueCode){
                  it.nodeValue.forEach(itemA=>{
                    if(itemA.nameKey=='clean_value'){
                      itemA.defaultValue=cleanPurLevel.valueCode
                      itemA.valueCode = Number(itemA.valueCode)
                    }
                  })
                }
              }
              if(it.nodeNo==3){
                let purPurLevel = it.nodeValue.find(item=>{
                  return item.nameKey=='pur_actual_level'
                })
                if(purPurLevel.valueCode){
                  it.nodeValue.forEach(itemA=>{
                    if(itemA.nameKey=='pur_actual_value'){
                      itemA.defaultValue=purPurLevel.valueCode
                      itemA.valueCode = Number(itemA.valueCode)
                    }
                  })
                }
              }
            }
            if(data.reportType == 1 && it.nodeName == '总结与建议'){
              it.nodeValue.forEach(nd=>{
                if(nd.type == 'title'){
                  nd.value = nd.value.replace(/@#!/g, "<br/>")
                  nd.isTextFlag = true
                }
              })
            }
            if(data.reportType == 33 && it.nodeName == '总结与建议'){
              it.nodeValue.forEach(nd=>{
                if(nd.type == 'title'){
                  nd.value = nd.value.replace(/@#!/g, "<br/>")
                  nd.isTextFlag = true
                }
              })
            }
          })
          // 润滑推荐-初始判断系统润滑点，字段不可编辑
          if(data.reportType == 3){
            // 设备名称 input1
            // 设备类型 dropdown
            // 润滑点设备名称 input1
            // 润滑点设备类型 dropdown7
            // 润滑方式 dropdown2
            // 油箱容量 input4
            // 换油/加脂周期  input4
            const defaultNameKey = ['device_name','key_device_code','device_type','lup_name','lup_type','lup_method','lup_oil_box_capacity','key_149_oil_change','key_140']
            stepListData[stepListData.length-1].nodeValue[0].children.forEach(item=>{
              item.isSystemLup = false
              item.deviceTypeCode = ''
              item.children.forEach(it=>{
                it.isSystemLup = true
                if(it.nameKey == 'key_lup_id' && it.value){
                  item.isSystemLup = true
                }
                if(it.nameKey=='device_type'){
                  item.deviceTypeCode = it.valueCode
                }
              })
            })
            stepListData[stepListData.length-1].nodeValue[0].children.forEach(item=>{
              if(item.isSystemLup){
                item.children.forEach(it=>{
                  it.disabled = defaultNameKey.includes(it.nameKey)
                  it.isSystemLup = true
                })
              }else{
                item.children.forEach(it=>{
                  it.isSystemLup = false
                })
              }
            })
            // 润滑点清单
            const lg = stepListData[stepListData.length-1].nodeValue[0].children.length
            stepListData[stepListData.length-1].nodeValue[0].children.forEach((it,idx)=>{
              if(!it.isSystemLup && it.deviceTypeCode){
                const params = {
                  deviceCode:it.deviceTypeCode,
                  lubPointName:'',
                  status:1,
                  current:1,
                  size:100
                }
                this.requestMethodGet("/device/coreDeviceLubPoint/pageList", params).then(res=>{
                  if (res.data.code == 1000) {
                    const list = res.data.data.list || []
                    if(list.length){
                      list.forEach(it=>{
                        it.isCustomFlag = false
                      })
                    }
                    let obj = {
                      lubPointName:'自定义',
                      isCustomFlag:true
                    }
                    list.push(obj)
                    it.nameList = list
                    const nameArr = list.map(it=>{
                      return it.lubPointName
                    })
                    it.children.forEach(item=>{
                      if(item.nameKey=='lup_name'){
                        item.customerNameValue = item.value
                        item.isLupNameFlag = list.length>1
                        item.nameListData = it.nameList
                        if(list.length>1){
                          if(nameArr.includes(item.value)){
                            item.customerSelectNameValue = item.value
                          }else if(!nameArr.includes(item.value)){
                            item.customerSelectNameValue='自定义'
                          }
                        }
                      }
                    })
                    if(idx == lg-1){
                      this.handleStepListData(stepListData)
                      ++this.reportItemKey
                    }
                  }
                })
              }else{
                it.nameList = []
                it.children.forEach(item=>{
                  if(item.nameKey=='lup_name'){
                    item.nameListData = []
                    item.customerNameValue = ''
                    item.isLupNameFlag = false
                  }
                })
                if(idx == lg-1){
                  this.handleStepListData(stepListData)
                  ++this.reportItemKey
                }
              }
            })
          }
          if(data.reportType == 17 || data.reportType == 3){
            // 查询工单详情,添加润滑点用到的数据
           this.getWorkOrderDetail(data.workOrderNumber,stepListData)
          }
          if(data.reportType == 24){
            // 润滑节能方案报告，将执行人赋值给服务执行人所属公司名称，执行人取当前登陆人
            this.setExcuteCompany(stepListData)
          }
          this.addFieldPoolDtoList = data.addFieldPoolDtoList
          this.reportObj = _.omit(data,['safeTipDto','dynamicItemDto','draftDetailJsonDtoList','addFieldPoolDtoList'])
          loading.close()
          
          this.handleStepListData(stepListData)
        }else{
          loading.close()
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    handleStepListData(stepListData){

      
      this.stepList = JSON.parse(JSON.stringify(stepListData))
      this.refreshFlag = true
      
    },
    getWorkOrderDetail(orderNumber,stepListData){
      this.requestMethodGet("/weChat/workOrder/queryWorkOrderDetail", {workOrderNumber:orderNumber}).then(res => {
        if(res.data.code == 1000){
          this.orderInfo = res.data.data
          this.handleStepListData(stepListData)
        }else{
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      })
    },
    setExcuteCompany(stepListData) {
      stepListData[4].nodeValue.forEach(item=>{
        if(item.nameKey=='excute_company_name'){
          item.value=this.userInfo.orgInfo.companyName
        }
      })
      this.handleStepListData(stepListData)
    },
    isGoToEditDevice(arr,type){
      let flag = false
      arr.forEach(it=>{
        if(it.type == type&&it.id!='4841'){
          // 隐藏润滑调查报告润滑点信息的前往补充按钮，润滑调查报告润滑点信息的id==4841
          flag = true
        }
      })
      return flag
    },
  }
}