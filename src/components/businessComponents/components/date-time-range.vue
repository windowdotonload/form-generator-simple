<template>
  <div>
    <el-date-picker
      ref="dateRangeRef"
      size="small"
      clearable
      v-model="loopItem.valueCheckBoxList"
      type="datetimerange"
      style="width:300px"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      format="yyyy-MM-dd HH:mm"
      @change="datetimeChange()"
      value-format="yyyy-MM-dd HH:mm"
      >
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
      timeRange:'',
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
      },
      immediate:true
    },
  },
  mounted() {
    this.handleDate()
  },
  methods: {
    handleDate() {
      if(this.loopItem.value){
        this.loopItem.valueCheckBoxList = this.loopItem.value.split(',')
      }
    },
    // 选中的值
    emptySelectChange(val){
    },
    datetimeChange() {
      this.$emit('time-range-fun',this.loopItem)
    }
  }
};
</script>
<style lang='less' scoped>

</style>

