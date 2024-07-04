let lubricationPointNumberList = []
export const reportParamSimplify = (valueDtoList) => {
  lubricationPointNumberList = []
  if(valueDtoList.length){
    valueDtoList.forEach(item=>{
      item.nodeValue = item.nodeValue.map(it=>{
        if(it.nameKey==="key_device_lub_group"){
          lubricationPointNumberList = lubricationPointNumberList.concat(getlubricationPointNumber(it.children))
        }
        let children = simplifyChildren(it.children)
        return {
          id:it.id,
          parentId:it.parentId,
          name:it.name,
          nameKey:it.nameKey,
          value:it.value,
          valueCode: it.nameKey === 'key_every_time_add_num' || it.nameKey === 'key_add_oil_period' ? it.unit : it.valueCode,
          valueCheckBoxList:it.valueCheckBoxList,
          children:children,
          display:it.display,
          styleJson:it.styleJson,
          styleJsonDto:it.styleJsonDto,
          serviceReportFileDtoList:it.serviceReportFileDtoList
        }
      })
    })
  }
  return {
    valueDtoList:valueDtoList,
    lubricationPointNumberList:lubricationPointNumberList
  }
}

function getlubricationPointNumber(list){
  let lubricationPointNumberList = []
  list.forEach((childIt=>{
    if(childIt.nameKey === "key_device_lub_parent"){
      if(childIt.children.find(luItem=>luItem.nameKey ==="key_lup_number")){
        lubricationPointNumberList.push(childIt.children.find(luItem=>luItem.nameKey ==="key_lup_number").value) 
      }
    }
  }))
  return lubricationPointNumberList
}

function simplifyChildren(children){
  let list = children.map(item=>{
    if(item.nameKey==="key_device_lub_group"){
      lubricationPointNumberList = lubricationPointNumberList.concat(getlubricationPointNumber(item.children))
    }
    return {
      id:item.id,
      parentId:item.parentId,
      name:item.name,
      nameKey:item.nameKey,
      value:item.value,
      valueCode:item.nameKey === 'key_every_time_add_num' || item.nameKey === 'key_add_oil_period' ? item.unit : item.valueCode,
      valueCheckBoxList:item.valueCheckBoxList,
      children:item.children && item.children.length ? simplifyChildren(item.children) : item.children,
      display:item.display,
      styleJson:item.styleJson,
      styleJsonDto:item.styleJsonDto,
      serviceReportFileDtoList:item.serviceReportFileDtoList
    }
  })
  return list
}