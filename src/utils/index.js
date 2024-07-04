/**
 * @desc 多表单校验
 * @params 多表单的ref
 * @example PES服务包创建，设备新增
 * @return 校验结果
 * **/ 
export function validateForms(formRefs) {
      let objectList = [];
      let results = formRefs.map(formRef =>
        new Promise((resolve, reject) => {
          formRef.validate((valid, object) => {
            if (valid) {
              resolve();
            } else {
              objectList.push(object);
              reject();
            }
          });
        })
      )
      return Promise.all(results).catch(() => {
        return Promise.reject(objectList);
      });
    }
 /**
* @param date 时间参数
* 日期格式化 返回格式2018-12-25 13:38:40
*/
export function formatDate(date) {
   const year = date.getFullYear()
   const month = date.getMonth() + 1
   const day = date.getDate()
   const hour = date.getHours()
   const minute = date.getMinutes()>9 ? date.getMinutes() : '0' + date.getMinutes()
   const second = date.getSeconds()>9 ? date.getSeconds() : '0' + date.getSeconds() 
   return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
}
  // 前后端约定配置的错误信息提示
export function constContent(msg) {
  let flag = false
  let list =  [
    '美孚员工需要使用单点登入网页端',
    '账号不存在或者未授权!',
    '您尚未被授权，请前往美孚数智服务平台小程序授权或者联系美孚客服',
    '微信授权失败请稍后重试',
    '贵司当前系统状态为禁用，暂无法登录系统'
  ]
  if(list.includes(msg)) {
    flag = true
  }
  return flag
}
// 字典下拉值
export  async function getDicDataList(nameKey){
  let list = []
   await this.requestMethodGet("/web/common/dic/drops", {name:nameKey}).then(res => {
    if (res.data.code == 1000) {
      list = res.data.data
      resolve(res.data.data)
    } else {
      this.$message({
        message: res.msg,
        type: "warning"
      });
    }
   }).catch(err=>{})
   return list
}

export  async function getOilNameByOilCode(code){
  let name = ''
  await this.requestMethodGet("/mdm/oil/getOilNameByCode",{code:code}).then(res => {
  if (res.data.code == 1000) {
    name = res.data.data
    resolve(res.data.data)
  } else {
    this.$message({
      message: res.data.msg,
      type: "warning"
    });
  }
  }).catch(err=>{})
  return name
}

/**
 * @desc 车间下拉，搜索
 * 
 * @params companyId：查询的公司ID
 * type:Number
 * 
 * @params workshopName：搜索时输入的车间名称
 * type:String
 * 
 * @params current：分页的页数
 * type:Number
 * 
 * @params size：分页的大小
 * type:Number
 * 
 * @return 
 * list:[]
 * pageIndex:Number
 * pageSize:Number
 * totalCount:Number
 * 
 * **/

export  async function get_company_workshop_ist(params){
  let data
   await this.requestMethodGet("weChat/workshop/queryWorkshopListByPage", params).then(res => {
    if (res.data.code == 1000) {
      data = res.data.data
      resolve(res.data.data)
    } else {
      this.$message({
        message: res.msg,
        type: "warning"
      });
    }
   }).catch(err=>{})
   return data
}

/**
 * @desc 设备类型 级联数据
 * 
 * @return 
 * list:[]
 * 
 * **/
 export  async function get_deviceTree_list(){
  let data
   await this.requestMethodGet("weChat/device/queryAllDeviceTypeTree4", {}).then(res => {
    if (res.data.code == 1000) {
      data = res.data.data
      resolve(res.data.data)
    } else {
      this.$message({
        message: res.msg,
        type: "warning"
      });
    }
   }).catch(err=>{})
   return data
}

/**
 * @desc 获取客户下拉数据以及搜索
 * 
 * @params size
 * type:Number
 * 
 * @params companyName
 * type:String
 * 
 * @return
 * list:[]
 * pageIndex:Number
 * pageSize:Number
 * totalCount:Number
 * 
 * **/
 export  async function get_customer_company_list(params){
  let data
  params.companyType = 2
  params.status = 1
   await this.requestMethodGet("web/customer/queryCompanyListByPage", params).then(res => {
    if (res.data.code == 1000) {
      data = res.data.data
      resolve(res.data.data)
    } else {
      this.$message({
        message: res.msg,
        type: "warning"
      });
    }
   }).catch(err=>{})
   return data
}

/**
 * @desc 获取公司下的部门树
 * 
 * @params companyId
 * type:Number
 * 
 * @params size
 * type:Number
 * 
 * @params current
 * type:Number
 * 
 * @return
 * list:[]
 * pageIndex:Number
 * pageSize:Number
 * totalCount:Number
 * 
 * **/
 export  async function get_customer_dept_list(params){
  let data
   await this.requestMethodGet("web/system/permission/orgDeptManage/deptTreeByCompanyId", params).then(res => {
    if (res.data.code == 1000) {
      data = res.data.data
      resolve(res.data.data)
    } else {
      this.$message({
        message: res.msg,
        type: "warning"
      });
    }
   }).catch(err=>{})
   return data
}

/**
 * @desc 获取部门下的岗位
 * 
 * @params companyId
 * type:Number
 * 
 * @params deptIdList
 * type [Array]
 * 
 * @params current
 * type:Number
 * 
 * @return
 * list:[]
 * pageIndex:Number
 * pageSize:Number
 * totalCount:Number
 * 
 * **/
 export  async function get_customer_post_list(params){
  let data
  params.flagDeptHead = 2
  params.requestSource = 2
   await this.requestMethodPost("web/system/permission/orgPostManage/queryPostList", params).then(res => {
    if (res.data.code == 1000) {
      data = res.data.data
      resolve(res.data.data)
    } else {
      this.$message({
        message: res.msg,
        type: "warning"
      });
    }
   }).catch(err=>{})
   return data
}

/**
 * @desc 获取部门下的岗位
 * 
 * @params companyId
 * type:Number
 * 
 * @params deptIdList
 * type [Array]
 * 
 * @params current
 * type:Number
 * 
 * @return
 * list:[]
 * pageIndex:Number
 * pageSize:Number
 * totalCount:Number
 * 
 * **/
 export  async function download_file(params){
  let data
   await this.requestMethodPost("web/system/permission/orgPostManage/queryPostList", params).then(res => {
    if (res.data.code == 1000) {
      data = res.data.data
      resolve(res.data.data)
    } else {
      this.$message({
        message: res.msg,
        type: "warning"
      });
    }
   }).catch(err=>{})
   return data
}