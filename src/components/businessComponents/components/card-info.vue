<template>
  <div>
    <el-card style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
      <div slot="header" class="title" style="display:flex;align-items:center;justify-content: space-between;">
        <div style="display:flex;align-items:center;">
          <div class="line-vertical"></div>
          <div style="margin:0px 8px">{{cardItem.nodeName}}</div>
          <el-tooltip class="item" effect="dark" content="设备及润滑点信息请点击【前往补充】按钮，前往设备编辑页" placement="top-start">
            <el-button type="text" style="color:#333;font-size:15px;padding:0px;">
              <i class="el-icon-warning-outline"></i>
            </el-button>
          </el-tooltip>
        </div>
        <div style="display:flex;align-items:center;justify-content: space-between;">
          <!-- <div @click="handleRefresh" style="color:#001450;font-weight:normal;font-size:13px;margin-right:20px;cursor: pointer;">
            <i class="el-icon-refresh-right" style="margin-right:4px;"></i>刷新数据
          </div> -->
          <div @click="handleEdit" style="color:#001450;font-weight:normal;font-size:13px;cursor: pointer;"><i class="el-icon-edit" style="margin-right:4px;"></i> 前往补充</div>
        </div>
      </div>
      <slot></slot>
    </el-card>
    <!-- 编辑设备和润滑点 -->
    <CreateDevice
      v-if="addDeviceDialog"
      :deviceTypeDialog="deviceTypeDialog"
      :selectLubricationPointNumber="selectLubricationPointNumber"
      :addDeviceDialog="addDeviceDialog"
      :resource='resource'
      :epInfo="deviceDetailObj"
      v-on:addOrEditDeviceAndLumpoint="addOrEditDeviceAndLumpoint"
      v-on:closeDialogAddDevice="closeDialogAddDevice"
    />
  </div>
</template>

