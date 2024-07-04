<template>
  <div>
    <el-radio-group v-model="loopItem.value">
      <el-radio v-for="(it,idx) in loopItem.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
    </el-radio-group>
    <div style="font-size:14px;margin-top:5px" v-if="loopItem.value == loopItem.children[0].valueCode">
      <span style="color:#dd0000;">{{loopItem.children[0].name}}</span>
      <div v-for="(txt,idx) in loopItem.children[0].children" :key="idx" style="margin:10px 0;color:#ccc">
        {{idx+1}}.{{txt.name}}
      </div>
    </div>
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
    
  }
};
</script>
<style lang='less' scoped>

</style>

