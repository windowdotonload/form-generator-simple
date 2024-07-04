<template>
  <div class="report-content" :style="mainminheight" id="rightCardId">
    <reportCommon :reportObj="reportObj" :stepList="stepList" :stepListIndex="stepListIndex">
      <div style="margin-bottom: 80px;" v-for="(cardItem, cardIndex) in stepList" :key="cardIndex">
        <reportCardItem
          :key="reportItemKey"
          :stepList="stepList"
          :refreshFlag ='refreshFlag'
          @fMethod="fatherMethod"
          :card-item="cardItem"
          :id="cardItem.scrollId"
          :paramReportNode="stepList"
          :addFieldPoolDtoList="addFieldPoolDtoList"
          :paramReportType="paramReportType"
          :deviceDetailObj="reportObj"
          @reportAddLubricationPoints="reportAddLubricationPoints"
        />
      </div>
      <!-- 底部按钮 -->
      <reportFooter :draftJsonDtoList="stepList" :reportObj="reportObj" ref="reportFooter" />
    </reportCommon>
    <!-- 选择润滑点 -->
    <div v-if="orderInfo.companyId">
      <chooseLubricationPointNew
        :chooseDeviceAndLupDialog="chooseDeviceAndLupDialog"
        :singleFlag="false"
        :checkedDevice="checkedDevice"
        :urlType="urlType"
        :taskType="taskType"
        :companyId="orderInfo.companyId"
        :companyNumber="orderInfo.contactCompanyNumber"
        :companyName="orderInfo.contactCompanyName"
        :workshopId="orderInfo.workshopId"
        :plantStudyServiceFlag="plantStudyServiceFlag"
        :reportType="orderInfo.reportType"
        v-on:cancelChooseDeviceAndLup="cancelChooseDeviceAndLup"
        v-on:confirmChooseLup="confirmChooseLup"
      ></chooseLubricationPointNew>
    </div>
  </div>
