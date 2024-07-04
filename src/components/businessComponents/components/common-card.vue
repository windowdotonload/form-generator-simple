<template>
  <el-card style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header" class="title" style="display:flex;align-items:center;justify-content: space-between;">
      <div style="display:flex;align-items:center;">
        <div class="line-vertical"></div>
        <div style="margin:0px 8px">{{cardItem.nodeName}}</div>
      </div>
    </div>
    <el-form :ref="formRef" :model="cardItem.nodeValue" :label-position="labelPosition" style="padding:0 20px;">
        <el-row>
          <slot></slot>
        </el-row>
      </el-form>
  </el-card>
</template>

<script>
export default {
  props: {
    cardItem:{
      type:Object,
      default:{}
    },
    formRef:{
      type:String,
      default:''
    },
    labelPosition:{
      type:String,
      default:'top'
    }
  },
  data () {
    return {
      
    }
  },
  created () {
    
  },
  methods: {
    
  }
}
</script>

<style lang='less' scoped>
.title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
    display: flex;
  }
  .line-vertical{
    width: 3px;
    height: 1em;
    background-color: #dd0000;
  }
</style>
