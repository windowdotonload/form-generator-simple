<template>
  <div class="cell-content">
    {{title}}
    <el-popover
      @show="handleInputFocus"
      v-if="!showTips"
      placement="bottom"
      :width="filterType=='datetimerange' ? 380 : 250">
      <div style="margin:10px 10px 0;">
        <!-- 表头有搜索框和下拉框，单独处理 -->
        <el-input ref="autoFocus" placeholder="请输入关键字" v-if="filterType=='inputAndselection'&&changeType=='input'" size="small" v-model="changeValueInput" clearable ></el-input>
        <!-- 表头有搜索框和下拉框，单独处理 -->
        <el-select placeholder="请选择" style="width:230px;" v-if="filterType=='inputAndselection'&&changeType=='selection'" :popperAppendToBody="false" size="small" v-model="changeValueSelect" clearable filterable>
          <el-option
            v-for="item in selectOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
        <el-input ref="autoFocus" placeholder="请输入关键字" v-if="filterType=='input'" size="small" v-model="changeValue" clearable ></el-input>
        <el-select :placeholder="placeholder ? placeholder : '请选择'" style="width:230px;" v-if="filterType=='selection'" :popperAppendToBody="false" size="small" v-model="changeValue" clearable filterable :multiple="selectMultiple">
          <el-option
            v-for="item in selectOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
        <!-- 服务类型级联选择 -->
        <el-cascader
          v-if="filterType=='cascaderService'"
          @visible-change="openServiceCascader($event)"
          size="small"
          style="width:230px;"
          popper-class="pc-sel-area-cascader"
          :options="selectOptions"
          :props="industruProps"
          collapse-tags
          filterable
          clearable
          placeholder="请选择"
          v-model="changeValue">
        </el-cascader>
        <!-- 设备/行业级联选择;执行方式级联 -->
        <el-cascader
          v-if="filterType=='cascaderDevice'||filterType=='cascaderIndustry'||filterType=='cascaderActtype'"
          size="small"
          style="width:230px;"
          popper-class="pc-sel-area-cascader"
          :options="selectOptions"
          :props="{ value: 'code', label: 'name', multiple: selectMultiple }"
          collapse-tags
          filterable
          clearable
          placeholder="请选择"
          v-model="changeValue">
        </el-cascader>
        <!-- 油品选择 -->
        <el-select 
          v-if="filterType=='cascaderOil'"
          size="small"
          style="width:230px;"
          collapse-tags
          filterable
          clearable
          multiple
          remote
          :loading="loadingRemote"
          placeholder="试试搜索：油品名称"
          v-model="changeValue"
          @change="changeQueryOil"
          :remote-method="queryOil">
          <el-option v-for="item in selectOptions" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
        </el-select>
        <!-- <el-cascader
          v-if="filterType=='cascaderOil'"
          size="small"
          style="width:230px;"
          popper-class="pc-sel-area-cascader"
          :options="selectOptions"
          :props="{ value: 'oilNumber', label: 'oilName', multiple: selectMultiple }"
          collapse-tags
          filterable
          clearable
          placeholder="请选择"
          v-model="changeValue">
        </el-cascader> -->
        <!-- 需求概述 -->
        <el-cascader
          v-if="filterType=='cascaderQue'"
          size="small"
          style="width:230px;"
          popper-class="pc-sel-area-cascader"
          :options="selectOptions"
          :props="{ value: 'id', label: 'name', multiple: selectMultiple }"
          collapse-tags
          filterable
          clearable
          placeholder="请选择"
          v-model="changeValue">
        </el-cascader>
        <el-date-picker
          v-if="filterType=='dateRange'"
          size="small"
          style="width:230px;"
          v-model="changeValue"
          clearable
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker> 
        <el-date-picker
          v-if="filterType=='dateSingle'"
          size="small"
          style="width:230px;"
          v-model="changeValue"
          clearable
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          type="date">
        </el-date-picker>
        <el-date-picker
          v-if="filterType=='datetimerange'"
          size="small"
          style="width:350px;"
          v-model="changeValue"
          clearable
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
        <div style="display:flex;margin-top:20px;justify-content:flex-end;">
          <el-button size="small" type="text" style="color:#000;" @click="clearData">清空</el-button>
          <el-button size="small" type="danger" @click="confirmSearch">确定</el-button>
        </div>
      </div>
      <div class="cell-content" slot="reference">
        <div style="display:flex;align-items:center;">
          <!-- 表头有搜索框和下拉框，单独处理 -->
          <i class="fa fa-search title-click" :style="changeValueInput?'color:#dd0000':''" v-show="filterType=='inputAndselection'" @click="changeType ='input'"></i>
          <i class="fa fa-search title-click" :style="changeValue?'color:#dd0000':''" v-show="filterType=='input'"></i>
          <!-- 表头有搜索框和下拉框，单独处理 -->
          <i class="fa fa-filter title-click" :style="(changeValueSelect === 0 || changeValueSelect === false) ? 'color:#dd0000;margin-left:8px;' : (changeValueSelect!=''||changeValueSelect.length>0) ? 'color:#dd0000;margin-left:8px;' : 'margin-left:8px;'" v-show="filterType=='inputAndselection'" @click="changeType ='selection'"></i>
          <i class="fa fa-filter title-click" :style="(changeValue === 0 || changeValue === false) ? 'color:#dd0000;' : (changeValue!=''||changeValue.length>0) ? 'color:#dd0000;' : ''" v-show="filterType=='cascaderOil'||filterType=='cascaderIndustry'||filterType=='cascaderDevice'||filterType=='selection'||filterType=='dateSingle'||filterType=='dateRange'||filterType=='cascaderService'||filterType=='cascaderActtype'||filterType=='cascaderQue'||filterType=='datetimerange' || filterType=='year'"></i>
          <div class="sort_div iconPic" v-show="sortTypeVal!=''" @click.stop="sortClick()">
            <div class="triangle-up" :style="sortTypeVal=='sortUp' ? 'border-bottom: 6px solid #dd0000;' : ''"></div>
            <div class="triangle-down" :style="sortTypeVal=='sortDown' ? 'border-top: 6px solid #dd0000;' : ''"></div>
          </div>
        </div>
      </div>
    </el-popover>
    <div style="display:flex;align-items:center;" v-else @click="showMsg">
      <i class="fa fa-search title-click" :style="changeValueInput?'color:#dd0000':''" v-show="filterType=='inputAndselection'" @click="changeType ='input'"></i>
      <i class="fa fa-search title-click" :style="changeValue?'color:#dd0000':''" v-show="filterType=='input'"></i>
      <!-- 表头有搜索框和下拉框，单独处理 -->
      <i class="fa fa-filter title-click" :style="(changeValueSelect === 0 || changeValueSelect === false) ? 'color:#dd0000;margin-left:8px;' : changeValueSelect ? 'color:#dd0000;margin-left:8px;' : 'margin-left:8px;'" v-show="filterType=='inputAndselection'" @click="changeType ='selection'"></i>
      <i class="fa fa-filter title-click" :style="(changeValue === 0 || changeValue === false) ? 'color:#dd0000;' : changeValue ? 'color:#dd0000;' : ''" v-show="filterType=='cascaderOil'||filterType=='cascaderIndustry'||filterType=='cascaderDevice'||filterType=='selection'||filterType=='dateSingle'||filterType=='dateRange'||filterType=='cascaderService'||filterType=='cascaderActtype'||filterType=='cascaderQue'||filterType=='datetimerange'"></i>
      <div class="sort_div iconPic" v-show="sortTypeVal!=''" @click.stop="sortClick()">
        <div class="triangle-up" :style="sortTypeVal=='sortUp' ? 'border-bottom: 6px solid #dd0000;' : ''"></div>
        <div class="triangle-down" :style="sortTypeVal=='sortDown' ? 'border-top: 6px solid #dd0000;' : ''"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColumnHeader',
  props: {
    showTips: {
      type: Boolean,
      default: false
    },
    selectMultiple: {
      type: Boolean,
      default: false
    },
    // 类型 input,selection
    filterType: {
      type: String,
      default: ""
    },
    // 占位符文案
    placeholder: {
      type: String,
      default: ""
    },
    // 表头名称
    title: {
      type: String,
      default: ""
    },
    changeValue: {
      type: [String, Array],
      default: ""
    }, 
    changeValueInput: {
      type: [String, Array],
      default: ""
    }, 
    changeValueSelect: {
      type: [String, Array],
      default: ""
    }, 
    // 参数名称
    paramValue: {
      type: String,
      default: ""
    },
    // 升序/降序/默认
    sortTypeVal: {
      type: String,
      default: ""
    },
    // 选择类型的数据
    selectOptions: {
      type: [Array, Object],
      default: () => {
        return []
      }
    },
    // 提交事件
    chSubmit: [Function]
  },
  watch: {
  },
  mounted() {
  },
  data() {
    return {
      loadingRemote: false,
      changeType: "",
      isLoadService: false,
      //  自定义属性
      industruProps: {
        value: "serviceNumber",
        label: "serviceName",
        children: "children",
        disabled: !"hasAuth",
        multiple: true
      },
      serviceTypeList: []
    }
  },
  methods: {
    openServiceCascader(val) {
      if(val){
        this.$_getServiceList()
      }
    },
    // 服务类型
    $_getServiceList() {
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", { serviceName: "", disabled: true })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.selectOptions = res.data;
            this.selectOptions = this.formatData(this.selectOptions);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.formatData(data[i].children);
        }
      }
      return data;
    },
    handleInputFocus() {
      this.$nextTick(() => {
          this.$refs.autoFocus&&this.$refs.autoFocus.focus();
      })
    },
    changeQueryOil(val){
      this.queryOil('', val.toString())
    },
    // 油品远程搜索
    queryOil(val, code) {
      this.loadingRemote = true
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {code:code, oilName:val, fullQueryFlag:true, size:200, current:1})
        .then(res => {
          res = res.data;
          this.loadingRemote = false
          if (res.code == 1000) {
            this.selectOptions = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    showMsg() {
      this.$message({
        type: "warning",
        message: "请选择一个客户后重新尝试"
      });
    },
    sortClick() {
      if(this.sortTypeVal=='sortUp'||this.sortTypeVal=='sortDefault'){
        this.sortTypeVal = "sortDown"
      }else if(this.sortTypeVal=='sortDown'){
        this.sortTypeVal = "sortUp"
      }
      this.$emit('changeSort',{
        paramValue:this.paramValue,
        sortTypeVal:this.sortTypeVal
      });
    },
    clearData() {
      this.changeValue = ""
      if(this.filterType == "inputAndselection"){
        // 表头有搜索框和下拉框，单独处理
        if(this.changeType == 'input'){
          this.$emit('chSubmit',{
            paramValue:this.paramValue,
            changeValueInput:"",
            changeType:this.changeType
          });
        }else if(this.changeType == 'selection'){
          this.$emit('chSubmit',{
            paramValue:this.paramValue,
            changeValueSelect:"",
            changeType:this.changeType
          });
        }
      }else{
        this.$emit('chSubmit',{
          paramValue:this.paramValue,
          changeValue:this.changeValue
        });
      }
    },
    confirmSearch() {
      this.changeValue = (this.changeValue === 0 || this.changeValue === false) ? this.changeValue : this.changeValue || "";
      if(this.changeValue.length==0) this.changeValue = ""
      if(this.filterType=="inputAndselection"){
        // 表头有搜索框和下拉框，单独处理
        if(this.changeType == 'input'){
          this.$emit('chSubmit',{
            paramValue:this.paramValue,
            changeValueInput:this.changeValueInput,
            changeType:this.changeType
          });
        }else if(this.changeType == 'selection'){
          this.$emit('chSubmit',{
            paramValue:this.paramValue,
            changeValueSelect:this.changeValueSelect,
            changeType:this.changeType
          });
        }
      }else{
        this.$emit('chSubmit',{
          paramValue:this.paramValue,
          changeValue:this.changeValue
        });
      }
    },
  }
}
</script>

<style lang="less">
.cell-content {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  flex-wrap: nowrap !important;
  line-height: 28px !important;
  padding: 0 !important;
  div.el-select {
    padding: 0;
    line-height: 28px;

  }
  div.el-input {
    padding: 0;
    line-height: 28px;
    input.el-input__inner {
      padding-left: 5px;
    }
  }
  input.el-input__inner {
    border-radius: 4px 0 0 4px !important;
  }
  .title-click {
    cursor: pointer;
  }
}
.iconPic{
    cursor: pointer;
    width: 12px;
}
.red-class{
  color: #dd0000;
}
.sort_div{
  display:flex;
  flex-direction: column;
  justify-content: space-around;
}
.triangle-up{
  width: 0;
  height: 0;
  border-bottom: 6px solid #000;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}
.triangle-down{
  margin-top: 3px;
  width: 0;
  height: 0;
  border-top: 6px solid #000;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}
</style>