</template>
<script>
import scroll from "@/components/businessComponents/components/scroll";
import handle from "@/components/parameterReport/reportCommon/components/handle";
import reportCommon from "@/components/businessComponents/components/reportCommon";
import reportCardItem from "@/components/parameterReport/reportCommon/components/report-card-item";
import reportFooter from "@/components/parameterReport/reportCommon/components/report-footer";
import chooseLubricationPointNew from "@/components/spotInspection/components/chooseLubricationPointWorkorder";
import { getAddItem, getLupDeviceInfo} from "@/components/businessComponents/components/addItem";
export default {
  mixins: [handle, scroll],
  components: {
    reportCommon,
    reportCardItem,
    reportFooter,
    chooseLubricationPointNew
  },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 170}px`,
      stepListIndex: 0,
      disabledPreview: true,
      refreshFlag:false,
      publishStatus: 0,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      chooseDeviceAndLupDialog: false,
      urlType: "parameter",
      taskType: "check",
      plantStudyServiceFlag: false,
      checkedDevice: [],
      addLupButtonItem: {},
      paramReportType:null
    };
  },
  created() {
    this.publishStatus = this.$route.query.publishStatus;
  },
  mounted() {
    this.$nextTick(() => {
      let timeId;
      const el = document.getElementById("rightCardId");
      el.addEventListener(
        "scroll",
        () => {
          // 页面滚动停止100毫秒后才会执行下面的函数。
          clearTimeout(timeId);
          timeId = setTimeout(() => {
            this.scrollToTop();
          }, 100);
        },
        true
      );
    });
  },
  destroy() {
    // 必须移除监听器，不然当该vue组件被销毁了，监听器还在就会出错
    window.removeEventListener("scroll", this.scrollToTop);
  },
  methods: {
    fatherMethod() {
      this.getDetail('refresh')
      console.log(999)

    },
    //  添加润滑点
    reportAddLubricationPoints(item) {
      // 判断润滑点数量是否大于十个
      if(this.paramReportType == 3){
        this.handleLubricationRecommend(item)
        return
      }
      this.addLupButtonItem = item;
      let lg = 0;
      let lupObj;
      this.stepList.forEach(it => {
        it.nodeValue.forEach(n => {
          if (n.id == item.styleJsonDto.bindingId) {
            lg = n.children.length;
            lupObj = n;
          }
        });
      });

      if (lg > 9) {
        this.$message({
          type: "warning",
          message: "最多添加十个润滑点"
        });
        return;
      }
      // 找出现有的润滑点
      let lupIdList = [];
      lupObj.children.forEach(it => {
        it.children.forEach(item => {
          let obj = {};
          if (item.nameKey == "key_lup_number") {
            obj.lubricationPointNumber = item.value;
            lupIdList.push(obj);
          }
        });
      });
      this.checkedDevice = lupIdList;
      this.chooseDeviceAndLupDialog = true;
    },
    // 取消选择
    cancelChooseDeviceAndLup() {
      this.chooseDeviceAndLupDialog = false;
    },
    // 确定选择
    async confirmChooseLup(list) {
      // 1.找到池子中需要添加的id并对应修改字段的值
      // 1.找到池子中需要添加的id并对应修改字段的值
      let addObj = {};
      this.addFieldPoolDtoList.forEach(it => {
        if (it.addToId == this.addLupButtonItem.styleJsonDto.bindingId) {
          addObj = JSON.parse(JSON.stringify(it.currentFieldDto));
        }
      });
      list.forEach(async it=>{
        console.log(it)
        const resData = await getAddItem(addObj);
        const addData = JSON.parse(JSON.stringify(resData));
        if(!it.deviceNumber) return
        if(!it.lubricationPointNumber) return
        const deviceParams = {
          deviceNumber: it.deviceNumber
        }
        const deviceInfoData = await getLupDeviceInfo(deviceParams)
        // 查询润滑点详情
        const params = {
          lubricationPointNumber: it.lubricationPointNumber
        };
        this.requestMethodGet("/web/device/queryLubricationPointDetail", params).then(res => {
          if (res.data.code == 1000) {
            const data = res.data.data;
            let lupType = ''//润滑点设备类型
            let lupMethod = ''//润滑方式
            let val = ''//换油/加脂周期数据
            let unitCode = ''//换油/加脂周期单位code
            let unitName = ''//换油/加脂周期单位名称
            addData.deviceTypeCode = data.deviceTypeCode
            addData.children.forEach(it => {
              if (it.nameKey == "key_device_number") {
                //设备编号（不展示）
                it.value = data.deviceNumber;
              }
              if (it.nameKey == "key_lup_number") {
                //润滑点编号（不展示）
                it.value = data.lubricationPointNumber;
              }
              if (it.nameKey == "key_lup_id") {
                //润滑点id（不展示）
                it.value = data.id;
              }
              if (it.nameKey == "device_name") {
                //设备名称
                it.value = deviceInfoData.deviceName;
              }
              // 设备编码
              if (it.nameKey == "key_device_code") {
                it.value = deviceInfoData.deviceCode
              }
              // 设备类型
              if(it.nameKey == "device_type"){
                it.valueCode = deviceInfoData.deviceType
                it.value = deviceInfoData.deviceTypeName
              } 
              //润滑点设备名称
              if (it.nameKey == "lup_name") {
                it.value = data.lubricationPointName;
              }
              // 润滑点设备类型
              if (it.nameKey == "lup_type") {
                it.valueCode = data.lubricationPointTypeCode
                it.value = data.lubricationPointType;
              }
              // 润滑方式
              if (it.nameKey == "lup_method") {
                it.valueCode = data.lubricationMethod
                it.value = data.lubricationMethodName
              }
              // 换油/加脂周期
              if (it.nameKey == "key_149_oil_change") {
                it.valueCode = data.oilChangePeriodUnit
                it.value = data.oilChangePeriod
              }
              if (it.nameKey == "lup_oil_brand") {
                //在用油品牌
                it.value = data.oilBrandName;
              }
              if (it.nameKey == "lup_oil_box_capacity") {
                //油箱容量
                it.value = data.oilBoxCapacity;
                it.unit = data.oilBoxCapacityUnit;
              }
              if (it.nameKey == "lup_current_oil") {
                //在用油品名称
                it.value = data.currentOilName;
              }
              if (it.nameKey == "key_140") {
                //原推荐产品或在用产品
                if(data.currentOilStatus=='0') {
                  it.state=0
                  it.disableOilList = data.disableOilList
                }
                it.value = data.currentOilName;
                it.valueCode = data.currentOilCode;
                
              }
              if(it.nameKey=='lup_type'){
                lupType = it.valueCode
              }
              if(it.nameKey == 'lup_method'){
                lupMethod = it.valueCode
              }
            });
            // 1：换油。2：加油，3：加脂
            if((lupType == 'lubrication_point_type_0011' && lupMethod == 'lubrication_method_0003')){//开式齿轮，喷射
              // 加油
              val = data.oilAddPeriod
              unitCode = data.oilAddPeriodUnit
              unitName = data.oilAddPeriodUnit == 'M' ? '月' : data.oilAddPeriodUnit == 'Y' ? '年' : data.oilAddPeriodUnit == 'D' ? '天' : data.oilAddPeriodUnit == 'KM' ? '公里' : '小时'
            }
            if(lupType != 'lubrication_point_type_0011' &&
            (lupMethod=='lubrication_method_0001' || 
            lupMethod=='lubrication_method_0002' || 
            lupMethod=='lubrication_method_0003' || 
            lupMethod=='lubrication_method_0008')){//换油
              val = data.oilChangePeriod
              unitCode = data.oilChangePeriodUnit
              unitName = data.oilChangePeriodUnitDesc
            }
            
            if(lupType != 'lubrication_point_type_0011' && 
            (lupMethod=='lubrication_method_0005' || lupMethod=='lubrication_method_0006' || 
              lupMethod=='lubrication_method_0007' || lupMethod=='lubrication_method_0009')){//加脂
                val = data.oilAddPeriod
                unitCode = data.oilAddPeriodUnit
                unitName = data.oilAddPeriodUnit == 'M' ? '月' : data.oilAddPeriodUnit == 'Y' ? '年' : data.oilAddPeriodUnit == 'D' ? '天' : data.oilAddPeriodUnit == 'KM' ? '公里' : '小时'
            }
            if(lupType == 'lubrication_point_type_0011' && 
            (lupMethod=='lubrication_method_0001' || 
            lupMethod=='lubrication_method_0002' ||  
            lupMethod=='lubrication_method_0008')){//换油
              val = data.oilChangePeriod
              unitCode = data.oilChangePeriodUnit
              unitName = data.oilChangePeriodUnitDesc
            }

            if(lupType == 'lubrication_point_type_0011' && 
            (lupMethod=='lubrication_method_0005' || lupMethod=='lubrication_method_0006' || 
            lupMethod=='lubrication_method_0007' || lupMethod=='lubrication_method_0009')){//加脂
              val = data.oilAddPeriod
              unitCode = data.oilAddPeriodUnit
              unitName = data.oilAddPeriodUnit == 'M' ? '月' : data.oilAddPeriodUnit == 'Y' ? '年' : data.oilAddPeriodUnit == 'D' ? '天' : data.oilAddPeriodUnit == 'KM' ? '公里' : '小时'
            }
            addData.children.forEach(it=>{
              if(it.nameKey == 'key_149_oil_change'){
                it.unit = unitName
                it.value = val
                it.valueCode = unitCode
              }
            })
            console.log(this.paramReportType)
            // 2.找到对应id并赋值
            if(this.paramReportType==3){
              this.stepList[this.stepList.length-1].nodeValue.forEach(it=>{
                if(it.id == this.addLupButtonItem.styleJsonDto.bindingId){
                  it.children.push(JSON.parse(JSON.stringify(addData)));
                }
              })
              const defaultNameKey = ['device_name','key_device_code','device_type','lup_name','lup_type','lup_method','lup_oil_box_capacity','key_149_oil_change', 'key_140']
              this.stepList[this.stepList.length-1].nodeValue[0].children.forEach(item=>{
                item.isSystemLup = false
                item.children.forEach(it=>{
                  if(it.nameKey == 'key_lup_id' && it.value){
                    item.isSystemLup = true
                    it.isSystemLup=false
                  }
                })
              })
              this.stepList[this.stepList.length-1].nodeValue[0].children.forEach(item=>{
                if(item.isSystemLup){
                  item.children.forEach(it=>{
                    it.disabled = defaultNameKey.includes(it.nameKey)
                    it.isSystemLup = defaultNameKey.includes(it.nameKey)
                  })
                }
              })
            }else{
              this.stepList.forEach(it => {
                it.nodeValue.forEach(item => {
                  const addDataDeviceNumber = addData.children[0].value;
                  if (item.id == this.addLupButtonItem.styleJsonDto.bindingId) {
                    const allIndex = item.children.map(item => item.children[0].value);
                    if (!allIndex.includes(addDataDeviceNumber)) {
                      item.children.push(JSON.parse(JSON.stringify(addData)));
                    } else {
                      const startIdx = allIndex.indexOf(addDataDeviceNumber);
                      item.children.splice(startIdx, 0, JSON.parse(JSON.stringify(addData)));
                    }
                  }
                });
              });
            }
            this.chooseDeviceAndLupDialog = false;
            this.stepList = JSON.parse(JSON.stringify(this.stepList));
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        });
      })
    },
    // 润滑推荐
    handleLubricationRecommend(item){
      this.addLupButtonItem = item
      let lg = 0;
      let lupObj;
      this.stepList.forEach(it => {
        it.nodeValue.forEach(n => {
          if (n.id == item.styleJsonDto.bindingId) {
            lg = n.children.length;
            lupObj = n;
          }
        });
      });
      this.stepList[this.stepList.length-1].nodeValue.forEach(it=>{
        if(it.id == item.styleJsonDto.bindingId){
          lg = it.children.length
          lupObj = it
        }
      })
      if (lg > 19) {
        this.$message({
          type: "warning",
          message: "最多添加20个润滑点"
        });
        return;
      }
      // 找出现有的润滑点
      let lupIdList = [];
      lupObj.children.forEach(it => {
        it.children.forEach(item => {
          let obj = {};
          if (item.nameKey == "key_lup_number") {
            obj.lubricationPointNumber = item.value;
            lupIdList.push(obj);
          }
        });
      });
      this.checkedDevice = lupIdList;
      this.chooseDeviceAndLupDialog = true;
    },
  }
};
</script>
<style lang="less" scoped>
.report-content {
  padding: 20px;
  height: 100%;
  position: relative;
  overflow: auto;
}
.foot-botton {
  width: 100%;
  background-color: #fff;
  height: 50px;
  position: fixed;
  bottom: 0;
}
</style>
