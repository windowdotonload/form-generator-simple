<template>
  <div>
    <el-date-picker
      ref="dateCommonRef"
      size="small"
      clearable
      v-model="loopItem.value"
      prefix-icon='el-icon-date'
      type="date"
      :picker-options="loopItem.nameKey=='clear_date' || loopItem.nameKey=='finish_time' ? expireTimeOption : false"
      placeholder="请选择"
      value-format="yyyy-MM-dd">
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
          return date.getTime() > Date.now()
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

