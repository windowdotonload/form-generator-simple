<template>
  <div>
    <el-cascader
      ref="cascaderRef"
      size="small"
      style="width:220px"
      clearable
      filterable
      :props="cascaderProps"
      :placeholder="placeholder"
      v-model="loopItem.arrayValue"
      :options="cascaderData"
      @change="handleChangeCascader">
    </el-cascader>
  </div>
</template>

<script>
export default {
  props:{
    loopItem:{
      type:Object,
      default:()=>{
        return {}
      }
    },
  },
  data() {
    return {
      cascaderData:[],
      cascaderProps:{
        label:'name',
        value:'code',
        multiple: true
      },
      placeholder:'请选择'
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
          this.getOptionsData(val)
          this.placeholder = _.isEmpty(val.styleJsonDto.placeholder)?'请输入':val.styleJsonDto.placeholder
        }
      },
      immediate:true
    },
  },
  methods: {
    // 获取级联下拉数据
    getOptionsData(val){
      /**
       * deviceType:设备类型
       * 
       * lupDeviceType:润滑点设备类型
       * 
       * oil:油品级联（新用油品名称，油样产品名称，原推荐产品或在用产品，推荐产品）
       * **/ 
      switch(val.styleJsonDto.cascaderType){
        case 'deviceType':
          this.getDeviceTypeData()
        break;
        case 'lupDeviceType':
          this.getLupData()
        break;
        case 'oil':
          this.getOilData()
        break;
        default:
          break;
      }
    },
    getDeviceTypeData(){
      this.get_deviceTree_list().then(res=>{
        this.cascaderData = res
      })
    },
    getLupData(){
      let params = {
        parentCode: "lubrication_point_type"
      }
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.cascaderData = res.data
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
    getOilData(){
      this.requestMethodGet("/web/config/oil/getOilCascadeMenu")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.cascaderData = this.formatData(res.data)
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
    // 选中的值
    handleChangeCascader(){
      const item = this.$refs.cascaderRef.getCheckedNodes()
      let labelList = []
      let valueList = []
      if(!_.isEmpty(item)){
        item.forEach(it=>{
          labelList.push(it.label)
          valueList.push(it.value)
        })
      }
      this.loopItem.value = labelList.join(',')
      this.loopItem.valueCode = valueList.join(',')
    },
    formatData(data) {
      return data.length ? data.map(item => {
        return {
          code: this.loopItem.styleJsonDto.cascaderType=='oil' ? item.oilNumber : item.code,
          name: this.loopItem.styleJsonDto.cascaderType=='oil' ? item.oilName : item.name,
          children: _.isEmpty(item.children) ? undefined : this.formatData(item.children)
        }
    }): []
    },
  }
};
</script>
<style lang='less' scoped>
</style>