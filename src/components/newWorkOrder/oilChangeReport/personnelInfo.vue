<template>
  <el-card class="person-nell-info" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
      <el-divider direction="vertical"></el-divider>
      <span>人员信息</span>
    </div>
    <el-form :model="personnelInfoForm" ref="personnelInfoRef" label-position="top" label-width="200px" style="padding:0 20px;">
      <el-row>
        <div v-for="(item,index) in personnelInfoForm" :key="index">
          <el-col :span="6">
          <el-form-item 
            :label="item.name+'：'"
            :required="item.required"
          >
          <el-input 
            v-if="item.type == 'input1' && type == 'edit'" 
            placeholder="人名间请用 “  、” 分割" 
            v-model="item.value"
            :maxlength="item.length"
            style="width:80%" 
            size="small"
            clearable>
          </el-input>
          </el-form-item>
          </el-col>
      </div>
      </el-row>
      
    </el-form>
  </el-card>
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
    personnelInfoObj:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return{
      uploadUrl:'',
      personnelInfoForm:this.personnelInfoObj,
      imgDialogVisible:false,
      notShowUploadBtn:false,
      dialogImageUrl:'',
      currentBrandCode:'',
      oilNameKey:0,
      tempImagePath:'',
      oilNameList:[],
      deviceValidate:{
        device_manufacturer:[
          { required: true, message: "请输入设备制造商", trigger: "blur" }
        ],
        device_model:[
          { required: true, message: "请输入设备型号", trigger: "blur" }
        ]
      },
    }
  },
  mounted(){
  },
  created(){
    this.personnelInfoForm = this.personnelInfoObj
  },
  methods:{
    // 验证
    validatePersonnelInfo(personnelInfoRef){
      const data = this.personnelInfoForm
      const emptyList = data.filter(item=>{
        return item.required && !item.value
      })
      if(emptyList.length>0){
        this.$message({
          message:emptyList[0].name+'必填',
          type:'warning'
        })
        return
      }else{
        this.$emit('passModulValidate','personnel')
      }
    },
  }
}
</script>

<style lang='less'>
.person-nell-info {
 .title {
    font-family:MicrosoftYaHei-Bold;
    font-size:14px;
    color:#000;
    line-height:14px;
    font-weight:bold;
    display: flex;
  }
  .el-card__header {
    background: #f9f9f9;
  }
  .el-divider--vertical {
    width:3px;
  }
  .el-divider {
    background-color: #dd0000;
    position: relative;
}
  .noUploadBtn .el-upload--picture-card {
      display: none;
  }
  .el-upload-list__item {
    transition: none !important;
  }
  .el-input-number .el-input__inner {
    text-align: left;
  }
}
</style>