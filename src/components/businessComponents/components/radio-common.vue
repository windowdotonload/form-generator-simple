<template>
  <div>
    <el-radio-group v-model="loopItem.value" @change="radioCommonChange">
      <el-radio v-for="(it,idx) in loopItem.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
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
  // watch:{
  //   loopItem:{
  //     handler:function(val,oldVal){
        
  //     },
  //     immediate:true
  //   },
  // },
  created() {
    // if(this.loopItem.value){
      this.$emit('radioCommonChange',this.loopItem)
    // }
  },
  methods: {
    radioCommonChange(){
      this.$emit('radioCommonChange',this.loopItem)
    },
  }
};
</script>
<style lang='less' scoped>

</style>

