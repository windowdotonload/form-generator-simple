<template>
  <div>
    <el-radio-group v-model="loopItem.value">
      <el-radio @change="radioDateChange" v-for="(it,idx) in loopItem.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
    </el-radio-group>
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
    return {};
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
        
        }
      },
      immediate:true
    },
  },
  methods: {
    radioDateChange(val){
      this.$emit('radioDateChange',val)
    },
  }
};
</script>
<style lang='less' scoped>

</style>

