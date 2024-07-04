<template>
<div ref="inputTextareaContent">
  <el-input 
    ref="inputTextarea"
    size="small"
    clearable
    type="textarea"
    show-word-limit
    :autosize="{ minRows: 2, maxRows: 8 }"
    v-model="loopItem.value" 
    :placeholder="placeholder"
    :disabled="disabledEditFlag"
    :maxlength="loopItem.length"
    @blur="inputAllBlur"
    @focus="inputAllFocus"
    @change="inputAllChange">
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
    disabledEditFlag:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      placeholder:'请输入'
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        // this.placeholder = _.isEmpty(val.styleJsonDto.placeholder)?'请输入':val.styleJsonDto.placeholder
      },
      immediate:true
    },
  },
  methods: {
    // 聚焦
    inputAllFocus(){

    },
    // 改变
    inputAllChange(){
      
    },
    // 失去焦点
    inputAllBlur(){
      
    },
  }
};
</script>
<style lang='less' scoped>

</style>