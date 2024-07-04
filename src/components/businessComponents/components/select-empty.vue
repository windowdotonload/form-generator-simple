<template>
  <div>
    <el-select 
      ref="emptySelectRef"
      size="small"
      style="width:220px"
      clearable
      filterable
      v-model="loopItem.valueCode" 
      :placeholder="placeholder"
      @change="emptySelectChange">
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
      placeholder:''
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
          this.placeholder = _.isEmpty(val.styleJsonDto.placeholder)?'请选择':val.styleJsonDto.placeholder
        }
      },
      immediate:true
    },
  },
  methods: {
    // 选中的值
    emptySelectChange(val){
      console.log('选中的值',val)
      this.$emit('selectEmptyValueCode',val)
    },
  }
};
</script>
<style lang='less' scoped>

</style>

