<template>
  <div>
    <div class="node-title" :style="nodeItem.nodeName=='效益'?'margin-top:20px':''">{{nodeItem.nodeName}}</div>
    <!-- 润滑点 -->
    <el-form ref="serviceReportForm" :model="nodeItem.nodeValue" label-position="top" v-if="nodeItem.isLup">
      
      <div v-for="(item,index) in nodeItem.nodeValue" :key="index" style="display: inline-block;width: 100%;">
        <div v-for="(child1,index1) in item.children" :key="index1">
          <template v-if="child1.isGroup" >
            <div :style="(child1.nameKey=='lup_name' && reportType != 31) ? 'border-bottom-left-radius:0;border-bottom-right-radius:0' : reportType == 31 ? 'border-bottom-left-radius:6px;border-bottom-right-radius:6px' : 'border-top-left-radius: 0;border-top-right-radius: 0;'" :class="(child1.nameKey=='lup_name' || child1.nameKey == 'lup_current_oil' || child1.nameKey == 'lup_oil_change_period' || child1.nameKey=='lup_oil_add_period') ? 'lup-info' : ''">
              <div v-if="child1.nameKey=='lup_name'" style="color: #dd0000;margin-top: 20px;padding: 16px 0 12px 20px;">
                {{child1.value}}
                <div style="color: #4a5881;font-size: 14px;" :style="reportType==31?'float: right;margin: -3px 20px 0 0;':'position: absolute;right: 60px;'">
                  <el-link style="margin-right:20px" @click="refreshData(child1,index)"><i class="el-icon-refresh-right"></i>刷新数据</el-link>
                  <el-link  @click="toFillData(child1)"><i class="el-icon-edit"></i>前往补充</el-link>
                </div>
              </div>
              <div v-else :style="(child1.nameKey == 'lup_current_oil' && reportType != 32) ?'float:left;margin-right:32px':''" style="padding:0 0 16px 20px;">
                <span style="color:#999">
                  {{child1.name}}：{{child1.value}} 
                  <span v-if="child1.unit">{{child1.unit}}</span> 
                </span>
              </div>
            </div>
          </template>
          <el-col :span="(child1.nameKey!='lup_name' && child1.nameKey != 'lup_current_oil' && child1.nameKey != 'lup_oil_change_period' && child1.nameKey != 'lup_oil_add_period') ? 12 : ''" v-if="!child1.isGroup" style="margin-top: 10px;">
            <el-form-item>
              <div slot="label" style="margin-bottom: 10px;">
                <span class="star" v-if="child1.required">*</span>
                <span class="form-title" >{{ child1.name }}</span>
              </div>
              <div style="display: flex;width: 100%;padding: 0;">
                <reportIndex
                  :style="child1.unit=='小时'?'width:92%':'width:96%'"
                  :disabledFlag="!isEditFlag"
                  :isNotLimitWith="isNotLimitWith"
                  @selectCommonChange="selectCommonChange"
                  :formItem="child1">
                </reportIndex>
                <div v-if="child1.unit" style="margin-left:5px;">{{child1.unit}}</div>
              </div>

            </el-form-item>
          </el-col>
        </div>
      </div>

    </el-form>
    
    <el-form ref="serviceReportForm" :model="nodeItem.nodeValue" label-position="top" v-if="!nodeItem.isLup">
      <div v-for="(item,index) in nodeItem.nodeValue" :key="index">

        <el-col :span="(item.length >100 || (item.name == '安全' || item.name == '高效')) ? 24 : item.name=='环保' ? '' : 12">
          <el-form-item>
          <div slot="label" :style="(item.type != 'string1') ? 'margin:20px 0 10px 0':'margin-top:20px'">
            <span class="star" v-if="item.required">*</span>
            <span class="form-title" :style="item.name=='环保'?'color:#dd0000':'#000'" v-if="item.display">{{ item.name }}</span>
            <span v-if="item.tip">
              <el-tooltip effect="dark" :content="item.tip.content" placement="top-start">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </span>
          </div>
          <div style="display: flex;width: 100%;">
            <reportIndex
              v-if="item.display"
              :disabledFlag="!isEditFlag"
              :style="item.type=='textarea'? 'width:100%': (item.name=='安全' || item.name=='高效') ? 'width:46%': 'width:98%'"
              :isNotLimitWith="isNotLimitWith"
              @selectCommonChange="selectCommonChange"
              :formItem="item">
            </reportIndex>
            <span v-if="item.unit && item.display" style="margin:0 20px 0 5px;">{{item.unit}}</span>
          </div>
          
          </el-form-item>
        </el-col>
      </div>
    </el-form>
  </div>
</template>

