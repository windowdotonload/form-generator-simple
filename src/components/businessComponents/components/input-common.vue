<template>
  <div ref="inputCommonContent">
    <!-- :style="{width:loopItem.length<15?'220px':'80%'}" -->
    <el-input 
      ref="inputCommon"
      size="small"
      :style="isNotLimitWith ? 'width:100%' : 'width:220px'"
      clearable
      :disabled="disabledEditFlag"
      v-model="loopItem.value" 
      :placeholder="placeholder"
      :maxlength="loopItem.length"
      @blur="inputBlur"
      @focus="inputFocus"
      @change="inputChange">
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
    isNotLimitWith:{
      type:Boolean,
      default:false
    },
    disabledEditFlag:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      placeholder:''
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        this.placeholder = '请输入'//_.isEmpty(val.styleJsonDto.placeholder)?'请输入':val.styleJsonDto.placeholder
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
    inputBlur(){
      this.$emit('inputCommonBlur',this.loopItem)
    },
  }
};
</script>
<style lang='less' scoped>

</style>