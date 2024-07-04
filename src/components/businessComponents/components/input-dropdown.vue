<template>
  <div ref="inputDropdownContent">
    <el-input
      ref="inputDropdown"
      size="small"
      style="width:220px"
      clearable
      :disabled="disabledEditFlag"
      v-model="loopItem.value" 
      :placeholder="placeholder"
      :maxlength="loopItem.length"
      @blur="inputDropBlur"
      @focus="inputDropFocus"
      @change="inputDropChange">
    </el-input>
    <el-select 
      size="small"
      style="width:100px"
      filterable
      @change="unitChange"
      :disabled="disabledEditFlag"
      v-model="loopItem.valueCode"
      :placeholder="placeholder">
      <el-option
        v-for="op in loopItem.fieldOption"
        :disabled="op.disabled"
        :key="op.value"
        :label="op.option"
        :value="op.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props:{
    // 循环时的单个对象，做校验使用
    loopItem:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    disabledEditFlag:{
      type:Boolean,
      default:false
    },
    reportType:{
      default:Number,
      default:null
    }
  },
  data() {
    return {
      placeholder:'请输入'
    };
  },
  watch:{
    loopItem:{
      handler:function(val,oldVal){
        // this.placeholder = _.isEmpty(val.styleJsonDto.placeholder)?'请输入':val.styleJsonDto.placeholder
      },
      immediate:true
    },
  },
  methods: {
    // 聚焦
    inputDropFocus(){

    },
    // 改变
    inputDropChange(){
      this.$emit('inputDropChange', this.loopItem)
    },
    // 失去焦点
    inputDropBlur(){
      // 判断input2类型的输入值是否为数字
      if(Number(this.loopItem.value).toString() === 'NaN'){
        this.loopItem.value = ''
        this.$message({
          type:'warning',
          message:this.loopItem.nodeName + '-' + this.loopItem.name + '值应为数字'
        })
      }else{
        // 判断是否允许输入小数
        const item = this.loopItem
        if (item.decimalPrecision != null) {
          if(!item.value) return
          let val1 = item.value.toString()
          if (val1.indexOf('.') > -1 && val1.split('.')[1].length > item.decimalPrecision && item.decimalPrecision) {
            if (item.decimalPrecision == 1) {
              item.value = val1.substr(0, val1.indexOf('.') + 2)
            } else if (item.decimalPrecision == 2) {
              item.value = val1.substr(0, val1.indexOf('.') + 3)
            } else if (item.decimalPrecision == 3) {
              item.value = val1.substr(0, val1.indexOf('.') + 4)
            }
          }
        } else {
          let val1 = item.value.toString()
          if (val1.indexOf('.') > -1) {
            item.value = val1.substr(0, val1.indexOf('.'))
          }
          if(val1<item.rangeMin || val1>item.rangeMax){
            this.$message({
              type:'warning',
              message:item.nodeName + '-' + item.name + '值应为' + item.rangeMin + '到' + item.rangeMax + '的整数'
            })
            item.value = ''
          }
        }
        if (item.rangeMin >= 0) {
          item.value = item.value.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
          item.value = item.value.replace(/^\./g, '') // 验证第一个字符是数字而不是.
          item.value = item.value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
          item.value = item.value
            .replace('.', '$#$')
            .replace(/\./g, '')
            .replace('$#$', '.') // 只允许输入一个小数点
          item.value = item.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入3个小数
          item.value = item.value.replace(/(\d+|\.)-/g, '$1') // 数字和.后面不能接-,不能出现类似11-, 12.-
          item.value = item.value.replace(/(-)0+(\d+)/g, '$1$2') // 不能出现-01,-02类似
          item.value = item.value.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
        } else {
          item.value = item.value.replace(/[^\-\d.]/g, '') // 清除"数字"和"."以外的字符
          item.value = item.value.replace(/^\./g, '') // 验证第一个字符是数字而不是.
          item.value = item.value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
          item.value = item.value
            .replace('.', '$#$')
            .replace(/\./g, '')
            .replace('$#$', '.') // 只允许输入一个小数点
          item.value = item.value
            .replace('-', '$#$')
            .replace(/\-/g, '')
            .replace('$#$', '-') // 只允许输入一个负号
          item.value = item.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3') // 只能输入3个小数
          item.value = item.value.replace(/(\d+|\.)-/g, '$1') // 数字和.后面不能接-,不能出现类似11-, 12.-
          item.value = item.value.replace(/(-)0+(\d+)/g, '$1$2') // 不能出现-01,-02类似
          item.value = item.value.replace(/^0+(\d)/, '$1') // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
        }
      }
      if(this.reportType == 3 && this.loopItem.nameKey == "key_149_oil_change"){
        // 润滑点设备类型,滚动轴承：lubrication_point_type_0007
        const lupEpType = sessionStorage.getItem('lupEpType')
        // 选择的单位,D:天，H:小时，M:月，Y:年，KM:公里
        const unit = this.loopItem.valueCode
        if(unit != 'KM'){
          this.handlerMaxVal(unit,lupEpType)
        }
      } 
    },
    handlerMaxVal(unit,lupEpType){
      let max
      switch(unit){
        case 'D':
        max = 730
          break
        case 'H':
        max = 17520
          break
        case 'M':
        max = 24
          break
        case 'Y':
        max = 2
          break
      }
      if(lupEpType != 'lubrication_point_type_0007'){
        max = max*10
      }
      if(!(this.loopItem.value>=1 && this.loopItem.value<=max)){
        this.$message({
          type: "error",
          message: `换油/加脂周期：请输入1~${max}的整数`
        });
        this.loopItem.value = ''
      }
    },
    unitChange(val) {
      if(this.reportType==8 && (this.loopItem.nameKey=='key_1050' || this.loopItem.nameKey=='key_1051' || this.loopItem.nameKey=='key_1052' || this.loopItem.nameKey=='key_1053'))return
      this.loopItem.unit = this.loopItem.fieldOption.filter(it=>{
        return it.value == val
      })[0].option
      if(this.reportType == 3 && this.loopItem.nameKey == "key_149_oil_change"){
        if(val){
          this.loopItem.value = ''
        }
      }
    },
  }
};
</script>
<style lang='less' scoped>

</style>