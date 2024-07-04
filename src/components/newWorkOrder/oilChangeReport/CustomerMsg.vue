<template>
  <el-card class="CustomerMsg" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
      <el-divider direction="vertical"></el-divider>
      <span>客户信息</span>
    </div>
    <el-form :model="CustomerMsgForm" ref="CustomerMsgRef" label-position="top" label-width="200px" style="padding:0 20px;">
      <el-row :gutter="24">
        <div v-for="(item,index) in CustomerMsgForm" :key="index">
          <el-col :span="item.nameKey != 'key_102' ? 6 : 12">
          <el-form-item 
            :label="item.name+'：'"
            :required="item.required"
          >
          <span slot="label">
            {{item.name}}
            <el-tooltip v-if="item.nameKey == 'key_101'" class="item" effect="dark" content="部门、单位、车间、厂、中心等组织架构也可以填写在此处" placement="top-start">
              <el-button type="text" style="color:#333;font-size:15px;padding:0px;">
                <i class="el-icon-warning-outline"></i>
              </el-button>
            </el-tooltip>
          </span>
          <span v-if="item.type == 'string'">{{item.value}}</span>
          <!-- 下拉多选 -->
          <el-select
            v-if="item.type == 'dropdown_multi'"
            size="small"
            @change="selectId => dropdownMulti(selectId, index1, item)"
            v-model="item.valueCheckBoxList"
            multiple
            placeholder="请选择"
          >
            <el-option v-for="item in item.fieldOption" :key="item.option" :label="item.option" :value="item.option"> </el-option>
          </el-select>
          <el-input
            v-if="item.type == 'input1' && type == 'edit'"
            placeholder="请输入" 
            v-model="item.value"
            @change="changeInput"
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
    customerObj:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return{
      uploadUrl:'',
      CustomerMsgForm:this.customerObj,
      imgDialogVisible:false,
      notShowUploadBtn:false,
      dialogImageUrl:'',
      currentBrandCode:'',
      oilNameKey:0,
      oilNameList:[],
      tempImagePath:'',
    }
  },
  mounted(){
  },
  created(){
    this.CustomerMsgForm = this.customerObj
  },
  methods:{
    changeInput(val) {
      // console.log(this.supplementaryForm)
    },
    dropdownMulti (val, index, child, it) {
      child.value = child.valueCheckBoxList.toString()
    },
    // 验证
    validateCustomer(){
      const data = this.CustomerMsgForm
      const emptyList = data.filter(item=>{
        return item.required && !item.value
      })
      console.log(emptyList)
      if(emptyList.length>0){
        this.$message({
          message:emptyList[0].name+'必填',
          type:'warning'
        })
        return
      }else{
        this.$emit('passModulValidate','customer')
      }
    },
  }
}
</script>

<style lang='less' scoped>
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
</style>