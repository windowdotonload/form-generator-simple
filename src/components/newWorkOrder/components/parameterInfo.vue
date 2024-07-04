<template>
  <div style="margin-top:30px;margin-left:100px">
    <el-form :model="paramsForm" label-position="right" label-width="auto">
      <el-row v-for="(item,index) in paramsForm" :key="index">
        <el-col :span="24">
          <el-form-item
          :required="item.required">
            <span slot="label" v-if="item.unit">{{item.name}}（{{item.unit}}）：</span>
            <span slot="label" v-else>{{item.name}}：</span>
            <div v-if="type == 'view'">
              <span v-if="item.unit">{{item.value}}{{item.unit}}</span>
              <span v-if="item.type !='radio1' && !item.unit">{{item.value}}</span>
              <span v-if="item.type =='radio1'">{{item.radioValueDesc}}</span>
            </div>
            <el-radio-group v-model="item.value" v-if="type == 'edit' && item.type == 'radio1'">
              <el-radio v-for="(it,idx) in item.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
            </el-radio-group>
            <el-input v-if="type == 'edit' && item.type == 'input1'" style="width:350px" clearable size="small" :maxlength="item.length" v-model="item.value" placeholder="--请输入--" class="params-input"></el-input>
            <el-input v-if="type == 'edit' && item.type == 'input2'" style="width:350px" clearable size="small" :maxlength="item.length" v-model="item.value" placeholder="--请输入--" class="params-input"></el-input>
            <!-- dropdown1  这种类型的下拉框调用字典接口获取下拉信息 -->
              <el-select
                v-if="type == 'edit' && item.type == 'dropdown1'"
                size="small"
                clearable
                v-model="item.value"
                placeholder="--请选择--"
              >
                <el-option
                  v-for="(dic,index) in item.dicList"
                  :key="dic.code"
                  :label="dic.name"
                  :value="dic.name"
                ></el-option>
              </el-select>
              <!-- dropdown  循环系统的系统要求的油品清洁度等级（ISO清洁度等级）/ 在用油品清洁度等级（ISO清洁度等级） -->
              <div v-if="item.type == 'dropdown' && (item.nameKey == 'key_252' || item.nameKey == 'key_253')">
              <el-col :span="18">
                <el-select
                  size="small"
                  clearable
                  v-model="item.value"
                  placeholder="--请选择--"
                >
                  <el-option
                    v-for="filed in item.fieldOption"
                    :key="filed.value"
                    :label="filed.option"
                    :value="filed.option"
                  ></el-option>
                </el-select>
                <el-input clearable placeholder="--请输入--" size="small" style="width:220px" :maxlength="item.children[0].length" v-model="item.children[0].value"></el-input>
              </el-col>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import validateForm from "@/components/businessComponents/components/validateForm";
export default {
  mixins: [validateForm],
  props:{
    type:{
      type:String,
      default:()=>{
        return ''
      }
    },
    paramsObj:{
      type:Array,
      default:()=>{
        return []
      }
    },
    deviceObj:{
      type:Array,
      default:()=>{
        return []
      }
    },
    stepListLength:{
      type:Number,
      default:()=>{
        return 0
      }
    }
  },
  data(){
    return{
      paramsForm:[]
    }
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
      this.paramsObj.forEach(it=>{
        if(it.valueCode == is_lup_device_detail_value){
          data = it.children
        }
      })
    }else{
      data = this.paramsObj
    }
    this.paramsForm = data
    // 找出dropdown1类型
    this.paramsForm.forEach(item=>{
      if(item.type == 'dropdown1'){
        this.getDicList(item.nameKey)
      }
    })
  },
  methods:{
    // 获取dropdown1类型的dic下拉数据源
    getDicList(key){
      this.requestMethodGet("/web/common/dic/drops",{name:key}).then(res=>{
        res=res.data
        if(res.code == 1000){
          this.paramsForm.forEach(item=>{
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
    childMethod(){
      // const data = this.paramsForm
      // const dataType = data.filter(item=>{
      //   return item.type == 'input2'
      // })
      // let isNotNum = []
      // dataType.forEach(it=>{
      //   if(it.value){
      //     let obj = {}
      //     if(parseFloat(it.value).toString() == 'NaN'){
      //       obj.name = it.name
      //       obj.value = it.value
      //       isNotNum.push(obj)
      //     }
      //   }
      // })
      // if(isNotNum.length>0){
      //   this.$message({
      //     message:isNotNum[0].name+'值应为数字',
      //     type:'warning'
      //   })
      // }else{
      //   this.$emit('passModulValidate')
      // }
      const data = this.paramsForm.filter(item=>{
        return !(item.type == 'dropdown' && (item.nameKey == 'key_252' || item.nameKey == 'key_253'))
      })
      const flag = this.validateFormItem(data,false)
      if(!flag) return
      let dropdownAndInputList = []
      let validateDropdownAndInputList = []
      let dropdownAndInputFlag = false
      this.paramsForm.forEach(item=>{
        if(item.type == 'dropdown' && (item.nameKey == 'key_252' || item.nameKey == 'key_253')){
          dropdownAndInputList.push(item)
        }
      })
      if(dropdownAndInputList.length){
        dropdownAndInputList.forEach(it=>{
          if(!it.value){
            validateDropdownAndInputList.push(it)
            if(!it.children[0].value){
              validateDropdownAndInputList.push(it.children[0])
            }
          }else{
            if(!it.children[0].value){
              validateDropdownAndInputList.push(it.children[0])
            }
          }
        })
        if(validateDropdownAndInputList.length){
          this.$message({
            type:'warning',
            message:validateDropdownAndInputList[0].nodeName + '-'  + validateDropdownAndInputList[0].name.replace(/#/g,'') + '必填',
          })
          dropdownAndInputFlag = false
          return
        }else{
          dropdownAndInputFlag = true
        }
      }else{
        dropdownAndInputFlag = true
      }
      if(dropdownAndInputFlag){
        this.$emit('passModulValidate')
      }
    }
  }
}
</script>

<style>

</style>
