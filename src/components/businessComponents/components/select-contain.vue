<template>
  <div>
    <el-select 
      ref="containSelectRef"
      size="small"
      style="width:220px"
      clearable
      filterable
      v-model="loopItem.valueCode" 
      :placeholder="placeholder"
      @change="containSelectChange">
      <el-option
        v-for="op in loopItem.fieldOption"
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
  },
  data() {
    return {
      placeholder:'请选择'
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
          // this.placeholder = _.isEmpty(val.styleJsonDto.placeholder)?'请选择':val.styleJsonDto.placeholder
        }
      },
      immediate:true
    },
  },
  methods: {
    // 选中的值
    containSelectChange(val){
      console.log('选中的值',val)
      this.$emit('selectContainValueCode',val)
    },
  }
};
</script>
<style lang='less' scoped>

</style>

