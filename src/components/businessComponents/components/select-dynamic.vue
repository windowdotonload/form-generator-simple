<template>
  <div>
    <el-select 
      size="small"
      :key="dynamicSelectKey"
      style="width:220px"
      clearable
      filterable
      v-model="loopItem.valueCode" 
      @change="dynamicSelectChange"
      @visible-change="dynamicVisibleChange"
      :placeholder="placeholder">
      <el-option
        v-for="op in options"
        :disabled="op.disabled"
        :key="op.value"
        :label="op.option"
        :value="op.value">
      </el-option>
    </el-select>
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
    optId:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  data() {
    return {
      options: [],
      placeholder:'请选择',
      dynamicSelectKey:5
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
        }
      },
      immediate:true
    },
    optId:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
          this.getOptionsData()
        }
      },
      immediate:true
    }
  },
  mounted() {
    this.handleParentData()
  },
  methods: {
    handleParentData() {
      if(this.loopItem.templateId==21&&(this.loopItem.id=='2865'||this.loopItem.id=='2958')){
        if(this.loopItem.defaultValue){
          let optionItem = this.loopItem.fieldOption.find(it=>{
            return it.value==this.loopItem.defaultValue
          })
          this.options = JSON.parse(optionItem.option)
        }
      }
    },
    // 获取下拉数据
    getOptionsData(){
      if(this.loopItem.templateId==21&&(this.loopItem.id=='2865'||this.loopItem.id=='2958')){
        this.options = []
        this.loopItem.valueCode = ''
        this.loopItem.value = ''
        if((this.optId.valueSelect)&&(this.loopItem.id==this.optId.changeSelOptTarget)){
          let optionItem = this.loopItem.fieldOption.find(it=>{
            return it.value == this.optId.valueSelect
          })
          this.options = JSON.parse(optionItem.option)
        }
      }
    },
    dynamicSelectChange(){
      this.$emit('dynamicSelectChange',this.loopItem)
    },
    dynamicVisibleChange(val){
      if(val){
        this.$emit('dynamicVisibleChange',this.loopItem)
      }
    },
  }
};
</script>
<style lang='less' scoped>

</style>