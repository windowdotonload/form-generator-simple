<template>
  <div style="display:flex;align-items:center">
    <el-select 
      ref="lineSelectRef"
      size="small"
      style="width:220px"
      clearable
      filterable
      v-model="loopItem.valueCode" 
      :placeholder="placeholder"
      @change="lineSelectChange">
      <el-option
        v-for="op in loopItem.fieldOption"
        :key="op.value"
        :label="op.option"
        :value="op.value">
      </el-option>
    </el-select>
    <inputCommon 
    style="margin-left:5px"
    :loopItem="loopItem.children[0]"/>
  </div>
</template>

<script>
import inputCommon from './input-common.vue'
export default {
  components:{ inputCommon },
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
    lineSelectChange(val){
      // 更新type是dropDown5时,同时更新value的值,因为后端校验是根据value字段,小程序也需要根绝value字段回显
      if(!val) {
        this.loopItem.value = ''
        return
      }
      let valueObj = this.loopItem.fieldOption.find(item=>item.value == val)
      this.loopItem.value = valueObj.option
    },
  }
};
</script>
<style lang='less' scoped>

</style>

