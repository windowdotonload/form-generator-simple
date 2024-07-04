<template>
  <div>
    <div>
      <el-radio-group v-model="loopItem.value">
        <el-radio  @change="radioNextChange" v-for="(it,idx) in loopItem.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
      </el-radio-group>
    </div>
    <!-- 文本域类型 -->
    <!-- <div v-if="loopItem.children[0].type == 'textarea' && loopItem.children[0].valueCodeNotDisplay.includes(loopItem.value)">
      <inputTextarea 
      :loop-item="loopItem.children[0]"/>
    </div> -->
    <!-- 输入框类型 -->
    <!-- <div v-if="loopItem.children[0].type == 'input1' && loopItem.children[0].valueCodeNotDisplay.includes(loopItem.value)">
      <inputCommon 
      :loop-item="loopItem.children[0]"/>
    </div> -->
    <!-- radio1类型 -->
    <!-- <div v-if="loopItem.children[0].type == 'radio1' && loopItem.children[0].valueCodeNotDisplay.includes(loopItem.value)">
      <radioCommon 
      :loop-item="loopItem.children[0]"/>
    </div> -->

  </div>
</template>

<script>
import inputTextarea from '@/components/businessComponents/components/input-textarea'
import inputCommon from '@/components/businessComponents/components/input-common'
import radioCommon from '@/components/businessComponents/components/radio-common'
export default {
  components:{ inputTextarea, inputCommon, radioCommon},
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
    radioNextChange(val){
      console.log('radio2',val)
      this.$emit('radioNextChange',val)
    },
  }
};
</script>
<style lang='less' scoped>

</style>

