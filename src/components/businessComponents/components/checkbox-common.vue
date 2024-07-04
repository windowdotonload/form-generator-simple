<template>
  <div>
   <el-checkbox-group v-model="loopItem.valueCheckBoxList" @change="changeBox" style="display: inline-block">
      <el-checkbox v-for="box in (loopItem.__fieldOption || loopItem.fieldOption)" :label="box.value" :key="box.value" style="margin-bottom: 10px">{{ box.option }}</el-checkbox>
    </el-checkbox-group>
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
      fieldOption:[]
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        if(!_.isEmpty(val)){
        }
      },
      immediate:true,
      deep: true
    },
  },
  methods: {
    changeBox(val){
      let type = ''
      let fieldOption = this.loopItem.__fieldOption || this.loopItem.fieldOption
      fieldOption.forEach(it=>{
        if(it.value.includes('无上述情况')){
          type = '无上述情况'
        }else{
          type = '其他'
        }
      })
      if (val.length) {
        if (val[val.length - 1] == type) {
          this.loopItem.valueCheckBoxList = [type]
        }
        if (val[val.length - 1] != type) {
          // 有正常得选项
          let index = val.findIndex(it => it == type)
          if (index > -1) {
            val.splice(index, 1)
            this.loopItem.valueCheckBoxList = val
          }
        }
      }
      this.$emit('checkboxChange',val)
    },
  }
};
</script>
<style lang='less' scoped>

</style>