<script>
import reportIndex from '@/components/businessComponents/components/report-index' 
import handleReport from "@/components/businessComponents/components/handleReport"
export default {
  mixins:[ handleReport ],
  components:{ reportIndex },
  props:{
    nodeItem:{
      type:Object,
      default:{}
    },
    paramReportNode:{
      type:Array,
      default:[]
    },
    reportType:{
      type:String,
      default:''
    },
    isEditFlag:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      isNotLimitWith:true
    }
  },
  watch: {
    nodeItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          if(val.nodeName == '效益'){
            this.handleEleHidden()
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods:{
    handleEleHidden(){
      let valueCode
      this.nodeItem.nodeValue.forEach(it=>{
        if(it.nameKey == 'reduce_co2_situation'){
          valueCode = it.valueCode
        }
      })
      this.nodeItem.nodeValue.forEach(it=>{
        if(it.nameKey == 'reduce_co2'){
          it.display = valueCode == '1'
        }
      })
    },
    selectCommonChange(item) {
      // 将选中的option赋值给value
      if(!item.valueCode){
        this.handleEleHidden()
        return
      }
      if (item.valueCode) {
        let result = item.fieldOption.find(it => {
          return it.value == item.valueCode;
        });
        item.value = result.option;
      }
      this.handleRegItem()
      this.handleHiddenOrShow(item, this.nodeItem);
    },
    refreshData(child1,lupIndex){
      const obj = JSON.parse(child1.styleJson)
      const loading = this.$loading({
        lock: true,
        text: "数据请求中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      const params = {
        lubricationPointNumber:obj.lubricationPointNumber
      }
      this.requestMethodGet('/web/device/queryLubricationPointDetail', params).then(res => {
        if(res.data.code == 1000){
          const lupInfoData = res.data.data
          this.nodeItem.nodeValue.forEach((it,index)=>{
            if(index == lupIndex){
              it.children.forEach(item=>{
                switch(item.nameKey){
                  case'lup_name': //润滑点名称
                    item.value = lupInfoData.lubricationPointName
                  break;
                  case'lup_current_oil': //在用油名称
                    item.value = lupInfoData.currentOilName
                  break;
                  case'lup_oil_change_period': //换油周期
                    item.value = lupInfoData.oilChangePeriod
                    item.unit = lupInfoData.oilChangePeriodUnitDesc
                  break;
                  case'lup_oil_add_period': //加脂周期
                    item.value = lupInfoData.oilAddPeriod
                    item.unit = lupInfoData.oilAddPeriodUnit == 'M' ? '月' : lupInfoData.oilAddPeriodUnit == 'Y' ? '年' : lupInfoData.oilAddPeriodUnit == 'D' ? '天' : '小时'
                  break;
                  case'lup_recommend_oil_change_period': //推荐换油周期
                    item.unit = lupInfoData.oilChangePeriodUnitDesc
                    break;
                  case'lup_recommend_oil_add_period': //推荐加脂周期
                    item.unit = lupInfoData.oilAddPeriodUnit == 'M' ? '月' : lupInfoData.oilAddPeriodUnit == 'Y' ? '年' : lupInfoData.oilAddPeriodUnit == 'D' ? '天' : '小时'
                    break;
                  case'key_150_oil_change': //加脂周期
                    item.unit = lupInfoData.oilAddPeriodUnit == 'M' ? '月' : lupInfoData.oilAddPeriodUnit == 'Y' ? '年' : lupInfoData.oilAddPeriodUnit == 'D' ? '天' : '小时'
                  break;
                  default:
                    break;
                }

              })
            }
          })
          loading.close()
        }else{
          loading.close()
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      }).catch(err=>{
        loading.close()
      })
    },
    toFillData(item){
      const obj = JSON.parse(item.styleJson)
      let routeUrl = this.$router.resolve({
        path: '/EquipmentProfile/EditEquipmentProfile',
        query: { 
          deviceNumber: obj.deviceNumber, 
          resource: 'report', 
          lubricationPointNumber: obj.lubricationPointNumber 
        }
      })
      window.open(routeUrl.href, '_blank')
    },
  }
}
</script>

<style lang="less" scoped>
.star {
  color: #f56c6c;
  font-size: 14px;
  margin-right: 2px;
}
.form-title{
  color: #000;
  font-weight: 400;
  font-family: MicrosoftYaHei;
}
.node-title{
  color: #000;
  line-height: 14px;
  font-size: 14px;
  font-weight: 700;
}
.lup-content{
  padding: 16px 20px;
  background-color: #f5f5f5;
  border-radius: 6px;
  font-size: 14px;
  margin: 20px 0 10px 0;
}
.lup-info{
  background-color: #f5f5f5;
  font-size: 14px;
  border-radius: 6px;
}
</style>