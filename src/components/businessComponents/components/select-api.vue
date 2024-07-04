<template>
  <div>
    <el-select
      size="small"
      :key="commonSelectKey"
      style="width:220px"
      clearable
      filterable
      v-model="loopItem.valueCode"
      :disabled="disabledEditFlag"
      @change="selectApiChange"
      @focus="focusSelectApiChange(loopItem)"
      @visible-change="commonVisibleChange"
      :placeholder="placeholder"
    >
      <el-option v-for="op in dataList" :key="op.code" :label="op.name" :value="op.code"> </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    loopItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isNotLimitWith:{
      type:Boolean,
      default:false
    },
    disabledEditFlag:{
      type:Boolean,
      default:false
    },
    reportType:{
      default:Number,
      default:null
    }
  },
  data() {
    return {
      placeholder: "请选择",
      dataList:[]
    };
  },
  watch: {
    loopItem: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val) && val.valueCode) {
          // this.placeholder = _.isEmpty(val.styleJsonDto.placeholder)?'请选择':val.styleJsonDto.placeholder
        }
      },
      immediate: true,
      deep: true
    }
  },
  created(){
    this.getLupData()
  },
  methods: {
    getLupData(){
      let params = {
        size:200
      }
      this.requestMethodGet("/web/config/lubricationPoint/getLubricationPointTypeParentChildrenList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.list.length > 0) {
              this.dataList = res.data.list
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    focusSelectApiChange(item) {
      if(item.styleJsonDto.cascaderType!="lupDeviceType") {
        return
      }
      let params = {
        parentCode: "lubrication_point_type"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.dataList = res.data
            }
            if(item.state==0) {
              item.value=''
              item.valueCode=''
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },  
    selectApiChange(val) {
      if(val){
        this.dataList.forEach(item=>{
          if(item.code == val){
            this.loopItem.value = item.name
          }
        })
      }
      if(!val){
        this.loopItem.value = ''
      }
      if(this.reportType==3){
        console.log('333333333333333333333')
        sessionStorage.setItem('lupEpType',this.loopItem.valueCode)
      }
      this.$emit('selectApiChange',this.loopItem)
    }
  }
};
</script>
<style lang="less" scoped></style>
