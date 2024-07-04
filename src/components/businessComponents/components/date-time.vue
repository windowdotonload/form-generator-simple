<template>
  <div>
    <el-date-picker
      ref="dateTimeRef"
      size="small"
      clearable
      v-model="loopItem.value"
      type="datetime"
      @change="dateTimeChange"
      @clear="clearDateTime"
      placeholder="请选择"
      format="yyyy-MM-dd HH:mm"
      value-format="yyyy-MM-dd HH:mm">
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
    dateTimeChange(){
      this.$emit('dateTimeChange',this.loopItem)
    },
    clearDateTime(){
      this.$emit('dateTimeChange',this.loopItem)
    },
  }
};
</script>
<style lang='less' scoped>

</style>

