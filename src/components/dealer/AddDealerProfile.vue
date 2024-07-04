<!--
* @description
* @fileName AddDealerProfile.vue
* @author vvx
* @date 2020/04/13 15:24:14
* @version V1.0.0
!-->
<template>
  <div class="add-dealer-profile" :style="mainminheight">
    <p class="add-dealer-profile-title">公司LOGO <span>建议公司LOGO宽高上传比例为：200*200</span></p>
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
    <p class="add-dealer-profile-title">基本信息</p>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      label-position="top"
      class="add-dealer-profile-ruleForm"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="名称" prop="companyName">
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
          <el-form-item label="税号">
            <span>{{ruleForm.taxNumber || '- -'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规模" prop="custScale">
            <el-select size="small" v-model="ruleForm.custScale" placeholder="--请选择--" style="width:80%;" clearable>
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
          <el-form-item label="区域" prop="city">
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
          <el-form-item label="办公地址">
            <el-input
              size="small"
              placeholder="请输入"
              v-model="ruleForm.address"
              maxlength="100"
              clearable
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
              v-model="ruleForm.telephone"
              maxlength="18"
              clearable
              style="width:80%;"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select
              size="small"
              v-model="ruleForm.status"
              clearable
              disabled
              placeholder="--请选择--"
              style="width:80%;"
            >
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
            <span>{{ruleForm.nowDate}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="danger" @click="handleSubmitForm('ruleForm')" size="small">提交</el-button>
      <el-button type="danger" plain @click="handleResetFrom('ruleForm')" size="small">返回</el-button>
    </div>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from '@/api/api'
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
      } else if (regPhone.test(value) || reg02.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码或座机号码'))
      }
    }
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`, //
      hideUpload: false, // 添加图片是否展示，默认隐藏
      imageList: [], // 图片
      uploadUrl: `${baseRemoteOauth2}/web/company/addCompany`, // 图片上传地址
      // 参数配置
      scaleList: [], // 规模列表
      companyNameList: [], // 公司名称列表
      areaList: [], // 区域
      statusList: [{ value: '1', label: '正常' }], // 状态列表
      // 表单验证
      ruleForm: {
        file: '', // 图片
        companyType: '1', // 公司类型，1：经销商 2，工业客户
        companyName: '',
        companyNameShort: '',
        taxNumber: '',
        custScale: '',
        city: '',
        regionCityCodeList: '',
        address: '',
        telephone: '',
        status: '1'
      },
      loading: false,
      //   表单验证规则
      rules: {
        companyName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        city: [{ required: true, message: '请选择区域', trigger: 'change' }],
        telephone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ]
      }
    }
  },

  components: {},

  computed: {},
  created () {
    this.getAllProvinceAndCityList()// 获取省市数据
  },
  mounted () {
    this.ruleForm.nowDate = this.moment(new Date()).format('YYYY-MM-DD')
    this.scaleList = JSON.parse(this.$route.query.scaleList)
  },

  methods: {
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
      this.imageList.push({ url: file.url })
      this.ruleForm.file = file.raw
    },
    // 删除图片
    handleRemove (fileList) {
      this.ruleForm.file = ''
      this.imageList = []
      setTimeout(() => {
        this.hideUpload = fileList.length >= 1
      }, 500)
    },
    // 提交
    handleSubmitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('确定提交新建经销商?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              var params = new FormData()
              params.append('companyType', '1')
              params.append('companyName', this.ruleForm.companyName)
              params.append('companyNameShort', this.ruleForm.companyNameShort || '')
              params.append('taxNumber', this.ruleForm.taxNumber)
              params.append(
                'regionCityCodeList',
                this.ruleForm.regionCityCodeList
              )
              params.append('address', this.ruleForm.address || '')
              params.append('custScale', this.ruleForm.custScale || '')
              params.append('file', this.ruleForm.file)
              params.append('telephone', this.ruleForm.telephone)
              params.append('status', this.ruleForm.status)
              this.requestMethodPost('/web/company/addCompany', params)
                .then(res => {
                  res = res.data
                  if (res.code == 1000) {
                    this.$message({
                      message: '添加成功',
                      type: 'success'
                    })
                    this.$router.push({
                      path: '/DealerProfile'
                    })
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
      this.$router.push({
        path: '/DealerProfile'
      })
    },
    // 区域 change事件
    handleChangArea (val) {
      let newList = []
      for (let i in val) {
        newList.push(val[i][1])
      }
      this.ruleForm.regionCityCodeList = newList
    },
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
    onResize () {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        160}px`
    }
  }
}
</script>
<style lang='less' scoped>
.add-dealer-profile {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-title {
    font-weight: bold;
    font-size: 16px;
    span{
        font-size: 14px;
        color: #999;
        font-weight:normal;
    }
  }
}
</style>
<style>
.add-dealer-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.add-dealer-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.add-dealer-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.add-dealer-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}

.add-dealer-profile .el-form-item__label {
  color: #999999;
  padding: 0;
}
.hide .el-upload--picture-card {
  display: none;
}
</style>
