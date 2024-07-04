<template>
  <div>
    <el-radio-group v-model="loopItem.value">
      <el-radio v-for="(it,idx) in loopItem.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
    </el-radio-group>
    <div style="color:#dd0000;font-size:14px;margin-top:5px" v-if="loopItem.value == loopItem.children[0].valueCode">
      {{loopItem.children[0].name}}
      <div v-if="loopItem.children[0].children.length" v-for="(cd,index) in loopItem.children[0].children" style="color:#c0c4cc">
        {{index+1}} . {{cd.name}}
      </div>
    </div>
    <!-- img类型 -->
    <div style="color:#dd0000;font-size:14px;margin-top:5px" v-if="loopItem.children[1] && loopItem.children[1].type=='img' && loopItem.value == loopItem.children[1].valueCode">
      {{loopItem.children[1].name}}<span v-if="reportType==33">（最多上传1张图片）</span>
      <imgUpload :loop-item="loopItem.children[1]"/>
    </div>
  </div>
</template>

<script>
import imgUpload from "@/components/businessComponents/components/img-upload";
export default {
  components:{imgUpload},
  props:{
    loopItem:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    reportType:{
      type:Number,
      default:null
    }
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

