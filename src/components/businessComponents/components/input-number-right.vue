<template>
  <div ref="inputNumberRightContent">
    <el-input
      ref="inputNumber"
      size="small"
      controls-position="right"
      clearable
      v-model="loopItem.value" 
      :placeholder="placeholder"
      :maxlength="loopItem.length"
      :precision="loopItem.decimalPrecision"
      :min="Math.floor(loopItem.rangeMin)" 
      :max="Math.floor(loopItem.rangeMax)"
      @blur="inputRighrtBlur"
      @focus="inputRighrtFocus"
      @change="inputRighrtChange">
    </el-input>
  </div>
</template>

<script>
export default {
  props:{
    // 循环时的单个对象，做校验使用
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
        this.placeholder = _.isEmpty(val.styleJsonDto.placeholder)?'请输入':val.styleJsonDto.placeholder
      },
      immediate:true
    },
  },
  methods: {
    // 聚焦
    inputRighrtFocus(){

    },
    // 改变
    inputRighrtChange(){
      
    },
    // 失去焦点
    inputRighrtBlur(){
      console.log('..........',this.loopItem)
    },
  }
};
</script>
<style lang='less' scoped>

</style>