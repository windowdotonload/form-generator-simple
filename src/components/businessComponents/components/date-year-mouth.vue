<template>
  <div>
    <el-date-picker
      ref="yearMouthRef"
      size="small"
      clearable
      v-model="loopItem.value"
      type="month"
      placeholder="选择月"
      value-format="yyyy-MM"
      :picker-options="loopItem.nameKey=='in_use_time' ? false : expireTimeOption">
    </el-date-picker>
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
      expireTimeOption: {
        disabledDate (date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now() - 24 * 60 * 60 * 1000
        }
      },
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        
      },
      immediate:true
    },
  },
  methods: {
    // 选中的值
    emptySelectChange(val){
      console.log('选中的值',val)
    },
  }
};
</script>
<style lang='less' scoped>

</style>

