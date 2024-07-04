<template>
  <el-card class="supplementary-info" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
      <el-divider direction="vertical"></el-divider>
      <span>{{moduleTitle}}</span>
    </div>
    <el-form :model="supplementaryForm" ref="supplementaryRef" label-position="top" label-width="200px" style="padding:0 20px;">
      <el-row>
        <div v-for="(item,index) in supplementaryForm" :key="index">
          <el-col :span="6">
            <el-form-item :label="item.type == 'string'? '': item.name+'：'" :required="item.required">
              <span v-if="item.type == 'string'"><span v-if="item.required" style="color:red;">* </span>{{item.name}}</span>
              <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start" v-if="item.type == 'string'">
                <el-button type="text" style="color:#333;font-size:15px;padding:0px;">
                  <i class="el-icon-warning-outline"></i> :
                </el-button>
              </el-tooltip>
              <span v-if="item.type == 'string'">{{item.value}}</span>
              <span v-if="item.type == 'string' && !item.value && item.required "  style="color:#dd0000;font-family:MicrosoftYaHei;">暂无，请补充</span>
              <span v-if="item.type == 'string' && !item.value && !item.required "  style="color:#666;font-family:MicrosoftYaHei;">暂无</span>
              <el-input
                v-if="item.type == 'input1' && type == 'edit'"
                placeholder="--请输入--"
                v-model="item.value"
                @change="changeInput"
                :maxlength="item.length"
                style="width:80%"
                size="small"
                clearable>
              </el-input>
              <el-date-picker
                v-if="item.type == 'datepicker2' && type == 'edit'"
                v-model="item.value"
                type="month"
                value-format="yyyy-MM"
                style="width:80%"
                :picker-options="expireTimeOption"
                size="small"
                placeholder="选择月">
              </el-date-picker>
              <el-radio-group v-model="item.value" v-if="type == 'edit' && item.type == 'radio5'" >
                <el-radio v-for="(it,idx) in item.fieldOption" :label="it.value" :key="idx">{{it.option}}</el-radio>
              </el-radio-group>
              <el-input-number
                v-if="item.type == 'input2' && type == 'edit'"
                v-model="item.value"
                controls-position="right"
                size="small"
                style="width:80%"
                @change="handleChange"
                :precision="item.decimalPrecision"
                :min="Math.floor(item.rangeMin)" :max="Math.floor(item.rangeMax)">
              </el-input-number>
              <el-cascader
                v-if="type == 'edit' && item.type == 'dropdown'"
                ref='cascaderRef'
                :options="oilNameList"
                v-model="item.valueCode"
                :key="oilNameKey"
                size="small"
                style="width:80%"
                :show-all-levels="false"
                @change="oilNameChange(item,index,`cascaderRef`)"
                :props="{              value:'oilNumber',              label:'oilName',children:'children'}" clearable>
                </el-cascader>
            </el-form-item>
          </el-col>
          <div >
              <el-col :span="24" v-if="item.type == 'radio5' && item.value == item.children[0].valueCode" v-for="(cylinder,index) in item.children" :key="index">
                <el-form-item :label="cylinder.name+'：'" :required="cylinder.required">
                  <el-date-picker
                    v-if="cylinder.type == 'datepicker3' && type == 'edit'"
                    v-model="cylinder.value"
                    :picker-options="expireTimeOption2"
                    size="small"
                    prefix-icon='el-icon-date'
                    clearable
                    value-format="yyyy-MM-dd"
                    style="width:20%"
                    type="date"
                    placeholder="请选择">
                  </el-date-picker>
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
  props: {
    moduleTitle: {
      type: String,
      default: () => {
        return ''
      }
    },
    deviceDetail: {
      type: Object,
      default: () => {
        return ''
      }
    },
    type: {
      type: String,
      default: () => {
        return ''
      }
    },
    supplementaryObj: {
      type: Array,
      default: () => {
        return []
      }
    },
  },
  data () {
    return {
      expireTimeOption: {
        disabledDate (date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now() - 24 * 60 * 60 * 1000
        }
      },
      expireTimeOption2: {
        disabledDate (date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now()
        }
      },
      uploadUrl: '',
      supplementaryForm: this.supplementaryObj,
      imgDialogVisible: false,
      notShowUploadBtn: false,
      dialogImageUrl: '',
      currentBrandCode: '',
      oilNameKey: 0,
      oilNameList: [],
      tempImagePath: '',
      supplementaryObjOne1:[]
    }
  },
  mounted () {
  },
  created () {
    this.supplementaryForm = this.supplementaryObj
    this.getOilList()
    // 找出dropdown1类型
    this.supplementaryForm.forEach(item => {
      if (item.type == 'dropdown1') {
        this.getDicList(item.nameKey)
      }
    })
  },
  methods: {
   
    // 获取油品下拉
    getOilList () {
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, status:1, size:200, current:1})
        .then(res => {
          res = res.data
          if (res.code == 1000) {
            this.oilNameList = res.data.list
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {})
    },
    changeInput (val) {
      // console.log(this.supplementaryForm)
    },
    // 用油名称改变
    oilNameChange (item) {
      if (item) {
        const data = this.supplementaryForm
        const checkedData = this.$refs.cascaderRef[0].getCheckedNodes()[0]
        let oilNameValueCode = []
        let oilBrandValueCode = item.valueCode[0]
        data.forEach(it => {
          if (it.nameKey == 'lup_current_oil') {
            oilNameValueCode = it.valueCode
          }
        })
        if (oilBrandValueCode == 'oil_0001') { // 美孚
          if (oilNameValueCode.length != 4) {
            this.$message({
              message: '请选择在用油品名称',
              type: 'warning'
            })
            item.valueCode = ''
          } else {
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length - 1]
          }
        } else {
          if (oilNameValueCode.length != 3) {
            this.$message({
              message: '请选择在用油品名称',
              type: 'warning'
            })
            item.valueCode = ''
          } else {
            item.value = checkedData.label
            item.valueCode = checkedData.path[checkedData.path.length - 1]
          }
        }
      }
    },
    // 获取dropdown1类型的dic下拉数据源
    getDicList (key) {
      this.requestMethodGet('/web/common/dic/drops', {name: key}).then(res => {
        res = res.data
        if (res.code == 1000) {
          this.supplementaryForm.forEach(item => {
            if (item.nameKey == key) {
              item.dicList = res.data
            }
          })
        } else {
          this.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 上传前置
    beforeAvatarUpload (file) {
      console.log('file', file)
    },
    // 上传改变
    addFileChange (file, fileList) {
      if (!file.raw.type.startsWith('image')) {
        this.$message.error('只能上传图片类型文件')
        return
      }
      if (fileList.length) {
        this.notShowUploadBtn = true
        let params = new FormData()
        params.append('fileType', 'device')
        params.append('multipartFiles', file.raw)
        this.requestMethodPost('/web/file/uploadFiles', params)
          .then(res => {
            res = res.data
            if (res.code == 1000) {
              this.tempImagePath = res.data[0]
              this.getFullImgPath(res.data[0])
            } else {
              this.notShowUploadBtn = false
              this.$message({
                message: res.msg,
                type: 'warning'
              })
            }
          })
          .catch(res => {
          })
      }
    },
    // 获取全路径赋值imgFullDtoUrl
    getFullImgPath (path) {
      const params = {
        url: path
      }
      this.requestMethodGet('/web/file/getFullUrl', params).then(res => {
        if (res.data.code == 1000) {
          this.supplementaryForm.forEach(item => {
            if (item.nameKey == 'device_img') {
              item.value = path
              item.imgFullDtoUrl = []
              item.imgFullDtoUrl.push({
                name: item.nameKey,
                url: res.data.data
              })
            }
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 删除
    removeFileChange (file, fileList) {
      this.notShowUploadBtn = false
      this.supplementaryForm.forEach(item => {
        if (item.nameKey == 'device_img') {
          item.value = ''
          item.imgFullDtoUrl = []
        }
      })
    },
    // 预览
    handlePictureCardPreview () {
      const params = {
        url: this.tempImagePath
      }
      this.requestMethodGet('/web/file/getFullUrl', params).then(res => {
        if (res.data.code == 1000) {
          this.dialogImageUrl = res.data.data
          this.imgDialogVisible = true
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          })
        }
      })
    },
    // 验证
    validateDevice (formName) {
      const data = this.supplementaryForm
      let radio5EmptyList = []
      let emptyChildList = []
      const emptyList = data.filter(item => {
        return item.required && !item.value
      })
      // 找出radio5类型
      data.forEach(item => {
        if (item.type == 'radio5' && item.value == '1') {
          radio5EmptyList = item.children.filter(it => {
            return it.required && !it.value
          })
        }
      })
      emptyChildList = emptyChildList.concat(emptyList).concat(radio5EmptyList)
      if (emptyChildList.length > 0) {
        this.$message({
          message: emptyChildList[0].name + '必填',
          type: 'warning'
        })
      } else {
        this.$emit('passModulValidate', 'suppleMent')
      }
    }
  }
}
</script>

<style lang='less'>
.supplementary-info{
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
}
</style>
