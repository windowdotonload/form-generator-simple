<template>
  <div>
    <!-- tree类型 -->
    <div v-if="item.type == 'tree'">
      <el-collapse v-model="activeNames">
        <el-collapse-item :title="item.name" name="guide">
          <div style="font-size:13px;line-height:21px;color:#333;">
            <div v-for="(lev1, treeIndex) in item.children" :key="treeIndex">
              <!-- 一级 -->
              <div>
                <span>{{ lev1.name }} </span>
              </div>
              <!-- 二级 -->
              <div v-for="(lev2, lev2Index) in lev1.children" :key="lev2Index">
                <div>
                  <span>（{{ lev2Index + 1 }}）</span>
                  <span>{{ lev2.name }} </span>
                </div>
                <!-- 三级 -->
                <div v-for="(lev3, lev3Index) in lev2.children" :key="lev3Index">
                  <div style="display:flex;align-items:center">
                    <div style="width:4px;height:4px;border-radius:50%;background-color:#000;margin-right:5px"></div>
                    <div>{{ lev3.name }} </div>
                  </div>
                  <!-- 四级 -->
                  <div v-for="(lev4, lev4Index) in lev3.children" :key="lev4Index">
                    <div>
                      <span>-</span>
                      <span>{{ lev4.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- string类型 -->
    <div v-if="item.type == 'string' && item.display && !item.isTextFlag">
      <!--bug:49258去掉此判断 ||(item.templateId==21&&item.nodeNo!=1) -->
      <div class="item-overflow" v-if="item.value != '' && item.value != null" style="margin-left:10px;">
        <el-tooltip class="item" effect="dark" :content="item.value" placement="top-start">
          <span>{{ item.value }}{{ item.unit }}</span>
        </el-tooltip>
      </div>
      <div v-else>
        <span :style="{ color: item.required ? '#dd0000' : '#666' }">{{ item.required ? "暂无，请补充" : "暂无" }}</span>
      </div>
    </div>
    <!-- text文本 -->
    <div v-if="item.isTextFlag">
      <p v-html="item.value" style="white-space: pre-wrap; font-size: 13px; color: #666; line-height: 24px"></p>
    </div>
    <!-- input1类型 -->
    <div v-if="item.type == 'input1' && item.display">
      <!-- {{item.nameKey=='lup_name'}}--{{!item.isSystemLup}}---{{item.isLupNameFlag}} -->
      <div v-if="item.nameKey=='lup_name' && !item.isSystemLup && item.isLupNameFlag" style="display:flex">
        <el-select
          v-model="item.customerSelectNameValue"
          placeholder="请选择润滑点设备名称"
          size="small"
          v-if="item.nameListData.length>1"
          @change="customerSelectNameValueChange"
        >
          <el-option  
            v-for="lup in item.nameListData" 
            :key="lup.id" 
            :label="lup.lubPointName" 
            :value="lup.lubPointName"
            :style="{color:(lup.lubPointName=='自定义'?'blue':'#606266')}">
          </el-option>
        </el-select>
        <el-input size="small"
          style="width:220px;margin-left: 5px;" 
          v-if="item.nameListData.length<=1 || item.customerSelectNameValue=='自定义'"
          v-model="item.value"
          @change="customerNamechange"
          maxlength="50" clearable placeholder="请输入润滑点设备名称">
        </el-input>
      </div>
      <inputCommon v-else :loopItem="item" :isNotLimitWith="isNotLimitWith" :disabledEditFlag="disabledFlag || item.disabled" @inputCommonBlur="inputCommonBlur"/>
    </div>
    <!-- input2类型 -->
    <div v-if="item.type == 'input2' && item.display">
      <inputNumber :loopItem="item" :isNotLimitWith="isNotLimitWith" :disabledEditFlag="disabledFlag || item.disabled" @inputNumberBlur="inputNumberBlur"/>
    </div>
    <!-- input4类型 -->
    <div v-if="item.type == 'input4' && item.display">
      <inputDropdown :loopItem="item" :reportType="reportId" @inputDropChange="inputDropChange(item)" :disabledEditFlag="item.disabled"/>
    </div>
    <!-- textarea类型 -->
    <div v-if="item.type == 'textarea' && item.display">
      <inputTextarea :loopItem="item" :isNotLimitWith="isNotLimitWith" :disabledEditFlag="disabledFlag"/>
    </div>
    <!-- richText类型 -->
    <div v-if="item.type == 'richText' && item.display">
      <wangEditor :loopItem="item"/>
    </div>
    <!-- dropdown类型 -->
    <div v-if="item.type == 'dropdown' && item.display">
      <selectCascader :loopItem="item" :isNotLimitWith="isNotLimitWith" :disabledEditFlag="disabledFlag || item.disabled" @cascaderChange="cascaderChange(item)" />
    </div>
    <!-- dropdown2类型 -->
    <div v-if="item.type == 'dropdown2' && item.display">
      <selectCommon :loop-item="item" :isNotLimitWith="isNotLimitWith" :disabledEditFlag="disabledFlag || item.disabled" @commonSelectChange="commonSelectChange(item)" @commonVisibleChange="commonVisibleChange(item)" />
    </div>
    <!-- dropdown3类型 -->
    <div v-if="item.type == 'dropdown3'">
      <selectChild :loop-item="item" />
    </div>
    <!-- dropdown4类型 -->
    <div v-if="item.type == 'dropdown4'">
      <selectContain :loop-item="item" />
    </div>
    <!-- dropdown4_empty类型 -->
    <div v-if="item.type == 'dropdown4_empty'">
      <selectEmpty :loop-item="item" />
    </div>
    <!-- dropdown5类型 -->
    <div v-if="item.type == 'dropdown5'">
      <selectLine :loop-item="item" />
    </div>
    <!-- dropdown6类型 -->
    <div v-if="item.type == 'dropdown6'">
      <selectDynamic :loop-item="item" :optId="optId" @dynamicSelectChange="dynamicSelectChange(item)"/>
    </div>
     <!-- dropdown7类型 -->
     <div v-if="item.type == 'dropdown7'">
      <selectApi :loop-item="item" :reportType="reportId" :disabledEditFlag="disabledFlag || item.disabled" @selectApiChange="selectApiChange(item)"/>
    </div>
    <!-- dropdown_multi类型 -->
    <div v-if="item.type == 'dropdown_multi'||item.type == 'dropdown_multi_oil'">
      <selectMultiple :loop-item="item" @multipleSelectChange="multipleSelectChange"/>
    </div>
    <!-- dropdown_cascade_multi类型 -->
    <div v-if="item.type == 'dropdown_cascade_multi'">
      <selectMultipleCascader :loop-item="item" />
    </div>
    <!-- datepicker2类型 -->
    <div v-if="item.type == 'datepicker2' && item.display">
      <dateYearMouth :loop-item="item" />
    </div>
    <!-- datepicker3类型 -->
    <div v-if="item.type == 'datepicker3'">
      <dateCommon :loop-item="item" />
    </div>
    <!-- datepicker4类型 -->
    <div v-if="item.type == 'datepicker4'">
      <dateHourMinute :loop-item="item" />
    </div>
    <!-- datepicker5类型 -->
    <div v-if="item.type == 'datepicker5'">
      <dateTimeRange :loop-item="item" @time-range-fun="timeRangeFun(item)"/>
    </div>
    <!-- datepicker6类型 -->
    <div v-if="item.type == 'datepicker6'">
      <dateTime :loop-item="item" @dateTimeChange="dateTimeChange(item)"/>
    </div>
    <!-- img类型 -->
    <div v-if="item.type == 'img' && item.display">
      <imgUpload :loop-item="item" />
    </div>
    <!-- img2类型 -->
    <div v-if="item.type == 'img2' && item.display">
      <el-form-item>
        <div v-for="(img, imgIdx) in item.imgFullUrl" :key="imgIdx" v-if="item.imgFullUrl.length > 0">
          <!-- <img :src="img" style="width:148px;height:148px" /> -->
          <el-image 
            style="width: 148px; height: 148px"
            :src="img" 
            :preview-src-list="[img]">
          </el-image>
        </div>
        <div v-if="item.imgFullUrl.length == 0" style="color:#606266">
          <span :style="{ color: item.required ? '#dd0000' : '#666' }">{{ item.required ? "暂无，请补充" : "暂无" }}</span>
        </div>
      </el-form-item>
    </div>
    <!-- radio1类型 -->
    <div v-if="item.type == 'radio1' && item.display">
      <radioCommon :loop-item="item" @radioCommonChange="radioCommonChange(item)" />
    </div>
    <!-- radio2类型 -->
    <div v-if="item.type == 'radio2' && item.display">
      <radioNextCommon :loop-item="item" />
    </div>
    <!-- radio3类型 -->
    <div v-if="item.type == 'radio3'">
      <radioText :loop-item="item" :reportType="reportId"/>
    </div>
    <!-- radio4类型 -->
    <div v-if="item.type == 'radio4'">
      <radioMultipleText :loop-item="item" />
    </div>
    <!-- radio5类型 -->
    <div v-if="item.type == 'radio5'">
      <radioDate :loop-item="item" />
    </div>
    <!-- checkbox类型 -->
    <div v-if="item.type == 'checkbox'">
      <checkboxCommon :loop-item="item" @checkboxChange="checkboxChange(item)"/>
    </div>
    <!-- button类型 -->
    <div v-if="item.type == 'button' && item.styleJsonDto && !item.styleJsonDto.addTypeIsFileFlag && item.display" :style="(item.nameKey=='key_3608' || item.nameKey=='key_3610')?'margin-top:20px':''">
      <addButton :loop-item="item" @handlerAdd="handlerAdd(item)" />
    </div>
    <div v-if="item.type == 'echarts' && item.display">
      <div style="width:920px;height:350px" :id="`chart_${item.id}`"></div>
    </div>
    <div v-if="item.type == 'tco'">
      <TCO :node-item="item" />
    </div>
    <!-- 文件列表 -->
    <div v-if="item.type == 'file'">
      <el-row
        class="service-items-wrap"
        v-for="(fileItem, fileIndex) in item.serviceReportFileDtoList"
        :key="fileIndex"
        style="display:flex;align-items:center;"
        v-if="item.serviceReportFileDtoList.length"
      >
        <el-col :span="18">
          <div style="color:#333;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
            <span style="color:#dd0000;">附件{{ fileIndex + 1 }}：</span>{{ fileItem.fileName }}
          </div>
          <div style="color:#999999;font-size:13px;line-height:13px;">
            <span>创建人：{{ fileItem.createUserName }}</span>
            <span style="margin-left:24px;">创建时间：{{ fileItem.createTime }}</span>
          </div>
        </el-col>
        <el-col :span="6" align="right">
          <el-button type="text" @click="previewFile(fileItem)" style="color:#001450;font-size:13px;">预览</el-button>
          <el-button type="text" @click="handleRemove(item, fileItem)" style="color:#dd0000;font-size:13px;">删除</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 上传文件 -->
    <div v-if="item.type == 'button' && item.styleJsonDto && item.styleJsonDto.addTypeIsFileFlag && item.display">
      <fileUpload :loop-item="item" @addFile="addFile" />
    </div>
    <!-- 添加润滑点 -->
    <div v-if="item.type == 'button_device'">
      <el-button size="small" @click.stop.prevent="addDevice(item)">{{ item.name }}</el-button>
    </div>
  </div>
</template>

<script>
import addButton from "@/components/businessComponents/components/add-button";
import checkboxCommon from "@/components/businessComponents/components/checkbox-common";
import dateCommon from "@/components/businessComponents/components/date-common";
import dateHourMinute from "@/components/businessComponents/components/date-hour-minute";
import dateYearMouth from "@/components/businessComponents/components/date-year-mouth";
import dateTimeRange from "@/components/businessComponents/components/date-time-range";
import dateTime from "@/components/businessComponents/components/date-time";
import fileUpload from "@/components/businessComponents/components/file-upload";
import imgUpload from "@/components/businessComponents/components/img-upload";
import inputCommon from "@/components/businessComponents/components/input-common";
import inputNumber from "@/components/businessComponents/components/input-number";
import inputDropdown from "@/components/businessComponents/components/input-dropdown";
import inputTextarea from "@/components/businessComponents/components/input-textarea";
import wangEditor from "@/components/businessComponents/components/wang-editor";
import radioCommon from "@/components/businessComponents/components/radio-common";
import radioDate from "@/components/businessComponents/components/radio-date";
import radioMultipleText from "@/components/businessComponents/components/radio-multiple-text";
import radioNextCommon from "@/components/businessComponents/components/radio-next-common";
import radioText from "@/components/businessComponents/components/radio-text";
import selectCascader from "@/components/businessComponents/components/select-cascader";
import selectChild from "@/components/businessComponents/components/select-child";
import selectCommon from "@/components/businessComponents/components/select-common";
import selectDynamic from "@/components/businessComponents/components/select-dynamic";
import selectContain from "@/components/businessComponents/components/select-contain";
import selectEmpty from "@/components/businessComponents/components/select-empty";
import selectLine from "@/components/businessComponents/components/select-line";
import selectMultiple from "@/components/businessComponents/components/select-multiple";
import TCO from "@/components/businessComponents/components/TCO/index.vue";
import handleReport from "@/components/businessComponents/components/handleReport";
import selectMultipleCascader from './select-multiple-cascader.vue';
import selectApi from "@/components/businessComponents/components/select-api"
export default {
  mixins:[ handleReport ],
  components: {
    addButton,
    checkboxCommon,
    dateCommon,
    dateHourMinute,
    dateYearMouth,
    fileUpload,
    imgUpload,
    inputCommon,
    inputNumber,
    inputTextarea,
    wangEditor,
    radioCommon,
    radioDate,
    radioMultipleText,
    radioNextCommon,
    radioText,
    selectCascader,
    selectChild,
    selectCommon,
    selectContain,
    selectEmpty,
    selectLine,
    selectMultiple,
    dateTimeRange,
    dateTime,
    inputDropdown,
    selectDynamic,
    TCO,
    selectMultipleCascader,
    selectApi
  },
  props: {
    optId: {
      type: Object,
      default: {}
    },
    formItem: {
      type: Object,
      default: {}
    },
    reportId:{
      type:Number,
      default:null
    },
    parnmentItem: {
      type: Object,
      default: {}
    },
    isNotLimitWith:{
      type:Boolean,
      default:false
    },
    disabledFlag:{
      type:Boolean,
      default:false
    },
    activeTab:{
      type:String,
      default:''
    },
    paramReportNodeList:{
      type:Array,
      default:[]
    },
    lupDeviceNameList:{
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      activeNames: "",
      lubricationPointSelectName:'',
      lubricationPointName:'',
    };
  },
  watch: {
    formItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.item = val;
          if(val.nameKey == 'key_kscl_cljc_chilun_cmwd_line_small'){
            this.handleChartsCommon(val)
          }
          this.$forceUpdate();
        }
      },
      immediate: true
    },
    paramReportNodeList: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.$forceUpdate();
        }
      },
      immediate: true
    },
  },
  methods: {
    customerSelectNameValueChange(val){
      if(val != '自定义'){
        this.item.value = val
        this.$emit('customerNamechange',this.item)
      }
    },
    customerNamechange(val){
      this.item.value = val
      this.$emit('customerNamechange',this.item)
    },
    inputCommonBlur(item){
      if(item.nameKey == 'lup_name' && this.reportId ==3){
        // 找到设备类型
        let deviceTypeCode = ''
        this.paramReportNodeList[this.paramReportNodeList.length-1].nodeValue[0].children.forEach(it=>{
          if(it.id == item.parentId){
            it.children.forEach(cd=>{
              if(cd.nameKey == "device_type"){
                deviceTypeCode = cd.valueCode
              }
            })
          }
        })
        if(!deviceTypeCode){
          this.$message({
            message: '请先选择设备类型',
            type: "warning"
          });
        }
      }
    },
    multipleSelectChange(item){
      this.$emit('selectMultipleChange',item)
    },
    inputNumberBlur(item){
      this.$emit('inputNumberBlurFunc',item)
    },
    // 添加块
    handlerAdd(item) {
      this.$emit("handleAddBlock", item);
    },
    // 添加润滑点
    addDevice(item) {
      this.$emit("reportAddDeviceAndLup", item);
    },
    // 添加文件
    addFile(fileItem) {
      this.$emit("handleAddFile", fileItem);
    },
    // checkbox选择事件
    checkboxChange(item){
      if(this.reportId==23){
        let val = item.valueCheckBoxList
        if (val.length) {
          if (val[val.length - 1] == 5) {
            item.valueCheckBoxList = ['5']
          }
          if (val[val.length - 1] != '5') {
            let index = val.findIndex(it => it == 5)
            if (index > -1) {
              val.splice(index, 1)
              item.valueCheckBoxList = val
            }
          }
        }
      }
      this.$emit('commonCheckBoxChange',item)
    },
    // radio类型控制显隐改变
    radioCommonChange(item) {
      this.$emit("radioCommonChange", item);
    },
    // 返回时间范围选择
    timeRangeFun(item) {
      this.$emit("timeRangeFun",item);
    },
    dateTimeChange(item){
      this.$emit("dateTimeChange",item);
    },
    // dropdown2类型显隐控制
    commonSelectChange(item) {
      if(this.reportId==22 && this.parnmentItem.type == 'average'){
        this.$emit("selectAverageChange", item);
      }else{
        this.$emit("selectCommonChange", item);
      }
    },
    selectApiChange(item){
      this.$emit('selectCommonApiChange',item)
    },
    inputDropChange(item) {
      this.$emit("inputDropChange", item);
    },
    dynamicSelectChange(item) {
      this.$emit("dynamicSelectChange", item);
    },
    commonVisibleChange(item) {
      this.$emit("selectCommonVisibleChange", item);
    },
    cascaderChange(item){
      this.$emit('selectCascaderChange', item);
    },
    // 预览
    async previewFile(fileItem) {
      const params = {
        url: encodeURI(fileItem.filePath)
      };
      const res = await this.requestMethodGet("/web/file/getFullUrl", params);
      if (res.data.code == 1000) {
        window.open(res.data.data, "_blank");
      } else {
        this.$message({
          type: "warning",
          message: res.data.msg
        });
      }
    },
    // 删除附件
    handleRemove(child, fileItem) {
      child.serviceReportFileDtoList.forEach((it, idx) => {
        if (it.uid == fileItem.uid) {
          child.serviceReportFileDtoList.splice(idx, 1);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.item-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.el-collapse {
  border: 1px solid #ccddff;
  padding: 0px 20px;
  border-radius: 4px;
  background-color: rgba(204, 221, 255, 0.2);
}
/deep/.el-collapse-item__header {
  background-color: transparent;
  border-bottom: none;
}
/deep/.el-collapse-item__wrap {
  background-color: transparent;
  border-bottom: none;
}
.service-items-wrap {
  background: rgba(204, 221, 255, 0.2);
  font-weight: 400;
  color: #999;
  border: 1px solid #ccddff;
  border-radius: 6px;
  font-size: 13px;
  padding: 16px 20px;
  margin-top: 20px;
  margin-bottom: 12px;
}
</style>
