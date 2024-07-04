<!--
* @description 编辑经销商档案
* @fileName editDealerProfile.vue
* @author vvx
* @date 2020/04/14 09:50:24
* @version V1.0.0
!-->
<template>
  <div class="edit-dealer-profile" :style="mainminheight">
    <!-- 图片信息 -->
    <p class="edit-dealer-profile-title">
      公司LOGO
      <span>建议公司LOGO宽高上传比例为：200*200</span>
    </p>
    <el-upload
      :class="{hide:hideUpload || imageList.length > 0}"
      :action="uploadUrl"
      list-type="picture-card"
      limit="1"
      :file-list="imageList"
      accept="image/*"
      :auto-upload="false"
      :on-change="handleAddFile"
      :on-remove="handleRemove"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <!-- 基本信息 -->
    <p class="edit-dealer-profile-title">基本信息</p>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="edit-dealer-profile-ruleForm"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="名称" required prop="companyName">
            <el-select
              size="small"
              v-model="ruleForm.companyName"
              :filter-method="handleGetCompanyNameData"
              @change="handleChangeCompany"
              filterable
              :loading="loading"
              style="width:80%;"
              placeholder="请输入4字以上查询公司"
            >
              <el-option
                v-for="(item,index) in companyNameList"
                :key="index"
                :label="item.companyName"
                :value="item.taxNumber"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <div style="color:#999" slot="label">
              <i style="color:red;">*</i><span style="margin:0 20px 0 10px;">税号</span><i class="el-icon-info"></i> 由经销商名称，自动带出
            </div>
            <span>{{ruleForm.taxNumber}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规模">
            <el-select size="small" v-model="ruleForm.custScale" clearable placeholder="请选择" style="width:80%;">
              <el-option
                v-for="item in scaleList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="城市" prop="city">
            <el-cascader
              size="small"
              placeholder="--请选择--"
              v-model="ruleForm.city"
              :options="areaList"
              :props="{ multiple: true,value:'code',label:'name' }"
              clearable
              filterable
              @change="handleChangArea"
              style="width:80%;"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="">
            <div style="color:#999" slot="label">
              <span style="margin-right:20px">区域</span><i class="el-icon-info"></i> 由城市所配置区域，自动带出
            </div>
            <span v-for="(item,index) in ruleForm.citysInfos" :key="index">
              <span>{{item.cityName}}-{{item.areaName?item.areaName:'暂无'}}<span v-if="index!=ruleForm.citysInfos.length-1">，</span></span>
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办公地址">
            <el-input
              size="small"
              placeholder="请输入"
              clearable
              v-model="ruleForm.address"
              maxlength="100"
              style="width:80%;"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="联系电话" prop="telephone">
            <el-input
              size="small"
              placeholder="请输入手机号"
              clearable
              v-model="ruleForm.telephone"
              maxlength="18"
              style="width:80%;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="状态">
            <el-select size="small" v-model="ruleForm.status" clearable placeholder="请选择" style="width:80%;">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建日期">
            <span>{{ruleForm.createTimeStr}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="是否支持批量导入风机主齿箱换油报告">
            <el-radio-group v-model="ruleForm.importChangeOilFlag">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row> -->
      <p class="edit-dealer-profile-title">关联信息</p>
      <el-row :gutter="20">
        <el-col :span="10" >
            <span style="float:left;color:#999;width:120px;font-size:14px;line-height:32px;text-align:right">MSLA &nbsp;Account：</span>
            <el-input
              size="small"
              placeholder="请输入36位GUID"
              clearable
              v-model="accountInfo.legacyId"
              maxlength="36"
              style="width:50%;float:left;margin-right:20px"
            ></el-input>
            <el-button type="danger" style="float:left;margin-right:20px" @click="handleUpdate('ruleForm')" size="small">{{accountInfo.id?'更新':'绑定'}}</el-button>
            <span type="danger" @click="unbundling()" v-if="accountInfo.id" style="margin-right:10px;color:#999;line-height:32px;font-size:14px;cursor:pointer">解绑</span>
        </el-col>
        <el-col :span="8">
          <el-form-item label="">
              <div style="color:#999">
                <i class="el-icon-info"></i> 外部MSLA系统账号，读取MSLA绑定的ERP信息
              </div>
          </el-form-item>
        </el-col>
       </el-row>
               <el-row :gutter="20">
          <el-col :span="10" >
            <el-form-item label="">
                <span style="float:left;color:#999;width:120px;font-size:14px;line-height:32px;text-align:right">ERP账户名称：</span>
                <span style="float:left;line-height:32px;text-align:right">{{accountInfo.accountName}}</span>
            </el-form-item>
          </el-col>
       </el-row>
      <el-row :gutter="20">
          <el-col :span="6" >
              <span style="float:left;color:#999;width:120px;font-size:14px;line-height:32px;text-align:right">ERP &nbsp;ID：</span>
                <span style="float:left;line-height:32px;text-align:right;">{{accountInfo.erpId}}</span>
          </el-col>
          <el-col :span="12">
          <el-form-item label="">
              <div style="color:#999">
                <i class="el-icon-info"></i> 小程序用户使用商品模块的必要条件之一，若为空，公司成员商品模块不开放
              </div>
          </el-form-item>
        </el-col>
       </el-row>
        <el-row :gutter="20">
          <el-col :span="10" >
            <div style="display:flex;justify-content:flex-start">
              <div style="color:#999;width:120px;font-size:14px;line-height:32px;text-align:right">地址：</div>
              <div style="line-height:32px;word-break:break-all;" v-if="accountInfo.address">{{accountInfo.address}}</div>
            </div>
          </el-col>
       </el-row>
    </el-form>
    <!-- 提交按钮 -->
    <div slot="footer" class="edit-dealer-profile-btn">
      <el-button type="danger" @click="handleSubmitForm('ruleForm')" size="small">提交</el-button>
      <el-button type="danger" plain @click="handleResetFrom('ruleForm')" size="small">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from 'element-china-area-data' // 引入省市级别联动
export default {
  data () {
    var validatePhone = (rule, value, callback) => {
      // var regPhone = /^1(3|4|5|6|7|8|9)\d{9}$/;
      // var regPhone = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;;
      let regPhone = /^((\+?86)|(\(\+86\)))?(1[3456789][0123456789][0-9]{8}|1349[0-9]{7})$/
      var reg02 = /^([0-9]{3,4}-)?[0-9]{7,8}$/
      if (value == '') {
        callback(new Error('请输入手机号码或座机号码'))
      } else if (regPhone.test(value) || reg02.test(value) || value == '4008206130') {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码或座机号码'))
      }
    }
    var validateCity = (rule, value, callback) => {
      if (this.ruleForm.city.length == 0) {
        callback(new Error('请至少选择一个区域!'))
      } else {
        callback()
      }
    }
    var validateCompany = (rule, value, callback) => {
      if (this.ruleForm.companyName.length < 4) {
        callback(new Error('请至少输入4个字符'))
      } else {
        callback()
      }
    }
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      hideUpload: false, // 是否展示添加图片
      imageList: [], // 图片
      scaleList: [], // 规模
      areaList: [], // 市列表
      statusList: [
        { value: '1', label: '正常' },
        { value: '0', label: '禁用' }
      ], // 状态列表
      // 表单验证
      ruleForm: {
        file: '', // 图片
        companyType: '1', // 公司类型，1：经销商 2，工业客户
        companyName: '',
        companyNameShort: '',
        taxNumber: '',
        custScale: '',
        city: [],
        address: '',
        telephone: '',
        status: '',
        picDeleteFlag: '',
        // importChangeOilFlag: 0
      },
      regionCityCodeList: '',
      companyNameList: [], // 公司名称列表
      loading: false,
      //   表单验证规则
      rules: {
        companyName: [
          { required: true, validator: validateCompany, trigger: 'change' }
        ],
        city: [{ required: true, validator: validateCity, trigger: 'change' }],
        telephone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ]
      },
      currentTab: '0',
      customerData: [], // 客户信息
      staffData: [], // 员工信息
      accountInfo: {}
    }
  },

  components: {},

  computed: {},

  mounted () {
    this.getBindingAccountId()
    this.scaleList = JSON.parse(this.$route.query.scaleList)
    this.$_queryDealerInfo(this.$route.query.companyNumber) // 查询经销商信息
  },
  created () {
    this.getAllProvinceAndCityList()// 获取省市数据
  },
  methods: {
    // 查询公司信息接
    handleGetCompanyNameData (val) {
      let params = {
        pageSize: 1000,
        pageNum: 1,
        keyWord: val
      }
      this.loading = true
      if (val.length < 4) {
        this.loading = false
        this.companyNameList = []
      } else {
        this.requestMethodGet('/web/common/getBusinessInfo', params)
          .then(res => {
            res = res.data
            this.loading = false
            if (res.code == 1000) {
              if (res.data.list && res.data.list.length > 0) {
                this.companyNameList = res.data.list
              }
            } else {
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          })
          .catch(res => {
            this.loading = false
          })
      }
    },
    // 获取公司名称和税号
    handleChangeCompany (val) {
      let obj = {}
      obj = this.companyNameList.find(item => {
        return item.taxNumber === val // 筛选出匹配数据
      })
      this.ruleForm.companyName = obj.companyName
      this.ruleForm.taxNumber = obj.taxNumber
    },
    getAllProvinceAndCityList () {
      this.requestMethodGet('/weChat/common/getAreaListByBusinessArea', {businessAreaCode: ''}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data
          this.areaList = data
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 查询经销商信息
    $_queryDealerInfo (companyNumber) {
      let params = {
        companyNumber
      }
      this.regionCityCodeList = []
      this.requestMethodGet('/web/company/queryCompanyByCompanyNumber', params)
        .then(res => {
          res = res.data
          if (res.code == 1000) {
            if (res.data.logo) {
              this.imageList.push({ url: res.data.logo })
            }
            this.ruleForm = res.data
            this.ruleForm.city = this.ruleForm.regionCityArray
            for (let i in this.ruleForm.regionCityArray) {
              this.regionCityCodeList.push(this.ruleForm.regionCityArray[i][1])
            }
            if (this.ruleForm.custScale == null) {
              this.ruleForm.custScale = ''
            }
            if (this.ruleForm.companyNameShort == null) {
              this.ruleForm.companyNameShort = ''
            }
            if (this.ruleForm.address == null) {
              this.ruleForm.address = ''
            }
            if (this.ruleForm.status == null) {
              this.ruleForm.status = ''
            }
            if (this.ruleForm.createTimeStr == null) {
              this.ruleForm.createTimeStr = ''
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
    },
    //  添加文件
    handleAddFile (file, fileList) {
      if (!file.raw.type.startsWith('image')) {
        this.ImageList = []
        this.$message.error('只能上传图片类型文件')
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.imageList = []
        this.$message.error('上传图片大小不能超过 10MB!')
        return
      }
      let fileName = file.name
      this.hideUpload = fileList.length >= 1
      this.ruleForm.picDeleteFlag = 0
      this.imageList.push({ url: file.url })
      this.ruleForm.file = file.raw
    },
    // 删除图片
    handleRemove (fileList) {
      this.ruleForm.file = ''
      this.ruleForm.picDeleteFlag = 1
      this.imageList = []
      setTimeout(() => {
        this.hideUpload = fileList.length >= 1
      }, 500)
    },
    // 区域 change事件
    handleChangArea (val) {
      let newList = []
      for (let i in val) {
        newList.push(val[i][1])
      }
      this.regionCityCodeList = newList
      this.getArea(this.regionCityCodeList)
    },
    // 查询区域
    getArea (areaCodeList) {
      if (areaCodeList.length > 0) {
        this.requestMethodPost('/web/sys/conf/area/getAreaByCityCode', areaCodeList).then(res => {
          const data = res.data
          if (data.code == 1000) {
            const list = data.data
            this.$set(this.ruleForm, 'citysInfos', list)
          }
        }).catch(err => {})
      }
    },

    // 提交
    handleSubmitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('确定提交编辑经销商?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              console.log(122333,this.ruleForm,this.regionCityCodeList)
              var params = new FormData()
              params.append('companyType', '1')
              params.append('companyName', this.ruleForm.companyName)
              params.append('companyNumber', this.ruleForm.companyNumber)
              params.append('companyNameShort', this.ruleForm.companyNameShort || '')
              params.append('taxNumber', this.ruleForm.taxNumber)
              params.append('regionCityCodeList', this.regionCityCodeList)
              params.append('address', this.ruleForm.address || '')
              params.append('custScale', this.ruleForm.custScale || '')
              params.append('file', this.ruleForm.file || null)
              params.append('telephone', this.ruleForm.telephone)
              params.append('status', this.ruleForm.status)
              params.append('picDeleteFlag', this.ruleForm.picDeleteFlag || null)
              console.log(params)
              if(this.ruleForm.citysInfos && this.ruleForm.citysInfos.length>0) {
                this.ruleForm.citysInfos.forEach((item, i) => {
                  params.append(`citysInfos[${i}].areaCode`, item.areaCode)
                  params.append(`citysInfos[${i}].areaName`, item.areaName)
                  params.append(`citysInfos[${i}].cityCode`, item.cityCode)
                  params.append(`citysInfos[${i}].cityName`, item.cityName)
                  params.append(`citysInfos[${i}].provinceCode`, item.provinceCode)
                  params.append(`citysInfos[${i}].provinceName`, item.provinceName)
                })
              }
              
              console.log(params)
              this.requestMethodPost('/web/company/updateCompany', params)
                .then(res => {
                  res = res.data
                  if (res.code == 1000) {
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                    if (this.$route.query.isSaveQuery) {
                      this.$router.push({
                        name: 'DealerProfile',
                        params: { isSaveQuery: true }
                      })
                    } else {
                      history.back()
                    }
                  } else {
                    this.$message({
                      message: res.msg,
                      type: 'warning'
                    })
                  }
                })
                .catch(res => {})
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    // 返回
    handleResetFrom (formName) {
      this.$refs[formName].resetFields()
      if (this.$route.query.isSaveQuery) {
        this.$router.push({
          name: 'DealerProfile',
          params: { isSaveQuery: true }
        })
      } else {
        history.back(-1)
      }
    },
    onResize () {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        160}px`
    },
    unbundling () {
      this.$confirm('小程序用户使用商品模块的必要条件之一，若为空，公司成员商品模块不开放', '提示信息', {
        confirmButtonText: '确认解绑',
        cancelButtonText: '取消',
        customClass: 'deletBtn',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        let params = {
          id: this.accountInfo.id,
          companyNumber: this.$route.query.companyNumber
        }
        this.requestMethodPost('/msla/account/unBindingAccount', params).then(res => {
          if (res.data.code == 1000) {
            this.$message({
              message: '解绑成功',
              type: 'success'
            })
            this.accountInfo = {}
          } else {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            })
          }
        }).catch(res => {
        })
      }).catch(() => {})
    },
    handleUpdate () {
      if (!this.accountInfo.legacyId) {
        this.$message({
          message: '请先输入MSLA  Account',
          type: 'warning'
        })
        return
      }
      let params = {
        legacyId: this.accountInfo.legacyId,
        companyNumber: this.$route.query.companyNumber
      }
      let url = '/msla/account/bindingAccount'
      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: '同步成功',
            type: 'success'
          })
          this.getBindingAccountId()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      }).catch(res => {
      })
    },
    getBindingAccountId () {
      let params = {
        companyNumber: this.$route.query.companyNumber
      }
      this.requestMethodGet('/msla/account/getAccount', params).then(res => {
        if (res.data.code == 1000) {
          this.accountInfo = res.data.data || {}
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      }).catch(res => {
      })
    }
  }
}
</script>
<style lang='less' scoped>
.edit-dealer-profile {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-title {
    font-weight: bold;
    font-size: 16px;
    span {
      font-size: 14px;
      color: #999;
      font-weight: normal;
    }
  }
  &-ruleForm {
    border-bottom: 1px solid #dcdfe6;
  }
  &-btn {
    padding-top: 20px;
  }
}
</style>
<style>
.edit-dealer-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.edit-dealer-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.edit-dealer-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.edit-dealer-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}
.edit-dealer-profile .el-form-item__label {
  color: #999999;
}
.hide .el-upload--picture-card {
  display: none;
}
.deletBtn .el-button--primary {
    background-color:#fe000c !important;
    border-color:#fe000c !important;
}
.deletBtn .el-message-box__container {
    position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
  top: 15px !important;
}
</style>
