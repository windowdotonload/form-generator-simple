<template>
  <el-card class="oilChangeHistory" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
      <el-divider direction="vertical"></el-divider>
      <span>换油记录</span>
    </div>
    <el-form :model="oilChangeForm" ref="oilChangeRef" label-position="top" label-width="200px" style="padding:0 20px;">
      <el-row>
      <div v-for="(item,index) in oilChangeForm" :key="index">
        <el-col :span="6">
          <el-form-item 
            :label="item.name+'：'"
            :required="item.required"
          >
          <el-input 
            v-if="item.type == 'input1' && type == 'edit'" 
            placeholder="--请输入--" 
            :disabled='item.disabled'
            v-model="item.value"
            :maxlength="item.length"
            style="width:80%" 
            size="small"
            clearable>
          </el-input>
          <el-date-picker
            v-if="item.type == 'datepicker' && type == 'edit'" 
            v-model="item.value"
            size="small"
            prefix-icon='el-icon-date'
            clearable
            style="width:80%" 
            type="datetime"
            placeholder="请选择">
          </el-date-picker>
          <el-date-picker
            v-if="item.type == 'datepicker3' && type == 'edit'" 
            v-model="item.value"
            size="small"
            prefix-icon='el-icon-date'
            clearable
            value-format="yyyy-MM-dd"
            style="width:80%" 
            type="date"
            placeholder="请选择">
          </el-date-picker>
          <el-time-picker
          v-if="item.type == 'datepicker4' && type == 'edit'" 
            v-model="item.value"
            size="small"
            format='HH:mm'
            value-format="HH:mm"
            :picker-options="{
              start: '00:00',
              step: '00:01',
              end: '24:00'
            }"
            placeholder="请选择">
          </el-time-picker>
          <el-select
            v-if="type == 'edit' && item.type == 'dropdown2'"
            size="small"
            clearable
            style="width:80%" 
            v-model="item.value"
            placeholder="--请选择--"
            @change="changeselect(item.value)"
          >
            <el-option
              v-for="(dic,index) in item.children"
              :key="dic.id"
              :label="dic.name"
              :value="dic.name"
            ></el-option>
          </el-select>
          <el-input-number 
          v-if="item.type == 'input2' && type == 'edit'" 
          v-model="item.value" 
          controls-position="right" 
          size="small"
          :precision="item.decimalPrecision"
          style="width:80%" 
          type='number'
          @change="handleChange" 
          :min="Math.floor(item.rangeMin)" :max="Math.floor(item.rangeMax)">
          </el-input-number>
          <el-radio-group v-model="item.value" v-if="type == 'edit' && item.type == 'radio5'" >
                <el-radio v-for="(it,idx) in item.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
          </el-radio-group>
          <!-- 在用油名称 -->
          <el-select v-if="type == 'edit' && item.type == 'dropdown'" size="small" ref="cascaderRef" v-model="item.valueCode" placeholder="请选择" clearable filterable remote :loading="loadingRemote" :remote-method="getOilList" @change="oilNameChange(item,index,`cascaderRef`)" style="width:80%">
            <el-option v-for="item in oilNameList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
          </el-select>
          <!-- <el-cascader
            v-if="type == 'edit' && item.type == 'dropdown'"
            ref='cascaderRef'
            :options="oilNameList"
            v-model="item.valueCode"
            :key="oilNameKey"
            size="small"
            style="width:80%" 
            :show-all-levels="false"
            @change="oilNameChange(item,index,`cascaderRef`)"
            :props="{ 
              value:'oilNumber',
              label:'oilName',
              children:'children'
              }"
            clearable>
            </el-cascader> -->
          <el-select
            v-if="type == 'edit' && item.type == 'dropdown1'"
            size="small"
            clearable
            style="width:80%" 
            v-model="item.value"
            placeholder="--请选择--"
          >
            <el-option
              v-for="dic in item.dicList"
              :key="dic.code"
              :label="dic.name"
              :value="dic.name"
            ></el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <div v-if="item.type == 'dropdown2' && handleEditData.length>0 && item.name == '油品分析方'" v-for="(cylinder,index) in handleEditData" :key="index">
              <el-col :span="6">
                <el-form-item :label="cylinder.name+'：'" :required="cylinder.required">
                  <el-input v-if="(cylinder.type == 'input1' || cylinder.type == 'input2') && type == 'edit'" clearable placeholder="--请输入--" size="small" style="width:80%"  :maxlength="cylinder.length" v-model="cylinder.value"></el-input>
                </el-form-item>
              </el-col>
          </div>
          <div v-if="item.type == 'radio5' && item.value == item.children[0].valueCode" v-for="(cylinder,index) in item.children" :key="index">
              <el-col :span="6">
            <el-form-item :label="cylinder.name+'：'" :required="cylinder.required">
              <el-input v-if="(cylinder.type == 'input1' || cylinder.type == 'input2') && type == 'edit'" clearable placeholder="--请输入--" size="small" style="width:80%"  :maxlength="cylinder.length" v-model="cylinder.value"></el-input>
            </el-form-item>
            </el-col>
          </div>
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
    oilChangeObj:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  data(){
    return{
      loadingRemote: false,
      uploadUrl:'',
      oilChangeForm:this.oilChangeObj,
      imgDialogVisible:false,
      notShowUploadBtn:false,
      dialogImageUrl:'',
      tempImagePath:'',
      oilNameKey:0,
      oilNameList:[]      ,
      editOil:false,
      handleEditData:[]
    }
  },
  mounted(){
    
  },
  created(){
    this.oilChangeForm = this.oilChangeObj
    let formData = []
    formData = this.oilChangeForm.filter(item=>{
      return item.name == '油品分析方'
    })
    let otherData = formData[0].children.filter(item=>{
      return item.name == '其它'
    })
    if(formData[0].value == '其它') {
      this.handleEditData = otherData[0].children
    }
    // 找出dropdown1类型
    this.oilChangeForm.forEach(item=>{
      if(item.type == 'dropdown1'){
        this.getDicList(item.nameKey)
      }
    })
    this.getOilList('')
  },
  methods:{
    // dic下拉改变事件
    changeselect(val){
      if(val == '其它') {
        let formData = []
        formData = this.oilChangeForm.filter(item=>{
          return item.name == '油品分析方'
        })
        let otherData = formData[0].children.filter(item=>{
          return item.name == '其它'
        })
        this.handleEditData = otherData[0].children
        this.handleEditData[0].value = ''
      } else {
        this.handleEditData = []
      }
    },
    // 获取dropdown1类型的dic下拉数据源
    getDicList(key){
      this.requestMethodGet("/web/common/dic/drops",{name:key}).then(res=>{
        res=res.data
        if(res.code == 1000){
          this.deviceForm.forEach(item=>{
          if(item.nameKey == key){
            item.dicList = res.data
          }
        })
        }else{
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      })
    }, 
      // 获取油品下拉
    getOilList(val){
      this.loadingRemote = true
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, status:1, size:200, current:1})
        .then(res => {
          res = res.data;
          this.loadingRemote = false
          if (res.code == 1000) {
            this.oilNameList = res.data.list
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
     // 用油名称改变
    oilNameChange(item){
      if(item) {
        const data = this.oilChangeForm
        const checkedData = this.$refs.cascaderRef[0].getCheckedNodes()[0]
        let oilNameValueCode = []
        let oilBrandValueCode = item.valueCode[0]
        data.forEach(it=>{
          if(it.nameKey == 'new_oil'){
            oilNameValueCode = it.valueCode
          }
        })
        if(oilBrandValueCode == 'oil_0001'){//美孚
          if(oilNameValueCode.length != 4){
            this.$message({
              message:'请选择新用油品名称',
              type:'warning'
            })
            item.valueCode = ''
            return
          }else{
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length-1]
          }
        }else{
          if(oilNameValueCode.length != 3){
            this.$message({
              message:'请选择新用油品名称',
              type:'warning'
            })
            item.valueCode = ''
            return
          }else{
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length-1]
          }
        }
      }
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath(path){
      const params = {
          url:path
        }
        this.requestMethodGet("/web/file/getFullUrl", params).then(res=>{
          if (res.data.code == 1000) {
            this.deviceForm.forEach(item=>{
              if(item.nameKey == 'device_img'){
                item.value = path
                item.imgFullDtoUrl = []
                item.imgFullDtoUrl.push({
                  name:item.nameKey,
                  url:res.data.data
                })
              }
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
    },
    // 删除
    removeFileChange(file,fileList){
      this.notShowUploadBtn=false
      this.deviceForm.forEach(item=>{
        if(item.nameKey == 'device_img'){
          item.value = ''
          item.imgFullDtoUrl = []
        }
      })
    },
    // 预览
    handlePictureCardPreview(){
      const params = {
        url:this.tempImagePath
      }
      this.requestMethodGet("/web/file/getFullUrl", params).then(res=>{
        if (res.data.code == 1000) {
          this.dialogImageUrl = res.data.data
          this.imgDialogVisible = true
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      })
    },
    // 验证
    validateOilChange(deviceRef){
      const data = this.oilChangeForm
      let radio5EmptyList = []
      let dropdown2List = []
      let dropdown2ListChild = []
      let emptyChildList = []
      let emptyChildList2 = []
      let emptyList = data.filter(item=>{
        return item.required && !item.value
      })
      // 找出radio2类型
      const dataType = data.filter(item=>{
        return item.type == 'input2'
      })
      let isNotNum = []
      dataType.forEach(it=>{
        if(it.value){
          let obj = {}
          if(parseFloat(it.value).toString() == 'NaN'){
            obj.name = it.name
            obj.value = it.value
            isNotNum.push(obj)
          }
        }
      })
      if(isNotNum.length>0){
        this.$message({
          message:isNotNum[0].name+'值应为数字',
          type:'warning'
        })
        return
      }
      // 找出dropdown2类型
      data.forEach(item=>{
        if(item.type == 'dropdown2' && item.value == '其它'){
          dropdown2ListChild= item.children.filter(it=>{
            return it.name == '其它'
          })
          dropdown2List = dropdown2ListChild[0].children.filter(it=>{
            return it.required && !it.value
          })
        }
      })
      emptyChildList2 = emptyChildList2.concat(emptyList).concat(dropdown2List)
      // 找出radio5类型
      data.forEach(item=>{
        if(item.type == 'radio5' && item.value == '1'){
          radio5EmptyList = item.children.filter(it=>{
            return it.required && !it.value
          })
        }
      })
      emptyChildList = emptyChildList.concat(emptyList).concat(radio5EmptyList).concat(emptyChildList2)
      if(emptyChildList.length>0){
        this.$message({
          message:emptyChildList[0].name+'必填',
          type:'warning'
        })
        return
      }else{
        this.$emit('passModulValidate','oilChange')
      }
    },
  }
}
</script>

<style lang='less'>
.oilChangeHistory {
  .noUploadBtn .el-upload--picture-card {
      display: none;
  }
  .title {
    font-family:MicrosoftYaHei-Bold;
    font-size:14px;
    color:#000;
    line-height:14px;
    font-weight:bold;
    display: flex;
  }
  .el-upload-list__item {
    transition: none !important;
  }
}
</style>