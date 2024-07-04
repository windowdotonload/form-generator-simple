export default {
  methods: {
    // 校验方法
    validateFormItem(formArr,isParameterReport=true){
      let resultFlag = false
       // richText 富文本类型
      let richTextList = []
      // string,input,textarea，datepicker，radio类型
      let valueList = []
      // dropdown类型
      let valueCodeList = []
      // checkbox类型
      let valueCheckBoxList = []
      // file类型
      let serviceReportFileDtoList = []
      // img，img2类型
      let imgFullDtoUrl = []
      this.validateItemList = []
      // 找到所有必填项
      this.handleItem(formArr)
      // 根据必填项类型进行分类
      this.validateItemList.forEach(it=>{
        if((it.type == 'string' || 
          it.type.includes('input') || 
          it.type == 'textarea' || 
          it.type.includes('datepicker') || 
          it.type.includes('radio')) && (it.value == null || it.value == '')){
            valueList.push(it)
        }else if(it.type.includes('dropdown') && (it.valueCode == null || it.valueCode == '') && it.type != 'dropdown_multi'&&it.type != 'dropdown_multi_oil'){
          valueCodeList.push(it)
        }else if((it.type == 'checkbox' || it.type == 'dropdown_multi') && _.isEmpty(it.valueCheckBoxList)){
          valueCheckBoxList.push(it)
        }else if(it.type=='img' && _.isEmpty(it.imgFullDtoUrl)){
          imgFullDtoUrl.push(it)
        }else if(it.type=='img2' && _.isEmpty(it.imgFullUrl)){
          imgFullDtoUrl.push(it)
        }else if(it.type=='file' && _.isEmpty(it.serviceReportFileDtoList)){
          serviceReportFileDtoList.push(it)
        }else if(it.type=='richText'&&it.value == '<p><br></p>'){
          richTextList.push(it)
        }
      })
      if(isParameterReport){
        // 液压系统检查报告-油品检查中的dropdown5类型的子集检验
        if(this.reportObj.reportType==5){
          // 找出dropdown5类型
          this.dropdown5List = []
          const arr = formArr.filter(it=>{
            return it.nameKey == 'key_ye_ya_ypjc'
          })[0].children
          this.findDropdown5Item(arr)
          this.dropdown5List.forEach(item=>{
            // 新增检查项的需求---这项必填时才校验
            if(item.children[0].required && (item.children[0].value == null || item.children[0].value == '')){
              valueList.push(item.children[0])
            }
          })
        }
        // 循环系统检查报告-循环系统运行参数和润滑系统检查-油品检查
        if(this.reportObj.reportType==4){
          // 找出dropdown5类型
          this.dropdown5List = []
          const arr1 = formArr.filter(it=>{
            return it.nameKey == 'key_system_oil_clean_level'
          })
          const arr = formArr.filter(it=>{
            return it.nameKey == 'key_ypjc'
          })[0].children
          this.findDropdown5Item(arr)
          const list = arr1.concat(this.dropdown5List)
          list.forEach(item=>{
            // 新增检查项的需求---这项必填时才校验
            if(item.required && (item.children[0].value == null || item.children[0].value == '')){
              valueList.push(item.children[0])
            }
          })
        }
        if(this.reportObj.reportType==33){
          const list = formArr.filter(it=>{
            return (it.type == "dropdown5" && it.display)
          })
          list.forEach(item=>{
            // 新增检查项的需求---这项必填时才校验
            if(item.children[0].required && (item.children[0].value == null || item.children[0].value == '')){
              valueList.push(item.children[0])
            }
          })
        }
      }
      const resultList = [...valueList,...valueCodeList,...valueCheckBoxList,...serviceReportFileDtoList,...imgFullDtoUrl,...richTextList]
      const names = resultList.map(it=>it.name)
      const nameKey = resultList.map(it=>it.nameKey)
      const ids = resultList.map(it=>it.id)
      console.log('resultList',names,nameKey,ids)
      if(resultList.length){
        this.$message({
          type:'warning',
          message:resultList[0].nodeName + '-'  + resultList[0].name.replace(/#/g,'') + '必填',
        })
        resultFlag = false
        return resultFlag
      }else{
        resultFlag = true
      }
      return resultFlag
    },
    handleItem(arr){
      arr.forEach(it=>{
        if(it.required && it.display){
          this.validateItemList.push(it)
          if(it.children.length){
            this.handleItem(it.children)
          }else{
            return
          }
        }else{
          if(this.reportObj && this.reportObj.reportType && (this.reportObj.reportType==4 || this.reportObj.reportType==5 || this.reportObj.reportType==6 || this.reportObj.reportType==7 || this.reportObj.reportType==8)){
            // 新增检查项的报告中选中的检查项且项目必填才校验未选择的不校验
            if((it.children.length && it.display) || (it.children.length && !it.display && it.name.includes('不展示'))){
              this.handleItem(it.children)
            }
          }else{
            if(it.children.length){
              this.handleItem(it.children)
            }
          }
        }
      })
    },
    findDropdown5Item(arr){
      arr.forEach(it=>{
        // 必填的时候才校验
        if(it.type == 'dropdown5' && it.display && it.required){
          this.dropdown5List.push(it)
          if(it.children.length){
            this.findDropdown5Item(it.children)
          }
        }else{
          if(it.children.length){
            this.findDropdown5Item(it.children)
          }
        }
      })
    },
  },
}