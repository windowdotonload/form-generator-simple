<template>
  <div style="margin-top:30px;padding-bottom:100px;margin-left:100px">
    <el-form :model="suggestForm" ref="suggestRef">
      <el-row>
          <div v-for="(item,index) in suggestForm" :key="index">
            <el-form-item>
              <el-input
                v-if="type == 'edit'"
                type="textarea"
                placeholder="请根据调研结果填写总结或建议"
                v-model="item.value"
                maxlength="500"
                show-word-limit
                :autosize="autosize"
                clearable
              />
              <span v-if="type == 'view'">{{item.value}}</span>
            </el-form-item>
          </div>
      </el-row>
      <el-row v-if="type == 'edit'">
          <el-form-item>
            <span>请从以下几个方面总结该设备的润滑现状、潜在故障风险和相应建议</span>
          </el-form-item>
      </el-row>

      <el-row v-if="type == 'edit'">
          <div v-for="(example, idx) in examplesList" :key="idx">
            <el-form-item>
            <span slot="label">{{example.name}}</span><span class="copy-btn" @click="copyText(example.id)" :id="example.nameKey">复制</span>
            <p v-html="example.value"></p>
          </el-form-item>
          </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props:{
    type:{
      type:String,
      default:()=>{
        return ''
      }
    },
    deviceObj:{
      type:Array,
      default:()=>{
        return []
      }
    },
    suggestObj:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return{
      suggestForm:[],
      examplesList:[],
      autosize:{ minRows: 8, maxRows: 10 }
    }
  },
  mounted(){
    
  },
  created(){
    //设备信息中是否有润滑点设备细分选项
    let is_lup_device_detail_value = ''
    let data = []
    this.deviceObj.forEach(item=>{
      if(item.nameKey == 'lup_device_detail'){
        is_lup_device_detail_value = item.value
      }
    })
    if(is_lup_device_detail_value){
      this.suggestObj.forEach(it=>{
        if(it.valueCode == is_lup_device_detail_value){
          data = it.children
        }
      })
    }else{
      data = this.suggestObj
    }
    this.suggestForm = data
    const examplesData = data[0].children
    examplesData.forEach(it=>{
      it.value = it.value.replace(/@#!/g, '<br/>')
    })
    this.examplesList = examplesData
  },
  methods:{
    // 复制
    copyText(val){
      const data = this.examplesList
      let copyText = ''
      data.forEach(item=>{
        if(item.id == val){
          copyText = item.value
        }
      })
      copyText = copyText.replace(/<br\/>/g,'')
      const oInput = document.createElement('input')     //创建一个隐藏input（重要！）
      oInput.value = copyText    //赋值
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand("Copy") // 执行浏览器复制命令
      oInput.className = 'oInput'
      oInput.style.display='none'
      this.$message({ message:'复制成功',type:'success'})
    },
    childMethod(){
      this.$emit('passModulValidate')
    }
  }
}
</script>

<style lang="less" scoped>
  .suggest-title{
    margin-left: 10px;
  }
  .copy-btn{
    color: #f56c6c;
    cursor: pointer;
  }
</style>