<script>
import CreateDevice from "../../equipment/components/CreateDevice.vue";
export default {
  props: {
    cardItem:{
      type:Object,
      default:{}
    },
    deviceDetailObj:{
      type:Object,
      default:{}
    }
  },
  components: {
    CreateDevice
  },
  data () {
    return {
      resource: 'report',
      addDeviceDialog: false,
      deviceTypeDialog: 'editDeviceAndLumPoint',
      selectLubricationPointNumber: "",
      deviceForm:[]
    }
  },
  watch:{
    deviceDetailObj:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
          this.deviceDetailObj = val
        }
      },
      immediate:true
    },
    cardItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
          this.deviceForm = val.nodeValue
        }
      },
      immediate:true
    },
  },
  created () {
  },
  methods: {
    // 取消编辑设备
    closeDialogAddDevice() {
      this.addDeviceDialog = false
    },  
    // 编辑设备弹框点击确定
    addOrEditDeviceAndLumpoint() {
      this.selectLubricationPointNumber = this.deviceDetailObj.lubricationPointNumber
      this.addDeviceDialog = false
      this.handleRefresh()
    }, 
    // 查询设备档案详情
    $_queryEPInfo () {
      let params = {
        deviceNumber: this.deviceDetailObj.deviceNumber
      }
      this.requestMethodGet('/web/device/queryDevice', params)
        .then(res => {
          res = res.data
          if (res.code == 1000) {
            this.deviceForm.filter(item => {
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
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
    },
    // 查看润滑点详情
    $_getLubricationPointDetail () {
      let params = {
        lubricationPointNumber: this.deviceDetailObj.lubricationPointNumber
      }
      this.requestMethodGet('/web/device/queryLubricationPointDetail', params)
        .then(res => {
          res = res.data
          if (res.code == 1000) {
            this.$emit('refreshOilChangeUnit',res.data.oilChangePeriodUnitDesc)
              this.deviceForm.map(item => {
                if (item.nameKey == "lup_last_oil_change_date" && this.deviceDetailObj.reportType == '9') {
                  if (res.data.oilType == 2) {
                    item.value = "--";
                  } else {
                    item.value = res.data.lastOilChangeDate;
                  }
                }
                if (item.nameKey == "lup_last_oil_change_date" && this.deviceDetailObj.reportType != '9') {
                  if (res.data.oilType == 2) {
                    item.value = "";
                  } else {
                    item.value = res.data.lastOilChangeDate;
                  }
                }
                // 加油周期
                if (item.nameKey == 'key_add_oil_period') {
                  // 加油周期
                  item.value = res.data.oilAddPeriod
                  item.unit = res.data.oilAddPeriodUnit == 'M' ? '月' : res.data.oilAddPeriodUnit == 'Y' ? '年' : res.data.oilAddPeriodUnit == 'D' ? '天' : '小时'
                }
                if (item.nameKey == 'key_every_time_add_num') {
                  // 每次加油量
                  item.value = res.data.everyTimeOilAddQuantity
                  item.unit = res.data.everyTimeOilAddQuantityUnit
                }
                // 润滑点设备制造商名称
                if (item.nameKey == 'lup_device_manufacturer') {
                  item.value = res.data.lubricationPointManufacturer
                }
                // 上次加油日期
                if (item.nameKey == 'key_last_add_oil_date') {
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
                  item.unit = res.data.oilBoxCapacityUnit
                  item.required = res.data.oilType == 1
                }
                if (item.nameKey == 'lup_last_oil_change_date') {
                  item.value = res.data.lastOilChangeDate
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
                      if (child.nameKey == 'key_149_oil_change' && child.valueCodeNotDisplay == '1') {
                        // 换油周期
                        child.value = res.data.oilChangePeriod
                        child.unit = res.data.oilChangePeriodUnitDesc
                      }
                      if (res.data.autoCreateOilAddPlan && child.nameKey == 'sf_zdsc_xc_jyjh') {
                        // 是否自动生成下次加油计划
                        child.valueCode = '1'
                        child.children[0].value = res.data.nextScheduledOilAddDate
                      }
                      if (res.data.autoCreateOilChangePlan && child.nameKey == 'sf_zdsc_xc_hyjh') {
                        // 是否自动生成下次换油计划
                        child.valueCode = '1'
                        child.children[0].value = res.data.nextScheduledOilChangeDate
                      }
                      if (child.nameKey == 'lup_last_oil_change_date') {
                        child.value = res.data.lastOilChangeDate
                      }
                      if (child.nameKey == 'key_add_oil_period') {
                        // 加油周期
                        child.value = res.data.oilAddPeriod
                        child.unit = res.data.oilAddPeriodUnit == 'M' ? '月' : res.data.oilAddPeriodUnit == 'Y' ? '年' : res.data.oilAddPeriodUnit == 'D' ? '天' : '小时'
                      }
                      if (child.nameKey == 'key_last_add_oil_date') {
                        child.value = res.data.lastOilAddDate
                      }
                      if (child.nameKey == 'key_every_time_add_num') {
                        // 每次加油量
                        child.value = res.data.everyTimeOilAddQuantity
                        child.unit = res.data.everyTimeOilAddQuantityUnit
                      }
                      if (child.nameKey == 'key_every_month_add_num') {
                        // 每月油品添加量
                        child.value = res.data.preMonthOilAddQuantity
                        child.unit = res.data.preMonthOilAddQuantityUnit
                      }
                      if (child.nameKey == 'key_schysjzl' && child.valueCodeNotDisplay == '1') {
                        child.value = res.data.fillingQuantity
                        child.unit = res.data.fillingQuantityUnit
                      }
                    }
                  })
                }
              })
            // }
            if (this.deviceDetailObj.reportType != '1' && this.deviceDetailObj.reportType != '2' && this.deviceDetailObj.reportType != '3') {
              if (
                (this.deviceDetailObj.reportType == '9') || (this.deviceDetailObj.reportType == '10') || (this.deviceDetailObj.reportType == '11') || (this.deviceDetailObj.reportType == '8' && res.data.lubricationPointTypeCode == 'lubrication_point_type_0011') ||
                (this.deviceDetailObj.reportType == '7' && res.data.lubricationPointTypeCode == 'lubrication_point_type_0007') ||
                (this.deviceDetailObj.reportType == '4' &&
                  (res.data.lubricationPointTypeCode == 'lubrication_point_type_0012' ||
                    res.data.lubricationPointTypeCode == 'lubrication_point_type_0013' ||
                    res.data.lubricationPointTypeCode == 'lubrication_point_type_0014' ||
                    res.data.lubricationPointTypeCode == 'lubrication_point_type_0015')) ||
                (this.deviceDetailObj.reportType == '5' && res.data.lubricationPointTypeCode == 'lubrication_point_type_0003') ||
                (this.deviceDetailObj.reportType == '6' &&
                  (res.data.lubricationPointTypeCode == 'lubrication_point_type_0008' ||
                    res.data.lubricationPointTypeCode == 'lubrication_point_type_0006' ||
                    res.data.lubricationPointTypeCode == 'lubrication_point_type_0005'))
              ) {
                this.$_queryEPInfo()
                this.deviceDetailObj.oilType = res.data.oilType
                this.deviceDetailObj.lubricationMethod = res.data.lubricationMethod
                if (res.data.oilType == 1) {
                  if (res.data.lubricationMethod == 'lubrication_method_0004' && this.deviceDetailObj.reportType == '7') {
                    this.lubricationMethodType = 2
                  } else if (res.data.lubricationMethod == 'lubrication_method_0003' && this.deviceDetailObj.reportType == '8') {
                    // 如果是特殊油类  喷射
                    this.lubricationMethodType = 3
                  } else {
                    this.lubricationMethodType = 1
                  }
                } else {
                  // 如果是脂类
                  this.lubricationMethodType = 4
                }
                this.deviceForm.map(item => {
                  if (item.nameKey == 'lup_name') {
                    item.value = res.data.lubricationPointName
                  }
                  if (item.nameKey == 'key_desc') {
                    item.value = res.data.lubricationPointDesc
                  }
                  if (item.nameKey == 'oil_box_quantity') {
                    // 油箱数量
                    item.value = res.data.oilBoxQuantity
                    item.display = res.data.oilType == 1
                  }
                  if (item.nameKey == 'key_lup_manufacturer') {
                    // 润滑点设备制造商名称
                    item.value = res.data.lubricationPointManufacturer
                  }
                  if (item.nameKey == 'lup_recommend_oil') {
                    // 设备制造商推荐油品
                    item.value = res.data.recommendOilName
                  }
                  if (item.nameKey == 'lup_img') {
                    // 润滑点图片
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
                  if (item.nameKey == 'lup_type') {
                    item.value = res.data.lubricationPointType
                  }
                  if (item.nameKey == 'lup_method') {
                    item.value = res.data.lubricationMethodName
                    item.valueCode = res.data.lubricationMethod
                  }
                  // 油箱容量
                  if (item.nameKey == 'lup_oil_box_capacity' && (this.deviceDetailObj.reportType == '4' || this.deviceDetailObj.reportType == '5' || this.deviceDetailObj.reportType == '6')) {
                    item.value = res.data.oilBoxCapacity
                    item.unit = res.data.oilBoxCapacityUnit
                  }
                  // 油箱容量
                  if (
                    item.nameKey == 'lup_oil_box_capacity' &&
                    (this.deviceDetailObj.reportType == '1' ||
                      this.deviceDetailObj.reportType == '2' ||
                      this.deviceDetailObj.reportType == '3' ||
                      this.deviceDetailObj.reportType == '7' ||
                      this.deviceDetailObj.reportType == '8')
                  ) {
                    item.value = res.data.oilBoxCapacity
                    item.unit = res.data.oilBoxCapacityUnit
                    item.required = res.data.oilType == 1
                  }
                  if (item.nameKey == 'lup_last_oil_change_date') {
                    item.value = res.data.lastOilChangeDate
                  }
                  if (item.nameKey == 'lup_oil_brand') {
                    // 在用油品品牌
                    item.value = res.data.oilBrandName
                  }
                  if (item.nameKey == 'lup_last_test_date') {
                    item.value = res.data.lastTestDate
                  }
                  if (item.nameKey == 'lup_current_oil') {
                    item.value = res.data.currentOilName
                  }
                  // 定期或按质换油？    普通油类
                  if (item.nameKey == 'key_dq_az' && this.lubricationMethodType == '1') {
                    item.value = res.data.oilChangeMethod == '2' ? '按质' : res.data.oilChangeMethod == '1' ? '定期' : '暂无'
                    item.valueCode = res.data.oilChangeMethod
                    item.children.forEach(child => {
                      if (child.nameKey == 'key_has_done_oil_sysjc') {
                        child.value = res.data.hasDoneTest ? '是' : '否'
                        child.valueCode = res.data.hasDoneTest ? '1' : '0'
                        if (child.value) {
                          child.children[0].value = res.data.lastTestDate
                        }
                      }
                      if (item.valueCode == child.valueCodeNotDisplay) {
                        if (child.nameKey == 'key_149_oil_change') {
                          // 换油周期
                          child.value = res.data.oilChangePeriod
                          child.unit = res.data.oilChangePeriodUnitDesc
                        }
                        if (child.nameKey == 'sf_zdsc_xc_jyjh') {
                          // 是否自动生成下次加油计划
                          child.valueCode = res.data.autoCreateOilAddPlan ? '1' : '0'
                          child.value = res.data.autoCreateOilAddPlan ? '是' : '否'
                          child.children[0].value = res.data.nextScheduledOilAddDate
                          if (res.data.oilAddPeriod != '' && res.data.oilAddPeriod != null && res.data.lastOilAddDate != '' && res.data.lastOilAddDate != null) {
                            child.display = true
                          } else {
                            child.display = false
                          }
                        }
                        if (child.nameKey == 'sf_zdsc_xc_hyjh') {
                          // 是否自动生成下次换油计划
                          child.valueCode = res.data.autoCreateOilChangePlan ? '1' : '0'
                          child.value = res.data.autoCreateOilChangePlan ? '是' : '否'
                          child.children[0].value = res.data.nextScheduledOilChangeDate
                          if (res.data.oilChangePeriod != '' && res.data.oilChangePeriod != null && res.data.lastOilChangeDate != '' && res.data.lastOilChangeDate != null) {
                            child.display = true
                          } else {
                            child.display = false
                          }
                        }
                        if (child.nameKey == 'lup_last_oil_change_date') {
                          // 上次换油日期
                          child.value = res.data.lastOilChangeDate
                        }

                        if (child.nameKey == 'key_add_oil_period') {
                          // 加油周期
                          child.value = res.data.oilAddPeriod
                          child.unit = res.data.oilAddPeriodUnit == 'M' ? '月' : res.data.oilAddPeriodUnit == 'Y' ? '年' : res.data.oilAddPeriodUnit == 'D' ? '天' : '小时'
                        }
                        if (child.nameKey == 'key_last_add_oil_date') {
                          child.value = res.data.lastOilAddDate
                        }
                        if (child.nameKey == 'key_every_time_add_num') {
                          // 每次加油量
                          child.value = res.data.everyTimeOilAddQuantity
                          child.unit = res.data.everyTimeOilAddQuantityUnit
                        }
                        if (child.nameKey == 'key_every_month_add_num') {
                          // 每月油品添加量
                          child.value = res.data.preMonthOilAddQuantity
                          child.unit = res.data.preMonthOilAddQuantityUnit
                        }
                        if (child.nameKey == 'key_schysjzl') {
                          // 上次换油时加注量
                          child.value = res.data.fillingQuantity
                          child.unit = res.data.fillingQuantityUnit
                          if (res.data.lastOilChangeDate != null && res.data.lastOilChangeDate != '') {
                            child.display = true
                          } else {
                            child.display = false
                          }
                        }
                      }
                    })
                  }
                  // 油雾
                  if (item.nameKey == 'pen_she_you_wu_method' && (this.lubricationMethodType == '2' || this.lubricationMethodType == '3')) {
                    item.value = res.data.oilChangeMethod == '2' ? '按质' : res.data.oilChangeMethod == '1' ? '定期' : '暂无'
                    item.valueCode = res.data.oilChangeMethod
                    item.children.forEach(child => {
                      if (child.nameKey == 'sf_zdsc_xc_jyjh') {
                        // 是否自动生成下次加油计划
                        child.valueCode = res.data.autoCreateOilAddPlan ? '1' : '0'
                        child.value = res.data.autoCreateOilAddPlan ? '是' : '否'
                        child.children[0].value = res.data.nextScheduledOilAddDate
                        if (res.data.oilAddPeriod != '' && res.data.oilAddPeriod != null && res.data.lastOilAddDate != '' && res.data.lastOilAddDate != null) {
                          child.display = true
                        } else {
                          child.display = false
                        }
                      }
                      if (child.nameKey == 'key_add_oil_period') {
                        // 加油周期
                        child.value = res.data.oilAddPeriod
                        child.unit = res.data.oilAddPeriodUnit == 'M' ? '月' : res.data.oilAddPeriodUnit == 'Y' ? '年' : res.data.oilAddPeriodUnit == 'D' ? '天' : '小时'
                      }
                      if (child.nameKey == 'key_last_add_oil_date') {
                        // 上次加油日期
                        child.value = res.data.lastOilAddDate
                      }
                      if (child.nameKey == 'key_every_time_add_num') {
                        // 每次加油量
                        child.value = res.data.everyTimeOilAddQuantity
                        child.unit = res.data.everyTimeOilAddQuantityUnit
                      }
                      if (child.nameKey == 'key_every_month_add_num') {
                        // 每月油品添加量
                        child.value = res.data.preMonthOilAddQuantity
                        child.unit = res.data.preMonthOilAddQuantityUnit
                      }
                    })
                  }
                  // 脂类
                  if (item.nameKey == 'lup_method_zhi_lei' && this.lubricationMethodType == '4') {
                    item.children.forEach(child => {
                      if (child.nameKey == 'key_has_done_oil_sysjc') {
                        // 是否做过油品实验室检测
                        child.value = res.data.hasDoneTest ? '是' : '否'
                        child.valueCode = res.data.hasDoneTest ? '1' : '0'
                        if (child.value) {
                          child.children[0].value = res.data.lastTestDate
                        }
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
                      if (child.nameKey == 'key_add_oil_period') {
                        // 加脂周期
                        child.value = res.data.oilAddPeriod
                        child.unit = res.data.oilAddPeriodUnit
                      }
                      if (child.nameKey == 'key_every_time_add_num') {
                        // 每次加脂量
                        child.value = res.data.everyTimeOilAddQuantity
                        child.unit = res.data.everyTimeOilAddQuantityUnit
                      }
                      if (child.nameKey == 'key_every_month_add_num') {
                        // 每月润滑剂添加量"
                        child.value = res.data.preMonthOilAddQuantity
                        child.unit = res.data.preMonthOilAddQuantityUnit
                      }
                      if (child.nameKey == 'key_last_add_oil_date') {
                        // 上次加脂⽇期
                        child.value = res.data.lastOilAddDate
                      }
                    })
                  }
                })
              } else {
                if (this.deviceDetailObj.reportType == '4') {
                  this.$message({
                    message: '刷新失败，设备信息中润滑点设备类型为' + res.data.lubricationPointType + '，该工单服务支持的润滑点设备类型包括循环系统、燃气轮机、蒸汽轮机、造纸机',
                    type: 'warning'
                  })
                } else if (this.deviceDetailObj.reportType == '5') {
                  this.$message({
                    message: '刷新失败，设备信息中润滑点设备类型为' + res.data.lubricationPointType + '，该工单服务支持的润滑点设备类型为液压系统',
                    type: 'warning'
                  })
                } else if (this.deviceDetailObj.reportType == '6') {
                  this.$message({
                    message: '刷新失败，设备信息中润滑点设备类型为' + res.data.lubricationPointType + '，该工单服务支持的润滑点设备类型包括闭式齿轮、差速器、终传动',
                    type: 'warning'
                  })
                } else if (this.deviceDetailObj.reportType == '7') {
                  this.$message({
                    message: '刷新失败，设备信息中润滑点设备类型为' + res.data.lubricationPointType + '，该工单服务支持的润滑点设备类型为滚动轴承',
                    type: 'warning'
                  })
                } else if (this.deviceDetailObj.reportType == '8') {
                  this.$message({
                    message: '刷新失败，设备信息中润滑点设备类型为' + res.data.lubricationPointType + '，该工单服务支持的润滑点设备类型为开式齿轮',
                    type: 'warning'
                  })
                }
              }
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
    // 刷新数据
    handleRefresh () {
      this.$_queryEPInfo()
      this.$_getLubricationPointDetail()
    },
    // 前往编辑
    handleEdit () {
    },
    
  }
}
</script>

<style lang='less' scoped>
.title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
    display: flex;
  }
  .line-vertical{
    width: 3px;
    height: 1em;
    background-color: #dd0000;
  }
</style>
