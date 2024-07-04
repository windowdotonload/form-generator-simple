<template>
  <div>
    <el-button v-on="$listeners" size="small" @click.stop.prevent="handlerAdd(loopItem)">{{loopItem.name}}</el-button>
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
          // console.log('val......',val)
        }
      },
      immediate:true
    },
  },
  methods: {
    // 添加
    handlerAdd(item){
      this.$emit('handlerAdd',item)
    },
  }
};
</script>
<style lang='less' scoped>

</style>

