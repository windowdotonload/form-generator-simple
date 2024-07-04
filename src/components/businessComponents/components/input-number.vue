<template>
  <div ref="inputNumberContent">
    <el-input
      ref="inputNumber"
      size="small"
      :style="isNotLimitWith ? '' : 'width:220px'"
      clearable
      v-model="loopItem.value" 
      :placeholder="placeholder"
      :disabled="disabledEditFlag"
      :maxlength="loopItem.length"
      @clear="clearInputNumber"
      @blur="inputNumberBlur"
      @focus="inputNumberFocus"
      @change="inputNumberChange">
    </el-input>
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
    isNotLimitWith:{
      type:Boolean,
      default:false
    },
    disabledEditFlag:{
      type:Boolean,
      default:false
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
    inputNumberFocus(){

    },
    // 改变
    inputNumberChange(){
      
    },
    // 失去焦点
    inputNumberBlur(){
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
        if (item.decimalPrecision) {
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
          // else{
          //   if(val1.length>item.length){
          //     this.$message({
          //       type:'warning',
          //       message:item.nodeName + '-' + item.name + '值应为' + item.rangeMin + '到' + item.rangeMax
          //     })
          //     item.value = ''
          //   }
          // }
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
        // if (!item.decimalPrecision) {
        //   item.value = item.value.replace(/[^\d]/g, '') // 清除"数字"和"."以外的字符
        //   item.value = item.value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '') // 清除"数字"和"."以外的字符
        // }
      }
      this.$emit('inputNumberBlur',this.loopItem)
    },
    // 清除
    clearInputNumber(){
      this.$emit('inputNumberBlur',this.loopItem)
    },
  }
};
</script>
<style lang='less' scoped>

</style>