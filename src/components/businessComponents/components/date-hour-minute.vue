<template>
  <div>
    <el-time-picker
      ref="dateCommonRef"
      size="small"
      clearable
      v-model="loopItem.value"
      format='HH:mm'
      value-format="HH:mm"
      :picker-options="{
        start: '00:00',
        step: '00:01',
        end: '24:00'
      }"
      placeholder="请选择">
    </el-time-picker>
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

